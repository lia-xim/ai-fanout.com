const origin = (process.env.AUDIT_ORIGIN ?? "https://ai-fanout.com").replace(/\/$/, "");
const failures = [];
const warnings = [];
const check = (value, message) => { if (!value) failures.push(message); };
const capture = (html, expression) => html.match(expression)?.[1]?.trim() ?? null;
const timedFetch = async (url, init) => {
  const started = performance.now();
  const response = await fetch(url, init);
  const body = await response.text();
  return { response, body, ms: Math.round(performance.now() - started), bytes: Buffer.byteLength(body) };
};

const robots = await timedFetch(`${origin}/robots.txt`, { redirect: "manual" });
check(robots.response.status === 200, `robots: ${robots.response.status}`);
check(robots.body.includes("Allow: /") && !robots.body.includes("Disallow: /"), "robots: crawl policy failed");
check(robots.body.includes(`Sitemap: ${origin}/sitemap-index.xml`), "robots: canonical sitemap reference missing");

const sitemapIndex = await timedFetch(`${origin}/sitemap-index.xml`, { redirect: "manual" });
check(sitemapIndex.response.status === 200 && sitemapIndex.body.includes("<sitemapindex"), "sitemap index invalid");
const childUrl = capture(sitemapIndex.body, /<loc>([^<]+)<\/loc>/i);
check(Boolean(childUrl), "sitemap child missing");
const child = childUrl ? await timedFetch(childUrl, { redirect: "manual" }) : { response: { status: 0 }, body: "", ms: 0, bytes: 0 };
check(child.response.status === 200 && child.body.includes("<urlset"), "sitemap child invalid");
const urls = [...child.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(urls.length > 0 && new Set(urls).size === urls.length, "sitemap: empty or duplicate URLs");

const titles = new Map();
const descriptions = new Map();
const pages = [];
const links = new Map();
for (const url of urls) {
  const item = await timedFetch(url, { redirect: "manual" });
  const route = new URL(url).pathname || "/";
  const html = item.body;
  const canonical = capture(html, /<link rel="canonical" href="([^"]+)"/i);
  const title = capture(html, /<title>([^<]+)<\/title>/i);
  const description = capture(html, /<meta name="description" content="([^"]+)"/i);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  check(item.response.status === 200, `${route}: sitemap URL returned ${item.response.status}`);
  check(canonical === url || (route === "/" && canonical === `${origin}/`), `${route}: canonical mismatch ${canonical}`);
  check(!/<meta name="robots"[^>]+noindex/i.test(html), `${route}: sitemap URL is noindex`);
  check(!/\bnoindex\b/i.test(item.response.headers.get("x-robots-tag") ?? ""), `${route}: sitemap URL has header noindex`);
  check(h1Count === 1, `${route}: expected one H1, found ${h1Count}`);
  check(Boolean(title) && Boolean(description), `${route}: title or description missing`);
  check(/property="og:title"/i.test(html) && /property="og:description"/i.test(html) && /property="og:image"/i.test(html), `${route}: Open Graph fields incomplete`);
  check(/type="application\/ld\+json"/i.test(html), `${route}: JSON-LD missing`);
  if (title) { check(!titles.has(title), `${route}: duplicate title with ${titles.get(title)}`); titles.set(title, route); }
  if (description) { check(!descriptions.has(description), `${route}: duplicate description with ${descriptions.get(description)}`); descriptions.set(description, route); }
  const routeLinks = [...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => new URL(match[1], origin).pathname);
  links.set(route, routeLinks);
  pages.push({ route, status: item.response.status, ms: item.ms, bytes: item.bytes, title, h1Count });
}

const sitemapRoutes = new Set(urls.map((url) => new URL(url).pathname || "/"));
for (const [route, routeLinks] of links) {
  for (const target of routeLinks) {
    if (target.startsWith("/_astro/") || target === "/tracker" || target === "/404") continue;
    const response = await fetch(`${origin}${target}`, { method: "HEAD", redirect: "manual" });
    check(response.status === 200 || [301, 302, 307, 308].includes(response.status), `${route}: broken internal link ${target} (${response.status})`);
  }
}
for (const route of sitemapRoutes) {
  if (route === "/") continue;
  const inbound = [...links.entries()].filter(([source, targets]) => source !== route && targets.includes(route)).length;
  if (inbound === 0) warnings.push(`${route}: no inbound link found from another sitemap page`);
}

const unknown = await fetch(`${origin}/not-a-real-route-live-seo-audit`, { redirect: "manual" });
check(unknown.status === 404 && !unknown.headers.has("location"), `unknown route: expected true 404, received ${unknown.status}`);
const http = await fetch(`http://${new URL(origin).host}/audit-path?keep=1`, { redirect: "manual" });
check(http.status === 308 && http.headers.get("location") === `${origin}/audit-path?keep=1`, "HTTP redirect must be permanent and preserve path/query");
const www = await fetch(`https://www.${new URL(origin).host}/audit-path?keep=1`, { redirect: "manual" });
check(www.status === 308 && www.headers.get("location") === `${origin}/audit-path?keep=1`, "www redirect must be permanent and preserve path/query");
const tracker = await timedFetch(`${origin}/tracker`, { redirect: "manual" });
check(tracker.response.status === 200 && /<meta name="robots" content="noindex, follow"/i.test(tracker.body), "tracker must remain useful 200 noindex");
check(!urls.includes(`${origin}/tracker`), "tracker leaked into sitemap");

const home = await fetch(`${origin}/`, { redirect: "manual" });
for (const header of ["content-security-policy", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy", "strict-transport-security"]) {
  if (!home.headers.has(header)) failures.push(`security header missing: ${header}`);
}

const result = {
  origin,
  status: failures.length ? "failed" : "passed",
  auditedAt: new Date().toISOString(),
  sitemapUrls: urls.length,
  performance: {
    medianHtmlResponseMs: pages.length ? pages.map((page) => page.ms).sort((a,b)=>a-b)[Math.floor(pages.length / 2)] : null,
    largestHtmlBytes: pages.length ? Math.max(...pages.map((page) => page.bytes)) : null
  },
  pages,
  warnings,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
