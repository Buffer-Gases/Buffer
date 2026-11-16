# T18 · Go deeper (Shifts, Teach it back, Gas sense, Number flash, Serial gases, Concept web)

**Covered:** I read all of the SCENARIOS (6 shifts, 25 decisions, 75 options and explanations), TEACH (12 prompts), the estNew() generators, FLASH (324 cards), SERIES (4 series, 12 gases) and WEB_NODES/WEB_EDGES (59 nodes, 77 edges). I checked every gas against Henderson–Hasselbalch and the app's rules (Winter's, 1/4/2/5, AG, osmolar gap, venous→arterial) by hand. I clicked through every shift and every series in Playwright (wrong answer first, then right), tested keyboard 1–4/Enter, flash swipe and arrow keys, the teach-back flow, the Gas sense lock and a 4,000-item simulation, and the concept-web tap/keyboard and teach hand-off. Viewports: phone 390 and desktop 1280; pixel and clinical skins; dark and light. No page errors.

**Verdict:** The clinical content of the shifts is strong and well cited. ADA 2024 K⁺ ≥ 3.5, BTS NIV, EXTRIP salicylate and HBO indications are all correct, and every gas except one is internally consistent. The main problems:
- **Gas sense:** the A–a verdict contradicts the app's own A–a rule.
- **Number flash:** swiping rates a card before its answer is shown.
- **Shifts:** XP is re-awarded every time the completion screen re-renders.
- **Concept web:** unreadable on phones.
- **Content:** a few small slips (DKA node, "alkalaemic" at pH 7.44, the COPD NIV threshold card).

**Score: 7/10.**

Counts: critical 0, major 7, minor 23, polish 11, idea 8.
Screenshots: `/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-*.png`

