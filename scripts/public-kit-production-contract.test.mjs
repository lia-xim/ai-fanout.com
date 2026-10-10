import test from "node:test";
import assert from "node:assert/strict";
import { createNativeFanoutService } from "../src/server/fanout/native-service.mjs";
import { createFanoutService } from "../src/server/fanout/service.mjs";
import { selectedQueryExport } from "../src/scripts/fanout-selection.mjs";
import { compareFanoutRuns } from "../src/scripts/fanout-comparison.mjs";
import { prepareResultForLocalStorage } from "../src/scripts/fanout-history.mjs";
import { validateExport } from "../public/code/fanout-kit/v2/validate.mjs";
const now=()=>new Date("2026-10-10T00:00:00.000Z");
const quota={limit:20,used:1,remaining:19,resetAt:"2026-10-11T00:00:00.000Z"};
const ledger={reserve:async()=>({quota}),settle:async()=>{}};
const usage={inputTokens:0,outputTokens:0,searchActionCount:0,searchQueryCount:0,estimatedCostUsd:0,estimateKind:"list_price_estimate",pricingCheckedAt:"2026-10-10",pricingBasis:"Synthetic stub; no provider call."};
const dependencies={ledger,captchaVerifier:async()=>{},bucketSalt:"synthetic-test-only",now};
const observed={queries:[],sources:[],searchActions:[],searchActionCount:0,providerResponseStatus:"completed",usage,model:"synthetic-model",provider:"openai",inputTokens:0,outputTokens:0,latencyMs:0};
const body={keyword:"example topic",language:"en",country:"US",turnstileToken:"synthetic"};
test("reference validates outputs of actual native service, selection, stripped save and comparison producers",async()=>{
  const service=createNativeFanoutService({...dependencies,providers:{openai:{observe:async()=>observed}}});
  const native=await service({body:{...body,provider:"openai"},remoteIp:"synthetic-test"});
  const gemini=prepareResultForLocalStorage({...native,providerId:"gemini",sourceEvidenceScope:"run_level_only"});
  for(const value of [native,selectedQueryExport(native,new Set()),gemini,compareFanoutRuns([{id:"a",savedAt:now().getTime(),result:native},{id:"b",savedAt:now().getTime(),result:gemini}])]){
    const result=validateExport(value);assert.equal(result.valid,true,JSON.stringify(result.errors));
  }
  const haikuService=createNativeFanoutService({...dependencies,providers:{anthropic:{observe:async()=>({...observed,provider:"anthropic"})}}});
  const haiku=await haikuService({body:{...body,provider:"anthropic"},remoteIp:"synthetic-test"});
  assert.equal(validateExport(haiku).valid,true);
});
test("reference validates actual modelled service output without fabricating root schemaVersion",async()=>{
  const queries=Array.from({length:10},(_,i)=>({query:`example question ${i+1}`,intent:"informational",reason:"Original synthetic test fixture."}));
  const service=createFanoutService({...dependencies,provider:{generate:async()=>({result:{queries},model:"synthetic-model",provider:"openrouter",actualCostMicroEur:0,inputTokens:0,outputTokens:0,latencyMs:0})}});
  for(const model of ["openai/gpt-6-luna","google/gemini-3.8-flash","anthropic/claude-haiku-5.5"]){
    const result=await service({body:{...body,model},remoteIp:"synthetic-test"});
    assert.equal(Object.hasOwn(result,"schemaVersion"),false);
    assert.equal(validateExport(result).valid,true);
  }
});
