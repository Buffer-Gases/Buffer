/* ================= CITRUS HUB + GOOGLE DRIVE (hub-contract.md, 4.1) ================= */
const HUB_ROOT='My Apps',HUB_DIR='hub',APP_SLUG='buffer',APP_TITLE='Buffer';
const SHARED_CID='753489712404-ra7ahu34gjl305b4ss1765idmqg7am5s.apps.googleusercontent.com';
const G={tok:null,exp:0,email:null,ids:{},busy:false,again:false,line:'',plan:null,planDays:{},expired:false};
const gk=k=>'buffer_'+k;
function gLoad(){try{const t=JSON.parse(localStorage.getItem(gk('google'))||'null');if(t&&t.exp>Date.now()){G.tok=t.tok;G.exp=t.exp;G.email=t.email;}G.ids=JSON.parse(localStorage.getItem(gk('drive_ids'))||'{}');}catch(e){}}
function gSave(){try{localStorage.setItem(gk('google'),JSON.stringify({tok:G.tok,exp:G.exp,email:G.email}));localStorage.setItem(gk('drive_ids'),JSON.stringify(G.ids));}catch(e){}}
gLoad();
const wasConnected=()=>{try{return localStorage.getItem(gk('connected'))==='1';}catch(e){return false;}};
const hubCan=()=>{try{return window.isSecureContext&&!/claude\.ai$|claudeusercontent\.com$/.test(location.hostname)&&!/^blob:|^data:|^file:/.test(location.href);}catch(e){return false;}};
const signedIn=()=>!!G.tok&&G.exp>Date.now();
const gcfg=()=>{S.google=S.google||{clientId:'',syncState:true,publish:true};if(!S.google.clientId)S.google.clientId=SHARED_CID;return S.google;};
function gsi(){return new Promise((res,rej)=>{if(window.google&&google.accounts)return res();const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=()=>res();s.onerror=()=>rej(new Error('Google script blocked'));document.head.appendChild(s);});}
/* sign-in only ever opens Google's window from inside a tap (phones block it otherwise) */
async function connectGoogle(renew){const cid=(gcfg().clientId||'').trim();await gsi();
 return new Promise((res,rej)=>{const c=google.accounts.oauth2.initTokenClient({client_id:cid,scope:'openid email https://www.googleapis.com/auth/drive',callback:async r=>{if(r.error)return rej(new Error(r.error));G.tok=r.access_token;G.exp=Date.now()+(r.expires_in||3600)*1000-60000;G.expired=false;try{const u=await (await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{Authorization:'Bearer '+G.tok}})).json();G.email=u.email||null;}catch(e){}try{localStorage.setItem(gk('connected'),'1');}catch(e){}gSave();res();},error_callback:e=>{const t=e&&e.type||'';rej(new Error(t==='popup_failed_to_open'?'Your browser blocked the Google window. Allow pop-ups for this site, or open Buffer in Chrome or Safari to connect once.':t==='popup_closed'?'The Google window closed before finishing. If it showed an error, this site\'s address is probably missing from the Citrus web client\'s authorised JavaScript origins.':t||'Sign-in cancelled'));}});c.requestAccessToken(renew?{prompt:''}:{prompt:'consent'});});}
