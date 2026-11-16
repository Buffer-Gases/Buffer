/* ---------- DISORDERS ---------- */
lesson({id:'read6',m:'dis',t:'The six-step read',ex:{pH:7.21,pco2:24,hco3:9.4,po2:108,fio2:.21,na:136,cl:101,alb:40,lac:1.4,glu:28,age:24},
sum:'Same order, every gas: (1) is it real, (2) acid or alkali, (3) which system, (4) is compensation right, (5) the gaps, (6) oxygen. Then the cause.',
body:`<ol class="steps">
<li><b>Is it real?</b> Does it fit the patient and the sample (arterial or venous, FiO₂, delay)? If pH, PCO₂ and HCO₃⁻ seem not to fit, check with Henderson: [H⁺] = 24 × PCO₂ ÷ HCO₃⁻.</li>
<li><b>Acidaemia or alkalaemia?</b> pH &lt; 7.35 or &gt; 7.45. Normal pH does not mean normal gas.</li>
<li><b>Which system?</b> Which of PCO₂ or HCO₃⁻ moved in the direction that explains the pH? If both did, there are two primary disorders.</li>
<li><b>Compensation.</b> Winter's, 0.7 × HCO₃⁻ + 20, or 1–4–2–5. Outside the expected range → another disorder.</li>
<li><b>The gaps.</b> Anion gap (corrected for albumin) in every metabolic acidosis, delta ratio if the gap is high, osmolar gap if the cause is unclear. Check the AG even when the pH is normal.</li>
<li><b>Oxygen.</b> PaO₂ against FiO₂: P/F, A–a gradient, type of respiratory failure; co-oximetry if relevant.</li></ol>
<p>Then name the disorders in one line and match them to the clinical picture.</p>
<h3>Worked example</h3>
<p>24-year-old with diabetes, vomiting. pH 7.21, PaCO₂ 24, HCO₃⁻ 9.4, PaO₂ 108 (air), Na 136, Cl 101, glucose 28.</p>
<ol class="steps"><li>Henderson: 24 × 24 ÷ 9.4 ≈ 61; 80 rule at 7.21 ≈ 59. Consistent.</li>
<li>pH 7.21: acidaemia.</li>
<li>HCO₃⁻ low (explains acid), PCO₂ low (does not): metabolic acidosis.</li>
<li>Winter's: 1.5 × 9.4 + 8 = 22 ± 2 → 20–24. Measured 24: appropriate.</li>
<li>AG = 136 − (101 + 9.4) ≈ 26. Δ ratio = 14 ÷ 14.6 ≈ 1.0: pure high AG acidosis.</li>
<li>PaO₂ 108 on air: normal for a hyperventilating patient (PAO₂ = 150 − 24/0.8 = 120; A–a = 12).</li></ol>
<p><b>Read</b>: high anion gap metabolic acidosis with appropriate respiratory compensation. With glucose 28: DKA. Check ketones and potassium.</p>
<p>Open this case in the Interpreter with the button below to see every step calculated.</p>`,
keys:[['Order','Real · pH · system · compensation · gaps · oxygen'],['Always','AG, even with normal pH']],
hook:'"Real, Acid, Who, Fair, Gaps, Air."',
q:[['In step 3, pH 7.30, PCO₂ 55, HCO₃⁻ 18. What do you conclude?',['Respiratory acidosis only','Metabolic acidosis only','Both respiratory and metabolic acidosis','Compensated'],2,'Both moved in the acid direction: two primary disorders.'],
['When should you calculate the anion gap?',['Only if pH < 7.2','In every metabolic acidosis, and even with a normal pH','Only with high lactate','Never on a VBG'],1,'A normal pH can hide HAGMA plus metabolic alkalosis.']]});

lesson({id:'hagma',m:'dis',t:'High anion gap metabolic acidosis',ex:{pH:7.17,pco2:18,hco3:6.3,po2:118,fio2:.21,na:140,cl:104,alb:38,lac:9.1,age:58},
sum:'An unmeasured acid has been added. GOLDMARK: Glycols, Oxoproline, L-lactate, D-lactate, Methanol, Aspirin, Renal failure, Ketoacidosis.',
body:`${tw('<tr><th>Letter</th><th>Cause</th><th>Clue</th></tr><tr><td>G</td><td>Glycols (ethylene, propylene)</td><td>Osmolar gap, oxalate crystals, AKI; propylene glycol from IV lorazepam infusions</td></tr><tr><td>O</td><td>5-Oxoproline</td><td>Chronic paracetamol, malnutrition, sepsis</td></tr><tr><td>L</td><td>L-lactate</td><td>Shock, sepsis, ischaemia, seizures, metformin, β₂-agonists</td></tr><tr><td>D</td><td>D-lactate</td><td>Short bowel; normal routine lactate</td></tr><tr><td>M</td><td>Methanol</td><td>Visual symptoms, osmolar gap</td></tr><tr><td>A</td><td>Aspirin (salicylate)</td><td>Tinnitus, plus respiratory alkalosis</td></tr><tr><td>R</td><td>Renal failure</td><td>High urea/creatinine; AG rarely &gt; 20 from uraemia alone</td></tr><tr><td>K</td><td>Ketoacidosis</td><td>Diabetic, alcoholic, starvation; blood BHB</td></tr>')}
<h3>Approach</h3>
<ol class="steps"><li>Measure lactate, glucose, BHB, urea/creatinine.</li>
<li>Does the lactate (plus ketones) account for the rise in AG? If not, check the osmolar gap and salicylate level, and think of toxic alcohols, 5-oxoproline and D-lactate.</li>
<li>Delta ratio for a hidden second disorder.</li></ol>
<p>Older mnemonic MUDPILES (Methanol, Uraemia, DKA, Paraldehyde/Propylene glycol, Iron/Isoniazid, Lactate, Ethylene glycol, Salicylates) includes causes that act mainly through lactate.</p>`,
keys:[['Mnemonic','GOLDMARK'],['First labs','Lactate · glucose · BHB · creatinine'],['Unexplained gap','Osmolar gap, salicylate']],
hook:'GOLDMARK: if lactate and ketones do not fill the gap, go hunting.',
q:[['HAGMA, AG 28, lactate 1.2, BHB 0.3, normal creatinine, osmolar gap 28. Next?',['Treat as DKA','Fomepizole and toxic alcohol levels','Bicarbonate infusion only','D-lactate test'],1,'Unexplained gap with high osmolar gap = toxic alcohol until proven otherwise.'],
['Which HAGMA cause comes with a primary respiratory alkalosis?',['Methanol','Salicylate','Ethylene glycol','Uraemia'],1,'Salicylate stimulates the respiratory centre directly.']]});

