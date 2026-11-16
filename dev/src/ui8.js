/* ================= 4.6: the case library — chat cases, image-led cases, timed simulations with debrief ================= */
VIEWS.push('cases');SUBV.push('cases');TABOF.cases='practice';
let CS=null;
const FMT={chat:'Chat',image:'Image-led',sim:'Timed sim'};
function caseDone(id){return (S.cases||{})[id];}
function caseFilters(){S.ui=S.ui||{};return S.ui.cf=S.ui.cf||{fmt:'',pres:'',set:'',exam:''};}
/* sims sort by their "Resus N" number inside their own slots; everything else keeps the CASES order */
function ui8Ordered(){const sims=CASES.filter(c=>c.fmt==='sim').map((c,i)=>[c,i]).sort((a,b)=>{const n=x=>{const m=/Resus (\d+)/.exec(x[0].t);return m?+m[1]:99;};return n(a)-n(b)||a[1]-b[1];}).map(x=>x[0]);let k=0;return CASES.map(c=>c.fmt==='sim'?sims[k++]:c);}
function ui8NewCS(c,from){const cs={c,i:0,tried:{},wrong:0,wrongSteps:new Set(),log:[],mid:{},img:{},rec:false,seq:0,t0:Date.now()};
 if(from>0&&from<c.steps.length){for(let j=0;j<from;j++){const r=c.steps[j].o.findIndex(o=>o[1]);cs.tried[j]={[r]:1};}cs.i=from;cs.partial=true;}return cs;}
function caseList(){const f=caseFilters();return ui8Ordered().filter(c=>(!f.fmt||c.fmt===f.fmt)&&(!f.pres||c.pres===f.pres)&&(!f.set||c.set===f.set)&&(!f.exam||(f.exam==='none'?!(c.exam||[]).length:(c.exam||[]).includes(f.exam))));}
function openCase(id,from){const c=CASES.find(x=>x.id===id);if(!c)return;stopSim();CS=c.fmt==='sim'?simNew(c):ui8NewCS(c,from);go('cases');try{history.replaceState(history.state,'','#case-'+id);}catch(e){}window.scrollTo(0,0);}
RENDER.cases=function(arg){const el=$('v-cases');if(typeof arg==='string'&&arg.startsWith('case-')&&(!CS||CS.c.id!==arg.slice(5))){const c=CASES.find(x=>x.id===arg.slice(5));if(c){CS=c.fmt==='sim'?simNew(c):ui8NewCS(c);}}
 if(!CS)return caseLib(el);if(CS.sim)return simRender(el);return caseStep(el);};
function chipRow(key,label,opts){const f=caseFilters();return '<div class="frow"><span class="eyebrow">'+label+'</span><div class="seg wrap" role="group" aria-label="'+label+'"><button data-f="'+key+'" data-v="" aria-pressed="'+!f[key]+'">All</button>'+opts.map(o=>'<button data-f="'+key+'" data-v="'+esc(o[0])+'" aria-pressed="'+(f[key]===o[0])+'">'+esc(o[1])+'</button>').join('')+'</div></div>';}
let ui8FOpen=null,ui8NbOpen=false;
function ui8Why(k){const all=WHY.concat(typeof WHY_ACT!=='undefined'?WHY_ACT:[]);return (all.find(w=>w[0]===k)||[,''])[1];}
function ui8NbItem(x){const st=+(String(x.key||'').split(':')[1]);const c=CASES.find(y=>y.id===x.cid);
 return '<div class="nbi" data-nbi="'+esc(x.id)+'"><small class="muted">'+esc(x.d)+' · '+esc(x.ct)+(x.why?' · '+esc(ui8Why(x.why)):'')+'</small><b>'+esc(x.q)+'</b><span class="bad">You: '+esc(x.a)+'</span><span class="good">Right: '+esc(x.r)+'</span>'+(x.e?'<span class="muted">'+esc(x.e)+'</span>':'')+
  '<div class="btnrow">'+(c&&st>0&&st<c.steps.length?'<button class="btn small" data-retry="'+esc(x.cid)+':'+st+'">Retry this step</button>':'')+'<button class="btn small'+(c&&st>0?' ghost':'')+'" data-case="'+esc(x.cid)+'">Redo the case</button><button class="btn small ghost" data-nbdel="'+esc(x.id)+'">Remove</button></div></div>';}
function caseLib(el){const list=caseList(),done=CASES.filter(c=>caseDone(c.id)).length,nb=(S.cmist||[]).filter(x=>!x.del),f=caseFilters(),on=['fmt','pres','set','exam'].filter(k=>f[k]).length;
 if(ui8FOpen===null)ui8FOpen=on>0||innerWidth>560;
 el.innerHTML='<div class="crumbs"><button data-go="practice">← Practice</button></div><div class="view-head"><div class="ph"><span class="eyebrow">'+CASES.length+' cases · '+done+' done</span><h1>Case library</h1><p>Real-world cases in three formats. Filter by what walks in, the setting, or your exam.</p>'+(nb.length?'<p><button class="btn small ghost" id="nbJump">Mistake notebook · <span class="nbn">'+nb.length+'</span></button></p>':'')+'</div></div>'+
  '<details class="card filters" id="cfBox"'+(ui8FOpen?' open':'')+'><summary><span class="eyebrow">Filters'+(on?' · '+on+' on · '+list.length+' of '+CASES.length+' shown':'')+'</span></summary>'+chipRow('fmt','Format',Object.entries(FMT))+chipRow('pres','Presentation',Object.entries(CASE_PRES).filter(([k])=>CASES.some(c=>c.pres===k)))+chipRow('set','Setting',CASE_SET.filter(s=>CASES.some(c=>c.set===s)).map(s=>[s,s]))+chipRow('exam','Exam',[['MRCEM','MRCEM'],['USMLE','USMLE Step 1/2']].concat(CASES.some(c=>!(c.exam||[]).length)||f.exam==='none'?[['none','Untagged']]:[]))+'</details>'+
  (list.length?'<div class="tiles">'+list.map(c=>{const r=caseDone(c.id);return '<button class="tile'+(r?' on':'')+'" data-case="'+c.id+'"><span class="mono-mark">'+ic(c.fmt==='sim'?'timer':c.fmt==='image'?'lab':'scen')+'</span><span><small class="meta">'+FMT[c.fmt]+' · '+esc(c.set)+' · '+esc(CASE_PRES[c.pres]||'')+((c.exam||[]).length?' · '+c.exam.join(', '):'')+(r?' · '+esc(r.res||'done'):'')+'</small><b>'+esc(c.t)+'</b><span class="d">'+esc(c.intro)+'</span></span></button>';}).join('')+'</div>':'<div class="empty"><b>No case matches</b><span>Clear a filter.</span></div>')+
  '<details class="card" id="nbBox"'+(nb.length?'':' hidden')+(ui8NbOpen?' open':'')+'><summary><span class="eyebrow">Mistake notebook · <span class="nbn">'+nb.length+'</span></span></summary><div class="nb">'+nb.slice().reverse().map(ui8NbItem).join('')+'</div></details>';
 el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 $('cfBox').ontoggle=()=>{ui8FOpen=$('cfBox').open;};$('nbBox').ontoggle=()=>{ui8NbOpen=$('nbBox').open;};
 if($('nbJump'))$('nbJump').onclick=()=>{const d=$('nbBox');d.open=true;ui8NbOpen=true;d.scrollIntoView({block:'start',behavior:RM()?'auto':'smooth'});const s=d.querySelector('summary');if(s)s.focus();};
 el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const k=b.dataset.f;caseFilters()[k]=b.dataset.v;save();caseLib(el);const n=el.querySelector('[data-f="'+k+'"][data-v="'+CSS.escape(b.dataset.v)+'"]');if(n)n.focus();announce(caseList().length+' cases shown');});
 el.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>openCase(b.dataset.case));
 el.querySelectorAll('[data-retry]').forEach(b=>b.onclick=()=>{const p=b.dataset.retry.split(':');openCase(p[0],+p[1]);});
 el.querySelectorAll('[data-nbdel]').forEach(b=>b.onclick=()=>{const xi=(S.cmist||[]).findIndex(y=>y.id===b.dataset.nbdel);if(xi>=0){const x=S.cmist[xi];S.cmist[xi]={id:x.id,key:x.key,u:Date.now(),del:true};save();}
  const row=b.closest('.nbi'),nx=row&&(row.nextElementSibling||row.previousElementSibling);if(row)row.remove();const n=(S.cmist||[]).filter(y=>!y.del).length;el.querySelectorAll('.nbn').forEach(s=>s.textContent=n);
  if(!n){$('nbBox').hidden=true;const j=$('nbJump');if(j)j.parentElement.remove();announce('Notebook empty.');}else{announce('Removed. '+n+' left.');const t=nx&&nx.querySelector('[data-nbdel]');if(t)t.focus();}});}