function signOut(){G.tok=null;G.exp=0;G.email=null;G.expired=false;try{localStorage.removeItem(gk('connected'));}catch(e){}gSave();G.line='Signed out';renderGoogle();renderCitrusLine();}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* every call: 30 s limit, retry with back-off on rate limit / server errors, 401 = tap to renew */
async function gfetch(url,opt={}){if(!signedIn())throw new Error('Sign in needed');let last;
 for(let i=0;i<4;i++){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),30000);let r;
  try{r=await fetch(url,Object.assign({},opt,{signal:ac.signal,headers:Object.assign({},opt.headers||{},{Authorization:'Bearer '+G.tok})}));}
  catch(e){clearTimeout(to);last=new Error(e.name==='AbortError'?'Drive took too long (30 s)':'No connection');if(i<3){await sleep(700*Math.pow(2,i));continue;}throw last;}
  clearTimeout(to);
  if(r.status===401){G.tok=null;G.expired=true;gSave();throw new Error('Google sign-in expired · tap to reconnect');}
  if(r.status===429||r.status>=500||r.status===403){const t=await r.text().catch(()=>'');const limited=r.status!==403||/rate|quota|limit/i.test(t);if(limited&&i<3){await sleep(800*Math.pow(2,i));continue;}last=new Error('Drive '+r.status+(t?': '+t.slice(0,80):''));throw last;}
  if(!r.ok){const t=await r.text().catch(()=>'');throw new Error('Drive '+r.status+(t?': '+t.slice(0,80):''));}
  const ct=r.headers.get('content-type')||'';return ct.includes('json')?r.json():r.text();}
 throw last||new Error('Drive unreachable');}
const DRIVE='https://www.googleapis.com/drive/v3',UPL='https://www.googleapis.com/upload/drive/v3';
const qesc=s=>s.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
async function folder(name,parent,create=true){const key=(parent||'root')+'/'+name;if(G.ids[key]){try{const f=await gfetch(DRIVE+'/files/'+G.ids[key]+'?fields=id,trashed');if(!f.trashed)return G.ids[key];}catch(e){if(/expired|Sign in/.test(e.message))throw e;}delete G.ids[key];}
 const q="name='"+qesc(name)+"' and mimeType='application/vnd.google-apps.folder' and trashed=false and '"+(parent||'root')+"' in parents";const j=await gfetch(DRIVE+'/files?q='+encodeURIComponent(q)+'&orderBy=createdTime&fields=files(id)');let id=j.files&&j.files[0]&&j.files[0].id;
 if(!id){if(!create)return null;const c=await gfetch(DRIVE+'/files',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,mimeType:'application/vnd.google-apps.folder',parents:[parent||'root']})});id=c.id;}
 G.ids[key]=id;gSave();return id;}
/* files by name, newest first (duplicates happen when two phones create at once) */
async function listFiles(name,parent){const j=await gfetch(DRIVE+'/files?q='+encodeURIComponent("name='"+qesc(name)+"' and '"+parent+"' in parents and trashed=false")+'&orderBy=modifiedTime%20desc&fields=files(id,modifiedTime,md5Checksum,appProperties)');return j.files||[];}
async function trashExtras(files){for(const f of files.slice(1)){try{await gfetch(DRIVE+'/files/'+f.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});}catch(e){}}}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
async function putJSON(name,parent,obj,h){const files=await listFiles(name,parent);const ex=files[0];const b='buf'+Date.now();const meta=ex?{name}:{name,parents:[parent]};if(h)meta.appProperties={h};const txt=JSON.stringify(obj);
 const body='--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(meta)+'\r\n--'+b+'\r\nContent-Type: application/json\r\n\r\n'+txt+'\r\n--'+b+'--';
 const r=await gfetch((ex?UPL+'/files/'+ex.id:UPL+'/files')+'?uploadType=multipart&fields=id,md5Checksum,modifiedTime',{method:ex?'PATCH':'POST',headers:{'Content-Type':'multipart/related; boundary='+b},body});
 if(files.length>1)trashExtras(files);return r;}
/* a damaged / half-written file counts as missing: try older copies, never throw */
async function getJSON(name,parent){const files=await listFiles(name,parent);if(files.length>1)trashExtras(files);
 for(const f of files){try{const t=await gfetch(DRIVE+'/files/'+f.id+'?alt=media');const d=typeof t==='string'?JSON.parse(t):t;if(d&&typeof d==='object')return {data:d,file:f};}catch(e){if(/expired|Sign in/.test(e.message))throw e;}}return null;}
async function hubFolder(){const root=await folder(HUB_ROOT,null);const hub=await folder(HUB_DIR,root);return {root,hub,app:await folder(APP_SLUG,hub)};}

