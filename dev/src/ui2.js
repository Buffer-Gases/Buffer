/* ================= PRACTICE ================= */
const MODES={
 today:{t:'Mixed session',d:'Step by step on mixed cases. Pulls in what is due and leans on your weakest step.',icon:'play'},
 steps:{t:'Step by step',d:'pH → primary → compensation → gap → Δ ratio → read → cause → oxygen, each marked with its arithmetic.',icon:'steps'},
 quick:{t:'Quick read',d:'Name the read, the cause and the oxygenation in one go.',icon:'bolt'},
 fit:{t:'Which gas fits?',d:'Read the patient, predict the gas, then pick it from four.',icon:'fit'},
 reflex:{t:'Reflex',d:'Timed. Automatic = 90% right with a median under 8 s.',icon:'timer'},
 gym:{t:'Compensation gym',d:'Rapid sums for the step most clinicians miss.',icon:'gym'},
 mist:{t:'Revisit mistakes',d:'The gases you got wrong, until every step is right.',icon:'redo'},
 due:{t:'Due review',d:'Patterns whose spaced review is due.',icon:'due'},
 gotd:{t:'Gas of the day',d:'One gas, the same for everyone today.',icon:'steps'},
 boss:{t:'Boss fight',d:'Module questions against the clock.',icon:'boss'},
 final:{t:'Final boss',d:'Twelve full reads in ten minutes. Ten right to pass.',icon:'boss'}
};
const LVLS=[[1,'Basics','single disorders'],[2,'Compensation','plus mixed disorders'],[3,'Gaps','plus anion gap and Δ ratio'],[4,'Full read','plus oxygenation']];
/* ui2 helpers: quiet mode, case-safe lowercasing, live region, mm:ss, own CSS */
const ui2Quiet=()=>S.quiet!==false;
function ui2Low(s){s=String(s==null?'':s);return /^(pH|Δ|[A-Z]{2,})/.test(s)?s:s.charAt(0).toLowerCase()+s.slice(1);}
function ui2Live(msg){if(typeof announce==='function'){announce(String(msg||'').replace(/<[^>]+>/g,''));return;}let el=document.getElementById('sLive');if(!el){el=document.createElement('div');el.id='sLive';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.className='ui2-sr';document.body.appendChild(el);}el.textContent='';setTimeout(()=>{el.textContent=String(msg||'').replace(/<[^>]+>/g,'');},40);}
function ui2Clock(ms){const s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function ui2Plain(h){return String(h||'').replace(/<[^>]+>/g,'');}
(function(){try{const st=document.createElement('style');st.id='ui2css';st.textContent=
 '.ui2-sr{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'+
 '.ui2-strip{display:none}'+
 '@media (max-width:860px){.ui2-strip{display:flex;flex-wrap:wrap;gap:2px 12px;position:sticky;top:calc(env(safe-area-inset-top,0px) + var(--hdr,62px) + 60px);z-index:6;margin:-6px -6px 0;padding:6px 10px;background:var(--paper);color:var(--paper-ink);border:2px solid var(--paper-line);box-shadow:0 2px 0 var(--bevd);font:600 .8rem/1.35 var(--f-mono)}.ui2-strip b{font-weight:800}.ui2-strip .l{color:var(--muted);font-weight:500}}'+
 '.qblock.assist .qn{background:var(--warn);color:var(--bg);border-color:var(--warn)}.why.as{border-color:var(--warn)}'+
 '.ui2-keys{font-size:.78rem;color:var(--muted);text-align:center;margin:14px 0 0}@media (hover:none){.ui2-keys{display:none}}'+
 '.caselist button.ui2-row{all:unset;cursor:pointer;display:contents}'+
 '#v-session h3[tabindex="-1"]:focus,#v-session .eyebrow[tabindex="-1"]:focus,#v-session .gymq[tabindex="-1"]:focus{outline:none}'+
 '.ui2-full summary{cursor:pointer;font-weight:700;padding:12px 0}';
 document.head.appendChild(st);}catch(e){}})();
function ui2NextDue(){let m=0;Object.keys(KINDS).forEach(k=>{const s=S.kinds[k];if(s&&s.due&&(!m||s.due<m))m=s.due;});return m;}
/* session title with Quiet-mode words at source (qw in ui1.js) */
function ui2Title(){if(SS.title)return SS.title;if(SS.mode==='boss')return qw('Boss','Module check')+' · '+MBYID[SS.mod].t;return SS.mode==='final'?qw(MODES.final.t,'Final check'):MODES[SS.mode].t;}
function ui2ResumeHTML(){if(!SS||SS.done||!SS.paused)return '';const t=ui2Title();
 return '<div class="due"><span class="mono-mark">'+ic('play')+'</span><p><b>Unfinished: '+esc(t)+'</b> <span class="muted">'+SS.res.length+' of '+SS.n+' done.</span></p><div class="btnrow"><button class="btn small primary" id="pResume">Resume</button><button class="btn small ghost" id="pEnd">End</button></div></div>';}
RENDER.practice=function(){const el=$('v-practice');const mist=(S.mist||[]).length;const w=weakestStep();const rb=reflexStatus();const due=dueKinds().length;
 const MAIN=['today','steps','quick','fit','reflex','gym'].concat(mist?['mist']:[],['gotd'],due?[]:['due']);
 const DEEP=[['scen','Shifts','Six branching scenarios set in your clinic, camp and ER. Wrong turns detour, then rejoin.','scen',Object.keys(S.scen||{}).length+'/'+SCENARIOS.length+' done'],['teach','Teach it back','Explain one idea in writing, then grade yourself against the key points.','teach',Object.keys(S.teach||{}).length+' explained'],['est','Gas sense','Estimate the pH, the expected PCO₂ or the gap on a slider before you calculate.','est',(S.est&&S.est.n?Math.round(S.est.c/S.est.n*100)+'% close':'number sense')],['flash','Number flash','Every key number as a card. Swipe right if you knew it, left if not.','flash',FLASH.length+' cards'],['serial','Serial gases','Watch DKA, COPD, sepsis and salicylate change over hours: better or worse?','serial',Object.keys(S.serial||{}).length+'/'+SERIES.length+' done'],['final','Final boss','Twelve full reads in ten minutes. '+(ui2Quiet()?'Ten right passes the final check.':'Ten right earns the Native reader badge.'),'boss',S.badges&&S.badges.native?(ui2Quiet()?'passed ':'won ')+S.badges.native:(ui2Quiet()?'not yet passed':'not yet won')]];
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+S.read+' gases read · '+(due?due+' due':'nothing due')+'</span><h1>Practice</h1><p>Every session shuffles disorders together and marks each step.</p></div>'+levelPill()+'</div>'+
 '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div class="btnrow" style="justify-content:space-between;gap:14px"><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow">Difficulty</span><div class="seg" id="pLvl">'+LVLS.map(l=>'<button data-v="'+l[0]+'" aria-pressed="'+(S.lvl===l[0])+'" data-hint="'+l[1]+'|Level '+l[0]+': '+l[2]+'.">'+l[1]+'</button>').join('')+'</div></div><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow">Gases per session</span><div class="seg" id="pLen">'+[5,10,20].map(n=>'<button data-n="'+n+'" aria-pressed="'+(S.sessLen===n)+'">'+n+'</button>').join('')+'</div></div></div><p class="note">'+esc(LVLS[S.lvl-1][1]+': '+LVLS[S.lvl-1][2]+'.')+'</p></div>'+
 ui2ResumeHTML()+(due?'<div class="due"><span class="mono-mark">'+ic('due')+'</span><p><b>'+due+' pattern'+(due>1?'s':'')+' due.</b> <span class="muted">Clear them first; spacing is what makes it stick.</span></p><button class="btn small primary" data-start="due">Review '+Math.min(due,S.sessLen)+'</button></div>':'')+
 '<div class="shelf"><h2>Gas practice <small>pick one</small></h2><div class="tiles">'+MAIN.map(m=>'<button class="tile'+(m==='today'?' on':'')+'" data-start="'+m+'"'+(m==='due'&&!due?' aria-disabled="true" style="opacity:.6"':'')+'><span class="mono-mark">'+ic(MODES[m].icon)+'</span><span><small class="meta">'+MODS_META(m,w,mist,rb)+'</small><b>'+MODES[m].t+'</b><span class="d">'+MODES[m].d+'</span></span></button>').join('')+'</div></div>'+
 '<div class="shelf"><h2>Go deeper <small>reasoning, explaining, number sense</small></h2><div class="tiles">'+DEEP.map(d=>'<button class="tile" data-deep="'+d[0]+'"><span class="mono-mark">'+ic(d[3])+'</span><span><small class="meta">'+esc(d[4])+'</small><b>'+d[1]+'</b><span class="d">'+d[2]+'</span></span></button>').join('')+'</div></div>'+
 (w?'<p class="note">Weakest step lately: <b>'+ui2Low(STEPNAME[w.c])+'</b> ('+Math.round(w.a*100)+'%). Full breakdown in <button class="linkbtn" data-go="progress">Progress</button>.</p>':'');
 el.querySelectorAll('#pLvl button').forEach(b=>b.onclick=()=>{S.lvl=+b.dataset.v;save();RENDER.practice();});
 el.querySelectorAll('#pLen button').forEach(b=>b.onclick=()=>{S.sessLen=+b.dataset.n;save();RENDER.practice();});
 el.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{if(b.dataset.start==='due'&&!dueKinds().length){const nd=ui2NextDue();toast(nd?'Nothing due. Next review '+ddmmyyyy(new Date(nd))+'.':'Nothing due yet. Read a few gases first.');return;}startSession(b.dataset.start);});
 if($('pResume'))$('pResume').onclick=()=>go('session');
 if($('pEnd'))$('pEnd').onclick=()=>{if(SS&&SS.res.length){SS.paused=false;go('session');finishSession(true);}else{ui2Close();RENDER.practice();}};
 el.querySelectorAll('[data-deep]').forEach(b=>b.onclick=()=>{const d=b.dataset.deep;if(d==='final')startSession('final');else if(d==='scen')go('scen');else go(d);});};
