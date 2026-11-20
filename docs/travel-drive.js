/* Warp Coin 0.18: local flight assistance only. No network, wallets or database. */
(function installTravelDrive(root){
  'use strict';
  const CFG=Object.freeze({
    minCruiseDistance:2600, maxCruiseSpeed:8200, minCruiseSpeed:3600,
    pulseMaxRange:8500, pulseEndpointGap:650, pulseEnergy:28,
    pulseCooldownMs:9000
  });
  const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
  const finitePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
  const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
  function cruiseSpeed(distanceToWaypoint,shipSpeed,thrusterLevel,safe){
    if(!safe||!Number.isFinite(distanceToWaypoint)||distanceToWaypoint<CFG.minCruiseDistance)return 0;
    const factor=clamp(Number(shipSpeed)||1,.68,1.6);
    const level=clamp(Math.floor(Number(thrusterLevel)||1),1,5);
    return clamp((6000+350*(level-1))*factor,CFG.minCruiseSpeed,CFG.maxCruiseSpeed);
  }
  function pulseDestination(from,to){
    if(!finitePoint(from)||!finitePoint(to))return null;
    const d=distance(from,to);
    if(d<CFG.minCruiseDistance)return null;
    const travel=Math.min(CFG.pulseMaxRange,Math.max(0,d-CFG.pulseEndpointGap));
    if(travel<900)return null;
    const u=travel/d;
    return {x:from.x+(to.x-from.x)*u,y:from.y+(to.y-from.y)*u,distance:travel};
  }
  function segmentNearPoint(a,b,p,clearance){
    if(!finitePoint(a)||!finitePoint(b)||!finitePoint(p))return true;
    const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy;
    const t=len>0?clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/len,0,1):0;
    return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<clearance;
  }
  function corridorDanger(a,b,actors,clearance){
    return Array.isArray(actors)&&actors.some(p=>segmentNearPoint(a,b,p,clearance));
  }
  root.WarpTravelDrive=Object.freeze({CFG,cruiseSpeed,pulseDestination,segmentNearPoint,corridorDanger});
})(typeof globalThis!=='undefined'?globalThis:this);
