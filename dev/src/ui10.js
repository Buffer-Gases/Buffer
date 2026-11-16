/* ================= 4.9: photo of a printout — on-device text recognition, then you confirm every number ================= */
const OCR_JS='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
let OCR_LOAD=null;
function loadOCR(){if(window.Tesseract)return Promise.resolve(window.Tesseract);if(OCR_LOAD)return OCR_LOAD;
 /* crossOrigin: a CORS response (not an opaque one), so the service worker can keep it for offline use; a failed try leaves no script tag behind and can be retried */
 OCR_LOAD=new Promise((res,rej)=>{const s=document.createElement('script');s.src=OCR_JS;s.async=true;s.crossOrigin='anonymous';const fail=()=>{OCR_LOAD=null;s.remove();rej(ocrErr('download'));};s.onload=()=>window.Tesseract?res(window.Tesseract):fail();s.onerror=fail;document.head.appendChild(s);});return OCR_LOAD;}
function ocrErr(code,e){const x=new Error(code+(e&&e.message?': '+e.message:''));x.code=code;return x;}
/* fix the usual misreads on analyser printouts before the paste parser sees the text */
function ocrClean(t){ocrClean.fixed=[];return String(t||'')
 .replace(/\b([pP])\s*([aAvV]?)\s*[cC]{1,2}\s*[oO0Q]{1,2}\s*[2zZ]\b/g,'$1$2CO2').replace(/\b([pP])\s*([aAvV]?)\s*[oO0Q]\s*[2zZ]\b/g,'$1$2O2')
 .replace(/\b(c?)H\s*C\s*[oO0]\s*[3]/gi,'$1HCO3').replace(/\bC\s*[oO0]\s*Hb\b/gi,'COHb').replace(/\bMet\s*Hb\b/gi,'MetHb').replace(/\bF\s*i\s*[oO0]\s*2\b/gi,'FiO2')
 .replace(/mmH[qg9]/gi,'mmHg').replace(/k\s*P\s*a/gi,'kPa').replace(/(\d)\s*[,·]\s*(\d)/g,'$1.$2')
 .replace(/\bF\s*[iI1l]?\s*[oO0]\s*2\s*\(\s*[iIl1|]\s*\)/g,'FiO2')/* Radiometer FO2(I) */.replace(/\b(F?)C\s*[oO0]\s*Hb\b/g,'$1COHb')
 .replace(/(\d)[oO](\d)/g,'$10$2').replace(/(\d)[lI|](\d)/g,'$11$2').replace(/\bp\s*H\b/g,'pH').replace(/\b(c?)Na[t*]{1,2}\+?/g,'$1Na+').replace(/\b(c?)K[t*]{1,2}\+?(?=\s)/g,'$1K+').replace(/\b(c?)C[l1I][\-~]/g,'$1Cl-')
 /* inside a number: dotted or slashed zeros (O o @ Ø) and l I | for 1, also at the start or end ('l.l', '@.5', '14O'); a leading zero means a lost decimal point ('05' is 0.5) */
 .replace(/(^|[\s:=(\[])([0-9OoIl|@Øø]*[0-9][0-9OoIl|@Øø.]*|[OoIl|@Øø]+\.[0-9OoIl|@Øø]+)(?=$|[\s%)\],;])/gm,(m,p,tok)=>{let s=tok.replace(/[Oo@Øø]/g,'0').replace(/[lI|]/g,'1');if(/^0\d+$/.test(s)){s='0.'+s.slice(1);ocrClean.fixed.push(tok+' → '+s);}return p+s;})
 .replace(/\bpH(\s*[:=]?\s*)([67])(\d{3})(?![\d.])/g,(m,g,a,b)=>{ocrClean.fixed.push('pH '+a+b+' → '+a+'.'+b);return 'pH'+g+a+'.'+b;});}
ocrClean.fixed=[];
/* pass 1 canvas: grey, contrast stretched (1st–99th percentile), about 2000 px on the long side (big camera photos are scaled down: speed, memory, iOS canvas limits).
   Inverted only when the centre of the photo is dark (a screen photo), not when the paper sits on a dark desk. */
function ocrPrep(img){const sc=Math.min(2.5,2000/Math.max(img.width||1,img.height||1)),W=Math.max(1,Math.round(img.width*sc)),H=Math.max(1,Math.round(img.height*sc));
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,W,H);
 const d=x.getImageData(0,0,W,H),p=d.data,n=W*H,g=new Uint8ClampedArray(n),hist=new Uint32Array(256),mid=new Uint32Array(256);
 for(let j=0,i=0;j<n;j++,i+=4){const v=(0.299*p[i]+0.587*p[i+1]+0.114*p[i+2])|0;g[j]=v;hist[v]++;const yy=(j/W)|0,xx=j-yy*W;if(xx>W/4&&xx<3*W/4&&yy>H/4&&yy<3*H/4)mid[v]++;}
 const pct=(h,q)=>{let tot=0;for(let v=0;v<256;v++)tot+=h[v];let a=0;for(let v=0;v<256;v++){a+=h[v];if(a>=tot*q)return v;}return 255;};
 const lo=pct(hist,0.01),hi=pct(hist,0.99),span=Math.max(30,hi-lo),inv=pct(mid,0.5)<100;
 for(let j=0,i=0;j<n;j++,i+=4){let v=(g[j]-lo)*255/span;v=v<0?0:v>255?255:v;if(inv)v=255-v;g[j]=v;p[i]=p[i+1]=p[i+2]=v;}
 x.putImageData(d,0,0);return {cv,x,g,W,H,inv};}