/* ---- plan + shifts -> slots ---- */
const isoD=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addD=(k,n)=>{const d=new Date(k+'T12:00:00');d.setDate(d.getDate()+n);return isoD(d);};
const SLOT_MIN={free:25,before:20,early:15,postnight:10,tough:0};
function shiftOf(k){const d=G.planDays&&G.planDays[k];return d&&d.shift||null;}
const isNight=s=>!!s&&(s.overnight===true||/^n/i.test(String(s.code||''))||/night/i.test(String(s.label||'')));
function slotFor(k){const s=shiftOf(k);if(isNight(s))return 'tough';if(isNight(shiftOf(addD(k,-1))))return 'postnight';
 if(s&&s.start){const h=parseInt(String(s.start).slice(0,2),10);if(h<7)return 'early';}if(isNight(shiftOf(addD(k,1))))return 'before';return 'free';}
/* ---- status: the contract shape Citrus reads ---- */
function hubStatus(){const due=dueKinds().length,ms=masteryScore(),t=today(),n=todayN(),goal=S.goal||15,roundDone=S.lastRound===t;
 const d0=new Date();const dow=(d0.getDay()+6)%7;const start=new Date(d0);start.setDate(d0.getDate()-dow);const days=[];
 for(let i=0;i<7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const k=isoD(d),sh=shiftOf(k);days.push({date:k,shift:sh&&sh.code||null,studied:S.days.includes(k),planned:k>=t,slot:slotFor(k)});}
 const done=days.filter(x=>x.studied).length;const end=new Date(start);end.setDate(start.getDate()+6);
 const slotT=slotFor(t);const cap=SLOT_MIN[slotT];
 let nextTitle=roundDone?(due?'Review '+due+' due pattern'+(due>1?'s':''):'Gas of the day'):'The Round';let mins=roundDone?(due?Math.min(15,4+due*2):5):25;
 if(G.plan&&G.plan.status==='accepted'&&G.plan.title&&!roundDone){nextTitle=G.plan.title;mins=+G.plan.minutes||mins;}
 mins=Math.min(mins,cap||mins);
 const items=(S.sess||[]).filter(s=>s.d===t).map(s=>({title:(MODES[s.m]||{t:s.m}).t,minutes:Math.max(2,Math.round(s.n*1.2)),score:s.ok+'/'+s.n}));if(roundDone)items.unshift({title:'The Round',minutes:25,score:'done'});
 const summary=(roundDone?'Round done today':'Round not started')+'; '+n+'/'+goal+' gases today; '+due+' pattern'+(due===1?'':'s')+' due; mastery '+ms+'%'+(slotT==='tough'?'; night shift, resting.':'.');
 const asks=[];days.forEach(x=>{if(x.date<t)return;const m=SLOT_MIN[x.slot];if(!m)return;if(x.date===t){if(roundDone&&!due)return;asks.push({date:x.date,title:'Buffer: '+nextTitle,minutes:mins,slot:x.slot});}else asks.push({date:x.date,title:'Buffer: the Round',minutes:Math.min(25,m),slot:x.slot});});
 const askToday=asks.filter(a=>a.date===t).reduce((s,a)=>s+a.minutes,0);
 const pending=[];if(due)pending.push(due+' patterns due');if(!roundDone)pending.push('Round not done today');const w=weakestStep();if(w)pending.push('Weak step: '+STEPNAME[w.c]+' ('+Math.round(w.a*100)+'%)');
 return {app:APP_SLUG,title:APP_TITLE,icon:'🧪',color:'#F26A1B',url:location.origin+location.pathname,version:APP_VERSION,device:navigator.platform||'web',updatedAt:new Date().toISOString(),summary,
  due:due+(roundDone?0:1),estimatedMinutes:askToday||mins,streak:streak(),nextDue:asks.some(a=>a.date===t)?'today':'tomorrow',
  today:{date:t,done:roundDone,slot:slotT,items},week:{start:isoD(start),end:isoD(end),done,target:7,need:Math.max(0,7-done),days},
  next:{title:nextTitle,minutes:mins},asks,pending,
  extra:{mastery:ms,xp:S.xp||0,level:LEVELS[levelOf(S.xp||0)][1],gasesToday:n,goal,gasesRead:S.read,lessons:Object.keys(S.done).length,rounds:S.roundsDone||0}};}
