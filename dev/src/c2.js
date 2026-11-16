/* ---------- KIDNEY & COMPENSATION ---------- */
lesson({id:'renal',m:'kid',t:'How the kidney handles bicarbonate',
sum:'Two jobs: reclaim the 4,300 mmol of HCO₃⁻ filtered each day, and make new HCO₃⁻ to replace what fixed acid consumed, mainly by excreting ammonium.',
body:`<h3>1. Reclaim (proximal tubule, ≈ 80–90%)</h3>
<p>Filtered load ≈ 180 L/day × 24 mmol/L ≈ 4,300 mmol. In the proximal tubule cell, H⁺ is secreted into the lumen by the Na⁺/H⁺ exchanger (NHE3). It meets filtered HCO₃⁻, and luminal carbonic anhydrase turns them into CO₂ and water. CO₂ diffuses into the cell, is rebuilt into HCO₃⁻, and leaves into blood. Net effect: filtered bicarbonate returned, no acid excreted.</p>
<h3>2. Regenerate (new bicarbonate)</h3>
<ul><li><b>Ammoniagenesis</b>: proximal cells metabolise glutamine into 2 NH₄⁺ and 2 new HCO₃⁻. NH₄⁺ is excreted. This is the adaptable route; it rises several-fold in chronic acidosis over 3–5 days.</li>
<li><b>Titratable acid</b>: secreted H⁺ is buffered by filtered phosphate (HPO₄²⁻ → H₂PO₄⁻). Fairly fixed by phosphate intake.</li></ul>
<h3>3. Fine-tune (collecting duct)</h3>
<p>α-intercalated cells secrete H⁺ by H⁺-ATPase and H⁺/K⁺-ATPase; β-intercalated cells secrete HCO₃⁻ (via pendrin) when alkalotic. Aldosterone stimulates H⁺ and K⁺ secretion, linking acid–base to potassium and volume.</p>
<p>What makes the kidney hold on to more bicarbonate (reclaim and regenerate): high PaCO₂, low ECF volume, angiotensin II (proximal), aldosterone (distal), hypokalaemia.</p>
<h3>The daily balance</h3>
<div class="eq">Net acid excretion = NH₄⁺ + titratable acid − urine HCO₃⁻</div>
<p>A typical diet makes about 1 mmol/kg/day of fixed acid (50–100 mmol). In balance, net acid excretion matches it. Each mmol of acid excreted means one new HCO₃⁻ returned to the blood.</p>`,
keys:[['Filtered HCO₃⁻','≈ 4,300 mmol/day'],['Proximal reclaim','≈ 80–90%'],['Main adaptable acid excretion','NH₄⁺']],
hook:'Reclaim the old, make the new, fine-tune at the end.',
q:[['Which process allows the kidney to increase acid excretion most in chronic acidosis?',['Titratable acid','Ammoniagenesis','Proximal HCO₃⁻ reclaim','Pendrin'],1,'Glutamine metabolism to NH₄⁺ can rise several-fold over days.'],
['Proximal bicarbonate reclaim depends on which enzyme?',['Lactate dehydrogenase','Carbonic anhydrase','Alcohol dehydrogenase','Glutaminase'],1,'Luminal and cytosolic carbonic anhydrase; acetazolamide blocks it.']]});

lesson({id:'rta',m:'kid',t:'Renal tubular acidosis and the urine anion gap',ex:{pH:7.31,pco2:29,hco3:14,po2:102,fio2:.21,na:138,k:3.0,cl:114,alb:40,lac:1.0,glu:5.4,age:34},
sum:'RTA is a normal anion gap acidosis from the kidney. The urine anion gap (Na + K − Cl) separates gut losses (negative) from distal renal causes (positive).',
body:`${tw('<tr><th></th><th>Type 1 (distal)</th><th>Type 2 (proximal)</th><th>Type 4 (hypoaldosteronism)</th></tr><tr><td>Defect</td><td>Cannot secrete H⁺ distally</td><td>Cannot reclaim HCO₃⁻ proximally</td><td>Low aldosterone effect</td></tr><tr><td>Plasma K⁺</td><td>Low</td><td>Low</td><td><b>High</b></td></tr><tr><td>Urine pH</td><td>Usually &gt; 5.5 despite acidosis</td><td>&lt; 5.5 once plasma HCO₃⁻ is low</td><td>&lt; 5.5</td></tr><tr><td>Urine AG</td><td>Positive</td><td>Usually negative (distal acidification intact)</td><td>Positive</td></tr><tr><td>HCO₃⁻</td><td>Can be very low (&lt; 10)</td><td>Usually 12–20</td><td>Usually &gt; 17</td></tr><tr><td>Clues</td><td>Calcium phosphate stones, nephrocalcinosis</td><td>Fanconi: glycosuria, phosphaturia, aminoaciduria</td><td>Diabetes, ACE-i/ARB, spironolactone, trimethoprim</td></tr><tr><td>Causes</td><td>Sjögren, SLE, amphotericin, lithium</td><td>Myeloma, tenofovir, ifosfamide, acetazolamide</td><td>Diabetic nephropathy, drugs, adrenal insufficiency</td></tr>')}
<ul><li><b>Hyperkalaemic distal RTA</b> (obstructive uropathy, sickle cell disease, amiloride) behaves like type 1 for urine pH, but plasma K⁺ is high.</li>
<li><b>Where is type 3?</b> A rare mixed proximal and distal form (carbonic anhydrase II deficiency). Most texts no longer list it separately.</li></ul>
<h3>Urine anion gap (UAG)</h3>
<div class="eq">UAG = urine Na⁺ + urine K⁺ − urine Cl⁻</div>
<p>NH₄⁺ is the unmeasured urinary cation, excreted with Cl⁻. A kidney responding properly to acidosis excretes lots of NH₄Cl, so Cl⁻ exceeds Na⁺ + K⁺ and the gap is <b>negative</b>: the gut is losing bicarbonate ("neGUTive"). A <b>positive</b> gap means low NH₄⁺: the kidney is the problem (distal RTA, type 4). Proximal (type 2) RTA is renal but usually gives a negative gap at steady state, because distal NH₄⁺ excretion still works.</p>
<p class="note"><b>Worked gas.</b> A 34-year-old with five days of watery diarrhoea: pH 7.31, PCO₂ 29, HCO₃⁻ 14, Na⁺ 138, Cl⁻ 114, K⁺ 3.0. AG = 138 − 128 = 10: normal gap. Winter's: 1.5 × 14 + 8 = 29, so compensation is appropriate. Urine Na⁺ 30, K⁺ 25, Cl⁻ 95: UAG = −40, negative. The kidney is excreting NH₄⁺ properly; the gut is the cause.</p>
<p>The UAG fails when other anions (ketones, hippurate, drugs) are in the urine or when urine Na⁺ is below about 20 mmol/L. The urine osmolal gap is then more reliable.</p>`,
keys:[['UAG negative','Gut loss (diarrhoea)'],['UAG positive','Renal (distal or type 4 RTA)'],['Hyperkalaemic RTA','Type 4']],
hook:'"neGUTive" urine anion gap: the gut is guilty.',
q:[['NAGMA with plasma K⁺ 6.1 in a diabetic on ramipril. Most likely?',['Type 1 RTA','Type 2 RTA','Type 4 RTA','Diarrhoea'],2,'Hyperkalaemic RTA from hypoaldosteronism, worsened by ACE inhibition.'],
['NAGMA, urine Na 40, K 30, Cl 110. UAG and meaning?',['+40; poor NH₄⁺ excretion, likely distal RTA','−40; appropriate NH₄⁺ excretion, likely GI loss','0; no conclusion without the urine pH','Cannot use UAG when urine Na is high'],1,'40 + 30 − 110 = −40.']]});