/* pass 2 (faded or shadowed thermal paper): local threshold, a pixel is ink when it is darker than its neighbourhood mean by OCR_BIN.off (integral image) */
const OCR_BIN={div:60,off:12};
function ocrBin(P){const {g,W,H,x}=P,r=Math.max(6,Math.round(Math.max(W,H)/OCR_BIN.div/2)),S1=W+1,I=new Uint32Array(S1*(H+1));
 for(let y=0;y<H;y++){let row=0;for(let xx=0;xx<W;xx++){row+=g[y*W+xx];I[(y+1)*S1+xx+1]=I[y*S1+xx+1]+row;}}
 const d=x.createImageData(W,H),p=d.data;
 for(let y=0;y<H;y++){const y0=Math.max(0,y-r),y1=Math.min(H,y+r+1);for(let xx=0;xx<W;xx++){const x0=Math.max(0,xx-r),x1=Math.min(W,xx+r+1),a=(y1-y0)*(x1-x0),s=I[y1*S1+x1]-I[y0*S1+x1]-I[y1*S1+x0]+I[y0*S1+x0],j=y*W+xx,v=g[j]*a<s-OCR_BIN.off*a?0:255,i=j*4;p[i]=p[i+1]=p[i+2]=v;p[i+3]=255;}}
 x.putImageData(d,0,0);}
/* the photo as taken (not the processed canvas), small enough to keep in memory, for comparing in the sheet */
function ocrThumb(img){const sc=Math.min(1,1100/Math.max(img.width||1,img.height||1)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*sc));c.height=Math.max(1,Math.round(img.height*sc));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const u=c.toDataURL('image/jpeg',0.75);c.width=c.height=0;return u;}
/* how good a read is: values found, pH and PCO2 present, Henderson fit */
function ocrScore(text){const r=parseGas(ocrClean(text)),v=r.v,core=v.pH!=null&&v.pco2!=null;let fit=false;if(core&&v.hco3)fit=Math.abs(24*v.pco2/v.hco3-Math.pow(10,9-v.pH))/Math.pow(10,9-v.pH)<=0.1;return {n:r.got.length,core,fit,s:r.got.length+(core?2:0)+(fit?3:0)};}
/* onProg(kind,p): kind 'load' (first download), 'read', 'retry'. mode 2 = the contrast pass only (the sheet's 'Read again with more contrast') */
async function ocrImage(file,onProg,mode){if(!file||(file.type&&!/^image\//.test(file.type)))throw ocrErr('notimage');
 const T=await loadOCR();const u=URL.createObjectURL(file);let img;
 try{img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(ocrErr('notimage'));i.src=u;});}finally{URL.revokeObjectURL(u);}
 if(!img.width||!img.height)throw ocrErr('notimage');
 const thumb=ocrThumb(img),P=ocrPrep(img);img.src='';img=null;const prog=(k,p)=>{try{if(onProg)onProg(k,p);}catch(e){}};let w=null;
 try{try{w=await T.createWorker('eng',1,{logger:m=>{const s=String(m&&m.status||'');if(s==='recognizing text')prog('read',m.progress);else if(/load/i.test(s))prog('load',m.progress);}});}
  catch(e){throw ocrErr(navigator.onLine===false||/fetch|network|load|import|404|failed/i.test(String(e&&e.message||e))?'download':'engine',e);}
  try{await w.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});}catch(e){}/* single block: columns stay on one line */
  let best=null;
  if(mode!==2){const q1=await w.recognize(P.cv);best={text:q1.data.text,pass:1,sc:ocrScore(q1.data.text)};}
  if(!best||best.sc.n<4||!best.sc.core||mode===2){prog('retry');ocrBin(P);const r2=await w.recognize(P.cv);const b={text:r2.data.text,pass:2,sc:ocrScore(r2.data.text)};if(!best||b.sc.s>best.sc.s)best=b;}
  return {text:best.text,thumb,pass:best.pass};}
 catch(e){throw e&&e.code?e:ocrErr('engine',e);}
 finally{try{if(w)w.terminate();}catch(e){}P.cv.width=P.cv.height=0;P.g=null;}}
