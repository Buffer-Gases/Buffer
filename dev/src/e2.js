/* ================= INTERACTIVE WIDGETS ================= */
const $=id=>document.getElementById(id);
const tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';
let UID=0;const uid=()=>'w'+(++UID);
const RM=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function fitCanvas(cv,h){const dpr=Math.min(2,window.devicePixelRatio||1);const w=cv.parentElement.clientWidth||600;cv.style.width=w+'px';cv.style.height=h+'px';cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return {x,w,h};}
function rng(id,lab,min,max,step,val,fmt){return '<div class="ctrl"><label for="'+id+'"><span>'+lab+'</span><output id="'+id+'o"></output></label><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"'+(fmt?' data-fmt="'+fmt+'"':'')+'></div>';}
function num(id,lab,val,step,unit){return '<div class="ctrl"><label for="'+id+'"><span>'+lab+'</span>'+(unit?'<span>'+unit+'</span>':'')+'</label><input type="number" inputmode="decimal" id="'+id+'" value="'+(val==null?'':val)+'" step="'+(step||'any')+'"></div>';}
const W={};
/* 5.0: one registry for redraws (resize and theme change) and one for 'buffer:show', swept of detached widgets so nothing leaks */
const E2RZ=new Set(),E2SHOW=new Set();let E2TV=0,e2rzRaf=0,e2thRaf=0;
function e2Sweep(){[E2RZ,E2SHOW].forEach(s=>s.forEach(r=>{if(!r.el.isConnected)s.delete(r);}));}
function e2Fire(){e2Sweep();E2RZ.forEach(r=>{try{r.fn();}catch(e){console.error(e);}});}
function onRz(el,fn){e2Sweep();E2RZ.add({el,fn});}
function e2OnShow(el,fn){e2Sweep();E2SHOW.add({el,fn});}
addEventListener('resize',()=>{cancelAnimationFrame(e2rzRaf);e2rzRaf=requestAnimationFrame(e2Fire);});
addEventListener('buffer:show',()=>{e2Sweep();E2SHOW.forEach(r=>{try{r.fn();}catch(e){console.error(e);}});});
function e2Theme(){E2TV++;cancelAnimationFrame(e2thRaf);e2thRaf=requestAnimationFrame(()=>{dispatchEvent(new Event('buffer:theme'));e2Fire();});}
try{new MutationObserver(e2Theme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-skin','class','style']});}catch(e){}
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e2Theme);}catch(e){}
/* 5.0: pressure units follow Settings (mmHg or kPa); values are kept in mmHg inside the models */
const e2K=()=>S.units==='kPa';
const e2Pd=mm=>e2K()?r2(mm/KPA):Math.round(mm);
function e2prng(id,lab,lo,hi,stepMm,val){const k=e2K();return rng(id,lab+' ('+PU()+')',k?r1(lo/KPA):lo,k?r1(hi/KPA):hi,k?0.1:stepMm,k?r1(val/KPA):val);}
function e2pnum(id,lab,val){return num(id,lab,val==null?null:e2Pd(val),e2K()?0.1:1,PU());}
const e2pv=id=>{const e=$(id);if(!e||e.value===''||isNaN(+e.value))return null;return e2K()?+e.value*KPA:+e.value;};
const e2rv=id=>{const v=+$(id).value;return e2K()?v*KPA:v;};
const e2set=(id,mm)=>{$(id).value=e2K()?r1(mm/KPA):mm;};
const e2PP=mm=>P(mm)+' '+PU();

/* pH ↔ [H+] */
W.phh={t:'pH and [H⁺] on a log scale',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+rng(u+'p','pH',6.8,7.8,0.01,7.4)+'</div><canvas id="'+u+'c" role="img" aria-label="Hydrogen ion concentration bar"></canvas><div class="readout"><div class="ro"><small>[H⁺] true</small><b id="'+u+'h"></b></div><div class="ro"><small>80 rule</small><b id="'+u+'r"></b></div><div class="ro"><small>State</small><b id="'+u+'s" style="font-size:16px"></b></div></div></div>';
 const draw=()=>{const ph=+$(u+'p').value;$(u+'po').textContent=ph.toFixed(2);const H=Math.pow(10,9-ph);$(u+'h').textContent=H.toFixed(0)+' nmol/L';const ok=ph>=7.2&&ph<=7.5;$(u+'r').textContent=ok?(80-Math.round((ph-7)*100))+' nmol/L':'outside 7.20–7.50';
  $(u+'s').textContent=ph<7.35?'Acidaemia':ph>7.45?'Alkalaemia':'Normal';
  const cv=$(u+'c');cv.setAttribute('aria-label','[H⁺] bar: pH '+ph.toFixed(2)+' is '+H.toFixed(0)+' nmol/L; normal 35 to 45');
  const {x,w,h}=fitCanvas(cv,90);x.clearRect(0,0,w,h);const L=16,R=w-16,sc=v=>L+(R-L)*v/160,T=32;
  x.fillStyle=tok('--surface-2');x.fillRect(L,T,R-L,20);
  x.fillStyle=tok('--accent');x.fillRect(L,T,sc(Math.min(160,H))-L,20);
  x.fillStyle=tok('--muted');x.font='500 11px '+tok('--f-mono');x.textAlign='center';
  [[7.7,20],[7.4,40],[7.1,80],[6.8,160]].forEach(([p,v])=>{const X=sc(v);x.fillRect(X-0.5,T,1,24);x.fillText(p.toFixed(1),X,12);x.fillText(v,X,T+34);});
  x.textAlign='left';x.fillText('nmol/L →',L,h-4);
  /* normal 35–45 nmol/L drawn on top as a bracket, so it shows at any pH and in dark mode */
  const a=sc(35.5),b=sc(44.7);x.strokeStyle=tok('--good');x.lineWidth=2;x.beginPath();x.moveTo(a,T-2);x.lineTo(a,T-8);x.lineTo(b,T-8);x.lineTo(b,T-2);x.stroke();
  x.fillStyle=tok('--good');x.font='600 10px '+tok('--f-mono');x.fillText('normal 35–45',b+5,T-4);};
 el.querySelector('input').addEventListener('input',draw);draw();onRz(el,draw);}};

