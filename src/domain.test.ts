import {describe,it,expect} from 'vitest'
import {fresh,calculation,errors,snapshot,record,revise,withdraw,parse,exportBrief} from './domain'
import {load,save,reset,type Store} from './storage'
function memory(raw:string|null=null):Store{return {getItem:()=>raw,setItem:(_,value)=>{raw=value}}}
describe('finite options and reviewed decisions',()=>{
 it('independently computes shared 14-6-8=0 and bridge 14-6-2=6',()=>{expect(calculation(fresh().draft)).toEqual({budget:8,used:8,remaining:0,feasible:true});expect(calculation({...fresh().draft,option:'bridge'}).remaining).toBe(6)})
 it('rejects custom 14 days against 8-day budget',()=>{const s=fresh();s.draft.option='custom';expect(calculation(s.draft).remaining).toBe(-6);expect(()=>snapshot(s)).toThrow()})
 it('capacity 10 blocks shared, bridge is feasible recovery',()=>{const s=fresh();s.draft.capacity=10;expect(calculation(s.draft).feasible).toBe(false);s.draft.option='bridge';expect(snapshot(s).remaining).toBe(2)})
 it('validates finite capacity and calendar inputs',()=>{for(const capacity of [NaN,5,31,8.5])expect(errors({...fresh().draft,capacity}).length).toBeGreaterThan(0);expect(errors({...fresh().draft,reviewDate:'2026-11-31'}).length).toBeGreaterThan(0)})
 it('keeps reviewed option and evidence immutable after a revision',()=>{let s=record(fresh(),snapshot(fresh()));s=revise(s,{...s.draft,option:'bridge'});const e=s.history[0];if(e.kind==='review'){expect(e.snapshot.option.id).toBe('shared');expect(e.snapshot.evidence.map(e=>e.id)).toEqual(['O1','O2','A1'])}})
 it('rejects a stale scope preview',()=>{const s=fresh(),p=snapshot(s);expect(()=>record(revise(s,{...s.draft,owner:'Other owner'}),p)).toThrow()})
 it('withdraws with preserved snapshot and prevents double withdrawal',()=>{const s=record(fresh(),snapshot(fresh()));const w=withdraw(s,1);expect(w.history).toHaveLength(2);expect(()=>withdraw(w,1)).toThrow();expect(parse(JSON.stringify(w))).not.toBeNull()})
 it('roundtrips every package at sufficient capacity',()=>{for(const option of ['shared','bridge','custom'] as const){const s=fresh();s.draft={...s.draft,option,capacity:24};expect(parse(JSON.stringify(record(s,snapshot(s))))).not.toBeNull()}})
 it('rejects corrupted schema, references, snapshot and history',()=>{const s=record(fresh(),snapshot(fresh()));for(const change of [(x:Record<string,unknown>)=>x.schema=2,(x:Record<string,unknown>)=>x.extra=1,(x:Record<string,unknown>)=>x.revision=0]){const x=JSON.parse(JSON.stringify(s));change(x);expect(parse(JSON.stringify(x))).toBeNull()}const x=JSON.parse(JSON.stringify(s));x.history[0].snapshot.option.days=1;expect(parse(JSON.stringify(x))).toBeNull();x.history[0].snapshot.option.days=8;x.history.push(x.history[0]);expect(parse(JSON.stringify(x))).toBeNull()})
 it('exports the entire reviewed scope and fictional disclaimer',()=>{const e=JSON.parse(exportBrief(snapshot(fresh())));expect(e.exclusions).toContain('No custom dashboard');expect(e.title).toContain('not a delivery promise');expect(e.evidence).toHaveLength(3)})
})
describe('raw content and readability guard',()=>{
 it('loads compatible state and preserves invalid bytes',()=>{expect(load(memory(JSON.stringify(fresh()))).invalid).toBe(false);const store=memory('{bad');const l=load(store);expect(l.invalid).toBe(true);expect(()=>save(store,l.token,fresh())).toThrow();expect(store.getItem('')).toBe('{bad')})
 it('rejects changed raw bytes even at the same revision',()=>{const store=memory(JSON.stringify(fresh())),l=load(store);store.setItem('',JSON.stringify({...fresh(),draft:{...fresh().draft,owner:'Other'}}));expect(()=>save(store,l.token,fresh())).toThrow()})
 it('never writes unseen bytes with blocked read and working write',()=>{let writes=0;const store={getItem:()=>{throw Error()},setItem:()=>{writes++}};const l=load(store);expect(save(store,l.token,fresh()).saved).toBe(false);expect(reset(store,l.token).saved).toBe(false);expect(writes).toBe(0)})
 it('reset binds exact invalid content and rejects changes',()=>{const store=memory('broken'),l=load(store);store.setItem('','new');expect(()=>reset(store,l.token)).toThrow();expect(store.getItem('')).toBe('new')})
 it('reset rejects new readability during review',()=>{let readable=false;const store={getItem:()=>{if(!readable)throw Error();return 'unseen'},setItem:()=>{throw Error('must not write')}};const l=load(store);readable=true;expect(()=>reset(store,l.token)).toThrow()})
 it('write failure keeps usable in-memory decision',()=>{const store={getItem:()=>null,setItem:()=>{throw Error()}};expect(save(store,load(store).token,record(fresh(),snapshot(fresh()))).saved).toBe(false)})
})
