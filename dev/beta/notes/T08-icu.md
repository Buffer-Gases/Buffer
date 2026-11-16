# T08: ICU module and Ventilator lab (Buffer 4.9.0 beta)

## Summary
**What I covered:**
- All 11 icu-* lessons in c10.js: body text, key numbers, hooks, the two worked gases (run through interp()), all 55 questions and their sources.
- The ventilator lab (W.vent, ventCalc and the vqSolve it reuses in e3.js).
- Checked against SSC 2021, ARDSNet 2000, PROSEVA, EOLIA, Amato 2015, ATS 2017 and the 2024 update (Qadir), VASST, SOAP II, ANDROMEDA-SHOCK, Yang & Tobin, ERC–ESICM 2021/2022, KDIGO and the citrate reviews.
- Ran a 37-setting grid through ventCalc in the frozen build (normal, ARDS, asthma and COPD presets; extreme rates, I:E, PEEP, tidal volumes, heights, FiO₂). The script and output are in scratchpad/t08/grid.py and grid.json.
- Rendered the lab at 390, 820, 1280 and 1440 px in pixel/dark and clinical/light, and the lessons at desktop and phone width.
- No JS errors (only offline font fetch failures). No horizontal scroll at any width.

**Verdict:**
- **Lesson content:** accurate and well cited. Every number I checked matches its source: ARDSNet 31 vs 39.8%, PROSEVA 16 vs 32.8%, EOLIA 35 vs 46%, ANDROMEDA 34.9 vs 43.4%, RSBI 105, PBW formula, vasopressin at NA 0.25–0.5, hydrocortisone threshold, ERC SpO₂ 94–98 / PaCO₂ 35–45 / fever 37.7 °C for 72 h, citrate ratio > 2.5, AEIOU. All 55 questions have a single defensible correct answer and the arithmetic is right. The gaps are currency (the 2024 ATS ARDS update, the 2022 temperature guidance) and some imprecise trial attributions.
- **Ventilator lab:** looks good and gets the mechanics right (time-constant auto-PEEP, PBW, peak vs plateau numbers). However, the gas side has real physiology errors:
  - PaO₂ ignores hypoventilation, and can exceed PAO₂.
  - In asthma and COPD, faster rates "blow off" CO₂ to a pH of 7.79.
  - PEEP can never change driving pressure.
  - ARDS comes out hypocapnic.
  - Presets leak settings into one another.
  - The waveform has no plateau.

**Score: 7/10** (lessons 8.5, ventilator lab 5.5).

## Findings

### Critical
- **T08-1** `e3.js` · ventCalc → vqSolve (PaO₂)
  - **Problem:** PaO₂ is decoupled from the PaCO₂ the lab displays. vqSolve keeps mixed-venous PCO₂ fixed at 46, so its alveolar PCO₂ can never go above about 46. Hypoventilation therefore never lowers PaO₂, and PaO₂ can come out above the alveolar PO₂ (physically impossible). This teaches the opposite of the alveolar gas equation, a core exam concept.
  - **Evidence:** Normal lungs, TV 500, rate 6, FiO₂ 21%: PaCO₂ 83, pH 7.15, PaO₂ 79. The alveolar gas equation gives PAO₂ = 0.21×713 − 83/0.8 = 46, so PaO₂ must be ≤ 46. COPD, rate 8, FiO₂ 30%: PaCO₂ 88, PaO₂ 106, but PAO₂ = 214 − 110 = 104. Normal, TV 250, rate 6, FiO₂ 40%: PaCO₂ 200, PaO₂ 89 (PAO₂ ≈ 35). Script: scratchpad/t08/grid.py.
  - **Fix:** Feed the displayed PaCO₂ into the oxygen solve. Either add an optional o.paco2 to vqSolve/vqUnit and use fac = paco2/(pb−47) in both units, or set PvCO₂ = paco2 + 6 for this call. As a minimum, clamp pao2 ≤ PAO₂(fio2, paco2) − (the A–a from vqSolve). Add a check: normal lung, rate 6, air → PaO₂ about 40.

