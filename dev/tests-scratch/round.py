import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':800});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text else None)
    await pg.goto('file:///home/claude/buffer/buffer.html');await pg.wait_for_timeout(500)
    print('quiet',await pg.evaluate("document.body.classList.contains('quiet')"),'xp visible',await pg.evaluate("getComputedStyle(document.getElementById('hdr-xp')).display"),'theme',await pg.evaluate("S.theme"))
    await pg.click('#tRound');await pg.wait_for_timeout(500)
    await pg.screenshot(path='/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/v41/round.png')
    print(await pg.evaluate("document.querySelector('.sheet b').textContent"),await pg.evaluate("document.querySelector('#rbBuild').textContent"))
    await pg.click('[data-p="99"]');await pg.wait_for_timeout(200);print(await pg.evaluate("document.querySelector('#rbBuild').textContent"))
    await pg.click('#rbBuild');await pg.wait_for_timeout(600);print('round legs',await pg.evaluate("ROUND&&ROUND.legs.map(g=>g.t).join(',')"),await pg.evaluate("VIEW"))
    await pg.evaluate("go('settings')");await pg.click('[data-skin=clinical]');await pg.wait_for_timeout(200);await pg.screenshot(path='/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/v41/clinical.png')
    print('errs',errs);await b.close()
asyncio.run(main())
