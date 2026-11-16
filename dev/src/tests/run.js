const E=require('./load.js');const C=require('./ref_cases.js');
let pass=0,fail=0;const f=(ok,msg)=>{ok?pass++:(fail++,console.log('FAIL',msg));};
E.S.agref=12;E.S.patm=760;E.S.usek=false;
const opt={agref:12,patm:760,usek:false};
for(const c of C){const o=E.interp(Object.assign({},c.i),opt);
  if(o.err){f(false,c.n+' errored: '+o.err);continue;}
  if(c.label)f(o.label===c.label,c.n+': label '+o.label+' ≠ '+c.label);
  if(c.prim)f(o.primKey===c.prim,c.n+': prim '+o.primKey+' ≠ '+c.prim);
  if(c.comp)f(o.compKey===c.comp,c.n+': comp '+o.compKey+' ≠ '+c.comp);
  if(c.ag)f((o.agHigh?'high':'normal')===c.ag,c.n+': ag '+o.agHigh);
  if(c.deltaBand){const b=o.delta<0.8?'mixed':o.delta<=2?'pure':'alk';f(b===c.deltaBand,c.n+': delta '+o.delta);}
  if(c.flag)f(o.flags.includes(c.flag),c.n+': expected flag '+c.flag);
  if(c.ox)f(o.ox&&o.ox.cat===c.ox,c.n+': ox '+(o.ox&&o.ox.cat));
  if(c.pf)f(o.ox&&Math.abs(o.ox.pf-c.pf)<0.5,c.n+': pf '+(o.ox&&o.ox.pf));
  if(c.noOx)f(o.ox===null,c.n+': venous must not assess oxygenation');
  f(typeof o.line==='string'&&o.line.length>20,c.n+': summary line');
}
for(const c of C.invalid){const o=E.interp(Object.assign({},c.i),opt);
  if(c.expectFlag)f(!o.err&&o.flags.includes(c.expectFlag),'invalid/'+c.why+' should flag '+c.expectFlag);
  else f(!!o.err,'invalid/'+c.why+' should be rejected; got '+(o.label||''));}
