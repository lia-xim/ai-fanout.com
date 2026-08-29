export const prerender = true;

const stylesheet = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>XML Sitemap — ai-fanout.com</title>
        <style>
          :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #080c0e; color: #f3f5f5; }
          body { margin: 0; padding: 48px 24px 80px; }
          main { width: min(1120px, 100%); margin: 0 auto; }
          p { color: #9eabad; line-height: 1.6; }
          .eyebrow { color: #20c7ef; font: 700 12px ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; }
          h1 { margin: 10px 0 8px; font-size: clamp(32px, 5vw, 58px); letter-spacing: -.04em; }
          .summary { display: flex; gap: 18px; margin: 30px 0; padding: 18px 0; border-block: 1px solid #293337; }
          .summary strong { color: #20c7ef; }
          table { width: 100%; border-collapse: collapse; background: #0d1316; border: 1px solid #293337; }
          th, td { padding: 15px 18px; border-bottom: 1px solid #202a2e; text-align: left; vertical-align: top; }
          th { color: #7f8c8f; font: 700 11px ui-monospace, monospace; letter-spacing: .1em; text-transform: uppercase; }
          td:first-child { width: 70%; overflow-wrap: anywhere; }
          a { color: #f3f5f5; text-decoration-color: #20c7ef; text-underline-offset: 4px; }
          .languages { color: #9eabad; font-size: 13px; }
          @media (max-width: 680px) { body { padding: 28px 14px 60px; } th, td { padding: 12px 10px; } th:nth-child(2), td:nth-child(2) { display: none; } td:first-child { width: auto; } }
        </style>
      </head>
      <body>
        <main>
          <div class="eyebrow">Technical index</div>
          <h1>XML Sitemap</h1>
          <p>This is the canonical, automatically generated sitemap for ai-fanout.com. Search engines read the XML; this stylesheet only makes it easier for people to inspect.</p>
          <div class="summary"><span><strong><xsl:value-of select="count(s:urlset/s:url)" /></strong> canonical pages</span><span>English and German alternates included</span></div>
          <table>
            <thead><tr><th>Canonical URL</th><th>Last meaningful update</th><th>Languages</th></tr></thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                  <td><xsl:value-of select="s:lastmod" /></td>
                  <td class="languages"><xsl:for-each select="xhtml:link"><xsl:value-of select="@hreflang" /><xsl:if test="position() != last()"> · </xsl:if></xsl:for-each></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export const GET = () => new Response(stylesheet, {
  headers: { "Content-Type": "text/xsl; charset=utf-8" },
});
