/* ================= 4.4: speed and noise — five-second read, noisy printouts, pattern flashes, handover sentences ================= */
const SPEED={
 five:{t:'Five-second read',d:'Name the gas before the bar runs out. Trains the glance you use on a busy shift.',icon:'timer',n:12},
 noisy:{t:'Real printouts',d:'Full analyser printouts with every value, flag and unit. Find the read, and spot the samples that do not add up.',icon:'steps',n:10},
 pflash:{t:'Pattern flash',d:'The gas shows for a moment, then hides. Name the pattern from memory. The time shortens as you improve.',icon:'bolt',n:15},
 handover:{t:'Handover line',d:'Pick the one-line handover a senior wants: sample, read, cause and the next action.',icon:'fit',n:8}};
Object.keys(SPEED).forEach(k=>{if(!MODES[k])MODES[k]={t:SPEED[k].t,d:SPEED[k].d,icon:SPEED[k].icon,hidden:true};});
VIEWS.push('speed');SUBV.push('speed');TABOF.speed='practice';
let SP=null;
const SP_KINDS=()=>kindsFor(Math.max(3,S.lvl||4));
function spCase(){for(let i=0;i<10;i++){const c=safeCase(pick(SP_KINDS()),Math.max(3,S.lvl||4));if(c&&c.label)return c;}return safeCase('hagma',4);}
function spOptions(c,lvl){const opts=[c.label,...distract(c.label,lvl,3)];return spShuffle(opts);}
function spShuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function gasBlock(c,more){const U=PU();const rows=[['pH',c.pH.toFixed(2)],['PCO₂ <i>'+U+'</i>',P(c.pco2)],['HCO₃⁻',r1(c.hco3)]];
 if(more){rows.push(['Na⁺',c.na],['Cl⁻',c.cl]);if(c.alb!=null)rows.push(['Alb <i>g/L</i>',c.alb]);}
 return '<div class="spgas">'+rows.map(r=>'<div><small>'+r[0]+'</small><b>'+r[1]+'</b></div>').join('')+'</div>';}
const NOISE=[['Hb','g/dL',()=>r1(9+Math.random()*7),12,16],['Hct','%',()=>Math.round(28+Math.random()*20),36,48],['K⁺','mmol/L',null,3.5,5.1],['iCa²⁺','mmol/L',()=>(1+Math.random()*0.35).toFixed(2),1.15,1.33],['Glu','mmol/L',null,3.9,7.8],['Lac','mmol/L',null,0.5,2.2],['Crea','µmol/L',()=>Math.round(55+Math.random()*180),60,110],['tHb O₂Hb','%',()=>r1(90+Math.random()*7),94,98],['COHb','%',()=>r1(0.4+Math.random()*2.6),0,1.5],['MetHb','%',()=>r1(0.2+Math.random()*1.1),0,1.5],['Temp','°C',()=>r1(36.2+Math.random()*2.6),null,null],['Baro','mmHg',()=>Math.round(740+Math.random()*25),null,null]];
function spFlag(v,lo,hi){if(lo==null||v==null)return '';const x=+v;return x<lo?'L':x>hi?'H':'';}
function printout(c,bad){const U=PU();const ph=bad?r2(c.pH+(Math.random()<0.5?-1:1)*(0.09+Math.random()*0.06)):c.pH;
 const be=0.93*(c.hco3-24.4+14.8*(c.pH-7.4));const ag=c.na-(c.cl+c.hco3);
 const main=[['pH','',ph.toFixed(3),7.35,7.45],['pCO₂',U,P(c.pco2),S.units==='kPa'?4.7:35,S.units==='kPa'?6:45],['pO₂',U,P(c.po2||90),S.units==='kPa'?10.7:80,S.units==='kPa'?13.3:100],['cHCO₃⁻(P)c','mmol/L',r1(c.hco3),22,26],['cBase(Ecf)c','mmol/L',(be>=0?'+':'')+r1(be),-2,2],['Na⁺','mmol/L',c.na,136,145],['Cl⁻','mmol/L',c.cl,98,107],['Anion gap c','mmol/L',r1(ag),8,16]];
 const extra=NOISE.map(n=>{let v=n[2]?n[2]():n[0]==='K⁺'?c.k:n[0]==='Glu'?c.glu:n[0]==='Lac'?c.lac:null;if(v==null)return null;return [n[0],n[1],v,n[3],n[4]];}).filter(Boolean);
 const rows=main.concat(spShuffle(extra).slice(0,6+Math.floor(Math.random()*4)));
 return '<div class="printout"><div class="ph">'+(c.fio2&&c.fio2>0.21?'FiO₂ '+Math.round(c.fio2*100)+'% · ':'')+'Sample: Arterial · Temp 37.0 °C</div><table>'+rows.map(r=>'<tr><td>'+r[0]+'</td><td class="mono">'+r[2]+'</td><td class="fl">'+spFlag(r[2],r[3],r[4])+'</td><td class="u">'+r[1]+'</td><td class="rr">'+(r[3]!=null?r[3]+'–'+r[4]:'')+'</td></tr>').join('')+'</table></div>';}
