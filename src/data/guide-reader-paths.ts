import type { LibraryDecisionTable, LibraryReference, LibrarySection } from "./library";

// Explicit editorial references on the consolidated chapters, not keyword autolinking.
type Path = readonly [en:`/${string}`,de:`/${string}`];
type Reference = { section:number; paragraph:number; target:Path; en:readonly [string,string,string?]; de:readonly [string,string,string?] };
const definition:Path=["/library/what-is-ai-query-fanout","/de/lernen/was-ist-ai-query-fanout"];
const citations:Path=["/library/ai-citations","/de/lernen/ki-zitate-und-quellen"];
const decisions:Path=["/library/ai-query-fanout-for-seo","/de/lernen/query-fanout-fuer-seo"];
const comparison:Path=["/library/compare-ai-model-searches","/de/lernen/ki-modelle-vergleichen"];
const countryExample:Path=["/examples/country-changes-fanout-queries","/de/beispiele/land-veraendert-fanout-queries"];
const repeatExample:Path=["/examples/why-same-keyword-changes","/de/beispiele/warum-gleiches-keyword-andere-queries"];
const sourceExample:Path=["/examples/sources-for-comparison-questions","/de/beispiele/quellen-bei-vergleichsfragen"];
const comparisonExample:Path=["/examples/best-seo-tools-openai-vs-gemini","/de/beispiele/beste-seo-tools-openai-vs-gemini"];

const references:Record<string,readonly Reference[]>={
  "what-is-ai-query-fanout":[
    {section:0,paragraph:3,target:sourceExample,en:["See how one comparison question split into narrower searches in the","dated Ahrefs–Semrush example"],de:["Wie sich eine Vergleichsfrage in genauere Suchen aufteilt, zeigt das","datierte Ahrefs-Semrush-Beispiel"]},
    {section:2,paragraph:1,target:decisions,en:["For the next page decision, follow the","query fanout content workflow"],de:["Für die nächste Seitenentscheidung nutze den","Content-Workflow mit Query Fanout"]},
    {section:2,paragraph:0,target:["/library/query-fanout-prompt","/de/lernen/query-fanout-prompt"],en:["If you want to plan possible questions before observing a run, use the","query fanout prompt template"],de:["Wenn du mögliche Fragen vor einem beobachteten Lauf planen willst, nutze die","Query-Fanout-Prompt-Vorlage"]},
  ],
  "how-to-see-openai-search-queries":[
    {section:0,paragraph:5,target:sourceExample,en:["Inspect the input, returned query strings and action-level source domains in the","published OpenAI comparison run"],de:["Eingabe, offengelegte Queries und Quellendomains auf Aktionsebene findest du im","veröffentlichten OpenAI-Vergleichslauf"]},
    {section:2,paragraph:3,target:citations,en:["When several queries share one source list, use the","guide to query and citation scope", " to interpret it."],de:["Wenn mehrere Queries dieselbe Quellenliste teilen, hilft die","Anleitung zum Umfang von Queries und Zitaten", " bei der Einordnung."]},
  ],
  "gemini-search-queries":[
    {section:1,paragraph:3,target:citations,en:["Read the","citation guide", " before treating a returned source as evidence for a particular query."],de:["Lies die","Anleitung zu KI-Zitaten", ", bevor du eine Quelle einer bestimmten Query zuordnest."]},
    {section:3,paragraph:1,target:comparison,en:["To compare allowed saved query strings without retaining Gemini grounded sources, follow the","local OpenAI–Gemini comparison workflow"],de:["Für den Vergleich erlaubter gespeicherter Query-Strings ohne Gemini-Grounding-Quellen nutze den","lokalen OpenAI-Gemini-Vergleich"]},
  ],
  "ai-citations":[
    {section:1,paragraph:1,target:sourceExample,en:["Review the four query strings and thirteen domains in the","dated source-scope example"],de:["Die vier Query-Strings und dreizehn Domains kannst du im","datierten Beispiel zum Quellenumfang", " nachprüfen."]},
    {section:2,paragraph:3,target:decisions,en:["Once the source supports the claim, use the","content-gap decision workflow", " to decide where that evidence belongs."],de:["Wenn die Quelle die Aussage stützt, hilft der","Workflow für Content-Lücken", " bei der passenden Seitenentscheidung."]},
  ],
  "ai-query-fanout-for-seo":[
    {section:0,paragraph:1,target:definition,en:["If the distinction between a generated idea and an observed search is unclear, start with the","query fanout definition"],de:["Wenn erzeugte Suchideen und beobachtete Suchen noch unklar sind, beginne mit der","Definition von Query Fanout"]},
    {section:1,paragraph:0,target:sourceExample,en:["The","comparison-source example", " shows why a research branch can need pricing evidence rather than another keyword-variant page."],de:["Das","Beispiel zu Vergleichsquellen", " zeigt, warum ein Suchzweig Preisbelege statt einer weiteren Keyword-Varianten-Seite brauchen kann."]},
    {section:3,paragraph:1,target:["/library/export-fanout-queries","/de/lernen/fanout-queries-exportieren"],en:["Keep the selected questions and run metadata together using the","fanout CSV and JSON export workflow"],de:["Erhalte ausgewählte Fragen und Laufdaten zusammen mit dem","CSV- und JSON-Export-Workflow für Fanout"]},
  ],
  "seo-for-ai-search":[
    {section:1,paragraph:1,target:decisions,en:["Apply the","query fanout page-decision workflow", " when a coverage check reveals a missing reader question."],de:["Nutze den","Workflow für Seitenentscheidungen mit Query Fanout", ", wenn beim Abgleich eine Leserfrage fehlt."]},
    {section:2,paragraph:1,target:citations,en:["Keep citation evidence separate from search performance with the","AI citation interpretation guide"],de:["Trenne Quellenbelege von Suchleistung mit der","Anleitung zur Einordnung von KI-Zitaten"]},
  ],
  "why-ai-fanout-results-change":[
    {section:0,paragraph:2,target:repeatExample,en:["See the exact strings that changed within 22 seconds in the","same-keyword repeat example"],de:["Welche Strings sich innerhalb von 22 Sekunden änderten, zeigt das","Wiederholungsbeispiel mit demselben Keyword"]},
    {section:2,paragraph:2,target:countryExample,en:["The","US–Germany country example", " keeps topic, model and language fixed and reports the limits of that two-run observation."],de:["Das","Länderbeispiel USA–Deutschland", " hält Thema, Modell und Sprache konstant und benennt die Grenzen dieser zwei Läufe."]},
  ],
  "compare-ai-model-searches":[
    {section:0,paragraph:0,target:comparisonExample,en:["Use the","local comparison example", " to reproduce the setup; its public fixture documents only the OpenAI side."],de:["Nutze das","lokale Vergleichsbeispiel", " für die Konfiguration; die öffentliche Beobachtung dokumentiert nur die OpenAI-Seite."]},
    {section:2,paragraph:2,target:["/library/how-to-see-openai-search-queries","/de/lernen/openai-suchanfragen-sehen"],en:["For a missing OpenAI query field, check the","OpenAI response and zero-query explanation", " before interpreting an empty result as a provider failure."],de:["Bei einem fehlenden OpenAI-Query-Feld lies die","OpenAI-Response- und Null-Query-Erklärung", ", bevor du ein leeres Ergebnis als Providerfehler deutest."]},
  ],
};

