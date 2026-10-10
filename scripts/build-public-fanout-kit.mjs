import { readFile, writeFile, mkdir } from "node:fs/promises";
import { selectedQueryExport } from "../src/scripts/fanout-selection.mjs";
import { compareFanoutRuns } from "../src/scripts/fanout-comparison.mjs";
import { prepareResultForLocalStorage } from "../src/scripts/fanout-history.mjs";
import { NATIVE_TOOL_VERSION, NATIVE_METHOD_VERSION } from "../src/server/fanout/native-contracts.mjs";
import { TOOL_VERSION, METHOD_VERSION } from "../src/server/fanout/contracts.mjs";

// A dated reference for the actual site exports, not a new runtime schemaVersion.
const string={type:"string"},integer={type:"integer",minimum:0};
const date={type:"string",pattern:"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$"};
const nullable={type:["string","null"]};
const arr=items=>({type:"array",items});
const obj=(properties,required=Object.keys(properties))=>({type:"object",additionalProperties:false,properties,required});
const ref=name=>({$ref:`#/$defs/${name}`});
const base={keyword:string,language:{enum:["en","de"]},country:nullable,providerId:string,modelId:string,generatedAt:date,evidenceStatus:{enum:["provider_exposed_native_search","modelled_fanout"]}};
const quota=obj({limit:integer,used:integer,remaining:integer,resetAt:date});
const source=obj({url:{type:"string",pattern:"^https?://"},title:string});
const action=obj({id:string,queries:arr(string),sources:arr(source),sourceScope:{enum:["exact_query","search_action","not_exposed","not_stored"]}});
const usage=obj({inputTokens:integer,outputTokens:integer,searchActionCount:integer,searchQueryCount:integer,estimatedCostUsd:{type:"number",minimum:0},estimatedCostUsdMaximum:{type:"number",minimum:0},estimateKind:{enum:["list_price_estimate","list_price_range","provider_reported_cost"]},pricingCheckedAt:{type:"string",pattern:"^\\d{4}-\\d{2}-\\d{2}$"},pricingBasis:string},["inputTokens","outputTokens","searchActionCount","searchQueryCount","estimatedCostUsd","estimateKind","pricingCheckedAt","pricingBasis"]);
const nativeProperties={...base,providerId:{enum:["openai","gemini","anthropic"]},evidenceStatus:{const:"provider_exposed_native_search"},queries:{...arr({type:"string",minLength:2,maxLength:240}),maxItems:8},sources:arr(source),searchActions:arr(action),searchActionCount:integer,providerResponseStatus:string,sourceEvidenceScope:{enum:["search_action_when_exposed","run_level_only","not_stored_google_grounded_results"]},usage,toolVersion:{enum:["native-fanout-tool/1.0.0",NATIVE_TOOL_VERSION]},methodVersion:{enum:["provider-native-search/1.0",NATIVE_METHOD_VERSION]},notice:string,quota,storageNotice:string};
const native=obj(nativeProperties,Object.keys(nativeProperties).filter(k=>k!=="storageNotice"));
const intent={enum:["informational","comparison","commercial","transactional","local","troubleshooting"]};
const modelled=obj({...base,evidenceStatus:{const:"modelled_fanout"},queries:{...arr(obj({query:{type:"string",minLength:2,maxLength:160},intent,reason:{type:"string",minLength:4,maxLength:180}})),minItems:10,maxItems:10},toolVersion:{enum:["modelled-fanout-tool/2.0.0",TOOL_VERSION]},methodVersion:{enum:["openrouter-structured-fanout/2.0",METHOD_VERSION]},notice:string,quota});
const analysis=obj({evidenceState:{const:"observed_summary"},methodVersion:{const:"observed-summary/1.0"},observedQueryCount:integer,distinctSourceDomainCount:integer,sourceDomains:arr(string)});
const savedExtension={id:string,savedAt:{type:"number",minimum:0},analysis};
const savedNative=obj({...nativeProperties,...savedExtension},[...native.required,...Object.keys(savedExtension)]);
const savedModelled=obj({...modelled.properties,...savedExtension});
const selection=obj({schemaVersion:{const:"ai-fanout.query-selection/1.0"},exportedAt:date,run:obj(base),selectedQueryCount:integer,queries:arr(obj({index:{type:"integer",minimum:1},query:string,intent:{anyOf:[intent,{type:"null"}]},reason:nullable})),notice:string});
const comparison=obj({schemaVersion:{const:"ai-fanout.local-comparison/1.0"},createdAt:date,runCount:integer,comparisonType:{enum:["provider","date","mixed"]},runs:arr({oneOf:[ref("savedNative"),ref("savedModelled")]}),sharedQueries:arr(string),sharedSourceDomains:arr(string),notice:string});
const schema={
  $schema:"https://json-schema.org/draft/2020-12/schema",
  $id:"https://ai-fanout.com/contracts/fanout-public-contracts.schema.v2.json",
  title:"ai-fanout.com public export reference, checked 10 October 2026",
  description:"Four current export families. Native/modelled runs have toolVersion/methodVersion, without root schemaVersion. This reference does not validate raw provider responses, legacy planner exports or SEO handoff payloads. Cross-field checks are in validate.mjs; acceptance is not provider provenance or factual truth.",
  oneOf:[ref("nativeRun"),ref("modelledRun"),ref("querySelection"),ref("localComparison")],
  $defs:{nativeRun:native,modelledRun:modelled,querySelection:selection,localComparison:comparison,savedNative,savedModelled}
};
const root=new URL("../",import.meta.url),kit=new URL("public/code/fanout-kit/v2/",root);
await mkdir(kit,{recursive:true});
const json=value=>JSON.stringify(value,null,2)+"\n";
await writeFile(new URL("public/contracts/fanout-public-contracts.schema.v2.json",root),json(schema));
await writeFile(new URL("contracts.schema.json",kit),json(schema));
const generatedAt="2026-10-10T00:00:00.000Z";
const common={keyword:"synthetic example",language:"en",country:"US",modelId:"synthetic-model/no-provider-call",generatedAt,notice:"Entirely synthetic contract exercise; no provider request, search volume, observed citation or measured cost.",quota:{limit:20,used:1,remaining:19,resetAt:"2026-10-11T00:00:00.000Z"}};
const nativeRun={...common,providerId:"openai",queries:["example topic","example cost"],sources:[{url:"https://example.com/guide",title:"Fictional source"}],searchActions:[{id:"synthetic-search",queries:["example topic","example cost"],sources:[{url:"https://example.com/guide",title:"Fictional source"}],sourceScope:"search_action"}],searchActionCount:1,providerResponseStatus:"completed",evidenceStatus:"provider_exposed_native_search",sourceEvidenceScope:"search_action_when_exposed",toolVersion:NATIVE_TOOL_VERSION,methodVersion:NATIVE_METHOD_VERSION,usage:{inputTokens:0,outputTokens:0,searchActionCount:1,searchQueryCount:2,estimatedCostUsd:0,estimateKind:"list_price_estimate",pricingCheckedAt:"2026-10-10",pricingBasis:"Synthetic zero placeholders; not provider billing or a current price."}};
const modelledRun={...common,providerId:"openrouter",evidenceStatus:"modelled_fanout",queries:Array.from({length:10},(_,i)=>({query:`example research question ${i+1}`,intent:"informational",reason:"Synthetic editorial exercise only."})),toolVersion:TOOL_VERSION,methodVersion:METHOD_VERSION};
const querySelection=selectedQueryExport(nativeRun,new Set([1]));querySelection.exportedAt=generatedAt;
const savedGemini=prepareResultForLocalStorage({...nativeRun,providerId:"gemini",sourceEvidenceScope:"run_level_only"});
const localComparison=compareFanoutRuns([{id:"synthetic-openai",savedAt:Date.parse(generatedAt),result:nativeRun},{id:"synthetic-gemini",savedAt:Date.parse(generatedAt),result:savedGemini}]);localComparison.createdAt=generatedAt;
await writeFile(new URL("exports.synthetic.json",kit),json({nativeRun,modelledRun,querySelection,localComparison}));
await writeFile(new URL("package.json",kit),json({name:"ai-fanout-offline-teaching-kit",version:"2.0.0",private:true,type:"module",engines:{node:"24.x"},scripts:{test:"node --test parser.test.mjs contract.test.mjs",validate:"node validate.mjs exports.synthetic.json"},dependencies:{ajv:"8.20.0"}}));

// Deterministic ZIP, stored entries, fixed date. Explicit files exclude node_modules.
const names=["README.md","package.json","package-lock.json","parsers.mjs","fixtures.mjs","parser.test.mjs","validate.mjs","contract.test.mjs","contracts.schema.json","exports.synthetic.json"];
const crc32=bytes=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let n=0;n<8;n++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
const parts=[],directory=[];let offset=0;
for(const name of names){
  const data=await readFile(new URL(name,kit)),file=Buffer.from(`fanout-kit-v2/${name}`),crc=crc32(data),local=Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x5d4a,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(data.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(file.length,26);
  parts.push(local,file,data);
  const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(0x5d4a,14);central.writeUInt32LE(crc,16);central.writeUInt32LE(data.length,20);central.writeUInt32LE(data.length,24);central.writeUInt16LE(file.length,28);central.writeUInt32LE(offset,42);directory.push(central,file);offset+=local.length+file.length+data.length;
}
const central=Buffer.concat(directory),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(names.length,8);end.writeUInt16LE(names.length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);
await writeFile(new URL("public/code/fanout-kit-v2.zip",root),Buffer.concat([...parts,central,end]));
console.log(`Built four synthetic exports, a current reference schema and ${names.length}-file offline kit.`);
