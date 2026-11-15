(function(){
'use strict';
var MB=window.MB=window.MB||{};MB.playScenes=MB.playScenes||{};
var NS='http://www.w3.org/2000/svg',C=null,NOGAME={wall:1,closing:1};
var BAN={script:1,foreignobject:1,defs:1,use:1,filter:1,image:1,a:1,style:1,iframe:1,animate:1,animatemotion:1,animatetransform:1,set:1,mask:1,pattern:1,symbol:1,clippath:1,marker:1,'switch':1,lineargradient:1,radialgradient:1,audio:1,video:1,canvas:1};
var KF={
pop:[{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],
leap:[{transform:'translate(0px,0px)'},{transform:'translate(6px,-14px)'},{transform:'translate(0px,0px)'}],
drift:[{transform:'translateX(0px)'},{transform:'translateX(9px)'},{transform:'translateX(0px)'}],
swing:[{transform:'rotate(0deg)'},{transform:'rotate(-6deg)'},{transform:'rotate(5deg)'},{transform:'rotate(0deg)'}],
rain:[{transform:'translateY(-10px)',opacity:0.6},{transform:'translateY(0px)',opacity:1}],
draw:[{opacity:0.35},{opacity:1}]};
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function btn(c,x){var b=mk('button',c,x);b.type='button';return b}
function byId(i){return document.getElementById(i)}
function reduced(){try{return !!(MB.motion&&typeof MB.motion.reduced==='function'&&MB.motion.reduced())}catch(e){return true}}
function tier(){var t=MB.performance&&MB.performance.tier;return t===0||t===1||t===2?t:1}
function light(){var s=Math.min(window.innerWidth||0,window.innerHeight||0);return tier()===0||(s>0&&s<650)}
function clone(s){try{return JSON.parse(JSON.stringify(s))}catch(e){return s}}
function init(g){try{return g.init()}catch(e){return {}}}
function qa(s){var o={};if(s&&typeof s==='object'&&!Array.isArray(s))Object.keys(s).forEach(function(k){var x=s[k];if(typeof x==='boolean'||(typeof x==='number'&&isFinite(x)&&Math.floor(x)===x))o[k]=x});try{return JSON.stringify(o)}catch(e){return '{}'}}
function svgNode(str){
if(typeof str!=='string'||!str||str.length>60000)return null;
var d;try{d=new DOMParser().parseFromString(str,'image/svg+xml')}catch(e){return null}
var r=d&&d.documentElement;
if(!r||r.localName!=='svg'||r.namespaceURI!==NS||d.getElementsByTagName('parsererror').length)return null;
var all=r.getElementsByTagName('*');if(all.length+1>120)return null;
var list=[r].concat(Array.prototype.slice.call(all));
for(var i=list.length-1;i>=0;i--){var n=list[i];
if(BAN[String(n.localName).toLowerCase()]||n.namespaceURI!==NS){if(n===r)return null;if(n.parentNode)n.parentNode.removeChild(n);continue}
for(var j=n.attributes.length-1;j>=0;j--){var a=n.attributes[j],k=a.name.toLowerCase(),v=String(a.value).toLowerCase();
if(k.indexOf('on')===0||k==='id'||/href$/.test(k)||/javascript:|url[(]|data:|expression/.test(v))n.removeAttribute(a.name)}}
r.setAttribute('viewBox','0 0 360 210');r.setAttribute('aria-hidden','true');r.setAttribute('focusable','false');r.removeAttribute('width');r.removeAttribute('height');
return document.importNode(r,true)}
function stop(){var F=fin();if(F){try{F.cancel()}catch(e){}}var c=C;if(!c)return;c.seq++;var an=c.anim;c.anim=null;if(an){try{an.cancel()}catch(e){}}}
function play(m,oldRect){var c=C;if(!c||!KF[m]||reduced()||document.hidden||!c.dlg.open||!c.entered)return;
var h=c.board.querySelector('.pg-hero');if(!h||typeof h.animate!=='function')return;
var seq=++c.seq;
try{var frames=KF[m];if(oldRect&&oldRect.width>0&&(m==='leap'||m==='drift')){var nr=h.getBoundingClientRect(),sv=h.ownerSVGElement.getBoundingClientRect(),scale=Math.min(sv.width/360,sv.height/210)||1,dx=(oldRect.x+oldRect.width/2-nr.x-nr.width/2)/scale,dy=(oldRect.y+oldRect.height/2-nr.y-nr.height/2)/scale;if(Math.abs(dx)+Math.abs(dy)>3)frames=[{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate('+(dx*.5)+'px,'+(dy*.5-(m==='leap'?26:10))+'px)'},{transform:'translate(0px,0px)'}]};var an=h.animate(frames,{duration:light()?(m==='leap'||m==='drift'?440:320):(tier()===2?780:640),easing:'cubic-bezier(.3,.7,.3,1)',iterations:1,fill:'none'});c.anim=an;
an.onfinish=an.oncancel=function(){if(C===c&&c.seq===seq)c.anim=null}}catch(e){}}
function fin(){var F=MB.playFinale;return F&&typeof F.mountOrPlay==='function'&&typeof F.cancel==='function'?F:null}
function afterRender(c,anim,was,done,fk){var fresh=!!(anim&&done&&(!was||(fk!==null&&fk!==c.fkey)));c.fkey=done?fk:null;if(fresh&&C===c){try{document.dispatchEvent(new CustomEvent('mb:play-complete',{detail:{id:c.id}}))}catch(e){}}var F=fin();if(!F||C!==c)return;if(fresh&&c.anim){try{c.anim.cancel()}catch(e){}c.anim=null;}try{var p=F.mountOrPlay({id:c.id,board:c.board,panel:c.panel,before:c.tools,status:c.status,done:done,play:fresh});if(p&&typeof p.catch==='function')p.catch(function(e){console.error('Completion animation unavailable',e)})}catch(e){console.error('Completion animation unavailable',e)}}
function findAct(id){var k=C.acts.children;for(var i=0;i<k.length;i++)if(k[i].getAttribute('data-pg-action')===id)return k[i];return null}
function render(anim){var c=C;if(!c)return;
var v;try{v=c.g.view(c.state)}catch(e){v=null}
if(!v||typeof v!=='object')v={svg:'',actions:[],status:'这个小游戏暂时无法显示，可以重新开始或返回。',done:false};
var f=document.activeElement,fid=f&&c.acts.contains(f)?f.getAttribute('data-pg-action'):null;
stop();
var oldHero=c.board.querySelector('.pg-hero'),oldRect=oldHero?oldHero.getBoundingClientRect():null;
var list=(Array.isArray(v.actions)?v.actions:[]).filter(function(a){return a&&typeof a.id==='string'&&a.id&&a.id!=='reset'}).slice(0,12);
var wasDone=!!(c.view&&c.view.done),fk=v.completionKey==null?null:String(v.completionKey);c.view={actions:list,done:!!v.done};
var s=svgNode(v.svg);c.board.textContent='';
c.board.appendChild(s||mk('p','pg-fallback','图画暂时无法显示，下面的按钮仍然可以继续玩。'));
c.acts.textContent='';
list.forEach(function(a){var b=btn('pg-act',String(a.label==null?a.id:a.label));b.setAttribute('data-pg-action',a.id);
if(typeof a.pressed==='boolean')b.setAttribute('aria-pressed',String(a.pressed));if(a.disabled)b.disabled=true;c.acts.appendChild(b)});
c.status.textContent=c.note+String(v.status==null?'':v.status);c.note='';
c.panel.dataset.done=v.done?'true':'false';c.panel.dataset.state=qa(c.state);
if(fid){var nb=findAct(fid);(nb&&!nb.disabled?nb:c.reset).focus({preventScroll:true})}
if(anim)play(v.motion,oldRect);afterRender(c,anim,wasDone,!!v.done,fk)}
function doAct(id){var c=C;if(!c||!c.entered||!c.view)return;
var ok=c.view.actions.some(function(a){return a.id===id&&!a.disabled});if(!ok)return;
var n;try{n=c.g.act(clone(c.state),id)}catch(e){return}
if(n===undefined||n===null||n===c.state)return;c.state=n;render(true)}
function doReset(){var c=C;if(!c||!c.entered)return;stop();c.fkey=null;c.state=init(c.g);c.note='已重新开始。';render(false)}
function save(e){return e?{e:e,n:Array.prototype.slice.call(e.childNodes)}:null}
function put(s){if(!s)return;s.e.textContent='';s.n.forEach(function(n){s.e.appendChild(n)})}
function enter(){var c=C;if(!c||c.entered)return;
var t=byId('surprise-title'),h=byId('surprise-hint');
c.saved={lh:c.lay.hidden,fh:c.foot?c.foot.hidden:false,t:save(t),h:save(h)};
c.entered=true;c.lay.hidden=true;if(c.foot)c.foot.hidden=true;
if(t)t.textContent=String(c.g.title||'');if(h)h.textContent=String(c.g.hint||'');
c.entry.hidden=true;c.panel.hidden=false;
if(c.state==null)c.state=init(c.g);
render(false);
(c.acts.querySelector('button:not([disabled])')||c.reset).focus()}
function leave(focus){var c=C;if(!c||!c.entered)return;stop();c.entered=false;var s=c.saved;
put(s.t);put(s.h);c.lay.hidden=s.lh;if(c.foot)c.foot.hidden=s.fh;
c.panel.hidden=true;c.entry.hidden=false;if(focus)c.entry.focus()}
function onVis(){if(document.hidden)stop()}
function onStop(){stop()}
function onClose(){unmount()}
function unmount(){var c=C;if(!c)return;leave(false);stop();
document.removeEventListener('visibilitychange',onVis);window.removeEventListener('pagehide',onStop);
window.removeEventListener('mb:motion',onStop);window.removeEventListener('mb:scene',onStop);c.dlg.removeEventListener('close',onClose);
document.removeEventListener('mb:motion',onStop);document.removeEventListener('mb:scene',onStop);
if(c.slot.parentNode)c.slot.parentNode.removeChild(c.slot);C=null}
function mount(id){unmount();
var g=MB.playScenes[id];if(NOGAME[id]||!g||typeof g.view!=='function'||typeof g.act!=='function'||typeof g.init!=='function')return;
var dlg=byId('surprise-dialog');if(!dlg)return;
var lay=dlg.querySelector('.surprise-layout'),foot=dlg.querySelector('.surprise-footer');if(!lay||!lay.parentNode)return;
var slot=mk('div','pg-slot');slot.id='scene-play-slot';slot.dataset.game=id;
var entry=btn('pg-entry'),ic=mk('span','pg-icon');ic.setAttribute('aria-hidden','true');
entry.appendChild(ic);entry.appendChild(mk('span','pg-entry-text',String(g.entry||'玩一个小游戏')));
var panel=mk('section','pg-panel');panel.hidden=true;panel.setAttribute('aria-label',String(g.title||'小游戏'));panel.dataset.done='false';panel.dataset.state='{}';
var board=mk('figure','pg-board');
var status=mk('p','pg-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
var acts=mk('div','pg-actions');acts.setAttribute('role','group');acts.setAttribute('aria-label','游戏操作');
var tools=mk('div','pg-tools'),rs=btn('pg-tool pg-reset','重新开始'),bk=btn('pg-tool pg-back','回到这份小惊喜');
tools.appendChild(rs);tools.appendChild(bk);
panel.appendChild(board);panel.appendChild(status);panel.appendChild(acts);panel.appendChild(tools);
slot.appendChild(entry);slot.appendChild(panel);
if(foot&&foot.parentNode===lay.parentNode)lay.parentNode.insertBefore(slot,foot);else lay.parentNode.insertBefore(slot,lay.nextSibling);
C={id:id,g:g,dlg:dlg,lay:lay,foot:foot,slot:slot,entry:entry,panel:panel,board:board,status:status,acts:acts,tools:tools,reset:rs,fkey:null,state:null,view:null,saved:null,entered:false,seq:0,anim:null,note:''};
entry.addEventListener('click',enter);
rs.addEventListener('click',doReset);
bk.addEventListener('click',function(){leave(true)});
acts.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('[data-pg-action]'):null;if(!b||b.disabled||!acts.contains(b))return;doAct(b.getAttribute('data-pg-action'))});
document.addEventListener('visibilitychange',onVis);window.addEventListener('pagehide',onStop);
window.addEventListener('mb:motion',onStop);window.addEventListener('mb:scene',onStop);document.addEventListener('mb:motion',onStop);document.addEventListener('mb:scene',onStop);dlg.addEventListener('close',onClose)}
MB.scenePlay={mount:mount,unmount:unmount};
})();
