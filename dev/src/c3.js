/* ---------- DISORDERS ---------- */
lesson({id:'read6',m:'dis',t:'The six-step read',ex:{pH:7.21,pco2:24,hco3:9.4,po2:112,fio2:.21,na:136,cl:101,alb:40,lac:1.4,glu:28,age:24,stem:'24-year-old with type 1 diabetes, two days of vomiting.'},
sum:'Same order, every gas: (1) is it real, (2) acid or alkali, (3) which system, (4) is compensation right, (5) the gaps, (6) oxygen. Then the cause.',
body:`<ol class="steps">
<li><b>Is it real?</b> Does it fit the patient and the sample (arterial or venous, FiO₂, delay)? If pH, PCO₂ and HCO₃⁻ seem not to fit, check with Henderson: [H⁺] = 24 × PCO₂ ÷ HCO₃⁻.</li>
<li><b>Acidaemia or alkalaemia?</b> pH &lt; 7.35 or &gt; 7.45. Normal pH does not mean normal gas.</li>
<li><b>Which system?</b> Which of PCO₂ or HCO₃⁻ moved in the direction that explains the pH? If both did, there are two primary disorders.</li>
<li><b>Compensation.</b> Metabolic acidosis: Winter's 1.5 × HCO₃⁻ + 8 ± 2. Metabolic alkalosis: 0.7 × HCO₃⁻ + 20 ± 5. Respiratory: HCO₃⁻ moves 1 or 4 (acidosis, acute or chronic) and 2 or 5 (alkalosis) per 10 mmHg. Outside the expected range → another disorder.</li>
<li><b>The gaps.</b> Anion gap (corrected for albumin) in every metabolic acidosis, delta ratio if the gap is high, osmolar gap if the cause is unclear. Check the AG even when the pH is normal.</li>
<li><b>Oxygen.</b> PaO₂ against FiO₂: P/F, A–a gradient, type of respiratory failure; co-oximetry if relevant.</li></ol>
<p>Then name the disorders in one line and match them to the clinical picture.</p>
<h3>Worked example</h3>
<p>24-year-old with diabetes, vomiting. pH 7.21, PaCO₂ 24, HCO₃⁻ 9.4, PaO₂ 112 (air), Na 136, Cl 101, glucose 28.</p>
<ol class="steps"><li>Henderson: 24 × 24 ÷ 9.4 ≈ 61; 80 rule at 7.21 ≈ 59. Consistent.</li>
<li>pH 7.21: acidaemia.</li>
<li>HCO₃⁻ low (explains acid), PCO₂ low (does not): metabolic acidosis.</li>
<li>Winter's: 1.5 × 9.4 + 8 = 22 ± 2 → 20–24. Measured 24: appropriate.</li>
<li>AG = 136 − (101 + 9.4) ≈ 26. Δ ratio = 14 ÷ 14.6 ≈ 1.0: pure high AG acidosis.</li>
<li>PaO₂ 112 on air: normal for a hyperventilating patient (PAO₂ = 150 − 24/0.8 = 120; A–a = 8, under the expected 24/4 + 4 = 10).</li></ol>
<p><b>Read</b>: high anion gap metabolic acidosis with appropriate respiratory compensation. With glucose 28: DKA. Check ketones and potassium.</p>
<p>Open this case with the "Open in the Interpreter" button on the worked gas card to see every step calculated.</p>`,
keys:[['Order','Real · pH · system · compensation · gaps · oxygen'],['Always','AG, even with normal pH']],
hook:'"Real, Acid, Who, Fair, Gaps, Air."',
q:[['In step 3, pH 7.20, PCO₂ 50, HCO₃⁻ 19. What do you conclude?',['Respiratory acidosis with renal compensation','Metabolic acidosis with respiratory compensation','Both respiratory and metabolic acidosis','Fully compensated respiratory acidosis'],2,'High PCO₂ and low HCO₃⁻ both push the pH down: two primary disorders. Step 1 passes: 24 × 50 ÷ 19 ≈ 63 nmol/L, which is pH ≈ 7.20.'],
['When should you calculate the anion gap?',['Only when the pH is below 7.20 on arrival','In every metabolic acidosis, and with a normal pH','Only when the lactate is above 4 mmol/L','Only on arterial samples, never on a VBG'],1,'A normal pH can hide HAGMA plus metabolic alkalosis.']]});

lesson({id:'hagma',m:'dis',t:'High anion gap metabolic acidosis',ex:{pH:7.17,pco2:18,hco3:6.3,po2:118,fio2:.21,na:140,cl:104,alb:38,lac:9.1,age:58,stem:'58-year-old on metformin, septic shock from a urinary source, creatinine 410 µmol/L.'},
sum:'An unmeasured acid has been added. GOLDMARK: Glycols, Oxoproline, L-lactate, D-lactate, Methanol, Aspirin, Renal failure, Ketoacidosis.',
body:`${tw('<tr><th>Letter</th><th>Cause</th><th>Clue</th></tr><tr><td>G</td><td>Glycols (ethylene, propylene)</td><td>Osmolar gap, oxalate crystals, AKI; propylene glycol from IV lorazepam infusions</td></tr><tr><td>O</td><td>5-Oxoproline</td><td>Chronic paracetamol, malnutrition, sepsis</td></tr><tr><td>L</td><td>L-lactate</td><td>Shock, sepsis, ischaemia, seizures, metformin, β₂-agonists</td></tr><tr><td>D</td><td>D-lactate</td><td>Short bowel; normal routine lactate</td></tr><tr><td>M</td><td>Methanol</td><td>Visual symptoms, osmolar gap</td></tr><tr><td>A</td><td>Aspirin (salicylate)</td><td>Tinnitus, plus respiratory alkalosis</td></tr><tr><td>R</td><td>Renal failure</td><td>High urea/creatinine; AG rarely &gt; 20 from uraemia alone</td></tr><tr><td>K</td><td>Ketoacidosis</td><td>Diabetic, alcoholic, starvation; blood BHB</td></tr>')}
<h3>Approach</h3>
<ol class="steps"><li>Measure lactate, glucose, BHB, urea/creatinine.</li>
<li>Does the lactate (plus ketones) account for the rise in AG? If not, check the osmolar gap and salicylate level, and think of toxic alcohols, 5-oxoproline and D-lactate.</li>
<li>Delta ratio for a hidden second disorder.</li></ol>
<h3>The worked gas</h3>
<p>Corrected AG ≈ 30, so the gap has risen by about 18. Lactate 9.1 explains only half of that. The rest needs a second anion: here, acute kidney injury (creatinine 410). If the kidneys were normal, check ketones, salicylate and the osmolar gap.</p>
<p>Older mnemonic MUDPILES (Methanol, Uraemia, DKA, Paraldehyde/Propylene glycol, Iron/Isoniazid, Lactate, Ethylene glycol, Salicylates) includes causes that act mainly through lactate.</p>`,
keys:[['Mnemonic','GOLDMARK'],['First labs','Lactate · glucose · BHB · creatinine'],['Unexplained gap','Osmolar gap, salicylate']],
hook:'GOLDMARK: if lactate and ketones do not fill the gap, go hunting.',
q:[['HAGMA, AG 28, lactate 1.2, BHB 0.3, normal creatinine, osmolar gap 28. Next?',['Treat as DKA with fixed-rate insulin','Fomepizole and toxic alcohol levels','Bicarbonate infusion and observe','Send a D-lactate level and wait'],1,'Unexplained gap with high osmolar gap = toxic alcohol until proven otherwise.'],
['Which HAGMA cause comes with a primary respiratory alkalosis?',['Methanol','Salicylate','Ethylene glycol','Uraemia'],1,'Salicylate stimulates the respiratory centre directly.']]});

lesson({id:'nagma',m:'dis',t:'Normal anion gap (hyperchloraemic) metabolic acidosis',ex:{pH:7.27,pco2:29,hco3:13,po2:104,fio2:.21,na:138,k:3.1,cl:115,alb:40,lac:1.3,age:30,stem:'30-year-old, five days of profuse watery diarrhoea.'},
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
['Day 2 of DKA treatment: AG 12, HCO₃⁻ 16, BHB 0.4. Interpretation?',['Persistent DKA: increase the insulin rate','Expected hyperchloraemic acidosis of recovery','New lactic acidosis from poor perfusion','Laboratory error: repeat the sample now'],1,'Ketones have cleared; the remaining acidosis is chloride-driven.']]});