/* ---- images drawn in SVG ---- */
/* Capnograph: y is scaled from the ETCO₂ (0–50 mmHg axis), so the drawn height and the number agree. Values per trace kind. */
const UI8_CAPNO={normal:{v:38,rr:12,lab:'sharp upstroke, flat plateau, baseline at zero'},shark:{v:48,rr:14,lab:'slow sloping upstroke with no flat plateau'},cleft:{v:36,rr:12,lab:'sharp upstroke, plateau with a notch part-way along that varies from breath to breath'},flat:{v:0,rr:0,lab:'two normal breaths, then a flat line at zero with no waveform'}};
function capnoSVG(k){const K=UI8_CAPNO[k]||UI8_CAPNO.normal,x0=34,x1=246,W=320,H=128,base=104,t50=24,Y=v=>+(base-v/50*(base-t50)).toFixed(1);
 const cyc=4,cw=(x1-x0)/cyc,cut=[18,10,22,14];let d='M'+x0+' '+base;
 for(let i=0;i<cyc;i++){const x=x0+i*cw,X=f=>(x+cw*f).toFixed(1);
  if(k==='flat'&&i>=2){d+=' L'+(x+cw).toFixed(1)+' '+base;continue;}
  const top=Y(k==='flat'?38:K.v);
  if(k==='shark')d+=' L'+X(0.1)+' '+base+' Q'+X(0.16)+' '+(top+34)+' '+X(0.56)+' '+top+' L'+X(0.6)+' '+(top-1)+' L'+X(0.65)+' '+base+' L'+X(1)+' '+base;
  else if(k==='cleft'){const dp=(base-top)*cut[i]/100;d+=' L'+X(0.1)+' '+base+' L'+X(0.14)+' '+(top+3)+' L'+X(0.42)+' '+(top+1)+' L'+X(0.46)+' '+(top+dp).toFixed(1)+' L'+X(0.5)+' '+top+' L'+X(0.6)+' '+(top-1)+' L'+X(0.64)+' '+base+' L'+X(1)+' '+base;}
  else d+=' L'+X(0.1)+' '+base+' L'+X(0.14)+' '+(top+3)+' L'+X(0.6)+' '+(top-1)+' L'+X(0.64)+' '+base+' L'+X(1)+' '+base;}
 const U=PU(),tick=[0,25,50].map(v=>'<line x1="'+x0+'" x2="'+x1+'" y1="'+Y(v)+'" y2="'+Y(v)+'" class="grid"/><text x="'+(x0-4)+'" y="'+(Y(v)+4)+'" class="lab" text-anchor="end">'+P(v)+'</text>').join('');
 const box='<rect x="254" y="'+t50+'" width="60" height="'+(base-t50)+'" fill="none" stroke="#2a3340"/><text x="284" y="'+(t50+16)+'" class="lab" text-anchor="middle">ETCO₂</text><text x="284" y="'+(t50+44)+'" text-anchor="middle" style="font:700 24px var(--f-mono)" fill="#ffd166">'+(K.v?P(K.v):'0')+'</text><text x="284" y="'+(t50+58)+'" class="lab" text-anchor="middle">'+U+'</text><text x="284" y="'+(base-6)+'" class="lab" text-anchor="middle">RR '+(K.rr||'--')+'</text>';
 return '<svg viewBox="0 0 '+W+' '+H+'" class="img-capno" role="img" aria-label="Capnograph, four breaths: '+esc(K.lab)+'. ETCO₂ '+(K.v?P(K.v):'0')+' '+U+'."><rect width="'+W+'" height="'+H+'" class="scr"/>'+tick+'<path d="'+d+'" class="wave"/>'+box+'<text x="'+x0+'" y="'+(H-6)+'" class="lab">CO₂ ('+U+') · time →</text></svg>';}
/* Three syringes: two references and the patient's sample, each with the colour after a minute in air. The blood meets a dark rubber stopper (no gap that reads as air). */
const UI8_BLOOD={art:['#c8102e','#de2a3a','bright red, stays bright red'],ven:['#5e0e1c','#b3192c','dark red, turns red'],methb:['#5a3a26','#5d3b28','dark brown, stays brown']};
function syringeSVG(k){const rows=[['A · arterial (reference)','art'],['B · venous (reference)','ven'],['C · this sample',UI8_BLOOD[k]?k:'art']];
 const one=(r,i)=>{const y=22+i*52,c=UI8_BLOOD[r[1]];return '<text x="8" y="'+(y+10)+'" class="lab">'+r[0]+'</text><rect x="6" y="'+(y+26)+'" width="18" height="6" fill="#cfd6dc"/><rect x="24" y="'+(y+17)+'" width="178" height="24" rx="3" fill="#e9eef2" stroke="#9aa"/><rect x="27" y="'+(y+20)+'" width="133" height="18" fill="'+c[0]+'"/><rect x="160" y="'+(y+19)+'" width="9" height="20" fill="#2b2b2b"/><rect x="169" y="'+(y+25)+'" width="58" height="8" fill="#cfd6dc"/><rect x="227" y="'+(y+14)+'" width="6" height="30" fill="#b8c0c6"/><rect x="256" y="'+(y+18)+'" width="52" height="22" fill="'+c[1]+'" stroke="#9aa"/>';};
 const lab=rows.map(r=>r[0].split(' · ')[0]+': '+UI8_BLOOD[r[1]][2]).join('; ');
 return '<svg viewBox="0 0 320 178" class="img-syr" role="img" aria-label="Three blood gas syringes with the colour after one minute in air. '+esc(lab)+'."><rect width="320" height="178" class="scr"/><text x="308" y="14" class="lab" text-anchor="end">after 1 min in air</text>'+rows.map(one).join('')+'</svg>';}
function monitorSVG(o){const row=(y,l,v,c)=>'<text x="14" y="'+y+'" class="lab">'+l+'</text><text x="306" y="'+y+'" class="big" text-anchor="end" fill="'+c+'">'+v+'</text>';
 /* O₂Hb from the co-oximeter is the oxyhaemoglobin fraction (FO₂Hb), not SaO₂; the analyser's sO₂ calculated from PaO₂ (Severinghaus 1979) shows the saturation gap */
 const so2=o.po2!=null?Math.min(100,Math.round(100/(23400/(Math.pow(o.po2,3)+150*o.po2)+1))):null,dy=so2!=null?30:32,bad=o.methb!=null?['MetHb (co-oximeter)',o.methb]:['COHb (co-oximeter)',o.cohb];
 const rows=[['SpO₂ (pulse oximeter)',o.spo2+'%','#4fd1ff']].concat(so2!=null?[['sO₂ (calc. from PaO₂)',so2+'%','#9fb0c0']]:[],[['O₂Hb (co-oximeter)',o.sao2co+'%','#ffd166'],['PaO₂',P(o.po2)+' '+PU(),'#ffffff'],[bad[0],bad[1]+'%','#ff6b6b']]),H=rows.length*dy+20;
 return '<svg viewBox="0 0 320 '+H+'" class="img-mon" role="img" aria-label="Monitor and co-oximetry: '+esc(rows.map(r=>r[0]+' '+r[1]).join(', '))+'"><rect width="320" height="'+H+'" class="scr"/>'+rows.map((r,i)=>row(30+i*dy,r[0],r[1],r[2])).join('')+'</svg>';}
/* A 10-pad strip with no printed labels (as on a real strip), held beside a simplified bottle colour chart: match each pad to its row.
   Data: blood/prot/glu/ket 0–3 (neg, +, ++, +++); optional ph (default 5.5), sg (1.030), leu, nit, bil, uro (default neg/normal). */
const UI8_DIP=[['Glucose','glu',['neg','tr','+','++','+++'],['#7fc9d2','#8cc4a0','#8ab870','#a07a3a','#6a3a2a']],['Bilirubin','bil',['neg','+','++','+++'],['#f1e4c8','#e3c9a6','#d2ab8e','#b98f7a']],['Ketones','ket',['neg','tr','+','++','+++'],['#f1d9c9','#e6b7b5','#d99aa0','#a0506a','#6a2a4a']],
 ['SG','sg',['1.000','1.010','1.020','1.030'],['#1f5c66','#4f7a52','#8a9442','#c2b03a']],['Blood','blood',['neg','tr','+','++','+++'],['#f2e27a','#c9d46a','#9cbf5a','#4f8a3a','#1f4f2a']],['pH','ph',['5.0','6.0','6.5','7.0','7.5','8.0','8.5'],['#e8823a','#d9a640','#b9b44a','#8fae4e','#5f9e5a','#3f8a72','#2d6f86']],
 ['Protein','prot',['neg','tr','+','++','+++'],['#e8ec8a','#d0e282','#b9d77a','#7fb87a','#3f8a6a']],['Urobilin.','uro',['norm','2','4','8'],['#f3d9b0','#f0bfa0','#e9a08e','#dc7e7a']],['Nitrite','nit',['neg','pos'],['#f7f1e3','#f0b3c4']],['Leucocytes','leu',['neg','+','++','+++'],['#f3efdc','#d9c9d6','#b9a0c4','#8c6ea8']]];
function ui8DipIdx(row,o){const k=row[1],v=o[k];if(k==='ph'){const p=v!=null?v:5.5,sc=[5,6,6.5,7,7.5,8,8.5];let b=0;sc.forEach((s,i)=>{if(Math.abs(s-p)<Math.abs(sc[b]-p))b=i;});return b;}
 if(k==='sg'){const g=v!=null?v:1.030;return Math.max(0,Math.min(3,Math.round((g-1)*100)));}const n=+v||0;return row[2].length===5?(n?Math.min(4,n+1):0):Math.min(row[2].length-1,n);}
