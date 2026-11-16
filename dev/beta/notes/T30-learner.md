# T30 · Learner journey (whole app, as its real user)

## Summary
I covered a full evening session from a fresh start at 1280×800 (Steam Deck): first run, the Round (3 legs as built by default), lessons *How you will learn*, *VBG versus ABG* and *Diabetic ketoacidosis*, the chat case *Nineteen and vomiting*, the timed sim *Resus 1: septic shock*, the Five-second read, a Quick-read practice session, Which gas fits?, Progress with the weekly card, and Settings. Then I did a shift scenario at 390×844: a VBG pasted into the interpreter, an ABG on 40% oxygen typed in (saved to the log as 'Bed 4 CAP'), a mixed salicylate-type gas pasted in kPa, the next-steps panel, the gas log and the pocket card. I also checked the clinical skin in light mode.

**Verdict.** Buffer is already the most complete blood-gas trainer I know. The six-step read is consistent everywhere, the arithmetic is worked out on every step, hints fade, spacing works, and the local touches (Riyadh/Abha altitude, Black template) are thoughtful. Three things undermine trust on day one: the Five-second read marks correct reads wrong, pasting a VBG silently reads it as an ABG, and the interpreter's own demo gas contradicts its Winter's band. For exam prep, the questions are recall-level 4-option items, not MRCEM or USMLE vignettes, and case and sim debriefs teach very little. On shift, the result sits two screens below the input. **Score: 6.5/10.**

## Findings
### Critical (3)
- **T30-1** · `ui7.js` · Five-second read and Pattern flash · RENDER.speed → gasBlock(c) (line 40, 55)  
  **What:** The drill shows only pH, PCO₂ and HCO₃⁻, but the answer key needs the anion gap. A correct read is marked wrong. Example: pH 7.45, PCO₂ 23, HCO₃⁻ 15.5. The key says 'HAGMA + respiratory alkalosis' and marks 'Chronic respiratory alkalosis' wrong. The app's own feedback then says 'chronic: ≈ 15.5. Measured 15.5'. Other items ask for HAGMA vs NAGMA or 'HAGMA + NAGMA' from three numbers. A learner who reads correctly is told they are wrong.  
  **Evidence:** Fresh run, Practice → Five-second read, 12 items. Items 2, 7, 9 and 11 were keyed 'HAGMA + resp. alkalosis' with 'Chronic respiratory alkalosis' offered as a distractor. Items 3, 8 and 10 were NAGMA/HAGMA/HAGMA+NAGMA with no Na⁺ or Cl⁻ shown. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-speed-wrong.png  
  **Fix:** Call gasBlock(c,true) in the 'five' and 'pflash' modes so Na⁺, Cl⁻ and albumin are shown. Or limit SP_KINDS for these modes to kinds that three numbers can name, and collapse the options to 'Metabolic acidosis (+ resp. …)'. Also never offer as a distractor a label that the shown values satisfy exactly.
- **T30-2** · `ui3.js` · Gas interpreter · Paste a printout → Read values ($("pGo").onclick, line 15)  
  **What:** 'Read values' resets the sample to arterial unless the pasted text itself says venous: IV=Object.assign({sample:r.ven?'v':'a'},…). The Venous toggle I set first is silently lost. The VBG is then read as an ABG. Winter's runs on the venous PCO₂ and the read is a false 'NAGMA + respiratory acidosis'. The headline line starts 'ABG:'. That line is what gets copied to the notes.  
  **Evidence:** Phone 390×844: Clear → tap Venous → paste 'pH 7.29 pCO2 40 HCO3 19 Na 138 K 3.2 Cl 110 Lac 1.6 Glu 6.1' → Read values. IV.sample === 'a'. Read: 'NAGMA + respiratory acidosis' with 'expected 35–39, measured 40'. Tapping Venous again gives the correct 'NAGMA with appropriate respiratory compensation' on the estimated arterial PCO₂ of 35. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-vbg-after-read.png  
  **Fix:** Keep the current IV.sample unless parseGas finds an explicit sample word: sample: r.ven ? 'v' : (r.art ? 'a' : IV.sample). Show the sample in the toast ('Read 8 values · venous'). Also put a visible 'Arterial / Venous?' prompt next to Read values.
