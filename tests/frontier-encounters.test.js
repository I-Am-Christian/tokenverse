import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/travel-drive.js',import.meta.url),'utf8'),ctx);
const drive=ctx.WarpTravelDrive;
const frontierContext={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/frontier-encounters.js',import.meta.url),'utf8'),frontierContext);
const frontier=frontierContext.WarpFrontierEncounters;

function bootWarp(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp19Create,warp19Claim,warp19Tick,warp19PirateDestroyed,warp19Finish,warp19Route,warp19EventPoint,warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
 let seq=0;const elements=new Map(),store=new Map(starting?Object.entries(starting):[]),nop=()=>{};
 const graph=new Proxy({createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}}, {get(o,k){return o[k]||nop},set(o,k,v){o[k]=v;return true}});
 function elem(id){if(!elements.has(id)){
  const states=new Set(),cls={contains:k=>states.has(k),add:k=>states.add(k),remove:k=>states.delete(k),toggle(k,v){if(v===undefined?!states.has(k):v)states.add(k);else states.delete(k);return states.has(k)}};
  elements.set(id,{id,style:{},innerHTML:'',textContent:'',value:'',checked:false,disabled:false,children:[],classList:cls,
   addEventListener:nop,setAttribute:nop,getAttribute:()=>'',hasAttribute:()=>false,appendChild:nop,removeChild:nop,prepend:nop,click:nop,closest:()=>null,
   insertBefore:nop,querySelector:()=>null,getBoundingClientRect:()=>({left:0,right:1500,top:0,bottom:1080,width:1920,height:1080}),getContext:()=>graph});
 }return elements.get(id)}
 const document={getElementById:elem,querySelectorAll:()=>[],createElement:()=>elem('new-'+(++seq))};
 const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const current={now:Date.parse('2026-11-18T12:00:00Z')};const ODate=Date;
 class FakeDate extends ODate{static now(){return current.now;}}
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive,WarpFrontierEncounters:frontier},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}


const read=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
test('v0.19 encounter engine cycles four types and ignores teleport steps',()=>{
 assert.deepEqual(Array.from({length:4},(_,i)=>frontier.encounterType(i)),['wreck','distress','pirates','cache']);
 assert.equal(frontier.distanceStep({x:50,y:0,system:'orion'},{x:300,y:0,system:'orion'}),250);
 assert.equal(frontier.distanceStep({x:50,y:0,system:'orion'},{x:9000,y:0,system:'orion'}),0);
 assert.equal(frontier.distanceStep({x:50,y:0,system:'orion'},{x:300,y:0,system:'borealis'}),0);
});
test('candidate event spawns reject protected locations and intersecting hazards',()=>{
 const start={x:33000,y:32000},world={w:192000,h:115200};
 const where=frontier.choosePosition(start,0,world,{
  isSafe:(x,y)=>false,obstacles:[],stations:[],pathClear:()=>true
 });
 assert.ok(where&&where.x>start.x);
 assert.equal(frontier.choosePosition(start,0,world,{
  isSafe:()=>true,obstacles:[],stations:[],pathClear:()=>true
 }),null);
 const danger=frontier.choosePosition(start,0,world,{
  isSafe:()=>false,obstacles:[],stations:[],pathClear:()=>false
 });
 assert.equal(danger,null);
});
test('existing galaxy and simulated balances survive the v0.19 migration',()=>{
 const old={system:'borealis',x:52700,y:60100,worldScaleVersion:4,
  credits:1897,ore:{moon:7},shipId:'skiff',saveVersion:18};
 const {api,store}=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(old)});
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
 assert.equal(api.S.worldScaleVersion,4);
 assert.equal(api.S.saveVersion,19);
 assert.equal(api.S.credits,1897);
 assert.equal(api.S.ore.moon,7);
 assert.equal(api.S.roaming.completed,0);
 assert.ok(store.has('tokenverse-deep-space-v10'));
});
test('abandoned wreck is optional and can be claimed exactly once',()=>{
 const {api}=bootWarp(read());
 api.asteroids.splice(0);api.drones.splice(0);
 api.S.system='borealis';api.S.x=45000;api.S.y=55000;api.S.vx=0;api.S.vy=0;
 assert.equal(api.warp19Create(),true);
 const event=api.S.roaming.active;
 assert.equal(event.kind,'wreck');
 const before=api.S.credits;
 api.warp19Claim();assert.equal(api.S.credits,before,'cannot collect from a distance');
 api.S.x=event.x;api.S.y=event.y;
 api.warp19Claim();
 assert.equal(api.S.roaming.active,null);
 assert.equal(api.S.roaming.completed,1);
 assert.equal(api.S.credits,before+65);
 assert.equal(api.S.roaming.history.length,1);
 api.warp19Claim();
 assert.equal(api.S.credits,before+65,'no repeat payout');
});
test('pirate raid is a combat encounter with one-time completion bounty',()=>{
 const {api}=bootWarp(read());
 api.asteroids.splice(0);api.drones.splice(0);
 api.S.system='forge';api.S.x=48000;api.S.y=58000;
 api.S.roaming.ordinal=2;
 assert.equal(api.warp19Create(),true);
 const e=api.S.roaming.active;
 assert.equal(e.kind,'pirates');assert.equal(e.remaining,2);
 const raiders=api.drones.filter(d=>d.pirateEncounter===e.id);
 assert.equal(raiders.length,2);
 const before=api.S.credits;
 api.warp19PirateDestroyed(raiders[0]);
 assert.equal(api.S.roaming.active.remaining,1);
 api.warp19PirateDestroyed(raiders[1]);
 assert.equal(api.S.roaming.active,null);
 assert.equal(api.S.credits,before+115);
 assert.equal(api.S.roaming.completed,1);
 assert.equal(api.drones.filter(d=>d.pirateEncounter===e.id).length,0);
});
test('safe neutral starter port cannot spawn ambushes',()=>{
 const {api}=bootWarp(read());
 api.asteroids.splice(0);api.S.system='orion';api.S.x=900;api.S.y=900;
 api.S.roaming.ordinal=2;
 assert.equal(api.warp19Create(),false);
 assert.equal(api.S.roaming.active,null);
});
test('active rescued signal remains in a reloaded browser save',()=>{
 const {api}=bootWarp(read());
 api.asteroids.splice(0);api.drones.splice(0);
 api.S.system='borealis';api.S.x=45000;api.S.y=55000;
 api.S.roaming.ordinal=1;
 assert.equal(api.warp19Create(),true);
 const id=api.S.roaming.active.id;
 const reload=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(api.S)});
 assert.equal(reload.api.S.roaming.active.id,id);
 assert.equal(reload.api.S.roaming.active.kind,'distress');
 assert.equal(reload.api.S.saveVersion,19);
});
test('expired frontier signals never pay rewards and cannot be endlessly retriggered by teleport',()=>{
 const {api,current}=bootWarp(read());
 api.asteroids.splice(0);api.drones.splice(0);
 api.S.system='borealis';api.S.x=45000;api.S.y=55000;
 assert.equal(api.warp19Create(),true);
 const prior=api.S.credits;
 current.now+=150001;
 api.warp19Tick(.05);
 assert.equal(api.S.roaming.active,null);
 assert.equal(api.S.credits,prior);
 const ordinal=api.S.roaming.ordinal;
 api.S.x+=20000;
 api.warp19Tick(.05);
 assert.equal(api.S.roaming.ordinal,ordinal);
});
