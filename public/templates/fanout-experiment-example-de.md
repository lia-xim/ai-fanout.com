# Wiederholungsübung — vollständig synthetisch

Erfundene Protokollzustände, keine Provider-Antworten. Es wird kein neuer Lauf, Kostenwert, Benchmark oder Kunden-Ergebnis berichtet.

Frage: Kann die Auswertung einen abgeschlossenen Lauf ohne Query-Feld von einem Timeout unterscheiden?

Bedingungen: fiktives festes Thema „SEO tools“, Englisch, alle Länder, nativer Ausgabetyp. Provider-/Modellkennungen bleiben Platzhalter; keine tatsächlichen API-Bedingungen werden behauptet. Kostengrenze: durch diese Übung sind keine Anfragen autorisiert.

Vorab festgelegte Regeln:

- Ein abgeschlossener Lauf ohne sichtbare Query-Strings zählt als abgeschlossene Null-Query-Beobachtung.
- Ein Timeout hat eine unbekannte Query-Zahl und gehört nicht in den Nenner abgeschlossener Läufe.
- Nur exakte offengelegte Strings vergleichen; keine Queries oder Quellenbeziehungen erfinden.
- Rohe Provider-Ausgabe ist nicht enthalten. Öffentliches Material ist allein dieses eigene redaktionelle Register.

| Versuch | Zeit | Abschlussstatus | Sichtbare Queries | Kosten | Abweichung |
|---|---|---|---|---|---|
| A | fiktiv T0 | completed | 0 | keine verursacht | kein Query-Feld im erfundenen Fall |
| B | fiktiv T0 + 1 | timeout | unbekannt | keine verursacht | keine abgeschlossene Antwort |

Nenner abgeschlossener Läufe: 1. Fehler-/Timeout-Versuche: 1, separat berichtet. Die Aussage „Zwei Läufe lieferten keine Queries“ ist selbst in dieser Übung falsch.

Gezeigt wird nur die Statusauswertung. Die Übung sagt nichts über Suchwahrscheinlichkeit, Stabilität, Rankings oder Consumer-Verhalten eines tatsächlichen Providers. Für echte Forschung alle Bedingungen ersetzen und nötige Kosten-/Rechtefreigaben klären. Aufbewahrtes Material nach erlaubter Frist löschen.