let lastFp='',lastWrite=0,lastMd5='',gapT=0;
const fpOf=s=>JSON.stringify(Object.assign({},s,{updatedAt:0}));
async function writeStatus(force){if(!signedIn()||!gcfg().publish)return;const s=hubStatus();const fp=fpOf(s);const {app}=await hubFolder();
 const cur=(await listFiles('status.json',app))[0];const overwritten=!!(cur&&lastMd5&&cur.md5Checksum&&cur.md5Checksum!==lastMd5);
 if(!force&&!overwritten&&fp===lastFp)return;
 const wait=3e5-(Date.now()-lastWrite);if(!force&&!overwritten&&wait>0){clearTimeout(gapT);gapT=setTimeout(()=>syncAll(false),wait+500);return;}
 const r=await putJSON('status.json',app,s);lastMd5=r&&r.md5Checksum||'';lastFp=fp;lastWrite=Date.now();}
/* ---- state: Drive holds a copy; two phones MERGE, they never overwrite each other ---- */
const REC_N=['kinds','steps','teach','scen','flash','serial'];
function pickRec(a,b){if(a==null)return b;if(b==null)return a;if(typeof a!=='object'||typeof b!=='object')return typeof a==='number'&&typeof b==='number'?Math.max(a,b):a;
 const na=+a.n||0,nb=+b.n||0;if(na!==nb)return na>nb?a:b;const la=+a.last||+a.t||0,lb=+b.last||+b.t||0;if(la!==lb)return la>lb?a:b;return JSON.stringify(a)>=JSON.stringify(b)?a:b;}
function mergeMap(a,b,f){const o={};const ks=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);ks.forEach(k=>{o[k]=f(a&&a[k],b&&b[k]);});return o;}
const maxN=(a,b)=>Math.max(+a||0,+b||0);
function unionArr(a,b,key,cap){const seen=new Set(),out=[];[...(a||[]),...(b||[])].forEach(x=>{const k=key(x);if(seen.has(k))return;seen.add(k);out.push(x);});return out.length>cap?out.slice(-cap):out;}
function mergeStates(A,B){const a=migrate(JSON.parse(JSON.stringify(A))),b=migrate(JSON.parse(JSON.stringify(B)));
 const ea=+a.epoch||0,eb=+b.epoch||0;if(ea!==eb)return JSON.parse(JSON.stringify(ea>eb?a:b));
 const newer=(a.savedAt||'')>=(b.savedAt||'')?a:b;const o=JSON.parse(JSON.stringify(newer));
 o.xp=maxN(a.xp,b.xp);o.read=maxN(a.read,b.read);o.roundsDone=maxN(a.roundsDone,b.roundsDone);o.epoch=ea;
 o.lastRound=(a.lastRound||'')>(b.lastRound||'')?a.lastRound:b.lastRound;
 REC_N.forEach(k=>{o[k]=mergeMap(a[k],b[k],pickRec);});
 o.done=mergeMap(a.done,b.done,(x,y)=>x||y);o.badges=mergeMap(a.badges,b.badges,(x,y)=>x||y);
 o.days=[...new Set([...(a.days||[]),...(b.days||[])])].sort().slice(-400);
 o.dayN=mergeMap(a.dayN,b.dayN,maxN);o.why=mergeMap(a.why,b.why,(x,y)=>typeof x==='number'||typeof y==='number'?maxN(x,y):pickRec(x,y));
 o.qs=mergeMap(a.qs,b.qs,pickRec);
 ['ret','gym','est'].forEach(k=>{o[k]=pickRec(a[k],b[k])||o[k];});
 if(a.reflex||b.reflex){const x=a.reflex||{},y=b.reflex||{};o.reflex=Object.assign({},newer.reflex||{},{lvl:maxN(x.lvl,y.lvl),hist:((x.hist||[]).length>=(y.hist||[]).length?x.hist:y.hist)||[]});}
 o.sess=unionArr(a.sess,b.sess,x=>JSON.stringify(x),120);o.mist=unionArr(a.mist,b.mist,x=>x.id||JSON.stringify(x),40);
 if(Array.isArray(a.conf)||Array.isArray(b.conf))o.conf=unionArr(a.conf,b.conf,x=>JSON.stringify(x),300);
 const ra=a.round&&a.round.date===today()?a.round:null,rb=b.round&&b.round.date===today()?b.round:null;o.round=ra&&rb?(JSON.stringify(ra).length>=JSON.stringify(rb).length?ra:rb):(ra||rb||null);
 return o;}
