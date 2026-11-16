/* ---------- v4 lessons: feedback gaps (27/10/2026 report) ---------- */
lesson({id:'stewartx',m:'chem',t:'Stewart, worked through one patient',w:['sid'],
sum:'Apparent SID − effective SID = strong ion gap. One example shows how chloride and hidden anions each pull the bicarbonate down.',
body:`<p>The anion gap and the Stewart approach answer the same question from two sides. Working one gas both ways makes the link concrete. A septic patient after 4 L of 0.9% saline:</p>
<div class="eq">Na 138 · K 4.0 · iCa 1.1 · Mg 0.6 · Cl 110 · lactate 2.0 · pH 7.25 · HCO₃⁻ 12 · albumin 25 g/L · phosphate 1.2</div>
<h3>1. Apparent SID (the strong ions you measured)</h3>
<div class="eq">SIDa = Na + K + 2·iCa + 2·Mg − Cl − lactate = 138 + 4 + 2.2 + 1.2 − 110 − 2 = 33.4</div>
<p>Normal is about 40–42. A low SIDa is acidifying. Here the main culprit is chloride: Na − Cl is only 28 (normally about 36; below 32 is clearly low).</p>
<h3>2. Effective SID (the weak acids that carry the remaining charge)</h3>
<div class="eq">Albumin⁻ = alb (g/L) × (0.123 × pH − 0.631) = 25 × 0.261 = 6.5<br>Phosphate⁻ = PO₄ (mmol/L) × (0.309 × pH − 0.469) = 1.2 × 1.771 = 2.1<br>SIDe = HCO₃⁻ + albumin⁻ + phosphate⁻ = 12 + 6.5 + 2.1 = 20.6</div>
<h3>3. Strong ion gap</h3>
<div class="eq">SIG = SIDa − SIDe = 33.4 − 20.6 = 12.8</div>
<p>Normally SIG is close to 0 (under about 2–3). A SIG of 12.8 means unmeasured anions (ketones, uraemic anions, toxins, unmeasured organic acids). Lactate is already inside SIDa, so it does not count again here.</p>
<h3>Read it the bedside way</h3>
<ul><li>AG = 138 − (110 + 12) = 16; corrected for albumin 16 + 0.25 × 15 ≈ 20: a high gap even though 16 looked borderline.</li>
<li>Na − Cl = 28: a hyperchloraemic (saline) component as well.</li>
<li>Both approaches find two processes: chloride gain plus an unmeasured-anion acidosis. Stewart adds why the low albumin makes the bicarbonate look less bad than the acid load (albumin loss is alkalinising).</li></ul>
<p>Try your own numbers in Labs → Tools → Stewart.</p>`,
keys:[['Normal SIDa','≈ 40–42 mmol/L'],['Normal SIG','≈ 0 (under 2–3)'],['Albumin charge','alb × (0.123·pH − 0.631)']],
hook:'Chloride up or SIG up: Stewart names which strong-ion problem is eating the bicarbonate.',
q:[['SIDa 33, SIDe 32, SIG 1, Na − Cl 27. What is the dominant problem?',['Unmeasured anions','Hyperchloraemia (low SID from chloride)','Hypoalbuminaemia','Respiratory acidosis'],1,'SIG is near zero, so there are no hidden anions; the low SIDa comes from chloride.'],
['Why does a low albumin make an acidosis look milder on the bicarbonate?',['Albumin is a weak acid; losing it is alkalinising','Albumin binds bicarbonate','Low albumin raises PCO₂','It does not'],0,'Less A_tot means less weak-acid charge, so for the same strong-ion problem the HCO₃⁻ is higher.']]});

lesson({id:'uosm',m:'kid',t:'When the urine anion gap lies: the urine osmolal gap',
sum:'Urine osmolal gap = measured − calculated urine osmolality. Ammonium ≈ gap ÷ 2. Use it when ketones, hippurate or drugs make the urine anion gap unreliable.',
body:`<p>The urine anion gap (Na + K − Cl) uses chloride as a stand-in for ammonium. That fails when ammonium leaves with another anion: ketoanions in DKA, hippurate in toluene inhalation, D-lactate, penicillins, or when urine Na⁺ is under about 20 mmol/L.</p>
<div class="eq">Calculated U-osm = 2 × (U-Na + U-K) + U-urea + U-glucose   (all mmol/L)<br>Urine osmolal gap = measured U-osm − calculated U-osm<br>Urine NH₄⁺ ≈ gap ÷ 2</div>
<h3>Reading it in a normal anion gap acidosis</h3>
${tw('<tr><th>Urine osmolal gap</th><th>NH₄⁺ estimate</th><th>Meaning</th></tr><tr><td>Clearly high, usually 300 mOsm/kg or more</td><td>150 mmol/L or more</td><td>Kidney excreting acid well: look outside the kidney (diarrhoea, saline, toluene)</td></tr><tr><td>150–300 mOsm/kg</td><td>75–150 mmol/L</td><td>Grey zone: read it with the urine pH, the potassium and the story</td></tr><tr><td>&lt; 150 mOsm/kg</td><td>&lt; 75 mmol/L</td><td>Kidney failing to excrete ammonium: distal or type 4 RTA, CKD</td></tr>')}
<p>The cut-offs are approximate (Kim 1996): trust a clearly low or clearly high value more than one near the lines. Work the numbers in the <a href="#tool-urine">urine gaps tool</a>.</p>
<h3>Example: the glue sniffer</h3>
<p>Toluene is metabolised to hippuric acid. Hippurate is filtered and excreted quickly with Na⁺ and K⁺, so the gas shows a normal gap acidosis with severe hypokalaemia, and the urine anion gap is positive (looks renal). The urine osmolal gap is high because ammonium excretion is actually brisk: the problem is the hippurate, not the kidney.</p>
<p>Units: if urea and glucose are reported in mg/dL, divide BUN by 2.8 and glucose by 18.</p>`,
keys:[['U-osm gap','measured − (2(Na+K) + urea + glucose)'],['NH₄⁺','≈ gap ÷ 2'],['Renal cause','gap < 150']],
hook:'When the anion gap of the urine is confused by an extra anion, count the osmoles instead.',
q:[['NAGMA after glue sniffing; urine AG +20, urine osmolal gap 340. Interpretation?',['Distal RTA','Brisk ammonium excretion with hippurate in the urine','Type 4 RTA','Lab error'],1,'NH₄⁺ ≈ 170 mmol/L: the kidney is working. Hippurate makes the urine AG falsely positive.'],
['When is the urine anion gap least reliable?',['Diarrhoea with urine Na 60','Ketoacidosis or urine Na below 20','Saline infusion','Hypokalaemia'],1,'Other anions (ketones) or very low urine sodium break the chloride-for-ammonium assumption.']]});

