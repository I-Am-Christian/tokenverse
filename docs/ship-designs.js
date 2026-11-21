/* Warp Coin v0.26 — original, layered top-down ship art inspired by top-down
 * silhouette design principles. No third-party copyrighted sprites embedded.
 * Forward direction is positive X, matching the original game.
 */
(function(root){
'use strict';
const TAU=Math.PI*2;
function polygon(g,pts,fill,stroke='#a2bdd2',lw=1.4){
 g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));
 g.closePath();if(fill){g.fillStyle=fill;g.fill();}
 if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.stroke();}
}
function gradient(g,colors){
 const v=g.createLinearGradient(-34,-30,36,36);
 v.addColorStop(0,colors[0]);v.addColorStop(.38,colors[1]);v.addColorStop(.73,colors[2]);v.addColorStop(1,colors[3]||colors[0]);return v;
}
function circle(g,x,y,r,fill,stroke){
 g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle=fill;g.fill();
 if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke();}
}
function lines(g,pts,color,width=1){
 g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));
 g.strokeStyle=color;g.lineWidth=width;g.stroke();
}
function clamp(v,low,high){return Math.max(low,Math.min(high,v));}
function typeFor(id,role=''){
 const key=(id+' '+role).toLowerCase();
 if(/titan|leviathan|battlecruiser|starcarrier|ark|capital|fortress|dread|carrier/.test(key))return 'capital';
 if(/marauder|gunship|fighter|raider|outlaw|viper|raptor|cerberus/.test(key))return 'raider';
 if(/hauler|freighter|barge|cargo|mule|convoy/.test(key))return 'freighter';
 if(/miner|orewhale|ore-hopper|prospector|drill|rockhopper/.test(key))return 'miner';
 if(/scout|kestrel|interceptor|phantom|swift|whisper|ghost/.test(key))return 'interceptor';
 if(/explorer|nomad|wanderer|wayfarer|voyager|skiff/.test(key))return 'explorer';
 if(/security|escort/.test(key))return 'interceptor';
 if(/trader|merchant/.test(key))return 'freighter';
 return 'explorer';
}
function draw(g,{x=0,y=0,angle=0,scale=1,kind='explorer',quality='medium',
 hull='#829bb2',accent='#83ecfa',trim='#d5ebf5',thrust=false,time=0}={}){
 if(!g||!Number.isFinite(x)||!Number.isFinite(y))return false;
 const detail=quality!=='low',capital=kind==='capital';
 const big=capital?1.22:kind==='freighter'?1.1:1;
 g.save();g.translate(x,y);g.rotate(angle);g.scale(scale*big,scale*big);
 g.lineJoin='round';g.lineCap='round';
 // Intense underside shadow and soft rim: readable even over bright nebulae.
 if(detail){g.shadowColor='#000711';g.shadowBlur=17;g.shadowOffsetX=-3;g.shadowOffsetY=5;}
 const main=gradient(g,['#15263b',hull,'#536c88','#101a2a']);
 const deep=gradient(g,['#091623','#405874','#233a52','#101a2b']);
 const light=gradient(g,['#1b4159',trim,'#69849e','#172c43']);
 const accentFill=gradient(g,['#061e39',accent,'#4a7795','#041a30']);
 const panel='#0f2739',metal='#6487a3',edge=trim;
 const shape={
  interceptor:[[42,0],[20,-8],[-7,-18],[-28,-40],[-35,-37],[-31,-8],[-39,-5],[-30,0],[-39,5],[-31,8],[-35,37],[-28,40],[-7,18],[20,8]],
  explorer:[[33,0],[22,-10],[9,-15],[-13,-36],[-33,-30],[-30,-11],[-44,-7],[-44,7],[-30,11],[-33,30],[-13,36],[9,15],[22,10]],
  miner:[[35,0],[24,-17],[2,-24],[-23,-27],[-39,-18],[-40,18],[-23,27],[2,24],[24,17]],
  freighter:[[41,0],[29,-15],[13,-18],[-25,-25],[-44,-20],[-49,-10],[-49,10],[-44,20],[-25,25],[13,18],[29,15]],
  raider:[[46,0],[23,-8],[0,-16],[-33,-42],[-42,-30],[-22,-6],[-43,-10],[-29,0],[-43,10],[-22,6],[-42,30],[-33,42],[0,16],[23,8]],
  capital:[[52,0],[39,-15],[28,-18],[11,-31],[-26,-35],[-43,-25],[-45,-9],[-59,-8],[-59,8],[-45,9],[-43,25],[-26,35],[11,31],[28,18],[39,15]]
 }[kind]||[[38,0],[10,-18],[-32,-22],[-35,22],[10,18]];
 polygon(g,shape,main,edge,1.5);g.shadowBlur=0;g.shadowOffsetX=0;g.shadowOffsetY=0;
 // Recessed rear sections, differentiated by role.
 if(kind==='interceptor'||kind==='raider'){
  const sweep=kind==='raider'?38:32;
  for(const side of [-1,1]){
   polygon(g,[[-29,side*9],[-11,side*13],[-26,side*sweep],[-35,side*(sweep-3)],[-39,side*9]],
    deep,metal,.9);
   polygon(g,[[-25,side*15],[-16,side*17],[-28,side*(sweep-7)],[-32,side*(sweep-6)]],panel,accent,1);
   lines(g,[[-27,side*9],[-2,side*7],[14,side*4]],'#c7e3f688',1);
  }
  polygon(g,[[37,0],[18,-6],[5,-5],[-12,-2],[-12,2],[5,5],[18,6]],light,edge,1);
 }else if(kind==='freighter'){
  for(const side of [-1,1]){
   polygon(g,[[16,side*7],[9,side*20],[-37,side*23],[-43,side*11]],
    deep,edge,1.2);
   for(let c=0;c<4;c++){
    const cx=4-c*10,cy=side*14;
    g.fillStyle=c%2?'#49627d':'#526c7f';
    g.fillRect(cx-7,cy-5,9,10);
    g.strokeStyle='#a3b9c8';g.lineWidth=.7;g.strokeRect(cx-7,cy-5,9,10);
    g.fillStyle=accent;g.fillRect(cx-6,cy-3,2,5);
   }
  }
  polygon(g,[[35,0],[20,-8],[-16,-8],[-34,0],[-16,8],[20,8]],light,edge,1);
 }else if(kind==='miner'){
  for(const side of [-1,1]){
   polygon(g,[[-36,side*21],[-22,side*26],[5,side*21],[20,side*11],[-17,side*10]],deep,metal,1);
   lines(g,[[4,side*23],[22,side*33],[34,side*25]],edge,2.6);
   circle(g,17,side*30,4,panel,accent);
   lines(g,[[25,side*29],[41,side*16]],'#76f6d3',1.8);
  }
  polygon(g,[[27,0],[13,-12],[-29,-12],[-35,0],[-29,12],[13,12]],light,edge,1);
 }else if(kind==='capital'){
  // Segmented armored hull and open deck between two unmistakable hangar bays.
  for(const side of [-1,1]){
   polygon(g,[[28,side*14],[5,side*35],[-32,side*37],[-47,side*24],[-43,side*12]],
    deep,edge,1.4);
   polygon(g,[[10,side*18],[-34,side*29],[-39,side*18],[-7,side*14]],'#14293f',accent,1);
   for(let j=0;j<5;j++){
    const bx=-29+j*9;
    g.fillStyle=accent;g.globalAlpha=.37;
    g.fillRect(bx,side*24-1,4,3);g.globalAlpha=1;
   }
   for(let j=0;j<3;j++){
    circle(g,-23+j*18,side*32,4,'#20384d',metal);
    circle(g,-23+j*18,side*32,2,accent);
   }
   lines(g,[[-41,side*12],[7,side*10],[25,side*13]],'#dbe8f3a0',1);
  }
  polygon(g,[[48,0],[29,-8],[11,-10],[-40,-8],[-53,0],[-40,8],[11,10],[29,8]],light,edge,1.6);
  for(let j=0;j<7;j++){
   const bx=15-j*8;
   g.fillStyle=j%2?metal:'#24374e';g.fillRect(bx,-7,5,14);
  }
 }else{ // explorer
  for(const side of [-1,1]){
   polygon(g,[[22,side*9],[-13,side*31],[-30,side*26],[-28,side*15],[8,side*8]],
    deep,metal,1.1);
   lines(g,[[18,side*12],[-11,side*25],[-22,side*23]],accent,1.2);
   circle(g,-16,side*19,3,panel,trim);
  }
  polygon(g,[[31,0],[14,-8],[-26,-8],[-35,0],[-26,8],[14,8]],light,edge,1.3);
 }
 // Top-side guns and asymmetrically placed panel strips for a believable warship.
 if(detail){
  const slots=capital?4:kind==='freighter'?2:3;
  for(let j=0;j<slots;j++){
   const cx=18-j*12;
   lines(g,[[cx,-4],[cx-3,-4]],'#0b1627',1.4);
   lines(g,[[cx,4],[cx-3,4]],'#b6c7db84',.8);
  }
 }
 for(const side of [-1,1]){
  if(kind!=='freighter'){
   const gunX=capital?12:kind==='miner'?14:kind==='raider'?4:10;
   const gunY=capital?side*20:kind==='raider'?side*13:side*12;
   circle(g,gunX,gunY,capital?6:4.2,'#142a3f',metal);
   lines(g,[[gunX,gunY],[gunX+(capital?15:10),gunY]],'#a9c9da',capital?3:2);
   circle(g,gunX+(capital?15:10),gunY,1.7,accent);
  }
 }
 // Cockpit windows and illuminated centerline bridge.
 const cabin=kind==='capital'?11:kind==='freighter'?9:kind==='miner'?8:12;
 polygon(g,[[cabin+13,0],[cabin+4,-5],[cabin-8,-4],[cabin-12,0],[cabin-8,4],[cabin+4,5]],
  accentFill,'#dbf9ff',1.4);
 lines(g,[[cabin-2,-5],[cabin+4,-1],[cabin+4,1],[cabin-2,5]],'#dcffff90',.9);
 // Multi-nozzle thruster machinery.
 const engines=capital?[-21,0,21]:kind==='freighter'?[-14,14]:[-9,9];
 for(const y0 of engines){
  const rear=capital?-57:kind==='freighter'?-47:-37;
  g.fillStyle='#0c172a';g.fillRect(rear-4,y0-5,8,10);
  g.strokeStyle=metal;g.strokeRect(rear-4,y0-5,8,10);
  circle(g,rear-3,y0,3,thrust?'#edffff':accent,'#7fb6cb');
  if(thrust){
   const flame=g.createLinearGradient(rear,y0,rear-(capital?33:22),y0);
   flame.addColorStop(0,'#f5ffff');flame.addColorStop(.36,accent);flame.addColorStop(1,'rgba(18,92,211,0)');
   g.fillStyle=flame;g.beginPath();g.moveTo(rear-3,y0-3);
   g.lineTo(rear-(capital?34:23)-(Math.sin(time*23+y0)*3),y0);
   g.lineTo(rear-3,y0+3);g.fill();
  }
 }
 g.restore();return true;
}
root.WarpShipDesigns=Object.freeze({draw,typeFor});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