function dipSVG(o){const r0=40,rh=20,sx=112,sw=27,H=r0+UI8_DIP.length*rh+8;
 const strip='<rect x="10" y="6" width="22" height="'+(H-10)+'" fill="#f4f1e8" stroke="#bbb"/>'+UI8_DIP.map((r,i)=>'<rect x="13" y="'+(r0+i*rh+2)+'" width="16" height="14" fill="'+r[3][ui8DipIdx(r,o)]+'" stroke="#999" stroke-width=".5"/>').join('');
 const chart='<rect x="40" y="6" width="276" height="'+(H-10)+'" fill="#eef0f2"/><text x="44" y="24" style="font:700 10px var(--f-mono)" fill="#333">Bottle colour chart</text>'+UI8_DIP.map((r,i)=>{const y=r0+i*rh+2;return '<text x="44" y="'+(y+11)+'" style="font:600 10px var(--f-mono)" fill="#222">'+r[0]+'</text>'+r[3].map((c,j)=>'<rect x="'+(sx+j*(sw+2))+'" y="'+y+'" width="'+sw+'" height="14" fill="'+c+'"/><text x="'+(sx+j*(sw+2)+sw/2)+'" y="'+(y+10)+'" text-anchor="middle" style="font:600 8px var(--f-mono)" fill="#111" fill-opacity=".75">'+r[2][j]+'</text>').join('');}).join('');
 const lab=UI8_DIP.map(r=>r[0]+' '+r[2][ui8DipIdx(r,o)]).join(', ');
 return '<svg viewBox="0 0 320 '+H+'" class="img-dip" role="img" aria-label="Urine dipstick held beside the bottle colour chart. Pads from the handle down match: '+esc(lab)+'."><rect width="320" height="'+H+'" class="scr"/>'+strip+chart+'</svg>';}
function caseImg(im){if(!im)return '';if(im.type==='capno')return capnoSVG(im.k);if(im.type==='syringe')return syringeSVG(im.k);if(im.type==='monitor')return monitorSVG(im);if(im.type==='dip')return dipSVG(im);
 if(im.type==='print'){const v=Object.assign({k:4.2,glu:6.1,lac:1.1,fio2:0.21},im.v);return printout(v,false,{extra:im.extra,fixed:true});}return '';}

/* ---- chat and image cases ---- */
function caseOrd(i){CS.ord=CS.ord||{};return CS.ord[i]=CS.ord[i]||spShuffle(CS.c.steps[i].o.map((_,k)=>k));}
/* lay speakers sit on the "them" side; lab/analyser/monitor messages get a plain system bubble; m[2] can force a side */
const UI8_LAY=/^(patient|brother|sister|wife|husband|partner|mother|mum|father|dad|son|daughter|parent|parents|friend|carer|relative|neighbour)$/i,UI8_SYS=/^(lab|labs|analyser|monitor|results?|pharmacy)$/i;
function caseBubble(m){const side=m[2]||(UI8_LAY.test(m[0])?'them':UI8_SYS.test(m[0])?'sys':'staff');return '<div class="bub '+side+'"'+(side==='sys'?' style="justify-self:start;font-family:var(--f-mono);border-style:dashed"':'')+'><b>'+esc(m[0])+'</b><span>'+esc(m[1])+'</span></div>';}
function ui8Order(t){t=t||{};return Object.keys(t).sort((a,b)=>t[a]-t[b]);}
function ui8Img(j){const st=CS.c.steps[j];if(!st||!st.img)return '';CS.img=CS.img||{};return CS.img[j]=CS.img[j]||caseImg(st.img);}
function ui8GasLine(g){const ag=g.na!=null&&g.cl!=null&&g.hco3!=null?Math.round(g.na-(g.cl+g.hco3)):null;return (g.sample==='v'?'VBG':'ABG')+': pH '+(+g.pH).toFixed(2)+' · PCO₂ '+P(g.pco2)+' '+PU()+(g.hco3!=null?' · HCO₃⁻ '+g.hco3:'')+(ag!=null?' · AG '+ag:'')+(g.lac!=null?' · lactate '+g.lac:'')+(g.k!=null?' · K⁺ '+g.k:'');}
function ui8Leave(){CS=null;RENDER.cases();try{history.replaceState(history.state,'','#cases');}catch(e){}}
function caseStep(el){const c=CS.c,st=c.steps[CS.i];
 if(!st)return caseEnd(el);
 const tried=CS.tried[CS.i]||{},order=ui8Order(tried),solved=order.some(k=>st.o[k][1]),wrongs=order.filter(k=>!st.o[k][1]),r=st.o.findIndex(o=>o[1]);
 const hist=c.steps.slice(0,CS.i).map((s,j)=>{const n=ui8Order(CS.tried[j]).length,ri=s.o.findIndex(o=>o[1]);
  return (s.m||[]).map(caseBubble).join('')+
   (s.gas?'<details class="bub sys" style="justify-self:start;font-family:var(--f-mono)"><summary style="cursor:pointer;min-height:44px;display:flex;align-items:center">'+esc(ui8GasLine(s.gas))+'</summary>'+slip(s.gas,{lv:4})+'</details>':'')+
   (s.img?'<details class="bub sys" style="justify-self:start;width:min(560px,92%)"><summary style="cursor:pointer;min-height:44px;display:flex;align-items:center">Image from step '+(j+1)+'</summary><div class="caseimg">'+ui8Img(j)+'</div></details>':'')+
   '<div class="bub me"><b>'+(n>1?'You (try '+n+')':'You')+'</b><span>'+esc(s.o[ri][0])+'</span></div>';}).join('');
 const now=(st.m||[]).map((m,j)=>j?caseBubble(m):caseBubble(m).replace('<div ','<div id="csNew" style="scroll-margin-top:72px" ')).join('');
 const fb=wrongs.map((k,n)=>solved?'<div class="why no"><b>You first chose:</b> '+esc(st.o[k][0])+'<details><summary>What would have happened</summary>'+esc(st.o[k][2])+'</details></div>'+autopsyRow(k)
   :'<p class="why no"'+(n===wrongs.length-1?' id="csFb" tabindex="-1"':'')+'><b>Not this one.</b> What happens: '+esc(st.o[k][2])+'</p>'+autopsyRow(k)).join('')+
  (solved?'<p class="why ok" id="csFbOk" tabindex="-1"><b>Right.</b> '+esc(st.o[r][2])+'</p>':'');
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button><span class="eyebrow">'+FMT[c.fmt]+' · '+esc(c.set)+'</span><span class="eyebrow" style="margin-left:auto;color:var(--muted)">Step '+(CS.i+1)+' of '+c.steps.length+'</span></div>'+
  (CS.i?'<details class="card tint"><summary style="cursor:pointer;min-height:44px;display:flex;align-items:center"><h2 aria-level="1" style="margin:0">'+esc(c.t)+'</h2></summary><p class="vig" style="margin-top:6px">'+esc(c.intro)+'</p></details>'
   :'<div class="card tint"><h2 aria-level="1">'+esc(c.t)+'</h2><p class="vig" style="margin-top:6px">'+esc(c.intro)+'</p></div>')+
  (hist||now?'<div class="chat" role="log" aria-label="Case messages">'+hist+now+'</div>':'')+
  (st.img?'<div class="card caseimg">'+ui8Img(CS.i)+'</div>':'')+
  '<div class="'+(st.gas?'dgrid':'')+'">'+(st.gas?'<div class="card stick">'+slip(st.gas,{lv:4})+'</div>':'')+'<div class="card scn-step"><p class="ask" id="csQ" tabindex="-1" style="scroll-margin-top:72px">'+esc(st.q)+'</p><div class="scn-opts">'+caseOrd(CS.i).map((i,k)=>{const o=st.o[i],t=tried[i];return '<button class="opt'+(t?(o[1]?' right':' wrong'):'')+'" data-o="'+i+'"'+(t||solved?' disabled':'')+'><kbd>'+(k+1)+'</kbd><span>'+esc(o[0])+'</span>'+(t?'<span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">'+(o[1]?' (right)':' (wrong)')+'</span>':'')+'</button>';}).join('')+'</div>'+
  '<div role="status">'+fb+'</div>'+
  (solved?'<div class="btnrow"><button class="btn primary" id="csNext">'+(CS.i+1<c.steps.length?'Next →':'Finish →')+'</button>'+(st.gas?'<button class="btn ghost" id="csInterp">Open in interpreter</button>':'')+'</div>':'')+'</div></div>';
 $('csBack').onclick=ui8Leave;
 el.querySelectorAll('.opt[data-o]').forEach(b=>b.onclick=()=>caseAnswer(+b.dataset.o));
 el.querySelectorAll('[data-aut]').forEach(b=>b.onclick=()=>{const [k,w]=b.dataset.aut.split(':');const e=ui8Entry(k);if(e&&!e.why){e.why=w;e.u=Date.now();S.why=S.why||{};S.why[w]=(S.why[w]||0)+1;save();}
  b.parentElement.querySelectorAll('button').forEach(x=>{x.disabled=true;x.setAttribute('aria-pressed',x===b);x.classList.toggle('on',x===b);});announce('Noted: '+b.textContent+'.');
  const nx=$('csNext')||el.querySelector('.opt[data-o]:not([disabled])');if(nx)nx.focus();});
 if($('csInterp'))$('csInterp').onclick=()=>{loadInterp(Object.assign({},st.gas));openTool('interp');};
 if($('csNext'))$('csNext').onclick=()=>{CS.i++;if(CS.i>=c.steps.length)ui8Record();CS.focus='next';RENDER.cases();};
 const f=CS.focus;CS.focus=null;
 if(f==='ans'){const t=solved?$('csNext'):$('csFb');if(t)t.focus();}
 else if(f==='next'){const t=$('csNew')||$('csQ');if(t)t.scrollIntoView({block:'start'});const q=$('csQ');if(q)q.focus({preventScroll:true});if(st.m&&st.m.length)announce(st.m.map(m=>m[0]+': '+m[1]).join(' '));}}