/* the confirm sheet. Every value read from the photo starts unconfirmed. Red = not possible (LIMITS, e1.js); amber = unusual or a known slip:
   a lost decimal point, a temperature-corrected (T) row, standard bicarbonate, a number sitting next to a reference range. Under each value: the printout line it came from. */
const OCR_FIELDS=[['pH','pH',''],['pco2','PCO₂','P'],['po2','PO₂','P'],['hco3','HCO₃⁻','mmol/L'],['na','Na⁺','mmol/L'],['k','K⁺','mmol/L'],['cl','Cl⁻','mmol/L'],['lac','Lactate','mmol/L'],['glu','Glucose','mmol/L'],['alb','Albumin','g/L'],['fio2','FiO₂','0–1'],['cohb','COHb','%'],['methb','MetHb','%'],['urea','Urea','mmol/L'],['osm','Osmolality','mOsm/kg'],['bhb','Ketones (BHB)','mmol/L'],['spo2','SpO₂','%'],['age','Age','years']];
const OCR_USUAL={pH:[7,7.7],pco2:[15,100],po2:[30,550],hco3:[5,45],na:[120,160],k:[2.5,7],cl:[80,125],lac:[0,15],glu:[2.5,35],alb:[15,55],fio2:[0.21,1],cohb:[0,5],methb:[0,3],urea:[1,40],osm:[260,340],bhb:[0,6],spo2:[75,100]};
const OCR_DEC={k:10,lac:30,cohb:2,methb:2,bhb:10};/* printed with a decimal place: a whole number at or above this may have lost its point */
if(typeof ICON!=='undefined'&&!ICON.camera)ICON.camera='<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><rect x="9" y="10" width="6" height="6"/>';
const ocrRx=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function ocrLine(clean,src){const num=(String(src||'').match(/(\d+(?:\.\d+)?)(?!.*\d)/)||[])[1];if(!num)return null;const lab=String(src).trim().split(/[\s:]/)[0].toLowerCase().slice(0,3),re=new RegExp('(^|[^\\d.])'+ocrRx(num)+'(?!\\d)');
 const L=String(clean||'').split('\n'),ln=L.find(l=>l.toLowerCase().includes(lab)&&re.test(l))||L.find(l=>re.test(l));return ln?{line:ln.trim().replace(/\s+/g,' '),num}:null;}
function ocrInRange(line,num){const n=ocrRx(num);return new RegExp('[\\[({]\\s*'+n+'(?![\\d.])|(^|[^\\d.])'+n+'\\s*[\\])}]|\\d\\s*-\\s*'+n+'(?![\\d.])|(^|[^\\d.])'+n+'\\s*-\\s*\\d').test(line);}
function ocrFlags(k,v,inf,src,fixed){const f=[];if(v==null)return f;const Lm=typeof LIMITS!=='undefined'?LIMITS[k]:null,U=OCR_USUAL[k],num=inf&&inf.num,mm=k==='pco2'||k==='po2'?' mmHg':'';
 /* the limits are stored in mmHg; show them in the user's unit (T12) */
 const rg=mm&&S.units==='kPa'?(Lm?+(Lm[0]/KPA).toFixed(1)+'–'+(+(Lm[1]/KPA).toFixed(1))+' kPa':''):Lm?Lm[0]+'–'+Lm[1]+mm:'';
 if(Lm&&(v<Lm[0]||v>Lm[1]))f.push(['bad','Not possible (range '+rg+'). Probably misread.']);else if(U&&(v<U[0]||v>U[1]))f.push(['warn','Unusual value: check it.']);
 if(num&&OCR_DEC[k]&&!/\./.test(num)&&v>=OCR_DEC[k])f.push(['warn','Check the decimal point: is it '+r1(v/10)+'?']);
 const fx=num&&(fixed||[]).find(x=>x.endsWith('→ '+num));if(fx)f.push(['warn','The reader added the decimal point ('+fx+').']);
 if(src&&/\(\s*t\s*c?\s*\)|temp|corr/i.test(src))f.push(['warn','Temperature-corrected (T) row. The rules assume 37 °C: use the 37 °C value if printed.']);
 if(k==='hco3'&&src&&/(?:^|[^a-z])st(?:d|andard)?(?![a-z])|std/i.test(src))f.push(['warn','Standard bicarbonate. Use the actual HCO₃⁻ if printed.']);
 if(inf&&num&&ocrInRange(inf.line,num))f.push(['warn','Next to a reference range: is it the result or a range limit?']);return f;}
