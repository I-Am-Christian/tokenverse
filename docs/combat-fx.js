/* Warp Coin v0.21 - procedural, client-only space combat visuals.
   Cosmetic only: damage, ammo, collisions and economy stay in the core game. */
(function installCombatEffects(root){
 'use strict';
 const PALETTES={
  pulse:{color:'#79dfff',light:'#efffff',r:3.4,tail:35,width:2.8},
  scatter:{color:'#ffd27a',light:'#fff5cf',r:2.9,tail:19,width:2.2},
  rail:{color:'#71ffe0',light:'#fbffff',r:2.8,tail:100,width:4.5},
  plasma:{color:'#c498ff',light:'#f5dfff',r:8,tail:34,width:4},
  diamond:{color:'#78f6ff',light:'#ffffff',r:4,tail:43,width:3.3},
  arc:{color:'#84ffe8',light:'#e6ffff',r:4.6,tail:48,width:3.2},
  siege:{color:'#f6a9ff',light:'#fff4ff',r:12,tail:69,width:5.2},
  ion:{color:'#80e8ff',light:'#efffff',r:5,tail:51,width:3.6},
  flak:{color:'#ffc67b',light:'#fff0ce',r:6,tail:29,width:3},
  barrage:{color:'#ffc67b',light:'#fff0ce',r:3.2,tail:22,width:2.8},
  autocannon:{color:'#fbd18a',light:'#ffffff',r:2.35,tail:42,width:2.7},
  prism:{color:'#7ef4ff',light:'#e5ffff',r:3.6,tail:118,width:3.6},
  ionstorm:{color:'#b29eff',light:'#f5efff',r:5.1,tail:60,width:3.5},
  torpedo:{color:'#ffa7db',light:'#fff1ff',r:8.2,tail:72,width:4.8},
  enemy:{color:'#ff8eaa',light:'#ffe1e8',r:3.2,tail:23,width:2.1}
 };
 const maxFX=70;
 function colors(b){
  const type=b?.from==='player'?(b?.weapon||'pulse'):'enemy';
  const p=PALETTES[type]||PALETTES.pulse;
  return {...p,color:b?.color||p.color,type};
 }
 function create(){
  let bursts=[],flashes=[],training=[];
  function muzzle({x,y,angle=0,weapon='pulse',color}={}){
   if(!Number.isFinite(x)||!Number.isFinite(y))return;
   flashes.push({x,y,angle,weapon,color,life:.14,max:.14});
   if(flashes.length>maxFX)flashes.splice(0,flashes.length-maxFX);
  }
  function trainingShot({x,y,angle=0,weapon='pulse',color}={}){
   muzzle({x,y,angle,weapon,color});
   training.push({x,y,angle,weapon,color,life:.2,max:.2});
   if(training.length>12)training.shift();
  }
  function impact({x,y,weapon='pulse',color,killed=false,enemy=false}={}){
   if(!Number.isFinite(x)||!Number.isFinite(y))return;
   bursts.push({x,y,weapon,color,killed:!!killed,enemy:!!enemy,
     life:killed?.57:.32,max:killed?.57:.32,phase:bursts.length*.7});
   if(bursts.length>maxFX)bursts.splice(0,bursts.length-maxFX);
  }
  function trail(b){
   if(!b||!Number.isFinite(b.x)||!Number.isFinite(b.y))return;
   if(!Array.isArray(b.fxTrail))b.fxTrail=[];
   b.fxTrail.push({x:b.x,y:b.y});
   if(b.fxTrail.length>7)b.fxTrail.shift();
  }
  function tick(dt){
   const d=Math.max(0,Math.min(.08,Number(dt)||0));
   for(const a of [flashes,bursts,training])for(let i=a.length-1;i>=0;i--){
    a[i].life-=d;
    if(a[i].life<=0)a.splice(i,1);
   }
  }
  function nearScreen(x,y,w,h,margin=135){
   return x>-margin&&y>-margin&&x<w+margin&&y<h+margin;
  }
  function drawBullet(g,b,view,quality='medium',reduced=false,time=0){
   if(!b||typeof view!=='function')return false;
   const [x,y]=view(b.x,b.y);
   const p=colors(b),theta=Math.atan2(b.vy||0,b.vx||1);
   const ux=Math.cos(theta),uy=Math.sin(theta);
   const blur=quality==='high'?17:quality==='low'?0:9;
   g.save();g.lineCap='round';g.lineJoin='round';
   if(blur){g.shadowColor=p.color;g.shadowBlur=blur;}
   const steps=Array.isArray(b.fxTrail)&&!reduced?b.fxTrail:null;
   if(steps&&steps.length){
    for(let i=0;i<steps.length;i++){
     const pt=steps[i],q=view(pt.x,pt.y),alpha=(i+1)/(steps.length+1);
     g.globalAlpha=.08+alpha*.38;g.strokeStyle=p.color;g.lineWidth=.8+alpha*p.width;
     g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(x,y);g.stroke();
    }
   }
   g.globalAlpha=1;
   if((p.type==='arc'||p.type==='ionstorm')&&!reduced){
    const count=5,len=p.tail;
    g.strokeStyle=p.color;g.lineWidth=p.width;
    g.beginPath();g.moveTo(x,y);
    for(let i=1;i<=count;i++){
     const along=i/count*len;
     const jitter=Math.sin((b.x+b.y)*.015+time*22+i*9.7)*7;
     g.lineTo(x-ux*along-uy*jitter,y-uy*along+ux*jitter);
    }g.stroke();
   }else if(p.type==='diamond'&&!reduced){
    g.strokeStyle=p.color;g.lineWidth=p.width;g.beginPath();
    g.moveTo(x+ux*6,y+uy*6);g.lineTo(x-ux*p.tail,y-uy*p.tail);g.stroke();
    g.fillStyle=p.light;g.beginPath();g.moveTo(x+ux*9,y+uy*9);
    g.lineTo(x+uy*5,y-ux*5);g.lineTo(x-ux*11,y-uy*11);
    g.lineTo(x-uy*5,y+ux*5);g.closePath();g.fill();
   }else {
    g.strokeStyle=p.color;g.lineWidth=p.width;
    g.beginPath();g.moveTo(x-ux*p.tail,y-uy*p.tail);g.lineTo(x,y);g.stroke();
   }
   if((p.type==='rail'||p.type==='prism')&&!reduced){
    g.shadowBlur=0;g.strokeStyle='#f3ffffcc';g.lineWidth=1.6;g.beginPath();
    g.moveTo(x-ux*(p.tail+35),y-uy*(p.tail+35));g.lineTo(x+ux*4,y+uy*4);g.stroke();
   }
   if(p.type==='plasma'||p.type==='siege'||p.type==='torpedo'){
    g.fillStyle=p.color;g.globalAlpha=.18;
    g.beginPath();g.arc(x,y,p.r*(p.type==='siege'?2.7:p.type==='torpedo'?2.8:2.3)+Math.sin(time*15)*1.4,0,Math.PI*2);g.fill();
    g.globalAlpha=1;
   }
   if(p.type==='torpedo'){
    g.save();g.translate(x,y);g.rotate(theta);
    g.fillStyle='#4f2c5d';g.strokeStyle=p.color;g.lineWidth=2;
    g.beginPath();g.moveTo(12,0);g.lineTo(-6,-6);g.lineTo(-12,-4);
    g.lineTo(-12,4);g.lineTo(-6,6);g.closePath();g.fill();g.stroke();
    g.fillStyle='#fff0ff';g.beginPath();g.arc(4,0,3.1,0,Math.PI*2);g.fill();g.restore();
   }else{
    g.fillStyle=p.light;g.beginPath();g.arc(x,y,p.r*(reduced?.78:1),0,Math.PI*2);g.fill();
   }
   g.restore();return true;
  }
  function draw(g,bullets,view,{quality='medium',reducedMotion=false,time=0,width=1920,height=1080,zoom=1}={}){
   if(!g||typeof view!=='function')return;
   const cameraZoom=Math.max(.35,Number(zoom)||1);
   const visible=(x,y)=>Math.abs(x-width/2)<width/(2*cameraZoom)+145&&
    Math.abs(y-height/2)<height/(2*cameraZoom)+145;
   for(const b of bullets||[]){
    const pt=view(b.x,b.y);
    if(visible(pt[0],pt[1]))drawBullet(g,b,view,quality,reducedMotion,time);
   }
   for(const a of training){
    const p=PALETTES[a.weapon]||PALETTES.pulse,[x,y]=view(a.x,a.y);
    if(!visible(x,y))continue;
    const fade=a.life/a.max,dx=Math.cos(a.angle),dy=Math.sin(a.angle);
    g.save();g.globalAlpha=fade*.75;g.strokeStyle=a.color||p.color;
    g.shadowColor=a.color||p.color;g.shadowBlur=reducedMotion?0:12;
    g.lineWidth=2.5;g.beginPath();g.moveTo(x+dx*30,y+dy*30);
    g.lineTo(x+dx*(90+(1-fade)*210),y+dy*(90+(1-fade)*210));g.stroke();g.restore();
   }
   for(const a of bursts){
    const [x,y]=view(a.x,a.y);
    if(!visible(x,y))continue;
    const p=PALETTES[a.weapon]||PALETTES.pulse;
    const alpha=Math.max(0,a.life/a.max),progress=1-alpha;
    const radius=(a.killed?61:a.weapon==='siege'?35:19)*(progress*.84+.16);
    g.save();g.globalAlpha=alpha*(reducedMotion?.34:.75);
    g.strokeStyle=a.enemy?'#ff99a6':(a.color||p.color);
    g.lineWidth=a.killed?4:2.5;g.shadowColor=g.strokeStyle;g.shadowBlur=reducedMotion?0:16;
    g.beginPath();g.arc(x,y,radius,0,Math.PI*2);g.stroke();
    if(a.killed&&!reducedMotion){
     g.globalAlpha=alpha*.64;
     for(let i=0;i<8;i++){let ang=i*Math.PI/4+a.phase;
      let d=18+progress*57;
      g.beginPath();g.moveTo(x+Math.cos(ang)*d*.5,y+Math.sin(ang)*d*.5);
      g.lineTo(x+Math.cos(ang)*(d+16),y+Math.sin(ang)*(d+16));g.stroke();}
    }
    g.restore();
   }
   for(const a of flashes){
    const [x,y]=view(a.x,a.y);
    if(!visible(x,y))continue;
    const p=PALETTES[a.weapon]||PALETTES.pulse;
    const alpha=Math.max(0,a.life/a.max),theta=a.angle||0;
    const fx=Math.cos(theta),fy=Math.sin(theta),px=-fy,py=fx;
    const len=(a.weapon==='siege'?36:21)*(.78+(1-alpha)*.52);
    g.save();g.globalAlpha=alpha*.94;
    g.shadowColor=a.color||p.color;g.shadowBlur=reducedMotion?0:20;
    g.fillStyle=p.light;g.beginPath();
    g.moveTo(x+fx*len,y+fy*len);
    g.lineTo(x+px*8,y+py*8);
    g.lineTo(x-fx*10,y-fy*10);
    g.lineTo(x-px*8,y-py*8);
    g.closePath();g.fill();
    if(!reducedMotion){g.strokeStyle=a.color||p.color;g.lineWidth=1.8;g.beginPath();
     g.moveTo(x+px*13,y+py*13);g.lineTo(x-px*13,y-py*13);g.stroke();}
    g.restore();
   }
  }
  function stats(){return {bursts:bursts.length,flashes:flashes.length,training:training.length};}
  return {muzzle,trainingShot,impact,trail,tick,draw,stats};
 }
 root.WarpCombatFX=Object.freeze({create,palettes:PALETTES});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
