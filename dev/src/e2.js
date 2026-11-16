/* ================= INTERACTIVE WIDGETS ================= */
const $=id=>document.getElementById(id);
const tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';
let UID=0;const uid=()=>'w'+(++UID);
const RM=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function fitCanvas(cv,h){const dpr=Math.min(2,window.devicePixelRatio||1);const w=cv.parentElement.clientWidth||600;cv.style.width=w+'px';cv.style.height=h+'px';cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return {x,w,h};}
function rng(id,lab,min,max,step,val,fmt){return '<div class="ctrl"><label for="'+id+'"><span>'+lab+'</span><output id="'+id+'o"></output></label><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"'+(fmt?' data-fmt="'+fmt+'"':'')+'></div>';}
function num(id,lab,val,step,unit){return '<div class="ctrl"><label for="'+id+'"><span>'+lab+'</span>'+(unit?'<span>'+unit+'</span>':'')+'</label><input type="number" inputmode="decimal" id="'+id+'" value="'+(val==null?'':val)+'" step="'+(step||'any')+'"></div>';}
const W={};
function onRz(el,fn){const h=()=>{if(!el.isConnected){removeEventListener('resize',h);return;}fn();};addEventListener('resize',h);}

/* pH ↔ [H+] */
W.phh={t:'pH and [H⁺] on a log scale',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+rng(u+'p','pH',6.8,7.8,0.01,7.4)+'</div><canvas id="'+u+'c" aria-label="Hydrogen ion concentration bar"></canvas><div class="readout"><div class="ro"><small>[H⁺] true</small><b id="'+u+'h"></b></div><div class="ro"><small>80 rule</small><b id="'+u+'r"></b></div><div class="ro"><small>State</small><b id="'+u+'s" style="font-size:16px"></b></div></div></div>';
 const draw=()=>{const ph=+$(u+'p').value;$(u+'po').textContent=ph.toFixed(2);const H=Math.pow(10,9-ph);$(u+'h').textContent=H.toFixed(0)+' nmol/L';const ok=ph>=7.2&&ph<=7.5;$(u+'r').textContent=ok?(80-Math.round((ph-7)*100))+' nmol/L':'outside 7.20–7.50';
  $(u+'s').textContent=ph<7.35?'Acidaemia':ph>7.45?'Alkalaemia':'Normal';
  const {x,w,h}=fitCanvas($(u+'c'),74);x.clearRect(0,0,w,h);const L=16,R=w-16,sc=v=>L+(R-L)*v/160;
  x.fillStyle=tok('--surface-2');x.fillRect(L,22,R-L,20);x.fillStyle=tok('--good-soft');x.fillRect(sc(35.5),22,sc(44.7)-sc(35.5),20);
  x.fillStyle=tok('--accent');x.fillRect(L,22,sc(Math.min(160,H))-L,20);
  x.fillStyle=tok('--muted');x.font='500 11px '+tok('--f-mono');x.textAlign='center';
  [[7.7,20],[7.4,40],[7.1,80],[6.8,160]].forEach(([p,v])=>{const X=sc(v);x.fillRect(X-0.5,18,1,28);x.fillText(p.toFixed(1),X,14);x.fillText(v,X,60);});
  x.textAlign='left';x.fillText('nmol/L →',L,72);};
 el.querySelector('input').addEventListener('input',draw);draw();onRz(el,draw);}};

