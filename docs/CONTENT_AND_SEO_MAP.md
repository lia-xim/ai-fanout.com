# Content and SEO map

Updated: 2026-08-23

This file combines the evidence register, page-action matrix, and hub-and-cluster map for the current content release. It does not predict rankings.

## Product model

ai-fanout.com has two public jobs:

1. A free tool that turns one short question into four to eight suggested follow-up questions with intent, reason, source type, and an assumption to check.
2. A plain-English learning area that helps a reader understand query fanout, review a plan, choose sources, and decide whether a branch needs a page, a section, more research, or no action.

The existing visual system remains unchanged. Navigation and copy use task-based names instead of internal product language.

## Evidence register

### Verified

- ai-fanout.com is a fresh registration owned and operated by Matthias Ramahi.
- The local production build creates 35 pages: 34 canonical public pages plus the 404 page.
- The generated sitemap contains canonical, indexable 200 pages and excludes `/tracker`, `/404`, and API paths.
- The public fanout form is fail-closed without the required provider, CAPTCHA, quota-ledger, and enable configuration.
- The answer comparison and comparison-plan tools run in the browser. Their scripts do not use `fetch`, `XMLHttpRequest`, `sendBeacon`, `localStorage`, or `sessionStorage`.
- The content registry contains 21 maintained guides. The eight plain-language entry guides appear before the advanced research references.
- The rights and source details used by the articles are recorded in `manifests/rights-and-sources.v1.json`.
- Local browser QA passed at 1440×1000 and 390×844 without horizontal overflow or console errors.

### Supported

- Google publicly documents query fan-out for named AI search surfaces. This supports a mechanism-level explanation, not a claim about the exact private searches used for one answer.
- Google guidance supports helpful, people-first pages and rejects scaled pages created mainly to manipulate search results.
- W3C PROV, FAIR principles, RFC 3339, and NIST AI RMF support the advanced provenance, data, time, and risk guidance where cited.

### Hypothesis

- Readers who search for a definition need a shorter answer than readers who need a measurement or audit method.
- Comparison queries such as fanout versus keyword clustering or topic clusters can attract readers who are choosing a planning method.
- Question-led titles and early short answers should improve comprehension and may improve search-result relevance. Search performance is not yet proven.

### Experiment

- Measure impressions, clicks, average position, and query-page fit for the eight new guides after indexing is independently proven in Search Console.
- Review whether visitors move from the homepage to the free tool, learning hub, examples, and answer comparison once analytics is deliberately approved and configured. No analytics is active now.
- Consolidate any new guide that receives the same query set and serves the same user job as an existing guide.

### Rejected

- Claims that this site reveals hidden Google or ChatGPT searches, retrieval traces, system prompts, or chain of thought.
- A page for every generated phrase, keyword variation, location, or People Also Ask question.
- Bulk AI articles, invented examples, provider benchmarks without a protocol, and portfolio-wide footer links.
- Treating Contextter or SEO Fanout as independent validation; common ownership must remain clear.

## Page-action matrix

| URL | Action | Primary user job | Notes |
| --- | --- | --- | --- |
| `/` | Keep and strengthen | Try the free tool and understand the two-part site | Tool remains disabled until all server safeguards are configured. |
| `/library` | Keep and rename visibly to Learn | Choose the right guide | Plain-language guides appear first; advanced references remain available. |
| `/library/how-query-fanout-works` | Add | Understand the process | Plain explanation and clear hidden-query boundary. |
| `/library/how-to-check-a-fanout-plan` | Add | Review a generated plan | Relevance, overlap, evidence, and destination checklist. |
| `/library/when-does-a-subtopic-need-its-own-page` | Add | Choose page versus section | Rejects keyword-only page multiplication. |
| `/library/how-to-choose-sources-for-ai-content` | Add | Match claims to source types | Includes date, scope, method, and conflict checks. |
| `/library/query-fanout-vs-keyword-clustering` | Add | Choose between exploration and clustering | States that neither output alone decides publication. |
| `/library/query-fanout-vs-topic-clusters` | Add | Understand plan versus site architecture | Separates question maps from maintained page clusters. |
| `/library/can-tools-see-hidden-ai-queries` | Add | Check a hidden-query claim | Direct answer: normally no; modelled branches are not recovered traces. |
| `/library/query-fanout-examples` | Add | See useful branch examples | Owner-created examples only; no provider benchmark. |
| `/methodology` | Keep, simplify visibly | Understand tool inputs, limits, privacy, and cost controls | Exact technical controls remain stated in plain language. |
| `/lab` | Keep, rename visibly to Compare AI answers | Compare user-supplied public answers locally | No upload or provider call. |
| `/protocol-builder` | Keep, rename visibly to Plan an answer comparison | Create a repeatable comparison plan locally | Creates a draft; does not run or publish a study. |
| `/protocols/example-2026-08-22` | Keep | Inspect a reproducible synthetic example | Explicitly not a provider benchmark. |
| `/library/*` existing advanced references | Keep | Answer distinct research and measurement jobs | Review for readability as evidence or user feedback identifies specific problems. |
| `/research`, `/datasets` | Keep | Explain future research state and data boundaries | No public provider dataset or trend claim. |
| `/tracker` | Keep noindex | Show operational research status | Excluded from sitemap. |
| unknown paths | 404 | State that no reviewed page exists | No catch-all redirect. |

## Hub-and-cluster map

```text
Homepage
├── Free tool
│   └── How the tool works
├── Learn
│   ├── Basics
│   │   ├── How query fanout works
│   │   └── Can tools see hidden AI queries?
│   ├── Review a plan
│   │   ├── How to check a fanout plan
│   │   ├── When a subtopic needs its own page
│   │   └── How to choose sources
│   ├── Compare methods
│   │   ├── Fanout vs keyword clustering
│   │   └── Fanout vs topic clusters
│   ├── Examples
│   │   └── Query fanout examples
│   └── Advanced research references
└── Compare AI answers
    ├── Plan an answer comparison
    ├── Worked synthetic example
    └── Detailed calculation method
```

## Ownership and maintenance

Matthias Ramahi owns tool versions, content corrections, reviewer status, and the monthly cost boundary. Review a page when a cited provider feature changes, a source disappears, a factual error is reported, the tool contract changes, or Search Console shows sustained overlap between two pages. Do not publish on a fixed cadence merely to create volume.
