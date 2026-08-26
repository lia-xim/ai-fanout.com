import test from "node:test";
import assert from "node:assert/strict";
import { MAX_NATIVE_SEARCHES, NATIVE_RESERVE_MICRO_EUR } from "../src/server/fanout/native-contracts.mjs";
import { GeminiNativeProvider, OpenAINativeProvider } from "../src/server/fanout/native-provider.mjs";
import { createNativeFanoutService } from "../src/server/fanout/native-service.mjs";
import { MemoryQuotaLedger } from "../src/server/fanout/quota.mjs";
import { allowedRequestOrigins, expectedTurnstileHostnames } from "../src/server/fanout/request-origin.mjs";

const input={keyword:"best SEO tools",provider:"openai",language:"en",country:"US",turnstileToken:"valid"};

test("preview origins and Turnstile hostnames include only trusted Vercel system URLs",()=>{
  const previewEnv={VERCEL_ENV:"preview",VERCEL_URL:"ai-fanout-build.vercel.app",VERCEL_BRANCH_URL:"https://ai-fanout-branch.vercel.app/path"};
  const origins=allowedRequestOrigins(previewEnv);
  assert.equal(origins.has("https://ai-fanout-build.vercel.app"),true);
  assert.equal(origins.has("https://ai-fanout-branch.vercel.app"),true);
  assert.equal(origins.has("http://localhost:4321"),true);
  const hostnames=expectedTurnstileHostnames("ai-fanout.com",previewEnv);
  assert.deepEqual([...hostnames],["ai-fanout.com","ai-fanout-build.vercel.app","ai-fanout-branch.vercel.app"]);
  const production=allowedRequestOrigins({...previewEnv,VERCEL_ENV:"production"});
  assert.equal(production.has("https://ai-fanout-build.vercel.app"),false);
  assert.equal(production.has("http://localhost:4321"),false);
});

test("OpenAI uses one stateless native web-search call and extracts exposed queries and sources",async()=>{
  let request;
  const provider=new OpenAINativeProvider({apiKey:"openai-secret",fetchImpl:async(url,options)=>{request={url,options,body:JSON.parse(options.body)};return{ok:true,json:async()=>({model:"gpt-5.6-luna",output:[{type:"web_search_call",action:{type:"search",queries:["best seo software","seo tools pricing"],sources:[{url:"https://example.com/a",title:"A"}]}},{type:"message",content:[{annotations:[{type:"url_citation",url:"https://example.com/b",title:"B"}]}]}],usage:{input_tokens:20,output_tokens:30}})}}});
  const result=await provider.observe(input);
  assert.equal(request.url,"https://api.openai.com/v1/responses");assert.deepEqual(request.body.tools,[{type:"web_search"}]);assert.equal(request.body.tool_choice,"required");assert.equal(request.body.max_tool_calls,MAX_NATIVE_SEARCHES);assert.equal(request.body.store,false);assert.equal(JSON.stringify(request.body).includes("openai-secret"),false);assert.equal(request.options.headers.Authorization,"Bearer openai-secret");assert.deepEqual(result.queries,["best seo software","seo tools pricing"]);assert.equal(result.sources.length,2);
});

test("Gemini uses native Google Search and extracts executed queries and citations",async()=>{
  let request;
  const provider=new GeminiNativeProvider({apiKey:"gemini-secret",fetchImpl:async(url,options)=>{request={url,options,body:JSON.parse(options.body)};return{ok:true,json:async()=>({model:"gemini-3.7-flash",steps:[{type:"google_search_call",arguments:{queries:["beste seo tools 2026","seo software vergleich"]}},{type:"model_output",content:[{type:"text",annotations:[{type:"url_citation",url:"https://example.org/source",title:"Source"}]}]}],usage:{total_input_tokens:10,total_output_tokens:20}})}}});
  const result=await provider.observe({...input,provider:"gemini"});
  assert.equal(request.url,"https://generativelanguage.googleapis.com/v1beta/interactions");assert.deepEqual(request.body.tools,[{type:"google_search"}]);assert.equal(request.body.store,false);assert.equal(JSON.stringify(request.body).includes("gemini-secret"),false);assert.equal(request.options.headers["x-goog-api-key"],"gemini-secret");assert.deepEqual(result.queries,["beste seo tools 2026","seo software vergleich"]);assert.equal(result.sources[0].url,"https://example.org/source");
});

test("zero exposed query strings stays empty instead of inventing fanout",async()=>{
  const provider=new OpenAINativeProvider({apiKey:"x",fetchImpl:async()=>({ok:true,json:async()=>({model:"gpt-5.6-luna",output:[{type:"message",content:[]}],usage:{}})})});
  const result=await provider.observe(input);assert.deepEqual(result.queries,[]);assert.equal(result.searchActionCount,0);
});

test("native service is strict, CAPTCHA-first, separately bucketed, and stores no raw input",async()=>{
  const ledger=new MemoryQuotaLedger({reserveMicroEur:NATIVE_RESERVE_MICRO_EUR});let captchaCalls=0;
  const providers={openai:{observe:async()=>({queries:["seo tools"],sources:[],searchActionCount:1,model:"gpt-5.6-luna",provider:"openai",inputTokens:1,outputTokens:2,actualCostMicroEur:NATIVE_RESERVE_MICRO_EUR,latencyMs:3})}};
  const service=createNativeFanoutService({ledger,providers,bucketSalt:"test",now:()=>new Date("2026-08-26T12:00:00Z"),captchaVerifier:async token=>{captchaCalls++;if(token!=="valid")throw new Error("CAPTCHA")}});
  await assert.rejects(()=>service({body:{...input,extra:"no"},remoteIp:"1.2.3.4"}),/INVALID_REQUEST/);assert.equal(captchaCalls,0);
  const result=await service({body:input,remoteIp:"1.2.3.4"});assert.equal(result.evidenceStatus,"provider_exposed_native_search");assert.deepEqual(result.queries,["seo tools"]);assert.equal(JSON.stringify([...ledger.records.values()]).includes(input.keyword),false);
});
