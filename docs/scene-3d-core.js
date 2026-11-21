/* Warp Coin v0.22 — standalone 3D geometry, matrices and camera picking. */
(function(root){
'use strict';
const PI=Math.PI,TAU=PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function norm(v){const d=Math.hypot(...v)||1;return v.map(x=>x/d)}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function perspective(fov,aspect,near=1,far=18000){
 const f=1/Math.tan(fov/2),r=1/(near-far);
 return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*r,-1,0,0,2*far*near*r,0]);
}
function lookAt(eye,target){
 const z=norm(eye.map((v,i)=>v-target[i])),x=norm(cross([0,1,0],z)),y=cross(z,x);
 const dot=(a,b)=>a.reduce((t,v,i)=>t+v*b[i],0);
 return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,
 -dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
}
function multiply(a,b){
 const m=new Float32Array(16);
 for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)m[c*4+r]+=a[k*4+r]*b[c*4+k];
 return m;
}
function model(x=0,y=0,z=0,angle=0,sx=1,sy=sx,sz=sx){
 const c=Math.cos(angle),s=Math.sin(angle);
 return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1]);
}
function hash(x){const t=Math.sin(x*127.173+78.233)*43758.5453123;return t-Math.floor(t)}
function color(s){
 const m=/^#([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(String(s||''));if(!m)return [.65,.84,1];
 const h=m[1].length===3?m[1].split('').map(v=>v+v).join(''):m[1];
 return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255);
}
function triangles(vertices,faces){
 const a=[];
 for(const f of faces){
  const p=vertices[f[0]],q=vertices[f[1]],r=vertices[f[2]];
  const n=norm(cross(q.map((v,i)=>v-p[i]),r.map((v,i)=>v-p[i])));
  for(const v of [p,q,r])a.push(...v,...n);
 }
 return new Float32Array(a);
}
function geometry(name){
 if(name==='ship'){
  const p=[[34,0,0],[10,7,0],[7,2,-8],[7,2,8],[-19,1,-11],[-19,1,11],
   [-9,1,-31],[-9,1,31],[-23,-5,0],[-6,-7,-8],[-6,-7,8],[-22,4,-10],[-22,4,10]];
  return triangles(p,[[0,2,1],[0,1,3],[0,9,2],[0,3,10],[2,4,1],[3,1,5],
   [2,9,4],[3,5,10],[1,4,11],[1,12,5],[9,8,4],[10,5,8],[4,8,11],
   [5,12,8],[11,8,12],[4,6,11],[5,12,7],[4,9,6],[5,7,10],[6,9,8],
   [7,8,10],[11,6,8],[12,8,7],[1,11,12]]);
 }
 if(name==='wing')return triangles([[-12,2,0],[2,2,0],[-20,0,28],[-16,-3,11],[-10,1,18]],
  [[0,1,2],[0,2,3],[1,4,2],[2,4,3],[1,3,4]]);
 if(name==='canopy')return triangles([[20,9,0],[2,9,-6],[2,9,6],[-5,13,0],[9,14,0],[2,6,0]],
  [[0,1,4],[0,4,2],[1,3,4],[2,4,3],[1,2,3],[0,5,1],[0,2,5]]);
 if(name==='octa')return triangles([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
  [[0,2,4],[4,2,1],[1,2,5],[5,2,0],[0,4,3],[4,1,3],[1,5,3],[5,0,3]]);
 if(name==='cube'){
  const p=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  return triangles(p,[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,3,7],[0,7,4],
   [1,5,6],[1,6,2],[3,2,6],[3,6,7],[0,4,5],[0,5,1]]);
 }
 if(name==='rock'){
  const t=(1+Math.sqrt(5))/2,p=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
   [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]];
  const verts=p.map((a,i)=>norm(a).map(v=>v*(.78+hash(i*12.4)*.3)));
  return triangles(verts,[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],
   [5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],
   [3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]]);
 }
 if(name==='sphere'){
  const p=[],faces=[],bands=10,steps=16;
  for(let j=0;j<=bands;j++){const l=PI*j/bands;for(let i=0;i<=steps;i++){
   const a=TAU*i/steps;p.push([Math.sin(l)*Math.cos(a),Math.cos(l),Math.sin(l)*Math.sin(a)]);
  }}
  for(let j=0;j<bands;j++)for(let i=0;i<steps;i++){
   const a=j*(steps+1)+i,b=a+steps+1;faces.push([a,b,a+1],[a+1,b,b+1]);
  }
  return triangles(p,faces);
 }
 throw Error('Unknown 3D mesh '+name);
}
function torus(radius=1,tube=.08,vertical=false){
 const points=[],faces=[],m=28,n=7;
 for(let i=0;i<=m;i++){const a=TAU*i/m;for(let j=0;j<=n;j++){
  const b=TAU*j/n,r=radius+tube*Math.cos(b);
  points.push(vertical?[r*Math.cos(a),r*Math.sin(a),tube*Math.sin(b)]:
   [r*Math.cos(a),tube*Math.sin(b),r*Math.sin(a)]);
 }}
 for(let i=0;i<m;i++)for(let j=0;j<n;j++){
  const a=i*(n+1)+j,b=(i+1)*(n+1)+j;faces.push([a,a+1,b],[a+1,b+1,b]);
 }
 return triangles(points,faces);
}
function cameraFor(ship,angle,width=1280,height=720,zoom=1){
 const ca=Math.cos(angle),sa=Math.sin(angle),eye=[-ca*zoom*220,zoom*135,-sa*zoom*220];
 const target=[ca*145,18,sa*145],forward=norm(target.map((v,i)=>v-eye[i]));
 const right=norm(cross(forward,[0,1,0])),up=norm(cross(right,forward));
 const fov=68*PI/180,aspect=Math.max(.35,width/Math.max(1,height));
 return {eye,target,forward,right,up,projection:perspective(fov,aspect),view:lookAt(eye,target),
  fov,aspect,width,height,ship};
}
function pickRay(camera,px,py,worldX,worldY,planeHeight=0){
 if(!camera||![px,py,worldX,worldY].every(Number.isFinite))return null;
 const nx=2*px/Math.max(1,camera.width)-1,ny=1-2*py/Math.max(1,camera.height);
 const x=Math.tan(camera.fov/2)*camera.aspect,y=Math.tan(camera.fov/2);
 const dir=norm(camera.forward.map((v,i)=>v+camera.right[i]*nx*x+camera.up[i]*ny*y));
 if(dir[1]>=-.02)return null;
 const t=(planeHeight-camera.eye[1])/dir[1];
 if(t<0||t>9000)return null;
 return {x:worldX+camera.eye[0]+dir[0]*t,y:worldY+camera.eye[2]+dir[2]*t,range:t};
}
const VERTEX=[
 '#version 300 es','precision highp float;','in vec3 aPos;','in vec3 aNormal;',
 'uniform mat4 uVP;','uniform mat4 uModel;','uniform float uSize;',
 'out vec3 vNormal;','out float vDepth;',
 'void main(){','vec4 pt=uModel*vec4(aPos,1.0);',
 'gl_Position=uVP*pt;','gl_PointSize=uSize;',
 'vNormal=mat3(uModel)*aNormal;','vDepth=length(pt.xyz);','}'
].join('\n');
const FRAGMENT=[
 '#version 300 es','precision mediump float;','in vec3 vNormal;','in float vDepth;',
 'uniform vec3 uTint;','uniform float uGlow;','uniform float uPoints;',
 'uniform float uOpacity;','out vec4 outColor;','void main(){',
 'if(uPoints>0.5){','float r=length(gl_PointCoord-vec2(0.5));',
 'if(r>0.50)discard;','float core=1.0-smoothstep(0.0,0.5,r);',
 'outColor=vec4(uTint*(0.5+1.6*core),uOpacity*core);return;','}',
 'vec3 n=normalize(vNormal);',
 'float light=clamp(0.27+max(dot(n,normalize(vec3(-0.45,0.84,0.38))),0.0)*0.78,0.27,1.2);',
 'float nebula=clamp(vDepth/8500.0,0.0,0.75);',
 'vec3 c=mix(uTint*(light+uGlow),vec3(0.035,0.067,0.15),nebula);',
 'outColor=vec4(c,uOpacity);','}'
].join('\n');
root.Warp3DCore=Object.freeze({perspective,lookAt,multiply,model,hash,color,
 geometry,triangles,torus,cameraFor,pickRay,VERTEX,FRAGMENT});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
