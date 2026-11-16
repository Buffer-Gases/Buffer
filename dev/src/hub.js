/* ================= CITRUS HUB + GOOGLE DRIVE (hub-contract.md, 4.1) ================= */
const HUB_ROOT='My Apps',HUB_DIR='hub',APP_SLUG='buffer',APP_TITLE='Buffer';
const SHARED_CID='753489712404-ra7ahu34gjl305b4ss1765idmqg7am5s.apps.googleusercontent.com';
const G={tok:null,exp:0,email:null,ids:{},ver:{},busy:false,again:false,line:'',plan:null,planDays:{},expired:false,fail:false,retryT:0,unloading:false,nudgeX:false};
const gk=k=>'buffer_'+k;
/* this install's id (never synced: it names this device's own counters in S.ctr) */
const hubDev=(()=>{try{let d=localStorage.getItem(gk('dev'));if(!d){d='d'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);localStorage.setItem(gk('dev'),d);}return d;}catch(e){return 'd-local';}})();
/* a plain device name for messages ('Merged with Tablet'); the user can rename it in Advanced */
function hubDevName(){const n=S.google&&typeof S.google.deviceName==='string'&&S.google.deviceName.trim();if(n)return n.slice(0,30);const u=navigator.userAgent||'';
 return /Steam ?Deck|SteamOS|Valve/i.test(u)?'Steam Deck':/iPad|Tablet/i.test(u)||(/Android/i.test(u)&&!/Mobile/i.test(u))?'Tablet':/Mobi|iPhone|Android/i.test(u)?'Phone':'Computer';}
const hubHM=d=>{d=d?new Date(d):new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
/* last sync result, per device: {ok, at (last good sync), err} */
function hubHealth(){try{return JSON.parse(localStorage.getItem(gk('sync'))||'null')||{};}catch(e){return {};}}
function hubSetHealth(ok,err){const h=hubHealth();if(ok){h.ok=true;h.at=new Date().toISOString();h.err=null;}else{h.ok=false;h.err=String(err||'').slice(0,160);}G.fail=!ok;try{localStorage.setItem(gk('sync'),JSON.stringify(h));}catch(e){}}
function gLoad(){try{const t=JSON.parse(localStorage.getItem(gk('google'))||'null');if(t&&t.exp>Date.now()){G.tok=t.tok;G.exp=t.exp;G.email=t.email;}G.ids=JSON.parse(localStorage.getItem(gk('drive_ids'))||'{}');}catch(e){}}
function gSave(){try{localStorage.setItem(gk('google'),JSON.stringify({tok:G.tok,exp:G.exp,email:G.email}));localStorage.setItem(gk('drive_ids'),JSON.stringify(G.ids));}catch(e){}}
gLoad();
const wasConnected=()=>{try{return localStorage.getItem(gk('connected'))==='1';}catch(e){return false;}};
const hubCan=()=>{try{return window.isSecureContext&&!/claude\.ai$|claudeusercontent\.com$/.test(location.hostname)&&!/^blob:|^data:|^file:/.test(location.href);}catch(e){return false;}};
const signedIn=()=>!!G.tok&&G.exp>Date.now();
/* connected before, but the hour-long token has run out (by time or by a 401): sync is paused until a tap */
const hubDead=()=>hubCan()&&wasConnected()&&!signedIn();
function hubExpiry(){if(!hubCan())return false;if(G.tok&&G.exp<=Date.now()&&!G.expired){G.expired=true;G.line='';}else if(!G.tok&&wasConnected()&&!G.expired){G.expired=true;}return hubDead();}
const gcfg=()=>{S.google=S.google||{clientId:'',syncState:true,publish:true};if(!S.google.clientId)S.google.clientId=SHARED_CID;return S.google;};
const gsiReady=()=>!!(window.google&&google.accounts&&google.accounts.oauth2);
let GSI_P=null;
function gsi(){if(gsiReady())return Promise.resolve();if(GSI_P)return GSI_P;GSI_P=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=()=>{res();renderGoogle();renderCitrusLine();hubNudge();};s.onerror=()=>{GSI_P=null;rej(new Error('Google script blocked'));};document.head.appendChild(s);});return GSI_P;}
/* sign-in only ever opens Google's window from inside a tap (phones block it otherwise), so the token request
   runs synchronously in the tap: if Google's script is not loaded yet, say so and let the next tap do it */
function connectGoogle(renew){const cid=(gcfg().clientId||'').trim();
 if(!gsiReady()){gsi().catch(()=>{});return Promise.reject(new Error('Google is still loading. Tap again in a moment.'));}
 return new Promise((res,rej)=>{const c=google.accounts.oauth2.initTokenClient({client_id:cid,scope:'openid email https://www.googleapis.com/auth/drive',callback:async r=>{if(r.error)return rej(new Error(r.error));G.tok=r.access_token;G.exp=Date.now()+(r.expires_in||3600)*1000-60000;G.expired=false;G.fail=false;G.line='';G.nudgeX=false;G.ver={};hubNudge();try{const u=await (await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{Authorization:'Bearer '+G.tok}})).json();G.email=u.email||null;}catch(e){}try{localStorage.setItem(gk('connected'),'1');}catch(e){}gSave();res();},error_callback:e=>{const t=e&&e.type||'';rej(new Error(t==='popup_failed_to_open'?'Your browser blocked the Google window. Allow pop-ups for this site, or open Buffer in Chrome or Safari to connect once.':t==='popup_closed'?'The Google window closed before finishing. If it showed an error, this site\'s address is probably missing from the Citrus web client\'s authorised JavaScript origins.':t||'Sign-in cancelled'));}});c.requestAccessToken(renew?{prompt:''}:{prompt:'consent'});});}