const coreOf=o=>{const c=Object.assign({},o);delete c.google;delete c.savedAt;delete c.device;return c;};
const stHash=o=>hash(JSON.stringify(coreOf(o)));
function stateForDrive(){const o=Object.assign({},S);delete o.google;o.savedAt=new Date().toISOString();o.device=navigator.platform||'web';return o;}
function adopt(next,why){try{localStorage.setItem(gk('before_drive'),JSON.stringify(S));}catch(e){}const g=S.google;S=migrate(next);S.google=g;S.savedAt=next.savedAt||new Date().toISOString();_save();try{localStorage.setItem(gk('synced_h'),stHash(S));}catch(e){}G.line=why||'Merged with Drive';renderHeader();renderRoundBar();if(typeof SS==='undefined'||!SS){if(VIEW&&RENDER[VIEW]&&!SUBVIEWS.includes(VIEW))try{RENDER[VIEW]();}catch(e){}}}
const SUBVIEWS=['session','lesson','tool','scen'];
async function pullOrPush(opts={}){if(!signedIn()||!gcfg().syncState)return;const {app}=await hubFolder();
 for(let round=0;round<3;round++){
  const remote=await getJSON('state.json',app);const lh=stHash(S);
  if(!remote||!remote.data||!remote.data.v){const body=stateForDrive();const r=await putJSON('state.json',app,body,stHash(body));try{localStorage.setItem(gk('synced_h'),stHash(body));}catch(e){}S.savedAt=body.savedAt;_save();G.line=remote?'Replaced an unreadable Drive save':'Progress saved to Drive';return;}
  const rd=remote.data,rh=(remote.file.appProperties&&remote.file.appProperties.h)||stHash(rd);
  if(rh===lh&&!opts.force){G.line='Up to date';return;}
  const ea=+S.epoch||0,er=+rd.epoch||0;let merged;
  if(er>ea){adopt(rd,'Progress was reset on another device; applied');return;}
  merged=er<ea?JSON.parse(JSON.stringify(S)):mergeStates(S,rd);
  const mh=stHash(merged);
  if(mh!==lh){adopt(Object.assign({},merged,{savedAt:new Date().toISOString()}),'Merged with '+(rd.device||'another device'));}
  if(mh!==rh||opts.force){const body=stateForDrive();await putJSON('state.json',app,body,stHash(body));
   const chk=await getJSON('state.json',app);const ch=chk&&chk.file.appProperties&&chk.file.appProperties.h;
   if(chk&&ch&&ch!==stHash(body)){continue;}
   S.savedAt=body.savedAt;_save();try{localStorage.setItem(gk('synced_h'),stHash(body));}catch(e){}G.line=mh!==lh?G.line:'Progress saved to Drive';return;}
  G.line=mh!==lh?G.line:'Up to date';return;}
 G.line='Another phone is writing; will merge on the next sync';}
async function readPlan(){if(!signedIn())return;try{const root=await folder(HUB_ROOT,null,false);if(!root)return;const hub=await folder(HUB_DIR,root,false);if(!hub)return;let p=null;
 for(const nm of ['citrus','scheduler']){const f=await folder(nm,hub,false);if(f){p=await getJSON('plan.json',f);if(p)break;}}if(!p)return;const t=today();const d=p.data;
 G.planDays=d&&d.days&&typeof d.days==='object'?d.days:{};
 const arr=Array.isArray(d)?d:(d.blocks||d.items||[]);const mine=arr.filter(b=>b&&String(b.app||b.title||'').toLowerCase().includes('buffer')&&(!b.date||b.date===t));
 const rank=b=>b.status==='done'?0:b.status==='accepted'?1:2;mine.sort((x,y)=>rank(x)-rank(y));G.plan=mine[0]||null;}catch(e){if(/expired|Sign in/.test(e.message))throw e;}}
