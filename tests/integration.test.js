import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const ROOT=new URL('..',import.meta.url).pathname;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function freePort(){const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
function waitMessage(client,pred,timeout=6000){return new Promise((resolve,reject)=>{
 const found=client.queue.findIndex(pred);if(found>=0){resolve(client.queue.splice(found,1)[0]);return;}
 const pending={pred,resolve:x=>{clearTimeout(timer);resolve(x);},reject};client.pending.push(pending);
 const timer=setTimeout(()=>{client.pending=client.pending.filter(p=>p!==pending);reject(new Error('Timed out waiting for message'));},timeout);
});}
async function connect(url){const ws=new WebSocket(url);const client={ws,queue:[],pending:[]};
 ws.addEventListener('message',ev=>{let m;try{m=JSON.parse(ev.data);}catch{return;}let at=client.pending.findIndex(x=>x.pred(m));if(at>=0){const p=client.pending.splice(at,1)[0];p.resolve(m);}else{client.queue.push(m);if(client.queue.length>800)client.queue.splice(0,100);}});
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
 client.send=obj=>ws.send(JSON.stringify(obj));return client;
}
const map=()=>({moon:0,neon:0,dust:0,void:0});
function fixture(id,name,ore,tokens){return{id,name,credits:500,hold:{...map(),...ore},tokens:{...map(),...tokens},level:1,xp:0,kills:0,deaths:0,upgrades:{laser:1,cargo:1,engine:1}};}

test('two pilots share the world, trade ore for tokens, and construct a persistent outpost', {timeout:22000},async()=>{
 if(typeof WebSocket!=='function')throw new Error('Node.js 22 or newer is needed to run this integration test');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tokenverse-test-'));const port=await freePort();
 const A='a'.repeat(40),B='b'.repeat(40);
 fs.writeFileSync(path.join(dir,'world.json'),JSON.stringify({accounts:{[A]:fixture(A,'Starlight',{moon:16,neon:4,dust:1},{moon:3}),[B]:fixture(B,'OrbitFox',{}, {neon:5})}}));
 const server=spawn(process.execPath,['server.js'],{cwd:ROOT,env:{...process.env,PORT:String(port),DATA_DIR:dir},stdio:'ignore'});
 let one,two;
 try{
  let ready=false;
  for(let i=0;i<45;i++){try{const r=await fetch(`http://127.0.0.1:${port}/health`);if(r.ok){ready=true;break;}}catch{}await sleep(100);}
  assert.ok(ready,'server started');
  one=await connect(`ws://127.0.0.1:${port}/ws`);two=await connect(`ws://127.0.0.1:${port}/ws`);
  one.send({t:'join',id:A,name:'Starlight'});two.send({t:'join',id:B,name:'OrbitFox'});
  await Promise.all([waitMessage(one,m=>m.t==='welcome'),waitMessage(two,m=>m.t==='welcome')]);
  await waitMessage(one,m=>m.t==='world' && m.online===2);
  one.send({t:'list',kind:'moon',qty:2,tokenKind:'neon',price:3});
  const listingWorld=await waitMessage(two,m=>m.t==='world' && m.listings?.length===1);
  two.send({t:'buyListing',id:listingWorld.listings[0].id});
  const purchase=await waitMessage(two,m=>m.t==='self' && m.account.hold.moon===2);
  assert.equal(purchase.account.tokens.neon,2,'buyer paid material tokens');
  const sold=await waitMessage(one,m=>m.t==='self' && m.account.tokens.neon===3);
  assert.equal(sold.account.hold.moon,14,'seller ore was escrowed');
  one.send({t:'input',keys:{right:true}});
  const far=await waitMessage(one,m=>m.t==='world' && m.players.some(p=>p.id===A && p.x>1690),10000);
  one.send({t:'input',keys:{}});
  one.send({t:'build'});
  const constructed=await waitMessage(one,m=>m.t==='self' && m.stationCount===1);
  assert.equal(constructed.account.tokens.moon,1,'station consumed 2 MOON tokens');
  await waitMessage(two,m=>m.t==='world' && m.stations.length===1);
  one.send({t:'chat',text:'Station built!'});
  const chat=await waitMessage(two,m=>m.t==='chat' && m.entry.text==='Station built!');
  assert.equal(chat.entry.name,'Starlight');
 }finally{
  try{one?.ws.close();two?.ws.close();}catch{}
  server.kill('SIGTERM');await new Promise(r=>{if(server.exitCode!==null)return r();server.once('exit',r);setTimeout(()=>{server.kill('SIGKILL');r();},2500).unref();});
  const saved=path.join(dir,'world.json');assert.ok(fs.existsSync(saved),'persistent world save created');
  const data=JSON.parse(fs.readFileSync(saved,'utf8'));assert.equal(data.stations.length,1,'station persisted to disk');
  fs.rmSync(dir,{recursive:true,force:true});
 }
});