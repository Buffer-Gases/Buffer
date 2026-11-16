/* ================= 4.5: visual labs — Davenport journeys, dissociation curve in motion, lung model, kidney ================= */
const MAP_GEOM={ml:40,mr:12,mt:12,mb:34,X0:6.95,X1:7.75,Y1:50};
function mapXY(cv){const w=cv.clientWidth||600,h=cv.clientHeight||340,g=MAP_GEOM;return {sx:v=>g.ml+(w-g.ml-g.mr)*(v-g.X0)/(g.X1-g.X0),sy:v=>g.mt+(h-g.mt-g.mb)*(1-v/g.Y1)};}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* Davenport journeys: watch a disorder develop, then compensate */
const DAV={
 mac:{t:'Metabolic acidosis',pts:[[40,24,'Normal'],[40,12,'Acid added: HCO₃⁻ falls along the PCO₂ {40} line'],[26,12,'Lungs compensate: Winter\'s gives PCO₂ 1.5 × 12 + 8 = [26]']],src:'Winter\'s formula; Albert 1967'},
 malk:{t:'Metabolic alkalosis',pts:[[40,24,'Normal'],[40,36,'Acid lost: HCO₃⁻ rises along the PCO₂ {40} line'],[45,36,'Lungs compensate: PCO₂ 0.7 × 36 + 20 ≈ [45]']],src:'Galla 2000'},
 rac:{t:'Respiratory acidosis',pts:[[40,24,'Normal'],[70,27,'Acute: blood buffers add 1 mmol/L per 10 mmHg'],[70,36,'Chronic: kidneys add 4 per 10 mmHg over days']],src:'Brackett 1965; Epstein 2001'},
 ralk:{t:'Respiratory alkalosis',pts:[[40,24,'Normal'],[25,21,'Acute: HCO₃⁻ falls 2 per 10 mmHg'],[25,16.5,'Chronic: falls 5 per 10 mmHg']],src:'Foster 2001'},
 mixed:{t:'Mixed: metabolic and respiratory acidosis',pts:[[40,24,'Normal'],[40,14,'Lactic acid: HCO₃⁻ falls'],[55,15,'Lungs fail too (arrest, fatigue): PCO₂ rises instead of falling']],src:'Narins & Emmett 1980'}};
/* {40}: a plain PCO₂ (kPa when set); [26]: the result of a mmHg formula, with kPa added when set; 'per 10 mmHg' gains its kPa too */
const davTx=s=>{const k=S.units==='kPa';return s.replace(/<(\d+)>/g,(m,v)=>P(+v)+' '+PU()).replace(/\{(\d+)\}/g,(m,v)=>k?P(+v)+' kPa':v).replace(/\[(\d+)\]/g,(m,v)=>k?v+' mmHg (= '+P(+v)+' kPa)':v).replace(/per 10 mmHg/g,k?'per 10 mmHg (1.3 kPa)':'per 10 mmHg');};
W.dav={t:'Davenport journeys: watch a disorder develop',build(el,opt){const u=uid();let key=opt&&opt.d&&DAV[opt.d]?opt.d:'mac',t=0,raf=0,going=false;
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Disorder">'+Object.keys(DAV).map(k=>'<button class="tool" data-k="'+k+'" aria-pressed="'+(k===key)+'">'+DAV[k].t+'</button>').join('')+'</div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Davenport diagram with the path of the chosen disorder"></canvas></div><div class="btnrow"><button class="btn small primary" id="'+u+'p">Play</button><button class="btn small" id="'+u+'s">Step</button></div><ol class="davsteps" id="'+u+'l" aria-live="polite"></ol><p class="note">The shaded bands are where each single disorder lands with normal compensation. The path is schematic: the start, the uncompensated point and the compensated point come from the rules, the line between is straight in PCO₂ and HCO₃⁻. Source: <span id="'+u+'src"></span>.</p></div>';
 const D=()=>DAV[key];
 const at=s=>{const p=D().pts,n=p.length-1,k=Math.min(n,Math.max(0,s*n)),i=Math.min(n-1,Math.floor(k)),f=ease(k-i);return [p[i][0]+(p[i+1][0]-p[i][0])*f,p[i][1]+(p[i+1][1]-p[i][1])*f];};
 const draw=()=>{const cv=$(u+'v');if(!cv||!cv.isConnected)return;const [pc,hc]=at(t);const ph=phFrom(hc,pc);drawMap(cv,[{ph,h:hc,l:ph.toFixed(2)}],340);
  const x=cv.getContext('2d'),{sx,sy}=mapXY(cv);x.save();x.strokeStyle=tok('--accent');x.lineWidth=2;x.setLineDash([5,4]);x.beginPath();for(let s=0;s<=t+1e-6;s+=0.01){const [a,b]=at(s);const X=sx(phFrom(b,a)),Y=sy(b);s?x.lineTo(X,Y):x.moveTo(X,Y);}x.stroke();x.setLineDash([]);
  D().pts.forEach((p,i)=>{const X=sx(phFrom(p[1],p[0])),Y=sy(p[1]);x.fillStyle=tok('--fg');x.beginPath();x.arc(X,Y,3.5,0,7);x.fill();x.font='700 10px '+tok('--f-mono');x.fillText(String.fromCharCode(65+i),X-12,Y+14);});x.restore();
  const n=D().pts.length-1,stage=Math.floor(t*n+1e-6),act=going&&t<1?stage+1:-1;const li=D().pts.map((p,i)=>'<li class="'+(i<=stage?'on':'')+(i===act?' active':'')+'"'+(i===act?' aria-current="step" style="opacity:.85;color:var(--accent)"':'')+'><b>'+String.fromCharCode(65+i)+'</b> pH '+phFrom(p[1],p[0]).toFixed(2)+', PCO₂ '+P(p[0])+' '+PU()+', HCO₃⁻ '+p[1]+'. '+esc(davTx(p[2]))+'</li>').join('');
  const ck=key+stage+act+S.units;if($(u+'l').dataset.k!==ck){$(u+'l').innerHTML=li;$(u+'l').dataset.k=ck;}$(u+'src').textContent=D().src;$(u+'p').textContent=going?'Pause':t>=1?'Replay':'Play';};
 const stop=()=>{cancelAnimationFrame(raf);going=false;};
 const play=()=>{if(going){stop();draw();return;}if(RM()){t=1;draw();return;}if(t>=1)t=0;const t0=performance.now()-t*4200;going=true;const f=now=>{t=Math.min(1,(now-t0)/4200);if(t>=1)going=false;draw();if(going)raf=requestAnimationFrame(f);};raf=requestAnimationFrame(f);};
 el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{stop();key=b.dataset.k;el.querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b));t=0;draw();if(!RM())play();});
 $(u+'p').onclick=play;$(u+'s').onclick=()=>{stop();const n=D().pts.length-1,st=Math.floor(t*n+1e-6);t=st>=n?0:(st+1)/n;draw();};
 draw();onRz(el,draw);}};

/* the dissociation curve in motion */
/* [key, name, text, normal (pH, °C, 2,3-BPG, COHb), scenario, {lp: loading PO₂, tp: tissue PO₂, lb: blood loads on the normal curve}] */
const ODCS=[['bohr','Exercising muscle','The blood loads in the lung on the normal curve, because arterial pH and temperature stay normal. In warm, acidic muscle (pH 7.25, 39.5 °C) the curve slides right, and at a muscle PO₂ of about <25> far more O₂ is released: the Bohr effect is local.',[7.40,37,5,0],[7.25,39.5,5,0],{lp:100,tp:25,lb:1}],
 ['stored','Stored blood','Banked red cells lose 2,3-BPG: the curve shifts left and unloading falls until it regenerates.',[7.40,37,5,0],[7.40,37,1.5,0]],
 ['alt','Days at altitude','At altitude the arterial PO₂ is only about <55>. 2,3-BPG rises over days: a right shift that releases more O₂ at a tissue PO₂ of <30>. The alkalosis of hyperventilation pulls the curve left; 2,3-BPG wins over days.',[7.40,37,5,0],[7.44,37,6.8,0],{lp:55,tp:30}],
 ['co','Carbon monoxide 30%','Capacity falls by 30% and the rest of the curve shifts left: a double hit on delivery. SpO₂ and a calculated SaO₂ still read about 98%; only co-oximetry shows the low O₂Hb.',[7.40,37,5,0],[7.40,37,5,0.3]],
 ['cold','Hypothermia 33 °C','A left shift: haemoglobin holds O₂ more tightly.',[7.40,37,5,0],[7.40,33,5,0]],
 ['hv','Hyperventilation, pH 7.60','Alkalosis shifts the curve left.',[7.40,37,5,0],[7.60,37,5,0]]];