lesson({id:'nagma',m:'dis',t:'Normal anion gap (hyperchloraemic) metabolic acidosis',ex:{pH:7.27,pco2:29,hco3:13,po2:104,fio2:.21,na:138,cl:115,alb:40,lac:1.3,age:30},
sum:'Bicarbonate has been lost (gut or kidney) or chloride added. HARDASS: Hyperalimentation, Acetazolamide, RTA, Diarrhoea, Addison\'s, Spironolactone, Saline.',
body:`${tw('<tr><th>Letter</th><th>Cause</th></tr><tr><td>H</td><td>Hyperalimentation (parenteral nutrition with chloride amino acids)</td></tr><tr><td>A</td><td>Acetazolamide (and topiramate)</td></tr><tr><td>R</td><td>Renal tubular acidosis; early CKD</td></tr><tr><td>D</td><td>Diarrhoea, ileostomy, pancreatic or biliary fistula, ureteric diversion</td></tr><tr><td>A</td><td>Addison\'s (hypoaldosteronism)</td></tr><tr><td>S</td><td>Spironolactone, amiloride, trimethoprim</td></tr><tr><td>S</td><td>Saline (large volumes of 0.9%)</td></tr>')}
<h3>Approach</h3>
<ol class="steps"><li>History usually answers it: diarrhoea, fistula, saline, drugs.</li>
<li>If not: potassium. High K⁺ → type 4 RTA or hypoaldosteronism. Low K⁺ → diarrhoea, type 1 or 2 RTA.</li>
<li>Urine anion gap: negative = gut; positive = renal.</li>
<li>Urine pH &gt; 5.5 despite acidaemia → distal (type 1) RTA.</li></ol>
<p>DKA often turns into a NAGMA during treatment: ketoanions are lost in urine and saline adds chloride. A falling AG with a still-low bicarbonate is expected; it is not treatment failure if ketones have cleared.</p>`,
keys:[['Mnemonic','HARDASS'],['High K⁺','Type 4 RTA, Addison\'s, spironolactone'],['Test','Urine anion gap']],
hook:'Normal gap means the chloride replaced the bicarbonate. Ask: gut, kidney, or drip?',
q:[['NAGMA with K⁺ 2.9 after a week of cholera-like diarrhoea. Urine anion gap?',['Positive','Negative','Zero','Not measurable'],1,'Intact kidneys excrete NH₄Cl, making the gap negative.'],
['Day 2 of DKA treatment: AG 12, HCO₃⁻ 16, BHB 0.4. Interpretation?',['Persistent DKA; increase insulin','Expected hyperchloraemic acidosis of recovery','Lactic acidosis','Laboratory error'],1,'Ketones have cleared; the remaining acidosis is chloride-driven.']]});

lesson({id:'malk',m:'dis',t:'Metabolic alkalosis',ex:{pH:7.53,pco2:47,hco3:38.6,po2:84,fio2:.21,na:136,cl:86,alb:42,lac:1.1,age:45},
sum:'Split by urine chloride. Low (< 20): vomiting, NG suction, prior diuretics, post-hypercapnia. High (> 20): current diuretics, mineralocorticoid excess, Bartter/Gitelman, severe hypokalaemia.',
body:`${tw('<tr><th>Urine Cl⁻</th><th>Blood pressure</th><th>Causes</th></tr><tr><td>&lt; 20 mmol/L (chloride responsive)</td><td>Normal / low</td><td>Vomiting, NG suction, remote diuretics, post-hypercapnia, villous adenoma, congenital chloride diarrhoea, cystic fibrosis</td></tr><tr><td rowspan="2">&gt; 20 mmol/L (chloride resistant)</td><td>High</td><td>Primary hyperaldosteronism, Cushing\'s, renovascular disease, liquorice, Liddle syndrome</td></tr><tr><td>Normal / low</td><td>Current diuretics, Bartter, Gitelman, severe hypokalaemia or hypomagnesaemia</td></tr>')}
<p>Urine Na⁺ is unreliable in vomiting (bicarbonaturia drags sodium out), which is why urine chloride is the test.</p>
<h3>Consequences</h3>
<ul><li>Hypoventilation (expected PCO₂ up to about 55–60); can worsen hypoxaemia in lung disease.</li>
<li>Hypokalaemia, low ionised calcium, arrhythmias, seizures when pH &gt; 7.6.</li></ul>
<h3>Treatment</h3>
<p>Chloride responsive: 0.9% saline and KCl. Stop the losses (antiemetics, PPI if NG suction). Chloride resistant: treat the cause; potassium-sparing diuretics. Acetazolamide in volume-overloaded patients.</p>`,
keys:[['Responsive','Urine Cl⁻ < 20'],['Resistant','Urine Cl⁻ > 20'],['Compensation','PCO₂ = 0.7·HCO₃⁻ + 20']],
hook:'Low urine chloride: give chloride. High urine chloride: look for a hormone or a diuretic.',
q:[['Hypertension, K⁺ 2.8, HCO₃⁻ 33, urine Cl⁻ 60. Most likely?',['Vomiting','Primary hyperaldosteronism','Bartter syndrome','Post-hypercapnia'],1,'Chloride-resistant alkalosis with hypertension: mineralocorticoid excess.'],
['Why is urine sodium misleading after vomiting?',['Kidneys stop working','Bicarbonaturia carries sodium into urine despite volume depletion','Sodium is lost in vomit','It is always low'],1,'Urine chloride better reflects volume status here.']]});

lesson({id:'racid',m:'dis',t:'Respiratory acidosis',ex:{pH:7.24,pco2:68,hco3:28.8,po2:58,fio2:.21,na:139,cl:100,alb:40,age:35},
sum:'Hypoventilation. Acute: HCO₃⁻ up 1 per 10, pH falls ≈ 0.08 per 10. Chronic: HCO₃⁻ up 4 per 10, pH falls ≈ 0.03 per 10.',
body:`<h3>Causes</h3>
<ul><li><b>Drive</b>: opioids, benzodiazepines, alcohol, anaesthetics, brainstem stroke, central hypoventilation, severe metabolic alkalosis.</li>
<li><b>Pump</b>: Guillain–Barré, myasthenia, motor neurone disease, spinal cord injury, botulism, organophosphates, severe hypokalaemia or hypophosphataemia, fatigue.</li>
<li><b>Chest wall and pleura</b>: kyphoscoliosis, obesity, flail chest, large effusion or pneumothorax.</li>
<li><b>Airways and lungs</b>: COPD, severe asthma, upper airway obstruction, severe pneumonia or oedema (late).</li>
<li><b>Ventilator</b>: inadequate minute ventilation, permissive hypercapnia (intentional in ARDS).</li></ul>
<h3>Telling acute from chronic</h3>
${tw('<tr><th></th><th>Acute</th><th>Chronic</th></tr><tr><td>HCO₃⁻ rise per 10 mmHg</td><td>≈ 1</td><td>≈ 4</td></tr><tr><td>pH fall per 10 mmHg</td><td>≈ 0.08</td><td>≈ 0.03</td></tr><tr><td>Base excess</td><td>≈ 0</td><td>Positive</td></tr>')}
<p>HCO₃⁻ between the two predictions: acute-on-chronic, or an acute disorder a day or two old. HCO₃⁻ above the chronic prediction: added metabolic alkalosis (diuretics, steroids, vomiting). HCO₃⁻ below the acute prediction: added metabolic acidosis.</p>
<h3>Act on</h3>
<p>pH &lt; 7.35 with PaCO₂ &gt; 45 mmHg (6 kPa) in COPD despite treatment → non-invasive ventilation. Decreasing consciousness, pH &lt; 7.25 not improving on NIV, or an exhausted asthmatic → intubation discussion.</p>`,
keys:[['Acute','HCO₃⁻ +1 / 10 mmHg'],['Chronic','HCO₃⁻ +4 / 10 mmHg'],['NIV trigger (COPD)','pH < 7.35, PaCO₂ > 45']],
hook:'One for acute, four for chronic. The pH tells you how surprised the body is.',
q:[['PaCO₂ 70 after a heroin overdose. Expected HCO₃⁻ if purely acute?',['24','27','36','40'],1,'24 + 1 × 3 = 27.'],
['PaCO₂ 60, HCO₃⁻ 38. Interpretation?',['Chronic resp acidosis','Chronic resp acidosis plus metabolic alkalosis','Acute resp acidosis','Acute-on-chronic'],1,'Chronic expected 24 + 8 = 32 (± 2). 38 is too high: an added metabolic alkalosis, e.g. diuretics or steroids.']]});

