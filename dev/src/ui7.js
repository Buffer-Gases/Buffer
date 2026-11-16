/* ================= 4.4: speed and noise — five-second read, noisy printouts, pattern flashes, handover sentences ================= */
const SPEED={
 five:{t:'Five-second read',d:'Name the gas from pH, PCO₂ and HCO₃⁻ before the bar runs out. Mixed gases get more time. Anion-gap work stays in Real printouts.',icon:'timer',n:12},
 noisy:{t:'Real printouts',d:'Full analyser printouts with every value, flag and unit. Find the read, and spot the samples that must be repeated.',icon:'steps',n:10},
 pflash:{t:'Pattern flash',d:'The gas shows for a moment, then hides. Name the pattern from memory. The time shortens as you improve.',icon:'bolt',n:15},
 handover:{t:'Handover line',d:'Pick the one-line handover a senior wants: the sample, the read and the right next step.',icon:'fit',n:8}};
Object.keys(SPEED).forEach(k=>{if(!MODES[k])MODES[k]={t:SPEED[k].t,d:SPEED[k].d,icon:SPEED[k].icon,hidden:true};});
VIEWS.push('speed');SUBV.push('speed');TABOF.speed='practice';
let SP=null;
/* the drills follow the Practice difficulty as set (1 Basics … 4 Full read) */
const spLvl=()=>Math.min(4,Math.max(1,+S.lvl||4));
/* Five-second read and Pattern flash show only pH, PCO₂ and HCO₃⁻, so they are keyed at a three-number label
   (metabolic acidosis is not split by the gap) and kinds whose label needs the gap to be seen at all are left out */
const SP3_OUT=['hag_malk','hag_malk_ralk'];
const sp3Label=(r,lvl)=>buildLabel(r,lvl<=1?1:2);
function sp3Pool(lvl){const s=new Set();kindsFor(lvl).filter(k=>!SP3_OUT.includes(k)).forEach(k=>{const t=TARGET[KINDS[k].lbl];s.add(sp3Label({mac:t.mac||null,malk:!!t.malk,rac:!!t.rac,ralk:!!t.ralk,rq:t.rq||null},lvl));});return [...s];}
function spCase(m,lvl,opt){opt=opt||{};const three=m==='five'||m==='pflash';const ks=kindsFor(lvl).filter(k=>!three||!SP3_OUT.includes(k));
 for(let i=0;i<30;i++){const kind=pick(ks);let c=null;
  if(opt.ven)c=genCase(kind,lvl,{ven:true});
  if(!c)c=safeCase(kind,lvl,three?{strict:true}:undefined);
  if(!c||!c.label)continue;
  if(three){const o3=interp({pH:c.pH,pco2:c.pco2,hco3:c.hco3},{usek:false});if(o3.err)continue;const k3=sp3Label(o3.r,lvl);if(k3!==sp3Label(c.o.r,lvl))continue;c.key3=k3;c.o3=o3;}
  return c;}
 const c=safeCase('ralk_a',lvl);if(c&&three){c.o3=interp({pH:c.pH,pco2:c.pco2,hco3:c.hco3},{usek:false});c.key3=sp3Label(c.o3.r,lvl);}return c;}
/* similar-label distractors from a given pool (same scoring as distract() in e1.js) */
function spDistract(label,pool,n){const a=label.toLowerCase();const sc=x=>{let s=0;const b=x.toLowerCase();['acidosis','alkalosis','respiratory','metabolic','hagma','nagma','acute','chronic'].forEach(w=>{if(a.includes(w)&&b.includes(w))s++;});return s+Math.random()*1.5;};
 return pool.filter(x=>x!==label).map(x=>[x,sc(x)]).sort((p,q)=>q[1]-p[1]).slice(0,n).map(p=>p[0]);}
function spShuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function gasBlock(c,more){const U=PU();const rows=[['pH','',c.pH.toFixed(2)],['PCO₂',U,P(c.pco2)],['HCO₃⁻','mmol/L',(+c.hco3).toFixed(1)]];
 if(more){rows.push(['Na⁺','mmol/L',c.na],['Cl⁻','mmol/L',c.cl]);if(c.alb!=null)rows.push(['Albumin','g/L',c.alb]);}
 const say=rows.map(r=>r[0]+' '+r[2]+(r[1]?' '+r[1]:'')).join(', ');
 return '<div class="spgas" role="group" aria-label="'+esc(say)+'">'+rows.map(r=>'<div><small>'+r[0]+(r[1]?' <i>'+r[1]+'</i>':'')+'</small><b>'+r[2]+'</b></div>').join('')+'</div>';}
