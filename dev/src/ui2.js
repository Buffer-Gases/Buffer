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
 final:{t:'Final boss',d:'Twelve full reads in ten minutes. Ten right earns "Native reader".',icon:'boss'}
};
const LVLS=[[1,'Basics','single disorders'],[2,'Compensation','plus mixed disorders'],[3,'Gaps','plus anion gap and Δ ratio'],[4,'Full read','plus oxygenation']];
RENDER.practice=function(){const el=$('v-practice');const mist=(S.mist||[]).length;const w=weakestStep();const rb=reflexStatus();const due=dueKinds().length;
 const MAIN=['today','steps','quick','fit','reflex','gym'].concat(mist?['mist']:[]);
 const DEEP=[['scen','Shifts','Six branching scenarios set in your clinic, camp and ER. Wrong turns detour, then rejoin.','scen',Object.keys(S.scen||{}).length+'/'+SCENARIOS.length+' done'],['teach','Teach it back','Explain one idea in writing, then grade yourself against the key points.','teach',Object.keys(S.teach||{}).length+' explained'],['est','Gas sense','Estimate the pH, the expected PCO₂ or the gap on a slider before you calculate.','est',(S.est&&S.est.n?Math.round(S.est.c/S.est.n*100)+'% close':'number sense')],['flash','Number flash','Every key number as a card. Swipe right if you knew it, left if not.','flash',FLASH.length+' cards'],['serial','Serial gases','Watch DKA, COPD, sepsis and salicylate change over hours: better or worse?','serial',Object.keys(S.serial||{}).length+'/'+SERIES.length+' done'],['final','Final boss','Twelve full reads in ten minutes. Ten right earns the Native reader badge.','boss',S.badges&&S.badges.native?'won '+S.badges.native:'not yet won']];
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+S.read+' gases read · '+(due?due+' due':'nothing due')+'</span><h1>Practice</h1><p>Every session shuffles disorders together and marks each step.</p></div>'+levelPill()+'</div>'+
 '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div class="btnrow" style="justify-content:space-between;gap:14px"><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow">Difficulty</span><div class="seg" id="pLvl">'+LVLS.map(l=>'<button data-v="'+l[0]+'" aria-pressed="'+(S.lvl===l[0])+'" data-hint="'+l[1]+'|Level '+l[0]+': '+l[2]+'.">'+l[1]+'</button>').join('')+'</div></div><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow">Gases per session</span><div class="seg" id="pLen">'+[5,10,20].map(n=>'<button data-n="'+n+'" aria-pressed="'+(S.sessLen===n)+'">'+n+'</button>').join('')+'</div></div></div><p class="note">'+esc(LVLS[S.lvl-1][1]+': '+LVLS[S.lvl-1][2]+'.')+'</p></div>'+
 (due?'<div class="due"><span class="mono-mark">'+ic('due')+'</span><p><b>'+due+' pattern'+(due>1?'s':'')+' due.</b> <span class="muted">Clear them first; spacing is what makes it stick.</span></p><button class="btn small primary" data-start="due">Review '+Math.min(due,S.sessLen)+'</button></div>':'')+
 '<div class="shelf"><h2>Gas practice <small>pick one</small></h2><div class="tiles">'+MAIN.map(m=>'<button class="tile'+(m==='today'?' on':'')+'" data-start="'+m+'"><span class="mono-mark">'+ic(MODES[m].icon)+'</span><span><small class="meta">'+MODS_META(m,w,mist,rb)+'</small><b>'+MODES[m].t+'</b><span class="d">'+MODES[m].d+'</span></span></button>').join('')+'</div></div>'+
 '<div class="shelf"><h2>Go deeper <small>reasoning, explaining, number sense</small></h2><div class="tiles">'+DEEP.map(d=>'<button class="tile" data-deep="'+d[0]+'"><span class="mono-mark">'+ic(d[3])+'</span><span><small class="meta">'+esc(d[4])+'</small><b>'+d[1]+'</b><span class="d">'+d[2]+'</span></span></button>').join('')+'</div></div>'+
 (w?'<p class="note">Weakest step lately: <b>'+STEPNAME[w.c].toLowerCase()+'</b> ('+Math.round(w.a*100)+'%). Full breakdown in <button class="linkbtn" data-go="progress">Progress</button>.</p>':'');
 el.querySelectorAll('#pLvl button').forEach(b=>b.onclick=()=>{S.lvl=+b.dataset.v;save();RENDER.practice();});
 el.querySelectorAll('#pLen button').forEach(b=>b.onclick=()=>{S.sessLen=+b.dataset.n;save();RENDER.practice();});
 el.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startSession(b.dataset.start));
 el.querySelectorAll('[data-deep]').forEach(b=>b.onclick=()=>{const d=b.dataset.deep;if(d==='final')startSession('final');else if(d==='scen')go('scen');else go(d);});};
