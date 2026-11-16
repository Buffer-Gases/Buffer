# T04 — Learn: modules kid and samp (15 lessons)
## Summary
Covered every lesson in **kid** (renal, rta, alkmaint, comp, kacid, uosm) and **samp** (sites, preanal, analyser, oxim, traps, tc-radial, tc-allen, tc-venous, tc-bubbles): body, keys, hook, all 5 questions with options and explanations (inline + merged XQ), embedded models (kidney ×3, compensation, map, Davenport), and the Sources list (checked every citation's journal, year, volume and pages; all 17 references are bibliographically correct). Rendered each lesson at phone 390 and desktop 1280 (dark pixel), plus clinical-light desktop, wide 1440 and tablet 820 spot checks. No console errors, no page-level horizontal scroll, every lesson shows 5 questions and its sources. None of these lessons has an example gas (l.ex).
Verdict: accurate, dense and well written overall — the renal physiology, compensation arithmetic (all 5 comp answers check out), analyser electrodes, oximetry (Sjoding figures correct) and Allen-test evidence are sound. The important problems are one unsafe drill (repeat before treating K⁺ 7.4), a kidney model that says NH₄⁺ excretion is normal in type 1 RTA, one question with two right answers, a step order in the radial checklist that contradicts the bubble lesson, a wrong icing rule, an arithmetic slip in the HCO₃⁻ + 15 shortcut, and two lessons citing irrelevant sources.
Score: **7.5/10**. Counts: {'critical': 1, 'major': 10, 'minor': 19, 'polish': 8, 'idea': 8}.
Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T04-*.png

## Critical (1)

**T04-1** · `c4.js` · tc-bubbles · 'Four drills' table, row 4
- What: Drill teaches 'K⁺ 7.4, no ECG changes, difficult draw → Haemolysis → Repeat before treating'. Absence of ECG changes does not exclude dangerous hyperkalaemia, and a whole-blood gas analyser cannot detect haemolysis (no haemolysis index), so 'haemolysis' cannot be concluded from the gas. Teaching a learner to defer treatment of K⁺ 7.4 is unsafe.
- Evidence: Lesson tc-bubbles body. UK Kidney Association (Renal Association) hyperkalaemia guideline 2020: K⁺ ≥ 6.5 is severe and needs emergency treatment; ECG is insensitive; suspected pseudohyperkalaemia must not delay treatment when true hyperkalaemia is possible.
- Fix: Change the row to: 'K⁺ 7.4 on a gas after a difficult draw → could be haemolysis, could be real → ECG now, repeat urgently (lab sample with haemolysis index), and treat as real (calcium, insulin–glucose) if there is any clinical reason for hyperkalaemia (renal failure, ACE-i, DKA, rhabdo) or any ECG change. Never wait on a repeat to treat a K⁺ ≥ 6.5 that may be true.' Also edit the closing line ('believe the patient and repeat') to add 'unless the number could kill: then treat while you repeat'.

## Major (10)

**T04-2** · `c7.js` · renal · Q5 'Hypokalaemia in the kidney tends to…' (XQ.renal)
- What: Two defensible answers. Distractor 'Lower aldosterone' is true: hypokalaemia directly suppresses adrenal aldosterone secretion. A learner who picks it is marked wrong for a correct fact.
- Evidence: Rendered lesson renal, question 5 options: Promote acidosis / Lower aldosterone / Promote alkalosis / Do nothing (shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T04-renal-desk.png). Physiology: plasma K⁺ is a direct stimulus of zona glomerulosa aldosterone secretion (Rose & Post).
- Fix: Replace 'Lower aldosterone' with an unambiguously false option, e.g. 'Block ammoniagenesis' (it does the opposite) or 'Stop H⁺ secretion'.

**T04-3** · `e3.js` · W.kidney stats() · Collecting duct + 'Type 1 RTA' (embedded in renal, rta, alkmaint)
- What: With Type 1 RTA on, the model shows 'NH₄⁺ excretion: Normal'. In distal RTA NH₄⁺ excretion is low (failed H⁺ secretion means NH₃ is not trapped as NH₄⁺) — which is exactly why the rta lesson teaches a positive urine anion gap. Model contradicts the lesson.
- Evidence: openLesson('rta'); in model click Collecting duct + Type 1 RTA → stats 'Pump fails / Normal (NH₄⁺) / Cannot go below 5.5 / Too little: NAGMA / Often low'. Same with Acid load also on. Code: nh4=f.t4?'Low…':f.load&&!f.t1?'Rises several-fold':'Normal' — t1 falls through to 'Normal'. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T04-rta-kidney-t1-phone.png. Batlle 1988 NEJM 318:594.
- Fix: In stats(): nh4 = f.t1 ? 'Low (no H⁺ to trap NH₃ as NH₄⁺): urine AG positive' : f.t4 ? … ; also add a 'Urine AG' row: t1/t4 'Positive', load 'Strongly negative', normal 'Near zero/negative'.

**T04-4** · `c4.js` · tc-radial · step 7 (table row 7)
- What: Step 7 says 'pressure for at least 5 minutes, then expel air, cap and roll'. That leaves an uncapped sample with air in it for 5+ minutes, which the next lesson (tc-bubbles: 'Expel the air at once') and preanal ('Expel air immediately') say corrupts the gas. Internal contradiction in a technique checklist.
- Evidence: tc-radial body row 7 vs tc-bubbles 'The first minute' step 1 and preanal 'Rules that prevent most errors'. AARC 2013 (Respir Care 58:1694): expel air and cap immediately.
- Fix: Rewrite row 7: 'Needle out, apply firm pressure (patient or assistant can hold it) for ≥ 5 min (longer if anticoagulated). At once: activate the needle safety device, remove the needle, expel air, cap and roll.' Add sharps safety (do not re-sheath by hand).

**T04-5** · `c2.js` · alkmaint · body + keys vs questions
- What: Questions test concepts the body never teaches: urine Cl⁻ > 20 split by blood pressure (Bartter/Gitelman, active diuretics, severe hypokalaemia vs hypertensive mineralocorticoid excess), and that urine Cl⁻ is unreliable while a diuretic is acting (Q5, furosemide). The body also never says why urine Cl⁻ (not Na⁺) is used — in vomiting urine Na⁺ can be high because bicarbonaturia drags Na⁺ out.
- Evidence: alkmaint body lists maintenance factors only; Q3 distractor 'Bartter syndrome today', Q5 'The drug is still acting' (XQ.alkmaint in c7.js). Galla 2000 JASN 11:369 (classification by urine Cl⁻ and BP).
- Fix: Add a short table: 'Urine Cl⁻ < 20 → saline-responsive: vomiting, NG suction, past diuretics, post-hypercapnia. Urine Cl⁻ > 20 + high BP → mineralocorticoid excess (primary aldosteronism, Cushing, renal artery stenosis, liquorice). Urine Cl⁻ > 20 + normal/low BP → current diuretic, Bartter, Gitelman, severe hypokalaemia/hypomagnesaemia.' Plus one line: 'Use urine Cl⁻, not Na⁺: early in vomiting bicarbonaturia carries Na⁺ into the urine, so urine Na⁺ can be falsely high.'

**T04-6** · `c2.js` · preanal · 'Rules that prevent most errors', bullet 3
- What: 'Ice is for glass or longer delays (plastic is permeable to O₂ at low temperature)' reads as 'ice a plastic syringe if the delay is long', which is the opposite of the guidance and contradicts its own parenthesis.
- Evidence: preanal body. AARC 2013 / CLSI C46-A2: plastic syringes are kept at room temperature and analysed within 30 min; if a longer delay is expected use a glass syringe on ice.
- Fix: Replace with: 'Plastic syringe: keep at room temperature and analyse within 30 minutes (sooner for lactate). Do not ice plastic: cold plastic lets O₂ in and falsely raises PO₂. If the delay will be longer, use a glass syringe on iced water.'

**T04-7** · `c5.js` · LSRC.uosm
- What: uosm cites Purssell 2001, which is about ethanol's contribution to the PLASMA osmolal gap, not the urine osmolal gap. The urine osmolal gap thresholds (<150, NH₄⁺ ≈ gap ÷ 2) are unsourced.
- Evidence: c5.js line 75: uosm:['batlle88','purssell01']; SRC.purssell01 = Ann Emerg Med 2001;38:653 'contribution of ethanol to the osmolal gap'.
- Fix: Replace purssell01 with Kim GH, Han JS, Kim YS, Joo KW, Kim S, Lee JS. Evaluation of urine acidification by urine anion gap and urine osmolal gap in chronic metabolic acidosis. Am J Kidney Dis 1996;27:42–47 (PMID 8546137); optionally add Kraut JA, Madias NE. Differential diagnosis of nongap metabolic acidosis. Clin J Am Soc Nephrol 2012;7:671–679.

**T04-8** · `c5.js` · LSRC.traps
- What: traps is cited only to AARC 2013 and Toffaletti 2007, neither of which covers the low anion gap, IgG paraprotein, bromide/lithium or albumin correction that make up most of the lesson.
- Evidence: c5.js line 76: traps:['aarc13','toff07']. kraut07 (Kraut & Madias 2007 CJASN 2:162, 'Serum anion gap: its uses and limitations') is already in SRC.
- Fix: traps:['kraut07','aarc13','toff07'] and also add kraut07 to analyser (pseudohyponatraemia/total CO₂).

**T04-9** · `c2.js` · sites · body paragraph about the technique clinic
- What: 'The next four lessons in this module are a technique clinic' is false: after sites come preanal, analyser, oxim and traps; the four tc-* lessons are positions 6–9 of the module (the stable sort in ui1.js keeps the appended tc-* lessons at the end).
- Evidence: openLesson('sites') → Next button: 'Pre-analytical errors: when the sample lies'. tc-radial is 37/98, sites 32/98.
- Fix: Either say 'The last four lessons in this module are a technique clinic…' and make them buttons (openLesson('tc-radial') etc.), or reorder L so tc-radial…tc-bubbles follow sites.

**T04-10** · `c2.js` · comp · 'Shortcuts' bullet 2 (also c3.js line 359)
- What: 'expected PCO₂ ≈ HCO₃⁻ + 15. It stays within Winter's ± 2 only for HCO₃⁻ ≈ 10–20' is arithmetically wrong. (HCO₃⁻+15) − (1.5·HCO₃⁻+8) = 7 − 0.5·HCO₃⁻, which is within ±2 only for HCO₃⁻ 10–18. At HCO₃⁻ 20: Winter's 38 (36–40) vs shortcut 35 → outside. The same '10–20 only' claim appears in a c3.js shortcut table.
- Evidence: Hand check: HCO₃⁻ 18 → 35 vs 33 (diff 2, OK); 20 → 38 vs 35 (diff 3, fails); 10 → 23 vs 25 (diff 2).
- Fix: Change to 'HCO₃⁻ ≈ 10–18' in c2.js comp body and in c3.js line 359.

**T04-11** · `c4.js` · tc-radial · step 6 'why' column and Q1 explanation
- What: 'pulling draws venous blood and air' is wrong mechanism: pulling the plunger does not change which vessel the needle is in. Self-filling also fails in an artery when the patient is hypotensive or with a non-vented syringe, and arterial blood is dark in hypoxaemia — so 'dark + needed pulling = vein' (Q1) is taught as certain when it is only suggestive.
- Evidence: tc-radial body row 6; Q1 explanation 'Pulling and dark colour point to a vein.' AARC 2013 notes gentle aspiration may be needed with some syringes / low pressure.
- Fix: Row 6 why: 'Pulsatile self-filling is the best sign you are in an artery; pulling can add air and hides that sign. In shock, gentle aspiration may be needed—then confirm with the PO₂ and SO₂ against the SpO₂.' Q1 explanation: '…point to a vein, though dark blood can be arterial in severe hypoxaemia: check the SO₂ against the SpO₂.'

## Minor (19)

**T04-12** · `c2.js` · rta · summary vs body
- What: Summary says the UAG separates gut losses (negative) from 'renal causes (positive)'. Proximal (type 2) RTA is renal but usually has a negative/normal UAG at steady state, because distal NH₄⁺ excretion is intact. The table has no UAG row, so the learner will assume all RTAs are UAG-positive.
- Evidence: rta sum and keys ('UAG positive: Renal (distal or type 4 RTA)' is correct, sum is not). Batlle 1988; Kraut & Madias CJASN 2012.
- Fix: Sum: '…from distal renal causes (positive).' Add a table row 'Urine AG: Positive | Usually negative (distal acidification intact) | Positive'.

**T04-13** · `c2.js` · rta · table 'Urine pH' Type 1 'Always > 5.5'
- What: 'Always' is too absolute (incomplete dRTA, and some series use > 5.3); also the hyperkalaemic (voltage-dependent) distal RTA from obstruction or sickle cell is not mentioned while 'Plasma K⁺: Low' is presented as defining.
- Evidence: rta body table. Soriano 2002 JASN 13:2160.
- Fix: 'Usually > 5.5 despite acidosis'. Add under the table: 'Hyperkalaemic distal RTA (obstructive uropathy, sickle cell, amiloride) behaves like type 1 for urine pH but with high K⁺.' Optionally one line on type 3 (rare, carbonic anhydrase II deficiency) since learners ask 'where is type 3?'.

**T04-14** · `c4.js` · traps · summary 'Know the five classic traps'
- What: The table has eight rows, not five.
- Evidence: traps sum vs body table (8 rows).
- Fix: 'Know the classic traps' or 'Know these eight traps'.

**T04-15** · `c4.js` · traps · heading 'Two gases that disagree'
- What: The paragraph is about a gas versus a main-lab chemistry result, not two gases. Heading misleads.
- Evidence: traps body last h3.
- Fix: Rename to 'When the gas and the lab disagree'.

**T04-16** · `c4.js` · tc-radial · summary 'Most failed or misleading gases come from steps 2, 5 and 6'
- What: Unsourced claim presented as fact, and it omits the steps that cause most misleading results in the lesson module itself (air/delay = steps 7 and 8; missing FiO₂ = step 1).
- Evidence: tc-radial sum; preanal lesson lists bubble, delay, heparin, venous as the main errors.
- Fix: 'Most failed punctures come from positioning, angle and pulling the plunger (steps 2, 5, 6); most misleading results come from air, delay and a missing FiO₂ (steps 7, 8, 1).'

**T04-17** · `c2.js` · kacid · DKA paragraph and key 'Insulin start K⁺ ≥ 3.5'
- What: Body says 'above about 3.5', key says '≥ 3.5' (inconsistent). The hold-insulin rule is the ADA/international consensus; the UK JBDS pathway (relevant to MRCEM) says K⁺ < 3.5 needs senior review and extra potassium rather than an explicit insulin hold. No DKA guideline is cited for kacid.
- Evidence: kacid body/keys; LSRC.kacid = ['aronson11'] only. JBDS 02 (2023 update) DKA pathway; Umpierrez et al., Diabetes Care 2024 consensus.
- Fix: Use one wording ('K⁺ ≥ 3.5'); add 'UK JBDS: K⁺ < 3.5 → senior review and potassium before/with insulin; ADA: delay insulin until K⁺ ≥ 3.5'. Add jbds23 to LSRC.kacid (c5.js).

**T04-18** · `c5.js` · LSRC.kacid
- What: kacid teaches DKA potassium thresholds but cites only Aronson & Giebisch (and module refs).
- Evidence: c5.js line 75.
- Fix: kacid:['aronson11','jbds23'].

**T04-19** · `c7.js` · kacid · Q 'A mineral (hyperchloraemic) acidosis shifts potassium…' explanation
- What: Explanation 'H⁺ enters cells and K⁺ leaves to keep electroneutrality' is the old exchange model that the lesson's own source (Aronson & Giebisch 2011, 'new explanations for old observations') revises: the shift is mainly via reduced Na⁺/H⁺ exchange and Na⁺/K⁺-ATPase activity and the impermeant Cl⁻.
- Evidence: XQ.kacid in c7.js; Aronson & Giebisch J Am Soc Nephrol 2011;22:1981.
- Fix: 'Mineral acid lowers cell Na⁺ entry and Na⁺/K⁺-ATPase activity, so K⁺ leaks out; organic anions enter cells with H⁺ and cause little shift.'

**T04-20** · `c2.js` · kacid · 'Sodium bicarbonate' paragraph
- What: Presents bicarbonate as 'useful in hyperkalaemia with acidosis' without the caveat that its K⁺-lowering effect is small and slow and it is not a first-line emergency treatment.
- Evidence: kacid body. UK Kidney Association hyperkalaemia guideline 2020 (bicarbonate not routinely recommended for acute treatment).
- Fix: '…a small, slow effect: consider it only with severe metabolic acidosis, never instead of calcium and insulin–glucose.'

**T04-21** · `c2.js` · sites · last paragraph
- What: 'On room air or note the FiO₂ and device.' is a broken sentence.
- Evidence: sites body, final <p>.
- Fix: 'Record whether the patient is on room air, or note the FiO₂ and oxygen device.'

**T04-22** · `e3.js` · W.kidney · condition buttons in Proximal tubule view
- What: In the Proximal tubule view, 'Acid load (DKA)', 'Type 1 RTA' and 'Low aldosterone (type 4)' toggle (aria-pressed) but change nothing; only Acetazolamide works there. Looks broken.
- Evidence: openLesson('rta'); Proximal tubule + Type 1 RTA → stats unchanged ('80–90% / Almost none / Set further down / HCO₃⁻ held near 24').
- Fix: Either disable the distal-only buttons in prox view (with a hint 'switch to Collecting duct'), or auto-switch the segment to 'dist' when t1/t4/load is pressed and to 'prox' for acetazolamide. Add a 'Type 2 RTA' option for the proximal view (same as acetazolamide plus Fanconi note).

**T04-23** · `e3.js` · W.kidney · proximal stats 'Urine pH: Set further down'
- What: 'Set further down' is unclear jargon; a learner cannot tell what it means.
- Evidence: Proximal default stats row.
- Fix: 'Set by the collecting duct (usually 5–6)'.

**T04-24** · `c4.js` · tc-venous Q1 vs sites Q1; traps Q5 vs analyser Q5
- What: Near-duplicate questions in the same module: 'Which question can a peripheral venous gas answer reliably?' (tc-venous) and 'Which question does a peripheral VBG answer reliably?' (sites); 'Which sample gives a true sodium in hyperlipidaemia?' (traps, c7.js) and 'Which method causes pseudohyponatraemia…' (analyser, c7.js).
- Evidence: Lesson dumps.
- Fix: Replace tc-venous Q1 with a tourniquet-time or offset application question (e.g. 'Venous PCO₂ 44: can you exclude arterial hypercapnia?'); replace one sodium question with a total-CO₂ mixing question.

**T04-25** · `c2.js` · preanal keys 'Analyse within ≈ 15–30 min' vs tc-radial '30 minutes' vs tc-bubbles '~30 min'
- What: Three slightly different windows across the module.
- Evidence: Keys and bodies of preanal, tc-radial step 8, tc-bubbles.
- Fix: Standardise: 'within 30 minutes in plastic at room temperature; within 15 minutes if lactate or a very high PO₂ matters'.

**T04-26** · `c4.js` · tc-allen · reading table
- What: Bands leave gaps: 'Under about 5–7', '8–14', 'Over about 15' — 7–8 s and exactly 15 s are unassigned, and 'Under 5–7' is a range for a cut-off.
- Evidence: tc-allen body table. Brzezinski 2009 (Anesth Analg 109:1763) uses < 5–7 s normal, 7–15 s intermediate, > 15 s abnormal.
- Fix: Rows: '≤ 7 s → adequate', '8–14 s → equivocal', '≥ 15 s → poor'.

**T04-27** · `c4.js` · tc-allen · 'What the evidence says' bullet 3
- What: 'a pulse oximeter or Doppler on the thumb … (the Barbeau test)' — the Barbeau test is pulse oximetry/plethysmography; Doppler is a separate method. The c8.js question then offers 'Ultrasound only' as a wrong answer, which a reader of this sentence may think is right.
- Evidence: tc-allen body; XQ['tc-allen'] Q 'The Barbeau test uses…'. Barbeau 2004 Am Heart J 147:489.
- Fix: 'Pulse oximetry and plethysmography on the thumb while the radial artery is compressed (the Barbeau test, types A–D; only type D, no return of signal, argues against that radial). Doppler ultrasound is another objective option.' Change the distractor to 'A tourniquet on the forearm'.

**T04-28** · `c4.js` · uosm · table first column
- What: Thresholds have no 'equivocal' zone and the 'often 300–400' figure is unsourced; Kim 1996 used < 150 as low but values 150–300 are grey.
- Evidence: uosm body table; Kim GH et al. AJKD 1996;27:42.
- Fix: Add a middle row '150–300: grey zone, interpret with urine pH and clinical picture' or soften to 'usually > 300–400 in diarrhoea'.

**T04-29** · `c2.js` · renal · last sentence 'What drives more bicarbonate reclaim…'
- What: Aldosterone acts on distal H⁺ secretion (new HCO₃⁻), not proximal reclaim; listing it with 'reclaim' blurs the reclaim/regenerate split that the lesson builds.
- Evidence: renal body; Rose & Post ch. 11.
- Fix: 'What makes the kidney hold on to more bicarbonate (reclaim and regenerate): high PaCO₂, low ECF volume, angiotensin II (proximal), aldosterone (distal), hypokalaemia.'

**T04-30** · `c5.js` · LSRC.renal / W.kidney credit line
- What: The kidney model embedded in renal credits 'Batlle 1988' but the lesson's Sources list shows only Rose & Post and Soriano (2 sources).
- Evidence: openLesson('renal') → Sources · 2; model footer 'Sources: Rose & Post; Soriano 2002; Batlle 1988'.
- Fix: Add batlle88 to LSRC.renal, or have lessonSources merge sources of embedded models.

## Polish (8)

**T04-31** · `shell.html` · rta and other .tw tables at 390 px
- What: On phone the RTA table scrolls horizontally inside .tw with no visual cue; the Type 4 column — the one with the key bold 'High' K⁺ — is entirely off-screen and easy to miss. Same in traps (448 px content in 306 px).
- Evidence: Phone 390×844: .tw scrollWidth 458 vs clientWidth 306. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T04-rta-table-phone.png.
- Fix: Add a right-edge fade / 'scroll →' hint on overflowing .tw (e.g. background shadow gradient technique), or stack comparison tables into cards under 480 px; keep first column sticky.

**T04-32** · `shell.html` · comp · compensation model select at 1280 px (clinical skin)
- What: The 'Primary disorder' select is truncated to 'Metabolic acido' with a wide empty area to its right.
- Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T04-comp-models-clinical-light.png.
- Fix: Let the select grow (min-width:14ch / flex:1) or shorten option labels ('Met. acidosis').

**T04-33** · `c7.js` · alkmaint Q4 options
- What: Distractor wording is awkward: 'Past diuretic use ended', 'Recent vomiting spells', 'Nasogastric suction loss'.
- Evidence: XQ.alkmaint.
- Fix: 'Diuretics stopped a week ago', 'Vomiting', 'Nasogastric suction'.

**T04-34** · `c2.js` · comp · Q3 option 'Chronic'; Q5 option '16'
- What: 'Chronic' is not an interpretation of a metabolic acidosis (dead distractor). In Q5 the chronic value (24 − 5×2 = 14) would be the best distractor for testing acute vs chronic, but 16 is offered.
- Evidence: comp questions.
- Fix: Q3: replace 'Chronic' with 'Coexisting metabolic alkalosis'. Q5: replace 16 with 14 and say in the explanation 'chronic would be 14'.

**T04-35** · `c8.js` · tc-radial Q5 / tc-venous Q5 distractors
- What: Non-plausible distractors ('Raising pressure', 'Lowering PaO₂', 'It lowers the pressure', 'It stops clotting') make the questions trivial.
- Evidence: XQ['tc-radial'], XQ['tc-venous'].
- Fix: Use plausible errors: 'It makes the artery easier to feel', 'It prevents arterial spasm only', 'It is needed only in children'; for tourniquet: 'It raises PO₂ toward arterial', 'It removes the need to label the sample venous'.

**T04-36** · `c7.js` · sites · ScvO₂ question explanation
- What: 'a central line with its tip near the right atrium' — the tip should be in the lower superior vena cava / cavo-atrial junction; 'near the right atrium' is vague.
- Evidence: XQ for sites in c7.js.
- Fix: '…from a central line whose tip lies in the superior vena cava near the right atrium.'

**T04-37** · `c7.js` · alkmaint Q2 explanation
- What: Does not say why Hartmann's or bicarbonate are wrong (Hartmann's lactate is a bicarbonate source and it is chloride-poor).
- Evidence: alkmaint Q2.
- Fix: Append: 'Hartmann's contains lactate (turns into bicarbonate) and less chloride, so it does not fix the maintenance.'

