# Drive layout by tag (Citrus claude/drive-layout.md, 17/11/2026), on the fake Drive from sabotage.py.
# usage (from the buffer folder, after python3 build.py): python3 tests/drive/bytag.py
import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from sabotage import *
FOLDER='application/vnd.google-apps.folder'
def tagged(t):return [f for f in FILES.values() if not f['trashed'] and f['mime']==FOLDER and (f['props'] or {}).get('citrusApp')==t]
def kids(fid):return [f for f in FILES.values() if not f['trashed'] and fid in f['parents']]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        # 1. fresh Drive: old path made and tagged at once; status says byTag
        reset_drive();ctxA,A=await phone(b,errs,'A')
        await A.evaluate("S.xp=40;S.done={'l-a':1};save()");await connect(A);await idle(A)
        bt=tagged('buffer')
        check('fresh: one folder tagged citrusApp=buffer',len(bt)==1,[path_of(f) for f in bt])
        check('fresh: it is My Apps/hub/buffer',bt and path_of(bt[0])=='My Apps/hub/buffer',bt and path_of(bt[0]))
        st=live('status.json');s=json.loads(st[0]['content']) if st else {}
        check('status.json in the tagged folder',st and bt and bt[0]['id'] in st[0]['parents'])
        check('status.json drive.byTag true',s.get('drive')=={'byTag':True},s.get('drive'))
        check('state.json in the tagged folder',live('state.json') and bt and bt[0]['id'] in live('state.json')[0]['parents'])
        # 2. Citrus moves and renames the folder; a new phone must follow the tag, not re-create the old path
        cit=mk('Citrus',['root'],FOLDER,props={'citrusArea':'root'});lea=mk('Learning',[cit['id']],FOLDER);med=mk('Medicine',[lea['id']],FOLDER)
        bf=bt[0];bf['parents']=[med['id']];bf['name']='Blood gases - Buffer'
        ctxB,B=await phone(b,errs,'B');await B.evaluate("S.xp=5;S.done={'l-b':1};save()");await connect(B);await idle(B)
        check('moved: no new buffer folder by path',not [f for f in FILES.values() if f['name']=='buffer' and not f['trashed'] and f['mime']==FOLDER])
        check('moved: still one tagged folder',len(tagged('buffer'))==1)
        sB=await B.evaluate("JSON.parse(JSON.stringify(S))")
        check('moved: phone B merged A\'s progress',set(sB['done'])=={'l-a','l-b'},sB['done'])
        check('moved: one state.json, in the moved folder',len(live('state.json'))==1 and bf['id'] in live('state.json')[0]['parents'],[path_of(f) for f in live('state.json')])
        # phone A (cached ids from before the move) keeps working after a new session
        await A.evaluate("G.ver={}");await sync(A);await idle(A)
        check('moved: phone A still one state.json',len(live('state.json'))==1)
        # 3. Citrus plan.json found by tag in a new place
        today=await A.evaluate("today()")
        hub0=mk('00 Hub',[cit['id']],FOLDER);cf=mk('Citrus',[hub0['id']],FOLDER,props={'citrusApp':'citrus'})
        mk('plan.json',[cf['id']],content=json.dumps({'blocks':[{'app':'buffer','date':today,'title':'Buffer: tagged plan','minutes':12,'status':'accepted'}]}))
        await A.evaluate("G.ver={}");await sync(A);await idle(A)
        check('plan.json read from the tagged citrus folder',await A.evaluate("G.plan&&G.plan.title")=='Buffer: tagged plan',await A.evaluate("G.plan"))
        # 4. Yuzu inbox by tag (yuzu-data), never created by path
        ydata=mk('collection & media',[cit['id']],FOLDER,props={'citrusApp':'yuzu-data'});col=mk('collection',[ydata['id']],FOLDER)
        await A.evaluate("S.qmiss={[L[0].id+':0']:Date.now()};save();go('progress')");await A.wait_for_timeout(600)
        await A.evaluate("(async()=>{const m=document.createElement('div');await toYuzu(document.createElement('button'),m);window.__ym=m.textContent;})()");await A.wait_for_timeout(1800)
        inb=[f for f in kids(col['id']) if f['name']=='inbox']
        check('yuzu: inbox made inside the tagged folder',len(inb)==1,await A.evaluate("window.__ym"))
        check('yuzu: pack written there',inb and any(f['name'].startswith('buffer-misses-') for f in kids(inb[0]['id'])),await A.evaluate("window.__ym"))
        check('yuzu: no My Apps/Yuzu made',not [f for f in FILES.values() if f['name']=='Yuzu' and not f['trashed']])
        # 5. hand-off: tagged folder used; untagged first use is made on the old path and tagged
        await A.evaluate("sendHandoff({kind:'gas',title:'t',gas:{ph:7.2}})" if await A.evaluate("typeof sendHandoff==='function'") else "0");await A.wait_for_timeout(1500)
        ho=tagged('handoff')
        check('handoff: folder tagged handoff',len(ho)==1,[path_of(f) for f in ho])
        check('handoff: file written there',ho and any(f['name'].startswith('buffer') or f['name'].endswith('.json') for f in kids(ho[0]['id'])),[f['name'] for f in kids(ho[0]['id'])] if ho else None)
        check('no page errors',not [e for e in errs if 'pageerror' in e],errs[:3])
        await ctxA.close();await ctxB.close();await b.close()
    srv.terminate()
    print('FAILED:',FAIL if FAIL else 'none')
if __name__=='__main__':asyncio.run(main())