function signOut(){G.tok=null;G.exp=0;G.email=null;G.expired=false;G.fail=false;try{localStorage.removeItem(gk('connected'));}catch(e){}gSave();G.line='Signed out';hubNudge();renderGoogle();renderCitrusLine();}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* Drive's error body in plain words (never raw JSON on screen); e.retry = seconds before one later retry */
function hubDriveErr(status,txt,ra){let reason='';try{const j=JSON.parse(txt);const er=j&&j.error;reason=(er&&er.errors&&er.errors[0]&&er.errors[0].reason)||(er&&er.status)||'';}catch(x){}
 const busy=status===429||/rate|limit/i.test(reason)||(status===403&&/rate|limit/i.test(txt));let m,retry=0;
 if(busy){m='Google Drive is busy. Buffer will try again in a minute.';retry=Math.min(60,Math.max(15,ra||30));}
 else if(/storageQuota|quotaExceeded/i.test(reason+txt))m='Your Google Drive is full. Free some space, then tap Sync now.';
 else if(status===403)m='Google did not allow Drive access. Tap Reconnect and allow Drive.';
 else if(status===404){m='A Drive file or folder went missing. It is made again on the next sync.';G.ver={};retry=20;}
 else if(status>=500){m='Google Drive had a problem. Buffer will try again in a minute.';retry=60;}
 else m='Drive refused the request ('+status+').';
 const e=new Error(m);e.retry=retry;e.status=status;return e;}
/* every call: 30 s limit, retry with back-off on rate limit / server errors (Retry-After honoured up to 8 s here,
   longer waits become one later retry), 401 = tap to renew */
async function gfetch(url,opt={}){if(!signedIn())throw new Error('Sign in needed');let last;
 for(let i=0;i<4;i++){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),30000);let r;
  const ka=G.unloading&&!(opt.body&&opt.body.length>60000)?{keepalive:true}:{};   /* a sync started at page hide can finish after the page goes */
  try{r=await fetch(url,Object.assign({},opt,ka,{signal:ac.signal,headers:Object.assign({},opt.headers||{},{Authorization:'Bearer '+G.tok})}));}
  catch(e){clearTimeout(to);last=new Error(e.name==='AbortError'?'Drive took too long (30 s). Buffer will try again.':'No connection. Buffer syncs when you are back online.');last.retry=e.name==='AbortError'?60:0;if(i<2&&navigator.onLine!==false){await sleep(700*Math.pow(2,i));continue;}throw last;}
  clearTimeout(to);
  if(r.status===401){G.tok=null;G.expired=true;gSave();throw new Error('Google sign-in expired · tap to reconnect');}
  if(!r.ok){const t=await r.text().catch(()=>'');const ra=parseInt(r.headers.get('retry-after')||'',10)||0;last=hubDriveErr(r.status,t,ra);
   const again=r.status===429||r.status>=500||(r.status===403&&last.retry);
   if(again&&i<3){const w=ra?ra*1000:800*Math.pow(2,i);if(w<=8000){await sleep(w);continue;}}
   throw last;}
  const ct=r.headers.get('content-type')||'';return ct.includes('json')?r.json():r.text();}
 throw last||new Error('Drive unreachable');}
const DRIVE='https://www.googleapis.com/drive/v3',UPL='https://www.googleapis.com/upload/drive/v3';
const qesc=s=>s.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
/* Folders are found by name, oldest first, never trusted from an old cache: two phones (or Citrus and Buffer) that
   create the same folder at the same moment both end up using the oldest one. A folder made here is listed again
   straight after, and a newer twin is emptied into the oldest and trashed. Checked once per session per folder. */
const HUB_FOLDER='application/vnd.google-apps.folder';
async function hubListFolders(name,parent){const q="name='"+qesc(name)+"' and mimeType='"+HUB_FOLDER+"' and trashed=false and '"+parent+"' in parents";
 const j=await gfetch(DRIVE+'/files?q='+encodeURIComponent(q)+'&orderBy=createdTime&fields=files(id,createdTime)');return (j.files||[]).filter(f=>f&&f.id);}
async function folder(name,parent,create=true){const p=parent||'root',key=p+'/'+name;if(G.ids[key]&&G.ver[key])return G.ids[key];
 let fs=await hubListFolders(name,p);
 if(!fs.length){if(!create)return null;await gfetch(DRIVE+'/files',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,mimeType:HUB_FOLDER,parents:[p]})});
  fs=await hubListFolders(name,p);if(!fs.length)throw new Error('Drive did not keep the new '+name+' folder. Tap Sync now to try again.');}
 const id=fs[0].id;if(fs.length>1)await hubFoldMerge(id,fs.slice(1).map(f=>f.id));
 G.ids[key]=id;G.ver[key]=1;gSave();return id;}
/* move everything from the twin folders into the kept one (file ids stay the same), then trash the empty twins;
   duplicate files that this creates (two state.json) are merged by the next read */
async function hubFoldMerge(keep,extras){for(const x of extras){try{
  const j=await gfetch(DRIVE+'/files?q='+encodeURIComponent("'"+x+"' in parents and trashed=false")+'&fields=files(id,name)&pageSize=1000');
  for(const f of (j.files||[]))await gfetch(DRIVE+'/files/'+f.id+'?addParents='+encodeURIComponent(keep)+'&removeParents='+encodeURIComponent(x)+'&fields=id',{method:'PATCH',headers:{'Content-Type':'application/json'},body:'{}'});
  await gfetch(DRIVE+'/files/'+x,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});
  Object.keys(G.ids).forEach(k=>{if(G.ids[k]===x||k.startsWith(x+'/')){delete G.ids[k];delete G.ver[k];}});}
 catch(e){if(/expired|Sign in/.test(e.message))throw e;}}}
