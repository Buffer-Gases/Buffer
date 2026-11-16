/* ================= UI CORE ================= */
const APP_VERSION='5.0.0';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* lessons in module order (later files append lessons to earlier modules) */
(function(){const mi={};MODS.forEach((m,i)=>mi[m.id]=i);const o=L.slice().sort((a,b)=>mi[a.m]-mi[b.m]);L.length=0;o.forEach(x=>L.push(x));})();
const LBYID={};L.forEach((l,i)=>{l.i=i;LBYID[l.id]=l;});
const MBYID={};MODS.forEach((m,i)=>{m.i=i;MBYID[m.id]=m;});
let VIEW='today';
const ICON={
 gear:'<path d="M10 2h4v3l2 1 2-2 3 3-2 2 1 2h3v4h-3l-1 2 2 2-3 3-2-2-2 1v3h-4v-3l-2-1-2 2-3-3 2-2-1-2H2v-4h3l1-2-2-2 3-3 2 2 2-1z"/><rect x="9" y="9" width="6" height="6"/>',
 steps:'<path d="M4 6h10M4 12h10M4 18h10"/><path d="m17 5 1.5 1.5L21 4M17 11l1.5 1.5L21 10M17 17l1.5 1.5L21 16"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 fit:'<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
 timer:'<rect x="5" y="6" width="14" height="15"/><path d="M12 10v5h3M9 2h6"/>',
 gym:'<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
 redo:'<path d="M4 4v6h6"/><path d="M4 10a8 8 0 1 0 3-5"/>',
 play:'<path d="M7 4v16l13-8z"/>',
 check:'<path d="m5 12 5 5L20 7"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 chev:'<path d="m9 6 6 6-6 6"/>',
 back:'<path d="m15 6-6 6 6 6"/>',
 copy:'<rect x="9" y="9" width="12" height="12"/><path d="M5 15V3h12"/>',
 web:'<rect x="3" y="3" width="6" height="5"/><rect x="15" y="3" width="6" height="5"/><rect x="9" y="16" width="6" height="5"/><path d="M6 8v4h12V8M12 12v4"/>',
 scen:'<path d="M4 4h16v12H9l-5 4z"/><path d="M8 8h8M8 12h5"/>',
 teach:'<path d="M3 5h18v11H3z"/><path d="M8 20h8M12 16v4M7 9h6M7 12h4"/>',
 est:'<path d="M3 17h18M6 17v-4M12 17V7M18 17v-7"/><path d="M10 4h4"/>',
 flash:'<rect x="4" y="5" width="14" height="10"/><path d="M8 19h12V9"/>',
 serial:'<path d="M3 18 9 12l4 4 8-9"/><path d="M15 7h6v6"/>',
 boss:'<path d="M4 20h16M6 20V9l3 3 3-6 3 6 3-3v11"/>',
 interp:'<rect x="5" y="3" width="14" height="18"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 tool:'<path d="M14 4a5 5 0 0 0-5 6L3 16l3 3 6-6a5 5 0 0 0 6-5l-3 3-3-3z"/>',
 pocket:'<rect x="5" y="3" width="14" height="18"/><path d="M8 7h8M8 11h8M8 15h5"/>',
 lab:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7 15h10"/>',
 due:'<rect x="4" y="5" width="16" height="15"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><rect x="9" y="10" width="6" height="6"/>'
};
const ic=(n,attrs)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges" aria-hidden="true"'+(attrs||'')+'>'+(ICON[n]||'')+'</svg>';
function toast(msg,tone){const h=$('toasts');if(!h)return;while(h.children.length>=2)h.firstChild.remove();const t=document.createElement('div');t.className='toast'+(tone?' '+tone:'');t.textContent=(S.quiet!==false&&typeof msg==='string')?msg.replace(/\s*[·,]?\s*\+\d+ XP/g,''):msg;h.appendChild(t);let gone=false;t._fade=()=>{if(gone)return;gone=true;t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),320);};t._t0=Date.now();setTimeout(t._fade,2600);}
/* on a view change, toasts from the last view leave sooner (T13-33) */
function ui1ToastsShort(){const h=$('toasts');if(!h)return;[...h.children].forEach(t=>{if(t._fade)setTimeout(t._fade,Math.max(0,1500-(Date.now()-(t._t0||0))));});}
/* quiet word at source: qw('Boss fight','Module check') */
const qw=(game,plain)=>S.quiet!==false?plain:game;
/* one polite live region for screen readers (toasts have their own) */
function announce(t){let r=$('sr');if(!r){r=document.createElement('div');r.id='sr';r.setAttribute('aria-live','polite');r.setAttribute('role','status');r.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;margin:-1px;padding:0;border:0';document.body.appendChild(r);}r.textContent='';setTimeout(()=>{r.textContent=t;},30);}
const ui1VH=t=>'<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap">'+t+'</span>';
async function copyText(txt,btn){const ok=()=>{if(btn){const o=btn.innerHTML;btn.innerHTML=ic('check')+'Copied';setTimeout(()=>btn.innerHTML=o,1400);}announce('Copied');return true;};
 try{await navigator.clipboard.writeText(txt);return ok();}catch(e){}
 try{const ta=document.createElement('textarea');ta.value=txt;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0;width:1px;height:1px';document.body.appendChild(ta);ta.select();const r=document.execCommand('copy');ta.remove();if(r)return ok();}catch(e){}
 toast('Clipboard blocked: select the text and copy it by hand.','bad');return false;}
function ddmmyyyy(d){d=d||new Date();return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();}
function todayN(){return (S.dayN||{})[today()]||0;}
function confetti(){if(RM())return;const cv=document.createElement('canvas');cv.id='confetti';document.body.appendChild(cv);const x=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
 const cols=[tok('--accent'),tok('--good'),tok('--hi'),tok('--b2'),tok('--deep')];const P=[];for(let i=0;i<70;i++)P.push({x:Math.random()*cv.width,y:-20-Math.random()*200,v:2+Math.random()*3,s:4+Math.floor(Math.random()*3)*2,c:cols[i%cols.length],w:Math.random()*2-1});
 let t=0;const f=()=>{x.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.y+=p.v;p.x+=p.w;x.fillStyle=p.c;x.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s);});if(++t<130)requestAnimationFrame(f);else cv.remove();};f();}
/* seeded randomness (gas of the day) */
function withSeed(seed,fn){let a=seed>>>0;const old=Math.random;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};try{return fn();}finally{Math.random=old;}}
const dayNum=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);

/* ---------- action sheet (hand kit) ---------- */
/* shared modal behaviour: openModal(scrim,{opener,initial,onClose,label}) → close()
   dialog semantics, focus in, Tab trap, Escape (capture, stops other listeners), inert background, focus back to the opener. */
function openModal(sc,o){o=o||{};const dlg=sc.querySelector('[role="dialog"]')||sc.firstElementChild||sc;dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');if(o.label&&!dlg.getAttribute('aria-label'))dlg.setAttribute('aria-label',o.label);
 const opener=o.opener||document.activeElement;const bg=[document.querySelector('main'),document.querySelector('header'),$('roundbar'),document.querySelector('nav.tabs')].filter(x=>x&&!x.contains(sc)&&!sc.contains(x));bg.forEach(x=>x.inert=true);
 const foc=()=>[...dlg.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&!x.hidden&&x.offsetParent!==null);
 const onKey=e=>{if(!document.body.contains(sc)){done();return;}if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}else if(e.key==='Tab'){const f=foc();if(!f.length){e.preventDefault();return;}const a=f[0],z=f[f.length-1];if(e.shiftKey&&(document.activeElement===a||!dlg.contains(document.activeElement))){e.preventDefault();z.focus();}else if(!e.shiftKey&&(document.activeElement===z||!dlg.contains(document.activeElement))){e.preventDefault();a.focus();}}};
 let closed=false;function done(){if(closed)return;closed=true;document.removeEventListener('keydown',onKey,true);bg.forEach(x=>x.inert=false);mo.disconnect();if(opener&&opener.focus&&document.body.contains(opener))try{opener.focus({preventScroll:true});}catch(e){}if(o.onClose)o.onClose();}
 function close(){if(closed)return;sc.classList.remove('on');setTimeout(()=>sc.remove(),200);done();}
 const mo=new MutationObserver(()=>{if(!document.body.contains(sc))done();});mo.observe(document.body,{childList:true});
 document.addEventListener('keydown',onKey,true);
 requestAnimationFrame(()=>{const i=typeof o.initial==='string'?dlg.querySelector(o.initial):o.initial;const t=i||foc()[0];if(t)try{t.focus({preventScroll:true});}catch(e){}});
 return close;}
