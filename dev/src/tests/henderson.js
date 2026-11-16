// Henderson check of every gas the app shows as content (D23, T05-3).
// [H+] nmol/L = 24 x PCO2 / HCO3 must agree with 10^(9-pH) within 10%.
// Covers: any object with numeric pH, pco2 and hco3 in the lessons (ex, worked gases), the lesson and XQ questions
// (prompts that state exactly one pH, one PCO2 and one HCO3), the case library and sims (c12 CASES) and the Shifts (ui5 SCENARIOS).
// A prompt whose answer says the numbers do not fit (a deliberate Henderson question) is counted as intended, not as a failure.
// Run: node tests/henderson.js [-v]
const fs=require('fs'),path=require('path');const E=require('./load.js');
const TOL=0.10,KPA=7.50062,verbose=process.argv.includes('-v');
let n=0,bad=0,intended=0;const out=[];
const hOf=(ph,p,h)=>{const want=Math.pow(10,9-ph),got=24*p/h;return {want,got,err:Math.abs(got-want)/want};};
function check(where,ph,p,h,okIfBad){n++;const r=hOf(ph,p,h);if(r.err<=TOL)return;
 if(okIfBad){intended++;if(verbose)console.log('intended',where);return;}
 bad++;out.push('HENDERSON '+where+': pH '+ph+', PCO2 '+p+', HCO3 '+h+' gives [H+] '+r.got.toFixed(0)+' vs '+r.want.toFixed(0)+' nmol/L ('+(r.err*100).toFixed(0)+'%)');}
// structured gases anywhere inside an object tree
const count={};
function walk(o,where,seen,okIfBad){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);
 const ph=o.pH!=null?o.pH:o.ph;
 if(typeof ph==='number'&&typeof o.pco2==='number'&&typeof o.hco3==='number'){const p=(o.units==='kPa'||o.u==='kPa')?o.pco2*KPA:o.pco2;const kind=where.split(' ')[0];count[kind]=(count[kind]||0)+1;check(where,ph,p,o.hco3,okIfBad);}
 for(const k in o)if(o[k]&&typeof o[k]==='object')walk(o[k],where+'.'+k,seen,okIfBad);}
// gases written in a question prompt
const num='(\\d+(?:\\.\\d+)?)';
const RX={ph:new RegExp('\\bpH\\s*(?:of|is|=|:)?\\s*(\\d\\.\\d{1,3})','g'),
 p:new RegExp('\\bP(?:a|v)?CO₂\\s*(?:of|is|=|:)?\\s*'+num+'\\s*(kPa)?','gi'),
 h:new RegExp('HCO₃⁻?\\s*(?:of|is|=|:)?\\s*'+num,'g')};
const DELIB=/inconsisten|do(?:es)? not fit|cannot be right|impossible|mismatch|Henderson|transcription|recheck|error/i;
function fromText(t){const all=k=>[...t.replace(/PCO2/g,'PCO₂').replace(/HCO3-?/g,'HCO₃⁻').matchAll(RX[k])];const a=all('ph'),b=all('p'),c=all('h');
 if(a.length!==1||b.length!==1||c.length!==1)return null;return {ph:+a[0][1],p:b[0][2]?+b[0][1]*KPA:+b[0][1],h:+c[0][1]};}
const seen=new Set();
for(const l of E.L){
 /* a lesson whose text says its worked gas does not fit (hh: the consistency check) keeps that gas on purpose */
 const {q,...rest}=l;walk(rest,'lesson '+l.id,seen,/worked gas[^.]*does not fit|deliberately inconsistent/i.test(l.body||''));
 (q||[]).forEach((x,i)=>{const g=fromText(x[0]);if(!g)return;count.prompt=(count.prompt||0)+1;const ans=(x[1][x[2]]||'')+' '+(x[3]||'');check('lesson '+l.id+' q'+i+' "'+x[0].slice(0,60)+'"',g.ph,g.p,g.h,DELIB.test(ans));});}
for(const c of E.CASES)walk(c,'case '+c.id,seen);
// Shifts live in ui5.js, which needs a DOM: cut the SCENARIOS literal out by bracket matching
function literal(src,name){const i=src.indexOf('const '+name+'=');if(i<0)return null;let j=src.indexOf('=',i)+1,d=0,q=null;const s=j;
 for(;j<src.length;j++){const ch=src[j];if(q){if(ch==='\\'){j++;continue;}if(ch===q)q=null;continue;}
  if(ch==='"'||ch==="'"||ch==='`'){q=ch;continue;}if(ch==='['||ch==='{'||ch==='(')d++;else if(ch===']'||ch==='}'||ch===')'){d--;if(d===0){j++;break;}}}
 return src.slice(s,j);}
try{const lit=literal(fs.readFileSync(path.join(__dirname,'..','ui5.js'),'utf8'),'SCENARIOS');if(lit){const SC=new Function('return '+lit)();SC.forEach(s=>walk(s,'shift '+s.id,seen));}else out.push('note: SCENARIOS not found in ui5.js');}
catch(e){out.push('note: SCENARIOS not checked ('+e.message+')');}
out.forEach(x=>console.log(x));
console.log('Henderson: '+n+' gases checked ('+Object.entries(count).map(([k,v])=>v+' '+k).join(', ')+'), '+bad+' do not fit, '+intended+' deliberate mismatches');
process.exitCode=bad?1:0;
