import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
// The audited 'ws' module is preferred when installed. A small built-in fallback
// allows the demo to run without a network-dependent npm install.
let WebSocketServer,WebSocket;
try {({WebSocketServer,WebSocket}=await import('ws'));} catch {({WebSocketServer,WebSocket}=await import('./miniws.js'));}

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA = process.env.DATA_DIR || path.join(ROOT,'data');
const SAVEFILE = path.join(DATA, 'world.json');
const PORT = Number(process.env.PORT) || 3000;
const WIDTH = 2600, HEIGHT = 1800, CX = WIDTH/2, CY = HEIGHT/2, SAFE = 240;
const TYPES = ['moon','neon','dust','void'];
const DEFINITIONS = {
  moon: {name:'Moonstone', ticker:'MOON', color:'#91b9ff', cap:null, poolTokens:4000, poolCredits:84000, reserve:140000, day:5000, personal:100, ore:4, payout:2, fee:3, rawPrice:7},
  neon: {name:'Neonite', ticker:'NEON', color:'#55f4db', cap:null, poolTokens:1700, poolCredits:85000, reserve:55000, day:1800, personal:40, ore:3, payout:1, fee:5, rawPrice:16},
  dust: {name:'Stardust', ticker:'DUST', color:'#ffd17b', cap:100000, poolTokens:500, poolCredits:65000, reserve:13500, day:440, personal:12, ore:2, payout:1, fee:8, rawPrice:39},
  void: {name:'Void crystal', ticker:'VOID', color:'#c5a0ff', cap:20000, poolTokens:130, poolCredits:76000, reserve:2500, day:70, personal:3, ore:1, payout:1, fee:25, rawPrice:100}
};
const MAX_MESSAGE = 4096;
const rate = (n,min,max) => Number.isFinite(n)?Math.min(max,Math.max(min,n)):min;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const makeMap=()=>Object.fromEntries(TYPES.map(k=>[k,0]));
const utcDay=()=>new Date().toISOString().slice(0,10);
const random=(a,b)=>a+Math.random()*(b-a);
let save = {};
try {save=JSON.parse(fs.readFileSync(SAVEFILE,'utf8'));}catch{}
const ledger = save.ledger || Object.fromEntries(TYPES.map(k=>[k, {
  poolTokens: DEFINITIONS[k].poolTokens, poolCredits:DEFINITIONS[k].poolCredits,
  rewardReserve:DEFINITIONS[k].reserve, burned:0, issued:0, daily:0
}]));
for (const k of TYPES) {
  const d=DEFINITIONS[k], l=ledger[k];
  if(!l || !Number.isFinite(l.poolTokens) || !Number.isFinite(l.rewardReserve)) {
    ledger[k]={poolTokens:d.poolTokens,poolCredits:d.poolCredits,rewardReserve:d.reserve,burned:0,issued:0,daily:0};
  }
  ledger[k].recycled ||= 0; ledger[k].newlyMinted ||= 0;
}
// Upgrade payments return to the reward vault. Only controlled rewards create new supply.
function recycleToken(account, kind, quantity){
  account.tokens[kind]-=quantity;
  ledger[kind].rewardReserve+=quantity;
  ledger[kind].recycled+=quantity;
}
let day=save.day||utcDay();
let portBudget=save.portBudget ?? 24000;
let portSold=save.portSold||makeMap();
const accounts=save.accounts||{};
let stations=(save.stations||[]).filter(s=>s && Number.isFinite(s.x) && Number.isFinite(s.y));
let nextStationId=save.nextStationId||1;
let listings=(save.listings||[]).filter(x=>x && TYPES.includes(x.kind) && TYPES.includes(x.tokenKind));
let nextListingId=save.nextListingId||1;
let nextAsteroidId=1, nextPickupId=1, nextBulletId=1;
const asteroids=[]; const players=new Map(); const sockets=new Map();
const bullets=[]; const pickups=[]; const messages=[]; const events=[];
const now=()=>Date.now();

