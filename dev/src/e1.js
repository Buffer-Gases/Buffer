/* ================= CORE: STATE, UNITS, INTERPRETER, GENERATOR ================= */
const KPA=7.50062;
const DEF={done:{},qs:{},kinds:{},reflex:{lvl:1,hist:[]},days:[],read:0,units:'mmHg',patm:760,agref:12,usek:false,conf:[],exams:[]};
let S=JSON.parse(JSON.stringify(DEF));
/* persistent state: one key, schema-versioned; unknown or damaged fields fall back to defaults */
const DEF2={v:4,goal:15,sessLen:10,lvl:4,hints:'auto',dayN:{},steps:{},ret:{n:0,c:0},gym:{n:0,c:0},mist:[],sess:[],ui:{},xp:0,why:{},teach:{},scen:{},badges:{},flash:{},est:{n:0,c:0},serial:{},gaslog:[],speed:{},cases:{},cmist:[],qmiss:{},theme:'dark',quiet:true,skin:'pixel',google:{clientId:'',syncState:true,publish:true},lastRound:'',roundsDone:0,round:null,savedAt:'',epoch:0};
function migrate(o){const d=JSON.parse(JSON.stringify(DEF)),d2=JSON.parse(JSON.stringify(DEF2));const out=Object.assign(d,d2);
  if(!o||typeof o!=='object')return out;
  for(const k in out){if(!(k in o))continue;const a=out[k],b=o[k];
    if(Array.isArray(a)){if(Array.isArray(b))out[k]=b;}
    else if(a&&typeof a==='object'){if(b&&typeof b==='object'&&!Array.isArray(b))out[k]=Object.assign(a,b);}
    else if(typeof b===typeof a)out[k]=b;}
  if(!Array.isArray(out.reflex.hist))out.reflex.hist=[];
  for(const k in out.kinds){const s=out.kinds[k];if(!s||typeof s!=='object'||!(k in KINDS))delete out.kinds[k];}
  if(!(+o.v>=4)){out.quiet=true;if(out.theme==='auto')out.theme='dark';}
  out.v=4;return out;}
let SAVE_OK=true;
function load(){try{const r=localStorage.getItem('buffer.v1');S=migrate(r?JSON.parse(r):null);}catch(e){S=migrate(null);}}
function save(){try{localStorage.setItem('buffer.v1',JSON.stringify(S));SAVE_OK=true;}catch(e){if(SAVE_OK&&typeof toast==='function')toast('Progress could not be saved in this browser.','bad');SAVE_OK=false;}}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function touchDay(n){const t=today();if(!S.days.includes(t)){S.days.push(t);if(S.days.length>400)S.days.shift();}if(n){S.dayN=S.dayN||{};S.dayN[t]=(S.dayN[t]||0)+n;const ks=Object.keys(S.dayN).sort();while(ks.length>60)delete S.dayN[ks.shift()];}}
function streak(){let n=0;const set=new Set(S.days);const d=new Date();for(;;){const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(set.has(k)){n++;d.setDate(d.getDate()-1);}else{if(n===0&&k===today()){d.setDate(d.getDate()-1);continue;}break;}}return n;}

