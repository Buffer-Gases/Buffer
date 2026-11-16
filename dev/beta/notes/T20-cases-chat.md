# T20: case library, chat cases (cases-chat)

**Covered:** all six chat cases in c12.js (ch-dka, ch-asa, ch-copd, ch-meth, ch-pca, ch-cord): every message, gas, question, option and explanation, checked against JBDS 2023, EXTRIP (salicylate, methanol), BTS 2017 oxygen, BTS/ICS 2016 NIV, ATS OHS 2019 and ACOG cord gases. Each gas was checked with Henderson-Hasselbalch and the app's own interp(). Engine checks in ui8.js covered library filters (all 4 axes and combinations), chat layout, keys 1-4 and Enter, autopsy chips, notebook add/remove/redo, completion screen, sources, #case-<id> deep links (fresh load and hashchange), and in-app and browser Back. Tested at 390x844, 820x1180 (light, clinical), 1280x800 and 1440x900 (dark, pixel). Scripts are in scratchpad/beta/t20/; screenshots are shots/T20-*.png.

**Verdict:** The cases are realistic, short and mostly accurate. All gases are internally consistent (computed pH within 0.01 of the stated value) and every question has exactly one right answer. The main content problems are one wrong guideline number (BTS/ICS NIV PaCO2 >45 instead of >6.5 kPa), an imprecise insulin/potassium rule, an incomplete DKA follow-up message (no Na, glucose drip timing), and a salicylate gas that the app's own interpreter reads as chronic compensation. On the engine side, the core flow works: filters, keys, deep link and Back are fine. But the completion screen re-records XP/runs on every re-render, autopsy reasons are lost on redo, and the notebook is awkward. **Score: 7/10.**

Findings: critical 0, major 6, minor 15, polish 11, idea 7.

## Critical
None.

## Major
- **T20-1** (ui8.js · caseEnd() / RENDER.cases): caseEnd() writes progress (S.cases[id].n++, S.sess.push, touchDay, addXP) every time the completion screen renders. Any re-render while CS sits past the last step counts the case again: XP, session count and run count inflate.  
  *Evidence:* Finish ch-meth (XP 20 -> 40), then go("today"); location.hash="#cases" -> completion screen re-renders, XP 60 and S.cases["ch-meth"].n=2. Calling RENDER.cases() on the completion screen: XP 15->30->45, sess 1->2->3 (run1.py/run2.py in scratchpad/beta/t20).  
  *Fix:* Record the result once, at the moment the last step is solved (e.g. in the csNext/Finish handler set CS.done=true and write S.cases/S.sess/XP there), and make caseEnd() purely render from CS. Guard with if(!CS.recorded){...;CS.recorded=1}.
- **T20-2** (ui8.js · caseStep [data-aut] handler): Autopsy chip ("Why did you pick it?") does nothing on a redo. The handler finds the notebook entry with (S.cmist).find(x=>x.key===cid:i:k), which returns the OLDEST entry with that key; if that one already has a why (or was removed), the new entry never gets its reason, yet the chip shows as pressed.  
  *Evidence:* Pick the same wrong option in ch-dka step 1 twice (first run and "Redo the case"), choose "Didn't know the rule" then "Arithmetic slip": S.cmist keys = ["ch-dka:0:1=rule","ch-dka:0:1=undefined"].  
  *Fix:* Store the new entry id on CS (e.g. CS.mid[CS.i+":"+i]=entry.id in caseAnswer) and have the chip look it up by id; or use findLast with !x.del. Count S.why only once per entry.
- **T20-3** (c12.js · ch-copd step 3 (NIV) explanation): Wrong NIV threshold: the right-answer text says "pH below 7.35 with PaCO2 above 45 after optimal medical treatment: BTS/ICS criteria for NIV". BTS/ICS 2016 uses PaCO2 > 6.5 kPa (about 49 mmHg), not 45. MRCEM candidates are examined on this number.  
  *Evidence:* Davidson AC et al. BTS/ICS guideline for ventilatory management of AHRF, Thorax 2016;71 Suppl 2 (NIV when pH <7.35 and PaCO2 >6.5 kPa persist despite optimal medical therapy).  
  *Fix:* Change to: "pH below 7.35 and PaCO2 above 6.5 kPa (about 49 mmHg) persisting after optimal medical treatment: BTS/ICS criteria for NIV. pH below 7.26 means a higher risk of failure: start it in a place where it can be escalated (HDU), with a ceiling-of-care decision."
