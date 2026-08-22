# ai-fanout.com project brief

Updated: 2026-08-22

## Accepted purpose

ai-fanout.com is a bounded AI Query Fanout Planner. A visitor enters one deliberately short question and receives four to eight planner-generated longtails or subquestions with intent, rationale, suggested source type, explicit assumption, model ID, method version and planner version.

The output is a planning hypothesis. It is never presented as an actual or recovered Google query, ChatGPT subquery, private retrieval trace, system prompt, ranking internal or chain of thought. The browser-local Answer Evidence Lab remains a useful secondary tool at `/lab`.

## Audiences

- Primary: SEO, AEO, editorial and research practitioners exploring a question before deciding what deserves evidence or content.
- Secondary: publishers and site owners checking for distinct user intents, ambiguity and source needs.
- Tertiary: reviewers auditing the planner contract, limitations, privacy and costs.

## Visual thesis

Controlled Signal is retained and sharpened into a question-to-branches composition: near-black work surfaces, cool-white type, cyan observable/planner states, restrained red boundaries, open ruled registers and a signature radial branch map. The tool is the homepage composition rather than a card in a marketing grid. Motion is limited to state and scroll transitions and respects reduced-motion preferences.

## Page jobs

- `/` is the primary Planner interface and product explanation.
- `/methodology` is the exact Planner input, CAPTCHA, quota, budget, provider, output, privacy and responsibility contract.
- `/lab` is the secondary browser-local Answer Evidence Lab.
- `/protocol-builder` builds a browser-local evidence-observation protocol.
- `/research/methodology` holds the separate Evidence Lab observation method.
- `/library` and its maintained references explain fanout, observable evidence, methods and standards.
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

If those gates are not met, the production site keeps its current public Evidence Lab release and the Planner stays a closed release candidate.
