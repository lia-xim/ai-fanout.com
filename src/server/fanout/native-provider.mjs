import { MAX_NATIVE_SEARCHES, NATIVE_MAX_OUTPUT_TOKENS, NATIVE_MODEL_IDS } from "./native-contracts.mjs";
import { ToolError } from "./contracts.mjs";

const timeoutSignal = () => AbortSignal.timeout(20_000);
const protocolInput = ({ keyword, language, country }) =>
  `Use web search to answer this topic: ${keyword}\nRespond in ${language === "de" ? "German" : "English"}.${country ? ` Use ${country} as market context when relevant.` : " Do not assume a country."} Search naturally. Use no more than ${MAX_NATIVE_SEARCHES} search queries. Keep the final answer brief.`;

function cleanQueries(values) {
  const seen = new Set();
  return values.flat().filter((value) => typeof value === "string").map((value) => value.normalize("NFC").trim()).filter((value) => value.length >= 2 && value.length <= 240 && !seen.has(value.toLowerCase()) && seen.add(value.toLowerCase())).slice(0, MAX_NATIVE_SEARCHES);
}
function cleanSources(values) {
  const seen = new Set();
  return values.flat().filter(Boolean).map((value) => ({ url: String(value.url ?? ""), title: String(value.title ?? "").slice(0, 160) })).filter((value) => { try { const url = new URL(value.url); return ["http:", "https:"].includes(url.protocol) && !seen.has(value.url) && seen.add(value.url); } catch { return false; } }).slice(0, 20);
}
function cleanSearchActions(values) {
  return values.map((value, index) => {
    const queries = cleanQueries([value?.queries ?? value?.query ?? []]);
    const sources = cleanSources([value?.sources ?? []]);
    return {
      id: String(value?.id ?? `search-${String(index + 1).padStart(2, "0")}`),
      queries,
      sources,
      sourceScope: queries.length === 1 && sources.length ? "exact_query" : queries.length && sources.length ? "search_action" : "not_exposed",
    };
  }).filter((value) => value.queries.length || value.sources.length);
}

export function estimateNativeUsage({ provider, inputTokens, outputTokens, searchActionCount, searchQueryCount, now = new Date() }) {
  const checkedAt = "2026-10-10";
  if (provider === "openai" || provider === "anthropic") {
    const longHaikuPrompt = provider === "anthropic" && inputTokens > 100_000;
    const tokenUsd = (inputTokens * (longHaikuPrompt ? 0.5 : 0.1) + outputTokens * (longHaikuPrompt ? 2.5 : 0.5)) / 1_000_000;
    return {
      inputTokens,
      outputTokens,
      searchActionCount,
      searchQueryCount,
      estimatedCostUsd: Number((tokenUsd + searchActionCount * 0.01).toFixed(6)),
      estimateKind: "list_price_estimate",
      pricingCheckedAt: checkedAt,
      pricingBasis: `${provider === "anthropic" ? "Claude Haiku 5.5 via OpenRouter" : "GPT-6 Luna"}: ${longHaikuPrompt ? "$0.50/M input, $2.50/M output (prompt over 100k tokens)" : "$0.10/M input, $0.50/M output"}; native web search: $0.01/call. Search-content tokens are included in provider-reported input.`,
    };
  }
  const afterIntroductoryPricing = now >= new Date("2027-01-01T00:00:00Z");
  const inputRate = afterIntroductoryPricing ? 1.5 : 0.75;
  const outputRate = afterIntroductoryPricing ? 7.5 : 3.75;
  const tokenUsd = (inputTokens * inputRate + outputTokens * outputRate) / 1_000_000;
  return {
    inputTokens,
    outputTokens,
    searchActionCount,
    searchQueryCount,
    estimatedCostUsd: Number(tokenUsd.toFixed(6)),
    estimatedCostUsdMaximum: Number((tokenUsd + searchQueryCount * 0.014).toFixed(6)),
    estimateKind: "list_price_range",
    pricingCheckedAt: checkedAt,
    pricingBasis: `Gemini 3.8 Flash: $${inputRate.toFixed(2)}/M input, $${outputRate.toFixed(2)}/M output ${afterIntroductoryPricing ? "from 2027-01-01" : "through 2026-12-31"}; Search has a shared 5,000-query monthly allowance, then $0.014/query. The range reflects unknown remaining allowance.`,
  };
}
function providerFailure(error) {
  if (error instanceof ToolError) throw error;
  if (error?.name === "TimeoutError" || error?.name === "AbortError") throw new ToolError("PROVIDER_TIMEOUT", 504);
  throw new ToolError("PROVIDER_UNAVAILABLE", 502);
}