function resetDaily(){
 const d=utcDay(); if(day===d) return;
 day=d; portBudget=24000;portSold=makeMap();
 for(const k of TYPES) ledger[k].daily=0;
 for(const a of Object.values(accounts)){a.daily={day, minted:makeMap(), sold:0};}
}
function ensureAccount(id,name){
 if(!accounts[id]) accounts[id]={id,name,credits:460,hold:makeMap(),tokens:makeMap(),level:1,xp:0,kills:0,deaths:0,upgrades:{laser:1,cargo:1,engine:1},daily:{day,minted:makeMap(),sold:0}};
 const a=accounts[id]; a.name=name||a.name||'Pilot';
 for(const key of ['hold','tokens']) {a[key] ||=makeMap();for(const k of TYPES)a[key][k]=Math.max(0,Math.floor(Number(a[key][k])||0));}
 a.upgrades||={laser:1,cargo:1,engine:1};
 a.daily||={day,minted:makeMap(),sold:0};if(a.daily.day!==day)a.daily={day,minted:makeMap(),sold:0};
 a.xp=Number(a.xp)||0;a.level=Math.max(1,Math.floor(Number(a.level)||1));
 a.credits=Math.max(0,Math.floor(Number(a.credits)||0));
 return a;
}
function publish(type,detail){events.unshift({type,detail,t:now()});events.length=Math.min(events.length,12);}
function logChat(name, text){messages.push({name,text,t:now()});if(messages.length>35)messages.shift();}
function send(ws,payload){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(payload));}
function notify(p,msg,kind='info'){send(p.ws,{t:'notice',message:msg,kind});}
function cargoCount(a){return TYPES.reduce((n,k)=>n+a.hold[k],0);}
function cargoMax(a){return 30+(a.upgrades.cargo-1)*16;}
function dockLocation(p){
 if(Math.hypot(p.x-CX,p.y-CY)<SAFE) return {kind:'port'};
 for(const st of stations)if(st.owner===p.id && distance(p,st)<105)return {kind:'station',station:st};
 return null;
}
function randomAsteroid(){
 let x,y,r;for(let i=0;i<100;i++){
  x=random(80,WIDTH-80);y=random(80,HEIGHT-80);r=Math.hypot(x-CX,y-CY);
  if(r>285 && stations.every(st=>Math.hypot(x-st.x,y-st.y)>70))break;
 }
 const roll=Math.random(),edge=r>650;
 const kind=roll<(edge?.44:.62)?'moon':roll<(edge?.72:.89)?'neon':roll<(edge?.93:.995)?'dust':'void';
 return {id:nextAsteroidId++,x:Math.round(x),y:Math.round(y),kind,remaining:Math.floor(random(3,9)),max:8,r:Math.floor(random(15,31)),respawn:0};
}
for(let i=0;i<100;i++)asteroids.push(randomAsteroid());
function respawnAsteroid(a){Object.assign(a,randomAsteroid(),{id:a.id});}
function price(k){const l=ledger[k];return +(l.poolCredits/l.poolTokens).toFixed(3);}
function market(){return Object.fromEntries(TYPES.map(k=>[k,{...DEFINITIONS[k], ...ledger[k], price:price(k), dailyRemaining:Math.max(0,Math.min(DEFINITIONS[k].day-ledger[k].daily,DEFINITIONS[k].cap===null?Infinity:ledger[k].rewardReserve))}]));}
function snapshot(){
 const ps=[...players.values()].map(p=>({id:p.id,name:p.account.name,x:Math.round(p.x),y:Math.round(p.y),angle:p.angle,hp:Math.round(p.hp),energy:Math.round(p.energy),kills:p.account.kills,level:p.account.level,invulnerable:now()<p.invuln}));
 const world={t:'world',time:now(),day, players:ps, asteroids:asteroids.filter(a=>a.remaining>0).map(a=>({id:a.id,x:a.x,y:a.y,kind:a.kind,remaining:a.remaining,r:a.r})),
  stations:stations.map(s=>({id:s.id,owner:s.owner,name:s.name,x:s.x,y:s.y,hp:s.hp,maxHp:s.maxHp||440,tier:s.tier||1,offlineProtected:!players.has(s.owner),storage:s.storage})),
  listings:listings.slice(-25).reverse().map(x=>({...x,ownerName:accounts[x.owner]?.name||'Unknown pilot'})),
  bullets:bullets.map(b=>({id:b.id,x:Math.round(b.x),y:Math.round(b.y),vx:b.vx,vy:b.vy,owner:b.owner})),
  pickups:pickups.map(s=>({id:s.id,x:s.x,y:s.y,kind:s.kind,amount:s.amount})), market:market(), portBudget, portSold, online:ps.length,
  recent:events.slice(0,6), leaderboard:ps.slice().sort((a,b)=>b.kills-a.kills).slice(0,8)};
 const payload=JSON.stringify(world);
 for(const p of players.values()) {if(p.ws.readyState===WebSocket.OPEN && p.ws.bufferedAmount<512_000)p.ws.send(payload);}
}
function personal(p){const a=p.account;return {t:'self',id:p.id,account:{name:a.name,credits:a.credits,hold:a.hold,tokens:a.tokens,level:a.level,xp:a.xp,kills:a.kills,deaths:a.deaths,upgrades:a.upgrades,daily:a.daily},
  hp:Math.round(p.hp),energy:Math.round(p.energy),x:Math.round(p.x),y:Math.round(p.y),cargo:cargoCount(a),capacity:cargoMax(a),docked:!!dockLocation(p),dockKind:dockLocation(p)?.kind||'',stationCount:stations.filter(s=>s.owner===p.id).length};}