function MODS_META(m,w,mist,rb){if(m==='today')return dueKinds().length?dueKinds().length+' due · '+S.sessLen+' gases':S.sessLen+' gases';if(m==='steps'||m==='quick')return S.sessLen+' gases · '+LVLS[S.lvl-1][1];if(m==='fit')return S.sessLen+' patients';if(m==='reflex')return '20 gases · '+(rb?'automatic to L'+rb:'level '+(S.reflex.lvl||1));if(m==='gym')return '10 sums'+(stepAcc('comp')!=null?' · compensation '+Math.round(stepAcc('comp')*100)+'%':'');return mist+' saved';}

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
function gapWhy(c,o){const ar=S.agref||12;return 'AG = '+c.na+' − ('+c.cl+' + '+r1(o.est.hco3)+') = '+r1(o.ag)+(c.alb!=null&&c.alb!==40?'. Albumin '+c.alb+' g/L: '+(0.25*(40-c.alb)>=0?'+ ':'− ')+Math.abs(r1(0.25*(40-c.alb)))+' → corrected '+r1(o.agc):'')+'. Reference ≈ '+ar+', so '+(o.agHigh?'high (above '+(ar+2)+').':'normal.')+(o.ven?' (Estimated arterial HCO₃⁻ used; venous runs ≈ 1 higher.)':'');}
function hintFor(cat,c){const o=c.o,ar=S.agref||12;switch(cat){
 case 'real':return '[H⁺] = 24 × PCO₂ ÷ HCO₃⁻ should be close to 80 − the pH decimals (for pH 7.20–7.50).';
 case 'ph':return 'Acidaemia below 7.35, alkalaemia above 7.45.'+(o.ven?' Venous pH runs ≈ 0.03 below arterial.':'');
 case 'prim':return 'Normal PCO₂ 35–45 mmHg, HCO₃⁻ 22–26. The value that moved in the direction of the pH is the primary process; if both did, there are two.';
 case 'comp':return o.primKey==='mac'?'Winter\'s: expected PCO₂ = 1.5 × HCO₃⁻ + 8 ± 2.':o.primKey==='malk'?'Expected PCO₂ = 0.7 × HCO₃⁻ + 20 ± 5.':o.primKey==='rac'?'For every 10 mmHg above 40: HCO₃⁻ +1 acute, +4 chronic (± 2).':'For every 10 mmHg below 40: HCO₃⁻ −2 acute, −5 chronic (± 2).';
 case 'gap':return 'AG = Na⁺ − (Cl⁻ + HCO₃⁻). Add 2.5 for every 10 g/L of albumin below 40. High if above '+(ar+2)+'.';
 case 'delta':return '(AG − '+ar+') ÷ (24 − HCO₃⁻). Under 0.8: an extra normal-gap acidosis. Over 2: an extra metabolic alkalosis.';
 case 'read':return 'Put together every process you found: primary, any failed compensation, the gap type and the Δ ratio.';
 case 'cause':return 'Which history produces exactly this combination?';
 case 'ox':return o.ven?'Look at the sample type before the number.':'Room air: PAO₂ = 0.21 × ('+(S.patm||760)+' − 47) − PaCO₂ ÷ 0.8, and the A–a gradient is normal up to about age ÷ 4 + 4. On oxygen: P/F = PaO₂ ÷ FiO₂.';
 case 'whatif':return 'Acutely, HCO₃⁻ moves only ≈ 1 per 10 mmHg of PCO₂. Then pH = 6.1 + log(HCO₃⁻ ÷ (0.03 × PCO₂)).';}
 return '';}
function realQ(c,consistent){return {cat:'real',t:'Is this gas internally consistent?',opts:REALOPT,a:REALOPT[consistent?0:1],why:c.o.steps.find(s=>s.k==='real').d};}
function buildQs(c,lvl,mode){const o=c.o,qs=[];const est=o.est;
 if(mode==='steps'){
  const ps=phState(est.pH);qs.push({cat:'ph',t:'pH: acidaemia, alkalaemia or normal?',opts:['Acidaemia','Alkalaemia','Normal pH'],a:ps==='acid'?'Acidaemia':ps==='alk'?'Alkalaemia':'Normal pH',why:o.steps.find(s=>s.k==='ph').d});
  qs.push({cat:'prim',t:'Primary process?',opts:['mac','malk','rac','ralk','two','none'].map(k=>PRIMOPT[k]),a:PRIMOPT[o.primKey],why:o.steps.find(s=>s.k==='sys').d});
  if(['mac','malk','rac','ralk'].includes(o.primKey)){const set=o.primKey==='mac'||o.primKey==='malk'?COMPOPT.met:COMPOPT[o.primKey];qs.push({cat:'comp',t:'Compensation?',opts:Object.values(set),a:set[o.compKey],why:o.steps.find(s=>s.k==='comp').d});}
  if(lvl>=3&&o.agc!=null){qs.push({cat:'gap',t:'Anion gap (corrected for albumin)?',opts:['Normal','High'],a:o.agHigh?'High':'Normal',why:gapWhy(c,o)});
   if(o.delta!=null)qs.push({cat:'delta',t:'Δ ratio?',opts:DELTAOPT,a:DELTAOPT[deltaBand(o.delta)],why:'Δ ratio = (AG − '+(S.agref||12)+') ÷ (24 − HCO₃⁻) = ('+r1(o.agc)+' − '+(S.agref||12)+') ÷ (24 − '+r1(est.hco3)+') = '+o.delta.toFixed(2)+'.'});}}
 const lab=c.label;qs.push({cat:'read',t:mode==='steps'?'So the full read is…':'What is the acid–base read?',opts:shuffle([lab].concat(distract(lab,lvl,4))),a:lab,conf:true,why:'Every process found along the way: '+lab+'.'});
 const same=KINDS[c.kind].v.map(v=>v[0]).filter(x=>x!==c.cause);const others=shuffle(Object.keys(CAUSES).filter(x=>x!==c.cause&&x!=='normal'&&!same.includes(x)));
 const cd=shuffle(same).slice(0,1).concat(others.slice(0,3-Math.min(1,same.length)));
 qs.push({cat:'cause',t:'Most likely cause in this patient?',opts:shuffle([c.cause].concat(cd)).map(x=>CAUSES[x]),a:CAUSES[c.cause],why:'Match the gas to the story: '+CAUSES[c.cause]+'.'});
 if(lvl>=4){const opts=Object.values(OXLAB).concat([VENOX]);
  if(o.ven)qs.push({cat:'ox',t:'And the oxygenation?',opts,a:VENOX,why:'This is a venous sample. A PvO₂ of '+P(c.po2)+' '+PU()+' is normal for venous blood and tells you nothing about gas exchange. Use the SpO₂, or take an ABG if oxygenation matters.'});
  else if(o.ox)qs.push({cat:'ox',t:'And the oxygenation?',opts,a:OXLAB[o.ox.cat],why:o.steps.find(s=>s.k==='ox').d});}
 const wi=whatIf(c);if(wi&&lvl>=2&&mode==='steps')qs.push(wi);
 return qs;}