lesson({id:'ralk',m:'dis',t:'Respiratory alkalosis',ex:{pH:7.51,pco2:27,hco3:21.2,po2:68,fio2:.21,na:140,cl:105,alb:40,age:40},
sum:'Hyperventilation. Acute: HCO₃⁻ down 2 per 10. Chronic: down 5 per 10, and pH can return to normal. Always ask what is driving it.',
body:`<h3>Causes</h3>
<ul><li><b>Hypoxaemia</b>: pneumonia, PE, pulmonary oedema, altitude.</li>
<li><b>Lung receptors</b>: PE, pneumonia, interstitial disease, asthma (early).</li>
<li><b>Central</b>: anxiety, pain, fever, stroke, head injury, meningitis.</li>
<li><b>Drugs and hormones</b>: salicylate, progesterone (pregnancy), theophylline, catecholamines.</li>
<li><b>Systemic</b>: sepsis (early), liver failure, hyperthyroidism, heat illness.</li>
<li><b>Iatrogenic</b>: over-ventilation on a ventilator.</li></ul>
<h3>Anxiety is a diagnosis of exclusion</h3>
<p>Before blaming panic: check the A–a gradient (raised → lung pathology such as PE), temperature, glucose, salicylate level, pregnancy, and sepsis markers. An anxious patient with an A–a gradient of 35 has a lung problem.</p>
<h3>Effects</h3>
<p>Low ionised calcium (perioral and fingertip tingling, carpopedal spasm), cerebral vasoconstriction (light-headedness), hypokalaemia, hypophosphataemia.</p>`,
keys:[['Acute','HCO₃⁻ −2 / 10 mmHg'],['Chronic','HCO₃⁻ −5 / 10 mmHg'],['Before calling it anxiety','A–a gradient']],
hook:'Fast breathing is a symptom. Find the driver: lungs, brain, blood, drugs, or baby.',
q:[['Anxious 30-year-old, PaCO₂ 28, PaO₂ 72 on air, sea level. A–a gradient?',['≈ 43, raised: look for PE or pneumonia','≈ 5, normal: anxiety','≈ 0','Cannot tell'],0,'PAO₂ = 150 − 35 = 115. A–a ≈ 43, well above ≈ 12 expected.'],
['Which respiratory disorder can fully normalise the pH?',['Acute respiratory acidosis','Chronic respiratory alkalosis','Acute respiratory alkalosis','Chronic respiratory acidosis'],1,'Chronic respiratory alkalosis (e.g. pregnancy, altitude) often has a normal pH.']]});

lesson({id:'mixed',m:'dis',t:'Mixed and hidden disorders',ex:{pH:7.42,pco2:24,hco3:15.3,po2:108,fio2:.21,na:140,cl:102,alb:40,lac:2.1,age:42},
sum:'Two clues: compensation outside the expected range, and a delta ratio outside 0.8–2. A normal pH with abnormal PCO₂ and HCO₃⁻ is almost always mixed.',
body:`<h3>Signals of a mixed disorder</h3>
<ul><li>PCO₂ and HCO₃⁻ move in <b>opposite</b> directions (one up, one down): always two disorders.</li>
<li>Compensation outside the expected range.</li>
<li>pH normal or overshot with clearly abnormal values (except chronic respiratory alkalosis).</li>
<li>High AG with near-normal or high HCO₃⁻.</li>
<li>Delta ratio &lt; 0.8 or &gt; 2.</li></ul>
${tw('<tr><th>Combination</th><th>Classic settings</th></tr><tr><td>Metabolic + respiratory acidosis</td><td>Cardiac arrest, severe pulmonary oedema, sepsis with exhaustion, COPD with shock</td></tr><tr><td>Metabolic acidosis + respiratory alkalosis</td><td>Salicylate poisoning, sepsis, liver failure</td></tr><tr><td>HAGMA + metabolic alkalosis</td><td>DKA or alcoholic ketoacidosis with vomiting, renal failure with vomiting</td></tr><tr><td>HAGMA + NAGMA</td><td>DKA treated with saline, diarrhoea with AKI or lactic acidosis</td></tr><tr><td>Respiratory acidosis + metabolic alkalosis</td><td>COPD on diuretics or steroids</td></tr><tr><td>Respiratory alkalosis + metabolic alkalosis</td><td>Vomiting in pregnancy, liver failure on diuretics: dangerously high pH</td></tr>')}
<h3>Triple disorders</h3>
<p>Possible because the two metabolic processes can coexist with one respiratory one. Example: DKA (HAGMA) with vomiting (metabolic alkalosis) and pneumonia-driven respiratory alkalosis. Only one respiratory disorder can exist at a time.</p>`,
keys:[['Opposite directions','Always mixed'],['Δ ratio > 2','+ metabolic alkalosis'],['Δ ratio < 0.8','+ NAGMA'],['Max disorders','3 (only one respiratory)']],
hook:'A normal pH is a question, not an answer.',
q:[['pH 7.42, PCO₂ 24, HCO₃⁻ 15, AG 23. Interpretation?',['Normal','Chronic respiratory alkalosis','HAGMA + respiratory alkalosis','NAGMA'],2,'Winter\'s predicts PCO₂ 30.5 ± 2, measured 24 is lower: added respiratory alkalosis. High AG confirms HAGMA. Think salicylate or sepsis.'],
['Why can\'t there be two respiratory disorders at once?',['They cancel','PCO₂ can only be high or low at one moment','Lungs cannot compensate','They can'],1,'Only one PCO₂ value exists; metabolic processes can stack because they are separate acids and bases.']]});

lesson({id:'oxread',m:'dis',t:'The oxygenation read and dyshaemoglobins',
sum:'Read PaO₂ with FiO₂ and age, compute P/F and the A–a gradient, classify the failure, then ask whether haemoglobin itself is normal.',
body:`<ol class="steps"><li>Is the patient hypoxaemic for their FiO₂ and age?</li>
<li>P/F ratio (any FiO₂) and A–a gradient (room air ideally).</li>
<li>Normal A–a → hypoventilation (check PCO₂) or low PiO₂.</li>
<li>Raised A–a → V/Q mismatch, shunt or diffusion. Response to O₂ separates shunt.</li>
<li>Type 1 or type 2 failure; acute or chronic.</li>
<li>Saturation: does SpO₂ match SaO₂? If not, think CO, MetHb or a venous sample.</li></ol>
<h3>When the PaO₂ is normal but the tissues are not</h3>
${tw('<tr><th>Problem</th><th>PaO₂</th><th>SpO₂</th><th>Co-ox SaO₂</th><th>Clue</th></tr><tr><td>Carbon monoxide</td><td>Normal</td><td>Normal</td><td>Low (COHb high)</td><td>Headache, several people affected, fire, generator</td></tr><tr><td>Methaemoglobin</td><td>Normal</td><td>≈ 85%</td><td>Low (MetHb high)</td><td>Cyanosis, brown blood, nitrites, dapsone, benzocaine</td></tr><tr><td>Cyanide</td><td>Normal</td><td>Normal</td><td>Normal</td><td>Lactate &gt; 8 in smoke, high venous O₂</td></tr><tr><td>Anaemia</td><td>Normal</td><td>Normal</td><td>Normal</td><td>Low Hb, low content</td></tr>')}`,
keys:[['Saturation gap','> 5% → dyshaemoglobin'],['Cyanide clue','Lactate > 8 + high ScvO₂']],
hook:'Normal PaO₂ only proves the lungs work. Check the haemoglobin and the cells.',
q:[['House fire, confused, SpO₂ 99%, PaO₂ 320 on NRB, lactate 10.5. Two toxins to treat?',['CO and cyanide','MetHb and CO','Cyanide only','None'],0,'Smoke inhalation: CO (needs co-oximetry) and cyanide (lactate > 8). Give 100% O₂ and hydroxocobalamin.'],
['Normal A–a gradient with hypoxaemia and PaCO₂ 75. Mechanism?',['Shunt','Hypoventilation','V/Q mismatch','Diffusion'],1,'Hypercapnia lowers alveolar O₂; the lungs transfer normally.']]});

