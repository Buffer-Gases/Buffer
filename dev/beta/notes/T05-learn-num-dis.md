# T05 - Learn: Numbers, VBG, Disorders, Glance (learn-num-dis)

**Covered:** all 19 lessons in modules num (nph, npo2, nhco3, nbe, nlac, nlytes, ncoox, nderived, nall), vbg, dis (read6, hagma, nagma, malk, racid, ralk, mixed, oxread) and auto (glance). For each one I checked the summary, body, key numbers, hook, worked gas, all 5 questions (options and explanations) and sources. I recomputed every worked number (Henderson-Hasselbalch, Winter's, the 0.7 rule, 1/4 and 2/5, AG with albumin correction, Delta ratio, PAO2 and A-a, SBE, bicarbonate deficit, P/F) by hand or with a script, and ran each worked gas through interp(). Rendered in the frozen copy at 390x844 and 1280x800, in pixel/dark, clinical/light and pixel/light; no JavaScript errors.

**Verdict:** the content is strong, accurate and well sourced overall, and most numbers check out exactly: all seven worked gases obey Henderson and the engine agrees with their labels. The serious problems are a backwards pH/PCO2 direction rule in two lessons (it contradicts ROME), an impossible gas in the 'is it real?' lesson, the engine's step 4 contradicting the mixed-disorder lesson, and a UK NIV threshold that does not match BTS/ICS. Phone tables are clipped with no scroll cue. **Score: 7.5/10.**

## Critical (2)

- **T05-1** `c2.js` - *lesson nph: body 'The direction test' + hook*. The pH/PCO2 direction rule is worded backwards versus standard teaching. Body: 'if pH and PaCO2 move in opposite directions (pH down, PCO2 down) ... primary problem is metabolic. If they move in the same direction relative to normal (pH down, PCO2 up), the primary problem is respiratory.' Hook: 'pH and PCO2 opposite = metabolic.' Numerically pH down + PCO2 down is the SAME direction, and the standard mnemonic ROME (Respiratory Opposite, Metabolic Equal) says the reverse. The examples are right but the words and the hook a learner memorises are inverted, and they also clash with lesson 'mixed' Q4, which uses 'opposite/together' numerically.  
  Evidence: Read the nph body and hook; compare with mixed Q4 ('Compensation moves them together'). ROME: in respiratory disorders pH and PCO2 move in opposite directions; in metabolic disorders they move in the same direction (e.g. LITFL / any acid-base text).  
  Fix: Rewrite: 'If pH and PaCO2 move the same way (both down, or both up), the lungs are compensating: the primary problem is metabolic. If they move in opposite directions (pH down with PCO2 up, or pH up with PCO2 down), the PCO2 is the cause: respiratory.' Hook: 'pH and PCO2 move together = metabolic; opposite = respiratory (ROME).'
- **T05-2** `c3.js` - *lesson glance: Look 2 and shortcut text*. Same inversion as nph: 'Look 2: PCO2 against pH. Opposite direction (pH down, CO2 down) -> metabolic. Same direction -> respiratory.' pH down + CO2 down is the same direction. Contradicts ROME and the app's own 'mixed' lesson wording.  
  Evidence: openLesson('glance'), Look 2 paragraph.  
  Fix: Change to 'Same direction (pH down, CO2 down; or pH up, CO2 up) -> metabolic. Opposite direction (pH down, CO2 up) -> respiratory.' Keep the wording identical to nph so the two lessons teach one rule.

## Major (3)

- **T05-3** `c3.js` - *lesson read6, question 1 ('In step 3, pH 7.30, PCO2 55, HCO3 18')*. The question's gas is internally impossible. Henderson: [H+] = 24 x 55 / 18 = 73 nmol/L, which is pH 7.14, not 7.30 (HH: 6.1 + log(18 / 1.65) = 7.14). The lesson that teaches 'Step 1: is it real?' uses a gas that fails step 1, and interp() would flag it as 'Numbers do not fit together'.  
  Evidence: node: interp({pH:7.30,pco2:55,hco3:18}) -> real step 'Numbers do not fit together' (diff > 10%).  
  Fix: Use a consistent gas, e.g. 'pH 7.14, PCO2 55, HCO3 18' (or pH 7.20, PCO2 50, HCO3 19 -> HH 7.20). Add a test in tests/ that runs every lesson question gas with pH, PCO2 and HCO3 through the Henderson check.
- **T05-4** `e1.js` - *interp() step 3/4 for normal-pH mixed gases; seen via lesson 'mixed' -> Open in the Interpreter*. The 'mixed' lesson's worked gas (pH 7.42, PCO2 24, HCO3 15.3, AG 22.7) is read by the engine as 'Primary respiratory alkalosis ... Chronic, renally compensated' at step 4, then HAGMA appears only at step 5. The lesson (and its Q0) teaches the opposite route: Winter's predicts 31 +/- 2, the PCO2 is too low, so HAGMA + respiratory alkalosis. The final label is right, but step 4 tells the learner the low bicarbonate is renal compensation, which the high gap disproves. The lesson summary also says a normal pH with abnormal values is 'almost always mixed', while step 4 calls it a simple compensated disorder.  
  Evidence: node: interp(L.find(l=>l.id==='mixed').ex) -> comp.v 'Chronic, renally compensated'; label 'HAGMA + respiratory alkalosis'. Same for the asa case ex (pH 7.46, PCO2 22, HCO3 15.3).  
  Fix: When pH is in the 7.35-7.45 band, or when the AG is high, also test the metabolic reading: if agc > agref+2 and HCO3 < 22, treat the metabolic acidosis as primary and apply Winter's to the PCO2. At minimum, when the AG is high, replace the 'Chronic, renally compensated' verdict with 'Low HCO3 is explained by a high-gap acidosis, not renal compensation' and show Winter's.
- **T05-5** `c3.js` - *lesson racid: 'Act on' paragraph and key 'NIV trigger (COPD)'*. NIV threshold given as 'pH < 7.35 with PaCO2 > 45 mmHg (6 kPa)'. The UK guideline (BTS/ICS 2016, already in SRC as davidson16) says start NIV when pH < 7.35 and pCO2 > 6.5 kPa (about 49 mmHg) persist despite optimal medical therapy. For an MRCEM learner, 6.5 kPa is the expected answer. The 45 mmHg figure is the ERS/ATS one and is not labelled as such.  
  Evidence: BTS/ICS 2016 (Davidson AC et al. Thorax 2016;71 Suppl 2); confirmed in Irish Thoracic Society NIV flashcard: 'NIV should be started when pH<7.35 and pCO2>6.5 kPa persist or develop despite optimal medical therapy' https://irishthoracicsociety.com/education/irish-thoracic-society-flashcards/18-niv  
  Fix: Body: 'pH < 7.35 and PaCO2 > 6.5 kPa (49 mmHg) persisting after optimal medical therapy (BTS/ICS 2016; ERS/ATS uses > 45 mmHg)'. Key: 'NIV (COPD, BTS)' = 'pH < 7.35, PCO2 > 6.5 kPa after 1 h of treatment'.

## Minor (19)

- **T05-6** `c5.js` - *LSRC.racid*. racid cites epstein01 and brackett65 only; its NIV and intubation criteria have no guideline source although davidson16 (BTS/ICS 2016) is in SRC.  
  Evidence: c5.js LSRC: racid:['epstein01','brackett65'].  
  Fix: racid:['epstein01','brackett65','davidson16'].
- **T05-7** `c3.js` - *lesson read6: worked example step 6*. Says 'PaO2 108 on air: normal ... A-a = 12'. For age 24 the app's own rule (A-a <= age/4 + 4) gives 10, and the Interpreter shows 'A-a = 12 (expected <= 10 for age 24)' next to 'Normal oxygenation'. The lesson calls it normal without saying why.  
  Evidence: openLesson('read6') -> Open in the Interpreter; ox step text.  
  Fix: Either change the gas so A-a <= 10 (e.g. PaO2 112) or add: 'A-a 12 is within a few mmHg of the expected 10; the rule is approximate, so this is normal.'
- **T05-8** `e1.js` - *interp() oxygen step: raised = Aa > exAa + 5*. The engine silently adds 5 mmHg of tolerance to the age rule but prints 'expected <= X', so the display can show A-a above expected next to 'Normal oxygenation' (read6 example: 12 vs <= 10). The rule in the brief is A-a <= age/4 + 4 with no tolerance.  
  Evidence: e1.js line ~150: const raised=Aa>(exAa!=null?exAa+5:20). read6 ex output.  
  Fix: Print the threshold actually used ('normal up to about X + 5') or drop the +5 and keep the rule as taught; whichever is chosen, say it in lessons oxread and glance.
- **T05-9** `c3.js` - *lesson read6: step 4 'Compensation.'*. 'Winter's, 0.7 x HCO3 + 20, or 1-4-2-5' reads as if Winter's formula were 0.7 x HCO3 + 20. Winter's is 1.5 x HCO3 + 8 +/- 2 (acidosis); 0.7 x HCO3 + 20 is the alkalosis rule.  
  Evidence: openLesson('read6') body, step 4 (screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T05-read6-desk.png).  
  Fix: 'Compensation. Metabolic acidosis: Winter's 1.5 x HCO3 + 8 +/- 2. Metabolic alkalosis: 0.7 x HCO3 + 20 +/- 5. Respiratory: 1-4 (acidosis) and 2-5 (alkalosis) per 10 mmHg.'
- **T05-11** `c3.js` - *lesson hagma: worked gas (ex)*. Worked gas has lactate 9.1 but the AG rise is about 18 (AG 30.2 corrected). The lesson's own approach says if lactate does not account for the rise, hunt for another anion, and the Interpreter says 'Lactate 9.1 accounts for about 50% of the gap rise' - yet the lesson gives no comment or clinical stem, so the learner cannot tell whether a second acid is intended.  
  Evidence: node interp(hagma.ex): gap step 'Lactate 9.1 accounts for about 50% of the gap rise'.  
  Fix: Either raise lactate to about 16 (pure lactic acidosis) or add a stem and a line: 'Lactate explains only half the gap: check ketones, creatinine, osmolar gap.'
- **T05-12** `c2.js` - *lesson npo2: altitude sentence*. 'In Riyadh the expected value is a few mmHg lower.' At about 610 m (Pb about 707 mmHg) the alveolar PO2 is about 11 mmHg lower: 0.21 x (707 - 47) - 50 = 89 vs 100 at sea level. 'A few' understates it, and the app has a patm setting the learner should be pointed to.  
  Evidence: Calculation as shown; nall itself says Riyadh about 610 m.  
  Fix: 'In Riyadh (about 610 m, Pb about 707 mmHg) the expected PaO2 and PAO2 are about 10 mmHg lower; set the barometric pressure in Settings.'
- **T05-14** `c2.js` - *lesson nhco3, question 1 explanation*. Explanation says respiratory compensation 'rarely takes HCO3 above about 38-40', while the body says 'above about 40-45 ... chronic respiratory acidosis ceiling about 45'. Two different ceilings in one lesson.  
  Evidence: openLesson('nhco3').  
  Fix: Use one figure in both places, e.g. 'above about 40-45 (the chronic respiratory acidosis ceiling is about 45)'.
- **T05-15** `c7.js` - *XQ.nderived, 'A delta ratio of about 1.5 suggests...' explanation*. Explanation says 'Between 1 and 2 fits an isolated high anion gap acidosis', but the lesson table, the 'mixed' lesson and the engine all use 0.8-2.  
  Evidence: openLesson('nderived') Q5; e1.js delta<=2 branch uses 0.8.  
  Fix: 'Between 0.8 and 2 fits an isolated high anion gap acidosis.'
- **T05-16** `c2.js` - *lesson nderived: delta ratio formula*. The formula '(AG - 12) / (24 - HCO3)' does not say to use the albumin-corrected AG or the local reference AG. The engine uses agc - S.agref. A learner with albumin 20 g/L will get a different ratio from the Interpreter.  
  Evidence: e1.js: delta=(agc-agref)/(24-h).  
  Fix: 'Delta ratio = (corrected AG - normal AG) / (24 - HCO3); the app uses 12 unless you change it in Settings.'
- **T05-17** `c7.js` - *XQ.nlytes, 'K 7.1 on a gas with a normal ECG after a difficult draw'*. The answer 'Repeat the sample' with the explanation 'Haemolysis is a common cause' leaves out that K >= 6.5 is severe hyperkalaemia in UK guidance and needs urgent action if confirmed; haemolysis cannot be seen in a whole-blood gas sample. A learner may delay treatment.  
  Evidence: Renal Association/UK Kidney Association hyperkalaemia guideline: K >= 6.5 mmol/L severe, emergency treatment.  
  Fix: Explanation: 'Repeat urgently (lab sample, look for haemolysis) with the patient on a cardiac monitor. If it is confirmed at >= 6.5, treat as severe hyperkalaemia even with a normal ECG.'
- **T05-18** `c3.js` - *lesson glance: shortcuts table*. 'PCO2 = last two digits of pH (pH 7.10-7.35)' fails at the low end. At pH 7.10 with PCO2 10, HCO3 = 3.0, Winter's predicts 12.5 +/- 2. The rule holds from about 7.15 to 7.35. Also 'HCO3 + 15 (HCO3 10-20)': at HCO3 20 it gives 35, but Winter's gives 38 +/- 2 (36-40).  
  Evidence: Script: for pH 7.05-7.40, PCO2 = (pH - 7) x 100, HCO3 by HH, Winter's: off at 7.05, 7.10 and 7.40. HCO3 20 -> 35 vs 38.  
  Fix: State 'pH about 7.15-7.35' (also in Look 3) and 'HCO3 + 15 for HCO3 about 8-18'.
- **T05-19** `c3.js` - *lesson glance: 'How to drill it'*. 'Reflex tab: Level 1 ...' - there is no Reflex tab. Tabs are Today, Learn, Labs, Practice, Progress; Reflex is a Practice mode.  
  Evidence: ui1.js quick buttons / ui2.js modes: reflex is a session mode.  
  Fix: 'Practice -> Reflex: Level 1 until ...'. A deep link button to startSession('reflex') would be better.
- **T05-20** `c3.js` - *lesson glance: Look 2 last sentence*. 'Both values moving against the pH -> two disorders' is unclear: which values, and against what? The rule meant is 'PCO2 and HCO3 both moved in the direction that explains the pH' (as read6 step 3 says), or 'PCO2 and HCO3 moved in opposite directions'.  
  Evidence: openLesson('glance').  
  Fix: 'If PCO2 and HCO3 both push the pH the same way (high CO2 + low HCO3, or low CO2 + high HCO3) -> two primary disorders.'
- **T05-21** `c2.js` - *lesson vbg: 'Interpreting a VBG'*. It says add 0.03 to pH and subtract 1 from HCO3 and 'treat any PCO2 estimate as approximate', but the Interpreter also subtracts 5 from the PCO2 (brief rule; e1.js), and the lesson never states that number. A learner cannot reproduce the Interpreter's output.  
  Evidence: e1.js: if(ven){pH+=0.03;pc=pc-5;h=h-1}.  
  Fix: 'The interpreter adds 0.03 to pH, subtracts 5 from PCO2 and 1 from HCO3; the PCO2 estimate is the weakest of the three.'
- **T05-22** `c2.js` - *lesson ncoox body*. The CO section does not say that pulse oximetry reads COHb as oxyhaemoglobin, so SpO2 is falsely normal in CO poisoning. It is the most examinable fact about CO and the reason co-oximetry is needed (it appears only in oxread's table).  
  Evidence: openLesson('ncoox').  
  Fix: Add: 'Standard pulse oximeters read COHb as oxyhaemoglobin: SpO2 looks normal. Only co-oximetry (or a CO-oximeter) measures COHb.'
- **T05-24** `c5.js` - *LSRC.hagma*. GOLDMARK (Mehta AN et al. Lancet 2008;372:892) and the EXTRIP metformin recommendation (Calello DP et al. Crit Care Med 2015;43:1716) are taught but not cited. 'Cite everything' is a roadmap decision.  
  Evidence: c5.js LSRC hagma:['kraut07','kraut10','figge98'].  
  Fix: Add SRC.mehta08 and SRC.calello15 and include them in LSRC.hagma.
- **T05-25** `c5.js` - *LSRC.npo2 / LSRC.nlac (missing)*. npo2 teaches oxygen targets (94-98%) and FiO2 by device with no source (module default only siggaard74 and aarc13). nlac teaches the Sepsis-3 septic shock definition with only kraut14.  
  Evidence: lessonSources for npo2 -> 2 sources; nlac -> 3.  
  Fix: LSRC.npo2:['odriscoll17']; LSRC.nlac:['kraut14','evans21'] plus Singer M et al. JAMA 2016;315:801 (Sepsis-3) as a new SRC entry.
- **T05-27** `shell.html` - *.prose .tw (lesson tables) at phone width*. Every lesson table (npo2, ncoox, nderived, nall, vbg, hagma, nagma, malk, racid, mixed, oxread, glance) is 420-450 px wide inside a 306 px scroll box. Text is cut mid-word ('Hyperchloraemic normal AG acido', 'Intercha') with no shadow, fade or hint that it scrolls sideways. On the VBG table the whole 'Clinically' column, which carries the take-home message, is hidden.  
  Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T05-nderived-phone-delta.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T05-vbg-phone-table.png; measured .tw scrollWidth 420 vs clientWidth 306 at 390x844.  
  Fix: Under 480px either stack table rows as cards (each td on its own line, with the th as a label via data-label) or add a right-edge fade gradient plus a 'swipe' hint. Drop min-width on two-column tables.
- **T05-29** `e2.js` - *W.agc run()*. The widget hard-codes the reference AG of 12 and a 'high' cut-off of 14, ignoring S.agref and S.usek, which the Interpreter uses. It also shows a Delta ratio number whenever HCO3 < 24, even when the gap is normal, where the ratio has no meaning.  
  Evidence: e2.js line ~160: dr=h<24?(agc-12)/(24-h):null; agc>14.  
  Fix: Use (S.agref||12) for both; show '-' for the Delta ratio unless agc > agref + 2.

## Polish (8)

- **T05-10** `c3.js` - *lesson read6: last line*. 'Open this case in the Interpreter with the button below' - on tablet and desktop the button sits in the right-hand aside ('Worked gas' card), not below.  
  Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T05-read6-desk.png  
  Fix: '...with the Open in the Interpreter button on the worked gas card.'
- **T05-13** `c2.js` - *lesson npo2, question 1 explanation*. Explanation uses NRB FiO2 0.6-0.8 ('85 / 0.6-0.8 = 105-140') while the table in the same lesson says 0.6-0.9.  
  Evidence: openLesson('npo2').  
  Fix: '85 / 0.6-0.9 = about 95-140.'
- **T05-23** `c2.js` - *lesson ncoox: MetHb table*. The table jumps from '< 1.5% normal' to '10-20% cyanosis'; the 1.5-10% band is missing.  
  Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T05-ncoox-phone.png  
  Fix: Add a row '1.5-10%: usually no symptoms; grey skin or slight discolouration may be seen'.
- **T05-26** `c5.js` - *LSRC.nall*. The reference card cites wrenn90 (delta gap paper), which has no bearing on normal ranges.  
  Evidence: c5.js LSRC nall:['kraut07','wrenn90'].  
  Fix: Replace wrenn90 with aarc13 or a laboratory reference source.
- **T05-28** `e2.js` - *W.agc verdict line*. Verdict shows double punctuation: 'Osmolar gap raised: toxic alcohol?.'  
  Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T05-nderived-clin-light.png  
  Fix: Do not append '.' when v ends with '?', or reword to 'Osmolar gap raised: think toxic alcohol.'
- **T05-30** `c3.js` - *original lesson questions in c2/c3 (first two per lesson)*. The correct option is the longest by 40% or more in 20 of 95 questions, almost all in the hand-written first two questions: nlac Q1, nbe Q1, vbg Q3, read6 Q1-Q3, malk Q1-Q2, racid Q2, ralk Q1, mixed Q2-Q3, nagma Q2, glance Q2-Q4 and others. Test-wise learners can guess them.  
  Evidence: Script over L: compare option lengths (list in this note).  
  Fix: Lengthen distractors to match, e.g. nlac Q1: 'Lactic acidosis fully explains the gap'; 'Repeat lactate before anything else'; malk Q2: 'Vomit contains a large amount of sodium'.
- **T05-31** `c8.js` - *XQ.glance Q1 / c7.js XQ.ncoox Q5*. Giveaways: glance 'Yes: PCO2 = 22' repeats the stem's number; ncoox 'Up to 10%' is the only option phrased as a range ('30%', '50%', 'Over 60%').  
  Evidence: openLesson('glance'), openLesson('ncoox').  
  Fix: glance options: 'Yes', 'No: too low', 'No: too high', 'Cannot say without HCO3'. ncoox: 'Up to 3%', 'Up to 10%', 'Up to 30%', 'Up to 50%'.
- **T05-32** `c2.js` - *lesson nderived: osmolar gap ethanol*. 'each 4.6 mg/dL ethanol adds about 1 mOsm' uses mg/dL in an app that teaches in mmol/L; UK labs report ethanol in mmol/L.  
  Evidence: openLesson('nderived').  
  Fix: Add '(in mmol/L: each 1 mmol/L of ethanol adds about 1 mOsm/kg)'.

## Ideas (ranked by value)

- **T05-33** `c3.js` - *lessons hagma, nagma, malk, racid, ralk, mixed (ex)*. Six of the seven worked gases have no clinical stem; only read6 tells a story. A gas without a patient teaches pattern-matching, not interpretation. Fix: Add ex.stem (one line, e.g. '58-year-old, septic shock, on noradrenaline') and render it above the slip in renderLesson (ui1.js).
- **T05-34** `ui1.js` - *renderLesson (worked gas card)*. Companion to the stem idea: the worked gas card has no place for a stem. Fix: If l.ex.stem exists, render '<p class=note>'+esc(stem)+'</p>' before the slip.
- **T05-35** `c2.js` - *nph / glance / mixed*. Teach one direction vocabulary across the app. Add ROME explicitly, plus a tiny 4-cell figure (pH up/down x PCO2 up/down) in nph and glance. Fix: Add the ROME mnemonic and a 2x2 grid to nph, and reuse the same grid in glance.
- **T05-36** `c2.js` - *lesson nall*. The reference card misses glucose, Hb, standard bicarbonate, osmolar gap, A-a by age, P/F cut-offs and [H+]-pH anchors, which are all on a real printout or used in the app. Fix: Add the rows; also add a kPa column for PaO2 hypoxaemia bands.
- **T05-37** `ui1.js` - *lesson body numbers*. Lesson text is mmHg only even when Settings units = kPa; MRCEM uses kPa. Fix: Wrap numbers in <span data-mmhg=..> and convert on render, or show '(x kPa)' inline everywhere.
- **T05-38** `c2.js` - *lesson nderived*. Add the caveats the engine already knows (e1.js uncertain(): ratio cut-offs are soft, DKA runs near 1, lactic acidosis near 1.6, near 0.8 or 2 is ambiguous) as a short 'Limits' box, plus the 'bicarbonate gap' (delta AG - delta HCO3) as an alternative. Fix: Add a 'Limits' paragraph under the delta ratio table.
- **T05-39** `c2.js` - *lesson ncoox*. Add the practical points: methylene blue dose 1-2 mg/kg, avoid with serotonergic drugs (serotonin syndrome) as well as G6PD deficiency; HBO indications for CO; in smoke inhalation use hydroxocobalamin, not nitrites (which make MetHb). Fix: Add a short 'Treatment' block with these points and cite weaver09 and a toxicology source.

Checked and correct (no action): GOLDMARK and HARDASS contents, urine Cl split, EXTRIP lactate > 20 / pH <= 7.0, COHb/MetHb ranges and half-lives, Berlin P/F cut-offs, SBE formula (Van Slyke), bicarbonate deficit 0.3 x kg x BE, osmolar gap formula, venous pH +0.03 / HCO3 -1, all racid/ralk/malk/mixed question arithmetic.