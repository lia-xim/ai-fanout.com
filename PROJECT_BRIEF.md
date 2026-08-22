# ai-fanout.com project brief

Updated: 2026-08-23

## Accepted purpose

ai-fanout.com has two clear public areas. The first is a free AI query fanout tool: a visitor enters one short question and receives four to eight suggested follow-up questions with intent, reason, useful source type, an assumption to check, model ID, method version and tool version.

The second is a large, maintained learning area. It answers practical questions about query fanout, reviewing a plan, choosing sources, comparing planning methods and deciding whether a branch needs a page, a section, more research or no action. The answer comparison at `/lab` and comparison planner at `/protocol-builder` remain useful browser-local tools.

Tool output is a planning hypothesis. It is never presented as an actual or recovered Google query, ChatGPT subquery, private retrieval trace, system prompt, ranking internal or chain of thought.
## Audiences

- Primary: SEO, AEO, editorial and research practitioners exploring a question before deciding what deserves evidence or content.
- Secondary: publishers and site owners checking for distinct user intents, ambiguity and source needs.
- Tertiary: reviewers auditing the planner contract, limitations, privacy and costs.

## Visual thesis

Controlled Signal is retained without a visual redesign: near-black work surfaces, cool-white type, cyan states, restrained red boundaries, open ruled registers and the signature branch map. The content rewrite uses the existing composition, spacing, type, color and interaction system. Motion remains limited to state and scroll transitions and respects reduced-motion preferences.

## Page jobs

- `/` introduces both public areas and contains the free tool.
- `/library` is visibly named Learn and leads with eight plain-English, question-based guides before the advanced references.
- `/methodology` explains the tool input, CAPTCHA, quota, budget, provider, output, privacy and responsibility contract in plain language.
- `/lab` is visibly named Compare AI answers and remains browser-local.
- `/protocol-builder` is visibly named Plan an answer comparison and remains browser-local.
- `/research/methodology` documents the separate answer-comparison calculations.
- `/research`, `/datasets` and noindex `/tracker` remain gated research surfaces and never imply a published benchmark.
- `/transparency`, `/impressum` and `/datenschutz` disclose ownership, sources, rights, operator responsibility and actual data behavior.
## Server and cost contract

- 4–120 Unicode code points and at most 256 UTF-8 bytes; no URLs, files, line breaks or additional request fields.
- Cloudflare Turnstile verified server-side before reservation.
- Two anonymous attempts per salted 24-hour bucket and 40 global reservations per UTC day.
- EUR 0.02 reserved atomically per request; EUR 25 monthly soft stop and EUR 30 hard ceiling.
- Exactly one allowlisted `gpt-5.4-nano` Responses API call with `store: false`, 700 maximum output tokens, 12-second timeout and no retry or fallback.
- Strict JSON Schema and runtime validation; four to eight result branches only.
- No raw question or raw provider output stored by ai-fanout.com. Operational records contain keyed hashes, versions, status, token counts, cost and latency.
- Function and form remain closed unless every production secret and explicit enable flag is present.

## Rights and identity boundaries

- Matthias Ramahi is operator and Research Owner. He owns protocol versions, corrections, reviewer status and the monthly cost envelope.
- Common ownership with SEO Fanout and Contextter is disclosed beside contextual result handoffs; neither is independent corroboration.
- Third-party screenshots, copied text, saved model outputs and public examples require verified provenance, applicable rights and review.
- No retained provider-output dataset, benchmark or trend claim is authorized by this release candidate.

## Launch gates

The static public website remains indexable under the prior owner approval. The new Planner endpoint must not be enabled in production until OpenAI, Turnstile, high-entropy bucket salt and atomic Redis credentials exist and live adversarial QA proves CAPTCHA, the 24-hour and daily caps, parallel hard-budget enforcement, timeouts, provider failures, secret isolation and exact privacy behavior.

If those gates are not met, the public website can publish the learning and browser-local tools, while the free fanout form stays disabled.