/* ---------- CLINICAL ---------- */
lesson({id:'dka',m:'clin',t:'Diabetic ketoacidosis',ex:{pH:7.08,pco2:17,hco3:4.9,fio2:.21,na:131,cl:96,alb:44,lac:2.3,glu:31,age:19,sample:'v'},
sum:'HAGMA with Winter\'s compensation, glucose usually > 11 mmol/L, BHB ≥ 3. VBG is enough. Watch potassium, chloride and the AG during treatment.',
body:`<h3>Diagnosis (2024 international consensus)</h3>
<ul><li>Glucose ≥ 11.1 mmol/L (200 mg/dL) or known diabetes (glucose may be normal: SGLT2 inhibitors, pregnancy).</li>
<li>Ketones: blood BHB ≥ 3.0 mmol/L (or urine ketones ≥ 2+).</li>
<li>Acidosis: pH &lt; 7.30 and/or HCO₃⁻ &lt; 18 mmol/L.</li></ul>
<h3>Typical gas</h3>
<p>Venous pH 7.0–7.25, HCO₃⁻ 5–15, PCO₂ by Winter's (Kussmaul breathing), AG 20–35, delta ratio ≈ 1. Sodium looks low because of hyperglycaemia (correct: + ≈ 2.4 per 5.5 mmol/L glucose above 5.5).</p>
<h3>What the gas tells you during treatment</h3>
<ul><li>K⁺ before insulin; K⁺ replacement as soon as it falls under ≈ 5.0–5.5.</li>
<li>A PCO₂ higher than Winter's predicts (e.g. HCO₃⁻ 6 with PCO₂ 30) means the patient is tiring or sedated: danger.</li>
<li>Resolution: BHB &lt; 0.6 and venous pH ≥ 7.3 (or HCO₃⁻ ≥ 18). A persistent low HCO₃⁻ with normal AG after ketones clear is saline-induced NAGMA, not ongoing DKA.</li>
<li>Delta ratio &gt; 2 at presentation suggests heavy vomiting (added metabolic alkalosis); the bicarbonate understates how sick the patient is.</li>
<li>Bicarbonate therapy is not routinely helpful; consider only if pH &lt; 7.0 per local protocol.</li></ul>`,
keys:[['BHB','≥ 3.0 mmol/L'],['Acidosis','pH < 7.3 and/or HCO₃⁻ < 18'],['Resolved','BHB < 0.6, pH ≥ 7.3']],
hook:'Fix fluids, then potassium, then insulin, and let the gas confirm each step.',
q:[['DKA: HCO₃⁻ 6, PCO₂ 31. What does the PCO₂ mean?',['Appropriate compensation','Inadequate compensation: respiratory acidosis, tiring or sedated','Respiratory alkalosis','Venous artefact'],1,'Winter\'s: 1.5 × 6 + 8 = 17 ± 2. 31 is far too high: impending respiratory failure.'],
['Which sample suffices for DKA diagnosis and monitoring?',['Arterial','Venous','Capillary only','Urine'],1,'Venous pH, bicarbonate and electrolytes agree closely with arterial values.']]});

lesson({id:'sepsis',m:'clin',t:'Sepsis and septic shock',ex:{pH:7.31,pco2:27,hco3:13.2,po2:68,fio2:.28,na:137,cl:103,alb:29,lac:6.4,age:67},
sum:'Early respiratory alkalosis, then lactic acidosis. Low albumin hides part of the gap. Lactate and its clearance track severity.',
body:`<h3>Typical sequence</h3>
<ol class="steps"><li>Early: hyperventilation, PCO₂ 28–34, HCO₃⁻ normal → respiratory alkalosis.</li>
<li>Established: lactate rises → HAGMA with respiratory alkalosis (PCO₂ often below Winter's prediction).</li>
<li>Late: fatigue, ARDS → PCO₂ rises above Winter's → mixed metabolic and respiratory acidosis. A "normalising" PCO₂ in a septic patient with a low bicarbonate is a warning, not improvement.</li></ol>
<h3>Practical points</h3>
<ul><li>Correct the AG for albumin; septic patients often have albumin around 25 g/L, hiding about 4 mmol/L of anion.</li>
<li>Lactate ≥ 2 mmol/L: screen for organ dysfunction. Recheck at 2 hours; aim for falling values.</li>
<li>Large-volume 0.9% saline adds a hyperchloraemic component; balanced crystalloids reduce it.</li>
<li>Hypoxaemia with a high A–a: pneumonia or ARDS; compute the P/F.</li></ul>`,
keys:[['Early','Respiratory alkalosis'],['Septic shock lactate','> 2 with vasopressors'],['Albumin','Correct the gap']],
hook:'In sepsis, a PCO₂ that stops falling while the bicarbonate keeps falling means the patient is tiring.',
q:[['Septic patient: HCO₃⁻ 14, PCO₂ 41. Meaning?',['Appropriately compensated','Respiratory acidosis: fatigue, consider ventilatory support','Respiratory alkalosis','Recovery'],1,'Expected 29 ± 2; 41 means failing ventilation.'],
['AG 13 with albumin 22 g/L. Corrected AG?',['13','17.5','22','8.5'],1,'13 + 0.25 × 18 = 17.5: raised.']]});