### Major
- **T08-2** `e3.js` · ventCalc: obstructive lungs, rate ↑
  - **Problem:** In severe asthma and COPD, raising the rate keeps lowering PaCO₂ however severe the air trapping, down to absurd values. The lab rewards "increase the rate to blow off CO₂", which the icu-obst lesson marks as the wrong answer. Dynamic hyperinflation has no effect on gas exchange or circulation in the model; it only adds 4% shunt.
  - **Evidence:** Asthma, TV 500, PEEP 5, I:E 1:1. Rate 30: auto-PEEP 13, PaCO₂ 20, pH 7.67. Rate 40: auto-PEEP 18.7, PaCO₂ 15, pH 7.79. No alarm mentions the alkalaemia. Screenshot: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-asthma-rr30.png. Contradicts the icu-obst question 1 distractor and question 2.
  - **Fix:** Make trapped volume cost ventilation. Add dead space for hyperinflation and overdistension (for example vdFrac += 0.015×ape, capped), and add a cardiac-output fall that raises dead space when ape > 10. The real-world result is that PaCO₂ plateaus or rises with rate. Add a "rate up, CO₂ not falling: trapping" alarm.
- **T08-3** `e3.js` · ventCalc: driving pressure vs PEEP
  - **Problem:** Compliance is fixed, so driving pressure = TV/C whatever the PEEP. In ARDS, raising PEEP from 5 to 24 raises plateau one-for-one, with no recruitment gain in compliance and no overdistension. The alarm "lower the tidal volume or find a better PEEP" can never be met by PEEP, and PaO₂ only improves with PEEP. Amato 2015 shows the opposite: PEEP helps when it lowers ΔP.
  - **Evidence:** ARDS, TV 420, rate 22: ΔP is 16.8 at PEEP 5, 10, 14, 18 and 24. PaO₂ is 68 → 80 → 98 → 138 → 138, and plateau is 22 → 41.
  - **Fix:** Use an effective compliance that rises with recruitment and falls with overdistension, for example C_eff = C×(1 + 0.5×recruitedFraction) × (1 − overdist), where overdist rises once PEEP + TV/C goes above about 25–28 cmH₂O. Let overdistension add dead space so PaCO₂ rises. Students then find a "best PEEP" with the lowest ΔP.
- **T08-4** `e3.js` · ventCalc return bp / hypoTV; W.vent alarms
  - **Problem:** Circulatory effects are computed and then thrown away. r.bp is "falling" when PEEP > 18 or auto-PEEP > 10, but it is never shown; hypoTV is calculated and never used. High PEEP on any lung gives no warning at all.
  - **Evidence:** Normal lungs, PEEP 24: bp = "falling", plateau 32, but the only alarm is plateau > 30. hypoTV appears only in its own declaration at e3.js:141.
  - **Fix:** Show a "BP / venous return" stat (ok / falling), driven by r.bp and hypoTV. Add the alarm "PEEP above 18: watch blood pressure; check recruitability". Delete hypoTV if it stays unused.
- **T08-5** `e3.js` · VPAT.ards (vd, h)
  - **Problem:** The ARDS lung has too little dead space, so ARDS patients come out hypocapnic. Total Vd/Vt at 6 mL/kg is about 0.52 (anatomic 0.37 + 0.15). Early ARDS averages about 0.58 and higher (Nuccio 2002 NEJM 346:1281), and lung-protective ventilation usually runs PaCO₂ 45–60. The lesson's own worked gas (PaCO₂ 52, pH 7.28) cannot be reproduced at standard settings.
  - **Evidence:** ARDS preset (TV 500, rate 22): PaCO₂ 29, pH 7.48. At 6 mL/kg (420 mL), rate 22: PaCO₂ 39. You need about rate 14 to reach 52.
  - **Fix:** Raise VPAT.ards.vd to about 0.25–0.30, consider VCO₂ 220–250 for sepsis-driven ARDS, and set h to 24. Target: 6 mL/kg, rate 22–26 → PaCO₂ about 45–55.
