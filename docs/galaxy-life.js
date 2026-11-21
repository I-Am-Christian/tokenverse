/* Warp Coin v0.25 — zoom, local traffic and modular weapon behaviour.
 * No dependencies, backend or real cryptocurrency.
 */
(function(root){
'use strict';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function zoom(value){return Number.isFinite(Number(value))?clamp(Number(value),.36,2.4):1;}
function wheelZoom(current,delta){return zoom(zoom(current)*(delta>0?.86:1.16));}
function screenToWorld(px,py,ship,width,height,z=1){
 const factor=zoom(z);return {x:ship.x+(px-width/2)/factor,y:ship.y+(py-height/2)/factor};
}
function visible(px,py,width,height,z=1,margin=100){
 const extent=zoom(z),mx=width/(2*extent)+margin,my=height/(2*extent)+margin;
 return Math.abs(px-width/2)<=mx&&Math.abs(py-height/2)<=my;
}
const ROLES=Object.freeze([
 {id:'trader',title:'MERCHANT',color:'#9de8f4',speed:105,scale:1.25,hp:120,friendly:true},
 {id:'miner',title:'PROSPECTOR',color:'#9bf0c2',speed:75,scale:1.5,hp:145,friendly:true},
 {id:'escort',title:'SECURITY',color:'#86b8ff',speed:150,scale:1.15,hp:165,friendly:true},
 {id:'raider',title:'OUTLAW',color:'#ff879c',speed:164,scale:1.18,hp:115,friendly:false},
 {id:'freighter',title:'FREIGHTER',color:'#e5c394',speed:62,scale:2.4,hp:270,friendly:true}
]);
function role(id){return ROLES.find(r=>r.id===id)||ROLES[0];}
function spawnTraffic(ship,{count=26,quality='medium',isSafe=()=>false,random=Math.random,world={w:192000,h:115200},system='orion'}={}){
 const list=[],low=quality==='low',max=Math.max(0,Math.min(40,low?Math.round(count*.6):count));
 for(let i=0;i<max;i++){
  const theta=random()*TAU;
  const dist=200+Math.pow(random(),.9)*2350;
  const x=clamp(ship.x+Math.cos(theta)*dist,35,world.w-35);
  const y=clamp(ship.y+Math.sin(theta)*dist,35,world.h-35);
  const safe=!!isSafe(x,y);
  let kind=i%7===0?'freighter':i%7===1?'miner':i%7===2?'trader':i%7===3?'escort':i%7===4?'miner':i%7===5?'raider':'trader';
  if(system==='homestead'&&kind==='raider')kind='miner';
  if(safe&&kind==='raider')kind='escort';
  const desc=role(kind),angle=random()*TAU;
  list.push({id:'traffic-'+i,role:kind,system,x,y,anchorX:x,anchorY:y,
   vx:Math.cos(angle)*desc.speed*.26,vy:Math.sin(angle)*desc.speed*.26,angle,
   size:desc.scale*(.85+random()*.4),color:desc.color,
   hp:desc.hp,maxHp:desc.hp,fire:1+random()*1.9,phase:random()*TAU,
   model:i%3,oreBeam:0});
 }
 return list;
}
function trafficIntent(bot,ship,hostiles=[],dt=.016){
 const type=role(bot.role);
 const near=hostiles.find(e=>e.role==='raider'&&e.hp>0&&e!==bot&&Math.hypot(e.x-bot.x,e.y-bot.y)<620);
 let target=null;
 if(bot.role==='raider'&&Math.hypot(ship.x-bot.x,ship.y-bot.y)<880)target=ship;
 else if(bot.role==='escort'&&near)target=near;
 const dx=target?target.x-bot.x:bot.anchorX+Math.cos(bot.phase)*240-bot.x;
 const dy=target?target.y-bot.y:bot.anchorY+Math.sin(bot.phase)*240-bot.y;
 const d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;
 const prefer=bot.role==='raider'?295:bot.role==='escort'?220:30;
 const toward=target?clamp((d-prefer)/170,-.8,1):clamp(d/350,-.5,1);
 const orbit=target?(bot.role==='raider'?.64:.26):.19;
 const ax=(nx*toward-ny*orbit)*type.speed*2;
 const ay=(ny*toward+nx*orbit)*type.speed*2;
 return {ax,ay,angle:Math.atan2(dy,dx),target,fire:!!target&&d<560};
}
function missileStep(projectile,target,dt){
 if(!projectile||!target||!(dt>0))return false;
 const speed=Math.max(100,Math.hypot(projectile.vx||0,projectile.vy||0));
 const desired=Math.atan2(target.y-projectile.y,target.x-projectile.x);
 const current=Math.atan2(projectile.vy||0,projectile.vx||0);
 const delta=Math.atan2(Math.sin(desired-current),Math.cos(desired-current));
 const angle=current+clamp(delta,-dt*3.1,dt*3.1);
 projectile.vx=Math.cos(angle)*speed;projectile.vy=Math.sin(angle)*speed;
 return true;
}
function chooseMissileTarget(projectile,drones,bots,limit=650){
 let found=null,best=limit;
 for(const d of drones||[]){if(d.hp<=0)continue;const range=Math.hypot(d.x-projectile.x,d.y-projectile.y);
  if(range<best){best=range;found=d;}}
 for(const d of bots||[]){if(d.role!=='raider'||d.hp<=0)continue;
  const range=Math.hypot(d.x-projectile.x,d.y-projectile.y);if(range<best){best=range;found=d;}}
 return found;
}
function weaponDamage(gun,level=1){return Math.max(1,Math.round((gun?.damage||1)*(1+.2*(Math.max(1,level)-1))));}
root.WarpGalaxyLife=Object.freeze({zoom,wheelZoom,screenToWorld,visible,role,ROLES,spawnTraffic,trafficIntent,missileStep,chooseMissileTarget,weaponDamage});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