lesson({id:'alkmaint',m:'kid',t:'Why metabolic alkalosis persists',ex:{pH:7.53,pco2:47,hco3:38,po2:82,fio2:.21,na:136,k:2.9,cl:86,alb:42,lac:1.2,glu:6.1,age:45},
sum:'Healthy kidneys excrete excess bicarbonate quickly. Metabolic alkalosis lasts only if something maintains it: volume depletion, chloride depletion, low potassium or excess mineralocorticoid.',
body:`<p>Every metabolic alkalosis has two phases.</p>
<h3>Generation</h3>
<ul><li>Loss of H⁺: vomiting, nasogastric suction, renal loss (diuretics, mineralocorticoid excess).</li>
<li>Gain of HCO₃⁻: bicarbonate infusion, massive transfusion (citrate → bicarbonate), milk–alkali syndrome.</li>
<li>Contraction: loss of bicarbonate-poor fluid around a fixed amount of bicarbonate.</li>
<li>Post-hypercapnia: chronic retainer ventilated down quickly, high bicarbonate left behind.</li></ul>
<h3>Maintenance</h3>
<ul><li><b>Volume depletion</b>: the kidney prioritises sodium, reclaiming it with HCO₃⁻.</li>
<li><b>Chloride depletion</b>: with little Cl⁻ to reabsorb with Na⁺, Na⁺ is reabsorbed in exchange for H⁺, and pendrin cannot secrete HCO₃⁻ without luminal Cl⁻.</li>
<li><b>Hypokalaemia</b>: increases H⁺ secretion and ammoniagenesis.</li>
<li><b>Aldosterone</b>: drives distal H⁺ and K⁺ secretion.</li></ul>
<p><b>Paradoxical aciduria</b>: after prolonged vomiting the urine can be acidic despite systemic alkalosis, because the kidney is defending volume and potassium.</p>
<h3>Sorting the cause: urine chloride, then blood pressure</h3>
${tw('<tr><th>Urine Cl⁻</th><th>Blood pressure</th><th>Causes</th></tr><tr><td>&lt; 20 mmol/L<br><b>Chloride responsive</b></td><td>Any (often low volume)</td><td>Vomiting, nasogastric suction, diuretics in the past (stopped), post-hypercapnia, chloride-losing diarrhoea</td></tr><tr><td>&gt; 20 mmol/L<br><b>Chloride resistant</b></td><td>High</td><td>Mineralocorticoid excess: primary aldosteronism, Cushing, renal artery stenosis, liquorice</td></tr><tr><td>&gt; 20 mmol/L<br><b>Chloride resistant</b></td><td>Normal or low</td><td>Diuretic still acting, Bartter, Gitelman, severe hypokalaemia or hypomagnesaemia</td></tr>')}
<ul><li><b>Use urine Cl⁻, not Na⁺.</b> Early in vomiting the kidney excretes the extra bicarbonate, and it carries Na⁺ with it. Urine Na⁺ can be high even when the patient is dry. Urine Cl⁻ stays low.</li>
<li><b>Timing of diuretics.</b> While a diuretic is acting, urine Cl⁻ is high. Once it wears off, Cl⁻ falls below 20. Ask when the last dose was.</li></ul>
<p class="note"><b>Worked gas.</b> A 45-year-old after a week of vomiting: pH 7.53, PCO₂ 47, HCO₃⁻ 38, Cl⁻ 86, K⁺ 2.9. Expected PCO₂ = 0.7 × 38 + 20 = 46.6 (± 5), so compensation is appropriate. Urine Cl⁻ 8 mmol/L: chloride responsive. Low volume, low chloride and low potassium all maintain it. Treat with 0.9% saline and KCl.</p>
<p>Treatment follows maintenance: give chloride (as NaCl and KCl) to chloride-responsive alkalosis; treat the mineralocorticoid source in chloride-resistant disease.</p>`,
keys:[['Maintenance factors','Volume, Cl⁻, K⁺, aldosterone'],['Chloride responsive','Urine Cl⁻ < 20 mmol/L'],['Chloride resistant','Urine Cl⁻ > 20 mmol/L']],
hook:'Something has to stop the kidney peeing out the bicarbonate. Find it.',
q:[['After a week of vomiting, why is the urine acidic despite pH 7.55?',['Lab error: urine pH is unreliable after vomiting','Kidney prioritises Na⁺ and K⁺ retention, secreting H⁺','Ongoing urinary bicarbonate loss from an RTA','Respiratory compensation lowering the urine pH'],1,'Volume, chloride and potassium depletion all push H⁺ secretion: paradoxical aciduria.'],
['Which fluid corrects a chloride-responsive metabolic alkalosis?',['5% dextrose','0.9% saline with KCl','Sodium bicarbonate','Hartmann\'s alone'],1,'Restoring chloride and volume lets the kidney excrete bicarbonate. Hartmann\'s contains lactate (turns into bicarbonate) and less chloride, so it does not fix the maintenance.']]});

lesson({id:'comp',m:'kid',t:'The compensation rules',w:['comp','map'],ex:{pH:7.19,pco2:38,hco3:14,po2:72,fio2:.21,na:140,k:4.8,cl:104,alb:38,lac:6.2,glu:7.0,age:62},
sum:'Metabolic: Winter\'s formula and 0.7 × HCO₃⁻ + 20. Respiratory: 1, 4, 2, 5. Compensation never overshoots.',
body:`${tw('<tr><th>Primary disorder</th><th>Expected compensation</th><th>Limit</th><th>Time</th></tr><tr><td>Metabolic acidosis</td><td>PCO₂ = 1.5 × HCO₃⁻ + 8 (± 2) <i>Winter</i></td><td>PCO₂ ≈ 10–15</td><td>12–24 h</td></tr><tr><td>Metabolic alkalosis</td><td>PCO₂ = 0.7 × HCO₃⁻ + 20 (± 5)</td><td>PCO₂ ≈ 55–60</td><td>24–36 h</td></tr><tr><td>Acute respiratory acidosis</td><td>HCO₃⁻ ↑ <b>1</b> per 10 mmHg PCO₂ above 40</td><td>HCO₃⁻ ≈ 30</td><td>Minutes</td></tr><tr><td>Chronic respiratory acidosis</td><td>HCO₃⁻ ↑ <b>4</b> per 10</td><td>HCO₃⁻ ≈ 45</td><td>3–5 days</td></tr><tr><td>Acute respiratory alkalosis</td><td>HCO₃⁻ ↓ <b>2</b> per 10 mmHg PCO₂ below 40</td><td>HCO₃⁻ ≈ 18</td><td>Minutes</td></tr><tr><td>Chronic respiratory alkalosis</td><td>HCO₃⁻ ↓ <b>5</b> per 10</td><td>HCO₃⁻ ≈ 12–15</td><td>2–3 days</td></tr>')}
<h3>How to use them</h3>
<ol class="steps"><li>Identify the primary disorder from the pH and which value moved in the matching direction.</li>
<li>Calculate the expected value of the other one.</li>
<li>Measured outside the expected range → a second primary disorder.<br>Metabolic acidosis with PCO₂ higher than Winter's → coexisting respiratory acidosis. Lower → coexisting respiratory alkalosis.</li></ol>
<p class="note"><b>Worked gas.</b> A 62-year-old with sepsis, drowsy: pH 7.19, PCO₂ 38, HCO₃⁻ 14, lactate 6.2. Winter's: 1.5 × 14 + 8 = 29 (27–31). A PCO₂ of 38 is too high: the lungs are not keeping up. High anion gap acidosis plus respiratory acidosis. Think fatigue, sedation or chest disease, and get senior help.</p>
<h3>Shortcuts</h3>
<ul><li>In metabolic acidosis, expected PCO₂ ≈ the two digits after "7." of the pH (pH 7.25 → PCO₂ ≈ 25), down to pH ≈ 7.10.</li>
<li>Also: expected PCO₂ ≈ HCO₃⁻ + 15. It stays within Winter's ± 2 only for HCO₃⁻ ≈ 10–18; outside that range use the formula.</li>
<li>Compensation brings pH toward normal but not past 7.40. A "normal" or overshot pH with abnormal PCO₂ and HCO₃⁻ is a mixed disorder, except chronic respiratory alkalosis, which can fully normalise pH.</li></ul>`,
keys:[['Winter\'s','PCO₂ = 1.5·HCO₃⁻ + 8 ± 2'],['Met alkalosis','PCO₂ = 0.7·HCO₃⁻ + 20 ± 5'],['Respiratory','1 · 4 · 2 · 5 per 10 mmHg']],
hook:'"One-four, two-five": acidosis acute/chronic 1 and 4, alkalosis acute/chronic 2 and 5.',
q:[['HCO₃⁻ 10 in DKA. Expected PCO₂?',['15 ± 2','23 ± 2','30 ± 2','40'],1,'1.5 × 10 + 8 = 23.'],
['Chronic respiratory acidosis with PCO₂ 70. Expected HCO₃⁻?',['27','30','36','45'],2,'24 + 4 × 3 = 36.'],
['Metabolic acidosis, HCO₃⁻ 14, PCO₂ 38. Interpretation?',['Appropriately compensated','Coexisting respiratory acidosis','Coexisting respiratory alkalosis','Coexisting metabolic alkalosis'],1,'Expected 29 ± 2. A PCO₂ of 38 is too high: the lungs are failing to compensate (fatigue, sedation, chest disease).']]});

