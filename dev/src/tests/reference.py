"""Independent reference implementation of the Boston rules, written separately from the JS engine.
Classifies each gas, then compares with the engine's output dumped by run.js."""
import json,math,sys,collections
AGREF=12
def classify(g):
    ph,p,h=g['pH'],g['pco2'],g['hco3']
    acid,alk=ph<7.35,ph>7.45
    hiC,loC,hiH,loH=p>45,p<35,h>26,h<22
    d=set()  # disorders
    prim=[]
    if acid:
        if hiC: prim.append('rac')
        if loH: prim.append('mac')
    elif alk:
        if loC: prim.append('ralk')
        if hiH: prim.append('malk')
    else:
        if hiC and hiH: prim.append('rac' if ph<7.4 else 'malk')
        elif loC and loH: prim.append('mac' if ph<7.4 else 'ralk')
        elif hiC or loC: prim.append('rac' if p>40 else 'ralk')
        elif hiH or loH: prim.append('mac' if h<24 else 'malk')
    if not prim and (acid or alk):
        prim.append(('mac' if h<24 else 'malk') if abs(24-h)/24>abs(p-40)/40 else ('rac' if p>40 else 'ralk'))
    d.update(prim)
    comp=None
    if len(prim)==1:
        x=prim[0]
        if x=='mac':
            e=1.5*h+8
            comp='rac' if p>e+2+0.01 else 'ralk' if p<e-2-0.01 else 'ok'
        elif x=='malk':
            e=0.7*h+20
            comp='rac' if p>e+5+0.01 else 'ralk' if p<e-5-0.01 else 'ok'
        elif x=='rac':
            a=24+(p-40)/10; c=24+4*(p-40)/10
            comp='mac' if h<a-2 else 'a' if h<=a+2 else 'ac' if h<c-2 else 'c' if h<=c+2 else 'malk'
        else:
            a=24-2*(40-p)/10; c=24-5*(40-p)/10
            comp='malk' if h>a+2 else 'a' if h>=a-2 else 'p' if h>c+2 else 'c' if h>=c-2 else 'mac'
        if comp in ('rac','ralk','mac','malk'): d.add(comp)
    # anion gap
    mac_kind=None
    agc=None
    if 'na' in g and 'cl' in g:
        ag=g['na']-(g['cl']+h); agc=ag+(0.25*(40-g['alb']) if g.get('alb') is not None else 0)
        high=agc>AGREF+2
        if high:
            mac_kind='HAGMA'; d.add('mac')
            if h<24:
                dr=(agc-AGREF)/(24-h)
                if dr<0.8: mac_kind='HN'
                elif dr>2 and not ('rac' in d and comp=='c'): d.add('malk')
            else:
                if 'rac' not in d: d.add('malk')
        elif 'mac' in d: mac_kind='NAGMA'
    return d,mac_kind,prim,comp,agc
def label(d,mk):
    parts=[]
    if 'mac' in d: parts.append({'HAGMA':'HAGMA','NAGMA':'NAGMA','HN':'HAGMA + NAGMA',None:'metabolic acidosis'}[mk])
    if 'malk' in d: parts.append('metabolic alkalosis')
    if 'rac' in d: parts.append('respiratory acidosis')
    if 'ralk' in d: parts.append('respiratory alkalosis')
    return parts
data=json.load(open(sys.argv[1]))
mism=collections.Counter();ex=[]
for row in data:
    g=row['i'];d,mk,prim,comp,agc=classify(g)
    want=set(label(d,mk))
    # normalise engine label to the same parts
    L=row['label'].lower().replace('high anion gap metabolic acidosis','hagma').replace('normal anion gap metabolic acidosis','nagma')
    L=L.replace('hagma + nagma','hagmanagma')
    got=set()
    for part in ['hagmanagma','hagma','nagma','metabolic alkalosis','respiratory acidosis','respiratory alkalosis','metabolic acidosis']:
        if part in L:
            got.add({'hagmanagma':'HAGMA + NAGMA','hagma':'HAGMA','nagma':'NAGMA'}.get(part,part)); L=L.replace(part,'')
    if L.strip().startswith('normal acid') or row['label']=='Normal acid–base': got=set()
    want2={w if w in('HAGMA','NAGMA','HAGMA + NAGMA') else w for w in want}
    ok=(got==want2) and (row['prim']==('none' if not prim else 'two' if len(prim)==2 else prim[0])) and (len(prim)!=1 or row['comp']==comp) and (agc is None or abs(row['agc']-agc)<1e-6)
    if not ok:
        mism['x']+=1
        if len(ex)<8: ex.append((g,row['label'],sorted(want2),row['prim'],prim,row['comp'],comp))
print('Python reference vs engine: %d gases, %d disagreements'%(len(data),mism['x']))
for e in ex: print(e)
