(function(){
var MB=window.MB=window.MB||{};MB.playScenes=MB.playScenes||{};
function cp(o){return JSON.parse(JSON.stringify(o))}
function svg(b){return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 210' aria-hidden='true' focusable='false'>${b}</svg>`}
function at(x,y,b){return `<g transform='translate(${x} ${y})'>${b}</g>`}
function hero(x,y,b){return at(x,y,`<g class='pg-hero'>${b}</g>`)}
function r1(n){return Math.round(n*10)/10}
function tx(x,y,s,t,f){return `<text x='${x}' y='${y}' font-size='${s}' text-anchor='middle' fill='${f||'#5a3d2b'}'>${t}</text>`}
function star(R,q,n,f){var p=[],i,a,d;for(i=0;i<n*2;i++){a=Math.PI*i/n-Math.PI/2;d=i%2?q:R;p.push(r1(Math.cos(a)*d)+','+r1(Math.sin(a)*d))}return `<polygon points='${p.join(' ')}' fill='${f}'/>`}
function dots(l,r,f){return l.map(function(p){return `<circle cx='${p[0]}' cy='${p[1]}' r='${r}' fill='${f}'/>`}).join('')}
var SN=['空','春樱','夏荷','秋枫','冬梅'],SF=['#efe3cf','#fbe1e8','#dcefe2','#f9e2c4','#e4edf5'];
function motif(k){var o='',i,a;
if(!k)return `<circle r='13' fill='none' stroke='#b39c7d' stroke-width='2' stroke-dasharray='3 4'/>`+tx(0,4,11,'空','#9a8466');
if(k===1){o=`<path d='M-24 18Q-6 6 22-16' stroke='#7a4e3a' stroke-width='3' fill='none'/>`;for(i=0;i<5;i++){a=i*1.2566-1.5708;o+=`<circle cx='${r1(Math.cos(a)*7)}' cy='${r1(Math.sin(a)*7)}' r='6' fill='#f4a3b8'/>`}return o+`<circle r='3' fill='#f7d36b'/><circle cx='17' cy='-11' r='4' fill='#f8c3d1'/>`}
if(k===2)return `<ellipse cy='13' rx='24' ry='7' fill='#5f9e6e'/><path d='M0 13V2' stroke='#3f7a52' stroke-width='2'/><path d='M0 8C-17 2-15-11-8-8C-6-17 6-17 8-8C15-11 17 2 0 8Z' fill='#f29bb0' stroke='#d66f8c'/><path d='M0 6V-10' stroke='#d66f8c'/>`;
if(k===3)return `<path d='M0 4L-4 22' stroke='#8a4b25' stroke-width='2'/>`+star(17,8,5,'#e0672f')+at(15,12,star(9,4,5,'#e9a93a'));
return `<path d='M-24 16Q-2 2 22-14' stroke='#5b4636' stroke-width='4' fill='none'/><path d='M-14 8Q-2 0 10-6' stroke='#fff' stroke-width='3' fill='none'/><circle cx='-6' cy='6' r='6' fill='#c8364a'/><circle cx='12' cy='-9' r='5' fill='#c8364a'/><circle cx='-6' cy='6' r='2' fill='#f7d36b'/><path d='M-12-14V-2M-17-11L-7-5M-17-5L-7-11' stroke='#8fb0cc' stroke-width='2'/>`}
function tmiss(sl){return [1,2,3,4].filter(function(k){return sl.indexOf(k)<0})}
function loose(sl,i){return !sl[i]||sl.indexOf(sl[i])!==sl.lastIndexOf(sl[i])}
var GP=[{n:'A',x:125,y:72,t:0,k:'1,3'},{n:'B',x:195,y:72,t:1,k:'2,3'},{n:'C',x:195,y:142,t:1,k:'0,3'}],DX=[0,1,0,-1],DY=[-1,0,1,0],GM={rotA:0,rotB:1,rotC:2};
function gop(i,r){var b=GP[i].t?[0,1]:[0,2];return [(b[0]+r)%4,(b[1]+r)%4].sort()}
function gok(i,r){return gop(i,r).join()===GP[i].k}
function gflow(ro){var f=0;while(f<3&&gok(f,ro[f]))f++;return f}
function pipe(i,r,wet){var o=gop(i,r),d=`M${DX[o[0]]*35} ${DY[o[0]]*35}L0 0L${DX[o[1]]*35} ${DY[o[1]]*35}`;return `<path d='${d}' stroke='#b8763e' stroke-width='13' fill='none' stroke-linejoin='round'/><path d='${d}' stroke='${wet?'#5fb7e6':'#4a3424'}' stroke-width='5' fill='none' stroke-linejoin='round'/><circle r='7' fill='#d08a4c' stroke='#8d5428'/>`}
var ORD=['high','low','mid'],HY={high:52,mid:84,low:112},CR={high:90,mid:110,low:128},WX=[110,190,270],NM={high:'高',mid:'中',low:'低'};
function dol(){return `<path d='M40 0C34-6 26-10 14-12C-2-14-18-8-30 0L-42-9L-38 3L-44 12L-30 6C-16 12 6 12 22 6C28 4 34 2 40 0Z' fill='#2f6f96'/><path d='M36 2C24 8 4 10-16 7C0 6 22 4 36 2Z' fill='#bfe3f0'/><path d='M4-12C0-20-6-25-12-26C-9-20-9-15-9-10Z' fill='#255c7d'/><path d='M6 6L-3 17L-6 8Z' fill='#255c7d'/><circle cx='28' cy='-3' r='2' fill='#0f2a3a'/>`}
Object.assign(MB.playScenes,{
timeline:{title:'四季花窗',entry:'拼一扇四季窗',hint:'先选一扇窗格，再点「换花」轮换春樱、夏荷、秋枫、冬梅。四季各放一格就拼好了，顺序随你；「补缺的季节」会帮当前格放上还没有的季节。',
init:function(){return {slots:[0,0,0,0],sel:0,last:'none'}},
act:function(s,a){var n=cp(s),m=/^slot([1-4])$/.exec(a||''),was=!tmiss(s.slots).length,ms,t,j;
if(m){n.sel=+m[1]-1;n.last='none';return n}
if(a==='next')n.slots[n.sel]=(n.slots[n.sel]+1)%5;
else if(a==='help'){ms=tmiss(n.slots);if(!ms.length)return s;t=n.sel;if(!loose(n.slots,t))for(t=0;t<3&&!loose(n.slots,t);t++);n.slots[t]=ms[0];n.sel=t;for(j=0;j<4;j++)if(!n.slots[j]){n.sel=j;break}}
else return s;
n.last=!tmiss(n.slots).length&&!was?'draw':'pop';return n},
view:function(s){var sl=s.slots,m=tmiss(sl),ok=!m.length,w='',bd='',sd='',i,a0,a1,am,d;
function pt(a){return r1(Math.cos(a)*78)+' '+r1(Math.sin(a)*78)}
for(i=0;i<4;i++){a0=Math.PI*(1+i/2);a1=a0+Math.PI/2;am=a0+Math.PI/4;d=`M0 0L${pt(a0)}A78 78 0 0 1 ${pt(a1)}Z`;
w+=`<path d='${d}' fill='${SF[sl[i]]}'/>`+at(r1(Math.cos(am)*46),r1(Math.sin(am)*46),motif(sl[i]));if(i===s.sel)sd=d;
bd+=at(r1(Math.cos(am)*98),r1(Math.sin(am)*98),`<circle r='10' fill='${i===s.sel?'#f2c14e':'#fff7e8'}' stroke='#8a5a3b'/>`+tx(0,4,11,i+1))}
var h=`<circle r='88' fill='#8a5a3b'/><circle r='85' fill='none' stroke='#a7754e' stroke-width='3' stroke-dasharray='14 6 4 6'/><circle r='80' fill='#5c3a24'/>`+w+`<path d='M-78 0H78M0-78V78' stroke='#6b4429' stroke-width='5'/><circle r='10' fill='#8a5a3b'/><path d='${sd}' fill='none' stroke='#f2c14e' stroke-width='4' stroke-linejoin='round'/><circle r='84' fill='none' stroke='${ok?'#f3c94f':'#c79a62'}' stroke-width='${ok?5:1.5}'/>`+bd;
var b=`<rect width='360' height='210' fill='#f3e9d8'/><path d='M0 12H360M0 198H360' stroke='#e6d6bb' stroke-width='12'/><path d='M22 40Q32 105 22 170M338 40Q328 105 338 170' stroke='#e2cfae' stroke-width='3' fill='none'/><g class='pg-detail'>${tx(42,96,15,'一窗')}${tx(42,118,15,'四季')}${tx(318,108,12,ok?'拼好了':'第'+(s.sel+1)+'扇')}</g>`+hero(180,105,h);
var cur=sl[s.sel],acts=[0,1,2,3].map(function(i){return {id:'slot'+(i+1),label:'第'+(i+1)+'扇·'+SN[sl[i]],pressed:i===s.sel}});
acts.push({id:'next',label:'换花：'+SN[(cur+1)%5]},{id:'help',label:'补缺的季节',disabled:ok});
return {svg:svg(b),actions:acts,status:ok?'四季花窗拼好了，窗框亮起金边。':'第'+(s.sel+1)+'扇现在是'+SN[cur]+'。还缺：'+m.map(function(i){return SN[i]}).join('、')+'。',done:ok,motion:s.last||'none'}}},
greenhouse:{title:'引水小渠',entry:'接通小水渠',hint:'从水壶出口（金圈）到花盆入口（金圈），转动A直管、B弯管、C弯管，每点一次转90度。接上的管道会变蓝；「提示一步」只帮你转一下。',
init:function(){return {rot:[0,0,0],last:'',tip:false}},
act:function(s,a){if(gflow(s.rot)===3)return s;var n=cp(s),i;
if(a in GM&&GM.hasOwnProperty(a)){i=GM[a];n.tip=false}
else if(a==='hint'){for(i=0;i<3&&gok(i,n.rot[i]);i++);n.tip=true}
else return s;
n.rot[i]=(n.rot[i]+1)%4;n.last=GP[i].n;return n},
view:function(s){var ro=s.rot,f=gflow(ro),done=f===3,li=s.last?'ABC'.indexOf(s.last):-1,i,p,pp='';
var b=`<rect width='360' height='210' fill='#e7f1e6'/><path d='M0 30L180 6L360 30M70 18V186M180 6V186M290 18V186' stroke='#fff' stroke-width='4' fill='none'/><rect y='186' width='360' height='24' fill='#b59a74'/><path d='M262 120H342M302 120V186' stroke='#8a6a48' stroke-width='5'/><path d='M280 118q-8-24 6-30q4 18-6 30M318 118q12-20 0-34q-10 16 0 34' fill='#7fb08a'/><path d='M20 62h40l-4 44H24z' fill='#7da3a8'/><path d='M26 62q14-26 28 0' stroke='#5f8488' stroke-width='5' fill='none'/><path d='M58 76L90 70' stroke='#7da3a8' stroke-width='8' stroke-linecap='round'/><path d='M28 86q6-4 12 0t12 0' stroke='#cfe6ea' stroke-width='2' fill='none'/>`+tx(40,124,11,'进水');
for(i=0;i<3;i++){p=GP[i];b+=`<rect x='${p.x-30}' y='${p.y-30}' width='60' height='60' rx='8' fill='#d8cbb0' stroke='#bfa984'/>`;pp+=(i===li&&!done?hero:at)(p.x,p.y,pipe(i,ro[i],i<f))+tx(p.x-20,p.y-16,11,p.n,'#7a5a3a')}
var wc=done?'#5fb7e6':'#4a3424';
b+=pp+`<path d='M160 142H134' stroke='#b8763e' stroke-width='13'/><path d='M160 142H134' stroke='${wc}' stroke-width='5'/><circle cx='90' cy='72' r='8' fill='none' stroke='#f2c14e' stroke-width='3'/><circle cx='160' cy='142' r='8' fill='none' stroke='#f2c14e' stroke-width='3'/><rect x='92' y='152' width='58' height='10' rx='3' fill='#d9824f'/><path d='M96 162h50l-7 24h-36z' fill='#c4683f'/><path d='M121 152V124' stroke='#4f8a57' stroke-width='3'/><path d='M121 142q-14-2-16-12q12 0 16 12' fill='#6aa86f'/>`+tx(244,176,11,'花盆在左下');
var fl=done?dots([[0,-9],[8,-4],[8,5],[0,9],[-8,5],[-8,-4]],7,'#f6a0b5')+`<circle r='4' fill='#f7d36b'/>`:`<path d='M0 6C-8 0-6-10 0-14C6-10 8 0 0 6Z' fill='#e48aa3'/><path d='M-4 5Q0-3 4 5' fill='#6aa86f'/>`;
b+=(li<0||done?hero:at)(121,118,fl);
if(done)b+=`<g class='pg-detail'>${dots([[100,72],[160,72],[195,100],[178,142],[134,150]],3,'#bfe6fb')}</g>`;
var st=done?'水路接通了，水珠沿铜管流进陶盆，花苞开花了。':(s.last?(s.tip?'提示：':'')+s.last+'管转到'+ro[li]*90+'度。':'三根管都在0度。')+'水已流过'+f+'段，下一段是'+GP[f].n+'管。';
return {svg:svg(b),actions:[{id:'rotA',label:'转A管（直）',disabled:done},{id:'rotB',label:'转B管（弯）',disabled:done},{id:'rotC',label:'转C管（弯）',disabled:done},{id:'hint',label:'提示一步',disabled:done}],status:st,done:done,motion:done?'pop':li>=0?'swing':'none'}}},
seaside:{title:'海豚跃环',entry:'陪海豚跳圈',hint:'看浪尖和光环的位置：三个环依次在高、低、中处。选对应的高跃、中跃或低跃；跳偏了只会溅点水，可以再选。',
init:function(){return {step:0,lit:[false,false,false],miss:'',last:'none'}},
act:function(s,a){if(['high','mid','low'].indexOf(a)<0||s.step>2)return s;var n=cp(s);
if(a===ORD[n.step]){n.lit[n.step]=true;n.step++;n.miss='';n.last='leap'}else{n.miss=a;n.last='swing'}return n},
view:function(s){var st=s.step,done=st>2,i,h,x,y,lt,cu,fm='';
var b=`<rect width='360' height='210' fill='#cfe8f3'/><circle cx='316' cy='34' r='15' fill='#ffd98a'/><path d='M28 44q8-14 22-6q10-10 20 2q10 0 8 8H28z' fill='#fff'/><path d='M150 30q6-6 12 0q6-6 12 0' stroke='#5a7a8a' stroke-width='2' fill='none'/><rect y='140' width='360' height='70' fill='#2f86b3'/>`;
for(i=0;i<12;i++)fm+='q15-5 30 0';b+=`<path d='M0 170${fm}M0 192${fm}' stroke='#8fd0ea' stroke-width='2' fill='none'/>`;
for(i=0;i<3;i++){h=ORD[i];x=WX[i];y=HY[h];lt=s.lit[i];cu=i===st;b+=`<path d='M${x-48} 150Q${x-18} 150 ${x} ${CR[h]}Q${x+18} 150 ${x+48} 150Z' fill='#4fa3cb' stroke='#e8f7ff' stroke-width='2'/><circle cx='${x}' cy='${y}' r='21' fill='none' stroke='${lt?'#ffcf4a':cu?'#fff':'#9fcde2'}' stroke-width='${lt?6:cu?4:2}'${lt||cu?'':` stroke-dasharray='4 4'`}/>`+tx(x,y-28,12,(i+1)+'·'+NM[h]+'环',cu?'#1d4f6e':'#4b7d98')}
var a,k=.75,sp='';
if(done){x=322;y=146;a=62;k=.8;sp=`<path d='M-34-2Q-17-24 0-4Q17-24 34-2' stroke='#fff' stroke-width='3' fill='none'/>`+dots([[-24,-20],[-8,-28],[10,-26],[26,-18]],3,'#e8f7ff')}
else if(s.miss){x=WX[st]-50;y=140;a=-6;sp=dots([[32,-10],[40,-17],[46,-8]],2.5,'#e8f7ff')}
else if(st){x=WX[st-1];y=HY[ORD[st-1]];a=-8}
else{x=46;y=136;a=-12;k=.8}
b+=hero(x,y,`<g transform='rotate(${a}) scale(${k})'>${dol()}</g>`+sp);
b+=`<g class='pg-detail'>${[0,1,2].map(function(j){return `<circle cx='${24+j*18}' cy='198' r='6' fill='${s.lit[j]?'#ffcf4a':'#9cc9de'}' stroke='#fff'/>`}).join('')}</g>`;
var nx=done?'':NM[ORD[st]],t=done?'三环全过！海豚翻身入水，溅起一圈水花。':s.miss?NM[s.miss]+'跃轻轻溅起水花，海豚回到原位。第'+(st+1)+'个环在'+nx+'处，再选一次就好。':'已过'+st+'环。第'+(st+1)+'个环在'+nx+'处，可以选「'+nx+'跃」。';
return {svg:svg(b),actions:[{id:'high',label:'高跃',disabled:done},{id:'mid',label:'中跃',disabled:done},{id:'low',label:'低跃',disabled:done}],status:t,done:done,motion:s.last||'none'}}}
});
})();
