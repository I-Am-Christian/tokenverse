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

const lifeCtx={};vm.runInNewContext(fs.readFileSync(new URL('../docs/galaxy-life.js',import.meta.url),'utf8'),lifeCtx);
const life=lifeCtx.WarpGalaxyLife;
const persistentCtx={};vm.runInNewContext(fs.readFileSync(new URL('../docs/persistent-world.js',import.meta.url),'utf8'),persistentCtx);
const persistence=persistentCtx.WarpPersistentWorld;
const artCtx={};vm.runInNewContext(fs.readFileSync(new URL('../docs/ship-designs.js',import.meta.url),'utf8'),artCtx);
const art=artCtx.WarpShipDesigns;

function boot26(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp26RestoreOre,v14DrawFactionHull,warp25Zoom,warp25SetZoom,warp25ZoomBy,warp25PointerToWorld,warp25VisibleScreen,warp25Populate,warp25Tick,warp25HitBot,warp25Hail,warp25BotClick,warp25RenderFleet,warp25FleetUI,warp25DrawFleet,warp25ShipRadius,warp25TorpedoSplash,get fleet(){return warp25Bots},get scenery(){return warp25Scenery},warp24SpawnSalvage,warp24Update,warp24Dash,warp24TrackSalvage,warp24UI,warp24DrawWorld,warp24ClickSalvage,updateDrones,get drops(){return warp24Drops},get trail(){return warp24Trail},segmentClear,warp23Record,warp23Claim,warp23ResetDay,warp23ShieldPulse,warp23RegisterKill,warp23RenderContracts,warp23UIUpdate,takeDamage,fireGun,updateBullets,updateParticles,get effects(){return warpCombatFX},get bullets(){return bullets},warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive,WarpRoute:warpRoute,WarpCombatFX:combatFactory,WarpContracts:rules,WarpVisuals:visuals,WarpGameplay24:upgrades,WarpGalaxyLife:life,WarpPersistentWorld:persistence,WarpShipDesigns:art},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}







const readRoot=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const readDocs=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');

