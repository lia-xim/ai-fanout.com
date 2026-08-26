# ai-fanout.com project brief

Updated: 2026-08-26

## Purpose

ai-fanout.com turns one short keyword into ten distinct, modelled follow-up searches. Each branch includes a user intent and a short explanation. The visitor chooses one of three low-cost allowlisted models and can optionally set language and country.

## Audience

- SEO and AEO practitioners exploring different user needs around a topic;
- editors and researchers planning questions before deeper research;
- site owners looking for content gaps without treating every wording as a new page;
- reviewers who need the method, privacy and cost contract to be explicit.

## Visual thesis

Keep the established Controlled Signal system: dark work surface, cool-white typography, cyan modelled-output states, restrained coral limits, ruled registers and the branch-map composition. The first viewport is the working tool. A successful run opens a large, accessible results dialog that makes the original keyword and all ten branches unmistakable.

## Public architecture

- `/` and `/de/`: tool-first homepage and modelled-fanout result modal;
- `/methodology` and `/de/methode`: exact method, model allowlist, privacy, limits and evidence boundary;
- `/library/...` and `/de/lernen/...`: paired guides about query fanout, provider observations, variability, citations and SEO use;
- `/transparency`, `/impressum`, `/datenschutz`: ownership, sources, rights and actual processing.

## Evidence boundary

“Modelled fanout” means ten follow-up searches generated from the public tool instruction and strict schema by the selected model. It is not evidence of searches performed inside ChatGPT, Gemini, Google or another product. The site never claims chain of thought, hidden queries, private retrieval actions, search volume or rankings.

## Operating gates

- server-only OpenRouter key, Turnstile secret, hostname allowlist, high-entropy salt and atomic Redis credentials;
- public Turnstile site key and explicit public enable flags;
- allowlist limited to GPT-5.6 Luna, DeepSeek V4 Flash 0731 and Gemini 3.7 Flash;
- adversarial checks for CAPTCHA, five-per-IP and 40/day limits, parallel budget enforcement, timeout, provider errors and no secret leakage;
- privacy copy kept aligned with live processing.

Matthias Ramahi is operator and Research Owner. He owns method versions, corrections, reviewer status and the EUR 25 soft / EUR 30 hard monthly cost envelope. No independent provider benchmark or retained output dataset is authorized by this release.
