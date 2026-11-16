/* ================= 4.6: the case library — chat cases, image-led cases, timed simulations with debrief ================= */
VIEWS.push('cases');SUBV.push('cases');TABOF.cases='practice';
let CS=null;
const FMT={chat:'Chat',image:'Image-led',sim:'Timed sim'};
function caseDone(id){return (S.cases||{})[id];}
function caseFilters(){S.ui=S.ui||{};return S.ui.cf=S.ui.cf||{fmt:'',pres:'',set:'',exam:''};}
function caseList(){const f=caseFilters();return CASES.filter(c=>(!f.fmt||c.fmt===f.fmt)&&(!f.pres||c.pres===f.pres)&&(!f.set||c.set===f.set)&&(!f.exam||(f.exam==='none'?!(c.exam||[]).length:(c.exam||[]).includes(f.exam))));}
function openCase(id){const c=CASES.find(x=>x.id===id);if(!c)return;stopSim();CS=c.fmt==='sim'?simNew(c):{c,i:0,tried:{},wrong:0,wrongSteps:new Set(),log:[]};go('cases');try{history.replaceState(history.state,'','#case-'+id);}catch(e){}window.scrollTo(0,0);}
RENDER.cases=function(arg){const el=$('v-cases');if(typeof arg==='string'&&arg.startsWith('case-')&&(!CS||CS.c.id!==arg.slice(5))){const c=CASES.find(x=>x.id===arg.slice(5));if(c){CS=c.fmt==='sim'?simNew(c):{c,i:0,tried:{},wrong:0,wrongSteps:new Set(),log:[]};}}
 if(!CS)return caseLib(el);if(CS.sim)return simRender(el);return caseStep(el);};
function chipRow(key,label,opts){const f=caseFilters();return '<div class="frow"><span class="eyebrow">'+label+'</span><div class="seg wrap" role="group" aria-label="'+label+'"><button data-f="'+key+'" data-v="" aria-pressed="'+!f[key]+'">All</button>'+opts.map(o=>'<button data-f="'+key+'" data-v="'+esc(o[0])+'" aria-pressed="'+(f[key]===o[0])+'">'+esc(o[1])+'</button>').join('')+'</div></div>';}
function caseLib(el){const list=caseList(),done=CASES.filter(c=>caseDone(c.id)).length,nb=(S.cmist||[]).filter(x=>!x.del);
 el.innerHTML='<div class="crumbs"><button data-go="practice">← Practice</button></div><div class="view-head"><div class="ph"><span class="eyebrow">'+CASES.length+' cases · '+done+' done</span><h1>Case library</h1><p>Real-world cases in three formats. Filter by what walks in, the setting, or your exam.</p></div></div>'+
  '<div class="card filters">'+chipRow('fmt','Format',Object.entries(FMT))+chipRow('pres','Presentation',Object.entries(CASE_PRES).filter(([k])=>CASES.some(c=>c.pres===k)))+chipRow('set','Setting',CASE_SET.filter(s=>CASES.some(c=>c.set===s)).map(s=>[s,s]))+chipRow('exam','Exam',[['MRCEM','MRCEM'],['USMLE','USMLE Step 1/2'],['none','Untagged']])+'</div>'+
  (list.length?'<div class="tiles">'+list.map(c=>{const r=caseDone(c.id);return '<button class="tile'+(r?' on':'')+'" data-case="'+c.id+'"><span class="mono-mark">'+ic(c.fmt==='sim'?'timer':c.fmt==='image'?'lab':'scen')+'</span><span><small class="meta">'+FMT[c.fmt]+' · '+esc(c.set)+' · '+esc(CASE_PRES[c.pres]||'')+((c.exam||[]).length?' · '+c.exam.join(', '):'')+(r?' · '+esc(r.res||'done'):'')+'</small><b>'+esc(c.t)+'</b><span class="d">'+esc(c.intro)+'</span></span></button>';}).join('')+'</div>':'<div class="empty"><b>No case matches</b><span>Clear a filter.</span></div>')+
  '<details class="card"'+(nb.length?'':' hidden')+'><summary><span class="eyebrow">Mistake notebook · '+nb.length+'</span></summary><div class="nb">'+nb.slice().reverse().map(x=>'<div class="nbi"><small class="muted">'+esc(x.d)+' · '+esc(x.ct)+(x.why?' · '+esc((WHY.find(w=>w[0]===x.why)||[,''])[1]):'')+'</small><b>'+esc(x.q)+'</b><span class="bad">You: '+esc(x.a)+'</span><span class="good">Right: '+esc(x.r)+'</span><div class="btnrow"><button class="btn small" data-case="'+x.cid+'">Redo the case</button><button class="btn small ghost" data-nbdel="'+x.id+'">Remove</button></div></div>').join('')+'</div></details>';
 el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{caseFilters()[b.dataset.f]=b.dataset.v;save();caseLib(el);});
 el.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>openCase(b.dataset.case));
 el.querySelectorAll('[data-nbdel]').forEach(b=>b.onclick=()=>{const x=(S.cmist||[]).find(y=>y.id===b.dataset.nbdel);if(x){x.del=true;x.u=Date.now();save();}caseLib(el);});}

