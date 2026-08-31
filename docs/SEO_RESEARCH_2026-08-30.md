# SEO research and implementation record

Date: 2026-08-30, live Contextter follow-up 2026-08-31
Markets: Germany and United States / English
Scope: `ai-fanout.com`

## Outcome and cost

- Starting inventory: 42 curated keywords.
- Raw discovery: 822 candidates, consisting of 458 US/English and 364 German candidates.
- Gross imports: 7.
- Removed after semantic review: 2 German keywords about viewing a consumer's ChatGPT searches.
- Net new retained keywords: 5.
- Final database: 47 keywords. The EN-US list reports 31 members. The DE list reports 18 members, while its stored membership read returned only 16 rows with `KEYWORD_LIST_MEMBERSHIP_PARTIAL`; the missing two rows are therefore a data-contract gap, not deleted keywords. The EN list also contains the two DE-categorized records `query fanout seo` and `ai fanout tool`, so list membership is not a clean language label.
- Candidates not retained from the raw discovery set: 817. This number includes irrelevant expansions, semantic mismatches, duplicates and candidates that did not justify import.
- Settled Contextter cost for the complete research assignment: EUR 1.15.
- Additional domain and competitor research charged on 2026-08-31: EUR 0.66.
- Account total spent: EUR 1.81. The account status reported EUR 49.19 available, EUR 0.00 held and zero active holds. The operation breakdown explains EUR 1.69 of the EUR 1.81 total; the remaining EUR 0.12 is still not attributable from the returned projection and remains a billing-observability gap.
- Hard assignment ceiling: EUR 5.00. Remaining permitted spend: EUR 3.19.

Free stored reads were exhausted first. After the Paid/Fresh MCP families and the actual OAuth client's `actions:approve` and `actions:execute` scopes were enabled, a bounded US/English domain snapshot was purchased for EUR 0.21 and a summary comparison against `queryfanout.io` and `lumina-seo.com` for EUR 0.45. Both operations used server-enforced automatic limits of EUR 3.85 per action, UTC day and UTC month. The domain snapshot completed successfully but returned zero rankings, pages, competitors and opportunity signals. The comparison completed successfully but returned zero organic result rows. These are useful null findings for a new domain/category; they do not justify another page or another paid provider run. The enrichment dialog's separate market-context defect remains relevant for keyword-metric refreshes, so no such refresh was purchased.

## Evidence labels

- **Verified:** directly reproduced in the product, code, live site or primary documentation.
- **Supported:** more than one useful signal exists, but market coverage or a requested metric is incomplete.
- **Hypothesis:** relevant wording or intent is plausible but has no adequate demand or SERP proof yet.
- **Experiment:** a bounded implementation with a named measurement and stop/merge rule; it is not a claimed result.
- **Rejected:** semantically wrong, outside the product boundary or likely to create misleading content.

## Data-quality boundary

Contextter returned useful search volume and trend data for 11 of the 47 retained keywords. Keyword Difficulty, CPC and paid competition remained blank after the settled Essentials enrichment. Those fields are therefore recorded as unavailable, not zero. The completed data run reports 49 of 49 rows successful, zero failures and zero `noData`; that run-level success does not make every metric field present. The partial SERP job produced 12 snapshots before it stopped; after two rejected keywords were deleted, 10 retained keywords had snapshots. English phrases from that job were searched in a German context and cannot be treated as verified US rankings.

Contextter now has one completed US/English domain snapshot and one completed summary comparison, but both detail projections are empty. There is still no configured tracking competitor, no stored GSC snapshot and no AI-visibility run. Consequently, competitor organic keywords, exact ranking positions, ranking-URL exports, SERP overlap percentages and a structured content-gap set remain **not proven** in this record.

The public web check did not return an indexed `ai-fanout.com` result on 2026-08-30. This is a supported discovery signal, not a replacement for Google Search Console index coverage. Local first-party operational counters could not be read because the repository environment did not contain the required Upstash credentials; no usage claim is inferred from that absence.

## Additional live evidence on 2026-08-30

