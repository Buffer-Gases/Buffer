/* ================= 4.3: next steps, save and share, gas log with trends, weekly review, teaching-only banner ================= */
const TEACH_ONLY='Teaching tool. Check every number and every decision against local guidelines and senior advice. It does not replace clinical judgement.';
const NEXT={
 hagma:{t:'High anion gap metabolic acidosis',
  dx:['Lactate: shock, sepsis, ischaemia, seizures, metformin','Ketones: DKA, alcoholic ketoacidosis, starvation','Kidney failure with retained anions','Toxins: methanol, ethylene glycol, salicylate, paracetamol (5-oxoproline)'],
  tests:['Lactate, glucose and blood β-hydroxybutyrate','Urea, creatinine, CK','Measured osmolality for the osmolar gap','Salicylate and paracetamol levels'],
  first:['Treat the cause: perfusion and source control in sepsis, the DKA protocol for ketoacidosis','Suspected toxic alcohol: fomepizole (or ethanol) and early dialysis discussion with the poisons centre','Bicarbonate is not routine; BICAR-ICU suggests benefit mainly in severe acidaemia with AKI'],
  pit:['A low albumin hides a raised gap: correct it','Urine strips measure acetoacetate, not β-hydroxybutyrate','A normal lactate and gap do not exclude early toxic alcohol: check the osmolar gap','The Δ ratio is supportive, not diagnostic'],
  src:['kraut10','kraut07','jbds23','kraut18','jaber18','evans21']},
 nagma:{t:'Normal anion gap metabolic acidosis',
  dx:['Gut bicarbonate loss: diarrhoea, fistula, ileostomy, ureteric diversion','Renal tubular acidosis (types 1, 2 and 4)','Large-volume 0.9% saline','Acetazolamide; early chronic kidney disease'],
  tests:['Potassium (low in diarrhoea, types 1–2; high in type 4)','Urine anion gap: Na⁺ + K⁺ − Cl⁻','Urine pH','Urine osmolal gap when the urine anion gap is unreliable'],
  first:['Treat the cause and replace losses','Prefer balanced crystalloids to large volumes of saline','Replace potassium before giving alkali when it is low'],
  pit:['The urine anion gap fails when urine Na⁺ is low or with unmeasured urinary anions (ketones, hippurate)','Hyperchloraemia during DKA recovery is expected, not a new problem'],
  src:['batlle88','kraut10','semler18','berend14']},
 hn:{t:'Mixed high and normal anion gap acidosis',
  dx:['DKA with saline resuscitation or diarrhoea','Lactic acidosis with kidney injury','Toxic ingestion with GI losses'],
  tests:['Everything for HAGMA, plus potassium and urine anion gap'],
  first:['Treat the gap cause first; it is usually the dangerous one'],
  pit:['A Δ ratio near 0.8 is ambiguous; trend the gap and the chloride'],
  src:['wrenn90','berend14']},
 malk:{t:'Metabolic alkalosis',
  dx:['Chloride-responsive: vomiting, NG drainage, past diuretics, after hypercapnia corrects','Chloride-resistant: hyperaldosteronism, Cushing, current diuretics, Bartter or Gitelman, severe hypokalaemia','Alkali load (bicarbonate, citrate in transfusion) with poor kidney function'],
  tests:['Urine chloride (below 20 mmol/L suggests chloride-responsive)','Potassium and magnesium','Blood pressure; renin and aldosterone if hypertensive'],
  first:['Chloride-responsive: 0.9% saline with potassium chloride','Stop or reduce the diuretic; acetazolamide if fluid overloaded','Correct potassium and magnesium'],
  pit:['Urine sodium misleads in alkalosis (bicarbonaturia carries sodium): use urine chloride','Do not drop the PCO₂ fast in a chronic CO₂ retainer: post-hypercapnic alkalosis'],
  src:['galla00','berend14']},
 rac:{t:'Respiratory acidosis',
  dx:['Drive: opioids, sedatives, head injury, hypothermia','Pump: Guillain–Barré, myasthenia, motor neurone disease, fatigue','Airways and lungs: COPD, asthma, pneumonia, pulmonary oedema','Chest wall and obesity; uncontrolled oxygen in a CO₂ retainer'],
  tests:['Glucose, drug history and toxicology','Chest X-ray','FVC or negative inspiratory force when weakness is suspected','Repeat gas 30–60 min after any change'],
  first:['Airway and breathing first; naloxone if opioid toxicity','At risk of hypercapnia: target SpO₂ 88–92%','COPD with pH below 7.35 and PaCO₂ above {P:49} that persists despite optimal medical treatment (controlled oxygen, bronchodilators, steroids): start NIV (BTS/ICS 2016)','pH below 7.25 at the start: NIV fails more often, so start it where intubation is ready (HDU or ICU) and agree the ceiling of care','Failing NIV or falling consciousness: escalate to intubation'],
  pit:['A normal SpO₂ on oxygen hides hypoventilation','Compare HCO₃⁻ with the acute and chronic rules: acidaemia means an acute component','Near-normal PaCO₂ in severe asthma is a warning sign'],
  src:['epstein01','davidson16','odriscoll17']},
 ralk:{t:'Respiratory alkalosis',
  dx:['Hypoxaemia: pulmonary embolism, pneumonia, altitude','Early sepsis','Salicylate toxicity','Pregnancy, liver failure, CNS disease','Pain or anxiety: only after the rest are excluded','Over-ventilation on a ventilator'],
  tests:['A–a gradient or P/F','Lactate and infection screen','Salicylate level','PE work-up guided by pretest probability; pregnancy test'],
  first:['Treat the cause; oxygen if hypoxaemic','On a ventilator: reduce rate or tidal volume'],
  pit:['Do not call it anxiety before PE, sepsis and salicylate are considered','Paper-bag rebreathing is unsafe'],
  src:['foster01','luks19']},
 lung:{t:'Raised A–a gradient',
  dx:['V/Q mismatch: pneumonia, PE, COPD, asthma','Shunt: ARDS, atelectasis, intracardiac shunt','Diffusion limit: interstitial lung disease'],
  tests:['Chest X-ray and lung ultrasound','CT pulmonary angiogram if PE is likely','P/F ratio once on oxygen'],
  first:['Titrate oxygen to SpO₂ 94–98% (88–92% if at risk of hypercapnia)','Shunt responds poorly to oxygen: recruit with CPAP or PEEP'],
  pit:['The A–a gradient is unreliable on supplemental oxygen: use P/F','A normal PaO₂ on high FiO₂ can still be a large gradient'],
  src:['odriscoll17','west']},
 hv:{t:'Hypoxaemia with a normal A–a gradient',
  dx:['Hypoventilation: look at the PaCO₂ and the respiratory causes','Low inspired oxygen: altitude, equipment fault'],
  tests:['PaCO₂ trend','Check the oxygen supply'],
  first:['Treat the hypoventilation; oxygen alone treats the number, not the cause'],
  pit:['A normal gradient means the lungs transfer normally; the problem is drive, pump or inspired gas'],
  src:['west','epstein01']},
 pf:{t:'Impaired oxygenation on oxygen (P/F below 300)',
  dx:['ARDS if bilateral opacities, within a week of a trigger, not fully explained by heart failure, with PEEP ≥ 5 (Berlin)','The 2023 global definition also counts high-flow nasal oxygen ≥ 30 L/min, SpO₂/FiO₂ ≤ 315 when there is no arterial gas, and lung ultrasound','Pneumonia, pulmonary oedema, atelectasis'],
  tests:['Chest imaging','Echo or POCUS for cardiac causes','Repeat P/F on a known FiO₂ and PEEP'],
  first:['Ventilated: tidal volume 6 mL/kg predicted body weight, plateau pressure ≤ 30 cmH₂O','P/F below 150: consider prone positioning for at least 12 h a day'],
  pit:['P/F changes with PEEP and FiO₂; record both','P/F is not valid on low-flow oxygen, where the true FiO₂ is unknown'],
  src:['berlin12','matthay24','ardsnet00','fan17','guerin13']},
 co:{t:'Carboxyhaemoglobin raised',
  dx:['Carbon monoxide: fires, heaters, engines','Smokers can run COHb up to about 10%'],
  tests:['ECG and troponin','Consider cyanide in smoke inhalation with high lactate'],
  first:['Highest-concentration oxygen: 15 L/min via a non-rebreather mask (about 60–80%), or 100% via a tight-fitting circuit if intubated, until symptoms settle and COHb is below about 3%','Do not titrate the oxygen down to a saturation target: the SpO₂ is falsely high','Discuss hyperbaric oxygen with the poisons centre for loss of consciousness, neurological signs, pregnancy or very high COHb'],
  pit:['Pulse oximetry reads COHb as oxyhaemoglobin','The PaO₂ is normal','A COHb of 4–10% in a non-smoker or a symptomatic patient still means exposure','COHb falls with time and oxygen: a level taken hours later underestimates the exposure'],
  src:['weaver09','toff07']},
 methb:{t:'Methaemoglobin raised',
  dx:['Oxidant drugs: dapsone, benzocaine, prilocaine, nitrites and nitrates, inhaled nitric oxide, primaquine, rasburicase','Congenital (rare)'],
  tests:['Co-oximetry trend','G6PD status before methylene blue if possible'],
  first:['Symptomatic or above about 20–30%: methylene blue 1–2 mg/kg IV','Stop the oxidant'],
  pit:['SpO₂ settles near 85% regardless of the true value','Methylene blue may not work, and may cause haemolysis, in G6PD deficiency','Methylene blue with an SSRI or other serotonergic drug can cause serotonin syndrome'],
  src:['wright99','toff07','mhra09']},
 mac:{t:'Metabolic acidosis, anion gap not known',
  dx:['High gap: lactate, ketones, kidney failure, toxins (methanol, ethylene glycol, salicylate)','Normal gap: diarrhoea or other gut losses, renal tubular acidosis, large volumes of 0.9% saline'],
  tests:['Na⁺, Cl⁻ and albumin to calculate the anion gap, corrected for albumin','Lactate, glucose and blood ketones while you wait','Urea and creatinine'],
  first:['Treat the cause you can already see; find the gap before narrowing the work-up'],
  pit:['pH, PCO₂ and HCO₃⁻ alone cannot tell DKA from diarrhoea: you need the gap'],
  src:['kraut10','berend14']},
 severe:{t:'Severe acidaemia (pH below 7.20)',
  dx:['Usually a mixed problem: a metabolic acidosis the lungs can no longer offset, or a respiratory acidosis on top'],
  tests:['Potassium now, then repeat the gas within 30–60 minutes','Lactate, glucose, ketones, creatinine','ECG for hyperkalaemia'],
  first:['ABCDE and senior or critical care help now','Treat the cause: perfusion, insulin in DKA, ventilation if the PCO₂ is high','If you intubate, match the minute ventilation to the patient\'s own breathing: losing the respiratory compensation can drop the pH further','Bicarbonate is not routine; BICAR-ICU found benefit mainly with pH ≤ 7.20 and acute kidney injury'],
  pit:['A "normal" PCO₂ in a severe metabolic acidosis is a tiring patient, not a reassuring one','Acidaemia moves potassium out of cells: the level falls as the pH corrects'],
  src:['jaber18','kraut10','berend14']},
 hyperk:{t:'Hyperkalaemia (K⁺ 6.0 or more)',
  dx:['Acute kidney injury or chronic kidney disease','Drugs: ACE inhibitors, ARBs, spironolactone, trimethoprim, NSAIDs','Shift out of cells: DKA, rhabdomyolysis, tumour lysis, haemolysis'],
  tests:['12-lead ECG now','Laboratory potassium (a gas K⁺ is whole blood; a haemolysed lab sample reads falsely high)','Creatinine, glucose, CK'],
  first:['ECG changes: IV calcium (30 mL 10% calcium gluconate or 10 mL 10% calcium chloride) to protect the heart','K⁺ 6.0 or more: insulin–glucose (10 units soluble insulin with 25 g glucose), then check glucose hourly','K⁺ 6.5 or more: add nebulised salbutamol 10–20 mg','Stop potassium-raising drugs; treat the cause; renal team if refractory'],
  pit:['Calcium does not lower the potassium: it buys time','In DKA the potassium falls quickly once insulin starts; total body potassium is low'],
  src:['ukka20','aronson11']},
 og:{t:'Raised osmolar gap (above 10)',
  dx:['Toxic alcohol: methanol, ethylene glycol','Ethanol, isopropanol, propylene glycol (lorazepam or phenobarbital infusions), mannitol, glycine','Ketoacidosis and lactic acidosis raise it a little'],
  tests:['Ethanol level: it raises the gap, so account for it first','Repeat measured osmolality, glucose and urea together','Anion gap trend; toxic alcohol levels if available'],
  first:['Suspected toxic alcohol: fomepizole (or ethanol) and discuss dialysis early with the poisons centre (TOXBASE or NPIS in the UK)'],
  pit:['Late presentations: the osmolar gap falls as the alcohol is broken down while the anion gap rises','A normal osmolar gap does not exclude toxic alcohol'],
  src:['kraut18','purssell01','roberts15','ghannoum23']},
 lungm:{t:'Raised A–a gradient with an adequate PaO₂',
  dx:['Early V/Q mismatch: pneumonia, PE, asthma, COPD','Age: the expected gradient rises with age (about age ÷ 4 + 4 mmHg)'],
  tests:['Chest X-ray or lung ultrasound','PE work-up guided by pretest probability'],
  first:['Look for the lung cause. Oxygen is not needed if the SpO₂ is on target (94–98%, or 88–92% if at risk of hypercapnia)'],
  pit:['A normal PaO₂ can hide a widening gradient: hyperventilation keeps the PaO₂ up'],
  src:['odriscoll17','west']},
 hyperox:{t:'PaO₂ above the target on oxygen',
  dx:['More oxygen than needed'],
  tests:['SpO₂ on the monitor against the target range'],
  first:['Titrate the oxygen down to SpO₂ 94–98% (88–92% if at risk of hypercapnia)'],
  pit:['A high PaO₂ hides a deteriorating lung: the A–a gradient or P/F shows it','In a CO₂ retainer, excess oxygen can raise the PaCO₂'],
  src:['odriscoll17']},
 ven:{t:'Venous sample',
  dx:[],tests:['An arterial gas if CO₂ or oxygenation drives the decision'],first:[],
  pit:['Venous PO₂ says nothing about lung function','Venous PCO₂ is a screen: ≤ {P:45} makes arterial hypercapnia unlikely, but agreement is poor in shock'],
  src:['byrne14']}
};
/* keys in order of clinical priority: what changes management now comes first and opens by default */
function nextKeys(o,inp){const r=o.r||{},pk=o.primKey,R=[];const add=(key,rank)=>R.push([key,rank]);
 const macK=r.mac==='HAGMA'?['hagma']:r.mac==='NAGMA'?['nagma']:r.mac==='HN'?['hn','hagma']:r.mac?['mac']:[];
 const pr=x=>pk==='two'||pk===x?4:5;
 if(inp.pH!=null&&inp.pH<7.2)add('severe',0);
 if(inp.k!=null&&inp.k>=6)add('hyperk',1);
 if(inp.cohb!=null&&inp.cohb>3)add('co',inp.cohb>10?1:3);if(inp.methb!=null&&inp.methb>10)add('methb',1);
 const oc=o.ox&&!o.ven?o.ox.cat:null;
 if(oc==='pf')add('pf',1);else if(oc==='lung')add('lung',inp.po2!=null&&inp.po2<60?1:2);else if(oc==='hv')add('hv',2);
 if(o.og!=null&&o.og>10)add('og',2);
 macK.forEach(x=>add(x,pr('mac')));if(r.malk)add('malk',pr('malk'));if(r.rac)add('rac',pr('rac'));if(r.ralk)add('ralk',pr('ralk'));
 if(oc==='lungmild')add('lungm',6);
 if(!o.ven&&inp.po2!=null&&inp.po2>150&&inp.fio2!=null&&inp.fio2>0.21)add('hyperox',6);
 if(o.ven)add('ven',7);
 const seen=new Set();return R.map((x,i)=>[x[0],x[1],i]).sort((a,b)=>a[1]-b[1]||a[2]-b[2]).map(x=>x[0]).filter(x=>NEXT[x]&&!seen.has(x)&&seen.add(x));}
