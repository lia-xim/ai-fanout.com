# ai-fanout.com

Public source repository for the future `ai-fanout.com` research observatory.

## Current state

Implemented noindex research-incubator website with 20 canonical content routes: the core research, dataset, methodology, tracker and transparency surfaces plus a curated 13-page research library. The library covers distinct concepts, measurements, methods, data standards and field procedures for auditing public AI answers.

No public observation dataset or trend claim exists. The Vercel deployment remains a preview, and the custom domain still resolves to registrar parking as last verified on 2026-08-22.

## Standalone purpose

Publish source-grounded research methods now and versioned observations, datasets and findings only after a repeatable protocol passes every launch gate.

## Hard boundary

The project observes public outputs and visible sources. It does not claim access to hidden queries, private retrieval traces, ranking internals or model reasoning. Every route stays `noindex, nofollow, noarchive` until explicit launch approval and verified production evidence.

Primary portfolio relationship: `Contextter (accepted)`. Common ownership is disclosed and never treated as independent corroboration.

## Content system

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

The suite validates all 20 canonical routes, unique titles and descriptions, substantive library depth, structured data, route status, canonicals, robots, empty noindex sitemap, broken links, evidence manifests, accessibility-critical markup and forbidden claims.

Rendered browser QA uses local Chrome after a production preview is running:

```powershell
$env:PREVIEW_URL = "http://127.0.0.1:4322"
node .\scripts\browser-qa.mjs
```

It verifies desktop and mobile overflow, Console/Runtime problems, the category filter, mobile menu, direct answers, section counts and source notes without adding a browser automation dependency.

## Deployment

Vercel project: `ai-fanout-com`.

Every route carries both a robots exclusion and an `X-Robots-Tag`. Connecting the custom domain, removing noindex and submitting an indexable sitemap are separate, explicitly gated operations. No deployment or DNS change is performed by the local build workflow.

## Rights

No former-site text, code, media, identity, users or customers are reused. External documentation and standards are linked and narrowly paraphrased. AI-provider output retention and redistribution require a provider-by-provider rights review before collection or publication.

This public repository grants no open-source license unless a later commit adds one explicitly.