/* Henderson–Hasselbalch seesaw */
W.hh={t:'Henderson–Hasselbalch seesaw',build(el,opt){const u=uid();let hide=false,pf=false;
 const PR=[['Normal',40,24],['DKA',18,6],['Vomiting',50,40],['Opioid',75,27],['COPD',62,33],['Panic',25,21]];
 el.innerHTML='<div class="wbox"><div class="btnrow presets">'+PR.map(p=>'<button class="tool" data-p="'+p[1]+','+p[2]+'">'+p[0]+'</button>').join('')+'<button class="tool" id="'+u+'pf" aria-pressed="false">Predict first</button></div><div class="btnrow" id="'+u+'g" hidden><span class="muted" style="align-self:center">Which way will it tip?</span>'+[['a','Acid side'],['n','Balanced'],['b','Alkali side']].map(g=>'<button class="tool" data-g="'+g[0]+'">'+g[1]+'</button>').join('')+'</div><p class="note" id="'+u+'gf" aria-live="polite" style="margin:0"></p><div class="ctrls">'+e2prng(u+'c','PCO₂',10,120,1,40)+rng(u+'h','HCO₃⁻ (mmol/L)',3,50,0.5,24)+'</div><canvas id="'+u+'v" role="img" aria-label="Seesaw showing the bicarbonate to CO2 ratio"></canvas><div class="readout"><div class="ro"><small>pH</small><b id="'+u+'ph"></b></div><div class="ro"><small>Ratio</small><b id="'+u+'ra"></b></div><div class="ro"><small>[H⁺]</small><b id="'+u+'H"></b></div><div class="ro wide"><small>Reading</small><b id="'+u+'l" aria-live="polite" style="font-size:14px;font-family:var(--f-body)"></b></div></div></div>';
 const state=(hc,p)=>{const ph=phFrom(hc,p);return {ph,st:ph<7.35?'a':ph>7.45?'b':'n'};};
 const draw=()=>{const p=e2rv(u+'c'),hc=+$(u+'h').value;$(u+'co').textContent=e2K()?e2PP(p):Math.round(p)+' ('+(p/KPA).toFixed(1)+' kPa)';$(u+'ho').textContent=hc+' mmol/L';
  const {ph,st}=state(hc,p),ratio=hc/(0.03*p);$(u+'ph').textContent=hide?'?':ph.toFixed(2);$(u+'ra').textContent=hide?'?':ratio.toFixed(1)+' : 1';$(u+'H').textContent=hide?'?':Math.round(24*p/hc)+' nmol/L';
  const o=interp({pH:r2(ph),pco2:p,hco3:hc});$(u+'l').textContent=hide?'Make your prediction first.':o.err?'Outside the range the app interprets.':o.label;
  const cv=$(u+'v'),side=st==='a'?'tips to acid':st==='b'?'tips to alkali':'balanced';
  cv.setAttribute('aria-label',hide?'Seesaw held level until you predict':'Seesaw: HCO₃⁻ '+hc+' against 0.03 × PCO₂ × 20 = '+r1(0.6*p)+'. Ratio '+ratio.toFixed(1)+' to 1, pH '+ph.toFixed(2)+', '+side+'.');
  /* taller canvas, lower pivot and a capped tilt so the raised ball stays inside the canvas */
  const {x,w,h}=fitCanvas(cv,260);x.clearRect(0,0,w,h);const cx=w/2,cy=165;
  const ang=hide?0:Math.max(-0.28,Math.min(0.28,Math.log10(ratio/20)*0.9));
  x.fillStyle=tok('--line');x.beginPath();x.moveTo(cx,cy);x.lineTo(cx-20,cy+52);x.lineTo(cx+20,cy+52);x.closePath();x.fill();
  const L=Math.min(220,w*0.38);x.save();x.translate(cx,cy);x.rotate(-ang);x.strokeStyle=tok('--fg');x.lineWidth=4;x.beginPath();x.moveTo(-L,0);x.lineTo(L,0);x.stroke();
  /* shared scale: 24 is mid-sized, 40 against 30 looks different; the value is printed inside the ball */
  const pan=(sx,val,col)=>{const r=Math.max(12,Math.min(40,14+26*val/50));x.save();x.translate(sx,0);x.rotate(ang);x.fillStyle=col;x.beginPath();x.arc(0,-r-2,r,0,Math.PI*2);x.fill();x.fillStyle='#fff';x.font='700 12px '+tok('--f-mono');x.textAlign='center';x.fillText(hide?'?':String(r1(val)),0,-r+2);x.restore();};
  pan(-L+20,hc,tok('--b-base'));pan(L-20,0.6*p,tok('--b-acid'));x.restore();
  x.font='600 11px '+tok('--f-mono');x.fillStyle=tok('--muted');x.textAlign='left';x.fillText('KIDNEY · HCO₃⁻',8,h-8);x.textAlign='right';x.fillText('LUNGS · 0.03×PCO₂ ×20',w-8,h-8);
  x.textAlign='center';x.fillStyle=hide?tok('--muted'):st==='a'?tok('--bad'):st==='b'?tok('--accent-ink'):tok('--good');x.font='700 13px '+tok('--f-mono');x.fillText(hide?'predict the tilt':side,cx,16);};
 const reveal=g=>{hide=false;$(u+'g').hidden=true;if(g){const {ph,st}=state(+$(u+'h').value,e2rv(u+'c'));$(u+'gf').textContent=(g===st?'Right. ':'Not quite. ')+'pH '+ph.toFixed(2)+(st==='a'?': it tips to the acid side.':st==='b'?': it tips to the alkali side.':': it stays balanced.');}else $(u+'gf').textContent='';draw();};
 const setP=b=>{const [p,hc]=b.dataset.p.split(',');e2set(u+'c',+p);$(u+'h').value=hc;if(pf){hide=true;$(u+'g').hidden=false;$(u+'gf').textContent='';}draw();};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{if(hide)reveal();else draw();}));
 el.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>setP(b)));
 el.querySelectorAll('[data-g]').forEach(b=>b.addEventListener('click',()=>reveal(b.dataset.g)));
 $(u+'pf').addEventListener('click',()=>{pf=!pf;$(u+'pf').setAttribute('aria-pressed',String(pf));$(u+'gf').textContent=pf?'Pick a preset, then predict the tilt before it is shown.':'';if(!pf&&hide)reveal();});
 draw();onRz(el,draw);
 if(opt&&opt.preset){const b=[...el.querySelectorAll('[data-p]')].find(b=>b.textContent===opt.preset);if(b)setP(b);}}};

/* Davenport-style acid–base map */
function bandPoly(fn,from,to,steps){const up=[],lo=[];for(let i=0;i<=steps;i++){const t=from+(to-from)*i/steps;const b=fn(t);up.push(b[0]);lo.push(b[1]);}return up.concat(lo.reverse());}
/* Each band: the rule's expected value ± its usual margin. in(h,p) says whether a gas lies in the band; lab is the label at the band's midline. */
const e2lab=(h,p)=>[phFrom(h,p),h];
const MAPB=[
 {n:'Met acidosis',c:'--b1',poly:()=>bandPoly(h=>{const e=1.5*h+8;return [[phFrom(h,Math.max(8,e-2)),h],[phFrom(h,e+2),h]];},3,24,30),in:(h,p)=>h>=3&&h<=24&&Math.abs(p-(1.5*h+8))<=2,lab:e2lab(8,20)},
 {n:'Met alkalosis',c:'--b2',poly:()=>bandPoly(h=>{const e=Math.min(60,0.7*h+20);return [[phFrom(h,e-5),h],[phFrom(h,e+5),h]];},24,48,30),in:(h,p)=>h>=24&&h<=48&&Math.abs(p-Math.min(60,0.7*h+20))<=5,lab:e2lab(38,46.6)},
 {n:'Acute resp acidosis',c:'--b3',poly:()=>bandPoly(p=>{const e=24+(p-40)/10;return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},40,110,30),in:(h,p)=>p>=40&&p<=110&&Math.abs(h-(24+(p-40)/10))<=2,lab:e2lab(28,80)},
 {n:'Chronic resp acidosis',c:'--b4',poly:()=>bandPoly(p=>{const e=24+4*(p-40)/10;return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},40,85,30),in:(h,p)=>p>=40&&p<=85&&Math.abs(h-(24+4*(p-40)/10))<=2,lab:e2lab(37,72)},
 {n:'Acute resp alkalosis',c:'--b5',poly:()=>bandPoly(p=>{const e=24-2*(40-p)/10;return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},15,40,30),in:(h,p)=>p>=15&&p<=40&&Math.abs(h-(24-2*(40-p)/10))<=2,lab:e2lab(20.4,22)},
 {n:'Chronic resp alkalosis',c:'--b6',poly:()=>bandPoly(p=>{const e=Math.max(12,24-5*(40-p)/10);return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},18,40,30),in:(h,p)=>p>=18&&p<=40&&Math.abs(h-Math.max(12,24-5*(40-p)/10))<=2,lab:e2lab(16.5,25)}];