function MODS_META(m,w,mist,rb){if(m==='today')return dueKinds().length?dueKinds().length+' due · '+S.sessLen+' gases':S.sessLen+' gases';if(m==='steps'||m==='quick')return S.sessLen+' gases · '+LVLS[S.lvl-1][1];if(m==='fit')return S.sessLen+' patients';if(m==='reflex')return '20 gases · '+(rb?'automatic to L'+rb:'level '+(S.reflex.lvl||1));if(m==='gym')return '10 sums'+(stepAcc('comp')!=null?' · compensation '+Math.round(stepAcc('comp')*100)+'%':'');if(m==='gotd')return S.ui&&S.ui.gotd===today()?'done today ✓':'1 gas · full read';if(m==='due'){const nd=ui2NextDue();return dueKinds().length?dueKinds().length+' due':nd?'next due '+ddmmyyyy(new Date(nd)):'nothing due yet';}return mist+' saved';}

/* ---------- case generation helpers ---------- */
function safeCase(kind,lvl,opt){for(let i=0;i<4;i++){const c=genCase(kind,lvl,opt);if(c)return c;}
 for(let i=0;i<20;i++){const c=genCase(pick(kindsFor(lvl)),lvl,{strict:opt&&opt.strict});if(c)return c;}
 const r=REFCASES[1];const c=Object.assign({kind:'hagma',cause:'dka',vig:'Young adult with diabetes, vomiting and deep breathing',fio2:0.21,po2:100,age:30,k:4.5,lac:1.2,glu:22},r.i);c.o=interp(c);c.label=buildLabel(c.o.r,lvl);return c;}
function chooseKind(sess){const ks=kindsFor(sess.lvl);const used=sess.res.map(r=>r.kind);const last=used[used.length-1];
 if(sess.kind&&KINDS[sess.kind])return sess.kind;
 if(sess.mode==='due'){const due=dueKinds().filter(k=>!used.includes(k));if(due.length)return pick(due);}
 if(sess.mode==='today'){const due=dueKinds().filter(k=>ks.includes(k)&&!used.includes(k));if(due.length&&Math.random()<0.75)return pick(due);}
 const pool=ks.filter(k=>k!==last);const wts=pool.map(k=>{const s=S.kinds[k];return (s&&s.n?1+(1-s.c/s.n)*3:2)*(used.includes(k)?0.4:1);});
 let t=Math.random()*wts.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){t-=wts[i];if(t<=0)return pool[i];}return pool[0]||ks[0];}

/* ---------- question builders ---------- */
const PRIMOPT={mac:'Metabolic acidosis',malk:'Metabolic alkalosis',rac:'Respiratory acidosis',ralk:'Respiratory alkalosis',two:'Two primary processes',none:'No primary disturbance'};
const COMPOPT={met:{ok:'Appropriate compensation',rac:'PCO₂ too high → added respiratory acidosis',ralk:'PCO₂ too low → added respiratory alkalosis'},
 rac:{a:'Acute',ac:'Acute-on-chronic (or 1–2 days old)',c:'Chronic, renally compensated',mac:'HCO₃⁻ too low → added metabolic acidosis',malk:'HCO₃⁻ too high → added metabolic alkalosis'},
 ralk:{a:'Acute',p:'Partly compensated (hours to 2 days)',c:'Chronic, renally compensated',malk:'HCO₃⁻ too high → added metabolic alkalosis',mac:'HCO₃⁻ too low → added metabolic acidosis'}};
const DELTAOPT=['< 0.4 · normal-gap acidosis dominates','0.4–0.8 · HAGMA + NAGMA','0.8–2 · pure HAGMA','> 2 · HAGMA + metabolic alkalosis'];
const VENOX='Cannot assess: venous PO₂ says nothing about the lungs';
const REALOPT=['Yes: the numbers fit together','No: recheck before interpreting'];
const deltaBand=d=>d<0.4?0:d<0.8?1:d<=2?2:3;
/* gap reference as the engine uses it: Settings AG reference, + 4 when K⁺ is counted and measured */
const ui2AgRef=c=>(S.agref||12)+(S.usek&&c&&c.k!=null?4:0);
/* the engine's own gap working (measured HCO₃⁻, K⁺ setting, albumin), cut before the Δ ratio part */
function gapWhy(c,o){const st=o.steps.find(s=>s.k==='gap'),d=st&&st.d?String(st.d):'';const ar=ui2AgRef(c);
 if(d)return d.split(/ Δ ratio| HCO₃⁻ [\d.]+ has barely| Normal gap:| Lactate | Osmolar gap/)[0]+' So '+(o.agHigh?'high (above '+(ar+2)+').':'normal.');
 return 'AG = '+c.na+' − ('+c.cl+' + '+r1(c.hco3)+') = '+r1(o.ag)+'. Reference ≈ '+ar+', so '+(o.agHigh?'high.':'normal.');}
const ui2KPA=()=>S.units==='kPa'?' Work in mmHg: kPa × 7.5.':'';
function hintFor(cat,c){const o=c.o,ar=ui2AgRef(c);switch(cat){
 case 'real':return '[H⁺] = 24 × PCO₂ ÷ HCO₃⁻ should be close to 80 − the pH decimals (for pH 7.20–7.50).'+ui2KPA();
 case 'ph':return 'Acidaemia below 7.35, alkalaemia above 7.45.'+(o.ven?' Venous pH runs ≈ 0.03 below arterial.':'');
 case 'prim':return 'Normal PCO₂ 35–45 mmHg, HCO₃⁻ 22–26. The value that moved in the direction of the pH is the primary process; if both did, there are two.';
 case 'comp':return (o.primKey==='mac'?'Winter\'s: expected PCO₂ = 1.5 × HCO₃⁻ + 8 ± 2.':o.primKey==='malk'?'Expected PCO₂ = 0.7 × HCO₃⁻ + 20 ± 5.':o.primKey==='rac'?'For every 10 mmHg above 40: HCO₃⁻ +1 acute, +4 chronic (± 2).':'For every 10 mmHg below 40: HCO₃⁻ −2 acute, −5 chronic (± 2).')+ui2KPA();
 case 'gap':return 'AG = Na⁺ − (Cl⁻ + HCO₃⁻)'+(S.usek&&c.k!=null?' + K⁺ (your Settings)':'')+'. Add 2.5 for every 10 g/L of albumin below 40. High if above '+(ar+2)+'.';
 case 'delta':return '(AG − '+ar+') ÷ (expected HCO₃⁻ − measured HCO₃⁻); expected is '+(o.ven?'25 on this venous sample':'24')+' unless a respiratory process has moved it. Under 0.8: an extra normal-gap acidosis. Over 2: an extra metabolic alkalosis.';
 case 'read':return 'Put together every process you found: primary, any failed compensation, the gap type and the Δ ratio.';
 case 'cause':return 'Which history produces exactly this combination?';
 case 'ox':return o.ven?'Look at the sample type before the number.':'Room air: PAO₂ = 0.21 × ('+(S.patm||760)+' − 47) − PaCO₂ ÷ 0.8, and the A–a gradient is normal up to about age ÷ 4 + 4. On oxygen: P/F = PaO₂ ÷ FiO₂.';
 case 'whatif':return 'Acutely, HCO₃⁻ moves only a little with PCO₂: about 1 per 10 mmHg above 40 and 2 per 10 mmHg below 40. Then pH = 6.1 + log(HCO₃⁻ ÷ (0.03 × PCO₂)).';}
 return '';}
function realQ(c,consistent){return {cat:'real',t:'Is this gas internally consistent?',opts:REALOPT,a:REALOPT[consistent?0:1],why:c.o.steps.find(s=>s.k==='real').d};}
function buildQs(c,lvl,mode){const o=c.o,qs=[];const est=o.est;
 if(mode==='steps'){
  const ps=phState(est.pH);qs.push({cat:'ph',t:'pH: acidaemia, alkalaemia or normal?',opts:['Acidaemia','Alkalaemia','Normal pH'],a:ps==='acid'?'Acidaemia':ps==='alk'?'Alkalaemia':'Normal pH',why:o.steps.find(s=>s.k==='ph').d});
  qs.push({cat:'prim',t:'Primary process?',opts:['mac','malk','rac','ralk','two','none'].map(k=>PRIMOPT[k]),a:PRIMOPT[o.primKey],why:o.steps.find(s=>s.k==='sys').d});
  if(['mac','malk','rac','ralk'].includes(o.primKey)){const set=o.primKey==='mac'||o.primKey==='malk'?COMPOPT.met:COMPOPT[o.primKey];qs.push({cat:'comp',t:'Compensation?',opts:Object.values(set),a:set[o.compKey],why:o.steps.find(s=>s.k==='comp').d});}
  if(lvl>=3&&o.agc!=null){qs.push({cat:'gap',t:'Anion gap (corrected for albumin)?',opts:['Normal','High'],a:o.agHigh?'High':'Normal',why:gapWhy(c,o)});
   if(o.delta!=null){const gd=String((o.steps.find(s=>s.k==='gap')||{}).d||''),m=gd.match(/Δ ratio = [\s\S]*?(?=$| Lactate | Osmolar gap)/);qs.push({cat:'delta',t:'Δ ratio?',opts:DELTAOPT,a:DELTAOPT[deltaBand(o.delta)],why:m?m[0]:'Δ ratio = '+o.delta.toFixed(2)+'.'});}}}
 const lab=c.label;qs.push({cat:'read',t:mode==='steps'?'So the full read is…':'What is the acid–base read?',opts:shuffle([lab].concat(distract(lab,lvl,4))),a:lab,conf:true,why:'Every process found along the way: '+lab+'.'});
 const same=KINDS[c.kind].v.map(v=>v[0]).filter(x=>x!==c.cause);const others=shuffle(Object.keys(CAUSES).filter(x=>x!==c.cause&&x!=='normal'&&!same.includes(x)));
 const cd=shuffle(same).slice(0,1).concat(others.slice(0,3-Math.min(1,same.length)));
 qs.push({cat:'cause',t:'Most likely cause in this patient?',opts:shuffle([c.cause].concat(cd)).map(x=>CAUSES[x]),a:CAUSES[c.cause],why:'Match the gas to the story: '+CAUSES[c.cause]+'.'+(()=>{const v=(KINDS[c.kind].v||[]).find(v=>v[0]===c.cause);return v&&typeof v[3]==='string'?' '+esc(v[3]):'';})()});
 if(lvl>=4){const opts=Object.values(OXLAB).concat([VENOX]);
  if(o.ven)qs.push({cat:'ox',t:'And the oxygenation?',opts,a:VENOX,why:'This is a venous sample. A PvO₂ of '+P(c.po2)+' '+PU()+' is normal for venous blood and tells you nothing about gas exchange. Use the SpO₂, or take an ABG if oxygenation matters.'});
  else if(o.ox)qs.push({cat:'ox',t:'And the oxygenation?',opts,a:OXLAB[o.ox.cat],why:o.steps.find(s=>s.k==='ox').d});}
 const wi=whatIf(c);if(wi&&lvl>=2&&mode==='steps')qs.push(wi);
 return qs;}
