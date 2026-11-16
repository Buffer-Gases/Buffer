// Question-bank lint (D23). Every lesson question as shipped (lesson q plus the XQ batches merged and shuffled by c9.js):
//  1. 4 distinct options and a valid answer index;
//  2. the correct option is never longer than 1.3 x the longest wrong one and 4+ characters longer (a long correct answer gives it away);
//  3. answer positions are balanced: each of A-D holds 15-35% of the answers, overall and for the questions written in the lessons;
//  4. every XQ entry lists the correct option first (index 0), the convention c9.js relies on.
// Run: node tests/lint.js [-v]   (-v lists every long-answer question)
const E=require('./load.js');const RATIO=1.3,LO=0.15,HI=0.35,verbose=process.argv.includes('-v');
const fs=require('fs'),path=require('path');
const fileOf={},srcs=['c1.js','c2.js','c3.js','c4.js','c10.js','c11.js'].map(f=>[f,fs.readFileSync(path.join(__dirname,'..',f),'utf8')]);
for(const rx of [/lesson\(\{id:'([^']+)'/g,/^\s*\{id:'([^']+)'/gm])for(const [f,s] of srcs)for(const m of s.matchAll(rx))fileOf[m[1]]=fileOf[m[1]]||f;
let bad=0,n=0;const long=[],pos={all:[0,0,0,0],lesson:[0,0,0,0],xq:[0,0,0,0]};
for(const l of E.L){const nx=(E.XQ[l.id]||[]).length,n0=l.q.length-nx;
 l.q.forEach((q,i)=>{n++;const [p,o,c]=q;const where=l.id+' q'+i+(i<n0?' ('+(fileOf[l.id]||'lesson')+')':' (XQ '+(i-n0)+')');
  if(typeof p!=='string'||!Array.isArray(o)||o.length!==4||!(c>=0&&c<4)){console.log('BAD',where);bad++;return;}
  if(new Set(o).size!==4){console.log('DUPLICATE OPTION',where);bad++;}
  pos.all[c]++;pos[i<n0?'lesson':'xq'][c]++;
  const lens=o.map(x=>String(x).length),oth=Math.max(...lens.filter((_,j)=>j!==c));
  /* very short options (numbers such as "18" vs "25.5") differ by a few characters only: they need a 4-character gap too */
  if(lens[c]>RATIO*oth&&lens[c]-oth>=4)long.push(where+' lengths '+lens.join('/')+' correct '+'ABCD'[c]+' "'+p.slice(0,50)+'"');});}
for(const id in E.XQ)E.XQ[id].forEach((q,i)=>{if(q[2]!==0){console.log('XQ correct option not first',id,i);bad++;}});
if(long.length){console.log(long.length+' questions where the correct option is the longest by more than '+RATIO+'x'+(verbose?':':' (run with -v to list):'));(verbose?long:long.slice(0,12)).forEach(x=>console.log('  LONG '+x));if(!verbose&&long.length>12)console.log('  …');}
let unbal=0;for(const k in pos){const t=pos[k].reduce((a,b)=>a+b,0);if(t<40)continue;const sh=pos[k].map(x=>x/t);const ok=sh.every(s=>s>=LO&&s<=HI);if(!ok)unbal++;
 console.log((ok?'positions ':'UNBALANCED positions ')+k+': '+pos[k].map((x,i)=>'ABCD'[i]+' '+Math.round(sh[i]*100)+'%').join(', ')+' of '+t);}
console.log('Bank lint: '+n+' questions, '+bad+' structural problems, '+long.length+' long correct options, '+unbal+' unbalanced groups');
process.exitCode=(bad||long.length||unbal)?1:0;