const tables:Record<string,{section:number;en:LibraryDecisionTable;de:LibraryDecisionTable}>={
  "how-to-see-openai-search-queries":{section:2,
    en:{title:"No queries returned: read the status before repeating",caption:"A completed response with no exposed query strings differs from a failed request. These are interpretation rules, not additional observed runs.",headings:["Visible result","What you can conclude","Next step"],rows:[
      ["Completed; zero queries and zero search actions","This response exposed no search action. It is not a complete trace of internal retrieval.","Keep the zero count and record model, locale and time."],
      ["Completed; search actions but zero query strings","The response exposed search activity without reusable query wording. OpenAI says search actions do not always include queries.","Read any sources at the scope supplied; do not reconstruct queries from them."],
      ["Queries returned but no supporting source","The query text is observable; support for a factual claim is still missing.","Check the cited page and the claim separately before using it as evidence."],
      ["Timeout, CAPTCHA, quota or provider error","The request did not yield a completed usable observation. It is not a successful zero-query run.","Read the visible error and reset information. Repeated clicks do not bypass a limit."]
    ]},
    de:{title:"Keine Queries: vor dem Wiederholen den Status lesen",caption:"Ein abgeschlossener Response ohne sichtbare Query-Strings unterscheidet sich von einer fehlgeschlagenen Anfrage. Dies sind Regeln zur Einordnung, keine zusätzlichen beobachteten Läufe.",headings:["Sichtbares Ergebnis","Was du daraus schließen kannst","Nächster Schritt"],rows:[
      ["Abgeschlossen; null Queries und null Suchaktionen","Dieser Response legt keine Suchaktion offen. Er ist keine vollständige Spur interner Retrieval-Vorgänge.","Die Null beibehalten und Modell, Locale und Zeitpunkt notieren."],
      ["Abgeschlossen; Suchaktionen, aber keine Query-Strings","Der Response zeigt Suchaktivität ohne nutzbaren Suchwortlaut. Laut OpenAI enthalten Suchaktionen nicht immer Queries.","Quellen im gelieferten Umfang lesen; daraus keine Queries rekonstruieren."],
      ["Queries vorhanden, aber keine stützende Quelle","Der Query-Text ist sichtbar; der Beleg für eine Tatsachenbehauptung fehlt weiterhin.","Zitierte Seite und konkrete Aussage getrennt prüfen, bevor du sie als Beleg verwendest."],
      ["Timeout, CAPTCHA-, Limit- oder Providerfehler","Die Anfrage liefert keine abgeschlossene nutzbare Beobachtung. Das ist kein erfolgreicher Null-Query-Lauf.","Sichtbaren Fehler und Reset-Hinweis lesen. Wiederholtes Klicken umgeht kein Limit."]
    ]}},
  "what-is-ai-query-fanout":{section:0,
    en:{title:"Query fanout, expansion and rewriting",caption:"The terms describe related operations, not identical evidence. Google documents fan-out; query expansion adds related terms; OpenAI describes rewriting into one or more targeted queries.",headings:["Term","Useful distinction","What it does not establish"],rows:[
      ["Query fanout","Several related retrieval queries address parts of one information need.","A private, complete list of queries from a consumer session."],
      ["Query expansion","Related terms or synonyms broaden a query's vocabulary.","That a system executed several separate web searches."],
      ["Query rewriting","The request is reformulated for retrieval; OpenAI describes one or more targeted searches.","A universal one-query-only rule or the response fields of another product."],
      ["Prompt-generated search ideas","A model suggests questions for a research plan.","Executed searches, human search demand or a guaranteed citation."]
    ]},
    de:{title:"Query Fanout, Erweiterung und Umformulierung",caption:"Die Begriffe beschreiben verwandte Vorgänge mit unterschiedlichen Belegen. Google dokumentiert Fan-out, Query Expansion ergänzt Begriffe und OpenAI beschreibt eine Umformulierung in eine oder mehrere gezielte Queries.",headings:["Begriff","Nützliche Unterscheidung","Was er nicht belegt"],rows:[
      ["Query Fanout","Mehrere verwandte Retrieval-Queries beantworten Teile eines Informationsbedarfs.","Eine private, vollständige Query-Liste einer Endnutzer-Sitzung."],
      ["Query Expansion","Verwandte Begriffe oder Synonyme erweitern das Vokabular einer Query.","Dass mehrere getrennte Websuchen ausgeführt wurden."],
      ["Query Rewriting","Die Anfrage wird für Retrieval umformuliert; OpenAI beschreibt eine oder mehrere gezielte Suchen.","Eine allgemeine Ein-Query-Regel oder die Response-Felder eines anderen Produkts."],
      ["Prompt-generierte Suchideen","Ein Modell schlägt Fragen für einen Rechercheplan vor.","Ausgeführte Suchen, menschliche Nachfrage oder garantierte Zitierungen."]
    ]}},
  "ai-query-fanout-for-seo":{section:1,
    en:{title:"Which content change does the branch justify?",caption:"Editorial decision examples for a page about choosing SEO tools. These are illustrative reader jobs, not new provider output or measured keyword demand.",headings:["Reader question","Smallest useful action","Evidence to check"],rows:[
      ["What does the tool cost?","Update the pricing section on the existing comparison page.","Current official pricing, currency and review date."],
      ["Does it support a client workflow?","Add an agency-use section if the comparison already serves agencies.","Documented access, reporting and workspace capabilities."],
      ["How do I migrate my saved keyword data?","Consider a separate procedure only if it serves a distinct migration task.","A tested import/export path and a concrete next step."],
      ["Which wording variant is better?","Keep variants on the page that answers the same reader question.","Page-query demand and usefulness; wording alone does not justify a URL."],
    ]},
    de:{title:"Welche Content-Änderung rechtfertigt der Suchzweig?",caption:"Redaktionelle Entscheidungsbeispiele für eine Seite zur Auswahl von SEO-Tools. Es sind illustrative Leseraufgaben, keine neuen Provider-Ergebnisse oder gemessene Keyword-Nachfrage.",headings:["Leserfrage","Kleinste nützliche Änderung","Zu prüfender Beleg"],rows:[
      ["Was kostet das Tool?","Den Preisabschnitt der vorhandenen Vergleichsseite aktualisieren.","Aktuelle Herstellerpreise, Währung und Prüfdatum."],
      ["Passt es zum Kunden-Workflow?","Einen Agenturabschnitt ergänzen, wenn der Vergleich bereits Agenturen anspricht.","Dokumentierter Zugang, Reports und Workspace-Funktionen."],
      ["Wie übernehme ich meine Keyword-Daten?","Eine eigene Anleitung nur für eine eigenständige Migrationsaufgabe prüfen.","Ein getesteter Import-/Export-Weg und ein konkreter nächster Schritt."],
      ["Welche Formulierungsvariante ist besser?","Varianten auf der Seite zur selben Leserfrage belassen.","Seitenbezogene Nachfrage und Nutzen; Wortlaut allein rechtfertigt keine URL."],
    ]}},
  "seo-for-ai-search":{section:0,
    en:{title:"Check one page before adding AI-search content",caption:"Use this as an operational review. Passing a check does not guarantee indexing, rankings or a citation.",headings:["Check","How to verify it","Useful correction"],rows:[
      ["Can the page be retrieved?","Inspect the live HTTP status, robots rules and rendered content.","Repair unintended blocks or failures; preserve intended noindex pages."],
      ["Is this the intended canonical?","Compare the page, sitemap, internal links and Google's selected canonical.","Make those signals consistent for the intended URL."],
      ["Does it answer the reader's task?","Find the direct answer and evidence for material claims.","Clarify the answer and add the closest relevant source or firsthand proof."],
      ["Can readers reach the next step?","Follow contextual links from a relevant guide or hub and back to the tool.","Add a useful crawlable link at the point where the next question arises."],
    ]},
    de:{title:"Eine Seite prüfen, bevor KI-Suche-Content dazukommt",caption:"Nutze dies als operative Prüfung. Ein bestandener Check garantiert keine Indexierung, Rankings oder Zitierung.",headings:["Prüfung","So prüfst du sie","Nützliche Korrektur"],rows:[
      ["Ist die Seite abrufbar?","Live-HTTP-Status, Robots-Regeln und gerenderten Inhalt prüfen.","Unbeabsichtigte Sperren oder Fehler beheben; bewusstes noindex erhalten."],
      ["Ist das die gewünschte Canonical-URL?","Seite, Sitemap, interne Links und Googles gewählte Canonical vergleichen.","Diese Signale auf die gewünschte URL abstimmen."],
      ["Beantwortet sie die Leseraufgabe?","Die direkte Antwort und Belege für wesentliche Aussagen suchen.","Antwort klären und passende Primärquellen oder eigene Nachweise ergänzen."],
      ["Ist der nächste Schritt erreichbar?","Kontextlinks von einem passenden Guide oder Hub und zurück zum Tool verfolgen.","Einen nützlichen crawlbaren Link dort ergänzen, wo die nächste Frage entsteht."],
    ]}},
  "why-ai-fanout-results-change":{section:1,
    en:{title:"Change one variable, record the rest",caption:"A control plan for your own comparison. The dated examples show individual observations, not an estimated effect size.",headings:["Question","Keep fixed","Change or record"],rows:[
      ["Does country context matter?","Topic, provider, exact model and language.","Change country; record both timestamps and the prompt-context limitation."],
      ["Does language matter?","Topic meaning, provider, exact model and country.","Change language; record how the topic was translated."],
      ["Does the result vary on repetition?","Topic, provider, model, country and language.","Repeat the run and preserve both outcomes, including zero queries."],
      ["Did a provider update change the result?","The documented setup and comparison rule.","Record dates and versions; a stable model label cannot establish an unchanged backend."],
    ]},
    de:{title:"Eine Variable ändern, den Rest festhalten",caption:"Ein Kontrollplan für deinen eigenen Vergleich. Die datierten Beispiele zeigen einzelne Beobachtungen, keine geschätzte Effektgröße.",headings:["Frage","Konstant halten","Ändern oder dokumentieren"],rows:[
      ["Spielt der Länderkontext eine Rolle?","Thema, Provider, exaktes Modell und Sprache.","Land ändern; beide Zeitpunkte und die Grenze des Prompt-Kontexts festhalten."],
      ["Spielt die Sprache eine Rolle?","Bedeutung des Themas, Provider, exaktes Modell und Land.","Sprache ändern; die Übersetzung des Themas dokumentieren."],
      ["Schwankt das Ergebnis bei Wiederholung?","Thema, Provider, Modell, Land und Sprache.","Lauf wiederholen und beide Ergebnisse erhalten, auch bei null Queries."],
      ["Hat ein Provider-Update etwas verändert?","Dokumentierte Konfiguration und Vergleichsregel.","Datum und Versionen festhalten; ein Modellname beweist kein unverändertes Backend."],
    ]}},
  "compare-ai-model-searches":{section:1,
    en:{title:"Read the comparison without scoring the models",caption:"Interpretation rules for the existing local comparison. Missing fields remain missing; do not turn them into a provider-quality score.",headings:["What you see","What it supports","What to do next"],rows:[
      ["The same exact query in both runs","A string overlap between those two observations.","Review the shared reader question; do not infer universal agreement."],
      ["Different wording","The exposed strings differ.","Check meaning manually and label any grouping as your interpretation."],
      ["No saved Gemini sources","The local-save filter removes restricted Google grounded data.","Review source information only in the permitted current-run scope."],
      ["Zero queries or an explicit error","A completed zero-query observation differs from a failed request.","Keep status visible and exclude neither outcome silently."],
    ]},
    de:{title:"Den Vergleich lesen, ohne Modelle zu bewerten",caption:"Einordnungsregeln für den vorhandenen lokalen Vergleich. Fehlende Felder bleiben fehlend und werden nicht zu einem Qualitätsscore.",headings:["Was du siehst","Was es belegt","Nächster Schritt"],rows:[
      ["Dieselbe exakte Query in beiden Läufen","Eine String-Übereinstimmung zwischen diesen zwei Beobachtungen.","Gemeinsame Leserfrage prüfen; keine allgemeine Einigkeit ableiten."],
      ["Andere Formulierungen","Die offengelegten Strings unterscheiden sich.","Bedeutung manuell prüfen und Gruppierung als eigene Einordnung kennzeichnen."],
      ["Keine gespeicherten Gemini-Quellen","Der Speicherfilter entfernt eingeschränkte Google-Grounding-Daten.","Quellen nur im erlaubten Umfang des aktuellen Laufs prüfen."],
      ["Null Queries oder ein expliziter Fehler","Ein abgeschlossener Null-Query-Lauf unterscheidet sich von einem Fehler.","Status sichtbar halten und kein Ergebnis stillschweigend ausschließen."],
    ]}},
};

