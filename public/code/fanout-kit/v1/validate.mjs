import Ajv2020 from "ajv/dist/2020.js";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const schema=JSON.parse(await readFile(new URL("./contracts.schema.json",import.meta.url),"utf8"));
const ajv=new Ajv2020({allErrors:true,strict:true});
const shape=ajv.compile(schema);
const duplicate=values=>new Set(values).size!==values.length;

// JSON Schema checks shape. These checks add the cross-field invariants that the
// actual export producers promise. Neither check authenticates provider origin.
export function validateExport(value) {
  if(!shape(value)) return {valid:false,errors:structuredClone(shape.errors)};
  const errors=[];
  const check=(ok,message)=>{if(!ok)errors.push({message});};
  function checkNative(run){
    check(run.searchActionCount>=run.searchActions.length,"searchActionCount cannot be smaller than retained searchActions");
    if(run.sourceEvidenceScope==="not_stored_google_grounded_results"){
      check(run.providerId==="gemini"&&run.sources.length===0&&run.searchActions.every(a=>a.sources.length===0&&a.sourceScope==="not_stored"),"saved Gemini payload must remove grounded sources");
      check(typeof run.storageNotice==="string","saved Gemini payload needs storageNotice");
    }
    for(const action of run.searchActions){
      check(action.sourceScope!=="exact_query"||(action.queries.length===1&&action.sources.length>0),"exact_query requires one exposed query and an action source");
      check(action.sourceScope!=="search_action"||(action.queries.length>1&&action.sources.length>0),"search_action requires multiple exposed queries and an action source");
    }
    for(const source of [...run.sources,...run.searchActions.flatMap(a=>a.sources)]){
      try{const url=new URL(source.url);check(["http:","https:"].includes(url.protocol)&&!url.username&&!url.password,"source URL must be HTTP(S) without credentials");}catch{check(false,"source URL must be valid");}
    }
  }
  if(value.evidenceStatus==="provider_exposed_native_search")checkNative(value);
  if(value.schemaVersion==="ai-fanout.query-selection/1.0"){
    check(value.selectedQueryCount===value.queries.length,"selectedQueryCount must match queries.length");
    check(!duplicate(value.queries.map(q=>q.index)),"selected query indexes must be unique");
  }
  if(value.schemaVersion==="ai-fanout.local-comparison/1.0"){
    check(value.runCount===value.runs.length,"runCount must match runs.length");
    check(!duplicate(value.runs.map(r=>r.id)),"comparison run IDs must be unique");
    for(const run of value.runs){
      if(run.evidenceStatus==="provider_exposed_native_search")checkNative(run);
      check(run.analysis.observedQueryCount===run.queries.length,"analysis count must match retained query strings");
      check(run.analysis.distinctSourceDomainCount===new Set(run.analysis.sourceDomains).size,"domain count must match distinct retained domains");
    }
  }
  return {valid:errors.length===0,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const input=JSON.parse(await readFile(process.argv[2]??new URL("exports.synthetic.json",import.meta.url),"utf8"));
  const items=input.nativeRun&&input.querySelection?Object.entries(input):[["input",input]];
  let failed=false;
  for(const [name,value]of items){const result=validateExport(value);console.log(`${name}: ${result.valid?"PASS":"FAIL"}`);if(!result.valid){failed=true;console.error(JSON.stringify(result.errors,null,2));}}
  if(failed)process.exitCode=1;
}
