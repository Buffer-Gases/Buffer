
const fs=require('fs'),path=require('path');const dir=path.join(__dirname,'..');
const files=process.argv.slice(2);
const src=files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n').replace(/^const XQ=\{\};/m,'');
const XQ={};new Function('XQ',src)(XQ);
const ld=require('./load.js');const ids=new Set(ld.L.map(l=>l.id));
let bad=0,n=0,longest=0;
for(const id in XQ){if(!ids.has(id)){console.log('UNKNOWN lesson',id);bad++;}
 XQ[id].forEach((q,i)=>{n++;const [p,o,c,w]=q;
  if(typeof p!=='string'||!Array.isArray(o)||o.length!==4||!(c>=0&&c<4)||typeof w!=='string'||!w){console.log('BAD',id,i);bad++;return;}
  if(new Set(o).size!==4){console.log('DUP OPT',id,i);bad++;}
  const lens=o.map(x=>x.length);const oth=lens.filter((_,i)=>i!==c);if(lens[c]>1.25*Math.max(...oth)){longest++;console.log('LONGEST',id,i,JSON.stringify(lens),c);}});}
console.log(n+' questions, '+bad+' structural problems, '+longest+' where the correct option is the longest');
