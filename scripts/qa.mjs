import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { preview } from "astro";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const host = "https://ai-fanout.com";
const slugs = [
  "query-fan-out", "observable-ai-answer-evidence", "source-diversity", "answer-stability",
  "citation-persistence", "sampling-ai-answers", "control-question-set", "comparability-breaks",
  "missing-data-ai-observations", "observation-schema", "reproducibility-package",
  "audit-ai-answer-sources", "compare-ai-answers-over-time",
];
const libraryRoutes = slugs.map((slug) => `/library/${slug}`);
const routes = ["/", "/research", "/library", ...libraryRoutes, "/datasets", "/methodology", "/tracker", "/transparency"];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const pageFile = (route) => route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html");
const htmlByRoute = new Map();
const titleOwners = new Map();
const descriptionOwners = new Map();
const capture = (html, expression) => html.match(expression)?.[1]?.trim();
const visibleLength = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/&\w+;/g, " ").replace(/\s+/g, " ").trim().length;

for (const route of routes) {
  try {
    const html = await readFile(pageFile(route), "utf8");
    htmlByRoute.set(route, html);
    const canonical = route === "/" ? `${host}/` : `${host}${route}`;
    check(html.includes(`rel="canonical" href="${canonical}"`), `${route}: canonical must be ${canonical}`);
    check(html.includes('content="noindex, nofollow, noarchive"'), `${route}: noindex missing`);
    check((html.match(/<h1\b/gi) ?? []).length === 1, `${route}: exactly one h1 required`);
    check(/<main\b/i.test(html), `${route}: main landmark missing`);
    check(html.includes('href="/library"'), `${route}: primary library link missing`);

    const title = capture(html, /<title>([^<]+)<\/title>/i);
    const description = capture(html, /<meta name="description" content="([^"]+)"/i);
    check(Boolean(title), `${route}: title missing`);
    check(Boolean(description), `${route}: description missing`);
    if (title) { check(!titleOwners.has(title), `${route}: title duplicates ${titleOwners.get(title)}`); titleOwners.set(title, route); }
    if (description) { check(!descriptionOwners.has(description), `${route}: description duplicates ${descriptionOwners.get(description)}`); descriptionOwners.set(description, route); }
  } catch {
    failures.push(`${route}: built file missing`);
  }
}

const home = htmlByRoute.get("/") ?? "";
check(home.includes("Observe the answer. Audit the evidence."), "home: accepted hero copy missing");
check(home.includes('role="tablist"') && home.includes('aria-controls="protocol-panel"') && home.includes('aria-controls="limits-panel"'), "home: accessible Observation Field contract failed");
check(home.includes("<summary>Menu</summary>") && home.includes('class="skip-link"'), "site: mobile menu or skip link missing");

const hub = htmlByRoute.get("/library") ?? "";
check(hub.includes("Build the evidence before the trend."), "library: visual thesis missing");
check((hub.match(/<li data-library-item/g) ?? []).length === slugs.length, `library: expected ${slugs.length} references`);
check((hub.match(/<button type="button" data-filter=/g) ?? []).length >= 6, "library: category filters missing");
check(hub.includes('aria-live="polite"'), "library: accessible filtered region missing");

for (const route of libraryRoutes) {
  const html = htmlByRoute.get(route) ?? "";
  check(html.includes('class="direct-answer"'), `${route}: direct answer missing`);
  check(html.includes('class="article-rail"') && html.includes('class="source-notes"'), `${route}: evidence rail or source notes missing`);
  check(html.includes("Source-grounded reference") && html.includes("Review owner</dt><dd>Not assigned"), `${route}: evidence or ownership disclosure missing`);
  check(html.includes('"@type":"TechArticle"'), `${route}: TechArticle data missing`);
  check((html.match(/class="article-section"/g) ?? []).length >= 4, `${route}: fewer than four substantive sections`);
  check(visibleLength(html) >= 3000, `${route}: substantive reference depth failed`);
}