/* thresholds in the user's units: {P:49} → '49 mmHg' or '6.5 kPa' */
function ui6U(s){return String(s).replace(/\{P:(\d+(?:\.\d+)?)\}/g,(m,v)=>S.units==='kPa'?(+v/KPA).toFixed(1)+' kPa':v+' mmHg ('+(+v/KPA).toFixed(1)+' kPa)');}
function nextCard(keys){if(!keys.length)return '<div class="card"><span class="eyebrow">Next steps</span><p class="note" style="margin-top:6px">No acid–base disorder to work up. Read the gas in context.</p></div>';
 const li=a=>a&&a.length?'<ul class="nx">'+a.map(x=>'<li>'+esc(ui6U(x))+'</li>').join('')+'</ul>':'';
 const src=[...new Set(keys.flatMap(k=>NEXT[k].src))].filter(i=>SRC[i]);
 return '<div class="card nextc"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow" role="heading" aria-level="2">Next steps · for teaching</span></div>'+
  keys.map((k,i)=>{const n=NEXT[k];return '<details'+(i===0?' open':'')+'><summary><b>'+esc(n.t)+'</b></summary>'+
   (n.dx.length?'<h4 aria-level="3">Differential causes</h4>'+li(n.dx):'')+(n.tests.length?'<h4 aria-level="3">Tests to confirm</h4>'+li(n.tests):'')+(n.first.length?'<h4 aria-level="3">First management steps</h4>'+li(n.first):'')+(n.pit.length?'<h4 aria-level="3">Pitfalls</h4>'+li(n.pit):'')+'</details>';}).join('')+
  '<details><summary><span class="eyebrow">Sources</span></summary><ol class="srcl">'+src.map(i=>'<li>'+esc(SRC[i][1])+(SRC[i][2]?' <a href="https://doi.org/'+esc(SRC[i][2])+'" target="_blank" rel="noopener">doi:'+esc(SRC[i][2])+'</a>':'')+'</li>').join('')+'</ol></details>'+
  '<p class="teachonly">'+esc(TEACH_ONLY)+'</p></div>';}

