import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateExport } from "./validate.mjs";
const fixtures=JSON.parse(await readFile(new URL("exports.synthetic.json",import.meta.url),"utf8"));
const change=(name,edit)=>{const value=structuredClone(fixtures[name]);edit(value);return value;};
test("all four actual export shapes validate, including source-stripped saved Gemini",()=>{for(const value of Object.values(fixtures))assert.equal(validateExport(value).valid,true);});
test("native full runs do not acquire an invented root schemaVersion",()=>{assert.equal(validateExport(change("nativeRun",v=>v.schemaVersion="ai-fanout.export/1.0")).valid,false);});
test("native completed-zero is valid; modelled runs still require ten idea objects",()=>{
  const zero=change("nativeRun",v=>{v.queries=[];v.sources=[];v.searchActions=[];v.searchActionCount=0;v.usage.searchActionCount=0;v.usage.searchQueryCount=0;});
  assert.equal(validateExport(zero).valid,true);
  assert.equal(validateExport(change("modelledRun",v=>v.queries=[])).valid,false);
  assert.equal(validateExport(change("modelledRun",v=>v.queries=fixtures.nativeRun.queries)).valid,false);
});
test("selection count and unique original indexes are semantic requirements",()=>{
  assert.equal(validateExport(change("querySelection",v=>v.selectedQueryCount=99)).valid,false);
  assert.equal(validateExport(change("querySelection",v=>{v.queries.push(v.queries[0]);v.selectedQueryCount=2;})).valid,false);
});
test("selection is not a full run and cannot carry invented source joins",()=>{
  assert.equal(validateExport(change("querySelection",v=>v.queries[0].sources=fixtures.nativeRun.sources)).valid,false);
  assert.equal(validateExport(change("nativeRun",v=>v.evidenceStatus="modelled_fanout")).valid,false);
});
test("comparison validates counts, identities and analysis",()=>{
  assert.equal(validateExport(change("localComparison",v=>v.runCount=1)).valid,false);
  assert.equal(validateExport(change("localComparison",v=>v.runs[1].id=v.runs[0].id)).valid,false);
  assert.equal(validateExport(change("localComparison",v=>v.runs[0].analysis.observedQueryCount=99)).valid,false);
});
test("saved Gemini cannot falsely retain grounded sources",()=>{
  assert.equal(validateExport(change("localComparison",v=>v.runs[1].sources=fixtures.nativeRun.sources)).valid,false);
});
test("multiple queries cannot receive a made-up exact-query source relationship",()=>{
  assert.equal(validateExport(change("nativeRun",v=>v.searchActions[0].sourceScope="exact_query")).valid,false);
});
test("malformed and credential-bearing source URLs fail validation",()=>{
  for(const url of ["https://", "https://user:secret@example.com/"])assert.equal(validateExport(change("nativeRun",v=>v.sources[0].url=url)).valid,false);
});
test("old planner files and provider response fixtures are outside this current export schema",()=>{
  assert.equal(validateExport({schemaVersion:"ai-fanout.export/1.0",kind:"planner_hypothesis_set",branches:[]}).valid,false);
  assert.equal(validateExport({status:"completed",output:[]}).valid,false);
});
test("current Claude exports and previous saved protocols validate without mixing versions",()=>{
  assert.equal(validateExport(change("nativeRun",v=>v.providerId="anthropic")).valid,true);
  const old=change("nativeRun",v=>{v.toolVersion="native-fanout-tool/1.0.0";v.methodVersion="provider-native-search/1.0";});
  assert.equal(validateExport(old).valid,true);
  old.providerId="anthropic";assert.equal(validateExport(old).valid,false);
  assert.equal(validateExport(change("nativeRun",v=>v.methodVersion="provider-native-search/1.0")).valid,false);
  assert.equal(validateExport(change("modelledRun",v=>v.methodVersion="openrouter-structured-fanout/2.0")).valid,false);
});
