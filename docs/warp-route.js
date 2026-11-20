/* v0.20: safe multi-waypoint warp hops along the established obstacle-aware autopilot route. */
(function(root){
 'use strict';
 function nextHop(from,waypoints,step,{maxRange=8500,endpointGap=650,isClear=()=>true}={}){
  if(!from||!Array.isArray(waypoints)||!waypoints.length||!Number.isFinite(from.x)||!Number.isFinite(from.y))return null;
  const range=Math.max(0,Math.min(8500,Number(maxRange)||0));if(range<250)return null;
  let cursor={x:from.x,y:from.y},covered=0,index=Math.max(0,Math.floor(Number(step)||0));
  if(index>=waypoints.length)return null;
  for(let i=index;i<waypoints.length;i++){
   const p=waypoints[i];
   if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))break;
   const dx=p.x-cursor.x,dy=p.y-cursor.y,len=Math.hypot(dx,dy);
   if(len<1){index=i+1;continue;}
   const last=i===waypoints.length-1;
   const stepMax=Math.min(range-covered,Math.max(0,len-(last?endpointGap:0)));
   if(stepMax<1)break;
   let amount=stepMax;
   let end={x:cursor.x+dx*amount/len,y:cursor.y+dy*amount/len};
   // Shorten the hop when a moving hazard blocks the full planned segment.
   while(amount>=200&&!isClear(cursor,end)){
     amount*=.5;end={x:cursor.x+dx*amount/len,y:cursor.y+dy*amount/len};
   }
   if(amount<200)break;
   covered+=amount;
   cursor=end;
   index=amount>=len-.01&&!last?i+1:i;
   if(amount<len-.01||covered>=range-1)break;
  }
  if(covered<250)return null;
  return {x:cursor.x,y:cursor.y,distance:covered,nextStep:Math.min(index,waypoints.length-1)};
 }
 root.WarpRoute=Object.freeze({nextHop});
})(typeof globalThis!=='undefined'?globalThis:this);