/* ---- the gas log: real gases from the user's day, kept as typed and synced like progress ---- */
const LOG_KEYS=['pH','pco2','po2','fio2','hco3','na','k','cl','alb','lac','glu','urea','osm','bhb','spo2','cohb','methb','age','peep','ctx'];
/* tags match without case or extra spaces; the first spelling used is the one shown */
const ui6TagKey=t=>String(t||'').trim().replace(/\s+/g,' ').toLowerCase();
function ui6Tags(){const m=new Map();logList().slice().reverse().forEach(e=>{const k=ui6TagKey(e.tag);if(k&&!m.has(k))m.set(k,String(e.tag).trim().replace(/\s+/g,' '));});return [...m.values()];}
function logList(){return (S.gaslog||[]).filter(x=>x&&!x.del).sort((a,b)=>(a.t||'')<(b.t||'')?1:-1);}
/* the read is recomputed from the stored values, so entries keep only what was typed (old entries keep their stored text as a fallback) */
const UI6_READ={};function ui6Read(e){const c=UI6_READ[e.id];if(c&&c.u===e.u)return c;let o={};try{o=interp(ui6Inp(e))||{};}catch(err){}const r={u:e.u,label:o.err?e.label||'':o.label||e.label||'',line:o.err?e.line||'':o.line||e.line||''};UI6_READ[e.id]=r;return r;}
function logAdd(inp,o,note,tag,when){S.gaslog=S.gaslog||[];const v={};LOG_KEYS.forEach(k=>{if(inp[k]!=null&&inp[k]!=='')v[k]=inp[k];});
 const k=ui6TagKey(tag),same=k&&ui6Tags().find(t=>ui6TagKey(t)===k);tag=same||String(tag||'').trim().replace(/\s+/g,' ');
 const t=when&&!isNaN(Date.parse(when))?new Date(when).toISOString():new Date().toISOString();
 const e={id:'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t,u:Date.now(),sample:inp.sample==='v'?'v':'a',v,note:note||'',tag:tag||''};
 S.gaslog.push(e);UI6_STORED=save()!==false;return e;}
let UI6_STORED=true;
/* delete keeps a copy in memory so the toast can undo it; the stored tombstone keeps only id, t, del and u */
function logDel(id){const e=(S.gaslog||[]).find(x=>x.id===id);if(!e)return null;const copy=JSON.parse(JSON.stringify(e));Object.keys(e).forEach(k=>{if(!['id','t'].includes(k))delete e[k];});e.del=true;e.u=Date.now();save();return copy;}
function ui6Undel(copy){const e=(S.gaslog||[]).find(x=>x.id===copy.id);if(!e)return;Object.keys(e).forEach(k=>delete e[k]);Object.assign(e,copy);delete e.del;e.u=Date.now();save();}
function ui6UndoToast(msg,undo){const h=$('toasts');if(!h)return;while(h.children.length>=2)h.firstChild.remove();const t=document.createElement('div');t.className='toast';t.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px';
 t.innerHTML='<span>'+esc(msg)+'</span><button class="btn small" style="min-height:44px">Undo</button>';h.appendChild(t);announce(msg+'. Undo is available for 6 seconds.');
 const gone=()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),320);};const tm=setTimeout(gone,6000);t.querySelector('button').onclick=()=>{clearTimeout(tm);t.remove();undo();announce('Restored');};}
const ui6Arr=x=>Array.isArray(x)?x.filter(y=>y&&typeof y==='object'):[];const ui6Map=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const ui6When=x=>+x.u||Date.parse(x.t||'')||0;
/* union by id: a tombstone wins, otherwise the newer edit. Sorted by time; tombstones older than 90 days are dropped; cap keeps the newest live entries */
function mergeLog(a,b,cap){const m={};[...ui6Arr(a),...ui6Arr(b)].forEach(x=>{if(!x.id)return;const c=m[x.id];if(!c||x.del&&!c.del||(+x.u||0)>(+c.u||0)&&!c.del)m[x.id]=x;});
 const old=Date.now()-90*864e5;let out=Object.values(m).filter(x=>!(x.del&&(+x.u||0)<old)).sort((x,y)=>ui6When(x)-ui6When(y));
 if(cap){const live=out.filter(x=>!x.del);if(live.length>cap){const drop=new Set(live.slice(0,live.length-cap).map(x=>x.id));out=out.filter(x=>!drop.has(x.id));}}return out;}
/* per-day study record for the weekly review: S.wk[day]={s:{step:[n,c]},k:{kind:[n,c]},ms} — merged by the larger count */
function ui6MergeWk(a,b){a=ui6Map(a);b=ui6Map(b);const o={};new Set([...Object.keys(a),...Object.keys(b)]).forEach(d=>{const x=ui6Map(a[d]),y=ui6Map(b[d]);const r={s:{},k:{},ms:Math.max(+x.ms||0,+y.ms||0)};
  ['s','k'].forEach(f=>{const X=ui6Map(x[f]),Y=ui6Map(y[f]);new Set([...Object.keys(X),...Object.keys(Y)]).forEach(k=>{const p=Array.isArray(X[k])?X[k]:[0,0],q=Array.isArray(Y[k])?Y[k]:[0,0];r[f][k]=(+p[0]||0)>=(+q[0]||0)?p:q;});});o[d]=r;});
 return ui6PruneWk(o);}
function ui6PruneWk(o){const ks=Object.keys(o).filter(k=>/^\d{4}-\d\d-\d\d$/.test(k)).sort();const keep=ks.slice(-42);const r={};keep.forEach(k=>r[k]=o[k]);return r;}
if(typeof mergeStates==='function'){const _ms=mergeStates;mergeStates=function(A,B){const o=_ms(A,B);try{const a=migrate(JSON.parse(JSON.stringify(ui6Map(A)))),b=migrate(JSON.parse(JSON.stringify(ui6Map(B))));
  if((+a.epoch||0)===(+b.epoch||0)){o.gaslog=mergeLog(a.gaslog,b.gaslog);o.speed=mergeMap(ui6Map(a.speed),ui6Map(b.speed),pickRec);o.cases=mergeMap(ui6Map(a.cases),ui6Map(b.cases),pickRec);o.cmist=mergeLog(a.cmist,b.cmist,200);o.qmiss=mergeMap(ui6Map(a.qmiss),ui6Map(b.qmiss),maxN);
   o.wk=ui6MergeWk(a.wk||ui6Map(A).wk,b.wk||ui6Map(B).wk);
   /* Yuzu sent marks: the later send per card, so two phones agree on what was already sent (T25-11) */
   o.yzSent=mergeMap(ui6Map(a.yzSent),ui6Map(b.yzSent),maxN);
   /* the last Round's minutes travel with the later lastRound; the reviewed-week marker is a date key, the later wins */
   const la=a.lastRound||'',lb=b.lastRound||'';if(la!==lb)o.lastRoundMin=+(la>lb?a:b).lastRoundMin||0;
   const wa=ui6Map(a.ui).weekly,wb=ui6Map(b.ui).weekly;if(wa||wb){o.ui=ui6Map(o.ui);o.ui.weekly=String(wa||'')>String(wb||'')?wa:wb;}}}catch(err){console.warn('ui6 merge',err);}return o;};}
