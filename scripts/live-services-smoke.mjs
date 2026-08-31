import { OpenRouterObservedQueryProvider } from "../src/server/fanout/provider.mjs";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const openRouterKey = process.env.OPENROUTER_API_KEY;

const missing = [
  ["UPSTASH_REDIS_REST_URL", redisUrl],
  ["UPSTASH_REDIS_REST_TOKEN", redisToken],
  ["OPENROUTER_API_KEY", openRouterKey],
].filter(([, value]) => !value).map(([name]) => name);
if (missing.length > 0) {
  throw new Error(`Required live-service environment variables are missing: ${missing.join(", ")}`);
}

const ping = await fetch(`${redisUrl.replace(/\/$/, "")}/ping`, {
  headers: { Authorization: `Bearer ${redisToken}` },
  signal: AbortSignal.timeout(5_000),
});
const pingBody = await ping.json();
if (!ping.ok || pingBody.result !== "PONG") {
  throw new Error(`Redis PING failed with HTTP ${ping.status}`);
}

const provider = new OpenRouterObservedQueryProvider({ apiKey: openRouterKey });
const observed = await provider.observe({
  keyword: "AI query fanout",
  language: "en",
  country: "DE",
});

console.log(JSON.stringify({
  redis: "PONG",
  provider: "ok",
  model: observed.model,
  queryCount: observed.result.queries.length,
  sourceCount: observed.result.sources.length,
  searchCallCount: observed.result.searchCallCount,
  costMicroEur: observed.actualCostMicroEur,
  outputTokens: observed.outputTokens,
}));