W.odcplay={t:'Dissociation curve in motion',build(el,opt){const u=uid();let sc=ODCS.find(s=>opt&&s[0]===opt.s)||ODCS[0],k=1,raf=0;
 const hill=(P,p50,mx)=>mx*Math.pow(P,2.7)/(Math.pow(P,2.7)+Math.pow(p50,2.7));
 const p50of=v=>26.8*Math.pow(10,-0.48*(v[0]-7.4))*Math.pow(10,0.024*(v[1]-37))*(1+0.07*(v[2]-5))*(1-0.55*v[3]);
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Scenario">'+ODCS.map(s=>'<button class="tool" data-k="'+s[0]+'" aria-pressed="'+(s===sc)+'">'+s[1]+'</button>').join('')+'</div><div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Oxygen dissociation curve shifting"></canvas></div><p class="note" id="'+u+'d"></p><div class="readout" aria-live="polite">'+e3ro(u+'p5','P50')+e3ro(u+'sa','SaO₂')+e3ro(u+'sv','Sat (tissue)')+e3ro(u+'un','O₂ unloaded, % of capacity')+'</div><p class="note">Each value: this scenario (normal curve at the same PO₂s).</p><div class="btnrow"><button class="btn small primary" id="'+u+'p">Replay</button></div><p class="note">Model: Hill curve, n = 2.7, P50 26.8 mmHg, with approximate shift factors. Unloading is the saturation where the blood loads minus the saturation in the tissue. Source: Severinghaus 1966; Weaver 2009.</p></div>';
 const draw=()=>{const cv=$(u+'v');if(!cv||!cv.isConnected)return;const a=sc[3],b=sc[4],so=sc[5]||{lp:100,tp:40},lp=so.lp,tp=so.tp,kp=S.units==='kPa';const v=a.map((x,i)=>x+(b[i]-x)*ease(k));const p50=p50of(v),mx=1-v[3],isCO=sc[0]==='co';
  const {x,w,h}=fitCanvas(cv,300);x.clearRect(0,0,w,h);const ml=48,mr=10,mt=10,mb=30,sx=q=>ml+(w-ml-mr)*q/120,sy=q=>mt+(h-mt-mb)*(1-q);
  x.strokeStyle=tok('--line');x.lineWidth=1;for(let q=0;q<=1.001;q+=0.25){x.beginPath();x.moveTo(ml,sy(q));x.lineTo(w-mr,sy(q));x.stroke();}
  x.fillStyle=tok('--accent-soft');x.fillRect(sx(tp),mt,sx(lp)-sx(tp),h-mt-mb);
  const curve=(p5,m,col,dash,lw)=>{x.strokeStyle=col;x.lineWidth=lw;x.setLineDash(dash);x.beginPath();for(let q=0;q<=120;q++){const Y=sy(hill(q,p5,m));q?x.lineTo(sx(q),Y):x.moveTo(sx(q),Y);}x.stroke();x.setLineDash([]);};
  curve(26.8,1,tok('--muted'),[5,4],1.5);curve(p50,mx,tok('--accent'),[],3);
  if(v[3]>0.01){x.strokeStyle=tok('--muted');x.lineWidth=1;x.setLineDash([2,3]);x.beginPath();x.moveTo(ml,sy(mx));x.lineTo(w-mr,sy(mx));x.stroke();x.setLineDash([]);x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='right';x.fillText('max O₂Hb '+Math.round(mx*100)+'% with '+Math.round(v[3]*100)+'% COHb',w-mr-2,sy(mx)+13);}
  const sa=so.lb?hill(lp,26.8,1):hill(lp,p50,mx),sv=hill(tp,p50,mx),sa0=hill(lp,26.8,1),sv0=hill(tp,26.8,1);
  [[lp,sa],[tp,sv]].forEach(([q,s])=>{x.fillStyle=tok('--fg');x.beginPath();x.arc(sx(q),sy(s),4,0,7);x.fill();});
  x.fillStyle=tok('--muted');x.font='500 10px '+tok('--f-mono');x.textAlign='center';for(let q=0;q<=120;q+=20)x.fillText(kp?P(q):q,Math.min(sx(q),w-mr-10),h-mb+13);x.fillText('PO₂ '+PU()+' (shaded: lung '+P(lp)+' → tissue '+P(tp)+')',(ml+w)/2,h-3);x.textAlign='right';for(let q=0;q<=1.001;q+=0.25)x.fillText(Math.round(q*100),ml-5,sy(q)+3);
  x.save();x.translate(11,mt+(h-mt-mb)/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText(isCO?'O₂Hb %':'saturation %',0,0);x.restore();
  const lx=w-mr-118,ly=sy(0.3);x.textAlign='left';x.lineWidth=1.5;x.strokeStyle=tok('--muted');x.setLineDash([5,4]);x.beginPath();x.moveTo(lx,ly);x.lineTo(lx+22,ly);x.stroke();x.setLineDash([]);x.strokeStyle=tok('--accent');x.lineWidth=3;x.beginPath();x.moveTo(lx,ly+16);x.lineTo(lx+22,ly+16);x.stroke();x.fillStyle=tok('--fg');x.fillText('normal',lx+28,ly+4);x.fillText('this scenario',lx+28,ly+20);
  const pc=s=>Math.round(s*100)+'%',f50=q=>kp?(q/KPA).toFixed(2):q.toFixed(1);
  $(u+'p5l').textContent='P50 '+PU();$(u+'p5').textContent=f50(p50)+' ('+f50(26.8)+')';
  $(u+'sal').textContent=(isCO?'O₂Hb at ':'SaO₂ at ')+P(lp)+' '+PU()+(isCO?' (co-oximetry)':'')+(so.lb?' (normal curve)':'');$(u+'sa').textContent=pc(sa)+' ('+pc(sa0)+')';
  $(u+'svl').textContent=(isCO?'O₂Hb at ':'Sat at ')+P(tp)+' '+PU()+' (tissue)';$(u+'sv').textContent=pc(sv)+' ('+pc(sv0)+')';$(u+'un').textContent=pc(sa-sv)+' ('+pc(sa0-sv0)+')';
  $(u+'d').textContent=davTx(sc[2]);};
 const play=()=>{cancelAnimationFrame(raf);if(RM()){k=1;draw();return;}k=0;const t0=performance.now();const f=now=>{k=Math.min(1,(now-t0)/1800);draw();if(k<1)raf=requestAnimationFrame(f);};raf=requestAnimationFrame(f);};
 el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sc=ODCS.find(s=>s[0]===b.dataset.k);el.querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b));play();});
 $(u+'p').onclick=play;draw();onRz(el,draw);}};

/* lung model: two alveolar units, shunt and dead space. Cardiac output, O₂ uptake and CO₂ output are held fixed;
   the mixed venous values float until mass balance holds, so R stays 0.8 and the alveolar gas equation applies exactly.
   Gas flows are L/min BTPS, uptakes mL/min STPD (the 0.863 rule); contents mL/dL. Source: West, Ventilation/blood flow and gas exchange; Nunn. */
const VQM={Hb:15,Q:5,VO2:250,VCO2:200};
const satP=p=>p<=0?0:1/(1+23400/(p*p*p+150*p));
const cO2=p=>1.34*VQM.Hb*satP(p)+0.003*p;
const cCO2=p=>0.5*p+28;
function pFromCO2content(c,hi){let lo=0;hi=hi||800;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(cO2(m)<c)lo=m;else hi=m;}return (lo+hi)/2;}
function vqUnit(VA,Q,fio2,pb,cvo2,cvco2){const pw=pb-47,PI=fio2*pw;if(Q<=1e-6)return {pao2:PI,paco2:0,cc:null,ccc:null};if(VA<=1e-6)return {pao2:pFromCO2content(cvo2),paco2:(cvco2-28)/0.5,cc:cvo2,ccc:cvco2};
 const paco2=Math.max(0,10*Q*(cvco2-28)/(VA/0.863+5*Q)),fac=paco2/pw,fi=Math.min(fio2,0.999);
 const g=pa=>VA/0.863*((1-pa/pw-fac)*fi/(1-fi)*pw-pa)-10*Q*(cO2(pa)-cvo2);
 let lo=0,hi=Math.max(1,PI);for(let i=0;i<60;i++){const m=(lo+hi)/2;if(g(m)>0)lo=m;else hi=m;}const pao2=(lo+hi)/2;return {pao2,paco2,cc:cO2(pao2),ccc:cCO2(paco2)};}