- **T08-6** `e3.js` · W.vent preset buttons
  - **Problem:** Presets carry settings over from the last preset, so the same preset gives different results depending on the order clicked. ARDS does not set I:E or tidal volume; asthma does not set FiO₂ or tidal volume; no preset sets tidal volume to the PBW target.
  - **Evidence:** Click Severe asthma, set I:E to 1:1, then click ARDS: I:E stays at 1:1 and TV stays at 500 (7.1 mL/kg). Screenshot: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-ards-after-asthma.png.
  - **Fix:** Make each preset set every control: tv (ARDS round(6×PBW/10)×10; others 7 mL/kg), rr, peep, fio2 and ie. Optionally, a separate "Start at protective settings" button.
- **T08-7** `c10.js` · icu-ards body/keys
  - **Problem:** The ARDS lesson stops at the 2017 ATS/ESICM/SCCM guideline. The 2024 ATS update (Qadir et al., AJRCCM 2024) adds: corticosteroids (conditional for), higher PEEP without recruitment manoeuvres, a strong recommendation against prolonged recruitment manoeuvres, NMBA in early severe ARDS (conditional) and VV-ECMO in selected severe ARDS (conditional). The lesson cites Berlin 2012 but never defines ARDS (timing, bilateral opacities, P/F bands 300/200/100 on PEEP ≥ 5). The 2023 global definition (Matthay, AJRCCM 2024) adds SpO₂/FiO₂ and high-flow oxygen.
  - **Evidence:** c10.js:36 and LSRC icu-ards. Source checked: https://escholarship.org/uc/item/5c98w95h (Qadir 2024 abstract).
  - **Fix:** Add a "Definition" block (Berlin bands, plus a note on the 2023 global definition). Add bullets: corticosteroids (conditional, ATS 2024); "no prolonged recruitment manoeuvres (strong)". Add SRC qadir24 and matthay24 to LSRC icu-ards. Consider one question on steroids or recruitment manoeuvres.
- **T08-8** `e3.js` · W.vent waveform path
  - **Problem:** The pressure–time trace does not teach what the lessons teach. (1) There is no inspiratory pause, so peak and plateau are not visibly different, yet "peak minus plateau = airways" is the core point of icu-vent1 and icu-trouble. (2) Each breath starts at PEEP + auto-PEEP, which draws a vertical step from set PEEP; a real airway-pressure trace starts from set PEEP, and auto-PEEP is seen only on an expiratory hold. (3) The resistive step is drawn as 0.6×(peak − plat) instead of the full R×flow.
  - **Evidence:** Asthma, rate 30, I:E 1:1: a vertical jump from 5 to 18 cmH₂O at each breath start, and no plateau segment. Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-asthma-rr30.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-desk-dark.png.
  - **Fix:** Draw each breath as: start at set PEEP → near-instant rise to PEEP + ape + R×flow → linear rise to peak at end of ti → 0.3–0.5 s pause at plateau (labelled) → drop to set PEEP. Add "Insp hold" and "Exp hold" buttons that reveal plateau and total PEEP. Add a flow–time trace in which expiratory flow does not return to zero when ape > 0.

### Minor
- **T08-9** `e3.js` · ventCalc hco3
  - **Problem:** The acute HCO₃⁻ shift is 0.1 per mmHg in both directions and is unbounded. The app's own rule for acute respiratory alkalosis is 2 per 10, and acute buffering cannot add 16 mmol/L.
  - **Evidence:** Normal lungs, TV 250, rate 6: PaCO₂ 200 → HCO₃⁻ 40, pH 6.92. TV 900, rate 40: PaCO₂ 5.8, pH 8.17.
  - **Fix:** Use hco3 = h + (paco2 > 40 ? 0.1 : 0.2)×(paco2 − 40), with the rise capped at about +5 and the fall at about −8. Clamp displayed PaCO₂ to about 15–150 and add an "outside model range" note.
