/* Warp Coin v0.22 — self-contained third-person WebGL2 scene.
 * Renders a real 3D world using the existing solo 2D flight simulation.
 * No remote libraries, textures or database.
 */
(function(root){
'use strict';
const M=root.Warp3DCore;
const palette={
 orion:{light:'#78deff',planet:'#4068c9',back:'#101d40'},
 borealis:{light:'#a0e8ff',planet:'#80c6e9',back:'#102b47'},
 helios:{light:'#ffbf8d',planet:'#c66a4d',back:'#422035'},
 forge:{light:'#f5a08a',planet:'#a95146',back:'#45192c'},
 umbra:{light:'#c4a3ff',planet:'#8865c2',back:'#2b194e'},
 homestead:{light:'#afffda',planet:'#66be99',back:'#153749'}
};
function create(canvas){
 const fallback={available:false,render:()=>false,resize:()=>{},pick:()=>null,dispose:()=>{},failed:true};
 if(!M||!canvas||typeof canvas.getContext!=='function')return fallback;
 let gl;
 try{
  gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'high-performance',depth:true});
  if(!gl||typeof gl.createVertexArray!=='function'||typeof gl.getParameter!=='function'||
   !String(gl.getParameter(gl.VERSION)||'').includes('WebGL 2.0'))return fallback;
 }catch{return fallback;}
 const state={failed:false,width:1280,height:720,pixelRatio:1,angle:null,camera:null,frames:0,error:null};
 const bufs=[],mesh={};let program,vao,starlight;
 const color=M.color;
 function compile(type,source){
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader)||'Shader error');
  return shader;
 }
 function upload(data){
  const b=gl.createBuffer();bufs.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  return {buffer:b,count:data.length/6};
 }
 function useBuffer(asset){
  gl.bindBuffer(gl.ARRAY_BUFFER,asset.buffer);
  gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
 }
 let uniforms;
 try{
  const vs=compile(gl.VERTEX_SHADER,M.VERTEX),fs=compile(gl.FRAGMENT_SHADER,M.FRAGMENT);
  program=gl.createProgram();
  gl.attachShader(program,vs);gl.attachShader(program,fs);
  gl.bindAttribLocation(program,0,'aPos');gl.bindAttribLocation(program,1,'aNormal');
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'Program link error');
  gl.deleteShader(vs);gl.deleteShader(fs);
  vao=gl.createVertexArray();gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);
  uniforms={view:gl.getUniformLocation(program,'uVP'),model:gl.getUniformLocation(program,'uModel'),
   tint:gl.getUniformLocation(program,'uTint'),glow:gl.getUniformLocation(program,'uGlow'),
   points:gl.getUniformLocation(program,'uPoints'),size:gl.getUniformLocation(program,'uSize'),
   opacity:gl.getUniformLocation(program,'uOpacity')};
  for(const name of ['ship','wing','canopy','octa','cube','rock','sphere'])mesh[name]=upload(M.geometry(name));
  mesh.ring=upload(M.torus(1,.09,false));
  mesh.portal=upload(M.torus(1,.1,true));
  const stars=[];
  for(let i=0;i<1700;i++){
   const radius=800+M.hash(i*11.3)*9300,a=2*Math.PI*M.hash(i*14.1),height=(M.hash(i*3.17)-.47)*9000;
   stars.push(Math.cos(a)*radius,height,Math.sin(a)*radius,0,1,0);
  }
  starlight=upload(new Float32Array(stars));
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
 }catch(e){state.failed=true;state.error=String(e);return fallback;}
 canvas.addEventListener?.('webglcontextlost',e=>{e.preventDefault?.();state.failed=true;});
 function resize(width,height,ratio=1){
  if(state.failed)return;
  state.width=Math.max(1,Math.floor(width));state.height=Math.max(1,Math.floor(height));
  state.pixelRatio=Math.max(.5,Math.min(1.5,Number(ratio)||1));
  canvas.width=Math.max(1,Math.floor(state.width*state.pixelRatio));
  canvas.height=Math.max(1,Math.floor(state.height*state.pixelRatio));
  gl.viewport(0,0,canvas.width,canvas.height);
 }
 function paint(id,x,y,z,angle,scale,tint,glow=0){
  const asset=mesh[id];if(!asset)return;
  gl.uniformMatrix4fv(uniforms.model,false,M.model(x,y,z,angle,...scale));
  gl.uniform3fv(uniforms.tint,color(tint));
  gl.uniform1f(uniforms.glow,glow);gl.uniform1f(uniforms.points,0);
  gl.uniform1f(uniforms.opacity,1);
  useBuffer(asset);gl.drawArrays(gl.TRIANGLES,0,asset.count);
 }
 function near(x,z,max){return Math.abs(x)<max&&Math.abs(z)<max}
 function render(scene){
  if(state.failed||!scene||!scene.ship)return false;
  try{
   const ship=scene.ship,t=scene.time||0,quality=scene.quality||'medium',q=quality==='low'?0:quality==='high'?2:1;
   let heading=Number(ship.angle)||0;
   if(state.angle===null)state.angle=heading;
   const delta=Math.atan2(Math.sin(heading-state.angle),Math.cos(heading-state.angle));
   state.angle+=delta*.18;
   const cam=M.cameraFor(ship,state.angle,state.width,state.height,scene.zoom||1);
   state.camera=cam;
   const vp=M.multiply(cam.projection,cam.view);
   gl.useProgram(program);gl.bindVertexArray(vao);
   gl.viewport(0,0,canvas.width,canvas.height);gl.uniformMatrix4fv(uniforms.view,false,vp);
   gl.uniform1f(uniforms.size,q===0?1.6:q===2?2.85:2.25);
   const p=palette[ship.system]||palette.orion,bg=color(p.back);
   gl.clearColor(bg[0]*.2,bg[1]*.24,bg[2]*.28,1);
   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   // Truly spatial stars: points at different depth planes with perspective.
   gl.depthMask(false);gl.uniformMatrix4fv(uniforms.model,false,M.model());
   gl.uniform3fv(uniforms.tint,color(p.light));gl.uniform1f(uniforms.opacity,.78);
   gl.uniform1f(uniforms.points,1);gl.uniform1f(uniforms.glow,1);
   useBuffer(starlight);gl.drawArrays(gl.POINTS,0,q===0?300:q===2?1700:850);
   gl.depthMask(true);
   // Deep-system gas giant: physical sphere and rotating orbital ring.
   paint('sphere',3400,1050,-4300,t*.0002,[560,560,560],p.planet,.15);
   paint('ring',3400,1050,-4300,t*.002,[830,830,830],p.light,.32);
   if(ship.system==='homestead'&&scene.star){
    const x=scene.star.x-ship.x,z=scene.star.y-ship.y;
    if(near(x,z,13000)){paint('sphere',x,160,z,0,[165,165,165],'#ffcd76',1.4);
     paint('ring',x,160,z,t*.07,[240,240,240],'#f4a363',.7);}
   }
   const range=q===0?1700:q===2?3500:2700, maxRocks=q===0?50:q===2?170:105;
   let seen=0;
   for(const a of scene.asteroids||[]){
    if(a.ore<=0)continue;
    const x=a.x-ship.x,z=a.y-ship.y;
    if(!near(x,z,range))continue;
    const r=Math.max(4,Number(a.r)||14);
    const hue={moon:'#91aacd',neon:'#54cbcb',dust:'#dbb078',void:'#9673bd',diam:'#a9efff'}[a.kind]||'#93a5b8';
    paint('rock',x,Math.sin(a.id||0)*4,z,(a.rot||0)+t*.04,[r,r*.85,r],hue,.08);
    if(a.kind==='diam'||a.kind==='void')paint('octa',x,r*.63,z,0,[r*.2,r*.24,r*.18],hue,.8);
    if(++seen>=maxRocks)break;
   }
   for(const st of [...(scene.stations||[]),...(scene.outposts||[]).filter(x=>x.system===ship.system)]){
    const x=st.x-ship.x,z=st.y-ship.y;if(!near(x,z,6300))continue;
    const tint=st.color||'#7fe9ec',owner=st.kind==='faction'?'#6b65ac':'#37789d';
    paint('cube',x,35,z,t*.075,[36,19,35],owner,.1);
    paint('ring',x,35,z,t*.16,[80,80,80],tint,.55);
    paint('portal',x,36,z,t*.12,[57,57,57],tint,.24);
    for(let k=0;k<4;k++){const a=k*Math.PI/2+t*.055;
     paint('cube',x+Math.cos(a)*58,29,z+Math.sin(a)*58,t*.03,[12,10,17],tint,.25);}
   }
   if(ship.system!=='homestead')for(const gate of scene.gates||[]){
    const x=gate.x-ship.x,z=gate.y-ship.y;if(!near(x,z,6500))continue;
    paint('portal',x,74,z,t*.13,[90,90,90],gate.color||'#76e8ff',.8);
    paint('sphere',x,74,z,0,[15,15,15],'#b4f8ff',1.2);
    paint('ring',x,7,z,0,[82,82,82],gate.color||'#80ddff',.22);
   }
   const hostiles=[...(scene.drones||[]),...(scene.patrols||[]).filter(x=>!x.downUntil||x.downUntil<=Date.now())];
   if(scene.boss)hostiles.push({...scene.boss,boss:true});
   if(scene.rift?.inside&&scene.rift.guardianHp>0)hostiles.push({x:3180,y:1320,angle:t*.3,tier:7,boss:true,hp:scene.rift.guardianHp,maxHp:450});
   let bad=0;
   for(const d of hostiles){
    const x=d.x-ship.x,z=d.y-ship.y;if(!near(x,z,2350))continue;
    const angle=-(d.angle||0),s=d.boss?2.1:.67+Math.min(5,d.tier||1)*.08;
    const tint=d.boss?'#b488f6':d.pirateEncounter?'#ff6d8c':d.faction?'#91b2f5':'#ef8697';
    paint('ship',x,d.boss?52:22,z,angle,[s,s,s],tint,.15);
    paint('canopy',x,d.boss?52:22,z,angle,[s,s,s],d.boss?'#ecb7ff':'#ffc6d6',.5);
    if(d.hp>0&&d.maxHp)paint('cube',x,70+(d.boss?34:0),z,0,[28*Math.max(0,d.hp/d.maxHp),2,3],d.hp/d.maxHp>.45?'#9bfad9':'#ff738c',.65);
    if(++bad>(q===0?30:76))break;
   }
   for(const c of scene.convoys||[]){
    const x=c.x-ship.x,z=c.y-ship.y;if(!near(x,z,2000))continue;
    paint('ship',x,21,z,-(c.phase||0),[.85,.85,.85],'#7fe6c9',.1);
   }
   const sig=scene.signal;
   if(sig&&sig.system===ship.system){
    const x=sig.x-ship.x,z=sig.y-ship.y;
    if(near(x,z,3400)){
     const col={pirates:'#ff89af',wreck:'#80e9ff',distress:'#90ffd3',cache:'#cda4ff'}[sig.kind]||'#9ce8ff';
     paint('ring',x,8,z,t*.2,[67,67,67],col,.9);
     paint('octa',x,54+Math.sin(t*2)*8,z,t,[18,32,18],col,.8);
    }
   }
   if(scene.autopilot?.path){
    let shown=0;
    for(let i=scene.autopilot.step||0;i<scene.autopilot.path.length&&shown<45;i++){
     const target=scene.autopilot.path[i],x=target.x-ship.x,z=target.y-ship.y;
     if(!near(x,z,2700))continue;
     paint('ring',x,1,z,0,[23,23,23],'#55cdea',.6);shown++;
    }
   }
   if(scene.rift?.inside)for(const d of scene.rift.deposits||[]){
    if(!d.ore)continue;const x=d.x-ship.x,z=d.y-ship.y;if(!near(x,z,2500))continue;
    const rad=Math.max(20,d.radius||40);
    paint('rock',x,14,z,t*.05,[rad,rad*.85,rad],d.kind==='diam'?'#c1f7ff':'#c5b4fc',.25);
   }
   let ammo=0;
   for(const b of ((scene.rift?.inside?scene.riftBullets:scene.bullets)||[])){
    const x=b.x-ship.x,z=b.y-ship.y;if(!near(x,z,1800))continue;
    const rad=b.weapon==='siege'?9:b.weapon==='plasma'?7:4;
    paint('octa',x,22,z,-Math.atan2(b.vy||0,b.vx||1),[rad*1.7,rad*.9,rad*.9],b.color||'#afffff',1.15);
    if(++ammo>=115)break;
   }
   for(const b of (scene.particles||[]).slice(0,90)){
    const x=b.x-ship.x,z=b.y-ship.y;if(!near(x,z,950))continue;
    paint('octa',x,19+Math.sin(x+t*4)*5,z,0,[Math.max(1,b.size||1),2,2],b.color||'#bfffff',1);
   }
   // Main ship, geometric cockpit, independent wings and thruster in 3D.
   const a=-(ship.angle||0),wide=Math.max(.8,Math.min(1.8,(scene.shipShape?.wing||22)/22));
   const hull=ship.ship||{};
   paint('ship',0,19,0,a,[wide,1,wide],hull.hull||'#9abedc',.1);
   paint('wing',0,19,0,a,[wide,1,wide],hull.accent||'#54d1e5',.27);
   paint('wing',0,19,0,a,[wide,1,-wide],hull.accent||'#54d1e5',.27);
   paint('canopy',0,19,0,a,[wide,1,wide],'#cffaff',.65);
   if(scene.thrust||Math.hypot(ship.vx||0,ship.vy||0)>30){
    const speed=scene.cruising?75:40+Math.sin(t*20)*5;
    const dx=-Math.cos(ship.angle||0),dz=-Math.sin(ship.angle||0);
    paint('octa',dx*speed*.52,19,dz*speed*.52,a,[speed*.64,6,7],scene.cruising?'#83e6ff':'#64e6cd',1.5);
    paint('sphere',dx*22,19,dz*22,0,[8,8,8],'#dfffff',1.35);
   }
   state.frames++;return true;
  }catch(e){state.failed=true;state.error=String(e);return false;}
 }
 function pick(screenX,screenY,x,y){
  return state.failed||!state.camera?null:M.pickRay(state.camera,screenX,screenY,x,y);
 }
 function project(worldX,worldY,altitude,shipX,shipY){
  return state.failed||!state.camera?null:
    M.project(state.camera,worldX-shipX,altitude,worldY-shipY);
 }
 function dispose(){
  try{for(const b of bufs)gl.deleteBuffer(b);gl.deleteVertexArray(vao);gl.deleteProgram(program);}catch{}
  state.failed=true;
 }
 return {available:true,render,resize,pick,project,dispose,get failed(){return state.failed},get error(){return state.error}};
}
root.Warp3D=Object.freeze({create});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