function whatIf(c){const o=c.o,e=o.est;
 if(o.primKey==='mac'&&e.pco2<34&&Math.random()<0.45){const nh=e.hco3+2*(40-e.pco2)/10,np=phFrom(nh,40);
  const opts=[np,e.pH,7.40,np-0.12].map(x=>x.toFixed(2));if(new Set(opts).size<4||Math.abs(np-e.pH)<0.06)return null;
  const a=np.toFixed(2);return {cat:'whatif',t:'This patient is sedated for intubation and ventilated at "normal" settings. PCO₂ rises to '+P(40)+' '+PU()+' within minutes. The pH becomes about…',opts:shuffle(opts),a,
   why:'The low PCO₂ was the compensation. Acutely, HCO₃⁻ rises only ≈ 2 per 10 mmHg as PCO₂ climbs back to 40 (the 2/5 rule run backwards), so HCO₃⁻ ≈ '+r1(e.hco3)+' + '+r1(2*(40-e.pco2)/10)+' = '+r1(nh)+'. pH = 6.1 + log('+r1(nh)+' ÷ (0.03 × 40)) = '+a+'. Ventilate a severely acidotic patient to match the minute ventilation they achieved on their own; a "normal" PCO₂ in metabolic acidosis is a danger sign.'};}
 if(o.primKey==='rac'&&(o.compKey==='c'||o.compKey==='ac')&&Math.random()<0.5){const opts=['A normal gas','Alkalaemia from retained bicarbonate (post-hypercapnic metabolic alkalosis)','Worsening respiratory acidosis','Metabolic acidosis'];
  const nh=e.hco3-(e.pco2-40)/10,np=phFrom(nh,40);
  return {cat:'whatif',t:'This patient is intubated and ventilated down to PCO₂ '+P(40)+' '+PU()+' within an hour. What does the next gas show?',opts:shuffle(opts),a:opts[1],
   why:'The kidneys took days to build HCO₃⁻ '+r1(e.hco3)+' and need days to excrete it. Acutely, HCO₃⁻ falls only ≈ 1 per 10 mmHg as PCO₂ comes down towards 40, to ≈ '+r1(nh)+'. Removing the CO₂ quickly leaves the bicarbonate behind: pH ≈ '+np.toFixed(2)+'. Ventilate known retainers to their usual PCO₂ (or a pH of about 7.35–7.40), not to 40.'};}
 return null;}
function inconsistentCase(lvl){const c=safeCase(pick(kindsFor(lvl)),lvl,{strict:true});const b=Object.assign({},c);delete b.o;
 for(const f of shuffle([1.45,0.65,1.6,0.6])){b.hco3=r1(c.hco3*f);const o=interp(b);if(!o.err&&o.flags.includes('inconsistent')){b.o=o;b.label=c.label;b.bad=true;return b;}}return null;}

/* ---------- session engine ---------- */
let SS=null;
/* close a session without a summary: keep its record (S.sess) and stop its clocks */
function ui2Close(){if(!SS)return;clearInterval(SS.timer);clearInterval(SS.clock);if(!SS.done&&SS.res.length){const n=SS.res.length;S.sess=S.sess||[];S.sess.push({d:today(),m:SS.mode,n,ok:SS.res.filter(r=>r.ok).length,early:1,ms:Date.now()-SS.t0});if(S.sess.length>120)S.sess.shift();save();}SS.done=true;SS=null;}
/* has the current session anything to lose? */
function ui2AtStake(){if(!SS||SS.done)return false;if(SS.res.length||SS.deadline)return true;const C=SS.cur;return !!(C&&C.ans&&Object.keys(C.ans).length);}
function ui2StartClock(){clearInterval(SS.clock);if(!SS.deadline)return;const me=SS;
 me.clock=setInterval(()=>{if(SS!==me||me.done||me.paused){clearInterval(me.clock);return;}const left=me.deadline-Date.now();const t=$('bT');if(t)t.textContent=ui2Clock(left);
  if(left<=60000&&!me.w60){me.w60=1;ui2Live('One minute left.');if(left>50000)toast('One minute left');}
  if(left<=10000&&!me.w10){me.w10=1;ui2Live('Ten seconds left.');}
  if(left<=0){clearInterval(me.clock);finishSession(true,true);}},500);}
function startSession(mode,opt){opt=opt||{};if(!MODES[mode])mode='today';
 const prev=SS;const from=VIEW==='session'?(prev&&prev.from):VIEW;if(prev){clearInterval(prev.timer);clearInterval(prev.clock);if(!prev.done)ui2Close();}SS=null;
 let len=mode==='reflex'?20:mode==='gym'?10:mode==='mist'?Math.min(S.sessLen,(S.mist||[]).length):mode==='gotd'?1:mode==='final'?12:mode==='due'?Math.max(1,Math.min(S.sessLen,dueKinds().length)):S.sessLen;
 let pool=null,deadline=0;
 if(mode==='boss'){const M=MBYID[opt.mod];pool=shuffle(moduleBossPool(opt.mod)).slice(0,10);if(!M||pool.length<4){toast(ui2Quiet()?'No module check for this module yet.':'No boss for this module yet.');return;}len=pool.length;deadline=Date.now()+Math.max(3,Math.ceil(len*0.6))*60000;}
 if(mode==='final')deadline=Date.now()+10*60000;
 if(opt.n)len=opt.n;
 if(mode==='mist'&&!len){toast('No saved mistakes. Nice.');return;}
 if(mode==='due'&&!dueKinds().length&&!opt.round){toast('Nothing due. Here is a mixed session instead.');mode='today';len=S.sessLen;}
 SS={mode,lvl:opt.lvl&&mode!=='reflex'?opt.lvl:mode==='reflex'?(S.reflex.lvl||1):mode==='final'||mode==='gotd'?4:S.lvl,n:len,res:[],tally:{},t0:Date.now(),cur:null,timer:0,done:false,mq:mode==='mist'?(S.mist||[]).slice(0,len):null,kind:opt.kind||null,round:!!opt.round,pool,mod:opt.mod||null,deadline,from:from&&from!=='session'?from:null,gbag:[],gseen:[],focus:opt.focus||null};
 if(opt.kind)SS.title='Drill: '+KSHORT[opt.kind];
 go('session');nextItem();
 if(deadline)ui2StartClock();}
/* leaving the session view (tab bar, links): untimed sessions pause and can be resumed from Practice; timed runs end and are kept */
function leaveSession(){if(!SS)return;clearInterval(SS.timer);SS.timer=0;if(SS.done)return;
 if(SS.deadline){const n=SS.res.length,t=SS.mode==='final'?'Final check':'Module check';ui2Close();toast(t+' ended. '+n+' answer'+(n===1?'':'s')+' kept.');return;}
 const C=SS.cur;if(!SS.res.length&&!(C&&C.ans&&Object.keys(C.ans).length)&&!(C&&(C.fit&&C.fit.ans!=null||C.g&&C.ans!=null))){SS=null;return;}
 SS.paused=true;}
RENDER.session=function(){if(!SS){go('practice');return;}if(SS.paused){SS.paused=false;const C=SS.cur;if(C&&C.t0&&!C.wait&&C.ans==null)C.t0=performance.now();}if(SS.cur&&!SS.done)drawSession();};
function ui2Exit(){if(!SS)return;const dest=SS.from||(ROUND?'today':'practice');if(SS.res.length)finishSession(true);else{ui2Close();go(dest);}}
/* is the item on screen already answered (its result pushed)? */
function ui2CurDone(){const C=SS&&SS.cur;if(!C)return false;if(C.fit)return C.fit.ans!=null;if(C.g)return C.ans!=null;if(C.c&&C.stage!=null)return !!C.wait;return !!(C.q&&Object.keys(C.ans).length===C.q.length);}
function sessionBar(){const segs=[];const cd=ui2CurDone();for(let i=0;i<SS.n;i++){const r=SS.res[i];segs.push('<i class="'+(r?(r.ok?'k':'x'):(i===SS.res.length&&!cd?'cur':''))+'"></i>');}
 const ok=SS.res.filter(r=>r.ok).length;
 const title=ui2Title();
 return '<div class="sbar"><button class="iconbtn" id="sExit" aria-label="End session">'+ic('x')+'</button><div style="display:flex;flex-direction:column;gap:4px;min-width:0"><div class="btnrow" style="justify-content:space-between;gap:6px"><b role="heading" aria-level="1">'+esc(title)+'</b><span class="stxt">'+Math.min(SS.res.length+(ui2CurDone()?0:1),SS.n)+' / '+SS.n+(SS.mode==='reflex'?' · <span id="rT" role="timer" aria-live="off">0.0</span> s':'')+(SS.deadline?' · ⏱ <span id="bT" role="timer" aria-live="off" aria-label="Time left">'+ui2Clock(SS.deadline-Date.now())+'</span>':'')+'</span></div><div class="sprog" role="img" aria-label="'+SS.res.length+' of '+SS.n+' answered, '+ok+' right">'+segs.join('')+'</div></div><span class="stxt"><span aria-hidden="true">'+ok+' ✓</span><span class="sr-only">'+ok+' right</span></span></div>';}
