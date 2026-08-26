type FanoutQuery={query:string;intent:string;reason:string};
type FanoutResult={keyword:string;language:"en"|"de";country:string|null;queries:FanoutQuery[];modelId:string;providerId:string;generatedAt:string;evidenceStatus:string;notice:string};

const countryNames:Record<string,string>={DE:"Germany",US:"United States",GB:"United Kingdom",AT:"Austria",CH:"Switzerland",FR:"France",ES:"Spain",IT:"Italy",NL:"Netherlands"};

for(const root of document.querySelectorAll<HTMLElement>("[data-fanout-planner]")){
  const form=root.querySelector<HTMLFormElement>("[data-planner-form]")!;
  const keyword=root.querySelector<HTMLInputElement>("input[name='keyword']")!;
  const count=root.querySelector<HTMLOutputElement>("[data-keyword-count]")!;
  const status=root.querySelector<HTMLElement>("[data-form-status]")!;
  const dialog=root.querySelector<HTMLDialogElement>("[data-result-dialog]")!;
  const submit=form.querySelector<HTMLButtonElement>("button[type='submit']")!;
  let turnstileToken="",widgetId:string|number|undefined,lastResult:FanoutResult|undefined;
  const locale=root.dataset.locale==="de"?"de":"en";
  const update=()=>count.textContent=`${[...keyword.value.normalize("NFC")].length} / 100`;
  keyword.addEventListener("input",update);update();

  const mountTurnstile=()=>{
    const turnstile=(window as any).turnstile;
    if(!turnstile)return;
    widgetId=turnstile.render(root.querySelector("[data-turnstile-slot]")!,{sitekey:root.dataset.siteKey,action:"fanout",theme:"dark",callback:(token:string)=>turnstileToken=token,"expired-callback":()=>turnstileToken="","error-callback":()=>turnstileToken=""});
  };
  if(root.dataset.enabled==="true"&&root.dataset.siteKey){
    if((window as any).turnstile)mountTurnstile();
    else{const existing=document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]');if(existing)existing.addEventListener("load",mountTurnstile,{once:true});else{const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.addEventListener("load",mountTurnstile,{once:true});document.head.append(script)}}
  }

  form.addEventListener("submit",async(event)=>{
    event.preventDefault();status.textContent="";
    if(!turnstileToken){status.textContent=locale==="de"?"Bitte warte kurz auf die Sicherheitsprüfung.":"Please wait for the security check.";return}
    submit.disabled=true;submit.firstChild!.textContent=root.dataset.loadingLabel??"Loading …";
    try{
      const data=new FormData(form);
      const response=await fetch("/api/fanout-plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keyword:keyword.value,model:String(data.get("model")??""),country:String(data.get("country")??""),language:String(data.get("language")??"en"),turnstileToken})});
      const payload=await response.json();if(!response.ok)throw new Error(payload?.error?.message||"The fanout could not be generated.");
      lastResult=payload.data;render(lastResult!);dialog.showModal();
    }catch(error){status.textContent=error instanceof Error?error.message:"The fanout could not be generated."}
    finally{submit.disabled=false;submit.firstChild!.textContent=root.dataset.submitLabel??"Build fanout";turnstileToken="";const turnstile=(window as any).turnstile;if(turnstile&&widgetId!==undefined)turnstile.reset(widgetId)}
  });

  root.querySelector("[data-dialog-close]")?.addEventListener("click",()=>dialog.close());
  root.querySelector("[data-new-keyword]")?.addEventListener("click",()=>{dialog.close();keyword.focus();keyword.select()});
  dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
  root.querySelector("[data-copy-results]")?.addEventListener("click",async event=>{if(!lastResult)return;const button=event.currentTarget as HTMLButtonElement;await navigator.clipboard.writeText(lastResult.queries.map((item,index)=>`${index+1}. ${item.query}`).join("\n"));const original=button.textContent;button.textContent=root.dataset.copiedLabel??"Copied";setTimeout(()=>button.textContent=original,1600)});

  function render(result:FanoutResult){
    root.querySelector<HTMLElement>("[data-result-keyword]")!.textContent=result.keyword;
    root.querySelector<HTMLElement>("[data-result-count]")!.textContent=String(result.queries.length);
    root.querySelector<HTMLElement>("[data-result-model]")!.textContent=`${modelLabel(result.modelId)} via OpenRouter`;
    const market=result.country?(countryNames[result.country]??result.country):(locale==="de"?"Alle Länder":"All countries");
    root.querySelector<HTMLElement>("[data-result-locale]")!.textContent=`${market} · ${result.language==="de"?"Deutsch":"English"}`;
    root.querySelector<HTMLElement>("[data-result-date]")!.textContent=new Date(result.generatedAt).toLocaleString(result.language);
    root.querySelector<HTMLElement>("[data-result-notice]")!.textContent=result.notice;
    const queries=root.querySelector<HTMLOListElement>("[data-result-queries]")!;queries.replaceChildren();
    result.queries.forEach((item,index)=>{const li=document.createElement("li"),number=document.createElement("span"),title=document.createElement("strong"),meta=document.createElement("div"),intent=document.createElement("span"),reason=document.createElement("p");number.textContent=String(index+1).padStart(2,"0");title.textContent=item.query;intent.textContent=`${locale==="de"?"Intent":"Intent"}: ${intentLabel(item.intent)}`;reason.textContent=`${locale==="de"?"Warum":"Why"}: ${item.reason}`;meta.append(intent,reason);li.append(number,title,meta);queries.append(li)});
  }
  function modelLabel(id:string){return id.includes("gpt-5.6-luna")?"GPT-5.6 Luna":id.includes("deepseek-v4-flash")?"DeepSeek V4 Flash":id.includes("gemini-3.7-flash")?"Gemini 3.7 Flash":id}
  function intentLabel(intent:string){const labels:Record<string,Record<string,string>>={de:{informational:"Information",comparison:"Vergleich",commercial:"Kommerziell",transactional:"Transaktion",local:"Lokal",troubleshooting:"Problemlösung"},en:{informational:"Informational",comparison:"Comparison",commercial:"Commercial",transactional:"Transactional",local:"Local",troubleshooting:"Troubleshooting"}};return labels[locale]?.[intent]??intent}
}