lesson({id:'traps',m:'samp',t:'Analyser traps: low gaps, odd chloride and mixed sources',
sum:'A gap that is too low or a value that does not fit is usually the measurement, not the patient. Know these eight traps.',
body:`${tw('<tr><th>Trap</th><th>What you see</th><th>Why</th></tr><tr><td>Gas HCO₃⁻ mixed with lab total CO₂</td><td>AG off by 1–3; Henderson check fails</td><td>Lab total CO₂ runs ≈ 1–2 above calculated HCO₃⁻; timing differs. Use one source for Na, Cl and HCO₃⁻.</td></tr><tr><td>Hypoalbuminaemia</td><td>"Normal" gap hiding an acidosis</td><td>Albumin is most of the normal gap. Correct: + 2.5 per 10 g/L below 40.</td></tr><tr><td>IgG myeloma</td><td>Low or near-zero gap</td><td>Cationic paraprotein is an unmeasured cation.</td></tr><tr><td>Bromide (and iodide) exposure: pyridostigmine bromide for myasthenia, some cough and herbal products</td><td>Very high "chloride", low or negative gap</td><td>Many chloride electrodes read bromide as chloride.</td></tr><tr><td>Lithium toxicity, severe hypercalcaemia or hypermagnesaemia</td><td>Low gap</td><td>Extra unmeasured cations.</td></tr><tr><td>Severe hypertriglyceridaemia or hyperproteinaemia</td><td>Low Na on the main lab, normal on the gas</td><td>Indirect ion-selective electrodes (diluted sample) give pseudohyponatraemia; the gas machine uses direct ISE.</td></tr><tr><td>Tourniquet, fist clenching, haemolysis</td><td>High K⁺ and lactate</td><td>Local muscle work and red-cell lysis.</td></tr><tr><td>Delay, air bubble, liquid heparin</td><td>See "Pre-analytical errors"</td><td>Living cells, room air, dilution.</td></tr>')}
<h3>A low anion gap is a clue</h3>
<p>Under about 4 (on a reference of 12), think albumin first, then a paraprotein, then bromide or lithium, then laboratory error. Recheck before interpreting the rest of the gas.</p>
<h3>When the gas and the lab disagree</h3>
<p>If the same patient's gas and lab chemistry give different sodium values, believe the gas machine in lipaemic or very high-protein samples, and repeat both if neither fits the clinical picture.</p>`,
keys:[['Low AG first thought','Albumin'],['Bromide','False high Cl, low AG'],['Lipaemia','Main lab Na falsely low']],
hook:'A gap near zero is a puzzle about the measurement before it is a puzzle about the patient.',
q:[['AG 1 in a patient with back pain, anaemia and high total protein. Likely?',['Bromide','IgG myeloma','Lactic acidosis','Diarrhoea'],1,'A cationic IgG paraprotein lowers the gap.'],
['A patient with myasthenia on high-dose pyridostigmine bromide has Cl 128 and AG −4. Explanation?',['True hyperchloraemia','Bromide read as chloride','Lithium','Air bubble'],1,'Chloride electrodes often count bromide.']]});

