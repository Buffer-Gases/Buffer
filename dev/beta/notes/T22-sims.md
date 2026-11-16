# T22 — Timed simulations (sim-dka, sim-sepsis, sim-asthma, sim-hyperk, sim-vent)

## Summary
Covered: the sim engine in ui8.js (simNew, simVit, simGas, simAdvance, simAct, simEnd, simRender, simDebrief) and the five sims in c12.js. I tested the clock (1 sim-minute every 3 s, confirmed), Pause, Wait 5 min, action costs, delayed results, warnings, harms, endings and arrest. I scripted 9 play styles per sim in headless Chromium (optimal, optimal then wait, slow, everything in list order, everything reversed, nothing, tests only, harm first, late keys). I also tested reload, browser Back/Forward, app tab switching, hidden-tab pause, focus, and phone, tablet, desktop and wide widths in both skins and both themes. I checked the clinical content against JBDS 02 (2023), SSC 2021, BTS/SIGN 158 and UKKA hyperkalaemia, and ran the sim gases through interp().

Verdict: the sims look good and the core loop works: the clock, pause and hidden-tab pause, delayed results, the timeline and the key-step table. No JS errors. But the physiology model has a basic flaw. vit0/gas0 act as the sev-0 floor while every sim starts at sev 30–50, so the monitor and first gas do not match the vignette (the asthmatic shows HR 88, RR 21, GCS 10 at minute 0). Treated patients can never normalise, and every patient eventually arrests even after perfect care. Endings ignore the target times, and clicking every button in any order wins all five sims. Treatments act instantly. Gas values all move with one number, so calcium lowers K, FiO₂ never changes and DKA K never falls. Two sims cite the wrong guideline (KDIGO AKI for hyperkalaemia; no asthma guideline). The debrief is clear but thin, and its table overflows on phones.

Score: **4/10** (good shell; the model needs a rework before the endings teach the right thing).

Counts: critical 6, major 14, minor 11, polish 4, idea 8

Scripts used (re-runnable): /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t22/strat.py, ui.py, ui2.py, edge.py, interp2.py; raw strategy output in strat.json.

## Critical

**T22-1** · `ui8.js` · simVit / simGas (all 5 sims)  
Monitor and first gas do not match the vignette. vit0/gas0 are used as the sev=0 anchor, but every sim starts at sev0=30-50, so the patient is already lerped far toward vit1 at minute 0. Asthma at 00:00 shows HR 88, RR 21, SBP 89, SpO2 80, GCS 10 (intro: HR 132, RR 34, SpO2 90, talking). Sepsis: HR 137, SBP 65, SpO2 88, GCS 10 (intro: 126, 78/42, confused). Hyperkalaemia: HR 35 (intro 48), SBP 110 (intro 150). Vent: SpO2 72, HR 79 (intro 84%, 118). DKA: GCS 13 for an alert patient.  
*Evidence:* page.evaluate: openCase(id);simVit() at t=0 for each sim; screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-vent-tablet-light.png (SpO2 73 vs intro 84%). Arithmetic: asthma HR = 132+(44-132)*0.5 = 88.  
*Fix:* Use three anchors per variable: well (sev 0), presentation (sev = sev0) and arrest (sev 100), and interpolate piecewise: f<sev0 -> lerp(well, pres, sev/sev0); f>=sev0 -> lerp(pres, arrest, (sev-sev0)/(100-sev0)). Add vitW/gasW (normal values) to each sim in c12.js and make vit0/gas0 the exact intro values.

**T22-2** · `ui8.js` · simVit / simGas: recovery  
A treated patient can never get better than the presentation, because vit0/gas0 are the floor. After optimal sepsis care (sev 10) the 'Stabilised for ICU' patient still has SBP ~75, HR ~128 and lactate ~6.4; a fully treated asthmatic (sev 2) shows HR 130, RR 34, SpO2 90; DKA pH can never exceed 7.15 nor K fall below 5.2. Worse, in asthma, improving severity RAISES HR and RR back to 132/34, so getting better looks like getting worse.  
*Evidence:* strat.py optimal runs: sepsis end sev 10.2 -> simVit sbp 75; asthma end sev 2.3 -> HR 130, RR 34; simGas(0) for sim-dka gives K 5.2, pH 7.15.  
*Fix:* Same three-anchor model as above (well values at sev 0: e.g. sepsis SBP 115, lactate 1.5; asthma HR 90, RR 16, PaCO2 38). For non-monotonic signs (asthma RR and HR rise then fall with exhaustion) give a per-variable curve, e.g. an array of [sev,value] knots interpolated piecewise.

