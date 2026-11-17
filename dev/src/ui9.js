/* ================= 4.8: links — Citrus contract v2, Galen and Citrus deep links, Yuzu packs from misses, reasoning-app hand-off, German glossary ================= */
const CITRUS_URL='https://amaerys.github.io/Citrus-Maxima/',GALEN_URL='https://galen-app.github.io/galen/';
let FROM='';
/* link format (Citrus, Galen): ?from=citrus|galen&do=<action>[&id=…][&wk=2026w46]; gas: ph, pco2 (paco2/pvco2), po2 (pao2), hco3, fio2 (0.4 or 40), na, k, cl, alb, lac, glu, age,
   sample=a|v, units=mmHg|kPa (PCO₂/PO₂). Keys are case-insensitive; a value that is not a plain number is refused, never replaced by the demo gas. */
const GAS_KEYS={ph:'pH',pco2:'pco2',paco2:'pco2',pvco2:'pco2',po2:'po2',pao2:'po2',hco3:'hco3',bicarb:'hco3',fio2:'fio2',na:'na',k:'k',cl:'cl',alb:'alb',lac:'lac',lactate:'lac',glu:'glu',glucose:'glu',age:'age'};
const UI9_GASNAME={pH:'pH',pco2:'PCO₂',po2:'PO₂',hco3:'HCO₃⁻',fio2:'FiO₂',na:'Na⁺',k:'K⁺',cl:'Cl⁻',alb:'albumin',lac:'lactate',glu:'glucose',age:'age'};
function ui9Params(){const m={};new URLSearchParams(location.search).forEach((v,k)=>{k=k.toLowerCase().trim();if(!(k in m))m[k]=String(v).trim();});return m;}
function ui9Num(s){s=String(s==null?'':s).replace(',','.');return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)?parseFloat(s):NaN;}
/* Galen gas from link params: {gas, bad[], note} with PCO₂/PO₂ in mmHg */
function ui9LinkGas(p){const gas={},bad=[];let any=false;Object.keys(p).forEach(k=>{const f=GAS_KEYS[k];if(!f)return;any=true;const x=ui9Num(p[k]);if(isNaN(x))bad.push(UI9_GASNAME[f]+' "'+p[k].slice(0,12)+'"');else if(gas[f]==null)gas[f]=x;});
 const sm=(p.sample||'').toLowerCase();if(sm)gas.sample=/^v/.test(sm)?'v':'a';
 const u=(p.units||p.unit||'').toLowerCase().replace(/\s/g,'');let kpa=u==='kpa',note='';
 /* no units given: PCO₂ under 15 with an HCO₃⁻ that only fits Henderson in kPa is read as kPa (a real PCO₂ of 12 mmHg in DKA still fits in mmHg) */
 if(!u&&gas.pH!=null&&gas.pco2!=null&&gas.pco2<15&&gas.hco3){const hn=Math.pow(10,9-gas.pH),fit=pc=>Math.abs(24*pc/gas.hco3-hn)/hn;if(fit(gas.pco2*KPA)<=0.1&&fit(gas.pco2)>0.1){kpa=true;note='Read as kPa (it only fits that way). ';}}
 if(kpa){gas.pco2!=null&&(gas.pco2=r1(gas.pco2*KPA));gas.po2!=null&&(gas.po2=r1(gas.po2*KPA));if(!note)note='Converted from kPa. ';}
 return {gas,bad,any,note};}
function ui9ToGas(p){const G9=ui9LinkGas(p),gas=G9.gas,src=FROM==='galen'?'Galen':'The link';
 loadInterp(gas);openTool('interp');
 setTimeout(()=>{try{buildForm();runInterp();}catch(e){}
  const mk=['pH','pco2'].filter(k=>gas[k]==null),miss=mk.map(k=>UI9_GASNAME[k]);
  if(G9.bad.length)toast('Not a number, left out: '+G9.bad.join(', ')+'. '+(miss.length?'Add '+miss.join(' and ')+'.':'Check the form.'),'bad');
  else if(G9.any&&miss.length)toast(src+' sent no '+miss.join(' or ')+'. Add '+(miss.length>1?'them':'it')+' to read the gas.','bad');
  else if(G9.note)toast(G9.note+'Check the values.');
  const f=mk.length?$('i_'+mk[0]):null;if(f)f.focus();},40);}
/* the week a review covers: Sunday reviews the week ending today, Monday the week that ended yesterday (same ISO week id on both days) */
function ui9RevOff(d){return (d||new Date()).getDay()===1?1:0;}
function ui9Week(wk){const t=new Date(),p=new Date();p.setDate(t.getDate()-7);if(wk===isoWeek(t))return 0;if(wk===isoWeek(p))return 1;return null;}
function deepLink(){let p;try{p=ui9Params();}catch(e){return;}
 if(!Object.keys(p).length){try{const f=sessionStorage.getItem('buffer.from');if(f==='citrus'||f==='galen')FROM=f;}catch(e){}backChip();return;}
 const from=(p.from||'').toLowerCase();if(from==='citrus'||from==='galen'){FROM=from;try{sessionStorage.setItem('buffer.from',from);}catch(e){}}
 const d=(p.do||'').toLowerCase(),id=p.id||'',gasKey=Object.keys(p).some(k=>GAS_KEYS[k]);
 try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}
 const no=(m,v)=>{toast(m,'warn');go(v);};
 if(d==='interp'||gasKey){if(gasKey||FROM==='galen')ui9ToGas(p);else openTool('interp');}
 else if(d==='round'){go('today');setTimeout(()=>{const b=$('tRound');if(b)b.click();},60);}
 else if(d==='log')openTool('log');else if(d==='cases'){CS=null;go('cases');}
 else if(d==='case'){const c=CASES.find(x=>x.id===id)||CASES.find(x=>x.id.toLowerCase()===id.toLowerCase());if(c)openCase(c.id);else{CS=null;no('That case is not in this version of Buffer. Here is the case library.','cases');}}
 else if(d==='lesson'){const l=LBYID[id]||L.find(x=>x.id.toLowerCase()===id.toLowerCase());if(l)openLesson(l.id);else no('That lesson is not in this version of Buffer. Here are the lessons.','learn');}
 else if(d==='speed'||d==='practice')go('practice');
 else if(d==='weekly'||d==='review'||d==='progress'){const off=ui9Week((p.wk||'').toLowerCase());if(typeof UI6_WOFF!=='undefined')UI6_WOFF=off==null?(d==='progress'?null:ui9RevOff()):off;go('progress');}
 else if(d==='yuzu'){go('progress');setTimeout(()=>{const y=$('wkYz'),b=$('wkYuzu');if(y)y.scrollIntoView({block:'center'});if(b&&!b.disabled)b.focus({preventScroll:true});},80);}
 else if(d==='glossary')go('gloss');else if(d==='learn'||d==='today'||d==='settings')go(d);
 else if(d)no('Buffer does not know the link action "'+d.slice(0,20)+'". Opened Today.','today');
 backChip();}
/* back chip: survives a reload (sessionStorage), can be dismissed, and pads the page so it never covers the last rows */
function backChip(){const old=$('fromChip');if(!FROM){if(old)old.remove();document.body.style.paddingBottom='';return;}
 let c=old;if(!c){c=document.createElement('div');c.id='fromChip';c.className='fromchip';c.style.padding='0';c.setAttribute('role','navigation');c.setAttribute('aria-label','Back to the app that opened Buffer');document.body.appendChild(c);
  const pb=parseFloat(getComputedStyle(document.body).paddingBottom)||0;document.body.style.paddingBottom=(pb+60)+'px';}
 const nm=FROM==='galen'?'Galen':'Citrus';
 c.innerHTML='<a href="'+(FROM==='galen'?GALEN_URL:CITRUS_URL)+'?from=buffer" style="color:inherit;text-decoration:none;padding:10px 6px 10px 14px;min-height:44px;display:flex;align-items:center">← '+nm+'</a><button type="button" aria-label="Hide the back to '+nm+' button" style="background:none;border:0;color:inherit;font:inherit;font-size:20px;line-height:1;min-width:44px;min-height:44px;cursor:pointer">×</button>';
 c.querySelector('button').onclick=()=>{FROM='';try{sessionStorage.removeItem('buffer.from');}catch(e){}backChip();};}
{const _b=boot;boot=function(){_b();try{deepLink();}catch(e){console.error(e);}};}

/* Citrus contract v2: metrics, actions and a weekly proposal */
function isoWeek(d){d=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-day);const y=new Date(Date.UTC(d.getUTCFullYear(),0,1));return d.getUTCFullYear()+'w'+String(Math.ceil(((d-y)/864e5+1)/7)).padStart(2,'0');}
/* end of a local day as an ISO instant */
function ui9EndOf(d){const e=new Date(d);e.setHours(23,59,59,0);return e.toISOString();}
/* Sun/Mon only (the same days as ui6 'Weekly review ready' and ui10 Today's plan); null on other days */
function ui9ReviewWeek(now){now=now||new Date();const dow=now.getDay();if(dow!==0&&dow!==1)return null;const off=ui9RevOff(now),ref=new Date(now);ref.setDate(now.getDate()-off);const mon=new Date(now);mon.setDate(now.getDate()+(dow===0?1:0));
 return {wk:isoWeek(ref),off,expires:ui9EndOf(mon)};}
