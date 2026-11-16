# T10 — Interpretation engine (e1.js): interp(), genCase()/KINDS, validate, kPa

**Covered:** every interp() step (consistency, pH, primary, all four compensation rules, AG with albumin and K⁺, delta bands, osmolar gap, oxygenation with A–a/age/altitude, P/F, co-ox, venous handling, BE, summary line, uncertainty notes). Also genCase/rawCase/KINDS at levels 1–4, with strict and venous options, across every Settings altitude (760/707/580) and AG reference (4–16); validate/LIMITS; and kPa mode. Method: the engine was loaded in Node from a snapshot of the frozen sources (identical to the frozen HTML), using about 40 hand-built borderline and extreme gases, sweeps of about 3,800 MAC and 3,400 MALK reads checking text against verdict, 16,086 random gases through tests/reference.py, and about 20,000 generated cases checked for physiology and realism. Scripts are in /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/.

**Verdict:** The core arithmetic is right: Henderson, Winter, the respiratory 1/4 and 2/5 rules, AG + 0.25×(40−alb), Van Slyke SBE, alveolar gas and P/F all check out by hand, and nothing crashed on any input (null, strings, NaN, Infinity, extremes). The weak points are elsewhere: (1) a few rules that teach the wrong thing in mixed disorders (salicylate called "chronic renal compensation"; acute CO₂ rise + high gap misses the alkalosis; venous AG off by 1); (2) the generator, which assumes default Settings and produces impossible or degenerate cases at altitude or with a lower AG reference; and (3) text and verdict disagreeing at rounding edges. The bundled "independent" Python reference is a mirror of the engine, so it could not catch these.

**Score: 6/10.** Solid maths with a good structure. Fix the three criticals and the text/verdict rounding before release.

## Critical

### T10-1 · e1.js · `interp() step 4, respiratory-alkalosis branch; genCase KINDS.hag_ralk / hag_malk_ralk`
- **What:** In salicylate poisoning, early sepsis and paracetamol liver failure (hag_ralk) the compensation step says "Chronic, renally compensated" (green). That is 297 of 300 generated cases; hag_malk_ralk gives 263 of 300. Step-mode practice (buildQs, cat:"comp") then marks "Chronic" as the correct answer for an overdose a few hours old. The HCO₃⁻ is low because of the HAGMA, not because of renal compensation. The hand-checked REFCASE "Triple disorder" (pH 7.48/25/18) shows the same thing: step 4 says chronic compensation while its own note works the case as metabolic-primary.
- **Evidence:** node: 300 x genCase("hag_ralk",4): primKey "ralk", compKey "c" in 297. E.g. interp({pH:7.48,pco2:25,hco3:18,na:140,cl:96,alb:40}) gives comp.v "Chronic, renally compensated", then the label is the triple. Script: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/p6.js
- **Fix:** In the ralk branch, when h < a−2 (below the acute prediction), compute the anion gap first. If the gap is high, set comp.code="mac" with v "HCO₃⁻ below the acute prediction: added metabolic acidosis (a high gap explains the extra fall)", and call it "chronic" only when the gap is normal. Do the same in the rac branch: when h > a+2 and the gap is high, say a metabolic alkalosis may be present. Then add a test: genCase("hag_ralk") must never give compKey "c" or "p".

### T10-2 · e1.js · `rawCase(): ag=rnd(9,13), ag=12+…, clearCut() threshold`
- **What:** The generator hard-codes an anion-gap reference of 12, but Settings allows 4–16 and its help text says "many modern analysers run lower. Use your lab's." At agref 8, strict generation (used by Gas of the day, Fit and Rounds) returns null for 10 of the 15 kinds 100% of the time. At agref 4, 11 kinds return null even without strict, because every "normal" gap of 9–13 now counts as high. safeCase() then quietly swaps in another kind, so practice falls back to HAGMA-type cases only. At agref 16, hag_nag strict returns null 100% of the time.
- **Evidence:** node /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/p7.js: "patm 760 agref 4: nagma, malk, rac_a, rac_c, rac_ac, ralk_a, ralk_c, hag_nag, rac_malk, ralk_malk null 50/50"; agref 8 strict: malk, rac_*, ralk_*, hag_nag, rac_malk, ralk_malk null 50/50. agref 16: hag_nag strict 40/40 null (p3.js).
- **Fix:** Base every generated gap on R=S.agref: normal ag=R+rnd(-3,0.5); hagma ag=R+(24-h)*rnd(..); hag_nag ag=R+(24-h)*rnd(0.45,0.7), and so on. Then add a run.js loop over agref 4,8,12,16 and patm 760,707,580 asserting that each kind returns a case in at least 90% of calls.

### T10-3 · e1.js · `rawCase() oxygen block (ox "n" floor 77/82, ox "lung" fallback)`
- **What:** With Settings altitude set to Abha (580 mmHg, one of the three offered options), 517 of 1,400 generated cases (37%) have a PaO₂ higher than the alveolar PO₂. That is physically impossible on room air. Every malk and hag_malk case is affected, e.g. PCO₂ 51, PaO₂ 77, PAO₂ 48, so "A–a = -29". The cause is the hard floor Math.max(patm<740?77:82, …). The "lung" fallback (PA−exAa−12..25) falls below 30 mmHg, so rac_malk can never be generated at 580 (null 50/50), and at 650 it also returns null 60/60. Riyadh (707) still gives 9 of 1,499 impossible cases.
- **Evidence:** node /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/p7.js → "patm 580 impossible 517/1400"; example: "Abha malk case 51 77 PaO₂ 77 … PAO₂ = 48; A–a = -29 (expected ≤ 24 for age 80)".
- **Fix:** Generate PaO₂ relative to PAO₂, never from a fixed floor. For ox "n": po2 = PA − exAa*rnd(0.2,0.8), clamped to ≤ PA−2. For "lung": target an A–a of exAa+12..35, with po2 = PA − that, and accept the case when po2 ≥ 35. Use the interp hypoxaemia threshold (see the altitude finding) instead of 77/82. Add an invariant test: po2 ≤ PAO₂ for every generated room-air case at every Settings altitude.