const BADSAMPLE='Numbers do not fit: repeat the sample';
const NEXTACT={hagma:'lactate, ketones, renal function and an osmolar gap',nagma:'potassium and a urine anion gap',malk:'urine chloride and potassium',rac:'look for the cause of hypoventilation; NIV or airway support if failing',ralk:'look for hypoxaemia, sepsis or salicylate before calling it anxiety',mixed:'treat the dangerous process first and repeat the gas'};
function actFor(c){const o=c.o||interp(c);const r=o.r||{};if(r.mac&&r.mac!=='NAGMA'&&(o.prim||[]).length)return NEXTACT.hagma;if(r.mac==='NAGMA')return NEXTACT.nagma;if(r.rac)return NEXTACT.rac;if(r.ralk)return NEXTACT.ralk;if(r.malk)return NEXTACT.malk;return NEXTACT.mixed;}
function handoverLine(c,label,act){return 'ABG: '+label.charAt(0).toLowerCase()+label.slice(1)+'. Next: '+act+'.';}
function handoverOpts(c,lvl){const right=handoverLine(c,c.label,actFor(c));const ds=distract(c.label,lvl,2);
 const w1=handoverLine(c,ds[0]||'Normal gas',actFor(c)),w2=handoverLine(c,c.label,pick(Object.values(NEXTACT).filter(a=>a!==actFor(c)))),w3=handoverLine(c,ds[1]||ds[0]||'Normal gas',actFor(c));
 return {right,opts:spShuffle([right,w1,w2,w3])};}

function startSpeed(mode){SP={mode,i:0,n:SPEED[mode].n,ok:0,ms:[],flashMs:mode==='pflash'?Math.max(800,2000-((S.speed&&S.speed.pflash&&S.speed.pflash.lvl)||0)*200):0,hist:[]};go('speed');}
RENDER.speed=function(){const el=$('v-speed');if(!SP){el.innerHTML='<div class="empty"><b>Pick a drill in Practice.</b><button class="btn primary" data-go="practice">Practice</button></div>';el.querySelector('[data-go]').onclick=()=>go('practice');return;}
 clearInterval(SP.tick);clearTimeout(SP.hide);
 if(SP.i>=SP.n)return speedDone(el);
 const lvl=Math.max(3,S.lvl||4),m=SP.mode,c=spCase();let bad=false,opts,right,body='';
 if(m==='noisy'){bad=Math.random()<0.17;right=bad?BADSAMPLE:c.label;opts=spShuffle([c.label,...distract(c.label,lvl,2),BADSAMPLE]);body=printout(c,bad);}
 else if(m==='handover'){const h=handoverOpts(c,lvl);right=h.right;opts=h.opts;body='<p class="vig">'+esc((c.age&&!/year-old/.test(c.vig||'')?c.age+'-year-old. ':'')+(c.vig||''))+'</p>'+gasBlock(c);}
 else{right=c.label;opts=spOptions(c,lvl);body=gasBlock(c);}
 SP.cur={c,right,bad};
 el.innerHTML='<div class="crumbs"><button id="spX">← Practice</button><span class="eyebrow">'+esc(SPEED[m].t)+' · '+(SP.i+1)+'/'+SP.n+' · '+SP.ok+' right</span></div>'+
  '<div class="card spcard">'+(m==='five'?'<div class="spbar"><i id="spBar"></i></div>':'')+'<div id="spBody">'+body+'</div>'+(m==='pflash'?'<p class="note" id="spHint">Look… it hides in '+(SP.flashMs/1000).toFixed(1)+' s</p>':'')+
  '<div class="spopts'+(m==='handover'?' long':'')+'" role="group" aria-label="Answers">'+opts.map((o,i)=>'<button class="btn spo" data-i="'+i+'">'+esc(o)+'</button>').join('')+'</div><div id="spFb" role="status"></div></div>';
 $('spX').onclick=()=>{clearInterval(SP.tick);clearTimeout(SP.hide);SP=null;go('practice');};
 SP.t0=performance.now();
 if(m==='five'){const lim=5000;SP.tick=setInterval(()=>{const f=Math.min(1,(performance.now()-SP.t0)/lim);const b=$('spBar');if(b)b.style.width=(100-f*100)+'%';if(f>=1){clearInterval(SP.tick);spAnswer(null,opts);}},50);}
 if(m==='pflash'){SP.hide=setTimeout(()=>{const b=$('spBody');if(b)b.innerHTML='<div class="sphidden">Hidden. Which pattern was it?</div>';const h=$('spHint');if(h)h.textContent='';},SP.flashMs);}
 el.querySelectorAll('.spo').forEach(b=>b.onclick=()=>spAnswer(+b.dataset.i,opts));};
