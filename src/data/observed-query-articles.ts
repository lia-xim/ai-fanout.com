import type { LibraryArticle, LibraryCategory } from "./library";
import { englishArticles as englishSource } from "./observed-query-articles.en";
import { germanArticles as germanSource } from "./observed-query-articles.de";

type MergePlan={keep:string;merge:readonly string[];image:string;altEn:string;altDe:string};
const plans:readonly MergePlan[]=[
  {keep:"what-is-ai-query-fanout",merge:[],image:"/images/guides/query-fanout-basics.webp",altEn:"A topic branching into several web-search paths",altDe:"Ein Thema verzweigt sich in mehrere Web-Suchpfade"},
  {keep:"how-to-see-openai-search-queries",merge:["openai-web-search-queries","ai-citations","gemini-search-queries"],image:"/images/guides/provider-search-queries.webp",altEn:"Two API channels exposing observable search signals",altDe:"Zwei API-Kanäle legen beobachtbare Suchsignale offen"},
  {keep:"ai-query-fanout-for-seo",merge:["content-gap-analysis-with-fanout"],image:"/images/guides/fanout-seo-decisions.webp",altEn:"Fanout queries sorted into practical page decisions",altDe:"Fanout Queries werden in konkrete Seitenentscheidungen sortiert"},
  {keep:"why-ai-fanout-results-change",merge:["country-language-ai-search"],image:"/images/guides/fanout-variation.webp",altEn:"A query pattern changing across time and locale",altDe:"Ein Query-Muster verändert sich über Zeit und Locale"},
  {keep:"compare-ai-model-searches",merge:["no-fanout-query-visible"],image:"/images/guides/model-comparison.webp",altEn:"Two model paths compared on a shared grid",altDe:"Zwei Modellpfade werden in einem gemeinsamen Raster verglichen"}
];
const deSlug:Record<string,string>={
  "what-is-ai-query-fanout":"was-ist-ai-query-fanout","how-to-see-openai-search-queries":"openai-suchanfragen-sehen","openai-web-search-queries":"openai-websuche","ai-citations":"ki-zitate-und-quellen","gemini-search-queries":"gemini-suchanfragen","ai-query-fanout-for-seo":"query-fanout-fuer-seo","content-gap-analysis-with-fanout":"content-luecken-mit-fanout","why-ai-fanout-results-change":"warum-fanout-ergebnisse-schwanken","country-language-ai-search":"land-und-sprache-ki-suche","compare-ai-model-searches":"ki-modelle-vergleichen","no-fanout-query-visible":"keine-fanout-query-sichtbar"
};
function consolidate(source:readonly LibraryArticle[],german=false):LibraryArticle[]{
  return plans.map((plan,index)=>{
    const keepSlug=german?deSlug[plan.keep]:plan.keep;
    const article=source.find(item=>item.slug===keepSlug)!;
    const merged=plan.merge.map(slug=>source.find(item=>item.slug===(german?deSlug[slug]:slug))).filter((item):item is LibraryArticle=>Boolean(item));
    const sections=[...article.sections,...merged.flatMap(item=>item.sections.map(section=>({...section,id:`${item.slug}-${section.id}`})))];
    const sourceIds=[...new Set([ ...article.sourceIds,...merged.flatMap(item=>item.sourceIds)])];
    const combined=plan.keep==="how-to-see-openai-search-queries"?(german?{title:"Wie sieht man OpenAI- und Gemini-Suchanfragen?",shortTitle:"OpenAI- und Gemini-Suchanfragen",description:"So prüfst du Suchanfragen und Quellen, die OpenAI oder Gemini in einem API-Lauf sichtbar machen – mit klaren Grenzen für Zuordnung und Speicherung.",primaryIntent:"Von OpenAI oder Gemini offengelegte Suchaktionen über dokumentierte APIs prüfen.",answer:"Starte einen API-Lauf mit der nativen Websuche des gewählten Anbieters und prüfe ausschließlich die zurückgegebenen Suchaktionen. Nur Query-Strings, die OpenAI oder Gemini im Response offenlegen, sind beobachtete Suchanfragen.",useWhen:"Lies diese Anleitung, bevor du Browser-Tricks, Screenshots oder Vermutungen über ChatGPT- oder Gemini-Suchen verwendest."}:{title:"How to see OpenAI and Gemini search queries",shortTitle:"OpenAI and Gemini search queries",description:"How to inspect search queries and sources exposed by an OpenAI or Gemini API run, with clear attribution and storage limits.",primaryIntent:"Inspect provider-exposed OpenAI or Gemini search actions through documented APIs.",answer:"Run the selected provider's native web-search API and inspect only the returned search-action fields. A query is observed only when OpenAI or Gemini exposes that query string in the response.",useWhen:"Read this before relying on browser tricks, screenshots or generated guesses about what ChatGPT or Gemini searched."}):{};
    return {...article,...combined,number:String(index+1).padStart(2,"0"),sections,sourceIds,image:plan.image,imageAlt:german?plan.altDe:plan.altEn};
  }).map((article,_,all)=>({...article,relatedSlugs:article.relatedSlugs.filter(slug=>all.some(item=>item.slug===slug)).slice(0,3)}));
}
export const englishArticles=consolidate(englishSource);
export const germanArticles=consolidate(germanSource,true);

export const groupsFor = (articles: readonly LibraryArticle[]) =>
  (["Concept", "Measurement", "Method", "Data standard", "Field guide"] as readonly LibraryCategory[])
    .map((category) => ({ category, articles: articles.filter((article) => article.category === category) }))
    .filter((group) => group.articles.length);
