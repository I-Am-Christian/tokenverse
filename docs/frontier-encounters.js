/* Warp Coin v0.19 — solo, deterministic event rules. No backend or real-money assets. */
(function installFrontierEncounters(root){
 'use strict';
 const TYPES=Object.freeze(['wreck','distress','pirates','cache']);
 const LABELS=Object.freeze({wreck:'Abandoned salvage',distress:'Distress transmission',pirates:'Pirate ambush',cache:'Eidon relic signature'});
 const MAX_TRAVEL_STEP=1250;
 const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
 function distanceStep(last,now){
  if(!finite(last)||!finite(now)||last.system!==now.system)return 0;
  const distance=Math.hypot(now.x-last.x,now.y-last.y);
  return Number.isFinite(distance)&&distance<=MAX_TRAVEL_STEP?distance:0;
 }
 function encounterType(ordinal){return TYPES[Math.abs(Math.floor(Number(ordinal)||0))%TYPES.length];}
 function candidatePositions(player,direction,world){
  if(!finite(player)||!world)return [];
  const phi=Number.isFinite(direction)?direction:0;
  const candidates=[];
  for(let i=0;i<16;i++){
   const offset=[0,.38,-.38,.75,-.75,1.12,-1.12,1.58,-1.58][i%9];
   const length=1100+(i%4)*240;
   const a=phi+offset;
   const x=player.x+Math.cos(a)*length,y=player.y+Math.sin(a)*length;
   if(x>1800&&x<world.w-1800&&y>1800&&y<world.h-1800)candidates.push({x,y});
  }
  return candidates;
 }
 function qualifies(player,position,{isSafe,obstacles=[],stations=[],pathClear}={}){
  if(!finite(player)||!finite(position)||typeof isSafe!=='function')return false;
  if(isSafe(position.x,position.y)||isSafe(player.x,player.y))return false;
  if(stations.some(p=>finite(p)&&Math.hypot(position.x-p.x,position.y-p.y)<1600))return false;
  if(obstacles.some(p=>p.ore>0&&finite(p)&&Math.hypot(position.x-p.x,position.y-p.y)<(p.r||15)+210))return false;
  if(pathClear&&!pathClear(player,position))return false;
  return true;
 }
 function choosePosition(player,direction,world,environment){
  return candidatePositions(player,direction,world).find(p=>qualifies(player,p,environment))||null;
 }
 root.WarpFrontierEncounters=Object.freeze({TYPES,LABELS,distanceStep,encounterType,candidatePositions,qualifies,choosePosition});
})(typeof globalThis!=='undefined'?globalThis:this);
