import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MODEL_ID, PLANNER_VERSION, PlannerError } from "../src/server/fanout/contracts.mjs";
import { OpenAIPlannerProvider } from "../src/server/fanout/provider.mjs";
import { RedisQuotaLedger } from "../src/server/fanout/quota.mjs";
import { createPlannerService, verifyTurnstile } from "../src/server/fanout/service.mjs";

const required = ["OPENAI_API_KEY", "TURNSTILE_SECRET_KEY", "FANOUT_BUCKET_SALT", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] as const;
const safeHeaders = { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };
const allowedOrigins = new Set(["https://ai-fanout.com", "https://www.ai-fanout.com", ...(process.env.VERCEL_ENV !== "production" ? ["http://localhost:4321", "http://127.0.0.1:4321"] : [])]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  Object.entries(safeHeaders).forEach(([key, value]) => res.setHeader(key, value));
  const requestId = crypto.randomUUID();
  try {
    if (req.method !== "POST") throw new PlannerError("METHOD_NOT_ALLOWED", 405);
    if (process.env.FANOUT_PUBLIC_ENABLED !== "true" || required.some((name) => !process.env[name])) throw new PlannerError("PLANNER_NOT_CONFIGURED", 503);
    const origin = String(req.headers.origin ?? "");
    if (!allowedOrigins.has(origin)) throw new PlannerError("ORIGIN_NOT_ALLOWED", 403);
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown").split(",")[0].trim();
    const cookies = Object.fromEntries(String(req.headers.cookie ?? "").split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value));
    const ledger = new RedisQuotaLedger({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
    const provider = new OpenAIPlannerProvider({ apiKey: process.env.OPENAI_API_KEY! });
    const service = createPlannerService({ ledger, provider, bucketSalt: process.env.FANOUT_BUCKET_SALT!, captchaVerifier: (token: string, remoteIp: string) => verifyTurnstile({ token, remoteIp, secret: process.env.TURNSTILE_SECRET_KEY! }) });
    const result = await service({ body: req.body, remoteIp: ip, deviceId: cookies.af_device });
    if (!cookies.af_device) res.setHeader("Set-Cookie", `af_device=${result.deviceId}; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=Strict`);
    return res.status(200).json({ ok: true, requestId, data: result.data });
  } catch (error) {
    const status = error instanceof PlannerError ? error.status : 500;
    const code = error instanceof PlannerError ? error.code : "INTERNAL_ERROR";
    if (status === 405) res.setHeader("Allow", "POST");
    return res.status(status).json({ ok: false, requestId, error: { code, message: publicMessage(code) }, plannerVersion: PLANNER_VERSION, modelId: MODEL_ID });
  }
}

function publicMessage(code: string) {
  if (["RATE_LIMIT", "GLOBAL_LIMIT"].includes(code)) return "The public run limit has been reached. Please try again later.";
  if (code === "BUDGET_LIMIT" || code === "PLANNER_NOT_CONFIGURED") return "The planner is temporarily unavailable.";
  if (code.startsWith("CAPTCHA")) return "The human verification could not be completed.";
  if (code.startsWith("QUESTION") || code === "URL_NOT_ALLOWED" || code === "FILES_NOT_ALLOWED" || code === "INVALID_REQUEST") return "Enter one short question without URLs, files, or additional context.";
  return "The plan could not be generated. No input or provider output was stored.";
}