function ocrStyle(){if($('ocrStyle'))return;const s=document.createElement('style');s.id='ocrStyle';s.textContent='.ocrsheet{touch-action:pan-y;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}'+
 '.ocrsheet .ocgrid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.ocf label{display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center;font-size:.85rem;color:var(--muted)}.ocf .chip{font-size:9px;padding:2px 6px}'+
 '.ocf.got label{color:var(--ink)}.ocf.unconf input{border-style:dashed}.ocf.warn input{border-color:var(--warn);background:var(--warn-soft)}.ocf.bad input{border-color:var(--bad);background:var(--bad-soft)}'+
 '.ocmsg{font-size:.78rem;color:var(--ink)}.ocf.warn .ocmsg::before{content:"! ";color:var(--warn);font-weight:700}.ocf.bad .ocmsg{color:var(--bad)}.ocmsg:empty{display:none}'+
 '.ocsrc{font:11px/1.3 var(--f-mono,monospace);color:var(--muted);overflow-wrap:anywhere}.ocsrc mark{background:var(--accent-soft);color:var(--ink);padding:0 2px}.ocrsheet .seg button{min-height:44px;min-width:88px}'+
 '.ocnotes{margin:0;padding-left:18px;font-size:.85rem;display:grid;gap:2px}.ocfix{display:flex;flex-wrap:wrap;gap:6px}.ocfix:empty{display:none}'+
 '.ocfoot{position:sticky;bottom:calc(-14px - env(safe-area-inset-bottom,0px));margin:4px -16px calc(-14px - env(safe-area-inset-bottom,0px));padding:8px 16px calc(10px + env(safe-area-inset-bottom,0px));background:var(--surface);border-top:2px solid var(--line);z-index:1}'+
 '.ocall{display:flex;gap:10px;align-items:center;min-height:44px;font-size:.9rem}.ocall input{width:22px;height:22px;accent-color:var(--accent)}'+
 '.octhumbb{background:none;border:0;padding:0;cursor:zoom-in;display:block;max-width:100%}.octhumbb[aria-expanded="true"]{cursor:zoom-out}.octhumbb[aria-expanded="true"] .octhumb{max-height:none;width:100%}';document.head.appendChild(s);}