- **T30-3** · `e1.js` · interp() · compensation step, Winter's band comparison  
  **What:** The band shown is rounded but the comparison uses unrounded numbers, so the text contradicts itself. The interpreter's built-in demo gas (pH 7.21, PCO₂ 24, HCO₃⁻ 9.3 calculated) reads: "expected PCO₂ 20–24 mmHg. Measured 24" and then "PCO₂ too high: added respiratory acidosis". The headline is 'HAGMA + respiratory acidosis' for a pure, compensated HAGMA. This is the first gas a new user sees in the interpreter.  
  **Evidence:** openTool('interp') on a fresh profile. Also interp({sample:'a',pH:7.21,pco2:24,hco3:9.3,na:136,cl:101,alb:40}) gives comp.v 'PCO₂ too high' (1.5×9.3+8 = 21.95; +2 = 23.95 < 24). The placeholder in the paste box uses HCO₃⁻ 9.4, which would be appropriate. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-interp.png  
  **Fix:** Compare against the same rounded band that you display: round lo/hi to whole mmHg, then test measured ≤ hi. Or add a 0.5 mmHg tolerance. Apply the same fix to the 0.7×HCO₃⁻+20 and the 1/4 and 2/5 bands. Add a regression test for 7.21/24/9.3.

### Major (13)
- **T30-4** · `e1.js` · interp() · gap step, Δ ratio (line ~130)  
  **What:** The Δ ratio runs even when HCO₃⁻ has barely moved and the primary is respiratory alkalosis. A typical pneumonia gas then becomes a triple disorder. pH 7.47, PCO₂ 32, PaO₂ 70 on FiO₂ 0.40, Na 136, Cl 100, albumin 30, lactate 2.4 reads 'HAGMA + metabolic alkalosis + respiratory alkalosis; Δ ratio 2.7'. ΔHCO₃⁻ is 1.5 mmol/L, and that small fall is the expected acute respiratory compensation. With albumin 40, the same gas reads 'Acute respiratory alkalosis'. On shift this over-reads the gas and pushes the metabolic headline above the real problem (P/F 175).  
  **Evidence:** Interpreter on phone, typed values as above. Saved it to the log as 'Bed 4 CAP' (log line shows the triple-disorder impression).  
  **Fix:** Only report a Δ-ratio verdict when (a) a metabolic acidosis is present, (b) the AG rise is ≥ 4 or so and (c) 24 − HCO₃⁻ ≥ 4. Otherwise say 'Δ ratio not meaningful (bicarbonate barely changed)'. When the primary is respiratory, take ΔHCO₃⁻ from the expected compensated HCO₃⁻, not from 24.
- **T30-5** · `ui8.js` · Timed sim · simGas() (fio2 copied from case.gas0)  
  **What:** Simulated gases ignore the oxygen you have given. In Resus 1 (septic shock) I gave 'Oxygen to SpO₂ 94–98%' at 4′. Both the 5′ ABG and the 31′ repeat ABG print 'ARTERIAL · FIO₂ 0.21' with PaO₂ 62 and 65. That is an SpO₂ of about 91–92%, below the target the action claims. The P/F and A–a from these gases teach the wrong thing.  
  **Evidence:** openCase('Resus 1') → Oxygen → ABG with lactate → … → Repeat ABG. CS.done.o2 = 1 at t = 4, but the result header reads FiO₂ 0.21. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-sim2.png  
  **Fix:** In simGas, set g.fio2 from the oxygen actions (for example 0.4 after 'Oxygen to SpO₂ 94–98%'). Raise PaO₂ to match the target, or let the case data give gas1 values for 'on O₂'. Show the device in the header.
- **T30-6** · `ui8.js` · Timed sim · simVit() / first render vs case vignette (c12 Resus 1)  
  **What:** The monitor at 00:00 disagrees with the vignette above it. The vignette says HR 126, BP 78/42, RR 28. The monitor says HR 137, BP 65 sys, RR 33, SpO₂ 88, GCS 10. BP is shown as systolic only, but the treatment target is 'MAP ≥ 65', so the learner cannot check the target.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-sim1.png  
  **Fix:** Start the vitals from the vignette values at t = 0 and drift them from there. Show BP as sys/dia (MAP) and colour by MAP.
