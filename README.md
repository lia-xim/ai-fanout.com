# ai-fanout.com

Bilingual Astro site for a free, bounded AI query fanout tool and a focused learning area.

## Product

A visitor enters one keyword or short question, chooses GPT-5.6 Luna, DeepSeek V4 Flash or Gemini 3.7 Flash, and can optionally select language and country. One allowlisted model is called through OpenRouter. A strict JSON schema requires exactly ten distinct follow-up searches, each with an intent and short reason.

The output is a modelled research plan. The site does not inspect ChatGPT, Google, browser network traffic, system prompts, chain of thought or private retrieval traces, and it never labels generated branches as real hidden provider queries.

English lives at `/`, `/methodology`, and `/library/...`. German lives at `/de/`, `/de/methode`, and `/de/lernen/...`; paired pages publish reciprocal `hreflang` links.

## Security and cost boundary

- keyword: 2–100 Unicode characters, at most 240 UTF-8 bytes;
- no URLs, files, line breaks or additional request fields;
- Cloudflare Turnstile before budget reservation;
- five attempts per salted IP bucket in 24 hours and 40 site-wide per UTC day;
- EUR 0.15 reserved per request, EUR 25 soft and EUR 30 hard monthly limits;
- exactly one allowlisted OpenRouter call, 800 output tokens, 12-second timeout and no retry;
- strict ten-item JSON output contract;
- no raw keyword or provider response stored by ai-fanout.com;
- server-only secrets and explicit public enable flags.

## Verify

```text
corepack pnpm verify:planner
corepack pnpm qa
```

The checks cover strict input, model allowlisting, structured output, CAPTCHA order, IP/global limits, parallel budget reservations, provider errors, timeout, secret isolation, bilingual canonicals/hreflang, sitemap exclusions, internal links and real 404 behavior.

Current code and copy are owner-created. Linked documentation is narrowly paraphrased. No open-source license is granted unless a later `LICENSE` file says otherwise.
