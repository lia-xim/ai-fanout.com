import type { LibraryArticle } from "./library";

const planningPromptEn = `Topic: [one topic]
Audience and decision: [who needs to decide what]
Market and language: [market, language]

Suggest up to ten distinct research questions that could help this reader.
Separate wording variants from genuinely different information needs.
For each question, name the evidence needed and whether an existing page
could answer it with a section. Mark every item as a modelled suggestion.
Do not claim these are queries executed by Google, ChatGPT or Gemini.
Do not invent sources, search volume, difficulty or rankings.
Return: question | reader task | required evidence | page or section | status.`;
const planningPromptDe = `Thema: [ein Thema]
Zielgruppe und Entscheidung: [wer muss was entscheiden]
Markt und Sprache: [Markt, Sprache]

Schlage bis zu zehn eigenständige Recherchefragen für diese Leser vor.
Trenne Formulierungsvarianten von unterschiedlichen Informationsbedürfnissen.
Nenne je Frage den nötigen Beleg und ob ein Abschnitt auf einer vorhandenen
Seite genügt. Kennzeichne jeden Vorschlag als modellierte Suchidee.
Behaupte nicht, Google, ChatGPT oder Gemini hätten diese Queries ausgeführt.
Erfinde keine Quellen, Suchvolumina, Schwierigkeiten oder Rankings.
Ausgabe: Frage | Leseraufgabe | nötiger Beleg | Seite oder Abschnitt | Status.`;