/* files by name, newest first (duplicates happen when two phones create at once) */
async function listFiles(name,parent){const j=await gfetch(DRIVE+'/files?q='+encodeURIComponent("name='"+qesc(name)+"' and '"+parent+"' in parents and trashed=false")+'&orderBy=modifiedTime%20desc&fields=files(id,modifiedTime,md5Checksum,appProperties)');return j.files||[];}
async function trashExtras(files,keepId){for(const f of files){if(f.id===(keepId||files[0].id))continue;try{await gfetch(DRIVE+'/files/'+f.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});}catch(e){if(/expired|Sign in/.test(e.message))throw e;}}}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
async function putJSON(name,parent,obj,h){const files=await listFiles(name,parent);const ex=files[0];const b='buf'+Date.now();const meta=ex?{name}:{name,parents:[parent]};if(h)meta.appProperties={h};const txt=JSON.stringify(obj);
 const body='--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(meta)+'\r\n--'+b+'\r\nContent-Type: application/json\r\n\r\n'+txt+'\r\n--'+b+'--';
 const r=await gfetch((ex?UPL+'/files/'+ex.id:UPL+'/files')+'?uploadType=multipart&fields=id,md5Checksum,modifiedTime',{method:ex?'PATCH':'POST',headers:{'Content-Type':'multipart/related; boundary='+b},body});
 if(files.length>1)await trashExtras(files,ex.id);return r;}
/* a damaged / half-written file counts as missing: try older copies, never throw.
   With merge(a,b): every readable duplicate is read and merged (dup:true); the extras are trashed only by the
   next putJSON, after the merged copy is written. Without merge, the newest readable copy is used. */
async function getJSON(name,parent,merge){const files=await listFiles(name,parent);let out=null;
 for(const f of files){try{const t=await gfetch(DRIVE+'/files/'+f.id+'?alt=media');const d=typeof t==='string'?JSON.parse(t):t;if(!d||typeof d!=='object')continue;
   if(!out){out={data:d,file:f,dup:files.length>1,bad:Array.isArray(d)||(merge&&!d.v)};if(!merge||files.length<2)return out;continue;}
   if(Array.isArray(d)||!d.v)continue;if(out.bad){out={data:d,file:f,dup:true,bad:false};continue;}
   try{out.data=merge(out.data,d);}catch(x){console.warn('duplicate merge',x);}}catch(e){if(/expired|Sign in/.test(e.message))throw e;}}
 return out;}
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
 /* measured time when the session kept it (s.ms), else ui6's per-mode seconds per item */
 const secs=typeof UI6_SECS!=='undefined'?UI6_SECS:{};const items=(S.sess||[]).filter(s=>s.d===t).map(s=>({title:(MODES[s.m]||{t:s.m}).t,minutes:Math.max(1,Math.round(+s.ms>0?s.ms/6e4:s.m==='sim'?10:(+s.n||0)*(secs[s.m]||90)/60)),score:s.ok+'/'+s.n}));if(roundDone)items.unshift({title:'The Round',minutes:+S.lastRoundMin>0?Math.max(1,Math.round(+S.lastRoundMin)):25,score:'done'});
 const summary=(roundDone?'Round done today':'Round not started')+'; '+n+'/'+goal+' gases today; '+due+' pattern'+(due===1?'':'s')+' due; mastery '+ms+'%'+(slotT==='tough'?'; night shift, resting.':'.');
 const asks=[];days.forEach(x=>{if(x.date<t)return;const m=SLOT_MIN[x.slot];if(!m)return;if(x.date===t){if(roundDone&&!due)return;asks.push({date:x.date,title:'Buffer: '+nextTitle,minutes:mins,slot:x.slot});}else asks.push({date:x.date,title:'Buffer: the Round',minutes:Math.min(25,m),slot:x.slot});});
 const askToday=asks.filter(a=>a.date===t).reduce((s,a)=>s+a.minutes,0);
 const pending=[];if(due)pending.push(due+' patterns due');if(!roundDone)pending.push('Round not done today');const w=weakestStep();if(w)pending.push('Weak step: '+STEPNAME[w.c]+' ('+Math.round(w.a*100)+'%)');
 return {app:APP_SLUG,title:APP_TITLE,icon:'🧪',color:'#F26A1B',url:location.origin+location.pathname,version:APP_VERSION,device:hubDevName(),updatedAt:new Date().toISOString(),summary,
  sync:(()=>{const h=hubHealth();return {ok:h.ok!==false,at:h.at||null,error:h.ok===false?h.err||null:null,state:!!gcfg().syncState};})(),
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
/* one record seen on two devices: the more recent one (last / t, else more n) gives its fields, the other fills gaps,
   and the running figures take the larger value (n, c, best, last), so no device's best or count is dropped.
   The counts n and c are then made exact by the per-device counters (hubCtr below). */
function pickRec(a,b){if(a==null)return b;if(b==null)return a;if(typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b))return typeof a==='number'&&typeof b==='number'?Math.max(a,b):a;
 const la=+a.last||+a.t||0,lb=+b.last||+b.t||0,na=+a.n||0,nb=+b.n||0;
 const nw=la!==lb?(la>lb?a:b):na!==nb?(na>nb?a:b):(JSON.stringify(a)>=JSON.stringify(b)?a:b),old=nw===a?b:a;
 const o=Object.assign({},old,nw);['n','c','best','last','t'].forEach(k=>{if(typeof a[k]==='number'||typeof b[k]==='number')o[k]=Math.max(+a[k]||0,+b[k]||0);});return o;}
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
 /* a Round is saved with day (ui5); keep today's, the one further along */
 const ra=a.round&&a.round.day===today()?a.round:null,rb=b.round&&b.round.day===today()?b.round:null;o.round=ra&&rb?((+rb.i||0)>(+ra.i||0)?rb:ra):(ra||rb||null);
 return o;}
