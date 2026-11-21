const $=s=>document.querySelector(s),B=document.body,A=$('#a'),C=$('#c'),line=$('#line'),RM=matchMedia('(prefers-reduced-motion: reduce)');
const motionKey='mom-motion-preference';
let motionChoice=null;
try {
  const saved=localStorage.getItem(motionKey);
  if(saved==='full'||saved==='gentle')motionChoice=saved==='gentle';
}catch(_){}
const gentle=()=>motionChoice??RM.matches;
const LINES=['街口亮起了灯。今天，早点回家吃饭。','门一开，灯是暖的，饭香先跑了出来。','今天换我们下厨。妈妈，你坐下歇一会儿。'],DUR=[3600,3200,3900];
let scene='intro',ai=0,timer=0,due=0,left=0,paused=false,pi=0,pv=0,cT=[];
document.querySelectorAll('img.art').forEach(i=>{const bad=()=>{i.style.visibility='hidden'};i.addEventListener('error',bad);if(i.complete&&!i.naturalWidth)bad()});
function go(s){scene=s;B.dataset.scene=s;if(s!=='a')stopA();if(s!=='c')resetC();updateActiveScene(s);const f={b:'#b .page.on h2',c:'#lift'}[s];if(f)setTimeout(()=>{if(scene===s)$(f).focus({preventScroll:true})},gentle()?0:400)}

function updateActiveScene(s) {
  for(const section of document.querySelectorAll('.scene')) {
    const active=section.id===(s==='intro'?'a':s);
    section.inert=!active;
    section.setAttribute('aria-hidden',String(!active));
  }
}
function shot(n){A.dataset.shot=n;line.textContent=LINES[n-1];line.classList.remove('in');void line.offsetWidth;line.classList.add('in')}
function step(){if(ai>=DUR.length){go('b');return}shot(ai+1);left=DUR[ai++];arm()}
function arm(){due=Date.now()+left;timer=setTimeout(step,left)}
function stopA(){clearTimeout(timer);paused=false;A.classList.remove('paused');$('#actrl').hidden=true}
function startA(){go('a');$('#actrl').hidden=false;const sk=$('#skipA');$('#pause').hidden=false;$('#pause').textContent='暂停';ai=0;step();sk.focus()}
function togglePause(){paused=!paused;A.classList.toggle('paused',paused);$('#pause').textContent=paused?'继续':'暂停';if(paused){clearTimeout(timer);left=Math.max(0,due-Date.now())}else arm()}
$('#start').onclick=startA;$('#pause').onclick=togglePause;$('#skipA').onclick=()=>go('b');

const pages=[...document.querySelectorAll('.page')],pop=$('#pop'),tab=$('#tab'),fold=$('#fold');
function page(i){pi=i;pages.forEach((p,k)=>{p.classList.toggle('on',k===pi);p.classList.toggle('past',k<pi);p.inert=k!==pi;p.setAttribute('aria-hidden',k!==pi)});$('#pg').textContent=(pi+1)+' / '+pages.length;$('#prev').disabled=pi===0;$('#next').disabled=pi===pages.length-1}

