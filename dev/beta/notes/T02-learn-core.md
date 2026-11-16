# T02 · learn-core: Learn tab structure, modules Start here, Chemistry and Physics

## Summary
**What I covered:**
- The Learn tab: the module list, progress counts, open/close, the module check row and the quiet-mode wording.
- The lesson view: crumbs, counter, key numbers, Make it stick, Connect it, interactive models, Check yourself, the Sources card and the pager.
- Viewports: phone, tablet, desk and wide, in the pixel/dark and clinical/light skins.
- Every lesson in start, chem and phys (learn, ph, buffer, ca, hh, otherbuf, stewart, stewartx, dalton, henry, alv, temp). For each I read the body, keys, hook and all 5 questions (c1, c4 and the XQ merged from c6), with options and explanations, and the sources.
- I checked every calculation by hand or in node: the 80 rule, HH, Henderson, SIDa/SIDe/SIG, PiO₂ at altitude (standard atmosphere), A–a, CaO₂ and hyperbaric dissolved O₂.
- I confirmed the Aswan audit figures against the paper (Cureus 2024;16:e74906).

**Verdict:**
- The content is accurate and clearly written, and nearly all of the arithmetic is right.
- There were no console errors, and no page scrolls sideways at any viewport.
- The weaknesses:
  - one wrong teaching point on compensation (hh Q1);
  - several explanations that blur "compensation" and "full compensation" or misstate the log;
  - an evidence page whose Sources card does not support its claims;
  - 'Next' marks lessons done without any retrieval;
  - redundant or weak questions in temp, ca and buffer.

I checked the pager and order in the built file: stewartx sits correctly as lesson 8, after stewart. The order in tests/load.js differs, but the UI is right.

**Score: 7.5/10**

## Critical
- **T02-1** · `c1.js` · lesson hh, question 1 (PCO₂ 20, HCO₃⁻ 12 → pH 7.40), explanation
  - What: The explanation says the gas is 'a heavily compensated metabolic acidosis, or a mixed disorder'. By the app's own Winter's rule the expected PCO₂ for HCO₃⁻ 12 is 1.5×12+8 = 26 ± 2 (24–28), so a PCO₂ of 20 is too low: this cannot be a compensated metabolic acidosis. Compensation also never brings pH back to 7.40. This is the step the 'learn' lesson says learners get wrong most often (47%), and here the app teaches the wrong habit.
  - Evidence: Run node: Winter 1.5*12+8 = 26. Answering Q1 in lesson hh shows the explanation (screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-hh-answered-desk.png).
  - Fix: Replace the explanation with: '12 ÷ (0.03 × 20) = 20, the normal ratio, so pH 7.40. A normal pH with both values far from normal is never compensation alone: Winter's predicts PCO₂ 26 ± 2, so 20 means a second disorder (metabolic acidosis plus respiratory alkalosis, e.g. salicylate or sepsis).'

## Major
- **T02-2** · `c5.js` · lesson learn, Sources card (LSRC has no 'learn' entry)
  - What: The lesson makes specific evidence claims: the Aswan audit with exact percentages, Hatala 2003, the expertise reversal effect, retrieval practice, spacing, combining pattern recognition with analysis, calibration. Its Sources card lists only Berend 2014 (an NEJM review of acid–base physiology), which supports none of them. This breaks the 'cite everything' rule on the page that argues the app is evidence-based.
  - Evidence: Open lesson learn, expand Sources: 'Sources · 1', Berend only. I confirmed the audit numbers match Musa Hussain E et al., Cureus 2024;16(12):e74906, doi:10.7759/cureus.74906 (pH 82.9%, primary disorder 82.1%, compensation 47% → 78.4%, AG 69.2%, HCO₃⁻ link 64.1%, consistency 71.8%).
  - Fix: Add SRC entries and LSRC.learn=['hussain24','hatala03','ark06','kalyuga03','roediger06','cepeda06','meyer13']: Musa Hussain E et al. Cureus 2024;16:e74906; Hatala RM, Brooks LR, Norman GR. Adv Health Sci Educ 2003;8:17–26; Ark TK, Brooks LR, Eva KW. Acad Med 2006;81:405–409; Kalyuga S et al. Educ Psychol 2003;38:23–31; Roediger HL, Karpicke JD. Psychol Sci 2006;17:249–255; Cepeda NJ et al. Psychol Bull 2006;132:354–380; Meyer AND et al. JAMA Intern Med 2013;173:1952–1958. Remove Berend from this lesson (it only comes from MSRC.start), or keep it and add the others.