lesson({id:'kacid',m:'kid',t:'Potassium and acid–base',ex:{pH:7.17,pco2:17,hco3:6,po2:118,fio2:.21,na:134,k:3.1,cl:100,alb:40,lac:1.8,glu:32,age:22},
sum:'Acid–base and potassium pull on each other: shifts across cells, and renal handling linked through aldosterone.',
body:`<ul><li><b>Acidosis → hyperkalaemia (shift)</b>, most in mineral acidosis, little in organic acidosis.</li>
<li><b>Alkalosis → hypokalaemia</b>: K⁺ enters cells; distal K⁺ secretion rises.</li>
<li><b>Hypokalaemia → metabolic alkalosis</b>: H⁺ moves into cells, ammoniagenesis rises, distal H⁺ secretion rises.</li>
<li><b>Hyperkalaemia → acidosis</b>: suppresses ammoniagenesis (part of type 4 RTA).</li></ul>
<h3>DKA: the trap</h3>
<p>Plasma K⁺ is often normal or high at presentation, yet <b>total body K⁺ is depleted</b> by osmotic diuresis. Insulin drives K⁺ into cells.</p>
<ul><li><b>K⁺ &lt; 3.5 mmol/L</b>: dangerous. UK JBDS: senior review and extra potassium, given before or with insulin. ADA consensus: delay insulin until K⁺ ≥ 3.5.</li>
<li><b>K⁺ 3.5–5.5</b>: add potassium to the fluids (about 40 mmol/L).</li>
<li><b>K⁺ &gt; 5.5</b>: no potassium in the fluids; recheck within 1–2 hours.</li></ul>
<p class="note"><b>Worked gas.</b> A 22-year-old with type 1 diabetes: pH 7.17, PCO₂ 17, HCO₃⁻ 6, glucose 32, K⁺ 3.1. Severe DKA, appropriately compensated (Winter's 17). A K⁺ of 3.1 before any insulin means the total body deficit is large: potassium first, senior review.</p>
<h3>Sodium bicarbonate</h3>
<p>Correcting acidosis lowers K⁺, but the effect is small and slow. Consider it only with severe metabolic acidosis, never instead of calcium and insulin–glucose for hyperkalaemia. It is dangerous when K⁺ is already low.</p>
<h3>Ionised calcium</h3>
<p>H⁺ competes with Ca²⁺ for albumin binding. Acidosis raises ionised calcium; alkalosis lowers it, which is why hyperventilation causes tingling and carpopedal spasm.</p>`,
keys:[['DKA K⁺','Normal plasma, low total body'],['DKA K⁺ < 3.5','Senior review, K⁺ before or with insulin'],['Alkalosis','↓ K⁺, ↓ ionised Ca²⁺']],
hook:'Acid pushes potassium out, alkali pulls it in.',
q:[['DKA: pH 7.05, K⁺ 3.1. First step?',['Start insulin infusion','Replace potassium before insulin','Give bicarbonate','Give insulin and recheck in 4 h'],1,'Insulin would drive K⁺ dangerously low. ADA: replace to ≥ 3.5 before insulin. UK JBDS: senior review and potassium before or with insulin. Either way, potassium comes first.'],
['A panicking patient hyperventilating has tingling fingers. Mechanism?',['Rise in serum potassium from cell shift','Fall in ionised calcium from alkalosis','Low blood glucose from the stress response','Raised serum magnesium from the alkalosis'],1,'Alkalosis increases calcium binding to albumin.']]});

/* ---------- SAMPLE & MACHINE ---------- */
lesson({id:'sites',m:'samp',t:'Arterial, venous, capillary and central samples',
sum:'Arterial blood tells you about the lungs\' output. Venous blood reflects the tissue it drained. Pick the sample that answers your question.',
body:`${tw('<tr><th>Sample</th><th>Good for</th><th>Not good for</th></tr><tr><td>Arterial (radial, brachial, femoral)</td><td>Oxygenation, A–a, exact PaCO₂</td><td>—</td></tr><tr><td>Peripheral venous</td><td>pH, HCO₃⁻, lactate, electrolytes, glucose, screening out hypercapnia</td><td>Oxygenation, exact PCO₂</td></tr><tr><td>Central venous (ScvO₂)</td><td>Delivery vs demand in shock</td><td>Arterial oxygenation</td></tr><tr><td>Arterialised capillary (earlobe)</td><td>pH and PCO₂ in COPD clinics, children</td><td>PaO₂ (underestimates)</td></tr>')}
<h3>Radial artery technique</h3>
<ul><li>Wrist slightly extended, palpate the artery 1–2 cm proximal to the crease.</li>
<li>Pre-heparinised syringe, needle at 30–45° bevel up, let the pulse fill the syringe.</li>
<li>Pressure for 5 minutes (longer if anticoagulated).</li>
<li>The modified Allen test is widely taught but predicts ischaemia poorly; many centres no longer rely on it. Avoid arteries with poor collateral supply and know the patient's anticoagulation.</li></ul>
<p>Four technique clinic lessons close this module: <a href="#l-tc-radial">the radial puncture, step by step</a>, <a href="#l-tc-allen">the Allen test</a>, <a href="#l-tc-venous">venous and earlobe draws</a>, and <a href="#l-tc-bubbles">bubbles, heparin and delay</a>.</p>
<p>Record whether the patient is on room air, or note the FiO₂ and oxygen device. A gas without FiO₂ cannot be interpreted for oxygenation.</p>`,
keys:[['Oxygenation needs','Arterial sample + FiO₂'],['Pressure after ABG','≥ 5 min'],['Capillary','Fine for pH/PCO₂, not PO₂']],
hook:'An ABG without the FiO₂ is half a gas.',
q:[['Which question does a peripheral VBG answer reliably?',['Is the PaO₂ adequate for this much oxygen?','Is the patient acidotic and what is the lactate?','How large is the A–a gradient on room air?','Is there a shunt causing the low saturation?'],1,'Venous pH, bicarbonate and lactate agree well with arterial values.'],
['What must accompany an ABG to interpret oxygenation?',['Patient\'s weight and height','FiO₂ or oxygen device','Serum albumin level','Haemoglobin concentration'],1,'Without it, a PaO₂ of 90 could be normal or terrible.']]});

