# ai-fanout.com

Public source repository for the `ai-fanout.com` AI Answer Evidence Lab and gated research observatory.

## Current state

Implemented noindex evidence workbench with 22 canonical content routes: a browser-local Evidence Lab, a protocol builder, the core research, dataset, methodology, tracker and transparency surfaces, plus a curated 13-page research library.

The custom domain is connected to the Vercel preview. No public observation dataset or trend claim exists, and every route remains noindex.

## Standalone purpose

Help people compare observable AI answers and visible citations in their own browser, export the evidence, and build a repeatable protocol before making a trend or optimization claim.

## Hard boundary

The project observes public outputs and visible sources. It does not claim access to hidden queries, private retrieval traces, ranking internals or model reasoning. Every route stays `noindex, nofollow, noarchive` until explicit launch approval and verified production evidence.

Primary portfolio relationship: `Contextter (accepted)`. Common ownership is disclosed and never treated as independent corroboration.

## Content system

- `/lab` accepts one to five user-supplied public-answer observations and calculates transparent source, coverage, stability and comparability measures locally in the browser.
- `/protocol-builder` creates a versioned, exportable observation plan without storing or transmitting the inputs.

- `src/data/library.ts` is the typed source for all maintained library references.
- `/library` is the parent hub and category filter.
- `/library/[slug]` builds one page per accepted, distinct user job.
- Every reference includes a direct answer, primary intent, evidence state, review date, substantive sections, source IDs and related next steps.
- `manifests/rights-and-sources.v1.json` controls source provenance and unresolved rights.
- The site does not create pages for mere query or fan-out variations.

## Local development

```bash
corepack pnpm install
corepack pnpm dev
```

Production verification:

```bash
corepack pnpm verify
```

The suite validates all 22 canonical routes, the two tool contracts, unique titles and descriptions, substantive library depth, structured data, route status, canonicals, robots, empty noindex sitemap, broken links, evidence manifests, accessibility-critical markup and forbidden claims.

Rendered browser QA uses local Chrome after a production preview is running:

```powershell
$env:PREVIEW_URL = "http://127.0.0.1:4322"
node .\scripts\browser-qa.mjs
```

It verifies the Evidence Lab sample analysis, recurrence matrix, Protocol Builder output, library filter, mobile menu, desktop and mobile overflow, and Console/Runtime problems without adding a browser automation dependency.

## Deployment

Vercel project: `ai-fanout-com`.

Every route carries both a robots exclusion and an `X-Robots-Tag`. The custom domain is connected, but removing noindex and submitting an indexable sitemap remain separate, explicitly gated operations. No deployment or DNS change is performed by the local build workflow.

## Rights

No former-site text, code, media, identity, users or customers are reused. External documentation and standards are linked and narrowly paraphrased. AI-provider output retention and redistribution require a provider-by-provider rights review before collection or publication.

This public repository grants no open-source license unless a later commit adds one explicitly.