lesson({id:'rhabdo',m:'clin',t:'Rhabdomyolysis',ex:{pH:7.29,pco2:30,hco3:14.2,po2:98,fio2:.21,na:139,cl:101,alb:42,lac:3.1,k:6.0,age:28},
sum:'Muscle breakdown releases potassium, phosphate, urate and organic acids. Expect hyperkalaemia, a high-gap acidosis and AKI. Fluids early; watch the ECG.',
body:`<p>Causes in your practice: exertional (labourers in heat, new recruits, gym novices), crush and prolonged lying after a fall, seizures, drugs (statins with interacting drugs, cocaine, amphetamines), hypokalaemia and hypophosphataemia themselves, and severe infection.</p>
<h3>The gas and chemistry</h3>
<ul><li><b>High anion gap metabolic acidosis</b>: phosphate, urate, organic acids, lactate if muscles are ischaemic, and AKI later.</li>
<li><b>Hyperkalaemia</b>, often early and dangerous. Check the ECG and a gas K⁺ straight away.</li>
<li><b>Hypocalcaemia</b> early (calcium deposits in damaged muscle), then rebound hypercalcaemia during recovery. Do not treat asymptomatic early hypocalcaemia; calcium can deposit further.</li>
<li><b>CK</b> usually more than 5× normal; above about 5,000 U/L the AKI risk rises. Urine dipstick positive for blood with no red cells on microscopy suggests myoglobin.</li></ul>
<h3>Treatment that the gas guides</h3>
<ul><li>Early, generous isotonic crystalloid, aiming for a high urine output (often quoted as about 200–300 mL/h in adults) while watching for overload.</li>
<li>Treat hyperkalaemia as usual (calcium for ECG changes, insulin–glucose, salbutamol). Dialysis for refractory hyperkalaemia, acidosis or overload.</li>
<li>Bicarbonate and mannitol have not been shown to improve outcomes and are not routine.</li>
<li>Compartment syndrome after crush: measure pressures or call surgery; a rising lactate and K⁺ can be the clue.</li></ul>
<p>Exertional heat stroke and rhabdomyolysis often come together: see the heat lesson.</p>`,
keys:[['CK','> 5× ULN; AKI risk ↑ above ~5,000'],['Early Ca²⁺','Low: do not treat unless symptomatic'],['Dangerous','Hyperkalaemia']],
hook:'Broken muscle leaks the inside of the cell: potassium, phosphate and acid.',
q:[['Labourer after a long shift: CK 48,000, K⁺ 6.4, peaked T waves. First step?',['Bicarbonate infusion','IV calcium, then shift K⁺ and give fluids','Mannitol','Wait for the CK to fall'],1,'Stabilise the myocardium first; fluids and potassium shifting follow.'],
['Ionised calcium 0.95 in early rhabdomyolysis, no tetany, normal QT. Replace?',['Yes, always','No: treat only if symptomatic or for hyperkalaemia','Only with bicarbonate','Give vitamin D'],1,'Calcium deposits in damaged muscle and rebounds later.']]});

lesson({id:'etoh',m:'clin',t:'Alcohol, withdrawal and refeeding',ex:{pH:7.41,pco2:34,hco3:21.3,po2:92,fio2:.21,na:138,k:3.2,cl:90,alb:40,lac:2.4,glu:4.1,age:46},
sum:'Alcohol can give three disorders at once: ketoacidosis, alkalosis from vomiting and a respiratory alkalosis from withdrawal. Feeding then drops phosphate, potassium and magnesium.',
body:`<h3>On arrival</h3>
<ul><li><b>Alcoholic ketoacidosis</b> after a binge and days of not eating: HAGMA with normal or low glucose; blood BHB high (urine strips under-read it).</li>
<li><b>Vomiting</b>: metabolic alkalosis that hides the ketoacidosis (Δ ratio above 2).</li>
<li><b>Withdrawal</b> (6–72 h after the last drink), pain, sepsis or liver disease drive breathing: respiratory alkalosis.</li>
<li>A triple disorder is common. The pH can look nearly normal while the patient is very unwell.</li>
<li>Also check the osmolar gap: ethanol raises it (about 1.25 mOsm per mmol/L of ethanol, or 1 per 3.7 mg/dL; Purssell 2001), and toxic alcohols hide in drinkers.</li></ul>
<h3>Treatment</h3>
<p>Give IV thiamine (for example Pabrinex) with or before glucose, then dextrose-containing fluids. Never delay glucose in a hypoglycaemic patient: give it at once and the thiamine straight after. A single glucose load does not trigger Wernicke encephalopathy. Ketoacidosis settles with glucose and fluid, usually without insulin. Replace potassium and magnesium.</p>
<h3>Refeeding</h3>
<p>Feeding (oral, enteral or IV glucose) after starvation releases insulin, which drives phosphate, potassium and magnesium into cells. Hypophosphataemia can cause muscle weakness, respiratory failure (including failure to wean), haemolysis, arrhythmia and confusion.</p>
<ul><li>High risk (NICE CG32) is <b>one</b> of: BMI under 16, little or no intake for more than 10 days, unintentional weight loss above 15% in 3–6 months, or low K/PO₄/Mg before feeding.</li>
<li>Or <b>two or more</b> of: BMI under 18.5, weight loss above 10% in 3–6 months, little or no intake for more than 5 days, or a history of alcohol misuse or drugs such as insulin, chemotherapy, antacids or diuretics.</li>
<li>Start at no more than 10 kcal/kg/day (5 kcal/kg/day if BMI is under 14 or there has been almost no intake for more than 15 days). Give thiamine and vitamins first, check phosphate, potassium and magnesium daily for the first days.</li></ul>
<p class="note">Worked gas: a 46-year-old after a week of drinking and three days of vomiting; blood BHB 6. The pH is normal, but the gap is 27: ketoacidosis, a hidden metabolic alkalosis and a low PCO₂.</p>`,
keys:[['AKA glucose','Normal or low'],['Thiamine','With or before glucose; never delay glucose if hypoglycaemic'],['Refeeding falls','PO₄ · K · Mg']],
hook:'Starve and drink (ketoacid), vomit (alkali), breathe fast (CO₂ down): three disorders, one nearly normal pH.',
q:[['Heavy drinker, vomiting for 3 days: pH 7.41, HCO₃⁻ 22, PCO₂ 34, AG 26. Read?',['Normal','HAGMA + metabolic alkalosis (+ respiratory alkalosis)','Pure respiratory alkalosis','NAGMA'],1,'The high gap with an almost normal bicarbonate means an alkalosis is hiding it; the low PCO₂ adds a respiratory alkalosis.'],
['Day 3 of feeding a malnourished patient: weakness, phosphate 0.3 mmol/L. Mechanism?',['Renal loss','Insulin-driven intracellular shift (refeeding)','Lab error','Vitamin D excess'],1,'Insulin moves phosphate into cells as metabolism restarts.']]});