lesson({id:'preanal',m:'samp',t:'Pre-analytical errors: when the sample lies',ex:{pH:7.38,pco2:47,hco3:27,po2:36,fio2:.21,na:139,k:4.2,cl:102,alb:40,lac:1.4,glu:5.8,age:50},
sum:'Air bubbles, too much heparin, delay, haemolysis, and a venous sample labelled arterial account for most "impossible" gases.',
body:`${tw('<tr><th>Error</th><th>PO₂</th><th>PCO₂</th><th>Other</th></tr><tr><td>Air bubble</td><td>Toward ≈ 150 (up if low, down if high)</td><td>↓ toward 0</td><td>pH ↑</td></tr><tr><td>Excess liquid heparin (dilution)</td><td>Variable</td><td>↓</td><td>HCO₃⁻ ↓, iCa²⁺ ↓ (binding)</td></tr><tr><td>Delay at room temperature</td><td>↓ (cells consume O₂)</td><td>↑</td><td>pH ↓, lactate ↑, glucose ↓</td></tr><tr><td>Haemolysis (difficult draw, shaking)</td><td>—</td><td>—</td><td>K⁺ falsely ↑</td></tr><tr><td>Venous blood in an "arterial" syringe</td><td>Low (30–45)</td><td>↑ slightly</td><td>Saturation ≪ SpO₂</td></tr><tr><td>Leukocyte larceny</td><td>↓↓</td><td>↑</td><td>Normal SpO₂</td></tr>')}
<h3>Rules that prevent most errors</h3>
<ul><li>Use dry, balanced (calcium-titrated) lithium heparin syringes.</li>
<li>Expel air immediately and cap. Mix by rolling, not shaking.</li>
<li>Plastic syringe: keep it at room temperature and analyse within 30 minutes. Analyse sooner (ideally within 15 minutes) when lactate, a very high PO₂ or a very high white cell count matters.</li>
<li>Do not ice a plastic syringe: cold plastic lets O₂ in and falsely raises the PO₂. If the delay will be longer than 30 minutes, use a glass syringe in iced water.</li>
<li>A blood gas analyser reads whole blood, so it cannot see haemolysis. A high K⁺ on a gas from a difficult draw needs a lab sample (with a haemolysis index) to confirm, but treat it now if the ECG shows changes.</li>
<li>Compare the PaO₂ with the SpO₂. If SpO₂ is 98% and PaO₂ is 38, you sampled a vein, or the oximeter is wrong.</li></ul>
<p class="note"><b>Worked gas.</b> A well 50-year-old, SpO₂ 97% on air, "ABG": pH 7.38, PCO₂ 47, PO₂ 36, HCO₃⁻ 27. Read as arterial, it looks like chronic respiratory acidosis with severe hypoxaemia. The patient is comfortable and the oximeter disagrees: this is venous blood. In the Interpreter, switch the sample to venous and the gas is normal.</p>`,
keys:[['Bubble','PO₂ → 150, PCO₂ ↓'],['Delay','PO₂ ↓, PCO₂ ↑, lactate ↑'],['Analyse within','30 min · 15 for lactate']],
hook:'If the gas and the patient disagree, believe the patient and repeat the gas.',
q:[['SpO₂ 97%, "ABG" PaO₂ 36, SO₂ 68%, PCO₂ 47. Most likely?',['Severe shunt','Venous sample','Methaemoglobinaemia','Air bubble'],1,'Saturation far below a reliable SpO₂ with venous-range PO₂ means venous blood.'],
['A sample sat for 90 minutes before analysis. Which value rises falsely?',['PO₂','Glucose','Lactate','pH'],2,'Red and white cells continue glycolysis, producing lactate and consuming glucose and O₂.']]});

lesson({id:'analyser',m:'samp',t:'Inside the analyser',
sum:'Three electrodes measure pH, PCO₂ and PO₂ directly. Bicarbonate, base excess and often saturation are calculated. Co-oximetry measures haemoglobin species by light.',
body:`${tw('<tr><th>Value</th><th>How</th><th>Measured or calculated</th></tr><tr><td>pH</td><td>Glass electrode: H⁺-sensitive glass develops a voltage against a reference (Nernst, ≈ 61.5 mV per pH unit at 37 °C)</td><td>Measured</td></tr><tr><td>PCO₂</td><td><b>Severinghaus electrode</b>: CO₂ crosses a membrane into bicarbonate solution and changes its pH, read by a glass electrode</td><td>Measured</td></tr><tr><td>PO₂</td><td><b>Clark electrode</b>: O₂ is reduced at a platinum cathode; current ∝ PO₂</td><td>Measured</td></tr><tr><td>Na⁺, K⁺, Cl⁻, iCa²⁺</td><td>Direct ion-selective electrodes</td><td>Measured</td></tr><tr><td>Glucose, lactate</td><td>Enzyme electrodes (oxidase → H₂O₂ → current)</td><td>Measured</td></tr><tr><td>Hb species</td><td>Co-oximetry: absorbance at many wavelengths</td><td>Measured</td></tr><tr><td>HCO₃⁻</td><td>Henderson–Hasselbalch from pH and PCO₂</td><td><b>Calculated</b></td></tr><tr><td>Base excess</td><td>Van Slyke equation</td><td><b>Calculated</b></td></tr><tr><td>sO₂ (no co-oximeter)</td><td>From PO₂ via a standard curve</td><td><b>Calculated</b> (wrong in CO poisoning)</td></tr>')}
<h3>Gas machine versus main lab</h3>
<ul><li><b>Sodium</b>: blood gas machines use direct ISE, unaffected by high lipids or protein. Main labs often use indirect ISE (diluted sample), which gives pseudohyponatraemia in severe hyperlipidaemia or myeloma.</li>
<li><b>Bicarbonate</b>: the lab reports total CO₂ (measured), typically about 1–2 mmol/L higher than calculated HCO₃⁻.</li>
<li>Mixing the two in one anion gap adds error. Use one source for Na⁺, Cl⁻ and HCO₃⁻.</li></ul>`,
keys:[['PCO₂ electrode','Severinghaus'],['PO₂ electrode','Clark'],['HCO₃⁻','Calculated']],
hook:'Clark for oxygen, Severinghaus for CO₂, glass for pH. Everything else is arithmetic or light.',
q:[['On a gas without co-oximetry, a CO-poisoned patient shows sO₂ 99%. Why?',['CO raises PaO₂','sO₂ is calculated from PaO₂, which is normal','The Clark electrode reads CO as O₂','CO shifts the curve right'],1,'Calculated saturation assumes normal haemoglobin. Only co-oximetry measures COHb.'],
['Which value on a standard ABG printout is calculated, not measured?',['pH','PCO₂','HCO₃⁻','Na⁺'],2,'Derived from pH and PCO₂ by Henderson–Hasselbalch.']]});