/* plain text of an interpreter step (steps may hold <b> tags) */
const spTxt=s=>String(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
/* the reasoning behind a key: system, compensation, and the gap when it was shown */
function spWhy(o,label,noGap){const st=(o&&o.steps)||[];const g=k=>st.find(s=>s.k===k);const out=[];
 const sys=g('sys');if(sys)out.push(spTxt(sys.v)+'.');
 const comp=g('comp');if(comp)out.push(spTxt(comp.v)+'. '+spTxt(comp.d));
 const gap=g('gap');if(gap&&!noGap&&!/not calculated/i.test(gap.v))out.push(spTxt(gap.v)+'.');
 out.push('Key: '+label+'.');return out.join(' ').replace(/\.\./g,'.');}
/* ---- analyser printout ----
   Every value follows the story: sO₂ from pO₂ (Severinghaus 1979, with the Bohr shift), FO₂Hb = sO₂ × (100 − COHb − MetHb) / 100,
   Hct from ctHb, Baro from the altitude setting, one temperature in the header. Seeded per item, so a re-render shows the same slip.
   Case printouts (no generated kind) get fixed normal extras; only the Real printouts drill adds random, flagged noise. */
function ui7Hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function ui7SO2(po2,ph){const x=Math.max(1,po2)*Math.pow(10,0.48*((ph||7.4)-7.4));return Math.min(99.9,100/(1+23400/(x*x*x+150*x)));}
const ui7AKI=['uraem','eg','metf','diaraki','rhabdo','meth'];
const ui7Min=x=>String(x).replace(/^-/,'−');
const ui7Clock=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};
function spFlag(v,lo,hi){if(lo==null||v==null)return '';const x=+v;return x<lo?'L':x>hi?'H':'';}
/* printout(c, bad, opts) → HTML. bad: '' | 'venous' (venous blood labelled arterial) | 'bubble' (air in the syringe) | 'delay' (un-iced, run late).
   opts.seed fixes the random parts; opts.calm forces fixed normal extras (default for case printouts). */
function printout(c,bad,opts){return ui7PrintData(c,bad,opts).html;}
function ui7PrintData(c,bad,opts){opts=opts||{};if(bad===true)bad='venous';bad=bad||'';
 const seed=opts.seed!=null?opts.seed:ui7Hash([c.pH,c.pco2,c.hco3,c.na,c.cl,c.po2,c.k,c.glu,c.lac,c.alb,c.kind||'',c.cause||'',bad].join('|'));
 return withSeed(seed,()=>ui7Print(c,bad,opts));}
