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
  first:['Airway and breathing first; naloxone if opioid toxicity','At risk of hypercapnia: target SpO₂ 88–92%','COPD with pH below 7.35 and PaCO₂ above 45 mmHg after optimal medical treatment: start NIV','Failing NIV or falling consciousness: escalate to intubation'],
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
  dx:['ARDS if bilateral opacities, within a week of a trigger, not fully explained by heart failure, with PEEP ≥ 5','Pneumonia, pulmonary oedema, atelectasis'],
  tests:['Chest imaging','Echo or POCUS for cardiac causes','Repeat P/F on a known FiO₂ and PEEP'],
  first:['Ventilated: tidal volume 6 mL/kg predicted body weight, plateau pressure ≤ 30 cmH₂O','P/F below 150: consider prone positioning for at least 12 h a day'],
  pit:['P/F changes with PEEP and FiO₂; record both','The Berlin bands need PEEP ≥ 5'],
  src:['berlin12','ardsnet00','fan17','guerin13']},
 co:{t:'Carboxyhaemoglobin raised',
  dx:['Carbon monoxide: fires, heaters, engines','Smokers can run COHb up to about 10%'],
  tests:['ECG and troponin','Consider cyanide in smoke inhalation with high lactate'],
  first:['100% oxygen via non-rebreather until symptoms settle and COHb is low','Discuss hyperbaric oxygen for loss of consciousness, neurological signs, pregnancy or very high COHb'],
  pit:['Pulse oximetry reads COHb as oxyhaemoglobin','The PaO₂ is normal'],
  src:['weaver09','toff07']},
 methb:{t:'Methaemoglobin raised',
  dx:['Oxidant drugs: dapsone, benzocaine, lidocaine, nitrites, primaquine','Congenital (rare)'],
  tests:['Co-oximetry trend','G6PD status before methylene blue if possible'],
  first:['Symptomatic or above about 20–30%: methylene blue 1–2 mg/kg IV','Stop the oxidant'],
  pit:['SpO₂ settles near 85% regardless of the true value','Methylene blue may not work, and may cause haemolysis, in G6PD deficiency'],
  src:['wright99','toff07']},
 ven:{t:'Venous sample',
  dx:[],tests:['An arterial gas if CO₂ or oxygenation drives the decision'],first:[],
  pit:['Venous PO₂ says nothing about lung function','Venous PCO₂ is a screen: ≤ 45 mmHg makes arterial hypercapnia unlikely, but agreement is poor in shock'],
  src:['byrne14']}
};
function nextKeys(o,inp){const k=[];const r=o.r||{};
 if(r.mac==='HAGMA')k.push('hagma');else if(r.mac==='NAGMA')k.push('nagma');else if(r.mac==='HN')k.push('hn','hagma');else if(r.mac)k.push('hagma');
 if(r.malk)k.push('malk');if(r.rac)k.push('rac');if(r.ralk)k.push('ralk');
 if(o.ox&&!o.ven){if(o.ox.cat==='lung'||o.ox.cat==='lungmild')k.push('lung');else if(o.ox.cat==='hv')k.push('hv');else if(o.ox.cat==='pf')k.push('pf');}
 if(inp.cohb!=null&&inp.cohb>=10)k.push('co');if(inp.methb!=null&&inp.methb>=10)k.push('methb');
 if(o.ven)k.push('ven');return [...new Set(k)];}
function nextCard(keys){if(!keys.length)return '<div class="card"><span class="eyebrow">Next steps</span><p class="note" style="margin-top:6px">No acid–base disorder to work up. Read the gas in context.</p></div>';
 const li=a=>a&&a.length?'<ul class="nx">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'';
 const src=[...new Set(keys.flatMap(k=>NEXT[k].src))].filter(i=>SRC[i]);
 return '<div class="card nextc"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">Next steps · for teaching</span></div>'+
  keys.map((k,i)=>{const n=NEXT[k];return '<details'+(i===0?' open':'')+'><summary><b>'+esc(n.t)+'</b></summary>'+
   (n.dx.length?'<h4>Differential causes</h4>'+li(n.dx):'')+(n.tests.length?'<h4>Tests to confirm</h4>'+li(n.tests):'')+(n.first.length?'<h4>First management steps</h4>'+li(n.first):'')+(n.pit.length?'<h4>Pitfalls</h4>'+li(n.pit):'')+'</details>';}).join('')+
  '<details><summary><span class="eyebrow">Sources</span></summary><ol class="srcl">'+src.map(i=>'<li>'+esc(SRC[i][1])+'</li>').join('')+'</ol></details>'+
  '<p class="teachonly">'+esc(TEACH_ONLY)+'</p></div>';}