**T22-3** · `c12.js` · sim-asthma gas0/sev0 + end[arrest].d  
The asthma sim's key teaching ('A normal PaCO2 in a struggling asthmatic was the warning') can never be seen: because sev starts at 50 the first ABG shows PaCO2 ~64 mmHg, pH 7.17 (near-fatal, hypercapnic), and the engine reads it as respiratory acidosis plus 'added metabolic acidosis'. The title says 'life-threatening' but the gas is near-fatal (raised PaCO2, BTS/SIGN).  
*Evidence:* simGas(50) for sim-asthma: pH 7.17, PCO2 64, HCO3 22.8; ABG ordered at 6 min in optimal play still 53.6 mmHg. interp() comp step: 'HCO3 too low: added metabolic acidosis'. BTS/SIGN 158 acute asthma table: normal PaCO2 4.6-6.0 kPa = life-threatening; raised PaCO2 = near-fatal.  
*Fix:* After the anchor fix, make the presenting ABG PaCO2 ~42-44 (normal, life-threatening) and let it climb only if under-treated; add a debrief line that compares the first PaCO2 with later ones.

**T22-4** · `ui8.js` · simEnd: ending selection  
Endings ignore the target times. keysOK only checks that each key action was done at some time, so late care still earns the success ending: DKA insulin at 63 min -> 'Stabilised and on the ward pathway'; vent disconnect/bag at 11 min (target 3) and DOPES at 12 min -> 'Stabilised and proned'; sepsis antibiotics at 60 min with severity 59 -> 'Stabilised for ICU'. The table shows them late, the headline says success.  
*Evidence:* ui2.py LATE runs: {'dka insulin at 70': 'Stabilised and on the ward pathway', at insulin 63}; {'vent ... no DOPES timely': 'Stabilised and proned', bag 11, look 12}.  
*Fix:* Compute onTime = keys with CS.at[k.a]<=k.by; success ending only if all keys on time (or allow 1 late non-critical key) AND sev<50; add a middle ending 'Stabilised, but late' listing the late steps; mark some keys critical:true (e.g. calcium, bag, antibiotics) so lateness of those forces the lesser ending.

**T22-5** · `ui8.js` · simAct / balance: do everything  
You can 'win' every sim by clicking every button in any order. Clicking all actions top-to-bottom, or in reverse order, finishes in 12-19 sim-minutes with the success or 'with a detour' ending in all five sims; pressors before fluid, antibiotics before cultures and calcium before ECG only add a timeline line. Harmful actions in sepsis (bicarbonate) and hyperkalaemia (furosemide) have no effect on the ending at all.  
*Evidence:* strat.py: everything_in_list_order and reversed_all -> DKA 'Stabilised, with a detour', sepsis 'Stabilised for ICU' (harm bicarb), asthma 'Rescued after sedation', hyperk 'Stabilised for dialysis' (harm furo), vent 'Stabilised, with trapping'.  
*Fix:* Make wrong-order and unnecessary actions cost something: (1) harm/warn adds severity (e.g. +5) and a debrief penalty; (2) add a per-sim score = on-time keys - harms - warnings - unnecessary actions; (3) every sim should have a harm ending (add harm:bicarb for sepsis, harm:furo for hyperk, harm:kcl for DKA); (4) include actions that are only right in some variants so blanket clicking fails.

**T22-6** · `ui8.js` · simAdvance: drift  
Drift is only ever multiplied by dm (<1), never made zero or negative, so every patient keeps deteriorating after perfect treatment and eventually arrests if you keep pressing 'Wait 5 min' (DKA 443 min, sepsis 199 min, asthma 153 min, hyperK 494 min, vent 137 min). It teaches that a correctly treated DKA dies on the ward at 7 h.  
*Evidence:* strat.py optimal_long: Peri-arrest t=443, Cardiac arrest t=199, Respiratory arrest t=153, Cardiac arrest t=494, Hypoxic arrest t=137 (drift after optimal care 0.20-0.70/min).  
*Fix:* Give treatments a drift delta instead of a multiplier, letting drift go negative (recovery) once the core treatments are in, e.g. drift += a.dd; clamp sev at 0. Optionally end the sim automatically with the success ending when sev < 20 for 10 min ('Ready for handover').

