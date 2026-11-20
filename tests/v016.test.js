import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function bootWarp(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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


test('v0.16 public maps are four times larger and offer neutral outer trade sanctuaries',()=>{
 const {api}=bootWarp(read());
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
 assert.equal(api.S.worldScaleVersion,4);
 assert.equal(api.S.saveVersion,20);
 assert.equal(api.DEEP_RIM_STATIONS.length,4);
 assert.equal(api.GATES.length,4);
 assert.equal(Object.keys(api.FACTIONS).length,4);
 for(const st of api.DEEP_RIM_STATIONS){
  assert.ok(st.x>0&&st.x<api.WORLD.w&&st.y>0&&st.y<api.WORLD.h);
  assert.equal(st.kind,'hub');
  assert.ok(api.STATIONS.some(p=>p.id===st.id));
 }
});

test('v0.15 pilot and outposts migrate once with unchanged balances',()=>{
 const old={system:'orion',x:62500,y:18000,vx:0,vy:0,worldScaleVersion:2,saveVersion:15,
    credits:1745,ore:{moon:5},faction:'solar',
    outposts:[{id:'legacy_station',system:'orion',x:10000,y:12000,modules:{storage:2},hold:{moon:7}}],
    colony:{owned:true,name:'My saved colony',returnTo:{system:'borealis',x:26000,y:20000}}};
 const {api,store}=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(old)});
 assert.equal(api.S.x,125000);assert.equal(api.S.y,36000);
 assert.equal(api.S.outposts[0].x,20000);assert.equal(api.S.outposts[0].y,24000);
 assert.equal(api.S.outposts[0].modules.storage,2);
 assert.equal(api.S.colony.returnTo.x,52000);assert.equal(api.S.colony.returnTo.y,40000);
 assert.equal(api.S.credits,1745);
 assert.equal(api.S.colony.name,'My saved colony');
 const reload=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(api.S)});
 assert.equal(reload.api.S.x,125000);
 assert.equal(reload.api.S.outposts[0].x,20000);
 assert.equal(reload.api.S.colony.returnTo.x,52000);
 assert.equal(reload.api.S.worldScaleVersion,4);
});

test('existing personal solar system retains local orbital position and customization',()=>{
 const old={system:'homestead',x:48800,y:28800,worldScaleVersion:2,saveVersion:15,
   colony:{owned:true,name:'Aurelia HQ',star:'Blue Lantern',visits:5,
   planets:[{name:'A1',style:0},{name:'B2',style:2},{name:'C3',style:3},{name:'D4',style:5}],
   returnTo:{system:'orion',x:50000,y:26000}}};
 const {api}=bootWarp(read(),{'tokenverse-deep-space-v10':JSON.stringify(old)});
 assert.equal(api.S.system,'homestead');
 assert.equal(api.S.x,96800);assert.equal(api.S.y,57600);
 assert.equal(api.WARP_HUB.x,96800);assert.equal(api.WARP_STAR.x,96000);
 assert.equal(api.S.colony.name,'Aurelia HQ');
 assert.equal(api.S.colony.planets[3].style,5);
 assert.equal(api.S.colony.returnTo.x,100000);
 assert.equal(api.S.colony.returnTo.y,52000);
 api.warpLeave();
 assert.equal(api.S.system,'orion');
 assert.equal(api.S.x,100000);
});

test('outer-meridian transit costs SC, requires docking, and enforces cooldown',()=>{
 const {api}=bootWarp(read());
 api.S.faction='solar';api.S.credits=500;
 const initial=api.S.x;
 api.warp16Transit('meridian_east');
 assert.equal(api.S.credits,500);
 assert.equal(api.S.x,initial);
 api.S.x=900;api.S.y=900;api.S.vx=0;api.S.vy=0;api.updateShip(.02);
 assert.ok(api.dockedStation);
 api.warp16Transit('meridian_north');
 assert.equal(api.S.credits,415);
 assert.equal(api.S.x,api.WORLD.w/2+110);
 assert.equal(api.S.y,7700);
 api.updateShip(.02);
 const before=api.S.x;
 api.warp16Transit('meridian_east');
 assert.equal(api.S.credits,460,'first visit to the Meridian station grants its one-time 45 SC discovery bonus');
 assert.equal(api.S.x,before);
});

test('outer trade belts contain mineable minerals far from the old sector center',()=>{
 const {api}=bootWarp(read());
 for(const hub of api.DEEP_RIM_STATIONS){
  const n=api.asteroids.filter(a=>a.ore>0&&Math.hypot(a.x-hub.x,a.y-hub.y)<10500).length;
  assert.ok(n>=65,hub.name+' has insufficient mining deposits: '+n);
 }
});
