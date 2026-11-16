# T06 · clin-1 · clinical lessons review

**Covered:** lessons dka, sepsis, asa, toxalc2, copd, asthma, pe, vomit, diarr, renalfail: body text, key numbers, hooks, all 5 questions each (c3.js base 2 + c8.js XQ 3, rendered after c9 shuffle), worked gases (Henderson–Hasselbalch and engine read), sources (c5.js SRC/LSRC), rendered at 390 and 1280 px (dark pixel skin). Checked against JBDS 2023, 2024 hyperglycaemic crises consensus, SSC 2021/Sepsis-3, EXTRIP salicylate 2015 / methanol 2015 / EG 2023, BTS/ICS 2016, BTS O₂ 2017, BTS/SIGN 2019, ESC 2019, KDIGO 2024.

**Verdict:** Clinically sound overall. All 10 worked gases satisfy Henderson–Hasselbalch (within 0.01) and the engine reads the intended disorder (dka/sepsis/toxalc2 HAGMA, asa HAGMA + resp alk, copd acute-on-chronic, pe acute resp alk, vomit met alk, diarr NAGMA, renalfail HAGMA+NAGMA; asthma 'normal', which is the intended trap but is not captioned). All 50 keyed answers are correct and every arithmetic explanation checks out (osmolar gaps, Winter's, 0.7×HCO₃⁻+20, corrected AG, Δ ratio). Problems: one wrong threshold (COPD summary 6 vs 6.5 kPa), one non-guideline severity row in asthma, a missing K⁺ < 3.5 rule in DKA, a hidden table column on phones, an engine timing label that contradicts the salicylate lesson, and several guidelines quoted but not cited. Questions skew easy (implausible distractors, duplicates, 2-option items). Existing citations are bibliographically correct.

**Score: 7/10.**  Findings: {'major': 9, 'minor': 17, 'polish': 6, 'idea': 11}

## Findings

### Critical (0)
None.

### Major (9)
- **T06-1** `c3.js` · lesson copd · sum: Summary says NIV when 'PaCO₂ > 45 (6 kPa)'. 45 mmHg is 6.0 kPa, and BTS/ICS 2016 (the cited guideline) uses PaCO₂ > 6.5 kPa (≈ 49 mmHg). The body correctly says 6.5 kPa, so the summary contradicts the body and mislabels the BTS threshold.  
  *Evidence:* c3.js:197 sum; body 'BTS: pH < 7.35 with PaCO₂ > 6.5 kPa'. Davidson AC et al. Thorax 2016;71 Suppl 2 (NIV: pH < 7.35 and PaCO₂ > 6.5 kPa persisting after immediate maximal standard medical treatment).  
  *Fix:* Change sum to: 'NIV when pH < 7.35 and PaCO₂ > 6.5 kPa (≈ 49 mmHg) persist after maximal standard treatment (GOLD and many US sources use > 45 mmHg).'
- **T06-2** `c3.js` · lesson asthma · body table row 1: Table headed 'Finding (BTS/SIGN 2019)' lists 'PCO₂ low, SpO₂ ≥ 92% → Acute severe'. BTS/SIGN does not define acute severe asthma by gas; it uses PEF 33–50%, RR ≥ 25, HR ≥ 110, inability to complete sentences. A low PCO₂ is equally present in moderate attacks, so the row teaches a non-guideline criterion under a guideline label.  
  *Evidence:* SIGN 158 / BTS 2019, Table 'Levels of severity of acute asthma exacerbations'. Rendered table: shots/T06-asthma-desk.png.  
  *Fix:* Replace row with 'PEF 33–50%, RR ≥ 25, HR ≥ 110, can't complete sentences (gas usually shows low PCO₂) → Acute severe'; add to the life-threatening row 'PEF < 33%, exhaustion, silent chest, altered consciousness'; add near-fatal 'or mechanical ventilation with raised inflation pressures'.
- **T06-3** `c3.js` · lesson dka · body 'What the gas tells you during treatment': The potassium rule omits the key safety threshold: if K⁺ < 3.5 mmol/L, give potassium and delay insulin (2024 consensus) / senior review and extra K⁺ (JBDS). 'K⁺ before insulin' alone does not tell the learner what to do with a low K⁺, a classic MRCEM/USMLE item.  
  *Evidence:* 2024 ADA/EASD/JBDS/AACE/DTS consensus (Umpierrez et al., Diabetes Care 2024;47:1257–1275): replace K⁺ when < 5.0; if < 3.5 replace ~10 mmol/h and delay insulin until > 3.5. Summary in CCJM 2025;92:152 (https://www.ccjm.org/content/92/3/152). JBDS 02 2023: > 5.5 none, 3.5–5.5 40 mmol/L, < 3.5 senior review.  
  *Fix:* Replace bullet with: 'Check K⁺ before insulin. K⁺ > 5.5 (JBDS) / > 5.0 (ADA): no K⁺ in fluids, recheck in 1–2 h. 3.5–5.5: add 40 mmol/L KCl. < 3.5: replace K⁺ and hold insulin until > 3.5 (senior review).' Add a 'K⁺ < 3.5' key number.
- **T06-4** `shell.html` · lesson asthma · .tw table at 390 px: On phone the severity table overflows: the 'Severity' column starts at x = 350 inside a 306 px wide .tw box (scrollWidth 420), so the whole Severity column (the point of the table) is invisible with no scroll cue.  
  *Evidence:* Playwright 390×844, openLesson('asthma'): .tw clientWidth 306, scrollWidth 420; th[1] left 350. Screenshot shots/T06-asthma-phone-answered.png shows only the Finding column.  
  *Fix:* Under 480 px let .tbl cells wrap (white-space:normal; th/td min-width:0) and give the first column ~65% width, or stack rows as 'Severity: finding' cards; at minimum add a right-edge fade/scroll hint on .tw when scrollWidth > clientWidth.
- **T06-5** `e1.js` · interp() comp step for respiratory alkalosis with coexisting HAGMA (lesson asa worked gas): The asa example (pH 7.46, PCO₂ 22, HCO₃⁻ 15.3, AG 21.7) is labelled 'HAGMA + respiratory alkalosis' but the compensation step says 'Chronic, renally compensated' because the low HCO₃⁻ fits the chronic formula. In salicylate poisoning the low HCO₃⁻ is the HAGMA, the alkalosis is hours old; the lesson body says 'respiratory alkalosis within hours'. The Interpreter contradicts the lesson.  
  *Evidence:* node: interp(L.find(l=>l.id==='asa').ex).steps[3] → v 'Chronic, renally compensated', d 'Acute: HCO₃⁻ ≈ 20.4; chronic: ≈ 15. Measured 15.3'.  
  *Fix:* When a metabolic acidosis with raised AG is detected alongside a primary respiratory alkalosis, do not classify acute/chronic from HCO₃⁻; show 'Cannot time the respiratory alkalosis: the bicarbonate is lowered by the coexisting HAGMA (Δ ratio ...)'.
- **T06-6** `c5.js` · LSRC.asa / SRC: Lesson text quotes EXTRIP 2015 thresholds but the only lesson source is Kraut & Madias 2010; EXTRIP is not in SRC. Breaks the 'cite everything' rule for dialysis criteria.  
  *Evidence:* Rendered 'SOURCES · 2' (Berend 2014, Kraut 2010).  
  *Fix:* Add SRC extrip15asa: 'Juurlink DN, et al. Extracorporeal treatment for salicylate poisoning: systematic review and recommendations from the EXTRIP workgroup. Ann Emerg Med 2015;66:165–181.' and Proudfoot AT, Krenzelok EP, Vale JA. Position paper on urine alkalinization. J Toxicol Clin Toxicol 2004;42:1–26 (urine pH 7.5–8.5); add both to LSRC.asa.
- **T06-7** `c5.js` · LSRC.asthma: Table is labelled 'BTS/SIGN 2019' but BTS/SIGN is not among the sources (only Epstein 2001, Foster 2001 + module defaults).  
  *Evidence:* Rendered 'SOURCES · 4'.  
  *Fix:* Add SRC sign158: 'British Thoracic Society/SIGN. SIGN 158 British guideline on the management of asthma. 2019.' to LSRC.asthma (and Rodrigo 2004 or similar for salbutamol lactate if wanted).
- **T06-8** `c5.js` · LSRC.dka: Body heading says 'Diagnosis (2024 international consensus)' but that consensus is not cited; listed sources are JBDS 2023 plus two paediatric papers.  
  *Evidence:* Rendered 'SOURCES · 5'.  
  *Fix:* Add SRC ada24: 'Umpierrez GE, et al. Hyperglycemic crises in adults with diabetes: a consensus report. Diabetes Care 2024;47:1257–1275.' to LSRC.dka.
- **T06-9** `c5.js` · LSRC.pe: PE lesson cites only Foster 2001 (respiratory alkalosis). The '≈ one fifth have a normal A–a gradient' claim and the diagnostic advice (clinical probability, D-dimer, imaging) have no source.  
  *Evidence:* Rendered 'SOURCES · 3'.  
  *Fix:* Add Konstantinides SV, et al. 2019 ESC Guidelines for acute pulmonary embolism. Eur Heart J 2020;41:543–603, and Stein PD, et al. Arterial blood gas analysis in the assessment of suspected acute pulmonary embolism. Chest 1996;109:78–81, to LSRC.pe.

### Minor (17)
- **T06-10** `c3.js` · lesson dka · body 'Typical gas' / sum: 'PCO₂ by Winter's' and 'VBG is enough' sit together, but Winter's is for arterial PCO₂. Venous PCO₂ runs ~5–8 mmHg higher, so a learner applying Winter's to the VBG PCO₂ will over-call respiratory acidosis (the worked VBG itself has PvCO₂ 17 vs Winter's 15.4 on measured values).  
  *Evidence:* c3.js:136 body; worked example is sample 'v'.  
  *Fix:* Add: 'Winter's applies to arterial PCO₂; on a VBG subtract ≈ 5 mmHg first, or use the trend.'
- **T06-11** `c3.js` · lesson asa · body haemodialysis bullet: EXTRIP criteria are paraphrased loosely: 'hypoxaemia' should be 'new hypoxaemia needing supplemental oxygen'; pH ≤ 7.20 is a 'suggested' criterion without 'despite treatment'; 'failure of standard therapy' and the renal-impairment threshold (> 6.5 mmol/L / 90 mg/dL) are missing.  
  *Evidence:* Juurlink 2015 Ann Emerg Med 66:165: recommended: level > 7.2 mmol/L (100 mg/dL); > 6.5 mmol/L with impaired kidney function; altered mental status; new hypoxaemia requiring O₂; failure of standard therapy. Suggested: > 6.5 (90 mg/dL); > 5.8 (80 mg/dL) with impaired kidney function; pH ≤ 7.20.  
  *Fix:* Rewrite bullet with these exact criteria and units (mmol/L first, mg/dL in brackets).
- **T06-12** `c3.js` · lesson toxalc2 · hook and body: Hook says 'High gap, no lactate…'. Ethylene glycol's metabolite glycolate falsely raises lactate on many blood gas analysers (lactate gap), so an EG patient can show a high lactate; the hook may falsely reassure.  
  *Evidence:* Kraut & Mullins NEJM 2018;378:270 (cited) discusses falsely elevated lactate in EG poisoning.  
  *Fix:* Add bullet: 'Ethylene glycol can falsely raise point-of-care lactate (glycolate interference); a gas lactate far above the lab lactate is a clue.' Soften hook to 'High gap that lactate and ketones do not explain…'.
- **T06-13** `c3.js` · lesson toxalc2 · body treatment bullet: Dialysis indications are vague ('high levels'); no EXTRIP numbers, no antidote doses, although the brief asks for drug doses to be checkable.  
  *Evidence:* EXTRIP methanol (Roberts DM et al., Crit Care Med 2015;43:461–472): coma, seizures, new visual deficit, pH ≤ 7.15, persistent acidosis, AG > 24, methanol > 700 mg/L with fomepizole. EXTRIP EG (Ghannoum M et al., Kidney Int 2023): severe acidosis (pH ≤ 7.25–7.30), AKI, EG > 50 mmol/L or OG > 50.  
  *Fix:* List EXTRIP criteria per alcohol and doses: fomepizole 15 mg/kg IV load then 10 mg/kg 12-hourly ×4 then 15 mg/kg (redose during dialysis); folinic acid 1 mg/kg (max 50 mg) 4–6-hourly; thiamine 100 mg, pyridoxine 50 mg; ethanol target 100–150 mg/dL (≈ 22–33 mmol/L). Add EXTRIP refs to c5.js LSRC.toxalc2.
- **T06-14** `c3.js` · lesson asthma · ex (worked gas): Worked gas has lactate 3.1 but AG 12.8 (corrected 12.3); a lactate of 3.1 should push the gap ~2 above baseline. Internally inconsistent for a lesson that teaches lactate.  
  *Evidence:* interp: AG 139 − (103 + 23.2) = 12.8.  
  *Fix:* Set cl:101 (AG ≈ 14.8) or lac:1.8.
- **T06-15** `c8.js` · XQ.pe[2] explanation: 'PaO₂ falls more than PAO₂' implies PAO₂ falls. In PE hyperventilation lowers PaCO₂ so PAO₂ rises while PaO₂ falls; that is why the gradient widens.  
  *Evidence:* c8.js XQ.pe: 'The A–a gradient is raised in PE because…'.  
  *Fix:* Explanation: 'Hyperventilation raises alveolar PO₂ while V/Q mismatch lowers arterial PO₂, so the difference widens.'
- **T06-16** `c8.js` · XQ.copd[1] (NIV failing): Answer 'Escalate: ICU review and invasive ventilation' skips BTS/ICS steps: check mask fit, leak, synchrony and increase IPAP, and confirm ceiling of treatment; intubation if appropriate. Explanation is one line.  
  *Evidence:* BTS/ICS 2016 NIV failure section.  
  *Fix:* Keep keyed answer but change explanation: 'Worsening pH at 1–2 h: optimise NIV (leak, synchrony, IPAP) and escalate to ICU for intubation if within the ceiling of care.'
- **T06-17** `c8.js` · XQ.dka[0] distractor: Distractor 'HCO₃⁻ 18 and glucose 11' is partly correct: HCO₃⁻ ≥ 18 is part of the 2024 consensus resolution criteria (ketones < 0.6 and venous pH ≥ 7.3 or HCO₃⁻ ≥ 18), and glucose < 11.1 was in the ADA 2009 criteria. A well-read learner can argue it.  
  *Evidence:* 2024 consensus, Table 1.  
  *Fix:* Replace with 'Glucose below 14 and trace urine ketones'.
- **T06-18** `c8.js` · XQ.dka[2], XQ.asa[2]: Duplicate questions: dka Q5 ('venous sample adequate because…') repeats Q2 (c3.js); asa Q5 ('why intubating is dangerous') repeats Q1. Wastes 2 of 10 items.  
  *Evidence:* Rendered lesson: questions 2 and 5 test the same fact.  
  *Fix:* Replace dka Q5 with a K⁺ < 3.5 / insulin-hold question; replace asa Q5 with 'Urine pH target during alkalinisation?' (7.5–8.5) or 'Which falsely lowers the anion gap in salicylate poisoning? (pseudohyperchloraemia on some analysers)'.
- **T06-19** `c3.js` · lesson sepsis · body & keys: 'Lactate ≥ 2 mmol/L: screen for organ dysfunction' is odd: a raised lactate is itself a hypoperfusion marker; SSC 2021 recommends measuring lactate and guiding resuscitation to lower it. Key 'Septic shock lactate > 2 with vasopressors' drops 'despite adequate fluid resuscitation'.  
  *Evidence:* Singer M et al. JAMA 2016;315:801 (Sepsis-3); Evans 2021 SSC.  
  *Fix:* Bullet: 'Lactate > 2 suggests hypoperfusion: resuscitate and remeasure within 2–4 h, aiming for a fall (SSC 2021).' Key: '> 2 + vasopressors for MAP ≥ 65 despite fluids'.
- **T06-20** `c5.js` · LSRC.sepsis, LSRC.renalfail, LSRC.toxalc2: Uncited claims: Sepsis-3 definition (Singer 2016 not in SRC); CKD bicarbonate threshold (KDIGO not cited); toxic alcohol dialysis (EXTRIP not cited).  
  *Evidence:* Rendered source lists.  
  *Fix:* Add Singer M, et al. JAMA 2016;315:801–810 to sepsis; KDIGO 2024 CKD guideline (Kidney Int 2024;105(4S):S117–S314) to renalfail; EXTRIP methanol 2015 and EG 2023 to toxalc2.
- **T06-21** `c5.js` · LSRC.dka: Two of three DKA-specific sources are paediatric (PECARN FLUID 2018, Glaser 2001) yet the lesson has no paediatric content (no cerebral oedema, no paediatric fluid rates).  
  *Evidence:* Rendered sources vs body.  
  *Fix:* Either add a 'Children' bullet (cerebral oedema risk with low PCO₂ and high urea at presentation, Glaser 2001; fluid rate did not change cerebral injury, PECARN 2018; ISPAD 2022) or move these refs to the kids lesson.
- **T06-22** `c3.js` · lesson renalfail · last bullet: 'Oral bicarbonate when HCO₃⁻ persistently below about 18–22 to slow progression' overstates the evidence. KDIGO 2024 suggests considering treatment at < 18 mmol/L and notes uncertain benefit for progression (BiCARB trial negative).  
  *Evidence:* KDIGO 2024 CKD guideline rec 3.10.1; BiCARB, BMC Med 2020.  
  *Fix:* Rewrite: 'KDIGO 2024: consider treatment (oral bicarbonate or diet) when HCO₃⁻ < 18 mmol/L; the older 2012 threshold was < 22. Benefit for progression is uncertain; bone and muscle protection is the stronger rationale.'
- **T06-23** `ui1.js` · worked gas card (row() for venous samples): Venous worked gases (dka, diarr) show arterial reference ranges (PvCO₂ 35–45, pH 7.35–7.45, HCO₃⁻ 22–26) and flag PvCO₂ 17 'L' against them.  
  *Evidence:* ui1.js:74 row(ven?'PvCO₂':'PaCO₂',…,rp(35,45)); rendered dka worked gas.  
  *Fix:* For ven samples use venous ranges (pH 7.31–7.41, PvCO₂ 41–51, HCO₃⁻ 23–29) or label the column 'arterial ref'.
- **T06-24** `e1.js` · interp() gap step for venous samples: For venous samples the AG is calculated from estimated arterial HCO₃⁻ (measured − 1), so the AG is 1 higher than the lab AG. Serum bicarbonate is itself venous, so the measured value should be used. DKA example shows AG 31.1 instead of 30.1.  
  *Evidence:* e1.js:66 h=h-1 then gap uses h; dka step text 'AG = 131 − (96 + 3.9)'.  
  *Fix:* Use the measured v.hco3 for AG and Δ ratio; use the estimated arterial values only for compensation rules.
- **T06-25** `e1.js` · interp() ox step: Berlin ARDS line: The 'Berlin ARDS: moderate' sentence appears for the non-ventilated COPD (FiO₂ 0.28 Venturi) and asthma examples. Berlin requires PEEP/CPAP ≥ 5 cmH₂O; in these lessons the line is a distraction and could mislead.  
  *Evidence:* e1.js:165; copd and asthma worked gases in Interpreter.  
  *Fix:* Only add the Berlin line when the input states PEEP/CPAP ≥ 5 (or ventilated), otherwise say 'P/F applies to ARDS only on PEEP ≥ 5'.
- **T06-26** `e1.js` · interp() ox step A–a tolerance: A–a 12 with 'expected ≤ 11' (vomit) and 21 with 'expected ≤ 20' (renalfail) are labelled 'Normal oxygenation' because of a hidden +5 tolerance (exAa+5). The displayed text contradicts the verdict.  
  *Evidence:* e1.js:151 raised=Aa>(exAa+5).  
  *Fix:* Show the tolerance in the text ('expected ≤ 11, up to 16 accepted') or display exAa+5 as the limit.

### Polish (6)
- **T06-27** `c8.js` · XQ.* distractors for these lessons: Many distractors are implausible and give the answer away: 'Hearing only', 'Skin only', 'The lens only' (renalfail), 'Lactate is always from gut bacteria', 'It is lab artefact' (sepsis), 'It lowers the dose', 'It cools the patient' (asa), 'Mild wheeze', 'A high peak flow' (asthma), 'Excess intake' (diarr), 'Furosemide' as a fluid (vomit). MRCEM/USMLE items need plausible distractors.  
  *Evidence:* c8.js XQ.sepsis, asa, asthma, vomit, diarr, renalfail.  
  *Fix:* Replace with near-miss options, e.g. renalfail Q5: 'Bone and muscle' vs 'Platelet function', 'Erythropoietin response', 'Lipid profile'; vomit Q5: '0.9% saline with KCl' vs 'Hartmann's alone', '5% glucose with KCl', 'Acetazolamide'.
- **T06-28** `c3.js` · pe q[0], diarr q[1], renalfail q[0]: Three questions have only two options (Yes/No, Positive/Negative), a 50% guess rate; they score the same as four-option items.  
  *Evidence:* Rendered lessons.  
  *Fix:* Convert to four options (e.g. PE: 'Normal A–a excludes PE' / 'Normal PaO₂ excludes PE' / 'No ABG finding excludes PE' / 'Respiratory alkalosis confirms PE').
- **T06-29** `c3.js` · lesson toxalc2 · sum and hook: 'ADH' is used without expansion; in an acid–base app ADH normally means antidiuretic hormone (used in kidney lessons).  
  *Evidence:* sum 'Block ADH early with fomepizole'; hook 'block ADH now'.  
  *Fix:* Write 'alcohol dehydrogenase (ADH)' at first use, or 'block alcohol dehydrogenase'.
- **T06-30** `c3.js` · lesson pe · body/keys: Uses 'massive PE'; ESC 2019 terminology is 'high-risk PE' (with intermediate-high/low).  
  *Evidence:* ESC 2019 Eur Heart J 2020;41:543.  
  *Fix:* Write 'High-risk (massive) PE' in body and key.
- **T06-31** `c3.js` · lesson vomit · keys: Key 'Urine Cl⁻ < 20' has no unit.  
  *Evidence:* Rendered key numbers.  
  *Fix:* '< 20 mmol/L'.
- **T06-32** `c3.js` · lesson sepsis · ex: Body says established sepsis often has PCO₂ below Winter's (added respiratory alkalosis), but the worked gas is an exactly compensated HAGMA (PCO₂ 27, Winter's 27.8), so the example does not show the pattern taught.  
  *Evidence:* interp label 'High anion gap metabolic acidosis'.  
  *Fix:* Use e.g. pCO₂ 23, pH 7.38 (HH: 6.1+log(13.2/0.69)=7.38) to show HAGMA + respiratory alkalosis, or add a caption saying which stage the example is.