- **T20-4** (c12.js · ch-asa step 1 (gas read) explanation): The gas (pH 7.47, PCO2 22, HCO3 15.6) fits the CHRONIC respiratory alkalosis rule almost exactly (expected HCO3 = 24 - 5 x 1.8 = 15). The app's own interpreter, opened on the same values, says "Primary respiratory alkalosis - Chronic, renally compensated" plus HAGMA. The case explanation never says why compensation is not the answer, so a learner applying the app's rules gets a contradiction.  
  *Evidence:* interp(CASES ch-asa step 0 gas): compensation step => "Chronic, renally compensated :: Acute: HCO3 ~ 20.4; chronic: ~ 15. Measured 15.6"; gaps => AG 21.4.  
  *Fix:* Add to the right-answer text: "Six hours is too soon for renal compensation: the acute rule predicts HCO3 ~ 20; 15.6 with an anion gap of 21 is a second, metabolic process." Optionally lower HCO3 to ~13.5 and PCO2 to ~19 (pH 7.47) so the numbers do not sit on the chronic line.
- **T20-5** (c12.js · ch-dka step 3 (potassium) option "Hold insulin until potassium is normal"): Feedback "Potassium 5.6 is not a reason to delay insulin; below 3.5 is" is imprecise. JBDS 2023 does not tell you to hold the FRIII at <3.5: it asks for senior review and extra potassium; the ADA threshold for delaying insulin is K <3.3. Learners will carry "hold insulin below 3.5" into exams.  
  *Evidence:* JBDS 02 single-page pathway, March 2023 (K bands >5.5 / 3.5-5.5 / <3.5 senior review); ADA hyperglycaemic crises consensus 2024 (hold insulin if K <3.3).  
  *Fix:* Rewrite: "A high potassium is not a reason to delay insulin. Only a low one changes the plan: below 3.5 JBDS asks for senior review and more potassium (ADA delays insulin until K is above 3.3)."
- **T20-6** (c12.js · ch-dka step 4 (six hours later)): The message gives chloride 112 and asks the learner to see that "the gap is closing" but gives no sodium, so the anion gap cannot be calculated. It also says "add 10% glucose once glucose is below 14 mmol/L" when glucose is already 12, so the drip should already be running.  
  *Evidence:* c12.js line 11: m: "glucose 12, ketones 1.4, pH 7.24, HCO3 14, chloride 112" - no Na; right-answer text: "add 10% glucose once glucose is below 14".  
  *Fix:* Add "sodium 138" (AG = 138 - 112 - 14 = 12) and reword: "...Keep the fixed-rate insulin running (JBDS 2023: consider dropping to 0.05 units/kg/h), and the 10% glucose at 125 mL/h should already be running since glucose fell below 14. Follow ketones and pH, not bicarbonate: chloride keeps the bicarbonate low."

## Minor
- **T20-7** (c12.js · ch-asa step 2 (management) explanation): "Very high levels and new neurological signs point to haemodialysis": 720 mg/L (5.2 mmol/L) is not "very high" by EXTRIP (ECTR recommended above 7.2 mmol/L / 1000 mg/L, or 6.5 with impaired kidneys). The real trigger here is altered mental status (agitation), which is an EXTRIP indication at any level. UK TOXBASE uses >700 mg/L, which is why 720 was likely chosen; neither threshold is named.  
  *Evidence:* Juurlink DN et al. EXTRIP salicylate recommendations, Ann Emerg Med 2015;66:165-181.  
  *Fix:* Rewrite: "Agitation is altered mental status: EXTRIP recommends haemodialysis whatever the level (level alone: above 7.2 mmol/L; UK TOXBASE uses above 700 mg/L). Alkalinise meanwhile (target urine pH 7.5-8.5), keep K+ above 4, and give glucose: the brain can be hypoglycaemic with a normal blood glucose."
- **T20-8** (c12.js · ch-dka step 2 (read the VBG) explanations): Inconsistent Winter's numbers. The right answer says "1.5 x 5.6 + 8 = 16 ± 2; the venous 19 matches an arterial ~14-17"; the distractor says "band is about 14-18". The app standard converts venous HCO3 -1 too, so the interpreter gives 1.5 x 4.6 + 8 = 14.9 ± 2 (13-17) and AG 30.4 (29.9 albumin-corrected) vs the case's 29.  
  *Evidence:* interp(ch-dka gas): "Winter's: 1.5 x 4.6 + 8 = 14.9 ± 2 -> expected PCO2 13-17 mmHg. Measured 14"; AG 30.4.  
  *Fix:* Use one set of numbers in both texts, matching the app's venous->arterial rule: "Estimated arterial HCO3 ~4.6, PCO2 ~14; Winter's 1.5 x 4.6 + 8 = 15 ± 2 (13-17): appropriate. AG ~ 30."
