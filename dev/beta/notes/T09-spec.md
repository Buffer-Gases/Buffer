# T09 — Special groups module (sp-*) + fit with kids/preg

**Covered:** all 7 sp- lessons in c11.js (summary, body, keys, hook, sources, all 35 questions, both worked gases). They were rendered at desktop 1280 (pixel/dark) and phone 390 (pixel/dark, clinical/light), with no horizontal scroll and no console errors from the module. I checked the worked gases with interp(), recomputed every number by hand (Henderson–Hasselbalch, BE, PiO₂, A–a, Sorbini, chronic compensation), and checked the claims against ATS OHS 2019, Grocott 2009, WMS 2019, ACOG CO 348, magnesium toxicity levels (StatPearls) and the age/PaO₂ literature. I also cross-read the kids (c4) and preg (c3) lessons.

**Verdict:** this is a solid, compact module and most numbers are right: the ACOG threshold, Sorbini, age/4+4, PiO₂ at 560 mmHg, the Grocott values, 4 ATA at 30 m, and the chronic OHS compensation. The main problems are the two worked gases, which the engine reads as adult arterial gases and which contradict their own lessons, and one cord-gas question with impossible numbers. The module also has thin citations for dialysis and pregnancy emergencies, and overlaps with the older preg and kids lessons. **Score: 7/10.**

## Critical (0)
None found.

## Major (3)
- **T09-1** · `c11.js` · sp-ohs worked gas (ex) + lesson body 'The gas'
  - What: The worked OHS gas contradicts the lesson. Body and Q5 say uncomplicated OHS has a normal A–a gradient, but ex {pH 7.36, PCO2 55, PO2 58, FiO2 0.21, age 48} gives PAO2 81, A–a 23 against an expected ≤ 16. interp() then reports 'Hypoxaemia with a raised A–a gradient … V/Q mismatch, shunt or diffusion: look at the lungs'.
  - Evidence: page.evaluate interp(L.find(l=>l.id=='sp-ohs').ex) → ox step: 'A–a = 23 (expected ≤ 16 for age 48)'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T09-sp-ohs-phone.png
  - Fix: Change ex.po2 from 58 to 68, which gives A–a ≈ 13 (normal) and still shows hypoxaemia. Alternatively keep 58 and add a line to the body saying that atelectasis in obesity often widens the A–a a little. The first option is cleaner.
- **T09-2** · `c11.js` · sp-neo worked gas (ex)
  - What: The cord-gas worked example is rendered as an adult arterial gas. The slip says 'ARTERIAL · FIO₂ 0.21' and flags PaO2 18 as L against 80–100. 'Open in the Interpreter' / interp() reads it as 'Hypoxaemia with a raised A–a gradient (A–a 42) … Respiratory failure type 2 … look at the lungs'. A normal umbilical artery PO2 is about 15–25 mmHg (fetal blood), so this is wrong teaching. The slip also has no label saying it is a cord artery sample.
  - Evidence: openLesson('sp-neo'); the slip shows PaO2 18 L 80–100. interp(ex) → ox step 'A–a = 42 … V/Q mismatch, shunt or diffusion'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T09-sp-neo-desk.png
  - Fix: Remove po2/fio2 from the sp-neo ex (keep pH, PCO2, HCO3 and BE), or add ex.ctx='cord', which suppresses the oxygen step and the adult reference ranges. Add a caption above the slip: 'Umbilical artery, vaginal delivery after a prolonged bradycardia: mixed acidaemia, pH < 7.0 and BD 13 meet the ACOG threshold.'
- **T09-3** · `c11.js` · XQ['sp-neo'][0]
  - What: The question numbers are internally impossible and the label is doubtful. 'Cord artery pH 7.25, PCO2 70, base deficit 4': by Henderson–Hasselbalch, pH 7.25 with PCO2 70 gives HCO3 ≈ 30 and BE ≈ +3, not BD 4. pH 7.25 is also inside the normal umbilical artery range the lesson teaches (mean ≈ 7.26, lower limit ≈ 7.10), so calling it 'respiratory acidaemia' contradicts the body.
  - Evidence: HCO3 = 0.0307×70×10^(7.25−6.1) = 30.4; BE ≈ 0.93×(30.4−24.4+14.8×−0.15) ≈ +2.9. The body says normal UA pH ≈ 7.26, lower limit 7.10.
  - Fix: Use 'Cord artery pH 7.12, PCO2 75, base deficit 5' (consistent: HCO3 ≈ 23.6, BE ≈ −4.6). Keep the answer 'Respiratory acidaemia, usually benign' and the explanation.

