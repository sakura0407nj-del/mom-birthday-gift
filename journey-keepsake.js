/* 拾光成笺：小游戏互动纪念章、可保存的生日纪念笺、目录线描章。可选模块，缺失时原网站照常运行。 */
(function(){
'use strict';
var MB=window.MB=window.MB||{};
if(MB.journeyKeepsake)return;
MB.journeyKeepsake=true;
var NS='http://www.w3.org/2000/svg',KEY='mb-play-keepsakes-v1',SERIF='Songti SC,STSong,Noto Serif SC,Source Han Serif SC,SimSun,serif';
var GAMES=['timeline','greenhouse','seaside','forest','clouds','musicbox','lanterns','memory','cake','rain'];
var NAME={timeline:'四季花束',greenhouse:'心愿幼苗',seaside:'海风回信',forest:'森林相遇',clouds:'云端来信',musicbox:'慢时光票根',lanterns:'灯下好签',memory:'爱的星座',cake:'第一口甜',rain:'晴天雨滴'};
var MOTIF={
timeline:'M24 37V23M24 31Q18 29 16 24M24 33Q30 31 32 26M19 14Q19 23 24 23Q29 23 29 14L26.5 17L24 13L21.5 17Z',
greenhouse:'M17 29H31L29 37H19ZM24 29V21M24 24Q18 24 17 18Q23 18 24 24M24 22Q29 21 31 15Q25 15 24 22',
seaside:'M24 34L15 23Q16 15 24 13Q32 15 33 23ZM24 34L20 15M24 34V13M24 34L28 15M15 37Q19.5 35 24 37T33 37',
forest:'M20 19H28V32H20ZM22 19L24 15L26 19M22 32V35H26V32M24 23V28M16 25H18M30 25H32M15 37Q24 35 33 37',
clouds:'M13 25L35 16L30 33L24 28ZM24 28L35 16M24 28V33L27 30.5M14 35Q17.5 32.5 21 35',
musicbox:'M13 18H35V22Q32 24.5 35 27V31H13V27Q16 24.5 13 22ZM29 18V31M17 23H25M17 26.5H23',
lanterns:'M18 27H30L28 37H20ZM22 27V13H26V27M22 17H26M16 27H32',
memory:'M15 31L24 19L33 31M15 31Q24 37 33 31M24 13Q24.7 16.3 28 17Q24.7 17.7 24 21Q23.3 17.7 20 17Q23.3 16.3 24 13Z',
cake:'M14 31L34 26V35L14 37ZM14 31L30 22L34 26M14 34L34 30.5M30 22V17M30 17Q28 15 30 12.5Q32 15 30 17',
wall:'M14 18H34V33H14ZM14 18L24 26L34 18M14 33L21 26M34 33L27 26',
rain:'M13 26Q14 16 24 15Q34 16 35 26Q32 23.5 29.5 26Q27 23.5 24 26Q21 23.5 18.5 26Q16 23.5 13 26ZM24 15V35Q24 37.5 21.5 36.5',
closing:'M24 34Q13 27 15 21Q17 16 24 20.5Q31 16 33 21Q35 27 24 34ZM20 24Q24 22 28 24'};
var RING='M7 24a17 17 0 1 0 34 0a17 17 0 1 0-34 0';
var EDGE=(function(){function p(a,r){return (24+r*Math.cos(a)).toFixed(2)+' '+(24+r*Math.sin(a)).toFixed(2)}var s='',n=20,t=Math.PI*2/n;for(var i=0;i<n;i++)s+=(i?'':'M'+p(0,20.6))+'Q'+p((i+.5)*t,23.6)+' '+p((i+1)*t,20.6);return s+'Z'})();
var PETAL='M0 0Q-9-12 0-22Q9-12 0 0Z',DOT='M-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0',DIA='M0-9L9 0L0 9L-9 0Z',STAR='M0-16Q2-2 16 0Q2 2 0 16Q-2 2-16 0Q-2-2 0-16Z',MOON='M20-57A60 60 0 1 0 20 57A64 64 0 0 1 20-57Z';
var STEM='M0 0C40 30 90 50 150 58C190 63 230 60 262 48',LEAF='M60 34Q72 6 98 6Q88 32 60 34ZM112 52Q134 30 160 38Q140 60 112 52ZM196 60Q214 82 240 78Q226 56 196 60ZM36 22Q24 48 44 64Q56 42 36 22Z';
var THEME={
dawn:{name:'花间晨光',mat:'#ead9bd',paper:'#f8f0e0',gold:'#b48d52',sage:'#7c9878',berry:'#a8475f',ink:'#5a4337',soft:'#8c7361',title:'#a8475f',lines:['今天的花、风和灯光，','都在替我们轻轻说：','愿你被好好爱着，慢慢地过。']},
night:{name:'星夜来信',mat:'#151c2c',paper:'#232d46',gold:'#d8b878',sage:'#a3bb9d',berry:'#e3a1b0',ink:'#f1e6cf',soft:'#bfb4a2',title:'#efd9a6',lines:['把想说的话折进星光里，','寄给最亮的那一盏灯：','谢谢你，我们一直都在。']}};
var list=[],ls=null,persistent=false,picks=[],theme='dawn',busy=false,gen=0,url=null,jump=false,anims=[],U={};
function byId(i){return document.getElementById(i)}
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function btn(c,x){var b=mk('button',c,x);b.type='button';return b}
function el(t,a){var e=document.createElementNS(NS,t);for(var k in a)if(a[k]!=null)e.setAttribute(k,String(a[k]));return e}
function reduced(){try{return MB.motion&&typeof MB.motion.reduced==='function'?!!MB.motion.reduced():!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){return true}}
function clean(a){var o=[];if(Array.isArray(a))a.forEach(function(x){if(typeof x==='string'&&GAMES.indexOf(x)>-1&&o.indexOf(x)<0)o.push(x)});return o}
try{ls=window.localStorage;ls.setItem(KEY+':t','1');ls.removeItem(KEY+':t');persistent=true}catch(e){ls=null}
if(ls){try{var saved=ls.getItem(KEY)||'[]';list=saved.length<=2048?clean(JSON.parse(saved)):[]}catch(e){list=[]}}
function ordered(){return GAMES.filter(function(g){return list.indexOf(g)>-1})}
function record(e){var id=e&&e.detail&&e.detail.id;if(typeof id!=='string'||GAMES.indexOf(id)<0||list.indexOf(id)>-1)return;list.push(id);if(ls){try{ls.setItem(KEY,JSON.stringify(list))}catch(_){ls=null;persistent=false}}toc()}
function stampSvg(id,cls){var s=el('svg',{viewBox:'0 0 48 48','aria-hidden':'true',focusable:'false','class':cls||null});[[EDGE,1.2,1],[RING,.7,.6],[MOTIF[id],1.5,1]].forEach(function(q){s.appendChild(el('path',{d:q[0],fill:'none',stroke:'currentColor','stroke-width':q[1],'stroke-linecap':'round','stroke-linejoin':'round',opacity:q[2]<1?q[2]:null}))});return s}
function compose(tk,ids){var T=THEME[tk],O=[];
function P(d,o){o=o||{};o.d=d;O.push(o)}
function X(t,x,y,z,c,a,g){O.push({t:t,x:x,y:y,z:z,c:c,a:a||'center',g:g})}
function bloom(x,y,k,c){for(var i=0;i<5;i++)P(PETAL,{f:c,x:x,y:y,k:k,r:i*72});P(DOT,{f:T.gold,x:x,y:y,k:k})}
function sprig(x,y,k,r){var m=r?-1:1;P(STEM,{s:T.sage,w:3,x:x,y:y,k:k,r:r});P(LEAF,{f:T.sage,o:.78,x:x,y:y,k:k,r:r});[[262,48,T.berry,1],[150,58,T.gold,.75],[22,14,T.berry,.6]].forEach(function(b){bloom(x+m*k*b[0],y+m*k*b[1],k*b[3],b[2])})}
P('M0 0H900V1200H0Z',{f:T.mat});P('M40 40H860V1160H40Z',{f:T.paper});
P('M72 72H828V1128H72Z',{s:T.gold,w:2.5});P('M86 86H814V1114H86Z',{s:T.gold,w:1,o:.55});
[[72,72],[828,72],[72,1128],[828,1128]].forEach(function(q){P(DIA,{f:T.gold,x:q[0],y:q[1]})});
if(tk==='night'){P(MOON,{f:T.gold,x:724,y:192,o:.92});[[176,176,1],[258,124,.6],[612,132,.5],[796,312,.7],[128,336,.5],[812,520,.45],[112,700,.6],[800,860,.45],[150,960,.4]].forEach(function(s){P(STAR,{f:T.gold,x:s[0],y:s[1],k:s[2],o:.85})});sprig(790,1080,.85,180)}
else{sprig(110,130,.95,0);sprig(790,1080,.95,180)}
X('拾 光 成 笺',450,236,26,T.gold);X('A KEEPSAKE FOR MOM',450,274,17,T.soft);X('妈妈，生日快乐',450,384,80,T.title);
P('M-130 0H-26M26 0H130',{s:T.gold,w:1.5,x:450,y:430});P(DIA,{f:T.berry,x:450,y:430,k:.7});
T.lines.forEach(function(l,i){X(l,450,504+i*52,30,T.ink)});
var none=!ids.length,use=none?['closing']:ids,xs=[[450],[335,565],[220,450,680]][use.length-1],cols=[T.berry,T.sage,T.gold],rot=[-6,4,-3];
use.forEach(function(id,i){var c=cols[i],g=none?'base':id,o={x:xs[i],y:760,k:160/48,r:rot[i],m:24,g:g};P(EDGE,Object.assign({f:c,o:.1},o));P(EDGE,Object.assign({s:c,w:1.3},o));P(RING,Object.assign({s:c,w:.7,o:.7},o));P(MOTIF[id],Object.assign({s:c,w:1.6},o));X(none?'生日纪念':NAME[id],xs[i],888,24,c,'center',g)});
X(none?'一张写给妈妈的生日笺':'这一路上，一起留下的小纪念',450,936,22,T.soft);
X('—— 爱你的我们',770,996,28,T.ink,'right');
return O}
function tf(o){return 'translate('+(o.x||0)+' '+(o.y||0)+') rotate('+(o.r||0)+') scale('+(o.k||1)+')'+(o.m?' translate('+(-o.m)+' '+(-o.m)+')':'')}
function toSvg(O){var s=el('svg',{viewBox:'0 0 900 1200','aria-hidden':'true',focusable:'false'}),groups={};
O.forEach(function(o){var n;if(o.t!=null){n=el('text',{x:o.x,y:o.y,'font-size':o.z,fill:o.c,'text-anchor':o.a==='center'?'middle':o.a==='right'?'end':'start','font-family':SERIF});n.textContent=o.t}
else n=el('path',{d:o.d,transform:tf(o),fill:o.f||'none',stroke:o.s||null,'stroke-width':o.s?o.w:null,'stroke-linecap':'round','stroke-linejoin':'round',opacity:o.o!=null?o.o:null});
var host=s;if(o.g)host=groups[o.g]||(groups[o.g]=s.appendChild(el('g',{'class':'jk-ink','data-g':o.g})));host.appendChild(n)});return s}
function toCanvas(x,O){x.lineCap='round';x.lineJoin='round';x.textBaseline='alphabetic';
O.forEach(function(o){x.save();x.globalAlpha=o.o!=null?o.o:1;
if(o.t!=null){x.font=o.z+'px '+SERIF;x.fillStyle=o.c;x.textAlign=o.a;x.fillText(o.t,o.x,o.y)}
else{x.translate(o.x||0,o.y||0);x.rotate((o.r||0)*Math.PI/180);x.scale(o.k||1,o.k||1);if(o.m)x.translate(-o.m,-o.m);var p=new Path2D(o.d);if(o.f){x.fillStyle=o.f;x.fill(p)}if(o.s){x.strokeStyle=o.s;x.lineWidth=o.w||1;x.stroke(p)}}
x.restore()})}
function move(n,f,ms){if(!n||typeof n.animate!=='function'||reduced()||document.hidden)return;try{var a=n.animate(f,{duration:ms,easing:'cubic-bezier(.2,.8,.2,1)'});anims.push(a);a.onfinish=a.oncancel=function(){var i=anims.indexOf(a);if(i>-1)anims.splice(i,1)}}catch(e){}}
function stopAll(){anims.splice(0).forEach(function(a){try{a.cancel()}catch(e){}})}
function say(t){if(U.stat)U.stat.textContent=t}
function stale(){return U.res&&!U.res.hidden?' 图片还是上一版，可点「重新印制」更新。':''}
function build(){var s=mk('section','jk');s.setAttribute('aria-labelledby','jk-title');
var head=mk('header','jk-head'),h=mk('h3',null,'把这一天带走');h.id='jk-title';h.tabIndex=-1;
head.appendChild(mk('p','jk-kicker','拾光成笺'));head.appendChild(h);head.appendChild(mk('p','jk-lede','挑几枚小游戏留下的纪念章，印在一张给妈妈的生日笺上，存成图片留着。'));
var stage=mk('div','jk-stage'),fig=mk('figure','jk-preview'),pan=mk('div','jk-panel');fig.appendChild(mk('figcaption',null,'笺纸预览 · 保存为 900×1200 PNG'));
var tl=mk('p','jk-label','笺纸配色');tl.id='jk-theme-label';var th=mk('div','jk-themes');th.setAttribute('role','group');th.setAttribute('aria-labelledby','jk-theme-label');
['dawn','night'].forEach(function(k){var b=btn('jk-theme'),i=mk('i');i.setAttribute('aria-hidden','true');b.dataset.t=k;b.appendChild(i);b.appendChild(document.createTextNode(THEME[k].name));th.appendChild(b)});
var cl=mk('p','jk-label');cl.id='jk-count';var st=mk('div','jk-stamps');st.setAttribute('role','group');st.setAttribute('aria-labelledby','jk-count');
var em=mk('p','jk-empty','还没有纪念章也没关系：这张笺本身就是一份完整的生日祝福，现在就能保存。玩完小游戏后再回来，可以把纪念章加印上去。');
var note=mk('p','jk-note','当前浏览器不允许保存，纪念章只保留到这次页面关闭。');
var mb=btn('jk-make','印好并保存图片'),stat=mk('p','jk-status');stat.setAttribute('role','status');stat.setAttribute('aria-live','polite');stat.setAttribute('aria-atomic','true');
var res=mk('div','jk-result'),img=mk('img'),dl=mk('a','jk-dl','下载 PNG');res.hidden=true;img.alt='';dl.download='妈妈生日快乐-拾光成笺.png';
res.appendChild(img);res.appendChild(mk('p','jk-tip','手机上长按图片即可保存或分享；电脑可点下面的按钮下载。'));res.appendChild(dl);
var more=mk('details','jk-more'),sp=mk('p');more.appendChild(mk('summary',null,'关于纪念章与保存'));more.appendChild(mk('p',null,'从本次更新起，每完成一个小游戏，就会在这里留下一枚互动纪念章，之前的完成不会补记。纪念章和十二份心意收藏分开计算，不改变已收藏的数量。'));more.appendChild(sp);
[tl,th,cl,st,em,note,mb,stat,res,more].forEach(function(n){pan.appendChild(n)});stage.appendChild(fig);stage.appendChild(pan);s.appendChild(head);s.appendChild(stage);
th.addEventListener('click',onTheme);st.addEventListener('click',onStamp);mb.addEventListener('click',make);
U={sec:s,h:h,fig:fig,svg:null,th:th,cl:cl,st:st,em:em,note:note,make:mb,stat:stat,res:res,img:img,dl:dl,sp:sp}}
function syncTheme(){Array.prototype.forEach.call(U.th.children,function(b){b.setAttribute('aria-pressed',String(b.dataset.t===theme))});U.sec.dataset.theme=theme}
function preview(fresh){var s=toSvg(compose(theme,picks));if(U.svg&&U.svg.parentNode===U.fig)U.fig.replaceChild(s,U.svg);else U.fig.insertBefore(s,U.fig.firstChild);U.svg=s;
if(fresh)move(s.querySelector('[data-g='+fresh+']'),[{opacity:0,transform:'scale(1.3) rotate(-8deg)'},{opacity:1,transform:'scale(.97)',offset:.7},{opacity:1,transform:'none'}],460)}
function fill(){var have=ordered();picks=picks.filter(function(id){return have.indexOf(id)>-1});
U.cl.textContent=have.length?'互动纪念章 '+have.length+' / 10 · 最多选 3 枚印上':'互动纪念章 · 还没有留下';
U.st.textContent='';have.forEach(function(id){var b=btn('jk-stamp');b.dataset.id=id;b.setAttribute('aria-pressed',String(picks.indexOf(id)>-1));b.appendChild(stampSvg(id));b.appendChild(mk('span',null,NAME[id]));U.st.appendChild(b)});
U.st.hidden=!have.length;U.em.hidden=!!have.length;U.note.hidden=persistent;
U.sp.textContent=persistent?'纪念章只在当前浏览器记下小游戏编号，不保存留言、心愿或其他个人信息；清理浏览器数据会一并清除。':'当前浏览器不允许保存，纪念章只保留到这次页面关闭；不会保存任何个人信息。';
syncTheme();preview()}
function onTheme(e){if(busy)return;var b=e.target.closest&&e.target.closest('.jk-theme');if(!b||b.dataset.t===theme)return;theme=b.dataset.t;syncTheme();preview();move(U.svg,[{opacity:.35,transform:'translateY(6px)'},{opacity:1,transform:'none'}],360);say('已换成「'+THEME[theme].name+'」。'+stale())}
function onStamp(e){if(busy)return;var b=e.target.closest&&e.target.closest('.jk-stamp');if(!b)return;var id=b.dataset.id,i=picks.indexOf(id);
if(i>-1){picks.splice(i,1);b.setAttribute('aria-pressed','false');preview();say('已取下「'+NAME[id]+'」。'+stale());return}
if(picks.length>=3){say('一张笺最多印 3 枚，先取下一枚再换。');return}
picks.push(id);b.setAttribute('aria-pressed','true');preview(id);say('已印上「'+NAME[id]+'」，'+picks.length+' / 3。'+stale())}
function lockSettings(locked){[U.th,U.st].forEach(function(p){if(p)Array.prototype.forEach.call(p.children,function(b){b.disabled=locked})})}
function finish(){busy=false;lockSettings(false);U.make.disabled=false;U.make.removeAttribute('aria-busy')}
function fail(){finish();say('这次没有印好，请再点一次试试。')}
function show(u,blob,tk,ids){var old=url,was=U.res.hidden;url=blob?u:null;
U.img.alt='生日纪念笺：妈妈，生日快乐。'+THEME[tk].name+'配色，'+(ids.length?'印有'+ids.map(function(i){return NAME[i]}).join('、')+'纪念章。':'印有一枚生日纪念章。');
U.img.src=u;U.dl.href=u;if(old&&old!==u){try{URL.revokeObjectURL(old)}catch(e){}}
U.res.hidden=false;finish();U.make.textContent='重新印制';say('纪念笺已印好。手机可长按图片保存，电脑可点「下载 PNG」。');
if(was)move(U.res,[{opacity:0,transform:'translateY(12px) scaleY(.94)'},{opacity:1,transform:'none'}],520)}
function make(){if(busy||!U.make)return;busy=true;lockSettings(true);var my=++gen,tk=theme,ids=picks.slice();U.make.disabled=true;U.make.setAttribute('aria-busy','true');say('正在印制纪念笺……');
setTimeout(function(){if(my!==gen)return;try{var cv=document.createElement('canvas');cv.width=900;cv.height=1200;var x=cv.getContext('2d');if(!x||typeof Path2D!=='function')throw 0;toCanvas(x,compose(tk,ids));
if(cv.toBlob)cv.toBlob(function(b){if(my!==gen)return;if(!b)return fail();var made=null;try{made=URL.createObjectURL(b);show(made,true,tk,ids)}catch(e){if(made){try{URL.revokeObjectURL(made)}catch(_){}}fail()}},'image/png');
else show(cv.toDataURL('image/png'),false,tk,ids)}catch(e){if(my===gen)fail()}},30)}
function reset(){gen++;stopAll();busy=false;lockSettings(false);if(U.make){U.make.disabled=false;U.make.removeAttribute('aria-busy');U.make.textContent='印好并保存图片';U.res.hidden=true;U.img.removeAttribute('src');U.img.alt='';U.dl.removeAttribute('href');say('')}if(url){try{URL.revokeObjectURL(url)}catch(e){}url=null}}
function onAlbum(){var m=byId('surprise-dialog'),grid=byId('surprise-album-grid');if(!m||!grid||!grid.parentNode||m.dataset.view!=='album')return;
if(!U.sec)build();if(U.sec.nextSibling!==grid)grid.parentNode.insertBefore(U.sec,grid);fill();
if(jump){jump=false;try{U.h.focus()}catch(e){}}}
function toc(){var bs=document.querySelectorAll('#contents-dialog .chapter-links button[data-go]');
Array.prototype.forEach.call(bs,function(b){var go=String(b.getAttribute('data-go'));if(go.indexOf('panel-'))return;var id=go.slice(6);if(!MOTIF[id])return;
var n=b.querySelector('.jk-toc-note');if(!n){b.classList.add('jk-toc');b.appendChild(stampSvg(id,'jk-toc-art'));n=mk('span','jk-toc-note','留下一枚纪念');b.appendChild(n)}
var d=list.indexOf(id)>-1;b.dataset.jkDone=String(d);n.hidden=!d})}
function closing(){var a=document.querySelector('#panel-closing .closing-actions');if(!a||a.querySelector('.jk-closing-btn')||!(MB.keepsakes&&typeof MB.keepsakes.openAlbum==='function'))return;
var b=btn('jk-closing-btn');b.appendChild(stampSvg('closing'));b.appendChild(mk('span',null,'制作旅途纪念笺'));
b.addEventListener('click',function(){jump=true;try{MB.keepsakes.openAlbum()}catch(e){}jump=false});a.appendChild(b)}
function init(){toc();closing();var m=byId('surprise-dialog');if(m)m.addEventListener('close',reset)}
document.addEventListener('mb:play-complete',record);
document.addEventListener('mb:album',onAlbum);
document.addEventListener('mb:motion',stopAll);
document.addEventListener('visibilitychange',function(){if(document.hidden)stopAll()});
window.addEventListener('pagehide',reset);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