const IDLIKE=/\b\d{5,}\b|(?:\d[\s-]?){7,}|\b(mrn|id|file|nid|iqama|passport|pt|patient)\.?\s*(no\.?)?\s*[:#.]?\s*\d+|\b(dob|d\.o\.b|born)\b|\b\d{1,2}[\/.-]\d{1,2}[\/.-](19|20)\d{2}\b/i;
const UI6_TITLE=/\b(?:[Mm]rs?|[Mm]s|[Mm]iss|[Dd]r|[Aa]bu|[Uu]mm|[Bb]int?)\.?\s+[A-Z][a-z]+/,UI6_TWOCAP=/\b[A-Z][a-z]{2,}\s+(?:[Aa]l-)?[A-Z][a-z]{2,}\b/;
function privacyWarn(s,tag){s=s||'';if(IDLIKE.test(s))return 'This looks like an ID number or a date of birth. Keep names and IDs out: use a bed number or a short tag.';
 if(UI6_TITLE.test(s)||UI6_TWOCAP.test(tag||''))return 'This may be a name. Keep names out: use a bed number or a short tag.';return '';}
const fmtT=t=>{const d=new Date(t);return ddmmyyyy(d)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
const ui6Synced=()=>typeof signedIn==='function'&&signedIn()&&!!(S.google&&S.google.syncState);
const ui6Local=d=>{d=d||new Date();const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes());};
const ui6Sig=(inp)=>{const v={};LOG_KEYS.forEach(k=>{if(inp[k]!=null&&inp[k]!=='')v[k]=k==='ctx'?String(inp[k]):+inp[k];});return (inp.sample==='v'?'v':'a')+JSON.stringify(v);};
/* save or edit sheet: shared modal (focus, Tab trap, Escape, inert page, focus back), honest sync line, ID and name check, draft kept for this tab */
function saveSheet(inp,o,opt){opt=opt||{};const ed=opt.edit||null;const sig=ed?'':ui6Sig(inp);const dup=ed?null:logList().find(e=>ui6Sig(Object.assign({sample:e.sample},e.v))===sig);
 let draft={};if(!ed)try{draft=JSON.parse(sessionStorage.getItem('ui6draft')||'{}');if(draft.sig!==sig)draft={};}catch(e){draft={};}
 const sc=document.createElement('div');sc.className='sheet-scrim on';sc.style.zIndex='80';const tags=ui6Tags().slice(0,12);
 const sync=ui6Synced()?'It syncs to your Google Drive with your progress.':'It is kept on this device only'+(typeof signedIn==='function'?' (not signed in to Google).':'.');
 sc.innerHTML='<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="lgT"><h2 id="lgT">'+(ed?'Edit this gas':'Save to the gas log')+'</h2><p class="privacy"><b>No names or IDs.</b> Use a bed number or a short tag. '+sync+'</p>'+
  (dup?'<p class="note" id="lgDup">Already in the log ('+fmtT(dup.t)+'). Saving makes a second entry.</p>':'')+
  '<label class="fld"><span>Tag (groups serial gases for a trend)</span><input id="lgTag" maxlength="40" placeholder="e.g. Bed 4 DKA" list="lgTags" enterkeyhint="done"><datalist id="lgTags">'+tags.map(t=>'<option value="'+esc(t)+'">').join('')+'</datalist></label>'+
  '<label class="fld"><span>Taken at</span><input id="lgWhen" type="datetime-local"></label>'+
  '<label class="fld"><span>Note</span><textarea id="lgNote" rows="3" maxlength="600" placeholder="Context, what you thought, what happened"></textarea></label><p class="note" id="lgCount" aria-live="off" style="margin:0;text-align:right">0/600</p><p id="lgWarn" class="warnline" role="status"></p>'+
  '<div class="btnrow"><button class="btn primary" id="lgOk">'+(ed?'Save changes':'Save')+'</button><button class="btn" id="lgNo">Cancel</button></div></div>';
 document.body.appendChild(sc);
 const tg=$('lgTag'),nt=$('lgNote'),wh=$('lgWhen'),ok=$('lgOk');tg.value=ed?ed.tag||'':draft.tag||'';nt.value=ed?ed.note||'':draft.note||'';wh.value=ui6Local(ed?new Date(ed.t):new Date());wh.max=ui6Local(new Date(Date.now()+5*6e4));
 const close=typeof openModal==='function'?openModal(sc,{label:ed?'Edit this gas':'Save to the gas log',initial:'#lgTag',opener:opt.opener}):()=>sc.remove();
 $('lgNo').onclick=()=>{close();};sc.onclick=e=>{if(e.target===sc)close();};
 let armed=false;const keep=()=>{if(ed)return;try{sessionStorage.setItem('ui6draft',JSON.stringify({sig,tag:tg.value,note:nt.value}));}catch(e){}};
 const chk=()=>{const w=privacyWarn(tg.value+' '+nt.value,tg.value);$('lgWarn').textContent=w;armed=false;ok.textContent=w?'Save anyway':(ed?'Save changes':'Save');$('lgCount').textContent=nt.value.length+'/600'+(nt.value.length>=600?' · limit reached':'');keep();};
 tg.oninput=chk;nt.oninput=chk;nt.onpaste=e=>{const t=(e.clipboardData&&e.clipboardData.getData('text'))||'';if(nt.value.length-(nt.selectionEnd-nt.selectionStart)+t.length>600)setTimeout(()=>{$('lgWarn').textContent='The note was cut to 600 characters.';},0);};chk();
 const doSave=key=>{const w=privacyWarn(tg.value+' '+nt.value,tg.value);if(w&&key===true&&!armed){armed=true;announce(w+' Press Enter again or tap Save anyway to keep it.');return;}
  const when=wh.value&&!isNaN(Date.parse(wh.value))?new Date(wh.value):new Date();
  if(ed){const e=(S.gaslog||[]).find(x=>x.id===ed.id);if(e){const k=ui6TagKey(tg.value),same=k&&ui6Tags().find(t=>ui6TagKey(t)===k&&t!==e.tag);e.tag=same||tg.value.trim().replace(/\s+/g,' ');e.note=nt.value.trim();e.t=when.toISOString();e.u=Date.now();save();}close();announce('Changes saved');if(opt.after)opt.after();return;}
  logAdd(inp,o,nt.value.trim(),tg.value,when);try{sessionStorage.removeItem('ui6draft');}catch(e){}close();if(!UI6_STORED){toast('Not saved: storage full','bad');return;}toast('Saved to the gas log');if(opt.after)opt.after();};
 ok.onclick=()=>doSave(false);tg.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();doSave(true);}};nt.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();doSave(true);}};}
/* Web Share where it exists; otherwise copy, and if the clipboard is blocked show the line selectable under the button */
function shareRead(line,btn){if(navigator.share){navigator.share({text:line}).catch(()=>{});return;}
 copyText(line,btn).then(ok=>{if(ok||!btn)return;const row=btn.closest('.btnrow')||btn.parentElement;if(row.nextElementSibling&&row.nextElementSibling.classList.contains('copy'))return;const ta=document.createElement('textarea');ta.className='copy';ta.readOnly=true;ta.value=line;ta.setAttribute('aria-label','The line to copy');row.after(ta);ta.focus();ta.select();});}
const ui6ShareLabel=()=>navigator.share?'Share line':'Copy line';