lesson({id:'oxim',m:'samp',t:'Pulse oximetry and co-oximetry',
sum:'Pulse oximeters use two wavelengths and assume only oxy- and deoxy-Hb exist. CO reads as oxygen; MetHb drags readings toward 85%; darker skin can hide hypoxaemia.',
body:`<p>A pulse oximeter compares the pulsatile absorbance of red (≈ 660 nm) and infrared (≈ 940 nm) light. That only distinguishes two species. A co-oximeter uses many wavelengths and reports O₂Hb, HHb, COHb and MetHb separately.</p>
<h3>Where SpO₂ misleads</h3>
<ul><li><b>Carbon monoxide</b>: COHb absorbs like O₂Hb at 660 nm, so SpO₂ stays high despite low content.</li>
<li><b>Methaemoglobin</b>: absorbs both wavelengths; SpO₂ trends toward ≈ 85% regardless of the true value.</li>
<li><b>Skin pigmentation</b>: in large US cohorts, occult hypoxaemia (SaO₂ &lt; 88% with SpO₂ 92–96%) was about three times as common in Black patients as in White patients. Check an ABG when decisions hinge on SpO₂.</li>
<li>Poor perfusion, cold fingers, motion, nail polish, intravenous dyes. After methylene blue for methaemoglobinaemia, SpO₂ falls for a while even as the patient improves.</li>
<li><b>Pulse CO-oximeters</b> (multi-wavelength probes that show SpCO) exist, but they are not accurate enough to rule out CO poisoning. Send a blood sample for co-oximetry.</li>
<li>Accuracy falls below about 80%.</li></ul>
<h3>Saturation gap</h3>
<p>SpO₂ (or calculated sO₂) minus co-oximetry SaO₂. A gap above about 5% suggests a dyshaemoglobin.</p>`,
keys:[['Wavelengths','660 nm and 940 nm'],['MetHb SpO₂','≈ 85%'],['Saturation gap','> 5% → dyshaemoglobin']],
hook:'A pulse oximeter only knows two colours of haemoglobin. The co-oximeter knows them all.',
q:[['A patient has blue lips, SpO₂ 85% on any amount of oxygen, normal PaO₂. Likely?',['Intracardiac shunt','Methaemoglobinaemia','Carbon monoxide','Venous sample taken'],1,'Cyanosis with SpO₂ stuck near 85% and a normal PaO₂: methaemoglobin.'],
['Why is SpO₂ normal in carbon monoxide poisoning?',['CO does not bind haemoglobin at all','COHb absorbs red light like oxyhaemoglobin','CO raises the dissolved PaO₂ reading','The probe overheats in CO poisoning'],1,'Two-wavelength oximetry cannot separate COHb from O₂Hb.']]});

/* ---------- EVERY NUMBER ---------- */
const NUMROWS=`<tr><th>Value</th><th>Normal (arterial)</th><th>SI / kPa</th></tr>
<tr><td>pH</td><td>7.35–7.45</td><td>[H⁺] 35–45 nmol/L</td></tr>
<tr><td>PaCO₂</td><td>35–45 mmHg</td><td>4.7–6.0 kPa</td></tr>
<tr><td>PaO₂ (room air, sea level)</td><td>80–100 mmHg</td><td>10.7–13.3 kPa</td></tr>
<tr><td>HCO₃⁻</td><td>22–26 mmol/L</td><td></td></tr>
<tr><td>Base excess</td><td>−2 to +2 mmol/L</td><td></td></tr>
<tr><td>SaO₂</td><td>95–100%</td><td></td></tr>
<tr><td>Lactate</td><td>&lt; 2 mmol/L</td><td></td></tr>
<tr><td>Na⁺ / K⁺ / Cl⁻</td><td>135–145 / 3.5–5.0 / 98–106</td><td>mmol/L</td></tr>
<tr><td>Ionised Ca²⁺</td><td>1.12–1.32 mmol/L</td><td></td></tr>
<tr><td>COHb</td><td>&lt; 3% (smokers up to ≈ 10%)</td><td></td></tr>
<tr><td>MetHb</td><td>&lt; 1.5%</td><td></td></tr>
<tr><td>Anion gap (no K⁺)</td><td>≈ 8–12 (analyser-dependent)</td><td>mmol/L</td></tr>
<tr><td>Standard bicarbonate</td><td>22–26 mmol/L</td><td></td></tr>
<tr><td>Glucose</td><td>4–7.8 mmol/L (fasting 4–6)</td><td></td></tr>
<tr><td>Haemoglobin</td><td>Men 130–170, women 120–150 g/L</td><td></td></tr>
<tr><td>Osmolar gap</td><td>&lt; 10 mOsm/kg</td><td></td></tr>
<tr><td>A–a gradient (room air)</td><td>≤ age ÷ 4 + 4 mmHg</td><td>Age 20: ≤ 1.2 kPa · age 80: ≤ 3.2 kPa</td></tr>
<tr><td>PaO₂ ÷ FiO₂ (P/F)</td><td>Normal ≈ 400–500; ARDS ≤ 300 mild, ≤ 200 moderate, ≤ 100 severe</td><td>53–67; 40 / 26.7 / 13.3 kPa</td></tr>
<tr><td>Hypoxaemia</td><td>Mild 60–79, moderate 40–59, severe &lt; 40 mmHg</td><td>8.0–10.5 / 5.3–7.9 / &lt; 5.3 kPa</td></tr>
<tr><td>pH ↔ [H⁺]</td><td>7.00 = 100 · 7.10 = 79 · 7.20 = 63 · 7.30 = 50 · 7.40 = 40 · 7.50 = 32 · 7.60 = 25</td><td>nmol/L</td></tr>`;

lesson({id:'nph',m:'num',t:'pH and PaCO₂',
sum:'pH tells you which way the patient has gone. PaCO₂ tells you what the lungs are doing, either as the cause or as the compensation.',
body:`<h3>pH</h3>
<ul><li>&lt; 7.35 <b>acidaemia</b>; &gt; 7.45 <b>alkalaemia</b>. ("-aemia" is the blood state; "-osis" is a process. A patient can have two -oses and a normal -aemia.)</li>
<li>pH below 7.20 or above 7.60 is dangerous: arrhythmias, reduced contractility, vasodilation, impaired catecholamine response, seizures.</li>
<li>Direct measurement. The single most important number.</li></ul>
<h3>PaCO₂</h3>
<ul><li>Normal 35–45 mmHg (4.7–6.0 kPa).</li>
<li>As the <b>cause</b>, PaCO₂ moves <b>opposite</b> to the pH: high PaCO₂ with low pH = respiratory acidosis; low PaCO₂ with high pH = respiratory alkalosis.</li>
<li>As <b>compensation</b>, PaCO₂ moves the <b>same way</b> as the pH: low PaCO₂ with low pH = the lungs compensating for a metabolic acidosis.</li>
<li>An acute change of 10 mmHg shifts pH about 0.08; in chronic states about 0.03.</li></ul>
<h3>The direction test (ROME)</h3>
<p><b>R</b>espiratory <b>O</b>pposite, <b>M</b>etabolic <b>E</b>qual. Compare each value with normal (pH 7.40, PaCO₂ 40).</p>
<ul><li>pH and PaCO₂ move the <b>same way</b> (both down, or both up): the lungs are compensating, so the primary problem is <b>metabolic</b>.</li>
<li>They move in <b>opposite</b> directions (pH down with PaCO₂ up, or pH up with PaCO₂ down): the PaCO₂ is the cause, so the problem is <b>respiratory</b>.</li></ul>
<div class="tw"><table class="tbl" style="min-width:0"><tr><th style="width:3.6em"></th><th>PaCO₂ ↑</th><th>PaCO₂ ↓</th></tr><tr><td><b>pH&nbsp;↓</b></td><td><b>Respiratory</b> acidosis<br>(opposite)</td><td><b>Metabolic</b> acidosis<br>(same way)</td></tr><tr><td><b>pH&nbsp;↑</b></td><td><b>Metabolic</b> alkalosis<br>(same way)</td><td><b>Respiratory</b> alkalosis<br>(opposite)</td></tr></table></div>
<p class="note">A normal pH with an abnormal PaCO₂ does not fit this grid: think of a mixed disorder (or chronic respiratory alkalosis).</p>`,
keys:[['pH','7.35–7.45'],['PaCO₂','35–45 mmHg · 4.7–6.0 kPa'],['Acute ΔpH per 10 mmHg','≈ 0.08'],['ROME','Respiratory opposite, metabolic equal']],
hook:'ROME: Respiratory Opposite, Metabolic Equal. pH and PCO₂ move together = metabolic; opposite = respiratory.',
q:[['pH 7.28, PaCO₂ 28. Primary process?',['Respiratory acidosis','Metabolic acidosis','Respiratory alkalosis','Metabolic alkalosis'],1,'pH and PCO₂ are both down: they move the same way, so the lungs are compensating and the cause is metabolic (ROME).'],
['Acute rise in PaCO₂ from 40 to 60, nothing else. Expected pH?',['7.40','7.24','7.32','7.10'],1,'About 0.08 per 10 mmHg: 7.40 − 0.16 = 7.24.']]});

