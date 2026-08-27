import { createHmac, randomUUID } from "node:crypto";
import { NATIVE_METHOD_VERSION, NATIVE_RESERVE_MICRO_EUR, NATIVE_TOOL_VERSION, validateNativeRequest } from "./native-contracts.mjs";

const hash = (secret, value) => createHmac("sha256", secret).update(value).digest("hex");

export function createNativeFanoutService({ ledger, providers, captchaVerifier, bucketSalt, now = () => new Date() }) {
  return async ({ body, remoteIp = "unknown" }) => {
    const input = validateNativeRequest(body);
    await captchaVerifier(input.turnstileToken, remoteIp);
    const provider = providers[input.provider];
    if (!provider) throw new Error("PROVIDER_NOT_CONFIGURED");
    const bucketHash = hash(bucketSalt, `native|${remoteIp}`);
    const reservationId = randomUUID();
    const reservation = await ledger.reserve({ bucketHash, reservationId, questionHash: hash(bucketSalt, `${input.keyword}|${input.provider}|${input.language}|${input.country}`), model: input.provider, plannerVersion: NATIVE_TOOL_VERSION });
    try {
      const observed = await provider.observe(input);
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: NATIVE_RESERVE_MICRO_EUR, status: "completed", inputTokens: observed.inputTokens, outputTokens: observed.outputTokens, latencyMs: observed.latencyMs });
      return { keyword: input.keyword, language: input.language, country: input.country || null, queries: observed.queries, sources: observed.sources, searchActionCount: observed.searchActionCount, modelId: observed.model, providerId: observed.provider, toolVersion: NATIVE_TOOL_VERSION, methodVersion: NATIVE_METHOD_VERSION, generatedAt: now().toISOString(), evidenceStatus: "provider_exposed_native_search", notice: "Queries exposed by this provider API run under the published protocol. They are not a capture of the consumer ChatGPT or Gemini interface.", quota: reservation.quota };
    } catch (error) {
      await ledger.settle({ bucketHash, reservationId, actualCostMicroEur: 0, status: error?.code === "PROVIDER_TIMEOUT" ? "timeout" : "failed" });
      throw error;
    }
  };
}