- **T08-10** `e3.js` · W.vent alarms
  - **Problem:** There are no alarms for hypocapnia or alkalaemia (outside the COPD case), for PEEP below 5, or for a peak above 40 (the peak stat turns red but no text explains why).
  - **Evidence:** Normal preset: pH 7.49, PaCO₂ 31 with "Settings look protective for this patient". Asthma rate 30: pH 7.67 in red, but no alarm text.
  - **Fix:** Add alarms: "PaCO₂ below 35 / pH above 7.50: lower the minute ventilation (hypocapnia constricts cerebral vessels)"; "PEEP below 5: add PEEP to prevent collapse"; "Peak above 40: check the peak–plateau gap (airways vs lung)".
- **T08-11** `e3.js` · W.vent alarm "Plateau above 30"
  - **Problem:** When plateau is high because of auto-PEEP, the advice is still "lower the tidal volume", even though driving pressure is normal and the cause is trapping.
  - **Evidence:** Asthma, rate 40, I:E 1:1: plateau 34, ΔP 10, auto-PEEP 18.7 → "Plateau above 30: lower the tidal volume."
  - **Fix:** If ape > 5 and plat > 30, say "Plateau high from trapped air: lengthen expiration first".
- **T08-12** `e3.js` · W.vent stats "driving pressure"
  - **Problem:** The displayed driving pressure is plateau − set PEEP − auto-PEEP, but the label and the lesson define it as plateau − PEEP. A learner checking the numbers sees a mismatch, and total PEEP is never shown.
  - **Evidence:** Asthma, rate 30: plateau 28, PEEP 5, driving pressure shown as 10 (28 − 5 = 23).
  - **Fix:** Add a "total PEEP" stat (set + auto). Label the stat "driving pressure (plateau − total PEEP)", and add one line to icu-vent1/icu-obst about total PEEP.
- **T08-13** `e3.js` · W.vent run(): thresholds vs display
  - **Problem:** Alarms compare unrounded values but display rounded ones, so the screen says "plateau 30" next to the alarm "Plateau above 30".
  - **Evidence:** ARDS preset: plateau 30.05 is shown as 30 and triggers the alarm (see the ARDS-after text dump in scratchpad/t08 output).
  - **Fix:** Round once (const pl = Math.round(r.plat)) and use that value for both the display and the comparisons. Do the same for ΔP, peak and pH.
- **T08-14** `e3.js` · W.vent defaults (normal preset)
  - **Problem:** The default normal patient is over-ventilated (500 × 16 = 8 L/min → PaCO₂ 31, pH 7.49), yet the verdict says "Settings look protective". It is the first thing every user sees.
  - **Evidence:** Screenshot: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-desk-dark.png. Rate 12 gives PaCO₂ 42, pH 7.39.
  - **Fix:** Default rate 12 (and the normal preset rate 12–14). Have the verdict mention CO₂ when PaCO₂ is outside 35–45.
- **T08-15** `e3.js` · vqSolve fio2 cap
  - **Problem:** FiO₂ 100% is silently treated as 95% (Math.min(0.95, …)), so the lab under-reads PaO₂ at 100%.
  - **Evidence:** Normal lung, FiO₂ 100%: PaO₂ 571, where the expected value at 3% shunt is about 620–640.
  - **Fix:** Allow fio2 up to 1.0 in vqSolve (protect the gas term against division by zero: use (1 − fio2) ≥ 0.001), or show "FiO₂ capped at 95% in this model".
- **T08-16** `e3.js` · ventCalc shunt += 0.04 when ape > 8
  - **Problem:** Auto-PEEP is modelled as adding shunt. Its real effects are dead space (overdistension, falling output) and hypotension, not shunt.
  - **Evidence:** e3.js:140.
  - **Fix:** Replace with a dead-space increment (see the finding on obstructive lungs) and the bp effect.