lesson({id:'drugacid',m:'clin',t:'Drugs that make acid',ex:{pH:6.98,pco2:15,hco3:3.5,po2:110,fio2:.21,na:138,k:5.8,cl:98,alb:38,lac:18,glu:6.2,age:72},
sum:'Metformin with AKI, SGLT2 inhibitors, propofol, salbutamol, linezolid, paracetamol (5-oxoproline), acetazolamide and topiramate, toluene and the drugs that block aldosterone: know which gas each gives.',
body:`${tw('<tr><th>Drug</th><th>Gas</th><th>Key point</th></tr><tr><td>Metformin (with AKI, sepsis, overdose)</td><td>Severe lactic HAGMA</td><td>Metformin-associated lactic acidosis. EXTRIP 2015: dialysis <b>recommended</b> if lactate &gt; 20, pH ≤ 7.0 or standard care fails; <b>suggested</b> if lactate 15–20, pH 7.0–7.1, shock, reduced consciousness or liver failure.</td></tr><tr><td>SGLT2 inhibitors (the -gliflozins)</td><td>Ketotic HAGMA, glucose may be under 14</td><td>Euglycaemic DKA, worse after surgery, fasting or illness. Check blood ketones; see the DKA lesson.</td></tr><tr><td>Isoniazid, iron</td><td>Lactic HAGMA</td><td>With seizures (isoniazid: give pyridoxine) or shock and GI bleeding (iron).</td></tr><tr><td>Nitroprusside (high dose, long infusion)</td><td>Lactic HAGMA</td><td>Cyanide release blocks cell respiration.</td></tr><tr><td>Propofol (high dose, &gt; 48 h)</td><td>Lactic HAGMA</td><td>Propofol infusion syndrome: also rhabdomyolysis, hyperkalaemia, high triglycerides, Brugada-like ECG, heart failure. Stop the infusion.</td></tr><tr><td>Salbutamol, adrenaline</td><td>Raised lactate</td><td>β₂-driven aerobic glycolysis; perfusion usually fine.</td></tr><tr><td>Linezolid, older NRTIs</td><td>Lactic HAGMA</td><td>Mitochondrial toxicity, usually after prolonged use.</td></tr><tr><td>Paracetamol (chronic, malnourished)</td><td>HAGMA, normal lactate</td><td>5-oxoproline from glutathione depletion.</td></tr><tr><td>Acetazolamide, topiramate</td><td>NAGMA</td><td>Carbonic anhydrase inhibition; topiramate also causes kidney stones.</td></tr><tr><td>Amphotericin, ifosfamide</td><td>NAGMA with low K⁺</td><td>Renal tubular acidosis: distal (amphotericin) or proximal with Fanconi syndrome (ifosfamide).</td></tr><tr><td>Trimethoprim, spironolactone, ACE inhibitors and ARBs, NSAIDs</td><td>NAGMA with high K⁺</td><td>Type 4 RTA picture: aldosterone effect blocked or reduced. Stop or review the drug.</td></tr><tr><td>Toluene (glue, paint thinners)</td><td>NAGMA with very low K⁺</td><td>Hippurate excreted in urine; urine AG misleading, use the urine osmolal gap.</td></tr><tr><td>Salicylate</td><td>HAGMA + respiratory alkalosis</td><td>See its own lesson.</td></tr><tr><td>Saline (large volumes)</td><td>NAGMA</td><td>Strong ion difference of zero.</td></tr><tr><td>Loop and thiazide diuretics</td><td>Metabolic alkalosis</td><td>Volume, chloride and potassium loss.</td></tr>')}
<p>Ask about every drug, including over-the-counter and work exposures (solvents, glues), whenever an acidosis has no obvious cause.</p>
<p class="note">Worked gas: a 72-year-old on metformin, three days of diarrhoea, now with AKI. Lactate 18 and pH under 7.0 put her in the EXTRIP "dialysis recommended" group.</p>`,
keys:[['MALA dialysis','Recommended: lactate > 20, pH ≤ 7.0 or failing care (EXTRIP 2015)'],['SGLT2 inhibitor','Ketoacidosis with near-normal glucose'],['Toluene','NAGMA + very low K⁺'],['Topiramate','NAGMA']],
hook:'An unexplained acidosis is a drug history you have not taken yet.',
q:[['ICU patient on propofol 5 mg/kg/h for 4 days: new lactate 8, K⁺ 6.2, triglycerides high. Action?',['Increase propofol','Stop propofol: propofol infusion syndrome','Give bicarbonate only','Start metformin'],1,'Stop the infusion and support; consider ECMO or dialysis if severe.'],
['Migraine patient on topiramate: HCO₃⁻ 18, AG 10. Type?',['HAGMA','NAGMA from carbonic anhydrase inhibition','Respiratory acidosis','Lab error'],1,'Topiramate weakly inhibits carbonic anhydrase.']]});