function ui7Print(c,bad,opts){const U=PU(),calm=opts.fixed?true:opts.calm!=null?!!opts.calm:c.kind==null,ven=c.sample==='v'&&bad!=='venous';
 const R=(typeof REF==='object'&&REF)||{},V=(typeof VREF==='object'&&VREF)||{};const rg=(k,a,b)=>R[k]||[a,b];
 let pco2=+c.pco2,hco3=+c.hco3,po2=c.po2!=null?+c.po2:(ven?38:90),lac=c.lac,glu=c.glu;const k=c.k,fio2=c.fio2||0.21,patm=S.patm||760,baro=Math.round(patm+rnd(-4,4));
 const ph0=phFrom(hco3,pco2);let ph=Math.abs(ph0-c.pH)<0.006?ph0:+c.pH;
 let mins=Math.round(rnd(3,11));
 if(bad==='venous'){pco2=Math.round(pco2+rnd(4,7));hco3=r1(hco3+rnd(0.6,1.4));po2=Math.round(rnd(28,42));ph=phFrom(hco3,pco2);}
 else if(bad==='bubble'){pco2=Math.max(12,Math.round(pco2*rnd(0.78,0.88)));hco3=r1(hco3-rnd(0.2,0.8));ph=phFrom(hco3,pco2);const PA=fio2*(baro-47)-pco2/0.8;po2=Math.round(fio2>0.21?150+(po2-150)*rnd(0.3,0.5):Math.max(PA+18,rnd(128,146)));}
 else if(bad==='delay'){mins=Math.round(rnd(70,110));po2=Math.round(Math.max(35,po2-rnd(12,25)));pco2=Math.round(pco2+rnd(2,4));ph=phFrom(hco3,pco2);lac=r1((lac!=null?+lac:1)+rnd(1.2,2.2));if(glu!=null)glu=r1(Math.max(2.5,glu-rnd(0.4,0.9)));}
 const cohb=c.cohb!=null?+c.cohb:calm?0.9:r1(rnd(0.4,1.6)),methb=c.methb!=null?+c.methb:calm?0.6:r1(rnd(0.3,0.9));
 const so2=r1(c.so2!=null?+c.so2:ui7SO2(po2,ph)),fo2hb=r1(so2*(100-cohb-methb)/100);
 const hb=c.hb!=null?Math.round(+c.hb):calm?138:Math.round(rnd(104,162)),hct=Math.round(hb*0.294);
 const ica=calm?1.22:r2(rnd(1.12,1.31));
 const crea=c.crea!=null?Math.round(+c.crea):calm?null:Math.round(ui7AKI.includes(c.cause)||(c.urea||0)>15?rnd(190,420):rnd(55,98));
 const be=r1(beFrom(ph,hco3)),usek=!!S.usek&&k!=null,agref=(S.agref||12)+(usek?4:0),ag=r1(c.na-(c.cl+hco3)+(usek?k:0));
 const temp=c.temp!=null?+c.temp:37;const t0=Math.floor(rnd(0,1440)),t1=t0+mins;
 const rows=[],sec=t=>rows.push({s:t}),pr=(a,b)=>P(a)+'–'+P(b),opt=()=>calm||Math.random()<0.7;
 const add=(n,u,disp,v,lo,hi,rr)=>rows.push({n,u,disp,f:v==null||lo==null?'':spFlag(v,lo,hi),rr:rr!=null?rr:lo!=null?ui7Min(lo)+'–'+hi:''});
 const phR=ven&&V.pH?V.pH:rg('pH',7.35,7.45),pcR=ven&&V.pco2?V.pco2:rg('pco2',35,45);
 sec('Blood gas');
 add('pH','',ph.toFixed(3),ph,phR[0],phR[1],phR[0].toFixed(2)+'–'+phR[1].toFixed(2));
 add('pCO₂',U,P(pco2),pco2,pcR[0],pcR[1],pr(pcR[0],pcR[1]));
 if(ven)add('pO₂',U,P(po2),null,null,null,'');else add('pO₂',U,P(po2),po2,80,100,pr(80,100));
 sec('Oximetry');
 if(opt())add('ctHb','g/L',hb,hb,115,165);
 if(ven)add('sO₂','%',so2.toFixed(1),null,null,null,'');else add('sO₂','%',so2.toFixed(1),so2,95,99);
 if(ven)add('FO₂Hb','%',fo2hb.toFixed(1),null,null,null,'');else add('FO₂Hb','%',fo2hb.toFixed(1),fo2hb,94,98);
 if(opt()||c.cohb!=null){const r=rg('cohb',0,3);add('FCOHb','%',cohb.toFixed(1),cohb,r[0],r[1],'< '+(+r[1]).toFixed(1));}
 if(opt()||c.methb!=null){const r=rg('methb',0,1.5);add('FMetHb','%',methb.toFixed(1),methb,r[0],r[1],'< '+(+r[1]).toFixed(1));}
 sec('Electrolytes');
 {const r=rg('na',135,145);add('cNa⁺','mmol/L',c.na,c.na,r[0],r[1]);}
 if(k!=null){const r=rg('k',3.5,5);add('cK⁺','mmol/L',(+k).toFixed(1),k,r[0],r[1],(+r[0]).toFixed(1)+'–'+(+r[1]).toFixed(1));}
 {const r=rg('cl',98,106);add('cCl⁻','mmol/L',c.cl,c.cl,r[0],r[1]);}
 if(opt())add('cCa²⁺','mmol/L',ica.toFixed(2),ica,1.15,1.33);
 if(glu!=null||lac!=null||crea!=null)sec('Metabolites');
 if(glu!=null){const r=rg('glu',3.9,7.8);add('cGlu','mmol/L',(+glu).toFixed(1),glu,r[0],r[1]);}
 if(lac!=null){const r=rg('lac',0,2);add('cLac','mmol/L',(+lac).toFixed(1),lac,r[0],r[1],'< '+(+r[1]).toFixed(1));}
 if(crea!=null&&opt())add('cCrea','µmol/L',crea,crea,60,110);
 sec('Calculated');
 add('cHCO₃⁻(P)c','mmol/L',hco3.toFixed(1),hco3,22,26);
 add('cBase(Ecf)c','mmol/L',(be<0?'−':'+')+Math.abs(be).toFixed(1),be,-2,2,'−2.0 to +2.0');
 add(usek?'Anion gap,K⁺c':'Anion gap c','mmol/L',ui7Min(ag.toFixed(1)),ag,agref-4,agref+2);
 if(opt())add('Hctc','%',hct,hct,35,50);
 /* extra fixed rows from a case: [name, unit, value, lo, hi]; a Temp row is ignored (the header holds the one temperature) */
 const ex=(opts.extra||[]).filter(r=>r&&!/^temp/i.test(r[0]));if(ex.length){sec('Other');ex.forEach(r=>add(r[0],r[1]||'',r[2],+r[2],r[3]!=null?r[3]:null,r[4]!=null?r[4]:null));}
 const html='<div class="printout"><div class="ph">Sample: '+(ven?'Venous':'Arterial')+' · Drawn '+ui7Clock(t0)+' · Run '+ui7Clock(t1)+'<br>FiO₂ '+Math.round(fio2*100)+'% · Pt temp '+temp.toFixed(1)+' °C · Baro '+P(baro)+' '+U+'</div><table>'+
  rows.map(r=>r.s?'<tr><td colspan="5" style="color:var(--muted);font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;padding-top:6px">'+r.s+'</td></tr>':'<tr><td>'+r.n+'</td><td class="mono">'+r.disp+'</td><td class="fl">'+r.f+'</td><td class="u">'+r.u+'</td><td class="rr">'+r.rr+'</td></tr>').join('')+
  '</table>'+(c.alb!=null?'<div class="ph" style="margin:6px 0 0">Lab chemistry, same time: albumin '+c.alb+' g/L</div>':'')+'</div>';
 return {html,d:{mins,t0:ui7Clock(t0),t1:ui7Clock(t1),po2,so2,ph,pco2,hco3,baro,fio2,ven,PA:fio2*(baro-47)-pco2/0.8}};}