- **Observed in Search Console:** `sc-domain:ai-fanout.com` recorded one homepage impression and no clicks between 2026-07-31 and 2026-08-27. The page-level row reported average position 7. No query row was exposed, so neither the query nor its intent can be inferred.
- **Observed sitemap state:** `https://ai-fanout.com/sitemap.xml` was submitted on 2026-08-29, remained pending and reported zero warnings and zero errors. Pending processing is not an indexing failure.
- **Observed URL Inspection state:** the latest stored inspection per production URL covers 29 unique sitemap URLs. Google reported `Submitted and indexed` for `/`, `/de`, `/library` and `/methodology`; the other 25 URLs were `URL is unknown to Google`. This is a point-in-time inspection result, not a permanent quality verdict. The bulk call timed out at the client while continuing server-side, leaving 35 history rows for 29 unique URLs after a retry; duplicate rows are excluded from the coverage count.
- **Rejected KPI value:** the connected GSC-Wizard summary reported average position 1 for the same single impression while its daily row and separate page query both reported position 7. Position 1 is therefore excluded and documented as an MCP aggregation defect.
- **Unavailable secondary source:** all tested Bing keyword-stat calls returned `notConfigured: true` because the connected account has no Bing Webmaster API key. This is a configuration gap, not evidence of zero Bing demand.
- **Observed current search category:** live web results for the core English and German phrases included dedicated query-fanout tools, definitions and AI-search SEO guides. Several competitors use broader wording such as hidden, actual or simulated fanout. This supports the category and the need for clear native-versus-modelled evidence labels; it does not validate competitor claims or exact demand.

## Contextter follow-up on 2026-08-31

- **Execution contract:** the active OAuth client `apc_lz0gm0pqv6ts` now has only the additional action scopes `actions:approve` and `actions:execute`; unrelated write scopes remain disabled. Account policy is `bounded_auto` with 385 EUR-cent limits per action, UTC day and UTC month.
- **Domain snapshot:** operation `aop_4v068lf1uaje`, snapshot `snap_4hzhzbljkrrz`, market `2840/en`, status `succeeded`. Maximum quote 27 cents; settled customer charge 21 cents. Rankings, pages, competitors and opportunity signals each returned zero rows. The exact stored profile endpoint still reports `DOMAIN_PROFILE_NOT_FOUND`, so a completed empty snapshot is not equivalent to a populated domain profile.
- **Competitor summary:** operation `aop_429q06zhus48`, comparison `cmp_0zirnk4njxzj`, competitors `queryfanout.io` and `lumina-seo.com`, market `2840/en`. The account balance and cost breakdown recorded a 45-cent charge with zero holds, while the operation endpoint still lagged at `running` / `settlement:pending`. The comparison source itself is completed, stored the three-domain scope and returned zero result rows; organic keywords and ranking URLs remain unknown.
- **Operational defects:** quotes created before `bounded_auto` remained cached in `ACTION_HUMAN_APPROVAL_REQUIRED` even after grants and scopes were corrected; a new idempotency key after the policy change executed successfully. Operation projections also lagged behind completed source snapshots before later settling. No retry caused a duplicate paid execution.
- **Search Console access:** the currently signed-in Google account has no access to the `ai-fanout.com` property. No access request or ownership change was made. The last stored inspection evidence therefore remains the current GSC baseline.
- **Decision:** spend no more budget now. Release and measure the existing homepage and eight bilingual guide roles; do not add generator, simulator, BYOK, tracking or one-page-per-query URLs without distinct demand, ranking or user evidence.

## Final stored-data and SERP review on 2026-08-31