lesson({id:'gib',m:'clin',t:'GI bleeding and massive transfusion',ex:{pH:7.49,pco2:44,hco3:33.2,po2:88,fio2:.21,na:141,k:3.6,cl:98,alb:30,lac:1.2,age:61},
sum:'Shock gives a lactic acidosis; the urea rises from digested blood. Massive transfusion adds citrate: low ionised calcium early and metabolic alkalosis later.',
body:`<h3>The bleeding patient</h3>
<ul><li><b>Lactate</b> and base deficit mark hypoperfusion before the haemoglobin falls; the Hb lags for hours.</li>
<li><b>Urea</b> rises out of proportion to creatinine in upper GI bleeding (digested blood plus hypovolaemia).</li>
<li>Trend the lactate: clearance follows successful resuscitation.</li>
<li><b>Transfuse restrictively</b> once the bleeding is controlled or slowing: red cells when Hb is under 70 g/L (aim 70–90), or under 80 with heart disease. A restrictive strategy saved lives in upper GI bleeding (Villanueva 2013). Massive ongoing bleeding is different: give blood by the clinical picture, not the number.</li></ul>
<h3>Massive transfusion</h3>
<ul><li><b>Ionised calcium</b> falls as citrate binds it, worse with liver failure (slower citrate metabolism). Check iCa²⁺ on the gas and replace (calcium chloride or gluconate) during massive transfusion; most protocols aim to keep it above about 1.1 mmol/L.</li>
<li><b>Potassium</b> can rise from stored red cells.</li>
<li><b>Metabolic alkalosis</b> appears a day or two later as citrate is metabolised to bicarbonate.</li>
<li>Acidosis, hypothermia and coagulopathy (the lethal triad, with hypocalcaemia often added as a fourth) feed each other: warm everything, give blood products early in balanced ratios, use tranexamic acid in trauma within 3 hours (not routinely in GI bleeding).</li></ul>
<p class="note">Worked gas: two days after a 14-unit transfusion for a variceal bleed, no vomiting and no diuretics. HCO₃⁻ 33 is citrate turned into bicarbonate; the iCa²⁺ was 0.9 on day one.</p>`,
keys:[['Early marker','Lactate / base deficit'],['Citrate','↓ iCa²⁺ early, alkalosis later'],['TXA','Trauma ≤ 3 h; not routine in GI bleed'],['iCa²⁺ target','> 1.1 mmol/L in massive transfusion'],['Hb trigger','70 g/L (80 with heart disease)']],
hook:'Bleeding shows on the gas before it shows on the haemoglobin.',
q:[['During massive transfusion iCa²⁺ is 0.82 mmol/L. Mechanism?',['Dilution only','Citrate binding calcium','Hyperkalaemia','Alkalosis from vomiting'],1,'Citrate chelates calcium; liver dysfunction slows its clearance.'],
['Two days after a massive transfusion: HCO₃⁻ 33, no vomiting, no diuretics. Likely?',['Laboratory error','Citrate metabolised to bicarbonate','Respiratory acidosis','Type 4 RTA'],1,'Each unit carries citrate that the liver turns into bicarbonate.']]});

lesson({id:'kids',m:'clin',t:'Children: what is different',ex:{pH:7.52,pco2:42,hco3:33.9,fio2:.21,na:134,k:3.0,cl:88,alb:38,lac:1.1,glu:4.5,age:0},
sum:'Same rules, different traps: gastroenteritis with ketosis, saline hyperchloraemia, pyloric stenosis, and paediatric DKA with cerebral oedema.',
body:`<h3>Normal values</h3>
${tw('<tr><th>Age</th><th>pH</th><th>PaCO₂ (mmHg)</th><th>HCO₃⁻ (mmol/L)</th><th>PaO₂ on air (mmHg)</th></tr><tr><td>Newborn (first days)</td><td>7.30–7.40 (lower in the first hours)</td><td>30–40</td><td>18–22</td><td>60–90</td></tr><tr><td>Infant</td><td>7.35–7.45</td><td>30–40</td><td>20–24</td><td>80–100</td></tr><tr><td>Child</td><td>7.35–7.45</td><td>35–45</td><td>22–26</td><td>80–100</td></tr><tr><td>Adult</td><td>7.35–7.45</td><td>35–45</td><td>22–26</td><td>80–100 (falls with age)</td></tr>')}
<p class="note">Approximate: exact ranges vary by laboratory and textbook (APLS). For cord gases and the first days, see <a href="#l-sp-neo">Newborns and cord gases</a>.</p>
<ul><li><b>Beyond infancy</b> the values are broadly the adult ones; newborns and young infants run a slightly lower bicarbonate and PCO₂. Capillary gases are common: fine for pH and PCO₂, not for PO₂.</li>
<li><b>Bronchiolitis and asthma</b>: a tachypnoeic infant should have a low PCO₂. A normal or rising PCO₂ means tiring. A capillary PCO₂ above about 50–55 mmHg with acidosis needs escalation (high-flow nasal oxygen or CPAP) and senior review.</li>
<li><b>Gastroenteritis</b>: stool bicarbonate loss gives NAGMA; poor intake adds starvation ketosis (children become ketotic quickly), so a mixed gap is common. Oral rehydration first.</li>
<li><b>Big saline resuscitation</b>: hyperchloraemic acidosis can look like ongoing shock. Check the chloride and the lactate before giving more fluid.</li>
<li><b>Pyloric stenosis</b> (2–8 weeks old, projectile non-bilious vomiting): hypochloraemic, hypokalaemic metabolic alkalosis. The alkalosis and chloride are corrected with fluids and potassium before surgery because alkalosis raises the risk of postoperative apnoea. Common pre-operative targets: chloride 100 mmol/L or more, bicarbonate under 28, potassium normal.</li>
<li><b>Paediatric DKA</b>: cerebral oedema is the main killer. Fluids are calculated carefully, but do not under-resuscitate: in the PECARN FLUID trial, faster rates and either saline strength did not change brain injury (Kuppermann 2018). Insulin infusion (often 0.05–0.1 units/kg/h) starts after initial fluids, and bicarbonate is avoided. Headache, falling GCS, bradycardia or rising BP during treatment → treat cerebral oedema at once (mannitol or hypertonic saline).</li>
<li><b>Inborn errors</b>: an unexplained high gap with hypoglycaemia or hyperammonaemia in a sick infant needs specialist input.</li></ul>
<p class="note">Worked gas: a six-week-old with pyloric stenosis (capillary sample, so no PO₂). Low chloride and potassium with a high bicarbonate: correct these before theatre.</p>`,
keys:[['Infant HCO₃⁻','≈ 20–24 (lower in newborns)'],['Pyloric stenosis','↓Cl ↓K metabolic alkalosis'],['Paediatric DKA killer','Cerebral oedema']],
hook:'Children run the same chemistry faster: they get ketotic, alkalotic and oedematous sooner.',
q:[['Six-week-old with projectile vomiting: pH 7.52, HCO₃⁻ 34, Cl 88, K 3.0. Before theatre?',['Operate now','Correct fluids, chloride and potassium first','Give acetazolamide','Give bicarbonate'],1,'Alkalosis increases the risk of postoperative apnoea.'],
['Child in DKA treatment develops headache and bradycardia. Next?',['More insulin','Treat cerebral oedema now (mannitol or hypertonic saline)','Bicarbonate','Stop fluids and wait'],1,'Cerebral oedema is the leading cause of death in paediatric DKA.']]});

