# ai-fanout.com

Public source repository for the `ai-fanout.com` AI Answer Evidence Lab and gated research observatory.

## Current state

Implemented noindex evidence workbench with 24 canonical content routes: a browser-local Evidence Lab, a protocol builder, legal and privacy pages, the core research, dataset, methodology, tracker and transparency surfaces, plus a curated 13-page research library.

The production deployment is available on the Vercel project alias and the custom domain. No public observation dataset or trend claim exists, and every route remains noindex. The public preview is crawlable so crawlers can see the noindex directive.

## Standalone purpose

Help people compare observable AI answers and visible citations in their own browser, export the evidence, and build a repeatable protocol before making a trend or optimization claim.

## Hard boundary

The project observes public outputs and visible sources. It does not claim access to hidden queries, private retrieval traces, ranking internals or model reasoning. Every route stays `noindex, nofollow, noarchive` until explicit launch approval and verified production evidence.

Primary portfolio relationship: `Contextter (accepted)`. Common ownership is disclosed and never treated as independent corroboration.

## Content system

- `/lab` accepts one to five user-supplied public-answer observations and calculates transparent source, coverage, stability and comparability measures locally in browser memory.
- `/protocol-builder` creates a versioned, exportable observation plan without storing or transmitting the inputs.
- `/impressum` identifies Matthias Ramahi as the operator.
- `/datenschutz` documents the actual hosting, local processing, export, analytics, font, form and storage behavior.
- `src/data/library.ts` is the typed source for all maintained library references.
- `/library` is the parent hub and category filter.
- `/library/[slug]` builds one page per accepted, distinct user job.
- Every reference includes a direct answer, primary intent, evidence state, review date, substantive sections, source IDs and related next steps.
- `manifests/rights-and-sources.v1.json` controls source provenance and unresolved publication rights.
- `manifests/route-actions.v1.json` records the current canonical routes and real-404 policy.
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

The suite validates all 24 canonical routes, the two tool contracts, unique titles and descriptions, substantive library depth, structured data, legal/privacy assertions, route status, canonicals, crawlable robots, empty noindex sitemap, broken links, evidence manifests, accessibility-critical markup and forbidden claims.

Rendered browser QA uses local Chrome after a production preview is running:

```powershell
$env:PREVIEW_URL = "http://127.0.0.1:4322"
node .\scripts\browser-qa.mjs
```

It verifies the Evidence Lab sample analysis, recurrence matrix, Protocol Builder output, library filter, mobile menu, desktop and mobile overflow, and Console/Runtime problems without adding a browser automation dependency.

## Deployment

Vercel project: `ai-fanout-com`.

Every page carries a robots meta directive and the deployment adds a global `X-Robots-Tag`. `robots.txt` allows crawling so public crawlers can receive those noindex directives. Removing noindex and publishing an indexable sitemap remain separate, explicitly gated operations. No deployment or DNS change is performed by the local build workflow.

## Rights and privacy

Current code and copy are owner-created. External documentation and standards are linked and narrowly paraphrased. Third-party screenshots, copied text, stored model outputs, and future site-run observation data require verified provenance and applicable rights before publication.

Lab and Protocol Builder inputs remain in browser memory. They are not transmitted by ai-fanout.com, are not stored in cookies or browser storage, and are included in local export files only after an explicit user action.

This public repository grants no open-source license unless a later commit adds one explicitly.
