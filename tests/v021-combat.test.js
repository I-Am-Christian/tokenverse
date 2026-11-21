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

function bootWarp(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,fireGun,updateBullets,updateParticles,get effects(){return warpCombatFX},get bullets(){return bullets},warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive,WarpRoute:warpRoute,WarpCombatFX:combatFactory},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}



const rootHtml=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const docsHtml=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
test('v0.21 root and docs share exactly the same gameplay and local save format',()=>{
 const root=rootHtml(),docs=docsHtml();
 assert.match(root,/<title>Warp Coin v0\.25/);
 assert.match(docs,/<title>Warp Coin v0\.25/);
 assert.match(root,/id="shootBtn"/);
 assert.match(docs,/id="shootBtn"/);
 assert.match(root,/src="\.\/docs\/combat-fx\.js"/);
 assert.match(docs,/src="\.\/combat-fx\.js"/);
 assert.equal(root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
              docs.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]);
 const {api}=bootWarp(root);
 assert.equal(api.S.saveVersion,20,'cosmetic weapon update does not rewrite old saves');
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
});
test('combatFX has distinct palettes for core guns, safe rendering and reduced motion',()=>{
 const all=['pulse','scatter','rail','plasma','diamond','arc','siege','ion','flak','enemy'];
 for(const name of all)assert.ok(combatFactory.palettes[name],name);
 const fx=combatFactory.create();
 const canvas={save(){},restore(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},
  arc(){},ellipse(){},fill(){},stroke(){},fillRect(){},setLineDash(){}};
 fx.muzzle({x:100,y:100,angle:0,weapon:'plasma'});
 fx.impact({x:200,y:200,weapon:'siege',killed:true});
 fx.trainingShot({x:140,y:120,angle:1,weapon:'scatter'});
 let bullet={x:180,y:130,vx:850,vy:0,color:'#71ffe0',from:'player',weapon:'rail'};
 fx.trail(bullet);fx.trail(bullet);
 assert.equal(bullet.fxTrail.length,2);
 assert.equal(fx.stats().flashes,2);
 assert.equal(fx.stats().bursts,1);
 assert.doesNotThrow(()=>fx.draw(canvas,[bullet],(x,y)=>[x,y],
  {quality:'high',reducedMotion:false,width:1920,height:1080,time:1}));
 assert.doesNotThrow(()=>fx.draw(canvas,[bullet],(x,y)=>[x,y],
  {quality:'low',reducedMotion:true,width:1920,height:1080,time:1}));
 fx.tick(.07);fx.tick(.07);fx.tick(.07);fx.tick(.07);fx.tick(.07);
 assert.equal(fx.stats().bursts,1);assert.equal(fx.stats().flashes,0);assert.equal(fx.stats().training,0);
 fx.tick(.08);fx.tick(.08);fx.tick(.08);fx.tick(.08);fx.tick(.08);
 assert.equal(fx.stats().bursts,0);
});
test('cosmetic impact and muzzle lists are bounded and expire predictably',()=>{
 const fx=combatFactory.create();
 for(let i=0;i<400;i++){
  fx.muzzle({x:i,y:i,weapon:'pulse'});
  fx.impact({x:i,y:i,weapon:'plasma',killed:true});
  fx.trainingShot({x:i,y:i,weapon:'scatter'});
 }
 assert.ok(fx.stats().bursts<=70);
 assert.ok(fx.stats().flashes<=70);
 assert.ok(fx.stats().training<=12);
 for(let n=0;n<12;n++)fx.tick(.08);
 assert.equal(fx.stats().bursts,0);assert.equal(fx.stats().flashes,0);assert.equal(fx.stats().training,0);
});
test('firing outside protected space keeps normal projectile damage and adds visual metadata',()=>{
 const {api}=bootWarp(rootHtml());
 api.S.system='borealis';api.S.x=61000;api.S.y=52000;api.S.angle=0;
 api.S.equipped.gun='pulse';api.S.energy=100;
 assert.equal(api.bullets.length,0);
 api.fireGun();
 assert.equal(api.bullets.length,1);
 const b=api.bullets[0];
 assert.equal(b.weapon,'pulse');
 assert.equal(b.damage,14,'visuals do not change the base damage');
 assert.equal(api.effects.stats().flashes,1);
 api.updateBullets(.025);
 assert.ok(b.fxTrail.length>=1);
 assert.equal(api.bullets.length,1);
});
test('protected ports show harmless training effects without damaging enemies',()=>{
 const {api}=bootWarp(rootHtml());
 api.S.system='orion';api.S.x=900;api.S.y=900;api.S.angle=.2;
 const ore={...api.S.ore},hp=api.S.hp,credits=api.S.credits;
 api.fireGun();
 assert.equal(api.bullets.length,0);
 assert.equal(api.effects.stats().training,1);
 assert.equal(api.S.hp,hp);
 assert.equal(api.S.credits,credits);
 assert.deepEqual(api.S.ore,ore);
});
test('holding F or mobile fire button is wired to continuous shooting in both game modes',()=>{
 const html=rootHtml();
 assert.match(html,/if\(pressed\.f\|\|touchFireHeld\)fireGun\(\)/);
 assert.match(html,/shootBtn'\)\.addEventListener\('pointerdown'/);
 assert.match(html,/shootBtn'\)\.addEventListener\('pointerup'/);
 assert.match(html,/aria-label="Fire weapons \(hold to repeat\)"/);
 assert.match(html,/v14RiftBullets\.push\(\{[\s\S]*?weapon:S\.equipped\.gun,from:'player'/);
});
