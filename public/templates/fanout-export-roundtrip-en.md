# Selection -> JSON/CSV -> recheck

Tested synthetic export exercise, 2026-10-10; no provider request.
Producer: src/scripts/fanout-selection.mjs, selectedQueryExport / selectedQueriesCsv.

1. The synthetic full run contains three strings, generatedAt 2026-10-10T00:00:00.000Z, provider openai and model synthetic-model/no-provider-call.
2. Selecting zero-based indexes 0 and 2 retains two strings. JSON preserves one-based query_index values 1 and 3, not 1 and 2.
3. Actual function outputs were written as selected JSON/CSV files. The export timestamp is a fixed synthetic value for reproducibility.
4. JSON was checked against the current schema reference. CSV was independently read with Python csv.reader and compared field by field with the JSON selection: two records, eleven columns, Unicode, comma, quotes and embedded newline retained.

| Check | Expected |
|---|---|
| selectedQueryCount | 2 |
| Original indexes | 1 and 3 |
| Unselected query | absent |
| observed_at | 2026-10-10T00:00:00.000Z; not the export time |
| intent / reason | empty in CSV; null in JSON |
| Sources in selection | none |

The embedded newline creates more physical text lines than query records.
The full run retains source fields and provider status; the selection contains neither.
Keep the full run too when you need status or source scope.
This proves an export/file roundtrip, not Excel/Sheets import or browser OS-save.