// units
f(Math.abs(E.toMm(5.3,'kPa')-39.75)<0.05,'kPa→mmHg');f(E.toMm(40,'mmHg')===40,'mmHg passthrough');
// H-H identities
f(Math.abs(E.phFrom(24,40)-7.40)<0.005,'HH normal');f(Math.abs(E.hFrom(7.4,40)-24)<0.2,'HH inverse');
// agref setting respected by delta
{const o=E.interp({pH:7.24,pco2:25,hco3:11,na:140,cl:105,alb:40},{agref:10,patm:760,usek:false});f(Math.abs(o.delta-(24-10)/13)<0.01,'delta uses AG reference: '+o.delta);}
// venous PO2 never assessed even if supplied
{const o=E.interp({sample:'v',pH:7.35,pco2:46,hco3:25,po2:38,fio2:0.21},opt);f(o.ox===null,'venous PO2 ignored');}
// generator: every case re-interprets to its target label, at every level
for(const lv of [1,2,3,4])for(const k of E.kindsFor(lv)){let ok=0,n=0;for(let i=0;i<60;i++){const c=E.genCase(k,lv);if(!c)continue;n++;const o=E.interp(c,opt);if(E.buildLabel(o.r,lv)===c.label&&!o.flags.includes('inconsistent'))ok++;}f(n>=50&&ok===n,'generator '+k+' L'+lv+' '+ok+'/'+n);}
// D10 engine regressions (Buffer 5.0)
{const o=E.interp({sample:'a',pH:7.21,pco2:24,hco3:9.3,na:136,cl:101,alb:40},opt);f(o.compKey==='ok'&&o.label==='High anion gap metabolic acidosis','T30-3 Winter edge 7.21/24/9.3: '+o.label);}
{let bad=0;for(let h=4;h<=21.9;h+=0.1)for(let p=10;p<=45;p++){const ph=Math.round(E.phFrom(h,p)*100)/100;const o=E.interp({pH:ph,pco2:p,hco3:Math.round(h*10)/10},opt);if(o.err||o.primKey!=='mac')continue;const s=o.steps.find(x=>x.k==='comp');const m=s.d.match(/expected PCO₂ (\d+)–(\d+) mmHg\. Measured (\d+)/);if(!m){bad++;continue;}const [lo,hi,me]=m.slice(1).map(Number);const want=me>hi?'rac':me<lo?'ralk':'ok';if(want!==o.compKey)bad++;}f(bad===0,'Winter band text agrees with verdict ('+bad+' disagreements)');}
for(const k of ['hag_ralk','hag_malk_ralk'])if(E.KINDS[k]){let n=0,c=0;for(let i=0;i<80;i++){const g=E.genCase(k,4);if(!g)continue;n++;if(g.o.compKey==='c'||g.o.compKey==='p')c++;}f(c===0,k+': never called chronic/partly compensated ('+c+'/'+n+')');}
{const o=E.interp({pH:7.46,pco2:22,hco3:15.3,na:141,cl:104,alb:40},opt);f(o.compKey==='mac'&&!/renally compensated/.test(o.steps.find(s=>s.k==='comp').v)&&o.label==='HAGMA + respiratory alkalosis','salicylate gas not read as renal compensation');}
{const o=E.interp({sample:'v',pH:7.30,pco2:45,hco3:21,na:140,cl:105},opt);f(Math.abs(o.ag-14)<0.01&&o.label==='Normal anion gap metabolic acidosis','venous AG uses the measured HCO₃⁻: '+o.ag);}
{const o=E.interp({pH:7.31,pco2:33,hco3:16.2,po2:420,fio2:0.8,cohb:24,na:140,cl:104,alb:40,lac:5.4},opt);const ox=o.steps.find(s=>s.k==='ox');f(!/Hyperoxaemia: titrate oxygen down/.test(ox.d)&&/content reduced/.test(o.line),'COHb: no advice to titrate O₂ down; line says content reduced');}
{const o=E.interp({sample:'v',pH:7.30,pco2:45,hco3:21,cohb:28},opt);const ox=o.steps.find(s=>s.k==='ox');f(ox.tone==='bad'&&/COHb 28%/.test(ox.d)&&o.causes.some(c=>/carbon monoxide/.test(c)),'venous COHb interpreted');}
{const o=E.interp({pH:7.40,pco2:40,hco3:24,po2:130,fio2:0.21,age:30},opt);f(o.flags.includes('ox-implausible'),'PaO₂ above PAO₂ flagged');}
{const o=E.interp({pH:7.24,pco2:60,hco3:26,na:140,cl:92,alb:40},opt);f(o.r.malk===true,'acute RAC + high gap with normal HCO₃⁻ finds the metabolic alkalosis');}
{const o=E.interp({pH:7.47,pco2:32,hco3:22.5,po2:70,fio2:0.4,na:136,cl:100,alb:30,lac:2.4},opt);f(!o.r.malk&&o.delta==null,'Δ ratio not used when HCO₃⁻ barely moved (T30-4)');}
{const o=E.interp({pH:7.27,pco2:28,hco3:12.5,na:140,cl:106.4,alb:40},opt);f(o.delta==null||o.line.includes(o.delta.toFixed(2)),'line shows Δ ratio to 2 dp');}
{E.S.units='kPa';const o=E.interp({pH:7.4,pco2:40*7.50062,hco3:24},opt);E.S.units='mmHg';f(o.err&&!/\d\.\d{3,}/.test(o.err)&&/kPa/.test(o.err),'kPa range message is clean: '+o.err);}
{const o=E.interp({pH:6.5,pco2:5},opt);f(o.err&&/imply/.test(o.err),'calculated HCO₃⁻ out of range names pH and PCO₂');}
{const o=E.interp({pH:7.4,pco2:40,hco3:24,methb:500},opt);f(!!o.err,'MetHb 500% rejected');}
// 5.0 state fields survive migrate() (I2): weekly record, number keys, Yuzu sent marks, Round minutes; no ctr default (hub.js)
{const m=E.migrate({v:4,wk:{'2026-11-16':{s:{ph:[3,2],bad:[1]},k:{},ms:5000},junk:{}},keys:false,yzSent:{a:5,b:'x'},lastRoundMin:12});
 f(JSON.stringify(m.wk)==='{"2026-11-16":{"s":{"ph":[3,2]},"k":{},"ms":5000}}'&&m.keys===false&&JSON.stringify(m.yzSent)==='{"a":5}'&&m.lastRoundMin===12,'migrate keeps wk/keys/yzSent/lastRoundMin, sanitised');
 const d=E.migrate({});f(d.keys===true&&!('ctr' in d)&&JSON.stringify(d.wk)==='{}','migrate defaults; no ctr default');}