- **T08-17** `e3.js` · ventCalc plat = peep + ape + tv/C
  - **Problem:** External PEEP adds fully to total PEEP even in flow-limited COPD and asthma. Physiologically, applied PEEP up to about 75–85% of intrinsic PEEP does not raise total PEEP (the waterfall effect), which is the basis of matching PEEP in COPD.
  - **Evidence:** COPD preset: raising PEEP from 5 to 10 raises plateau by 5 even with auto-PEEP present.
  - **Fix:** For copd (and asthma, optionally) use totalPEEP = max(peep, ape + small fraction of peep) when flow-limited, and add a note in the lab and in icu-obst. Mark this as a simplification if it is not modelled.
- **T08-18** `c9.js` · lesson widget map add{} for icu-ards / icu-obst
  - **Problem:** The ventilator lab embedded in icu-ards and icu-obst opens on "Normal lungs", so the learner has to find the right preset themselves.
  - **Evidence:** openLesson('icu-ards'): the embedded lab shows Normal lungs, pH 7.49. Screenshot: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-icu-ards-desk.png.
  - **Fix:** Let W.vent.build accept an initial patient (for example add map entries ['vent', {pat:'ards'}] and ['vent', {pat:'asthma'}]), and click that preset on build.
- **T08-19** `c10.js` · icu-ards body: prone bullet
  - **Problem:** PROSEVA figures are paired with "at least 12 h a day", but PROSEVA used sessions of at least 16 h. The "> 12 h" figure is the ATS 2017 recommendation. PROSEVA enrolment also required FiO₂ ≥ 0.6, PEEP ≥ 5, after 12–24 h of stabilisation.
  - **Evidence:** c10.js:36. Guérin 2013 NEJM 368:2159.
  - **Fix:** Reword to: "Prone for at least 12 h a day (ATS 2017; PROSEVA used ≥ 16 h) when P/F is below 150 on FiO₂ ≥ 0.6 and PEEP ≥ 5 (PROSEVA: 28-day mortality 16.0% vs 32.8%)."
- **T08-20** `c10.js` · icu-rosc body: fever bullet
  - **Problem:** Fever prevention applies to patients who remain comatose, and the temperature advice was updated in the 2022 ERC–ESICM temperature-control guideline after TTM2. The lesson gives no context on whether to cool to 32–36 °C.
  - **Evidence:** c10.js:52 ("Prevent fever above 37.7 °C for at least 72 h"). Nolan 2021; Sandroni 2022 Intensive Care Med 48:261.
  - **Fix:** Change to "In patients who remain comatose, prevent fever (above 37.7 °C) for at least 72 h", add "ERC–ESICM 2022: active fever prevention; no recommendation for routine cooling to 32–36 °C", and add sandroni22 to SRC/LSRC.
