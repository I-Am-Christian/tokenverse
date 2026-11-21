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

const upgradeCtx={};vm.runInNewContext(fs.readFileSync(new URL('../docs/space-upgrades.js',import.meta.url),'utf8'),upgradeCtx);
const upgrades=upgradeCtx.WarpGameplay24;

function boot24(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp24SpawnSalvage,warp24Update,warp24Dash,warp24TrackSalvage,warp24UI,warp24DrawWorld,warp24ClickSalvage,updateDrones,get drops(){return warp24Drops},get trail(){return warp24Trail},segmentClear,warp23Record,warp23Claim,warp23ResetDay,warp23ShieldPulse,warp23RegisterKill,warp23RenderContracts,warp23UIUpdate,takeDamage,fireGun,updateBullets,updateParticles,get effects(){return warpCombatFX},get bullets(){return bullets},warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive,WarpRoute:warpRoute,WarpCombatFX:combatFactory,WarpContracts:rules,WarpVisuals:visuals,WarpGameplay24:upgrades},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}





const readRoot=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const readDocs=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');

test('v0.24 launches a matching 2D game from both GitHub Pages entrypoints',()=>{
 const a=readRoot(),b=readDocs();
 assert.match(a,/<title>Warp Coin v0\.26 — Persistent Frontier/);
 assert.match(b,/<title>Warp Coin v0\.26 — Persistent Frontier/);
 assert.match(a,/src="\.\/docs\/space-upgrades\.js"/);
 assert.match(b,/src="\.\/space-upgrades\.js"/);
 assert.equal(a.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
 b.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]);
 assert.match(a,/id="dashBtn"/);
 assert.match(a,/id="salvageBtn"/);
 assert.match(a,/id="salvageReadout"/);
 assert.doesNotMatch(a,/scene-3d|space3d|Warp3D|warp22/);
});
test('loot drops have weighted types, deterministic boss loot and finite lifetime',()=>{
 const low=upgrades.rollDrop({x:100,y:200,tier:1,random:()=>.05,now:()=>1000});
 assert.equal(low.type,'credits');assert.equal(low.amount,14);assert.equal(low.life,165);
 const mid=upgrades.rollDrop({x:100,y:200,tier:4,random:()=>.8});
 assert.equal(mid.type,'ore');assert.equal(mid.kind,'dust');
 const rare=upgrades.rollDrop({x:100,y:200,tier:4,random:()=>.98});
 assert.equal(rare.type,'fragment');assert.equal(rare.amount,1);
 const boss=upgrades.rollDrop({x:100,y:200,tier:8,boss:true,random:()=>.05});
 assert.equal(boss.type,'fragment');assert.equal(boss.amount,6);
 assert.equal(boss.life,240);
 assert.equal(upgrades.rollDrop({x:NaN,y:1}),null);
});
test('pods cannot overfill cargo, and rewards are never duplicated',()=>{
 assert.equal(upgrades.pickup({type:'ore',kind:'neon',amount:2},{cargo:9,capacity:10}),null);
 assert.equal(upgrades.pickup({type:'ore',kind:'neon',amount:2},{cargo:8,capacity:10}).amount,2);
 assert.equal(upgrades.pickup({type:'credits',amount:19},{cargo:30,capacity:30}).amount,19);
 const {api}=boot24(readRoot());
 api.S.x=64000;api.S.y=58000;api.S.system='borealis';
 const before=api.S.credits;
 api.warp24SpawnSalvage(api.S.x,api.S.y,1);
 assert.equal(api.drops.length,1);
 api.drops[0].type='credits';api.drops[0].amount=25;
 api.warp24Update(.016);
 assert.equal(api.S.credits,before+25);
 assert.equal(api.S.stats.salvaged,1);
 assert.equal(api.drops.length,0);
 api.warp24Update(.016);
 assert.equal(api.S.credits,before+25);
});
test('loot lifetime, capacity and nearby auto pickup work in the running game',()=>{
 const {api,elem}=boot24(readRoot());
 api.S.x=65000;api.S.y=60000;api.S.system='borealis';
 const drop=api.warp24SpawnSalvage(api.S.x+15,api.S.y+15,3);
 drop.type='ore';drop.kind='dust';drop.amount=3;
 const capacity=20+api.S.upgrades.cargo*10+api.SHIPS[api.S.shipId].cargo;
 api.S.ore.moon=capacity;
 api.warp24Update(.01);
 assert.equal(api.drops.length,1,'full cargo must leave ore pod in the field');
 api.S.ore.moon=0;
 api.warp24Update(.01);
 assert.equal(api.drops.length,0);
 assert.equal(api.S.ore.dust,3);
 const far=api.warp24SpawnSalvage(api.S.x+125,api.S.y+65,1);
 assert.ok(far);
 far.life=.02;
 api.warp24Update(.1);
 assert.equal(api.drops.length,0,'old salvage expires rather than filling memory');
 api.warp24UI();
 assert.equal(elem('salvageCount').textContent,0);
});
test('dash uses a safe corridor, spends energy and obeys an explicit cooldown',()=>{
 assert.equal(upgrades.dash({energy:5,now:15000}),null);
 assert.equal(upgrades.dash({energy:100,now:15000,inSafeZone:true}),null);
 assert.equal(upgrades.dash({energy:100,now:15000,blocked:true}),null);
 assert.equal(upgrades.dash({energy:100,now:15000,lastDashAt:12000}),null);
 const action=upgrades.dash({energy:100,now:16000,lastDashAt:0,angle:0});
 assert.equal(action.energyCost,22);
 assert.equal(action.vx,400);assert.equal(Math.abs(action.vy)<1e-9,true);
 assert.equal(action.dashUntil,16650);
 const {api,current,elem}=boot24(readRoot());
 api.S.system='borealis';api.S.x=64500;api.S.y=59500;api.S.angle=0;api.S.energy=100;
 assert.equal(api.segmentClear(api.S.x,api.S.y,api.S.x+260,api.S.y,null,48),true);
 api.warp24Dash();
 assert.equal(api.S.energy,78);
 assert.ok(api.S.vx>300);
 assert.ok(api.S.dashUntil>current.now);
 api.warp24UI();
 assert.equal(elem('dashBtn').disabled,true);
 api.warp24Dash();assert.equal(api.S.energy,78,'cooldown must reject duplicate use');
 current.now+=14000;
 api.warp24Dash();assert.equal(api.S.energy,56);
});
test('pirates strafe while approaching and lead moving targets',()=>{
 const target={x:0,y:0,vx:0,vy:180};
 const raider={x:400,y:0,angle:Math.PI,tier:3,pirateEncounter:'encounter',maneuverPhase:1};
 const intent=upgrades.droneIntent(raider,target,{safe:false,dt:.05});
 assert.equal(intent.engaged,true);
 assert.ok(Math.abs(intent.ay)>5,'pirates have an orthogonal strafe component');
 const novice=upgrades.droneIntent({...raider,pirateEncounter:null,tier:1},target,{safe:false,dt:.05});
 assert.ok(Math.abs(novice.ay)<Math.abs(intent.ay));
 const lead=upgrades.leadAngle(raider,target,450,1.5);
 const straight=Math.atan2(target.y-raider.y,target.x-raider.x);
 assert.ok(Math.abs(lead-straight)>.01,'projectile aiming anticipates velocity');
 assert.equal(upgrades.droneIntent(raider,target,{safe:true}).engaged,false);
});
test('destroyed drones and bosses spawn collectible rewards via actual combat code',()=>{
 const source=readRoot();
 assert.match(source,/if\(d\.hp<=0\)\{warp24SpawnSalvage\(d\.x,d\.y,d\.tier/);
 assert.match(source,/warp24SpawnSalvage\(extBoss\.x,extBoss\.y,extBoss\.tier,\{boss:true\}\)/);
 assert.match(source,/warp24SpawnSalvage\(p\.x,p\.y,p\.level,\{patrol:true\}\)/);
 assert.match(source,/window\.WarpGameplay24\?\.droneIntent/);
 assert.match(source,/window\.WarpGameplay24\?\.leadAngle/);
 assert.match(source,/warp24Update\(dt\)/);
 assert.match(source,/if\(lower==='z'&&!e\.repeat\)warp24Dash\(\)/);
 assert.match(source,/if\(lower==='v'&&!e\.repeat\)warp24TrackSalvage\(\)/);
});
test('clicking a pod and the salvage finder plot routes in the original huge galaxy',()=>{
 const {api}=boot24(readRoot());
 api.S.system='borealis';api.S.x=61000;api.S.y=52000;
 const drop=api.warp24SpawnSalvage(61900,52900,2);
 assert.equal(api.warp24ClickSalvage(drop.x,drop.y),true);
 assert.ok(api.autopilot);
 assert.equal(api.warp24ClickSalvage(drop.x+150,drop.y+150),false);
 api.warp24TrackSalvage();
 assert.ok(api.autopilot);
 assert.equal(api.WORLD.w,192000);
 assert.equal(api.S.saveVersion,20);
});
