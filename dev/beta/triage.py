import json,glob,os,collections,sys
B='/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/'
OWN={'c1.js':'D01','c2.js':'D02','c3.js':'D03','c4.js':'D04','c5.js':'D05','c9.js':'D05','c6.js':'D06','c7.js':'D06','c8.js':'D06','c10.js':'D07','c11.js':'D08','c12.js':'D09','e1.js':'D10','e2.js':'D11','e3.js':'D12','ui1.js':'D13','ui2.js':'D14','ui3.js':'D15','ui5.js':'D16','ui6.js':'D17','ui7.js':'D18','ui8.js':'D19','ui9.js':'D20','ui10.js':'D21','hub.js':'D22','kit.js':'D23','shell.html':'D24','pwa':'D25','build.py':'D25','tests':'D25'}
items=[];bad=0
for f in sorted(glob.glob(B+'notes/T*.jsonl')):
  for line in open(f):
    line=line.strip()
    if not line:continue
    try:o=json.loads(line)
    except Exception:bad+=1;continue
    items.append(o)
def owner(fl):
  fl=(fl or '').strip().split('/')[-1] if not str(fl).startswith('pwa') else 'pwa'
  if fl.startswith('tests'):return 'D25'
  for k,v in OWN.items():
    if fl==k or fl.startswith(k.replace('.js','')+'.') :return v
  return 'D99'
box=collections.defaultdict(list)
for o in items:box[owner(o.get('file'))].append(o)
sevs=['critical','major','minor','polish','idea']
print('items',len(items),'unparsed',bad)
for d in sorted(box):
  c=collections.Counter(o.get('sev') for o in box[d])
  print(d,len(box[d]),' '.join(f'{s}:{c.get(s,0)}' for s in sevs))
if '--write' in sys.argv:
  os.makedirs(B+'inbox',exist_ok=True)
  for d,v in box.items():
    v.sort(key=lambda o:sevs.index(o.get('sev')) if o.get('sev') in sevs else 9)
    with open(B+f'inbox/{d}.jsonl','w') as fh:
      for o in v:fh.write(json.dumps(o,ensure_ascii=False)+'\n')

# ---- second pass: split heavy owners into 30 developers ----
import re
def split(o,d):
  t=o.get('id','').split('-')[0];w=(o.get('where','')+' '+o.get('what','')).lower();f=o.get('file','')
  if d=='D15':
    if t=='T14' or re.search(r'toolfn|\b(vbg|oxy|urine|bicarb|units|pocket)\b tool|pocket card|venous → arterial|oxygenation tool|urine gap|henderson check|ventilator co',w):return 'D25'
    if t=='T24' or re.search(r'settings|backup|restore|reset|route\(|yzl|yzg|cardsfromlessons|gascards',w):return 'D26'
  if d=='D24' and t=='T27':return 'D27'
  if d=='D10' and re.search(r'gencase|kinds|generator|generated|safecase|kindsfor|labelpool|distract|withseed|\bcase gen',w):return 'D28'
  if d=='D19' and t=='T22':return 'D29'
  if d=='D09' and (t=='T22' or 'sim-' in w):return 'D29'
  if d=='D20' and (t=='T26' or 'gloss' in w):return 'D30'
  if d in('D99',) :return 'D23'
  return d
if '--split' in sys.argv:
  box2=collections.defaultdict(list)
  for d,v in box.items():
    for o in v:box2[split(o,d)].append(o)
  import shutil
  for p in glob.glob(B+'inbox/*.jsonl'):os.remove(p)
  for d,v in sorted(box2.items()):
    v.sort(key=lambda o:sevs.index(o.get('sev')) if o.get('sev') in sevs else 9)
    with open(B+f'inbox/{d}.jsonl','w') as fh:
      for o in v:fh.write(json.dumps(o,ensure_ascii=False)+'\n')
    c=collections.Counter(o.get('sev') for o in v)
    print('SPLIT',d,len(v),' '.join(f'{s}:{c.get(s,0)}' for s in sevs))
