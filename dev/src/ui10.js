/* ================= 4.9: photo of a printout — on-device text recognition, then you confirm every number ================= */
const OCR_JS='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
let OCR_LOAD=null;
function loadOCR(){if(window.Tesseract)return Promise.resolve(window.Tesseract);if(OCR_LOAD)return OCR_LOAD;
 OCR_LOAD=new Promise((res,rej)=>{const s=document.createElement('script');s.src=OCR_JS;s.async=true;s.onload=()=>window.Tesseract?res(window.Tesseract):rej(new Error('engine missing'));s.onerror=()=>{OCR_LOAD=null;rej(new Error('could not download the reader'));};document.head.appendChild(s);});return OCR_LOAD;}
/* fix the usual misreads on analyser printouts before the paste parser sees the text */
function ocrClean(t){return String(t||'')
 .replace(/\b([pP])\s*([aAvV]?)\s*[cC]{1,2}\s*[oO0Q]{1,2}\s*[2zZ]\b/g,'$1$2CO2').replace(/\b([pP])\s*([aAvV]?)\s*[oO0Q]\s*[2zZ]\b/g,'$1$2O2')
 .replace(/\b(c?)H\s*C\s*[oO0]\s*[3]/gi,'$1HCO3').replace(/\bC\s*[oO0]\s*Hb\b/gi,'COHb').replace(/\bMet\s*Hb\b/gi,'MetHb').replace(/\bF\s*i\s*[oO0]\s*2\b/gi,'FiO2')
 .replace(/mmH[qg9]/gi,'mmHg').replace(/k\s*P\s*a/gi,'kPa').replace(/(\d)\s*[,·]\s*(\d)/g,'$1.$2')
 .replace(/(\d)[oO](\d)/g,'$10$2').replace(/(\d)[lI|](\d)/g,'$11$2').replace(/\bp\s*H\b/g,'pH').replace(/\b(c?)Na[t*]{1,2}\+?/g,'$1Na+').replace(/\b(c?)K[t*]{1,2}\+?(?=\s)/g,'$1K+').replace(/\b(c?)C[l1I][\-~]/g,'$1Cl-');}
async function ocrImage(file,onProg){const T=await loadOCR();const img=await new Promise((res,rej)=>{const u=URL.createObjectURL(file);const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('not an image'));i.src=u;});
 const scale=Math.min(2.5,Math.max(1,1800/Math.max(img.width,img.height)));const cv=document.createElement('canvas');cv.width=Math.round(img.width*scale);cv.height=Math.round(img.height*scale);const x=cv.getContext('2d');x.drawImage(img,0,0,cv.width,cv.height);
 const d=x.getImageData(0,0,cv.width,cv.height),p=d.data;let lo=255,hi=0;for(let i=0;i<p.length;i+=4){const g=0.299*p[i]+0.587*p[i+1]+0.114*p[i+2];p[i]=g;if(g<lo)lo=g;if(g>hi)hi=g;}
 const span=Math.max(30,hi-lo);let dark=0;for(let i=0;i<p.length;i+=4){const g=Math.max(0,Math.min(255,(p[i]-lo)*255/span));p[i]=p[i+1]=p[i+2]=g;if(g<128)dark++;}
 if(dark>p.length/8){for(let i=0;i<p.length;i+=4){p[i]=p[i+1]=p[i+2]=255-p[i];}}/* light text on a dark screen: invert */
 x.putImageData(d,0,0);
 const w=await T.createWorker('eng',1,{logger:m=>{if(m.status==='recognizing text'&&onProg)onProg(m.progress);}});
 try{const r=await w.recognize(cv);return {text:r.data.text,thumb:cv.toDataURL('image/jpeg',0.6)};}finally{w.terminate();}}
