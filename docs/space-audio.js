/* Warp Coin v0.20 - original procedural ambience and effects.
   Sounds require an explicit user gesture and never fetch external media. */
(function(root){
  'use strict';
  function create(){
    let context=null, master=null, ambience=null, toneNodes=[], enabled=false, volume=.65, last={};
    function setup(){
      const AC=root.AudioContext||root.webkitAudioContext;
      if(!AC)return false;
      if(context)return true;
      try{
        context=new AC();master=context.createGain();master.gain.value=volume*.24;
        master.connect(context.destination);
        ambience=context.createGain();ambience.gain.value=0;
        ambience.connect(master);
        const frequencies=[55,82.41,110];
        toneNodes=frequencies.map((hz,i)=>{
          const o=context.createOscillator(),f=context.createBiquadFilter(),g=context.createGain();
          o.type=i===1?'triangle':'sine';o.frequency.value=hz;
          f.type='lowpass';f.frequency.value=340+i*130;
          g.gain.value=i===0?.17:i===1?.09:.05;
          o.connect(f);f.connect(g);g.connect(ambience);o.start();
          return {o,g,f};
        });
        return true;
      }catch(e){context=null;return false;}
    }
    function enable(){
      if(!setup())return false;
      enabled=true;
      if(context.state==='suspended')context.resume().catch(()=>{});
      ambience.gain.setTargetAtTime(.16,context.currentTime,.6);
      return true;
    }
    function disable(){enabled=false;if(context&&ambience)ambience.gain.setTargetAtTime(0,context.currentTime,.18);}
    function setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));if(context&&master)master.gain.setTargetAtTime(volume*.24,context.currentTime,.08);}
    function beep(freq,duration,shape='triangle',loud=.25,end=1){
      if(!enabled||!context)return;
      const t=context.currentTime;
      const osc=context.createOscillator(),g=context.createGain();
      osc.type=shape;osc.frequency.setValueAtTime(Math.max(32,freq),t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(32,freq*end),t+duration);
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.00011,loud),t+.012);
      g.gain.exponentialRampToValueAtTime(.0001,t+duration);
      osc.connect(g);g.connect(master);osc.start(t);osc.stop(t+duration+.014);
      osc.onended=()=>{osc.disconnect();g.disconnect();};
    }
    function event(name){
      if(!enabled||!context)return;
      const now=context.currentTime;const gunShot=name.startsWith('gun-');if(now-(last[name]||-10)<(gunShot?.055:name==='laser'?.06:name==='engine'?.25:.12))return;last[name]=now;
      if(name==='warp'){beep(105,.75,'sawtooth',.15,4.3);beep(310,.85,'sine',.18,.42);}
      else if(name==='pulse'){beep(230,.5,'sawtooth',.16,2.8);beep(90,.9,'triangle',.22,.48);}
      else if(name==='signal'){beep(430,.24,'sine',.19,1.5);beep(660,.32,'triangle',.14,.9);}
      else if(name==='reward'){beep(530,.2,'triangle',.14,1.36);beep(790,.4,'sine',.16,1.25);}
      else if(name.startsWith('gun-')){
        const gun=name.slice(4);
        if(gun==='scatter'||gun==='flak'){beep(210,.14,'sawtooth',.13,.48);beep(405,.065,'triangle',.11,.7);}
        else if(gun==='rail'){beep(1040,.2,'sine',.13,.2);beep(370,.24,'sawtooth',.08,.76);}
        else if(gun==='plasma'){beep(195,.27,'sine',.18,2.5);beep(510,.18,'triangle',.08,.65);}
        else if(gun==='siege'){beep(95,.52,'sawtooth',.19,.42);beep(185,.36,'triangle',.11,1.8);}
        else if(gun==='diamond'){beep(1020,.075,'triangle',.11,.74);}
        else if(gun==='arc'||gun==='ion'){beep(800,.14,'sawtooth',.1,1.48);}
        else beep(680,.115,'square',.11,.63);
      }
      else if(name==='laser'){beep(690,.085,'square',.1,.65);}
      else if(name==='hit'){beep(160,.2,'sawtooth',.15,.55);}
      else if(name==='blast'){beep(115,.4,'sawtooth',.22,.38);}
      else if(name==='mine'){beep(490,.14,'triangle',.12,.8);}
      else if(name==='scan'){beep(240,.55,'sine',.12,2.9);}
      else if(name==='dock'){beep(360,.3,'triangle',.13,1.45);}
    }
    function update({cruising=false,speed=0,inDanger=false}={}){
      if(!enabled||!context||!ambience)return;
      const t=context.currentTime;
      ambience.gain.setTargetAtTime(cruising?.37:inDanger?.23:.14,t,.16);
      toneNodes[0]?.o.frequency.setTargetAtTime(cruising?69:55,t,.35);
      toneNodes[1]?.f.frequency.setTargetAtTime(cruising?710:inDanger?500:310,t,.22);
    }
    return {enable,disable,setVolume,event,update,isEnabled:()=>enabled,available:()=>!!(root.AudioContext||root.webkitAudioContext)};
  }
  root.WarpAudio={create};
})(typeof window!=='undefined'?window:this);
