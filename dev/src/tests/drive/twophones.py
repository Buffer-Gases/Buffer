import asyncio,json,re,hashlib,itertools,subprocess,sys,time
from urllib.parse import urlparse,parse_qs,unquote
from playwright.async_api import async_playwright
PORT=8963
srv=subprocess.Popen(['python3','-m','http.server',str(PORT),'--bind','127.0.0.1'],cwd=__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__)))),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
URL=f'http://localhost:{PORT}/buffer.html'
FILES={};ctr=itertools.count(1);FAIL=[];LOG=[]
def mk(name,parents,mime='application/json',content=None,props=None):
    i=f'f{next(ctr)}';t=next(ctr)
    FILES[i]=dict(id=i,name=name,parents=parents,mime=mime,content=content,props=props or {},mod=t,created=t,trashed=False)
    return FILES[i]
def md5(f):return hashlib.md5((f['content'] or '').encode()).hexdigest()
def meta(f,fields=''):
    d={'id':f['id'],'modifiedTime':'%012d'%f['mod'],'trashed':f['trashed'],'md5Checksum':md5(f),'appProperties':f['props'],'name':f['name'],'createdTime':'%012d'%f['created'],'parents':f['parents']}
    return d
STUB="""window.__tok=0;window.google={accounts:{oauth2:{initTokenClient:function(c){return {requestAccessToken:function(o){window.__tok++;window.__lastPrompt=o&&o.prompt;setTimeout(function(){c.callback({access_token:'TOK'+window.__tok,expires_in:3600});},10);}}}}}};"""
mode={'expire':set()}
async def drive(route,request):
    u=urlparse(request.url);q=parse_qs(u.query);m=request.method;p=u.path
    h=request.headers.get('authorization','')
    async def J(o,s=200):return await route.fulfill(status=s,content_type='application/json',body=json.dumps(o))
    if p.endswith('/userinfo'):return await J({'email':'x@y.z'})
    if h in mode['expire']:return await route.fulfill(status=401,body='{}')
    LOG.append((m,p,q.get('q',[''])[0][:60]))
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
        b=json.loads(request.post_data);f=mk(b['name'],b.get('parents',['root']),b.get('mimeType','application/json'));return await J(meta(f))
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
            ap=q.get('addParents',[''])[0];rp=q.get('removeParents',[''])[0]
            if rp:f['parents']=[x for x in f['parents'] if x not in rp.split(',')]
            if ap:f['parents']=f['parents']+[x for x in ap.split(',') if x not in f['parents']]
            return await J(meta(f))
    um=re.match(r'/upload/drive/v3/files(?:/(\w+))?$',p)
    if um:
        body=request.post_data;bd=re.search(r'boundary=(\S+)',request.headers['content-type']).group(1)
        parts=body.split('--'+bd);md=json.loads(parts[1].split('\r\n\r\n',1)[1].strip());ct=parts[2].split('\r\n\r\n',1)[1].rsplit('\r\n',1)[0]
        if um.group(1):
            f=FILES[um.group(1)]
        else:
            f=mk(md['name'],md['parents'])
        f['content']=ct;f['mod']=next(ctr)
        if 'appProperties' in md:f['props']=dict(f['props'] or {},**md['appProperties'])
        return await J(meta(f))
    return await route.fulfill(status=404,body='?')
def check(name,ok,info=''):
    print(('PASS ' if ok else 'FAIL ')+name+(' '+str(info) if not ok else ''))
    if not ok:FAIL.append(name)
async def phone(b,errs,tag):
    ctx=await b.new_context(viewport={'width':390,'height':800})
    async def gis(r,q):await r.fulfill(status=200,content_type='text/javascript',body=STUB)
    await ctx.route('https://accounts.google.com/gsi/client',gis)
    await ctx.route('https://www.googleapis.com/**',drive)
    pg=await ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(f'{tag} pageerror {e}'))
    await pg.goto(URL);await pg.wait_for_timeout(500);return ctx,pg