/* ---- per-device counters (a G-counter): S.ctr[device] = {path: this device's own share}.
   Paths: xp, read, roundsDone, ret|n, dayN|<date>, kinds|<k>|n … Each device only ever raises its own share, the
   merge takes each device's larger share, and a total is the sum of the shares, so work done offline on two
   phones adds up (100 + 50 on A + 30 on B = 180) instead of the larger total winning.
   A save from before 5.0 has no ctr: its totals become a shared '_base' (merged by max, as before). */
const HUB_CTR_TOP=['xp','read','roundsDone'],HUB_CTR_OBJ=['ret','gym','est'],HUB_CTR_MAP={kinds:['n','c'],steps:['n','c'],speed:['n','c'],cases:['n']};
const hubIsO=x=>!!x&&typeof x==='object'&&!Array.isArray(x),hubFin=x=>typeof x==='number'&&isFinite(x)&&x>=0;
function hubCtrRead(s){const t={};if(!hubIsO(s))return t;
 HUB_CTR_TOP.forEach(k=>{if(hubFin(s[k]))t[k]=s[k];});
 HUB_CTR_OBJ.forEach(k=>{const r=s[k];if(hubIsO(r))['n','c'].forEach(f=>{if(hubFin(r[f]))t[k+'|'+f]=r[f];});});
 if(hubIsO(s.dayN)){const cut=addD(today(),-60);for(const d in s.dayN)if(d>=cut&&hubFin(s.dayN[d]))t['dayN|'+d]=s.dayN[d];}
 for(const m in HUB_CTR_MAP){const M=s[m];if(!hubIsO(M))continue;for(const k in M){const r=M[k];if(hubIsO(r))HUB_CTR_MAP[m].forEach(f=>{if(hubFin(r[f]))t[m+'|'+k+'|'+f]=r[f];});}}
 return t;}
/* shape check: up to 12 devices of finite, non-negative numbers; null when there is no usable ctr */
function hubCtrClean(c){if(!hubIsO(c))return null;const o={};Object.keys(c).slice(0,12).forEach(d=>{const v=c[d];if(!hubIsO(v)||d.length>40)return;const r={};let n=0;for(const p in v){if(hubFin(v[p])&&n<3000){r[p]=v[p];n++;}}o[d]=r;});return o;}
/* give this device the part of each total that the other devices' shares do not explain.
   A save without ctr (4.9) is left as it is, unless mk: then its totals become the shared '_base'. */
function hubCtrOwn(s,mk){if(!hubIsO(s))return;const tot=hubCtrRead(s);const c=hubCtrClean(s.ctr);if(!c){if(mk)s.ctr={_base:tot};return;}
 const out={};for(const p in tot){let others=0;for(const d in c)if(d!==hubDev)others+=+c[d][p]||0;const own=tot[p]-others;if(own>0)out[p]=own;}
 c[hubDev]=out;s.ctr=c;}
/* merged shares; a total = sum of shares + the larger unexplained part of either side (unsynced work in another tab).
   A side without ctr (a 4.9 save, or a 4.9 phone that merged by max) is a lower bound, never added on top:
   whatever it has beyond the other side's sum goes into '_base'. */
function hubCtrApply(o,A,B){const ca=hubCtrClean(A&&A.ctr),cb=hubCtrClean(B&&B.ctr),ta=hubCtrRead(A),tb=hubCtrRead(B);let c={};
 const sum=(cc,p)=>{let n=0;for(const d in cc)n+=+cc[d][p]||0;return n;};
 if(ca&&cb)new Set([...Object.keys(ca),...Object.keys(cb)]).forEach(d=>{const x=ca[d]||{},y=cb[d]||{},r={};new Set([...Object.keys(x),...Object.keys(y)]).forEach(p=>{const v=Math.max(+x[p]||0,+y[p]||0);if(v>0)r[p]=v;});c[d]=r;});
 else if(ca||cb)c=JSON.parse(JSON.stringify(ca||cb));
 const add=(p,n)=>{if(n>0){c._base=c._base||{};c._base[p]=(+c._base[p]||0)+n;}};
 new Set([...Object.keys(ta),...Object.keys(tb)]).forEach(p=>{let v;
  if(ca&&cb)v=sum(c,p)+Math.max(0,(ta[p]||0)-sum(ca,p),(tb[p]||0)-sum(cb,p));
  else if(ca||cb){const cx=ca||cb,tx=(ca?ta:tb)[p]||0,tl=(ca?tb:ta)[p]||0;const sx=sum(c,p)+Math.max(0,tx-sum(cx,p));if(tl>sx){add(p,tl-sx);v=tl;}else v=sx;}
  else{v=Math.max(ta[p]||0,tb[p]||0);add(p,v);}
  const seg=p.split('|');
  if(seg.length===1)o[p]=v;
  else if(seg[0]==='dayN'){o.dayN=o.dayN||{};o.dayN[seg[1]]=v;}
  else if(seg.length===2){if(hubIsO(o[seg[0]]))o[seg[0]][seg[1]]=v;}
  else{const M=o[seg[0]];if(hubIsO(M)&&hubIsO(M[seg[1]])){M[seg[1]]=Object.assign({},M[seg[1]]);M[seg[1]][seg[2]]=v;}}});
 /* c never above n: each device's share keeps c <= n, but a record dropped on one side can skew it */
 for(const m in HUB_CTR_MAP){const M=o[m];if(hubIsO(M))for(const k in M){const r=M[k];if(hubIsO(r)&&hubFin(r.c)&&hubFin(r.n)&&r.c>r.n)r.c=r.n;}}
 o.ctr=c;return o;}