function sheet(title,items){const old=document.querySelector('.sheet-scrim');if(old)old.remove();const sc=document.createElement('div');sc.className='sheet-scrim';sc.innerHTML='<div class="sheet" role="dialog" aria-label="'+esc(title)+'"><div class="sheet-grab"></div><b>'+esc(title)+'</b>'+items.map((it,i)=>'<button class="sheet-btn" data-i="'+i+'">'+esc(it[0])+'</button>').join('')+'<button class="sheet-btn cancel">Cancel</button></div>';document.body.appendChild(sc);
 const close=openModal(sc,{label:title});
 requestAnimationFrame(()=>sc.classList.add('on'));
 sc.onclick=e=>{if(e.target===sc||e.target.classList.contains('cancel'))close();const b=e.target.closest('[data-i]');if(b){close();items[+b.dataset.i][1]();}};
 let sy=null;const sh=sc.querySelector('.sheet');sh.addEventListener('pointerdown',e=>sy=e.clientY);sh.addEventListener('pointermove',e=>{if(sy!=null&&e.clientY-sy>70){sy=null;close();}});}

/* ---------- XP and levels ---------- */
const LEVELS=[[0,'Student'],[150,'Intern'],[400,'Resident'],[800,'Registrar'],[1400,'Fellow'],[2200,'Intensivist'],[3200,'Consultant'],[4600,'Henderson'],[6500,'Siggaard-Andersen']];
function levelOf(xp){let i=0;LEVELS.forEach((l,j)=>{if(xp>=l[0])i=j;});return i;}
function addXP(n){if(!n)return;const before=levelOf(S.xp||0);S.xp=(S.xp||0)+n;const after=levelOf(S.xp);if(after>before&&S.quiet===false){toast('Level up: '+LEVELS[after][1],'good');confetti();}renderHeader();}
function levelPill(){const xp=S.xp||0,li=levelOf(xp),cur=LEVELS[li][0],nxt=LEVELS[li+1]?LEVELS[li+1][0]:null;const pc=nxt?Math.round((xp-cur)/(nxt-cur)*100):100;
 return '<div class="lvlpill" data-hint="Level|XP from answers (+2 per right step, +10 per perfect gas), lessons, gym, estimates, teach-backs, shifts and bosses. Levels run Student → Siggaard-Andersen."><span class="num">'+(li+1)+'</span><div><b>'+LEVELS[li][1]+'</b><div class="xpbar"><i style="width:'+pc+'%"></i></div><small>'+xp+' XP'+(nxt?' · '+(nxt-xp)+' to '+LEVELS[li+1][1]:' · top level')+'</small></div></div>';}

/* ---------- theme ---------- */
function applyTheme(){const t=S.theme||'dark';const r=document.documentElement;r.setAttribute('data-skin',S.skin==='clinical'?'clinical':'pixel');document.body.classList.toggle('quiet',S.quiet!==false);if(t==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t);const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=getComputedStyle(r).getPropertyValue('--bg').trim()||'#F3EBDD';try{dispatchEvent(new Event('buffer:theme'));}catch(e){}}

/* ---------- printout (each value holds to explain) ---------- */
const REF={pH:[7.35,7.45],pco2:[35,45],po2:[80,100],hco3:[22,26],be:[-2,2],lac:[0,2],na:[135,145],k:[3.5,5],cl:[98,106],glu:[3.9,7.8],alb:[35,50],cohb:[0,3],methb:[0,1.5]};
const VHINT={pH:'pH|Normal 7.35–7.45. [H⁺] ≈ 80 − the two decimals (nmol/L) between 7.20 and 7.50. Measured by a glass electrode.',pco2:'PCO₂|Normal 35–45 mmHg (4.7–6.0 kPa). Moves with the pH = respiratory cause; against it = compensation. Severinghaus electrode.',po2:'PaO₂|Normal 80–100 mmHg on air at sea level (lower with age and altitude). Read it against FiO₂: P/F and A–a gradient.',po2v:'PvO₂|Venous oxygen. Normal venous values are 30–45 mmHg. Says nothing about the lungs: never use it for oxygenation.',hco3:'HCO₃⁻|Normal 22–26. Calculated from pH and PCO₂ (Henderson–Hasselbalch). Low = metabolic acidosis or compensation for respiratory alkalosis.',be:'Base excess|Normal −2 to +2. The metabolic part only: negative = metabolic acidosis, positive = metabolic alkalosis.',na:'Na⁺|Normal 135–145. Needed for the anion gap. Na − Cl normally ≈ 36–38.',k:'K⁺|Normal 3.5–5.0. Haemolysis and tourniquets raise it falsely. Acidosis shifts it out of cells.',cl:'Cl⁻|Normal 98–106. Rising out of step with Na points to a hyperchloraemic (normal gap) acidosis.',alb:'Albumin|Normal 35–50 g/L. Each 10 g/L below 40 hides about 2.5 of anion gap.',lac:'Lactate|Normal < 2 mmol/L; > 4 high. Each mmol adds ≈ 1 to the anion gap. Venous and arterial agree well.',glu:'Glucose|Normal 3.9–7.8 mmol/L. High with a gap → DKA; SGLT2 inhibitors can give DKA with near-normal glucose.',urea:'Urea|Uraemia rarely pushes the anion gap above ≈ 20 by itself.',osm:'Measured osmolality|Osmolar gap = measured − (2Na + glucose + urea). Above ≈ 10 → toxic alcohol, ethanol, mannitol.',cohb:'COHb|Normal < 3% (smokers up to ≈ 10%). Pulse oximetry reads it as oxygen.',methb:'MetHb|Normal < 1.5%. SpO₂ drifts towards ≈ 85% whatever the true value.'};
/* venous ranges = arterial ranges moved by the app's venous offsets (pH −0.03, PCO₂ +5, HCO₃⁻ +1) */
const VREF={pH:[7.32,7.42],pco2:[40,50],hco3:[23,27]};
function flag(k,v,ven,rr){const r=rr||(ven&&VREF[k])||REF[k];if(!r||v==null)return '';return v<r[0]?'L':v>r[1]?'H':'';}
/* arterial PaO₂ range on air scales with barometric pressure, as interp() does: 80–100 × (Patm − 47) ÷ 713 */
function ui1PO2Ref(fio2){const pa=+S.patm||760,sc=(pa-47)/713;return pa>=740?REF.po2:[Math.round(REF.po2[0]*sc),fio2>0.22?REF.po2[1]:Math.round(REF.po2[1]*sc)];}
function slip(c,o){o=o||{};const lv=o.lv||4,ven=c.sample==='v',cord=c.ctx==='cord';const U=PU();const rows=[];
 const row=(n,k,v,disp,unit,ref,rr)=>{if(cord){ref='';}else if(ven&&VREF[k]){const r=VREF[k];ref=k==='pco2'?rp(r[0],r[1]):k==='pH'?r[0].toFixed(2)+'–'+r[1].toFixed(2):r[0]+'–'+r[1];}const f=cord?'':flag(k,v,ven,rr);rows.push('<tr data-hint="'+esc(VHINT[k]||n)+'"><td>'+n+'</td><td'+(f?' class="fl"':'')+'>'+disp+(f?' '+f:'')+'</td><td>'+unit+'</td><td>'+(ref||'')+'</td></tr>');};
 const rp=(a,b)=>S.units==='kPa'?(a/KPA).toFixed(1)+'–'+(b/KPA).toFixed(1):a+'–'+b;
 row('pH','pH',c.pH,c.pH.toFixed(2),'','7.35–7.45');
 row(ven?'PvCO₂':'PaCO₂','pco2',c.pco2,P(c.pco2),U,rp(35,45));
 if(!ven&&c.po2!=null&&lv>=4){const pr=ui1PO2Ref(c.fio2);row('PaO₂','po2',c.po2,P(c.po2),U,rp(pr[0],pr[1]),pr);}
 if(ven&&c.po2!=null&&lv>=4)row('PvO₂','po2v',c.po2,P(c.po2),U,'');
 row('HCO₃⁻','hco3',c.hco3,r1(c.hco3).toFixed(1),'mmol/L','22–26');
 if(lv>=2){const be=r1(beFrom(c.pH,c.hco3));row('BE','be',be,sgn(be)||'0','mmol/L','±2');}
 if(lv>=3){rows.push('<tr class="sep"><td colspan="4"></td></tr>');if(c.na!=null)row('Na⁺','na',c.na,c.na,'mmol/L','135–145');if(c.k!=null)row('K⁺','k',c.k,c.k.toFixed(1),'mmol/L','3.5–5.0');if(c.cl!=null)row('Cl⁻','cl',c.cl,c.cl,'mmol/L','98–106');if(c.alb!=null)row('Albumin','alb',c.alb,c.alb,'g/L','35–50');
  if(c.lac!=null)row('Lactate','lac',c.lac,c.lac.toFixed(1),'mmol/L','< 2.0');if(c.glu!=null)row('Glucose','glu',c.glu,c.glu.toFixed(1),'mmol/L','3.9–7.8');if(c.urea!=null&&o.urea)row('Urea','urea',c.urea,c.urea.toFixed(1),'mmol/L','2.5–7.8');if(c.osm!=null)row('Osm (meas.)','osm',c.osm,c.osm,'mOsm/kg','275–295');}
 if(c.cohb!=null)row('COHb','cohb',c.cohb,c.cohb.toFixed(1),'%','< 3');if(c.methb!=null)row('MetHb','methb',c.methb,c.methb.toFixed(1),'%','< 1.5');
 const head=(cord?(ven?'CORD VEIN':'CORD ARTERY'):ven?'VENOUS':'ARTERIAL')+(c.fio2&&lv>=4&&!ven&&!cord?' · FiO₂ '+c.fio2.toFixed(2):'')+(c.spo2!=null?' · SpO₂ '+c.spo2+'%':'');
 const temp=c.temp!=null&&Math.abs(c.temp-37)>=0.1?'Patient '+(+c.temp).toFixed(1)+' °C · at 37 °C':'37.0 °C';
 const alt=!ven&&!cord&&c.po2!=null&&lv>=4&&(+S.patm||760)<740;
 const sum=typeof ui2GasText==='function'?ui2GasText(c):'';
 return '<div class="slip'+(o.big?' big':'')+(ven?' ven':'')+'"><div class="sh"><span>'+head+'</span><span>'+temp+'</span></div><table>'+(sum?'<caption class="sr-only">'+esc(sum)+'</caption>':'')+rows.join('')+'</table>'+(alt?'<p class="note" style="margin:6px 0 0">PaO₂ range adjusted for altitude ('+P(+S.patm)+' '+U+').</p>':'')+(cord?'<p class="note" style="margin:6px 0 0">Adult reference ranges do not apply to cord blood.</p>':'')+'</div>';}