const BADSAMPLE='Sample problem: repeat it before reading';
/* why each bad sample cannot be trusted; d = the printout's own numbers */
function ui7BadWhy(bad,d,spo2){const U=PU();
 if(bad==='venous')return 'Labelled arterial, but pO₂ '+P(d.po2)+' '+U+' with sO₂ '+d.so2.toFixed(0)+'%, while the oximeter read SpO₂ '+spo2+'%. That is venous blood. Repeat the arterial sample if you need oxygenation; the acid–base can be read as a VBG.';
 if(bad==='bubble')return 'pO₂ '+P(d.po2)+' '+U+' on air is above the most the alveoli can hold: PAO₂ = 0.21 × ('+P(d.baro)+' − '+P(47)+') − pCO₂ '+P(d.pco2)+' ÷ 0.8 ≈ '+P(d.PA)+' '+U+'. An air bubble pulls pO₂ towards about 150 mmHg and pCO₂ down. Expel air at once and repeat.';
 if(bad==='delay')return 'Drawn '+d.t0+', run '+d.t1+': '+d.mins+' minutes at room temperature. Blood cells keep using oxygen and glucose and making lactate and CO₂, so pO₂ and pH fall and lactate rises. Run a plastic syringe within about 30 minutes, sooner for pO₂.';
 return '';}
function ui7GoodWhy(d,spo2){return 'The sample checks out: drawn and run '+d.mins+' minutes apart'+(d.ven?', labelled venous':', sO₂ '+d.so2.toFixed(0)+'% fits the SpO₂ of '+spo2+'%, and pO₂ is below the alveolar limit')+'.';}
/* Handover: one right next step per pattern (by KINDS label key), so every option line is internally coherent.
   BTS/ICS 2016 (NIV in acute hypercapnic respiratory failure) and BTS 2017 (oxygen, target 88–92% in CO₂ retainers). */
const HACT={HAGMA:'lactate, ketones, renal function and an osmolar gap',NAGMA:'potassium, a urine anion gap and the fluid chart',MAC:'work out the anion gap, then lactate, ketones and renal function',
 MALK:'urine chloride and potassium; replace volume and K⁺',RACa:'support breathing now (naloxone if opioid, NIV or intubation) and treat the cause',RACc:'compare with their usual gas; controlled O₂ to 88–92% only if needed',
 RACac:'controlled O₂ to 88–92%, treat the exacerbation, NIV if still acidotic',RAC:'find the cause of underbreathing; support ventilation if the pH is falling',
 RALKa:'look for hypoxaemia, PE, sepsis or salicylate before calling it anxiety',RALKc:'expected in pregnancy or at altitude; otherwise look for liver disease',RALK:'look for hypoxaemia, sepsis or salicylate; ask about pregnancy and altitude',
 'HAGMA+RAC':'call for help: breathing support now, then lactate and the cause','HAGMA+RALK':'salicylate and paracetamol levels, lactate and a sepsis screen','HAGMA+MALK':'ketones and lactate, plus fluids and K⁺ for the vomiting',
 'HAGMA+NAGMA':'lactate and ketones for the gap; stool losses or saline for the chloride','RAC+MALK':'replace K⁺ and chloride and review diuretics; the alkalosis slows breathing',
 'HAGMA+MALK+RALK':'ketones or salicylate level, fluids with K⁺, and the cause of the fast breathing','RALK+MALK':'saline with K⁺ for the vomiting; find the cause of the fast breathing'};
/* below Gaps (level 3) the gap is not taught, and below Compensation (level 2) acute and chronic are not split: use the matching broad action */
function spAct(lk,lvl){const t=TARGET[lk]||{};const single=[t.mac,t.malk,t.rac,t.ralk].filter(Boolean).length===1;
 if(lvl<3&&single&&t.mac)return HACT.MAC;if(lvl<2&&single&&t.rac)return HACT.RAC;if(lvl<2&&single&&t.ralk)return HACT.RALK;return HACT[lk]||HACT.MAC;}
function spLblOf(label,lvl){const k=kindsFor(lvl).find(x=>targetLabel(x,lvl)===label);return k?KINDS[k].lbl:null;}
const spComps=lk=>{const t=TARGET[lk]||{};return ['mac','malk','rac','ralk'].filter(x=>t[x]);};
function handoverLine(c,label,act){const l=/^[A-Z][a-z]/.test(label)?label.charAt(0).toLowerCase()+label.slice(1):label;
 return (c.sample==='v'?'VBG':'ABG')+(c.fio2&&c.fio2>0.21?' on '+Math.round(c.fio2*100)+'% O₂':' on air')+': '+l+'. Next: '+act+'.';}