/* Henderson–Hasselbalch seesaw */
W.hh={t:'Henderson–Hasselbalch seesaw',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="btnrow presets">'+[['Normal',40,24],['DKA',18,6],['Vomiting',50,40],['Opioid',75,27],['COPD',62,33],['Panic',25,21]].map(p=>'<button class="tool" data-p="'+p[1]+','+p[2]+'">'+p[0]+'</button>').join('')+'</div><div class="ctrls">'+rng(u+'c','PCO₂ (mmHg)',10,120,1,40)+rng(u+'h','HCO₃⁻ (mmol/L)',3,50,0.5,24)+'</div><canvas id="'+u+'v" aria-label="Seesaw showing the bicarbonate to CO2 ratio"></canvas><div class="readout"><div class="ro"><small>pH</small><b id="'+u+'ph"></b></div><div class="ro"><small>Ratio</small><b id="'+u+'ra"></b></div><div class="ro"><small>[H⁺]</small><b id="'+u+'H"></b></div><div class="ro wide"><small>Reading</small><b id="'+u+'l" style="font-size:14px;font-family:var(--f-body)"></b></div></div></div>';
 const draw=()=>{const p=+$(u+'c').value,hc=+$(u+'h').value;$(u+'co').textContent=p+' mmHg ('+(p/KPA).toFixed(1)+' kPa)';$(u+'ho').textContent=hc;
  const ph=phFrom(hc,p),ratio=hc/(0.03*p);$(u+'ph').textContent=ph.toFixed(2);$(u+'ra').textContent=ratio.toFixed(1)+' : 1';$(u+'H').textContent=Math.round(24*p/hc)+' nmol/L';
  const o=interp({pH:r2(ph),pco2:p,hco3:hc});$(u+'l').textContent=o.err?'':o.label+(o.r&&o.r.rq?'':'');
  const {x,w,h}=fitCanvas($(u+'v'),170);x.clearRect(0,0,w,h);const cx=w/2,cy=96;
  const ang=Math.max(-0.42,Math.min(0.42,Math.log10(ratio/20)*0.9));
  x.fillStyle=tok('--line');x.beginPath();x.moveTo(cx,cy);x.lineTo(cx-20,cy+52);x.lineTo(cx+20,cy+52);x.closePath();x.fill();
  const L=Math.min(260,w*0.42);x.save();x.translate(cx,cy);x.rotate(-ang);x.strokeStyle=tok('--fg');x.lineWidth=4;x.beginPath();x.moveTo(-L,0);x.lineTo(L,0);x.stroke();
  const pan=(sx,val,lab,col)=>{const r=Math.max(10,Math.min(44,Math.sqrt(val)*9));x.save();x.translate(sx,0);x.rotate(ang);x.fillStyle=col;x.beginPath();x.arc(0,-r-2,r,0,Math.PI*2);x.fill();x.fillStyle=tok('--fg');x.font='600 12px '+tok('--f-mono');x.textAlign='center';x.fillText(lab,0,-2*r-10);x.restore();};
  pan(-L+20,hc,'HCO₃⁻ '+hc,tok('--b-base'));pan(L-20,0.03*p*20,'0.03×PCO₂ ×20',tok('--b-acid'));x.restore();
  x.font='600 11px '+tok('--f-mono');x.fillStyle=tok('--muted');x.textAlign='left';x.fillText('KIDNEY · base side',8,h-8);x.textAlign='right';x.fillText('LUNGS · acid side',w-8,h-8);
  x.textAlign='center';x.fillStyle=ph<7.35?tok('--bad'):ph>7.45?tok('--accent-ink'):tok('--good');x.font='700 13px '+tok('--f-mono');x.fillText(ph<7.35?'tips to acid':ph>7.45?'tips to alkali':'balanced',cx,16);};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw));
 el.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{const [p,hc]=b.dataset.p.split(',');$(u+'c').value=p;$(u+'h').value=hc;draw();}));
 draw();onRz(el,draw);}};

/* Davenport-style acid–base map */
function bandPoly(fn,from,to,steps){const up=[],lo=[];for(let i=0;i<=steps;i++){const t=from+(to-from)*i/steps;const b=fn(t);up.push(b[0]);lo.push(b[1]);}return up.concat(lo.reverse());}
const MAPB=[
 {n:'Met acidosis',c:'--b1',poly:()=>bandPoly(h=>{const e=1.5*h+8;return [[phFrom(h,Math.max(8,e-2)),h],[phFrom(h,e+2),h]];},3,24,30),lab:[7.12,7]},
 {n:'Met alkalosis',c:'--b2',poly:()=>bandPoly(h=>{const e=Math.min(60,0.7*h+20);return [[phFrom(h,e-5),h],[phFrom(h,e+5),h]];},24,48,30),lab:[7.5,42]},
 {n:'Acute resp acidosis',c:'--b3',poly:()=>bandPoly(p=>{const e=24+(p-40)/10;return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},40,110,30),lab:[7.04,30]},
 {n:'Chronic resp acidosis',c:'--b4',poly:()=>bandPoly(p=>{const e=24+4*(p-40)/10;return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},40,85,30),lab:[7.3,44]},
 {n:'Acute resp alkalosis',c:'--b5',poly:()=>bandPoly(p=>{const e=24-2*(40-p)/10;return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},15,40,30),lab:[7.62,17]},
 {n:'Chronic resp alkalosis',c:'--b6',poly:()=>bandPoly(p=>{const e=Math.max(12,24-5*(40-p)/10);return [[phFrom(e+2,p),e+2],[phFrom(e-2,p),e-2]];},18,40,30),lab:[7.5,10]}];
