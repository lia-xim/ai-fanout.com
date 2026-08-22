import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { METHOD_VERSION, MODEL_ID, PLANNER_VERSION, PlannerError, requestSchema, validateQuestion } from "./contracts.mjs";

export function keyedHash(secret, value) { return createHmac("sha256", secret).update(value).digest("hex"); }

export async function verifyTurnstile({ token, secret, remoteIp, fetchImpl = fetch }) {
  let response;
  try { response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? "" }), signal: AbortSignal.timeout(5000) }); }
  catch { throw new PlannerError("CAPTCHA_UNAVAILABLE", 503); }
  if (!response.ok || !(await response.json()).success) throw new PlannerError("CAPTCHA_FAILED", 403);
}

export function createPlannerService({ ledger, provider, captchaVerifier, bucketSalt, now = () => new Date() }) {
  return async function run({ body, remoteIp = "unknown", deviceId }) {
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) throw new PlannerError("INVALID_REQUEST", 400);
    const question = validateQuestion(parsed.data.question);
    await captchaVerifier(parsed.data.turnstileToken, remoteIp);
    const safeDeviceId = deviceId || randomBytes(16).toString("hex");
    const bucketHash = keyedHash(bucketSalt, `${remoteIp}|${safeDeviceId}`);
    const questionHash = keyedHash(bucketSalt, question);
    const reservationId = randomUUID();
    await ledger.reserve({ bucketHash, reservationId, questionHash, model: MODEL_ID, plannerVersion: PLANNER_VERSION });
    try {
      const result = await provider.generate(question);
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: result.actualCostMicroEur, status: "completed", inputTokens: result.inputTokens, outputTokens: result.outputTokens, latencyMs: result.latencyMs });
      return { data: { question, ...result.plan, modelId: MODEL_ID, plannerVersion: PLANNER_VERSION, methodVersion: METHOD_VERSION, generatedAt: now().toISOString(), notice: "Planner-generated hypotheses — not internal queries, retrieval traces, or model reasoning." }, deviceId: safeDeviceId };
    } catch (error) {
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: 0, status: error?.code === "PROVIDER_TIMEOUT" ? "timeout" : "failed" });
      throw error;
    }
  };
}