/* names of the bands (and the normal box) that a gas lies in */
function e2bands(ph,h){const p=h/(0.03*Math.pow(10,ph-6.1));if(ph>=7.35&&ph<=7.45&&h>=22&&h<=26)return ['Normal'];return MAPB.filter(b=>b.in(h,p)).map(b=>b.n);}
function drawMap(cv,pts,hgt){const {x,w,h}=fitCanvas(cv,hgt||340);x.clearRect(0,0,w,h);
 const ml=40,mr=12,mt=12,mb=34,X0=6.95,X1=7.75,Y1=50;const sx=v=>ml+(w-ml-mr)*(v-X0)/(X1-X0),sy=v=>mt+(h-mt-mb)*(1-v/Y1);
 x.save();x.beginPath();x.rect(ml,mt,w-ml-mr,h-mt-mb);x.clip();
 MAPB.forEach(b=>{const pp=b.poly();x.fillStyle=tok(b.c);x.globalAlpha=.32;x.beginPath();pp.forEach((p,i)=>i?x.lineTo(sx(p[0]),sy(p[1])):x.moveTo(sx(p[0]),sy(p[1])));x.closePath();x.fill();x.globalAlpha=1;});
 x.strokeStyle=tok('--line');x.lineWidth=1;x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');
 /* on a phone the 100 line's label crowds the 80 one, so it is skipped */
 [15,20,30,40,60,80,100].forEach(p=>{x.beginPath();let first=true;for(let ph=X0;ph<=X1;ph+=0.01){const hc=hFrom(ph,p);if(hc>Y1)break;const X=sx(ph),Y=sy(hc);first?x.moveTo(X,Y):x.lineTo(X,Y);first=false;}x.setLineDash(p===40?[]:[3,3]);x.strokeStyle=p===40?tok('--muted'):tok('--line');x.stroke();x.setLineDash([]);
   if(w<560&&p===100)return;let ph=X1;let hc=hFrom(ph,p);if(hc>Y1-2){ph=6.1+Math.log10((Y1-3)/(0.03*p));hc=Y1-3;}x.fillText(S.units==='kPa'?(p/KPA).toFixed(1):p,sx(ph)-22,sy(hc)-3);});
 /* normal box: outlined on top of the bands so it shows in dark mode */
 x.strokeStyle=tok('--good');x.lineWidth=1.5;x.strokeRect(sx(7.35),sy(26),sx(7.45)-sx(7.35),sy(22)-sy(26));x.fillStyle=tok('--good');x.font='600 9px '+tok('--f-mono');x.textAlign='center';x.fillText('normal',(sx(7.35)+sx(7.45))/2,sy(22)+10);
 if(w>=560)MAPB.forEach(b=>{x.fillStyle=tok('--fg');x.globalAlpha=.75;x.font='600 10px '+tok('--f-body');x.textAlign='center';x.fillText(b.n,sx(b.lab[0]),sy(b.lab[1])+3);x.globalAlpha=1;});
 /* a gas off the plotted range is pinned to the edge as a hollow ring with 'off map' */
 (pts||[]).forEach(p=>{const cph=Math.max(X0+0.008,Math.min(X1-0.008,p.ph)),ch=Math.max(0.8,Math.min(Y1-0.8,p.h)),off=cph!==p.ph||ch!==p.h;const X=sx(cph),Y=sy(ch);
   x.lineWidth=2.5;x.beginPath();x.arc(X,Y,7,0,Math.PI*2);if(off){x.strokeStyle=tok('--accent');x.stroke();}else{x.fillStyle=tok('--accent');x.strokeStyle=tok('--surface');x.fill();x.stroke();}
   const lab=(p.l||'')+(off?(p.l?' ':'')+'(off map)':'');if(lab){x.fillStyle=tok('--fg');x.font='700 11px '+tok('--f-mono');const tw=x.measureText(lab).width,right=X+10+tw>w-mr;x.textAlign=right?'right':'left';x.fillText(lab,right?X-10:X+10,Y<mt+16?Y+18:Y-8);}});
 x.restore();
 x.strokeStyle=tok('--line');x.lineWidth=1;x.strokeRect(ml,mt,w-ml-mr,h-mt-mb);x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='center';
 for(let ph=7.0;ph<=7.71;ph+=0.1)x.fillText(ph.toFixed(1),sx(ph),h-mb+14);x.fillText('pH',(ml+w-mr)/2,h-4);
 x.textAlign='right';for(let v=0;v<=50;v+=10)x.fillText(v,ml-6,sy(v)+3);x.save();x.translate(11,(mt+h-mb)/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('HCO₃⁻ mmol/L',0,0);x.restore();
 x.textAlign='left';x.fillText('lines: PCO₂ '+PU(),ml,h-4);
 /* legend under the canvas on narrow screens; created once, shown or hidden on every draw */
 let lg=cv._e2lg;if(!lg||!lg.isConnected){lg=document.createElement('div');lg.className='mlegend';lg.innerHTML='<span><i style="background:transparent;outline:1.5px solid var(--good);opacity:1"></i>Normal</span>'+MAPB.map(b=>'<span><i style="background:var('+b.c+')"></i>'+b.n+'</span>').join('');cv.after(lg);cv._e2lg=lg;}lg.style.display=w<560?'':'none';
 if(!cv.hasAttribute('role'))cv.setAttribute('role','img');
 const p0=(pts||[])[0];if(p0){const bs=e2bands(p0.ph,p0.h);cv.setAttribute('aria-label','Acid–base map: '+(p0.l&&p0.l!==p0.ph.toFixed(2)?p0.l+', ':'')+'dot at pH '+p0.ph.toFixed(2)+', HCO₃⁻ '+r1(p0.h)+(p0.ph<X0||p0.ph>X1||p0.h>Y1?', off the plotted range':'')+'; '+(bs.length?'inside: '+bs.join(', '):'outside every band (suggests a mixed disorder)')+'.');}}
W.map={t:'Acid–base map',build(el,opt){const u=uid();
 el.innerHTML='<div class="wbox" data-e2map><p class="note" style="margin:0">Each shaded band is where a single disorder with the expected compensation usually lands: the rule ± its usual margin (Winter ±2, metabolic alkalosis ±5, respiratory rules ±2 mmol/L). A point outside every band suggests a mixed disorder. A point inside a band fits a single disorder but does not rule out a mixed one. Drag the sliders and watch the dot move along the PCO₂ lines.</p><div class="ctrls">'+e2prng(u+'c','PCO₂',12,110,1,40)+rng(u+'h','HCO₃⁻ (mmol/L)',3,48,0.5,24)+'</div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Acid–base map with compensation bands"></canvas></div><p class="mono muted" id="'+u+'l" aria-live="polite" style="margin:0;font-size:13px"></p><p class="note" style="margin:0">Bands: Winter’s formula (Albert, Dell and Winter 1967); respiratory slopes from Brackett, Cohen and Schwartz (1965) and later studies.</p></div>';
 const draw=()=>{const p=e2rv(u+'c'),hc=+$(u+'h').value;$(u+'co').textContent=e2K()?P(p)+' kPa ('+Math.round(p)+')':Math.round(p)+' ('+(p/KPA).toFixed(1)+' kPa)';$(u+'ho').textContent=hc+' mmol/L';const ph=phFrom(hc,p);drawMap($(u+'v'),[{ph,h:hc,l:ph.toFixed(2)}]);
  const o=interp({pH:r2(ph),pco2:p,hco3:hc}),bs=e2bands(ph,hc);
  $(u+'l').textContent='pH '+ph.toFixed(2)+' → '+(o.err?'outside the range the app interprets (pH 6.8–7.8)':o.label)+(ph<6.95||ph>7.75?' · off the plotted range':'')+' · '+(bs.length?'in band: '+bs.join(', '):'outside every band');};
 el.querySelector('.wbox').e2set=(pmm,hc)=>{e2set(u+'c',Math.max(12,Math.min(110,pmm)));$(u+'h').value=Math.max(3,Math.min(48,hc));draw();};
 if(opt&&opt.pco2)e2set(u+'c',opt.pco2);if(opt&&opt.hco3)$(u+'h').value=opt.hco3;
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw));draw();onRz(el,draw);}};

