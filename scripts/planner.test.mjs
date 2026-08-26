import test from "node:test";
import assert from "node:assert/strict";
import { MODEL_ID, REQUEST_RESERVE_MICRO_EUR, TOOL_VERSION, ToolError, validateKeyword } from "../src/server/fanout/contracts.mjs";
import { OpenRouterObservedQueryProvider, extractObservedResult } from "../src/server/fanout/provider.mjs";
import { MemoryQuotaLedger } from "../src/server/fanout/quota.mjs";
import { createObservedQueryService, verifyTurnstile } from "../src/server/fanout/service.mjs";

const result = { queries:[{query:"best SEO tools"},{query:"SEO software for agencies"}], sources:[{url:"https://example.com/guide",title:"Guide"}], searchCallCount:2 };
const okProvider = { observe: async () => ({ result, inputTokens:100, outputTokens:20, actualCostMicroEur:1_000, latencyMs:20, model:MODEL_ID, provider:"openrouter" }) };
const create = ({ ledger = new MemoryQuotaLedger(), provider = okProvider } = {}) => { let captchaCalls=0; const service=createObservedQueryService({ledger,provider,bucketSalt:"test-salt",now:()=>new Date("2026-08-24T12:00:00Z"),captchaVerifier:async token=>{captchaCalls++;if(token!=="valid")throw new ToolError("CAPTCHA_FAILED",403)}});return{ledger,service,get captchaCalls(){return captchaCalls}} };
const body = { keyword:"SEO tools", language:"en", country:"DE", turnstileToken:"valid" };

