import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from sabotage import *
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        reset_drive();ctxA,A=await phone(b,errs,'A');ctxB,B=await phone(b,errs,'B')
        await A.evaluate("S.xp=10;S.done={'l-a':1};save();go('settings')");await B.evaluate("S.xp=20;S.done={'l-b':1};save();go('settings')")
        await asyncio.gather(A.click('#gConnect'),B.click('#gConnect'));await A.wait_for_timeout(2500)
        for i in range(2):
            await sync(A);await sync(B)
        check('race: one buffer folder',len([f for f in live('buffer')])==1,[f['id'] for f in live('buffer')])
        check('race: one state.json',len(live('state.json'))==1,len(live('state.json')))
        check('race: one status.json',len(live('status.json'))==1,len(live('status.json')))
        dA=await A.evaluate("Object.keys(S.done).sort()");dB=await B.evaluate("Object.keys(S.done).sort()")
        check('race: merged both ways',dA==dB==['l-a','l-b'],(dA,dB))
        xa=await A.evaluate("S.xp");xb=await B.evaluate("S.xp");check('race: xp adds (10+20)',xa==xb==30,(xa,xb))
        # 4.9 leftovers: two buffer folders, each phone cached its own (the old bug)
        hub=live('hub')[0];keep=live('buffer')[0]
        twin=mk('buffer',[hub['id']],'application/vnd.google-apps.folder')
        mk('state.json',[twin['id']],content=json.dumps({'v':4,'xp':5,'done':{'l-twin':1},'epoch':0,'days':[],'kinds':{},'read':0,'qs':{}}),props={'h':'tw'})
        mk('status.json',[twin['id']],content='{"app":"buffer","stale":1}')
        await A.evaluate(f"G.ids['{hub['id']}/buffer']='{twin['id']}';gSave()");await A.reload();await A.wait_for_timeout(800)
        await sync(A);await sync(A)
        check('twin: only the oldest buffer folder left',[f['id'] for f in live('buffer')]==[keep['id']],[f['id'] for f in live('buffer')])
        check('twin: A now uses the oldest',await A.evaluate("G.ids['tag:buffer']")==keep['id'],await A.evaluate("G.ids['tag:buffer']"))
        check('twin: state merged (l-twin kept)',await A.evaluate("!!S.done['l-twin']"),await A.evaluate("Object.keys(S.done)"))
        check('twin: one state.json, one status.json',len(live('state.json'))==1 and len(live('status.json'))==1,(len(live('state.json')),len(live('status.json'))))
        await sync(B);check('twin: B gets l-twin',await B.evaluate("!!S.done['l-twin']"))
        check('no page errors',not [e for e in errs if 'pageerror' in e],errs[:3])
        await b.close()
    srv.terminate()
    print('FAILED:',FAIL if FAIL else 'none')
asyncio.run(main())