/* Alveolar gas & A–a */
W.alv={t:'Alveolar gas equation and A–a gradient',build(el){const u=uid();const pa0=+(S.patm||760);
 const ALT=[[760,'Sea level'],[707,'Riyadh ≈ 610 m'],[580,'Abha ≈ 2,270 m'],[565,'Aircraft cabin ≈ 2,400 m']],known=ALT.some(a=>a[0]===pa0);
 const opts=ALT.map(a=>'<option value="'+a[0]+'"'+(a[0]===pa0?' selected':'')+'>'+a[1]+' ('+e2PP(a[0])+')</option>').join('')+'<option value="c"'+(known?'':' selected')+'>Custom pressure</option>';
 el.innerHTML='<div class="wbox"><div class="ctrls"><div class="ctrl"><label for="'+u+'a"><span>Altitude</span></label><select id="'+u+'a">'+opts+'</select></div>'+e2pnum(u+'b','Barometric pressure',known?760:pa0).replace('<div class="ctrl"','<div class="ctrl" id="'+u+'cw"'+(known?' hidden':''))+num(u+'f','FiO₂ (0.21–1.0)',0.21,0.01).replace('type="number"','type="number" min="0.21" max="1"')+num(u+'r','RQ',0.8,0.05)+e2pnum(u+'c','PaCO₂',40)+e2pnum(u+'o','PaO₂',90)+num(u+'g','Age','40',1,'years')+'</div><div class="readout"><div class="ro"><small>PiO₂</small><b id="'+u+'pi"></b></div><div class="ro"><small>PAO₂</small><b id="'+u+'pa"></b></div><div class="ro"><small>A–a</small><b id="'+u+'aa"></b></div><div class="ro"><small>Expected A–a</small><b id="'+u+'ex"></b></div></div><p id="'+u+'v" class="verdict-line" aria-live="polite"></p><details><summary class="eyebrow" style="min-height:44px;display:flex;align-items:center">Show working</summary><p id="'+u+'w" class="mono" style="margin:0;font-size:13px;line-height:1.6"></p></details></div>';
 const set=(k,t)=>{$(u+k).textContent=t;};
 const run=()=>{const sel=$(u+'a').value;$(u+'cw').hidden=sel!=='c';const pt=sel==='c'?(e2pv(u+'b')||760):+sel;
  /* FiO₂ typed as a percentage (21) is read as 21%; it is kept within 0.21–1.0 */
  let f=+$(u+'f').value,fn='';if(!f)f=0.21;else if(f>1){f=f/100;fn='FiO₂ read as '+Math.round(f*100)+'%. ';}
  if(f>1){f=1;fn='FiO₂ capped at 1.0. ';}else if(f<0.21){f=0.21;fn='FiO₂ cannot be below 0.21 on air; 0.21 used. ';}
  const rq=+$(u+'r').value>0?+$(u+'r').value:0.8,c=e2pv(u+'c'),o=e2pv(u+'o'),gv=$(u+'g').value,ex=gv===''?null:+gv/4+4,air=f<=0.22;
  if(c==null||o==null||c<=0||o<=0||pt<=47){['pi','pa','aa','ex','w'].forEach(k=>set(k,'—'));set('v','Enter PaCO₂ and PaO₂.');return;}
  const pi=f*(pt-47),pa=pi-c/rq,aa=pa-o;
  set('pi',e2PP(pi));set('pa',e2PP(pa));set('aa',e2PP(aa));set('ex',!air?'n/a on O₂':ex==null?'enter age':'≤ '+e2PP(ex));
  let v;if(aa<-5)v='Negative gradient: check FiO₂, altitude and that the sample is arterial.';
  else if(!air)v='On supplemental oxygen the A–a widens even in healthy lungs; use P/F = '+(e2K()?r1(o/KPA/f)+' kPa':Math.round(o/f)+' mmHg')+'.';
  else if(ex==null)v='Enter the age to judge the gradient.';
  else if(aa<=ex)v=o<80?'Hypoxaemia with a normal gradient: hypoventilation or low inspired O₂. The lungs transfer normally.':'Normal gradient.';
  else v='Raised gradient ('+e2PP(aa)+', upper limit '+e2PP(ex)+'): V/Q mismatch, shunt or diffusion limitation.';
  set('v',fn+v);
  set('w','PiO₂ = FiO₂ × (Pb − H₂O) = '+r2(f)+' × ('+P(pt)+' − '+P(47)+') = '+P(pi)+'\nPAO₂ = PiO₂ − PaCO₂ ÷ RQ = '+P(pi)+' − '+P(c)+' ÷ '+rq+' = '+P(pa)+'\nA–a = PAO₂ − PaO₂ = '+P(pa)+' − '+P(o)+' = '+P(aa)+' '+PU()+(ex!=null?'\nUpper limit on air = age ÷ 4 + 4 = '+P(ex)+' '+PU():''));};
 $(u+'w').style.whiteSpace='pre-line';
 el.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));run();}};

/* O2 content */
W.o2c={t:'Oxygen content and delivery',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+rng(u+'h','Hb (g/dL)',4,20,0.1,15)+rng(u+'s','SaO₂ (%)',50,100,1,98)+e2prng(u+'p','PaO₂',30,600,1,95)+rng(u+'q','Cardiac output (L/min)',1.5,10,0.1,5)+'</div><div class="btnrow"><button class="tool" id="'+u+'lk" aria-pressed="true">SaO₂ follows PaO₂ (normal curve)</button></div><canvas id="'+u+'v" role="img" aria-label="Bound versus dissolved oxygen bar"></canvas><div class="readout"><div class="ro"><small>CaO₂</small><b id="'+u+'ca"></b></div><div class="ro"><small>Dissolved</small><b id="'+u+'d"></b></div><div class="ro"><small>DO₂</small><b id="'+u+'do"></b></div><div class="ro"><small>Of normal</small><b id="'+u+'pc"></b></div></div><p class="note" id="'+u+'n" style="margin:0"></p></div>';
 let link=true;const hill=P=>Math.pow(P,2.7)/(Math.pow(P,2.7)+Math.pow(26.8,2.7));
 const run=()=>{const hb=+$(u+'h').value,p=e2rv(u+'p'),q=+$(u+'q').value;
  /* linked: SaO₂ comes from PaO₂ on the normal curve (same Hill model as the dissociation curve); unlinked lets you model CO or abnormal Hb */
  if(link)$(u+'s').value=Math.max(50,Math.round(hill(p)*100));$(u+'s').disabled=link;const s=+$(u+'s').value;
  $(u+'ho').textContent=(+$(u+'h').value).toFixed(1)+' g/dL';$(u+'so').textContent=s+'%';$(u+'po').textContent=e2PP(p);$(u+'qo').textContent=q.toFixed(1)+' L/min';
  $(u+'n').textContent=link?'SaO₂ is set from PaO₂ on a normal curve. Unlink it to model carbon monoxide or abnormal haemoglobin.':'Unlinked: any SaO₂ and PaO₂ pair is allowed, even ones a normal curve could not give.';
  const b=1.34*hb*s/100,d=0.003*p,ca=b+d,do2=q*ca*10;$(u+'ca').textContent=ca.toFixed(1)+' mL/dL';$(u+'d').textContent=d.toFixed(2)+' mL/dL';$(u+'do').textContent=Math.round(do2)+' mL/min';$(u+'pc').textContent=Math.round(do2/1000*100)+'%';
  const cv=$(u+'v');cv.setAttribute('aria-label','Oxygen content bar: '+b.toFixed(1)+' mL/dL bound to haemoglobin and '+d.toFixed(2)+' dissolved, against a normal of about 20.');
  const {x,w,h}=fitCanvas(cv,70);x.clearRect(0,0,w,h);const sc=v=>(w-32)*Math.min(30,v)/30,T=22;x.fillStyle=tok('--surface-2');x.fillRect(16,T,w-32,22);x.fillStyle=tok('--accent');x.fillRect(16,T,sc(b),22);x.fillStyle=tok('--b5');x.fillRect(16+sc(b),T,Math.max(2,sc(ca)-sc(b)),22);
  /* normal marker as a dashed line above the bar, so it does not merge with the bar's end */
  const nx=16+sc(20);x.strokeStyle=tok('--fg');x.lineWidth=1.5;x.setLineDash([3,3]);x.beginPath();x.moveTo(nx,4);x.lineTo(nx,T+26);x.stroke();x.setLineDash([]);
  x.fillStyle=tok('--muted');x.font='500 11px '+tok('--f-mono');x.textAlign='right';x.fillText('normal ≈ 20',nx-4,13);
  x.textAlign='left';x.fillText('Bound to Hb',16,h-6);x.textAlign='right';const dl='Dissolved',dw=x.measureText(dl).width;x.fillText(dl,w-16,h-6);x.fillStyle=tok('--b5');x.fillRect(w-16-dw-14,h-15,10,10);x.textAlign='left';};
 $(u+'lk').addEventListener('click',()=>{link=!link;$(u+'lk').setAttribute('aria-pressed',String(link));run();});
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();onRz(el,run);}};

