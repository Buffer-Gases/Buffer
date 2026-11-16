/* ================= 4.8: links — Citrus contract v2, Galen and Citrus deep links, Yuzu packs from misses, reasoning-app hand-off, German glossary ================= */
const CITRUS_URL='https://amaerys.github.io/Citrus-Maxima/',GALEN_URL='https://galen-app.github.io/galen/';
let FROM='';
const GAS_KEYS={ph:'pH',pco2:'pco2',po2:'po2',hco3:'hco3',fio2:'fio2',na:'na',k:'k',cl:'cl',alb:'alb',lac:'lac',glu:'glu',age:'age'};
function deepLink(){let q;try{q=new URLSearchParams(location.search);}catch(e){return;}if(![...q.keys()].length)return;
 const from=(q.get('from')||'').toLowerCase();if(from==='citrus'||from==='galen')FROM=from;const d=(q.get('do')||'').toLowerCase();
 const gas={};Object.entries(GAS_KEYS).forEach(([k,v])=>{const x=parseFloat(q.get(k));if(!isNaN(x))gas[v]=x;});if(q.get('sample'))gas.sample=q.get('sample')==='v'?'v':'a';
 try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}
 if(d==='interp'||gas.pH!=null){openTool('interp');if(gas.pH!=null&&gas.pco2!=null)setTimeout(()=>{loadInterp(gas);buildForm();runInterp();},40);}
 else if(d==='round'){go('today');setTimeout(()=>{const b=$('tRound');if(b)b.click();},60);}
 else if(d==='log')openTool('log');else if(d==='cases'){CS=null;go('cases');}else if(d==='case'&&q.get('id'))openCase(q.get('id'));
 else if(d==='speed')go('practice');else if(d==='weekly'||d==='review')go('progress');else if(d==='glossary')go('gloss');else if(d==='lesson'&&q.get('id')&&LBYID[q.get('id')])openLesson(q.get('id'));
 backChip();}
function backChip(){if(!FROM)return;let c=$('fromChip');if(!c){c=document.createElement('a');c.id='fromChip';c.className='fromchip';document.body.appendChild(c);}c.href=(FROM==='galen'?GALEN_URL:CITRUS_URL)+'?from=buffer';c.textContent='← '+(FROM==='galen'?'Galen':'Citrus');}
{const _b=boot;boot=function(){_b();try{deepLink();}catch(e){console.error(e);}};}

/* Citrus contract v2: metrics, actions and a weekly proposal */
function isoWeek(d){d=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-day);const y=new Date(Date.UTC(d.getUTCFullYear(),0,1));return d.getUTCFullYear()+'w'+String(Math.ceil(((d-y)/864e5+1)/7)).padStart(2,'0');}
if(typeof hubStatus==='function'){const _hs9=hubStatus;hubStatus=function(){const s=_hs9();try{const base=location.origin+location.pathname,t=today(),w=weeklyReview(),wk=isoWeek(new Date());
 s.contract=2;
 s.metrics=[{key:'gases',label:'Gases today',value:todayN(),goal:S.goal||15,unit:'gases',date:t},{key:'mastery',label:'Mastery',value:masteryScore(),goal:100,unit:'%',date:t},{key:'week-days',label:'Days this week',value:w.days,goal:7,unit:'days',date:t},{key:'live-gases',label:'Real gases logged',value:w.live,unit:'gases',date:t}];
 s.actions=[{id:'round',label:S.lastRound===t?'Round done · review':'Start the Round',url:base+'?from=citrus&do=round',icon:'🧪',minutes:25},{id:'interp',label:'Read a gas',url:base+'?from=citrus&do=interp',icon:'🧪',minutes:2},{id:'log',label:'Gas log',url:base+'?from=citrus&do=log',icon:'🧪'},{id:'cases',label:'Case library',url:base+'?from=citrus&do=cases',icon:'🧪',minutes:15}];
 const dow=new Date().getDay();s.inbox=(s.inbox||[]).concat(dow===0||dow===1||dow===6?[{id:'buffer-week-'+wk,type:'task',title:'Buffer: weekly review',minutes:5,pri:3,url:base+'?from=citrus&do=weekly'}]:[]);
 const miss=yuzuMissCards();if(miss.length>=5)s.inbox.push({id:'buffer-yuzu-'+wk,type:'task',title:'Buffer: send '+miss.length+' missed points to Yuzu',minutes:2,pri:3,url:base+'?from=citrus&do=weekly'});}catch(e){}return s;};}

