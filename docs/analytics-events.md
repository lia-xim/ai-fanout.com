# Analytics event contract

Status: active from 2026-08-29. Owner: Matthias Ramahi.

Umami receives normal page views and Core Web Vitals only on `ai-fanout.com` and `www.ai-fanout.com`. Search parameters and hash fragments are excluded and browser Do Not Track is respected.

## Product events

| Event | Allowed dimensions | Purpose |
| --- | --- | --- |
| `tool_mode_selected` | `mode` | Native versus modelled demand |
| `tool_run_blocked` | `mode`, `provider`, bounded `reason` | CAPTCHA or availability friction |
| `tool_run_started` | `mode`, `provider` | Funnel start |
| `tool_run_succeeded` | `mode`, `provider`, response status and bounded counts | Successful outcome and useful result depth |
| `tool_run_zero_query` | `mode`, `provider` | Honest no-visible-query rate |
| `tool_run_failed` | `mode`, `provider`, bounded error category | Reliability and timeout monitoring |
| `result_saved` | `mode`, `provider`, bounded query count | Local follow-up intent |
| `result_copied` | `mode`, `provider`, bounded query count | Immediate result reuse |
| `result_feedback` | `mode`, `provider`, `helpful` or `not_helpful` | Result usefulness without tool content |
| `result_workflow_advanced` | `provider`, `save` or `export` | Aggregate funnel step after a useful result |
| `result_exported` | `provider`, format, scope and bounded item count | Full, selected, comparison and Contextter exports |
| `runs_compared` | comparison type and bounded run count | Provider/date comparison use |
| `model_comparison_requested` | provider direction only | Direct comparison demand |
| `model_comparison_completed` | provider direction only | Successful second-provider comparison |
| `result_source_clicked` | `provider` | Source inspection without recording the source |
| `handoff_clicked` | `destination` | Contextual next-step use |

## Forbidden data

The client allowlist rejects raw or derived fields named like keyword, query, prompt, response, answer, source, domain, URL, user, email, IP, country or language. No tool input, provider output, source address, local-history content or user identifier is sent as custom event data.

The separate `/api/metrics` path remains a coarse Redis-backed operational counter. It does not replace Umami page analytics and does not receive raw tool content.

## Saved Umami reports

`config/umami-reports.v1.json` is the versioned source of truth for the product funnels and goals. `pnpm umami:sync-reports` creates or updates reports by name without deleting unrelated reports. The sync requires an authenticated self-hosted Umami session through `UMAMI_USERNAME` and `UMAMI_PASSWORD`, or an existing `UMAMI_API_TOKEN`; these credentials never belong in the website bundle or Vercel project.

The core funnel is split by landing-page language and measures: landing page, tool start, successful result, save or export, and a contextual handoff. Separate goals cover successful results, zero-query results, exports, completed provider comparisons and handoffs.

## Retention

The operator policy is a maximum 24-month retention period for this website's Umami records, with an annual necessity review. The enforcement procedure and deletion calendar are defined in `docs/analytics-retention.md`. Self-hosted Umami does not expire records automatically, so the documented reset remains an owner-operated task rather than a website-runtime claim.