/* Oxyhaemoglobin dissociation curve */
W.odc={t:'Oxyhaemoglobin dissociation curve',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+rng(u+'ph','pH',7.0,7.7,0.01,7.4)+rng(u+'t','Temperature (°C)',33,42,0.1,37)+rng(u+'d','2,3-BPG (mmol/L)',2,9,0.1,5)+rng(u+'co','COHb (%)',0,60,1,0)+e2prng(u+'p','Mark a PO₂',10,120,1,60)+'</div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Oxygen dissociation curve"></canvas><div class="mlegend" id="'+u+'lg"><span><i style="background:var(--accent);opacity:1"></i>This curve</span><span><i style="background:transparent;border-top:2px dashed var(--muted);height:0;opacity:1"></i>Normal curve</span></div></div><div class="readout"><div class="ro"><small>P50</small><b id="'+u+'50"></b></div><div class="ro"><small>Sat at mark</small><b id="'+u+'sm"></b></div><div class="ro"><small>Normal at mark</small><b id="'+u+'sn"></b></div><div class="ro" id="'+u+'spw" hidden><small>Pulse oximeter reads</small><b id="'+u+'sp"></b></div><div class="ro"><small>Shift</small><b id="'+u+'sh" style="font-size:15px;font-family:var(--f-body)"></b></div></div><p class="note" style="margin:0">Illustrative model (Hill equation, n = 2.7). Saturation is shown as oxyhaemoglobin as a share of total haemoglobin, so carbon monoxide lowers the ceiling as well as shifting the curve left. A pulse oximeter counts COHb as if it were oxyhaemoglobin, so it reads falsely normal: co-oximetry is needed.</p></div>';
 const hill=(P,p50,mx)=>mx*Math.pow(P,2.7)/(Math.pow(P,2.7)+Math.pow(p50,2.7));
 const run=()=>{const ph=+$(u+'ph').value,t=+$(u+'t').value,d=+$(u+'d').value,co=+$(u+'co').value/100,pm=e2rv(u+'p');
  $(u+'pho').textContent=ph.toFixed(2);$(u+'to').textContent=t.toFixed(1)+' °C';$(u+'do').textContent=d.toFixed(1)+' mmol/L';$(u+'coo').textContent=Math.round(co*100)+'%';$(u+'po').textContent=e2PP(pm);
  const p50=26.8*Math.pow(10,-0.48*(ph-7.4))*Math.pow(10,0.024*(t-37))*(1+0.07*(d-5))*(1-0.55*co);const mx=1-co,shifted=Math.abs(p50-26.8)>=0.6||co>0,sm=hill(pm,p50,mx);
  $(u+'50').textContent=e2K()?(p50/KPA).toFixed(2)+' kPa':p50.toFixed(1)+' mmHg';$(u+'sm').textContent=Math.round(sm*100)+'%';$(u+'sn').textContent=Math.round(hill(pm,26.8,1)*100)+'%';$(u+'sh').textContent=Math.abs(p50-26.8)<0.6?'None':p50>26.8?'Right: easier unloading':'Left: holds O₂ tighter';
  $(u+'spw').hidden=!(co>0);$(u+'sp').textContent=Math.min(100,Math.round((sm+co)*100))+'%';$(u+'lg').style.display=shifted?'':'none';
  const cv=$(u+'v');cv.setAttribute('aria-label','Oxygen dissociation curve: P50 '+(e2K()?(p50/KPA).toFixed(2):p50.toFixed(1))+' '+PU()+(shifted?(p50>26.8?', shifted right':p50<26.8?', shifted left':'')+(co>0?', ceiling lowered to '+Math.round(mx*100)+'% by carbon monoxide':''):', normal position')+'. Saturation '+Math.round(sm*100)+'% at the marked PO₂ of '+e2PP(pm)+'.');
  const {x,w,h}=fitCanvas(cv,300);x.clearRect(0,0,w,h);const ml=46,mr=10,mt=10,mb=30,sx=v=>ml+(w-ml-mr)*v/120,sy=v=>mt+(h-mt-mb)*(1-v);
  x.strokeStyle=tok('--line');x.lineWidth=1;for(let v=0;v<=1.001;v+=0.25){x.beginPath();x.moveTo(ml,sy(v));x.lineTo(w-mr,sy(v));x.stroke();}
  /* x ticks in the chosen unit: 0–120 mmHg is 0–16 kPa */
  const ticks=e2K()?[0,2,4,6,8,10,12,14,16].map(k=>[k*KPA,k]):[0,20,40,60,80,100,120].map(v=>[v,v]);
  ticks.forEach(([v])=>{x.beginPath();x.moveTo(sx(v),mt);x.lineTo(sx(v),h-mb);x.stroke();});
  const curve=(p5,m,col,dash,lw)=>{x.strokeStyle=col;x.lineWidth=lw;x.setLineDash(dash);x.beginPath();for(let P=0;P<=120;P+=1){const Y=sy(hill(P,p5,m));P?x.lineTo(sx(P),Y):x.moveTo(sx(P),Y);}x.stroke();x.setLineDash([]);};
  /* normal curve drawn last (dashed, on top) so it is visible even when the two curves coincide */
  curve(p50,mx,tok('--accent'),[],3);if(shifted)curve(26.8,1,tok('--muted'),[5,4],1.5);
  x.fillStyle=tok('--accent');x.beginPath();x.arc(sx(p50),sy(mx/2),4,0,7);x.fill();
  x.strokeStyle=tok('--fg');x.lineWidth=1;x.setLineDash([2,3]);x.beginPath();x.moveTo(sx(pm),h-mb);x.lineTo(sx(pm),sy(sm));x.lineTo(ml,sy(sm));x.stroke();x.setLineDash([]);
  x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='center';ticks.forEach(([v,l])=>x.fillText(l,sx(v),h-mb+13));x.fillText('PO₂ '+PU(),(ml+w)/2,h-3);x.textAlign='right';for(let v=0;v<=1.001;v+=0.25)x.fillText(Math.round(v*100),ml-5,sy(v)+3);
  x.save();x.translate(11,(mt+h-mb)/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('SO₂ %',0,0);x.restore();x.textAlign='left';};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();onRz(el,run);}};