/* ---------- 4.1: technique clinic (sampling) ---------- */
lesson({id:'tc-radial',m:'samp',t:'Technique clinic: the radial puncture, step by step',
sum:'Eight steps, each with the reason behind it, the usual error and how to rescue it. Failed punctures usually come from position, angle and pulling (steps 2, 5, 6); misleading results from air, delay and a missing FiO₂ (steps 7, 8, 1).',
body:`<p>Treat this as a checklist you rehearse before your hands are shaking. Each step has a <b>why</b> so that you can adapt when the patient does not look like the textbook.</p>
${tw('<tr><th>#</th><th>Do</th><th>Why</th><th>Common error → rescue</th></tr><tr><td>1</td><td>Check indication, anticoagulation, the other wrist and the FiO₂ or device</td><td>An unreadable gas (no FiO₂) is wasted pain</td><td>Forgetting FiO₂ → write it on the syringe now</td></tr><tr><td>2</td><td>Wrist extended about 30° over a rolled towel, hand relaxed</td><td>Brings the artery close to the skin and steadies it</td><td>Over-extension flattens the pulse → ease back until it is strongest</td></tr><tr><td>3</td><td>Palpate with two fingers 1–2 cm above the crease, mark the line of the artery</td><td>The artery runs straight; you want to enter along it</td><td>Palpating with the thumb (it has its own pulse) → use index and middle</td></tr><tr><td>4</td><td>Clean the skin; consider 0.25–0.5 mL of 1% lidocaine</td><td>Local anaesthetic reduces pain without making the stick harder</td><td>Skipping it in a conscious patient → offer it</td></tr><tr><td>5</td><td>Needle at 30–45°, bevel up, advance slowly towards the pulse</td><td>Bevel up gives a clean entry; a slow advance lets you feel the wall</td><td>Going too steep and through the back wall → withdraw slowly until the flash appears</td></tr><tr><td>6</td><td>Let the pulse fill the syringe (1–2 mL); do not pull the plunger</td><td>Pulsatile self-filling is the best sign that you are in an artery. Pulling can add air and hides that sign. In shock, gentle pulling may be needed: then check the PO₂ and SO₂ against the SpO₂</td><td>Dark, non-pulsatile blood → probably a vein (but arterial blood is dark in severe hypoxaemia); check the SO₂ or repeat</td></tr><tr><td>7</td><td>Needle out. Firm pressure for at least 5 minutes (longer on anticoagulants); the patient or an assistant can hold it. At once: activate the needle safety device, remove the needle, expel air, cap and roll</td><td>Pressure prevents haematoma; air and delay corrupt the gas. Never re-sheath a needle by hand</td><td>Releasing pressure early to check → hold, do not peek. Leaving the syringe uncapped while you press → hand over the pressure and cap it now</td></tr><tr><td>8</td><td>Label with name, time, FiO₂, temperature and site; analyse within 30 minutes</td><td>The gas is only as good as the context attached to it</td><td>Leaving the sample on a desk → run it now or repeat it</td></tr>')}
<h3>When not to puncture the radial artery</h3>
<ul><li>Infection, burn or skin lesion over the site, or no palpable pulse.</li>
<li>A limb with a dialysis fistula or vascular graft.</li>
<li>Severe peripheral vascular disease or an ischaemic hand. Pick another site.</li>
<li>Bleeding disorders and anticoagulation are not absolute bars. Choose a compressible site, use the smallest needle and press for longer.</li></ul>
<h3>If you miss</h3>
<p>Pull back to just under the skin and redirect without leaving the artery's line. After two misses, change wrist or ask a colleague. Repeated probing hurts and causes haematoma.</p>
<h3>Ultrasound</h3>
<p>When the pulse is weak (shock, obesity, oedema) or you have missed twice, use ultrasound if you have it. In the transverse view the artery is round, pulsatile and does not collapse when you press; the veins beside it do. Keep the needle tip in view as you advance. In trials of radial cannulation, ultrasound raised first-pass success and cut complications (Gu 2016).</p>`,
keys:[['Angle','30–45°, bevel up'],['Syringe','Fills by the pulse, no pulling'],['Pressure','≥ 5 min (longer if anticoagulated)'],['Label','FiO₂, time, temperature, site']],
hook:'Pulse fills the syringe, pressure for five minutes, FiO₂ on the label.',
q:[['Dark blood fills the syringe slowly and only when you pull the plunger. What does that suggest?',['A clean arterial sample','Venous blood, not arterial','A very high PaCO₂','A syringe with too much heparin'],1,'An arterial sample is usually bright, pulsatile and self-filling. Pulling and dark colour point to a vein, though arterial blood is dark in severe hypoxaemia and may need gentle pulling in shock: check the SO₂ against the SpO₂.'],
['After the needle is withdrawn, what is the right next action?',['Press firmly for 5 minutes or more','Press for 30 seconds, then look','Apply a light dressing and go','Ask the patient to flex the wrist for a while'],0,'Short pressure is the commonest cause of haematoma.'],
['Which patient needs a different site rather than a radial attempt?',['An anxious patient on a monitor','A limb with a dialysis fistula','A patient breathing room air','A patient with a high fever'],1,'Never puncture a fistula or graft limb.']]});

