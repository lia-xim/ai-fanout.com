import { createHmac, randomUUID } from "node:crypto";
import { METHOD_VERSION, MODEL_ID, PROVIDER_ID, TOOL_VERSION, ToolError, requestSchema, validateKeyword } from "./contracts.mjs";

export function keyedHash(secret, value) { return createHmac("sha256", secret).update(value).digest("hex"); }
export async function verifyTurnstile({ token, secret, remoteIp, expectedAction, expectedHostnames, fetchImpl = fetch }) {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048 || !expectedAction || !(expectedHostnames instanceof Set) || expectedHostnames.size === 0) {
    throw new ToolError("CAPTCHA_FAILED", 403);
  }
  let response;
  try { response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? "" }), signal: AbortSignal.timeout(5000) }); }
  catch { throw new ToolError("CAPTCHA_UNAVAILABLE", 503); }
  if (!response.ok) throw new ToolError("CAPTCHA_FAILED", 403);
  const result = await response.json();
  if (!result.success || result.action !== expectedAction || !expectedHostnames.has(result.hostname)) throw new ToolError("CAPTCHA_FAILED", 403);
}
export function createObservedQueryService({ ledger, provider, captchaVerifier, bucketSalt, now = () => new Date() }) {
  return async function run({ body, remoteIp = "unknown" }) {
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) throw new ToolError("INVALID_REQUEST", 400);
    const keyword = validateKeyword(parsed.data.keyword);
    await captchaVerifier(parsed.data.turnstileToken, remoteIp);
    const bucketHash = keyedHash(bucketSalt, remoteIp);
    const questionHash = keyedHash(bucketSalt, `${keyword}|${parsed.data.language}|${parsed.data.country}`);
    const reservationId = randomUUID();
    await ledger.reserve({ bucketHash, reservationId, questionHash, model: MODEL_ID, plannerVersion: TOOL_VERSION });
    try {
      const observed = await provider.observe({ keyword, language: parsed.data.language, country: parsed.data.country });
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: observed.actualCostMicroEur, status: "completed", inputTokens: observed.inputTokens, outputTokens: observed.outputTokens, latencyMs: observed.latencyMs });
      return { keyword, language: parsed.data.language, country: parsed.data.country || null, queries: observed.result.queries, sources: observed.result.sources, searchCallCount: observed.result.searchCallCount, modelId: observed.model || MODEL_ID, providerId: observed.provider || PROVIDER_ID, toolVersion: TOOL_VERSION, methodVersion: METHOD_VERSION, observedAt: now().toISOString(), evidenceStatus: "provider_exposed_search_actions", notice: "This shows search actions exposed by this API run. It does not reveal chain of thought, private retrieval traces, or what the ChatGPT website would do." };
    } catch (error) {
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: 0, status: error?.code === "PROVIDER_TIMEOUT" ? "timeout" : "failed" });
      throw error;
    }
  };
}
