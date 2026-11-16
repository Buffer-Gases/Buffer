# T07 · clin-2 · Clinical lessons (arrest, opioid, heat, co, methb, preg, rhabdo, etoh, drugacid, gib, kids)

**Covered:** all 11 lessons in Module 10 part 2: every body statement, key number, hook, the 5 questions each (options, keys, explanations, incl. c8.js XQ copies), the 7 worked gases (Henderson–Hasselbalch, AG, Δ ratio, A–a, and what `interp()` says about them), the source lists (c5.js), and rendering at 390×844 pixel/dark and 1280×800 clinical/light (all 55 questions answered; completion and XP work; no console errors besides the offline font fetch).

**Verdict:** clinically strong and mostly current; keyed answers are all correct. The worked gases are internally consistent (HH within 0.01 except rhabdo). The serious problems are in what the interpreter says about the CO and MetHb examples (tells you to turn oxygen down in CO poisoning), one old thiamine-before-glucose teaching, a wrong pulse-oximetry mechanism, a missing methylene blue serotonin warning, and thin sourcing for arrest/heat/etoh/altitude. **Score: 7.5/10.**

Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T07-phone-*.png, T07-desk-{co,drugacid,kids}.png, T07-phone-drugacid-table.png

## Critical

**T07-1** · `e1.js` · interp() oxygen step, line ~166 (lesson co worked gas → Open in the Interpreter)  
For the CO lesson's own worked gas (COHb 24%, PaO2 420 on FiO2 0.8) the interpreter says 'Hyperoxaemia: titrate oxygen down to target.' In CO poisoning the treatment is 100% (high-flow) oxygen until COHb is low and symptoms have gone; titrating down shortens nothing but lengthens COHb elimination. The same advice appears for the MetHb example (MetHb 28%, SpO2 85%), where SpO2-based titration is meaningless.  
*Evidence:* node: interp(L.find(l=>l.id==='co').ex).steps ox.d → '... Hyperoxaemia: titrate oxygen down to target. COHb 24%: carbon monoxide exposure (significant).' Weaver LK, NEJM 2009;360:1217 (100% O2 until COHb normal/symptom-free).  
*Fix:* In e1.js, skip the hyperoxaemia sentence when cohb>3 (or >10 in smokers) or methb>1.5. Replace with: 'COHb raised: keep 100% oxygen (non-rebreather or via ventilator) until COHb < 3–5% and symptoms resolve; consider HBO.' For MetHb: 'SpO2 is unreliable with MetHb; do not titrate O2 to SpO2.'

## Major

**T07-2** · `e1.js` · summaryLine()/ox verdict for dyshaemoglobins (co, methb worked gases)  
The one-line impression for the MetHb example reads 'Normal acid–base. Oxygenation: adequate oxygenation on supplemental O₂.' and for CO 'adequate oxygenation on supplemental O₂', even though 28% of Hb (MetHb) or 24% (COHb) cannot carry oxygen. The COHb/MetHb text only sets tone='bad' in the detail; the verdict (vv) and the summary line ignore it.  
*Evidence:* node: interp(methb ex).line → '... MetHb 28%. Impression: Normal acid–base. Oxygenation: adequate oxygenation on supplemental O₂.'  
*Fix:* When cohb>10 or methb>10, set vv to 'PaO₂ adequate, but O₂ content reduced: COHb x% / MetHb x%' and add that phrase to the Impression in summaryLine(). Also push a cause line for CO with lactate > 8: 'smoke exposure: consider cyanide (hydroxocobalamin)'.