export function practicalQueryGuides(de:boolean):LibraryArticle[]{
  const path=(en:string,german:string):`/${string}`=>de?`/de/lernen/${german}`:`/library/${en}`;
  const shared={reviewedAt:"2026-10-09",sourceIds:["owner-query-workflows-2026-10-09"],toolCta:{title:de?"Wähle die passende Art von Ergebnis":"Choose the right kind of result",copy:de?"Native Fanout beobachtet API-Suchen. Suchideen unterstützt die Planung ohne Websuche.":"Native fanout observes API searches. Search Ideas supports planning without web search.",button:de?"Kostenloses Tool öffnen":"Open the free tool"}};
  const prompts:LibraryArticle={...shared,number:"09",category:"Field guide",
    slug:de?"query-fanout-prompt":"query-fanout-prompt",pairedSlug:"query-fanout-prompt",
    title:de?"Query-Fanout-Prompt: Suchideen sinnvoll planen":"Query fanout prompt: plan useful research questions",
    seoTitle:de?"Query-Fanout-Prompt: Vorlage und Suchideen":"Query Fanout Prompt: Template and Search Ideas",
    shortTitle:de?"Query-Fanout-Prompt nutzen":"Use a query fanout prompt",
    description:de?"Nutze eine Prompt-Vorlage für Recherchefragen, wähle passende kurze Tool-Eingaben und trenne Suchideen von beobachteten API-Queries.":"Use a query fanout prompt template for research questions, choose short tool inputs and distinguish modelled search ideas from observed API queries.",
    primaryIntent:de?"Recherchefragen mit einem Prompt planen und den passenden Tool-Modus wählen.":"Plan research questions with a prompt and choose the appropriate tool mode.",
    answer:de?"Ein Query-Fanout-Prompt kann mögliche Recherchefragen erzeugen. Diese Vorschläge sind noch keine ausgeführten Suchen. Nutze die Vorlage für die Planung oder Native Fanout, um die sichtbaren Queries eines echten API-Websuchlaufs zu prüfen.":"A query fanout prompt can generate possible research questions. Those suggestions are not executed searches. Use the template for planning, or Native fanout to inspect the exposed queries of a real API web-search run.",
    useWhen:de?"Für einen ersten Themenplan, bevor du Suchnachfrage und Belege prüfst. Die Vorlage gehört in einen Chat oder deinen eigenen Workflow; das Tool hier nimmt nur ein kurzes Thema entgegen.":"Use this for an initial topic plan before checking demand and evidence. The template belongs in a chat or your own workflow; this site's tool accepts only a short topic.",
    sourceIds:[...shared.sourceIds,"google-ai-optimization","native-fanout-release-candidate-2026-08-26"],
    relatedSlugs:de?["was-ist-ai-query-fanout","query-fanout-fuer-seo","fanout-queries-exportieren"]:["what-is-ai-query-fanout","ai-query-fanout-for-seo","export-fanout-queries"],
    sections:[
      {id:"choose-result",title:de?"Zuerst entscheiden: Planung oder Beobachtung?":"First decide: planning or observation?",paragraphs:de?[
        "Wenn du mögliche Leserfragen sammeln willst, genügt ein Planungs-Prompt. Sein Ergebnis zeigt, was das Modell vorschlägt. Selbst eine plausible Liste belegt weder eine vorherige Websuche noch menschliche Suchnachfrage.",
        "Wenn du sehen willst, wonach ein Provider tatsächlich gesucht hat, brauchst du einen Lauf mit aktiviertem Suchtool und dessen Response. ai-fanout.com zeigt in Native Fanout nur offengelegte Query-Strings und Quellen. Fehlende Queries bleiben fehlend; ein Planungs-Prompt füllt sie nicht auf.",
        "Suchideen ist der getrennte zweite Modus dieses Tools. Er erzeugt zehn modellierte Rechercherichtungen ohne Websuche. Nutze ihn für einen Ausgangspunkt und prüfe die Vorschläge anschließend mit eigenen Daten."
      ]:[
        "If you want possible reader questions, a planning prompt is enough. Its output shows what the model suggests. A plausible list establishes neither a prior web search nor human search demand.",
        "If you want to see what a provider actually searched for, you need a run with a search tool enabled and its response. Native fanout on ai-fanout.com reports only exposed query strings and sources. Missing queries stay missing; a planning prompt does not fill them in.",
        "Search Ideas is this tool's separate second mode. It generates ten modelled research directions without web search. Use it as a starting point and check the suggestions against your own evidence."
      ],references:[{afterParagraph:1,before:de?"Den Unterschied zum Endnutzerprodukt erklärt die":"For the distinction from the consumer product, read",label:de?"Anleitung zu OpenAI-Suchanfragen":"the OpenAI search-query guide",href:path("how-to-see-openai-search-queries","openai-suchanfragen-sehen")}],decisionTable:{title:de?"Welches Ergebnis brauchst du?":"Which output do you need?",caption:de?"Wähle nach der Aufgabe, nicht nach der Länge der erzeugten Liste.":"Choose by the task, rather than by the length of the generated list.",headings:de?["Aufgabe","Geeigneter Weg","Was zu prüfen bleibt"]:["Task","Suitable route","What remains to check"],rows:de?[
        ["Mögliche Leserfragen sammeln","Planungs-Prompt oder Suchideen","Belege und Nachfrage fehlen noch."],
        ["Offengelegte Suchen prüfen","Native Fanout mit OpenAI oder Gemini","API-Lauf, sichtbare Felder und Quellenumfang."],
        ["Eine Seite verbessern","Fragen mit bestehenden Inhalten abgleichen","Eigenständige Leseraufgabe und nötige Belege."]
      ]:[
        ["Collect possible reader questions","Planning prompt or Search Ideas","Evidence and demand are still unverified."],
        ["Inspect exposed searches","Native fanout with OpenAI or Gemini","The API run, visible fields and source scope."],
        ["Improve a page","Match questions to existing content","A distinct reader task and the evidence it needs."]
      ]}},
      {id:"planning-template",title:de?"Eine Vorlage für einen überprüfbaren Themenplan":"A template for a reviewable research plan",paragraphs:de?[
        "Ersetze die drei Platzhalter durch Thema, Leserentscheidung und Markt. Bitte um Recherchefragen statt um fertige Tatsachen. Die Spalte zum Beleg zeigt dir, welche Aufgabe noch Recherche braucht.",
        "Die folgende Vorlage ist redaktionell erstellt. Sie ist kein gespeicherter Provider-Response und zeigt keine verborgenen Suchanfragen. Du kannst sie in deinen eigenen Chat kopieren; ai-fanout.com führt sie beim Lesen nicht aus.",
        "Prüfe danach jede Frage: Dient sie der Zielgruppe? Beantwortet eine bestehende Seite sie bereits? Hast du einen aktuellen Beleg? Lege verwandte Formulierungen zusammen und streiche Fragen, die keine relevante Entscheidung unterstützen."
      ]:[
        "Replace the three placeholders with the topic, reader decision and market. Ask for research questions rather than finished facts. The evidence column shows which tasks still require research.",
        "The template below is owner-written editorial material. It is not a saved provider response or a list of hidden searches. Copy it into your own chat if useful; reading this page does not execute it.",
        "Then review each question: does it serve the audience, does an existing page already answer it, and can you support it with current evidence? Combine wording variants and remove questions that do not support a relevant decision."
      ],codeSample:{label:de?"Planungs-Prompt zum Kopieren":"Planning prompt to copy",text:de?planningPromptDe:planningPromptEn},references:[{afterParagraph:2,before:de?"Aus dem Themenplan wird mit dem":"Turn that plan into a page decision with",label:de?"Query-Fanout-Workflow für SEO":"the query fanout SEO workflow",href:path("ai-query-fanout-for-seo","query-fanout-fuer-seo"),after:de?" eine konkrete Seitenentscheidung.":"."}]},
      {id:"short-inputs",title:de?"Kurze Eingaben im kostenlosen Tool wählen":"Choose short inputs for the free tool",paragraphs:de?[
        "Das Tool nimmt 2–60 Zeichen und höchstens 160 UTF-8-Bytes entgegen. URLs, Dateien und mehrzeilige Briefings gehören nicht ins Eingabefeld. Gib ein Thema ein und wähle Land und Sprache in den dafür vorgesehenen Feldern.",
        "Für eine Softwareentscheidung ist CRM für kleine Agenturen eine mögliche Eingabe. Für eine Einführung passt SEO für KI-Suche; für einen Vergleich Ahrefs vs Semrush. Diese Beispiele zeigen zulässige Themen, keine erwarteten Ergebnis-Queries.",
        "Wähle Native Fanout, wenn du sichtbare API-Suchen beobachten willst. Wähle Suchideen für einen modellierten Plan. Schließe die Sicherheitsprüfung ab und starte den Lauf selbst. Exportiere anschließend nur die Fragen, die du weiter prüfen möchtest."
      ]:[
        "The tool accepts 2–60 characters and at most 160 UTF-8 bytes. URLs, files and multiline briefs do not belong in the input field. Enter one topic and choose country and language in their separate controls.",
        "For a software decision, CRM for small agencies is a possible input. For an introduction, try SEO for AI search; for a comparison, Ahrefs vs Semrush. These are examples of acceptable topics, not predicted output queries.",
        "Choose Native fanout to observe exposed API searches or Search Ideas for a modelled plan. Complete the security check and start the run yourself. Afterwards, export only the questions you want to investigate further."
      ],references:[{afterParagraph:2,before:de?"Der nächste Schritt steht in der":"The next step is covered in",label:de?"Anleitung zum CSV- und JSON-Export":"the CSV and JSON export guide",href:path("export-fanout-queries","fanout-queries-exportieren")}]}],
    readerQuestions:[{question:de?"Kann ein Prompt die echten Google-AI-Mode-Queries zeigen?":"Can a prompt show the real Google AI Mode queries?",answer:de?"Eine erzeugte Liste ist keine Aufzeichnung einer Google-Sitzung. Google beschreibt Query Fan-out öffentlich; dieses Tool liest keine privaten AI-Mode-Queries aus.":"A generated list is not a recording of a Google session. Google publicly describes query fan-out; this tool does not read private AI Mode queries."},{question:de?"Soll ich die ganze Vorlage ins Tool eingeben?":"Should I paste the whole template into the tool?",answer:de?"Nein. Nutze dort ein kurzes Thema. Die Vorlage ist für die separate Planung in deinem eigenen Chat oder Workflow gedacht.":"No. Enter a short topic here. The template is for separate planning in your own chat or workflow."}]
  };
  const exports:LibraryArticle={...shared,number:"10",category:"Data standard",
    slug:de?"fanout-queries-exportieren":"export-fanout-queries",pairedSlug:de?"export-fanout-queries":"fanout-queries-exportieren",
    title:de?"Fanout Queries als CSV oder JSON exportieren":"Export fanout queries as CSV or JSON",
    seoTitle:de?"Fanout Queries exportieren: CSV, JSON und Historie":"Export Fanout Queries: CSV, JSON and Local History",
    shortTitle:de?"Queries exportieren und sichern":"Export and save queries",
    description:de?"Exportiere ausgewählte Fanout Queries, sichere vollständige Läufe und vergleiche die lokale Historie. Mit Feldübersicht und Grenzen für Gemini-Quellen.":"Export selected fanout queries, preserve full runs and compare local history. Includes a field guide and the limits of saved Gemini sources.",
    primaryIntent:de?"Das passende Exportformat wählen und Query-Belege beim Weiterarbeiten erhalten.":"Choose the right export format and preserve query evidence during analysis.",
    answer:de?"Markiere im Ergebnis die gewünschten Queries und nutze Keyword-CSV oder Auswahl als JSON. Für einen vollständigen aktuellen Lauf gibt es CSV laden und JSON laden. Gespeicherte Läufe lassen sich in der lokalen Historie gemeinsam exportieren; diese drei Exportumfänge enthalten unterschiedliche Felder.":"Select the queries you need and use Keyword CSV or Selected JSON in the result. Download CSV and Download JSON preserve a full current run. Saved runs can be exported together from local history; these three export scopes contain different fields.",
    useWhen:de?"Wenn du Queries in einem Tabellenprogramm prüfen, in eine Keywordliste übernehmen oder einen datierten Vergleich dokumentieren möchtest.":"Use this when reviewing queries in a spreadsheet, transferring them to a keyword list or documenting a dated comparison.",
    sourceIds:[...shared.sourceIds,"browser-local-history-2026-08-27","mdn-indexeddb-2026-10-09"],
    relatedSlugs:de?["ki-modelle-vergleichen","ki-zitate-und-quellen","query-fanout-fuer-seo"]:["compare-ai-model-searches","ai-citations","ai-query-fanout-for-seo"],
    toolCta:{title:de?"Mit einem aktuellen Ergebnis beginnen":"Start with a current result",copy:de?"Führe ein kurzes Thema aus und wähle danach nur die Queries aus, die du weiterbearbeiten willst.":"Run one short topic, then select only the queries you want to investigate further.",button:de?"Tool und lokale Historie öffnen":"Open the tool and local history"},
    sections:[
      {id:"export-scope",title:de?"Den passenden Exportumfang wählen":"Choose the appropriate export scope",paragraphs:de?[
        "Nach einem abgeschlossenen Lauf kannst du einzelne Query-Zeilen auswählen. Keyword-CSV enthält nur diese Auswahl mit Eingabe, Provider, Modell, Zeitpunkt, Locale und Belegstatus. Auswahl als JSON strukturiert dieselben Informationen. Quellen werden der Query-Auswahl nicht angehängt.",
        "JSON laden erhält den vollständigen aktuell sichtbaren Ergebnisvertrag. CSV laden erzeugt eine flache Tabelle mit getrennten Query-, Suchaktionsquellen- und Laufquellen-Zeilen. Die Zeilentypen und der Quellenumfang bleiben wichtig: Eine Quelle aus einer gemeinsamen Suchaktion ist nicht automatisch der Beleg einer einzelnen Query.",
        "Für mehrere gespeicherte Läufe nutzt du die Auswahlkästchen unter Auf diesem Gerät gespeichert und anschließend JSON oder CSV. Dieser Export dokumentiert den lokalen Vergleich. Er ist kein unabhängiger Provider-Benchmark."
      ]:[
        "After a completed run, select individual query rows. Keyword CSV contains only that selection, with the input, provider, model, timestamp, locale and evidence status. Selected JSON structures the same information. Sources are not attached to the query selection.",
        "Download JSON preserves the full currently visible result contract. Download CSV creates a flat table with separate query, search-action-source and run-source rows. Row types and source scope matter: a source shared by a search action is not automatically evidence for one individual query.",
        "For several saved runs, use the checkboxes under Saved on this device, then JSON or CSV. That export documents a local comparison. It is not an independent provider benchmark."
      ],references:[{afterParagraph:1,before:de?"Wie du den Quellenumfang liest, erklärt die":"For source scope, follow",label:de?"Anleitung zu KI-Zitaten und Quellen":"the AI citation and source guide",href:path("ai-citations","ki-zitate-und-quellen")}],decisionTable:{title:de?"Auswahl, aktueller Lauf oder Vergleich?":"Selection, current run or comparison?",caption:de?"Die Funktionen haben unterschiedliche Zwecke; verwahre den passenden Umfang zusammen mit deinem Arbeitsstand.":"The controls serve different tasks; keep the appropriate scope with your working notes.",headings:de?["Du brauchst","Export","Wichtige Grenze"]:["You need","Export","Important limit"],rows:de?[
        ["Eine kuratierte Keywordliste","Keyword-CSV oder Auswahl als JSON","Nur ausgewählte Queries; keine Query-Quellen-Zuordnung."],
        ["Den aktuellen Ergebnisvertrag","JSON laden oder CSV laden","API-Felder und redaktionelle Interpretation getrennt lesen."],
        ["Mehrere gespeicherte Läufe","JSON oder CSV in der lokalen Historie","Gemini-Grounding-Quellen fehlen nach dem Speicherfilter."]
      ]:[
        ["A curated keyword list","Keyword CSV or Selected JSON","Selected queries only; no query-to-source mapping."],
        ["The current result contract","Download JSON or Download CSV","Keep API fields separate from editorial interpretation."],
        ["Several saved runs","JSON or CSV in local history","Gemini grounded sources are absent after the save filter."]
      ]}},
      {id:"read-selection",title:de?"Die Keyword-CSV richtig lesen":"Read the keyword CSV correctly",paragraphs:de?[
        "Die folgende Kopfzeile stammt aus dem Query-Auswahl-Exporter. query ist der ausgewählte String; query_index behält seine ursprüngliche Position bei. observed_at übernimmt den im Lauf gespeicherten Zeitpunkt. Eine spätere Exportzeit macht aus dem Ergebnis keine neue Beobachtung.",
        "evidence_status hält modellierte und beobachtete Ergebnisse auseinander. intent und reason sind bei nativen String-Queries leer; bei modellierten Suchideen können sie aus dem erzeugten Ergebnis stammen. Leere Felder sind keine verlorenen Keywords und dürfen nicht als gemessener Intent ergänzt werden.",
        "Importiere CSV mit Komma als Trennzeichen und UTF-8-Zeichensatz. Behandle Suchphrasen als Text. Prüfe danach Zeilenzahl, Umlaute, Anbieter und Datum, bevor du die Auswahl in ein weiteres Tool übernimmst. Ermittle Suchvolumen und Wettbewerb in einem eigenen Keyword-Datensatz."
      ]:[
        "The header below comes from the query-selection exporter. query contains the selected string; query_index preserves its original position. observed_at carries the timestamp stored with the run. A later export time does not turn it into a new observation.",
        "evidence_status keeps modelled and observed results distinct. intent and reason are empty for native string queries; modelled search ideas can carry these fields from the generated result. Empty fields are not lost keywords and should not be filled with an invented measured intent.",
        "Import CSV as comma-separated UTF-8 text and treat search phrases as text. Check the row count, special characters, provider and date before transferring the selection into another tool. Acquire search volume and competition in a separate keyword dataset."
      ],codeSample:{label:de?"Kopfzeile des Query-Auswahl-Exports":"Query-selection export header",text:"keyword,provider,model,observed_at,country,language,evidence_status,query_index,query,intent,reason"},references:[{afterParagraph:2,before:de?"Für die spätere Seitenentscheidung nutze den":"For the eventual page decision, use",label:de?"SEO-Workflow mit Query Fanout":"the query fanout SEO workflow",href:path("ai-query-fanout-for-seo","query-fanout-fuer-seo")} ]},
      {id:"local-history",title:de?"Historie, Ablaufdatum und Gemini-Quellen beachten":"Account for local history, expiry and Gemini sources",paragraphs:de?[
        "Auf diesem Gerät speichern ist eine bewusste Aktion. Die Historie liegt in IndexedDB dieses Browsers und dieser Origin. Sie enthält höchstens 20 Ergebnisse für bis zu 30 Tage. Ein anderer Browser, ein anderes Gerät oder eine Vercel-Vorschau zeigt diese Historie nicht an.",
        "Exportiere wichtige Arbeitsstände vor dem Ablauf oder dem Löschen der Website-Daten. Die Anfrage nach dauerhaftem Browser-Speicher ist keine Garantie: Der Browser entscheidet darüber, und das 30-Tage-Limit der Anwendung bleibt bestehen. Es gibt keine Kontosynchronisierung oder Wiederherstellung aus einem Serverarchiv.",
        "Vor dem lokalen Speichern eines Gemini-Ergebnisses entfernt das Tool Google-Grounding-Quellen und Suchvorschläge. Ein späterer Vergleichsexport enthält deshalb keine gespeicherten Gemini-Quellen. Diese Leerstelle belegt nicht, dass der ursprüngliche Lauf keine Quellen hatte. Beachte bei der Weitergabe aktueller Ergebnisse die jeweiligen Nutzungsbedingungen."
      ]:[
        "Save on this device is an explicit action. History lives in IndexedDB for this browser and exact origin. It holds at most 20 results for up to 30 days. Another browser, device or Vercel preview does not share that history.",
        "Export important work before expiry or clearing website data. The persistent-storage request is not a guarantee: the browser decides, and the application's 30-day limit still applies. There is no account sync or recovery from a server archive.",
        "Before saving a Gemini result locally, the tool removes Google grounded sources and search suggestions. A later comparison export therefore has no saved Gemini sources. Their absence does not prove the original run had no sources. Follow the applicable terms when sharing current results."
      ],references:[{afterParagraph:2,before:de?"Die Einordnung solcher Unterschiede beschreibt der":"For interpreting these differences, read",label:de?"Guide zum lokalen Modellvergleich":"the local model-comparison guide",href:path("compare-ai-model-searches","ki-modelle-vergleichen")}]}],
    readerQuestions:[{question:de?"Kann ich ein Ergebnis nach 30 Tagen wiederherstellen?":"Can I recover a saved result after 30 days?",answer:de?"Die lokale Historie läuft nach spätestens 30 Tagen ab. Ein vorher heruntergeladener Export ist dein eigener Arbeitsstand; ai-fanout.com führt kein Rohdatenarchiv zur Wiederherstellung.":"Local history expires after no more than 30 days. A previously downloaded export is your own working record; ai-fanout.com does not maintain a raw-result recovery archive."},{question:de?"Warum enthält die Keyword-CSV keine Quellen?":"Why does the keyword CSV contain no sources?",answer:de?"Sie exportiert ausgewählte Query-Strings und Laufdaten. Eine allgemeine Quellenliste würde eine nicht belegte Zuordnung zu diesen einzelnen Queries nahelegen.":"It exports selected query strings and run metadata. Adding a general source list could imply an unsupported relationship to those individual queries."}]
  };
  return [prompts,exports];
}