const OCR_FIELDS=[['pH','pH',''],['pco2','PCO₂','P'],['po2','PO₂','P'],['hco3','HCO₃⁻','mmol/L'],['na','Na⁺','mmol/L'],['k','K⁺','mmol/L'],['cl','Cl⁻','mmol/L'],['lac','Lactate','mmol/L'],['glu','Glucose','mmol/L'],['alb','Albumin','g/L'],['fio2','FiO₂','0–1'],['cohb','COHb','%'],['methb','MetHb','%']];
function ocrSheet(r,thumb,raw){const sc=document.createElement('div');sc.className='sheet-scrim on';const U=PU();
 sc.innerHTML='<div class="sheet ocrsheet" role="dialog" aria-modal="true" aria-labelledby="ocT"><h2 id="ocT">Check the numbers</h2><p class="privacy"><b>Read on this device.</b> Compare each value with the printout before you use it. Values marked ✓ were read from the photo; blank ones were not found.</p>'+
  (thumb?'<img class="octhumb" src="'+thumb+'" alt="Your photo">':'')+
  '<div class="seg" role="group" aria-label="Sample"><button id="ocA" aria-pressed="'+!r.ven+'">Arterial</button><button id="ocV" aria-pressed="'+!!r.ven+'">Venous</button></div>'+
  '<div class="ocgrid">'+OCR_FIELDS.map(f=>{let v=r.v[f[0]];if(v!=null&&f[2]==='P'&&S.units==='kPa')v=r1(v/KPA*10)/10;return '<label class="fld'+(v!=null?' got':'')+'"><span>'+f[1]+' '+(f[2]==='P'?U:f[2])+(v!=null?' ✓':'')+'</span><input id="oc_'+f[0]+'" inputmode="decimal" value="'+(v==null?'':v)+'"></label>';}).join('')+'</div>'+
  '<p id="ocChk" class="warnline" role="status"></p><details><summary><span class="eyebrow">What the reader saw</span></summary><pre class="ocraw">'+esc(raw||'')+'</pre></details>'+
  '<div class="btnrow"><button class="btn primary" id="ocOk">Use these numbers</button><button class="btn" id="ocNo">Cancel</button></div></div>';
 document.body.appendChild(sc);let ven=!!r.ven;const close=()=>sc.remove();$('ocNo').onclick=close;sc.onclick=e=>{if(e.target===sc)close();};
 const read=()=>{const o={};OCR_FIELDS.forEach(f=>{const s=$('oc_'+f[0]).value.trim();if(s==='')return;let v=parseFloat(s.replace(',','.'));if(isNaN(v))return;if(f[2]==='P'&&S.units==='kPa')v=v*KPA;o[f[0]]=v;});if(o.fio2!=null&&o.fio2>1)o.fio2=o.fio2/100;return o;};
 const chk=()=>{const o=read();const el=$('ocChk');if(o.pH==null||o.pco2==null){el.textContent='pH and PCO₂ are needed.';return;}if(o.pH<6.5||o.pH>8){el.textContent='pH '+o.pH+' is outside 6.5–8.0: check it.';return;}
  if(o.hco3!=null){const h=24*o.pco2/o.hco3,m=Math.pow(10,9-o.pH);el.textContent=Math.abs(h-m)/m>0.1?'These numbers do not fit together (Henderson check off by '+Math.round(Math.abs(h-m)/m*100)+'%). One is probably misread.':'';el.className=Math.abs(h-m)/m>0.1?'warnline':'warnline okline';if(Math.abs(h-m)/m<=0.1)el.textContent='Henderson check fits.';}else el.textContent='';};
 sc.querySelectorAll('input').forEach(i=>i.addEventListener('input',chk));chk();
 $('ocA').onclick=()=>{ven=false;$('ocA').setAttribute('aria-pressed','true');$('ocV').setAttribute('aria-pressed','false');};$('ocV').onclick=()=>{ven=true;$('ocV').setAttribute('aria-pressed','true');$('ocA').setAttribute('aria-pressed','false');};
 $('ocOk').onclick=()=>{const o=read();if(o.pH==null||o.pco2==null){chk();return;}close();openTool('interp');setTimeout(()=>{loadInterp(Object.assign({sample:ven?'v':'a'},o));buildForm();runInterp();toast('Loaded. Read it, then save it to the log if you like.');},50);};}
function ocrButton(){const go=$('pGo');if(!go||$('pPhoto'))return;const lab=document.createElement('label');lab.className='btn';lab.id='pPhoto';lab.tabIndex=0;lab.innerHTML=ic('copy')+'Photo of printout<input type="file" accept="image/*" capture="environment" hidden>';go.after(lab);
 const inp=lab.querySelector('input');lab.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click();}};
 inp.onchange=async()=>{const f=inp.files&&inp.files[0];inp.value='';if(!f)return;const msg=$('pMsg');if(msg)msg.textContent='Reading the photo on this device… (the first time, the reader downloads once)';
  try{const r=await ocrImage(f,p=>{if(msg)msg.textContent='Reading… '+Math.round(p*100)+'%';});const parsed=parseGas(ocrClean(r.text));if(msg)msg.textContent=parsed.got.length?'Found '+parsed.got.length+' value'+(parsed.got.length>1?'s':'')+'. Check them.':'No values found. Try a straighter, closer photo, or type them.';ocrSheet(parsed,r.thumb,r.text);}
  catch(e){if(msg)msg.textContent='The photo reader could not run ('+e.message+'). It needs internet the first time. You can still type or paste the values.';}};}
