/**
 * Canonical sitemap source of truth.
 *
 * Dates are editorial dates of the last significant visible page change. They
 * must never be replaced with the build or deployment time. Update a route
 * only when its main content, structured data, or meaningful internal links
 * change.
 */

export const sitemapRegistryVersion = "2026-08-31.2";

const pair = (en, de, lastmod, role) => [
  { path: en, lang: "en", lastmod, role, alternates: { en, de, "x-default": en } },
  { path: de, lang: "de", lastmod, role, alternates: { en, de, "x-default": en } },
];

const pairedRoutes = [
  ...pair("/", "/de", "2026-08-31", "tool-homepage"),
  ...pair("/library", "/de/lernen", "2026-08-31", "learning-hub"),
  ...pair("/examples", "/de/beispiele", "2026-08-28", "evidence-hub"),
  ...pair("/methodology", "/de/methode", "2026-08-31", "methodology"),
  ...pair("/library/what-is-ai-query-fanout", "/de/lernen/was-ist-ai-query-fanout", "2026-08-31", "guide"),
  ...pair("/library/how-to-see-openai-search-queries", "/de/lernen/openai-suchanfragen-sehen", "2026-08-31", "guide"),
  ...pair("/library/gemini-search-queries", "/de/lernen/gemini-suchanfragen", "2026-08-31", "guide"),
  ...pair("/library/ai-citations", "/de/lernen/ki-zitate-und-quellen", "2026-08-31", "guide"),
  ...pair("/library/ai-query-fanout-for-seo", "/de/lernen/query-fanout-fuer-seo", "2026-08-31", "guide"),
  ...pair("/library/seo-for-ai-search", "/de/lernen/seo-fuer-ki-suche", "2026-08-31", "guide"),
  ...pair("/library/why-ai-fanout-results-change", "/de/lernen/warum-fanout-ergebnisse-schwanken", "2026-08-31", "guide"),
  ...pair("/library/compare-ai-model-searches", "/de/lernen/ki-modelle-vergleichen", "2026-08-31", "guide"),
  ...pair("/examples/best-seo-tools-openai-vs-gemini", "/de/beispiele/beste-seo-tools-openai-vs-gemini", "2026-08-28", "evidence-example"),
  ...pair("/examples/country-changes-fanout-queries", "/de/beispiele/land-veraendert-fanout-queries", "2026-08-28", "evidence-example"),
  ...pair("/examples/why-same-keyword-changes", "/de/beispiele/warum-gleiches-keyword-andere-queries", "2026-08-28", "evidence-example"),
  ...pair("/examples/sources-for-comparison-questions", "/de/beispiele/quellen-bei-vergleichsfragen", "2026-08-28", "evidence-example"),
];

const singleRoutes = [
  { path: "/impressum", lang: "de", lastmod: "2026-08-26", role: "legal" },
  { path: "/datenschutz", lang: "de", lastmod: "2026-08-28", role: "legal" },
  { path: "/transparency", lang: "en", lastmod: "2026-08-27", role: "transparency" },
];

export const sitemapRoutes = Object.freeze([...pairedRoutes, ...singleRoutes].map((route) => Object.freeze(route)));
export const noindexRoutes = Object.freeze(["/tracker"]);
export const retiredRoutes = Object.freeze(["/lab", "/protocol-builder", "/research", "/research/methodology", "/datasets", "/protocols/example-2026-08-22"]);

export const normalizeRoutePath = (path) => {
  const clean = path.replace(/\/+$/, "");
  return clean || "/";
};

export const canonicalUrlForPath = (path) => path === "/" ? "https://ai-fanout.com/" : `https://ai-fanout.com${path}`;
export const sitemapRouteByPath = new Map(sitemapRoutes.map((route) => [route.path, route]));

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const isValidCalendarDate = (value) => {
  if (!datePattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
};
const berlinToday = Object.fromEntries(
  new Intl.DateTimeFormat("en", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date())
    .filter((part) => part.type !== "literal")
    .map((part) => [part.type, part.value]),
);
const latestAllowedLastmod = `${berlinToday.year}-${berlinToday.month}-${berlinToday.day}`;
const paths = sitemapRoutes.map((route) => route.path);
if (new Set(paths).size !== paths.length) throw new Error("Sitemap registry contains duplicate paths.");
for (const route of sitemapRoutes) {
  if (normalizeRoutePath(route.path) !== route.path) throw new Error(`Sitemap path is not canonical: ${route.path}`);
  if (!isValidCalendarDate(route.lastmod)) throw new Error(`Invalid sitemap lastmod for ${route.path}: ${route.lastmod}`);
  if (route.lastmod > latestAllowedLastmod) throw new Error(`Future sitemap lastmod for ${route.path}: ${route.lastmod}`);
  if (route.alternates) {
    for (const [lang, path] of Object.entries(route.alternates)) {
      if (!sitemapRouteByPath.has(path)) throw new Error(`Missing ${lang} alternate route ${path} for ${route.path}`);
    }
  }
}