function ocrSheet(r,thumb,raw,o2){o2=o2||{};ocrStyle();document.querySelectorAll('.sheet-scrim').forEach(x=>x.remove());
 const U=PU(),kpa=S.units==='kPa',clean=o2.clean!=null?o2.clean:ocrClean(raw||''),fixed=o2.fixed||[],got=new Set((r.got||[]).filter(k=>r.v[k]!=null)),src=r.src||{},conf={},info={},orig={};
 const disp=(k,v)=>{if(v==null)return '';const f=OCR_FIELDS.find(x=>x[0]===k);return String(f&&f[2]==='P'&&kpa?+(v/KPA).toFixed(2):+(+v).toFixed(k==='pH'?3:2));};
 OCR_FIELDS.forEach(f=>{const k=f[0];orig[k]=disp(k,r.v[k]);if(got.has(k)&&src[k])info[k]=ocrLine(clean,src[k])||{line:String(src[k]),num:null};});
 let ven=r.sample==='v'?true:r.sample?false:null;const SMP={a:'Arterial',v:'Venous',c:'Capillary (acid–base read as arterial)'};
 const notes=[r.sample?'Sample type on the printout: '+SMP[r.sample]+'.':'Sample type not found on the printout: choose Arterial or Venous.'].concat(
  r.kpa?['PCO₂ and PO₂ were printed in kPa'+(kpa?'.':': shown here in mmHg (kPa × 7.5).')]:[],r.notes||[],fixed.map(x=>'The reader added a decimal point: '+x+'.'),o2.pass===2?['Read with the high-contrast pass (faded or shadowed paper). Check each value with extra care.']:[]);
 const fld=f=>{const k=f[0],p=got.has(k),u=f[2]==='P'?U:f[2],inf=info[k];let sh='';
  if(inf){const i=inf.num?inf.line.indexOf(inf.num):-1,st=Math.max(0,i-26),seg=inf.line.slice(st,st+58),e=esc(seg);sh='<small class="ocsrc">'+(st?'…':'')+(inf.num?e.replace(new RegExp('(^|[^\\d.])('+ocrRx(inf.num)+')(?!\\d)'),'$1<mark>$2</mark>'):e)+(st+58<inf.line.length?'…':'')+'</small>';}
  return '<div class="fld ocf'+(p?' got unconf':'')+'" data-k="'+k+'"><label for="oc_'+k+'">'+[f[1],u].filter(Boolean).join(' ')+(p?' <span class="chip occhip">from photo</span>':'')+'</label><input id="oc_'+k+'" inputmode="decimal" autocomplete="off" value="'+esc(orig[k])+'" aria-describedby="ocm_'+k+'"><small class="ocmsg" id="ocm_'+k+'"></small>'+sh+'</div>';};
 const sc=document.createElement('div');sc.className='sheet-scrim on';
 sc.innerHTML='<div class="sheet ocrsheet" role="dialog" aria-modal="true" aria-labelledby="ocT"><h2 id="ocT" tabindex="-1">Check the numbers</h2><p class="privacy"><b>Read on this device.</b> Nothing was uploaded, and Buffer does not keep the photo. Compare every value with the printout: values marked “from photo” stay unconfirmed until you tap them or tick the box at the bottom. Tip: cover the patient label.</p>'+
  (thumb?'<button type="button" class="octhumbb" aria-expanded="false" aria-label="Your photo. Tap to enlarge."><img class="octhumb" src="'+thumb+'" alt=""></button>':'')+
  '<div class="seg" role="group" aria-label="Sample type"><button type="button" id="ocA" aria-pressed="'+(ven===false)+'">Arterial</button><button type="button" id="ocV" aria-pressed="'+(ven===true)+'">Venous</button></div>'+
  '<ul class="ocnotes">'+notes.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul><div class="ocgrid">'+OCR_FIELDS.map(fld).join('')+'</div>'+
  '<p id="ocChk" class="warnline" role="status"></p><div class="ocfix" id="ocFix"></div>'+(o2.retry?'<div class="btnrow"><button type="button" class="btn small" id="ocRe">Read again with more contrast</button></div>':'')+
  '<details><summary><span class="eyebrow">What the reader saw</span></summary><pre class="ocraw">'+esc(raw||'')+'</pre></details>'+
  '<div class="ocfoot"><label class="ocall"><input type="checkbox" id="ocAll">All values match the printout</label><p class="note" id="ocWhy" style="margin:0 0 6px"></p><div class="btnrow"><button type="button" class="btn primary" id="ocOk">Use these numbers</button><button type="button" class="btn" id="ocNo">Cancel</button></div></div></div>';
 document.body.appendChild(sc);const close=openModal(sc,{opener:$('pPhoto')||document.activeElement,initial:'#ocT',label:'Check the numbers'});
 $('ocNo').onclick=()=>close();sc.addEventListener('click',e=>{if(e.target===sc)close();});
 const read=()=>{const o={};OCR_FIELDS.forEach(f=>{const s=$('oc_'+f[0]).value.trim();if(s==='')return;let v=parseFloat(s.replace(',','.'));if(isNaN(v))return;if(f[2]==='P'&&kpa)v=v*KPA;o[f[0]]=v;});if(o.fio2!=null&&o.fio2>1)o.fio2=o.fio2/100;return o;};
 const box=k=>sc.querySelector('.ocf[data-k="'+k+'"]');
 const chk=()=>{const o=read(),all=$('ocAll').checked;let bad=0,unc=0;
  OCR_FIELDS.forEach(f=>{const k=f[0],el=box(k),inp=$('oc_'+k),same=orig[k]!==''&&inp.value.trim()===orig[k],fl=ocrFlags(k,o[k],same?info[k]:null,same?src[k]:'',same?fixed:[]),isBad=fl.some(x=>x[0]==='bad');
   el.classList.toggle('bad',isBad);el.classList.toggle('warn',!isBad&&fl.length>0);$('ocm_'+k).textContent=fl.map(x=>x[1]).join(' ');inp.setAttribute('aria-invalid',isBad?'true':'false');if(isBad)bad++;
   const u=got.has(k)&&!conf[k]&&!all;el.classList.toggle('unconf',u);if(u)unc++;const ch=el.querySelector('.occhip');if(ch)ch.textContent=u?'from photo · check':'from photo ✓';});
  const ck=$('ocChk'),fx=$('ocFix');fx.innerHTML='';ck.className='warnline';
  if(o.pH==null||o.pco2==null)ck.textContent='pH and PCO₂ are needed.';
  else if(o.hco3==null)ck.textContent='No HCO₃⁻, so pH and PCO₂ cannot be cross-checked. Compare each value with the printout.';
  else{const fit=(ph,pc,h)=>Math.abs(24*pc/h-Math.pow(10,9-ph))/Math.pow(10,9-ph),e=fit(o.pH,o.pco2,o.hco3);
   if(e<=0.1){ck.className='warnline okline';ck.textContent='pH, PCO₂ and HCO₃⁻ agree with each other. The other values are not checked by this: compare them with the printout.';}
   else{ck.textContent='pH, PCO₂ and HCO₃⁻ do not fit together (off by '+Math.round(e*100)+'%). One is probably misread.';const cand=[];
    [[o.pco2*KPA,'If PCO₂ was in kPa'],[o.pco2/KPA,'If PCO₂ was in mmHg']].forEach(([pc,w])=>{if(pc>=5&&pc<=200&&fit(o.pH,pc,o.hco3)<0.05)cand.push(['pco2',pc,w+': PCO₂ '+(kpa?+(pc/KPA).toFixed(2)+' kPa':r1(pc)+' mmHg')]);});
    const h2=r1(24*o.pco2/Math.pow(10,9-o.pH));if(h2>=1&&h2<=70)cand.push(['hco3',h2,'HCO₃⁻ '+h2]);
    const ph2=Math.round((9-Math.log10(24*o.pco2/o.hco3))*100)/100;if(ph2>=6.5&&ph2<=8)cand.push(['pH',ph2,'pH '+ph2]);
    if(cand.length){fx.innerHTML='<span class="note" style="flex-basis:100%">One of these would make them fit. Check the printout before you tap one:</span>'+cand.map((c,i)=>'<button type="button" class="btn small" data-fx="'+i+'">'+esc(c[2])+'</button>').join('');
     fx.querySelectorAll('[data-fx]').forEach(b=>b.onclick=()=>{const c=cand[+b.dataset.fx];$('oc_'+c[0]).value=disp(c[0],c[0]==='pco2'?r1(c[1]):c[1]);conf[c[0]]=1;chk();$('oc_'+c[0]).focus();});}}}
  const why=o.pH==null||o.pco2==null?'pH and PCO₂ are needed.':bad?'Fix the value'+(bad>1?'s':'')+' marked red first.':ven==null?'Choose Arterial or Venous.':unc?unc+' value'+(unc>1?'s are':' is')+' not confirmed yet: tap each one, or tick the box.':'';
  $('ocOk').disabled=!!why;$('ocWhy').textContent=why;};
 sc.querySelectorAll('.ocf input').forEach(i=>{const k=i.id.slice(3),c=()=>{if(!conf[k]){conf[k]=1;chk();}};i.addEventListener('focus',c);i.addEventListener('pointerdown',c);i.addEventListener('input',()=>{conf[k]=1;chk();});});
 $('ocAll').onchange=chk;
 const setS=v=>{ven=v;$('ocA').setAttribute('aria-pressed',String(v===false));$('ocV').setAttribute('aria-pressed',String(v===true));chk();};$('ocA').onclick=()=>setS(false);$('ocV').onclick=()=>setS(true);
 const tb=sc.querySelector('.octhumbb');if(tb)tb.onclick=()=>{const x=tb.getAttribute('aria-expanded')!=='true';tb.setAttribute('aria-expanded',String(x));tb.setAttribute('aria-label',x?'Your photo, enlarged. Tap to make it small.':'Your photo. Tap to enlarge.');};
 if($('ocRe'))$('ocRe').onclick=()=>{close();o2.retry();};
 $('ocOk').onclick=()=>{chk();if($('ocOk').disabled)return;const o=read(),smp=ven?'v':'a',keys=Object.keys(o),fromP=keys.filter(k=>got.has(k));close();openTool('interp');
  setTimeout(()=>{loadInterp(Object.assign({sample:smp},o));IPARSED=fromP.slice();IMISS=o.po2!=null&&o.fio2==null&&smp!=='v'?['fio2']:[];
   if(typeof ui3PInfo==='function')try{ui3PInfo({sample:r.sample,notes:r.notes||[],got:fromP,v:o,src},smp);}catch(e){}
   buildForm();runInterp();const m=$('pMsg');if(m)m.textContent='From photo · '+keys.length+' value'+(keys.length>1?'s':'')+' · check against the printout';toast('Loaded. Read it, then save it to the log if you like.');},50);};
 chk();return close;}
