# T03 · Learn: modules micro (Cells and microbes) and gas (Oxygen, CO₂ and the lungs)

## Summary
Covered all 13 lessons (acidsrc, lactate, ketones, microbes, rbc, toxalc, o2content, odc, hypox, ratios, co2vent, respfail, ventchg): body, keys, hook, all 5 questions with options and explanations, the embedded models (rbc, odc, odcplay, o2c, vq, hh), and the sources. Rendered every lesson at 390×844 and 1280×800 (pixel, dark) and four lessons in clinical/light; no console errors, no page-level horizontal scroll, all models mounted. Arithmetic in every worked example and question was checked by hand (CaO₂, DO₂, P/F, rate formula, DKA pH 7.17 → 6.94, acute-on-chronic 28/40 bands, P50 36.3 in the exercise scenario): all correct except one rounding.

Verdict: physiologically strong, clearly written, plain British English. One real clinical inconsistency (SpO₂ target 92–96% in odc vs BTS 94–98% everywhere else), one question with two defensible answers, a mis-pointed cross-reference, and weak source mapping for the micro module. Distractors are the weakest part. Score: **8/10**.

Findings: 3 major, 17 minor, 15 polish, 7 ideas (no critical).


## Major

**T03-1** · `c1.js` · lesson odc · body last paragraph (c1.js:311)

- What: Says SpO₂ targets 'sit at 92–96% for most patients'. The cited UK guideline (BTS 2017, already in SRC as odriscoll17) and every other place in the app (c2.js:177, c3.js:275, c10.js:51, c12.js:77, ui6.js:43, c8.js:51) say 94–98%. A learner preparing for MRCEM gets two different numbers.
- Evidence: grep '92–96\|94–98' c*.js ui*.js; O'Driscoll BR et al. BTS guideline for oxygen use in adults. Thorax 2017;72(Suppl 1):ii1–ii90 (target 94–98%, 88–92% if at risk of hypercapnic failure).
- Fix: Change to 'SpO₂ targets sit at 94–98% for most acutely ill patients (88–92% if at risk of hypercapnic respiratory failure), BTS 2017'. Optionally add 'some guidelines (TSANZ 2015) use 92–96%'. Add odriscoll17 to LSRC.odc.

**T03-2** · `c1.js` · lesson microbes · question 2 (CML, WBC 280, PaO₂ 48, SpO₂ 98%)

- What: The distractor 'Venous sample' is also a correct explanation: a venous sample gives PO₂ ~40–50 with a normal SpO₂ in a well patient. Two defensible answers.
- Evidence: Stem: 'A patient with CML (WBC 280) has PaO₂ 48 but SpO₂ 98% and looks well.' Nothing excludes venous sampling.
- Fix: Make the arterial sample certain in the stem, e.g. 'Arterial sample confirmed (pulsatile flash, PaCO₂ 38). A repeat analysed at once on ice reads PaO₂ 92.' Or replace the 'Venous sample' option with 'Pulmonary embolism'.

**T03-3** · `c5.js` · LSRC.rbc / MSRC.micro

