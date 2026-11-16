/* ================= 4.5: visual labs — Davenport journeys, dissociation curve in motion, lung model, kidney ================= */
const MAP_GEOM={ml:40,mr:12,mt:12,mb:34,X0:6.95,X1:7.75,Y1:50};
function mapXY(cv){const w=cv.clientWidth||600,h=cv.clientHeight||340,g=MAP_GEOM;return {sx:v=>g.ml+(w-g.ml-g.mr)*(v-g.X0)/(g.X1-g.X0),sy:v=>g.mt+(h-g.mt-g.mb)*(1-v/g.Y1)};}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* Davenport journeys: watch a disorder develop, then compensate */
const DAV={
 mac:{t:'Metabolic acidosis',pts:[[40,24,'Normal'],[40,12,'Acid added: HCO₃⁻ falls along the 40 line'],[26,12,'Lungs compensate: PCO₂ to 1.5 × 12 + 8 = 26']],src:'Winter\'s formula; Albert 1967'},
 malk:{t:'Metabolic alkalosis',pts:[[40,24,'Normal'],[40,36,'Acid lost: HCO₃⁻ rises along the 40 line'],[45,36,'Lungs compensate: PCO₂ to 0.7 × 36 + 20 ≈ 45']],src:'Galla 2000'},
 rac:{t:'Respiratory acidosis',pts:[[40,24,'Normal'],[70,27,'Acute: blood buffers add 1 mmol/L per 10 mmHg'],[70,36,'Chronic: kidneys add 4 per 10 mmHg over days']],src:'Brackett 1965; Epstein 2001'},
 ralk:{t:'Respiratory alkalosis',pts:[[40,24,'Normal'],[25,21,'Acute: HCO₃⁻ falls 2 per 10 mmHg'],[25,16.5,'Chronic: falls 5 per 10 mmHg']],src:'Foster 2001'},
 mixed:{t:'Mixed: metabolic and respiratory acidosis',pts:[[40,24,'Normal'],[40,14,'Lactic acid: HCO₃⁻ falls'],[55,15,'Lungs fail too (arrest, fatigue): PCO₂ rises instead of falling']],src:'Narins & Emmett 1980'}};
W.dav={t:'Davenport journeys: watch a disorder develop',build(el){const u=uid();let key='mac',t=0,raf=0;
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Disorder">'+Object.keys(DAV).map(k=>'<button class="tool" data-k="'+k+'" aria-pressed="'+(k===key)+'">'+DAV[k].t+'</button>').join('')+'</div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Davenport diagram with the path of the chosen disorder"></canvas></div><div class="btnrow"><button class="btn small primary" id="'+u+'p">Play</button><button class="btn small" id="'+u+'s">Step</button></div><ol class="davsteps" id="'+u+'l"></ol><p class="note">The shaded bands are where each single disorder lands with normal compensation. The path is schematic: the start, the uncompensated point and the compensated point come from the rules, the line between is straight in PCO₂ and HCO₃⁻. Source: <span id="'+u+'src"></span>.</p></div>';
 const D=()=>DAV[key];
 const at=s=>{const p=D().pts,n=p.length-1,k=Math.min(n,Math.max(0,s*n)),i=Math.min(n-1,Math.floor(k)),f=ease(k-i);return [p[i][0]+(p[i+1][0]-p[i][0])*f,p[i][1]+(p[i+1][1]-p[i][1])*f];};
 const draw=()=>{const cv=$(u+'v');if(!cv||!cv.isConnected)return;const [pc,hc]=at(t);const ph=phFrom(hc,pc);drawMap(cv,[{ph,h:hc,l:ph.toFixed(2)}],340);
  const x=cv.getContext('2d'),{sx,sy}=mapXY(cv);x.save();x.strokeStyle=tok('--accent');x.lineWidth=2;x.setLineDash([5,4]);x.beginPath();for(let s=0;s<=t+1e-6;s+=0.01){const [a,b]=at(s);const X=sx(phFrom(b,a)),Y=sy(b);s?x.lineTo(X,Y):x.moveTo(X,Y);}x.stroke();x.setLineDash([]);
  D().pts.forEach((p,i)=>{const X=sx(phFrom(p[1],p[0])),Y=sy(p[1]);x.fillStyle=tok('--fg');x.beginPath();x.arc(X,Y,3.5,0,7);x.fill();x.font='700 10px '+tok('--f-mono');x.fillText(String.fromCharCode(65+i),X-12,Y+14);});x.restore();
  const n=D().pts.length-1,stage=Math.round(t*n);$(u+'l').innerHTML=D().pts.map((p,i)=>'<li class="'+(i<=stage?'on':'')+'"><b>'+String.fromCharCode(65+i)+'</b> pH '+phFrom(p[1],p[0]).toFixed(2)+', PCO₂ '+P(p[0])+' '+PU()+', HCO₃⁻ '+p[1]+'. '+esc(p[2])+'</li>').join('');$(u+'src').textContent=D().src;};
 const play=()=>{cancelAnimationFrame(raf);if(RM()){t=1;draw();return;}t=0;const t0=performance.now();const f=now=>{t=Math.min(1,(now-t0)/4200);draw();if(t<1)raf=requestAnimationFrame(f);};raf=requestAnimationFrame(f);};
 el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{key=b.dataset.k;el.querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b));t=0;draw();});
 $(u+'p').onclick=play;$(u+'s').onclick=()=>{cancelAnimationFrame(raf);const n=D().pts.length-1,st=Math.round(t*n);t=st>=n?0:(st+1)/n;draw();};
 draw();onRz(el,draw);}};