/* nothing (or too little) readable: tips instead of an empty sheet */
function ocrTip(n,again,show){const go=$('pGo');if(!go)return;let el=$('ocTip');if(!el){el=document.createElement('div');el.id='ocTip';el.setAttribute('role','status');el.style.cssText='border:2px dashed var(--line);padding:10px 12px;margin:4px 0';(go.closest('.btnrow')||go).after(el);}
 el.innerHTML='<b>'+(n?'Too little readable':'Nothing readable')+' in that photo.</b><p class="note" style="margin:4px 0 8px">Fill the frame with the printout, flatten curled thermal paper, avoid shadows from your hand or phone, hold steady, and use good light.</p><div class="btnrow"><button type="button" class="btn small primary" id="ocTry">'+ic(ICON.camera?'camera':'copy')+'Try again</button><button type="button" class="btn small" id="ocType">Type the values</button>'+(n?'<button type="button" class="btn small ghost" id="ocShow">Show the '+n+' value'+(n>1?'s':'')+' found</button>':'')+'</div>';
 $('ocTry').onclick=()=>{el.remove();again();};$('ocType').onclick=()=>{el.remove();const t=$('pTxt');if(t)t.focus();};if(n)$('ocShow').onclick=()=>{el.remove();show();};try{el.scrollIntoView({block:'nearest',behavior:RM()?'auto':'smooth'});}catch(e){}}
/* true only when the service worker really holds the reader (script and core) */
function ocrOffline(){try{if(!('caches' in window)||!navigator.serviceWorker||!navigator.serviceWorker.controller)return Promise.resolve(false);
 /* the OCR cache is named after the tesseract.js version (pwa/sw.js, e.g. buffer-ocr-5.1.1) */
 return caches.keys().then(ns=>{const n=ns.find(x=>/^buffer-ocr-/.test(x));return n?caches.open(n).then(c=>c.keys()).then(k=>k.some(q=>/tesseract\.min\.js/.test(q.url))&&k.some(q=>/core/.test(q.url))):false;}).catch(()=>false);}catch(e){return Promise.resolve(false);}}