function nextItem(){if(SS.res.length>=SS.n){finishSession();return;}
 const m=SS.mode;
 if(m==='fit')SS.cur={fit:newFit()};
 else if(m==='gym')SS.cur={g:gymItem(),t0:performance.now()};
 else if(m==='boss'){const b=SS.pool[SS.res.length];const opts=b.fixed?b.opts.slice():shuffle(b.opts.slice());SS.cur={g:{kind:MBYID[SS.mod].t,q:b.q,opts,a:b.a,why:b.why,lesson:b.lesson},t0:performance.now()};}
 else if(m==='final'){const c=safeCase(pick(kindsFor(4)),4,{strict:true});SS.cur={g:{kind:'Full read',q:c.vig,opts:shuffle([c.label].concat(distract(c.label,4,3))),a:c.label,whyH:ui2Why(c.o,4),full:stepsHTML(c.o),slip:slip(c,{lv:4}),c},t0:performance.now()};}
 else if(m==='reflex'){let c=null;for(let i=0;i<8&&!c;i++)c=genCase(pick(kindsFor(SS.lvl)),SS.lvl,{strict:true});if(!c)c=safeCase('hagma',SS.lvl,{strict:true});c._opts=SS.lvl===1?labelPool(1).sort():shuffle([c.label].concat(distract(c.label,SS.lvl,4)));SS.cur={c,stage:0,t0:performance.now(),wait:false};}
 else{let c,q;
  let lvl=SS.lvl;
  if(m==='mist'){const snap=SS.mq[SS.res.length];c=Object.assign({},snap.c);c.o=interp(c);c.label=snap.label;c._mid=snap.id;lvl=snap.lvl||4;q=buildQs(c,lvl,'steps');}
  else if(m==='gotd'){const g=gasOfDay();c=Object.assign({},g);lvl=4;q=withSeed(dayNum(),()=>buildQs(c,4,'steps'));}
  else{const roll=Math.random(),fo=SS.focus,sm=m==='today'||m==='steps';
   /* a weekly Drill (opt.focus) keeps its step in every case: retry until it appears; oxygenation needs an arterial sample */
   if(sm&&(lvl>=2||fo==='real')&&roll<(fo==='real'?0.3:0.07)){c=inconsistentCase(lvl);if(c)q=[realQ(c,false)];}
   if(!c){const k=chooseKind(SS);
    /* a due pattern is served at the level it needs (gaps need level 3) so it stays solvable */
    if(m==='due'&&KINDS[k])lvl=Math.max(lvl,KINDS[k].lv>=3?3:KINDS[k].lv);
    for(let t=0;t<(fo&&fo!=='real'&&sm?6:1);t++){c=safeCase(t?chooseKind(SS):k,lvl,{strict:true,ven:fo==='ox'?false:m!=='quick'&&Math.random()<0.28});q=buildQs(c,lvl,m==='quick'?'quick':'steps');if(!fo||q.some(x=>x.cat===fo))break;}
    if(sm&&(lvl>=2||fo==='real')&&(roll<0.27||fo==='real'))q.unshift(realQ(c,true));}}
  SS.cur={c,q,lvl,step:0,ans:{},assist:{},auto:{},conf:null};}
 drawSession();window.scrollTo(0,0);}
function drawSession(){const host=$('v-session');const m=SS.mode;let body='';
 if(m==='fit')body=fitHTML();else if(m==='gym'||m==='boss'||m==='final')body=gymHTML();else if(m==='reflex')body=reflexHTML();else body=caseHTML();
 host.innerHTML=sessionBar()+body+'<p class="ui2-keys" aria-hidden="true">'+(m==='fit'?'1–4 pick':m==='reflex'?'1–6 answer':'1–'+(m==='gym'||m==='boss'||m==='final'?4:7)+' answer')+(m==='today'||m==='steps'||m==='quick'||m==='mist'||m==='due'||m==='gotd'?' · H hint · S/T/G how sure':'')+' · Enter next · Esc end</p>';
 /* ✕, Esc and Back: one press ends a session with nothing at stake; otherwise the first press asks, the second ends */
 $('sExit').onclick=()=>{if(!SS)return;if(ui2AtStake()&&!(SS.arm&&Date.now()-SS.arm<3000)){SS.arm=Date.now();const n=SS.res.length;toast('Press ✕ again to end'+(n?'. '+n+' answer'+(n===1?'':'s')+' kept.':'.'));ui2Live('Press end again to leave the session.');return;}ui2Exit();};
 if(m==='fit')bindFit();else if(m==='gym'||m==='boss'||m==='final')bindGym();else if(m==='reflex')bindReflex();else bindCase();
 ui2Focus();}
/* keep keyboard and screen-reader users on the current question after each redraw */
function ui2Focus(){const host=$('v-session');if(!host||!SS||!SS.cur)return;let t=$('fbNext');
 if(!t){const C=SS.cur;if(C.q){const qb=host.querySelector('.qblock[data-q="'+C.step+'"] h3');t=qb;}else t=host.querySelector('.gymq,.fitq,#rSlipCard .eyebrow, .rgrid .eyebrow')||host.querySelector('.opt:not([disabled])');}
 if(t){if(!t.matches('button,a,[tabindex]'))t.setAttribute('tabindex','-1');try{t.focus({preventScroll:true});}catch(e){}}}

/* ---- case modes (today, steps, quick, mist) ---- */
function hintMode(cat){if(S.hints==='never')return 'off';if(S.hints==='always')return 'open';const s=(S.steps||{})[cat];if(!s||s.n<4)return 'open';return stepAcc(cat)<0.7?'open':'closed';}
/* compact one-line printout that stays in view on phones while answering */
function ui2Strip(c,lv){const ven=c.sample==='v',U=PU(),it=[];const add=(l,v)=>{if(v!=null&&v!==''&&!(typeof v==='number'&&isNaN(v)))it.push('<span><span class="l">'+l+'</span> <b>'+v+'</b></span>');};
 add('pH',c.pH!=null?(+c.pH).toFixed(2):null);add(ven?'PvCO₂':'PaCO₂',P(c.pco2)+' '+U);add('HCO₃⁻',c.hco3!=null?r1(c.hco3):null);
 if(lv>=3){add('Na⁺',c.na);add('Cl⁻',c.cl);add('Alb',c.alb);add('K⁺',c.k);add('Lac',c.lac);}
 if(lv>=4&&c.po2!=null){add(ven?'PvO₂':'PaO₂',P(c.po2)+' '+U);add('FiO₂',c.fio2);}
 return '<div class="ui2-strip" aria-hidden="true">'+it.join('')+'</div>';}
function caseHTML(){const C=SS.cur,c=C.c;const qs=C.q.map((q,i)=>{if(i>C.step)return '';const answered=C.ans[i]!=null,ok=answered&&C.ans[i]===q.a&&!C.assist[i],asst=answered&&C.ans[i]===q.a&&C.assist[i];
  const hm=hintMode(q.cat),h=hintFor(q.cat,c);let hint='';
  if(!answered&&h){if(hm==='open'||C.assist[i]){hint='<div class="hint"><b>Hint</b><span>'+esc(h)+'</span></div>';if(hm==='open')C.auto[i]=1;}else if(hm==='closed')hint='<button class="hintbtn" data-hintq="'+i+'">Show hint (H)</button>';}
  return '<div class="qblock'+(answered?(ok?' done':asst?' assist':' miss'):'')+'" data-q="'+i+'"><h3><span class="qn">'+(answered?(ok?'✓':asst?'½':'✗'):(i+1))+'</span>'+q.t+'</h3>'+hint+(q.conf&&!answered?'<div class="conf"><span>How sure? (optional)</span><div class="seg">'+['sure','think','guess'].map(x=>'<button data-cf="'+x+'" aria-pressed="'+(C.conf===x)+'" aria-keyshortcuts="'+x[0].toUpperCase()+'">'+x[0].toUpperCase()+x.slice(1)+' <kbd aria-hidden="true">'+x[0].toUpperCase()+'</kbd></button>').join('')+'</div></div>':'')+'<div class="opts'+(answered?' done':'')+'">'+q.opts.map((o,oi)=>{if(answered&&o!==q.a&&o!==C.ans[i])return '';let cl='opt';if(answered){if(o===q.a)cl+=' right';else if(o===C.ans[i])cl+=' wrong';}return '<button class="'+cl+'" data-o="'+oi+'"'+(answered?' disabled':' aria-keyshortcuts="'+(oi+1)+'"')+'><kbd aria-hidden="true">'+(answered&&o===q.a?'✓':answered&&o===C.ans[i]?'✗':oi+1)+'</kbd><span>'+esc(o)+'</span></button>';}).join('')+'</div>'+(answered?'<p class="why '+(ok?'ok':asst?'as':'no')+'"><b>'+(ok?'Right.':asst?'Right, with a hint. It counts as practice, not yet as mastery.':'Answer: '+esc(q.a)+'.')+'</b> '+q.why+'</p>'+(C.ans[i]!==q.a?autopsyHTML(i):''):'')+'</div>';}).join('');
 const finished=Object.keys(C.ans).length===C.q.length;
 return '<div class="dgrid"><div class="card stick" style="display:grid;gap:14px"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">'+(c.sample==='v'?'Venous sample':'Arterial sample')+'</span>'+(SS.mode==='mist'?'<span class="chip">from your mistakes</span>':'')+'</div><p class="vig">'+esc(c.vig)+'</p>'+slip(c,{lv:SS.mode==='mist'?4:(C.lvl||SS.lvl),urea:!!c.osm})+'</div><div class="card" style="display:grid;gap:20px">'+(finished?'':ui2Strip(c,SS.mode==='mist'?4:(C.lvl||SS.lvl)))+qs+'</div></div>'+(finished?caseFeedback():'');}
