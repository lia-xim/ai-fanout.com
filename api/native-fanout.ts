import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ToolError } from "../src/server/fanout/contracts.mjs";
import { NATIVE_RESERVE_MICRO_EUR, NATIVE_TOOL_VERSION } from "../src/server/fanout/native-contracts.mjs";
import { GeminiNativeProvider, OpenAINativeProvider } from "../src/server/fanout/native-provider.mjs";
import { createNativeFanoutService } from "../src/server/fanout/native-service.mjs";
import { RedisQuotaLedger } from "../src/server/fanout/quota.mjs";
import { allowedRequestOrigins, expectedTurnstileHostnames } from "../src/server/fanout/request-origin.mjs";
import { verifyTurnstile } from "../src/server/fanout/service.mjs";

const sharedRequired = ["TURNSTILE_SECRET_KEY", "TURNSTILE_HOSTNAMES", "FANOUT_BUCKET_SALT", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] as const;
const allowedOrigins = allowedRequestOrigins();
const headers = { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  const requestId = crypto.randomUUID();
  try {
    if (req.method !== "POST") throw new ToolError("METHOD_NOT_ALLOWED", 405);
    if (process.env.NATIVE_FANOUT_PUBLIC_ENABLED !== "true" || sharedRequired.some((name) => !process.env[name])) throw new ToolError("TOOL_NOT_CONFIGURED", 503);
    const origin = String(req.headers.origin ?? "");
    if (!allowedOrigins.has(origin)) throw new ToolError("ORIGIN_NOT_ALLOWED", 403);
    const providers: Record<string, unknown> = {};
    if (process.env.OPENAI_API_KEY) providers.openai = new OpenAINativeProvider({ apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_NATIVE_MODEL || "gpt-5.6-luna" });
    if (process.env.GEMINI_API_KEY) providers.gemini = new GeminiNativeProvider({ apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_NATIVE_MODEL || "gemini-3.7-flash" });
    const requestedProvider = String(req.body?.provider ?? "");
    if (!providers[requestedProvider]) throw new ToolError("PROVIDER_NOT_CONFIGURED", 503);
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown").split(",")[0].trim();
    const expectedHostnames = expectedTurnstileHostnames(process.env.TURNSTILE_HOSTNAMES);
    const service = createNativeFanoutService({ ledger: new RedisQuotaLedger({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN!, reserveMicroEur: NATIVE_RESERVE_MICRO_EUR }), providers, bucketSalt: process.env.FANOUT_BUCKET_SALT!, captchaVerifier: (token: string, remoteIp: string) => verifyTurnstile({ token, remoteIp, secret: process.env.TURNSTILE_SECRET_KEY!, expectedAction: "fanout", expectedHostnames }) });
    return res.status(200).json({ ok: true, requestId, data: await service({ body: req.body, remoteIp: ip }) });
  } catch (error) {
    const status = error instanceof ToolError ? error.status : 500;
    const code = error instanceof ToolError ? error.code : "INTERNAL_ERROR";
    if (status === 405) res.setHeader("Allow", "POST");
    const message = code === "PROVIDER_NOT_CONFIGURED" || code === "TOOL_NOT_CONFIGURED" ? "Native fanout is not configured for this provider yet." : code.startsWith("CAPTCHA") ? "The human verification could not be completed." : code === "RATE_LIMIT" ? "All free runs for this 24-hour window have been used." : code.includes("LIMIT") ? "The site-wide daily or cost limit has been reached." : code === "INVALID_REQUEST" || code.startsWith("KEYWORD") ? "Enter one short keyword or question." : "The native fanout run failed. No keyword or provider output was stored.";
    const details = error instanceof ToolError ? error.details : undefined;
    return res.status(status).json({ ok: false, requestId, error: { code, message, ...details }, toolVersion: NATIVE_TOOL_VERSION });
  }
}