lesson({id:'malk',m:'dis',t:'Metabolic alkalosis',ex:{pH:7.53,pco2:47,hco3:38.6,po2:84,fio2:.21,na:136,k:2.9,cl:86,alb:42,lac:1.1,age:45,stem:'45-year-old with heart failure, furosemide dose doubled a week ago.'},
sum:'Split by urine chloride. Low (< 20): vomiting, NG suction, prior diuretics, post-hypercapnia. High (> 20): current diuretics, mineralocorticoid excess, Bartter/Gitelman, severe hypokalaemia.',
body:`${tw('<tr><th>Urine Cl⁻</th><th>Blood pressure</th><th>Causes</th></tr><tr><td>&lt; 20 mmol/L (chloride responsive)</td><td>Normal / low</td><td>Vomiting, NG suction, remote diuretics, post-hypercapnia, villous adenoma, congenital chloride diarrhoea, cystic fibrosis</td></tr><tr><td rowspan="2">&gt; 20 mmol/L (chloride resistant)</td><td>High</td><td>Primary hyperaldosteronism, Cushing\'s, renovascular disease, liquorice, Liddle syndrome</td></tr><tr><td>Normal / low</td><td>Current diuretics, Bartter, Gitelman, severe hypokalaemia or hypomagnesaemia</td></tr>')}
<p>Urine Na⁺ is unreliable in vomiting (bicarbonaturia drags sodium out), which is why urine chloride is the test.</p>
<h3>Consequences</h3>
<ul><li>Hypoventilation (expected PCO₂ up to about 55–60); can worsen hypoxaemia in lung disease.</li>
<li>Hypokalaemia, low ionised calcium, arrhythmias, seizures when pH &gt; 7.6.</li></ul>
<h3>Treatment</h3>
<p>Chloride responsive: 0.9% saline and KCl. Stop the losses (antiemetics, PPI if NG suction). Chloride resistant: treat the cause; potassium-sparing diuretics. Acetazolamide in volume-overloaded patients.</p>`,
keys:[['Responsive','Urine Cl⁻ < 20 mmol/L'],['Resistant','Urine Cl⁻ > 20 mmol/L'],['Compensation','PCO₂ = 0.7·HCO₃⁻ + 20']],
hook:'Low urine chloride: give chloride. High urine chloride: look for a hormone or a diuretic.',
q:[['Hypertension, K⁺ 2.8, HCO₃⁻ 33, urine Cl⁻ 60. Most likely?',['Recurrent self-induced vomiting','Primary hyperaldosteronism','Bartter syndrome (salt wasting)','Recovery after hypercapnia'],1,'Chloride-resistant alkalosis with hypertension: mineralocorticoid excess.'],
['Why is urine sodium misleading after vomiting?',['The kidneys stop handling sodium at all','Bicarbonate in the urine drags sodium with it','Vomit contains a large amount of sodium','Urine sodium is always low after vomiting'],1,'Urine chloride better reflects volume status here.']]});

