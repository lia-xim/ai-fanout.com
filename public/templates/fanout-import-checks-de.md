# Fanout-CSV: ausgefüllte Google-Sheets-Abnahme

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