- **T08-21** `c10.js` · icu-obst question 4 explanation
  - **Problem:** The explanation ignores the acute fall in HCO₃⁻ when PaCO₂ is lowered (the app's own rule is 2 per 10 for acute alkalosis), so the pH is overstated. The answer is still correct.
  - **Evidence:** PaCO₂ 60 → 40 means HCO₃⁻ falls about 4 to 32, so pH = 6.1 + log(32/1.2) ≈ 7.53, not 7.58.
  - **Fix:** Change the explanation to: "HCO₃⁻ stays near 36 (it falls only about 2–4 acutely): pH ≈ 7.53–7.58, a severe alkalosis."
- **T08-22** `c10.js` · icu-trouble question 1 and body
  - **Problem:** "Disconnect and bag on 100% oxygen" has no caveat. In severe ARDS on high PEEP, disconnection derecruits the lung; use a bag with a PEEP valve, or a clamp, and minimise disconnections. This is not wrong for the exam, but it is incomplete for shift use.
  - **Evidence:** c10.js:43–45, 96.
  - **Fix:** Add a line to the body: "On high PEEP (ARDS) use a PEEP valve on the bag and keep the disconnection brief."
- **T08-23** `c10.js` · LSRC icu-obst / icu-trouble
  - **Problem:** The sources do not match the topics. Asthma ventilation is sourced only to BTS/ICS 2016 (a COPD/NIV hypercapnic-failure guideline) and Hickling. Adult ventilator troubleshooting is sourced only to APLS, a paediatric course.
  - **Evidence:** c10.js:59.
  - **Fix:** Add an asthma ventilation source, for example Leatherman J. Mechanical ventilation for severe asthma. Chest 2015;147:1671–1680 (verify the citation before adding). Add an adult source to icu-trouble (for example the ICS/FICM guidance or a critical care textbook chapter).

### Polish
- **T08-24** `c10.js` · icu-ards body: EOLIA bullet
  - **Problem:** The EOLIA figure does not state its endpoint.
  - **Evidence:** c10.js:36 "35% vs 46%".
  - **Fix:** Change to "60-day mortality 35% vs 46%, p = 0.09".
- **T08-25** `c10.js` · icu-press body: hydrocortisone
  - **Problem:** The wording differs slightly from SSC 2021, which says "at a dose of noradrenaline or adrenaline ≥ 0.25 µg/kg/min at least 4 h after initiation", with hydrocortisone typically 50 mg IV every 6 h.
  - **Evidence:** c10.js:28 and question 5 at c10.js:80.
  - **Fix:** Reword to: "Hydrocortisone 200 mg/day (50 mg IV 6-hourly) when noradrenaline or adrenaline is still ≥ 0.25 µg/kg/min at least 4 h after starting."
- **T08-26** `c10.js` · icu-fluids body/question 4
  - **Problem:** SSC 2021 wording is "at least 30 mL/kg within the first 3 h"; the lesson says "about". The phrase "adjust for heart and kidney failure" is not in SSC and should be marked as clinical practice.
  - **Evidence:** c10.js:24, 74.
  - **Fix:** Use "at least 30 mL/kg (SSC 2021, weak, low quality)" and "reassess often; be cautious in heart or kidney failure".
- **T08-27** `c10.js` · icu-rrt question 4 option text
  - **Problem:** "Reduce the citrate dose" is right but vague; on a regional citrate circuit the citrate dose is tied to blood flow.
  - **Evidence:** c10.js:114.
  - **Fix:** Add to the explanation: "lower the citrate-to-blood-flow ratio, raise effluent or dialysate, or lower the bicarbonate in the fluids".
- **T08-28** `shell.html` · .stats small (text-transform: uppercase)
  - **Problem:** Units are uppercased: "ML/KG PBW", "CMH₂O", "PACO₂ MMHG". ML means megalitre, and the chemical symbols are corrupted.
  - **Evidence:** Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-desk-dark.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-phone.png.
  - **Fix:** Remove text-transform: uppercase from .stats small (use letter-spacing instead), or wrap units in <span style="text-transform:none">.
- **T08-29** `e3.js` · W.vent stats labels
  - **Problem:** The driving pressure and auto-PEEP stats have no unit, and minute ventilation has one, which is inconsistent.
  - **Evidence:** The stats row in any screenshot.
  - **Fix:** Label them "driving pressure cmH₂O" and "auto-PEEP cmH₂O".
- **T08-30** `shell.html` · .ventw
  - **Problem:** The SVG scales with width, so at 1280 px wide the 320×120 viewBox becomes about 970×365 px: the "30" and "airway pressure, 2 breaths" labels render at about 30 px and the trace dominates the screen. It is a dark-only monitor in the light/clinical skin, which is fine as a monitor look, but the label colour #9fb0c0 is hard-coded.
  - **Evidence:** Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-desk-dark.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T08-vent-asthma-rr30.png (clinical light).
  - **Fix:** Use .ventw{max-height:220px} with preserveAspectRatio="none" on the path group (or a wider viewBox at width ≥ 700). Set the label font in px with vector-effect, or render the labels as HTML outside the SVG.

## Ideas (ranked by value)
1. **T08-31** `e3.js` · W.vent: Add a flow–time trace, plus inspiratory-hold and expiratory-hold buttons. Seeing expiratory flow fail to reach zero, and pressing "expiratory hold" to read total PEEP, is the bedside skill the lessons describe. Fix: Add a second SVG (flow), and buttons that freeze the trace and show plateau or total PEEP.
1. **T08-32** `e3.js` · W.vent: Add a guided "crash after intubation" scenario in the asthma preset: rate 28 → auto-PEEP builds over breaths → BP falls → a "Disconnect" button empties the chest and BP recovers. This links directly to icu-obst question 1. Fix: A small state machine on top of ventCalc using r.bp, with a 10-breath animation.
1. **T08-33** `e3.js` · W.vent: Add an ARDSNet PEEP/FiO₂ table overlay (lower and higher PEEP) showing where the current settings sit, plus an SpO₂ readout, so learners practise the oxygenation targets of 55–80 mmHg / 88–95%. Fix: Show a small table and highlight the matching row; add an SpO₂ stat from satP(pao2).
1. **T08-34** `e3.js` · W.vent: Add a pressure-control mode (set the pressure; tidal volume = C×ΔP×(1 − e^(−ti/τ))) to make icu-vent1's "tidal volume falls if the lung stiffens" interactive. Fix: Add a mode toggle; reuse the time-constant maths.
1. **T08-35** `c10.js` · ICU module coverage: Missing high-yield ICU acid–base topics: bicarbonate in septic metabolic acidosis (SSC 2021: suggest bicarbonate when pH ≤ 7.2 with AKI stage 2–3; BICAR-ICU), timing of RRT (STARRT-AKI 2020: no benefit from accelerated start), paired SAT/SBT (ABC trial) and the cuff-leak test with steroids, and oxygen targets in ICU (avoid hyperoxia). Fix: Add bullets or questions to icu-press (bicarbonate), icu-rrt (timing) and icu-wean (SAT+SBT, cuff leak), with sources.
1. **T08-36** `c10.js` · icu-ards ex: The ARDS worked gas has no PEEP, although the lesson says to "record P/F with the PEEP". The interpreter's cause list for this respiratory acidosis offers drive, pump or airways, but not "deliberate low-volume ventilation (permissive hypercapnia)". Fix: Add peep:12 to ex if the engine supports it. In e1.js, when the context is ventilated (fio2 ≥ 0.4 and an ICU lesson or flag), add "permissive hypercapnia on lung-protective settings" to the causes.

## Checked and correct (no action)
- icu-shock: the worked gas is internally consistent (pH 7.24, Winter 22–26, corrected AG 25.7, Δ ratio 1.04). All four shock types and the ScvO₂ pattern are right.
- icu-perf: the CO₂ gap > 6 mmHg (Ospina-Tascón 2013); ANDROMEDA figures; the adrenaline lactate mechanism.
- icu-fluids: PLR ≥ 10% (Monnet 2016); about half of patients are responders; balanced crystalloids (SMART).
- icu-press: noradrenaline first and peripheral start; vasopressin 0.03 U/min at NA 0.25–0.5; SOAP II arrhythmias; VASST; dobutamine or adrenaline for cardiac dysfunction.
- icu-vent1: PBW formula and question 1 (75.1 kg); ΔP < 15; the MV × PaCO₂ rule (6×60/45 = 8).
- icu-ards: PaO₂ 55–80 / SpO₂ 88–95; permissive pH 7.20; question 5 (reduce TV to 4–5 mL/kg).
- icu-wean: RSBI 120 vs 105; SBT 30–120 min with PS 5–8; failure criteria.
- icu-rosc: targets match ERC–ESICM 2021.
- icu-rrt: 2.6/0.85 = 3.06; each citrate gives 3 HCO₃⁻; lithium (EXTRIP); "creatinine alone is not an indication".
- Ventilator lab: time constants (normal 0.48 s, asthma 1.75 s, COPD 1.21 s), the steady-state trapped volume formula V·x/(1−x), PBW and mL/kg flagging, and the COPD preset (PaCO₂ 59, pH 7.41) with its post-hypercapnic alkalosis alarm at rate 20 all behave plausibly.

Sources: SSC 2021 (Evans, Crit Care Med 2021); Qadir et al. AJRCCM 2024 (https://escholarship.org/uc/item/5c98w95h); Nuccio et al. NEJM 2002;346:1281; Guérin 2013; Combes 2018; Nolan 2021; Sandroni 2022.