/* ---------- navigation with an error boundary ---------- */
const VIEWS=['today','learn','lesson','labs','tool','practice','session','progress','settings','web','scen','teach','est','flash','serial'];
const TABOF={lesson:'learn',tool:'labs',web:'labs',session:'practice',scen:'practice',teach:'practice',est:'practice',flash:'practice',serial:'practice'};
const RENDER={};
const SUBV=['session','lesson','tool','scen'];let SUBNAV=false;
function go(v,noHash,arg){if(!VIEWS.includes(v))v='today';
 if(VIEW==='session'&&v!=='session'&&typeof leaveSession==='function')leaveSession();
 VIEW=v;document.querySelectorAll('section.view').forEach(s=>s.hidden=s.id!=='v-'+v);
 const tab=TABOF[v]||v;{const sub=SUBV.includes(v);if(sub&&!SUBNAV){try{history.pushState({sub:1},'',location.href);}catch(e){}SUBNAV=true;}else if(!sub)SUBNAV=false;}
 document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-current',b.dataset.go===tab?'page':'false'));
 $('gearBtn').setAttribute('aria-current',v==='settings'?'page':'false');
 document.body.classList.toggle('insession',v==='session');
 if(RENDER[v])safe(()=>RENDER[v](arg),v);
 if(!noHash&&!['lesson','session','tool','scen'].includes(v)){try{
  /* Back from a top tab returns to Today first (Android habit); Back on Today leaves */
  const st=history.state,onToday=!location.hash||location.hash==='#today';
  if(v==='today'&&st&&st.tab&&location.hash!=='#today')history.back();
  else if(v!=='today'&&onToday&&!(st&&st.tab)){if(location.hash!=='#today')history.replaceState(st,'','#today');history.pushState({tab:1},'','#'+v);}
  else history.replaceState(st&&st.tab?st:null,'','#'+v);}catch(e){}}
 if(v==='labs'||v==='lesson')dispatchEvent(new Event('buffer:show'));
 window.scrollTo(0,0);renderHeader();if(typeof renderRoundBar==='function')renderRoundBar();
 if(typeof ui1Walk==='function')ui1Walk(document.body);
 ui1ToastsShort();if(typeof e2Sweep==='function')try{e2Sweep();}catch(e){}
 ui1Arrive(v);}
const VNAME={today:'Today',learn:'Learn',labs:'Labs',practice:'Practice',progress:'Progress',settings:'Settings',web:'Concept web',session:'Session',scen:'Shift',teach:'Teach it back',est:'Gas sense',flash:'Number flash',serial:'Serial gases'};
let ui1FromTab=false;
/* after a view change: page title, focus to the heading (or keep it on the tab pressed), and announce */
let ui1Booted=false;
function ui1Arrive(v){const fromTab=ui1FromTab,first=!ui1Booted;ui1FromTab=false;ui1Booted=true;
 requestAnimationFrame(()=>{if(VIEW!==v)return;const sec=$('v-'+v);if(!sec)return;const h=sec.querySelector('h1')||sec.querySelector('h2,h3');
  const name=(v==='today'||!h)?(VNAME[v]||v):h.textContent.trim().slice(0,60);
  try{document.title=name+' · Buffer';}catch(e){}
  if(document.querySelector('.sheet-scrim'))return;
  const ae=document.activeElement;if(ae&&sec.contains(ae)&&ae!==document.body&&/INPUT|SELECT|TEXTAREA/.test(ae.nodeName))return;
  if(first)return;
  if(fromTab){announce(VNAME[v]||name);return;}
  if(h){if(!h.hasAttribute('tabindex')){h.tabIndex=-1;h.style.outline='none';}try{h.focus({preventScroll:true});}catch(e){}}});}
