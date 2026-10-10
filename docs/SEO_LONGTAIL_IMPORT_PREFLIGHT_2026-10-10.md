# Topic 23: actual CSV import preflight

Status: actual Sheets import and final EN/DE production release verified. Originally both Sheets and Excel were required. On 10 October 2026 the human explicitly removed Excel: “Nein, ich habe noch kein Excel. Lass das einfach mit Excel. Mach einfach weiter.” The same EN/DE topic pair now covers the tested Sheets import; no Excel instruction or executed-import claim will be published. File-generation roundtrip evidence remains a different gate.

The actual `selectedQueryExport` and `selectedQueriesCsv` producers generated a nine-record, eleven-column synthetic CSV. No provider request was made. Metadata explicitly uses `synthetic-model/no-provider-call`. Queries cover Unicode, comma, escaped quotes, embedded newline, leading zero, date-like text and harmless arithmetic/formula-like strings.

Google Sheets was tested on 10 October 2026 in a native spreadsheet with locale `de_DE`:

1. Drive native CSV conversion retained Unicode, comma, quotes, newline and run metadata, but automatically changed `00123` into number `123`, `2026-10-10` into date serial `46305`, and `=1+1` into a formula with result `2`. This import fails string fidelity.
2. The same actual CSV was uploaded through **File → Import → Upload** in the Sheets UI, inserted as a new sheet, with **Comma** delimiter and **Convert text to numbers, dates, and formulas disabled**.
3. Native cell readback and independent Python CSV comparison verified all **110 cells** (header plus nine records, eleven columns). All nonblank values are native strings; no formulas or numeric/date conversions remain. No post-import repair was applied.

Private proof, including original file, before/after native cells, UI option screenshot and verification script:
`C:/Users/matth/Documents/AI Fanout SEO/2026-10-10/goal-wave-a-05/`

Excel import remains **NOT PROVEN**. Connected-document discovery returned no Excel session at the preflight time; this does not establish that Excel is absent or that all access routes are unavailable. The earlier asynchronous access question is resolved by the human’s instruction to omit Excel. Fresh connected-document discovery still returned no Excel session before that instruction. Neither an XLSX created by a library nor a Sheets roundtrip will be substituted for the required actual Excel import.

Archived, unexecuted Excel proposal (removed from scope): import this CSV as UTF-8/comma while preserving text, then compare all eleven columns, nine records, original strings, timestamps, locale and empty native intent/reason fields. Record actual application/version and import route. Official Microsoft documentation on Text/CSV and data types was checked; documentation alone is not executed import proof.

Primary references:

- [Microsoft Power Query Text/CSV connector](https://learn.microsoft.com/power-query/connectors/textcsv)
- [Microsoft: add or change data types](https://support.microsoft.com/en-us/excel/add-or-change-data-types-power-query)

The bilingual page pair is live verified in the final tested-Sheets release. The prior Excel acceptance below is an archived proposal and is outside the amended scope.
