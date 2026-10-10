# Topic 23: actual CSV import preflight

Status: partially verified; **not published and not shipped**. The accepted page pair requires actual import evidence in both Google Sheets and Excel. File-generation roundtrip evidence is a different gate.

The actual `selectedQueryExport` and `selectedQueriesCsv` producers generated a nine-record, eleven-column synthetic CSV. No provider request was made. Metadata explicitly uses `synthetic-model/no-provider-call`. Queries cover Unicode, comma, escaped quotes, embedded newline, leading zero, date-like text and harmless arithmetic/formula-like strings.

Google Sheets was tested on 10 October 2026 in a native spreadsheet with locale `de_DE`:

1. Drive native CSV conversion retained Unicode, comma, quotes, newline and run metadata, but automatically changed `00123` into number `123`, `2026-10-10` into date serial `46305`, and `=1+1` into a formula with result `2`. This import fails string fidelity.
2. The same actual CSV was uploaded through **File → Import → Upload** in the Sheets UI, inserted as a new sheet, with **Comma** delimiter and **Convert text to numbers, dates, and formulas disabled**.
3. Native cell readback and independent Python CSV comparison verified all **110 cells** (header plus nine records, eleven columns). All nonblank values are native strings; no formulas or numeric/date conversions remain. No post-import repair was applied.

Private proof, including original file, before/after native cells, UI option screenshot and verification script:
`C:/Users/matth/Documents/AI Fanout SEO/2026-10-10/goal-wave-a-05/`

Excel import remains **NOT PROVEN**. Connected-document discovery returned no Excel session at the preflight time; this does not establish that Excel is absent or that all access routes are unavailable. An asynchronous access/setup question is pending. Neither an XLSX created by a library nor a Sheets roundtrip will be substituted for the required actual Excel import.

Prepared Excel acceptance: import this CSV as UTF-8/comma while preserving text, then compare all eleven columns, nine records, original strings, timestamps, locale and empty native intent/reason fields. Record actual application/version and import route. Official Microsoft documentation on Text/CSV and data types was checked; documentation alone is not executed import proof.

Primary references:

- [Microsoft Power Query Text/CSV connector](https://learn.microsoft.com/power-query/connectors/textcsv)
- [Microsoft: add or change data types](https://support.microsoft.com/en-us/excel/add-or-change-data-types-power-query)

The complete bilingual page pair remains pending until Excel acceptance passes.
