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
const toolRoutes = ["/lab", "/protocol-builder"];
const routes = ["/", ...toolRoutes, "/research", "/library", ...libraryRoutes, "/datasets", "/methodology", "/protocols/example-2026-08-22", "/tracker", "/transparency", "/impressum", "/datenschutz"];
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
    check(route === "/tracker" ? html.includes('content="noindex, follow"') : !/<meta name="robots"/i.test(html), route + ": robots indexability policy failed");
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
check(home.includes("Map what stays. Mark what changes."), "home: tool-first visual thesis missing");
check(home.includes('href="/lab"') && home.includes('href="/protocol-builder"'), "home: primary tool paths missing");
check(home.includes("Not research data") && home.includes("No input upload"), "home: demo or privacy boundary missing");
check(home.includes("Visible source recurrence") && home.includes("Literal coverage"), "home: evidence output contract missing");
check(home.includes("<summary>Menu</summary>") && home.includes('class="skip-link"'), "site: mobile menu or skip link missing");

const lab = htmlByRoute.get("/lab") ?? "";
check(lab.includes("data-evidence-lab") && lab.includes("data-lab-form"), "lab: interactive workbench missing");
check(lab.includes("data-source-matrix") && lab.includes("data-coverage-matrix"), "lab: evidence matrices missing");
check(lab.includes("data-export-json") && lab.includes("data-export-csv"), "lab: portable exports missing");
check(lab.includes("Nothing entered here is sent") && lab.includes("Local only"), "lab: browser-local contract missing");
check(lab.includes("does not verify factual accuracy") && lab.includes("hidden fan-out queries"), "lab: evidence boundary missing");

const protocol = htmlByRoute.get("/protocol-builder") ?? "";
check(protocol.includes("data-protocol-builder") && protocol.includes("data-protocol-form"), "protocol: builder missing");
check(protocol.includes("data-protocol-readiness") && protocol.includes("not preregistered"), "protocol: readiness or draft boundary missing");
check(protocol.includes("data-export-protocol-json") && protocol.includes("data-export-protocol-markdown"), "protocol: exports missing");
for (const name of ["questions", "surface", "route", "missingRule", "retention"]) check(protocol.includes(`data-protocol-field="${name}"`), `protocol: ${name} contract missing`);

const labSource = await readFile(join(root, "src", "scripts", "evidence-lab.ts"), "utf8");
const protocolSource = await readFile(join(root, "src", "scripts", "protocol-builder.ts"), "utf8");
for (const [name, source] of [["lab", labSource], ["protocol", protocolSource]]) {
  for (const forbidden of ["fetch(", "XMLHttpRequest", "sendBeacon(", "localStorage", "sessionStorage"]) check(!source.includes(forbidden), `${name}: browser-local boundary violated by ${forbidden}`);
}
check(labSource.includes("pairwiseJaccard") && labSource.includes("literalPresence") && labSource.includes("parseSources"), "lab: transparent calculation methods missing");
check(protocolSource.includes("draft_not_preregistered") && protocolSource.includes("toMarkdown"), "protocol: portable draft contract missing");
const globalCss = await readFile(join(root, "src", "styles", "global.css"), "utf8");
check(globalCss.includes(":focus-visible") && globalCss.includes("outline: 2px solid var(--focus)"), "accessibility: global visible focus treatment missing");
check(globalCss.includes("prefers-reduced-motion: reduce") && globalCss.includes("scroll-behavior: auto !important"), "accessibility: reduced-motion contract missing");

const hub = htmlByRoute.get("/library") ?? "";
check(hub.includes("Build the evidence before the trend."), "library: visual thesis missing");
check((hub.match(/<li data-library-item/g) ?? []).length === slugs.length, `library: expected ${slugs.length} references`);
check((hub.match(/<button type="button" data-filter=/g) ?? []).length >= 6, "library: category filters missing");
check(hub.includes('aria-live="polite"'), "library: accessible filtered region missing");