const robots = await readFile(join(dist, "robots.txt"), "utf8");
check(robots.includes("User-agent: *") && robots.includes("Disallow: /") && robots.includes(`Sitemap: ${host}/sitemap.xml`), "robots: noindex incubator contract failed");
const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
check(sitemap.includes("<urlset") && !/<url(?:\s|>)/i.test(sitemap), "sitemap: noindex sitemap must have zero URLs");

const vercel = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
const robotsHeader = vercel.headers?.flatMap((entry) => entry.headers ?? []).find((header) => header.key === "X-Robots-Tag");
check(robotsHeader?.value === "noindex, nofollow, noarchive", "vercel: global X-Robots-Tag missing");

const rights = JSON.parse(await readFile(join(root, "manifests", "rights-and-sources.v1.json"), "utf8"));
const requiredSources = ["google-query-fanout", "google-ai-optimization", "google-helpful-content", "google-spam-policies", "nist-ai-rmf-genai", "w3c-prov-o", "rfc-3339", "fair-principles"];
check(rights.schemaVersion === 1 && rights.domain === "ai-fanout.com", "rights: manifest identity failed");
check(Array.isArray(rights.sources) && rights.sources.length >= 16, "rights: expanded source register missing");
check(rights.sources.every((source) => source.id && source.checkedAt && source.status && source.supports), "rights: incomplete source provenance");
check(requiredSources.every((id) => rights.sources.some((source) => source.id === id && source.status === "verified")), "rights: required primary source missing");
check(rights.sources.some((source) => source.id === "recovery-raw-evidence" && source.status === "verified"), "rights: raw recovery evidence missing");
check(rights.rights?.some((record) => record.status === "no_trademark_clearance_performed"), "rights: naming gap missing");

const legacy = JSON.parse(await readFile(join(root, "manifests", "legacy-url-actions.v1.json"), "utf8"));
check(legacy.schemaVersion === 1 && legacy.domain === "ai-fanout.com", "legacy: identity failed");
check(legacy.defaultAction === "404" && legacy.catchAllRedirect === false && legacy.records?.length === 0, "legacy: unsupported URL action detected");

const routeExists = async (pathname) => {
  if (pathname === "/" || routes.includes(pathname) || ["/robots.txt", "/sitemap.xml"].includes(pathname)) return true;
  try { await access(pathname.startsWith("/_astro/") ? join(dist, pathname.slice(1)) : pageFile(pathname)); return true; } catch { return false; }
};
for (const [route, html] of htmlByRoute) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const [pathname] = href.split(/[?#]/);
    if (pathname) check(await routeExists(pathname), `${route}: broken internal link ${href}`);
  }
}

const allHtml = [...htmlByRoute.values()].join("\n").toLowerCase();
for (const phrase of ["reveals hidden queries", "accesses private retrieval traces", "exposes chain of thought", "live research dataset", "published trend findings", "independently verified by contextter", "guaranteed rankings", "ranking guarantee", "private query trace recovered"]) check(!allHtml.includes(phrase), `forbidden claim: ${phrase}`);
for (const stale of ["project setup", "temporary project page", "custom domain is not connected yet", "raw recovery evidence json was not present"]) check(!allHtml.includes(stale), `stale copy: ${stale}`);

const server = await preview({ root, logLevel: "silent", server: { host: "127.0.0.1", port: 0 } });
const baseUrl = `http://${server.host}:${server.port}`;
try {
  for (const route of [...routes, "/robots.txt", "/sitemap.xml"]) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    check(response.status === 200, `${route}: expected HTTP 200, received ${response.status}`);
  }
  const missing = await fetch(`${baseUrl}/not-a-reviewed-legacy-path`, { redirect: "manual" });
  check(missing.status === 404 && !missing.headers.has("location"), "unknown path: real 404 without redirect required");
} finally { await server.stop(); }

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`QA passed: ${routes.length} canonical pages including ${libraryRoutes.length} deep references; unique metadata, source depth, noindex, links, HTTP 200/404, manifests and claims verified.`);