/* add next steps, save, share and the banner to the interpreter read */
if(typeof runInterp==='function'){const _ri=runInterp;runInterp=function(){_ri();const out=$('iOut');if(!out||!out.querySelector('.bigread'))return;
 const typed=Object.assign({},IV);const inp=Object.assign({},IV);if(inp.fio2!=null&&inp.fio2>1)inp.fio2=inp.fio2/100;if(inp.hco3==null)inp.hco3=r1(hFrom(inp.pH,inp.pco2));const o=interp(inp);if(o.err)return;
 /* save only what was typed: a calculated HCO₃⁻ is left out, FiO₂ keeps the unit it was typed in */
 const row=document.createElement('div');row.className='btnrow';row.innerHTML='<button class="btn small" id="iSave">'+ic('check')+'Save to log</button>'+(navigator.share?'<button class="btn small" id="iShare">Share line</button>':'')+'<button class="btn small" id="iLog"'+(logList().length?'':' hidden')+'>Open log</button>';
 const act=$('iAct'),rc=out.querySelector('.card.raised');if(act)act.append(...row.children);else if(rc)rc.appendChild(row);
 /* numbers that do not fit Henderson–Hasselbalch get no diagnosis-specific next steps */
 const bad=(o.flags||[]).includes('inconsistent');const shareLine=(bad?'UNRELIABLE (Henderson mismatch): ':'')+o.line;
 const nc=document.createElement('div');nc.innerHTML=bad?'<div class="card nextc"><span class="eyebrow">Next steps</span><p class="note" style="margin-top:6px">Recheck the sample first: the pH, PCO₂ and HCO₃⁻ do not fit together (typing error, a wrong sample, or a calculated value from another time). Repeat the gas before acting on it.</p><p class="teachonly">'+esc(TEACH_ONLY)+'</p></div>':nextCard(nextKeys(o,inp));out.appendChild(nc.firstChild);
 const sv=$('iSave');if(!sv)return;sv.onclick=()=>saveSheet(typed,o,{opener:sv,after:()=>{if(!sv.isConnected)return;sv.innerHTML=ic('check')+'Saved';sv.disabled=true;sv.setAttribute('aria-label','Saved to the gas log');const l=$('iLog');if(l){l.hidden=false;l.focus();}}});
 if($('iShare'))$('iShare').onclick=e=>shareRead(shareLine,e.currentTarget);const lg=$('iLog');lg.onclick=()=>openTool('log');if(UI6_FROMLOG){lg.hidden=false;lg.innerHTML='← Back to the gas log';}};}

/* ---- trend chart: one tag, several gases ---- */
/* [key, label, arterial band, venous band, unit]. PO₂ is trended for arterial points only. */
const TREND_SERIES=[['pH','pH',[7.35,7.45],[7.32,7.42],''],['pco2','PCO₂',[35,45],[40,50],'p'],['hco3','HCO₃⁻',[22,26],[23,27],'mmol/L'],['lac','Lactate',[0,2],[0,2],'mmol/L'],['ag','Anion gap',null,null,'mmol/L'],['po2','PO₂',[80,100],null,'p']];
const ui6Neg=(x,f)=>(x<0?'−':'')+Math.abs(x).toFixed(f);
function ui6Inp(e){const v=Object.assign({sample:e.sample},e.v);if(v.fio2!=null&&v.fio2>1)v.fio2=v.fio2/100;if(v.hco3==null&&v.pH!=null&&v.pco2!=null)v.hco3=r1(hFrom(v.pH,v.pco2));return v;}
/* one series per tag: VBG points become arterial estimates when the tag mixes samples (pH +0.03, PCO₂ −5, HCO₃⁻ −1);
   one kind of anion gap for every point (corrected only when every point has an albumin, carried forward if needed) */
function trendData(es){const s=es.slice().sort((a,b)=>a.t<b.t?-1:1);const types=new Set(s.map(e=>e.sample==='v'?'v':'a'));const mixed=types.size>1,allV=!mixed&&types.has('v');
 let alb=null,carried=false;const albs=s.map(e=>{if(e.v.alb!=null){alb=e.v.alb;return [alb,false];}if(alb!=null){carried=true;return [alb,true];}return [null,false];});
 const corr=albs.every(x=>x[0]!=null);
 const pts=s.map((e,i)=>{const v=ui6Inp(e);let o={};try{o=interp(v)||{};}catch(err){}const ven=e.sample==='v';const d=Object.assign({},v);
  if(ven){delete d.po2;if(mixed){if(d.pH!=null)d.pH=+(d.pH+0.03).toFixed(2);if(d.pco2!=null)d.pco2=d.pco2-5;if(d.hco3!=null)d.hco3=r1(d.hco3-1);}}
  const ag=o.ag==null?null:corr?r1(o.ag+0.25*(40-albs[i][0])):o.ag;
  return {t:e.t,v:d,ag,sample:ven?'v':'a',conv:ven&&mixed,label:o.label||e.label};});
 pts.mixed=mixed;pts.allV=allV;pts.agMode=corr?'corr':'raw';pts.carried=corr&&carried;return pts;}