if(typeof renderInterp==='function'){const _rI=renderInterp;renderInterp=function(el){_rI(el);try{ocrButton();}catch(e){}};}

/* ---- home: today's plan ---- */
function todaysPlan(){const t=today(),slot=typeof slotFor==='function'?slotFor(t):'free',cap=(typeof SLOT_MIN!=='undefined'&&SLOT_MIN[slot]!=null)?SLOT_MIN[slot]:25;const items=[];
 const due=dueKinds().length;const dayN=Math.floor(Date.now()/864e5);
 if(slot==='tough')return {slot,cap,items:[{k:'rest',t:'Night shift: rest. If you want one thing, a five-second read set.',min:3,done:false,act:()=>startSpeed('five')}]};
 items.push({k:'round',t:S.lastRound===t?'The Round is done':'The Round',min:Math.min(25,cap),done:S.lastRound===t,act:()=>{const b=$('tRound');if(b)b.click();}});
 if(due)items.push({k:'due',t:'Review '+due+' due pattern'+(due>1?'s':''),min:Math.min(10,2+due*2),done:false,act:()=>startSession('due')});
 const next=CASES.filter(c=>!caseDone(c.id)&&(cap>=15||c.fmt!=='sim'))[0]||CASES[dayN%CASES.length];
 if(cap>=15&&next)items.push({k:'case',t:'Case: '+next.t+' ('+FMT[next.fmt].toLowerCase()+')',min:next.fmt==='sim'?12:6,done:(S.sess||[]).some(s=>s.d===t&&(s.m==='case'||s.m==='sim')),act:()=>openCase(next.id)});
 const sp=['five','pflash','noisy','handover'][dayN%4];items.push({k:'speed',t:SPEED[sp].t,min:4,done:(S.sess||[]).some(s=>s.d===t&&SPEED[s.m]),act:()=>startSpeed(sp)});
 items.push({k:'log',t:'Log a real gas from your day',min:1,done:logList().some(e=>isoD(new Date(e.t))===t),act:()=>openTool('interp')});
 const dow=new Date().getDay();if(dow===0||dow===1)items.push({k:'week',t:'Weekly review',min:5,done:false,act:()=>go('progress')});
 let sum=0;const fit=items.filter(i=>{if(i.done||i.k==='log')return true;if(sum+i.min>cap+5&&i.k!=='round')return false;sum+=i.min;return true;});
 return {slot,cap,items:fit};}
if(RENDER.today){const _rt10=RENDER.today;RENDER.today=function(){_rt10();const el=$('v-today');if(!el)return;const P0=todaysPlan();const done=P0.items.filter(i=>i.done).length;
 const card=document.createElement('div');card.className='card plan';card.innerHTML='<div class="btnrow" style="justify-content:space-between"><span class="eyebrow">Today\'s plan · '+done+'/'+P0.items.length+' · about '+P0.items.filter(i=>!i.done).reduce((a,i)=>a+i.min,0)+' min</span><small class="muted">'+({free:'free day',before:'before a night',early:'early start',postnight:'after a night',tough:'night shift'})[P0.slot]+'</small></div><ol class="planl">'+P0.items.map((i,n)=>'<li class="'+(i.done?'done':'')+'"><button class="btn small'+(i.done?' ghost':n===0||!P0.items[n-1]||P0.items.slice(0,n).every(x=>x.done)?' primary':'')+'" data-pl="'+n+'">'+(i.done?'✓ ':'')+esc(i.t)+'</button><small>'+i.min+' min</small></li>').join('')+'</ol>';
 const hero=el.querySelector('.hero,.card.raised,.card');if(hero)hero.after(card);else el.prepend(card);
 card.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{try{P0.items[+b.dataset.pl].act();}catch(e){console.error(e);}});};}
