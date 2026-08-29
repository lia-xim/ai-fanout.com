# ai-fanout.com

Bilingual Astro site for a bounded native AI query-fanout tool and focused learning area.

## Product

Native Fanout is the primary mode. A visitor enters one short topic, chooses OpenAI or Gemini, and may select language and country. The server makes one direct provider API request with native web search enabled:

- OpenAI Responses API with GPT-5.6 Luna and the built-in `web_search` tool;
- Gemini Interactions API with Gemini 3.7 Flash and `google_search`.

The result contains only query strings and sources that the provider API exposes in that run. Query-to-source links appear only when the same provider search action supports the relationship. The summary repeats provider-grounded counts and adds no automatic topic categories. Provider usage fields drive a dated list-price estimate; provider billing remains authoritative.

Search Ideas is a clearly separate secondary mode. It uses one allowlisted OpenRouter model to generate exactly ten modelled research directions without performing web search.

## Security and cost boundary

- topic: 2–60 Unicode characters and at most 160 UTF-8 bytes;
- no URLs, files, line breaks or additional request fields;
- server-side Cloudflare Turnstile before budget reservation;
- 20 attempts per salted IP bucket in a rolling 24-hour window, with remaining runs and reset time shown after use, plus 40 site-wide per UTC day;
- shared atomic EUR 25 soft / EUR 30 hard monthly ledger;
- Native Fanout reserves EUR 0.10 per request; Search Ideas reserves EUR 0.15. These are internal safety amounts, not provider billing;
- one direct provider request, 20-second timeout and no retry;
- OpenAI is limited to eight web-search tool calls; Gemini is instructed to use no more than eight queries; both provider outputs are capped at 500 tokens, and OpenAI uses low search context. The safety reserve was reduced after the first billed-cost check;
- no raw topic or provider response stored in the ai-fanout.com server database;
- optional browser-local history stores at most 20 explicitly saved results in IndexedDB for up to 30 days, requests persistent browser storage after an explicit save, and supports multi-select comparison plus combined JSON/CSV export; origins such as ai-fanout.com and its Vercel preview never share this history;
- Gemini local saves remove Google Grounded Results and Search Suggestions before retaining query strings and run metadata;
- no account, cross-device sync or shared response cache;
- provider keys stay server-only and every public mode has an explicit enable flag.

## Analytics boundary

The live custom domain uses the owner-operated Umami instance for page views, Core Web Vitals and a strict product-event allowlist. Search parameters and URL fragments are excluded and browser Do Not Track is respected. Custom events contain only provider/mode categories, bounded counts and action types; raw topics, query strings, provider output, source addresses, local-history content and user identifiers are forbidden. The exact contract lives in `docs/analytics-events.md`.

Saved product funnels and goals are versioned in `config/umami-reports.v1.json`. Analytics records for this website have a 24-month maximum retention policy with an explicit annual necessity review and owner-run reset procedure in `docs/analytics-retention.md`; no analytics admin credential is used by the public website runtime.

## Verify

```text
corepack pnpm verify:planner
corepack pnpm qa
```

The focused tests cover both provider parsers, zero-query honesty, strict input, model/provider allowlisting, CAPTCHA order, IP/global limits, parallel budget reservations, provider errors, timeout and secret isolation.

The bilingual `/examples` and `/de/beispiele` sections use a dated OpenAI observation fixture for country, repeat-run and comparison-source examples. The OpenAI-vs-Gemini page is a local comparison protocol rather than a published Gemini transcript.

Current code and copy are owner-created. Linked documentation is narrowly paraphrased. No open-source license is granted unless a later `LICENSE` file says otherwise.