/* the dissociation curve in motion */
const ODCS=[['bohr','Exercising muscle','pH 7.25, 39.5 °C: the curve slides right and the muscle gets more O₂ at the same PO₂.',[7.40,37,5,0],[7.25,39.5,5,0]],
 ['stored','Stored blood','Banked red cells lose 2,3-BPG: the curve shifts left and unloading falls until it regenerates.',[7.40,37,5,0],[7.40,37,1.5,0]],
 ['alt','Days at altitude','2,3-BPG rises: a right shift that helps unloading at low PO₂.',[7.40,37,5,0],[7.44,37,6.8,0]],
 ['co','Carbon monoxide 30%','Capacity falls by 30% and the rest of the curve shifts left: a double hit on delivery.',[7.40,37,5,0],[7.40,37,5,0.3]],
 ['cold','Hypothermia 33 °C','A left shift: haemoglobin holds O₂ more tightly.',[7.40,37,5,0],[7.40,33,5,0]],
 ['hv','Hyperventilation, pH 7.60','Alkalosis shifts the curve left.',[7.40,37,5,0],[7.60,37,5,0]]];
W.odcplay={t:'Dissociation curve in motion',build(el){const u=uid();let sc=ODCS[0],k=1,raf=0;
 const hill=(P,p50,mx)=>mx*Math.pow(P,2.7)/(Math.pow(P,2.7)+Math.pow(p50,2.7));
 const p50of=v=>26.8*Math.pow(10,-0.48*(v[0]-7.4))*Math.pow(10,0.024*(v[1]-37))*(1+0.07*(v[2]-5))*(1-0.55*v[3]);
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Scenario">'+ODCS.map(s=>'<button class="tool" data-k="'+s[0]+'" aria-pressed="'+(s===sc)+'">'+s[1]+'</button>').join('')+'</div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Oxygen dissociation curve shifting"></canvas></div><p class="note" id="'+u+'d"></p><div class="stats"><div><b id="'+u+'p5">—</b><small>P50 mmHg</small></div><div><b id="'+u+'sa">—</b><small>SaO₂ at 100</small></div><div><b id="'+u+'sv">—</b><small>Sat at 40 (tissue)</small></div><div><b id="'+u+'un">—</b><small>O₂ unloaded, % of capacity</small></div></div><div class="btnrow"><button class="btn small primary" id="'+u+'p">Replay</button></div><p class="note">Model: Hill curve, n = 2.7, P50 26.8 mmHg, with approximate shift factors. Unloading is SaO₂ at 100 minus saturation at 40 mmHg. Source: Severinghaus 1966; Weaver 2009.</p></div>';
 const draw=()=>{const cv=$(u+'v');if(!cv||!cv.isConnected)return;const a=sc[3],b=sc[4];const v=a.map((x,i)=>x+(b[i]-x)*ease(k));const p50=p50of(v),mx=1-v[3];
  const {x,w,h}=fitCanvas(cv,300);x.clearRect(0,0,w,h);const ml=36,mr=10,mt=10,mb=30,sx=q=>ml+(w-ml-mr)*q/120,sy=q=>mt+(h-mt-mb)*(1-q);
  x.strokeStyle=tok('--line');x.lineWidth=1;for(let q=0;q<=1.001;q+=0.25){x.beginPath();x.moveTo(ml,sy(q));x.lineTo(w-mr,sy(q));x.stroke();}
  x.fillStyle=tok('--accent-soft');x.fillRect(sx(40),mt,sx(100)-sx(40),h-mt-mb);
  const curve=(p5,m,col,dash,lw)=>{x.strokeStyle=col;x.lineWidth=lw;x.setLineDash(dash);x.beginPath();for(let q=0;q<=120;q++){const Y=sy(hill(q,p5,m));q?x.lineTo(sx(q),Y):x.moveTo(sx(q),Y);}x.stroke();x.setLineDash([]);};
  curve(26.8,1,tok('--muted'),[5,4],1.5);curve(p50,mx,tok('--accent'),[],3);
  [40,100].forEach(q=>{const Y=sy(hill(q,p50,mx));x.fillStyle=tok('--fg');x.beginPath();x.arc(sx(q),Y,4,0,7);x.fill();});
  x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='center';for(let q=0;q<=120;q+=20)x.fillText(q,sx(q),h-mb+13);x.fillText('PO₂ mmHg (shaded: lung 100 → tissue 40)',(ml+w)/2,h-3);x.textAlign='right';for(let q=0;q<=1.001;q+=0.25)x.fillText(Math.round(q*100),ml-5,sy(q)+3);x.textAlign='left';
  const sa=hill(100,p50,mx),sv=hill(40,p50,mx);$(u+'p5').textContent=p50.toFixed(1);$(u+'sa').textContent=Math.round(sa*100)+'%';$(u+'sv').textContent=Math.round(sv*100)+'%';$(u+'un').textContent=Math.round((sa-sv)*100)+'%';$(u+'d').textContent=sc[2];};
 const play=()=>{cancelAnimationFrame(raf);if(RM()){k=1;draw();return;}k=0;const t0=performance.now();const f=now=>{k=Math.min(1,(now-t0)/1800);draw();if(k<1)raf=requestAnimationFrame(f);};raf=requestAnimationFrame(f);};
 el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sc=ODCS.find(s=>s[0]===b.dataset.k);el.querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b));play();});
 $(u+'p').onclick=play;draw();onRz(el,draw);}};

