(() => {
'use strict';
const $=id=>document.getElementById(id);
const TYPES=['moon','neon','dust','void'];
const ICONS={moon:'◆',neon:'✦',dust:'✶',void:'⬟'};
const COLORS={moon:'#91b9ff',neon:'#50f3d6',dust:'#ffd27a',void:'#c49afa'};
const FALLBACK={moon:{name:'Moonstone',ticker:'MOON',ore:4,payout:2,fee:3,rawPrice:7},neon:{name:'Neonite',ticker:'NEON',ore:3,payout:1,fee:5,rawPrice:16},dust:{name:'Stardust',ticker:'DUST',ore:2,payout:1,fee:8,rawPrice:39},void:{name:'Void crystal',ticker:'VOID',ore:1,payout:1,fee:25,rawPrice:100}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nice=n=>Math.floor(Number(n)||0).toLocaleString('en-US');
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const state={ws:null,online:false,world:null,self:null,defs:FALLBACK,sector:{width:2600,height:1800,cx:1300,cy:900,safe:240},id:'',selected:null,aim:null,keys:{up:false,down:false,left:false,right:false},dockAuto:false,joinAttempt:false,lastShot:0,camX:1300,camY:900};
const canvas=$('gameCanvas'),ctx=canvas.getContext('2d',{alpha:false});
const resize=()=>{let b=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.floor(b.width*dpr));canvas.height=Math.max(1,Math.floor(b.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);};
window.addEventListener('resize',resize);resize();
const stars=Array.from({length:340},(_,i)=>({x:((i*92821+73)%2600),y:((i*44741+97)%1800),s:i%7===0?1.8:i%3===0?1.2:.7,a:.25+(i*37%50)/100}));
let toastTimer;
function toast(message,kind='info'){$('toast').textContent=message;$('toast').className='toast show '+kind;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').className='toast',3500);}
function send(payload){if(state.ws?.readyState===WebSocket.OPEN)state.ws.send(JSON.stringify(payload));}
function link(){return (location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws';}
function getId(){let id=localStorage.getItem('tokenverse-pilot-key');if(!id||!/^[a-zA-Z0-9_-]{24,80}$/.test(id)){id=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');localStorage.setItem('tokenverse-pilot-key',id);}return id;}
$('pilotInput').value=localStorage.getItem('tokenverse-pilot-name')||'';
function join(){
 const name=$('pilotInput').value.trim();if(!name){$('joinError').textContent='Choose a callsign to continue.';return;}
 if(state.joinAttempt)return;state.joinAttempt=true;$('joinError').textContent='Connecting to the shared sector…';$('joinBtn').disabled=true;
 if(!/^https?:$/.test(location.protocol)){$('joinError').textContent='Open this game through the Node server, not directly as a file. See README.md.';state.joinAttempt=false;$('joinBtn').disabled=false;return;}
 try{
  const ws=new WebSocket(link());state.ws=ws;
  ws.addEventListener('open',()=>{send({t:'join',id:getId(),name:name.slice(0,18)});});
  ws.addEventListener('message',e=>{let m;try{m=JSON.parse(e.data);}catch{return;}onMessage(m);});
  ws.addEventListener('close',()=>{state.online=false;state.joinAttempt=false;$('joinBtn').disabled=false;$('joinOverlay').classList.remove('hidden');$('joinError').textContent='Connection lost. Reconnect to rejoin the shared server.';$('connectionText').textContent='OFFLINE';$('connectionLight').parentElement.classList.add('offline');});
  ws.addEventListener('error',()=>{$('joinError').textContent='Cannot reach the multiplayer server. Start it with npm start, or deploy a Node web service.';state.joinAttempt=false;$('joinBtn').disabled=false;});
 }catch(err){$('joinError').textContent='WebSocket unavailable: '+err.message;state.joinAttempt=false;$('joinBtn').disabled=false;}
}
$('joinBtn').addEventListener('click',join);$('pilotInput').addEventListener('keydown',e=>{if(e.key==='Enter')join();});
function onMessage(m){
 if(m.t==='welcome'){
  state.id=m.id;state.sector=m.world;state.defs=m.definitions||FALLBACK;state.online=true;state.joinAttempt=false;
  localStorage.setItem('tokenverse-pilot-name',$('pilotInput').value.trim());
  $('joinOverlay').classList.add('hidden');$('connectionText').textContent='SECTOR ONLINE';$('connectionLight').parentElement.classList.remove('offline');
  $('joinBtn').disabled=false;$('joinError').textContent='';$('chatMessages').innerHTML='';(m.messages||[]).forEach(addChat);toast('Welcome aboard. Your test pilot is connected!','good');return;
 }
 if(m.t==='self'){state.self=m;state.camX=state.camX||m.x;state.camY=state.camY||m.y;return;}
 if(m.t==='world'){state.world=m;state.online=true;return;}
 if(m.t==='notice')toast(m.message,m.kind);
 if(m.t==='chat')addChat(m.entry);
 if(m.t==='error'){$('joinError').textContent=m.message;toast(m.message,'warn');}
}
function addChat(entry){const container=$('chatMessages'),el=document.createElement('div');el.className='chat-line';const time=new Date(entry.t||Date.now()).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});el.innerHTML=`<time>${esc(time)}</time><b>${esc(entry.name)}:</b>${esc(entry.text)}`;container.append(el);while(container.children.length>35)container.firstElementChild.remove();container.scrollTop=container.scrollHeight;}
$('chatForm').addEventListener('submit',e=>{e.preventDefault();const text=$('chatInput').value.trim();if(!text)return;send({t:'chat',text});$('chatInput').value='';});
function getPos(){const w=state.world;return w?.players.find(p=>p.id===state.id)||state.self||{x:1300,y:900,angle:0};}
function nearbyStation(){const p=getPos();return(state.world?.stations||[]).find(s=>s.owner===state.id&&Math.hypot(s.x-p.x,s.y-p.y)<106);}
function getAim(){
 const me=getPos(),w=state.world;if(!w)return me.angle||0;
 if(state.selected?.type==='player'){const enemy=w.players.find(p=>p.id===state.selected.id);if(enemy)return Math.atan2(enemy.y-me.y,enemy.x-me.x);}
 if(state.selected?.type==='station'){const s=w.stations.find(s=>s.id===state.selected.id);if(s)return Math.atan2(s.y-me.y,s.x-me.x);}
 if(state.aim)return Math.atan2(state.aim.y-me.y,state.aim.x-me.x);
 const candidates=[...w.players.filter(p=>p.id!==state.id),...w.stations.filter(s=>s.owner!==state.id)];candidates.sort((a,b)=>Math.hypot(a.x-me.x,a.y-me.y)-Math.hypot(b.x-me.x,b.y-me.y));
 return candidates.length?Math.atan2(candidates[0].y-me.y,candidates[0].x-me.x):(me.angle||0);
}
function fire(){if(!state.online)return;send({t:'fire',angle:getAim()});state.lastShot=performance.now();}
$('fireBtn').addEventListener('click',fire);$('mobileFire').addEventListener('click',fire);
function nearest(){const p=getPos(),xs=(state.world?.asteroids||[]).filter(a=>a.remaining>0);xs.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));if(xs[0]){state.selected={type:'asteroid',id:xs[0].id};state.dockAuto=false;send({t:'target',id:xs[0].id});toast(`Autopilot locked onto ${state.defs[xs[0].kind].name}.`);}}
$('nearestBtn').addEventListener('click',nearest);
$('dockBtn').addEventListener('click',()=>{state.dockAuto=true;state.selected=null;send({t:'stop'});toast('Navigation lock: returning to the central port.');});
// The browser only sends controls; movement, collisions, resources and payouts are calculated by the server.
function setInput(k,pressed){state.keys[k]=pressed;if(pressed){state.dockAuto=false;send({t:'stop'});}}
const keymap={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'};
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;const k=keymap[e.key.toLowerCase()];if(k){e.preventDefault();setInput(k,true);}if(e.code==='Space'){e.preventDefault();if(!e.repeat)fire();}});
window.addEventListener('keyup',e=>{const k=keymap[e.key.toLowerCase()];if(k){e.preventDefault();setInput(k,false);}});
window.addEventListener('blur',()=>{for(const k of Object.keys(state.keys))state.keys[k]=false;send({t:'input',keys:state.keys});});
for(const b of document.querySelectorAll('[data-direction]')){
 const k=b.dataset.direction;const release=e=>{e.preventDefault();setInput(k,false);};
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);setInput(k,true);});
 b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);
}
setInterval(()=>{
 if(!state.online)return;
 const keys={...state.keys};
 if(state.dockAuto){const p=getPos(),dx=state.sector.cx-p.x,dy=state.sector.cy-p.y,d=Math.hypot(dx,dy);if(d<155){state.dockAuto=false;toast('You have returned to the central safe port.','good');}
 else{keys.left=dx < -12;keys.right=dx>12;keys.up=dy < -12;keys.down=dy>12;}}
 send({t:'input',keys});
},75);
canvas.addEventListener('pointerdown',e=>{
 if(!state.online||!state.world)return;
 const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,wx=state.camX+x-r.width/2,wy=state.camY+y-r.height/2;
 state.aim={x:wx,y:wy};
 const p=state.world.players.find(p=>p.id!==state.id&&Math.hypot(p.x-wx,p.y-wy)<35);
 if(p){state.selected={type:'player',id:p.id};toast(`Targeting ${p.name}. Press FIRE to attack outside the safe zone.`,'warn');return;}
 const st=state.world.stations.find(st=>Math.hypot(st.x-wx,st.y-wy)<70);
 if(st){state.selected={type:'station',id:st.id};toast(st.owner===state.id?'Your station selected. Dock here for services.':'Rival outpost targeted.','warn');return;}
 const a=state.world.asteroids.filter(a=>Math.hypot(a.x-wx,a.y-wy)<a.r+22).sort((a,b)=>Math.hypot(a.x-wx,a.y-wy)-Math.hypot(b.x-wx,b.y-wy))[0];
 if(a){state.selected={type:'asteroid',id:a.id};state.dockAuto=false;send({t:'target',id:a.id});toast(`${state.defs[a.kind].name} asteroid selected. Flying to mine.`);return;}
 if(Math.hypot(wx-state.sector.cx,wy-state.sector.cy)<105){state.dockAuto=true;send({t:'stop'});toast('Returning to spaceport.');return;}
 state.selected=null;
});
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=canvas.getBoundingClientRect();state.aim={x:state.camX+e.clientX-r.left-r.width/2,y:state.camY+e.clientY-r.top-r.height/2};}});
function draw(){
 requestAnimationFrame(draw);
 const w=canvas.getBoundingClientRect(),W=w.width,H=w.height;if(W<1||H<1)return;
 ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
 const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#0c1a33');bg.addColorStop(.55,'#08132a');bg.addColorStop(1,'#060b1b');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 const me=getPos();state.camX+=(me.x-state.camX)*.16;state.camY+=(me.y-state.camY)*.16;
 ctx.save();ctx.translate(W/2-state.camX,H/2-state.camY);
 // Nebula atmosphere and infinite-looking stars.
 for(const neb of [{x:350,y:360,r:520,color:'49,57,135'},{x:2150,y:1320,r:460,color:'24,89,116'},{x:1400,y:230,r:340,color:'95,39,107'}]){
  const g=ctx.createRadialGradient(neb.x,neb.y,1,neb.x,neb.y,neb.r);g.addColorStop(0,`rgba(${neb.color},.15)`);g.addColorStop(1,`rgba(${neb.color},0)`);ctx.fillStyle=g;ctx.fillRect(neb.x-neb.r,neb.y-neb.r,neb.r*2,neb.r*2);
 }
 ctx.strokeStyle='#53688a18';ctx.lineWidth=1;for(let x=0;x<state.sector.width;x+=140){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,state.sector.height);ctx.stroke();}for(let y=0;y<state.sector.height;y+=140){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(state.sector.width,y);ctx.stroke();}
 ctx.strokeStyle='#54668a66';ctx.strokeRect(0,0,state.sector.width,state.sector.height);
 for(const s of stars){ctx.globalAlpha=s.a;ctx.fillStyle='#d8e9ff';ctx.beginPath();ctx.arc(s.x,s.y,s.s,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 const {cx,cy,safe}=state.sector;
 const safeGrad=ctx.createRadialGradient(cx,cy,20,cx,cy,safe);safeGrad.addColorStop(0,'#1a5c7e44');safeGrad.addColorStop(.85,'#1e75951b');safeGrad.addColorStop(1,'#3b9db000');ctx.fillStyle=safeGrad;ctx.beginPath();ctx.arc(cx,cy,safe,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#55d0d16a';ctx.lineWidth=2;ctx.setLineDash([7,11]);ctx.beginPath();ctx.arc(cx,cy,safe,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 ctx.save();ctx.translate(cx,cy);ctx.rotate(performance.now()/35000);ctx.strokeStyle='#46b7dccc';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,104,37,-.4,0,2*Math.PI);ctx.stroke();ctx.restore();
 ctx.save();ctx.translate(cx,cy);ctx.shadowColor='#70a6f3';ctx.shadowBlur=24;ctx.fillStyle='#2b3a65';ctx.strokeStyle='#a3b9f4';ctx.lineWidth=3;poly(8,58,Math.PI/8);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#96b6f0';poly(8,30,Math.PI/8);ctx.fill();ctx.fillStyle='#dbf6ff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText('CENTRAL PORT',0,87);ctx.restore();
 for(const a of state.world?.asteroids||[]) drawRock(a);
 for(const s of state.world?.pickups||[])drawPickup(s);
 for(const st of state.world?.stations||[])drawStation(st);
 for(const b of state.world?.bullets||[]){ctx.strokeStyle=b.owner===state.id?'#78eaf4':'#ff779a';ctx.lineWidth=4;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=13;ctx.beginPath();ctx.moveTo(b.x-b.vx*.028,b.y-b.vy*.028);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.shadowBlur=0;}
 for(const p of state.world?.players||[])drawShip(p);
 if(!state.online){ctx.fillStyle='#d9e6fa';ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.fillText('CONNECTED WORLD PREVIEW',state.camX,state.camY+180);}
 ctx.restore();
 drawRadar();
}
function poly(n,r,a0=0){ctx.beginPath();for(let i=0;i<n;i++){const a=a0+i*Math.PI*2/n;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
function drawRock(a){const color=COLORS[a.kind],sel=state.selected?.type==='asteroid'&&state.selected.id===a.id;
 ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.id*1.23);ctx.shadowColor=color;ctx.shadowBlur=sel?28:9;ctx.fillStyle='#1d3452';ctx.strokeStyle=color;ctx.lineWidth=sel?3:1.6;
 ctx.beginPath();for(let i=0;i<9;i++){const rad=a.r*(.81+((i*29+a.id*17)%20)/60),ang=i*Math.PI*2/9,xx=Math.cos(ang)*rad,yy=Math.sin(ang)*rad;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 ctx.fillStyle=color+'9a';ctx.beginPath();ctx.moveTo(-5,-a.r*.65);ctx.lineTo(a.r*.4,-7);ctx.lineTo(0,a.r*.5);ctx.lineTo(-a.r*.3,-2);ctx.fill();ctx.restore();
 if(sel){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(a.x,a.y,a.r+10,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#efffff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(`${a.kind.toUpperCase()} · ${a.remaining} ORE`,a.x,a.y-a.r-17);ctx.restore();}
}
function drawPickup(s){ctx.save();ctx.translate(s.x,s.y);ctx.shadowBlur=17;ctx.shadowColor=COLORS[s.kind];ctx.fillStyle=COLORS[s.kind];ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(9,0);ctx.lineTo(0,9);ctx.lineTo(-9,0);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.restore();}
function drawStation(s){const owner=s.owner===state.id,selected=state.selected?.type==='station'&&state.selected.id===s.id;
 ctx.save();ctx.translate(s.x,s.y);ctx.shadowColor=owner?'#69e9d3':'#df819e';ctx.shadowBlur=selected?26:12;
 ctx.fillStyle='#273550';ctx.strokeStyle=owner?'#73e9db':'#d18cab';ctx.lineWidth=3;
 ctx.beginPath();ctx.ellipse(0,0,63,24,-.28,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.rotate(Math.PI/8);ctx.fillStyle='#47527c';poly(8,41);ctx.fill();ctx.stroke();ctx.fillStyle=owner?'#75d3ec':'#bd92ed';poly(8,24);ctx.fill();ctx.restore();
 ctx.fillStyle='#e0ebff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(s.name+(s.offlineProtected?' ◈ OFFLINE SHIELD':''),s.x,s.y-77);
 if(s.offlineProtected){ctx.strokeStyle='#8bd4ff80';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(s.x,s.y,70,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
 ctx.fillStyle='#233246';ctx.fillRect(s.x-45,s.y+55,90,5);ctx.fillStyle=owner?'#60e5b0':'#e774a0';ctx.fillRect(s.x-45,s.y+55,90*clamp(s.hp/(s.maxHp||440),0,1),5);
}
function drawShip(p){const own=p.id===state.id;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle||0);const pulse=performance.now()/200;
 ctx.shadowColor=own?'#83e8ff':'#ff91ac';ctx.shadowBlur=own?18:11;ctx.fillStyle=own?'#9caaff':'#d891ac';ctx.strokeStyle=own?'#cde6ff':'#ffc1d1';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(27,0);ctx.lineTo(-15,-16);ctx.lineTo(-10,0);ctx.lineTo(-15,16);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#2d416a';ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-3,-5);ctx.lineTo(-3,5);ctx.closePath();ctx.fill();
 ctx.shadowBlur=8;ctx.fillStyle=own?'#72f0eb':'#ffae8d';ctx.beginPath();ctx.moveTo(-15,-7);ctx.lineTo(-24-((pulse|0)%4)*2,0);ctx.lineTo(-15,7);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.restore();
 ctx.textAlign='center';ctx.font='bold 10px sans-serif';ctx.fillStyle=own?'#c5edff':'#f2c2d0';ctx.fillText(p.name+(own?' [YOU]':''),p.x,p.y-31);ctx.fillStyle='#2d354c';ctx.fillRect(p.x-23,p.y-25,46,4);ctx.fillStyle=own?'#69e3b8':'#f07694';ctx.fillRect(p.x-23,p.y-25,46*(p.hp/100),4);
 if(p.invulnerable){ctx.strokeStyle='#75e4f588';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,34,0,Math.PI*2);ctx.stroke();}
}
const radarCanvas=document.createElement('canvas');radarCanvas.width=240;radarCanvas.height=160;$('miniMap').append(radarCanvas);radarCanvas.style='width:100%;height:100%';
function drawRadar(){const r=radarCanvas.getContext('2d'),w=240,h=160,wld=state.sector;r.clearRect(0,0,w,h);r.fillStyle='#0a17339e';r.fillRect(0,0,w,h);
 const dot=(x,y,color,size)=>{r.fillStyle=color;r.beginPath();r.arc(x/wld.width*w,y/wld.height*h,size,0,2*Math.PI);r.fill();};
 dot(wld.cx,wld.cy,'#62d8ee',5);for(const s of state.world?.stations||[])dot(s.x,s.y,'#a8a4ff',4);for(const p of state.world?.players||[])dot(p.x,p.y,p.id===state.id?'#fff':'#f784ac',3);
}
function renderUI(){
 const me=state.self?.account||{name:'Pilot',credits:460,hold:{},tokens:{},upgrades:{laser:1,engine:1,cargo:1},daily:{minted:{}},level:1,xp:0,kills:0};
 const w=state.world||{players:[],asteroids:[],stations:[],listings:[],market:{},recent:[],leaderboard:[],online:0,portBudget:24000};
 const player=getPos();
 const capacity=state.self?.capacity||30,cargo=state.self?.cargo||0,hp=state.self?.hp??100,energy=state.self?.energy??100;
 $('creditsTop').textContent=nice(me.credits);$('walletCredits').textContent=nice(me.credits);
 $('pilotName').textContent=me.name||'PILOT';$('pilotLevel').textContent=`EXPLORER · LEVEL ${me.level}`;
 $('hpText').textContent=`${hp} / 100`;$('hpBar').style.width=hp+'%';
 $('energyText').textContent=energy+'%';$('energyBar').style.width=energy+'%';
 $('cargoText').textContent=`${cargo} / ${capacity}`;$('cargoBar').style.width=100*cargo/capacity+'%';
 $('killsText').textContent=me.kills;$('xpText').textContent=nice(me.xp);$('stationsText').textContent=`${state.self?.stationCount||0} / 2`;
 $('positionText').textContent=`X ${Math.round(player.x)} · Y ${Math.round(player.y)}`;
 $('asteroidCount').textContent=w.asteroids.length;$('onlinePill').textContent=`◉ ${w.online} PILOTS ONLINE`;$('livePilots').textContent=w.online;
 const inPort=Math.hypot(player.x-state.sector.cx,player.y-state.sector.cy)<state.sector.safe;
 const docked=!!state.self?.docked;$('zoneTag').textContent=inPort?'◉ PORT SAFE ZONE':'⚔ PVP COMBAT ZONE';$('zoneTag').classList.toggle('danger',!inPort);
 $('dockTag').textContent=docked?'⌂ DOCKED & TRADING':'↗ FREE FLIGHT';$('dockTag').classList.toggle('faded',!docked);
 $('targetHint').textContent=state.dockAuto?'⌂ RETURNING TO SAFE PORT':state.selected?.type==='asteroid'?'◈ ASTEROID LOCKED · MINING':state.selected?.type==='player'?'⚔ RIVAL TARGETED · FIRE TO ATTACK':'TAP AN ASTEROID TO AUTO-MINE';
 $('tipTitle').textContent=docked?'Docking complete. Markets available.':inPort?'Protected port zone. Weapons offline.':'Combat enabled. Stay alert!';
 $('tipDetail').textContent=docked?'Refine ore, trade tokens, or upgrade your ship.':inPort?'Leave the ring to mine rocks and fight rivals.':'Ships and stations can be damaged beyond the shield.';
 $('cargoSummary').textContent=`${cargo} / ${capacity} STORAGE USED`;
 $('marketDockStatus').textContent=docked?'● PORT SERVICES ONLINE':'⌂ DOCK TO TRADE & REFINE';
 $('cargoGrid').innerHTML=TYPES.map(k=>`<div class="cargo-card"><span class="cargo-gem" style="color:${COLORS[k]}">${ICONS[k]}</span><div><strong>${esc(state.defs[k].name)}</strong><small>${k.toUpperCase()} ORE</small></div><b class="qty">${nice(me.hold[k]||0)}</b></div>`).join('');
 $('tokenWallet').innerHTML=TYPES.map(k=>`<div class="token-box"><span class="token-symbol" style="color:${COLORS[k]}">${ICONS[k]} $${state.defs[k].ticker}</span><strong>${nice(me.tokens[k])}</strong><small>SIMULATED TOKEN</small></div>`).join('');
 const extra={laser:{1:'1 $NEON',2:'2 $NEON',3:'1 $DUST',4:'1 $VOID'},engine:{1:'1 $NEON',2:'1 $DUST',3:'2 $DUST',4:'1 $VOID'},cargo:{1:'2 $MOON',2:'3 $MOON',3:'2 $NEON',4:'1 $DUST'}};
 const upgrades=[['laser','⚡','Pulse laser','Mining speed'],['engine','➤','Ion engine','Ship movement'],['cargo','▣','Cargo bay','Ore capacity']];
 $('upgradeList').innerHTML=upgrades.map(([k,ic,name,sub])=>{const level=me.upgrades[k],cost=level*level*80+40;return `<div class="upgrade"><div class="upgrade-icon">${ic}</div><div><div class="upgrade-name">${name} <b>LV ${level}</b></div><div class="upgrade-sub">${level>=5?'MAX LEVEL':`${sub} · ${cost} $JUNK + ${extra[k][level]}`}</div></div><button aria-label="Upgrade ${name}" data-action="upgrade" data-kind="${k}" ${level>=5?'disabled':''}>+</button></div>`;}).join('');
 const needs=[['moon',10],['neon',4],['dust',1]];const req=[...needs.map(([k,q])=>[`${q} ${k.toUpperCase()} ORE`,(me.hold[k]||0)>=q]),['2 $MOON',(me.tokens.moon||0)>=2],['160 $JUNK',(me.credits||0)>=160]];
 $('stationRequirements').innerHTML=req.map(([label,okay])=>`<span class="${okay?'met':''}">${okay?'✓ ':''}${label}</span>`).join('');
 $('marketList').innerHTML=TYPES.map(k=>{
 const d=state.defs[k],m=w.market[k]||{},p=Number(m.price||0).toFixed(2),canRefine=(me.hold[k]||0)>=d.ore;
 return `<div class="market-card"><div class="market-card-head"><div class="market-info"><span class="market-gem" style="color:${COLORS[k]}">${ICONS[k]}</span><div><b>${esc(d.name)}</b><small>$${d.ticker} · ${nice(me.tokens[k])} OWNED</small></div></div><div class="market-price"><strong>${p} <small style="display:inline">$JUNK</small></strong><span>PER TOKEN · AMM</span></div></div><div class="market-actions"><button data-action="buy" data-kind="${k}" data-qty="1">+ BUY 1</button><button class="sell" data-action="sell" data-kind="${k}" data-qty="1">− SELL 1</button><button class="refine" data-action="refine" data-kind="${k}">✧ REFINE</button></div><div class="market-actions" style="margin-top:5px"><button data-action="sellOre" data-kind="${k}" data-qty="1">SELL 1 ORE</button><button data-action="sellOre" data-kind="${k}" data-qty="5">SELL 5 ORE</button></div><div class="market-card-foot"><span>${d.ore} ORE → ${d.payout} $${d.ticker} · ${d.fee} $JUNK FEE</span><span>DAY POOL: ${nice(m.dailyRemaining||0)}</span></div></div>`;
 }).join('');
 $('economyHealth').innerHTML=`<div class="economy-bit"><small>GLOBAL PORT BUY BUDGET</small><strong>${nice(w.portBudget)} $JUNK</strong></div><div class="economy-bit"><small>ACTIVE TRADERS / PILOTS</small><strong>${w.online}</strong></div>${TYPES.map(k=>`<div class="economy-bit"><small>$${state.defs[k].ticker} BURNED</small><strong>${nice(w.market[k]?.burned||0)}</strong></div>`).join('')}`;
 const owned=w.stations.filter(s=>s.owner===state.id);
 $('stationList').innerHTML=owned.length?owned.map(s=>`<div class="station-item"><div><b>⬡ ${esc(s.name)}</b><small>X ${s.x} · Y ${s.y} · Storage ${TYPES.reduce((n,k)=>n+(s.storage[k]||0),0)} / ${140*(s.tier||1)} ore · TIER ${s.tier||1} · NEON AMMO ${s.storage.neon||0}</small></div><strong>${s.hp} / ${s.maxHp} HP</strong></div>`).join(''):'<p class="empty">No outposts yet. Mine the resources and construct one beyond the safe zone.</p>';
 $('playerListings').innerHTML=w.listings?.length?w.listings.map(x=>`<div class="listing-row"><div><b>${nice(x.qty)} ${esc(state.defs[x.kind].name)} ore</b><small>Seller: ${esc(x.ownerName)}</small></div><div><strong>${nice(x.price)} $${state.defs[x.tokenKind].ticker}</strong><button data-action="${x.owner===state.id?'cancelListing':'buyListing'}" data-id="${x.id}">${x.owner===state.id?'CANCEL':'BUY'}</button></div></div>`).join(''):'<p class="empty">No listings yet. Be the first to trade.</p>';
 $('leaderboard').innerHTML=w.leaderboard.length?w.leaderboard.map((p,i)=>`<div class="leader-row"><div><b>${i+1}. ${esc(p.name)}${p.id===state.id?' (YOU)':''}</b><small>Level ${p.level}</small></div><strong>⚔ ${p.kills}</strong></div>`).join(''):'<p class="empty">Awaiting pilots...</p>';
 $('eventFeed').innerHTML=w.recent.length?w.recent.map(e=>`<div class="feed-line ${esc(e.type)}"><small>${new Date(e.t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small>${esc(e.detail)}</div>`).join(''):'<div class="empty">Space traffic begins here.</div>';
}
setInterval(renderUI,380);renderUI();requestAnimationFrame(draw);
document.body.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(!b)return;
 if(!state.online){toast('Connect to the multiplayer server before taking actions.','warn');return;}
 const t=b.dataset.action;if(['buy','sell','sellOre'].includes(t))send({t,kind:b.dataset.kind,qty:Number(b.dataset.qty)});
 else if(t==='refine')send({t:'refine',kind:b.dataset.kind});
 else if(t==='upgrade')send({t:'upgrade',kind:b.dataset.kind});
 else if(t==='station')send({t:'station',mode:b.dataset.mode});
 else if(t==='build')send({t:'build'});
 else if(t==='repairShip')send({t:'repairShip'});
 else if(t==='warp')send({t:'warp'});
 else if(t==='buyListing'||t==='cancelListing')send({t,id:Number(b.dataset.id)});
});
$('listingForm').addEventListener('submit',e=>{e.preventDefault();if(!state.online)return toast('Join the sector to post a listing.','warn');send({t:'list',kind:$('listKind').value,qty:Number($('listQty').value),tokenKind:$('listToken').value,price:Number($('listPrice').value)});});
function toggleHelp(on){$('helpOverlay').classList.toggle('hidden',!on);}
$('helpBtn').addEventListener('click',()=>toggleHelp(true));$('closeHelp').addEventListener('click',()=>toggleHelp(false));$('helpDone').addEventListener('click',()=>toggleHelp(false));
window.addEventListener('keydown',e=>{if(e.key==='Escape')toggleHelp(false);});
$('joinOverlay').classList.remove('hidden');
})();