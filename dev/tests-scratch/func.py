import asyncio,json
from playwright.async_api import async_playwright
URL='file:///home/claude/buffer/buffer.html'
SP='/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/v4/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    ctx=await b.new_context(viewport={'width':1280,'height':900})
    pg=await ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(f'pageerror {e}'))
    pg.on('console',lambda m:errs.append(f'console {m.text}') if m.type=='error' and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text else None)
    await pg.goto(URL);await pg.wait_for_timeout(400)
    async def crash(tag):
      c=await pg.evaluate("(()=>{const c=document.querySelector('section.view:not([hidden]) .crash');return c?c.innerText:null})()")
      if c: errs.append(tag+' CRASH '+c)
    # web: click node
    await pg.evaluate("go('web')");await pg.wait_for_timeout(600)
    await pg.click('.web-n[data-id="winters"]');await pg.wait_for_timeout(300);await crash('web')
    await pg.screenshot(path=SP+'web_sel.png')
    # Round end to end
    await pg.evaluate("go('today')");await pg.click('#tRound');await pg.wait_for_timeout(300);await pg.click('#rbBuild');await pg.wait_for_timeout(500);await crash('round start')
    legs=await pg.evaluate("ROUND.legs.map(l=>l.t)");print('legs',legs)
    for step in range(12):
      if not await pg.evaluate("!!ROUND"):break
      t=await pg.evaluate("ROUND.legs[ROUND.i].t");v=await pg.evaluate("VIEW")
      print('leg',t,'view',v)
      if t in('gym','steps','due'):
        # autoplay: finish session quickly
        await pg.evaluate("SS.res=Array.from({length:SS.n},()=>({ok:true,missed:[]}));finishSession(false)");await pg.wait_for_timeout(200);await crash('sum '+t)
        await pg.click('#sLeg')
      elif t=='concept':
        await pg.locator('[data-leg]:visible').first.click()
      elif t=='est':
        for i in range(3):
          await pg.click('#esLock');await pg.wait_for_timeout(80);await crash('est')
          if i<2: await pg.click('#esNext')
        await pg.locator('[data-leg]:visible').first.click()
      elif t=='scen':
        for k in range(12):
          if await pg.evaluate("!SC||!SC.sc.steps[SC.i]"):break
          ri=await pg.evaluate("SC.sc.steps[SC.i].o.findIndex(o=>o[1])")
          wi=await pg.evaluate("SC.sc.steps[SC.i].o.findIndex(o=>!o[1])")
          if k==0: await pg.click(f'.opt[data-o="{wi}"]')
          await pg.click(f'.opt[data-o="{ri}"]');await crash('scen');await pg.click('#scNext')
        await pg.screenshot(path=SP+'scen_done.png',full_page=True)
        await pg.locator('[data-leg]:visible').first.click()
      elif t=='teach':
        await pg.fill('#tbText','Winter formula predicts the PCO2, a higher value means respiratory failure and fatigue.');await pg.click('#tbDone')
        await pg.check('.tb-rub input[data-i="0"]');await pg.check('.tb-rub input[data-i="1"]');await pg.click('#tbSave')
      await pg.wait_for_timeout(500)
    print('round done',await pg.evaluate("[!!ROUND,S.roundsDone,S.lastRound===today(),S.xp]"))
    await pg.screenshot(path=SP+'today_after.png')
    # flash, serial, boss, final, other modes
    await pg.evaluate("go('flash')");await pg.click('#flFlip');await pg.click('#flYes');await pg.click('#flFlip');await pg.click('#flNo');await crash('flash')
    await pg.evaluate("go('serial')");await pg.click('[data-sr="sep"]')
    for i in range(3):
      await pg.click('.opt[data-o="0"]');await crash('serial');await pg.click('#srNext');await pg.wait_for_timeout(50)
    for mode in ['steps','quick','fit','reflex','gym','gotd','final','today']:
      await pg.evaluate(f"startSession('{mode}')");await pg.wait_for_timeout(150);await crash('mode '+mode)
      # answer first visible option a few times
      for k in range(6):
        btn=await pg.query_selector('#v-session .opt:not([disabled]), #v-session .gopt:not([disabled]), #v-session [data-a]:not([disabled])')
        if not btn: break
        try: await btn.click(timeout=500)
        except Exception: break
        await pg.wait_for_timeout(60);await crash('ans '+mode)
        nx=await pg.query_selector('#fbNext, #gNext, #nNext')
        if nx:
          try: await nx.click(timeout=500)
          except Exception: pass
      await pg.evaluate("if(SS&&!SS.done)finishSession(true)");await pg.wait_for_timeout(100);await crash('fin '+mode)
    await pg.evaluate("startSession('boss',{mod:'dis'})");await pg.wait_for_timeout(100);await crash('boss')
    await pg.screenshot(path=SP+'boss.png')
    await pg.evaluate("finishSession(true)")
    await pg.evaluate("go('progress')");await crash('progress');await pg.screenshot(path=SP+'progress_after.png',full_page=True)
    # settings theme
    await pg.evaluate("go('settings')");await pg.click('[data-theme="dark"]');th=await pg.evaluate("document.documentElement.dataset.theme");print('theme',th)
    await pg.screenshot(path=SP+'settings_dark.png',full_page=True)
    # interp tool parse
    await pg.evaluate("openTool('interp')");await pg.fill('#pTxt','pH 7.21 pCO2 3.2 kPa pO2 14 HCO3 9.4 Na 136 Cl 101 Lac 1.4 Glu 28');await pg.click('#pGo');await pg.wait_for_timeout(100)
    print('interp',await pg.evaluate("document.querySelector('.bigread').innerText"))
    # reload persistence
    await pg.reload();await pg.wait_for_timeout(300);print('after reload',await pg.evaluate("[S.roundsDone,S.xp,VIEW,TOOL]"))
    # hash routes
    for h in ['#tool-oxy','#scen-co','#l-comp','#web','#interp','#lab']:
      await pg.goto(URL+h);await pg.wait_for_timeout(200);await crash('hash '+h);print(h,await pg.evaluate("VIEW"))
    # migration from v3 state
    st=json.dumps({"v":2,"kinds":{"hagma":{"n":3,"c":2,"box":1,"due":0}},"done":{"ph":1},"days":["2026-10-30"],"read":12,"steps":{},"conf":[],"units":"mmHg","patm":760,"agref":12})
    await pg.evaluate(f"localStorage.setItem('buffer.v1',{json.dumps(st)})");await pg.goto(URL);await pg.wait_for_timeout(300);await crash('migrate')
    print('migrated',await pg.evaluate("[S.v,S.read,S.xp,typeof S.google,dueKinds().length]"))
    await pg.evaluate("localStorage.setItem('buffer.v1','{garbage')");await pg.goto(URL);await pg.wait_for_timeout(300);await crash('garbage')
    await b.close()
    print('\n'.join(errs) if errs else 'NO ERRORS')
asyncio.run(main())
