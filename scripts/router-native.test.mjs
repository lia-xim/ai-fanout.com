import test from "node:test";
import assert from "node:assert/strict";
import { OpenRouterNativeProvider } from "../src/server/fanout/native-provider.mjs";
import { displayModelLabel, providerForModel } from "../src/scripts/fanout-models.mjs";
const input={keyword:"best SEO tools",language:"en",country:"US"};
const fixture=()=>({model:"anthropic/claude-haiku-5.5",status:"incomplete",output:[
  {type:"openrouter:web_search",id:"a",status:"completed",action:{type:"search",query:"seo pricing",sources:[{url:"https://example.org/pricing",title:"Pricing",encrypted_content:"never-return"}]}},
  {type:"message",content:[{type:"output_text",text:"Never-return final answer",annotations:[{type:"url_citation",url:"https://example.org/citation",title:"Citation",cited_text:"never-return"}]}]},
],usage:{input_tokens:100,output_tokens:20,server_tool_use:{web_search_requests:1}},openrouter_metadata:{pipeline:[{type:"server_tools",data:{mode:"native",tools:["openrouter:web_search"]}}],endpoints:{available:[{provider:"Anthropic",selected:true}]}}});
const adapter=data=>new OpenRouterNativeProvider({apiKey:"secret",fetchImpl:async()=>({ok:true,json:async()=>data})});
test("Haiku uses one OpenRouter Responses native request and preserves exposed action sources",async()=>{
  let calls=0,request;
  const provider=new OpenRouterNativeProvider({apiKey:"secret",fetchImpl:async(url,options)=>{calls++;request={url,options,body:JSON.parse(options.body)};return{ok:true,json:async()=>fixture()}}});
  const result=await provider.observe(input);
  assert.equal(calls,1);assert.equal(request.url,"https://openrouter.ai/api/v1/responses");assert.equal(request.options.headers.Authorization,"Bearer secret");
  assert.equal(request.options.headers["X-OpenRouter-Metadata"],"enabled");assert.equal(request.body.model,"anthropic/claude-haiku-5.5");assert.equal(request.body.max_output_tokens,500);assert.equal(request.body.max_tool_calls,8);
  assert.equal(request.body.tools[0].parameters.engine,"native");assert.deepEqual(request.body.provider,{only:["Anthropic"],allow_fallbacks:false});assert.equal(request.body.plugins,undefined);
  assert.deepEqual(result.queries,["seo pricing"]);assert.equal(result.provider,"anthropic");assert.equal(result.usage.estimatedCostUsd,.01002);assert.equal(result.providerResponseStatus,"incomplete");
  assert.deepEqual(result.searchActions[0].sources,[{url:"https://example.org/pricing",title:"Pricing"}]);assert.equal(result.searchActions[0].sourceScope,"exact_query");assert.equal(JSON.stringify(result).includes("never-return"),false);
});
test("native labels require native engine, expected model and selected provider evidence",async()=>{
  for(const mutate of [d=>d.openrouter_metadata.pipeline[0].data.mode="exa",d=>delete d.openrouter_metadata,d=>d.model="other-model",d=>d.openrouter_metadata.endpoints.available[0].provider="unapproved"]){const d=fixture();mutate(d);await assert.rejects(()=>adapter(d).observe(input),/PROVIDER_INVALID_OUTPUT/);}
});
test("completed citation-only output stays zero rather than inventing search query strings",async()=>{
  const d=fixture();d.status="completed";d.output=d.output.filter(item=>item.type==="message");const result=await adapter(d).observe(input);assert.deepEqual(result.queries,[]);assert.deepEqual(result.searchActions,[]);assert.equal(result.sources.length,1);
});
test("failed and unfinished search output is never reported as a completed zero",async()=>{
  for(const mutate of [d=>d.status="failed",d=>d.error={code:"unavailable"},d=>{d.status="incomplete";d.output=[]},d=>d.output[0].status="in_progress"]){const d=fixture();mutate(d);await assert.rejects(()=>adapter(d).observe(input),/PROVIDER_UNAVAILABLE|PROVIDER_INCOMPLETE/);}
});
test("OpenRouter-reported cost overrides list estimates without a direct-account allowance",async()=>{
  const d=fixture();d.usage.cost=.023;const result=await adapter(d).observe(input);assert.equal(result.usage.estimatedCostUsd,.023);assert.equal(result.usage.estimateKind,"provider_reported_cost");assert.equal(result.usage.estimatedCostUsdMaximum,undefined);
});
test("routed Gemini keeps grounded sources run-level and requests mandatory low reasoning",async()=>{
  const d=geminiFixture();let body,url;
  const provider=new OpenRouterNativeProvider({apiKey:"secret",provider:"gemini",fetchImpl:async(endpoint,options)=>{url=endpoint;body=JSON.parse(options.body);return{ok:true,json:async()=>d}}});
  const result=await provider.observe(input);assert.equal(url,"https://openrouter.ai/api/v1/chat/completions");assert.deepEqual(body.reasoning,{effort:"low",exclude:true});assert.equal(body.tool_choice,"auto");assert.equal(body.max_tokens,500);assert.equal(body.max_tool_calls,8);assert.equal(body.tools[0].parameters.max_uses,8);
  assert.deepEqual(result.queries,[]);assert.deepEqual(result.searchActions,[]);assert.equal(result.sources.length,1);assert.equal(result.searchActionCount,2);assert.equal(result.providerResponseStatus,"incomplete");assert.equal(result.provider,"gemini");assert.equal(result.usage.estimateKind,"provider_reported_cost");assert.equal(result.usage.estimatedCostUsd,.029911);assert.equal(result.usage.estimatedCostUsdMaximum,undefined);assert.match(result.notice,/no query strings/);assert.equal(JSON.stringify(result).includes("never-return"),false);
});
const geminiFixture=()=>({model:"google/gemini-3.8-flash",choices:[{finish_reason:"length",message:{role:"assistant",content:"never-return final answer",reasoning_details:[{signature:"never-return"}],annotations:[{type:"url_citation",url_citation:{url:"https://example.org/source",title:"Source",content:"never-return"}}]}}],usage:{prompt_tokens:68,completion_tokens:496,cost:.029911,server_tool_use_details:{web_search_requests:2}},openrouter_metadata:{pipeline:[{type:"server_tools",data:{mode:"native",tools:["openrouter:web_search"]}}],endpoints:{available:[{provider:"Google",selected:true}]}}});
test("Gemini rejects empty truncation, refusal, failed finish and external search",async()=>{
  for(const mutate of [d=>d.choices[0].message.annotations=[],d=>d.choices[0].message.refusal="refused",d=>d.choices[0].finish_reason="error",d=>d.usage.server_tool_use_details.web_search_requests=-1,d=>d.openrouter_metadata.pipeline[0].data.mode="exa"]){const d=geminiFixture();mutate(d);const provider=new OpenRouterNativeProvider({apiKey:"secret",provider:"gemini",fetchImpl:async()=>({ok:true,json:async()=>d})});await assert.rejects(()=>provider.observe(input),/PROVIDER_INCOMPLETE|PROVIDER_INVALID_OUTPUT/);}
});
test("Gemini completed native response with no exposed queries remains an honest zero",async()=>{
  const d=geminiFixture();d.choices[0].finish_reason="stop";d.choices[0].message.annotations=[];d.usage.server_tool_use_details.web_search_requests=0;const provider=new OpenRouterNativeProvider({apiKey:"secret",provider:"gemini",fetchImpl:async()=>({ok:true,json:async()=>d})});const result=await provider.observe(input);assert.equal(result.providerResponseStatus,"completed");assert.deepEqual(result.queries,[]);assert.equal(result.searchActionCount,0);
});
test("current and historical model labels keep their identity and Anthropic attribution",()=>{
  assert.equal(displayModelLabel("openai/gpt-6-luna"),"GPT-6 Luna");assert.equal(displayModelLabel("gemini-3.8-flash"),"Gemini 3.8 Flash");assert.equal(displayModelLabel("anthropic/claude-haiku-5.5"),"Claude Haiku 5.5");assert.equal(displayModelLabel("gpt-5.6-luna"),"GPT-5.6 Luna");assert.equal(providerForModel("anthropic/claude-haiku-5.5"),"anthropic");
});