## Major

**T22-7** · `c12.js` · sim-dka actions insulin.reqMsg / kcl.bad / gas0-gas1 k  
Potassium model and wording are wrong for JBDS. (a) K is lerped 5.2->6.4 with severity, so it can only fall to 5.2: insulin never causes hypokalaemia and the core JBDS lesson (add 40 mmol/L KCl once K is 3.5-5.5, usually in the second litre) can never be practised; KCl is not a key step. (b) insulin.reqMsg says 'It was 5.2 this time' but the gas at sev 30 shows K 5.6-5.7 (above 5.5, so no KCl).  
*Evidence:* simGas(30).k = 5.6; screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-dka-mid-desk.png shows K 5.7 H while the insulin warning claims 5.2. JBDS 02 single-page pathway (Mar 2023): K >5.5 none; 3.5-5.5 add 40 mmol/L; potassium is likely to be needed in the second litre. https://abcd.care/sites/abcd.care/files/site_uploads/JBDS_Guidelines_Current/JBDS_02_Single_page_pathway_March_2023.pdf  
*Fix:* Model K separately: K falls ~0.3-0.5 mmol/L per 30 min after insulin starts (and with fluids), so by 60-90 min it drops below 5.5; make KCl a key step 'when K <=5.5' with harm if K>5.5 and harm 'hypokalaemia' if K<3.5 and no KCl. Fix reqMsg to quote the live K (template: 'It was '+k+' this time').

**T22-8** · `ui8.js` · simAct req check  
'req' warnings test whether the prerequisite was ORDERED, not whether its result has come back. Ordering a VBG (3-min delay) and starting insulin or KCl one minute later raises no warning, though the K is still unknown; same for proning right after ordering the ABG.  
*Evidence:* Browser: openCase('sim-dka'); click vbg at 8', insulin at 9'; events: '8 test Venous gas','9 tx Fixed-rate insulin','11 res Result: Venous gas' with no warning.  
*Fix:* Change the check to CS.res.some(r=>r.id===req) (result received), and say in the message 'the gas was still pending'.

**T22-9** · `c12.js` · sim-hyperk src  
Hyperkalaemia sim cites only 'kdigo12', which is the KDIGO 2012 Acute Kidney Injury guideline, not a hyperkalaemia guideline. The UK Kidney Association hyperkalaemia guideline (the doses used) is not cited anywhere.  
*Evidence:* c10.js: kdigo12:['KDIGO AKI 2012',...]; Sources in debrief for 'Resus 4' list only the AKI guideline.  
*Fix:* Add a source to c5.js SRC, e.g. ukka23:['UKKA 2023','UK Kidney Association. Clinical practice guideline: treatment of acute hyperkalaemia in adults, updated 2023.'] and set src:['ukka23'] for sim-hyperk.

**T22-10** · `c5.js` · SRC: asthma sources (sim-asthma src)  
Asthma sim cites davidson16 (BTS/ICS guideline on ventilation for acute HYPERCAPNIC respiratory failure, which does not cover acute asthma) and BTS oxygen 2017; there is no acute asthma guideline in the registry at all.  
*Evidence:* grep c5.js: no SIGN/BTS asthma key; sim-asthma src:['davidson16','odriscoll17'].  
*Fix:* Add bts19:['BTS/SIGN 158','British Thoracic Society/Scottish Intercollegiate Guidelines Network. British guideline on the management of asthma (SIGN 158), 2019 (acute asthma section retained in BTS/NICE/SIGN 2024).'] to SRC and use src:['bts19','odriscoll17'] in c12.js sim-asthma.

