// Runs parseGas over the T12 synthetic printouts (5 analysers x 4 scenarios + i-STAT mg/dL), clean text (D15). Every field must be right.
const fs=require('fs');const src=fs.readFileSync(require('path').join(__dirname,'..','ui3.js'),'utf8');
const a=src.indexOf('/* reads values out of pasted'),b=src.indexOf('function renderInterp');
const KPA=7.50062,r1=x=>Math.round(x*10)/10,hFrom=(pH,p)=>24*p/Math.pow(10,9-pH);
const parseGas=new Function('KPA','r1','hFrom',src.slice(a,b)+';return parseGas;')(KPA,r1,hFrom);
const C=JSON.parse(fs.readFileSync(__dirname+'/corpus.json','utf8'));let ok=0,tot=0,allok=0;
for(const [n,t,tr] of C){const r=parseGas(t);const bad=[];for(const k in tr){const w=tr[k];if(k==='ven'){tot++;if(r.ven===w)ok++;else bad.push('ven '+r.ven);continue;}if(w==null){tot++;if(r.v[k]==null)ok++;else bad.push(k+' should be empty');continue;}tot++;const g=r.v[k];const tol=k==='pH'?0.006:Math.max(0.051,Math.abs(w)*0.012);if(g!=null&&Math.abs(g-w)<=tol)ok++;else bad.push(k+' want '+w+' got '+g);}
 if(!bad.length)allok++;else console.log(n,'|',bad.join('; '));}
console.log('fields '+ok+'/'+tot+', printouts fully right '+allok+'/'+C.length);process.exitCode=ok===tot?0:1;