## Major

### T10-4 · e1.js · `interp() step 4 text (Winter and metabolic-alkalosis bands)`
- **What:** The expected-PCO₂ band is printed rounded to whole mmHg, but the verdict uses the unrounded band. The screen then contradicts itself, e.g. "expected PCO₂ 23–27 mmHg. Measured 27." followed by "PCO₂ too high: added respiratory acidosis". This happens in 142 of 3,782 metabolic-acidosis reads (3.8%) and 145 of 3,450 metabolic-alkalosis reads (4.2%). It teaches learners that the band check is arbitrary.
- **Evidence:** interp({pH:7.21,pco2:27,hco3:11}): "Winter's: 1.5 × 11 + 8 = 24.5 ± 2 → expected PCO₂ 23–27 mmHg. Measured 27." verdict rac. interp({pH:7.29,pco2:23,hco3:11.2}): same "23–27" band, but measured 23 is "appropriate". Malk: h 28.6, p 35, shown 35–45, verdict "too low". Script /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/p5.js
- **Fix:** Print the band to one decimal in mmHg (r1(lo)–r1(hi), e.g. 22.5–26.5) and to two decimals in kPa. Or compare the rounded measured value with the rounded band, so that the text and the verdict use the same numbers. Add a run.js assertion that parses the displayed band and checks it against compKey.

### T10-5 · e1.js · `interp() gap step: "else if(high&&h>=24){if(!r.rac)r.malk=true; …}" and the delta baseline`
- **What:** When the primary process is respiratory acidosis, a high gap with HCO₃⁻ ≥ 24 never adds a metabolic alkalosis. The text then says "a bicarbonate held up by chronic CO₂ retention" even when step 4 has just called the process ACUTE. Example: pH 7.24, PCO₂ 60, HCO₃⁻ 26, AG 22. Acute prediction 26; the gap rose 10, so a pure HAGMA would leave HCO₃⁻ at about 16, and the measured 26 means a hidden metabolic alkalosis. The engine says only "HAGMA + respiratory acidosis". Primary respiratory alkalosis has the mirror problem: delta is measured against 24, not the expected HCO₃⁻ (about 20 when PCO₂ is 20), so it can overcall NAGMA.
- **Evidence:** interp({pH:7.24,pco2:60,hco3:26,na:140,cl:92,alb:40}) gives comp "Acute (minutes–hours)", then gap text "held up by chronic CO₂ retention", label "HAGMA + respiratory acidosis". Script /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/p1.js
- **Fix:** When prim is R, use the respiratory-predicted HCO₃⁻ as the delta baseline (base = rq==="c" ? c : a, from out.hband): delta = (agc−agref)/(base−h). Then apply the usual bands, and add malk when delta > 2 or when h ≥ base with a high gap. Reword the text for the acute case, e.g. "acute CO₂ rise adds only ~1 per 10 mmHg, so a normal HCO₃⁻ with this gap means a metabolic alkalosis too".

### T10-6 · e1.js · `interp() gap step: ag=v.na-(v.cl+h) uses h after the venous −1 adjustment`
- **What:** For venous samples the anion gap is calculated with the estimated arterial HCO₃⁻ (measured −1), not the HCO₃⁻ the analyser reported. Gap reference ranges are built on venous serum bicarbonate, so this raises every venous gap by 1. It can turn a NAGMA into a HAGMA + NAGMA. The working also shows an HCO₃⁻ the user never typed.
- **Evidence:** interp({sample:"v",pH:7.30,pco2:45,hco3:21,na:140,cl:105}): "AG = 140 − (105 + 20) = 15" gives High, then HAGMA + NAGMA (delta 0.75). With the measured 21, AG = 14, which is not high (needs >14), giving NAGMA.
- **Fix:** Use v.hco3 (the measured value) for ag, agc and the delta numerator/denominator. Keep the estimated arterial h only for the pH/PCO₂/compensation steps. Note "AG uses the measured HCO₃⁻" in the venous text.

### T10-7 · e1.js · `interp() oxygen block: co-oximetry checks live inside "if(!ven&&v.po2!=null)"`
- **What:** COHb, MetHb and the saturation-gap checks run only on arterial samples that also have a PaO₂. A VBG with COHb 28% (CO poisoning is usually diagnosed on a VBG, and venous COHb is reliable) gets no warning in the Oxygen step. Neither does an ABG without a PaO₂. The summary line still lists "COHb 28%" with no interpretation.
- **Evidence:** interp({sample:"v",pH:7.30,pco2:45,hco3:21,cohb:28,na:140,cl:105,lac:4.5}): ox step "Not assessed on a venous sample", no CO text, causes list has no CO. interp({pH:7.30,pco2:40,hco3:19,cohb:28}): ox "No PaO₂ entered".
- **Fix:** Move the co-ox block out of the PaO₂ branch and push it into the ox step for every sample type (venous COHb and MetHb are valid). Also add "COHb > 10%: CO poisoning: high-flow O₂, consider cyanide if smoke" to causes, and make the ox step tone "bad".