/* lung model: two alveolar units, shunt and dead space, solved by mass balance */
const VQM={Hb:15,PvO2:40,PvCO2:46};
const satP=p=>p<=0?0:1/(1+23400/(p*p*p+150*p));
const cO2=p=>1.34*VQM.Hb*satP(p)+0.003*p;
const cCO2=p=>0.5*p+28;
function pFromCO2content(c,hi){let lo=0;hi=hi||700;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(cO2(m)<c)lo=m;else hi=m;}return (lo+hi)/2;}
function vqUnit(VA,Q,fio2,pb){const PI=fio2*(pb-47);if(Q<=1e-6)return {pao2:PI-0,paco2:0,cc:null,ccc:null};if(VA<=1e-6)return {pao2:VQM.PvO2,paco2:VQM.PvCO2,cc:cO2(VQM.PvO2),ccc:cCO2(VQM.PvCO2)};
 const k=0.005*Q;const paco2=k*VQM.PvCO2/(VA/(pb-47)+k);const fac=paco2/(pb-47);const cv=cO2(VQM.PvO2);
 const g=pa=>{const fa=pa/(pb-47);const gas=VA*((1-fa-fac)*fio2/(1-fio2)-fa);const blood=Q*0.01*(cO2(pa)-cv);return gas-blood;};
 let lo=VQM.PvO2,hi=PI;for(let i=0;i<70;i++){const m=(lo+hi)/2;if(g(m)>0)lo=m;else hi=m;}const pao2=(lo+hi)/2;return {pao2,paco2,cc:cO2(pao2),ccc:cCO2(paco2)};}
function vqSolve(o){const pb=o.pb||760,fio2=Math.min(0.95,o.fio2),Q=5,VE=o.ve||6.5;const qs=Q*o.shunt,qp=Q-qs,VA=VE*(1-o.dead);
 const qa=qp*(1-o.qb),qb=qp*o.qb,va=VA*(1-o.vb),vb=VA*o.vb;const A=vqUnit(va,qa,fio2,pb),B=vqUnit(vb,qb,fio2,pb);
 const ccv=cO2(VQM.PvO2),cvc=cCO2(VQM.PvCO2);const ca=((A.cc!=null?qa*A.cc:0)+(B.cc!=null?qb*B.cc:0)+qs*ccv)/Q,cac=((A.ccc!=null?qa*A.ccc:0)+(B.ccc!=null?qb*B.ccc:0)+qs*cvc)/Q;
 const pao2=pFromCO2content(ca),paco2=(cac-28)/0.5;const perfV=(qa>1e-6?va:0)+(qb>1e-6?vb:0);const et=VA>0?((qa>1e-6?va*A.paco2:0)+(qb>1e-6?vb*B.paco2:0))/VA:0;
 const PAid=fio2*(pb-47)-paco2/0.8;return {A,B,qa,qb,va,vb,qs,pao2,paco2,sao2:satP(pao2),et,aa:PAid-pao2,PAid,vqa:qa?va/qa:Infinity,vqb:qb?vb/qb:Infinity};}