lesson({id:'npo2',m:'num',t:'PaO₂, SaO₂ and FiO₂',
sum:'PaO₂ shows how well the lungs load oxygen at that FiO₂. Always read it against the FiO₂ and the patient\'s age.',
body:`<ul><li>Normal PaO₂ on room air at sea level: 80–100 mmHg (10.7–13.3 kPa), declining with age. A rough guide is about 100 − age/3.</li>
<li>Altitude lowers it. In Riyadh (about 610 m, barometric pressure about 707 mmHg) the expected PAO₂ and PaO₂ are about 10 mmHg lower than at sea level. Set the altitude in Settings and the app adjusts.</li>
<li><b>Hypoxaemia</b>: mild 60–79, moderate 40–59, severe &lt; 40 mmHg (&lt; 5.3 kPa).</li>
<li><b>Hyperoxaemia</b>: PaO₂ well above what is needed (e.g. &gt; 150 on oxygen) is not harmless; post-arrest and critically ill patients do better with targeted saturations (94–98% in most).</li></ul>
<h3>Saturation</h3>
<p>SaO₂ on the gas is measured by co-oximetry or calculated from PaO₂. Compare it with SpO₂; a large difference means a dyshaemoglobin, poor oximeter signal, or a venous sample.</p>
<h3>FiO₂ estimates</h3>
${tw('<tr><th>Device</th><th>Approximate FiO₂</th></tr><tr><td>Nasal cannula 1–6 L/min</td><td>0.24–0.44 (≈ +0.03–0.04 per L)</td></tr><tr><td>Simple face mask 5–10 L/min</td><td>0.35–0.55</td></tr><tr><td>Venturi mask</td><td>As labelled (0.24–0.60)</td></tr><tr><td>Non-rebreather 15 L/min</td><td>≈ 0.6–0.9</td></tr><tr><td>High-flow nasal</td><td>As set (0.21–1.0)</td></tr>')}`,
keys:[['Normal PaO₂','80–100 mmHg · 10.7–13.3 kPa'],['Hypoxaemia severe','< 40 mmHg · 5.3 kPa'],['Cannula','≈ +0.04 per L/min']],
hook:'A PaO₂ means nothing until you say "on what?"',
q:[['PaO₂ 85 on a non-rebreather. Is oxygenation normal?',['Yes: a PaO₂ above 80 is always normal','No: P/F ≈ 95–140, severely impaired','Cannot say without the PaCO₂','Yes, but only if aged over 70'],1,'85 ÷ 0.6–0.9 ≈ 95–140. Healthy lungs would give a PaO₂ of several hundred.'],
['Roughly what FiO₂ does 3 L/min nasal cannula give?',['0.21','0.32','0.50','0.80'],1,'≈ 0.21 + 3 × (0.03–0.04) ≈ 0.30–0.33, depending on breathing pattern.']]});

lesson({id:'nhco3',m:'num',t:'Bicarbonate: actual and standard',
sum:'Actual HCO₃⁻ is calculated from pH and PCO₂, so it shifts slightly with PCO₂ itself. Standard bicarbonate removes the respiratory effect.',
body:`<ul><li><b>Actual bicarbonate</b>: plasma HCO₃⁻ at the patient's real PCO₂. Normal 22–26 mmol/L.</li>
<li>An acute rise in PCO₂ raises HCO₃⁻ a little through the CO₂ hydration reaction itself (≈ 1 per 10 mmHg). This is the "acute compensation" and is pure chemistry, not the kidney.</li>
<li><b>Standard bicarbonate</b>: the HCO₃⁻ the sample would have if equilibrated to PCO₂ 40 mmHg at 37 °C, fully oxygenated. It removes the respiratory influence and reflects only the metabolic component. Normal 22–26.</li>
<li><b>Total CO₂</b> (laboratory chemistry): HCO₃⁻ + dissolved CO₂ + carbamino; about 1–2 higher than calculated HCO₃⁻.</li></ul>
<p>HCO₃⁻ low: metabolic acidosis, or compensation for respiratory alkalosis.<br>HCO₃⁻ high: metabolic alkalosis, or compensation for respiratory acidosis.</p>
<p>A HCO₃⁻ below 10 or above about 40–45 is almost always metabolic in origin (respiratory compensation alone rarely pushes it that far; the chronic respiratory acidosis ceiling is ≈ 45).</p>`,
keys:[['HCO₃⁻','22–26 mmol/L'],['Standard bicarbonate','At PCO₂ 40, 37 °C'],['Total CO₂','≈ HCO₃⁻ + 1–2']],
hook:'Standard bicarbonate asks: "if the lungs were normal, what would the bicarbonate be?"',
q:[['HCO₃⁻ 42. Which is most likely primary?',['Acute respiratory acidosis','Metabolic alkalosis','Chronic respiratory alkalosis','Normal'],1,'Respiratory compensation rarely takes HCO₃⁻ above about 40–45 (the chronic respiratory acidosis ceiling is about 45). At 42, look for a metabolic alkalosis first.'],
['What does standard bicarbonate remove?',['The effect of temperature','The respiratory (PCO₂) influence','The effect of albumin','Haemoglobin effect on oxygen'],1,'It recalculates HCO₃⁻ at PCO₂ 40 mmHg.']]});

lesson({id:'nbe',m:'num',t:'Base excess',
sum:'The amount of strong acid or base needed to bring blood back to pH 7.40 at PCO₂ 40. Negative = metabolic acidosis. It strips out the respiratory component.',
body:`<ul><li>Normal −2 to +2 mmol/L.</li>
<li><b>Negative</b> base excess (a base deficit) = metabolic acidosis. <b>Positive</b> = metabolic alkalosis.</li>
<li>Standard base excess (SBE) calculates this for the whole extracellular fluid (using an assumed Hb of 5 g/dL), so it is little affected by acute PCO₂ changes. Approximate: SBE ≈ 0.93 × (HCO₃⁻ − 24.4 + 14.8 × (pH − 7.40)).</li></ul>
<h3>Using it</h3>
<ul><li>In a respiratory disorder, a base excess that has moved (e.g. +8 in a CO₂ retainer) shows the metabolic compensation and how long it has been there.</li>
<li>Trauma: a base deficit worse than −6 marks shock and higher mortality, and its clearance tracks resuscitation.</li>
<li>Bicarbonate deficit estimate (rarely needed): 0.3 × weight (kg) × |BE| mmol, usually half given and the gas rechecked.</li>
<li>Base excess does not distinguish causes: lactate, ketones, chloride and albumin all feed into it. The anion gap and Stewart analysis partition it.</li></ul>`,
keys:[['Normal BE','−2 to +2 mmol/L'],['Shock marker','BE < −6'],['Deficit estimate','0.3 × kg × |BE|']],
hook:'Base excess is the metabolic part only; the respiratory part has been subtracted out.',
q:[['PaCO₂ 65, pH 7.36, BE +9. What does the BE tell you?',['Acute respiratory acidosis, no compensation','Long-standing renal compensation (chronic)','Coexisting lactic acidosis lowering the BE','Analyser error: BE should be negative here'],1,'A raised base excess means the kidney has had days to add bicarbonate.'],
['A trauma patient\'s base deficit goes from −10 to −4 over 2 hours. Interpretation?',['Worsening shock','Resuscitation is working','Developing alkalosis','No meaning'],1,'Clearance of base deficit tracks restored perfusion.']]});