### T10-8 · e1.js · `interp() oxygen: raised = Aa > exAa+5; text "(expected ≤ "+P(exAa)+")"`
- **What:** The A–a verdict uses an unstated +5 tolerance, while the text prints the untolerated limit. So "A–a = 23 (expected ≤ 19 for age 60)" sits under the verdict "Hypoxaemia with a normal A–a gradient". The tolerance appears only in the Formulas table. The app standard in the brief is "A–a ≤ age/4+4".
- **Evidence:** interp({pH:7.40,pco2:40,hco3:24,po2:77,fio2:0.21,age:60}) gives "A–a = 23 (expected ≤ 19 for age 60). Hypoventilation or low inspired O₂ explains it; the lungs transfer normally."
- **Fix:** Either drop the +5 (raised = Aa > exAa), or print the limit actually used: "expected ≤ 19 (+5 tolerance → 24)". Without age, print "(no age: limit 20 used)". Use one rule in the engine, text and lessons.

### T10-9 · e1.js · `interp() oxygen: no plausibility check on PaO₂ vs PAO₂`
- **What:** A PaO₂ above the alveolar PO₂ (negative A–a) is accepted silently and called "Normal oxygenation". On room air this is impossible. It usually means the patient is on oxygen with FiO₂ not entered, an air bubble in the sample, or a mislabelled sample, which matters on shift.
- **Evidence:** interp({pH:7.40,pco2:40,hco3:24,po2:130,fio2:0.21,age:30}) gives "A–a = -30 … Normal oxygenation".
- **Fix:** If Aa < −10, set tone "bad" and v "PaO₂ higher than possible at this FiO₂". Add the text "check FiO₂ (is the patient on oxygen?), air bubble, sample type", and add the case to the flags/unsure list.

### T10-10 · e1.js · `interp() oxygen: f=v.fio2||0.21; summaryLine`
- **What:** When FiO₂ is left blank the engine silently assumes room air and shows "on FiO₂ 0.21". A patient on 60% O₂ with PaO₂ 90 and no FiO₂ entered reads as "Normal oxygenation". The summary line omits the FiO₂ altogether ("ABG:"), so the copied note hides the assumption.
- **Evidence:** interp({pH:7.40,pco2:40,hco3:24,po2:85,fio2:undefined}) gives "Normal oxygenation", text "on FiO₂ 0.21"; the line starts "ABG (FiO₂ …" only when fio2 was typed.
- **Fix:** When v.fio2==null, add "FiO₂ not entered: room air assumed" to the ox text and tone "warn", and write "FiO₂ 0.21 assumed" in the summary line.

### T10-11 · e1.js · `interp() gap step: osmolar gap only inside "if(v.na!=null&&v.cl!=null)" and only with glu and urea`
- **What:** The osmolar gap needs only Na, glucose and urea, but it is skipped silently whenever Cl⁻ is missing. A measured osmolality is also ignored without comment when urea or glucose is missing. A toxic-alcohol screen with osm 320 and calculated 290 (gap 30) shows nothing at all.
- **Evidence:** interp({pH:7.30,pco2:30,hco3:14.5,na:140,osm:320,glu:5,urea:5}) gives "Anion gap not calculated", no osmolar gap, causes []. interp({…na:140,cl:100,osm:330,glu:5}) (no urea): osm silently ignored.
- **Fix:** Compute og whenever na, glu, urea and osm are present, as its own line, even without Cl. When osm is given but glu or urea is missing, say "Add glucose and urea to calculate the osmolar gap". Put og>10 into causes even when the metabolic acidosis cannot be typed.

### T10-12 · e1.js · `KINDS.rac_c "copd" (o:"lung") and rac_malk "copddiur"; rawCase ox "lung" fallback`
- **What:** The stable COPD vignette ("routine clinic visit, usual self") is generated with a room-air PaO₂ of 30–52 mmHg (4–7 kPa), which would be a peri-arrest finding, not "usual self". copddiur gives 30–47. The cause is the fallback po2 = PA − exAa − 12..25 when PCO₂ is high.
- **Evidence:** 3,000-case sweep (/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t10/p4.js): "copd pH 7.33–7.39 PCO2 52–68 … PO2 30–52"; "copddiur … PO2 30–47".
- **Fix:** For high-PCO₂ "lung" cases, target an A–a of exAa+10..20 and keep PaO₂ at 50–65. If that is impossible because PAO₂ is too low, accept "lungmild", or set fio2 0.24–0.28 with o:"pf". Add a realism assertion that "routine/stable" vignettes have PaO₂ ≥ 50.

### T10-13 · e1.js · `KINDS.ralk_c "alt" and nagma "acz"`
- **What:** The "Healthy resident of a high-altitude city" and the altitude trekker on acetazolamide are generated at the Settings pressure (default sea level), so they show a room-air PaO₂ of 98–113. That contradicts the vignette, and the altitude resident is the classic teaching case for a low PaO₂ with a normal A–a gradient.
- **Evidence:** p4.js: "alt pH 7.41–7.45 PCO2 25–31 HCO3 16.4–19.9 … PO2 98–113"; "acz … PO2 96–112".
- **Fix:** Give these vignettes their own patm (e.g. {patm:560}) in the variant options. Use it in rawCase and pass it to interp via opt.patm (store c.patm so the interpreter and step text use it). Or drop the altitude wording from the vignettes.