function bindCase(){const host=$('v-session'),C=SS.cur;
 host.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>{C.conf=b.dataset.cf;host.querySelectorAll('[data-cf]').forEach(x=>x.setAttribute('aria-pressed',x===b));});
 host.querySelectorAll('[data-hintq]').forEach(b=>b.onclick=()=>useHint(+b.dataset.hintq));
 host.querySelectorAll('[data-why]').forEach(b=>b.onclick=()=>{const [i,k]=b.dataset.why.split(':');const C2=SS.cur;C2.why=C2.why||{};if(C2.why[i])return;C2.why[i]=k;S.why=S.why||{};S.why[k]=(S.why[k]||0)+1;save();const row=b.closest('.autopsy');if(row){row.outerHTML=autopsyHTML(+i);ui2Live('Logged.');}});
 host.querySelectorAll('.qblock').forEach(qb=>{const i=+qb.dataset.q;qb.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answerQ(i,C.q[i].opts[+b.dataset.o]));});
 const finished=Object.keys(C.ans).length===C.q.length;
 if(!finished&&C.step>0){const cur=host.querySelector('.qblock[data-q="'+C.step+'"]');if(cur&&cur.getBoundingClientRect().bottom>window.innerHeight-40)cur.scrollIntoView({block:'center',behavior:RM()?'auto':'smooth'});}
 if(finished){if($('fbMap'))drawMap($('fbMap'),[{ph:C.c.o.est.pH,h:C.c.o.est.hco3,l:C.c.o.ven?'est. arterial':'this gas'}],280);
  $('fbCopy').onclick=e=>copyText(C.c.o.line,e.currentTarget);$('fbNext').onclick=nextItem;
  host.querySelectorAll('#caseFb [data-lesson]').forEach(b=>b.onclick=()=>openLesson(b.dataset.lesson));
  const fb=$('caseFb');if(fb&&fb.getBoundingClientRect().top>window.innerHeight-80)fb.scrollIntoView({block:'start',behavior:RM()?'auto':'smooth'});}}
const WHY=[['misread','Misread a number'],['slip','Arithmetic slip'],['rule','Didn\'t know the rule'],['mixup','Mixed up two ideas']];
/* management-step reasons, for chat cases (ui8 autopsyRow may add these to WHY for "what do you do" steps) */
const WHY_ACT=[['prio','Wrong priority or order'],['guide','Didn\'t know the guideline']];
function autopsyHTML(i){const C=SS.cur;const k=C.why&&C.why[i];
 if(k){const w=WHY.find(x=>x[0]===k);return '<div class="autopsy" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span>Logged:</span><button class="on" aria-pressed="true" disabled style="width:auto">'+esc(w?w[1]:k)+'</button></div>';}
 return '<div class="autopsy" role="group" aria-label="Why the miss?" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span>Why the miss?</span>'+WHY.map(w=>'<button data-why="'+i+':'+w[0]+'" aria-pressed="false" style="width:auto">'+w[1]+'</button>').join('')+'</div>';}
/* H or the button opens a closed hint; it does nothing when the hint is already open (no penalty) or hints are off in Settings */
function useHint(i){const C=SS.cur;if(!C||!C.q||C.ans[i]!=null||C.assist[i])return;const hm=hintMode(C.q[i].cat);if(hm!=='closed'||!hintFor(C.q[i].cat,C.c))return;C.assist[i]=1;drawSession();}
const ABCATS=['real','ph','prim','comp','gap','delta','read'];
function answerQ(i,o){const C=SS.cur;if(!C||C.ans[i]!=null||i!==C.step)return;C.ans[i]=o;const q=C.q[i];const ok=o===q.a&&!C.assist[i];
 recordStep(q.cat,ok);SS.tally[q.cat]=SS.tally[q.cat]||{n:0,c:0};SS.tally[q.cat].n++;if(ok){SS.tally[q.cat].c++;S.xp=(S.xp||0)+2;}
 if(q.cat==='read'&&!C.c.bad){const allAB=C.q.every((x,j)=>!ABCATS.includes(x.cat)||j>i||(C.ans[j]===x.a&&!C.assist[j]));const st=kindStat(C.c.kind);const now=Date.now();
  if(st.last&&now-st.last>=3*864e5){S.ret.n++;if(allAB)S.ret.c++;}
  st.n++;if(allAB){st.c++;st.box=Math.min(5,(st.box||0)+1);}else st.box=Math.max(0,(st.box||0)-2);st.due=now+[0,1,3,7,16,35][st.box]*864e5;st.last=now;
  /* calibration scores the read the learner rated, and only when they rated it */
  if(C.conf){S.conf.push({c:C.conf,ok});if(S.conf.length>300)S.conf.shift();}}
 ui2Live(ok?'Right.':(o===q.a?'Right, with a hint.':'Wrong. Answer: '+q.a+'.'));
 C.step=i+1;
 if(C.step>=C.q.length){const all=C.q.every((x,j)=>C.ans[j]===x.a&&!C.assist[j]);S.read++;touchDay(1);addXP(all?10:0);
  SS.res.push({ok:all,kind:C.c.kind,label:C.c.bad?'Inconsistent gas':C.c.label,lesson:C.c.bad?null:ui2Les(C.c),missed:C.q.filter((x,j)=>C.ans[j]!==x.a||C.assist[j]).map(x=>x.cat)});
  if(!all&&!C.c.bad&&SS.mode!=='mist')saveMistake(C.c);
  if(SS.mode==='mist'&&all){S.mist=(S.mist||[]).filter(x=>x.id!==C.c._mid);toast('Cleared from your mistakes','good');}}
 save();drawSession();}
/* the lesson for a generated case: its own (altitude, OHS, dialysis, toxic alcohol…) or the pattern's */
function ui2Les(c){const id=c&&(c.les||KLESSON[c.kind]);return id&&LBYID[id]?id:null;}
function caseFeedback(){const C=SS.cur,c=C.c,o=c.o;const res=SS.res[SS.res.length-1];const last=SS.res.length>=SS.n;
 const head=res.ok?'Every step right.':'Missed: '+res.missed.map(x=>ui2Low(STEPNAME[x])).join(', ')+'.';
 if(c.bad)return '<div class="fb no" id="caseFb"><div class="verdict"><i>!</i>This gas does not add up</div><p style="margin:0">'+o.steps.find(s=>s.k==='real').d+'</p><p class="note">On a real printout, the analyser calculates HCO₃⁻ from pH and PCO₂, so a mismatch means the numbers were copied wrongly, come from different samples, or a laboratory total CO₂ was mixed with a gas pH. Stop and recheck before interpreting.</p><div class="btnrow"><button class="btn ghost" id="fbCopy">'+ic('copy')+'Copy line</button><button class="btn" id="fbNext">'+(last?'See summary':'Next case')+' →</button></div></div>';
 return '<div class="fb '+(res.ok?'ok':'no')+'" id="caseFb"><div class="verdict"><i>'+(res.ok?'✓':'✗')+'</i>'+esc(head)+'</div>'+
 '<div class="dgrid"><div style="display:grid;gap:12px;min-width:0"><div class="bigread">'+esc(o.label)+'</div><p class="line">'+esc(o.line)+'</p><div class="btnrow"><button class="btn" id="fbNext">'+(last?'See summary':'Next case')+' →</button><button class="btn ghost" id="fbCopy">'+ic('copy')+'Copy for Black</button>'+(!res.ok&&res.lesson?'<button class="btn ghost" data-lesson="'+esc(res.lesson)+'">Lesson: '+esc(LBYID[res.lesson].t)+'</button>':'')+'</div><div class="cvwrap"><canvas id="fbMap" aria-label="Acid–base map with this gas"></canvas></div></div>'+stepsHTML(o)+'</div></div>';}
/* the decisive working for a one-answer read: pH side, primary, compensation verdict with numbers, then the gaps and Δ ratio */
function ui2Why(o,lv){const g=k=>o.steps.find(s=>s.k===k);const ph=g('ph'),sys=g('sys'),comp=g('comp'),gap=g('gap');const out=[];const pH=o.est&&o.est.pH;
 if(ph){const st=phState(pH);out.push('pH '+(pH!=null?pH.toFixed(2):'')+': '+ui2Low(ph.v)+(st!=='acid'&&st!=='alk'&&pH!=null?' ('+(pH>=7.40?'alkaline':'acid')+' side of 7.40)':'')+'.');}
 if(sys)out.push(sys.v+'.');
 if(comp&&o.primKey&&o.primKey!=='none'&&o.primKey!=='two')out.push(comp.v+': '+comp.d);
 if(gap&&lv>=3)out.push(gap.v+': '+gap.d);
 return out.join(' ');}
