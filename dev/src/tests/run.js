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
console.log('JS tests: '+pass+' passed, '+fail+' failed');
// dump random cases for the independent Python check
if(process.argv[2]==='dump'){const out=[];const rnd=(a,b)=>a+Math.random()*(b-a);
  for(let i=0;i<5000;i++){const p=Math.round(rnd(12,110)),h=Math.round(rnd(4,48)*10)/10;const ph=Math.round(E.phFrom(h,p)*100)/100;if(ph<6.8||ph>7.8)continue;
    const na=Math.round(rnd(128,150)),alb=Math.random()<.5?null:Math.round(rnd(15,45));const ag=rnd(6,32);const cl=Math.round(na-ag-h);
    const inp={pH:ph,pco2:p,hco3:h,na,cl};if(alb!=null)inp.alb=alb;const o=E.interp(Object.assign({},inp),opt);if(o.err)continue;
    out.push({i:inp,label:o.label,prim:o.primKey,comp:o.compKey,agc:o.agc,delta:o.delta,flags:o.flags});}
  require('fs').writeFileSync(__dirname+'/random.json',JSON.stringify(out));console.log('dumped',out.length);}
process.exitCode=fail?1:0;