/* ---- images drawn in SVG ---- */
function capnoSVG(k){const W=320,H=110,base=96,top=30;let d='M0 '+base;const cyc=4,cw=W/cyc;
 for(let i=0;i<cyc;i++){const x=i*cw;if(k==='flat'&&i>=2){d+=' L'+(x+cw)+' '+base;continue;}
  if(k==='shark')d+=' L'+(x+cw*0.1)+' '+base+' Q'+(x+cw*0.18)+' '+(top+30)+' '+(x+cw*0.55)+' '+top+' L'+(x+cw*0.6)+' '+top+' L'+(x+cw*0.64)+' '+base+' L'+(x+cw)+' '+base;
  else if(k==='cleft')d+=' L'+(x+cw*0.1)+' '+base+' L'+(x+cw*0.15)+' '+top+' L'+(x+cw*0.3)+' '+(top-2)+' L'+(x+cw*0.34)+' '+(top+22)+' L'+(x+cw*0.38)+' '+(top-3)+' L'+(x+cw*0.55)+' '+(top-4)+' L'+(x+cw*0.6)+' '+base+' L'+(x+cw)+' '+base;
  else d+=' L'+(x+cw*0.1)+' '+base+' L'+(x+cw*0.15)+' '+top+' L'+(x+cw*0.55)+' '+(top-4)+' L'+(x+cw*0.6)+' '+base+' L'+(x+cw)+' '+base;}
 return '<svg viewBox="0 0 '+W+' '+(H+18)+'" class="img-capno" role="img" aria-label="Capnography trace"><rect width="'+W+'" height="'+(H+18)+'" class="scr"/>'+[0,1,2,3].map(i=>'<line x1="0" x2="'+W+'" y1="'+(base-i*22)+'" y2="'+(base-i*22)+'" class="grid"/>').join('')+'<path d="'+d+'" class="wave"/><text x="6" y="'+(H+12)+'" class="lab">ETCO₂ · mmHg</text><text x="'+(W-6)+'" y="16" class="lab" text-anchor="end">'+(k==='flat'?'0':k==='shark'?'48':'36')+'</text></svg>';}
function syringeSVG(k){const col={methb:'#5a3a26',art:'#c8102e',ven:'#6e1020'}[k]||'#c8102e';return '<svg viewBox="0 0 320 110" class="img-syr" role="img" aria-label="Blood gas syringe with '+(k==='methb'?'chocolate-brown':'red')+' blood"><rect width="320" height="110" class="scr"/><rect x="40" y="40" width="190" height="34" rx="4" fill="#e9eef2" stroke="#9aa"/><rect x="44" y="44" width="150" height="26" fill="'+col+'"/><rect x="230" y="50" width="60" height="14" fill="#cfd6dc"/><rect x="286" y="36" width="10" height="42" fill="#b8c0c6"/><rect x="18" y="52" width="22" height="10" fill="#cfd6dc"/><rect x="250" y="12" width="56" height="20" fill="'+col+'" stroke="#9aa"/><text x="236" y="26" class="lab" text-anchor="end">after 1 min in air</text></svg>';}
function monitorSVG(o){const row=(y,l,v,c)=>'<text x="14" y="'+y+'" class="lab">'+l+'</text><text x="306" y="'+y+'" class="big" text-anchor="end" fill="'+c+'">'+v+'</text>';
 return '<svg viewBox="0 0 320 150" class="img-mon" role="img" aria-label="Monitor and co-oximetry values"><rect width="320" height="150" class="scr"/>'+row(32,'SpO₂ (pulse oximeter)',o.spo2+'%','#4fd1ff')+row(64,'SaO₂ (co-oximeter)',o.sao2co+'%','#ffd166')+row(96,'PaO₂',P(o.po2)+' '+PU(),'#ffffff')+row(128,o.methb!=null?'MetHb':'COHb',(o.methb!=null?o.methb:o.cohb)+'%','#ff6b6b')+'</svg>';}