const coreOf=o=>{const c=Object.assign({},o);delete c.google;delete c.savedAt;delete c.device;return c;};
const stHash=o=>hash(JSON.stringify(coreOf(o)));
function stateForDrive(){hubCtrOwn(S,true);const o=Object.assign({},S);delete o.google;o.savedAt=new Date().toISOString();o.device=hubDevName();return o;}
/* migrate() (e1) keeps only DEF2 fields; ctr is kept here so that a reload, a restore or a merge never drops it.
   A brand-new state starts with an empty ctr (all its work is this device's); a 4.9 save has none (see hubCtrOf). */
if(typeof migrate==='function'){const _mg=migrate;migrate=function(o){const out=_mg(o);if(!hubIsO(o)){out.ctr={};return out;}const c=hubCtrClean(o.ctr);if(c)out.ctr=c;else delete out.ctr;return out;};}
/* outermost merge step (after ui6's wrapper, which adds gaslog, speed, cases, cmist, qmiss, wk): exact counters */
if(typeof mergeStates==='function'){const _ms22=mergeStates;mergeStates=function(A,B){const o=_ms22(A,B);try{if((+(A&&A.epoch)||0)===(+(B&&B.epoch)||0))hubCtrApply(o,A,B);}catch(e){console.warn('hub ctr merge',e);}return o;};}
function adopt(next,why){try{localStorage.setItem(gk('before_drive'),JSON.stringify(S));localStorage.setItem(gk('before_drive_at'),new Date().toISOString());}catch(e){}const g=S.google;S=migrate(next);S.google=g;S.savedAt=next.savedAt||new Date().toISOString();_save();try{localStorage.setItem(gk('synced_h'),stHash(S));}catch(e){}G.line=why||'Merged with Drive';
 if(typeof ROUND!=='undefined'){try{ROUND=S.round&&S.round.day===today()&&S.round.legs&&S.round.i<S.round.legs.length?S.round:null;}catch(e){}}
 renderHeader();renderRoundBar();if(typeof SS==='undefined'||!SS){if(VIEW&&RENDER[VIEW]&&!SUBVIEWS.includes(VIEW))try{RENDER[VIEW]();}catch(e){}}}
const SUBVIEWS=['session','lesson','tool','scen'];
/* Another device reset or replaced progress everywhere (higher epoch). Take its state, but keep what this device
   did after that moment (rd.ui.wipe, set by ui3 on reset/restore): real gases logged and notebook mistakes made
   after it, and missed questions after it. If the reset kept the gas log, this device's whole log is kept too.
   Returns [state, number of things kept]. */
function hubSince(loc,rd){const o=JSON.parse(JSON.stringify(rd)),wipe=+(rd.ui&&rd.ui.wipe)||0;let n=0;if(!wipe)return [o,0];
 const arr=x=>Array.isArray(x)?x.filter(hubIsO):[],live=x=>!x.del;
 const logKept=arr(rd.gaslog).some(x=>live(x)&&(+x.u||0)<wipe);
 const gl=arr(loc.gaslog).filter(x=>logKept||(+x.u||0)>wipe),cm=arr(loc.cmist).filter(x=>(+x.u||0)>wipe);
 const newIds=a=>{const ids=new Set(arr(o[a]).map(x=>x.id));return x=>!ids.has(x.id);};
 n+=gl.filter(live).filter(newIds('gaslog')).length+cm.filter(live).filter(newIds('cmist')).length;
 if(gl.length)o.gaslog=typeof mergeLog==='function'?mergeLog(o.gaslog,gl):arr(o.gaslog).concat(gl.filter(newIds('gaslog')));
 if(cm.length)o.cmist=typeof mergeLog==='function'?mergeLog(o.cmist,cm,200):arr(o.cmist).concat(cm.filter(newIds('cmist')));
 if(hubIsO(loc.qmiss)){o.qmiss=hubIsO(o.qmiss)?o.qmiss:{};for(const k in loc.qmiss)if((+loc.qmiss[k]||0)>wipe&&!(k in o.qmiss)){o.qmiss[k]=loc.qmiss[k];n++;}}
 /* lessons finished after it (done values that are times; older saves store 1 and cannot be told apart) */
 if(hubIsO(loc.done)){o.done=hubIsO(o.done)?o.done:{};for(const k in loc.done)if((+loc.done[k]||0)>wipe&&!o.done[k]){o.done[k]=loc.done[k];n++;}}
 return [o,n];}
