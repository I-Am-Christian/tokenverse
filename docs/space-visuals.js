/* Warp Coin v0.23 — Living 2D Galaxy. Procedural canvas visuals, no external assets.
 * The original 192,000 × 115,200 X/Y simulation remains authoritative.
 */
(function(root){
'use strict';
const TAU=Math.PI*2;
const palettes={
 orion:{a:'#565ed9',b:'#1365aa',c:'#ae5ab9',planet:'#62bbf1',rim:'#e3faff',rings:'#9ee9fc'},
 borealis:{a:'#2087bf',b:'#43bc9d',c:'#356bd3',planet:'#87d7ec',rim:'#e9ffff',rings:'#93f2db'},
 helios:{a:'#b96641',b:'#dc9347',c:'#944a8d',planet:'#edb66a',rim:'#ffe8ba',rings:'#f5b079'},
 forge:{a:'#b55066',b:'#7b418a',c:'#f0956b',planet:'#d47d62',rim:'#ffe5c0',rings:'#eeae99'},
 umbra:{a:'#784ac7',b:'#4445ac',c:'#b46bca',planet:'#9879d6',rim:'#f6dcff',rings:'#bda7fa'},
 homestead:{a:'#1b7ea9',b:'#3a9a8a',c:'#5d63c5',planet:'#88d7bb',rim:'#dcfff2',rings:'#a4e8d4'}
};
function hash(n){const x=Math.sin(n*127.1+13.37)*43758.5453;return x-Math.floor(x)}
function radial(g,x,y,r,color,alpha=.4){
 const grad=g.createRadialGradient(x,y,0,x,y,r);
 grad.addColorStop(0,color);grad.addColorStop(1,'rgba(0,0,0,0)');
 g.save();g.globalAlpha=alpha;g.fillStyle=grad;g.fillRect(x-r,y-r,2*r,2*r);g.restore();
}
function backdrop(g,{w,h,x=0,y=0,t=0,system='orion',quality='medium',reducedMotion=false}={}){
 if(quality==='low')return false;
 const p=palettes[system]||palettes.orion,seed=Object.keys(palettes).indexOf(system)+1;
 const hi=quality==='high';
 g.save();
 radial(g,w*.2-x*.00025,h*.37-y*.00013,Math.max(w,h)*.82,p.a,hi?.30:.23);
 radial(g,w*.83+x*.00017,h*.61+y*.00014,Math.max(w,h)*.9,p.b,hi?.28:.22);
 radial(g,w*.53+x*.0001,h*.16-y*.00008,Math.max(w,h)*.6,p.c,hi?.17:.10);
 // Luminous nebula river composed of translucent Bézier veils, with a wide dark dust lane.
 g.save();g.globalCompositeOperation='screen';
 const drift=reducedMotion?0:Math.sin(t*.05+seed)*16;
 for(let k=0;k<(hi?7:4);k++){
  const yy=h*(.36+k*.057)+drift,span=(k-3)*28;
  g.beginPath();g.moveTo(-w*.12,yy+h*.32);
  g.bezierCurveTo(w*.2,yy-h*.28+span,w*.64,yy+h*.22-span,w*1.16,yy-h*.17);
  g.strokeStyle=[p.a,p.b,p.c][k%3];
  g.globalAlpha=hi?.043:.036;g.lineWidth=Math.max(20,h*(.055+k*.009));g.stroke();
 }
 g.restore();
 // Distant clouds: their positions react slightly to travel without repeating textures.
 for(let i=0;i<(hi?12:7);i++){
  const xx=hash(i*3.17+seed)*w,yy=hash(i*7.81+seed)*h;
  radial(g,xx,yy,Math.max(w,h)*(.13+.15*hash(i*5.4+seed)),
    [p.b,p.a,p.c][i%3],hi?.15:.105);
 }
 // Warm galactic dust clusters, subtle at default quality.
 for(let i=0;i<(hi?64:30);i++){
  const dx=hash(i*13.17+seed)*w,dy=hash(i*17.23+seed)*h;
  g.globalAlpha=.11+.14*hash(i*5.31);
  g.fillStyle=i%4===0?'#dbf3ff':i%3===0?p.c:p.rim;
  g.beginPath();g.arc(dx,dy,.45+hash(i*3.3)*1.1,0,TAU);g.fill();
 }
 g.globalAlpha=1;
 // Backdrop ringed planet: a scenic celestial object, never mistaken for a real station.
 const px=w*(.82+Math.sin(seed*2.7)*.14)-x*.00045;
 const py=h*(.21+Math.sin(seed)*.085)-y*.00045;
 const r=Math.max(48,Math.min(w,h)*.126)*(hi?1:.82);
 if(px>-r*3&&px<w+r*3&&py>-r*3&&py<h+r*3){
  radial(g,px,py,r*2.5,p.a,.13);
  const gg=g.createRadialGradient(px-r*.36,py-r*.38,r*.03,px+r*.24,py+r*.15,r*1.28);
  gg.addColorStop(0,p.rim);gg.addColorStop(.4,p.planet);gg.addColorStop(.77,p.a);gg.addColorStop(1,'#10152d');
  g.save();g.shadowColor=p.b;g.shadowBlur=hi?38:19;
  g.fillStyle=gg;g.beginPath();g.arc(px,py,r,0,TAU);g.fill();g.shadowBlur=0;
  // Terminator and layered atmospheric rim give the celestial body volume.
  g.strokeStyle=p.rim+'a8';g.lineWidth=1.3;g.beginPath();g.arc(px,py,r,Math.PI*.56,Math.PI*1.3);g.stroke();
  g.save();g.translate(px,py);g.rotate(-.28);
  g.strokeStyle=p.rings+'65';g.lineWidth=Math.max(3,r*.1);
  g.beginPath();g.ellipse(0,0,r*1.57,r*.3,0,0,TAU);g.stroke();
  g.strokeStyle=p.rings+'bc';g.lineWidth=Math.max(1,r*.018);
  g.beginPath();g.ellipse(0,0,r*1.71,r*.33,0,0,TAU);g.stroke();
  g.restore();g.restore();
 }
 g.restore();return true;
}
function starfield(g,{w,h,x=0,y=0,t=0,quality='medium',reducedMotion=false,cruising=false}={}){
 if(!w||!h)return false;
 const high=quality==='high',n=quality==='low'?105:high?310:210;
 g.save();
 for(let i=0;i<n;i++){
  const layer=i%3, par=[.012,.052,.15][layer];
  const sx=((hash(i*13.137)*w*2-x*par)%(w+56)+(w+56))%(w+56)-28;
  const sy=((hash(i*7.743)*h*2-y*par)%(h+56)+(h+56))%(h+56)-28;
  const flicker=reducedMotion?1:.76+.24*Math.sin(t*(.4+hash(i)*1.3)+i);
  g.globalAlpha=(.4+hash(i*3.41)*.55)*flicker;
  g.fillStyle=i%19===0?'#ffffff':i%7===0?'#b4eaff':i%11===0?'#d9b9fc':'#91b2d6';
  if(cruising&&!reducedMotion&&layer>0){
   const len=(26+layer*27)*(.7+hash(i)*.9);
   g.strokeStyle=g.fillStyle;g.lineWidth=layer===2?1.35:.8;
   g.beginPath();g.moveTo(sx,sy);g.lineTo(sx-len,sy+len*.10);g.stroke();
  }else{
   const r=layer===2?1.4:layer===1?.85:.6;
   g.beginPath();g.arc(sx,sy,r,0,TAU);g.fill();
   if(i%41===0&&(high||layer===2)){
    g.strokeStyle='#e9faff8c';g.lineWidth=.7;
    g.beginPath();g.moveTo(sx-5,sy);g.lineTo(sx+5,sy);g.moveTo(sx,sy-5);g.lineTo(sx,sy+5);g.stroke();
   }
  }
 }
 // Rare shooting stars are scenic effects, not teleport routes or loot markers.
 if(quality!=='low'&&!reducedMotion&&!cruising){
  const phase=(t+31.3)%15.7;
  if(phase<1.25){
   const u=phase/1.25,px=w*(.08+u*.47),py=h*(.13+u*.31);
   g.globalAlpha=(1-u)*.52;g.strokeStyle='#c1f2ff';g.lineWidth=1.8;
   g.beginPath();g.moveTo(px,py);g.lineTo(px-110,py-54);g.stroke();
   radial(g,px,py,18,'#e9fcff',.27*(1-u));
  }
 }
 g.restore();return true;
}
function thruster(g,{w,h,angle=0,speed=0,cruising=false,active=false,quality='medium',reducedMotion=false,time=0}={}){
 if(!active||quality==='low')return;
 const len=cruising?142:Math.min(76,30+speed*.05);
 g.save();g.translate(w/2,h/2);g.rotate(angle);
 for(let k=0;k<3;k++){
  const span=(3-k)*5+3;
  const back=len*(1.16-k*.16);
  const grad=g.createLinearGradient(-11,0,-back,0);
  grad.addColorStop(0,'rgba(255,255,255,.92)');
  grad.addColorStop(.27,k===0?'rgba(68,160,255,.38)':k===1?'rgba(72,238,232,.55)':'rgba(213,255,252,.85)');
  grad.addColorStop(1,'rgba(40,114,255,0)');
  g.shadowColor=k===2?'#b8fff7':'#58cfff';g.shadowBlur=cruising?28:14;
  g.fillStyle=grad;g.beginPath();g.moveTo(-18,-span);g.lineTo(-back,0);g.lineTo(-18,span);g.closePath();g.fill();
 }
 g.shadowBlur=0;
 if(cruising&&!reducedMotion){
  g.strokeStyle='#abedff87';g.lineWidth=1.2;
  for(let i=0;i<6;i++){let yy=(i-2.5)*11;g.beginPath();g.moveTo(-24,yy);g.lineTo(-len-(i%3)*14,yy*1.7);g.stroke();}
 }
 g.restore();
}
function oreGlint(g,{radius=20,kind='moon',time=0,quality='medium'}={}){
 if(quality==='low')return;
 const tint={moon:'#e6f6ff',neon:'#80fff0',dust:'#ffe6a3',void:'#d3a8ff',diam:'#e2ffff'}[kind]||'#ffffff';
 const r=Math.max(8,radius);
 g.save();g.globalAlpha=kind==='diam'?.78:.5;
 g.fillStyle=tint;
 g.beginPath();g.moveTo(-r*.18,-r*.58);g.lineTo(r*.04,-r*.71);
 g.lineTo(r*.18,-r*.22);g.closePath();g.fill();
 g.beginPath();g.moveTo(r*.23,r*.28);g.lineTo(r*.43,r*.07);
 g.lineTo(r*.52,r*.35);g.closePath();g.fill();
 if(kind==='diam'||kind==='void'){
  g.strokeStyle=tint;g.lineWidth=1;
  const flicker=.72+.25*Math.sin(time*2+r);
  g.globalAlpha=flicker;g.beginPath();g.moveTo(-r*.52,0);g.lineTo(-r*.33,0);
  g.moveTo(-r*.43,-r*.1);g.lineTo(-r*.43,r*.1);g.stroke();
 }
 g.restore();
}
function drone(g,{x,y,angle=0,tier=1,color='#ff8ea7',ratio=1,time=0,reducedMotion=false}={}){
 g.save();g.translate(x,y);g.rotate(angle);
 const size=1+Math.min(4,tier||1)*.045;
 g.scale(size,size);
 g.shadowColor=color;g.shadowBlur=reducedMotion?7:15;
 g.fillStyle='#371f3c';g.strokeStyle=color;g.lineWidth=1.7;
 g.beginPath();g.moveTo(20,0);g.lineTo(2,-11);g.lineTo(-8,-15);
 g.lineTo(-18,-8);g.lineTo(-10,0);g.lineTo(-18,8);g.lineTo(-8,15);
 g.lineTo(2,11);g.closePath();g.fill();g.stroke();
 g.shadowBlur=0;
 g.fillStyle='#a7b6ea';g.beginPath();g.moveTo(15,0);
 g.lineTo(-4,-4.5);g.lineTo(-6,4.5);g.closePath();g.fill();
 g.fillStyle=color;g.beginPath();g.arc(-12,0,3.8,0,TAU);g.fill();
 g.strokeStyle='#ffedf3b8';g.lineWidth=.8;
 g.beginPath();g.moveTo(-5,-11);g.lineTo(2,-4);
 g.moveTo(-5,11);g.lineTo(2,4);g.stroke();
 if(!reducedMotion){g.globalAlpha=.35+.3*Math.sin(time*8+tier);
 g.strokeStyle=color;g.beginPath();g.moveTo(-17,-7);g.lineTo(-27,-9);
 g.moveTo(-17,7);g.lineTo(-27,9);g.stroke();}
 g.restore();
 g.save();g.fillStyle='rgba(8,15,33,.82)';g.fillRect(x-19,y-27,38,5);
 g.fillStyle=ratio>.5?'#90f2bf':ratio>.25?'#ffcc83':'#ff6c91';
 g.fillRect(x-19,y-27,Math.max(0,Math.min(1,ratio))*38,5);g.restore();
 return true;
}
root.WarpVisuals={backdrop,starfield,thruster,oreGlint,drone};
})(typeof window!=='undefined'?window:this);