export class OpenAINativeProvider {
  constructor({ apiKey, model = NATIVE_MODEL_IDS.openai, fetchImpl = fetch }) { if (model !== NATIVE_MODEL_IDS.openai) throw new ToolError("PROVIDER_NOT_CONFIGURED", 503); this.apiKey = apiKey; this.model = model; this.fetchImpl = fetchImpl; }
  async observe(input) {
    const started = Date.now();
    try {
      const response = await this.fetchImpl("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" }, signal: timeoutSignal(), body: JSON.stringify({ model: this.model, input: protocolInput(input), tools: [{ type: "web_search", search_context_size: "low" }], tool_choice: "required", max_tool_calls: MAX_NATIVE_SEARCHES, max_output_tokens: NATIVE_MAX_OUTPUT_TOKENS, reasoning: { effort: "none" }, include: ["web_search_call.action.sources"], store: false }) });
      if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
      const data = await response.json();
      const searchCalls = (data.output ?? []).filter((item) => item?.type === "web_search_call");
      if (data.status === "incomplete" && searchCalls.length === 0) throw new ToolError("PROVIDER_INCOMPLETE", 502);
      const searchActions = cleanSearchActions(searchCalls.map((item) => ({ id: item.id, ...item.action })));
      const queries = cleanQueries(searchActions.map((item) => item.queries));
      const sourceValues = searchCalls.map((item) => item.action?.sources ?? []);
      for (const item of data.output ?? []) for (const block of item?.content ?? []) for (const annotation of block?.annotations ?? []) if (annotation?.type === "url_citation") sourceValues.push(annotation);
      const inputTokens = Number(data.usage?.input_tokens ?? 0), outputTokens = Number(data.usage?.output_tokens ?? 0);
      return { queries, sources: cleanSources(sourceValues), searchActions, searchActionCount: searchCalls.length, providerResponseStatus: data.status ?? "completed", model: data.model ?? this.model, provider: "openai", inputTokens, outputTokens, usage: estimateNativeUsage({ provider: "openai", inputTokens, outputTokens, searchActionCount: searchCalls.length, searchQueryCount: queries.length }), latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}

export class GeminiNativeProvider {
  constructor({ apiKey, model = NATIVE_MODEL_IDS.gemini, fetchImpl = fetch }) { if (model !== NATIVE_MODEL_IDS.gemini) throw new ToolError("PROVIDER_NOT_CONFIGURED", 503); this.apiKey = apiKey; this.model = model; this.fetchImpl = fetchImpl; }
  async observe(input) {
    const started = Date.now();
    try {
      const response = await this.fetchImpl("https://generativelanguage.googleapis.com/v1beta/interactions", { method: "POST", headers: { "x-goog-api-key": this.apiKey, "Content-Type": "application/json" }, signal: timeoutSignal(), body: JSON.stringify({ model: this.model, input: protocolInput(input), tools: [{ type: "google_search" }], generation_config: { max_output_tokens: NATIVE_MAX_OUTPUT_TOKENS }, store: false }) });
      if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
      const data = await response.json();
      const searchCalls = (data.steps ?? []).filter((step) => step?.type === "google_search_call");
      const searchActions = cleanSearchActions(searchCalls.map((step, index) => ({ id: step.id ?? `search-${String(index + 1).padStart(2, "0")}`, queries: step.arguments?.queries ?? [] })));
      const queries = cleanQueries(searchActions.map((item) => item.queries));
      const sourceValues = [];
      for (const step of data.steps ?? []) if (step?.type === "model_output") for (const block of step.content ?? []) for (const annotation of block.annotations ?? []) if (annotation?.type === "url_citation") sourceValues.push(annotation);
      const inputTokens = Number(data.usage?.total_input_tokens ?? 0), outputTokens = Number(data.usage?.total_output_tokens ?? 0);
      return { queries, sources: cleanSources(sourceValues), searchActions, searchActionCount: searchCalls.length, model: data.model ?? this.model, provider: "gemini", inputTokens, outputTokens, usage: estimateNativeUsage({ provider: "gemini", inputTokens, outputTokens, searchActionCount: searchCalls.length, searchQueryCount: queries.length }), latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}

export class OpenRouterAnthropicNativeProvider {
  constructor({ apiKey, fetchImpl = fetch }) { this.apiKey = apiKey; this.fetchImpl = fetchImpl; }
  async observe(input) {
    const started = Date.now();
    try {
      const response = await this.fetchImpl("https://openrouter.ai/api/v1/messages", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://ai-fanout.com", "X-Title": "AI Query Fanout" },
        signal: timeoutSignal(),
        body: JSON.stringify({
          model: NATIVE_MODEL_IDS.anthropic,
          max_tokens: NATIVE_MAX_OUTPUT_TOKENS,
          thinking: { type: "disabled" },
          messages: [{ role: "user", content: protocolInput(input) }],
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: MAX_NATIVE_SEARCHES }],
          tool_choice: { type: "tool", name: "web_search" },
          provider: { only: ["Anthropic"], allow_fallbacks: false },
        }),
      });
      if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
      const data = await response.json();
      if (!Array.isArray(data.content)) throw new ToolError("PROVIDER_INVALID_OUTPUT", 502);
      if (["pause_turn", "tool_use"].includes(data.stop_reason)) throw new ToolError("PROVIDER_INCOMPLETE", 502);
      const calls = data.content.filter(block => block?.type === "server_tool_use" && block.name === "web_search");
      const results = data.content.filter(block => block?.type === "web_search_tool_result");
      if (results.some(block => block.content?.type === "web_search_tool_result_error")) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
      // Link sources only through the exact provider-issued tool-use ID.
      const actions = calls.map(call => {
        const matching = results.filter(block => typeof call.id === "string" && block.tool_use_id === call.id && Array.isArray(block.content));
        return { id: call.id, queries: matching.length ? [call.input?.query] : [], sources: matching.flatMap(block => block.content.filter(item => item?.type === "web_search_result")) };
      });
      if (calls.length && actions.some(action => !action.queries.length)) throw new ToolError("PROVIDER_INCOMPLETE", 502);
      const searchActions = cleanSearchActions(actions);
      if (data.stop_reason === "max_tokens" && !searchActions.length) throw new ToolError("PROVIDER_INCOMPLETE", 502);
      const queries = cleanQueries(searchActions.map(action => action.queries));
      const sources = cleanSources([
        results.flatMap(block => Array.isArray(block.content) ? block.content.filter(item => item?.type === "web_search_result") : []),
        data.content.flatMap(block => (block.citations ?? []).filter(citation => citation?.type === "web_search_result_location")),
      ]);
      const inputTokens = Number(data.usage?.input_tokens ?? 0), outputTokens = Number(data.usage?.output_tokens ?? 0);
      const searchActionCount = calls.length;
      const chargedSearchCount = Number(data.usage?.server_tool_use?.web_search_requests ?? searchActionCount);
      return { queries, sources, searchActions, searchActionCount, providerResponseStatus: data.stop_reason === "max_tokens" ? "incomplete" : "completed", model: data.model ?? NATIVE_MODEL_IDS.anthropic, provider: "anthropic", inputTokens, outputTokens, usage: estimateNativeUsage({ provider: "anthropic", inputTokens, outputTokens, searchActionCount: chargedSearchCount, searchQueryCount: queries.length }), latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}