/* a Drive copy that reads as JSON but cannot be merged: keep it beside state.json for a look later */
async function hubKeepDamaged(app,rd){try{await putJSON('state.damaged-'+isoD(new Date())+'.json',app,rd);return true;}catch(e){if(/expired|Sign in/.test(e.message))throw e;return false;}}
const hubMergeDup=(a,b)=>mergeStates(a,b);
async function pullOrPush(opts={}){if(!signedIn()||!gcfg().syncState)return;const {app}=await hubFolder();
 const done=line=>{G.line=line;hubSetHealth(true);};
 for(let round=0;round<3;round++){
  hubCtrOwn(S);const remote=await getJSON('state.json',app,hubMergeDup);const lh=stHash(S);
  const rd=remote&&remote.data;
  if(!rd||!hubIsO(rd)||!rd.v){const body=stateForDrive();await putJSON('state.json',app,body,stHash(body));try{localStorage.setItem(gk('synced_h'),stHash(body));}catch(e){}S.savedAt=body.savedAt;_save();
   done(remote?'Drive had an unreadable copy; replaced it with this device\'s progress':'Progress saved to Drive');return;}
  /* duplicates were merged in reading, so the copy on Drive is not the merged one: always write */
  const rh=remote.dup?'':((remote.file.appProperties&&remote.file.appProperties.h)||stHash(rd));
  if(rh===lh){done('Up to date');return;}   /* 'force' means check now, not rewrite the same file */
  const ea=+S.epoch||0,er=+rd.epoch||0;let merged,why='';
  if(er>ea){const r=hubSince(S,rd);merged=r[0];
   if(typeof ui3KeepUndo==='function')ui3KeepUndo('reset','here');   /* Settings › Your data › Undo brings this device's copy back and merges it */
   why='Progress was reset on another device'+(r[1]?'. Kept '+r[1]+' thing'+(r[1]===1?'':'s')+' you logged here after it':'')+'. Undo is in Settings › Your data.';
   if(typeof toast==='function')toast('Progress was reset on another device. To bring this device\'s progress back: Settings › Your data › Undo.');}
  else if(er<ea)merged=JSON.parse(JSON.stringify(S));   /* this device reset or replaced everywhere: Drive takes it */
  else{try{merged=mergeStates(S,rd);}catch(e){console.warn('merge',e);const kept=await hubKeepDamaged(app,rd);merged=JSON.parse(JSON.stringify(S));
    why='Drive\'s copy could not be merged, so this device\'s progress replaced it'+(kept?' (the old copy is kept as state.damaged-'+isoD(new Date())+'.json)':'')+'.';}}
  const mh=stHash(merged);
  if(mh!==lh)adopt(Object.assign({},merged,{savedAt:new Date().toISOString()}),why||('Merged with '+(rd.device&&!/x86|arm|linux|win32|macintel/i.test(rd.device)?rd.device:'another device')+' at '+hubHM()));
  if(mh!==rh){const body=stateForDrive(),bh=stHash(body);await putJSON('state.json',app,body,bh);
   /* one listing checks that no other phone wrote in between (it carries appProperties.h) */
   const chk=await listFiles('state.json',app);const ch=chk[0]&&chk[0].appProperties&&chk[0].appProperties.h;
   if(chk.length>1||(ch&&ch!==bh))continue;
   S.savedAt=body.savedAt;_save();try{localStorage.setItem(gk('synced_h'),bh);}catch(e){}done(mh!==lh?G.line:'Progress saved to Drive');return;}
  done(mh!==lh?G.line:'Up to date');return;}
 G.line='Another device is writing; Buffer merges on the next sync';setTimeout(()=>syncAll(false),20000);}
async function readPlan(){if(!signedIn())return;try{const root=await folder(HUB_ROOT,null,false);if(!root)return;const hub=await folder(HUB_DIR,root,false);if(!hub)return;let p=null;
 for(const nm of ['citrus','scheduler']){const f=await folder(nm,hub,false);if(f){p=await getJSON('plan.json',f);if(p)break;}}if(!p)return;const t=today();const d=p.data;
 G.planDays=d&&d.days&&typeof d.days==='object'?d.days:{};
 const arr=Array.isArray(d)?d:(d.blocks||d.items||[]);const mine=arr.filter(b=>b&&String(b.app||b.title||'').toLowerCase().includes('buffer')&&(!b.date||b.date===t));
 const rank=b=>b.status==='done'?0:b.status==='accepted'?1:2;mine.sort((x,y)=>rank(x)-rank(y));G.plan=mine[0]||null;}catch(e){if(/expired|Sign in/.test(e.message))throw e;}}
async function syncAll(force){if(!hubCan())return;if(!signedIn()){if(hubExpiry()){hubNudge();renderGoogle();renderCitrusLine();}return;}if(!(gcfg().syncState||gcfg().publish))return;
 if(navigator.onLine===false){G.line='Offline · Buffer syncs when you are back online';G.fail=true;renderGoogle();renderCitrusLine();return;}
 if(G.busy){G.again=G.again||!!force;return;}G.busy=true;clearTimeout(G.retryT);
 try{let ok=true,busy=false;try{await pullOrPush({force});}catch(e){if(/expired|Sign in/.test(e.message))throw e;ok=false;busy=!!e.retry||/connection/.test(e.message);G.line=e.message;hubSetHealth(false,e.message);if(e.retry)G.retryT=setTimeout(()=>syncAll(false),e.retry*1000);G.ver={};}
  if(!busy)await readPlan();if(ok)await writeStatus(force);}   /* status only after this phone has synced; nothing more while Drive is busy */
 catch(e){G.line=e.message;if(/expired|Sign in/.test(e.message)){G.expired=true;}else{hubSetHealth(false,e.message);if(e.retry)G.retryT=setTimeout(()=>syncAll(false),e.retry*1000);}}
 finally{G.busy=false;hubNudge();renderGoogle();renderCitrusLine();if(G.again){G.again=false;setTimeout(()=>syncAll(false),500);}}}
/* hooks */
const _save=save;save=function(){S.savedAt=new Date().toISOString();const ok=_save();if(hubCan()){if(signedIn()){if(!G.busy){clearTimeout(save._t);save._t=setTimeout(()=>syncAll(false),8000);}}else if(hubExpiry()){G.dirty=true;hubNudge();}}return ok;};
document.addEventListener('visibilitychange',()=>{if(!hubCan())return;if(document.hidden){if(signedIn())syncAll(true);}else if(signedIn()){if(Date.now()-lastWrite>6e5)syncAll(false);}else if(hubExpiry()){hubNudge();renderCitrusLine();}});
addEventListener('pagehide',()=>{if(hubCan()&&signedIn()){G.unloading=true;syncAll(true);}});
addEventListener('pageshow',()=>{G.unloading=false;});
addEventListener('online',()=>{if(!hubCan())return;G.fail=false;G.line='';if(signedIn())syncAll(false);else{renderGoogle();renderCitrusLine();}});
addEventListener('offline',()=>{if(!hubCan()||!wasConnected())return;G.line='Offline · Buffer syncs when you are back online';G.fail=true;renderGoogle();renderCitrusLine();});
/* the token lasts an hour and is renewed only by a tap: once it runs out, a slim bar says so (no Google window
   opens in the middle of an answer). Checked every 30 s, on every save and when the app comes back. */
