import test from "node:test";
import assert from "node:assert/strict";
import { HISTORY_LIMIT, HISTORY_TTL_MS, prepareResultForLocalStorage, pruneHistory } from "../src/scripts/fanout-history.mjs";
import { analyzeFanout } from "../src/scripts/fanout-analysis.mjs";
import { compareFanoutRuns, comparisonCsv } from "../src/scripts/fanout-comparison.mjs";

test("local history expires after 30 days, sorts newest first and keeps 20", () => {
  const now = Date.UTC(2026, 7, 27);
  const entries = Array.from({ length: 24 }, (_, index) => ({
    id: String(index),
    savedAt: now - index * 1000,
    expiresAt: now + HISTORY_TTL_MS - index * 1000,
  }));
  entries.push({ id: "expired", savedAt: now, expiresAt: now - 1 });
  const result = pruneHistory(entries, now);
  assert.equal(result.length, HISTORY_LIMIT);
  assert.equal(result[0].id, "0");
  assert.equal(result.some((entry) => entry.id === "expired"), false);
});

test("Gemini local history keeps queries but strips Google grounded sources",()=>{
  const stored=prepareResultForLocalStorage({providerId:"gemini",queries:["beste seo tools"],sources:[{url:"https://example.com",title:"Example"}],searchActions:[{id:"1",queries:["beste seo tools"],sources:[{url:"https://example.com",title:"Example"}],sourceScope:"exact_query"}]});
  assert.deepEqual(stored.queries,["beste seo tools"]);assert.deepEqual(stored.sources,[]);assert.deepEqual(stored.searchActions[0].sources,[]);assert.equal(stored.sourceEvidenceScope,"not_stored_google_grounded_results");
});

test("rules-based reading separates observed counts from derived categories",()=>{
  const result=analyzeFanout({language:"de",queries:["beste SEO Tools im Vergleich","SEO Tools Preise","SEO Tools für KMU"],sources:[{url:"https://www.ahrefs.com/a"},{url:"https://semrush.com/b"},{url:"https://ahrefs.com/c"}]});
  assert.equal(result.evidenceState,"derived");assert.equal(result.observedQueryCount,3);assert.equal(result.comparisonQuestionCount,1);assert.equal(result.priceQuestionCount,1);assert.equal(result.distinctSourceDomainCount,2);assert.equal(result.recurringThemes[0].term,"seo");
});

test("browser-local comparison finds exact overlaps and exports all runs",()=>{
  const entries=[{id:"a",savedAt:1,result:{providerId:"openai",modelId:"gpt",keyword:"SEO",language:"en",country:null,queries:["best seo tools","seo pricing"],sources:[{url:"https://ahrefs.com/a"}]}},{id:"b",savedAt:2,result:{providerId:"gemini",modelId:"gemini",keyword:"SEO",language:"en",country:null,queries:["best seo tools","seo for small business"],sources:[{url:"https://ahrefs.com/b"}]}}];
  const compared=compareFanoutRuns(entries);assert.deepEqual(compared.sharedQueries,["best seo tools"]);assert.deepEqual(compared.sharedSourceDomains,["ahrefs.com"]);assert.match(comparisonCsv(compared),/best seo tools/);assert.match(comparisonCsv(compared),/openai/);
});