const VQP=[['norm','Normal',{qb:.5,vb:.5,shunt:.02,dead:.3,fio2:.21}],['pneu','Pneumonia: low V/Q',{qb:.5,vb:.1,shunt:.05,dead:.3,fio2:.21}],['ards','Shunt: ARDS or collapse',{qb:.5,vb:.5,shunt:.35,dead:.35,fio2:.21}],['pe','PE: high V/Q and dead space',{qb:.08,vb:.5,shunt:.02,dead:.45,fio2:.21}],['copd','COPD: mixed V/Q',{qb:.6,vb:.25,shunt:.03,dead:.45,fio2:.21}]];
W.vq={t:'Lung model: V/Q, shunt and dead space',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Preset">'+VQP.map((p,i)=>'<button class="tool" data-p="'+p[0]+'" aria-pressed="'+(i===0)+'">'+p[1]+'</button>').join('')+'</div><div class="ctrls">'+rng(u+'qb','Blood flow to unit B (%)',0,100,1,50)+rng(u+'vb','Ventilation to unit B (%)',0,100,1,50)+rng(u+'sh','True shunt (% of flow)',0,60,1,2)+rng(u+'de','Dead space (% of ventilation)',10,80,1,30)+rng(u+'fi','FiO₂ (%)',21,95,1,21)+'</div>'+
  '<div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Two lung units with their blood flow, a shunt and dead space"></canvas></div>'+
  '<div class="stats"><div><b id="'+u+'po">—</b><small>PaO₂ '+PU()+'</small></div><div><b id="'+u+'sa">—</b><small>SaO₂</small></div><div><b id="'+u+'pc">—</b><small>PaCO₂ '+PU()+'</small></div><div><b id="'+u+'aa">—</b><small>A–a gradient</small></div><div><b id="'+u+'et">—</b><small>end-tidal CO₂</small></div><div><b id="'+u+'pf">—</b><small>P/F</small></div></div><p class="note" id="'+u+'say"></p>'+
  '<p class="note">Model: two alveolar units plus a shunt and dead space, solved by O₂ and CO₂ mass balance with the nitrogen correction. Mixed venous PO₂ 40 and PCO₂ 46 are held fixed and the CO₂ curve is linear, so it shows direction and size of effects, not exact values. In a real patient the mixed venous values move, and the brain raises ventilation when CO₂ climbs. Sources: West, Respiratory Physiology; Nunn.</p></div>';
 const ids=['qb','vb','sh','de','fi'];
 const run=()=>{ids.forEach(k=>$(u+k+'o').textContent=$(u+k).value+'%');const o={qb:+$(u+'qb').value/100,vb:+$(u+'vb').value/100,shunt:+$(u+'sh').value/100,dead:+$(u+'de').value/100,fio2:+$(u+'fi').value/100,pb:S.patm||760};const r=vqSolve(o);
  $(u+'po').textContent=P(r.pao2);$(u+'sa').textContent=Math.round(r.sao2*100)+'%';$(u+'pc').textContent=P(r.paco2);$(u+'aa').textContent=o.fio2<=0.21?P(Math.max(0,r.aa)):'on O₂';$(u+'et').textContent=P(r.et);$(u+'pf').textContent=Math.round(r.pao2/o.fio2);
  const say=[];if(o.shunt>=0.2)say.push('Shunted blood never meets gas, so more oxygen helps little: try FiO₂ 95%.');if(Math.min(r.vqa,r.vqb)<0.3)say.push('A low V/Q unit lowers the PaO₂, but extra oxygen still reaches it, so FiO₂ helps.');if(Math.max(r.vqa,r.vqb)>5||o.dead>=0.45)say.push('High V/Q and dead space waste ventilation: the gap between PaCO₂ and end-tidal CO₂ widens ('+P(r.paco2-r.et)+' '+PU()+').');if(r.paco2>45)say.push('PaCO₂ is high here because the minute ventilation is held fixed; a real patient breathes harder.');
  $(u+'say').textContent=say.join(' ');drawVQ($(u+'v'),r,o);};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{el.querySelectorAll('[data-p]').forEach(x=>x.setAttribute('aria-pressed','false'));run();}));
 el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=VQP.find(x=>x[0]===b.dataset.p)[2];$(u+'qb').value=p.qb*100;$(u+'vb').value=p.vb*100;$(u+'sh').value=p.shunt*100;$(u+'de').value=p.dead*100;$(u+'fi').value=p.fio2*100;el.querySelectorAll('[data-p]').forEach(x=>x.setAttribute('aria-pressed',x===b));run();});
 run();onRz(el,run);}};
function satCol(s){const h=Math.round(220+(360-220)*Math.max(0,Math.min(1,(s-0.6)/0.4)));return 'hsl('+(h%360)+',70%,'+(45+10*s)+'%)';}
function drawVQ(cv,r,o){const {x,w,h}=fitCanvas(cv,260);x.clearRect(0,0,w,h);const cxA=w*0.3,cxB=w*0.7,cy=86;const f='600 11px '+tok('--f-mono');
 const VAt=r.va+r.vb||1,Qt=5;[[cxA,r.va,r.qa,r.A,'A',r.vqa],[cxB,r.vb,r.qb,r.B,'B',r.vqb]].forEach(([cx,va,q,U,n,vq])=>{const rad=14+46*Math.sqrt(va/VAt);
  x.strokeStyle=tok('--muted');x.lineWidth=2;x.beginPath();x.moveTo(cx,0);x.lineTo(cx,cy-rad);x.stroke();
  x.fillStyle=tok('--b5-soft');x.strokeStyle=tok('--line');x.beginPath();x.arc(cx,cy,rad,0,7);x.fill();x.stroke();
  const lw=1+18*(q/Qt);x.strokeStyle=q>1e-6?satCol(satP(U.pao2)):tok('--line');x.lineWidth=lw;x.beginPath();x.moveTo(cx-rad-26,cy+rad+24);x.quadraticCurveTo(cx,cy+rad+2,cx+rad+26,cy+rad+24);x.stroke();
  x.fillStyle=tok('--fg');x.font=f;x.textAlign='center';x.fillText((w<560?n+' ':n+' · ')+'V/Q '+(isFinite(vq)?vq.toFixed(vq<1?2:1):'∞'),cx,cy-4);x.fillStyle=tok('--muted');if(q>1e-6){if(w<560){x.fillText('O₂ '+P(U.pao2),cx,cy+12);x.fillText('CO₂ '+P(U.paco2),cx,cy+26);}else x.fillText('PAO₂ '+P(U.pao2)+' · PACO₂ '+P(U.paco2),cx,cy+12);}else x.fillText('no flow',cx,cy+12);});
 x.strokeStyle=satCol(satP(VQM.PvO2));x.lineWidth=1+18*(r.qs/Qt);x.beginPath();x.moveTo(20,h-36);x.lineTo(w-20,h-36);x.stroke();x.fillStyle=tok('--muted');x.font=f;x.textAlign='left';x.fillText('shunt '+Math.round(o.shunt*100)+'%: venous blood bypasses the alveoli',22,h-14);
 x.fillStyle=tok('--muted');x.textAlign='right';x.fillText('dead space '+Math.round(o.dead*100)+'%',w-8,16);x.textAlign='left';x.fillText('ventilation ↓',8,16);}