function dipSVG(o){const pad=(x,lab,n,cols)=>'<rect x="'+x+'" y="34" width="40" height="40" fill="'+cols[Math.min(cols.length-1,n)]+'" stroke="#888"/><text x="'+(x+20)+'" y="92" class="lab" text-anchor="middle">'+lab+'</text><text x="'+(x+20)+'" y="26" class="lab" text-anchor="middle">'+(n?'+'.repeat(n):'neg')+'</text>';
 return '<svg viewBox="0 0 320 110" class="img-dip" role="img" aria-label="Urine dipstick"><rect width="320" height="110" class="scr"/><rect x="10" y="30" width="300" height="48" fill="#f4f1e8"/>'+pad(30,'Blood',o.blood,['#f2e27a','#9cbf5a','#4f8a3a','#1f4f2a'])+pad(100,'Protein',o.prot,['#e8ec8a','#b9d77a','#7fb87a','#3f8a6a'])+pad(170,'Glucose',o.glu,['#7fd0d8','#8ab870','#a07a3a','#6a3a2a'])+pad(240,'Ketones',o.ket,['#f1d9c9','#d99aa0','#a0506a','#6a2a4a'])+'</svg>';}
function caseImg(im){if(!im)return '';if(im.type==='capno')return capnoSVG(im.k);if(im.type==='syringe')return syringeSVG(im.k);if(im.type==='monitor')return monitorSVG(im);if(im.type==='dip')return dipSVG(im);
 if(im.type==='print'){const v=Object.assign({k:4.2,glu:6.1,lac:1.1,fio2:0.21},im.v);return printout(v,false);}return '';}

/* ---- chat and image cases ---- */
function caseOrd(i){CS.ord=CS.ord||{};return CS.ord[i]=CS.ord[i]||spShuffle(CS.c.steps[i].o.map((_,k)=>k));}
function caseBubble(m){return '<div class="bub '+(m[0]==='Patient'||m[0]==='Brother'?'them':'staff')+'"><b>'+esc(m[0])+'</b><span>'+esc(m[1])+'</span></div>';}
function caseStep(el){const c=CS.c,st=c.steps[CS.i];
 if(!st)return caseEnd(el);
 const tried=CS.tried[CS.i]||{},solved=Object.keys(tried).some(k=>st.o[k][1]);
 const hist=c.steps.slice(0,CS.i).map((s,i)=>(s.m||[]).map(caseBubble).join('')+'<div class="bub me"><b>You</b><span>'+esc(s.o.find(o=>o[1])[0])+'</span></div>').join('');
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button><span class="eyebrow">'+FMT[c.fmt]+' · '+esc(c.set)+'</span><span class="eyebrow" style="margin-left:auto;color:var(--muted)">'+(CS.i+1)+' / '+c.steps.length+'</span></div>'+
  '<div class="card tint"><h2>'+esc(c.t)+'</h2><p class="vig" style="margin-top:6px">'+esc(c.intro)+'</p></div>'+
  '<div class="chat">'+hist+(st.m||[]).map(caseBubble).join('')+'</div>'+
  (st.img?'<div class="card caseimg">'+caseImg(st.img)+'</div>':'')+
  '<div class="'+(st.gas?'dgrid':'')+'">'+(st.gas?'<div class="card stick">'+slip(st.gas,{lv:4})+'</div>':'')+'<div class="card scn-step"><p class="ask">'+esc(st.q)+'</p><div class="scn-opts">'+caseOrd(CS.i).map((i,k)=>{const o=st.o[i],t=tried[i];return '<button class="opt'+(t?(o[1]?' right':' wrong'):'')+'" data-o="'+i+'"'+(t||solved?' disabled':'')+'><kbd>'+(k+1)+'</kbd><span>'+esc(o[0])+'</span></button>';}).join('')+'</div>'+
  Object.keys(tried).map(k=>'<p class="why '+(st.o[k][1]?'ok':'no')+'"><b>'+(st.o[k][1]?'Right.':'What happens:')+'</b> '+esc(st.o[k][2])+'</p>'+(!st.o[k][1]?autopsyRow(k):'')).join('')+
  (solved?'<div class="btnrow"><button class="btn primary" id="csNext">'+(CS.i+1<c.steps.length?'Next →':'Finish →')+'</button></div>':'')+'</div></div>';
 $('csBack').onclick=()=>{CS=null;RENDER.cases();try{history.replaceState(history.state,'','#cases');}catch(e){}};
 el.querySelectorAll('.opt[data-o]').forEach(b=>b.onclick=()=>caseAnswer(+b.dataset.o));
 el.querySelectorAll('[data-aut]').forEach(b=>b.onclick=()=>{const [k,w]=b.dataset.aut.split(':');const e=(S.cmist||[]).find(x=>x.key===CS.c.id+':'+CS.i+':'+k);if(e&&!e.why){e.why=w;e.u=Date.now();S.why=S.why||{};S.why[w]=(S.why[w]||0)+1;save();}b.parentElement.querySelectorAll('button').forEach(x=>{x.disabled=true;x.setAttribute('aria-pressed',x===b);});});
 if($('csNext'))$('csNext').onclick=()=>{CS.i++;RENDER.cases();window.scrollTo(0,0);};}