- **T20-9** (c12.js · ch-dka (whole case)): The case never says this is SEVERE DKA, though it meets three JBDS severity markers: HR 124 (>100), AG ~29 (>16), and estimated arterial HCO3 4.6 (<5). In JBDS these trigger senior review and HDU/level-2 care, a standard MRCEM question.  
  *Evidence:* JBDS 02 (2023) severity criteria: ketones >6, HCO3 <5, venous pH <7.0, K <3.5 on admission, GCS <12, SpO2 <92%, SBP <90, HR >100 or <60, AG >16.  
  *Fix:* Add a line to step 2's right answer ("This meets JBDS severity criteria: HR >100, AG >16, bicarbonate about 5: call the senior and plan HDU") or add a short step "Where should she be managed?".
- **T20-10** (c12.js · ch-pca step 3 (plan)): The plan leaves out oxygen targets and leans on CPAP. For a probable OHS patient with acute hypercapnia, BTS 2017 sets SpO2 88-92%, and bilevel NIV (not CPAP) is the treatment for acute hypercapnia. Opioid-sparing analgesia and HDU/level-2 monitoring are also missing. The ATS 2019 point that serum HCO3 >= 27 is the screening trigger, which fits this gas (32), is not taught.  
  *Evidence:* Mokhlesi B et al. ATS OHS guideline 2019 (HCO3 <27 makes OHS unlikely; suspected OHS discharged on NIV until outpatient work-up); O'Driscoll BR et al. BTS oxygen 2017 (target 88-92% in obesity hypoventilation).  
  *Fix:* Right answer: "HDU-level monitoring, titrate oxygen to 88-92%, bilevel NIV overnight, consider a naloxone infusion, switch to opioid-sparing analgesia, and refer for OHS work-up (HCO3 32 >= 27, the ATS screening trigger)."
- **T20-11** (c12.js · ch-pca step 2 distractor "Pure acute respiratory acidosis with no background"): Feedback "The bicarbonate is a little higher than acute alone predicts" undersells it: 32 vs about 27 is 5 mmol/L, well outside the acute range. The right answer also does not mention the other cause of a value between the two lines (acute respiratory acidosis plus a metabolic alkalosis, e.g. post-op vomiting or diuretics).  
  *Evidence:* Acute: 24 + 3.4 = 27.4; chronic: 24 + 13.6 = 37.6; measured 32 (interp agrees).  
  *Fix:* Change to "HCO3 32 is about 5 above the acute prediction (~27): there is a background of retention." Add to the right answer: "...or an added metabolic alkalosis; the history (BMI 44, sleepy by day) favours chronic retention."
- **T20-12** (c12.js · ch-meth step 2 (osmolar gap) message): The calculated osmolality "2 x Na + glucose + urea = 293" implies a urea of 5 that is never given, and ethanol ("low" but measured) is left out of the formula, so learners cannot reproduce the 293 or learn to subtract the ethanol share.  
  *Evidence:* 2 x 141 + 6 = 288, so urea must be 5 for 293. Intro: "Ethanol level is low".  
  *Fix:* Give urea 5.0 in the message and either say "ethanol undetectable" in the intro or include it: "2 x Na + glucose + urea + ethanol (mmol/L) = 293".
- **T20-13** (c12.js · ch-meth step 2 right answer): Treatment is incomplete for an MRCEM learner. It does not give the EXTRIP dialysis criteria that this patient meets (visual signs, AG >24, pH <= 7.15), and leaves out the adjuncts: bicarbonate to keep pH above 7.3 and folinic/folic acid to clear formate.  
  *Evidence:* Roberts DM et al. EXTRIP methanol recommendations, Crit Care Med 2015;43:461-472; Kraut & Mullins NEJM 2018.  
  *Fix:* Extend: "...dialysis is indicated: visual signs, anion gap above 24 and pH 7.15 or less all meet EXTRIP criteria. Add bicarbonate (target pH above 7.3) and folinic acid."
