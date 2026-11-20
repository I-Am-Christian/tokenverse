/* Warp Coin v0.20 - procedural starfields, nebulae, planets, thruster exhaust.
   No external textures, images or dependencies. */
(function(root){
 'use strict';
 const presets={
  orion:{a:'#5e65cb',b:'#0d789b',planet:'#6fc3e8',rim:'#bdefff',rings:'#83bbdf'},
  borealis:{a:'#3576ae',b:'#297ca4',planet:'#85c6ef',rim:'#e9fcff',rings:'#9eddec'},
  helios:{a:'#d27b3b',b:'#a64969',planet:'#da9959',rim:'#ffe6a5',rings:'#f6a66c'},
  forge:{a:'#bb4737',b:'#792f6a',planet:'#b96b52',rim:'#ffc2a1',rings:'#ef9e82'},
  umbra:{a:'#7045bb',b:'#4245a0',planet:'#7560b8',rim:'#e1bbff',rings:'#a895ec'},
  homestead:{a:'#287f9c',b:'#427fb7',planet:'#75baa9',rim:'#c0f8df',rings:'#a4d6ca'}
 };
 function hash(n){const x=Math.sin(n*127.1+13.37)*43758.5453;return x-Math.floor(x);}
 function glow(g,x,y,r,color){
  const grd=g.createRadialGradient(x,y,r*.04,x,y,r);
  grd.addColorStop(0,color);grd.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=grd;g.fillRect(x-r,y-r,2*r,2*r);
 }
 function backdrop(g,{w,h,x=0,y=0,t=0,system='orion',quality='medium',reducedMotion=false}={}){
  if(quality==='low')return false;
  const p=presets[system]||presets.orion,mode=quality==='high'?1:.7;
  const seed=Object.keys(presets).indexOf(system)+1;
  g.save();
  glow(g,w*.2-(x*.00019%100),h*.26-(y*.00013%85),Math.max(w,h)*.77,p.a+'29');
  glow(g,w*.8+(x*.00014%85),h*.62+(y*.00017%75),Math.max(w,h)*.74,p.b+'23');
  const n=quality==='high'?10:6;
  for(let i=0;i<n;i++){
    const xx=hash(i*4.19+seed)*w, yy=hash(i*8.16+seed)*h;
    const r=(.15+hash(i*2.61+seed)*.19)*Math.max(w,h);
    glow(g,xx,yy,r,i%2===0?p.a+'1e':p.b+'17');
  }
  // Distant gas giant / moon in every public system - background only, not a teleport destination.
  const px=w*(.82+Math.sin(seed*2.7)*.13)-x*.0008,
        py=h*(.21+.07*Math.sin(seed))-y*.0006;
  const radius=Math.max(55,Math.min(w,h)*.11)*mode;
  if(px>-2*radius&&px<w+2*radius&&py>-2*radius&&py<h+2*radius){
   const grad=g.createRadialGradient(px-radius*.32,py-radius*.38,radius*.06,px,py,radius*1.18);
   grad.addColorStop(0,p.rim);grad.addColorStop(.38,p.planet);grad.addColorStop(.72,p.a);grad.addColorStop(1,'#101322');
   g.save();g.shadowColor=p.a;g.shadowBlur=32;
   g.fillStyle=grad;g.beginPath();g.arc(px,py,radius,0,Math.PI*2);g.fill();g.shadowBlur=0;
   g.translate(px,py);g.rotate(-.26);
   g.strokeStyle=p.rings+'55';g.lineWidth=Math.max(3,radius*.09);
   g.beginPath();g.ellipse(0,0,radius*1.48,radius*.29,0,0,Math.PI*2);g.stroke();
   g.strokeStyle=p.rings+'b2';g.lineWidth=Math.max(1,radius*.02);
   g.beginPath();g.ellipse(0,0,radius*1.57,radius*.32,0,0,Math.PI*2);g.stroke();
   g.restore();
  }
  g.restore();
  return true;
 }
 function starfield(g,{w,h,x=0,y=0,t=0,quality='medium',reducedMotion=false,cruising=false}={}){
  if(!w||!h)return false;
  const n=quality==='low'?90:quality==='high'?270:175;
  g.save();
  for(let i=0;i<n;i++){
   const layer=i%3,parallax=[.009,.047,.16][layer],mul=layer===2?1.65:layer===1?1.12:.73;
   const sx=((hash(i*13.137)*w*2-x*parallax)%(w+60)+(w+60))%(w+60)-30;
   const sy=((hash(i*7.743)*h*2-y*parallax)%(h+60)+(h+60))%(h+60)-30;
   const twinkle=reducedMotion?1:.76+.24*Math.sin(t*(.45+hash(i)*1.3)+i);
   g.globalAlpha=(.39+hash(i*4.3)*.5)*twinkle;
   g.fillStyle=i%13===0?'#f6fffe':i%5===0?'#a6e9ff':i%7===0?'#c7b7ff':'#91aacd';
   if(cruising&&!reducedMotion&&layer>0){
     g.strokeStyle=g.fillStyle;g.lineWidth=layer===2?1.2:.65;g.beginPath();
     g.moveTo(sx,sy);g.lineTo(sx-26*mul,sy+3*mul);g.stroke();
   }else {
     const r=layer===2?1.2:layer===1?.85:.62;
     g.beginPath();g.arc(sx,sy,r*mul,0,Math.PI*2);g.fill();
     if(i%43===0&&quality==='high'){g.strokeStyle='#d4f6ff55';g.beginPath();g.moveTo(sx-5,sy);g.lineTo(sx+5,sy);g.moveTo(sx,sy-5);g.lineTo(sx,sy+5);g.stroke();}
   }
  }
  g.restore();return true;
 }
 function thruster(g,{w,h,angle=0,speed=0,cruising=false,active=false,quality='medium',reducedMotion=false,time=0}={}){
  if(!active||quality==='low')return;
  const len=cruising?135:Math.min(55,26+speed*.045);
  g.save();g.translate(w/2,h/2);g.rotate(angle);
  const flame=g.createLinearGradient(-14,0,-len,0);
  flame.addColorStop(0,'rgba(235,251,255,.84)');flame.addColorStop(.26,cruising?'rgba(119,221,255,.58)':'rgba(97,250,218,.43)');
  flame.addColorStop(1,'rgba(40,107,255,0)');
  g.shadowColor=cruising?'#79cfff':'#8dfbdf';g.shadowBlur=cruising?25:13;
  g.fillStyle=flame;g.beginPath();g.moveTo(-19,-9);g.lineTo(-len,0);g.lineTo(-19,9);g.closePath();g.fill();
  if(cruising&&!reducedMotion){
   g.strokeStyle='#b6efff77';g.lineWidth=1.2;
   for(let i=0;i<7;i++){let yy=(i-3)*11;g.beginPath();g.moveTo(-27,yy);g.lineTo(-len-(i%3)*17,yy*1.8);g.stroke();}
  }
  g.restore();
 }
 root.WarpVisuals={backdrop,starfield,thruster};
})(typeof window!=='undefined'?window:this);