**T04-38** · `c4.js` · tc-bubbles Q1 / drill 2 explanation
- What: Misses the quick proof: on room air with PCO₂ 12, PAO₂ ≈ 150 − 12/0.8 = 135, so a PaO₂ of 140–142 exceeds the alveolar value — physically impossible, which proves the bubble.
- Evidence: Alveolar gas equation; tc-bubbles Q1 'PaO₂ 142, PCO₂ 12'.
- Fix: Add: 'Check: PAO₂ ≈ 150 − 12 ÷ 0.8 ≈ 135. A PaO₂ above the alveolar PO₂ is impossible, so the sample has met air.'

## Ideas (8)

**T04-39** · `c2.js` · all 15 kid/samp lessons (l.ex)
- What: None of the 15 lessons has an example gas (l.ex), while 28 other lessons do. These modules are ideal for one: a vomiting gas with urine Cl⁻ 8 (alkmaint), diarrhoea NAGMA with urine electrolytes (rta), toluene NAGMA with K⁺ 2.1 (uosm), a 'venous in arterial syringe' gas (preanal), a bubble gas (tc-bubbles), a myeloma gas with AG 1 (traps).
- Evidence: node: L.filter(l=>l.ex).length = 28, none in kid/samp.
- Fix: Add ex:{…} objects for alkmaint, rta, uosm, comp, preanal, traps and tc-bubbles (c2.js and c4.js) so the 'Read this in the interpreter' button appears.