function ui8Entry(k){const id=(CS.mid||{})[CS.i+':'+k];return id?(S.cmist||[]).find(x=>x.id===id&&!x.del)||null:null;}
function ui8IsAct(st){return st.act!=null?!!st.act:/\b(do|treat|treatment|act|now|next|first|give|manage|management|plan)\b/i.test(st.q||'');}
/* autopsy chips are tied to the notebook entry made by THIS answer (CS.mid), and redraw pressed/disabled once a reason is given */
function autopsyRow(k){const e=ui8Entry(k);if(!e)return '';const list=WHY.concat(ui8IsAct(CS.c.steps[CS.i])&&typeof WHY_ACT!=='undefined'?WHY_ACT:[]);
 return '<div class="autopsy" role="group" aria-label="Why did you pick it?"><span class="eyebrow">Why did you pick it?</span><div class="seg wrap">'+list.map(w=>'<button data-aut="'+k+':'+w[0]+'" aria-pressed="'+(e.why===w[0])+'"'+(e.why===w[0]?' class="on"':'')+(e.why?' disabled':'')+'>'+esc(w[1])+'</button>').join('')+'</div></div>';}
function caseAnswer(i){if(VIEW!=='cases'||!CS||CS.sim)return;const st=CS.c.steps[CS.i];if(!st||!st.o[i])return;const tried=CS.tried[CS.i]=CS.tried[CS.i]||{};if(tried[i]||Object.keys(tried).some(k=>st.o[k][1]))return;CS.seq=Math.max(CS.seq||0,1)+1;tried[i]=CS.seq;
 if(st.o[i][1])CS.log.push({i:CS.i,q:st.q,a:st.o[i][0],ok:Object.keys(tried).length===1});
 else{CS.wrong++;CS.wrongSteps.add(CS.i);S.cmist=S.cmist||[];const id='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);CS.mid=CS.mid||{};CS.mid[CS.i+':'+i]=id;
  S.cmist.push({id,key:CS.c.id+':'+CS.i+':'+i,cid:CS.c.id,ct:CS.c.t,q:st.q,a:st.o[i][0],r:st.o.find(o=>o[1])[0],e:st.o[i][2],d:ddmmyyyy(),u:Date.now()});if(S.cmist.length>200)S.cmist.splice(0,S.cmist.length-200);save();}
 CS.focus='ans';RENDER.cases();if(st.o[i][1])announce('Right. '+st.o[i][2]);}
/* record the run once, when the last step is passed; caseEnd only renders */
function ui8Record(){if(!CS||CS.rec||CS.sim)return;CS.rec=true;if(CS.partial)return;const c=CS.c,n=c.steps.length,ok=n-CS.wrongSteps.size;S.cases=S.cases||{};
 S.cases[c.id]={res:CS.wrong?CS.wrong+' wrong turn'+(CS.wrong>1?'s':''):'clean run',d:ddmmyyyy(),n:((S.cases[c.id]||{}).n||0)+1,last:Date.now()};
 S.sess=S.sess||[];S.sess.push({d:today(),m:'case',n,ok,ms:Math.min(36e5,Date.now()-(CS.t0||Date.now()))});if(S.sess.length>120)S.sess.shift();touchDay(1);addXP(Math.max(5,20-5*CS.wrong));save();}
const UI8_DEEP={hagma:'hagma',nagma:'nagma',malk:'malk',rac:'racid',ralk:'ralk',mixed:'mixed',ox:'oxread',traps:'traps'},
 UI8_DEEPC={'ch-dka':'dka','ch-asa':'asa','ch-copd':'copd','ch-meth':'toxalc2','ch-pca':'opioid','ch-pyl':'vomit','ch-nagma':'rta','im-dip':'rhabdo','im-co':'co','im-syringe':'methb','im-capno':'co2vent','im-print':'preanal'},
 UI8_TOOL={'im-print':'hh','ch-nagma':'urine','ch-copd':'oxy','im-co':'oxy','ch-pca':'oxy'};
function caseEnd(el){ui8Record();const c=CS.c;
 const steps=c.steps.map((s,j)=>{const t=CS.tried[j]||{},ord=ui8Order(t),ri=s.o.findIndex(o=>o[1]),pre=CS.partial&&ord.length===1&&t[ord[0]]===1;if(pre)return '';const first=ord[0]!=null&&+ord[0]===ri;
  return '<li><span style="color:var('+(first?'--good':'--bad')+');font-weight:700" aria-hidden="true">'+(first?'✓':'✗')+'</span> <b>'+esc(s.q)+'</b><span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">'+(first?' Right first time.':' Wrong turn.')+'</span>'+
   (!first&&ord.length?'<br><span style="color:var(--bad)">You first chose: '+esc(s.o[ord[0]][0])+'</span>':'')+'<br><span style="color:var(--good)">Right: '+esc(s.o[ri][0])+'</span><br><small class="muted">'+esc(s.o[ri][2])+'</small></li>';}).join('');
 const deep=[...new Set([UI8_DEEPC[c.id]].concat((c.dis||[]).map(d=>UI8_DEEP[d])))].filter(id=>id&&typeof LBYID!=='undefined'&&LBYID[id]),tool=UI8_TOOL[c.id]&&typeof TOOLS!=='undefined'&&TOOLS.find(t=>t[0]===UI8_TOOL[c.id]);
 const res=CS.partial?'Step retry finished. Full runs count towards your record; this one does not.':CS.wrong?CS.wrong+' wrong turn'+(CS.wrong>1?'s':'')+'. They are in your mistake notebook.':'Clean run: every call right first time.';
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button></div><div class="card raised" style="display:grid;gap:12px"><span class="eyebrow">Case complete</span><h1 id="csEndH" tabindex="-1">'+esc(c.t)+'</h1><p>'+res+'</p></div>'+
  (c.learn&&c.learn.length?'<div class="card" style="display:grid;gap:8px"><h2>Take-home</h2><ul>'+c.learn.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(c.pearl?'<p class="why ok"><b>Exam pearl'+((c.exam||[]).length?' · '+esc(c.exam.join(', ')):'')+'.</b> '+esc(c.pearl)+'</p>':'')+'</div>':'')+
  '<div class="card" style="display:grid;gap:8px"><h2>Step by step</h2><ol class="ui8log" style="display:grid;gap:10px;padding-left:1.2em">'+steps+'</ol></div>'+
  (deep.length||tool?'<div class="card" style="display:grid;gap:8px"><h2>Go deeper</h2><div class="btnrow" style="flex-wrap:wrap">'+deep.map(id=>'<button class="btn small" data-les="'+id+'">'+esc(LBYID[id].t)+'</button>').join('')+(tool?'<button class="btn small ghost" data-tool="'+tool[0]+'">Tool: '+esc(tool[1])+'</button>':'')+'</div></div>':'')+
  '<div class="card">'+caseSources(c,true)+'</div><div class="btnrow"><button class="btn primary" id="csAgain">Run it again</button><button class="btn" id="csAll">All cases</button></div>';
 $('csBack').onclick=$('csAll').onclick=ui8Leave;$('csAgain').onclick=()=>openCase(c.id);
 el.querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>openLesson(b.dataset.les));el.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>openTool(b.dataset.tool));
 if(CS.focus==='next'){CS.focus=null;window.scrollTo(0,0);const h=$('csEndH');if(h)h.focus({preventScroll:true});announce('Case complete. '+res);}}
function caseSources(c,open){const s=(c.src||[]).filter(i=>SRC[i]);return s.length?'<details'+(open?' open':'')+'><summary><span class="eyebrow">Sources</span></summary><ol class="srcl">'+s.map(i=>'<li>'+esc(SRC[i][1])+(SRC[i][2]?' <a href="https://doi.org/'+esc(SRC[i][2])+'" target="_blank" rel="noopener">doi:'+esc(SRC[i][2])+'</a>':'')+'</li>').join('')+'</ol></details>':'';}

/* ---- timed simulation (D29, 5.0) ----
   The physiology lives in each sim object (c12.js): x is the hidden state, step() runs once a sim-minute, out() gives monitor, gas and severity.
   The view is built once; each tick updates only the clock, vitals, severity bar, pending line, new results and new events, so focus stays put.
   The running sim is kept in sessionStorage (reload, Back/Forward and leaving the view resume it). Sim state is called Z here; S stays the app state. */