function autopsyRow(k){return '<div class="autopsy"><span class="eyebrow">Why did you pick it?</span><div class="seg wrap">'+WHY.map(w=>'<button data-aut="'+k+':'+w[0]+'">'+esc(w[1])+'</button>').join('')+'</div></div>';}
function caseAnswer(i){if(VIEW!=='cases'||!CS||CS.sim)return;const st=CS.c.steps[CS.i];if(!st||!st.o[i])return;const tried=CS.tried[CS.i]=CS.tried[CS.i]||{};if(tried[i]||Object.keys(tried).some(k=>st.o[k][1]))return;tried[i]=1;
 if(st.o[i][1])CS.log.push({q:st.q,a:st.o[i][0],ok:Object.keys(tried).length===1});
 else{CS.wrong++;CS.wrongSteps.add(CS.i);S.cmist=S.cmist||[];S.cmist.push({id:'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),key:CS.c.id+':'+CS.i+':'+i,cid:CS.c.id,ct:CS.c.t,q:st.q,a:st.o[i][0],r:st.o.find(o=>o[1])[0],d:ddmmyyyy(),u:Date.now()});if(S.cmist.length>200)S.cmist.splice(0,S.cmist.length-200);save();}
 RENDER.cases();}
function caseEnd(el){const c=CS.c,n=c.steps.length,ok=n-CS.wrongSteps.size;S.cases=S.cases||{};S.cases[c.id]={res:CS.wrong?CS.wrong+' wrong turn'+(CS.wrong>1?'s':''):'clean run',d:ddmmyyyy(),n:((S.cases[c.id]||{}).n||0)+1,last:Date.now()};
 S.sess=S.sess||[];S.sess.push({d:today(),m:'case',n,ok});if(S.sess.length>120)S.sess.shift();touchDay(n);addXP(Math.max(5,20-5*CS.wrong));save();
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button></div><div class="card raised" style="display:grid;gap:12px"><span class="eyebrow">Case complete</span><h1>'+esc(c.t)+'</h1><p>'+(CS.wrong?CS.wrong+' wrong turn'+(CS.wrong>1?'s':'')+'. They are in your mistake notebook.':'Clean run: every call right first time.')+'</p>'+caseSources(c)+'<div class="btnrow"><button class="btn primary" id="csAgain">Run it again</button><button class="btn" id="csAll">All cases</button></div></div>';
 $('csBack').onclick=$('csAll').onclick=()=>{CS=null;RENDER.cases();};$('csAgain').onclick=()=>openCase(c.id);}
function caseSources(c){const s=(c.src||[]).filter(i=>SRC[i]);return s.length?'<details><summary><span class="eyebrow">Sources</span></summary><ol class="srcl">'+s.map(i=>'<li>'+esc(SRC[i][1])+'</li>').join('')+'</ol></details>':'';}

/* ---- timed simulation ---- */
let SIMT=0;
function stopSim(){clearInterval(SIMT);SIMT=0;}
function simNew(c){return {c,sim:true,t:0,sev:c.sev0,drift:c.drift,done:{},at:{},ev:[{t:0,k:'start',txt:'Patient arrives.'}],pend:[],res:[],hist:[[0,c.sev0]],harm:{},paused:false,over:null};}
const lerp=(a,b,f)=>a+(b-a)*f;
function simVit(){const c=CS.c,f=Math.max(0,Math.min(1,CS.sev/100)),o={};Object.keys(c.vit0).forEach(k=>o[k]=Math.round(lerp(c.vit0[k],c.vit1[k],f)));return o;}
function simGas(sev){const c=CS.c,f=Math.max(0,Math.min(1,sev/100)),g={};Object.keys(c.gas0).forEach(k=>{const a=c.gas0[k],b=c.gas1[k];g[k]=typeof a==='number'?(k==='fio2'?a:Math.round(lerp(a,b,f)*10)/10):a;});g.pH=r2(phFrom(g.hco3,g.pco2));return g;}
function simAdvance(min){for(let m=0;m<min&&!CS.over;m++){CS.t++;CS.sev=Math.min(100,CS.sev+CS.drift);CS.hist.push([CS.t,Math.round(CS.sev)]);
  CS.pend=CS.pend.filter(p=>{if(p.at<=CS.t){CS.res.push(p);CS.ev.push({t:CS.t,k:'res',txt:'Result: '+p.l});return false;}return true;});
  if(CS.sev>=100){simEnd('arrest');return;}}}
function simAct(id){if(!CS||!CS.sim||CS.over)return;const a=CS.c.actions.find(x=>x.id===id);if(!a)return;const n=CS.done[id]||0;if(n>=(a.max||1)){toast('Already done.');return;}
 CS.done[id]=n+1;if(!CS.at[id])CS.at[id]=CS.t;CS.ev.push({t:CS.t,k:a.cat,txt:a.l});
 (a.req||[]).forEach(r=>{if(!CS.done[r]){CS.ev.push({t:CS.t,k:'warn',txt:a.reqMsg||'Done before '+r});}});
 if(a.warnIfNot&&!CS.done[a.warnIfNot])CS.ev.push({t:CS.t,k:'warn',txt:a.warnMsg});
 if(a.harm){CS.harm[id]=1;CS.ev.push({t:CS.t,k:'harm',txt:a.harm});}
 if(a.bad&&a.bad.ifK){const k=simGas(CS.sev).k;const lim=+a.bad.ifK.slice(1);if(a.bad.ifK[0]==='>'?k>lim:k<lim){CS.harm[id]=1;CS.sev=Math.min(100,CS.sev+(a.bad.sev||0));CS.ev.push({t:CS.t,k:'harm',txt:a.bad.msg});}}
 if(a.cat==='test'){const p={id,l:a.l,at:CS.t+(a.delay||0),ordered:CS.t,res:a.res,txt:a.txt,gas:a.res==='gas'?simGas(CS.sev):null};if(!a.delay){CS.res.push(p);CS.ev.push({t:CS.t,k:'res',txt:'Result: '+a.l});}else CS.pend.push(p);}
 if(a.txt&&a.cat!=='test')CS.ev.push({t:CS.t,k:'res',txt:a.txt});
 if(a.eff)CS.sev=Math.max(0,Math.min(100,CS.sev+a.eff));if(a.dm)CS.drift*=a.dm;
 simAdvance(a.cost||1);if(!CS.over)simRender($('v-cases'));}
function simEnd(kind){if(CS.over)return;stopSim();const c=CS.c,keysOK=c.key.every(k=>CS.done[k.a]);let e=null;
 for(const x of c.end){if(x.if==='arrest'&&kind==='arrest'){e=x;break;}if(kind==='arrest')continue;if(x.if.startsWith('harm:')&&CS.harm[x.if.slice(5)]&&keysOK){e=x;break;}if(x.if==='keys'&&keysOK&&CS.sev<75){e=x;break;}if(x.if==='else'){e=x;break;}}
 CS.over=e||{t:'Handed over',d:''};CS.ev.push({t:CS.t,k:'end',txt:CS.over.t});
 const good=kind!=='arrest'&&keysOK;S.cases=S.cases||{};S.cases[c.id]={res:CS.over.t,d:ddmmyyyy(),n:((S.cases[c.id]||{}).n||0)+1,last:Date.now(),best:Math.max(((S.cases[c.id]||{}).best||0),good?1:0)};
 S.sess=S.sess||[];S.sess.push({d:today(),m:'sim',n:c.key.length,ok:c.key.filter(k=>CS.at[k.a]!=null&&CS.at[k.a]<=k.by).length});if(S.sess.length>120)S.sess.shift();touchDay(1);save();simRender($('v-cases'));}
function simRender(el){if(!el)return;const c=CS.c,v=simVit();
 if(CS.over)return simDebrief(el);
 const vt=(lab,val,u,bad)=>'<div class="vit'+(bad?' bad':'')+'"><small>'+lab+'</small><b>'+val+'</b><i>'+u+'</i></div>';
 const cats=[['test','Tests'],['tx','Treatment'],['call','Call for help']];
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button><span class="eyebrow">Timed sim · '+esc(c.set)+'</span></div>'+
  '<div class="card tint"><h2>'+esc(c.t)+'</h2><p class="vig" style="margin-top:6px">'+esc(c.intro)+'</p></div>'+
  '<div class="card simbar"><div class="clock"><small>Time</small><b class="mono">'+String(Math.floor(CS.t/60)).padStart(2,'0')+':'+String(CS.t%60).padStart(2,'0')+'</b></div><div class="vits">'+vt('HR',v.hr,'/min',v.hr>120||v.hr<50)+vt('BP',v.sbp,'sys',v.sbp<90)+vt('RR',v.rr,'/min',v.rr>28||v.rr<10)+vt('SpO₂',v.spo2,'%',v.spo2<92)+vt('GCS',v.gcs,'',v.gcs<13)+'</div>'+
  '<div class="btnrow"><button class="btn small" id="simPause">'+(CS.paused?'Resume':'Pause')+'</button><button class="btn small" id="simWait">Wait 5 min</button><button class="btn small primary" id="simEnd">Hand over</button></div><div class="sevbar" aria-label="How unwell"><i style="width:'+Math.round(CS.sev)+'%"></i></div></div>'+
  '<div class="dgrid"><div class="card"><span class="eyebrow">Actions</span>'+cats.map(([k,l])=>{const as=c.actions.filter(a=>a.cat===k);return as.length?'<h4>'+l+'</h4><div class="acts">'+as.map(a=>{const n=CS.done[a.id]||0,mx=a.max||1;return '<button class="btn small act'+(n?' done':'')+'" data-a="'+a.id+'"'+(n>=mx?' disabled':'')+'>'+esc(a.l)+(a.cost?' <small>'+a.cost+' min</small>':'')+(n&&mx>1?' ×'+n:'')+'</button>';}).join('')+'</div>':'';}).join('')+'</div>'+
  '<div class="card"><span class="eyebrow">Results</span>'+(CS.res.length?CS.res.slice().reverse().map(r=>'<div class="simres"><small class="muted">'+esc(r.l)+' · ordered at '+r.ordered+' min</small>'+(r.gas?slip(r.gas,{lv:4}):'<p>'+esc(r.txt||'')+'</p>')+'</div>').join(''):'<p class="note">Nothing back yet.'+(CS.pend.length?' Waiting on '+CS.pend.length+'.':'')+'</p>')+(CS.pend.length&&CS.res.length?'<p class="note">Waiting on: '+CS.pend.map(p=>esc(p.l)+' ('+(p.at-CS.t)+' min)').join(', ')+'</p>':'')+'</div></div>'+
  '<div class="card"><span class="eyebrow">Events</span><ol class="tl">'+CS.ev.slice(-6).reverse().map(e=>'<li class="'+e.k+'"><span class="mono">'+e.t+'′</span> '+esc(e.txt)+'</li>').join('')+'</ol></div>';
 $('csBack').onclick=()=>{stopSim();CS=null;RENDER.cases();};
 $('simPause').onclick=()=>{CS.paused=!CS.paused;simRender(el);};$('simWait').onclick=()=>{simAdvance(5);if(!CS.over)simRender(el);};$('simEnd').onclick=()=>simEnd('handover');
 el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>simAct(b.dataset.a));
 if(!SIMT)SIMT=setInterval(()=>{if(!CS||!CS.sim||CS.over||VIEW!=='cases'){stopSim();return;}if(CS.paused||document.hidden)return;CS.tick=(CS.tick||0)+1;if(CS.tick%((S.ui&&S.ui.simPace)||3)===0){simAdvance(1);if(!CS.over)simRender($('v-cases'));}},1000);}
function simDebrief(el){const c=CS.c;const pts=CS.hist;const W=300,H=60,mx=Math.max(1,pts[pts.length-1][0]);const path=pts.map((p,i)=>(i?'L':'M')+(p[0]/mx*W).toFixed(1)+' '+(H-p[1]/100*H).toFixed(1)).join(' ');
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button><span class="eyebrow">Debrief</span></div><div class="card raised" style="display:grid;gap:10px"><span class="eyebrow">'+esc(c.t)+' · '+CS.t+' min</span><h1>'+esc(CS.over.t)+'</h1><p>'+esc(CS.over.d)+'</p>'+
  '<svg viewBox="0 0 '+W+' '+(H+4)+'" class="sevchart" role="img" aria-label="How unwell over time"><line x1="0" x2="'+W+'" y1="'+(H*0.25)+'" y2="'+(H*0.25)+'" class="grid"/><path d="'+path+'" class="tline"/></svg><small class="muted">How unwell over time (higher = worse; top = arrest)</small></div>'+
  '<div class="card"><span class="eyebrow">Key steps</span><table class="tbl"><tr><th>Step</th><th>Target</th><th>You</th></tr>'+c.key.map(k=>{const a=c.actions.find(x=>x.id===k.a),t=CS.at[k.a];return '<tr><td>'+esc(a?a.l:k.a)+'</td><td>by '+k.by+' min</td><td class="'+(t==null?'bad':t<=k.by?'good':'warn')+'">'+(t==null?'missed':t+' min'+(t<=k.by?' ✓':' (late)'))+'</td></tr>';}).join('')+'</table></div>'+
  '<div class="card"><span class="eyebrow">Timeline</span><ol class="tl">'+CS.ev.map(e=>'<li class="'+e.k+'"><span class="mono">'+e.t+'′</span> '+esc(e.txt)+'</li>').join('')+'</ol>'+caseSources(c)+'</div>'+
  '<div class="btnrow"><button class="btn primary" id="csAgain">Run it again</button><button class="btn" id="csAll">All cases</button></div>';
 $('csBack').onclick=$('csAll').onclick=()=>{CS=null;RENDER.cases();};$('csAgain').onclick=()=>openCase(c.id);}
document.addEventListener('keydown',e=>{if(VIEW!=='cases'||!CS||CS.sim||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;const n=parseInt(e.key,10);
 if(n>=1&&n<=4){const b=document.querySelectorAll('#v-cases .opt[data-o]')[n-1];if(b&&!b.disabled){b.click();e.preventDefault();}}else if(e.key==='Enter'&&$('csNext')){$('csNext').click();e.preventDefault();}});
/* entry point in Practice */
if(RENDER.practice){const _rp8=RENDER.practice;RENDER.practice=function(){_rp8();const el=$('v-practice');if(!el)return;const shelves=el.querySelectorAll('.shelf');const d=document.createElement('div');d.className='shelf';const done=CASES.filter(c=>caseDone(c.id)).length;
 d.innerHTML='<h2>Case library <small>chat, image-led, timed sims</small></h2><div class="tiles"><button class="tile on" id="openCases"><span class="mono-mark">'+ic('scen')+'</span><span><small class="meta">'+CASES.length+' cases · '+done+' done</small><b>Open the library</b><span class="d">Filter by presentation, disorder, setting or exam. Timed sims: the patient worsens while you wait.</span></span></button>'+
  ['sim','chat','image'].map(f=>'<button class="tile" data-fmt="'+f+'"><span class="mono-mark">'+ic(f==='sim'?'timer':f==='image'?'lab':'scen')+'</span><span><small class="meta">'+CASES.filter(c=>c.fmt===f).length+' cases</small><b>'+FMT[f]+'</b><span class="d">'+({sim:'ER and ICU resuscitations with delayed results and a debrief.',chat:'The story unfolds in messages; decide at each step.',image:'Capnography, syringes, dipsticks, printouts and monitors.'})[f]+'</span></span></button>').join('')+'</div>';
 if(shelves[0])shelves[0].after(d);else el.appendChild(d);
 $('openCases').onclick=()=>{CS=null;go('cases');};d.querySelectorAll('[data-fmt]').forEach(b=>b.onclick=()=>{const f=caseFilters();f.fmt=b.dataset.fmt;CS=null;go('cases');});};}
{const _route=route;route=function(h,first){const x=(h||'').replace(/^#/,'');if(x.startsWith('case-')&&CASES.some(c=>c.id===x.slice(5))){if(!CS||CS.c.id!==x.slice(5)||VIEW!=='cases')openCase(x.slice(5));return;}return _route(h,first);};}