function vqSolve(o){const pb=o.pb||760,fio2=Math.min(1,o.fio2),Q=VQM.Q,VE=o.ve||6.5,VO2=o.vo2||VQM.VO2,VCO2=o.vco2||VQM.VCO2;const qs=Q*o.shunt,qp=Q-qs,VA=VE*(1-o.dead);
 const qa=qp*(1-o.qb),qb=qp*o.qb,va=VA*(1-o.vb),vb=VA*o.vb;
 const mix=(cv,cvc)=>{const A=vqUnit(va,qa,fio2,pb,cv,cvc),B=vqUnit(vb,qb,fio2,pb,cv,cvc);return {A,B,ca:((A.cc!=null?qa*A.cc:0)+(B.cc!=null?qb*B.cc:0)+qs*cv)/Q,cac:((A.ccc!=null?qa*A.ccc:0)+(B.ccc!=null?qb*B.ccc:0)+qs*cvc)/Q};};
 /* CO₂: arterial content is linear in mixed venous content, so solve CvCO₂ = CaCO₂ + VCO₂/(10·Q) exactly */
 const cvO=cO2(40),k0=mix(cvO,50).cac,sl=(mix(cvO,60).cac-k0)/10,d=VCO2/(10*Q);let cvc=sl<0.999?(k0-50*sl+d)/(1-sl):153;const coMax=cvc>153;cvc=Math.min(153,cvc);
 /* O₂: find the mixed venous PO₂ at which the lungs take up exactly VO₂ (bisection; uptake falls as PvO₂ rises) */
 const h=pv=>{const cv=cO2(pv);return mix(cv,cvc).ca-cv-VO2/(10*Q);};let low=false,pv;
 if(h(10)<0){pv=10;low=true;}else{let lo=10,hi=250;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(h(m)>0)lo=m;else hi=m;}pv=(lo+hi)/2;}
 const cv=cO2(pv),M=mix(cv,cvc),A=M.A,B=M.B,ca=M.ca,cac=M.cac;
 const pao2=pFromCO2content(ca),paco2=(cac-28)/0.5;const et=VA>0?((qa>1e-6?va*A.paco2:0)+(qb>1e-6?vb*B.paco2:0))/VA:0;
 const vo2=10*Q*(ca-cv),R=vo2>1?VCO2/vo2:0.8,PIO2=fio2*(pb-47),PAid=PIO2-paco2*(fio2+(1-fio2)/R);
 return {A,B,qa,qb,va,vb,qs,pao2,paco2,sao2:satP(pao2),et,aa:PAid-pao2,PAid,R,pvo2:pv,pvco2:(cvc-28)/0.5,vo2,low,coMax,vqa:qa>1e-6?va/qa:(va>1e-6?Infinity:NaN),vqb:qb>1e-6?vb/qb:(vb>1e-6?Infinity:NaN)};}
const VQP=[['norm','Normal',{qb:.5,vb:.5,shunt:.02,dead:.3,fio2:.21,ve:6.5}],['hypo','Opioids: hypoventilation',{qb:.5,vb:.5,shunt:.02,dead:.3,fio2:.21,ve:3}],['pneu','Pneumonia: low V/Q',{qb:.5,vb:.1,shunt:.05,dead:.3,fio2:.21,ve:6.5}],['ards','Shunt: ARDS or collapse',{qb:.5,vb:.5,shunt:.35,dead:.35,fio2:.21,ve:6.5}],['pe','PE: high V/Q and dead space',{qb:.08,vb:.5,shunt:.02,dead:.3,fio2:.21,ve:6.5}],['copd','COPD: mixed V/Q',{qb:.6,vb:.25,shunt:.03,dead:.4,fio2:.21,ve:6.5}]];
const e3ro=(id,lab)=>'<div class="ro"><small id="'+id+'l" style="text-transform:none">'+lab+'</small><b id="'+id+'">—</b></div>';
W.vq={t:'Lung model: V/Q, shunt and dead space',build(el,opt){const u=uid();
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Preset">'+VQP.map((p,i)=>'<button class="tool" data-p="'+p[0]+'" aria-pressed="'+(i===0)+'">'+p[1]+'</button>').join('')+'</div><div class="ctrls">'+rng(u+'qb','Blood flow to unit B (%)',0,100,1,50)+rng(u+'vb','Ventilation to unit B (%)',0,100,1,50)+rng(u+'sh','True shunt (% of flow)',0,60,1,2)+rng(u+'de','Anatomical dead space (% of each breath)',10,80,1,30)+rng(u+'ve','Minute ventilation (L/min)',2,15,0.5,6.5)+rng(u+'fi','FiO₂ (%)',21,100,1,21)+'</div>'+
  '<div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Two lung units with their blood flow, a shunt and dead space"></canvas></div>'+
  '<div class="readout" aria-live="polite">'+e3ro(u+'po','PaO₂ '+PU())+e3ro(u+'sa','SaO₂')+e3ro(u+'pc','PaCO₂ '+PU())+e3ro(u+'aa','A–a '+PU())+e3ro(u+'et','end-tidal CO₂ '+PU())+e3ro(u+'pf','P/F '+PU())+'</div><p class="note" id="'+u+'say"></p>'+
  '<p class="note">Model: two alveolar units plus a shunt and anatomical dead space, with the nitrogen correction. Cardiac output (5 L/min), O₂ uptake (250 mL/min) and CO₂ output (200 mL/min) are held fixed and the mixed venous values float until mass balance holds, so R is 0.8 and the A–a uses the full alveolar gas equation. Diffusion is complete and the CO₂ curve is linear: it shows direction and size of effects, not exact values. A real patient\'s brain raises ventilation when CO₂ climbs. Sources: West, Respiratory Physiology; Nunn.</p></div>';
 const ids=['qb','vb','sh','de','ve','fi'];
 const run=()=>{ids.forEach(k=>$(u+k+'o').textContent=$(u+k).value+(k==='ve'?'':'%'));const o={qb:+$(u+'qb').value/100,vb:+$(u+'vb').value/100,shunt:+$(u+'sh').value/100,dead:+$(u+'de').value/100,ve:+$(u+'ve').value,fio2:+$(u+'fi').value/100,pb:S.patm||760};const r=vqSolve(o);
  const dead=r.low||r.coMax;$(u+'po').textContent=P(r.pao2);$(u+'sa').textContent=Math.round(r.sao2*100)+'%';$(u+'pc').textContent=r.paco2>150?'>'+P(150):P(r.paco2);$(u+'aa').textContent=P(Math.max(0,r.aa));$(u+'aal').textContent=o.fio2>0.21?'A–a on O₂ '+PU()+' (normal rises)':'A–a '+PU();$(u+'et').textContent=P(r.et);$(u+'pf').textContent=P(r.pao2/o.fio2);
  const say=[],nm=['A','B'],vq=[r.vqa,r.vqb],qq=[r.qa,r.qb];
  if(dead)say.push('This lung cannot meet the body\'s O₂ demand or clear its CO₂: incompatible with life. The numbers are outside the model\'s range.');
  if(o.shunt>=0.2)say.push(o.fio2>=0.9?'At FiO₂ '+Math.round(o.fio2*100)+'% the PaO₂ is only '+P(r.pao2)+' '+PU()+': shunt needs PEEP or recruitment, not more oxygen.':'Shunted blood never meets gas, so more oxygen helps little: try FiO₂ 100%.');
  const lowU=[0,1].filter(i=>qq[i]>1e-6&&vq[i]>0.05&&vq[i]<0.3),shU=[0,1].filter(i=>qq[i]>1e-6&&vq[i]<=0.05);
  if(lowU.length)say.push('Unit '+nm[lowU[0]]+' has low V/Q: it lowers the PaO₂, but extra oxygen still reaches it, so FiO₂ helps.');
  if(shU.length)say.push('Unit '+nm[shU[0]]+' is perfused but hardly ventilated: it behaves like shunt.');
  if(r.paco2-r.et>=3)say.push('Ventilated units with little blood flow (alveolar dead space, as in PE) dilute the exhaled CO₂: the gap between PaCO₂ and end-tidal CO₂ widens ('+P(r.paco2-r.et)+' '+PU()+').'+(r.paco2>45&&!dead?' With the minute ventilation held fixed the PaCO₂ rises; a real patient breathes harder, so in PE it is often low.':''));
  else if(o.dead>=0.45&&!dead)say.push('Anatomical dead space wastes part of each breath, so alveolar ventilation falls and the PaCO₂ rises, but end-tidal CO₂ still tracks it.');
  if(r.paco2>45&&!dead&&r.paco2-r.et<3)say.push('Alveolar ventilation is too low for the CO₂ the body makes, so the PaCO₂ rises and, by the alveolar gas equation, the alveolar and arterial PO₂ fall.'+(r.aa<15&&o.shunt<0.1&&!lowU.length&&!shU.length?' The A–a gradient stays normal: pure hypoventilation.':''));
  $(u+'say').textContent=say.join(' ');drawVQ($(u+'v'),r,o);};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{el.querySelectorAll('[data-p]').forEach(x=>x.setAttribute('aria-pressed','false'));run();}));
 const setP=k=>{const p=VQP.find(x=>x[0]===k)[2];$(u+'qb').value=p.qb*100;$(u+'vb').value=p.vb*100;$(u+'sh').value=p.shunt*100;$(u+'de').value=p.dead*100;$(u+'ve').value=p.ve;$(u+'fi').value=p.fio2*100;el.querySelectorAll('[data-p]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.p===k));run();};
 el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>setP(b.dataset.p));
 setP(opt&&opt.p&&VQP.some(x=>x[0]===opt.p)?opt.p:'norm');onRz(el,run);}};