**T07-3** · `c4.js` · etoh: body 'Thiamine before glucose' + question 'glucose-containing fluid is given after…' explanation  
Explanation 'Glucose first can precipitate Wernicke encephalopathy' teaches a contested dogma that can delay glucose in a hypoglycaemic drinker (AKA glucose is 'normal or low' per the same lesson). Current EM teaching: give thiamine with or before glucose when practical, but never delay glucose for a hypoglycaemic patient; a single glucose load does not acutely precipitate Wernicke's.  
*Evidence:* Schabelman E, Kuo D. Glucose before thiamine for Wernicke encephalopathy: a literature review. J Emerg Med 2012;42:488–494. RCEM/BTS teaching: treat hypoglycaemia immediately.  
*Fix:* Body: 'Give IV thiamine (e.g. Pabrinex) with or before glucose, but never delay glucose if the patient is hypoglycaemic.' Question explanation: 'Thiamine is given first or alongside because glucose metabolism uses thiamine; if hypoglycaemic, give glucose at once and thiamine immediately after.' Add Schabelman 2012 to SRC/LSRC.etoh.

**T07-4** · `c3.js` · methb: question 'Oxygen therapy in methaemoglobinaemia…' explanation (c8.js XQ.methb also)  
Explanation 'Methaemoglobin cannot carry oxygen, so the reading stays near 85%' gives the wrong mechanism. The ≈85% plateau is optical: MetHb absorbs equally at 660 and 940 nm, driving the red/infrared ratio towards 1, which the oximeter maps to ≈85%. Oxygen does raise dissolved O2 (PaO2 210 in the example) but the pulse oximeter cannot see it.  
*Evidence:* Ash-Bernal 2004 (already cited); Barker SJ, Tremper KK, Anesthesiology 1989;70:112 (MetHb and pulse oximetry).  
*Fix:* Change to: 'MetHb absorbs red and infrared light equally, so the oximeter reads about 85% whatever the true saturation; extra oxygen raises PaO₂ but barely moves the reading.' Fix in both c3.js (lesson q) and c8.js XQ.methb.

**T07-5** · `c3.js` · methb: body 'Treat: … methylene blue 1–2 mg/kg IV…'  
No warning about serotonin toxicity: methylene blue is a potent MAO-A inhibitor and can cause serotonin syndrome with SSRIs, SNRIs, clomipramine, linezolid etc. This is a regulator-level warning and very relevant in overdose patients. Also missing: give over 5 minutes, may repeat once after 30–60 min, and lower thresholds (treat at lower MetHb) in anaemia, cardiac or lung disease.  
*Evidence:* FDA Drug Safety Communication 26/07/2011 (methylene blue and serotonergic drugs); Iolascon A, et al. Recommendations for diagnosis and treatment of methemoglobinemia. Am J Hematol 2021;96:1666–1678.  
*Fix:* Add bullet: 'Methylene blue is an MAO inhibitor: serotonin syndrome risk with SSRIs/SNRIs and other serotonergic drugs. Give 1–2 mg/kg IV over 5 min; repeat once after 30–60 min if needed. Treat at lower levels if anaemic or with cardiac or lung disease.' Add Iolascon 2021 to SRC and LSRC.methb.

**T07-6** · `c5.js` · LSRC.arrest (lesson arrest)  
Post-ROSC targets (PaCO2 35–45, SpO2 94–98%, ETCO2 < 10 mmHg at 20 min, bicarbonate only for hyperkalaemia/TCA) come from ERC/ESICM guidance but the only lesson-specific source is Kraut & Madias 2014 (lactic acidosis). 'Cite everything' roadmap rule broken for the core numbers.  
*Evidence:* Sources panel on arrest shows Berend 2014, Kraut 2010, Kraut 2014 only (run: openLesson('arrest'), expand Sources).  
*Fix:* Add to SRC: nolan21: 'Nolan JP, Sandroni C, Böttiger BW, et al. European Resuscitation Council and European Society of Intensive Care Medicine guidelines 2021: post-resuscitation care. Resuscitation 2021;161:220–269.' and soar21: 'Soar J, et al. ERC Guidelines 2021: Adult advanced life support. Resuscitation 2021;161:115–151.' Set LSRC.arrest=['nolan21','soar21','kraut14'].