- **T02-3** · `ui1.js` · renderLesson → #lNext onclick
  - What: 'Next' marks the lesson done (S.done, +15 XP) even when no question has been answered. The lesson then shows as ticked in the module list and counts in 'n of 98 lessons'. 'Continue' then skips it, so the learner can never be sent back to the retrieval questions. This contradicts the 'Retrieve it before you move on' heading and the retrieval-practice claim on the learn lesson.
  - Evidence: Fresh state: openLesson('dalton'), click Next without answering → S.done.dalton = 1, S.qs.dalton undefined; Learn header reads '2 of 98 lessons'.
  - Fix: Mark a lesson done only when all of its questions have been answered (as the toast logic already does). If Next is pressed with questions unanswered, show 'Read' (a separate S.read[l.id] flag) and give the module list a half-filled tick, or ask 'Skip the 5 questions?'.

## Minor
- **T02-4** · `c1.js` · lesson stewart, last paragraph
  - What: Says 'The traditional (Boston) approach with albumin-corrected anion gap and base excess'. Base excess belongs to the Copenhagen approach (Siggaard-Andersen). The Boston approach is HCO₃⁻ plus the compensation rules. Mixing up these names in the module that introduces all three schools will confuse readers.
  - Evidence: c1.js stewart body. The Boston school is Schwartz and Relman (bicarbonate plus empirical compensation rules); the Copenhagen school is Siggaard-Andersen (standard base excess); see Berend 2014 NEJM 371:1434.
  - Fix: Rewrite: 'The bicarbonate (Boston) approach with an albumin-corrected anion gap, and the base-excess (Copenhagen) approach, give the same answers in almost every patient.' Cite a comparison study (e.g. Dubin A et al. Crit Care Med 2007;35:1264–1270) in LSRC.stewart.
- **T02-5** · `c6.js` · lesson hh, question 'HCO₃⁻ 24 and PCO₂ doubles to 80…' explanation
  - What: The explanation says 'The ratio falls from 20:1 to 10:1, which is log 1 lower'. A halved ratio lowers the log term by 0.3 (log 20 = 1.3 → log 10 = 1.0), not by 1. The sentence teaches the log scale wrongly.
  - Evidence: Lesson hh Q3 explanation (screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-hh-answered-desk.png).
  - Fix: 'The ratio halves from 20:1 to 10:1, so the log term falls from 1.3 to 1.0 (a fall of 0.3): 6.1 + 1.0 = 7.10.'
