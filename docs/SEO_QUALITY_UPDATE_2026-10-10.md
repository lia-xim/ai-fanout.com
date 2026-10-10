# Existing-guide quality pass — 10 October 2026

This pass improves three English/German guide pairs. The canonical inventory remains 39 URLs. It creates no provider observations, benchmarks or additional indexable URLs.

## Evidence register

| Evidence | Classification | Decision |
| --- | --- | --- |
| The deployed prompt/export guides lacked the illustrations used by the article template. | Verified: repository and rendered page | Reuse two locally delivered, owner-commissioned illustrations with literal localized alt text. The shared template also supplies article/social image metadata. |
| Prompt and CSV-header samples were readable but offered no explicit copy control. | Verified: rendered page and component | Add an optional copy button, success/error announcement and keep the original text available without JavaScript. No network request or analytics event is added. |
| OpenAI documents that search actions usually, but not always, include the searched queries. | Verified: current primary documentation | Strengthen the existing OpenAI guide with an original status/action/query/source decision table. |
| A web search surfaced competing pages about query visibility and query exports. | Supported: search-result observations, without a declared rank or volume | These intents already have appropriate pages here. Improve those pages rather than create another overlapping URL. |
| The previous GSC baseline predates this pass and the new guide rollout. | Historical evidence | No post-change indexing, demand, ranking or click improvement is established. |
| The 9 October research reviewed 363 candidates. The prompt/JSON metrics request failed with an expired reservation and no charge. | Verified in the preceding run; not refreshed today | Do not infer demand from generated suggestions or silently retry a metered request. |

Primary documentation checked:

- [OpenAI web search: output and citations](https://developers.openai.com/api/docs/guides/tools-web-search)
- [Google's generative AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google image SEO guidance](https://developers.google.com/search/docs/appearance/google-images)

Provider documentation supports response-field interpretation, not the contents or outcome of a new run. The decision table is owner-written instructional content.

## Page actions

| Existing page pair | Role and job | Action | Overlap and proof boundary | KPI |
| --- | --- | --- | --- | --- |
| `/library/how-to-see-openai-search-queries`, `/de/lernen/openai-suchanfragen-sehen` | Support guide: inspect exposed API searches and interpret missing queries | Strengthen: distinguish completed zero-query responses, missing query fields, absent supporting sources and request failures | Keep the consumer-product/API boundary and existing citations path. The comparison guide still owns comparing saved runs. | Indexed intended canonical; query-page impressions/clicks; qualified tool entry |
| `/library/query-fanout-prompt`, `/de/lernen/query-fanout-prompt` | Support guide: plan research questions | Strengthen: illustration, localized image metadata and explicit copy action | Prompt remains original modelled-planning instruction. It is not an executed search or a provider transcript. | Indexed intended canonical; prompt-intent impressions/clicks; qualified tool entry |
| `/library/export-fanout-queries`, `/de/lernen/fanout-queries-exportieren` | Support guide: choose export scope and preserve evidence | Strengthen: illustration, localized image metadata and copyable CSV header | The copied header is only a field reference; it is not exported user data. Existing selection/full-run/history distinctions remain. | Indexed intended canonical; export-intent impressions/clicks; existing export funnel |

Hub → guide → contextual guide/proof → tool journeys stay in the existing centralized graph. No redirects, canonical targets, locale pairs, indexability flags or public provider limits change. Significant editorial dates advance only for these six pages.

## Measurement and next opportunities

- Days 1–30: check recrawl and Google's selected canonicals, then compare the affected page/query cohorts over matching 14/28-day windows. Preserve the 9 October baseline and label the simultaneous changes.
- Days 31–60: use actual impressions and qualified tool actions to prioritize the guide with the strongest reader need. Resolve the Keyword Data reservation failure and scoped keyword write access before any new metric job or list persistence.
- Days 61–90: consider a new firsthand procedure or example only for a distinct demonstrated reader task, with reproducible original evidence and any required provider-publication approval. Do not create a new URL for each exported wording variation.

Candidate intents such as missing queries, CSV exports and prompt planning are covered by existing pages. A fresh glossary page for each term would overlap with the definition guide. Image discoverability and easier reuse of the existing template are bounded improvements; ranking effects remain NOT PROVEN.

## Verification boundary

Required release proof: build, SEO QA across all 39 canonical pages, responsive article/table layout, exact copy result, current enable flags and live canonical/link checks. Release identity and final results are recorded separately in the owner release artifacts and the canonical DomainPortfolio update.

No new tracking system or raw-content analytics is introduced. The browser only writes the displayed sample to the clipboard after the visitor clicks its button. With clipboard support absent or JavaScript disabled, the sample remains readable and selectable; a rejected write has a manual-copy instruction.