function ui6Span(ms){const m=Math.round(ms/6e4);return m<90?m+' min':m<48*60?Math.round(m/60)+' h':Math.round(m/1440)+' days';}
function sparkSVG(pts,lo,hi,times){const ys=pts.map(p=>p[1]);let mn=Math.min(...ys,lo==null?Infinity:lo),mx=Math.max(...ys,hi==null?-Infinity:hi);if(mn===mx){mn-=1;mx+=1;}
 const W=300,H=56,ts=times||[],t0=ts.length?ts[0]:0,t1=ts.length?ts[ts.length-1]:0,byT=ts.length===pts.length&&t1>t0;
 const px=i=>pts.length<2?W/2:byT?8+(ts[i]-t0)/(t1-t0)*(W-16):8+i*(W-16)/(pts.length-1),py=y=>H-6-(y-mn)/(mx-mn)*(H-12);
 const band=lo!=null&&hi!=null?'<rect x="0" y="'+py(hi)+'" width="'+W+'" height="'+Math.max(1,py(lo)-py(hi))+'" class="tband"/>':'';
 const dot=(p,i)=>{const x=px(i),y=py(p[1]);return '<path d="M'+x+' '+y+'h0" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" vector-effect="non-scaling-stroke">'+(p[2]?'<title>'+esc(p[2])+'</title>':'')+'</path>'+(p[3]?'<path d="M'+x+' '+y+'h0" stroke="var(--surface)" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/>':'');};
 return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" class="spark" aria-hidden="true">'+band+'<polyline points="'+pts.map((p,i)=>px(i)+','+py(p[1])).join(' ')+'" class="tline" vector-effect="non-scaling-stroke"/>'+pts.map(dot).join('')+'</svg>';}
function trendHTML(tag){const key=ui6TagKey(tag);const es=logList().filter(e=>ui6TagKey(e.tag)===key);if(es.length<2)return '<p class="note">Save two or more gases with the tag "'+esc(tag)+'" to see a trend.</p>';
 const d=trendData(es);const U=S.units==='kPa'?'kPa':'mmHg',ref=+S.agref||12;
 const rows=TREND_SERIES.map(([k,lab,ab,vb,unit])=>{let band=d.allV?vb:ab;if(k==='ag')band=[ref-4,ref+2];
  const ix=d.map((x,i)=>i).filter(i=>{const y=k==='ag'?d[i].ag:d[i].v[k];return y!=null&&isFinite(y);});if(ix.length<2)return '';
  const isP=unit==='p',f=k==='pH'?2:1,show=v=>isP?P(v):ui6Neg(+v,f),u=isP?U:unit;
  const pts=ix.map(i=>{const y=k==='ag'?d[i].ag:d[i].v[k];return [i,y,fmtT(d[i].t)+' · '+show(y)+(u?' '+u:'')+(d[i].conv?' (VBG, arterial estimate)':''),d[i].conv];});
  const first=pts[0][1],last=pts[pts.length-1][1],dl=last-first,dls=isP?(S.units==='kPa'?ui6Neg(dl/KPA,1):ui6Neg(Math.round(dl),0)):ui6Neg(dl,f);
  const name=k==='ag'?'Anion gap ('+(d.agMode==='corr'?'alb-corr':'raw')+')':lab;
  const bandTxt=band?(isP?P(band[0])+'–'+P(band[1]):band[0]+'–'+band[1])+(d.allV&&k!=='ag'&&k!=='lac'?' venous':'')+' band':'';
  return '<div class="trow"><div><b>'+esc(name)+(u?' <span class="muted" style="font-weight:400">('+esc(u)+')</span>':'')+'</b><small>'+show(first)+' → '+show(last)+' ('+(dl>0?'+':'')+(dl===0?'0':dls)+')'+(bandTxt?' · '+bandTxt:'')+'</small></div>'+sparkSVG(pts,band&&band[0],band&&band[1],ix.map(i=>Date.parse(d[i].t)))+'</div>';}).join('');
 const notes=[];if(d.mixed)notes.push('This tag mixes ABGs and VBGs: VBG points are shown as arterial estimates (pH +0.03, PCO₂ −'+(S.units==='kPa'?'0.7 kPa':'5 mmHg')+', HCO₃⁻ −1) with hollow dots, and PO₂ uses ABGs only.');
 else if(d.allV)notes.push('Venous series: venous bands, no PO₂.');
 if(d.carried)notes.push('Albumin carried forward from an earlier gas for the corrected gap.');else if(d.agMode==='raw'&&d.some(x=>x.v.alb!=null))notes.push('Raw gap for every point: not every gas has an albumin.');
 const sp=Date.parse(d[d.length-1].t)-Date.parse(d[0].t);
 return '<div class="trend">'+rows+'</div>'+(sp>0?'<div class="trow" aria-hidden="true"><span></span><small class="mono" style="display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:.74rem"><span>'+fmtT(d[0].t)+'</span><span>'+fmtT(d[d.length-1].t)+'</span></small></div>':'')+
  '<ol class="tlist">'+d.map(x=>'<li><span class="mono">'+fmtT(x.t)+'</span> <b>'+(x.sample==='v'?'VBG':'ABG')+'</b> '+esc(x.label||'')+'</li>').join('')+'</ol>'+
  '<p class="note">'+trendSay(d)+'</p>'+(notes.length?'<p class="note">'+esc(notes.join(' '))+'</p>':'');}
/* for each value: the first and last gases that have it (as the sparkline), symmetric thresholds, and the time between them */
function trendSay(d){const s=[];const ends=get=>{const ix=d.map((x,i)=>i).filter(i=>{const y=get(d[i]);return y!=null&&isFinite(y);});return ix.length>=2?[d[ix[0]],d[ix[ix.length-1]]]:null;};
 const ph=ends(x=>x.v.pH);if(ph){const a=ph[0].v.pH,b=ph[1].v.pH,dp=Math.round((b-a)*100)/100;
  if(Math.abs(dp)<0.03)s.push('pH is about the same');else{const up=dp>0;s.push((a<7.35&&up&&b<=7.45)||(a>7.45&&!up&&b>=7.35)?'pH is '+(up?'rising':'falling')+' toward normal ('+a.toFixed(2)+' → '+b.toFixed(2)+')':(b<7.35&&!up)?'acidaemia is worsening ('+a.toFixed(2)+' → '+b.toFixed(2)+')':(b>7.45&&up)?'alkalaemia is worsening ('+a.toFixed(2)+' → '+b.toFixed(2)+')':'pH is '+(up?'rising':'falling')+' ('+a.toFixed(2)+' → '+b.toFixed(2)+')');}}
 const ag=ends(x=>x.ag);let gapFell=false;if(ag){const dg=Math.round((ag[1].ag-ag[0].ag)*10)/10;if(Math.abs(dg)>=3){s.push('the anion gap is '+(dg<0?'closing':'widening')+' ('+ag[0].ag+' → '+ag[1].ag+')');gapFell=dg<0;}}
 const lc=ends(x=>x.v.lac);if(lc&&lc[0].v.lac>0){const a=lc[0].v.lac,b=lc[1].v.lac,pc=Math.round((a-b)/a*100),h=ui6Span(Date.parse(lc[1].t)-Date.parse(lc[0].t));
  s.push('lactate '+(pc>=10?'cleared '+pc+'%':pc<=-10?'rose '+(-pc)+'%':'is flat')+' ('+a+' → '+b+(Date.parse(lc[1].t)>Date.parse(lc[0].t)?' over '+h:'')+')');}
 const cl=ends(x=>x.v.cl);if(cl&&gapFell&&cl[1].v.cl-cl[0].v.cl>=4)s.push('chloride rose as the gap closed: a normal-gap (hyperchloraemic) acidosis is replacing the high-gap one, often from chloride-rich fluids such as 0.9% saline');
 if(!s.length)return 'Too few shared values to describe the trend.';
 const sp=Date.parse(d[d.length-1].t)-Date.parse(d[0].t);const txt=s.join('; ')+'.';
 return esc(sp>0?'Over '+ui6Span(sp)+': '+txt:txt.replace(/^[a-oq-z]/,c=>c.toUpperCase()));}

/* ---- the log tool ---- */
TOOLS.splice(1,0,['log','Gas log','Real gases from your day, kept as typed, with trends over serial gases. No names or IDs.','steps']);
let UI6_FROMLOG=false;
function ui6CSV(es){const q=s=>{s=s==null?'':String(s);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};const cols=['time','tag','sample',...LOG_KEYS,'read','note'];
 return '﻿'+cols.join(',')+'\n'+es.map(e=>[fmtT(e.t),e.tag||'',e.sample==='v'?'VBG':'ABG',...LOG_KEYS.map(k=>e.v[k]),ui6Read(e).line,e.note||''].map(q).join(',')).join('\n');}
TOOLFN.log=b=>{const draw=()=>{const L2=logList();const tags=ui6Tags();S.ui=S.ui||{};
 /* the tag filter survives a trip to the interpreter, and falls back to All when its last gas is deleted */
 let f=b.dataset.tag!=null?b.dataset.tag:(S.ui.logTag||'');const fk=ui6TagKey(f);if(fk&&!tags.some(t=>ui6TagKey(t)===fk)){f='';}b.dataset.tag=f;S.ui.logTag=f;
 const show=fk&&f?L2.filter(x=>ui6TagKey(x.tag)===fk):L2;const asc=show.slice().reverse();
 b.innerHTML='<p class="privacy"><b>No names or IDs.</b> Everything here is kept as you typed it. '+(ui6Synced()?'It syncs to your Google Drive with your progress.':'It is kept on this device only until you sign in to Google in Settings.')+'</p>'+
  (L2.length?'<div class="card"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">'+L2.length+' gas'+(L2.length>1?'es':'')+(tags.length?' · '+tags.length+' tag'+(tags.length>1?'s':''):'')+'</span><div class="btnrow"><button class="btn small" id="lgCopy">'+(f?'Copy '+show.length+' ('+esc(f)+')':'Copy all')+'</button><button class="btn small" id="lgCsv">Download CSV</button><button class="btn small" id="lgNew">Add a gas</button></div></div>'+
   (tags.length?'<div class="seg wrap" role="group" aria-label="Filter by tag" style="margin-top:10px"><button data-tag="" aria-pressed="'+!f+'">All</button>'+tags.map(t=>'<button data-tag="'+esc(t)+'" aria-pressed="'+(ui6TagKey(t)===fk&&!!f)+'">'+esc(t)+'</button>').join('')+'</div>':'')+'</div>'+
   (f?'<div class="card"><span class="eyebrow">Trend · '+esc(f)+'</span>'+trendHTML(f)+'</div>':'')+
   '<div class="loglist">'+show.map(e=>{const rd=ui6Read(e);return '<div class="card logi"><span class="eyebrow">'+fmtT(e.t)+(e.tag?' · '+esc(e.tag):'')+' · '+(e.sample==='v'?'VBG':'ABG')+'</span><b style="display:block;margin-top:4px">'+esc(rd.label)+'</b><p class="line mono" style="font-size:12.5px">'+esc(rd.line)+'</p>'+(e.note?'<p class="note">'+esc(e.note)+'</p>':'')+
    '<div class="btnrow" style="margin-top:8px"><button class="btn small" data-open="'+e.id+'">Open</button><button class="btn small" data-edit="'+e.id+'">Edit</button><button class="btn small" data-share="'+e.id+'">'+ui6ShareLabel()+'</button><button class="btn small danger" data-del="'+e.id+'" aria-label="Delete this gas" style="margin-left:auto">Delete</button></div></div>';}).join('')+'</div>'
  :'<div class="empty"><b>No gases yet</b><span>Read a gas in the interpreter, then tap "Save to log". Tag serial gases the same way to see a trend.</span><button class="btn primary" id="lgNew">Open the interpreter</button></div>');
 b.querySelectorAll('[data-tag]').forEach(x=>x.onclick=()=>{b.dataset.tag=x.dataset.tag;draw();});
 b.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>{const e=L2.find(y=>y.id===x.dataset.open);if(!e)return;UI6_FROMLOG='pending';openTool('interp');setTimeout(()=>{if(typeof loadInterp==='function'){loadInterp(Object.assign({sample:e.sample},e.v));buildForm();runInterp();}},60);});
 b.querySelectorAll('[data-edit]').forEach(x=>x.onclick=()=>{const e=L2.find(y=>y.id===x.dataset.edit);if(!e)return;saveSheet(Object.assign({sample:e.sample},e.v),null,{edit:e,opener:x,after:()=>{delete b.dataset.tag;draw();const n=b.querySelector('[data-edit="'+e.id+'"]');if(n)n.focus();}});});
 b.querySelectorAll('[data-share]').forEach(x=>x.onclick=()=>{const e=L2.find(y=>y.id===x.dataset.share);if(e)shareRead(ui6Read(e).line,x);});
 b.querySelectorAll('[data-del]').forEach(x=>{let armed=false;x.onclick=()=>{if(!armed){armed=true;x.textContent='Tap again to delete';setTimeout(()=>{armed=false;if(x.isConnected)x.textContent='Delete';},2500);return;}
  const copy=logDel(x.dataset.del);delete b.dataset.tag;draw();if(copy)ui6UndoToast('Gas deleted',()=>{ui6Undel(copy);if(b.isConnected){delete b.dataset.tag;draw();}});};});
 if($('lgNew'))$('lgNew').onclick=()=>openTool('interp');
 if($('lgCsv'))$('lgCsv').onclick=()=>{try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ui6CSV(asc)],{type:'text/csv'}));a.download='buffer-gas-log-'+today()+'.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);announce('CSV downloaded');}catch(err){toast('Download failed','bad');}};
 if($('lgCopy'))$('lgCopy').onclick=e=>{const ls=(f?asc:show).map(x=>fmtT(x.t)+(x.tag?' ['+x.tag+']':'')+' '+(x.sample==='v'?'VBG ':'')+ui6Read(x).line+(x.note?' Note: '+x.note:''));
  if(f&&asc.length>=2){const tmp=document.createElement('div');tmp.innerHTML=trendSay(trendData(asc));ls.push('Trend: '+tmp.textContent);}copyText(ls.join('\n'),e.currentTarget);};};draw();};