- **T30-7** · `ui8.js` · Case end · caseEnd()  
  **What:** The chat case debrief is one line ('2 wrong turns. They are in your mistake notebook.') plus a collapsed Sources list. There are no take-home points, no summary of the right path and no exam angle. Confetti fires even after wrong turns. For a learner, the debrief is where the learning sticks.  
  **Evidence:** Nineteen and vomiting → finish with 2 wrong turns. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-chat-debrief.png  
  **Fix:** Add 'c.learn' (3 teaching points) and 'c.exam' (the one fact an MRCEM or USMLE question would test) to each case in c12.js and render them here. Also show the path taken vs the ideal path, the exam tags and the sources open by default. Skip confetti when there are wrong turns.
- **T30-8** · `c12.js` · All 16 cases · data  
  **What:** The case data has no debrief teaching content (no learning points, no exam pearls), so caseEnd() cannot show any.  
  **Evidence:** grep of c12.js: fields are id, fmt, t, pres, dis, set, exam, src, steps; there is no learning-point field.  
  **Fix:** Add learn:[…3 short points…] and pearl:'…' to each case (16 cases).
- **T30-9** · `ui1.js` · Today · Round card vs Round builder (ui5 roundCap / presetLegs)  
  **What:** The Round card promises 'One composed session · about 24 minutes' with 6 legs. 'Start the Round' opens a builder with only 3 legs ticked ('Start · 14 min'), because roundCap() defaults to 15. Today's plan says 'The Round 25 min' and the 'How you will learn' lesson says about 25 minutes. After those 3 legs the card says 'Round complete. Done for today' and lists all 7 legs, including the 4 that were never done, with no ticks.  
  **Evidence:** Fresh start at 1280×800 → Start the Round. Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round1.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-finish.png  
  **Fix:** Pick one default (25 min on a free day). Make the card list exactly what the builder preselects, with the same total. On completion, tick the legs done and grey the ones skipped ('3 of 6 legs').
- **T30-10** · `ui10.js` · todaysPlan() · case and speed items (lines 49–50)  
  **What:** Plan items tick as done for the wrong activity. After 'Nineteen and vomiting', the plan shows '✓ Case: The quiet overdose (chat)', a case I never opened: `next` moves on to the next undone case but `done` is 'any case today'. Likewise '✓ Real printouts' after I did a Five-second read, because done = any speed drill today.  
  **Evidence:** Phone Today after the evening session. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-today.png  
  **Fix:** Store the planned item's id (case id, speed mode) in S.plan[today] when the plan is first built. Mark it done only when that id was finished, or relabel the item 'One case' / 'One speed drill'.
- **T30-11** · `ui3.js` · Gas interpreter on phone · runInterp() after Read values  
  **What:** On a phone, the read appears about 1,700 px below the 'Read values' button, under 18 input fields. After pasting there is no scroll, jump or summary, only a toast. On a busy shift the user cannot tell anything happened without scrolling two screens.  
  **Evidence:** 390×844: after Read values, the headline 'Normal anion gap metabolic acidosis' is at y ≈ 1692 px (document height 5077). Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-vbg.png  
  **Fix:** After Read values (and on any input change on small screens), scrollIntoView the READ card. Or show a sticky one-line result bar at the bottom ('VBG · NAGMA, compensated · tap for steps'). Collapse the input form once values are parsed.
- **T30-12** · `ui6.js` · Next steps panel · nextKeys() ordering  
  **What:** Next steps list the metabolic findings first and the most urgent finding last, collapsed. For the pneumonia gas the order is HAGMA (borderline AG 16), then metabolic alkalosis, respiratory alkalosis and finally 'Impaired oxygenation on oxygen (P/F below 300)'. The P/F of 175 is the one that changes management now.  
  **Evidence:** Interpreter, gas pH 7.47/32/70 on FiO₂ 0.40, alb 30. NEXT STEPS · FOR TEACHING section.  
  **Fix:** Order the panels by acuity: oxygenation failure and severe acidaemia (pH < 7.2) or a tiring patient first, then the primary disorder, then secondary or borderline ones. Open the first panel by default.