console.log('JS tests: '+pass+' passed, '+fail+' failed');
// dump random cases for the independent Python check
if(process.argv[2]==='dump'){const out=[];const rnd=(a,b)=>a+Math.random()*(b-a);
  for(let i=0;i<5000;i++){const p=Math.round(rnd(12,110)),h=Math.round(rnd(4,48)*10)/10;const ph=Math.round(E.phFrom(h,p)*100)/100;if(ph<6.8||ph>7.8)continue;
    const na=Math.round(rnd(128,150)),alb=Math.random()<.5?null:Math.round(rnd(15,45));const ag=rnd(6,32);const cl=Math.round(na-ag-h);
    const inp={pH:ph,pco2:p,hco3:h,na,cl};if(alb!=null)inp.alb=alb;const o=E.interp(Object.assign({},inp),opt);if(o.err)continue;
    out.push({i:inp,label:o.label,prim:o.primKey,comp:o.compKey,agc:o.agc,delta:o.delta,flags:o.flags});}
  /* venous gases: read on estimated arterial values (pH +0.03, PCO2 -5 floored at 10, HCO3 -1); the gap uses the measured HCO3 */
  for(let i=0;i<2500;i++){const p=Math.round(rnd(20,110)),h=Math.round(rnd(5,48)*10)/10;const ph=Math.round(E.phFrom(h,p)*100)/100;if(ph<6.8||ph>7.75)continue;
    const na=Math.round(rnd(128,150)),cl=Math.round(na-rnd(6,32)-h);const inp={sample:'v',pH:ph,pco2:p,hco3:h,na,cl};const o=E.interp(Object.assign({},inp),opt);if(o.err)continue;
    out.push({i:inp,label:o.label,prim:o.primKey,comp:o.compKey,agc:o.agc,delta:o.delta,flags:o.flags,ox:o.ox});}
  /* oxygenation: arterial gases on air and on oxygen, with and without age, at sea level and at altitude */
  for(let i=0;i<3000;i++){const p=Math.round(rnd(20,90)),h=Math.round(rnd(14,36)*10)/10;const ph=Math.round(E.phFrom(h,p)*100)/100;if(ph<6.9||ph>7.7)continue;
    const fio2=Math.random()<.45?0.21:Math.round(rnd(0.24,1)*100)/100,patm=Math.random()<.8?760:Math.round(rnd(560,759));
    const inp={pH:ph,pco2:p,hco3:h,po2:Math.round(rnd(30,Math.max(60,fio2*650)))};if(Math.random()<.7)inp.age=Math.round(rnd(16,95));if(Math.random()<.9)inp.fio2=fio2;
    const o=E.interp(Object.assign({},inp),Object.assign({},opt,{patm}));if(o.err)continue;
    out.push({kind:'ox',patm,i:inp,ox:o.ox,flags:o.flags});}
  require('fs').writeFileSync(__dirname+'/random.json',JSON.stringify(out));console.log('dumped',out.length);}
process.exitCode=fail?1:0;