## Ideas (ranked by value)
- **T06-33** `c3.js` · dka, vomit, diarr worked gases: Examples teach hypo/hyperkalaemia but have no K⁺. The engine already accepts k. → Add k: dka 5.8 (high at presentation despite total-body deficit), vomit 2.8, diarr 3.0.
- **T06-34** `ui1.js` · lesson worked gas card: The worked gas has no inline reading; the teaching trap (asthma 'normal' gas = life-threatening; asa mixed disorder) is only visible after 'Open in the Interpreter'. → Add a one-line caption per lesson (new lesson field e.g. exNote) under the card: 'Interpreter calls this normal acid–base; in a severe attack it is life-threatening.'
- **T06-35** `c3.js` · dka: No doses or fluid steps although this is a shift tool. → Add JBDS/ADA box: 0.9% NaCl or balanced crystalloid 1 L in 1 h (500–1000 mL/h for 2–4 h, ADA), FRIII 0.1 units/kg/h, add 10% glucose at glucose < 14 mmol/L (JBDS) / 5–10% dextrose < 13.9 (ADA), and note JBDS acidosis criterion HCO₃⁻ < 15 vs consensus < 18.
- **T06-36** `c3.js` · asa: Practical alkalinisation details missing. → Add: 8.4% sodium bicarbonate 1–2 mmol/kg bolus then infusion, keep K⁺ ≥ 4 (alkalinisation fails if hypokalaemic), blood pH not above ~7.55; bicarbonate bolus before any intubation; salicylate can cause pseudohyperchloraemia (low/negative AG) on some analysers.
- **T06-37** `c3.js` · sepsis: No resuscitation numbers. → Add SSC 2021: 30 mL/kg crystalloid within 3 h for hypoperfusion (weak), balanced crystalloids preferred, noradrenaline first line, target MAP 65, capillary refill time as an adjunct.
- **T06-38** `c3.js` · vomit: Add bicarbonaturia pearl. → Early/active vomiting: urine Na⁺ and K⁺ high (bicarbonaturia) while urine Cl⁻ stays low; paradoxical aciduria in pyloric stenosis.
- **T06-39** `c3.js` · diarr: Exceptions. → Add villous adenoma and congenital chloride diarrhoea as diarrhoea causes of metabolic alkalosis.
- **T06-40** `c3.js` · toxalc2: Isopropanol pearl. → Isopropanol: nitroprusside ketone test positive (acetone) but BHB normal, no acidosis, high osmolar gap.
- **T06-41** `c5.js` · SRC: Sources have no DOI/URL. → Add DOI links so the learner can open the guideline offline-cached or online.
- **T06-42** `c3.js` · asthma: Doubt to verify: BTS/NICE/SIGN 2024 (NG245) replaced the chronic sections of SIGN 158; acute severity criteria are still from SIGN 158 (2019). → Confirm and phrase the label as 'BTS/SIGN 2019 (SIGN 158), acute section'.
- **T06-43** `c3.js` · pe: ESC risk stratification link. → Add a line: lactate > 2 and RV dysfunction feed ESC risk strata; ABG does not enter Wells/Geneva/PERC (PERC uses SpO₂ ≥ 95%).