/* ---- teaching-only banner on every tool and model ---- */
if(RENDER.tool){const _rt=RENDER.tool;RENDER.tool=function(id){UI6_FROMLOG=UI6_FROMLOG==='pending'&&(id||TOOL)==='interp';_rt(id);const el=$('v-tool');if(!el||el.querySelector('.teachbar'))return;const h=el.querySelector('.view-head');if(h){const p=document.createElement('p');p.className='teachbar';p.textContent=TEACH_ONLY;h.after(p);}};}

/* ---- weekly review ---- */
function weekStart(d){d=new Date(d||Date.now());const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);d.setHours(0,0,0,0);return d;}
/* per-day record for week-only figures (S.wk, merged in mergeStates above): step and pattern results, and active time between answers */
function ui6Wk(){S.wk=ui6Map(S.wk);const t=today();const d=S.wk[t]=ui6Map(S.wk[t]);d.s=ui6Map(d.s);d.k=ui6Map(d.k);d.ms=+d.ms||0;if(Object.keys(S.wk).length>45)S.wk=ui6PruneWk(S.wk);return S.wk[t];}
if(typeof recordStep==='function'){const _r6=recordStep;recordStep=function(c,ok){_r6(c,ok);try{const d=ui6Wk(),x=Array.isArray(d.s[c])?d.s[c]:[0,0];d.s[c]=[x[0]+1,x[1]+(ok?1:0)];}catch(e){}};}
if(typeof kindStat==='function'){const _k6=kindStat;kindStat=function(k){const st=_k6(k);try{const n0=+st.n||0,c0=+st.c||0;Promise.resolve().then(()=>{const dn=(+st.n||0)-n0;if(dn>0&&KINDS[k]){const d=ui6Wk(),x=Array.isArray(d.k[k])?d.k[k]:[0,0];d.k[k]=[x[0]+dn,x[1]+Math.max(0,(+st.c||0)-c0)];}});}catch(e){}return st;};}
let UI6_LAST=0;if(typeof touchDay==='function'){const _t6=touchDay;touchDay=function(n){_t6(n);try{const now=Date.now(),gap=now-UI6_LAST;const d=ui6Wk();d.ms+=UI6_LAST&&gap>0&&gap<5*6e4?gap:30000;UI6_LAST=now;}catch(e){}};}
const UI6_GASM=new Set(['today','steps','quick','fit','reflex','mist','due','gotd','final','five','noisy','pflash','handover']);
const UI6_READSTEPS=['real','ph','prim','comp','gap','delta','ox','read'];
/* seconds per item, used only for old weeks without measured time */
const UI6_SECS={five:6,pflash:5,reflex:10,noisy:40,handover:30,gym:15,boss:40,quick:45,fit:60,final:50,case:60};
function ui6KindOf(r){if(!r||typeof TARGET==='undefined')return null;for(const k of Object.keys(KINDS)){const t=TARGET[KINDS[k].lbl];if(!t)continue;if((t.mac||null)===(r.mac||null)&&!!t.malk===!!r.malk&&!!t.rac===!!r.rac&&!!t.ralk===!!r.ralk&&(!t.rq||t.rq===r.rq))return k;}return null;}
const ui6Sent=s=>{s=String(s||'');return /^(pH|[A-Z]{2,})/.test(s)?s:s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();};
/* the reviewed week: last week on Mondays, otherwise this week (Sunday reviews the week ending today). The Citrus
   weekly link sets UI6_WOFF itself in ui9 (&wk=), so one rule serves ui6, ui9 and ui10 (T25-10/T13-12) */
let UI6_WOFF=null;function ui6AutoOff(){return new Date().getDay()===1?1:0;}
function weeklyReview(off){off=Math.max(0,+off||0);const st=weekStart();st.setDate(st.getDate()-7*off);const k0=isoD(st),end=new Date(st);end.setDate(st.getDate()+6);const k1=isoD(end);
 const inWk=k=>typeof k==='string'&&k>=k0&&k<=k1;const sess=(S.sess||[]).filter(s=>s&&inWk(s.d));
 /* one definition of a gas everywhere: the daily count the heatmap and Today use */
 const n=Object.keys(S.dayN||{}).filter(inWk).reduce((a,k)=>a+(+S.dayN[k]||0),0);
 const gs=sess.filter(s=>UI6_GASM.has(s.m)),gn=gs.reduce((a,s)=>a+(+s.n||0),0),ok=gs.reduce((a,s)=>a+(+s.ok||0),0),acc=gn?Math.round(ok/gn*100):null;
 const cases=sess.filter(s=>s.m==='case').length,sims=sess.filter(s=>s.m==='sim').length;
 const days=(S.days||[]).filter(inWk).length;
 const wk=ui6Map(S.wk),dks=Object.keys(wk).filter(inWk);const ms=dks.reduce((a,k)=>a+(+ui6Map(wk[k]).ms||0),0);
 const est=!dks.length;const mins=est?Math.round(sess.reduce((a,s)=>a+(s.m==='sim'?600:(+s.n||0)*(UI6_SECS[s.m]||90)),0)/60):Math.round(ms/6e4);
 const agg=f=>{const o={};dks.forEach(d=>{const m=ui6Map(ui6Map(wk[d])[f]);Object.keys(m).forEach(k=>{const x=m[k];if(!Array.isArray(x))return;o[k]=o[k]||[0,0];o[k][0]+=+x[0]||0;o[k][1]+=+x[1]||0;});});return o;};
 const sAgg=agg('s'),kAgg=agg('k');
 const steps=UI6_READSTEPS.filter(k=>sAgg[k]&&sAgg[k][0]>=5).map(k=>[k,sAgg[k][1]/sAgg[k][0],sAgg[k][0]]).sort((a,b)=>a[1]-b[1]).slice(0,2);
 const pats=Object.keys(kAgg).filter(k=>KINDS[k]&&kAgg[k][0]>=3).map(k=>[k,kAgg[k][1]/kAgg[k][0],kAgg[k][0]]).sort((a,b)=>a[1]-b[1]).slice(0,2);
 const live=logList().filter(e=>inWk(isoD(new Date(e.t))));
 const liveK={},liveKey={};live.forEach(e=>{try{const o=interp(ui6Inp(e));if(o.err)return;const k=ui6KindOf(o.r);const lab=k&&KSHORT[k]?KSHORT[k]:o.primKey==='none'?'Normal acid–base':ui6Sent(o.label||'Other');liveK[lab]=(liveK[lab]||0)+1;if(k)liveKey[lab]=k;}catch(err){}});
 const range=ddmmyyyy(st).slice(0,5)+'–'+ddmmyyyy(end);
 const line='Buffer '+(off===1?'last week':off?'week':'this week')+' '+range+': '+days+' day'+(days===1?'':'s')+', '+n+' gas'+(n===1?'':'es')+(acc!=null?' ('+acc+'% right in sessions)':'')+(cases||sims?', '+(cases?cases+' case'+(cases>1?'s':''):'')+(cases&&sims?' · ':'')+(sims?sims+' sim'+(sims>1?'s':''):''):'')+(mins?', '+(est?'about ':'')+mins+' min':'')+(steps[0]?'; weakest step '+STEPNAME[steps[0][0]]+' '+Math.round(steps[0][1]*100)+'%':'')+(live.length?'; '+live.length+' real gas'+(live.length>1?'es':'')+' logged':'')+'.';
 return {off,start:k0,end:k1,range,days,n,ok,gn,acc,cases,sims,mins,est,streak:streak(),steps,pats,live:live.length,liveK,liveKey,line};}