function setHash(h){try{history.replaceState(null,'','#'+h);}catch(e){}}
function safe(fn,where){try{fn();}catch(e){console.error(e);const sec=$('v-'+(where||VIEW));if(sec)sec.innerHTML='<div class="card crash"><span class="eyebrow">Something went wrong</span><h2 style="margin:6px 0">This screen hit an error.</h2><p class="note">Your progress is saved. Try again, or go back to Today.</p><p class="note mono" style="margin-top:8px">'+esc(e&&e.message)+'</p><div class="btnrow" style="margin-top:12px"><button class="btn primary" id="crashRetry">Try again</button><button class="btn" data-go="today">Today</button></div></div>';const b=$('crashRetry');if(b)b.onclick=()=>go(where||VIEW,true);}}
addEventListener('error',e=>{console.error(e.error||e.message);toast('Something glitched. Your progress is safe.','bad');});
addEventListener('unhandledrejection',e=>{console.error(e.reason);});
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){e.preventDefault();ui1FromTab=!!b.closest('nav.tabs');go(b.dataset.go);}});
function renderHeader(){const s=streak();const el=$('hStreak')||$('hdr-streak');if(el){el.innerHTML='<span aria-hidden="true">🔥 '+s+'</span>'+ui1VH('Streak: '+s+' day'+(s===1?'':'s'));el.setAttribute('data-hint','Streak|Days in a row with at least one gas, lesson or Round. '+(s?'Today counts once you finish something.':''));}
 const x=$('hdr-xp');if(x){x.innerHTML='<span class="num">'+(S.xp||0)+'</span>&nbsp;XP';x.setAttribute('data-hint','XP · level '+(levelOf(S.xp||0)+1)+'|'+LEVELS[levelOf(S.xp||0)][1]+'. Earn XP from every right step, perfect gas, lesson question, estimate, teach-back, shift and boss.');}}

/* ---------- shared stats ---------- */
const KSHORT={hagma:'HAGMA',nagma:'NAGMA',malk:'Metabolic alkalosis',rac_a:'Acute resp. acidosis',rac_c:'Chronic resp. acidosis',rac_ac:'Acute-on-chronic resp. acidosis',ralk_a:'Acute resp. alkalosis',ralk_c:'Chronic resp. alkalosis',hag_rac:'HAGMA + resp. acidosis',hag_ralk:'HAGMA + resp. alkalosis',hag_malk:'HAGMA + met. alkalosis',hag_nag:'HAGMA + NAGMA',hag_malk_ralk:'Triple disorder',rac_malk:'Resp. acidosis + met. alkalosis',ralk_malk:'Resp. alkalosis + met. alkalosis'};
const KLESSON={hagma:'hagma',nagma:'nagma',malk:'malk',rac_a:'racid',rac_c:'racid',rac_ac:'copd',ralk_a:'ralk',ralk_c:'preg',hag_rac:'mixed',hag_ralk:'asa',hag_malk:'mixed',hag_nag:'nagma',hag_malk_ralk:'mixed',rac_malk:'racid',ralk_malk:'mixed'};
const STEPNAME={real:'Consistency check',ph:'pH',prim:'Primary process',comp:'Compensation',gap:'Anion gap',delta:'Δ ratio',read:'Full read',cause:'Cause',ox:'Oxygenation',whatif:'What happens next',fit:'Which gas fits',gym:'Compensation gym',boss:'Module check questions',serial:'Serial gases'};
function kindStat(k){return S.kinds[k]||(S.kinds[k]={n:0,c:0,box:0,due:0,last:0});}
function stepStat(c){S.steps=S.steps||{};return S.steps[c]||(S.steps[c]={n:0,c:0,h:[]});}
function stepAcc(c){const s=(S.steps||{})[c];if(!s||!s.n)return null;const h=s.h&&s.h.length>=5?s.h.slice(-20):null;return h?h.filter(Boolean).length/h.length:s.c/s.n;}
function recordStep(c,ok){const s=stepStat(c);s.n++;if(ok)s.c++;s.h=s.h||[];s.h.push(ok?1:0);if(s.h.length>40)s.h.shift();}
function dueKinds(){const now=Date.now();return Object.keys(KINDS).filter(k=>S.kinds[k]&&S.kinds[k].due<=now);}
function weakestStep(){let w=null,wa=2;['comp','delta','gap','prim','real','ox','ph'].forEach(c=>{const a=stepAcc(c);const n=((S.steps||{})[c]||{}).n||0;if(a!=null&&n>=3&&a<wa){wa=a;w=c;}});return w?{c:w,a:wa}:null;}
function median(a){if(!a.length)return 0;const s=a.slice().sort((x,y)=>x-y);return s[Math.floor(s.length/2)];}
function reflexStatus(){const h=S.reflex.hist;let best=0;for(const lv of [1,2,3,4]){const a=h.filter(x=>x.l===lv).slice(-20);if(a.length>=20){const acc=a.filter(x=>x.ok).length/20,med=median(a.map(x=>x.t));if(acc>=0.9&&med<=8000)best=lv;}}return best;}
function mastery(k){const s=S.kinds[k];if(!s||!s.n)return 0;return Math.min(5,s.box||0);}
function masteryScore(){const ks=Object.keys(KINDS);return Math.round(ks.reduce((a,k)=>a+mastery(k),0)/(ks.length*5)*100);}
function hookOfDay(){const hs=L.filter(l=>l.hook);return hs[dayNum()%hs.length];}

/* ---------- today ---------- */
/* beginners (under five lessons) get a single-disorder gas of the day */
function ui1Beginner(){return Object.keys(S.done).filter(k=>LBYID[k]).length<5;}
function gasOfDay(){const tier=ui1Beginner()?1:4;if(gasOfDay.c&&gasOfDay.d===dayNum()&&gasOfDay.t===tier)return gasOfDay.c;const ks=tier===1?['hagma','nagma','malk','rac_a','ralk_a'].filter(k=>KINDS[k]):Object.keys(KINDS);const c=withSeed(dayNum()*7919,()=>{for(let i=0;i<8;i++){const g=genCase(ks[Math.floor(Math.random()*ks.length)],4,{strict:true});if(g)return g;}return null;})||safeCase('hagma',4);gasOfDay.c=c;gasOfDay.d=dayNum();gasOfDay.t=tier;return c;}
function ui1Slot(){try{return typeof slotFor==='function'?slotFor(today()):'free';}catch(e){return 'free';}}
const ui1Num=n=>['No','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'][n]||String(n);
/* the Round hero: one source of truth with the builder (presetLegs at roundCap) */
function ui1Hero(){const slot=ui1Slot(),doneToday=S.lastRound===today(),inRound=!!ROUND;
 if(inRound){const R=ROUND,cur=R.legs[R.i];
  return '<div class="hero"><span class="eyebrow tag">'+(doneToday?'Bonus Round in progress':'Round in progress')+'</span><h2>Leg '+(R.i+1)+' of '+R.legs.length+(cur?' · '+esc(cur.label):'')+'</h2>'+
  '<ol class="hero-legs">'+R.legs.map((l,i)=>'<li class="'+(i<R.i?'done':i===R.i?'cur':'')+'"'+(i===R.i?' aria-current="step" style="border-left:4px solid var(--accent);padding-left:8px"':'')+'><span>'+(i>R.i?'<button class="linkbtn" data-leg="'+i+'" style="text-align:left;font-weight:400">'+esc(l.label)+ui1VH(' (jump to this leg)')+'</button>':esc(l.label)+(i<R.i?ui1VH(' (done)'):''))+'</span><small>'+l.min+' min</small></li>').join('')+'</ol>'+
  '<div class="btnrow"><button class="btn primary big" id="tRound">'+ic('play')+'Continue the Round</button><button class="btn small" id="tStop">Stop</button></div></div>';}
 if(doneToday)return '<div class="hero"><span class="eyebrow tag">Round complete</span><h2>Done for today. Anything else is a bonus.</h2><div class="btnrow"><button class="btn" id="tRound">'+ic('play')+'Another Round</button></div></div>';
 if(slot==='tough')return '<div class="hero"><span class="eyebrow tag">Night shift</span><h2>Buffer rests today.</h2><p class="note">Sleep beats study after a night. If a real gas comes in, read it with the interpreter.</p><div class="btnrow"><button class="btn" id="tRound">'+ic('play')+'Do a Round anyway</button></div></div>';
 const cap=typeof roundCap==='function'?roundCap():25,cat=typeof roundCatalog==='function'?roundCatalog():roundPlan();
 const legs=typeof presetLegs==='function'?presetLegs(cat,cap):cat,min=legs.reduce((a,l)=>a+l.min,0);
 return '<div class="hero"><span class="eyebrow tag">Today\'s Round · '+min+' min</span><h2>'+(slot==='postnight'?'A light Round after your night':ui1Num(legs.length)+' short leg'+(legs.length===1?'':'s')+', one sitting')+'</h2>'+
  '<ol class="hero-legs">'+legs.map(l=>'<li><span>'+esc(l.label)+'</span><small>'+l.min+' min</small></li>').join('')+'</ol>'+
  '<div class="btnrow"><button class="btn primary big" id="tRound">'+ic('play')+'Start the Round</button></div></div>';}