for (const route of libraryRoutes) {
  const html = htmlByRoute.get(route) ?? "";
  check(html.includes('class="direct-answer"'), `${route}: direct answer missing`);
  check(html.includes('class="article-rail"') && html.includes('class="source-notes"'), `${route}: evidence rail or source notes missing`);
  check(html.includes("Source-grounded reference") && html.includes("Review owner</dt><dd>Matthias Ramahi"), `${route}: evidence or ownership disclosure missing`);
  check(html.includes('"@type":"TechArticle"'), `${route}: TechArticle data missing`);
  check((html.match(/class="article-section"/g) ?? []).length >= 4, `${route}: fewer than four substantive sections`);
  check(visibleLength(html) >= 3000, `${route}: substantive reference depth failed`);
}

const example = htmlByRoute.get("/protocols/example-2026-08-22") ?? "";
check(example.includes("A result you can reproduce—not a benchmark.") && example.includes("AF-EX-2026-08-22"), "example: identity or benchmark boundary missing");
check(example.includes("EUR 0") && example.includes("No independent reviewer assigned"), "example: accountability missing");
check(example.includes("62%"), "example: expected overlap missing");

const datasets = htmlByRoute.get("/datasets") ?? "";
for (const field of ["question", "answer_text", "source_urls", "coverage_criteria", "protocol_version"]) check(new RegExp(`<code[^>]*>${field}</code>`).test(datasets), `datasets: ${field} schema field missing`);
check(datasets.includes("no ai-fanout.com observation release exists"), "datasets: release boundary missing");

const imprint = htmlByRoute.get("/impressum") ?? "";
check(imprint.includes("Matthias Ramahi") && imprint.includes("Kempener Straße 44") && imprint.includes("40699 Erkrath") && imprint.includes("info@matthiasramahi.de"), "imprint: verified operator details missing");
check(imprint.includes("§ 5 DDG") && imprint.includes("§ 18 Abs. 2 MStV") && imprint.includes("ai-fanout.com — AI Answer Evidence Lab"), "imprint: provider or responsibility scope missing");

const privacy = htmlByRoute.get("/datenschutz") ?? "";
for (const claim of ["Vercel", "ausschließlich im Arbeitsspeicher Ihres Browsers", "keine Analytics-", "keine eigenen Cookies", "Systemschriften", "Es gibt kein Kontaktformular", "lokale Blob-URL"]) check(privacy.includes(claim), `privacy: exact behavior missing: ${claim}`);
check(privacy.includes("localStorage") && privacy.includes("sessionStorage") && privacy.includes("nicht an ai-fanout.com"), "privacy: local-storage or transmission boundary missing");
const robots = await readFile(join(dist, "robots.txt"), "utf8");
check(robots.includes("User-agent: *") && robots.includes("Allow: /") && !robots.includes("Disallow: /") && robots.includes("Sitemap: https://ai-fanout.com/sitemap-index.xml"), "robots: indexable launch contract failed");
const sitemapIndex = await readFile(join(dist, "sitemap-index.xml"), "utf8");
const sitemapChild = await readFile(join(dist, "sitemap-0.xml"), "utf8");
check(sitemapIndex.includes("<sitemapindex") && sitemapIndex.includes("/sitemap-0.xml"), "sitemap: generated index missing");
check(sitemapChild.includes("<urlset") && sitemapChild.includes("<loc>https://ai-fanout.com</loc>"), "sitemap: generated canonical URLs missing");
check(!sitemapChild.includes("/tracker</loc>") && !sitemapChild.includes("/404</loc>"), "sitemap: noindex or error route leaked");
for (const route of routes.filter((route) => route !== "/tracker")) {
  const loc = route === "/" ? "https://ai-fanout.com" : "https://ai-fanout.com" + route;
  check(sitemapChild.includes("<loc>" + loc + "</loc>"), "sitemap: missing " + loc);
}

const vercel = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
check(!vercel.headers, "vercel: global noindex header must be absent");
check(vercel.redirects?.some((entry) => entry.source === "/sitemap.xml" && entry.destination === "/sitemap-index.xml" && entry.permanent === true), "vercel: permanent sitemap compatibility redirect missing");

