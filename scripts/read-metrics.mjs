import { metricEvents, metricProviders } from "../src/server/metrics.mjs";

const dateArg=process.argv.find(arg=>arg.startsWith("--date="))?.slice(7);
const date=dateArg||new Date().toISOString().slice(0,10);
if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("Use --date=YYYY-MM-DD");
const url=process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/,"");
const token=process.env.UPSTASH_REDIS_REST_TOKEN;
if(!url||!token)throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required");

const summary={date,events:{}};
for(const event of metricEvents){
  summary.events[event]={};
  for(const provider of metricProviders){
    const key=`metrics:${date}:${event}:${provider}`;
    const response=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(["GET",key]),signal:AbortSignal.timeout(4000)});
    if(!response.ok)throw new Error(`Metrics read failed (${response.status})`);
    const payload=await response.json();
    summary.events[event][provider]=Number(payload.result||0);
  }
}
console.log(JSON.stringify(summary,null,2));