lesson({id:'racid',m:'dis',t:'Respiratory acidosis',ex:{pH:7.24,pco2:68,hco3:28.8,po2:58,fio2:.21,na:139,cl:100,alb:40,age:35,stem:'35-year-old found drowsy after a heroin overdose, previously well.'},
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
<p>COPD with pH &lt; 7.35 and PaCO₂ &gt; 6.5 kPa (≈ 49 mmHg) that persist after optimal medical therapy → non-invasive ventilation (BTS/ICS 2016; GOLD and many US sources use &gt; 45 mmHg). Decreasing consciousness, pH &lt; 7.25 not improving on NIV, or an exhausted asthmatic → intubation discussion.</p>`,
keys:[['Acute','HCO₃⁻ +1 / 10 mmHg'],['Chronic','HCO₃⁻ +4 / 10 mmHg'],['NIV trigger (COPD, BTS)','pH < 7.35 and PaCO₂ > 6.5 kPa (≈ 49 mmHg) despite optimal therapy']],
hook:'One for acute, four for chronic. The pH tells you how surprised the body is.',
q:[['PaCO₂ 70 after a heroin overdose. Expected HCO₃⁻ if purely acute?',['24','27','36','40'],1,'24 + 1 × 3 = 27.'],
['PaCO₂ 60, HCO₃⁻ 38. Interpretation?',['Chronic respiratory acidosis alone','Chronic resp acidosis + metabolic alkalosis','Acute respiratory acidosis alone','Acute-on-chronic respiratory acidosis'],1,'Chronic expected 24 + 8 = 32 (± 2). 38 is too high: an added metabolic alkalosis, e.g. diuretics or steroids.']]});

lesson({id:'ralk',m:'dis',t:'Respiratory alkalosis',ex:{pH:7.51,pco2:27,hco3:21.2,po2:68,fio2:.21,na:140,cl:105,alb:40,age:40,stem:'40-year-old, breathless and anxious, three days after a long-haul flight.'},
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
q:[['Anxious 30-year-old, PaCO₂ 28, PaO₂ 72 on air, sea level. A–a gradient?',['≈ 43, raised: look for PE or pneumonia','≈ 5, normal: this fits anxiety alone','≈ 0: hyperventilation explains it','≈ 20: borderline, repeat in an hour'],0,'PAO₂ = 150 − 35 = 115. A–a ≈ 43, well above ≈ 12 expected.'],
['Which respiratory disorder can fully normalise the pH?',['Acute respiratory acidosis','Chronic respiratory alkalosis','Acute respiratory alkalosis','Chronic respiratory acidosis'],1,'Chronic respiratory alkalosis (e.g. pregnancy, altitude) often has a normal pH.']]});

lesson({id:'mixed',m:'dis',t:'Mixed and hidden disorders',ex:{pH:7.42,pco2:24,hco3:15.3,po2:108,fio2:.21,na:140,cl:102,alb:40,lac:2.1,age:42,stem:'42-year-old, tinnitus and vomiting six hours after an aspirin overdose.'},
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
['Why can\'t there be two respiratory disorders at once?',['The two would cancel each other out','PCO₂ can only be high or low at one moment','The lungs cannot compensate twice over','They can: both often coexist'],1,'Only one PCO₂ value exists; metabolic processes can stack because they are separate acids and bases.']]});

lesson({id:'oxread',m:'dis',t:'The oxygenation read and dyshaemoglobins',
sum:'Read PaO₂ with FiO₂ and age, compute P/F and the A–a gradient, classify the failure, then ask whether haemoglobin itself is normal.',
body:`<ol class="steps"><li>Is the patient hypoxaemic for their FiO₂ and age?</li>
<li>P/F ratio (any FiO₂) and A–a gradient (room air ideally).</li>
<li>Normal A–a → hypoventilation (check PCO₂) or low PiO₂.</li>
<li>Raised A–a → V/Q mismatch, shunt or diffusion. Response to O₂ separates shunt.</li>
<li>Type 1 or type 2 failure; acute or chronic.</li>
<li>Saturation: does SpO₂ match SaO₂? If not, think CO, MetHb or a venous sample.</li></ol>
<h3>When the PaO₂ is normal but the tissues are not</h3>
${tw('<tr><th>Problem</th><th>PaO₂</th><th>SpO₂</th><th>Co-ox SaO₂</th><th>Clue</th></tr><tr><td>Carbon monoxide</td><td>Normal</td><td>Normal</td><td>Low (COHb high)</td><td>Headache, several people affected, fire, generator</td></tr><tr><td>Methaemoglobin</td><td>Normal</td><td>≈ 85%</td><td>Low (MetHb high)</td><td>Cyanosis, brown blood, nitrites, dapsone, benzocaine</td></tr><tr><td>Cyanide</td><td>Normal</td><td>Normal</td><td>Normal</td><td>Lactate ≥ 8–10 in smoke, high venous O₂</td></tr><tr><td>Anaemia</td><td>Normal</td><td>Normal</td><td>Normal</td><td>Low Hb, low content</td></tr>')}`,
keys:[['Saturation gap','> 5% → dyshaemoglobin'],['Cyanide clue','Lactate ≥ 8–10 + high ScvO₂']],
hook:'Normal PaO₂ only proves the lungs work. Check the haemoglobin and the cells.',
q:[['House fire, confused, SpO₂ 99%, PaO₂ 320 on NRB, lactate 10.5. Two toxins to treat?',['CO and cyanide','MetHb and CO','Cyanide only','None'],0,'Smoke inhalation: CO (needs co-oximetry) and cyanide (lactate ≥ 10 in smoke victims). Give 100% O₂ and hydroxocobalamin.'],
['Normal A–a gradient with hypoxaemia and PaCO₂ 75. Mechanism?',['Shunt','Hypoventilation','V/Q mismatch','Diffusion'],1,'Hypercapnia lowers alveolar O₂; the lungs transfer normally.']]});

/* ---------- CLINICAL ---------- */
lesson({id:'dka',m:'clin',t:'Diabetic ketoacidosis',ex:{pH:7.08,pco2:17,hco3:4.9,fio2:.21,na:131,k:5.6,cl:96,alb:44,lac:2.3,glu:31,age:19,sample:'v',stem:'19-year-old with type 1 diabetes, vomiting and Kussmaul breathing. K⁺ 5.6: no potassium in the first litre; recheck at 1–2 h.'},
sum:'HAGMA with Winter\'s compensation, glucose usually > 11 mmol/L, BHB ≥ 3. VBG is enough. Check K⁺ before insulin; if K⁺ < 3.5, replace it and hold insulin. Watch potassium, chloride and the AG during treatment.',
body:`<h3>Diagnosis (2024 international consensus)</h3>
<ul><li>Glucose ≥ 11.1 mmol/L (200 mg/dL) or known diabetes (glucose may be normal: SGLT2 inhibitors, pregnancy).</li>
<li>Ketones: blood BHB ≥ 3.0 mmol/L (or urine ketones ≥ 2+).</li>
<li>Acidosis: pH &lt; 7.30 and/or HCO₃⁻ &lt; 18 mmol/L. (UK JBDS uses HCO₃⁻ &lt; 15 mmol/L and/or venous pH &lt; 7.3.)</li></ul>
<h3>Typical gas</h3>
<p>Venous pH 7.0–7.25, HCO₃⁻ 5–15, PCO₂ by Winter's (Kussmaul breathing), AG 20–35, delta ratio ≈ 1. Sodium looks low because of hyperglycaemia (correct: + ≈ 2.4 per 5.5 mmol/L glucose above 5.5).</p>
<p>Winter's predicts the <b>arterial</b> PCO₂. Venous PCO₂ runs about 5 mmHg higher, so on a VBG subtract about 5 before you compare, or follow the trend. In the worked gas, PvCO₂ 17 ≈ PaCO₂ 12 and HCO₃⁻ 4.9 ≈ 3.9; Winter's gives 1.5 × 3.9 + 8 ≈ 14 ± 2, so the compensation is appropriate.</p>
<h3>First hours (JBDS 2023; ADA/EASD/JBDS 2024 consensus)</h3>
<ul><li>Fluid: 0.9% sodium chloride or a balanced crystalloid, 1 L in the first hour (smaller boluses in heart or kidney failure and in the young).</li>
<li>Fixed-rate IV insulin 0.1 units/kg/h; continue the patient's long-acting insulin.</li>
<li>Add 10% glucose (JBDS, at glucose &lt; 14 mmol/L) or 5–10% dextrose (ADA, at &lt; 13.9 mmol/L) and keep the insulin running until the ketones clear.</li></ul>
<h3>What the gas tells you during treatment</h3>
<ul><li>Check K⁺ before insulin. K⁺ &gt; 5.5 (JBDS; &gt; 5.0 ADA): no K⁺ in the fluid, recheck in 1–2 h. K⁺ 3.5–5.5: add 40 mmol/L KCl. K⁺ &lt; 3.5: give potassium and hold the insulin until K⁺ is above 3.5; get senior help.</li>
<li>A PCO₂ higher than Winter's predicts (e.g. HCO₃⁻ 6 with PCO₂ 30) means the patient is tiring or sedated: danger.</li>
<li>Resolution: BHB &lt; 0.6 and venous pH ≥ 7.3 (or HCO₃⁻ ≥ 18). A persistent low HCO₃⁻ with normal AG after ketones clear is saline-induced NAGMA, not ongoing DKA.</li>
<li>Delta ratio &gt; 2 at presentation suggests heavy vomiting (added metabolic alkalosis); the bicarbonate understates how sick the patient is.</li>
<li>Bicarbonate therapy is not routinely helpful; consider only if pH &lt; 7.0 per local protocol.</li></ul>`,
keys:[['BHB','≥ 3.0 mmol/L'],['Acidosis','pH < 7.3 and/or HCO₃⁻ < 18'],['Resolved','BHB < 0.6, pH ≥ 7.3'],['K⁺ < 3.5','Replace K⁺, hold insulin'],['Insulin','0.1 units/kg/h fixed rate']],
hook:'Fix fluids, then potassium, then insulin, and let the gas confirm each step.',
q:[['DKA: HCO₃⁻ 6, PCO₂ 31. What does the PCO₂ mean?',['Appropriate respiratory compensation for DKA','Too high: tiring or sedated, respiratory acidosis','Too low: an added respiratory alkalosis','Venous artefact: repeat as an arterial gas'],1,'Winter\'s: 1.5 × 6 + 8 = 17 ± 2. 31 is far too high: impending respiratory failure.'],
['Which sample suffices for DKA diagnosis and monitoring?',['Arterial','Venous','Capillary only','Urine'],1,'Venous pH, bicarbonate and electrolytes agree closely with arterial values.']]});

lesson({id:'sepsis',m:'clin',t:'Sepsis and septic shock',ex:{pH:7.38,pco2:23,hco3:13.2,po2:68,fio2:.28,na:137,cl:103,alb:29,lac:6.4,age:67,stem:'67-year-old with pneumonia, MAP 60 after 2 L of fluid: established sepsis.'},
sum:'Early respiratory alkalosis, then lactic acidosis. Low albumin hides part of the gap. Lactate and its clearance track severity.',
body:`<h3>Typical sequence</h3>
<ol class="steps"><li>Early: hyperventilation, PCO₂ 28–34, HCO₃⁻ normal → respiratory alkalosis.</li>
<li>Established: lactate rises → HAGMA with respiratory alkalosis (PCO₂ often below Winter's prediction).</li>
<li>Late: fatigue, ARDS → PCO₂ rises above Winter's → mixed metabolic and respiratory acidosis. A "normalising" PCO₂ in a septic patient with a low bicarbonate is a warning, not improvement.</li></ol>
<h3>Practical points</h3>
<ul><li>Correct the AG for albumin; septic patients often have albumin around 25 g/L, hiding about 4 mmol/L of anion.</li>
<li>Lactate &gt; 2 mmol/L suggests hypoperfusion: resuscitate and remeasure within 2–4 hours, aiming for a fall (SSC 2021).</li>
<li>Resuscitation (SSC 2021): 30 mL/kg crystalloid within 3 hours if hypoperfused, balanced crystalloids preferred, noradrenaline first line, target MAP ≥ 65 mmHg; capillary refill time is a useful extra guide.</li>
<li>The worked gas shows the established stage: HAGMA (corrected AG ≈ 24; lactate 6.4 explains about half the rise, AKI and other unmeasured anions the rest) with PCO₂ 23 below Winter's 28 ± 2, so an added respiratory alkalosis keeps the pH near normal.</li>
<li>Large-volume 0.9% saline adds a hyperchloraemic component; balanced crystalloids reduce it.</li>
<li>Hypoxaemia with a high A–a: pneumonia or ARDS; compute the P/F.</li></ul>`,
keys:[['Early','Respiratory alkalosis'],['Septic shock lactate','> 2 + vasopressors for MAP ≥ 65 despite fluids'],['Albumin','Correct the gap']],
hook:'In sepsis, a PCO₂ that stops falling while the bicarbonate keeps falling means the patient is tiring.',
q:[['Septic patient: HCO₃⁻ 14, PCO₂ 41. Meaning?',['Appropriate compensation for the acidosis','Added respiratory acidosis: tiring, get help','Added respiratory alkalosis from sepsis','Recovery: the bicarbonate is coming up'],1,'Expected 29 ± 2; 41 means failing ventilation.'],
['AG 13 with albumin 22 g/L. Corrected AG?',['13','17.5','22','8.5'],1,'13 + 0.25 × 18 = 17.5: raised.']]});

lesson({id:'asa',m:'clin',t:'Salicylate poisoning',ex:{pH:7.46,pco2:22,hco3:15.3,po2:112,fio2:.21,na:141,cl:104,alb:40,lac:2.4,age:32,stem:'32-year-old, 50 aspirin tablets 8 hours ago, tinnitus and sweating.'},
sum:'Primary respiratory alkalosis plus HAGMA, often with a near-normal pH. When the patient tires or is intubated, the pH crashes.',
body:`<p>Salicylate directly stimulates the respiratory centre (respiratory alkalosis within hours) and uncouples oxidative phosphorylation (lactate, ketones and salicylate itself raise the AG). Adults often present with a mixed picture; children with a dominant acidosis.</p>
<h3>Clues</h3>
<p>Tinnitus, vomiting, sweating, fever, tachypnoea, confusion; non-cardiogenic pulmonary oedema in severe cases. Gas: PCO₂ below Winter's prediction, AG raised, pH near normal or alkalaemic.</p>
<h3>Why acidaemia is dangerous</h3>
<p>Salicylic acid is a weak acid. As pH falls, more is un-ionised and crosses into the brain. Keeping the blood alkaline is therapy.</p>
<ul><li>Urinary alkalinisation with sodium bicarbonate (target urine pH 7.5–8.5): 8.4% sodium bicarbonate 1–2 mmol/kg IV bolus, then an infusion. Keep blood pH no higher than about 7.55.</li>
<li>Keep K⁺ normal (≥ 4): in hypokalaemia the kidney swaps H⁺ for K⁺ and the urine will not alkalinise.</li>
<li>If intubation is unavoidable, give a bicarbonate bolus first, match the patient's previous very high minute ventilation and recheck the gas quickly; a "normal" PCO₂ of 40 can be fatal.</li>
<li>Some analysers read salicylate as chloride (pseudohyperchloraemia), so the AG can look normal or even negative.</li>
<li>Haemodialysis (EXTRIP 2015). Recommended: salicylate &gt; 7.2 mmol/L (100 mg/dL); &gt; 6.5 mmol/L (90 mg/dL) with impaired kidney function; altered mental status; new hypoxaemia needing oxygen; or failure of standard therapy. Suggested: &gt; 6.5 mmol/L (90 mg/dL); &gt; 5.8 mmol/L (80 mg/dL) with impaired kidney function; or pH ≤ 7.20.</li></ul>`,
keys:[['Gas','Resp alkalosis + HAGMA'],['Danger','Acidaemia → CNS entry'],['Urine pH target','7.5–8.5']],
hook:'Aspirin breathes for you: low CO₂ with a gap. Never let it go acidic.',
q:[['Salicylate overdose, being intubated. Ventilator setting priority?',['Normal minute ventilation, aiming for PCO₂ 40','Match the high pre-intubation minute ventilation','Permissive hypercapnia to protect the lungs','Low tidal volume and low rate to rest the lungs'],1,'A sudden rise in PCO₂ drops pH and drives salicylate into the brain.'],
['Typical adult salicylate gas?',['Pure respiratory acidosis from sedation','Respiratory alkalosis plus high AG acidosis','Metabolic alkalosis from vomiting','Normal anion gap metabolic acidosis'],1,'Two primary disorders.']]});

lesson({id:'toxalc2',m:'clin',t:'Toxic alcohols in the emergency department',ex:{pH:7.18,pco2:18,hco3:6.5,po2:116,fio2:.21,na:140,cl:102,alb:41,lac:2,glu:6,urea:5,osm:322,age:44,stem:'44-year-old, blurred vision a day after drinking home-made spirits.'},
sum:'Unexplained HAGMA, osmolar gap, visual or renal clues. Block alcohol dehydrogenase early with fomepizole; dialyse for severe acidosis or organ damage.',
body:`<ul><li>Suspect with an unexplained AG (lactate and ketones do not explain it), an osmolar gap above about 10, a history of drinking homemade alcohol, antifreeze or windscreen fluid, visual blurring ("snowfield vision"), or AKI with calcium oxalate crystals.</li>
<li>Outbreaks of methanol poisoning from adulterated spirits occur worldwide; several patients arriving together with the same symptoms is a pattern.</li>
<li>Calculate the osmolar gap with Na⁺, glucose and urea in mmol/L; subtract ethanol's contribution if present.</li>
<li>Ethylene glycol can falsely raise the lactate on many blood gas analysers (glycolate is read as lactate). A gas lactate far above the laboratory lactate (a "lactate gap") is a clue.</li>
<li>Late presentation: the parent alcohol has been metabolised, so the osmolar gap may be small while the anion gap is large.</li>
<li>Isopropanol is the odd one out: it becomes acetone, so ketones are positive on the nitroprusside test, BHB is normal, the osmolar gap is high and there is no acidosis.</li></ul>
<h3>Treatment</h3>
<ul><li>Fomepizole blocks alcohol dehydrogenase: 15 mg/kg IV, then 10 mg/kg 12-hourly for 4 doses, then 15 mg/kg 12-hourly; dose more often during dialysis. If unavailable, ethanol to a blood level of 100–150 mg/dL (≈ 22–33 mmol/L).</li>
<li>Sodium bicarbonate for severe acidosis.</li>
<li>Methanol: folinic acid 1 mg/kg (max 50 mg) IV 4–6-hourly. Ethylene glycol: thiamine 100 mg and pyridoxine 50 mg IV.</li>
<li>Dialysis, methanol (EXTRIP 2015): coma, seizures, new visual loss, pH ≤ 7.15, AG &gt; 24, acidosis persisting despite antidote, or methanol &gt; 700 mg/L (≈ 22 mmol/L) on fomepizole.</li>
<li>Dialysis, ethylene glycol (EXTRIP 2023): coma, seizures or AKI, AG &gt; 27 (consider at 23–27), or EG &gt; 50 mmol/L or osmolar gap &gt; 50 on an antidote.</li>
<li>Check doses with your poisons service (TOXBASE in the UK).</li></ul>`,
keys:[['Calc osm','2Na + glucose + urea'],['Osmolar gap','> 10 suspicious'],['Antidote','Fomepizole 15 mg/kg, then 10 mg/kg 12-hourly'],['Dialyse (methanol)','pH ≤ 7.15, AG > 24, vision, coma'],['Dialyse (EG)','AG > 27, AKI, coma, seizures']],
hook:'High gap that lactate and ketones do not explain, high osmoles: block alcohol dehydrogenase now and confirm later.',
q:[['Na 140, glucose 6, urea 5, measured osm 322. Osmolar gap?',['11','31','41','0'],1,'Calculated = 280 + 6 + 5 = 291; gap = 31.'],
['Which toxic alcohol causes ketosis without acidosis?',['Methanol','Ethylene glycol','Isopropanol','Propylene glycol'],2,'It becomes acetone.']]});

lesson({id:'copd',m:'clin',t:'COPD exacerbation and NIV',ex:{pH:7.27,pco2:72,hco3:32.3,po2:52,fio2:.28,na:138,cl:95,alb:37,age:68,stem:'68-year-old with COPD, one hour after nebulisers on 28% Venturi oxygen.'},
sum:'Acute-on-chronic respiratory acidosis. Target SpO₂ 88–92%. NIV when pH < 7.35 and PaCO₂ > 6.5 kPa (≈ 49 mmHg) persist after optimal medical treatment (BTS/ICS 2016; GOLD and many US sources use > 45 mmHg).',
body:`<h3>Reading it</h3>
<ul><li>High HCO₃⁻ (renal compensation, often 30–40) shows the chronic retention.</li>
<li>A low pH shows the acute rise on top.</li>
<li>The pH, not the PaCO₂, sets the urgency.</li></ul>
<h3>Decisions</h3>
<ul><li>Controlled oxygen via Venturi (24–28%) to SpO₂ 88–92%; recheck the gas in 30–60 min after any change.</li>
<li>NIV (BTS/ICS 2016: pH &lt; 7.35 with PaCO₂ &gt; 6.5 kPa (≈ 49 mmHg) persisting after optimal medical treatment; GOLD and many US sources use &gt; 45 mmHg). pH &lt; 7.25 is higher risk for NIV failure; manage where intubation is available.</li>
<li>Recheck after 1–2 hours of NIV: improving pH and respiratory rate predicts success.</li>
<li>Post-hypercapnic alkalosis: after rapid ventilation the bicarbonate stays high; avoid over-ventilating intubated retainers.</li></ul>`,
keys:[['SpO₂ target','88–92%'],['NIV (BTS)','pH < 7.35 + PaCO₂ > 6.5 kPa'],['Recheck','1–2 h on NIV']],
hook:'High bicarb tells you the past; low pH tells you today.',
q:[['COPD: pH 7.31, PaCO₂ 64, HCO₃⁻ 31 after nebulisers and controlled O₂. Next?',['Increase oxygen to SpO₂ 98%','Start NIV','Intubate immediately','Give bicarbonate'],1,'Persistent hypercapnic acidosis meets NIV criteria.'],
['A known retainer has pH 7.38, PaCO₂ 58, HCO₃⁻ 33. Action?',['Start NIV now: PaCO₂ is above 6.5 kPa','Nothing urgent: compensated chronic hypercapnia','Intubate: a PaCO₂ of 58 is dangerously high','Stop all oxygen until the PaCO₂ falls'],1,'Compensated chronic respiratory acidosis.']]});

lesson({id:'asthma',m:'clin',t:'Acute severe asthma',ex:{pH:7.30,pco2:44,hco3:21,po2:63,fio2:.4,na:139,cl:102,alb:42,lac:3.1,age:22,stem:'22-year-old, three hours of back-to-back salbutamol, now quiet and tired.'},
sum:'Expect a low PCO₂. A normal PCO₂ (35–45) in a severe attack is life-threatening; a high one is near-fatal.',
body:`<p>In an asthma attack, the patient hyperventilates, so PCO₂ should be low. As airways close and muscles tire, PCO₂ climbs back through normal.</p>
${tw('<tr><th>Finding (BTS/SIGN, SIGN 158 acute section)</th><th>Severity</th></tr><tr><td>Any one of: PEF 33–50%, RR ≥ 25, HR ≥ 110, cannot complete sentences (the gas, if done, usually shows a low PCO₂)</td><td>Acute severe</td></tr><tr><td>Any one of: <b>"normal" PaCO₂ 4.6–6.0 kPa (35–45 mmHg)</b>, PaO₂ &lt; 8 kPa (60 mmHg), SpO₂ &lt; 92%, PEF &lt; 33%, exhaustion, silent chest, cyanosis, poor effort, arrhythmia, hypotension, altered consciousness</td><td>Life-threatening</td></tr><tr><td>Raised PaCO₂ and/or need for mechanical ventilation with raised inflation pressures</td><td>Near-fatal</td></tr>')}
<p>The 2024 BTS/NICE/SIGN guideline (NG245) covers chronic asthma; acute severity still comes from SIGN 158.</p>
<ul><li>A gas is indicated when SpO₂ &lt; 92% or there are life-threatening features.</li>
<li>Lactate often rises from salbutamol (type B); it does not by itself mean shock.</li>
<li>The worked gas: PaCO₂ 44 looks normal, but the lactate has pulled the HCO₃⁻ down to 21, so Winter's expects about 40 or less. She is no longer keeping up: life-threatening, with PaO₂ 63 on 40% too.</li>
<li>Rising PCO₂ → senior help, ICU, consider intubation. NIV is not a standard rescue in asthma.</li></ul>`,
keys:[['Life-threatening','PaCO₂ 35–45 in attack'],['Near-fatal','PaCO₂ raised'],['Lactate','Often from salbutamol']],
hook:'In asthma, a normal CO₂ is not normal.',
q:[['Severe asthma, PCO₂ 43, exhausted. Category?',['Moderate exacerbation','Acute severe asthma','Life-threatening asthma','Near-fatal asthma'],2,'A normal PCO₂ in a severe attack means tiring.'],
['Lactate 4.2 in an asthmatic on hourly salbutamol, warm and well perfused. Likely cause?',['Septic shock','β₂-agonist effect','Cyanide','Ischaemic bowel'],1,'Type B2 lactate from salbutamol.']]});

lesson({id:'pe',m:'clin',t:'Pulmonary embolism',ex:{pH:7.49,pco2:29,hco3:21.6,po2:62,fio2:.21,na:139,cl:104,alb:40,age:52,stem:'52-year-old, sudden pleuritic pain ten days after knee surgery.'},
sum:'Typical gas: respiratory alkalosis, hypoxaemia, raised A–a gradient. A normal gas does not exclude PE.',
body:`<ul><li>Dead space and reflex hyperventilation lower PCO₂; V/Q mismatch lowers PaO₂ and widens the A–a gradient.</li>
<li>Up to a fifth of patients with PE have a normal A–a gradient; never use the gas to rule PE out. Use clinical probability, D-dimer and imaging.</li>
<li>High-risk (massive) PE: shock, lactic acidosis, and sometimes rising PCO₂ from huge dead space despite high minute ventilation. The end-tidal CO₂ falls well below PaCO₂.</li>
<li>The gas does not enter Wells, Geneva or PERC scores (PERC uses SpO₂ ≥ 95%, not a gas). In the ESC 2019 risk strata, RV dysfunction and troponin decide intermediate risk; a lactate ≥ 2 mmol/L is an extra adverse sign.</li></ul>`,
keys:[['Typical','Resp alkalosis + raised A–a'],['Rule out?','Never by gas alone'],['High-risk (massive) PE','Lactate ↑, ETCO₂ ≪ PaCO₂']],
hook:'Low CO₂, low O₂, wide gradient, and a gas that cannot rule anything out.',
q:[['Which arterial gas finding excludes PE?',['A normal A–a gradient excludes PE','No gas finding excludes PE','A normal PaO₂ on air excludes PE','A normal PaCO₂ excludes PE'],1,'A normal A–a gradient occurs in a meaningful minority. Use clinical probability, D-dimer and imaging.'],
['Classic PE gas?',['Resp acidosis with a normal A–a','Resp alkalosis, hypoxaemia, raised A–a','Metabolic alkalosis, normal A–a','Normal anion gap acidosis, hypoxaemia'],1,'Hyperventilation plus V/Q mismatch.']]});

lesson({id:'vomit',m:'clin',t:'Vomiting and gastric loss',ex:{pH:7.55,pco2:46,hco3:39.8,po2:80,fio2:.21,na:134,k:2.8,cl:84,alb:45,lac:1.2,age:29,stem:'29-year-old, five days of vomiting from gastric outlet obstruction.'},
sum:'Hypochloraemic, hypokalaemic metabolic alkalosis with hypoventilation. Urine Cl⁻ < 20. Treat with saline and potassium.',
body:`<ul><li>Gastric HCl loss adds bicarbonate to blood; volume, chloride and potassium depletion maintain it.</li>
<li>Classic in pyloric stenosis in infants, bulimia, gastric outlet obstruction, hyperemesis gravidarum, high-output NG suction.</li>
<li>Expected PCO₂ = 0.7 × HCO₃⁻ + 20 (± 5). Hypoventilation can lower PaO₂ slightly.</li>
<li>During active vomiting, bicarbonate spills into the urine and drags Na⁺ and K⁺ with it: urine Na⁺ and K⁺ are high while urine Cl⁻ stays low. Later the kidney holds Na⁺ and excretes H⁺ instead, giving the paradoxical acid urine of pyloric stenosis.</li>
<li>Hidden vomiting (eating disorders) gives low urine Cl⁻ with denial of vomiting; diuretic misuse gives high urine Cl⁻ while taking them.</li>
<li>Treat with 0.9% saline with KCl; correct magnesium.</li></ul>`,
keys:[['Pattern','Low Cl⁻, low K⁺, high HCO₃⁻'],['Urine Cl⁻','< 20 mmol/L'],['Treat','0.9% NaCl + KCl']],
hook:'Lose acid from the top, gain alkali in the blood.',
q:[['Pyloric stenosis infant gas?',['Hyperchloraemic normal anion gap acidosis','Hypochloraemic hypokalaemic metabolic alkalosis','Respiratory alkalosis from crying','High anion gap acidosis from starvation'],1,'Loss of gastric HCl.'],
['Vomiting patient, HCO₃⁻ 40. Expected PCO₂?',['40','48','56','30'],1,'0.7 × 40 + 20 = 48 (± 5).']]});

lesson({id:'diarr',m:'clin',t:'Diarrhoea and dehydration',ex:{pH:7.24,pco2:27,hco3:11.3,po2:95,fio2:.21,na:136,k:3.0,cl:112,alb:44,lac:2.6,age:6,sample:'v',stem:'6-year-old, three days of watery diarrhoea, sunken eyes.'},
sum:'NAGMA with hypokalaemia from stool bicarbonate loss. Severe dehydration adds lactate and pre-renal AKI, raising the gap.',
body:`<ul><li>Small bowel and pancreatic fluid are rich in bicarbonate; stool HCO₃⁻ loss rises with volume.</li>
<li>Gas: low HCO₃⁻, high Cl⁻, normal AG, low K⁺, negative urine anion gap.</li>
<li>Severe dehydration (cholera, children with gastroenteritis): lactic acidosis and pre-renal AKI → AG rises, delta ratio 0.4–0.8 (mixed HAGMA and NAGMA).</li>
<li>Exceptions that cause a metabolic alkalosis instead: chronic laxative abuse when hypokalaemia dominates, some villous adenomas (chloride-rich mucus), and congenital chloride diarrhoea.</li>
<li>Treat with oral rehydration or balanced IV fluids and potassium; monitor the gas in severe cases.</li></ul>`,
keys:[['Pattern','NAGMA + low K⁺'],['UAG','Negative'],['Severe','+ lactic HAGMA']],
hook:'Bicarbonate goes out the bottom; chloride takes its place.',
q:[['Child with gastroenteritis: AG 19, HCO₃⁻ 10, delta ratio?',['0.5: mixed HAGMA + NAGMA','1.0: pure high gap acidosis','2.5: added metabolic alkalosis','0.1: pure normal gap acidosis'],0,'(19 − 12) ÷ (24 − 10) = 7 ÷ 14 = 0.5.'],
['Diarrhoea NAGMA with intact kidneys. Expected urine anion gap?',['Positive: the kidney is losing bicarbonate','Negative: the kidney excretes NH₄Cl','Zero: urine electrolytes are balanced','Cannot be used in children'],1,'Kidneys respond by excreting NH₄Cl, so urine chloride exceeds Na⁺ + K⁺.']]});

lesson({id:'renalfail',m:'clin',t:'Kidney failure',ex:{pH:7.30,pco2:28,hco3:13.2,po2:94,fio2:.21,na:136,cl:107,alb:33,lac:1.1,age:63,stem:'63-year-old with stage 5 CKD, missed two dialysis sessions.'},
sum:'CKD: NAGMA first, then HAGMA as GFR falls. Hyperkalaemia and fluid overload often travel with it.',
body:`<ul><li>Moderate CKD: falling ammoniagenesis → NAGMA with HCO₃⁻ around 18–22.</li>
<li>Advanced CKD (GFR &lt; 15–20): sulphate, phosphate and urate retained → HAGMA, typically AG up to about 20. A bigger gap needs another explanation.</li>
<li>AKI: rapid HAGMA plus hyperkalaemia. Acidosis that is refractory to medical treatment is a dialysis indication.</li>
<li>KDIGO 2024: consider treatment (oral bicarbonate or diet) when serum HCO₃⁻ is below 18 mmol/L; the 2012 threshold was 22. Benefit for kidney progression is uncertain (BiCARB trial negative); protecting bone and muscle is the stronger reason.</li></ul>`,
keys:[['Early CKD','NAGMA'],['Late CKD','HAGMA, AG ≈ 20'],['Dialysis','Refractory acidosis, K⁺, overload']],
hook:'Kidneys fail to make bicarbonate first, then fail to clear acids.',
q:[['ESKD patient, AG 32. What explains it?',['Uraemia alone: this is typical for ESKD','Another acid: check lactate, ketones, toxins','Low albumin is raising the measured gap','Laboratory error: repeat the sample'],1,'Uraemic acidosis rarely produces an AG much above 20.'],
['Which acid–base problem appears first in progressive CKD?',['HAGMA','NAGMA','Metabolic alkalosis','Respiratory acidosis'],1,'Reduced ammoniagenesis.']]});

lesson({id:'arrest',m:'clin',t:'Cardiac arrest and post-ROSC',ex:{pH:6.98,pco2:68,hco3:15.6,po2:72,fio2:1,na:141,cl:103,alb:36,lac:11.8,age:58,stem:'58-year-old, ten minutes after ROSC from an out-of-hospital VF arrest.'},
sum:'Mixed respiratory and lactic acidosis. After return of circulation, aim for normocapnia and SpO₂ 94–98%; avoid hyperoxia and over-ventilation.',
body:`<ul><li>During arrest: no ventilation and no flow → rising PCO₂ and lactate. Venous blood can be far more acidotic than arterial (the "venous paradox").</li>
<li>Post-ROSC: lactate typically 5–15 mmol/L; clearance over hours is prognostic.</li>
<li>Ventilate to PaCO₂ 35–45 mmHg; hyperventilation causes cerebral vasoconstriction.</li>
<li>Titrate oxygen to SpO₂ 94–98% (or PaO₂ ≈ 75–100) once a reliable reading exists.</li>
<li>Routine sodium bicarbonate is not recommended; consider for hyperkalaemia or tricyclic overdose.</li>
<li>Avoid hypoxaemia as much as hyperoxia: keep PaO₂ above 8 kPa (60 mmHg). The worked gas (PaO₂ 72 on FiO₂ 1.0, P/F 72) needs PEEP and a look for aspiration or pulmonary oedema, not less oxygen.</li>
<li>End-tidal CO₂ during CPR reflects cardiac output: persistently below about 10 mmHg after 20 minutes is a poor sign, but never a reason on its own to stop; a sudden rise suggests ROSC.</li></ul>`,
keys:[['PaCO₂ post-ROSC','35–45 mmHg'],['SpO₂ post-ROSC','94–98%'],['ETCO₂ rise','Suggests ROSC']],
hook:'After ROSC: normal CO₂, not too much oxygen, and follow the lactate.',
q:[['Post-ROSC gas: PaO₂ 380 on FiO₂ 1.0. Action?',['Leave it: more oxygen protects the brain','Reduce FiO₂ to SpO₂ 94–98%','Increase PEEP to recruit the lungs','Give sodium bicarbonate now'],1,'Hyperoxia is associated with worse outcomes; titrate down.'],
['Ideal PaCO₂ after ROSC?',['25–30 mmHg (3.3–4.0 kPa)','35–45 mmHg (4.7–6.0 kPa)','50–60 mmHg (6.7–8.0 kPa)','Any value if the SpO₂ is normal'],1,'Normocapnia.']]});

lesson({id:'opioid',m:'clin',t:'Opioid and sedative overdose',ex:{pH:7.18,pco2:78,hco3:28.3,po2:45,fio2:.21,na:140,cl:104,alb:41,lac:1.6,age:27,stem:'27-year-old found unresponsive with pinpoint pupils, breathing 4 a minute.'},
sum:'Acute respiratory acidosis with hypoxaemia and a normal A–a gradient. A raised gradient means aspiration or pulmonary oedema.',
body:`<ul><li>HCO₃⁻ rises about 1 per 10 mmHg (acute chemistry only).</li>
<li>A–a normal → hypoventilation explains it. A–a raised → aspiration pneumonia, non-cardiogenic pulmonary oedema (heroin, naloxone), or atelectasis.</li>
<li>Naloxone: titrate to breathing, not to full alertness. Small IV doses (for example 100 micrograms, repeated every 1–2 minutes) avoid sudden withdrawal in dependent patients; the BNF adult starting dose is 400 micrograms IV or IM, repeated. It wears off before many opioids: watch for re-sedation.</li>
<li>Recheck the gas, or watch the respiratory rate and ETCO₂. Oxygen keeps the SpO₂ normal while the CO₂ keeps rising unseen.</li>
<li>Benzodiazepines cause the same gas but milder. Flumazenil is not routine: it can cause seizures in mixed or tricyclic overdose and in benzodiazepine dependence.</li>
<li>Mixed overdoses: alcohol, benzodiazepines, and drugs that also cause metabolic acidosis (e.g. metformin, salicylate) can complicate the picture.</li></ul>`,
keys:[['Gas','Acute resp acidosis'],['A–a','Normal unless aspiration'],['HCO₃⁻','+1 per 10 mmHg']],
hook:'Pure hypoventilation: everything is explained by the CO₂.',
q:[['Overdose, 28 years old, room air, sea level: PaCO₂ 80, PaO₂ 45. A–a?',['≈ 5: pure hypoventilation','≈ 45: aspiration likely','≈ 20: mild V/Q mismatch','Cannot compute on air'],0,'PAO₂ = 150 − 80/0.8 = 50; A–a = 5, within the expected ≤ 11 (28/4 + 4).'],
['Same patient, PaO₂ 30. A–a and meaning?',['≈ 20: raised, so aspiration or oedema','≈ 5: still pure hypoventilation','≈ 80: severe shunt from oedema','≈ 0: the oxygen is used up'],0,'A–a = 50 − 30 = 20, above the expected ≤ 11 (28/4 + 4): lung pathology too.']]});

lesson({id:'heat',m:'clin',t:'Heat stroke and exertional illness',ex:{pH:7.29,pco2:26,hco3:12.2,po2:102,fio2:.21,na:146,cl:108,alb:44,lac:7.8,age:34,temp:41.5,stem:'34-year-old construction worker, 41.5 °C rectal, confused, July afternoon. The analyser reports at 37 °C.'},
sum:'Early respiratory alkalosis from hyperventilation, then lactic acidosis. Exertional heat stroke adds rhabdomyolysis: hyperkalaemia, AKI and a rising gap.',
body:`<p>Heat stroke: core temperature above 40 °C with CNS dysfunction (it may be lower if cooling has already started). In outdoor labourers, athletes and pilgrims in hot climates it is a time-critical emergency; cooling comes before investigation.</p>
<h3>Cooling</h3>
<ul><li>Cold-water immersion is best (cools at ≥ 0.15 °C per minute); if not possible, ice-water towels rotated over the body, or wet skin with fanning.</li>
<li>Aim to get below 39 °C within 30 minutes of collapse: cool first, transport second.</li>
<li>Stop at about 38.6–39 °C to avoid overshoot into hypothermia. Measure rectal temperature.</li></ul>
<h3>The gas over time</h3>
<ul><li><b>Early</b>: hyperventilation → respiratory alkalosis; hypokalaemia and hypophosphataemia from shifts.</li>
<li><b>Established</b>: lactic acidosis (high metabolic demand, hypoperfusion) → HAGMA, often with continuing respiratory alkalosis (mixed).</li>
<li><b>Exertional</b>: rhabdomyolysis releases potassium, phosphate and organic acids; AKI follows. Watch K⁺ and creatine kinase.</li></ul>
<h3>Points</h3>
<ul><li>The analyser reports at 37 °C; true PaO₂ and PaCO₂ at 41 °C are higher. Interpret uncorrected values and treat.</li>
<li>Hypernatraemia from sweat and water loss; hyponatraemia in exercise-associated hyponatraemia (EAH) from drinking too much hypotonic fluid.</li>
<li>Persistent lactate after cooling suggests ongoing shock, liver injury or DIC.</li></ul>`,
keys:[['Heat stroke','> 40 °C + CNS signs'],['Early gas','Resp alkalosis'],['Exertional','Rhabdo: K⁺, CK, AKI']],
hook:'Cool first, gas second. Then watch the potassium.',
q:[['Construction worker, 41.5 °C, confused: pH 7.29, PCO₂ 26, HCO₃⁻ 12, lactate 7.8. Read?',['Pure respiratory alkalosis from the heat','HAGMA (lactic) with appropriate compensation','HAGMA plus an added respiratory acidosis','Normal for heat: no action needed'],1,'Winter\'s predicts 26 ± 2: appropriate compensation.'],
['In exertional heat stroke, which electrolyte rises dangerously with muscle breakdown?',['Sodium','Potassium','Chloride','Calcium'],1,'Rhabdomyolysis releases intracellular potassium.']]});

lesson({id:'co',m:'clin',t:'Carbon monoxide and smoke inhalation',ex:{pH:7.31,pco2:33,hco3:16.2,po2:420,fio2:.8,na:140,cl:104,alb:42,lac:5.4,cohb:24,spo2:99,age:41,stem:'41-year-old pulled from a house fire, drowsy, on 80% oxygen.'},
sum:'Normal PaO₂ and SpO₂, raised COHb on co-oximetry, lactic acidosis. In smoke inhalation, suspect cyanide too if lactate is ≥ 10 (some use ≥ 8) with coma, shock or arrest.',
body:`<ul><li>Sources: indoor generators, charcoal or gas heaters in closed rooms, vehicle exhaust, house fires; occupationally, furnace and welding work in enclosed spaces, and methylene chloride paint strippers (the liver turns it into CO, so COHb rises late and stays up longer).</li>
<li>Normal COHb: below 3% in non-smokers; smokers up to about 10%.</li>
<li>Symptoms: headache, nausea, dizziness, confusion, chest pain, syncope; several people from one place.</li>
<li>Gas: PaO₂ normal or high (on oxygen), SpO₂ falsely normal, COHb elevated, lactate raised.</li>
<li>Treat with 100% oxygen immediately. Hyperbaric oxygen is considered for loss of consciousness, neurological signs, pregnancy with COHb above about 15–20%, cardiac ischaemia, severe acidosis (pH &lt; 7.1) or very high COHb (often &gt; 25%). The evidence is mixed (one positive and one negative large trial; Cochrane: insufficient evidence), so discuss with the regional hyperbaric unit.</li>
<li>Smoke inhalation with lactate ≥ 10 mmol/L (some use ≥ 8), with coma, shock or arrest: suspect cyanide and give hydroxocobalamin 5 g IV (70 mg/kg in children).</li>
<li>Delayed neuropsychological sequelae can appear days to weeks later; arrange follow-up.</li></ul>`,
keys:[['Diagnostic','Co-oximetry COHb'],['SpO₂','Falsely normal'],['Cyanide clue','Lactate ≳ 8–10 in smoke']],
hook:'The oximeter says pink, the brain says otherwise. Ask for the COHb.',
q:[['Family with headaches in winter, all with SpO₂ 99%. Test?',['Repeat pulse oximetry on each','Co-oximetry COHb (venous is fine)','Arterial gas for the PaO₂ only','CT head for the first patient'],1,'Venous co-oximetry is adequate for COHb.'],
['House fire victim: lactate 10, hypotensive. Give?',['Methylene blue','Hydroxocobalamin','Bicarbonate only','Naloxone'],1,'Presumed cyanide toxicity.']]});

lesson({id:'methb',m:'clin',t:'Methaemoglobinaemia',ex:{pH:7.40,pco2:39,hco3:23.5,po2:210,fio2:.4,na:139,cl:105,alb:42,lac:2.6,methb:28,spo2:85,age:36,stem:'36-year-old, grey-blue lips after benzocaine throat spray for endoscopy.'},
sum:'Cyanosis with normal PaO₂ and SpO₂ stuck near 85%. Oxidising drugs or chemicals. Treat symptomatic or high levels with methylene blue; avoid it in G6PD deficiency and check for serotonergic drugs.',
body:`<ul><li>Iron oxidised to Fe³⁺ cannot carry oxygen, and the remaining haem holds oxygen more tightly (left shift).</li>
<li><b>Drugs</b>: dapsone, benzocaine and lidocaine sprays, prilocaine, nitrates and nitrites ("poppers"), primaquine, rasburicase.</li>
<li><b>Occupational</b>: aniline dyes, nitrobenzene, nitrites, chlorates; well-water nitrates in infants.</li>
<li>Gas: normal PaO₂; co-oximetry MetHb high; saturation gap; blood chocolate-brown and does not turn red in air.</li>
<li>Why the oximeter reads ≈ 85%: MetHb absorbs red and infrared light about equally, so the oximeter's light ratio drifts towards 1, which it reports as about 85% whatever the true saturation. Extra oxygen raises the PaO₂ but barely moves the reading.</li>
<li>Treat: stop the agent and give oxygen. Methylene blue 1–2 mg/kg IV over 5 minutes if symptomatic or MetHb above about 20–30%; repeat once after 30–60 minutes if needed. Treat at lower levels with anaemia or heart or lung disease. Dapsone recurs over days.</li>
<li>Methylene blue is a potent MAO inhibitor: it can cause serotonin syndrome with SSRIs, SNRIs, clomipramine, linezolid and other serotonergic drugs (FDA warning 2011).</li>
<li>In G6PD deficiency methylene blue may not work and can cause haemolysis: get specialist advice; options include exchange transfusion or high-dose ascorbic acid.</li></ul>`,
keys:[['SpO₂','≈ 85%'],['Treat','Methylene blue 1–2 mg/kg over 5 min'],['Avoid MB','G6PD deficiency'],['MB caution','Serotonin syndrome with SSRIs, SNRIs, linezolid']],
hook:'Blue patient, normal PaO₂, brown blood: methaemoglobin.',
q:[['Cyanosis after benzocaine throat spray; SpO₂ 86% on 40% O₂; PaO₂ 210. Next?',['Intubate','Co-oximetry for MetHb','CT pulmonary angiogram','Increase FiO₂ to 100%'],1,'Saturation gap with high PaO₂: dyshaemoglobin.'],
['Methylene blue should be avoided in…',['Pregnancy always','G6PD deficiency','Children','Smokers'],1,'Risk of haemolysis and treatment failure.']]});

lesson({id:'preg',m:'clin',t:'Pregnancy: normal values',ex:{pH:7.44,pco2:30,hco3:19.9,po2:104,fio2:.21,na:136,cl:105,alb:34,age:29,stem:'29-year-old, 30 weeks pregnant, well, routine sample.'},
sum:'Pregnancy: progesterone lowers PaCO₂ to ≈ 30 with HCO₃⁻ ≈ 19–20 and pH ≈ 7.44. Judge every pregnant gas against this baseline.',
body:`<h3>Pregnancy</h3>
<ul><li>Progesterone stimulates ventilation: PaCO₂ 27–32 mmHg (3.6–4.3 kPa), HCO₃⁻ 18–21, pH 7.40–7.47, PaO₂ slightly higher (100–105).</li>
<li>The Interpreter calls the worked gas a compensated (chronic) respiratory alkalosis. In pregnancy that is the expected, normal reading.</li>
<li>A PaCO₂ of 40 in late pregnancy means hypoventilation (e.g. tiring asthma).</li>
<li>Lower bicarbonate means less buffer, so DKA develops faster. Fetal glucose uptake means it can occur at near-normal glucose (euglycaemic DKA).</li>
<li>Keep SpO₂ ≥ 95% (PaO₂ &gt; 70 mmHg): the fetus sits on the steep part of its own curve, so a small maternal fall costs it a lot of oxygen.</li></ul>
<p>Emergencies in pregnancy (ventilation targets, hyperemesis, magnesium) and altitude have their own lessons in Special groups.</p>`,
keys:[['Pregnancy PaCO₂','≈ 30 mmHg'],['Pregnancy HCO₃⁻','18–21'],['Late pregnancy PaCO₂ 40','Hypoventilation']],
hook:'Pregnant women breathe for two: their normal CO₂ is 30.',
q:[['Third trimester asthmatic, PaCO₂ 41. Interpretation?',['Normal for the third trimester','Relative hypercapnia: tiring, dangerous','Compensated respiratory alkalosis','Hyperventilation from anxiety'],1,'Her baseline should be about 30.'],
['pH 7.44, PaCO₂ 30, HCO₃⁻ 20 at 30 weeks, well. Read?',['Normal for pregnancy: no action','Respiratory alkalosis: look for PE','Metabolic acidosis: check lactate','Mixed disorder: check the gap'],0,'Progesterone sets the PaCO₂ near 30 and the kidneys lower HCO₃⁻ to match. A well woman with this gas needs nothing.']]});

/* ---------- AUTO ---------- */
lesson({id:'glance',m:'auto',t:'The glance sequence',
sum:'The six steps, compressed into four looks that take a few seconds each. Practise until you stop needing to think about the order.',
body:`<ol class="steps"><li><b>Look 1: pH.</b> Say "acid", "alkali" or "normal-but-check".</li>
<li><b>Look 2: PCO₂ against pH (ROME).</b> Same direction (pH down with CO₂ down, or pH up with CO₂ up) → metabolic. Opposite direction (pH down with CO₂ up, or pH up with CO₂ down) → respiratory. If PCO₂ and HCO₃⁻ both push the pH the same way (high CO₂ with low HCO₃⁻, or low CO₂ with high HCO₃⁻) → two primary disorders.</li>
<li><b>Look 3: one compensation number.</b> Metabolic acidosis: does PCO₂ ≈ the pH decimals (valid for pH about 7.15–7.35)? Respiratory: did HCO₃⁻ move 1, 4, 2 or 5 per 10?</li>
<li><b>Look 4: gap and oxygen.</b> Na − Cl − HCO₃⁻ in your head. PaO₂ against FiO₂ (× 5 rule).</li></ol>
<h3>Shortcuts that make it fast</h3>
${tw('<tr><th>Situation</th><th>Shortcut</th></tr><tr><td>Metabolic acidosis</td><td>PCO₂ ≈ last two digits of pH (pH about 7.15–7.35); or ≈ HCO₃⁻ + 15 (HCO₃⁻ about 10–18 only)</td></tr><tr><td>Metabolic alkalosis</td><td>PCO₂ = 0.7 × HCO₃⁻ + 20 ± 5. The "HCO₃⁻ + 15" shortcut drifts above HCO₃⁻ ≈ 30, so use the formula.</td></tr><tr><td>Acute respiratory change</td><td>pH ± 0.08 per 10 mmHg</td></tr><tr><td>Chronic respiratory change</td><td>pH ± 0.03 per 10 mmHg</td></tr><tr><td>[H⁺]</td><td>80 − pH decimals</td></tr><tr><td>Expected PaO₂ on oxygen</td><td>FiO₂ % × 5</td></tr><tr><td>A–a normal</td><td>age/4 + 4</td></tr>')}
<h3>How to drill it</h3>
<ul><li>In <button class="linkbtn" data-go="practice">Practice</button>, choose Reflex: stay on Level 1 until ≥ 90% in under 8 seconds, then move up.</li>
<li>Say the read out loud in one sentence. Fluency in the sentence is fluency in the skill.</li>
<li>Mix levels once each is automatic.</li>
<li>Every real gas at work: read it before you look at anyone else's interpretation, then check with the Interpreter.</li></ul>`,
keys:[['Look 1','pH'],['Look 2','PCO₂ vs pH direction'],['Look 3','One compensation number'],['Look 4','Gap and oxygen']],
hook:'pH, partner, proof, the rest.',
q:[['pH 7.22, PCO₂ 22. With the shortcut, is compensation appropriate?',['Yes: it fits the shortcut','No: the PCO₂ is too low','No: the PCO₂ is too high','Cannot say without HCO₃⁻'],0,'Expected PCO₂ ≈ the pH decimals: 22.'],
['pH 7.32, PCO₂ 50 acutely. Shortcut check?',['Consistent with acute respiratory acidosis','Must be chronic: the pH should be higher','Must be mixed with a metabolic acidosis','Inconsistent: the numbers do not fit'],0,'10 mmHg acute rise → pH falls ≈ 0.08: 7.32.']]});
