/* ================= INTERPRET ================= */
const IF=[['pH','pH','',0.01],['pco2','PCO₂','P',1],['po2','PO₂','P',1],['fio2','FiO₂','',0.01],['peep','PEEP','cmH₂O',1],['hco3','HCO₃⁻','mmol/L',0.1],['age','Age','years',1],['na','Na⁺','mmol/L',1],['k','K⁺','mmol/L',0.1],['cl','Cl⁻','mmol/L',1],['alb','Albumin','g/L',1],['lac','Lactate','mmol/L',0.1],['glu','Glucose','mmol/L',0.1],['urea','Urea','mmol/L',0.1],['osm','Osm (measured)','mOsm/kg',1],['bhb','BHB (ketones)','mmol/L',0.1],['spo2','SpO₂','%',1],['cohb','COHb','%',0.1],['methb','MetHb','%',0.1]];
/* the demo gas matches the paste-box example exactly (HCO3 9.4), so it reads as compensated HAGMA */
let IV={sample:'a',pH:7.21,pco2:24,po2:108,fio2:0.21,hco3:9.4,na:136,cl:101,alb:40,lac:1.4,glu:28,age:24},IREF=null,IPARSED=[],IMISS=[],IVT=null;
/* HCO3 is not written into the form when it is only calculated: the field shows 'calc …' and follows pH and PCO2 as they are edited. IVT = when these values were entered (null for examples). */
function loadInterp(ex){IREF=null;IPARSED=[];IMISS=[];IV=Object.assign({sample:'a'},ex);IVT=Date.now();}
/* reads values out of pasted analyser text or ward shorthand. Each value takes the unit printed beside it (kPa or mmHg, mg/dL or mmol/L);
   37 °C rows win over temperature-corrected (T) rows, actual over standard bicarbonate, measured over calculated osmolality.
   Reference ranges, barometric pressure and '(37.0 °C)' in labels are removed first. Also reads 7.31/52/24, the sample type and the oxygen device. */
function ui3Unit(s){s=String(s||'').toLowerCase().replace(/\s+/g,'');return /kpa/.test(s)?'kpa':/mmhg/.test(s)?'mmhg':/mg\/dl/.test(s)?'mgdl':/mmol\/l/.test(s)?'mmol':/g\/dl/.test(s)?'gdl':/g\/l/.test(s)?'gl':'';}
const UI3_N='(\\d+(?:\\.\\d+)?)',UI3_PF=[['pH','\\bph\\b','([67]\\.\\d{1,3})',14],['pco2','\\bp\\s?[av]?\\s?co2\\b',UI3_N,16],['po2','\\bp\\s?[av]?\\s?o2\\b',UI3_N,16],['hco3','\\b(?:c?hco3|bicarb[a-z]*)',UI3_N,18],
 ['na','\\b(?:c?na\\+?|sodium)(?![a-z])','(\\d{3}(?:\\.\\d)?)',12],['k','\\b(?:ck\\+|k\\+?|potassium)(?![a-z])','(\\d{1,2}(?:\\.\\d+)?)',12],['cl','\\b(?:c?cl-?|chloride)(?![a-z])','(\\d{2,3}(?:\\.\\d)?)',12],
 ['lac','\\bc?lac[a-z]*',UI3_N,12],['glu','\\bc?glu[a-z]*',UI3_N,12],['alb','\\balb[a-z]*',UI3_N,12],['fio2','\\bf\\s?i?\\s?o2(?:\\s*\\(\\s*i\\s*\\))?(?![a-z])',UI3_N,12],['cohb','\\bf?cohb',UI3_N,12],['methb','\\bf?methb',UI3_N,12],
 ['urea','\\b(?:urea|bun)(?![a-z])',UI3_N,12],['osm','\\b(?:m?osm[a-z]*(?![a-z\\/])|osmolality)',UI3_N,14],['spo2','\\bspo2',UI3_N,12],['peep','\\bpeep\\b','(\\d{1,2}(?:\\.\\d)?)',10],
 ['bhb','\\b(?:bhb|b-?ohb|beta-?ohb|beta-?hydroxy-?butyrate|(?:blood\\s*|capillary\\s*)?ketones?)(?![a-z])',UI3_N,12],['age','\\bage\\b','(\\d{1,3})',8]];
function parseGas(txt){let t=String(txt||'').replace(/₂/g,'2').replace(/₃/g,'3').replace(/[⁻−–—]/g,'-').replace(/⁺/g,'+').replace(/β/g,'beta').replace(/(\d),(\d)/g,'$1.$2').replace(/[ \t ]+/g,' ');
 const out={},got=[],src={},units={},notes=[];let tcUsed=[],stdUsed=false;
 /* measuring temperature in a label, reference ranges, barometric pressure */
 t=t.replace(/[(@]\s*3[4-9](?:\.\d)?\s*°?\s*C(?![a-z])\s*\)?/gi,' ').replace(/\b3[4-9](?:\.\d)?\s*°\s*C(?![a-z])/gi,' ');
 t=t.replace(/[\[(]\s*-?\d+(?:\.\d+)?\s*-\s*-?\d+(?:\.\d+)?\s*[\])]/g,' ').replace(/(^|[^\w.\/+])(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)(?![\d.\/])/g,(m,p,a,b)=>+a<+b?p+' ':m);
 t=t.replace(/\b(?:baro[a-z]*|bar|atm[a-z]*|p\s?\(?amb\)?|amb[a-z]*)\b[^0-9\n]{0,24}\d+(?:\.\d+)?\s*(?:mm\s?hg|kpa|hpa|mbar)?/gi,' ');
 for(const [k,lab,val,gap] of UI3_PF){const re=new RegExp('('+lab+')([^0-9\\n]{0,'+gap+'})'+val+'(?!\\d)(?: ?(?:[hl*↑↓] )?(k\\s?pa|mm\\s?hg|mg\\s*\\/\\s*dl|mmol\\s*\\/\\s*l|g\\s*\\/\\s*dl|g\\s*\\/\\s*l))?','gi');const ms=[];let m;
  while((m=re.exec(t))){const i=m.index,ls=t.lastIndexOf('\n',i-1)+1,pre=t.slice(Math.max(ls,i-16),i).replace(/^.*\d/,''),tail=m[2],ctx=pre+'|'+m[1]+tail;let pen=0,tc=false;
   if(/\/\s*$/.test(pre)||(k==='k'&&/gap[\s,(]*$/i.test(pre)))continue;/* the second half of a ratio, e.g. pO2(a)/FO2(I); 'Anion Gap,K+' */
   if(k==='po2'&&(/\/|ratio|a\s*-\s*a/i.test(tail)||/\(\s*A\s*\)/.test(tail)))continue;/* P/F ratio, A–a, alveolar pO2(A) */
   if(/\(\s*t\s*c?\s*\)|^\s*t\b|temp|corr/i.test(tail)){pen+=2;tc=true;}
   if(k==='hco3'&&(/(?:^|[^a-z])st(?:d|andard)?(?![a-z])|std/i.test(tail)||/(?:standard|std)\s*$/i.test(pre)))pen+=2;
   if(k==='osm'){if(/calc|gap|osmc\b|\bc\)/i.test(ctx))continue;if(/meas/i.test(ctx))pen-=1;}
   const v=parseFloat(m[3]);if(!isNaN(v))ms.push({v,pen,tc,i,u:ui3Unit(m[4])||ui3Unit(tail),lab:m[1],src:m[0].trim()});}
  ms.sort((a,b)=>a.pen-b.pen||a.i-b.i);const b=ms[0];if(!b)continue;
  out[k]=b.v;got.push(k);src[k]=b.src;units[k]=b.u;if(b.tc)tcUsed.push(k);if(k==='hco3'&&b.pen>=2)stdUsed=true;if(k==='urea'&&/bun/i.test(b.lab))units.bun=1;}
 /* ward shorthand: pH/PCO2/HCO3[/PO2]; the Henderson fit decides the unit of PCO2 and which number is HCO3 */
 let kpa=false;const sl=(out.pH==null||out.pco2==null)&&t.match(/(?:^|[^\d.])([67]\.\d{1,3}) ?\/ ?(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)(?: ?\/ ?(\d+(?:\.\d+)?))?/);
 if(sl){const ph=+sl[1],b=+sl[2],c=+sl[3],d=sl[4]!=null?+sl[4]:null,exp=pc=>24*pc/Math.pow(10,9-ph);let best=null;
  for(const pc of b<15?[b,b*KPA]:[b])for(const [h,o] of d!=null?[[c,d],[d,c]]:[[c,null]]){const e=Math.abs(h-exp(pc))/exp(pc);if(!best||e<best.e)best={e,pc,h,o};}
  const kp=best.pc!==b;let h=best.h,o=best.o;if(best.e>0.25){h=c;o=d;if(d==null&&c>2*exp(best.pc)&&c>=30){o=c;h=null;}}
  const put=(k,v)=>{if(v!=null&&out[k]==null){out[k]=k==='pH'?v:r1(v);got.push(k);src[k]=sl[0].trim();units[k]='mmhg';}};
  put('pH',ph);put('pco2',best.pc);put('hco3',h);put('po2',o!=null&&kp?o*KPA:o);if(kp){kpa=true;}}
 /* PCO2 and PO2: the unit beside each value, then the other gas value's unit, then the text as a whole (barometric lines removed), then the Henderson fit */
 const gu=u=>u==='kpa'||u==='mmhg'?u:'',hasK=/k\s?pa/i.test(t),hasM=/mm\s?hg/i.test(t),gl=hasK&&!hasM?'kpa':hasM&&!hasK?'mmhg':'';
 let pu=gu(units.pco2)||gu(units.po2)||gl;
 if(!pu&&out.pco2!=null&&out.pco2<15){if(out.pH!=null&&out.hco3!=null){const fit=p=>Math.abs(24*p/out.hco3-Math.pow(10,9-out.pH));pu=fit(out.pco2*KPA)<fit(out.pco2)?'kpa':'mmhg';}else pu=out.pco2<9?'kpa':'mmhg';notes.push('No unit printed for PCO₂: '+(pu==='kpa'?'kPa':'mmHg')+' assumed from the numbers.');}
 for(const k of ['pco2','po2'])if(out[k]!=null&&units[k]!=='mmhg'&&(gu(units[k])||pu)==='kpa'){out[k]=r1(out[k]*KPA);kpa=true;}
 if(out.fio2!=null&&out.fio2>1)out.fio2=out.fio2/100;
 if(out.alb!=null&&(units.alb==='gdl'||(!units.alb&&out.alb<10)))out.alb=out.alb*10;
 if(out.glu!=null){if(units.glu==='mgdl')out.glu=r1(out.glu/18.016);else if(!units.glu&&out.glu>60){out.glu=r1(out.glu/18.016);notes.push('Glucose had no unit and is above 60: read as mg/dL ('+out.glu+' mmol/L). Check it.');}}
 if(out.lac!=null&&units.lac==='mgdl')out.lac=r1(out.lac/9.008);
 if(out.urea!=null){if(units.bun&&units.urea!=='mmol'){out.urea=r1(out.urea/2.801);notes.push('BUN (mg/dL) converted to urea '+out.urea+' mmol/L.');}else if(units.urea==='mgdl')out.urea=r1(out.urea/6.006);}
 if(out.age!=null&&out.age>120){delete out.age;got.splice(got.indexOf('age'),1);}
 if(out.age==null){const a=t.match(/\b(\d{1,3}) ?(?:yo\b|y\/o|-?years?[- ]old|-?year-old)/i);if(a&&+a[1]<=120){out.age=+a[1];got.push('age');src.age=a[0];}}
 if(tcUsed.length)notes.push('Only temperature-corrected (T) values found for '+tcUsed.join(', ')+'. The rules assume 37 °C.');
 if(stdUsed)notes.push('Only standard bicarbonate found. It does not fit the measured PCO₂; enter the actual HCO₃⁻ if you have it.');
 /* oxygen device in free text, when no FiO2 is printed (values as in the Labs oxygen tool) */
 if(out.fio2==null){let f=null,how='';const nc=t.match(/\b(\d(?:\.\d)?) ?l(?:\/min|pm|\/m)?\.? ?(?:via |of |o2 |oxygen )*(?:nc|nasal ?can[a-z]*|nasal ?specs|nsp|nasal prongs)\b/i),vm=t.match(/\b(?:venturi|vm)\b[^0-9\n]{0,6}(24|28|31|35|40|60) ?%|\b(24|28|31|35|40|60) ?% ?(?:venturi|vm)\b/i);
  if(/\b(?:nrb|non-?rebreath[a-z]*|reservoir mask)\b/i.test(t)){f=0.8;how='non-rebreather mask';}
  else if(vm){f=+(vm[1]||vm[2])/100;how='Venturi '+(vm[1]||vm[2])+'%';}
  else if(nc&&+nc[1]>0&&+nc[1]<=6){f=r1((0.20+0.04*nc[1])*100)/100;how='nasal cannula '+nc[1]+' L/min';}
  else if(/\b(?:sfm|simple (?:face )?mask|hudson)\b/i.test(t)){f=0.45;how='simple face mask';}
  else if(/\broom ?air\b|\b(?:on|@) ?ra\b/i.test(t)){f=0.21;how='room air';}
  if(f!=null){out.fio2=f;got.push('fio2');src.fio2=how;if(how!=='room air')notes.push('FiO₂ '+f.toFixed(2)+' estimated from '+how+'. Devices give an approximate FiO₂.');}}
 /* sample type: an explicit 'Sample (type):' field wins; otherwise keywords; null when none or conflicting */
 const cls=w=>/^art/i.test(w)?'a':/^(?:ven|mix)/i.test(w)?'v':/^cap/i.test(w)?'c':null;let sample=null;
 const sf=t.match(/\b(?:sample|specimen)(?: ?type)? ?[:\-]? ?(arterial|art|ven[a-z]*|mixed ?ven[a-z]*|capillary|cap)\b/i);
 if(sf)sample=cls(sf[1]);else{const hit=[/\b(?:arterial|art|abg|pa ?co2|pa ?o2)\b/i.test(t)&&'a',/\b(?:ven(?:ous|ou|aus|ose|s)?|mixed ?ven[a-z]*|v ?b ?g|pv ?co2|pv ?o2)\b/i.test(t)&&'v',/\b(?:capillary|cap)\b(?! ?refill)/i.test(t)&&'c'].filter(Boolean);if(hit.length===1)sample=hit[0];}
 if(sample==='c'&&out.po2!=null){notes.push('Capillary sample: acid–base read as arterial. PO₂ '+out.po2+' left out, because capillary PO₂ does not reflect arterial oxygenation.');delete out.po2;got.splice(got.indexOf('po2'),1);}
 if(out.po2!=null&&out.fio2==null&&sample!=='v')notes.push('FiO₂ not found: room air assumed. Enter it if the patient is on oxygen.');
 return {v:out,got,kpa,ven:sample==='v',sample,notes,src};}
