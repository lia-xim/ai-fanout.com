# Developer milestone preflight — 10 October 2026

Status: research completed; implementation and release remain pending. This file does not complete topics 05, 06, 27, 28, 29 or 30.

The first two Goal milestones implement topics 01, 02, 03, 08, 14, 15, 16, 17, 18, 19, 25 and 26. Continue the remaining accepted backlog; do not mark all 30 packages complete from the current inventory.

## Verified source paths and contracts

- `src/server/fanout/native-provider.mjs`: OpenAI Responses API `output` items with `web_search_call`, `action.query`/`action.queries` and optional action sources. Message URL annotations enter the run-level source list. An incomplete response without search calls is rejected; exposed calls from an incomplete final answer are preserved with their status. The current wrapper normalises/deduplicates/bounds visible strings; do not describe it as a complete raw provider trace.
- The same file: Gemini `/v1beta/interactions`, `steps` with `google_search_call.arguments.queries`; `model_output.content[].annotations` supplies run-level URL citations. Do not substitute GenerateContent `groundingMetadata.webSearchQueries` for this contract. `google_search_result` payloads are not retained by this wrapper.
- `src/server/fanout/native-service.mjs`: actual successful native result fields, `toolVersion` and `methodVersion`. The full native download currently has no root `schemaVersion`; a new reference schema must describe the existing result rather than inventing a version already emitted by the UI.
- `src/scripts/fanout-selection.mjs`: `ai-fanout.query-selection/1.0`; selected one-based original query indices, run metadata and no additional query/source relationship.
- `src/scripts/fanout-comparison.mjs`: `ai-fanout.local-comparison/1.0`; complete saved runs and deterministic NFKC/case-normalised intersections. Country/language differences remain available in runs; the current `comparisonType` categorises topic/provider, not experimental equivalence.
- `src/lib/seo-handoff.mjs` and `src/scripts/seo-research-handoff.ts`: `ai-fanout.seo-research-handoff/1.0`, UTF-8 JSON → base64url, fragment key `research`, maximum 48,000 encoded-input bytes. Only selected visible fields transfer; this is a separate scope from the complete JSON export.
- `public/contracts/fanout-plan-export.schema.v1.json` and `docs/FANOUT_EXPORT_CONTRACT_V1.md`: older planner contract; preserve its identifier and distinguish it from the live native/modelled result contracts.

## Primary documentation checked