lesson({id:'nlac',m:'num',t:'Lactate on the gas',
sum:'Normal < 2 mmol/L; > 4 is high. Venous and arterial lactate agree well. Repeat in 2 hours to check clearance.',
body:`<ul><li>Venous lactate is good enough for screening and trending; a tourniquet left on for long raises it.</li>
<li>Lactate ≥ 2 with suspected infection raises concern; septic shock needs lactate &gt; 2 with vasopressors to keep MAP ≥ 65 after fluids.</li>
<li>Clearance: a fall of at least 10–20% within 2 hours is a reassuring sign. Persistent elevation means the cause is not fixed.</li>
<li>A gas machine lactate that is much higher than the laboratory lactate suggests ethylene glycol (glycolate interference).</li>
<li>Normal lactate does not exclude D-lactic acidosis.</li></ul>
<h3>Lactate and the anion gap</h3>
<p>Each mmol/L of lactate adds about 1 mmol/L to the anion gap. If the gap rise is much bigger than the lactate, look for another anion: ketones, toxic alcohols, uraemia, salicylate.</p>`,
keys:[['Normal','< 2 mmol/L'],['High','> 4 mmol/L'],['Recheck','2 h']],
hook:'Lactate explains its own share of the gap; anything left over is another acid.',
q:[['AG 30 (rise of 18), lactate 3. What next?',['Lactate of 3 fully explains the anion gap rise, so treat the sepsis','Look for another unmeasured anion (ketones, toxic alcohol, renal failure)','Nothing more: this anion gap is normal once corrected for albumin','Repeat the lactate in six hours before looking for another cause'],1,'Lactate accounts for only 3 of the 18-point rise.'],
['Gas lactate 12, lab lactate 1.5, osmolar gap 25. Suspect?',['Septic shock','Ethylene glycol','Metformin','Short bowel'],1,'Glycolate reads as lactate on some gas analysers.']]});

lesson({id:'nlytes',m:'num',t:'Electrolytes, glucose and haemoglobin on the gas',
sum:'Na⁺, K⁺, Cl⁻, ionised Ca²⁺, glucose and Hb come back in two minutes. Use them for the anion gap and for the emergencies that will not wait for the lab.',
body:`<ul><li><b>Na⁺ and Cl⁻</b>: needed for the anion gap. Chloride rising out of step with sodium points to hyperchloraemic acidosis. Na⁺ − Cl⁻ is normally about 36–38; less than 32 suggests hyperchloraemic acidosis, more than 40 suggests metabolic alkalosis.</li>
<li><b>K⁺</b>: hyperkalaemia on a gas is quick to act on; haemolysis inflates it. Recheck before treating an unexpected value if the patient and ECG are reassuring.</li>
<li><b>Ionised Ca²⁺</b>: more accurate than corrected total calcium. Low in massive transfusion (citrate), pancreatitis, alkalosis, sepsis.</li>
<li><b>Glucose</b>: DKA, HHS, hypoglycaemia in the confused patient.</li>
<li><b>Hb</b>: a quick haemoglobin is useful, but a gas Hb from a diluted line sample can be misleading.</li></ul>`,
keys:[['Na⁺ − Cl⁻','≈ 36–38'],['iCa²⁺','1.12–1.32 mmol/L'],['Haemolysis','False ↑ K⁺']],
hook:'Na minus Cl under 32: chloride is driving an acidosis.',
q:[['Na 140, Cl 115, HCO₃⁻ 14. Na − Cl and suggestion?',['25; hyperchloraemic acidosis','38; normal, no chloride problem','45; metabolic alkalosis likely','Cannot say without albumin'],0,'Na − Cl = 25 and AG = 11: hyperchloraemic (normal AG) metabolic acidosis.'],
['During massive transfusion, which gas value often falls and needs replacement?',['Plasma glucose','Ionised calcium','Serum sodium','Blood lactate'],1,'Citrate in blood products binds calcium.']]});

lesson({id:'ncoox',m:'num',t:'Co-oximetry: COHb and MetHb',
sum:'COHb above 3% (10% in smokers) means CO exposure. MetHb above 1.5% is abnormal; symptoms usually start above 15–20%.',
body:`${tw('<tr><th>MetHb</th><th>Typical effects</th></tr><tr><td>&lt; 1.5%</td><td>Normal</td></tr><tr><td>1.5–10%</td><td>Usually no symptoms; slight grey or blue skin may be seen</td></tr><tr><td>10–20%</td><td>Cyanosis, chocolate-brown blood, often few symptoms</td></tr><tr><td>20–30%</td><td>Headache, anxiety, tachycardia</td></tr><tr><td>30–50%</td><td>Dyspnoea, confusion, fatigue</td></tr><tr><td>50–70%</td><td>Seizures, arrhythmias, acidosis, coma</td></tr><tr><td>&gt; 70%</td><td>Often fatal</td></tr>')}
<p>Anaemia lowers the threshold for symptoms at any level.</p>
<h3>COHb</h3>
<ul><li>Non-smokers &lt; 3%, smokers up to about 10%.</li>
<li>Level correlates poorly with severity because it falls with time and oxygen given before sampling. Symptoms, neurology, pregnancy, ECG ischaemia and lactate guide treatment.</li>
<li><b>Pulse oximetry is fooled.</b> Standard oximeters read COHb as oxyhaemoglobin, so SpO₂ looks normal. Only co-oximetry (on a gas, arterial or venous) measures COHb.</li>
<li>Half-life: ≈ 4–6 h on room air, ≈ 60–90 min on 100% oxygen, shorter in hyperbaric oxygen.</li></ul>
<h3>Treatment points</h3>
<ul><li><b>CO</b>: 100% oxygen by non-rebreather (or intubation) until COHb is low and symptoms settle. Discuss hyperbaric oxygen with a specialist centre for loss of consciousness, neurological signs, cardiac ischaemia, pregnancy or very high COHb; the evidence is mixed.</li>
<li><b>Smoke inhalation</b>: think of cyanide too (high lactate, often &gt; 8–10). Give hydroxocobalamin. Avoid nitrites: they make methaemoglobin and cut oxygen carriage further on top of COHb.</li>
<li><b>MetHb</b>: methylene blue 1–2 mg/kg IV over 5 minutes, usually when MetHb is above 20–30% or the patient has symptoms. It may be repeated once after 30–60 minutes.</li>
<li>Do not give methylene blue in <b>G6PD deficiency</b> (it fails and causes haemolysis), and take care with <b>serotonergic drugs</b> (SSRIs, SNRIs, linezolid): it can trigger serotonin syndrome.</li>
<li>Methylene blue is a dye: SpO₂ drops for a while after it is given. Follow the co-oximetry MetHb, not the SpO₂.</li></ul>`,
keys:[['COHb normal','< 3% (smokers < 10%)'],['MetHb normal','< 1.5%'],['COHb t½ on 100% O₂','≈ 60–90 min']],
hook:'Chocolate blood, SpO₂ stuck at 85, normal PaO₂: methaemoglobin.',
q:[['A non-smoker has COHb 18% after a generator ran indoors. Interpretation?',['Normal','Significant CO poisoning','Lab error','Only relevant if pregnant'],1,'Any level above 3% in a non-smoker indicates exposure; 18% is significant.'],
['MetHb 32% with confusion. Severity band?',['Usually asymptomatic','Moderate–severe; treat','Fatal range','Normal for smokers'],1,'30–50% causes dyspnoea and confusion; methylene blue is indicated.']]});