lesson({id:'asa',m:'clin',t:'Salicylate poisoning',ex:{pH:7.46,pco2:22,hco3:15.3,po2:112,fio2:.21,na:141,cl:104,alb:40,lac:2.4,age:32},
sum:'Primary respiratory alkalosis plus HAGMA, often with a near-normal pH. When the patient tires or is intubated, the pH crashes.',
body:`<p>Salicylate directly stimulates the respiratory centre (respiratory alkalosis within hours) and uncouples oxidative phosphorylation (lactate, ketones and salicylate itself raise the AG). Adults often present with a mixed picture; children with a dominant acidosis.</p>
<h3>Clues</h3>
<p>Tinnitus, vomiting, sweating, fever, tachypnoea, confusion; non-cardiogenic pulmonary oedema in severe cases. Gas: PCO₂ below Winter's prediction, AG raised, pH near normal or alkalaemic.</p>
<h3>Why acidaemia is dangerous</h3>
<p>Salicylic acid is a weak acid. As pH falls, more is un-ionised and crosses into the brain. Keeping the blood alkaline is therapy.</p>
<ul><li>Urinary alkalinisation with sodium bicarbonate (target urine pH 7.5–8.5), with potassium replacement.</li>
<li>If intubation is unavoidable, match the patient's previous very high minute ventilation and recheck the gas quickly; a "normal" PCO₂ of 40 can be fatal.</li>
<li>Haemodialysis (EXTRIP 2015): very high levels (around 7.2 mmol/L / 100 mg/dL, lower with renal impairment), altered mental state, hypoxaemia, or pH ≤ 7.20 despite treatment.</li></ul>`,
keys:[['Gas','Resp alkalosis + HAGMA'],['Danger','Acidaemia → CNS entry'],['Urine pH target','7.5–8.5']],
hook:'Aspirin breathes for you: low CO₂ with a gap. Never let it go acidic.',
q:[['Salicylate overdose, being intubated. Ventilator setting priority?',['Normal minute ventilation to PCO₂ 40','Match pre-intubation high ventilation to keep PCO₂ low','Permissive hypercapnia','Low tidal volume and low rate'],1,'A sudden rise in PCO₂ drops pH and drives salicylate into the brain.'],
['Typical adult salicylate gas?',['Pure respiratory acidosis','Respiratory alkalosis with high AG metabolic acidosis','Metabolic alkalosis','NAGMA'],1,'Two primary disorders.']]});

lesson({id:'toxalc2',m:'clin',t:'Toxic alcohols in the emergency department',ex:{pH:7.18,pco2:18,hco3:6.5,po2:116,fio2:.21,na:140,cl:102,alb:41,lac:2,glu:6,urea:5,osm:322,age:44},
sum:'Unexplained HAGMA, osmolar gap, visual or renal clues. Block ADH early with fomepizole; dialyse for severe acidosis or organ damage.',
body:`<ul><li>Suspect with an unexplained AG (lactate and ketones do not explain it), an osmolar gap above about 10, a history of drinking homemade alcohol, antifreeze or windscreen fluid, visual blurring ("snowfield vision"), or AKI with calcium oxalate crystals.</li>
<li>Outbreaks of methanol poisoning from adulterated spirits occur worldwide; several patients arriving together with the same symptoms is a pattern.</li>
<li>Calculate the osmolar gap with Na⁺, glucose and urea in mmol/L; subtract ethanol's contribution if present.</li>
<li>Treatment: fomepizole (or ethanol), bicarbonate for severe acidosis, folinic acid for methanol, thiamine and pyridoxine for ethylene glycol, early haemodialysis for severe acidosis, visual signs, AKI, or high levels.</li></ul>`,
keys:[['Calc osm','2Na + glucose + urea'],['Osmolar gap','> 10 suspicious'],['Antidote','Fomepizole']],
hook:'High gap, no lactate, no ketones, high osmoles: block ADH now and confirm later.',
q:[['Na 140, glucose 6, urea 5, measured osm 322. Osmolar gap?',['11','31','41','0'],1,'Calculated = 280 + 6 + 5 = 291; gap = 31.'],
['Which toxic alcohol causes ketosis without acidosis?',['Methanol','Ethylene glycol','Isopropanol','Propylene glycol'],2,'It becomes acetone.']]});

lesson({id:'copd',m:'clin',t:'COPD exacerbation and NIV',ex:{pH:7.27,pco2:72,hco3:32.3,po2:52,fio2:.28,na:138,cl:95,alb:37,age:68},
sum:'Acute-on-chronic respiratory acidosis. Target SpO₂ 88–92%. NIV when pH < 7.35 and PaCO₂ > 45 (6 kPa) persist after initial treatment.',
body:`<h3>Reading it</h3>
<ul><li>High HCO₃⁻ (renal compensation, often 30–40) shows the chronic retention.</li>
<li>A low pH shows the acute rise on top.</li>
<li>The pH, not the PaCO₂, sets the urgency.</li></ul>
<h3>Decisions</h3>
<ul><li>Controlled oxygen via Venturi (24–28%) to SpO₂ 88–92%; recheck the gas in 30–60 min after any change.</li>
<li>NIV (BTS: pH &lt; 7.35 with PaCO₂ &gt; 6.5 kPa after standard treatment; many guidelines use &gt; 45 mmHg). pH &lt; 7.25 is higher risk for NIV failure; manage where intubation is available.</li>
<li>Recheck after 1–2 hours of NIV: improving pH and respiratory rate predicts success.</li>
<li>Post-hypercapnic alkalosis: after rapid ventilation the bicarbonate stays high; avoid over-ventilating intubated retainers.</li></ul>`,
keys:[['SpO₂ target','88–92%'],['NIV','pH < 7.35 + hypercapnia'],['Recheck','1–2 h on NIV']],
hook:'High bicarb tells you the past; low pH tells you today.',
q:[['COPD: pH 7.31, PaCO₂ 64, HCO₃⁻ 31 after nebulisers and controlled O₂. Next?',['Increase oxygen to SpO₂ 98%','Start NIV','Intubate immediately','Give bicarbonate'],1,'Persistent hypercapnic acidosis meets NIV criteria.'],
['A known retainer has pH 7.38, PaCO₂ 58, HCO₃⁻ 33. Action?',['NIV','Nothing urgent; compensated chronic hypercapnia','Intubate','Bicarbonate'],1,'Compensated chronic respiratory acidosis.']]});

lesson({id:'asthma',m:'clin',t:'Acute severe asthma',ex:{pH:7.36,pco2:42,hco3:23.2,po2:63,fio2:.4,na:139,cl:103,alb:42,lac:3.1,age:22},
sum:'Expect a low PCO₂. A normal PCO₂ (35–45) in a severe attack is life-threatening; a high one is near-fatal.',
body:`<p>In an asthma attack, the patient hyperventilates, so PCO₂ should be low. As airways close and muscles tire, PCO₂ climbs back through normal.</p>
${tw('<tr><th>Finding (BTS/SIGN 2019)</th><th>Severity</th></tr><tr><td>PCO₂ low, SpO₂ ≥ 92%</td><td>Acute severe</td></tr><tr><td><b>"Normal" PaCO₂ 4.6–6.0 kPa (35–45 mmHg)</b>, PaO₂ &lt; 8 kPa (60 mmHg), SpO₂ &lt; 92%</td><td>Life-threatening</td></tr><tr><td>Raised PaCO₂ and/or need for ventilation</td><td>Near-fatal</td></tr>')}
<ul><li>A gas is indicated when SpO₂ &lt; 92% or there are life-threatening features.</li>
<li>Lactate often rises from salbutamol (type B); it does not by itself mean shock.</li>
<li>Rising PCO₂ → senior help, ICU, consider intubation. NIV is not a standard rescue in asthma.</li></ul>`,
keys:[['Life-threatening','PaCO₂ 35–45 in attack'],['Near-fatal','PaCO₂ raised'],['Lactate','Often from salbutamol']],
hook:'In asthma, a normal CO₂ is not normal.',
q:[['Severe asthma, PCO₂ 43, exhausted. Category?',['Moderate','Acute severe','Life-threatening','Mild'],2,'A normal PCO₂ in a severe attack means tiring.'],
['Lactate 4.2 in an asthmatic on hourly salbutamol, warm and well perfused. Likely cause?',['Septic shock','β₂-agonist effect','Cyanide','Ischaemic bowel'],1,'Type B2 lactate from salbutamol.']]});