function drawMap(cv,pts,hgt){const {x,w,h}=fitCanvas(cv,hgt||340);x.clearRect(0,0,w,h);
 const ml=40,mr=12,mt=12,mb=34,X0=6.95,X1=7.75,Y1=50;const sx=v=>ml+(w-ml-mr)*(v-X0)/(X1-X0),sy=v=>mt+(h-mt-mb)*(1-v/Y1);
 x.save();x.beginPath();x.rect(ml,mt,w-ml-mr,h-mt-mb);x.clip();
 x.fillStyle=tok('--good-soft');x.fillRect(sx(7.35),sy(26),sx(7.45)-sx(7.35),sy(22)-sy(26));
 MAPB.forEach(b=>{const pp=b.poly();x.fillStyle=tok(b.c);x.globalAlpha=.32;x.beginPath();pp.forEach((p,i)=>i?x.lineTo(sx(p[0]),sy(p[1])):x.moveTo(sx(p[0]),sy(p[1])));x.closePath();x.fill();x.globalAlpha=1;});
 x.strokeStyle=tok('--line');x.lineWidth=1;x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');
 [15,20,30,40,60,80,100].forEach(p=>{x.beginPath();let first=true;for(let ph=X0;ph<=X1;ph+=0.01){const hc=hFrom(ph,p);if(hc>Y1)break;const X=sx(ph),Y=sy(hc);first?x.moveTo(X,Y):x.lineTo(X,Y);first=false;}x.setLineDash(p===40?[]:[3,3]);x.strokeStyle=p===40?tok('--muted'):tok('--line');x.stroke();x.setLineDash([]);
   let ph=X1;let hc=hFrom(ph,p);if(hc>Y1-2){ph=6.1+Math.log10((Y1-3)/(0.03*p));hc=Y1-3;}x.fillText(S.units==='kPa'?(p/KPA).toFixed(1):p,sx(ph)-22,sy(hc)-3);});
 if(w>=560)MAPB.forEach(b=>{x.fillStyle=tok('--fg');x.globalAlpha=.75;x.font='600 10px '+tok('--f-body');x.textAlign='center';x.fillText(b.n,sx(b.lab[0]),sy(b.lab[1]));x.globalAlpha=1;});
 (pts||[]).forEach(p=>{x.fillStyle=tok('--accent');x.strokeStyle=tok('--surface');x.lineWidth=2.5;x.beginPath();x.arc(sx(p.ph),sy(p.h),7,0,Math.PI*2);x.fill();x.stroke();if(p.l){x.fillStyle=tok('--fg');x.font='700 11px '+tok('--f-mono');x.textAlign='left';x.fillText(p.l,sx(p.ph)+10,sy(p.h)-8);}});
 x.restore();
 x.strokeStyle=tok('--line');x.strokeRect(ml,mt,w-ml-mr,h-mt-mb);x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='center';
 for(let ph=7.0;ph<=7.71;ph+=0.1)x.fillText(ph.toFixed(1),sx(ph),h-mb+14);x.fillText('pH',(ml+w-mr)/2,h-4);
 x.textAlign='right';for(let v=0;v<=50;v+=10)x.fillText(v,ml-6,sy(v)+3);x.save();x.translate(11,(mt+h-mb)/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('HCO₃⁻ mmol/L',0,0);x.restore();
 x.textAlign='left';x.fillText('lines: PCO₂ '+PU(),ml+6,h-mb-6);
 if(w<560&&!cv.nextElementSibling){const lg=document.createElement('div');lg.className='mlegend';lg.innerHTML=MAPB.map(b=>'<span><i style="background:var('+b.c+')"></i>'+b.n+'</span>').join('');cv.after(lg);}}
W.map={t:'Acid–base map',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><p class="note" style="margin:0">Each shaded band is where a single disorder with normal compensation lands (95% bands from the classic rules). A point outside every band, or in the gap between two, is a mixed disorder. Drag the sliders and watch the dot move along the PCO₂ lines.</p><div class="ctrls">'+rng(u+'c','PCO₂ (mmHg)',12,110,1,40)+rng(u+'h','HCO₃⁻ (mmol/L)',3,48,0.5,24)+'</div><div class="cvwrap"><canvas id="'+u+'v" aria-label="Acid–base map with compensation bands"></canvas></div><p class="mono muted" id="'+u+'l" style="margin:0;font-size:13px"></p></div>';
 const draw=()=>{const p=+$(u+'c').value,hc=+$(u+'h').value;$(u+'co').textContent=p+' ('+(p/KPA).toFixed(1)+' kPa)';$(u+'ho').textContent=hc;const ph=phFrom(hc,p);drawMap($(u+'v'),[{ph,h:hc,l:ph.toFixed(2)}]);const o=interp({pH:r2(ph),pco2:p,hco3:hc});$(u+'l').textContent='pH '+ph.toFixed(2)+' → '+(o.err?'':o.label);};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw));draw();onRz(el,draw);}};

