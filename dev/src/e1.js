/* ================= CORE: STATE, UNITS, INTERPRETER, GENERATOR ================= */
const KPA=7.50062;
const DEF={done:{},qs:{},kinds:{},reflex:{lvl:1,hist:[]},days:[],read:0,units:'mmHg',patm:760,agref:12,usek:false,conf:[],exams:[]};
let S=JSON.parse(JSON.stringify(DEF));
/* persistent state: one key, schema-versioned; unknown or damaged fields fall back to defaults */
const DEF2={v:4,goal:15,sessLen:10,lvl:4,hints:'auto',dayN:{},steps:{},ret:{n:0,c:0},gym:{n:0,c:0},mist:[],sess:[],ui:{},xp:0,why:{},teach:{},scen:{},badges:{},flash:{},est:{n:0,c:0},serial:{},gaslog:[],speed:{},cases:{},cmist:[],qmiss:{},theme:'dark',quiet:true,skin:'pixel',google:{clientId:'',syncState:true,publish:true},lastRound:'',roundsDone:0,round:null,savedAt:'',epoch:0,
  /* 5.0: per-day weekly-review record (ui6), number-key shortcuts (ui3 Settings), Yuzu sent marks (ui9), measured minutes of the last Round (ui5/ui10). No ctr here: hub.js keeps it (a missing ctr means a 4.9 save). */
  wk:{},keys:true,yzSent:{},lastRoundMin:0};
function migrate(o){const d=JSON.parse(JSON.stringify(DEF)),d2=JSON.parse(JSON.stringify(DEF2));const out=Object.assign(d,d2);
  if(!o||typeof o!=='object')return out;
  for(const k in out){if(!(k in o))continue;const a=out[k],b=o[k];
    if(Array.isArray(a)){if(Array.isArray(b))out[k]=b;}
    else if(a&&typeof a==='object'){if(b&&typeof b==='object'&&!Array.isArray(b))out[k]=Object.assign(a,b);}
    else if(typeof b===typeof a)out[k]=b;}
  if(!Array.isArray(out.reflex.hist))out.reflex.hist=[];
  for(const k in out.kinds){const s=out.kinds[k];if(!s||typeof s!=='object'||!(k in KINDS))delete out.kinds[k];}
  if(!(+o.v>=4)){out.quiet=true;if(out.theme==='auto')out.theme='dark';}
  e1sane(out,d2);
  out.v=4;return out;}
/* value-level checks after the type merge: enums, ranges, and the shape of items inside arrays and maps.
   Restore, Drive sync and load all pass through migrate(), so bad data cannot crash a view or be saved back. */
function e1sane(s,D){const DD=Object.assign(JSON.parse(JSON.stringify(DEF)),D);
  const isO=x=>!!x&&typeof x==='object'&&!Array.isArray(x),fin=x=>typeof x==='number'&&isFinite(x);
  const en=(k,ok)=>{if(!ok.includes(s[k]))s[k]=DD[k];};
  const num=(k,a,b,int)=>{const x=s[k];if(!fin(x)||x<a||x>b)s[k]=DD[k];else if(int)s[k]=Math.round(x);};
  en('units',['mmHg','kPa']);en('theme',['auto','light','dark']);en('skin',['pixel','clinical']);en('hints',['auto','always','never']);
  num('lvl',1,4,1);num('sessLen',3,50,1);num('goal',5,60,1);num('patm',500,800);num('agref',4,16);num('xp',0,1e9,1);num('read',0,1e9,1);num('roundsDone',0,1e9,1);num('epoch',0,1e15);
  ['ret','gym','est'].forEach(k=>{const x=s[k];if(!fin(x.n)||x.n<0)x.n=0;if(!fin(x.c)||x.c<0)x.c=0;});
  if(!fin(s.reflex.lvl)||s.reflex.lvl<1||s.reflex.lvl>4)s.reflex.lvl=1;
  s.reflex.hist=s.reflex.hist.filter(x=>isO(x)&&fin(x.l)&&fin(x.t));
  s.gaslog=s.gaslog.filter(x=>isO(x)&&typeof x.id==='string'&&(x.del||isO(x.v)));
  s.sess=s.sess.filter(x=>isO(x)&&typeof x.d==='string'&&typeof x.m==='string');
  s.mist=s.mist.filter(x=>isO(x)&&isO(x.c));
  s.cmist=s.cmist.filter(isO);s.conf=s.conf.filter(isO);s.exams=s.exams.filter(x=>x!=null);
  s.days=[...new Set(s.days.filter(x=>typeof x==='string'&&/^\d{4}-\d\d-\d\d$/.test(x)))].sort().slice(-400);
  ['flash','cases','speed','scen','steps','teach','serial','kinds'].forEach(k=>{const m=s[k];for(const i in m)if(!isO(m[i]))delete m[i];});
  ['done','qs','why','badges','qmiss','dayN'].forEach(k=>{const m=s[k];for(const i in m)if(m[i]==null)delete m[i];});
  for(const i in s.dayN)if(!/^\d{4}-\d\d-\d\d$/.test(i)||!fin(s.dayN[i]))delete s.dayN[i];
  for(const d in s.wk){const x=s.wk[d];if(!/^\d{4}-\d\d-\d\d$/.test(d)||!isO(x)){delete s.wk[d];continue;}
    ['s','k'].forEach(f=>{if(!isO(x[f]))x[f]={};for(const i in x[f]){const p=x[f][i];if(!Array.isArray(p)||p.length!==2||!p.every(n=>fin(n)&&n>=0))delete x[f][i];}});
    if(!fin(x.ms)||x.ms<0)x.ms=0;}
  for(const i in s.yzSent)if(!fin(s.yzSent[i])||s.yzSent[i]<0)delete s.yzSent[i];
  num('lastRoundMin',0,1440);
  if('simPace' in s.ui){const p=s.ui.simPace;if(!fin(p)||p<1||p>10)delete s.ui.simPace;else s.ui.simPace=Math.round(p);}
  if(s.round!=null&&!isO(s.round))s.round=null;
  return s;}
let SAVE_OK=true,LOAD_ERR=null;
function load(){let r=null;try{r=localStorage.getItem('buffer.v1');S=migrate(r?JSON.parse(r):null);}
  catch(e){S=migrate(null);
    /* keep the unreadable save before anything overwrites it; UI shows LOAD_ERR */
    if(r){try{localStorage.setItem('buffer.v1.corrupt',r);localStorage.setItem('buffer.v1.corrupt.at',new Date().toISOString());}catch(e2){}LOAD_ERR='Your saved progress could not be read. A copy was kept. Restore from Drive or a backup.';}}
  try{if(navigator.storage&&navigator.storage.persist&&window.matchMedia&&matchMedia('(display-mode: standalone)').matches)navigator.storage.persist();}catch(e){}}