/* kidney: reclaiming filtered HCO₃⁻ and making new HCO₃⁻ */
W.kidney={t:'Kidney: reclaiming and making bicarbonate',build(el){const u=uid();let seg='prox',flags={aceta:false,t1:false,t4:false,load:false},parts=[],spawnT=0,run=!RM(),raf=0,paused=false;
 el.innerHTML='<div class="wbox"><div class="seg" role="group" aria-label="Segment"><button class="tool" data-s="prox" aria-pressed="true">Proximal tubule</button><button class="tool" data-s="dist" aria-pressed="false">Collecting duct</button></div>'+
  '<div class="seg wrap" role="group" aria-label="Conditions"><button class="tool" data-f="load" aria-pressed="false">Acid load (DKA)</button><button class="tool" data-f="aceta" aria-pressed="false">Acetazolamide</button><button class="tool" data-f="t1" aria-pressed="false">Type 1 RTA</button><button class="tool" data-f="t4" aria-pressed="false">Low aldosterone (type 4)</button></div>'+
  '<div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Animated tubule cell moving H⁺ and HCO₃⁻"></canvas></div><div class="btnrow"><button class="btn small" id="'+u+'pp">'+(run?'Pause':'Play')+'</button></div>'+
  '<div class="stats kst" id="'+u+'st"></div><ol class="davsteps on" id="'+u+'l"></ol><p class="note">Rates are typical adult figures. Sources: Rose & Post; Soriano 2002; Batlle 1988.</p></div>';
 const TXT={prox:['About 4,300 mmol of HCO₃⁻ is filtered each day (GFR 180 L × 24 mmol/L); 80–90% is reclaimed here.','NHE3 swaps Na⁺ in for H⁺ out into the lumen.','In the lumen, H⁺ + filtered HCO₃⁻ → H₂CO₃ → CO₂ + H₂O (brush-border carbonic anhydrase IV).','CO₂ enters the cell; carbonic anhydrase II makes H⁺ + HCO₃⁻ again.','HCO₃⁻ leaves to the blood through NBCe1. The H⁺ is recycled: no net acid leaves the body here.'],
  dist:['The α-intercalated cell makes H⁺ + HCO₃⁻ from CO₂ (carbonic anhydrase II).','H⁺-ATPase (helped by H⁺/K⁺-ATPase) pumps H⁺ into the lumen; aldosterone boosts it.','Lumen buffers carry it: NH₃ → NH₄⁺ (about two thirds) and HPO₄²⁻ → H₂PO₄⁻ (titratable acid).','Every H⁺ excreted leaves one NEW HCO₃⁻, which exits to the blood via AE1 in exchange for Cl⁻.','Net acid excretion is about 1 mmol/kg/day; NH₄⁺ can rise several-fold in acidosis.']};
 const stats=()=>{const f=flags;let rows;
  if(seg==='prox'){const lost=f.aceta?'High: HCO₃⁻ spills into urine':'Almost none';rows=[['Reclaimed',f.aceta?'Falls sharply':'80–90%'],['Urine HCO₃⁻',lost],['Urine pH',f.aceta?'Above 7 (alkaline)':'Set further down'],['Plasma',f.aceta?'HCO₃⁻ falls: NAGMA (like type 2 RTA)':'HCO₃⁻ held near 24']];}
  else{const nh4=f.t4?'Low (hyperkalaemia blocks ammoniagenesis)':f.load&&!f.t1?'Rises several-fold':'Normal';const uph=f.t1?'Cannot go below 5.5':f.t4?'Can fall below 5.5':f.load?'About 4.5–5':'About 5–6';rows=[['H⁺ pumped',f.t1?'Pump fails':f.t4?'Reduced':f.load?'Increased':'Normal'],['NH₄⁺ excretion',nh4],['Urine pH',uph],['New HCO₃⁻',f.t1||f.t4?'Too little: NAGMA':f.load?'More, to replace what the acid used':'Matches daily acid production'],['K⁺',f.t1?'Often low':f.t4?'High':'Normal']];}
  $(u+'st').innerHTML=rows.map(r=>'<div><b>'+r[1]+'</b><small>'+r[0]+'</small></div>').join('');$(u+'l').innerHTML=TXT[seg].map(s=>'<li>'+s+'</li>').join('');};
 const G=()=>{const cv=$(u+'v');const w=cv.clientWidth||600,h=300;const L0=0,L1=w*0.3,C0=w*0.3,C1=w*0.72,B0=w*0.72;return {w,h,L1,C0,C1,B0,mid:(C0+C1)/2,ca:[(C0+C1)/2,h*0.5],ap:[C0,h*0.35],ap2:[C0,h*0.62],bl:[C1,h*0.5]};};
 const spawn=now=>{const g=G(),f=flags;
  if(seg==='prox'){parts.push({l:'Na⁺',c:'--b5',pts:[[g.L1*0.4,g.h*0.22],g.ap,[g.ca[0]-20,g.ap[1]]],t0:now,d:1400});
   parts.push({l:'H⁺',c:'--bad',pts:[g.ca,[g.ap[0]+4,g.ap[1]+10],[g.L1*0.55,g.h*0.45]],t0:now+200,d:1300});
   const hc={l:'HCO₃⁻',c:'--b2',pts:[[g.L1*0.5,8],[g.L1*0.55,g.h*0.45]],t0:now,d:1500};parts.push(hc);
   if(f.aceta){parts.push({l:'HCO₃⁻',c:'--b2',pts:[[g.L1*0.55,g.h*0.45],[g.L1*0.5,g.h-10]],t0:now+1500,d:1500,lost:1});}
   else{parts.push({l:'CO₂',c:'--b3',pts:[[g.L1*0.55,g.h*0.45],g.ap2,g.ca],t0:now+1500,d:1200});parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.bl,[g.w-24,g.h*0.5]],t0:now+2700,d:1400});}}
  else{const pump=!f.t1;const nh3=!f.t4;parts.push({l:'CO₂',c:'--b3',pts:[[g.w-24,g.h*0.75],g.bl,g.ca],t0:now,d:1200});
   parts.push({l:'H⁺',c:'--bad',pts:pump?[g.ca,g.ap,[g.L1*0.55,g.h*0.35]]:[g.ca,g.ap,g.ca],t0:now+1200,d:1300});
   if(pump){parts.push(nh3?{l:'NH₃',c:'--b4',pts:[[g.L1*0.3,8],[g.L1*0.55,g.h*0.35]],t0:now+1000,d:1500}:{l:'HPO₄',c:'--b4',pts:[[g.L1*0.3,8],[g.L1*0.55,g.h*0.35]],t0:now+1000,d:1500});
    parts.push({l:nh3?'NH₄⁺':'H₂PO₄',c:'--b6',pts:[[g.L1*0.55,g.h*0.35],[g.L1*0.5,g.h-10]],t0:now+2500,d:1500});
    parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.bl,[g.w-24,g.h*0.3]],t0:now+1300,d:1400});parts.push({l:'Cl⁻',c:'--b5',pts:[[g.w-24,g.h*0.36],g.bl,[g.ca[0]+30,g.ca[1]-30]],t0:now+1300,d:1400});}}};
 const at=(p,t)=>{const n=p.pts.length-1;const k=Math.min(n-1e-6,t*n);const i=Math.floor(k),fr=ease(k-i);const a=p.pts[i],b=p.pts[i+1];return [a[0]+(b[0]-a[0])*fr,a[1]+(b[1]-a[1])*fr];};
 addEventListener('buffer:show',()=>{if(paused&&run){paused=false;raf=requestAnimationFrame(frame);}});
 const frame=(now,still)=>{const cv=$(u+'v');if(!cv||!cv.isConnected){cancelAnimationFrame(raf);return;}if(!still&&cv.offsetParent===null){paused=true;return;}
  const {x,w,h}=fitCanvas(cv,300);const g=G();x.clearRect(0,0,w,h);
  x.fillStyle=tok('--b5-soft');x.fillRect(0,0,g.L1,h);x.fillStyle=tok('--surface-2');x.fillRect(g.B0,0,w-g.B0,h);
  x.fillStyle=tok('--h-rest');x.strokeStyle=tok('--line');x.lineWidth=2;x.fillRect(g.C0,16,g.C1-g.C0,h-32);x.strokeRect(g.C0,16,g.C1-g.C0,h-32);
  x.fillStyle=tok('--muted');x.font='600 11px '+tok('--f-mono');x.textAlign='center';x.fillText(w<560?'LUMEN':seg==='prox'?'LUMEN (filtrate)':'LUMEN (urine)',g.L1/2,h-20);x.fillText(seg==='prox'?(w<560?'PROXIMAL':'PROXIMAL CELL'):(w<560?'α-CELL':'α-INTERCALATED CELL'),g.mid,32);x.fillText('BLOOD',(g.B0+w)/2,h-20);
  x.fillStyle=tok('--surface');x.beginPath();x.arc(g.ca[0],g.ca[1],22,0,7);x.fill();x.fillStyle=tok(flags.aceta&&seg==='prox'?'--bad':'--fg');x.font='700 11px '+tok('--f-mono');x.fillText(flags.aceta&&seg==='prox'?'CA ✕':'CA',g.ca[0],g.ca[1]+4);
  const tr=(p,lab,bad)=>{x.fillStyle=tok(bad?'--bad':'--fg');x.fillRect(p[0]-5,p[1]-12,10,24);x.font='500 10px '+tok('--f-mono');x.fillText(lab,p[0]+(p[0]<g.mid?-30:30),p[1]+4);};
  if(seg==='prox'){tr(g.ap,'NHE3');tr(g.bl,'NBCe1');}else{tr(g.ap,flags.t1?'pump ✕':'H⁺-ATPase',flags.t1);tr(g.bl,'AE1');}
  const gap=flags.load?700:1300;if(!still){if(now-spawnT>gap){spawn(now);spawnT=now;}}else if(!parts.length){const n=performance.now();spawn(n-1500);spawn(n-2900);}
  parts=parts.filter(p=>now-p.t0<p.d+50);
  parts.forEach(p=>{const t=(now-p.t0)/p.d;if(t<0)return;const [px,py]=at(p,Math.min(1,t));x.fillStyle=tok(p.c);x.beginPath();x.arc(px,py,12,0,7);x.fill();if(p.lost){x.strokeStyle=tok('--bad');x.lineWidth=2;x.stroke();}x.fillStyle='#fff';x.font='700 8.5px '+tok('--f-mono');x.textAlign='center';x.fillText(p.l,px,py+3);});
  x.textAlign='left';if(run&&!still)raf=requestAnimationFrame(t=>frame(t));};
 const redraw=()=>{parts=[];stats();if(!run)frame(performance.now(),true);};
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{seg=b.dataset.s;el.querySelectorAll('[data-s]').forEach(x=>x.setAttribute('aria-pressed',x===b));redraw();});
 el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const k=b.dataset.f;flags[k]=!flags[k];if(k==='t1'&&flags.t1)flags.t4=false;if(k==='t4'&&flags.t4)flags.t1=false;el.querySelectorAll('[data-f]').forEach(x=>x.setAttribute('aria-pressed',!!flags[x.dataset.f]));redraw();});
 $(u+'pp').onclick=()=>{run=!run;$(u+'pp').textContent=run?'Pause':'Play';if(run)raf=requestAnimationFrame(t=>frame(t));};
 stats();if(run)raf=requestAnimationFrame(t=>frame(t));else frame(performance.now(),true);onRz(el,()=>{if(!run)frame(performance.now(),true);});}};
