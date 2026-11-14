(()=>{'use strict';
const MB=window.MB||{};
const MSG=['记得把自己也放在心上','今天就安心做喜欢的事','不必事事周全，你已经很好','累了就歇一会儿','想吃什么就尝一口','慢慢来，不着急','今天你说了算','喝口热水，歇歇脚','开心就笑出声来','你的心情最值得照顾','想做的事尽管去做','今天不用照顾任何人','天凉记得添件衣','今晚好好睡一觉','我们一直在你身边','愿你每天都轻轻松松','生日快乐，妈妈','你值得被好好爱着'];
const ICONS=[`<svg viewBox='0 0 24 24'><path d='M12 21s-7-4.4-9.3-8.6C1 9 3 5 6.6 5c2.1 0 3.4 1.2 5.4 3.3C14 6.2 15.3 5 17.4 5 21 5 23 9 21.3 12.4 19 16.6 12 21 12 21z'/></svg>`,`<svg viewBox='0 0 24 24'><path d='M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z'/></svg>`,`<svg viewBox='0 0 24 24'><circle cx='12' cy='6.5' r='4.3'/><circle cx='17.5' cy='12' r='4.3'/><circle cx='12' cy='17.5' r='4.3'/><circle cx='6.5' cy='12' r='4.3'/><circle cx='12' cy='12' r='3' fill='#FFF6E8'/></svg>`,`<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='5'/><path d='M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>`,`<svg viewBox='0 0 24 24'><path d='M20 4C9 4 4 9 4 16c0 2 1 4 1 4s2-1 4-1c7 0 11-5 11-15z'/></svg>`,`<svg viewBox='0 0 24 24'><path d='M7 18a5 5 0 010-10 6 6 0 0111 2 4 4 0 010 8z'/></svg>`];
const COLORS=[['#FFF1EC','#F4C9C0','#B4646A'],['#FDF5E2','#EED7A4','#9A7236'],['#EEF3E6','#C9DABA','#557A4E'],['#EEF0F8','#CDD3EA','#56639A'],['#F8EDF4','#E7C6DA','#93567B'],['#EAF4F2','#C0DED7','#467E74']];
const STATUS={appearing:'小提醒正一张张冒出来…',gathering:'小提醒正慢慢围成一颗爱心…',greeting:'小提醒正慢慢围成一颗爱心…',complete:'点一张小窗，凑近读一读',paused:'已暂停，点“继续”接着看',scatter:'点“围成爱心”再收回来'};
const BLESS=['妈妈，','生日快乐'];
const SPARK=`<svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path d='M12 1L14 8.5 21.5 6.5 16 12 21.5 17.5 14 15.5 12 23 10 15.5 2.5 17.5 8 12 2.5 6.5 10 8.5Z'/></svg>`;
const SPRIG=`<svg viewBox='0 0 120 120' focusable='false'><path d='M6 114C26 84 50 62 100 40' fill='none' stroke='#BE9A5E' stroke-width='1.4' stroke-linecap='round'/><path d='M40 78c-9-13-5-26 6-32 4 12 2 24-6 32zM64 60c2-16 12-25 25-25-2 13-11 23-25 25zM26 96C12 94 4 86 2 74c12 0 20 8 24 22zM84 46c8-4 16-3 22 2-7 4-15 4-22-2z' fill='#E5B3A8' opacity='.75'/><circle cx='100' cy='40' r='2.2' fill='#C99A4E'/></svg>`;
const NS='http://www.w3.org/2000/svg';
const reduced=()=>{try{return !!(MB.motion&&MB.motion.reduced())}catch(e){return false}};
const tier=()=>{const p=MB.performance;let t=p&&p.tier;if(typeof t==='function'){try{t=t.call(p)}catch(e){t=1}}return typeof t==='number'?t:1};
const mobile=()=>Math.min(innerWidth,innerHeight)<650;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const HP=(()=>{const p=[],L=[0];for(let k=0;k<=240;k++){const t=Math.PI*2*k/240,s=Math.sin(t);p.push([16*s*s*s,13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)])}for(let k=1;k<p.length;k++)L.push(L[k-1]+Math.hypot(p[k][0]-p[k-1][0],p[k][1]-p[k-1][1]));return{p,L,P:L[L.length-1]}})();
let entry=null,dlg=null,stage,field,hero,spark,outline,clockEl,live,statusEl,bPause,bHeart,cards=[],anims=new Set(),gen=0,state='static',phase='complete',pending=null,heart=false,sel=null,shown=0,announced=false,owns=false,vw=0,vh=0;
const tstr=c=>`rotate(${c._rot}deg) scale(${c._sc})`;
function btn(t,fn,cls){const b=el('button','bw-btn'+(cls?' '+cls:''),t);b.type='button';b.addEventListener('click',fn);return b}
function track(a){anims.forEach(x=>{if(x.playState==='finished')anims.delete(x)});anims.add(a);return a}
function cancelAnims(){anims.forEach(a=>{a.onfinish=null;try{a.cancel()}catch(e){}});anims.clear()}
function stopAll(){gen++;pending=null;cancelAnims()}
function hold(ms,next,g){const a=track(clockEl.animate([{opacity:1},{opacity:1}],{duration:ms}));a.onfinish=()=>{anims.delete(a);if(g!==gen||!dlg)return;if(state==='paused'){pending=next;return}next()}}
function build(){dlg=el('dialog');dlg.id='blessing-windows-dialog';dlg.setAttribute('aria-labelledby','bw-title');dlg.setAttribute('aria-describedby','bw-status');
const head=el('header','bw-head'),tw=el('div','bw-tw'),h=el('h2','bw-title','满屏小祝福');h.id='bw-title';statusEl=el('p','bw-status');statusEl.id='bw-status';tw.append(h,statusEl);
const ctr=el('div','bw-ctrl');ctr.setAttribute('role','group');ctr.setAttribute('aria-label','祝福墙操作');
bPause=btn('暂停',togglePause);bHeart=btn('围成爱心',toggleHeart);bHeart.setAttribute('aria-pressed','false');
const bClose=btn('收好祝福',()=>{if(dlg)dlg.close()},'bw-primary');
ctr.append(bPause,btn('再开一次',()=>start()),bHeart,bClose);
live=el('span','bw-live');live.setAttribute('aria-live','polite');clockEl=el('span','bw-clock');clockEl.setAttribute('aria-hidden','true');
head.append(tw,ctr,live,clockEl);
const deco=el('div','bw-deco');deco.setAttribute('aria-hidden','true');deco.innerHTML=`<i class='bw-sprig'>${SPRIG}</i><i class='bw-sprig bw-sprig-r'>${SPRIG}</i>`;
stage=el('div','bw-stage');field=el('div','bw-field');stage.append(field);dlg.append(head,deco,stage);
field.addEventListener('click',onField);dlg.addEventListener('close',onClose);document.body.append(dlg);return bClose}
function status(){statusEl.textContent=state==='paused'?STATUS.paused:state==='playing'?STATUS[phase]:heart?STATUS.complete:STATUS.scatter}
function setPhase(p){phase=p;dlg.dataset.phase=p;status()}
function setState(s){state=s;dlg.dataset.state=s;const run=s==='playing'||s==='paused';bPause.textContent=s==='paused'?'继续':'暂停';bPause.setAttribute('aria-disabled',String(!run));bHeart.setAttribute('aria-disabled',String(run));bHeart.setAttribute('aria-pressed',String(heart));bHeart.textContent=heart?'散开看看':'围成爱心';status()}
function makeCard(i,mi){const c=el('button','bw-card'),col=COLORS[i%COLORS.length];c.type='button';c.tabIndex=-1;c.setAttribute('aria-pressed','false');c._r=Math.round((Math.random()*6-3)*10)/10;c._jx=Math.random()*2-1;c._jy=Math.random()*2-1;c._rot=c._r;c._sc=1;c.style.setProperty('--bg',col[0]);c.style.setProperty('--bar',col[1]);c.style.setProperty('--ink',col[2]);
const bar=el('span','bw-bar'),dots=el('span','bw-dots'),body=el('span','bw-body'),ico=el('span','bw-ico');dots.setAttribute('aria-hidden','true');ico.setAttribute('aria-hidden','true');ico.innerHTML=ICONS[i%ICONS.length];bar.append(dots,el('span','bw-tt','给妈妈的小提醒'));body.append(ico,el('span','bw-msg',MSG[mi]));c.append(bar,body,el('span','bw-more','♥ 这句话，收进心里啦'));return c}
function dims(){const m=dlg.classList.contains('bw-mobile');return[m?144:200,m?82:100,m]}
function heartGeo(W,H,n,cw,ch,m){const M=m?10:22;let s=.55,HW=120;for(let k=0;k<3;k++){HW=Math.max(120,Math.min(W-cw*s-2*M,(H-ch*s-2*M)*32/29,m?400:640));s=cl(HP.P*HW/32/(n*cw),.45,.6)}
const HH=HW*29/32,cx=W/2,top=Math.max(M,(H-HH)*.46),X=x=>cx+x*HW/32,Y=y=>top+(12-y)*HH/29,pts=[];let k=1;
for(let i=0;i<n;i++){const d=(i+.5)/n*HP.P;while(k<240&&HP.L[k]<d)k++;const a=HP.p[k-1],b=HP.p[k],f=cl((d-HP.L[k-1])/((HP.L[k]-HP.L[k-1])||1),0,1),x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f;pts.push([X(x),Y(y),Math.round(cl(x/16*14*cl((y-1)/8,-1,1),-14,14)*10)/10])}
let d='';for(let j=0;j<=240;j+=4){const q=HP.p[j];d+=(j?'L':'M')+X(q[0]).toFixed(1)+' '+Y(q[1]).toFixed(1)}
return{s:Math.round(s*100)/100,pts,d:d+'Z',cx,cy:top+HH*.47,ty:Y(-2),HW}}
function layout(){if(!dlg||!cards.length)return;const[cw,ch,m]=dims(),n=cards.length,W=field.clientWidth,H0=stage.clientHeight;dlg.dataset.heart=String(heart);
if(heart){field.style.height=H0+'px';stage.scrollTop=0;const g=heartGeo(W,H0,n,cw,ch,m);cards.forEach((c,i)=>{const q=g.pts[i];c._x=q[0]-cw/2;c._y=q[1]-ch/2;c._rot=q[2]+Math.round(c._r*2.5)/10;c._sc=g.s});
hero.style.left=Math.round(g.cx)+'px';hero.style.top=Math.round(g.ty)+'px';hero.style.fontSize=Math.round(cl(g.HW*(m?.088:.07),18,m?28:40))+'px';
outline.setAttribute('width',W);outline.setAttribute('height',H0);outline.setAttribute('viewBox',`0 0 ${W} ${H0}`);const p=outline.children;p[0].setAttribute('d',g.d);p[1].setAttribute('d',g.d);p[1].setAttribute('transform',`translate(${g.cx} ${g.cy}) scale(.88) translate(${-g.cx} ${-g.cy})`)}
else{const cols=Math.max(1,Math.min(n,Math.floor((W-8)/(cw*.82)))),rows=Math.ceil(n/cols),H=Math.max(H0,rows*ch*1.02+16),cx=W/cols,cy=H/rows;field.style.height=Math.round(H)+'px';
cards.forEach((c,i)=>{const r=Math.floor(i/cols),k=i%cols,inRow=Math.min(cols,n-r*cols),off=(cols-inRow)*cx/2+(r%2?cx*.12:-cx*.12);c._x=cl(off+k*cx+(cx-cw)/2+c._jx*Math.min(26,cx*.16),4,W-cw-4);c._y=cl(r*cy+(cy-ch)/2+c._jy*Math.min(22,cy*.16),4,H-ch-4);c._rot=c._r;c._sc=1})}
cards.forEach(c=>{c.style.left=Math.round(c._x)+'px';c.style.top=Math.round(c._y)+'px';c.style.transform=tstr(c)})}
function announce(){if(announced)return;announced=true;live.textContent='妈妈，生日快乐。'+cards.length+' 张小提醒围成了一颗爱心。'}
function setCount(v){shown=v;dlg.dataset.count=String(v)}
function appear(g){setPhase('appearing');const order=cards.slice().sort((a,b)=>(a._y+a._jy*40)-(b._y+b._jy*40)),n=order.length,step=Math.min(340,Math.round(2900/n));
order.forEach((c,k)=>{c.style.zIndex=String(k+1);c.classList.add('is-in');const a=track(c.animate([{opacity:0,transform:`translateY(22px) rotate(${c._r-5}deg) scale(.84)`},{opacity:1,offset:.55},{opacity:1,transform:tstr(c)}],{duration:540,delay:k*step,easing:'cubic-bezier(.2,.75,.25,1)',fill:'backwards'}));a.onfinish=()=>{if(g===gen&&dlg)setCount(Math.min(n,shown+1))}});
hold((n-1)*step+540,()=>hold(300,()=>gather(g),g),g)}
function gather(g){setPhase('gathering');setCount(cards.length);live.textContent=cards.length+' 张小提醒都开好了，正围成一颗爱心';
const st=stage.scrollTop,old=cards.map(c=>[c._x,c._y-st,c._rot,c._sc]);heart=true;layout();
const n=cards.length,step=Math.round(300/Math.ceil(n/2)),dur=900;let last=0;
cards.forEach((c,i)=>{const o=old[i],dx=o[0]-c._x,dy=o[1]-c._y,dl=Math.min(i,n-1-i)*step;last=Math.max(last,dl);track(c.animate([{transform:`translate(${dx}px,${dy}px) rotate(${o[2]}deg) scale(${o[3]})`},{transform:`translate(${Math.round(dx*.42)}px,${Math.round(dy*.42-16)}px) rotate(${(o[2]+c._rot)/2}deg) scale(${(o[3]+c._sc)/2})`,offset:.5},{transform:tstr(c)}],{duration:dur,delay:dl,easing:'cubic-bezier(.45,0,.2,1)',fill:'backwards'}))});
outline.classList.add('is-in');track(outline.animate([{opacity:0,transform:'scale(.94)'},{opacity:1,transform:'scale(1)'}],{duration:700,delay:380,easing:'ease-out',fill:'backwards'}));
hold(Math.max(dur+last,1080),()=>greet(g),g)}
function greet(g){setPhase('greeting');hero.classList.add('is-in');track(hero.animate([{opacity:0},{opacity:1}],{duration:300,fill:'backwards'}));
hero.querySelectorAll('.bw-hl').forEach((s,i)=>track(s.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:520,delay:i*140,easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'})));
track(spark.animate([{opacity:0,transform:'scale(0) rotate(-40deg)'},{opacity:1,transform:'scale(1.15) rotate(6deg)',offset:.7},{opacity:1,transform:'none'}],{duration:620,delay:240,easing:'ease-out',fill:'backwards'}));
hold(760,complete,g)}
function complete(){setPhase('complete');cards.forEach(c=>c.removeAttribute('tabindex'));setCount(cards.length);setState('finished');announce()}
function settleFinal(){stopAll();select(null,true);heart=true;cards.forEach(c=>{c.classList.add('is-in');c.removeAttribute('tabindex')});layout();hero.classList.add('is-in');outline.classList.add('is-in');setCount(cards.length);setPhase('complete');setState(reduced()?'static':'finished');announce()}
function start(){if(!dlg)return;stopAll();select(null,true);heart=false;announced=false;live.textContent='';
const m=mobile(),n=tier()===0?8:m?12:18;dlg.classList.toggle('bw-mobile',m);vw=innerWidth;vh=innerHeight;
hero=el('p','bw-hero');hero.append(el('span','bw-hl',BLESS[0]),el('span','bw-hl',BLESS[1]));spark=el('span','bw-spark');spark.innerHTML=SPARK;hero.append(spark);
outline=document.createElementNS(NS,'svg');outline.setAttribute('class','bw-outline');outline.setAttribute('aria-hidden','true');outline.setAttribute('focusable','false');outline.innerHTML=`<path class='bw-o1'/><path class='bw-o2'/>`;
cards=shuffle(MSG.map((_,i)=>i)).slice(0,n).map((mi,i)=>makeCard(i,mi));
field.replaceChildren(outline,hero,...cards);dlg.dataset.max=String(n);setCount(0);stage.scrollTop=0;layout();
if(reduced()){settleFinal();return}
setState('playing');appear(gen)}
function togglePause(){if(state==='playing'){anims.forEach(a=>{if(a.playState==='running')a.pause()});setState('paused')}else if(state==='paused'){setState('playing');anims.forEach(a=>{if(a.playState==='paused')a.play()});if(pending){const p=pending;pending=null;p()}}}
function toggleHeart(){if(state!=='finished'&&state!=='static')return;select(null,true);cancelAnims();const st=stage.scrollTop,old=cards.map(c=>[c._x,c._y-st,c._rot,c._sc]);heart=!heart;layout();hero.classList.toggle('is-in',heart);outline.classList.toggle('is-in',heart);setState(state);
if(reduced())return;const st2=stage.scrollTop;cards.forEach((c,i)=>{const o=old[i];track(c.animate([{transform:`translate(${o[0]-c._x}px,${o[1]-(c._y-st2)}px) rotate(${o[2]}deg) scale(${o[3]})`},{transform:tstr(c)}],{duration:640,delay:i*18,easing:'cubic-bezier(.4,0,.2,1)',fill:'backwards'}))});
if(heart){track(outline.animate([{opacity:0},{opacity:1}],{duration:500,delay:200,fill:'backwards'}));track(hero.animate([{opacity:0},{opacity:1}],{duration:420,delay:520,fill:'backwards'}))}}
function apply(c,quiet){const from=c.style.transform,to=sel===c?`translate(${c._tx}px,${c._ty}px) scale(${c._z})`:tstr(c);c.style.transform=to;if(!quiet&&!reduced()&&from&&from!==to)track(c.animate([{transform:from},{transform:to}],{duration:220,easing:'ease-out'}))}
function select(c,quiet){const prev=sel;if(prev){prev.classList.remove('is-sel');prev.setAttribute('aria-pressed','false');sel=null;if(prev.isConnected)apply(prev,quiet)}if(!c)return;sel=c;c.classList.add('is-sel');c.setAttribute('aria-pressed','true');
const[cw,ch]=dims(),z=heart?1:1.08,W=field.clientWidth,H=field.clientHeight,fx=c._x+cw/2,fy=c._y+(ch+22)/2,hw=cw*z/2+6,hh=(ch+22)*z/2+6;c._z=z;c._tx=Math.round(cl(fx,hw,Math.max(hw,W-hw))-fx);c._ty=Math.round(cl(fy,hh,Math.max(hh,H-hh))-fy);apply(c,quiet)}
function onField(e){if(state!=='finished'&&state!=='static')return;const c=e.target.closest('.bw-card');select(c&&c!==sel?c:null)}
function onClose(){if(!dlg)return;stopAll();const d=dlg;sel=null;dlg=null;cards=[];hero=spark=outline=null;d.remove();document.body.classList.remove('blessing-windows-open');if(owns){owns=false;document.body.classList.remove('surprise-open');document.dispatchEvent(new CustomEvent('mb:surprise',{detail:{active:false}}))}if(entry&&entry.isConnected)entry.focus({preventScroll:true})}
function open(){if(dlg)return;const j=document.getElementById('journey');if(j&&j.classList.contains('is-switching'))return;if(document.body.classList.contains('surprise-open')||document.querySelector('dialog[open]'))return;const bClose=build();owns=true;document.body.classList.add('surprise-open','blessing-windows-open');document.dispatchEvent(new CustomEvent('mb:surprise',{detail:{active:true}}));try{dlg.showModal()}catch(e){onClose();return}bClose.focus({preventScroll:true});start()}
function onResize(){if(!dlg||!cards.length)return;const w=innerWidth,h=innerHeight,m=mobile(),big=w!==vw||Math.abs(h-vh)>=80||m!==dlg.classList.contains('bw-mobile');if(!big&&h===vh)return;vw=w;vh=h;dlg.classList.toggle('bw-mobile',m);if(state==='playing'||state==='paused'){if(big)settleFinal()}else{select(null,true);cancelAnims();layout()}}
function init(){const p=document.getElementById('panel-wall');if(!p||document.getElementById('blessing-windows-entry'))return;const inner=p.querySelector('.scene-inner')||p;entry=el('button','bw-entry','让祝福开满屏');entry.id='blessing-windows-entry';entry.type='button';entry.setAttribute('aria-haspopup','dialog');entry.addEventListener('click',open);inner.append(entry);
addEventListener('resize',onResize,{passive:true});
addEventListener('pagehide',()=>{if(dlg){const d=dlg;try{d.close()}catch(e){}onClose()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&dlg&&state==='playing')togglePause()});
document.addEventListener('mb:motion',()=>{if(!dlg||!reduced())return;if(state==='playing'||state==='paused')settleFinal();else{cancelAnims();select(null,true);if(cards.length)layout();setState('static')}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
