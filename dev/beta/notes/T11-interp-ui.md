# T11 · Interpreter UI (interp-ui)

**Covered:** renderInterp, buildForm, readForm, runInterp and parseGas (ui3.js); next steps, save, share and log (ui6.js); hand-off (ui9.js). I tested 43 printout and ward-note formats (Radiometer ABL800/ABL90 in mmHg and kPa with (T) values, Siemens RAPIDPoint, GEM 5000, i-STAT CG8+ and CHEM8+, Cobas b 221, kPa without units, comma decimals, slash shorthand, long names, Unicode subscripts). I also tested every reference case and lesson example, 30 random cases, the arterial/venous toggle, Clear, kPa mode, fill-in of FiO2 typed as %, save sheet, log reopen, share and hand-off payloads. Each NEXT key was checked clinically. Viewports: 390/820/1280/1440, pixel and clinical skins, dark and light. No JS errors and no page-level horizontal scroll.

**Verdict:** a solid, well-explained tool. The parser handles the mainstream analyser layouts well (Radiometer mmHg, RAPIDPoint, GEM, Cobas, i-STAT incl. mg/dL glucose above 60 and BUN with mg/dL), and the next-steps content is mostly accurate and well sourced. The weak points: (1) the very first screen reads the placeholder DKA gas as 'HAGMA + respiratory acidosis' because of HCO₃⁻ rounding at the Winter boundary; (2) the NIV threshold is wrong (45 mmHg vs BTS 6.5 kPa); (3) several real-world parse failures (kPa printouts that also show mmHg barometric pressure, pH(T), FO2(I), CK as K⁺, 'Osm calc', glucose 45 mg/dL, slash shorthand); (4) an inconsistent gas still gets a confident headline and next steps; (5) a stale calculated HCO₃⁻ after edits; and (6) a broken hand-off payload when FiO₂ is typed as a percentage.

**Score: 6.5/10**

## Critical (2)
- **T11-1** `ui3.js` · IV default (line 3) / first open of openTool('interp'): The interpreter opens on the placeholder DKA gas (pH 7.21, PCO2 24) but with HCO3 left blank, so it is calculated as 9.3, not 9.4. Winter's then gives 19.95–23.95 and PCO2 24 is called 'too high: added respiratory acidosis'. The first read a user sees is 'HAGMA + respiratory acidosis', while the step text says 'expected PCO2 20–24 mmHg. Measured 24'. Pasting the placeholder text (which includes HCO3 9.4) reads as pure HAGMA. The app's own reference case 'DKA, compensated' is pure HAGMA.
  - Evidence: openTool('interp') -> bigread 'HAGMA + respiratory acidosis'; working 'Winter's: 1.5 × 9.3 + 8 = 22 ± 2 → expected PCO₂ 20–24 mmHg. Measured 24.' Paste the placeholder text -> 'High anion gap metabolic acidosis'. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-interp-desk.png
  - Fix: Add hco3:9.4 to the default IV so it matches the placeholder (or pick a default that is clearly inside the band, e.g. PCO2 22). See the e1 line for the boundary rounding.