/* Alveolar gas & A–a */
W.alv={t:'Alveolar gas equation and A–a gradient',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls"><div class="ctrl"><label for="'+u+'a"><span>Altitude</span></label><select id="'+u+'a"><option value="760">Sea level (760 mmHg)</option><option value="707">Riyadh ≈ 610 m (707)</option><option value="580">Abha ≈ 2,270 m (580)</option><option value="565">Aircraft cabin ≈ 2,400 m (565)</option></select></div>'+num(u+'f','FiO₂',0.21,0.01)+num(u+'c','PaCO₂','40',1,'mmHg')+num(u+'o','PaO₂','90',1,'mmHg')+num(u+'g','Age','40',1,'years')+'</div><div class="readout"><div class="ro"><small>PiO₂</small><b id="'+u+'pi"></b></div><div class="ro"><small>PAO₂</small><b id="'+u+'pa"></b></div><div class="ro"><small>A–a</small><b id="'+u+'aa"></b></div><div class="ro"><small>Expected A–a</small><b id="'+u+'ex"></b></div></div><p id="'+u+'v" class="verdict-line"></p></div>';
 const run=()=>{const pt=+$(u+'a').value,f=+$(u+'f').value||0.21,c=+$(u+'c').value,o=+$(u+'o').value,g=+$(u+'g').value;const pi=f*(pt-47),pa=pi-c/0.8,aa=pa-o,ex=g/4+4;
  $(u+'pi').textContent=Math.round(pi);$(u+'pa').textContent=Math.round(pa);$(u+'aa').textContent=Math.round(aa);$(u+'ex').textContent=f<=0.22?'≤ '+Math.round(ex):'n/a on O₂';
  let v;if(aa<-5)v='Negative gradient: check FiO₂, altitude and that the sample is arterial.';else if(f>0.22)v='On supplemental oxygen the A–a widens even in healthy lungs; use P/F = '+Math.round(o/f)+'.';else if(aa<=ex+5)v=o<80?'Hypoxaemia with a normal gradient: hypoventilation or low inspired O₂. The lungs transfer normally.':'Normal gradient.';else v='Raised gradient: V/Q mismatch, shunt or diffusion limitation.';$(u+'v').textContent=v;};
 el.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));run();}};

/* O2 content */
W.o2c={t:'Oxygen content and delivery',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+rng(u+'h','Hb (g/dL)',4,20,0.1,15)+rng(u+'s','SaO₂ (%)',50,100,1,98)+rng(u+'p','PaO₂ (mmHg)',30,600,1,95)+rng(u+'q','Cardiac output (L/min)',1.5,10,0.1,5)+'</div><canvas id="'+u+'v" aria-label="Bound versus dissolved oxygen bar"></canvas><div class="readout"><div class="ro"><small>CaO₂</small><b id="'+u+'ca"></b></div><div class="ro"><small>Dissolved</small><b id="'+u+'d"></b></div><div class="ro"><small>DO₂</small><b id="'+u+'do"></b></div><div class="ro"><small>Of normal</small><b id="'+u+'pc"></b></div></div></div>';
 const run=()=>{const hb=+$(u+'h').value,s=+$(u+'s').value,p=+$(u+'p').value,q=+$(u+'q').value;['h','s','p','q'].forEach(k=>$(u+k+'o').textContent=$(u+k).value);
  const b=1.34*hb*s/100,d=0.003*p,ca=b+d,do2=q*ca*10;$(u+'ca').textContent=ca.toFixed(1)+' mL/dL';$(u+'d').textContent=d.toFixed(2)+' mL/dL';$(u+'do').textContent=Math.round(do2)+' mL/min';$(u+'pc').textContent=Math.round(do2/1000*100)+'%';
  const {x,w,h}=fitCanvas($(u+'v'),56);x.clearRect(0,0,w,h);const sc=v=>(w-32)*v/28;x.fillStyle=tok('--surface-2');x.fillRect(16,14,w-32,22);x.fillStyle=tok('--accent');x.fillRect(16,14,sc(b),22);x.fillStyle=tok('--b5');x.fillRect(16+sc(b),14,Math.max(2,sc(d)),22);
  x.fillStyle=tok('--muted');x.font='500 11px '+tok('--f-mono');x.fillText('Bound to Hb',16,50);x.textAlign='right';x.fillText('normal ≈ 20 mL/dL',16+sc(20),10);x.fillRect(16+sc(20),12,1,26);x.textAlign='left';};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();onRz(el,run);}};

