import { MAX_NATIVE_SEARCHES, NATIVE_MAX_OUTPUT_TOKENS } from "./native-contracts.mjs";
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

function estimateUsage({ provider, inputTokens, outputTokens, searchActionCount, searchQueryCount }) {
  const checkedAt = "2026-08-27";
  if (provider === "openai") {
    const tokenUsd = (inputTokens * 0.2 + outputTokens * 1.2) / 1_000_000;
    return {
      inputTokens,
      outputTokens,
      searchActionCount,
      searchQueryCount,
      estimatedCostUsd: Number((tokenUsd + searchActionCount * 0.01).toFixed(6)),
      estimateKind: "list_price_estimate",
      pricingCheckedAt: checkedAt,
      pricingBasis: "GPT-5.6 Luna: $0.20/M input, $1.20/M output; web search: $0.01/run.",
    };
  }
  const tokenUsd = (inputTokens * 0.75 + outputTokens * 3.75) / 1_000_000;
  return {
    inputTokens,
    outputTokens,
    searchActionCount,
    searchQueryCount,
    estimatedCostUsd: Number(tokenUsd.toFixed(6)),
    estimatedCostUsdMaximum: Number((tokenUsd + searchQueryCount * 0.014).toFixed(6)),
    estimateKind: "list_price_range",
    pricingCheckedAt: checkedAt,
    pricingBasis: "Gemini 3.7 Flash: $0.75/M input, $3.75/M output through 2026; Search has a 5,000-query monthly allowance, then $0.014/query.",
  };
}
function providerFailure(error) {
  if (error instanceof ToolError) throw error;
  if (error?.name === "TimeoutError" || error?.name === "AbortError") throw new ToolError("PROVIDER_TIMEOUT", 504);
  throw new ToolError("PROVIDER_UNAVAILABLE", 502);
}

export class OpenAINativeProvider {
  constructor({ apiKey, model = "gpt-5.6-luna", fetchImpl = fetch }) { this.apiKey = apiKey; this.model = model; this.fetchImpl = fetchImpl; }
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
      return { queries, sources: cleanSources(sourceValues), searchActions, searchActionCount: searchCalls.length, providerResponseStatus: data.status ?? "completed", model: data.model ?? this.model, provider: "openai", inputTokens, outputTokens, usage: estimateUsage({ provider: "openai", inputTokens, outputTokens, searchActionCount: searchCalls.length, searchQueryCount: queries.length }), latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}

export class GeminiNativeProvider {
  constructor({ apiKey, model = "gemini-3.7-flash", fetchImpl = fetch }) { this.apiKey = apiKey; this.model = model; this.fetchImpl = fetchImpl; }
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
      return { queries, sources: cleanSources(sourceValues), searchActions, searchActionCount: searchCalls.length, model: data.model ?? this.model, provider: "gemini", inputTokens, outputTokens, usage: estimateUsage({ provider: "gemini", inputTokens, outputTokens, searchActionCount: searchCalls.length, searchQueryCount: queries.length }), latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}