/* Four lines, each wrong for a teachable reason. Three layouts are mixed so that no rule about which label or action repeats finds the answer:
   0 four different reads, each with its own action; 1 the right read with a wrong action, plus a wrong read sharing that action;
   2 a wrong read with the right action, plus the same wrong read with its own action. */
function handoverOpts(c,lvl){const L=c.label,lk=KINDS[c.kind].lbl,A=spAct(lk,lvl),mine=spComps(lk);
 const seen=new Set([A]),D=[];distract(L,lvl,8).forEach(d=>{const k=spLblOf(d,lvl);if(!k)return;const a=spAct(k,lvl);if(seen.has(a))return;seen.add(a);D.push({l:d,a});});
 const Bs=Object.keys(HACT).filter(k=>TARGET[k]&&!spComps(k).some(x=>mine.includes(x))).map(k=>spAct(k,lvl)).filter(a=>!seen.has(a));
 let lay=Math.floor(Math.random()*3);if(D.length<2||(lay===1&&!Bs.length))lay=D.length>=3?0:2;if(D.length<2)lay=-1;
 const lines=[{l:L,a:A,ok:true}];
 if(lay===0)D.slice(0,3).forEach(x=>lines.push({l:x.l,a:x.a,err:'read'}));
 else if(lay===1){const B=pick(Bs);lines.push({l:L,a:B,err:'act'},{l:D[0].l,a:B,err:'read'},{l:D[1].l,a:D[1].a,err:'read'});}
 else if(lay===2)lines.push({l:D[0].l,a:A,err:'read'},{l:D[0].l,a:D[0].a,err:'read'},{l:D[1].l,a:D[1].a,err:'read'});
 else{D.forEach(x=>lines.push({l:x.l,a:x.a,err:'read'}));Bs.slice(0,4-lines.length).forEach(b=>lines.push({l:L,a:b,err:'act'}));}
 const sh=spShuffle(lines.slice(0,4));sh.forEach(x=>x.t=handoverLine(c,x.l,x.a));
 return {right:sh.find(x=>x.ok).t,opts:sh.map(x=>x.t),lines:sh,act:A};}

const spFlashMs=()=>Math.max(800,2000-((S.speed&&S.speed.pflash&&S.speed.pflash.lvl)||0)*200);
/* five-second budget grows with the number of processes in the key: 5 s, 8 s, 10 s */
const spLim=label=>[5000,5000,8000,10000][Math.min(3,String(label).split(' + ').length)];
const spSay=c=>'pH '+c.pH.toFixed(2)+', PCO₂ '+P(c.pco2)+' '+PU()+', HCO₃⁻ '+(+c.hco3).toFixed(1);
function startSpeed(mode){spKeepPartial();spStop();const n=SPEED[mode].n;let badAt=[];
 /* Real printouts: exactly one or two samples to repeat per round, at random places */
 if(mode==='noisy')badAt=spShuffle([...Array(n).keys()]).slice(0,Math.random()<0.5?1:2);
 SP={mode,lvl:spLvl(),i:0,n,ok:0,ms:[],hist:[],rev:[],badAt,flashMs:mode==='pflash'?spFlashMs():0};go('speed');}
/* stop the drill's timers; a five-second item keeps its elapsed time for when the learner comes back */
function spStop(){if(!SP)return;if(SP.tick&&SP.cur&&!SP.cur.done&&SP.t0)SP.cur.el=performance.now()-SP.t0;clearInterval(SP.tick);clearTimeout(SP.hide);SP.tick=0;SP.hide=0;}
/* answers already given count as a partial session when a drill is left or replaced */
function spKeepPartial(){if(!SP||SP.fin||!SP.hist.length)return 0;S.sess=S.sess||[];S.sess.push({d:today(),m:SP.mode,n:SP.hist.length,ok:SP.ok,partial:true,ms:Math.round(SP.ms.reduce((a,b)=>a+b,0))});if(S.sess.length>120)S.sess.shift();save();return SP.hist.length;}
function spLeave(){const k=spKeepPartial();spStop();SP=null;document.body.classList.remove('insession');if(k)toast(k+' answer'+(k===1?'':'s')+' kept.');go('practice');}
function spNewItem(){const m=SP.mode,lvl=SP.lvl,cur={i:SP.i};
 if(m==='noisy'){const isBad=SP.badAt.includes(SP.i);const c=spCase(m,lvl,{ven:!isBad&&Math.random()<0.25});
  let bad='';if(isBad){const ts=['venous','delay'];if(!(c.fio2>0.21))ts.push('bubble','bubble');bad=pick(ts);}
  const pd=ui7PrintData(c,bad,{calm:false}),art=c.art||c,spo2=Math.min(99,Math.round(ui7SO2(art.po2||90,art.pH)-Math.random()));
  Object.assign(cur,{c,bad,spo2,right:isBad?BADSAMPLE:c.label,opts:spShuffle([c.label,...distract(c.label,lvl,2),BADSAMPLE]),say:'Printout: '+spSay(c),
   body:'<p class="note" style="margin:0">Monitor at the time: SpO₂ '+spo2+'% on '+(c.fio2>0.21?Math.round(c.fio2*100)+'% O₂':'air')+'.</p>'+pd.html,
   why:isBad?ui7BadWhy(bad,pd.d,spo2)+' The patient\'s gas: '+c.label+'.':ui7GoodWhy(pd.d,spo2)+' '+(c.sample==='v'?'Venous: read on estimated arterial values (pH +0.03, PCO₂ −5, HCO₃⁻ −1). ':'')+spWhy(c.o,c.label)});}
 else if(m==='handover'){const c=spCase(m,lvl),h=handoverOpts(c,lvl);
  Object.assign(cur,{c,right:h.right,opts:h.opts,lines:h.lines,say:spSay(c),
   body:'<p class="vig">'+esc((c.age&&!/year-old/.test(c.vig||'')?c.age+'-year-old. ':'')+(c.vig||''))+'</p>'+gasBlock(c,true),
   why:spWhy(c.o,c.label)+' Likely cause: '+((typeof CAUSES==='object'&&CAUSES[c.cause])||'see the story')+'. Next: '+h.act+'.'});}
 else{const c=spCase(m,lvl);Object.assign(cur,{c,right:c.key3,opts:spShuffle([c.key3,...spDistract(c.key3,sp3Pool(lvl),3)]),say:spSay(c),body:gasBlock(c),lim:spLim(c.key3),
   why:spWhy(c.o3,c.key3,true)});}
 return cur;}