- What: The red-cell lesson (Bohr, Haldane, chloride shift, CO₂ carriage 90/5/5 and 30/10 shares, 2,3-BPG) cites Kraut & Madias 2014 'Lactic acidosis', Rose & Post, and Severinghaus 1966 'Blood gas calculator'. None of them is a source for red-cell CO₂ transport. The micro module default (kraut14) puts the lactic acidosis paper on every micro lesson, including acidsrc, rbc and toxalc, where it supports nothing.
- Evidence: Open lesson rbc → Sources · 3. MSRC.micro=['kraut14','rose'].
- Fix: Set MSRC.micro=['rose'] and add kraut14 only to lactate/microbes (it is already in LSRC.lactate). Add 'west' and 'nunn' to LSRC.rbc (West's Respiratory Physiology ch. 6 gives the 90/5/5 and exchanged-CO₂ shares).


## Minor

**T03-4** · `c1.js` · lesson lactate · last paragraph

- What: 'D-lactate (bacterial) ... See the next lesson.' The next lesson is ketones; D-lactate is in microbes, two lessons on.
- Evidence: Order in L: lactate (12) → ketones (13) → microbes (14). The pager on lactate says 'Next: Ketones and ketoacidosis'.
- Fix: Change to 'See "Microbes, the gut and the syringe" later in this module', ideally as a link: <a href="#l-microbes">.

**T03-5** · `c1.js` · lesson acidsrc · body paragraph 3

- What: 'Each mmol consumes one HCO₃⁻, which the kidneys must regenerate. That is the whole job of renal acid excretion.' This leaves out reabsorption of filtered bicarbonate (≈ 4,000–4,500 mmol/day), which is most of the kidney's acid–base work and the basis of proximal RTA, taught later.
- Evidence: Rose & Post ch. 11; GFR 180 L/day × 24 mmol/L ≈ 4,300 mmol/day filtered.
- Fix: Replace the last sentence with: 'The kidney has two jobs: reclaim nearly all of the ≈ 4,300 mmol of bicarbonate filtered each day (proximal tubule), and make new bicarbonate to replace what fixed acid used up (ammonium and titratable acid excretion).'

**T03-6** · `c1.js` · lesson acidsrc · 'The two clocks' vs question 5

- What: The section is called 'The two clocks' (lungs, kidneys) but question 5 asks to order three responses including buffers, which the lesson never mentions.
- Evidence: Body has no mention of chemical buffering; q5 answer 'Buffers, lungs, kidneys'.
- Fix: Rename to 'Three clocks' and add: 'Chemical buffers (bicarbonate, haemoglobin, proteins, bone) act in seconds, lungs in minutes, kidneys over 3–5 days.' Add a key 'Buffers: seconds'.

**T03-7** · `c1.js` · lesson ketones · h3 'Three ketoacidoses'

- What: The heading says three but the list has four bullets (diabetic, euglycaemic DKA, alcoholic, starvation).
- Evidence: Rendered lesson ketones.
- Fix: Rename to 'Four kinds of ketoacidosis', or nest euglycaemic DKA under diabetic and keep 'Three'.

**T03-8** · `c1.js` · lesson ketones · key 'Urine strip detects: Acetoacetate only'

- What: Nitroprusside reacts with acetoacetate and (weakly) acetone; 'only' is wrong as stated. The teaching point is that it misses β-hydroxybutyrate.
- Evidence: Standard chemistry of nitroprusside strips (e.g. Laffel 1999 Diabetes Metab Res Rev 15:412).
- Fix: Key: 'Urine strip misses' → 'β-hydroxybutyrate'. Body: 'detect acetoacetate (and a little acetone), not BHB'.

**T03-9** · `c1.js` · lesson microbes · D-lactic acidosis paragraph

- What: States D-lactic acidosis gives 'a high anion gap acidosis'. D-lactate is excreted in urine faster than L-lactate, so the anion gap is often only mildly raised or even normal; a normal gap does not exclude it. (Doubt level: I am confident of this point but did not fetch the paper.)
- Evidence: Kowlgi NG, Chhabra L. D-lactic acidosis: an underrecognized complication of short bowel syndrome. Gastroenterol Res Pract 2015;2015:476215.
- Fix: Add: 'The gap may be only mildly raised, or normal, because the kidney excretes D-lactate quickly.' Add the source to SRC and LSRC.microbes.

**T03-10** · `c5.js` · LSRC.microbes

- What: D-lactic acidosis, secretory diarrhoea and ureterosigmoidostomy claims have no supporting source; only Hess 1979 (pseudohypoxaemia) is lesson-specific.
- Evidence: Lesson microbes → Sources · 3.
- Fix: Add a D-lactate source (Kowlgi 2015 or Uribarri J et al. Medicine 1998;77:73–82) and kraut10 (already in SRC) for diarrhoea/NAGMA.

**T03-11** · `c1.js` · lesson o2content · last paragraph

- What: 'A high venous saturation with a high lactate suggests cells cannot use oxygen: cyanide, late sepsis, or shunting.' A learner who has just read 'shunt' in the hypoxaemia lesson reads this as pulmonary shunt, which lowers venous saturation.
- Evidence: Body text of o2content; hypox lesson uses 'shunt' for pulmonary shunt.
- Fix: Write 'microcirculatory (arteriovenous) shunting, where blood bypasses the tissues'.

**T03-12** · `c1.js` · lesson odc · hook

- What: '"40-50-60 → 75-?-90"' — the '?' reads as a typo and the hook is not memorable. At 50 mmHg saturation is ≈ 85%.
- Evidence: Severinghaus 1966 equation: S(50 mmHg) ≈ 84–85%. The app's own ODC model shows ≈ 85% at 50.
- Fix: '40-50-60 → 75-85-90, and P50 is 27. Right shift releases; left shift hoards.' Optionally add 50 mmHg / 85% to the table.

**T03-13** · `c1.js` · lesson respfail · 'Treat the pH' paragraph

- What: 'the same PaCO₂ with pH 7.25 needs non-invasive ventilation' — BTS/ICS 2016 says start NIV when pH < 7.35 and PaCO₂ > 6.5 kPa persist after optimal medical therapy (and controlled oxygen), usually reassessed within about an hour; the guideline the lesson cites.
- Evidence: Davidson AC et al. BTS/ICS guideline, Thorax 2016;71(Suppl 2):ii1–ii35, recommendations for AECOPD.
- Fix: '...with pH 7.25 that persists after nebulisers, steroids and controlled oxygen (target 88–92%) needs NIV.'

**T03-14** · `c7.js` · lesson respfail · question 'Type 2 respiratory failure is defined by PaCO₂ above…' explanation

- What: Explanation says 'Along with hypoxaemia, a PaCO₂ above the normal range defines type 2', but the lesson table says type 2 PaO₂ is 'Low or normal'. Contradiction.
- Evidence: XQ.respfail in c7.js vs c1.js respfail table.
- Fix: 'A PaCO₂ above the normal range (> 45 mmHg, 6 kPa) defines type 2, whatever the PaO₂.'

**T03-15** · `c6.js` · lesson toxalc · questions

- What: Title and body teach 5-oxoproline and the lactate gap, but none of the 5 questions tests either. The lactate gap is a high-yield exam and shift pearl.
- Evidence: Dump of toxalc q (5 items: early gap, isopropanol, fomepizole, EG target, methanol vision).
- Fix: Add to XQ.toxalc: 'Gas lactate 12, lab lactate 1.8, AG 28, ethanol-free. Likely?' → ethylene glycol (glycolate read as lactate); and 'Malnourished woman on regular paracetamol and flucloxacillin, AG 26, lactate and ketones normal. Likely acid?' → 5-oxoproline.

**T03-16** · `c1.js` · lesson lactate · question 2 'Which lactate type is metformin toxicity?'

- What: Options A/B1/B2/B3 are shuffled at render (seen as 'B3, A, B2, B1') and sit beside the A–D key letters, so the learner sees '[A] B3 · [B] A · [C] B2 · [D] B1'. Confusing to read and to tap.
- Evidence: Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T03-lactate-phone.png, question 2.
- Fix: Write options as 'Type A', 'Type B1', etc., and add a per-question 'keep order' flag (e.g. 5th element {fixed:1}) that renderLesson in ui1.js honours for ordinal options.

**T03-17** · `ui1.js` · renderLesson · option shuffle

- What: No way to keep the natural order of ordinal options (types, numbers). Also affects numeric options such as ventchg q4 'About 7 / 25 / 20 / 15' and odc q2 mmHg values, which read better ascending.
- Evidence: renderLesson uses shuffle(it[1]...) unconditionally.
- Fix: Honour a fixed-order flag; or sort options when all are numbers/ordinals.

**T03-18** · `ui2.js` · practice whatif hint (ui2.js:62) vs lesson ventchg

- What: The step hint says 'Acutely, HCO₃⁻ moves only ≈ 1 per 10 mmHg of PCO₂' for every whatif item, including the over-ventilated retainer (PCO₂ falling), while ventchg teaches −2 per 10 for falls (the app's own 2/5 rule).
- Evidence: ui2.js:62 and ui2.js:88; c1.js ventchg body and keys.
- Fix: Hint: 'Acutely, HCO₃⁻ rises ≈ 1 per 10 mmHg rise in PCO₂ and falls ≈ 2 per 10 mmHg fall.' Check the whatif generator arithmetic uses −2 for falls.

**T03-19** · `c5.js` · LSRC.ratios

- What: The 2023 global ARDS definition (S/F ≤ 315 with SpO₂ ≤ 97%, HFNO ≥ 30 L/min) is taught and tested (q5) but only Berlin 2012 is cited.
- Evidence: Lesson ratios → Sources · 3.
- Fix: Add SRC.matthay24: 'Matthay MA, et al. A new global definition of acute respiratory distress syndrome. Am J Respir Crit Care Med 2024;209:37–47.' and add to LSRC.ratios. Say 'global definition (2023, published 2024)'.

**T03-20** · `c5.js` · LSRC.odc, LSRC.co2vent, LSRC.ventchg

- What: odc and co2vent give SpO₂ targets (BTS) and ventchg teaches permissive hypercapnia and 6 mL/kg PBW without those guidelines in their sources.
- Evidence: Sources lists: odc = West, Nunn, Severinghaus; co2vent/ventchg = West, Nunn, Epstein.
- Fix: Add odriscoll17 to odc and co2vent; add fan17 (ATS/ESICM/SCCM 2017) and brackett65 (acute CO₂ titration slope) to ventchg.


## Polish

**T03-21** · `c1.js` · lesson ratios · first paragraph

- What: 'Use FiO₂ as a fraction (0.21 → 0.21)' — the example maps a value to itself.
- Evidence: Rendered lesson ratios.
- Fix: 'Use FiO₂ as a fraction (21% → 0.21).'

**T03-22** · `c1.js` · lesson hypox · table row V/Q mismatch

- What: 'COPD, asthma, pneumonia, PE (the commonest cause)' reads as 'PE is the commonest cause of hypoxaemia'.
- Evidence: Rendered table, Examples column.
- Fix: Move to the mechanism cell: 'V/Q mismatch (the commonest mechanism)'.

**T03-23** · `c1.js` · lesson toxalc · question 2 isopropanol, correct option

- What: 'Ketosis without acidosis and an osmolar gap' can be read as 'without acidosis and without an osmolar gap'. Also it is the only long option, a length cue.
- Evidence: XQ/c1 toxalc q2.
- Fix: 'Ketosis and an osmolar gap, but no acidosis'; lengthen distractors, e.g. 'Severe HAGMA with an osmolar gap'.

**T03-24** · `c1.js` · lesson o2content · question 1 explanation

- What: 'raises content from ≈ 8.8 to ≈ 12.6 mL/dL' — with SaO₂ 0.92 and PaO₂ 65: 1.34×10×0.92 + 0.003×65 = 12.5.
- Evidence: Hand arithmetic: 12.33 + 0.195 = 12.52.
- Fix: Change 12.6 to 12.5.

**T03-25** · `c1.js` · lesson co2vent · equation

- What: 'PaCO₂ = 0.863 × VCO₂ ÷ V_A' has no units; 0.863 only works with VCO₂ in mL/min (STPD) and V_A in L/min (BTPS), PaCO₂ in mmHg.
- Evidence: West, ch. 2.
- Fix: Add '(VCO₂ in mL/min, V_A in L/min, PaCO₂ in mmHg). Example: 200 ÷ 4.3 × 0.863 ≈ 40.'

**T03-26** · `c7.js` · lesson co2vent · question 3 explanation

- What: Same explanation word for word as question 1 ('PaCO₂ is inversely proportional to alveolar ventilation.'), so it teaches nothing new.
- Evidence: c1.js co2vent q1 and XQ.co2vent in c7.js.
- Fix: 'Doubling V_A halves PaCO₂: 40 ÷ 2 = 20 mmHg. Real patients rarely get this low because the work of breathing raises VCO₂.'

**T03-27** · `c1.js` · lesson ventchg · last paragraph

- What: 'In the Drill's step-by-step mode' — the Practice tab calls this mode 'Step by step'; 'Drill' is a different label (drill titles).
- Evidence: ui2.js:4 MODES.steps.t='Step by step'.
- Fix: 'In Practice → Step by step, some cases end with a "What happens next" step built on these numbers.' Make it a button to startSession('steps').

**T03-28** · `c1.js` · lesson acidsrc · body vs question 3

- What: Body says 'Sulfuric acid', question 3 says 'Sulphuric acid'. Lactate body says 'citric acid cycle', lactate q5 says 'Krebs cycle'.
- Evidence: c1.js acidsrc and lactate.
- Fix: Pick one spelling (UK medical texts and IUPAC use 'sulfuric') and one name ('citric acid (Krebs) cycle' once, then one).

**T03-29** · `c1.js` · lesson lactate · type table

- What: Cyanide appears in both type A and type B2 rows without explanation.
- Evidence: Rendered table.
- Fix: Keep it in B2 only (or A only) and add a note: 'Cyanide and CO block cell use of oxygen, so they straddle A and B.'

**T03-30** · `c6.js` · weak distractors (several lessons)

- What: Several distractors are implausible and give the answer away: lactate q4 'Skin and bone'; odc q4 '50% desaturated and dead' and q5 'Loses its iron' (c7.js); rbc q3 'Upward only', q5 'Down'; ketones q3 'Pyruvate and lactate', q4 'A raised osmolar gap always'. In c1.js: acidsrc q2 'Kidneys only filter at night'; rbc q1 offers both 'Chloride shift' and 'Hamburger effect' (the same thing, so both are obviously wrong).
- Evidence: Lesson dump; files by grep: c6.js, c7.js, c1.js.
- Fix: Replace with plausible errors: lactate q4 'Skeletal muscle and gut'; odc q4 '50% of the PO₂ at full saturation'; odc q5 'Loads more oxygen in the lung'; rbc q1 replace 'Hamburger effect' with 'Loss of hypoxic drive'; ketones q3 replace 'Pyruvate and lactate' with 'Free fatty acids'; acidsrc q2 'Filtered load must rise first'.

**T03-31** · `c1.js` · correct answer length cue

- What: In 5 of 65 questions the correct option is the only long one (acidsrc q2, ketones q2, toxalc q2, co2vent q2, ventchg q3), a give-away for test-wise learners.
- Evidence: Script: options where correct length > 1.5 × longest distractor.
- Fix: Lengthen distractors to match, e.g. ketones q2 'Insulin drives the liver to make more acetoacetate'.

**T03-32** · `c6.js` · lesson ketones · question 'In alcoholic ketoacidosis the glucose is typically…'

- What: Option 'Always above 20' has no unit.
- Evidence: XQ.ketones.
- Fix: 'Always above 20 mmol/L'.

**T03-33** · `c1.js` · lesson microbes · question 2

- What: 'WBC 280' has no unit.
- Evidence: Stem.
- Fix: 'WBC 280 × 10⁹/L'.

**T03-34** · `shell.html` · .tw table wrapper on phone

- What: At 390 px the 3–5 column tables (lactate types, toxalc, hypox, respfail, odc, ratios) are clipped mid-word ('seizu', 'Metformin, salbu') with no sign they scroll sideways. hypox loses most of the Examples column.
- Evidence: Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T03-lactate-phone.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T03-hypox-phone.png; .tw{overflow-x:auto} only.
- Fix: Add a right-edge fade/shadow on overflow (background-attachment:local gradients) and a small 'swipe →' hint, or stack rows as cards under 480 px.

**T03-35** · `e2.js` · W.odc canvas label (e2.js:105)

- What: The 'dashed = normal' caption sits on the start of the curve at bottom-left and, with no shift, there is no dashed line to explain.
- Evidence: Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T03-odc-desk.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T03-rbc-desk.png.
- Fix: Move the caption to the legend row below the canvas and show it only when a shift is applied.


## Ideas (ranked by value)

**T03-36** · `c1.js` · all 13 micro/gas lessons · worked gas

- What: None of these lessons has a worked gas (l.ex), while 23 clinical lessons do. ketones, toxalc, microbes, respfail and ventchg are ideal for one, and the 'Open in the Interpreter' button is the bridge from theory to practice.
- Evidence: grep -c 'ex:{' c1.js → 0.
- Fix: Add ex: ketones (euglycaemic DKA on empagliflozin: pH 7.18, PCO₂ 22, glu 11, BHB 5.2), toxalc (early: osm 322, AG 13), microbes (D-lactate: AG 24, lac 1.1), respfail (acute-on-chronic: pH 7.25, PCO₂ 80, HCO₃⁻ 34), ventchg (DKA before/after sedation).

**T03-37** · `c1.js` · lesson hypox

- What: The lesson says 'Calculate the A–a gradient' but never gives the alveolar gas equation or the app's normal (≤ age/4 + 4).
- Evidence: Body step 1.
- Fix: Add a key 'Normal A–a ≤ age/4 + 4 mmHg' and a one-line equation PAO₂ = FiO₂ × 713 − PaCO₂/0.8, linking to the alv lesson.

**T03-38** · `c6.js` · lesson toxalc / lactate

- What: Add a 'lactate gap' and '5-oxoproline' case to Gas sense or the case library; both are classic unexplained HAGMA traps.
- Evidence: —
- Fix: See finding on toxalc questions.

**T03-39** · `c1.js` · lesson acidsrc

- What: Teach net acid production: fruit and vegetables supply organic anions (alkali) that offset part of the protein acid load; this is why net endogenous acid production ≈ 1 mmol/kg is diet-dependent and explains CKD diet advice.
- Evidence: Rose & Post.
- Fix: One sentence plus a key 'Diet alters fixed acid'.

**T03-40** · `c1.js` · lesson respfail · asthma question

- What: Align with BTS/SIGN asthma severity: PaCO₂ 4.6–6.0 kPa is life-threatening, > 6.0 kPa near-fatal. 48 mmHg (6.4 kPa) is 'near-fatal asthma', a term MRCEM uses.
- Evidence: BTS/SIGN British guideline on the management of asthma.
- Fix: Explanation: '48 mmHg (6.4 kPa) is near-fatal asthma: call ICU.'

**T03-41** · `c1.js` · lesson o2content

- What: Mention why 1.34 (vs 1.39 theoretical Hüfner) and that CO-Hb and MetHb lower content with a normal PaO₂; link to the co-oximetry lesson.
- Evidence: —
- Fix: Add one bullet under 'Which lever matters?'.

**T03-42** · `c1.js` · lesson ratios

- What: Note that P/F changes with PEEP, FiO₂ and altitude (Berlin adjusts for altitude: P/F × barometric pressure/760), so a single P/F can mislead.
- Evidence: Berlin 2012.
- Fix: Add a 'Limits of P/F' bullet.
