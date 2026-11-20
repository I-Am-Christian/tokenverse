import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/travel-drive.js',import.meta.url),'utf8'),ctx);
const drive=ctx.WarpTravelDrive;

function bootWarp(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}

const read=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
test('v0.18 travel module safely controls long-distance speed',()=>{
 assert.equal(drive.cruiseSpeed(400,1,1,true),0);
 assert.equal(drive.cruiseSpeed(16000,1,1,false),0);
 assert.equal(drive.cruiseSpeed(16000,1,1,true),6000);
 assert.ok(drive.cruiseSpeed(16000,1.2,3,true)>6000);
 assert.ok(drive.cruiseSpeed(16000,8,5,true)<=8200);
});
test('pulse has a capped range and does not land on its selected endpoint',()=>{
 const p=drive.pulseDestination({x:0,y:0},{x:50000,y:0});
 assert.equal(p.distance,8500);
 assert.equal(p.x,8500);
 assert.equal(drive.pulseDestination({x:0,y:0},{x:500,y:0}),null);
 const close=drive.pulseDestination({x:0,y:0},{x:4000,y:0});
 assert.ok(close.distance<=3350);
});
test('danger checks use the entire travel segment, not just its endpoints',()=>{
 assert.equal(drive.corridorDanger({x:0,y:0},{x:10000,y:0},[{x:5000,y:40}],500),true);
 assert.equal(drive.corridorDanger({x:0,y:0},{x:10000,y:0},[{x:5000,y:900}],500),false);
});
test('new browser build parses and retains original galaxy dimensions',()=>{
 const {api}=bootWarp(read());
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
 assert.equal(api.S.worldScaleVersion,4);
 assert.ok(api.S.saveVersion>=18,'v0.18 travel features must remain in later save formats');
 assert.equal(api.S.exploredSystems.orion,true);
 const html=read();
 assert.match(html,/id="pulseJumpBtn"/);
 assert.match(html,/src="\.\/travel-drive\.js"/);
 assert.match(html,/Warp Cruise/);
});
test('autopilot cruises quickly across clear space and pulse jump consumes energy once',()=>{
 const {api}=bootWarp(read());
 api.asteroids.splice(0);api.drones.splice(0);
 api.S.system='borealis';api.S.x=27000;api.S.y=59000;api.S.vx=0;api.S.vy=0;
 assert.equal(api.setAutopilot('point',130000,59000),true);
 for(let i=0;i<12;i++)api.updateShip(.05);
 assert.equal(api.warp18Cruising,true);
 assert.ok(Math.hypot(api.S.vx,api.S.vy)>500);
 const before=api.S.x,energy=api.S.energy;
 api.warp18PulseJump();
 assert.ok(api.S.x-before>5000);
 assert.equal(api.S.energy,energy-28);
 const after=api.S.x;
 api.warp18PulseJump();
 assert.equal(api.S.x,after,'cooldown prevents repeated pulse');
});
test('pulse blocks jumps through obstacles, preserving energy and position',()=>{
 const {api}=bootWarp(read());
 api.asteroids.splice(0);api.drones.splice(0);
 api.S.system='borealis';api.S.x=27000;api.S.y=59000;
 assert.equal(api.setAutopilot('point',130000,59000),true);
 api.asteroids.push({x:api.S.x+1700,y:api.S.y,r:40,ore:12,kind:'moon'});
 const x=api.S.x,energy=api.S.energy;
 api.warp18PulseJump();
 assert.equal(api.S.x,x);
 assert.equal(api.S.energy,energy);
});
test('explorer credits cannot be farmed repeatedly by revisiting the same place',()=>{
 const {api}=bootWarp(read());
 const old=api.S.credits;
 api.warp18SystemDiscovery('borealis');api.warp18SystemDiscovery('borealis');
 assert.equal(api.S.credits,old+90);
 api.warp18StationDiscovery(api.DEEP_RIM_STATIONS[0]);
 api.warp18StationDiscovery(api.DEEP_RIM_STATIONS[0]);
 assert.equal(api.S.credits,old+135);
});