**T04-40** · `c4.js` · rta, uosm, tc-venous · tool links
- What: Lessons mention 'Labs → venous to arterial tool' and the urine gaps as text only; the 'urine' and 'vbg' tools exist.
- Evidence: TOOLS in ui3.js: 'vbg' and 'urine'.
- Fix: Add buttons (openTool('urine'), openTool('vbg')) or embed the urine-gap calculator under rta/uosm; extend l.w to support tools.

**T04-41** · `e3.js` · W.kidney · lesson-specific preset and alkalosis mode
- What: The same kidney model appears in renal, rta and alkmaint with identical default state. alkmaint needs a β-intercalated/pendrin view (Cl⁻ depletion stops HCO₃⁻ secretion; volume depletion drives reclaim), which the model cannot show.
- Evidence: Model has segments prox/dist only.
- Fix: Accept a preset from the lesson (e.g. w:['kidney:dist,t1']) and add a 'β-cell (alkalosis)' segment with toggles 'Vomiting (low Cl⁻)', 'Saline given', 'Aldosterone excess'.

**T04-42** · `c2.js` · renal · net acid excretion
- What: The lesson never states the daily balance: fixed acid ≈ 1 mmol/kg/day (50–100 mmol), net acid excretion = NH₄⁺ + titratable acid − urinary HCO₃⁻. The model mentions it, the body does not.
- Evidence: renal body vs W.kidney dist step 5.
- Fix: Add one equation box: 'Net acid excretion = NH₄⁺ + titratable acid − HCO₃⁻ ≈ 1 mmol/kg/day'.

