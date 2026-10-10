import { SEO_HANDOFF_SCHEMA } from "./seo-handoff.mjs";

// This adapter consumes the already reviewed, public normalized corpus.
// Domain names stay domain names; it never manufactures cited URLs or joins.
export function observedSelectionHandoff(corpus, observationId, selectedIndexes, transferredAt=new Date().toISOString()) {
  const observation=corpus.observations.find(item=>item.id===observationId);
  if (!observation) throw new Error("UNKNOWN_PUBLIC_OBSERVATION");
  const indexes=[...new Set(selectedIndexes)].sort((a,b)=>a-b);
  if (!indexes.length) throw new Error("EMPTY_HANDOFF_SELECTION");
  if (indexes.some(index=>!Number.isInteger(index)||index<0||index>=observation.queries.length)) throw new Error("INVALID_HANDOFF_INDEX");
  return {
    schemaVersion:SEO_HANDOFF_SCHEMA,producer:"ai-fanout.com",transferredAt,
    run:{
      question:observation.input.keyword,language:observation.input.language,
      market:`${observation.input.country} · ${observation.input.language}`,
      providerLabel:`${corpus.provider} · ${corpus.model}`,
      evidenceLabel:`Selected ${indexes.length} of ${observation.queries.length} exposed strings · ${observation.providerResponseStatus} · original action-domain set`,
      evidenceState:"provider_exposed_native_search",displayedRunTime:observation.observedAt,
      queries:indexes.map(index=>({text:observation.queries[index],intent:"",reason:"",sourceRelation:"Domain-only run/action evidence; no query-to-source mapping",sources:[]})),
      runSources:[],sourceDomains:[...observation.sourceDomains],
      methodLabel:`Public normalized observation · ${corpus.toolVersion} · ${corpus.methodVersion}`,
      sourceDocumentUrl:"https://ai-fanout.com/examples/openai-observations-2026-08-27.json",
    },
    notice:"Selection from a previously published owner-run observation. Original run/action domain names are retained without inventing URLs or a query-source join. No new provider request, search volume, ranking or independent validation.",
  };
}