**T22-11** · `c12.js` · sim-hyperk actions gluc / ca  
Hyperkalaemia treatment details differ from UKKA: (a) 'Capillary glucose hourly after insulin' - UKKA checks glucose at 0, 15/30, 60, 90, 120, 180, 240, 300, 360 min (more often than hourly early on, when hypoglycaemia peaks); (b) calcium has max 1 but UKKA advises repeating after 5 min if ECG changes persist (often needed at K 7-8); (c) no 10% glucose 50 mL/h for 5 h rule (pre-treatment glucose <7.0); (d) no potassium binder (sodium zirconium cyclosilicate 10 g TDS); (e) no repeat K at 60 min.  
*Evidence:* UKKA hospital algorithm (July 2022 v2): 'Consider a further dose after 5 minutes if ECG changes persist'; monitoring at 0,30,60,90,120,180,240,300,360... min; SZC 10 g TDS 72 h. https://www.ukkidney.org/sites/default/files/APPENDIX%206%20-%20HYPERKALAEMIA%20ALGORITHM%20-%20HOSPITAL%20-%20REVISED%20-%20JULY%202022%20-%20V2.pdf  
*Fix:* Relabel to 'Glucose checks per UKKA (0, 15, 30, 60, 90, 120 min, then hourly to 6 h)'; give ca max:2 with a second-dose prompt if the ECG is unchanged; add actions 'Repeat K+ at 60 min' (test), 'Sodium zirconium cyclosilicate 10 g' (tx) and a glucose 10% infusion option; set glu in gas to 6.5 in a variant so the glucose rule matters.

**T22-12** · `ui8.js` · simGas (K tied to severity) / sim-hyperk ca  
Every gas value follows the single severity number, so calcium gluconate (eff -15) LOWERS the measured potassium. Calcium stabilises the myocardium; it does not change K. Similarly oxygen lowers lactate and K.  
*Evidence:* openCase('sim-hyperk'); simGas(CS.sev).k = 7.8; simAct('ca') -> 7.7 despite 2 min of drift; with an isolated eff the drop is 0.17 mmol/L.  
*Fix:* Separate 'stability' (vitals/arrest risk) from lab drivers: give each action an optional per-variable effect (e.g. ins: {k:-0.8 over 30 min}, dial: {k:-2 over 2 h}), and have calcium change only the arrhythmia risk, not K.

**T22-13** · `ui8.js` · simGas fio2  
FiO2 on every slip is frozen at gas0 value: giving oxygen, hand-ventilating on 100% or 'Increase PEEP to 14 and FiO2 to 0.8' still prints FiO2 0.60, so P/F (the proning decision) is wrong after any change. Asthma ABG shows FiO2 0.40 even if no oxygen was given ('SpO2 90% on air'); sepsis ABG shows FiO2 0.21 after 'Oxygen to SpO2 94-98%'.  
*Evidence:* Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-vent-tablet-light.png: ABG ordered after bagging on 100% reads 'ARTERIAL · FIO2 0.60'. ui8.js: k==='fio2'?a:...  
*Fix:* Track CS.fio2 as state: start at the intro value (0.21 for asthma/sepsis, 0.6 vent), set it from actions (o2 -> 0.4, bag -> 1.0, peep -> 0.8), store it in the gas at ordering time, and raise PaO2 accordingly so P/F is meaningful.

**T22-14** · `ui8.js` · simEnd: harm endings  
Harm endings ignore severity: with keys done plus bicarbonate, waiting until sev 95 gives 'Stabilised, with a detour - He improved'; asthma with sedation at sev 95 gives 'Rescued after sedation - She survived'. Meanwhile keys done but sev >= 75 falls through to 'Handed over incomplete - Key steps were missing', which is false (no keys were missing).  
*Evidence:* edge.py: DKA [95, 222, 'Stabilised, with a detour']; asthma [95, 55, 'Rescued after sedation']; sepsis keys done, sev 80 -> 'Handed over incomplete', d 'Some bundle elements were late or missing'.  
*Fix:* Apply the sev<75 test to harm endings too; add an ending for keys-done-but-still-unstable ('Still unstable at handover: the treatment was right but not enough/too late').

**T22-15** · `c12.js` · sim-sepsis bicarb label and harm text  
Bicarbonate is labelled 'for pH 7.2' and the harm says it is not suggested 'with pH >= 7.2', but because of the sev0 offset the presenting ABG pH is 7.17 (<7.2). SSC 2021 actually suggests bicarbonate for pH <= 7.2 WITH AKI stage 2-3, and has no recommendation against below 7.2 otherwise; the sim punishes it with a message that does not apply to the pH on screen.  
*Evidence:* simGas(45): pH 7.17. Evans L et al. SSC 2021, recommendation on bicarbonate (weak, against for pH >= 7.2; suggest for pH <= 7.2 and AKIN 2-3).  
*Fix:* Either fix the gas so pH is 7.22-7.27 at presentation (anchor fix) or change the harm text to: 'Not suggested for hypoperfusion lactic acidaemia unless pH <= 7.2 with AKI stage 2-3; it treats the number, not the shock (SSC 2021).' Show creatinine so learners can apply the rule.

