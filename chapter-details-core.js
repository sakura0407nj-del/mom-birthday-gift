(function(){'use strict';
const MB=window.MB=window.MB||{},KEY='mom-chapter-details-v1',NS='http://www.w3.org/2000/svg';
const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),prim=v=>typeof v==='string'||(typeof v==='number'&&isFinite(v));
const specs=Object.create(null),state=Object.create(null),ctxs=Object.create(null),entries=Object.create(null);
let ok=true,stored=null,dlg=null,titleEl,hintEl,host,statusEl,footEl,cur=null;
const common=()=>(MB.chapterCopy&&MB.chapterCopy.common)||{};
const E={};
E.el=function(tag,attrs,text){const n=document.createElement(tag);if(attrs)Object.keys(attrs).forEach(k=>{const v=attrs[k];if(v!==null&&v!==undefined&&v!==false)n.setAttribute(k,String(v));});if(text!==undefined&&text!==null&&text!=='')n.textContent=String(text);return n;};
E.button=function(label,onClick,attrs){const b=E.el('button',attrs||{},label);b.type='button';if(typeof onClick==='function')b.addEventListener('click',onClick);return b;};
E.choices=function(ctx,onChoose){const w=E.el('div',{class:'ce-choices',role:'group','aria-label':ctx.copy.title||null});(ctx.copy.choices||[]).forEach((c,i)=>{w.appendChild(E.button(c,()=>onChoose(i),{'aria-pressed':String(ctx.value()===i),'data-focus':'choice-'+i}));});return w;};
function load(){if(stored)return stored;stored=Object.create(null);try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);if(o&&typeof o==='object'&&!Array.isArray(o))Object.keys(o).forEach(k=>{if(prim(o[k]))stored[k]=o[k];});}}catch(e){if(!(e instanceof SyntaxError))ok=false;}return stored;}
function check(spec,raw){let v;try{v=spec.validate(raw);}catch(e){v=undefined;}if(prim(v))return v;return prim(spec.initial)?spec.initial:'';}
function foot(){if(footEl){const c=common();footEl.textContent=ok?(c.storageNote||''):(c.sessionNote||'');}}
function save(){if(ok){const o={};Object.keys(specs).forEach(k=>{o[k]=state[k];});try{localStorage.setItem(KEY,JSON.stringify(o));return;}catch(e){ok=false;}}foot();}
function sprig(cls){const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 32 32');s.setAttribute('class',cls);s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');[['path',{d:'M16 29C16 20 15 12 17 5',fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linecap':'round'}],['path',{d:'M16 21c-5 0-8-3-9-7 5 0 8 2 9 7zM16.4 14c4-.5 7-3 7.6-7-4 .5-7 3-7.6 7z',fill:'currentColor',opacity:'.75'}],['circle',{cx:'17',cy:'5',r:'2.8',fill:'#c97b84'}]].forEach(d=>{const e=document.createElementNS(NS,d[0]);Object.keys(d[1]).forEach(k=>e.setAttribute(k,d[1][k]));s.appendChild(e);});return s;}
function fire(active){document.dispatchEvent(new CustomEvent('mb:surprise',{bubbles:true,detail:{active:active,source:'chapter-details'}}));}
function build(){if(dlg)return;const c=common();dlg=E.el('dialog',{id:'chapter-details-dialog',class:'ce-dialog','aria-labelledby':'ce-title','aria-describedby':'ce-hint'});const head=E.el('div',{class:'ce-head'}),txt=E.el('div',{class:'ce-head-text'});titleEl=E.el('h2',{id:'ce-title',class:'ce-title'});hintEl=E.el('p',{id:'ce-hint',class:'ce-hint'});txt.append(titleEl,hintEl);head.append(sprig('ce-icon'),txt,E.button(c.close||'关闭',()=>close(),{class:'ce-close'}));host=E.el('div',{class:'ce-body'});statusEl=E.el('p',{class:'ce-status',role:'status','aria-live':'polite'});footEl=E.el('p',{class:'ce-foot'});dlg.append(head,host,statusEl,footEl);dlg.addEventListener('close',()=>{if(!dlg.open)cleanup();});document.body.appendChild(dlg);}
function firstFocusable(root){return root.querySelector('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])');}
function draw(x,key){const b=E.el('div',{class:'ce-panel','data-scene':x.id});host.replaceChildren(b);x.body=b;try{specs[x.id].render(x);}catch(e){console.error(e);}if(key){const list=b.querySelectorAll('[data-focus]');for(let i=0;i<list.length;i++){if(list[i].getAttribute('data-focus')===key){list[i].focus();return true;}}}return false;}
function canOpen(id){const j=document.getElementById('journey'),s=ctxs[id]&&ctxs[id].scene;if(!j||j.hidden||!j.getClientRects().length||!s||!s.classList.contains('stage-current')||s.classList.contains('stage-leaving'))return false;if(document.querySelector('.is-switching'))return false;return !document.querySelector('dialog[open]');}
function open(id){if(cur||!canOpen(id))return;build();cur=id;const x=ctxs[id];titleEl.textContent=x.copy.title||'';hintEl.textContent=x.copy.hint||'';statusEl.textContent='';foot();draw(x,null);try{dlg.showModal();}catch(e){cur=null;host.replaceChildren();return;}document.body.classList.add('surprise-open');fire(true);if(MB.chapterCue)MB.chapterCue.cancel();const f=firstFocusable(x.body)||dlg.querySelector('.ce-close');if(f)f.focus();}
function cleanup(){if(!cur)return;const id=cur;cur=null;host.replaceChildren();statusEl.textContent='';ctxs[id].body=E.el('div');const s=document.getElementById('surprise-dialog');if(!(s&&s.open)){document.body.classList.remove('surprise-open');fire(false);}const en=entries[id];if(en&&en.isConnected)en.focus({preventScroll:true});}
function close(){if(dlg&&dlg.open)dlg.close();cleanup();}
function makeCtx(id,scene){const x={id:id,scene:scene,copy:((MB.chapterCopy&&MB.chapterCopy.scenes)||{})[id]||{},common:common(),body:E.el('div'),
value:()=>state[id],
set(v){state[id]=check(specs[id],v);try{specs[id].apply(x);}catch(e){console.error(e);}save();},
refresh(){if(cur!==id)return;const a=document.activeElement,inside=a&&x.body.contains(a),key=inside?a.getAttribute('data-focus'):null;if(!draw(x,key)&&inside){const f=firstFocusable(x.body)||dlg.querySelector('.ce-close');if(f)f.focus();}},
message(t){build();statusEl.textContent=t===null||t===undefined?'':String(t);},
close:close};return x;}
function mount(id,scene,x){const b=E.button(x.copy.entry||x.copy.title||'',()=>open(id),{class:id==='rain'?'ce-entry ce-rain-entry':'ce-entry','data-ce-entry':id,'aria-haspopup':'dialog'});entries[id]=b;if(id==='rain'){scene.appendChild(b);return;}const after=id==='cake'?scene.querySelector('.cake-actions'):id==='closing'?scene.querySelector('.closing-actions'):null;if(after){after.after(b);return;}(scene.querySelector('.cinema-controls')||scene.querySelector('.scene-inner')||scene).appendChild(b);}
E.register=function(id,spec){if(typeof id!=='string'||!spec||typeof spec.validate!=='function'||typeof spec.render!=='function')return;const scene=document.getElementById('panel-'+id);if(!scene)return;const first=!specs[id];specs[id]=spec;const st=load();state[id]=has(st,id)?check(spec,st[id]):check(spec,spec.initial);if(first){ctxs[id]=makeCtx(id,scene);mount(id,scene,ctxs[id]);}if(typeof spec.apply==='function'){try{spec.apply(ctxs[id]);}catch(e){console.error(e);}}};
E.closeDialog=close;
const onScene=()=>{if(MB.chapterCue&&document.querySelector('dialog[open]'))MB.chapterCue.cancel();if(cur)close();};
window.addEventListener('mb:scene',onScene);document.addEventListener('mb:scene',onScene);
MB.chapterEnhance=E;
})();