if(typeof hubStatus==='function'){const _hs9=hubStatus;hubStatus=function(){const s=_hs9();try{const base=location.origin+location.pathname,now=new Date(),t=today(),w=weeklyReview(),wk=isoWeek(now);
 s.contract=2;
 s.metrics=[{key:'gases',label:'Gases today',value:todayN(),goal:S.goal||15,unit:'gases',date:t},{key:'mastery',label:'Mastery',value:masteryScore(),goal:100,unit:'%',date:t},{key:'week-days',label:'Days this week',value:w.days,goal:7,unit:'days',date:t},{key:'live-gases',label:'Real gases logged this week',value:w.live,goal:null,unit:'gases',date:t}];
 const nL=L.length,nD=L.filter(l=>S.done&&S.done[l.id]).length,cs=typeof CASES!=='undefined'?CASES:[],nC=cs.filter(c=>typeof caseDone==='function'&&caseDone(c.id)).length,pc=(a,b)=>b?Math.round(a/b*100):0;
 s.progress=[{key:'mastery',label:'Pattern mastery',pct:masteryScore(),date:t},{key:'lessons',label:'Lessons done ('+nD+' of '+nL+')',pct:pc(nD,nL),value:nD,max:nL,date:t},{key:'cases',label:'Cases done ('+nC+' of '+cs.length+')',pct:pc(nC,cs.length),value:nC,max:cs.length,date:t}];
 s.actions=[{id:'round',label:S.lastRound===t?'Round done · review':'Start the Round',url:base+'?from=citrus&do=round',icon:'🧪',minutes:25},{id:'interp',label:'Read a gas',url:base+'?from=citrus&do=interp',icon:'🧪',minutes:2},{id:'log',label:'Gas log',url:base+'?from=citrus&do=log',icon:'🧪',minutes:2},{id:'cases',label:'Case library',url:base+'?from=citrus&do=cases',icon:'🧪',minutes:15}];
 s.inbox=s.inbox||[];const rv=ui9ReviewWeek(now);
 if(rv)s.inbox.push({id:'buffer-week-'+rv.wk,type:'task',title:'Buffer: weekly review',minutes:5,pri:3,url:base+'?from=citrus&do=weekly&wk='+rv.wk,expires:rv.expires});
 /* only points not yet sent; the task clears once they are sent, and comes back only with 5 new ones */
 const miss=yuzuMissCards(true);if(miss.length>=5){const sun=new Date(now);sun.setDate(now.getDate()+(7-now.getDay())%7);s.inbox.push({id:'buffer-yuzu-'+wk,type:'task',title:'Buffer: send '+miss.length+' new missed points to Yuzu',minutes:2,pri:3,url:base+'?from=citrus&do=yuzu',expires:ui9EndOf(sun)});}}catch(e){console.error(e);}return s;};}

/* Yuzu: missed lesson questions and case mistakes as a pack in the Yuzu inbox */
function slugify(x){return String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);}
const ui9Plain=s=>String(s==null?'':s).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
/* lesson misses use ui3's lesson-pack card (same id, so Yuzu updates the card in place); case misses: one card per case step, with the gas and the nurse's lines */
function ui9LessonCard(l,it){if(typeof ui3McqCard==='function')return ui3McqCard(l,it);return {id:'buf-q-'+l.id+'-'+slugify(ui9Plain(it[0])),type:'mcq',question:ui9Plain(it[0]),options:it[1].map((o,i)=>({text:ui9Plain(o),correct:i===it[2]})),explanation:ui9Plain(it[3]),source:'Buffer · '+l.t};}
function ui9CaseCard(x){const parts=String(x.key||'').split(':'),si=+parts[parts.length-2],cid=x.cid||parts.slice(0,-2).join(':');const c=typeof CASES!=='undefined'&&CASES.find(y=>y.id===cid);const st=c&&c.steps&&c.steps[si];
 const id='buf-c-'+slugify(cid+'-'+(isNaN(si)?x.q:si)),src='Buffer case · '+(x.ct||(c&&c.t)||'');
 if(!st)return {id,type:'basic',front:(x.ct?x.ct+': ':'')+ui9Plain(x.q),back:ui9Plain(x.r)+(x.e?'<br><small>Your answer: '+esc(x.a||'')+'. '+esc(ui9Plain(x.e))+'</small>':''),source:src};
 let g=null,gi=si;for(;gi>=0;gi--)if(c.steps[gi].gas){g=c.steps[gi].gas;break;}
 const gl=g&&typeof ui8GasLine==='function'?ui8GasLine(g):'',said=(st.m||[]).map(m=>m[0]+': '+ui9Plain(m[1])).join(' ');
 const ctx=[c.t+'.',si===0||!g?ui9Plain(c.intro):'',gl?(gi===si?gl:'Earlier gas · '+gl):'',said].filter(Boolean).join(' ');
 const right=st.o.find(o=>o[1]);
 return {id,type:'mcq',question:ctx+' — '+ui9Plain(st.q),options:st.o.map(o=>({text:ui9Plain(o[0]),correct:!!o[1],why:ui9Plain(o[2])})),explanation:(right?ui9Plain(right[2]):'')+(x.a?' Your answer was: '+ui9Plain(x.a)+'.':''),source:src};}
/* onlyNew: leave out points already sent (S.yzSent[id] = time sent) unless missed again since */
function yuzuMissCards(onlyNew){const cards=[],at={},sent=S.yzSent||{};const add=(c,t)=>{const i=cards.findIndex(y=>y.id===c.id);if(i>=0){at[c.id]=Math.max(at[c.id],t);return;}cards.push(c);at[c.id]=t;};
 /* keys 'lid:qi' (index) or 'lid:<ui3QId>' (stable id, if ui1 moves to it) */
 Object.keys(S.qmiss||{}).forEach(k=>{const i=k.indexOf(':'),lid=k.slice(0,i),qi=k.slice(i+1);const l=LBYID[lid];const it=l&&l.q&&(/^\d+$/.test(qi)?l.q[+qi]:typeof ui3QId==='function'&&l.q.find(q=>ui3QId(l.id,q)===qi));if(!it||!Array.isArray(it[1]))return;add(ui9LessonCard(l,it),+S.qmiss[k]||0);});
 (S.cmist||[]).filter(x=>x&&!x.del).forEach(x=>{try{add(ui9CaseCard(x),+x.u||0);}catch(e){}});
 return onlyNew?cards.filter(c=>!(sent[c.id]>=at[c.id])):cards;}
function ui9MarkSent(cards){S.yzSent=Object.assign({},S.yzSent);const t=Date.now();cards.forEach(c=>S.yzSent[c.id]=t);save();}
async function toYuzu(btn,msgEl){const cards=yuzuMissCards(true),all=yuzuMissCards().length,pl=n=>n+' card'+(n===1?'':'s');
 if(!cards.length){msgEl.textContent=all?'All '+all+' missed points are already in Yuzu. New ones collect here.':'Nothing missed yet. Wrong answers in lessons and cases collect here.';return;}
 const wk=isoWeek(new Date()),pid='buffer-misses-'+wk+'-'+Date.now().toString(36),fn=pid+'.yuzu.json';const p=pack(pid,'Buffer: missed points '+wk,cards);let why='';
 const on=typeof signedIn==='function'&&signedIn();
 if(on){try{msgEl.textContent='Sending…';const yz=await hubOtherFolder('yuzu-data',[[HUB_ROOT,'Yuzu']]);const col=yz&&await folder('collection',yz,false);const inbox=col&&await folder('inbox',col,true);
   if(!inbox){why='Yuzu\'s Drive folder was not found (open Yuzu once and connect Google there).';throw 0;}await putJSON(pid+'.json',inbox,p);ui9MarkSent(cards);msgEl.textContent='Sent '+pl(cards.length)+' to Yuzu\'s inbox. Review them in Yuzu before they are added.';return;}
  catch(e){if(!why)why='Could not reach Yuzu on Drive'+(e&&e.message?' ('+e.message+')':'')+'.';}}
 const ok=await copyText(JSON.stringify(p),btn);
 /* 5.0 (D22 S8): a copy is not proof the points reached Yuzu, so they stay unsent and go again (same ids, Yuzu de-duplicates) once Drive works */
 if(ok){msgEl.textContent=(why?why+' ':'')+'Copied '+pl(cards.length)+'. Paste into a file named '+fn+' and import it in Yuzu'+(on?'.':', or connect Google to send it straight to Yuzu.')+' They stay in the queue until Yuzu receives them on Drive.';return;}
 const dl=typeof ui3Download==='function'&&ui3Download(fn,JSON.stringify(p));if(dl)ui9MarkSent(cards);
 msgEl.textContent=(why?why+' ':'')+(dl?'Downloaded '+fn+'. Import it in Yuzu.':'Could not copy or download the pack here.');}

