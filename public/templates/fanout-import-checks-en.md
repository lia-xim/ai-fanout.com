# Fanout CSV: completed Google Sheets acceptance

Checked: 10 October 2026. Web interface; spreadsheet locale de_DE. Original synthetic teaching data, no provider request. Producer: src/scripts/fanout-selection.mjs, selectedQueryExport and selectedQueriesCsv. Even provider_exposed_native_search is only a field exercise here; synthetic-model/no-provider-call identifies every row.

## Original file
UTF-8, comma, quotes. Nine records, eleven columns. Embedded newline belongs inside one cell. Run time 2026-10-10T12:10:00.000Z, DE/de. Native intent/reason blank. Selection CSV contains no source relationships or full response status.

## Actually executed import
File → Import → Upload. Insert new sheet. Comma delimiter. Convert text to numbers, dates, and formulas disabled. Then Import data. No post-import cell repairs.

## Result: PASS
110/110 cells including header and blank fields match the original. All nonblank native values are stringValue; no numberValue/formulaValue/boolValue. Unicode, comma, quotes, embedded newline, 00123, 2026-10-10, =1+1, +1+1, -1+1 and @SUM(1,1) remain unchanged. Timestamp, locale and all other metadata survive.

## Recorded failed route
Automatic native CSV conversion: 00123 → number 123; 2026-10-10 → date with underlying value 46305; =1+1 → formula evaluating to 2. Unicode, commas, quotes and newline passed. A readable date did not establish preservation of text type.

## Your acceptance before analysis
- Retain the unchanged original file.
- Check ten rows including header and eleven columns.
- Compare every cell against the expectations JSON, not only visible highlights.
- Check cell types; number format alone is insufficient.
- Preserve blank intent/reason without inventing intent.
- Cluster or review demand in a separate working copy afterwards.

Proof boundary: one Sheets web interface and locale at the checked date. Transport is not search demand, ranking improvement or a provider observation. Do not describe other applications as tested.
