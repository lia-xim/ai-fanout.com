import {writeFile} from 'node:fs/promises';
import {selectedQueryExport,selectedQueriesCsv} from '../src/scripts/fanout-selection.mjs';
const dir=new URL('../public/templates/',import.meta.url);
const time='2026-10-10T12:10:00.000Z';
const queries=['Café, München','quoted "example"','first line\nsecond line','00123','2026-10-10','=1+1','+1+1','-1+1','@SUM(1,1)'];
const run={keyword:'synthetic CSV import exercise',providerId:'openai',modelId:'synthetic-model/no-provider-call',generatedAt:time,country:'DE',language:'de',evidenceStatus:'provider_exposed_native_search',queries};
const selection=selectedQueryExport(run,new Set(queries.map((_,i)=>i)));selection.exportedAt=time;
await writeFile(new URL('fanout-import.synthetic.csv',dir),selectedQueriesCsv(selection)+'\n');
const header=['keyword','provider','model','observed_at','country','language','evidence_status','query_index','query','intent','reason'];
const rows=selection.queries.map(q=>[run.keyword,run.providerId,run.modelId,time,run.country,run.language,run.evidenceStatus,String(q.index),q.query,'','']);
await writeFile(new URL('fanout-import-expectations.synthetic.json',dir),JSON.stringify({fixtureKind:'synthetic_teaching_data_no_provider_call',notice:'Original teaching strings from the actual selection export producer. Even the native evidence value is a field exercise, not a provider observation.',checkedAt:'2026-10-10',application:'Google Sheets web',spreadsheetLocale:'de_DE',encoding:'UTF-8',delimiter:',',rowsIncludingHeader:10,columns:11,comparedCells:110,allNonblankNativeValues:'stringValue',formulaOrNumberValuesAllowed:false,route:'File > Import > Upload; Insert new sheet; Comma; Convert text to numbers, dates, and formulas disabled',cells:[header,...rows]},null,2)+'\n');
for(const lang of ['en','de']){
 const de=lang==='de';
 const text=de?`# Fanout-CSV: ausgefüllte Google-Sheets-Abnahme

Geprüft: 10. Oktober 2026. Weboberfläche; Tabellen-Locale de_DE. Eigene synthetische Lehrdaten, kein Provider-Aufruf. Produzent: src/scripts/fanout-selection.mjs, selectedQueryExport und selectedQueriesCsv. Auch provider_exposed_native_search ist hier nur ein Feldtest; synthetic-model/no-provider-call kennzeichnet jede Zeile.

## Originaldatei
UTF-8, Komma, Quotes. Neun Datensätze, elf Spalten. Eingebetteter Zeilenumbruch gehört in eine Zelle. Laufzeit 2026-10-10T12:10:00.000Z, DE/de. Native intent/reason leer. Auswahl-CSV enthält keine Quellenbeziehungen und keinen vollständigen Response-Status.

## Tatsächlich ausgeführter Import
Datei → Importieren → Hochladen. Neues Tabellenblatt einfügen. Trennzeichen Komma. Text in Zahlen, Daten und Formeln konvertieren ausgeschaltet. Erst dann Daten importieren. Keine nachträgliche Zellreparatur.

## Ergebnis: PASS
110/110 Zellen einschließlich Kopfzeile und leerer Felder entsprechen dem Original. Alle nicht leeren nativen Werte sind stringValue; keine numberValue/formulaValue/boolValue. Unicode, Komma, Quotes, eingebetteter Zeilenumbruch, 00123, 2026-10-10, =1+1, +1+1, -1+1 und @SUM(1,1) bleiben unverändert. Zeitstempel, Locale und alle übrigen Metadaten bleiben erhalten.

## Aufgezeichneter Fehlversuch
Automatische native CSV-Konvertierung: 00123 → Zahl 123; 2026-10-10 → Datum mit internem Wert 46305; =1+1 → Formel mit Ergebnis 2. Unicode, Kommas, Quotes und Zeilenumbruch bestanden. Ein lesbares Datum bewies keinen erhaltenen Texttyp.

## Eigene Abnahme vor Auswertung
- Originaldatei unverändert aufbewahren.
- Zehn Zeilen inklusive Kopfzeile und elf Spalten prüfen.
- Alle Zellen gegen das Erwartungen-JSON vergleichen, nicht nur sichtbare Highlights.
- Zelltypen prüfen; Zahlenformat allein genügt nicht.
- Leere intent/reason erhalten; keine Absicht erfinden.
- Danach in einer getrennten Kopie clustern oder Nachfrage prüfen.

Prüfgrenze: konkrete Sheets-Weboberfläche und Locale am Prüfdatum. Datenübernahme ist keine Suchnachfrage, Rankingverbesserung oder Provider-Beobachtung. Nicht für andere Programme als getestet ausgeben.
`:`# Fanout CSV: completed Google Sheets acceptance

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
`;
 await writeFile(new URL(`fanout-import-checks-${lang}.md`,dir),text);
}
console.log('Built four original import assets with actual selection producers; synthetic, no provider call.');
