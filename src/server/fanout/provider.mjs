import { MAX_OUTPUT_TOKENS, MODEL_ID, PlannerError, planSchema, providerJsonSchema } from "./contracts.mjs";

const INPUT_USD_PER_M = 0.20;
const OUTPUT_USD_PER_M = 1.25;
const USD_TO_EUR_RESERVE_RATE = 1;

export class OpenAIPlannerProvider {
  constructor({ apiKey, fetchImpl = fetch }) { this.apiKey = apiKey; this.fetchImpl = fetchImpl; }
  async generate(question) {
    const started = Date.now();
    let response;
    try {
      response = await this.fetchImpl("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({
          model: MODEL_ID,
          store: false,
          max_output_tokens: MAX_OUTPUT_TOKENS,
          reasoning: { effort: "none" },
          text: { verbosity: "low", format: { type: "json_schema", name: "fanout_plan", strict: true, schema: providerJsonSchema } },
          instructions: "Generate a plausible research and content-planning fanout for the user's short question. Return 4 to 8 distinct useful branches. These are planner hypotheses, never hidden provider queries, retrieval traces, or chain of thought. Do not claim that any search engine or assistant used them. Keep rationale concise and describe only the user-facing reason for each branch.",
          input: question,
        }),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") throw new PlannerError("PROVIDER_TIMEOUT", 504);
      throw new PlannerError("PROVIDER_UNAVAILABLE", 502);
    }
    if (!response.ok) throw new PlannerError("PROVIDER_UNAVAILABLE", 502);
    const data = await response.json();
    const outputText = data.output?.flatMap((item) => item.content ?? []).find((content) => content.type === "output_text")?.text;
    if (!outputText) throw new PlannerError("PROVIDER_INVALID_OUTPUT", 502);
    let parsed;
    try { parsed = planSchema.parse(JSON.parse(outputText)); } catch { throw new PlannerError("PROVIDER_INVALID_OUTPUT", 502); }
    const inputTokens = Number(data.usage?.input_tokens ?? 0);
    const outputTokens = Number(data.usage?.output_tokens ?? 0);
    const actualCostMicroEur = Math.ceil(((inputTokens * INPUT_USD_PER_M + outputTokens * OUTPUT_USD_PER_M) * USD_TO_EUR_RESERVE_RATE));
    return { plan: parsed, inputTokens, outputTokens, actualCostMicroEur, latencyMs: Date.now() - started, model: data.model === MODEL_ID ? data.model : MODEL_ID };
  }
}
