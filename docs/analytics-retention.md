# Umami retention policy for ai-fanout.com

Status: active from 2026-08-29. Owner: Matthias Ramahi.

## Policy

Umami page views, web-performance measurements, sessions and product events for website ID `3daeb0a6-f2e9-4a0f-8c90-8eb6763b659c` are retained for no longer than six months. Raw keywords, provider responses, query strings and source addresses are not analytics fields and must never be added to an export or retained report.

## Enforcement

Self-hosted Umami retains data indefinitely unless it is deleted. This website therefore uses a six-month full-reset cadence for the dedicated ai-fanout.com website record:

- first reset due: 2027-02-28;
- subsequent reset: every six calendar months from the completed reset date;
- responsible role: Matthias Ramahi, operator and Research Owner;
- verification: record the completion date and the returned Umami reset confirmation in the private operating log, then rerun `pnpm umami:sync-reports` if the installation removed saved reports.

Run `pnpm umami:reset -- --confirm-website=3daeb0a6-f2e9-4a0f-8c90-8eb6763b659c` only with authenticated Umami admin credentials. The command refuses to run without the exact website ID confirmation. A reset deletes the website's collected analytics data and is intentionally never part of a Vercel build or deployment.

Before each reset, aggregate conclusions may be recorded without raw events or visitor-level data. Do not export or retain person-, session- or event-level records merely to bypass the six-month limit.