- **T20-14** (c12.js · ch-cord step 2 (interpret arterial sample)): Explanation cites only ACOG 2006 (Committee Opinion 348). It misses the practical next step that the user's ER/UK context needs: pH < 7.00 within 60 min meets criterion A for therapeutic hypothermia, so the baby needs a structured encephalopathy exam (criterion B) within 6 h. It also does not note that Apgar 7 at 5 min makes HIE less likely.  
  *Evidence:* ACOG/AAP Neonatal Encephalopathy and Neurologic Outcome, 2nd ed 2014; BAPM therapeutic hypothermia framework 2020 (pH <7.0 or BD >= 16 within 60 min).  
  *Fix:* Add: "pH below 7.00 within an hour of birth meets the first criterion for cooling. Examine for encephalopathy now and repeat; cooling must start within 6 hours. An Apgar of 7 at 5 minutes makes severe HIE less likely but does not exclude it." Add acog14/bapm20 to SRC and src.
- **T20-15** (ui8.js · caseStep chips handler / autopsyRow): After you pick an autopsy reason, any re-render (answering the right option next) redraws the chips enabled and unpressed. Your choice disappears from view, and clicking another chip seems to work but is ignored because e.why is already set.  
  *Evidence:* ch-dka step 1: wrong pick, click "Didn't know the rule", then press the right option: chips return as disabled=false / aria-pressed=null (run1.py autAfterRight).  
  *Fix:* In autopsyRow(k), look up the notebook entry for this key and render aria-pressed="true" on its why, with all chips disabled when a why exists.
- **T20-16** (ui8.js · caseStep layout on phone (Next -> scrollTo(0,0))): On a phone each new step scrolls to the top, so the new message and question sit below the fold behind the full intro and the growing chat history. From step 2 onwards you must scroll to find what changed.  
  *Evidence:* /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T20-dka-step2-gas.png (390x844): question "Read it." at y ~1080.  
  *Fix:* After Next, scroll the newest bubble (or the .scn-step card) into view: el.querySelector(".chat .bub:last-child")?.scrollIntoView({block:"start"}). Collapse the intro card to one line after step 1.
- **T20-17** (ui8.js · caseStep history): Earlier gases vanish once you move on: the history replays only the bubbles and your answer. ch-dka step 4 ("six hours later...") asks you to judge the trend, but the first VBG is no longer on screen.  
  *Evidence:* ch-dka step 4: only the step-2 "VBG is back." bubble remains; the slip is gone.  
  *Fix:* In hist, render a compact gas chip for any earlier step that had s.gas (e.g. "VBG: pH 7.08 · PCO2 19 · HCO3 5.6 · AG 29") that expands to the full slip on tap.
- **T20-18** (ui8.js · caseStep / caseAnswer accessibility): After an answer the whole view re-renders. Focus drops to <body> and nothing is announced (no aria-live), so keyboard users lose their place and screen-reader users never hear "Right" or "What happens".  
  *Evidence:* Press 1 in ch-meth: document.activeElement = BODY; #v-cases [aria-live] count = 0.  
  *Fix:* Wrap the feedback in <div aria-live="polite">. After re-render, focus #csNext if solved, otherwise the first enabled option.
- **T20-19** (ui8.js · openCase / history (Back after Settings)): Browser/Android Back from Settings can reopen a different, older case. openCase replaces the hash in place, so the earlier #case-<id> entry stays in history and its hashchange starts that case from step 1.  
  *Evidence:* Fresh load #case-ch-pca, finish ch-copd, tap gear, press Back: URL #case-ch-pca and ch-pca restarts (run2.py afterGearBack).  
  *Fix:* When leaving a case (csBack, caseEnd "All cases", gear), replaceState the entry to #cases. Or have route() on #case-<id> with VIEW!=="cases" ask "Resume?" instead of silently opening a different case.
- **T20-20** (ui8.js · caseLib notebook Remove): Removing a notebook entry re-renders the library and collapses the notebook <details>. With 16 tiles above it on a phone, every removal means scrolling to the bottom and reopening it.  
  *Evidence:* After clicking Remove: details.open=false (run1.py afterRemove). /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T20-lib-notebook.png shows the notebook at the very bottom of a 3300 px page.  
  *Fix:* Remove the .nbi node in place (or keep a S.ui.nbOpen flag and render <details open>). Move the notebook above the tiles, or add a "Mistakes · n" chip in the header that jumps to it.
- **T20-21** (ui8.js · caseAnswer / CS.log): CS.log (question, your answer, right first time) is collected but never used. The completion screen shows only "1 wrong turn" and gives no step-by-step debrief.  
  *Evidence:* ui8.js line 57 pushes CS.log; caseEnd never reads it.  
  *Fix:* On the completion screen, list each step's question with a tick or cross and the one-line explanation. This is the learning moment of a case.

