/* Local, dependency-free effects. No analytics, external fonts, or remote uploads. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const motion = window.MB.motion;
  let gentle = motion.reduced(), previousFocus = null;
  const toast = text => { const el=$('toast'); el.textContent=text; el.classList.add('is-show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('is-show'),3200); };
  const dialogOpen = dialog => { previousFocus=document.activeElement; dialog.showModal(); };
  document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});});
  });
  $('contents-open').addEventListener('click',()=>dialogOpen($('contents-dialog')));
  const openChapter = id => { if(window.MB?.openJourney) MB.openJourney(id); };
  document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();if(!$('act-opening').hidden)$('open-gift').click();else document.querySelector('.act:not([hidden]) button')?.focus();});
  document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>{$('contents-dialog').close();openChapter(btn.dataset.go);}));
  $('home-gift').addEventListener('click',()=>{
    if(!$('journey').hidden) $('back-to-top').click();
    else if($('act-opening').hidden) { MB.stopIntro?.(); ['act-story','act-blessing'].forEach(id=>$(id).hidden=true); $('act-opening').hidden=false; $('act-opening').classList.remove('is-fading'); const gift=$('open-gift');delete gift.dataset.opened;gift.classList.remove('is-open'); }
    document.body.classList.remove('is-scene-dark');
  });
  const seasons=[
    ['春 · 愿你常欢喜','愿你有看花的闲情，也有为自己出发的勇气。不必等到特别的日子，平常的一天，也可以因为喜欢而闪闪发光。','✿'],
    ['夏 · 愿你自在','愿你在忙碌之间，记得给自己留一阵风。累了就休息，想笑就大声笑。你不只是我们的妈妈，也永远是你自己。','☀'],
    ['秋 · 愿你丰盈','愿你喜欢的事情，都能慢慢实现。读一本想读的书，去一个想去的地方，把属于自己的快乐，一件一件收进生活。','❧'],
    ['冬 · 愿你安暖','愿你身边有暖灯，杯里有热茶，心里有踏实的牵挂。天冷时照顾好自己，我们也会把对你的爱，放进往后的每一天。','✧']
  ];
  document.querySelectorAll('[data-season]').forEach(btn=>btn.addEventListener('click',()=>{const s=seasons[Number(btn.dataset.season)];$('season-title').textContent=s[0];$('season-copy').textContent=s[1];document.querySelector('.season-flower').textContent=s[2];dialogOpen($('season-dialog'));}));
  const paintMotion=()=>{document.body.classList.toggle('gentle',gentle);$('motion-toggle').textContent=gentle?'开启动画':'盛放特效';$('motion-toggle').setAttribute('aria-pressed',String(!gentle));$('motion-toggle').setAttribute('aria-label',gentle?'动画效果已关闭，点击开启':'动画效果已开启，点击切换为轻柔模式');};
  $('motion-toggle').addEventListener('click',()=>{motion.toggle();toast(gentle?'已减少动态，静静感受这份心意':'完整动画已开启，下次打开也会记住');});
  document.addEventListener('mb:motion',()=>{gentle=motion.reduced();paintMotion();});paintMotion();

  // A bounded canvas layer: petals in daylight, fireflies at night, and short celebration bursts.
  const canvas=$('celebration-fx'), ctx=canvas.getContext('2d');
  let moving=false,width=0,height=0,last=0,raf=0,particles=[],ambient=[],bursts=[],dark=false,clock=0,petalUntil=0;
  const rand=(a,b)=>a+Math.random()*(b-a);
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,MB.performance.profile.dpr);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);ambient=Array.from({length:MB.performance.profile.ambient},(_,i)=>({x:rand(0,width),y:rand(0,height),r:rand(1,3),speed:rand(8,26),phase:rand(0,7),turn:rand(-1,1),petal:i%3===0}));}
  if(ctx)resize();addEventListener('resize',resize,{passive:true});
  function particle(x,y,colour,velocity=140,kind='spark') { const a=rand(0,Math.PI*2),v=rand(velocity*.25,velocity); particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,age:0,life:rand(.8,1.9),r:rand(1.5,4),colour,kind,rot:rand(0,7),spin:rand(-4,4)}); }
  function burst(x,y,n=60,kind='spark'){if(gentle||document.body.matches('.gala-open,.surprise-open')||!ctx)return;const colors=['#eec989','#f2a9b0','#fff0cb','#b693cf','#e9d6a7'];for(let i=0;i<n;i++)particle(x,y,colors[i%colors.length],width<650?150:220,kind);if(particles.length>450)particles.splice(0,particles.length-450);}
  function celebrate(){if(gentle){toast('愿你的心愿，被时光温柔珍藏。');return;}for(let i=0;i<7;i++)bursts.push({at:clock+i*.6,x:width*(.16+Math.random()*.68),y:height*(.18+Math.random()*.42),n:i===0?95:65});petalUntil=clock+7;}
  $('open-gift').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();burst(r.x+r.width/2,r.y,90,'petal');});
  $('send-flowers').addEventListener('click',()=>{petalUntil=clock+7;burst(width*.5,height*.35,110,'petal');toast('把这一场花开，送给最爱的你。');});
  let pointerLast=0;
  document.addEventListener('pointermove',e=>{if(gentle||document.body.matches('.gala-open,.surprise-open')||e.pointerType!=='mouse'||performance.now()-pointerLast<48||particles.length>150)return;pointerLast=performance.now();particle(e.clientX,e.clientY,dark?'#ebd19f':'#b18a58',25);},{passive:true});
  document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('dialog')&&!e.target.closest('#motion-toggle'))burst(e.clientX,e.clientY,10);},{passive:true});
  function frame(ts){raf=0;if(moving||document.hidden||gentle||document.body.matches('.gala-open,.surprise-open')||!ctx)return;raf=requestAnimationFrame(frame);const dt=Math.min((ts-last)/1000||.016,.035);if(ts-last<30)return;last=ts;clock+=dt;ctx.clearRect(0,0,width,height);if(gentle||document.body.matches('.gala-open,.surprise-open')){particles=[];bursts=[];return;}
    dark=document.body.classList.contains('is-scene-dark')||!$('act-blessing').hidden||!$('act-story').hidden;
    const abundant=clock<petalUntil;
    ambient.forEach((p,i)=>{p.y+=p.speed*dt*(abundant?3:1);p.x+=Math.sin(clock*.3+p.phase)*dt*9;if(p.y>height+12){p.y=-14;p.x=rand(0,width);}ctx.save();ctx.translate(p.x,p.y);const alpha=dark?.14+Math.sin(clock+p.phase)*.08:.25;ctx.globalAlpha=abundant?.55:alpha;ctx.fillStyle=dark?'#ffe5bb':i%2?'#b98089':'#b69b68';if((p.petal&&!dark)||abundant){ctx.rotate(clock*p.turn);ctx.scale(1,Math.cos(clock+p.phase)*.5+.65);ctx.beginPath();ctx.ellipse(0,0,p.r*2.6,p.r*1.3,.5,0,Math.PI*2);ctx.fill();}else{ctx.beginPath();ctx.arc(0,0,p.r*.6,0,Math.PI*2);ctx.fill();}ctx.restore();});
    bursts=bursts.filter(b=>{if(clock>=b.at){burst(b.x,b.y,b.n);return false;}return true;});
    particles=particles.filter(p=>{p.age+=dt;if(p.age>=p.life)return false;p.vy+=dt*(p.kind==='petal'?45:65);p.vx*=.988;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.save();ctx.translate(p.x,p.y);ctx.globalAlpha=Math.pow(1-p.age/p.life,.7);ctx.fillStyle=p.colour;ctx.rotate(p.rot+p.spin*p.age);if(p.kind==='petal'){ctx.beginPath();ctx.ellipse(0,0,p.r*2,p.r,0,0,Math.PI*2);ctx.fill();}else{ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);ctx.globalAlpha*=.25;ctx.fillRect(-p.r*2,-.5,p.r*4,1);}ctx.restore();return true;});
  }
  function syncAmbient(){cancelAnimationFrame(raf);raf=0;particles=[];bursts=[];ctx?.clearRect(0,0,width,height);last=performance.now();const running=!!ctx&&!moving&&!document.hidden&&!gentle&&!document.body.matches('.gala-open,.surprise-open');canvas.dataset.running=String(running);if(running)raf=requestAnimationFrame(frame);}
  document.addEventListener('mb:transition',e=>{moving=!!(e.detail&&e.detail.active);syncAmbient();});
  document.addEventListener('mb:gala',syncAmbient);document.addEventListener('mb:surprise',syncAmbient);document.addEventListener('mb:quality',()=>{resize();syncAmbient();});document.addEventListener('mb:motion',syncAmbient);
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('page-sleep',document.hidden);syncAmbient();});syncAmbient();
  const railList=$('rail-list');
  if(railList) new MutationObserver(()=>document.querySelectorAll('.rail-btn').forEach(btn=>{const label=btn.querySelector('.rail-label');if(label&&label.textContent.includes(' · '))label.textContent=label.textContent.split(' · ')[1];})).observe(railList,{childList:true});

  $('share-gift').addEventListener('click',async()=>{const url=location.origin+location.pathname;try{await navigator.clipboard.writeText(url);toast('礼物链接已复制，可以发给妈妈了。');}catch(e){const dialog=document.createElement('dialog');dialog.className='atelier-dialog';const p=document.createElement('p');p.textContent='长按或选中下方链接进行复制';const input=document.createElement('input');input.value=url;input.readOnly=true;input.style.cssText='width:100%;padding:12px;margin:20px 0;font-size:14px';const close=document.createElement('button');close.textContent='收好';close.className='btn';close.onclick=()=>{dialog.close();dialog.remove();};dialog.append(p,input,close);document.body.append(dialog);dialog.showModal();input.select();}});
  $('save-card').addEventListener('click',()=>{
    const card=document.createElement('canvas');card.width=1000;card.height=1400;const c=card.getContext('2d');if(!c){toast('这个浏览器暂时无法生成贺卡');return;}
    const g=c.createLinearGradient(0,0,1000,1400);g.addColorStop(0,'#fff8e9');g.addColorStop(1,'#ead3bf');c.fillStyle=g;c.fillRect(0,0,1000,1400);c.strokeStyle='#b8956f';c.lineWidth=2;c.strokeRect(45,45,910,1310);c.strokeRect(58,58,884,1284);
    c.fillStyle='#9d5264';c.textAlign='center';c.font='italic 85px Georgia';c.fillText('M',500,210);c.font='22px Georgia';c.fillStyle='#9e7b60';c.fillText('WITH LOVE, ALWAYS',500,274);c.font='64px SimSun, serif';c.fillStyle='#58373f';c.fillText('妈妈，生日快乐',500,420);c.strokeStyle='#b78c6b';c.beginPath();c.moveTo(380,465);c.lineTo(620,465);c.stroke();
    const lines=(window.MB_CONFIG?.blessing.lines||[]).map(s=>s.replace(/\*\*/g,''));c.font='30px SimSun, serif';c.fillStyle='#795b53';let y=580;
    lines.forEach(line=>{let row='';for(const char of line){if(c.measureText(row+char).width>710){c.fillText(row,500,y);y+=54;row=char;}else row+=char;}if(row){c.fillText(row,500,y);y+=54;}y+=28;});
    c.font='26px SimSun, serif';c.fillStyle='#9c5c68';c.fillText(window.MB_CONFIG?.closing.sign||'爱你的家人',500,1140);c.font='18px Georgia';c.fillStyle='#a68c71';c.fillText('A LITTLE GIFT, WITH ALL MY LOVE',500,1250);
    card.toBlob(blob=>{if(!blob){toast('贺卡生成失败，请稍后再试');return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='妈妈生日快乐-贺卡.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('贺卡已生成，请在浏览器下载中查看。');},'image/png');
  });
})();