function save(){try{localStorage.setItem('buffer.v1',JSON.stringify(S));SAVE_OK=true;}catch(e){if(SAVE_OK&&typeof toast==='function')toast('Progress could not be saved in this browser.','bad');SAVE_OK=false;}return SAVE_OK;}
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
/* interpreter text helpers (D10) */
function e1pH(x){const t=Math.round(x*1000);return t%10===0?(t/1000).toFixed(2):(t/1000).toFixed(3);}
function e1neg(s){return String(s).replace(/^-/,'−');}
function e1dP(x,kpa){return kpa?(x/KPA).toFixed(1)+' kPa ('+r1(x)+' mmHg)':r1(x)+' mmHg';}
function e1Winter(h,lo,hi,pc,kpa){const e=1.5*h+8;return 'Winter\'s: 1.5 × '+r1(h)+' + 8 = '+r1(e)+(kpa?' mmHg ± 2 (in kPa: 0.2 × HCO₃⁻ + 1.07 = '+(e/KPA).toFixed(2)+' ± 0.27)':' ± 2')+' → expected PCO₂ '+P(lo)+'–'+P(hi)+' '+PU()+'. Measured '+P(pc)+'.';}

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
  const usek=opt.usek!=null?opt.usek:S.usek, patm=opt.patm||S.patm||760, agref=(opt.agref||S.agref||12)+(usek&&inp.k!=null?4:0);
  const kpa=S.units==='kPa', U=PU();
  /* pressures are judged on the numbers the reader sees: rounded to the display unit */
  const rd=x=>kpa?Math.round(x/KPA*10)/10:Math.round(x);
  const st=[];const flags=[];const causes=[];const notes=[];
  const v=Object.assign({},inp);
  const ven=v.sample==='v', cord=v.ctx==='cord';
  if(v.pH==null||v.pco2==null||isNaN(v.pH)||isNaN(v.pco2)||(v.hco3!=null&&isNaN(v.hco3)))return {err:'Enter at least pH and PCO₂.'};
  const hcalc=v.hco3==null||!!v._hcalc;
  const bad=validate(hcalc?Object.assign({},v,{hco3:null}):v);if(bad)return {err:bad};
  if(v.hco3==null)v.hco3=r1(hFrom(v.pH,v.pco2));
  if(hcalc&&(v.hco3<LIMITS.hco3[0]||v.hco3>LIMITS.hco3[1]))return {err:'pH '+e1pH(v.pH)+' and PCO₂ '+P(v.pco2)+' '+U+' together imply an HCO₃⁻ of '+r1(v.hco3)+' mmol/L, which is not possible. Check both values.'};
  let pH=v.pH,pc=v.pco2,h=v.hco3;const hm=v.hco3;const pcFloor=ven&&pc-5<10;
  if(ven){pH=Math.round((pH+0.03)*1000)/1000;pc=Math.max(10,pc-5);h=r1(h-1);}
  const out={steps:st,flags,causes,ven,cord,est:{pH,pco2:pc,hco3:h}};
  const tagV=ven?' (estimated arterial)':'';
  /* 1 consistency */
  const Hm=Math.pow(10,9-v.pH),Hc=24*v.pco2/v.hco3,diff=hcalc?0:Math.abs(Hc-Hm)/Hm;
  const venNote=ven?' <b>Venous sample:</b> acid–base read on estimated arterial values (pH +0.03, PCO₂ −5'+(pcFloor?', floored at '+P(10)+' '+U:'')+', HCO₃⁻ −1). The anion gap uses the measured HCO₃⁻. The PCO₂ estimate is approximate; oxygenation is not assessed.':'';
  if(hcalc)st.push({k:'real',t:'Is it real?',tone:'info',v:'Not checked: HCO₃⁻ calculated',d:'HCO₃⁻ '+r1(v.hco3)+' was calculated from pH and PCO₂, so the consistency check cannot be made. Enter the analyser HCO₃⁻ to check it.'+venNote});
  else st.push({k:'real',t:'Is it real?',tone:diff>0.1?'bad':'ok',v:diff>0.1?'Numbers do not fit together':'Internally consistent',
    d:'Henderson: 24 × '+P(v.pco2,'mmHg')+' mmHg ÷ '+v.hco3+' = '+Hc.toFixed(0)+' nmol/L; measured [H⁺] at pH '+e1pH(v.pH)+' = '+Hm.toFixed(0)+' nmol/L.'+(diff>0.1?' A difference above 10% means a transcription error, values from different samples, or lab total CO₂ mixed with a gas pH. Recheck before interpreting.':'')+venNote});
  if(diff>0.1)flags.push('inconsistent');
  /* 2 pH */
  const acid=pH<7.35,alk=pH>7.45;
  let phd='pH '+e1pH(pH)+tagV+'. Normal 7.35–7.45.'+(!acid&&!alk?' A normal pH can still hide two opposing disorders; keep going.':'')+(pH<7.2?' Severe acidaemia.':pH>7.6?' Severe alkalaemia.':'');
  if(cord){const bd=-beFrom(pH,h);out.cordPath=pH<7&&bd>=12;phd+=' <b>Cord blood:</b> base deficit '+r1(bd)+' mmol/L. Pathological (metabolic) acidaemia in cord artery blood is pH < 7.0 with a base deficit ≥ 12 (ACOG 2006): '+(out.cordPath?'met.':'not met.');}
  st.push({k:'ph',t:'Acidaemia or alkalaemia?',tone:acid||alk?(pH<7.2||pH>7.6?'bad':'warn'):'ok',v:acid?'Acidaemia':alk?'Alkalaemia':'pH in normal range',d:phd});
  /* 3 primary */
  const lowH=h<22,highH=h>26,highC=pc>45,lowC=pc<35;
  let prim=[];
  if(acid){if(highC)prim.push('R');if(lowH)prim.push('M');}
  else if(alk){if(lowC)prim.push('R');if(highH)prim.push('M');}
  else{ if(highC&&highH)prim.push(pH<7.4?'R':'M');
    else if(lowC&&lowH)prim.push(pH<7.4?'M':'R');
    else if(highC&&lowH)prim=['R','M'];else if(lowC&&highH)prim=['R','M'];
    else if(highC||lowC)prim.push('R');else if(highH||lowH)prim.push('M');}
  if(!acid&&!alk&&((highC&&highH)||(lowC&&lowH))&&Math.abs(pH-7.4)<=0.02)notes.push('pH is within 0.02 of 7.40 and both values moved the same way, so which process is primary cannot be told from the gas. The history decides.');
  let tilt=false;
  if(!prim.length&&(acid||alk)){const md=Math.abs(24-h)/24,rdv=Math.abs(pc-40)/40;prim.push(md>rdv?'M':'R');tilt=true;
    notes.push('pH is just outside the normal range but PCO₂ and HCO₃⁻ are both within range. The primary process is a best guess from the larger relative change; treat it as mild or borderline.');}
  const r={mac:null,malk:false,rac:false,ralk:false,rq:null};
  prim.forEach(p=>{if(p==='R'){if(pc>40)r.rac=true;else r.ralk=true;}else{if(h<24)r.mac='?';else r.malk=true;}});
  let sys;
  if(!prim.length)sys='No primary disturbance in PCO₂ or HCO₃⁻';
  else if(prim.length===2)sys='Two primary processes: '+(r.mac?'metabolic acidosis':'metabolic alkalosis')+' and '+(r.rac?'respiratory acidosis':'respiratory alkalosis');
  else sys='Primary '+(prim[0]==='R'?(r.rac?'respiratory acidosis':'respiratory alkalosis'):(r.mac?'metabolic acidosis':'metabolic alkalosis'));
  out.prim=prim.slice();out.primKey=!prim.length?'none':prim.length===2?'two':prim[0]==='R'?(r.rac?'rac':'ralk'):(r.mac?'mac':'malk');
  if(tilt)sys+=' (borderline)';
  st.push({k:'sys',t:'Which system?',tone:prim.length===2?'bad':prim.length?'warn':'ok',v:sys,d:'PCO₂ '+P(pc)+' '+U+' ('+(highC?'high':lowC?'low':'normal')+'), HCO₃⁻ '+r1(h)+' ('+(highH?'high':lowH?'low':'normal')+')'+tagV+'. '+(prim.length===2?'Both values moved in the same pH direction, so neither can be compensation.':tilt?'Both values are within range; the slight tilt is '+(prim[0]==='R'?'respiratory (PCO₂ '+(pc>40?'above':'below')+' 40)':'metabolic (HCO₃⁻ '+(h<24?'below':'above')+' 24)')+'. Read it as mild or borderline.':prim.length?'The value that moved in the direction of the pH change is the cause; the other is compensation.':'')});
  /* anion gap first: a high gap changes how a low HCO₃⁻ is read in step 4. The gap uses the measured HCO₃⁻ (also on venous samples). */
  let ag=null,agc=null,agHigh=false,agBord=false,rise=null;
  if(v.na!=null&&v.cl!=null){ag=r1(v.na-(v.cl+hm)+(usek&&v.k!=null?v.k:0));agc=r1(ag+(v.alb!=null?0.25*(40-v.alb):0));agHigh=agc>agref+2;agBord=!agHigh&&agc>agref;rise=r1(agc-agref);}
  let base=24;
  /* 4 compensation */
  let comp={t:'Is compensation appropriate?',tone:'ok',v:'—',d:''};
  if(prim.length===1){
    if(r.mac){const e=1.5*h+8,lo=e-2,hi=e+2;out.cband=[lo,hi,pc];comp.d=e1Winter(h,lo,hi,pc,kpa);
      if(rd(pc)>rd(hi)){r.rac=true;comp.code='rac';comp.v='PCO₂ too high: added respiratory acidosis';comp.tone='bad';comp.d+=' The lungs are not keeping up (fatigue, sedation, chest disease, neuromuscular weakness).';}
      else if(rd(pc)<rd(lo)){r.ralk=true;comp.code='ralk';comp.v='PCO₂ too low: added respiratory alkalosis';comp.tone='bad';comp.d+=' Something extra is driving ventilation (salicylate, sepsis, liver failure, pain, hypoxaemia).';}
      else{comp.code='ok';comp.v='Appropriate respiratory compensation';}}
    else if(r.malk){const e=0.7*h+20,lo=e-5,hi=e+5;out.cband=[lo,hi,pc];comp.d='Expected PCO₂ = 0.7 × '+r1(h)+' + 20 = '+r1(e)+(kpa?' mmHg ± 5 ('+(e/KPA).toFixed(1)+' ± 0.7 kPa)':' ± 5')+' → '+P(lo)+'–'+P(hi)+' '+U+'. Measured '+P(pc)+'.';
      if(rd(pc)>rd(hi)){r.rac=true;comp.code='rac';comp.v='PCO₂ too high: added respiratory acidosis';comp.tone='bad';}
      else if(rd(pc)<rd(lo)){r.ralk=true;comp.code='ralk';comp.v='PCO₂ too low: added respiratory alkalosis';comp.tone='bad';}
      else{comp.code='ok';comp.v='Appropriate respiratory compensation';}}
    else if(r.rac){const d=(pc-40)/10,a=r1(24+d),c=r1(24+4*d),hh=r1(h);out.hband=[a,c,h];comp.d='PCO₂ up '+e1dP(pc-40,kpa)+'. Acute (+1 per 10 mmHg): HCO₃⁻ ≈ '+a+' ('+r1(a-2)+'–'+r1(a+2)+'); chronic (+4 per 10): ≈ '+c+' ('+r1(c-2)+'–'+r1(c+2)+'). Measured '+hh+'.';
      if(hh<r1(a-2)){comp.code='mac';r.mac='?';comp.v='HCO₃⁻ too low: added metabolic acidosis';comp.tone='bad';base=a;}
      else if(hh<=r1(a+2)){comp.code='a';r.rq='a';comp.v='Acute (minutes–hours)';comp.tone='warn';base=a;}
      else if(hh<r1(c-2)){comp.code='ac';r.rq='ac';comp.v='Between acute and chronic: acute-on-chronic, or 1–2 days old';comp.tone='warn';base=hh;}
      else if(hh<=r1(c+2)){comp.code='c';r.rq='c';comp.v='Chronic, renally compensated';base=c;}
      else{comp.code='malk';r.malk=true;comp.v='HCO₃⁻ above the chronic prediction: added metabolic alkalosis';comp.tone='bad';base=c;}
      if(agHigh&&comp.code!=='mac')comp.d+=' The anion gap is high, and a high-gap acidosis lowers HCO₃⁻, so this timing may be wrong (a chronic retainer with a new acidosis can look acute).';}
    else if(r.ralk){const d=(40-pc)/10,a=r1(24-2*d),c0=24-5*d,c=r1(Math.max(14,c0)),hh=r1(h);out.hband=[a,c,h];comp.d='PCO₂ down '+e1dP(40-pc,kpa)+'. Acute (−2 per 10 mmHg): HCO₃⁻ ≈ '+a+' ('+r1(a-2)+'–'+r1(a+2)+'); chronic (−5 per 10): ≈ '+c+' ('+r1(c-2)+'–'+r1(c+2)+')'+(c0<14?', held there because renal compensation rarely takes HCO₃⁻ below about 12':'')+'. Measured '+hh+'.';
      if(hh>r1(a+2)){comp.code='malk';r.malk=true;comp.v='HCO₃⁻ too high: added metabolic alkalosis';comp.tone='bad';base=a;}
      else if(hh>=r1(a-2)){comp.code='a';r.rq='a';comp.v='Acute (minutes–hours)';comp.tone='warn';base=a;}
      else if(agHigh){/* the low HCO₃⁻ is a high-gap acidosis, not renal compensation: judge the PCO₂ with Winter's */
        const e=1.5*h+8,lo=e-2,hi=e+2;delete out.hband;notes.splice(0,notes.length);out.cband=[lo,hi,pc];comp.code='mac';r.mac='?';r.rq=null;comp.tone='bad';base=24;
        comp.v='Low HCO₃⁻ is a high-gap acidosis, not renal compensation';
        comp.d+=' The anion gap is high ('+agc+'), so the fall in HCO₃⁻ is a metabolic acidosis and the respiratory alkalosis cannot be timed from it. Check the PCO₂ against the acidosis instead. '+e1Winter(h,lo,hi,pc,kpa);
        if(rd(pc)<rd(lo))comp.d+=' PCO₂ is below this band, so the respiratory alkalosis is a second primary process (think salicylate, sepsis, liver failure).';
        else{r.ralk=false;comp.d+=' PCO₂ fits the band, so the low PCO₂ can be compensation alone.';}}
      else if(hh>r1(c+2)){comp.code='p';r.rq='p';comp.v='Partly compensated (hours to 2 days)';comp.tone='warn';base=hh;}
      else if(hh>=r1(c-2)){comp.code='c';r.rq='c';comp.v='Chronic, renally compensated';base=c;}
      else{comp.code='mac';r.mac='?';comp.v='HCO₃⁻ below the chronic prediction: added metabolic acidosis';comp.tone='bad';base=24;}}
  }else if(prim.length===2){comp.code='na';comp.v='Not applicable: two primary disorders';comp.tone='bad';comp.d='When both systems push pH the same way, the patient cannot compensate. Expect severe pH derangement.';}
  else{comp.code='na';comp.v='Nothing to compensate';comp.d='PCO₂ and HCO₃⁻ are both within range.';}
  if(cord)comp.d+=' Fetal blood: adult compensation rules are only a rough guide.';
  out.compKey=comp.code;st.push(Object.assign({k:'comp'},comp));
  /* 5 gaps */
  let delta=null,og=null,ogTxt='';
  if(v.osm!=null&&v.na!=null){if(v.glu!=null&&v.urea!=null){const calc=2*v.na+v.glu+v.urea;og=r1(v.osm-calc);ogTxt=' Osmolar gap = '+v.osm+' − (2 × '+v.na+' + '+v.glu+' + '+v.urea+') = '+og+(og>10?': raised, think toxic alcohol.':': normal.');}
    else ogTxt=' Osmolality entered: add glucose and urea to calculate the osmolar gap.';}
  if(agc!=null){
    const high=agHigh,bord=agBord,kTxt=usek&&v.k!=null?' (K⁺ included)':usek?' (K⁺ not entered, so calculated without it)':'';
    let d='AG = '+v.na+' − ('+v.cl+' + '+r1(hm)+')'+(usek&&v.k!=null?' + '+v.k:'')+' = '+ag+(v.alb!=null?'; albumin '+v.alb+' g/L → corrected '+agc:'')+'. Reference ≈ '+agref+kTxt+'.'+(ven?' Measured (venous) HCO₃⁻ used, as for a lab gap.':'');
    out.agHigh=high;out.agBord=bord;if(high)r.mac='HAGMA';
    else if(r.mac==='?')r.mac='NAGMA';
    let tone=high?'bad':bord?'warn':'ok',vv=high?'High anion gap ('+agc+')':bord?'Borderline anion gap ('+agc+')':'Normal anion gap ('+agc+')';
    if(high){const b=r1(base+(ven?1:0)),dH=r1(b-hm),bTxt=b===(ven?25:24)?b+(ven?' (venous normal)':''):b+' (the HCO₃⁻ expected from the respiratory process)';out.base=b;
      if(dH>=2){delta=r2(rise/dH);d+=' Δ ratio = ('+agc+' − '+agref+') ÷ ('+bTxt+' − '+r1(hm)+') = '+delta.toFixed(2)+'. ';
        if(delta<0.4){r.mac='HN';d+='Below 0.4: a hyperchloraemic acidosis dominates alongside the gap.';}
        else if(delta<0.8){r.mac='HN';d+='0.4–0.8: combined high AG and normal AG acidosis.';}
        else if(delta<=2){d+='0.8–2: pure high AG acidosis.';}
        else{r.malk=true;d+='Above 2: the bicarbonate fell less than the gap rose, so a metabolic alkalosis coexists.';}
        d+=' Corrected HCO₃⁻ = '+r1(hm)+' + '+rise+' = '+r1(hm+rise)+' (expected ≈ '+b+').';}
      else if(rise>=6){r.malk=true;d+=' HCO₃⁻ '+r1(hm)+' has barely fallen from '+b+' although the gap rose by '+rise+': a metabolic alkalosis is hiding the acidosis. Corrected HCO₃⁻ = '+r1(hm+rise)+'. Δ ratio not used (denominator too small).';}
      else d+=' Δ ratio not meaningful: the gap rose only '+rise+' and HCO₃⁻ barely moved from '+b+'. A small hidden metabolic alkalosis cannot be excluded; recheck albumin and lactate.';}
    else if(r.mac==='NAGMA'){d+=' Normal gap: bicarbonate lost or chloride gained (HARDASS).';}
    if(v.lac!=null&&high){if(v.lac>rise+1)d+=' Lactate '+v.lac+' exceeds the gap rise ('+rise+'): check albumin, and consider a coexisting normal-gap acidosis or a low-gap process.';else d+=' Lactate '+v.lac+' accounts for ≈ '+Math.round(v.lac/Math.max(0.1,rise)*100)+'% of the gap rise.';}
    st.push({k:'gap',t:'The gaps',tone:og!=null&&og>10&&tone==='ok'?'warn':tone,v:vv,d:d+ogTxt});
  }else{
    st.push({k:'gap',t:'The gaps',tone:og!=null&&og>10?'warn':'info',v:'Anion gap not calculated',d:'Add Na⁺ and Cl⁻ (and albumin) to split metabolic acidosis into high and normal gap, and to catch hidden disorders.'+ogTxt});
  }
  /* resp qualifier drop when mixed */
  if((r.mac||r.malk)&&(r.rac||r.ralk)&&prim.length===1&&prim[0]==='R'&&r.rq){/* keep rq info in text only */}
  out.r=r;out.ag=ag;out.agc=agc;out.delta=delta;out.og=og;
  out.label=buildLabel(r,4);
  /* 6 oxygen */
  out.ox=null;
  /* co-oximetry: read on every sample type (venous COHb and MetHb are valid) */
  const coL=[],coHi=[],coRaised=v.cohb!=null&&v.cohb>3,metRaised=v.methb!=null&&v.methb>1.5;
  if(v.cohb!=null&&v.cohb>10){coHi.push('COHb '+v.cohb+'%');coL.push('COHb '+v.cohb+'%: carbon monoxide poisoning. Give 100% oxygen (non-rebreather, or via the ventilator) until COHb is below 3% and symptoms have settled; do not titrate oxygen down. Discuss hyperbaric oxygen if severe (loss of consciousness, neurological signs, pregnancy, COHb above 25%). SpO₂ reads falsely normal.');}
  else if(coRaised)coL.push('COHb '+v.cohb+'%: raised. Smokers run up to about 10%; think carbon monoxide if a non-smoker or symptomatic, and if exposure is possible keep high-flow oxygen rather than titrating down.');
  if(metRaised){if(v.methb>10)coHi.push('MetHb '+v.methb+'%');coL.push('MetHb '+v.methb+'%: '+(v.methb>20?'treat if symptomatic, or at any level above 30% (methylene blue 1–2 mg/kg unless G6PD deficient).':v.methb>10?'significant; watch for symptoms.':'raised.')+' SpO₂ is unreliable with MetHb (it drifts towards 85%): do not titrate oxygen to SpO₂.');}
  const coHiT=coHi.join(', ');out.coHi=coHiT||null;
  if(!ven&&!cord&&v.po2!=null){const fset=v.fio2!=null,f=fset?v.fio2:0.21;const PA=f*(patm-47)-v.pco2/0.8;const Aa=PA-v.po2;const exAa=v.age!=null?v.age/4+4:null;const lim=exAa!=null?exAa+5:20;const pf=v.po2/f;
    const pfD=x=>kpa?r1(x/KPA):Math.round(x),pfS=pfD(pf)+(kpa?' kPa':'');
    const raised=rd(Aa)>rd(lim),implaus=Aa<-10;let cat,vv,tone='ok';
    /* room-air lower limit: 80 mmHg, falling with age over 60 (≈ 100 − age/3), scaled for altitude by the inspired PO₂ */
    const hypT=(v.age!=null&&v.age>60?Math.min(80,100-v.age/3):80)*(patm-47)/713;
    const hyp=rd(v.po2)<rd(f<=0.22?hypT:60);
    if(f<=0.22){
      if(hyp&&!raised){cat='hv';vv='Hypoxaemia with a normal A–a gradient';tone='warn';}
      else if(hyp){cat='lung';vv='Hypoxaemia with a raised A–a gradient';tone='bad';}
      else if(raised){cat='lungmild';vv='PaO₂ adequate, but A–a gradient raised';tone='warn';}
      else{cat='normal';vv='Normal oxygenation';}}
    else{ if(pfD(pf)<=pfD(300)){cat='pf';vv='Impaired oxygenation on supplemental O₂ (P/F '+pfS+')';tone=pfD(pf)<=pfD(200)?'bad':'warn';}
      else{cat='normal';vv='Adequate oxygenation on supplemental O₂';}}
    let d='PaO₂ '+P(v.po2)+' '+U+' on FiO₂ '+f.toFixed(2)+(fset?'':' (FiO₂ not entered: room air assumed)')+(v.peep!=null?', PEEP '+v.peep+' cmH₂O':'')+'. P/F = '+pfS+'. ';
    d+=kpa?'PAO₂ = '+f.toFixed(2)+' × ('+(patm/KPA).toFixed(1)+' − 6.3) − '+P(v.pco2)+'/0.8 = '+P(PA)+' kPa':'PAO₂ = '+f.toFixed(2)+' × ('+patm+' − 47) − '+Math.round(v.pco2)+'/0.8 = '+P(PA)+' mmHg';
    d+='; A–a = '+e1neg(P(Aa))+(f>0.22?'':exAa!=null?' (age '+v.age+': expected ≤ '+P(exAa)+'; called raised above '+P(lim)+', allowing 5 for normal spread)':' (no age entered: called raised above '+P(20)+'; the age limit is about '+P(14)+' at 40 and '+P(24)+' at 80)')+'.';
    if(f<=0.22)d+=' Lower limit of PaO₂ on air ≈ '+P(hypT)+' '+U+(patm<740?' at this altitude':'')+(v.age!=null&&v.age>60?' for age '+v.age:'')+'.';
    if(f>0.22)d+=' Expected PaO₂ in healthy lungs ≈ '+P(f*100*5)+'. A–a widens on oxygen, so use the P/F here.';
    if(rd(v.po2)<rd(60))d+=' Respiratory failure type '+(v.pco2>45?'2 (hypercapnic).':'1 (hypoxaemic).');
    if(cat==='hv')d+=' Hypoventilation or low inspired O₂ explains it; the lungs transfer normally.';
    if(cat==='lung'||cat==='lungmild')d+=' V/Q mismatch, shunt or diffusion: look at the lungs.';
    if(cat==='pf')d+=' If bilateral infiltrates are not explained by heart failure, Berlin ARDS: '+(pfD(pf)<=pfD(100)?'severe':pfD(pf)<=pfD(200)?'moderate':'mild')+(v.peep!=null?(v.peep>=5?' (PEEP '+v.peep+' meets the Berlin rule of PEEP or CPAP ≥ 5).':' (but Berlin needs PEEP or CPAP ≥ 5; PEEP here is '+v.peep+').'):' (Berlin needs PEEP or CPAP ≥ 5; the 2023 global definition also accepts high-flow nasal oxygen ≥ 30 L/min).');
    if(v.po2>150&&f>0.3&&!coRaised)d+=metRaised?' Hyperoxaemia: titrate oxygen to the PaO₂, not the SpO₂.':' Hyperoxaemia: titrate oxygen down to target.';
    if(implaus){vv='PaO₂ higher than possible at this FiO₂';tone='bad';flags.push('ox-implausible');d+=' A PaO₂ above the alveolar PO₂ cannot happen. Check the FiO₂ (is the patient on oxygen?'+(fset?'':' FiO₂ was not entered.')+'), an air bubble in the syringe, and the sample type.';}
    out.ox={cat,pf,Aa,PA,implaus,fio2Assumed:!fset};
    if(v.spo2!=null&&v.cohb==null&&v.methb==null&&v.po2>=70&&v.spo2<=88)coL.push('SpO₂ '+v.spo2+'% with PaO₂ '+P(v.po2)+' '+U+': saturation gap, request co-oximetry.');
    if(coHiT&&!implaus)vv=hyp?vv+'; O₂ content also reduced ('+coHiT+')':'PaO₂ adequate, but O₂ content reduced ('+coHiT+')';
    if(coL.length){d+=' '+coL.join(' ');tone=coHiT||tone==='bad'?'bad':'warn';}
    if(!fset&&tone==='ok')tone='warn';
    st.push({k:'ox',t:'Oxygen',tone,v:vv,d});
  }else{let vv=cord?'Not assessed on cord blood':ven?'Not assessed on a venous sample':'No PaO₂ entered',tone='info';
    let d=cord?'Fetal PO₂ is normally low (cord artery ≈ '+P(15)+'–'+P(25)+' '+U+'); adult A–a and oxygen ranges do not apply.':ven?'Venous PO₂ says nothing about the lungs. Use SpO₂, or an ABG if oxygenation matters.':'Add PaO₂ and FiO₂ to get the P/F ratio and A–a gradient.';
    if(!cord&&v.spo2!=null&&v.fio2!=null&&v.fio2>0.22&&v.spo2<=97){const sf=Math.round(v.spo2/v.fio2);d+=' SpO₂/FiO₂ = '+v.spo2+' ÷ '+v.fio2.toFixed(2)+' = '+sf+(sf<=315?': at or below 315, roughly a P/F of 300 or less (accepted for ARDS by the 2023 global definition).':': above 315.');}
    if(coL.length){d+=' '+coL.join(' ');tone=coHiT?'bad':'warn';if(coHiT)vv='O₂ content reduced ('+coHiT+')'+(ven?'; lungs not assessed on a venous sample':cord?'':'; no PaO₂ entered');}
    st.push({k:'ox',t:'Oxygen',tone,v:vv,d});}
  out.label=buildLabel(r,4);
  /* causes */
  const metChecks=()=>{const c=[];if(v.glu!=null&&v.glu>11)c.push('Glucose '+v.glu+': DKA likely; check blood ketones');if(v.bhb!=null&&v.bhb>=3)c.push('BHB '+v.bhb+': ketoacidosis');if(v.lac!=null&&v.lac>4)c.push('Lactate '+v.lac+': lactic acidosis; find the cause (shock, sepsis, ischaemia, drugs)');if(v.urea!=null&&v.urea>25)c.push('Urea '+v.urea+': uraemia may contribute');if(og!=null&&og>10)c.push('Osmolar gap '+og+': toxic alcohol until proven otherwise');return c;};
  if(r.mac==='HAGMA'||r.mac==='HN'){const c=metChecks();if(!c.length)c.push('Work through GOLDMARK: glycols, 5-oxoproline, L- and D-lactate, methanol, aspirin, renal failure, ketones');causes.push(...c);}
  else if(r.mac==='?'){causes.push(...metChecks(),'Add Na⁺ and Cl⁻ to split high-gap from normal-gap causes.');}
  else if(og!=null&&og>10)causes.push('Osmolar gap '+og+': toxic alcohol until proven otherwise, even without an acidosis yet (early ingestion, or ethanol co-ingestion).');
  if(v.cohb!=null&&v.cohb>10)causes.push('COHb '+v.cohb+'%: carbon monoxide poisoning (fire, faulty heater, engine exhaust). 100% oxygen; if smoke exposure, think cyanide too.');
  if(coRaised&&v.lac!=null&&v.lac>8)causes.push('Raised COHb with lactate '+v.lac+' (above 8): in smoke inhalation consider cyanide poisoning and give hydroxocobalamin 5 g IV.');
  if(v.methb!=null&&v.methb>10)causes.push('MetHb '+v.methb+'%: oxidising drugs (dapsone, benzocaine or prilocaine, nitrites, nitrates) or a congenital cause.');
  if(r.mac==='NAGMA'||r.mac==='HN'){causes.push('Normal gap: HARDASS (diarrhoea, saline, RTA, acetazolamide, Addison\'s, spironolactone, TPN)'+(v.k!=null?(v.k>5?'; K⁺ high → type 4 RTA or hypoaldosteronism':v.k<3.5?'; K⁺ low → diarrhoea or type 1/2 RTA':''):'')+'. Urine anion gap separates gut from kidney.');}
  if(r.malk)causes.push('Metabolic alkalosis: urine Cl⁻ < 20 → vomiting, NG loss, prior diuretics; > 20 → current diuretics, mineralocorticoid excess, Bartter/Gitelman.');
  if(r.rac)causes.push('Respiratory acidosis: drive (opioids, sedatives), pump (neuromuscular, fatigue), airways/lungs (COPD, asthma), chest wall.');
  if(r.rac&&(v.peep!=null||v.ctx==='vent'))causes.push('On a ventilator: deliberate low tidal volume ventilation (permissive hypercapnia on lung-protective settings) is a common cause. Check the settings before blaming the patient.');
  if(r.ralk)causes.push('Respiratory alkalosis: hypoxaemia, PE, sepsis, salicylate, pain/anxiety, pregnancy, liver failure. Check the A–a gradient before blaming anxiety.');
  out.unsure=uncertain(v,out,agref).concat(notes);
  /* summary line */
  const be=beFrom(pH,h);out.be=be;
  out.line=summaryLine(v,out);
  return out;
}
function summaryLine(v,o){
  const U=PU(),ven=v.sample==='v',cord=v.ctx==='cord';
  const fTxt=o.ox?(v.fio2!=null?'FiO₂ '+v.fio2.toFixed(2):'FiO₂ 0.21 assumed')+(v.peep!=null?', PEEP '+v.peep:''):'';
  const parts=[(cord?'Cord artery gas':ven?'VBG':'ABG')+(fTxt?' ('+fTxt+')':'')+': pH '+e1pH(v.pH),'PCO₂ '+P(v.pco2)+' '+U];
  if(!ven&&v.po2!=null)parts.push('PO₂ '+P(v.po2)+' '+U);
  parts.push('HCO₃⁻ '+r1(v.hco3!=null?v.hco3:hFrom(v.pH,v.pco2)),'BE '+sgn(r1(o.be)));
  if(v.lac!=null)parts.push('Lac '+v.lac);if(o.agc!=null)parts.push('AG '+r1(o.agc)+(v.alb!=null?' (alb-corr)':''));
  if(v.cohb!=null)parts.push('COHb '+v.cohb+'%');if(v.methb!=null)parts.push('MetHb '+v.methb+'%');
  const comp=o.steps.find(s=>s.k==='comp');
  let imp=o.label;
  const single=(!!o.r.mac+!!o.r.malk+!!o.r.rac+!!o.r.ralk)===1;
  if(single&&(o.r.mac||o.r.malk)&&comp.code==='ok')imp+=' with appropriate respiratory compensation';
  if(o.delta!=null)imp+='; Δ ratio '+o.delta.toFixed(2);
  if(cord&&o.cordPath)imp+='. Pathological acidaemia (pH < 7.0, base deficit ≥ 12)';
  if(o.ox&&!ven){const ox=o.steps.find(s=>s.k==='ox');const w=ox.v.split(' ')[0];const lc=/[A-Z]/.test(w.slice(1))?ox.v:ox.v.charAt(0).toLowerCase()+ox.v.slice(1);
    imp+='. Oxygenation: '+lc+(o.ox.cat!=='normal'&&!/P\/F/.test(ox.v)?' (P/F '+(U==='kPa'?r1(o.ox.pf/KPA)+' kPa':Math.round(o.ox.pf))+')':'');}
  else if(o.coHi)imp+='. O₂ content reduced: '+o.coHi;
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
/* variant = [cause, vignette, options, one-line mechanism (shown in cause feedback)].
   options: h/p/alb/k/glu/lac/urea [lo,hi] ranges for this cause; o = oxygen pattern ('n' normal, 'hv' hypoventilation, 'lung' raised A–a, 'pf' on O₂);
   pmin = lowest realistic room-air PaO₂ at sea level; o2 = text added when the generator must put the patient on controlled O₂ to stay plausible;
   fio2/po2 = choices for 'pf'; vsea = vignette used when Settings are not at a high altitude; les = lesson for 'learn more'. */
const KINDS={
 hagma:{lbl:'HAGMA',lv:1,v:[['dka','19-year-old with type 1 diabetes who stopped his insulin: abdominal pain and deep sighing breaths',{glu:[20,34],lac:[1,2.5],h:[5,15],o:'n',les:'dka'},'Insulin lack: fat breaks down to ketoacids (β-hydroxybutyrate, acetoacetate), the unmeasured anions that raise the gap.'],['sglt','58-year-old on empagliflozin, 3 days of poor intake, glucose only mildly raised',{glu:[8,13],lac:[1,2],h:[8,16],o:'n',les:'dka'},'SGLT2 inhibitors pour glucose into the urine, so ketoacidosis builds with a near-normal glucose when insulin runs short.'],['lacsep','71-year-old with urosepsis, MAP 58 on noradrenaline',{lac:'gap',h:[8,17],alb:[22,30],o:'pf',les:'sepsis'},'Poor perfusion and adrenaline-driven glycolysis make L-lactate faster than the liver clears it.'],['lacisch','76-year-old with AF and severe abdominal pain out of proportion to signs',{lac:'gap',h:[9,18],alb:[32,40],o:'n'},'Ischaemic gut makes lactate faster than the liver clears it; pain out of proportion to the signs is the clue.'],['meth','Three men from the same gathering with blurred vision after drinking homemade alcohol',{lac:[1,2],osm:true,h:[5,15],o:'n',les:'toxalc2'},'Alcohol dehydrogenase turns methanol into formic acid: a high gap, an osmolar gap early, and optic nerve injury.'],['eg','Confused man found with an empty antifreeze bottle; AKI and crystals in urine',{lac:[2,4],osm:true,urea:[12,25],h:[5,15],o:'n',les:'toxalc2'},'Ethylene glycol is metabolised to glycolate and oxalate: a high gap, an osmolar gap, calcium oxalate crystals and AKI.'],['metf','68-year-old on metformin with vomiting and AKI',{lac:'gap',urea:[25,40],h:[5,15],alb:[32,38],o:'n',les:'drugacid'},'Metformin blocks the liver\'s use of lactate; AKI lets the drug build up, so lactate accumulates.'],['aka','42-year-old after a 5-day drinking binge, not eating; glucose normal',{glu:[4,7],lac:[1.5,3],h:[10,18],o:'n',les:'etoh'},'Starvation plus ethanol make ketoacids, mostly β-hydroxybutyrate, with a normal or low glucose.'],['seiz','31-year-old 20 minutes after a prolonged generalised seizure',{lac:'gap',h:[10,18],o:'n'},'Intense muscle activity makes lactate; it clears within an hour or two once the seizure stops.'],['rhabdo','26-year-old labourer collapsed after a 12-hour shift in the sun; tea-coloured urine, CK 52,000',{lac:[2.5,4],k:[5.4,6.3],h:[12,18],o:'n',les:'rhabdo'},'Broken-down muscle releases potassium, phosphate and organic acids, and myoglobin injures the kidney.'],['pris','ICU patient on high-dose propofol for 4 days; new arrhythmia and dark urine',{lac:'gap',k:[5.2,6],h:[10,17],alb:[22,30],o:'pf',les:'drugacid'},'Propofol blocks mitochondrial fatty-acid use: lactic acidosis, rhabdomyolysis, high K⁺ and arrhythmia.'],['uraem','67-year-old on haemodialysis who has missed two sessions, nauseated and itchy',{lac:[0.8,1.8],urea:[30,50],k:[5.6,6.5],h:[12,18],alb:[30,36],o:'n',les:'renalfail'},'Failing kidneys cannot excrete sulphate, phosphate and urate or make new bicarbonate; the gap rises once GFR is very low.']]},
 nagma:{lbl:'NAGMA',lv:1,v:[['diar','27-year-old with 5 days of profuse watery diarrhoea',{k:[2.6,3.3],h:[10,18],o:'n',les:'diarr'},'Stool is rich in bicarbonate; losing it while the kidney holds chloride gives a normal gap and a low K⁺.'],['saline','Post-op day 1 after 7 L of 0.9% saline',{k:[3.6,4.4],h:[16,21],alb:[30,38],o:'n'},'0.9% saline carries 154 mmol/L of chloride and no bicarbonate: chloride rises and bicarbonate is diluted.'],['rta4','63-year-old with diabetic nephropathy on ramipril; K⁺ high',{k:[5.6,6.4],h:[16,21],o:'n',les:'rta'},'Too little aldosterone effect: less K⁺ and H⁺ secretion, and the high K⁺ also cuts ammonium production.'],['rta1','34-year-old with Sjögren\'s and recurrent kidney stones; urine pH 6.5',{k:[2.7,3.2],h:[10,18],o:'n',les:'rta'},'The distal tubule cannot secrete H⁺, so urine pH stays above 5.5; K⁺ is low and calcium stones form.'],['acz','66-year-old taking acetazolamide for glaucoma, tired with tingling fingers',{k:[3.3,3.9],h:[16,21],o:'n'},'Carbonic anhydrase inhibition stops proximal bicarbonate reabsorption, so bicarbonate is lost in the urine.'],['ileo','57-year-old with a new ileostomy draining 3 L a day',{k:[2.8,3.4],h:[12,18],o:'n',les:'diarr'},'Ileal fluid is alkaline; large losses remove bicarbonate, sodium and potassium.'],['tolu','19-year-old with paint on his hands, profound weakness and a very low K⁺',{k:[2.1,2.6],h:[10,17],o:'n',les:'drugacid'},'Toluene becomes hippuric acid; hippurate is excreted quickly with Na⁺ and K⁺, so the gap stays near normal and K⁺ falls.'],['topi','33-year-old on topiramate for migraine, routine pre-op bloods',{k:[3.5,4.2],h:[17,21],o:'n',les:'drugacid'},'Topiramate inhibits carbonic anhydrase: a mild, proximal-RTA-like bicarbonate loss.']]},
 malk:{lbl:'MALK',lv:1,v:[['vom','45-year-old with gastric outlet obstruction, vomiting for a week',{k:[2.5,3.2],h:[31,42],o:'n',les:'vomit'},'Vomiting removes HCl; volume and chloride depletion then make the kidney keep bicarbonate (urine Cl⁻ low).'],['diur','80-year-old with heart failure on high-dose furosemide',{k:[2.8,3.4],h:[29,36],alb:[32,38],o:'n'},'Volume contraction, aldosterone and high distal sodium delivery drive H⁺ and K⁺ into the urine (urine Cl⁻ high while on the drug).'],['conn','39-year-old with resistant hypertension and a low K⁺',{k:[2.6,3.1],h:[28,34],o:'n'},'Aldosterone excess drives distal Na⁺ reabsorption in exchange for H⁺ and K⁺: hypertension, low K⁺, urine Cl⁻ high.'],['ngsuc','64-year-old on day 4 after bowel surgery with high nasogastric aspirates',{k:[2.9,3.4],h:[29,36],alb:[28,35],o:'n',les:'vomit'},'Nasogastric suction removes gastric HCl, just like vomiting; it is chloride-responsive.'],['mtx','Trauma patient after 18 units of blood products',{k:[3.4,4.6],h:[28,34],alb:[20,28],o:'pf',les:'gib'},'Citrate in stored blood is metabolised by the liver to bicarbonate.']]},
 rac_a:{lbl:'RACa',lv:1,v:[['opi','24-year-old found unresponsive with pinpoint pupils',{o:'hv',les:'opioid'},'Opioids blunt the brainstem response to CO₂: slow, shallow breathing with normal lungs.'],['gbs','37-year-old with ascending weakness, weak cough and vital capacity falling',{p:[50,70],o:'hv'},'The breathing muscles fail (the pump), so CO₂ rises; a falling vital capacity warns first.'],['mg','45-year-old with myasthenia gravis, ptosis and a weak voice after a chest infection',{p:[50,70],o:'hv'},'Fatiguable weakness of the breathing and bulbar muscles; an infection can trigger a crisis.'],['asthx','19-year-old with severe asthma for 6 hours, now drowsy and quiet chest',{p:[50,75],o:'pf',les:'asthma'},'Severe obstruction and exhaustion: a normal or rising PCO₂ in acute asthma is a life-threatening sign.']]},
 rac_c:{lbl:'RACc',lv:1,v:[['copd','69-year-old with severe COPD at a routine clinic visit, usual self',{p:[48,60],pmin:50,o:'lung',o2:' (on long-term oxygen)',les:'copd'},'Years of airflow limitation and V/Q mismatch raise PCO₂ slowly, and the kidney keeps bicarbonate over days.'],['ohs','52-year-old, BMI 51, daytime sleepiness, ankle oedema',{p:[48,62],o:'hv',les:'sp-ohs'},'Obesity loads the chest wall and the drive to breathe is blunted, so the daytime PCO₂ stays above 45.']]},
 rac_ac:{lbl:'RACac',lv:2,v:[['copdx','72-year-old known CO₂ retainer, 3 days of increased sputum and breathlessness',{o:'pf',fio2:[0.24,0.28,0.35],po2:[52,75],les:'copd'},'An exacerbation adds an acute CO₂ rise on top of chronic renal compensation; too much oxygen can raise it further.']]},
 ralk_a:{lbl:'RALKa',lv:1,v:[['panic','22-year-old with sudden fear, tingling fingers and carpopedal spasm; examination normal',{o:'n'},'Anxiety drives overbreathing; alkalaemia lowers ionised calcium, causing tingling and carpopedal spasm.'],['pe','54-year-old 10 days after knee replacement, sudden pleuritic chest pain',{o:'lung',les:'pe'},'Hypoxaemia and stimulated lung receptors drive ventilation; dead space and shunt raise the A–a gradient.'],['pneu','61-year-old with fever, cough and right basal crackles',{alb:[32,38],o:'lung'},'Hypoxaemia, fever and stiff lungs drive ventilation; the consolidated lung raises the A–a gradient.']]},
 ralk_c:{lbl:'RALKc',lv:1,v:[['preg','30-year-old at 34 weeks\' gestation, routine assessment',{p:[26,29.4],alb:[29,35],o:'n',les:'preg'},'Progesterone stimulates the respiratory centre; a PCO₂ near 30 with renal compensation is normal in late pregnancy.'],['alt','Healthy lifelong resident at this altitude, pre-operative gas',{p:[25,29.4],o:'n',vsea:'Healthy lifelong resident of a city at 3,600 m, flown down yesterday for surgery; pre-operative gas',les:'sp-alt'},'Low inspired O₂ drives ventilation through the carotid bodies; over days the kidney excretes bicarbonate to match.'],['cirr','58-year-old with cirrhosis and ascites, stable',{alb:[22,30],o:'n'},'Liver disease stimulates breathing (raised progesterone and oestrogen, ammonia), and the kidney has had time to compensate.'],['hepen','49-year-old with cirrhosis, confused for 3 days, asterixis',{alb:[20,28],o:'n'},'Ammonia and other toxins stimulate the respiratory centre; overbreathing is common in encephalopathy.'],['etohw','44-year-old, 4 days into a difficult alcohol withdrawal: tremor, sweating, RR 26',{o:'n',les:'etoh'},'Withdrawal brings days of sympathetic overactivity and overbreathing; by now the kidney has compensated.']]},
 hag_rac:{lbl:'HAGMA+RAC',lv:2,v:[['arrest','63-year-old, 12 minutes into a cardiac arrest, bag-valve ventilation',{lac:'gap',o:'pf',les:'arrest'},'No perfusion makes lactate, and poor ventilation and pulmonary flow let CO₂ build up.'],['apo','70-year-old with acute pulmonary oedema, cold and clammy, BP 78/50',{lac:'gap',alb:[30,38],o:'pf'},'Cardiogenic shock makes lactate; flooded alveoli and tiring muscles stop the lungs clearing CO₂.'],['sepsisfat','66-year-old with septic shock, breathing slowing and drowsy',{lac:'gap',alb:[22,30],o:'pf',les:'sepsis'},'Shock makes lactate, then the breathing muscles tire, so PCO₂ rises above the Winter\'s prediction.']]},
 hag_ralk:{lbl:'HAGMA+RALK',lv:2,v:[['asa','29-year-old with tinnitus and sweating 4 hours after an overdose of an unknown painkiller',{lac:[1.5,3],o:'n',les:'asa'},'Salicylate stimulates the respiratory centre directly and uncouples oxidative phosphorylation, adding lactate and ketoacids.'],['sepearly','74-year-old with fever, rigors and confusion; RR 32',{lac:'gap',alb:[28,36],o:'lung',les:'sepsis'},'Inflammatory mediators drive ventilation early, while poor perfusion raises lactate.'],['liverf','33-year-old with paracetamol-induced acute liver failure, encephalopathic',{lac:'gap',alb:[26,34],o:'n'},'The failing liver cannot clear lactate, and the toxins it no longer removes drive overbreathing.']]},
 hag_malk:{lbl:'HAGMA+MALK',lv:3,v:[['dkavom','23-year-old with type 1 diabetes vomiting for 4 days',{glu:[20,32],lac:[1,2.5],o:'n',les:'dka'},'Ketoacids lower bicarbonate while vomiting removes acid and raises it, so HCO₃⁻ can look near normal; the gap gives it away.'],['akavom','47-year-old after a week of heavy drinking and repeated vomiting',{glu:[3.5,6],lac:[2,3.5],o:'n',les:'etoh'},'Alcoholic ketoacidosis, with a vomiting alkalosis that hides it.']]},
 hag_nag:{lbl:'HAGMA+NAGMA',lv:3,v:[['diaraki','80-year-old with 6 days of diarrhoea, dry, creatinine tripled',{lac:[2.5,4],urea:[25,38],k:[2.8,3.4],alb:[30,36],o:'n',les:'diarr'},'Diarrhoea loses bicarbonate (normal gap) while AKI and poor perfusion add retained acids and lactate (high gap).'],['dkad2','DKA patient on day 2 after 6 L of 0.9% saline; ketones falling',{glu:[10,14],lac:[1,2],o:'n',les:'dka'},'Ketones are cleared while chloride-rich saline replaces them: the gap closes but a normal-gap acidosis remains.']]},
 hag_malk_ralk:{lbl:'HAGMA+MALK+RALK',lv:3,v:[['dkapneu','26-year-old with type 1 diabetes, vomiting for 3 days, fever and right lower lobe crackles',{glu:[18,30],lac:[1.5,3],alb:[33,40],o:'lung',les:'mixed'},'Three processes at once: ketoacidosis, a vomiting alkalosis, and pneumonia driving ventilation.'],['asavom','35-year-old with tinnitus after an overdose, vomiting all night',{lac:[1.5,3],o:'n',les:'asa'},'Salicylate gives a high-gap acidosis and drives breathing; repeated vomiting adds a metabolic alkalosis.']]},
 rac_malk:{lbl:'RAC+MALK',lv:2,v:[['copddiur','74-year-old with COPD and heart failure on furosemide and prednisolone',{k:[2.9,3.4],p:[50,62],pmin:45,alb:[30,36],o:'lung',o2:' (on 2 L/min oxygen)',les:'copd'},'Chronic CO₂ retention, with diuretics and steroids adding a metabolic alkalosis on top of the renal compensation.']]},
 ralk_malk:{lbl:'RALK+MALK',lv:2,v:[['pregvom','26-year-old at 10 weeks with hyperemesis gravidarum',{k:[2.8,3.3],o:'n',les:'sp-pregem'},'Pregnancy lowers PCO₂ through progesterone, and vomiting adds a metabolic alkalosis, so the two alkaloses add up.'],['cirrdiur','61-year-old with cirrhosis on spironolactone and furosemide, vomiting',{k:[2.9,3.4],alb:[20,28],o:'n'},'Liver disease drives ventilation; the loop diuretic and vomiting add a metabolic alkalosis.']]}
};
const TARGET={HAGMA:{mac:'HAGMA'},NAGMA:{mac:'NAGMA'},MALK:{malk:1},RACa:{rac:1,rq:'a'},RACc:{rac:1,rq:'c'},RACac:{rac:1,rq:'ac'},RALKa:{ralk:1,rq:'a'},RALKc:{ralk:1,rq:'c'},'HAGMA+RAC':{mac:'HAGMA',rac:1},'HAGMA+RALK':{mac:'HAGMA',ralk:1},'HAGMA+MALK':{mac:'HAGMA',malk:1},'HAGMA+NAGMA':{mac:'HN'},'RAC+MALK':{rac:1,malk:1},'HAGMA+MALK+RALK':{mac:'HAGMA',malk:1,ralk:1},'RALK+MALK':{ralk:1,malk:1}};
function targetLabel(kind,level){const t=TARGET[KINDS[kind].lbl];return buildLabel({mac:t.mac||null,malk:!!t.malk,rac:!!t.rac,ralk:!!t.ralk,rq:t.rq||null},level);}
function kindsFor(level){return Object.keys(KINDS).filter(k=>{const kv=KINDS[k];if(level===1)return kv.lv===1;if(level===2)return kv.lv<=2;return true;});}

function rawCase(kind,level){
  const K=KINDS[kind];const vg=pick(K.v);const o=vg[2]||{};
  /* the gap is built against the reference interp() will use: the Settings AG reference, +4 when K⁺ is counted */
  const patm=S.patm||760,usek=!!S.usek,RK=(S.agref||12)+(usek?4:0);
  const rr=(a,lo,hi)=>a?rnd(a[0],a[1]):rnd(lo,hi);
  let h,p,rise=null,k=r1(rnd(3.6,4.6)),na=Math.round(rnd(134,142)),alb=Math.round(rr(o.alb,36,44));
  const W=x=>1.5*x+8;
  switch(kind){
   case 'hagma':h=rr(o.h,5,17);p=W(h)+rnd(-1.4,1.4);rise=(24-h)*rnd(0.95,1.7);break;
   case 'nagma':h=rr(o.h,10,18);p=W(h)+rnd(-1.4,1.4);break;
   case 'malk':h=rr(o.h,29,40);p=0.7*h+20+rnd(-3,3);break;
   case 'rac_a':p=rr(o.p,50,85);h=24+(p-40)/10+rnd(-0.8,0.8);break;
   case 'rac_c':p=rr(o.p,48,66);h=24+4*(p-40)/10+rnd(-1.2,1.2);break;
   case 'rac_ac':p=rr(o.p,68,95);{const a=24+(p-40)/10,c=24+4*(p-40)/10;h=a+(c-a)*rnd(0.4,0.6);}break;
   case 'ralk_a':p=rr(o.p,22,31);h=24-2*(40-p)/10+rnd(-0.8,0.8);break;
   /* chronic respiratory alkalosis sits at pH 7.40–7.47; aim away from 7.40 (primary cannot be told) and from 7.45 (the cut-off) */
   case 'ralk_c':{p=rr(o.p,25,29.4);const c=24-5*(40-p)/10,a=24-2*(40-p)/10,ok=x=>Math.abs(x-c)<=1.6&&x<=a-2.4;
     h=hFrom(pick([7.43,7.44,7.46,7.47])+rnd(-0.003,0.003),p);if(!ok(h))h=hFrom(7.43+rnd(-0.003,0.003),p);if(!ok(h))h=c+rnd(-0.8,0.5);}break;
   case 'hag_rac':h=rr(o.h,9,17);p=W(h)+rnd(7,22);rise=(24-h)*rnd(1,1.6);break;
   /* below level 3 the slip has no Na⁺ or Cl⁻: the HCO₃⁻ must sit below the chronic band to read as an added acidosis without the gap */
   case 'hag_ralk':h=level<3?rnd(7,12):rnd(11,19);p=W(h)-rnd(5.5,9);rise=(24-h)*rnd(1,1.7);break;
   /* half are the classic normal-looking gas (pH 7.37–7.43, PCO₂ and HCO₃⁻ in range, only the gap gives it away); half a mild acidaemia */
   case 'hag_malk':if(Math.random()<0.5){for(let j=0;j<20;j++){h=rnd(22.7,25.3);p=h/(0.03*Math.pow(10,rnd(7.37,7.43)-6.1));if(p>36.7&&p<43.3)break;}rise=rnd(8,16);}
     else{h=rnd(17,20.5);p=W(h)+rnd(-0.5,0.5);rise=Math.max(6,(24-h)*rnd(2.4,3.2));}break;
   case 'hag_nag':h=rnd(8,15);rise=(24-h)*rnd(0.45,0.7);p=W(h)+rnd(-1.4,1.4);break;
   case 'hag_malk_ralk':h=rnd(15,21);rise=(24-h)*rnd(2.5,3.3);p=W(h)-rnd(5,9);break;
   case 'rac_malk':p=rr(o.p,50,64);h=24+4*(p-40)/10+rnd(3.3,8);break;
   /* hyperemesis and cirrhosis on diuretics: usually pH 7.48–7.60, not a severe alkalaemia */
   case 'ralk_malk':p=rnd(30.5,34.3);h=rnd(26.7,30);break;
  }
  if(o.k)k=r1(rnd(o.k[0],o.k[1]));
  h=r1(h);p=Math.round(Math.max(12,p));
  const pH=r2(phFrom(h,p));
  const alc=0.25*(40-alb);
  const G=RK+(rise!=null?rise:rnd(-3.5,-0.6));
  const cl=Math.round(na+(usek?k:0)-h+alc-G);
  const age=parseInt((vg[1].match(/(\d+)-year/)||[0,45])[1],10)||45;
  const c={pH,pco2:p,hco3:h,na,cl,k,alb,age,kind,cause:vg[0],vig:patm>=700&&o.vsea?o.vsea:vg[1]};
  if(o.les)c.les=o.les;
  const rz=na-(cl+h)+(usek?k:0)+alc-RK;
  if(o.lac==='gap')c.lac=r1(Math.max(2.2,rz*rnd(0.75,0.95)));else if(o.lac)c.lac=r1(rnd(o.lac[0],o.lac[1]));else c.lac=r1(rnd(0.7,1.6));
  if(o.glu)c.glu=r1(rnd(o.glu[0],o.glu[1]));else c.glu=r1(rnd(4.5,7.5));
  c.urea=o.urea?r1(rnd(o.urea[0],o.urea[1])):r1(rnd(3,7));
  if(o.osm){c.osm=Math.round(2*na+c.glu+c.urea+rnd(18,40));}
  return e1genOx(c,o,patm)?c:null;
}
/* oxygen: PaO₂ is built from the alveolar PO₂ at the Settings altitude and the age-expected A–a gradient, never from a fixed number.
   Sets c.po2, c.fio2 and c.ox (the OXLAB key interp() must return). Returns false if the story cannot be plausible here. */
function e1genOx(c,o,patm){
  const age=c.age,exAa=age/4+4,lim=exAa+5,sc=(patm-47)/713;
  const hypT=(age>60?Math.min(80,100-age/3):80)*sc;
  const PAf=f=>f*(patm-47)-c.pco2/0.8,PA=PAf(0.21);
  const inr=(lo,hi,pref)=>lo>hi?null:Math.round(pref==null?rnd(lo,hi):Math.min(hi,Math.max(lo,pref)));
  const onO2=(fs,rg)=>{for(const f of shuffle(fs)){const pa=PAf(f),lo=rg?rg[0]:50,hi=Math.min(rg?rg[1]:999,f*290,pa-8,0.85*pa);
      const x=inr(lo,hi,rg?null:f*rnd(100,260));if(x!=null){c.fio2=f;c.po2=x;c.ox='pf';return true;}}return false;};
  let want=o.o||'n',po2=null;
  if(want==='pf')return onO2(o.fio2||[0.4,0.5,0.6,0.8,1.0],o.po2);
  /* a well patient whose PCO₂ is high at altitude becomes 'hypoxaemia, normal A–a' (true at that pressure), but never below 45 */
  let hvFloor=35;
  if(want==='n'){po2=inr(Math.max(hypT+2,PA-lim+2),PA-2,PA-exAa*rnd(0.2,0.9));if(po2!=null)c.ox='normal';else{want='hv';hvFloor=45;}}
  if(want==='hv'){po2=inr(Math.max(hvFloor,PA-lim+2),Math.min(hypT-2,PA-2),PA-rnd(2,exAa));
    if(po2!=null)c.ox='hv';else{po2=inr(Math.max(hypT+2,PA-lim+2),PA-2);if(po2==null)return false;c.ox='normal';}}
  if(want==='lung'){const floor=(o.pmin||42)*Math.max(0.9,sc);po2=inr(Math.max(floor,PA-lim-40),Math.min(hypT-2,PA-lim-3));
    if(po2!=null)c.ox='lung';
    else if(o.o2){if(!onO2([0.24,0.28],[58,70]))return false;c.vig+=o.o2;return true;}
    else return false;}
  c.fio2=0.21;c.po2=po2;return true;}
function e1agRef(c){return (S.agref||12)+(S.usek&&c.k!=null?4:0);}
/* a normal pH with both values moved the same way and pH within 0.02 of 7.40, or a borderline tilt: the primary process cannot be told */
function e1amb(o){const e=o.est,sys=(o.steps.find(s=>s.k==='sys')||{}).v||'';
  return (Math.abs(e.pH-7.4)<=0.02&&((e.pco2>45&&e.hco3>26)||(e.pco2<35&&e.hco3<22)))||/\(borderline\)$/.test(sys);}
function genCase(kind,level,gopt){level=level||4;gopt=gopt||{};const want=targetLabel(kind,level),soft=!gopt.strict;
  for(let i=0;i<150;i++){const c=rawCase(kind,level);
    if(!c||c.cl<70||c.cl>130||c.na-(c.cl+c.hco3)<0)continue;
    /* read with the user's Settings (AG reference, K⁺ in the gap, altitude), exactly as every later re-read will */
    const o=interp(c);if(o.err||o.flags.includes('inconsistent'))continue;
    if(buildLabel(o.r,level)!==want)continue;
    if(level>=4&&o.ox&&o.ox.cat!==c.ox)continue;
    const R=e1agRef(c);
    if(!clearCut(o,R,soft)||e1amb(o))continue;
    /* below level 3 the slip shows only pH, PCO₂ and HCO₃⁻: the read must come out the same without the electrolytes */
    if(level<3){const ob=interp({pH:c.pH,pco2:c.pco2,hco3:c.hco3,po2:c.po2,fio2:c.fio2,age:c.age});
      if(ob.err||buildLabel(ob.r,level)!==want||ob.primKey!==o.primKey||ob.compKey!==o.compKey||!clearCut(ob,R,soft)||e1amb(ob))continue;}
    c.o=o;c.label=want;
    if(gopt.ven){const v=toVenous(c);const ov=interp(v);if(ov.err||buildLabel(ov.r,level)!==want||ov.primKey!==o.primKey||ov.compKey!==o.compKey||!!ov.agHigh!==!!o.agHigh||phState(ov.est.pH)!==phState(v.pH)||!clearCut(ov,R,soft)||e1amb(ov))continue;v.o=ov;v.label=want;return v;}
    return c;}
  return null;}
const phState=x=>x<7.35?'acid':x>7.45?'alk':'normal';
/* reject gases that sit on a decision boundary, so every step has one defensible answer.
   strict (Gas of the day, Fit, Rounds, steps): wide margins. soft (every other case): only values on or next to a cut-off. */
function clearCut(o,R,soft){const e=o.est;R=R!=null?R:(S.agref||12);
  const m=soft?{ph:0.005,pc:[35,45],hc:0.15,cb:1,hb:0.3,ag:3,d:0.05}:{ph:0.015,pc:[34,35,36,44,45,46],hc:0.6,cb:1.5,hb:1,ag:4,d:0.15};
  if(Math.abs(e.pH-7.35)<m.ph||Math.abs(e.pH-7.45)<m.ph)return false;
  if(m.pc.some(x=>Math.abs(e.pco2-x)<0.6))return false;
  if([22,26].some(x=>Math.abs(e.hco3-x)<m.hc))return false;
  if(o.cband){const [lo,hi,pc]=o.cband;if(Math.min(Math.abs(pc-lo),Math.abs(pc-hi))<m.cb)return false;}
  if(o.hband){const [a,c,h]=o.hband;if([a-2,a+2,c-2,c+2].some(x=>Math.abs(h-x)<m.hb))return false;}
  if(o.agc!=null&&o.agc>R&&o.agc<R+m.ag)return false;
  if(o.delta!=null&&[0.4,0.8,2].some(x=>Math.abs(o.delta-x)<m.d))return false;
  return true;}
function toVenous(c){const v=Object.assign({},c);delete v.o;v.sample='v';v.pco2=Math.round(c.pco2+rnd(4,6));v.hco3=r1(c.hco3+1);v.pH=r2(phFrom(v.hco3,v.pco2));v.po2=Math.round(rnd(26,44));v.art=c;return v;}

const OXLAB={normal:'Normal / adequate oxygenation',hv:'Hypoxaemia, normal A–a (hypoventilation)',lung:'Hypoxaemia, raised A–a (lung problem)',pf:'Impaired oxygenation on O₂ (P/F < 300)'};
function labelPool(level){const s=new Set();kindsFor(level).forEach(k=>s.add(targetLabel(k,level)));return [...s];}
/* similar-label distractors for interleaving */
function distract(label,level,n){const pool=labelPool(level).filter(x=>x!==label);
  const score=x=>{let s=0;const a=label.toLowerCase(),b=x.toLowerCase();['acidosis','alkalosis','respiratory','metabolic','hagma','nagma','acute','chronic'].forEach(w=>{if(a.includes(w)&&b.includes(w))s++;});return s+Math.random()*1.5;};
  return pool.sort((a,b)=>score(b)-score(a)).slice(0,n);}


/* ---- input limits and uncertainty ---- */
const LIMITS={pH:[6.5,8.0],pco2:[5,200],hco3:[1,70],po2:[10,700],fio2:[0.21,1],na:[100,190],k:[1,10],cl:[60,150],alb:[5,60],lac:[0,40],glu:[0.5,120],urea:[0.5,100],osm:[200,450],age:[0,120],spo2:[30,100],cohb:[0,80],methb:[0,90],bhb:[0,20],peep:[0,30]};
function validate(v){const names={pH:'pH',pco2:'PCO₂',hco3:'HCO₃⁻',po2:'PO₂',fio2:'FiO₂',na:'Na⁺',k:'K⁺',cl:'Cl⁻',alb:'Albumin',lac:'Lactate',glu:'Glucose',urea:'Urea',osm:'Osmolality',age:'Age',spo2:'SpO₂',cohb:'COHb',methb:'MetHb',bhb:'β-hydroxybutyrate',peep:'PEEP'};
  for(const k in LIMITS){const x=v[k];if(x==null)continue;if(typeof x!=='number'||!isFinite(x))return names[k]+' is not a number.';const [a,b]=LIMITS[k];
    if(x<a||x>b){const pr=k==='pco2'||k==='po2';const kp=pr&&S.units==='kPa';
      const sx=pr?P(x)+' '+PU():k==='pH'?String(r2(x)):String(r2(x));const rng=kp?(a/KPA).toFixed(1)+'–'+(b/KPA).toFixed(1)+' kPa':a+'–'+b+(pr?' mmHg':'');
      return names[k]+' '+sx+' is outside the possible range ('+rng+'). Check the units and the decimal point.';}}
  return null;}
function toMm(x,unit){return unit==='kPa'?x*KPA:x;}
function uncertain(v,o,agref){const u=[];
  if(o.cband){const [lo,hi,pc]=o.cband;const m=Math.min(Math.abs(pc-lo),Math.abs(pc-hi));if(m<1.5)u.push('Compensation '+(m<0.05?'sits exactly on the edge':'is within '+(S.units==='kPa'?(m/KPA).toFixed(2)+' kPa':m.toFixed(1)+' mmHg')+' of the edge')+' of the expected band. The ± limits are statistical (95% bands from patient series), so a second respiratory process is possible but not proven. Trend the gas and look at the patient.');}
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