test('v0.26 ships and deterministic world modules load in both 2D entrypoints',()=>{
 const root=readRoot(),docs=readDocs();
 assert.match(root,/<title>Warp Coin v0\.26 — Persistent Frontier/);
 assert.match(docs,/<title>Warp Coin v0\.26 — Persistent Frontier/);
 for(const name of ['persistent-world.js','ship-designs.js']){
  assert.match(root,new RegExp('src="\\./docs/'+name.replace('.','\\.')+'"'));
  assert.match(docs,new RegExp('src="\\./'+name.replace('.','\\.')+'"'));
 }
 assert.equal(root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
 docs.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]);
 assert.doesNotMatch(root,/scene-3d|space3d|Warp3D/);
});
test('stable system-wide NPC population is eight or fewer and not recentered as pilot moves',()=>{
 const {api}=boot26(readRoot());
 assert.equal(api.fleet.length,8);
 const old=api.fleet.map(b=>({id:b.id,x:b.x,y:b.y}));
 api.S.x+=13500;api.S.y+=8200;
 api.warp25Tick(.016);
 assert.equal(api.fleet.length,old.length);
 assert.deepEqual(api.fleet.map(b=>b.id),old.map(b=>b.id));
 for(let i=0;i<old.length;i++)
  assert.ok(Math.hypot(api.fleet[i].x-old[i].x,api.fleet[i].y-old[i].y)<15,
   'fleets stay in the same world-space coordinates instead of being recentered around pilot');
});
test('NPCs preserve positions, HP and hires through system travel and reload',()=>{
 const first=boot26(readRoot()),{api}=first,bot=api.fleet[0];
 bot.x+=61;bot.y+=24;bot.hp=43;bot.hiredUntil=Date.now()+30000;
 const original=JSON.parse(JSON.stringify(api.fleet));
 api.S.system='borealis';api.spawnWorld();api.warp25Populate();
 assert.equal(api.fleet.length,8);
 assert.notEqual(api.fleet[0].id,bot.id);
 api.S.system='orion';api.spawnWorld();api.warp25Populate();
 assert.equal(api.fleet[0].x,original[0].x);
 assert.equal(api.fleet[0].y,original[0].y);
 assert.equal(api.fleet[0].hp,43);
 const reboot=boot26(readRoot(),{'tokenverse-deep-space-v10':JSON.stringify(api.S)});
 assert.equal(reboot.api.fleet[0].x,original[0].x);
 assert.equal(reboot.api.fleet[0].hp,43);
 assert.equal(reboot.api.S.saveVersion,20);
});
test('destroyed outlaw removal persists; empty fleet is valid and cannot regenerate',()=>{
 const {api}=boot26(readRoot());
 const ids=api.fleet.map(b=>b.id);
 const bot=api.fleet.find(x=>x.role==='raider');
 assert.ok(bot);
 assert.equal(api.warp25HitBot({from:'player',weapon:'pulse',damage:bot.hp+10,
  x:bot.x,y:bot.y,color:'#73fff1'}),true);
 assert.equal(api.fleet.some(b=>b.id===bot.id),false);
 assert.ok(api.S.npcFleet[api.S.system].every(b=>b.id!==bot.id));
 api.S.x+=10000;api.warp25Tick(.016);
 assert.equal(api.fleet.some(b=>b.id===bot.id),false);
 api.warp25Populate();
 assert.equal(api.fleet.some(b=>b.id===bot.id),false);
 assert.equal(api.fleet.length,ids.length-1);
 const after=boot26(readRoot(),{'tokenverse-deep-space-v10':JSON.stringify(api.S)});
 assert.equal(after.api.fleet.some(b=>b.id===bot.id),false);
});
test('deterministic asteroids retain coordinates, ore and all mined depletion across reloads',()=>{
 const {api}=boot26(readRoot());
 const snapshot=api.asteroids.slice(0,30).map(a=>({id:a.id,x:a.x,y:a.y,kind:a.kind,ore:a.ore}));
 api.spawnWorld();
 assert.deepEqual(api.asteroids.slice(0,30).map(a=>({id:a.id,x:a.x,y:a.y,kind:a.kind,ore:a.ore})),snapshot);
 const resource=api.asteroids.find(a=>a.ore>0);
 assert.ok(resource);
 api.S.asteroidOre??={};(api.S.asteroidOre[api.S.system]??={})[String(resource.id)]=0;
 api.spawnWorld();
 const depleted=api.asteroids.find(a=>a.id===resource.id);
 assert.equal(depleted.ore,0);
 const reboot=boot26(readRoot(),{'tokenverse-deep-space-v10':JSON.stringify(api.S)});
 assert.equal(reboot.api.asteroids.find(a=>a.id===resource.id).ore,0);
 assert.deepEqual(reboot.api.asteroids.slice(0,30).map(a=>({x:a.x,y:a.y})),snapshot.map(a=>({x:a.x,y:a.y})));
});
test('debris features are tied to world coordinates and return unchanged on revisit',()=>{
 const origin={x:79000,y:42000},persistence=globalThis.__no__||globalThis.WarpPersistentWorld;
 // Loaded in isolated VM globals, so verify the module through the bootstrapped instance.
 const moduleCtx={};vm.runInNewContext(fs.readFileSync(new URL('../docs/persistent-world.js',import.meta.url),'utf8'),moduleCtx);
 const world=moduleCtx.WarpPersistentWorld;
 const a=world.debrisFor({system:'helios',origin,range:2300});
 const b=world.debrisFor({system:'helios',origin:{x:origin.x+800,y:origin.y+800},range:2300});
 const c=world.debrisFor({system:'helios',origin,range:2300});
 assert.equal(JSON.stringify(a),JSON.stringify(c));
 const overlap=new Map(b.map(x=>[x.id,x]));
 const same=a.filter(x=>overlap.has(x.id));
 assert.ok(same.length>20);
 for(const p of same){assert.equal(p.x,overlap.get(p.id).x);assert.equal(p.y,overlap.get(p.id).y);}
 assert.ok(a.length>40);
});
test('ship artwork uses layered original top-down designs with distinct hull classes',()=>{
 const ctx={};
 vm.runInNewContext(fs.readFileSync(new URL('../docs/ship-designs.js',import.meta.url),'utf8'),ctx);
 const art=ctx.WarpShipDesigns;
 assert.equal(art.typeFor('titan','capital'),'capital');
 assert.equal(art.typeFor('prospector','miner'),'miner');
 assert.equal(art.typeFor('scout_4','scout'),'interceptor');
 assert.equal(art.typeFor('outlaw','raider'),'raider');
 assert.equal(art.typeFor('hauler_5','hauler'),'freighter');
 assert.equal(art.typeFor('nomad','explorer'),'explorer');
 let fills=0,strokes=0;
 const brush=new Proxy({createLinearGradient(){return {addColorStop(){}}},fill(){fills++;},stroke(){strokes++;}},
 {get(o,k){return k in o?o[k]:()=>{}},set(o,k,v){o[k]=v;return true}});
 for(const kind of ['interceptor','explorer','miner','freighter','raider','capital']){
  assert.equal(art.draw(brush,{kind,x:150,y:180,scale:1,thrust:true,quality:'high',time:4}),true);
 }
 assert.ok(fills>80,'ships use multiple shaded layers and illuminated engine/cockpit parts');
 assert.ok(strokes>40,'ships have readable armor and turret detailing');
 const {api}=boot26(readRoot());
 assert.doesNotThrow(()=>api.v14DrawFactionHull(brush,150,180,0,1));
});
test('legacy saves migrate without replacement and 3D mode stays removed',()=>{
 const old={saveVersion:20,system:'orion',credits:1517,ore:{moon:3},
  settings:{sound:false,assist:true,zoom2D:.8},
  shipId:'skiff',ownedShips:{skiff:true}};
 const {api}=boot26(readRoot(),{'tokenverse-deep-space-v10':JSON.stringify(old)});
 assert.equal(api.S.credits,1517);
 assert.equal(api.S.ore.moon,3);
 assert.equal(api.S.settings.zoom2D,.8);
 assert.equal(api.fleet.length,8);
 assert.ok(api.S.npcFleet.orion);
 assert.ok(api.asteroids.length>3000);
 assert.equal(api.S.saveVersion,20);
 const source=readRoot();
 assert.match(source,/\(S\.asteroidOre\[S\.system\]\?\?=\{\}\)\[String\(target\.id\)\]=target\.ore/);
 assert.match(source,/warp26RestoreOre\(\)/);
 assert.match(source,/warp25Bots=persistent\.fleetFor\(S/);
 assert.doesNotMatch(source,/moved>2600&&/);
});