MODELS.push(['dav','Davenport journeys','Watch each disorder develop, then compensate, on the pH × HCO₃⁻ map.'],['odcplay','Curve in motion','Exercise, stored blood, altitude, CO, cold: see the curve shift and what it does to unloading.'],['vq','Lung model','Two lung units, a shunt and dead space: see why oxygen fixes low V/Q but not shunt.'],['kidney','Kidney and bicarbonate','The proximal tubule reclaims HCO₃⁻, the collecting duct makes new HCO₃⁻. Add acetazolamide or an RTA.']);
/* ventilator lab: settings in, pressures and the next gas out */
const VPAT={normal:{t:'Normal lungs',C:60,R:8,s0:0.03,rec:0,vd:0,h:24},ards:{t:'ARDS',C:25,R:12,s0:0.38,rec:0.6,vd:0.15,h:22},asthma:{t:'Severe asthma',C:50,R:35,s0:0.05,rec:0,vd:0.1,h:24},copd:{t:'COPD, CO₂ retainer',C:55,R:22,s0:0.06,rec:0,vd:0.2,h:34}};
function ventCalc(o){const p=VPAT[o.pat];const pbw=(o.sex==='f'?45.5:50)+0.91*(o.ht-152.4);const tv=o.tv/1000,C=p.C/1000,tau=p.R*C;const cyc=60/o.rr,ti=cyc/(1+o.ie),te=cyc-ti;
 const x=Math.exp(-te/tau);const trap=x>0.999?tv*50:tv*x/(1-x);const ape=Math.min(40,trap/C);const flow=tv/ti;
 const plat=o.peep+ape+tv/C,peak=plat+p.R*flow,dp=plat-o.peep-ape;
 const vdA=(2.2*pbw)/1000,vdFrac=Math.min(0.9,vdA/tv+p.vd);const va=Math.max(0.2,tv*(1-vdFrac)*o.rr);
 const paco2=Math.min(200,0.863*200/va);const hco3=p.h+0.1*(paco2-40);const ph=phFrom(hco3,paco2);
 const recruit=p.rec?Math.max(0.15,1-p.rec*Math.min(1,Math.max(0,(o.peep-5)/13))):1;const shunt=Math.min(0.6,p.s0*recruit+(ape>8?0.04:0));
 const r=vqSolve({qb:.5,vb:.5,shunt,dead:Math.min(0.85,vdFrac),fio2:o.fio2,pb:S.patm||760,ve:tv*o.rr});const hypoTV=Math.max(0,1-o.peep/40);
 return {pbw,mlkg:o.tv/pbw,ve:tv*o.rr,ti,te,tau,ape,plat,peak,dp,paco2,ph,hco3,pao2:r.pao2,sat:satP(r.pao2),shunt,bp:ape>10||o.peep>18?'falling':'ok'};}
