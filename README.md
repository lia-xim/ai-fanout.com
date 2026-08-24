# ai-fanout.com

Bilingual Astro site for a free, bounded AI query fanout tool and a focused learning area.

## Product

A visitor enters one keyword or short question and optionally chooses language and country. One allowlisted OpenAI web-search model is called through OpenRouter. The result contains only web-search query strings and source URLs explicitly exposed by that API response. If the response does not contain query strings, the tool returns `PROVIDER_QUERY_TRACE_UNAVAILABLE`; it never substitutes generated guesses.

The site does not inspect the ChatGPT browser interface, private network traffic, system prompts, chain of thought, or private retrieval traces. One run is a dated observation, not a benchmark, keyword-volume source, or ranking forecast.

English lives at `/`, `/methodology`, and `/library/...`. German lives at `/de/`, `/de/methode`, and `/de/lernen/...`; paired pages publish reciprocal `hreflang` links. Earlier answer-comparison routes are noindex, absent from navigation, and excluded from the sitemap.

## Security and cost boundary

- keyword: 2–100 Unicode characters, at most 240 UTF-8 bytes;
- no URLs, files, line breaks, or additional request fields;
- Cloudflare Turnstile before budget reservation;
- five attempts per salted IP bucket in 24 hours and 40 site-wide per UTC day;
- EUR 0.15 reserved per request, EUR 25 soft and EUR 30 hard monthly limits;
- exactly one `openai/gpt-5.2` OpenRouter Responses call, native web search, at most eight tool calls, 400 output tokens, 12-second timeout, no retry;
- no raw keyword, provider response, search query, or source URL stored by ai-fanout.com;
- server-only secrets and an explicit `FANOUT_PUBLIC_ENABLED=true` gate.

The form and endpoint remain fail-closed until OpenRouter, Turnstile, Redis and salt secrets are configured and a live authorized response proves that the selected route preserves exact query strings.

## Verify

```text
corepack pnpm verify:planner
corepack pnpm qa
```

These commands build the static site, test the provider parser, strict input, CAPTCHA order, per-IP and global limits, parallel budget reservations, provider failures, timeout, secret isolation, bilingual canonicals/hreflang, sitemap exclusions, links and real 404 behavior.

Current code and copy are owner-created. Linked documentation is narrowly paraphrased. No open-source license is granted unless a later `LICENSE` file says otherwise.
