(function(){
var MB=window.MB=window.MB||{};MB.playScenes=MB.playScenes||{};
var Q='"';
function el(t,a,c){var s='<'+t;for(var k in a){if(a.hasOwnProperty(k))s+=' '+k+'='+Q+a[k]+Q;}return s+(c==null?'/>':'>'+c+'</'+t+'>');}
function svg(c){return el('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 360 210','aria-hidden':'true',focusable:'false'},c);}
function cp(o){return JSON.parse(JSON.stringify(o));}
function r1(v){return Math.round(v*10)/10;}
function txt(x,y,sz,fill,s){return el('text',{x:x,y:y,'font-size':sz,fill:fill,'text-anchor':'middle','font-weight':'bold'},s);}
var LX=[58,122,186,250];
function mask(on){var m=0;for(var i=0;i<4;i++){if(on[i])m|=1<<i;}return m;}
function flip(i){return (1<<i)|(1<<((i+1)%4));}
function bestNext(on){var st=mask(on);if(st===15)return -1;var prev={},seen={},q=[st],h=0,c,n,i,x;seen[st]=1;while(h<q.length){c=q[h++];for(i=0;i<4;i++){n=c^flip(i);if(seen[n])continue;seen[n]=1;prev[n]=[c,i];if(n===15){x=n;while(prev[x][0]!==st){x=prev[x][0];}return prev[x][1];}q.push(n);}}return -1;}
function ribs(x,col){return el('path',{d:'M'+(x-10)+' 47Q'+(x-18)+' 70 '+(x-10)+' 93M'+x+' 44V96M'+(x+10)+' 47Q'+(x+18)+' 70 '+(x+10)+' 93',fill:'none',stroke:col,'stroke-width':1.2});}
function nb(i){return (i+1)%4+1;}
var lanterns={title:'灯影成双',entry:'点亮倒影',hint:'点一盏灯，它右边那盏也会一起变化（灯4的右边是灯1）。让四盏灯都亮，和水中倒影一致。',
init:function(){return {on:[false,false,false,false],moves:0,last:-1,hint:-1,done:false,fx:'none'};},
act:function(s,a){if(!s||s.done)return s;var m=/^l([1-4])$/.exec(a),n,i;if(m){n=cp(s);i=+m[1]-1;n.on[i]=!n.on[i];n.on[(i+1)%4]=!n.on[(i+1)%4];n.moves++;n.last=i;n.hint=-1;n.done=mask(n.on)===15;n.fx=n.done?'drift':'pop';return n;}if(a==='hint'){n=cp(s);n.hint=bestNext(n.on);n.fx=n.hint<0?'none':'swing';return n;}return s;},
view:function(s){var i,x,on,hero='',refl='',dots='',cnt=0,acts=[],st;
for(i=0;i<4;i++){x=LX[i];on=!!s.on[i];if(on)cnt++;
hero+=el('line',{x1:x,y1:27,x2:x,y2:41,stroke:'#c9a56a','stroke-width':1.5});
if(on)hero+=el('ellipse',{cx:x,cy:70,rx:33,ry:37,fill:'#ffb35c',opacity:0.28});
hero+=el('ellipse',{cx:x,cy:70,rx:22,ry:26,fill:on?'#e8483a':'#5b3c40',stroke:'#2a1a1c','stroke-width':1.5})+ribs(x,on?'#ffd27a':'#3a2629');
hero+=el('rect',{x:x-9,y:40,width:18,height:6,rx:2,fill:'#c9a56a'})+el('rect',{x:x-8,y:94,width:16,height:5,rx:2,fill:'#c9a56a'});
hero+=el('path',{d:'M'+x+' 99V114',stroke:'#e8b04a','stroke-width':3,'stroke-linecap':'round'});
hero+=txt(x,76,15,on?'#fff6e0':'#c7aeb0',String(i+1));
refl+=on?el('ellipse',{cx:x,cy:70,rx:22,ry:26,fill:'#e8483a'})+ribs(x,'#ffd27a'):el('ellipse',{cx:x,cy:70,rx:22,ry:26,fill:'none',stroke:'#ffb35c','stroke-dasharray':'4 4'});
dots+=el('circle',{cx:299+i*14,cy:104,r:5,fill:'#e8483a',stroke:'#7a3b2a'});
acts.push({id:'l'+(i+1),label:'灯'+(i+1),pressed:on,disabled:!!s.done});}
acts.push({id:'hint',label:'提示',disabled:!!s.done});
hero+=el('g',{transform:'translate(0,242) scale(1,-1)',opacity:0.42},refl);
if(s.hint>=0&&!s.done)hero+=el('circle',{cx:LX[s.hint],cy:70,r:31,fill:'none',stroke:'#fff3b0','stroke-width':2.5,'stroke-dasharray':'5 4'});
if(s.done)hero+=el('ellipse',{cx:154,cy:172,rx:130,ry:18,fill:'none',stroke:'#9fd3e8',opacity:0.7})+el('ellipse',{cx:154,cy:172,rx:165,ry:28,fill:'none',stroke:'#9fd3e8',opacity:0.35});
var bg=el('rect',{width:360,height:122,fill:'#1d2547'})+el('circle',{cx:322,cy:32,r:13,fill:'#f6e7c8',opacity:0.9})+el('path',{d:'M0 112Q60 96 120 108T240 104T360 110V122H0Z',fill:'#141c36'})+el('rect',{y:120,width:360,height:90,fill:'#123049'})+el('path',{d:'M10 140H90M150 150H230M40 188H140M200 198H330M262 134H342',stroke:'#2c5a78','stroke-width':2,'stroke-linecap':'round'});
var det=el('g',{'class':'pg-detail'},el('rect',{x:288,y:74,width:64,height:42,rx:8,fill:'#f6e7c8',opacity:0.92})+txt(320,89,11,'#7a3b2a','目标全亮')+dots);
var top=el('path',{d:'M26 22Q154 36 282 22',fill:'none',stroke:'#c9a56a','stroke-width':2});
if(s.done)st='四盏灯全亮，和水中倒影一模一样，河面荡开涟漪。用了'+s.moves+'步。';
else if(s.hint>=0)st='提示：点灯'+(s.hint+1)+'，它会和右边的灯'+nb(s.hint)+'一起切换。';
else if(s.last>=0)st='点了灯'+(s.last+1)+'：它和右边的灯'+nb(s.last)+'一起切换，现在亮着'+cnt+'盏，目标是4盏。';
else st='点一盏灯，它和右边那盏会一起切换（灯4的右边是灯1）。让四盏灯都亮，和倒影一致。';
return {svg:svg(bg+det+el('g',{'class':'pg-hero'},top+hero)),actions:acts,status:st,done:!!s.done,motion:s.fx||'none'};}};
var MC=[180,102],MR=56;
function P(k,r){var g=(-90+60*k)*Math.PI/180;return [r1(MC[0]+r*Math.cos(g)),r1(MC[1]+r*Math.sin(g))];}
function seg(k,first){var a=P(k,MR),b=P(k+1,MR),c=P(k+0.5,MR*1.6);return (first?'M'+a.join(' '):'')+'Q'+c.join(' ')+' '+b.join(' ');}
function flower(){var d='',k;for(k=0;k<6;k++)d+=seg(k,k===0);return d+'Z';}
function starP(x,y,r){var d='',j,g,rr;for(j=0;j<10;j++){g=(-90+36*j)*Math.PI/180;rr=j%2?r*0.45:r;d+=(j?'L':'M')+r1(x+rr*Math.cos(g))+' '+r1(y+rr*Math.sin(g));}return d+'Z';}
var DOTS=[[20,30],[64,16],[96,44],[300,20],[336,60],[260,40],[30,128],[330,132],[72,84],[292,98],[124,14],[232,18]];
var memory={title:'星座描线',entry:'连一个星座',hint:'按序号点星星：1到6，最后再点一次星1，画出一朵六瓣花。',
init:function(){return {n:0,miss:-1,done:false,fx:'none'};},
act:function(s,a){if(!s||s.done)return s;var m=/^s([1-6])$/.exec(a),n,k;if(!m)return s;k=+m[1]-1;n=cp(s);if(k===n.n%6){n.n++;n.miss=-1;n.done=n.n>=7;n.fx=(n.done||n.n===1)?'pop':'draw';}else{n.miss=k;n.fx='none';}return n;},
view:function(s){var n=s.n,k,p,q,lit,hero='',acts=[],st,e=n%6,segs=Math.min(Math.max(n-1,0),6),dd='';
for(k=0;k<DOTS.length;k++)dd+='M'+DOTS[k][0]+' '+DOTS[k][1]+'h0.5';
var bg=el('rect',{width:360,height:210,fill:'#0f1a3d'})+el('path',{d:'M0 70Q110 30 220 60T360 30V62Q250 96 170 84T0 104Z',fill:'#1c2a5a',opacity:0.7})+el('path',{d:dd,stroke:'#cfd9ff','stroke-width':2,'stroke-linecap':'round',opacity:0.7})+el('circle',{cx:36,cy:30,r:12,fill:'#f3e6c4'})+el('circle',{cx:42,cy:26,r:10,fill:'#0f1a3d'})+el('path',{d:'M0 188Q90 168 180 184T360 176V210H0Z',fill:'#0a1230'});
var det=el('g',{'class':'pg-detail'},el('path',{d:flower(),fill:'none',stroke:'#5d74b3','stroke-width':1.2,'stroke-dasharray':'2 5',opacity:0.6}));
if(s.done)hero+=el('path',{d:flower(),fill:'#ff9fbf',opacity:0.32})+el('path',{d:'M180 171Q188 186 178 206M182 188Q198 178 210 186',fill:'none',stroke:'#7fc8a0','stroke-width':2.5,'stroke-linecap':'round'});
for(k=0;k<segs;k++)hero+=el('path',{d:seg(k,true),fill:'none',stroke:'#ffe7a3','stroke-width':2.5,'stroke-linecap':'round'});
if(s.done)hero+=el('circle',{cx:180,cy:102,r:11,fill:'#ffcf6b'})+el('circle',{cx:180,cy:102,r:5,fill:'#ff9a5c'});
for(k=0;k<6;k++){p=P(k,MR);lit=n>k;q=P(k,MR-19);
hero+=el('circle',{cx:p[0],cy:p[1],r:11,fill:'#ffe08a',opacity:lit?0.35:0.1})+el('path',{d:starP(p[0],p[1],lit?9:6),fill:lit?'#ffe08a':'#a9bce6'})+txt(q[0],q[1]+4,12,'#dfe8ff',String(k+1));
acts.push({id:'s'+(k+1),label:'星'+(k+1),pressed:lit,disabled:!!s.done});}
if(!s.done){p=P(e,MR);hero+=el('circle',{cx:p[0],cy:p[1],r:14,fill:'none',stroke:'#9fe3ff','stroke-width':1.8,'stroke-dasharray':'3 3'});
if(s.miss>=0){p=P(s.miss,MR);hero+=el('circle',{cx:p[0],cy:p[1],r:14,fill:'none',stroke:'#ff9a8a','stroke-width':1.5});}}
if(s.done)st='花朵星座完成！六片花瓣连成一朵花，在夜空里闪了一下。';
else if(s.miss>=0)st='那是星'+(s.miss+1)+'。下一颗请点星'+(e+1)+'，已经连好的线都还在。';
else if(n===0)st='从星1开始，按1到6的顺序点星星，最后再点一次星1，把花合上。';
else if(n===6)st='六颗星都亮了，再点星1，合上最后一片花瓣。';
else if(n===1)st='星1亮了，接着点星2，画出第一片花瓣。';
else st='第'+(n-1)+'片花瓣连好了，下一颗点星'+(e+1)+'。';
return {svg:svg(bg+det+el('g',{'class':'pg-hero'},hero)),actions:acts,status:st,done:!!s.done,motion:s.fx||'none'};}};
Object.assign(MB.playScenes,{lanterns:lanterns,memory:memory});
})();