**T22-16** · `c12.js` · sim-dka fluid max:3, sim-hyperk dial, all eff  
Treatments act instantly and fluid 'over 1 h' can be given 3 times in 6 minutes (3 L in 6 min) with the full benefit each time. Dialysis ('call renal') cuts drift to 20% the moment it is clicked; insulin-glucose and Mg act the same minute. This is the main reason the sims are easy.  
*Evidence:* strat.py optimal DKA finishes in 14 min with 3 L given; hyperk dial dm 0.2 immediate.  
*Fix:* Give treatments onset and duration (onset minutes and effect spread over time: e.g. fluid 1 L over 60 min -> eff applied 1/60 per min; insulin onset 15 min; dialysis onset 90-120 min); lock repeat litres until the previous one has run ('next litre available at 60 min').

**T22-17** · `shell.html` · .tbl in sim debrief (Key steps table)  
On a 390 px phone the debrief key-step table (.tbl min-width:420px, no scroll wrapper) pushes the page to 462 px wide: horizontal page scroll and the 'You' column sits outside its card.  
*Evidence:* Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-vent-debrief-phone-dark.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-vent-debrief-phone-clin-light.png are 462/461 px wide at viewport 390.  
*Fix:* Wrap the table in <div class="tblwrap" style="overflow-x:auto"> in simDebrief (ui8.js) or add '.card .tbl{min-width:0}' with word wrapping for the Target column ('by 120 min' on one line via white-space:nowrap).

**T22-18** · `ui8.js` · simRender (every tick)  
The whole sim view is rebuilt with innerHTML every 3 seconds, so keyboard focus is lost each tick (focus on 'Blood ketones' -> document.body after 3.3 s), a press in progress can land on a replaced button, and screen readers get no announcement (no aria-live region for results/events).  
*Evidence:* ui2.py: focus before/after tick 'ket' -> 'BODY:'; document.querySelectorAll('#v-cases [aria-live]').length = 0.  
*Fix:* Render the shell once and update only the clock, vitals, sevbar, results and events nodes on tick; keep action buttons stable; add aria-live='polite' to the results and events lists and announce new results.

**T22-19** · `ui8.js` · openCase / route / caseLib entry: sim persistence  
A running sim is lost silently in several ways: page reload restarts it at 00:00 with nothing done; browser Back then Forward restarts it at 00:00 (route() calls openCase because VIEW!=='cases'); 'Open the library' on Practice sets CS=null; '← Cases' abandons with no confirm. None record the attempt.  
*Evidence:* ui.py: after reload CS {t:0, done:{}} (was t=3 with abg, cult); after back/forward {id:'sim-asthma', t:0} (was t=1); after #openCases CS=None.  
*Fix:* Persist CS for sims (minus the case object) in sessionStorage on every advance and restore on load; in route() do not restart if CS.c.id matches; confirm before abandoning a running sim; show a 'Resume sim (00:12)' tile on Practice.

**T22-20** · `c12.js` · sim-vent actions peep / plat  
'Increase PEEP to 14 and FiO2 to 0.8' is rewarded (eff -6) even though the measured plateau is 28 cmH2O: in volume control +4 PEEP raises plateau to ~32, above the 30 limit (ARDSNet). The plateau result is static text, so it never shows this; there is no airway-pressure display at all in a sim that starts with a peak-pressure alarm.  
*Evidence:* c12.js sim-vent plat txt fixed 'Plateau 28 cmH2O, PEEP 10'; peep eff -6 with no warn.  
*Fix:* Make plateau = 18 + PEEP (+ change with TV) and show peak/plateau on the monitor; warn if PEEP is raised with plateau >= 28 without reducing TV; reward 'tv' plus PEEP together.

## Minor

