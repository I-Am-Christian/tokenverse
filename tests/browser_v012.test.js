import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// No browser dependencies: exercise the in-page game with a lightweight DOM stub.
function smokeBrowser(html){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 if(raw.length<50000)throw Error('Missing browser game script');
 new Function(raw);
 const js=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,
 `return {S,SHIPS,GUNS,SYSTEMS,GATES,WORLD,asteroids,extSites,extScan,extCollectSignals,extUnlockBlueprint,extDeployOutpost,extBuildModule,extTransferOre,extCraftDrone,extDroneUpgrade,extMarketTrade,extPlaceLimit,extCancelOrder,extBossHit,extBossPhysics,updateShip,renderUI,craft,spawnExpansionWorld,buyShip,equipShip,get extBoss(){return extBoss},get docked(){return dockedStation}};})();`);
 const cls=()=>({contains:()=>false,add(){},remove(){},toggle(){return false}});
 let seq=0;const els=new Map();
 function el(id){if(!els.has(id))els.set(id,{id,innerHTML:'',textContent:'',style:{},value:'1',disabled:false,classList:cls(),children:[],addEventListener(){},setAttribute(){},getAttribute(){return ''},getContext(){const gradient={addColorStop(){}};return new Proxy({setTransform(){},createLinearGradient(){return gradient},createRadialGradient(){return gradient}}, {get(obj,key){return obj[key]||(()=>{})},set(obj,key,value){obj[key]=value;return true}})},getBoundingClientRect(){return {width:1920,height:1080,left:0,top:0}},prepend(){},removeChild(){},appendChild(){},closest(){return null}});return els.get(id);}
 const doc={getElementById:el,querySelectorAll(){return []},createElement(){return el('created'+ ++seq)}};
 const st={getItem(){return null},setItem(){},removeItem(){}};
 const model=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm',js)(doc,{devicePixelRatio:1},st,()=>{},()=>{},1920,1080,()=>{},()=>{},{now:()=>1500},{randomUUID:()=> 'fake-id'},()=>false);
 const A=model, result={};
 result.shipCount=Object.keys(A.SHIPS).length;
 result.guns=Object.keys(A.GUNS).length;
 result.systemCount=Object.keys(A.SYSTEMS).length;
 result.gates=A.GATES.length;
 result.fullscreen=html.includes('width:100vw;height:100dvh');
 const credits=A.S.credits;
 A.S.x=A.extSites[0].x;A.S.y=A.extSites[0].y;A.extCollectSignals();A.extCollectSignals();
 result.onceOnlyDiscovery=(A.S.blueprintFragments===2 && A.S.credits>credits);
 A.S.x=A.WORLD.port.x;A.S.y=A.WORLD.port.y;A.S.vx=A.S.vy=0;A.updateShip(.02);
 result.docked=!!A.docked;
 A.extUnlockBlueprint('scatter');result.blueprintUnlocked=!!A.S.blueprints.scatter;
 A.S.credits=12000;for(const k of ['moon','neon','dust','void','diam']){A.S.ore[k]=100;A.S.tokens[k]=50;}
 A.craft('guns','scatter');result.blueprintCraft=!!A.S.crafted.guns.scatter;
 A.extCraftDrone('miner');A.extCraftDrone('escort');result.droneCraft=!!A.S.droneOwned.miner && !!A.S.droneOwned.escort;
 const stock=A.S.exchange.moon.stock, tokens=A.S.tokens.moon, pre=A.S.credits;
 A.extMarketTrade('moon','buy',1);A.extMarketTrade('moon','sell',1);
 result.marketConservation=A.S.exchange.moon.stock===stock && A.S.tokens.moon===tokens && A.S.credits<pre;
 const preOrder=A.S.credits;A.extPlaceLimit('neon','buy',5,2);const order=A.S.orders.at(-1);if(!order)throw Error('No test order');A.extCancelOrder(order.id);
 result.orderRefund=(A.S.orders.length===0 && A.S.credits===preOrder);
 const shipID='scout_1';A.buyShip(shipID);A.equipShip(shipID);result.shipDealer=!!A.S.ownedShips[shipID] && A.S.shipId===shipID;
 A.S.x=4000;A.S.y=1600;A.S.vx=A.S.vy=0;
 for(let x=2200;x<5400 && !A.S.outposts.length;x+=320){for(let y=1550;y<3150 && !A.S.outposts.length;y+=320){A.S.x=x;A.S.y=y;A.extDeployOutpost();}}
 result.outpost=!!A.S.outposts.length;
 if(result.outpost){const out=A.S.outposts[0];A.S.x=out.x;A.S.y=out.y;A.updateShip(.02);A.extBuildModule('storage');A.extTransferOre('moon','store');result.moduleStorage=out.modules.storage===1 && out.hold.moon>0;}else result.moduleStorage=false;
 if(A.extBoss){const boss=A.extBoss;A.extBossHit({x:boss.x,y:boss.y,damage:boss.hp+1});result.bossRewards=!A.extBoss && A.S.bossTimers[A.S.system]>Date.now();}else result.bossRewards=false;
 result.countOfActions=['bossRewards','moduleStorage','shipDealer','orderRefund','marketConservation','droneCraft','blueprintCraft','docked','onceOnlyDiscovery'].filter(k=>result[k]).length;
 return result;
}

const html=readFileSync(new URL('../index.html', import.meta.url),'utf8');
const result=smokeBrowser(html);
test('Tokenverse v0.12 boots with the complete fleet and connected systems',()=>{
 assert.equal(result.shipCount,40);
 assert.equal(result.guns,14);
 assert.equal(result.systemCount,6);
 assert.equal(result.gates,4);
 assert.equal(result.fullscreen,true);
});
test('Blueprints, station modules, drones and mothership rewards work',()=>{
 for(const k of ['onceOnlyDiscovery','docked','blueprintUnlocked','blueprintCraft','droneCraft','shipDealer','outpost','moduleStorage','bossRewards']) assert.equal(result[k],true,k);
});
test('Simulated exchange conserves inventories and cancels escrow correctly',()=>{
 assert.equal(result.marketConservation,true);
 assert.equal(result.orderRefund,true);
});