setInterval(()=>{if(hubCan()&&hubExpiry()){hubNudge();if(VIEW==='today')renderCitrusLine();}},30000);
async function hubReconnect(btn){if(btn)btn.disabled=true;G.renewing=true;try{await connectGoogle(true);G.renewing=false;G.dirty=false;await syncAll(true);toast('Reconnected. Drive sync is back on.','good');}
 catch(e){G.renewing=false;G.line=e.message;toast(e.message,'bad');}finally{if(btn)btn.disabled=false;hubNudge();renderGoogle();renderCitrusLine();}}
function hubNudge(){let el=document.getElementById('hubNudge');const show=hubCan()&&hubDead()&&!G.nudgeX&&!!(S.google&&(S.google.syncState||S.google.publish));
 if(!show){if(el)el.remove();return;}
 if(!el){el=document.createElement('div');el.id='hubNudge';el.setAttribute('role','status');document.body.appendChild(el);}
 const nav=document.querySelector('nav.tabs'),fixedNav=nav&&getComputedStyle(nav).position==='fixed'&&nav.offsetHeight;
 el.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc('+((fixedNav||0)+10)+'px + '+(fixedNav?'0px':'env(safe-area-inset-bottom,0px)')+');z-index:30;width:min(560px,calc(100vw - 32px));box-sizing:border-box;display:flex;align-items:center;gap:8px;padding:6px 6px 6px 12px;background:var(--surface,var(--bg));color:var(--ink);border:2px solid var(--accent);box-shadow:var(--shadow,0 4px 14px rgba(0,0,0,.25))';
 const ready=gsiReady();
 el.innerHTML='<span style="flex:1;font-size:13px;line-height:1.3">Drive sync paused: Google sign-in ran out'+(G.dirty?'. New progress is saved here only':'')+'.</span><button class="btn small primary" id="hubNudgeGo" style="min-height:44px"'+(ready?'':' disabled')+'>'+(ready?'Reconnect':'Loading…')+'</button><button class="btn small" id="hubNudgeX" aria-label="Hide until next time" style="min-height:44px;min-width:44px">×</button>';
 $('hubNudgeGo').onclick=e=>hubReconnect(e.currentTarget);$('hubNudgeX').onclick=()=>{G.nudgeX=true;hubNudge();};
 if(!ready)gsi().catch(()=>{});}
/* ---- UI ---- */
/* which copy is open, for the 'Drive cannot sign in here' notes */
function hubWhere(){const h=location.hostname||'',p=location.protocol||'';
 return /claude\.ai$|claudeusercontent\.com$/.test(h)?'the claude.ai copy of Buffer':p==='file:'?'Buffer opened as a file':/^blob:|^data:/.test(location.href)?'a preview copy of Buffer':'this copy of Buffer';}
function hubLast(){const h=hubHealth();return h.at?'Last synced '+(typeof ddmmyyyy==='function'?ddmmyyyy(new Date(h.at)):h.at.slice(0,10))+' '+hubHM(h.at):'';}
function renderCitrusLine(){const el=$('citrus-line');if(!el)return;
 if(!hubCan()){el.innerHTML='<span class="eyebrow">Citrus</span><p class="note">Drive sync and Citrus planning do not work in '+hubWhere()+'. Open the installed app (GitHub Pages) to sync. Here, progress stays in this browser; Settings has a backup you can move across.</p>';return;}
 if(!signedIn()){const was=wasConnected(),ready=gsiReady();el.innerHTML='<span class="eyebrow">Citrus & Drive</span><p class="note">'+(was?'Drive sync is paused: Google sign-in ran out. Tap Reconnect.':'Not connected yet. One tap connects Google and Citrus.')+(G.line&&was&&!/expired/.test(G.line)?' <span class="muted">'+esc(G.line)+'</span>':'')+'</p><div class="btnrow"><button class="btn small primary" id="clConnect"'+(ready?'':' disabled')+'>'+(ready?(was?'Reconnect Google':'Connect Google'):'Loading Google…')+'</button></div>';
  if(!ready)gsi().catch(()=>{});
  $('clConnect').onclick=async e=>{if(was){hubReconnect(e.currentTarget);return;}try{G.renewing=true;await connectGoogle(false);G.renewing=false;await syncAll(true);toast('Connected. Progress now lives on your Drive.','good');}catch(x){G.renewing=false;toast(x.message,'bad');}};return;}
 const t=today(),sh=shiftOf(t),slot=slotFor(t);
 const shiftTxt=sh?'<b>'+esc(String(sh.label||sh.code||'Shift'))+'</b>'+(sh.start?' '+esc(String(sh.start))+'–'+esc(String(sh.end||'')):'')+(slot==='tough'?' · Buffer rests today':slot==='postnight'?' · light day after a night':slot==='early'?' · early start, kept short':slot==='before'?' · night tonight, so a short Round':'')+'. '
  :slot==='postnight'?'After last night\'s shift · kept light ('+SLOT_MIN.postnight+' min). ':slot==='before'?'Night tonight · short Round ('+SLOT_MIN.before+' min). ':'';
 const p=G.plan&&G.plan.status!=='none'?G.plan:null,pm=p&&(+p.minutes||+p.min||0),pt=p&&(p.start||p.time);
 const planTxt=p?'Citrus '+(p.status==='done'?'logged':p.status==='accepted'?'planned':'suggests')+' <b>'+esc(String(pt||'today'))+(pm?' · '+pm+' min':'')+'</b>'+(p.title?' · '+esc(String(p.title)):'')+'.':'No block from Citrus yet today.';
 el.innerHTML='<span class="eyebrow">Citrus</span><p>'+shiftTxt+planTxt+' <span class="muted">'+esc(G.line||'')+'</span></p>';}