/* Red cell animation */
W.rbc={t:'Inside the red cell: CO₂, H⁺, HCO₃⁻, Cl⁻ and O₂',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="btnrow"><div class="seg" role="group" aria-label="Location"><button class="tool" id="'+u+'t" aria-pressed="true">In the tissues</button><button class="tool" id="'+u+'l" aria-pressed="false">In the lung</button></div><button class="tool" id="'+u+'pp">Pause</button></div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-describedby="'+u+'s" aria-label="Animated red cell showing gas and ion movement; the steps are listed below"></canvas></div><ol class="look" id="'+u+'s"></ol></div>';
 let mode='t',parts=[],last=0,spawnT=0,run=true,raf=0;
 const STEPS={t:['CO₂ diffuses from the tissue into the red cell.','Carbonic anhydrase turns CO₂ + H₂O into H⁺ + HCO₃⁻.','HCO₃⁻ leaves through band 3 as Cl⁻ comes in (chloride shift).','H⁺ binds haemoglobin, which lowers its affinity for O₂ (Bohr effect).','Some CO₂ binds deoxygenated Hb directly as carbamino-Hb; deoxy-Hb also takes up more H⁺ (Haldane effect).','O₂ is released to the tissue.'],l:['O₂ diffuses in from the alveolus and binds haemoglobin.','Oxygenated Hb releases H⁺ and carbamino CO₂ (Haldane effect).','HCO₃⁻ re-enters through band 3 as Cl⁻ leaves.','Carbonic anhydrase recombines H⁺ + HCO₃⁻ into CO₂ + H₂O.','CO₂ diffuses out into the alveolus and is exhaled.']};
 const setMode=m=>{mode=m;parts=[];$(u+'t').setAttribute('aria-pressed',m==='t');$(u+'l').setAttribute('aria-pressed',m==='l');$(u+'s').innerHTML=STEPS[m].map(s=>'<li>'+s+'</li>').join('');if(!run)frame(performance.now(),true);};
 const G=()=>{const cv=$(u+'v');const w=cv.clientWidth||600,h=280;return {w,h,cx:w/2,cy:h*0.47,rx:Math.min(170,w*0.3),ry:62,ca:[w/2-Math.min(170,w*0.3)*0.45,h*0.47],hb:[w/2+Math.min(170,w*0.3)*0.1,h*0.47],b3:[w/2+Math.min(170,w*0.3)*0.95,h*0.47-30]};};
 const spawn=(now)=>{const g=G();const out=(y)=>[g.cx-g.rx*0.4+Math.random()*g.rx*0.9,y];
  if(mode==='t'){const s=out(g.h-12);parts.push({l:'CO₂',c:'--b3',pts:[s,[g.ca[0],g.cy+g.ry-8],g.ca],t0:now,d:1600,s:.35});
   parts.push({l:'H⁺',c:'--bad',pts:[g.ca,g.hb],t0:now+1600,d:900,s:.5});
   parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.b3,[g.w-20,16]],t0:now+1600,d:1500,s:.82});
   parts.push({l:'Cl⁻',c:'--b5',pts:[[g.w-60,12],[g.b3[0],g.b3[1]-6],[g.cx+g.rx*0.5,g.cy-20]],t0:now+1700,d:1400,s:.85});
   parts.push({l:'O₂',c:'--accent',pts:[g.hb,[g.hb[0]+10,g.cy+g.ry-4],out(g.h-8)],t0:now+2400,d:1400,s:.8});
   parts.push({l:'CO₂',c:'--b3',pts:[out(g.h-12),[g.hb[0]+30,g.cy+g.ry-8],[g.hb[0]+18,g.hb[1]+14]],t0:now+500,d:1500,s:.62});}
  else{const s=out(g.h-12);parts.push({l:'O₂',c:'--accent',pts:[s,[g.hb[0]-6,g.cy+g.ry-6],g.hb],t0:now,d:1500,s:.35});
   parts.push({l:'H⁺',c:'--bad',pts:[g.hb,g.ca],t0:now+1400,d:900,s:.5});
   parts.push({l:'HCO₃⁻',c:'--b2',pts:[[g.w-20,16],g.b3,g.ca],t0:now+800,d:1500,s:.2});
   parts.push({l:'Cl⁻',c:'--b5',pts:[[g.cx+g.rx*0.5,g.cy-20],[g.b3[0],g.b3[1]-6],[g.w-60,12]],t0:now+900,d:1400,s:.18});
   parts.push({l:'CO₂',c:'--b3',pts:[g.ca,[g.ca[0],g.cy+g.ry-8],out(g.h-8)],t0:now+2300,d:1500,s:.8});
   parts.push({l:'CO₂',c:'--b3',pts:[[g.hb[0]+18,g.hb[1]+14],[g.hb[0]+30,g.cy+g.ry-8],out(g.h-8)],t0:now+1500,d:1500,s:.75});}};
 const at=(p,t)=>{const n=p.pts.length-1;const k=Math.min(n-1e-6,t*n);const i=Math.floor(k),f=k-i;const e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;const a=p.pts[i],b=p.pts[i+1];return [a[0]+(b[0]-a[0])*e,a[1]+(b[1]-a[1])*e];};
 /* 5.0: the canvas is sized only when its width changes, colours are cached until the theme changes,
    the loop pauses when the card is off screen, and the 'buffer:show' hook is swept with the widget */
 const cv0=$(u+'v');let fc=null,fw=0,fd=0,ccV=-1,cc={},paused=false,vis=true,io=null;
 const C=n=>{if(ccV!==E2TV){cc={};ccV=E2TV;}return n in cc?cc[n]:(cc[n]=tok(n));};
 const fit=()=>{const cw=cv0.parentElement.clientWidth||600,dp=window.devicePixelRatio||1;if(!fc||cw!==fw||dp!==fd){fc=fitCanvas(cv0,280);fw=cw;fd=dp;}return fc;};
 const resume=()=>{if(paused&&run&&vis){paused=false;cancelAnimationFrame(raf);raf=requestAnimationFrame(t=>frame(t));}};
 e2OnShow(el,resume);
 try{io=new IntersectionObserver(es=>{vis=es[es.length-1].isIntersecting;if(vis)resume();});io.observe(cv0);}catch(e){}
 const pill=(x,px,py,l,col)=>{x.font='700 9px '+C('--f-mono');const rw=Math.max(22,x.measureText(l).width+10),rh=18;x.fillStyle=C(col);x.beginPath();if(x.roundRect)x.roundRect(px-rw/2,py-rh/2,rw,rh,9);else x.rect(px-rw/2,py-rh/2,rw,rh);x.fill();x.fillStyle='#fff';x.textAlign='center';x.fillText(l,px,py+3);};
 const frame=(now,still)=>{const cv=cv0;if(!cv.isConnected){cancelAnimationFrame(raf);if(io)io.disconnect();return;}if(!still&&(cv.offsetParent===null||!vis)){paused=true;return;}
  const {x,w,h}=fit();const g=G();x.clearRect(0,0,w,h);x.textAlign='left';
  x.fillStyle=C('--surface-2');x.fillRect(0,0,w,40);x.fillStyle=C('--muted');x.font='600 11px '+C('--f-mono');x.fillText('PLASMA',10,24);
  x.fillStyle=mode==='t'?C('--h-rest'):C('--b5-soft');x.fillRect(0,h-36,w,36);x.fillStyle=C('--fg');x.fillText(mode==='t'?'TISSUE (respiring cells)':'ALVEOLUS (air)',10,h-14);
  x.fillStyle=C('--rbc');x.strokeStyle=C('--rbc-edge');x.lineWidth=3;x.beginPath();x.ellipse(g.cx,g.cy,g.rx,g.ry,0,0,7);x.fill();x.stroke();
  x.fillStyle=C('--surface');x.globalAlpha=.85;x.beginPath();x.arc(g.ca[0],g.ca[1],22,0,7);x.fill();x.beginPath();x.arc(g.hb[0],g.hb[1],24,0,7);x.fill();x.globalAlpha=1;
  x.fillStyle=C('--fg');x.font='700 11px '+C('--f-mono');x.textAlign='center';x.fillText('CA',g.ca[0],g.ca[1]+4);x.fillText('Hb',g.hb[0],g.hb[1]+4);
  /* band 3 label sits outside the membrane, to the right of the marker */
  x.fillStyle=C('--fg');x.fillRect(g.b3[0]-5,g.b3[1]-14,10,28);x.font='600 10px '+C('--f-mono');x.textAlign='left';x.fillText('band 3',g.b3[0]+10,g.b3[1]+4);
  if(still){/* reduced motion or paused: a fixed snapshot, every particle on its dashed path */
   parts=[];spawn(0);parts.forEach(p=>{x.strokeStyle=C(p.c);x.lineWidth=1.2;x.globalAlpha=.5;x.setLineDash([4,3]);x.beginPath();p.pts.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.stroke();x.setLineDash([]);x.globalAlpha=1;const e=p.pts[p.pts.length-1],f=p.pts[p.pts.length-2],a=Math.atan2(e[1]-f[1],e[0]-f[0]);x.fillStyle=C(p.c);x.beginPath();x.moveTo(e[0],e[1]);x.lineTo(e[0]-8*Math.cos(a-0.45),e[1]-8*Math.sin(a-0.45));x.lineTo(e[0]-8*Math.cos(a+0.45),e[1]-8*Math.sin(a+0.45));x.closePath();x.fill();});
   x.fillStyle=C('--fg');x.font='700 11px '+C('--f-mono');x.textAlign='center';x.fillText('CA',g.ca[0],g.ca[1]+4);x.fillText('Hb',g.hb[0],g.hb[1]+4);
   parts.forEach(p=>{const [px,py]=at(p,p.s||0.55);pill(x,px,py,p.l,p.c);});parts=[];}
  else{if(now-spawnT>1300){spawn(now);spawnT=now;}
   parts=parts.filter(p=>now-p.t0<p.d+50);
   parts.forEach(p=>{const t=(now-p.t0)/p.d;if(t<0)return;const [px,py]=at(p,Math.min(1,t));pill(x,px,py,p.l,p.c);});}
  x.textAlign='left';if(run&&!still)raf=requestAnimationFrame(t=>frame(t));};
 $(u+'t').addEventListener('click',()=>setMode('t'));$(u+'l').addEventListener('click',()=>setMode('l'));
 $(u+'pp').addEventListener('click',()=>{run=!run;$(u+'pp').textContent=run?'Pause':'Play';cancelAnimationFrame(raf);if(run){paused=false;raf=requestAnimationFrame(t=>frame(t));}});
 onRz(el,()=>{if(!run)frame(performance.now(),true);});
 setMode('t');if(RM()){run=false;$(u+'pp').textContent='Play';frame(performance.now(),true);}else raf=requestAnimationFrame(t=>frame(t));}};

