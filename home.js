const $=s=>document.querySelector(s),B=document.body,A=$('#a'),C=$('#c'),line=$('#line'),RM=matchMedia('(prefers-reduced-motion: reduce)');
let motionChoice=null;
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
function startA(){go('a');$('#actrl').hidden=false;const sk=$('#skipA');if(gentle()){shot(3);$('#pause').hidden=true;sk.textContent='翻开纸书';sk.focus();return}$('#pause').hidden=false;$('#pause').textContent='暂停';sk.textContent='跳过，去翻书';ai=0;step();sk.focus()}
function togglePause(){paused=!paused;A.classList.toggle('paused',paused);$('#pause').textContent=paused?'继续':'暂停';if(paused){clearTimeout(timer);left=Math.max(0,due-Date.now())}else arm()}
$('#start').onclick=startA;$('#pause').onclick=togglePause;$('#skipA').onclick=()=>go('b');

const pages=[...document.querySelectorAll('.page')],pop=$('#pop'),tab=$('#tab'),fold=$('#fold');
function page(i){pi=Math.max(0,Math.min(pages.length-1,i));pages.forEach((p,k)=>{p.classList.toggle('on',k===pi);p.classList.toggle('past',k<pi);p.inert=k!==pi;p.setAttribute('aria-hidden',k!==pi)});$('#pg').textContent=(pi+1)+' / '+pages.length;$('#prev').disabled=pi===0;$('#next').disabled=pi===pages.length-1}
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
$('#prev').onclick=()=>page(pi-1);
$('#next').onclick=()=>{page(pi+1);if(pi===pages.length-1)$('#toC').focus({preventScroll:true})};
$('#toC').onclick=()=>go('c');
document.addEventListener('keydown',e=>{if(scene!=='b')return;if(e.key==='ArrowRight')page(pi+1);if(e.key==='ArrowLeft')page(pi-1)});

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
function loop(now){const dt=Math.min(50,now-last),f=dt/16.7;last=now;t+=dt;
while(plan.length&&plan[0].at<=t){const p=plan.shift();p.x0=p.tx+(Math.random()-.5)*60;p.u=0;S.push(p)}
x.clearRect(0,0,w,h);x.globalCompositeOperation='lighter';x.lineCap='round';
for(let i=S.length-1;i>=0;i--){const s=S[i];s.u+=dt/720;const e=1-Math.pow(1-Math.min(s.u,1),2),px=s.x0+(s.tx-s.x0)*e,py=h+(s.ty-h)*e;x.strokeStyle='rgba('+s.c+',.9)';x.lineWidth=2.2;x.beginPath();x.moveTo(px,py+14);x.lineTo(px,py);x.stroke();if(s.u>=1){boom(s);S.splice(i,1)}}
for(let i=P.length-1;i>=0;i--){const p=P[i];p.vx*=1-.016*f;p.vy=p.vy*(1-.016*f)+.032*f*k;p.x+=p.vx*f;p.y+=p.vy*f;p.l-=p.d*f;if(p.l<=0){P[i]=P[P.length-1];P.pop();continue}x.strokeStyle='rgba('+p.c+','+p.l.toFixed(2)+')';x.lineWidth=1.8;x.beginPath();x.moveTo(p.x-p.vx*3,p.y-p.vy*3);x.lineTo(p.x,p.y);x.stroke()}
if(!plan.length&&!S.length&&!P.length){const done=cb;stop();if(done)done();return}
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
$('#again').onclick=()=>{delete $('#b').dataset.flowerSeen;delete $('#b').dataset.letterSeen;page(0);setP(0);setFold(false);A.dataset.shot='0';line.classList.remove('in');go('intro');setTimeout(()=>$('#start').focus({preventScroll:true}),400)};
document.addEventListener('visibilitychange',()=>{fx.vis();if(document.hidden&&scene==='a'&&!paused&&!gentle())togglePause()});
page(0);
updateActiveScene(scene);
function setMotion() {
  const reduced=gentle();
  B.dataset.motion=reduced?'gentle':'full';
  $('#motion').textContent=reduced?'轻柔模式':'动画开启';
  $('#motion').setAttribute('aria-label',reduced?'轻柔模式，点击开启动画':'动画开启，点击切换轻柔模式');
  $('#motion').setAttribute('aria-pressed',String(reduced));
  if(reduced&&scene==='a') {
    clearTimeout(timer);paused=false;A.classList.remove('paused');shot(3);
    $('#pause').hidden=true;$('#skipA').textContent='翻开纸书';
  }
  if(reduced&&scene==='c'&&['reveal','show'].includes(C.dataset.s)) finish();
}
$('#motion').onclick=()=>{motionChoice=!gentle();setMotion()};
RM.addEventListener('change',setMotion);
setMotion();
