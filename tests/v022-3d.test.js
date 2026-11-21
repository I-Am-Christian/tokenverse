import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=(path)=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const context={};
vm.runInNewContext(read('docs/scene-3d-core.js'),context);
vm.runInNewContext(read('docs/scene-3d.js'),context);
const core=context.Warp3DCore,render3D=context.Warp3D;

function fakeGL(){
 const calls={draws:0,points:0,triangles:0,viewport:0};
 let next=0;
 const f=()=>({id:++next});
 const gl={
  VERSION:0x1F02,VERTEX_SHADER:0x8B31,FRAGMENT_SHADER:0x8B30,
  COMPILE_STATUS:0x8B81,LINK_STATUS:0x8B82,
  ARRAY_BUFFER:0x8892,STATIC_DRAW:0x88E4,TRIANGLES:4,POINTS:0,
  FLOAT:0x1406,DEPTH_TEST:0x0B71,LEQUAL:0x0203,CULL_FACE:0x0B44,
  BLEND:0x0BE2,SRC_ALPHA:0x0302,ONE_MINUS_SRC_ALPHA:0x0303,
  COLOR_BUFFER_BIT:0x4000,DEPTH_BUFFER_BIT:0x0100,
  getParameter:()=> 'WebGL 2.0 Mock',
  createShader:f,shaderSource(){},compileShader(){},getShaderParameter:()=>true,getShaderInfoLog:()=>'',deleteShader(){},
  createProgram:f,attachShader(){},bindAttribLocation(){},linkProgram(){},useProgram(){},getProgramParameter:()=>true,
  getProgramInfoLog:()=>'',deleteProgram(){},createVertexArray:f,bindVertexArray(){},enableVertexAttribArray(){},
  createBuffer:f,bindBuffer(){},bufferData(){},vertexAttribPointer(){},
  getUniformLocation:f,uniformMatrix4fv(){},uniform3fv(){},uniform1f(){},
  enable(){},disable(){},depthFunc(){},blendFunc(){},clearColor(){},clear(){},depthMask(){},
  viewport(){calls.viewport++;},deleteBuffer(){},deleteVertexArray(){},flush(){},
  drawArrays(mode,first,count){assert.ok(Number.isFinite(count)&&count>0);calls.draws++;
    if(mode===this.POINTS)calls.points++;else if(mode===this.TRIANGLES)calls.triangles++;}
 };
 return {gl,calls};
}
test('true WebGL2 render modules are local, self-contained and valid scripts',()=>{
 assert.ok(core);
 assert.equal(typeof render3D.create,'function');
 assert.match(read('docs/scene-3d-core.js'),/precision highp float/);
 assert.match(read('docs/scene-3d.js'),/getContext\('webgl2'/);
 assert.doesNotMatch(read('docs/scene-3d.js'),/https?:\/\/|import\(/);
});
test('3D mathematical primitives have valid normals and finite matrices',()=>{
 const arrays=['ship','wing','canopy','rock','octa','sphere','cube'];
 for(const a of arrays){
  const geom=core.geometry(a);
  assert.ok(geom.length>0&&geom.length%18===0,a);
  assert.ok(Array.from(geom).every(Number.isFinite),a);
 }
 assert.ok(core.torus().length>0);
 assert.ok(core.torus(1,.1,true).length>0);
 for(const m of [core.perspective(1,16/9,1,2000),core.lookAt([3,5,9],[1,2,0]),core.model(3,4,5,1.2,2,3,4)])
  assert.equal(m.length,16);
 const identity=core.model();
 const p=core.perspective(1,1,1,1000),recovered=core.multiply(p,identity);
 for(let i=0;i<16;i++)assert.ok(Math.abs(p[i]-recovered[i])<1e-5);
});
test('third-person ray picking projects forward along existing galaxy X/Y world plane',()=>{
 const ship={x:94000,y:61000,angle:0};
 let camera=core.cameraFor(ship,0,1280,720);
 let pick=core.pickRay(camera,640,360,ship.x,ship.y);
 assert.ok(pick&&pick.x>ship.x+20);
 assert.ok(Math.abs(pick.y-ship.y)<1,'center ray follows ship forward X axis');
 camera=core.cameraFor(ship,Math.PI/2,1280,720);
 pick=core.pickRay(camera,640,360,ship.x,ship.y);
 assert.ok(pick&&pick.y>ship.y+20);
 assert.ok(Math.abs(pick.x-ship.x)<1);
 assert.equal(core.pickRay(camera,500,0,ship.x,ship.y),null,'above-horizon click is not a fictional target');
});
test('real WebGL2-style context renders a complete space scene with depth and multiple meshes',()=>{
 const {gl,calls}=fakeGL();
 const canvas={width:0,height:0,getContext(type){assert.equal(type,'webgl2');return gl;},addEventListener(){}};
 const renderer=render3D.create(canvas);
 assert.equal(renderer.available,true);
 renderer.resize(1280,720,2);
 assert.equal(canvas.width,1920,'pixel ratio is capped for mobile graphics budgets');
 const ship={x:96000,y:56000,angle:.3,ship:{hull:'#9acdef',accent:'#8ef8e1'},system:'orion',vx:30,vy:10};
 const objects={
  ship,quality:'medium',time:4,cruising:true,thrust:true,
  asteroids:[{id:1,x:96120,y:56025,r:24,ore:7,kind:'neon',rot:0}],
  drones:[{id:'pirate',x:96260,y:56048,angle:1,tier:3,hp:52,maxHp:90,pirateEncounter:'a'}],
  stations:[{x:96180,y:56080,kind:'port',color:'#70dfff'}],
  gates:[{x:96600,y:56100,color:'#9eeeff'}],
  bullets:[{x:96120,y:56000,vx:780,vy:0,weapon:'rail',color:'#7fffa0'}],
  particles:[{x:96100,y:55900,size:3,color:'#ff99a9'}],
  outposts:[],patrols:[],convoys:[],signal:{system:'orion',x:96090,y:56150,kind:'wreck'},
  autopilot:{step:0,path:[{x:96075,y:56150}]}
 };
 const rendered=renderer.render(objects);
 assert.equal(rendered,true,renderer.error||'WebGL draw did not complete');
 assert.ok(calls.triangles>=12,'ships, asteroids, stations and gates are actual triangles');
 assert.ok(calls.points>=1,'the scene uses true perspective star points');
 assert.ok(calls.viewport>=2);
 const point=renderer.pick(640,360,ship.x,ship.y);
 assert.ok(point?.range>0);
 assert.equal(renderer.failed,false);
 renderer.dispose();
 assert.equal(renderer.failed,true);
});
test('lack of WebGL2 safely returns the nonfatal 2D fallback',()=>{
 const canvas={getContext:()=>null};
 const renderer=render3D.create(canvas);
 assert.equal(renderer.available,false);
 assert.equal(renderer.render({ship:{x:10,y:10}}),false);
 assert.equal(renderer.pick(1,1,0,0),null);
});
test('published root and docs carry the same full gameplay with working 3D and 2D modes',()=>{
 const root=read('index.html'),docs=read('docs/index.html');
 assert.match(root,/<title>Warp Coin v0\.22/);
 assert.match(docs,/<title>Warp Coin v0\.22/);
 assert.match(root,/id="space3d"/);
 assert.match(root,/id="viewModeBtn"/);
 assert.match(root,/src="\.\/docs\/scene-3d-core\.js"/);
 assert.match(root,/src="\.\/docs\/scene-3d\.js"/);
 assert.match(docs,/src="\.\/scene-3d-core\.js"/);
 assert.match(docs,/src="\.\/scene-3d\.js"/);
 const r=root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
 const d=docs.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
 assert.equal(r,d,'root and docs have identical simulation and 3D integration');
 assert.doesNotThrow(()=>new Function(r));
 assert.match(r,/scene3d\.render\(/);
 assert.match(r,/function warp22ToggleMode\(/);
 assert.match(r,/function warp22Enabled\(/);
 assert.match(r,/function warp22Draw\(/);
 assert.match(r,/if\(warp22Draw\(\)\)return/);
 assert.match(r,/scene3d\.pick\(e\.clientX,e\.clientY,S\.x,S\.y\)/);
 assert.match(r,/if\(warp22Enabled\(\)\&\&!autopilot\)/);
});
test('existing save, account model, economy, warp and combat rules stay intact',()=>{
 const root=read('index.html');
 assert.match(root,/tokenverse-deep-space-v10/);
 assert.match(root,/S\.saveVersion=20/);
 assert.match(root,/WORLD=\{w:192000,h:115200/);
 assert.match(root,/function warp18PulseJump\(\)/);
 assert.match(root,/function extMarketTick\(/);
 assert.match(root,/function fireGun\(\)/);
 assert.match(root,/function warp19Create\(\)/);
});

function boot3D(html, starting=null, runtimeRenderer=null){
 const raw=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 new Function(raw);
 const modified=raw.replace('(()=>{','return (()=>{').replace(/\}\)\(\);\s*$/,`return {S,draw,warp22Enabled,warp22ToggleMode,warp20ToggleDrive,get autopilot(){return autopilot},warp18PulseJump,warp18SystemDiscovery,warp18StationDiscovery,warp18SafeCorridor,setAutopilot,get warp18Cruising(){return warp18Cruising},WORLD,SHIPS,GUNS,SYSTEMS,FACTIONS,WARP_HUB,WARP_STAR,WARP_COLONY_MODS,STATIONS,GATES,ZONES,DEEP_RIM_STATIONS,warp16Transit,warp16Init,warpClaim,warpHomeWarp,warpLeave,warpUpgrade,warpRename,warpPlanetChange,warpProduction,warpLoad,warpDeposit,warpStoredCount,warpStoreCap,warpRenderEconomy,currentStation,updateShip,renderUI,planRoute,draw,spawnWorld,warpRadar,get dockedStation(){return dockedStation},get asteroids(){return asteroids},get drones(){return drones}};})();`);
 let seq=0;const elements=new Map(),store=new Map(starting?Object.entries(starting):[]),nop=()=>{};
 const graph=new Proxy({createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}}, {get(o,k){return o[k]||nop},set(o,k,v){o[k]=v;return true}});
 function elem(id){if(!elements.has(id)){
  const states=new Set(),cls={contains:k=>states.has(k),add:k=>states.add(k),remove:k=>states.delete(k),toggle(k,v){if(v===undefined?!states.has(k):v)states.add(k);else states.delete(k);return states.has(k)}};
  elements.set(id,{id,style:{},innerHTML:'',textContent:'',value:'',checked:false,disabled:false,children:[],classList:cls,
   addEventListener:nop,setAttribute:nop,getAttribute:()=>'',hasAttribute:()=>false,appendChild:nop,removeChild:nop,prepend:nop,click:nop,closest:()=>null,
   insertBefore:nop,querySelector:()=>null,getBoundingClientRect:()=>({left:0,right:1500,top:0,bottom:1080,width:1920,height:1080}),getContext:()=>graph});
 }return elements.get(id)}
 const document={getElementById:elem,querySelectorAll:()=>[],createElement:()=>elem('new-'+(++seq))};
 const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const current={now:Date.parse('2026-11-18T12:00:00Z')};const ODate=Date;
 class FakeDate extends ODate{static now(){return current.now;}}
 const api=new Function('document','window','localStorage','requestAnimationFrame','addEventListener','innerWidth','innerHeight','setTimeout','clearTimeout','performance','crypto','confirm','Date',modified)(document,{devicePixelRatio:1,Warp3D:{create:()=>runtimeRenderer}},localStorage,nop,nop,1920,1080,nop,nop,{now:()=>2000},{randomUUID:()=>String(++seq)},()=>true,FakeDate);
 return {api,elem,current,store};
}




test('the real in-page game enters active 3D, draws a camera frame, toggles to 2D and back',()=>{
 let frames=0,resizes=0;
 const renderer={
  available:true,failed:false,
  render(scene){frames++;assert.ok(scene.ship&&scene.asteroids&&scene.stations);return true;},
  resize(){resizes++;},pick(){return null;},project(){return null;}
 };
 const {api,elem,store}=boot3D(read('index.html'),null,renderer);
 assert.equal(api.warp22Enabled(),true);
 assert.ok(resizes>=1);
 assert.equal(elem('space3d').style.display,'block');
 assert.equal(elem('viewModeLabel').textContent,'◆ 3D ON');
 assert.equal(elem('gameShell').classList.contains('warp-3d-mode'),true);
 api.draw();
 assert.equal(frames,1,'game invokes the native 3D renderer rather than its 2D background');
 api.warp22ToggleMode();
 assert.equal(api.warp22Enabled(),false);
 assert.equal(elem('space3d').style.display,'none');
 assert.equal(api.S.settings.view3D,false);
 api.warp22ToggleMode();
 assert.equal(api.warp22Enabled(),true);
 assert.equal(elem('space3d').style.display,'block');
 assert.ok(store.has('tokenverse-deep-space-v10'),'3D preference is stored in existing save key');
});
