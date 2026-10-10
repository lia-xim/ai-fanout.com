# Auswahl -> JSON/CSV -> Wiederprüfung

Getesteter synthetischer Exportfall, 2026-10-10; kein Provider-Aufruf.
Produzent: src/scripts/fanout-selection.mjs, selectedQueryExport / selectedQueriesCsv.

1. Der synthetische Vollrun enthält drei Strings, generatedAt 2026-10-10T00:00:00.000Z, Provider openai und Modell synthetic-model/no-provider-call.
2. Die Auswahl über nullbasierte Indizes 0 und 2 enthält zwei Strings. Der JSON-Export behält einsbasierte query_index-Werte 1 und 3, nicht 1 und 2.
3. Exportiert wurden die tatsächlichen Funktionsausgaben als ausgewählte JSON-/CSV-Dateien. Der Exportzeitstempel ist ein synthetischer fixer Wert für Reproduzierbarkeit.
4. JSON wurde gegen die aktuelle Schema-Referenz validiert. CSV wurde unabhängig mit Pythons csv.reader eingelesen und Feld für Feld gegen die JSON-Auswahl geprüft: zwei Datenzeilen, elf Spalten, Unicode, Komma, Anführungszeichen und eingebetteter Zeilenumbruch erhalten.

| Kontrolle | Soll |
|---|---|
| selectedQueryCount | 2 |
| Originalindizes | 1 und 3 |
| Nicht gewählte Query | fehlt |
| observed_at | 2026-10-10T00:00:00.000Z; nicht die Exportzeit |
| intent / reason | leer in CSV; null in JSON |
| Quellen in der Auswahl | keine |

Die CSV besitzt wegen des eingebetteten Zeilenumbruchs mehr physische Textzeilen als Query-Datensätze.
Der Vollrun erhält Quellenfelder und Provider-Status; die Auswahl enthält beides nicht.
Wenn Status oder Quellenumfang benötigt werden, behalte zusätzlich den Vollrun.
Dies ist ein Export-/Datei-Roundtrip. Ein Import in Excel/Sheets und ein Browser-OS-Speichervorgang werden damit nicht behauptet.