lesson({id:'tc-allen',m:'samp',t:'Technique clinic: the Allen test and collateral flow',
sum:'How to do the modified Allen test, how to read it, and why it is a quick check rather than a guarantee.',
body:`<h3>The modified Allen test</h3>
<ol><li>Patient clenches the fist for about 30 seconds while you press on both the radial and ulnar arteries.</li>
<li>Open the hand. It should be pale.</li>
<li>Release the <b>ulnar</b> artery only and time the return of colour to the whole palm and thumb.</li></ol>
${tw('<tr><th>Colour returns in</th><th>Reading</th></tr><tr><td>7 seconds or less</td><td>Ulnar supply is adequate</td></tr><tr><td>8–14 seconds</td><td>Equivocal</td></tr><tr><td>15 seconds or more</td><td>Ulnar supply poor: avoid that radial artery</td></tr>')}
<h3>What the evidence says</h3>
<ul><li>The test is subjective: results vary by examiner, skin tone, room temperature and how hard the patient clenches.</li>
<li>It has not been shown to predict hand ischaemia after radial puncture, and ischaemic complications are very rare either way. Some guidelines still recommend it, others do not.</li>
<li>More objective options exist. The Barbeau test puts a pulse oximeter on the thumb and watches the trace (plethysmography) while the radial artery is compressed. It has four types, A to D; only type D (no return of the trace) argues against that radial. Doppler ultrasound is another objective option.</li></ul>
<h3>How to use it</h3>
<p>Use it as a quick screen that takes under a minute, not as permission or as a veto. A clearly abnormal result is a reason to choose the other wrist, or another site. A normal one does not remove the need for the usual care: one attempt at a time, pressure afterwards, and a look at the hand if the patient complains of pain or numbness.</p>
<h3>Red flags after puncture</h3>
<p>Persistent pain, a cold, pale or numb hand, or a growing swelling at the wrist need review at once. They can mean haematoma, spasm or arterial occlusion.</p>`,
keys:[['Release','Ulnar artery only'],['Abnormal','Colour back in 15 s or more'],['Evidence','Poor predictor of ischaemia']],
hook:'Allen test: a quick screen, not a promise.',
q:[['In the modified Allen test, which artery is released first?',['The radial artery','The ulnar artery','The brachial artery above it','Both arteries together at once'],1,'You are testing whether the ulnar artery can supply the whole hand.'],
['How should the Allen test be used?',['A quick screen that helps pick the site','Proof that ischaemia can never happen','A full substitute for pressure afterwards','A test that is used only in small children'],0,'It is subjective and a weak predictor, so it informs the choice and never replaces care.'],
['After a radial gas the hand becomes cold, pale and numb. What now?',['Reassure and watch the hand','Urgent review for arterial compromise','Give another dose of heparin now','Repeat the puncture on the same wrist'],1,'Treat it as possible occlusion until proven otherwise.']]});

lesson({id:'tc-venous',m:'samp',t:'Technique clinic: getting a good venous or capillary gas',
sum:'When a vein will do, how to draw it without distorting the numbers, and when an earlobe sample is worth it.',
body:`<h3>Choose the sample for the question</h3>
${tw('<tr><th>You want to know</th><th>Sample</th></tr><tr><td>Is the patient acidotic? Lactate, K⁺, glucose</td><td>Peripheral venous is enough</td></tr><tr><td>Is the patient hypercapnic?</td><td>Venous screens it out (normal PCO₂ is reassuring); abnormal or doubtful → arterial</td></tr><tr><td>Is oxygenation the problem?</td><td>Arterial with FiO₂ (or pulse oximetry first)</td></tr><tr><td>Repeated gases in a stable COPD or child</td><td>Arterialised capillary (earlobe), warmed and free-flowing</td></tr>')}
<h3>Drawing a venous gas well</h3>
<ul><li>Use a heparinised gas syringe. A tourniquet for more than a minute and a clenched fist push up lactate and potassium and lower pH, so release it before or soon after puncture.</li>
<li>Avoid the arm with an infusion running. Fluids dilute the sample.</li>
<li>Sample at the time of cannulation when you can, free-flowing, without pulling hard.</li>
<li>Expel air, cap, label as <b>venous</b>, and note the site. A venous sample labelled arterial is a classic trap.</li></ul>
<h3>Remember the offsets</h3>
<p>Compared with arterial: pH about 0.03 lower, PCO₂ about 5 mmHg higher, HCO₃⁻ about 1 mmol/L higher. Use the <a href="#tool-vbg">venous to arterial tool</a> and keep the scatter in mind. A venous value is a screen, not a substitute, when the number sits near a decision line.</p>
<h3>Earlobe (arterialised capillary)</h3>
<ul><li>Warm the lobe or apply vasodilator cream for about 10 minutes so that blood is arterialised.</li>
<li>Free flow into a capillary tube. Squeezing mixes in tissue fluid and distorts the values.</li>
<li>Reliable for pH and PCO₂; treat PO₂ with caution.</li></ul>`,
keys:[['Tourniquet','Under 1 min, release early'],['Venous vs arterial','pH −0.03 · PCO₂ +5 · HCO₃⁻ +1'],['Earlobe','Warm, free-flowing, PO₂ unreliable']],
hook:'A vein answers acid-base; only an artery answers oxygen.',
q:[['Breathless patient, peripheral venous PCO₂ 44 mmHg. Can you rule out arterial hypercapnia?',['No: only an arterial gas can do that','Yes: a normal venous PCO₂ screens it out','Only if the venous pH is below 7.30','Only after adding 5 to the venous value'],1,'Venous PCO₂ runs about 5 above arterial, so a venous value of 45 or less makes a PaCO₂ above 45 very unlikely. A high or borderline venous value needs an arterial gas.'],
['What does a long tourniquet and fist clenching do to a venous sample?',['Lowers the lactate by dilution','Raises lactate and K⁺, lowers pH','Raises the pH and the glucose','Changes nothing that you can measure'],1,'Local stasis and muscle work change the sample.'],
['An earlobe sample is squeezed hard to get enough blood. What is the effect?',['No effect on any value','Tissue fluid distorts the values','PO₂ rises falsely and only that','Only the glucose changes'],1,'Free flow is essential for capillary gases.']]});