/* first run: orientation instead of the Round */
function ui1Fresh(){return !Object.keys(S.done).some(k=>LBYID[k])&&!S.read&&!(S.ui&&S.ui.welcomed)&&!ROUND;}
function ui1Welcome(){const u=S.units||'mmHg';return '<div class="hero"><span class="eyebrow tag">Start here</span><h2>Welcome to Buffer</h2>'+
 '<p class="note" style="margin:0">Learn teaches one idea at a time, with a few questions at the end. Practice drills the same six-step read on every gas. Today puts both into one short Round each day.</p>'+
 '<div class="btnrow"><button class="btn primary big" id="tStart">'+ic('play')+'Start lesson 1</button><button class="btn" id="tSkipW">I already read gases</button></div>'+
 '<div class="btnrow" role="group" aria-label="Pressure units"><span class="note">Units:</span>'+['mmHg','kPa'].map(x=>'<button class="btn small'+(u===x?' primary':'')+'" data-units="'+x+'" aria-pressed="'+(u===x)+'">'+x+'</button>').join('')+'<span class="note">kPa is used in UK exams.</span></div></div>';}
RENDER.today=function(){const el=$('v-today');const hr=new Date().getHours();const slot=ui1Slot();const greet=hr<5?(slot==='tough'?'Night shift.':'Up late.'):hr<12?'Good morning.':hr<17?'Good afternoon.':'Good evening.';
 const due=dueKinds(),w=weakestStep(),next=L.find(l=>!S.done[l.id])||null,mist=(S.mist||[]).length,n=todayN(),goal=S.goal||15;
 const fresh=ui1Fresh();
 const hk=hookOfDay();const g=gasOfDay();const ks=Object.keys(KINDS);const gRead=S.ui&&S.ui.gotd===today();
 const wh=w&&((S.steps||{})[w.c]||{}).h,wn=wh&&wh.length>=5?Math.min(20,wh.length):0,wc=wn?wh.slice(-wn).filter(Boolean).length:0;
 const lerr=typeof LOAD_ERR!=='undefined'&&LOAD_ERR,serr=typeof SAVE_OK!=='undefined'&&SAVE_OK===false;
 const paused=typeof SS!=='undefined'&&SS&&SS.paused&&!SS.done;
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+ddmmyyyy()+' · '+n+'/'+goal+' gases today</span><h1>'+greet+'</h1></div><div class="btnrow" style="align-items:center"><button class="btn" id="tRead">'+ic('interp')+'Read a gas</button>'+levelPill()+'</div></div>'+
 /* storage problems stay on Today until fixed (T29-7, T29-11) */
 (lerr?'<div class="card" role="alert" style="border-color:var(--bad)"><span class="eyebrow" style="color:var(--bad)">Saved progress</span><p style="margin:6px 0 0">'+esc(LOAD_ERR)+'</p><div class="btnrow" style="margin-top:10px"><button class="btn small" data-go="settings">Open Settings</button></div></div>':'')+
 (serr?'<div class="card" role="alert" style="border-color:var(--bad)"><span class="eyebrow" style="color:var(--bad)">Not saving</span><p style="margin:6px 0 0">Progress is not being saved (storage full). Copy a backup now.</p><div class="btnrow" style="margin-top:10px"><button class="btn small" data-go="settings">Back up in Settings</button></div></div>':'')+
 '<div class="today2"><div>'+
 (fresh?ui1Welcome():ui1Hero())+
 (paused?'<div class="due"><span class="mono-mark">'+ic('play')+'</span><p><b>Unfinished: '+esc(SS.title||(SS.mode==='boss'?qw('Boss','Module check')+' · '+((MBYID[SS.mod]||{}).t||''):(MODES[SS.mode]||{}).t||'Session'))+'</b> <span class="muted">'+SS.res.length+' of '+SS.n+' done.</span></p><button class="btn small primary" id="tResume">Resume session</button></div>':'')+
 (due.length?'<div class="due"><span class="mono-mark">'+ic('due')+'</span><p><b>'+due.length+' pattern'+(due.length>1?'s':'')+' due for review.</b> <span class="muted">Spaced at 1, 3, 7, 16 and 35 days.</span></p><button class="btn small primary" data-start="due">Review now</button></div>':'')+
 '<div class="quick">'+[['steps','Step by step',(S.sessLen||10)+' gases, marked step by step'],['gym','Gym','10 compensation sums'],['reflex','Reflex','20 timed gases'],['interp','Interpret','Paste a real gas']].map(q=>'<button class="qk" data-q="'+q[0]+'" aria-label="'+q[1]+'" aria-describedby="qkd-'+q[0]+'"><b>'+ic(q[0]==='interp'?'interp':q[0]==='gym'?'gym':q[0]==='reflex'?'timer':'steps',' width="20" height="20"')+'</b><span>'+q[1]+'</span><small id="qkd-'+q[0]+'">'+q[2]+'</small></button>').join('')+'</div>'+
 '</div><div>'+
 (fresh?'<div class="card"><span class="eyebrow">Gas of the day</span><p class="note" style="margin-top:6px">Opens after your first lesson. Each day brings one gas to read in a minute.</p></div>':
 '<div class="card gotd"><div style="display:flex;flex-direction:column;gap:10px;min-width:0"><span class="eyebrow">Gas of the day · '+ddmmyyyy()+(gRead?' · ✓ read today':'')+'</span><p class="vig">'+esc(g.vig)+'</p><p class="note">'+(ui1Beginner()?'A single-disorder gas until you have done five lessons. ':'')+'Read it in your head first: real? · pH · system · compensation · gaps · oxygen.</p><div class="btnrow"><button class="btn '+(gRead?'':'primary ')+'small" id="gotdGo">'+(gRead?'Review it':'Read it step by step')+'</button><button class="btn small" id="gotdShow" aria-expanded="false" aria-controls="gotdAns">Just show me</button></div><div id="gotdAns" hidden></div></div>'+slip(g,{lv:4})+'</div>')+
 (hk?'<div class="hook"><span class="tag">HOOK</span><p>'+esc(hk.hook)+' <button class="linkbtn" data-l="'+hk.id+'" style="font-weight:400">'+esc(hk.t)+' →</button></p></div>':'')+
 '<div class="grid2"><div class="card citrus" id="citrus-line"></div>'+
  (w?'<div class="card" style="display:flex;flex-direction:column;gap:8px"><span class="eyebrow">Weak spot</span><p><b>'+STEPNAME[w.c]+'</b> · '+(wn?wc+' of your last '+wn+' right.':Math.round(w.a*100)+'% right so far.')+'</p><div class="btnrow">'+(w.c==='comp'?'<button class="btn small primary" data-start="gym">Compensation gym</button>':'<button class="btn small primary" data-start="steps">Step-by-step session</button>')+'<button class="btn small" data-l="'+({comp:'comp',delta:'nderived',gap:'nderived',prim:'nph',real:'hh',ox:'oxread',ph:'ph'}[w.c]||'read6')+'">Lesson</button></div></div>':
   next?'<button class="tile" id="tLesson" aria-labelledby="tLessonM tLessonT" aria-describedby="tLessonD"><span class="mono-mark" aria-hidden="true">'+String(next.i+1).padStart(2,'0')+'</span><span><small class="meta" id="tLessonM">Next lesson · '+esc(MBYID[next.m].t)+'</small><b id="tLessonT">'+esc(next.t)+'</b><span class="d" id="tLessonD">'+esc(next.sum.length>120?next.sum.slice(0,117)+'…':next.sum)+'</span></span></button>':'<div class="card"><span class="eyebrow">All lessons done</span><p>Revisit any module from Learn when a topic feels rusty.</p></div>')+'</div>'+
 (mist?'<div class="due"><span class="mono-mark">'+ic('redo')+'</span><p><b>'+mist+' saved mistake'+(mist>1?'s':'')+'.</b> <span class="muted">Each leaves the list once every step is right.</span></p><button class="btn small" data-start="mist">Revisit</button></div>':'')+
 (!ks.some(k=>S.kinds[k]&&S.kinds[k].n)&&!(S.ui&&S.ui.mastAll)?'<div class="card"><div class="btnrow" style="justify-content:space-between"><div><span class="eyebrow">Mastery</span><p style="margin-top:4px">'+ks.length+' patterns · read your first gas to start the map.</p></div><button class="btn small" id="tMastAll">Show all</button></div></div>':
 '<div class="card"><div class="btnrow" style="justify-content:space-between;margin-bottom:10px"><div><span class="eyebrow">Mastery · '+masteryScore()+'%</span><h2 style="margin-top:4px">'+ks.length+' patterns</h2></div><div class="legend"><span>'+Object.keys(S.done).filter(k=>LBYID[k]).length+'/'+L.length+' lessons</span><span>'+S.read+' gases</span></div></div><div class="mast">'+ks.map(k=>{const m=mastery(k),s=S.kinds[k],isDue=due.includes(k);return '<div class="mtw"><button class="mt'+(isDue?' due':'')+'" data-k="'+k+'" data-hint="'+esc(KSHORT[k])+'|Stage '+m+' of 5 in spaced review'+(s&&s.n?' · '+Math.round(s.c/s.n*100)+'% of '+s.n:'')+'. Tap to drill it; ⋯ for more."><b>'+esc(KSHORT[k])+'</b><span class="dots">'+[1,2,3,4,5].map(i=>'<i'+(i<=m?' class="on"':'')+'></i>').join('')+'</span><small>'+(s&&s.n?Math.round(s.c/s.n*100)+'% · '+s.n+(isDue?' · due':''):'new')+'</small></button><button class="iconbtn kitmore" data-kitmore="" aria-label="More actions for '+esc(KSHORT[k])+'" aria-haspopup="dialog"><span aria-hidden="true">⋯</span></button></div>';}).join('')+'</div></div>')+
 '</div></div>';
 if($('tRound'))$('tRound').onclick=()=>{if(ROUND)roundGo();else startRound();};if($('tStop'))$('tStop').onclick=()=>{stopRound();RENDER.today();};
 $('tRead').onclick=()=>openTool('interp');
 if($('tResume'))$('tResume').onclick=()=>go('session');
 el.querySelectorAll('[data-leg]').forEach(b=>b.onclick=()=>{if(!ROUND)return;ROUND.i=+b.dataset.leg;S.round=ROUND;save();roundGo();});
 if($('tStart'))$('tStart').onclick=()=>openLesson(L[0].id);
 if($('tSkipW'))$('tSkipW').onclick=()=>{S.ui=S.ui||{};S.ui.welcomed=1;save();RENDER.today();const h=$('v-today').querySelector('.hero h2');if(h){h.tabIndex=-1;h.focus();}};
 el.querySelectorAll('[data-units]').forEach(b=>b.onclick=()=>{S.units=b.dataset.units;save();RENDER.today();const f=$('v-today').querySelector('[data-units="'+S.units+'"]');if(f)f.focus();announce('Units: '+S.units);});
 if($('tMastAll'))$('tMastAll').onclick=()=>{S.ui=S.ui||{};S.ui.mastAll=1;save();RENDER.today();};
 if($('tLesson'))$('tLesson').onclick=()=>openLesson(next.id);
 el.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startSession(b.dataset.start));
 el.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const q=b.dataset.q;if(q==='interp')openTool('interp');else startSession(q);});
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>openLesson(b.dataset.l));
 el.querySelectorAll('.mt[data-k]').forEach(b=>b.onclick=()=>startSession('steps',{kind:b.dataset.k}));
 if($('gotdGo'))$('gotdGo').onclick=()=>startSession('gotd');
 if($('gotdShow'))$('gotdShow').onclick=()=>{const a=$('gotdAns'),b=$('gotdShow'),open=a.hidden;a.hidden=!open;b.setAttribute('aria-expanded',open);b.textContent=open?'Hide the answer':'Just show me';if(!open)return;
  const st=k=>(g.o.steps||[]).find(s=>s.k===k),cp=st('comp'),gp=st('gap');
  a.innerHTML='<div class="bigread">'+esc(g.o.label)+'</div><p class="note">'+esc(CAUSES[g.cause]||'')+'.</p>'+(cp?'<p class="note"><b>Compensation:</b> '+esc(cp.v)+'.</p>':'')+(gp&&gp.tone!=='info'?'<p class="note"><b>Gaps:</b> '+esc(gp.v)+'. '+esc(gp.d||'')+'</p>':'');announce(g.o.label);};
 if(typeof renderCitrusLine==='function')renderCitrusLine();};

