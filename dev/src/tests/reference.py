"""Executable specification of the Boston rules as Buffer applies them (Winter's, 0.7xHCO3+20, 1/4 and 2/5,
AG + 0.25x(40-alb), delta ratio from the predicted baseline). It follows the same decision rules as the JS
engine, so it catches coding slips (rounding, branches), not errors in the rules themselves.
Classifies each gas, then compares with the engine's output dumped by run.js (node tests/run.js dump).
5.0 (D23): also venous gases (read on estimated arterial values, gap on the measured HCO3, never an oxygenation read)
and oxygenation from the alveolar gas equation, A-a, P/F and the room-air limits (see oxygen()).
Exit code 1 on any disagreement, so tests/gate.sh can use it."""
import json,math,sys,collections
AGREF=12
def rd(x): return math.floor(x+0.5)            # JS Math.round: whole mmHg as displayed
def r1(x): return math.floor(x*10+0.5)/10
def r2(x): return math.floor(x*100+0.5)/100
def classify(g):
    ph,p,h=g['pH'],g['pco2'],g['hco3']; hm=h
    if g.get('sample')=='v':  # venous: estimated arterial values (pH +0.03, PCO2 -5 floored at 10, HCO3 -1); the gap keeps the measured HCO3
        ph=math.floor((ph+0.03)*1000+0.5)/1000; p=max(10,p-5); h=r1(h-1)
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
    # Buffer 5.0 rules: bands are judged on displayed numbers (whole mmHg; HCO3 to 0.1),
    # the gap is read before compensation, and the delta baseline is the HCO3 the other process predicts.
    agc=None; high=False; rise=None
    if 'na' in g and 'cl' in g:
        ag=r1(g['na']-(g['cl']+hm)); agc=r1(ag+(0.25*(40-g['alb']) if g.get('alb') is not None else 0))
        high=agc>AGREF+2; rise=r1(agc-AGREF)
    comp=None; base=24
    if len(prim)==1:
        x=prim[0]; hh=r1(h)
        if x=='mac':
            e=1.5*h+8
            comp='rac' if rd(p)>rd(e+2) else 'ralk' if rd(p)<rd(e-2) else 'ok'
        elif x=='malk':
            e=0.7*h+20
            comp='rac' if rd(p)>rd(e+5) else 'ralk' if rd(p)<rd(e-5) else 'ok'
        elif x=='rac':
            a=r1(24+(p-40)/10); c=r1(24+4*(p-40)/10)
            if hh<r1(a-2): comp,base='mac',a
            elif hh<=r1(a+2): comp,base='a',a
            elif hh<r1(c-2): comp,base='ac',hh
            elif hh<=r1(c+2): comp,base='c',c
            else: comp,base='malk',c
        else:
            a=r1(24-2*(40-p)/10); c=r1(max(14,24-5*(40-p)/10))
            if hh>r1(a+2): comp,base='malk',a
            elif hh>=r1(a-2): comp,base='a',a
            elif high:  # low HCO3 is the high-gap acidosis: judge PCO2 by Winter's
                comp,base='mac',24; e=1.5*h+8
                if not rd(p)<rd(e-2): d.discard('ralk')
            elif hh>r1(c+2): comp,base='p',hh
            elif hh>=r1(c-2): comp,base='c',c
            else: comp,base='mac',24
        if comp in ('rac','ralk','mac','malk'): d.add(comp)
    mac_kind=None
    if agc is not None:
        if high:
            mac_kind='HAGMA'; d.add('mac')
            dH=r1(base-h)
            if dH>=2:
                dr=r2(rise/dH)
                if dr<0.8: mac_kind='HN'
                elif dr>2: d.add('malk')
            elif rise>=6: d.add('malk')
        elif 'mac' in d: mac_kind='NAGMA'
    return d,mac_kind,prim,comp,agc
def label(d,mk):
    parts=[]
    if 'mac' in d: parts.append({'HAGMA':'HAGMA','NAGMA':'NAGMA','HN':'HAGMA + NAGMA',None:'metabolic acidosis'}[mk])
    if 'malk' in d: parts.append('metabolic alkalosis')
    if 'rac' in d: parts.append('respiratory acidosis')
    if 'ralk' in d: parts.append('respiratory alkalosis')
    return parts
def oxygen(g,patm):
    """Oxygenation from the textbook formulas (West, Respiratory Physiology; ARDS Definition Task Force, JAMA 2012):
    alveolar gas equation PAO2 = FiO2 x (Patm - 47) - PaCO2/0.8; A-a = PAO2 - PaO2, normal <= age/4 + 4
    (Buffer calls it raised above that +5, or above 20 with no age); P/F = PaO2/FiO2 with Berlin cut-offs 300/200/100.
    Room-air hypoxaemia: PaO2 below 80 (100 - age/3 over 60), scaled by the inspired PO2 for altitude; on oxygen, below 60.
    A PaO2 more than 10 above the alveolar PO2 is impossible."""
    f=g.get('fio2',0.21); po2=g['po2']
    PA=f*(patm-47)-g['pco2']/0.8; Aa=PA-po2; pf=po2/f
    lim=(g['age']/4+4+5) if g.get('age') is not None else 20
    raised=rd(Aa)>rd(lim)
    hypT=(min(80,100-g['age']/3) if g.get('age') is not None and g['age']>60 else 80)*(patm-47)/713
    if f<=0.22:
        hyp=rd(po2)<rd(hypT)
        cat='hv' if hyp and not raised else 'lung' if hyp else 'lungmild' if raised else 'normal'
    else:
        cat='pf' if rd(pf)<=300 else 'normal'
    return dict(cat=cat,PA=PA,Aa=Aa,pf=pf,implaus=Aa<-10)
data=json.load(open(sys.argv[1]))
mism=collections.Counter();ex=[]
oxrows=[r for r in data if r.get('kind')=='ox']; data=[r for r in data if r.get('kind')!='ox']
oxbad=0;oxex=[]
for row in oxrows:
    want=oxygen(row['i'],row['patm']); got=row['ox']
    ok=got is not None and got['cat']==want['cat'] and bool(got['implaus'])==want['implaus'] and all(abs(got[k]-want[k])<1e-6 for k in ('PA','Aa','pf')) \
       and (('ox-implausible' in row['flags'])==want['implaus'])
    if not ok:
        oxbad+=1
        if len(oxex)<6: oxex.append((row['i'],row['patm'],got,want))
print('Python oxygenation vs engine: %d gases, %d disagreements'%(len(oxrows),oxbad))
for e in oxex: print(e)
venous=[r for r in data if r['i'].get('sample')=='v']
vbad=[r for r in venous if r.get('ox') is not None]
print('Venous gases: %d, %d with an oxygenation read (must be 0)'%(len(venous),len(vbad)))
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
print('Python reference vs engine: %d gases (%d venous), %d disagreements'%(len(data),len(venous),mism['x']))
for e in ex: print(e)
sys.exit(1 if (mism['x'] or oxbad or vbad) else 0)