function renderInterp(el){
 el.innerHTML='<div id="iLive" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"></div><div class="igrid"><div style="display:grid;gap:16px;min-width:0"><div class="card fset"><div class="btnrow" style="justify-content:space-between"><h3 id="pHead" aria-level="2">Paste a printout</h3><span class="note" id="pMsg"></span></div><textarea class="inp" id="pTxt" aria-labelledby="pHead" aria-describedby="pHint" placeholder="Paste the analyser text or type it, for example: pH 7.21 pCO2 3.2 kPa pO2 14 HCO3 9.4 Na 136 Cl 101 Lac 1.4 Glu 28"></textarea><p class="note" id="pHint" style="margin:0">Analyser text, a lab report, or shorthand such as VBG 7.31/52/24 on 2 L NC.</p><div id="pInfo"></div><div class="btnrow"><button class="btn ghost" id="pGo">Read values</button><select id="iLoad" class="btn" style="flex:0 1 auto;max-width:100%" aria-label="Load an example"></select></div></div><div class="card fset" id="iForm"></div></div><div style="display:grid;gap:16px;min-width:0" id="iOut"></div></div>';
 const sel=$('iLoad');sel.innerHTML='<option value="">Load an example…</option><option value="rand">Random case</option><optgroup label="Lesson examples">'+L.filter(l=>l.ex).map(l=>'<option value="'+l.id+'">'+esc(l.t)+'</option>').join('')+'</optgroup><optgroup label="Reference set (validated)">'+REFCASES.map((r,i)=>'<option value="ref'+i+'">'+esc(r.n)+'</option>').join('')+'</optgroup>';
 sel.onchange=()=>{const v=sel.value;if(v==='rand'){const c=safeCase(pick(Object.keys(KINDS)),4);const x={};['pH','pco2','hco3','po2','fio2','na','k','cl','alb','lac','glu','age','sample'].forEach(k=>{if(c[k]!=null)x[k]=c[k];});loadInterp(x);}else if(v.startsWith('ref')){const r=REFCASES[+v.slice(3)];loadInterp(r.i);IREF=r;}else if(LBYID[v])loadInterp(LBYID[v].ex);else return;IVT=null;sel.value='';buildForm();runInterp();ui3Reveal();};
 /* a sample type printed on the slip wins; otherwise the user's Arterial/Venous choice is kept */
 $('pGo').onclick=()=>{const r=parseGas($('pTxt').value);if(!r.got.length){$('pMsg').textContent='No values recognised.';ui3PInfo(null);return;}const smp=r.sample==='v'?'v':r.sample?'a':(IV.sample==='v'?'v':'a');
  IV=Object.assign({sample:smp},r.v);IREF=null;IPARSED=r.got.slice();IVT=Date.now();IMISS=r.v.po2!=null&&r.v.fio2==null&&smp!=='v'?['fio2']:[];
  $('pMsg').textContent='Read '+r.got.length+' value'+(r.got.length>1?'s':'')+(r.kpa?' · kPa converted':'')+' · '+(smp==='v'?'venous':'arterial');ui3PInfo(r,smp);buildForm();runInterp();ui3Reveal();toast('Values filled in. Check them before trusting the read.');};
 buildForm();runInterp();}
/* under the paste box: sample type found or not, conversions and assumptions, and each value with the text it came from */
function ui3PInfo(r,smp){const el=$('pInfo');if(!el)return;if(!r){el.innerHTML='';return;}const nm={a:'Arterial',v:'Venous',c:'Capillary'};
 const lines=[r.sample?'Sample type on the printout: '+nm[r.sample]+'.':'Sample type not found on the printout: kept '+(smp==='v'?'Venous':'Arterial')+'. Change it below if needed.'].concat(r.notes||[]);
 const U={pco2:'mmHg',po2:'mmHg'},rows=r.got.filter(k=>r.v[k]!=null).map(k=>{const f=IF.find(x=>x[0]===k);return '<li><b>'+(f?f[1]:k)+' '+r.v[k]+'</b> '+esc(U[k]||(f?f[2]:''))+' <span class="muted">← “'+esc(String(r.src&&r.src[k]||'').slice(0,40))+'”</span></li>';}).join('');
 el.innerHTML='<ul class="note tight" style="margin:0;padding-left:1.2em">'+lines.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(rows?'<details><summary class="note" style="cursor:pointer;text-decoration:underline;min-height:32px;display:flex;align-items:center">Show what was read, and from where</summary><ul class="note tight" style="margin:6px 0 0;padding-left:1.2em">'+rows+'</ul></details>':'');}
