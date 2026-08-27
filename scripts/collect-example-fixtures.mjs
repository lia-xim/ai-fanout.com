import { readFile } from "node:fs/promises";
import { OpenAINativeProvider } from "../src/server/fanout/native-provider.mjs";

const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map((match) => [match[1], match[2].replace(/^['\"]|['\"]$/g, "")]));
if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing from .env.local");

const provider = new OpenAINativeProvider({ apiKey: env.OPENAI_API_KEY });
const cases = [
  { id: "best-seo-tools-us", keyword: "best SEO tools", language: "en", country: "US" },
  { id: "best-seo-tools-de", keyword: "best SEO tools", language: "en", country: "DE" },
  { id: "best-seo-tools-repeat", keyword: "best SEO tools", language: "en", country: "US" },
  { id: "seo-tools-comparison-sources", keyword: "Ahrefs vs Semrush for small business", language: "en", country: "US" },
];
const observations = [];
for (const input of cases) {
  let result;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try { result = await provider.observe(input); break; }
    catch (error) { if (attempt === 2 || error?.code !== "PROVIDER_INCOMPLETE") throw error; }
  }
  observations.push({ id: input.id, input, observedAt: new Date().toISOString(), toolVersion: "native-fanout-tool/1.0.0", methodVersion: "provider-native-search/1.0", ...result, notice: "One provider API observation under a fixed protocol. Not an independent provider benchmark or a capture of the ChatGPT consumer interface." });
}
process.stdout.write(`${JSON.stringify({ schemaVersion: "ai-fanout.example-observations/1.0", collectedAt: new Date().toISOString(), observations }, null, 2)}\n`);