- **Correct workspace verified:** free stored reads were executed against `ws_g1h1padb4chj` (`ai-fanout.com`). A differently named MCP connection pointed at another workspace and was rejected before any paid action. No paid or write action was run in this pass.
- **Keyword inventory:** the stored keyword page returned 47 records. The strongest available measurements remain `chatgpt citations` at volume 20 and `what is query fan out in ai search`, `ai mode query fan out`, `google ai mode query fan out`, `seo for ai search`, `chatgpt search queries`, `chatgpt query fanout`, `gemini citations`, `ai search citations`, `how ai search works` and `query fan out ai coverage tool` at volume 10 where stored. Missing KD, CPC, intent, category, competition and volume fields remain unknown rather than zero.
- **Domain and rankings:** the completed US/English snapshot still contains zero ranking rows, zero pages, zero domain competitors and zero opportunity signals. The stored tracking projection contains ten selected keywords but every position and ranking URL is `null`; this is evidence of no stored position, not proof that the domain can never rank.
- **Competitors:** the stored comparison records `queryfanout.io` and `lumina-seo.com`, but its results projection contains zero rows. Current live results additionally surfaced Ahrefs, Search Engine Land, QueryFanOuts, Quadrant, Ranketta, Georion and other specialist surfaces. Their result pages confirm distinct tool, definition and workflow intents; they do not supply a reliable organic-keyword export for this domain.
- **Search performance:** there is no current stored Search Console snapshot in Contextter. Existing point-in-time Search Console evidence elsewhere in this record remains the only first-party search-performance baseline.
- **Page decision:** all supported longtails map cleanly to the eight canonical bilingual guide roles. `Google AI Mode query fan out` belongs to the general definition, ChatGPT/OpenAI query phrases to the OpenAI method, citation phrases to the citation guide, and SEO/longtail planning to the two existing SEO guides. No new URL passed the distinct-job test.
- **Implementation:** expanded visible common-question answers for the definition, OpenAI-query, citation and AI-search SEO guides; added a verified OpenAI Search help source; strengthened exact internal anchors from both homepages and learning hubs; and improved titles for query-fanout SEO, result variation and OpenAI-versus-Gemini comparison pages.

## Prioritized keyword and URL map

`n/a` means the provider did not return the field. Volumes shown for English phrases came from a German SERP/data context and are explicitly marked as such.