lesson({id:'nderived',m:'num',t:'Derived values: anion gap, delta ratio, osmolar gap',w:['agc'],
sum:'AG = Na⁺ − (Cl⁻ + HCO₃⁻). Correct for albumin. The delta ratio looks for a second metabolic disorder. The osmolar gap finds unmeasured osmoles such as toxic alcohols.',
body:`<h3>Anion gap</h3>
<div class="eq">AG = Na⁺ − (Cl⁻ + HCO₃⁻)</div>
<p>Plasma is electrically neutral, so the "gap" is the unmeasured anions (mostly albumin, plus phosphate, sulfate, organic acids) minus unmeasured cations. Normal is analyser-dependent: classic texts say 12 ± 4; many modern analysers give 3–11. Know your lab. Adding K⁺ raises it by about 4.</p>
<p><b>Albumin correction</b>: AG<sub>corrected</sub> = AG + 0.25 × (40 − albumin in g/L), i.e. +2.5 for every 10 g/L below 40 (or + 2.5 × (4 − albumin in g/dL)). Critically ill patients with albumin 20 g/L have a "normal" gap that hides about 5 mmol/L of extra anion.</p>
<h3>Delta ratio</h3>
<div class="eq">Δ ratio = (corrected AG − normal AG) ÷ (24 − HCO₃⁻)</div>
<p>Use the albumin-corrected gap. The app takes the normal AG as 12 unless you change it in Settings.</p>
${tw('<tr><th>Δ ratio</th><th>Meaning</th></tr><tr><td>&lt; 0.4</td><td>Hyperchloraemic normal AG acidosis</td></tr><tr><td>0.4–0.8</td><td>Combined high AG and normal AG acidosis (or renal failure)</td></tr><tr><td>0.8–2.0</td><td>Pure high AG acidosis (lactic ≈ 1.6; DKA ≈ 1 because ketones are lost in urine)</td></tr><tr><td>&gt; 2.0</td><td>High AG acidosis plus metabolic alkalosis, or pre-existing high HCO₃⁻ (compensated respiratory acidosis)</td></tr>')}
<p><b>Limits.</b> The ratio assumes each mmol of acid removes one mmol of bicarbonate. It supports a diagnosis; it does not make one. The cut-offs are soft: DKA often runs near 1, lactic acidosis near 1.6, and values near 0.8 or 2 are ambiguous. A HCO₃⁻ that was abnormal before the illness shifts it.</p>
<p>Some prefer the <b>bicarbonate gap</b> (ΔAG − ΔHCO₃⁻): near 0 is a pure high AG acidosis, above +6 suggests an added metabolic alkalosis, below −6 an added normal AG acidosis.</p>
<h3>Osmolar gap</h3>
<div class="eq">Calculated osmolality = 2 × Na⁺ + glucose + urea (all mmol/L)</div>
<p>Osmolar gap = measured − calculated. Normal &lt; 10. High in toxic alcohols, ethanol (each 1 mmol/L of ethanol adds about 1.25 mOsm/kg in practice; in mg/dL, divide by 3.7), mannitol, glycine, severe ketoacidosis and lactic acidosis (mildly).</p>`,
keys:[['AG','Na − (Cl + HCO₃⁻)'],['Albumin correction','+2.5 per 10 g/L below 40'],['Osmolar gap normal','< 10']],
hook:'Gap up by more than the bicarbonate fell → an alkalosis is hiding. Gap up by less → a chloride acidosis is hiding.',
q:[['Na 138, Cl 100, HCO₃⁻ 12, albumin 20 g/L. Corrected AG?',['26','31','21','36'],1,'AG = 138 − 112 = 26; +0.25 × 20 = +5 → 31.'],
['AG 32 (Δ 20), HCO₃⁻ 18 (Δ 6). Delta ratio and meaning?',['0.3; HAGMA + NAGMA','1.0; pure HAGMA','3.3; HAGMA + metabolic alkalosis','Cannot calculate without albumin'],2,'20 ÷ 6 ≈ 3.3. The bicarbonate fell far less than expected: e.g. DKA with vomiting.']]});

lesson({id:'nall',m:'num',t:'Reference card: the whole printout',
sum:'Every line of a blood gas report in one table. Come back to it until it is in your head.',
body:tw(NUMROWS)+`<p class="note">Reference ranges vary slightly between laboratories and analysers. Altitude lowers normal PaO₂ (Riyadh ≈ 610 m: about 10 mmHg lower).</p>`,
keys:[['Normal gas','7.40 · 40 · 24 · 95'],['kPa','PCO₂ 5.3 · PO₂ 12.7']],
hook:'7.40, 40, 24: the three numbers everything else is measured against.',
q:[['Normal PaCO₂ in kPa?',['2.5–3.5','4.7–6.0','8–10','10.7–13.3'],1,'35–45 mmHg ÷ 7.5.'],
['Normal base excess?',['−6 to +6','−2 to +2','0 to 5','22–26'],1,'Beyond ±2 indicates a metabolic component.']]});

/* ---------- VBG ---------- */
lesson({id:'vbg',m:'vbg',t:'What a venous gas can and cannot tell you',
sum:'Venous pH ≈ 0.03 lower, HCO₃⁻ ≈ 1 higher, lactate close. PCO₂ is on average ≈ 4–6 higher but individually unpredictable; venous PO₂ tells you nothing about the lungs.',
body:`${tw('<tr><th>Value</th><th>Peripheral venous vs arterial</th><th>Clinically</th></tr><tr><td>pH</td><td>About 0.03 lower</td><td>Interchangeable for most decisions (DKA, metabolic disorders)</td></tr><tr><td>HCO₃⁻</td><td>About 1 mmol/L higher</td><td>Interchangeable</td></tr><tr><td>Base excess</td><td>Close</td><td>Good agreement</td></tr><tr><td>Lactate</td><td>Slightly higher</td><td>Good for screening and trends</td></tr><tr><td>Na⁺, K⁺, Cl⁻, glucose</td><td>Close</td><td>Interchangeable</td></tr><tr><td>PCO₂</td><td>Average ≈ 4–6 mmHg higher; individual differences range widely (about −10 to +20)</td><td><b>Screen only</b>: venous PCO₂ &lt; 45 makes arterial hypercapnia unlikely</td></tr><tr><td>PO₂</td><td>Much lower, no fixed relation</td><td><b>Useless</b> for oxygenation; use SpO₂ or an ABG</td></tr>')}
<p>Meta-analyses of emergency department patients found good agreement for pH and bicarbonate but wide, clinically important differences for PCO₂ and PO₂.</p>
<h3>When you need an arterial sample</h3>
<ul><li>Oxygenation questions: unreliable SpO₂, suspected dyshaemoglobin without co-oximetry on the VBG, A–a gradient, P/F for ARDS.</li>
<li>Precise PCO₂: a venous PCO₂ above 45 in a sick patient, decisions on NIV or intubation where the number matters, ventilator titration.</li>
<li>Shock and cardiac arrest: arterial and venous values diverge as flow falls (venous blood shows much more CO₂ and acid).</li>
<li>Mixed or complex disorders where 5 mmHg changes your interpretation.</li></ul>
<h3>Interpreting a VBG</h3>
<p>To estimate arterial values, add 0.03 to the pH, subtract 5 from the PCO₂ and subtract 1 from the HCO₃⁻. The PCO₂ estimate is the weakest of the three. The interpreter in this app makes exactly these changes when you set the sample to venous, and does not assess oxygenation.</p>`,
keys:[['pH','Venous ≈ arterial − 0.03'],['HCO₃⁻','Venous ≈ arterial + 1'],['PCO₂','Average +4–6, unreliable'],['PO₂','Do not use'],['App conversion','pH +0.03 · PCO₂ −5 · HCO₃⁻ −1']],
hook:'Venous gas: trust the pH, bicarb and lactate; screen with the CO₂; ignore the oxygen.',
q:[['DKA monitoring: which sample is adequate?',['Arterial only','Venous','Capillary only','None; use urine'],1,'Venous pH, bicarbonate and ketones are sufficient for DKA.'],
['VBG PCO₂ 38 in a drowsy COPD patient. Interpretation?',['Arterial hypercapnia is unlikely','Hypercapnia confirmed','Must be acute respiratory acidosis','Venous PCO₂ is meaningless'],0,'A normal venous PCO₂ largely excludes arterial hypercapnia. Look for other causes of drowsiness.'],
['VBG PCO₂ 62. Next?',['Assume the PaCO₂ is 62 and treat as hypercapnic failure','Get an ABG if management depends on the exact value','Ignore it: venous PCO₂ is always unreliable','Give bicarbonate to correct the acidosis'],1,'A high venous PCO₂ cannot be converted reliably; measure arterial.']]});
