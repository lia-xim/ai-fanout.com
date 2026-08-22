# ai-fanout.com

Public source repository for the indexable ai-fanout.com AI Answer Evidence Lab and its separately gated research program.

## Current state

The public site contains two browser-local tools, a 13-page research library, legal and transparency pages, and a dated reproducible synthetic example. Canonical public 200 pages are indexable. The operational /tracker and the 404 response remain noindex.

No provider benchmark dataset or trend finding exists.

## Purpose and hard boundary

The site helps people compare user-supplied observable AI answers and visible citations in their own browser, export the evidence, and define a protocol before making a trend or optimization claim.

It does not access hidden queries, private retrieval traces, ranking internals or model reasoning. Browser-local inputs are not transmitted, stored or published by ai-fanout.com. Third-party screenshots, copied text, saved model outputs and future site-run research require verified provenance and applicable rights.

Matthias Ramahi is the operator and Research Owner. He owns protocol versioning, corrections and explicit reviewer/cost status. No independent reviewer is currently assigned. Current provider/API collection budget is EUR 0 because the public tools make no provider calls.

Common ownership with Contextter is disclosed and never treated as independent corroboration.

## Content system

- /lab analyzes one to five user-supplied observations in browser memory and exports JSON or CSV after an explicit action.
- /protocol-builder creates a local, exportable draft protocol.
- /protocols/example-2026-08-22 documents exact synthetic inputs, calculations, results and limitations.
- /library and /library/[slug] form the maintained reference system.
- /methodology, /research, /datasets and /tracker separate method, planned studies, releases and operational gates.
- /transparency, /impressum and /datenschutz document ownership, sources, rights and actual data behavior.
- manifests/rights-and-sources.v1.json records evidence and rights boundaries.
- manifests/route-actions.v1.json records automatic sitemap, exclusions, redirect and 404 policy.

## Local development and verification

Run corepack pnpm install, corepack pnpm dev and corepack pnpm verify.

Rendered QA against a running preview or production URL uses PREVIEW_URL and node scripts/browser-qa.mjs.

The build creates /sitemap-index.xml and its generated child sitemap from Astro's static route graph. /sitemap.xml is a permanent compatibility redirect in Vercel. robots.txt allows crawling and references the sitemap index. Sitemap membership is not maintained as a parallel hand-written page list.

## Rights and license

Current code and copy are owner-created. External documentation and standards are linked and narrowly paraphrased. This repository grants no open-source license unless a later commit adds one explicitly.
