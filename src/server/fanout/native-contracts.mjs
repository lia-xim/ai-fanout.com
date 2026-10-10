import { z } from "zod";
import { ToolError, validateKeyword } from "./contracts.mjs";

export const NATIVE_TOOL_VERSION = "native-fanout-tool/1.1.0";
export const NATIVE_METHOD_VERSION = "provider-native-search/1.1";
export const NATIVE_RESERVE_MICRO_EUR = 100_000;
export const MAX_NATIVE_SEARCHES = 8;
export const NATIVE_MAX_OUTPUT_TOKENS = 500;
export const NATIVE_MODEL_IDS = { openai: "gpt-6-luna", gemini: "gemini-3.8-flash", anthropic: "anthropic/claude-haiku-5.5" };
export const NATIVE_PROVIDER_OPTIONS = [
  { id: "openai", label: "OpenAI", model: "GPT-6 Luna" },
  { id: "gemini", label: "Gemini", model: "Gemini 3.8 Flash" },
  { id: "anthropic", label: "Claude", model: "Haiku 5.5" },
];

export const nativeRequestSchema = z.object({
  keyword: z.string(),
  provider: z.enum(["openai", "gemini", "anthropic"]),
  language: z.enum(["en", "de"]),
  country: z.enum(["", "DE", "US", "GB", "AT", "CH", "FR", "ES", "IT", "NL"]),
  turnstileToken: z.string().min(1).max(4096),
}).strict();

export function validateNativeRequest(body) {
  const parsed = nativeRequestSchema.safeParse(body);
  if (!parsed.success) throw new ToolError("INVALID_REQUEST", 400);
  return { ...parsed.data, keyword: validateKeyword(parsed.data.keyword) };
}
