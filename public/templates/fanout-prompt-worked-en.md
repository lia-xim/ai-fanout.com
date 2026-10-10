# Make a planning prompt specific

Original editorial before/after example, 2026-10-10. Not a model response or demand evidence.

## Before
"Give me all fanout keywords for SEO tools and the pages I must create."

The audience is missing; "all" suggests completeness; "must" assumes pages before evidence.

## After: a copyable assignment
Topic: SEO software for a two-person content team
Reader decision: choose research data and a traceable export for existing pages
Market/language: Germany, English

Suggest at most six distinct research questions. Mark every one as a modelled idea.
Name reader task, required primary evidence, suitable existing page and unknown data.
Start with user access, billing scope and the export task.
Combine near-identical price questions. Invent no prices, volumes, rankings or executed API searches.
Stop a recommendation when seat, contract or export conditions are missing; use research_required.
A missing demand check stays not_checked, never zero.

## Original review questions, not generated model output
| Example question | Editorial decision | Evidence / boundary |
|---|---|---|
| What does access for two people cost? | Cost section on the existing selection page | Current plan and seat conditions need research. |
| What is the monthly price for two users? | Merge with the previous question | Same reader decision; no second URL. |
| How do I recheck a selected query export? | Distinct follow-up task | Needs the actual export and roundtrip check. |
| How do I configure an SQL cluster? | Remove from this assignment | Unrelated to the content-team task. |

## Stop / next step
No winner recommendation with unknown complete cost, unchecked export rights or unsupported functionality.
No page assignment without a distinct reader task and original useful evidence.
Validate demand separately in GSC/keyword data. Label prompt plan, native API observation and content brief separately.
