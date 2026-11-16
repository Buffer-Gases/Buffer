import asyncio,random,sys
from playwright.async_api import async_playwright
URL='file:///home/claude/buffer/buffer.html'
SEED=int(sys.argv[1]) if len(sys.argv)>1 else 1
STEPS=int(sys.argv[2]) if len(sys.argv)>2 else 600
async def run(b,w,scheme,seed):
  R=random.Random(seed);issues=[]
  ctx=await b.new_context(viewport={'width':w,'height':860},color_scheme=scheme);pg=await ctx.new_page()
  pg.on('pageerror',lambda e:issues.append(f'PAGEERROR {e}'))
  pg.on('console',lambda m:issues.append('CONSOLE '+m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
  pg.on('dialog',lambda d:asyncio.ensure_future(d.dismiss()))
  await pg.goto(URL);await pg.wait_for_timeout(300)
  trail=[]
  for i in range(STEPS):
    r=R.random()
    try:
      if r<0.06:
        v=R.choice(['today','learn','labs','practice','progress','settings','web','scen','teach','est','flash','serial'])
        await pg.evaluate(f"go('{v}')");trail.append('go '+v)
      elif r<0.08:
        await pg.go_back();trail.append('back')
      elif r<0.09:
        await pg.reload();await pg.wait_for_timeout(200);trail.append('reload')
      elif r<0.13:
        k=R.choice(['1','2','3','4','Enter','Escape','h',' ','ArrowRight','ArrowLeft','Tab']);await pg.keyboard.press(k);trail.append('key '+k)
      else:
        els=await pg.query_selector_all('button:visible, [role=button]:visible, select:visible, input:visible, textarea:visible, a[data-go]:visible, .web-n')
        els=[e for e in els]
        if not els: continue
        e=R.choice(els)
        tag=await e.evaluate("e=>e.tagName+'#'+e.id+'.'+(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className)+' '+(e.textContent||'').trim().slice(0,30)")
        t=await e.evaluate("e=>e.tagName+'|'+(e.type||'')")
        if t.startswith('SELECT'):
          opts=await e.evaluate("e=>[...e.options].map(o=>o.value)")
          if opts: await e.select_option(R.choice(opts))
        elif t.startswith('INPUT|range'):
          await e.evaluate("(e,v)=>{e.value=e.min*1+(e.max-e.min)*v;e.dispatchEvent(new Event('input',{bubbles:true}))}",R.random())
        elif t.startswith('INPUT|checkbox'):
          await e.click(timeout=800)
        elif t.startswith('INPUT') or t.startswith('TEXTAREA'):
          val=R.choice(['7.2','35','abc','','-5','99999','0','1e3','140','pH 7.31 pCO2 6.1 kPa HCO3 22','0.4'])
          if t.startswith('INPUT|number') and not val.replace('.','',1).replace('-','',1).isdigit(): val='7'
          if 'tbText' in tag: val='This is a long enough explanation of the idea with several words.'
          await e.fill(val);trail.append('fill '+tag+'='+val)
          continue
        else:
          if 'resetBtn' in tag or 'bkApply' in tag or 'gConnect' in tag or 'rbStop' in tag and R.random()<0.7: continue
          await e.click(timeout=800)
        trail.append('click '+tag)
    except Exception as ex:
      msg=str(ex).split('\n')[0]
      if 'Timeout' not in msg and 'not attached' not in msg and 'detached' not in msg and 'not visible' not in msg and 'Element is not' not in msg and 'outside of the viewport' not in msg:
        issues.append('PW '+msg)
    await pg.wait_for_timeout(15)
    if 'buffer.html' not in pg.url:
      await pg.goto(URL);await pg.wait_for_timeout(200);trail.append('re-enter')
    if i%10==0:
      st=await pg.evaluate("""(()=>{const v=document.querySelector('section.view:not([hidden])');const t=v?v.innerText:'';return {crash:!!(v&&v.querySelector('.crash'))?v.querySelector('.crash').innerText.slice(0,200):null,bad:(t.match(/\\bundefined\\b|\\bNaN\\b|\\[object Object\\]|\\bnull\\b|Infinity/g)||[]).slice(0,3),ov:document.documentElement.scrollWidth>innerWidth+1,view:typeof VIEW!=='undefined'?VIEW:'?'}})()""")
      if st['crash']: issues.append(f"CRASH in {st['view']}: {st['crash']} | last: {trail[-4:]}")
      if st['bad']: issues.append(f"BADTEXT {st['bad']} in {st['view']} | last: {trail[-3:]}")
      if st['ov']: issues.append(f"OVERFLOW in {st['view']} | last: {trail[-3:]}")
  size=await pg.evaluate("(localStorage.getItem('buffer.v1')||'').length")
  await ctx.close()
  return issues,size
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for w,sc in [(1280,'light'),(390,'dark')]:
      iss,size=await run(b,w,sc,SEED*10+w)
      seen=set();print(f'== {w} seed {SEED}: {len(iss)} issues, state {size} bytes')
      for x in iss:
        k=x[:90]
        if k in seen: continue
        seen.add(k);print(x[:400])
    await b.close()
asyncio.run(main())