**T22-21** · `c12.js` · sim-sepsis cult txt  
The cultures result always says 'Cultures taken before antibiotics.' even when they were taken after antibiotics, directly beside the warning 'Antibiotics went in before cultures'.  
*Evidence:* edge.py: abx then cult -> results ['Cultures taken before antibiotics.'] and event warning about antibiotics first.  
*Fix:* Make the text conditional in simAct (e.g. a.txtIf:{abx:'Cultures taken after antibiotics: yield is lower.'}) or neutral: 'Two sets of blood cultures taken.'

**T22-22** · `c12.js` · sim-sepsis key / vitals  
Only systolic BP is shown, but the bundle target is MAP >= 65 (the noradrenaline button says 'to MAP >= 65'). Intro BP 78/42 = MAP 54. Also the noradrenaline target 'by 90 min' is lenient for the hour-1 bundle, and 'Repeat ABG and lactate' (bundle: re-measure lactate if >2) is not a key step.  
*Evidence:* simRender vitals: vt('BP',v.sbp,'sys'). SSC hour-1 bundle (Levy 2018) and SSC 2021.  
*Fix:* Show BP as sys/dia with MAP (add dbp to vit0/vit1); set nor by:60; add {a:'lac2',by:120} to sepsis key.

**T22-23** · `c12.js` · sim-dka key insulin by:60  
JBDS 2023 starts the fixed-rate insulin infusion at T=0 with the fluids; a 60-min target teaches delay. The bolus '500 mL (SBP < 90)' can be given at SBP >= 90 without a warning.  
*Evidence:* JBDS 02 single-page pathway 2023: 'FRIII ... Start at T=0 at 0.1 units/kg/hr'.  
*Fix:* Set insulin by:15 (after the K is back) and add bad:{ifSBP:'>=90'} style warning to fluidbolus.

**T22-24** · `c12.js` · sim-dka ecg/ket txt  
Static result texts contradict the live data: ECG says 'Sinus tachycardia 120' while the monitor shows 129-131; ketones text says glucose 29 while the VBG shows 31.7-32.5. 'Peaked T waves? No.' reads like a note to self.  
*Evidence:* Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-dka-mid-desk.png (HR 129, glucose 32.5).  
*Fix:* Template result texts from the live state ('Sinus tachycardia '+v.hr+'. No peaked T waves.'); take glucose from simGas.

**T22-25** · `c12.js` · sim-hyperk actions  
Patient is SpO2 91% on air and breathless lying flat (fluid overload) with bradycardia 48 and broad QRS, but there is no oxygen action and no bradycardia option (atropine/pacing pads) to choose or to warn about.  
*Evidence:* c12.js sim-hyperk actions list.  
*Fix:* Add 'Oxygen to 94-98%' (tx) and 'Pacing pads on, atropine 500 mcg if bradycardia worsens' (tx), plus a CPAP option for the pulmonary oedema while waiting for dialysis.

**T22-26** · `c12.js` · sim-asthma actions  
Missing BTS/SIGN elements: peak expiratory flow (defines severity, <33% = life-threatening) is not a test; ipratropium dose is absent ('0.5 mg'); no senior escalation drugs (IV aminophylline / IV salbutamol); neb repeats are not time-gated (3 back-to-back in 6 min with full effect).  
*Evidence:* BTS/SIGN 158 acute asthma: PEF, ipratropium 0.5 mg 4-6 hourly, Mg 1.2-2 g over 20 min, aminophylline after senior review.  
*Fix:* Add 'PEF' test (result: 'Unable' or 28% best), label 'salbutamol 5 mg + ipratropium 0.5 mg', add aminophylline as senior-only option, gate repeat nebs to every 15 min or offer 'continuous nebs'.

**T22-27** · `c12.js` · sim-vent DOPES coverage / prone  
DOPES is the stated ending lesson but only Displacement/Obstruction are actionable; there is no check for Pneumothorax (ultrasound/chest movement) or Equipment (circuit, O2 supply). Proning costs 5 min and 'Stabilised and proned' can happen at minute 12, whereas PROSEVA proned after 12-24 h of stabilisation, for >=16 h sessions, with P/F <150 at FiO2 >=0.6.  
*Evidence:* c12.js sim-vent actions; Guerin 2013 NEJM 368:2159.  
*Fix:* Add 'Lung ultrasound for pneumothorax' and 'Check circuit and O2 supply' tests as keys by 5 min; change prone label to 'Plan prone positioning (P/F <150 after optimisation)' and model it as a decision with cost 20-30 min.