/* reasoning-app hand-off: a structured case file in the handoff folder (tag handoff; old path My Apps/hub/handoff) */
function handoff(kind,obj){const id='buffer-'+kind+'-'+Date.now().toString(36);return Object.assign({buffer_handoff:1,id,app:'buffer',version:APP_VERSION,kind,at:new Date().toISOString()},obj);}
async function sendHandoff(h,btn){const txt=JSON.stringify(h);const name=(h.id||'buffer-'+h.kind+'-'+Date.now().toString(36))+'.json';let why='';
 if(typeof signedIn==='function'&&signedIn()){try{const ho=await hubOwnFolder('handoff','handoff');await putJSON(name,ho,h);toast('Sent to the reasoning app\'s inbox on Drive','good');return;}catch(e){why='Drive failed'+(e&&e.message?' ('+e.message+')':'')+'. ';}}
 const ok=await copyText(txt,btn);toast(ok?why+'Hand-off copied. Paste it into the reasoning app.':why+'Clipboard blocked: the hand-off was not sent.',ok&&!why?'good':'bad');}
/* the same input the on-screen read uses: FiO₂ typed as 40 means 0.40, HCO₃⁻ calculated when not typed */
function ui9Read(){const inp=Object.assign({},IV);if(inp.fio2!=null&&inp.fio2>1)inp.fio2=inp.fio2/100;if(inp.pH==null||inp.pco2==null)return {err:'Enter at least pH and PCO₂.'};
 let calc=false;if(inp.hco3==null){inp.hco3=r1(hFrom(inp.pH,inp.pco2));calc=true;}const o=interp(inp);delete inp._hcalc;return {inp,o,calc,err:o.err};}
function ui9GasHandoff(){const R=ui9Read();if(R.err)return R;const o=R.o,inp=R.inp,bad=(o.flags||[]).includes('inconsistent'),pre=bad?'UNRELIABLE (Henderson mismatch): ':'';
 const gas=Object.assign({},inp,{units:'mmHg'});if(R.calc)gas.hco3Calculated=true;
 return {h:handoff('gas',{title:pre+ui9Plain(o.label),gas,read:pre+ui9Plain(o.line),flags:o.flags||[],steps:(o.steps||[]).map(s=>({step:ui9Plain(s.t),result:ui9Plain(s.v),working:ui9Plain(s.d)})),next:(typeof nextKeys==='function'?nextKeys(o,inp):[]).filter(k=>NEXT[k]).map(k=>ui9Plain(NEXT[k].t))})};}
if(typeof runInterp==='function'){const _ri9=runInterp;runInterp=function(){_ri9();const row=$('iSave')&&$('iSave').parentElement;if(!row||$('iHand'))return;const b=document.createElement('button');b.className='btn small';b.id='iHand';b.textContent='Hand off to reasoning';row.appendChild(b);
 b.onclick=()=>{const r=ui9GasHandoff();if(r.err){toast('Fix the input first: '+r.err,'bad');return;}sendHandoff(r.h,b);};};}
if(typeof simDebrief==='function'){const _sd=simDebrief;simDebrief=function(el){_sd(el);const r=el.querySelector('.btnrow:last-child');if(!r||!CS)return;const b=document.createElement('button');b.className='btn';b.textContent='Hand off to reasoning';r.appendChild(b);const c=CS.c;
 b.onclick=()=>sendHandoff(handoff('sim',{title:c.t,setting:c.set,intro:c.intro,ending:CS.over.t,minutes:CS.t,timeline:CS.ev.map(e=>({t:e.t,kind:e.k,text:e.txt})),key:c.key.map(k=>({step:(c.actions.find(a=>a.id===k.a)||{}).l,target:k.by,done:CS.at[k.a]==null?null:CS.at[k.a]}))}),b);};}

/* weekly review: send misses to Yuzu */
/* its own small card under the weekly card (not inside it: the weekly card is about this week and Citrus) */
function ui9YuzuLabel(){const n=yuzuMissCards(true).length,all=yuzuMissCards().length;return {n,all,t:n?'Send '+n+' new missed point'+(n===1?'':'s')+' to Yuzu':all?'All '+all+' sent to Yuzu':'Nothing to send yet'};}
function ui9YuzuDraw(){const b=$('wkYuzu');if(!b)return;const x=ui9YuzuLabel();b.textContent=x.t;b.disabled=!x.n;const s=$('wkYuzuN');if(s)s.textContent=x.all?x.all+' in total':'';}
if(RENDER.progress){const _rp9=RENDER.progress;RENDER.progress=function(){_rp9();const el=$('v-progress');if(!el||$('wkYz'))return;const w=el.querySelector('.weekc')||el.querySelector('.view-head');if(!w)return;
 const d=document.createElement('div');d.className='card';d.id='wkYz';
 d.innerHTML='<div class="btnrow" style="justify-content:space-between"><span class="eyebrow">Missed points</span><small class="note" id="wkYuzuN"></small></div><p class="note" style="margin:6px 0 0">Lesson and case questions you got wrong, as Yuzu cards. Only new ones are sent; a point you miss again is sent again.</p><div class="btnrow" style="margin-top:10px"><button class="btn small" id="wkYuzu"></button></div><p class="note" id="wkYuzuMsg" role="status" style="margin:6px 0 0"></p>';
 w.after(d);ui9YuzuDraw();$('wkYuzu').onclick=async e=>{const b=e.currentTarget;b.disabled=true;await toYuzu(b,$('wkYuzuMsg'));ui9YuzuDraw();setTimeout(ui9YuzuDraw,1500);};};}

/* German glossary */
/* Rows: stable id (never change it: Yuzu keeps review history by id), English, German headword with article, plural ('–' = no plural in use), topic, example,
   options {abbr, alt (synonyms, lay or ward words), reg ('Arzt' doctor-to-doctor, 'Patient' lay, 'Jargon' ward slang), pp (verbs: Perfekt), ex2 (second example, e.g. du/Sie)}.
   Old ids (buf-de-<english slug>) are kept for the 4.9 rows so cards already in Yuzu update in place. */
