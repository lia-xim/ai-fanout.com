# Archived topic 23 preparation — superseded by tested Sheets guide

Human scope amendment on 10 October 2026 removes Excel entirely. Final reviewed content is in `src/data/import-query-guide.ts`; original Excel draft below is historical, unexecuted and excluded from publication.

Target pair: `/library/import-fanout-csv` ↔ `/de/lernen/fanout-csv-importieren`.

Publication gate: actual Excel import of the same actual-producer synthetic CSV, verified native values/types and recorded application/version. Google Sheets is already verified. The following copy is prepared material; the Excel chapter must be completed from actual results before the pair enters the article and sitemap registries. No separate Excel/Sheets pages.

## German draft

**Titel:** Fanout-CSV in Excel und Google Sheets importieren: Strings und Laufdaten erhalten

**Antwort:** Eine Fanout-CSV wird nicht allein dadurch korrekt übernommen, dass die Tabelle lesbar aussieht. Prüfe nach dem Import die Zahl der Datensätze und Spalten, exakte Strings und ihre Typen. Automatische Umwandlung kann führende Nullen entfernen, Datumsphrasen in Datumswerte verwandeln oder formelähnliche Texte berechnen. Unser synthetischer Lehrfall macht diese Unterschiede sichtbar und enthält keine neuen Provider-Ausgaben.

### 1. Den tatsächlichen Exportumfang erkennen

Der Query-Auswahl-Export hat elf Spalten: `keyword,provider,model,observed_at,country,language,evidence_status,query_index,query,intent,reason`. Unser Test verwendet neun eigene Strings und die tatsächlichen Exportfunktionen der Website. Die Modellangabe `synthetic-model/no-provider-call` kennzeichnet den Strukturtest. Native `intent`- und `reason`-Felder bleiben leer.

Die Testfälle sind `Café, München`, ein String mit Anführungszeichen, ein String mit einem eingebetteten Zeilenumbruch, `00123`, `2026-10-10`, `=1+1`, `+1+1`, `-1+1` und `@SUM(1,1)`. Die Formelbeispiele sind harmlose Testtexte. Der Zeilenumbruch gehört in eine Zelle; physische Dateizeilen sind deshalb keine zuverlässige Datensatzzahl. Ein unabhängiger CSV-Reader findet neun Datensätze und elf Felder.

Bewahre die Originaldatei. Importiere sie mit UTF-8 und Komma, statt die Datei für eine lokale Trennzeichenerwartung umzuschreiben. Alle Textwerte und Laufmetadaten müssen nach dem Import unverändert sein. Der Auswahl-Export liefert keine Quellenbeziehungen und keinen vollständigen Response-Status; für diesen Kontext brauchst du den vollständigen Lauf separat.

### 2. Der tatsächlich geprüfte Google-Sheets-Weg

Im Sheets-Test vom 10. Oktober 2026 war die Tabellen-Locale `de_DE`. Die automatische native CSV-Konvertierung behielt Unicode, Kommas, Anführungszeichen, Zeilenumbruch und Laufdaten. Sie veränderte jedoch `00123` zu Zahl `123`, `2026-10-10` zu einem Datum mit internem Wert `46305` und `=1+1` zu einer Formel mit Ergebnis `2`. Das sichtbare Datum sah weiterhin richtig aus. Die nativen Zelltypen zeigten den Verlust.

Der zweite Weg verwendete dieselbe Datei: **Datei → Importieren → Hochladen**, **Neues Tabellenblatt einfügen**, Trennzeichen **Komma**. Vor dem Import wurde **Text in Zahlen, Daten und Formeln konvertieren** ausgeschaltet. Anschließend haben wir alle 110 Zellen, einschließlich Kopfzeile und leerer Felder, mit dem Original-CSV verglichen. Alle nicht leeren Werte waren Strings, ohne Zahlen- oder Formeltypen. Es gab keine nachträgliche Reparatur.

Prüfe besonders die führende Null, die Datumsphrase, den Formeltext und den eingebetteten Zeilenumbruch. Erst danach gruppierst oder sortierst du Queries. Die spätere Formatierung als Text kann eine bereits verlorene Null nicht aus dem Original wiederherstellen.

### 3. Excel — tatsächlicher Test noch einzufügen

**NOT PROVEN.** Keine Anleitung als selbst getestet veröffentlichen. Der vorbereitete Prüfweg folgt Microsofts Text/CSV-Dokumentation: Dateikodierung und Komma bewusst wählen, automatische Typenerkennung ausschalten und Textwerte vor dem Laden erhalten. Die genaue Oberfläche, verfügbare Option, Version und Abnahme müssen aus dem tatsächlichen Excel-Test ergänzt werden. Ein erzeugtes XLSX oder der Sheets-Erfolg ersetzt das nicht.

Abnahme: neun Datensätze, elf Spalten, Originalstrings, Originalzeitstempel und Locale, leere native Intent-/Reason-Felder und keine berechneten Formeln. Zeilenumbrüche in Quotes dürfen keinen zusätzlichen Datensatz erzeugen. Sämtliche Textwerte sollen mit dem Original übereinstimmen. Zahlenformat allein genügt nicht als Typbeleg.

