(function(){var MB=window.MB=window.MB||{};MB.playScenes=MB.playScenes||{};
function cp(o){return JSON.parse(JSON.stringify(o))}
function el(t,o,b){var r='<'+t;for(var k in o)r+=' '+k+'="'+o[k]+'"';return r+(b==null?'/>':'>'+b+'</'+t+'>')}
function X(a,o){o=o||{};for(var k in o)a[k]=o[k];return a}
function C(x,y,r,f,o){return el('circle',X({cx:x,cy:y,r:r,fill:f},o))}
function E(x,y,a,b,f,o){return el('ellipse',X({cx:x,cy:y,rx:a,ry:b,fill:f},o))}
function P(d,f,o){return el('path',X({d:d,fill:f},o))}
function R(x,y,w,h,f,o){return el('rect',X({x:x,y:y,width:w,height:h,fill:f},o))}
function T(x,y,s,z,f){return el('text',{x:x,y:y,'font-size':z,fill:f,'text-anchor':'middle','font-weight':700},s)}
function G(x,y,b){return el('g',{transform:'translate('+x+' '+y+')'},b)}
function H(x,y,b){return G(x,y,el('g',{'class':'pg-hero'},b))}
function S(b){return el('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 360 210','aria-hidden':'true',focusable:'false'},b)}
function ST(c,w){return {stroke:c,'stroke-width':w,'stroke-linecap':'round'}}
var FC=['#f6b73c','#4fd1c5','#f58fb4'],FN=['琥珀','青色','粉色'],FS=['◆','●','▲'],LC=[1,2,0],LX=[70,180,290],HX=[110,180,250],HY=[46,32,50],TRL='M10 204Q100 184 180 194T350 198';
function bug(i,sel){return (sel?C(0,0,13,'none',X(ST('#fff',2),{'stroke-dasharray':'3 3'})):'')+C(0,0,9,FC[i],{opacity:.35})+C(0,0,4.5,FC[i])+T(0,-12,FS[i],10,FC[i])}
var AA=['兔','猫','熊'],AN=['兔子','猫咪','小熊'],HN=['长耳','尖耳','圆耳'],BN=['圆团','细长','胖墩'],TN=['绒球','长卷','短圆'],BB=[[[0,0,24],[-18,6,16],[18,6,16]],[[-28,4,13],[-9,1,15],[11,1,15],[30,4,13]],[[0,-2,28],[-22,8,18],[22,8,18],[0,14,20]]],HQ=[-34,-46,-40],TQ=[32,48,44];
function cname(s){return s.h===s.b&&s.b===s.t?AN[s.h]+'云':AA[s.h]+'头'+AA[s.b]+'身'+AA[s.t]+'尾云'}
function cloud(s){var w='#fff',bb=BB[s.b],tx=TQ[s.b],hx=HQ[s.b],i,o=E(0,26,44,6,'#7fb0d6',{opacity:.35});o+=[C(tx+4,-6,10,w)+C(tx+12,-15,6,w),P('M'+tx+' 0q24-4 20-24q-4-10-13-4','none',ST(w,8)),C(tx,2,8,w)][s.t];for(i=0;i<bb.length;i++)o+=C(bb[i][0],bb[i][1],bb[i][2],w);o+=[E(hx-6,-38,5,15,w)+E(hx+6,-40,5,15,w),P('M'+(hx-15)+' -20L'+(hx-11)+' -40L'+(hx-2)+' -28zM'+(hx+15)+' -20L'+(hx+11)+' -40L'+(hx+2)+' -28z',w),C(hx-12,-26,7,w)+C(hx+12,-26,7,w)][s.h];return o+C(hx,-12,16,w)+C(hx-7,-14,2,'#4a5a78')+C(hx+3,-14,2,'#4a5a78')+C(hx-10,-6,3,'#f7b7c6')}
var SQ=[2,4,3,5],BX=[60,120,180,240,300];
function bell(k,nx){return (nx?C(0,4,24,'#fff1b0',{opacity:.45}):'')+P('M0 -22V-10','none',ST('#c9a46a',2))+P('M-15 14q0-26 15-26t15 26z',nx?'#ffd45c':'#d9a441')+E(0,14,17,4,'#b9822f')+C(0,19,3.5,'#7a4b22')+T(0,36,k,12,'#fff3d6')}
function doll(d){return E(0,10,18,5,'#c9a46a')+P(d?'M-12 -38L0 -22L12 -38':'M-10 -18L0 -22L10 -18','none',ST('#f6d7c0',2))+P('M-2 -4V8M2 -4V8','none',ST('#f6d7c0',2))+P(d?'M-4 -24h8l16 18h-40z':'M-4 -24h8l8 20h-24z','#e98aa6')+C(0,-30,6,'#f6d7c0')+P('M-6 -32q6-8 12 0','#5a3a2e')+(d?C(-20,-40,2.5,'#ffe08a')+C(22,-34,2,'#ffe08a'):'')}
Object.assign(MB.playScenes,{
forest:{title:'萤火配灯',entry:'给蘑菇灯配萤火',hint:'先选一只萤火，再选同色、同符号的蘑菇灯。颜色相同的萤火住进同一盏灯。',
init:function(){return {sel:-1,lit:[-1,-1,-1],last:-1,miss:-1,mv:''}},
act:function(s,a){var m=/^([fl])([0-2])$/.exec(a);if(!m)return s;var n=cp(s),i=+m[2];n.miss=-1;n.last=-1;if(m[1]=='f'){if(s.lit.indexOf(i)>=0)return s;n.sel=s.sel===i?-1:i;n.mv='sel';return n}if(s.lit[i]>=0)return s;if(s.sel<0){n.mv='need';return n}if(LC[i]===s.sel){n.lit[i]=s.sel;n.last=i;n.mv='ok'}else{n.miss=s.sel;n.mv='miss'}n.sel=-1;return n},
view:function(s){var i,n=s.lit.filter(function(v){return v>=0}).length,dn=n>=3,tr='',hero='',mv=s.mv,hid=mv=='ok'?s.lit[s.last]:mv=='miss'?s.miss:mv=='sel'?s.sel:-1,a=[],b=R(0,0,360,210,'#18213d')+C(318,30,16,'#f4ecd0')+C(309,25,15,'#18213d')+C(40,24,1.5,'#fff')+C(150,16,1.2,'#fff')+C(226,22,1.5,'#fff')+P('M0 150L22 60L44 150zM300 150L322 70L346 150z','#22304a')+P('M118 140L134 78L150 140zM212 140L228 84L244 140z','#2a3a52')+P('M0 166Q90 150 180 160T360 158V210H0z','#1f2f22')+P(TRL,'none',ST('#46573a',6));
for(i=0;i<3;i++){var c=FC[LC[i]],x=LX[i],on=s.lit[i]>=0;if(on){b+=C(x,150,32,c,{opacity:.28});tr+=C(x-30,196,3.5,'#ffe08a')+C(x+30,195,3.5,'#ffe08a')}b+=P('M'+(x-8)+' 186q-3-18 1-30h14q4 12 1 30z','#efe2c8')+P('M'+(x-30)+' 158q30-46 60 0z',c,{opacity:on?1:.4})+C(x-12,146,3,'#fff',{opacity:.8})+C(x+10,140,2.5,'#fff',{opacity:.8})+T(x,178,FS[LC[i]],12,'#6b4a2e')}
for(i=0;i<3;i++){var li=s.lit.indexOf(i),px=li>=0?LX[li]:HX[i],py=li>=0?142:HY[i]-(s.sel===i?6:0),g=bug(i,s.sel===i);if(i===hid&&!dn)hero=H(px,py,g);else b+=G(px,py,g)}
if(dn)hero=H(0,0,P(TRL,'none',X(ST('#ffd877',3),{opacity:.85}))+tr);else{b+=tr;if(!hero)hero=H(0,0,'')}
for(i=0;i<3;i++)a.push({id:'f'+i,label:FS[i]+FN[i]+'萤火',pressed:s.sel===i,disabled:s.lit.indexOf(i)>=0});for(i=0;i<3;i++)a.push({id:'l'+i,label:FS[LC[i]]+FN[LC[i]]+'灯',disabled:s.lit[i]>=0});
var st=dn?'三盏蘑菇灯都亮了，林间小路被一段段照亮。':mv=='ok'?FN[s.lit[s.last]]+'萤火住进了同色的灯！还差'+(3-n)+'盏。':mv=='miss'?'颜色不一样，'+FN[s.miss]+'萤火飞回原处了，换一盏灯试试。':mv=='need'?'先选一只萤火，再选灯。':s.sel>=0?'已选'+FS[s.sel]+FN[s.sel]+'萤火，去找'+FS[s.sel]+'号同色蘑菇灯。':'选一只萤火，送它去同色的蘑菇灯。已亮'+n+'/3盏。';
return {svg:S(b+hero),actions:a,status:st,done:dn,motion:mv=='ok'?(dn?'draw':'leap'):mv=='miss'?'swing':mv=='sel'&&s.sel>=0?'pop':'none'}}},
clouds:{title:'捏朵云',entry:'捏一朵云',hint:'选头、身子和尾巴，捏成小动物，再点「放飞」。',
init:function(){return {h:0,b:0,t:0,up:false,fl:0,mv:''}},
act:function(s,a){var n=cp(s),k={head:'h',body:'b',tail:'t'}[a];if(k){n[k]=(n[k]+1)%3;n.up=false;n.mv='pop';return n}if(a=='fly'&&!s.up){n.up=true;n.fl++;n.mv='drift';return n}return s},
view:function(s){var b=R(0,0,360,210,'#a7d6f3')+R(0,118,360,92,'#cde9f5')+C(312,36,26,'#ffe08a',{opacity:.3})+C(312,36,18,'#ffe08a')+P('M0 150L60 104L110 136L170 92L240 140L300 108L360 140V210H0z','#93b9b0')+P('M0 178Q80 140 150 156T360 170V210H0z','#6f9e7f')+R(292,152,22,18,'#f2d2a9')+P('M287 154l16-14 16 14z','#c96f53')+P('M20 198Q120 178 220 192','none',X(ST('#8fbf8f',3),{opacity:.6}))+P('M60 40q6-6 12 0q6-6 12 0M100 56q5-5 10 0q5-5 10 0','none',ST('#5d7894',2))+(s.up?H(250,72,cloud(s)):H(112,116,cloud(s)));
if(s.up)b+=R(100,176,160,26,'#fff8e8',{rx:13,opacity:.92})+T(180,194,cname(s),13,'#7a4f3a');
return {svg:S(b),actions:[{id:'head',label:'换头·'+HN[s.h]},{id:'body',label:'换身子·'+BN[s.b]},{id:'tail',label:'换尾巴·'+TN[s.t]},{id:'fly',label:s.up?'已飘过山头':'放飞',disabled:s.up}],status:s.up?'「'+cname(s)+'」飘过了山头！换个部件可以再捏一朵。':'现在是'+HN[s.h]+'头、'+BN[s.b]+'身、'+TN[s.t]+'尾，组合名「'+cname(s)+'」，捏好就点「放飞」。',done:s.fl>0,motion:s.mv||'none'}}},
musicbox:{title:'铃铛旋律',entry:'跟着铃铛敲',hint:'按写好的顺序 2→4→3→5 敲铃，下一个要敲的铃会发光，提示一直显示。',
init:function(){return {p:0,hit:0,miss:false,mv:''}},
act:function(s,a){var m=/^b([1-5])$/.exec(a);if(!m)return s;var n=cp(s),k=+m[1];n.hit=k;if(n.p<4){if(SQ[n.p]===k){n.p++;n.miss=false;n.mv=n.p>=4?'done':'hit'}else{n.miss=true;n.mv='miss'}}else n.mv='free';return n},
view:function(s){var p=s.p,dn=p>=4,i,hero='',a=[],b=R(0,0,360,210,'#3a2846')+P('M30 14H330L318 88H42z','#6e3b33')+P('M44 22H316L306 82H54z','#f3dfc0')+P('M236 70q12-22 24 0q12-22 24 0q12-22 24 0','none',ST('#e2b9a0',2))+R(26,92,308,5,'#c9a46a',{rx:2})+R(22,140,316,56,'#9c5a44',{rx:6})+R(30,148,300,40,'none',X(ST('#e7c27a',2),{rx:4}))+R(14,194,332,10,'#6e3b33',{rx:4});
for(i=0;i<4;i++){var x=80+44*i;b+=C(x,50,14,i<p?'#e7b84f':i===p?'#fff':'#ead2b4',ST(i===p?'#d9822f':'#b9822f',i===p?3:1.5))+T(x,55,SQ[i],14,'#6b3a24');if(i<3)b+=T(x+22,55,'→',12,'#b9822f')}
for(i=1;i<=5;i++){var g=bell(i,!dn&&SQ[p]===i);if(s.mv&&s.mv!='done'&&s.hit===i)hero=H(BX[i-1],114,g);else b+=G(BX[i-1],114,g);a.push({id:'b'+i,label:'铃'+i})}
var dg=doll(dn);if(hero)b+=G(268,78,dg);else hero=H(268,78,dg);
var st=dn?'旋律 2→4→3→5 完成，小人偶轻轻起舞！可以随意再敲，或重置重来。':(s.miss?'铃'+s.hit+'不是这一下，进度保留。':s.mv=='hit'?'敲中铃'+s.hit+'！':'')+'下一下：铃'+SQ[p]+'（第'+(p+1)+'/4下，旋律 2→4→3→5）';
return {svg:S(b+hero),actions:a,status:st,done:dn,motion:s.mv=='done'?'pop':s.mv?'swing':'none'}}}
});})();