function gl9(id,en,de,pl,cat,ex,o){return Object.assign({id:'buf-de-'+id,en,de,pl,cat,ex},o||{});}
const GL9_CATS=['Gas','Acid–base','Breathing','ICU','Kidney and electrolytes','Patients','Verbs'];
const GLOSS=[
 gl9('blood-gas-analysis','blood gas analysis','die Blutgasanalyse','die Blutgasanalysen','Gas','Wir machen in einer Stunde eine Kontroll-BGA.',{abbr:'BGA',alt:'Station: „die BGA“ (Pl. die BGAs)'}),
 gl9('arterial-blood-gas','arterial blood gas','die arterielle BGA','die arteriellen BGAs','Gas','Könnten Sie bitte eine arterielle BGA abnehmen?',{ex2:'Kannst du bitte eine arterielle BGA abnehmen?'}),
 gl9('venous-blood-gas','venous blood gas','die venöse BGA','die venösen BGAs','Gas','Eine venöse BGA reicht für pH-Wert, Bikarbonat und Laktat.'),
 gl9('kapillaere-bga','capillary blood gas','die kapilläre BGA','die kapillären BGAs','Gas','Beim Neugeborenen nehmen wir eine kapilläre BGA aus der Ferse ab.'),
 gl9('sample','sample','die Probe','die Proben','Gas','Die Probe muss sofort gemessen werden, sonst verfälschen Luftblasen und Stoffwechsel die Werte.'),
 gl9('bga-geraet','blood gas analyser','das BGA-Gerät','die BGA-Geräte','Gas','Bringen Sie die Probe bitte sofort zum BGA-Gerät.'),
 gl9('syringe','syringe','die Spritze','die Spritzen','Gas','Die BGA-Spritze ist heparinisiert.'),
 gl9('air-bubble','air bubble','die Luftblase','die Luftblasen','Gas','Entfernen Sie die Luftblase, bevor Sie die Probe messen.'),
 gl9('puncture','puncture','die Punktion','die Punktionen','Gas','Die Punktion der Arteria radialis war schwierig.'),
 gl9('radial-artery','radial artery','die Arteria radialis','die Arteriae radiales','Gas','Vor der Punktion der Arteria radialis machen wir den Allen-Test.',{alt:'Station: „die Radialis“'}),
 gl9('arterial-line','arterial line','der arterielle Zugang','die arteriellen Zugänge','Gas','Wir legen eine Arterie und nehmen die BGA daraus ab.',{alt:'Station: „die Arterie“ („eine Arterie legen“); auch: die arterielle Kanüle'}),
 gl9('ph-wert','pH','der pH-Wert','die pH-Werte','Gas','Der pH-Wert liegt bei 7,21.'),
 gl9('pco2','PaCO₂, carbon dioxide tension','der pCO₂','–','Gas','Der pCO₂ ist auf 68 mmHg erhöht.',{alt:'ausgeschrieben: der Kohlendioxidpartialdruck; gesprochen „pe-ce-o-zwei“'}),
 gl9('po2','PaO₂, oxygen tension','der pO₂','–','Gas','Der pO₂ beträgt 55 mmHg unter 2 Litern Sauerstoff.',{alt:'ausgeschrieben: der Sauerstoffpartialdruck'}),
 gl9('normal-value','normal value','der Normwert','die Normwerte','Gas','Das Kalium liegt über dem Normwert.'),
 gl9('result','finding; report','der Befund','die Befunde','Gas','Der Befund ist auffällig.',{alt:'für einen Laborwert eher: der Wert, das Ergebnis'}),
 gl9('wert','value, result','der Wert','die Werte','Gas','Die Werte haben sich gebessert.'),
 gl9('ergebnis','result','das Ergebnis','die Ergebnisse','Gas','Das Ergebnis der BGA liegt vor.'),
 gl9('acid','acid','die Säure','die Säuren','Acid–base','Bei der Ketoazidose häufen sich Ketosäuren an.'),
 gl9('base','base','die Base','die Basen','Acid–base','Eine Base nimmt Protonen auf.'),
 gl9('buffer','buffer','der Puffer','die Puffer','Acid–base','Bikarbonat ist der wichtigste Puffer im Blut.'),
 gl9('acidosis','acidosis','die Azidose','die Azidosen','Acid–base','Der Patient hat eine schwere Azidose.'),
 gl9('alkalosis','alkalosis','die Alkalose','die Alkalosen','Acid–base','Nach dem Erbrechen besteht eine metabolische Alkalose.'),
 gl9('metabolic','metabolic','metabolisch','','Acid–base','Es besteht eine metabolische Azidose.'),
 gl9('respiratory','respiratory','respiratorisch','','Acid–base','Es besteht eine respiratorische Alkalose.'),
 gl9('compensation','compensation','die Kompensation','die Kompensationen','Acid–base','Die respiratorische Kompensation ist ausreichend.'),
 gl9('teilkompensiert','partially compensated','teilkompensiert','','Acid–base','Es besteht eine metabolisch teilkompensierte respiratorische Azidose.'),
 gl9('dekompensiert','decompensated, uncompensated','dekompensiert','','Acid–base','Es besteht eine dekompensierte respiratorische Azidose.'),
 gl9('entgleist','out of control (metabolism, sugar)','entgleist','','Acid–base','Der Patient ist metabolisch entgleist.',{reg:'Jargon',alt:'auch: „Der Zucker ist entgleist.“'}),
 gl9('anion-gap','anion gap','die Anionenlücke','die Anionenlücken','Acid–base','Die Anionenlücke ist mit 24 mmol/l erhöht.'),
 gl9('base-excess','base excess','der Base Excess','–','Acid–base','Der BE liegt bei minus 14 mmol/l.',{abbr:'BE',reg:'Jargon',alt:'gesprochen „be-e“; Lehrbuch: die Basenabweichung, der Basenüberschuss (positiv), das Basendefizit (negativ)'}),
 gl9('basendefizit','base deficit','das Basendefizit','die Basendefizite','Acid–base','Es besteht ein Basendefizit von 12 mmol/l.'),
 gl9('bicarbonate','bicarbonate','das Bikarbonat','die Bikarbonate','Acid–base','Das Bikarbonat liegt bei 14 mmol/l.',{alt:'auch: das Hydrogencarbonat (HCO₃⁻)'}),
 gl9('standardbikarbonat','standard bicarbonate','das Standardbikarbonat','–','Acid–base','Das Standardbikarbonat ist auf 18 mmol/l erniedrigt.'),
 gl9('natriumbikarbonat','sodium bicarbonate (drug)','das Natriumbikarbonat','–','Acid–base','Wir geben 100 ml Natriumbikarbonat 8,4 %.',{alt:'auch: Natriumhydrogencarbonat 8,4 %'}),
 gl9('lactate','lactate','das Laktat','–','Acid–base','Das Laktat liegt bei 4,8 mmol/l.'),
 gl9('laktatazidose','lactic acidosis','die Laktatazidose','die Laktatazidosen','Acid–base','Im septischen Schock entwickelt sich eine Laktatazidose.'),
 gl9('ketoacidosis','ketoacidosis','die Ketoazidose','die Ketoazidosen','Acid–base','Bei Alkoholabhängigkeit denken wir auch an eine alkoholische Ketoazidose.'),
 gl9('diabetic-ketoacidosis','diabetic ketoacidosis','die diabetische Ketoazidose','die diabetischen Ketoazidosen','Acid–base','Bei der diabetischen Ketoazidose ist die Anionenlücke erhöht.',{abbr:'DKA'}),
 gl9('hyperchloraem','hyperchloraemic acidosis','die hyperchlorämische Azidose','die hyperchlorämischen Azidosen','Acid–base','Nach viel NaCl 0,9 % entsteht eine hyperchlorämische Azidose.'),
 gl9('raised','raised, high','erhöht','','Acid–base','Der pH-Wert ist erniedrigt, der pCO₂ erhöht.'),
 gl9('lowered','low, decreased','erniedrigt','','Acid–base','Das Bikarbonat ist erniedrigt.',{alt:'auch: vermindert'}),
 gl9('grenzwertig','borderline','grenzwertig','','Acid–base','Das Kalium ist grenzwertig hoch.'),
 gl9('normbereich','within the normal range','im Normbereich','','Acid–base','Die übrigen Werte liegen im Normbereich.'),
 gl9('oxygen','oxygen','der Sauerstoff','–','Breathing','Geben Sie 2 Liter Sauerstoff über die Nasenbrille.',{alt:'kurz: O₂'}),
 gl9('nasenbrille','nasal cannula','die Nasenbrille','die Nasenbrillen','Breathing','Er bekommt 2 Liter pro Minute über die Nasenbrille.'),
 gl9('reservoirmaske','non-rebreather mask','die Maske mit Reservoir','die Masken mit Reservoir','Breathing','Unter 15 Litern über die Maske mit Reservoir liegt die Sättigung bei 88 %.',{alt:'auch: die Reservoirmaske'}),
 gl9('high-flow','high-flow nasal oxygen','die High-Flow-Sauerstofftherapie','–','Breathing','Wir starten eine High-Flow-Therapie mit 50 Litern pro Minute und einer FiO₂ von 0,5.',{abbr:'HFNC',noAbk:1,alt:'Station: „das High-Flow“'}),
 gl9('carbon-dioxide','carbon dioxide','das Kohlendioxid','–','Breathing','Bei Hypoventilation steigt das Kohlendioxid im Blut an.',{alt:'kurz: das CO₂'}),
 gl9('partial-pressure','partial pressure','der Partialdruck','die Partialdrücke','Breathing','Der Partialdruck wird in mmHg oder kPa angegeben.'),
 gl9('oxygen-saturation','oxygen saturation','die Sauerstoffsättigung','–','Breathing','Die Sättigung fällt auf 85 % ab.',{alt:'Station: „die Sättigung“; arteriell: die SaO₂; Pulsoxymetrie: die SpO₂'}),
 gl9('shortness-of-breath','shortness of breath','die Dyspnoe','–','Breathing','Der Patient kommt mit zunehmender Dyspnoe.',{reg:'Arzt',alt:'Patient: die Atemnot, die Luftnot („Seit wann haben Sie Atemnot?“)'}),
 gl9('tachypnoe','tachypnoea','die Tachypnoe','–','Breathing','Es besteht eine Tachypnoe mit 32 Atemzügen pro Minute.'),
 gl9('respiratory-rate','respiratory rate','die Atemfrequenz','die Atemfrequenzen','Breathing','Die Atemfrequenz liegt bei 28 pro Minute.',{abbr:'AF'}),
 gl9('kussmaul','Kussmaul breathing','die Kussmaul-Atmung','–','Breathing','Die tiefe Kussmaul-Atmung spricht für eine metabolische Azidose.'),
 gl9('respiratory-failure','respiratory failure','die respiratorische Insuffizienz','die respiratorischen Insuffizienzen','Breathing','Die Patientin hat eine akute respiratorische Insuffizienz.'),
 gl9('partialinsuffizienz','type 1 respiratory failure (hypoxaemic)','die respiratorische Partialinsuffizienz','–','Breathing','Unter Raumluft besteht eine respiratorische Partialinsuffizienz.',{alt:'nur Hypoxämie; auch: hypoxämische respiratorische Insuffizienz'}),
 gl9('globalinsuffizienz','type 2 respiratory failure (hypercapnic)','die respiratorische Globalinsuffizienz','–','Breathing','Bei der exazerbierten COPD besteht eine respiratorische Globalinsuffizienz.',{alt:'Hypoxämie plus Hyperkapnie; auch: hyperkapnische respiratorische Insuffizienz'}),
 gl9('hypoxaemie','hypoxaemia','die Hypoxämie','–','Breathing','Die Hypoxämie bessert sich unter Sauerstoff.',{alt:'Adjektiv: hypoxämisch'}),
 gl9('hyperkapnie','hypercapnia','die Hyperkapnie','–','Breathing','Bei chronischer Hyperkapnie ist das Bikarbonat erhöht.',{alt:'Adjektiv: hyperkapnisch'}),
 gl9('hypokapnie','hypocapnia','die Hypokapnie','–','Breathing','Die Hyperventilation führt zu einer Hypokapnie.'),
 gl9('hypoventilation','hypoventilation','die Hypoventilation','–','Breathing','Unter Opioiden kommt es zur Hypoventilation.'),
 gl9('hyperventilation','hyperventilation','die Hyperventilation','–','Breathing','Die Hyperventilation erklärt die respiratorische Alkalose.'),
 gl9('lung','lung','die Lunge','die Lungen','Breathing','Über der Lunge hört man basal Rasselgeräusche.'),
 gl9('pneumonia','pneumonia','die Pneumonie','die Pneumonien','Breathing','Die Patientin hat eine ambulant erworbene Pneumonie.',{reg:'Arzt',alt:'Patient: die Lungenentzündung'}),
 gl9('pulmonary-embolism','pulmonary embolism','die Lungenembolie','die Lungenembolien','Breathing','Bei Verdacht auf eine Lungenembolie machen wir eine CT-Angiographie.',{abbr:'LAE',alt:'auch: die Lungenarterienembolie (LAE)'}),
 gl9('asthma-attack','asthma attack','der Asthmaanfall','die Asthmaanfälle','Breathing','Im schweren Asthmaanfall ist ein normaler pCO₂ ein Warnzeichen.'),
 gl9('copd','COPD','die COPD','–','Breathing','Er kommt mit einer exazerbierten COPD.',{alt:'akute Verschlechterung: die Exazerbation'}),
 gl9('ventilator','ventilator','das Beatmungsgerät','die Beatmungsgeräte','ICU','Wir passen die Einstellungen am Beatmungsgerät an.',{alt:'Station: „die Maschine“; auch: der Respirator'}),
 gl9('mechanical-ventilation','mechanical ventilation','die maschinelle Beatmung','–','ICU','Der Patient ist intubiert und beatmet.'),
 gl9('beatmungsparameter','ventilator setting','der Beatmungsparameter','die Beatmungsparameter','ICU','Wir haben die Beatmungsparameter angepasst.'),
 gl9('non-invasive-ventilation','non-invasive ventilation','die nichtinvasive Beatmung','–','ICU','Wir beginnen eine NIV und kontrollieren die BGA in einer Stunde.',{abbr:'NIV'}),
 gl9('intubation','intubation','die Intubation','die Intubationen','ICU','Bei Erschöpfung ist die Intubation nötig.'),
 gl9('extubation','extubation','die Extubation','die Extubationen','ICU','Die Extubation ist für morgen geplant.'),
 gl9('tidal-volume','tidal volume','das Tidalvolumen','die Tidalvolumina','ICU','Lungenprotektiv beatmen: Tidalvolumen 6 ml pro kg Idealgewicht, Plateaudruck unter 30 mbar.',{abbr:'Vt',noAbk:1,alt:'auch: das Atemzugvolumen (AZV); Drücke am Beatmungsgerät in mbar oder cmH₂O'}),
 gl9('atemminutenvolumen','minute ventilation','das Atemminutenvolumen','die Atemminutenvolumina','ICU','Um den pCO₂ zu senken, erhöhen wir das Atemminutenvolumen.',{abbr:'AMV'}),
 gl9('plateau-pressure','plateau pressure','der Plateaudruck','die Plateaudrücke','ICU','Der Plateaudruck sollte unter 30 mbar bleiben.'),
 gl9('spitzendruck','peak pressure','der Spitzendruck','die Spitzendrücke','ICU','Der Spitzendruck steigt: Wir denken an Sekret oder einen Bronchospasmus.'),
 gl9('peep','PEEP','der PEEP','–','ICU','Wir erhöhen den PEEP auf 10 mbar.'),
 gl9('fio2','FiO₂, inspired oxygen fraction','die FiO₂','–','ICU','Die FiO₂ liegt bei 0,6.',{alt:'als Bruch (0,4) oder in Prozent (40 %)'}),
 gl9('horovitz','P/F ratio','der Horovitz-Quotient','die Horovitz-Quotienten','ICU','Der Horovitz-Quotient liegt bei 150 mmHg: mittelschweres ARDS.',{alt:'pO₂ geteilt durch FiO₂; oft falsch „Horowitz“ geschrieben'}),
 gl9('scvo2','central venous oxygen saturation','die zentralvenöse Sauerstoffsättigung','–','ICU','Die zentralvenöse Sättigung liegt bei 58 %.',{abbr:'ScvO₂'}),
 gl9('bauchlage','prone position','die Bauchlage','–','ICU','Bei schwerem ARDS lagern wir den Patienten für 16 Stunden in Bauchlage.',{alt:'auch: die Bauchlagerung'}),
 gl9('spontanatmungsversuch','spontaneous breathing trial','der Spontanatmungsversuch','die Spontanatmungsversuche','ICU','Heute machen wir einen Spontanatmungsversuch über 30 Minuten.'),
 gl9('weaning','weaning','das Weaning','–','ICU','Wir starten heute das Weaning mit einem Spontanatmungsversuch.',{reg:'Jargon',alt:'Lehrbuch: die Entwöhnung von der Beatmung; „prolongiertes Weaning“'}),
 gl9('intensive-care-unit','intensive care unit','die Intensivstation','die Intensivstationen','ICU','Der Patient wird auf die Intensivstation verlegt.',{abbr:'ITS',alt:'Station: „auf der Intensiv“'}),
 gl9('zvk','central venous catheter','der zentrale Venenkatheter','die zentralen Venenkatheter','ICU','Über den ZVK nehmen wir eine zentralvenöse BGA ab.',{abbr:'ZVK'}),
 gl9('perfusor','syringe driver','der Perfusor','die Perfusoren','ICU','Drehen Sie den Noradrenalin-Perfusor bitte hoch.',{reg:'Jargon',alt:'eigentlich ein Markenname; allgemein: die Spritzenpumpe'}),
 gl9('volumengabe','fluid bolus','die Volumengabe','die Volumengaben','ICU','Nach einer Volumengabe von 1000 ml bleibt der Patient hypoton.'),
 gl9('vollelektrolytloesung','balanced crystalloid','die Vollelektrolytlösung','die Vollelektrolytlösungen','ICU','Wir geben 500 ml balancierte Vollelektrolytlösung.',{abbr:'VEL'}),
 gl9('shock','shock','der Schock','die Schocks','ICU','Der Patient ist im Schock.'),
 gl9('septic-shock','septic shock','der septische Schock','die septischen Schocks','ICU','Bei Hypotonie trotz Volumengabe und Katecholaminbedarf gehen wir von einem septischen Schock aus.'),
 gl9('sepsis','sepsis','die Sepsis','die Sepsen','ICU','Bei Sepsis nehmen wir vor der Antibiotikagabe Blutkulturen ab.'),
 gl9('noradrenaline','noradrenaline','das Noradrenalin','–','ICU','Er ist katecholaminpflichtig, Noradrenalin läuft mit 0,2 µg/kg/min.',{alt:'Station: „das Nor“; Adjektiv: katecholaminpflichtig'}),
 gl9('catecholamine','catecholamine','das Katecholamin','die Katecholamine','ICU','Der Katecholaminbedarf steigt.'),
 gl9('cardiac-arrest','cardiac arrest','der Kreislaufstillstand','die Kreislaufstillstände','ICU','Nach dem Kreislaufstillstand zeigt die BGA eine kombinierte Azidose.',{alt:'auch: der Herz-Kreislauf-Stillstand; Patient: der Herzstillstand'}),
 gl9('rosc','return of spontaneous circulation','der ROSC','–','ICU','Nach 12 Minuten Reanimation kam es zum ROSC.',{alt:'Wiedereinsetzen des Spontankreislaufs'}),
 gl9('schnappatmung','agonal breathing','die Schnappatmung','–','ICU','Schnappatmung ist keine normale Atmung: sofort mit der Reanimation beginnen.'),
 gl9('resuscitation','resuscitation','die Reanimation','die Reanimationen','ICU','Die Reanimation dauerte 20 Minuten.',{alt:'auch: die kardiopulmonale Reanimation (CPR)'}),
 gl9('kidney','kidney','die Niere','die Nieren','Kidney and electrolytes','Die Nieren scheiden Säuren aus.'),
 gl9('kidney-failure','acute kidney injury, kidney failure','das akute Nierenversagen','–','Kidney and electrolytes','Bei akutem Nierenversagen sammeln sich Säuren an.',{abbr:'ANV',alt:'auch: die akute Nierenschädigung; chronisch: die chronische Niereninsuffizienz'}),
 gl9('nierenersatzverfahren','renal replacement therapy','das Nierenersatzverfahren','die Nierenersatzverfahren','Kidney and electrolytes','Bei therapierefraktärer Azidose beginnen wir ein Nierenersatzverfahren.'),
 gl9('dialysis','dialysis','die Dialyse','die Dialysen','Kidney and electrolytes','Der Patient ist dialysepflichtig.'),
 gl9('potassium','potassium','das Kalium','–','Kidney and electrolytes','Das Kalium liegt bei 6,8 mmol/l.'),
 gl9('hyperkaliaemie','hyperkalaemia','die Hyperkaliämie','die Hyperkaliämien','Kidney and electrolytes','Die Azidose verschlechtert die Hyperkaliämie.'),
 gl9('hypokaliaemie','hypokalaemia','die Hypokaliämie','die Hypokaliämien','Kidney and electrolytes','Unter Insulin droht eine Hypokaliämie.'),
 gl9('sodium','sodium','das Natrium','–','Kidney and electrolytes','Das Natrium liegt bei 128 mmol/l.'),
 gl9('chloride','chloride','das Chlorid','die Chloride','Kidney and electrolytes','Das Chlorid ist auf 115 mmol/l erhöht.'),
 gl9('blood-sugar','blood sugar','der Blutzucker','–','Kidney and electrolytes','Der BZ liegt bei 580 mg/dl (32 mmol/l).',{abbr:'BZ',alt:'Station: „der Zucker“; in Deutschland meist in mg/dl'}),
 gl9('urine','urine','der Urin','–','Kidney and electrolytes','Wir legen einen Blasenkatheter und bilanzieren den Urin.',{alt:'auch: der Harn'}),
 gl9('emergency-department','emergency department','die Notaufnahme','die Notaufnahmen','Patients','Der Patient kommt über die Notaufnahme.',{abbr:'ZNA',alt:'die Zentrale Notaufnahme'}),
 gl9('vomiting','vomiting','das Erbrechen','–','Patients','Mussten Sie sich übergeben? Wie oft?',{alt:'Patient: „sich übergeben“; Dokumentation: das Erbrechen, die Emesis'}),
 gl9('diarrhoea','diarrhoea','die Diarrhö','die Diarrhöen','Patients','Durch die Diarrhö verliert der Patient Bikarbonat.',{reg:'Arzt',alt:'Patient: der Durchfall („Haben Sie Durchfall?“)'}),
 gl9('poisoning','poisoning','die Intoxikation','die Intoxikationen','Patients','Bei unklarer Azidose denken wir an eine Intoxikation.',{reg:'Arzt',alt:'Patient: die Vergiftung'}),
 gl9('overdose','overdose','die Überdosis','die Überdosen','Patients','Er hat eine Überdosis Opioide genommen.'),
 gl9('carbon-monoxide-poisoning','carbon monoxide poisoning','die Kohlenmonoxidvergiftung','die Kohlenmonoxidvergiftungen','Patients','Bei einer CO-Vergiftung ist die Pulsoxymetrie falsch normal.',{alt:'kurz: die CO-Vergiftung'}),
 gl9('cohb','carboxyhaemoglobin','das Carboxyhämoglobin','–','Patients','Das COHb liegt bei 25 %.',{abbr:'COHb'}),
 gl9('methb','methaemoglobin','das Methämoglobin','–','Patients','Nach Lokalanästhetika kann das Methämoglobin ansteigen.',{abbr:'MetHb'}),
 gl9('vigilanz','level of consciousness','die Vigilanz','–','Patients','Die Vigilanz ist gemindert, der Patient ist somnolent.',{alt:'Stufen: wach, somnolent, soporös, komatös'}),
 gl9('unconscious','unconscious','bewusstlos','','Patients','Sie fanden ihn bewusstlos in der Wohnung.',{reg:'Patient',alt:'Arzt: komatös, bewusstseinsgetrübt'}),
 gl9('drowsy','drowsy','somnolent','','Patients','Der Patient ist somnolent, aber erweckbar.'),
 gl9('sopoeroes','stuporous (wakes only to pain)','soporös','','Patients','Der Patient ist soporös und reagiert nur auf Schmerzreize.'),
 gl9('komatoes','comatose','komatös','','Patients','Bei einem pCO₂ von 110 mmHg ist er komatös.'),
 gl9('pregnancy','pregnancy','die Schwangerschaft','die Schwangerschaften','Patients','In der Schwangerschaft ist der pCO₂ physiologisch erniedrigt.'),
 gl9('newborn','newborn','das Neugeborene','die Neugeborenen','Patients','Beim Neugeborenen bestimmen wir den pH-Wert im Nabelschnurblut.'),
 gl9('umbilical-cord','umbilical cord','die Nabelschnur','die Nabelschnüre','Patients','Der pH-Wert im Nabelschnurarterienblut liegt bei 7,12.'),
 gl9('v-abnehmen','to take (a blood sample)','abnehmen','','Verbs','Könnten Sie bitte eine BGA abnehmen?',{pp:'hat abgenommen',ex2:'Kannst du bitte eine BGA abnehmen?',alt:'Station: „eine BGA ziehen“'}),
 gl9('v-messen','to measure','messen','','Verbs','Wir messen die Probe sofort am BGA-Gerät.',{pp:'hat gemessen'}),
 gl9('v-kontrollieren','to recheck','kontrollieren','','Verbs','Wir kontrollieren die BGA in einer Stunde.',{pp:'hat kontrolliert',ex2:'Kannst du die BGA in einer Stunde kontrollieren?'}),
 gl9('v-legen','to place (a line)','legen','','Verbs','Wir legen einen ZVK und eine Arterie.',{pp:'hat gelegt'}),
 gl9('v-puffern','to give bicarbonate (buffer)','puffern','','Verbs','Bei einem pH-Wert unter 6,9 wird oft gepuffert.',{pp:'hat gepuffert'}),
 gl9('v-entsaettigen','to desaturate','entsättigen','','Verbs','Der Patient entsättigt auf 82 %.',{pp:'hat entsättigt'}),
 gl9('v-intubieren','to intubate','intubieren','','Verbs','Wir müssen ihn intubieren.',{pp:'hat intubiert'}),
 gl9('v-extubieren','to extubate','extubieren','','Verbs','Sie wurde heute Morgen extubiert.',{pp:'hat extubiert'}),
 gl9('v-beatmen','to ventilate','beatmen','','Verbs','Der Patient wird lungenprotektiv beatmet.',{pp:'hat beatmet'}),
 gl9('v-anpassen','to adjust','anpassen','','Verbs','Wir passen die Beatmung an.',{pp:'hat angepasst',ex2:'Kannst du bitte die Beatmung anpassen?'}),
 gl9('v-hyperventilieren','to hyperventilate','hyperventilieren','','Verbs','Die Patientin hyperventiliert, der pCO₂ liegt bei 25 mmHg.',{pp:'hat hyperventiliert'}),
 gl9('v-hypoventilieren','to hypoventilate','hypoventilieren','','Verbs','Der Patient hypoventiliert, der pCO₂ ist auf 80 mmHg angestiegen.',{pp:'hat hypoventiliert'}),
 gl9('v-kompensieren','to compensate','kompensieren','','Verbs','Die Niere kompensiert die respiratorische Azidose.',{pp:'hat kompensiert'}),
 gl9('v-dekompensieren','to decompensate','dekompensieren','','Verbs','Der Patient ist respiratorisch dekompensiert.',{pp:'Zustand: ist dekompensiert'}),
 gl9('v-ansteigen','to rise','ansteigen','','Verbs','Das Laktat ist auf 6 mmol/l angestiegen.',{pp:'ist angestiegen'}),
 gl9('v-abfallen','to fall','abfallen','','Verbs','Der pH-Wert ist auf 7,15 abgefallen.',{pp:'ist abgefallen'}),
 gl9('v-abhusten','to cough up','abhusten','','Verbs','Er kann das Sekret nicht abhusten.',{pp:'hat abgehustet'}),
 gl9('v-verlegen','to transfer (a patient)','verlegen','','Verbs','Wir verlegen den Patienten auf die Intensivstation.',{pp:'hat verlegt'})];
