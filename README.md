# ai-fanout.com

Bilingual Astro site for a bounded native AI query-fanout tool and focused learning area.

## Product

Native Fanout is the primary mode. A visitor enters one short topic, chooses OpenAI or Gemini, and may select language and country. The server makes one direct provider API request with native web search enabled:

- OpenAI Responses API with GPT-5.6 Luna and the built-in `web_search` tool;
- Gemini Interactions API with Gemini 3.7 Flash and `google_search`.

The result contains only query strings and sources that the provider API exposes in that run. It is not a capture of the ChatGPT or Gemini consumer interface and never claims chain of thought or private retrieval traces.

Search Ideas is a clearly separate secondary mode. It uses one allowlisted OpenRouter model to generate exactly ten modelled research directions without performing web search.

## Security and cost boundary

- topic: 2–60 Unicode characters and at most 160 UTF-8 bytes;
- no URLs, files, line breaks or additional request fields;
- server-side Cloudflare Turnstile before budget reservation;
- 20 attempts per salted IP bucket in a rolling 24-hour window, with remaining runs and reset time shown after use, plus 40 site-wide per UTC day;
- shared atomic EUR 25 soft / EUR 30 hard monthly ledger;
- Native Fanout reserves EUR 0.50 per request; Search Ideas reserves EUR 0.15;
- one direct provider request, 20-second timeout and no retry;
- OpenAI is limited to eight web-search tool calls; Gemini is instructed to use no more than eight queries; both providers were enabled after bounded direct and production fixtures, with the conservative per-request reserve retained while billed cost is monitored;
- no raw topic or provider response stored in the ai-fanout.com server database;
- optional browser-local history stores at most 20 explicitly saved results in IndexedDB for up to 30 days, with open, delete, clear and JSON/CSV export controls;
- no account, cross-device sync or shared response cache;
- provider keys stay server-only and every public mode has an explicit enable flag.

## Verify

```text
corepack pnpm verify:planner
corepack pnpm qa
```

The focused tests cover both provider parsers, zero-query honesty, strict input, model/provider allowlisting, CAPTCHA order, IP/global limits, parallel budget reservations, provider errors, timeout and secret isolation.

Current code and copy are owner-created. Linked documentation is narrowly paraphrased. No open-source license is granted unless a later `LICENSE` file says otherwise.