**T22-28** · `ui8.js` · simEnd: harms without endings  
KCl given at K >5.5 (DKA), bicarbonate (sepsis) and furosemide (hyperK) are recorded as harms but no ending mentions them; the success headline is shown as if clean.  
*Evidence:* strat.py reversed_all DKA harm ['bicarb','kcl'] ending names only bicarbonate; sepsis/hyperK harms -> plain success.  
*Fix:* Add a generic fallback: if any harm and keysOK, append 'with a detour: '+harm list to the success ending text.

**T22-29** · `ui8.js` · simWait / Pause  
'Wait 5 min' advances time while paused, and actions also advance time while paused; the only paused indicator is the button label. The clock also cannot be changed: S.ui.simPace is read but there is no setting.  
*Evidence:* ui.py: paused 6.5 s t 3->3, then Wait -> t 8, still paused.  
*Fix:* Show a 'PAUSED' badge over the monitor; either disable actions/Wait while paused or state 'Pause stops the clock; actions still take time'. Expose simPace (2/3/5 s per minute) in Settings.

**T22-30** · `ui8.js` · simRender #simEnd  
'Hand over' ends the sim with one tap and no confirm (it sits next to Wait); a mistap at 00:00 produces a full fail debrief and a recorded attempt.  
*Evidence:* ui.py: openCase('sim-hyperk'); click #simEnd -> 'Handed over incomplete' at 0 min, S.cases recorded.  
*Fix:* Confirm when key steps are still missing ('2 key steps not done. Hand over anyway?').

**T22-31** · `ui8.js` · simRender results card  
When no result has arrived yet the card says only 'Nothing back yet. Waiting on 1.' with no test name or time left; the named list with minutes appears only after the first result.  
*Evidence:* Text seen after ordering VBG: 'Nothing back yet. Waiting on 1.'  
*Fix:* Always show the pending list: 'Waiting on: Venous gas (2 min)'.

## Polish

**T22-32** · `ui8.js` · simGas rounding  
Na and Cl print with a decimal on the slip (Na 132.2, Cl 96.6, Cl 102.2) because every numeric is rounded to 0.1; analysers report Na/Cl/K to integers (K 1 dp).  
*Evidence:* Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-dka-mid-desk.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-vent-tablet-light.png.  
*Fix:* Round na, cl to integers and k, lac, glu to 1 dp in simGas.

**T22-33** · `ui8.js` · simDebrief severity chart  
The 'How unwell over time' chart has no time axis or labels, an unexplained grid line at severity 75 (the success threshold), is 300 px wide centred on desktop, and is blank when handing over at 0 min. Key-step times and harms are not marked on it.  
*Evidence:* Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-sepsis-debrief-desk.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-hyperk-handover0.png.  
*Fix:* Draw it full width with 0/end-minute labels, label the 75 line ('unstable'), add markers (dots with labels) at each key action and red marks at harms, and hide the chart when t<2.

**T22-34** · `ui8.js` · simRender vit GCS in vent  
GCS 3 is flagged red in the ventilated, sedated ICU patient where it is expected; it adds alarm noise.  
*Evidence:* Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T22-vent-tablet-light.png.  
*Fix:* Per-sim vital set: in sim-vent show RASS (or 'sedated') plus peak pressure and EtCO2 instead of GCS.

**T22-35** · `c12.js` · sim titles  
Titles are numbered 'Resus 2: DKA', 'Resus 1: septic shock', but the library lists them in data order DKA (2) first, then sepsis (1).  
*Evidence:* c12.js order: sim-dka then sim-sepsis; caseLib list order follows CASES.  
*Fix:* Reorder the entries so Resus 1 comes first, or drop the numbers.

## Ideas (ranked by value)

**T22-36** · `ui8.js` · sim engine: per-variable physiology  
Replace the single severity scalar with a few hidden state variables (e.g. volume, acidosis, K, oxygenation, perfusion) that drive vitals and gas, each with its own drift and treatment effects. That makes order matter (insulin before fluid drops BP; calcium does not lower K) and makes the gas a real readout to act on.  
*Evidence:* Current: all vitals and gas fields lerp from one CS.sev.  
*Fix:* Add CS.x={vol,acid,k,ox,...}; actions declare effects per variable with onset/duration; vitals/gas computed from x via simple formulas.