## Minor (12)
- **T09-4** · `c11.js` · sp-ohs sum, body, keys ['Definition','BMI ≥ 30 + PaCO₂ > 45']
  - What: The OHS hypercapnia threshold is written as 'above 45' / '> 45'. ATS 2019 defines it as an awake resting PaCO2 ≥ 45 mmHg at sea level, with sleep-disordered breathing as part of the definition.
  - Evidence: Mokhlesi 2019 ATS guideline (summary: https://sleepreviewmag.com/sleep-disorders/breathing-disorders/obstructive-sleep-apnea/ats-clinical-guideline-obesity-hypoventilation-syndrome/)
  - Fix: Change it to 'PaCO₂ ≥ 45 mmHg (awake, at sea level)' in sum, body and keys ('BMI ≥ 30 + PaCO₂ ≥ 45').
- **T09-5** · `c11.js` · sp-ohs body 'Screening' + XQ['sp-ohs'][0]
  - What: The bicarbonate rule is given without its condition. ATS 2019 recommends HCO3 < 27 to exclude OHS only when suspicion is not very high, and an ABG directly when OHS is strongly suspected. All of its recommendations are conditional.
  - Evidence: Same ATS 2019 source as above.
  - Fix: Body: 'If suspicion is low to moderate, a serum HCO₃⁻ below 27 mmol/L makes OHS unlikely; if suspicion is high, get an arterial gas (ATS 2019).' The Q1 stem can then say '…obese patient with snoring, low clinical suspicion'.
- **T09-6** · `c11.js` · sp-alt sum
  - What: The summary says 'On Everest summit climbers had PaO₂ about 25 and PaCO₂ about 13'. The Grocott 2009 samples were taken at 8,400 m (the Balcony), about 450 m below the summit, as the body and Q4 correctly say.
  - Evidence: Grocott MPW et al. NEJM 2009;360:140–149 (https://pubmed.ncbi.nlm.nih.gov/19129527/; https://acutecaretesting.org/en/journal-scans/blood-gases-on-mount-everest)
  - Fix: Change it to 'At 8,400 m on Everest, climbers had a mean PaO₂ of about 25 and PaCO₂ of about 13 mmHg.'
- **T09-7** · `c11.js` · sp-alt body 'Acclimatisation' and 'Extremes'
  - What: 'Days: renal bicarbonate loss, pH normalises' overstates it. At high altitude the pH moves back towards normal but usually stays alkalaemic (Grocott: pH up to 7.5–7.6 at 8,400 m). 'Descent and oxygen first' is also applied to AMS, HACE and HAPE alike. WMS 2019 says mild AMS can be managed by stopping ascent and resting; descent is mandatory for HACE and severe illness; HAPE is treated with descent or oxygen (nifedipine if neither is possible); and dexamethasone is used for HACE and moderate–severe AMS.
  - Evidence: Luks AM et al. WMS 2019 (already in LSRC as luks19).
  - Fix: Change to 'pH moves back towards normal (often stays slightly alkaline)'. Split the illness line: 'AMS: stop ascending, rest, descend if worse; HACE: descend, oxygen, dexamethasone; HAPE: descend or oxygen, nifedipine if neither.'
- **T09-8** · `c11.js` · sp-elder body + XQ['sp-elder'][0], hook
  - What: The Sorbini line (109 − 0.43 × age) is quoted correctly, but taken past 75 it is misleading. Later studies (Cerveri 1995; Hardie 2004) show that PaO2 in healthy people falls until about 75 and then plateaus around 80–85 mmHg. Sorbini's subjects were also supine. 'At 80, a PaO₂ of 75 may be normal' can make a learner accept real hypoxaemia.
  - Evidence: Sorbini 1968 Respiration 25:3–13; Cerveri et al. AJRCCM 1995; Hardie JA et al. Chest 2004 (https://respiratory-therapy.com/products-treatment/blood-gas-analysis-in-the-elderly-patient/ summarises the post-75 plateau at ≈ 83 mmHg).
  - Fix: Add: 'Sorbini's line was measured supine; after about 75 healthy PaO₂ levels off at roughly 80 mmHg, so do not explain away a value much below 75.' Keep the Q1 arithmetic but add 'by the Sorbini formula' to the hook.
- **T09-9** · `c11.js` · LSRC['sp-dial']
  - What: The dialysis lesson cites kdigo12, which is the KDIGO Acute Kidney Injury guideline. It does not cover chronic haemodialysis acid–base, dialysate bicarbonate or post-dialysis alkalosis.
  - Evidence: c10.js kdigo12 = 'KDIGO clinical practice guideline for acute kidney injury … 2012'
  - Fix: Add a CKD/HD source to SRC, e.g. KDIGO 2024 CKD guideline (Kidney Int 2024;105(4S):S117–S314; metabolic acidosis section) and/or the UK Kidney Association 2023 hyperkalaemia guideline, and use it in LSRC['sp-dial'] in place of kdigo12.
- **T09-10** · `c11.js` · LSRC['sp-pregem']
  - What: No source covers the magnesium toxicity, hyperemesis or ventilation-target claims. The current sources are hegewald11 (physiology) and jbds23 (adult DKA, not pregnancy-specific).
  - Evidence: Sources panel shows 3: West, Hegewald 2011, JBDS 2023.
  - Fix: Add NICE NG133 (Hypertension in pregnancy, magnesium sulfate) or RCOG, RCOG Green-top 69 (nausea, vomiting and hyperemesis gravidarum) and a review of critical-care ventilation in pregnancy (e.g. Lapinsky, Crit Care Med 2005/Chest).
- **T09-11** · `c11.js` · sp-pregem body 'Magnesium for pre-eclampsia'
  - What: The brief asks for magnesium toxicity levels, and the lesson gives none. Learners can't link the clinical signs to the serum level the lab reports.
  - Evidence: StatPearls NBK554553: therapeutic 2.0–3.5 mmol/L (4–7 mEq/L); patellar reflexes lost 4–5 mmol/L; respiratory depression 5–7.5 mmol/L; cardiac arrest 12.5–15 mmol/L.
  - Fix: Add: 'Therapeutic 2–3.5 mmol/L; reflexes lost ≈ 4–5; respiratory depression ≈ 5–7.5; cardiac arrest > 12. Toxicity is likelier with oliguria (renal clearance). Calcium gluconate 10% 10 mL IV over 10 minutes; support ventilation.' Add a key: ['Reflexes lost','Mg ≈ 4–5 mmol/L'].
- **T09-12** · `c11.js` · sp-neo body 'Reading it'
  - What: The ACOG threshold is stated with 'and' (pH < 7.0 and BD ≥ 12). That matches CO 348 (2006), but the later ACOG/AAP Neonatal Encephalopathy and Neurologic Outcome report (2014) uses 'pH < 7.0 and/or BD ≥ 12'. CO 348 is old (reaffirmed 2010; I could not confirm its current status), so cite the 2014 report as well.
  - Evidence: mombaby.org copy of CO 348 'reaffirmed 2010'; ACOG/AAP NENO 2nd ed 2014.
  - Fix: Add the 2014 NENO report to SRC and LSRC['sp-neo'], and word it 'pH < 7.0 and base deficit ≥ 12 (ACOG 2006; the 2014 report accepts either)'. Treat this as something to verify, not a certainty.
- **T09-13** · `c3.js` · preg (title, body 'Altitude' section, q[1])
  - What: There is duplication across modules. The clin lesson 'Normal variants: pregnancy and altitude' teaches altitude (Riyadh, Abha, acetazolamide), which sp-alt now covers in more depth. It also teaches the pregnancy baseline and 'PaCO2 40 = tiring asthma', and sp-pregem repeats both. preg q[0] (asthmatic PaCO2 41) and sp-pregem Q1 (ventilated, PaCO2 40) test the same fact. The two lessons don't contradict each other (27–32 vs 30–32; HCO3 18–21 vs ≈ 20), but a learner meets the same content twice, about 60 lessons apart.
  - Evidence: c3.js:335–349 vs c11.js sp-alt / sp-pregem
  - Fix: Rename preg to 'Pregnancy: normal values' and move its Altitude <h3> block (Riyadh/Abha lines) into sp-alt, which lacks the local cities. Replace its q[1] with a pregnancy item, e.g. 'pH 7.44, PCO2 30, HCO3 20 at 30 weeks: normal for pregnancy'. In sp-pregem, open with 'Baseline: see Pregnancy: normal values' and change Q1 to a ventilator-setting decision, e.g. 'PaCO2 40 on the ventilator: raise the minute ventilation'.
- **T09-14** · `c4.js` · kids body 'Normal values'
  - What: The kids lesson repeats sp-neo almost word for word ('newborns … bicarbonate around 20–22. Capillary gases … fine for pH and PCO₂, not for PO₂'). Neither lesson links to the other.
  - Evidence: c4.js:115 vs c11.js:12
  - Fix: Keep the line in kids, add 'For cord gases and the first days, see Newborns and cord gases', and in sp-neo link back to kids for older children. Better still, move kids and preg into the 'spec' module (set m:'spec') so all the special groups sit together.
- **T09-15** · `c11.js` · SPEC_L (sp-elder, sp-dial, sp-alt, sp-dive, sp-pregem)
  - What: Only 2 of the 7 special-groups lessons have a worked gas (ex). The module is about 'when the normal values move', which is exactly where a worked slip teaches most.
  - Evidence: Learn → Special groups: no 'Worked gas' card on these five lessons.
  - Fix: Add ex gases. sp-dial (pre-dialysis): pH 7.31, PCO2 33, HCO3 16.5, Na 136, Cl 100, K 6.1, alb 34 (AG ≈ 19.5; Winter's 32.75 ± 2 fits). sp-alt (Abha resident): pH 7.44, PCO2 32, HCO3 21.5, PO2 66, patm-dependent (or note 'set Settings → Altitude to Abha'). sp-pregem (Mg toxicity): pH 7.28, PCO2 48, HCO3 22, PO2 85. sp-elder (age 82): pH 7.41, PCO2 40, HCO3 25, PO2 78 (A–a ≈ 22, normal for age). Verify each with interp() before shipping.

## Polish (6)
- **T09-16** · `c11.js` · sp-alt body 'Set the barometric pressure in Settings'
  - What: The wording doesn't match the UI. The Settings row is called 'Altitude' and offers only three presets (sea level, Riyadh 707, Abha 580), so 'your city' can't be set unless it is one of these.
  - Evidence: ui3.js:155 selRow('sAlt','Altitude',…)
  - Fix: Say 'Choose your altitude in Settings → Altitude (sea level, Riyadh or Abha)'. See the related idea about a custom value.
- **T09-17** · `c11.js` · sp-dive body 'Hyperbaric oxygen'
  - What: 'dissolved oxygen alone can meet basic needs' at 2.4 ATA is borderline. Dissolved O2 ≈ 0.003 × ~1,600 ≈ 4.8 mL/dL, about resting extraction. Boerema's 'life without blood' experiments were at 3 ATA.
  - Evidence: PAO2 at 2.4 ATA, FiO2 1.0 ≈ 2.4×760 − 47 − 40/0.8 ≈ 1,727 mmHg
  - Fix: Say 'dissolved oxygen alone approaches resting needs (≈ 5 mL/dL)' and add the arithmetic as a teaching line.
- **T09-18** · `c11.js` · XQ['sp-ohs'][2] explanation
  - What: 'Loss of hypoxic drive and V/Q changes raise PaCO₂' puts hypoxic drive first. The current consensus (BTS 2017) is that worsening V/Q matching (release of hypoxic pulmonary vasoconstriction) and the Haldane effect are the main mechanisms, and reduced drive is a minor one.
  - Evidence: O'Driscoll 2017 BTS guideline (odriscoll17, already in LSRC)
  - Fix: Change it to 'Mainly worse V/Q matching (loss of hypoxic vasoconstriction) and the Haldane effect; reduced drive contributes less.'
- **T09-19** · `c11.js` · XQ['sp-dial'][3]
  - What: 'Where should blood never be taken in a haemodialysis patient? … The foot / The finger' has throwaway distractors. The stem is also too absolute: dialysis staff do draw blood from the fistula needles during sessions.
  - Evidence: Rendered sp-dial question 4
  - Fix: Reword it as 'Outside dialysis, which site must not be used for venepuncture, cannulas or blood pressure?' with distractors 'The non-fistula forearm', 'A hand vein on the other side', 'The dorsum of the foot'. Explanation: 'Protect the access; also preserve the non-dominant arm veins in CKD.'
- **T09-20** · `c11.js` · sp-neo body 'Taking cord gases'
  - What: Practical details are missing: the cord has two arteries and one vein; a double-clamped segment stays stable for about 60 minutes; validated paired criteria are an arteriovenous pH difference ≥ 0.02 and a PCO2 difference of about 4–5 mmHg (the body says 'several mmHg').
  - Evidence: mombaby.org local protocol based on CO 348 (segment usable up to 60 min after clamping)
  - Fix: Add: 'two arteries, one vein'; 'analyse within 60 minutes of clamping'; 'valid pair: artery − vein pH ≥ 0.02 lower and PCO2 ≥ 4 mmHg higher'.
- **T09-21** · `c11.js` · sp-dial body 'Missed dialysis'
  - What: The emergency hyperkalaemia sequence leaves out nebulised salbutamol, and that IV insulin-glucose in anuric patients carries a higher risk of late hypoglycaemia.
  - Evidence: UK Kidney Association hyperkalaemia guideline 2023
  - Fix: Change it to 'IV calcium, insulin with glucose (watch glucose for 6 h: high hypoglycaemia risk in dialysis patients), salbutamol, then urgent dialysis.' This also fits sim-hyperk in c12.

## Ideas (ranked by value)
22. **T09-22** · `c11.js` · sp-* lessons (TEACH, WEB_NODES): None of the 7 special-groups lessons has a 'Teach it back' entry or concept-web nodes, so the 'Connect it' card never appears. Other modules have them. Fix: Add teach-back prompts (e.g. 'Explain why cord artery and vein must differ') and web nodes linking sp-ohs → racid/copd, sp-alt → PiO₂ lesson (c1) and ralk, sp-pregem → preg/dka, sp-dial → renalfail/icu-rrt.
23. **T09-23** · `ui3.js` · Settings → Altitude (sAlt): Allow a custom barometric pressure (or an altitude in metres converted with the standard atmosphere), so sp-alt's advice to set your city works for any place, e.g. Taif ≈ 1,880 m or Denver. Fix: Add an 'Other…' option with a number input (mmHg) or a metres field: Pb = 760 × (1 − 2.25577e−5 × h)^5.2559.
24. **T09-24** · `c11.js` · sp-neo: Add cord lactate (UA lactate > 6–8 mmol/L is linked to adverse outcome) and a paired artery/vein mini-drill: two slips, and the user picks 'valid pair / both venous / swapped'. Fix: Add a key ['Cord lactate','> 6 abnormal (local cut-offs vary)'] and an XQ item or a small widget that shows paired slips.
25. **T09-25** · `e1.js` · KINDS.ralk_c variants 'preg' and 'alt': Generated cases for pregnancy and altitude send the learner to the 'preg' lesson for both (KLESSON maps by kind). With the new module, the altitude variant should open sp-alt. Fix: Allow a per-variant lesson override, e.g. variant tuple {o:'n',les:'sp-alt'}, and use it in the 'learn more' link.
26. **T09-26** · `c12.js` · CASES: Only ch-cord and sim-hyperk cover this module. Add cases or sims for: an OHS patient made worse by high-flow oxygen; a diver with AGE; a pregnant asthmatic with PaCO2 40; magnesium toxicity on the labour ward; and HAPE at altitude. Fix: Add 3–5 chat or sim cases using the same src keys (mokhlesi19, vann11, hegewald11, luks19).
27. **T09-27** · `c11.js` · sp-dive: Add the practical diving points: DCS can appear up to 24 h after a dive; no flying for at least 24 h after a dive, and casualty transport should stay low (helicopter < 300 m or a cabin pressurised to sea level); and give oral fluids without glucose, or isotonic IV fluids. Fix: Add these to the Emergencies section and add one XQ item on transport altitude.

## Verified correct (no change needed)
- sp-neo ex: Henderson–Hasselbalch is consistent (pH 6.98); BE −13.1 meets BD ≥ 12. ACOG thresholds in Q2 are right.
- sp-elder: 109 − 0.43×80 = 74.6; 80/4+4 = 24.
- sp-ohs: the chronic rule gives 24 + 0.4×15 = 30 and the ex is consistent (pH 7.365).
- sp-alt: 0.21×(560−47) = 107.7; 2,500 m ≈ 108–110; 5,000 m (405 mmHg) ≈ 75; Grocott mean PaO₂ 24.6 / PaCO₂ 13.3 at 8,400 m.
- sp-dive: 30 m = 4 ATA; Henry's law; HBO PaO₂ > 1,000 (≈ 1,700 calculated).
- sp-pregem: pregnancy PaCO₂ and HCO₃⁻ baselines match c3 preg (no contradiction); calcium gluconate is the antidote; thiamine before glucose.
- Citations for Sorbini, Mokhlesi, Grocott, ACOG 348, Vann and Hegewald are correctly formatted.

Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T09-sp-neo-desk.png, T09-sp-ohs-desk.png, T09-sp-alt-desk.png, T09-sp-pregem-desk.png, T09-sp-ohs-phone.png, T09-sp-alt-phone-clinical-light.png
