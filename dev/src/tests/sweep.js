// Generator invariants across Settings (D28, T10-2/T10-3/T10-47): altitude 760/707/650/580, AG reference 4-16, K+ in the gap,
// levels 1-4, strict and strict+venous. Every case relabels to its target, PaO2 stays below the alveolar PO2, and so on.
// usage: node tests/sweep.js N [r]   (gate.sh runs N=30; fails on any broken case or a combination that returns no case >25% of the time)
// Deterministic by default (the gate must not flake): Math.random is replaced by a seeded PRNG. SEED=<n> picks another
// stream, SEED=random uses the real Math.random for exploratory runs.
if(process.env.SEED!=='random'){let a=(+process.env.SEED||20261116)>>>0;Math.random=function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
const E=require('./load.js');const N=+process.argv[2]||100;
const PATM=[760,707,650,580],AGREF=[4,8,12,16],USEK=[false,true];
let fails=[],nulls={},tot=0,ranges={};
const fail=(m)=>{if(fails.length<60)fails.push(m);fails.n=(fails.n||0)+1;};
const rec=(cause,k,v)=>{const r=ranges[cause]=ranges[cause]||{};const a=r[k]=r[k]||[1e9,-1e9];a[0]=Math.min(a[0],v);a[1]=Math.max(a[1],v);};
for(const patm of PATM)for(const agref of AGREF)for(const usek of USEK){
 E.S.patm=patm;E.S.agref=agref;E.S.usek=usek;E.S.units=process.env.U||'mmHg';
 for(const lv of [1,2,3,4])for(const kind of E.kindsFor(lv))for(const strict of [false,true])for(const ven of [false,true]){
  if(ven&&!strict)continue;
  let nul=0;
  for(let i=0;i<N;i++){const c=E.genCase(kind,lv,{strict,ven});tot++;
   if(!c){nul++;continue;}
   const tag=`${kind} L${lv} p${patm} ag${agref} k${+usek}${strict?' S':''}${ven?' V':''} ${c.cause}`;
   const o=E.interp(Object.assign({},c));
   if(o.err||o.flags.includes('inconsistent')){fail(tag+' err/inconsistent');continue;}
   if(E.buildLabel(o.r,lv)!==c.label)fail(tag+' relabel '+E.buildLabel(o.r,lv)+' vs '+c.label);
   if(c.label!==E.targetLabel(kind,lv))fail(tag+' label != target');
   if(['hag_ralk','hag_malk_ralk'].includes(kind)&&['c','p'].includes(o.compKey))fail(tag+' compKey '+o.compKey);
   const a=c.art||c;
   const PA=a.fio2*(patm-47)-a.pco2/0.8;
   if(a.po2>PA-1)fail(tag+` PaO2 ${a.po2} > PAO2 ${PA.toFixed(1)}`);
   if(a.po2<35)fail(tag+' PaO2 '+a.po2);
   if(lv>=4&&!ven&&o.ox&&o.ox.cat!==a.ox)fail(tag+' ox '+o.ox.cat+' vs '+a.ox);
   if(!E.OXLAB[a.ox])fail(tag+' ox key '+a.ox);
   if(lv<3&&!ven){const ob=E.interp({pH:c.pH,pco2:c.pco2,hco3:c.hco3});if(E.buildLabel(ob.r,lv)!==c.label)fail(tag+' bare relabel '+E.buildLabel(ob.r,lv));}
   if(/\d\.\d/.test(c.vig)&&/K⁺ \d/.test(c.vig))fail(tag+' vignette quotes K');
   const ds=E.distract(c.label,lv,4);if(ds.includes(c.label)||new Set(ds).size!==ds.length)fail(tag+' distract');
   if(!ven){rec(c.cause,'pH',a.pH);rec(c.cause,'PCO2',a.pco2);rec(c.cause,'HCO3',a.hco3);rec(c.cause,'K',a.k);rec(c.cause,'alb',a.alb);rec(c.cause,'lac',a.lac);
    if(a.fio2<0.22)rec(c.cause,'PO2air@'+patm,a.po2);else rec(c.cause,'PO2onO2',a.po2);rec(c.cause,'FiO2',a.fio2);rec(c.cause,'AGrise',+(o.agc-agref-(usek?4:0)).toFixed(1));}
  }
  /* N=30 is a small sample: a combination over the limit is re-measured on 300 draws before it counts (no flaky fails) */
  if(nul/N>0.25){let n2=0;for(let i=0;i<300;i++)if(!E.genCase(kind,lv,{strict,ven}))n2++;nul=Math.round(n2/300*N);}
  if(nul/N>0.1){const key=`${kind} L${lv} p${patm} ag${agref} k${+usek}${strict?' S':''}${ven?' V':''}`;nulls[key]=nul+'/'+N;}
 }}
console.log('cases',tot,'fails',fails.n||0);fails.forEach(x=>console.log(' ',x));
console.log('null>10%:',Object.keys(nulls).length);Object.entries(nulls).slice(0,80).forEach(([k,v])=>console.log(' ',k,v));
E.S.patm=760;E.S.agref=12;E.S.usek=false;E.S.units='mmHg';
const worst=Math.max(0,...Object.values(nulls).map(v=>+v.split('/')[0]/N));
console.log('Generator sweep: '+tot+' cases, '+(fails.n||0)+' broken, worst no-case rate '+Math.round(worst*100)+'%');
process.exitCode=((fails.n||0)>0||worst>0.25)?1:0;
if(process.argv[3]==='r')for(const c in ranges){console.log(c.padEnd(10),Object.entries(ranges[c]).map(([k,v])=>k+' '+(+v[0].toFixed(2))+'–'+(+v[1].toFixed(2))).join(' | '));}