/* Oxyhaemoglobin dissociation curve */
W.odc={t:'Oxyhaemoglobin dissociation curve',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+rng(u+'ph','pH',7.0,7.7,0.01,7.4)+rng(u+'t','Temperature (°C)',33,42,0.1,37)+rng(u+'d','2,3-BPG (mmol/L)',2,9,0.1,5)+rng(u+'co','COHb (%)',0,60,1,0)+rng(u+'p','Mark a PO₂ (mmHg)',10,120,1,60)+'</div><div class="cvwrap"><canvas id="'+u+'v" aria-label="Oxygen dissociation curve"></canvas></div><div class="readout"><div class="ro"><small>P50</small><b id="'+u+'50"></b></div><div class="ro"><small>Sat at mark</small><b id="'+u+'sm"></b></div><div class="ro"><small>Normal at mark</small><b id="'+u+'sn"></b></div><div class="ro"><small>Shift</small><b id="'+u+'sh" style="font-size:15px;font-family:var(--f-body)"></b></div></div><p class="note" style="margin:0">Illustrative model (Hill equation, n = 2.7). Saturation is shown as oxyhaemoglobin as a share of total haemoglobin, so carbon monoxide lowers the ceiling as well as shifting the curve left.</p></div>';
 const hill=(P,p50,mx)=>mx*Math.pow(P,2.7)/(Math.pow(P,2.7)+Math.pow(p50,2.7));
 const run=()=>{const ph=+$(u+'ph').value,t=+$(u+'t').value,d=+$(u+'d').value,co=+$(u+'co').value/100,pm=+$(u+'p').value;['ph','t','d','co','p'].forEach(k=>$(u+k+'o').textContent=$(u+k).value);
  const p50=26.8*Math.pow(10,-0.48*(ph-7.4))*Math.pow(10,0.024*(t-37))*(1+0.07*(d-5))*(1-0.55*co);const mx=1-co;
  $(u+'50').textContent=p50.toFixed(1)+' mmHg';$(u+'sm').textContent=Math.round(hill(pm,p50,mx)*100)+'%';$(u+'sn').textContent=Math.round(hill(pm,26.8,1)*100)+'%';$(u+'sh').textContent=Math.abs(p50-26.8)<0.6?'None':p50>26.8?'Right: easier unloading':'Left: holds O₂ tighter';
  const {x,w,h}=fitCanvas($(u+'v'),300);x.clearRect(0,0,w,h);const ml=36,mr=10,mt=10,mb=30,sx=v=>ml+(w-ml-mr)*v/120,sy=v=>mt+(h-mt-mb)*(1-v);
  x.strokeStyle=tok('--line');x.lineWidth=1;for(let v=0;v<=1.001;v+=0.25){x.beginPath();x.moveTo(ml,sy(v));x.lineTo(w-mr,sy(v));x.stroke();}
  for(let v=0;v<=120;v+=20){x.beginPath();x.moveTo(sx(v),mt);x.lineTo(sx(v),h-mb);x.stroke();}
  const curve=(p5,m,col,dash,lw)=>{x.strokeStyle=col;x.lineWidth=lw;x.setLineDash(dash);x.beginPath();for(let P=0;P<=120;P+=1){const Y=sy(hill(P,p5,m));P?x.lineTo(sx(P),Y):x.moveTo(sx(P),Y);}x.stroke();x.setLineDash([]);};
  curve(26.8,1,tok('--muted'),[5,4],1.5);curve(p50,mx,tok('--accent'),[],3);
  x.fillStyle=tok('--accent');x.beginPath();x.arc(sx(p50),sy(mx/2),4,0,7);x.fill();
  x.strokeStyle=tok('--fg');x.setLineDash([2,3]);x.beginPath();x.moveTo(sx(pm),h-mb);x.lineTo(sx(pm),sy(hill(pm,p50,mx)));x.lineTo(ml,sy(hill(pm,p50,mx)));x.stroke();x.setLineDash([]);
  x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='center';for(let v=0;v<=120;v+=20)x.fillText(v,sx(v),h-mb+13);x.fillText('PO₂ mmHg',(ml+w)/2,h-3);x.textAlign='right';for(let v=0;v<=1.001;v+=0.25)x.fillText(Math.round(v*100),ml-5,sy(v)+3);
  x.textAlign='left';x.fillText('dashed = normal',ml+6,sy(0.06));};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();onRz(el,run);}};

