/* Warp Coin v0.26 — deterministic worlds with bounded persistent NPC fleets.
 * All persistence is local to the player's existing browser save; no server.
 */
(function(root){
'use strict';
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hash(str){
 let v=2166136261;for(let i=0;i<String(str).length;i++){
  v^=String(str).charCodeAt(i);v=Math.imul(v,16777619);
 }return v>>>0;
}
function rng(seed){
 let x=(typeof seed==='string'?hash(seed):seed>>>0)||1;
 return ()=>{x+=0x6d2b79f5;let t=x;t=Math.imul(t^(t>>>15),t|1);
 t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
const ROLE_ORDER=['trader','escort','miner','freighter','trader','raider','miner','escort'];
function makeFleet({system='orion',world={w:192000,h:115200},origin={x:900,y:900},
 stations=[],isSafe=()=>false}={}){
 const r=rng('warp26-fleet-'+system),count=system==='homestead'?4:8;
 const bots=[];
 for(let i=0;i<count;i++){
  let role=ROLE_ORDER[i];if(system==='homestead'&&role==='raider')role='escort';
  const nearStart=i<2;
  const station=stations.length?stations[(i-2+stations.length)%stations.length]:null;
  const center=nearStart?origin:station||{x:world.w*.5,y:world.h*.5};
  const angle=r()*TAU,dist=nearStart?350+r()*470:500+r()*1400;
  const x=clamp(center.x+Math.cos(angle)*dist,70,world.w-70);
  const y=clamp(center.y+Math.sin(angle)*dist,70,world.h-70);
  if(isSafe(x,y)&&role==='raider')role='escort';
  const hp=role==='freighter'?270:role==='escort'?165:role==='miner'?145:role==='raider'?115:120;
  const vx=(r()-.5)*35,vy=(r()-.5)*35;
  bots.push({id:'fleet-'+system+'-'+i,role,system,x,y,anchorX:x,anchorY:y,
   vx,vy,angle:r()*TAU,size:role==='freighter'?2.2:role==='miner'?1.5:1.15,
   color:role==='raider'?'#f78a9f':'#9ed8e8',
   hp,maxHp:hp,fire:1+r()*2,phase:r()*TAU,model:i%3,hiredUntil:0,oreBeam:0});
 }
 return bots;
}
function validFleet(list,system,world={w:192000,h:115200}){
 if(!Array.isArray(list))return false;
 if(list.length>8)return false;
 return list.every(b=>b&&typeof b.id==='string'&&b.system===system&&
  ['trader','escort','miner','freighter','raider'].includes(b.role)&&
  Number.isFinite(b.x)&&Number.isFinite(b.y)&&Number.isFinite(b.anchorX)&&Number.isFinite(b.anchorY)&&
  b.x>=0&&b.x<=world.w&&b.y>=0&&b.y<=world.h&&Number.isFinite(b.hp));
}
function fleetFor(state,options={}){
 const system=options.system||'orion',world=options.world||{w:192000,h:115200};
 if(!state.npcFleet||typeof state.npcFleet!=='object'||Array.isArray(state.npcFleet))state.npcFleet={};
 let saved=state.npcFleet[system];
 if(!validFleet(saved,system,world)){
  saved=makeFleet({...options,system,world});state.npcFleet[system]=saved;
 }
 return saved;
}
function debrisFor({system='orion',origin={x:0,y:0},range=3000,cell=850}={}){
 const minX=Math.floor((origin.x-range)/cell),maxX=Math.floor((origin.x+range)/cell),
       minY=Math.floor((origin.y-range)/cell),maxY=Math.floor((origin.y+range)/cell);
 const results=[];
 for(let ix=minX;ix<=maxX;ix++)for(let iy=minY;iy<=maxY;iy++){
  const r=rng('warp26-debris-'+system+'-'+ix+','+iy);
  const count=2+(r()>.5?1:0);
  for(let j=0;j<count;j++)results.push({id:system+':'+ix+':'+iy+':'+j,
   x:(ix+r())*cell,y:(iy+r())*cell,
   kind:['dust','probe','wreck','crystal','dust','rocks'][Math.floor(r()*6)],
   rotation:r()*TAU,r:6+r()*13});
 }
 return results;
}
function applyOre(asteroids,changes={}){
 for(const a of asteroids){
  const v=changes[String(a.id)];
  if(Number.isInteger(v)&&v>=0)a.ore=Math.min(a.ore,v);
 }
 return asteroids;
}
root.WarpPersistentWorld=Object.freeze({hash,rng,makeFleet,validFleet,fleetFor,debrisFor,applyOre,ROLE_ORDER});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