async function syncAll(force){if(!hubCan()||!signedIn()||!(gcfg().syncState||gcfg().publish))return;if(G.busy){G.again=G.again||!!force;return;}G.busy=true;
 try{let ok=true;try{await pullOrPush({force});}catch(e){if(/expired|Sign in/.test(e.message))throw e;ok=false;G.line=e.message;}
  await readPlan();if(ok)await writeStatus(force);}   /* status only after this phone has synced */
 catch(e){G.line=e.message;}finally{G.busy=false;renderGoogle();renderCitrusLine();if(G.again){G.again=false;setTimeout(()=>syncAll(false),500);}}}
/* hooks */
const _save=save;save=function(){S.savedAt=new Date().toISOString();_save();if(signedIn()&&!G.busy){clearTimeout(save._t);save._t=setTimeout(()=>syncAll(false),8000);}};
document.addEventListener('visibilitychange',()=>{if(!hubCan())return;if(document.hidden&&signedIn())syncAll(true);else if(!document.hidden&&signedIn()&&Date.now()-lastWrite>6e5)syncAll(false);});
addEventListener('pagehide',()=>{if(hubCan()&&signedIn())syncAll(true);});
/* an expired sign-in is renewed by the next tap, never in the background */
document.addEventListener('click',e=>{if(!hubCan()||signedIn()||!wasConnected()||G.renewing||!G.expired)return;if(e.target.closest('#gOut,#gConnect,#clConnect'))return;G.renewing=true;connectGoogle(true).then(()=>syncAll(true)).catch(err=>{G.line=err.message;}).finally(()=>{G.renewing=false;renderGoogle();renderCitrusLine();});},true);
/* ---- UI ---- */
function renderCitrusLine(){const el=$('citrus-line');if(!el)return;
 if(!hubCan()){el.innerHTML='<span class="eyebrow">Citrus</span><p class="note">Drive sync and Citrus planning work in the installed copy of Buffer (GitHub Pages). Here, progress stays in this browser; Settings has a backup you can move across.</p>';return;}
 if(!signedIn()){const was=wasConnected();el.innerHTML='<span class="eyebrow">Citrus & Drive</span><p class="note">'+(was?'Google sign-in expired · tap to reconnect.':'Not connected yet. One tap connects Google and Citrus.')+(G.line&&was?' <span class="muted">'+esc(G.line)+'</span>':'')+'</p><div class="btnrow"><button class="btn small primary" id="clConnect">'+(was?'Reconnect Google':'Connect Google')+'</button></div>';
  $('clConnect').onclick=async()=>{try{G.renewing=true;await connectGoogle(was);G.renewing=false;await syncAll(true);toast('Connected. Progress now lives on your Drive.','good');}catch(e){G.renewing=false;toast(e.message,'bad');}};return;}
 const t=today(),sh=shiftOf(t),slot=slotFor(t);
 const shiftTxt=sh?'<b>'+esc(String(sh.label||sh.code||'Shift'))+'</b>'+(sh.start?' '+esc(String(sh.start))+'–'+esc(String(sh.end||'')):'')+(slot==='tough'?' · Buffer rests today':slot==='postnight'?' · light day after a night':slot==='early'?' · early start, kept short':'')+'. ':'';
 el.innerHTML='<span class="eyebrow">Citrus</span><p>'+shiftTxt+(G.plan&&G.plan.status!=='none'||G.plan?'Citrus '+(G.plan.status==='done'?'logged':G.plan.status==='accepted'?'planned':'suggests')+' <b>'+esc(String(G.plan.start||G.plan.time||'today'))+' · '+esc(String(G.plan.minutes||G.plan.min||25))+' min</b>'+(G.plan.title?' · '+esc(G.plan.title):'')+'.':'No block from Citrus yet today.')+' <span class="muted">'+esc(G.line||'')+'</span></p>';}
