export const NATIVE_PROVIDERS = ["openai", "gemini", "anthropic"];

export function providerForModel(value = "") {
  if (/anthropic|claude|haiku/i.test(value)) return "anthropic";
  return /gemini/i.test(value) ? "gemini" : "openai";
}

export function displayModelLabel(id = "") {
  const labels = [
    ["claude-haiku-5.5", "Claude Haiku 5.5"], ["claude-haiku-5-5", "Claude Haiku 5.5"],
    ["gpt-6-luna", "GPT-6 Luna"], ["gemini-3.8-flash", "Gemini 3.8 Flash"],
    ["gpt-5.6-luna", "GPT-5.6 Luna"], ["gemini-3.7-flash", "Gemini 3.7 Flash"],
  ];
  return labels.find(([key]) => id.includes(key))?.[1] ?? id;
}