VIEWS.push('gloss');TABOF.gloss='learn';
/* Mephisto vocab format: article apart from the word, plural with its article. A noun phrase with an adjective
   ("der septische Schock") goes out without the article in its strong form ("septischer Schock"), never as article + "septische Schock". */
function glossParts(de){const m=String(de).match(/^(der|die|das)\s+(.+)$/);if(!m)return {article:'',word:de,phrase:'',gender:''};
 const art=m[1],rest=m[2];
 if(art!=='die'&&/\s/.test(rest)&&/^[a-zäöü]/.test(rest)&&/^\S+e\s/.test(rest))return {article:'',word:rest.replace(/^(\S+)e(\s)/,(x,a,s)=>a+(art==='der'?'er':art==='das'?'es':'e')+s),phrase:de,gender:art};
 return {article:art,word:rest,phrase:'',gender:art};}
/* the German used in cards and lists: headword, plural, Perfekt */
function gl9Pl(g){return g.cat==='Verbs'?(g.pp?'Perfekt: '+g.pp:''):g.pl==='–'?'kein Pl.':g.pl?'Pl. '+g.pl:'';}
/* speech: pick a German voice explicitly, say so when there is none, read units and subscripts as spoken on the ward */
const GL9_SAY=[[/„|“|”|"/g,''],[/\s?\(/g,', '],[/\)/g,''],[/µg\/kg\/min/g,'Mikrogramm pro Kilogramm pro Minute'],[/ml\/kg/g,'Milliliter pro Kilogramm'],[/mmHg/g,'Millimeter Quecksilbersäule'],[/mmol\/l/g,'Millimol pro Liter'],[/mg\/dl/g,'Milligramm pro Deziliter'],[/l\/min/g,'Liter pro Minute'],[/cmH₂O/g,'Zentimeter Wassersäule'],[/mbar/g,'Millibar'],[/\bkPa\b/g,'Kilopascal'],[/(\d) ml\b/g,'$1 Milliliter'],[/(\d) l\b/g,'$1 Liter'],
 [/ScvO₂/g,'S C V O 2'],[/SaO₂/g,'S A O 2'],[/SpO₂/g,'S P O 2'],[/FiO₂/g,'F I O 2'],[/pCO₂/g,'P C O 2'],[/pO₂/g,'P O 2'],[/HCO₃⁻/g,'Bikarbonat'],[/CO₂/g,'C O 2'],[/O₂/g,'O 2'],[/\bBE\b/g,'B E'],[/−\s?/g,'minus '],[/₂/g,'2']];
function gl9Spoken(t){return GL9_SAY.reduce((s,[a,b])=>s.replace(a,b),String(t||'')).replace(/\s+,/g,',').replace(/\s{2,}/g,' ').trim();}
function gl9Voices(){return new Promise(res=>{const ss=window.speechSynthesis;if(!ss)return res([]);const v=ss.getVoices();if(v&&v.length)return res(v);let done=false;const fin=()=>{if(done)return;done=true;res(ss.getVoices()||[]);};
 try{ss.addEventListener('voiceschanged',fin,{once:true});}catch(e){}setTimeout(fin,1200);});}
async function sayDE(t){const ss=window.speechSynthesis;if(!ss||typeof SpeechSynthesisUtterance==='undefined'){toast('Speech is not available here.');return false;}
 try{const v=(await gl9Voices()).find(x=>/^de([-_]|$)/i.test(x.lang||''));
  if(!v){toast('No German voice on this device. Add German in your device\'s text-to-speech settings.');return false;}
  const u=new SpeechSynthesisUtterance(gl9Spoken(t));u.voice=v;u.lang=v.lang||'de-DE';u.rate=.95;
  u.onerror=e=>{if(e&&e.error!=='interrupted'&&e.error!=='canceled')toast('Could not play the German audio.');};ss.cancel();ss.speak(u);return true;}catch(e){toast('Speech is not available here.');return false;}}
/* search: case, umlauts (ä = ae = a), ß, subscripts and the minus sign fold away; abbreviations and exact words rank first */
function gl9Fold(s){s=String(s||'').toLowerCase().replace(/[₀-₉]/g,c=>String(c.charCodeAt(0)-0x2080)).replace(/[⁻⁺]/g,'').replace(/−/g,'-');
 return [s.replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss'),s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss')];}