/* what the drill button starts for each read step (startSession honours lvl and kind; focus is passed for ui2 to weight) */
function ui6Drill(c){const lv=S.lvl||1;if(c==='comp')return ['Drill compensation sums',()=>startSession('gym')];
 if(c==='gap')return ['Drill the anion gap',()=>startSession('steps',{lvl:Math.max(3,lv),kind:pick(['hagma','nagma','hag_nag']),focus:c})];
 if(c==='delta')return ['Drill the Δ ratio',()=>startSession('steps',{lvl:Math.max(3,lv),kind:pick(['hag_nag','hag_malk']),focus:c})];
 if(c==='ox')return ['Drill oxygenation',()=>startSession('steps',{lvl:4,focus:c})];
 return ['Practise step by step ('+STEPNAME[c]+')',()=>startSession('steps',{focus:c})];}
const ui6Diff=(a,b)=>{const d=a-b;return d?' <span class="muted" style="font-weight:400;font-size:.75em">'+(d>0?'+':'−')+Math.abs(d)+'</span>':'';};
function weeklyCard(off){const w=weeklyReview(off),p=weeklyReview(w.off+1);
 const head='<div class="btnrow" style="justify-content:space-between"><span class="eyebrow">'+(w.off===1?'Last week':w.off?'Week':'This week')+' · '+esc(w.range)+'</span><div class="btnrow"><div class="seg" role="group" aria-label="Week to review"><button data-woff="0" aria-pressed="'+(w.off===0)+'">This week</button><button data-woff="1" aria-pressed="'+(w.off===1)+'">Last week</button></div><button class="btn small" id="wkCopy">Copy line</button></div></div>';
 if(!w.days&&!w.n&&!w.live)return '<div class="card weekc">'+head+'<p class="note" style="margin-top:8px">'+(w.off?'Nothing recorded that week.':'Your week starts with one gas. Read one, and this card fills in.')+'</p></div>';
 const dr=w.steps[0]?ui6Drill(w.steps[0][0]):null;
 const lk=Object.entries(w.liveK).map(([lab,n])=>{const k=w.liveKey[lab],r=k&&S.kinds&&S.kinds[k],a=r&&r.n>=3?Math.round(r.c/r.n*100):null;return '<li>'+esc(lab)+' × '+n+(a!=null?' · your accuracy '+a+'%':'')+(k&&(a==null||a<70)?' <button class="btn small" data-wkkind="'+esc(k)+'">Drill it</button>':'')+'</li>';}).join('');
 return '<div class="card weekc">'+head+
  '<div class="stats"><div><b>'+w.days+'/7'+ui6Diff(w.days,p.days)+'</b><small>days studied</small></div><div><b>'+w.n+ui6Diff(w.n,p.n)+'</b><small>gases'+(w.acc!=null?' · '+w.acc+'% right':'')+'</small></div><div><b>'+(w.mins?(w.est?'~':'')+w.mins:'—')+'</b><small>'+(w.est?'minutes (estimated)':'active minutes')+'</small></div>'+(w.cases||w.sims?'<div><b>'+w.cases+' · '+w.sims+'</b><small>cases · sims</small></div>':'')+(w.off?'':'<div><b>'+w.streak+'</b><small>day streak</small></div>')+'</div>'+
  '<div class="grid2" style="margin-top:12px"><div><h4>Weakest steps '+(w.off?'that week':'this week')+'</h4>'+(w.steps.length?'<ul class="nx">'+w.steps.map(s=>'<li>'+esc(STEPNAME[s[0]])+' · '+Math.round(s[1]*100)+'% of '+s[2]+'</li>').join('')+'</ul>':'<p class="note">Fewer than 5 attempts at any step.</p>')+
  '<h4>Weakest patterns '+(w.off?'that week':'this week')+'</h4>'+(w.pats.length?'<ul class="nx">'+w.pats.map(p=>'<li>'+esc(KSHORT[p[0]]||p[0])+' · '+Math.round(p[1]*100)+'% of '+p[2]+'</li>').join('')+'</ul>':'<p class="note">Fewer than 3 reads of any pattern.</p>')+'</div>'+
  '<div><h4>Your real gases '+(w.off?'that week':'this week')+'</h4>'+(w.live?'<ul class="nx">'+lk+'</ul><p class="note">Accuracy is from your practice of the same pattern: drill what you actually meet.</p>':'<p class="note">None logged. Save real gases from the interpreter to compare them with your practice.</p>')+'</div></div>'+
  (dr?'<div class="btnrow" style="margin-top:12px"><button class="btn small primary" id="wkDrill">'+esc(dr[0])+'</button></div>':'')+
  '<p class="note" style="margin-top:8px">This line goes to Citrus with your status: <span class="mono">'+esc(w.line)+'</span></p></div>';}
function ui6WeekMount(el){const old=el.querySelector('.weekc');const off=UI6_WOFF==null?ui6AutoOff():UI6_WOFF;const d=document.createElement('div');d.innerHTML=weeklyCard(off);const card=d.firstChild;
 if(old)old.replaceWith(card);else{const heat=el.querySelector('.heat');const hc=heat&&heat.closest('.card');const h=el.querySelector('.view-head');if(hc)hc.after(card);else if(h)h.after(card);else return;}
 card.querySelectorAll('[data-woff]').forEach(b=>b.onclick=()=>{UI6_WOFF=+b.dataset.woff;ui6WeekMount(el);const n=el.querySelector('.weekc [data-woff="'+UI6_WOFF+'"]');if(n)n.focus();});
 const c=card.querySelector('#wkCopy');if(c)c.onclick=e=>copyText(weeklyReview(off).line,e.currentTarget);
 const dbt=card.querySelector('#wkDrill');if(dbt)dbt.onclick=()=>{const w=weeklyReview(off);if(w.steps[0])ui6Drill(w.steps[0][0])[1]();};
 card.querySelectorAll('[data-wkkind]').forEach(b=>b.onclick=()=>startSession('steps',{kind:b.dataset.wkkind}));
 /* T01-12: showing the reviewed week on its review day (Sunday = this week, Monday = the week just ended) ticks Today's 'Weekly review' */
 try{const dw=new Date().getDay();if((dw===0||dw===1)&&off===(dw===1?1:0)&&typeof ui10WeekKey==='function'){const k=ui10WeekKey();S.ui=ui6Map(S.ui);if(S.ui.weekly!==k){S.ui.weekly=k;save();}}}catch(e){}}
if(RENDER.progress){const _rp=RENDER.progress;RENDER.progress=function(){_rp();const el=$('v-progress');if(el)ui6WeekMount(el);};}
if(typeof hubStatus==='function'){const _hs=hubStatus;hubStatus=function(){const s=_hs();try{const w=weeklyReview(),r=ui6AutoOff()?weeklyReview(1):w;s.extra=Object.assign({},s.extra,{weekly:r.line,weekGases:w.n,weekDays:w.days,liveGases:w.live,weekMinutes:w.mins});const dw=new Date().getDay();if(dw===0||dw===1)s.pending=(s.pending||[]).concat(['Weekly review ready']);}catch(e){}return s;};}
