(function(){
var MB=window.MB=window.MB||{},PS=MB.playScenes=MB.playScenes||{},Q=String.fromCharCode(39),HO=Object.prototype.hasOwnProperty;
function cp(o){return JSON.parse(JSON.stringify(o))}
function r1(v){return Math.round(v*10)/10}
function X(a,o){for(var k in o)if(HO.call(o,k))a[k]=o[k];return a}
function el(t,a,c){var s='<'+t,k;for(k in a)if(HO.call(a,k))s+=' '+k+'='+Q+a[k]+Q;return s+(c==null?'/>':'>'+c+'</'+t+'>')}
function P(d,f,o){return el('path',X({d:d,fill:f||'none'},o||{}))}
function C(x,y,r,f,o){return el('circle',X({cx:x,cy:y,r:r,fill:f},o||{}))}
function E(x,y,a,b,f,o){return el('ellipse',X({cx:x,cy:y,rx:a,ry:b,fill:f},o||{}))}
function G(x,y,b){return el('g',{transform:'translate('+x+' '+y+')'},b)}
function K(c,w){return {stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'}}
function inj(v,a){var i=v.lastIndexOf('</svg>');return i<0?v:v.slice(0,i)+a+v.slice(i)}
function stp(x,y,r){var d='',j,g,q;for(j=0;j<10;j++){g=Math.PI*j/5-Math.PI/2;q=j%2?r*0.45:r;d+=(j?'L':'M')+r1(x+q*Math.cos(g))+' '+r1(y+q*Math.sin(g))}return d+'Z'}
function fon(s,i){return !!(s&&s.lit&&s.lit[i]>=0)}
var FC=['#f6b73c','#4fd1c5','#f58fb4'],LC=[1,2,0],LX=[70,180,290];
var KN=['','如意结','盘长结','蝴蝶结'],SD=['郁金香','向日葵','铃兰'],WN=['','东风','西风','上升风'],PN=['','鞠躬','转圈','邀舞'],FL=['','莲花灯','纸船灯','星星灯'],CN=['','小兔','小鱼','小鸟'],BN=['','纸船','小鸭','纸船和小鸭'];
var CS=[[[10,0],[16,16],[24,2],[22,18],[36,26],[58,30],[52,40],[24,40],[18,22]],[[4,20],[22,8],[44,14],[58,4],[56,22],[58,36],[44,26],[22,32]],[[6,22],[24,14],[38,0],[44,16],[62,12],[46,26],[30,36],[14,30]]];
var CFG={
timeline:{a:'ex_knot',n:4,h:'「换窗边挂饰」可以给花窗挂上三种结。',
L:function(k){return k<3?'换窗边挂饰：'+KN[k+1]:'收起窗边挂饰'},
S:function(k){return k?'花窗左下挂上了'+KN[k]+'，流苏垂了下来。':'窗边挂饰收起了。'},
A:function(k){if(!k)return '';var i=k-1,ln=[60,56,52][i];
return G(42,124,P('M0 0V14',0,K('#8a5a3b',1.5))+[P('M0 16C-10 10-12 22-4 24C-12 28-6 36 0 30C6 36 12 28 4 24C12 22 10 10 0 16Z','#d9534f',K('#8a2f2a',1)),P('M0 13L11 24L0 35L-11 24Z','#c8364a',K('#7a2430',1)),P('M0 24C-15 11-17 36 0 24C15 11 17 36 0 24Z','#e98aa6',K('#b5566f',1))][i]+[P('M-3 23h6',0,K('#f7d36b',2)),P('M-5 19L5 29M5 19L-5 29',0,K('#f7d36b',1.5)),C(0,24,3,'#f7d36b')][i]+C(0,37,3,'#f2c14e',K('#8a5a3b',1))+P('M-4 39L-6 '+ln+'M0 39V'+(ln+2)+'M4 39L6 '+ln,0,K('#c8364a',1.6)))}},
greenhouse:{a:'ex_seed',n:4,h:'「小盆种」可以在左下种三种花，水路接通后它也会开。',
L:function(k){return k<3?'小盆种：'+SD[k]:'收起小盆'},
S:function(k,s,d){return k?(d?'左下小盆的'+SD[k-1]+'也开花了。':'左下小盆种下了'+SD[k-1]+'，接通水路后它会开花。'):'左下小盆收起了。'},
A:function(k,s,d){if(!k)return '';var i=k-1,f;
if(d)f=[P('M-6 -24Q-7 -34-3 -31L0 -36L3 -31Q7 -34 6 -24Q0 -20-6 -24Z','#e65b6b',K('#b8404e',1)),C(0,-28,5,'#7a4a22',{stroke:'#f4c03a','stroke-width':5,'stroke-dasharray':'3 2'}),P('M0 -22Q4 -33 12 -31',0,K('#4f8a57',1.5))+P('M4 -25h0.1M8 -27h0.1M12 -25h0.1',0,K('#fffaf0',5))][i];
else f=C(0,-18,2.5,'#9bd18b');
return G(52,171,P('M0 -4V'+(d?-24:-16),0,K('#4f8a57',2))+P(['M0 -4C-6 -10-7 -18-5 -22C-2 -16-1 -10 0 -4M0 -4C6 -10 7 -18 5 -22C2 -16 1 -10 0 -4','M0 -8C-9 -6-12 -13-10 -16C-5 -16-1 -12 0 -8M0 -12C9 -10 12 -17 10 -20C5 -20 1 -16 0 -12','M0 -4C-10 -8-10 -20-4 -24C-4 -16-2 -10 0 -4'][i],'#6aa86f')+f+P('M-14 -5h28v5h-28zM-12 0h24l-3 15h-18z','#c4683f',K('#9a4f2e',1)))}},
seaside:{a:'ex_shell',n:3,need:1,h:'三个环都跳过后，右下的贝壳可以打开。',
L:function(k,d){return d?['打开贝壳','把贝壳全打开','合上贝壳'][k]:'过完三环可开贝壳'},
S:function(k){return ['贝壳合上了，珍珠藏回沙里。','贝壳张开一条缝，里面透出一点白光。','贝壳全打开了，里面藏着一颗圆珍珠。'][k]},
A:function(k){return G(278,196,P('M-26 8Q0 -4 26 8Z','#e8d2a8')+P('M-16 0Q0 12 16 0Z','#f0cfb8',K('#b98a6a',1))+(k?C(0,-3,4,'#fffaf0',K('#c9b6dc',1)):'')+el('g',{transform:'rotate('+[0,25,50][k]+' 16 0)'},P('M-16 0Q0 -12 16 0ZM-8 -2L-3 -6M0 -1V-7M8 -2L4 -6','#f6dcc8',K('#b98a6a',1)))+(k>1?P('M-14 -16v8M-18 -12h8',0,K('#fff',1.5)):''))}},
forest:{a:'ex_call',n:4,h:'「伙伴萤火」会一盏一盏拜访蘑菇灯，遇到亮着的灯会闪光回应。',
L:function(k){return k<3?'伙伴萤火去第'+(k+1)+'盏灯':'伙伴萤火回林子'},
S:function(k,s){if(!k)return '伙伴萤火回林子里歇着了。';return '伙伴萤火停在左起第'+k+'盏蘑菇灯旁，'+(fon(s,k-1)?'灯亮着，它闪出一圈光回应。':'这盏灯还暗着，它先安静陪着。')},
A:function(k,s){if(!k)return '';var i=k-1,on=fon(s,i),c=on?FC[LC[i]]:'#c8f7a0';return G(LX[i]+30,108,C(0,0,8,c,{opacity:0.3})+P('M0 0C-6 -8-10 -2-3 1M0 0C6 -8 10 -2 3 1','#eaf6ff',{opacity:0.8})+C(0,1,3,c)+(on?P('M0 -12v-4M11 0h4M-11 0h-4M8 -8l3 -3M-8 -8l-3 -3',0,K(c,1.5)):''))}},
clouds:{a:'ex_wind',n:4,h:'「换风向」会改变小屋旁风袋的方向。',
L:function(k){return k<3?'换风向：'+WN[k+1]:'让风停下'},
S:function(k){return k?WN[k]+'吹来，'+['','小屋旁的风袋朝西鼓起。','小屋旁的风袋朝东鼓起。','风袋向上翘了起来。'][k]:'风停了，风袋收了起来。'},
A:function(k){if(!k)return '';var i=k-1;return P('M330 170V125',0,K('#7a5a44',2))+P(['M330 127L308 130V135L330 138Z','M330 127L352 130V135L330 138Z','M327 128L333 106L338 107L334 128Z'][i],'#fff4e8',K('#c96f53',1))+P(['M315 130.5V134.5','M345 130.5V134.5','M331.5 113H336'][i],0,K('#e0674f',3))+P(['M162 14H118l6 -4M156 26H112l6 -4','M112 14H156l-6 -4M118 26H162l-6 -4','M124 34q-6 -8 0 -14q6 -7 0 -14M148 34q-6 -8 0 -14q6 -7 0 -14'][i],0,X(K('#fff',2),{opacity:0.9}))}},
musicbox:{a:'ex_dance',n:4,h:'「舞伴动作」请小熊在人偶旁摆出不同姿势。',
L:function(k){return k<3?'舞伴动作：'+PN[k+1]:'舞伴退场'},
S:function(k){return ['小熊舞伴退场歇一歇。','小熊舞伴朝小人偶鞠了个躬。','小熊舞伴举起双手，摆出转圈的姿势。','小熊舞伴伸出手，邀请小人偶一起跳。'][k]},
A:function(k){if(!k)return '';return G(306,88,E(0,0,12,3.5,'#c9a46a')+el('g',{transform:'rotate('+[0,-28,0,-8][k]+')'},P(['','M-6 -13L-8 -4M6 -13L8 -4','M-6 -13L-12 -28M6 -13L12 -28','M-6 -13L-20 -16M6 -13L9 -4'][k],0,K('#a8703f',3))+P('M-8 0h16l-3 -18h-10z','#c98b5a')+P('M-9 -31a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 -31a3 3 0 1 0 6 0a3 3 0 1 0-6 0','#a8703f')+C(0,-25,7,'#c98b5a')+C(0,-23,2.5,'#f3dfc0')))}},
lanterns:{a:'ex_float',n:4,h:'「放河灯」可以在右下水面换三种河灯。',
L:function(k){return k<3?'放河灯：'+FL[k+1]:'收起河灯'},
S:function(k){return k?'右下水面放下一盏'+FL[k]+'，停在倒影旁。':'河灯收起了。'},
A:function(k){if(!k)return '';var i=k-1,f=[[0,-9],[-6,-10],[0,-6]][i];return G(318,172,P('M-22 6q11 -5 22 0t22 0',0,K('#9fd3e8',1.5))+[P('M-14 0Q-13 -10-6 -4Q-4 -14 0 -6Q4 -14 6 -4Q13 -10 14 0Z','#f6a6bd',K('#c9637f',1)),P('M-16 -4H16L10 4H-10ZM-1 -5V-18L9 -7Z','#f6e7c8',K('#c9a56a',1)),P(stp(0,-6,11),'#ffd27a',K('#c98a2a',1))][i]+C(f[0],f[1],i>1?2.5:3,i>1?'#fff6e0':'#ffd27a'))}},
memory:{a:'ex_star',n:4,h:'「伙伴星座」会在左下点亮小动物星座。',
L:function(k){return k<3?'伙伴星座：'+CN[k+1]:'收起伙伴星座'},
S:function(k,s,d){return k?'左下亮起'+CN[k]+'星座，陪着花朵星座。'+(d?'它的连线也染成了金色。':''):'伙伴星座藏回夜空。'},
A:function(k,s,d){if(!k)return '';var p=CS[k-1],ln='',dt='',j;for(j=0;j<p.length;j++){ln+=(j?'L':'M')+p[j][0]+' '+p[j][1];dt+='M'+p[j][0]+' '+p[j][1]+'h0.1'}return G(14,136,P(ln+'Z',0,{stroke:d?'#ffe7a3':'#9fb8ff','stroke-width':1.2,opacity:0.8})+P(dt,0,K('#ffe7a3',4)))}},
cake:{a:'ex_candle',n:4,h:'「小碟蜡烛」可以在左下点一到三根细蜡烛。',
L:function(k){return k<3?'小碟蜡烛：'+(k+1)+'根':'收起小蜡烛'},
S:function(k){return k?'左下小碟点了'+k+'根细蜡烛，烛光静静亮着。':'小蜡烛收起了。'},
A:function(k){if(!k)return '';var xs=[[0],[-8,8],[-14,0,14]][k-1],hs=[22,18,22],b='',t='',f='',j,x,h;for(j=0;j<xs.length;j++){x=xs[j];h=hs[j];b+='M'+(x-2.5)+' 0h5v-'+h+'h-5Z';t+='M'+(x-2.5)+' -'+(h-5)+'l5 -3M'+(x-2.5)+' -'+(h-12)+'l5 -3';f+='M'+x+' -'+(h+1)+'q4 -5 0 -10q-4 5 0 10Z'}return G(40,184,E(0,2,24,5,'#fff',{stroke:'#d6c4b4'})+P(b,'#fff7e8',K('#e39cae',1))+P(t,0,K('#e39cae',1.2))+P(f,'#ffcf5a',K('#f39a3d',0.8)))}},
rain:{a:'ex_boat',n:4,need:1,h:'彩虹完成后，右下水洼可以放纸船或小鸭。',
L:function(k,d){return d?(k<3?'水洼里放：'+BN[k+1]:'收起水洼玩具'):'彩虹完成后看水洼'},
S:function(k){return ['水洼里的小玩具收起了。','雨停了，右下水洼漂着一只纸船。','雨停了，一只小鸭游进了水洼。','纸船和小鸭一起停在水洼里。'][k]},
A:function(k,s,d){if(!d||!k)return '';return G(318,193,E(0,0,32,6,'#b9d4e6')+P('M-26 0q6 -3 12 0M8 2q6 -3 12 0',0,K('#e6f0f7',1.2))+(k&1?P('M-22 -2H-2L-6 4H-18ZM-13 -3L-9 -14L-6 -3Z','#fff',K('#7f97ad',1)):'')+(k&2?P('M4 -1q0 -7 9 -7q1 -6 6 -5q4 1 1 5l4 1q-2 2 -5 1q3 7 -15 5Z','#f4cf3f',K('#c99228',0.8))+C(18,-11,1,'#33475b'):''))}}
};
function wrap(id,R){var g=PS[id];if(!g||g.__pr||typeof g.init!=='function'||typeof g.act!=='function'||typeof g.view!=='function')return;
var oi=g.init,oa=g.act,ov=g.view,ng={},q;for(q in g)if(HO.call(g,q))ng[q]=g[q];
function kx(s){var e=s&&s.extra,k=e&&typeof e.k==='number'&&isFinite(e.k)?Math.floor(e.k):0;return k>=0&&k<R.n?k:0}
function bx(s){return !!(s&&s.extra&&s.extra.b)}
ng.hint=(g.hint||'')+' 彩蛋：'+R.h;
ng.init=function(){var s=cp(oi.apply(g,arguments));s.extra={k:0,b:0};return s};
ng.act=function(s,a){var n,r,p;if(!s||typeof s!=='object')return s;
if(a===R.a){if(R.need&&!ov.call(g,s).done)return s;n=cp(s);n.extra={k:(kx(s)+1)%R.n,b:1};return n}
if(typeof a==='string'&&a.slice(0,3)==='ex_')return s;
r=oa.call(g,s,a);if(r===s||!r||typeof r!=='object')return r;
n={};for(p in r)if(HO.call(r,p))n[p]=r[p];n.extra={k:kx(r.extra?r:s),b:0};return n};
ng.view=function(s){var o=ov.call(g,s);if(!o||typeof o!=='object')return o;
var k=kx(s),d=!!o.done,out={},p,art,bs;for(p in o)if(HO.call(o,p))out[p]=o[p];if(id==='clouds')out.completionKey=s.fl;
art=R.A(k,s,d);if(art&&typeof o.svg==='string')out.svg=inj(o.svg,el('g',{'class':'pr-extra'},art));
out.actions=(Array.isArray(o.actions)?o.actions.slice():[]).concat([{id:R.a,label:R.L(k,d),disabled:!!(R.need&&!d)}]);
if(bx(s)){bs=R.S(k,s,d);out.bonusStatus=bs;out.status=(o.status?o.status+' ':'')+bs;out.motion='none'}
return out};
Object.defineProperty(ng,'__pr',{value:true});PS[id]=ng}
for(var id in CFG)if(HO.call(CFG,id))wrap(id,CFG[id]);
})();