/* Yuzu: missed lesson questions and case mistakes as a pack in the Yuzu inbox */
function slugify(x){return String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);}
function yuzuMissCards(){const cards=[];Object.keys(S.qmiss||{}).forEach(k=>{const [lid,qi]=k.split(':');const l=LBYID[lid];const it=l&&l.q[+qi];if(!it)return;
  cards.push({id:'buf-q-'+lid+'-'+qi,type:'mcq',question:it[0].replace(/<[^>]+>/g,''),options:it[1].map((o,i)=>({text:o,correct:i===it[2]})),explanation:it[3],source:'Buffer · '+l.t});});
 (S.cmist||[]).filter(x=>!x.del).forEach(x=>{const id='buf-c-'+slugify(x.key||x.id);if(cards.some(c=>c.id===id))return;cards.push({id,type:'basic',front:x.ct+': '+x.q,back:x.r,source:'Buffer case · '+x.ct});});
 return cards;}
async function toYuzu(btn,msgEl){const cards=yuzuMissCards();if(!cards.length){msgEl.textContent='Nothing missed yet. Wrong answers in lessons and cases collect here.';return;}
 const wk=isoWeek(new Date());const p=pack('buffer-misses-'+wk,'Buffer: missed points '+wk,cards);
 if(typeof signedIn==='function'&&signedIn()){try{msgEl.textContent='Sending…';const root=await folder(HUB_ROOT,null);const yz=await folder('Yuzu',root,false);const col=yz&&await folder('collection',yz,false);const inbox=col&&await folder('inbox',col,true);
   if(!inbox)throw new Error('Yuzu folder not found');await putJSON('buffer-misses-'+wk+'.json',inbox,p);msgEl.textContent='Sent '+cards.length+' card'+(cards.length===1?'':'s')+' to Yuzu\'s inbox. Review them in Yuzu before they are added.';return;}catch(e){msgEl.textContent='Could not reach Yuzu on Drive ('+e.message+'). Copying instead.';}}
 const ok=await copyText(JSON.stringify(p),btn);msgEl.textContent=(ok?'Copied ':'Clipboard blocked. ')+cards.length+' card'+(cards.length===1?'':'s')+'. Save as buffer-misses.yuzu.json and import in Yuzu, or connect Google to send it straight to Yuzu.';}

/* reasoning-app hand-off: a structured case file in My Apps/hub/handoff */
function handoff(kind,obj){return Object.assign({buffer_handoff:1,app:'buffer',version:APP_VERSION,kind,at:new Date().toISOString()},obj);}
async function sendHandoff(h,btn){const txt=JSON.stringify(h);const name='buffer-'+h.kind+'-'+Date.now().toString(36)+'.json';
 if(typeof signedIn==='function'&&signedIn()){try{const root=await folder(HUB_ROOT,null);const hub=await folder(HUB_DIR,root);const ho=await folder('handoff',hub);await putJSON(name,ho,h);toast('Sent to My Apps/hub/handoff for the reasoning app','good');return;}catch(e){toast('Drive failed; copied instead');}}
 const ok=await copyText(txt,btn);toast(ok?'Hand-off copied. Paste it into the reasoning app.':'Clipboard blocked.');}
if(typeof runInterp==='function'){const _ri9=runInterp;runInterp=function(){_ri9();const row=$('iSave')&&$('iSave').parentElement;if(!row||$('iHand'))return;const b=document.createElement('button');b.className='btn small';b.id='iHand';b.textContent='Hand off to reasoning';row.appendChild(b);
 b.onclick=()=>{const inp=Object.assign({},IV);if(inp.hco3==null)inp.hco3=r1(hFrom(inp.pH,inp.pco2));const o=interp(inp);sendHandoff(handoff('gas',{title:o.label,gas:inp,read:o.line,steps:(o.steps||[]).map(s=>({step:s.t,result:s.v,working:s.d})),next:nextKeys(o,inp).map(k=>NEXT[k].t)}),b);};};}
