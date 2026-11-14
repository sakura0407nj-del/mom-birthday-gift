(function(){'use strict';
var W=window,D=document,MB=W.MB=W.MB||{},NS='http://www.w3.org/2000/svg';
var IDS=['timeline','greenhouse','seaside','forest','clouds','musicbox','lanterns','memory','cake','wall','rain','closing'];
var PAPER={timeline:'#fbf3e2',greenhouse:'#eef6e4',seaside:'#fcefe3',forest:'#e8f1ea',clouds:'#edf3fb',musicbox:'#f8edf3',lanterns:'#fcf0da',memory:'#f0edf9',cake:'#fcefe8',wall:'#faf5e6',rain:'#ecf1f6',closing:'#fbf3e8'};
var OK={svg:1,g:1,path:1,circle:1,ellipse:1,rect:1,line:1,polyline:1,polygon:1};
var MOVES={leap:1,tide:1,float:1,bloom:1,drift:1,swing:1,flip:1,rain:1,draw:1};
var CN=['一','二','三','四','五','六','七','八','九','十','十一','十二'];
var CREASE='<path d="M50 0L0 30M50 0L100 30M50 0L22 100M50 0L78 100"/><path class="ct-fine" d="M50 0L38 100M50 0L62 100M0 30L22 100M100 30L78 100"/><path class="ct-mid" d="M50 0V100"/>';
var PLANE='<svg viewBox="0 0 120 80" focusable="false" aria-hidden="true"><path class="p2" d="M44 47L116 8L32 72Z"/><path class="p1" d="M4 40L116 8L44 47Z"/><path class="p3" d="M44 47L116 8L54 58Z"/><path class="p4" d="M44 47L116 8M22 43L74 29"/></svg>';
var STAMP='<svg viewBox="0 0 64 64" focusable="false" aria-hidden="true"><path class="s1" d="M32 3.6c15.8-.5 28.6 12.2 28.4 28.6-.2 15.6-12.9 28.3-28.6 28.2C15.9 60.3 3.5 47.8 3.7 31.6 3.9 16 16.4 4.1 32 3.6z"/><path class="s2" d="M32 9.5c12.6 0 22.6 10 22.5 22.6 0 12.4-10.2 22.4-22.6 22.4S9.5 44.3 9.6 31.8C9.7 19.4 19.6 9.5 32 9.5z"/><path class="s3" d="M13 47l4-3M51 17l-3 3"/></svg>';
var cache=new Map(),seq=0,cur=null,node=null,prev=MB.chapterCue;
if(prev&&!prev.__ceV6&&typeof prev.cancel==='function'){try{prev.cancel()}catch(e){}}
function reduced(){try{return !!(MB.motion&&MB.motion.reduced&&MB.motion.reduced())}catch(e){return false}}
function tier(){var t=MB.performance&&MB.performance.tier;return t===0||t===1||t===2?t:1}
function phone(){return Math.min(W.innerWidth||0,W.innerHeight||0)<650}
function now(){return W.performance&&typeof performance.now==='function'?performance.now():Date.now()}
function hex(v){return typeof v==='string'&&/^#([0-9a-f]{3}){1,2}$/i.test(v)?v:''}
function alive(c){try{return c.live()!==false}catch(e){return false}}
function vis(e){if((node&&(e===node||node.contains(e)))||e.closest('[hidden]')||!e.getClientRects().length)return false;
try{if(W.getComputedStyle(e).visibility==='hidden')return false}catch(x){}return true}
function modal(){var b=D.body,ds;if(!b)return true;if(b.classList.contains('surprise-open'))return true;
try{ds=Array.from(D.querySelectorAll('dialog:modal'))}catch(e){ds=Array.from(D.querySelectorAll('dialog[open]'))}
return ds.concat(Array.from(D.querySelectorAll('[aria-modal=true]'))).some(vis)}
function half(k,x){return '<div class="ct-half ct-'+k+'"><i class="ct-corner"></i><svg class="ct-crease" viewBox="'+x+' 0 50 100" preserveAspectRatio="none" focusable="false">'+CREASE+'</svg></div>'}
function root(){if(node&&node.isConnected)return node;if(!D.body)return null;
D.querySelectorAll('.scene-bridge[data-ce],.ct-root[data-ce]').forEach(function(n){n.remove()});
var f=D.getElementById('chapter-cue');if(f){f.hidden=true;f.removeAttribute('id')}
node=D.createElement('div');node.id='chapter-cue';node.className='ct-root';node.setAttribute('data-ce','v6');node.setAttribute('aria-hidden','true');node.hidden=true;
var d=node.dataset;d.state='idle';d.committed='0';d.scene='';
node.innerHTML=half('l',0)+half('r',50)+'<svg class="ct-trail" focusable="false" aria-hidden="true"><path d="M0 0"/></svg><div class="ct-art"><span class="ct-stamp">'+STAMP+'<b class="ct-sn"></b></span><div class="ct-plate"></div><p class="ct-name"><span class="ct-no"></span><span class="ct-tt"></span></p></div><div class="ct-plane">'+PLANE+'</div>';
D.body.appendChild(node);return node}
function hide(){if(D.body)D.body.classList.remove('scene-turning');if(!node)return;node.hidden=true;node.dataset.state='idle';var p=node.querySelector('.ct-plate');if(p)p.textContent=''}
function clean(s){Array.from(s.querySelectorAll('*')).reverse().concat(s).forEach(function(el){
if(el!==s&&(el.namespaceURI!==NS||!OK[el.localName])){el.remove();return}
Array.from(el.attributes).forEach(function(a){var n=a.name.toLowerCase(),v=a.value;
if(/^on/.test(n)||n==='id'||/href$/.test(n)||n==='style'||/url\(|javascript:/i.test(v)||(n==='data-move'&&(el.localName!=='g'||!MOVES[v])))el.removeAttribute(a.name)});
if(el.localName==='g'&&el.hasAttribute('data-move')&&el.hasAttribute('transform')){var w=el.ownerDocument.createElementNS(NS,'g');w.setAttribute('transform',el.getAttribute('transform'));el.removeAttribute('transform');el.parentNode.insertBefore(w,el);w.appendChild(el)}})}
function tpl(id){if(cache.has(id))return cache.get(id);var b=MB.sceneBridges&&MB.sceneBridges[id],out=null;if(!b)return null;
try{if(typeof b.svg==='string'&&W.DOMParser){var doc=new DOMParser().parseFromString(b.svg,'image/svg+xml'),s=doc.documentElement;
if(s&&s.localName==='svg'&&s.namespaceURI===NS&&!doc.getElementsByTagName('parsererror').length&&s.getElementsByTagName('*').length<=45){clean(s);s.removeAttribute('width');s.removeAttribute('height');s.setAttribute('viewBox','0 0 600 220');out=D.importNode(s,true)}}}catch(e){out=null}
if(cache.size>=12)cache.delete(cache.keys().next().value);cache.set(id,out);return out}
function pick(svg,max){var gs=Array.from(svg.querySelectorAll('g[data-move]')),mv=function(k){return gs.filter(function(g){return g.getAttribute('data-move')===k})},lp=mv('leap');
if(max<2)return (lp.length?lp:gs).slice(0,1);var td=mv('tide');
return lp.concat(td,gs.filter(function(g){return lp.indexOf(g)<0&&td.indexOf(g)<0})).slice(0,max)}
function kf(m,s){var X=function(v){return v*s+'px'},R=function(v){return v*s+'deg'};switch(m){
case 'leap':return[{transform:'translate('+X(-40)+',14px) rotate('+R(12)+')'},{transform:'translate('+X(-16)+',20px) rotate('+R(8)+')',offset:.2},{transform:'translate('+X(8)+',-24px) rotate('+R(-12)+')',offset:.6},{transform:'translate('+X(40)+',8px) rotate('+R(10)+')'}];
case 'tide':return[{transform:'translate('+X(30)+',0px)'},{transform:'translate('+X(10)+',-5px)',offset:.34},{transform:'translate('+X(-10)+',4px)',offset:.67},{transform:'translate('+X(-30)+',0px)'}];
case 'float':return[{transform:'translateY(10px) rotate('+R(-2)+')'},{transform:'translateY(-8px) rotate('+R(1.5)+')',offset:.6},{transform:'translateY(-4px) rotate(0deg)'}];
case 'bloom':return[{transform:'scale(.7)',opacity:.35},{transform:'scale(1.05)',opacity:1,offset:.62},{transform:'scale(1)',opacity:1}];
case 'drift':return[{transform:'translate('+X(-22)+',2px)'},{transform:'translate(0px,-4px)',offset:.5},{transform:'translate('+X(22)+',1px)'}];
case 'swing':return[{transform:'rotate('+R(-8)+')'},{transform:'rotate('+R(6)+')',offset:.38},{transform:'rotate('+R(-3)+')',offset:.7},{transform:'rotate('+R(1)+')'}];
case 'flip':return[{transform:'scaleX(1)'},{transform:'scaleX(-1)',offset:.45},{transform:'scaleX(-1)',offset:.6},{transform:'scaleX(1)'}];
case 'rain':return[{transform:'translateY(-22px)',opacity:0},{transform:'translateY(2px)',opacity:1,offset:.45},{transform:'translateY(18px)',opacity:0}];
default:return[{transform:'translateX('+X(-14)+')',opacity:0},{transform:'translateX(0px)',opacity:1,offset:.6},{transform:'translateX(0px)',opacity:1}]}}
function frame(c,fn){var id=W.requestAnimationFrame(function(){var i=c.rafs.indexOf(id);if(i>=0)c.rafs.splice(i,1);if(cur===c&&!c.done)fn()});c.rafs.push(id)}
function finish(c,ok){if(!c||c.done)return;c.done=true;if(cur===c)cur=null;
c.rafs.forEach(function(id){try{W.cancelAnimationFrame(id)}catch(e){}});c.rafs.length=0;
var as=c.anims;c.anims=[];as.forEach(function(a){try{a.cancel()}catch(e){}});
if(!cur)hide();c.res({committed:c.committed,finished:!!ok&&c.committed})}
function doCommit(c){if(c.attempted||c.done||!alive(c))return;c.attempted=true;
try{var ok=!c.commit||c.commit()!==false;if(cur===c&&!c.done&&ok){c.committed=true;if(node)node.dataset.committed='1';}}catch(e){try{console.error(e)}catch(x){}}}
function settle(){var c=cur;if(!c)return false;doCommit(c);finish(c,c.committed);return c.committed}
function cancel(){if(cur)finish(cur,false)}
function step(c){if(!alive(c)||modal()){finish(c,false);return}
if(D.hidden||reduced()){settle();return}
doCommit(c);if(cur!==c||c.done)return;if(!c.committed||!alive(c)){finish(c,false);return}
node.dataset.state='swap';frame(c,function(){reveal(c)})}
function wing(g){var p=function(v){return v*g};return[
{transform:'none',opacity:1},
{transform:'translateX('+p(.6)+'%) scaleX(1.006)',opacity:1,offset:.1},
{transform:'translateY(-1%) skewY('+p(-4)+'deg) scaleX(.5)',opacity:1,offset:.5},
{transform:'translateY(-3%) rotate('+p(-9)+'deg) scale(.16,.46)',opacity:1,offset:.84},
{transform:'translateY(-4%) rotate('+p(-12)+'deg) scale(.04,.22)',opacity:0}]}
function flight(s,vw,vh){var dx=vw*.58,P0=[-6,10],P1=[dx*.48,vh*.1],P2=[dx,-vh*.5],k=[],i,u,t,q,m,a,sc,ta=.42,Q1,Q2;
function B(t){var o=1-t;return[o*o*P0[0]+2*o*t*P1[0]+t*t*P2[0],o*o*P0[1]+2*o*t*P1[1]+t*t*P2[1]]}
function pf(x,y,r,kx,ky,op,off,ez){var f={transform:'translate('+(x*s).toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+(r*s).toFixed(1)+'deg) scale('+(kx*s).toFixed(3)+','+ky.toFixed(3)+')',opacity:op,offset:off};if(ez)f.easing=ez;return f}
k.push(pf(0,4,18,.4,.14,0,0,'ease-out'));
k.push(pf(-2,6,14,.82,.5,1,.1,'cubic-bezier(.3,0,.4,1)'));
k.push(pf(-6,10,22,1,1,1,.2,'cubic-bezier(.45,0,.9,.6)'));
for(i=1;i<=6;i++){u=i/6;t=u*(.3*u+.7);q=B(t);
m=[2*(1-t)*(P1[0]-P0[0])+2*t*(P2[0]-P1[0]),2*(1-t)*(P1[1]-P0[1])+2*t*(P2[1]-P1[1])];
a=Math.max(-38,Math.min(28,Math.atan2(m[1],m[0])*180/Math.PI+16));sc=1-.32*t;
k.push(pf(q[0],q[1],a,sc,sc,i<6?1:0,.2+.8*u))}
Q1=[P0[0]+ta*(P1[0]-P0[0]),P0[1]+ta*(P1[1]-P0[1])];Q2=B(ta);
return{k:k,d:'M'+(P0[0]*s)+' '+P0[1]+'Q'+(Q1[0]*s).toFixed(1)+' '+Q1[1].toFixed(1)+' '+(Q2[0]*s).toFixed(1)+' '+Q2[1].toFixed(1)}}
function reveal(c){if(!alive(c)){finish(c,false);return}
if(D.hidden||reduced()){finish(c,c.committed);return}
var r=node,T=c.T,s=c.s,wait=Math.max(0,T.hold-(now()-c.t0)),vw=W.innerWidth||800,vh=W.innerHeight||600,first=s>0?'l':'r',second=s>0?'r':'l',pd=wait+T.fold*.62,E='cubic-bezier(.6,0,.32,1)',f,a;
try{r.dataset.state='reveal';
a=r.querySelector('.ct-'+first).animate(wing(first==='l'?-1:1),{duration:T.fold,delay:wait,easing:E,fill:'both'});c.anims.push(a);
a=r.querySelector('.ct-'+second).animate(wing(second==='l'?-1:1),{duration:T.fold,delay:wait+T.lag,easing:E,fill:'both'});c.anims.push(a);
a=r.querySelector('.ct-art').animate([{opacity:1,transform:'none'},{opacity:.92,transform:'translateY(-4px) scale(.985)',offset:.3},{opacity:0,transform:'translateY(-16px) scale(.9)'}],{duration:T.fold*.72,delay:wait,easing:'ease-in',fill:'both'});c.anims.push(a);
f=flight(s,vw,vh);
a=r.querySelector('.ct-plane').animate(f.k,{duration:T.fly,delay:pd,easing:'linear',fill:'both'});c.anims.push(a);
if(c.trail){r.querySelector('.ct-trail path').setAttribute('d',f.d);
a=r.querySelector('.ct-trail').animate([{opacity:0,transform:'translate(0px,0px)'},{opacity:.7,transform:'translate(0px,2px)',offset:.28},{opacity:0,transform:'translate(0px,9px)'}],{duration:T.fly*.62,delay:pd+T.fly*.5,easing:'ease-out',fill:'both'});c.anims.push(a)}}
catch(e){finish(c,c.committed);return}
Promise.all(c.anims.map(function(x){return x.finished})).then(function(){if(cur===c)finish(c,alive(c))},function(){if(cur===c)finish(c,false)})}
function run(o){o=o||{};if(cur)finish(cur,false);var my=++seq;
return new Promise(function(res){
var c={seq:my,res:res,done:false,committed:false,anims:[],rafs:[],commit:typeof o.commit==='function'?o.commit:null,live:typeof o.isCurrent==='function'?o.isCurrent:function(){return true}};
cur=c;
try{var id=String(o.id||'').replace(/^panel-/,''),r=root();
if(!r||reduced()||D.hidden||modal()||typeof Element.prototype.animate!=='function'||typeof W.requestAnimationFrame!=='function'){if(r)r.dataset.committed='0';settle();return}
var b=(MB.sceneBridges&&MB.sceneBridges[id])||{},d=r.dataset,tr=tier(),lite=tr===0||phone()||o.light===true;
var ix=typeof o.index==='number'&&o.index>=0?Math.floor(o.index):-1,sn=ix>=0?(CN[ix]||String(ix+1)):'';
var s=(o.direction===-1||/^back/.test(String(o.direction)))?-1:1;c.s=s;c.trail=tr!==0;
c.T=tr===0?{hold:140,fold:300,fly:520,lag:30}:lite?{hold:190,fold:400,fly:700,lag:40}:{hold:260,fold:540,fly:820,lag:45};
r.style.setProperty('--ct-paper',PAPER[id]||'#fbf4e8');r.style.setProperty('--ct-accent',hex(b.accent)||'#c8a15a');
var plate=r.querySelector('.ct-plate'),t=IDS.indexOf(id)>=0?tpl(id):null,svg=null;plate.textContent='';
if(t){svg=t.cloneNode(true);svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('preserveAspectRatio','xMidYMid meet');plate.appendChild(svg)}
r.querySelector('.ct-no').textContent=ix>=0?'第 '+(ix+1)+' 幕':'';
r.querySelector('.ct-sn').textContent=sn;
r.querySelector('.ct-tt').textContent=String(o.name||b.name||'');
d.scene=id;d.state='cover';d.committed='0';d.tier=String(tr);d.light=lite?'1':'0';d.stamp=sn?'1':'0';d.sl=String(sn.length);
r.hidden=false;D.body.classList.add('scene-turning');c.t0=now();
var mx=tr===0?0:lite?2:3;
if(svg&&mx){try{pick(svg,mx).forEach(function(g){var a=g.animate(kf(g.getAttribute('data-move'),s),{duration:c.T.hold+c.T.fold,easing:'ease-in-out'});c.anims.push(a)})}catch(e){}}
frame(c,function(){frame(c,function(){step(c)})})}
catch(e){if(cur===c)settle();else finish(c,false)}})}
[W,D].forEach(function(t){
t.addEventListener('mb:surprise',function(e){if(e.detail&&e.detail.active)cancel()});
t.addEventListener('mb:gala',function(e){if(!e||!e.detail||e.detail.active!==false)settle()});
t.addEventListener('mb:home',cancel);
t.addEventListener('mb:motion',function(){if(reduced())settle()})});
D.addEventListener('visibilitychange',function(){if(D.hidden)settle()});
W.addEventListener('pagehide',cancel);
D.addEventListener('toggle',function(e){var t=e.target;if(cur&&t&&t.tagName==='DIALOG'&&t.open&&modal())cancel()},true);
if(D.body)root();else D.addEventListener('DOMContentLoaded',function(){root()},{once:true});
MB.chapterCue={run:run,settle:settle,cancel:cancel,start:function(){return Promise.resolve(false)},state:function(){return node?node.dataset.state:'idle'},__ceV6:true};
})();
