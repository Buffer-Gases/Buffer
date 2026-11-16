"""Builds buffer.html (shell.html + the scripts in order). python3 build.py [--pwa]
--pwa also writes pwa/index.html (PWA head + the app + the service-worker registration tail).
buffer.html is written only when the syntax and duplicate-name checks pass, so a failed build keeps the last good one."""
import subprocess,tempfile,os,sys,re,collections,datetime
os.chdir(os.path.dirname(os.path.abspath(__file__)))
rd=lambda p:open(p,encoding='utf-8').read()
order=['c1','c2','c3','c4','c5','c6','c7','c8','c10','c11','c12','c9','e1','e2','ui1','ui2','ui5','ui3','ui6','ui7','e3','ui8','ui9','ui10','hub','kit']
BUILD_DATE=datetime.date.today().strftime('%d/%m/%Y')
js='const BUILD_DATE=\''+BUILD_DATE+'\';\n'+'\n'.join(rd(f+'.js') for f in order)+'\nboot();hubBoot();\n'
shell=rd('shell.html').rstrip()
body=shell+'\n<script>\n'+js+'</script>\n'
# the file copy must declare its encoding and viewport (T29-19: mojibake and a 980 px quirks-mode page on phones otherwise).
# If shell.html already starts with them (D24 may add them), nothing is added twice.
head=shell[:1024].lower()
pre=('' if head.lstrip().startswith('<!doctype') else '<!doctype html>\n')
pre+=('' if re.search(r'<meta\s+charset',head) else '<meta charset="utf-8">\n')
pre+=('' if re.search(r'<meta\s+name=["\']?viewport',shell.lower()) else '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n')
out=pre+body
# fail loudly on syntax errors and duplicate top-level declarations
tf=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8');tf.write(js);tf.close()
r=subprocess.run(['node','--check',tf.name],capture_output=True,text=True);os.unlink(tf.name)
if r.returncode:print('SYNTAX ERROR\n'+r.stderr[:800]);raise SystemExit(1)
# duplicate top-level function names silently override each other: fail on them
seen=collections.defaultdict(list);seen['BUILD_DATE'].append('build.py')
for f in order:
  for m in re.finditer(r'^(?:(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var|class)\s+([A-Za-z_$][\w$]*))',rd(f+'.js'),re.M):seen[m.group(1) or m.group(2)].append(f)
dups={k:v for k,v in seen.items() if len(v)>1}
if dups:print('DUPLICATE DECLARATIONS',dups);raise SystemExit(1)
open('buffer.html','w',encoding='utf-8').write(out)
print(len(out))
pwa=[a for a in sys.argv[1:] if a=='--pwa' or a.startswith('--pwa=')]
if pwa:
  pdir=pwa[0].split('=',1)[1] if '=' in pwa[0] else 'pwa'   # --pwa=<dir> writes <dir>/index.html (for a test copy)
  # pwa/index.html = PWA head + the app + registration. The worker registers on https and on http://localhost (a secure
  # context) so offline behaviour can be tested locally (T29-18); file:// never registers. When an update takes over
  # mid-session the user is told instead of the page switching silently (T29-26).
  phead=('<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon-192.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
    '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Buffer">\n</head><body>\n')
  tail=('<script>if(\'serviceWorker\' in navigator&&window.isSecureContext&&/^https?:$/.test(location.protocol))addEventListener(\'load\',()=>{'
    'const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register(\'sw.js\').catch(()=>{});'
    'navigator.serviceWorker.addEventListener(\'controllerchange\',()=>{if(had&&typeof toast===\'function\')toast(\'Buffer updated. Reload when you finish this gas.\');});});</script>\n</body></html>\n')
  # the PWA head already opens the document: drop the shell's own leading doctype, <html>, charset and viewport (D24 request)
  pbody=body;lead=re.compile(r'^\s*(?:<!doctype[^>]*>|<html[^>]*>|<head>|<meta\s+charset[^>]*>|<meta\s+name=["\']?viewport[^>]*>)',re.I)
  while lead.match(pbody):pbody=lead.sub('',pbody,count=1)
  pbody=pbody.lstrip()
  open(os.path.join(pdir,'index.html'),'w',encoding='utf-8').write(phead+pbody+tail)
  print(os.path.join(pdir,'index.html'),len(phead+pbody+tail))