function renderGoogle(){const r=$('google-root');if(!r)return;const g=gcfg(),ok=signedIn(),can=hubCan(),was=wasConnected(),ready=gsiReady(),last=hubLast();
 const warn=ok&&(G.fail||navigator.onLine===false);
 const status=!can?'<p class="note">Google cannot sign in to '+hubWhere()+'. Open the installed app (GitHub Pages) to sync to Drive and talk to Citrus. Move progress with the backup below.</p>'
  :ok?'<div class="g-status'+(warn?'':' on')+'"'+(warn?' style="border-color:#E0A100"':'')+'><span class="g-dot"'+(warn?' style="background:#E0A100"':'')+'></span><div><b>'+(warn?(navigator.onLine===false?'Offline':'Connected · last sync failed'):'Connected')+(G.email?' · '+esc(G.email):'')+'</b><small>'+esc(G.line||'Progress lives on your Drive. Citrus can see today\'s plan.')+(last?' · '+esc(last):'')+'</small></div></div>'
  :'<div class="g-status"><span class="g-dot"></span><div><b>'+(was?'Drive sync paused':'Not connected')+'</b><small>'+(was?'Google sign-in ran out (it lasts an hour). Tap Reconnect. ':'One tap connects the Citrus family. ')+esc(G.line&&!/expired/.test(G.line)?G.line:'')+(was&&last?' '+esc(last)+'.':'')+'</small></div></div>';
 const btn=(id,cls,txt)=>'<button class="btn'+cls+'" id="'+id+'"'+(can&&ready?'':' disabled')+'>'+(can&&!ready?'Loading Google…':txt)+'</button>';
 const main=ok?'<button class="btn primary" id="gSync">Sync now</button><button class="btn" id="gOut">Sign out</button>':btn('gConnect',' primary',was?'Reconnect':'Connect Google');
 const sub=g.syncState?'My Apps/hub/buffer/state.json · devices merge; only Reset everywhere or Replace everywhere overwrites':'Off on this device: progress stays here. Switching it on merges Drive\'s progress back in at the next sync.';
 r.innerHTML='<div class="card set" style="display:flex;flex-direction:column;gap:12px"><span class="eyebrow">Google & Citrus</span>'+status+
  '<div class="btnrow">'+main+'</div>'+
  (can?'<details class="adv"><summary>Advanced</summary><div style="display:grid;gap:8px;margin-top:10px"><label class="srow"><div><b>Keep progress on Drive</b><span>'+sub+'</span></div><input type="checkbox" id="gState"'+(g.syncState?' checked':'')+'></label><label class="srow"><div><b>Publish status for Citrus</b><span>My Apps/hub/buffer/status.json</span></div><input type="checkbox" id="gPub"'+(g.publish?' checked':'')+'></label>'+
   '<div class="ctrl"><label for="gDev"><span>This device\'s name (in merge messages and for Citrus)</span></label><input id="gDev" maxlength="30" value="'+esc(hubDevName())+'" autocomplete="off"></div>'+
   '<div class="ctrl"><label for="gCid"><span>Citrus web client ID</span></label><input id="gCid" value="'+esc(g.clientId||'')+'" autocomplete="off"></div>'+(ok?'<div class="btnrow">'+btn('gConnect','','Reconnect Google')+'</div>':'')+
   '<p class="note">This app\'s origin: <code>'+esc(location.origin)+'</code> <button class="btn small" id="gOrigin">Copy</button> · it must be in the client\'s authorised JavaScript origins · '+(matchMedia('(display-mode: standalone)').matches?'installed app':'browser tab')+'</p></div></details>':'')+'</div>';
 if(can&&!ready)gsi().catch(()=>{});
 const ci=$('gCid');if(ci)ci.onchange=e=>{gcfg().clientId=e.target.value.trim()||SHARED_CID;_save();};
 const dv=$('gDev');if(dv)dv.onchange=e=>{gcfg().deviceName=e.target.value.trim().slice(0,30);_save();};
 if($('gOrigin'))$('gOrigin').onclick=e=>copyText(location.origin,e.currentTarget);
 if($('gState'))$('gState').onchange=e=>{const on=e.target.checked;gcfg().syncState=on;_save();
  if(on){G.line='Sync is on again: progress on Drive merges back in now.';toast('Drive sync on. Progress on Drive merges back in at this sync.');if(signedIn())syncAll(true);}else G.line='Drive sync of progress is off on this device.';renderGoogle();};
 if($('gPub'))$('gPub').onchange=e=>{gcfg().publish=e.target.checked;_save();};
 if($('gConnect'))$('gConnect').onclick=async()=>{const id=gcfg().clientId;if(!/apps\.googleusercontent\.com$/.test(id)){G.line='That does not look like a client ID.';renderGoogle();return;}
  try{G.line='Opening Google…';G.renewing=true;const p=connectGoogle(was&&!ok);await p;G.renewing=false;G.line='Connected';G.dirty=false;await syncAll(true);}catch(e){G.renewing=false;G.line=e.message;renderGoogle();}};
 if($('gSync'))$('gSync').onclick=()=>{G.line='Syncing…';renderGoogle();syncAll(true);};if($('gOut'))$('gOut').onclick=signOut;}
function hubBoot(){if(!hubCan())return;gsi().catch(()=>{});if(signedIn()){syncAll(false);return;}if(wasConnected()){G.expired=true;G.line='';hubNudge();}}
