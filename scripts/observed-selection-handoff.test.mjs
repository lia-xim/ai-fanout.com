import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {observedSelectionHandoff} from '../src/lib/observed-selection-handoff.mjs';
import {buildSeoResearchUrl} from '../src/lib/seo-handoff.mjs';
const corpus=JSON.parse(await readFile(new URL('../public/examples/openai-observations-2026-08-27.json',import.meta.url),'utf8'));
const id='seo-tools-comparison-sources';
const when='2026-10-10T12:30:00.000Z';
test('selected pricing strings retain original order, exact content and provenance',()=>{
 const payload=observedSelectionHandoff(corpus,id,[2,1,2],when);
 assert.deepEqual(payload.run.queries.map(q=>q.text),['Ahrefs pricing official','Semrush pricing official']);
 assert.equal(payload.run.language,'en');
 assert.equal(payload.run.market,'US · en');
 assert.equal(payload.run.displayedRunTime,'2026-08-27T13:13:59.201Z');
 assert.equal(payload.transferredAt,when);
 assert.match(payload.run.evidenceLabel,/Selected 2 of 4 exposed strings · completed/);
 assert.equal(payload.run.evidenceState,'provider_exposed_native_search');
});
test('original domain-only evidence never becomes a selected-query source join or invented URL',()=>{
 const original=corpus.observations.find(o=>o.id===id);
 const payload=observedSelectionHandoff(corpus,id,[1,2],when);
 assert.deepEqual(payload.run.sourceDomains,original.sourceDomains);
 assert.equal(payload.run.sourceDomains.length,13);
 assert.deepEqual(payload.run.runSources,[]);
 for(const q of payload.run.queries){assert.deepEqual(q.sources,[]);assert.match(q.sourceRelation,/no query-to-source mapping/);}
 payload.run.sourceDomains.pop();
 assert.equal(original.sourceDomains.length,13);
});
test('selection rejects absent records, empty input and invalid indexes',()=>{
 assert.throws(()=>observedSelectionHandoff(corpus,'missing',[0],when),/UNKNOWN_PUBLIC_OBSERVATION/);
 assert.throws(()=>observedSelectionHandoff(corpus,id,[],when),/EMPTY_HANDOFF_SELECTION/);
 for(const bad of [-1,4,0.5,NaN,'1'])assert.throws(()=>observedSelectionHandoff(corpus,id,[bad],when),/INVALID_HANDOFF_INDEX/);
});
test('versioned fragment-only transfer preserves the entire selection without query parameters',()=>{
 const payload=observedSelectionHandoff(corpus,id,[1,2],when);
 const url=new URL(buildSeoResearchUrl(payload));
 assert.equal(url.origin,'https://seo-fanout.com');assert.equal(url.search,'');
 const encoded=new URLSearchParams(url.hash.slice(1)).get('research');
 assert.deepEqual(JSON.parse(Buffer.from(encoded,'base64url').toString('utf8')),payload);
 assert.equal(payload.schemaVersion,'ai-fanout.seo-research-handoff/1.0');
});