function stepsHTML(o){return '<div style="display:grid;gap:10px;min-width:0"><ol class="stepl">'+o.steps.map((s,i)=>'<li class="'+s.tone+'"><i>'+(i+1)+'</i><b><small>'+s.t+'</small>'+s.v+'</b><p>'+s.d+'</p></li>').join('')+'</ol>'+
 (o.unsure&&o.unsure.length?'<div class="unsure"><div class="eyebrow" style="margin-bottom:6px">How sure is this?</div><ul class="causes">'+o.unsure.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>':'')+
 (o.causes.length?'<div><div class="eyebrow" style="margin-bottom:6px">Think about</div><ul class="causes">'+o.causes.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>':'')+'</div>';}
const SNAPF=['pH','pco2','hco3','po2','fio2','na','k','cl','alb','lac','glu','urea','osm','age','sample','cause','vig','kind','cohb','methb','spo2','les'];
function saveMistake(c){const s={};SNAPF.forEach(k=>{if(c[k]!=null)s[k]=c[k];});const id=c.kind+'-'+c.pH+'-'+c.pco2+'-'+c.hco3;S.mist=(S.mist||[]).filter(x=>x.id!==id);S.mist.push({id,c:s,label:c.label,lvl:SS.lvl,t:Date.now()});if(S.mist.length>40)S.mist.shift();}

/* ---- which gas fits ---- */
const COMPS={hagma:['hag'],hag_rac:['hag','rac'],hag_ralk:['hag','ralk'],hag_malk:['hag','malk'],hag_nag:['hag','nag'],hag_malk_ralk:['hag','malk','ralk'],nagma:['nag'],malk:['malk'],rac_a:['rac'],rac_c:['rac'],rac_ac:['rac'],rac_malk:['rac','malk'],ralk_a:['ralk'],ralk_c:['ralk'],ralk_malk:['ralk','malk']};
function newFit(){const ks=Object.keys(KINDS);let k=pick(ks),c=null;for(let i=0;i<6&&!c;i++){k=pick(ks);c=genCase(k,3,{strict:true});}if(!c){c=safeCase('hagma',3);k=c.kind;}
 const mine=COMPS[k];const pool=shuffle(ks.filter(x=>!COMPS[x].some(y=>mine.includes(y))));
 /* at level 3+, one near miss shares part of the picture, so the numbers must decide */
 const picked=[];const seen=new Set();let near=null;
 if(S.lvl>=3&&Math.random()<0.7){const nm=shuffle(ks.filter(x=>x!==k&&COMPS[x].some(y=>mine.includes(y))&&COMPS[x].join('+')!==mine.join('+')));if(nm.length){near=nm[0];picked.push(near);seen.add(COMPS[near].join('+'));}}
 pool.forEach(x=>{const f=COMPS[x].join('+');if(picked.length<3&&!seen.has(f)){seen.add(f);picked.push(x);}});
 pool.forEach(x=>{if(picked.length<3&&!picked.includes(x))picked.push(x);});
 const gases=[c];let nearG=null;picked.forEach(x=>{let g=null;for(let i=0;i<6&&!g;i++)g=genCase(x,3,{strict:true});if(g){gases.push(g);if(x===near)nearG=g;}});
 return {c,gases:shuffle(gases),ans:null,near:nearG};}
const ui2COMPN={hag:'a high anion gap acidosis',nag:'a normal-gap acidosis',malk:'a metabolic alkalosis',rac:'a respiratory acidosis',ralk:'a respiratory alkalosis'};
function ui2NearWhy(F){const g=F.near;if(!g)return 'The others share none of its disorders.';const a=COMPS[F.c.kind]||[],b=COMPS[g.kind]||[];const lack=a.filter(x=>!b.includes(x)).map(x=>ui2COMPN[x]),extra=b.filter(x=>!a.includes(x)).map(x=>ui2COMPN[x]);
 return 'Gas '+'ABCD'[F.gases.indexOf(g)]+' ('+esc(ui2Low(g.label))+') was the near miss: it '+(lack.length?'lacks '+lack.join(' and '):'')+(lack.length&&extra.length?' and ':'')+(extra.length?'adds '+extra.join(' and '):'')+'. The rest share none of its disorders.';}
/* short spoken summary of a gas for screen readers */
function ui2GasText(c){const U=PU();return (c.sample==='v'?'Venous':'Arterial')+': pH '+(+c.pH).toFixed(2)+', PCO₂ '+P(c.pco2)+' '+U+', HCO₃⁻ '+r1(c.hco3)+(c.na!=null?', Na⁺ '+c.na:'')+(c.cl!=null?', Cl⁻ '+c.cl:'')+(c.alb!=null?', albumin '+c.alb:'')+(c.k!=null?', K⁺ '+c.k:'')+'.';}
function fitHTML(){const F=SS.cur.fit;const AB='ABCD';const ans=F.ans!=null;const right=ans&&F.gases[F.ans]===F.c;const last=SS.res.length>=SS.n;
 return '<div class="card raised" style="display:flex;flex-direction:column;gap:10px"><span class="eyebrow">Predict, then pick</span><p class="vig" style="font-size:1.15rem;font-weight:700">'+esc(F.c.vig)+'</p>'+(ans?'':'<p class="note">Before you look: will the pH be up or down? What will the PCO₂ and HCO₃⁻ do? Will there be a gap?</p>')+'</div>'+
 '<div class="fitgrid">'+F.gases.map((g,i)=>{const isC=g===F.c;return '<span id="fitD'+i+'" class="ui2-sr">'+esc(ui2GasText(g))+(ans?' '+esc(g.label)+'.':'')+'</span><button class="card fitc'+(ans?(isC?' right':i===F.ans?' wrong':''):'')+'" data-g="'+i+'"'+(ans?' disabled':'')+' aria-label="Gas '+AB[i]+'" aria-describedby="fitD'+i+'" aria-keyshortcuts="'+(i+1)+'"><div class="btnrow" style="justify-content:space-between"><b class="px" style="font-size:11px">Gas '+AB[i]+' · '+(i+1)+'</b>'+(ans?'<span class="chip '+(isC?'good':'')+'">'+esc(g.label)+'</span>':'')+'</div>'+slip(g,{lv:3})+'</button>';}).join('')+'</div>'+
 (ans?'<div class="fb '+(right?'ok':'no')+'" id="caseFb"><div class="verdict"><i>'+(right?'✓':'✗')+'</i>'+(right?'Right gas.':'It was gas '+AB[F.gases.indexOf(F.c)]+'.')+'</div><p style="margin:0">'+esc(CAUSES[F.c.cause])+' gives '+esc(ui2Low(F.c.label))+'. '+ui2NearWhy(F)+'</p>'+stepsHTML(F.c.o)+'<div class="btnrow"><button class="btn" id="fbNext">'+(last?'See summary':'Next patient')+' →</button></div></div>':'');}
function bindFit(){const host=$('v-session');host.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>answerFit(+b.dataset.g));if($('fbNext'))$('fbNext').onclick=nextItem;}
function answerFit(i){const F=SS.cur&&SS.cur.fit;if(!F||F.ans!=null||!F.gases[i])return;F.ans=i;const ok=F.gases[i]===F.c;recordStep('fit',ok);if(ok)addXP(5);S.read++;touchDay(1);SS.res.push({ok,kind:F.c.kind,label:F.c.label,missed:ok?[]:['fit']});save();drawSession();ui2Live(ok?'Right gas.':'Wrong. It was gas '+'ABCD'[F.gases.indexOf(F.c)]+': '+F.c.label+'.');
 const fb=$('caseFb');if(fb)fb.scrollIntoView({block:'start',behavior:RM()?'auto':'smooth'});}

/* ---- compensation gym ---- */
/* rules are dealt round-robin from a shuffled bag so a session mixes them; a value is not repeated within the session */
function ui2GymRule(){const bag=SS?SS.gbag:[];if(!bag.length){const fresh=shuffle(['mac','malk','raca','racc','ralka','ralkc','judge','judge','mac']);const last=SS&&SS.glast;if(fresh[0]===last)fresh.push(fresh.shift());bag.push(...fresh);}const t=bag.shift();if(SS)SS.glast=t;return t;}
function ui2Fresh(lo,hi){const seen=SS?SS.gseen:[];let v=Math.round(rnd(lo,hi));for(let i=0;i<12&&seen.includes(v);i++)v=Math.round(rnd(lo,hi));seen.push(v);return v;}
const ui2Kp=mm=>S.units==='kPa'?' mmHg (≈ '+P(Math.round(mm))+' kPa)':' mmHg';
function gymItem(){const U=PU();const t=ui2GymRule();const R=x=>Math.round(x);const kp=S.units==='kPa';
 const opts4=(correct,cands)=>{const out=[correct];for(const v of cands){if(out.every(x=>Math.abs(x-v)>=3))out.push(v);if(out.length===4)break;}let k=1;while(out.length<4){const v=correct+k*7*(k%2?1:-1);if(out.every(x=>Math.abs(x-v)>=3)&&v>4)out.push(v);k++;}return out;};
 if(t==='mac'){const h=ui2Fresh(6,20),e=1.5*h+8;const o=opts4(R(e),[R(e+6),R(e-6),R(0.7*h+20),R(h+25)]);return {kind:'Metabolic acidosis',q:'HCO₃⁻ '+h+' mmol/L. Expected PCO₂?',opts:shuffle(o.map(v=>P(v)+' '+U)),a:P(R(e))+' '+U,why:'Winter\'s: 1.5 × '+h+' + 8 = '+r1(e)+ui2Kp(e)+', ± 2 mmHg → '+P(e-2)+'–'+P(e+2)+' '+U+'.'};}
 if(t==='malk'){const h=ui2Fresh(30,44),e=0.7*h+20;const o=opts4(R(e),[R(e+8),R(e-8),R(1.5*h+8),R(40)]);return {kind:'Metabolic alkalosis',q:'HCO₃⁻ '+h+' mmol/L. Expected PCO₂?',opts:shuffle(o.map(v=>P(v)+' '+U)),a:P(R(e))+' '+U,why:'0.7 × '+h+' + 20 = '+r1(e)+ui2Kp(e)+', ± 5 mmHg → '+P(e-5)+'–'+P(e+5)+' '+U+'.'};}
 if(t==='raca'||t==='racc'){const p=ui2Fresh(55,90),d=(p-40)/10,a=24+d,c=24+4*d,acute=t==='raca';const cor=R(acute?a:c);const o=opts4(cor,[R(acute?c:a),24,R(24+2*d),R(24+3*d)]);
  return {kind:(acute?'Acute':'Chronic')+' respiratory acidosis',q:'PCO₂ '+P(p)+' '+U+'. Expected HCO₃⁻?',opts:shuffle(o.map(String)),a:String(cor),why:(kp?'PCO₂ '+P(p)+' kPa = '+p+' mmHg, ':'PCO₂ is ')+r1(d*10)+' mmHg above 40'+(kp?' (5.3 kPa)':'')+': '+(acute?'+1':'+4')+' per 10 → 24 + '+r1(acute?d:4*d)+' = '+r1(acute?a:c)+' (± 2).'};}
 if(t==='ralka'||t==='ralkc'){const p=ui2Fresh(18,32),d=(40-p)/10,a=24-2*d,c=24-5*d,acute=t==='ralka';const cor=R(acute?a:c);const o=opts4(cor,[R(acute?c:a),24,R(24-d),R(24-3.5*d)]);
  return {kind:(acute?'Acute':'Chronic')+' respiratory alkalosis',q:'PCO₂ '+P(p)+' '+U+'. Expected HCO₃⁻?',opts:shuffle(o.map(String)),a:String(cor),why:(kp?'PCO₂ '+P(p)+' kPa = '+p+' mmHg, ':'PCO₂ is ')+r1(d*10)+' mmHg below 40'+(kp?' (5.3 kPa)':'')+': '+(acute?'−2':'−5')+' per 10 → 24 − '+r1(acute?2*d:5*d)+' = '+r1(acute?a:c)+' (± 2).'};}
 const h=ui2Fresh(7,18),e=1.5*h+8,sh=pick([-7,0,0,7]),m=R(e+sh+rnd(-0.8,0.8));const optsJ=['Appropriate','Too high → added respiratory acidosis','Too low → added respiratory alkalosis'];const ans=m>e+2?optsJ[1]:m<e-2?optsJ[2]:optsJ[0];
 const verdict=m>e+2?'above the band: the lungs are not blowing off enough CO₂, so there is an added respiratory acidosis.':m<e-2?'below the band: the patient is breathing off more CO₂ than compensation explains, so there is an added respiratory alkalosis.':'inside the band: appropriate compensation, no second respiratory process.';
 return {kind:'Metabolic acidosis',q:'HCO₃⁻ '+h+', measured PCO₂ '+P(m)+' '+U+'. Compensation?',opts:optsJ,a:ans,why:'Winter\'s: 1.5 × '+h+' + 8 = '+r1(e)+ui2Kp(e)+', ± 2 mmHg → '+P(e-2)+'–'+P(e+2)+' '+U+'. Measured '+P(m)+' '+U+' is '+verdict};}
function gymHTML(){const G=SS.cur.g,ans=SS.cur.ans;const last=SS.res.length>=SS.n;
 return '<div class="'+(G.slip?'dgrid':'')+'">'+(G.slip?'<div class="card stick" style="display:flex;flex-direction:column;gap:12px"><p class="vig">'+esc(G.q)+'</p>'+G.slip+'</div>':'')+'<div class="card raised" style="display:flex;flex-direction:column;gap:18px;'+(G.slip?'':'max-width:760px;margin:0 auto;width:100%')+'"><span class="chip acc" style="align-self:flex-start">'+esc(G.kind)+'</span><p class="gymq">'+(G.slip?'What is the read?':esc(G.q))+'</p><div class="opts">'+G.opts.map((o,i)=>{let cl='opt';if(ans!=null){if(o===G.a)cl+=' right';else if(o===ans)cl+=' wrong';}return '<button class="'+cl+'" data-o="'+i+'"'+(ans!=null?' disabled':'')+'><kbd>'+(i+1)+'</kbd><span'+(SS.mode==='gym'?' style="font:700 1.05rem var(--f-mono)"':'')+'>'+esc(o)+'</span></button>';}).join('')+'</div>'+(ans!=null&&ans!==G.a?'<p class="why no"><b>Answer: '+esc(G.a)+'.</b> '+(G.whyH?'You picked '+esc(ui2Low(ans))+'. '+G.whyH:esc(G.why))+'</p>'+(G.full?'<details class="ui2-full"><summary>Show the full working</summary>'+G.full+'</details>':'')+'<div class="btnrow"><button class="btn" id="fbNext">'+(last?'See summary':'Next')+' →</button></div>':ans!=null?'<p class="why ok"><b>Right.</b> '+(G.whyH||esc(G.why))+'</p>':'')+'</div></div>';}
function bindGym(){const host=$('v-session');host.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answerGym(+b.dataset.o));if($('fbNext'))$('fbNext').onclick=nextItem;}
function answerGym(i){const C=SS.cur;if(!C||C.ans!=null)return;const o=C.g.opts[i];if(o==null)return;C.ans=o;const ok=o===C.g.a;
 /* gym sums and module-check questions are not gases, but they make the day a study day */
 if(SS.mode==='gym'){S.gym.n++;if(ok)S.gym.c++;recordStep('comp',ok);if(ok)addXP(3);touchDay();}
 else if(SS.mode==='boss'){recordStep('boss',ok);if(ok)addXP(4);touchDay();}
 else{S.read++;touchDay(1);if(ok)addXP(6);}
 const stem=s=>{s=ui2Plain(s);return s.length>72?s.slice(0,70).replace(/\s+\S*$/,'')+'…':s;};
 const gp=/Expected HCO/.test(C.g.q)?'HCO₃⁻ ':/Expected PCO/.test(C.g.q)?'PCO₂ ':'';
 const label=SS.mode==='final'?C.g.a:SS.mode==='gym'?ui2Plain(C.g.q).replace(/\. (Expected .*|Compensation)\?$/,'')+' → '+gp+C.g.a+(ok?'':' (you: '+o+')'):SS.mode==='boss'?stem(C.g.q):C.g.kind;
 SS.res.push({ok,kind:null,label,lesson:C.g.lesson||null,missed:ok?[]:[SS.mode==='gym'?'gym':SS.mode==='boss'?'boss':'read'],t:performance.now()-C.t0});save();drawSession();
 ui2Live(ok?'Right.':'Wrong. Answer: '+C.g.a+'.');
 if(ok)setTimeout(()=>{if(SS&&SS.cur===C)nextItem();},RM()?300:900);}

/* ---- reflex ---- */
function reflexHTML(){const R=SS.cur,c=R.c;const opts=R.stage===0?c._opts:Object.values(OXLAB);
 return '<div class="rgrid"><div class="card" id="rSlipCard">'+slip(c,{lv:SS.lvl,big:true})+'</div><div class="card" style="display:grid;gap:12px;align-content:start"><div class="eyebrow">'+(R.stage===0?'Read · level '+SS.lvl:'Oxygenation')+'</div><div class="ropts">'+opts.map((o,i)=>'<button class="opt" data-i="'+i+'"><kbd>'+(i+1)+'</kbd><span>'+esc(o)+'</span></button>').join('')+'</div><div id="rWhy"></div></div></div>';}
function bindReflex(){const R=SS.cur;$('v-session').querySelectorAll('.opt').forEach(b=>b.onclick=()=>reflexAnswer(+b.dataset.i));
 clearInterval(SS.timer);SS.timer=setInterval(()=>{const t=$('rT');if(t&&SS&&SS.cur===R&&!R.wait)t.textContent=((performance.now()-R.t0)/1000).toFixed(1);},100);}
function reflexAnswer(i){const R=SS.cur;if(!R||R.wait||!R.c)return;const c=R.c;const opts=R.stage===0?c._opts:Object.values(OXLAB);const o=opts[i];if(o==null)return;
 const want=R.stage===0?c.label:OXLAB[c.o.ox&&c.o.ox.cat];const ok=o===want;
 $('v-session').querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(opts[j]===want)b.classList.add('right');if(j===i&&!ok)b.classList.add('wrong');});
 if(R.stage===0&&SS.lvl>=4&&ok&&c.o.ox){R.stage=1;setTimeout(()=>{if(SS&&SS.cur===R)drawSession();},220);return;}
 const t=performance.now()-R.t0;R.wait=true;S.reflex.hist.push({l:SS.lvl,ok,t:Math.round(t)});if(S.reflex.hist.length>800)S.reflex.hist.shift();S.read++;touchDay(1);
 SS.res.push({ok,kind:c.kind,label:c.label,missed:ok?[]:['read'],t});if(ok)addXP(3);save();
 $('rSlipCard').classList.add(ok?'flash-ok':'flash-no');
 if(ok)setTimeout(()=>{if(SS&&SS.cur===R)nextItem();},RM()?150:380);
 else{const ox=c.o.steps.find(s=>s.k==='ox');$('rWhy').innerHTML='<p class="why no"><b>'+esc(c.label)+(R.stage===1?' · '+esc(want):'')+'.</b> You picked '+esc(ui2Low(o))+'. '+(R.stage===1&&ox?ox.d:ui2Why(c.o,SS.lvl))+'</p><button class="btn" id="fbNext">Next (Enter) →</button>';$('fbNext').onclick=nextItem;ui2Focus();}
 ui2Live(ok?'Right.':'Wrong. Answer: '+want+'.');}