- **T11-3** `ui6.js` · NEXT.rac.first: The NIV threshold is wrong: it says 'COPD with pH below 7.35 and PaCO2 above 45 mmHg after optimal medical treatment: start NIV'. BTS/ICS 2016 (Recommendation 25) says pH < 7.35 and PaCO2 > 6.5 kPa (≈ 49 mmHg), persisting despite optimal medical therapy. With 45, an exam answer or a bedside decision would be wrong.
  - Evidence: ui6.js line 31. BTS/ICS guideline for the ventilatory management of acute hypercapnic respiratory failure, Thorax 2016;71 Suppl 2:ii1 (https://thorax.bmj.com/content/71/Suppl_2/ii1), Rec 25.
  - Fix: Change to 'COPD with pH below 7.35 and PaCO₂ above 6.5 kPa (49 mmHg) despite optimal medical treatment: start NIV (BTS/ICS 2016)'. Show the threshold in the user's units.

## Major (12)
- **T11-2** `e1.js` · interp() compensation step, Winter's boundary: The decision uses unrounded bounds (23.95) but the text shows them rounded ('20–24'), so a measured 24 is reported as outside a displayed band of 20–24. The read contradicts its own working. Analyser PCO2 is an integer, and HCO3 is to one decimal, so this happens often.
  - Evidence: pH 7.21, PCO2 24, HCO3 9.3: 'expected 20–24 … Measured 24' -> 'PCO₂ too high'.
  - Fix: Compare against the displayed (rounded) bounds, e.g. round lo and hi to whole mmHg (or 0.1 kPa) before comparing, or show one decimal in the text. The 'How sure' note already covers the edge.
- **T11-4** `ui3.js` · parseGas, kPa detection (line 9): kPa is ignored whenever 'mmHg' appears anywhere in the text. Radiometer and other printouts in kPa often still print barometric pressure in mmHg, which is enough. pCO2 3.20 kPa is then read as 3.2 mmHg and the read fails with 'PCO₂ 3.2 is outside the possible range'.
  - Evidence: Paste 'pH 7.21\npCO2 3.20 kPa\npO2 14.0 kPa\ncHCO3-(P)c 9.4\nBarometric pressure 760 mmHg' -> 'CHECK THE INPUT: PCO₂ 3.2 is outside the possible range (5–200 mmHg)'. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-baro-kpa-error.png
  - Fix: Detect the unit per value: capture an optional unit right after each pCO2 and pO2 number (`num\s*(kpa|mmhg)?`). Fall back to the global and fit test only when that value has no unit.
- **T11-5** `ui3.js` · parseGas, pH pattern: The pH pattern explicitly accepts 'pH(T)' and takes the first match. Radiometer and Cobas print the temperature-corrected pH(T), pCO2(T) and pO2(T) before or beside the 37 °C values. The parser then reads temperature-corrected values, but the Boston rules and reference ranges are for 37 °C (alpha-stat).
  - Evidence: 'pH(T) 7.30\npH 7.32\npCO2(T) 6.1 kPa\npCO2 5.9 kPa' -> pH 7.30, pco2 45.8 (it should be 7.32 and 44.3).
  - Fix: Prefer the label without (T): run a pass that excludes '(T)' first, and use the (T) values only if no 37 °C value exists. Tell the user in pMsg when (T) values were used.
- **T11-6** `ui3.js` · parseGas, FiO2 pattern: Radiometer prints the inspired oxygen as 'FO2(I) 28.0 %', which is not recognised. FiO2 is then missing, the engine assumes 0.21, and oxygenation is classified on room-air rules ('hypoxaemia with raised A–a' instead of P/F 221 on 28%).
  - Evidence: The Radiometer ABL800 sample text (pO2 62, FO2(I) 28.0 %) parses with no fio2.
  - Fix: Add `\bf\s?i?\s?o2\s*\(\s*i\s*\)` and 'FIO2' variants. When a printout has a pO2 but no FiO2, say in pMsg 'FiO₂ not found: assumed room air' and highlight the FiO2 field.
- **T11-7** `ui3.js` · parseGas, ward shorthand: The common ward and handover shorthand '7.31/52/24' (pH/PCO2/HCO3, optionally /PO2) is not parsed at all. 'VBG 7.31/52/24 lac 3' gives only lactate and the empty state 'Enter at least pH and PCO₂'. The brief names this format.
  - Evidence: Paste 'VBG 7.31/52/24 lac 3' -> 'Read 1 value · venous', no read. 'ABG 7.21/24/9.4/108 on RA' -> 'No values recognised.' Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-slash.png
  - Fix: Add a slash rule: `\b([67]\.\d{1,3})\s*/\s*(\d+(?:\.\d+)?)\s*/\s*(\d+(?:\.\d+)?)(?:\s*/\s*(\d+(?:\.\d+)?))?`, mapped to pH/PCO2/HCO3/PO2. Some write pH/PCO2/PO2/HCO3, so use the Henderson fit to decide the order of the 3rd and 4th numbers. Also add 'RA'/'room air' -> FiO2 0.21.
- **T11-8** `ui3.js` · parseGas, K⁺ pattern: 'CK' (creatine kinase) matches the potassium pattern `\bc?k\+?`, because the optional 'c' prefix is meant for Radiometer cK+. CK 3000 is read as K⁺ 30, and the read fails, even when 'K 4.0' follows later.
  - Evidence: 'pH 7.30 pCO2 30 HCO3 14 Na 140 Cl 100 CK 3000 K 4.0' -> 'K⁺ 30 is outside the possible range'. CK is common on rhabdomyolysis printouts.
  - Fix: Exclude CK and CPK: use `\b(?:ck\+|k\+?)(?![a-z])`, or a negative lookahead for 'CK\s' followed by 3+ digits. Run potassium only after removing `\bc?pk\b|\bck\b(?!\+)` tokens.
- **T11-9** `ui3.js` · parseGas, osmolality: `\bosm\w*` takes the first 'Osm…' number, so 'Osm calc 290 … Osm measured 330' sets the measured osmolality to the calculated 290. The osmolar gap then comes out normal (−5 instead of +35), and the toxic-alcohol cue is lost.
  - Evidence: 'pH 7.10 pCO2 20 HCO3 6 Na 140 Cl 100 Osm calc 290 Osm measured 330 Glu 5 Urea 5' -> osm 290.
  - Fix: Skip labels containing calc/calculated/'c)' (and Radiometer 'mOsmc'), and prefer 'measured' or 'osmolality' when several exist. Never fill 'Osm (measured)' from a calculated value.
- **T11-10** `ui3.js` · parseGas, glucose mg/dL: Glucose is converted from mg/dL only when the value is above 60. A hypoglycaemic i-STAT result 'Glu 45 mg/dL' (2.5 mmol/L) stays as 45 mmol/L, and the engine then says 'Glucose 45: DKA likely' in any HAGMA. In reverse, a real HHS glucose of 66 mmol/L becomes 3.7.
  - Evidence: i-STAT text '…Glu 45 mg/dL' -> glu 45. 'Glu 66 mmol/L' -> 3.7 (unit given, but ignored).
  - Fix: Read the unit next to the value (mg/dL or mmol/L). Use the >60 heuristic only when no unit is present, and flag it in pMsg. Do the same for lactate (mg/dL ÷ 9.01) and BUN (see BUN item).
- **T11-11** `ui6.js` · nextKeys(), r.mac==='?': When Na⁺ or Cl⁻ is missing, the engine leaves r.mac='?' (metabolic acidosis, gap unknown), but nextKeys maps any truthy mac to 'hagma'. The Next steps panel then teaches 'High anion gap metabolic acidosis' for a gas whose read says only 'Metabolic acidosis', and it may be a NAGMA (e.g. diarrhoea).
  - Evidence: IV={pH:7.25,pco2:28,hco3:12} -> bigread 'Metabolic acidosis', Next steps 'High anion gap metabolic acidosis'.
  - Fix: Add a NEXT.mac key ('Metabolic acidosis, gap not known') whose first test is 'Na⁺, Cl⁻ and albumin to calculate the anion gap', with short HAGMA and NAGMA lists. Map r.mac==='?' to it.
- **T11-12** `ui3.js` · runInterp, inconsistent gas: When Henderson fails by more than 10% ('Numbers do not fit together'), the headline still shows a confident diagnosis. The copy and share line carry no warning, and Save, Hand-off and the Next steps for that diagnosis are all offered. The reference case 'Transcription error' shows the big headline 'Acute respiratory acidosis' next to 'pH in normal range'.
  - Evidence: Load the reference set 'Transcription error' (pH 7.40, PCO2 60, HCO3 24). Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-transcription.png
  - Fix: When o.flags includes 'inconsistent': replace the bigread with 'Check the numbers: pH, PCO₂ and HCO₃⁻ do not fit', put the provisional label in small text, prefix the line with 'UNRELIABLE (Henderson mismatch):', and hide the Next steps panel or replace it with a 'recheck the sample' panel.
- **T11-13** `ui3.js` · buildForm/readForm, HCO3 after an example: loadInterp() writes the calculated HCO3 into the form as if it were entered. If the user then edits pH or PCO2, the old HCO3 stays. The gas becomes internally inconsistent and the read changes to a different disorder.
  - Evidence: Load {pH:7.40,pco2:40} (HCO3 23.9 filled in), then type pH 7.20 -> 'Metabolic acidosis + respiratory alkalosis', 'Numbers do not fit together'.
  - Fix: Track which fields were derived (e.g. IDERIVED=['hco3']). Show a derived HCO3 as a placeholder (grey 'calc 23.9') rather than a value, or recalculate it on each edit until the user types in the field.
- **T11-14** `ui9.js` · Hand off to reasoning (iHand onclick): The hand-off builds its input without normalising FiO2 (ui6 divides values above 1 by 100, ui9 does not). FiO2 typed as '40' fails validate, so o.err is set, and the payload has no title or read, with steps:[] and next:[]. It is still sent or copied with a success toast.
  - Evidence: Type FiO2 40 (the form accepts it and the read works), then 'Hand off to reasoning'. Payload: {…"gas":{…"fio2":40},"steps":[],"next":[]}.
  - Fix: Reuse one helper (e.g. interpInput()) for runInterp, save, share and hand-off. Abort with a toast if o.err is set.

## Minor (21)
- **T11-15** `ui9.js` · Hand off to reasoning, steps[].working: The working text is sent with raw HTML ('<b>Venous sample:</b> …') into a JSON meant for another app.
  - Evidence: Venous gas hand-off payload, steps[0].working.
  - Fix: Strip tags (`.replace(/<[^>]+>/g,'')`) before sending.
- **T11-16** `ui3.js` · parseGas, standard bicarbonate: The HCO3 pattern accepts 'HCO3std' and Radiometer 'cHCO3-(P,st)c' (standard bicarbonate, normalised to PCO2 40). Whichever comes first is taken. Standard bicarbonate does not satisfy Henderson with the measured PCO2. On RAPIDPoint the order is act then std (fine), but any layout or LIS export with std first gives a wrong HCO3 and a false 'inconsistent'.
  - Evidence: 'HCO3std 23.0\nHCO3act 21.5\npH 7.452\npCO2 31.2' -> hco3 23.
  - Fix: Prefer actual or plasma HCO3 (act, (P)c, plain HCO3-) and skip std/st unless nothing else exists.
- **T11-17** `ui3.js` · parseGas, long English names: 'Sodium', 'potassium' and 'chloride' (common in ward notes and lab reports) are not recognised; only Na, K, Cl are. So no anion gap is calculated from a typed note.
  - Evidence: 'Sodium 136, potassium 4.1, chloride 101, bicarbonate 9.4, pH 7.21, PaCO2 24' -> na, k and cl missing.
  - Fix: Add the aliases sodium, potassium, chloride, 'albumin', 'glucose', 'lactate' (some exist via \w*), 'beta-hydroxybutyrate', 'ketones', 'age'.
- **T11-18** `ui3.js` · parseGas, BHB: The form has a BHB (ketones) field and the engine uses bhb ≥ 3, but parseGas has no pattern for BHB, β-OHB or ketones.
  - Evidence: '… BHB 5.2' -> not filled.
  - Fix: Add ['bhb','\b(?:bhb|b-?ohb|β-?hydroxybutyrate|beta-?hydroxybutyrate|(?:blood\s*)?ketones?)[^0-9\n]{0,12}'+num].
- **T11-19** `ui3.js` · parseGas, BUN without units: BUN is converted to urea mmol/L only if 'mg/dL' appears somewhere in the text. 'BUN 56' is kept as urea 56 mmol/L (true value 20). BUN is by definition reported in mg/dL.
  - Evidence: 'pH 7.30 pCO2 30 HCO3 14 BUN 56 Na 140 Cl 100' -> urea 56 (the engine then says 'uraemia may contribute').
  - Fix: Always convert when the label is BUN (× 0.357), unless 'mmol' follows the value.
- **T11-20** `ui3.js` · parseGas, lactate mg/dL: Lactate reported in mg/dL (some US labs) is taken as mmol/L.
  - Evidence: 'Lactate 36 mg/dL' -> lac 36 (true 4.0).
  - Fix: Convert by ÷ 9.01 when mg/dL follows the value.
- **T11-21** `ui3.js` · parseGas, reference range before value: When a reference range precedes the result ('pH [7.35-7.45] 7.21'), the range's first number is taken.
  - Evidence: 'pH  [7.35-7.45]  7.21\npCO2 [35-45] 24' -> pH 7.35, pco2 35.
  - Fix: Skip bracketed or parenthesised ranges: strip `[\[(]\s*[\d.]+\s*[-–]\s*[\d.]+\s*[\])]` before matching.
- **T11-22** `ui3.js` · parseGas, venous detection: Any occurrence of 'venous' marks the sample venous, even when the printout states 'Sample type: Arterial'.
  - Evidence: 'Sample: Arterial  Comment: taken from arterial line, not venous …' -> ven true.
  - Fix: If an explicit 'sample (type)?: arterial|venous|capillary|mixed venous' field exists, use it. Otherwise fall back to keywords.
- **T11-23** `ui3.js` · parseGas, age: The Radiometer patient section 'Age 67' is not parsed, so the A–a expected value is skipped.
  - Evidence: Radiometer sample -> no age.
  - Fix: Add ['age','\bage\b[^0-9\n]{0,8}(\d{1,3})'] (cap at 120).
- **T11-24** `ui3.js` · Clear button (iClr): Clear empties the form but leaves the pasted text and the 'Read 8 values · kPa converted' message. The pasted printout (possibly with identifiers) stays on screen, and the message now describes nothing.
  - Evidence: Paste, Read values, Clear -> textarea and pMsg unchanged.
  - Fix: Also clear $('pTxt').value and $('pMsg').textContent.
- **T11-25** `ui6.js` · Save to log -> Open log button: The 'Open log' button is only rendered if the log already had entries when the read was drawn. After the first save it does not appear until the gas is re-read.
  - Evidence: Fresh state: Save to log -> Save -> $('iLog') is null.
  - Fix: After logAdd in saveSheet, call runInterp() or insert the iLog button.
- **T11-26** `ui6.js` · saveSheet dialog: Escape does not close the save sheet, focus is not trapped, and focus does not return to 'Save to log' on close. Toasts render on top of the sheet and cover the Note field.
  - Evidence: Press Escape -> the sheet stays open. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-savesheet.png
  - Fix: Add a keydown Escape handler, a focus trap, and restore focus. Raise the sheet's z-index above toasts, or position toasts above the sheet.
- **T11-27** `ui6.js` · shareRead(): Where navigator.share is missing (desktop Linux Chrome, i.e. the user's Steam Deck), 'Share line' falls back to copyText. If the clipboard is blocked it fails silently: no toast and no selectable text, unlike 'Copy for Black Template'.
  - Evidence: Headless Chromium: navigator.share undefined; Share line -> no feedback.
  - Fix: Share the iCopy fallback (inject the selectable textarea plus a toast), or relabel the button 'Copy line' when Web Share is unavailable.
- **T11-28** `ui6.js` · nextKeys, COHb threshold: The CO panel needs COHb ≥ 10%, but the engine already flags any COHb above 3% as exposure. A non-smoker with COHb 8% gets no CO next steps (oxygen, ECG, cyanide consideration).
  - Evidence: IV={pH:7.38,pco2:36,hco3:21,po2:95,cohb:8} -> no 'Carboxyhaemoglobin raised' panel.
  - Fix: Use > 3% (or > 5%) for the panel, matching the engine. Smokers can be mentioned in the panel text.
- **T11-29** `ui6.js` · NEXT.co.first: '100% oxygen via non-rebreather' overstates what a non-rebreather gives (about 60–80% FiO2).
  - Evidence: ui6.js line 61.
  - Fix: Reword: 'Highest-concentration oxygen (15 L/min via a non-rebreather mask, or 100% via a tight-fitting circuit if intubated) until symptoms resolve and COHb is below about 3%'. Cite TOXBASE or Weaver.
- **T11-30** `ui6.js` · NEXT.methb.dx and pit: Lidocaine is a weak cause; prilocaine (EMLA, Bier's block) is the classic local anaesthetic. Also missing: nitrates and inhaled nitric oxide, rasburicase, and the pitfall that methylene blue can cause serotonin syndrome with serotonergic drugs (MHRA/FDA warning).
  - Evidence: ui6.js lines 65–68.
  - Fix: dx: 'Oxidant drugs: dapsone, benzocaine, prilocaine, nitrites and nitrates, nitric oxide, primaquine, rasburicase'. pit: add 'Methylene blue with SSRIs or other serotonergic drugs can cause serotonin syndrome'.
- **T11-31** `ui6.js` · NEXT.lung for cat 'lungmild': The 'Raised A–a gradient' panel also appears when PaO2 is adequate on room air. Its first step 'Titrate oxygen to SpO₂ 94–98%' implies giving oxygen to someone who does not need it.
  - Evidence: nextKeys pushes 'lung' for ox.cat==='lungmild'.
  - Fix: For lungmild, show a lighter panel ('A–a raised with an adequate PaO₂: look for the lung cause; oxygen is not needed if SpO₂ is on target'), or drop the oxygen line.
- **T11-32** `ui6.js` · NEXT.pf: It uses only the Berlin definition. The 2023 global ARDS definition (Matthay et al., AJRCCM 2024) adds HFNC ≥ 30 L/min, SpO2/FiO2 ≤ 315 and ultrasound. Also, the pitfall 'The Berlin bands need PEEP ≥ 5' repeats the dx line.
  - Evidence: ui6.js lines 52–57.
  - Fix: Add one dx line on the global definition (SpO₂/FiO₂ ≤ 315 when no ABG; HFNC ≥ 30 L/min counts). Replace the duplicate pitfall with 'P/F is not valid on low-flow oxygen where FiO₂ is unknown'.
- **T11-33** `ui3.js` · kPa mode, formulas card and errors: With Settings set to kPa, the Formulas card still shows only mmHg ranges, and validation errors give mmHg limits ('PCO₂ 3.2 is outside … 5–200 mmHg') for a value the user typed in kPa.
  - Evidence: S.units='kPa'; FORMULAS() is static text; validate() reports in mmHg.
  - Fix: Render the PCO2 and PO2 thresholds in FORMULAS with P() and PU(). In runInterp, convert the reported value in o.err back to kPa (or validate before conversion).
- **T11-36** `e1.js` · interp(), venous AG: For a venous sample, the anion gap uses the arterial-estimated HCO3 (measured − 1), so the gap is about 1 higher than with the measured value. Serum bicarbonate is closer to the venous value. (Doubt: a design choice, but it should be explicit.)
  - Evidence: VBG pH 7.21 PCO2 30 HCO3 12 Na 136 Cl 100 -> 'AG = 136 − (100 + 11) = 25'.
  - Fix: Use the measured v.hco3 for AG and Δ ratio on venous samples, or state the adjustment in the working.
- **T11-41** `ui3.js` · Paste textarea accessibility: #pTxt has no label or aria-label (the h3 'Paste a printout' is not associated). The example select has an aria-label, but nothing shows which example is loaded after selection, because it resets to 'Load an example…'.
  - Evidence: $('pTxt').getAttribute('aria-label') === null.
  - Fix: Add aria-labelledby on the textarea. After loading, show a small chip 'Example: Salicylate' (cleared when the user edits).

## Polish (8)
- **T11-34** `e1.js` · interp() step working in kPa mode: In kPa mode the working mixes units: 'PAO₂ = 0.21 × (760 − 47) − 24/0.8 = 16.0' (mmHg inputs, kPa result) and 'Winter's: 1.5 × 9.4 + 8 = 22.1 ± 2 → expected PCO₂ 2.7–3.2 kPa' (22.1 is mmHg, unlabelled).
  - Evidence: S.units='kPa', load the default DKA gas.
  - Fix: Label the intermediate as mmHg ('= 22.1 mmHg (2.9 kPa)'), or use the kPa Winter's form (0.2 × HCO₃⁻ + 1.1 ± 0.27). Show P_atm in kPa.
- **T11-35** `e1.js` · Oxygen step, A–a tolerance: It says 'A–a = 12 (expected ≤ 10 for age 24)' and then 'Normal oxygenation', because a hidden +5 tolerance applies. This looks contradictory on screen.
  - Evidence: Default gas, Oxygen step.
  - Fix: Write 'expected ≤ 10 (+5 tolerance) for age 24' or 'upper limit 15'.
- **T11-37** `shell.html` · #iForm .ctrl label at 1280 px (3 columns): The 'Osm (measured)' unit 'mOsm/kg' overflows into the next label, 'BHB (ketones)' ('mOsm/kgBHB').
  - Evidence: 1280×800: the unit span's right edge is 444.7 px and the BHB label starts at 436.2 px. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-interp-desk.png
  - Fix: Allow the label to wrap (unit on its own line), shorten it to 'mOsm', or set min-width:0 with overflow:hidden on the unit span.
- **T11-38** `shell.html / ui3.js` · Result column order: The Next steps card comes after the collapsed 'Formulas, assumptions and limits' card. The clinically useful content sits below the reference table, and the desktop read is very long while the form column ends early.
  - Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-interp-desk.png
  - Fix: Order: Read -> Steps -> Next steps -> Formulas. Make the left form column position:sticky on wide screens.
- **T11-39** `ui3.js` · Action buttons in the read card: 'Copy for Black Template' is a full-size button above the map, while Save, Share and Hand-off are small buttons below the map. Related actions are split and look different, and on phone the row sits a full screen below the line it acts on.
  - Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-p-read.png
  - Fix: Put all four actions in one row directly under the line (same size), with the map after it.
- **T11-40** `ui3.js` · Phone layout, form above results: On a phone the read is about 1.5 screens below the form, so after typing or pasting there is no visible change.
  - Evidence: 390×844, Read values -> the result is off-screen (only a toast).
  - Fix: After Read values or loading an example on narrow screens, scroll #iOut into view, or add a sticky mini-bar showing the current bigread.
- **T11-42** `shell.html` · Formulas table on phone: The formulas table is 420 px wide inside a 306 px container on a 390 px phone (horizontal scroll inside the card, with no visual cue).
  - Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-formulas-phone.png
  - Fix: Under 600 px, stack the rows as cards (Quantity as the heading, then the formula, then the limits).
- **T11-43** `ui10.js` · 'Photo of printout' button: The photo button in the paste card uses the copy icon.
  - Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T11-interp-clinical-light.png
  - Fix: Use a camera icon.

## Ideas (ranked by value)
- **T11-44** `ui3.js` · parseGas, oxygen delivery: Parse oxygen delivery from free text ('on 2L NC', 'RA', 'room air', '15L NRB', 'Venturi 28%') into FiO2 using the existing DEVICES table, and show the estimate in pMsg. Fix: Map nc1–4, sfm, v24–v60, nrb from DEVICES. Mark the value as estimated.
- **T11-45** `ui3.js` · Paste result review: After 'Read values', show a compact diff of parsed values with the source token (e.g. 'PCO₂ 24 mmHg ← "pCO2 3.20 kPa"'), with a one-tap fix for wrong units. Fix: List out.got with the matched substring (keep m[0] in parseGas).
- **T11-46** `ui3.js` · Practice from the Interpreter: A 'Random case' fills the form and shows the answer at once. Offer 'Hide the read until I commit', with a dropdown guess, so the menu doubles as practice. Fix: Add a toggle, and record the attempt in S.kinds.
- **T11-47** `ui3.js` · Capillary samples: Recognise 'capillary' (common on neonatal and ward analysers): read the acid–base, and say the PO2 is unreliable. Fix: Add sample 'c', handled like venous for oxygenation but without the venous correction.
- **T11-48** `ui6.js` · NEXT coverage: There are no panels for an osmolar gap above 10 (toxic alcohol), severe acidaemia (pH < 7.1), hyperkalaemia with acidosis, or hyperoxaemia, all of which the engine already detects. Fix: Add keys og, severe, hyperk and hyperox with tests, first steps, pitfalls and sources.

## Checked and fine
- NEXT hagma, nagma, hn, malk, ralk, hv and ven content is accurate: urine anion gap Na⁺+K⁺−Cl⁻; urine Cl⁻ < 20 for chloride-responsive alkalosis; nitroprusside strips miss β-OHB; BICAR-ICU benefit in the AKI subgroup; paper-bag rebreathing is unsafe; VBG PCO₂ ≤ 45 mmHg as a hypercapnia screen (Byrne 2014); SpO₂ 88–92% in CO₂ retainers (BTS 2017); methylene blue 1–2 mg/kg; prone positioning for P/F < 150 at least 12 h/day (Fan 2017).
- All 21 reference cases give their expected labels in the UI, and all 28 lesson examples load without error.
- The privacy warning on IDs in the tag or note works. Log reopen restores the gas (FiO₂ normalised).
- Sources: BTS/ICS 2016 Thorax 71 Suppl 2 (https://thorax.bmj.com/content/71/Suppl_2/ii1); summary at https://speciality.medicaldialogues.in/btsics-guideline-for-the-ventilatory-management-of-acute-hypercapnic-respiratory-failure-in-adults
