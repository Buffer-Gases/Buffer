# T19 · Speed and noise drills (ui7.js)

## Summary
Covered: all four drills (Five-second read, Real printouts, Pattern flash, Handover line), several full rounds each in the frozen 4.9.0 copy at phone 390×844, tablet 820×1180 and desktop 1280×800, pixel and clinical skins, dark and light. Checked the timer and time-up path, printout realism (flags, ranges, noise values, bad samples), flash levels up and down, the handover options, feedback, keyboard (1–4, Enter, Escape), the results screen, best scores, S.sess, the weekly review, Today's plan, Back mid-drill and leaving via the tab bar. I also ran scripted batches (600–800 generated items) to measure fairness.

**Verdict:** the drills look good and run without errors, and the bad samples can be detected by maths (Henderson error 17–43% compared with ≤2% for good samples). But three things undermine the core teaching:
- About 44% of Five-second and Pattern-flash items cannot be answered, because they need the anion gap and Na⁺/Cl⁻ are not shown.
- Handover line can be solved 100% of the time from the shape of the options alone.
- The keyed handover action for HAGMA + respiratory acidosis (arrest, shock, fatigue) is a lab work-up rather than ventilatory support.

The 'numbers do not fit' sample also cannot happen on a real analyser, which calculates HCO₃⁻ from pH and pCO₂. Leaving the view and coming back also soft-locks the drill.

**Score: 5/10.**

Counts: critical 3, major 7, minor 15, polish 11, idea 5

## Critical

### T19-1 · five / pflash · RENDER.speed → gasBlock(c) (no 'more') (ui7.js)
- **What:** Five-second read and Pattern flash show only pH, PCO₂ and HCO₃⁻, but ~44% of items carry an anion-gap label (High AG MA, Normal AG MA, HAGMA + NAGMA, HAGMA + MALK, HAGMA + RAC/RALK, triple). With Na⁺/Cl⁻/albumin hidden these items cannot be answered; distract() deliberately pairs HAGMA with NAGMA so the user is left with a coin toss. This teaches guessing, not reading.
- **Evidence:** 600 spCase() draws: 263 with HAGMA/NAGMA in the label; 246/600 had another AG-dependent label among the options. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-five-timeup-phone.png: pH 7.33 / PCO₂ 33 / HCO₃⁻ 17, options 'Normal anion gap…' vs 'High anion gap…', key = NAGMA, no Na/Cl shown.
- **Fix:** For five and pflash either (a) render gasBlock(c,true) so Na⁺, Cl⁻, Alb are shown (and give 7 s when they are), or (b) grade at a 3-number label: build options with buildLabel(c.o.r,2) ('Metabolic acidosis + respiratory acidosis') so every key is decidable from pH/PCO₂/HCO₃⁻. Option (b) suits a five-second glance; keep AG work for Real printouts.

### T19-2 · handover · handoverOpts() (ui7.js)
- **What:** Handover line can be solved without looking at the gas. Options are: right (L,A), (D1,A), (L,A2), (D2,A). The right answer is always the one option whose action appears 3× and whose label appears 2×. 100% of generated items are solvable by this rule.
- **Evidence:** Script over 600 spCase(): pick the option with the majority action AND the repeated label → correct in 600/600. Sample set: 'acute-on-chronic RAC / NIV…', 'acute RAC / NIV…', 'chronic RAC / NIV…', 'acute-on-chronic RAC / treat the dangerous process…' → answer is obvious.
- **Fix:** Make every option internally coherent and distinct: 4 different labels, each with its own correct action (actFor of that label), then make one distractor the right label with a plausible-but-wrong action and vary both parts so no label or action repeats more than twice across options. Better: build distractors from typical handover errors (missed compensation, wrong primary, anchoring on anxiety, wrong sample) so each wrong line is wrong for a teachable reason, and explain that reason in feedback.

