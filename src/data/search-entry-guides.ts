import type { LibraryArticle } from "./library";

// Strengthen the existing page that owns each job; retain its sources and chapters.
type Entry = Pick<LibraryArticle,"title"|"seoTitle"|"description"|"answer"|"useWhen"|"quickStart"|"toolProvider">;
const entries:Record<string,{en:Entry;de:Entry}> = {
  "what-is-ai-query-fanout": {
    en: {
      title:"What is query fanout in AI search?", seoTitle:"What Is Query Fanout? AI Search Explained",
      description:"Understand query fanout with a simple example, then try a free generator to inspect OpenAI or Gemini API searches for your own topic.",
      answer:"Query fanout turns one question into several narrower searches. For SEO and content research, those branches can reveal questions, comparison criteria and evidence your page may need to address.",
      useWhen:"Start with the meaning, then test one topic in the free query fanout generator. Native mode reports searches exposed by a provider API; Search Ideas generates ten possible research directions without web search.",
      quickStart:{title:"From a topic to a useful content question",steps:[
        {title:"Choose one reader decision",copy:"Use a short topic such as best SEO tools. Keep the audience and market specific enough to make the result useful."},
        {title:"Inspect the exposed searches",copy:"Choose OpenAI or Gemini in Native fanout. The result may contain several query strings, fewer than expected, or none."},
        {title:"Check your existing page",copy:"Ask which reader questions the branches represent. Add missing explanations or evidence where they serve the same page; check demand separately."}
      ]}
    },
    de: {
      title:"Was ist Query Fanout in der KI-Suche?", seoTitle:"Was ist Query Fanout? KI-Suche einfach erklärt",
      description:"Verstehe Query Fanout an einem einfachen Beispiel und prüfe mit dem kostenlosen Generator OpenAI- oder Gemini-API-Suchen für dein Thema.",
      answer:"Query Fanout teilt eine Frage in mehrere genauere Suchen auf. Für SEO und Content-Recherche können diese Suchzweige Fragen, Vergleichskriterien und Belege sichtbar machen, die auf deiner Seite fehlen.",
      useWhen:"Kläre zuerst den Begriff und teste dann ein Thema im kostenlosen Query Fanout Generator. Native Fanout zeigt offengelegte API-Suchen; Suchideen erzeugt zehn mögliche Recherchewege ohne Websuche.",
      quickStart:{title:"Vom Thema zur nützlichen Content-Frage",steps:[
        {title:"Eine Leserentscheidung wählen",copy:"Nutze ein kurzes Thema wie beste SEO Tools. Grenze Zielgruppe und Markt so ein, dass du mit dem Ergebnis arbeiten kannst."},
        {title:"Offengelegte Suchanfragen prüfen",copy:"Wähle OpenAI oder Gemini in Native Fanout. Ein Ergebnis kann mehrere Query-Strings, weniger als erwartet oder keine enthalten."},
        {title:"Mit deiner Seite abgleichen",copy:"Welche Leserfragen stehen hinter den Suchzweigen? Ergänze passende Erklärungen oder Belege auf der vorhandenen Seite und prüfe Nachfrage separat."}
      ]}
    }
  },
  "how-to-see-openai-search-queries": {
    en: {
      title:"How to see OpenAI search queries", seoTitle:"How to See OpenAI Search Queries",
      description:"Inspect search queries and cited sources exposed by an OpenAI API run. Try the free tool without signup and learn how it differs from ChatGPT Search.",
      answer:"To see OpenAI search queries, run a topic through the Responses API with web search enabled and inspect the returned search-action fields. The free tool on this site shows the query strings and sources that response exposes.",
      useWhen:"Use this workflow to investigate a content topic or inspect a search result. It observes a new API run, rather than accessing your ChatGPT conversation or private search history.", toolProvider:"openai",
      quickStart:{title:"Inspect your first OpenAI search run",steps:[
        {title:"Open the tool with OpenAI selected",copy:"Enter one topic of up to 60 characters. Choose language and country to match the audience you are researching."},
        {title:"Run the search and read the counts",copy:"Complete the security check and start the run. Read search actions, exposed queries and cited sources separately; one action may contain several queries."},
        {title:"Take selected queries into your brief",copy:"Copy or export the useful query strings. Check source links at the scope shown and validate human demand before planning a page."}
      ]}
    },
    de: {
      title:"So kannst du OpenAI-Suchanfragen sehen", seoTitle:"OpenAI-Suchanfragen sehen: Anleitung und Tool",
      description:"Prüfe Suchanfragen und zitierte Quellen aus einem OpenAI-API-Lauf. Kostenlos ohne Anmeldung, mit klarer Abgrenzung zu ChatGPT Search.",
      answer:"OpenAI-Suchanfragen kannst du über einen Responses-API-Lauf mit aktivierter Websuche und dessen Suchaktionsfelder prüfen. Das kostenlose Tool auf dieser Seite zeigt die Query-Strings und Quellen, die dieser Response offenlegt.",
      useWhen:"Nutze den Ablauf für die Recherche zu einem Content-Thema oder zur Prüfung eines Suchergebnisses. Er beobachtet einen neuen API-Lauf und greift nicht auf deinen ChatGPT-Verlauf zu.", toolProvider:"openai",
      quickStart:{title:"Deinen ersten OpenAI-Suchlauf prüfen",steps:[
        {title:"Tool mit vorausgewähltem OpenAI öffnen",copy:"Gib ein Thema mit höchstens 60 Zeichen ein. Wähle Sprache und Land passend zur Zielgruppe deiner Recherche."},
        {title:"Suche starten und Zähler lesen",copy:"Schließe die Sicherheitsprüfung ab und starte den Lauf. Lies Suchaktionen, sichtbare Queries und Quellen getrennt; eine Aktion kann mehrere Queries enthalten."},
        {title:"Ausgewählte Queries in den Brief übernehmen",copy:"Kopiere oder exportiere nützliche Query-Strings. Prüfe Quellen im angezeigten Umfang und menschliche Nachfrage, bevor du eine Seite planst."}
      ]}
    }
  },
  "gemini-search-queries": {
    en: {
      title:"How to see Gemini search queries", seoTitle:"Gemini Search Queries: How to See Them",
      description:"See query strings exposed by a Gemini API search with the free tool. Learn to read sources, handle zero-query results and understand local-save limits.",
      answer:"Gemini search queries can appear in search-call data from a Gemini API interaction with Google Search. The free tool shows the strings exposed in that run alongside source information at the scope the provider supplies.",
      useWhen:"Use this to research a topic with Gemini and inspect the current result. It is an API observation, not a private Gemini chat history or Google AI Mode query trace.", toolProvider:"gemini",
      quickStart:{title:"Inspect your first Gemini search run",steps:[
        {title:"Open the tool with Gemini selected",copy:"Enter one short topic and set language and country if relevant. Native fanout uses a real API search; Search Ideas is a separate brainstorming mode."},
        {title:"Read the current result",copy:"Inspect exposed query strings, search-action counts and source links. Zero exposed queries can be valid; a provider error is reported separately."},
        {title:"Choose what to keep",copy:"Copy or export selected query strings for research. Optional local saves remove restricted Google Grounded Results and Search Suggestions; do not treat a saved run as a complete source archive."}
      ]}
    },
    de: {
      title:"So kannst du Gemini-Suchanfragen sehen", seoTitle:"Gemini-Suchanfragen sehen: Anleitung und Tool",
      description:"Sieh Query-Strings aus einem Gemini-API-Suchlauf im kostenlosen Tool. Lerne Quellen, Ergebnisse ohne sichtbare Queries und lokale Speichergrenzen kennen.",
      answer:"Gemini-Suchanfragen können in Suchaktionsdaten einer Gemini-API-Interaktion mit Google Search erscheinen. Das kostenlose Tool zeigt die Strings dieses Laufs und Quelleninformationen im vom Anbieter gelieferten Umfang.",
      useWhen:"Recherchiere ein Thema mit Gemini und prüfe das aktuelle Ergebnis. Es ist eine API-Beobachtung und kein privater Gemini-Chatverlauf oder Google-AI-Mode-Trace.", toolProvider:"gemini",
      quickStart:{title:"Deinen ersten Gemini-Suchlauf prüfen",steps:[
        {title:"Tool mit vorausgewähltem Gemini öffnen",copy:"Gib ein kurzes Thema ein und wähle bei Bedarf Sprache und Land. Native Fanout nutzt eine echte API-Suche; Suchideen ist ein getrennter Brainstorming-Modus."},
        {title:"Aktuelles Ergebnis lesen",copy:"Prüfe sichtbare Query-Strings, Suchaktionszähler und Quellenlinks. Keine sichtbare Query kann korrekt sein; ein Providerfehler wird separat angezeigt."},
        {title:"Gezielt übernehmen",copy:"Kopiere oder exportiere ausgewählte Query-Strings für die Recherche. Lokale Speicherungen entfernen eingeschränkte Google Grounded Results und Search Suggestions und sind kein vollständiges Quellenarchiv."}
      ]}
    }
  }
};

export function searchEntryFor(slug:string,german:boolean):Partial<LibraryArticle> {
  const entry=entries[slug]?.[german?"de":"en"];
  return entry ? {...entry,reviewedAt:"2026-10-09"} : {};
}