lesson({id:'pe',m:'clin',t:'Pulmonary embolism',ex:{pH:7.49,pco2:29,hco3:21.6,po2:62,fio2:.21,na:139,cl:104,alb:40,age:52},
sum:'Typical gas: respiratory alkalosis, hypoxaemia, raised A–a gradient. A normal gas does not exclude PE.',
body:`<ul><li>Dead space and reflex hyperventilation lower PCO₂; V/Q mismatch lowers PaO₂ and widens the A–a gradient.</li>
<li>Up to a fifth of patients with PE have a normal A–a gradient; never use the gas to rule PE out. Use clinical probability, D-dimer and imaging.</li>
<li>Massive PE: shock, lactic acidosis, and sometimes rising PCO₂ from huge dead space despite high minute ventilation. The end-tidal CO₂ falls well below PaCO₂.</li></ul>`,
keys:[['Typical','Resp alkalosis + raised A–a'],['Rule out?','Never by gas alone'],['Massive PE','Lactate ↑, ETCO₂ ≪ PaCO₂']],
hook:'Low CO₂, low O₂, wide gradient, and a gas that cannot rule anything out.',
q:[['Can a normal ABG exclude PE?',['Yes','No'],1,'A normal A–a gradient occurs in a meaningful minority.'],
['Classic PE gas?',['Resp acidosis, normal A–a','Resp alkalosis, hypoxaemia, raised A–a','Metabolic alkalosis','NAGMA'],1,'Hyperventilation plus V/Q mismatch.']]});

lesson({id:'vomit',m:'clin',t:'Vomiting and gastric loss',ex:{pH:7.55,pco2:46,hco3:39.8,po2:80,fio2:.21,na:134,cl:84,alb:45,lac:1.2,age:29},
sum:'Hypochloraemic, hypokalaemic metabolic alkalosis with hypoventilation. Urine Cl⁻ < 20. Treat with saline and potassium.',
body:`<ul><li>Gastric HCl loss adds bicarbonate to blood; volume, chloride and potassium depletion maintain it.</li>
<li>Classic in pyloric stenosis in infants, bulimia, gastric outlet obstruction, hyperemesis gravidarum, high-output NG suction.</li>
<li>Expected PCO₂ = 0.7 × HCO₃⁻ + 20 (± 5). Hypoventilation can lower PaO₂ slightly.</li>
<li>Hidden vomiting (eating disorders) gives low urine Cl⁻ with denial of vomiting; diuretic misuse gives high urine Cl⁻ while taking them.</li>
<li>Treat with 0.9% saline with KCl; correct magnesium.</li></ul>`,
keys:[['Pattern','Low Cl⁻, low K⁺, high HCO₃⁻'],['Urine Cl⁻','< 20'],['Treat','0.9% NaCl + KCl']],
hook:'Lose acid from the top, gain alkali in the blood.',
q:[['Pyloric stenosis infant gas?',['NAGMA','Hypochloraemic hypokalaemic metabolic alkalosis','Respiratory alkalosis','HAGMA'],1,'Loss of gastric HCl.'],
['Vomiting patient, HCO₃⁻ 40. Expected PCO₂?',['40','48','56','30'],1,'0.7 × 40 + 20 = 48 (± 5).']]});

lesson({id:'diarr',m:'clin',t:'Diarrhoea and dehydration',ex:{pH:7.24,pco2:27,hco3:11.3,po2:95,fio2:.21,na:136,cl:112,alb:44,lac:2.6,age:6,sample:'v'},
sum:'NAGMA with hypokalaemia from stool bicarbonate loss. Severe dehydration adds lactate and pre-renal AKI, raising the gap.',
body:`<ul><li>Small bowel and pancreatic fluid are rich in bicarbonate; stool HCO₃⁻ loss rises with volume.</li>
<li>Gas: low HCO₃⁻, high Cl⁻, normal AG, low K⁺, negative urine anion gap.</li>
<li>Severe dehydration (cholera, children with gastroenteritis): lactic acidosis and pre-renal AKI → AG rises, delta ratio 0.4–0.8 (mixed HAGMA and NAGMA).</li>
<li>Laxative abuse can cause a metabolic alkalosis instead if it is chronic and hypokalaemia dominates.</li>
<li>Treat with oral rehydration or balanced IV fluids and potassium; monitor the gas in severe cases.</li></ul>`,
keys:[['Pattern','NAGMA + low K⁺'],['UAG','Negative'],['Severe','+ lactic HAGMA']],
hook:'Bicarbonate goes out the bottom; chloride takes its place.',
q:[['Child with gastroenteritis: AG 19, HCO₃⁻ 10, delta ratio?',['0.5: mixed HAGMA + NAGMA','1.0: pure HAGMA','2.5: + alkalosis','0.1: pure NAGMA'],0,'(19 − 12) ÷ (24 − 10) = 7 ÷ 14 = 0.5.'],
['Diarrhoea NAGMA. Expected urine anion gap?',['Positive','Negative'],1,'Kidneys respond by excreting NH₄Cl.']]});

lesson({id:'renalfail',m:'clin',t:'Kidney failure',ex:{pH:7.30,pco2:28,hco3:13.2,po2:94,fio2:.21,na:136,cl:107,alb:33,lac:1.1,age:63},
sum:'CKD: NAGMA first, then HAGMA as GFR falls. Hyperkalaemia and fluid overload often travel with it.',
body:`<ul><li>Moderate CKD: falling ammoniagenesis → NAGMA with HCO₃⁻ around 18–22.</li>
<li>Advanced CKD (GFR &lt; 15–20): sulphate, phosphate and urate retained → HAGMA, typically AG up to about 20. A bigger gap needs another explanation.</li>
<li>AKI: rapid HAGMA plus hyperkalaemia. Acidosis that is refractory to medical treatment is a dialysis indication.</li>
<li>CKD guidelines suggest oral bicarbonate when serum HCO₃⁻ is persistently below about 18–22 to slow progression and protect bone and muscle.</li></ul>`,
keys:[['Early CKD','NAGMA'],['Late CKD','HAGMA, AG ≈ 20'],['Dialysis','Refractory acidosis, K⁺, overload']],
hook:'Kidneys fail to make bicarbonate first, then fail to clear acids.',
q:[['ESKD patient, AG 32. Uraemia alone?',['Yes, typical','Unlikely; look for lactate, ketones, toxins'],1,'Uraemic acidosis rarely produces an AG much above 20.'],
['Which acid–base problem appears first in progressive CKD?',['HAGMA','NAGMA','Metabolic alkalosis','Respiratory acidosis'],1,'Reduced ammoniagenesis.']]});