if(typeof simDebrief==='function'){const _sd=simDebrief;simDebrief=function(el){_sd(el);const r=el.querySelector('.btnrow:last-child');if(!r||!CS)return;const b=document.createElement('button');b.className='btn';b.textContent='Hand off to reasoning';r.appendChild(b);const c=CS.c;
 b.onclick=()=>sendHandoff(handoff('sim',{title:c.t,setting:c.set,intro:c.intro,ending:CS.over.t,minutes:CS.t,timeline:CS.ev.map(e=>({t:e.t,kind:e.k,text:e.txt})),key:c.key.map(k=>({step:(c.actions.find(a=>a.id===k.a)||{}).l,target:k.by,done:CS.at[k.a]==null?null:CS.at[k.a]}))}),b);};}

/* weekly review: send misses to Yuzu */
if(RENDER.progress){const _rp9=RENDER.progress;RENDER.progress=function(){_rp9();const w=document.querySelector('#v-progress .weekc');if(!w)return;const n=yuzuMissCards().length;const d=document.createElement('div');d.className='btnrow';d.style.marginTop='10px';
 d.innerHTML='<button class="btn small" id="wkYuzu">Send '+n+' missed point'+(n===1?'':'s')+' to Yuzu</button><span class="note" id="wkYuzuMsg"></span>';w.appendChild(d);$('wkYuzu').onclick=e=>toYuzu(e.currentTarget,$('wkYuzuMsg'));};}