const turnStage=$('.paper-turn');
const turnSheet=$('.paper-turn-sheet');
const turnMotif=$('.paper-turn-motif');
// Each drawing previews the object that appears on the incoming page.
const turnArt={
  street:['#f3d6a2','#b78163','#774737','M22 54 50 24l28 30M30 47v28h40V47M45 75V57h11v18'],
  flower:['#f0c6be','#b77781','#8d334f','M49 49c-22 5-26-21-12-20 0-14 14-15 18-5 13-8 24 3 16 13 5 10-8 19-22 12m1 0q-5 15-3 30m2-17q-12-13-23-9 3 10 22 14m1-4q15-12 25-5-9 10-25 10'],
  letter:['#f0d6aa','#b98465','#794836','M24 37h52v30H24zM24 39l26 16 26-16M25 67l18-15m32 15L57 52'],
  sea:['#c9ddd5','#779aab','#345d6b','M24 68q7-7 14 0t14 0 14 0 14 0M32 56l14-29q3-5 9-2l11 6q6 4 3 10L55 63M53 23l4-7 11 6-4 7'],
  forest:['#cddac2','#899e8e','#3a6457','M42 54h21v23H42zM39 54l13-12 14 12m-16 2v13m-6-31v-9m-5 4h10m15 4v-14m-7 7h14'],
  notes:['#f5d5cd','#c58986','#9b5257','M34 22h23l12 12v42H34zM57 22v12h12M51 49c-8-8-18 5 0 15 19-10 8-23 0-15z'],
  table:['#f4d39d','#b78358','#775032','M25 66h50m-45-1c1-20 12-30 20-30s19 10 20 30M50 35v-8m-5-1h10M20 72h60'],
};
let paperTurn;
function endPaperTurn(){
  if(!paperTurn)return;
  const {frames,swap,end,target}=paperTurn;
  paperTurn=undefined;
  clearTimeout(swap);
  clearTimeout(end);
  for(const frame of frames)frame.cancel();
  turnStage.hidden=true;
  if(scene==='b'){
    if(target!==pi)page(target);
    if(target===pages.length-1)$('#toC').focus({preventScroll:true});
    if(target===0)$('#next').focus({preventScroll:true});
  }
}
function turnPage(target){
  if(paperTurn||target<0||target>=pages.length||target===pi)return;
  if(!turnSheet.animate){page(target);return}
  const [paper,edge,ink,path]=turnArt[pages[target].dataset.art];
  turnStage.style.setProperty('--turn-paper',paper);
  turnStage.style.setProperty('--turn-edge',edge);
  turnStage.style.setProperty('--turn-ink',ink);
  turnMotif.querySelector('path').setAttribute('d',path);
  turnStage.hidden=false;
  const direction=target>pi?1:-1;
  const duration=gentle()?340:760;
  const sheetFrames=gentle()?[
    {opacity:0},{opacity:1,offset:.37},{opacity:1,offset:.61},{opacity:0},
  ]:[
    {transform:`translateX(${104*direction}%) skewX(${-8*direction}deg)`,easing:'cubic-bezier(.28,.7,.25,1)'},
    {transform:'none',offset:.37},{transform:'none',offset:.61,easing:'cubic-bezier(.4,0,.2,1)'},
    {transform:`translateX(${-104*direction}%) skewX(${-8*direction}deg)`},
  ];
  const frames=[
    turnSheet.animate(sheetFrames,{duration,fill:'both'}),
    turnMotif.animate([{opacity:0},{opacity:1,offset:.34},{opacity:1,offset:.64},{opacity:0}],{duration,fill:'both'}),
  ];
  paperTurn={
    target,frames,
    swap:setTimeout(()=>page(target),duration*.44),
    end:setTimeout(endPaperTurn,duration),
  };
}
function setP(v){pv=Math.max(0,Math.min(1,v));pop.style.setProperty('--p',pv.toFixed(3));if(pv>=.99&&!pop.classList.contains('drag'))$('#b').dataset.flowerSeen='true';$('#pull').textContent=pv>.5?'把花收回去':'拉一下，让花升起来'}
let y0=null,p0=0,moved=false;
for(const heading of document.querySelectorAll('#b .page h2')) heading.tabIndex=-1;
tab.addEventListener('pointerdown',e=>{y0=e.clientY;p0=pv;moved=false;tab.setPointerCapture(e.pointerId);pop.classList.add('drag')});
tab.addEventListener('pointermove',e=>{if(y0===null)return;const d=e.clientY-y0;if(Math.abs(d)>4)moved=true;setP(p0+d/70)});
function endDrag(){if(y0===null)return;y0=null;pop.classList.remove('drag');setP(moved?(pv>.4?1:0):(p0>.5?0:1))}
tab.addEventListener('pointerup',endDrag);tab.addEventListener('pointercancel',endDrag);
tab.addEventListener('click',e=>{if(e.detail===0)setP(pv>.5?0:1)});
$('#pull').onclick=()=>setP(pv>.5?0:1);
function setFold(o){if(o)$('#b').dataset.letterSeen='true';fold.classList.toggle('open',o);$('#openL').textContent=o?'把信折回去':'打开信';$('#openL').setAttribute('aria-expanded',String(o));$('#letter').setAttribute('aria-hidden',String(!o))}
fold.onclick=$('#openL').onclick=()=>setFold(!fold.classList.contains('open'));
$('#prev').onclick=()=>turnPage(pi-1);
$('#next').onclick=()=>turnPage(pi+1);
$('#toC').onclick=()=>{endPaperTurn();go('c')};
document.addEventListener('keydown',event=>{
  if(scene!=='b'||event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  if(document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,[contenteditable]'))return;
  if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
  event.preventDefault();
  turnPage(pi+(event.key==='ArrowRight'?1:-1));
});

const fx=(()=>{const cv=$('#fx'),x=cv.getContext('2d'),compact=matchMedia("(max-width: 720px), (max-height: 500px)"),PAL=['255,214,140','255,242,214','255,180,120','255,156,176','246,224,150'];let raf=0,run=false,MAX=0,t=0,last=0,P=[],S=[],plan=[],cb=null,w=0,h=0,k=1;
function size(){const d=Math.min(window.devicePixelRatio||1,MAX<=176?1.25:1.5);w=innerWidth;h=innerHeight;cv.width=Math.round(w*d);cv.height=Math.round(h*d);x.setTransform(d,0,0,d,0,0);k=Math.min(w,h)/420+.45}
function start(done){if(!x){done();return}MAX=compact.matches?176:320;cv.dataset.fx='launch';cb=done;size();t=0;P=[];S=[];plan=[];const waves=[
  {at:0,shape:'petal',points:[[.23,.33],[.75,.29],[.52,.17]]},
  {at:1210,shape:'ring',points:[[.2,.2],[.79,.36],[.58,.25]]},
  {at:2480,shape:'willow',points:[[.31,.2],[.71,.19],[.51,.34],[.13,.27]]},
  {at:3860,shape:'petal',points:[[.17,.34],[.83,.35],[.33,.20],[.68,.19],[.5,.13]]},
];
waves.forEach((wave,k)=>wave.points.forEach(([x,y],i)=>plan.push({
  at:wave.at+i*145,tx:w*x,ty:h*y,c:PAL[(k+i*2)%PAL.length],shape:wave.shape
})));plan.sort((a,b)=>a.at-b.at);run=true;last=performance.now();if(!document.hidden)raf=requestAnimationFrame(loop)}
function boom(shell) {
  if(cv.dataset.fx!=='burst') cv.dataset.fx='burst';
  const n=Math.min(shell.shape==='ring'?42:(MAX<=176?40:64),MAX-P.length);
  for(let i=0;i<n;i++) {
    const angle=i/n*Math.PI*2 + Math.random()*.08;
    const spread=shell.shape==='ring'?3.4 + (i%2)*.68 : 1.2 + Math.random()*3.35;
    const drag=shell.shape==='willow'?.0095:.012;
    P.push({x:shell.tx,y:shell.ty,vx:Math.cos(angle)*spread*k,
      vy:Math.sin(angle)*spread*k,l:1,d:drag+Math.random()*.005,c:shell.c});
  }
}
function completeEffect(){const done=cb;stop();if(done)done()}
function loop(now){
  // Particle physics uses a bounded step, but missed frames cannot delay the show.
  const elapsed=Math.max(0,now-last),dt=Math.min(50,elapsed),f=dt/16.7;
  last=now;t+=elapsed;
  if(t>=7600){completeEffect();return}
  while(plan.length&&plan[0].at<=t){
    const p=plan.shift();
    const age=t-p.at;
    if(age>1250)continue;
    p.x0=p.tx+(Math.random()-.5)*60;
    p.u=Math.min(.98,age/720);
    S.push(p);
  }
x.clearRect(0,0,w,h);x.globalCompositeOperation='lighter';x.lineCap='round';
for(let i=S.length-1;i>=0;i--){const s=S[i];s.u+=dt/720;const e=1-Math.pow(1-Math.min(s.u,1),2),px=s.x0+(s.tx-s.x0)*e,py=h+(s.ty-h)*e;x.strokeStyle='rgba('+s.c+',.9)';x.lineWidth=2.2;x.beginPath();x.moveTo(px,py+14);x.lineTo(px,py);x.stroke();if(s.u>=1){boom(s);S.splice(i,1)}}
for(let i=P.length-1;i>=0;i--){const p=P[i];p.vx*=1-.016*f;p.vy=p.vy*(1-.016*f)+.032*f*k;p.x+=p.vx*f;p.y+=p.vy*f;p.l-=p.d*f;if(p.l<=0){P[i]=P[P.length-1];P.pop();continue}x.strokeStyle='rgba('+p.c+','+p.l.toFixed(2)+')';x.lineWidth=1.8;x.beginPath();x.moveTo(p.x-p.vx*3,p.y-p.vy*3);x.lineTo(p.x,p.y);x.stroke()}
if(!plan.length&&!S.length&&!P.length){completeEffect();return}
raf=requestAnimationFrame(loop)}
function stop(){run=false;cancelAnimationFrame(raf);raf=0;P=[];S=[];plan=[];cb=null;cv.dataset.fx='idle';if(x)x.clearRect(0,0,w,h)}
function vis(){if(document.hidden){cancelAnimationFrame(raf);raf=0}else if(run&&!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
addEventListener('resize',()=>{if(run)size()});
return{start,stop,vis}})();

function lift(){if(C.dataset.s!=='cover')return;$('#lift').hidden=true;if(gentle()){finish();return}C.dataset.s='reveal';$('#skipC').hidden=false;$('#skipC').focus({preventScroll:true});cT.push(setTimeout(()=>{C.dataset.s='show'},1300),setTimeout(()=>fx.start(finish),1900))}
function finish(){cT.forEach(clearTimeout);cT=[];fx.stop();C.dataset.s='done';$('.wish').setAttribute('aria-hidden','false');$('#lift').hidden=true;$('#skipC').hidden=true;$('#replay').hidden=false;$('#again').hidden=false;$('#keepsake-open').hidden=false;$('#keepsake-open').focus({preventScroll:true})}
function resetC(){cT.forEach(clearTimeout);cT=[];fx.stop();C.dataset.s='cover';$('.wish').setAttribute('aria-hidden','true');$('#lift').hidden=false;['#skipC','#replay','#again','#keepsake-open'].forEach(s=>{$(s).hidden=true})}
$('#lift').onclick=lift;$('#skipC').onclick=finish;
$('#replay').onclick=()=>{resetC();if(gentle())lift();else requestAnimationFrame(()=>requestAnimationFrame(()=>{if(scene==='c')lift()}))};
$('#again').onclick=()=>{delete $('#b').dataset.flowerSeen;delete $('#b').dataset.letterSeen;document.dispatchEvent(new Event('home:restart'));page(0);setP(0);setFold(false);A.dataset.shot='0';line.classList.remove('in');go('intro');setTimeout(()=>$('#start').focus({preventScroll:true}),400)};
let suspendedA=false;
document.addEventListener('visibilitychange',()=>{
  fx.vis();
  if(scene!=='a'){suspendedA=false;return}
  if(document.hidden&&!paused){suspendedA=true;togglePause()}
  if(!document.hidden&&suspendedA){suspendedA=false;if(paused)togglePause()}
});
page(0);
updateActiveScene(scene);
function setMotion() {
  const reduced=gentle();
  B.dataset.motion=reduced?'gentle':'full';
  $('#motion').textContent=reduced?'开启动画':'关闭动画';
  if(reduced)endPaperTurn();
  if(reduced&&scene==='c'&&['reveal','show'].includes(C.dataset.s)) finish();
}
$('#motion').onclick=()=>{
  motionChoice=!gentle();
  try{localStorage.setItem(motionKey,motionChoice?'gentle':'full')}catch(_){}
  setMotion();
};
RM.addEventListener('change',setMotion);
setMotion();