| Priority | Keyword / group | Market | Volume and trend | Intent and current SERP evidence | Target URL | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | free AI query fanout tool; free AI fanout tool; AI search query tool | EN-US | n/a | Commercial tool intent. Current web results contain dedicated free query-fanout tools, so the category exists; exact US demand remains unverified. | `/` | Supported |
| 2 | kostenloses AI Fanout Tool; KI Suchanfragen Tool | DE | n/a | Commercial tool intent; exact German phrase produced no strong direct match in the independent web check. | `/de` | Hypothesis |
| 3 | what is query fanout in AI search | EN-US | 10, sparse trend; DE-context enrichment | Informational. SERP showed People Also Ask and video results, with Search Engine Land, Ahrefs, Similarweb, Sistrix and Conductor among relevant domains. | `/library/what-is-ai-query-fanout` | Supported |
| 4 | AI query fanout; how query fanout works | EN-US | n/a | Informational definition and process intent; Google's current documentation explicitly defines query fan-out. | `/library/what-is-ai-query-fanout` | Verified concept / Hypothesis demand |
| 5 | query fanout SEO | EN-US | no volume returned | Practical SEO intent. German-context SERP showed AI Overview, People Also Ask, video and sitelinks; relevant domains included Semrush, Ahrefs, Sistrix and Conductor. | `/library/ai-query-fanout-for-seo` | Supported |
| 6 | SEO for AI search | EN-US | 10, +100%; DE-context enrichment | Commercial/informational. SERP showed AI Overview, video and sitelinks; Google documentation, Search Engine Land, Salesforce and specialist sites were present. | `/library/seo-for-ai-search` | Supported; bounded experiment |
| 7 | SEO für KI-Suche; KI-Suche SEO | DE | no volume returned | Commercial/informational. SERP showed AI Overview, People Also Ask and video; OMR, Seokratie, SE Ranking, Evergreen Media and agencies were visible. | `/de/lernen/seo-fuer-ki-suche` | Supported |
| 8 | ChatGPT search queries; ChatGPT query fanout | EN-US | 10 each; DE-context enrichment | Provider-method intent is useful only when framed as exposed OpenAI API search actions, not private ChatGPT consumer traces. | `/library/how-to-see-openai-search-queries` | Supported with strict boundary |
| 9 | ChatGPT Suchanfragen; OpenAI-Suchanfragen sehen | DE | n/a | Ambiguous between API observation and consumer history. The page must answer the legitimate API route and reject the private-history interpretation. | `/de/lernen/openai-suchanfragen-sehen` | Hypothesis with strict boundary |
| 10 | Gemini search queries | EN-US | n/a | Distinct provider-method intent backed by Gemini API documentation. | `/library/gemini-search-queries` | Verified capability / Hypothesis demand |
| 11 | Gemini-Suchanfragen | DE | n/a | Distinct provider-method intent; separate from OpenAI because response and storage boundaries differ. | `/de/lernen/gemini-suchanfragen` | Verified capability / Hypothesis demand |
| 12 | AI search citations | EN-US | 10, sparse trend; DE-context enrichment | Measurement/research intent. It asks what cited sources mean, not how to run a provider search. | `/library/ai-citations` | Supported |
| 13 | ChatGPT citations | EN-US | 20, +33%; DE-context enrichment | Citation intent is useful when kept at API-response scope; the term must not imply permanent ChatGPT rankings. | `/library/ai-citations` | Supported with strict boundary |
| 14 | Gemini citations | EN-US | 10, stable; DE-context enrichment | Citation interpretation plus provider rights/storage boundary. | `/library/ai-citations` with contextual link to `/library/gemini-search-queries` | Supported |
| 15 | Zitate in der KI-Suche; KI-Zitate und Quellen | DE | n/a | Informational/measurement intent. | `/de/lernen/ki-zitate-und-quellen` | Hypothesis |
| 16 | how AI search works; Google AI Mode query fan out; AI Mode query fan out | EN-US | 10 each for all three; DE-context enrichment | Broad explanation intent. The site should answer only the query-fanout portion and link to primary Google documentation instead of becoming a generic AI-search encyclopedia. | `/library/what-is-ai-query-fanout` and `/library/seo-for-ai-search` | Supported |
| 17 | wie funktioniert KI-Suche | DE | no volume returned | Broad informational intent; SERP showed AI Overview, People Also Ask and video with Google Help, WDR, Sistrix and Evergreen Media. | `/de/lernen/seo-fuer-ki-suche` with link to `/de/lernen/was-ist-ai-query-fanout` | Supported |
| 18 | wie funktioniert AI Fanout | DE | no volume returned | Definition/process intent; SERP showed AI Overview and video with Sistrix, Ahrefs, SEO Südwest and specialist sites. | `/de/lernen/was-ist-ai-query-fanout` | Supported |
| 19 | query fan out AI coverage tool | EN-US | 10, flat; DE-context enrichment | Commercial tool intent. SERP showed AI Overview and video, with SEO Review Tools, Similarweb, WordLift and Conductor among relevant domains. | `/` | Supported |

KD, CPC and paid competition are `n/a` for all rows because the purchased enrichment did not return them. They must be refreshed only after the Contextter market and coverage defects are fixed or through another provider with an explicit quote.

## Clusters and search intent

| Cluster | Primary intent | Canonical role | Decision |
| --- | --- | --- | --- |
| Free query-fanout tool | Commercial / task completion | Homepages contain the working tool and the complete product explanation. | Strengthen; no separate exact-match tool page. |
| Query fanout definition | Informational | One definition guide per language. | Strengthen existing page. |
| OpenAI search queries | Method / provider | One OpenAI guide includes web-search mechanics and the ChatGPT boundary. | Keep consolidated to prevent overlap. |
| Gemini search queries | Method / provider | Separate Gemini guide because fields, rights and storage rules differ. | Promote from redirect to canonical page. |
| AI search citations | Measurement / evidence | Separate citations guide for source meaning and attribution scope. | Promote from redirect to canonical page. |
| Query fanout for SEO | Practical workflow | Narrow workflow from observation to page decision. | Strengthen existing page and keep content-gap material merged. |
| SEO for AI search | Broad commercial/informational | Technical foundation, useful evidence, citations, fanout and measurement. | Add one substantive bilingual guide as a bounded experiment. |
| Variation, locale and comparison | Measurement | Existing variation and comparison guides. | Keep locale and zero-query variants consolidated. |

## Cannibalization and rejection rules