lesson({id:'arrest',m:'clin',t:'Cardiac arrest and post-ROSC',ex:{pH:6.98,pco2:68,hco3:15.6,po2:72,fio2:1,na:141,cl:103,alb:36,lac:11.8,age:58},
sum:'Mixed respiratory and lactic acidosis. After return of circulation, aim for normocapnia and SpO₂ 94–98%; avoid hyperoxia and over-ventilation.',
body:`<ul><li>During arrest: no ventilation and no flow → rising PCO₂ and lactate. Venous blood can be far more acidotic than arterial (the "venous paradox").</li>
<li>Post-ROSC: lactate typically 5–15 mmol/L; clearance over hours is prognostic.</li>
<li>Ventilate to PaCO₂ 35–45 mmHg; hyperventilation causes cerebral vasoconstriction.</li>
<li>Titrate oxygen to SpO₂ 94–98% (or PaO₂ ≈ 75–100) once a reliable reading exists.</li>
<li>Routine sodium bicarbonate is not recommended; consider for hyperkalaemia or tricyclic overdose.</li>
<li>End-tidal CO₂ during CPR reflects cardiac output: persistently below about 10 mmHg after 20 minutes is a poor sign; a sudden rise suggests ROSC.</li></ul>`,
keys:[['PaCO₂ post-ROSC','35–45 mmHg'],['SpO₂ post-ROSC','94–98%'],['ETCO₂ rise','Suggests ROSC']],
hook:'After ROSC: normal CO₂, not too much oxygen, and follow the lactate.',
q:[['Post-ROSC gas: PaO₂ 380 on FiO₂ 1.0. Action?',['Leave it','Reduce FiO₂ to SpO₂ 94–98%','Increase PEEP','Give bicarbonate'],1,'Hyperoxia is associated with worse outcomes; titrate down.'],
['Ideal PaCO₂ after ROSC?',['25–30','35–45','50–60','Any'],1,'Normocapnia.']]});

lesson({id:'opioid',m:'clin',t:'Opioid and sedative overdose',ex:{pH:7.18,pco2:78,hco3:28.3,po2:52,fio2:.21,na:140,cl:104,alb:41,lac:1.6,age:27},
sum:'Acute respiratory acidosis with hypoxaemia and a normal A–a gradient. A raised gradient means aspiration or pulmonary oedema.',
body:`<ul><li>HCO₃⁻ rises about 1 per 10 mmHg (acute chemistry only).</li>
<li>A–a normal → hypoventilation explains it. A–a raised → aspiration pneumonia, non-cardiogenic pulmonary oedema (heroin, naloxone), or atelectasis.</li>
<li>Naloxone in small titrated doses restores ventilation; recheck the gas or watch the respiratory rate and SpO₂.</li>
<li>Mixed overdoses: alcohol, benzodiazepines, and drugs that also cause metabolic acidosis (e.g. metformin, salicylate) can complicate the picture.</li></ul>`,
keys:[['Gas','Acute resp acidosis'],['A–a','Normal unless aspiration'],['HCO₃⁻','+1 per 10 mmHg']],
hook:'Pure hypoventilation: everything is explained by the CO₂.',
q:[['Overdose, room air, sea level: PaCO₂ 80, PaO₂ 45. A–a?',['5: pure hypoventilation','45: aspiration','0','Cannot compute'],0,'PAO₂ = 150 − 100 = 50; A–a = 5.'],
['Same patient, PaO₂ 30. A–a and meaning?',['20: raised, consider aspiration or oedema','5: normal','80','0'],0,'Gradient above the expected ≈ 11 for a young adult: lung pathology too.']]});

lesson({id:'heat',m:'clin',t:'Heat stroke and exertional illness',ex:{pH:7.29,pco2:26,hco3:12.2,po2:102,fio2:.21,na:146,cl:108,alb:44,lac:7.8,age:34},
sum:'Early respiratory alkalosis from hyperventilation, then lactic acidosis. Exertional heat stroke adds rhabdomyolysis: hyperkalaemia, AKI and a rising gap.',
body:`<p>Heat stroke: core temperature above 40 °C with CNS dysfunction. In outdoor labourers, athletes and pilgrims in hot climates it is a time-critical emergency; cooling comes before investigation.</p>
<h3>The gas over time</h3>
<ul><li><b>Early</b>: hyperventilation → respiratory alkalosis; hypokalaemia and hypophosphataemia from shifts.</li>
<li><b>Established</b>: lactic acidosis (high metabolic demand, hypoperfusion) → HAGMA, often with continuing respiratory alkalosis (mixed).</li>
<li><b>Exertional</b>: rhabdomyolysis releases potassium, phosphate and organic acids; AKI follows. Watch K⁺ and creatine kinase.</li></ul>
<h3>Points</h3>
<ul><li>The analyser reports at 37 °C; true PaO₂ and PaCO₂ at 41 °C are higher. Interpret uncorrected values and treat.</li>
<li>Hypernatraemia from sweat and water loss; hyponatraemia in exertional hyponatraemia from overdrinking hypotonic fluid.</li>
<li>Persistent lactate after cooling suggests ongoing shock, liver injury or DIC.</li></ul>`,
keys:[['Heat stroke','> 40 °C + CNS signs'],['Early gas','Resp alkalosis'],['Exertional','Rhabdo: K⁺, CK, AKI']],
hook:'Cool first, gas second. Then watch the potassium.',
q:[['Construction worker, 41.5 °C, confused: pH 7.29, PCO₂ 26, HCO₃⁻ 12, lactate 7.8. Read?',['Pure respiratory alkalosis','HAGMA (lactic) with appropriate compensation','HAGMA plus respiratory acidosis','Normal for heat'],1,'Winter\'s predicts 26 ± 2: appropriate compensation.'],
['In exertional heat stroke, which electrolyte rises dangerously with muscle breakdown?',['Sodium','Potassium','Chloride','Calcium'],1,'Rhabdomyolysis releases intracellular potassium.']]});

lesson({id:'co',m:'clin',t:'Carbon monoxide and smoke inhalation',ex:{pH:7.31,pco2:33,hco3:16.2,po2:420,fio2:.8,na:140,cl:104,alb:42,lac:5.4,cohb:24,spo2:99,age:41},
sum:'Normal PaO₂ and SpO₂, raised COHb on co-oximetry, lactic acidosis. In fires, assume cyanide too if lactate is above 8.',
body:`<ul><li>Sources: indoor generators, charcoal or gas heaters in closed rooms, vehicle exhaust, house fires; occupationally, furnace and welding work in enclosed spaces.</li>
<li>Symptoms: headache, nausea, dizziness, confusion, chest pain, syncope; several people from one place.</li>
<li>Gas: PaO₂ normal or high (on oxygen), SpO₂ falsely normal, COHb elevated, lactate raised.</li>
<li>Treat with 100% oxygen immediately. Hyperbaric oxygen is considered for loss of consciousness, neurological signs, pregnancy with COHb above about 15–20%, cardiac ischaemia or very high COHb (often &gt; 25%), per local protocol.</li>
<li>Smoke inhalation with lactate &gt; 8 mmol/L, coma or shock: give hydroxocobalamin for presumed cyanide.</li>
<li>Delayed neuropsychological sequelae can appear days to weeks later; arrange follow-up.</li></ul>`,
keys:[['Diagnostic','Co-oximetry COHb'],['SpO₂','Falsely normal'],['Cyanide clue','Lactate > 8 in smoke']],
hook:'The oximeter says pink, the brain says otherwise. Ask for the COHb.',
q:[['Family with headaches in winter, all with SpO₂ 99%. Test?',['Pulse oximetry again','Co-oximetry COHb (venous is fine)','ABG PaO₂ only','CT head'],1,'Venous co-oximetry is adequate for COHb.'],
['House fire victim: lactate 10, hypotensive. Give?',['Methylene blue','Hydroxocobalamin','Bicarbonate only','Naloxone'],1,'Presumed cyanide toxicity.']]});