/* ---- summary ---- */
function finishSession(early,timeout){if(!SS||SS.done)return;clearInterval(SS.timer);clearInterval(SS.clock);const n=SS.res.length,ok=SS.res.filter(r=>r.ok).length,acc=n?ok/n:0;const el=Date.now()-SS.t0;const tStr=el<600000?ui2Clock(el):Math.round(el/60000)+' min';
 if(n){S.sess=S.sess||[];S.sess.push({d:today(),m:SS.mode,n,ok,ms:el});if(S.sess.length>120)S.sess.shift();save();}
 /* streak and reflex badges are dated the day they are earned (T23-16) */
 if(typeof ui5Badges==='function')ui5Badges();
 const host=$('v-session');const isRef=SS.mode==='reflex';const med=isRef?median(SS.res.map(r=>r.t))/1000:null;const auto=isRef&&n>=20&&acc>=0.9&&med<=8;
 const tl=Object.keys(SS.tally).filter(k=>SS.tally[k].n);if(SS.mode==='gotd'){S.ui=S.ui||{};S.ui.gotd=today();}
 /* case modes score every step: the headline is step accuracy, gases fully right come second */
 const caseM=['today','steps','quick','mist','due','gotd'].includes(SS.mode);const sn=tl.reduce((a,k)=>a+SS.tally[k].n,0),sc=tl.reduce((a,k)=>a+SS.tally[k].c,0);
 const head=caseM&&sn?sc/sn:acc;
 let msg=head===1&&n>=5?'Perfect session.':head>=0.8?'Strong session.':head>=0.5?'Solid practice. The misses are where the learning is.':(caseM?'Tough round. Slow down and use the hints; accuracy first, then speed.':'Tough round. Slow down; accuracy first, then speed.');
 if(SS.mode==='gotd'){const r=SS.res[0];msg=r&&r.ok?'Today\'s gas: every step right. Same time tomorrow.':r?'Today\'s gas: missed '+r.missed.map(x=>ui2Low(STEPNAME[x])).join(', ')+'.':'Today\'s gas: not finished.';}
 let promo=0;if(isRef){const rs=reflexStatus();if(rs>=(S.reflex.lvl||1)&&(S.reflex.lvl||1)<4){promo=Math.min(4,rs+1);S.reflex.lvl=promo;toast('Reflex: automatic at level '+rs+'. Next run is level '+promo+'.','good');}}
 if(isRef)msg=auto?'Automatic at level '+SS.lvl+'.':acc>=0.9?'Accurate. Now get faster.':'Accuracy first, then speed.';
 const unit=SS.mode==='gym'?'sums':SS.mode==='boss'?'questions':'gases';
 const w=weakestStep();let badge='';
 if(SS.mode==='boss'){const need=Math.ceil(SS.n*0.8);if(ok>=need){const k='m-'+SS.mod;const first=!S.badges[k];S.badges[k]=ddmmyyyy();if(first)addXP(120);msg=(first?qw('Boss beaten. Badge earned.','Check passed.'):qw('Boss beaten again.','Check passed again.'));badge='<span class="chip good">'+esc(MBYID[SS.mod].t)+' ✓</span>';}else msg=(timeout?'Time ran out. ':'')+ok+' of '+SS.n+'; '+need+' wins. Re-read the module and try again.';}
 if(SS.mode==='final'){if(ok>=10){const first=!S.badges.native;S.badges.native=ddmmyyyy();if(first)addXP(200);msg=first?qw('Native reader. Badge earned.','Final check passed.'):qw('Native reader again.','Final check passed again.');badge='<span class="chip good">Native reader ✓</span>';}else msg=(timeout?'Time ran out. ':'')+ok+' of 12; ten wins.';}
 save();
 host.innerHTML='<div class="card raised" style="display:flex;flex-direction:column;gap:18px"><div class="sumhead"><div class="bigscore"><div><b>'+Math.round(head*100)+'%</b><small>'+(caseM&&sn?'of steps':ok+'/'+n)+'</small></div></div><div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="eyebrow">'+esc(ui2Title())+(timeout?' · time up':early?' · ended early':' · complete')+'</span><h1 style="font-size:clamp(18px,3vw,24px)">'+esc(msg)+'</h1>'+badge+'<div class="stats">'+(caseM&&sn?'<div><b>'+ok+'/'+n+'</b><small>'+unit+' fully right</small></div>':'<div><b>'+n+'</b><small>'+unit+'</small></div>')+'<div><b>'+tStr+'</b><small>time</small></div>'+(isRef?'<div><b>'+med.toFixed(1)+' s</b><small>median</small></div>':'')+'<div><b>'+todayN()+'/'+(S.goal||15)+'</b><small>gases today</small></div><div class="gamey"><b>'+(S.xp||0)+'</b><small>XP</small></div></div></div></div>'+
 (tl.length?'<div><div class="eyebrow" style="margin-bottom:10px">This session, by step</div><div class="slips">'+tl.map(k=>{const s=SS.tally[k],p=Math.round(s.c/s.n*100);return '<div class="sb"><span>'+STEPNAME[k]+'</span><div class="bar"><i style="width:'+p+'%;background:'+(p>=85?'var(--good)':p>=65?'var(--warn)':'var(--bad)')+'"></i></div><b>'+p+'%</b><small>'+s.c+'/'+s.n+'</small></div>';}).join('')+'</div></div>':'')+
 (n?'<div><div class="eyebrow" style="margin-bottom:10px">'+(SS.mode==='gym'?'Sums':SS.mode==='boss'?'Questions':'Cases')+'</div><div class="caselist">'+SS.res.map((r,i)=>'<div><span class="d'+(r.ok?'':' x')+'"></span><span>'+esc(r.label)+'</span><small>'+(r.ok?'':SS.mode==='boss'?(r.lesson?'<button class="linkbtn" data-lesson="'+esc(r.lesson)+'">Re-read the lesson</button>':''):SS.mode==='gym'?'':esc(r.missed.map(x=>STEPNAME[x]).join(', '))+(caseM&&r.lesson&&LBYID[r.lesson]?' · <button class="linkbtn" data-lesson="'+esc(r.lesson)+'">'+esc(LBYID[r.lesson].t)+'</button>':''))+(r.t&&isRef?' '+(r.t/1000).toFixed(1)+' s':'')+'</small></div>').join('')+'</div></div>':'')+
 (w&&!isRef?'<p class="note">Your weakest step overall is <b>'+ui2Low(STEPNAME[w.c])+'</b> ('+Math.round(w.a*100)+'%). '+(w.c==='comp'?'The compensation gym targets it directly.':caseM?'Hints for it stay open until you are consistently right.':'A short step-by-step drill targets it.')+'</p>':'')+
 (isRef?'<div class="btnrow" style="align-items:center;gap:10px"><span class="eyebrow">Reflex level</span><div class="seg" id="sRLvl">'+[1,2,3,4].map(l=>'<button data-v="'+l+'" aria-pressed="'+((S.reflex.lvl||1)===l)+'">'+l+(reflexStatus()>=l?' ✓':'')+'</button>').join('')+'</div></div>':'')+
 (SS.round&&ROUND?'<div class="btnrow"><button class="btn primary big" id="sLeg">Next leg of the Round →</button></div>':'')+'<div class="btnrow"><button class="btn'+(SS.round?'':' primary')+'" id="sAgain">'+ic('redo')+'Go again</button>'+(isRef&&auto&&SS.lvl<4&&!promo?'<button class="btn ghost" id="sUp">Level '+(SS.lvl+1)+' →</button>':'')+(w&&!isRef&&!SS.round&&SS.mode!=='gym'?'<button class="btn ghost" id="sDrill">Drill '+esc(ui2Low(STEPNAME[w.c]))+'</button>':'')+((S.mist||[]).length&&SS.mode!=='mist'?'<button class="btn ghost" data-mist="1">Revisit '+S.mist.length+' mistake'+(S.mist.length===1?'':'s')+'</button>':'')+'<button class="btn ghost" data-go="practice">Practice</button><button class="btn ghost" data-go="today">Today</button></div></div>';
 const mode=SS.mode,lv=SS.lvl,mod=SS.mod,kind=SS.kind,focus=SS.focus,wasRound=SS.round;SS.done=true;
 $('sAgain').onclick=()=>startSession(mode,{mod,kind,focus,lvl:focus?lv:undefined});if($('sLeg'))$('sLeg').onclick=()=>roundLegDone();if($('sUp'))$('sUp').onclick=()=>{S.reflex.lvl=lv+1;save();startSession('reflex');};
 if($('sDrill'))$('sDrill').onclick=()=>{const c=w.c;if(c==='comp')startSession('gym');else if(c==='gap'||c==='delta')startSession('steps',{n:5,lvl:Math.max(3,S.lvl),focus:c});else if(c==='ox')startSession('steps',{n:5,lvl:4,focus:c});else startSession('steps',{n:5,focus:c});};
 host.querySelectorAll('#sRLvl button').forEach(b=>b.onclick=()=>{S.reflex.lvl=+b.dataset.v;save();startSession('reflex');});
 host.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(b.dataset.lesson));
 host.querySelectorAll('[data-mist]').forEach(b=>b.onclick=()=>startSession('mist'));
 if(!ui2Quiet()&&(head===1&&n>=5||badge))confetti();window.scrollTo(0,0);renderHeader();
 ui2Live(msg+' '+Math.round(head*100)+'%.');const sa=$('sAgain');if(sa)try{sa.focus({preventScroll:true});}catch(e){}}

