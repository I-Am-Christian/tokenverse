import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

/* Test-only evaluator for the standalone Tokenverse browser client. */
function factionSmoke(html){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const script=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,WORLD,ZONES,FACTIONS,STATIONS,SYSTEMS,GATES,SHIPS,GUNS,factionTerritoryAt,factionJoin,factionClaimMission,factionMission,factionSafeAt,factionHomeRoute,spawnFactionPatrols,updateFactionPatrols,currentZone,currentStation,canDock,planRoute,segmentClear,updateShip,updateAim,updateAsteroidCollision,renderFactionUI,renderUI,spawnWorld,extScan,get factionPatrols(){return factionPatrols},get autopilot(){return autopilot},get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
 let seq=0;const elements=new Map();const noop=()=>{};
 const graph=new Proxy({createRadialGradient(){return {addColorStop(){}}},createLinearGradient(){return {addColorStop(){}}}}, {get(o,k){return o[k]||noop},set(o,k,v){o[k]=v;return true}});
 function elem(id){if(!elements.has(id)){
   const state=new Set();
   const cls={add(n){state.add(n)},remove(n){state.delete(n)},contains(n){return state.has(n)},toggle(n,v){if(v===undefined?v:!!v)state.add(n);else state.delete(n);return state.has(n)}};
   elements.set(id,{id,innerHTML:'',textContent:'',value:'',style:{},disabled:false,classList:cls,children:[],setAttribute:noop,getAttribute:()=>'',closest:()=>null,addEventListener:noop,getBoundingClientRect(){return {left:0,top:0,right:1300,width:1920,height:1080}},getContext(){return graph},appendChild:noop,removeChild:noop,prepend:noop});
 }return elements.get(id)}
 const document={getElementById:elem,querySelectorAll:()=>[],createElement:()=>elem('div_'+(++seq))};
 const localStore=new Map();const storage={getItem:k=>localStore.get(k)||null,setItem:(k,v)=>localStore.set(k,v),removeItem:k=>localStore.delete(k)};
 const ctx={devicePixelRatio:1,AudioContext:class{},webkitAudioContext:class{}};
 const now={value:1000};
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm',script)(document,ctx,storage,noop,noop,1920,1080,noop,noop,{now:()=>now.value},{randomUUID:()=>String(++seq)},()=>true);
 const assert=(v,m)=>{if(!v)throw Error(m)};
 const result={};
 assert(Object.keys(api.FACTIONS).length===4,'missing 4 factions');
 assert(api.WORLD.w===192000&&api.WORLD.h===115200,'world not fourfold');
 result.world=[api.WORLD.w,api.WORLD.h];result.factions=Object.keys(api.FACTIONS);
 result.stations=api.STATIONS.length;result.ships=Object.keys(api.SHIPS).length;result.guns=Object.keys(api.GUNS).length;
 assert(result.ships===40&&result.guns===14,'existing ships/guns overwritten');
 assert(elem('factionSelectModal').classList.contains('open'),'first-join UI not shown');
 for(const [id,f] of Object.entries(api.FACTIONS)){
  assert(api.factionTerritoryAt(f.home.x,f.home.y)?.id===id,'territory ownership mismatch '+id);
  assert(api.factionSafeAt(f.home.x,f.home.y),'home base not protected '+id);
  assert(api.STATIONS.some(st=>st.faction===id),'no base station for '+id);
 }
 assert(api.currentZone({x:96000,y:56000}).name.includes('Concord')||api.currentZone({x:96000,y:56000}).name.includes('Disputed'),'center not contested/neutral');
 api.S.credits=1500;api.S.ore.neon=3;api.factionJoin('solar');
 assert(api.S.faction==='solar','join failed');
 assert(!elem('factionSelectModal').classList.contains('open'),'join did not close selection');
 assert(Math.hypot(api.S.x-api.FACTIONS.solar.home.x,api.S.y-api.FACTIONS.solar.home.y)<200,'did not spawn at faction home');
 assert(api.S.credits===1500&&api.S.ore.neon===3,'membership changed inventory');
 api.updateShip(.03);
 assert(api.currentStation()?.faction==='solar','cannot dock at friendly home');
 api.S.x=api.FACTIONS.crimson.home.x;api.S.y=api.FACTIONS.crimson.home.y;api.S.vx=api.S.vy=0;
 assert(!api.currentStation(),'enemy faction allows dock');
 const credits=api.S.credits;api.factionJoin('crimson');
 assert(api.S.faction==='solar'&&api.S.credits===credits,'faction switch outside neutral port was accepted');
 api.S.x=api.WORLD.port.x;api.S.y=api.WORLD.port.y;api.S.vx=api.S.vy=0;api.factionJoin('verdant');
 assert(api.S.faction==='verdant'&&api.S.credits===credits-500,'neutral faction transfer did not cost 500 SC');
 const mission=api.factionMission();assert(mission.stat==='refined','wrong faction contract');
 api.S.stats.refined+=3;api.factionClaimMission();
 assert(api.S.factionReputation.verdant===13,'faction reputation not granted');
 assert(api.factionMission().progress===0,'contract did not reset progress');
 result.reputation=api.S.factionReputation.verdant;
 result.patrols=api.factionPatrols.length;assert(result.patrols===28,'missing faction patrols');
 assert(api.factionSafeAt(96000,57600),'neutral exchange not safe');
 // A short approach test within one region, rather than pathfinding the full 48k map in a UI unit test.
 api.S.x=9000;api.S.y=6650;const before=api.S.hp;
 const nav=api.planRoute({x:9000,y:6650},{x:10300,y:7600});
 assert(nav.length>0,'navigation broken in expanded territory');
 result.localRoute=nav.length;
 const distant=api.planRoute({x:9000,y:6600},{x:155600,y:26400});
 assert(distant.length>0,'long-distance faction navigation failed');
 result.longRoute=distant.length;
 return result;
}

test('four factions, protected home regions, reputation, docking, and world expansion', {timeout:20000}, () => {
 const html=fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
 const result=factionSmoke(html);
 assert.equal(result.factions.length,4);
 assert.equal(result.ships,40);
 assert.equal(result.guns,14);
 assert.equal(result.patrols,28);
 assert.deepEqual(result.world,[192000,115200]);
 assert.ok(result.longRoute>0);
});