/* German glossary */
const GLOSS=[
 ['blood gas analysis','die Blutgasanalyse (BGA)','die Blutgasanalysen','Gas','Wir machen eine BGA.'],['arterial blood gas','die arterielle BGA','','Gas','Bitte nehmen Sie eine arterielle BGA ab.'],['venous blood gas','die venöse BGA','','Gas','Eine venöse BGA reicht für pH und Bikarbonat.'],
 ['sample','die Probe','die Proben','Gas','Die Probe muss sofort ins Labor.'],['syringe','die Spritze','die Spritzen','Gas',''],['air bubble','die Luftblase','die Luftblasen','Gas','Entfernen Sie die Luftblase.'],['puncture','die Punktion','die Punktionen','Gas',''],['radial artery','die Arteria radialis','','Gas',''],['arterial line','der arterielle Zugang','die arteriellen Zugänge','Gas',''],
 ['normal value','der Normwert','die Normwerte','Gas',''],['result','der Befund','die Befunde','Gas','Der Befund ist auffällig.'],
 ['acid','die Säure','die Säuren','Acid–base',''],['base','die Base','die Basen','Acid–base',''],['buffer','der Puffer','die Puffer','Acid–base',''],['acidosis','die Azidose','die Azidosen','Acid–base','Der Patient hat eine schwere Azidose.'],['alkalosis','die Alkalose','die Alkalosen','Acid–base',''],
 ['metabolic','metabolisch','','Acid–base','eine metabolische Azidose'],['respiratory','respiratorisch','','Acid–base','eine respiratorische Alkalose'],['compensation','die Kompensation','','Acid–base','mit respiratorischer Kompensation'],['anion gap','die Anionenlücke','','Acid–base','Die Anionenlücke ist erhöht.'],
 ['base excess','der Basenüberschuss','','Acid–base',''],['bicarbonate','das Bikarbonat','','Acid–base',''],['lactate','das Laktat','','Acid–base','Das Laktat ist auf 6 gestiegen.'],['ketoacidosis','die Ketoazidose','die Ketoazidosen','Acid–base',''],['diabetic ketoacidosis','die diabetische Ketoazidose','','Acid–base',''],
 ['raised','erhöht','','Acid–base','Der pH-Wert ist erniedrigt, das CO₂ erhöht.'],['lowered','erniedrigt','','Acid–base',''],
 ['oxygen','der Sauerstoff','','Breathing','Geben Sie Sauerstoff über die Maske.'],['carbon dioxide','das Kohlendioxid','','Breathing',''],['partial pressure','der Partialdruck','die Partialdrücke','Breathing',''],['oxygen saturation','die Sauerstoffsättigung','','Breathing','Die Sättigung fällt ab.'],
 ['shortness of breath','die Atemnot','','Breathing','Seit wann haben Sie Atemnot?'],['respiratory rate','die Atemfrequenz','','Breathing',''],['respiratory failure','die respiratorische Insuffizienz','','Breathing',''],['hypoventilation','die Hypoventilation','','Breathing',''],['hyperventilation','die Hyperventilation','','Breathing',''],
 ['lung','die Lunge','die Lungen','Breathing',''],['pneumonia','die Lungenentzündung','die Lungenentzündungen','Breathing',''],['pulmonary embolism','die Lungenembolie','die Lungenembolien','Breathing',''],['asthma attack','der Asthmaanfall','die Asthmaanfälle','Breathing',''],['COPD','die COPD','','Breathing','eine exazerbierte COPD'],
 ['ventilator','das Beatmungsgerät','die Beatmungsgeräte','ICU',''],['mechanical ventilation','die maschinelle Beatmung','','ICU','Der Patient ist beatmet.'],['non-invasive ventilation','die nichtinvasive Beatmung (NIV)','','ICU',''],['intubation','die Intubation','die Intubationen','ICU',''],['extubation','die Extubation','','ICU',''],
 ['tidal volume','das Atemzugvolumen','','ICU',''],['plateau pressure','der Plateaudruck','','ICU',''],['weaning','die Entwöhnung von der Beatmung','','ICU',''],['intensive care unit','die Intensivstation','die Intensivstationen','ICU',''],
 ['shock','der Schock','','ICU',''],['septic shock','der septische Schock','','ICU',''],['sepsis','die Sepsis','','ICU',''],['noradrenaline','das Noradrenalin','','ICU',''],['catecholamine','das Katecholamin','die Katecholamine','ICU',''],['cardiac arrest','der Herzstillstand','','ICU',''],['resuscitation','die Reanimation','die Reanimationen','ICU',''],
 ['kidney','die Niere','die Nieren','Kidney and salts',''],['kidney failure','das Nierenversagen','','Kidney and salts',''],['dialysis','die Dialyse','die Dialysen','Kidney and salts',''],['potassium','das Kalium','','Kidney and salts','Das Kalium ist zu hoch.'],['sodium','das Natrium','','Kidney and salts',''],['chloride','das Chlorid','','Kidney and salts',''],['blood sugar','der Blutzucker','','Kidney and salts',''],['urine','der Urin','','Kidney and salts',''],
 ['emergency department','die Notaufnahme','die Notaufnahmen','Patients',''],['vomiting','das Erbrechen','','Patients','Haben Sie erbrochen?'],['diarrhoea','der Durchfall','','Patients',''],['poisoning','die Vergiftung','die Vergiftungen','Patients',''],['overdose','die Überdosis','die Überdosen','Patients',''],['carbon monoxide poisoning','die Kohlenmonoxidvergiftung','','Patients',''],
 ['unconscious','bewusstlos','','Patients',''],['drowsy','somnolent','','Patients',''],['pregnancy','die Schwangerschaft','die Schwangerschaften','Patients',''],['newborn','das Neugeborene','die Neugeborenen','Patients',''],['umbilical cord','die Nabelschnur','die Nabelschnüre','Patients','']];