function ocrButton(){const go=$('pGo');if(!go||$('pPhoto'))return;const b=document.createElement('button');b.type='button';b.className='btn';b.id='pPhoto';b.innerHTML=ic(ICON.camera?'camera':'copy')+'Photo of printout';
 const T0='Reads the photo on this device. Nothing is uploaded. The reader downloads once from jsDelivr (a few MB).';b.title=T0;ocrOffline().then(ok=>{if(ok)b.title='Reads the photo on this device. Nothing is uploaded. The reader is saved on this device and works offline.';});
 /* no capture attribute: the phone offers the camera or the gallery (screenshots, shared images) */
 const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.hidden=true;inp.tabIndex=-1;inp.id='pPhotoIn';go.after(b);b.after(inp);b.onclick=()=>inp.click();
 const msg=$('pMsg');if(msg)msg.setAttribute('aria-live','polite');const h=$('pHint');if(h&&!h.dataset.oc){h.dataset.oc='1';h.appendChild(document.createTextNode(' Photos are read on this device and never uploaded.'));}
 const say=t=>{const m=$('pMsg');if(m)m.textContent=t;};
 const run=async(f,mode)=>{const old=$('ocTip');if(old)old.remove();b.disabled=true;b.setAttribute('aria-busy','true');say(mode===2?'Trying again with more contrast…':'Reading the photo on this device…');let last='';
  try{const r=await ocrImage(f,(k,p)=>{const pc=Math.round((p||0)*5)*20,t=k==='load'?'Downloading the reader (once)… '+pc+'%':k==='retry'?'Trying again with more contrast…':'Reading… '+pc+'%';if(t!==last){last=t;say(t);}},mode);
   const clean=ocrClean(r.text),fixed=ocrClean.fixed.slice(),parsed=parseGas(clean),n=parsed.got.length,core=parsed.v.pH!=null&&parsed.v.pco2!=null;
   const open=()=>ocrSheet(parsed,r.thumb,r.text,{clean,fixed,pass:r.pass,retry:r.pass===1?()=>run(f,2):null});
   if(!n||(!core&&n<6)){say(n?'Only '+n+' value'+(n>1?'s':'')+' found, without pH and PCO₂.':'No values found in that photo.');ocrTip(n,()=>inp.click(),open);}
   else{say('Found '+n+' value'+(n>1?'s':'')+'. Check each one.');open();}}
  catch(e){console.warn('photo reader:',e);const c=e&&e.code;say(c==='download'?'Could not download the photo reader (a few MB). Connect to the internet and try again, or type the values.':c==='notimage'?'That file is not a photo Buffer can open. Try a JPG or PNG.':'The reader stopped on this photo. Try a smaller or closer photo, or type the values.');}
  finally{b.disabled=false;b.removeAttribute('aria-busy');}};
 inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.value='';if(f)run(f);};}
if(typeof renderInterp==='function'){const _rI=renderInterp;renderInterp=function(el){_rI(el);try{ocrButton();}catch(e){}};}

/* ---- home: today's plan ---- */
/* the week the weekly review covers: on Sunday this week, on Monday the week just ended (as ui6 shows it), so one review ticks both days */
function ui10WeekKey(){const d=new Date();if(d.getDay()===1)d.setDate(d.getDate()-1);return isoD(weekStart(d));}
/* An item is ticked only for what was really done today (local day): the case or drill actually finished is named, not the one that was suggested.
   The Round's minutes come from roundMinutes() (ui5), so the plan, the hero and the builder agree. Round, due reviews, weekly review and the log are never cut by the time cap. */
