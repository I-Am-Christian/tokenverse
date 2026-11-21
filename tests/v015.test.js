import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function bootWarp(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}
const read=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('Warp Coin v0.15 rebrands the browser and scales all five public galaxy maps',()=>{
 const html=read(),{api}=bootWarp(html);
 assert.match(html,/<title>Warp Coin v0\.25/);
 assert.match(html,/WARP<span>COIN<\/span>/);
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
 assert.equal(Object.keys(api.SHIPS).length,40);
 assert.equal(Object.keys(api.GUNS).length,14);
 assert.equal(Object.keys(api.FACTIONS).length,4);
 assert.equal(Object.keys(api.SYSTEMS).length,6);
 assert.equal(api.GATES.length,4);
 assert.equal(api.S.worldScaleVersion,4);
 assert.equal(api.S.saveVersion,20);
 assert.ok(api.STATIONS.some(s=>s.id==='concord'&&s.x===96000&&s.y===57600));
 assert.ok(api.ZONES.some(z=>z.contested&&z.x1===84800));
});

test('v0.14 pilot saves migrate position and all existing outposts only once',()=>{
 const old={system:'orion',x:11000,y:5100,credits:1600,worldScaleVersion:undefined,
  outposts:[{id:'old',system:'orion',x:4000,y:5500,modules:{storage:1},hold:{moon:8}}],faction:'solar'};
 const {api}=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(old)});
 assert.equal(api.S.x,44000);assert.equal(api.S.y,20400);
 assert.equal(api.S.outposts[0].x,16000);assert.equal(api.S.outposts[0].y,22000);
 assert.equal(api.S.outposts[0].modules.storage,1);
 assert.equal(api.S.credits,1600);
 const {api:again}=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(api.S)});
 assert.equal(again.S.x,44000);assert.equal(again.S.outposts[0].x,16000);
});

test('free Pioneer Charter unlocks a separate solar system with a dockable base and safe return',()=>{
 const {api}=bootWarp(read());api.S.credits=500;
 const before={system:api.S.system,x:api.S.x,y:api.S.y};
 api.warpClaim();assert.equal(api.S.colony.owned,true);assert.equal(api.S.credits,500);
 api.warpHomeWarp();assert.equal(api.S.system,'homestead');assert.equal(api.S.colony.visits,1);
 assert.equal(api.asteroids.length>40,true);assert.equal(api.drones.length,0);
 api.updateShip(.01);assert.equal(api.currentStation().id,'pioneer_hq');
 assert.ok(api.WARP_STAR.x===96000&&api.WARP_STAR.y===57600);
 api.warpLeave();assert.equal(api.S.system,before.system);
 assert.equal(api.S.x,before.x);assert.equal(api.S.y,before.y);
});

test('finite SC/ore purchases, powered extraction, warehouse transfer and unique planet customization',()=>{
 const {api,elem,current}=bootWarp(read());api.warpClaim();api.S.credits=7500;api.S.ore.moon=100;api.S.ore.neon=50;
 const old=api.S.credits;
 api.warpUpgrade('extractor');assert.equal(api.S.colony.modules.extractor,1);assert.ok(api.S.credits<old);
 api.warpHomeWarp();api.updateShip(.01);
 api.S.ore.moon=0;api.S.ore.neon=0;
 api.S.colony.lastTick=current.now-90_000*4;
 const SC=api.S.credits,qty=api.warpProduction(current.now);
 assert.equal(qty,4);assert.equal(api.S.colony.stored.moon,4);assert.equal(api.S.credits,SC-8);
 assert.equal(api.warpProduction(current.now),0,'same timestamp must not produce twice');
 api.warpLoad('moon');assert.equal(api.S.colony.stored.moon,0);assert.equal(api.S.ore.moon,4);
 api.warpDeposit('moon');assert.equal(api.S.colony.stored.moon,4);assert.equal(api.S.ore.moon,0);
 const style=api.S.colony.planets[0].style;api.warpPlanetChange(0,'style');assert.notEqual(api.S.colony.planets[0].style,style);
 elem('warpBaseName').value='My Fortress';elem('warpStarName').value='Lyra Prime';elem('warpBaseColor').value='#39affe';api.warpRename();
 assert.equal(api.S.colony.name,'My Fortress');assert.equal(api.S.colony.star,'Lyra Prime');
 assert.ok(api.warpStoreCap()<1e4);
});

test('private system does not connect ordinary gates and galaxy price panel remains simulated',()=>{
 const {api,elem}=bootWarp(read());api.warpClaim();api.warpHomeWarp();
 assert.equal(api.SYSTEMS.homestead.name,'Pioneer System');
 api.renderUI(true);api.draw();api.warpRenderEconomy();
 assert.ok(elem('warpEconomyContent').innerHTML.includes('Galactic Supply Board'));
 assert.ok(elem('warpEconomyContent').innerHTML.includes('SC'));
 assert.ok(elem('warpColonyContent').innerHTML.includes('Solar Array'));
 assert.ok(elem('warpColonyContent').innerHTML.includes('Planetary atlas'));
 assert.equal(api.warpRadar(new Proxy({save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},arc(){},fill(){}},{get:(o,k)=>o[k]||(()=>{})}),{x:0,y:0,w:100,h:65}),true);
});

test('a saved colony reopens inside the private system without regenerating the charter',()=>{
 const {api,store}=bootWarp(read());api.warpClaim();api.warpHomeWarp();api.S.colony.name='Persistent Frontier';
 // Local save persists the owner, planet designs and their exact world scale.
 store.set('tokenverse-deep-space-v10',JSON.stringify(api.S));
 const next=bootWarp(read(),{'tokenverse-deep-space-v10':store.get('tokenverse-deep-space-v10')});
 assert.equal(next.api.S.system,'homestead');assert.equal(next.api.S.colony.name,'Persistent Frontier');
 assert.equal(next.api.S.worldScaleVersion,4);assert.equal(next.api.S.colony.visits,1);
 next.api.renderUI(true);next.api.draw();
});

test('colony extraction cannot create free credits and respects warehouse and operating capital',()=>{
 const {api,current}=bootWarp(read());api.warpClaim();api.S.credits=2000;api.S.ore.moon=100;api.S.ore.neon=100;
 api.warpUpgrade('extractor');api.warpUpgrade('solar');api.warpUpgrade('extractor');
 api.S.colony.lastTick=current.now-90_000*600;
 const before=api.S.credits;const amount=api.warpProduction(current.now);
 assert.ok(amount>0 && amount<=api.warpStoreCap());
 assert.ok(api.S.credits<before);
 const value=api.warpStoredCount();assert.equal(value,amount);
 assert.equal(api.warpProduction(current.now),0);
 api.S.credits=0;api.S.colony.lastTick=current.now-90_000*5;
 assert.equal(api.warpProduction(current.now),0,'production requires SC operating costs');
 assert.equal(api.warpStoredCount(),value);
});