/* ---------- learn ---------- */
const METHOD=[['Real?','Fits the patient and sample? Henderson check.'],['pH','Acidaemia, alkalaemia, or normal but check.'],['System','Which value moved with the pH?'],['Compensation','Winter\'s, 0.7 × HCO₃⁻ + 20, 1·4·2·5.'],['Gaps','Anion gap with albumin, Δ ratio, osmolar gap.'],['Oxygen','P/F, A–a, failure type, co-oximetry.']];
function moduleBossPool(mid){return L.filter(l=>l.m===mid).flatMap(l=>(l.q||[]).map(q=>({q:q[0],opts:q[1],a:q[1][q[2]],why:q[3],lesson:l.id,fixed:!!(q[4]&&q[4].fixed)})));}
RENDER.learn=function(){const el=$('v-learn');const open=(S.ui&&S.ui.mod)||(L.find(l=>!S.done[l.id])||L[0]).m;
 const doneL=Object.keys(S.done).filter(k=>LBYID[k]).length;const nb=Object.keys(S.badges||{}).filter(k=>/^m-/.test(k)&&MBYID[k.slice(2)]).length;
 const lread=(S.ui&&S.ui.lread)||{};
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+doneL+' of '+L.length+' lessons · '+nb+' '+qw('boss badge','module check')+(nb===1?'':'s')+(S.quiet!==false?' passed':'')+'</span><h1>Learn</h1><p>From the proton to the bedside. '+qw('Each module ends in a boss fight.','Each module ends in a short check.')+'</p></div><button class="btn primary" id="lContinue">'+ic('play')+'Continue</button></div>'+
 '<div class="card"><span class="eyebrow" style="display:block;margin-bottom:10px">The six-step read · same order, every gas</span><div class="method6">'+METHOD.map(m=>'<div><b>'+m[0]+'</b><span>'+m[1]+'</span></div>').join('')+'</div></div>'+
 '<div class="tiles"><button class="tile" data-go="web"><span class="mono-mark">'+ic('web')+'</span><span><b>Concept web</b><span class="d">'+WEB_NODES.length+' ideas, every link labelled. Tap one to see what it depends on and what it changes.</span></span></button><button class="tile" id="lPocket"><span class="mono-mark">'+ic('pocket')+'</span><span><b>Pocket card</b><span class="d">The whole read, the formulas and the normal values on one screen.</span></span></button></div>'+
 '<div class="mlist">'+MODS.map((m,i)=>{const ls=L.filter(l=>l.m===m.id),d=ls.filter(l=>S.done[l.id]).length,isOpen=m.id===open;const pool=moduleBossPool(m.id);const won=S.badges&&S.badges['m-'+m.id];
  return '<div class="mrow'+(d===ls.length?' done':'')+'" data-open="'+(isOpen?1:0)+'" data-m="'+m.id+'"><button class="mh" aria-expanded="'+isOpen+'"><span class="numk">'+(d===ls.length?ic('check',' width="18" height="18"'):i===0?ic('play',' width="18" height="18"'):String(i).padStart(2,'0'))+'</span><span style="min-width:0"><h3 aria-level="2">'+esc(m.t)+(won?' <span class="chip good" style="vertical-align:2px">'+qw('BOSS','CHECK')+' ✓</span>':'')+'</h3><p>'+esc(m.d)+'</p></span><span class="prog">'+d+'/'+ls.length+'</span><span class="chev">'+ic('chev',' width="18" height="18"')+'</span></button><div class="llist"'+(isOpen?'':' hidden')+'>'+ls.map(l=>{const dn=S.done[l.id],rd=!dn&&lread[l.id];return '<button data-l="'+l.id+'"><span class="ck'+(dn?' on':'')+'"'+(rd?' style="background:linear-gradient(135deg,var(--good) 50%,transparent 50%)"':'')+'>'+(dn?ic('check'):'')+'</span><span>'+esc(l.t)+ui1VH(dn?' (done)':rd?' (read, questions left)':'')+'</span><small>'+(rd?'QUESTIONS LEFT':l.w&&l.w.length?'INTERACTIVE':l.ex?'WORKED GAS':'')+'</small></button><button class="iconbtn kitmore" data-kitmore="" aria-label="More actions for '+esc(l.t)+'" aria-haspopup="dialog"><span aria-hidden="true">⋯</span></button>';}).join('')+(pool.length>=4&&m.id!=='start'?'<div class="bossrow"><button class="btn small'+(won?'':' primary')+'" data-boss="'+m.id+'">'+ic('boss')+(won?qw('Rematch','Retake the check'):qw('Boss fight','Module check'))+'</button><span class="note">'+Math.min(10,pool.length)+' questions in '+Math.max(3,Math.ceil(Math.min(10,pool.length)*0.6))+' min · '+Math.ceil(Math.min(10,pool.length)*0.8)+' right to '+qw('win','pass')+(won?' · '+qw('won','passed')+' '+won:'')+'</span></div>':'')+'</div></div>';}).join('')+'</div>';
 $('lContinue').onclick=()=>openLesson((L.find(l=>!S.done[l.id])||L[0]).id);
 $('lPocket').onclick=()=>openTool('pocket');
 el.querySelectorAll('.mrow>button.mh').forEach(b=>b.onclick=()=>{const row=b.parentElement,isOpen=row.dataset.open==='1';row.dataset.open=isOpen?'0':'1';b.setAttribute('aria-expanded',!isOpen);row.querySelector('.llist').hidden=isOpen;S.ui=S.ui||{};S.ui.mod=isOpen?null:row.dataset.m;save();});
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>openLesson(b.dataset.l));
 el.querySelectorAll('[data-boss]').forEach(b=>b.onclick=()=>startSession('boss',{mod:b.dataset.boss}));};