lesson({id:'methb',m:'clin',t:'Methaemoglobinaemia',ex:{pH:7.40,pco2:39,hco3:23.5,po2:210,fio2:.4,na:139,cl:105,alb:42,lac:2.6,methb:28,spo2:85,age:36},
sum:'Cyanosis with normal PaO₂ and SpO₂ stuck near 85%. Oxidising drugs or chemicals. Treat symptomatic or high levels with methylene blue, unless G6PD deficient.',
body:`<ul><li>Iron oxidised to Fe³⁺ cannot carry oxygen, and the remaining haem holds oxygen more tightly (left shift).</li>
<li><b>Drugs</b>: dapsone, benzocaine and lidocaine sprays, prilocaine, nitrates and nitrites ("poppers"), primaquine, rasburicase.</li>
<li><b>Occupational</b>: aniline dyes, nitrobenzene, nitrites, chlorates; well-water nitrates in infants.</li>
<li>Gas: normal PaO₂; co-oximetry MetHb high; saturation gap; blood chocolate-brown and does not turn red in air.</li>
<li>Treat: stop the agent, oxygen, methylene blue 1–2 mg/kg IV if symptomatic or MetHb above about 20–30%. In G6PD deficiency methylene blue can cause haemolysis and does not work: use exchange transfusion or high-dose ascorbic acid (specialist advice). Dapsone recurs over days.</li></ul>`,
keys:[['SpO₂','≈ 85%'],['Treat','Methylene blue 1–2 mg/kg'],['Avoid MB','G6PD deficiency']],
hook:'Blue patient, normal PaO₂, brown blood: methaemoglobin.',
q:[['Cyanosis after benzocaine throat spray; SpO₂ 86% on 40% O₂; PaO₂ 210. Next?',['Intubate','Co-oximetry for MetHb','CT pulmonary angiogram','Increase FiO₂ to 100%'],1,'Saturation gap with high PaO₂: dyshaemoglobin.'],
['Methylene blue is contraindicated in…',['Pregnancy always','G6PD deficiency','Children','Smokers'],1,'Risk of haemolysis and treatment failure.']]});

lesson({id:'preg',m:'clin',t:'Normal variants: pregnancy and altitude',ex:{pH:7.44,pco2:30,hco3:19.9,po2:104,fio2:.21,na:136,cl:105,alb:34,age:29},
sum:'Pregnancy: progesterone lowers PaCO₂ to ≈ 30 with HCO₃⁻ ≈ 19–20 and pH ≈ 7.44. At altitude: chronic respiratory alkalosis with lower PaO₂. Judge against these baselines.',
body:`<h3>Pregnancy</h3>
<ul><li>Progesterone stimulates ventilation: PaCO₂ 27–32 mmHg (3.6–4.3 kPa), HCO₃⁻ 18–21, pH 7.40–7.47, PaO₂ slightly higher (100–105).</li>
<li>A PaCO₂ of 40 in late pregnancy means hypoventilation (e.g. tiring asthma).</li>
<li>Lower bicarbonate means less buffer: DKA in pregnancy is more rapid and can occur at lower glucose.</li></ul>
<h3>Altitude</h3>
<ul><li>Low PiO₂ → hypoxaemia → hyperventilation → respiratory alkalosis; renal compensation over days.</li>
<li>Riyadh (≈ 610 m): small effect, PaO₂ a few mmHg below sea-level norms.</li>
<li>Abha (≈ 2,270 m): healthy residents may have PaO₂ in the 60s and PaCO₂ low 30s.</li>
<li>Acetazolamide speeds acclimatisation by inducing a NAGMA that drives ventilation.</li></ul>`,
keys:[['Pregnancy PaCO₂','≈ 30 mmHg'],['Pregnancy HCO₃⁻','18–21'],['Late pregnancy PaCO₂ 40','Hypoventilation']],
hook:'Pregnant women breathe for two: their normal CO₂ is 30.',
q:[['Third trimester asthmatic, PaCO₂ 41. Interpretation?',['Normal','Relative hypercapnia: tiring, dangerous','Respiratory alkalosis','Compensated'],1,'Her baseline should be about 30.'],
['Healthy person at 2,300 m: what is expected?',['Respiratory acidosis','Chronic respiratory alkalosis with lower PaO₂','Metabolic acidosis','Normal values'],1,'Hypoxic drive lowers PCO₂; kidneys compensate.']]});

/* ---------- AUTO ---------- */
lesson({id:'glance',m:'auto',t:'The glance sequence',
sum:'The six steps, compressed into four looks that take a few seconds each. Practise until you stop needing to think about the order.',
body:`<ol class="steps"><li><b>Look 1: pH.</b> Say "acid", "alkali" or "normal-but-check".</li>
<li><b>Look 2: PCO₂ against pH.</b> Opposite direction (pH down, CO₂ down) → metabolic. Same direction → respiratory. Both values moving against the pH → two disorders.</li>
<li><b>Look 3: one compensation number.</b> Metabolic acidosis: does PCO₂ ≈ the pH decimals (valid for pH ≈ 7.10–7.35)? Respiratory: did HCO₃⁻ move 1, 4, 2 or 5 per 10?</li>
<li><b>Look 4: gap and oxygen.</b> Na − Cl − HCO₃⁻ in your head. PaO₂ against FiO₂ (× 5 rule).</li></ol>
<h3>Shortcuts that make it fast</h3>
${tw('<tr><th>Situation</th><th>Shortcut</th></tr><tr><td>Metabolic acidosis</td><td>PCO₂ ≈ last two digits of pH (pH 7.10–7.35); or ≈ HCO₃⁻ + 15 (HCO₃⁻ 10–20 only)</td></tr><tr><td>Metabolic alkalosis</td><td>PCO₂ = 0.7 × HCO₃⁻ + 20 ± 5. The "HCO₃⁻ + 15" shortcut drifts above HCO₃⁻ ≈ 30, so use the formula.</td></tr><tr><td>Acute respiratory change</td><td>pH ± 0.08 per 10 mmHg</td></tr><tr><td>Chronic respiratory change</td><td>pH ± 0.03 per 10 mmHg</td></tr><tr><td>[H⁺]</td><td>80 − pH decimals</td></tr><tr><td>Expected PaO₂ on oxygen</td><td>FiO₂ % × 5</td></tr><tr><td>A–a normal</td><td>age/4 + 4</td></tr>')}
<h3>How to drill it</h3>
<ul><li>Reflex tab: Level 1 until ≥ 90% in under 8 seconds, then move up.</li>
<li>Say the read out loud in one sentence. Fluency in the sentence is fluency in the skill.</li>
<li>Mix levels once each is automatic.</li>
<li>Every real gas at work: read it before you look at anyone else's interpretation, then check with the Interpreter.</li></ul>`,
keys:[['Look 1','pH'],['Look 2','PCO₂ vs pH direction'],['Look 3','One compensation number'],['Look 4','Gap and oxygen']],
hook:'pH, partner, proof, the rest.',
q:[['pH 7.22, PCO₂ 22. With the shortcut, is compensation appropriate?',['Yes: PCO₂ ≈ 22','No: should be 40','No: should be 30','Cannot say'],0,'Expected PCO₂ ≈ the pH decimals: 22.'],
['pH 7.32, PCO₂ 50 acutely. Shortcut check?',['Consistent with acute resp acidosis','Must be chronic','Must be mixed','Inconsistent'],0,'10 mmHg acute rise → pH falls ≈ 0.08: 7.32.']]});
