import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/travel-drive.js',import.meta.url),'utf8'),ctx);
const drive=ctx.WarpTravelDrive;
const wr={};vm.runInNewContext(fs.readFileSync(new URL('../docs/warp-route.js',import.meta.url),'utf8'),wr);
const warpRoute=wr.WarpRoute;
const fxContext={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/combat-fx.js',import.meta.url),'utf8'),fxContext);
const combatFactory=fxContext.WarpCombatFX;

const contractsContext={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/field-contracts.js',import.meta.url),'utf8'),contractsContext);
const rules=contractsContext.WarpContracts;
const visualsContext={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/space-visuals.js',import.meta.url),'utf8'),visualsContext);
const visuals=visualsContext.WarpVisuals;

function boot23(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp23Record,warp23Claim,warp23ResetDay,warp23ShieldPulse,warp23RegisterKill,warp23RenderContracts,warp23UIUpdate,takeDamage,fireGun,updateBullets,updateParticles,get effects(){return warpCombatFX},get bullets(){return bullets},warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive,WarpRoute:warpRoute,WarpCombatFX:combatFactory,WarpContracts:rules,WarpVisuals:visuals},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}




const readRoot=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const readDocs=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');

test('3D mode, WebGL loading and obsolete graphics files are fully gone; 2D remains current',()=>{
 const root=readRoot(),docs=readDocs();
 assert.match(root,/<title>Warp Coin v0\.24 — Salvage Wars/);
 assert.match(docs,/<title>Warp Coin v0\.24 — Salvage Wars/);
 for(const html of [root,docs]){
  assert.doesNotMatch(html,/scene-3d|space3d|Warp3D|warp22|viewModeBtn|v22MobileFlight/);
  assert.match(html,/id="space"/);
  assert.match(html,/id="toggleContracts"/);
  assert.match(html,/id="shieldPulseBtn"/);
  assert.match(html,/id="shootBtn"/);
  assert.match(html,/id="warpDriveBtn"/);
 }
 assert.equal(fs.existsSync(new URL('../docs/scene-3d.js',import.meta.url)),false);
 assert.equal(fs.existsSync(new URL('../docs/scene-3d-core.js',import.meta.url)),false);
 assert.equal(root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
              docs.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]);
 assert.match(root,/src="\.\/docs\/field-contracts\.js"/);
 assert.match(docs,/src="\.\/field-contracts\.js"/);
});
test('daily contracts track exactly once and reject duplicate claims',()=>{
 const day=Date.parse('2026-11-21T08:00:00Z');
 const a=rules.make(day,1);
 assert.equal(a.offers.length,3);
 assert.equal(a.offers[0].id,'bounty');
 assert.equal(a.offers[1].id,'prospector');
 assert.equal(a.offers[2].id,'signals');
 assert.equal(rules.completeCount(a),0);
 assert.equal(rules.record(a,'mine',3),true);
 assert.equal(rules.record(a,'mine',100),true);
 assert.equal(a.offers[1].progress,5);
 assert.equal(rules.record(a,'mine',1),false);
 assert.equal(rules.completeCount(a),1);
 assert.equal(rules.claim(a,'prospector').credits,115);
 assert.equal(rules.claim(a,'prospector'),null);
 assert.equal(rules.completeCount(a),0);
 assert.equal(rules.claim(a,'bounty'),null);
 assert.equal(rules.restore(a,day+45000,1).offers[1].claimed,true);
 const next=rules.restore(a,day+86400000,1);
 assert.equal(next.offers[1].progress,0);
 assert.equal(next.offers[1].claimed,false);
});
test('previous saves migrate to contracts and discard only the retired 3D preferences',()=>{
 const old={
  credits:1811,saveVersion:20,system:'orion',worldScaleVersion:4,shipId:'skiff',
  settings:{sound:false,assist:true,view3D:true,cameraZoom:1.4},ore:{moon:9},
  fieldContracts:null
 };
 const {api,store}=boot23(readRoot(),{'tokenverse-deep-space-v10':JSON.stringify(old)});
 assert.equal(api.S.credits,1811);
 assert.equal(api.S.ore.moon,9);
 assert.equal(api.S.settings.assist,true);
 assert.equal(api.S.settings.view3D,undefined);
 assert.equal(api.S.settings.cameraZoom,undefined);
 assert.equal(api.S.saveVersion,20);
 assert.equal(api.WORLD.w,192000);
 assert.equal(api.WORLD.h,115200);
 assert.equal(api.S.fieldContracts.offers.length,3);
 assert.ok(store.has('tokenverse-deep-space-v10'));
});
test('claiming a completed mission adds Scrap Credits and XP exactly once',()=>{
 const {api,elem}=boot23(readRoot());
 const beforeCredits=api.S.credits, beforeXP=api.S.xp;
 api.warp23Record('mine',5);
 const mined=api.S.fieldContracts.offers.find(x=>x.id==='prospector');
 assert.equal(mined.progress,mined.goal);
 api.warp23Claim('prospector');
 assert.equal(api.S.credits,beforeCredits+115);
 assert.equal(api.S.xp,beforeXP+28);
 api.warp23Claim('prospector');
 assert.equal(api.S.credits,beforeCredits+115);
 api.warp23RenderContracts();
 assert.match(elem('contractsList').innerHTML,/CLAIMED/);
 assert.match(elem('contractsList').innerHTML,/Clear the Space Lanes/);
});
test('shield pulse spends energy, blocks some damage, and has a cooldown',()=>{
 const {api,current,elem}=boot23(readRoot());
 api.S.energy=100;api.S.hp=100;
 api.warp23ShieldPulse();
 assert.equal(api.S.energy,72);
 assert.ok(api.S.shieldEndsAt>current.now);
 assert.equal(elem('shieldPulseBtn').disabled,true);
 api.takeDamage(20);
 assert.equal(api.S.hp,93,'Shield absorbs 65% of a 20 HP hit');
 api.warp23ShieldPulse();assert.equal(api.S.energy,72,'repeat does not spend energy');
 current.now+=7000;
 api.takeDamage(20);
 assert.equal(api.S.hp,73,'full damage resumes after the shield expires');
 api.warp23ShieldPulse();assert.equal(api.S.energy,72,'cannot recast during cooldown');
 current.now+=26000;
 api.warp23ShieldPulse();assert.equal(api.S.energy,44);
});
test('a three-kill streak rewards only its later combo hits and advances daily bounty',()=>{
 const {api}=boot23(readRoot());
 const before=api.S.credits;
 api.warp23RegisterKill();
 api.warp23RegisterKill();
 assert.equal(api.S.credits,before);
 api.warp23RegisterKill();
 assert.equal(api.S.credits,before+7);
 assert.equal(api.S.fieldContracts.offers[0].progress,2);
 assert.equal(rules.completeCount(api.S.fieldContracts),1);
});
test('upgraded procedural 2D nebulae, enemies, minerals and engine exhaust render without external data',()=>{
 const canvas=new Proxy({
  createLinearGradient(){return {addColorStop(){}}},
  createRadialGradient(){return {addColorStop(){}}},
 },{get(target,key){return key in target?target[key]:()=>{};},set(target,key,value){target[key]=value;return true;}});
 assert.equal(visuals.backdrop(canvas,{w:1280,h:720,x:45000,y:34000,system:'umbra',quality:'low'}),false);
 assert.equal(visuals.backdrop(canvas,{w:1280,h:720,x:45000,y:34000,system:'umbra',quality:'high',t:20}),true);
 assert.equal(visuals.starfield(canvas,{w:1280,h:720,quality:'medium',cruising:true,t:6}),true);
 assert.doesNotThrow(()=>visuals.thruster(canvas,{w:1280,h:720,angle:1,speed:1000,cruising:true,active:true}));
 assert.doesNotThrow(()=>visuals.oreGlint(canvas,{radius:28,kind:'diam',time:6,quality:'medium'}));
 assert.equal(visuals.drone(canvas,{x:220,y:260,angle:1,tier:3,color:'#ff8e99',ratio:.3,time:3}),true);
});
test('new contracts hooks and combat overlays are integrated into the original 2D game',()=>{
 const html=readRoot();
 assert.match(html,/warp23Record\('mine'\)/);
 assert.match(html,/warp23Record\('scan'\)/);
 assert.match(html,/warp23RegisterKill\(\)/);
 assert.match(html,/warp23DrawCombat\(\)/);
 assert.match(html,/window\.WarpVisuals\?\.drone/);
 assert.match(html,/window\.WarpVisuals\?\.oreGlint/);
 assert.match(html,/if\(lower==='q'&&!e\.repeat\)warp23ShieldPulse\(\)/);
 assert.match(html,/id="contractsList"/);
});
