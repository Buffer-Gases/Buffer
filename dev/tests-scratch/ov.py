import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':390,'height':900})).new_page()
    await pg.goto('file:///home/claude/buffer/buffer.html#tool-pocket');await pg.wait_for_timeout(400)
    print(await pg.evaluate("""[...document.querySelectorAll('#v-tool *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right)+' '+e.textContent.slice(0,30))"""))
    await b.close()
asyncio.run(main())