/* Red cell animation */
W.rbc={t:'Inside the red cell: CO₂, H⁺, HCO₃⁻, Cl⁻ and O₂',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="btnrow"><div class="seg" role="group" aria-label="Location"><button class="tool" id="'+u+'t" aria-pressed="true">In the tissues</button><button class="tool" id="'+u+'l" aria-pressed="false">In the lung</button></div><button class="tool" id="'+u+'pp">Pause</button></div><div class="cvwrap"><canvas id="'+u+'v" aria-label="Animated red cell showing gas and ion movement"></canvas></div><ol class="look" id="'+u+'s"></ol></div>';
 let mode='t',parts=[],last=0,spawnT=0,run=true,raf=0;
 const STEPS={t:['CO₂ diffuses from the tissue into the red cell.','Carbonic anhydrase turns CO₂ + H₂O into H⁺ + HCO₃⁻.','HCO₃⁻ leaves through band 3 as Cl⁻ comes in (chloride shift).','H⁺ binds haemoglobin, which lowers its affinity for O₂ (Bohr effect).','O₂ is released to the tissue.'],l:['O₂ diffuses in from the alveolus and binds haemoglobin.','Oxygenated Hb releases H⁺ and carbamino CO₂ (Haldane effect).','HCO₃⁻ re-enters through band 3 as Cl⁻ leaves.','Carbonic anhydrase recombines H⁺ + HCO₃⁻ into CO₂ + H₂O.','CO₂ diffuses out into the alveolus and is exhaled.']};
 const setMode=m=>{mode=m;parts=[];$(u+'t').setAttribute('aria-pressed',m==='t');$(u+'l').setAttribute('aria-pressed',m==='l');$(u+'s').innerHTML=STEPS[m].map(s=>'<li>'+s+'</li>').join('');if(!run)frame(performance.now(),true);};
 const G=()=>{const cv=$(u+'v');const w=cv.clientWidth||600,h=280;return {w,h,cx:w/2,cy:h*0.47,rx:Math.min(170,w*0.3),ry:62,ca:[w/2-Math.min(170,w*0.3)*0.45,h*0.47],hb:[w/2+Math.min(170,w*0.3)*0.1,h*0.47],b3:[w/2+Math.min(170,w*0.3)*0.95,h*0.47-30]};};
 const spawn=(now)=>{const g=G();const out=(y)=>[g.cx-g.rx*0.4+Math.random()*g.rx*0.9,y];
  if(mode==='t'){const s=out(g.h-12);parts.push({l:'CO₂',c:'--b3',pts:[s,[g.ca[0],g.cy+g.ry-8],g.ca],t0:now,d:1600});
   parts.push({l:'H⁺',c:'--bad',pts:[g.ca,g.hb],t0:now+1600,d:900});
   parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.b3,[g.w-20,16]],t0:now+1600,d:1500});
   parts.push({l:'Cl⁻',c:'--b5',pts:[[g.w-60,12],[g.b3[0],g.b3[1]-6],[g.cx+g.rx*0.5,g.cy-20]],t0:now+1700,d:1400});
   parts.push({l:'O₂',c:'--accent',pts:[g.hb,[g.hb[0]+10,g.cy+g.ry-4],out(g.h-8)],t0:now+2400,d:1400});}
  else{const s=out(g.h-12);parts.push({l:'O₂',c:'--accent',pts:[s,[g.hb[0]-6,g.cy+g.ry-6],g.hb],t0:now,d:1500});
   parts.push({l:'H⁺',c:'--bad',pts:[g.hb,g.ca],t0:now+1400,d:900});
   parts.push({l:'HCO₃⁻',c:'--b2',pts:[[g.w-20,16],g.b3,g.ca],t0:now+800,d:1500});
   parts.push({l:'Cl⁻',c:'--b5',pts:[[g.cx+g.rx*0.5,g.cy-20],[g.b3[0],g.b3[1]-6],[g.w-60,12]],t0:now+900,d:1400});
   parts.push({l:'CO₂',c:'--b3',pts:[g.ca,[g.ca[0],g.cy+g.ry-8],out(g.h-8)],t0:now+2300,d:1500});}};
 const at=(p,t)=>{const n=p.pts.length-1;const k=Math.min(n-1e-6,t*n);const i=Math.floor(k),f=k-i;const e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;const a=p.pts[i],b=p.pts[i+1];return [a[0]+(b[0]-a[0])*e,a[1]+(b[1]-a[1])*e];};
 let paused=false;addEventListener('buffer:show',()=>{if(paused&&run){paused=false;raf=requestAnimationFrame(t=>frame(t));}});
 const frame=(now,still)=>{const cv=$(u+'v');if(!cv||!cv.isConnected){cancelAnimationFrame(raf);return;}if(!still&&cv.offsetParent===null){paused=true;return;}
  const {x,w,h}=fitCanvas(cv,280);const g=G();x.clearRect(0,0,w,h);
  x.fillStyle=tok('--surface-2');x.fillRect(0,0,w,40);x.fillStyle=tok('--muted');x.font='600 11px '+tok('--f-mono');x.fillText('PLASMA',10,24);
  x.fillStyle=mode==='t'?tok('--h-rest'):tok('--b5-soft');x.fillRect(0,h-36,w,36);x.fillStyle=tok('--fg');x.fillText(mode==='t'?'TISSUE (respiring cells)':'ALVEOLUS (air)',10,h-14);
  x.fillStyle=tok('--rbc');x.strokeStyle=tok('--rbc-edge');x.lineWidth=3;x.beginPath();x.ellipse(g.cx,g.cy,g.rx,g.ry,0,0,7);x.fill();x.stroke();
  x.fillStyle=tok('--surface');x.globalAlpha=.85;x.beginPath();x.arc(g.ca[0],g.ca[1],22,0,7);x.fill();x.beginPath();x.arc(g.hb[0],g.hb[1],24,0,7);x.fill();x.globalAlpha=1;
  x.fillStyle=tok('--fg');x.font='700 11px '+tok('--f-mono');x.textAlign='center';x.fillText('CA',g.ca[0],g.ca[1]+4);x.fillText('Hb',g.hb[0],g.hb[1]+4);
  x.fillStyle=tok('--fg');x.fillRect(g.b3[0]-5,g.b3[1]-14,10,28);x.font='500 10px '+tok('--f-mono');x.fillText('band 3',g.b3[0],g.b3[1]+26);
  if(!still){if(now-spawnT>1300){spawn(now);spawnT=now;}}
  else if(!parts.length){const n=performance.now();spawn(n-1200);spawn(n-2600);}
  parts=parts.filter(p=>now-p.t0<p.d+50);
  parts.forEach(p=>{const t=(now-p.t0)/p.d;if(t<0)return;const [px,py]=at(p,Math.min(1,t));x.fillStyle=tok(p.c);x.beginPath();x.arc(px,py,11,0,7);x.fill();x.fillStyle='#fff';x.font='700 9px '+tok('--f-mono');x.fillText(p.l,px,py+3);});
  x.textAlign='left';if(run&&!still)raf=requestAnimationFrame(t=>frame(t));};
 $(u+'t').addEventListener('click',()=>setMode('t'));$(u+'l').addEventListener('click',()=>setMode('l'));
 $(u+'pp').addEventListener('click',()=>{run=!run;$(u+'pp').textContent=run?'Pause':'Play';if(run)raf=requestAnimationFrame(t=>frame(t));});
 setMode('t');if(RM()){run=false;$(u+'pp').textContent='Play';frame(performance.now(),true);}else raf=requestAnimationFrame(t=>frame(t));}};