**T22-37** · `c12.js` · sim variants  
Randomised variants per run so learners must read the gas: DKA with K 3.1 (insulin must wait for KCl), sepsis with pH 7.15 + AKI (bicarbonate becomes reasonable), vent with a pneumothorax instead of a plug, hyperK with glucose 5 (10% glucose needed).  
*Evidence:* Today every run is identical, so the second play is memory.  
*Fix:* Add variants:[{p:0.3,gas0:{k:3.1},keyAdd:[...],harmIf:...}] and pick one in simNew.

**T22-38** · `ui8.js` · scoring and difficulty  
Add a score and three difficulties: Learn (pause allowed, hints on wrong order), Shift (real pace, no hints), Exam (results hidden until you request, nurse interruptions, a second patient). Store best score per sim.  
*Evidence:* Ending is binary; S.cases.best is 0/1.  
*Fix:* score = 100 - 10*late keys - 15*harms - 5*warnings - 2*unneeded tests; show in debrief and Progress.

**T22-39** · `ui8.js` · arrest branch  
When severity hits 100, run a short ALS loop (rhythm, shocks, adrenaline, 4Hs/4Ts linked to the sim cause: hyperK -> calcium, asthma -> disconnect/ decompress) instead of ending, so arrest is a teaching moment and an ER doctor practises it.  
*Evidence:* simEnd('arrest') ends immediately.  
*Fix:* On arrest, switch actions to an ALS set for 10 sim-minutes; ROSC if the reversible cause is treated.

**T22-40** · `ui8.js` · reassessment prompts  
Require reassessment: after each treatment a nurse prompt ('BP now 84/50, what next?') and penalties for treating without looking (repeat gas, repeat ECG). Tie 'Repeat gas' to an interpretation question using the app's interp engine.  
*Evidence:* Currently repeat gases are optional and never questioned.  
*Fix:* Every N minutes push a prompt event; offer a one-question interpretation of a new gas, scored into the debrief.

**T22-41** · `ui8.js` · debrief: gas trend and missed teaching  
In the debrief show every gas taken (mini slips side by side with arrows), the warnings/harms in a separate 'What to change' box with the guideline line and source, and an ideal timeline for comparison.  
*Evidence:* Debrief currently has only headline, chart, key table and raw timeline.  
*Fix:* Add sections 'Your gases', 'What to change' (CS.ev filtered warn/harm with src) and 'Model run' (key actions at target times).

**T22-42** · `ui8.js` · vitals noise and alarms  
Add small random noise to vitals, alarm sounds/flash when thresholds are crossed (respecting quiet mode), and trend arrows; a static number that steps by 1 each 3 s is easy to ignore.  
*Evidence:* simVit is deterministic.  
*Fix:* vit += Math.round((rand-0.5)*2) per tick for HR/RR; arrows from last 5 min; quiet-mode-safe visual alarm.

**T22-43** · `c12.js` · more sims  
Add sims that the app's gas skills drive: salicylate overdose (mixed disorder, avoid intubation without hyperventilation), COPD on oxygen (target 88-92, NIV), toxic alcohol, hyperchloraemia after saline, CO poisoning, post-arrest care.  
*Evidence:* 5 sims today.  
*Fix:* Reuse the variant/physiology engine; cite BTS/ICS 2016 for COPD NIV, AACT/EXTRIP for salicylate.

## Sources checked
- JBDS 02 DKA single-page pathway, March 2023: https://abcd.care/sites/abcd.care/files/site_uploads/JBDS_Guidelines_Current/JBDS_02_Single_page_pathway_March_2023.pdf
- UKKA hyperkalaemia hospital algorithm, revised July 2022: https://www.ukkidney.org/sites/default/files/APPENDIX%206%20-%20HYPERKALAEMIA%20ALGORITHM%20-%20HOSPITAL%20-%20REVISED%20-%20JULY%202022%20-%20V2.pdf
- Evans L et al., Surviving Sepsis Campaign 2021 (Crit Care Med 2021;49:e1063); hour-1 bundle (Levy 2018).
- BTS/SIGN 158 (2019) acute asthma (from knowledge; not re-fetched).
- ARDSNet 2000; Guérin (PROSEVA) 2013.