### T19-3 · handover · actFor() / NEXTACT (ui7.js)
- **What:** For HAGMA + respiratory acidosis (cardiac arrest, APO with shock, 'septic shock, breathing slowing and drowsy') the keyed next action is 'lactate, ketones, renal function and an osmolar gap'. The urgent action in a drowsy patient with a failing respiratory compensation (PCO₂ far above Winter's) is ventilatory support/escalation; ordering an osmolar gap is the wrong priority and is marked 'Right'.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-handover-tablet-light.png: 66-year-old, septic shock, drowsy; pH 7.03 / PCO₂ 36 / HCO₃⁻ 9.2 (Winter's expects ~22). actFor() checks r.mac first and returns NEXTACT.hagma for every HAGMA mixture (48/48 HAGMA+RAC draws).
- **Fix:** Key the action by the mixed label: HAGMA+RAC → 'inadequate respiratory compensation: call for help, airway/ventilatory support now; lactate and cause'. HAGMA+RALK → 'salicylate level, lactate, sepsis screen'. HAGMA+MALK → 'ketones/lactate plus vomiting history, urine Cl⁻'. Check r.rac before r.mac when the patient is failing (PCO₂ above the Winter's band).

## Major

### T19-4 · noisy · printout(c,bad) / BADSAMPLE (ui7.js)
- **What:** The 'numbers do not fit' bad sample is not a real analyser failure. On a blood-gas analyser cHCO₃⁻(P) and cBase are CALCULATED from the measured pH and pCO₂ (the printout itself labels them '…c'), so pH, PCO₂ and HCO₃⁻ on one printout always satisfy Henderson–Hasselbalch. A printout that fails the Henderson check cannot occur; the check is useful only when comparing a gas with a lab chemistry bicarbonate/tCO₂ or with hand-typed values. Meanwhile the real pre-analytical errors (air bubble, venous sample, delay, haemolysis, heparin dilution) are never taught.
- **Evidence:** printout(): bad shifts only pH by ±0.09–0.15, keeps HCO₃⁻ and BE from the true pH. Source: Deranged Physiology, 'The actual bicarbonate value' (https://derangedphysiology.com/main/cicm-primary-exam/required-reading/acid-base-physiology/Chapter%20601/actual-bicarbonate-value) — analyser HCO₃⁻ is derived from pH and pCO₂.
- **Fix:** Replace the Henderson-mismatch generator with realistic bad samples, each with its own explanation: air bubble (pO₂ drifts towards ~150 mmHg on room air, pCO₂ falls), venous sample labelled arterial (pO₂ 30–45, FO₂Hb 60–75%), delayed/uniced sample (pO₂ down, lactate and K⁺ up, glucose down), haemolysis (K⁺ high with flag), excess liquid heparin (pCO₂ and HCO₃⁻ low). Keep a Henderson exercise as a separate item that pairs the gas with a lab-chemistry tCO₂ or a hand-written transcription error.

### T19-5 · speed view · RENDER.speed / spAnswer guard SP.answered===SP.i (ui7.js)
- **What:** Soft lock after leaving and returning. RENDER.speed generates a NEW case every time the view renders, but SP.answered still equals SP.i, so the new card's buttons and keys do nothing; the five-second bar runs to 0 and nothing happens. Only '← Practice' escapes. The same re-render lets a user re-roll a hard gas (any go('speed'), theme change, etc.).
- **Evidence:** (A) startSpeed('noisy'), press 1, go('today'), go('speed'), press 2 → no feedback, buttons enabled, SP.answered=0. (B) startSpeed('five'), go('today'), wait 5.4 s, go('speed'), click option → no feedback; bar empties, still nothing. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-stuck-phone.png. RENDER.speed() twice → different gas.
- **Fix:** Store the case, options and answered state in SP.cur keyed by SP.i; when RENDER.speed is called for an index already drawn, re-draw the same card (with feedback if answered) instead of calling spCase(). Pause/clear SP.tick and SP.hide when VIEW leaves 'speed' (wrap go()) and resume or restart the bar on return.

### T19-6 · five · SP.tick interval when the view is left (ui7.js)
- **What:** The five-second interval keeps running after the user switches tab via the nav bar; it fires spAnswer(null) on an invisible card, which counts a read (S.read+1, touchDay) and a time-up the user never saw.
- **Evidence:** startSpeed('five'); go('today'); wait 5.6 s → S.read +1, SP.answered=0, VIEW='today'.
- **Fix:** Clear SP.tick/SP.hide in go() when leaving 'speed' (or check VIEW==='speed' in the tick and pause).

### T19-7 · spAnswer · 'why' text (ui7.js)
- **What:** Feedback shows only the compensation step (comp.v + comp.d). For the decisions the drills actually test it says nothing: AG-dependent keys (why HAGMA+NAGMA rather than HAGMA: no AG, no delta), mixed disorders ('Not applicable: two primary disorders…' with no read), bad samples (no numbers: computed vs displayed [H⁺]), and a good sample wrongly called bad (nothing says the numbers fit).
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-noisy-wrong-fb-phone.png (HAGMA+NAGMA key, feedback = Winter's only) and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-five-desk-clinical-light.png (mixed MALK+RALK, feedback 'Not applicable…').
- **Fix:** Build 'why' from o.steps: primary (k='prim'), comp, corrected AG and delta ratio when present, plus one line naming the key. For bad samples print the numbers, e.g. '24×PCO₂/HCO₃⁻ = 52 nmol/L → pH 7.28, printed 7.40'. For a good sample called bad, show the same check passing.

### T19-8 · handover · actFor() inconsistent per label (ui7.js)
- **What:** The same label maps to different 'right' next actions depending on pH, and some keyed actions are less right than the distractor. HAGMA + metabolic alkalosis → 'urine chloride and potassium' when pH is normal (o.prim empty) but 'lactate, ketones…' otherwise (15/42 vs 27/42). For HAGMA + respiratory alkalosis (salicylate, early sepsis, liver failure) the key is the HAGMA work-up while the w2 distractor 'look for hypoxaemia, sepsis or salicylate…' is arguably more correct → two defensible answers.
- **Evidence:** 600-draw script: acts map shows both actions for 'HAGMA + metabolic alkalosis'. Code: actFor() branches on o.prim length.
- **Fix:** Map action by label (or kind) in a table; never use an action as a distractor if it is also appropriate for the case's label (filter NEXTACT values that apply to any component of the label).

### T19-9 · SP_KINDS / spCase / spOptions · Math.max(3,S.lvl||4) (ui7.js)
- **What:** Speed drills ignore the Practice difficulty. A level-1 or level-2 learner gets all 15 kinds including triple disorders and HAGMA/NAGMA labels, because the level is clamped to ≥3 (kindsFor(3) returns every kind).
- **Evidence:** Code: SP_KINDS=()=>kindsFor(Math.max(3,S.lvl||4)); level 4 run produced 'HAGMA + metabolic alkalosis + respiratory alkalosis' in a five-second read.
- **Fix:** Use S.lvl as is (kindsFor(S.lvl), safeCase(kind,S.lvl), distract(label,S.lvl)), and show the level on the tile meta ('12 gases · Core').

### T19-10 · printout() · NOISE 'tHb O₂Hb' (ui7.js)
- **What:** Oximetry is random and independent of pO₂, so good samples look 'wrong': FO₂Hb 90–97% regardless of pO₂ (pO₂ 113 mmHg with O₂Hb 91% flagged L; pO₂ < 60 with O₂Hb > 92% in 28/300 printouts). A careful reader will call these 'numbers do not fit' and be marked wrong.
- **Evidence:** sampleRows1 from stats script: pO₂ 113 H, tHb O₂Hb 93.5 L. Desktop shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-noisy-desk-clinical-light.png: pO₂ 82, O₂Hb 91 L.
- **Fix:** Derive sO₂ from pO₂ with a Severinghaus/Hill approximation (pH-shifted), then FO₂Hb = sO₂ × (100 − COHb − MetHb)/100. Show sO₂ as its own row.

## Minor

### T19-11 · printout() · Hb/Hct (ui7.js)
- **What:** Hb and Hct are drawn independently, giving impossible pairs (Hb 10.8 g/dL with Hct 48%). Analysers derive Hct from ctHb (Hct ≈ 3 × Hb in g/dL).
- **Evidence:** sampleRows1: Hct 48, Hb 10.8.
- **Fix:** Draw Hb, then Hct = round(Hb×2.94).

### T19-12 · printout() · header vs Temp row (ui7.js)
- **What:** Header always says 'Temp 37.0 °C' while a random 'Temp' row shows 36.2–38.8 °C on the same slip.
- **Evidence:** sampleRows1: header 37.0 °C, Temp row 38.5.
- **Fix:** Use one patient temperature: put it in the header and drop the row, or show 'T 38.5 °C' in the header and add temperature-corrected pH/pCO₂ lines as a real ABL does.

### T19-13 · printout() · Crea / Baro / Glu independent of case (ui7.js)
- **What:** Creatinine is random 55–235 µmol/L regardless of case (a 'metformin AKI' or 'creatinine tripled' case can print 60; a panic attack can print 223 H). Baro 740–765 mmHg ignores S.patm that the oxygenation maths used.
- **Evidence:** Desktop shot: Crea 126 H in a metabolic alkalosis; first noisy shot: Crea 223 H in a respiratory alkalosis.
- **Fix:** Derive creatinine from c.urea or the kind (AKI kinds high, others 55–100); print Baro = S.patm||760.

### T19-14 · printout() · AG reference 8–16 and no albumin (ui7.js)
- **What:** The printout's AG range (8–16, unflagged up to 16) does not match the app's own threshold (agref 12, high above ~14) and albumin is not shown, so ~3% of HAGMA printouts look like a normal gap (AG 12–15 with albumin 19–20 g/L). The user cannot correct the gap.
- **Evidence:** 800-draw script: 9/325 HAGMA-family printouts had AG ≤ 16; examples AG 12.1 alb 20, AG 14.2 alb 19.
- **Fix:** Add a 'Lab: albumin X g/L' footer line (analysers do not measure albumin) and use the app's agref for the range/flag, or show 'AG(K⁺)c' with 10–20 when S.usek.

### T19-15 · printout() bad · cBase(Ecf)c (ui7.js)
- **What:** In a bad sample BE is computed from the true pH, not the printed pH, so BE disagrees with the printed pH and HCO₃⁻ — an extra tell that no real slip would have (e.g. pH 7.09 / HCO₃⁻ 27.6 / BE +0.4).
- **Evidence:** kPa bad printout in stuck.py output: pH 7.090 L, cHCO₃⁻ 27.6 H, cBase +0.4.
- **Fix:** Moot if bad samples are redesigned (see the bad-sample finding); otherwise compute BE from the printed pH.

### T19-16 · noisy · bad rate Math.random()<0.17 (ui7.js)
- **What:** Bad samples are independent draws: 15.5% of 10-gas rounds contain none (0.83¹⁰) and some contain 4+. Round scores therefore vary with luck rather than skill.
- **Evidence:** noisy round in play.py had 2 bad samples; arithmetic for P(0).
- **Fix:** Place exactly 1–2 bad samples per round at random positions.

### T19-17 · spAnswer · Henderson text in kPa (ui7.js)
- **What:** Explanation says '[H⁺] from 24 × PCO₂ ÷ HCO₃⁻' even when units are kPa and the printout shows kPa, where the factor is ~180.
- **Evidence:** S.units='kPa'; bad noisy sample → feedback text unchanged; printout pCO₂ 9.6 kPa.
- **Fix:** Use (S.units==='kPa'?'180':'24') in the text and show the worked numbers.

### T19-18 · handover · handoverLine() capitalisation (ui7.js)
- **What:** Lower-casing the first letter of the label turns 'HAGMA…' into 'hAGMA' in every HAGMA-family handover line (about 40% of items).
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-handover-fb-phone.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-handover-tablet-light.png: 'ABG: hAGMA + respiratory acidosis'.
- **Fix:** Only lower-case when the second character is lower-case: /^[A-Z][a-z]/.test(label) ? lower first : keep.

### T19-19 · handover · line content vs tile and feedback (ui7.js)
- **What:** Tile promises 'sample, read, cause and the next action', feedback repeats it, but the lines contain only 'ABG: <read>. Next: <action>.' — no cause, sample is always 'ABG' (no VBG), and no oxygenation.
- **Evidence:** SPEED.handover.d; handoverLine(); handover screenshots.
- **Fix:** Either add cause (CAUSES[c.cause]) and oxygenation to each line, e.g. 'ABG on 60% O₂: HAGMA with inadequate respiratory compensation, likely septic shock with fatigue; P/F 150. Next: …', or change the tile/feedback text to match.

### T19-20 · NEXTACT.ralk for chronic respiratory alkalosis (ui7.js)
- **What:** Chronic respiratory alkalosis cases (pregnancy at 34 weeks, altitude resident, stable cirrhosis) are keyed to 'look for hypoxaemia, sepsis or salicylate before calling it anxiety'. 'Anxiety' is not the trap here; the expected handover is 'expected for pregnancy/altitude; no action' or 'consider hepatic encephalopathy'.
- **Evidence:** acts map: 'Chronic respiratory alkalosis -> look for hypoxaemia…' 38/38.
- **Fix:** Split ralk actions by acute vs chronic; for chronic: 'physiological in pregnancy/altitude; otherwise look for liver disease or chronic hypoxaemia'.

### T19-21 · line 550 · .hrow (shell.html)
- **What:** The results strip reuses the class .hrow, which is the site header row (line 63; <header class="top"><div class="wrap hrow">). The speed rule '.hrow{display:flex;flex-wrap:wrap;gap:4px}' is global, so it overrides the header gap (10px → 4px) and lets the header wrap on narrow screens.
- **Evidence:** shell.html lines 63, 90, 550, 583.
- **Fix:** Rename the strip class (e.g. .sphist) in ui7.js speedDone() and shell.html line 550.

### T19-22 · speedDone / ← Practice mid-drill (ui7.js)
- **What:** Leaving mid-drill (← Practice) discards the partial session: answers already counted in S.read and touchDay are never written to S.sess, so the weekly review and Citrus status under-count; there is no confirm before discarding.
- **Evidence:** Back after 3 answers → S.read +3, S.sess unchanged.
- **Fix:** On Back with SP.i>0 push {d,m,n:SP.i,ok:SP.ok,partial:true} to S.sess (or ask 'Leave and keep 3 answers?').

### T19-23 · weeklyReview · mins = n×1.2 (ui6.js)
- **What:** Minutes are estimated at 1.2 min per gas for every session type, so speed drills (5 s per gas) inflate study time ~10×. One afternoon of drills reported 'about 108 min' for 90 speed gases that took about 8 min. hub.js uses the same estimate for Citrus items.
- **Evidence:** play.py weeklyReview(): n 90, mins 108.
- **Fix:** Store real duration in S.sess (ms sum from SP.ms) and sum that; fall back to n×1.2 only for old entries. Same change in hub.js line 66.

### T19-24 · keydown handler (ui7.js)
- **What:** Enter does nothing on the results screen (focus is not on Again) and Escape does not leave the drill, unlike Practice sessions (ui2 maps Escape to exit).
- **Evidence:** Pressed Enter on results: VIEW stays 'speed', nothing happens.
- **Fix:** Focus #spAgain in speedDone(); map Escape to #spX / #spBack.

### T19-25 · five · 5 s budget (ui7.js)
- **What:** (Judgement) 5 s includes reading four multi-word options (up to 'HAGMA + metabolic alkalosis + respiratory alkalosis') and, for mixed disorders, a Winter's or 0.7×HCO₃⁻+20 sum. That is fair for single disorders but not for level-4 mixtures; my own correct answers on mixed items needed ~4–6 s.
- **Evidence:** Time-ups at 5.0 s in five-mode runs; option lengths in screenshots.
- **Fix:** Scale the limit: 5 s for single-disorder labels, 8 s for two-process, 10 s for triple; or show options 1 s before the numbers. Display the limit in the eyebrow.

## Polish

### T19-26 · pflash · level messages (ui7.js)
- **What:** Level-down message 'Next time it shows a little longer' gives no time, while level-up gives one; the current flash time/level is not shown on the tile or the drill header.
- **Evidence:** pflash 0/15 result text; tile meta '75% · best 100%'.
- **Fix:** Always print the next time ('Next time: 1.6 s'), and add 'flash 1.4 s' to the tile meta and the hint.

### T19-27 · pflash · answering while visible (ui7.js)
- **What:** Options are clickable while the gas is still showing, so the 'from memory' drill can be done as a normal read; the timing then mixes flash time and decision time.
- **Evidence:** Answered during flash in play.py: median 0.0 s on a round.
- **Fix:** Disable .spo until SP.hide fires (or keep enabled but time from hide).

### T19-28 · .sphidden min-height (shell.html)
- **What:** The hidden placeholder (min-height 120px) is taller than the gas tiles (~90px), so the options jump down when the gas hides.
- **Evidence:** Compare /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-pflash-show-phone.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-pflash-hidden-phone.png.
- **Fix:** Give .sphidden the same height as .spgas (measure and set inline, or min-height:auto with padding equal to the tile).

### T19-29 · gasBlock() (ui7.js)
- **What:** HCO₃⁻ tile has no unit while PCO₂ shows 'mmHg'; on phone the PCO₂ label wraps to two lines so its value sits lower than pH and HCO₃⁻. HCO₃⁻ decimals are inconsistent ('17' vs '25.3').
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-five-phone.png.
- **Fix:** Label 'HCO₃⁻ mmol/L', keep labels on one line (smaller unit on its own line for all three) and print HCO₃⁻ with toFixed(1).

### T19-30 · printout() · number formatting (ui7.js)
- **What:** pH printed to 3 dp but always ends in 0 (7.450, 7.090) because cases are 2 dp; other values drop decimals ('Hb 11', 'Glu 5').
- **Evidence:** Screenshots of noisy printouts.
- **Fix:** Add a random third pH digit and recompute pCO₂/HCO₃⁻ consistently, or print pH to 2 dp; format each analyte with its fixed decimals (Hb 1 dp, Glu 1 dp, iCa 2 dp).

### T19-31 · printout() · reference text (ui7.js)
- **What:** BE range renders as '-2–2' (hyphen-minus then en dash); hard to read.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-noisy-desk-clinical-light.png.
- **Fix:** Render ranges as '−2 to +2' (or '(−2.0–+2.0)') using a real minus sign.

### T19-32 · printout() · parameter names and units (ui7.js)
- **What:** 'tHb O₂Hb' is not an analyser label (FO₂Hb is; ctHb is separate), sO₂ is missing, and Hb is in g/dL while the app is British and SI (g/L on UK slips).
- **Evidence:** NOISE array.
- **Fix:** Rename to 'FO₂Hb', add 'sO₂', label Hb 'ctHb' in g/L (or follow S.units style setting).

### T19-33 · printout() · row order (ui7.js)
- **What:** Extra rows are shuffled at random (Crea between Na and Hct, Baro between Hct and K⁺). Real printouts are grouped (Blood gas / Oximetry / Electrolytes / Metabolites / Temperature-corrected), and learning where to look is part of the skill.
- **Evidence:** Screenshots of noisy printouts.
- **Fix:** Keep a fixed section order with small section captions; randomise only which optional rows appear.

### T19-34 · .printout on desktop (shell.html)
- **What:** At 1280 px the printout table stretches the full card width, so values sit far from their names (values ~320 px away), unlike a paper slip.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-noisy-desk-clinical-light.png.
- **Fix:** max-width:34rem on .printout (centre or left), or table width:auto.

### T19-35 · .spo:disabled after answer (shell.html)
- **What:** After answering, all options are dimmed including the right one, so the key you are meant to learn is low-contrast grey (only a thin green outline).
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-five-timeup-phone.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-handover-fb-phone.png.
- **Fix:** Keep .spo.right at full opacity with a 'Correct' tag/tick; dim only the others.

### T19-36 · speedDone · results strip and accessibility (ui7.js)
- **What:** The results strip is colour-only squares with no text/aria, time-ups are not distinguished from wrong answers, and the five-second bar has no accessible time warning. 1–4 shortcuts exist but nothing shows them.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T19-five-results-phone.png.
- **Fix:** Give each square aria-label ('3: wrong, 5.0 s time up'), a distinct time-up style, role='progressbar' on the bar, and small 1–4 key badges on options at ≥ 820 px.

## Ideas

### T19-37 · speedDone (ui7.js)
- **What:** Review list on the results screen: each item with the gas, your answer, the key and the one-line why, so the round teaches after it ends.
- **Evidence:** Results currently show score, median and coloured squares only.
- **Fix:** Keep {c,right,picked,ms} in SP.hist and render a collapsible list; add 'Drill my misses'.

### T19-38 · spAnswer → S.kinds / mistakes (ui7.js)
- **What:** Speed-drill answers do not update pattern accuracy (S.kinds) or the mistakes/spaced-review queue, so 'Weakest patterns' in the weekly review ignores them.
- **Evidence:** weeklyReview() pats empty after 90 speed answers.
- **Fix:** On each answer update S.kinds[c.kind] and push misses into the review queue (respecting the drill's lower confidence, e.g. half weight).

### T19-39 · noisy / printout() (ui7.js)
- **What:** Add venous printouts (toVenous exists in e1.js) and make the header say 'Venous' so the learner practises the VBG→ABG conversion and spotting an arterial-labelled venous sample.
- **Evidence:** No venous sample in 600 draws; header always 'Arterial'.
- **Fix:** Use genCase(kind,lvl,{ven:true}) for ~30% and print 'Sample: Venous'; add 'Sample is venous, not arterial' as a bad-sample type.

### T19-40 · five (ui7.js)
- **What:** Adaptive time like Pattern flash: shorten from 8 s to 4 s as accuracy rises, with a personal-best flash on the results screen.
- **Evidence:** five has fixed lim=5000.
- **Fix:** Reuse the pflash lvl logic for five (store S.speed.five.lvl).

### T19-41 · handover (ui7.js)
- **What:** Let the learner type or dictate their own one-liner first, then reveal the model line and score it against a 4-item checklist (sample, read, cause, action).
- **Evidence:** Handover is MCQ only.
- **Fix:** Add a 'write it first' toggle; self-mark against the checklist.