function satCol(s){const h=Math.round(220+(360-220)*Math.max(0,Math.min(1,(s-0.6)/0.4)));return 'hsl('+(h%360)+',70%,'+(45+10*s)+'%)';}
function drawVQ(cv,r,o){const {x,w,h}=fitCanvas(cv,260);x.clearRect(0,0,w,h);const cxA=w*0.3,cxB=w*0.7,cy=86;const f='600 11px '+tok('--f-mono');
 const VAt=r.va+r.vb||1,Qt=5;[[cxA,r.va,r.qa,r.A,'A',r.vqa],[cxB,r.vb,r.qb,r.B,'B',r.vqb]].forEach(([cx,va,q,U,n,vq])=>{const rad=14+46*Math.sqrt(va/VAt);
  x.strokeStyle=tok('--muted');x.lineWidth=2;x.beginPath();x.moveTo(cx,0);x.lineTo(cx,cy-rad);x.stroke();
  x.fillStyle=tok('--b5-soft');x.strokeStyle=tok('--line');x.beginPath();x.arc(cx,cy,rad,0,7);x.fill();x.stroke();
  const lw=1+18*(q/Qt);x.strokeStyle=q>1e-6?satCol(satP(U.pao2)):tok('--line');x.lineWidth=lw;x.beginPath();x.moveTo(cx-rad-26,cy+rad+24);x.quadraticCurveTo(cx,cy+rad+2,cx+rad+26,cy+rad+24);x.stroke();
  /* labels: inside a large unit, below the capillary when the unit is small */
  const vqT=isNaN(vq)?'V/Q —':'V/Q '+(isFinite(vq)?vq.toFixed(vq<1?2:1):'∞'),small=rad<30,y0=small?cy+rad+40:cy-6,o2=w<560?'O₂ ':'PAO₂ ',co2=w<560?'CO₂ ':'PACO₂ ';
  x.fillStyle=tok('--fg');x.font=f;x.textAlign='center';x.fillText(n+' · '+vqT,cx,y0);x.fillStyle=tok('--muted');
  if(q>1e-6){x.fillText(o2+P(U.pao2),cx,y0+14);x.fillText(co2+P(U.paco2),cx,y0+28);}else x.fillText(va>1e-6?'no flow':'not used',cx,y0+14);});
 x.strokeStyle=satCol(satP(r.pvo2||40));x.lineWidth=1+18*(r.qs/Qt);x.beginPath();x.moveTo(20,h-36);x.lineTo(w-20,h-36);x.stroke();x.fillStyle=tok('--muted');x.font=f;x.textAlign='left';x.fillText('shunt '+Math.round(o.shunt*100)+'%: '+(w<560?'bypasses alveoli':'venous blood bypasses the alveoli'),22,h-14);
 x.fillStyle=tok('--muted');x.textAlign='right';x.fillText('dead space '+Math.round(o.dead*100)+'%',w-8,16);x.textAlign='left';if(w>=560)x.fillText('ventilation ↓',cxA+6,16);}

/* kidney: reclaiming filtered HCO₃⁻, making new HCO₃⁻, and getting rid of it in metabolic alkalosis.
   opt: {seg:'prox'|'dist'|'beta', flags:['t1',…]} opens the model on a lesson's view. Toggles that do not act on a segment are hidden there. */