document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea')||e.metaKey||e.ctrlKey||e.altKey)return;
 if(VIEW!=='session'||!SS||SS.done)return;
 if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('button,summary,a'))return;/* the focused control handles its own activation */
 const n=S.keys===false?NaN:parseInt(e.key,10);const m=SS.mode;
 if(e.key==='Escape'){if(e.target.closest&&e.target.closest('details[open],select'))return;$('sExit')&&$('sExit').click();return;}
 if(S.keys!==false&&/^[stg]$/i.test(e.key)&&SS.cur&&SS.cur.q){const b=document.querySelector('#v-session [data-cf="'+{s:'sure',t:'think',g:'guess'}[e.key.toLowerCase()]+'"]');if(b){b.click();return;}}
 if(m==='fit'){if(n>=1&&n<=4)answerFit(n-1);else if(e.key==='Enter'&&$('fbNext'))nextItem();return;}
 if(m==='gym'||m==='boss'||m==='final'){if(n>=1&&n<=4)answerGym(n-1);else if(e.key==='Enter'&&$('fbNext'))nextItem();return;}
 if(m==='reflex'){if(n>=1&&n<=6)reflexAnswer(n-1);else if((e.key==='Enter'||e.key===' ')&&$('fbNext')){e.preventDefault();nextItem();}return;}
 const C=SS.cur;if(!C||!C.q)return;
 if(n>=1&&n<=7){const q=C.q[C.step];if(q&&q.opts[n-1])answerQ(C.step,q.opts[n-1]);}
 else if((e.key==='h'||e.key==='H')&&S.keys!==false&&C.q[C.step])useHint(C.step);
 else if(e.key==='Enter'&&C.step>=C.q.length)nextItem();});