RENDER.speed=function(){const el=$('v-speed');
 if(!SP){el.innerHTML='<div class="empty"><b>Pick a drill in Practice.</b><button class="btn primary" data-go="practice">Practice</button></div>';el.querySelector('[data-go]').onclick=()=>go('practice');setTimeout(()=>{if(VIEW==='speed'&&!SP)go('practice');},0);return;}
 spStop();
 if(SP.i>=SP.n){document.body.classList.remove('insession');return speedDone(el);}
 document.body.classList.add('insession');
 /* one card per index: coming back to the view, or a re-render, shows the same gas */
 if(!SP.cur||SP.cur.i!==SP.i)SP.cur=spNewItem();
 const sp=SP,cur=SP.cur,m=SP.mode;
 const pips=Array.from({length:SP.n},(_,j)=>'<i class="'+(j<SP.hist.length?(SP.hist[j]?'ok':'no'):j===SP.i?'cur':'')+'"></i>').join('');
 el.innerHTML='<div class="sbar"><button class="iconbtn" id="spX" aria-label="Leave drill">'+ic('x')+'</button><div style="display:flex;flex-direction:column;gap:4px;min-width:0"><div class="btnrow" style="justify-content:space-between;gap:6px"><b role="heading" aria-level="1">'+esc(SPEED[m].t)+'</b><span class="stxt">'+(SP.i+1)+' / '+SP.n+' · '+SP.ok+' right'+(m==='five'?' · '+(cur.lim/1000)+' s':m==='pflash'?' · '+(SP.flashMs/1000).toFixed(1)+' s':'')+'</span></div><div class="pips" aria-hidden="true">'+pips+'</div></div><span></span></div>'+
  '<div class="card spcard">'+(m==='five'?'<div class="spbar" id="spBarW" role="progressbar" aria-label="Time left in seconds" aria-valuemin="0" aria-valuemax="'+(cur.lim/1000)+'" aria-valuenow="'+(cur.lim/1000)+'"><i id="spBar"></i></div>':'')+
  '<div id="spBody" tabindex="-1">'+cur.body+'</div>'+(m==='pflash'?'<p class="note" id="spHint">Look: it hides in '+(SP.flashMs/1000).toFixed(1)+' s. Answer once it hides.</p>':'')+
  '<div class="spopts'+(m==='handover'?' long':'')+'" role="group" aria-label="Answers">'+cur.opts.map((o,i)=>'<button class="opt spo" data-i="'+i+'"><kbd aria-hidden="true">'+(i+1)+'</kbd><span>'+esc(o)+'</span></button>').join('')+'</div><div id="spFb" role="status"></div></div>';
 $('spX').onclick=spLeave;
 el.querySelectorAll('.spo').forEach(b=>b.onclick=()=>spAnswer(+b.dataset.i));
 if(cur.done){spShowFb(true);return;}
 const now=performance.now();SP.t0=now-(cur.el||0);
 if(m==='five'){const lim=cur.lim;let lastS=-1;const bar=$('spBar');if(bar)bar.style.width=Math.max(0,100-(cur.el||0)/lim*100)+'%';
  SP.tick=setInterval(()=>{if(SP!==sp||sp.cur!==cur||VIEW!=='speed'||cur.done){if(SP===sp&&sp.cur===cur&&!cur.done&&sp.tick)cur.el=performance.now()-sp.t0;clearInterval(sp.tick);sp.tick=0;return;}
   const e=performance.now()-sp.t0,f=Math.min(1,e/lim),b=$('spBar');if(b)b.style.width=(100-f*100)+'%';
   const s=Math.max(0,Math.ceil((lim-e)/1000));if(s!==lastS){lastS=s;const w=$('spBarW');if(w)w.setAttribute('aria-valuenow',s);}
   if(f>=1){clearInterval(sp.tick);sp.tick=0;spAnswer(null);}},50);}
 if(m==='pflash'){const hideNow=()=>{const b=$('spBody');if(b)b.innerHTML='<div class="sphidden">Hidden. Which pattern was it?</div>';const h=$('spHint');if(h)h.textContent='Hidden. Pick the pattern.';el.querySelectorAll('.spo').forEach(x=>x.disabled=false);};
  if(cur.hidden)hideNow();
  else{el.querySelectorAll('.spo').forEach(x=>x.disabled=true);
   SP.hide=setTimeout(()=>{if(SP!==sp||sp.cur!==cur||VIEW!=='speed'||cur.done)return;cur.hidden=true;hideNow();sp.t0=performance.now();cur.el=0;const f=el.querySelector('.spo');if(f)try{f.focus({preventScroll:true});}catch(e){}},SP.flashMs);}}
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(SP!==sp||sp.cur!==cur||cur.done||VIEW!=='speed')return;const b=$('spBody');if(b&&!(m==='pflash'&&cur.hidden))try{b.focus({preventScroll:true});}catch(e){}}));
 announce((SP.i+1)+' of '+SP.n+'. '+cur.say+(m==='five'?'. '+(cur.lim/1000)+' seconds.':''));};