/* ---- the gas log: real gases from the user's day, kept as typed and synced like progress ---- */
const LOG_KEYS=['pH','pco2','po2','fio2','hco3','na','k','cl','alb','lac','glu','urea','osm','bhb','spo2','cohb','methb','age'];
function logList(){return (S.gaslog||[]).filter(x=>!x.del).sort((a,b)=>(a.t||'')<(b.t||'')?1:-1);}
function logAdd(inp,o,note,tag){S.gaslog=S.gaslog||[];const v={};LOG_KEYS.forEach(k=>{if(inp[k]!=null)v[k]=inp[k];});
 const e={id:'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:new Date().toISOString(),u:Date.now(),sample:inp.sample==='v'?'v':'a',v,label:o.label,line:o.line,note:note||'',tag:tag||''};
 S.gaslog.push(e);save();return e;}
function logDel(id){const e=(S.gaslog||[]).find(x=>x.id===id);if(!e)return;Object.keys(e).forEach(k=>{if(!['id','t'].includes(k))delete e[k];});e.del=true;e.u=Date.now();save();}
function mergeLog(a,b){const m={};[...(a||[]),...(b||[])].forEach(x=>{if(!x||!x.id)return;const c=m[x.id];if(!c||x.del&&!c.del||(+x.u||0)>(+c.u||0)&&!c.del)m[x.id]=x;});return Object.values(m).sort((x,y)=>(x.t||'')<(y.t||'')?-1:1);}
if(typeof mergeStates==='function'){const _ms=mergeStates;mergeStates=function(A,B){const o=_ms(A,B);if((+A.epoch||0)===(+B.epoch||0)){o.gaslog=mergeLog(A.gaslog,B.gaslog);o.speed=mergeMap(A.speed,B.speed,pickRec);o.cases=mergeMap(A.cases,B.cases,pickRec);o.cmist=mergeLog(A.cmist,B.cmist);o.qmiss=mergeMap(A.qmiss,B.qmiss,maxN);}return o;};}
const IDLIKE=/\b\d{6,}\b|\b(mrn|id|file|nid|iqama|passport)\s*[:#]?\s*\d+/i;
function privacyWarn(s){return IDLIKE.test(s||'')?'This looks like an ID number. Keep names and IDs out: use a bed number or a short tag.':'';}
const fmtT=t=>{const d=new Date(t);return ddmmyyyy(d)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
function saveSheet(inp,o){const sc=document.createElement('div');sc.className='sheet-scrim on';const tags=[...new Set(logList().map(x=>x.tag).filter(Boolean))].slice(0,8);
 sc.innerHTML='<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="lgT"><h2 id="lgT">Save to the gas log</h2><p class="privacy"><b>No names or IDs.</b> Use a bed number or a short tag. The log syncs to your Google Drive with your progress.</p>'+
  '<label class="fld"><span>Tag (groups serial gases for a trend)</span><input id="lgTag" maxlength="40" placeholder="e.g. Bed 4 DKA" list="lgTags"><datalist id="lgTags">'+tags.map(t=>'<option value="'+esc(t)+'">').join('')+'</datalist></label>'+
  '<label class="fld"><span>Note</span><textarea id="lgNote" rows="3" maxlength="600" placeholder="Context, what you thought, what happened"></textarea></label><p id="lgWarn" class="warnline" role="status"></p>'+
  '<div class="btnrow"><button class="btn primary" id="lgOk">Save</button><button class="btn" id="lgNo">Cancel</button></div></div>';
 document.body.appendChild(sc);const close=()=>sc.remove();$('lgNo').onclick=close;sc.onclick=e=>{if(e.target===sc)close();};
 const chk=()=>{$('lgWarn').textContent=privacyWarn($('lgTag').value+' '+$('lgNote').value);};$('lgTag').oninput=chk;$('lgNote').oninput=chk;
 $('lgOk').onclick=()=>{logAdd(inp,o,$('lgNote').value.trim(),$('lgTag').value.trim());close();toast('Saved to the gas log');};setTimeout(()=>$('lgTag').focus(),30);}
function shareRead(line,btn){if(navigator.share){navigator.share({text:line}).catch(()=>{});}else copyText(line,btn);}

/* add next steps, save, share and the banner to the interpreter read */
if(typeof runInterp==='function'){const _ri=runInterp;runInterp=function(){_ri();const out=$('iOut');if(!out||!out.querySelector('.bigread'))return;
 const inp=Object.assign({},IV);if(inp.fio2!=null&&inp.fio2>1)inp.fio2=inp.fio2/100;if(inp.hco3==null)inp.hco3=r1(hFrom(inp.pH,inp.pco2));const o=interp(inp);if(o.err)return;
 const row=document.createElement('div');row.className='btnrow';row.innerHTML='<button class="btn small" id="iSave">'+ic('check')+'Save to log</button><button class="btn small" id="iShare">Share line</button>'+(logList().length?'<button class="btn small" id="iLog">Open log</button>':'');
 const rc=out.querySelector('.card.raised');if(rc)rc.appendChild(row);
 const nc=document.createElement('div');nc.innerHTML=nextCard(nextKeys(o,inp));out.appendChild(nc.firstChild);
 $('iSave').onclick=()=>saveSheet(inp,o);$('iShare').onclick=e=>shareRead(o.line,e.currentTarget);if($('iLog'))$('iLog').onclick=()=>openTool('log');};}

/* ---- trend chart: one tag, several gases ---- */
const TREND_SERIES=[['pH','pH',7.35,7.45],['pco2','PCO₂',35,45],['hco3','HCO₃⁻',22,26],['lac','Lactate',0,2],['ag','Anion gap',null,null],['po2','PO₂',80,100]];
function trendData(es){return es.slice().sort((a,b)=>a.t<b.t?-1:1).map(e=>{const v=Object.assign({sample:e.sample},e.v);if(v.hco3==null&&v.pH!=null&&v.pco2!=null)v.hco3=r1(hFrom(v.pH,v.pco2));let o={};try{o=interp(v)||{};}catch(err){}return {t:e.t,v,ag:o.agc!=null?o.agc:o.ag,label:o.label||e.label};});}
function sparkSVG(pts,lo,hi){const ys=pts.map(p=>p[1]);let mn=Math.min(...ys,lo==null?Infinity:lo),mx=Math.max(...ys,hi==null?-Infinity:hi);if(mn===mx){mn-=1;mx+=1;}const W=260,H=56,px=i=>pts.length<2?W/2:8+i*(W-16)/(pts.length-1),py=y=>H-6-(y-mn)/(mx-mn)*(H-12);
 const band=lo!=null&&hi!=null?'<rect x="0" y="'+py(hi)+'" width="'+W+'" height="'+Math.max(1,py(lo)-py(hi))+'" class="tband"/>':'';
 return '<svg viewBox="0 0 '+W+' '+H+'" class="spark" role="img" aria-label="trend">'+band+'<polyline points="'+pts.map((p,i)=>px(i)+','+py(p[1])).join(' ')+'" class="tline"/>'+pts.map((p,i)=>'<circle cx="'+px(i)+'" cy="'+py(p[1])+'" r="3.5" class="tdot"/>').join('')+'</svg>';}
function trendHTML(tag){const es=logList().filter(e=>e.tag===tag);if(es.length<2)return '<p class="note">Save two or more gases with the tag "'+esc(tag)+'" to see a trend.</p>';
 const d=trendData(es);const rows=TREND_SERIES.map(([k,lab,lo,hi])=>{const pts=d.map((x,i)=>[i,k==='ag'?x.ag:x.v[k]]).filter(p=>p[1]!=null&&isFinite(p[1]));if(pts.length<2)return '';
  const first=pts[0][1],last=pts[pts.length-1][1],dl=last-first,f=k==='pH'?2:1,show=v=>k==='pco2'||k==='po2'?P(v):(+v).toFixed(f);
  return '<div class="trow"><div><b>'+lab+'</b><small>'+show(first)+' → '+show(last)+' ('+(dl>=0?'+':'')+(k==='pco2'||k==='po2'?P(dl):dl.toFixed(f))+')</small></div>'+sparkSVG(pts,lo,hi)+'</div>';}).join('');
 return '<div class="trend">'+rows+'</div><ol class="tlist">'+d.map(x=>'<li><span class="mono">'+fmtT(x.t)+'</span> '+esc(x.label||'')+'</li>').join('')+'</ol>'+
  '<p class="note">'+trendSay(d)+'</p>';}
function trendSay(d){const a=d[0],b=d[d.length-1],s=[];if(a.v.pH!=null&&b.v.pH!=null){const dp=b.v.pH-a.v.pH;s.push(Math.abs(dp)<0.03?'pH is about the same':dp>0?'pH is rising':'pH is falling');}
 if(a.ag!=null&&b.ag!=null){const dg=b.ag-a.ag;if(Math.abs(dg)>=3)s.push('the anion gap is '+(dg<0?'closing':'widening'));}
 if(a.v.lac!=null&&b.v.lac!=null&&a.v.lac>0){const pc=(a.v.lac-b.v.lac)/a.v.lac*100;s.push('lactate '+(pc>=10?'cleared '+Math.round(pc)+'%':pc<=-10?'rose '+Math.round(-pc)+'%':'is flat'));}
 if(a.v.cl!=null&&b.v.cl!=null&&b.v.cl-a.v.cl>=4&&a.ag!=null&&b.ag!=null&&b.ag<a.ag)s.push('chloride rose as the gap closed, the usual hyperchloraemic phase of recovery');
 return s.length?esc(s.join('; ').replace(/^[a-oq-z]/,c=>c.toUpperCase())+'.'):'Too few shared values to describe the trend.';}

/* ---- the log tool ---- */
TOOLS.splice(1,0,['log','Gas log','Real gases from your day, kept as typed, with trends over serial gases. No names or IDs.','steps']);
TOOLFN.log=b=>{const draw=()=>{const L2=logList();const tags=[...new Set(L2.map(x=>x.tag).filter(Boolean))];const f=b.dataset.tag||'';const show=f?L2.filter(x=>x.tag===f):L2;
 b.innerHTML='<p class="privacy"><b>No names or IDs.</b> Everything here is kept as you typed it and syncs with your progress.</p>'+
  (L2.length?'<div class="card"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">'+L2.length+' gas'+(L2.length>1?'es':'')+(tags.length?' · '+tags.length+' tag'+(tags.length>1?'s':''):'')+'</span><div class="btnrow"><button class="btn small" id="lgCopy">Copy all</button><button class="btn small" id="lgNew">Add a gas</button></div></div>'+
   (tags.length?'<div class="seg wrap" role="group" aria-label="Filter by tag" style="margin-top:10px"><button data-tag="" aria-pressed="'+!f+'">All</button>'+tags.map(t=>'<button data-tag="'+esc(t)+'" aria-pressed="'+(f===t)+'">'+esc(t)+'</button>').join('')+'</div>':'')+'</div>'+
   (f?'<div class="card"><span class="eyebrow">Trend · '+esc(f)+'</span>'+trendHTML(f)+'</div>':'')+
   '<div class="loglist">'+show.map(e=>'<div class="card logi"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">'+fmtT(e.t)+(e.tag?' · '+esc(e.tag):'')+' · '+(e.sample==='v'?'VBG':'ABG')+'</span><div class="btnrow"><button class="btn small" data-open="'+e.id+'">Open</button><button class="btn small" data-share="'+e.id+'">Share</button><button class="btn small ghost" data-del="'+e.id+'" aria-label="Delete this gas">Delete</button></div></div><b>'+esc(e.label||'')+'</b><p class="line mono" style="font-size:12.5px">'+esc(e.line||'')+'</p>'+(e.note?'<p class="note">'+esc(e.note)+'</p>':'')+'</div>').join('')+'</div>'
  :'<div class="empty"><b>No gases yet</b><span>Read a gas in the interpreter, then tap "Save to log". Tag serial gases the same way to see a trend.</span><button class="btn primary" id="lgNew">Open the interpreter</button></div>');
 b.querySelectorAll('[data-tag]').forEach(x=>x.onclick=()=>{b.dataset.tag=x.dataset.tag;draw();});
 b.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>{const e=L2.find(y=>y.id===x.dataset.open);if(!e)return;openTool('interp');setTimeout(()=>{if(typeof loadInterp==='function'){loadInterp(Object.assign({sample:e.sample},e.v));buildForm();runInterp();}},60);});
 b.querySelectorAll('[data-share]').forEach(x=>x.onclick=()=>{const e=L2.find(y=>y.id===x.dataset.share);if(e)shareRead(e.line,x);});
 b.querySelectorAll('[data-del]').forEach(x=>{let armed=false;x.onclick=()=>{if(!armed){armed=true;x.textContent='Tap again to delete';setTimeout(()=>{armed=false;if(x.isConnected)x.textContent='Delete';},2500);return;}logDel(x.dataset.del);draw();};});
 if($('lgNew'))$('lgNew').onclick=()=>openTool('interp');
 if($('lgCopy'))$('lgCopy').onclick=e=>copyText(show.map(x=>fmtT(x.t)+(x.tag?' ['+x.tag+']':'')+' '+x.line+(x.note?' Note: '+x.note:'')).join('\n'),e.currentTarget);};draw();};

/* ---- teaching-only banner on every tool and model ---- */
if(RENDER.tool){const _rt=RENDER.tool;RENDER.tool=function(id){_rt(id);const el=$('v-tool');if(!el||el.querySelector('.teachbar'))return;const h=el.querySelector('.view-head');if(h){const p=document.createElement('p');p.className='teachbar';p.textContent=TEACH_ONLY;h.after(p);}};}

/* ---- weekly review ---- */
function weekStart(d){d=new Date(d||Date.now());const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);d.setHours(0,0,0,0);return d;}
function weeklyReview(){const st=weekStart(),k0=isoD(st),end=new Date(st);end.setDate(st.getDate()+6);const k1=isoD(end);
 const inWk=k=>k>=k0&&k<=k1;const sess=(S.sess||[]).filter(s=>inWk(s.d));const n=sess.reduce((a,s)=>a+(+s.n||0),0),ok=sess.reduce((a,s)=>a+(+s.ok||0),0);
 const days=(S.days||[]).filter(inWk).length;const mins=Math.round(n*1.2);
 const steps=Object.keys(STEPNAME).map(k=>[k,stepAcc(k)]).filter(x=>x[1]!=null).sort((a,b)=>a[1]-b[1]).slice(0,2);
 const pats=Object.keys(S.kinds||{}).map(k=>{const r=S.kinds[k];return [k,r&&r.n?r.c/r.n:null,r&&r.n];}).filter(x=>x[1]!=null&&x[2]>=3).sort((a,b)=>a[1]-b[1]).slice(0,2);
 const live=logList().filter(e=>inWk(isoD(new Date(e.t))));
 const liveK={};live.forEach(e=>{const v=Object.assign({sample:e.sample},e.v);if(v.hco3==null&&v.pH!=null&&v.pco2!=null)v.hco3=r1(hFrom(v.pH,v.pco2));try{const o=interp(v);const k=o.primKey==='mac'?(o.r.mac==='NAGMA'?'NAGMA':o.r.mac==='HN'?'HAGMA + NAGMA':'HAGMA'):({malk:'metabolic alkalosis',rac:'respiratory acidosis',ralk:'respiratory alkalosis',two:'mixed',none:'normal'})[o.primKey]||o.primKey;liveK[k]=(liveK[k]||0)+1;}catch(err){}});
 const line='Buffer week '+ddmmyyyy(st)+': '+days+' day'+(days===1?'':'s')+', '+n+' gases ('+(n?Math.round(ok/n*100):0)+'%), about '+mins+' min'+(steps[0]?'; weakest step '+STEPNAME[steps[0][0]]+' '+Math.round(steps[0][1]*100)+'%':'')+(live.length?'; '+live.length+' real gas'+(live.length>1?'es':'')+' logged':'')+'.';
 return {start:k0,end:k1,days,n,ok,mins,streak:streak(),steps,pats,live:live.length,liveK,line};}
function weeklyCard(){const w=weeklyReview();const kn=k=>(KSHORT&&KSHORT[k])||k;
 return '<div class="card weekc"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">This week · from '+ddmmyyyy(new Date(w.start+'T00:00'))+'</span><button class="btn small" id="wkCopy">Copy line</button></div>'+
  '<div class="stats"><div><b>'+w.days+'/7</b><small>days studied</small></div><div><b>'+w.n+'</b><small>gases · '+(w.n?Math.round(w.ok/w.n*100):0)+'%</small></div><div><b>~'+w.mins+'</b><small>minutes</small></div><div><b>'+w.streak+'</b><small>day streak</small></div></div>'+
  '<div class="grid2" style="margin-top:12px"><div><h4>Weakest steps</h4>'+(w.steps.length?'<ul class="nx">'+w.steps.map(s=>'<li>'+esc(STEPNAME[s[0]])+' · '+Math.round(s[1]*100)+'%</li>').join('')+'</ul>':'<p class="note">Not enough attempts yet.</p>')+
  '<h4>Weakest patterns</h4>'+(w.pats.length?'<ul class="nx">'+w.pats.map(p=>'<li>'+esc(kn(p[0]))+' · '+Math.round(p[1]*100)+'%</li>').join('')+'</ul>':'<p class="note">Not enough attempts yet.</p>')+'</div>'+
  '<div><h4>Your real gases this week</h4>'+(w.live?'<ul class="nx">'+Object.entries(w.liveK).map(([k,n])=>'<li>'+esc(k)+' × '+n+'</li>').join('')+'</ul><p class="note">Compare these with your weakest patterns: practise what you actually meet.</p>':'<p class="note">None logged. Save real gases from the interpreter to compare them with your practice.</p>')+'</div></div>'+
  (w.steps[0]?'<div class="btnrow" style="margin-top:12px"><button class="btn small primary" id="wkDrill">Drill '+esc(STEPNAME[w.steps[0][0]])+'</button></div>':'')+
  '<p class="note" style="margin-top:8px">This line goes to Citrus with your status: <span class="mono">'+esc(w.line)+'</span></p></div>';}
if(RENDER.progress){const _rp=RENDER.progress;RENDER.progress=function(){_rp();const el=$('v-progress');const h=el&&el.querySelector('.view-head');if(!h)return;const d=document.createElement('div');d.innerHTML=weeklyCard();h.after(d.firstChild);
 if($('wkCopy'))$('wkCopy').onclick=e=>copyText(weeklyReview().line,e.currentTarget);if($('wkDrill'))$('wkDrill').onclick=()=>{const w=weeklyReview();startSession(w.steps[0][0]==='comp'?'gym':'steps');};};}
if(typeof hubStatus==='function'){const _hs=hubStatus;hubStatus=function(){const s=_hs();try{const w=weeklyReview();s.extra=Object.assign({},s.extra,{weekly:w.line,weekGases:w.n,weekDays:w.days,liveGases:w.live});if(new Date().getDay()===0||new Date().getDay()===1)s.pending=(s.pending||[]).concat(['Weekly review ready']);}catch(e){}return s;};}