**T07-7** · `c5.js` · LSRC.heat (lesson heat)  
Heat stroke definition, cooling priority and gas evolution are sourced only to Foster 2001 (respiratory alkalosis). No heat-illness source at all.  
*Evidence:* Sources panel on heat: Berend, Kraut 2010, Foster 2001.  
*Fix:* Add: 'Epstein Y, Yanovich R. Heatstroke. N Engl J Med 2019;380:2449–2459.' and 'Bouchama A, et al. Classic and exertional heatstroke. Nat Rev Dis Primers 2022;8:8.' and 'Roberts WO, et al. ACSM expert consensus statement on exertional heat illness. Curr Sports Med Rep 2023;22:134–149.' LSRC.heat=[those, 'foster01'].

**T07-8** · `c4.js` · drugacid: metformin row, keys 'MALA dialysis'  
EXTRIP 2015 is quoted but merges two strengths of recommendation: dialysis is RECOMMENDED for lactate > 20 mmol/L, pH ≤ 7.0, or failure of standard therapy; it is only SUGGESTED for lactate 15–20, pH 7.0–7.1, shock, decreased consciousness or liver failure. EXTRIP is also not in the source list.  
*Evidence:* Calello DP, et al. Extracorporeal treatment for metformin poisoning: systematic review and recommendations from the EXTRIP workgroup. Crit Care Med 2015;43:1716–1730.  
*Fix:* Row text: 'EXTRIP 2015: dialysis recommended if lactate > 20, pH ≤ 7.0 or standard care fails; suggested if lactate 15–20, pH 7.0–7.1, shock, reduced consciousness or liver failure.' Add calello15 to SRC and LSRC.drugacid.

## Minor

