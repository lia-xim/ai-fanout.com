import { z } from "zod";

export const PLANNER_VERSION = "fanout-planner/1.0.0";
export const METHOD_VERSION = "hypothetical-query-fanout/1.0";
export const MODEL_ID = "gpt-5.4-nano";
export const MAX_OUTPUT_TOKENS = 700;
export const REQUEST_RESERVE_MICRO_EUR = 20_000;

const branchSchema = z.object({
  query: z.string().min(4).max(180),
  intent: z.enum(["learn", "compare", "evaluate", "implement", "troubleshoot", "verify"]),
  rationale: z.string().min(12).max(260),
  sourceType: z.enum(["primary documentation", "research paper", "expert guidance", "case study", "comparison data", "community evidence"]),
  assumption: z.string().min(4).max(220),
}).strict();

export const planSchema = z.object({
  summary: z.string().min(20).max(320),
  branches: z.array(branchSchema).min(4).max(8),
}).strict();

export const requestSchema = z.object({
  question: z.string(),
  turnstileToken: z.string().min(1).max(4096),
}).strict();

export const providerJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "branches"],
  properties: {
    summary: { type: "string", minLength: 20, maxLength: 320 },
    branches: {
      type: "array", minItems: 4, maxItems: 8,
      items: {
        type: "object", additionalProperties: false,
        required: ["query", "intent", "rationale", "sourceType", "assumption"],
        properties: {
          query: { type: "string", minLength: 4, maxLength: 180 },
          intent: { type: "string", enum: ["learn", "compare", "evaluate", "implement", "troubleshoot", "verify"] },
          rationale: { type: "string", minLength: 12, maxLength: 260 },
          sourceType: { type: "string", enum: ["primary documentation", "research paper", "expert guidance", "case study", "comparison data", "community evidence"] },
          assumption: { type: "string", minLength: 4, maxLength: 220 },
        },
      },
    },
  },
};

export function validateQuestion(value) {
  const question = value.normalize("NFC").trim();
  const characters = [...question].length;
  const bytes = Buffer.byteLength(question, "utf8");
  if (characters < 4) throw new PlannerError("QUESTION_TOO_SHORT", 400);
  if (characters > 120 || bytes > 256) throw new PlannerError("QUESTION_TOO_LONG", 400);
  if (/\r|\n/.test(question)) throw new PlannerError("QUESTION_MULTILINE", 400);
  if (/(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|de|org|net|io|ai|co)\b)/i.test(question)) throw new PlannerError("URL_NOT_ALLOWED", 400);
  if (/(?:attach(?:ment)?|upload|file:\/\/|\.pdf\b|\.docx?\b|\.csv\b)/i.test(question)) throw new PlannerError("FILES_NOT_ALLOWED", 400);
  return question;
}

export class PlannerError extends Error {
  constructor(code, status = 500) { super(code); this.code = code; this.status = status; }
}
