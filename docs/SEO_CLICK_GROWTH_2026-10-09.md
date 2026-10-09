# Search-led homepage and guide update

Status: implemented locally; production publication and post-release growth not proven.

## Evidence and scope

Authenticated Search Console, Web, 23 September–6 October 2026 versus 9–22 September:

- Property impressions: 232 versus 68; clicks: 0 versus 1.
- `query fan out generator`: 87 impressions, average position 9.
- `query fanout generator`: 86 impressions, average position 15.
- Both generator variants were verified against the English homepage and USA country filter. They contribute 173 of 232 current impressions.
- `query fan out tool`: 14 impressions, average position 29.3; its individual landing-page assignment has not been verified.
- Germany: 34 impressions, average position 93; this is not evidence of a positive German ranking trend.
- Index report dated 4 October: five of 35 sitemap URLs indexed. Definition, OpenAI and Gemini guide inspections show discovered, currently not indexed. Gemini's 9 October live test succeeded; eligibility is not actual indexing.

The supporting report and raw evidence are at `C:\Users\matth\Documents\AI Fanout SEO\2026-10-09`. GSC impressions are not search volume. Aggregate position changes reflect a changing query/country mix, not a like-for-like ranking gain. The current Crawl Foundry difficulty refresh failed before execution and produced no current difficulty data.

## Implementation

- Strengthen the existing homepage for generator intent. Title, H1, description and WebApplication schema describe the same product. Native API observations and modelled Search Ideas remain separate visible modes.
- Explain the content-research benefit early and offer contextual routes to examples, provider instructions, content decisions and comparison.
- Strengthen the existing definition, OpenAI and Gemini guide pairs with direct answers, three practical steps and a tool CTA at entry and conclusion. No extra keyword-variant URL.
- Provider CTAs use an allowlisted `provider` query parameter. It selects an enabled native provider only, does not populate a topic or bypass CAPTCHA, and never submits a run automatically. Unknown values preserve the default. Static homepage canonical remains the clean route.
- Update the two learning hubs to describe the SEO audience; show the latest actual guide-update date rather than implying all guides were reviewed today.
- Update editorial lastmod for the ten materially changed routes only. Keep unchanged routes' dates, existing language alternates and redirects.
- Correct the tool anchor offset below the fixed header and remove the nested main landmark in article markup.

No new provider output, screenshot, claim of hidden-query access or third-party media was published. Existing quotas, privacy controls, server keys, storage and event allowlists are unchanged.

## Validation

- Node 24.15.0; Astro production build passed: 0 errors, 0 warnings, 1 pre-existing unused-import hint in an unrelated untracked brand-research script; 37 built pages.
- Site QA passed: 35 indexable pages, one noindex route, six retired 404 routes; canonicals, hreflang, sitemap, robots and internal links.
- All 47 existing focused product tests and planner QA passed.
- Local browser at 1280×720 and 390×844: homepage, Gemini guide and German OpenAI guide showed no horizontal overflow or broken images. Updated guide has one main landmark and one H1.
- Gemini guide→tool selects Gemini; German OpenAI guide→tool selects OpenAI and retains German. Empty topic and closed loading dialog confirm neither path starts a run.
- Example-topic button fills the input, updates the character count and focuses the field without starting a run. Unknown provider parameter preserves OpenAI. Inspected console had no warnings or errors.
- UI verification used public enable flags plus a Cloudflare test site key locally, with no provider request submitted. This is not a live provider or production CAPTCHA test.

Screenshots: `C:\Users\matth\Documents\AI Fanout SEO\2026-10-09\implementation`.

## Release and measurement

Release only the reviewed owned file set; preserve unrelated brand-research files. After publication, verify clean canonicals with provider parameters, metadata, guide links, sitemap dates, desktop/mobile output and normal production CAPTCHA behavior.

Record the publication timestamp. Compare two complete, equally long 14-day windows after the change has been crawled, with a 28-day follow-up. Keep Search type, country and page filters fixed. Track the two USA generator variants against `/` individually: impressions, clicks, CTR and average position. Review `query fan out tool` separately. Do not compare only the property's aggregate position or interpret one or two clicks as a stable effect.

For the six edited guide URLs, inspect actual index status first. Then review queries, countries and clicks per canonical page. No index request was submitted by this implementation.

Use the existing privacy-safe `tool_run_started`, `tool_run_succeeded`, export and feedback events to check whether relevant visitors use the tool. Report search clicks and useful tool actions separately; page views alone are not qualified conversions. No additional tracking or raw-topic collection is introduced.

If generator CTR stays zero with comparable impressions, review the rendered search result and visitor intent before expanding to more pages. If clicks improve but successful tool use does not, inspect entry friction and reliability. Rankings, indexing and increased clicks remain outcome hypotheses until measured.
