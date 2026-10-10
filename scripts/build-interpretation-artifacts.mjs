import { readFile,writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { selectedQueryExport,selectedQueriesCsv } from "../src/scripts/fanout-selection.mjs";
import { validateExport } from "../public/code/fanout-kit/v1/validate.mjs";
const root=new URL("../",import.meta.url),dir=new URL("public/templates/",root);
const corpus=JSON.parse(await readFile(new URL("public/examples/openai-observations-2026-08-27.json",root),"utf8"));
const first=corpus.observations.find(r=>r.id==="best-seo-tools-us"),repeat=corpus.observations.find(r=>r.id==="best-seo-tools-repeat");
assert.ok(first&&repeat);
const normalize=s=>s.normalize("NFKC").trim().toLocaleLowerCase("en");
const shared=first.queries.filter(q=>repeat.queries.some(other=>normalize(other)===normalize(q)));
assert.equal(shared.length,1);assert.equal(first.queries.length,4);assert.equal(repeat.queries.length,4);
const csv=rows=>rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\n")+"\n";
const put=async(name,text)=>writeFile(new URL(name,dir),text);
const checked="2026-10-10",fixtureTime="2026-10-10T00:00:00.000Z";
const syntheticRun={keyword:"synthetic export exercise",language:"en",country:"US",providerId:"openai",modelId:"synthetic-model/no-provider-call",generatedAt:fixtureTime,evidenceStatus:"provider_exposed_native_search",queries:["Café, query examples","unselected example","quoted \"example\"\nsecond line"],sources:[],searchActions:[{id:"synthetic-action",queries:["Café, query examples","unselected example","quoted \"example\"\nsecond line"],sources:[],sourceScope:"not_exposed"}],searchActionCount:1,providerResponseStatus:"completed",sourceEvidenceScope:"search_action_when_exposed",toolVersion:"native-fanout-tool/1.0.0",methodVersion:"provider-native-search/1.0",notice:"Entirely synthetic export shape, not an actual provider observation. Zero usage values are placeholders.",quota:{limit:20,used:1,remaining:19,resetAt:"2026-10-11T00:00:00.000Z"},usage:{inputTokens:0,outputTokens:0,searchActionCount:1,searchQueryCount:3,estimatedCostUsd:0,estimateKind:"list_price_estimate",pricingCheckedAt:checked,pricingBasis:"Synthetic zero placeholders, not actual billing or current pricing."}};
const selection=selectedQueryExport(syntheticRun,new Set([0,2]));selection.exportedAt=fixtureTime;
assert.equal(validateExport(syntheticRun).valid,true);assert.equal(validateExport(selection).valid,true);
await put("fanout-export-exercise-full.synthetic.json",JSON.stringify(syntheticRun,null,2)+"\n");
await put("fanout-export-exercise-selected.synthetic.json",JSON.stringify(selection,null,2)+"\n");
await put("fanout-export-exercise-selected.synthetic.csv",selectedQueriesCsv(selection)+"\n");

for(const de of [false,true]){
  const lang=de?"de":"en";
  const title=de?"Vom Thema zur belegten Seitenentscheidung":"From a topic to an evidenced page decision";
  const text=(x,y,lines,color="#e6eeee")=>lines.map((line,i)=>`<text x="${x}" y="${y+i*38}" fill="${color}" font-family="Arial,sans-serif" font-size="28">${line}</text>`).join("");
  const box=(y,height,color,lines)=>`<rect x="40" y="${y}" width="560" height="${height}" rx="8" fill="#111a1e" stroke="${color}" stroke-width="2"/>${text(65,y+46,lines,color)}`;
  const arrow=(a,b)=>`<path d="M320 ${a}V${b}" stroke="#93afb7" stroke-width="3" marker-end="url(#arrow)"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="1000" viewBox="0 0 640 1000" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${de?"Eigene Ablaufgrafik. Ein kurzes Thema führt zur Wahl zwischen nativer API-Beobachtung und modelliertem Plan. Belege und Nachfrageprüfung gehen der Seitenentscheidung voraus.":"Original workflow. A short topic leads to choosing native API observation or a modelled plan. Evidence and demand checks precede the page decision."}</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#93afb7"/></marker></defs><rect width="640" height="1000" fill="#080d10"/>${text(40,42,[de?"EIGENER LEHRABLAUF":"ORIGINAL TEACHING WORKFLOW"],"#a0b1b9")}${box(70,112,"#e6eeee",de?["1 · Thema: best SEO tools","Leser: kleines Rechercheteam"]:["1 · Topic: best SEO tools","Reader: small research team"])}${arrow(183,220)}${text(40,258,[de?"2 · Passenden Modus wählen":"2 · Choose the appropriate mode"],"#e6eeee")}${box(286,128,"#4eb4cb",de?["Native API-Beobachtung","Nur offengelegte Felder erhalten"]:["Native API observation","Preserve only exposed fields"])}${text(280,453,[de?"ODER":"OR"],"#a0b1b9")}${box(478,128,"#d3a574",de?["Modellierter Rechercheplan","Ideen, noch keine Beobachtung"]:["Modelled research plan","Ideas, not yet observations"])}<path d="M40 350H20V634H320V650" stroke="#93afb7" stroke-width="3" fill="none" marker-end="url(#arrow)"/><path d="M40 542H20" stroke="#93afb7" stroke-width="3" fill="none"/>${box(674,112,"#e6eeee",de?["3 · Belege und Nachfrage prüfen","Fehlende Daten bleiben offen"]:["3 · Check evidence and demand","Missing data remains unknown"])}${arrow(787,830)}${box(854,112,"#4eb4cb",de?["4 · Seite ergänzen oder planen","Leseraufgabe und Scope erhalten"]:["4 · Revise or plan a page","Preserve reader task and scope"])}</svg>\n`;
  await put(`query-fanout-process-${lang}.svg`,svg);
  await put(`fanout-citation-annotation-${lang}.md`,de?`# Ein Quellenlink trägt nur eine bestimmte Aussage

Eigene redaktionelle Annotation, geprüft ${checked}. Keine rekonstruierte KI-Antwort.
Nur bereits veröffentlichte normalisierte OpenAI-Beobachtungen werden verwendet.

| Eigener Satz | Beleg | Gedeckter Umfang | Offen / nicht gedeckt |
|---|---|---|---|
| Im Beispiel best-seo-tools-us sind vier Query-Strings und eine Suchaktion dokumentiert. | https://ai-fanout.com/examples/openai-observations-2026-08-27.json ; observations[id=best-seo-tools-us].queries und usage.searchActions | Dieses normalisierte Beispiel vom ${first.observedAt}. | Keine allgemeine Zahl von Suchaktionen oder private ChatGPT-Historie. |
| ahrefs.com steht im Domainset dieses Beispiels. | dieselbe Datei, sourceDomains | Domain erscheint im veröffentlichten Domainset. | Kein Link zu einer bestimmten Query, kein belegter Antwortsatz, keine Empfehlung oder Rangposition. |
| Die finale Antwort dieses Beispiels war unvollständig. | providerResponseStatus = incomplete | Der gespeicherte Teilstatus. | Die normalisierte Datei enthält keinen vollständigen Antworttext und keine rekonstruierbare URL-Zitatstelle. |
| Eine Quelle aus einer Mehrfach-Query-Aktion belegt automatisch jede Query. | Kein solcher Join in der veröffentlichten Datei. | Nicht gestützt. | Quellenumfang nicht nachträglich verfeinern. |

Ein sichtbarer Link, ein Suchaktions-Quellenfeld und ein belegter Satz sind verschiedene Dinge.
Für URL-Auflösung und inhaltliche Prüfung verwende den separaten Quellen-Audit.
Keine Suchvolumina, Sieger, Zitationswirkung oder neue Gemini-Grounding-Daten.
ai-fanout.com, SEO Fanout und Crawl Foundry haben Eigentümer Matthias Ramahi;
dieser Eigentümerbeleg ist keine unabhängige Bestätigung.
`:`# A source link supports a specific claim

Original editorial annotation, reviewed ${checked}. Not a reconstructed AI answer.
Only previously published normalized OpenAI observations are used.

| Original sentence | Evidence | Supported scope | Missing / unsupported |
|---|---|---|---|
| best-seo-tools-us documents four query strings and one search action. | https://ai-fanout.com/examples/openai-observations-2026-08-27.json ; observations[id=best-seo-tools-us].queries and usage.searchActions | This normalized example at ${first.observedAt}. | No universal search-action count or private ChatGPT history. |
| ahrefs.com appears in this example's domain set. | Same file, sourceDomains | Domain appears in the published domain set. | No individual query join, supported answer sentence, recommendation or ranking. |
| The example's final response was incomplete. | providerResponseStatus = incomplete | The recorded partial status. | The normalized file contains no complete answer text or reconstructable URL-citation span. |
| A source in a multi-query action automatically supports every query. | No such join is published. | Unsupported. | Do not invent a more precise source relationship. |

A visible link, a search-action source field and a supported sentence are different things.
Use the separate source audit for URL resolution and content review.
No search volume, winners, citation lift or new Gemini grounding data.
ai-fanout.com, SEO Fanout and Crawl Foundry share owner Matthias Ramahi;
this owner evidence is not independent confirmation.
`);
  const checklistHeader=["check_id","reader_check","evidence","scope","result","checked_at","next_action"];
  const checks=de?[
    ["http","Antwortet die eigene Ziel-URL mit 200?","Öffentlicher Live-SEO-Audit","/de/lernen/fanout-ergebnis-schema","pass","2026-10-10T11:19:00.507Z","Status und Inhalt nach neuen Änderungen erneut prüfen"],
    ["canonical","Zeigt Canonical auf diese passende Sprach-URL?","Canonical aus ausgeliefertem HTML","/de/lernen/fanout-ergebnis-schema","pass","2026-10-10T11:19:00.507Z","Nicht mit tatsächlicher Google-Canonical gleichsetzen"],
    ["robots","Ist die Seite technisch indexierbar deklariert?","Kein noindex im geprüften HTML; öffentliche Route","Eigenes ausgeliefertes HTML","pass","2026-10-10T11:19:00.507Z","Crawl-/Indexstatus separat in GSC prüfen"],
    ["discovery","Hat die Seite einen sinnvollen internen Leserweg?","63-URL-Live-Linkprüfung ohne Orphan; Lernpfad -> Schema","Eigene Website und Linkgraph","pass","2026-10-10T11:19:00.507Z","Kontext und Sprachziel bei Erweiterungen erhalten"],
    ["job","Ist die Leseraufgabe klar und mit eigenem Material lösbar?","Schema, vier synthetische Familien und ausführbarer Validator","Redaktionelle Review des Schema-Guides","reviewed","2026-10-10","Keine Rohantwort als Vollrun-Export ausgeben"],
    ["mobile","Ist der Text bei 390x844 ohne Seitenüberlauf nutzbar?","Browserprüfung der betroffenen Guides","Geprüfte Viewport-Größe; keine All-Device-Zusage","pass","2026-10-10","Andere Geräte bei konkreten Problemen prüfen"],
    ["google_index","Ist diese URL tatsächlich bei Google indexiert?","Kein URL-Inspection-Nachweis für diese URL","Google-Indexzustand","not_proven","2026-10-10","GSC URL-Prüfung und Reportdatum festhalten"],
    ["outcome","Gibt es mehr qualifizierte Klicks oder Zitate?","Keine vergleichbare Nachher-Messung","Wirkung dieser Inhaltsänderung","not_proven","2026-10-10","Messplan mit unveränderten Filtern verwenden"]
  ]:[
    ["http","Does the target return HTTP 200?","Public live SEO audit","/de/lernen/fanout-ergebnis-schema","pass","2026-10-10T11:19:00.507Z","Recheck status and content after a material change"],
    ["canonical","Does canonical point to the correct language URL?","Canonical in delivered HTML","/de/lernen/fanout-ergebnis-schema","pass","2026-10-10T11:19:00.507Z","Do not equate this with Google's selected canonical"],
    ["robots","Is the page declared technically indexable?","No noindex in checked HTML; public route","Our delivered HTML","pass","2026-10-10T11:19:00.507Z","Check actual crawling/indexing separately in GSC"],
    ["discovery","Does the page have a useful internal reader path?","63-URL live link audit without orphans; learning path -> schema","Our website and link graph","pass","2026-10-10T11:19:00.507Z","Retain context and language targets when expanding"],
    ["job","Is the reader task clear and supported by original material?","Schema, four synthetic families and runnable validator","Editorial review of the schema guide","reviewed","2026-10-10","Do not label raw responses as full-run exports"],
    ["mobile","Is text usable at 390x844 without document overflow?","Browser check of the affected guides","Checked viewport; no all-device guarantee","pass","2026-10-10","Investigate other devices when evidence warrants it"],
    ["google_index","Is this URL actually indexed by Google?","No URL Inspection proof for this URL","Google index state","not_proven","2026-10-10","Record GSC URL Inspection and report dates"],
    ["outcome","Are qualified clicks or citations increasing?","No comparable after measurement","Effect of this content change","not_proven","2026-10-10","Use a measurement plan with unchanged filters"]
  ];
  await put(`ai-search-page-checklist-${lang}.csv`,csv([checklistHeader,...checks.map(r=>[r[0],r[1],"","","not_checked","",""])]));
  await put(`ai-search-page-checklist-example-${lang}.csv`,csv([checklistHeader,...checks]));
  const controlsHeader=["factor","first_run","repeat_run","control_state","supported_conclusion","not_isolated"];
  const controls=de?[
    ["input",first.input.keyword,repeat.input.keyword,"gleich","Gleiche gespeicherte Eingabe","Verborgener Provider-Kontext"],
    ["locale",`${first.input.language}/${first.input.country}`,`${repeat.input.language}/${repeat.input.country}`,"gleich","Gleiche gespeicherte Locale","Genaue interne Locale-Anwendung"],
    ["model",corpus.model,corpus.model,"gleich","Gleiches Modelllabel","Backend-Version oder Routingänderung"],
    ["protocol",corpus.methodVersion,corpus.methodVersion,"gleich","Gleicher veröffentlichter Protokollvertrag","Suchindexzustand oder Retrieval-Ergebnis"],
    ["time",first.observedAt,repeat.observedAt,"anders","Zwei datierte Beobachtungen","Zeitwirkung gegenüber Generierungsvariation"],
    ["status",first.providerResponseStatus,repeat.providerResponseStatus,"gleich","Beide Antworten unvollständig","Keine vollständigen Antworttexte"],
    ["queries",String(first.queries.length),String(repeat.queries.length),"vier je Lauf","Eine gemeinsame exakt normalisierte Query","Semantische Gleichheit anderer Strings"],
    ["domains",String(new Set(first.sourceDomains).size),String(new Set(repeat.sourceDomains).size),"11 gegenüber 10","Domainsets unterscheiden sich","Rangposition, Seitenqualität oder einzelne Query-Quelle"]
  ]:[
    ["input",first.input.keyword,repeat.input.keyword,"same","Same recorded input","Hidden provider context"],
    ["locale",`${first.input.language}/${first.input.country}`,`${repeat.input.language}/${repeat.input.country}`,"same","Same recorded locale","Exact internal application of locale"],
    ["model",corpus.model,corpus.model,"same","Same model label","Backend version or routing change"],
    ["protocol",corpus.methodVersion,corpus.methodVersion,"same","Same published protocol contract","Search-index state or retrieval result"],
    ["time",first.observedAt,repeat.observedAt,"different","Two dated observations","Time effect versus generation variation"],
    ["status",first.providerResponseStatus,repeat.providerResponseStatus,"same","Both responses incomplete","No complete answer texts"],
    ["queries",String(first.queries.length),String(repeat.queries.length),"four per run","One shared exact normalized query","Semantic equality of other strings"],
    ["domains",String(new Set(first.sourceDomains).size),String(new Set(repeat.sourceDomains).size),"11 versus 10","Domain sets differ","Rank, page quality or individual query source"]
  ];
  await put(`fanout-controls-example-${lang}.csv`,csv([controlsHeader,...controls]));
  const comparisonRows=[
    ["id",first.id,repeat.id],["input",first.input.keyword,repeat.input.keyword],["provider / model",`${corpus.provider} / ${corpus.model}`,`${corpus.provider} / ${corpus.model}`],["language / country",`${first.input.language} / ${first.input.country}`,`${repeat.input.language} / ${repeat.input.country}`],["observedAt",first.observedAt,repeat.observedAt],["tool / method",`${corpus.toolVersion} / ${corpus.methodVersion}`,`${corpus.toolVersion} / ${corpus.methodVersion}`],["providerResponseStatus",first.providerResponseStatus,repeat.providerResponseStatus],["queries / search actions",`${first.queries.length} / ${first.usage.searchActions}`,`${repeat.queries.length} / ${repeat.usage.searchActions}`],["distinct source domains",String(new Set(first.sourceDomains).size),String(new Set(repeat.sourceDomains).size)],[de?"Query-Quellen-Join":"Query-to-source join",de?"nicht veröffentlicht":"not published",de?"nicht veröffentlicht":"not published"],[de?"vollständige finale Antwort":"complete final answer",de?"nicht veröffentlicht":"not published",de?"nicht veröffentlicht":"not published"]
  ];
  await put(`fanout-model-comparison-example-${lang}.md`,`${de?"# Zwei vorhandene OpenAI-Läufe fair vergleichen":"# Compare two existing OpenAI runs fairly"}\n\n${de?"Bereits veröffentlichte Eigentümer-Beobachtungen, kein neuer Benchmark und kein OpenAI-versus-Gemini-Ergebnis.":"Previously published owner observations, not a new benchmark or OpenAI-versus-Gemini result."}\n\n${de?"Quelle":"Source"}: https://ai-fanout.com/examples/openai-observations-2026-08-27.json\n${de?"Einordnung geprüft":"Interpretation reviewed"}: ${checked}\n\n| ${de?"Feld":"Field"} | A | B |\n|---|---|---|\n${comparisonRows.map(r=>`| ${r.join(" | ")} |`).join("\n")}\n\n${de?"Exakter Abgleich nach NFKC, trim und Kleinschreibung":"Exact matching after NFKC, trim and lowercase"}: ${shared[0]}.\n${de?"Eine von vier Queries überschneidet sich nach dieser Regel. Andere Formulierungen wurden nicht automatisch semantisch gleichgesetzt. Die Ursache der Abweichung und ein allgemeiner Modell-Sieger bleiben unbelegt. Der Vergleich betrifft zwei unvollständige OpenAI-Antworten unter einem Protokoll. Fehlende Zitatstellen werden nicht erfunden. Reale Gemini-Grounding-Daten wurden nicht hinzugefügt.":"One of four queries overlaps under this rule. Other wording was not automatically treated as semantically identical. The cause of the difference and a general model winner remain unproven. This compares two incomplete OpenAI responses under one protocol. Missing citation spans are not invented. No actual Gemini grounding data was added."}\n`);
  await put(`fanout-prompt-worked-${lang}.md`,de?`# Einen Planungs-Prompt konkretisieren

Eigenes redaktionelles Vorher-/Nachher-Beispiel, ${checked}. Keine Modellantwort und kein Nachfragebeleg.

## Vorher
"Gib mir alle Fanout-Keywords für SEO-Tools und die Seiten, die ich erstellen muss."

Offene Zielgruppe; "alle" suggeriert Vollständigkeit; "muss" setzt Seiten ohne Belege voraus.

## Nachher: kopierbarer Arbeitsauftrag
Thema: SEO-Software für ein zweiköpfiges Content-Team
Leserentscheidung: Recherchedaten und einen nachvollziehbaren Export für vorhandene Seiten auswählen
Markt/Sprache: Deutschland, Deutsch

Schlage höchstens sechs unterschiedliche Recherchefragen vor. Markiere jede als modellierte Idee.
Nenne Leseraufgabe, nötigen Primärbeleg, passende bestehende Seite und offene Daten.
Beginne mit Nutzerzugang, Preis-/Abrechnungsumfang und Exportaufgabe.
Fasse ähnliche Preisformulierungen zusammen. Erfinde keine Preise, Volumina, Rankings oder API-Suchen.
Brich eine Empfehlung ab, wenn Sitz-/Vertrags-/Exportbedingungen fehlen. Nutze dann research_required.
Eine fehlende Nachfragezeile bleibt not_checked; sie darf nicht zu null werden.

## Eigene Prüffragen, keine erzeugte Modellantwort
| Beispiel-Frage | Redaktionelle Entscheidung | Beleg / Grenze |
|---|---|---|
| Was kostet Zugang für zwei Personen? | Kostenabschnitt auf vorhandener Auswahlseite | Aktuelle Tarif- und Sitzbedingungen fehlen vor Recherche. |
| Wie hoch ist der monatliche Preis für zwei Nutzer? | Mit der vorigen Frage zusammenlegen | Gleiche Leserentscheidung, keine zweite URL. |
| Wie prüfe ich einen Query-Export nach der Auswahl? | Eigenständige Folgeaufgabe | Tatsächlichen Export und Wiederprüfung benötigen. |
| Wie konfiguriere ich einen SQL-Cluster? | Für diesen Auftrag verwerfen | Fachfremd gegenüber Content-Team-Aufgabe. |

## Abbruch / Übergang
Keine Siegerempfehlung bei unbekanntem vollständigem Preis, ungeprüften Exportrechten oder fehlenden Funktionsbelegen.
Keine Seitenfreigabe ohne passende Leseraufgabe und eigene belegbare Leistung.
Nachfrage separat in GSC/Keyworddaten prüfen. Prompt-Plan, native API-Beobachtung und Content-Brief getrennt benennen.
`:`# Make a planning prompt specific

Original editorial before/after example, ${checked}. Not a model response or demand evidence.

## Before
"Give me all fanout keywords for SEO tools and the pages I must create."

The audience is missing; "all" suggests completeness; "must" assumes pages before evidence.

## After: a copyable assignment
Topic: SEO software for a two-person content team
Reader decision: choose research data and a traceable export for existing pages
Market/language: Germany, English

Suggest at most six distinct research questions. Mark every one as a modelled idea.
Name reader task, required primary evidence, suitable existing page and unknown data.
Start with user access, billing scope and the export task.
Combine near-identical price questions. Invent no prices, volumes, rankings or executed API searches.
Stop a recommendation when seat, contract or export conditions are missing; use research_required.
A missing demand check stays not_checked, never zero.

## Original review questions, not generated model output
| Example question | Editorial decision | Evidence / boundary |
|---|---|---|
| What does access for two people cost? | Cost section on the existing selection page | Current plan and seat conditions need research. |
| What is the monthly price for two users? | Merge with the previous question | Same reader decision; no second URL. |
| How do I recheck a selected query export? | Distinct follow-up task | Needs the actual export and roundtrip check. |
| How do I configure an SQL cluster? | Remove from this assignment | Unrelated to the content-team task. |

## Stop / next step
No winner recommendation with unknown complete cost, unchecked export rights or unsupported functionality.
No page assignment without a distinct reader task and original useful evidence.
Validate demand separately in GSC/keyword data. Label prompt plan, native API observation and content brief separately.
`);
  await put(`fanout-export-roundtrip-${lang}.md`,de?`# Auswahl -> JSON/CSV -> Wiederprüfung

Getesteter synthetischer Exportfall, ${checked}; kein Provider-Aufruf.
Produzent: src/scripts/fanout-selection.mjs, selectedQueryExport / selectedQueriesCsv.

1. Der synthetische Vollrun enthält drei Strings, generatedAt ${fixtureTime}, Provider openai und Modell synthetic-model/no-provider-call.
2. Die Auswahl über nullbasierte Indizes 0 und 2 enthält zwei Strings. Der JSON-Export behält einsbasierte query_index-Werte 1 und 3, nicht 1 und 2.
3. Exportiert wurden die tatsächlichen Funktionsausgaben als ausgewählte JSON-/CSV-Dateien. Der Exportzeitstempel ist ein synthetischer fixer Wert für Reproduzierbarkeit.
4. JSON wurde gegen die aktuelle Schema-Referenz validiert. CSV wurde unabhängig mit Pythons csv.reader eingelesen und Feld für Feld gegen die JSON-Auswahl geprüft: zwei Datenzeilen, elf Spalten, Unicode, Komma, Anführungszeichen und eingebetteter Zeilenumbruch erhalten.

| Kontrolle | Soll |
|---|---|
| selectedQueryCount | 2 |
| Originalindizes | 1 und 3 |
| Nicht gewählte Query | fehlt |
| observed_at | ${fixtureTime}; nicht die Exportzeit |
| intent / reason | leer in CSV; null in JSON |
| Quellen in der Auswahl | keine |

Die CSV besitzt wegen des eingebetteten Zeilenumbruchs mehr physische Textzeilen als Query-Datensätze.
Der Vollrun erhält Quellenfelder und Provider-Status; die Auswahl enthält beides nicht.
Wenn Status oder Quellenumfang benötigt werden, behalte zusätzlich den Vollrun.
Dies ist ein Export-/Datei-Roundtrip. Ein Import in Excel/Sheets und ein Browser-OS-Speichervorgang werden damit nicht behauptet.
`:`# Selection -> JSON/CSV -> recheck

Tested synthetic export exercise, ${checked}; no provider request.
Producer: src/scripts/fanout-selection.mjs, selectedQueryExport / selectedQueriesCsv.

1. The synthetic full run contains three strings, generatedAt ${fixtureTime}, provider openai and model synthetic-model/no-provider-call.
2. Selecting zero-based indexes 0 and 2 retains two strings. JSON preserves one-based query_index values 1 and 3, not 1 and 2.
3. Actual function outputs were written as selected JSON/CSV files. The export timestamp is a fixed synthetic value for reproducibility.
4. JSON was checked against the current schema reference. CSV was independently read with Python csv.reader and compared field by field with the JSON selection: two records, eleven columns, Unicode, comma, quotes and embedded newline retained.

| Check | Expected |
|---|---|
| selectedQueryCount | 2 |
| Original indexes | 1 and 3 |
| Unselected query | absent |
| observed_at | ${fixtureTime}; not the export time |
| intent / reason | empty in CSV; null in JSON |
| Sources in selection | none |

The embedded newline creates more physical text lines than query records.
The full run retains source fields and provider status; the selection contains neither.
Keep the full run too when you need status or source scope.
This proves an export/file roundtrip, not Excel/Sheets import or browser OS-save.
`);
  const productBlank=de?`# Vergleichs-Briefing
Status: nicht ausgefüllt; keine Empfehlung.
Leser/Entscheidung:
Produkte und genaue Tarife:
Land, Währung, Abrechnungszyklus, Steuerumfang:
Personen, Aufgaben und Mengen:
Bestehende Ziel-URL:
Preis-/Sitz-Primärbelege mit Prüfdatum:
Funktionsbelege und eigene Tests:
Export-/Weitergaberechte und offene Fragen:
Nicht vergleichbare Angaben:
Nachfragebeleg:
Geplante Abschnitte und explizite Nicht-Ziele:
Freigabebedingungen / Abbruchregeln:
Nächste konkrete Recherche:
`:`# Comparison brief
Status: blank; no recommendation.
Reader/decision:
Products and exact plans:
Country, currency, billing cycle, tax scope:
People, tasks and usage quantities:
Existing target URL:
Primary price/seat sources with review date:
Feature sources and own tests:
Export/reuse rights and open questions:
Non-comparable fields:
Demand evidence:
Sections and explicit non-goals:
Publication gates / stop rules:
Next concrete research:
`;
  await put(`fanout-product-comparison-${lang}.md`,productBlank);
  await put(`fanout-product-comparison-example-${lang}.md`,de?`# Ein belegorientiertes Briefing: Ahrefs / Semrush für ein kleines Rechercheteam

Eigenes redaktionelles Beispiel, ${checked}. Keine Kundenstudie, Kaufempfehlung oder Bedienungsprüfung dieser Produkte.
Leser: zwei Personen, die Keyword-Recherche und einen nachvollziehbaren Export benötigen.
Fiktive bestehende Ziel-URL: /seo-tools ; kein Auftrag zu zusätzlicher URL je Query.

## Aktuelle Primärbelege, eng begrenzte Aussagen
| Feld | Ahrefs | Semrush | Einordnung |
|---|---|---|---|
| Veröffentlichter Tarif | Lite: USD 129/Monat | SEO: EUR 134/Monat; EUR 112,52/Monat bei jährlicher Abrechnung auf geprüfter Preisseite | Verschiedene Währungen; Monats-/Jahresumfang getrennt, kein Checkout-Angebot. |
| Zugang | Lite nennt einen enthaltenen Nutzer und zusätzliche Nutzer zu USD 40/Monat | Preisseite nennt zusätzliche Nutzer ab EUR 43/Monat | Exakter Semrush-Sitzpreis für gewählten Tarif und Steuerumfang offen. |
| Funktionsbeleg | Preisseite nennt Keywords Explorer und Site Audit | SEO-Tarif nennt Keyword-/Wettbewerbsrecherche und Site Audit | Herstellerbeschreibung, keine selbst gemessene Datenqualität. |
| Rechte / Weitergabe | https://ahrefs.com/legal/terms | https://www.semrush.com/company/legal/terms-of-service/ | Aktuelle Quellen aufgelöst; konkrete Weitergaberechte nicht abschließend bewertet. |

Preisquellen: https://ahrefs.com/pricing und https://www.semrush.com/pricing/seo-ai-search/ ; geprüft ${checked}.
Keine Währungsumrechnung, Rabattannahme oder Vollkosten-Sieger. Die zwei benötigten Zugänge sind eine Szenariovorgabe, kein beobachteter Kunde.

## Aus Fragen werden Abschnitte
- Zugang/Kosten: genauer Tarif, Nutzerzahl, Abrechnungszyklus, Steuern, mögliche Zusatzkosten; offene Werte vor Veröffentlichung auflösen.
- Aufgabe/Funktion: eine definierte Query-Recherche und ein tatsächlicher Export; gleicher Input und kontrollierte Mengen für einen eigenen späteren Test.
- Nachvollziehbarkeit: Quellen, Prüfdatum und Datenumfang neben die jeweilige Aussage.
- Rechte: konkrete veröffentlichte/exportierte Inhalte gegen die geltenden Bedingungen prüfen; ein Herstellerlink allein erteilt keine Lizenz.

## Nicht-Ziele und Stop-Regeln
Kein allgemeiner Sieger, keine Aussage über tatsächliche Datenqualität oder KI-Zitationswirkung.
Keine API-Trace-/Fanout-Behauptung über diese Produkte aus dem Auftauchen ihrer Namen in einer Suchliste.
Nachfrage bleibt not_checked. Sitzbedingungen, Vollkosten und die Exportaufgabe bleiben research_required/test_required.
Nächste Arbeit: genauen Semrush-Zugang klären; eigenen Exportversuch definieren; bestehende Auswahlseite anhand geprüfter Fragen ergänzen.
`:`# Evidence-led brief: Ahrefs / Semrush for a small research team

Original editorial example, ${checked}. Not a client study, purchase recommendation or hands-on test of these products.
Reader: two people needing keyword research and a traceable export.
Fictional existing target: /seo-tools ; no assignment to create a URL for every query.

## Current primary evidence, narrow claims
| Field | Ahrefs | Semrush | Interpretation |
|---|---|---|---|
| Published plan | Lite: USD 129/month | SEO: EUR 134/month; EUR 112.52/month billed annually on the checked page | Different currencies; separate monthly/annual scope, not a checkout quote. |
| Access | Lite lists one included user and extra users at USD 40/month | Pricing page lists additional users from EUR 43/month | Exact Semrush seat cost for the chosen plan and tax scope remain unknown. |
| Feature evidence | Pricing page lists Keywords Explorer and Site Audit | SEO plan lists keyword/competitor research and Site Audit | Vendor description, not independently measured data quality. |
| Rights / reuse | https://ahrefs.com/legal/terms | https://www.semrush.com/company/legal/terms-of-service/ | Current sources resolved; specific reuse rights not conclusively assessed. |

Price sources: https://ahrefs.com/pricing and https://www.semrush.com/pricing/seo-ai-search/ ; checked ${checked}.
No currency conversion, assumed discount or full-cost winner. Two required seats are an editorial scenario, not an observed client.

## Turn questions into sections
- Access/cost: exact plan, people, billing cycle, taxes and possible extras; resolve unknowns before publication.
- Task/function: a defined query-research task and actual export; same input and controlled quantities for a later hands-on check.
- Traceability: attach source, review date and data scope to each claim.
- Rights: check the specific proposed published/exported material against applicable conditions; a vendor link does not grant a license.

## Non-goals and stop rules
No general winner, actual data-quality verdict or AI-citation effect.
No API-trace/fanout claim about these products from their names appearing in a search list.
Demand stays not_checked. Seat terms, complete cost and the export task remain research_required/test_required.
Next: clarify exact Semrush access; define an export test; improve the existing selection page using verified questions.
`);
  const shopHeader=["question_id","editorial_question","reader_job","page_role","fictional_target","facet","source_needed","evidence_state","url_decision","reason"];
  const shopRows=de?[
    ["q1","Welche Boxen gibt es?","Verfügbare Produkte ansehen","category","/aufbewahrungsboxen","","Eigener aktueller Katalog","not_checked","existing_category","Liste und Auswahl, keine Definition"],
    ["q2","Welche Box passt in ein kleines Regal?","Maße vor dem Kauf vergleichen","buying_guide","/ratgeber/boxen-fuer-kleine-regale","dimensions","Außenmaße, Regal-Innenmaß, Freiraum","research_required","guide_section","Passform braucht mehr als ein Volumenetikett"],
    ["q3","Ist eine transparente 22-l-Box verfügbar?","Bestand eingrenzen","filter","/aufbewahrungsboxen?volumen=22l&farbe=transparent","volume/color","Katalog und tatsächlicher Filterbestand","not_checked","filter_no_new_landing_by_default","Filter ist nicht automatisch eine eigenständige Leseraufgabe"],
    ["q4","Welche Maße nennt IKEA für SAMLA 22 l?","Eine benannte Produktangabe prüfen","product_information","/produkte/beispiel-box","dimensions","https://www.ikea.com/de/de/p/samla-box-transparent-80102976/ ; 39x28x28 cm/22 l","vendor_documented","product_fact","Herstellerangabe; kein Test der Innenmaße oder Passform"],
    ["q5","Ist der Deckel im gewählten Artikel enthalten?","Genauen Lieferumfang verstehen","product_information","/produkte/beispiel-box","lid","Genaue SKU und Hersteller-/Katalog-Lieferumfang","research_required","product_fact","Ähnliche Produktnamen ersetzen keinen SKU-Beleg"],
    ["q6","Kann man diese Boxen beladen stapeln?","Nutzungsgrenze prüfen","product_information","/produkte/beispiel-box","stacking","Herstelleranleitung und erlaubte Belastung","research_required","product_fact","Keine Stapel-/Belastungsbehauptung erfinden"],
    ["q7","Welches Maß ist für die Regalöffnung relevant?","Maßprüfung vorbereiten","buying_guide","/ratgeber/boxen-fuer-kleine-regale","dimensions","Orientierung, Öffnung, Griffe und Freiraum","research_required","merge_with_q2","Gleiche Passform-Entscheidung"],
    ["q8","Welche Box ist gerade günstiger?","Aktuelle Gesamtkosten prüfen","category","/aufbewahrungsboxen","price","Aktuelle SKU-Preise, Lieferumfang und Lieferkosten","not_checked","category_information","Preise separat datieren; kein zusätzlicher Preis-Keyword-Guide"]
  ]:[
    ["q1","Which boxes are available?","Inspect available products","category","/storage-boxes","","Current owned catalogue","not_checked","existing_category","Listing and selection, not a definition"],
    ["q2","Which box fits a small shelf?","Compare dimensions before purchase","buying_guide","/guides/boxes-for-small-shelves","dimensions","Outer dimensions, shelf opening and clearance","research_required","guide_section","Fit requires more than a volume label"],
    ["q3","Is a transparent 22-litre box available?","Narrow stock selection","filter","/storage-boxes?volume=22l&colour=transparent","volume/colour","Catalogue and actual filtered stock","not_checked","filter_no_new_landing_by_default","A filter is not automatically a distinct reader task"],
    ["q4","What dimensions does IKEA list for SAMLA 22 l?","Check a named product fact","product_information","/products/example-box","dimensions","https://www.ikea.com/de/de/p/samla-box-transparent-80102976/ ; 39x28x28 cm/22 l","vendor_documented","product_fact","Manufacturer statement; no tested internal dimension or shelf fit"],
    ["q5","Does the selected item include a lid?","Understand exact included items","product_information","/products/example-box","lid","Exact SKU and manufacturer/catalogue contents","research_required","product_fact","Similar names do not establish SKU facts"],
    ["q6","Can these boxes be stacked while loaded?","Check usage limits","product_information","/products/example-box","stacking","Manufacturer instructions and supported load","research_required","product_fact","Do not invent stacking or load claims"],
    ["q7","Which measurement matters for the shelf opening?","Prepare a dimension check","buying_guide","/guides/boxes-for-small-shelves","dimensions","Orientation, opening, handles and clearance","research_required","merge_with_q2","Same fit decision"],
    ["q8","Which box is cheaper today?","Check current complete cost","category","/storage-boxes","price","Current SKU prices, contents and delivery","not_checked","category_information","Date prices separately; no extra price-keyword guide"]
  ];
  await put(`fanout-shop-map-${lang}.csv`,csv([shopHeader]));
  await put(`fanout-shop-map-example-${lang}.csv`,csv([shopHeader,...shopRows]));
}
console.log("Built 27 original interpretation/application artifacts, including three actual synthetic export outputs and two original SVG workflows.");