function whatIf(c){const o=c.o,e=o.est;
 if(o.primKey==='mac'&&e.pco2<34&&Math.random()<0.45){const nh=e.hco3+(40-e.pco2)/10,np=phFrom(nh,40);
  const opts=[np,e.pH,7.40,np-0.12].map(x=>x.toFixed(2));if(new Set(opts).size<4||Math.abs(np-e.pH)<0.06)return null;
  const a=np.toFixed(2);return {cat:'whatif',t:'This patient is sedated for intubation and ventilated at "normal" settings. PCO₂ rises to '+P(40)+' '+PU()+' within minutes. The pH becomes about…',opts:shuffle(opts),a,
   why:'The low PCO₂ was the compensation. Acutely, HCO₃⁻ rises only ≈ 1 per 10 mmHg of CO₂, so HCO₃⁻ ≈ '+r1(nh)+'. pH = 6.1 + log('+r1(nh)+' ÷ (0.03 × 40)) = '+a+'. Ventilate a severely acidotic patient to match the minute ventilation they achieved on their own; a "normal" PCO₂ in metabolic acidosis is a danger sign.'};}
 if(o.primKey==='rac'&&(o.compKey==='c'||o.compKey==='ac')&&Math.random()<0.5){const opts=['A normal gas','Alkalaemia from retained bicarbonate (post-hypercapnic metabolic alkalosis)','Worsening respiratory acidosis','Metabolic acidosis'];
  const nh=e.hco3-(e.pco2-40)/10,np=phFrom(nh,40);
  return {cat:'whatif',t:'This patient is intubated and ventilated down to PCO₂ '+P(40)+' '+PU()+' within an hour. What does the next gas show?',opts:shuffle(opts),a:opts[1],
   why:'The kidneys took days to build HCO₃⁻ '+r1(e.hco3)+' and need days to excrete it. Removing the CO₂ quickly leaves the bicarbonate behind: pH ≈ '+np.toFixed(2)+'. Ventilate known retainers to their usual PCO₂ (or a pH of about 7.35–7.40), not to 40.'};}
 return null;}
function inconsistentCase(lvl){const c=safeCase(pick(kindsFor(lvl)),lvl,{strict:true});const b=Object.assign({},c);delete b.o;
 for(const f of shuffle([1.45,0.65,1.6,0.6])){b.hco3=r1(c.hco3*f);const o=interp(b);if(!o.err&&o.flags.includes('inconsistent')){b.o=o;b.label=c.label;b.bad=true;return b;}}return null;}

/* ---------- session engine ---------- */
let SS=null;
function startSession(mode,opt){opt=opt||{};if(!MODES[mode])mode='today';
 let len=mode==='reflex'?20:mode==='gym'?10:mode==='mist'?Math.min(S.sessLen,(S.mist||[]).length):mode==='gotd'?1:mode==='final'?12:mode==='due'?Math.max(1,Math.min(S.sessLen,dueKinds().length)):S.sessLen;
 let pool=null,deadline=0;
 if(mode==='boss'){const M=MBYID[opt.mod];pool=shuffle(moduleBossPool(opt.mod)).slice(0,10);if(!M||pool.length<4){toast('No boss for this module yet.');return;}len=pool.length;deadline=Date.now()+Math.max(3,Math.ceil(len*0.6))*60000;}
 if(mode==='final')deadline=Date.now()+10*60000;
 if(opt.n)len=opt.n;
 if(mode==='mist'&&!len){toast('No saved mistakes. Nice.');return;}
 if(mode==='due'&&!dueKinds().length&&!opt.round){toast('Nothing due. Here is a mixed session instead.');mode='today';len=S.sessLen;}
 SS={mode,lvl:mode==='reflex'?(S.reflex.lvl||1):mode==='final'||mode==='gotd'?4:S.lvl,n:len,res:[],tally:{},t0:Date.now(),cur:null,timer:0,done:false,mq:mode==='mist'?(S.mist||[]).slice(0,len):null,kind:opt.kind||null,round:!!opt.round,pool,mod:opt.mod||null,deadline};
 if(opt.kind)SS.title='Drill: '+KSHORT[opt.kind];
 go('session');nextItem();
 if(deadline){clearInterval(SS.clock);SS.clock=setInterval(()=>{if(!SS||SS.done){clearInterval(SS&&SS.clock);return;}const left=SS.deadline-Date.now();const t=$('bT');if(t)t.textContent=Math.max(0,Math.floor(left/60000))+':'+String(Math.max(0,Math.floor(left/1000)%60)).padStart(2,'0');if(left<=0){clearInterval(SS.clock);finishSession(true,true);}},500);}}
function leaveSession(){if(SS){clearInterval(SS.timer);SS.timer=0;if(SS.clock&&!SS.done){clearInterval(SS.clock);}}}
RENDER.session=function(){if(!SS){go('practice');return;}if(SS.cur&&!SS.done)drawSession();};
function sessionBar(){const segs=[];for(let i=0;i<SS.n;i++){const r=SS.res[i];segs.push('<i class="'+(r?(r.ok?'k':'x'):(i===SS.res.length?'cur':''))+'"></i>');}
 const ok=SS.res.filter(r=>r.ok).length;
 const title=SS.title||(SS.mode==='boss'?'Boss · '+MBYID[SS.mod].t:MODES[SS.mode].t);
 return '<div class="sbar"><button class="iconbtn" id="sExit" aria-label="End session">'+ic('x')+'</button><div style="display:flex;flex-direction:column;gap:4px;min-width:0"><div class="btnrow" style="justify-content:space-between;gap:6px"><b>'+esc(title)+'</b><span class="stxt">'+Math.min(SS.res.length+1,SS.n)+' / '+SS.n+(SS.mode==='reflex'?' · <span id="rT">0.0</span> s':'')+(SS.deadline?' · ⏱ <span id="bT">'+Math.max(0,Math.floor((SS.deadline-Date.now())/60000))+':'+String(Math.max(0,Math.floor((SS.deadline-Date.now())/1000)%60)).padStart(2,'0')+'</span>':'')+'</span></div><div class="sprog">'+segs.join('')+'</div></div><span class="stxt">'+ok+' ✓</span></div>';}