let SIMT=0,ui8SimFresh=false;
function stopSim(){clearInterval(SIMT);SIMT=0;}
function ui8Kn(k,x){if(!(x>k[0][0]))return k[0][1];for(let i=1;i<k.length;i++)if(x<=k[i][0]){const a=k[i-1],b=k[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return k[k.length-1][1];}
function ui8Sat(p){p=Math.max(1,p);return 100/(23400/(p*p*p+150*p)+1);}
/* alveolar gas equation and an arterial/alveolar ratio: oxygen therapy (FiO2) really changes PaO2 and SpO2 */
function ui8O2(Z,pco2,aA){const A=Z.fio2*713-pco2/0.8,po2=Math.max(20,Math.min(A-2,A*aA));return {po2,spo2:Math.min(100,ui8Sat(po2))};}
function simAgo(id,Z){Z=Z||CS;return Z&&Z.lt&&Z.lt[id]!=null?Z.t-Z.lt[id]:-1;}
function simFirst(id,Z){Z=Z||CS;return Z&&Z.at&&Z.at[id]!=null?Z.t-Z.at[id]:-1;}
function simFlag(k,txt,id,Z){Z=Z||CS;Z.ev.push({t:Z.t,k,txt});if(k==='harm')Z.harm[id||('t'+Z.t)]=txt;else if(k==='unn')Z.unn++;else Z.warn++;}
function simKeys(Z){Z=Z||CS;return Z.c.key.filter(k=>(!k.v||k.v===Z.vid)&&(!k.vx||k.vx!==Z.vid));}
function simPace(){const p=S.ui&&S.ui.simPace;return p>=1&&p<=10?Math.round(p):2;}
function simSave(){try{const Z=CS;if(!Z||!Z.sim)return;if(Z.over){sessionStorage.removeItem('buffer.sim');return;}const o=Object.assign({},Z);delete o.c;sessionStorage.setItem('buffer.sim',JSON.stringify(o));}catch(e){}}
function simLoadRaw(){try{const o=JSON.parse(sessionStorage.getItem('buffer.sim')||'null');return o&&!o.over&&o.id&&o.x?o:null;}catch(e){return null;}}
function simLoad(id){const o=simLoadRaw();if(!o||o.id!==id)return null;const c=CASES.find(x=>x.id===id);if(!c||c.fmt!=='sim')return null;o.c=c;o.paused=true;o.tick=0;return o;}
function simNew(c){if(!ui8SimFresh){if(CS&&CS.sim&&CS.c===c&&!CS.over)return CS;const o=simLoad(c.id);if(o)return o;}ui8SimFresh=false;
 let vid='',acc=0;const x=Object.assign({},c.x0),r=Math.random();for(const v of c.vars||[]){acc+=v.p;if(r<acc){vid=v.id;Object.assign(x,v.x);break;}}
 const Z={c,id:c.id,sim:true,vid,t:0,x,x0:Object.assign({},x),fio2:c.fio2||0.21,o2t:null,fx:[],done:{},at:{},lt:{},ev:[{t:0,k:'start',txt:'Patient arrives.'}],pend:[],res:[],hist:[],vh:[],harm:{},warn:0,unn:0,qa:[],q:null,flag:{},paused:false,over:null,tick:0,ms0:Date.now()};
 const o=simOut(Z);Z.sev=o.sev;Z.hist.push([0,Math.round(o.sev)]);Z.vh.push([0,simVit(Z)]);try{sessionStorage.removeItem('buffer.sim');}catch(e){}return Z;}
function simOut(Z){Z=Z||CS;const o=Z.c.out(Z.x,Z);o.sev=Math.max(0,Math.min(100,o.sev));return o;}
function simVit(Z){Z=Z||CS;const v=Object.assign({},simOut(Z).v),nz=(k,a)=>{if(!Z.t)return 0;const h=Math.sin(Z.t*12.9898+k*78.233)*43758.5453;return Math.round((h-Math.floor(h)-0.5)*2*a);};
 ['hr','sbp','dbp','rr','spo2','gcs','etco2','ppk'].forEach(k=>{if(v[k]!=null)v[k]=Math.round(v[k]);});
 if(v.hr!=null)v.hr+=nz(1,2);if(v.rr!=null)v.rr=Math.max(0,v.rr+nz(2,1));if(v.spo2!=null)v.spo2=Math.min(100,v.spo2);if(v.sbp!=null&&v.dbp!=null)v.map=Math.round((v.sbp+2*v.dbp)/3);return v;}
/* the analyser slip: Na/Cl/PCO2/PO2 whole numbers, K/lactate/glucose/HCO3 one decimal, FiO2 as given at the moment of sampling */
function simGas(Z){Z=Z&&Z.c?Z:CS;const g=Object.assign({},simOut(Z).g);['na','cl','pco2','po2'].forEach(k=>{if(g[k]!=null)g[k]=Math.round(g[k]);});['k','lac','glu','hco3'].forEach(k=>{if(g[k]!=null)g[k]=r1(g[k]);});
 g.pH=r2(phFrom(g.hco3,g.pco2));if(g.sample==='v')delete g.po2;else g.fio2=r2(Z.fio2);if(Z.c.age)g.age=Z.c.age;return g;}
function simTitrate(Z){if(!Z.o2t)return;const lo=Z.o2t[0],mx=Math.round(Z.o2t[2]*100);for(let f=21;f<=mx;f++){Z.fio2=f/100;if(simOut(Z).v.spo2>=lo+1)break;}}
function simVitLine(v){return 'HR '+v.hr+', BP '+v.sbp+'/'+v.dbp+' (MAP '+v.map+')'+(v.rr!=null?', RR '+v.rr:'')+', SpO₂ '+v.spo2+'%';}
function simAdvance(min){const Z=CS;if(!Z||!Z.sim)return;const c=Z.c,x=Z.x;
 for(let m=0;m<min&&!Z.over&&!Z.q;m++){Z.t++;c.step(x,Z);
  Z.fx.forEach(e=>{const dt=Z.t-e.t0;if(dt<=e.on)return;if(e.d!=null){if(dt<=e.on+e.dur)x[e.v]+=e.d/e.dur;}else if(e.off==null||dt<=e.on+e.off)x[e.v]+=e.r;});
  Z.fx=Z.fx.filter(e=>{const dt=Z.t-e.t0;return e.d!=null?dt<e.on+e.dur:(e.off==null||dt<e.on+e.off);});
  for(const k in c.lim||{}){if(x[k]!=null)x[k]=Math.max(c.lim[k][0],Math.min(c.lim[k][1],x[k]));}
  simTitrate(Z);Z.sev=simOut(Z).sev;Z.hist.push([Z.t,Math.round(Z.sev)]);
  if(Z.t%5===0){Z.vh.push([Z.t,simVit(Z)]);if(Z.vh.length>6)Z.vh.shift();}
  Z.pend=Z.pend.filter(p=>{if(p.at>Z.t)return true;simResult(p);return false;});
  if(Z.sev>=100){simEnd('arrest');return;}
  if(Z.t%15===0)Z.ev.push({t:Z.t,k:'nurse',txt:'Nurse: '+simVitLine(simVit(Z))+'. What next?'});
  if(!Z.flag.ready&&Z.sev<20&&simKeys(Z).every(k=>Z.at[k.a]!=null)){Z.flag.ready=1;Z.ev.push({t:Z.t,k:'nurse',txt:'Nurse: much better now. Hand over when you are ready.'});}}
 simSave();}
function simResult(p){const Z=CS;Z.res.push(p);Z.ev.push({t:Z.t,k:'res',txt:'Result: '+p.l});if(p.gas)simAskMaybe(p);}
/* read-the-gas: the sim asks about the gas it just produced (correct answer worked out from the live numbers) and stops the clock */
function simAskMaybe(p){const Z=CS,c=Z.c;if(!c.ask||Z.q)return;const q=c.ask(p.gas,Z.qa.length,Z,p);if(!q)return;const o=q.o.slice();for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]];}Z.q={q:q.q,o,l:p.l,at:p.ordered,ans:null};}
function simActState(a){const Z=CS,n=Z.done[a.id]||0,mx=a.max||1,ids=[a.id].concat(a.gapFrom||[]).filter(i=>Z.lt[i]!=null);let next=null;
 if(a.gap&&ids.length){const last=Math.max(...ids.map(i=>Z.lt[i]));if(Z.t-last<a.gap)next=last+a.gap;}const pend=a.cat==='test'&&Z.pend.some(p=>p.id===a.id);return {n,mx,next,pend,ok:n<mx&&next==null&&!pend};}
function simAct(id){const Z=CS;if(!Z||!Z.sim||Z.over)return;const c=Z.c,a=c.actions.find(x=>x.id===id);if(!a)return;
 if(Z.q){toast('Read the gas first: the clock is stopped.');return;}const st=simActState(a);
 if(st.n>=st.mx){toast('Already done.');return;}if(st.pend){toast('Already sent: waiting for the result.');return;}if(st.next!=null){toast('Too soon: next at T+'+st.next+' min.');return;}
 const x=Z.x,o=simOut(Z),g=o.g,v=simVit(Z);g.pH=phFrom(g.hco3,g.pco2);Z._ret=id;
 const call=f=>typeof f==='function'?f.call(c,x,Z,g,v):f,txt=a.cat==='test'?null:(typeof a.txt==='function'?a.txt.call(c,x,Z,v,g):a.txt);
 const m={pre:a.pre&&call(a.pre),bad:a.bad&&call(a.bad),unn:a.unn&&call(a.unn),ok:a.ok&&call(a.ok)};
 Z.done[id]=st.n+1;if(Z.at[id]==null)Z.at[id]=Z.t;Z.lt[id]=Z.t;Z.ev.push({t:Z.t,k:a.cat,txt:a.l});
 if(a.req&&!a.req.some(r=>Z.res.some(p=>p.id===r)))simFlag('warn',(a.reqMsg||'Done before the result was back.')+(a.req.some(r=>Z.pend.some(p=>p.id===r))?' The result was still pending.':''));
 if(m.pre)simFlag('warn',m.pre);if(a.warnIfNot&&!Z.done[a.warnIfNot])simFlag('warn',a.warnMsg);
 if(a.harm)simFlag('harm',a.harm,id);if(m.bad)simFlag('harm',m.bad,id);if(m.unn)simFlag('unn',m.unn);if(m.ok)Z.ev.push({t:Z.t,k:'res',txt:m.ok});
 if(a.cat==='test'){const p={id,l:a.l,at:Z.t+(a.delay||0),ordered:Z.t,txt:typeof a.txt==='function'?a.txt.call(c,x,Z,v,g):a.txt,gas:a.res==='gas'?simGas(Z):null};if(!a.delay)simResult(p);else Z.pend.push(p);}
 else if(txt)Z.ev.push({t:Z.t,k:'res',txt});
 (a.fx||[]).forEach(e=>Z.fx.push(Object.assign({t0:Z.t},e)));if(a.set)a.set.call(c,x,Z);if(a.o2)Z.o2t=a.o2;
 if(a.chk){const w=a.chk.call(c,x,Z);if(w)simFlag('warn',w);}
 simTitrate(Z);simAdvance(a.cost||1);simUpd();}