### T10-14 · e1.js · `KINDS.nagma rawCase case "nagma": h=rnd(10,18) for every cause`
- **What:** Every NAGMA cause gets an HCO₃⁻ of 10–18. That is realistic for diarrhoea, ileostomy, toluene and distal RTA. It is not realistic for 0.9% saline (usually 18–22), acetazolamide (usually 17–21), topiramate at a "routine pre-op" visit (mild, about 18–21) or type 4 RTA (typically >17, mild). A learner sees "routine pre-op bloods" with HCO₃⁻ 10.4 and pH 7.25.
- **Evidence:** p4.js: "saline … HCO3 10.1–17.9", "topi … HCO3 10.4–17.6", "rta4 … HCO3 10.1–17.4", "acz … HCO3 10.3–17.9". Conn's (malk) HCO₃⁻ reaches 41.6 (usually high 20s to low 30s). Clinical ranges as commonly taught (e.g. LITFL NAGMA and RTA pages).
- **Fix:** Add an optional h:[lo,hi] to each variant's option object (saline [16,21], acz [16,21], topi [17,21], rta4 [16,21], conn [29,34]) and use it in rawCase instead of the kind-wide range, keeping the label check.

### T10-15 · e1.js · `rawCase case "ralk_malk": p=rnd(27,33), h=rnd(30,36)`
- **What:** Every RALK+MALK case (hyperemesis, cirrhosis on diuretics) is a severe alkalaemia: pH 7.58–7.75, median 7.66, out of 500 cases. Hyperemesis gases are usually around pH 7.45–7.55. Learners never see the commoner, subtler presentation, and the step text adds "Severe alkalaemia" each time.
- **Evidence:** p4.js: "ralk_malk pH min/med/max 7.58 7.66 7.75"; p3.js flags pH > 7.70 in many cases at every level.
- **Fix:** Use h=rnd(27,32) and p=rnd(30,34) (the label check still needs PCO₂ < 35 and HCO₃⁻ > 26). Optionally allow normal-pH presentations via the primary-at-normal-pH branch.

### T10-16 · e1.js · `validate() error message; called with kPa input already converted (ui3 readForm)`
- **What:** In kPa mode the input limits are checked after conversion to mmHg, and the error prints the converted value with floating-point noise and mmHg limits. A user who typed PCO₂ 40 (kPa) sees "PCO₂ 300.02479999999997 is outside the possible range (5–200 mmHg)".
- **Evidence:** S.units="kPa"; interp({pH:7.4,pco2:40*7.50062,hco3:24}) gives that exact string (p2.js). ui3.js readForm multiplies by KPA before interp.
- **Fix:** In validate(), format the value: for pco2/po2 show P(x) and PU(), and show the limits converted ((5/KPA).toFixed(1)–(200/KPA).toFixed(1) kPa). For all other fields use r2(x).

## Minor

### T10-17 · e1.js · `summaryLine(): "Δ ratio "+o.delta.toFixed(1)`
- **What:** The one-line read rounds delta to 1 dp, so the number shown can sit in a different band from the label and from the gap step (which uses 2 dp). Example: delta 0.79 shows "HAGMA + NAGMA; Δ ratio 0.8" (0.8 is the pure band). Delta 0.36 shows "Δ ratio 0.4". This happened in 215 of 16,086 random gases.
- **Evidence:** interp({pH:7.27,pco2:28,hco3:12.5,na:140,cl:106.4,alb:40}) gives "Impression: HAGMA + NAGMA …; Δ ratio 0.8." p5.js count.
- **Fix:** Use toFixed(2) in the line, as the gap step does.

### T10-18 · e1.js · `interp() gap text: "(usek?' (K⁺ included)':'')"`
- **What:** With "include K⁺" on in Settings but no K⁺ entered, the gap is calculated without K⁺ against reference 12, yet the text says "Reference ≈ 12 (K⁺ included)".
- **Evidence:** interp({pH:7.24,pco2:25,hco3:11,na:140,cl:105},{agref:12,usek:true}) gives "AG = 140 − (105 + 11) = 24. Reference ≈ 12 (K⁺ included)."
- **Fix:** Use (usek&&v.k!=null) for the text. When usek is on and K is missing, say "K⁺ not entered, so calculated without it".

### T10-19 · e1.js · `summaryLine(): imp+=" with "+(… ? … : "—")`
- **What:** When the only disorder found is metabolic but step 4 did not run (normal pH, both values in range, gap high), the impression reads "High anion gap metabolic acidosis with —". The Normal-pH hidden HAGMA example from lesson teaching is one way to get here.
- **Evidence:** interp({pH:7.41,pco2:37,hco3:22.5,na:140,cl:102.5,alb:40}) gives "Impression: High anion gap metabolic acidosis with —; Δ ratio 2.0."
- **Fix:** Append the compensation phrase only when comp.code is "ok" (or a real verdict). Otherwise write "(pH normal: offset by another process?)" or nothing.