## Polish
- **T20-22** (c12.js · ch-pca steps 1-2, ch-meth step 1, ch-cord step 2): Four steps in "chat" cases have no message at all. Step 1 of ch-pca and ch-meth opens with an empty chat and a bare question, and the PCA gas appears with no "ABG is back" bubble, which breaks the chat format.  
  *Evidence:* /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T20-pca-gas-desk.png: only the "You" bubble above the gas.  
  *Fix:* Add short messages: ch-pca step 1 Nurse: "She only groans to a sternal rub. Pupils pinpoint."; step 2 Nurse: "ABG back, on 4 L."; ch-meth step 1 Nurse: "VBG back. Glucose and lactate are on it."; ch-cord step 2 Midwife: "So is the baby acidotic?".
- **T20-23** (c12.js · ch-dka step 1 message): "Ketone meter says 5.8" has no units. The best option "Venous gas, then start fluids while you assess" reads as if fluids wait for the gas.  
  *Evidence:* c12.js line 8.  
  *Fix:* "Ketones 5.8 mmol/L". Option: "Venous gas and IV access, start 0.9% saline 1 L over an hour while you assess".
- **T20-24** (c12.js · ch-asa step 2 distractor "Activated charcoal and observe for 12 h"): The feedback implies charcoal is pointless. It is the "observe" part that is wrong: charcoal still has a role in large or enteric-coated salicylate ingestions.  
  *Evidence:* TOXBASE salicylate guidance (charcoal within 1 h; consider later for enteric-coated or very large doses).  
  *Fix:* "Charcoal may still help, but a toxic, agitated patient at six hours needs enhanced elimination now, not observation."
- **T20-25** (c12.js · ch-copd step 3 and ch-meth step 2 distractors): Weak distractors: "Discharge on home oxygen" for an acidaemic drowsy patient, and "Give bicarbonate and send him home". Nobody would pick them, so the question tests nothing.  
  *Evidence:* c12.js lines 20 and 24.  
  *Fix:* COPD: "Intubate and ventilate now" (feedback: NIV first unless contraindicated or failing; set a ceiling of care). Methanol: "Fomepizole alone; no dialysis needed because he is still talking" (feedback: visual signs, AG >24 and pH <= 7.15 are EXTRIP indications).
- **T20-26** (c12.js · ch-cord step 1 message): Base deficit is given only for sample 2, which hints at the answer. The other values (HCO3, PO2) are missing, so the gases cannot be checked.  
  *Evidence:* Midwife: "Sample 1: pH 7.21, PCO2 52. Sample 2: pH 6.94, PCO2 86, base deficit 14."  
  *Fix:* Show both samples as slips (gas objects with pH, PCO2, PO2, HCO3; BD computed): vein pH 7.21/PCO2 52/HCO3 ~20.6, artery 6.94/86/~18.3. Ask the learner to note the wide A-V gap (pH 0.27, PCO2 34), which suggests acute cord occlusion.
- **T20-27** (ui8.js · caseBubble): Speaker styling is binary: "Patient" and "Brother" get a teal border, and Nurse, Midwife, Lab and Paramedic all look identical. Any new relative ("Wife", "Mother") would be styled as staff.  
  *Evidence:* /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T20-dka-wrong.png; ui8.js line 39 hard-codes ['Patient','Brother'].  
  *Fix:* Add an explicit side flag in the data (m:[["Brother","...","them"]]) or a lookup of lay speakers; give Lab/results a distinct "system" bubble (mono font, no border colour).
- **T20-28** (ui8.js · caseStep history "You" bubble): The history bubble labelled "You" always shows the right answer, even when the learner first picked a wrong one.  
  *Evidence:* Pick wrong then right in ch-dka step 1; step 2 history: "You: Venous gas, then start fluids..."  
  *Fix:* Label it "Decision" or show "You (2nd try)" when tried has more than one key.
- **T20-29** (ui8.js · caseLib exam filter): The "Untagged" exam chip always gives "No case matches", because every case has an exam tag.  
  *Evidence:* caseList with exam=none -> n=0.  
  *Fix:* Only render the Untagged chip when CASES.some(c=>!(c.exam||[]).length), as the setting chips already do.
