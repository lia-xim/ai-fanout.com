# ai-fanout.com

Source repository for the free AI query fanout tool, the plain-English learning area and the browser-local answer comparison tools.

## Current state

The `codex/fanout-planner-v1` release candidate makes `/` a short-question fanout tool and overview of the two main site areas. `/library` is presented as Learn and contains 21 maintained guides, including eight plain-language entry guides for distinct search and user questions. `/methodology` explains how the free tool works.

The serverless endpoint is intentionally fail-closed. It returns `503 PLANNER_NOT_CONFIGURED` unless every production safeguard and explicit public-enable flag is configured.

The current production site is not replaced by this branch. No open fanout endpoint has been deployed and no paid provider call was made.
## Planner contract

- one short question, maximum 120 Unicode code points and 256 UTF-8 bytes;
- no URLs, files, line breaks or extra request fields;
- server-side Turnstile;
- two attempts per salted 24-hour bucket and 40 global reservations per UTC day;
- atomic EUR 0.02 reservation, EUR 25 soft and EUR 30 hard monthly stops;
- exactly one allowlisted `gpt-5.4-nano` call, 700 maximum output tokens, 12-second timeout, no retry or fallback;
- strict JSON Schema plus Zod validation;
- no raw question or raw provider result stored by ai-fanout.com.

Required production variables are documented in `.env.example` and `docs/PLANNER_RELEASE_CANDIDATE.md`. Secrets are server-only and never use a `PUBLIC_` prefix. The static form additionally needs the public Turnstile site key and explicit public build flag.

## Product boundary

Planner results are hypotheses created by this tool. They do not reveal actual Google or ChatGPT queries, private retrieval traces, ranking internals, system prompts or chain of thought.

SEO Fanout is linked only after a result for the separate page/section/merge/no-action decision. Contextter is linked for broader SEO workflow. Common ownership by Matthias Ramahi is disclosed beside those links and is not independent endorsement.

The answer comparison and comparison-plan tools remain browser-local: their inputs are not transmitted or stored by ai-fanout.com. Third-party screenshots, copied text, saved model outputs and public examples require verified provenance and applicable rights.

## Development and verification

```text
corepack pnpm install
corepack pnpm verify:planner
corepack pnpm qa
vercel build
```

`verify:planner` builds the 35-page Astro site and tests input caps, strict requests, CAPTCHA, two-per-bucket and global caps, parallel hard-budget reservation, provider errors, timeout, exactly-one-call behavior, the versioned export contract and absence of raw storage. `scripts/browser-qa.mjs` checks desktop and mobile layout, the learning hub and guide, the answer comparison and the comparison-plan interaction.

The Astro sitemap is generated from canonical static routes. `/tracker`, 404 and API paths are excluded. Security headers are defined in `vercel.json`.
## Rights and license

Current code and copy are owner-created. External documentation and standards are linked and narrowly paraphrased. This repository grants no open-source license unless a later commit adds one explicitly.
