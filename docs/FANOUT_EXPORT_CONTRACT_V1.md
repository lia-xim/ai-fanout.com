# AI Fanout portable export contract v1

Status: local, versioned interoperability contract. The public Planner remains disabled until its security and cost-control environment is complete.

## Consumer job

`seo-fanout.com` may later accept this document as an explicit user-controlled handoff. It must treat every branch as a planning hypothesis and apply its own page, section, merge, evidence-asset or no-action decision rules. Common ownership is not independent corroboration.

## Canonical files

- Schema: `/contracts/fanout-plan-export.schema.v1.json`
- Synthetic fixture: `/examples/fanout-plan-export.v1.synthetic.json`
- Schema identifier: `ai-fanout.export/1.0`
- Artifact kind: `planner_hypothesis_set`

The fixture is authored by Matthias Ramahi for contract validation. No provider generated it and it is not a benchmark, observation dataset, hidden query set, retrieval trace or chain of thought.

## Compatibility rules

1. Consumers must reject unknown major schema versions.
2. Consumers must reject unknown top-level and branch fields unless a later contract explicitly permits them.
3. Branch order is presentational, not a priority or demand score.
4. `evidenceState` is always `hypothesis` in v1.
5. `modelId`, `plannerVersion`, `methodVersion`, `generatedAt`, `locale` and `reviewStatus` travel with the result.
6. A consumer may enrich a copy with downstream decisions, but must not overwrite the original artifact or reinterpret it as observed provider behavior.
7. The export contains the raw user question and full generated plan. ai-fanout.com must create it only after the result is returned to the browser and must not store or transmit the exported file itself.

## Versioning policy

- Patch: documentation or fixture correction without changing accepted fields.
- Minor: optional backward-compatible fields in a new schema file.
- Major: removed, renamed or semantically changed fields.

The filename and `schemaVersion` are immutable once a consumer ships. A later version receives a new schema and fixture instead of rewriting v1.

## Rights and privacy boundary

The synthetic fixture is owner-authored. Real user exports may contain user input and provider-generated text. The user controls the downloaded file and is responsible for downstream handling. Publication, storage or aggregation of real provider output requires a separate rights, privacy, retention and review decision; this contract does not grant it.
