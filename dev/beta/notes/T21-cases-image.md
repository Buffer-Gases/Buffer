# T21 — Case library: image-led cases

**Covered:** im-capno, im-syringe, im-dip, im-print, im-co (c12.js data; capnoSVG, syringeSVG, monitorSVG, dipSVG in ui8.js; printout() in ui7.js). Every step played through; every image viewed at 390 px and 1280 px in dark and light (pixel skin), plus clinical light at 390/1280; kPa mode; 300-render randomness probe of the printouts. No console errors.

**Verdict:** the clinical core is sound (Henderson checks, AGs, Winter's, MetHb/COHb arithmetic, rhabdomyolysis fluids, shark fin/cleft teaching all correct). The weak points are realism and the format itself: the stems describe the images so they are never read, case printouts are random (impossible O₂Hb on a venous sample, conflicting temperatures, values change when you answer), the 'SaO₂ (co-oximeter)' label teaches the very misconception its cited source warns about, and printout A presents an inconsistency no analyser could print. Images are clear and fit at both widths, but they are schematic: the dipstick and syringe would not fool a clinician.

**Score: 6/10**

Findings: 6 major, 14 minor, 9 polish, 9 ideas. No critical.

## Major

### T21-1 · ui7.js · printout() extras via caseImg (im-print step B and C)
- **What:** Printout B (PO₂ 38, 'venous labelled arterial') shows a random 'tHb O₂Hb' of 90–97% in about 64% of renders, and printout C (PO₂ 142) can show O₂Hb 90–93%. A venous sample with PO₂ 38 has O₂Hb ≈ 70%; an O₂Hb of 95% on the same slip is physiologically impossible and contradicts the case's own logic (the sample is venous).
- **Evidence:** 300 renders of caseImg(CASES im-print step 2): O₂Hb row shown 193×, all ≥ 90%. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s2-1280-dark.png (other random rows).
- **Fix:** Case printouts must be deterministic. Add an optional `extra` array to the print img data (e.g. im-print B: O₂Hb 69.8, COHb 1.1, MetHb 0.8, Temp 37.0) and make printout(c,bad,opts) use it instead of NOISE when given; or at minimum derive O₂Hb from PO₂ with a Severinghaus curve.

### T21-2 · ui7.js · printout() Temp row vs header
- **What:** Header always says 'Temp 37.0 °C' but a random 'Temp' row (36.2–38.8 °C) is added in ~68% of renders, e.g. header 37.0 and row 38.7 on printout B. A picky clinician reads this as a broken printout; in a 'spot the bad sample' case it is a false clue.
- **Evidence:** 203/300 renders of im-print B contain a Temp row ≠ 37.0. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s2-1280-dark.png (row 'Temp 38.7').
- **Fix:** Drop the Temp row from NOISE, or print it in the header only (one source of truth: c.temp||37.0). Same fix serves the Real printouts drill.

### T21-3 · ui8.js · caseImg → printout (re-render on answer)
- **What:** The printout's random rows are regenerated every time caseStep re-renders, i.e. each time the learner taps an answer. The 'photo' changes under them: after a wrong answer, Hb, Crea, COHb, MetHb, Temp rows appear, vanish or change value (one render added 'Crea 161 H').
- **Evidence:** openCase('im-print'); read .printout text; caseAnswer(wrong); read again → different rows (t0 had Temp 36.3, COHb 1.6 H; t1 had MetHb 0.9, Crea 161 H, Hb 13.8).
- **Fix:** Cache the generated HTML per step: e.g. CS.img=CS.img||{}; CS.img[CS.i]=CS.img[CS.i]||caseImg(st.img). Combined with deterministic extras (finding above).

### T21-4 · ui8.js · monitorSVG label 'SaO₂ (co-oximeter)' (im-syringe step 2, im-co step 1)
- **What:** The 68%/72% value is the oxyhaemoglobin FRACTION (FO₂Hb = O₂Hb/total Hb), not SaO₂. A co-oximeter's sO₂ (functional, O₂Hb/(O₂Hb+HHb)) would read ≈ 99–100% here at PaO₂ 410/96. This is exactly the misconception Toffaletti 2007 (cited by both cases) warns about. The im-co question also calls the same number 'oxyhaemoglobin 72%', so image and stem disagree.
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-syringe-s2-390-light.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-co-s1-full390.png. Toffaletti & Zijlstra, Anesth Analg 2007;105:S5–S9.
- **Fix:** Relabel the row 'FO₂Hb (oxyhaemoglobin %)'; optionally add a fifth row 'sO₂ (calc. from PaO₂) 100%' to show the full saturation gap. Use the same wording in the c12.js stems.

### T21-5 · c12.js · im-capno steps 1–3, im-dip step 1, im-print A/B, im-syringe step 2 (question text)
- **What:** Image-led stems describe the image in words, so the image is never needed: 'the upstroke is slow and sloping, like a shark fin', 'a notch (cleft) appears in the plateau', 'Dipstick: blood +++', 'PO₂ 38, PCO₂ 48'. The format exists to train reading the picture.
- **Evidence:** Read any step of im-capno: answer is derivable from the stem alone.
- **Fix:** Neutral stems: 'Trace 1. What is the most likely cause?', 'Read the strip against the microscopy: 0–2 RBC/hpf. Why the mismatch?', 'Printout B is labelled arterial. Can you trust it?' Keep the description in the explanation instead.

### T21-6 · c12.js · im-print step A (pH 7.40, PCO₂ 40, HCO₃⁻ 14)
- **What:** Shown as an analyser printout, but analysers CALCULATE cHCO₃⁻ from pH and PCO₂ (the printout even shows the 'c' suffix: 'cHCO₃⁻(P)c'). A real printout cannot fail the Henderson check; only a transcription, or pH/PCO₂ from the gas set beside a chemistry-lab bicarbonate (total CO₂) from another time, can. Teaches a wrong model of the analyser.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s1-390-dark.png. AARC 2013 (hemoximetry/analysis: HCO₃⁻ is calculated).
- **Fix:** Recast A as a handwritten ward chart / a nurse's typed results message (pH, PCO₂ from the gas; HCO₃⁻ 14 from the lab sheet), not a printout; explanation: 'the analyser calculates HCO₃⁻ from pH and PCO₂, so a mismatch means a transcription error or numbers from different samples/times'. Needs a new img type (e.g. 'note') in ui8.js.

## Minor

### T21-7 · c12.js · im-co step 2 explanation
- **What:** 'A lactate above about 8 in smoke inhalation suggests cyanide.' The smoke-inhalation threshold is >10 mmol/L (Baud 1991: sens 87%, spec 94%, PPV 95% for blood cyanide >40 µmol/L). The 8 mmol/L cut-off comes from pure cyanide poisoning (Baud 2002). The case lactate 9.2 sits between the two, so it is a borderline example for the teaching point.
- **Evidence:** Baud FJ et al. N Engl J Med 1991;325:1761–6 (summary: https://www.medschool.umaryland.edu/em/cme/umem-educational-pearls/?id=3156).
- **Fix:** Change the case lactate to 11–12 (adjust HCO₃⁻/AG to fit) and the text to 'A lactate above 10 mmol/L in a smoke-inhalation victim strongly suggests cyanide (Baud 1991)'. Add a baud91 entry to SRC (c5.js) and to im-co src.

### T21-8 · c5.js · SRC registry (im-co, im-capno, im-dip sources)
- **What:** No capnography or cyanide source exists in SRC. im-capno cites 'apls' (paediatric life support) and 'west' (respiratory physiology), neither covers waveform capnography; im-dip cites only kraut10 although bosch09 (rhabdomyolysis, NEJM 2009) is already in the registry.
- **Evidence:** grep -i 'capnog|kodali|nap4|baud' c5.js → nothing.
- **Fix:** Add: kodali13 (Kodali BS. Capnography outside the operating rooms. Anesthesiology 2013;118:192–201), nap4 (Cook TM et al. NAP4, Br J Anaesth 2011;106:617–631), baud91. Then set im-capno src ['kodali13','nap4'], im-dip src ['bosch09','kraut10'], im-co add 'baud91' (c12.js).

### T21-9 · c12.js · im-dip step 1, option 'Contaminated sample' explanation
- **What:** The explanation for a wrong option reads like a confirmation: 'Consistent with rhabdomyolysis; repeat only if the story does not fit.' It does not say why contamination is wrong.
- **Evidence:** Pick 'Contaminated sample' in im-dip step 1.
- **Fix:** 'Contamination (e.g. menstrual blood) brings intact red cells, which microscopy would show; 0–2/hpf means free haem pigment.'

### T21-10 · ui8.js · capnoSVG value label and trace height
- **What:** The top-right number (48, 36, 0) has no label and no y-axis scale; the shark-fin trace (48) and the cleft trace (36) peak at the same height, so the number and the picture disagree. Grid lines are unlabelled; no time axis/RR.
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-capno-s1-1280-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-capno-s3-1280-dark.png.
- **Fix:** Add y-axis ticks (0, 25, 50 mmHg) on the grid lines and scale `top` from the ETCO₂ value (y = base − etco2/50×(base−top0)). Show 'ETCO₂ 48  RR 14' as a monitor-style numeric box.

### T21-11 · ui8.js · capnoSVG / monitorSVG / question text in kPa mode
- **What:** With Settings units = kPa, the monitor shows 'PaO₂ 54.7 kPa' and printouts show kPa, but the stems still say 'PaO₂ 410', 'PO₂ 38, PCO₂ 48', 'PO₂ 142'; the capnograph label is hard-wired 'ETCO₂ · mmHg'.
- **Evidence:** S.units='kPa'; open im-syringe step 2 / im-print step 2: monitor 54.7 kPa vs stem 'PaO₂ 410'.
- **Fix:** Template the numbers in c12.js stems through P()/PU() (e.g. q:()=>'PaO₂ '+P(410)+' '+PU()), or remove numbers from stems (see the image-led stem finding). Make capnoSVG use PU() and convert 48→6.4, 36→4.8 kPa.

### T21-12 · ui7.js · printout() reference ranges vs slip()
- **What:** Printout ranges differ from the gas slip used in the same case library: Na 136–145 / Cl 98–107 (printout) vs 135–145 / 98–106 (slip). Two 'normal' ranges side by side in the same app.
- **Evidence:** Compare /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s2-1280-dark.png with the im-co step-2 slip text (Na 135–145, Cl 98–106).
- **Fix:** Use one shared range table (e.g. a REF const used by both slip and printout).

### T21-13 · ui7.js · printout() random abnormal noise in case printouts
- **What:** Random flagged values (Crea 161–204 H, Hb 10.4 L, COHb 1.6 H) appear on the case printouts. In a 'which printout can be trusted' question these are red herrings with no story, and they change on re-render.
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s3-390-light.png (Crea 204 H), /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s2-1280-dark.png (Hb 10.4 L).
- **Fix:** For case printouts, use fixed normal extras (or none); keep randomised noise only in the Real printouts drill.

### T21-14 · c12.js · im-print step C stem
- **What:** The stem combines two pre-analytical errors: an air bubble (PO₂ toward ~150, PCO₂ down) and a 40-minute wait (ongoing metabolism lowers PO₂ and raises PCO₂). They push PO₂ in opposite directions; the explanation only mentions air.
- **Evidence:** Read im-print step 3.
- **Fix:** Either drop '40 minutes' or add to the explanation: 'delay alone would lower PO₂; here the bubble dominates'. Also show 'FiO₂ 21%' in the printout header (printout() hides FiO₂ when 0.21).

### T21-15 · c12.js · im-co (whole case)
- **What:** The confused smoke-inhalation patient is assessed and gassed 'on air' (fio2 0.21). In practice she is on 15 L non-rebreather oxygen from the door; the case never asks for oxygen or hyperbaric decisions, the core CO management (Weaver 2009).
- **Evidence:** im-co intro and step 2 gas (fio2:0.21).
- **Fix:** Say 'gas taken on arrival before oxygen' or put her on 15 L. Add a step 3: 'COHb 27%, confused: next?' → 100% O₂ via non-rebreather now and discuss HBO with the regional centre (Weaver 2009 criteria: loss of consciousness, neuro signs, COHb > 25%, etc.); distractor 'oxygen until SpO₂ normal' (it already is).

### T21-16 · c12.js · im-syringe step 2 explanation
- **What:** Methylene blue guidance is incomplete for a case aimed at MRCEM: no infusion time, no repeat dose, no mention of serotonergic drugs, and no fallback.
- **Evidence:** Wright 1999 (Ann Emerg Med 34:646): 1–2 mg/kg IV over 5 min, repeat after 1 h if needed; ineffective/harmful in G6PD deficiency; exchange transfusion/HBO if refractory.
- **Fix:** Extend: 'Methylene blue 1–2 mg/kg IV over 5 min; repeat after an hour if needed. Avoid in G6PD deficiency and with serotonergic drugs; if it fails, think G6PD deficiency or sulfhaemoglobin and call toxicology (exchange transfusion).'

### T21-17 · c12.js · im-capno step 2 distractors
- **What:** Distractors for the flat trace are weak ('hyperventilating', 'improved lung perfusion'). The real differential a clinician runs is DOPE/equipment: disconnection, blocked or kinked sampling line, ventilator failure, arrest.
- **Evidence:** Read im-capno step 2.
- **Fix:** Replace 'Improved lung perfusion' with 'Blocked sampling line: change the line and carry on' (explanation: possible, but you assume displacement until you have checked the tube); add 'Cardiac arrest' (explanation: CPR still gives a low trace; check a pulse too).

### T21-18 · ui8.js · syringeSVG
- **What:** Only the methaemoglobin syringe is ever drawn; the arterial and venous colours exist in the code but are not shown, so the learner cannot compare. The barrel also shows a white gap between the blood and the plunger rod with no rubber stopper, which reads as air in the syringe (a sampling error in a blood-gas app).
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-syringe-s1-1280-dark.png.
- **Fix:** Draw three labelled syringes (A arterial, B venous, C unknown) with an 'after shaking in air' swatch row: arterial bright red, venous reddens, MetHb stays brown. Add a dark stopper rect at x≈194 adjacent to the blood.

### T21-19 · ui8.js · dipSVG
- **What:** Not realistic: only 4 pads; real strips (Multistix 10 SG, Combur-10) have 10 pads incl. pH, SG, leucocytes, nitrite; strips carry no printed labels or '+++' (you read against the bottle chart). The '+++' labels give the answer away. pH and SG are relevant here (acidic, concentrated urine in rhabdomyolysis).
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-dip-s1-1280-light.png. Siemens Multistix 10 SG chart order: glucose, bilirubin, ketone, SG, blood, pH, protein, urobilinogen, nitrite, leucocytes.
- **Fix:** Draw a 10-pad strip without labels beside a simplified bottle colour chart (rows per test, neg→+++ swatches) so the learner matches colours; set pH 5.5, SG 1.030, leucocytes/nitrite neg.

### T21-20 · c12.js · im-dip
- **What:** Exertional collapse in the heat without a temperature: exertional heat stroke is the first thing to exclude in this story and changes management (cooling).
- **Evidence:** im-dip intro.
- **Fix:** Add 'Temperature 38.1 °C (rectal 38.4 °C after 30 min of cooling)' to the intro, or a step on heat stroke.

## Polish

### T21-21 · shell.html · .chat (empty)
- **What:** Image-led steps without messages render an empty .chat with margin 12px 0, leaving a ~60 px blank gap between the case card and the image.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-dip-s1-answered1280.png (gap between intro card and dipstick).
- **Fix:** Add `.chat:empty{display:none}` or skip the div when hist and st.m are empty.

### T21-22 · c12.js · im-capno steps 1 and 3 distractors
- **What:** 'Normal' (step 1) is a give-away distractor.
- **Evidence:** Read im-capno step 1.
- **Fix:** Replace with 'Hypoventilation' (explanation: a raised ETCO₂ keeps a square shape; this is about shape, not height) or 'Rebreathing'.

### T21-23 · c12.js · im-co step 2 distractor
- **What:** 'Diabetic ketoacidosis' is implausible.
- **Evidence:** Read im-co step 2.
- **Fix:** Replace with 'Carbon monoxide alone; oxygen is enough' (explanation: CO raises lactate modestly; a lactate this high with acidosis needs a cyanide antidote now). Add to the right answer: hydroxocobalamin 5 g IV, and draw co-oximetry first because hydroxocobalamin interferes with it.

### T21-24 · c12.js · im-syringe intro / step 2
- **What:** Patient's sex is not given in the intro ('A 26-year-old'), but the explanation says 'she is comfortable'.
- **Evidence:** Read intro and step 2 option 3 explanation.
- **Fix:** 'A 26-year-old woman after dental work…'.

### T21-25 · c12.js · im-print step C explanation
- **What:** 'Room-air PaO₂ cannot exceed the alveolar PO₂ of about 100' is only true at a PCO₂ near 40 (PAO₂ = 150 − PCO₂/0.8).
- **Evidence:** Read im-print step 3.
- **Fix:** '…of about 100 at this PCO₂ (PAO₂ = 150 − 39/0.8 ≈ 101)'.

### T21-26 · ui8.js · capnoSVG cleft
- **What:** The curare cleft is drawn identically, deep (~35% of amplitude) and early on every breath; real clefts sit in the later plateau and vary breath to breath.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-capno-s3-1280-dark.png.
- **Fix:** Move the notch to 0.42–0.50 of the cycle, depth ~15–20%, and vary depth per breath (e.g. [18,10,22,14]px).

### T21-27 · ui8.js · syringeSVG aria-label
- **What:** aria-label announces 'chocolate-brown blood', handing screen-reader users the answer, while capno's label ('Capnography trace') gives them nothing.
- **Evidence:** Source of syringeSVG / capnoSVG.
- **Fix:** Neutral but useful labels: 'Blood gas syringe; colour shown in the swatch' and a shape description for capno only in the explanation.

### T21-28 · shell.html · .img-dip .scr, .img-syr .scr
- **What:** Physical objects (dipstick, syringe) are drawn on the near-black monitor screen (#0d1117) in every theme; in light themes they sit in a black box. The monitor and capnograph rightly look like screens; a dipstick or syringe does not.
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-syringe-clinical-light-390.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-dip-s1-1280-light.png.
- **Fix:** Give .img-dip/.img-syr a theme-aware background (var(--card) or a neutral bench grey) and keep the dark screen only for .img-capno/.img-mon.

### T21-29 · ui7.js · printout() number formatting
- **What:** Single-decimal analyser rows print integers without a decimal ('MetHb 1', 'cBase(Ecf)c 0'); real printouts keep fixed decimals (1.0, +0.0).
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T21-im-print-s3-390-light.png ('MetHb 1', 'cBase(Ecf)c 0').
- **Fix:** Use toFixed(1) for these rows and keep the sign for BE.

## Ideas (ranked by value)

1. **T21-30 · new image case: capnography during CPR** (c12.js): Highest-value addition: ETCO₂ during CPR. Traces: low 8–10 mmHg with poor compressions → rises to 15–20 after compressor swap → sudden jump to 40+ = ROSC; plus 'ETCO₂ <10 after 20 min'. Directly examinable (MRCEM) and used every shift. *Fix:* capnoSVG kind 'cpr' (compression-rate small waves) and 'rosc' (step-up); 3-step case.
2. **T21-31 · new image case: hyperkalaemia ECG** (c12.js): Link to im-dip (K⁺ 6.1): a rhythm strip with peaked T, then wide QRS/sine wave as K⁺ rises; questions on calcium, insulin–dextrose, and why calcium is still given in rhabdomyolysis despite later hypercalcaemia risk. *Fix:* New img type 'ecg' with k:'peakedT'|'wideQRS'|'sine'.
3. **T21-32 · saturation-gap monitor** (ui8.js): Three-number panel: SpO₂, analyser-calculated sO₂ (from PaO₂) and co-oximeter FO₂Hb, with the question 'which number is right?'. Teaches the saturation gap that MetHb, CO and sulfHb share. *Fix:* Extend monitorSVG with an optional calc row.
4. **T21-33 · realistic analyser screen** (ui8.js): A generic analyser screen (not a brand) with error/flag states: 'clot detected', 'insufficient sample', '?' flags, 'Sample type: not selected', haemolysis index → spurious K⁺. Trains real-world sample rejection. *Fix:* New img type 'screen'; 3–4 steps.
5. **T21-34 · haemolysed / plasma colour image** (c12.js): Centrifuged tubes: pink plasma (haemoglobin, haemolysis) vs clear plasma with cola urine (myoglobin). Adds the classic discriminator to im-dip and a pseudo-hyperkalaemia case. *Fix:* New img type 'tube' with plasma/urine colours.
6. **T21-35 · oesophageal intubation capnograph** (c12.js): Few breaths of decaying waveform then flat (NAP4: 'no trace = wrong place'), including during cardiac arrest. *Fix:* capnoSVG kind 'oeso'; add to im-capno or a new case.
7. **T21-36 · normal reference trace** (ui8.js): capnoSVG supports a normal trace but no step uses it. Show a faint normal strip above each abnormal trace, or add a step 0 asking the learner to tap phases I–IV. *Fix:* Pass k:'normal' as a reference layer or new first step.
8. **T21-37 · methaemoglobin bedside test** (c12.js): Drop of blood on white filter paper beside a normal control: brown stays brown (classic bedside test, Wright 1999). More realistic than a swatch on a black screen. *Fix:* Add to syringeSVG as a second panel.
9. **T21-38 · sulfhaemoglobin / dapsone variant** (c12.js): A follow-up case where methylene blue fails (dapsone, G6PD or sulfHb) – a high-yield twist for USMLE. *Fix:* New image case or extra step in im-syringe.

## Checked and correct
- Henderson: A 24×40/14 = 68.6 nmol/L → pH 7.16; B 7.33; C 7.41; im-dip 7.29; im-co 7.31 — all internally consistent.
- AG: im-dip 139−(102+16.9) = 20.1; im-co 19.2. Winter's for im-dip 33 ± 2 (venous 36 fits).
- MetHb 31% with PaO₂ 410 → FO₂Hb ≈ 68% and SpO₂ plateau ≈ 85%: consistent (Barker 1989). COHb 27% → FO₂Hb 72%, SpO₂ 99%: consistent.
- Rhabdomyolysis urine output target 200–300 mL/h and caution on bicarbonate/diuretics match Bosch 2009.
- Shark fin = obstruction, cleft = spontaneous effort, raised baseline = rebreathing: correct.
- Layout: images fit at 390 and 1280 with no horizontal scroll; printout drops the reference column under 520 px; keyboard 1–3 works.
