import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const load=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),"utf8"));
test("published observations have a versioned contract and traceable run fields",async()=>{
  const [schema,fixture]=await Promise.all([load("../public/contracts/example-observation.schema.v1.json"),load("../public/examples/openai-observations-2026-08-27.json")]);
  assert.equal(schema.properties.schemaVersion.const,fixture.schemaVersion);assert.equal(fixture.provider,"openai");assert.equal(fixture.protocol.store,false);
  assert.equal(new Set(fixture.observations.map(run=>run.id)).size,fixture.observations.length);
  for(const run of fixture.observations){assert.equal(Number.isNaN(Date.parse(run.observedAt)),false);assert.ok(["completed","incomplete"].includes(run.providerResponseStatus));assert.ok(run.queries.length>0);assert.ok(run.input.keyword&&run.input.country&&run.input.language)}
  assert.match(fixture.notice,/not an independent provider benchmark/i);
});
test("monthly evidence plan is bounded and contains planned topics, not results",async()=>{
  const plan=await load("../public/examples/monthly-observation-plan.v1.json");assert.equal(plan.status,"planned_not_results");assert.ok(plan.topics.length>=10&&plan.topics.length<=20);assert.equal(new Set(plan.topics.map(topic=>topic.id)).size,plan.topics.length);assert.ok(plan.topics.every(topic=>topic.state==="planned"));assert.match(plan.publicationBoundary,/Gemini.*not part of the public evidence corpus/i);
});
test("normalized CSV has one row per query and no invented query-source field",async()=>{
  const fixture=await load("../public/examples/openai-observations-2026-08-27.json");const csv=await readFile(new URL("../public/examples/openai-observations-2026-08-27.csv",import.meta.url),"utf8");const rows=csv.trim().split("\n");assert.equal(rows.length,1+fixture.observations.reduce((sum,run)=>sum+run.queries.length,0));assert.match(rows[0],/search_action_source_domains/);assert.doesNotMatch(rows[0],/(^|,)query_source_domain/);
});