function renderGoogle(){const r=$('google-root');if(!r)return;const g=gcfg(),ok=signedIn(),can=hubCan(),was=wasConnected();
 const status=!can?'<p class="note">You are viewing the claude.ai copy. Google cannot sign in here; the installed copy (GitHub Pages) syncs to Drive and talks to Citrus. Move progress with the backup below.</p>'
  :ok?'<div class="g-status on"><span class="g-dot"></span><div><b>Connected'+(G.email?' · '+esc(G.email):'')+'</b><small>'+esc(G.line||'Progress lives on your Drive. Citrus can see today\'s plan.')+'</small></div></div>'
  :'<div class="g-status"><span class="g-dot"></span><div><b>'+(was?'Sign-in expired':'Not connected')+'</b><small>'+(was?'Tap Reconnect. ':'One tap connects the Citrus family. ')+esc(G.line||'')+'</small></div></div>';
 r.innerHTML='<div class="card set" style="display:flex;flex-direction:column;gap:12px"><span class="eyebrow">Google & Citrus</span>'+status+
  '<div class="btnrow"><button class="btn primary" id="gConnect"'+(can?'':' disabled')+'>'+(ok||was?'Reconnect':'Connect Google')+'</button>'+(ok?'<button class="btn" id="gSync">Sync now</button><button class="btn small" id="gOut">Sign out</button>':'')+'</div>'+
  (can?'<details class="adv"><summary>Advanced</summary><div style="display:grid;gap:8px;margin-top:10px"><label class="srow"><div><b>Keep progress on Drive</b><span>My Apps/hub/buffer/state.json · phones merge, nothing is overwritten</span></div><input type="checkbox" id="gState"'+(g.syncState?' checked':'')+'></label><label class="srow"><div><b>Publish status for Citrus</b><span>My Apps/hub/buffer/status.json</span></div><input type="checkbox" id="gPub"'+(g.publish?' checked':'')+'></label><div class="ctrl"><label for="gCid"><span>Citrus web client ID</span></label><input id="gCid" value="'+esc(g.clientId||'')+'" autocomplete="off"></div><p class="note">This app\'s origin: <code>'+esc(location.origin)+'</code> <button class="btn small" id="gOrigin">Copy</button> · it must be in the client\'s authorised JavaScript origins · '+(matchMedia('(display-mode: standalone)').matches?'installed app':'browser tab')+'</p></div></details>':'')+'</div>';
 const ci=$('gCid');if(ci)ci.onchange=e=>{gcfg().clientId=e.target.value.trim()||SHARED_CID;_save();};
 if($('gOrigin'))$('gOrigin').onclick=e=>copyText(location.origin,e.currentTarget);
 if($('gState'))$('gState').onchange=e=>{gcfg().syncState=e.target.checked;_save();};if($('gPub'))$('gPub').onchange=e=>{gcfg().publish=e.target.checked;_save();};
 $('gConnect').onclick=async()=>{const id=gcfg().clientId;if(!/apps\.googleusercontent\.com$/.test(id)){G.line='That does not look like a client ID.';renderGoogle();return;}try{G.line='Opening Google…';G.renewing=true;await connectGoogle(was&&!ok);G.renewing=false;G.line='Connected';await syncAll(true);}catch(e){G.renewing=false;G.line=e.message;renderGoogle();}};
 if($('gSync'))$('gSync').onclick=()=>syncAll(true);if($('gOut'))$('gOut').onclick=signOut;}
if(hubCan()){setTimeout(()=>gsi().catch(()=>{}),800);}
function hubBoot(){if(!hubCan())return;if(signedIn()){syncAll(false);return;}if(wasConnected()){G.expired=true;G.line='Google sign-in expired · tap to reconnect';}}