W.vent={t:'Ventilator lab',build(el){const u=uid();
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Patient">'+Object.keys(VPAT).map((k,i)=>'<button class="tool" data-p="'+k+'" aria-pressed="'+(i===0)+'">'+VPAT[k].t+'</button>').join('')+'</div>'+
  '<div class="ctrls">'+rng(u+'ht','Height (cm)',145,200,1,175)+'<div class="ctrl"><label for="'+u+'sx"><span>Sex for PBW</span></label><select id="'+u+'sx"><option value="m">Male</option><option value="f">Female</option></select></div>'+rng(u+'tv','Tidal volume (mL)',250,900,10,500)+rng(u+'rr','Rate (/min)',6,40,1,16)+rng(u+'pe','PEEP (cmH₂O)',0,24,1,5)+rng(u+'fi','FiO₂ (%)',21,100,1,40)+rng(u+'ie','I:E (1 : x)',1,6,0.5,2)+'</div>'+
  '<div class="cvwrap"><svg id="'+u+'w" class="ventw" viewBox="0 0 320 120" role="img" aria-label="Airway pressure over two breaths"></svg></div>'+
  '<div class="stats" id="'+u+'s"></div><ul class="nx" id="'+u+'al"></ul>'+
  '<p class="note">Model: single-compartment lung (resistance and compliance), auto-PEEP from the expiratory time constant, PaCO₂ from the alveolar ventilation equation (VCO₂ 200 mL/min, anatomic dead space 2.2 mL/kg PBW plus disease dead space), PaO₂ from the lung model with PEEP recruiting shunt in ARDS. Teaching only. Sources: ARDSNet 2000; Amato 2015; ATS/ESICM/SCCM 2017.</p></div>';
 let pat='normal';const ids=['ht','tv','rr','pe','fi','ie'];
 const run=()=>{ids.forEach(k=>$(u+k+'o').textContent=k==='ie'?'1:'+$(u+k).value:$(u+k).value);const o={pat,ht:+$(u+'ht').value,sex:$(u+'sx').value,tv:+$(u+'tv').value,rr:+$(u+'rr').value,peep:+$(u+'pe').value,fio2:+$(u+'fi').value/100,ie:+$(u+'ie').value};const r=ventCalc(o);
  const st=(l,v,bad)=>'<div'+(bad?' class="bad"':'')+'><b>'+v+'</b><small>'+l+'</small></div>';
  $(u+'s').innerHTML=st('mL/kg PBW ('+Math.round(r.pbw)+' kg)',r.mlkg.toFixed(1),r.mlkg>8)+st('minute ventilation L/min',r.ve.toFixed(1))+st('peak cmH₂O',Math.round(r.peak),r.peak>40)+st('plateau cmH₂O',Math.round(r.plat),r.plat>30)+st('driving pressure',Math.round(r.dp),r.dp>15)+st('auto-PEEP',r.ape.toFixed(1),r.ape>2)+st('PaCO₂ '+PU(),P(r.paco2),r.paco2>60||r.paco2<30)+st('pH',r.ph.toFixed(2),r.ph<7.2||r.ph>7.5)+st('PaO₂ '+PU(),P(r.pao2),r.pao2<55)+st('P/F',Math.round(r.pao2/o.fio2),r.pao2/o.fio2<150);
  const al=[];if(r.mlkg>8)al.push('Tidal volume above 8 mL/kg PBW: aim for 6–8 (6 in ARDS).');if(r.plat>30)al.push('Plateau above 30 cmH₂O: lower the tidal volume.');if(r.dp>15)al.push('Driving pressure above 15: lower the tidal volume or find a better PEEP.');if(r.ape>2)al.push('Auto-PEEP '+r.ape.toFixed(1)+' cmH₂O: lengthen expiration (lower rate, longer I:E).');if(r.ape>10)al.push('Severe air trapping: venous return and blood pressure will fall. Disconnect if crashing.');if(r.ph<7.2)al.push('pH below 7.20: raise minute ventilation if the lung allows, or accept carefully.');if(o.pat==='copd'&&r.ph>7.48)al.push('Over-ventilating a CO₂ retainer: post-hypercapnic alkalosis. Aim for their usual PaCO₂.');if(r.pao2<55)al.push('PaO₂ below 55: raise FiO₂, and PEEP if the lung is recruitable.');if(o.fio2>0.6&&r.pao2>100)al.push('PaO₂ above 100 on high FiO₂: wean the oxygen.');
  $(u+'al').innerHTML=al.length?al.map(a=>'<li>'+esc(a)+'</li>').join(''):'<li>Settings look protective for this patient.</li>';
  const W=320,H=120,mx=Math.max(45,r.peak+5),sy=v=>H-10-(v/mx)*(H-20),cyc=60/o.rr,tt=2*cyc,sx=t=>t/tt*W;let d='';
  for(let b=0;b<2;b++){const t0=b*cyc,base=o.peep+r.ape;d+=(b?' L':'M')+sx(t0)+' '+sy(base)+' L'+sx(t0+0.02)+' '+sy(base+(r.peak-r.plat)*0.6)+' L'+sx(t0+r.ti)+' '+sy(r.peak)+' L'+sx(t0+r.ti+0.05)+' '+sy(r.plat)+' L'+sx(t0+r.ti+0.15)+' '+sy(o.peep+1)+' L'+sx(t0+cyc)+' '+sy(o.peep);}
  $(u+'w').innerHTML='<line x1="0" x2="'+W+'" y1="'+sy(30)+'" y2="'+sy(30)+'" class="lim"/><text x="4" y="'+(sy(30)-3)+'" class="lab">30</text><path d="'+d+'" class="wave"/><text x="4" y="'+(H-1)+'" class="lab">airway pressure, 2 breaths</text>';};
 el.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));
 el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{pat=b.dataset.p;el.querySelectorAll('[data-p]').forEach(x=>x.setAttribute('aria-pressed',x===b));if(pat==='ards'){$(u+'pe').value=10;$(u+'fi').value=60;$(u+'rr').value=22;}else if(pat==='asthma'){$(u+'rr').value=12;$(u+'ie').value=4;$(u+'pe').value=5;}else if(pat==='copd'){$(u+'rr').value=12;$(u+'ie').value=3;$(u+'pe').value=5;$(u+'fi').value=30;}else{$(u+'rr').value=16;$(u+'ie').value=2;$(u+'pe').value=5;$(u+'fi').value=40;}run();});
 run();}};
MODELS.push(['vent','Ventilator lab','Set volume, rate, PEEP, FiO₂ and I:E for normal, ARDS, asthma or COPD lungs: see pressures, auto-PEEP and the next gas.']);