### T10-20 · e1.js · `interp() step 2: v.pH.toFixed(2) vs pH<7.35`
- **What:** pH entered to 3 decimals (many analysers print 7.349) is classified on the exact value but displayed to 2 dp, giving "pH 7.35. Normal 7.35–7.45." next to "Acidaemia". The same happens with 7.451 → "pH 7.45 … Alkalaemia". Summary and Henderson text also show 7.35.
- **Evidence:** interp({pH:7.349,pco2:40,hco3:21.6}) gives step v "Acidaemia", d "pH 7.35. Normal 7.35–7.45.".
- **Fix:** Display pH with up to 3 decimals when entered that way (String(+pH.toFixed(3))), or round to 2 dp before classifying. Either is fine as long as the text and the verdict agree.

### T10-21 · e1.js · `interp() oxygen: cat uses pf<300, ARDS text uses pf<=300`
- **What:** At P/F exactly 300, the verdict is "Adequate oxygenation on supplemental O₂" but the text adds "Berlin ARDS: mild". Berlin mild is 200 < P/F ≤ 300.
- **Evidence:** interp({pH:7.40,pco2:40,hco3:24,po2:120,fio2:0.4}) shows both.
- **Fix:** Use pf<=300 for the impaired category so it matches Berlin.

### T10-22 · e1.js · `KINDS.nagma "tolu", KINDS.malk "conn" vignettes`
- **What:** The vignettes hard-code a potassium ("K⁺ 2.3", "K⁺ 2.9") while the generated case shows a different K⁺ (tolu 2.1–2.6, conn 2.6–3.1). The vignette and the lab panel then disagree on screen.
- **Evidence:** 200 x genCase("nagma",4) tolu K values 2.1–2.6; conn 2.6–3.1.
- **Fix:** Either fix k for those variants (k:[2.3,2.3]) or remove the number from the vignette ("profound weakness and a very low K⁺").

### T10-23 · e1.js · `LIMITS / validate()`
- **What:** There are no limits for spo2, cohb, methb or bhb, so nonsense passes into the text. MetHb 500% gives "MetHb 500%: treat (methylene blue …)", and COHb −5% is printed in the summary line. An SpO₂ of 300 is accepted.
- **Evidence:** interp({pH:7.4,pco2:40,hco3:24,po2:95,cohb:-5,spo2:300,methb:500}) gives no error, ox text "MetHb 500%: treat", line "COHb -5% | MetHb 500%".
- **Fix:** Add LIMITS spo2:[30,100], cohb:[0,80], methb:[0,90], bhb:[0,20], with names in validate().

### T10-24 · e1.js · `interp(): validate(v) runs after hco3 is calculated`
- **What:** When HCO₃⁻ is calculated from an extreme pH and PCO₂, the error names a value the user never typed: pH 6.5 with PCO₂ 5 gives "HCO₃⁻ 0.4 is outside the possible range (1–70)".
- **Evidence:** interp({pH:6.5,pco2:5}).err
- **Fix:** Validate before calculating HCO₃⁻. If the calculated value is out of range, say "pH and PCO₂ together imply an HCO₃⁻ of 0.4, which is impossible: check both".

### T10-25 · e1.js · `interp() oxygen: hyp = po2 < (patm<740 ? 75 : 80)`
- **What:** The room-air hypoxaemia threshold is 80 at sea level and a flat 75 for any pressure below 740. Abha (580, a Settings option), where a normal resident's PaO₂ is about 60–65, is always called "Hypoxaemia". The threshold also ignores age (healthy 80-year-olds run about 70–80), even though age is used for the A–a.
- **Evidence:** interp({pH:7.44,pco2:33,hco3:22,po2:62,fio2:0.21,age:30},{patm:580}) gives "Hypoxaemia with a normal A–a gradient … Hypoventilation or low inspired O₂ explains it".
- **Fix:** Base the threshold on the expected PaO₂: expected = PAO₂(at PCO₂ 40) − exAa, with hypoxaemia if po2 < expected − 10 (or a floor of 60). At altitude, word it as "low for sea level, expected for this altitude".

### T10-26 · e1.js · `interp() gap step: lactate share Math.min(100, …)`
- **What:** When lactate exceeds the gap rise, the text says lactate "accounts for ≈ 100% of the gap rise". That hides a teaching point: lactate larger than the gap rise means an uncorrected low albumin, an unmeasured cation, or a lab mismatch.
- **Evidence:** interp({pH:7.25,pco2:26,hco3:11.5,na:140,cl:112,lac:9,alb:40}): gap rise 4.5, lactate 9 → "≈ 100%".
- **Fix:** When lac > agc−agref+1, write "Lactate (9) exceeds the gap rise (4.5): check albumin, and consider a coexisting NAGMA or a low-gap process".

### T10-27 · e1.js · `interp() causes: only for HAGMA / HN / NAGMA`
- **What:** A metabolic acidosis without Na⁺/Cl⁻ (mac "?") gets no cause list at all, though glucose, lactate and BHB may have been entered. The causes array is empty.
- **Evidence:** interp({pH:7.30,pco2:30,hco3:14.5,na:140,osm:320,glu:5,urea:5}).causes gives [].
- **Fix:** For mac "?", still run the glucose, lactate, BHB and urea checks, then add "Add Na⁺ and Cl⁻ to split high-gap from normal-gap causes".

