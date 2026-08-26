const PRODUCTION_ORIGINS = [
  "https://ai-fanout.com",
  "https://www.ai-fanout.com",
  "https://ai-fanout-com.vercel.app",
];

function vercelHostname(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const hostname = value.trim().replace(/^https?:\/\//, "").split("/")[0];
  return /^[a-z0-9.-]+$/i.test(hostname) ? hostname : null;
}

export function allowedRequestOrigins(env = process.env) {
  const origins = new Set(PRODUCTION_ORIGINS);
  if (env.VERCEL_ENV !== "production") {
    origins.add("http://localhost:4321");
    origins.add("http://127.0.0.1:4321");
    for (const value of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
      const hostname = vercelHostname(value);
      if (hostname) origins.add(`https://${hostname}`);
    }
  }
  return origins;
}

export function expectedTurnstileHostnames(configured, env = process.env) {
  const hostnames = new Set(String(configured || "").split(",").map((value) => value.trim()).filter(Boolean));
  if (env.VERCEL_ENV !== "production") {
    for (const value of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
      const hostname = vercelHostname(value);
      if (hostname) hostnames.add(hostname);
    }
  }
  return hostnames;
}