**T07-9** · `c3.js` · co: sum 'assume cyanide too if lactate is above 8', key 'Lactate > 8 in smoke', body bullet  
The validated threshold in fire victims is lactate > 10 mmol/L (Baud 1991: sens 87%, spec 94%, PPV 95% for blood CN > 40 µmol/L). The ≥ 8 cut-off comes from pure cyanide poisoning (Baud 2002), not smoke. 'Assume' is also stronger than the evidence.  
*Evidence:* Baud FJ, et al. N Engl J Med 1991;325:1761–1766 (confirmed via UMEM pearl #3156); Baud FJ, et al. Crit Care Med 2002;30:2044.  
*Fix:* Write: 'In smoke inhalation, lactate ≥ 10 mmol/L (some use ≥ 8) with coma, shock or arrest → suspect cyanide and give hydroxocobalamin 5 g IV (70 mg/kg in children).' Key: 'Lactate ≳ 8–10 in smoke'. Add baud91 to SRC/LSRC.co.

**T07-10** · `c3.js` · arrest: body ETCO2 bullet  
'Persistently below about 10 mmHg after 20 minutes is a poor sign' lacks the ERC 2021 caveat that ETCO2 must not be used alone to stop resuscitation. Also no mention of avoiding hypoxaemia (ERC: avoid PaO2 < 8 kPa / 60 mmHg) alongside hyperoxia; the worked gas itself shows PaO2 72 on FiO2 1.0, which the body never discusses.  
*Evidence:* Soar J et al. ERC 2021 ALS, Resuscitation 2021;161:115 ('low ETCO2 after 20 min associated with poor outcome; do not use alone'). Nolan 2021 post-resuscitation: titrate to 94–98%, avoid hypoxaemia.  
*Fix:* Append: '…a poor sign, but never a reason on its own to stop.' Add bullet: 'Avoid hypoxaemia as much as hyperoxia: the example (PaO₂ 72 on FiO₂ 1.0, P/F 72) needs PEEP and a look for aspiration or oedema, not less oxygen.'

**T07-11** · `c3.js` · opioid: q2 'Same patient, PaO₂ 30…' explanation  
Explanation relies on 'expected ≈ 11 for a young adult' but neither stem gives an age (Q1 says only 'Overdose, room air, sea level'). The app's own rule age/4+4 needs the age.  
*Evidence:* Lesson opioid q[0], q[1] text.  
*Fix:* Q1 stem: 'Overdose, 28 years old, room air, sea level: PaCO₂ 80, PaO₂ 45. A–a?' Keep Q2 explanation: 'expected ≤ 11 (28/4 + 4)'.

**T07-12** · `c3.js` · opioid: worked gas ex.po2 52  
PaCO2 78, PaO2 52 on air gives A–a exactly 0, which is physiologically implausible (a healthy young adult has 5–10) and weakens the teaching of 'normal A–a' (it looks like a contrived zero).  
*Evidence:* interp: PAO₂ = 0.21×713 − 78/0.8 = 52; A–a = 0.  
*Fix:* Set ex.po2 to 45 (A–a 7, still normal for age 27).

**T07-13** · `c3.js` · opioid: title 'Opioid and sedative overdose'  
Sedatives are in the title but nothing on benzodiazepines or flumazenil (not routinely recommended: seizure risk in mixed/TCA overdose and benzodiazepine dependence), and no naloxone dosing.  
*Evidence:* Lesson body (4 bullets, none on benzodiazepines).  
*Fix:* Add: 'Naloxone 100–400 micrograms IV titrated to breathing, not to full alertness (UK: 400 mcg IM/IV, repeat). Flumazenil is not routine: seizures in mixed or TCA overdose and in dependence.' Add a toxicology source (e.g. Boyer EW. Management of opioid analgesic overdose. N Engl J Med 2012;367:146–155).

**T07-14** · `c3.js` · opioid: q3 option 'Improve SpO₂ while hypoventilation worsens'  
Supplemental O2 does not make opioid hypoventilation worse (that is the COPD/hypoxic-drive story). The point is that SpO2 masks rising CO2.  
*Evidence:* XQ.opioid / lesson q[2].  
*Fix:* Option: 'Keep SpO₂ normal while CO₂ keeps rising unseen'. Explanation: 'Oxygen hides hypoventilation from the oximeter; watch RR, ETCO₂ or a gas.'

**T07-15** · `c3.js` · heat: body  
Says 'cooling comes before investigation' but gives no method or target. For an ER doctor the actionable numbers are: cold-water immersion (or best available: ice-water towels, evaporative), cool to ≈ 38.5–39 °C within 30 minutes ('cool first, transport second'), stop at 38.5–39 to avoid overshoot. Also the definition should note that core temperature may be < 40 °C if cooling began pre-hospital.  
*Evidence:* Roberts WO et al. ACSM consensus 2023; Epstein & Yanovich NEJM 2019.  
*Fix:* Add a 'Cooling' bullet with the method, target and rate (≥ 0.15 °C/min with immersion), and to the definition: '(may be lower if cooling has already started)'.

**T07-16** · `c3.js` · heat: 'hyponatraemia in exertional hyponatraemia from overdrinking'  
Tautological wording; the accepted term is exercise-associated hyponatraemia (EAH).  
*Evidence:* Lesson heat body, Points list.  
*Fix:* 'Hyponatraemia in exercise-associated hyponatraemia (EAH) from drinking too much hypotonic fluid.'

**T07-17** · `c3.js` · co: body HBO bullet  
HBO indications are listed as if settled. Evidence is mixed (Weaver 2002 RCT positive, Scheinkestel 1999 negative; Cochrane 2011 insufficient evidence), and severe acidosis (pH < 7.1) is a commonly listed criterion that is missing. Normal COHb values (non-smoker < 3%, smoker up to ~10%) are also absent, though the slip flags COHb > 3.  
*Evidence:* Buckley NA et al. Cochrane Database Syst Rev 2011;CD002041; Weaver LK et al. N Engl J Med 2002;347:1057.  
*Fix:* Add: '…or severe acidosis (pH < 7.1). Evidence is mixed; discuss with the regional hyperbaric unit.' and 'Normal COHb < 3% (smokers up to 10%).'

**T07-18** · `c3.js` · methb: q 'Methylene blue is contraindicated in… G6PD deficiency'  
G6PD deficiency is a relative contraindication (MB may be ineffective and cause haemolysis; low-dose MB is sometimes still used when deficiency is unknown or partial). 'Contraindicated' is acceptable for an exam answer but the body says it 'does not work', which is too absolute.  
*Evidence:* Iolascon 2021 Am J Hematol.  
*Fix:* Body: 'may not work and can cause haemolysis'. Question stem: 'Methylene blue should be avoided in…'.

**T07-19** · `c4.js` · etoh: body osmolar gap 'about 1 mOsm per 4.6 mg/dL'  
4.6 is the theoretical factor; Purssell 2001 (already in SRC as purssell01) showed 3.7 fits measured data better (ethanol contributes ~1.25× its molar value). The app's units are mmol/L, so the mg/dL factor is also the less useful form.  
*Evidence:* Purssell RA, et al. Ann Emerg Med 2001;38:653–659. Same 4.6 appears in c2.js line 265.  
*Fix:* 'ethanol raises it: about 1.25 mOsm per mmol/L of ethanol (1 per 3.7 mg/dL; Purssell 2001)'. Add purssell01 to LSRC.etoh; change c2.js line 265 the same way.

**T07-20** · `c4.js` · etoh: refeeding bullet 'Start low (as little as 10 kcal/kg/day in the highest risk)'  
NICE CG32 says start at a maximum of 10 kcal/kg/day in high-risk patients and 5 kcal/kg/day in extreme cases (BMI < 14 or negligible intake > 15 days). 'As little as 10' implies 10 is the floor. The criteria list also omits the 'two or more of' minor criteria (BMI < 18.5, weight loss > 10%, little intake > 5 days, alcohol/drug history).  
*Evidence:* NICE CG32 Nutrition support for adults, 1.6 (updated 2017).  
*Fix:* 'Start at no more than 10 kcal/kg/day (5 kcal/kg/day if BMI < 14 or almost no intake for > 15 days)'. Add the 'two or more' criteria line. Add NICE CG32 to SRC/LSRC.etoh (it is named in the body but not cited).

**T07-21** · `c5.js` · LSRC.etoh  
No source for alcoholic ketoacidosis itself; listed sources are toxic alcohols and lactic acidosis.  
*Evidence:* Sources panel on etoh.  
*Fix:* Add 'McGuire LC, Cruickshank AM, Munro PT. Alcoholic ketoacidosis. Emerg Med J 2006;23:417–420.' plus NICE CG32 and Purssell 2001.

**T07-22** · `c3.js` · preg: body 'Lower bicarbonate means less buffer: DKA in pregnancy is more rapid and can occur at lower glucose.'  
Conflates two mechanisms. Less buffer explains faster acidosis; the lower glucose comes from fetoplacental glucose uptake, higher GFR (glycosuria) and accelerated starvation ketosis, not from the low bicarbonate.  
*Evidence:* Lesson preg body; Hegewald 2011.  
*Fix:* 'Lower bicarbonate means less buffer, so DKA develops faster; fetal glucose uptake means it can occur at near-normal glucose (euglycaemic DKA).'

**T07-23** · `c3.js` · preg: q 'Why aim for maternal SpO₂ of 95% or more?'  
The 95% target is tested but never taught in the body.  
*Evidence:* Body has no SpO₂ target.  
*Fix:* Add to Pregnancy list: 'Keep SpO₂ ≥ 95% (PaO₂ > 70 mmHg): the fetus sits on the steep part of its own curve.'

**T07-24** · `c5.js` · LSRC.preg  
Altitude half of the lesson (Riyadh, Abha values, acetazolamide) has no source.  
*Evidence:* Sources panel on preg shows Hegewald only.  
*Fix:* Add e.g. 'Luks AM, Swenson ER, Bärtsch P. Acute high-altitude sickness. Eur Respir Rev 2017;26:160096.' and a reference for blood gases at moderate altitude (e.g. Crapo RO et al. Am J Respir Crit Care Med 1999;160:1525, arterial gases at 1,400 m).

**T07-25** · `c4.js` · drugacid: table  
Common modern culprits are missing from a table called 'Drugs that make acid': SGLT2 inhibitors (euglycaemic DKA, the most common one an ER doctor will meet), isoniazid and iron (lactic, with seizures/shock), nitroprusside (cyanide), amphotericin and ifosfamide (RTA), trimethoprim, spironolactone, ACE inhibitors/ARBs, NSAIDs (type 4 RTA, hyperkalaemic NAGMA).  
*Evidence:* c1.js already teaches SGLT2 euglycaemic DKA (line 223); drugacid table does not link it.  
*Fix:* Add rows: 'SGLT2 inhibitors | Ketotic HAGMA, glucose may be < 14 | See DKA lesson; check ketones', 'Isoniazid, iron | Lactic HAGMA | Seizures (isoniazid: pyridoxine)', 'Amphotericin, ifosfamide | NAGMA (RTA)', 'Trimethoprim, spironolactone, ACEi/ARB, NSAIDs | NAGMA with high K⁺ | Type 4 picture'.

**T07-26** · `c5.js` · LSRC.gib  
Massive-transfusion chemistry (citrate, iCa, potassium) and the trauma TXA ≤ 3 h statement have no source; only Kraut 2014 and HALT-IT.  
*Evidence:* Sources panel on gib.  
*Fix:* Add 'CRASH-2 collaborators. Lancet 2010;376:23–32 / 2011;377:1096–1101 (TXA ≤ 3 h)' and 'Rossaint R, et al. The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition. Crit Care 2023;27:80' (iCa monitoring and replacement).

**T07-27** · `c4.js` · kids: q 'A typical gas in severe bronchiolitis is…'  
Bronchiolitis is tested but not mentioned in the body.  
*Evidence:* kids body has no bronchiolitis line.  
*Fix:* Add bullet: 'Bronchiolitis and asthma: a normal or rising PCO₂ in a tachypnoeic infant means tiring; capillary PCO₂ > 50–55 mmHg with acidosis needs escalation (HFNC/CPAP).'

**T07-28** · `c4.js` · kids: body 'Normal values'  
The brief and APLS teach age-specific norms; the lesson gives one line. Neonates also run a lower PaCO2 and a lower pH in the first hours, and PaO2 on air is lower in newborns (60–90 mmHg). The 'infant HCO₃⁻ 20–22' figure is reasonable but stated as a point; reference texts give ranges (e.g. ≈ 18–24 in neonates, 20–24 in infants). Doubt: exact values vary by laboratory/text.  
*Evidence:* APLS (current ed.); Harriet Lane Handbook, blood gas norms.  
*Fix:* Add a small table: newborn / infant / child / adult for pH, PaCO₂, HCO₃⁻, PaO₂ (air), citing APLS; keep the key '≈ 20–22' but call it 'about 20–24 (lower in neonates)'.

## Polish

**T07-29** · `c4.js` · rhabdo: worked gas pH 7.30  
HCO3 14.2 / PCO2 30 give pH 7.288 by Henderson–Hasselbalch (the slip's own check shows 51 vs 50 nmol/L).  
*Evidence:* node: 6.1+log10(14.2/(0.0307×30)) = 7.288.  
*Fix:* Set ex.pH to 7.29 (or hco3 to 14.6).

**T07-30** · `c4.js` · etoh: hook 'four processes' vs sum 'three disorders'  
Hook counts four processes (starve, drink, vomit, breathe fast) while summary and body say triple disorder. Reads as a contradiction to a learner.  
*Evidence:* etoh sum / hook.  
*Fix:* Hook: 'Starve and drink (ketoacid), vomit (alkali), breathe fast (CO₂ down): three disorders, one nearly normal pH.'

**T07-31** · `c4.js` · gib: q 'Tranexamic acid in GI bleeding' explanation  
HALT-IT showed more venous thromboembolic events (and seizures), not arterial events; 'thromboembolic' is imprecise.  
*Evidence:* HALT-IT, Lancet 2020;395:1927 (VTE 0.8% vs 0.4%).  
*Fix:* 'HALT-IT: no fall in deaths, and more venous thromboses and seizures.'

**T07-32** · `c3.js` · arrest: q 'Ideal PaCO₂ after ROSC?' options  
Options '25–30', '35–45', '50–60' have no units; with kPa as an option in Settings they are ambiguous.  
*Evidence:* arrest q[1].  
*Fix:* Use '35–45 mmHg (4.7–6.0 kPa)' style labels or route through the unit formatter.

**T07-33** · `c5.js` · MSRC.clin  
Every clinical lesson inherits Kraut 2010 (metabolic acidosis) and Berend 2014, so CO, MetHb, opioid and pregnancy lessons show 'Metabolic acidosis: pathophysiology…' as a source for content it does not support.  
*Evidence:* Sources panels on methb, preg, opioid.  
*Fix:* Make MSRC.clin = ['berend14'] only and add kraut10 to LSRC for the lessons that need it.

**T07-34** · `shell.html` · .tw table in drugacid at 390 px  
On phone the 3-column table is 420 px in a 306 px box; the 'Key point' column (the actual teaching) shows only ~55 px before clipping, with no visible scroll cue.  
*Evidence:* /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T07-phone-drugacid-table.png  
*Fix:* Below 600 px render .tbl rows as stacked cards (Drug as heading, Gas and Key point beneath), or add a right-edge fade/scroll hint on .tw.

## Ideas (ranked by value)

**T07-35** · `c4.js` · etoh, drugacid, gib, kids (no ex)  
4 of the 11 lessons have no worked gas, though they are the most gas-rich topics.  
*Evidence:* Lessons have no ex field.  
*Fix:* Add worked gases: AKA triple disorder (pH 7.41, PCO₂ 34, HCO₃⁻ 22, Na 138, Cl 90, BHB 6); MALA (pH 6.95, lactate 18, creatinine high); post-massive-transfusion (HCO₃⁻ 33, iCa 0.9); pyloric stenosis (pH 7.52, PCO₂ 44, HCO₃⁻ 34, Cl 88, K 3.0).

**T07-36** · `c3.js` · preg  
The interpreter labels the pregnancy example 'chronic respiratory alkalosis'; the lesson should say so explicitly and teach that this is the expected reading.  
*Evidence:* interp(preg ex) → 'Primary respiratory alkalosis; chronic, renally compensated'.  
*Fix:* Add a sentence: 'The interpreter will call this compensated respiratory alkalosis; in pregnancy that is normal.' Longer term: a 'pregnant' toggle in the interpreter that shifts reference ranges.

**T07-37** · `c3.js` · heat ex  
Add temp 41.5 to the heat worked gas so the slip shows temperature and the alpha-stat point is visible.  
*Evidence:* Slip shows 37.0 °C.  
*Fix:* ex.temp=41.5 and a line in the slip: 'reported at 37 °C (alpha-stat)'.

**T07-38** · `e1.js` · interp causes for CO  
When COHb raised and lactate > 8, add 'smoke: consider cyanide (hydroxocobalamin 5 g)' to causes.  
*Evidence:* CO example causes list only generic lactic acidosis.  
*Fix:* Push the line in the causes block when v.cohb>3 && v.lac>8.

**T07-39** · `c3.js` · co  
Occupational angle for a Qiddiya OH/ER doctor: methylene chloride (paint stripper) is metabolised to CO with delayed and prolonged COHb rise.  
*Evidence:* Not in body.  
*Fix:* Add to Sources bullet: 'methylene chloride paint strippers (CO made in the liver, rises late)'.

**T07-40** · `c4.js` · kids DKA  
Mention PECARN FLUID (already cited): fluid rate and sodium content did not change brain injury rates, so the fear of fluids should not cause under-resuscitation.  
*Evidence:* Kuppermann 2018 cited but not used in body.  
*Fix:* Add one line after 'Fluids are calculated carefully'.

**T07-41** · `c4.js` · kids pyloric stenosis  
Give the usual pre-op targets: Cl ≥ 100 mmol/L, HCO₃⁻ < 28, K normal.  
*Evidence:* Body says 'corrected' only.  
*Fix:* Add targets with a source (e.g. APLS/BAPS).

**T07-42** · `c4.js` · gib  
Add the restrictive transfusion threshold (Hb 70 g/L, 80 with cardiac disease; Villanueva 2013 NEJM) and an iCa target (> 1.1 mmol/L) during massive transfusion.  
*Evidence:* Not in body.  
*Fix:* One bullet each, with sources.
