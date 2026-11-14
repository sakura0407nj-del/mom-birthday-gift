/* The scene controller keeps live DOM nodes, so interactions survive every transition. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), deck=$('journey');
  const panels=[...deck.querySelectorAll(':scope > .scene')];
  const motion=window.MB.motion;
  const names=['四季花园','晨光温室','落日海湾','萤火森林','云端气球','旋转音乐盒','团圆灯庭','收集星光','烛光许愿','祝福信笺','温柔落满','一封家书'];
  let index=0, mounted=false,busy=false,pending=null,epoch=0,animations=[];
  const visited=new Set([0]);
  const gentle=()=>motion.reduced();
  let signalled=false;const warmed=new WeakSet();
  function signal(on){if(signalled===on)return;signalled=on;document.dispatchEvent(new CustomEvent('mb:transition',{detail:{active:on}}));}
  const idle=fn=>(typeof window.requestIdleCallback==='function'?window.requestIdleCallback(fn,{timeout:900}):setTimeout(fn,240));
  function warmImg(im){if(warmed.has(im))return;warmed.add(im);if(im.loading==='lazy'&&!im.complete)im.loading='eager';if(typeof im.decode==='function')im.decode().catch(()=>{});}
  function warm(p){if(!p||warmed.has(p))return;warmed.add(p);try{const m=/url\(["']?([^"')]+)/.exec(getComputedStyle(p).backgroundImage||'');if(m){const pic=new Image();pic.decoding='async';pic.src=m[1];if(typeof pic.decode==='function')pic.decode().catch(()=>{});}}catch(e){}p.querySelectorAll('img').forEach(warmImg);}
  function paint(){
    $('scene-counter').textContent=String(index+1).padStart(2,'0')+' / '+panels.length;
    $('scene-name').textContent=names[index];
    $('scene-prev').disabled=index===0;
    $('scene-next').disabled=index===panels.length-1;
    $('theatre-dock').setAttribute('aria-busy',String(busy));
    $('scene-surprise').disabled=busy;
    document.querySelectorAll('[data-go]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.go===panels[index].id)));
    [...$('scene-dots').children].forEach((b,i)=>{b.setAttribute('aria-current',String(i===index));b.classList.toggle('visited',visited.has(i));});
    deck.dataset.scene=panels[index].id;deck.dataset.sceneIndex=String(index);
  }
  panels.forEach((p,i)=>{
    p.tabIndex=-1;
    const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','第'+(i+1)+'幕：'+names[i]);b.addEventListener('click',()=>goTo(i));$('scene-dots').append(b);
  });
  function activate(i){
    panels.forEach((p,n)=>{p.inert=n!==i;p.setAttribute('aria-hidden',String(n!==i));});
    window.MB.activateScene(i);visited.add(i);paint();
    document.dispatchEvent(new CustomEvent('mb:scene',{detail:{id:panels[i].id}}));
  }
  function mount(){
    if(mounted)return;
    mounted=true;document.body.classList.add('journey-active');api.active=true;index=0;deck.classList.add('theatre-deck');
    panels.forEach((p,i)=>{p.classList.toggle('stage-current',i===0);p.classList.remove('stage-leaving');});
    $('theatre-dock').hidden=false;activate(0);
  }
  function unmount(){
    mounted=false;signal(false);document.body.classList.remove('journey-active');deck.classList.remove('is-switching');api.active=false;epoch++;animations.forEach(a=>a.cancel());animations=[];busy=false;pending=null;
    $('theatre-dock').hidden=true;$('theatre-dock').setAttribute('aria-busy','false');
    panels.forEach(p=>{p.classList.remove('stage-current','stage-leaving');p.inert=false;p.removeAttribute('aria-hidden');p.style.zIndex='';});
    $('curtain-shimmer').style.opacity='0';deck.classList.remove('theatre-deck');if(window.MB&&MB.chapterCue)MB.chapterCue.cancel();if(window.MB&&MB.chapterEnhance&&MB.chapterEnhance.closeDialog)MB.chapterEnhance.closeDialog();
  }
  function frames(style,dir){
    const s=dir<0?-1:1;
    if(style==='curtain')return {duration:1050,out:[{opacity:1,transform:'scale(1)'},{opacity:.48,transform:'scale(.97)'}],inside:[{clipPath:s>0?'inset(0 100% 0 0)':'inset(0 0 0 100%)',transform:'scale(1.04)'},{clipPath:'inset(0 0 0 0)',transform:'scale(1)'}]};
    if(style==='page')return {duration:1000,out:[{opacity:1,transform:'perspective(1600px) rotateY(0deg) translateX(0)'},{opacity:0,transform:`perspective(1600px) rotateY(${-s*8}deg) translateX(${-s*12}%) scale(.92)`}],inside:[{opacity:0,transform:`perspective(1600px) rotateY(${s*6}deg) translateX(${s*15}%) scale(.94)`},{opacity:1,transform:'perspective(1600px) rotateY(0deg) translateX(0) scale(1)'}]};
    if(style==='zoom')return {duration:1050,out:[{opacity:1,transform:'scale(1)'},{opacity:0,transform:s>0?'scale(1.07)':'scale(.9)'}],inside:[{opacity:0,transform:s>0?'scale(.95)':'scale(1.05)'},{opacity:1,transform:'scale(1)'}]};
    return {duration:1000,out:[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:`translateY(${-s*12}px) scale(1.025)`}],inside:[{opacity:0,transform:`translateY(${s*16}px) scale(.985)`},{opacity:1,transform:'translateY(0) scale(1)'}]};
  }
  function finishScene(out,inside,token){
    if(token!==epoch||!mounted)return;
    animations.forEach(a=>a.cancel());animations=[];out.classList.remove('stage-leaving');out.style.zIndex='';inside.style.zIndex='';deck.classList.remove('is-switching');busy=false;paint();signal(false);idle(()=>{if(mounted)warm(panels[index+1]);});
    $('scene-transition-label').textContent='第 '+(index+1)+' 幕，共 '+panels.length+' 幕：'+names[index];
    inside.focus({preventScroll:true});
    if(pending!==null){const next=pending;pending=null;goTo(next);}
  }
  function paperTurn(old,next,out,inside,token){
    const ce=window.MB&&MB.chapterCue;
    if(!ce||!ce.__ceV6||typeof ce.run!=='function'||gentle()||typeof inside.animate!=='function')return false;
    const live=()=>token===epoch&&mounted;let committed=false;
    busy=true;signal(true);deck.classList.add('is-switching');deck.dataset.transition='paper';paint();
    const light=(MB.performance&&MB.performance.tier)===0||Math.min(innerWidth,innerHeight)<650;
    const commit=()=>{if(committed||!live())return false;committed=true;index=next;warm(inside);out.classList.remove('stage-current','stage-leaving');out.style.zIndex='';inside.style.zIndex='';inside.classList.add('stage-current','is-in');inside.scrollTop=0;activate(next);return true;};
    const end=()=>{if(!live())return;if(committed){finishScene(out,inside,token);return;}busy=false;pending=null;deck.classList.remove('is-switching');paint();signal(false);};
    let job=null;try{job=ce.run({id:inside.id.replace('panel-',''),index:next,name:names[next],light,direction:next>old?1:-1,commit,isCurrent:live});}catch(e){commit();}
    Promise.resolve(job).then(end,()=>{commit();end();});
    return true;
  }
  function goTo(target){
    const next=typeof target==='string'?panels.findIndex(p=>p.id===target):target;
    if(!mounted||next<0||next>=panels.length)return;
    if(busy){pending=next;return;}
    if(next===index){activate(index);return;}
    const old=index,out=panels[old],inside=panels[next],token=++epoch;if(paperTurn(old,next,out,inside,token))return;index=next;busy=true;deck.classList.add('is-switching');paint();
    const selection=$('transition-style').value;
    const phone=Math.min(innerWidth,innerHeight)<650;const light=MB.performance.tier===0||phone||(selection==='auto'&&MB.performance.tier<2);warm(inside);
    const style=light?'fade':selection==='auto'?'dissolve':selection;deck.dataset.transition=style;
    function swap(){out.classList.remove('stage-current','stage-leaving');inside.classList.add('stage-current','is-in');inside.scrollTop=0;activate(next);}
    if(gentle()||typeof inside.animate!=='function'){swap();finishScene(out,inside,token);return;}
    if(light){
      out.inert=true;signal(true);const fade=out.animate([{opacity:1},{opacity:.18}],{duration:190,easing:'ease-in',fill:'both'});animations=[fade];
      fade.finished.then(()=>{if(token!==epoch||!mounted)return;swap();fade.cancel();if(gentle())return;const reveal=inside.animate([{opacity:.18,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.65,.16,1)',fill:'both'});animations=[reveal];return reveal.finished;}).then(()=>finishScene(out,inside,token)).catch(()=>{});return;
    }
    out.classList.remove('stage-current');out.classList.add('stage-leaving');inside.classList.add('stage-current','is-in');inside.scrollTop=0;
    out.style.zIndex='10';inside.style.zIndex='11';activate(next);signal(true);
    const f=frames(style,next-old),opts={duration:f.duration,easing:'cubic-bezier(.2,.65,.16,1)',fill:'both'};
    animations=[out.animate(f.out,opts),inside.animate(f.inside,opts)];
    if(style==='curtain')animations.push($('curtain-shimmer').animate([{opacity:0,transform:'translateX(-75%)'},{opacity:.6,offset:.5},{opacity:0,transform:'translateX(75%)'}],opts));
    Promise.allSettled(animations.map(a=>a.finished)).then(()=>finishScene(out,inside,token));
  }
  const api={active:false,mount,unmount,goTo};window.MB.theatre=api;
  if(!deck.hidden)mount();
  $('scene-prev').addEventListener('click',()=>goTo(index-1));$('scene-next').addEventListener('click',()=>goTo(index+1));
  $('scene-index').addEventListener('click',()=>$('contents-open').click());
  function typing(e){return e.target.closest('input,textarea,select,[contenteditable="true"]')||document.querySelector('dialog[open]')||!$('egg').hidden||!$('lightbox').hidden;}
  document.addEventListener('keydown',e=>{if(!mounted||typing(e)||e.altKey||e.ctrlKey||e.metaKey)return;let d=0;if(['ArrowRight','PageDown'].includes(e.key))d=1;if(['ArrowLeft','PageUp'].includes(e.key))d=-1;if(e.key===' '&&!e.target.closest('button,a'))d=e.shiftKey?-1:1;if(d){e.preventDefault();goTo(index+d);}});
  let wheelSum=0,lastWheel=0;
  deck.addEventListener('wheel',e=>{
    if(!mounted||typing(e)||e.ctrlKey)return;
    const p=panels[index],direction=Math.sign(e.deltaY),canScroll=p.scrollHeight>p.clientHeight+5;
    const nested=e.target.closest('textarea,.wall-list,dialog');if(nested)return;
    if(canScroll&&((direction>0&&p.scrollTop+p.clientHeight<p.scrollHeight-4)||(direction<0&&p.scrollTop>4)))return;
    e.preventDefault();if(busy)return;
    const now=performance.now();if(now-lastWheel>220)wheelSum=0;lastWheel=now;wheelSum+=e.deltaY*(e.deltaMode===1?16:1);
    if(Math.abs(wheelSum)>90){goTo(index+Math.sign(wheelSum));wheelSum=0;}
  },{passive:false});
  let touch=null;
  deck.addEventListener('touchstart',e=>{if(e.touches.length!==1||typing(e)||e.target.closest('button,input,textarea,select')){touch=null;return;}touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  deck.addEventListener('touchend',e=>{if(!touch||!mounted)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4)goTo(index+(dx<0?1:-1));},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&busy){animations.forEach(a=>a.finish());}});
  document.addEventListener('mb:motion',()=>{if(gentle()&&busy){pending=null;animations.forEach(a=>a.finish());}});
  deck.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||gentle()||!mounted)return;const p=panels[index];p.style.setProperty('--parallax-x',((e.clientX/innerWidth-.5)*18)+'px');p.style.setProperty('--parallax-y',((e.clientY/innerHeight-.5)*10)+'px');},{passive:true});

  // Six distinct scenes, each with a local, repeatable interaction.
  $('water-garden').addEventListener('click',()=>{
    const p=$('panel-greenhouse');if(p.classList.contains('garden-bloomed')){p.classList.remove('garden-bloomed','garden-watering');$('water-garden').innerHTML='洒下一点温柔 <span>✿</span>';$('greenhouse-status').textContent='花苞已经收好，等你再带来一场春雨。';return;}
    p.classList.add('garden-watering','garden-bloomed');$('water-garden').innerHTML='再看一次花开 <span>↺</span>';$('greenhouse-status').textContent='每一朵花都在说：妈妈，愿你被温柔以待。';
  });
  $('send-bottle').addEventListener('click',()=>{const p=$('panel-seaside'),btn=$('send-bottle');if(p.classList.contains('bottle-sailing')){p.classList.remove('bottle-sailing');btn.textContent='送向大海 ↗';$('seaside-status').textContent='新的漂流瓶到了，再写一句你想说的话。';return;}const wish=$('bottle-wish').value.trim()||'愿妈妈每天都有小小的欢喜';p.classList.add('bottle-sailing');btn.textContent='再寄一封 ↺';$('seaside-status').textContent='“'+wish+'” 已随晚风出发。';});
  $('light-forest').addEventListener('click',()=>{const awake=$('panel-forest').classList.toggle('forest-awake');$('light-forest').innerHTML=awake?'把微光藏好 <span>✧</span>':'唤醒一片萤火 <span>✧</span>';$('forest-status').textContent=awake?'你看，四十点微光正在回应你。愿前路总有光。':'微光仍在林间，等你下一次轻轻唤醒。';});
  let balloonWish='健康';document.querySelectorAll('[data-balloon-wish]').forEach(btn=>btn.addEventListener('click',()=>{balloonWish=btn.dataset.balloonWish;document.querySelectorAll('[data-balloon-wish]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));$('panel-clouds').classList.remove('balloon-released');$('release-balloon').textContent='放飞这份心愿 ↑';$('clouds-status').textContent='已把“'+balloonWish+'”装进气球。';}));
  $('release-balloon').addEventListener('click',()=>{const p=$('panel-clouds');if(p.classList.contains('balloon-released')){p.classList.remove('balloon-released');$('release-balloon').textContent='放飞这份心愿 ↑';$('clouds-status').textContent='新的气球准备好了，心愿还可以继续。';return;}p.classList.add('balloon-released');$('clouds-status').textContent='愿“'+balloonWish+'”伴你一路，去遇见更多好风景。';$('release-balloon').textContent='再迎来一只气球 ↺';});
  let musicOwned=false;
  $('wind-musicbox').addEventListener('click',()=>{const playing=$('panel-musicbox').classList.toggle('musicbox-playing');$('wind-musicbox').setAttribute('aria-pressed',String(playing));$('wind-musicbox').innerHTML=playing?'让时光停一停 <span>Ⅱ</span>':'转动音乐盒 <span>♫</span>';
    if(playing){musicOwned=$('music-toggle').getAttribute('aria-pressed')!=='true';if(musicOwned)$('music-toggle').click();}else if(musicOwned&&$('music-toggle').getAttribute('aria-pressed')==='true')$('music-toggle').click();
    $('musicbox-status').textContent=playing?'愿你心里，永远住着一个爱做梦的小女孩。':'旋律暂停了，温柔还留在这里。';
  });
  const lit=new Set();document.querySelectorAll('[data-lantern]').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.lantern);if(lit.has(n))lit.delete(n);else lit.add(n);const on=lit.has(n);btn.setAttribute('aria-pressed',String(on));document.querySelector('[data-lamp="'+n+'"]').classList.toggle('is-lit',on);$('panel-lanterns').classList.toggle('lanterns-complete',lit.size===6);$('lanterns-status').textContent=lit.size===6?'妈妈，生日快乐。愿灯火可亲，岁岁团圆。':'已经点亮 '+lit.size+' / 6 盏灯，把这句祝福慢慢拼完整。';}));
})();
