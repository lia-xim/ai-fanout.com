import { z } from "zod";

export const TOOL_VERSION = "observed-query-tool/1.0.0";
export const METHOD_VERSION = "openrouter-openai-web-search/1.0";
export const MODEL_ID = "openai/gpt-5.2";
export const PROVIDER_ID = "openrouter";
export const MAX_OUTPUT_TOKENS = 400;
export const MAX_SEARCH_CALLS = 8;
export const REQUEST_RESERVE_MICRO_EUR = 150_000;

export const observedQuerySchema = z.object({ query: z.string().min(1).max(300), callId: z.string().max(200).optional() }).strict();
export const citedSourceSchema = z.object({ url: z.url().max(2048), title: z.string().max(300).optional() }).strict();
export const providerResultSchema = z.object({ queries: z.array(observedQuerySchema).min(1).max(MAX_SEARCH_CALLS), sources: z.array(citedSourceSchema).max(40), searchCallCount: z.number().int().min(1).max(MAX_SEARCH_CALLS) }).strict();
export const requestSchema = z.object({ keyword: z.string(), language: z.enum(["en", "de"]), country: z.enum(["", "DE", "US", "GB", "AT", "CH", "FR", "ES", "IT", "NL"]), turnstileToken: z.string().min(1).max(4096) }).strict();

export function validateKeyword(value) {
  const keyword = value.normalize("NFC").trim();
  const characters = [...keyword].length;
  const bytes = Buffer.byteLength(keyword, "utf8");
  if (characters < 2) throw new ToolError("KEYWORD_TOO_SHORT", 400);
  if (characters > 100 || bytes > 240) throw new ToolError("KEYWORD_TOO_LONG", 400);
  if (/\r|\n/.test(keyword)) throw new ToolError("KEYWORD_MULTILINE", 400);
  if (/(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|de|org|net|io|ai|co)\b)/i.test(keyword)) throw new ToolError("URL_NOT_ALLOWED", 400);
  if (/(?:attach(?:ment)?|upload|file:\/\/|\.pdf\b|\.docx?\b|\.csv\b)/i.test(keyword)) throw new ToolError("FILES_NOT_ALLOWED", 400);
  return keyword;
}

export class ToolError extends Error { constructor(code, status = 500) { super(code); this.code = code; this.status = status; } }