### 4. Vom geprüften Import zur nächsten Leseraufgabe

Ein erfolgreicher Import belegt Datenübernahme. Er misst keine Suchnachfrage. Behalte die Evidenzkennzeichnung bei, wenn du Queries in Cluster oder einen GSC-Abgleich übernimmst. Eine synthetische Testzeile bleibt synthetisch, auch wenn ihre Spalten denen eines nativen Exports entsprechen.

Lege zuerst fest, welche Leseraufgabe die ausgewählten Strings unterstützen. Halte nahe Varianten zusammen und prüfe Nachfrage sowie vorhandene Seiten getrennt. Für die Übergabe an SEO Fanout gibt es einen eigenen versionierten Handoff; ein beliebiges Tabellenblatt wird nicht automatisch zu einem unterstützten Handoff-JSON.

Geplante kontextuelle Links: Export-Guide → Import-Guide → Clustering, GSC-Abgleich und Ergebnis-Schema. Originaldownload: getestete synthetische CSV plus Erwartungen/Prüfprotokoll. Kein Indexierungs- oder Rankingversprechen.

## English draft

**Title:** Import fanout CSV into Excel and Google Sheets while preserving strings and run data

**Answer:** A readable spreadsheet does not establish a correct CSV import. Check record and column counts, exact strings and native types. Automatic conversion can remove leading zeros, turn date phrases into date values or calculate formula-like text. Our synthetic exercise exposes these differences without creating new provider output.

### 1. Recognize the actual export scope

Query-selection CSV has eleven columns: `keyword,provider,model,observed_at,country,language,evidence_status,query_index,query,intent,reason`. The test uses nine original teaching strings and this website’s actual export producers. Model `synthetic-model/no-provider-call` identifies a structural test. Native `intent` and `reason` stay empty.

Cases cover `Café, München`, quotes, an embedded newline, `00123`, `2026-10-10`, `=1+1`, `+1+1`, `-1+1` and `@SUM(1,1)`. Formula-like cases are harmless test strings. The newline belongs inside one cell; physical file lines therefore do not reliably count records. An independent CSV reader recovers nine records and eleven fields.

Keep the original file. Import as UTF-8/comma rather than rewriting it for local delimiter expectations. Text values and run metadata must remain unchanged. Selection CSV supplies neither source relationships nor full response status; retain the full run separately when you need that context.

### 2. The actually checked Google Sheets route

The 10 October 2026 Sheets test used locale `de_DE`. Automatic native CSV conversion retained Unicode, commas, quotes, newline and run metadata. It changed `00123` to number `123`, `2026-10-10` to a date with underlying value `46305`, and `=1+1` to a formula evaluating to `2`. The date still looked correct; native cell types revealed the change.

The second route reused the same file: **File → Import → Upload**, **Insert new sheet**, **Comma** delimiter. **Convert text to numbers, dates, and formulas** was disabled before import. All 110 cells, including headers and blank fields, matched the original CSV. Every nonblank value was a string, without numeric or formula types. No post-import repair was applied.

Check the leading zero, date phrase, formula text and embedded newline before grouping or sorting. Formatting a damaged value as text afterwards cannot recover a lost zero from the original.

### 3. Excel — actual test still required

**NOT PROVEN.** Do not publish this chapter as personally tested. Microsoft’s Text/CSV documentation supports deliberate encoding/delimiter choices and disabling automatic type detection to preserve text before loading. Actual Excel surface, available option, version and acceptance must be recorded from a real import. A generated XLSX or successful Sheets import is not a substitute.

Acceptance: nine records, eleven columns, original strings/timestamps/locale, blank native intent/reason and no calculated formulas. Quoted newlines must not add records. All text values must match the original. Number format alone is insufficient type evidence.

### 4. Continue from verified import to the reader’s task

A successful import proves transport, not demand. Retain evidence labels during clustering or GSC matching. A synthetic row remains synthetic even when its columns match a native export.

First identify the reader task supported by selected strings. Group close variants and check demand and existing pages separately. SEO Fanout uses its own versioned handoff; an arbitrary spreadsheet is not automatically valid handoff JSON.

Planned contextual links: export → import → clustering, GSC matching and result schema. Original deliverable: tested synthetic CSV with expectations and acceptance record. No indexing or ranking promise.

## Primary documentation and private proof

- [Microsoft Text/CSV connector](https://learn.microsoft.com/en-us/power-query/connectors/text-csv), checked 10 October 2026. Documentation supports the proposed Excel controls, not executed-import proof.
- [Microsoft data types](https://support.microsoft.com/en-us/excel/add-or-change-data-types-power-query), checked 10 October 2026.
- Actual Google Sheets native readback, before/after types, UI screenshots and CSV equality report: `C:/Users/matth/Documents/AI Fanout SEO/2026-10-10/goal-wave-a-05/`.