- **T30-13** · `ui1.js` · Today on phone · layout for shift use  
  **What:** On a phone, Today has no quick way to read a gas above the fold. The Round card and Today's plan fill the first screen. 'Interpret' is a tile about one screen down, or it takes Labs → Gas interpreter. On shift, the most common job is the one hardest to reach.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-today.png (390×844).  
  **Fix:** Add a persistent 'Read a gas' action: a floating button on every view at phone width, or a first row on Today. Long-press could open the venous-preset interpreter.
- **T30-14** · `c1.js` · Lesson check questions (L[].q from c1–c4 and XQ in c6–c8) · exam style  
  **What:** The check questions do not match the exams this learner is sitting. 487 of 490 have 4 options (MRCEM SBA and USMLE use 5 or more). The median stem is 52 characters and none is 150 characters or longer, so none is a clinical vignette. Many distractors are implausible ('It replaces the need for sleep', 'Give bicarbonate' / 'Ignore it' for VBG PCO₂ 62, 'None; use urine'). Some questions repeat: DKA Q2 and Q5 and VBG Q1 all ask whether a venous sample is enough. These questions train recall, not the applied SBA reasoning both exams test.  
  **Evidence:** page.evaluate over L[].q: n = 490, options {4: 487, 2: 3}, median stem 52 chars, p90 78, 0 stems ≥ 150. Lessons read: learn, vbg, dka.  
  **Fix:** Rewrite at least the 2 lesson-end questions per clinical lesson (module 9 and 10) as 5-option vignettes: age, setting, obs and a full gas table in the stem, with homogeneous distractors (all disorders or all next steps). Drop the joke distractors. Remove the near-duplicates (c3.js dka q2/q5 and the vbg lesson q1).
- **T30-15** · `e1.js` · KINDS vignettes · nagma tolu and conn (line 214)  
  **What:** Some vignettes quote a hard-coded K⁺ value that conflicts with the generated printout. 'tolu' says 'K⁺ 2.3' but its range is 2.1–2.6, and the printout showed K⁺ 2.5 beside the stem. 'conn' says 'K⁺ 2.9' with a range of 2.6–3.1. Seeing two different potassium values for one patient makes learners distrust everything else.  
  **Evidence:** Round leg 'Five step-by-step gases', case 1: stem 'K⁺ 2.3', table 'K⁺ 2.5'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-steps1.png  
  **Fix:** Remove numbers from vignette text ('profound weakness and very low K⁺'), or pin k to the quoted value ({k:[2.3,2.3]}). Audit all KINDS vignettes for quoted numbers.
- **T30-16** · `ui1.js` · First run · Today  
  **What:** There is no first-run setup. A new user is not asked for an exam goal, units, a shift pattern or a daily goal (15 gases is preset). The first suggestion is 'Concept of the day: Carbonic anhydrase'. The Gas of the day is an 80-year-old with HAGMA + NAGMA and albumin 22. The 'Start here' lesson sits below the fold. The Round starts with compensation sums before any lesson has taught Winter's.  
  **Evidence:** localStorage.clear() → reload at 1280×800. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-firstrun.png  
  **Fix:** Add a 3-screen first run: (1) exams (MRCEM Primary or SBA, USMLE Step 1 or 2), (2) units and altitude (Riyadh/Abha are already offered), (3) shift pattern or daily minutes. Then make the first Round 'Start here' + the six-step read + 3 guided gases, and keep Gas of the day at level ≤ 2 until 5 lessons are done.

### Minor (16)
- **T30-17** · `c1.js` · Lesson learn (How you will learn blood gases) · sources  
  **What:** The lesson rests on specific evidence: the Aswan University Hospital audit (2024, with percentages), Hatala 2003 (interleaving, ECG), expertise reversal, calibration and so on. Its only source is Berend NEJM 2014, which is about acid–base physiology, not teaching methods. This breaks the 'cite everything' rule. The audit is real: Cureus 2024, PMC11687335.  
  **Evidence:** openLesson('learn') → SOURCES · 1. Audit confirmed at https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11687335/  
  **Fix:** Add LSRC entries for the Aswan audit (Cureus 2024;16:e74…, PMC11687335) and Hatala RM et al., Med Educ 2003 (interleaving ECG). Also cite Roediger & Karpicke 2006 (testing effect), Cepeda 2006 (spacing) and Kalyuga 2003 (expertise reversal).
