/* Shared animation budget. Only the chosen preference is saved; no telemetry. */
(()=>{'use strict';
 const MB=window.MB=window.MB||{},key='mom-animation-quality',choices=['auto','smooth','rich'];
 const coarse=window.matchMedia?matchMedia('(pointer:coarse)'):{matches:false};
 const phone=()=>{const short=Math.min(innerWidth,innerHeight);return short<650||(short<820&&coarse.matches);};
 const profiles=[
  {dpr:.85,burst:49,maxSparks:420,confetti:55,stars:56,cards:12,ambient:12,glows:8},
  {dpr:1,burst:70,maxSparks:700,confetti:75,stars:80,cards:16,ambient:18,glows:16},
  {dpr:1.5,burst:160,maxSparks:2400,confetti:180,stars:170,cards:24,ambient:58,glows:32}
 ].map(Object.freeze),phoneRich=Object.freeze({dpr:1.25,burst:88,maxSparks:1000,confetti:90,stars:100,cards:16,ambient:27,glows:22});
 let selection='auto',tier=1,samples=0,cost=0,interval=0,strikes=0;
 try{const saved=localStorage.getItem(key);if(choices.includes(saved))selection=saved;}catch(_){}
 function publish(reason){const root=document.documentElement;root.dataset.animationBudget=String(tier);root.dataset.animationQuality=selection;document.querySelectorAll('[data-animation-quality]').forEach(el=>el.value=selection);document.dispatchEvent(new CustomEvent('mb:quality',{detail:{tier,selection,reason}}));}
 function set(value,reason='user'){if(!choices.includes(value))return;selection=value;tier=value==='smooth'?0:value==='rich'?2:phone()?1:2;samples=cost=interval=strikes=0;try{localStorage.setItem(key,value);}catch(_){}publish(reason);}
 MB.performance={get profile(){return tier===2&&phone()?phoneRich:profiles[tier];},get tier(){return tier;},get selection(){return selection;},set:value=>set(value),
  report(drawMs,frameMs){if(selection!=='auto'||tier===0||!(frameMs>0)||frameMs>250)return;cost+=drawMs;interval+=frameMs;if(++samples<30)return;const heavy=cost/samples>10||interval/samples>53;samples=cost=interval=0;strikes=heavy?strikes+1:0;if(strikes>=2){strikes=0;tier--;publish('auto');}}
 };
 document.querySelectorAll('[data-animation-quality]').forEach(el=>el.addEventListener('change',()=>set(el.value)));set(selection,'init');
})();