test("validates Unicode, byte, URL, file and multiline limits",()=>{assert.equal(validateKeyword("  SEO tools  "),"SEO tools");assert.throws(()=>validateKeyword("x"),/KEYWORD_TOO_SHORT/);assert.throws(()=>validateKeyword("🙂".repeat(61)),/KEYWORD_TOO_LONG/);assert.throws(()=>validateKeyword("https://example.com"),/URL_NOT_ALLOWED/);assert.throws(()=>validateKeyword("upload report.pdf"),/FILES_NOT_ALLOWED/);assert.throws(()=>validateKeyword("seo\ntools"),/KEYWORD_MULTILINE/)});
test("request object is strict before CAPTCHA",async()=>{const ctx=create();await assert.rejects(()=>ctx.service({body:{...body,extra:"no"},remoteIp:"1.2.3.4"}),/INVALID_REQUEST/);assert.equal(ctx.captchaCalls,0)});
test("failed CAPTCHA does not reserve budget",async()=>{const ctx=create();await assert.rejects(()=>ctx.service({body:{...body,turnstileToken:"bad"},remoteIp:"1.2.3.4"}),/CAPTCHA_FAILED/);assert.equal(ctx.ledger.records.size,0)});
test("Turnstile requires success, expected action and approved hostname",async()=>{
  const expectedHostnames=new Set(["ai-fanout.com"]);
  const verify=(result)=>verifyTurnstile({token:"valid",secret:"secret",remoteIp:"1.2.3.4",expectedAction:"fanout",expectedHostnames,fetchImpl:async()=>({ok:true,json:async()=>result})});
  await assert.doesNotReject(()=>verify({success:true,action:"fanout",hostname:"ai-fanout.com"}));
  await assert.rejects(()=>verify({success:true,action:"other",hostname:"ai-fanout.com"}),/CAPTCHA_FAILED/);
  await assert.rejects(()=>verify({success:true,action:"fanout",hostname:"attacker.example"}),/CAPTCHA_FAILED/);
});
test("five runs per hashed IP bucket and sixth is blocked",async()=>{const ctx=create();for(let i=0;i<5;i++)await ctx.service({body:{...body,keyword:`SEO tools ${i}`},remoteIp:"1.2.3.4"});await assert.rejects(()=>ctx.service({body:{...body,keyword:"SEO tools six"},remoteIp:"1.2.3.4"}),/RATE_LIMIT/)});
test("global daily limit blocks run 41",async()=>{const ctx=create();for(let i=0;i<40;i++)await ctx.service({body:{...body,keyword:`SEO topic ${i}`},remoteIp:`10.0.0.${i}`});await assert.rejects(()=>ctx.service({body:{...body,keyword:"last topic"},remoteIp:"10.0.1.1"}),/GLOBAL_LIMIT/)});
test("parallel reservations cannot cross hard monthly budget",async()=>{const ledger=new MemoryQuotaLedger({spent:24_980_000});ledger.reserved=4_700_000;const calls=[1,2,3].map(i=>ledger.reserve({bucketHash:`b${i}`,reservationId:`r${i}`,questionHash:`q${i}`,model:MODEL_ID,plannerVersion:TOOL_VERSION}));const settled=await Promise.allSettled(calls);assert.equal(settled.filter(item=>item.status==="fulfilled").length,2);assert.equal(settled.filter(item=>item.status==="rejected"&&item.reason.code==="BUDGET_LIMIT").length,1);assert.equal(ledger.reserved,4_700_000+2*REQUEST_RESERVE_MICRO_EUR)});
test("provider failure settles reservation and stores no raw input",async()=>{const ctx=create({provider:{observe:async()=>{throw new ToolError("PROVIDER_UNAVAILABLE",502)}}});await assert.rejects(()=>ctx.service({body,remoteIp:"1.2.3.4"}),/PROVIDER_UNAVAILABLE/);const record=[...ctx.ledger.records.values()][0];assert.equal(record.status,"failed");assert.equal(ctx.ledger.reserved,0);assert.equal(JSON.stringify(record).includes(body.keyword),false)});
test("timeout is surfaced with one provider call",async()=>{let calls=0;const ctx=create({provider:{observe:async()=>{calls++;throw new ToolError("PROVIDER_TIMEOUT",504)}}});await assert.rejects(()=>ctx.service({body,remoteIp:"1.2.3.4"}),/PROVIDER_TIMEOUT/);assert.equal(calls,1);assert.equal([...ctx.ledger.records.values()][0].status,"timeout")});
test("extracts only provider search actions and cited URLs",()=>{const parsed=extractObservedResult({output:[{type:"web_search_call",id:"s1",action:{type:"search",query:"best SEO tools",sources:[{url:"https://example.com/a",title:"A"}]}},{type:"message",content:[{type:"output_text",annotations:[{type:"url_citation",url:"https://example.org/b",title:"B"}]}]}],usage:{server_tool_use:{web_search_requests:1}}});assert.deepEqual(parsed.queries,[{query:"best SEO tools",callId:"s1"}]);assert.equal(parsed.sources.length,2);assert.equal(parsed.searchCallCount,1)});
test("does not turn answer text into invented queries",()=>{const parsed=extractObservedResult({output:[{type:"message",content:[{type:"output_text",text:"Try best tools and cheap tools"}]}]});assert.deepEqual(parsed.queries,[])});
test("OpenRouter request is one bounded native-search call with no client secret",async()=>{
  let calls=0,request;
  const provider=new OpenRouterObservedQueryProvider({apiKey:"server-secret",fetchImpl:async(url,options)=>{
    calls++;request={url,options,body:JSON.parse(options.body)};
    return {ok:true,json:async()=>({model:MODEL_ID,output:[{type:"web_search_call",action:{query:"seo tools"}}],usage:{input_tokens:10,output_tokens:5,cost:0.001}})};
  }});
  await provider.observe({keyword:"SEO tools",language:"en",country:"DE"});
  assert.equal(calls,1);assert.equal(request.url,"https://openrouter.ai/api/v1/responses");assert.equal(request.body.model,MODEL_ID);assert.equal(request.body.store,false);assert.equal(request.body.max_tool_calls,8);assert.equal(request.body.tools[0].type,"openrouter:web_search");assert.equal(request.body.tools[0].parameters.engine,"native");assert.equal(request.body.tools[0].parameters.user_location.country,"DE");assert.equal(JSON.stringify(request.body).includes("server-secret"),false);assert.equal(request.options.headers.Authorization,"Bearer server-secret");
});
test("provider rejects a response without exposed query strings",async()=>{const provider=new OpenRouterObservedQueryProvider({apiKey:"x",fetchImpl:async()=>({ok:true,json:async()=>({output:[{type:"message",content:[{type:"output_text",text:"answer"}]}]})})});await assert.rejects(()=>provider.observe({keyword:"SEO tools",language:"en",country:""}),/PROVIDER_QUERY_TRACE_UNAVAILABLE/)});
test("successful service output is dated and evidence-labelled",async()=>{const data=await create().service({body,remoteIp:"1.2.3.4"});assert.equal(data.keyword,"SEO tools");assert.equal(data.queries.length,2);assert.equal(data.evidenceStatus,"provider_exposed_search_actions");assert.equal(data.observedAt,"2026-08-24T12:00:00.000Z");assert.equal(data.toolVersion,TOOL_VERSION)});