- `/` owns free-tool intent. No `/free-ai-fanout-tool` variant is created.
- `/library/what-is-ai-query-fanout` owns the definition. It should not become a broad AI-search SEO guide.
- `/library/how-to-see-openai-search-queries` owns the OpenAI method and includes the mechanics formerly drafted under `/library/openai-web-search-queries`; the latter remains redirected.
- `/library/gemini-search-queries` owns the Gemini-specific method and storage boundary.
- `/library/ai-citations` owns citation interpretation. Provider pages link to it rather than duplicating the full explanation.
- `/library/ai-query-fanout-for-seo` owns the narrow fanout-to-page workflow; content-gap analysis remains merged into it.
- `/library/seo-for-ai-search` owns the broader optimization framework. It links to the narrow workflow rather than repeating its step-by-step page mapping.
- Consumer-history phrases such as `wo chatgpt suchanfragen sehen` and `welche chatgpt suchanfragen gibt es` are rejected because they imply access the product does not have.
- Hidden-query, private retrieval trace, chain-of-thought, guaranteed ranking and one-page-per-query interpretations are rejected.

## Implementation completed now

1. Rewrote titles and descriptions around the strongest distinct intents while preserving the API-observation boundary.
2. Promoted Gemini search queries and AI-search citations from redirects to canonical bilingual pages.
3. Added one substantial bilingual `SEO for AI search` guide; no mass-generated keyword pages were created.
4. Expanded homepage and learning-hub internal links to the provider, citation and AI-search SEO paths.
5. Added breadcrumb structured data to guide pages and aligned sitemap, redirect manifest, route policy and documentation.
6. Added usable example topics at the tool input so visitors can reach a valid first run without guessing the expected query shape.
7. Added a homepage evidence matrix that separates provider-observed native fanout, modelled search ideas and external keyword metrics.
8. Added a market-specific live-search fallback to the AI-search SEO guides: missing volume stays unknown while current result URLs, result types and features can still support a bounded intent hypothesis.

### Five strongest immediate optimizations in this slice

1. Put the complete primary term `AI Query Fanout Tool` in both homepage titles while keeping one canonical commercial tool URL per language.
2. Changed the hero promise from what a provider supposedly “runs” to the narrower, verifiable claim that the page shows web-search queries the provider exposes.
3. Expanded the evidence matrix into three explicit jobs: native API observer, modelled generator/simulator and external SEO-coverage/keyword dataset. This answers the strongest competitor-category distinction without claiming hidden traces.
4. Added the same observer-versus-generator-versus-coverage decision rule to the existing bilingual AI-search SEO guide, where informational visitors need it; no thin comparison URL was created.
5. Replaced empty guide-hero image alternatives with the existing localized editorial alt text so the visual has a meaningful accessible description.

No new URL was created in this pass. Current search results prove a category and several competing product surfaces, but exact US/DE demand, organic keyword exports and URL-level overlap remain insufficient for another durable page role.

## Measurement sequence

### Now

- Complete local SEO/planner QA, Astro build, canonical/hreflang/schema checks and rendered-page inspection without deploying from this assignment.
- Hand the verified slice over for a separate authorized release; retain the canonical `/sitemap.xml` already submitted in Search Console.
- On release, record the deployment date and current index coverage. If manual inspection quota is available, request indexing only for the homepages, both learning hubs and materially changed guide pairs. Do not infer performance from a `site:` query alone.

### After the next crawl and first usable data

- Check indexed versus discovered URLs, canonical selection and hreflang processing.
- Review impressions by page and query in DE and US separately.
- Confirm that OpenAI, Gemini, citations and broad AI-search SEO produce distinct query sets. If they overlap heavily, merge before adding more pages.
- Review tool starts and qualified handoff actions without collecting raw topics.

### After a meaningful observation window

- Refresh only keywords that received impressions, relevant tool actions or strong external evidence.
- Buy market-correct SERPs, KD or CPC only when those fields can change a real page decision.
- Improve pages with impressions but weak CTR or poor intent match; do not expand the library because a fanout string merely exists.
- Keep, merge or retire the broad AI-search SEO experiment based on indexation, relevant impressions, engagement and maintenance value.

## Competitor and content-gap analysis

Current free search and page inspection on 2026-08-30 confirmed a live tool category. The following matrix records only what was visible on the cited product surfaces. It is not a validation of each competitor claim and not an organic-keyword export.

