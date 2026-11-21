/* Warp Coin v0.23 — local daily field contracts.
 * No real-world money, remote accounts or server calls.
 * Offers are generated only from game progress and reset on the UTC day.
 */
(function(root){
 'use strict';
 const SPECS=[
  {id:'bounty',kind:'kill',title:'Clear the Space Lanes',description:'Destroy hostile drones or rival combatants.',color:'#ff91ae',base:2,sc:140,xp:34,cap:5},
  {id:'prospector',kind:'mine',title:'Prospector Run',description:'Mine ore directly from asteroid deposits.',color:'#8df2cc',base:5,sc:115,xp:28,cap:12},
  {id:'signals',kind:'scan',title:'Survey the Unknown',description:'Use your anomaly scanner to map space.',color:'#8dcfff',base:2,sc:105,xp:26,cap:4}
 ];
 function day(date=Date.now()){return new Date(date).toISOString().slice(0,10);}
 function number(v){return Number.isFinite(v)?Math.max(0,Math.floor(v)):0;}
 function make(date=Date.now(),level=1){
  const tier=Math.min(4,Math.floor(Math.max(0,(Number(level)||1)-1)/5));
  return {date:day(date),offers:SPECS.map(spec=>({
   id:spec.id,kind:spec.kind,goal:Math.min(spec.cap,spec.base+(spec.id==='signals'?0:tier)),
   progress:0,claimed:false,
   credits:spec.sc+tier*35,xp:spec.xp+tier*8
  }))};
 }
 function restore(previous,date=Date.now(),level=1){
  const expected=make(date,level);
  if(!previous||previous.date!==expected.date||!Array.isArray(previous.offers))return expected;
  return {...expected,offers:expected.offers.map(offer=>{
   const old=previous.offers.find(x=>x&&x.id===offer.id);
   return old?{...offer,progress:Math.min(offer.goal,number(old.progress)),claimed:old.claimed===true}:offer;
  })};
 }
 function record(board,kind,amount=1){
  if(!board||!Array.isArray(board.offers))return false;
  let changed=false;
  for(const offer of board.offers){
   if(offer.kind!==kind||offer.claimed||offer.progress>=offer.goal)continue;
   const next=Math.min(offer.goal,offer.progress+number(amount));
   if(next!==offer.progress){offer.progress=next;changed=true;}
  }
  return changed;
 }
 function claim(board,id){
  const offer=board?.offers?.find(x=>x.id===id);
  if(!offer||offer.claimed||offer.progress<offer.goal)return null;
  offer.claimed=true;
  return {credits:offer.credits,xp:offer.xp};
 }
 function spec(id){return SPECS.find(s=>s.id===id)||null;}
 function completeCount(board){return board?.offers?.filter(x=>x.progress>=x.goal&&!x.claimed).length||0;}
 root.WarpContracts=Object.freeze({make,restore,record,claim,spec,completeCount,day,SPECS});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
