# Observed-query tool release candidate

Updated: 2026-08-24

The public product accepts one short keyword, optional country and language, then makes one bounded OpenAI web-search call through OpenRouter. It returns only query strings and source URLs exposed in the provider response. Missing query fields produce `PROVIDER_QUERY_TRACE_UNAVAILABLE`; generated substitutes are forbidden.

## Limits

- 2–100 Unicode characters and at most 240 UTF-8 bytes;
- Turnstile before reservation;
- five attempts per salted IP bucket per 24 hours; 40 site-wide per UTC day;
- EUR 0.15 reserve per run; EUR 25 soft and EUR 30 hard monthly stops;
- one `openai/gpt-5.2` Responses call, native web search, eight tool calls, 400 output tokens, 12 seconds, no retry;
- no raw keyword, query, source or provider response stored;
- server-only secrets and explicit public enable flags.

## Open gate

OpenRouter web search is documented, but exact search-query preservation for the selected route remains NOT PROVEN. Do not set `FANOUT_PUBLIC_ENABLED=true` or build with `PUBLIC_FANOUT_ENABLED=true` until an authorized live fixture proves the response shape and all abuse/cost tests pass against production infrastructure.
