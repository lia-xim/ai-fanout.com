# SEO reader paths — 9 October 2026

## Problem and evidence

The second SEO pass improves the path from a reader's question to an explanation, dated evidence and the free tool. It covers the complete 35-URL canonical inventory; 28 existing content pages receive material improvements. It creates no additional indexable URLs.

The authenticated Search Console snapshot reviewed earlier on 9 October remains the demand baseline: 232 web impressions and zero clicks for 23 September–6 October, against 68 impressions and one click for 9–22 September. The two generator spellings contributed 173 impressions. The indexing snapshot dated 4 October showed 5 of 35 submitted pages indexed. These are historical observations, not post-release results.

A complete live crawl before this pass fetched all 35 sitemap URLs with HTTP 200 and found no orphan URLs. Direct HTML review nevertheless found that guide chapter bodies had no contextual links to the dated example pages. Example bodies offered evidence downloads without a guide for interpreting the observation or a concrete route to try the workflow. Navigation and related cards already existed; this was a reader-journey gap rather than an orphan or broken-link incident.

Baseline evidence: `C:\Users\matth\Documents\AI Fanout SEO\2026-10-09\next-potentials\links-before.json` and `guide-inventory.json`. The audit's classification treats links inside navigation as navigation even when the navigation is placed in content; its `no_content_inbound` field is therefore a limited heuristic.

## Changes across the inventory

| Canonical page group | URLs | Decision |
| --- | ---: | --- |
| EN/DE tool homepages | 2 | Retain the generator-focused search entries released earlier today. |
| EN/DE learning hubs | 2 | Link the evidence-review step directly to the dated examples hub. |
| EN/DE examples hubs | 2 | Add a contextual route to the citation and source-scope guide. |
| Eight EN/DE guide pairs | 16 | Add 32 explicit, same-language references inside relevant chapters; resolve related merged topics to their canonical owner. |
| SEO workflow, AI-search SEO, result variation and model comparison guide pairs | Included above | Add eight practical decision/control tables with defined evidence limits. |
| Four EN/DE example pairs | 8 | Add an interpretation guide, three-step reproduction instructions, a related control case, a tool route and breadcrumb structured data. |
| EN/DE methodology | 2 | Retain the existing protocol and technical explanation. |
| Transparency, imprint and privacy | 3 | Retain their disclosure/legal purpose and navigation access. |
| Total canonical inventory | 35 | Preserve the existing canonical and language relationships. |

The tables are original editorial guidance, not new observed provider output or measured keyword demand. The public OpenAI fixtures remain unchanged and retain their 27 August observation dates. The example pages explicitly date the newly added instructions to 9 October. The updated guide review dates, example structured-data modification dates and sitemap lastmod values reflect substantive changes. Tracker stays noindex; six retired routes retain real 404 responses.

This approach follows Google's guidance on [relevant crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) and [useful, evidence-supported content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). It is an editorial and discovery improvement, not a prediction of rankings.

## Verification

- Production-style local build: passed; 37 generated pages, zero errors and zero warnings. One existing unused-import hint remains in the research script.
- Release QA: all 35 indexable pages, one noindex tracker route, six retired 404 routes, canonical/hreflang, sitemap, robots and internal targets passed.
- Planner regression suite: 47 tests passed; planner QA passed.
- Independent local full-inventory crawl: 35/35 pages, no failed pages or orphan candidates. Both example hubs now have classified content inbound links. Four non-HTML evidence downloads remain outside the crawler's HTML inventory.
- Independent rendered HTML check: 35/35 HTTP 200, one H1 and expected production canonical; 32 chapter references, eight decision tables, eight example-guide paths and eight reproduction sections.
- Browser checks at desktop and 390-pixel mobile width: guide-to-example-to-tool and German example-to-guide routes work. Tables scroll inside their focusable regions without document overflow; the mobile footer remains reachable. Local provider execution is disabled by local configuration; no provider request was made.

Local proof is recorded in `links-after-local.json` and `local-release-checks.json` in the evidence folder. Production publication and its checks are recorded in the deployment result and the canonical DomainPortfolio update after release.

## Measurement and next priorities

After Google recrawls, compare complete 14-day and 28-day windows for the same query/page cohorts: generator homepages, definition, OpenAI/Gemini guides, citation interpretation, SEO workflow, variation and comparison examples. Review indexing and Google's selected canonical separately from impressions, clicks, CTR and position; a page being technically indexable does not establish that it is indexed.

Prioritise a useful revision when a page has relevant impressions but misses its reader's answer, or when readers reach evidence but cannot complete the next task. New URLs need a distinct task, original support and demonstrated demand. If pages remain discovered but not indexed, inspect representative live URLs and the indexing report before adding more pages. Ranking gains, index expansion, qualified tool use and citation gains after this release are **NOT PROVEN**.