function self(p){send(p.ws,personal(p));}
function mineTick(p){
 if(!p.target)return;
 const a=asteroids.find(a=>a.id===p.target && a.remaining>0);
 if(!a){p.target=null;return;}
 const dist=distance(p,a);
 if(dist>69)return;
 if(now()-p.mined<850/(1+(p.account.upgrades.laser-1)*.30))return;
 p.mined=now();
 if(p.energy<9){if(now()-p.lastNotify>3000){notify(p,'Low energy. Recharge briefly.','warn');p.lastNotify=now();}return;}
 if(cargoCount(p.account)>=cargoMax(p.account)) {p.target=null;notify(p,'Cargo hold full — return to port or your station.','warn');return;}
 p.energy-=9;p.account.hold[a.kind]++;a.remaining--;p.account.xp+=4;
 if(p.account.xp>=p.account.level*80){p.account.xp-=p.account.level*80;p.account.level++;notify(p,`Level ${p.account.level} reached!`,'good');}
 if(a.remaining<=0) {a.respawn=now()+Math.floor(random(7000,24000));p.target=null;}
 self(p);
}
function doTrade(p,m){
 if(!dockLocation(p))return notify(p,'Dock at the central port or your own station to trade.','warn');
 const k=m.kind; if(!TYPES.includes(k))return;
 const q=Math.floor(Number(m.qty));if(!Number.isInteger(q)||q<1||q>100)return;
 const l=ledger[k],a=p.account;
 if(m.t==='buy'){
   if(l.poolTokens-q<80)return notify(p,'Not enough exchange liquidity.','warn');
   const cost=Math.ceil(l.poolCredits*q/(l.poolTokens-q)*1.015);
   if(cost>a.credits)return notify(p,`You need ${cost} $JUNK to buy ${q} $${DEFINITIONS[k].ticker}.`,'warn');
   a.credits-=cost;a.tokens[k]+=q;l.poolTokens-=q;l.poolCredits+=cost;
   notify(p,`Bought ${q} $${DEFINITIONS[k].ticker} for ${cost} $JUNK.`,'good');
 }else{
   if(a.tokens[k]<q)return notify(p,'Insufficient tokens in your wallet.','warn');
   const gained=Math.floor(l.poolCredits*q/(l.poolTokens+q)*.985);
   if(gained<1)return notify(p,'Trade too small for this market.','warn');
   a.credits+=gained;a.tokens[k]-=q;l.poolTokens+=q;l.poolCredits-=gained;
   notify(p,`Sold ${q} $${DEFINITIONS[k].ticker} for ${gained} $JUNK.`,'good');
 }
 self(p);
}
function doRefine(p,k){
 if(!dockLocation(p))return notify(p,'Dock to use the refinery.','warn');
 if(!TYPES.includes(k))return;
 resetDaily(); const d=DEFINITIONS[k],l=ledger[k],a=p.account;
 if(a.hold[k]<d.ore)return notify(p,`Need ${d.ore} ${d.name} ore to refine.`,'warn');
 if(a.credits<d.fee)return notify(p,`Refining costs ${d.fee} $JUNK.`,'warn');
 if((d.cap!==null&&l.rewardReserve<d.payout)||l.daily+d.payout>d.day||a.daily.minted[k]+d.payout>d.personal)
   return notify(p,'Daily token release limit reached. Ore remains yours.','warn');
 a.hold[k]-=d.ore;a.credits-=d.fee;a.tokens[k]+=d.payout;
 const fromReserve=Math.min(l.rewardReserve,d.payout);
 const newlyMinted=d.payout-fromReserve; // Only uncapped common tokens may be minted here.
 l.rewardReserve-=fromReserve;l.newlyMinted+=newlyMinted;
 a.daily.minted[k]+=d.payout;l.daily+=d.payout;l.issued+=d.payout;
 notify(p,`Refined ${d.ore} ore into ${d.payout} $${d.ticker}.`,'good');self(p);
}
function sellOre(p,k,qty){
 if(!dockLocation(p))return notify(p,'Dock before selling ore.','warn');
 if(!TYPES.includes(k))return;
 const q=Math.floor(Number(qty));if(q<1||q>100)return;
 const a=p.account;if(a.hold[k]<q)return notify(p,'Not enough raw ore.','warn');
 const totalSold=portSold[k]||0;
 const unit=Math.max(1,Math.floor(DEFINITIONS[k].rawPrice*(0.33+0.67/(1+totalSold/210))));
 const total=unit*q;
 if(a.daily.sold+total>1900||total>portBudget)return notify(p,'NPC port buying budget exhausted; try tomorrow or trade tokens.','warn');
 a.hold[k]-=q;a.credits+=total;portBudget-=total;portSold[k]+=q;a.daily.sold+=total;
 notify(p,`Port bought ${q} ${DEFINITIONS[k].name} ore for ${total} $JUNK.`,'good');self(p);
}
function createListing(p,m){
 if(!dockLocation(p))return notify(p,'Dock to post a marketplace listing.','warn');
 const kind=m.kind,tokenKind=m.tokenKind,qty=Math.floor(Number(m.qty)),amount=Math.floor(Number(m.price));
 if(!TYPES.includes(kind)||!TYPES.includes(tokenKind)||!(qty>=1&&qty<=15)||!(amount>=1&&amount<=500))return notify(p,'Listing: 1–15 ore and 1–500 material tokens.','warn');
 const a=p.account;if(a.hold[kind]<qty)return notify(p,'Not enough ore to list.','warn');
 if(listings.filter(x=>x.owner===p.id).length>=4)return notify(p,'Maximum 4 active listings per pilot.','warn');
 a.hold[kind]-=qty;listings.push({id:nextListingId++,owner:p.id,kind,qty,tokenKind,price:amount,created:now()});
 notify(p,`Listed ${qty} ${DEFINITIONS[kind].name} ore for ${amount} $${DEFINITIONS[tokenKind].ticker}.`,'good');self(p);
}
function buyListing(p,m){
 if(!dockLocation(p))return notify(p,'Dock before buying from the pilot marketplace.','warn');
 const id=Math.floor(Number(m.id)),listing=listings.find(x=>x.id===id);if(!listing)return notify(p,'This listing has already been sold or removed.','warn');
 if(listing.owner===p.id)return notify(p,'You cannot purchase your own listing.','warn');
 const buyer=p.account,seller=accounts[listing.owner];
 if(!seller)return notify(p,'Seller account unavailable.','warn');
 if(buyer.tokens[listing.tokenKind]<listing.price)return notify(p,'Not enough material tokens to buy this listing.','warn');
 if(cargoCount(buyer)+listing.qty>cargoMax(buyer))return notify(p,'Not enough cargo capacity.','warn');
 buyer.tokens[listing.tokenKind]-=listing.price;const fee=Math.floor(listing.price*.02);seller.tokens[listing.tokenKind]+=listing.price-fee;ledger[listing.tokenKind].burned+=fee;
 buyer.hold[listing.kind]+=listing.qty;listings.splice(listings.indexOf(listing),1);
 notify(p,`Purchased ${listing.qty} ${DEFINITIONS[listing.kind].name} ore for ${listing.price} $${DEFINITIONS[listing.tokenKind].ticker}.`,'good');
 const onlineSeller=players.get(listing.owner);if(onlineSeller){notify(onlineSeller,`Your ore listing sold! Received ${listing.price-fee} $${DEFINITIONS[listing.tokenKind].ticker}.`,'good');self(onlineSeller);}
 publish('trade',`${buyer.name} purchased ${listing.qty} ore from ${seller.name}.`);self(p);
}
function cancelListing(p,m){
 if(!dockLocation(p))return notify(p,'Dock before cancelling an ore listing.','warn');
 const listing=listings.find(x=>x.id===Math.floor(Number(m.id))&&x.owner===p.id);if(!listing)return notify(p,'Listing not found.','warn');
 if(cargoCount(p.account)+listing.qty>cargoMax(p.account))return notify(p,'Free cargo space before reclaiming your ore.','warn');
 p.account.hold[listing.kind]+=listing.qty;listings.splice(listings.indexOf(listing),1);notify(p,'Listing cancelled; escrowed ore returned to cargo.','good');self(p);
}
function buildStation(p){
 const a=p.account;
 if(distance(p,{x:CX,y:CY})<SAFE+130)return notify(p,'Fly beyond the port safety perimeter to build.','warn');
 if(stations.filter(s=>s.owner===p.id).length>=2)return notify(p,'You can own up to 2 stations in this alpha.','warn');
 if(stations.some(s=>distance(p,s)<200))return notify(p,'Too close to another station.','warn');
 const cost={moon:10,neon:4,dust:1};
 if(Object.keys(cost).some(k=>a.hold[k]<cost[k])||a.tokens.moon<2||a.credits<160)
  return notify(p,'Station costs 10 Moonstone, 4 Neonite, 1 Stardust ore, 2 $MOON and 160 $JUNK.','warn');
 for(const k in cost)a.hold[k]-=cost[k];recycleToken(a,'moon',2);a.credits-=160;
 const s={id:nextStationId++,owner:p.id,name:`${a.name}'s Outpost`,x:Math.round(p.x),y:Math.round(p.y),tier:1,maxHp:440,hp:440,storage:makeMap()};
 stations.push(s);publish('station',`${a.name} established a new space station!`);notify(p,'Space station built! Dock here to refine, repair and store cargo.','good');self(p);
}
function atOwnStation(p){return stations.find(s=>s.owner===p.id && distance(s,p)<106);}
function serviceStation(p,mode){const st=atOwnStation(p);if(!st)return notify(p,'Approach one of your own stations first.','warn');
 const a=p.account;
 if(mode==='repair'){
  if(st.hp>=st.maxHp)return notify(p,'Station hull is already at full strength.');
  if(a.hold.moon<3||a.credits<25)return notify(p,'Repairs cost 3 Moonstone ore and 25 $JUNK.','warn');
  a.hold.moon-=3;a.credits-=25;st.hp=Math.min(st.maxHp,st.hp+110);notify(p,'Station repaired +110 HP.','good');
 }else if(mode==='fortify'){
  if((st.tier||1)>=3)return notify(p,'Station already at maximum tier.','warn');
  if(a.tokens.void<1||a.tokens.dust<2||a.tokens.neon<3||a.credits<150)return notify(p,'Fortification needs 1 $VOID, 2 $DUST, 3 $NEON and 150 $JUNK.','warn');
  for(const [k,n] of [['void',1],['dust',2],['neon',3]])recycleToken(a,k,n);a.credits-=150;
  st.tier=(st.tier||1)+1;st.maxHp=440*st.tier;st.hp=Math.min(st.maxHp,st.hp+440);notify(p,`Outpost fortification upgraded to tier ${st.tier}!`,'good');publish('station',`${a.name} fortified an outpost to tier ${st.tier}.`);
 }else if(mode==='deposit'){
  let n=0;for(const k of TYPES){const room=140*(st.tier||1)-TYPES.reduce((sum,t)=>sum+st.storage[t],0);const q=Math.min(a.hold[k],Math.max(0,room));st.storage[k]+=q;a.hold[k]-=q;n+=q;}
  notify(p,n?`Stored ${n} ore in your outpost.`:'Your cargo is empty or storage is full.',n?'good':'warn');
 }else if(mode==='withdraw'){
  let n=0;for(const k of TYPES){const room=cargoMax(a)-cargoCount(a);const q=Math.min(st.storage[k],Math.max(0,room));st.storage[k]-=q;a.hold[k]+=q;n+=q;}
  notify(p,n?`Collected ${n} ore from your outpost.`:'No stored ore, or your cargo hold is full.',n?'good':'warn');
 }self(p);
}
const EXTRA={laser:{1:['neon',1],2:['neon',2],3:['dust',1],4:['void',1]},engine:{1:['neon',1],2:['dust',1],3:['dust',2],4:['void',1]},cargo:{1:['moon',2],2:['moon',3],3:['neon',2],4:['dust',1]}};
function upgrade(p,kind){const a=p.account;if(!['laser','engine','cargo'].includes(kind))return;
 if(!dockLocation(p))return notify(p,'Dock before upgrading your ship.','warn');
 const level=a.upgrades[kind];if(level>=5)return notify(p,'Upgrade already at maximum level.','warn');
 const cost=80*level*level+40;
 const [token,q]=EXTRA[kind][level];
 if(a.credits<cost||a.tokens[token]<q)return notify(p,`Upgrade costs ${cost} $JUNK and ${q} $${DEFINITIONS[token].ticker}.`,'warn');
 a.credits-=cost;recycleToken(a,token,q);a.upgrades[kind]++;notify(p,`${kind} upgraded to level ${level+1}!`,'good');self(p);
}
function repairShip(p){const a=p.account;if(!dockLocation(p))return notify(p,'Dock to repair your ship.','warn');
 if(p.hp>=100)return notify(p,'Hull is already fully repaired.');
 if(a.credits<35||a.hold.moon<2)return notify(p,'Ship repair costs 35 $JUNK and 2 Moonstone ore.','warn');
 a.credits-=35;a.hold.moon-=2;p.hp=Math.min(100,p.hp+60);notify(p,'Ship hull repaired +60 HP.','good');self(p);}
