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

function boot25(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp25Zoom,warp25SetZoom,warp25ZoomBy,warp25PointerToWorld,warp25VisibleScreen,warp25Populate,warp25Tick,warp25HitBot,warp25Hail,warp25BotClick,warp25RenderFleet,warp25FleetUI,warp25DrawFleet,warp25ShipRadius,warp25TorpedoSplash,get fleet(){return warp25Bots},get scenery(){return warp25Scenery},warp24SpawnSalvage,warp24Update,warp24Dash,warp24TrackSalvage,warp24UI,warp24DrawWorld,warp24ClickSalvage,updateDrones,get drops(){return warp24Drops},get trail(){return warp24Trail},segmentClear,warp23Record,warp23Claim,warp23ResetDay,warp23ShieldPulse,warp23RegisterKill,warp23RenderContracts,warp23UIUpdate,takeDamage,fireGun,updateBullets,updateParticles,get effects(){return warpCombatFX},get bullets(){return bullets},warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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

test('v0.25 loads zoom/fleet module from public root and docs, no WebGL or Supabase',()=>{
 const root=readRoot(),docs=readDocs();
 assert.match(root,/<title>Warp Coin v0\.26 — Persistent Frontier/);
 assert.match(docs,/<title>Warp Coin v0\.26 — Persistent Frontier/);
 assert.match(root,/src="\.\/docs\/galaxy-life\.js"/);
 assert.match(docs,/src="\.\/galaxy-life\.js"/);
 assert.equal(root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
   docs.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]);
 for(const html of [root,docs]){
  assert.match(html,/id="zoomOutBtn"/);
  assert.match(html,/id="zoomInBtn"/);
  assert.match(html,/id="zoomResetBtn"/);
  assert.match(html,/id="toggleFleet"/);
  assert.match(html,/id="fleetList"/);
  assert.doesNotMatch(html,/scene-3d|space3d|Warp3D/);
 }
 assert.doesNotMatch(fs.readFileSync(new URL('../docs/galaxy-life.js',import.meta.url),'utf8'),/fetch\(|https?:\/\/|supabase/);
});
test('camera zoom is clamped, reversible and click picking respects zoom',()=>{
 assert.equal(life.zoom(.05),.36);
 assert.equal(life.zoom(5),2.4);
 assert.equal(life.zoom('bogus'),1);
 assert.ok(life.wheelZoom(.8,-1)>.8);
 assert.ok(life.wheelZoom(.8,1)<.8);
 const ship={x:30000,y:40000},w=1280,h=720;
 let p=life.screenToWorld(840,460,ship,w,h,.5);
 assert.equal(p.x,30400);assert.equal(p.y,40200);
 p=life.screenToWorld(840,460,ship,w,h,2);
 assert.equal(p.x,30100);assert.equal(p.y,40050);
 assert.equal(life.visible(1500,600,w,h,.5),true);
 assert.equal(life.visible(1500,600,w,h,2),false);
 const {api,elem}=boot25(readRoot());
 api.warp25SetZoom(.5);
 assert.equal(api.S.settings.zoom2D,.5);
 assert.equal(elem('zoomValue').textContent,'50%');
 assert.equal(api.warp25Zoom(),.5);
 const picked=api.warp25PointerToWorld(1160,740);
 assert.equal(picked.x,api.S.x+(1160-960)/.5);
 assert.equal(picked.y,api.S.y+(740-540)/.5);
 elem('zoomResetBtn').onclick();
 assert.equal(api.warp25Zoom(),1);
 elem('zoomOutBtn').onclick();
 assert.equal(api.warp25Zoom(),.8);
 elem('zoomInBtn').onclick();
 assert.equal(api.warp25Zoom(),1);
});
test('four capital ships are much larger and have real high-end costs and physics tradeoffs',()=>{
 const {api}=boot25(readRoot());
 for(const id of ['starcarrier','battlecruiser','ark','titan']){
  const sp=api.SHIPS[id];
  assert.equal(sp.role,'capital');
  assert.ok(sp.visualScale>=2);
  assert.ok(sp.hull>=350&&sp.cargo>=90);
  assert.ok(sp.cost.credits>=45000);
  assert.ok(sp.speed<api.SHIPS.skiff.speed);
  assert.equal(api.S.ownedShips[id]===true,false);
 }
 assert.ok(api.SHIPS.titan.visualScale>api.SHIPS.starcarrier.visualScale);
 assert.ok(api.warp25ShipRadius()>=20);
 api.S.shipId='titan';
 assert.ok(api.warp25ShipRadius()>55);
 assert.equal(api.S.saveVersion,20);
 assert.equal(api.WORLD.w,192000);
});
test('five new guns are craftable with distinct recoil, cooldowns, pellets and guidance',()=>{
 const {api}=boot25(readRoot());
 const ids=['autocannon','barrage','prism','ionstorm','torpedo'];
 for(const id of ids){
  assert.ok(api.GUNS[id].cost,'weapon '+id+' has real crafting costs');
  assert.equal(api.S.crafted.guns[id],false);
  assert.equal(api.S.weaponLevels[id],1);
 }
 assert.ok(api.GUNS.autocannon.fireRate<.10);
 assert.equal(api.GUNS.barrage.pellets,6);
 assert.equal(api.GUNS.prism.pellets,2);
 assert.equal(api.GUNS.ionstorm.pellets,3);
 assert.equal(api.GUNS.torpedo.guided,true);
 assert.ok(api.GUNS.torpedo.splash>=90);
});
test('new NPCs populate the actual 2D simulation with multiple classes',()=>{
 const {api}=boot25(readRoot());
 assert.ok(api.fleet.length>=4&&api.fleet.length<=8);
 assert.ok(api.scenery.length>=50);
 assert.ok(api.fleet.some(b=>b.role==='trader'));
 assert.ok(api.fleet.some(b=>b.role==='miner'));
 assert.ok(api.fleet.some(b=>b.role==='freighter'));
 assert.ok(api.fleet.some(b=>b.role==='escort'));
 const seed=life.spawnTraffic({x:20000,y:20000},{count:28,system:'helios',isSafe:()=>false,random:(()=>{let x=3;return ()=>((x=x*16807%2147483647)/2147483647)})()});
 assert.ok(seed.some(b=>b.role==='raider'));
 assert.ok(seed.some(b=>b.role==='freighter'));
 assert.ok(seed.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)&&b.hp>0));
 const homestead=life.spawnTraffic({x:30000,y:30000},{count:28,system:'homestead'});
 assert.ok(homestead.every(b=>b.role!=='raider'));
});
test('NPC traffic moves, escorts target raiders and hostile leading works',()=>{
 const ship={x:10000,y:10000,vx:80,vy:0};
 const raider={role:'raider',hp:100,x:10400,y:10000,anchorX:10400,anchorY:10000,phase:1,vx:0,vy:0};
 const escort={role:'escort',x:10050,y:9950,anchorX:10050,anchorY:9950,phase:1,vx:0,vy:0};
 const aim=life.trafficIntent(raider,ship,[raider,escort],.016);
 assert.equal(aim.fire,true);
 assert.ok(Math.abs(aim.ay)>0);
 const help=life.trafficIntent(escort,ship,[raider,escort],.016);
 assert.equal(help.target,raider);
 assert.equal(help.fire,true);
 const missile={x:0,y:0,vx:400,vy:0};
 assert.equal(life.missileStep(missile,{x:200,y:230},.05),true);
 assert.ok(missile.vy>0);
 assert.ok(Math.abs(Math.hypot(missile.vx,missile.vy)-400)<.001);
 const nearest=life.chooseMissileTarget({x:0,y:0},[],[{x:200,y:60,role:'raider',hp:20}]);
 assert.equal(nearest.role,'raider');
});
test('player can hail trader, miner and freighter NPCs with correct credit and capacity checks',()=>{
 const {api}=boot25(readRoot());
 api.S.credits=650;api.S.hp=30;api.S.maxHp=100;
 let merchant=api.fleet.find(b=>b.role==='trader');assert.ok(merchant);
 api.S.x=merchant.x;api.S.y=merchant.y;
 api.warp25Hail(merchant.id);
 assert.equal(api.S.credits,575);
 assert.equal(api.S.hp,95);
 let miner=api.fleet.find(b=>b.role==='miner');assert.ok(miner);
 api.S.x=miner.x;api.S.y=miner.y;
 const before=api.S.ore.neon;
 api.warp25Hail(miner.id);
 assert.equal(api.S.credits,547);
 assert.equal(api.S.ore.neon,before+1);
 let carrier=api.fleet.find(b=>b.role==='freighter');assert.ok(carrier);
 api.S.x=carrier.x;api.S.y=carrier.y;api.S.energy=20;
 api.warp25Hail(carrier.id);
 assert.equal(api.S.energy,75);
 assert.equal(api.S.credits,497);
});
test('hostile NPC damage rewards and salvage cannot duplicate once destroyed',()=>{
 const {api}=boot25(readRoot());
 api.S.system='borealis';api.S.x=10000;api.S.y=10000;
 const bot={id:'raider-test',role:'raider',x:10100,y:10000,size:1.2,
  hp:15,maxHp:15,color:'#ff9ea8'};
 api.fleet.push(bot);
 const start=api.S.credits,n=api.fleet.length;
 assert.equal(api.warp25HitBot({x:bot.x,y:bot.y,damage:50,from:'player',weapon:'pulse',color:'#79dfff'}),true);
 assert.equal(api.fleet.length,n-1);
 assert.equal(api.S.credits,start+35);
 assert.equal(api.warp25HitBot({x:bot.x,y:bot.y,damage:50,from:'player'}),false);
 assert.ok(api.drops.length>=1);
});
test('zoom view keeps player world units fixed and includes scale transform in draw()',()=>{
 const {api}=boot25(readRoot());
 for(const z of [.36,.45,1,1.8,2.4]){
  api.warp25SetZoom(z);
  assert.doesNotThrow(()=>api.draw());
  assert.equal(api.warp25Zoom(),z);
 }
 const code=readRoot();
 assert.match(code,/ctx\.scale\(cameraScale,cameraScale\)/);
 assert.match(code,/warp25PointerToWorld\(e\.clientX,e\.clientY\)/);
 assert.match(code,/warp25VisibleScreen\(x,y,85\)/);
 assert.match(code,/warp25Tick\(dt\)/);
 assert.match(code,/warp25DrawFleet\(\)/);
 assert.match(code,/warp25HitBot\(b\)/);
});