function gl9Rank(g,q){const qs=gl9Fold(q).filter((x,i,a)=>x&&a.indexOf(x)===i);if(!qs.length)return 1;const has=(t,fn)=>gl9Fold(t).some(h=>qs.some(x=>fn(h,x)));
 const head=String(g.de).replace(/^(der|die|das)\s+/,''),eq=(h,x)=>h===x,st=(h,x)=>h.split(/[\s,;/()-]+/).some(w=>w.startsWith(x)),inc=(h,x)=>h.includes(x);
 if(g.abbr&&has(g.abbr,eq))return 1;if(has(head,eq)||has(g.en,eq))return 1;if(has(head,st)||has(g.en,st)||(g.abbr&&has(g.abbr,st)))return 2;
 if(qs[0].length<=2)return 0;if(has(g.de,inc)||has(g.en,inc))return 3;if([g.pl,g.alt,g.ex,g.ex2,g.pp].some(t=>t&&has(t,inc)))return 4;return 0;}
function gl9List(f,q){return GLOSS.map((g,i)=>({g,i,r:q?gl9Rank(g,q):1})).filter(x=>x.r&&(!f||x.g.cat===f)).sort((a,b)=>a.r-b.r||a.i-b.i).map(x=>x.g);}
/* Yuzu cards: stable ids, abbreviations get their own card (spoken on the ward: "eine BGA"), extra fields Yuzu may show */
function gl9Cards(list){const out=[];list.forEach(g=>{const p=glossParts(g.de),verb=g.cat==='Verbs';
  const note=[g.abbr?'Abk. '+g.abbr:'',p.phrase?'mit Artikel: '+p.phrase:'',g.alt||''].filter(Boolean).join(' · ');
  const c={id:g.id,type:'vocab',word:p.word,article:p.article,plural:verb||g.pl==='–'?'':(g.pl||''),meaning:g.en,example:g.ex+(g.ex2?' / '+g.ex2:'')+(g.pp?' (Perfekt: '+g.pp+')':''),source:'Buffer · Glossar'};
  if(g.pl==='–')c.no_plural=true;if(g.pp)c.perfect=g.pp;if(g.abbr)c.abbr=g.abbr;if(p.phrase)c.phrase=p.phrase;if(g.reg)c.register=g.reg;if(note)c.note=note;out.push(c);
  if(g.abbr&&p.gender&&!g.noAbk)out.push({id:g.id+'-abk',type:'vocab',word:g.abbr,article:p.gender,plural:'',meaning:g.en+' (abbreviation)',example:g.ex,source:'Buffer · Glossar',note:'= '+g.de});});return out;}