function spAnswer(i){const cur=SP&&SP.cur;if(!cur||cur.done||cur.i!==SP.i||SP.i>=SP.n)return;spStop();
 cur.done=true;cur.pick=i;cur.ms=performance.now()-SP.t0;cur.ok=i!=null&&cur.opts[i]===cur.right;
 if(cur.ok)SP.ok++;SP.ms.push(cur.ms);SP.hist.push(cur.ok);
 SP.rev.push({n:SP.i+1,ok:cur.ok,tu:i==null,ms:cur.ms,pick:i==null?null:cur.opts[i],right:cur.right,say:cur.say,why:cur.why});
 S.read=(S.read||0)+1;touchDay(1);save();
 spShowFb(true);}
/* marks and feedback for an answered card; right and wrong carry text and a ✓/✗ key, not colour alone */
function spShowFb(focus){const cur=SP.cur,i=cur.pick,ok=cur.ok,m=SP.mode;
 document.querySelectorAll('#v-speed .spo').forEach((b,j)=>{b.disabled=true;const isR=cur.opts[j]===cur.right,isP=j===i;if(!isR&&!isP)return;
  b.classList.add(isR?'right':'wrong');const k=b.querySelector('kbd');if(k)k.textContent=isR?'✓':'✗';
  if(!b.querySelector('.sptag'))b.insertAdjacentHTML('beforeend','<em class="sptag" style="font-style:normal;font-size:.78rem;font-weight:700;margin-left:auto;padding-left:8px;white-space:nowrap">'+(isR?'Right':'Your pick')+'</em>');});
 if(m==='pflash'){const b=$('spBody');if(b)b.innerHTML=gasBlock(cur.c);}
 let extra='';
 if(m==='handover'&&i!=null&&!ok&&cur.lines){const ln=cur.lines[i];extra=ln.err==='act'?'Your line has the right read, but its next step does not fit this patient. ':'Your line reads the gas as '+ln.l.charAt(0).toLowerCase()+ln.l.slice(1)+'. ';}
 $('spFb').innerHTML='<div class="fb '+(ok?'ok':'no')+'"><b>'+(i==null?'Time up. ':ok?'Right. ':'Not this one. ')+'</b><span>'+esc(extra+cur.why)+'</span> <span class="muted mono">'+(cur.ms/1000).toFixed(1)+' s</span></div><div class="btnrow"><button class="btn primary" id="spNext">'+(SP.i+1>=SP.n?'Finish':'Next')+'</button></div>';
 $('spNext').onclick=()=>{if(!SP)return;SP.i++;RENDER.speed();};if(focus)try{$('spNext').focus({preventScroll:true});}catch(e){}}
