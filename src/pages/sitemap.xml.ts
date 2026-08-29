import { canonicalUrlForPath, sitemapRoutes } from "../data/sitemap-registry.mjs";

export const prerender = true;

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const alternateLinks = (alternates?: Record<string, string>) => alternates
  ? Object.entries(alternates).map(([language, path]) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(canonicalUrlForPath(path))}" />`,
    ).join("\n")
  : "";

const entries = sitemapRoutes.map((route) => {
  const alternates = alternateLinks("alternates" in route ? route.alternates : undefined);
  return [
    "  <url>",
    `    <loc>${escapeXml(canonicalUrlForPath(route.path))}</loc>`,
    `    <lastmod>${route.lastmod}</lastmod>`,
    alternates,
    "  </url>",
  ].filter(Boolean).join("\n");
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

export const GET = () => new Response(sitemap, {
  headers: {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate",
  },
});
