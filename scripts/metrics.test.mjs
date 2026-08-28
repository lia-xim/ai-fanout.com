import assert from "node:assert/strict";
import test from "node:test";
import { incrementMetric } from "../src/server/metrics.mjs";

test("metrics contain only date, event and an allowlisted provider", async () => {
  let request;
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async (url,options)=>{request={url,options};return new Response("1")};
  try{
    const ok=await incrementMetric("export_selected_csv",{provider:"openai",url:"https://redis.example",token:"secret",now:new Date("2026-08-28T10:00:00Z")});
    assert.equal(ok,true);
    const command=JSON.parse(request.options.body);
    assert.deepEqual(command,["INCR","metrics:2026-08-28:export_selected_csv:openai"]);
    assert.equal(request.options.body.includes("keyword"),false);
  }finally{globalThis.fetch=originalFetch}
});

test("unknown providers are reduced to the aggregate bucket", async () => {
  let body="";
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async (_url,options)=>{body=options.body;return new Response("1")};
  try{
    await incrementMetric("run_failed",{provider:"user-supplied",url:"https://redis.example",token:"secret",now:new Date("2026-08-28T10:00:00Z")});
    assert.equal(body.includes(":all"),true);
    assert.equal(body.includes("user-supplied"),false);
  }finally{globalThis.fetch=originalFetch}
});

test("unknown events and missing credentials produce no request", async () => {
  assert.equal(await incrementMetric("raw_keyword",{url:"x",token:"y"}),false);
  assert.equal(await incrementMetric("run_started",{url:"",token:""}),false);
});