function spAnswer(i,opts){if(!SP||SP.answered===SP.i)return;SP.answered=SP.i;clearInterval(SP.tick);clearTimeout(SP.hide);
 const ms=performance.now()-SP.t0,cur=SP.cur,ok=i!=null&&opts[i]===cur.right;if(ok)SP.ok++;SP.ms.push(ms);SP.hist.push(ok);
 document.querySelectorAll('.spo').forEach((b,j)=>{b.disabled=true;if(opts[j]===cur.right)b.classList.add('right');else if(j===i)b.classList.add('wrong');});
 const o=cur.c.o||interp(cur.c);const comp=(o.steps||[]).find(s=>s.k==='comp');
 const why=cur.bad?'Henderson check fails: [H⁺] from 24 × PCO₂ ÷ HCO₃⁻ does not match the pH. Repeat the sample before reading it.':(comp?comp.v+'. '+comp.d:'');
 if(SP.mode==='pflash'){const b=$('spBody');if(b)b.innerHTML=gasBlock(cur.c);}
 $('spFb').innerHTML='<div class="fb '+(ok?'ok':'no')+'"><b>'+(i==null?'Time up. ':ok?'Right. ':'Not this one. ')+'</b>'+(SP.mode==='handover'?'A good handover names the sample, the read with compensation, the likely cause and the next action. ':'')+'<span>'+esc(why)+'</span> <span class="muted mono">'+(ms/1000).toFixed(1)+' s</span></div><div class="btnrow"><button class="btn primary" id="spNext">'+(SP.i+1>=SP.n?'Finish':'Next')+'</button></div>';
 $('spNext').onclick=()=>{SP.i++;RENDER.speed();};$('spNext').focus();
 S.read=(S.read||0)+1;touchDay(1);save();}
function speedDone(el){const m=SP.mode,n=SP.n,ok=SP.ok,med=SP.ms.slice().sort((a,b)=>a-b)[Math.floor(SP.ms.length/2)]||0;
 S.speed=S.speed||{};const r=S.speed[m]||{n:0,c:0,best:0,lvl:0};r.n+=n;r.c+=ok;r.last=Date.now();const pct=Math.round(ok/n*100);if(pct>(r.best||0))r.best=pct;
 let lvlMsg='';if(m==='pflash'){if(pct>=80&&(r.lvl||0)<6){r.lvl=(r.lvl||0)+1;lvlMsg='Next time the gas shows for '+(Math.max(800,2000-r.lvl*200)/1000).toFixed(1)+' s.';}else if(pct<50&&r.lvl>0){r.lvl--;lvlMsg='Next time it shows a little longer.';}}
 S.speed[m]=r;S.sess=S.sess||[];S.sess.push({d:today(),m,n,ok});if(S.sess.length>120)S.sess.shift();save();
 el.innerHTML='<div class="view-head"><div class="ph"><span class="eyebrow">'+esc(SPEED[m].t)+' · done</span><h1>'+ok+'/'+n+'</h1><p>Median '+(med/1000).toFixed(1)+' s per gas. Best so far '+r.best+'%. '+esc(lvlMsg)+'</p></div></div>'+
  '<div class="card"><div class="hrow">'+SP.hist.map(x=>'<i class="'+(x?'ok':'no')+'"></i>').join('')+'</div></div><div class="btnrow"><button class="btn primary" id="spAgain">Again</button><button class="btn" id="spBack">Practice</button></div>';
 const mm=m;$('spAgain').onclick=()=>startSpeed(mm);$('spBack').onclick=()=>{SP=null;go('practice');};}
if(RENDER.practice){const _rpr=RENDER.practice;RENDER.practice=function(){_rpr();const el=$('v-practice');if(!el)return;const shelves=el.querySelectorAll('.shelf');const at=shelves[shelves.length-1]||el.lastChild;
 const d=document.createElement('div');d.className='shelf';d.innerHTML='<h2>Speed and noise <small>for the shift</small></h2><div class="tiles">'+Object.keys(SPEED).map(k=>{const r=(S.speed||{})[k];return '<button class="tile" data-speed="'+k+'"><span class="mono-mark">'+ic(SPEED[k].icon)+'</span><span><small class="meta">'+(r&&r.n?Math.round(r.c/r.n*100)+'% · best '+r.best+'%':SPEED[k].n+' gases')+'</small><b>'+SPEED[k].t+'</b><span class="d">'+SPEED[k].d+'</span></span></button>';}).join('')+'</div>';
 if(shelves.length>1)shelves[0].after(d);else if(at&&at.after)at.after(d);else el.appendChild(d);
 d.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>startSpeed(b.dataset.speed));};}
document.addEventListener('keydown',e=>{if(VIEW!=='speed'||!SP||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;
 const n=parseInt(e.key,10);if(n>=1&&n<=4){const b=document.querySelectorAll('.spo')[n-1];if(b&&!b.disabled){b.click();e.preventDefault();}}else if(e.key==='Enter'&&$('spNext')){$('spNext').click();e.preventDefault();}});
