import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await (await b.new_context()).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file:///home/claude/buffer/buffer.html#tool-m-comp');await pg.wait_for_timeout(300)
    sel=await pg.query_selector('#v-tool select');
    for d in ['rac','ralk']:
      await sel.select_option(d)
      for h,c in [('0','40'),('','5'),('99','500'),('24','40')]:
        ins=await pg.query_selector_all('#v-tool input');await ins[0].fill(h);await ins[1].fill(c)
    print(errs or 'ok', await pg.evaluate("document.querySelector('#v-tool .verdict-line').textContent"))
    await b.close()
asyncio.run(main())