function nextItem(){if(SS.res.length>=SS.n){finishSession();return;}
 const m=SS.mode;
 if(m==='fit')SS.cur={fit:newFit()};
 else if(m==='gym')SS.cur={g:gymItem(),t0:performance.now()};
 else if(m==='boss'){const b=SS.pool[SS.res.length];const opts=shuffle(b.opts.slice());SS.cur={g:{kind:MBYID[SS.mod].t,q:b.q,opts,a:b.a,why:b.why},t0:performance.now()};}
 else if(m==='final'){const c=safeCase(pick(kindsFor(4)),4,{strict:true});const comp=c.o.steps.find(s=>s.k==='comp');SS.cur={g:{kind:'Full read',q:c.vig,opts:shuffle([c.label].concat(distract(c.label,4,3))),a:c.label,why:comp.v+'. '+comp.d,slip:slip(c,{lv:4})},t0:performance.now()};}
 else if(m==='reflex'){let c=null;for(let i=0;i<8&&!c;i++)c=genCase(pick(kindsFor(SS.lvl)),SS.lvl);if(!c)c=safeCase('hagma',SS.lvl);c._opts=SS.lvl===1?labelPool(1).sort():shuffle([c.label].concat(distract(c.label,SS.lvl,4)));SS.cur={c,stage:0,t0:performance.now(),wait:false};}
 else{let c,q;
  if(m==='mist'){const snap=SS.mq[SS.res.length];c=Object.assign({},snap.c);c.o=interp(c);c.label=snap.label;c._mid=snap.id;q=buildQs(c,snap.lvl,'steps');}
  else if(m==='gotd'){const g=gasOfDay();c=Object.assign({},g);q=withSeed(dayNum(),()=>buildQs(c,4,'steps'));}
  else{const lvl=SS.lvl;const roll=Math.random();
   if((m==='today'||m==='steps')&&lvl>=2&&roll<0.07){c=inconsistentCase(lvl);if(c)q=[realQ(c,false)];}
   if(!c){c=safeCase(chooseKind(SS),lvl,{strict:m!=='quick',ven:m!=='quick'&&Math.random()<0.28});q=buildQs(c,lvl,m==='quick'?'quick':'steps');if((m==='today'||m==='steps')&&lvl>=2&&roll<0.27)q.unshift(realQ(c,true));}}
  SS.cur={c,q,step:0,ans:{},assist:{},auto:{},conf:'think'};}
 drawSession();window.scrollTo(0,0);}
function drawSession(){const host=$('v-session');const m=SS.mode;let body='';
 if(m==='fit')body=fitHTML();else if(m==='gym'||m==='boss'||m==='final')body=gymHTML();else if(m==='reflex')body=reflexHTML();else body=caseHTML();
 host.innerHTML=sessionBar()+body;
 $('sExit').onclick=()=>{if(SS.res.length)finishSession(true);else{clearInterval(SS.clock);SS=null;go(ROUND?'today':'practice');}};
 if(m==='fit')bindFit();else if(m==='gym'||m==='boss'||m==='final')bindGym();else if(m==='reflex')bindReflex();else bindCase();}

/* ---- case modes (today, steps, quick, mist) ---- */
function hintMode(cat){if(S.hints==='never')return 'off';if(S.hints==='always')return 'open';const s=(S.steps||{})[cat];if(!s||s.n<4)return 'open';return stepAcc(cat)<0.7?'open':'closed';}
function caseHTML(){const C=SS.cur,c=C.c;const qs=C.q.map((q,i)=>{if(i>C.step)return '';const answered=C.ans[i]!=null,ok=answered&&C.ans[i]===q.a&&!C.assist[i];
  const hm=hintMode(q.cat),h=hintFor(q.cat,c);let hint='';
  if(!answered&&h){if(hm==='open'||C.assist[i]){hint='<div class="hint"><b>Hint</b><span>'+esc(h)+'</span></div>';if(hm==='open')C.auto[i]=1;}else if(hm==='closed')hint='<button class="hintbtn" data-hintq="'+i+'">Show hint (H)</button>';}
  return '<div class="qblock'+(answered?(ok?' done':' miss'):'')+'" data-q="'+i+'"><h3><span class="qn">'+(answered?(ok?'✓':'✗'):(i+1))+'</span>'+q.t+'</h3>'+hint+(q.conf&&!answered?'<div class="conf"><span>How sure?</span><div class="seg">'+['sure','think','guess'].map(x=>'<button data-cf="'+x+'" aria-pressed="'+(C.conf===x)+'">'+x[0].toUpperCase()+x.slice(1)+'</button>').join('')+'</div></div>':'')+'<div class="opts'+(answered?' done':'')+'">'+q.opts.map((o,oi)=>{if(answered&&o!==q.a&&o!==C.ans[i])return '';let cl='opt';if(answered){if(o===q.a)cl+=' right';else if(o===C.ans[i])cl+=' wrong';}return '<button class="'+cl+'" data-o="'+oi+'"'+(answered?' disabled':'')+'><kbd>'+(answered&&o===q.a?'✓':answered&&o===C.ans[i]?'✗':oi+1)+'</kbd><span>'+esc(o)+'</span></button>';}).join('')+'</div>'+(answered?'<p class="why '+(ok?'ok':'no')+'"><b>'+(ok?'Right.':C.assist[i]&&C.ans[i]===q.a?'Right, with a hint.':'Answer: '+esc(q.a)+'.')+'</b> '+q.why+'</p>'+(C.ans[i]!==q.a?autopsyHTML(i):''):'')+'</div>';}).join('');
 const finished=Object.keys(C.ans).length===C.q.length;
 return '<div class="dgrid"><div class="card stick" style="display:grid;gap:14px"><div class="btnrow" style="justify-content:space-between"><span class="eyebrow">'+(c.sample==='v'?'Venous sample':'Arterial sample')+'</span>'+(SS.mode==='mist'?'<span class="chip">from your mistakes</span>':'')+'</div><p class="vig">'+esc(c.vig)+'</p>'+slip(c,{lv:SS.mode==='mist'?4:SS.lvl,urea:!!c.osm})+'</div><div class="card" style="display:grid;gap:20px">'+qs+'</div></div>'+(finished?caseFeedback():'');}