const KFLAGS={prox:['load','aceta','t2'],dist:['load','aceta','t1','t4'],beta:['vom','sal','aldo']};
const KFL=[['load','Acid load (DKA)'],['aceta','Acetazolamide'],['t2','Type 2 RTA'],['t1','Type 1 RTA'],['t4','Low aldosterone (type 4)'],['vom','Vomiting (low Cl⁻ and volume)'],['sal','Saline given'],['aldo','Aldosterone excess']];
W.kidney={t:'Kidney: reclaiming and making bicarbonate',build(el,opt){const u=uid();opt=opt||{};let seg=KFLAGS[opt.seg]?opt.seg:'prox',flags={},parts=[],spawnT=0,run=!RM(),raf=0,paused=false,seen=true,cyc=0;
 KFL.forEach(f=>flags[f[0]]=false);(opt.flags||[]).forEach(f=>{if(f in flags)flags[f]=true;});
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Segment"><button class="tool" data-s="prox">Proximal tubule</button><button class="tool" data-s="dist">Collecting duct</button><button class="tool" data-s="beta">Alkalosis: β-cell</button></div>'+
  '<div class="seg wrap" role="group" aria-label="Conditions">'+KFL.map(f=>'<button class="tool" data-f="'+f[0]+'" aria-pressed="false">'+f[1]+'</button>').join('')+'</div>'+
  '<div class="cvwrap"><canvas id="'+u+'v" role="img" aria-label="Animated tubule cell moving H⁺ and HCO₃⁻"></canvas></div><div class="btnrow"><button class="btn small" id="'+u+'pp">'+(run?'Pause':'Play')+'</button></div>'+
  '<p class="note" id="'+u+'n" hidden></p><div class="stats kst" id="'+u+'st" aria-live="polite"></div><ol class="davsteps on" id="'+u+'l"></ol><p class="note">Rates are typical adult figures. Sources: Rose & Post; Soriano 2002; Batlle 1988; Galla 2000; Wall & Pech 2008 (pendrin).</p></div>';
 const TXT={prox:['About 4,300 mmol of HCO₃⁻ is filtered each day (GFR 180 L × 24 mmol/L); 80–90% is reclaimed here.','NHE3 swaps Na⁺ in for H⁺ out into the lumen.','In the lumen, H⁺ + filtered HCO₃⁻ → H₂CO₃ → CO₂ + H₂O (brush-border carbonic anhydrase IV).','CO₂ enters the cell; carbonic anhydrase II makes H⁺ + HCO₃⁻ again.','HCO₃⁻ leaves to the blood through NBCe1. The H⁺ is recycled: no net acid leaves the body here.'],
  dist:['The α-intercalated cell makes H⁺ + HCO₃⁻ from CO₂ (carbonic anhydrase II).','H⁺-ATPase (helped by H⁺/K⁺-ATPase) pumps H⁺ into the lumen; aldosterone boosts it.','Lumen buffers carry it: NH₃ → NH₄⁺ (about two thirds) and HPO₄²⁻ → H₂PO₄⁻ (titratable acid).','Every H⁺ excreted leaves one NEW HCO₃⁻, which exits to the blood via AE1 in exchange for Cl⁻.','Net acid excretion is about 1 mmol/kg/day; NH₄⁺ can rise several-fold in acidosis.'],
  beta:['Healthy kidneys clear an HCO₃⁻ load within hours, so metabolic alkalosis lasts only when something stops them.','The β-intercalated cell makes H⁺ + HCO₃⁻ from CO₂ (carbonic anhydrase II).','Pendrin swaps HCO₃⁻ out into the urine for Cl⁻ in: it needs Cl⁻ in the lumen.','The H⁺ goes back to the blood through a basolateral H⁺-ATPase.','Low Cl⁻, low volume, low K⁺ or too much aldosterone keep the HCO₃⁻ in: urine Cl⁻ below 20 mmol/L means saline will fix it.']};
 const stats=()=>{const f=flags;let rows,note='';
  if(seg==='prox'){
   if(f.aceta){rows=[['Reclaimed','Falls sharply'],['Urine HCO₃⁻','High: HCO₃⁻ spills into urine'],['Urine pH','Above 7 (alkaline)'],['Plasma','HCO₃⁻ falls: NAGMA (like type 2 RTA)']];note='Less H⁺ is made in the cell, and luminal CA IV is blocked, so filtered HCO₃⁻ is not reclaimed.';}
   else if(f.t2){rows=[['Reclaim threshold','Falls to about 15–18 mmol/L'],['Urine HCO₃⁻','Spills while plasma HCO₃⁻ is above the threshold'],['Urine pH','Above 5.5 at first; below 5.5 once plasma HCO₃⁻ settles at 15–18'],['Urine anion gap','Negative once settled (distal NH₄⁺ works)'],['Plasma','NAGMA, HCO₃⁻ about 15–18; K⁺ often low'],['Fanconi','Glucose, phosphate and amino acids may spill too']];note='Type 2 RTA: the proximal tubule reclaims HCO₃⁻ only up to a lower plasma level, then the urine can be acidified normally.';}
   else if(f.load)rows=[['Reclaimed','Still almost all of it'],['Urine HCO₃⁻','None'],['Ammoniagenesis','Rises: glutamine → NH₄⁺ + new HCO₃⁻'],['Urine pH','Set in the collecting duct (here 4.5–5)'],['Plasma','Filtered HCO₃⁻ falls, so less needs reclaiming']];
   else rows=[['Reclaimed','80–90%'],['Urine HCO₃⁻','Almost none'],['Ammoniagenesis','Steady: glutamine → NH₄⁺ + new HCO₃⁻'],['Urine pH','Set in the collecting duct (usually 5–6)'],['Plasma','HCO₃⁻ held near 24']];}
  else if(seg==='dist'){
   const nh4=f.t1?'Low: no H⁺ to trap NH₃ as NH₄⁺':f.t4?'Low: high K⁺ blocks ammoniagenesis':f.aceta?'Low: alkaline urine traps little NH₃':f.load?'Rises several-fold':'Normal';
   const uag=f.t1||f.t4?'Positive (low NH₄⁺)':f.aceta?'Positive (HCO₃⁻ in urine, low NH₄⁺)':f.load?'Strongly negative (lots of NH₄Cl)':'Near zero or negative';
   const uph=f.t1?'Cannot go below 5.5':f.aceta?'Above 6.5–7: HCO₃⁻ arrives from upstream':f.t4?'Can fall below 5.5':f.load?'About 4.5–5':'About 5–6';
   rows=[['H⁺ pumped',f.t1?'Pump fails':f.aceta?'Reduced: CA II blocked':f.t4?'Reduced':f.load?'Increased':'Normal'],['NH₄⁺ excretion',nh4],['Urine anion gap',uag],['Urine pH',uph],['New HCO₃⁻',f.t1||f.t4||f.aceta?'Too little: NAGMA':f.load?'More, to replace what the acid used':'Matches daily acid production'],['K⁺',f.t1||f.aceta?'Often low':f.t4?'High':'Normal']];
   note=f.t1?'Type 1 RTA: the α-cell cannot pump H⁺, so NH₃ is not trapped as NH₄⁺. Low NH₄⁺ makes the urine anion gap positive.':f.t4?'Type 4: low aldosterone weakens the pump, and high K⁺ cuts ammonia production, so NH₄⁺ is low even though the urine can still be acid.':f.aceta?'Carbonic anhydrase II is blocked here too, and HCO₃⁻ arrives from upstream, so the urine stays alkaline.':'';}
  else{const stall=f.vom&&!f.sal;
   if(f.aldo)rows=[['Pendrin','Cl⁻ arrives, but H⁺ secretion keeps rising'],['α-cell H⁺ secretion','Up: aldosterone'],['K⁺','Lost in urine: low'],['Volume','Expanded; blood pressure often high'],['Urine Cl⁻','Above 40 mmol/L'],['Saline','Does not correct it (saline-resistant)']];
   else if(stall)rows=[['Pendrin','Stalls: too little Cl⁻ in the lumen'],['Proximal reclaim','Up: low volume drives angiotensin II'],['α-cell H⁺ secretion','Up: aldosterone and low K⁺'],['Urine pH','Can be acid (paradoxical aciduria, late, with low K⁺)'],['Urine Cl⁻','Below 20 mmol/L'],['Plasma HCO₃⁻','Stays high']];
   else if(f.vom)rows=[['Pendrin','Works again: Cl⁻ delivered'],['Proximal reclaim','Falls back as volume returns'],['Urine pH','Alkaline: the extra HCO₃⁻ is excreted'],['Urine Cl⁻','Rises'],['Plasma HCO₃⁻','Falls: saline-responsive alkalosis']];
   else rows=[['Pendrin','Working: extra HCO₃⁻ leaves'],['Urine pH','Alkaline when plasma HCO₃⁻ is high'],['Urine Cl⁻','Normal'],['Plasma HCO₃⁻','An HCO₃⁻ load clears within hours']];
   note=f.aldo?'Aldosterone excess (Conn\'s): saline-resistant, urine Cl⁻ high. Treat the cause and replace K⁺.':stall?'Vomiting loses HCl. With low Cl⁻ and low volume the kidney holds on to the HCO₃⁻ it should excrete.':f.sal&&!f.vom?'Saline alone changes little in a healthy kidney: try it with Vomiting.':'';}
  $(u+'st').innerHTML=rows.map(r=>'<div><b>'+r[1]+'</b><small style="text-transform:none">'+r[0]+'</small></div>').join('');$(u+'l').innerHTML=TXT[seg].map(s=>'<li>'+s+'</li>').join('');$(u+'n').textContent=note;$(u+'n').hidden=!note;
  const on=KFLAGS[seg].filter(k=>f[k]).map(k=>KFL.find(x=>x[0]===k)[1]);$(u+'v').setAttribute('aria-label',{prox:'Proximal tubule cell',dist:'Collecting duct α-intercalated cell',beta:'Collecting duct β-intercalated cell'}[seg]+(on.length?', '+on.join(', '):'')+'. '+rows.slice(0,3).map(r=>r[0]+': '+r[1]).join('; ')+'.');
  el.querySelectorAll('[data-s]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.s===seg));el.querySelectorAll('[data-f]').forEach(x=>{x.hidden=!KFLAGS[seg].includes(x.dataset.f);x.setAttribute('aria-pressed',!!f[x.dataset.f]);});};
 const G=()=>{const cv=$(u+'v');const w=cv.clientWidth||600,h=300;const L1=w*0.3,C0=w*0.3,C1=w*0.72,B0=w*0.72;return {w,h,L1,C0,C1,B0,mid:(C0+C1)/2,ca:[(C0+C1)/2,h*0.5],ap:[C0,h*0.35],ap2:[C0,h*0.62],bl:[C1,h*0.5]};};
 const spawn=now=>{const g=G(),f=flags;cyc++;const co2in={l:'CO₂',c:'--b3',pts:[[g.w-24,g.h*0.8],[g.C1,g.h*0.74],g.ca],t0:now,d:1200};
  if(seg==='prox'){const fewH=f.aceta&&cyc%2;parts.push({l:'Na⁺',c:'--b5',pts:[[g.L1*0.4,g.h*0.22],g.ap,[g.ca[0]-20,g.ap[1]]],t0:now,d:1400});
   if(!fewH)parts.push({l:'H⁺',c:'--bad',pts:[g.ca,[g.ap[0]+4,g.ap[1]+10],[g.L1*0.55,g.h*0.45]],t0:now+200,d:1300});
   parts.push({l:'HCO₃⁻',c:'--b2',pts:[[g.L1*0.5,8],[g.L1*0.55,g.h*0.45]],t0:now,d:1500});
   if(f.aceta||(f.t2&&cyc%3===0)){parts.push({l:'HCO₃⁻',c:'--b2',pts:[[g.L1*0.55,g.h*0.45],[g.L1*0.5,g.h-10]],t0:now+1500,d:1500,lost:1});}
   else{parts.push({l:'CO₂',c:'--b3',pts:[[g.L1*0.55,g.h*0.45],g.ap2,g.ca],t0:now+1500,d:1200});parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.bl,[g.w-24,g.h*0.5]],t0:now+2700,d:1400});}}
  else if(seg==='dist'){const pump=!f.t1&&!(f.aceta&&cyc%2);const nh3=!f.t4;parts.push(co2in);
   parts.push({l:'H⁺',c:'--bad',pts:pump?[g.ca,g.ap,[g.L1*0.55,g.h*0.35]]:[g.ca,g.ap,g.ca],t0:now+1200,d:1300});
   if(f.aceta)parts.push({l:'HCO₃⁻',c:'--b2',pts:[[g.L1*0.3,8],[g.L1*0.4,g.h-10]],t0:now+300,d:2200,lost:1});
   if(pump){parts.push({l:nh3?'NH₃':'HPO₄²⁻',c:'--b4',pts:[[g.L1*0.3,8],[g.L1*0.55,g.h*0.35]],t0:now+1000,d:1500});
    parts.push({l:nh3?'NH₄⁺':'H₂PO₄⁻',c:'--b6',pts:[[g.L1*0.55,g.h*0.35],[g.L1*0.5,g.h-10]],t0:now+2500,d:1500});
    parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.bl,[g.w-24,g.h*0.3]],t0:now+1300,d:1400});parts.push({l:'Cl⁻',c:'--b5',pts:[[g.w-24,g.h*0.64],[g.bl[0],g.bl[1]+16],[g.ca[0]+34,g.ca[1]+34]],t0:now+1300,d:1400});}}
  else{const stall=f.vom&&!f.sal;parts.push(co2in);parts.push({l:'H⁺',c:'--bad',pts:[g.ca,g.bl,[g.w-24,g.h*0.42]],t0:now+1200,d:1300});
   if(!stall){parts.push({l:'Cl⁻',c:'--b5',pts:[[g.L1*0.4,8],[g.ap[0],g.ap[1]+16],[g.ca[0]-30,g.ca[1]+34],[g.C1,g.h*0.86],[g.w-24,g.h*0.9]],t0:now+1100,d:2400});parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.ap,[g.L1*0.5,g.h-10]],t0:now+1200,d:1500});}
   else parts.push({l:'HCO₃⁻',c:'--b2',pts:[g.ca,g.ap,g.ca,[g.w-24,g.h*0.25]],t0:now+1200,d:2400});}};
 const at=(p,t)=>{const n=p.pts.length-1;const k=Math.min(n-1e-6,t*n);const i=Math.floor(k),fr=ease(k-i);const a=p.pts[i],b=p.pts[i+1];return [a[0]+(b[0]-a[0])*fr,a[1]+(b[1]-a[1])*fr];};
 const wake=()=>{if(paused&&run&&seen){paused=false;cancelAnimationFrame(raf);raf=requestAnimationFrame(t=>frame(t));}};
 e2OnShow(el,wake);let io=null;try{io=new IntersectionObserver(es=>{seen=es[es.length-1].isIntersecting;if(seen)wake();});io.observe($(u+'v'));}catch(e){}
 const frame=(now,still)=>{const cv=$(u+'v');if(!cv||!cv.isConnected){cancelAnimationFrame(raf);if(io)io.disconnect();return;}if(!still&&(!seen||cv.offsetParent===null)){paused=true;return;}
  const {x,w,h}=fitCanvas(cv,300);const g=G();x.clearRect(0,0,w,h);const ca=flags.aceta&&seg!=='beta';
  x.fillStyle=tok('--b5-soft');x.fillRect(0,0,g.L1,h);x.fillStyle=tok('--surface-2');x.fillRect(g.B0,0,w-g.B0,h);
  x.fillStyle=tok('--h-rest');x.strokeStyle=tok('--line');x.lineWidth=2;x.fillRect(g.C0,16,g.C1-g.C0,h-32);x.strokeRect(g.C0,16,g.C1-g.C0,h-32);
  x.fillStyle=tok('--muted');x.font='600 11px '+tok('--f-mono');x.textAlign='center';x.fillText(w<560?'LUMEN':seg==='prox'?'LUMEN (filtrate)':'LUMEN (urine)',g.L1/2,h-20);x.fillText(seg==='prox'?(w<560?'PROXIMAL':'PROXIMAL CELL'):seg==='dist'?(w<560?'α-CELL':'α-INTERCALATED CELL'):(w<560?'β-CELL':'β-INTERCALATED CELL'),g.mid,32);x.fillText('BLOOD',(g.B0+w)/2,h-20);
  const tr=(p,lab,bad)=>{x.fillStyle=tok(bad?'--bad':'--fg');x.fillRect(p[0]-5,p[1]-12,10,24);x.font='500 10px '+tok('--f-mono');x.fillText(lab,p[0]+(p[0]<g.mid?-30:30),p[1]+4);};
  if(seg==='prox'){tr(g.ap,'NHE3');tr(g.bl,'NBCe1');}else if(seg==='dist'){tr(g.ap,flags.t1?'pump ✕':'H⁺-ATPase',flags.t1);tr(g.bl,'AE1');}else{const st=flags.vom&&!flags.sal;tr(g.ap,st?'pendrin ✕':'pendrin',st);tr(g.bl,'H⁺-ATPase');}
  const gap=flags.load&&seg!=='beta'?700:1300;if(!still){if(now-spawnT>gap){spawn(now);spawnT=now;}}else if(!parts.length){const n=performance.now();spawn(n-1500);spawn(n-2900);}
  parts=parts.filter(p=>now-p.t0<p.d+50);
  parts.forEach(p=>{const t=(now-p.t0)/p.d;if(t<0)return;const [px,py]=at(p,Math.min(1,t));x.fillStyle=tok(p.c);x.beginPath();x.arc(px,py,14,0,7);x.fill();if(p.lost){x.strokeStyle=tok('--bad');x.lineWidth=2;x.stroke();}x.fillStyle='#fff';x.font='700 '+(p.l.length>4?7.5:8.5)+'px '+tok('--f-mono');x.textAlign='center';x.fillText(p.l,px,py+3);});
  /* carbonic anhydrase drawn last so particles never hide it */
  x.fillStyle=tok('--surface');x.strokeStyle=tok('--line');x.lineWidth=1.5;x.beginPath();x.arc(g.ca[0],g.ca[1],18,0,7);x.fill();x.stroke();x.fillStyle=tok(ca?'--bad':'--fg');x.font='700 11px '+tok('--f-mono');x.textAlign='center';x.fillText(ca?'CA ✕':'CA',g.ca[0],g.ca[1]+4);
  x.textAlign='left';if(run&&!still)raf=requestAnimationFrame(t=>frame(t));};
 const redraw=()=>{parts=[];stats();if(!run)frame(performance.now(),true);};
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{seg=b.dataset.s;redraw();});
 el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const k=b.dataset.f;flags[k]=!flags[k];if(k==='t1'&&flags.t1)flags.t4=false;if(k==='t4'&&flags.t4)flags.t1=false;redraw();});
 $(u+'pp').onclick=()=>{run=!run;$(u+'pp').textContent=run?'Pause':'Play';paused=false;cancelAnimationFrame(raf);if(run)raf=requestAnimationFrame(t=>frame(t));else frame(performance.now(),true);};
 stats();if(run)raf=requestAnimationFrame(t=>frame(t));else frame(performance.now(),true);onRz(el,()=>{if(!run)frame(performance.now(),true);});}};
