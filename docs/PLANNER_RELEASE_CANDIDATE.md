# AI Fanout Planner release candidate

This branch changes the primary job of ai-fanout.com from the browser-local Evidence Lab to a bounded AI Fanout Planner. The Evidence Lab remains available at `/lab`.

## Runtime contract

- one short question: 4–120 Unicode code points and at most 256 UTF-8 bytes;
- no URLs, files, line breaks or additional request fields;
- Cloudflare Turnstile verified server-side;
- anonymous keyed bucket: two attempts per 24-hour bucket;
- global 40 reservations per UTC day;
- €25 monthly soft stop and €30 hard ceiling;
- €0.02 atomically reserved before each call;
- exactly one `gpt-5.4-nano` Responses API call, `store: false`, 700 output-token cap, 12-second timeout, no retry/fallback;
- strict JSON Schema plus runtime validation;
- Redis Lua reserve/settle operations;
- no raw question or raw provider result stored by ai-fanout.com.

## Closed-by-default deployment gate

The function returns `503 PLANNER_NOT_CONFIGURED` unless `FANOUT_PUBLIC_ENABLED=true` and every server secret exists. The static form is also disabled unless `PUBLIC_FANOUT_ENABLED=true` and a Turnstile site key is provided.

Required production variables: `OPENAI_API_KEY`, `TURNSTILE_SECRET_KEY`, `FANOUT_BUCKET_SALT`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PUBLIC_TURNSTILE_SITE_KEY`, `FANOUT_PUBLIC_ENABLED=true`, and `PUBLIC_FANOUT_ENABLED=true`.

No production deployment is permitted until the complete set is present and live abuse/cost QA passes.

