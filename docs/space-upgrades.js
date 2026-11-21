/* Warp Coin v0.24: pure helpers for salvage, evasive dash and smarter NPC flight.
   Client-only, no crypto transactions or new server dependencies. */
(function(root){
 'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function rollDrop({x,y,tier=1,boss=false,patrol=false,pirate=false,random=Math.random,now=Date.now}={}){
  if(!Number.isFinite(x)||!Number.isFinite(y))return null;
  const level=clamp(Math.floor(Number(tier)||1),1,8),r=clamp(Number(random())||0,0,.9999999);
  let type,amount,kind;
  if(boss||r>.94){type='fragment';amount=boss?Math.min(6,2+Math.floor(level/2)):1;}
  else if(r>.65){type='ore';kind=level>=5?'diam':level>=3?'dust':level>=2?'neon':'moon';amount=boss?3:1;}
  else {type='credits';amount=Math.round(8+level*6+(pirate?8:0)+(patrol?3:0)+(boss?80:0));}
  return {x,y,type,kind,amount,tier:level,life:boss?240:165,
    createdAt:Number(now())||0,radius:20};
 }
 function pickup(drop,{cargo=0,capacity=30}={}){
  if(!drop||!['credits','ore','fragment'].includes(drop.type))return null;
  if(drop.type==='ore'&&cargo+drop.amount>capacity)return null;
  return {type:drop.type,kind:drop.kind||null,amount:Math.max(1,Math.floor(drop.amount||1))};
 }
 function dash({energy=100,lastDashAt=0,now=Date.now(),inSafeZone=false,inRift=false,
   angle=0,blocked=false}={}){
  const cost=22,cooldown=13500,duration=650,impulse=400;
  if(inRift||inSafeZone||blocked||energy<cost||now-lastDashAt<cooldown)return null;
  return {energyCost:cost,lastDashAt:now,dashUntil:now+duration,
    vx:Math.cos(angle)*impulse,vy:Math.sin(angle)*impulse,cooldown,duration};
 }
 function droneIntent(drone,ship,{safe=false,dt=.016}={}){
  const dx=ship.x-drone.x,dy=ship.y-drone.y,dist=Math.hypot(dx,dy)||1;
  const nx=dx/dist,ny=dy/dist,tier=Math.max(1,drone.tier||1);
  const aggressive=!!drone.pirateEncounter||tier>=3;
  const phase=Number(drone.maneuverPhase)||0;
  const side=Math.sin(phase)>.0?1:-1;
  const preferred=aggressive?345:220;
  if(dist>=960||safe)return {engaged:false,dist,angle:drone.angle||0,ax:Math.cos(drone.angle||0)*14,ay:Math.sin(drone.angle||0)*14};
  const force=70+tier*12;
  const headroom=clamp((dist-preferred)/150,-1.0,1.0);
  const strafe=aggressive?.73:.17;
  const orbit=side*force*strafe;
  // Pirates circle the target; when the player retreats they close in again.
  const ax=nx*force*headroom-ny*orbit;
  const ay=ny*force*headroom+nx*orbit;
  return {engaged:true,dist,angle:Math.atan2(dy,dx),ax,ay};
 }
 function leadAngle(shooter,target,projectileSpeed=400,skill=1){
  const speed=Math.max(1,Number(projectileSpeed)||1);
  const dx=target.x-shooter.x,dy=target.y-shooter.y;
  const lead=clamp(Math.hypot(dx,dy)/speed*.4*Math.max(0,skill),0,.44);
  return Math.atan2(dy+(target.vy||0)*lead,dx+(target.vx||0)*lead);
 }
 function near(point,origin,radius=85){return Math.hypot(point.x-origin.x,point.y-origin.y)<=radius;}
 root.WarpGameplay24=Object.freeze({rollDrop,pickup,dash,droneIntent,leadAngle,near});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
