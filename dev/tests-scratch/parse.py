import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await (await b.new_context()).new_page()
    await pg.goto('file:///home/claude/buffer/buffer.html');await pg.wait_for_timeout(300)
    for t in ['pH 7.05 pCO2 12 HCO3 3.2','pH 7.21 pCO2 3.2 pO2 14 HCO3 9.4','pH 7.21 pCO2 3.2 kPa HCO3 9.4','pH 7.40 pCO2 40 mmHg HCO3 24','pCO2 6.1','pCO2 12','pH 7.31 PvCO2 6.9 HCO3 25 venous']:
      print(t,'->',await pg.evaluate(f"JSON.stringify(parseGas({t!r}))"))
    # lesson shuffle check
    print(await pg.evaluate("openLesson('comp'),[...document.querySelectorAll('#lQ .qitem')].map(d=>[...d.querySelectorAll('.opt')].map(b=>b.dataset.oi).join(''))"))
    await b.close()
asyncio.run(main())