**T04-43** · `c2.js` · preanal · haemolysis and whole-blood analysers
- What: Add that a blood gas analyser reads whole blood and cannot flag haemolysis, so a high K⁺ on a gas needs a lab sample (with haemolysis index) to confirm.
- Evidence: Supports the critical tc-bubbles fix.
- Fix: One bullet in preanal 'Rules' and in tc-bubbles.

**T04-44** · `c4.js` · tc-radial · ultrasound guidance
- What: No mention of ultrasound-guided arterial puncture, now common in ED/ICU and shown to raise first-pass success.
- Evidence: e.g. Gu WJ et al., Chest 2016 meta-analysis of ultrasound-guided radial artery catheterisation.
- Fix: Add a short 'Ultrasound' box: transverse view, artery pulsatile and non-compressible, needle tip tracking; cite the meta-analysis.

**T04-45** · `c2.js` · oxim · pulse CO-oximeters and methylene blue
- What: Add that multi-wavelength 'pulse CO-oximeters' exist but are not reliable enough to exclude CO poisoning, and that methylene blue itself drops SpO₂ transiently after treatment.
- Evidence: Weaver 2009 NEJM 360:1217; oxim body.
- Fix: Two bullets in 'Where SpO₂ misleads'.

**T04-46** · `c4.js` · traps · modern bromide example
- What: 'Old bromide-containing sedative' is remote; pyridostigmine bromide (myasthenia) and bromide in some cough/herbal products are current examples.
- Evidence: traps Q2 / body.
- Fix: Mention pyridostigmine bromide in the table row and the question stem.
