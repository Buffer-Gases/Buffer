import asyncio,json
from playwright.async_api import async_playwright
URL='file:///home/claude/buffer/buffer.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    for st in [json.dumps({"v":2,"kinds":{"hagma":{"n":3,"c":2,"box":1,"due":0}},"done":{"ph":1},"days":["2026-10-30"],"read":12,"steps":{},"conf":[],"units":"kPa","patm":707,"agref":10}),'{garbage','null']:
      ctx=await b.new_context();pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.add_init_script(f"if(!sessionStorage.getItem('x')){{localStorage.setItem('buffer.v1',{json.dumps(st)});sessionStorage.setItem('x','1')}}")
      await pg.goto(URL);await pg.wait_for_timeout(300)
      print(await pg.evaluate("[S.v,S.read,S.units,S.patm,S.agref,S.xp,typeof S.google,dueKinds().length,!!document.querySelector('.crash')]"))
      for v in ['today','progress','practice','labs']:
        await pg.evaluate(f"go('{v}')");c=await pg.evaluate("!!document.querySelector('section.view:not([hidden]) .crash')")
        if c: errs.append('crash '+v)
      await ctx.close()
    print(errs or 'ok')
asyncio.run(main())
