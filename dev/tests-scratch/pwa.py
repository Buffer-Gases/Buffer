import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':390,'height':900})).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8765/#settings');await pg.wait_for_timeout(1200)
    print(await pg.evaluate("[hubCan(),VIEW,!!document.querySelector('#gConnect'),document.querySelector('#google-root').innerText.slice(0,120)]"))
    await pg.fill('#gCid','abc');await pg.click('#gConnect');await pg.wait_for_timeout(200)
    print(await pg.evaluate("G.line"))
    print(await pg.evaluate("JSON.stringify(hubStatus()).slice(0,300)"))
    await pg.evaluate("go('today')");print(await pg.evaluate("document.querySelector('#citrus-line').innerText"))
    sw=await pg.evaluate("navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(r=>r.length):-1");print('sw regs',sw)
    print(errs or 'ok');await b.close()
asyncio.run(main())