function simEnd(kind){const Z=CS;if(!Z||!Z.sim||Z.over)return;stopSim();const c=Z.c,keys=simKeys(Z),E=c.end||{};
 const nm=k=>{const a=c.actions.find(x=>x.id===k.a);return a?a.l:k.a;},miss=keys.filter(k=>Z.at[k.a]==null),late=keys.filter(k=>Z.at[k.a]!=null&&Z.at[k.a]>k.by),lc=late.filter(k=>k.crit),hs=Object.values(Z.harm);let tier,e;
 if(kind==='arrest'){tier='arrest';e=E.arrest||{t:'Arrest',d:''};}
 else if(miss.length){tier='incomplete';e={t:'Handed over incomplete',d:'Not done: '+miss.map(nm).join('; ')+'.'};}
 else if(Z.sev>=60){tier='unstable';e={t:'Still unstable at handover',d:'The steps were there, but not enough or not soon enough: the patient is still in danger.'+(late.length?' Late: '+late.map(nm).join('; ')+'.':'')};}
 else if(hs.length){tier='harm';e={t:'Stabilised, with harm',d:hs.join(' ')};}
 else if(lc.length||late.length>1){tier='late';e={t:'Stabilised, but late',d:'Late: '+late.map(k=>nm(k)+' at '+Z.at[k.a]+' min (target '+k.by+')').join('; ')+'. Late care is not the same result.'};}
 else if(Z.unn+Z.warn>=2){tier='detour';e={t:'Stabilised, with detours',d:'The patient is safer, but '+(Z.unn+Z.warn)+' actions were out of order or not needed; see What to change.'};}
 else{tier='win';e=E.win||{t:'Stabilised',d:''};}
 const wrong=Z.qa.filter(q=>!q.right).length;let sc=100-20*miss.length-10*(late.length-lc.length)-15*lc.length-15*hs.length-5*Z.warn-3*Z.unn-5*wrong;if(tier==='arrest')sc=Math.min(sc,20);sc=Math.max(0,Math.min(100,Math.round(sc)));
 Z.over={t:e.t,d:e.d,tier,score:sc};Z.ev.push({t:Z.t,k:'end',txt:e.t});
 S.cases=S.cases||{};const pr=S.cases[c.id]||{};S.cases[c.id]={res:e.t,d:ddmmyyyy(),n:(pr.n||0)+1,last:Date.now(),best:Math.max(pr.best||0,tier==='win'?1:0),score:sc,bestScore:Math.max(pr.bestScore||0,sc)};
 S.sess=S.sess||[];S.sess.push({d:today(),m:'sim',n:keys.length,ok:keys.filter(k=>Z.at[k.a]!=null&&Z.at[k.a]<=k.by).length,ms:Z.ms0?Math.max(0,Date.now()-Z.ms0):0});if(S.sess.length>120)S.sess.shift();touchDay(1);save();simSave();Z.focus='end';simRender($('v-cases'));}
const SIMV={hr:['HR','Heart rate','/min','per minute',5],bp:['BP','Blood pressure','','',4],rr:['RR','Breathing rate','/min','per minute',3],spo2:['SpO₂','Oxygen saturation','%','percent',2],gcs:['GCS','Glasgow coma score','/15','of 15',1],etco2:['EtCO₂','End-tidal CO₂','','',3],ppk:['Ppeak','Peak airway pressure','cmH₂O','centimetres of water',3]};
function simVitHTML(v){const Z=CS,c=Z.c,old=(Z.vh.filter(h=>h[0]<=Z.t-5).pop()||[])[1];
 return (c.vs||['hr','bp','rr','spo2','gcs']).map(k=>{const s=SIMV[k];let val=v[k],u=s[2],su=s[3],fl='',tk=k;
  if(k==='hr')fl=v.hr>120?'high':v.hr<50?'low':'';
  else if(k==='bp'){val=v.sbp+'/'+v.dbp;u=su='MAP '+v.map;tk='map';fl=v.map<65?'low':v.sbp>180?'high':'';}
  else if(k==='rr')fl=v.rr>28?'high':v.rr<10?'low':'';
  else if(k==='spo2'){u='% · '+(Z.fio2>0.215?'FiO₂ '+Z.fio2.toFixed(2):'air');su='percent on '+(Z.fio2>0.215?'FiO₂ '+Z.fio2.toFixed(2):'air');fl=v.spo2<(c.spoLo||92)?'low':'';}
  else if(k==='gcs')fl=v.gcs<13?'low':'';
  else if(k==='etco2'){val=P(v.etco2);u=su=PU();}
  else if(k==='ppk')fl=v.ppk>35?'high':'';
  const d=old&&old[tk]!=null?v[tk]-old[tk]:0,tr=Math.abs(d)>=s[4]?(d>0?'rising':'falling'):'';
  return '<div class="vit'+(fl?' bad':'')+'" role="group" aria-label="'+s[1]+' '+val+' '+su+(fl?', '+fl:'')+(tr?', '+tr:'')+'"><small aria-hidden="true">'+s[0]+(tr?' '+(d>0?'↑':'↓'):'')+'</small><b aria-hidden="true">'+val+'</b><i aria-hidden="true">'+u+(fl?' · '+fl:'')+'</i></div>';}).join('');}
function simQHTML(){const q=CS.q;if(!q)return '';const a=q.ans;
 return '<div class="card raised" style="display:grid;gap:10px;border-color:var(--accent)"><span class="eyebrow">Read the gas · the clock is stopped</span><h2 id="simQh" tabindex="-1" style="margin:0;font-size:14px">'+esc(q.q)+'</h2><div style="display:grid;gap:8px">'+
  q.o.map((o,i)=>'<button class="opt'+(a!=null?(o[1]?' right':i===a?' wrong':''):'')+'" data-qo="'+i+'"'+(a!=null?' aria-disabled="true"':'')+'><kbd>'+(i+1)+'</kbd><span>'+esc(o[0])+'</span></button>').join('')+'</div>'+
  (a!=null?'<p class="why '+(q.o[a][1]?'ok':'no')+'" style="margin:0"><b>'+(q.o[a][1]?'Right.':'Not quite.')+'</b> '+esc(q.o[a][2])+'</p><div class="btnrow"><button class="btn primary" id="simQgo">Back to the patient</button></div>':'')+'</div>';}
function simAnswer(i){const Z=CS,q=Z&&Z.q;if(!q||q.ans!=null||!q.o[i])return;q.ans=i;const ok=!!q.o[i][1];
 Z.qa.push({q:q.q,a:q.o[i][0],right:ok,r:(q.o.find(o=>o[1])||[''])[0],why:q.o[i][2],t:Z.t});Z.ev.push({t:Z.t,k:ok?'res':'qa',txt:'Gas read: '+(ok?'right.':'not quite.')});
 simUpd();const b=$('simQgo');if(b)b.focus();announce((ok?'Right. ':'Not quite. ')+q.o[i][2]);simSave();}
function simQDone(){const Z=CS;if(!Z||!Z.q)return;Z.q=null;simUpd();const b=(Z._ret&&document.querySelector('#v-cases [data-a="'+Z._ret+'"]'))||$('simPause');if(b)b.focus();simSave();}
function simActLabel(a,st){return esc(a.l)+' <small>'+[a.cost+' min',a.delay?'result in '+a.delay:'',st.n&&st.mx>1?'×'+st.n:'',st.pend?'sent':'',st.next!=null?'next at T+'+st.next:'',st.n>=st.mx?'done':''].filter(Boolean).join(' · ')+'</small>';}
/* in-place update: no full re-render on a tick */
function simUpd(){const Z=CS,el=$('v-cases');if(!Z||!Z.sim||!el)return;if(Z.over||!$('simClock')){simRender(el);return;}const c=Z.c,v=simVit(Z);
 $('simClock').textContent='T+'+Z.t+' min';$('simPaused').hidden=!Z.paused;$('simPause').textContent=Z.paused?'Resume':'Pause';
 ['simWait','simWait15'].forEach(i=>$(i).setAttribute('aria-disabled',String(!!(Z.paused||Z.q))));
 $('simVits').innerHTML=simVitHTML(v);
 const sv=$('simSev'),s0=(Z.hist.filter(h=>h[0]<=Z.t-5).pop()||Z.hist[0])[1],sn=Math.round(Z.sev);sv.firstChild.style.width=sn+'%';sv.setAttribute('aria-valuenow',sn);sv.setAttribute('aria-valuetext',sn+' of 100'+(sn>s0+2?', worse than 5 minutes ago':sn<s0-2?', better than 5 minutes ago':''));
 el.querySelectorAll('[data-a]').forEach(b=>{const a=c.actions.find(x=>x.id===b.dataset.a);if(!a)return;const st=simActState(a),h=simActLabel(a,st);if(b.innerHTML!==h)b.innerHTML=h;b.classList.toggle('done',st.n>0);b.setAttribute('aria-disabled',String(!st.ok||!!Z.q));});
 $('simPend').textContent=Z.pend.length?'Waiting on: '+Z.pend.map(p=>p.l+' ('+Math.max(0,p.at-Z.t)+' min)').join(', ')+'.':Z.res.length?'':'Nothing back yet. Order a test.';
 const rs=$('simRes');if(rs.dataset.n!==String(Z.res.length)){rs.dataset.n=Z.res.length;rs.innerHTML=Z.res.slice().reverse().map(r=>'<div class="simres"><small class="muted">'+esc(r.l)+' · taken at T+'+r.ordered+' min</small>'+(r.gas?slip(r.gas,{lv:4}):'<p style="margin:0">'+esc(r.txt||'')+'</p>')+'</div>').join('');}
 const ol=$('simEv');for(let i=+(ol.dataset.n||0);i<Z.ev.length;i++){const e=Z.ev[i],li=document.createElement('li');li.className=e.k==='unn'||e.k==='qa'?'warn':e.k;li.innerHTML='<span class="mono">'+e.t+'′</span> <span>'+(e.k==='harm'?'<b>Harm.</b> ':e.k==='warn'?'<b>Warning.</b> ':e.k==='unn'?'<b>Not needed.</b> ':'')+esc(e.txt)+'</span>';ol.insertBefore(li,ol.firstChild);}ol.dataset.n=Z.ev.length;
 const qb=$('simQ'),qs=Z.q?Z.q.q+'|'+Z.q.ans:'';if(qb.dataset.s!==qs){const opened=Z.q&&Z.q.ans==null;qb.dataset.s=qs;qb.innerHTML=simQHTML();if(opened){const h=$('simQh');if(h){h.focus({preventScroll:true});h.scrollIntoView({block:'center',behavior:RM()?'auto':'smooth'});}announce('The clock is stopped. Read the gas: '+Z.q.q);}}}