### T10-28 · e1.js · `interp() step 3 fallback branch`
- **What:** When pH is just outside range but both PCO₂ and HCO₃⁻ are within range, the fallback picks the relatively larger deviation and labels it outright. pH 7.33, PCO₂ 44 "(normal)", HCO₃⁻ 22.5 "(normal)" gives "Acute respiratory acidosis". The text says "The value that moved in the direction of the pH change is the cause", but neither value is abnormal.
- **Evidence:** interp({pH:7.33,pco2:44,hco3:22.5}) gives the label "Acute respiratory acidosis", sys d "PCO₂ 44 mmHg (normal), HCO₃⁻ 22.5 (normal)".
- **Fix:** In the fallback, word the step as "Both values are within range; the slight tilt is respiratory (PCO₂ at the upper limit)". Add an unsure note, and consider a "mild/borderline" qualifier in the label.

### T10-29 · e1.js · `interp() step 1 "Is it real?"`
- **What:** When HCO₃⁻ is left blank (the UI and engine calculate it from pH and PCO₂), the consistency check trivially passes and reports "Internally consistent", which suggests a check was made.
- **Evidence:** Interpreter with HCO₃⁻ blank: ui3 runInterp fills r1(hFrom()), and the engine shows "Internally consistent".
- **Fix:** Pass a flag (e.g. inp._hcalc) or detect it. Then show "HCO₃⁻ calculated from pH and PCO₂: consistency cannot be checked" with tone "info".

### T10-30 · e1.js · `interp() delta ratio when 24−HCO₃⁻ is tiny`
- **What:** The delta ratio is calculated and banded even when HCO₃⁻ is 22.5–23.9, where the denominator is ≤ 1.5 and the ratio is meaningless (one decimal in HCO₃⁻ swings it across bands). In the hidden-HAGMA normal-pH case it prints "2.00. 0.8–2: pure high AG acidosis".
- **Evidence:** interp({pH:7.41,pco2:37,hco3:22.5,na:140,cl:102.5,alb:40}) gives "Δ ratio = (15 − 12) ÷ (24 − 22.5) = 2.00".
- **Fix:** When 24−h < 2, skip the band and say "HCO₃⁻ barely lowered for this gap: a coexisting metabolic alkalosis is likely". That is the actual teaching point.

### T10-31 · e1.js · `rawCase(): alb random 18–28 for 20% of every case; sepsis-only low albumin`
- **What:** Low albumin is sprinkled randomly: a 22-year-old with a panic attack or a healthy pregnant woman can get albumin 18. The cirrhosis vignettes (cirr, hepen, cirrdiur, liverf) get a low albumin only 20% of the time, though hypoalbuminaemia is their norm.
- **Evidence:** rawCase line: if(lacsep|sepsisfat|apo) alb 24–32; else if(Math.random()<0.2) alb 18–28.
- **Fix:** Drive albumin from the vignette: an alb:[lo,hi] option (cirrhosis [20,30], ICU [22,32], young healthy [38,46]), with random low albumin only for elderly or inpatient vignettes.

### T10-32 · e1.js · `KINDS.rac_ac "copdx" (o:"pf")`
- **What:** The known CO₂ retainer is generated on FiO₂ 0.4–1.0 with PaO₂ up to 255, with no comment. BTS guidance is controlled oxygen with a target SpO₂ of 88–92% (Venturi 24–28%). The case shows the harm without teaching it.
- **Evidence:** p4.js: "copdx … PO2 43–255". BTS Guideline for oxygen use in adults in healthcare and emergency settings (2017).
- **Fix:** Use fio2 from [0.24,0.28,0.35] for copdx and a PaO₂ of 55–75. Or keep high FiO₂ and add "Hyperoxaemia in a CO₂ retainer: target 88–92%" to the ox text whenever pco2>45 and po2>75 on O₂.

### T10-33 · e1.js · `tests/reference.py (the engine's independent check)`
- **What:** The "independent" Python reference copies the engine rule for rule, including the 0.01 tolerances, the normal-pH tie-break at 7.40, the delta exception for chronic CO₂ retention and the h≥24 handling. So it agreed 16,086 of 16,086 times and cannot catch rule-level errors (e.g. the acute-rac/high-gap miss above). It also covers no oxygenation, venous, K⁺, co-ox, kPa or text checks, yet the Formulas footer advertises it as a separately written check.
- **Evidence:** python3 -I reference.py on a fresh 16,086-gas dump gives "0 disagreements". Diff of the classify() logic against interp() shows they are the same decision tree.
- **Fix:** Add property tests to run.js: displayed numbers agree with verdicts (band text, delta band, AG high/low), PaO₂ ≤ PAO₂ for generated cases, all kinds generate at every Settings altitude/agref, venous AG uses the measured HCO₃⁻. Extend reference.py to the oxygenation and venous rules. Also have the reference written from the textbook rules (e.g. Berend NEJM 2014), not from e1.js.

## Polish

### T10-34 · e1.js · `interp() oxygen and compensation text in kPa mode`
- **What:** kPa mode mixes units in one card. "PAO₂ = 0.40 × (760 − 47) − 25/0.8 = 33.9" has mmHg operands and a kPa result. The ox headline says "(P/F 263)" (mmHg) while the text says "P/F = 35.0 kPa". Winter shows "= 24.5 ± 2 → expected PCO₂ 3.0–3.5 kPa" without stating that 24.5 is mmHg.
- **Evidence:** S.units="kPa"; interp({pH:7.24,pco2:25,hco3:11,po2:105,fio2:0.4,age:30,na:140,cl:105,alb:40}) (p2.js).
- **Fix:** In kPa mode write the alveolar equation in kPa (FiO₂ × (P_atm−6.3 kPa) − PaCO₂/0.8, all P()), label mmHg intermediates "(mmHg)", and show P/F in the same unit in v, d and the summary line.