Sources: ADA/EASD/JBDS 2024 hyperglycaemic crises consensus (Diabetes Care 2024; CCJM 92(3):152, https://www.ccjm.org/content/92/3/152); BTS/ICS 2016 NIV guideline (Thorax 71:ii1); EXTRIP salicylate 2015.

## Critical
- None.

## Major
- **T18-1** `ui5.js` · Gas sense · estNew() A–a branch: The A–a verdict uses age/4 + 9 as the cut-off ('upper limit with tolerance'), so gradients between age/4+4 and age/4+9 are called 'normal'. That contradicts the app's own rule (A–a ≤ age/4 + 4) printed in the same sentence. 62 of 516 generated A–a items (12%) were labelled 'normal' although above the app's limit.
  - Evidence: Simulated 3,000 estNew() calls in page.evaluate. Example: 'PaCO₂ 45, PaO₂ 68, age 78 … A–a = 25. Expected ≤ 24 for age 78 (upper limit with tolerance 29): normal.'
  - Fix: Judge against age/4+4: `(a>age/4+4?'raised.':'normal.')`. Drop the '(upper limit with tolerance …)' phrase, or say 'borderline' for values within 5 above the limit.
- **T18-2** `ui5.js` · WEB_NODES 'dka': The node text 'HAGMA with Winter's compensation; potassium before insulin.' teaches a blanket rule. Potassium comes before insulin only when K⁺ < 3.5 mmol/L (ADA 2024 consensus). JBDS starts fixed-rate insulin at once and adds K⁺ to the fluids. The Shifts DKA step and the flash card kacid-1 get this right, so the web contradicts them.
  - Evidence: Concept web → DKA. Source: Umpierrez et al., Diabetes Care 2024 (summarised in CCJM 92(3):152): insulin 'should be postponed until a potassium level higher than 3.5 mmol/L is reached'.
  - Fix: Change it to 'HAGMA with Winter's compensation; check K⁺ first and hold insulin if K⁺ < 3.5.'
- **T18-3** `ui5.js` · Serial gases · SERIES 'asa' point 3 (5 hours): The correct answer and its explanation call pH 7.44 'alkalaemic again' and say 'alkalinisation is doing its job'. pH 7.44 is within the normal range, not alkalaemia. The usual serum target during alkalinisation is pH 7.45–7.55, so the target has not yet been reached.
  - Evidence: SERIES asa pts[2]: g {pH 7.44, PCO₂ 30, HCO₃⁻ 20}. Correct option: 'Better: alkalaemic again with a closing gap'.
  - Fix: Either set pH to about 7.48 with HCO₃⁻ about 22, or reword to 'Better: pH back up and the gap closing. Keep the serum pH at 7.45–7.55 and the urine pH ≥ 7.5.'
- **T18-4** `shell.html` · .web-svg (Concept web on phone): .web-svg has min-width 760px, but the layout is 1287×1277 user units. On a 390 px phone the map scrolls sideways inside a 338 px card and the 12-unit labels render at about 7 px, which cannot be read. There is no zoom or pan, and the bottom nav covers part of the map.
  - Evidence: Phone 390×844: svg 760×754 px, wrap clientWidth 338, scrollWidth 772. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-phone-web-co.png
  - Fix: On narrow screens, add a list fallback (topics → nodes → links, which the detail card already supports), or pinch-zoom/pan on the SVG with the selected node centred. At minimum, set min-width to about 1100px so the text is about 11 px, and centre the scroll on the selected node.
- **T18-15** `kit.js` · flash swipe (pointerup handler): Swiping an unflipped card flips it and then marks it 'Got it' or 'Again' 350 ms later, before the user has seen the answer. The keyboard path only rates after a flip. A mostly vertical mouse drag with 100 px of sideways drift is also rated, because dx is stored before the 'dy > dx' check.
  - Evidence: Desktop: drag the unflipped card 150 px right → FL.got 1, S.flash has 1 entry, and the answer was never shown. Drag (+100, +300) → FL.i 1→2, got 2.
  - Fix: When !FL.flipped, a swipe should only flip, with no rating. Track the dominant axis and ignore pointerup when |dy| > |dx|. Add a pointercancel handler that resets the card.
- **T18-16** `c3.js` · lesson racid keys[2] (flash card racid-2): The card 'NIV trigger (COPD): pH < 7.35, PaCO₂ > 45' disagrees with BTS/ICS 2016 (PaCO₂ > 6.5 kPa ≈ 49 mmHg, after optimal medical therapy). The app's own COPD shift quotes 6.5 kPa.
  - Evidence: Number flash card racid-2. BTS/ICS acute hypercapnic respiratory failure guideline 2016 (Thorax 71:ii1).
  - Fix: Change it to 'pH < 7.35 and PaCO₂ > 6.5 kPa (≈ 49 mmHg) despite optimal medical therapy'.
- **T18-22** `ui5.js` · RENDER.scen completion branch: The completion branch writes S.scen and calls addXP() on every render. Going away and back (or anything that re-renders the view) re-awards the XP and overwrites the saved date.
  - Evidence: openScenario('co'); SC.i=steps.length; RENDER.scen(); then go('today'), go('scen') twice: XP 30 → 90.
  - Fix: Award XP and save once, in the Next handler that moves past the last step (or guard with SC.saved=true). Keep the best run (fewest wrong turns) in S.scen rather than overwriting it.

## Minor
- **T18-5** `ui5.js` · RENDER.web · edge-label layer: Edge labels are drawn before the node boxes, so nodes cover them: 'ketoacidosis' shows as 'oacidosis' under Toxic alcohols, and 'phosphate, urate, acids' runs into Albumin. Labels sit at the exact midpoint with no background.
  - Evidence: Select HAGMA on desktop. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-desk-web-light-clinical.png
  - Fix: Draw the labels after the nodes, give each a background rect (paint-order stroke with --surface), and nudge labels that overlap a node box.
- **T18-6** `ui5.js` · WEB_EDGES co/coox: There is a duplicate edge: ['coox','co','measures COHb'] and ['co','coox','needs co-oximetry']. The CO detail card lists Co-oximetry twice, two labels are stacked on one line, and the header counts 77 links where there are 76 distinct pairs.
  - Evidence: Concept web → Carbon monoxide shows two Co-oximetry buttons. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-desk-web-co.png
  - Fix: Merge them into one edge, e.g. ['co','coox','SpO₂ blind; co-oximetry measures COHb'].
- **T18-7** `ui5.js` · Concept web intro / WEB_EDGES direction: The intro promises 'what it depends on, what it changes', but edges have no direction and the detail card lists all links as one undifferentiated set.
  - Evidence: RENDER.web text vs WEB_EDGES data (no direction field is used in rendering).
  - Fix: Treat [a,b] as a→b ('a feeds b') and split the detail card into 'Builds on' and 'Leads to', with arrowheads on the active edges. Otherwise reword the intro to 'see what it is linked to and why'.
- **T18-8** `ui5.js` · WEB_NODES 'comp', 'winters' topic: 'Compensation rules' and 'Winter's formula' are filed under topic 'kid' (Kidneys). Winter's is respiratory compensation, and the node covers both lungs and kidneys.
  - Evidence: WEB_NODES entries 35–36 (topic 'kid'). Legend colour: green Kidneys.
  - Fix: Move both to 'dis' (Disorders), or add a 'Rules' topic.
- **T18-9** `ui5.js` · WEB_NODES 'toxalc': 'ADH turns methanol and ethylene glycol into formic and glycolic acid.' ADH only makes the aldehydes; aldehyde dehydrogenase makes the acids. Oxalate, the renal toxin, is not mentioned.
  - Evidence: Concept web → Toxic alcohols.
  - Fix: Change it to 'ADH, then ALDH, turn methanol into formic acid and ethylene glycol into glycolic and oxalic acid.'
- **T18-13** `ui5.js` · RENDER.web keyboard: After Enter on a focused node, RENDER.web rebuilds innerHTML and focus drops to <body>, so keyboard users lose their place in the 59-node map.
  - Evidence: Desktop: focus .web-n[data-id=winters], press Enter; document.activeElement is BODY.
  - Fix: After re-render, focus the same .web-n or the detail heading (tabindex=-1).
- **T18-17** `c1.js` · lesson 'learn' keys (flash learn-0..2): Three app-meta 'facts' go into the Number flash deck: 'Weakest step in audits: Compensation (≈ 47% correct)', 'Reflex target: 90% correct, < 8 s' and 'Review spacing: 1·3·7·16·35 days'. These are not blood-gas knowledge, and the 47% is an unsourced statistic.
  - Evidence: FLASH dump: ids learn-0, learn-1, learn-2.
  - Fix: Exclude lesson 'learn' from FLASH in ui5.js (filter l.id!=='learn'), or tag lesson keys with noflash:true.
- **T18-18** `ui5.js` · FLASH build: There are about 20 duplicate facts among the 324 cards: ph-1/nph-0, lactate-0/nlac-0, ketones-0/dka-0, preanal-0/tc-bubbles-0, preanal-1/tc-bubbles-1, oxim-2/oxread-0, comp-0/rule-0, comp-1/rule-1/malk-2, nderived-0/rule-4, alkmaint-1/malk-0/vomit-1, sites-1/tc-radial-2, oxim-1/methb-0, alv-1/sp-elder-1, arrest-0/icu-rosc-1, microbes-0/sepsis-0, copd-0/co2vent-2/sp-ohs-2. Each is scheduled separately, which inflates reviews.
  - Evidence: FLASH dump (324 cards).
  - Fix: De-duplicate by normalised back text plus a similar front, keeping the first. The hand-written 'Core rules' cards could replace comp-0/1/2.
- **T18-21** `ui5.js` · flashRate / RENDER.flash empty state: 'Deck done' persists: leave and come back and you still see the old 'Deck done · 19 of 20' screen instead of a fresh deck or the due count. The card also has no progress bar, only the eyebrow text.
  - Evidence: Finish a deck, go('today'), then go('flash'): the same 'Deck done' text.
  - Fix: On go('flash') with FL.done, rebuild the deck if more than 0 cards are due, or show 'N due now · Another deck'.
- **T18-23** `ui5.js` · Shifts state: A shift in progress lives only in memory (SC). A reload or PWA restart loses it, and the tile gives no hint of a half-done shift.
  - Evidence: Leave mid-shift → come back works in-session. Reload → back to the list.
  - Fix: Persist SC (id, i, tried, wrong) in S.scenRun and show 'Resume (decision 3/5)' on the tile.
- **T18-24** `ui5.js` · SCENARIOS dka step 1: The prompt says 'VBG and bedside ketones' but no ketone value is shown on the slip, so the learner cannot confirm DKA from the data given.
  - Evidence: Shifts → DKA at 3 a.m., decision 1. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-desk-scen-dka.png
  - Fix: Add 'Bedside ketones 5.8 mmol/L' to the prompt text, or show bhb on the slip if slip() supports it.
- **T18-25** `ui5.js` · SCENARIOS dka step 4 gas: The day-2 gas has no sample field, so it is shown as ARTERIAL, while the earlier gases in the same story were venous. Patients recovering from DKA are rarely re-stabbed for an ABG.
  - Evidence: SCENARIOS[1].steps[3].gas has no sample:'v'.
  - Fix: Add sample:'v' and recheck the AG note (AG ≈ 11 with venous HCO₃⁻ 15.8).
- **T18-27** `ui5.js` · SCENARIOS meth step 4 explanation: 'Measure ethanol too (it adds ≈ 1 mOsm per 4.6 mg/dL)' gives a mg/dL factor in an app that uses mmol/L for urea and glucose in the same osmolar gap formula.
  - Evidence: Shifts → Three men, one bottle, decision 4.
  - Fix: Add 'ethanol in mmol/L adds ≈ 1 mOsm/kg per mmol/L (≈ 1.25 empirically); in mg/dL divide by 4.6'.
- **T18-28** `ui5.js` · SCENARIOS copd step 2: The correct option says 'nebulised bronchodilators' without saying air-driven. BTS advises driving nebulisers with air (with nasal O₂) in hypercapnic COPD, the very trap this shift teaches.
  - Evidence: SCENARIOS copd steps[1] option 1.
  - Fix: Change it to 'air-driven nebulised bronchodilators (with nasal oxygen to target)'.
- **T18-31** `ui5.js` · RENDER.serial keyboard: The serial gas options show <kbd>1–4</kbd> numbers, but no key handler exists (only scen and flash have one), so pressing 1–4 does nothing.
  - Evidence: Desktop: open any serial, press '1': SR.ans stays {}.
  - Fix: Add a keydown handler for VIEW==='serial' that mirrors the scen handler (1–4 answer, Enter for Next).
- **T18-32** `ui5.js` · SERIES sep point 2: Lactate rises 4.2 → 5.5 while the AG barely moves (19 → 19.5) and HCO₃⁻ falls only 0.5. Inconsistent for a teaching series about rising lactate.
  - Evidence: SERIES sep: Cl 104 and Na 138 are constant across all three gases.
  - Fix: At 2 h use HCO₃⁻ about 13.5 and PCO₂ about 28 (Winter's 28 ± 2, pH ≈ 7.31), giving an AG of about 20.5, or keep the lactate rise smaller.
- **T18-33** `ui5.js` · RENDER.serial full(): full() silently adds albumin 40 g/L to every serial gas that has Na and Cl, and the slip shows it as a measured value. In the sepsis series, assuming a normal albumin is exactly the trap the app teaches elsewhere ('Albumin: correct the gap').
  - Evidence: Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-phone-serial.png shows 'Albumin 40' on each sepsis gas.
  - Fix: Pass the assumed albumin to the AG maths but do not print it, or give the sepsis series a real low albumin (e.g. 28) and ask about the corrected gap.
- **T18-35** `ui5.js` · SERIES options design: In every serial question the correct option is the longest and most specific, and the distractors are one-word options ('Unchanged', 'Nothing', 'Worse'). This is a length tell; most questions can be answered without reading the gas.
  - Evidence: All SERIES pts have a:0 and the right option is about 3× longer than the others.
  - Fix: Write distractors of matching length with plausible wrong reasoning, e.g. 'Better: the PCO₂ is back in the normal range, so he is less acidotic'.
- **T18-36** `ui5.js` · estNew() 'ph' branch in kPa mode: With units set to kPa, the question shows 'PCO₂ 4.7 kPa', but the working silently switches to mmHg: 'Ratio 22 ÷ (0.03 × 35)'. The A–a item shows bare mmHg numbers with no unit in kPa mode.
  - Evidence: S.units='kPa'; estNew() until k==='ph': text 'PCO₂ 4.7 kPa', work '0.03 × 35'.
  - Fix: In kPa mode, write the working as '0.23 × 4.7' and label the A–a inputs with their unit, or convert them.
- **T18-37** `ui5.js` · RENDER.est default slider position: The slider starts at the midpoint, and locking without moving it scores 'close' 24–27% of the time for Winter's, corrected AG and A–a (14% for pH). That inflates the 'gas sense %' shown in Progress.
  - Evidence: Simulated 4,000 items: centre-guess hits winters 193/715, agc 162/683, aa 161/681, ph 168/1216.
  - Fix: Start the thumb at a random position, or require at least one input event before 'Lock it in' is enabled.
- **T18-41** `ui5.js` · TEACH 'delta' rubric vs WEB 'mixed': The rubric says '1–2: pure high-gap' and '< 0.8: added NAGMA', leaving 0.8–1 unclassified. The 'mixed' node says 'outside 0.8–2'. The standard bands are < 0.4 pure NAGMA, 0.4–0.8 mixed, 0.8–2 pure HAGMA, > 2 added alkalosis.
  - Evidence: TEACH[3].rub vs WEB_NODES mixed.
  - Fix: Change the rubric to '0.8–2: a pure high-gap acidosis (DKA nearer 1, lactate nearer 1.6)'.
- **T18-42** `ui5.js` · TEACH lesson mapping: TEACH 'ag' and 'delta' share lesson 'nderived'. renderLesson() and the kit long-press menu use TEACH.find(t=>t.lesson===id), so the Δ ratio teach-back can never be launched from its lesson.
  - Evidence: ui1.js:173 and kit.js:25 use .find, which returns the first match only.
  - Fix: Use filter() and show one button per prompt, or launch the teach pool filtered by lesson.
- **T18-43** `ui5.js` · RENDER.teach 'Another prompt': 'Another prompt' picks at random from the due pool and can return the same prompt again. With only 12 prompts this happens often.
  - Evidence: tbSkip → TB=null → random pick, with no exclusion of the current item.
  - Fix: Exclude the current item.c when re-picking.

## Polish
- **T18-10** `ui5.js` · WEB_NODES 'calc': '…so a mismatch means a copying error' is ambiguous: a mismatch between what? A gas HCO₃⁻ against the lab total CO₂ differs by 1–2 normally and is not a copying error.
  - Evidence: Concept web → Calculated HCO₃⁻.
  - Fix: Change it to 'The analyser calculates HCO₃⁻ from pH and PCO₂, so if the three written values fail Henderson's check, a number was copied wrongly.'
- **T18-11** `ui5.js` · WEB_EDGES temp→calc: The label 'reports at 37 °C' sits on a link to Calculated HCO₃⁻ only. Temperature affects pH, PCO₂ and PO₂ directly, so this is the weakest link to show.
  - Evidence: WEB_EDGES ['temp','calc',…]. Temperature has only this one link.
  - Fix: Link temp → pco2 ('measured at 37 °C') and temp → odc ('hypothermia shifts left').
- **T18-12** `shell.html` · Concept web topic colours: The Disorders topic colour is the same orange as --accent, which also marks the selected and linked nodes. When a Disorders node is selected, linked and unlinked Disorders nodes look alike. Topics are also scattered across the layout, so the colour legend shows no clusters.
  - Evidence: Desktop dark. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-desk-web.png
  - Fix: Give --w-dis a non-accent hue (e.g. magenta). In webLayout, add a weak pull towards each topic's sector centre so topics cluster.
- **T18-19** `c10.js` · lesson icu-trouble keys[1]: The card front 'Peak ↑ plateau =' reads as a broken sentence on the flash card ('=' meaning unchanged).
  - Evidence: Flash card icu-trouble-1.
  - Fix: Change it to 'Peak ↑, plateau normal'.
- **T18-20** `c1.js` · lesson ketones keys[2]: 'Urine strip detects: Acetoacetate only.' The nitroprusside strip also reacts weakly with acetone. The teaching point is that it misses BHB.
  - Evidence: Flash card ketones-2.
  - Fix: Change it to 'Acetoacetate (and acetone), not BHB'.
- **T18-26** `ui5.js` · SCENARIOS heat step 2 gas: The VBG is internally inconsistent: pH 7.29 with PCO₂ 30 and HCO₃⁻ 13 gives a Henderson–Hasselbalch pH of 7.26 ([H⁺] 55 vs 51 nmol/L). The app teaches the consistency check elsewhere (Calculated HCO₃⁻ node). Every other scenario and serial gas checks within 0.01.
  - Evidence: 6.1 + log(13 / (0.03 × 30)) = 7.26.
  - Fix: Use pH 7.26 (then estimated arterial 7.29) or HCO₃⁻ 14.
- **T18-29** `ui5.js` · SCENARIOS co step 2 explanation: 'COHb 24% in a non-smoker', but the intro never says the workers are non-smokers.
  - Evidence: Shifts → Generator in the camp.
  - Fix: Say 'both non-smokers' in the intro, or change the line to 'far above even a heavy smoker's 10%'.
- **T18-34** `ui5.js` · SERIES dka story: The story 'Fluids, potassium, then fixed-rate insulin' with arrival K⁺ 5.2 implies potassium is given before insulin. At K⁺ 5.2, insulin is not delayed, and JBDS adds no K⁺ to the fluids above 5.5.
  - Evidence: SERIES[0].story with pts[0].g.k = 5.2.
  - Fix: Change it to 'Fluids, then fixed-rate insulin, with potassium added once K⁺ < 5.5.'
- **T18-38** `ui5.js` · estNew() 'agc' working: When albumin > 40 the working reads 'Correction + 0.25 × (40 − 41) = -0.2 → 19.8': a plus sign followed by a negative value, a hyphen instead of a minus sign, and -0.25 rounded to -0.2.
  - Evidence: Example from the kpa.json run: Na 137, Cl 96, HCO₃⁻ 21, alb 41.
  - Fix: Format the signed correction with '−' and one decimal place, e.g. '− 0.25'. Alternatively, keep albumin ≤ 40 in the generator.
- **T18-39** `ui5.js` · estNew() 'aa' realism: PaO₂ can be generated as low as 17–21 mmHg on room air in a patient described only by numbers (PaCO₂ 70, A–a 45). This is unrealistic, and a value that low would be a peri-arrest gas.
  - Evidence: Simulation: min PaO₂ 21 in 4,000 items; the code range allows 17.
  - Fix: Keep PaO₂ ≥ 40 (re-roll), or cap the A–a so that PaO₂ stays ≥ 45.
- **T18-40** `shell.html` · Gas sense .est-track: Before locking, a second track under the slider repeats the thumb position, so two bars show the same thing. The second one only becomes useful after locking.
  - Evidence: Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-phone-est.png
  - Fix: Hide .est-track until ES.shown, or merge the answer band into the range input's background.

## Ideas (ranked by value)
- **T18-46** `ui5.js` · RENDER.serial trend view: On a phone the serial gases stack vertically, so by the third gas the learner scrolls past two full slips to compare them. The point of the feature is the change between gases.
  - Evidence: Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T18-phone-serial.png
  - Fix: Add a compact trend table (time × pH, PCO₂, HCO₃⁻, AG, lactate) with ↑/↓ arrows above the question, and collapse the earlier slips.
- **T18-44** `ui5.js` · TEACH model answer: Self-grading shows only terse key points. A short model explanation (3–4 sentences) after grading would show what a good teach-back sounds like and make honest ticking easier.
  - Evidence: TEACH items have q and rub only.
  - Fix: Add an 'ans' field and show it under the rubric once Save is pressed (or behind 'See a model answer').
- **T18-45** `ui5.js` · TEACH coverage: Only 12 of 59 concept nodes have a teach-back prompt, so 'Teach it back' is missing from most concept cards. High-yield gaps: DKA, salicylate, CO, RTA/UAG, osmolar gap, base excess, VBG→ABG conversion, Bohr/Haldane.
  - Evidence: TEACH.length 12; WEB_NODES 59.
  - Fix: Add 8–12 prompts for these nodes.
- **T18-48** `ui5.js` · Shifts: more branches: The shifts are linear: a wrong turn shows a consequence and then you retry the same step, which does not really branch. One or two true branches per shift (e.g. intubating the salicylate patient on standard settings leads to a worse gas at the next step) would match the 'branching' promise.
  - Evidence: SCENARIOS steps are a flat array.
  - Fix: Allow an option to set next:'stepId' and add one consequence gas per shift.
- **T18-14** `ui5.js` · WEB_EDGES missing links: Eleven nodes have only one link (pio2, solub, temp, og, dlac, fixed, uosm, be, lowag, preanal, rhabdo), and some obvious links are missing: co→odc (left shift), sepsis→hagma, rhabdo→aldo/K⁺, vq→rf, be→hagma.
  - Evidence: Degree count from WEB_EDGES.
  - Fix: Add co→odc 'left shift', sepsis→hagma 'lactic', vq→rf 'type 1', preanal→pco2/po2 'bubble, delay', be→hagma 'base deficit', solub→pco2 'why CO₂ diffuses easily'.
- **T18-30** `ui5.js` · SCENARIOS meth step 3: The action step leaves out sodium bicarbonate for the acidosis (pH < 7.3 is the usual trigger in methanol, which reduces formate entry to tissues).
  - Evidence: Shifts → Three men, decision 3.
  - Fix: Add 'IV bicarbonate for pH < 7.3' to the correct option and explanation.
- **T18-47** `ui5.js` · Serial gases finish: Finishing gives only a toast ('3 of 3 right') and returns to the list. There is no recap of the trajectory and no prompt to try the matching shift or concept.
  - Evidence: srNext on the last point → toast, then SR=null.
  - Fix: Add a finish card with the trend sparkline, the one-line lesson of the series, and links to the related shift or concept node.
- **T18-49** `ui5.js` · Number flash: typed recall: For numeric cards, an optional typed answer (e.g. 'P50 ≈ ?' → 27) before flipping would make recall measurable instead of self-rated.
  - Evidence: FLASH cards are all self-rated.
  - Fix: Add a 'type it' toggle for cards whose back starts with a number, with fuzzy matching ±10%.
