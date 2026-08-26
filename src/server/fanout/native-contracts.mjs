import { z } from "zod";
import { ToolError, validateKeyword } from "./contracts.mjs";

export const NATIVE_TOOL_VERSION = "native-fanout-tool/1.0.0";
export const NATIVE_METHOD_VERSION = "provider-native-search/1.0";
export const NATIVE_RESERVE_MICRO_EUR = 500_000;
export const MAX_NATIVE_SEARCHES = 8;
export const NATIVE_PROVIDER_OPTIONS = [
  { id: "openai", label: "OpenAI", model: "GPT-5.6 Luna" },
  { id: "gemini", label: "Gemini", model: "Gemini 3.7 Flash" },
];

export const nativeRequestSchema = z.object({
  keyword: z.string(),
  provider: z.enum(["openai", "gemini"]),
  language: z.enum(["en", "de"]),
  country: z.enum(["", "DE", "US", "GB", "AT", "CH", "FR", "ES", "IT", "NL"]),
  turnstileToken: z.string().min(1).max(4096),
}).strict();

export function validateNativeRequest(body) {
  const parsed = nativeRequestSchema.safeParse(body);
  if (!parsed.success) throw new ToolError("INVALID_REQUEST", 400);
  return { ...parsed.data, keyword: validateKeyword(parsed.data.keyword) };
}