| Surface | Observed positioning | Gap or contrast for ai-fanout.com | Action |
| --- | --- | --- | --- |
| QueryFanout.io | Lead-gated free fanout tool with sources and broader volume/KD/AI-Overview language. | Commercial vocabulary is broader, but its metric layer is a different evidence job. | Cover tool intent on `/`; keep provider observation and external metrics visibly separate. |
| Astiva | No-signup query-fanout generator using synthetic subqueries and personas. | Strong `generator` wording, but the result is modelled rather than provider-observed. | Explain the generator/observer distinction on existing pages; no exact-match generator page. |
| Lumina SEO | Mixes observed or simulated fanout with live SERP/PAA/AI-Overview data, export and BYOK positioning. | Combines several workflows that ai-fanout.com intentionally separates. | Keep the free observer focused; route page/coverage decisions to the existing SEO workflow. |
| Patrick Stox simulator | Explicitly distinguishes generic, calibrated and observed fanout and warns that consumer fanout is mostly unobservable. | Strong evidence-boundary explanation overlaps the site's trust advantage. | Preserve protocol-level wording and never collapse API observation into consumer-product claims. |
| QueryCat | Presents ChatGPT, Gemini and Perplexity queries/URLs with observed and inferred labels. | Broader multi-provider comparison and inferred data. | Retain precise provider and inference labels; do not add unsupported provider coverage. |
| QueryFanouts.com | GSC upload, AI detection and content recommendations. | Serves coverage/optimization after discovery rather than the same observer job. | Address the distinction in the existing SEO guide and shared workflow, not a new observer URL. |
| Ranked AI | No-signup generator plus an AI-tracking upsell. | Monitoring and prompt visibility are broader adjacent intents. | Reject monitoring ownership for ai-fanout.com; keep it in a separate product category. |

The visible pages support these candidate families: `query fan-out generator`, `query fan-out simulator`, `query fan-out analyzer`, `AI search sub-queries`, `query fan-out content coverage`, `query fan-out API` and `BYOK query fanout`. They do **not** yet justify individual URLs. Generator/simulator language belongs in the existing tool taxonomy, content coverage belongs mainly to the page-decision workflow, and AI brand visibility/prompt tracking remains outside this site's narrow product role.

Current English results surfaced dedicated tools, definitions and practitioner guides for the core category. Current German results surfaced informational publishers and agencies for Query Fanout and KI-Suche, while the exact free-tool phrases did not produce a comparably strong direct German tool surface in the checked result set. That makes `/de` a bounded commercial **Experiment**, not verified demand.

### Structured competitor evidence still missing

| Requested evidence | Status | Consequence |
| --- | --- | --- |
| Competitor organic keywords by DE and US market | NOT PROVEN | No volume, ranking or opportunity total is inferred. |
| Competitor ranking URLs and top pages | NOT PROVEN | Visible current pages are examples, not a complete top-page set. |
| SERP overlap and recurring ranking domains | NOT PROVEN | No overlap percentage or share-of-voice claim is made. |
| Saved Contextter competitor comparison | Verified absent | Workspace stored read returned an empty comparison set. |
| AI citation/visibility comparison | NOT PROVEN | Fresh Google and ChatGPT visibility calls returned `FEATURE_DISABLED`. |

The next Contextter run must not repeat broad recursive seed expansion. Once the fresh feature path is enabled, it should first return an exact quote, then retrieve market-specific organic keywords and ranking URLs for a minimal direct-domain set, calculate deduplicated overlap and import only candidates that change a real page decision. The total assignment may spend at most another EUR 3.85, and no reservation or grant is permission to run without that quote.

## External evidence reviewed

- Google Search Central: [Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- Google Search Central: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- OpenAI: [Web search tool guide](https://developers.openai.com/api/docs/guides/tools-web-search)
- Google AI for Developers: [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search)
- Current competitor discovery included QueryFanout.io, QueryTool.ai, Search Engine Land, Sistrix, Ahrefs, Semrush, Conductor, Similarweb, SEO Review Tools and specialist German publications. Their presence supports category and SERP-shape analysis; it does not validate their claims or make them independent evidence for this site's product.