function bindCase(){const host=$('v-session'),C=SS.cur;
 host.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>{C.conf=b.dataset.cf;host.querySelectorAll('[data-cf]').forEach(x=>x.setAttribute('aria-pressed',x===b));});
 host.querySelectorAll('[data-hintq]').forEach(b=>b.onclick=()=>useHint(+b.dataset.hintq));
 host.querySelectorAll('[data-why]').forEach(b=>b.onclick=()=>{const [i,k]=b.dataset.why.split(':');const C2=SS.cur;C2.why=C2.why||{};if(C2.why[i])return;C2.why[i]=k;S.why=S.why||{};S.why[k]=(S.why[k]||0)+1;save();b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));});
 host.querySelectorAll('.qblock').forEach(qb=>{const i=+qb.dataset.q;qb.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answerQ(i,C.q[i].opts[+b.dataset.o]));});
 const finished=Object.keys(C.ans).length===C.q.length;
 if(!finished&&C.step>0){const cur=host.querySelector('.qblock[data-q="'+C.step+'"]');if(cur&&cur.getBoundingClientRect().bottom>window.innerHeight-40)cur.scrollIntoView({block:'center',behavior:RM()?'auto':'smooth'});}
 if(finished){if($('fbMap'))drawMap($('fbMap'),[{ph:C.c.o.est.pH,h:C.c.o.est.hco3,l:C.c.o.ven?'est. arterial':'this gas'}],280);
  $('fbCopy').onclick=e=>copyText(C.c.o.line,e.currentTarget);$('fbNext').onclick=nextItem;
  const fb=$('caseFb');if(fb&&fb.getBoundingClientRect().top>window.innerHeight-80)fb.scrollIntoView({block:'start',behavior:RM()?'auto':'smooth'});}}
const WHY=[['misread','Misread a number'],['slip','Arithmetic slip'],['rule','Didn\'t know the rule'],['mixup','Mixed up two ideas']];
function autopsyHTML(i){const C=SS.cur;const k=C.why&&C.why[i];return '<div class="autopsy"><span>Why the miss?</span>'+WHY.map(w=>'<button data-why="'+i+':'+w[0]+'"'+(k===w[0]?' class="on"':'')+'>'+w[1]+'</button>').join('')+'</div>';}
function useHint(i){const C=SS.cur;if(C.ans[i]!=null)return;C.assist[i]=1;drawSession();}
const ABCATS=['real','ph','prim','comp','gap','delta','read'];
function answerQ(i,o){const C=SS.cur;if(!C||C.ans[i]!=null||i!==C.step)return;C.ans[i]=o;const q=C.q[i];const ok=o===q.a&&!C.assist[i];
 recordStep(q.cat,ok);SS.tally[q.cat]=SS.tally[q.cat]||{n:0,c:0};SS.tally[q.cat].n++;if(ok){SS.tally[q.cat].c++;S.xp=(S.xp||0)+2;}
 if(q.cat==='read'&&!C.c.bad){const allAB=C.q.every((x,j)=>!ABCATS.includes(x.cat)||j>i||(C.ans[j]===x.a&&!C.assist[j]));const st=kindStat(C.c.kind);const now=Date.now();
  if(st.last&&now-st.last>=3*864e5){S.ret.n++;if(allAB)S.ret.c++;}
  st.n++;if(allAB){st.c++;st.box=Math.min(5,(st.box||0)+1);}else st.box=0;st.due=now+[0,1,3,7,16,35][st.box]*864e5;st.last=now;
  S.conf.push({c:C.conf,ok:allAB});if(S.conf.length>300)S.conf.shift();}
 C.step=i+1;
 if(C.step>=C.q.length){const all=C.q.every((x,j)=>C.ans[j]===x.a&&!C.assist[j]);S.read++;touchDay(1);addXP(all?10:0);
  SS.res.push({ok:all,kind:C.c.kind,label:C.c.bad?'Inconsistent gas':C.c.label,missed:C.q.filter((x,j)=>C.ans[j]!==x.a||C.assist[j]).map(x=>x.cat)});
  if(!all&&!C.c.bad&&SS.mode!=='mist')saveMistake(C.c);
  if(SS.mode==='mist'&&all){S.mist=(S.mist||[]).filter(x=>x.id!==C.c._mid);toast('Cleared from your mistakes','good');}}
 save();drawSession();}
function caseFeedback(){const C=SS.cur,c=C.c,o=c.o;const res=SS.res[SS.res.length-1];const last=SS.res.length>=SS.n;
 const head=res.ok?'Every step right.':'Missed: '+res.missed.map(x=>STEPNAME[x].toLowerCase()).join(', ')+'.';
 if(c.bad)return '<div class="fb no" id="caseFb"><div class="verdict"><i>!</i>This gas does not add up</div><p style="margin:0">'+o.steps.find(s=>s.k==='real').d+'</p><p class="note">On a real printout, the analyser calculates HCO₃⁻ from pH and PCO₂, so a mismatch means the numbers were copied wrongly, come from different samples, or a laboratory total CO₂ was mixed with a gas pH. Stop and recheck before interpreting.</p><div class="btnrow"><button class="btn ghost" id="fbCopy">'+ic('copy')+'Copy line</button><button class="btn" id="fbNext">'+(last?'See summary':'Next case')+' →</button></div></div>';
 return '<div class="fb '+(res.ok?'ok':'no')+'" id="caseFb"><div class="verdict"><i>'+(res.ok?'✓':'✗')+'</i>'+esc(head)+'</div>'+
 '<div class="dgrid"><div style="display:grid;gap:12px;min-width:0"><div class="bigread">'+esc(o.label)+'</div><p class="line">'+esc(o.line)+'</p><div class="btnrow"><button class="btn" id="fbNext">'+(last?'See summary':'Next case')+' →</button><button class="btn ghost" id="fbCopy">'+ic('copy')+'Copy for Black</button></div><div class="cvwrap"><canvas id="fbMap" aria-label="Acid–base map with this gas"></canvas></div></div>'+stepsHTML(o)+'</div></div>';}