function gl9Pack(cards){return {yuzu_pack:1,id:'buffer-words',name:'Buffer: blood gas German',category:'German::Medical::Blood gases',lang:'de-DE',tags:['auto::Language::German','auto::Specialty::Critical Care','auto::Exam::FSP'],source:'Buffer '+APP_VERSION+' · Glossar · exported '+ddmmyyyy(),cards};}
/* model handovers in FSP order (who and why, sample and oxygen, values, reading, cause, plan) */
const GL9_MODELS=[{t:'Respiratory: COPD',s:[['Who and why','Herr M., 67 Jahre, mit bekannter COPD, kommt mit zunehmender Dyspnoe.'],['Sample and oxygen','In der arteriellen BGA unter 2 Litern Sauerstoff über die Nasenbrille:'],['Values','pH 7,28, pCO₂ 68 mmHg, pO₂ 54 mmHg, Bikarbonat 31 mmol/l, BE plus 5.'],['Reading','Das entspricht einer akuten respiratorischen Azidose bei chronischer Hyperkapnie, also einer respiratorischen Globalinsuffizienz.'],['Cause','Ursache ist am ehesten eine infektexazerbierte COPD.'],['Plan','Wir beginnen eine NIV und kontrollieren die BGA in einer Stunde.']]},
 {t:'Metabolic: DKA',s:[['Who and why','Frau K., 24 Jahre, mit bekanntem Typ-1-Diabetes, kommt mit Erbrechen und Kussmaul-Atmung.'],['Sample and oxygen','In der arteriellen BGA unter Raumluft:'],['Values','pH 7,12, pCO₂ 16 mmHg, Bikarbonat 5 mmol/l, BE minus 22, Natrium 134, Chlorid 98, Anionenlücke 31 mmol/l, Blutzucker 576 mg/dl.'],['Reading','Es zeigt sich eine metabolische Azidose mit erhöhter Anionenlücke, respiratorisch adäquat kompensiert.'],['Cause','Das spricht für eine diabetische Ketoazidose.'],['Plan','Wir beginnen mit Volumen und Insulin nach Protokoll und kontrollieren Kalium und BGA stündlich.']]}];
const GL9_SLOTS=[['unter Raumluft','on room air'],['unter 2 Litern Sauerstoff über die Nasenbrille','on 2 L oxygen by nasal cannula'],['unter einer FiO₂ von 0,4','on FiO₂ 0.4'],['In der arteriellen BGA zeigt sich …','The arterial gas shows …'],['Das spricht für eine …','That points to …'],['Das entspricht einer …','That corresponds to …'],
 ['respiratorisch adäquat kompensiert','appropriately compensated by breathing'],['metabolisch teilkompensiert','partly compensated by the kidney'],['dekompensiert','uncompensated'],['Differenzialdiagnostisch kommt … in Betracht.','The differential includes …'],
 ['Die Anionenlücke ist mit 24 mmol/l erhöht.','The anion gap is raised at 24.'],['Das Laktat liegt bei 4,8 mmol/l. Bei Hypotonie trotz Volumengabe und Katecholaminbedarf gehen wir von einem septischen Schock aus.','Lactate plus the clinical criteria, not lactate alone'],
 ['Der Patient hypoventiliert, der pCO₂ ist auf 80 mmHg angestiegen, der pH-Wert liegt bei 7,18.','Report the partial pressure, not "das CO₂"'],['Wir haben eine NIV eingeleitet.','We have started NIV.'],['Eine Kontroll-BGA ist in 30 Minuten geplant.','Repeat gas in 30 minutes.']];
