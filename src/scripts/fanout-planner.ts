import { clearSavedRuns, deleteSavedRun, loadSavedRuns, saveRun } from "./fanout-history.mjs";

type ModelledQuery={query:string;intent:string;reason:string};
type Source={url:string;title:string};
type FanoutResult={keyword:string;language:"en"|"de";country:string|null;queries:(ModelledQuery|string)[];sources?:Source[];modelId:string;providerId:string;generatedAt:string;evidenceStatus:string;notice:string};

const countryNames:Record<string,string>={DE:"Germany",US:"United States",GB:"United Kingdom",AT:"Austria",CH:"Switzerland",FR:"France",ES:"Spain",IT:"Italy",NL:"Netherlands"};

for(const root of document.querySelectorAll<HTMLElement>("[data-fanout-planner]")){
  const form=root.querySelector<HTMLFormElement>("[data-planner-form]")!;
  const keyword=root.querySelector<HTMLInputElement>("input[name='keyword']")!;
  const count=root.querySelector<HTMLOutputElement>("[data-keyword-count]")!;
  const status=root.querySelector<HTMLElement>("[data-form-status]")!;
  const availability=root.querySelector<HTMLElement>("[data-mode-availability]")!;
  const dialog=root.querySelector<HTMLDialogElement>("[data-result-dialog]")!;
  const loadingDialog=root.querySelector<HTMLDialogElement>("[data-loading-dialog]")!;
  const loadingSeconds=root.querySelector<HTMLElement>("[data-loading-seconds]")!;
  const loadingSteps=[...root.querySelectorAll<HTMLElement>("[data-loading-step]")];
  const historyList=root.querySelector<HTMLOListElement>("[data-history-list]")!;
  const historyEmpty=root.querySelector<HTMLElement>("[data-history-empty]")!;
  const clearHistory=root.querySelector<HTMLButtonElement>("[data-clear-history]")!;
  const saveResult=root.querySelector<HTMLButtonElement>("[data-save-result]")!;
  const submit=form.querySelector<HTMLButtonElement>("button[type='submit']")!;
  const nativePicker=root.querySelector<HTMLFieldSetElement>("[data-native-picker]")!;
  const modelledPicker=root.querySelector<HTMLFieldSetElement>("[data-modelled-picker]")!;
  let turnstileToken="",widgetId:string|number|undefined,lastResult:FanoutResult|undefined,loadingTimer:number|undefined;
  const locale=root.dataset.locale==="de"?"de":"en";
  const ui=locale==="de"?{save:"Auf diesem Gerät speichern",saved:"Gespeichert",open:"Öffnen",remove:"Löschen",empty:"Noch keine Ergebnisse gespeichert.",historyError:"Die lokale Historie ist in diesem Browser nicht verfügbar.",saveError:"Das Ergebnis konnte nicht lokal gespeichert werden."}:{save:"Save on this device",saved:"Saved",open:"Open",remove:"Delete",empty:"No saved results yet.",historyError:"Local history is not available in this browser.",saveError:"The result could not be saved locally."};
  const mode=()=>String(new FormData(form).get("mode")??"native");
  const modeEnabled=(value:string)=>value==="native"?root.dataset.nativeEnabled==="true":root.dataset.modelledEnabled==="true";
  const updateCount=()=>count.textContent=`${[...keyword.value.normalize("NFC")].length} / 60`;
  const updateMode=()=>{
    const native=mode()==="native";
    nativePicker.hidden=!native;modelledPicker.hidden=native;
    nativePicker.querySelectorAll<HTMLInputElement>("input").forEach(input=>input.disabled=!native);
    modelledPicker.querySelectorAll<HTMLInputElement>("input").forEach(input=>input.disabled=native);
    availability.hidden=modeEnabled(mode());submit.disabled=!modeEnabled(mode());
  };
  keyword.addEventListener("input",updateCount);updateCount();
  form.querySelectorAll<HTMLInputElement>("input[name='mode']").forEach(input=>input.addEventListener("change",updateMode));updateMode();

  const mountTurnstile=()=>{
    const turnstile=(window as any).turnstile;if(!turnstile)return;
    widgetId=turnstile.render(root.querySelector("[data-turnstile-slot]")!,{sitekey:root.dataset.siteKey,action:"fanout",theme:"dark",callback:(token:string)=>turnstileToken=token,"expired-callback":()=>turnstileToken="","error-callback":()=>turnstileToken=""});
  };
  if(root.dataset.enabled==="true"&&root.dataset.siteKey){
    if((window as any).turnstile)mountTurnstile();
    else{const existing=document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]');if(existing)existing.addEventListener("load",mountTurnstile,{once:true});else{const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.addEventListener("load",mountTurnstile,{once:true});document.head.append(script)}}
  }

  const setLoadingStep=(active:number)=>loadingSteps.forEach((step,index)=>{step.classList.toggle("is-done",index<active);step.classList.toggle("is-active",index===active)});
  const startLoading=()=>{let elapsed=0;loadingSeconds.textContent="0";setLoadingStep(1);loadingDialog.showModal();loadingTimer=window.setInterval(()=>{elapsed++;loadingSeconds.textContent=String(elapsed)},1000)};
  const stopLoading=()=>{if(loadingTimer!==undefined)window.clearInterval(loadingTimer);loadingTimer=undefined;if(loadingDialog.open)loadingDialog.close()};
  loadingDialog.addEventListener("cancel",event=>event.preventDefault());

  form.addEventListener("submit",async(event)=>{
    event.preventDefault();status.textContent="";const selectedMode=mode();
    if(!modeEnabled(selectedMode)){availability.hidden=false;return}
    if(!turnstileToken){status.textContent=locale==="de"?"Bitte warte kurz auf die Sicherheitsprüfung.":"Please wait for the security check.";return}
    submit.disabled=true;submit.firstChild!.textContent=root.dataset.loadingLabel??"Loading …";startLoading();
    try{
      const data=new FormData(form);
      const common={keyword:keyword.value,country:String(data.get("country")??""),language:String(data.get("language")??"en"),turnstileToken};
      const request=selectedMode==="native"?{...common,provider:String(data.get("provider")??"")}:{...common,model:String(data.get("model")??"")};
      const response=await fetch(selectedMode==="native"?"/api/native-fanout":"/api/fanout-plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(request)});
      const payload=await response.json();if(!response.ok)throw new Error(payload?.error?.message||"The fanout could not be generated.");
      setLoadingStep(3);lastResult=payload.data;render(lastResult!);await new Promise(resolve=>window.setTimeout(resolve,180));stopLoading();dialog.showModal();
    }catch(error){stopLoading();status.textContent=error instanceof Error?error.message:"The fanout could not be generated."}
    finally{submit.disabled=!modeEnabled(mode());submit.firstChild!.textContent=root.dataset.submitLabel??"Show search queries";turnstileToken="";const turnstile=(window as any).turnstile;if(turnstile&&widgetId!==undefined)turnstile.reset(widgetId)}
  });

  root.querySelector("[data-dialog-close]")?.addEventListener("click",()=>dialog.close());
  root.querySelector("[data-new-keyword]")?.addEventListener("click",()=>{dialog.close();keyword.focus();keyword.select()});
  dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
  root.querySelector("[data-copy-results]")?.addEventListener("click",async event=>{if(!lastResult)return;const button=event.currentTarget as HTMLButtonElement;await navigator.clipboard.writeText(lastResult.queries.map((item,index)=>`${index+1}. ${typeof item==="string"?item:item.query}`).join("\n"));const original=button.textContent;button.textContent=root.dataset.copiedLabel??"Copied";setTimeout(()=>button.textContent=original,1600)});
  saveResult.addEventListener("click",async()=>{if(!lastResult)return;try{await saveRun(lastResult);saveResult.textContent=ui.saved;saveResult.disabled=true;await refreshHistory()}catch{status.textContent=ui.saveError}});
  root.querySelector("[data-download-json]")?.addEventListener("click",()=>lastResult&&download(`${fileStem(lastResult)}.json`,JSON.stringify(lastResult,null,2),"application/json"));
  root.querySelector("[data-download-csv]")?.addEventListener("click",()=>lastResult&&download(`${fileStem(lastResult)}.csv`,toCsv(lastResult),"text/csv;charset=utf-8"));
  clearHistory.addEventListener("click",async()=>{await clearSavedRuns();await refreshHistory()});
  refreshHistory();

  async function refreshHistory(){
    try{renderHistory(await loadSavedRuns())}catch{historyList.replaceChildren();historyEmpty.textContent=ui.historyError;historyEmpty.hidden=false;clearHistory.hidden=true}
  }
  function renderHistory(entries:any[]){
    historyList.replaceChildren();historyEmpty.textContent=ui.empty;historyEmpty.hidden=entries.length>0;clearHistory.hidden=entries.length===0;
    for(const entry of entries){const li=document.createElement("li"),details=document.createElement("div"),title=document.createElement("strong"),meta=document.createElement("small"),actions=document.createElement("div"),open=document.createElement("button"),remove=document.createElement("button");title.textContent=entry.result.keyword;meta.textContent=`${modelLabel(entry.result.modelId)} · ${entry.result.queries.length} · ${new Date(entry.savedAt).toLocaleDateString(locale)}`;open.type="button";open.textContent=ui.open;remove.type="button";remove.textContent=ui.remove;open.addEventListener("click",()=>{lastResult=entry.result;render(lastResult!,true);dialog.showModal()});remove.addEventListener("click",async()=>{await deleteSavedRun(entry.id);await refreshHistory()});details.append(title,meta);actions.append(open,remove);li.append(details,actions);historyList.append(li)}
  }

  function render(result:FanoutResult,saved=false){
    const native=result.evidenceStatus==="provider_exposed_native_search";
    root.querySelector<HTMLElement>("[data-result-keyword]")!.textContent=result.keyword;
    root.querySelector<HTMLElement>("[data-result-count]")!.textContent=String(result.queries.length);
    root.querySelector<HTMLElement>("[data-result-model]")!.textContent=native?`${modelLabel(result.modelId)} via ${result.providerId==="gemini"?"Gemini API":"OpenAI API"}`:`${modelLabel(result.modelId)} via OpenRouter`;
    root.querySelector<HTMLElement>("[data-result-evidence]")!.textContent=native?(locale==="de"?"Vom Anbieter offengelegte API-Suchaktionen":"Provider-exposed API search actions"):(locale==="de"?"Modellierte Suchideen ohne Websuche":"Modelled search ideas without web search");
    const market=result.country?(countryNames[result.country]??result.country):(locale==="de"?"Alle Länder":"All countries");
    root.querySelector<HTMLElement>("[data-result-locale]")!.textContent=`${market} · ${result.language==="de"?"Deutsch":"English"}`;
    root.querySelector<HTMLElement>("[data-result-date]")!.textContent=new Date(result.generatedAt).toLocaleString(result.language);
    root.querySelector<HTMLElement>("[data-result-notice]")!.textContent=result.notice;
    saveResult.textContent=saved?ui.saved:ui.save;saveResult.disabled=saved;
    const queries=root.querySelector<HTMLOListElement>("[data-result-queries]")!;queries.replaceChildren();
    if(result.queries.length===0){const li=document.createElement("li"),title=document.createElement("strong");title.textContent=locale==="de"?"In diesem Lauf hat die API keine Query-Strings offengelegt.":"The API exposed no query strings in this run.";li.append(title);queries.append(li)}
    result.queries.forEach((item,index)=>{const li=document.createElement("li"),number=document.createElement("span"),title=document.createElement("strong");number.textContent=String(index+1).padStart(2,"0");title.textContent=typeof item==="string"?item:item.query;li.append(number,title);if(typeof item!=="string"){const meta=document.createElement("div"),intent=document.createElement("span"),reason=document.createElement("p");intent.textContent=`${locale==="de"?"Intent":"Intent"}: ${intentLabel(item.intent)}`;reason.textContent=`${locale==="de"?"Warum":"Why"}: ${item.reason}`;meta.append(intent,reason);li.append(meta)}queries.append(li)});
    const sourceSection=root.querySelector<HTMLElement>("[data-result-sources-section]")!,sources=root.querySelector<HTMLUListElement>("[data-result-sources]")!;sources.replaceChildren();sourceSection.hidden=!result.sources?.length;
    for(const source of result.sources??[]){let parsed:URL;try{parsed=new URL(source.url)}catch{continue}if(!["http:","https:"].includes(parsed.protocol))continue;const li=document.createElement("li"),link=document.createElement("a");link.href=parsed.href;link.target="_blank";link.rel="noopener noreferrer";link.textContent=source.title||parsed.hostname;li.append(link);sources.append(li)}
  }
  function fileStem(result:FanoutResult){return `ai-fanout-${result.keyword.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40)||"result"}`}
  function download(name:string,content:string,type:string){const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement("a");link.href=url;link.download=name;link.hidden=true;document.body.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function toCsv(result:FanoutResult){const rows=[["type","index","query","intent","reason","url","title"],...result.queries.map((item,index)=>["query",String(index+1),typeof item==="string"?item:item.query,typeof item==="string"?"":item.intent,typeof item==="string"?"":item.reason,"",""]),...(result.sources??[]).map(source=>["source","","","","",source.url,source.title])];return rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\n")}
  function modelLabel(id:string){return id.includes("gpt-5.6-luna")?"GPT-5.6 Luna":id.includes("gemini-3.7-flash")?"Gemini 3.7 Flash":id}
  function intentLabel(intent:string){const labels:Record<string,Record<string,string>>={de:{informational:"Information",comparison:"Vergleich",commercial:"Kommerziell",transactional:"Transaktion",local:"Lokal",troubleshooting:"Problemlösung"},en:{informational:"Informational",comparison:"Comparison",commercial:"Commercial",transactional:"Transactional",local:"Local",troubleshooting:"Troubleshooting"}};return labels[locale]?.[intent]??intent}
}