/* Compensation calculator */
W.comp={t:'Compensation calculator',build(el,opt){const u=uid();
 const NM={mac:'metabolic acidosis',malk:'metabolic alkalosis',rac:'respiratory acidosis',ralk:'respiratory alkalosis'};
 el.innerHTML='<div class="wbox"><div class="ctrls"><div class="ctrl"><label for="'+u+'d"><span>Primary disorder</span></label><select id="'+u+'d"><option value="mac">Metabolic acidosis</option><option value="malk">Metabolic alkalosis</option><option value="rac">Respiratory acidosis</option><option value="ralk">Respiratory alkalosis</option></select></div>'+num(u+'h','HCO₃⁻',12,0.1,'mmol/L')+e2pnum(u+'c','PCO₂',26)+'</div><div class="readout"><div class="ro wide"><small>Expected</small><b id="'+u+'e" style="font-size:15px;font-family:var(--f-body)"></b></div></div><p class="verdict-line" id="'+u+'v" aria-live="polite"></p><div class="btnrow"><button class="tool" id="'+u+'sg" hidden></button><button class="tool" id="'+u+'sm" hidden>Show on the map</button></div></div>';
 /* the disorder these numbers suggest: low pH with low HCO₃⁻ → mac, and so on; the larger relative change wins when both fit */
 const guess=(h,c,ph)=>{if(ph<7.35){const m=h<22,r=c>45;if(m&&r)return (24-h)/24>=(c-40)/40?'mac':'rac';return m?'mac':r?'rac':null;}if(ph>7.45){const m=h>26,r=c<35;if(m&&r)return (h-24)/24>=(40-c)/40?'malk':'ralk';return m?'malk':r?'ralk':null;}return null;};
 const run=()=>{const d=$(u+'d').value,hv=$(u+'h').value,h=+hv,c=e2pv(u+'c'),E=$(u+'e'),V=$(u+'v'),sg=$(u+'sg');sg.hidden=true;
  const host=el.closest('.wcard'),mp=host&&host.parentElement&&host.parentElement.querySelector('[data-e2map]');$(u+'sm').hidden=!mp;
  if(hv===''||!(h>0)||!(c>0)){E.textContent='—';V.textContent='Enter HCO₃⁻ and PCO₂.';$(u+'sm').hidden=true;return;}
  const ph=phFrom(h,c),phs=' · pH '+ph.toFixed(2),gs=guess(h,c,ph),offer=()=>{if(gs&&gs!==d){sg.hidden=false;sg.textContent='Use '+NM[gs];sg.dataset.d=gs;}};
  /* 5.0: check the numbers fit the chosen disorder before applying its rule */
  const bad=d==='mac'&&h>=22?'HCO₃⁻ '+r1(h)+' is not low (it needs to be below 22)':d==='malk'&&h<=26?'HCO₃⁻ '+r1(h)+' is not high (it needs to be above 26)':d==='rac'&&c<=45?'PCO₂ '+e2PP(c)+' is not high (it needs to be above '+e2PP(45)+')':d==='ralk'&&c>=35?'PCO₂ '+e2PP(c)+' is not low (it needs to be below '+e2PP(35)+')':'';
  if(bad){E.textContent='—';V.textContent='These numbers are not a '+NM[d]+': '+bad+'. pH '+ph.toFixed(2)+'.';offer();return;}
  const band=(lo,hi)=>P(lo)+'–'+P(hi)+' '+PU();let e='',v='';
  if(d==='mac'){const x=1.5*h+8;e='PCO₂ '+band(x-2,x+2)+' (Winter’s: 1.5 × HCO₃⁻ + 8 ± 2)';v=c>x+2?'PCO₂ too high → added respiratory acidosis':c<x-2?'PCO₂ too low → added respiratory alkalosis':'Appropriately compensated';}
  if(d==='malk'){const x=0.7*h+20;e='PCO₂ '+band(x-5,x+5)+' (0.7 × HCO₃⁻ + 20 ± 5)';v=c>x+5?'PCO₂ too high → added respiratory acidosis':c<x-5?'PCO₂ too low → added respiratory alkalosis':'Appropriately compensated';}
  if(d==='rac'||d==='ralk'){const ac=d==='rac',dd=Math.abs(c-40)/10,a=24+(ac?1:-2)*dd,ch=24+(ac?4:-5)*dd,inA=Math.abs(h-a)<=2,inC=Math.abs(h-ch)<=2,lo=Math.min(a,ch)-2,hi=Math.max(a,ch)+2;
   e='HCO₃⁻ acute '+r1(a)+' ±2 · chronic '+r1(ch)+' ±2 mmol/L ('+(ac?'1 and 4':'2 and 5')+' per '+e2PP(10)+')';
   v=h>hi?'HCO₃⁻ higher than expected → added metabolic alkalosis':h<lo?'HCO₃⁻ lower than expected → added metabolic acidosis':inA&&inC?'Fits acute or chronic: too close to tell apart at this PCO₂':inA?'Acute, appropriately compensated':inC?'Chronic, appropriately compensated':'Between acute and chronic: acute-on-chronic, or compensation still developing';}
  const wrongSide=(d==='mac'||d==='rac')&&ph>7.45?' The pH is alkalaemic, so this is unlikely to be the primary process.':(d==='malk'||d==='ralk')&&ph<7.35?' The pH is acidaemic, so this is unlikely to be the primary process.':'';
  E.textContent=e;V.textContent=v+phs+'.'+wrongSide;if(wrongSide)offer();};
 $(u+'sg').addEventListener('click',()=>{$(u+'d').value=$(u+'sg').dataset.d;run();});
 $(u+'sm').addEventListener('click',()=>{const host=el.closest('.wcard'),mp=host&&host.parentElement&&host.parentElement.querySelector('[data-e2map]'),h=+$(u+'h').value,c=e2pv(u+'c');if(mp&&mp.e2set&&h>0&&c>0){mp.e2set(c,h);mp.scrollIntoView({block:'center',behavior:RM()?'auto':'smooth'});}});
 if(opt){if(opt.d&&NM[opt.d])$(u+'d').value=opt.d;if(opt.hco3)$(u+'h').value=opt.hco3;if(opt.pco2)$(u+'c').value=e2Pd(opt.pco2);}
 el.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));run();setTimeout(run,0);}};