- **T02-6** · `c6.js` · lesson hh, same question stem ('with no renal change')
  - What: With HCO₃⁻ held at 24 the answer of 7.10 is correct arithmetic. But an acute rise in PCO₂ raises HCO₃⁻ by about 1 per 10 mmHg through cell buffering (the app's own 1/4 rule), so a real acute rise to 80 gives HCO₃⁻ ≈ 28 and pH ≈ 7.17. 'No renal change' implies HCO₃⁻ stays fixed, which conflicts with the acute rule taught later.
  - Evidence: 24×80/28 = 68.6 nmol/L → pH 7.16.
  - Fix: Change the stem to 'If HCO₃⁻ stayed at exactly 24 while PCO₂ doubled to 80…' and add to the explanation: 'In a real patient cell buffering adds about 4 to the HCO₃⁻, so the pH is nearer 7.17.'
- **T02-7** · `c6.js` · lesson hh, question 'Both HCO₃⁻ and PCO₂ double' explanation
  - What: Says 'exactly how full compensation keeps pH near normal'. Compensation is never full: the app teaches elsewhere that a normal pH with abnormal values points to a mixed disorder. The phrase 'full compensation' reinforces the misconception behind the critical finding above.
  - Evidence: c6.js XQ.hh.
  - Fix: 'The ratio is unchanged, so the pH is unchanged. In patients, compensation moves the ratio back towards 20:1 but does not reach it.'
- **T02-8** · `c1.js` · lesson learn, question 2 options
  - What: Two distractors are the same step: 'Acidaemia versus alkalaemia' and 'Reading the pH'. In effect the question has three options, and a learner can rule out both by spotting the duplicate. The stem and the key also say 'audits' (plural) when the lesson cites one single-centre audit.
  - Evidence: Lesson learn Q2 (screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-learn-desk.png). Keys: 'Weakest step in audits'.
  - Fix: Replace 'Reading the pH' with 'Calculating the anion gap' (69% in the audit, a real near-miss). Change 'In audits of junior doctors' to 'In a 2024 audit of junior doctors' and the key to 'Weakest step (2024 audit)'.
- **T02-9** · `c6.js` · lesson temp, questions 1, 4 and 5 (XQ.temp)
  - What: Three of the five questions test the same fact (cooling lowers in-body PCO₂ and PO₂). Nothing tests the two clinical points in the body: the uncorrected PaO₂ overestimates the true PaO₂ in hypothermia, and alpha-stat versus pH-stat, including when pH-stat is used.
  - Evidence: Dump of lesson temp questions.
  - Fix: Replace Q4 and Q5 with: (a) 'A patient at 31 °C has a printed PaO₂ of 70 on 28% oxygen. What is the risk?' (answer: the true PaO₂ is lower, so hypoxaemia is under-called); (b) 'pH-stat management means…' (answer: correcting to the patient's temperature and adding CO₂; used in some paediatric bypass).
- **T02-10** · `c6.js` · lesson ca, question 5 (XQ.ca) duplicates question 1
  - What: Q1 (trekker on acetazolamide → NAGMA) and Q5 (why acetazolamide causes a normal-gap acidosis) test the same fact. The red-cell chloride shift (HCO₃⁻ out, Cl⁻ in: the Hamburger shift) is not taught anywhere in the lesson, although Q2 uses 'Bound to chloride' as a distractor.
  - Evidence: Dump of lesson ca.
  - Fix: Add a sentence on the chloride shift to the 'Red cells' bullet, and replace Q5 with: 'After CO₂ is hydrated in the red cell, HCO₃⁻ leaves in exchange for…' (Cl⁻; distractors Na⁺, K⁺, H⁺).
- **T02-11** · `c6.js` · lesson stewart, question 4 (contraction alkalosis)
  - What: The stem 'Why does water loss cause a contraction alkalosis in the Stewart view?' mixes up two things. Pure free-water loss raises SID by concentration (Stewart's 'concentration alkalosis'). The clinical 'contraction alkalosis' comes from losing chloride-rich, bicarbonate-poor fluid (loop or thiazide diuretics, vomiting).
  - Evidence: XQ.stewart Q4. Chloride depletion is the mechanism in contraction alkalosis (Galla 2000 JASN, already in SRC as galla00).
  - Fix: Change the stem to 'Why does free-water loss (e.g. diabetes insipidus) alkalinise in the Stewart view?' and its explanation to: 'Na⁺ and Cl⁻ concentrate together, so the gap between them, the SID, widens. Diuretic contraction alkalosis is chloride loss: a bigger SID for a different reason.'
- **T02-12** · `c1.js` · lesson stewart, SID bullet
  - What: The SID is written as 'Na⁺ + K⁺ + Ca²⁺ + Mg²⁺ − Cl⁻ − lactate' with no valence factor. The app uses mmol/L throughout. The next lesson (stewartx) and the concept-web node use 2·Ca and 2·Mg, so a learner using this formula with mmol/L values gets the wrong number.
  - Evidence: Compare the c1 stewart body with c4 stewartx ('2·iCa + 2·Mg') and the ui5 WEB_NODES 'sid'.
  - Fix: Write 'Na⁺ + K⁺ + 2×Ca²⁺ + 2×Mg²⁺ − Cl⁻ − lactate (mmol/L; ionised Ca and Mg)'.
- **T02-13** · `shell.html` · .tw table wrapper at phone width (lessons learn, otherbuf, henry)
  - What: At 390 px the three-column tables are wider than the card (scrollWidth 420 vs clientWidth 306), and the third column is clipped mid-word with no sign that it scrolls (no visible scrollbar on mobile). In the learn lesson the hidden column is 'In Buffer', the column that matters most.
  - Evidence: Phone 390×844: openLesson('otherbuf') → /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-otherbuf-table-phone.png. On the learn lesson, TABLE.tbl's right edge is at 462 px.
  - Fix: Below 600 px, stack .tbl rows into cards (td::before{content:attr(data-th)}), or at least add a right-edge fade and 'swipe →' hint on .tw when scrollWidth > clientWidth.
- **T02-14** · `ui1.js` · renderLesson, questions (#lQ)
  - What: Answers are not kept. Reopening a lesson shows all five questions unanswered, with no 'last time 4/5' or note of which ones were missed. S.qs only stores aggregate counts, so a learner coming back to revise cannot see what they got wrong.
  - Evidence: Answer all of the hh questions, then openLesson('hh') again: 0 options are disabled.
  - Fix: Store per-question results in S.qs[l.id].last=[true,false,…] and show a 'Last time 4/5 · retry missed' chip above Check yourself. Optionally show the missed ones first.

## Polish
- **T02-15** · `shell.html` · .qitem>p (question explanations)
  - What: The rule .qitem>p{font-weight:700} also matches the explanation paragraph p.why, so every explanation is bold in its full length. This makes long explanations tiring to read and leaves no contrast for the bold 'Correct.' / 'Not quite.' label.
  - Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-hh-answered-desk.png and T02-hh-sources-phone.png.
  - Fix: Change it to .qitem>p:not(.why){font-weight:700} (or add .why{font-weight:400}).
- **T02-16** · `ui1.js` · RENDER.learn header subtitle
  - What: In quiet mode (the default) the eyebrow reads '0 module checks' and the button reads 'Module check', but the subtitle still says 'Each module ends in a boss fight.' The Quiet-mode MAP only matches 'Boss fight' with a capital B.
  - Evidence: Fresh state, Learn tab (/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-modlist-desk.png).
  - Fix: Add [/boss fight/g,'module check'] to the Quiet MAP, or write the subtitle as 'Each module ends in a check.'
- **T02-17** · `ui9.js` · RENDER.learn wrapper (German glossary tile)
  - What: The German glossary tile is placed between the header and the six-step read as a lone half-width card. It pushes the core content down, and it sits apart from the Concept web and Pocket card tiles, which are the same kind of item.
  - Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-modlist-desk.png
  - Fix: Append the tile to the existing .tiles row after Pocket card (el.querySelector('.tiles').append(...)) instead of h.after(d).
- **T02-18** · `shell.html` · .eq blocks in lesson stewartx
  - What: Long formulas wrap mid-expression ('= 25 × 0.261 =' / '6.5'; 'SIDe = … =' / '20.6') even at 1280 px, because the lesson body is narrow and the monospace text is large.
  - Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-stewartx-light-clinical.png
  - Fix: Give .eq white-space:pre (overflow-x:auto already exists), or split each formula into 'definition' and 'with numbers' lines in c4.js.
- **T02-19** · `shell.html` · .toast position on phone
  - What: The 'Lesson complete' toast sits over the pager (Next button) and the Sources card at the bottom of the phone screen, exactly where the learner's thumb goes next.
  - Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T02-hh-sources-phone.png
  - Fix: On narrow screens, raise the toast above the pager or show it at the top, and auto-dismiss it in 2 s.
- **T02-20** · `c1.js` · lesson alv body and question 2
  - What: Body: 'up to about 20 in the elderly', but age/4+4 gives 24 at 80 and 21 at 70. Q2's explanation uses the American spelling 'edema'; the brief requires British English ('oedema').
  - Evidence: c1.js lesson alv; Q2 explanation 'Think PE, pneumonia, edema.'
  - Fix: 'under 10 in the young, about 20–25 at 70–80'; 'oedema'.
- **T02-21** · `c1.js` · lesson henry, question 2 option and explanation
  - What: The answer says 'About half of normal', but the explanation computes 8.2 vs ≈ 20 mL/dL (41%).
  - Evidence: 1.34×6×0.98 + 0.003×98 = 8.2.
  - Fix: Make the option 'Less than half of normal'.
- **T02-22** · `c6.js` · lesson henry, question 'If a sealed blood sample is warmed…'
  - What: This tests the effect of temperature, which the henry lesson does not cover (the temp lesson does, two lessons later).
  - Evidence: XQ.henry.
  - Fix: Move the question to XQ.temp in place of a duplicate there, and add a henry question on dissolved O₂ on 100% oxygen at 1 atm (≈ 2 mL/dL).
- **T02-23** · `c6.js` · lesson ph, question 5 ('Why does a small pH change matter clinically?')
  - What: The keyed answer 'It is logarithmic: [H⁺] changes a lot' is vague. The body gives the real reason (protein charge, enzymes, channels and O₂ binding are sensitive to [H⁺]). One distractor, 'Enzymes ignore any small change', contradicts that sentence without teaching it.
  - Evidence: XQ.ph Q5.
  - Fix: Key: 'A 0.1 change is a 25% change in [H⁺], which alters protein charge, enzymes and channels'. Distractors: 'The pH electrode is imprecise', 'Only pH below 7.0 affects cells', 'Kidneys correct it within minutes'.
- **T02-24** · `c1.js` · lesson ph body
  - What: '[H⁺] … roughly a million times lower than plasma sodium': 140 mmol/L ÷ 40 nmol/L = 3.5 million.
  - Evidence: 140e-3 / 40e-9 = 3.5e6.
  - Fix: 'about three and a half million times lower'.
- **T02-25** · `c6.js` · lesson buffer, questions 3 and 4 distractors; question 5
  - What: Weak distractors that no learner would pick: 'No dissolved gas at all', 'Free chloride gas', 'Sodium hydroxide'. Q5 (bone gives up buffer base) is not taught in the buffer lesson body.
  - Evidence: XQ.buffer.
  - Fix: Q3: use 'Ten times more base form', 'Maximum buffer capacity is lost'. Q4: use 'Hydroxide ions', 'Carbonate (CO₃²⁻)'. Add one body sentence on bone buffering in chronic acidosis, or move Q5 to otherbuf.
- **T02-26** · `c1.js` · lesson buffer body ('The bicarbonate system has a pKa of 6.1')
  - What: 6.1 is the apparent pK′ of the CO₂/HCO₃⁻ system (dissolved CO₂ standing in for H₂CO₃). Carbonic acid's own pKa is ≈ 3.5. Learners who meet '3.6' in chemistry texts will think one value is wrong, and the ca lesson says carbonic acid 'exists only fleetingly'.
  - Evidence: Standard physiology (e.g. Siggaard-Andersen 1974, already cited).
  - Fix: Add: '(6.1 is the apparent pK of CO₂ ⇌ HCO₃⁻; carbonic acid itself is much stronger, pKa ≈ 3.5, but exists only in tiny amounts)'.
- **T02-27** · `c4.js` · lesson stewartx keys
  - What: Units are 'mEq/L', while the app's convention and the rest of the lesson (Na − Cl 'mmol/L') use mmol/L.
  - Evidence: Keys 'Normal SIDa ≈ 40–42 mEq/L'.
  - Fix: Use mmol/L (or 'mmol/L of charge').
- **T02-28** · `c5.js` · LSRC.stewartx
  - What: The albumin and phosphate charge formulas (0.123·pH − 0.631; 0.309·pH − 0.469) and the SIG come from Figge–Fencl and Kellum. The cited Figge 1998 paper is about anion-gap correction for albumin only.
  - Evidence: Sources card on stewartx: Siggaard-Andersen, Rose, Stewart 1983, Figge 1998.
  - Fix: Add Figge J, Mydosh T, Fencl V. Serum proteins and acid-base equilibria: a follow-up. J Lab Clin Med 1992;120:713–719, and Kellum JA, Kramer DJ, Pinsky MR. Strong ion gap: a methodology for exploring unexplained anions. J Crit Care 1995;10:51–55.
- **T02-29** · `c5.js` · LSRC for ph, buffer, ca, dalton, henry
  - What: These five lessons have only the module textbooks as sources. Specific numbers (Riyadh and Abha barometric pressures, cabin altitude 2,400 m, hyperbaric dissolved O₂ about 6 mL/dL) have no specific support. The numbers are correct by my check (standard atmosphere: 610 m → 707 mmHg, 2,270 m → 577 mmHg; 3 ATA on 100% O₂ → about 6.6 mL/dL).
  - Evidence: Expand the Sources card on each lesson.
  - Fix: Add, for example: dalton → BTS 2011 or Aerospace Medical Association guidance on cabin altitude (≤ 8,000 ft); henry → Undersea and Hyperbaric Medical Society or Boerema 1960 'Life without blood'.
- **T02-30** · `ui1.js` · renderLesson crumbs / RENDER.learn numbering
  - What: Modules are numbered from 00 ('Module 0 · Start here'), and the lesson header shows its position in the whole course ('8 / 98') with a progress bar that tracks position, not completion. Readers take '8 / 98' as progress.
  - Evidence: Lesson stewartx crumbs: 'Module 1 · Chemistry of acids and buffers · 8 / 98'.
  - Fix: Show 'Lesson 7 of 7 in this module' and colour the bar by S.done for the module. Either number modules from 1 or label Start here 'Intro' with no number.
- **T02-31** · `c1.js` · lesson otherbuf table, ammonia row
  - What: 'Ammonia/ammonium' is listed among the buffers. NH₃/NH₄⁺ has a pKa of about 9.2, so it is not a useful buffer at body or urine pH. Its role is acid excretion through ammoniagenesis (the note says this, but the table title implies buffering).
  - Evidence: otherbuf table.
  - Fix: Note in the row: 'not a true buffer at urine pH (pKa 9.2); carries H⁺ out as NH₄⁺'.

## Ideas (ranked by value)
- **T02-32** · `c1.js` · lessons hh, alv, stewart (no worked gas)
  - What: None of the 12 lessons in start/chem/phys has a worked gas (ex), although hh (the Henderson consistency check) and alv (A–a) are exactly where a printout helps.
  - Evidence: Learn module list shows no 'WORKED GAS' tag in modules 00–02.
  - Fix: Add ex to hh (an internally inconsistent gas, e.g. pH 7.40, PCO₂ 60, HCO₃⁻ 24) and alv (an opioid overdose on room air, PaCO₂ 80, PaO₂ 48, age 30).
- **T02-33** · `c1.js` · lesson buffer, open versus closed system
  - What: The claim 'a load of 10 mmol/L of strong acid would produce a severe acidosis' would stick far better with the numbers.
  - Evidence: Closed: HCO₃⁻ 14, CO₂ 11.2 → pH 6.1 + log(14/11.2) = 6.20. Open (PCO₂ held at 40): pH 6.1 + log(14/1.2) = 7.17.
  - Fix: Add a two-row table: closed beaker pH 6.20 versus open body pH 7.17 for the same 10 mmol/L acid load.
- **T02-34** · `ui1.js` · renderLesson questions
  - What: Retrieval: missed questions are stored (S.qmiss) but never come back inside the Learn tab.
  - Evidence: S.qmiss is written in renderLesson and used only for Yuzu packs (ui9).
  - Fix: Add a 'Retry missed (n)' button on the module row and the lesson, and feed missed lesson questions into the Round's spaced queue.
- **T02-35** · `c5.js` · Sources card
  - What: Sources are plain text, with no DOI or PubMed link and no mapping from claim to source.
  - Evidence: Sources card on any lesson.
  - Fix: Add a DOI/PMID field to SRC and render it as a link (it still works offline as text). Optionally add superscript numbers in the body that point to the list.
- **T02-36** · `c1.js` · lesson dalton
  - What: PiO₂ is given for Riyadh and Abha only. A 'your altitude' field in Settings would let the A–a and PiO₂ teaching (and the interpreter) use the learner's own site.
  - Evidence: dalton keys.
  - Fix: Add S.altitude in Settings; show 'At your site: Patm ≈ X, PiO₂ ≈ Y' in dalton and alv and use it in interp.
- **T02-37** · `c1.js` · lesson alv / henry
  - What: The diffusion bullet suggests diffusion limitation commonly causes hypoxaemia. At rest it is the rarest of the mechanisms; it shows mainly on exercise and at altitude.
  - Evidence: West's Respiratory Physiology, chapter 3.
  - Fix: Add: 'At rest, diffusion limitation alone rarely causes hypoxaemia; it shows on exercise or at altitude, when transit time shortens.'
- **T02-38** · `ui1.js` · Start here module check
  - What: The Start here 'module check' is five questions about learning science. Losing it feels odd, and it awards a boss badge for meta content.
  - Evidence: Learn → Start here → Module check (5 questions in 3 min).
  - Fix: Hide the module check for 'start' (require pool ≥ 4 and m.id !== 'start'), or replace it with a 'how the six-step read works' quiz.