function stepsHTML(o){return '<div style="display:grid;gap:10px;min-width:0"><ol class="stepl">'+o.steps.map((s,i)=>'<li class="'+s.tone+'"><i>'+(i+1)+'</i><b><small>'+s.t+'</small>'+s.v+'</b><p>'+s.d+'</p></li>').join('')+'</ol>'+
 (o.unsure&&o.unsure.length?'<div class="unsure"><div class="eyebrow" style="margin-bottom:6px">How sure is this?</div><ul class="causes">'+o.unsure.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>':'')+
 (o.causes.length?'<div><div class="eyebrow" style="margin-bottom:6px">Think about</div><ul class="causes">'+o.causes.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>':'')+'</div>';}
const SNAPF=['pH','pco2','hco3','po2','fio2','na','k','cl','alb','lac','glu','urea','osm','age','sample','cause','vig','kind','cohb','methb','spo2'];
function saveMistake(c){const s={};SNAPF.forEach(k=>{if(c[k]!=null)s[k]=c[k];});const id=c.kind+'-'+c.pH+'-'+c.pco2+'-'+c.hco3;S.mist=(S.mist||[]).filter(x=>x.id!==id);S.mist.push({id,c:s,label:c.label,lvl:SS.lvl,t:Date.now()});if(S.mist.length>40)S.mist.shift();}

/* ---- which gas fits ---- */
const COMPS={hagma:['hag'],hag_rac:['hag','rac'],hag_ralk:['hag','ralk'],hag_malk:['hag','malk'],hag_nag:['hag','nag'],hag_malk_ralk:['hag','malk','ralk'],nagma:['nag'],malk:['malk'],rac_a:['rac'],rac_c:['rac'],rac_ac:['rac'],rac_malk:['rac','malk'],ralk_a:['ralk'],ralk_c:['ralk'],ralk_malk:['ralk','malk']};
function newFit(){const ks=Object.keys(KINDS);let k=pick(ks),c=null;for(let i=0;i<6&&!c;i++){k=pick(ks);c=genCase(k,3,{strict:true});}if(!c){c=safeCase('hagma',3);k=c.kind;}
 const mine=COMPS[k];const pool=shuffle(ks.filter(x=>!COMPS[x].some(y=>mine.includes(y))));
 const picked=[];const seen=new Set();pool.forEach(x=>{const f=COMPS[x].join('+');if(picked.length<3&&!seen.has(f)){seen.add(f);picked.push(x);}});
 pool.forEach(x=>{if(picked.length<3&&!picked.includes(x))picked.push(x);});
 const gases=[c];picked.forEach(x=>{let g=null;for(let i=0;i<6&&!g;i++)g=genCase(x,3,{strict:true});if(g)gases.push(g);});
 return {c,gases:shuffle(gases),ans:null};}
function fitHTML(){const F=SS.cur.fit;const AB='ABCD';const ans=F.ans!=null;const right=ans&&F.gases[F.ans]===F.c;const last=SS.res.length>=SS.n;
 return '<div class="card raised" style="display:flex;flex-direction:column;gap:10px"><span class="eyebrow">Predict, then pick</span><p class="vig" style="font-size:1.15rem;font-weight:700">'+esc(F.c.vig)+'</p>'+(ans?'':'<p class="note">Before you look: will the pH be up or down? What will the PCO₂ and HCO₃⁻ do? Will there be a gap?</p>')+'</div>'+
 '<div class="fitgrid">'+F.gases.map((g,i)=>{const isC=g===F.c;return '<button class="card fitc'+(ans?(isC?' right':i===F.ans?' wrong':''):'')+'" data-g="'+i+'"'+(ans?' disabled':'')+'><div class="btnrow" style="justify-content:space-between"><b class="px" style="font-size:11px">Gas '+AB[i]+' · '+(i+1)+'</b>'+(ans?'<span class="chip '+(isC?'good':'')+'">'+esc(g.label)+'</span>':'')+'</div>'+slip(g,{lv:3})+'</button>';}).join('')+'</div>'+
 (ans?'<div class="fb '+(right?'ok':'no')+'" id="caseFb"><div class="verdict"><i>'+(right?'✓':'✗')+'</i>'+(right?'Right gas.':'It was gas '+AB[F.gases.indexOf(F.c)]+'.')+'</div><p style="margin:0">'+esc(CAUSES[F.c.cause])+' gives '+esc(F.c.label.toLowerCase())+'. The others share none of its disorders.</p>'+stepsHTML(F.c.o)+'<div class="btnrow"><button class="btn" id="fbNext">'+(last?'See summary':'Next patient')+' →</button></div></div>':'');}
function bindFit(){const host=$('v-session');host.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>answerFit(+b.dataset.g));if($('fbNext'))$('fbNext').onclick=nextItem;}
function answerFit(i){const F=SS.cur&&SS.cur.fit;if(!F||F.ans!=null||!F.gases[i])return;F.ans=i;const ok=F.gases[i]===F.c;recordStep('fit',ok);if(ok)addXP(5);S.read++;touchDay(1);SS.res.push({ok,kind:F.c.kind,label:F.c.label,missed:ok?[]:['fit']});save();drawSession();
 const fb=$('caseFb');if(fb)fb.scrollIntoView({block:'start',behavior:RM()?'auto':'smooth'});}

/* ---- compensation gym ---- */
function gymItem(){const U=PU();const t=pick(['mac','mac','malk','raca','racc','ralka','ralkc','judge','judge']);const R=x=>Math.round(x);
 const opts4=(correct,cands)=>{const out=[correct];for(const v of cands){if(out.every(x=>Math.abs(x-v)>=3))out.push(v);if(out.length===4)break;}let k=1;while(out.length<4){const v=correct+k*7*(k%2?1:-1);if(out.every(x=>Math.abs(x-v)>=3)&&v>4)out.push(v);k++;}return out;};
 if(t==='mac'){const h=R(rnd(6,20)),e=1.5*h+8;const o=opts4(R(e),[R(e+6),R(e-6),R(0.7*h+20),R(h+25)]);return {kind:'Metabolic acidosis',q:'HCO₃⁻ '+h+' mmol/L. Expected PCO₂?',opts:shuffle(o.map(v=>P(v)+' '+U)),a:P(R(e))+' '+U,why:'Winter\'s: 1.5 × '+h+' + 8 = '+r1(e)+' (± 2 → '+P(e-2)+'–'+P(e+2)+' '+U+').'};}
 if(t==='malk'){const h=R(rnd(30,44)),e=0.7*h+20;const o=opts4(R(e),[R(e+8),R(e-8),R(1.5*h+8),R(40)]);return {kind:'Metabolic alkalosis',q:'HCO₃⁻ '+h+' mmol/L. Expected PCO₂?',opts:shuffle(o.map(v=>P(v)+' '+U)),a:P(R(e))+' '+U,why:'0.7 × '+h+' + 20 = '+r1(e)+' (± 5).'};}
 if(t==='raca'||t==='racc'){const p=R(rnd(55,90)),d=(p-40)/10,a=24+d,c=24+4*d,acute=t==='raca';const cor=R(acute?a:c);const o=opts4(cor,[R(acute?c:a),24,R(24+2*d),R(24+3*d)]);
  return {kind:(acute?'Acute':'Chronic')+' respiratory acidosis',q:'PCO₂ '+P(p)+' '+U+'. Expected HCO₃⁻?',opts:shuffle(o.map(String)),a:String(cor),why:'PCO₂ is '+r1(d*10)+' mmHg above 40: '+(acute?'+1':'+4')+' per 10 → 24 + '+r1(acute?d:4*d)+' = '+r1(acute?a:c)+' (± 2).'};}
 if(t==='ralka'||t==='ralkc'){const p=R(rnd(18,32)),d=(40-p)/10,a=24-2*d,c=24-5*d,acute=t==='ralka';const cor=R(acute?a:c);const o=opts4(cor,[R(acute?c:a),24,R(24-d),R(24-3.5*d)]);
  return {kind:(acute?'Acute':'Chronic')+' respiratory alkalosis',q:'PCO₂ '+P(p)+' '+U+'. Expected HCO₃⁻?',opts:shuffle(o.map(String)),a:String(cor),why:'PCO₂ is '+r1(d*10)+' mmHg below 40: '+(acute?'−2':'−5')+' per 10 → 24 − '+r1(acute?2*d:5*d)+' = '+r1(acute?a:c)+' (± 2).'};}
 const h=R(rnd(7,18)),e=1.5*h+8,sh=pick([-7,0,0,7]),m=R(e+sh+rnd(-0.8,0.8));const optsJ=['Appropriate','Too high → added respiratory acidosis','Too low → added respiratory alkalosis'];const ans=m>e+2?optsJ[1]:m<e-2?optsJ[2]:optsJ[0];
 return {kind:'Metabolic acidosis',q:'HCO₃⁻ '+h+', measured PCO₂ '+P(m)+' '+U+'. Compensation?',opts:optsJ,a:ans,why:'Winter\'s: 1.5 × '+h+' + 8 = '+r1(e)+' ± 2 → '+P(e-2)+'–'+P(e+2)+'. Measured '+P(m)+'.'};}
function gymHTML(){const G=SS.cur.g,ans=SS.cur.ans;const last=SS.res.length>=SS.n;
 return '<div class="'+(G.slip?'dgrid':'')+'">'+(G.slip?'<div class="card stick" style="display:flex;flex-direction:column;gap:12px"><p class="vig">'+esc(G.q)+'</p>'+G.slip+'</div>':'')+'<div class="card raised" style="display:flex;flex-direction:column;gap:18px;'+(G.slip?'':'max-width:760px;margin:0 auto;width:100%')+'"><span class="chip acc" style="align-self:flex-start">'+esc(G.kind)+'</span><p class="gymq">'+(G.slip?'What is the read?':esc(G.q))+'</p><div class="opts">'+G.opts.map((o,i)=>{let cl='opt';if(ans!=null){if(o===G.a)cl+=' right';else if(o===ans)cl+=' wrong';}return '<button class="'+cl+'" data-o="'+i+'"'+(ans!=null?' disabled':'')+'><kbd>'+(i+1)+'</kbd><span'+(SS.mode==='gym'?' style="font:700 1.05rem var(--f-mono)"':'')+'>'+esc(o)+'</span></button>';}).join('')+'</div>'+(ans!=null&&ans!==G.a?'<p class="why no"><b>Answer: '+esc(G.a)+'.</b> '+esc(G.why)+'</p><div class="btnrow"><button class="btn" id="fbNext">'+(last?'See summary':'Next')+' →</button></div>':ans!=null?'<p class="why ok"><b>Right.</b> '+esc(G.why)+'</p>':'')+'</div></div>';}
function bindGym(){const host=$('v-session');host.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answerGym(+b.dataset.o));if($('fbNext'))$('fbNext').onclick=nextItem;}
function answerGym(i){const C=SS.cur;if(!C||C.ans!=null)return;const o=C.g.opts[i];if(o==null)return;C.ans=o;const ok=o===C.g.a;
 if(SS.mode==='gym'){S.gym.n++;if(ok)S.gym.c++;recordStep('comp',ok);if(ok)addXP(3);}
 else if(SS.mode==='boss'){recordStep('boss',ok);if(ok)addXP(4);}
 else{S.read++;touchDay(1);if(ok)addXP(6);}
 SS.res.push({ok,kind:null,label:SS.mode==='final'?C.g.a:C.g.kind,missed:ok?[]:[SS.mode==='gym'?'gym':SS.mode==='boss'?'boss':'read'],t:performance.now()-C.t0});save();drawSession();
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
 else{const comp=c.o.steps.find(s=>s.k==='comp'),gap=c.o.steps.find(s=>s.k==='gap');$('rWhy').innerHTML='<p class="why no"><b>'+esc(c.label)+(R.stage===1?' · '+esc(want):'')+'.</b> '+comp.d+(SS.lvl>=3&&gap?' '+gap.v+'.':'')+'</p><button class="btn" id="fbNext">Next (Enter) →</button>';$('fbNext').onclick=nextItem;}}

/* ---- summary ---- */
function finishSession(early,timeout){if(!SS||SS.done)return;clearInterval(SS.timer);clearInterval(SS.clock);const n=SS.res.length,ok=SS.res.filter(r=>r.ok).length,acc=n?ok/n:0;const mins=Math.max(1,Math.round((Date.now()-SS.t0)/60000));
 if(n){S.sess=S.sess||[];S.sess.push({d:today(),m:SS.mode,n,ok});if(S.sess.length>120)S.sess.shift();save();}
 const host=$('v-session');const isRef=SS.mode==='reflex';const med=isRef?median(SS.res.map(r=>r.t))/1000:null;const auto=isRef&&n>=20&&acc>=0.9&&med<=8;
 const tl=Object.keys(SS.tally).filter(k=>SS.tally[k].n);if(SS.mode==='gotd'){S.ui=S.ui||{};S.ui.gotd=today();}
 let msg=acc===1&&n>=5?'Perfect session.':acc>=0.8?'Strong session.':acc>=0.5?'Solid practice. The misses are where the learning is.':'Tough round. Slow down and use the hints; accuracy first, then speed.';
 if(isRef)msg=auto?'Automatic at level '+SS.lvl+'.':acc>=0.9?'Accurate. Now get faster.':'Accuracy first, then speed.';
 const w=weakestStep();let badge='';
 if(SS.mode==='boss'){const need=Math.ceil(SS.n*0.8);if(ok>=need){const k='m-'+SS.mod;const first=!S.badges[k];S.badges[k]=ddmmyyyy();if(first)addXP(120);msg=(first?'Boss beaten. Badge earned.':'Boss beaten again.');badge='<span class="chip good">'+esc(MBYID[SS.mod].t)+' ✓</span>';}else msg=(timeout?'Time ran out. ':'')+ok+' of '+SS.n+'; '+need+' wins. Re-read the module and try again.';}
 if(SS.mode==='final'){if(ok>=10){const first=!S.badges.native;S.badges.native=ddmmyyyy();if(first)addXP(200);msg=first?'Native reader. Badge earned.':'Native reader again.';badge='<span class="chip good">Native reader ✓</span>';}else msg=(timeout?'Time ran out. ':'')+ok+' of 12; ten wins.';}
 save();
 host.innerHTML='<div class="card raised" style="display:flex;flex-direction:column;gap:18px"><div class="sumhead"><div class="bigscore"><div><b>'+Math.round(acc*100)+'%</b><small>'+ok+'/'+n+'</small></div></div><div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="eyebrow">'+esc(SS.title||(SS.mode==='boss'?'Boss · '+MBYID[SS.mod].t:MODES[SS.mode].t))+(timeout?' · time up':early?' · ended early':' · complete')+'</span><h1 style="font-size:clamp(18px,3vw,24px)">'+esc(msg)+'</h1>'+badge+'<div class="stats"><div><b>'+n+'</b><small>'+(SS.mode==='gym'?'sums':'gases')+'</small></div><div><b>'+mins+' min</b><small>time</small></div>'+(isRef?'<div><b>'+med.toFixed(1)+' s</b><small>median</small></div>':'')+'<div><b>'+todayN()+'/'+(S.goal||15)+'</b><small>today</small></div><div><b>'+(S.xp||0)+'</b><small>XP</small></div></div></div></div>'+
 (tl.length?'<div><div class="eyebrow" style="margin-bottom:10px">This session, by step</div><div class="slips">'+tl.map(k=>{const s=SS.tally[k],p=Math.round(s.c/s.n*100);return '<div class="sb"><span>'+STEPNAME[k]+'</span><div class="bar"><i style="width:'+p+'%;background:'+(p>=85?'var(--good)':p>=65?'var(--warn)':'var(--bad)')+'"></i></div><b>'+p+'%</b><small>'+s.c+'/'+s.n+'</small></div>';}).join('')+'</div></div>':'')+
 '<div><div class="eyebrow" style="margin-bottom:10px">Cases</div><div class="caselist">'+SS.res.map((r,i)=>'<div><span class="d'+(r.ok?'':' x')+'"></span><span>'+esc(r.label)+'</span><small>'+(r.ok?'':esc(r.missed.map(x=>STEPNAME[x]).join(', ')))+(r.t&&isRef?' '+(r.t/1000).toFixed(1)+' s':'')+'</small></div>').join('')+'</div></div>'+
 (w&&!isRef?'<p class="note">Your weakest step overall is <b>'+STEPNAME[w.c].toLowerCase()+'</b> ('+Math.round(w.a*100)+'%). '+(w.c==='comp'?'The compensation gym targets it directly.':'Hints for it stay open until you are consistently right.')+'</p>':'')+
 (SS.round&&ROUND?'<div class="btnrow"><button class="btn primary big" id="sLeg">Next leg of the Round →</button></div>':'')+'<div class="btnrow"><button class="btn'+(SS.round?'':' primary')+'" id="sAgain">'+ic('redo')+'Go again</button>'+(isRef&&auto&&SS.lvl<4?'<button class="btn ghost" id="sUp">Level '+(SS.lvl+1)+' →</button>':'')+((S.mist||[]).length&&SS.mode!=='mist'?'<button class="btn ghost" data-mist="1">Revisit '+S.mist.length+' mistakes</button>':'')+'<button class="btn ghost" data-go="practice">Practice</button><button class="btn quiet" data-go="today">Today</button></div></div>';
 const mode=SS.mode,lv=SS.lvl,mod=SS.mod,kind=SS.kind,wasRound=SS.round;SS.done=true;
 $('sAgain').onclick=()=>startSession(mode,{mod,kind});if($('sLeg'))$('sLeg').onclick=()=>roundLegDone();if($('sUp'))$('sUp').onclick=()=>{S.reflex.lvl=lv+1;save();startSession('reflex');};
 host.querySelectorAll('[data-mist]').forEach(b=>b.onclick=()=>startSession('mist'));
 if(acc===1&&n>=5||badge)confetti();window.scrollTo(0,0);renderHeader();}

document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea')||e.metaKey||e.ctrlKey||e.altKey)return;
 if(VIEW!=='session'||!SS||SS.done)return;const n=parseInt(e.key,10);const m=SS.mode;
 if(e.key==='Escape'){$('sExit')&&$('sExit').click();return;}
 if(m==='fit'){if(n>=1&&n<=4)answerFit(n-1);else if(e.key==='Enter'&&$('fbNext'))nextItem();return;}
 if(m==='gym'||m==='boss'||m==='final'){if(n>=1&&n<=4)answerGym(n-1);else if(e.key==='Enter'&&$('fbNext'))nextItem();return;}
 if(m==='reflex'){if(n>=1&&n<=6)reflexAnswer(n-1);else if((e.key==='Enter'||e.key===' ')&&$('fbNext')){e.preventDefault();nextItem();}return;}
 const C=SS.cur;if(!C||!C.q)return;
 if(n>=1&&n<=7){const q=C.q[C.step];if(q&&q.opts[n-1])answerQ(C.step,q.opts[n-1]);}
 else if((e.key==='h'||e.key==='H')&&C.q[C.step])useHint(C.step);
 else if(e.key==='Enter'&&C.step>=C.q.length)nextItem();});