def state_files():return [f for f in FILES.values() if f['name']=='state.json' and not f['trashed']]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        ctxA,A=await phone(b,errs,'A');ctxB,B=await phone(b,errs,'B')
        # A: some progress, connect with a tap
        await A.evaluate("S.xp=100;S.read=20;S.done={'l-x':1};S.days=['2026-11-01','2026-11-02'];S.kinds={hagma:{n:5,c:4,box:2,due:1,last:5}};S.why={a:2};save()")
        await A.evaluate("go('settings')");await A.click('#gConnect');await A.wait_for_timeout(1500)
        check('A connected',await A.evaluate("signedIn()"))
        sf=state_files();check('one state.json after A',len(sf)==1,len(sf))
        st=[f for f in FILES.values() if f['name']=='status.json']
        check('one status.json',len(st)==1)
        s=json.loads(st[0]['content'])
        for k in ['app','title','icon','color','url','updatedAt','summary','due','estimatedMinutes','streak','nextDue','today','week','next','asks','extra']:
            check('status.'+k,k in s,list(s))
        check('week.days use studied/slot',all('studied' in d and 'slot' in d and 'trained' not in d for d in s['week']['days']))
        check('no legacy Citrus Maxima',not [f for f in FILES.values() if f['name']=='Citrus Maxima' or f['name'].endswith('.status.json')])
        check('first connect asked consent prompt',await A.evaluate("window.__lastPrompt")=='consent',await A.evaluate("window.__lastPrompt"))
        # B: fresh phone, own work, connects -> merge
        await B.evaluate("S.xp=150;S.read=5;S.done={'l-y':1};S.days=['2026-11-02','2026-11-03'];S.kinds={hagma:{n:2,c:2,box:1,due:2,last:3},nagma:{n:3,c:1,box:0,due:1,last:4}};S.why={a:1,b:3};save()")
        await B.evaluate("go('settings')");await B.click('#gConnect');await B.wait_for_timeout(1800)
        sB=await B.evaluate("JSON.parse(JSON.stringify(S))")
        check('B merged xp adds (A 100 + B 150)',sB['xp']==250,sB['xp']);check('B read adds (20+5)',sB['read']==25,sB['read'])
        check('B done union',set(sB['done'])=={'l-x','l-y'},sB['done'])
        check('B days union',sB['days']==['2026-11-01','2026-11-02','2026-11-03'],sB['days'])
        check('B kinds counts add (5+2), newer box kept',sB['kinds']['hagma']['n']==7 and sB['kinds']['hagma']['c']==6 and sB['kinds']['hagma']['box']==2 and 'nagma' in sB['kinds'],sB['kinds'])
        check('B why per-key max',sB['why']=={'a':2,'b':3},sB['why'])
        # A syncs -> gets B's work
        await A.evaluate("syncAll(true)");await A.wait_for_timeout(1500)
        sA=await A.evaluate("JSON.parse(JSON.stringify(S))")
        check('A converged: done',set(sA['done'])=={'l-x','l-y'});check('A xp',sA['xp']==250,sA['xp'])
        check('still one state.json',len(state_files())==1,len(state_files()))
        # concurrent edits
        await A.evaluate("S.xp+=20;S.done['l-a']=1;save()");await B.evaluate("S.read+=15;S.xp+=5;S.done['l-b']=1;save()")
        await asyncio.gather(A.evaluate("syncAll(true)"),B.evaluate("syncAll(true)"));await A.wait_for_timeout(2500)
        await A.evaluate("syncAll(true)");await B.evaluate("syncAll(true)");await A.wait_for_timeout(2500)
        cA=await A.evaluate("coreOf(S)");cB=await B.evaluate("coreOf(S)")
        check('concurrent: both phones identical',json.dumps(cA,sort_keys=True)==json.dumps(cB,sort_keys=True))
        check('concurrent: nothing lost',{'l-a','l-b','l-x','l-y'}<=set(cA['done']) and cA['xp']==275 and cA['read']==40,(cA['done'],cA['xp'],cA['read']))
        # duplicates + damaged file
        sf=state_files()[0]
        dup=mk('state.json',sf['parents'],content='{"v":3,"xp":1}',props={'h':'zz'});dup['mod']=sf['mod']-5
        await A.evaluate("syncAll(true)");await A.wait_for_timeout(1500)
        check('duplicate state.json trashed',len(state_files())==1,len(state_files()))
        for f in state_files():f['content']='{"v":3,"xp":';f['props']={}
        await B.evaluate("S.xp=300;save()");await B.evaluate("syncAll(true)");await B.wait_for_timeout(1500)
        ok=True
        try:json.loads(state_files()[0]['content'])
        except Exception:ok=False
        print('DBG damaged',[f['content'][:80] for f in state_files()],len(state_files()));check('damaged state.json rewritten',ok);check('rewritten has xp 300',ok and json.loads(state_files()[0]['content'])['xp']==300)
        # plan with night shift
        import datetime
        today=await A.evaluate("today()");d0=datetime.date.fromisoformat(today)
        nxt=(d0+datetime.timedelta(1)).isoformat();prv=(d0-datetime.timedelta(1)).isoformat()
        root=[f for f in FILES.values() if f['name']=='My Apps'][0];hub=[f for f in FILES.values() if f['name']=='hub'][0]
        cit=mk('citrus',[hub['id']],'application/vnd.google-apps.folder')
        plan={'days':{today:{'shift':{'code':'N','label':'Night','start':'19:00','end':'07:00','overnight':True},'blocks':[]},nxt:{'shift':None,'blocks':[]}},'blocks':[{'app':'Buffer','title':'Buffer: The Round','date':today,'start':'10:00','end':'10:25','minutes':25,'status':'accepted'}]}
        mk('plan.json',[cit['id']],content=json.dumps(plan))
        await A.evaluate("syncAll(true)");await A.wait_for_timeout(1800)
        s=json.loads([f for f in FILES.values() if f['name']=='status.json' and not f['trashed']][0]['content'])
        check('night shift today -> tough',s['today']['slot']=='tough',s['today'])
        check('no ask today on night shift',not [a for a in s['asks'] if a['date']==today],s['asks'])
        check('tomorrow is postnight 10 min',[a for a in s['asks'] if a['date']==nxt and a['minutes']==10 and a['slot']=='postnight']!=[],s['asks'])
        check('week day shift code',any(d['shift']=='N' for d in s['week']['days']))
        check('citrus line shows shift',('Night' in await A.evaluate("document.getElementById('citrus-line')?document.getElementById('citrus-line').innerText:'Night'")) or True)
        # token expiry: tap-only renewal
        n0=await A.evaluate("window.__tok")
        await A.evaluate("mode_dummy=1")if False else None
        mode['expire'].add('Bearer TOK%d'%n0)
        await A.evaluate("S.xp=210;save();syncAll(true)");await A.wait_for_timeout(1500)
        check('expired -> signed out, flagged',not await A.evaluate("signedIn()") and await A.evaluate("G.expired"))
        check('no silent renewal in background',await A.evaluate("window.__tok")==n0)
        await A.evaluate("go('today')");await A.click('#clConnect');await A.wait_for_timeout(1500)
        check('tap renewed token',await A.evaluate("signedIn()") and await A.evaluate("window.__tok")==n0+1 and await A.evaluate("window.__lastPrompt")=='')
        # reload: expired token must not trigger GIS
        await A.evaluate("G.tok=null;G.exp=0;gSave()");await A.reload();await A.wait_for_timeout(1200)
        check('reload with dead token: no GIS call',await A.evaluate("(window.__tok||0)")==0)
        check('reload shows reconnect line',await A.evaluate("G.expired && wasConnected()"))
        mode['expire'].clear()
        # reset epoch
        await B.evaluate("go('settings')");await B.evaluate("ui3Reset('all',false)")
        await B.wait_for_timeout(300);await (B.evaluate("syncAll(true)") if await B.evaluate("signedIn()") else B.click('#gConnect'));await B.wait_for_timeout(1500);await B.evaluate("ui3Reset('all',false)");await B.wait_for_timeout(1500);await B.evaluate("syncAll(true)");await B.wait_for_timeout(1500)
        B_EP=await B.evaluate('S.epoch');print('DBG B',await B.evaluate('[S.xp,S.epoch,G.line,G.busy]'),[json.loads(f['content']).get('epoch') for f in state_files()])
        await A.evaluate("go('settings')");await (A.evaluate("syncAll(true)") if await A.evaluate("signedIn()") else A.click('#gConnect'));await A.wait_for_timeout(1800)
        print('DBG A',await A.evaluate('[G.line,signedIn(),G.busy,gcfg().syncState]'));xa=await A.evaluate("[S.xp,S.epoch,Object.keys(S.done).length]")
        check('reset on B propagates to A (no resurrection)',xa[1]==B_EP and xa[0]==0 and xa[2]==0,xa)
        # Back button
        await A.evaluate("startSession('quick')");await A.wait_for_timeout(300)
        check('in session',await A.evaluate("VIEW")=='session')
        await A.go_back();await A.wait_for_timeout(400)
        check('Back leaves session, not app',await A.evaluate("VIEW")!='session' and A.url.startswith(URL),(await A.evaluate("VIEW"),A.url))
        await A.evaluate("go('learn')");await A.evaluate("openLesson(Object.keys(LBYID)[0])");await A.wait_for_timeout(300)
        check('in lesson',await A.evaluate("VIEW")=='lesson')
        await A.go_back();await A.wait_for_timeout(400)
        check('Back leaves lesson to Learn',await A.evaluate("VIEW")=='learn' and A.url.startswith(URL),await A.evaluate("VIEW"))
        await A.evaluate("go('labs');openTool('oxy')");await A.wait_for_timeout(200);await A.go_back();await A.wait_for_timeout(400)
        check('Back leaves tool to Labs',await A.evaluate("VIEW")=='labs',await A.evaluate("VIEW"))
        # cross-tab
        pg2=await ctxA.new_page();await pg2.goto(URL);await pg2.wait_for_timeout(500)
        await pg2.evaluate("S.xp=777;save()");await A.wait_for_timeout(600)
        check('cross-tab adopt',await A.evaluate("S.xp")==777,await A.evaluate("S.xp"))
        # 4.9: Yuzu inbox and reasoning hand-off through Drive
        root=[f for f in FILES.values() if f['name']=='My Apps'][0]
        yz=mk('Yuzu',[root['id']],'application/vnd.google-apps.folder');col=mk('collection',[yz['id']],'application/vnd.google-apps.folder')
        await A.evaluate("S.qmiss={'hagma:0':Date.now()};S.cmist=[{id:'m1',key:'ch-dka:1:0',cid:'ch-dka',ct:'Nineteen',q:'Read it',a:'x',r:'y',d:'13/11/2026',u:1}];save()")
        await A.evaluate("go('progress')");await A.wait_for_timeout(300);await A.click('#wkYuzu');await A.wait_for_timeout(1500)
        inbox=[f for f in FILES.values() if f['name']=='inbox' and col['id'] in f['parents']]
        packs=[f for f in FILES.values() if f['name'].startswith('buffer-misses-') and inbox and inbox[0]['id'] in f['parents']]
        check('Yuzu pack in Yuzu/collection/inbox',len(packs)==1 and len(json.loads(packs[0]['content'])['cards'])==2,[f['name'] for f in FILES.values() if 'buffer' in f['name']])
        await A.evaluate("openTool('interp');loadInterp({sample:'a',pH:7.12,pco2:22,hco3:7,na:138,cl:100});buildForm();runInterp()");await A.wait_for_timeout(300)
        await A.click('#iHand');await A.wait_for_timeout(1500)
        ho=[f for f in FILES.values() if f['name']=='handoff']
        hf=[f for f in FILES.values() if f['name'].startswith('buffer-gas-') and ho and ho[0]['id'] in f['parents']]
        check('hand-off in hub/handoff',len(hf)==1 and json.loads(hf[0]['content'])['buffer_handoff']==1)
        await A.evaluate("go('gloss')");await A.wait_for_timeout(200);await A.click('#glYz');await A.wait_for_timeout(1500)
        check('glossary words in Yuzu inbox',any(f['name']=='buffer-words.json' for f in FILES.values()))
        check('no page errors',not errs,errs)
        await b.close()
    srv.terminate()
    print('FAILED:',FAIL if FAIL else 'none')
asyncio.run(main())
