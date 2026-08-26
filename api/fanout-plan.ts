import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DEFAULT_MODEL_ID, TOOL_VERSION, ToolError } from "../src/server/fanout/contracts.mjs";
import { OpenRouterFanoutProvider } from "../src/server/fanout/provider.mjs";
import { RedisQuotaLedger } from "../src/server/fanout/quota.mjs";
import { createFanoutService, verifyTurnstile } from "../src/server/fanout/service.mjs";

const required = ["OPENROUTER_API_KEY", "TURNSTILE_SECRET_KEY", "TURNSTILE_HOSTNAMES", "FANOUT_BUCKET_SALT", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] as const;
const safeHeaders = { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };
const allowedOrigins = new Set(["https://ai-fanout.com", "https://www.ai-fanout.com", "https://ai-fanout-com.vercel.app", ...(process.env.VERCEL_ENV !== "production" ? ["http://localhost:4321", "http://127.0.0.1:4321"] : [])]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  Object.entries(safeHeaders).forEach(([key, value]) => res.setHeader(key, value));
  const requestId = crypto.randomUUID();
  try {
    if (req.method !== "POST") throw new ToolError("METHOD_NOT_ALLOWED", 405);
    if (process.env.FANOUT_PUBLIC_ENABLED !== "true" || required.some((name) => !process.env[name])) throw new ToolError("TOOL_NOT_CONFIGURED", 503);
    const origin = String(req.headers.origin ?? "");
    if (!allowedOrigins.has(origin)) throw new ToolError("ORIGIN_NOT_ALLOWED", 403);
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown").split(",")[0].trim();
    const ledger = new RedisQuotaLedger({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
    const provider = new OpenRouterFanoutProvider({ apiKey: process.env.OPENROUTER_API_KEY! });
    const expectedHostnames = new Set(process.env.TURNSTILE_HOSTNAMES!.split(",").map((hostname) => hostname.trim()).filter(Boolean));
    const service = createFanoutService({ ledger, provider, bucketSalt: process.env.FANOUT_BUCKET_SALT!, captchaVerifier: (token: string, remoteIp: string) => verifyTurnstile({ token, remoteIp, secret: process.env.TURNSTILE_SECRET_KEY!, expectedAction: "fanout", expectedHostnames }) });
    const data = await service({ body: req.body, remoteIp: ip });
    return res.status(200).json({ ok: true, requestId, data });
  } catch (error) {
    const status = error instanceof ToolError ? error.status : 500;
    const code = error instanceof ToolError ? error.code : "INTERNAL_ERROR";
    if (status === 405) res.setHeader("Allow", "POST");
    return res.status(status).json({ ok: false, requestId, error: { code, message: publicMessage(code) }, toolVersion: TOOL_VERSION, modelId: DEFAULT_MODEL_ID });
  }
}
function publicMessage(code: string) {
  if (["RATE_LIMIT", "GLOBAL_LIMIT"].includes(code)) return "The free daily limit has been reached. Please try again later.";
  if (code === "BUDGET_LIMIT" || code === "TOOL_NOT_CONFIGURED") return "The free tool is temporarily unavailable.";
  if (code.startsWith("CAPTCHA")) return "The human verification could not be completed.";
  if (code.startsWith("KEYWORD") || code === "URL_NOT_ALLOWED" || code === "FILES_NOT_ALLOWED" || code === "INVALID_REQUEST") return "Enter one short keyword without URLs, files, or extra text.";
  return "The fanout could not be generated. No keyword or provider output was stored.";
}
