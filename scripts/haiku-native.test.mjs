import test from "node:test";
import assert from "node:assert/strict";
import { OpenRouterAnthropicNativeProvider } from "../src/server/fanout/native-provider.mjs";
import { displayModelLabel, providerForModel } from "../src/scripts/fanout-models.mjs";

const input={keyword:"best SEO tools",language:"en",country:"US"};
const fixture=()=>({model:"anthropic/claude-haiku-5.5",stop_reason:"end_turn",content:[
  {type:"server_tool_use",id:"a",name:"web_search",input:{query:"seo pricing"}},
  {type:"web_search_tool_result",tool_use_id:"b",content:[{type:"web_search_result",url:"https://example.org/other",title:"Other",encrypted_content:"never-return"}]},
  {type:"web_search_tool_result",tool_use_id:"a",content:[{type:"web_search_result",url:"https://example.org/pricing",title:"Pricing",encrypted_content:"never-return"}]},
  {type:"text",text:"Never-return final answer",citations:[{type:"web_search_result_location",url:"https://example.org/citation",title:"Citation",cited_text:"never-return"}]},
],usage:{input_tokens:100,output_tokens:20,server_tool_use:{web_search_requests:1}}});
const provider=data=>new OpenRouterAnthropicNativeProvider({apiKey:"secret",fetchImpl:async()=>({ok:true,json:async()=>data})});

test("Haiku uses exactly one OpenRouter Messages request with native Anthropic search and hard caps",async()=>{
  let calls=0,request;
  const adapter=new OpenRouterAnthropicNativeProvider({apiKey:"secret",fetchImpl:async(url,options)=>{calls++;request={url,options,body:JSON.parse(options.body)};return{ok:true,json:async()=>fixture()}}});
  const result=await adapter.observe(input);
  assert.equal(calls,1);assert.equal(request.url,"https://openrouter.ai/api/v1/messages");assert.equal(request.options.headers.Authorization,"Bearer secret");
  assert.equal(request.body.model,"anthropic/claude-haiku-5.5");assert.equal(request.body.max_tokens,500);
  assert.deepEqual(request.body.tools,[{type:"web_search_20250305",name:"web_search",max_uses:8}]);assert.deepEqual(request.body.provider,{only:["Anthropic"],allow_fallbacks:false});
  assert.equal(request.body.plugins,undefined);assert.equal(JSON.stringify(request.body).includes("secret"),false);
  assert.deepEqual(result.queries,["seo pricing"]);assert.equal(result.provider,"anthropic");assert.equal(result.usage.estimatedCostUsd,.01002);
  assert.deepEqual(result.searchActions[0].sources,[{url:"https://example.org/pricing",title:"Pricing"}]);assert.equal(result.searchActions[0].sourceScope,"exact_query");
  assert.equal(JSON.stringify(result).includes("never-return"),false);
});
test("zero native query strings stays zero and citation-only sources stay run-level",async()=>{
  const data=fixture();data.content=data.content.filter(block=>block.type==="text");
  const result=await provider(data).observe(input);assert.deepEqual(result.queries,[]);assert.deepEqual(result.searchActions,[]);assert.equal(result.sources.length,1);
});
test("HTTP 200 native tool errors are failures rather than successful zero-query runs",async()=>{
  const data=fixture();data.content[2].content={type:"web_search_tool_result_error",error_code:"unavailable"};
  await assert.rejects(()=>provider(data).observe(input),/PROVIDER_UNAVAILABLE/);
});
test("unfinished searches, missing tool results and paused turns never trigger another request",async()=>{
  for(const mutate of [data=>data.stop_reason="pause_turn",data=>data.content=data.content.filter(block=>block.tool_use_id!=="a"),data=>{data.stop_reason="max_tokens";data.content=[]}]){
    const data=fixture();mutate(data);await assert.rejects(()=>provider(data).observe(input),/PROVIDER_INCOMPLETE/);
  }
});
test("an empty successful search result is distinct from a native tool error",async()=>{
  const data=fixture();data.content[2].content=[];
  const result=await provider(data).observe(input);assert.deepEqual(result.queries,["seo pricing"]);assert.deepEqual(result.searchActions[0].sources,[]);
});
test("current and historical model labels keep their identity and Anthropic attribution",()=>{
  assert.equal(displayModelLabel("openai/gpt-6-luna"),"GPT-6 Luna");assert.equal(displayModelLabel("gemini-3.8-flash"),"Gemini 3.8 Flash");assert.equal(displayModelLabel("anthropic/claude-haiku-5.5"),"Claude Haiku 5.5");
  assert.equal(displayModelLabel("gpt-5.6-luna"),"GPT-5.6 Luna");assert.equal(providerForModel("anthropic/claude-haiku-5.5"),"anthropic");
});