const rights = JSON.parse(await readFile(join(root, "manifests", "rights-and-sources.v1.json"), "utf8"));
const requiredSources = ["google-query-fanout", "google-ai-optimization", "google-helpful-content", "google-spam-policies", "nist-ai-rmf-genai", "w3c-prov-o", "rfc-3339", "fair-principles"];
check(rights.schemaVersion === 1 && rights.domain === "ai-fanout.com", "rights: manifest identity failed");
check(Array.isArray(rights.sources) && rights.sources.length >= 16, "rights: expanded source register missing");
check(rights.sources.every((source) => source.id && source.checkedAt && source.status && source.supports), "rights: incomplete source provenance");
check(requiredSources.every((id) => rights.sources.some((source) => source.id === id && source.status === "verified")), "rights: required primary source missing");
check(rights.sources.some((source) => source.id === "operator-imprint-live" && source.status === "verified"), "rights: verified operator source missing");
check(rights.sources.some((source) => source.id === "custom-domain-live" && ["launch_candidate_pending_live_verification", "verified_indexable_live"].includes(source.status)), "rights: custom-domain state stale");
check(rights.rights?.some((record) => record.status === "provenance_and_rights_required_before_publication"), "rights: third-party publication boundary missing");
check(rights.rights?.some((record) => record.status === "browser_local_user_controlled"), "rights: user-input boundary missing");

const routeActions = JSON.parse(await readFile(join(root, "manifests", "route-actions.v1.json"), "utf8"));
check(routeActions.schemaVersion === 1 && routeActions.domain === "ai-fanout.com" && routeActions.domainOrigin === "fresh_registration", "routes: identity or origin failed");
check(routeActions.defaultUnknownPathAction === "404" && routeActions.catchAllRedirect === false, "routes: unknown-path policy failed");
check(routeActions.indexState === "indexable_launch" && routeActions.sitemapMode === "astro_static_route_generation", "routes: launch or sitemap mode failed");
check(routeActions.excludedFromSitemap?.includes("/tracker") && routeActions.excludedFromSitemap?.includes("/404"), "routes: sitemap exclusions missing");

const routeExists = async (pathname) => {
  if (pathname === "/" || routes.includes(pathname) || ["/robots.txt", "/sitemap-index.xml", "/sitemap-0.xml", "/examples/evidence-lab-example-2026-08-22.json"].includes(pathname)) return true;
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
for (const phrase of ["reveals hidden queries", "accesses private retrieval traces", "exposes chain of thought", "live research dataset", "published trend findings", "independently verified by contextter", "guaranteed rankings", "ranking guarantee", "private query trace recovered", "actual fan-out queries"]) check(!allHtml.includes(phrase), `forbidden claim: ${phrase}`);
for (const stale of ["project setup", "temporary project page", "custom domain is not connected yet", "raw recovery evidence json was not present"]) check(!allHtml.includes(stale), `stale copy: ${stale}`);

const server = await preview({ root, logLevel: "silent", server: { host: "127.0.0.1", port: 0 } });
const baseUrl = `http://${server.host}:${server.port}`;
try {
  for (const route of [...routes, "/robots.txt", "/sitemap-index.xml", "/sitemap-0.xml", "/examples/evidence-lab-example-2026-08-22.json"]) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    check(response.status === 200, `${route}: expected HTTP 200, received ${response.status}`);
  }
  const missing = await fetch(`${baseUrl}/not-a-reviewed-route`, { redirect: "manual" });
  check(missing.status === 404 && !missing.headers.has("location"), "unknown path: real 404 without redirect required");
} finally { await server.stop(); }

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("QA passed: " + routes.length + " canonical pages, 2 browser-local tools, " + libraryRoutes.length + " deep references; indexability, automatic sitemap, unique metadata, source depth, links, HTTP 200/404, manifests, local processing and forbidden claims verified.");