/* ---------- lesson ---------- */
let CUR=null;
function openLesson(id){const l=LBYID[id];if(!l)return;CUR=l;go('lesson',true);setHash('l-'+id);safe(()=>renderLesson(l),'lesson');}
function renderLesson(l){const el=$('v-lesson');const m=MBYID[l.m];const prev=L[l.i-1],next=L[l.i+1];const tbs=TEACH.filter(t=>t.lesson===l.id),tb=tbs[0];const tbName=c=>((WEB_NODES.find(x=>x[0]===c)||[])[1]||c);const nodes=WEB_NODES.filter(n=>n[4]===l.id);
 const ml=L.filter(x=>x.m===l.m),mk=ml.indexOf(l)+1,md=ml.filter(x=>S.done[x.id]).length;
 el.innerHTML='<div class="crumbs"><button data-go="learn"><span aria-hidden="true">← </span>Learn</button><span class="eyebrow">'+(m.i===0?'Intro':'Module '+m.i)+' · '+esc(m.t)+'</span><span class="eyebrow" style="margin-left:auto;color:var(--muted)">Lesson '+mk+' of '+ml.length+'</span></div><div class="lprog" role="img" aria-label="'+md+' of '+ml.length+' lessons in this module done"><i style="width:'+(md/ml.length*100)+'%"></i></div>'+
 '<div class="lhead"><h1>'+esc(l.t)+'</h1><p class="summary">'+l.sum+'</p></div>'+
 '<div class="lgrid"><article class="card prose">'+String(l.body).replace(/<h3(?=[\s>])/g,'<h3 aria-level="2"')+'</article><aside class="side"><div class="card"><span class="eyebrow" role="heading" aria-level="2" style="display:block;margin-bottom:10px">Key numbers</span><dl class="keys">'+(l.keys||[]).map(k=>'<div><dt>'+esc(k[0])+'</dt><dd>'+esc(k[1])+'</dd></div>').join('')+'</dl></div>'+(l.hook?'<div class="card pearl"><span class="eyebrow" style="display:block;margin-bottom:6px">Make it stick</span><p>'+esc(l.hook)+'</p></div>':'')+(l.ex?'<div class="card"><span class="eyebrow" style="display:block;margin-bottom:10px">Worked gas</span>'+(l.ex.stem?'<p class="note" style="margin:0 0 10px">'+esc(l.ex.stem)+'</p>':'')+'<div id="lEx"></div>'+(l.exNote||l.ex.note?'<p class="note" style="margin:10px 0 0">'+esc(l.exNote||l.ex.note)+'</p>':'')+'<button class="btn" id="lExGo" style="margin-top:14px;width:100%">Open in the Interpreter</button></div>':'')+
  ((tb||nodes.length)?'<div class="card" style="display:flex;flex-direction:column;gap:8px"><span class="eyebrow">Connect it</span>'+(nodes.length?'<div class="btnrow">'+nodes.slice(0,4).map(n=>'<button class="btn small" data-node="'+n[0]+'">'+ic('web')+esc(n[1])+'</button>').join('')+'</div>':'')+(tbs.length?'<div class="btnrow">'+tbs.map(t=>'<button class="btn small" data-tb="'+esc(t.c)+'">'+ic('teach')+'Teach it back'+(tbs.length>1?': '+esc(tbName(t.c)):'')+'</button>').join('')+'</div>':'')+'</div>':'')+'</aside></div>'+
 '<div id="lW" style="display:flex;flex-direction:column;gap:14px"></div>'+
 '<div class="card"><span class="eyebrow">Check yourself</span><h2 style="margin:4px 0 16px">Retrieve it before you move on</h2><div id="lQLast"></div><div class="qs" id="lQ"></div></div>'+
 (function(){const ss=lessonSources(l);return ss.length?'<details class="card srcs"><summary><span class="eyebrow">Sources · '+ss.length+'</span></summary><ol class="note" style="margin:10px 0 0;padding-left:20px;display:grid;gap:6px">'+ss.map(s=>'<li>'+esc(s[1])+(s[2]?' <a href="https://doi.org/'+esc(s[2])+'" target="_blank" rel="noopener">doi:'+esc(s[2])+'</a>':'')+'</li>').join('')+'</ol></details>':'';})()+
 '<div class="pager"><button class="btn" id="lPrev"><span aria-hidden="true">← </span>'+(prev?esc(prev.t):'Learn')+'</button><button class="btn primary" id="lNext">'+(next?'Next: '+esc(next.t):'Finish: start practising')+'<span aria-hidden="true"> →</span></button></div>';
 if(l.ex){const c=Object.assign({},l.ex);if(c.hco3==null)c.hco3=r1(hFrom(c.pH,c.pco2));$('lEx').innerHTML=slip(c,{lv:4,urea:!!c.osm});$('lExGo').onclick=()=>{loadInterp(l.ex);openTool('interp');};}
 el.querySelectorAll('[data-tb]').forEach(b=>b.onclick=()=>{TB_PICK=b.dataset.tb;TB=null;go('teach');});
 el.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>{WEBSEL=b.dataset.node;go('web');});
 const w=$('lW');(l.w||[]).forEach(id=>{try{mountW(w,id,(l.wopt||{})[id]);}catch(e){console.error(e);}});
 ui1Questions(l);
 $('lPrev').onclick=()=>prev?openLesson(prev.id):go('learn');
 /* a lesson is done only when its questions are answered; Next without them marks it read */
 $('lNext').onclick=()=>{if(!S.done[l.id]){if(!l.q||!l.q.length){S.done[l.id]=Date.now();addXP(15);}else{S.ui=S.ui||{};S.ui.lread=S.ui.lread||{};S.ui.lread[l.id]=1;toast('Marked as read. The questions are waiting when you come back.');}save();}next?openLesson(next.id):go('practice');};
 window.scrollTo(0,0);}

