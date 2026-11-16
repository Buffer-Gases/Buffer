import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1280,'height':900})).new_page()
    await pg.goto('file:///home/claude/buffer/buffer.html');await pg.wait_for_timeout(300)
    out={}
    views=['today','learn','labs','practice','progress','settings','web','scen','teach','est','flash','serial']
    tools=await pg.evaluate("TOOLS.map(t=>t[0])")
    for v in views+['tool-'+t for t in tools]+['session-steps','session-gym','session-reflex','session-fit']:
      if v.startswith('tool-'): await pg.evaluate(f"openTool('{v[5:]}')")
      elif v.startswith('session-'): await pg.evaluate(f"startSession('{v[8:]}')")
      else: await pg.evaluate(f"go('{v}')")
      await pg.wait_for_timeout(120)
      r=await pg.evaluate("""(()=>{const sec=document.querySelector('section.view:not([hidden])');const bad=[];
       sec.querySelectorAll('button,[role=button],input,select,textarea').forEach(e=>{if(e.offsetParent===null)return;let name=(e.getAttribute('aria-label')||e.textContent||'').trim();if(e.matches('input,select,textarea')){const id=e.id;name=e.getAttribute('aria-label')||(id&&document.querySelector('label[for="'+id+'"]')?'lab':'')||(e.closest('label')?'lab':'')||e.placeholder||'';}if(!name)bad.push(e.outerHTML.slice(0,110));});
       const ids={};document.querySelectorAll('[id]').forEach(e=>{ids[e.id]=(ids[e.id]||0)+1});const dup=Object.keys(ids).filter(k=>ids[k]>1);
       return {unnamed:bad.slice(0,4),dupIds:dup.slice(0,6)}})()""")
      if r['unnamed'] or r['dupIds']: out[v]=r
      if v.startswith('session-'): await pg.evaluate("finishSession(true)")
    for k,v in out.items(): print(k,v)
    print('done')
    await b.close()
asyncio.run(main())