### T10-35 · e1.js · `interp() oxygen: P(Aa) for negative values`
- **What:** A negative A–a prints with an ASCII hyphen ("A–a = -30", "-3"), while the rest of the app uses the true minus sign (BE "−0.4").
- **Evidence:** interp({pH:7.40,pco2:40,hco3:24,po2:130,fio2:0.21,age:30}).
- **Fix:** Format with a helper that maps "-" to "−" (or reuse sgn()).

### T10-36 · e1.js · `interp() oxygen: COHb > 3 text`
- **What:** "COHb 5%: carbon monoxide exposure" is said for any COHb above 3%, but smokers commonly run 3–10%. The wording overcalls exposure in smokers.
- **Evidence:** Code: cohb>3 gives "carbon monoxide exposure", and >10 adds "(significant)". Reference: smokers up to ~10% (e.g. RCEM/TOXBASE CO guidance).
- **Fix:** Say "COHb 5%: raised (smokers up to ~10%); CO exposure if non-smoker or symptomatic". Keep the >10% wording.

### T10-37 · e1.js · `interp() oxygen: Berlin ARDS sentence`
- **What:** The ARDS sentence appears for any FiO₂ > 0.22 with P/F ≤ 300, including nasal cannula at 0.28. The step text omits the PEEP/CPAP ≥ 5 requirement, which appears only in the Formulas table.
- **Evidence:** interp({pH:7.40,pco2:40,hco3:24,po2:75,fio2:0.28,age:70}) gives "Berlin ARDS: mild".
- **Fix:** Append "(Berlin needs PEEP/CPAP ≥ 5; the 2023 global definition also accepts high-flow nasal oxygen ≥ 30 L/min)".

### T10-38 · e1.js · `interp() oxygen: "(expected ≤ X for age)" printed on supplemental O₂`
- **What:** On oxygen the room-air A–a expectation is still printed ("A–a = 115 (expected ≤ 11 for age 30)"), right before "A–a widens on oxygen, so use the P/F here".
- **Evidence:** interp({…po2:105,fio2:0.4,age:30}).
- **Fix:** Omit the "(expected ≤ …)" clause when f>0.22.

### T10-39 · e1.js · `interp() step 2 title "Acid or alkali?"`
- **What:** "Alkali" is a substance, not a blood state. The step result says "Acidaemia/Alkalaemia".
- **Evidence:** Step t string.
- **Fix:** Rename to "Acidaemia or alkalaemia?".

### T10-40 · e1.js · `uncertain(): "within 0.0 mmHg of the edge"`
- **What:** When the PCO₂ sits exactly on the band edge, the note reads "Compensation is within 0.0 mmHg of the edge".
- **Evidence:** Venous COHb example (p1.js): measured 40, hi 40.
- **Fix:** If m<0.05, say "sits exactly on the edge of the expected band".

### T10-41 · e1.js · `buildLabel() for rq "ac"`
- **What:** The label commits to "Acute-on-chronic respiratory acidosis" while the step text admits "acute-on-chronic, or 1–2 days old".
- **Evidence:** REFCASE "COPD exacerbation".
- **Fix:** Label "Respiratory acidosis, partly compensated (acute-on-chronic or 1–2 days)", or keep the label and add the alternative to the summary line.

### T10-42 · e1.js · `interp() venous: pc=Math.max(10,pc-5)`
- **What:** The venous PCO₂ floor of 10 quietly breaks the stated "PCO₂ −5" rule. VBG PCO₂ 12 becomes "estimated arterial 10", with no explanation.
- **Evidence:** interp({sample:"v",pH:7.6,pco2:12,hco3:11.5}) gives "PCO₂ 10 mmHg (low)".
- **Fix:** Mention "(floored at 10)" in the venous note when the clamp applies.

