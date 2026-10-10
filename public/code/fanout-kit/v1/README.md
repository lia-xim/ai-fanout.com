# AI Fanout offline teaching kit v1

Owner-created code and entirely synthetic fixtures. No provider request, credential,
private trace, Grounded Result, Search Suggestion or measured website outcome is included.
Checked against the site's source and primary API documentation on 10 October 2026.

## Run / Ausführen

Tested with Node.js 24.15.0. Extract the ZIP and open `fanout-kit-v1` in a terminal:

```sh
npm ci --ignore-scripts
npm test
npm run validate
```

The initial install downloads Ajv (8.20.0) and the locked dependency versions; it needs package-registry
access. Tests and validation then run offline. No API key or provider account is required.
To validate your own current site JSON export: `node validate.mjs path/to/export.json`.
Do not commit private files or keys when adapting the kit.

Die erste Installation lädt Ajv 8.20.0 aus der Paket-Registry. Danach laufen Tests und
Validierung offline. Es werden keine API-Schlüssel benötigt. Eigene aktuelle Site-Exporte
prüfst du mit `node validate.mjs pfad/zum/export.json`. Private Dateien gehören nicht ins Repository.

## Files and limits / Dateien und Grenzen

- `package-lock.json`: locked dependency versions for `npm ci`.
- `parsers.mjs`: pure functions for OpenAI Responses `output` and Gemini Interactions `steps`.
- `fixtures.mjs`: synthetic response shapes for parser tests, not raw API evidence.
- `parser.test.mjs`: 16 cases including partial/failed/unknown states, singular/plural queries,
  source scope, Unicode, missing fields and unsafe URLs.
- `contracts.schema.json`: Draft 2020-12 reference for four current site export families.
- `validate.mjs`: real Ajv schema validation plus documented cross-field checks.
- `exports.synthetic.json`: synthetic full native/modelled runs, a query selection and a local
  comparison. Selection and comparison are produced using the site's real export functions.
- `contract.test.mjs`: ten contract checks including negative and semantic cases.

The teaching parser preserves exact strings, duplicates and all occurrences. It counts only
OpenAI actions of type `search` as searches. Missing provider IDs/models stay null. Failed runs
have an unknown count; completed runs without exposed query strings have zero. Partial runs
with exposed strings retain their count. Absent status stays unknown. An invalid container
throws, rather than becoming zero. HTTP timeouts happen before parsing and must be handled
by your request layer.

This intentionally differs from the live site's normalized wrapper: the site caps query
strings at eight, trims/normalizes/deduplicates them, counts `web_search_call` objects and
uses some fallback metadata. It is not a drop-in replacement or a claim of full production parity.
Raw provider responses and current site exports use different contracts.

Der Lehr-Parser erhält Strings, Duplikate und Reihenfolge exakt. Er zählt bei OpenAI nur
Aktionen mit `type: search` als Suchen. Der Website-Wrapper normalisiert, dedupliziert,
begrenzt auf acht Strings und verwendet teilweise Ersatzmetadaten. Das Beispiel ersetzt
diesen Wrapper nicht. HTTP-Timeouts behandelt die Aufrufschicht, bevor ein JSON-Parser läuft.

Sources in multi-query actions stay at action scope; answer citations stay at run scope.
No per-query association is invented. The Gemini parser does not retain `google_search_result`,
`search_suggestions` or thought payloads. Dropping those fields is not a complete legal analysis
of any proposed storage or reuse. Review current provider terms before handling actual output.

## Contract boundaries / Vertragsgrenzen

The reference matches `native-fanout-tool/1.0.0`, `provider-native-search/1.0`,
`modelled-fanout-tool/2.0.0`, `openrouter-structured-fanout/2.0`,
`ai-fanout.query-selection/1.0` and `ai-fanout.local-comparison/1.0`.
Full runs do not emit a root `schemaVersion`. The schema file's v1 is a reference-artifact
version, not a fabricated field in exported data. It rejects the older
`ai-fanout.export/1.0` planner contract and SEO handoff payloads, which have their own contracts.

Ajv checks the JSON shape; `validate.mjs` also checks selection/run counts, unique IDs/indexes,
analysis counts, source scope and saved Gemini stripping. This is not an exhaustive semantic
proof: it does not authenticate provenance, verify the truth of a citation, recreate all
set intersections or check current model availability/prices. Synthetic zero usage is a
placeholder, not a cost claim. Timestamps are checked for the serialized ISO shape, not
for freshness or calendar validity. Schema acceptance never turns ideas into observed queries.

## Source and rights / Herkunft und Rechte

Original educational files by the owner of ai-fanout.com. You may copy and adapt these
original kit files for your own implementation. This permission does not cover any
third-party output, documentation or private data added later.

Primary references: https://developers.openai.com/api/docs/guides/tools-web-search,
https://ai.google.dev/api/interactions-api and https://ajv.js.org/json-schema.html.
No provider documentation or SDK is bundled. ai-fanout.com, SEO Fanout and Crawl Foundry
share owner Matthias Ramahi; this kit is not independent certification or a provider benchmark.