function todaysPlan(){const t=today(),slot=typeof slotFor==='function'?slotFor(t):'free',cap=typeof roundCap==='function'?roundCap():((typeof SLOT_MIN!=='undefined'&&SLOT_MIN[slot]!=null)?SLOT_MIN[slot]:25);const items=[];
 const due=dueKinds().length,dayN=dayNum(),sess=(S.sess||[]).filter(s=>s.d===t),last=f=>{for(let i=sess.length-1;i>=0;i--)if(f(sess[i]))return sess[i];return null;};
 if(slot==='tough'){const f5=last(s=>s.m==='five');return {slot,cap,items:[{k:'rest',t:f5?'Five-second read set':'Night shift: rest. If you want one thing, a five-second read set.',min:3,done:!!f5,act:()=>startSpeed('five')}]};}
 const rDone=S.lastRound===t,R=typeof ROUND!=='undefined'&&ROUND&&ROUND.legs&&ROUND.day===t?ROUND:null,plan=typeof roundPlan==='function'?roundPlan():[];
 const dueLeg=R?R.legs.slice(R.i).some(g=>g.t==='due'):!rDone&&plan.some(g=>g.t==='due'),inR=dueLeg?Math.min(due,4):0;
 if(rDone)items.push({k:'round',t:'The Round is done',min:S.lastRoundMin>0?S.lastRoundMin:null,done:true,act:()=>go('progress')});
 else if(R)items.push({k:'round',t:'Continue the Round (leg '+Math.min(R.i+1,R.legs.length)+' of '+R.legs.length+')',min:R.legs.slice(R.i).reduce((a,g)=>a+(g.min||0),0),done:false,act:()=>{const b=$('tRound');if(b)b.click();}});
 else items.push({k:'round',t:'The Round'+(inR&&due>inR?' · includes '+inR+' of '+due+' due':''),min:typeof roundMinutes==='function'?roundMinutes():Math.min(25,cap),done:false,act:()=>{const b=$('tRound');if(b)b.click();}});
 const rest=due-inR;if(rest>0)items.push({k:'due',t:'Review '+(inR?'the other ':'')+rest+' due pattern'+(rest>1?'s':''),min:Math.min(10,2+rest*2),done:false,free:true,act:()=>startSession('due')});
 else if(!due&&!dueLeg&&last(s=>s.m==='due'))items.push({k:'due',t:'Due patterns reviewed',min:null,done:true,act:()=>go('progress')});
 const dow=new Date().getDay();if(dow===0||dow===1){const wk=ui10WeekKey();items.push({k:'week',t:'Weekly review',min:5,free:true,done:!!(S.ui&&S.ui.weekly===wk),act:()=>{S.ui=S.ui||{};S.ui.weekly=wk;save();go('progress');}});}
 if(cap>=15&&typeof CASES!=='undefined'&&CASES.length){const dc=CASES.map(c=>[c,(S.cases||{})[c.id]]).filter(([c,x])=>x&&x.last&&isoD(new Date(x.last))===t).sort((a,b)=>b[1].last-a[1].last)[0];
  if(dc){const s=last(s=>s.m==='case'||s.m==='sim');items.push({k:'case',t:'Case: '+dc[0].t+' ('+FMT[dc[0].fmt].toLowerCase()+')',min:s&&s.ms?Math.max(1,Math.round(s.ms/6e4)):null,done:true,act:()=>openCase(dc[0].id)});}
  else{const next=CASES.filter(c=>!caseDone(c.id)&&(cap>=20||c.fmt!=='sim'))[0]||CASES[dayN%CASES.length];items.push({k:'case',t:'Case: '+next.t+' ('+FMT[next.fmt].toLowerCase()+')',min:next.fmt==='sim'?12:6,done:false,act:()=>openCase(next.id)});}}
 const sd=last(s=>SPEED[s.m]),sp=sd?sd.m:['five','pflash','noisy','handover'][dayN%4];
 items.push({k:'speed',t:'Speed drill: '+SPEED[sp].t.toLowerCase()+(sd?'':' ('+SPEED[sp].n+')'),min:sd?null:4,done:!!sd,act:()=>startSpeed(sp)});
 items.push({k:'log',t:'Log a real gas from your day (no names or IDs)',min:1,free:true,done:logList().some(e=>isoD(new Date(e.t))===t),act:()=>openTool('interp')});
 let sum=items.filter(i=>!i.done&&i.free||(!i.done&&i.k==='round')).reduce((a,i)=>a+(i.min||0),0);
 const fit=items.filter(i=>{if(i.done||i.free||i.k==='round')return true;if(sum+i.min>cap+5)return false;sum+=i.min;return true;});
 return {slot,cap,items:fit};}
if(RENDER.today){const _rt10=RENDER.today;RENDER.today=function(){_rt10();const el=$('v-today');if(!el)return;const P0=todaysPlan();const done=P0.items.filter(i=>i.done).length;
 const card=document.createElement('div');card.className='card plan';card.innerHTML='<div class="btnrow" style="justify-content:space-between"><span class="eyebrow">Today\'s plan · '+done+'/'+P0.items.length+' · about '+P0.items.filter(i=>!i.done).reduce((a,i)=>a+(i.min||0),0)+' min</span><small class="muted">'+({free:'free day',before:'before a night',early:'early start',postnight:'after a night',tough:'night shift'})[P0.slot]+'</small></div><ol class="planl">'+P0.items.map((i,n)=>'<li class="'+(i.done?'done':'')+'"><button class="btn small'+(i.done?' ghost':n===P0.items.findIndex(x=>!x.done&&x.k!=='round')?' primary':'')+'" data-pl="'+n+'">'+(i.done?'✓ ':'')+esc(i.t)+(i.done?ui1VH(' (done)'):'')+'</button><small>'+(i.min?i.min+' min':i.done?'done':'')+'</small></li>').join('')+'</ol>';/* primary: the next undone item that is not the Round (the hero above carries the Round button) */
 const hero=el.querySelector('.hero,.card.raised,.card');if(hero)hero.after(card);else el.prepend(card);
 card.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{try{P0.items[+b.dataset.pl].act();}catch(e){console.error(e);}});};}