### T10-43 · e1.js · `interp() ralk compensation: c=24−5d unbounded`
- **What:** The chronic respiratory alkalosis prediction has no floor. PCO₂ 10 predicts a chronic HCO₃⁻ of 9, whereas renal compensation rarely takes HCO₃⁻ below about 12–15. Very low HCO₃⁻ values are then called "Chronic, renally compensated" instead of an added metabolic acidosis.
- **Evidence:** interp({sample:"v",pH:7.6,pco2:12,hco3:11.5}) gives "Chronic, renally compensated … chronic ≈ 9. Measured 10.5."
- **Fix:** Clamp c to ≥ 12 (and Winter's expected PCO₂ to ≥ 10), and say "near the physiological floor".

### T10-44 · e1.js · `CAUSES.uraem; KINDS.malk "mtx" (o:"n")`
- **What:** CAUSES.uraem ("Advanced kidney failure") is never used by any KINDS variant (a dead entry, and a missing classic HAGMA case). The massive-transfusion trauma patient is generated breathing room air with a normal PaO₂, which is unrealistic after 18 units.
- **Evidence:** grep: "uraem" appears only in CAUSES. mtx variant {o:"n"}.
- **Fix:** Add a uraem variant to hagma (urea 30–50, lac 1–2, HCO₃⁻ 12–18). Give mtx o:"pf".

### T10-45 · e1.js · `interp() step 3: normal pH tie-break at 7.40`
- **What:** With a normal pH and both values moved the same way, a 0.01 change in pH flips the whole read. pH 7.40 / 25 / 15.2 gives "Chronic respiratory alkalosis", while 7.39 / 25 / 15.2 gives "Metabolic acidosis + respiratory alkalosis". No uncertainty note warns about this.
- **Evidence:** Engine branch: highC&&highH → pH<7.4?R:M; lowC&&lowH → pH<7.4?M:R.
- **Fix:** Add an unsure() note when |pH−7.40| ≤ 0.02 in that branch: "Which process is primary cannot be told from the gas; the history decides".

## Ideas (ranked by value)

1. **T10-46** (`interp() gap step`, e1.js): Show the "corrected bicarbonate" (HCO₃⁻ + (AGc − ref)) next to the delta ratio. It is the same information, but many learners find it more intuitive (> 26 hidden alkalosis, < 22 hidden NAGMA), and it avoids the tiny-denominator problem. *Basis:* Common bedside alternative to the delta ratio (e.g. LITFL "Delta ratio"). *How:* Add one line: "Corrected HCO₃⁻ = h + (agc − agref) = X → …".
2. **T10-47** (`run.js / genCase`, e1.js): Add generator invariant tests over every Settings combination (agref 4–16, patm 760/707/580, usek on/off, venous, strict): non-null rate, PaO₂ ≤ PAO₂, per-cause physiological ranges, vignette numbers matching the generated labs. *Basis:* Findings above show three generator failures that only appear outside the default Settings. *How:* A loop in tests/run.js; fail if any kind generates in fewer than 90% of calls or any invariant breaks.
3. **T10-48** (`interp() oxygen`, e1.js): For venous samples on oxygen, use SpO₂/FiO₂ (S/F) when SpO₂ is entered: S/F ≤ 315 corresponds roughly to P/F ≤ 300 and is accepted in the 2023 global ARDS definition. The VBG card then still says something useful about oxygenation. *Basis:* Matthay et al., Am J Respir Crit Care Med 2024 (global ARDS definition). *How:* If ven && spo2 && fio2 and spo2 ≤ 97: S/F = spo2/fio2, show the bands.
4. **T10-49** (`interp() oxygen`, e1.js): Show the age-expected PaO₂ (≈ 100 − age/3 mmHg at sea level, or from PAO₂ − expected A–a) so a "normal for 80" PaO₂ of 75 is not called hypoxaemia. *Basis:* Commonly taught approximation. *How:* Add to the ox text and use it for the hypoxaemia threshold.
5. **T10-50** (`interp() comp step in kPa`, e1.js): In kPa mode, give the kPa forms of the rules (Winter: PCO₂ kPa ≈ 0.2 × HCO₃⁻ + 1.1 ± 0.3; 1.33 kPa per 10 mmHg). A UK/MRCEM user then sees the numbers they will use in the exam. *Basis:* MRCEM and UK practice use kPa. *How:* Branch on S.units in the comp text.
6. **T10-51** (`interp() step 1`, e1.js): Accept 3-decimal pH and an analyser "tCO₂" field separately. Many printouts show both cHCO₃ and tCO₂; using tCO₂ for the gap and cHCO₃ for Henderson avoids false "inconsistent" flags. *Basis:* Analyser printouts list both. *How:* New optional field tco2; prefer it for the AG when present.
7. **T10-52** (`genCase`, e1.js): Add more normal-pH mixed cases (e.g. DKA + vomiting at pH 7.40, COPD + diuretic at 7.40, salicylate early at 7.42). These are the classic exam traps, and the engine already supports them. *Basis:* hag_malk gives 37% normal-pH cases; other mixed kinds rarely do. *How:* New kinds or a normalPH option that targets pH 7.36–7.44.
8. **T10-53** (`interp() AG`, e1.js): Offer the Figge albumin correction (×0.25 per g/L) and, for ICU, a Stewart strong-ion-difference/SIG panel when Mg, phosphate and lactate are entered. The app has a full ICU course, which pairs with this. *Basis:* Figge 1998; Stewart approach. *How:* Optional "Stewart view" behind a toggle.

## Verified correct (no action)

- Henderson [H⁺] = 24×PCO₂/HCO₃⁻ vs 10^(9−pH), 10% flag; REFCASE transcription error flagged.
- Winter 1.5×HCO₃⁻+8±2, MALK 0.7×HCO₃⁻+20±5, RAC 1/4 per 10, RALK 2/5 per 10 with ±2: arithmetic correct; boundaries applied consistently with reference.py (0 of 16,086 disagreements).
- AG albumin correction (+2.5 per 10 g/L) correct at albumin 10 and 60; K⁺ adds 4 to the reference when included.
- SBE = 0.93×(HCO₃⁻−24.4+14.8×(pH−7.4)) is the standard Van Slyke form.
- PAO₂ = FiO₂×(Patm−47)−PaCO₂/0.8 correct; P/F correct; type 1/2 failure at < 60 mmHg correct.
- Venous float edges (7.32+0.03, 7.42+0.03) classify as normal, matching the displayed 7.35/7.45.
- No crash for null input, string, NaN, Infinity, pH 6.5–8.0, PCO₂ 5–200, venous PCO₂ < 15; all produce a sensible error or read.
- Level labels (L1 four broad labels, L2 adds acute/chronic, L3+ adds HAGMA/NAGMA) match targetLabel; every generated case re-interprets to its label at default Settings (run.js 132/132).