MODELS.push(['dav','Davenport journeys','Watch each disorder develop, then compensate, on the pH × HCO₃⁻ map.'],['odcplay','Curve in motion','Exercise, stored blood, altitude, CO, cold: see the curve shift and what it does to unloading.'],['vq','Lung model','Two lung units, a shunt and dead space: see why oxygen fixes low V/Q but not shunt.'],['kidney','Kidney and bicarbonate','The proximal tubule reclaims HCO₃⁻, the collecting duct makes new HCO₃⁻, and the β-cell clears it in alkalosis. Add acetazolamide, an RTA, vomiting or saline.']);
/* ventilator lab: settings in, pressures and the next gas out */
/* C mL/cmH₂O, R cmH₂O/L/s, s0 shunt at PEEP 5, rec recruitable share of it, vd disease dead space (fraction of Vt), h baseline HCO₃⁻, vco2 mL/min, fl flow-limited (waterfall) */
const VPAT={normal:{t:'Normal lungs',C:60,R:8,s0:0.03,rec:0,vd:0,h:24,vco2:200,set:{kg:7,rr:12,peep:5,fio2:30,ie:2}},
 ards:{t:'ARDS',C:25,R:12,s0:0.38,rec:0.6,vd:0.25,h:24,vco2:220,set:{kg:6,rr:24,peep:10,fio2:60,ie:2}},
 asthma:{t:'Severe asthma',C:50,R:35,Re:55,s0:0.05,rec:0,vd:0.1,h:24,vco2:200,set:{kg:7,rr:12,peep:5,fio2:40,ie:4}},
 copd:{t:'COPD, CO₂ retainer',C:55,R:22,Re:30,s0:0.06,rec:0,vd:0.2,h:34,vco2:200,fl:1,set:{kg:7,rr:12,peep:5,fio2:30,ie:3}}};
