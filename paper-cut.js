(function(){
'use strict';
var MB=window.MB=window.MB||{};
if(MB.paperCut)return;
var KEY='mb.paperCut.v1',COLORS=['正红','桃粉','暖金'],
GROUPS=[['外弧',['云纹','花瓣','波浪','锯齿']],['侧边',['小心形','月牙','圆点','梅花']],['尖角',['留空','小圆','星','菱形']]],
STEPS=['选纸折纸','剪三刀','展开贴窗'],
TIPS={paper:'先挑一张喜欢的纸，再点“折一下”，一共折三次。',cut:'选三个地方，剪一刀：外弧、侧边、尖角各挑一种花样，可以随时换。',reveal:'好看，是你剪的。喜欢就贴到窗上。',pasted:'这是贴在窗上的窗花。想换一张，就再剪一张。'};
var saved=null,draft=null,dlg=null,ui={},entryWrap=null,entryBtn=null,previewBtn=null,storageOK=true,lastFocus=null,previewSig='';
function ok(n,max){return typeof n==='number'&&n%1===0&&n>=0&&n<=max}
function load(){var raw;try{raw=localStorage.getItem(KEY)}catch(e){storageOK=false;return null}try{var v=JSON.parse(raw||'null');if(v&&v.pasted===true&&ok(v.color,2)&&Array.isArray(v.cuts)&&v.cuts.length===3&&v.cuts.every(function(c){return ok(c,3)}))return{color:v.color,cuts:v.cuts.slice()}}catch(e){}return null}
function store(s){try{localStorage.setItem(KEY,JSON.stringify({color:s.color,cuts:s.cuts.slice(),pasted:true,at:new Date().toISOString()}));storageOK=true;return true}catch(e){storageOK=false;return false}}
function tier(){var p=MB.performance,t;try{t=p&&(typeof p.tier==='function'?p.tier():p.tier)}catch(e){}var n=typeof t==='number'?t:({smooth:0,auto:1,rich:2})[t];if(n==null)n=1;n=Math.max(0,Math.min(2,n|0));if(Math.min(window.innerWidth,window.innerHeight)<650)n=0;return n}
function reduced(){try{return!!(MB.motion&&MB.motion.reduced())}catch(e){return false}}
function art(o){try{return MB.paperCutArt&&MB.paperCutArt.render?MB.paperCutArt.render(o)||'':''}catch(e){return''}}
function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
function btn(c,x,f){var b=el('button',c,x);b.type='button';b.addEventListener('click',f);return b}
function fx(n){if(n&&!n.hidden&&!n.disabled)n.focus()}
function fresh(){return{color:-1,folds:0,cuts:[-1,-1,-1],stage:'paper'}}
function fromSaved(s){return{color:s.color,folds:3,cuts:s.cuts.slice(),stage:'pasted'}}
function panelVisible(){var p=document.getElementById('panel-closing');return!!(p&&!p.hidden&&!p.closest('[hidden]')&&p.getClientRects().length)}
function emit(a){document.dispatchEvent(new CustomEvent('mb:surprise',{detail:{active:a,source:'paper-cut'}}))}
function setStatus(m){if(ui.status)ui.status.textContent=m}
function gentle(){if(dlg)dlg.classList.toggle('pc-gentle',reduced())}
function build(){
dlg=el('dialog','pc-dialog');dlg.id='paper-cut-dialog';dlg.setAttribute('aria-labelledby','pc-title');
var head=el('div','pc-head'),h=el('h2',null,'给妈妈剪一张窗花');h.id='pc-title';head.appendChild(h);
var x=btn('pc-close','×',close);x.setAttribute('aria-label','关闭');head.appendChild(x);dlg.appendChild(head);
dlg.appendChild(el('p','pc-intro','再做一件小手工吧。挑一张喜欢的纸，我来递剪刀，你来决定花样。'));
var ol=el('ol','pc-steps');ol.setAttribute('aria-label','步骤');ui.steps=STEPS.map(function(s,i){var li=el('li','pc-step',s);ol.appendChild(li);return li});dlg.appendChild(ol);
ui.stage=el('div','pc-stage');ui.stage.setAttribute('role','img');dlg.appendChild(ui.stage);
ui.status=el('p','pc-status');ui.status.setAttribute('aria-live','polite');dlg.appendChild(ui.status);
var ctr=el('div','pc-controls');dlg.appendChild(ctr);
function group(label,names,pick,isColor){var g=el('div','pc-group');g.setAttribute('role','group');g.setAttribute('aria-label',label);g.appendChild(el('p',null,label));var c=el('div','pc-choices');var bs=names.map(function(n,i){var b=btn(null,n,function(){pick(i)});b.setAttribute('aria-pressed','false');if(isColor)b.dataset.pcColor=i;c.appendChild(b);return b});g.appendChild(c);ctr.appendChild(g);return{g:g,bs:bs}}
ui.color=group('先挑一张喜欢的纸',COLORS,function(i){draft.color=i;update(true);setStatus('选了'+COLORS[i]+'纸。现在点“折一下”。')},true);
ui.cuts=GROUPS.map(function(G,k){return group(G[0]+'剪一刀',G[1],function(i){draft.cuts[k]=i;update(true);setStatus(draft.cuts.indexOf(-1)<0?'三刀都选好了，点“展开看看”。':G[0]+'剪成了'+G[1][i]+'。')})});
var act=el('div','pc-actions');ctr.appendChild(act);
ui.fold=btn('pc-primary','折一下',fold);ui.skip=btn('pc-secondary','直接折好',function(){draft.folds=3;toCut()});
ui.unfold=btn('pc-primary','展开看看',unfold);ui.paste=btn('pc-primary','贴到窗上',paste);
ui.redo=btn('pc-primary','再剪一张',function(){draft=fresh();update(true);setStatus(TIPS.paper+(saved?' 刚才那张还贴在窗上，贴上新的才会换掉。':''));fx(ui.color.bs[0])});
ui.undo=btn('pc-secondary','还是刚才那张',function(){if(!saved)return;draft=fromSaved(saved);update(true);setStatus('回到刚才贴好的那张。');fx(ui.redo)});
[ui.fold,ui.skip,ui.unfold,ui.paste,ui.redo,ui.undo].forEach(function(b){act.appendChild(b)});
var foot=el('div','pc-foot');foot.appendChild(btn('pc-secondary','回到信里',close));dlg.appendChild(foot);
dlg.addEventListener('close',onClosed);
document.body.appendChild(dlg)}
function fold(){if(draft.color<0)return;draft.folds=Math.min(3,draft.folds+1);if(draft.folds>=3)return toCut();update(true);setStatus('折好'+draft.folds+'次了，再折'+(3-draft.folds)+'次。')}
function toCut(){draft.stage='cut';update(true);setStatus(TIPS.cut);fx(ui.cuts[0].bs[0])}
function unfold(){if(draft.cuts.indexOf(-1)>=0)return;draft.stage='reveal';update(true);setStatus(TIPS.reveal);fx(ui.paste)}
function paste(){if(draft.stage!=='reveal')return;saved={color:draft.color,cuts:draft.cuts.slice()};var s=store(saved);draft.stage='pasted';update(true);setStatus(s?'贴好了。这张窗花会留在当前浏览器里，下次来到信的末尾还能看见。':'贴好了。不过当前浏览器不能保存，刷新页面后就看不见了。');refreshPreview(true);fx(ui.redo)}
function show(b,v){b.hidden=!v}
function update(paint){
var st=draft.stage,si={paper:0,cut:1,reveal:2,pasted:2}[st];
ui.steps.forEach(function(li,i){li.classList.toggle('is-current',i===si);li.classList.toggle('is-done',i<si||st==='pasted');if(i===si)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});
ui.color.g.hidden=st!=='paper';ui.color.bs.forEach(function(b,i){b.setAttribute('aria-pressed',String(draft.color===i))});
ui.cuts.forEach(function(g,k){g.g.hidden=st!=='cut';g.bs.forEach(function(b,i){b.setAttribute('aria-pressed',String(draft.cuts[k]===i))})});
show(ui.fold,st==='paper');ui.fold.disabled=draft.color<0;ui.fold.textContent='折一下（'+draft.folds+'/3）';
show(ui.skip,st==='paper');ui.skip.disabled=draft.color<0;
show(ui.unfold,st==='cut');ui.unfold.disabled=draft.cuts.indexOf(-1)>=0;
show(ui.paste,st==='reveal');show(ui.redo,st==='pasted');show(ui.undo,!!saved&&st!=='pasted');
ui.stage.dataset.stage=st;
var c=draft.color<0?0:draft.color;ui.stage.setAttribute('aria-label',(draft.color<0?'一张还没挑颜色的纸':COLORS[c]+'纸')+'，'+STEPS[si]);
if(paint)ui.stage.innerHTML=art({color:c,cuts:draft.cuts.slice(),stage:st,folds:draft.folds,tier:tier(),uid:'pc-dialog'})}
function open(){
if(dlg&&dlg.open)return;
if(!panelVisible()||!document.getElementById('panel-closing').classList.contains('stage-current'))return;
if(document.querySelector('dialog[open]')||document.querySelector('.is-switching'))return;
if(!dlg)build();
dlg.classList.remove('is-paused');gentle();
draft=saved?fromSaved(saved):fresh();update(true);
setStatus(TIPS[draft.stage]+(storageOK?'':' 当前浏览器不能保存，窗花只在这次浏览时保留。'));
try{dlg.showModal()}catch(e){return}
document.body.classList.add('surprise-open');emit(true);
fx(draft.stage==='pasted'?ui.redo:ui.color.bs[0])}
function close(){if(dlg&&dlg.open)dlg.close()}
function onClosed(){dlg.classList.remove('is-paused');ui.stage.innerHTML='';draft=null;
if(!document.querySelector('dialog[open]')){document.body.classList.remove('surprise-open');emit(false)}
var t=lastFocus===previewBtn&&previewBtn&&!previewBtn.hidden?previewBtn:entryBtn;if(t&&t.getClientRects().length)t.focus()}
function mountEntry(){var p=document.getElementById('panel-closing');if(!p||(entryWrap&&p.contains(entryWrap)))return;
entryWrap=el('div','pc-entry');entryBtn=btn('pc-secondary','再做一件小事 · 剪窗花',function(){lastFocus=entryBtn;open()});entryBtn.id='paper-cut-entry';entryBtn.setAttribute('aria-haspopup','dialog');
previewBtn=btn('pc-preview','',function(){lastFocus=previewBtn;open()});previewBtn.hidden=true;previewBtn.setAttribute('aria-label','看看贴在窗上的窗花');
entryWrap.appendChild(entryBtn);entryWrap.appendChild(previewBtn);
var a=p.querySelector('.closing-actions');if(a&&a.parentNode)a.parentNode.insertBefore(entryWrap,a.nextSibling);else p.appendChild(entryWrap);previewSig=''}
function refreshPreview(force){if(!previewBtn)return;
if(!saved){previewBtn.hidden=true;previewBtn.innerHTML='';previewSig='';return}
if(!force&&!panelVisible())return;
var t=tier(),sig=saved.color+'|'+saved.cuts.join(',')+'|'+t;if(sig===previewSig)return;
var svg=art({color:saved.color,cuts:saved.cuts.slice(),stage:'pasted',folds:3,tier:t,uid:'pc-preview'});if(!svg)return;
previewBtn.innerHTML=svg;previewBtn.hidden=false;previewSig=sig}
function pause(e){var d=e.detail||{};if(d.source==='paper-cut'||!dlg||!dlg.open)return;dlg.classList.toggle('is-paused',!!d.active)}
document.addEventListener('mb:surprise',pause);document.addEventListener('mb:gala',pause);
document.addEventListener('mb:motion',gentle);
document.addEventListener('mb:quality',function(){refreshPreview(false)});
document.addEventListener('mb:scene',function(e){var d=e.detail,s=d&&typeof d==='object'?(d.scene||d.id||d.name||d.key):d;if(typeof s!=='string')s='';
var here=s?(s==='closing'||s==='panel-closing'):panelVisible();if(!here)close();mountEntry();if(here)refreshPreview(true)});
['mb:home','mb:unmount'].forEach(function(n){document.addEventListener(n,close)});
saved=load();
function init(){mountEntry();refreshPreview(false);var home=document.getElementById('home-gift');if(home)home.addEventListener('click',close)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
MB.paperCut={open:open,close:close,hasSaved:function(){return!!saved}};
})();