- **T30-18** · `c6.js` · XQ.ph · "Using the 80 rule, what is [H⁺] at pH 7.52?"  
  **What:** The keyed answer is 28 nmol/L, but the true [H⁺] is 10^(9−7.52) = 30.2. The distractor 32 is closer to the truth (1.8 off vs 2.2). pH 7.52 is also outside the 7.20–7.50 range where the app itself says the 80 rule holds (Gas sense feedback).  
  **Evidence:** c6.js line 7, and the Gas sense feedback text 'Outside 7.20–7.50 the 80 rule drifts'.  
  **Fix:** Use pH 7.48 (80−48 = 32, true 33.1) and distractors 28/42/48. Or ask 'which is closest' with options 30/24/36/52.
- **T30-19** · `ui2.js` · Compensation gym · item generator (gymItem)  
  **What:** Little interleaving. In a 5-sum gym, 4 sums were Winter's for metabolic acidosis (HCO₃⁻ 11, 10, 8, 10) and 1 was metabolic alkalosis. The next Round leg (estimates) opened with Winter's again (HCO₃⁻ 9). No respiratory acute/chronic sums appeared, although the lesson promises 'Sessions shuffle disorders'.  
  **Evidence:** Round legs 1–2. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-gym1.png  
  **Fix:** Draw the rule round-robin (Winter's, met alk, resp acid acute/chronic, resp alk acute/chronic) and do not repeat a rule or an HCO₃⁻ value within one session.
- **T30-20** · `ui2.js` · Session summary · finishSession (line 237) and the case list  
  **What:** In the gym summary the list is headed 'CASES' and shows rows that only say 'Metabolic acidosis'. There are no numbers and no answer, and rows cannot be tapped, so a learner cannot review a missed sum. The verdict says 'use the hints', but the gym has no hints. In Step by step, 3 wrong steps out of about 35 gave '40%, Tough round', because a case scores all-or-nothing.  
  **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-gym-summary.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-steps-summary.png  
  **Fix:** For gym/est rows show 'HCO₃⁻ 10 → 23 (you: 17)'. Make rows open a review. Give the hint advice only for modes with hints. Base the headline on step accuracy, with cases fully right as a secondary number.
- **T30-21** · `ui5.js` · Gas sense (estimates) · feedback  
  **What:** (1) 'Off by 9. Answer: 22 mmHg' for a guess of 30: the 'off by' uses the unrounded 21.5 but shows 22, so the arithmetic looks wrong (30 − 22 = 8). (2) The feedback offers 'Shortcut: HCO₃⁻ + 15 = 24 (fine for HCO₃⁻ 10–18)' on a case with HCO₃⁻ 9, which is outside the stated range and outside Winter's band (21.5 ± 2). (3) The close tolerance is stated only for PCO₂ ('± 3 mmHg'). A guess off by 3 on the anion gap was marked ✗.  
  **Evidence:** Round leg 'Three estimates'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-est-fb0.png  
  **Fix:** Compute 'off by' from the displayed answer. Show the shortcut only when HCO₃⁻ is 10–18. State the tolerance per item type under the slider.
- **T30-22** · `ui8.js` · Chat case · wrong-answer feedback (caseStep)  
  **What:** After a wrong pick, the case shows 'What happens: …' and a 'Why did you pick it?' block, and leaves the options open to retry. After the right pick, the 'Right.' text appears above the earlier wrong-answer blocks, so the page reads out of order. It is also never said plainly that the pick was wrong.  
  **Evidence:** Nineteen and vomiting, step 2, picks 2 then 1 then 3. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-chat-wrong.png  
  **Fix:** Prefix wrong feedback with 'Not this one.' (as Speed does). Collapse earlier wrong blocks into one line ('You first chose …') above the final 'Right.'
- **T30-23** · `c12.js` · ch-dka step 3 (six hours later)  
  **What:** The step gives glucose, ketones, pH, HCO₃⁻ and chloride but no sodium. The keyed explanation says 'The gap is closing', which the learner cannot check.  
  **Evidence:** Nineteen and vomiting, step 4.  
  **Fix:** Add 'Na⁺ 138' (AG 138 − 112 − 14 = 12) so the learner can see the gap close and the NAGMA appear.
- **T30-24** · `ui6.js` · Save to log · privacyWarn() (IDLIKE only)  
  **What:** The privacy check flags digit IDs ('Ahmed MRN 1234567') but not a name with a title ('Mr Alqahtani bed 4'). The sheet also says 'The log syncs to your Google Drive', but in this copy Today says Drive sync does not work.  
  **Evidence:** Phone, Save to log sheet: warn1 shown for the MRN, warn2 empty for 'Mr Alqahtani bed 4'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-savelog.png  
  **Fix:** Also warn on /\b(mr|mrs|ms|dr|abu|umm|bin|bint)\.?\s+[A-Z][a-z]+/i and on two capitalised words in a row. Make the sync sentence conditional on whether Drive is connected.
- **T30-25** · `e1.js` · interp() · impression line, oxygenation phrase  
  **What:** The copied line reads 'Oxygenation: paO₂ adequate, but A–a gradient raised'. The lower-case 'p' comes from lower-casing the step label, so 'paO₂' goes into the notes ('Copy for Black Template').  
  **Evidence:** Interpreter, gas pH 7.45/PCO₂ 2.9 kPa/PO₂ 13.5 kPa. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-clinical-light-interp.png  
  **Fix:** Lower-case only the first character when it is not followed by an upper-case letter or a subscript, or keep the label case as it is.
- **T30-26** · `e1.js` · interp() · A–a on air with no age entered  
  **What:** With no age entered, the A–a of 21 is called 'raised' without saying what age or threshold was used. A 70-year-old's upper limit is about 21.5.  
  **Evidence:** Interpreter, gas above (no Age).  
  **Fix:** When age is blank say 'A–a 21 (normal up to ≈ 14 at 40, ≈ 24 at 80: enter age)', or treat it as indeterminate.
- **T30-27** · `ui2.js` · Quiet mode (default on) · session summaries and confetti  
  **What:** Quiet mode is on by default (S.quiet true) and says it 'Hides XP, levels and badges'. Session summaries still show an 'XP' stat (6, 104, 222). Confetti fires on Round and case completion. The Learn subtitle says 'Each module ends in a boss fight'.  
  **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-gym-summary.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-round-finish.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-chat-debrief.png  
  **Fix:** Hide the XP stat when S.quiet. Skip confetti() in quiet mode (or keep it only for module checks). Map 'boss fight' to 'module check' in quiet mode.
- **T30-28** · `ui5.js` · Round bar · Go button (renderRoundBar → roundGo)  
  **What:** In the middle of a leg, 'Go' calls roundGo(), which starts a new session for the same leg and throws away answers given so far. The label does not say that.  
  **Evidence:** Code: $('rbGo').onclick=roundGo, and roundGo → startSession(...) for gym/steps.  
  **Fix:** Hide 'Go' while that leg's view is open, or make it 'Back to leg' and return to the live SS if one exists.
- **T30-29** · `ui6.js` · Progress · counts  
  **What:** Three gas counts disagree on the same evening: Today '27/15 gases today', the Progress header '22 gases' and the weekly card '37 gases'. 'Minutes ~44' is n × 1.2, not measured, after about 15 minutes of real study.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-progress.png. weeklyReview(): mins = Math.round(n*1.2).  
  **Fix:** Define one 'gas' (a full printout read) and use it everywhere. Count gym sums, case steps and estimates separately. Measure minutes from session timestamps (t0 to end).
- **T30-30** · `ui5.js` · Progress · missing activities  
  **What:** Progress has nothing on speed drills (Five-second read 8/12, median), cases and sims done, or lessons by module. After a full evening, a third of what I did does not appear.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-progress-full.png  
  **Fix:** Add a 'Speed' row (best % and median s per drill), 'Cases 2/16 · sims 1/5', and a module ribbon.
- **T30-31** · `ui8.js` · Timed sim · clock and events  
  **What:** The clock runs 1 real second = 1 sim minute but displays '00:14', which reads as seconds. Nothing explains the speed. The live EVENTS list shows only the last 6 events, so 'Oxygen' had dropped off by 14′.  
  **Evidence:** Resus 1, CS.t vs the display. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-sim2.png  
  **Fix:** Show 'T+14 min' and add a note: 'Sim time: 1 s = 1 min. Pause any time.' Make the events list scroll rather than truncate.
- **T30-32** · `ui3.js` · Gas interpreter · reopening  
  **What:** The interpreter reopens with the previous patient's values and read, with no time stamp. On shift, it is easy to glance at the last patient's read thinking it is the new one.  
  **Evidence:** Opened the interpreter from Labs after the kPa gas: the old values and read were still there.  
  **Fix:** When values are older than 30 min, show a bar ('Values from 12:59 · Clear for a new patient') or clear them on open.

### Polish (6)
- **T30-33** · `shell.html` · Timed sim · Hand over button  
  **What:** 'Hand over' (ends the sim) is the primary orange button at t = 0, next to Pause and Wait. It is easy to end the run by mistake on a touch screen.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-sim1.png  
  **Fix:** Style it as a secondary button, move it to the far right, and ask for confirmation before t ≥ 10′.
- **T30-34** · `c12.js` · Case library order  
  **What:** 'Resus 2: DKA' is listed before 'Resus 1: septic shock'.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-caselib.png  
  **Fix:** Reorder the CASES entries or sort sims by number.
- **T30-35** · `ui3.js` · Pocket card (phone)  
  **What:** On a phone, '10^(9 − pH)' breaks across two lines. The normal values repeat the unit ('35 mmHg–45 mmHg'). The card has no sources line, although it states every rule.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-phone-pocket.png  
  **Fix:** Wrap formulas in a nowrap span, write '35–45 mmHg', and add a short 'Rules from Berend 2014, Boston rules (Narins & Emmett)' line.
- **T30-36** · `ui9.js` · Learn · German glossary tile  
  **What:** The German glossary is the first and most prominent tile on Learn, above the six-step read and the modules. For the core exam learner it is peripheral.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-learn.png  
  **Fix:** Move it under 'Concept web / Pocket card' or into Settings → Extras.
- **T30-37** · `c3.js` · Lesson dka · worked gas  
  **What:** The worked DKA gas has no K⁺, but the lesson's first treatment point is 'K⁺ before insulin'.  
  **Evidence:** openLesson('dka'), WORKED GAS block.  
  **Fix:** Add K⁺ 5.6 to the worked gas and one line under it: 'K⁺ 5.6: no potassium in the first bag; recheck in 1–2 h'.
- **T30-38** · `ui6.js` · Progress · Last 4 weeks grid  
  **What:** 'Last 4 weeks' is drawn as 2 rows of 14 squares with no day labels, so it does not read as weeks. The week starts on Monday, while the Saudi working week starts on Sunday.  
  **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T30-progress.png  
  **Fix:** Draw 4 rows of 7 with day initials, and add a 'Week starts on' setting (Sunday default for the ar-SA locale).

## Ideas (ranked by value to this learner)
1. **T30-39** · `ui2.js` · (1) Exam mode. There is no way to practise in the formats the learner will sit. MRCEM Primary uses physiology SBAs. MRCEM SBA uses clinical SBAs. USMLE Step 1/2 uses long vignettes with a lab table and 5 or more options. Exam tags exist only on the 16 cases. **Do:** Add 'Exam mode': choose MRCEM Primary, MRCEM SBA or USMLE. Serve 5-option vignette items at about 60–90 s each with no feedback until the end. Give a score report by topic and a 'readiness' estimate. Tag every lesson question with exam:[…].
2. **T30-40** · `ui1.js` · (2) Shift mode for the phone. Reading a gas on shift needs: one tap to open, a venous default you can remember, the fields in printout order with the numeric keypad, the result pinned on top, then Save with tag. **Do:** Add a 'Shift' toggle (or auto-detect phone width plus night-shift slot) that opens straight into the interpreter with a sticky result bar, hides study cards and remembers the last sample type.
3. **T30-41** · `ui8.js` · (3) The sims never ask the learner to read the gases they order, yet this is a blood-gas app. **Do:** When a gas result arrives, pause and ask a 1-question read (primary, compensation, the one number that matters). In the debrief, chart the serial gases (lactate clearance %, pH, HCO₃⁻) and mark the reads that were right or wrong.
4. **T30-42** · `c12.js` · (4) 16 cases cover too little for two exams and daily shift practice. There are no cases for HHS, AKA, toxic alcohol follow-up, PE, heat stroke on site (Saudi summer), CO, paediatric DKA or Hajj/Umrah heat. **Do:** Grow to about 40 cases, including local presentations (exertional heat stroke at outdoor work sites, scorpion or snakebite-related rhabdomyolysis, Ramadan fasting DKA/AKA) with MRCEM/USMLE tags.
5. **T30-43** · `ui3.js` · (5) There is no search. To look up 'osmolar gap' or 'GOLDMARK' on shift you must know it is in Labs → Pocket card or in a lesson. **Do:** Add a search field (header icon) over lessons, pocket card rows, Labs tools and the glossary, with results in one list.
6. **T30-44** · `c1.js` · (6) Lessons are not mapped to exam blueprints. **Do:** Add an 'Exam' filter on Learn (MRCEM Primary physiology: modules 1–5, 7; MRCEM SBA: 8–10; USMLE Step 1: 1–5, 9; Step 2: 9–13) and a 'High-yield for my exam' path.
7. **T30-45** · `ui3.js` · (7) The pocket card lacks the numbers looked up most on shift. **Do:** Add: oxygen targets (BTS 2017: 94–98%, 88–92% for hypercapnic risk), DKA and HHS criteria (2024 consensus), P/F ARDS bands, lactate thresholds (≥ 2 and ≥ 4), the salicylate and toxic-alcohol cues, and the K⁺ shift rule. Keep it to one screen with collapsible rows.
8. **T30-46** · `ui2.js` · (8) Cause-step feedback is generic ('Match the gas to the story: Toluene inhalation'). It does not say why toluene gives a NAGMA with low K⁺ (hippurate, distal-RTA-like loss), which is exactly the USMLE fact. **Do:** Give each KINDS variant a one-line 'why' (vig[3]) and show it in the cause feedback and in Think about.
9. **T30-47** · `ui1.js` · (9) The Gas of the day is the same for everyone, at full difficulty. **Do:** Scale it to the learner's level (show the 3-number core for beginners), and offer 'read it, then compare with a colleague' via Share.
10. **T30-48** · `ui6.js` · (10) The weekly card shows numbers but no plan for next week. **Do:** Add 'Next week: 3 Rounds, 1 module (weakest), 2 cases, exam set ×1' built from the weakest step and pattern, sent to Citrus as a plan.
11. **T30-49** · `ui5.js` · (11) There is no short daily exam-style leg in the Round. **Do:** Add a 'Five SBAs' leg (5-option vignettes) to the Round catalogue when an exam goal is set.
12. **T30-50** · `ui7.js` · (12) Speed drills ignore number keys, unlike every other mode, which slows the Steam Deck plus keyboard setup. **Do:** Bind 1–4 to the options in RENDER.speed, as in sessions.

## What works well (keep)
- Worked arithmetic on every step, the same six-step order in lessons, sessions, interpreter and pocket card.
- Fading hints (hintMode) and the 1/3/7/16/35-day spacing are real, not decoration.
- The 'What happens next' question (ventilating a NAGMA patient to PCO₂ 40 gives pH 7.25) is excellent exam- and ICU-relevant teaching.
- DKA content matches the 2024 international consensus (diagnosis and resolution thresholds) and JBDS potassium rules.
- The VBG read, once the toggle is set, converts correctly and says plainly that oxygenation is not assessed.
- kPa paste conversion, the FiO₂ '40' → 0.40 handling, the gas log with tags and the ID warning all work.
- The teaching banner appears on every tool, and Riyadh/Abha altitude presets are a good local touch.
