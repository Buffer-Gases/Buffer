import asyncio,sys
from playwright.async_api import async_playwright
URL='file:///home/claude/buffer/buffer.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    errs=[]
    for w,scheme in [(1280,'light'),(390,'dark')]:
      ctx=await b.new_context(viewport={'width':w,'height':900},color_scheme=scheme)
      pg=await ctx.new_page()
      pg.on('pageerror',lambda e:errs.append(f'{w} pageerror {e}'))
      pg.on('console',lambda m:errs.append(f'{w} console {m.text}') if m.type=='error' else None)
      await pg.goto(URL);await pg.wait_for_timeout(500)
      for v in ['today','learn','labs','practice','progress','settings','web','scen','teach','est','flash','serial']:
        await pg.evaluate(f"go('{v}')");await pg.wait_for_timeout(150)
        crash=await pg.evaluate("!!document.querySelector('section.view:not([hidden]) .crash')")
        ov=await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")
        if crash: errs.append(f'{w} CRASH view {v}: '+await pg.evaluate("document.querySelector('.crash').innerText"))
        if ov: errs.append(f'{w} overflow {v}')
        await pg.screenshot(path=f'/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/v4/{v}_{w}.png',full_page=False)
      tools=await pg.evaluate("TOOLS.map(t=>t[0]).concat(MODELS.map(m=>'m-'+m[0]))")
      for t in tools:
        await pg.evaluate(f"openTool('{t}')");await pg.wait_for_timeout(120)
        crash=await pg.evaluate("!!document.querySelector('#v-tool .crash')")
        ov=await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")
        if crash: errs.append(f'{w} CRASH tool {t}: '+await pg.evaluate("document.querySelector('.crash').innerText"))
        if ov: errs.append(f'{w} overflow tool {t}')
        if t in ('interp','oxy','units','pocket','vbg','m-sid'): await pg.screenshot(path=f'/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/v4/tool_{t}_{w}.png',full_page=True)
      # lessons
      n=await pg.evaluate("L.length")
      for i in range(n):
        lid=await pg.evaluate(f"L[{i}].id")
        await pg.evaluate(f"openLesson('{lid}')");
        crash=await pg.evaluate("!!document.querySelector('#v-lesson .crash')")
        if crash: errs.append(f'{w} CRASH lesson {lid}')
      await ctx.close()
    await b.close()
    print('\n'.join(errs) if errs else 'NO ERRORS')
asyncio.run(main())