/* phones: the read sits below the form, so bring it into view after Read values or an example */
function ui3Reveal(){const o=$('iOut');if(!o||!matchMedia('(max-width:900px)').matches)return;const hd=document.querySelector('header.top'),off=(hd?hd.getBoundingClientRect().height:0)+8;
 scrollTo({top:Math.max(0,o.getBoundingClientRect().top+scrollY-off),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
let ui3LiveT=null;
function buildForm(){const U=PU();
 let h='<div class="btnrow" style="justify-content:space-between"><div class="seg" role="group" aria-label="Sample type"><button id="iA" aria-pressed="'+(IV.sample!=='v')+'">Arterial</button><button id="iV" aria-pressed="'+(IV.sample==='v')+'">Venous</button></div><button class="btn quiet" id="iClr">Clear</button></div>';
 if(IVT&&Date.now()-IVT>30*60e3){const d=new Date(IVT),p=n=>String(n).padStart(2,'0'),day=d.toDateString()===new Date().toDateString()?'':' on '+p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear();
  h='<div class="btnrow" role="note" style="justify-content:space-between;border:2px dashed var(--accent);padding:8px 10px"><span><b>Values from '+p(d.getHours())+':'+p(d.getMinutes())+day+'.</b> Is this the same patient?</span><button class="btn small" id="iStale">Clear for a new patient</button></div>'+h;}
 const grp=(t,keys)=>'<h3 aria-level="2">'+t+'</h3><div class="ctrls tight">'+keys.map(k=>{const f=IF.find(x=>x[0]===k);const u=f[2]==='P'?U:f[2];let v=IV[k];if(v!=null&&f[2]==='P'&&S.units==='kPa')v=(v/KPA).toFixed(2);else if(v!=null&&typeof v==='number')v=Math.round(v*100)/100;return '<div class="ctrl"><label for="i_'+k+'"><span>'+f[1]+'</span><span>'+u+'</span></label><input type="number" inputmode="decimal" id="i_'+k+'" step="'+(f[2]==='P'&&S.units==='kPa'?0.1:f[3])+'" value="'+(v==null?'':v)+'"'+(k==='hco3'?' placeholder="'+ui3Calc()+'"':'')+(IPARSED.includes(k)?' class="filled"':'')+(IMISS.includes(k)?' style="border-style:dashed;border-color:var(--accent)" title="Not found on the printout"':'')+'></div>';}).join('')+'</div>';
 h+=grp('Blood gas',['pH','pco2','po2','fio2','peep','hco3','age'])+grp('Chemistry',['na','k','cl','alb','lac','glu','urea','osm','bhb'])+grp('Co-oximetry',['spo2','cohb','methb']);
 h+='<p class="note">HCO₃⁻ is calculated from pH and PCO₂ if left blank. Altitude ('+S.patm+' mmHg), anion gap reference ('+S.agref+') and units come from Settings.</p>';
 $('iForm').innerHTML=h;
 $('iForm').querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{i.classList.remove('filled');if(i.style.borderStyle){i.removeAttribute('style');IMISS=[];}readForm();IVT=Date.now();const hc=$('i_hco3');if(hc)hc.placeholder=ui3Calc();runInterp();}));
 const clr=()=>{IV={sample:IV.sample};IREF=null;IPARSED=[];IMISS=[];IVT=null;if($('pTxt'))$('pTxt').value='';if($('pMsg'))$('pMsg').textContent='';ui3PInfo(null);buildForm();runInterp();};
 $('iA').onclick=()=>{IV.sample='a';buildForm();runInterp();};$('iV').onclick=()=>{IV.sample='v';buildForm();runInterp();};$('iClr').onclick=clr;if($('iStale'))$('iStale').onclick=()=>{clr();$('i_pH').focus();};}
function ui3Kpa(){IV.pco2=r1(IV.pco2*KPA);if(IV.po2!=null&&IV.po2<80)IV.po2=r1(IV.po2*KPA);IVT=Date.now();buildForm();runInterp();toast('Converted from kPa. Check the values.');}
addEventListener('buffer:theme',()=>{if(typeof VIEW!=='undefined'&&VIEW==='tool'&&TOOL==='interp'&&$('iMap'))runInterp();});/* map colours follow a theme switch */
function ui3Calc(){return IV.hco3==null&&IV.pH!=null&&IV.pco2!=null?'calc '+r1(hFrom(IV.pH,IV.pco2)):'';}
function readForm(){IF.forEach(f=>{const el=$('i_'+f[0]);if(!el)return;const s=el.value.trim();if(s===''){delete IV[f[0]];return;}let v=parseFloat(s);if(isNaN(v)){delete IV[f[0]];return;}if(f[2]==='P'&&S.units==='kPa')v=v*KPA;IV[f[0]]=v;});}
function runInterp(){const out=$('iOut');if(!out)return;const inp=Object.assign({},IV);if(inp.fio2!=null&&inp.fio2>1)inp.fio2=inp.fio2/100;
 if(inp.pH==null||inp.pco2==null){out.innerHTML='<div class="empty"><b>Enter at least pH and PCO₂</b><span>Or paste a printout, or load an example from the menu.</span></div>';return;}
 if(inp.hco3==null){inp.hco3=r1(hFrom(inp.pH,inp.pco2));inp._hcalc=true;}
 const live=m=>{clearTimeout(ui3LiveT);ui3LiveT=setTimeout(()=>{const l=$('iLive');if(l)l.textContent=m;},700);};
 document.querySelectorAll('#iForm input[aria-invalid]').forEach(e=>{e.removeAttribute('aria-invalid');e.removeAttribute('aria-describedby');});
 const hn=Math.pow(10,9-inp.pH),kfit=IV.hco3!=null&&inp.pco2<15&&Math.abs(24*inp.pco2*KPA/inp.hco3-hn)/hn<=0.1,kbtn=kfit?'<div class="btnrow"><button class="btn small" id="iKpa">PCO₂ looks like kPa. Convert</button></div>':'';
 const o=interp(inp);if(o.err){out.innerHTML='<div class="card crash" role="alert" id="iErr"><div class="eyebrow">Check the input</div><p style="margin:6px 0 0">'+esc(o.err)+'</p>'+kbtn+'</div>';if(kfit)$('iKpa').onclick=ui3Kpa;
  if(typeof LIMITS!=='undefined')for(const k in LIMITS){const x=inp[k],e=$('i_'+k);if(e&&x!=null&&(x<LIMITS[k][0]||x>LIMITS[k][1])){e.setAttribute('aria-invalid','true');e.setAttribute('aria-describedby','iErr');}}return;}
 /* Henderson mismatch: no confident headline; offer the kPa conversion when that is what makes the numbers fit */
 const bad=(o.flags||[]).includes('inconsistent'),line=bad?'UNRELIABLE (Henderson mismatch): '+o.line:o.line;
 const head=bad?'<div class="bigread">Check the numbers: pH, PCO₂ and HCO₃⁻ do not fit</div><p class="note" style="margin:0">Provisional, only if the numbers are right: '+esc(o.label)+'. Recheck the slip or repeat the sample.</p>'+kbtn:'<div class="bigread">'+esc(o.label)+'</div>';
 const oxw=(o.flags||[]).includes('ox-implausible')?'<p class="note" style="margin:0;border-left:3px solid var(--accent);padding-left:8px">Oxygen numbers do not add up: the PaO₂ is above the alveolar PO₂. Check the FiO₂ and the sample.</p>':'';
 live(bad?'Check the numbers: pH, PCO₂ and HCO₃⁻ do not fit':'Read: '+o.label);
 const refBox=IREF?'<div class="card refc"><div class="eyebrow">Reference case · for your clinical review</div><p style="margin:6px 0 0"><b>'+esc(IREF.n)+'.</b> Expected: '+esc(IREF.label||({hv:'hypoxaemia with normal A–a',lung:'raised A–a gradient',pf:'P/F '+(IREF.pf||'')}[IREF.ox])||(IREF.flag?'flagged as inconsistent':''))+'.'+(IREF.note?' <span class="muted">Working: '+esc(IREF.note)+'</span>':'')+'</p><p class="note" style="margin-top:6px">Disagree? Tell Claude the case and why; the rule and its tests get fixed together.</p></div>':'';
 out.innerHTML=refBox+'<div class="card raised" style="display:grid;gap:12px"><div class="eyebrow">'+(o.ven?'Venous read · acid–base only':'Read')+'</div>'+head+oxw+'<p class="line">'+esc(line)+'</p><div class="btnrow" id="iAct"><button class="btn small" id="iCopy">'+ic('copy')+'Copy for Black Template</button></div><div class="cvwrap" style="order:9"><canvas id="iMap" aria-label="Acid–base map"></canvas></div></div><div class="card">'+stepsHTML(o)+'</div>'+FORMULAS();
 drawMap($('iMap'),[{ph:o.est.pH,h:o.est.hco3,l:o.ven?'est. arterial':'this gas'}],290);
 if($('iKpa'))$('iKpa').onclick=ui3Kpa;
 $('iCopy').onclick=e=>copyText(line,e.currentTarget).then(ok=>{if(!ok){const ta=document.createElement('textarea');ta.className='copy';ta.value=line;out.prepend(ta);ta.select();toast('Clipboard blocked here. Select the text above and copy it.');}});}
function FORMULAS(){return '<details class="card formulas" style="order:9"><summary><span class="eyebrow">Formulas, assumptions and limits</span></summary><div class="tw" style="margin-top:12px"><table class="tbl"><tr><th>Quantity</th><th>Formula</th><th>Assumptions and limits</th></tr>'+[
 ['Consistency check','[H⁺] (nmol/L) = 24 × PCO₂ ÷ HCO₃⁻; compare with 10^(9 − pH)','Flag above 10% difference. Analysers calculate HCO₃⁻, so a mismatch means transcription or mixed samples.'],
 ['Primary process','pH < 7.35 / > 7.45; PCO₂ 35–45 mmHg; HCO₃⁻ 22–26','With a normal pH and both values abnormal in the same direction, the side of 7.40 decides.'],
 ['Metabolic acidosis','PCO₂ = 1.5 × HCO₃⁻ + 8 ± 2 (Winter)','Needs 12–24 h. Floor ≈ 10–15 mmHg.'],
 ['Metabolic alkalosis','PCO₂ = 0.7 × HCO₃⁻ + 20 ± 5','Ceiling ≈ 55–60 mmHg. The widest and least reliable rule.'],
 ['Respiratory acidosis','HCO₃⁻ ↑ 1 (acute) or 4 (chronic) per 10 mmHg above 40, ± 2','Between the two: acute-on-chronic or 1–2 days old.'],
 ['Respiratory alkalosis','HCO₃⁻ ↓ 2 (acute) or 5 (chronic) per 10 mmHg below 40, ± 2','Chronic can fully normalise pH.'],
 ['Anion gap','Na⁺ − (Cl⁻ + HCO₃⁻) [+ K⁺ if set]','Reference '+(S.agref||12)+' (Settings). High = above reference + 2. Analyser-dependent.'],
 ['Albumin correction','AG + 0.25 × (40 − albumin g/L)','Omitted when albumin is not entered; a low albumin then hides a raised gap.'],
 ['Δ ratio','(AG − reference) ÷ (24 − HCO₃⁻)','Only when the gap is high and HCO₃⁻ < 24. Bands < 0.4, 0.4–0.8, 0.8–2, > 2. Supportive, not diagnostic.'],
 ['Osmolar gap','Measured − (2 × Na⁺ + glucose + urea), all mmol/L','Normal < 10. Ethanol adds to the measured value.'],
 ['Venous sample','Arterial ≈ pH + 0.03, PCO₂ − 5, HCO₃⁻ − 1','pH and HCO₃⁻ agree well; PCO₂ agreement is poor in individuals and worse in shock. PvO₂ is never used.'],
 ['Alveolar gas','PAO₂ = FiO₂ × (P_atm − 47) − PaCO₂ ÷ 0.8','P_atm '+(S.patm||760)+' mmHg (Settings). RQ 0.8 assumed.'],
 ['A–a gradient','PAO₂ − PaO₂; expected ≤ age ÷ 4 + 4 (+5 tolerance)','Room air only. On oxygen use P/F.'],
 ['P/F ratio','PaO₂ ÷ FiO₂','Berlin ARDS bands ≤ 300 / 200 / 100 with PEEP ≥ 5.'],
 ['Base excess','0.93 × (HCO₃⁻ − 24.4 + 14.8 × (pH − 7.40))','Standard base excess (extracellular), Van Slyke approximation.'],
 ['Input limits','pH 6.5–8.0; PCO₂ 5–200 mmHg; HCO₃⁻ 1–70; Na⁺ 100–190; Cl⁻ 60–150','Values outside are rejected as likely unit or typing errors.']
].map(r=>'<tr><td>'+r[0]+'</td><td class="mono" style="font-size:12.5px">'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</table></div><p class="note">The engine is checked by an automated suite: '+REFCASES.length+' hand-worked reference cases, invalid and mistyped inputs, unit conversion, and thousands of random gases compared with a reference implementation of the same rules (it catches coding slips, not errors in the rules themselves).</p></details>';}

/* ================= LABS: models + bedside tools ================= */
const MODELS=[['map','Acid–base map','Drop any gas on the pH × HCO₃⁻ map with its PCO₂ isobars.'],['hh','Henderson–Hasselbalch seesaw','Move HCO₃⁻ and PCO₂ and watch the ratio set the pH.'],['phh','pH and [H⁺]','The log scale made visible: why 7.10 is twice as acid as 7.40.'],['odc','Dissociation curve','Shift it with pH, temperature and 2,3-BPG; add carbon monoxide.'],['rbc','Inside the red cell','CO₂ in, HCO₃⁻ out, Cl⁻ in, O₂ off: Bohr and Haldane, animated.'],['o2c','O₂ content and delivery','Haemoglobin beats PaO₂: see what each term is worth.'],['alv','Alveolar gas equation','FiO₂, altitude and PaCO₂ against PAO₂ and the A–a gradient.'],['comp','Compensation','Pick a disorder, enter the numbers, see the expected band.'],['agc','Anion gap, Δ ratio, osmolar gap','The three gaps on one panel.'],['sid','Stewart SID and SIG','Strong ions, weak acids and the gap between them.']];
/* D25: one icon per bedside tool (added to ui1's ICON set only if missing) */
[['drop','<path d="M12 3 6 12a6 6 0 0 0 12 0z"/><path d="M9 14a3 3 0 0 0 3 3"/>'],['lungs','<path d="M12 3v8l-3 2M12 11l3 2"/><path d="M8 7C5 8 4 13 4 18c0 2 2 3 4 2l1-1V9M16 7c3 1 4 6 4 11 0 2-2 3-4 2l-1-1V9"/>'],['beaker','<path d="M6 3h12M7 3v15a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V3"/><path d="M7 12h10"/>'],['scales','<path d="M12 3v17M7 21h10M4 7h16"/><path d="M4 7l-3 6h6zM20 7l-3 6h6z"/>'],['wave','<path d="M2 12h4l2-7 3 14 3-10 2 3h6"/>'],['syringe','<path d="M3 21l4-4M8 12l9-9 4 4-9 9zM6 14l4 4M15 5l4 4"/>'],['swap','<path d="M4 8h15l-4-4M20 16H5l4 4"/>'],['print','<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8"/><path d="M7 14h10v7H7z"/>']].forEach(x=>{if(!ICON[x[0]])ICON[x[0]]=x[1];});
const TOOLS=[
 ['interp','Gas interpreter','Paste or type any ABG or VBG. Step-by-step read with the arithmetic and a line for your notes.','interp'],
 ['vbg','Venous → arterial','Estimate arterial values from a VBG, with the limits that matter.','drop'],
 ['oxy','Oxygenation','A–a gradient, P/F, S/F and FiO₂ by oxygen device, with altitude.','lungs'],
 ['urine','Urine gaps','Urine anion gap, urine osmolal gap and urine pH for a normal-gap acidosis.','beaker'],
 ['hh','Henderson check','Do pH, PCO₂ and HCO₃⁻ belong to the same sample?','scales'],
 ['vent','Ventilator CO₂','New rate or tidal volume to reach a target PaCO₂, with tidal volume per kg predicted body weight.','wave'],
 ['bicarb','Bicarbonate and sodium','Bicarbonate deficit, with when not to give it, and glucose-corrected Na⁺.','syringe'],
 ['units','Unit converter','kPa ↔ mmHg, glucose, urea, creatinine, lactate, albumin, calcium, magnesium, phosphate, bilirubin, haemoglobin, alcohols, pH ↔ [H⁺].','swap'],
 ['pocket','Pocket card','The whole read, the rules, oxygen and the normals on one printable page.','pocket']];
/* a tool tile with a visible ⋯ that opens the same menu as a long press (Open, Copy link), so no action is hold-only (T27-11) */
const ui3Tile=(id,icon,name,d)=>'<div style="position:relative;display:flex;min-width:0"><button class="tile" data-tool="'+id+'" style="flex:1;padding-right:56px"><span class="mono-mark">'+icon+'</span><span><b>'+name+'</b><span class="d">'+d+'</span></span></button><button type="button" class="iconbtn kitmore" data-kitmore="#v-labs .tile[data-tool=&quot;'+id+'&quot;]" aria-label="More actions for '+esc(name)+'" aria-haspopup="dialog" style="position:absolute;top:6px;right:6px">⋯</button></div>';
RENDER.labs=function(){const el=$('v-labs');
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+TOOLS.length+' tools · '+MODELS.length+' models</span><h1>Labs</h1><p>Tools for the bedside and models to play with. Predict the result before you move a slider.</p></div></div>'+
 '<span class="eyebrow">Bedside tools</span><div class="tiles">'+TOOLS.map(t=>ui3Tile(t[0],ic(t[3]),t[1],t[2])).join('')+'</div>'+
 '<span class="eyebrow">Models</span><div class="tiles">'+MODELS.map(m=>ui3Tile('m-'+m[0],ic('lab'),m[1],m[2])).join('')+'<button class="tile" data-go="web"><span class="mono-mark">'+ic('web')+'</span><span><b>Concept web</b><span class="d">'+WEB_NODES.length+' ideas and '+WEB_EDGES.length+' labelled links.</span></span></button></div>';
 el.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>openTool(b.dataset.tool));};
let TOOL='interp';
function openTool(id){TOOL=id||'interp';go('tool',true,TOOL);setHash('tool-'+TOOL);}
RENDER.tool=function(id){if(id)TOOL=id;const el=$('v-tool');const t=TOOLS.find(x=>x[0]===TOOL),m=TOOL.startsWith('m-')&&MODELS.find(x=>x[0]===TOOL.slice(2));if(!t&&!m){TOOL='interp';return RENDER.tool();}
 const title=t?t[1]:m[1];
 el.innerHTML='<div class="crumbs"><button data-go="labs">← Labs</button><span class="eyebrow">'+(t?'Tool':'Model')+'</span></div><div class="view-head"><div class="ph"><h1>'+esc(title)+'</h1>'+(t&&TOOL!=='interp'?'<p>'+esc(t[2])+'</p>':'')+'</div></div><div id="toolBody"></div>';
 const b=$('toolBody');
 if(m){const g=document.createElement('div');g.className='labgrid one';b.appendChild(g);mountW(g,m[0]);dispatchEvent(new Event('buffer:show'));return;}
 (TOOLFN[TOOL]||(()=>{}))(b);};
/* D25 tool input helpers. tv(u,id,lo,hi,unit): decimal comma accepted, out-of-range or non-numeric -> null, field marked
   aria-invalid and a message queued in UI3T.bad. pv() does the same for pressures (limits in mmHg, shown in the user's unit). */
const UI3T={bad:[],mem:{}};
function ui3tLab(e){const l=e&&document.querySelector('label[for="'+e.id+'"] span');return l?l.textContent:'this value';}
function ui3tFlag(e,msg){if(e)e.setAttribute('aria-invalid','true');UI3T.bad.push(msg);}
function ui3tNum(s){s=String(s==null?'':s).trim().replace(/\s/g,'').replace(',','.');if(s==='')return null;const v=Number(s);return isFinite(v)?v:NaN;}
const tv=(u,id,lo,hi,un)=>{const e=$(u+id);if(!e)return null;e.removeAttribute('aria-invalid');const v=ui3tNum(e.value);if(v==null)return null;
 if(isNaN(v)){ui3tFlag(e,'Check '+ui3tLab(e)+': not a number.');return null;}
 if(lo!=null&&(v<lo||v>hi)){ui3tFlag(e,'Check '+ui3tLab(e)+': outside a plausible range ('+lo+'–'+hi+(un?' '+un:'')+').');return null;}return v;};
const ro=(u,id,lab,wide)=>'<div class="ro'+(wide?' wide':'')+'"><small>'+lab+'</small><b id="'+u+id+'">—</b></div>';
const pIn=(u,id,lab,mm)=>num(u+id,lab,S.units==='kPa'?(mm/KPA).toFixed(1):mm,S.units==='kPa'?0.1:1,PU());
const pv=(u,id,lo,hi)=>{const k=S.units==='kPa';const v=lo==null?tv(u,id):tv(u,id,k?r1(lo/KPA):lo,k?r1(hi/KPA):hi,PU());return v==null?null:k?v*KPA:v;};
/* run wrapper: blank every readout, run fn (returns the verdict text), show input problems instead of a verdict */
function ui3tRun(u,ids,fn){return ()=>{UI3T.bad=[];ids.forEach(i=>{const e=$(u+i);if(e){e.textContent='—';e.removeAttribute('title');}});let msg='';try{msg=fn()||'';}catch(err){msg='';}
 const v=$(u+'v');if(v){v.textContent=UI3T.bad.length?UI3T.bad.join(' '):msg;v.classList.toggle('ui3t-bad',UI3T.bad.length>0);}};}
function ui3tText(b){b.querySelectorAll('input[type=number]').forEach(i=>{i.type='text';i.inputMode='decimal';i.autocomplete='off';i.spellcheck=false;i.setAttribute('enterkeyhint','done');});}
function ui3tCSS(){if($('ui3tCSS'))return;const s=document.createElement('style');s.id='ui3tCSS';s.textContent=
 '#toolBody input[aria-invalid="true"]{border-color:var(--bad)!important;outline:2px solid var(--bad);outline-offset:-2px}.verdict-line.ui3t-bad{color:var(--bad)}.ui3t-nw{white-space:nowrap}.ui3t-acts{margin-top:10px}'+
 '.pocket .pk-title{display:none}.pocket .pk-src{grid-column:1/-1;font-size:.8rem;color:var(--muted);margin:0}.pocket>.btnrow{grid-column:1/-1}'+
 '@media print{.pocket{display:block!important;columns:2;column-gap:5mm;font-size:7.4pt;line-height:1.22;color:#000}'+
 '.pocket .pk-title{display:block!important;column-span:all;font-size:12pt;margin:0 0 2mm;padding-bottom:1mm;border-bottom:1.5pt solid #F26A1B}.pocket .pk-title small{font-size:7.5pt;font-weight:400;color:#444}'+
 '.pocket .pk-src{display:block!important;column-span:all;font-size:6.6pt;color:#333;margin-top:1mm}'+
 '.pocket .card{padding:1.6mm 2.2mm!important;margin:0 0 2mm!important;break-inside:avoid;background:#fff!important;color:#000!important}'+
 '.pocket .eyebrow{font-size:6.8pt!important;margin:0 0 .6mm!important;color:#000!important}.pocket .tbl{width:100%;border-collapse:collapse}'+
 '.pocket .tbl td,.pocket .tbl th{font-size:7pt!important;padding:.35mm 1mm!important;line-height:1.2;color:#000!important}.pocket ol,.pocket ul{margin:0!important;padding-left:4mm!important}.pocket li{margin:0!important;font-size:7.2pt}}';
 document.head.appendChild(s);
 /* A4 page size only while the pocket card is what prints (other printouts keep their own page setup) */
 addEventListener('beforeprint',()=>{const pk=document.querySelector('#v-tool .pocket');if(pk&&pk.offsetParent!==null&&!$('ui3tPage')){const p=document.createElement('style');p.id='ui3tPage';p.textContent='@page{size:A4 portrait;margin:8mm}';document.head.appendChild(p);}});
 addEventListener('afterprint',()=>{const p=$('ui3tPage');if(p)p.remove();});}
/* wire: text inputs (decimal comma), live verdict, remember inputs for this session, Copy result and Reset */
function wire(b,run){ui3tCSS();ui3tText(b);const key=TOOL,els=[...b.querySelectorAll('input,select')],m=UI3T.mem[key];
 if(m&&m.length===els.length)els.forEach((e,i)=>{e.value=m[i];});
 els.forEach(i=>i.addEventListener('input',()=>{UI3T.mem[key]=els.map(e=>e.value);run();}));
 const v=b.querySelector('.verdict-line');if(v){v.setAttribute('role','status');v.setAttribute('aria-live','polite');
  const r=document.createElement('div');r.className='btnrow ui3t-acts noprint';r.innerHTML='<button class="btn small" type="button">'+ic('copy')+'Copy result</button><button class="btn small ghost" type="button">'+ic('redo')+'Reset</button>';v.after(r);
  const bs=r.querySelectorAll('button');
  bs[0].onclick=()=>{const t=TOOLS.find(x=>x[0]===key);const ins=els.filter(e=>e.value!=='').map(e=>{const l=ui3tLab(e);return l+' '+(e.tagName==='SELECT'?e.options[e.selectedIndex].text:e.value);}).join(', ');
   const outs=[...b.querySelectorAll('.readout .ro')].map(x=>x.querySelector('small').textContent+' '+x.querySelector('b').textContent).filter(x=>!/—$/.test(x)).join(' · ');
   copyText((t?t[1]:'Buffer tool')+' ('+S.units+')\nIn: '+ins+'\nOut: '+outs+'\n'+v.textContent+'\nTeaching tool: check against local guidance.',bs[0]);};
  bs[1].onclick=()=>{delete UI3T.mem[key];RENDER.tool(key);};}
 run();}
const DEVICES=[['air','Room air',0.21],['nc1','Nasal cannula 1 L/min',0.24],['nc2','Nasal cannula 2 L/min',0.28],['nc3','Nasal cannula 3 L/min',0.32],['nc4','Nasal cannula 4 L/min',0.36],['nc5','Nasal cannula 5 L/min',0.40],['nc6','Nasal cannula 6 L/min',0.44],['sfm','Simple face mask 5–10 L/min (≈ 0.35–0.55)',0.45],['v24','Venturi 24%',0.24],['v28','Venturi 28%',0.28],['v31','Venturi 31%',0.31],['v35','Venturi 35%',0.35],['v40','Venturi 40%',0.40],['v60','Venturi 60%',0.60],['nrb','Non-rebreather 15 L/min (≈ 0.6–0.9)',0.80],['set','Set FiO₂ (HFNC, NIV, ventilator)',null]];
const TOOLFN={
 interp:b=>{renderInterp(b);},
 vbg:b=>{const u=uid();b.innerHTML='<div class="card wbox"><div class="ctrls">'+num(u+'ph','Venous pH',7.31,0.01,'')+pIn(u,'c','Venous PCO₂',52)+num(u+'h','Venous HCO₃⁻',25,0.1,'mmol/L')+num(u+'sp','SpO₂ (for oxygenation)',95,1,'%')+'<div class="ctrl"><label for="'+u+'sh"><span>Perfusion</span></label><select id="'+u+'sh"><option value="0">Warm and perfused</option><option value="1">Shock or poor perfusion</option></select></div></div><div class="readout">'+ro(u,'a','Arterial pH ≈')+ro(u,'b','PaCO₂ ≈')+ro(u,'d','HCO₃⁻ ≈')+ro(u,'r','Read',true)+'</div><p class="verdict-line" id="'+u+'v"></p></div><div class="card"><span class="eyebrow">Limits</span><ul class="tight"><li>pH (arterial ≈ venous + 0.02 to 0.04) and HCO₃⁻ (≈ 1 lower) agree well enough to manage most patients.</li><li>Venous PCO₂ averages about 4–6 mmHg higher, but the 95% limits are wide (about −20 to +30 mmHg; Byrne 2014). A normal PvCO₂ (≤ 45 mmHg'+(S.units==='kPa'?', 6.0 kPa':'')+') makes arterial hypercapnia unlikely; a high one needs an ABG if the exact value matters.</li><li>In shock, cardiac arrest and poor perfusion the gap widens unpredictably: do not convert.</li><li>Venous PO₂ says nothing about the lungs. Use SpO₂, or an ABG when oxygenation must be exact.</li></ul></div>';
  wire(b,ui3tRun(u,['a','b','d','r'],()=>{const ph=tv(u,'ph',6.5,8),c=pv(u,'c',5,200),h=tv(u,'h',1,70,'mmol/L'),sh=$(u+'sh').value==='1',sp=tv(u,'sp',50,100,'%');if(UI3T.bad.length)return;
   if(ph==null||c==null)return 'Enter at least venous pH and PCO₂.';
   const hh=h==null?hFrom(ph,c):h;const o=interp({sample:'v',pH:ph,pco2:c,hco3:hh});$(u+'r').textContent=o.err?'—':o.label;
   const w=[],lim=P(45)+' '+PU();
   if(sh){['a','b','d'].forEach(i=>{$(u+i).textContent='not reliable';});w.push('Shock or poor perfusion: venous-to-arterial conversion is not reliable. Take an ABG if CO₂ or acid–base decides management.');}
   else{const A={pH:r2(ph+0.03),pco2:Math.max(10,c-5),hco3:r1(hh-1)};$(u+'a').textContent=A.pH.toFixed(2);$(u+'b').textContent=P(A.pco2)+' '+PU();$(u+'d').textContent=A.hco3.toFixed(1)+' mmol/L'+(h==null?' (calc.)':'');}
   w.push(c<=45?'PvCO₂ ≤ '+lim+': arterial hypercapnia is unlikely.':'PvCO₂ > '+lim+': possible hypercapnia; take an ABG if it changes management.');
   if(sp!=null)w.push(sp<94?'SpO₂ '+sp+'%: below the usual 94–98% target (88–92% if at risk of hypercapnia). Judge oxygenation by SpO₂ or an ABG, not the VBG.':sp>98?'SpO₂ '+sp+'%: above the 94–98% target; if on oxygen, consider weaning it.':'SpO₂ '+sp+'%: within the usual 94–98% target (88–92% if at risk of hypercapnia).');
   return w.join(' ');}));},
 oxy:b=>{const u=uid();b.innerHTML='<div class="card wbox"><div class="ctrls"><div class="ctrl"><label for="'+u+'dv"><span>Oxygen</span></label><select id="'+u+'dv">'+DEVICES.map(d=>'<option value="'+d[0]+'">'+d[1]+'</option>').join('')+'</select></div>'+num(u+'f','FiO₂',0.21,0.01,'')+pIn(u,'o','PaO₂',68)+pIn(u,'c','PaCO₂',34)+num(u+'sp','SpO₂',94,1,'%')+num(u+'age','Age',60,1,'years')+'<div class="ctrl"><label for="'+u+'pa"><span>Altitude</span></label><select id="'+u+'pa"><option value="760">Sea level (760 mmHg)</option><option value="707">Riyadh ≈ 610 m (707 mmHg)</option><option value="580">Abha ≈ 2,270 m (580 mmHg)</option></select></div></div><div class="readout">'+ro(u,'A','PAO₂')+ro(u,'g','A–a')+ro(u,'e','Expected A–a (age ÷ 4 + 4, +5 leeway)',true)+ro(u,'pf','P/F')+ro(u,'sf','S/F')+'</div><p class="verdict-line" id="'+u+'v"></p></div><div class="card"><span class="eyebrow">Notes</span><ul class="tight"><li>FiO₂ for nasal cannula and masks is an estimate; it falls as the patient breathes faster and deeper. FiO₂ can be typed as a fraction (0.40) or a percentage (40).</li><li>The A–a gradient is validated on room air. On oxygen, use P/F.</li><li>S/F works only while SpO₂ ≤ 97% (the curve is flat above). S/F 315 ≈ P/F 300, 235 ≈ 200 (Rice 2007).</li><li>Berlin ARDS (2012): P/F ≤ 300 mild, ≤ 200 moderate, ≤ 100 severe mmHg (40, 26.7, 13.3 kPa), with PEEP ≥ 5.</li><li>Global ARDS definition (2023; Matthay 2024): P/F ≤ 300 or S/F ≤ 315 with SpO₂ ≤ 97%, on HFNC ≥ 30 L/min, NIV or CPAP with PEEP ≥ 5, or ventilated.</li></ul></div>';
  $(u+'pa').value=String(S.patm||760);
  $(u+'dv').addEventListener('change',()=>{const d=DEVICES.find(x=>x[0]===$(u+'dv').value);if(d&&d[2]!=null){$(u+'f').value=d[2];}$(u+'f').dispatchEvent(new Event('input'));});
  $(u+'f').addEventListener('input',e=>{if(e.isTrusted)$(u+'dv').value='set';});
  wire(b,ui3tRun(u,['A','g','e','pf','sf'],()=>{const fr=tv(u,'f'),o=pv(u,'o',10,700),c=pv(u,'c',5,200),sp=tv(u,'sp',50,100,'%'),age=tv(u,'age',0,120,'years'),pa=+$(u+'pa').value,kp=S.units==='kPa';
   let f=fr;if(fr!=null&&fr>=21&&fr<=100)f=fr/100;
   if(fr!=null&&!(f>=0.21&&f<=1))ui3tFlag($(u+'f'),'Check FiO₂: type a fraction (0.21–1.0) or a percentage (21–100).');
   if(UI3T.bad.length)return;if(f==null)return 'Enter FiO₂ or choose an oxygen device.';
   const air=f<0.215,A=f*(pa-47)-(c==null?40:c)/0.8;$(u+'A').textContent=P(A)+' '+PU()+(c==null?' (PaCO₂ '+P(40)+' assumed)':'');
   const exp=age==null?null:age/4+4;$(u+'e').textContent=exp==null?'enter age':'≤ '+P(exp+5)+' '+PU();
   const g=o==null?null:A-o;$(u+'g').textContent=g==null?'—':air?P(g)+' '+PU():'on O₂: use P/F';
   const pf=o==null?null:o/f,pfs=pf==null?'':kp?r1(pf/KPA)+' kPa':Math.round(pf)+' mmHg';$(u+'pf').textContent=pf==null?'—':pfs;
   const sf=sp!=null&&sp<=97?sp/f:null;$(u+'sf').textContent=sf==null?(sp!=null?'SpO₂ > 97%: not valid':'—'):String(Math.round(sf));
   const v=[];if(f!==fr)v.push('FiO₂ read as '+f.toFixed(2)+'.');if(c==null)v.push('PaCO₂ not given: PAO₂ assumes '+P(40)+' '+PU()+'.');
   if(o==null&&sp==null){v.push('Enter PaO₂ or SpO₂.');return v.join(' ');}
   const n0=v.length;
   if(o!=null){if(air){if(g<-5)v.push('Negative A–a: impossible. Check FiO₂, altitude, units and the sample (venous? air bubble?).');
     else if(exp==null)v.push((o<60?'Low PaO₂. ':'')+'Enter age to judge the A–a gradient.');
     else v.push(g>exp+5?'A–a raised for age: a lung problem (V/Q mismatch, shunt or diffusion).':o<60?'Low PaO₂ with a normal A–a: hypoventilation or low inspired O₂.':'A–a normal for age.');}
    else if(o<60)v.push('PaO₂ below '+P(60)+' '+PU()+' on oxygen: hypoxaemic respiratory failure range.');
    if(pf<=300)v.push('P/F '+pfs+(pf<=100?': severe range':pf<=200?': moderate range':': mild range')+' (Berlin '+(kp?'40 / 26.7 / 13.3 kPa':'300 / 200 / 100 mmHg')+'; needs PEEP ≥ 5 and the other criteria).');}
   if(sf!=null&&sf<=315)v.push('S/F '+Math.round(sf)+(sf<=235?' ≈ P/F ≤ 200':' ≈ P/F ≤ 300')+' (meets the 2023 global ARDS oxygenation threshold if the other criteria fit).');
   if(sp!=null&&sp<94)v.push('SpO₂ '+sp+'%: below the usual 94–98% target (88–92% if at risk of hypercapnia).');
   if(v.length===n0)v.push('No oxygenation problem in the values entered.');return v.join(' ');}));},
 urine:b=>{const u=uid();b.innerHTML='<div class="card wbox"><div class="ctrls">'+num(u+'na','Urine Na⁺',40,1,'mmol/L')+num(u+'k','Urine K⁺',30,1,'mmol/L')+num(u+'cl','Urine Cl⁻',90,1,'mmol/L')+num(u+'ur','Urine urea',150,1,'mmol/L')+num(u+'gl','Urine glucose',0,0.1,'mmol/L')+num(u+'os','Measured urine osm',480,1,'mOsm/kg')+num(u+'ph','Urine pH (optional)','',0.1,'')+num(u+'pk','Plasma K⁺ (optional)','',0.1,'mmol/L')+'</div><div class="readout">'+ro(u,'ag','Urine AG')+ro(u,'co','Calc. U-osm')+ro(u,'og','U-osmolal gap')+ro(u,'nh','NH₄⁺ ≈')+'</div><p class="verdict-line" id="'+u+'v"></p></div><div class="card"><span class="eyebrow">How to use it</span><ul class="tight"><li>Only for a normal-gap (hyperchloraemic) metabolic acidosis.</li><li>Urine AG = Na + K − Cl. Negative ("neGUTive"): the kidney is excreting ammonium, so the loss is from the gut or a drip. Positive: the kidney cannot (distal RTA, type 4).</li><li>The urine AG fails with ketones, hippurate (toluene), D-lactate, penicillins, or urine Na⁺ under ≈ 20. Then use the urine osmolal gap: NH₄⁺ ≈ gap ÷ 2; under ≈ 150 mOsm/kg in an acidosis points to the kidney failing to excrete acid.</li><li>A urine AG between −10 and +10 is borderline and decides nothing.</li><li>Urine pH &gt; 5.5 in a systemic acidosis suggests distal (type 1) RTA; type 4 has high K⁺ and urine pH ≤ 5.5. Urine pH &gt; 6.5 means bicarbonate in the urine, which makes the urine AG unreliable.</li></ul></div>';
  wire(b,ui3tRun(u,['ag','co','og','nh'],()=>{const L=[0,400,'mmol/L'],na=tv(u,'na',...L),k=tv(u,'k',...L),cl=tv(u,'cl',...L),ur=tv(u,'ur',0,1500,'mmol/L'),gl=tv(u,'gl',0,150,'mmol/L')||0,os=tv(u,'os',30,1500,'mOsm/kg'),uph=tv(u,'ph',4.5,8.5),pk=tv(u,'pk',1.5,9,'mmol/L');if(UI3T.bad.length)return;
   const ag=na!=null&&k!=null&&cl!=null?na+k-cl:null;$(u+'ag').textContent=ag==null?'—':r1(ag)+' mmol/L';
   const co=na!=null&&k!=null&&ur!=null?2*(na+k)+ur+gl:null;$(u+'co').textContent=co==null?'—':Math.round(co)+' mOsm/kg';const og=co!=null&&os!=null?os-co:null;$(u+'og').textContent=og==null?'—':Math.round(og)+' mOsm/kg';$(u+'nh').textContent=og==null?'—':Math.max(0,Math.round(og/2))+' mmol/L';
   if(ag==null&&og==null)return 'Enter urine Na⁺, K⁺ and Cl⁻ for the urine AG; add urea, glucose and measured osmolality for the osmolal gap.';
   const v=[],why=[];if(na!=null&&na<20)why.push('urine Na⁺ < 20');if(uph!=null&&uph>6.5)why.push('urine pH > 6.5 (bicarbonate in the urine)');
   if(ag!=null){if(why.length)v.push('The urine AG is unreliable here ('+why.join(', ')+'): use the osmolal gap.');
    else if(ag< -10)v.push('Negative urine AG: appropriate ammonium excretion (gut loss or chloride load).');
    else if(ag<=10)v.push('Urine AG borderline (−10 to +10): it does not decide; use the urine osmolal gap.');
    else if(og!=null&&og>=150)v.push('Positive urine AG but osmolal gap ≥ 150: unmeasured anions (ketones, hippurate, D-lactate) are likely. Trust the osmolal gap.');
    else v.push('Positive urine AG: low ammonium excretion (distal or type 4 RTA, renal failure) unless other anions are present.');}
   if(og!=null)v.push(og>=150?'Osmolal gap ≥ 150 (often 300–400): ammonium excretion is appropriate, so look outside the kidney.':'Osmolal gap < 150: ammonium excretion is low for an acidosis (renal cause).');
   if(uph!=null){if(uph>5.5&&(pk==null||pk<=5.5))v.push('Urine pH '+uph+' (> 5.5) despite acidosis: fits distal (type 1) RTA'+(pk!=null&&pk<3.5?', especially with low K⁺':'')+'.');
    else if(uph<=5.5&&pk!=null&&pk>5.5)v.push('Urine pH ≤ 5.5 with high K⁺: fits type 4 RTA (low aldosterone effect).');
    else if(uph<=5.5)v.push('Urine pH ≤ 5.5: the kidney can acidify; distal RTA unlikely (proximal RTA acidifies once bicarbonate is low).');}
   return v.join(' ');}));},
 hh:b=>{const u=uid();b.innerHTML='<div class="card wbox"><div class="ctrls">'+num(u+'ph','pH',7.32,0.01,'')+pIn(u,'c','PCO₂',30)+num(u+'h','HCO₃⁻ (reported)',15,0.1,'mmol/L')+'</div><div class="readout">'+ro(u,'a','[H⁺] from pH')+ro(u,'b','24 × PCO₂ (mmHg) ÷ HCO₃⁻')+ro(u,'d','Difference')+ro(u,'e','HCO₃⁻ that fits')+'</div><p class="verdict-line" id="'+u+'v"></p></div><div class="card"><span class="eyebrow">Why check</span><p class="note">The analyser measures pH and PCO₂ and calculates HCO₃⁻. If the three do not fit, the numbers were copied wrongly, come from different samples, or a laboratory total CO₂ (venous chemistry) was mixed with a gas pH. Between pH 7.20 and 7.50, [H⁺] ≈ 80 − the two decimals.</p></div>';
  wire(b,ui3tRun(u,['a','b','d','e'],()=>{const ph=tv(u,'ph',6.5,8),c=pv(u,'c',5,200),h=tv(u,'h',1,70,'mmol/L');if(UI3T.bad.length)return;if(ph==null||c==null)return 'Enter pH and PCO₂.';
   const a=Math.pow(10,9-ph),fit=hFrom(ph,c);$(u+'a').textContent=r1(a)+' nmol/L';$(u+'e').textContent=r1(fit)+' mmol/L';
   if(h==null)return 'Enter the reported HCO₃⁻ to check the fit. With this pH and PCO₂ it should be about '+r1(fit)+' mmol/L.';
   const bb=24*c/h,d=(bb-a)/a*100;$(u+'b').textContent=r1(bb)+' nmol/L';$(u+'d').textContent=Math.abs(d)<0.5?'0%':(d>0?'+':'')+Math.round(d)+'%';
   return Math.abs(d)<=10?'Consistent: these values belong together.':'Inconsistent by more than 10%: recheck the numbers before interpreting.';}));},
 vent:b=>{const u=uid();b.innerHTML='<div class="card wbox"><div class="ctrls">'+num(u+'rr','Current rate',16,1,'/min')+num(u+'vt','Current tidal volume',450,10,'mL')+pIn(u,'c','Current PaCO₂',60)+pIn(u,'t','Target PaCO₂',45)+num(u+'ds','Dead space (approx.)',150,10,'mL')+num(u+'ht','Height',170,1,'cm')+'<div class="ctrl"><label for="'+u+'sx"><span>Sex (for predicted weight)</span></label><select id="'+u+'sx"><option value="m">Male</option><option value="f">Female</option></select></div></div><div class="readout">'+ro(u,'r','New rate')+ro(u,'nv','or new VT')+ro(u,'m','Minute vent. now')+ro(u,'n','Minute vent. at new rate')+ro(u,'n2','Minute vent. at new VT')+ro(u,'pb','VT per kg PBW (now → new VT)')+'</div><p class="verdict-line" id="'+u+'v"></p></div><div class="card"><span class="eyebrow">Assumptions</span><ul class="tight"><li>PaCO₂ ∝ CO₂ production ÷ alveolar ventilation, with CO₂ production and dead space unchanged.</li><li>New rate = rate × PaCO₂ ÷ target, using alveolar ventilation = (VT − dead space) × rate.</li><li>Keep VT 6–8 mL/kg predicted body weight (PBW); raise the rate first. PBW (ARDSNet): men 50 + 0.91 × (height cm − 152.4), women 45.5 + 0.91 × (height cm − 152.4). Watch for gas trapping (auto-PEEP) at high rates in asthma and COPD.</li><li>In a chronic retainer, target their usual PaCO₂ (or pH 7.35–7.40), not 40. In metabolic acidosis, match the compensation they were achieving.</li><li>Recheck a gas 15–30 minutes after any change.</li></ul></div>';
  wire(b,ui3tRun(u,['r','nv','m','n','n2','pb'],()=>{const rr=tv(u,'rr',4,60,'/min'),vt=tv(u,'vt',100,1500,'mL'),c=pv(u,'c',5,200),t=pv(u,'t',5,200),ds=tv(u,'ds',0,500,'mL'),ht=tv(u,'ht',120,230,'cm'),sx=$(u+'sx').value;if(UI3T.bad.length)return;
   if(rr==null||vt==null||c==null||t==null)return 'Enter rate, tidal volume, current and target PaCO₂.';if(ds==null)return 'Enter dead space (about 2 mL/kg, often 150 mL).';if(vt<=ds)return 'Dead space must be smaller than the tidal volume.';
   const va=(vt-ds)*rr/1000,need=va*c/t;const nr=need*1000/(vt-ds),nv=need*1000/rr+ds;const pbw=ht==null?null:(sx==='f'?45.5:50)+0.91*(ht-152.4);
   $(u+'r').textContent=Math.round(nr)+' /min';$(u+'nv').textContent=Math.round(nv)+' mL';$(u+'m').textContent=r1(vt*rr/1000)+' L/min';$(u+'n').textContent=r1(nr*vt/1000)+' L/min';$(u+'n2').textContent=r1(nv*rr/1000)+' L/min';
   $(u+'pb').textContent=pbw==null?'enter height':r1(vt/pbw)+' → '+r1(nv/pbw)+' mL/kg';
   const w=[];if(nr>35)w.push('A rate above 35 is rarely practical; check for gas trapping and consider VT or dead space (filters, tubing).');
   if(pbw!=null){if(vt/pbw>8)w.push('Current VT is '+r1(vt/pbw)+' mL/kg PBW: above the 6–8 mL/kg lung-protective range.');if(nv/pbw>8)w.push('The new VT would be '+r1(nv/pbw)+' mL/kg PBW (PBW '+Math.round(pbw)+' kg): too high, raise the rate instead.');}
   else if(nv>560)w.push('That tidal volume is above 8 mL/kg for a 70 kg PBW; enter height to check.');
   w.push('Change one setting, then recheck.');return w.join(' ');}));},
 bicarb:b=>{const u=uid();b.innerHTML='<div class="card wbox"><div class="ctrls">'+num(u+'w','Weight',70,1,'kg')+num(u+'h','HCO₃⁻',8,0.1,'mmol/L')+num(u+'t','Target HCO₃⁻',15,1,'mmol/L')+num(u+'na','Measured Na⁺',128,1,'mmol/L')+num(u+'g','Glucose',35,0.1,'mmol/L')+num(u+'ph','pH (optional)',7.05,0.01,'')+num(u+'pk','K⁺ (optional)','',0.1,'mmol/L')+'</div><div class="readout">'+ro(u,'d','HCO₃⁻ deficit (0.5 L/kg)')+ro(u,'dv','Deficit (0.4 + 2.6 ÷ HCO₃⁻ L/kg)')+ro(u,'hf','Give half (of 0.5 L/kg) ≈')+ro(u,'ml','As 8.4% (1 mmol/mL)')+ro(u,'iso','or 1.26% (150 mmol/L)')+ro(u,'k','Na⁺ corrected (Katz)')+ro(u,'l','Na⁺ corrected (Hillier)')+'</div><p class="verdict-line" id="'+u+'v"></p></div><div class="card"><span class="eyebrow">Before you give bicarbonate</span><ul class="tight"><li>Not routine in DKA or lactic acidosis: no outcome benefit, and it lowers potassium and ionised calcium and raises CO₂. In DKA the 2024 ADA/EASD/JBDS consensus reserves it for pH &lt; 7.0.</li><li>Reasonable: normal-gap acidosis with bicarbonate loss, severe acidaemia (pH ≤ 7.20) with moderate–severe AKI (AKIN 2–3; BICAR-ICU 2018, subgroup), hyperkalaemia with acidosis, tricyclic or sodium-channel blocker toxicity, salicylate (urine alkalinisation).</li><li>Correct potassium first if it is low: bicarbonate drives K⁺ into cells.</li><li>The patient must be able to breathe off the extra CO₂: each 50 mmol of HCO₃⁻ makes about 1.1 L of CO₂.</li><li>Deficit = 0.5 × weight × (target − current). The distribution space grows as HCO₃⁻ falls (about 0.4 + 2.6 ÷ HCO₃⁻ L/kg; Fernandez 1989); give half and recheck.</li><li>8.4% sodium bicarbonate = 1 mmol/mL; 1.26% isotonic = 150 mmol/L.</li><li>Corrected Na⁺ adds 1.6 (Katz) or 2.4 (Hillier) per 5.6 mmol/L of glucose above 5.6.</li></ul></div>';
  wire(b,ui3tRun(u,['d','dv','hf','ml','iso','k','l'],()=>{const w=tv(u,'w',1,300,'kg'),h=tv(u,'h',1,70,'mmol/L'),t=tv(u,'t',1,70,'mmol/L'),na=tv(u,'na',100,190,'mmol/L'),g=tv(u,'g',0,150,'mmol/L'),ph=tv(u,'ph',6.5,8),pk=tv(u,'pk',1.5,9,'mmol/L');if(UI3T.bad.length)return;
   const v=[];
   if(w!=null&&h!=null&&t!=null){if(h>=t){['d','dv','hf'].forEach(i=>{$(u+i).textContent='no deficit';});v.push('No deficit at this target.');}
    else{const d=0.5*w*(t-h),dv=(0.4+2.6/h)*w*(t-h),hf=Math.round(d/2);$(u+'d').textContent=Math.round(d)+' mmol';$(u+'dv').textContent=Math.round(dv)+' mmol';$(u+'hf').textContent=hf+' mmol';$(u+'ml').textContent=hf+' mL';$(u+'iso').textContent=Math.round(hf/150*1000)+' mL';
     if(ph!=null&&ph>=7.2)v.push('pH '+ph.toFixed(2)+' (≥ 7.20): bicarbonate is rarely indicated.');if(pk!=null&&pk<3.5)v.push('K⁺ '+pk+': correct potassium before any bicarbonate.');}}
   else v.push('Enter weight, HCO₃⁻ and target for the deficit.');
   if(na!=null&&g!=null){const ex=Math.max(0,g-5.6)/5.6,K=r1(na+1.6*ex),H=r1(na+2.4*ex);$(u+'k').textContent=K+' mmol/L';$(u+'l').textContent=H+' mmol/L';
    if(g<=5.6)v.push('Glucose not raised: no sodium correction needed.'+(na<135?' Measured Na⁺ '+na+': true hyponatraemia.':na>145?' Measured Na⁺ '+na+': hypernatraemia.':''));
    else if(na<135){if(K>=135)v.push('Low measured Na⁺ is explained by glucose (corrected '+K+' Katz, '+H+' Hillier): translocational hyponatraemia.');else if(H>=135)v.push('Low measured Na⁺ is partly from glucose: corrected '+K+' (Katz) to '+H+' (Hillier); the formulas disagree, so recheck as glucose falls.');else v.push('True hyponatraemia even after correcting for glucose (corrected '+K+' Katz, '+H+' Hillier).');}
    else if(H>145){v.push(K>145?'Corrected Na⁺ is high ('+K+' Katz, '+H+' Hillier): a real free-water deficit. Measured Na⁺ will rise as glucose falls; aim for a slow fall in osmolality (JBDS HHS: 3–8 mOsm/kg/h).':'Corrected Na⁺ is high by Hillier ('+H+') but not by Katz ('+K+'): watch for a free-water deficit as glucose falls.');}
    else v.push('Corrected Na⁺ in range ('+K+' Katz, '+H+' Hillier).');}
   else v.push('Enter Na⁺ and glucose for corrected sodium.');
   return v.join(' ');}));},
 units:b=>{const u=uid();const U=[['p','Pressure','kPa','mmHg',7.50062],['g','Glucose','mmol/L','mg/dL',18.016],['ur','Urea / BUN','urea mmol/L','BUN mg/dL',2.801],['cr','Creatinine','µmol/L','mg/dL',1/88.42],['la','Lactate','mmol/L','mg/dL',9.008],['al','Albumin','g/L','g/dL',0.1],['ca','Calcium','mmol/L','mg/dL',4.008],['mg','Magnesium','mmol/L','mg/dL',2.431],['po','Phosphate','mmol/L','mg/dL',3.097],['bi','Bilirubin','µmol/L','mg/dL',1/17.1],['hb','Haemoglobin','g/dL','g/L',10],['et','Ethanol','mmol/L','mg/dL',4.607],['me','Methanol','mmol/L','mg/dL',3.204],['eg','Ethylene glycol','mmol/L','mg/dL',6.207]];
  b.innerHTML='<div class="card wbox"><div class="ucv">'+U.map(x=>'<div class="urow"><b>'+x[1]+'</b>'+num(u+x[0]+'a',x[2],'',0.01,'')+'<span class="eq">⇄</span>'+num(u+x[0]+'b',x[3],'',0.01,'')+'</div>').join('')+'<div class="urow"><b>pH ⇄ [H⁺]</b>'+num(u+'pha','pH','',0.01,'')+'<span class="eq">⇄</span>'+num(u+'phb','nmol/L','',1,'')+'</div></div><p class="note">Type in either box; a decimal comma works. Urea conversion uses BUN (mg/dL) = urea (mmol/L) × 2.8. Alcohols in mmol/L add straight to the calculated osmolality (osmolar gap).</p><p class="verdict-line" id="'+u+'v"></p></div>';
  ui3tCSS();ui3tText(b);const vl=$(u+'v');vl.setAttribute('role','status');vl.setAttribute('aria-live','polite');
  const fx=v=>Math.abs(v)>=100?String(Math.round(v*10)/10):String(Math.round(v*100)/100);
  /* read one box: null if blank, NaN (and marked) if not a usable number */
  const rd=(e,lo,hi)=>{e.removeAttribute('aria-invalid');const v=ui3tNum(e.value);if(v==null)return null;if(isNaN(v)||v<lo||v>hi){e.setAttribute('aria-invalid','true');return NaN;}return v;};
  const say=(e,lab,lo,hi)=>{vl.textContent=e.getAttribute('aria-invalid')?'Check '+lab+': type a number from '+lo+' to '+hi+'.':'';};
  U.forEach(x=>{const a=$(u+x[0]+'a'),c=$(u+x[0]+'b');const hiA=x[0]==='p'?100:5000;
   a.oninput=()=>{c.removeAttribute('aria-invalid');const v=rd(a,0,hiA);c.value=v==null||isNaN(v)?'':fx(v*x[4]);say(a,x[1]+' ('+x[2]+')',0,hiA);};
   c.oninput=()=>{a.removeAttribute('aria-invalid');const v=rd(c,0,hiA*x[4]);a.value=v==null||isNaN(v)?'':fx(v/x[4]);say(c,x[1]+' ('+x[3]+')',0,fx(hiA*x[4]));};});
  const pa=$(u+'pha'),pb=$(u+'phb');
  pa.oninput=()=>{pb.removeAttribute('aria-invalid');const v=rd(pa,6.5,8);pb.value=v==null||isNaN(v)?'':Math.round(Math.pow(10,9-v));say(pa,'pH',6.5,8);};
  pb.oninput=()=>{pa.removeAttribute('aria-invalid');const v=rd(pb,10,316);pa.value=v==null||isNaN(v)?'':(9-Math.log10(v)).toFixed(2);say(pb,'[H⁺]',10,316);};},
 pocket:b=>{ui3tCSS();b.innerHTML=POCKET();const p=$('pkPrint');if(p)p.onclick=()=>window.print();}
};
function POCKET(){const U=PU(),pp=v=>P(v)+' '+U,rg=(a,b)=>P(a)+'–'+P(b)+' '+U,kp=S.units==='kPa',nw=t=>'<span class="ui3t-nw">'+t+'</span>',dt=new Date(),dd=String(dt.getDate()).padStart(2,'0')+'/'+String(dt.getMonth()+1).padStart(2,'0')+'/'+dt.getFullYear();return '<div class="pocket"><h2 class="pk-title">Buffer · blood gas pocket card <small>'+U+' · '+(S.patm||760)+' mmHg barometric · printed '+dd+' · teaching aid, check local guidance</small></h2>'+
 '<div class="card"><span class="eyebrow">The read · six questions</span><ol class="tight"><li><b>Real?</b> '+nw('[H⁺] = 24 × PCO₂ (mmHg) ÷ HCO₃⁻')+(kp?' = '+nw('180 × PCO₂ (kPa) ÷ HCO₃⁻'):'')+' ≈ '+nw('10^(9 − pH)')+'. Arterial or venous?</li><li><b>pH:</b> acidaemia &lt; 7.35, alkalaemia &gt; 7.45.</li><li><b>Primary:</b> which of PCO₂ and HCO₃⁻ explains the pH?</li><li><b>Compensation:</b> inside the expected band? Outside = second disorder.</li><li><b>Gap:</b> AG (albumin-corrected); if high, Δ ratio and osmolar gap.</li><li><b>Oxygen:</b> A–a on air, P/F on oxygen. Never PvO₂.</li></ol></div>'+
 '<div class="card"><span class="eyebrow">Expected compensation</span><table class="tbl"><tr><th>Primary</th><th>Expected</th></tr><tr><td>Metabolic acidosis</td><td class="mono">PCO₂ (mmHg) = 1.5 × HCO₃⁻ + 8 ± 2'+(kp?'<br>PCO₂ (kPa) = 0.2 × HCO₃⁻ + 1.1 ± 0.3':'')+'</td></tr><tr><td>Metabolic alkalosis</td><td class="mono">PCO₂ (mmHg) = 0.7 × HCO₃⁻ + 20 ± 5'+(kp?'<br>PCO₂ (kPa) = 0.09 × HCO₃⁻ + 2.7 ± 0.7':'')+'</td></tr><tr><td>Resp. acidosis</td><td class="mono">HCO₃⁻ +1 acute / +4 chronic per 10 mmHg (1.3 kPa) PCO₂ rise</td></tr><tr><td>Resp. alkalosis</td><td class="mono">HCO₃⁻ −2 acute / −5 chronic per 10 mmHg (1.3 kPa) PCO₂ fall</td></tr></table></div>'+
 '<div class="card"><span class="eyebrow">Gaps</span><table class="tbl"><tr><td>Anion gap</td><td class="mono">Na − (Cl + HCO₃⁻); ref '+(S.agref||12)+'</td></tr><tr><td>Albumin</td><td class="mono">+ 0.25 × (40 − alb g/L)</td></tr><tr><td>Δ ratio</td><td class="mono">(AG − '+(S.agref||12)+') ÷ (24 − HCO₃⁻): &lt; 0.8 + NAGMA, &gt; 2 + alkalosis</td></tr><tr><td>Osmolar gap</td><td class="mono">measured − (2Na + glu + urea [+ ethanol]) &gt; 10</td></tr><tr><td>Urine AG</td><td class="mono">Na + K − Cl: negative = gut</td></tr></table></div>'+
 '<div class="card"><span class="eyebrow">Causes</span><table class="tbl"><tr><td>HAGMA · GOLDMARK</td><td>Glycols, Oxoproline, L-lactate, D-lactate, Methanol, Aspirin, Renal failure, Ketones</td></tr><tr><td>NAGMA</td><td>Diarrhoea, fistula or ileostomy, RTA, acetazolamide, saline, ureteric diversion, recovering DKA</td></tr><tr><td>Metabolic alkalosis</td><td>Urine Cl &lt; 20: vomiting, NG drainage, diuretics (late), post-hypercapnia. Urine Cl &gt; 20: diuretics (current), hyperaldosteronism, severe hypokalaemia</td></tr><tr><td>Resp. acidosis</td><td>Won\'t breathe (drugs, CNS), can\'t breathe (muscles, chest wall), can\'t get it out (COPD, asthma)</td></tr><tr><td>Resp. alkalosis</td><td>Hypoxaemia, PE, sepsis, salicylate, liver failure, pregnancy, pain, anxiety (last)</td></tr></table></div>'+
 '<div class="card"><span class="eyebrow">Normal values</span><table class="tbl"><tr><td>pH</td><td class="mono">7.35–7.45 · [H⁺] 35–45 nmol/L</td></tr><tr><td>PaCO₂</td><td class="mono">'+rg(35,45)+'</td></tr><tr><td>PaO₂ (air, sea level)</td><td class="mono">'+rg(80,100)+'</td></tr><tr><td>HCO₃⁻</td><td class="mono">22–26 mmol/L</td></tr><tr><td>Base excess</td><td class="mono">−2 to +2 mmol/L</td></tr><tr><td>Lactate</td><td class="mono">&lt; 2 mmol/L</td></tr><tr><td>Venous → arterial</td><td class="mono">pH +0.03 · PCO₂ −5 mmHg'+(kp?' (−0.7 kPa)':'')+' · HCO₃⁻ −1</td></tr><tr><td>Expected A–a (air)</td><td class="mono">≤ age ÷ 4 + 4 mmHg'+(kp?' (÷ 7.5 for kPa)':'')+'; tools add +5 leeway</td></tr><tr><td>PAO₂</td><td class="mono">'+(kp?'FiO₂ × ('+r1((S.patm||760)/KPA)+' − 6.3) − PaCO₂ ÷ 0.8 (kPa)':'FiO₂ × ('+(S.patm||760)+' − 47) − PaCO₂ ÷ 0.8 (mmHg)')+'</td></tr></table></div>'+
 '<div class="card"><span class="eyebrow">Oxygen</span><table class="tbl"><tr><td>SpO₂ target</td><td>94–98% for most; 88–92% if at risk of hypercapnic failure (BTS 2017)</td></tr><tr><td>P/F (Berlin)</td><td class="mono">≤ 300 / 200 / 100 mmHg (40 / 26.7 / 13.3 kPa) with PEEP ≥ 5</td></tr><tr><td>S/F</td><td class="mono">≤ 315 ≈ P/F 300 (only if SpO₂ ≤ 97%; global ARDS 2023)</td></tr><tr><td>FiO₂ by device</td><td>Nasal cannula ≈ 0.21 + 0.04 per L/min (1–6 L) · simple mask 0.35–0.55 · non-rebreather 0.6–0.9 · Venturi as labelled</td></tr></table></div>'+
 '<div class="card"><span class="eyebrow">Shift numbers</span><table class="tbl"><tr><td>Lactate</td><td>≥ 2 raised · ≥ 4 high risk in sepsis</td></tr><tr><td>DKA (2024 consensus)</td><td>Glucose ≥ 11.1 mmol/L or known diabetes · ketones ≥ 3.0 mmol/L · pH &lt; 7.30 and/or HCO₃⁻ &lt; 18</td></tr><tr><td>HHS (2024 consensus)</td><td>Glucose ≥ 33.3 mmol/L · effective osmolality &gt; 300 · ketones &lt; 3.0 · pH ≥ 7.30 · HCO₃⁻ ≥ 15</td></tr><tr><td>Salicylate</td><td>Respiratory alkalosis + HAGMA together</td></tr><tr><td>Toxic alcohol</td><td>HAGMA + osmolar gap &gt; 10 (the gap closes as the alcohol is metabolised)</td></tr><tr><td>K⁺ and pH</td><td>K⁺ rises ≈ 0.6 mmol/L per 0.1 fall in pH in mineral acidosis; little in organic acidosis</td></tr><tr><td>Bicarbonate</td><td>8.4% = 1 mmol/mL · 1.26% = 150 mmol/L</td></tr></table></div>'+
 '<p class="pk-src">Rules: Berend, de Vries and Gans, NEJM 2014 (physiological approach); Boston rules (Narins and Emmett 1980); Berlin ARDS 2012; global ARDS definition (Matthay 2024); BTS oxygen guideline 2017; ADA/EASD/JBDS hyperglycaemic crises consensus 2024; Adrogué and Madias 1981 (K⁺ and pH).</p>'+
 '<div class="btnrow noprint"><button class="btn" id="pkPrint">'+ic('print')+'Print or save as PDF</button></div></div>';}

/* ================= SETTINGS ================= */
const RES=[['ATS clinical education: interpretation of ABGs','https://site.thoracic.org/assemblies/cc/clinical-education/interpretation-of-abgs','Concise stepwise approach from the American Thoracic Society.','Free'],['University of Washington ABG primer','https://courses.washington.edu/med610/abg/abg_primer.html','A classic tutorial on acid–base and oxygenation with worked examples.','Free'],['Australian Prescriber: The interpretation of arterial blood gases','https://australianprescriber.tg.org.au/articles/the-interpretation-of-arterial-blood-gases.html','Short review article, good for consolidation.','Free'],['LITFL: acid–base and blood gas interpretation','https://litfl.com/acid-base/','Case-based reviews and the Boston rules used in this app.','Free'],['BTS guideline: oxygen use in healthcare and emergency settings','https://www.brit-thoracic.org.uk/quality-improvement/guidelines/emergency-oxygen','UK target saturations (94–98 %, 88–92 % if at risk of hypercapnia).','Free · UK'],['RCEMLearning: arterial blood gas analysis','https://www.rcemlearning.org/?p=1852','Royal College of Emergency Medicine reference page, MRCEM level.','Free · UK']];
const ui3ResAt='16/11/2026';
/* Yuzu card ids come from the question text (FNV-1a of the plain stem), not its position, so adding or
   reordering questions never moves review history onto a different card. ui9's misses pack uses the same id. */
function ui3Fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(36);}
const ui3Plain=s=>String(s==null?'':s).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
function ui3QId(lid,q){return 'buffer-'+lid+'-q'+ui3Fnv(ui3Plain(Array.isArray(q)?q[0]:q).toLowerCase());}
function ui3McqCard(l,q){return {id:ui3QId(l.id,q),type:'mcq',question:ui3Plain(q[0]),options:q[1].map((o,i)=>({text:ui3Plain(o),correct:i===q[2]})),explanation:ui3Plain(q[3])+(l.hook?' · '+ui3Plain(l.hook):''),source:'Buffer · '+l.t};}
function cardsFromLessons(){const cards=[],seen=new Set();const add=c=>{let id=c.id,n=2;while(seen.has(id))id=c.id+'-'+(n++);seen.add(id);c.id=id;cards.push(c);};L.forEach(l=>{
  (l.q||[]).forEach(q=>{if(Array.isArray(q)&&Array.isArray(q[1]))add(ui3McqCard(l,q));});
  (l.keys||[]).forEach(k=>add({id:'buffer-'+l.id+'-k'+ui3Fnv(ui3Plain(k[0]).toLowerCase()),type:'cloze',text:k[0]+': {{c1::'+k[1]+'}}',extra:l.t+(l.hook?' · '+l.hook:'')}));});return cards;}
function slipText(c,lv){const U=PU();const t=['pH      '+c.pH.toFixed(2),(c.sample==='v'?'PvCO2   ':'PaCO2   ')+P(c.pco2)+' '+U];if(lv>=4&&c.po2!=null&&c.sample!=='v')t.push('PaO2    '+P(c.po2)+' '+U+'  (FiO2 '+c.fio2.toFixed(2)+')');t.push('HCO3    '+r1(c.hco3));if(lv>=3){t.push('Na '+c.na+'  Cl '+c.cl+'  K '+c.k+'  Alb '+c.alb);t.push('Lactate '+c.lac+'  Glucose '+c.glu);}return t.join('\n');}
/* every kind the level allows, weighted by (1 − accuracy) + 0.2; untried kinds count as 50 %, so mixed disorders always appear */
function gasCards(n){const lv=+S.lvl||4,ks=(typeof kindsFor==='function'?kindsFor(lv):Object.keys(KINDS)).filter(k=>KINDS[k]);
 const w=ks.map(k=>{const A=S.kinds[k];return (1-(A&&A.n?A.c/A.n:0.5))+0.2;}),tot=w.reduce((a,b)=>a+b,0);
 const pick=()=>{let r=Math.random()*tot;for(let i=0;i<ks.length;i++){r-=w[i];if(r<=0)return ks[i];}return ks[ks.length-1];};
 const cards=[],seen=new Set();let g=0;
 while(cards.length<n&&g++<n*6){const k=pick();const c=genCase(k,lv);if(!c)continue;const id='buffer-gas-'+k+'-'+Math.round(c.pH*100)+'-'+c.pco2+'-'+Math.round(c.hco3*10);if(seen.has(id))continue;seen.add(id);
  cards.push({id,type:'basic',front:'Read this gas:<br><small>'+esc(c.vig)+'</small><pre style="font-family:monospace;text-align:left">'+esc(slipText(c,lv))+'</pre>',back:'<b>'+esc(c.o.label)+'</b><br>Cause: '+esc(CAUSES[c.cause])+'<br><small>'+esc(c.o.line)+'</small>'});}return cards;}
function pack(id,name,cards){return {yuzu_pack:1,id,name,category:'Medicine::Physiology::Acid–Base & Blood Gases',tags:['auto::System::Respiratory','auto::System::Renal','auto::Specialty::Emergency Medicine','auto::Specialty::Critical Care'],source:'Buffer '+APP_VERSION+' · exported '+ddmmyyyy(),cards};}
/* hand the user a file (Steam Deck / tablet: no pasting 200 KB into a new file) */
function ui3Download(name,txt){try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);return true;}catch(e){return false;}}
const ui3Fn=()=>ddmmyyyy().replace(/\//g,'-');
function selRow(id,title,sub,opts,val){return '<div class="srow"><div><b>'+title+'</b><span>'+sub+'</span></div><select id="'+id+'" aria-label="'+title+'">'+opts.map(o=>'<option value="'+o[0]+'"'+(String(val)===String(o[0])?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';}
/* ---- Your data: backup, restore, undo copy, reset ----
   Epochs (hub.js): Drive and devices merge while their epochs match; a higher epoch replaces everything.
   'here' keeps this device's epoch (never lower), so Drive merges with it and an old backup is not undone by sync;
   'all' takes epoch + 1, so Drive and every synced device take this state. */
const UI3_UNDO='buffer.v1.undo';
const ui3CB='style="width:26px;height:26px;flex:none;accent-color:var(--accent)"';
/* altitude: presets, or any elevation through the standard atmosphere P = 760·(1 − 2.25577e-5·h)^5.2559 (610 m → 707, 2,270 m → 577) */
const ui3Opts=(a,v)=>(a.includes(+v)?a:a.concat([+v]).sort((x,y)=>x-y)).map(n=>[n,n+' gases']);   /* a synced or restored value outside the presets still shows */
const UI3_ALT=[[760,'Sea level'],[707,'Riyadh ≈ 610 m'],[580,'Abha ≈ 2,270 m']];
const ui3AltP=h=>Math.round(760*Math.pow(1-2.25577e-5*h,5.2559));
const ui3AltH=p=>Math.round((1-Math.pow(p/760,1/5.2559))/2.25577e-5/10)*10;
function ui3Sum(s){s=s||{};return {lessons:Object.keys(s.done||{}).filter(k=>LBYID[k]).length,read:+s.read||0,log:(s.gaslog||[]).filter(x=>x&&!x.del).length,days:(s.days||[]).length,xp:+s.xp||0};}
function ui3SumTxt(m){return m.lessons+' lesson'+(m.lessons===1?'':'s')+' · '+m.read+' gas'+(m.read===1?'':'es')+' read · '+m.log+' gas-log entr'+(m.log===1?'y':'ies')+' · '+m.days+' active day'+(m.days===1?'':'s')+(S.quiet!==false?'':' · '+m.xp+' XP');}
function ui3When(v){if(!v)return '';if(/^\d\d\/\d\d\/\d{4}$/.test(v))return v;const d=new Date(v);return isNaN(d)?'':ddmmyyyy(d)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
const ui3Signed=()=>typeof hubCan==='function'&&hubCan()&&typeof signedIn==='function'&&signedIn()&&!!(S.google&&S.google.syncState);
function ui3KeepUndo(why,mode){try{const o=JSON.parse(JSON.stringify(S));delete o.google;localStorage.setItem(UI3_UNDO,JSON.stringify({at:new Date().toISOString(),why,mode,sync:!!(S.google&&S.google.syncState),state:o}));return true;}catch(e){return false;}}
function ui3Undo(){try{const r=JSON.parse(localStorage.getItem(UI3_UNDO)||'null');return r&&r.state&&typeof r.state==='object'?r:null;}catch(e){return null;}}
function ui3Backup(){return JSON.stringify({buffer_backup:1,app:'buffer',version:APP_VERSION,savedAt:new Date().toISOString(),state:Object.assign({},S,{google:undefined})});}
/* shape check before anything is replaced: the wrapper or a full state with enough fields of the right type */
function ui3ReadBackup(txt){let j;const t=String(txt||'').trim();if(!t)return {err:'Paste a backup or open a backup file first.'};
 try{j=JSON.parse(t);}catch(e){return {err:'That text is not a complete backup (it stops part-way or has extra characters). Paste all of it, from the first { to the last }. Nothing was changed.'};}
 if(!j||typeof j!=='object'||Array.isArray(j))return {err:'That is not a Buffer backup. Nothing was changed.'};
 const st=j.buffer_backup&&j.state&&typeof j.state==='object'&&!Array.isArray(j.state)?j.state:j;
 const D=Object.assign({},DEF,DEF2);let ok=0;const bad=[];
 for(const k in D){if(!(k in st))continue;const a=D[k],b=st[k];const same=a===null?true:Array.isArray(a)?Array.isArray(b):typeof a==='object'?(!!b&&typeof b==='object'&&!Array.isArray(b)):typeof b===typeof a;if(same)ok++;else bad.push(k);}
 const core=['done','kinds','read','days','qs'].filter(k=>k in st).length;
 if(ok<8||core<3)return {err:'This is only part of a backup ('+ok+' recognised field'+(ok===1?'':'s')+'). Restore needs the whole backup. Nothing was changed.'};
 const m=migrate(JSON.parse(JSON.stringify(st)));
 ['units','patm','agref','theme','skin','hints','goal','sessLen','lvl'].forEach(k=>{if(k in st&&JSON.stringify(st[k])!==JSON.stringify(m[k])&&!bad.includes(k))bad.push(k);});
 return {st:m,saved:j.savedAt||j.saved||st.savedAt||'',ver:j.version||'',bad};}
const UI3_SETL=[['units','Units'],['patm','Altitude',v=>v+' mmHg'],['agref','Anion gap reference'],['usek','K⁺ in the gap',v=>v?'yes':'no'],['theme','Theme'],['skin','Skin'],['quiet','Quiet mode',v=>v!==false?'on':'off'],['goal','Daily goal'],['sessLen','Gases per session'],['hints','Hints']];
function ui3SetDiff(a,b){return UI3_SETL.filter(x=>String(a[x[0]])!==String(b[x[0]])).map(x=>{const f=x[2]||(v=>v);return x[1]+' '+f(a[x[0]])+' → '+f(b[x[0]]);});}
async function ui3Apply(st,mode){const sync=ui3Signed();
 if(sync&&typeof syncAll==='function'){try{await syncAll(true);}catch(e){}}   /* learn Drive's epoch first, so 'here' is never below it */
 const g=S.google,ep=Math.max(+S.epoch||0,+st.epoch||0);
 S=migrate(JSON.parse(JSON.stringify(st)));S.google=g;S.epoch=mode==='all'?ep+1:ep;S.ui=Object.assign({},S.ui,{wipe:Date.now()});
 ROUND=S.round&&S.round.day===today()&&S.round.legs&&S.round.i<S.round.legs.length?S.round:null;
 save();renderHeader();if(typeof renderRoundBar==='function')renderRoundBar();
 if(sync&&typeof syncAll==='function')syncAll(true);}
/* reset: settings, Google link, screen preferences and (unless ticked) the gas log stay */
async function ui3Reset(mode,dropLog){const sync=ui3Signed();
 if(mode==='all'&&sync&&typeof syncAll==='function'){try{await syncAll(true);}catch(e){}}   /* pull other devices' gas log in first */
 const keep={units:S.units,patm:S.patm,agref:S.agref,usek:S.usek,hints:S.hints,goal:S.goal,sessLen:S.sessLen,lvl:S.lvl,theme:S.theme,quiet:S.quiet,skin:S.skin,ui:S.ui,exams:S.exams};
 if('keys' in S)keep.keys=S.keys;if(!dropLog)keep.gaslog=S.gaslog;
 const g=S.google,ep=+S.epoch||0;S=Object.assign(migrate(null),JSON.parse(JSON.stringify(keep)));S.google=g;S.epoch=mode==='all'?ep+1:ep;S.ui=Object.assign({},S.ui,{wipe:Date.now()});
 if(mode==='here'&&sync&&typeof gcfg==='function')gcfg().syncState=false;   /* otherwise the next sync merges Drive's progress straight back */
 ROUND=null;save();renderHeader();if(typeof renderRoundBar==='function')renderRoundBar();
 if(mode==='all'&&sync&&typeof syncAll==='function')syncAll(true);}
function ui3ResetSheet(opener){const sync=ui3Signed(),was=typeof wasConnected==='function'&&wasConnected(),nLog=(S.gaslog||[]).filter(x=>x&&!x.del).length;
 const sc=document.createElement('div');sc.className='sheet-scrim';
 sc.innerHTML='<div class="sheet" role="dialog" aria-labelledby="rsT"><div class="sheet-grab"></div><b id="rsT">Reset progress</b>'+
  '<p><b>Erased:</b> lessons done, practice stats and mastery, gases read, '+qw('XP, levels and badges','badges and module checks')+', streak and daily counts, mistakes and missed questions, case library and simulation progress, flash cards, rounds, scenarios and teach-back answers.</p>'+
  '<p><b>Kept:</b> your settings, screen preferences, Google connection'+(nLog?' and your gas log ('+nLog+' entr'+(nLog===1?'y':'ies')+')':'')+'.</p>'+
  (nLog?'<label class="srow" for="rsLog"><div><b>Also delete my gas log</b><span>The real gases you saved on shift, with their notes.</span></div><input type="checkbox" id="rsLog" '+ui3CB+'></label>':'')+
  (sync?'<div role="radiogroup" aria-label="Where to reset"><label class="srow" for="rsHere"><div><b>This device only</b><span>Drive sync of progress is switched off here, so Drive does not refill it. Your Drive copy and other devices keep their progress. Switching sync back on merges it all back.</span></div><input type="radio" name="rsM" id="rsHere" value="here" checked '+ui3CB+'></label>'+
   '<label class="srow" for="rsAll"><div><b>Everywhere</b><span>This device, your Drive copy and every device that syncs with it. They take the reset at their next sync.</span></div><input type="radio" name="rsM" id="rsAll" value="all" '+ui3CB+'></label></div>'
  :'<p class="note">Only this device is reset. Copies on other devices and in backups are not touched.'+(was?' If you reconnect Google Drive, the progress saved there merges back in.':'')+'</p>')+
  '<p class="note">A copy of what is erased is kept on this device, so you can undo it from Your data until the next reset or restore.</p><p class="note" id="rsMsg" role="status"></p>'+
  '<div class="btnrow"><button class="btn danger" id="rsGo">Erase progress</button><button class="btn" id="rsNo">Cancel</button></div></div>';
 document.body.appendChild(sc);requestAnimationFrame(()=>sc.classList.add('on'));const close=openModal(sc,{label:'Reset progress',opener,initial:'#rsNo'});
 sc.addEventListener('click',e=>{if(e.target===sc)close();});$('rsNo').onclick=close;let force=false;
 $('rsGo').onclick=async()=>{const mode=sync&&$('rsAll')&&$('rsAll').checked?'all':'here',drop=!!($('rsLog')&&$('rsLog').checked);
  if(!ui3KeepUndo('reset',mode)&&!force){force=true;$('rsMsg').textContent='Storage is full, so no undo copy can be kept. Save a backup file first, or press again to erase without one.';$('rsGo').textContent='Erase without an undo copy';return;}
  $('rsGo').disabled=true;await ui3Reset(mode,drop);close();toast(mode==='all'?'Progress reset on all devices':'Progress reset on this device');announce('Progress reset. Undo is in Your data.');if(VIEW==='settings')RENDER.settings();};}
function ui3Where(){if(typeof hubCan!=='function'||!hubCan())return 'Progress lives in this browser only. Copy a backup or save a backup file to keep it safe or to move it to another device.';
 if(typeof signedIn==='function'&&signedIn())return S.google&&S.google.syncState?'Progress lives in this browser and on your Drive, and merges with your other devices. A backup file is still a good safety copy.':'Progress lives in this browser. Drive sync of progress is off on this device (Google & Citrus › Advanced), so other devices do not see it.';
 return 'Progress lives in this browser. Connect Google above to keep a copy on your Drive.';}
/* a restore merged into Drive can only be undone by replacing everywhere; a local reset is undone locally */
const ui3UndoMode=r=>r.mode==='all'||(r.why!=='reset'&&ui3Signed())?'all':'here';
function ui3UndoRow(){const r=ui3Undo();if(!r)return '';const w={reset:'reset',restore:'restore',undo:'undo'}[r.why]||'change';
 return '<div class="srow" style="border-top:2px solid var(--line);margin-top:10px"><div><b>Undo the last '+w+'</b><span>Copy from '+ui3When(r.at)+': '+ui3SumTxt(ui3Sum(r.state))+'.'+(ui3UndoMode(r)==='all'&&ui3Signed()?' It goes back to Drive and your other devices too.':'')+'</span></div><div class="btnrow"><button class="btn small" id="bkUndo">Bring it back</button><button class="btn small" id="bkUndoX">Discard copy</button></div></div>';}
function ui3CorruptRow(){let raw=null,at='';try{raw=localStorage.getItem('buffer.v1.corrupt');at=localStorage.getItem('buffer.v1.corrupt.at')||'';}catch(e){}if(!raw)return '';
 return '<div class="srow" style="border-top:2px solid var(--line);margin-top:10px"><div><b>A damaged save was kept</b><span>'+(at?'From '+ui3When(at)+'. ':'')+'Buffer could not read it when it opened ('+Math.round(raw.length/1024)+' KB). Save it as a file so it can be repaired, then delete it here.</span></div><div class="btnrow"><button class="btn small" id="bkBad">Save damaged copy</button><button class="btn small" id="bkBadX">Delete it</button></div></div>';}
/* storage use by area and a repair pass (migrate's sanitiser) */
function ui3Check(){const raw=JSON.stringify(S),fixed=migrate(JSON.parse(raw));const ch=[];for(const k in fixed){if(k==='google'||k==='savedAt')continue;if(JSON.stringify(fixed[k])!==JSON.stringify(S[k]))ch.push(k);}
 const kb=x=>Math.round(JSON.stringify(x||'').length/102.4)/10;const areas=[['gas log','gaslog'],['mistakes','mist'],['case mistakes','cmist'],['practice history','sess'],['reflex history','reflex'],['case progress','cases']].map(a=>[a[0],kb(S[a[1]])]).sort((a,b)=>b[1]-a[1]).slice(0,3);
 let tot=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^buffer/.test(k))tot+=(localStorage.getItem(k)||'').length;}}catch(e){}
 if(ch.length){const g=S.google;S=fixed;S.google=g;save();}
 return (ch.length?'Repaired '+ch.length+' damaged field'+(ch.length===1?'':'s')+': '+ch.join(', ')+'. ':'No damaged data found. ')+'Buffer uses '+Math.round(tot/1024)+' KB in this browser (largest: '+areas.map(a=>a[0]+' '+a[1]+' KB').join(', ')+').';}

RENDER.settings=function(){const el=$('v-settings');const lc=cardsFromLessons();
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">Buffer '+APP_VERSION+(typeof BUILD_DATE!=='undefined'?' · built '+BUILD_DATE:'')+'</span><h1>Settings</h1></div></div><div class="grid2">'+
 '<div class="card set"><span class="eyebrow">Appearance</span><div>'+
  '<div class="srow"><div><b>Skin</b><span>Orange Pixel, or a calmer clinical skin for long sessions.</span></div><div class="seg" role="group" aria-label="Skin">'+[['pixel','Pixel'],['clinical','Clinical']].map(t=>'<button data-skin="'+t[0]+'" aria-pressed="'+((S.skin||'pixel')===t[0])+'">'+t[1]+'</button>').join('')+'</div></div>'+
  '<div class="srow"><div><b>Theme</b><span>Pith (light) or peel (dark). Auto follows your device.</span></div><div class="seg" role="group" aria-label="Theme">'+[['auto','Auto'],['light','Light'],['dark','Dark']].map(t=>'<button data-theme="'+t[0]+'" aria-pressed="'+((S.theme||'dark')===t[0])+'">'+t[1]+'</button>').join('')+'</div></div></div>'+
  '<span class="eyebrow" style="margin-top:14px;display:block">Reading gases</span><div>'+
  selRow('sUnits','Pressure units','Used everywhere in the app.',[['mmHg','mmHg'],['kPa','kPa']],S.units)+
  selRow('sAlt','Altitude','Changes the alveolar gas equation and expected PaO₂.',UI3_ALT.map(a=>[a[0],a[1]+' ('+P(a[0])+' '+PU()+')']).concat([['custom','Other place…']]),UI3_ALT.some(a=>a[0]===S.patm)?S.patm:'custom')+
  '<div class="srow" id="sAltC"'+(UI3_ALT.some(a=>a[0]===S.patm)?' hidden':'')+'><div><b>Elevation in metres</b><span id="sAltP">Barometric pressure '+P(S.patm)+' '+PU()+' (standard atmosphere).</span></div><input type="number" id="sAltM" aria-label="Elevation in metres" inputmode="numeric" value="'+ui3AltH(S.patm)+'" step="10" min="-400" max="3300" style="width:110px"></div>'+
  '<div class="srow"><div><b>Anion gap reference</b><span>Classic texts use 12; many modern analysers run lower. Use your lab\'s (4–16, whole numbers).</span></div><input type="number" id="sAg" aria-label="Anion gap reference" inputmode="numeric" value="'+S.agref+'" step="1" min="4" max="16" style="width:84px"></div>'+
  selRow('sK','Include K⁺ in the interpreter\'s anion gap','Adds about 4 to the reference. Practice cases are generated and graded without K⁺.',[[0,'No'],[1,'Yes']],S.usek?1:0)+
  '<p class="note" id="sPrev" aria-live="polite" style="margin-top:8px"></p></div></div>'+
 '<div class="card set"><span class="eyebrow">Practice</span><div>'+
  selRow('sHints','Hints','Fading: open on steps you still miss, closed once you are reliable.',[['auto','Fading (recommended)'],['always','Always open'],['never','Off']],S.hints)+
  selRow('sGoal','Daily goal','Gases per day on Today.',ui3Opts([10,15,20,30],S.goal),S.goal)+
  selRow('sLen','Gases per session','Length of Mixed, Step-by-step and Quick read sessions. Reflex and boss rounds have their own length.',ui3Opts([5,10,20],S.sessLen),S.sessLen)+
  '<label class="srow" for="sQuiet"><div><b>Quiet mode</b><span>Hides XP, levels and badges and uses plain names for the module tests. Mastery stays.</span></div><input type="checkbox" id="sQuiet"'+(S.quiet!==false?' checked':'')+' '+ui3CB+'></label>'+
  '<label class="srow" for="sKeys"><div><b>Number-key shortcuts</b><span>In sessions, keys 1–9 pick an answer and S, T, G set your confidence.</span></div><input type="checkbox" id="sKeys"'+(S.keys!==false?' checked':'')+' '+ui3CB+'></label></div>'+
  '<p class="note" style="margin-top:10px"><b>Hand kit:</b> hold almost anything (chips, printout rows, mastery tiles, step bars) to see what it means; hold a mastery tile or lesson for a menu; swipe flash cards.</p></div>'+
 '</div><div id="google-root"></div><div class="grid2">'+
 '<div class="card set"><span class="eyebrow">Yuzu</span><p class="note">Turn Buffer into flashcards. The lesson pack has every check question as a multiple-choice card, plus every key number. Each card\'s id comes from its question, so re-importing refreshes cards and keeps their review history, and missed points sent from Progress land on the same cards. Practice gases are fresh cases from every pattern, weighted to the ones you miss.</p>'+
  '<div class="btnrow"><button class="btn" id="yzL">'+ic('copy')+'Copy lesson pack ('+lc.length+' cards)</button><button class="btn" id="yzLf">Save as file</button></div>'+
  '<div class="btnrow" style="margin-top:8px"><button class="btn" id="yzG">'+ic('copy')+'Copy 30 practice gases</button><button class="btn" id="yzGf">Save as file</button></div>'+
  '<p class="note" id="yzMsg" role="status"></p><textarea class="copy inp" id="yzTa" hidden readonly aria-label="Pack text"></textarea></div>'+
 '<div class="card set"><span class="eyebrow">Your data</span><p class="note" id="bkWhere">'+ui3Where()+'</p>'+
  '<div class="btnrow"><button class="btn" id="bkOut">'+ic('copy')+'Copy backup</button><button class="btn" id="bkFile">Save backup file</button><button class="btn" id="bkInBtn" aria-expanded="false" aria-controls="bkIn">Restore from backup</button></div>'+
  '<div id="bkOutBox" hidden style="display:grid;gap:8px;margin-top:10px"><label class="note" for="bkOutTa">Clipboard blocked here. This is your backup: select it all and copy it somewhere safe.</label><textarea class="inp" id="bkOutTa" readonly></textarea><div class="btnrow"><button class="btn small" id="bkSel">Select all</button></div></div>'+
  '<div id="bkIn" hidden style="display:grid;gap:8px;margin-top:10px"><label class="note" for="bkTxt">Paste a backup, or open a backup file. You will see what changes before anything is replaced.</label><textarea class="inp" id="bkTxt" placeholder="Paste a Buffer backup here"></textarea>'+
   '<div class="btnrow"><button class="btn" id="bkCheck">Check backup</button><button class="btn" id="bkPickBtn">Open backup file</button><input type="file" id="bkPick" accept=".json,application/json,text/plain" hidden></div><div id="bkPrev" role="status"></div></div>'+
  ui3UndoRow()+ui3CorruptRow()+
  '<div class="srow" style="border-top:2px solid var(--line);margin-top:10px"><div><b>Check my data</b><span>Repairs damaged values and shows how much space Buffer uses.</span></div><button class="btn small" id="bkHealth">Check</button></div><p class="note" id="bkHealthMsg" role="status"></p>'+
  '<div class="srow"><div><b>Reset progress</b><span>'+(ui3Signed()?'Choose this device only or everywhere (Drive and your other devices). ':'Erases progress on this device only. ')+'Settings stay; your gas log stays unless you tick it. You can undo it.</span></div><button class="btn danger small" id="resetBtn">Reset…</button></div></div>'+
 '</div><div><span class="eyebrow" role="heading" aria-level="2" style="display:block;margin-bottom:10px">Free references</span><p class="note" style="margin-bottom:10px">These open on the web and need a connection; the rest of Buffer works offline. Links reviewed '+ui3ResAt+'.</p><div class="res">'+RES.map(r=>'<a class="card" href="'+r[1]+'" target="_blank" rel="noopener"><small>'+r[3]+'</small><h3>'+r[0]+'</h3><p>'+r[2]+'</p></a>').join('')+'</div></div>'+
 '<p class="note">Buffer is a learning tool. Interpretations follow the Boston rules and are checked by an automated test suite, but they do not replace clinical judgement.</p>'+
 '<div class="btnrow" style="margin-top:8px"><button class="btn small" id="sDiag">'+ic('copy')+'Copy diagnostics</button><span class="note">Version, display and storage details for a bug report. No progress or personal data.</span></div>';
 const pv=()=>{const p=$('sPrev');if(!p)return;const pp=v=>P(v)+' '+PU(),pao=0.21*(S.patm-47)-40/0.8;p.textContent='With these settings: '+(S.units==='kPa'?'PaCO₂ 40 mmHg reads '+pp(40)+' · ':'')+'anion gap reference '+S.agref+(S.usek?' (about '+(S.agref+4)+' with K⁺ in the interpreter)':'')+' · expected PAO₂ on room air about '+pp(pao)+' at '+pp(S.patm)+'.';};pv();
 $('sQuiet').onchange=e=>{S.quiet=e.target.checked;save();applyTheme();renderHeader();toast('Quiet mode '+(S.quiet?'on':'off'));};
 $('sKeys').onchange=e=>{S.keys=e.target.checked;save();toast('Number-key shortcuts '+(S.keys?'on':'off'));};
 el.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>{S.skin=b.dataset.skin;save();applyTheme();el.querySelectorAll('[data-skin]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
 el.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{S.theme=b.dataset.theme;save();applyTheme();el.querySelectorAll('[data-theme]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
 $('sUnits').onchange=e=>{S.units=e.target.value;save();RENDER.settings();const u=$('sUnits');if(u)u.focus();toast('Units: '+S.units+' everywhere in the app');};
 const altSet=(p,lab)=>{S.patm=Math.max(500,Math.min(800,p));save();pv();const t=$('sAltP');if(t)t.textContent='Barometric pressure '+P(S.patm)+' '+PU()+' (standard atmosphere).';toast('Altitude: '+lab+', '+P(S.patm)+' '+PU());};
 $('sAlt').onchange=e=>{const v=e.target.value;if(v==='custom'){$('sAltC').hidden=false;$('sAltM').focus();return;}$('sAltC').hidden=true;const a=UI3_ALT.find(x=>String(x[0])===v);altSet(+v,a?a[1]:v);};
 $('sAltM').onchange=e=>{const t=e.target.value.trim();let h=Math.round(+t);if(t===''||!isFinite(h)){e.target.value=ui3AltH(S.patm);toast('Elevation unchanged');return;}h=Math.max(-400,Math.min(3300,h));e.target.value=h;altSet(ui3AltP(h),h.toLocaleString('en-GB')+' m');};
 $('sAg').onchange=e=>{const t=e.target.value.trim(),v=Math.round(+t);if(t===''||!isFinite(v)){e.target.value=S.agref;toast('Anion gap reference unchanged: '+S.agref);return;}const c=Math.max(4,Math.min(16,v));e.target.value=c;S.agref=c;save();pv();toast('Anion gap reference: '+c+(String(c)!==t?' (whole numbers 4–16)':''));};
 $('sK').onchange=e=>{S.usek=e.target.value==='1';save();pv();toast('K⁺ in the interpreter\'s anion gap: '+(S.usek?'yes':'no'));};
 $('sHints').onchange=e=>{S.hints=e.target.value;save();toast('Hints: '+e.target.selectedOptions[0].textContent);};
 $('sGoal').onchange=e=>{S.goal=+e.target.value;save();toast('Daily goal: '+S.goal+' gases');};
 $('sLen').onchange=e=>{S.sessLen=+e.target.value;save();toast('Gases per session: '+S.sessLen);};
 /* Yuzu: copy, or save a file (the clipboard is blocked in some places) */
 const yzMsg=t=>{$('yzMsg').textContent=t;};
 const yzCopy=async(btn,p,fid)=>{const txt=JSON.stringify(p);const ok=await copyText(txt,btn);const kb=p.cards.length+' cards ('+Math.round(txt.length/1024)+' KB).';
  if(ok){$('yzTa').hidden=true;yzMsg('Copied '+kb+' Paste into a file named '+fid+'.yuzu.json and import it in Yuzu, or use Save as file.');}
  else{$('yzTa').hidden=false;$('yzTa').value=txt;$('yzTa').select();yzMsg('Clipboard blocked here: the pack is in the box below ('+kb+') Select it all and copy it, or use Save as file.');}};
 const yzFile=(p,fid)=>{const ok=ui3Download(fid+'.yuzu.json',JSON.stringify(p));yzMsg(ok?'Saved '+fid+'.yuzu.json ('+p.cards.length+' cards). Import it in Yuzu.':'This browser blocked the download. Use Copy instead.');};
 const lp=()=>pack('buffer-core','Buffer: blood gas lessons',lc),gp=()=>pack('buffer-gases-'+today(),'Buffer: practice gases '+ddmmyyyy(),gasCards(30));
 $('yzL').onclick=e=>yzCopy(e.currentTarget,lp(),'buffer-core');$('yzLf').onclick=()=>yzFile(lp(),'buffer-core');
 $('yzG').onclick=e=>yzCopy(e.currentTarget,gp(),'buffer-gases');$('yzGf').onclick=()=>yzFile(gp(),'buffer-gases-'+ui3Fn());
 /* backup out: its own read-only box when the clipboard is blocked, never the restore box */
 $('bkOut').onclick=async e=>{const txt=ui3Backup();const ok=await copyText(txt,e.currentTarget);if(!ok){$('bkOutBox').hidden=false;$('bkOutTa').value=txt;$('bkOutTa').select();toast('Clipboard blocked. Your backup is in the box.');}else{$('bkOutBox').hidden=true;toast('Backup copied ('+Math.round(txt.length/1024)+' KB)','good');}};
 $('bkSel').onclick=()=>{const t=$('bkOutTa');t.focus();t.select();};
 $('bkFile').onclick=()=>{const n='buffer-backup-'+ui3Fn()+'.json';if(ui3Download(n,ui3Backup()))toast('Saved '+n,'good');else toast('This browser blocked the download. Use Copy backup.','bad');};
 $('bkInBtn').onclick=e=>{const open=$('bkIn').hidden;$('bkIn').hidden=!open;e.currentTarget.setAttribute('aria-expanded',String(open));if(open)$('bkTxt').focus();};
 $('bkPickBtn').onclick=()=>$('bkPick').click();
 $('bkPick').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>16e6){$('bkPrev').innerHTML='<p class="note">That file is too large to be a Buffer backup.</p>';return;}const r=new FileReader();r.onload=()=>{$('bkTxt').value=String(r.result||'');e.target.value='';preview();};r.onerror=()=>{$('bkPrev').innerHTML='<p class="note">That file could not be read.</p>';};r.readAsText(f);};
 /* restore: check the shape, show what changes, then replace (with an undo copy) */
 const preview=()=>{const box=$('bkPrev');const r=ui3ReadBackup($('bkTxt').value);if(r.err){box.innerHTML='<p class="note" style="color:var(--bad)">'+esc(r.err)+'</p>';return;}
  const diff=ui3SetDiff(S,r.st),sync=ui3Signed();
  box.innerHTML='<div class="card" style="display:grid;gap:8px;padding:12px"><p><b>This backup'+(r.saved?' ('+esc(ui3When(r.saved))+(r.ver?', Buffer '+esc(r.ver):'')+')':'')+':</b> '+esc(ui3SumTxt(ui3Sum(r.st)))+'.</p><p><b>This device now:</b> '+esc(ui3SumTxt(ui3Sum(S)))+'.</p>'+
   (diff.length?'<p><b>Settings that change:</b> '+esc(diff.join(' · '))+'.</p>':'<p class="note">Settings stay the same.</p>')+
   (r.bad.length?'<p class="note">Damaged values in the backup go back to defaults: '+esc(r.bad.join(', '))+'.</p>':'')+
   '<p class="note">'+(sync?'<b>Restore and merge</b> puts the backup on this device, then merges it with Drive, so anything saved only on Drive or your other devices is kept as well. <b>Replace everywhere</b> makes the backup the progress on Drive and on every synced device; anything not in it is erased there.':'This replaces all progress on this device with the backup.')+' Your Google connection stays. A copy of what you have now is kept, so you can undo this.</p><p class="note" id="bkWarn" role="status"></p>'+
   '<div class="btnrow"><button class="btn primary" id="bkGo">'+(sync?'Restore and merge':'Replace this device\'s progress')+'</button>'+(sync?'<button class="btn danger" id="bkAll">Replace everywhere</button>':'')+'<button class="btn" id="bkNo">Cancel</button></div></div>';
  let force=false;const run=async(mode,btn)=>{if(!ui3KeepUndo('restore',mode)&&!force){force=true;$('bkWarn').textContent='Storage is full, so no undo copy can be kept. Save a backup file first, or press again to restore without one.';btn.textContent+=' without undo';return;}
   box.querySelectorAll('button').forEach(b=>b.disabled=true);await ui3Apply(r.st,mode);toast(mode==='all'?'Backup restored on all devices':'Backup restored','good');announce('Backup restored. Undo is in Your data.');RENDER.settings();};
  $('bkGo').onclick=e=>run('here',e.currentTarget);if($('bkAll'))$('bkAll').onclick=e=>run('all',e.currentTarget);$('bkNo').onclick=()=>{box.innerHTML='';$('bkTxt').focus();};$('bkGo').focus();};
 $('bkCheck').onclick=preview;
 /* undo copy, damaged save, health check, reset */
 const arm=(b,fn)=>{if(!b)return;b.onclick=()=>{if(b.dataset.arm!=='1'){b.dataset.arm='1';b.dataset.t=b.textContent;b.textContent='Tap again to confirm';setTimeout(()=>{if(document.body.contains(b)){b.dataset.arm='';b.textContent=b.dataset.t;}},4000);return;}fn();};};
 if($('bkUndo'))$('bkUndo').onclick=async e=>{const r=ui3Undo();if(!r)return;e.currentTarget.disabled=true;const mode=ui3UndoMode(r);
  if(r.why==='reset'&&r.mode==='here'&&r.sync&&typeof gcfg==='function'&&typeof signedIn==='function'&&signedIn())gcfg().syncState=true;   /* a local reset switched Drive sync off; undo switches it back on */
  ui3KeepUndo('undo',mode);await ui3Apply(r.state,mode);toast('Previous progress brought back','good');announce('Previous progress brought back');RENDER.settings();};
 arm($('bkUndoX'),()=>{try{localStorage.removeItem(UI3_UNDO);}catch(e){}toast('Undo copy discarded');RENDER.settings();});
 if($('bkBad'))$('bkBad').onclick=()=>{let raw='';try{raw=localStorage.getItem('buffer.v1.corrupt')||'';}catch(e){}const n='buffer-damaged-save-'+ui3Fn()+'.json';if(ui3Download(n,raw))toast('Saved '+n,'good');else toast('This browser blocked the download.','bad');};
 arm($('bkBadX'),()=>{try{localStorage.removeItem('buffer.v1.corrupt');localStorage.removeItem('buffer.v1.corrupt.at');}catch(e){}if(typeof LOAD_ERR!=='undefined')LOAD_ERR=null;toast('Damaged copy deleted');RENDER.settings();});
 $('bkHealth').onclick=()=>{$('bkHealthMsg').textContent=ui3Check();};
 $('resetBtn').onclick=e=>ui3ResetSheet(e.currentTarget);
 $('sDiag').onclick=e=>{let n=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^buffer/.test(k))n+=(localStorage.getItem(k)||'').length;}}catch(x){}
  const d={app:'Buffer',version:APP_VERSION,date:ddmmyyyy(),skin:S.skin,theme:S.theme,units:S.units,quiet:S.quiet!==false,display:matchMedia('(display-mode: standalone)').matches?'installed':'browser',viewport:innerWidth+'x'+innerHeight,dpr:devicePixelRatio,charset:document.characterSet,storageKB:Math.round(n/1024),saveOk:typeof SAVE_OK==='undefined'?null:SAVE_OK,loadError:typeof LOAD_ERR!=='undefined'&&!!LOAD_ERR,driveSync:ui3Signed(),userAgent:navigator.userAgent};
  copyText(JSON.stringify(d,null,1),e.currentTarget).then(ok=>{if(!ok){$('bkHealthMsg').textContent=JSON.stringify(d);}});};
 if(typeof renderGoogle==='function')renderGoogle();};

/* ================= BOOT ================= */
function route(h,first){h=(h||'').replace(/^#/,'');
 if(h==='interp')return openTool('interp');if(h==='lab')return go('labs',first);
 if(h.startsWith('l-')&&LBYID[h.slice(2)]){if(!CUR||CUR.id!==h.slice(2)||VIEW!=='lesson')openLesson(h.slice(2));return;}
 if(h.startsWith('tool-')){const id=h.slice(5);if(VIEW!=='tool'||TOOL!==id)openTool(id);return;}
 if(h.startsWith('scen-')&&SCENARIOS.some(s=>s.id===h.slice(5))){if(!SC||SC.sc.id!==h.slice(5))openScenario(h.slice(5));return;}
 if(VIEWS.includes(h)&&!['session','lesson','tool'].includes(h)){if(first||h!==VIEW)go(h,true);return;}
 if(first||(!h&&VIEW!=='today'&&VIEW!=='session'))go('today',true);}   /* an empty hash is Today, also after the first load (Back from a cold start) */
function boot(){load();applyTheme();
 $('gearBtn').innerHTML=ic('gear');
 if(S.round&&S.round.day===today()&&S.round.i<S.round.legs.length)ROUND=S.round;else if(S.round){S.round=null;save();}
 if(!location.hash)try{history.replaceState(history.state,'','#today');}catch(e){}   /* so the first Back from a lesson or tool returns to Today */
 route(location.hash,true);
 const fbRedraw=()=>{if(VIEW==='session'&&SS&&SS.cur&&SS.cur.c&&$('fbMap'))drawMap($('fbMap'),[{ph:SS.cur.c.o.est.pH,h:SS.cur.c.o.est.hco3,l:'this gas'}],280);};
 let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(VIEW==='tool'&&TOOL==='interp')runInterp();else fbRedraw();},200);});
 addEventListener('buffer:theme',fbRedraw);   /* the session map takes the new palette (the interpreter map has its own listener) */
 addEventListener('hashchange',()=>route(location.hash,false));
 /* Back: leave a session / lesson / tool instead of leaving the app */
 addEventListener('popstate',()=>{if(VIEW==='session'){SUBNAV=false;const b=$('sExit');if(b)b.click();else go(ROUND?'today':'practice',true);if(VIEW==='session'){try{history.pushState({sub:1},'',location.href);}catch(e){}SUBNAV=true;}}else if(SUBV.includes(VIEW)){SUBNAV=false;}});
 /* a second tab of Buffer: adopt the newer save, never overwrite it */
 /* the stored value is by definition the latest write, so never compare wall clocks: merge it (hub merge), or take it whole
    after a reset, restore or undo in the other tab (ui.wipe or epoch differs) */
 addEventListener('storage',e=>{if(e.key!=='buffer.v1'||!e.newValue)return;try{const n=JSON.parse(e.newValue);if(!n||typeof n!=='object'||Array.isArray(n))return;
  const wp=x=>(x&&x.ui&&x.ui.wipe)||0,whole=wp(n)!==wp(S)||(+n.epoch||0)!==(+S.epoch||0)||typeof mergeStates!=='function';
  const next=whole?n:mergeStates(S,n);const g=S.google;S=migrate(next);S.google=n.google&&g?Object.assign({},g,{syncState:n.google.syncState,publish:n.google.publish}):g;S.savedAt=n.savedAt||S.savedAt;renderHeader();if(typeof renderRoundBar==='function')renderRoundBar();if(VIEW!=='session'&&RENDER[VIEW]&&!SUBV.includes(VIEW))safe(()=>RENDER[VIEW](),VIEW);}catch(err){}});
 if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if((S.theme||'dark')==='auto')applyTheme();});}catch(e){}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});}
