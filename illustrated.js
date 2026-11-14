/* Detailed original 2D illustration layers. Existing scene content and interactions stay in place. */
(()=>{'use strict';
 const maps={timeline:'botanical-border',greenhouse:'conservatory-details',seaside:'seaside-details',forest:'forest-details',clouds:'cloud-details',musicbox:'musicbox-details',lanterns:'lantern-details'};
 for(const [name,file] of Object.entries(maps)){
  const p=document.getElementById('panel-'+name);p.classList.add('illustration-rich');
  const img=document.createElement('img');img.className='illustration-details';img.src='assets/'+file+'.svg';img.alt='';img.setAttribute('aria-hidden','true');img.draggable=false;p.prepend(img);
  const motes=document.createElement('div');motes.className='illustration-motes';motes.setAttribute('aria-hidden','true');
  for(let i=0;i<16;i++){const dot=document.createElement('i');dot.style.cssText=`--x:${38+(i*37)%60}%;--y:${9+(i*29)%77}%;--delay:${-i*.73}s;--dur:${5+i%6}s;--size:${i%4===0?5:2}px`;motes.append(dot);}p.append(motes);
  if(['timeline','greenhouse'].includes(name)){const b=document.createElement('div');b.className='paper-butterflies';b.setAttribute('aria-hidden','true');b.innerHTML=Array.from({length:3},(_,i)=>`<svg viewBox="0 0 60 50" style="--b:${i}"><g class="butterfly-wing"><path d="M30 28C-1-15-9 30 20 31C-3 47 30 54 30 28" fill="#c79d9e"/><path d="M30 28C61-15 69 30 40 31C63 47 30 54 30 28" fill="#ead2b8"/><path d="M30 36V16M30 18l-5-6M30 18l5-6" stroke="#8c746a" fill="none" stroke-width="1.3"/></g></svg>`).join('');p.append(b);}
 }
 document.documentElement.dataset.artStyle='detailed-2d';
})();
