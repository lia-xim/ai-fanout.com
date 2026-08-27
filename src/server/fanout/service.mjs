import { createHmac, randomUUID } from "node:crypto";
import { METHOD_VERSION, PROVIDER_ID, TOOL_VERSION, ToolError, requestSchema, validateKeyword } from "./contracts.mjs";

export function keyedHash(secret, value) { return createHmac("sha256", secret).update(value).digest("hex"); }
export async function verifyTurnstile({ token, secret, remoteIp, expectedAction, expectedHostnames, fetchImpl = fetch }) {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048 || !expectedAction || !(expectedHostnames instanceof Set) || expectedHostnames.size === 0) throw new ToolError("CAPTCHA_FAILED", 403);
  let response;
  try { response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? "" }), signal: AbortSignal.timeout(5000) }); }
  catch { throw new ToolError("CAPTCHA_UNAVAILABLE", 503); }
  if (!response.ok) throw new ToolError("CAPTCHA_FAILED", 403);
  const result = await response.json();
  if (!result.success || result.action !== expectedAction || !expectedHostnames.has(result.hostname)) throw new ToolError("CAPTCHA_FAILED", 403);
}

export function createFanoutService({ ledger, provider, captchaVerifier, bucketSalt, now = () => new Date() }) {
  return async function run({ body, remoteIp = "unknown" }) {
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) throw new ToolError("INVALID_REQUEST", 400);
    const keyword = validateKeyword(parsed.data.keyword);
    await captchaVerifier(parsed.data.turnstileToken, remoteIp);
    const bucketHash = keyedHash(bucketSalt, remoteIp);
    const questionHash = keyedHash(bucketSalt, `${keyword}|${parsed.data.model}|${parsed.data.language}|${parsed.data.country}`);
    const reservationId = randomUUID();
    const reservation = await ledger.reserve({ bucketHash, reservationId, questionHash, model: parsed.data.model, plannerVersion: TOOL_VERSION });
    try {
      const generated = await provider.generate({ keyword, model: parsed.data.model, language: parsed.data.language, country: parsed.data.country });
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: generated.actualCostMicroEur, status: "completed", inputTokens: generated.inputTokens, outputTokens: generated.outputTokens, latencyMs: generated.latencyMs });
      return { keyword, language: parsed.data.language, country: parsed.data.country || null, queries: generated.result.queries, modelId: generated.model, providerId: generated.provider || PROVIDER_ID, toolVersion: TOOL_VERSION, methodVersion: METHOD_VERSION, generatedAt: now().toISOString(), evidenceStatus: "modelled_fanout", notice: "A modelled research plan from the selected model — not hidden provider queries, retrieval traces, or chain of thought.", quota: reservation.quota };
    } catch (error) {
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: 0, status: error?.code === "PROVIDER_TIMEOUT" ? "timeout" : "failed" });
      throw error;
    }
  };
}