export function guideReaderPaths(slug:string,sections:readonly LibrarySection[],german:boolean):LibrarySection[]{
  const paths=references[slug]??[];
  const table=tables[slug];
  for(const reference of paths){
    if(!sections[reference.section]?.paragraphs[reference.paragraph])throw new Error(`Missing reference placement for ${slug}`);
  }
  if(table&&!sections[table.section])throw new Error(`Missing decision-table placement for ${slug}`);
  return sections.map((section,index)=>({...section,
    paragraphs:slug==="how-to-see-openai-search-queries"&&index===2?[...section.paragraphs,...(german?[
      "Lies zuerst den sichtbaren Laufstatus und danach die Zähler für Suchaktionen, Queries und Quellen. Ein fehlendes Query-Feld ist keine Liste versteckter Keywords. OpenAI dokumentiert ausdrücklich, dass Suchaktionen nicht immer den Suchwortlaut liefern.",
      "Notiere bei einem möglichen Problem Modell, Zeitpunkt, Land, Sprache und den öffentlichen Fehlercode. Teile weder API-Schlüssel noch private Roh-Responses. Wenn du stattdessen Ideen brauchst, nutze den getrennten Modus Suchideen und behalte dessen Kennzeichnung bei."
    ]:[
      "First read the visible run status, then the search-action, query and source counts. A missing query field is not a list of hidden keywords. OpenAI explicitly documents that search actions do not always expose their query wording.",
      "For a possible problem, record model, time, country, language and the public error code. Share neither API keys nor private raw responses. If you need ideas instead, use the separate Search Ideas mode and keep its modelled label."
    ])]:section.paragraphs,
    references:paths.filter(reference=>reference.section===index).map((reference):LibraryReference=>{
      const [before,label,after]=reference[german?"de":"en"];
      return {afterParagraph:reference.paragraph,before,label,after,href:reference.target[german?1:0]};
    }),
    decisionTable:table?.section===index?table[german?"de":"en"]:undefined,
  }));
}