lesson({id:'tc-bubbles',m:'samp',t:'Technique clinic: bubbles, heparin and delay, with drills',
sum:'What to do in the first minute after the draw, and the quick checks that tell you the sample cannot be trusted.',
body:`<h3>The first minute</h3>
<ol><li><b>Expel the air at once</b>: hold the syringe upright, tap, push the bubbles out and cap it.</li>
<li><b>Mix by rolling</b> the syringe between the palms and inverting a few times. Do not shake it.</li>
<li><b>Label</b> and send, or run it yourself.</li></ol>
<h3>Why a bubble matters</h3>
<p>Room air has a PO₂ of about 150 mmHg and almost no CO₂. A bubble in the syringe drags the sample's PO₂ towards 150 and its PCO₂ downwards. A patient with a PaO₂ of 60 looks better; one on high-flow oxygen with a PaO₂ of 400 looks worse. The longer it sits and the bigger the bubble, the larger the error.</p>
<h3>Heparin and delay</h3>
<ul><li>Use dry or balanced heparin and fill the syringe. Leaving a lot of liquid heparin dilutes the sample: PCO₂ and HCO₃⁻ fall and calcium binds.</li>
<li>Cells keep working in the syringe: PO₂ falls, PCO₂ and lactate rise, pH and glucose fall. Plastic at room temperature is fine for about 30 minutes. Longer than that, run a fresh sample.</li></ul>
<h3>Four drills</h3>
${tw('<tr><th>You see</th><th>Think</th><th>Do</th></tr><tr><td>PaO₂ 36, SO₂ 68%, SpO₂ 97%</td><td>Venous blood in an arterial syringe</td><td>Repeat from an artery</td></tr><tr><td>PaO₂ 140 on room air, PCO₂ 12 in a well patient</td><td>Air bubble. PAO₂ ≈ 150 − 12 ÷ 0.8 ≈ 135, so a PaO₂ of 140 is impossible</td><td>Repeat, expel air at once</td></tr><tr><td>Lactate 9 in a bright, well patient; sample 2 hours old</td><td>Delay</td><td>Repeat and run it within 30 minutes</td></tr><tr><td>K⁺ 7.4 after a difficult draw</td><td>Could be haemolysis, could be real. Most gas analysers cannot detect haemolysis, and a normal ECG does not exclude dangerous hyperkalaemia</td><td>ECG and monitor now. Repeat urgently (lab sample with a haemolysis index). Treat as real (IV calcium, insulin–glucose) if there is any ECG change or any reason for a high K⁺: kidney failure, ACE inhibitor, DKA, rhabdomyolysis. Never wait for a repeat to treat a K⁺ of 6.5 or more that may be true</td></tr>')}
<p><b>A high K⁺ is never just haemolysis until proven.</b> Get an ECG now and repeat urgently on a lab sample. If there is any ECG change or any reason for a real high K⁺, give IV calcium and insulin–glucose while you wait.</p>
<p>The rule behind all four: when the numbers and the patient disagree, believe the patient and repeat the sample, unless the number could kill. Then treat while you repeat.</p>`,
keys:[['Air','PO₂ → ~150, PCO₂ ↓'],['Delay','PO₂ ↓, PCO₂ ↑, lactate ↑'],['Window','~30 min in plastic at room temperature']],
hook:'Bubbles out, roll never shake, run it inside half an hour.',
q:[['A well patient on room air has a "PaO₂ 142, PCO₂ 12". Most likely?',['Excellent gas exchange','An air bubble in the syringe','Simple hyperventilation in a calm patient','Methaemoglobinaemia that is present'],1,'A PO₂ near 150 with a very low PCO₂ is the bubble signature. Check: PAO₂ ≈ 150 − 12 ÷ 0.8 ≈ 135. A PaO₂ above the alveolar PO₂ is impossible, so the sample has met air.'],
['A sample sits for two hours. What happens?',['Lactate falls steadily as cells rest','PO₂ rises over time in the syringe','Lactate and PCO₂ up, PO₂ and pH down','The pH climbs slowly with glucose'],2,'Cells keep metabolising in the syringe.'],
['Why roll the syringe instead of shaking it?',['To warm the sample up slowly','Shaking can haemolyse and add air','Rolling removes the lactate first','Rolling raises the pH slightly at once'],1,'Gentle mixing keeps cells intact and prevents bubbles.']]});