function ventCalc(o){const p=VPAT[o.pat];const pbw=(o.sex==='f'?45.5:50)+0.91*(o.ht-152.4);const tv=o.tv/1000,cyc=60/o.rr,ti=cyc/(1+o.ie),te=cyc-ti;
 /* recruitment: PEEP above 5 opens collapsed lung in ARDS, which lowers shunt and raises compliance */
 const rf=p.rec?Math.min(1,Math.max(0,(o.peep-5)/13)):0,Crec=p.C*(1+0.5*p.rec*rf)/1000,tau=(p.Re||p.R)*Crec;
 const x=Math.exp(-te/tau);const trap=x>0.999?tv*50:tv*x/(1-x);const api=Math.min(40,trap/Crec);
 /* flow-limited COPD: applied PEEP below the intrinsic PEEP does not raise total PEEP (waterfall) */
 const tpeep=p.fl?Math.max(o.peep,api+0.15*o.peep):o.peep+api,ape=tpeep-o.peep;
 /* overdistension: end-inspiratory pressure above about 27 cmH₂O stiffens the lung and adds dead space */
 const od=Math.min(0.5,Math.max(0,(tpeep+tv/Crec-27)/24)),C=Crec*(1-od);
 const flow=tv/ti,plat=tpeep+tv/C,peak=plat+p.R*flow,dp=plat-tpeep;
 /* trapped gas wastes ventilation (overdistended, poorly perfused units; output falls when auto-PEEP is high) */
 const vdTrap=0.025*api+0.015*Math.max(0,api-10);
 const vdA=(2.2*pbw)/1000,vdFrac=Math.min(0.95,vdA/tv+p.vd+vdTrap+0.3*od);
 const recruit=p.rec?Math.max(0.15,1-p.rec*rf):1;const shunt=Math.min(0.6,p.s0*recruit);
 const r=vqSolve({qb:.5,vb:.5,shunt,dead:vdFrac,fio2:o.fio2,pb:S.patm||760,ve:tv*o.rr,vco2:p.vco2});
 const out=r.paco2<15||r.paco2>150,paco2=Math.max(15,Math.min(150,r.paco2)),hco3=p.h+Math.max(-8,Math.min(5,(paco2>40?0.1:0.2)*(paco2-40))),ph=phFrom(hco3,paco2);
 const bp=api>10||tpeep>18?'falling':api>5||tpeep>12?'watch':'ok';
 return {pbw,mlkg:o.tv/pbw,ve:tv*o.rr,va:tv*(1-vdFrac)*o.rr,vdFrac,ti,te,tau,api,ape,tpeep,od,C:C*1000,plat,peak,dp,flow,trap,paco2,ph,hco3,pao2:Math.min(r.pao2,r.PAid),PAO2:r.PAid,low:r.low,out,sat:satP(r.pao2),shunt,bp};}
