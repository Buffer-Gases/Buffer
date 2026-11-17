# T25 sabotage scenarios for Buffer 4.9.0 Drive sync (extends twophones.py fake Drive)
import asyncio,json,re,hashlib,itertools,subprocess,sys,time,datetime
from urllib.parse import urlparse,parse_qs
from playwright.async_api import async_playwright
PORT=8962
# usage (from the buffer folder, after python3 build.py): python3 tests/drive/sabotage.py   [SHOTS=<dir> for screenshots]
# The fake Drive serves the built buffer.html from the buffer folder. Results go to $TMPDIR/buffer-drive-results.json.
import os,tempfile
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SHOTS=os.environ.get('SHOTS') or tempfile.mkdtemp(prefix='buffer-shots-')
srv=subprocess.Popen(['python3','-m','http.server',str(PORT),'--bind','127.0.0.1'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
URL=f'http://localhost:{PORT}/buffer.html'
FILES={};ctr=itertools.count(1);FAIL=[];CALLS={}
M={'expire':set(),'offline':set(),'r429':0,'r429_always':False,'expire_after':None,'retry_after_seen':[],'n':0,'t429':[]}
def reset_drive():
    FILES.clear();M['expire'].clear();M['offline'].clear();M['r429']=0;M['r429_always']=False;M['expire_after']=None;M['n']=0;CALLS.clear()
def mk(name,parents,mime='application/json',content=None,props=None):
    i=f'f{next(ctr)}';t=next(ctr)
    FILES[i]=dict(id=i,name=name,parents=parents,mime=mime,content=content,props=props or {},mod=t,created=t,trashed=False)
    return FILES[i]
def md5(f):return hashlib.md5((f['content'] or '').encode()).hexdigest()
def meta(f):return {'id':f['id'],'modifiedTime':'%012d'%f['mod'],'trashed':f['trashed'],'md5Checksum':md5(f),'appProperties':f['props'],'name':f['name'],'createdTime':'%012d'%f['created'],'parents':f['parents']}
STUB="""window.__tok=0;window.google={accounts:{oauth2:{initTokenClient:function(c){return {requestAccessToken:function(o){window.__tok++;window.__lastPrompt=o&&o.prompt;setTimeout(function(){c.callback({access_token:'TOK'+window.__tok+'_'+Math.random().toString(36).slice(2,6),expires_in:3600});},10);}}}}}};"""
def mkdrive(tag):
    async def drive(route,request):
        u=urlparse(request.url);q=parse_qs(u.query);m=request.method;p=u.path
        h=request.headers.get('authorization','')
        async def J(o,s=200):return await route.fulfill(status=s,content_type='application/json',body=json.dumps(o))
        if tag in M['offline']:return await route.abort('internetdisconnected')
        if p.endswith('/userinfo'):return await J({'email':'x@y.z'})
        if h in M['expire']:return await route.fulfill(status=401,body='{"error":"invalid_token"}')
        M['n']+=1;CALLS[tag]=CALLS.get(tag,0)+1
        if M['expire_after'] is not None:
            M['expire_after']-=1
            if M['expire_after']<0:M['expire'].add(h);M['expire_after']=None;return await route.fulfill(status=401,body='{}')
        if M['r429']>0 or M['r429_always']:
            M['r429']-=1;M['t429'].append(time.time())
            return await route.fulfill(status=429,headers={'Retry-After':'5'},content_type='application/json',body=json.dumps({'error':{'code':429,'message':'Rate Limit Exceeded','errors':[{'reason':'rateLimitExceeded'}]}}))
        if p=='/drive/v3/files' and m=='GET':
            qq=q.get('q',[''])[0];name=re.search(r"name='((?:[^'\\]|\\.)*)'",qq);par=re.search(r"'([^']+)' in parents",qq)
            res=[f for f in FILES.values() if not f['trashed']]
            if name:res=[f for f in res if f['name']==name.group(1).replace("\\'","'")]
            if par:res=[f for f in res if par.group(1) in f['parents']]
            if 'folder' in qq:res=[f for f in res if f['mime']=='application/vnd.google-apps.folder']
            tg=re.search(r"appProperties has \{ key='([^']+)' and value='([^']+)' \}",qq)
            if tg:res=[f for f in res if (f['props'] or {}).get(tg.group(1))==tg.group(2)]
            ob=q.get('orderBy',[''])[0]
            res.sort(key=lambda f:-f['mod'] if 'modified' in ob else f['created'])
            return await J({'files':[meta(f) for f in res]})
        if p=='/drive/v3/files' and m=='POST':
            b=json.loads(request.post_data_buffer.decode('utf-8'));f=mk(b['name'],b.get('parents',['root']),b.get('mimeType','application/json'));return await J(meta(f))
        mm=re.match(r'/drive/v3/files/(\w+)$',p)
        if mm:
            f=FILES.get(mm.group(1))
            if not f:return await route.fulfill(status=404,body='nf')
            if m=='GET':
                if q.get('alt')==['media']:return await route.fulfill(status=200,content_type='application/json',body=f['content'] or '')
                return await J(meta(f))
            if m=='PATCH':
                b=json.loads(request.post_data or '{}');f['trashed']=b.get('trashed',f['trashed'])
                if 'appProperties' in b:f['props']=dict(f['props'] or {},**b['appProperties'])
                if 'name' in b:f['name']=b['name']
                ap=q.get('addParents',[''])[0];rp=q.get('removeParents',[''])[0]
                if rp:f['parents']=[x for x in f['parents'] if x not in rp.split(',')]
                if ap:f['parents']=f['parents']+[x for x in ap.split(',') if x not in f['parents']]
                return await J(meta(f))
        um=re.match(r'/upload/drive/v3/files(?:/(\w+))?$',p)
        if um:
            body=request.post_data_buffer.decode('utf-8');bd=re.search(r'boundary=(\S+)',request.headers['content-type']).group(1)
            parts=body.split('--'+bd);md=json.loads(parts[1].split('\r\n\r\n',1)[1].strip());ct=parts[2].split('\r\n\r\n',1)[1].rsplit('\r\n',1)[0]
            f=FILES[um.group(1)] if um.group(1) else mk(md['name'],md['parents'])
            f['content']=ct;f['mod']=next(ctr)
            if 'appProperties' in md:f['props']=dict(f['props'] or {},**md['appProperties'])
            return await J(meta(f))
        return await route.fulfill(status=404,body='?')
    return drive
RES=[]
def check(name,ok,info=''):
    print(('PASS ' if ok else 'FAIL ')+name+('  ->  '+str(info) if (not ok or info) else ''),flush=True)
    RES.append((name,ok,str(info)))
    if not ok:FAIL.append(name)
def note(name,info):print('NOTE '+name+': '+str(info),flush=True)
async def phone(b,errs,tag,vp=(390,844),q=''):
    ctx=await b.new_context(viewport={'width':vp[0],'height':vp[1]})
    async def gis(r,_):await r.fulfill(status=200,content_type='text/javascript',body=STUB)
    await ctx.route('https://accounts.google.com/gsi/client',gis)
    await ctx.route('https://www.googleapis.com/**',mkdrive(tag))
    pg=await ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(f'{tag} pageerror {e}'))
    pg.on('console',lambda m:errs.append(f'{tag} console.{m.type} {m.text}') if m.type=='error' and 'TUNNEL' not in m.text else None)
    await pg.goto(URL+q);await pg.wait_for_timeout(600);return ctx,pg
def live(name):return [f for f in FILES.values() if f['name']==name and not f['trashed']]
def path_of(f):
    out=[f['name']];cur=f
    while cur['parents'] and cur['parents'][0] in FILES:
        cur=FILES[cur['parents'][0]];out.append(cur['name'])
    return '/'.join(reversed(out))
async def connect(pg):
    await pg.evaluate("go('settings')")
    if await pg.evaluate("signedIn()"):await pg.evaluate("localStorage.setItem('buffer_connected','1');syncAll(true)")
    else:await pg.click('#gConnect')
    await pg.wait_for_timeout(1800)
async def sync(pg,force=True,wait=1600):
    await pg.evaluate(f"syncAll({'true' if force else 'false'})");await pg.wait_for_timeout(wait)
async def idle(pg):
    for _ in range(60):
        if not await pg.evaluate("G.busy"):return
        await pg.wait_for_timeout(250)

SEED="""(()=>{const n=Date.now();S.xp=100;S.read=20;S.done={'l-x':1};S.days=['2026-11-01'];
S.speed={pflash:{n:10,c:8,best:80,lvl:2,last:n-1e6}};S.cases={'ch-dka':{res:'clean run',d:'01/11/2026',n:1,last:n-1e6}};
S.gaslog=[{id:'g1',t:'2026-11-10T08:00:00.000Z',u:n-5e6,sample:'a',v:{pH:7.2,pco2:30},label:'G1',line:'g1',note:'bed 1',tag:'Bed 1'},
 {id:'g2',t:'2026-11-10T09:00:00.000Z',u:n-4e6,sample:'a',v:{pH:7.3,pco2:32},label:'G2',line:'g2',note:'',tag:'Bed 1'}];
S.cmist=[{id:'m1',key:'ch-dka:1:0',cid:'ch-dka',ct:'DKA',q:'Q1',a:'x',r:'y',d:'10/11/2026',u:n-5e6},
 {id:'m2',key:'ch-dka:2:0',cid:'ch-dka',ct:'DKA',q:'Q2',a:'x',r:'y',d:'10/11/2026',u:n-4e6}];S.qmiss={};save();})()"""

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        # ============ 1. two phones offline: gas log + notebook + counters ============
        reset_drive()
        ctxA,A=await phone(b,errs,'A');ctxB,B=await phone(b,errs,'B')
        await A.evaluate(SEED);await connect(A);await connect(B);await sync(A)
        cA=await A.evaluate("coreOf(S)");cB=await B.evaluate("coreOf(S)")
        check('S1 seed converged',json.dumps(cA,sort_keys=True)==json.dumps(cB,sort_keys=True))
        M['offline'].update({'A','B'})
        # A offline: add a gas, delete g1, earn xp, 10 more drills, set why on m2 (later)
        await A.evaluate("""(()=>{const o=interp({sample:'a',pH:7.1,pco2:20,hco3:6,na:140,cl:100});logAdd({sample:'a',pH:7.1,pco2:20,hco3:6,na:140,cl:100},o,'A note','Bed 2');logDel('g1');
          S.xp+=50;S.speed.pflash.n+=10;S.speed.pflash.c+=10;S.speed.pflash.best=100;S.speed.pflash.last=Date.now()-1000;S.cases['ch-dka'].n=2;S.cases['ch-dka'].best=1;S.cases['ch-dka'].last=Date.now();save();})()""")
        await A.wait_for_timeout(50)
        # B offline: add a gas, remove m1 in notebook, set why on m2, earn xp, 5 drills
        await B.evaluate("""(()=>{const o=interp({sample:'v',pH:7.25,pco2:50});logAdd({sample:'v',pH:7.25,pco2:50},o,'B note','Bed 3');
          const x=S.cmist.find(y=>y.id==='m1');x.del=true;x.u=Date.now();const z=S.cmist.find(y=>y.id==='m2');z.why='rule';z.u=Date.now();
          S.cmist.push({id:'m3',key:'ch-x:1:0',cid:'ch-x',ct:'X',q:'Q3',a:'x',r:'y',d:'13/11/2026',u:Date.now()});
          S.xp+=30;S.speed.pflash.n+=5;S.speed.pflash.c+=1;S.speed.pflash.lvl=4;S.speed.pflash.last=Date.now();S.cases['ch-dka'].n=3;S.cases['ch-dka'].res='2 wrong turns';S.cases['ch-dka'].last=Date.now();save();})()""")
        await A.wait_for_timeout(60)
        await A.evaluate("(()=>{const z=S.cmist.find(y=>y.id==='m2');z.why='arith';z.u=Date.now();save();})()")
        # syncing while offline
        await sync(A,wait=7000);lineOff=await A.evaluate("G.line")
        note('S1 line while offline',lineOff)
        M['offline'].clear()
        await sync(A);await sync(B);await sync(A)
        cA=await A.evaluate("coreOf(S)");cB=await B.evaluate("coreOf(S)")
        check('S1 phones identical after offline edits',json.dumps(cA,sort_keys=True)==json.dumps(cB,sort_keys=True))
        live_ids=sorted(x['id'] for x in cA['gaslog'] if not x.get('del'))
        check('S1 gas log: both new gases kept, g1 deleted',len(live_ids)==3 and 'g1' not in live_ids and 'g2' in live_ids,live_ids)
        g1=[x for x in cA['gaslog'] if x['id']=='g1']
        check('S1 g1 tombstone strips note/tag (privacy)',g1 and 'note' not in g1[0] and 'tag' not in g1[0],g1)
        cm={x['id']:x for x in cA['cmist']}
        check('S1 notebook: m1 removed on B stays removed',cm['m1'].get('del') is True,cm['m1'])
        check('S1 notebook: m3 from B kept',('m3' in cm) and not cm['m3'].get('del'))
        check('S1 notebook: later why edit (A, arith) wins',cm['m2'].get('why')=='arith',cm['m2'].get('why'))
        check('S1 m1 tombstone still carries question text',('q' in cm['m1']),'tombstone keeps q/a/r' if 'q' in cm['m1'] else '')
        order=[x['id'] for x in cA['cmist']];note('S1 merged cmist order (A then B, not by time)',order)
        check('S1 xp: offline gains of both phones kept (100+50+30=180)',cA['xp']==180,cA['xp'])
        sp=cA['speed']['pflash'];check('S1 speed: 25 drills total, best 100, lvl 4',sp['n']==25 and sp.get('best')==100 and sp.get('lvl')==4,sp)
        cs=cA['cases']['ch-dka'];check('S1 case record keeps best=1 from A',cs.get('best')==1,cs)
        check('S1 one state.json',len(live('state.json'))==1,len(live('state.json')))
        # Gas log UI on B shows A's entry
        await B.evaluate("openTool('log')");await B.wait_for_timeout(300)
        txt=await B.inner_text('#v-tool')
        check('S1 B gas log shows A note',('A note' in txt) and ('bed 1' not in txt),txt[:200])
        await B.screenshot(path=SHOTS+'/T25-log-after-merge.png',full_page=False)
        # ============ 2. calls per sync ============
        CALLS.clear();await sync(A,force=False,wait=1500);n_nf=CALLS.get('A',0)
        CALLS.clear();await sync(A,force=True,wait=2500);n_f=CALLS.get('A',0)
        note('S2 Drive calls per sync (no change / forced)',(n_nf,n_f))
        sz=len(live('state.json')[0]['content']);note('S2 state.json bytes',sz)
        # ============ 3. reset on one phone; offline work on the other ============
        M['offline'].add('A')
        await B.evaluate("go('settings')");await B.wait_for_timeout(200)
        rtext=await B.evaluate("document.getElementById('resetBtn').closest('.srow').innerText")
        note('S3 reset row text',rtext)
        await B.evaluate("ui3KeepUndo('reset','all');ui3Reset('all',false)");await B.wait_for_timeout(2500)
        await sync(B);await A.wait_for_timeout(50)
        await A.evaluate("(()=>{S.done['l-after']=Date.now();S.xp+=7;const o=interp({sample:'a',pH:7.4,pco2:40});logAdd({sample:'a',pH:7.4,pco2:40},o,'after reset elsewhere','Bed 9');})()")
        M['offline'].discard('A');await sync(A)
        xa=await A.evaluate("[S.epoch,S.xp,Object.keys(S.done),logList().length,G.line]")
        # 5.0: Reset keeps the gas log, so the log holds the earlier entries plus the one logged after the reset
        la=await A.evaluate("logList().some(e=>e.tag==='Bed 9')")
        check('S3 work done on A AFTER the reset on B survives',('l-after' in xa[2]) and la,xa)
        bd=await A.evaluate("!!localStorage.getItem('buffer_before_drive')")
        await A.evaluate("go('settings')");await A.wait_for_timeout(300);ui_restore=await A.evaluate("!!document.getElementById('bkUndo')")
        note('S3 before_drive backup kept / any UI to restore it',(bd,ui_restore))
        # ============ 3b. restore an old backup after a reset ============
        reset_drive()
        ctxC,C=await phone(b,errs,'C')
        await C.evaluate(SEED);bk=await C.evaluate("JSON.stringify({buffer_backup:1,saved:ddmmyyyy(),state:Object.assign({},S,{google:undefined})})")
        await connect(C)
        await C.evaluate("ui3Reset('all',false)");await C.wait_for_timeout(2500);await sync(C)
        await C.evaluate("bk=>{const r=ui3ReadBackup(bk);ui3Apply(r.st,'here');}",bk);await C.wait_for_timeout(3000)
        before=await C.evaluate("[S.epoch,S.xp]")
        await sync(C)
        after=await C.evaluate("[S.epoch,S.xp,G.line]")
        check('S3b restoring a pre-reset backup survives the next sync',after[1]==100,{'after restore':before,'after sync':after})
        await ctxC.close()
        # ============ 4. corrupted state.json: parseable but wrong types ============
        reset_drive()
        await A.evaluate("localStorage.clear();G.ids={};gSave()");await A.reload();await A.wait_for_timeout(600);await A.evaluate(SEED);await connect(A)
        sf=live('state.json')[0];good=json.loads(sf['content'])
        bad=dict(good);bad['gaslog']={'oops':1};bad['days']='2026-11-12';bad['epoch']=good.get('epoch',0)
        sf['content']=json.dumps(bad);sf['props']={'h':'deadbeef'};sf['mod']=next(ctr)
        await sync(A);r=await A.evaluate("[G.line,S.days.length,S.days.slice(-3)]")
        check('S4 wrong-typed state.json does not break sync',not re.search(r'iterable|TypeError|undefined',r[0]),r)
        # truncated + older good duplicate
        sf['content']='{"v":4,"xp":';sf['props']={};sf['mod']=next(ctr)
        old=mk('state.json',sf['parents'],content=json.dumps(dict(good,xp=999)),props={'h':'aaaa'});old['mod']=sf['mod']-3
        await sync(A);r=await A.evaluate("[S.xp,G.line]")
        check('S4 damaged newest + good older copy: older copy merged (xp 999)',r[0]==999,r)
        check('S4 one live state.json afterwards',len(live('state.json'))==1,len(live('state.json')))
        # state.json = JSON array / null
        live('state.json')[0]['content']='[]';await sync(A);note('S4 state.json [] ->',await A.evaluate("G.line"))
        # ============ 5. duplicated status.json ============
        app=[f for f in FILES.values() if f['name']=='buffer' and f['mime'].endswith('folder')][0]
        for i in range(2):mk('status.json',[app['id']],content='{"app":"buffer","stale":%d}'%i)
        await A.evaluate("S.xp+=1;save()");await sync(A)
        st=live('status.json');check('S5 duplicated status.json collapsed to one',len(st)==1,len(st))
        st=json.loads(st[0]['content']) if st else {}
        check('S5 surviving status.json is fresh',('stale' not in st) and st.get('app')=='buffer',list(st)[:5])
        check('S5 status path',path_of(live('status.json')[0])=='My Apps/hub/buffer/status.json',path_of(live('status.json')[0]))
        # contract check
        req=['app','title','icon','color','url','updatedAt','summary','today','next','asks','pending','contract','metrics','progress','inbox','actions']
        miss=[k for k in req if k not in st];check('S5 contract v2 fields present',not miss,'missing '+str(miss))
        check('S5 today{date,done}',isinstance(st.get('today'),dict) and 'date' in st['today'] and 'done' in st['today'])
        bad_m=[m for m in st.get('metrics',[]) if not all(k in m for k in ['key','label','value','goal','unit','date'])]
        check('S5 every metric has key,label,value,goal,unit,date',not bad_m,bad_m)
        bad_a=[a for a in st.get('actions',[]) if not all(k in a for k in ['id','label','url','icon','minutes'])]
        check('S5 every action has id,label,url,icon,minutes',not bad_a,bad_a)
        check('S5 action urls carry ?from=citrus&do=',all('?from=citrus&do=' in a['url'] for a in st.get('actions',[])))
        note('S5 inbox',st.get('inbox'));note('S5 asks slots',sorted({a['slot'] for a in st.get('asks',[])}))
        note('S5 summary',st.get('summary'));note('S5 pending',st.get('pending'))
        # ============ 6. expired token mid-sync ============
        await A.evaluate("S.xp+=5;save()")
        M['expire_after']=4
        await sync(A,wait=2500);await idle(A)
        r=await A.evaluate("[signedIn(),G.expired,G.line,wasConnected()]")
        check('S6 401 mid-sync -> flagged expired, not signed in',r[0] is False and r[1] is True,r)
        check('S6 state.json still parseable after interrupted sync',all(json.loads(f['content']) for f in live('state.json')))
        cl=await A.evaluate("document.getElementById('citrus-line')?document.getElementById('citrus-line').innerText:''");note('S6 citrus line',cl)
        n0=await A.evaluate("window.__tok")
        await A.evaluate("go('learn')");await A.wait_for_timeout(200)
        nud=await A.evaluate("!!document.getElementById('hubNudge')");check('S6 nudge bar shown after 401',nud)
        await A.click('nav button');await A.wait_for_timeout(400);check('S6 a random tap opens no Google window',await A.evaluate("window.__tok")==n0)
        await A.click('#hubNudgeGo');await A.wait_for_timeout(1800)
        r=await A.evaluate("[signedIn(),window.__tok,window.__lastPrompt,G.line]")
        check('S6 nudge Reconnect renews (prompt "") and sync completes',r[0] and r[1]==n0+1 and r[2]=='',r)
        # time-based expiry with the app left open
        await A.evaluate("G.exp=Date.now()-1000")
        n1=await A.evaluate("window.__tok")
        await A.evaluate("S.xp+=1;save()");await A.wait_for_timeout(300)
        r0=await A.evaluate("[G.expired,!!document.getElementById('hubNudge'),document.getElementById('hubNudge')&&document.getElementById('hubNudge').innerText]")
        check('S6b timed expiry: flagged and nudge shown at once (save)',r0[0] and r0[1],r0)
        await A.screenshot(path=SHOTS+'/D22-nudge-phone.png')
        await A.click('#hubNudgeGo');await A.wait_for_timeout(1500)
        r=await A.evaluate("[signedIn(),window.__tok,G.expired,G.line,!!document.getElementById('hubNudge')]")
        check('S6b nudge renews the token, bar goes',r[1]==n1+1 and r[0] and not r[4],r)
        cl=await A.evaluate("go('today');document.getElementById('citrus-line')?document.getElementById('citrus-line').innerText:''");note('S6b citrus line after timed expiry',cl)
        # renew via button so later scenarios work
        if not await A.evaluate("signedIn()"):await connect(A)
        # ============ 7. rate limiting ============
        M['r429']=2;t0=time.time();await A.evaluate("S.xp+=1;save()");await sync(A,wait=200);await idle(A);dt=time.time()-t0
        r=await A.evaluate("[G.line]");check('S7 two 429s then success',not r[0].startswith('Drive 429'),(r,round(dt,1)))
        M['r429_always']=True;M['t429']=[];t0=time.time();await sync(A,wait=200);await idle(A);dt=time.time()-t0;M['r429_always']=False
        r=await A.evaluate("G.line");gaps=[round(M['t429'][i+1]-M['t429'][i],1) for i in range(len(M['t429'])-1)]
        note('S7 persistent 429: line / retries gaps / seconds',(r,gaps,round(dt,1)))
        check('S7 persistent 429 message is plain English (no raw JSON)',not re.search(r'[{"]',r),r)
        await A.evaluate("go('settings')");await A.wait_for_timeout(200);await A.screenshot(path=SHOTS+'/T25-settings-429.png')
        # ============ 8. Yuzu folders missing ============
        # 5.0: the send button is disabled once nothing new is left to send (ui9); a disabled button counts as "not sent again"
        async def yzc(pg):
            b=pg.locator('#wkYuzu')
            if await b.count() and await b.is_enabled():await b.click();return True
            note('S8 send button disabled (nothing new to send)',await b.inner_text() if await b.count() else 'absent');return False
        await A.evaluate("S.qmiss={};const k=Object.keys(LBYID)[0];S.qmiss[k+':0']=Date.now();save()")
        await A.evaluate("go('progress')");await A.wait_for_timeout(300)
        await yzc(A);await A.wait_for_timeout(1500);m1=await A.inner_text('#wkYuzuMsg')
        check('S8 no Yuzu folder: message says Yuzu folder is missing',re.search(r'Yuzu.*(not found|missing|set up|open Yuzu)',m1,re.I) is not None,m1)
        root=[f for f in FILES.values() if f['name']=='My Apps'][0]
        yz=mk('Yuzu',[root['id']],'application/vnd.google-apps.folder')
        await yzc(A);await A.wait_for_timeout(1500);m2=await A.inner_text('#wkYuzuMsg')
        note('S8 Yuzu without collection -> msg',m2)
        col=mk('collection',[yz['id']],'application/vnd.google-apps.folder')
        await yzc(A);await A.wait_for_timeout(1500);m3=await A.inner_text('#wkYuzuMsg')
        pk=[f for f in FILES.values() if f['name'].startswith('buffer-misses-')]
        check('S8 with collection: inbox created and pack written',pk and path_of(pk[0]).startswith('My Apps/Yuzu/collection/inbox/'),(m3,[path_of(f) for f in pk]))
        pkd=json.loads(pk[0]['content']) if pk else {}
        note('S8 pack card sample',json.dumps(pkd.get('cards',[{}])[0])[:600])
        html_in=[c for c in pkd.get('cards',[]) if re.search(r'<[a-z/]|&[a-z]+;',json.dumps(c))]
        check('S8 pack cards have no leftover HTML tags/entities',not html_in,len(html_in))
        await yzc(A);await A.wait_for_timeout(1500)
        check('S8 sending twice same week: one file',len([f for f in FILES.values() if f['name'].startswith('buffer-misses-') and not f['trashed']])==1)
        # glossary with Yuzu present
        await A.evaluate("go('gloss')");await A.wait_for_timeout(200);await A.click('#glYz');await A.wait_for_timeout(1500)
        w=live('buffer-words.json');check('S8 glossary words file path',w and path_of(w[0])=='My Apps/Yuzu/collection/inbox/buffer-words.json',[path_of(f) for f in w])
        if w:
            wd=json.loads(w[0]['content']);note('S8 words card sample',wd['cards'][0]);ids=[c['id'] for c in wd['cards']]
            check('S8 glossary card ids unique',len(ids)==len(set(ids)),[i for i in ids if ids.count(i)>1])
        # status inbox after sending (does the Yuzu nag go away?)
        await A.evaluate("for(let i=0;i<6;i++){S.qmiss[Object.keys(LBYID)[i%3]+':'+i]=Date.now();}save()")
        st=await A.evaluate("hubStatus()");note('S8 inbox with >=5 misses',st.get('inbox'))
        await A.evaluate("go('progress')");await A.wait_for_timeout(300);await yzc(A);await A.wait_for_timeout(1500)
        st2=await A.evaluate("hubStatus()");check('S8 Yuzu inbox proposal cleared after sending this week',not [i for i in st2['inbox'] if i['id'].startswith('buffer-yuzu-')],st2['inbox'])
        # ============ 9. hand-off ============
        await A.evaluate("openTool('interp');loadInterp({sample:'a',pH:7.32,pco2:30,po2:60,fio2:40,hco3:15,na:138,cl:104});buildForm();runInterp()");await A.wait_for_timeout(400)
        await A.click('#iHand');await A.wait_for_timeout(1500)
        ho=[f for f in FILES.values() if f['name'].startswith('buffer-gas-')]
        check('S9 hand-off path My Apps/hub/handoff/',ho and path_of(ho[-1]).startswith('My Apps/hub/handoff/buffer-gas-'),[path_of(f) for f in ho])
        if ho:
            hd=json.loads(ho[-1]['content']);note('S9 hand-off full',json.dumps(hd)[:900])
            check('S9 hand-off FiO2 typed as 40 normalised to 0.40',hd['gas'].get('fio2')==0.4,hd['gas'].get('fio2'))
        print('ERRS',errs[:10])
        await ctxA.close();await ctxB.close()
        # ============ 10. deep links ============
        reset_drive();errs.clear()
        dl=[('?from=citrus&do=round','round'),('?from=citrus&do=interp','tool'),('?from=citrus&do=log','tool'),('?from=citrus&do=cases','cases'),
            ('?from=citrus&do=case&id=__CASE__','case'),('?from=citrus&do=case&id=nope','?'),('?from=citrus&do=weekly','progress'),('?from=citrus&do=glossary','gloss'),
            ('?from=citrus&do=lesson&id=__LES__','lesson'),('?from=citrus&do=lesson&id=nope','?'),('?from=citrus&do=speed','practice'),('?from=citrus&do=bogus','?')]
        ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(f'DL pageerror {e}'))
        await pg.goto(URL);await pg.wait_for_timeout(500)
        cid=await pg.evaluate("CASES[0].id");lid=await pg.evaluate("Object.keys(LBYID)[0]")
        for qs,exp in dl:
            qs=qs.replace('__CASE__',cid).replace('__LES__',lid)
            errs.clear();await pg.goto(URL+qs);await pg.wait_for_timeout(900)
            r=await pg.evaluate("[VIEW,typeof SS!=='undefined'&&!!SS,typeof ROUND!=='undefined'&&!!ROUND,location.search,document.getElementById('fromChip')?document.getElementById('fromChip').getAttribute('href')+' | '+document.getElementById('fromChip').textContent:null,typeof CS!=='undefined'&&CS?CS.c&&CS.c.id:null]")
            note('S10 '+qs,(r,errs[:2]))
        # Galen prefill
        for qs in ['?from=galen&do=interp&ph=7.21&pco2=60&hco3=24&po2=55&fio2=0.4&sample=a&age=70','?from=galen&do=interp&pH=7.21&pCO2=60','?from=galen&do=interp&ph=7.21&pco2=60&fio2=40&po2=80','?from=galen&do=interp&ph=7.21&pco2=8&po2=7.5&units=kPa']:
            errs.clear();await pg.goto(URL+qs);await pg.wait_for_timeout(900)
            r=await pg.evaluate("[VIEW,JSON.stringify(IV),(document.querySelector('#iOut .bigread')||{}).innerText,(document.querySelector('#iOut')||{innerText:''}).innerText.match(/P\\/F[^\\n]*/)?.[0]||'',document.getElementById('fromChip')&&document.getElementById('fromChip').href]")
            note('S10 '+qs,(r,errs[:2]))
        await pg.goto(URL+'?from=galen&do=interp&ph=7.21&pco2=60&hco3=24');await pg.wait_for_timeout(900)
        await pg.screenshot(path=SHOTS+'/T25-galen-chip-phone.png')
        await pg.evaluate("go('today')");await pg.wait_for_timeout(300);await pg.screenshot(path=SHOTS+'/T25-chip-today-phone.png')
        await pg.reload();await pg.wait_for_timeout(700);note('S10 chip after reload',await pg.evaluate("!!document.getElementById('fromChip')"))
        await pg.set_viewport_size({'width':1280,'height':800});await pg.goto(URL+'?from=citrus&do=log');await pg.wait_for_timeout(900);await pg.screenshot(path=SHOTS+'/T25-chip-deck.png')
        await pg.evaluate("S.skin='clinical';S.theme='light';save();applyTheme()");await pg.wait_for_timeout(200);await pg.screenshot(path=SHOTS+'/T25-chip-deck-clinical-light.png')
        await pg.evaluate("localStorage.clear()")
        await ctx.close()
        await b.close()
    srv.terminate()
    print('FAILED:',FAIL if FAIL else 'none')
    json.dump(RES,open(os.path.join(tempfile.gettempdir(),'buffer-drive-results.json'),'w'),indent=1)
if __name__=='__main__':asyncio.run(main())