/* lesson questions: fixed order when q[4].fixed, results kept per question (S.qs[id].last), focus and announce feedback */
function ui1Questions(l,missFirst){const q=$('lQ'),hd=$('lQLast');if(!q)return;const qs=l.q||[];
 const st0=S.qs[l.id]||{},last=Array.isArray(st0.last)&&st0.last.length===qs.length?st0.last:null;
 const missed=last?qs.map((_,i)=>i).filter(i=>last[i]===false):[];
 if(hd){const known=last?last.filter(x=>x!=null).length:0,right=last?last.filter(x=>x===true).length:0;
  hd.innerHTML=known?'<div class="btnrow" style="margin:-6px 0 12px"><span class="chip'+(missed.length?'':' good')+'">Last time '+right+'/'+known+'</span>'+(missed.length&&!missFirst?'<button class="btn small" id="lRetry">'+ic('redo')+'Retry missed ('+missed.length+')</button>':'')+'</div>':'';
  const rb=$('lRetry');if(rb)rb.onclick=()=>{ui1Questions(l,true);const f=q.querySelector('.qitem p');if(f){f.tabIndex=-1;f.focus();}};}
 const order=qs.map((_,i)=>i);if(missFirst)order.sort((a,b)=>(missed.includes(b)?1:0)-(missed.includes(a)?1:0));
 const res={};
 q.innerHTML=order.map((qi,n)=>{const it=qs[qi],fixed=it[4]&&it[4].fixed,opts=it[1].map((o,oi)=>[o,oi]);return '<div class="qitem" data-qi="'+qi+'"><p id="lq'+l.id+qi+'">'+(n+1)+'. '+(missFirst&&missed.includes(qi)?'<span class="chip">Missed last time</span> ':'')+it[0]+'</p><div class="opts" role="group" aria-labelledby="lq'+l.id+qi+'">'+(fixed?opts:shuffle(opts)).map((x,k)=>'<button class="opt" data-oi="'+x[1]+'"><kbd>'+'ABCD'[k]+'</kbd><span>'+x[0]+'</span></button>').join('')+'</div><p class="why" role="status" tabindex="-1" hidden></p></div>';}).join('');
 q.querySelectorAll('.qitem').forEach(div=>{const qi=+div.dataset.qi,it=qs[qi];div.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(b.disabled)return;const oi=+b.dataset.oi,ok=oi===it[2];
   const w2=div.querySelector('.why');w2.hidden=false;w2.className='why '+(ok?'ok':'no');w2.innerHTML='<b>'+(ok?'Correct.':'Not quite.')+'</b> '+it[3];
   div.querySelectorAll('.opt').forEach(x=>{const r=+x.dataset.oi===it[2];if(r){x.classList.add('right');x.querySelector('kbd').textContent='✓';x.insertAdjacentHTML('beforeend',ui1VH(' (correct)'));}else if(x===b){x.classList.add('wrong');x.querySelector('kbd').textContent='✗';x.insertAdjacentHTML('beforeend',ui1VH(' (your answer)'));}});
   try{w2.focus({preventScroll:true});}catch(e){}
   div.querySelectorAll('.opt').forEach(x=>x.disabled=true);
   res[qi]=ok;const st=S.qs[l.id]||(S.qs[l.id]={c:0,n:0});st.n++;st.last=Array.isArray(st.last)&&st.last.length===qs.length?st.last:qs.map(()=>null);st.last[qi]=ok;
   S.qmiss=S.qmiss||{};const key=l.id+':'+qi;if(ok){st.c++;addXP(5);delete S.qmiss[key];}else S.qmiss[key]=Date.now();touchDay();
   const nAns=Object.keys(res).length;
   if(nAns===qs.length){const right=Object.values(res).filter(Boolean).length;
    if(!S.done[l.id]){S.done[l.id]=Date.now();/* a time, not 1: hub.js keeps lessons finished after a reset elsewhere (T25-3) */if(S.ui&&S.ui.lread)delete S.ui.lread[l.id];addXP(15);toast('Lesson complete · '+right+' of '+qs.length+' right · +15 XP','good');}
    else announce(right+' of '+qs.length+' right.');}
   save();});});}
/* Quiet mode: game words become plain words */
/* Safety net only: write quiet text at source with qw(game,plain). Runs synchronously (MutationObserver microtask,
   before paint) on the changed subtrees only, so game words never flash. */
let ui1Walk=null;
(function(){const MAP=[[/Final boss/g,'Final check'],[/Boss fight/g,'Module check'],[/boss fight/g,'module check'],[/BOSS ✓/g,'CHECK ✓'],[/Boss beaten again/g,'Check passed again'],[/Boss beaten\. Badge earned\./g,'Check passed.'],[/Boss ·/g,'Check ·'],[/Module boss/g,'Module check'],[/\b1 boss badge\b/g,'1 module check'],[/boss badges/g,'module checks'],[/boss badge/g,'module check'],[/Native reader\. Badge earned\./g,'Final check passed.'],[/Ten right earns the Native reader badge\./g,'Ten right passes the final check.'],[/\s*[·,]?\s*\+\d+ XP/g,''],[/Earn XP from every[^.]*\./g,'Every answer builds mastery.']];
const fix=n=>{const p=n.parentNode;if(!p||/SCRIPT|STYLE|TEXTAREA/.test(p.nodeName)||(p.isContentEditable))return;let v=n.nodeValue,o=v;if(!v||!/oss|XP|Native|Ten right/.test(v))return;for(const [a,b] of MAP)v=v.replace(a,b);if(v!==o)n.nodeValue=v;};
function walk(root){if(S.quiet===false||!root)return;if(root.nodeType===3){fix(root);return;}if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())fix(n);}
ui1Walk=walk;
window.addEventListener('DOMContentLoaded',()=>{walk(document.body);new MutationObserver(recs=>{if(S.quiet===false)return;for(const r of recs){if(r.type==='characterData')fix(r.target);else r.addedNodes.forEach(walk);}}).observe(document.body,{childList:true,subtree:true,characterData:true});});})();
