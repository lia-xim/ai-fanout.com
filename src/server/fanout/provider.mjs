import { MAX_OUTPUT_TOKENS, MAX_SEARCH_CALLS, MODEL_ID, PROVIDER_ID, REQUEST_RESERVE_MICRO_EUR, ToolError, providerResultSchema } from "./contracts.mjs";

const USD_TO_EUR_ACCOUNTING_RATE = 0.95;

export class OpenRouterObservedQueryProvider {
  constructor({ apiKey, fetchImpl = fetch }) { this.apiKey = apiKey; this.fetchImpl = fetchImpl; }
  async observe({ keyword, language, country }) {
    const started = Date.now();
    let response;
    try {
      response = await this.fetchImpl("https://openrouter.ai/api/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://ai-fanout.com", "X-Title": "AI Fanout" },
        signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({
          model: MODEL_ID,
          store: false,
          max_output_tokens: MAX_OUTPUT_TOKENS,
          max_tool_calls: MAX_SEARCH_CALLS,
          instructions: `Research the supplied topic for a user in language ${language}${country ? ` and country ${country}` : ""}. Use web search from several distinct angles when useful. Do not invent or print a list of searches in the final answer; the application reads only provider-exposed web-search tool actions. Keep the final answer to one short sentence.`,
          input: keyword,
          tools: [{ type: "openrouter:web_search", parameters: { engine: "native", max_uses: MAX_SEARCH_CALLS, max_total_results: 24, ...(country ? { user_location: { type: "approximate", country } } : {}) } }],
        }),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") throw new ToolError("PROVIDER_TIMEOUT", 504);
      throw new ToolError("PROVIDER_UNAVAILABLE", 502);
    }
    if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
    const data = await response.json();
    const observed = extractObservedResult(data);
    if (observed.queries.length === 0) throw new ToolError("PROVIDER_QUERY_TRACE_UNAVAILABLE", 502);
    let parsed;
    try { parsed = providerResultSchema.parse(observed); } catch { throw new ToolError("PROVIDER_INVALID_OUTPUT", 502); }
    const inputTokens = Number(data.usage?.input_tokens ?? data.usage?.prompt_tokens ?? 0);
    const outputTokens = Number(data.usage?.output_tokens ?? data.usage?.completion_tokens ?? 0);
    const reportedCostUsd = Number(data.usage?.cost ?? data.usage?.total_cost ?? NaN);
    const actualCostMicroEur = Number.isFinite(reportedCostUsd) ? Math.min(REQUEST_RESERVE_MICRO_EUR, Math.max(1, Math.ceil(reportedCostUsd * USD_TO_EUR_ACCOUNTING_RATE * 1_000_000))) : REQUEST_RESERVE_MICRO_EUR;
    return { result: parsed, inputTokens, outputTokens, actualCostMicroEur, latencyMs: Date.now() - started, model: String(data.model ?? MODEL_ID), provider: PROVIDER_ID };
  }
}

export function extractObservedResult(data) {
  const queries = [], sources = [], querySeen = new Set(), sourceSeen = new Set();
  const addQuery = (value, callId) => { if (typeof value !== "string") return; const query = value.trim(); const key = query.toLocaleLowerCase(); if (!query || querySeen.has(key)) return; querySeen.add(key); queries.push({ query, ...(callId ? { callId: String(callId) } : {}) }); };
  const addSource = (value, title) => { if (typeof value !== "string" || !/^https?:\/\//i.test(value) || sourceSeen.has(value)) return; sourceSeen.add(value); sources.push({ url: value, ...(typeof title === "string" && title.trim() ? { title: title.trim() } : {}) }); };
  const walk = (node, callId) => {
    if (!node || typeof node !== "object") return;
    const nextCallId = node.id ?? node.call_id ?? node.tool_use_id ?? callId;
    const isSearchAction = node.type === "web_search_call" || node.type === "server_tool_use" && node.name === "web_search" || node.type === "google_search_call";
    if (isSearchAction) {
      addQuery(node.query, nextCallId); addQuery(node.action?.query, nextCallId); addQuery(node.input?.query, nextCallId);
      for (const query of node.queries ?? node.action?.queries ?? node.arguments?.queries ?? []) addQuery(query, nextCallId);
    }
    if (node.type === "url_citation" || node.url_citation) addSource(node.url ?? node.url_citation?.url, node.title ?? node.url_citation?.title);
    if (node.type === "web_search_result") addSource(node.url, node.title);
    for (const source of node.action?.sources ?? node.sources ?? []) addSource(source.url ?? source, source.title);
    for (const value of Object.values(node)) { if (Array.isArray(value)) for (const child of value) walk(child, nextCallId); else if (value && typeof value === "object") walk(value, nextCallId); }
  };
  walk(data);
  const reportedCount = Number(data?.usage?.server_tool_use?.web_search_requests ?? queries.length);
  return { queries: queries.slice(0, MAX_SEARCH_CALLS), sources: sources.slice(0, 40), searchCallCount: Math.min(MAX_SEARCH_CALLS, Math.max(queries.length, Number.isFinite(reportedCount) ? reportedCount : 0)) };
}
