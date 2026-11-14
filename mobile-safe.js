(function(){
'use strict';
if(window.__mobileSafe)return;window.__mobileSafe=true;
var root=document.documentElement,vv=window.visualViewport,raf=0,kb=-1,dockH=-1,ro=null,on=false;
var EDIT='input:not([type=button]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=submit]),textarea,select,[contenteditable="true"]';
function editing(){var a=document.activeElement;return !!(a&&a.matches&&a.matches(EDIT));}
function measure(){raf=0;if(!vv)return;var gap=window.innerHeight-vv.height-vv.offsetTop;var next=(vv.scale<1.02&&gap>120&&editing())?Math.round(gap):0;if(next!==kb){kb=next;root.style.setProperty('--ms-kb',next+'px');root.classList.toggle('ms-kb-open',next>0);}}
function schedule(){if(!raf)raf=requestAnimationFrame(measure);}
function onDock(entries){var t=entries[0]&&entries[0].target;if(!t)return;var h=Math.round(t.offsetHeight);if(h>=44&&h<160&&h!==dockH){dockH=h;root.style.setProperty('--ms-dock-h',h+'px');}}
function start(){if(on)return;on=true;if(vv){vv.addEventListener('resize',schedule,{passive:true});vv.addEventListener('scroll',schedule,{passive:true});}document.addEventListener('focusin',schedule,{passive:true});document.addEventListener('focusout',schedule,{passive:true});var d=document.getElementById('theatre-dock');if(d&&'ResizeObserver' in window){ro=new ResizeObserver(onDock);ro.observe(d);}schedule();}
function stop(){if(!on)return;on=false;if(vv){vv.removeEventListener('resize',schedule);vv.removeEventListener('scroll',schedule);}document.removeEventListener('focusin',schedule);document.removeEventListener('focusout',schedule);if(ro){ro.disconnect();ro=null;}if(raf){cancelAnimationFrame(raf);raf=0;}}
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',function(e){if(e.persisted)start();});
start();
})();
