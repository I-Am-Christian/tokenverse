import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function bootV14(html,startingSave=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,v14BellClock,v14Init,v14CanEnter,v14EnterRift,v14ResolveRift,v14RiftUpdate,v14TryExtract,v14AcquireSkin,v14EquipSkin,v14SkinCanOwn,v14SkinPalette,v14ConvoyOffers,v14AcceptConvoy,v14CheckDelivery,v14RegionalTrade,v14Price,v14StoryScan,v14StoryRepair,v14StoryContact,v14Showcase,renderUI,updateShip,draw,get dockedStation(){return dockedStation},get v14NpcConvoys(){return v14NpcConvoys}};})();`);
 const nop=()=>{};const elements=new Map();let seq=0;
 const graph=new Proxy({createRadialGradient(){return {addColorStop(){}}},createLinearGradient(){return {addColorStop(){}}}}, {get(o,k){return o[k]||nop},set(o,k,v){o[k]=v;return true}});
 function elem(id){if(!elements.has(id)){
  const set=new Set(),cls={add(k){set.add(k)},remove(k){set.delete(k)},contains(k){return set.has(k)},toggle(k,v){if(v===undefined?!set.has(k):v)set.add(k);else set.delete(k);return set.has(k)}};
  elements.set(id,{id,style:{},innerHTML:'',textContent:'',value:'',checked:false,disabled:false,children:[],classList:cls,
    addEventListener:nop,setAttribute:nop,getAttribute:()=>'',hasAttribute:()=>false,appendChild:nop,removeChild:nop,prepend:nop,click:nop,closest:()=>null,
    getBoundingClientRect:()=>({left:0,right:1500,top:0,bottom:1080,width:1920,height:1080}),getContext:()=>graph});
 }return elements.get(id)}
 const document={getElementById:elem,querySelectorAll:()=>[],createElement:()=>elem('div'+(++seq))};
 const storageMap=new Map(startingSave?Object.entries(startingSave):[]);
 const localStorage={getItem:(k)=>storageMap.get(k)||null,setItem:(k,v)=>storageMap.set(k,v),removeItem:(k)=>storageMap.delete(k)};
 const time={now:Date.parse('2026-11-18T00:00:05Z')};
 const OriginalDate=Date;
 class FakeDate extends OriginalDate {static now(){return time.now;}}
 const script=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified);
 const api=script(document,{devicePixelRatio:1,AudioContext:class {},webkitAudioContext:class {}},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2500},{randomUUID:()=>String(++seq)},()=>false,FakeDate);
 return {api,time,storageMap,elem,graph};
}

const read=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('v0.14 keeps existing ships, factions and 80% fullscreen game canvas',()=>{
 const html=read(),{api}=bootV14(html);
 assert.equal(Object.keys(api.SHIPS).length,40);
 assert.equal(Object.keys(api.GUNS).length,14);
 assert.equal(Object.keys(api.FACTIONS).length,4);
 assert.equal(Object.keys(api.SYSTEMS).length,6);
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
 assert.equal(api.S.saveVersion,20);
 assert.match(html, /id="v14BellButton"/);
 assert.match(html, /id="v14ShipPreview"/);
 assert.match(html, /data-section="logistics"/);
 assert.match(html, /data-section="archive"/);
 assert.match(html, /width:100vw;height:100dvh|width:100vw;height:100vh/);
});

test('twelve daily Bells have stable even UTC IDs and 12 minute windows',()=>{
 const {api}=bootV14(read());
 const date=s=>Date.parse(s);
 assert.equal(api.v14BellClock(date('2026-11-18T00:00:00Z')).phase,'open');
 assert.equal(api.v14BellClock(date('2026-11-18T00:08:59Z')).phase,'open');
 assert.equal(api.v14BellClock(date('2026-11-18T00:09:00Z')).phase,'collapsing');
 assert.equal(api.v14BellClock(date('2026-11-18T00:11:59Z')).phase,'collapsing');
 assert.equal(api.v14BellClock(date('2026-11-18T00:12:00Z')).phase,'closed');
 assert.equal(api.v14BellClock(date('2026-11-18T01:40:00Z')).phase,'muster');
 assert.equal(api.v14BellClock(date('2026-11-18T02:00:00Z')).phase,'open');
 assert.equal(api.v14BellClock(date('2026-11-18T23:59:59Z')).phase,'muster');
 assert.equal(api.v14BellClock(date('2026-11-19T00:00:00Z')).phase,'open');
 assert.notEqual(api.v14BellClock(date('2026-11-18T00:00:00Z')).id,api.v14BellClock(date('2026-11-18T02:00:00Z')).id);
});

test('Rift requires an active Bell and exact entry zone; ore and resolution persist once',()=>{
 const {api,time,storageMap}=bootV14(read());
 api.S.faction='solar';api.S.x=96000;api.S.y=53200;api.S.system='orion';api.S.vx=api.S.vy=0;
 assert.equal(api.v14CanEnter(),true);
 api.v14EnterRift();assert.equal(api.S.rift.inside,true);
 const key=api.S.rift.bellId;
 assert.equal(api.S.rift.deposits.length,18);
 const d=api.S.rift.deposits[0];
 api.S.x=d.x;api.S.y=d.y;api.S.vx=api.S.vy=0;
 const before=d.ore;
 api.v14RiftUpdate(4.5);
 assert.ok(d.ore<before,'deposit is depleting');
 assert.equal(api.S.rift.oreTaken,1);
 const snapshot=JSON.parse(storageMap.get('tokenverse-deep-space-v10'));
 assert.equal(snapshot.rift.deposits[0].ore,d.ore,'spent ore persisted in save');
 api.S.x=420;api.S.y=1380;api.S.vx=api.S.vy=0;
 const SC=api.S.credits;api.v14TryExtract();
 assert.equal(api.S.rift.inside,false);
 assert.equal(api.S.riftRuns.length,1);
 assert.ok(api.S.credits>SC);
 const after=api.S.credits;
 assert.equal(api.v14ResolveRift('extracted'),false);
 assert.equal(api.S.credits,after,'cannot double claim from repeated extraction');
 api.S.x=96000;api.S.y=53200;api.S.vx=api.S.vy=0;
 assert.equal(api.v14CanEnter(),false,'resolved Bell cannot be replayed for cargo');
 assert.equal(api.S.rift.deposits[0].ore,d.ore,'depleted deposit stays depleted');
 time.now=Date.parse('2026-11-18T00:12:01Z');
 api.v14RiftUpdate(.03);assert.equal(api.S.rift.inside,false,'expired Bell ejects safely');
 assert.equal(api.S.riftRuns.length,1,'no duplicate same Bell result');
});

test('cosmetic skins do not change ship statistics and can be owned only once',()=>{
 const {api}=bootV14(read());
 api.S.faction='solar';api.S.credits=3000;api.S.x=900;api.S.y=900;api.S.vx=api.S.vy=0;api.updateShip(.02);
 const orig=JSON.stringify(api.SHIPS[api.S.shipId]);
 assert.ok(api.dockedStation);
 api.v14AcquireSkin('solar');
 assert.equal(api.S.cosmetics.ownedSkinIds.length,1);
 api.v14AcquireSkin('solar');
 assert.equal(api.S.cosmetics.ownedSkinIds.length,1);
 api.v14EquipSkin('solar');
 assert.equal(api.S.cosmetics.equippedByHull[api.S.shipId],'solar');
 assert.equal(JSON.stringify(api.SHIPS[api.S.shipId]),orig);
 assert.equal(api.v14SkinCanOwn({id:'solar',faction:'solar',price:350}),false);
});

test('logistics delivery pays once and consumes sealed raw ore; same-region buy/sell loses SC',()=>{
 const {api}=bootV14(read());
 api.S.faction='verdant';api.S.credits=4000;api.S.x=900;api.S.y=900;api.S.system='orion';api.S.vx=api.S.vy=0;api.S.ore.moon=10;
 api.updateShip(.02);assert.ok(api.dockedStation);
 const offer=api.v14ConvoyOffers()[0],before=api.S.credits;
 api.v14AcceptConvoy(offer.to,offer.kind,offer.qty);
 assert.equal(api.S.ore[offer.kind],10-offer.qty);
 assert.equal(api.S.convoyContracts.find(c=>c.status==='active').to,offer.to);
 api.S.system=offer.to;api.S.x=900;api.S.y=900;api.S.vx=api.S.vy=0;api.updateShip(.02);
 api.v14CheckDelivery();
 const paid=api.S.credits;assert.equal(api.S.convoyCompleted.length,1);
 assert.ok(paid>before);
 api.v14CheckDelivery();assert.equal(api.S.credits,paid);
 const creditsBefore=api.S.credits;
 api.v14RegionalTrade('moon','buy');api.v14RegionalTrade('moon','sell');
 assert.ok(api.S.credits<creditsBefore,'buy-sell cycle cannot generate SC');
});