function warp(p){const a=p.account,targets=stations.filter(s=>s.owner===p.id);
 if(!targets.length)return notify(p,'Build a station before using emergency warp.','warn');
 if(now()-p.invulnHit<15000)return notify(p,'Cannot warp for 15 seconds after taking damage.','warn');
 if(now()-(p.lastWarp||0)<75000)return notify(p,'Warp drive cooling down.','warn');
 if(a.tokens.void<1)return notify(p,'Emergency warp consumes 1 $VOID token.','warn');
 const dest=targets.sort((s,t)=>distance(t,p)-distance(s,p))[0];
 recycleToken(a,'void',1);p.lastWarp=now();p.x=rate(dest.x+75,20,WIDTH-20);p.y=rate(dest.y+65,20,HEIGHT-20);p.target=null;p.invuln=now()+2500;notify(p,'Emergency warp complete! 1 $VOID recycled into the reward vault.','good');self(p);}
function fire(p,angle){
 if(!Number.isFinite(angle))return;
 if(distance(p,{x:CX,y:CY})<SAFE+10)return notifyThrottled(p,'Weapons disabled within the port safe zone.');
 if(now()<p.invuln)return notifyThrottled(p,'Spawn protection active; weapons are temporarily offline.');
 if(now()-p.fired<410)return;
 if(p.energy<8)return notifyThrottled(p,'Not enough weapon energy.');
 p.energy-=8;p.fired=now();const a=rate(angle,-Math.PI*30,Math.PI*30);
 bullets.push({id:nextBulletId++,owner:p.id,x:p.x+Math.cos(a)*20,y:p.y+Math.sin(a)*20,vx:Math.cos(a)*680,vy:Math.sin(a)*680,life:0});
}
function notifyThrottled(p,msg){if(now()-p.lastNotify>4000){p.lastNotify=now();notify(p,msg,'warn');}}
function damageShip(victim,attacker){
 if(now()<victim.invuln)return;
 if(distance(victim,{x:CX,y:CY})<SAFE)return;
 victim.hp-=23; victim.invulnHit=now();
 if(victim.hp>0)return;
 victim.account.deaths++;if(attacker){const killer=players.get(attacker);if(killer){killer.account.kills++;killer.bountyTimes ||= {};const last=killer.bountyTimes[victim.id]||0;const reward=now()-last>180000?30:0;if(reward){killer.account.credits+=reward;killer.bountyTimes[victim.id]=now();}self(killer);publish('combat',`${killer.account.name} defeated ${victim.account.name}${reward?' (+30 $JUNK bounty)':''}`);}}
 // Lose some *raw cargo only*; wallet balances cannot be taken via PvP.
 const a=victim.account;
 for(const k of TYPES){const q=Math.floor(a.hold[k]*.25);if(q>0){a.hold[k]-=q;pickups.push({id:nextPickupId++,x:rate(victim.x+random(-25,25),25,WIDTH-25),y:rate(victim.y+random(-25,25),25,HEIGHT-25),kind:k,amount:q,expires:now()+120000});}}
 victim.hp=100;victim.energy=100;victim.x=CX+random(-65,65);victim.y=CY+random(-65,65);victim.invuln=now()+7000;victim.target=null;
 notify(victim,'Your ship was destroyed! Respawned at port. 25% of raw cargo was dropped; tokens are safe.','warn');self(victim);
}
function update(dt){
 resetDaily();const tick=now();
 for(const p of players.values()){
  const inputs=p.input; let dx=(inputs.right?1:0)-(inputs.left?1:0),dy=(inputs.down?1:0)-(inputs.up?1:0);
  if(!dx&&!dy&&p.target){const a=asteroids.find(a=>a.id===p.target&&a.remaining>0);if(a && distance(p,a)>53){dx=a.x-p.x;dy=a.y-p.y;} }
  const mag=Math.hypot(dx,dy);if(mag>0){dx/=mag;dy/=mag;const speed=190+(p.account.upgrades.engine-1)*33;
    p.x=rate(p.x+dx*speed*dt,18,WIDTH-18);p.y=rate(p.y+dy*speed*dt,18,HEIGHT-18);p.angle=Math.atan2(dy,dx);}
  p.energy=Math.min(100,p.energy+dt*11);
  mineTick(p);
  for(let i=pickups.length-1;i>=0;i--){const s=pickups[i];if(distance(p,s)<38&&cargoCount(p.account)<cargoMax(p.account)){
    const n=Math.min(s.amount,cargoMax(p.account)-cargoCount(p.account));p.account.hold[s.kind]+=n;s.amount-=n;if(s.amount<=0)pickups.splice(i,1);notify(p,`Salvaged ${n} ${DEFINITIONS[s.kind].name} ore.`,'good');self(p);
  }}
 }
 for(const a of asteroids)if(a.remaining===0 && tick>=a.respawn)respawnAsteroid(a);
 // Outpost defense: neon ore is turret ammunition; unoccupied bases have offline protection.
 for(const st of stations){
  if(!players.has(st.owner) || !(st.storage?.neon>0) || tick-(st.lastTurretShot||0)<6000)continue;
  const target=[...players.values()].filter(p=>p.id!==st.owner && distance(st,p)<(st.tier||1)*55+140 && distance(p,{x:CX,y:CY})>SAFE).sort((a,b)=>distance(a,st)-distance(b,st))[0];
  if(target){st.lastTurretShot=tick;st.storage.neon--;damageShip(target,st.owner);}
 }
 for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life+=dt;
  if(b.life>0.78||b.x<0||b.y<0||b.x>WIDTH||b.y>HEIGHT){bullets.splice(i,1);continue;}
  let hit=false;
  for(const p of players.values())if(p.id!==b.owner&&distance(p,b)<22){damageShip(p,b.owner);hit=true;break;}
  if(!hit)for(const st of stations)if(st.owner!==b.owner&&players.has(st.owner)&&distance(st,b)<58){st.hp-=17;hit=true;if(st.hp<=0){publish('combat',`${st.name} was destroyed in a raid.`);for(const k of TYPES){const q=Math.floor((st.storage?.[k]||0)*.15);if(q)pickups.push({id:nextPickupId++,x:st.x+random(-20,20),y:st.y+random(-20,20),kind:k,amount:q,expires:now()+120000});}const idx=stations.indexOf(st);if(idx>=0)stations.splice(idx,1);}
    break;
  }
  if(hit)bullets.splice(i,1);
 }
 for(let i=pickups.length-1;i>=0;i--)if(tick>pickups[i].expires)pickups.splice(i,1);
}
function persist(){fs.mkdirSync(DATA,{recursive:true});
 const state={day,portBudget,portSold,ledger,accounts,stations,nextStationId,listings,nextListingId};
 const tmp=SAVEFILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(state));fs.renameSync(tmp,SAVEFILE);
}
const contentTypes={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
const staticFiles={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/client.js':'client.js','/favicon.svg':'favicon.svg'};
const httpServer=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({status:'ok',online:players.size,stations:stations.length,simulated:true}));return;}
 const file=staticFiles[pathname];if(!file){res.writeHead(404);res.end('Not found');return;}
 let data;try{data=fs.readFileSync(path.join(ROOT,'public',file));}catch{res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':contentTypes[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; connect-src 'self' ws: wss:; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'"});res.end(data);
});
const wss=new WebSocketServer({server:httpServer,path:'/ws',perMessageDeflate:false,maxPayload:MAX_MESSAGE});
wss.on('connection',(ws,req)=>{
 const origin=req.headers.origin;
 if(origin){try{if(new URL(origin).host!==req.headers.host){ws.close(1008,'Origin mismatch');return;}}catch{ws.close(1008,'Bad origin');return;}}
 let p=null;ws.isAlive=true;
 ws.on('pong',()=>ws.isAlive=true);
 ws.on('error',()=>{});
 ws.on('message',bytes=>{
  let m;try{m=JSON.parse(bytes.toString());}catch{return;}
  if(!m || typeof m.t!=='string')return;
  if(!p){if(m.t!=='join')return;
    const id=typeof m.id==='string' && /^[a-zA-Z0-9_-]{24,80}$/.test(m.id)?m.id:null;
    if(!id){send(ws,{t:'error',message:'Invalid pilot ID'});ws.close();return;}
    const name=typeof m.name==='string'?m.name.trim().replace(/[^\p{L}\p{N} \-_]/gu,'').slice(0,18):'';
    if(!name){send(ws,{t:'error',message:'Enter a pilot name.'});return;}
    if(players.size>=80){send(ws,{t:'error',message:'Sector full.'});return;}
    const prior=players.get(id);if(prior){prior.ws.close(1000,'Session moved');players.delete(id);}
    const account=ensureAccount(id,name);
    p={id,account,ws,x:CX+random(-60,60),y:CY+random(-60,60),angle:0,hp:100,energy:100,invuln:now()+6000,invulnHit:0,fired:0,mined:0,lastNotify:0,input:{},target:null,lastChat:0,lastAction:0};
    players.set(id,p);sockets.set(ws,id);
    send(ws,{t:'welcome',id,world:{width:WIDTH,height:HEIGHT,cx:CX,cy:CY,safe:SAFE},definitions:DEFINITIONS,messages:messages.slice(-20)});self(p);
    publish('online',`${name} arrived in Sector 07`);return;
  }
  if(m.t==='input'){const x=m.keys||{};p.input={up:!!x.up,down:!!x.down,left:!!x.left,right:!!x.right};return;}
  if(m.t==='target'){const id=Math.floor(Number(m.id));if(asteroids.some(a=>a.id===id&&a.remaining>0)){p.target=id;}return;}
  if(m.t==='stop'){p.target=null;return;}
  if(m.t==='fire'){fire(p,Number(m.angle));return;}
  if(m.t==='chat'){
    if(now()-p.lastChat<1800)return;p.lastChat=now();const text=String(m.text||'').replace(/[\x00-\x1f]/g,'').slice(0,160).trim();if(!text)return;
    const entry={name:p.account.name,text,t:now()};messages.push(entry);if(messages.length>35)messages.shift();for(const v of players.values())send(v.ws,{t:'chat',entry});return;
  }
  if(now()-p.lastAction<240)return;p.lastAction=now();
  switch(m.t){
    case 'refine':doRefine(p,m.kind);break;
    case 'list':createListing(p,m);break;
    case 'buyListing':buyListing(p,m);break;
    case 'cancelListing':cancelListing(p,m);break;
    case 'buy':case 'sell':doTrade(p,m);break;
    case 'sellOre':sellOre(p,m.kind,m.qty);break;
    case 'build':buildStation(p);break;
    case 'station':serviceStation(p,m.mode);break;
    case 'upgrade':upgrade(p,m.kind);break;
    case 'repairShip':repairShip(p);break;
    case 'warp':warp(p);break;
    case 'dock':p.target=null;notify(p,'Fly to the glowing central port ring. Refining and trading unlock inside it.');break;
  }
 });
 ws.on('close',()=>{if(p && players.get(p.id)?.ws===ws){players.delete(p.id);publish('online',`${p.account.name} left the sector`);}sockets.delete(ws);});
});
const sim=setInterval(()=>update(1/30),1000/30);
const sync=setInterval(snapshot,125);
const recover=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue;}ws.isAlive=false;ws.ping();}},30000);
const saveTimer=setInterval(()=>{try{persist();}catch(e){console.error('Save error',e);}},15000);
httpServer.listen(PORT,'0.0.0.0',()=>console.log(`TOKENVERSE multiplayer running at http://localhost:${PORT} (SIMULATED TOKENS ONLY)`));
function shutdown(){clearInterval(sim);clearInterval(sync);clearInterval(recover);clearInterval(saveTimer);try{persist();}catch(e){console.error(e);}httpServer.close(()=>process.exit(0));setTimeout(()=>process.exit(0),2500).unref();}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);