/* Compensation calculator */
W.comp={t:'Compensation calculator',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls"><div class="ctrl"><label for="'+u+'d"><span>Primary disorder</span></label><select id="'+u+'d"><option value="mac">Metabolic acidosis</option><option value="malk">Metabolic alkalosis</option><option value="rac">Respiratory acidosis</option><option value="ralk">Respiratory alkalosis</option></select></div>'+num(u+'h','HCO₃⁻',12,0.1,'mmol/L')+num(u+'c','PCO₂',26,1,'mmHg')+'</div><div class="readout"><div class="ro wide"><small>Expected</small><b id="'+u+'e" style="font-size:15px;font-family:var(--f-body)"></b></div></div><p class="verdict-line" id="'+u+'v"></p></div>';
 const run=()=>{const d=$(u+'d').value,h=+$(u+'h').value,c=+$(u+'c').value;let e='',v='';
  if(d==='mac'){const x=1.5*h+8;e='PCO₂ '+r1(x-2)+'–'+r1(x+2)+' mmHg (Winter\'s)';v=c>x+2?'PCO₂ too high → added respiratory acidosis':c<x-2?'PCO₂ too low → added respiratory alkalosis':'Appropriately compensated';}
  if(d==='malk'){const x=0.7*h+20;e='PCO₂ '+r1(x-5)+'–'+r1(x+5)+' mmHg';v=c>x+5?'PCO₂ too high → added respiratory acidosis':c<x-5?'PCO₂ too low → added respiratory alkalosis':'Appropriately compensated';}
  if(d==='rac'){const dd=(c-40)/10,a=24+dd,ch=24+4*dd;e='HCO₃⁻ acute ≈ '+r1(a)+', chronic ≈ '+r1(ch);const o=interp({pH:r2(phFrom(h,c)),pco2:c,hco3:h});v=o.err||!o.steps?'Check the numbers.':o.steps.find(s=>s.k==='comp')?.v||'Check the numbers.';}
  if(d==='ralk'){const dd=(40-c)/10,a=24-2*dd,ch=24-5*dd;e='HCO₃⁻ acute ≈ '+r1(a)+', chronic ≈ '+r1(ch);const o=interp({pH:r2(phFrom(h,c)),pco2:c,hco3:h});v=o.err||!o.steps?'Check the numbers.':o.steps.find(s=>s.k==='comp')?.v||'Check the numbers.';}
  $(u+'e').textContent=e;$(u+'v').textContent=v+' · pH '+phFrom(h,c).toFixed(2);};
 el.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));run();}};

