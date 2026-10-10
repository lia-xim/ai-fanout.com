import test from "node:test";
import assert from "node:assert/strict";
import { parseOpenAiResponse, parseGeminiInteraction } from "./parsers.mjs";
import { fixtures } from "./fixtures.mjs";

test("OpenAI preserves distinct action membership and both plural and singular query fields", () => {
  const r=parseOpenAiResponse(fixtures.openai);
  assert.deepEqual(r.queries,["example topic","example cost","example import"]);
  assert.equal(r.searchActionCount,2);
  assert.deepEqual(r.actions[0].queries,["example topic","example cost"]);
  assert.deepEqual(r.actions[1].queries,["example import"]);
});
test("an action source is not promoted into a per-query source", () => {
  const r=parseOpenAiResponse(fixtures.openai);
  assert.equal(r.actions[0].sourceScope,"search_action");
  assert.equal(r.actions[0].sources.length,1);
  assert.equal(r.runSources[0].sourceScope,"run");
  assert.ok(r.actions.every(a=>!Object.hasOwn(a,"querySources")));
});
test("completed missing query fields are a zero observation, with source scope preserved", () => {
  const r=parseOpenAiResponse({status:"completed",output:[{type:"web_search_call",id:"a",action:{type:"search",sources:[{url:"https://example.com/"}]}}]});
  assert.equal(r.state,"completed");assert.equal(r.exposedQueryCount,0);assert.equal(r.searchActionCount,1);
  assert.equal(r.actions[0].sources.length,1);assert.deepEqual(r.queries,[]);
});
test("OpenAI open/find calls are not counted as search queries or search actions", () => {
  const r=parseOpenAiResponse({status:"completed",output:[{type:"web_search_call",action:{type:"open_page",url:"https://example.com"}},{type:"web_search_call",action:{type:"find_in_page",pattern:"text"}}]});
  assert.equal(r.webToolCallCount,2);assert.equal(r.searchActionCount,0);assert.equal(r.exposedQueryCount,0);
});
test("incomplete output preserves exposed material as partial instead of complete", () => {
  const r=parseOpenAiResponse({...fixtures.openai,status:"incomplete"});
  assert.equal(r.state,"partial");assert.equal(r.providerStatus,"incomplete");assert.equal(r.exposedQueryCount,3);
});
test("incomplete without exposed actions is not a completed zero", () => {
  const r=parseOpenAiResponse({status:"incomplete",output:[]});
  assert.equal(r.state,"partial");assert.equal(r.exposedQueryCount,null);
});
test("failed/error payloads never masquerade as completed-zero responses", () => {
  for(const parse of [parseOpenAiResponse,parseGeminiInteraction]) {
    const r=parse({status:"failed",error:{code:"synthetic-error"}});
    assert.equal(r.state,"failed");assert.equal(r.exposedQueryCount,null);
  }
});
test("missing status stays unknown even when strings are exposed", () => {
  const r=parseOpenAiResponse({output:fixtures.openai.output});
  assert.equal(r.state,"unknown");assert.equal(r.providerStatus,null);assert.equal(r.queries.length,3);
});
test("wrong or missing response containers are rejected, not silently defaulted to zero", () => {
  for(const input of [null,[],{}, {output:{}}, {output:"bad"}]) assert.throws(()=>parseOpenAiResponse(input),/INVALID_RESPONSE/);
  for(const input of [null,[],{}, {steps:{}}, {candidates:[]}]) assert.throws(()=>parseGeminiInteraction(input),/INVALID_RESPONSE/);
});
test("invalid query arrays are rejected while genuinely absent fields remain absent", () => {
  assert.throws(()=>parseOpenAiResponse({status:"completed",output:[{type:"web_search_call",action:{type:"search",queries:"not-an-array"}}]}),/INVALID_QUERY_FIELD/);
  assert.throws(()=>parseGeminiInteraction({status:"completed",steps:[{type:"google_search_call",arguments:{queries:[42]}}]}),/INVALID_QUERY_FIELD/);
});
test("the tutorial preserves exact Unicode, duplicates and occurrence order without UI truncation", () => {
  const input=[" Café ","Cafe\u0301","CAFÉ"," Café ",...Array.from({length:9},(_,i)=>`branch ${i}`)];
  const r=parseOpenAiResponse({status:"completed",output:[{type:"web_search_call",action:{type:"search",queries:input}}]});
  assert.deepEqual(r.queries,input);assert.equal(r.exposedQueryCount,13);
});
test("unsafe or credential-bearing source URLs are discarded without inventing replacements", () => {
  const r=parseOpenAiResponse({status:"completed",output:[{type:"web_search_call",action:{type:"search",sources:[{url:"javascript:alert(1)"},{url:"data:text/plain,x"},{url:"https://user:secret@example.com/"},{url:"https://example.com/valid"}]}}]});
  assert.deepEqual(r.actions[0].sources.map(x=>x.url),["https://example.com/valid"]);
});
test("Gemini reads Interactions search calls, preserves run citations, and drops result payloads", () => {
  const r=parseGeminiInteraction(fixtures.gemini);
  assert.deepEqual(r.queries,["example topic","example cost"]);assert.equal(r.searchActionCount,1);
  assert.deepEqual(r.actions[0].sources,[]);assert.equal(r.actions[0].sourceScope,"not_exposed");
  assert.equal(r.runSources[0].sourceScope,"run");
  assert.ok(!JSON.stringify(r).includes("search_suggestions"));assert.ok(!JSON.stringify(r).includes("SYNTHETIC marker"));
});
test("Gemini never substitutes GenerateContent grounding metadata for Interactions steps", () => {
  const r=parseGeminiInteraction({status:"completed",steps:[],candidates:[{groundingMetadata:{webSearchQueries:["must not be imported"]}}]});
  assert.deepEqual(r.queries,[]);assert.equal(r.exposedQueryCount,0);
});
test("missing call identifiers remain null rather than looking provider supplied", () => {
  const r=parseGeminiInteraction({status:"completed",steps:[{type:"google_search_call",arguments:{queries:["example"]}}]});
  assert.equal(r.actions[0].providerCallId,null);assert.equal(r.model,null);
});
test("the offline parser has no network request, cost inference or hidden-reasoning output", () => {
  const r=parseGeminiInteraction({...fixtures.gemini,usage:{total_input_tokens:123},steps:[...fixtures.gemini.steps,{type:"thought",summary:[{text:"must not copy"}]}]});
  assert.ok(!JSON.stringify(r).includes("must not copy"));assert.ok(!Object.hasOwn(r,"estimatedCost"));
  assert.equal(r.parserVersion,"ai-fanout.parser-example/1.0");
});