function simRender(el){if(!el||!CS||!CS.sim)return;const Z=CS,c=Z.c;stopSim();
 if(Z.over){document.body.classList.remove('insession');return simDebrief(el);}
 document.body.classList.add('insession');const cats=[['test','Tests'],['tx','Treatment'],['call','Call for help']],pace=simPace();
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button><span class="eyebrow">Timed sim · '+esc(c.set)+'</span></div>'+
  '<div class="card tint"><h2 aria-level="1">'+esc(c.t)+'</h2><p class="vig" style="margin-top:6px">'+esc(c.intro)+'</p></div>'+
  '<div class="card simbar" id="simBar"><div class="clock" role="timer" aria-live="off"><small>Sim time</small> <b class="mono" id="simClock"></b> <span class="chip bad" id="simPaused" hidden>Paused</span></div>'+
  '<div class="vits" id="simVits" style="grid-template-columns:repeat(auto-fit,minmax(96px,1fr))"></div>'+
  '<div class="sevbar" id="simSev" role="meter" aria-label="How unwell" aria-valuemin="0" aria-valuemax="100"><i></i></div>'+
  '<div class="btnrow"><button class="btn small" id="simPause"></button><button class="btn small" id="simWait">Wait 5 min</button><button class="btn small" id="simWait15">Wait 15 min</button>'+
  '<label class="muted" style="display:inline-flex;gap:6px;align-items:center;font-size:.85rem">Pace <select id="simPace">'+[1,2,3,5].map(n=>'<option value="'+n+'"'+(n===pace?' selected':'')+'>1 sim-min every '+n+' s</option>').join('')+'</select></label><button class="btn small" id="simEnd" style="margin-left:auto">Hand over</button></div>'+
  '<div id="simConf" class="why no" hidden></div>'+
  '<p class="note" style="margin:0">Each action takes the minutes shown and results come back after their delay. Pause stops the clock; actions still take their time.</p></div>'+
  '<div id="simQ"></div>'+
  '<div class="dgrid"><div class="card"><span class="eyebrow" role="heading" aria-level="2">Actions</span>'+cats.map(([k,l])=>{const as=c.actions.filter(a=>a.cat===k);return as.length?'<h3 style="margin:12px 0 6px;font-size:1em">'+l+'</h3><div class="acts" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">'+as.map(a=>'<button class="btn small act" style="justify-content:flex-start;text-align:left" data-a="'+a.id+'"></button>').join('')+'</div>':'';}).join('')+'</div>'+
  '<div class="card"><span class="eyebrow">Results</span><p class="note" id="simPend" style="margin:6px 0 0"></p><div id="simRes"></div></div></div>'+
  '<div class="card"><span class="eyebrow">Events</span><ol class="tl" id="simEv" role="log" aria-live="polite" aria-relevant="additions" aria-label="Events, newest first" style="max-height:260px;overflow:auto"></ol></div>';
 $('csBack').onclick=()=>{stopSim();Z.paused=true;simSave();document.body.classList.remove('insession');CS=null;RENDER.cases();toast('Sim paused and saved. Open it again to carry on.');};
 $('simPause').onclick=()=>{Z.paused=!Z.paused;simUpd();simSave();};
 const wait=n=>{if(Z.paused){toast('Paused: resume the clock to wait.');return;}if(Z.q){toast('Read the gas first.');return;}simAdvance(n);simUpd();};
 $('simWait').onclick=()=>wait(5);$('simWait15').onclick=()=>wait(15);
 $('simPace').onchange=e=>{S.ui=S.ui||{};S.ui.simPace=+e.target.value;save();};
 $('simEnd').onclick=()=>{const miss=simKeys(Z).filter(k=>Z.at[k.a]==null).length,cf=$('simConf');if(!miss&&Z.t>=10){simEnd('handover');return;}
  cf.hidden=false;cf.innerHTML='<b>'+(miss?miss+' key step'+(miss===1?'':'s')+' not done yet.':'Only T+'+Z.t+' min in.')+'</b> Hand over and end the sim? <span class="btnrow" style="margin-top:8px"><button class="btn small" id="simConfY">Hand over now</button><button class="btn small primary" id="simConfN">Keep going</button></span>';
  $('simConfY').onclick=()=>simEnd('handover');$('simConfN').onclick=()=>{cf.hidden=true;$('simEnd').focus();};$('simConfN').focus();};
 el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(b.getAttribute('aria-disabled')==='true'&&!Z.q){const a=c.actions.find(x=>x.id===b.dataset.a),st=simActState(a);toast(st.pend?'Already sent: waiting for the result.':st.next!=null?'Too soon: next at T+'+st.next+' min.':'Already done.');return;}simAct(b.dataset.a);});
 $('simQ').onclick=e=>{const b=e.target.closest('[data-qo]');if(b){simAnswer(+b.dataset.qo);return;}if(e.target.closest('#simQgo'))simQDone();};
 const ol=$('simEv');ol.dataset.n=0;$('simRes').dataset.n='';$('simQ').dataset.s='-';simUpd();
 SIMT=setInterval(()=>{const Y=CS;if(!Y||!Y.sim||Y.over||VIEW!=='cases'||!$('simClock')){stopSim();return;}if(Y.paused||Y.q||document.hidden)return;Y.tick=(Y.tick||0)+1;if(Y.tick%simPace()===0){simAdvance(1);simUpd();}},1000);}