/* AG calculator */
W.agc={t:'Anion gap, delta ratio and osmolar gap',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+num(u+'n','Na⁺',138,1,'mmol/L')+num(u+'c','Cl⁻',100,1,'mmol/L')+num(u+'h','HCO₃⁻',12,0.1,'mmol/L')+num(u+'a','Albumin',30,1,'g/L')+num(u+'g','Glucose',6,0.1,'mmol/L')+num(u+'u','Urea',5,0.1,'mmol/L')+num(u+'o','Measured osm',300,1,'mOsm/kg')+'</div><div class="readout"><div class="ro"><small>AG</small><b id="'+u+'ag"></b></div><div class="ro"><small>Corrected AG</small><b id="'+u+'agc"></b></div><div class="ro"><small>Δ ratio</small><b id="'+u+'dr"></b></div><div class="ro"><small>Osmolar gap</small><b id="'+u+'og"></b></div></div><p class="verdict-line" id="'+u+'v"></p></div>';
 const run=()=>{const n=+$(u+'n').value,c=+$(u+'c').value,h=+$(u+'h').value,a=$(u+'a').value===''?40:+$(u+'a').value,g=+$(u+'g').value,ur=+$(u+'u').value,o=+$(u+'o').value;
  const ag=n-c-h,agc=ag+0.25*(40-a),dr=h<24?(agc-12)/(24-h):null,og=o?o-(2*n+g+ur):null;
  $(u+'ag').textContent=r1(ag);$(u+'agc').textContent=r1(agc);$(u+'dr').textContent=dr==null?'—':dr.toFixed(2);$(u+'og').textContent=og==null?'—':r1(og);
  let v=agc>14?'High anion gap':'Normal anion gap';if(agc>14&&dr!=null)v+=dr<0.4?'; Δ < 0.4: NAGMA dominant':dr<0.8?'; Δ 0.4–0.8: HAGMA + NAGMA':dr<=2?'; Δ 0.8–2: pure HAGMA':'; Δ > 2: HAGMA + metabolic alkalosis';if(og!=null&&og>10)v+='. Osmolar gap raised: toxic alcohol?';$(u+'v').textContent=v+'.';};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();}};

function mountW(el,id){if(!W[id])return;const card=document.createElement('div');card.className='card wcard';card.innerHTML='<div class="eyebrow">Interactive</div><h3 class="wt">'+W[id].t+'</h3><div></div>';el.appendChild(card);W[id].build(card.lastChild);}

/* Stewart: apparent SID, effective SID and strong ion gap */
W.sid={t:'Stewart: SIDa, SIDe and the strong ion gap',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="ctrls">'+num(u+'na','Na⁺',138,1,'mmol/L')+num(u+'k','K⁺',4,0.1,'mmol/L')+num(u+'ca','Ionised Ca²⁺',1.1,0.01,'mmol/L')+num(u+'mg','Mg²⁺',0.6,0.1,'mmol/L')+num(u+'cl','Cl⁻',110,1,'mmol/L')+num(u+'lac','Lactate',2,0.1,'mmol/L')+num(u+'ph','pH',7.25,0.01,'')+num(u+'h','HCO₃⁻',12,0.1,'mmol/L')+num(u+'alb','Albumin',25,1,'g/L')+num(u+'po','Phosphate',1.2,0.1,'mmol/L')+'</div><div class="readout"><div class="ro"><small>SIDa</small><b id="'+u+'a"></b></div><div class="ro"><small>SIDe</small><b id="'+u+'e"></b></div><div class="ro"><small>SIG</small><b id="'+u+'g"></b></div><div class="ro"><small>Na − Cl</small><b id="'+u+'d"></b></div></div><p class="verdict-line" id="'+u+'v"></p><p class="note">SIDa = Na + K + 2·iCa + 2·Mg − Cl − lactate. Albumin⁻ = alb × (0.123·pH − 0.631); phosphate⁻ = PO₄ × (0.309·pH − 0.469) (Figge). SIDe = HCO₃⁻ + albumin⁻ + phosphate⁻.</p></div>';
 const v=id=>{const x=$(u+id).value;return x===''?0:+x;};
 const run=()=>{const ph=v('ph');const a=v('na')+v('k')+2*v('ca')+2*v('mg')-v('cl')-v('lac');const alb=v('alb')*(0.123*ph-0.631),po=v('po')*(0.309*ph-0.469);const e=v('h')+alb+po,g=a-e,d=v('na')-v('cl');
  $(u+'a').textContent=r1(a);$(u+'e').textContent=r1(e);$(u+'g').textContent=r1(g);$(u+'d').textContent=r1(d);
  const p=[];if(a<38)p.push('low SIDa (acidifying)'+(d<32?', mostly from chloride':''));else if(a>46)p.push('high SIDa (alkalinising)');if(g>3)p.push('SIG '+r1(g)+': unmeasured anions');if(v('alb')<35)p.push('low albumin (alkalinising, hides acid)');
  $(u+'v').textContent=p.length?p.join(' · ')+'.':'Strong ions and weak acids look balanced.';};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run();}};