- **T20-30** (shell.html · .bub (chat bubble) CSS): The global .bub chat-bubble rule (padding 8px 12px, 2px border, max-width) also hits the header logo, which is also .bub (.brand .bub), so the logo gets bubble padding and border.  
  *Evidence:* getComputedStyle(".brand .bub"): padding 8px 12px, border 2px, width 28 px (designed 22 px).  
  *Fix:* Scope the chat rules to .chat .bub (and .chat .bub.them etc.).
- **T20-31** (shell.html · .autopsy in clinical skin): The autopsy chip row is centred inside a filled box in the clinical skin but left-aligned in pixel.  
  *Evidence:* /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T20-cord-light-clinical-tab.png vs /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T20-dka-wrong.png.  
  *Fix:* Give .autopsy .seg justify-content:flex-start in both skins.
- **T20-32** (c12.js · exam tags): ch-copd and ch-pca are tagged MRCEM only, but hypercapnic failure, NIV and opioid toxicity are core USMLE Step 2 CK. ch-cord is tagged USMLE only, though MRCEM covers neonatal resuscitation.  
  *Evidence:* c12.js lines 16, 25, 30.  
  *Fix:* ch-copd and ch-pca: exam:['MRCEM','USMLE']. Consider adding MRCEM to ch-cord, or leave it as is if the cord-gas detail is judged out of scope.

## Ideas (ranked by value)
- **T20-33** (ui2.js · WHY reasons used by autopsyRow): The autopsy reasons (Misread a number, Arithmetic slip, Didn't know the rule, Mixed up two ideas) fit gas reading but not management steps such as "What do you do first?".  
  *Fix:* Add "Wrong priority / order" and "Didn't know the guideline". Pass a step type (read vs act) so autopsyRow shows the relevant set.
- **T20-34** (ui8.js · notebook entries): Notebook entries keep the question and both answers but not the "What happens" explanation, and "Redo the case" restarts from step 1.  
  *Fix:* Store the explanation (x.e=st.o[i][2]). Add "Retry this step", which opens the case at CS.i=step with previous steps auto-filled.
- **T20-35** (c12.js · ch-dka step 4 teaching point): Bicarbonate rose only 1.4 mmol/L/h (5.6 -> 14 in 6 h) while ketones fell 0.73/h. That is the classic trap (bicarbonate lags because of hyperchloraemia), and JBDS says not to use bicarbonate as the marker at this stage.  
  *Fix:* Add a distractor "Bicarbonate is rising too slowly; increase the insulin", with feedback on chloride and the targets (ketones fall >= 0.5/h, glucose >= 3/h).
- **T20-36** (c12.js · ch-dka): Sodium 131 with glucose 31 is a chance to teach corrected sodium (~138), which matters for fluid choice and cerebral oedema risk in a 19-year-old.  
  *Fix:* Add one line to the step-2 explanation or a short extra question.
- **T20-37** (c12.js · new chat cases): The six cases cover HAGMA x3, respiratory acidosis x2 and neonatal. There is no NAGMA (diarrhoea or RTA), no metabolic alkalosis (pyloric stenosis, vomiting or diuretics), and no triple disorder in chat format.  
  *Fix:* Add chat cases: infant with pyloric stenosis (hypochloraemic alkalosis, paradoxical aciduria); high-output ileostomy NAGMA with urine anion gap; alcoholic with vomiting plus AKA (HAGMA + metabolic alkalosis, delta ratio > 2).
- **T20-38** (ui8.js · completion screen): There is no link from a finished case to the matching lessons or tools, though the app has them (HAGMA lesson, osmolar gap tool, Winter's gym).  
  *Fix:* Add a "Go deeper" row built from c.dis (e.g. hagma -> openLesson("hagma"), the osmolar gap tool for ch-meth).
- **T20-39** (ui8.js · caseStep gas slip): Learners cannot open a case gas in the interpreter to check their working.  
  *Fix:* After the step is solved, add "Open in interpreter" (prefill from st.gas). This also exposes the ch-asa chronic/acute nuance, which the explanation should then address.

Verified as correct (no change needed): JBDS diagnosis, FRIII 0.1 units/kg/h, no K+ above 5.5, 10% glucose below 14, resolution criteria (ketones <0.6, pH >7.3); BTS 88-92% target and no abrupt O2 withdrawal; the acute/chronic respiratory acidosis predictions in ch-copd (28/39) and ch-pca (27/38); salicylate 720 mg/L = 5.2 mmol/L; methanol AG 32 and osmolar gap 45; the ACOG pH <7.0 + BD >=12 threshold; and the cord BD of 14, which fits extracellular BE for pH 6.94/PCO2 86 (HCO3 ~18.3).