- [OpenAI web search](https://developers.openai.com/api/docs/guides/tools-web-search): search query fields can be absent; search/open/find actions are distinct; URL citations are not a private consumer trace.
- [Gemini Interactions overview](https://ai.google.dev/gemini-api/docs/interactions-overview) and [API reference](https://ai.google.dev/api/interactions-api): the reference documents `google_search_call.arguments.queries` and `google_search_result`; annotations and result types need explicit scope and retention handling. References checked on 10 October, no provider request made.

## Required original deliverables and checks

Create a downloadable, runnable offline parser/test kit, current contract-reference schemas and clearly synthetic minimal files. Preserve completed-zero, incomplete-with-exposed-actions, timeout/error and malformed-input states. Cover singular/plural queries, multiple actions, sources without exposed queries, Unicode/duplicates, invalid URLs, absent metadata and source-scope boundaries. No new actual provider output or paid request is needed.

Public helpers must state their own version and any deliberate difference from the live wrapper (bounds, normalisation, retention). Execute the downloaded kit independently and verify fixtures against their actual referenced contracts. Improve the existing OpenAI/Gemini interpretation guides with accurate field annotations and link the developer guides only after those pages ship. Secrets remain placeholders and environment-variable names; never publish credentials.

CSV import topic 23 still requires actual Excel and Google Sheets import proof. Handoff topic 24 requires the receiver flow, beyond local encode/decode tests. Tool comparison topic 22 requires documented hands-on capability checks and current official access/cost evidence. These requirements must remain open if the relevant proof is missing.

## Implementation checkpoint: local verification

Topics 05/06/27/28/29/30 are locally implemented, not yet marked shipped. Four developer-guide pairs add runnable original code and an export-reference schema; existing provider interpretation pairs now use field maps and explicit status/scope boundaries. The ten-file ZIP was independently extracted and installed with npm ci, then passed all 26 offline checks and four export-family validations. Repository tests also validate real service/selection/comparison producer outputs with synthetic stubs: 75 total tests passed. Build and 63-route SEO QA passed. Twelve affected guides have no document overflow at 390x844; the fast mobile batch did not establish bottom reach. Code-copy UI reports success; browser clipboard bridge equality is NOT PROVEN. No paid provider call or new real output.

Production publication and the six-topic shipped count remain gated on the exact deployment SHA, staged EN/DE runtime flags, live route/download checks and public browser verification.

## Publication checkpoint

The six-topic slice is live and verified at 2026-10-10T11:19:00.507Z. Commit `53950193d0c65f29a4034e582756386717ccaa1a`, deployment `dpl_FTagB4H5wcERADDRn7azz1AuRiMa` was READY with the exact commit metadata, staged EN/DE modes true, and explicitly promoted. Public SEO audit passed 63/63 canonicals with no warnings/failures; 44/44 templates/code/schema downloads returned 200, noindex and exact source bytes. The public browser journey from German Implement through Gemini parser/schema to the testkit passed; the ZIP was independently run before publication and its deployed bytes match. Goal remains active at 18/30 topics (36/60 URL work items), with all twelve remaining topics open. No ranking gain is established.

Import preflight: connected-document discovery found no Excel session. This does not prove Excel is unavailable by every other supported route; actual Excel/Sheets import remains a required pending check, not replaced by a CSV parser or a synthetic claim.

## Fourth release checkpoint

Interpretation/application slice: topics 04/07/09/10/11/12/13/20/21 are live verified at 2026-10-10T12:02:53.471Z, product commit a14a4365e9d1295976555a0f4ca04e0265b3f9a7, deployment dpl_3CoAAkSDNCkwpRoKrUfUHaQ24jSA. Inventory 67 canonical URLs, 71 noindex download assets, all passed. Goal is 27/30 topics and 54/60 URL work items. The actual selection exporter and independent CSV readback pass with synthetic records; this does not complete topic 23. Actual capability tests, Excel/Sheets imports and receiver handoff remain the final three proof requirements. No new paid provider call or actual grounding data was acquired.

## Fifth release checkpoint

Topics 22/24 are live verified at `2026-10-10T12:53:51.287Z`, product commit `6ca60f3f3315d78ffe400311a7fd50707e094c8c`, READY/promoted deployment `dpl_6iHzCpJwFHPTrdrNJHS7u7dEmY4q`. Full 71-canonical audit has no warnings/failures; all 82 downloads are exact source bytes with noindex. Live hub → capability guide → two-query selection → SEO Fanout receiver passes, including original locale/time/status and thirteen-domain scope. Actual receiver source integration confirms zero source URLs and zero invented query joins. Capability checks cover the public owner workflow; vendor rows remain current primary-documentation reviews, not account or installation tests.

Topic 23 is partially verified: actual Google Sheets UI CSV import with comma and type conversion disabled preserves all 110 cells as text. Default native conversion demonstrably damaged leading-zero/date/formula-like strings. Actual Excel import remains NOT PROVEN; an access/setup question is pending. See `SEO_LONGTAIL_IMPORT_PREFLIGHT_2026-10-10.md`. No library-authored workbook or CSV-reader check substitutes for actual Excel acceptance.

Goal remains active: **29/30 topics, 58/60 URL work items**. No new provider call, Gemini grounded corpus, subscription, indexing or ranking gain is claimed.

## Final import scope amendment

The human explicitly removed Excel on 10 October 2026: “Nein, ich habe noch kein Excel. Lass das einfach mit Excel. Mach einfach weiter.” The earlier setup question is resolved; no further Excel access or test is required. Topic 23 retains its EN/DE URLs and now covers the actually tested Google Sheets import, exact synthetic CSV, expected native text cells and localized acceptance record. Neither Excel instructions nor Excel success is claimed. The same thirty-topic / sixty-work-item objective remains active until this final release is live verified.
