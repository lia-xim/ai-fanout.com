const EVENTS=new Set(["run_started","run_succeeded","run_zero_query","result_saved","export_json","export_csv","click_seo_fanout","click_contextter"]);
export async function incrementMetric(event,{provider="all",url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN,now=new Date()}={}){
  if(!EVENTS.has(event)||!url||!token)return false;
  const safeProvider=["openai","gemini","modelled","all"].includes(provider)?provider:"all";
  const key=`metrics:${now.toISOString().slice(0,10)}:${event}:${safeProvider}`;
  await fetch(url.replace(/\/$/,""),{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(["INCR",key]),signal:AbortSignal.timeout(2000)}).catch(()=>undefined);
  return true;
}
export const metricEvents=EVENTS;