function simDebrief(el){const Z=CS,c=Z.c,o=Z.over,keys=simKeys(Z),nm=k=>{const a=c.actions.find(x=>x.id===k.a);return a?a.l:k.a;};
 const mx=Math.max(Z.t,1),W=600,H=140,L=34,R=12,T=10,B=24,X=t=>(L+(W-L-R)*t/mx).toFixed(1),Y=s=>(T+(H-T-B)*(1-s/100)).toFixed(1),sevAt=t=>{let s=Z.hist[0][1];for(const h of Z.hist){if(h[0]<=t)s=h[1];else break;}return s;};
 /* labels are HTML over the SVG so they stay readable at any width */
 const lab=[],tx=(x,y,s,a)=>{lab.push('<span aria-hidden="true" class="muted" style="position:absolute;font-size:.72rem;line-height:1;white-space:nowrap;left:'+(100*x/W).toFixed(2)+'%;top:'+(100*(y-10)/H).toFixed(2)+'%'+(a==='end'?';transform:translateX(-100%)':'')+'">'+s+'</span>');return '';};
 const chart=Z.t<2?'<p class="note">Handed over at T+'+Z.t+' min: too short to chart.</p>':'<div style="position:relative"><svg viewBox="0 0 '+W+' '+H+'" class="sevchart" style="height:auto" role="img" aria-label="How unwell over time: '+Z.hist[0][1]+' at the start, '+Math.round(Z.sev)+' at T+'+Z.t+' min. Dots mark key steps, squares mark harms.">'+
  '<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(60)+'" y2="'+Y(60)+'"/>'+tx(L+4,+Y(60)-4,'unstable (60)')+'<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(100)+'" y2="'+Y(100)+'"/>'+tx(L+4,+Y(100)+13,'arrest')+
  '<line class="grid" x1="'+L+'" x2="'+L+'" y1="'+T+'" y2="'+(H-B)+'"/><line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+(H-B)+'" y2="'+(H-B)+'"/>'+tx(L,H-6,'0′')+tx(W-R,H-6,Z.t+'′','end')+tx(L-6,+Y(0)+4,'0','end')+tx(L-6,+Y(100)+4,'100','end')+
  '<path d="'+Z.hist.map((p,i)=>(i?'L':'M')+X(p[0])+' '+Y(p[1])).join(' ')+'" class="tline"/>'+
  keys.filter(k=>Z.at[k.a]!=null).map(k=>'<circle cx="'+X(Z.at[k.a])+'" cy="'+Y(sevAt(Z.at[k.a]))+'" r="5" style="fill:var(--good)"><title>'+esc(nm(k))+' at '+Z.at[k.a]+'′</title></circle>').join('')+
  Z.ev.filter(e=>e.k==='harm').map(e=>'<rect x="'+(X(e.t)-5)+'" y="'+(Y(sevAt(e.t))-5)+'" width="10" height="10" style="fill:var(--bad)"><title>Harm at '+e.t+'′</title></rect>').join('')+'</svg>'+lab.join('')+'</div><small class="muted">How unwell over time (higher is worse). Green dots: key steps. Red squares: harms.</small>';
 const vn=Z.vid&&(c.vars||[]).find(v=>v.id===Z.vid),fix=Z.ev.filter(e=>e.k==='warn'||e.k==='harm'||e.k==='unn'),gs=Z.res.filter(r=>r.gas),hasK=gs.some(r=>r.gas.k!=null),hasG=gs.some(r=>r.gas.glu!=null),art=gs.some(r=>r.gas.sample!=='v');
 el.innerHTML='<div class="crumbs"><button id="csBack">← Cases</button><span class="eyebrow">Debrief</span></div>'+
  '<div class="card raised" style="display:grid;gap:10px"><span class="eyebrow">'+esc(c.t)+' · T+'+Z.t+' min</span><h1 id="simEndH" tabindex="-1">'+esc(o.t)+'</h1><p style="margin:0">'+esc(o.d)+'</p>'+(vn?'<p class="note" style="margin:0">'+esc(vn.note)+'</p>':'')+
  '<p style="margin:0"><span class="chip '+(o.score>=80?'good':o.score>=50?'acc':'bad')+'">Score '+o.score+' / 100</span> <small class="muted">−20 missed, −10 late (−15 if critical), −15 harm, −5 warning or wrong read, −3 not needed</small></p>'+chart+'</div>'+
  '<div class="card"><span class="eyebrow">Key steps</span><div class="tw"><table class="tbl" style="min-width:0"><tr><th>Step</th><th>Target</th><th>You</th></tr>'+keys.map(k=>{const t=Z.at[k.a];return '<tr><td>'+esc(nm(k))+(k.crit?' <small class="muted">(critical)</small>':'')+'</td><td style="white-space:nowrap">by '+k.by+' min</td><td class="'+(t==null?'bad':t<=k.by?'good':'warn')+'" style="white-space:nowrap">'+(t==null?'missed':t+' min'+(t<=k.by?' ✓':' (late)'))+'</td></tr>';}).join('')+'</table></div></div>'+
  (fix.length?'<div class="card"><span class="eyebrow">What to change</span><ul class="tl">'+fix.map(e=>'<li class="'+(e.k==='unn'?'warn':e.k)+'"><span class="mono">'+e.t+'′</span> <span><b>'+(e.k==='harm'?'Harm.':e.k==='unn'?'Not needed.':'Warning.')+'</b> '+esc(e.txt)+'</span></li>').join('')+'</ul></div>':'')+
  (Z.qa.length?'<div class="card"><span class="eyebrow">Your gas reads · '+Z.qa.filter(q=>q.right).length+' of '+Z.qa.length+' right</span>'+Z.qa.map(q=>'<div class="simres"><b>'+esc(q.q)+'</b><span class="'+(q.right?'good':'bad')+'">You: '+esc(q.a)+'</span>'+(q.right?'':'<span class="good">Right: '+esc(q.r)+'</span>')+'<small class="muted">'+esc(q.why)+'</small></div>').join('')+'</div>':'')+
  '<div class="card"><span class="eyebrow">Your gases</span>'+(gs.length?'<div class="tw"><table class="tbl" style="min-width:0"><tr><th>Taken</th><th>pH</th><th>PCO₂</th><th>HCO₃⁻</th>'+(hasK?'<th>K⁺</th>':'')+'<th>Lactate</th>'+(hasG?'<th>Glucose</th>':'')+(art?'<th>P/F</th>':'')+'</tr>'+gs.map(r=>{const g=r.gas;return '<tr><td>T+'+r.ordered+'</td><td>'+g.pH.toFixed(2)+'</td><td>'+P(g.pco2)+'</td><td>'+g.hco3.toFixed(1)+'</td>'+(hasK?'<td>'+(g.k!=null?g.k.toFixed(1):'')+'</td>':'')+'<td>'+(g.lac!=null?g.lac.toFixed(1):'')+'</td>'+(hasG?'<td>'+(g.glu!=null?g.glu.toFixed(1):'')+'</td>':'')+(art?'<td>'+(g.po2!=null?Math.round(g.po2/g.fio2):'')+'</td>':'')+'</tr>';}).join('')+'</table></div><small class="muted">PCO₂ in '+PU()+'; P/F in mmHg.</small>':'<p class="note">No gas was taken.</p>')+(c.dbx?'<p style="margin:8px 0 0">'+esc(c.dbx(Z))+'</p>':'')+'</div>'+
  (c.teach?'<div class="card"><span class="eyebrow">Teaching points</span><ul style="margin:6px 0 0;padding-left:18px;display:grid;gap:6px">'+c.teach.map(t=>'<li>'+esc(t[0])+(t[1]&&SRC[t[1]]?' <small class="muted">('+esc(SRC[t[1]][0])+')</small>':'')+'</li>').join('')+'</ul></div>':'')+
  '<div class="card"><details><summary><span class="eyebrow">Full timeline</span></summary><ol class="tl">'+Z.ev.map(e=>'<li class="'+(e.k==='unn'?'warn':e.k)+'"><span class="mono">'+e.t+'′</span> <span>'+esc(e.txt)+'</span></li>').join('')+'</ol></details>'+caseSources(c,true)+'</div>'+
  '<div class="btnrow"><button class="btn primary" id="csAgain">Run it again</button><button class="btn" id="csAll">All cases</button></div>';
 $('csBack').onclick=$('csAll').onclick=()=>{CS=null;RENDER.cases();};$('csAgain').onclick=()=>{ui8SimFresh=true;openCase(c.id);};
 if(Z.focus==='end'){Z.focus=null;window.scrollTo(0,0);const h=$('simEndH');if(h)h.focus({preventScroll:true});announce(o.t+'. Score '+o.score+' of 100.');}}
/* keys 1–4 answer the gas question; Enter goes back to the patient */
document.addEventListener('keydown',e=>{const Z=CS;if(VIEW!=='cases'||!Z||!Z.sim||!Z.q||Z.over||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;const n=parseInt(e.key,10);
 if(Z.q.ans==null&&n>=1&&n<=Z.q.o.length){simAnswer(n-1);e.preventDefault();}else if(Z.q.ans!=null&&e.key==='Enter'&&!(t&&t.tagName==='BUTTON')){simQDone();e.preventDefault();}});
/* Practice: a sim left running (reload, other tab, ← Cases) can be resumed */
if(RENDER.practice){const _rp29=RENDER.practice;RENDER.practice=function(){_rp29.apply(this,arguments);const el=$('v-practice'),o=simLoadRaw();if(!el||!o)return;const c=CASES.find(x=>x.id===o.id);if(!c)return;
 const d=document.createElement('div');d.className='card tint';d.id='simResumeCard';d.innerHTML='<span class="eyebrow">Sim in progress</span><p style="margin:4px 0 8px">'+esc(c.t)+' · paused at T+'+o.t+' min.</p><button class="btn small primary" id="simResume">Resume the sim</button>';
 const h=el.querySelector('.view-head');if(h)h.after(d);else el.prepend(d);$('simResume').onclick=()=>openCase(o.id);};}
document.addEventListener('keydown',e=>{if(VIEW!=='cases'||!CS||CS.sim||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;const n=parseInt(e.key,10);
 if(n>=1&&n<=4){const b=document.querySelectorAll('#v-cases .opt[data-o]')[n-1];if(b&&!b.disabled){b.click();e.preventDefault();}}else if(e.key==='Enter'&&$('csNext')){$('csNext').click();e.preventDefault();}});
/* entry point in Practice */
if(RENDER.practice){const _rp8=RENDER.practice;RENDER.practice=function(){_rp8();const el=$('v-practice');if(!el)return;const shelves=el.querySelectorAll('.shelf');const d=document.createElement('div');d.className='shelf';const done=CASES.filter(c=>caseDone(c.id)).length;
 d.innerHTML='<h2>Case library <small>chat, image-led, timed sims</small></h2><div class="tiles"><button class="tile on" id="openCases"><span class="mono-mark">'+ic('scen')+'</span><span><small class="meta">'+CASES.length+' cases · '+done+' done</small><b>Open the library</b><span class="d">Filter by presentation, disorder, setting or exam. Timed sims: the patient worsens while you wait.</span></span></button>'+
  ['sim','chat','image'].map(f=>'<button class="tile" data-fmt="'+f+'"><span class="mono-mark">'+ic(f==='sim'?'timer':f==='image'?'lab':'scen')+'</span><span><small class="meta">'+CASES.filter(c=>c.fmt===f).length+' cases</small><b>'+FMT[f]+'</b><span class="d">'+({sim:'ER and ICU resuscitations with delayed results and a debrief.',chat:'The story unfolds in messages; decide at each step.',image:'Capnography, syringes, dipsticks, printouts and monitors.'})[f]+'</span></span></button>').join('')+'</div>';
 if(shelves[0])shelves[0].after(d);else el.appendChild(d);
 $('openCases').onclick=()=>{CS=null;go('cases');};d.querySelectorAll('[data-fmt]').forEach(b=>b.onclick=()=>{const f=caseFilters();f.fmt=b.dataset.fmt;CS=null;go('cases');});};}
/* #case-<id>: a deep link opens the case; Back onto the case you are in resumes it; a stale entry for another case shows the library instead of restarting an old case */
{const _route=route;route=function(h,first){const x=(h||'').replace(/^#/,'');if(x.startsWith('case-')&&CASES.some(c=>c.id===x.slice(5))){const id=x.slice(5);
 if(CS&&CS.c.id===id){if(VIEW!=='cases')go('cases',true);return;}
 if(first){openCase(id);return;}
 stopSim();CS=null;go('cases',true);try{history.replaceState(history.state,'','#cases');}catch(e){}return;}return _route(h,first);};}
