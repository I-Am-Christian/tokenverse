import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx={};
vm.runInNewContext(fs.readFileSync(new URL('../docs/travel-drive.js',import.meta.url),'utf8'),ctx);
const drive=ctx.WarpTravelDrive;
const wr={};vm.runInNewContext(fs.readFileSync(new URL('../docs/warp-route.js',import.meta.url),'utf8'),wr);
const warpRoute=wr.WarpRoute;

function bootWarp(html, starting=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
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
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,WarpTravelDrive:drive,WarpRoute:warpRoute},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}


const readRoot=()=>fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const readDocs=()=>fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
test('public GitHub Pages root and docs both serve v0.20 and resolve every required module',()=>{
 const root=readRoot(),docs=readDocs();
 assert.match(root,/<title>Warp Coin v0\.23/);
 assert.match(docs,/<title>Warp Coin v0\.23/);
 for(const module of ['trade-route-engine','travel-drive','frontier-encounters','warp-route','space-audio','space-visuals']){
  assert.ok(root.includes('src="./docs/'+module+'.js"'),module+' available from root');
  assert.ok(docs.includes('src="./'+module+'.js"'),module+' available from docs');
  assert.ok(fs.existsSync(new URL('../docs/'+module+'.js',import.meta.url)));
 }
 assert.equal(root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
              docs.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1],
              'Both HTML entries run identical gameplay code');
});
test('warp cruise engages on shorter safe corridor segments than the old drive',()=>{
 assert.equal(drive.cruiseSpeed(1200,1,1,true),6000);
 assert.equal(drive.cruiseSpeed(700,1,1,true),0);
 assert.equal(drive.cruiseSpeed(60000,1,3,false),0);
});
test('multi-waypoint warp follows the routed bends, respects maximum range and endpoint gap',()=>{
 const path=[{x:1000,y:0},{x:4000,y:0},{x:10000,y:0}];
 const hop=warpRoute.nextHop({x:0,y:0},path,0,{isClear:()=>true});
 assert.ok(hop);
 assert.equal(hop.distance,8500);
 assert.equal(hop.x,8500);
 assert.equal(hop.nextStep,2);
 const turn=warpRoute.nextHop({x:0,y:0},[{x:1200,y:0},{x:1200,y:4000},{x:1200,y:10000}],0,{isClear:()=>true});
 assert.ok(turn.x===1200&&turn.y>0,'warp follows a dogleg rather than skipping diagonally across hazards');
});
test('blocked corridor never teleports through an obstacle or overspends travel budget',()=>{
 const blocked=(a,b)=>!(a.x<=2250&&b.x>=2250);
 const path=[{x:1000,y:0},{x:4500,y:0},{x:10000,y:0}];
 const hop=warpRoute.nextHop({x:0,y:0},path,0,{isClear:blocked});
 assert.ok(hop&&hop.x<2250,'stops before impassable asteroid');
 assert.ok(hop.distance<8500);
 assert.equal(warpRoute.nextHop({x:0,y:0},[{x:100,y:0}],0,{isClear:()=>true}),null);
});
test('Warp Drive button plots a flight route from spawn without prior manual targeting',()=>{
 const {api}=bootWarp(readRoot());
 assert.deepEqual([api.WORLD.w,api.WORLD.h],[192000,115200]);
 assert.equal(api.S.saveVersion,20);
 assert.equal(api.S.settings.warpDriveEnabled,true);
 assert.equal(api.autopilot,null);
 api.warp20ToggleDrive();
 assert.ok(api.autopilot);
 assert.ok(api.autopilot.path.length>0);
 assert.equal(api.S.system,'orion');
});
test('root and docs both retain the original full-sized game and old local save key',()=>{
 const {api,store}=bootWarp(readRoot(),{'tokenverse-deep-space-v10':JSON.stringify({
  system:'borealis',credits:1245,worldScaleVersion:4,x:58000,y:52000,saveVersion:16,ore:{moon:4}
 })});
 assert.equal(api.S.credits,1245);
 assert.equal(api.S.ore.moon,4);
 assert.equal(api.S.worldScaleVersion,4);
 assert.equal(api.S.saveVersion,20);
 assert.ok(store.has('tokenverse-deep-space-v10'));
});
test('audio module remains silent until the user enables it and handles unavailable Web Audio',()=>{
 const sandbox={};
 vm.runInNewContext(fs.readFileSync(new URL('../docs/space-audio.js',import.meta.url),'utf8'),sandbox);
 const audio=sandbox.WarpAudio.create();
 assert.equal(audio.available(),false);
 assert.equal(audio.isEnabled(),false);
 assert.equal(audio.enable(),false);
 assert.doesNotThrow(()=>audio.event('warp'));
 audio.update({cruising:true});
 assert.equal(audio.isEnabled(),false);
});
test('audio and graphics engines parse and export the expected features',()=>{
 const gfx={};
 const source=fs.readFileSync(new URL('../docs/space-visuals.js',import.meta.url),'utf8');
 vm.runInNewContext(source,gfx);
 assert.equal(typeof gfx.WarpVisuals.starfield,'function');
 assert.equal(typeof gfx.WarpVisuals.backdrop,'function');
 assert.equal(typeof gfx.WarpVisuals.thruster,'function');
 const base={save(){},restore(){},fillRect(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},
    lineTo(){},translate(){},rotate(){},ellipse(){},closePath(){},
    createRadialGradient(){return {addColorStop(){}}},createLinearGradient(){return {addColorStop(){}}}};
 assert.equal(gfx.WarpVisuals.starfield(base,{w:1280,h:720,x:24000,y:40000,quality:'low'}),true);
 assert.equal(gfx.WarpVisuals.backdrop(base,{w:1280,h:720,quality:'low'}),false);
 assert.doesNotThrow(()=>gfx.WarpVisuals.backdrop(base,{w:1280,h:720,system:'helios',quality:'medium'}));
 assert.doesNotThrow(()=>gfx.WarpVisuals.thruster(base,{w:1280,h:720,angle:1,speed:4000,active:true,cruising:true}));
});
