import { FANOUT_QUERY_COUNT, MAX_OUTPUT_TOKENS, PROVIDER_ID, REQUEST_RESERVE_MICRO_EUR, ToolError, providerResultSchema } from "./contracts.mjs";

const USD_TO_EUR_ACCOUNTING_RATE = 0.95;
const fanoutJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queries: {
      type: "array",
      minItems: FANOUT_QUERY_COUNT,
      maxItems: FANOUT_QUERY_COUNT,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          query: { type: "string", minLength: 2, maxLength: 160 },
          intent: { type: "string", enum: ["informational", "comparison", "commercial", "transactional", "local", "troubleshooting"] },
          reason: { type: "string", minLength: 4, maxLength: 180 },
        },
        required: ["query", "intent", "reason"],
      },
    },
  },
  required: ["queries"],
};

export class OpenRouterFanoutProvider {
  constructor({ apiKey, fetchImpl = fetch }) { this.apiKey = apiKey; this.fetchImpl = fetchImpl; }
  async generate({ keyword, model, language, country }) {
    const started = Date.now();
    let response;
    try {
      response = await this.fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://ai-fanout.com", "X-Title": "AI Query Fanout" },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          model,
          max_tokens: MAX_OUTPUT_TOKENS,
          temperature: 0.3,
          response_format: { type: "json_schema", json_schema: { name: "fanout_plan", strict: true, schema: fanoutJsonSchema } },
          messages: [
            { role: "system", content: `Create exactly ${FANOUT_QUERY_COUNT} distinct follow-up searches that a research system could use to investigate one keyword. Cover different user needs and avoid near-duplicates. Write queries and reasons in ${language === "de" ? "German" : "English"}. ${country ? `Use ${country} as market context when relevant, without forcing every query to be local.` : "Do not assume a country."} This is a modelled research plan, not a record of hidden provider searches or reasoning.` },
            { role: "user", content: keyword },
          ],
        }),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") throw new ToolError("PROVIDER_TIMEOUT", 504);
      throw new ToolError("PROVIDER_UNAVAILABLE", 502);
    }
    if (!response.ok) throw new ToolError("PROVIDER_UNAVAILABLE", 502);
    const data = await response.json();
    let parsed;
    try {
      const content = data.choices?.[0]?.message?.content;
      const json = typeof content === "string" ? JSON.parse(content) : content;
      parsed = providerResultSchema.parse(json);
    } catch { throw new ToolError("PROVIDER_INVALID_OUTPUT", 502); }
    const inputTokens = Number(data.usage?.prompt_tokens ?? 0);
    const outputTokens = Number(data.usage?.completion_tokens ?? 0);
    const reportedCostUsd = Number(data.usage?.cost ?? data.usage?.total_cost ?? NaN);
    const actualCostMicroEur = Number.isFinite(reportedCostUsd) ? Math.min(REQUEST_RESERVE_MICRO_EUR, Math.max(1, Math.ceil(reportedCostUsd * USD_TO_EUR_ACCOUNTING_RATE * 1_000_000))) : REQUEST_RESERVE_MICRO_EUR;
    return { result: parsed, inputTokens, outputTokens, actualCostMicroEur, latencyMs: Date.now() - started, model, provider: PROVIDER_ID };
  }
}