const r1=x=>Math.round(x*10)/10, r2=x=>Math.round(x*100)/100;
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const phFrom=(h,p)=>6.1+Math.log10(h/(0.03*p));
const hFrom=(ph,p)=>0.03*p*Math.pow(10,ph-6.1);
const beFrom=(ph,h)=>0.93*(h-24.4+14.8*(ph-7.4));
/* pressure display: value stored in mmHg */
function P(mm,unit){unit=unit||S.units;if(mm==null||isNaN(mm))return '—';return unit==='kPa'?(mm/KPA).toFixed(1):String(Math.round(mm));}
function PU(unit){return (unit||S.units)==='kPa'?'kPa':'mmHg';}
function sgn(x){return (x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(1).replace(/\.0$/,'');}

/* ---- labels ---- */
const LAB={HAGMA:'HAGMA',NAGMA:'NAGMA',HN:'HAGMA + NAGMA',MAC:'Metabolic acidosis',MALK:'Metabolic alkalosis',RAC:'Respiratory acidosis',RALK:'Respiratory alkalosis'};
function buildLabel(r,level){level=level||4;
  const parts=[];let mac=null;
  if(r.mac){mac=r.mac;if(level<3||mac==='?')mac='MAC';}
  const met=[];if(mac)met.push(mac==='HN'?'HAGMA + NAGMA':mac==='MAC'?'metabolic acidosis':mac);
  if(r.malk)met.push('metabolic alkalosis');
  let resp=null;
  if(r.rac)resp='respiratory acidosis';if(r.ralk)resp='respiratory alkalosis';
  if(!met.length&&!resp)return 'Normal acid–base';
  if(resp&&!met.length){const q=r.rq;if(level===1)return cap(resp);
    if(r.rac)return q==='a'?'Acute respiratory acidosis':q==='c'?'Chronic respiratory acidosis':'Acute-on-chronic respiratory acidosis';
    return q==='a'?'Acute respiratory alkalosis':q==='c'?'Chronic respiratory alkalosis':'Respiratory alkalosis, partly compensated';}
  const all=met.concat(resp?[resp]:[]);
  let s=all.join(' + ');
  if(all.length===1&&mac&&mac!=='MAC')s=mac==='HAGMA'?'High anion gap metabolic acidosis':mac==='NAGMA'?'Normal anion gap metabolic acidosis':s;
  return cap(s);
}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ---- interpreter ---- */
function interp(inp,opt){opt=opt||{};
  const patm=opt.patm||S.patm||760, agref=(opt.agref||S.agref||12)+((opt.usek!=null?opt.usek:S.usek)&&inp.k!=null?4:0), usek=opt.usek!=null?opt.usek:S.usek;
  const st=[];const flags=[];const causes=[];
  const v=Object.assign({},inp);
  const ven=v.sample==='v';
  if(v.hco3==null&&v.pH!=null&&v.pco2!=null)v.hco3=r1(hFrom(v.pH,v.pco2));
  let pH=v.pH,pc=v.pco2,h=v.hco3;
  if(pH==null||pc==null||h==null||isNaN(pH)||isNaN(pc)||isNaN(h))return {err:'Enter at least pH and PCO₂.'};
  const bad=validate(v);if(bad)return {err:bad};
  if(ven){pH=pH+0.03;pc=Math.max(10,pc-5);h=h-1;}
  const out={steps:st,flags,causes,ven,est:{pH,pco2:pc,hco3:h}};
  const tagV=ven?' (estimated arterial)':'';
  /* 1 consistency */
  const Hm=Math.pow(10,9-v.pH),Hc=24*v.pco2/v.hco3,diff=Math.abs(Hc-Hm)/Hm;
  st.push({k:'real',t:'Is it real?',tone:diff>0.1?'bad':'ok',v:diff>0.1?'Numbers do not fit together':'Internally consistent',
    d:'Henderson: 24 × '+P(v.pco2,'mmHg')+' ÷ '+v.hco3+' = '+Hc.toFixed(0)+' nmol/L; measured [H⁺] at pH '+v.pH.toFixed(2)+' = '+Hm.toFixed(0)+' nmol/L.'+(diff>0.1?' A difference above 10% means a transcription error, values from different samples, or lab total CO₂ mixed with a gas pH. Recheck before interpreting.':'')+(ven?' <b>Venous sample:</b> acid–base read on estimated arterial values (pH +0.03, PCO₂ −5, HCO₃⁻ −1). The PCO₂ estimate is approximate; oxygenation is not assessed.':'')});
  if(diff>0.1)flags.push('inconsistent');
  /* 2 pH */
  const acid=pH<7.35,alk=pH>7.45;
  st.push({k:'ph',t:'Acid or alkali?',tone:acid||alk?(pH<7.2||pH>7.6?'bad':'warn'):'ok',v:acid?'Acidaemia':alk?'Alkalaemia':'pH in normal range',d:'pH '+pH.toFixed(2)+tagV+'. Normal 7.35–7.45.'+(!acid&&!alk?' A normal pH can still hide two opposing disorders; keep going.':'')+(pH<7.2?' Severe acidaemia.':pH>7.6?' Severe alkalaemia.':'')});
  /* 3 primary */
  const lowH=h<22,highH=h>26,highC=pc>45,lowC=pc<35;
  let prim=[];
  if(acid){if(highC)prim.push('R');if(lowH)prim.push('M');}
  else if(alk){if(lowC)prim.push('R');if(highH)prim.push('M');}
  else{ if(highC&&highH)prim.push(pH<7.4?'R':'M');
    else if(lowC&&lowH)prim.push(pH<7.4?'M':'R');
    else if(highC&&lowH)prim=['R','M'];else if(lowC&&highH)prim=['R','M'];
    else if(highC||lowC)prim.push('R');else if(highH||lowH)prim.push('M');}
  if(!prim.length&&(acid||alk)){const md=Math.abs(24-h)/24,rd=Math.abs(pc-40)/40;prim.push(md>rd?'M':'R');}
  const r={mac:null,malk:false,rac:false,ralk:false,rq:null};
  prim.forEach(p=>{if(p==='R'){if(pc>40)r.rac=true;else r.ralk=true;}else{if(h<24)r.mac='?';else r.malk=true;}});
  let sys;
  if(!prim.length)sys='No primary disturbance in PCO₂ or HCO₃⁻';
  else if(prim.length===2)sys='Two primary processes: '+(r.mac?'metabolic acidosis':'metabolic alkalosis')+' and '+(r.rac?'respiratory acidosis':'respiratory alkalosis');
  else sys='Primary '+(prim[0]==='R'?(r.rac?'respiratory acidosis':'respiratory alkalosis'):(r.mac?'metabolic acidosis':'metabolic alkalosis'));
  out.prim=prim.slice();out.primKey=!prim.length?'none':prim.length===2?'two':prim[0]==='R'?(r.rac?'rac':'ralk'):(r.mac?'mac':'malk');
  st.push({k:'sys',t:'Which system?',tone:prim.length===2?'bad':prim.length?'warn':'ok',v:sys,d:'PCO₂ '+P(pc)+' '+PU()+' ('+(highC?'high':lowC?'low':'normal')+'), HCO₃⁻ '+r1(h)+' ('+(highH?'high':lowH?'low':'normal')+')'+tagV+'. '+(prim.length===2?'Both values moved in the same pH direction, so neither can be compensation.':prim.length?'The value that moved in the direction of the pH change is the cause; the other is compensation.':'')});
  /* 4 compensation */
  let comp={t:'Is compensation appropriate?',tone:'ok',v:'—',d:''};
  if(prim.length===1){
    if(r.mac){const e=1.5*h+8,lo=e-2,hi=e+2;out.cband=[lo,hi,pc];comp.d='Winter\'s: 1.5 × '+r1(h)+' + 8 = '+r1(e)+' ± 2 → expected PCO₂ '+P(lo)+'–'+P(hi)+' '+PU()+'. Measured '+P(pc)+'.';
      if(pc>hi+0.01){r.rac=true;comp.code='rac';comp.v='PCO₂ too high: added respiratory acidosis';comp.tone='bad';comp.d+=' The lungs are not keeping up (fatigue, sedation, chest disease, neuromuscular weakness).';}
      else if(pc<lo-0.01){r.ralk=true;comp.code='ralk';comp.v='PCO₂ too low: added respiratory alkalosis';comp.tone='bad';comp.d+=' Something extra is driving ventilation (salicylate, sepsis, liver failure, pain, hypoxaemia).';}
      else{comp.code='ok';comp.v='Appropriate respiratory compensation';}}
    else if(r.malk){const e=0.7*h+20,lo=e-5,hi=e+5;out.cband=[lo,hi,pc];comp.d='Expected PCO₂ = 0.7 × '+r1(h)+' + 20 = '+r1(e)+' ± 5 → '+P(lo)+'–'+P(hi)+' '+PU()+'. Measured '+P(pc)+'.';
      if(pc>hi+0.01){r.rac=true;comp.code='rac';comp.v='PCO₂ too high: added respiratory acidosis';comp.tone='bad';}
      else if(pc<lo-0.01){r.ralk=true;comp.code='ralk';comp.v='PCO₂ too low: added respiratory alkalosis';comp.tone='bad';}
      else{comp.code='ok';comp.v='Appropriate respiratory compensation';}}
    else if(r.rac){const d=(pc-40)/10,a=24+d,c=24+4*d;out.hband=[a,c,h];comp.d='PCO₂ up '+r1(pc-40)+' '+'mmHg. Acute: HCO₃⁻ ≈ '+r1(a)+'; chronic: ≈ '+r1(c)+'. Measured '+r1(h)+'.';
      if(h<a-2){comp.code='mac';r.mac='?';comp.v='HCO₃⁻ too low: added metabolic acidosis';comp.tone='bad';}
      else if(h<=a+2){comp.code='a';r.rq='a';comp.v='Acute (minutes–hours)';comp.tone='warn';}
      else if(h<c-2){comp.code='ac';r.rq='ac';comp.v='Between acute and chronic: acute-on-chronic, or 1–2 days old';comp.tone='warn';}
      else if(h<=c+2){comp.code='c';r.rq='c';comp.v='Chronic, renally compensated';}
      else{comp.code='malk';r.malk=true;comp.v='HCO₃⁻ above the chronic prediction: added metabolic alkalosis';comp.tone='bad';}}
    else if(r.ralk){const d=(40-pc)/10,a=24-2*d,c=24-5*d;out.hband=[a,c,h];comp.d='PCO₂ down '+r1(40-pc)+' mmHg. Acute: HCO₃⁻ ≈ '+r1(a)+'; chronic: ≈ '+r1(c)+'. Measured '+r1(h)+'.';
      if(h>a+2){comp.code='malk';r.malk=true;comp.v='HCO₃⁻ too high: added metabolic alkalosis';comp.tone='bad';}
      else if(h>=a-2){comp.code='a';r.rq='a';comp.v='Acute (minutes–hours)';comp.tone='warn';}
      else if(h>c+2){comp.code='p';r.rq='p';comp.v='Partly compensated (hours to 2 days)';comp.tone='warn';}
      else if(h>=c-2){comp.code='c';r.rq='c';comp.v='Chronic, renally compensated';}
      else{comp.code='mac';r.mac='?';comp.v='HCO₃⁻ below the chronic prediction: added metabolic acidosis';comp.tone='bad';}}
  }else if(prim.length===2){comp.code='na';comp.v='Not applicable: two primary disorders';comp.tone='bad';comp.d='When both systems push pH the same way, the patient cannot compensate. Expect severe pH derangement.';}
  else{comp.code='na';comp.v='Nothing to compensate';comp.d='PCO₂ and HCO₃⁻ are both within range.';}
  out.compKey=comp.code;st.push(Object.assign({k:'comp'},comp));
  /* 5 gaps */
  let ag=null,agc=null,delta=null,og=null;
  if(v.na!=null&&v.cl!=null){
    ag=v.na-(v.cl+h)+(usek&&v.k!=null?v.k:0);agc=ag+(v.alb!=null?0.25*(40-v.alb):0);
    const high=agc>agref+2;const bord=!high&&agc>agref;
    let d='AG = '+v.na+' − ('+v.cl+' + '+r1(h)+')'+(usek&&v.k!=null?' + '+v.k:'')+' = '+r1(ag)+(v.alb!=null?'; albumin '+v.alb+' g/L → corrected '+r1(agc):'')+'. Reference ≈ '+agref+(usek?' (K⁺ included)':'')+'.';
    out.agHigh=high;out.agBord=bord;if(high)r.mac='HAGMA';
    else if(r.mac==='?')r.mac='NAGMA';
    let tone=high?'bad':bord?'warn':'ok',vv=high?'High anion gap ('+r1(agc)+')':bord?'Borderline anion gap ('+r1(agc)+')':'Normal anion gap ('+r1(agc)+')';
    if(high&&h<24){delta=(agc-agref)/(24-h);d+=' Δ ratio = ('+r1(agc)+' − '+agref+') ÷ (24 − '+r1(h)+') = '+delta.toFixed(2)+'. ';
      if(delta<0.4){r.mac='HN';d+='Below 0.4: a hyperchloraemic acidosis dominates alongside the gap.';}
      else if(delta<0.8){r.mac='HN';d+='0.4–0.8: combined high AG and normal AG acidosis.';}
      else if(delta<=2){d+='0.8–2: pure high AG acidosis.';}
      else{if(!(r.rac&&r.rq==='c'))r.malk=true;d+='Above 2: the bicarbonate fell less than the gap rose, so a metabolic alkalosis (or a pre-existing high HCO₃⁻ from chronic CO₂ retention) coexists.';}}
    else if(high&&h>=24){if(!r.rac)r.malk=true;d+=r.rac?' High gap with a bicarbonate held up by chronic CO₂ retention: the acidosis is partly masked.':' High gap with a normal or high bicarbonate: a metabolic alkalosis is hiding the acidosis.';}
    else if(r.mac==='NAGMA'){d+=' Normal gap: bicarbonate lost or chloride gained (HARDASS).';}
    if(v.lac!=null&&high){d+=' Lactate '+v.lac+' accounts for ≈ '+Math.min(100,Math.round(v.lac/Math.max(0.1,agc-agref)*100))+'% of the gap rise.';}
    if(v.osm!=null&&v.glu!=null&&v.urea!=null){const calc=2*v.na+v.glu+v.urea;og=v.osm-calc;d+=' Osmolar gap = '+v.osm+' − (2×'+v.na+' + '+v.glu+' + '+v.urea+') = '+r1(og)+(og>10?': raised, think toxic alcohol.':': normal.');}
    st.push({k:'gap',t:'The gaps',tone,v:vv,d});
  }else{
    if(r.mac==='?')r.mac='?';
    st.push({k:'gap',t:'The gaps',tone:'info',v:'Anion gap not calculated',d:'Add Na⁺ and Cl⁻ (and albumin) to split metabolic acidosis into high and normal gap, and to catch hidden disorders.'});
  }
  /* resp qualifier drop when mixed */
  if((r.mac||r.malk)&&(r.rac||r.ralk)&&prim.length===1&&prim[0]==='R'&&r.rq){/* keep rq info in text only */}
  out.r=r;out.ag=ag;out.agc=agc;out.delta=delta;out.og=og;
  out.label=buildLabel(r,4);
  /* 6 oxygen */
  out.ox=null;
  if(!ven&&v.po2!=null){const f=v.fio2||0.21;const PA=f*(patm-47)-v.pco2/0.8;const Aa=PA-v.po2;const exAa=v.age?v.age/4+4:null;const pf=v.po2/f;
    const raised=Aa>(exAa!=null?exAa+5:20);let cat,vv,tone='ok';
    const hyp=v.po2<(f<=0.22?(patm<740?75:80):60);
    if(f<=0.22){
      if(hyp&&!raised){cat='hv';vv='Hypoxaemia with a normal A–a gradient';tone='warn';}
      else if(hyp){cat='lung';vv='Hypoxaemia with a raised A–a gradient';tone='bad';}
      else if(raised){cat='lungmild';vv='PaO₂ adequate, but A–a gradient raised';tone='warn';}
      else{cat='normal';vv='Normal oxygenation';}}
    else{ if(pf<300){cat='pf';vv='Impaired oxygenation on supplemental O₂ (P/F '+Math.round(pf)+')';tone=pf<200?'bad':'warn';}
      else{cat='normal';vv='Adequate oxygenation on supplemental O₂';}}
    let d='PaO₂ '+P(v.po2)+' '+PU()+' on FiO₂ '+f.toFixed(2)+'. P/F = '+(S.units==='kPa'?(pf/KPA).toFixed(1)+' kPa':Math.round(pf))+'. PAO₂ = '+f.toFixed(2)+' × ('+patm+' − 47) − '+Math.round(v.pco2)+'/0.8 = '+P(PA)+'; A–a = '+P(Aa)+(exAa!=null?' (expected ≤ '+P(exAa)+' for age '+v.age+')':'')+'.';
    if(f>0.22)d+=' Expected PaO₂ in healthy lungs ≈ '+P(f*100*5)+'. A–a widens on oxygen, so use the P/F here.';
    if(v.po2<60)d+=' Respiratory failure type '+(v.pco2>45?'2 (hypercapnic).':'1 (hypoxaemic).');
    if(cat==='hv')d+=' Hypoventilation or low inspired O₂ explains it; the lungs transfer normally.';
    if(cat==='lung'||cat==='lungmild')d+=' V/Q mismatch, shunt or diffusion: look at the lungs.';
    if(pf<=300&&f>0.22)d+=' If bilateral infiltrates not explained by heart failure, Berlin ARDS: '+(pf<=100?'severe':pf<=200?'moderate':'mild')+'.';
    if(v.po2>150&&f>0.3)d+=' Hyperoxaemia: titrate oxygen down to target.';
    out.ox={cat,pf,Aa,PA};
    const co=[];if(v.cohb!=null&&v.cohb>3)co.push('COHb '+v.cohb+'%: carbon monoxide exposure'+(v.cohb>10?' (significant)':''));if(v.methb!=null&&v.methb>1.5)co.push('MetHb '+v.methb+'%'+(v.methb>20?': treat (methylene blue unless G6PD deficient)':''));if(v.spo2!=null&&v.cohb==null&&v.methb==null&&v.po2>=70&&v.spo2<=88)co.push('SpO₂ '+v.spo2+'% with PaO₂ '+P(v.po2)+': saturation gap, request co-oximetry');
    if(co.length){d+=' '+co.join('. ')+'.';tone='bad';}
    st.push({k:'ox',t:'Oxygen',tone,v:vv,d});
  }else st.push({k:'ox',t:'Oxygen',tone:'info',v:ven?'Not assessed on a venous sample':'No PaO₂ entered',d:ven?'Venous PO₂ says nothing about the lungs. Use SpO₂, or an ABG if oxygenation matters.':'Add PaO₂ and FiO₂ to get the P/F ratio and A–a gradient.'});
  out.label=buildLabel(r,4);
  /* causes */
  if(r.mac==='HAGMA'||r.mac==='HN'){const c=[];if(v.glu!=null&&v.glu>11)c.push('Glucose '+v.glu+': DKA likely; check blood ketones');if(v.bhb!=null&&v.bhb>=3)c.push('BHB '+v.bhb+': ketoacidosis');if(v.lac!=null&&v.lac>4)c.push('Lactate '+v.lac+': lactic acidosis; find the cause (shock, sepsis, ischaemia, drugs)');if(v.urea!=null&&v.urea>25)c.push('Urea '+v.urea+': uraemia may contribute');if(og!=null&&og>10)c.push('Osmolar gap '+r1(og)+': toxic alcohol until proven otherwise');if(!c.length)c.push('Work through GOLDMARK: glycols, 5-oxoproline, L- and D-lactate, methanol, aspirin, renal failure, ketones');causes.push(...c);}
  if(r.mac==='NAGMA'||r.mac==='HN'){causes.push('Normal gap: HARDASS (diarrhoea, saline, RTA, acetazolamide, Addison\'s, spironolactone, TPN)'+(v.k!=null?(v.k>5?'; K⁺ high → type 4 RTA or hypoaldosteronism':v.k<3.5?'; K⁺ low → diarrhoea or type 1/2 RTA':''):'')+'. Urine anion gap separates gut from kidney.');}
  if(r.malk)causes.push('Metabolic alkalosis: urine Cl⁻ < 20 → vomiting, NG loss, prior diuretics; > 20 → current diuretics, mineralocorticoid excess, Bartter/Gitelman.');
  if(r.rac)causes.push('Respiratory acidosis: drive (opioids, sedatives), pump (neuromuscular, fatigue), airways/lungs (COPD, asthma), chest wall.');
  if(r.ralk)causes.push('Respiratory alkalosis: hypoxaemia, PE, sepsis, salicylate, pain/anxiety, pregnancy, liver failure. Check the A–a gradient before blaming anxiety.');
  out.unsure=uncertain(v,out,agref);
  /* summary line */
  const be=beFrom(pH,h);out.be=be;
  out.line=summaryLine(v,out);
  return out;
}
function summaryLine(v,o){
  const U=PU(),ven=v.sample==='v';
  const parts=[(ven?'VBG':'ABG')+(v.fio2&&!ven?' (FiO₂ '+v.fio2.toFixed(2)+')':'')+': pH '+v.pH.toFixed(2),'PCO₂ '+P(v.pco2)+' '+U];
  if(!ven&&v.po2!=null)parts.push('PO₂ '+P(v.po2)+' '+U);
  parts.push('HCO₃⁻ '+r1(v.hco3!=null?v.hco3:hFrom(v.pH,v.pco2)),'BE '+sgn(r1(o.be)));
  if(v.lac!=null)parts.push('Lac '+v.lac);if(o.agc!=null)parts.push('AG '+r1(o.agc)+(v.alb!=null?' (alb-corr)':''));
  if(v.cohb!=null)parts.push('COHb '+v.cohb+'%');if(v.methb!=null)parts.push('MetHb '+v.methb+'%');
  const comp=o.steps.find(s=>s.k==='comp');
  let imp=o.label;
  const single=(!!o.r.mac+!!o.r.malk+!!o.r.rac+!!o.r.ralk)===1;
  if(single&&(o.r.mac||o.r.malk))imp+=' with '+(comp.v.startsWith('Appropriate')?'appropriate respiratory compensation':'—');
  if(o.delta!=null)imp+='; Δ ratio '+o.delta.toFixed(1);
  if(o.ox&&!ven){const ox=o.steps.find(s=>s.k==='ox');imp+='. Oxygenation: '+ox.v.charAt(0).toLowerCase()+ox.v.slice(1)+(o.ox.cat!=='normal'&&!/P\/F/.test(ox.v)?' (P/F '+Math.round(o.ox.pf)+')':'');}
  return parts.join(' | ')+'. Impression: '+imp+'.';
}

/* ---- case generator ---- */
const CAUSES={
 dka:'Diabetic ketoacidosis',sglt:'Euglycaemic DKA (SGLT2 inhibitor)',lacsep:'Septic shock (lactic acidosis)',lacisch:'Mesenteric ischaemia (lactic acidosis)',meth:'Methanol poisoning',eg:'Ethylene glycol poisoning',uraem:'Advanced kidney failure',metf:'Metformin-associated lactic acidosis',aka:'Alcoholic ketoacidosis',
 diar:'Diarrhoea (GI bicarbonate loss)',saline:'Large-volume 0.9% saline',rta4:'Type 4 RTA (hypoaldosteronism)',rta1:'Distal (type 1) RTA',acz:'Acetazolamide',
 vom:'Vomiting / gastric outlet obstruction',diur:'Loop or thiazide diuretics',conn:'Primary hyperaldosteronism',
 opi:'Opioid overdose',gbs:'Guillain–Barré syndrome (neuromuscular failure)',asthx:'Exhausted acute severe asthma',copd:'COPD (chronic CO₂ retention)',ohs:'Obesity hypoventilation syndrome',copdx:'COPD exacerbation',
 panic:'Panic attack / hyperventilation',pe:'Pulmonary embolism',pneu:'Pneumonia',preg:'Normal pregnancy',alt:'High altitude residence',cirr:'Chronic liver disease',
 arrest:'Cardiac arrest',apo:'Acute pulmonary oedema with shock',sepsisfat:'Sepsis with respiratory fatigue',asa:'Salicylate poisoning',sepearly:'Sepsis with hyperventilation',liverf:'Acute liver failure',
 dkavom:'DKA with prolonged vomiting',akavom:'Alcoholic ketoacidosis with vomiting',diaraki:'Diarrhoea with AKI and dehydration',dkad2:'DKA day 2 after saline resuscitation',
 copddiur:'COPD on diuretics and steroids',seiz:'Generalised tonic–clonic seizure',rhabdo:'Exertional rhabdomyolysis',pris:'Propofol infusion syndrome',tolu:'Toluene inhalation (glue sniffing)',topi:'Topiramate',etohw:'Alcohol withdrawal',ileo:'High-output ileostomy',ngsuc:'Post-op nasogastric suction',mtx:'Massive transfusion (citrate load)',mg:'Myasthenic crisis',hepen:'Hepatic encephalopathy',dkapneu:'DKA with vomiting and pneumonia',asavom:'Salicylate poisoning with repeated vomiting',pregvom:'Hyperemesis in pregnancy',cirrdiur:'Cirrhosis on diuretics',normal:'Normal'
};
const KINDS={
 hagma:{lbl:'HAGMA',lv:1,v:[['dka','19-year-old with type 1 diabetes, 2 days of vomiting and deep sighing breaths',{glu:[20,34],lac:[1,2.5],o:'n'}],['sglt','58-year-old on empagliflozin, 3 days of poor intake, glucose only mildly raised',{glu:[8,13],lac:[1,2],o:'n'}],['lacsep','71-year-old with urosepsis, MAP 58 on noradrenaline',{lac:'gap',o:'pf'}],['lacisch','76-year-old with AF and severe abdominal pain out of proportion to signs',{lac:'gap',o:'n'}],['meth','Three men from the same gathering with blurred vision after drinking homemade alcohol',{lac:[1,2],osm:true,o:'n'}],['eg','Confused man found with an empty antifreeze bottle; AKI and crystals in urine',{lac:[2,4],osm:true,o:'n'}],['metf','68-year-old on metformin with vomiting and AKI',{lac:'gap',urea:[25,40],o:'n'}],['aka','42-year-old after a 5-day drinking binge, not eating; glucose normal',{glu:[4,7],lac:[1.5,3],o:'n'}],['seiz','31-year-old 20 minutes after a prolonged generalised seizure',{lac:'gap',o:'n'}],['rhabdo','26-year-old labourer collapsed after a 12-hour shift in the sun; tea-coloured urine, CK 52,000',{lac:[2.5,4],k:[5.4,6.3],o:'n'}],['pris','ICU patient on high-dose propofol for 4 days; new arrhythmia and dark urine',{lac:'gap',k:[5.2,6],o:'pf'}]]},
 nagma:{lbl:'NAGMA',lv:1,v:[['diar','27-year-old with 5 days of profuse watery diarrhoea',{k:[2.6,3.3],o:'n'}],['saline','Post-op day 1 after 7 L of 0.9% saline',{k:[3.6,4.4],o:'n'}],['rta4','63-year-old with diabetic nephropathy on ramipril; K⁺ high',{k:[5.6,6.4],o:'n'}],['rta1','34-year-old with Sjögren\'s and recurrent kidney stones; urine pH 6.5',{k:[2.7,3.2],o:'n'}],['acz','Trekker taking acetazolamide for altitude sickness',{k:[3.3,3.9],o:'n'}],['ileo','57-year-old with a new ileostomy draining 3 L a day',{k:[2.8,3.4],o:'n'}],['tolu','19-year-old with paint on his hands, profound weakness and K⁺ 2.3',{k:[2.1,2.6],o:'n'}],['topi','33-year-old on topiramate for migraine, routine pre-op bloods',{k:[3.5,4.2],o:'n'}]]},
 malk:{lbl:'MALK',lv:1,v:[['vom','45-year-old with gastric outlet obstruction, vomiting for a week',{k:[2.5,3.2],o:'n'}],['diur','80-year-old with heart failure on high-dose furosemide',{k:[2.8,3.4],o:'n'}],['conn','39-year-old with resistant hypertension and K⁺ 2.9',{k:[2.6,3.1],o:'n'}],['ngsuc','64-year-old on day 4 after bowel surgery with high nasogastric aspirates',{k:[2.9,3.4],o:'n'}],['mtx','Trauma patient after 18 units of blood products',{k:[3.4,4.6],o:'n'}]]},
 rac_a:{lbl:'RACa',lv:1,v:[['opi','24-year-old found unresponsive with pinpoint pupils',{o:'hv'}],['gbs','37-year-old with ascending weakness, weak cough and vital capacity falling',{o:'hv'}],['mg','45-year-old with myasthenia gravis, ptosis and a weak voice after a chest infection',{o:'hv'}],['asthx','19-year-old with severe asthma for 6 hours, now drowsy and quiet chest',{o:'pf'}]]},
 rac_c:{lbl:'RACc',lv:1,v:[['copd','69-year-old with severe COPD at a routine clinic visit, usual self',{o:'lung'}],['ohs','52-year-old, BMI 51, daytime sleepiness, ankle oedema',{o:'hv'}]]},
 rac_ac:{lbl:'RACac',lv:2,v:[['copdx','72-year-old known CO₂ retainer, 3 days of increased sputum and breathlessness',{o:'pf'}]]},
 ralk_a:{lbl:'RALKa',lv:1,v:[['panic','22-year-old with sudden fear, tingling fingers and carpopedal spasm; examination normal',{o:'n'}],['pe','54-year-old 10 days after knee replacement, sudden pleuritic chest pain',{o:'lung'}],['pneu','61-year-old with fever, cough and right basal crackles',{o:'lung'}]]},
 ralk_c:{lbl:'RALKc',lv:1,v:[['preg','30-year-old at 34 weeks\' gestation, routine assessment',{o:'n'}],['alt','Healthy resident of a high-altitude city, pre-operative gas',{o:'n'}],['cirr','58-year-old with cirrhosis and ascites, stable',{o:'n'}],['hepen','49-year-old with cirrhosis, confused for 3 days, asterixis',{o:'n'}],['etohw','44-year-old, last drink 36 hours ago: tremor, sweating, RR 26',{o:'n'}]]},
 hag_rac:{lbl:'HAGMA+RAC',lv:2,v:[['arrest','63-year-old, 12 minutes into a cardiac arrest, bag-valve ventilation',{lac:'gap',o:'pf'}],['apo','70-year-old with acute pulmonary oedema, cold and clammy, BP 78/50',{lac:'gap',o:'pf'}],['sepsisfat','66-year-old with septic shock, breathing slowing and drowsy',{lac:'gap',o:'pf'}]]},
 hag_ralk:{lbl:'HAGMA+RALK',lv:2,v:[['asa','29-year-old with tinnitus and vomiting after an overdose of an unknown painkiller',{lac:[1.5,3],o:'n'}],['sepearly','74-year-old with fever, rigors and confusion; RR 32',{lac:'gap',o:'lung'}],['liverf','33-year-old with paracetamol-induced acute liver failure, encephalopathic',{lac:'gap',o:'n'}]]},
 hag_malk:{lbl:'HAGMA+MALK',lv:3,v:[['dkavom','23-year-old with type 1 diabetes vomiting for 4 days',{glu:[20,32],lac:[1,2.5],o:'n'}],['akavom','47-year-old after a week of heavy drinking and repeated vomiting',{glu:[3.5,6],lac:[2,3.5],o:'n'}]]},
 hag_nag:{lbl:'HAGMA+NAGMA',lv:3,v:[['diaraki','80-year-old with 6 days of diarrhoea, dry, creatinine tripled',{lac:[2.5,4],urea:[25,38],k:[2.8,3.4],o:'n'}],['dkad2','DKA patient on day 2 after 6 L of 0.9% saline; ketones falling',{glu:[10,14],lac:[1,2],o:'n'}]]},
 hag_malk_ralk:{lbl:'HAGMA+MALK+RALK',lv:3,v:[['dkapneu','26-year-old with type 1 diabetes, vomiting for 3 days, fever and right lower lobe crackles',{glu:[18,30],lac:[1.5,3],o:'lung'}],['asavom','35-year-old with tinnitus after an overdose, vomiting all night',{lac:[1.5,3],o:'n'}]]},
 rac_malk:{lbl:'RAC+MALK',lv:2,v:[['copddiur','74-year-old with COPD and heart failure on furosemide and prednisolone',{k:[2.9,3.4],o:'lung'}]]},
 ralk_malk:{lbl:'RALK+MALK',lv:2,v:[['pregvom','26-year-old at 10 weeks with hyperemesis gravidarum',{k:[2.8,3.3],o:'n'}],['cirrdiur','61-year-old with cirrhosis on spironolactone and furosemide, vomiting',{k:[2.9,3.4],o:'n'}]]}
};
const TARGET={HAGMA:{mac:'HAGMA'},NAGMA:{mac:'NAGMA'},MALK:{malk:1},RACa:{rac:1,rq:'a'},RACc:{rac:1,rq:'c'},RACac:{rac:1,rq:'ac'},RALKa:{ralk:1,rq:'a'},RALKc:{ralk:1,rq:'c'},'HAGMA+RAC':{mac:'HAGMA',rac:1},'HAGMA+RALK':{mac:'HAGMA',ralk:1},'HAGMA+MALK':{mac:'HAGMA',malk:1},'HAGMA+NAGMA':{mac:'HN'},'RAC+MALK':{rac:1,malk:1},'HAGMA+MALK+RALK':{mac:'HAGMA',malk:1,ralk:1},'RALK+MALK':{ralk:1,malk:1}};
function targetLabel(kind,level){const t=TARGET[KINDS[kind].lbl];return buildLabel({mac:t.mac||null,malk:!!t.malk,rac:!!t.rac,ralk:!!t.ralk,rq:t.rq||null},level);}
function kindsFor(level){return Object.keys(KINDS).filter(k=>{const kv=KINDS[k];if(level===1)return kv.lv===1;if(level===2)return kv.lv<=2;return true;});}

function rawCase(kind){
  const K=KINDS[kind];const vg=pick(K.v);const o=vg[2]||{};
  let h,p,ag=rnd(9,13),k=r1(rnd(3.6,4.6)),na=Math.round(rnd(134,142)),alb=Math.round(rnd(36,44));
  const W=x=>1.5*x+8;
  switch(kind){
   case 'hagma':h=rnd(5,17);p=W(h)+rnd(-1.4,1.4);ag=12+(24-h)*rnd(0.95,1.7);break;
   case 'nagma':h=rnd(10,18);p=W(h)+rnd(-1.4,1.4);ag=rnd(8,12.5);break;
   case 'malk':h=rnd(31,42);p=0.7*h+20+rnd(-3,3);ag=rnd(10,13.5);break;
   case 'rac_a':p=rnd(56,85);h=24+(p-40)/10+rnd(-0.8,0.8);break;
   case 'rac_c':p=rnd(52,70);h=24+4*(p-40)/10+rnd(-1.2,1.2);break;
   case 'rac_ac':p=rnd(72,95);{const a=24+(p-40)/10,c=24+4*(p-40)/10;h=a+(c-a)*rnd(0.4,0.6);}break;
   case 'ralk_a':p=rnd(22,31);h=24-2*(40-p)/10+rnd(-0.8,0.8);break;
   case 'ralk_c':p=rnd(25,31);h=24-5*(40-p)/10+rnd(-0.8,0.8);break;
   case 'hag_rac':h=rnd(9,17);p=W(h)+rnd(7,22);ag=12+(24-h)*rnd(1,1.6);break;
   case 'hag_ralk':h=rnd(13,19);p=W(h)-rnd(5.5,9);ag=12+(24-h)*rnd(1,1.7);break;
   case 'hag_malk':h=rnd(17,25);ag=12+Math.max(6,(24-h)*rnd(2.6,3.6))+rnd(0,4);p=h<24?W(h)+rnd(-1.2,1.2):0.7*h+20;break;
   case 'hag_nag':h=rnd(8,15);ag=12+(24-h)*rnd(0.45,0.7);p=W(h)+rnd(-1.4,1.4);break;
   case 'hag_malk_ralk':h=rnd(15,21);ag=12+(24-h)*rnd(2.5,3.3);p=W(h)-rnd(5,9);break;
   case 'rac_malk':p=rnd(55,68);h=24+4*(p-40)/10+rnd(4.5,8);break;
   case 'ralk_malk':p=rnd(27,33);h=rnd(30,36);ag=rnd(10,13);break;
  }
  if(o.k)k=r1(rnd(o.k[0],o.k[1]));
  if(vg[0]==='lacsep'||vg[0]==='sepsisfat'||vg[0]==='apo')alb=Math.round(rnd(24,32));else if(Math.random()<0.2)alb=Math.round(rnd(18,28));
  h=r1(h);p=Math.round(Math.max(12,p));
  const pH=r2(phFrom(h,p));
  const alc=0.25*(40-alb);
  const cl=Math.round(na-ag-h+alc);
  const age=parseInt((vg[1].match(/(\d+)-year/)||[0,45])[1],10)||45;
  const c={pH,pco2:p,hco3:h,na,cl,k,alb,age,kind,cause:vg[0],vig:vg[1]};
  const agReal=na-(cl+h)+alc;
  if(o.lac==='gap')c.lac=r1(Math.max(2.2,(agReal-12)*rnd(0.75,0.95)));else if(o.lac)c.lac=r1(rnd(o.lac[0],o.lac[1]));else c.lac=r1(rnd(0.7,1.6));
  if(o.glu)c.glu=r1(rnd(o.glu[0],o.glu[1]));else c.glu=r1(rnd(4.5,7.5));
  c.urea=o.urea?r1(rnd(o.urea[0],o.urea[1])):r1(rnd(3,7));
  if(o.osm){c.osm=Math.round(2*na+c.glu+c.urea+rnd(18,40));}
  /* oxygen */
  const patm=S.patm||760;const ox=o.o||'n';c.ox=ox;
  let f=0.21;
  const PA=()=>f*(patm-47)-p/0.8, exAa=age/4+4;
  if(ox==='n'){f=0.21;c.po2=Math.round(Math.max(patm<740?77:82,PA()-exAa*rnd(0.3,0.9)));}
  else if(ox==='hv'){f=0.21;c.po2=Math.round(PA()-rnd(2,Math.max(3,exAa-2)));}
  else if(ox==='lung'){f=0.21;c.po2=Math.round(rnd(46,patm<740?68:72));if(PA()-c.po2<exAa+10)c.po2=Math.round(PA()-exAa-rnd(12,25));}
  else if(ox==='pf'){f=pick([0.4,0.5,0.6,0.8,1.0]);c.po2=Math.round(f*rnd(100,260));}
  c.fio2=f;
  return c;
}
function genCase(kind,level,gopt){level=level||4;gopt=gopt||{};const want=targetLabel(kind,level);
  for(let i=0;i<120;i++){const c=rawCase(kind);
    if(c.po2<30||c.cl<70||c.cl>130)continue;
    const o=interp(c,{usek:false});if(o.err||o.flags.includes('inconsistent'))continue;
    if(buildLabel(o.r,level)!==want)continue;
    if(level>=4&&o.ox){const exp={n:'normal',hv:'hv',lung:'lung',pf:'pf'}[c.ox];if(o.ox.cat!==exp)continue;}
    if(gopt.strict&&!clearCut(o))continue;
    c.o=o;c.label=want;
    if(gopt.ven){const v=toVenous(c);const ov=interp(v,{usek:false});if(ov.err||buildLabel(ov.r,level)!==want||ov.primKey!==o.primKey||ov.compKey!==o.compKey||!!ov.agHigh!==!!o.agHigh||phState(ov.est.pH)!==phState(v.pH)||(gopt.strict&&!clearCut(ov)))continue;v.o=ov;v.label=want;return v;}
    return c;}
  return null;}
const phState=x=>x<7.35?'acid':x>7.45?'alk':'normal';
/* reject gases that sit on a decision boundary, so every step has one defensible answer */
function clearCut(o){const e=o.est;
  if(Math.abs(e.pH-7.35)<0.015||Math.abs(e.pH-7.45)<0.015)return false;
  if([34,35,36,44,45,46].some(x=>Math.abs(e.pco2-x)<0.6))return false;
  if([22,26].some(x=>Math.abs(e.hco3-x)<0.6))return false;
  if(o.cband){const [lo,hi,pc]=o.cband;if(Math.min(Math.abs(pc-lo),Math.abs(pc-hi))<1.5)return false;}
  if(o.hband){const [a,c,h]=o.hband;if([a-2,a+2,c-2,c+2].some(x=>Math.abs(h-x)<1))return false;}
  if(o.agc!=null){const t=(S.agref||12)+2;if(Math.abs(o.agc-t)<2)return false;}
  if(o.delta!=null&&[0.4,0.8,2].some(x=>Math.abs(o.delta-x)<0.15))return false;
  return true;}
function toVenous(c){const v=Object.assign({},c);delete v.o;v.sample='v';v.pco2=Math.round(c.pco2+rnd(4,6));v.hco3=r1(c.hco3+1);v.pH=r2(phFrom(v.hco3,v.pco2));v.po2=Math.round(rnd(26,44));v.art=c;return v;}

const OXLAB={normal:'Normal / adequate oxygenation',hv:'Hypoxaemia, normal A–a (hypoventilation)',lung:'Hypoxaemia, raised A–a (lung problem)',pf:'Impaired oxygenation on O₂ (P/F < 300)'};
function labelPool(level){const s=new Set();kindsFor(level).forEach(k=>s.add(targetLabel(k,level)));return [...s];}
/* similar-label distractors for interleaving */
function distract(label,level,n){const pool=labelPool(level).filter(x=>x!==label);
  const score=x=>{let s=0;const a=label.toLowerCase(),b=x.toLowerCase();['acidosis','alkalosis','respiratory','metabolic','hagma','nagma','acute','chronic'].forEach(w=>{if(a.includes(w)&&b.includes(w))s++;});return s+Math.random()*1.5;};
  return pool.sort((a,b)=>score(b)-score(a)).slice(0,n);}


/* ---- input limits and uncertainty ---- */
const LIMITS={pH:[6.5,8.0],pco2:[5,200],hco3:[1,70],po2:[10,700],fio2:[0.21,1],na:[100,190],k:[1,10],cl:[60,150],alb:[5,60],lac:[0,40],glu:[0.5,120],urea:[0.5,100],osm:[200,450],age:[0,120]};
function validate(v){const names={pH:'pH',pco2:'PCO₂',hco3:'HCO₃⁻',po2:'PO₂',fio2:'FiO₂',na:'Na⁺',k:'K⁺',cl:'Cl⁻',alb:'Albumin',lac:'Lactate',glu:'Glucose',urea:'Urea',osm:'Osmolality',age:'Age'};
  for(const k in LIMITS){const x=v[k];if(x==null)continue;if(typeof x!=='number'||isNaN(x))return names[k]+' is not a number.';const [a,b]=LIMITS[k];if(x<a||x>b)return names[k]+' '+x+' is outside the possible range ('+a+'–'+b+(k==='pco2'||k==='po2'?' mmHg':'')+'). Check the units and the decimal point.';}
  return null;}
function toMm(x,unit){return unit==='kPa'?x*KPA:x;}
function uncertain(v,o,agref){const u=[];
  if(o.cband){const [lo,hi,pc]=o.cband;const m=Math.min(Math.abs(pc-lo),Math.abs(pc-hi));if(m<1.5)u.push('Compensation is within '+m.toFixed(1)+' mmHg of the edge of the expected band. The ± limits are statistical (95% bands from patient series), so a second respiratory process is possible but not proven. Trend the gas and look at the patient.');}
  if(o.hband){const [a,c,h]=o.hband;const edges=[a-2,a+2,c-2,c+2];const m=Math.min(...edges.map(e=>Math.abs(h-e)));if(m<1)u.push('HCO₃⁻ sits close to a boundary between acute, acute-on-chronic and chronic. The timing label is a best estimate; the history decides.');}
  if(o.agc!=null){if(Math.abs(o.agc-(agref+2))<2)u.push('Anion gap is borderline. Normal ranges are analyser-specific; use your lab\'s reference and the clinical picture.');if(v.alb==null)u.push('No albumin entered, so the gap is uncorrected. Low albumin hides a raised gap (≈ 2.5 per 10 g/L below 40).');}
  if(o.delta!=null)u.push('The Δ ratio assumes acid and bicarbonate change 1:1. It is supportive, not diagnostic: values near 0.8 or 2 are ambiguous, DKA often runs near 1, lactic acidosis near 1.6, and a pre-existing abnormal HCO₃⁻ shifts it.');
  if(o.ven)u.push('Venous sample: pH and HCO₃⁻ track arterial values well; the PCO₂ estimate can be off by more than 10 mmHg in either direction, especially in shock. Confirm with an ABG if a respiratory diagnosis changes management.');
  if(o.flags.includes('inconsistent'))u.push('The pH, PCO₂ and HCO₃⁻ do not satisfy Henderson–Hasselbalch, so every conclusion below is unreliable until the values are rechecked.');
  return u;}

/* ---- reference set: hand-checked interpretations, used by the test suite and loadable in the Interpreter ---- */
const REFCASES=[
 {n:'Normal gas',i:{pH:7.40,pco2:40,hco3:24,na:140,cl:104,alb:40},label:'Normal acid–base',prim:'none'},
 {n:'DKA, compensated',i:{pH:7.24,pco2:25,hco3:11,na:140,cl:105,alb:40},label:'High anion gap metabolic acidosis',prim:'mac',comp:'ok',ag:'high',deltaBand:'pure',note:'Winter: 1.5*11+8=24.5 (22.5–26.5); PCO2 25 inside. AG 140-(105+11)=24 high. delta (24-12)/(24-11)=0.92'},
 {n:'Salicylate',i:{pH:7.46,pco2:20,hco3:14,na:140,cl:104,alb:40},label:'HAGMA + respiratory alkalosis',prim:'ralk',note:'Winter: 1.5*14+8=29 (27–31); PCO2 20 below -> added resp alkalosis. AG 140-(104+14)=22.'},
 {n:'Septic shock, tiring',i:{pH:7.17,pco2:40,hco3:14,na:140,cl:102,alb:40},label:'HAGMA + respiratory acidosis',prim:'mac',comp:'rac',note:'Winter: 1.5*14+8=29; PCO2 40 above -> added resp acidosis. pH 6.1+log(14/1.2)=7.17'},
 {n:'Normal-looking gas, DKA + vomiting',i:{pH:7.40,pco2:40,hco3:24,na:145,cl:100,alb:40},label:'HAGMA + metabolic alkalosis',note:'AG 145-(100+24)=21 high with HCO3 24 -> hidden metabolic alkalosis (DKA + vomiting)'},
 {n:'Chronic CO2 retention',i:{pH:7.35,pco2:60,hco3:32},label:'Chronic respiratory acidosis',prim:'rac',comp:'c',note:'Chronic resp acidosis: 24+4*2=32 (30–34); HCO3 32. pH 6.1+log(32/1.8)=7.35'},
 {n:'Opioid overdose',i:{pH:7.26,pco2:60,hco3:26},label:'Acute respiratory acidosis',prim:'rac',comp:'a',note:'Acute resp acidosis: 24+2=26 (24–28); HCO3 26. pH 6.1+log(26/1.8)=7.26'},
 {n:'COPD exacerbation',i:{pH:7.25,pco2:80,hco3:34},label:'Acute-on-chronic respiratory acidosis',prim:'rac',comp:'ac',note:'Acute 24+4=28, chronic 24+16=40; HCO3 34 between -> acute on chronic. pH 6.1+log(34/2.4)=7.25'},
 {n:'COPD on diuretics',i:{pH:7.45,pco2:60,hco3:40},label:'Metabolic alkalosis + respiratory acidosis',note:'Chronic predicts 24+8=32 (30–34); HCO3 40 -> added metabolic alkalosis. pH 6.1+log(40/1.8)=7.45'},
 {n:'Vomiting',i:{pH:7.50,pco2:48,hco3:36,na:138,cl:90,alb:40},label:'Metabolic alkalosis',prim:'malk',comp:'ok',note:'Met alk: 0.7*36+20=45.2 (40.2–50.2); PCO2 48 inside. pH 6.1+log(36/1.44)=7.50'},
 {n:'Panic attack',i:{pH:7.55,pco2:25,hco3:21},label:'Acute respiratory alkalosis',prim:'ralk',comp:'a',note:'Acute resp alk: 24-2*1.5=21 (19–23); HCO3 21. pH 6.1+log(21/0.75)=7.55'},
 {n:'Pregnancy',i:{pH:7.42,pco2:30,hco3:19},label:'Chronic respiratory alkalosis',prim:'ralk',comp:'c',note:'Chronic resp alk: 24-5*1=19 (17–21); HCO3 19; pH 6.1+log(19/0.9)=7.42 (normal pH, chronic)'},
 {n:'Diarrhoea',i:{pH:7.29,pco2:28,hco3:13,na:138,cl:112,alb:40},label:'Normal anion gap metabolic acidosis',prim:'mac',comp:'ok',ag:'normal',note:'AG 138-(112+13)=13 normal. Winter 1.5*13+8=27.5; PCO2 28 ok.'},
 {n:'Albumin hides the gap',i:{pH:7.33,pco2:34,hco3:18,na:140,cl:110,alb:15},label:'High anion gap metabolic acidosis',ag:'high',note:'AG 140-(110+18)=12; corrected 12+0.25*25=18.25 high. delta (18.25-12)/(24-18)=1.04. Winter 35 (33–37); PCO2 34 ok.'},
 {n:'Diarrhoea + AKI',i:{pH:7.20,pco2:23,hco3:10,na:140,cl:112,alb:40},label:'HAGMA + NAGMA',deltaBand:'mixed',note:'AG 140-(106+10)=24; delta (24-12)/(14)=0.86 pure; but lower: Na 140 Cl 112 HCO3 10 -> AG 18, delta 6/14=0.43 -> HAGMA+NAGMA'},
 {n:'Triple disorder',i:{pH:7.48,pco2:25,hco3:18,na:140,cl:96,alb:40},label:'HAGMA + metabolic alkalosis + respiratory alkalosis',note:'Triple: AG 140-(96+18)=26, delta 14/6=2.33 -> + met alk; Winter 35 (33-37), PCO2 25 -> + resp alk. pH 6.1+log(18/0.75)=7.48'},
 {n:'Transcription error',i:{pH:7.40,pco2:60,hco3:24},flag:'inconsistent',note:'Inconsistent: Henderson 24*60/24=60 nmol/L (pH 7.22) vs pH 7.40 (40)'},
 {n:'Venous DKA',i:{sample:'v',pH:7.18,pco2:30,hco3:11,na:136,cl:100,alb:40},label:'High anion gap metabolic acidosis',noOx:true,note:'Venous: estimated arterial pH 7.21, PCO2 25, HCO3 10 -> Winter 23 (21-25) ok'},
 {n:'Hypoventilation A-a',i:{pH:7.18,pco2:80,hco3:29,po2:48,fio2:0.21,age:30},ox:'hv',note:'Oxygenation: room air sea level PaCO2 80 PaO2 48 age 30: PAO2 150-100=50; A-a 2 -> hypoventilation'},
 {n:'PE A-a',i:{pH:7.49,pco2:29,hco3:21.6,po2:62,fio2:0.21,age:52},ox:'lung',note:'PE: PAO2 150-36.25=113.75; A-a 113.75-62=51.75 raised'},
 {n:'ARDS P/F',i:{pH:7.35,pco2:42,hco3:22.6,po2:90,fio2:0.6,age:50},ox:'pf',pf:150,note:'P/F 90/0.6=150'}
];
const REFINVALID=[
 {i:{pH:9.1,pco2:40,hco3:24},why:'pH out of range'},
 {i:{pH:7.4,pco2:0,hco3:24},why:'PCO2 zero'},
 {i:{pH:7.4,pco2:40,hco3:-3},why:'negative HCO3'},
 {i:{pH:7.4},why:'missing PCO2'},
 {i:{pco2:40,hco3:24},why:'missing pH'},
 {i:{pH:7.4,pco2:5.3,hco3:24},why:'kPa entered as mmHg (5.3 mmHg)',expectFlag:'inconsistent'},
 {i:{pH:7.4,pco2:40,hco3:24,na:14},why:'Na typo'},
 {i:{pH:7.4,pco2:40,hco3:24,fio2:21},why:'FiO2 as percent'},
];
