(function(){
var MB=window.MB=window.MB||{};MB.playScenes=MB.playScenes||{};
function cp(o){return JSON.parse(JSON.stringify(o));}
function wrap(b){return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 210' aria-hidden='true' focusable='false'>${b}</svg>`;}
function tx(x,y,s,t,c,a){return `<text x='${x}' y='${y}' font-size='${s}' fill='${c||'#5a4636'}' text-anchor='${a||'start'}'>${t}</text>`;}
function star(cx,cy,R1,R2){var p=[],i,a,d;for(i=0;i<10;i++){a=Math.PI*i/5-Math.PI/2;d=i%2?R2:R1;p.push((cx+d*Math.cos(a)).toFixed(1)+','+(cy+d*Math.sin(a)).toFixed(1));}return p.join(' ');}
var CR=[['香草白','#fff7e8','#e6d2ae'],['草莓粉','#f9c9d2','#e39cae'],['抹茶绿','#d3e6b8','#a3c27f']];
var PI=['贝壳边','珍珠边','波浪边'],TO=['草莓','小花','星星'];
var BEADS=[[150,86,'#f28fb0'],[182,81,'#f6d35b'],[222,88,'#8cc7e8'],[252,82,'#b8a1e3'],[108,168,'#f6a75b'],[282,166,'#9bd18b']];
function cakeView(s){
var c=CR[s.cream]||CR[0],h='',i,x,a;
var b=`<rect width='360' height='210' fill='#fbeee4'/><path d='M0 34 Q60 22 120 36 T240 30 T360 38' stroke='#f4d9c8' stroke-width='16' fill='none'/><path d='M0 150 Q90 140 180 150 T360 147 V210 H0Z' fill='#e6c8b0'/><path d='M0 188 Q120 180 240 190 T360 186' stroke='#d8b497' stroke-width='3' fill='none'/>`;
var d=`<g class='pg-detail'>${tx(14,26,12,'奶油 · '+c[0])}${tx(14,44,12,'裱花 · '+PI[s.pipe])}${tx(14,62,12,'顶饰 · '+TO[s.top])}${s.done?tx(14,84,12,'✓ 完成','#b0506a'):''}</g>`;
h+=`<ellipse cx='190' cy='166' rx='112' ry='20' fill='#fff' stroke='#d6c4b4'/><ellipse cx='190' cy='166' rx='98' ry='16' fill='none' stroke='#8fb3d9' stroke-width='2' stroke-dasharray='3 5'/><ellipse cx='190' cy='164' rx='80' ry='11' fill='#f7f0e9'/>`;
h+=`<polygon points='235,98 272,78 272,140 235,160' fill='${c[2]}'/><polygon points='125,98 235,98 272,78 166,78' fill='${c[1]}'/><rect x='125' y='98' width='110' height='62' fill='#f2d39a'/><rect x='125' y='116' width='110' height='6' fill='${c[1]}'/><rect x='125' y='138' width='110' height='6' fill='${c[1]}'/><path d='M140 108h2M172 130h2M206 152h2M196 108h2M150 152h2' stroke='#d6ae6e' stroke-width='2' stroke-linecap='round'/><rect x='123' y='94' width='114' height='7' rx='3' fill='${c[1]}' stroke='${c[2]}'/>`;
if(s.pipe===2){var w='M126 96';for(i=0;i<9;i++)w+=' q6 -8 12 0';h+=`<path d='${w}' stroke='${c[2]}' stroke-width='4' fill='none' stroke-linecap='round'/>`;}
else for(i=0;i<6;i++){x=Math.round(134+i*18.4);h+=s.pipe?`<circle cx='${x}' cy='94' r='5' fill='#fffdf5' stroke='${c[2]}' stroke-width='1.5'/>`:`<path d='M${x-8} 98 Q${x} 82 ${x+8} 98Z' fill='${c[1]}' stroke='${c[2]}' stroke-width='1.5'/>`;}
if(s.top===0)h+=`<path d='M188 64 Q200 50 212 64 Q208 84 200 88 Q192 84 188 64Z' fill='#e2475a'/><path d='M192 60 L200 52 L208 60 L200 57Z' fill='#5c9c4a'/><path d='M196 68h1M204 70h1M200 78h1' stroke='#f9e08a' stroke-width='2' stroke-linecap='round'/>`;
else if(s.top===1){for(i=0;i<5;i++){a=i*1.2566-1.5708;h+=`<circle cx='${(200+8*Math.cos(a)).toFixed(1)}' cy='${(68+8*Math.sin(a)).toFixed(1)}' r='6' fill='#f5a3b8' stroke='#e07d98'/>`;}h+=`<circle cx='200' cy='68' r='4.5' fill='#f6d35b'/>`;}
else h+=`<polygon points='${star(200,66,14,6)}' fill='#f4c84a' stroke='#c99228' stroke-width='1.5'/>`;
if(s.done)for(i=0;i<6;i++)h+=`<circle cx='${BEADS[i][0]}' cy='${BEADS[i][1]}' r='3.2' fill='${BEADS[i][2]}' stroke='#fff' stroke-width='1'/>`;
return wrap(b+`<g class='pg-hero'>${h}</g>`+d);}
var R={r:['红','#e85b5b'],y:['黄','#f4cf3f'],b:['蓝','#4f8fd8']};
var T=[['ry','橙','#f39a3d',1,'红+黄'],['by','绿','#6cbf6a',3,'黄+蓝'],['br','紫','#a46cc8',6,'红+蓝']];
var BC=['#e85b5b','#f39a3d','#f4cf3f','#6cbf6a','#4f8fd8','#5b5fb8','#a46cc8'];
function names(cup){var o=[],i;for(i=0;i<cup.length;i++)o.push(R[cup[i]]?R[cup[i]][0]:'');return o;}
function findT(k){for(var j=0;j<3;j++)if(T[j][0]===k)return j;return -1;}
function cloud(x,y){return `<path d='M${x-38} ${y+14} a12 12 0 0 1 6-22 a16 16 0 0 1 28-8 a15 15 0 0 1 28 6 a11 11 0 0 1 4 24Z' fill='#fff' stroke='#d4e0ea' stroke-width='1.5'/>`;}
function allF(s){return !!(s.filled[0]&&s.filled[1]&&s.filled[2]);}
function rainView(s){
var h='',d='',k,m,j,r,st,n=s.cup.length,done=allF(s);
var b=`<rect width='360' height='210' fill='#e6f0f7'/><path d='M0 60 Q90 50 180 62 T360 56' stroke='#f0f6fa' stroke-width='18' fill='none'/><path d='M0 170 Q90 150 180 168 T360 162 V210 H0Z' fill='#cfe4d2'/>`;
for(k=0;k<7;k++){m=-1;for(j=0;j<3;j++)if(T[j][3]===k)m=j;r=118-k*9;st=(m>=0&&!s.filled[m])?`stroke='#cdd5de' stroke-width='6' stroke-dasharray='3 4'`:`stroke='${BC[k]}' stroke-width='8'`;h+=`<path d='M${180-r} 150 A${r} ${r} 0 0 1 ${180+r} 150' fill='none' ${st}/>`;}
h+=cloud(92,146)+cloud(278,146);
h+=`<ellipse cx='180' cy='176' rx='34' ry='5' fill='#dfe8ef'/><path d='M154 116 L206 116 L199 172 Q180 178 161 172Z' fill='#fff' fill-opacity='.75' stroke='#7f97ad' stroke-width='2'/>`;
if(n){var y=n>1?128:148,lx=(154+(y-116)*7/56).toFixed(1),col=R[s.cup[0]][1];if(n>1){var t=findT(s.cup.slice().sort().join(''));if(t>=0)col=T[t][2];}h+=`<path d='M${lx} ${y} L${(360-lx).toFixed(1)} ${y} L199 172 Q180 178 161 172Z' fill='${col}'/>`+tx(180,164,11,names(s.cup).join('+'),'#33475b','middle');}
if(done)h+=`<path d='M180 14 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3Z M132 40 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2Z M228 40 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2Z' fill='#f4c84a'/>`;
d+=`<path d='M66 166 l-3 8 M86 168 l-3 8 M286 166 l-3 8 M306 168 l-3 8' stroke='#9cc0dc' stroke-width='2' stroke-linecap='round'/>`;
for(j=0;j<3;j++){d+=`<circle cx='14' cy='${18+j*17}' r='5' fill='${s.filled[j]?T[j][2]:'#fff'}' stroke='${T[j][2]}' stroke-width='2'/>`+tx(24,22+j*17,11,T[j][1]+' = '+T[j][4]+(s.filled[j]?'  ✓已补':'  ○待补'),'#40546a');}
if(done)d+=tx(180,200,12,'彩虹弯过云层啦','#4a5f78','middle');
return wrap(b+`<g class='pg-hero'>${h}</g><g class='pg-detail'>${d}</g>`);}
Object.assign(MB.playScenes,{
cake:{title:'裱花蛋糕',entry:'装饰一块蛋糕',hint:'依次点按钮换奶油、裱花和顶饰，每样都有3种，满意后按「完成」。',
init:function(){return {cream:0,pipe:0,top:0,done:false,last:''};},
act:function(s,a){var n=cp(s);if(a==='cream'||a==='pipe'||a==='top'){n[a]=((s[a]|0)+1)%3;n.done=false;n.last=a;return n;}if(a==='finish'){if(s.done)return s;n.done=true;n.last='finish';return n;}return s;},
view:function(s){var nm=CR[s.cream][0]+'奶油、'+PI[s.pipe]+'裱花、'+TO[s.top]+'顶饰';
var st=s.done?'完成！'+nm+'，小盘轻轻晃动，6粒糖珠点缀在周围。还可以换装饰再做一块。':(s.last?'换好了：'+nm+'。满意就按「完成」。':'现在是'+nm+'。点按钮换装饰，满意就按「完成」。');
return {svg:cakeView(s),actions:[{id:'cream',label:'换奶油（'+CR[s.cream][0]+'）'},{id:'pipe',label:'换裱花（'+PI[s.pipe]+'）'},{id:'top',label:'换顶饰（'+TO[s.top]+'）'},{id:'finish',label:'完成',disabled:!!s.done}],status:st,done:!!s.done,motion:s.last==='finish'?'swing':(s.last?'pop':'none')};}},
rain:{title:'雨滴调色',entry:'调出一弯彩虹',hint:'两滴不同原色混出橙、绿、紫：放两滴进调色杯，再按「倒入彩虹」补上缺的色带。',
init:function(){return {cup:[],filled:[false,false,false],msg:'',last:''};},
act:function(s,a){var n=cp(s),j;
if(R[a]){if(s.cup.length>=2){n.msg='杯子最多放两滴，先倒入彩虹或清空杯';n.last='full';}else{n.cup.push(a);n.msg='加入一滴'+R[a][0]+'色';n.last='drop';}return n;}
if(a==='clear'){if(!s.cup.length){n.msg='杯子本来就是空的';n.last='none';}else{n.cup=[];n.msg='调色杯清空了';n.last='clear';}return n;}
if(a==='pour'){if(s.cup.length<2){n.msg=s.cup.length?'还差一滴，两种不同原色才能混色':'杯子是空的，先加两滴原色';n.last=s.cup.length?'shake':'none';return n;}
j=findT(s.cup.slice().sort().join(''));
if(j<0){n.msg='两滴都是'+R[s.cup[0]][0]+'色，混不出新颜色；原色留在杯里，可清空再试';n.last='shake';return n;}
if(s.filled[j]){n.msg=T[j][1]+'色带已经补好了，换一种组合试试';n.last='none';return n;}
n.filled[j]=true;n.cup=[];n.msg=T[j][1]+'色带补上了';n.last='pour';if(allF(n))n.msg+='，彩虹完整地弯过云层';return n;}
return s;},
view:function(s){var c=0,j;for(j=0;j<3;j++)if(s.filled[j])c++;var done=c===3;
var st=(s.msg?s.msg+'。':'选两滴不同原色放进杯里，再倒入彩虹。')+(s.cup.length?'杯中：'+names(s.cup).join('、'):'杯子空着')+'；已补色带 '+c+'/3。'+(done?'彩虹完成啦！':'');
var mo={drop:'rain',pour:'draw',shake:'swing'}[s.last]||'none';
return {svg:rainView(s),actions:[{id:'r',label:'红滴'},{id:'y',label:'黄滴'},{id:'b',label:'蓝滴'},{id:'pour',label:'倒入彩虹'},{id:'clear',label:'清空杯'}],status:st,done:done,motion:mo};}}
});
})();
