import { z } from "zod";

export const TOOL_VERSION = "modelled-fanout-tool/2.0.0";
export const METHOD_VERSION = "openrouter-structured-fanout/2.0";
export const PROVIDER_ID = "openrouter";
export const MAX_OUTPUT_TOKENS = 800;
export const FANOUT_QUERY_COUNT = 10;
export const REQUEST_RESERVE_MICRO_EUR = 150_000;

export const MODEL_OPTIONS = [
  { id: "openai/gpt-5.6-luna", label: "GPT-5.6 Luna", provider: "OpenAI" },
  { id: "deepseek/deepseek-v4-flash-0731", label: "DeepSeek V4 Flash", provider: "DeepSeek" },
  { id: "google/gemini-3.7-flash", label: "Gemini 3.7 Flash", provider: "Google" },
];
export const MODEL_IDS = MODEL_OPTIONS.map((model) => model.id);
export const DEFAULT_MODEL_ID = MODEL_IDS[0];

export const intentSchema = z.enum(["informational", "comparison", "commercial", "transactional", "local", "troubleshooting"]);
export const fanoutQuerySchema = z.object({ query: z.string().min(2).max(160), intent: intentSchema, reason: z.string().min(4).max(180) }).strict();
export const providerResultSchema = z.object({ queries: z.array(fanoutQuerySchema).length(FANOUT_QUERY_COUNT) }).strict();
export const requestSchema = z.object({
  keyword: z.string(),
  model: z.enum(MODEL_IDS),
  language: z.enum(["en", "de"]),
  country: z.enum(["", "DE", "US", "GB", "AT", "CH", "FR", "ES", "IT", "NL"]),
  turnstileToken: z.string().min(1).max(4096),
}).strict();

export function validateKeyword(value) {
  const keyword = value.normalize("NFC").trim();
  const characters = [...keyword].length;
  const bytes = Buffer.byteLength(keyword, "utf8");
  if (characters < 2) throw new ToolError("KEYWORD_TOO_SHORT", 400);
  if (characters > 60 || bytes > 160) throw new ToolError("KEYWORD_TOO_LONG", 400);
  if (/\r|\n/.test(keyword)) throw new ToolError("KEYWORD_MULTILINE", 400);
  if (/(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|de|org|net|io|ai|co)\b)/i.test(keyword)) throw new ToolError("URL_NOT_ALLOWED", 400);
  if (/(?:attach(?:ment)?|upload|file:\/\/|\.pdf\b|\.docx?\b|\.csv\b)/i.test(keyword)) throw new ToolError("FILES_NOT_ALLOWED", 400);
  return keyword;
}

export class ToolError extends Error { constructor(code, status = 500) { super(code); this.code = code; this.status = status; } }