VIEWS.push('gloss');TABOF.gloss='learn';
function glossParts(de){const m=de.match(/^(der|die|das)\s+(.+)$/);return m?{article:m[1],word:m[2]}:{article:'',word:de};}
function sayDE(t){try{const u=new SpeechSynthesisUtterance(t.replace(/\(.*?\)/g,''));u.lang='de-DE';speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){toast('Speech is not available here.');}}
RENDER.gloss=function(){const el=$('v-gloss');const f=(S.ui&&S.ui.gcat)||'';const cats=[...new Set(GLOSS.map(g=>g[3]))];
 el.innerHTML='<div class="crumbs"><button data-go="learn">← Learn</button></div><div class="view-head"><div class="ph"><span class="eyebrow">'+GLOSS.length+' terms · English → Deutsch</span><h1>Glossary · Glossar</h1><p>The words you need to present a gas on a German ward. Tap a German word to hear it.</p></div></div>'+
  '<div class="card filters"><label class="fld"><span>Search</span><input id="glQ" placeholder="e.g. anion gap, Azidose" autocomplete="off"></label><div class="seg wrap" role="group" aria-label="Topic"><button data-c="" aria-pressed="'+!f+'">All</button>'+cats.map(c=>'<button data-c="'+esc(c)+'" aria-pressed="'+(f===c)+'">'+esc(c)+'</button>').join('')+'</div>'+
  '<div class="btnrow"><button class="btn small" id="glYz">Send to Yuzu as German words</button><button class="btn small" id="glCp">Copy list</button><span class="note" id="glMsg"></span></div></div><div class="gloss" id="glL"></div>'+
  '<div class="card"><span class="eyebrow">Present a gas in German</span><ul class="nx"><li>„Die arterielle BGA zeigt eine metabolische Azidose mit erhöhter Anionenlücke.“</li><li>„Die respiratorische Kompensation ist ausreichend.“</li><li>„Das Laktat ist erhöht, wir denken an einen septischen Schock.“</li><li>„Der Patient hypoventiliert; das CO₂ ist auf 80 mmHg gestiegen.“</li></ul><p class="note">The same words in the same card format as Mephisto\'s, so Yuzu treats them alike.</p></div>';
 const draw=()=>{const q=($('glQ').value||'').toLowerCase();const list=GLOSS.filter(g=>(!f||g[3]===f)&&(!q||g[0].toLowerCase().includes(q)||g[1].toLowerCase().includes(q)));
  $('glL').innerHTML=list.length?list.map((g,i)=>'<div class="gl"><span class="en">'+esc(g[0])+'</span><button class="de" data-say="'+esc(g[1])+'" aria-label="Say '+esc(g[1])+'">'+esc(g[1])+'</button>'+(g[2]?'<small>Pl. '+esc(g[2])+'</small>':'')+(g[4]?'<small class="ex">'+esc(g[4])+'</small>':'')+'</div>').join(''):'<p class="note">No match.</p>';
  $('glL').querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>sayDE(b.dataset.say));};
 el.querySelector('[data-go]').onclick=()=>go('learn');$('glQ').oninput=draw;
 el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{S.ui=S.ui||{};S.ui.gcat=b.dataset.c;save();RENDER.gloss();});
 $('glCp').onclick=e=>copyText(GLOSS.map(g=>g[0]+' — '+g[1]+(g[2]?' (Pl. '+g[2]+')':'')).join('\n'),e.currentTarget);
 $('glYz').onclick=async e=>{const cards=GLOSS.map(g=>{const p=glossParts(g[1]);return {id:'buf-de-'+slugify(g[0]),type:'vocab',word:p.word,article:p.article,plural:g[2]||'',meaning:g[0],example:g[4]||'',source:'Buffer · Glossar'};});
  const pk={yuzu_pack:1,id:'buffer-words',name:'Buffer: blood gas German',category:'German::Medical::Blood gases',lang:'de-DE',cards};
  if(typeof signedIn==='function'&&signedIn()){try{const root=await folder(HUB_ROOT,null);const yz=await folder('Yuzu',root,false);const col=yz&&await folder('collection',yz,false);const inbox=col&&await folder('inbox',col,true);if(!inbox)throw new Error('Yuzu folder not found');await putJSON('buffer-words.json',inbox,pk);$('glMsg').textContent='Sent '+cards.length+' words to Yuzu\'s inbox.';return;}catch(err){$('glMsg').textContent='Drive failed ('+err.message+'); copying.';}}
  const ok=await copyText(JSON.stringify(pk),e.currentTarget);$('glMsg').textContent=(ok?'Copied ':'Clipboard blocked. ')+cards.length+' words as a Yuzu pack.';};
 draw();};
if(RENDER.learn){const _rl9=RENDER.learn;RENDER.learn=function(){_rl9();const el=$('v-learn');const h=el&&el.querySelector('.view-head');if(!h)return;const d=document.createElement('div');d.className='tiles';d.style.marginBottom='14px';
 d.innerHTML='<button class="tile" id="toGloss"><span class="mono-mark">'+ic('steps')+'</span><span><small class="meta">'+GLOSS.length+' terms</small><b>German glossary · Glossar</b><span class="d">BGA words, ICU terms and phrases to present a gas on a German ward, with audio.</span></span></button>';h.after(d);$('toGloss').onclick=()=>go('gloss');};}
