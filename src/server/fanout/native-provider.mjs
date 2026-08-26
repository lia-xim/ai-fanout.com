import { MAX_NATIVE_SEARCHES, NATIVE_RESERVE_MICRO_EUR } from "./native-contracts.mjs";
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
      const response = await this.fetchImpl("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" }, signal: timeoutSignal(), body: JSON.stringify({ model: this.model, input: protocolInput(input), tools: [{ type: "web_search" }], tool_choice: "required", max_tool_calls: MAX_NATIVE_SEARCHES, max_output_tokens: 500, reasoning: { effort: "none" }, include: ["web_search_call.action.sources"], store: false }) });
      if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
      const data = await response.json();
      const searchCalls = (data.output ?? []).filter((item) => item?.type === "web_search_call");
      const queries = cleanQueries(searchCalls.map((item) => item.action?.queries ?? item.action?.query ?? []));
      const sourceValues = searchCalls.map((item) => item.action?.sources ?? []);
      for (const item of data.output ?? []) for (const block of item?.content ?? []) for (const annotation of block?.annotations ?? []) if (annotation?.type === "url_citation") sourceValues.push(annotation);
      return { queries, sources: cleanSources(sourceValues), searchActionCount: searchCalls.length, model: data.model ?? this.model, provider: "openai", inputTokens: Number(data.usage?.input_tokens ?? 0), outputTokens: Number(data.usage?.output_tokens ?? 0), actualCostMicroEur: NATIVE_RESERVE_MICRO_EUR, latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}

export class GeminiNativeProvider {
  constructor({ apiKey, model = "gemini-3.7-flash", fetchImpl = fetch }) { this.apiKey = apiKey; this.model = model; this.fetchImpl = fetchImpl; }
  async observe(input) {
    const started = Date.now();
    try {
      const response = await this.fetchImpl("https://generativelanguage.googleapis.com/v1beta/interactions", { method: "POST", headers: { "x-goog-api-key": this.apiKey, "Content-Type": "application/json" }, signal: timeoutSignal(), body: JSON.stringify({ model: this.model, input: protocolInput(input), tools: [{ type: "google_search" }], generation_config: { max_output_tokens: 500 } }) });
      if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
      const data = await response.json();
      const searchCalls = (data.steps ?? []).filter((step) => step?.type === "google_search_call");
      const queries = cleanQueries(searchCalls.map((step) => step.arguments?.queries ?? []));
      const sourceValues = [];
      for (const step of data.steps ?? []) if (step?.type === "model_output") for (const block of step.content ?? []) for (const annotation of block.annotations ?? []) if (annotation?.type === "url_citation") sourceValues.push(annotation);
      return { queries, sources: cleanSources(sourceValues), searchActionCount: searchCalls.length, model: data.model ?? this.model, provider: "gemini", inputTokens: Number(data.usage?.total_input_tokens ?? 0), outputTokens: Number(data.usage?.total_output_tokens ?? 0), actualCostMicroEur: NATIVE_RESERVE_MICRO_EUR, latencyMs: Date.now() - started };
    } catch (error) { providerFailure(error); }
  }
}
