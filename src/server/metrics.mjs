const EVENTS=new Set(["run_started","run_succeeded","run_zero_query","run_failed","run_timeout","result_saved","compare_runs","export_json","export_csv","export_selected_json","export_selected_csv","export_contextter_csv","click_seo_fanout","click_contextter"]);
const PROVIDERS=new Set(["openai","gemini","modelled","all"]);
export async function incrementMetric(event,{provider="all",url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN,now=new Date()}={}){
  if(!EVENTS.has(event)||!url||!token)return false;
  const safeProvider=PROVIDERS.has(provider)?provider:"all";
  const key=`metrics:${now.toISOString().slice(0,10)}:${event}:${safeProvider}`;
  await fetch(url.replace(/\/$/,""),{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(["INCR",key]),signal:AbortSignal.timeout(2000)}).catch(()=>undefined);
  return true;
}
export const metricEvents=EVENTS;
export const metricProviders=PROVIDERS;