W.vent={t:'Ventilator lab',build(el,opt){const u=uid();let hold='';
 el.innerHTML='<div class="wbox"><div class="seg wrap" role="group" aria-label="Patient">'+Object.keys(VPAT).map((k,i)=>'<button class="tool" data-p="'+k+'" aria-pressed="'+(i===0)+'">'+VPAT[k].t+'</button>').join('')+'</div>'+
  '<div class="ctrls">'+rng(u+'ht','Height (cm)',145,200,1,175)+'<div class="ctrl"><label for="'+u+'sx"><span>Sex for PBW</span></label><select id="'+u+'sx"><option value="m">Male</option><option value="f">Female</option></select></div>'+rng(u+'tv','Tidal volume (mL)',250,900,10,490)+rng(u+'rr','Rate (/min)',6,40,1,12)+rng(u+'pe','PEEP (cmH₂O)',0,24,1,5)+rng(u+'fi','FiO₂ (%)',21,100,1,30)+rng(u+'ie','I:E (1 : x)',1,6,0.5,2)+'</div>'+
  '<div class="btnrow"><button class="btn small" id="'+u+'hi" aria-pressed="false">Inspiratory hold</button><button class="btn small" id="'+u+'he" aria-pressed="false">Expiratory hold</button></div>'+
  '<div class="cvwrap"><svg id="'+u+'w" class="ventw" viewBox="0 0 320 130" role="img" aria-label="Airway pressure over two breaths"></svg><svg id="'+u+'f" class="ventw" viewBox="0 0 320 80" role="img" aria-label="Flow over two breaths" style="margin-top:4px"></svg></div>'+
  '<div class="readout" id="'+u+'s"></div><ul class="nx" id="'+u+'al" aria-live="polite"></ul>'+
  '<p class="note">Each patient button resets every setting: tidal volume 6 mL/kg PBW in ARDS, 7 mL/kg otherwise. Model: single-compartment lung (resistance and compliance). Auto-PEEP comes from the expiratory time constant; trapped gas adds dead space and, above 10 cmH₂O, lowers the cardiac output, so a faster rate can raise the PaCO₂. PEEP recruits collapsed lung in ARDS (compliance up, shunt down) until overdistension stiffens it again. In flow-limited COPD, set PEEP below the intrinsic PEEP does not raise total PEEP (waterfall). PaCO₂ and PaO₂ come from the lung model (VCO₂ 200 mL/min, 220 in ARDS; anatomic dead space 2.2 mL/kg PBW plus disease dead space), so the PaO₂ never exceeds the alveolar PO₂. The pressure trace adds a short inspiratory pause so peak and plateau separate. Teaching only. Sources: ARDSNet 2000; Amato 2015; Tuxen 1987; Marini 2011; ATS/ESICM/SCCM 2017; West.</p></div>';
 let pat='normal';const ids=['ht','tv','rr','pe','fi','ie'];
 const get=()=>({pat,ht:+$(u+'ht').value,sex:$(u+'sx').value,tv:+$(u+'tv').value,rr:+$(u+'rr').value,peep:+$(u+'pe').value,fio2:+$(u+'fi').value/100,ie:+$(u+'ie').value});
 const run=()=>{ids.forEach(k=>$(u+k+'o').textContent=k==='ie'?'1:'+$(u+k).value:$(u+k).value);const o=get(),r=ventCalc(o);
  /* round once, then use the shown values for both the display and the alarms */
  const pk=Math.round(r.peak),pl=Math.round(r.plat),dp=Math.round(r.dp),tp=Math.round(r.tpeep*10)/10,ape=Math.round(r.ape*10)/10,api=Math.round(r.api*10)/10,mk=Math.round(r.mlkg*10)/10,ph=Math.round(r.ph*100)/100,pc=Math.round(r.paco2),po=Math.round(r.pao2),pf=Math.round(r.pao2/o.fio2);
  const st=(l,v,bad)=>'<div class="ro"><small style="text-transform:none">'+l+'</small><b'+(bad?' style="color:var(--bad)"':'')+'>'+v+'</b></div>';
  $(u+'s').innerHTML=st('mL/kg PBW ('+Math.round(r.pbw)+' kg)',mk.toFixed(1),mk>8)+st('minute ventilation L/min',r.ve.toFixed(1))+st('peak cmH₂O',pk,pk>40)+st('plateau cmH₂O',pl,pl>30)+st('total PEEP cmH₂O',tp.toFixed(1))+st('auto-PEEP cmH₂O',ape.toFixed(1),ape>2)+st('driving pressure cmH₂O (plateau − total PEEP)',dp,dp>15)+st('compliance mL/cmH₂O',Math.round(r.C))+
   st('PaCO₂ '+PU(),(r.out?(r.paco2>=150?'>':'<'):'')+P(r.paco2),pc>60||pc<30)+st('pH',ph.toFixed(2),ph<7.2||ph>7.5)+st('PaO₂ '+PU(),P(r.pao2),po<55)+st('SaO₂',Math.round(r.sat*100)+'%',r.sat<0.88)+st('P/F '+PU(),P(r.pao2/o.fio2),pf<150)+st('blood pressure',r.bp,r.bp==='falling');
  const al=[];if(mk>8)al.push('Tidal volume above 8 mL/kg PBW: aim for 6–8 (6 in ARDS).');
  if(pl>30)al.push(ape>5?'Plateau above 30 from trapped air: lengthen expiration first (lower rate, longer I:E).':'Plateau above 30 cmH₂O: lower the tidal volume.');
  if(dp>15)al.push('Driving pressure above 15: lower the tidal volume, or try the PEEP that gives the lowest driving pressure (watch compliance).');
  if(pk>40)al.push('Peak above 40: check the peak–plateau gap. A big gap means the airways (bronchospasm, tube, secretions); a high plateau means the lung or chest wall.');
  if(api>2)al.push('Auto-PEEP '+api.toFixed(1)+' cmH₂O: lengthen expiration (lower rate, longer I:E).');
  if(api>3&&o.rr>=10){const r2=ventCalc(Object.assign({},o,{rr:o.rr-2}));if(r.paco2>=r2.paco2-0.5)al.push('Rate up, CO₂ not falling: trapped air wastes each extra breath. Lower the rate, lengthen expiration and accept a higher PaCO₂.');}
  if(api>10)al.push('Severe air trapping: venous return and blood pressure will fall. Disconnect if crashing.');
  if(tp>18&&api<=10)al.push('Total PEEP above 18: watch the blood pressure, and check the lung is recruitable (does compliance rise?).');
  if(o.peep<5)al.push('PEEP below 5: add PEEP to stop the lung bases collapsing.');
  if(r.out)al.push(r.paco2>=150?'PaCO₂ above 150 is outside the model: this ventilation cannot clear the CO₂ the body makes.':'PaCO₂ below 15 is outside the model: far too much ventilation.');
  if(r.low)al.push('Oxygen delivery cannot meet demand: a peri-arrest state.');
  if(ph<7.2)al.push('pH below 7.20: raise minute ventilation if the lung allows, or accept carefully.');
  if(o.pat==='copd'&&ph>7.48)al.push('Over-ventilating a CO₂ retainer: post-hypercapnic alkalosis. Aim for their usual PaCO₂.');
  else if((pc<35||ph>7.5)&&!r.out)al.push('PaCO₂ below '+P(35)+' or pH above 7.50: lower the minute ventilation (low CO₂ narrows the brain\'s vessels).');
  if(po<55)al.push('PaO₂ below '+P(55)+' '+PU()+': raise FiO₂, and PEEP if the lung is recruitable.');if(o.fio2>0.6&&po>100)al.push('PaO₂ above '+P(100)+' on high FiO₂: wean the oxygen.');
  const ok=pc>45?(o.pat==='copd'?' PaCO₂ '+P(r.paco2)+' '+PU()+': near this patient\'s usual level is fine.':' PaCO₂ '+P(r.paco2)+' '+PU()+': permissive hypercapnia is acceptable while the pH stays above 7.20.'):' The CO₂ is in range.';
  $(u+'al').innerHTML=al.length?al.map(a=>'<li>'+esc(a)+'</li>').join(''):'<li>'+esc('Settings look protective for this patient.'+ok)+'</li>';
  /* traces: set PEEP → PEEP total + R·flow → peak at end of inspiration → pause at plateau → back to set PEEP; holds reveal plateau and total PEEP */
  const W=320,H=130,mx=Math.max(40,r.peak+8),sy=v=>H-14-(v/mx)*(H-26),cyc=60/o.rr,pz=Math.min(0.4,r.te*0.3),hx=Math.max(0.8,cyc*0.5),tt=2*cyc+(hold?hx:0),sx=t=>(4+t/tt*(W-8)).toFixed(1);
  const tv=o.tv/1000,v0=(tv+r.trap)/r.tau,fm=Math.max(r.flow,v0)*1.1,FH=80,sf=v=>(FH/2-4-v/fm*(FH/2-10)).toFixed(1);
  let d='',f='',lab='';
  for(let b=0;b<2;b++){const t0=b*cyc,ext=b===1&&hold==='i'?hx:0,te0=t0+r.ti+pz+ext,ted=cyc-r.ti-pz;
   d+=(b?' L':'M')+sx(t0)+' '+sy(o.peep)+' L'+sx(t0+0.03)+' '+sy(r.tpeep+r.peak-r.plat)+' L'+sx(t0+r.ti)+' '+sy(r.peak)+' L'+sx(t0+r.ti+0.04)+' '+sy(r.plat)+' L'+sx(te0)+' '+sy(r.plat)+' L'+sx(te0+0.06)+' '+sy(o.peep+(r.plat-o.peep)*0.15)+' L'+sx(te0+Math.min(0.25,ted*0.4))+' '+sy(o.peep)+' L'+sx(t0+cyc+ext)+' '+sy(o.peep);
   f+=(b?' L':'M')+sx(t0)+' '+sf(0)+' L'+sx(t0+0.02)+' '+sf(r.flow)+' L'+sx(t0+r.ti)+' '+sf(r.flow)+' L'+sx(t0+r.ti+0.02)+' '+sf(0)+' L'+sx(te0)+' '+sf(0);
   for(let k=0;k<=24;k++){const s=k/24*ted;f+=' L'+sx(te0+s)+' '+sf(-v0*Math.exp(-s/r.tau));}
   if(b===0)lab+='<text x="'+sx(t0+r.ti)+'" y="'+(sy(r.peak)-4)+'" class="lab" text-anchor="middle">peak '+pk+'</text><text x="'+(+sx(te0)+3)+'" y="'+(sy(r.plat)+11)+'" class="lab">plateau '+pl+'</text>';
   if(b===1&&hold==='i')lab+='<text x="'+sx(t0+r.ti+pz+ext/2)+'" y="'+(sy(r.plat)-4)+'" class="lab" text-anchor="middle">hold: plateau '+pl+'</text>';}
  if(hold==='e'){const T=2*cyc;d+=' L'+sx(T+0.3)+' '+sy(r.tpeep)+' L'+sx(T+hx)+' '+sy(r.tpeep);f+=' L'+sx(T)+' '+sf(0)+' L'+sx(T+hx)+' '+sf(0);lab+='<text x="'+sx(T+hx)+'" y="'+(sy(r.tpeep)-4)+'" class="lab" text-anchor="end">hold: total PEEP '+tp.toFixed(1)+'</text>';}
  $(u+'w').innerHTML='<line x1="0" x2="'+W+'" y1="'+sy(30)+'" y2="'+sy(30)+'" class="lim"/><text x="'+(W-4)+'" y="'+(sy(30)-3)+'" class="lab" text-anchor="end">30</text><path d="'+d+'" class="wave"/>'+lab+'<text x="4" y="'+(H-2)+'" class="lab">airway pressure, cmH₂O, 2 breaths</text>';
  const endF=v0*Math.exp(-(cyc-r.ti-pz)/r.tau);
  $(u+'f').innerHTML='<line x1="0" x2="'+W+'" y1="'+sf(0)+'" y2="'+sf(0)+'" stroke="#3a4656"/><path d="'+f+'" class="wave"/><text x="4" y="'+(FH-2)+'" class="lab">'+(endF>0.05?'flow: expiration does not reach zero, so air is trapped':'flow, L/s: in above the line, out below')+'</text>';};
 const setHold=k=>{hold=hold===k?'':k;$(u+'hi').setAttribute('aria-pressed',hold==='i');$(u+'he').setAttribute('aria-pressed',hold==='e');run();};
 $(u+'hi').onclick=()=>setHold('i');$(u+'he').onclick=()=>setHold('e');
 const setPat=k=>{pat=k;const s=VPAT[k].set,pbw=($(u+'sx').value==='f'?45.5:50)+0.91*(+$(u+'ht').value-152.4);el.querySelectorAll('[data-p]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.p===k));
  $(u+'tv').value=Math.max(250,Math.min(900,Math.round(s.kg*pbw/10)*10));$(u+'rr').value=s.rr;$(u+'pe').value=s.peep;$(u+'fi').value=s.fio2;$(u+'ie').value=s.ie;hold='';$(u+'hi').setAttribute('aria-pressed','false');$(u+'he').setAttribute('aria-pressed','false');run();};
 el.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));
 el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>setPat(b.dataset.p));
 setPat(opt&&opt.pat&&VPAT[opt.pat]?opt.pat:'normal');}};
MODELS.push(['vent','Ventilator lab','Set volume, rate, PEEP, FiO₂ and I:E for normal, ARDS, asthma or COPD lungs: see pressures, auto-PEEP and the next gas.']);