function speedDone(el){const m=SP.mode,n=SP.n,ok=SP.ok;
 /* count the round once, even if the results view is drawn again */
 if(!SP.fin){SP.fin=true;const med=SP.ms.slice().sort((a,b)=>a-b)[Math.floor(SP.ms.length/2)]||0;
  S.speed=S.speed||{};const r=S.speed[m]||{n:0,c:0,best:0,lvl:0};r.n+=n;r.c+=ok;r.last=Date.now();const pct=Math.round(ok/n*100);if(pct>(r.best||0))r.best=pct;
  let lvlMsg='';if(m==='pflash'){const was=r.lvl||0;if(pct>=80&&was<6)r.lvl=was+1;else if(pct<50&&was>0)r.lvl=was-1;const t=(Math.max(800,2000-(r.lvl||0)*200)/1000).toFixed(1);lvlMsg=r.lvl>was?'Faster next time: the gas shows for '+t+' s.':r.lvl<was?'Easier next time: the gas shows for '+t+' s.':'Next time the gas shows for '+t+' s.';}
  S.speed[m]=r;S.sess=S.sess||[];S.sess.push({d:today(),m,n,ok,ms:Math.round(SP.ms.reduce((a,b)=>a+b,0))});if(S.sess.length>120)S.sess.shift();save();
  SP.res={med,best:r.best,lvlMsg};}
 const R=SP.res;
 const sq=SP.rev.map(x=>{const lab=x.n+': '+(x.tu?'time up':x.ok?'right':'wrong')+', '+(x.ms/1000).toFixed(1)+' s';return '<i class="'+(x.ok?'ok':'no')+'" role="img" aria-label="'+lab+'" title="'+lab+'" style="display:grid;place-items:center;font-style:normal;font-size:12px;line-height:1;color:var(--bg)">'+(x.tu?'–':x.ok?'✓':'✗')+'</i>';}).join('');
 const list=SP.rev.map(x=>'<li style="margin:0 0 10px"><b>'+x.n+'.</b> '+esc(x.say)+'<br>'+(x.ok?'✓ Right: ':x.tu?'– Time up. Key: ':'✗ You picked '+esc(String(x.pick).replace(/\.$/,''))+'. Key: ')+esc(x.right)+'<br><span class="muted">'+esc(x.why)+'</span></li>').join('');
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+esc(SPEED[m].t)+' · done</span><h1>'+ok+'/'+n+'</h1><p>Median '+(R.med/1000).toFixed(1)+' s per gas. Best so far '+R.best+'%. '+esc(R.lvlMsg)+'</p></div></div>'+
  '<div class="card"><div class="hrow" role="group" aria-label="Answers in order">'+sq+'</div><p class="note" style="margin:6px 0 0">✓ right · ✗ wrong · – time up</p></div>'+
  '<details class="card"><summary>Review the '+n+' answers</summary><ol style="list-style:none;padding:0;margin:10px 0 0">'+list+'</ol></details>'+
  '<div class="btnrow"><button class="btn primary" id="spAgain">Again</button><button class="btn" id="spBack">Practice</button></div>';
 const mm=m;$('spAgain').onclick=()=>startSpeed(mm);$('spBack').onclick=()=>{SP=null;go('practice');};
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const a=$('spAgain');if(a&&VIEW==='speed')try{a.focus({preventScroll:true});}catch(e){}}));}
if(RENDER.practice){const _rpr=RENDER.practice;RENDER.practice=function(){_rpr();const el=$('v-practice');if(!el)return;const shelves=el.querySelectorAll('.shelf');const at=shelves[shelves.length-1]||el.lastChild;
 const d=document.createElement('div');d.className='shelf';d.innerHTML='<h2>Speed and noise <small>for the shift</small></h2><div class="tiles">'+Object.keys(SPEED).map(k=>{const r=(S.speed||{})[k];const lv=typeof LVLS!=='undefined'&&LVLS[spLvl()-1]?' · '+LVLS[spLvl()-1][1]:'';return '<button class="tile" data-speed="'+k+'"><span class="mono-mark">'+ic(SPEED[k].icon)+'</span><span><small class="meta">'+(r&&r.n?Math.round(r.c/r.n*100)+'% · best '+r.best+'%':SPEED[k].n+' gases')+lv+(k==='pflash'?' · flash '+(spFlashMs()/1000).toFixed(1)+' s':'')+'</small><b>'+SPEED[k].t+'</b><span class="d">'+SPEED[k].d+'</span></span></button>';}).join('')+'</div>';
 if(shelves.length>1)shelves[0].after(d);else if(at&&at.after)at.after(d);else el.appendChild(d);
 d.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>startSpeed(b.dataset.speed));};}
document.addEventListener('keydown',e=>{if(VIEW!=='speed'||!SP||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;
 if(e.key==='Escape'){if(document.querySelector('.sheet-scrim')||(t&&t.closest&&t.closest('details[open]')&&t.tagName==='SUMMARY'))return;const x=$('spX')||$('spBack');if(x){x.click();e.preventDefault();}return;}
 const n=parseInt(e.key,10);if(n>=1&&n<=4){const b=document.querySelectorAll('#v-speed .spo')[n-1];if(b&&!b.disabled){b.click();e.preventDefault();}}
 /* Enter goes to the next gas, but a focused button or link keeps its own action */
 else if(e.key==='Enter'&&$('spNext')){if(t&&t.closest&&t.closest('button,a,summary')&&t.id!=='spNext')return;$('spNext').click();e.preventDefault();}});
