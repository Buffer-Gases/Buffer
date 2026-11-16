import asyncio,json
from playwright.async_api import async_playwright
URL='file:///home/claude/buffer/buffer.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for name,vp in [('320',{'width':320,'height':640}),('land',{'width':844,'height':390}),('tablet',{'width':768,'height':1024})]:
      ctx=await b.new_context(viewport=vp);pg=await ctx.new_page();errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto(URL);await pg.wait_for_timeout(300)
      ov=[]
      for v in ['today','learn','labs','practice','progress','settings','web','scen','teach','est','flash','serial']:
        await pg.evaluate(f"go('{v}')");await pg.wait_for_timeout(80)
        if await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"): ov.append(v)
      for t in await pg.evaluate("TOOLS.map(t=>t[0]).concat(MODELS.map(m=>'m-'+m[0]))"):
        await pg.evaluate(f"openTool('{t}')");await pg.wait_for_timeout(60)
        if await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"): ov.append('tool-'+t)
      # session reachability of controls in landscape
      await pg.evaluate("startSession('steps')");await pg.wait_for_timeout(100)
      small=await pg.evaluate("[...document.querySelectorAll('button:not([disabled]),select,input[type=checkbox]')].filter(e=>e.offsetParent&&(e.getBoundingClientRect().height<36||e.getBoundingClientRect().width<36)).map(e=>(e.id||e.className)+':'+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)).slice(0,6)")
      print(name,'overflow:',ov,'small targets in session:',small,errs or '')
      await ctx.close()
    # reduced motion + status shape + back button
    ctx=await b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');pg=await ctx.new_page()
    await pg.goto(URL);await pg.wait_for_timeout(300)
    print('reduced-motion animations running:',await pg.evaluate("document.getAnimations().filter(a=>a.playState==='running').length"))
    print('status top-level keys:',await pg.evaluate("Object.keys(hubStatus()).join(',')"))
    await pg.evaluate("startSession('steps')");await pg.wait_for_timeout(100);await pg.go_back();await pg.wait_for_timeout(200)
    print('after Back from a session: view=',await pg.evaluate("VIEW"),'url=',pg.url[-30:],'insession=',await pg.evaluate("document.body.classList.contains('insession')"))
    await b.close()
asyncio.run(main())