const GL9_NUM=[['pH 7,28','pH sieben Komma zwei acht','decimal comma; digits after the comma one by one'],['pCO₂ 68 mmHg','P C O 2 achtundsechzig Millimeter Quecksilbersäule','on the ward often just „68 Millimeter“'],['BE −12','B E minus zwölf','or „ein Basendefizit von zwölf“'],['FiO₂ 0,4','F I O 2 null Komma vier','or „vierzig Prozent“'],['HCO₃⁻ 31 mmol/l','Bikarbonat einunddreißig Millimol pro Liter',''],['pO₂ 9,3 kPa','P O 2 neun Komma drei Kilopascal','German labs mostly use mmHg'],['2 l/min','zwei Liter pro Minute',''],['0,2 µg/kg/min','null Komma zwei Mikrogramm pro Kilogramm pro Minute','']];
{const st=document.createElement('style');st.id='gl9css';st.textContent='.gl .de{min-height:44px;display:flex;align-items:center;gap:8px}.gl9p svg{width:14px;height:14px;flex:none;opacity:.65}.gl .ex9,.gl9say{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:8px;min-height:44px;line-height:1.35}.gl .ex9{font-style:italic;color:var(--muted);font-size:.9rem}.gl .ex9:focus-visible,.gl9say:focus-visible{outline:2px solid var(--accent)}.gl9reg{font-family:var(--px);font-size:9px;border:1px solid var(--line);padding:1px 5px;margin-left:6px;color:var(--accent-ink);vertical-align:1px}.gl .alt{font-size:.85rem}.gl9m{margin:0;padding-left:1.2em;display:grid;gap:2px}.gl9m b{display:block;font-size:.8rem;color:var(--muted);font-weight:600;margin-top:4px}.gl9n{display:grid;gap:4px}.gl9n .gl9say{justify-content:space-between;border-bottom:1px solid var(--line)}.gl9n small{color:var(--muted)}';document.head.appendChild(st);}
let gl9Q='';
const GL9_REG={Arzt:'Doctor to doctor (Fachsprache)',Patient:'Patient language',Jargon:'Ward slang'};
RENDER.gloss=function(){const el=$('v-gloss');let f=(S.ui&&S.ui.gcat)||'';if(!GL9_CATS.includes(f))f='';
 const say=(t,cls)=>'<button class="'+cls+'" lang="de" data-say="'+esc(t)+'" title="Tap to hear"><span class="gl9p">'+ic('play')+'</span><span>'+esc(t)+'</span></button>';
 el.innerHTML='<div class="crumbs"><button data-go="learn">← Learn</button></div><div class="view-head"><div class="ph"><span class="eyebrow">'+GLOSS.length+' terms · English → Deutsch</span><h1>Glossary · Glossar</h1><p>The words you need to present a gas on a German ward. Tap any German word or sentence to hear it. Tags: <b>Arzt</b> doctor to doctor, <b>Patient</b> lay words, <b>Jargon</b> ward slang.</p></div></div>'+
  '<div class="card filters"><label class="fld"><span>Search</span><input id="glQ" placeholder="e.g. anion gap, Azidose, pCO2, BE" autocomplete="off"></label><div class="seg wrap" role="group" aria-label="Topic"><button data-c="" aria-pressed="'+!f+'">All</button>'+GL9_CATS.map(c=>'<button data-c="'+esc(c)+'" aria-pressed="'+(f===c)+'">'+esc(c)+'</button>').join('')+'</div>'+
  '<div class="btnrow"><button class="btn small" id="glYz">Send to Yuzu</button><button class="btn small" id="glCp">Copy list</button></div><p class="note" id="glHelp">Arrive in Yuzu as German word cards, like Mephisto\'s.</p><p class="note" id="glMsg" role="status"></p></div><div class="gloss" id="glL"></div>'+
  '<div class="card"><span class="eyebrow">Present a gas in German · Übergabe</span><p class="note">Same order every time: who and why, which sample on how much oxygen, the values with a decimal comma, your reading, the cause, the plan.</p>'+
   GL9_MODELS.map((m,mi)=>'<h3 aria-level="2" style="margin:12px 0 4px">'+esc(m.t)+' <button class="btn small" data-all="'+mi+'">Play all</button></h3><ol class="gl9m">'+m.s.map(s=>'<li><b>'+esc(s[0])+'</b>'+say(s[1],'gl9say')+'</li>').join('')+'</ol>').join('')+
   '<span class="eyebrow" style="display:block;margin-top:14px">Phrases to slot in</span><ul class="gl9m">'+GL9_SLOTS.map(p=>'<li>'+say(p[0],'gl9say')+'<small class="note">'+esc(p[1])+'</small></li>').join('')+'</ul></div>'+
  '<div class="card"><span class="eyebrow">Numbers · Zahlen</span><p class="note">German writes a decimal comma and reads the digits after it one by one. Tap a line to hear it.</p><div class="gl9n">'+GL9_NUM.map(n=>'<button class="gl9say" lang="de" data-say="'+esc(n[1])+'"><span><b>'+esc(n[0])+'</b> <small>„'+esc(n[1].replace(/^[A-Z](?: [A-Z0-9])+ /,''))+'“</small></span>'+(n[2]?'<small lang="en">'+esc(n[2])+'</small>':'')+'</button>').join('')+'</div></div>';
 let list=[];
 const draw=()=>{const q=gl9Q.trim();list=gl9List(f,q);const all=!f&&!q;
  $('glL').innerHTML=list.length?list.map(g=>{const pl=gl9Pl(g);return '<div class="gl"><span class="en">'+esc(g.en)+(g.reg?'<span class="gl9reg" title="'+esc(GL9_REG[g.reg]||'')+'">'+esc(g.reg)+'</span>':'')+'</span>'+say(g.de,'de')+
   (g.abbr?'<small lang="de">Abk. '+esc(g.abbr)+'</small>':'')+(pl?'<small lang="de">'+esc(pl)+'</small>':'')+(g.alt?'<small class="alt" lang="de">'+esc(g.alt)+'</small>':'')+(g.ex?say(g.ex,'ex9'):'')+(g.ex2?say(g.ex2,'ex9'):'')+'</div>';}).join(''):'<p class="note">No match. Try the English word, the German word or an abbreviation such as BGA.</p>';
  $('glCp').textContent=all?'Copy all '+list.length:'Copy '+list.length+' shown';$('glYz').textContent=all?'Send all '+list.length+' to Yuzu':'Send '+list.length+' shown to Yuzu';$('glYz').disabled=$('glCp').disabled=!list.length;};
 el.querySelector('[data-go]').onclick=()=>go('learn');
 el.onclick=e=>{const b=e.target.closest&&e.target.closest('[data-say],[data-all]');if(!b||!el.contains(b))return;if(b.dataset.all!=null)sayDE(GL9_MODELS[+b.dataset.all].s.map(s=>s[1]).join(' '));else sayDE(b.dataset.say);};
 const qi=$('glQ');qi.value=gl9Q;qi.oninput=()=>{gl9Q=qi.value;draw();};
 el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{f=b.dataset.c;S.ui=S.ui||{};S.ui.gcat=f;save();el.querySelectorAll('[data-c]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.c===f)));draw();});
 $('glCp').onclick=e=>copyText(list.map(g=>{const pl=gl9Pl(g);return g.en+' — '+g.de+(g.abbr?' ('+g.abbr+')':'')+(pl?' · '+pl:'')+(g.ex?'\n    '+g.ex:'');}).join('\n'),e.currentTarget);
 $('glYz').onclick=async e=>{const btn=e.currentTarget,msg=$('glMsg'),cards=gl9Cards(list),pk=gl9Pack(cards),n=cards.length+' card'+(cards.length===1?'':'s')+' ('+list.length+' word'+(list.length===1?'':'s')+')';let why='';const on=typeof signedIn==='function'&&signedIn();
  if(on){try{msg.textContent='Sending…';const yz=await hubOtherFolder('yuzu-data',[[HUB_ROOT,'Yuzu']]);const col=yz&&await folder('collection',yz,false);const inbox=col&&await folder('inbox',col,true);if(!inbox)throw new Error('Yuzu folder not found');await putJSON('buffer-words.json',inbox,pk);msg.textContent='Sent '+n+' to Yuzu\'s inbox. Review them in Yuzu before they are added.';return;}
   catch(err){why=/not found/i.test(err&&err.message||'')?'Yuzu\'s Drive folder was not found (open Yuzu once and connect Google there). ':'Could not reach Drive. ';}}
  const ok=await copyText(JSON.stringify(pk),btn);if(ok){msg.textContent=why+'Copied '+n+(why?' instead':'')+'. Save as buffer-words.yuzu.json and import it in Yuzu'+(on?'.':', or connect Google to send it straight to Yuzu.');return;}
  const dl=typeof ui3Download==='function'&&ui3Download('buffer-words.yuzu.json',JSON.stringify(pk));msg.textContent=why+(dl?'Clipboard blocked, so the pack was saved as a file: buffer-words.yuzu.json. Import it in Yuzu.':'Clipboard blocked and no file could be saved here.');};
 draw();};
if(RENDER.learn){const _rl9=RENDER.learn;RENDER.learn=function(){_rl9();const el=$('v-learn');if(!el||$('toGloss'))return;const w=el.querySelector('[data-go="web"]');const row=w&&w.closest('.tiles');
 const t=document.createElement('button');t.className='tile';t.id='toGloss';t.innerHTML='<span class="mono-mark" aria-hidden="true">DE</span><span><small class="meta">'+GLOSS.length+' terms</small><b>German glossary · Glossar</b><span class="d">BGA words, ICU terms and a model handover, with audio.</span></span>';
 if(row)row.appendChild(t);else{const h=el.querySelector('.view-head');if(!h)return;const d=document.createElement('div');d.className='tiles';d.style.marginBottom='14px';d.appendChild(t);h.after(d);}t.onclick=()=>go('gloss');};}