/* AG calculator */
W.agc={t:'Anion gap, delta ratio and osmolar gap',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+num(u+'n','Na⁺',138,1,'mmol/L')+num(u+'c','Cl⁻',100,1,'mmol/L')+num(u+'h','HCO₃⁻',12,0.1,'mmol/L')+num(u+'a','Albumin',30,1,'g/L')+num(u+'g','Glucose',6,0.1,'mmol/L')+num(u+'u','Urea',5,0.1,'mmol/L')+num(u+'o','Measured osm',300,1,'mOsm/kg')+num(u+'e','Ethanol (optional)','',0.1,'mmol/L')+'</div><div class="readout"><div class="ro"><small>AG</small><b id="'+u+'ag"></b></div><div class="ro"><small>Corrected AG</small><b id="'+u+'agc"></b></div><div class="ro"><small>Δ ratio</small><b id="'+u+'dr"></b></div><div class="ro"><small>Osmolar gap</small><b id="'+u+'og"></b></div></div><p class="verdict-line" id="'+u+'v" aria-live="polite"></p><p class="note" id="'+u+'nt" style="margin:0"></p></div>';
 const tv=id=>{const s=$(u+id).value;return s===''||isNaN(+s)?null:+s;};
 const run=()=>{const n=tv('n'),c=tv('c'),h=tv('h'),a=tv('a')==null?40:tv('a'),g=tv('g')||0,ur=tv('u')||0,o=tv('o'),et=tv('e');
  /* reference AG from Settings (no K⁺ here); 'high' means above reference + 2, as in the interpreter */
  const ref=S.agref||12,hiAG=ref+2,set=(k,t)=>{$(u+k).textContent=t;};
  $(u+'nt').textContent='AG = Na⁺ − Cl⁻ − HCO₃⁻ (no K⁺), corrected by +0.25 × (40 − albumin g/L). Reference '+ref+' (Settings); high above '+hiAG+'. Δ ratio = (AG − '+ref+') ÷ (24 − HCO₃⁻).'+(et!=null?' Calculated osmolality includes 1.25 × ethanol.':'');
  if(n==null||c==null||h==null){['ag','agc','dr','og'].forEach(k=>set(k,'—'));set('v','Enter Na⁺, Cl⁻ and HCO₃⁻.');return;}
  const ag=n-c-h,agc=ag+0.25*(40-a),high=agc>hiAG,dr=high&&h<24?(agc-ref)/(24-h):null,og=o?o-(2*n+g+ur+(et?1.25*et:0)):null;
  set('ag',r1(ag));set('agc',r1(agc));set('dr',dr==null?'—':dr.toFixed(2));set('og',og==null?'—':r1(og));
  const s=[];
  if(high&&h>=24)s.push('High anion gap with a normal or high HCO₃⁻: a metabolic alkalosis is masking an acidosis (Δ ratio not meaningful)');
  else if(high)s.push('High anion gap; '+(dr<0.4?'Δ < 0.4: normal-AG acidosis dominant':dr<0.8?'Δ 0.4–0.8: HAGMA + NAGMA':dr<=2?'Δ 0.8–2: uncomplicated HAGMA (DKA often about 1, lactate about 1.6)':'Δ > 2: HAGMA + metabolic alkalosis (or a chronic respiratory acidosis)'));
  else s.push(h<22?'Normal anion gap metabolic acidosis (NAGMA)':'Normal anion gap');
  if(og!=null&&og>10)s.push(et==null?'Osmolar gap raised: check ethanol before blaming a toxic alcohol':'Osmolar gap raised even after ethanol: think of a toxic alcohol');
  set('v',s.join('. ')+'.');};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();}};

/* mountW(el,id,opt): opt is passed to build so a lesson can open a model on a preset, e.g. {vent:{pat:'ards'}}, hh {preset:'DKA'}, map {pco2,hco3}, comp {d:'mac',hco3,pco2} */
function mountW(el,id,opt){if(!W[id])return;const card=document.createElement('div');card.className='card wcard';card.innerHTML='<div class="eyebrow">Interactive</div><h3 class="wt" aria-level="2">'+W[id].t+'</h3><div></div>';el.appendChild(card);W[id].build(card.lastChild,opt||{});}

/* Stewart: apparent SID, effective SID and strong ion gap */
W.sid={t:'Stewart: SIDa, SIDe and the strong ion gap',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+num(u+'na','Na⁺',138,1,'mmol/L')+num(u+'k','K⁺',4,0.1,'mmol/L')+num(u+'ca','Ionised Ca²⁺',1.1,0.01,'mmol/L')+num(u+'mg','Ionised Mg²⁺',0.6,0.1,'mmol/L')+num(u+'cl','Cl⁻',110,1,'mmol/L')+num(u+'lac','Lactate',2,0.1,'mmol/L')+num(u+'ph','pH',7.25,0.01,'')+num(u+'h','HCO₃⁻',12,0.1,'mmol/L')+num(u+'alb','Albumin',25,1,'g/L')+num(u+'po','Phosphate',1.2,0.1,'mmol/L')+'</div><div class="readout"><div class="ro"><small>SIDa</small><b id="'+u+'a"></b></div><div class="ro"><small>SIDe</small><b id="'+u+'e"></b></div><div class="ro"><small>SIG</small><b id="'+u+'g"></b></div><div class="ro"><small>Na − Cl</small><b id="'+u+'d"></b></div></div><p class="verdict-line" id="'+u+'v" aria-live="polite"></p><p class="note">SIDa = Na + K + 2·iCa + 2·Mg − Cl − lactate (ionised Mg is about 0.7 × total). Albumin⁻ = alb × (0.123·pH − 0.631); phosphate⁻ = PO₄ × (0.309·pH − 0.469) (Figge). SIDe = HCO₃⁻ + albumin⁻ + phosphate⁻. Results in mEq/L.</p><p class="note" id="'+u+'df" style="margin:0"></p></div>';
 /* pH, Na, Cl and HCO₃⁻ are required; the others fall back to typical normal values, and the note says which */
 const DEFV={k:[4,'K⁺ 4'],ca:[1.2,'iCa 1.2'],mg:[0.5,'Mg 0.5'],lac:[1,'lactate 1'],alb:[40,'albumin 40'],po:[1,'phosphate 1']};
 const run=()=>{const used=[],v=id=>{const x=$(u+id).value;if(x===''||isNaN(+x)){if(DEFV[id]){used.push(DEFV[id][1]);return DEFV[id][0];}return null;}return +x;};
  const ph=v('ph'),na=v('na'),cl=v('cl'),hc=v('h'),vals={k:v('k'),ca:v('ca'),mg:v('mg'),lac:v('lac'),alb:v('alb'),po:v('po')},set=(k,t)=>{$(u+k).textContent=t;};
  set('df',used.length?'Blank fields use typical normal values: '+used.join(', ')+'.':'');
  if(ph==null||na==null||cl==null||hc==null||ph<6.8||ph>7.8){['a','e','g','d'].forEach(k=>set(k,'—'));set('v',ph!=null&&(ph<6.8||ph>7.8)?'Enter a pH between 6.8 and 7.8.':'Enter pH, Na⁺, Cl⁻ and HCO₃⁻.');return;}
  const a=na+vals.k+2*vals.ca+2*vals.mg-cl-vals.lac,alb=vals.alb*(0.123*ph-0.631),po=vals.po*(0.309*ph-0.469),e=hc+alb+po,g=a-e,d=na-cl;
  set('a',r1(a)+' mEq/L');set('e',r1(e)+' mEq/L');set('g',r1(g)+' mEq/L');set('d',r1(d)+' mEq/L');
  const p=[];if(a<38)p.push('Low SIDa (acidifying)'+(d<32?', mostly from chloride':''));else if(a>46)p.push('High SIDa (alkalinising)');if(g>3)p.push('SIG '+r1(g)+': unmeasured anions');if(vals.alb<35)p.push('Low albumin (alkalinising, hides acid)');
  set('v',p.length?p.join(' · ')+'.':'Strong ions and weak acids look balanced.');};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();}};
