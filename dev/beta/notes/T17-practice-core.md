# T17 — Practice core (ui2.js)

## Summary
Covered: Practice tab (desktop, phone, pixel/dark and clinical/light), Mixed, Step by step, Quick read, Which gas fits?, Reflex, Compensation gym, Revisit mistakes, Due review, Gas of the day, module checks (Quiet-mode 'Check ·' renaming works), and the Final. Also hints (fading and H), feedback arithmetic, error autopsy, calibration, keyboard shortcuts, the summary, leaving mid-session and Back. I played sessions in headless Chromium and ran a generator sweep (2,940 strict cases plus non-strict samples). No answer was missing from its options, no option was duplicated, and there were no page errors. Arithmetic in the feedback checked out (Winter's, 0.7×+20, 1/4 and 2/5 per 10, AG with albumin, Δ ratio, A–a).

Verdict: the engine and the marking are mostly sound, and the step feedback is excellent. But one systematic clinical error appears in every HAGMA + respiratory alkalosis case. Due review serves unsolvable gases at low levels. Quick read and Reflex serve borderline gases. A few flow bugs remain: the H-key penalty and timed runs lost on leaving.

Score: 6.5/10. Counts: {'critical': 1, 'major': 7, 'minor': 12, 'polish': 7, 'idea': 5}.

## Critical
### T17-1 · e1.js · interp() step 'comp' (ralk branch) / KINDS hag_ralk, hag_malk_ralk
- **What:** In mixed HAGMA + respiratory alkalosis gases (salicylate, early sepsis, acute liver failure, DKA + pneumonia, salicylate + vomiting), the step-by-step Compensation question marks 'Chronic, renally compensated' as the right answer. In my generator sweep, 179/180 hag_ralk and 119/120 hag_malk_ralk cases had primary = respiratory alkalosis and compensation = 'Chronic, renally compensated'. A low HCO3 caused by an acute organic acidosis is being taught as days-old renal compensation, and a learner who answers 'HCO3 too low → added metabolic acidosis' is marked wrong.
- **Evidence:** Sweep: 60 strict cases per kind per level through safeCase+buildQs. Example: '29-year-old with tinnitus and vomiting after an overdose of an unknown painkiller', pH 7.43, PCO2 22, HCO3 14.2, Na 135, Cl 97, alb 19. Q3 answer 'Chronic, renally compensated' (acute 20.4, chronic 15, measured 14.2), then AG 29.1 high. Winter's for HCO3 14.2 gives 29±2, so the PCO2 of 22 is itself an added respiratory alkalosis.
- **Fix:** In interp(), compute the anion gap before the compensation verdict. When the primary process is respiratory alkalosis (or acidosis) and the corrected AG is high, do not award 'c'/'p' timing. Set compKey 'mac' ('HCO3 too low → added metabolic acidosis'), or for a normal/near-normal pH treat it as primKey 'two', and add a step note ('a high gap means the low HCO3 is an acid load, not renal compensation'). Add hag_ralk and hag_malk_ralk REFCASES (e.g. pH 7.43/22/14.2, Na 135, Cl 97) that assert compKey !== 'c'.

## Major
### T17-2 · ui2.js · chooseKind() 'due' branch; startSession('due')
- **What:** Due review ignores the difficulty level. A pattern that became due at level 3–4 (hag_malk, hag_nag, hag_malk_ralk) is served at level 1–2, where slip() hides Na, Cl and albumin and no gap question is asked. The gas cannot be solved: the answer 'Metabolic acidosis + metabolic alkalosis' has to be read off a normal-looking pH/PCO2/HCO3.
- **Evidence:** S.lvl=1; S.kinds={hag_malk:{n:1,c:0,box:0,due:1,last:1}}; startSession('due') → kind hag_malk, slip shows only pH, PvCO2, HCO3. Questions: pH 'Normal pH', primary 'No primary disturbance', read 'Metabolic acidosis + metabolic alkalosis'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-phone-due-l1.png
- **Fix:** In the due branch, filter dueKinds() by kindsFor(sess.lvl), as the 'today' branch already does. Or run due items at max(S.lvl, KINDS[k].lv>=3?3:S.lvl) and pass that level to slip() and buildQs(). Make the 'N due' banner count only the kinds playable at the current level, or say 'N due (some need level 3)'.

### T17-3 · ui2.js · nextItem() quick branch (strict:m!=='quick'); reflex branch genCase(...) without strict
- **What:** Quick read and Reflex draw non-strict cases, so many gases sit on a decision boundary: Winter's edge, the acute/chronic band, AG 14±2 or Δ ratio cut-offs. The marked 'one right answer' is then only marginally right. That is unfair in a timed mode and teaches false precision. In a sweep, 30–97% of non-strict cases per kind failed clearCut(); for example hag_malk at level 4 failed 58/60.
- **Evidence:** genCase('hagma',4,{}) gave pH 7.22, PCO2 23, HCO3 9 with Winter's band 19.5–23.5. The PCO2 is 0.5 mmHg inside the edge, yet it is marked 'High anion gap metabolic acidosis', and interp's own 'unsure' note says a second process is possible. Sweep table: borderQuick (non-strict cases that fail clearCut) 2:hagma 38/60, 2:rac_c 51/60, 4:hag_nag 55/60.
- **Fix:** Pass {strict:true} in the quick branch (safeCase(...,{strict:true})) and in the reflex genCase call. If variety drops, keep strict but widen rnd ranges in rawCase rather than serving ambiguous gases.

### T17-4 · ui2.js · useHint() / keydown 'h' handler
- **What:** Pressing H when the hint is already auto-open (hintMode 'open', the default for new users and for weak steps) sets C.assist[i]=1. A correct answer is then marked ✗ 'Right, with a hint.', counted as a miss, saved to mistakes, and resets the pattern's spaced-review box to 0, even though the hint was showing anyway.
- **Evidence:** Fresh state, startSession('steps'). Q1 hint visible (hintMode 'open'). Press 'h', then answer correctly → qblock class 'qblock miss', text 'Right, with a hint.', assist=1. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-steps-hintH.png
- **Fix:** In useHint(i), return early if hintMode(C.q[i].cat)==='open' (the hint is already showing and is not penalised). Also return early when hintMode is 'off', so 'never' really means never, unless that bypass is intended (then label it).

### T17-5 · ui2.js · leaveSession() / go() away from 'session'
- **What:** Leaving a session through the tab bar (or any go()) silently drops it. There is no summary, no S.sess entry and no way to resume, and the answered gases vanish from session history (step stats are still recorded). For timed Boss/Final runs, leaveSession clears the clock but leaves SS live. If the session view is re-entered, the countdown is frozen and the deadline never fires.
- **Evidence:** startSession('final'); answer 1; go('today'); go('session') → #bT reads 9:58 and still 9:58 1.6 s later. Nothing in the UI offers 'Resume' or ends the run.
- **Fix:** On leaving with SS.res.length>0 and !SS.done, call finishSession(true) silently (store S.sess), or keep SS and show a 'Resume session (3/10)' banner on Practice and Today. On resume, restart the clock interval when SS.deadline is set (move the setInterval into a startClock() used by both startSession and RENDER.session). Ask for confirmation before leaving a timed Boss/Final.

### T17-6 · ui2.js · nextItem() final branch: why: comp.v+'. '+comp.d; reflexAnswer() wrong branch
- **What:** Wrong-answer feedback in the Final (and in Reflex) explains only the compensation step. Most distractors differ by gap or Δ-ratio findings ('HAGMA + metabolic alkalosis' vs 'Metabolic alkalosis'), so the learner is never shown why their pick was wrong. Reflex shows comp.d without its verdict ('Measured 17.8.' but never 'so chronic') and, at level ≥3, only gap.v without the arithmetic.
- **Evidence:** Final: '80-year-old with heart failure on high-dose furosemide', picked 'HAGMA + metabolic alkalosis'. Feedback: 'Appropriate respiratory compensation. Expected PCO₂ = 0.7 × 42 + 20 …' with no AG (142 − (88+42) = 12, normal). Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-final-wrong.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-reflex-wrong.png
- **Fix:** Build the why from all decisive steps: comp.v + comp.d, then gap.v + gap.d (when the label or the chosen distractor involves HAGMA/NAGMA/hidden alkalosis), then the Δ ratio when present. Better: render stepsHTML(c.o) in a collapsible 'Show the full working' under the answer, as caseFeedback does.

### T17-7 · shell.html · .dgrid .card.stick (session case card) at phone width
- **What:** On a phone, the gas slip and vignette scroll off-screen as soon as you reach step 3–4. To answer the gap, Δ ratio or oxygenation questions, the user has to scroll back up for Na/Cl/albumin/PaO2, then down again for every step.
- **Evidence:** 390×844, clinical light, startSession('steps') at level 3, answer 3 steps: the slip is not visible while 'Anion gap (corrected for albumin)?' is asked. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-phone-steps-mid.png
- **Fix:** Under 700px, make the slip a compact sticky strip (pH / PCO2 / HCO3 / Na / Cl / Alb / PaO2 in one or two mono lines) at the top of the session card, or add a 'Show gas' floating button that opens the slip in a sheet. Keep it visible while answering.

### T17-8 · e1.js · KINDS.ralk_c 'alt' vignette + rawCase oxygen (o:'n')
- **What:** 'Healthy resident of a high-altitude city, pre-operative gas' is generated with a room-air PaO2 of 101–111 mmHg and graded 'Normal / adequate oxygenation' at Patm 760. A resident sampled at altitude has a PaO2 around 55–65 mmHg at 3,600 m, so the case teaches an impossible gas, and the oxygenation question becomes unrealistic.
- **Evidence:** genCase('ralk_c',4,{strict:true}) with cause 'alt': po2 104, 101, 111 on FiO2 0.21; ox.cat 'normal'.
- **Fix:** For 'alt', generate with a local barometric pressure (e.g. patm 495 mmHg for ~3,600 m) passed to rawCase and interp. Show 'Barometric pressure 495 mmHg' on the slip and expect a low PaO2 with a normal A–a. Alternatively, reword the vignette to 'flew down to sea level yesterday', which also makes chronic compensation still plausible.

## Minor
### T17-9 · e1.js · KINDS nagma 'tolu' and malk 'conn' vignettes vs k ranges
- **What:** Vignettes quote exact potassium values that the slip then contradicts: 'K⁺ 2.3' (toluene) is generated as 2.1–2.6, and 'K⁺ 2.9' (Conn's) as 2.6–3.1.
- **Evidence:** Sweep: '19-year-old with paint on his hands, profound weakness and K⁺ 2.3' → slip K 2.6 / 2.5 / 2.4; '39-year-old with resistant hypertension and K⁺ 2.9' → slip K 2.7.
- **Fix:** Drop the number from the vignette ('profound weakness and very low K⁺'), or set k:[2.3,2.3] and k:[2.9,2.9].

### T17-10 · e1.js · KINDS ralk_c 'etohw' (alcohol withdrawal, last drink 36 h)
- **What:** (Doubt) The alcohol-withdrawal vignette is always graded 'Chronic, renally compensated' respiratory alkalosis. Renal compensation for respiratory alkalosis takes about 2–3 days to complete, so at 36 hours 'partly compensated' is more defensible. Marking 'Partly compensated' wrong here is questionable.
- **Evidence:** Played case: '44-year-old, last drink 36 hours ago: tremor, sweating, RR 26', pH 7.43, PCO2 25, HCO3 16.2 → answer 'Chronic, renally compensated'. Adrogué & Madias, NEJM 1998;338:107 (respiratory alkalosis compensation complete over 2–3 days).
- **Fix:** Move 'etohw' to ralk_a or a new partly-compensated kind, or change the vignette to 'drinking heavily, withdrawal for 4 days'.

### T17-11 · e1.js · rawCase() random hypoalbuminaemia (20% chance alb 18–28)
- **What:** Any patient can get albumin 18–28 g/L, including the 22-year-old with a panic attack, the healthy pregnant woman and the 29-year-old overdose. This is unrealistic and makes albumin correction look random rather than tied to the story (sepsis, cirrhosis, nephrotic, ICU).
- **Evidence:** Example: salicylate case in a 29-year-old with alb 19 g/L (sweep output).
- **Fix:** Give each vignette an optional alb range (cirrhosis, sepsis, ICU, elderly: low; young and well: 38–46) and drop the global 20% roll.

### T17-12 · ui2.js · caseFeedback() head: STEPNAME[x].toLowerCase()
- **What:** Lowercasing step names breaks the 'pH' symbol: the verdict reads 'Missed: ph.'
- **Evidence:** Steps session, answer the pH question wrong → 'Missed: ph.' Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-steps-feedback.png
- **Fix:** Lowercase only the first letter when it is not part of a symbol (e.g. keep 'pH', 'Δ ratio'), or don't lowercase at all: 'Missed: pH, Cause.'

### T17-13 · ui2.js · fitHTML() feedback: F.c.label.toLowerCase()
- **What:** Which gas fits? feedback lowercases acronyms: 'Acute pulmonary oedema with shock gives hagma + respiratory acidosis', 'DKA day 2 after saline resuscitation gives hagma + nagma.'
- **Evidence:** startSession('fit'), answer any mixed-label case. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-fit-wrong.png
- **Fix:** Use a helper that lowercases only the first character when the label does not start with an acronym (labels are already sentence case), e.g. lab=/^[A-Z]{2,}/.test(l)?l:l[0].toLowerCase()+l.slice(1).

### T17-14 · ui2.js · sessionBar(): Math.min(SS.res.length+1,SS.n)
- **What:** While you read the feedback for case 1, the counter already says '2 / 5' (and the progress segment for case 2 is highlighted), because the result is pushed before the feedback is shown.
- **Evidence:** Steps session, finish case 1 → bar reads '2 / 5' with case 1 feedback on screen. Final: after a wrong first answer, the bar shows '2 / 12'. Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-steps-feedback.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-final-wrong.png
- **Fix:** Show SS.res.length when the current item is answered (cur finished / fit.ans != null / g ans != null), else res.length+1.

### T17-15 · ui2.js · answerQ() calibration: S.conf.push({c:C.conf,...}) with default conf 'think'
- **What:** Calibration is always recorded, with a default of 'Think' when the learner never touches the Sure/Think/Guess control. Untouched answers fill S.conf with fake 'think' data and flatten the calibration curve. The control is also mouse-only (1–4 are taken by answers).
- **Evidence:** caseHTML: SS.cur.conf initialised to 'think'; answering the read without clicking a confidence button pushes {c:'think'}.
- **Fix:** Initialise conf to null and record only when chosen (or require a choice before the read options are enabled). Add keys S/T/G for sure/think/guess and show them as <kbd> hints.

### T17-16 · ui2.js · gymItem() why strings in kPa mode
- **What:** With units set to kPa, gym explanations mix units: 'Winter's: 1.5 × 12 + 8 = 26 (± 2 → 3.2–3.7 kPa)' gives the result in mmHg without a unit, then the range in kPa. Respiratory items ask 'PCO₂ 8.9 kPa' but explain 'PCO₂ is 27 mmHg above 40'.
- **Evidence:** S.units='kPa'; gymItem() samples (see sweep).
- **Fix:** In kPa mode, write '= 26 mmHg (3.5 kPa) ± 2 mmHg → 3.2–3.7 kPa' and 'PCO₂ 8.9 kPa = 67 mmHg, 27 mmHg above 40 (5.3 kPa)'. Apply the same to hintFor('comp') and hintFor('real') (24 × PCO₂ only works in mmHg).

### T17-17 · ui2.js · gymItem() 'judge' why
- **What:** The 'Compensation?' gym explanation stops at 'Measured 39.' with no verdict, so a learner who got it wrong has to work out the link themselves.
- **Evidence:** 'HCO₃⁻ 16, measured PCO₂ 39 mmHg' → why 'Winter's: 1.5 × 16 + 8 = 32 ± 2 → 30–34. Measured 39.'
- **Fix:** Append ' → above the band: the lungs are not keeping up, so there is an added respiratory acidosis.' (and the equivalents for below / inside the band).

### T17-18 · ui2.js · keydown handler / sExit / popstate
- **What:** Escape, the ✕ button and the browser Back button end a session instantly with no confirmation. If no gas is completed yet, the partly answered case is thrown away (although its steps were already recorded in S.steps).
- **Evidence:** Phone, steps session, answer 3 steps of case 1, press Back → VIEW 'practice', SS null, no summary.
- **Fix:** Confirm ('End session? 3 steps answered') when the current item is partly answered or a timed run is active. Either count the partial case in the summary or don't record its steps.

### T17-19 · ui2.js · reflex: SS.lvl=S.reflex.lvl; finishSession 'Level N →'
- **What:** Reflex has no visible level control. The Difficulty selector does not apply to it, a learner cannot step down a level, and promotion happens only if they click 'Level N+1 →' on the summary of a run that just met the bar. If they miss that button, the tile keeps saying 'level 1' even though reflexStatus() knows they are automatic.
- **Evidence:** MODS_META('reflex') shows 'level '+(S.reflex.lvl||1); no other code changes S.reflex.lvl.
- **Fix:** Auto-promote when reflexStatus() >= S.reflex.lvl (with a toast). Add a small level picker (1–4, with automatic levels ticked) on the Reflex tile or at the session start.

### T17-20 · ui2.js · hintMode()/useHint() with S.hints==='never'
- **What:** (Possibly intended) With hints set to 'never', pressing H still reveals the hint.
- **Evidence:** S.hints='never'; startSession('steps'); press h → hint block rendered.
- **Fix:** Either block H when hints are off, or document in Settings that H still works on demand.

## Polish
### T17-21 · ui2.js · finishSession() buttons: 'Revisit '+S.mist.length+' mistakes'
- **What:** Plural is wrong for one: 'Revisit 1 mistakes'.
- **Evidence:** Summary after one missed gas: 'Revisit 1 mistakes'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-summary-early.png
- **Fix:** 'Revisit '+n+' mistake'+(n>1?'s':'').

### T17-22 · ui2.js · finishSession() stats label and case list for boss/final
- **What:** The Module check summary counts '10 GASES' for ten lesson questions, and the 'Cases' list repeats the module title ten times ('Oxygen, CO₂ and the lungs' ×10), so the learner can't see which questions they missed. Gym rows likewise all read 'Metabolic acidosis'.
- **Evidence:** startSession('boss',{mod:'gas'}), answer all → stats '10 gases', list of 10 identical titles. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-boss-summary.png
- **Fix:** Label the unit 'questions' for boss and 'sums' for gym. In SS.res, store the question stem (truncated to about 70 characters) as the label for boss/gym, and link misses to the source lesson (b.lesson exists in the pool).

### T17-23 · ui2.js · finishSession() msg for 1-item sessions (Gas of the day)
- **What:** Gas of the day (n=1) all right gives 'Strong session.', because 'Perfect session.' needs n>=5, and the 'session' wording is odd for a single gas.
- **Evidence:** acc===1 && n>=5 condition; gotd len=1.
- **Fix:** For gotd use dedicated copy: 'Today's gas: every step right. Same time tomorrow.' or 'Today's gas: missed X.'

### T17-24 · ui2.js · finishSession() 'mins' = max(1, round)
- **What:** Time shows '1 min' for a 10-second exit and rounds 1m29s down to '1 min'. Reflex and gym runs are short, so seconds matter.
- **Evidence:** Escape after one gas → '1 min'.
- **Fix:** Show m:ss under 10 minutes.

### T17-25 · ui2.js · autopsyHTML()
- **What:** Error-autopsy chips are four full-width dashed buttons stacked vertically under every wrong step. They take more height than the question itself and push the next question down. After one is tapped there is no acknowledgement apart from the 'on' state.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-steps-wrong.png
- **Fix:** Lay them out as an inline wrap row of small chips (flex-wrap, auto width), collapse to the chosen chip after selection ('Logged: arithmetic slip'), and add keys (Q/W/E/R or a/s/d/f).

### T17-26 · ui2.js · caseHTML() qn badge for 'Right, with a hint'
- **What:** A correct answer after a requested hint shows a red ✗ badge and red 'miss' styling next to the text 'Right, with a hint.' The message and the colour disagree.
- **Evidence:** Request a hint (button), answer correctly → ✗ + 'Right, with a hint.'
- **Fix:** Use a neutral/amber 'assisted' state (qblock class 'assist', badge '½' or '✓ꜝ') distinct from right and wrong.

### T17-27 · ui2.js · reflexAnswer() wrong feedback text
- **What:** The reflex explanation gives the comparison numbers but no conclusion: 'PCO₂ down 12 mmHg. Acute: HCO₃⁻ ≈ 21.6; chronic: ≈ 18. Measured 17.8.' It also never says why the chosen answer (here metabolic acidosis, with pH 7.43 on the alkaline side) is wrong.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T17-reflex-wrong.png
- **Fix:** Prefix with the pH logic and the verdict: 'pH 7.43 (alkaline side of 7.40) with low PCO₂ → respiratory alkalosis; HCO₃⁻ 17.8 matches chronic (≈18).'

## Ideas (ranked by value)
1. **T17-28** (newFit() distractor selection): Which gas fits? distractors share none of the target's disorders, so the right gas is usually the only one with the right pH direction and can be spotted without predicting anything (feedback even says 'The others share none of its disorders'). *Fix:* At level ≥3, include one 'near miss' gas that shares one component (e.g. HAGMA alone vs HAGMA + respiratory alkalosis for salicylate, acute vs chronic RAC for a COPD retainer). The feedback should then explain the discriminating number.
1. **T17-29** (buildQs() cause question): The cause question is answered from the vignette alone (the vignette names salicylate, antifreeze or diarrhoea). It tests reading, not gas-to-cause reasoning. *Fix:* Offer a 'blind cause' variant at level 4: hide the vignette until after the read and ask 'Which history fits this gas?' with causes from kinds sharing the same level-1 label, so the gap, osmolar gap, K⁺ or lactate must discriminate.
1. **T17-30** (practice tile set / MODES.gotd): Gas of the day is in MODES but has no tile in Practice, and Due review shows only when something is due. A learner on Practice cannot find either from there. *Fix:* Add Gas of the day as a small tile (with ✓ once done today, from S.ui.gotd), and a greyed 'Due review: next due dd/mm/yyyy' tile when nothing is due.
1. **T17-31** (finishSession() — next action): The summary names the weakest step but doesn't offer a one-tap targeted drill. *Fix:* Add a 'Drill <step>' button: for comp → gym; for gap/delta → a 5-gas steps session restricted to HAGMA/HAGMA+NAGMA/HAGMA+MALK kinds; for ox → level-4 quick with oxygenation only.
1. **T17-32** (keyboard shortcuts): Shortcuts exist (1–7, H, Enter, Esc) but are not discoverable; nothing on screen mentions Esc, H only shows on the closed-hint button, and the Steam Deck/desktop user has no cheat sheet. *Fix:* Add a '?' overlay listing keys and a one-line footer in the session ('1–6 answer · H hint · Enter next · Esc end').
