/* ================= 4.2: more questions per lesson (batch 3: disorders, clinical, technique) ================= */
XQ.read6=[
['What is the first step of the six-step read?',['Check that the numbers fit together','Calculate the anion gap','Decide the compensation','Look at the PaO₂'],0,'A gas that does not obey Henderson–Hasselbalch is a bad sample, not a diagnosis.'],
['pH 7.50, PCO₂ 30, HCO₃⁻ 23. What is the interpretation?',['Acute respiratory alkalosis','Metabolic alkalosis','Chronic respiratory alkalosis','Normal gas'],0,'Alkalaemia with a low PCO₂, and bicarbonate only 1–2 below normal, fits an acute change.'],
['Why does the direction of the pH point to the primary disorder?',['Compensation does not overshoot','pH is measured first','Bicarbonate is calculated','PCO₂ is unreliable'],0,'A compensating process pushes pH back toward normal, never beyond it.']];
XQ.hagma=[
['AG 26, HCO₃⁻ 10. What is the delta ratio?',['1.0','0.5','2.0','3.0'],0,'(26 − 12) ÷ (24 − 10) = 14 ÷ 14 = 1.0, a pure HAGMA.'],
['Which of these causes a normal anion gap acidosis?',['Diarrhoea','Lactic acidosis','Ketoacidosis','Methanol'],0,'Gut bicarbonate loss is replaced by chloride, so the gap stays normal.'],
['Severe metformin-associated lactic acidosis with lactate above 20 may need…',['Haemodialysis','Insulin only','Diuretics','Oral bicarbonate only'],0,'EXTRIP recommends dialysis for lactate above 20 mmol/L or pH ≤ 7.0.']];
XQ.nagma=[
['Which cause of NAGMA is associated with a raised potassium?',['Type 4 RTA','Diarrhoea','Type 2 RTA','Acetazolamide'],0,'Hypoaldosteronism retains potassium and impairs ammonium excretion.'],
['Large-volume 0.9% saline typically causes…',['Hyperchloraemic NAGMA','HAGMA','Metabolic alkalosis','Respiratory acidosis'],0,'Chloride load lowers the SID and bicarbonate.'],
['Which surgery classically causes NAGMA?',['Ureterosigmoidostomy','Appendicectomy','Cholecystectomy','Hip replacement'],0,'Chloride is absorbed from urine in the bowel in exchange for bicarbonate.']];
XQ.malk=[
['Metabolic alkalosis with HCO₃⁻ 36. Expected PCO₂?',['About 45 ± 5','About 30 ± 5','About 60 ± 5','About 36 ± 5'],0,'0.7 × 36 + 20 ≈ 45.'],
['In a metabolic alkalosis the PCO₂ is far above the expected value. What does that mean?',['A second respiratory acidosis','Perfect compensation','A sampling error only','Respiratory alkalosis'],0,'Compensation cannot overshoot; an excess suggests a separate respiratory problem.'],
['Which drug class commonly causes a metabolic alkalosis?',['Loop diuretics','Beta blockers','Statins','Antihistamines'],0,'They lose chloride and volume, and the kidney retains bicarbonate.']];
XQ.racid=[
['PCO₂ rises acutely from 40 to 80 mmHg. Expected HCO₃⁻?',['About 28','About 40','About 24','About 32'],0,'Acute: +1 per 10 mmHg, so 24 + 4.'],
['Chronic respiratory acidosis with PCO₂ 80. Expected HCO₃⁻?',['About 40','About 28','About 32','About 24'],0,'Chronic: +4 per 10 mmHg, so 24 + 16.'],
['In COPD hypercapnia, what shows it is acute-on-chronic?',['A pH below normal','A raised bicarbonate','A low PaO₂','A high haemoglobin'],0,'Compensated chronic retention has a near-normal pH; acidaemia means a recent rise.']];
XQ.ralk=[
['Chronic respiratory alkalosis with PCO₂ 20. Expected HCO₃⁻?',['About 14','About 20','About 10','About 18'],0,'Chronic: −5 per 10 mmHg, so 24 − 10.'],
['Which of these causes a respiratory alkalosis?',['Salicylate toxicity','Opioid overdose','Severe COPD','Myasthenia gravis'],0,'Salicylates stimulate the respiratory centre directly.'],
['Hypoxia at altitude produces…',['Respiratory alkalosis','Respiratory acidosis','Metabolic acidosis','No gas change'],0,'Low PaO₂ drives ventilation, which lowers PCO₂.']];
XQ.mixed=[
['pH 7.35, PCO₂ 60, HCO₃⁻ 32. What is the interpretation?',['Compensated chronic respiratory acidosis','Mixed acidosis','Metabolic alkalosis only','Acute respiratory acidosis'],0,'Chronic: 24 + 4 × 2 = 32, so the bicarbonate is just what is expected.'],
['HAGMA with NAGMA together gives a delta ratio…',['Below 0.8','Above 2','Exactly 1','Equal to 5'],0,'Bicarbonate falls more than the gap rises.'],
['PCO₂ and HCO₃⁻ moving in opposite directions, from normal, means…',['A mixed disorder','Perfect compensation','A lab error','Chronic disease'],0,'Compensation moves them together; opposite movement means two primary processes.']];
XQ.oxread=[
['Co-oximeter SaO₂ 80% with PaO₂ 95 mmHg. What is the cause?',['Dyshaemoglobinaemia','Shunt','Hypoventilation','Low inspired oxygen'],0,'A normal PaO₂ with low measured saturation means haemoglobin is not carrying oxygen.'],
['PaO₂ 60 on FiO₂ 0.6 with PEEP 8 and bilateral infiltrates. What is the P/F ratio and severity?',['100, severe','300, mild','200, moderate','400, normal'],0,'60 ÷ 0.6 = 100, which is at the severe threshold.'],
['Hypoxaemia with a normal PaCO₂ and a raised A–a gradient points to…',['A lung problem','Pure hypoventilation','Low altitude','Anaemia'],0,'The gradient shows the lung is failing to transfer oxygen.']];
XQ.dka=[
['Which values define DKA resolution?',['BHB below 0.6 and pH 7.3 or higher','Glucose below 10 only','HCO₃⁻ 18 and glucose 11','Ketonuria clearing'],0,'Resolution is based on ketones and acidosis, not glucose alone.'],
['Chloride rises and the anion gap falls during DKA treatment. Why?',['Hyperchloraemic NAGMA from ketoanion loss and saline','New lactic acidosis','Insulin overdose','Respiratory failure'],0,'Ketoanions are excreted and replaced by chloride.'],
['In DKA, a venous sample is adequate because…',['pH and bicarbonate agree closely','PO₂ matters most','Lactate cannot be measured','Arterial puncture is unsafe'],0,'The offset from arterial is small and consistent.']];
XQ.sepsis=[
['Sepsis-3 septic shock needs vasopressors to keep MAP ≥ 65 and a lactate above…',['2 mmol/L','4 mmol/L','6 mmol/L','1 mmol/L'],0,'The definition combines vasopressor need and lactate above 2 despite fluid.'],
['Compared with saline, balanced crystalloids cause less…',['Hyperchloraemic acidosis','Hypokalaemia','Hypocalcaemia','Alkalosis'],0,'Their chloride content is lower, so the SID falls less.'],
['Why is a raised lactate in sepsis not always tissue hypoxia?',['Adrenergic aerobic glycolysis and poor clearance','Lactate is always from gut bacteria','It reflects glucose only','It is lab artefact'],0,'Beta-adrenergic stress and impaired hepatic clearance also contribute.']];
XQ.asa=[
['Alkalinising the urine helps in salicylate overdose because…',['Ionised salicylate is trapped and excreted','It stops absorption','It raises the CO₂','It lowers the dose'],0,'Ion trapping increases renal elimination.'],
['Which is an indication for dialysis in salicylate poisoning?',['Altered mental status','A normal pH','Mild tinnitus','A normal level'],0,'Altered mental status, acidaemia or very high levels indicate severe toxicity.'],
['Why is intubating a salicylate patient dangerous?',['Loss of ventilation lets pH fall and salicylate enter the brain','It lowers the dose','It raises urine pH','It cools the patient'],0,'Acidaemia increases CNS penetration; the high minute ventilation must be preserved.']];
XQ.toxalc2=[
['Measured osm 340, calculated 290. What is the osmolar gap?',['50','30','10','630'],0,'340 − 290 = 50, well above the normal range.'],
['Why can the osmolar gap be normal late after ingestion?',['The parent alcohol has been metabolised to acids','Toxic alcohols are not osmotically active','The test fails after 12 hours','Ethanol cancels it'],0,'By then the acid metabolites cause an anion gap rather than an osmolar gap.'],
['Drinking ethanol raises the osmolar gap because…',['It is an unmeasured osmole','It is an acid','It lowers sodium','It is cleared by dialysis'],0,'Ethanol adds osmolality that the calculated value does not include.']];
XQ.copd=[
['What is the target saturation for a patient at risk of hypercapnia?',['88–92%','94–98%','100%','80–85%'],0,'This avoids both hypoxaemia and oxygen-induced CO₂ retention.'],
['After 1 hour on NIV the pH is 7.25 with PCO₂ 75, worse than before. What next?',['Escalate: ICU review and invasive ventilation','Continue unchanged','Stop oxygen','Give sedatives'],0,'Failure to improve on NIV needs escalation.'],
['A compensated chronic CO₂ retainer typically has HCO₃⁻ around…',['30–35 mmol/L','12–15 mmol/L','24 mmol/L','45–50 mmol/L'],0,'Renal retention of bicarbonate offsets chronic hypercapnia.']];
XQ.asthma=[
['The typical gas early in an asthma attack is…',['Respiratory alkalosis','Respiratory acidosis','Metabolic alkalosis','Normal'],0,'Hypoxia and anxiety drive hyperventilation.'],
['High-dose salbutamol commonly causes…',['Hypokalaemia','Hyperkalaemia','Hypernatraemia','Hypocalcaemia'],0,'Beta stimulation drives potassium into cells.'],
['What marks near-fatal asthma?',['A raised PaCO₂','A high peak flow','Mild wheeze','A low lactate'],0,'CO₂ retention or need for ventilation defines it.']];
XQ.pe=[
['In massive PE, ETCO₂ is far below PaCO₂ because…',['Dead space is increased','CO₂ production rises','The sensor is faulty','Ventilation is too high'],0,'Perfusion is lost to ventilated alveoli, so exhaled CO₂ is diluted.'],
['Hypoxaemia in PE mainly results from…',['V/Q mismatch','Hypoventilation','Low inspired oxygen','Anaemia'],0,'Unperfused lung does not contribute; perfused areas receive more flow.'],
['The A–a gradient is raised in PE because…',['Gas exchange is impaired','CO₂ rises','Ventilation falls','Haemoglobin falls'],0,'PaO₂ falls more than PAO₂.']];
XQ.vomit=[
['Vomiting causes alkalosis by loss of…',['Gastric acid (H⁺ and Cl⁻)','Bicarbonate','Sodium only','Water only'],0,'Each H⁺ lost leaves behind a new bicarbonate.'],
['Why is hypokalaemia common with vomiting?',['Renal potassium loss under aldosterone','Gastric potassium loss alone','Insulin release','Shift into red cells'],0,'Volume depletion and alkalosis increase urinary potassium excretion.'],
['What is the first-line fluid for a hypovolaemic patient with vomiting alkalosis?',['0.9% saline with potassium','Dextrose 5%','Sodium bicarbonate','Furosemide'],0,'It restores chloride and volume so the kidney can excrete bicarbonate.']];
XQ.diarr=[
['Diarrhoea causes acidosis because the stool loses…',['Bicarbonate-rich fluid','Chloride only','Albumin','Lactate'],0,'Pancreatic and small bowel secretions are alkaline.'],
['Why is potassium low in diarrhoea?',['Faecal loss and secondary hyperaldosteronism','Insulin','Excess intake','Haemolysis'],0,'Volume depletion drives renal potassium wasting too.'],
['Severe dehydration from diarrhoea adds…',['A lactic (HAGMA) component','Metabolic alkalosis','Respiratory acidosis','Hypernatraemia only'],0,'Poor perfusion produces lactate on top of the NAGMA.']];
XQ.renalfail=[
['Chronic kidney disease causes acidosis because the kidney fails to…',['Excrete ammonium and acid','Make urea','Retain sodium','Concentrate urine'],0,'Nephron loss reduces ammoniagenesis and net acid excretion.'],
['In uraemic acidosis the anion gap rises when GFR falls below about…',['15–20 mL/min','60 mL/min','45 mL/min','90 mL/min'],0,'Retained anions accumulate in advanced disease.'],
['Chronic metabolic acidosis in CKD harms…',['Bone and muscle','Hearing only','Skin only','The lens only'],0,'Buffering by bone and protein catabolism worsen both.']];
XQ.arrest=[
['The typical gas in cardiac arrest is…',['Mixed respiratory and metabolic acidosis','Respiratory alkalosis','Metabolic alkalosis','Normal'],0,'No ventilation retains CO₂ and anaerobic metabolism makes lactate.'],
['During CPR, which sample better reflects tissue acid–base status?',['Central venous','Arterial','Capillary','Any, they match'],0,'Low flow lets venous CO₂ rise while arterial values can look near normal.'],
['Why avoid hyperoxia after ROSC?',['It may add to reperfusion injury','It lowers CO₂','It causes bradycardia','It lowers lactate'],0,'Targeting a normal saturation avoids the harms of excess oxygen.']];
XQ.opioid=[
['Oxygen in an opioid overdose may…',['Improve SpO₂ while hypoventilation worsens','Reverse the respiratory depression','Lower PaCO₂','Make naloxone unnecessary'],0,'Saturation can look good while CO₂ keeps rising.'],
['Acute PaCO₂ of 90 mmHg. Expected pH is about…',['7.00','7.20','7.30','7.40'],0,'Acute rule: pH falls about 0.08 per 10 mmHg rise, so 5 × 0.08 = 0.4 below 7.40.'],
['Why monitor after naloxone?',['The opioid may outlast the antidote','Naloxone causes alkalosis','Naloxone raises PCO₂','It lowers lactate'],0,'Re-sedation is possible with long-acting opioids.']];
XQ.heat=[
['Heat stroke is defined by a core temperature above…',['40 °C with CNS dysfunction','38 °C','39 °C only','37.5 °C with sweating'],0,'The combination marks a medical emergency.'],
['The early gas in heat illness is typically…',['Respiratory alkalosis','Respiratory acidosis','Metabolic alkalosis','Normal'],0,'Hyperventilation comes first; lactic acidosis follows.'],
['The priority in heat stroke is…',['Rapid cooling','Antipyretics','Bicarbonate','Observation'],0,'Rapid active cooling is the main treatment.']];
XQ.co=[
['Why is PaO₂ normal in CO poisoning?',['Dissolved oxygen is unaffected','Oxygen is never inhaled','CO raises PaO₂','CO makes the curve shift right'],0,'CO binds haemoglobin, not plasma oxygen.'],
['COHb half-life on 100% oxygen is about…',['60–90 minutes','5 minutes','6 hours','24 hours'],0,'It is about 4–6 hours on room air.'],
['Which finding supports considering hyperbaric oxygen?',['Loss of consciousness','A mild headache','Normal COHb','Normal ECG'],0,'Neurological deficits or loss of consciousness raise concern for severe poisoning.']];
XQ.methb=[
['Blood that stays dark brown in air suggests…',['Methaemoglobin','Carboxyhaemoglobin','Anaemia','Sulphaemoglobin only'],0,'Chocolate-coloured blood does not redden when exposed to oxygen.'],
['Which drug classically causes methaemoglobinaemia?',['Dapsone','Metformin','Ramipril','Atenolol'],0,'Oxidant drugs such as dapsone and benzocaine are common triggers.'],
['Oxygen therapy in methaemoglobinaemia…',['Does not raise SpO₂ much','Normalises SpO₂','Is harmful','Replaces methylene blue'],0,'Methaemoglobin cannot carry oxygen, so the reading stays near 85%.']];
XQ.preg=[
['Why is PaCO₂ lower in pregnancy?',['Progesterone increases ventilation','Higher haemoglobin','Lower metabolic rate','Reduced lung volume'],0,'Resting ventilation rises by about a third.'],
['Why aim for maternal SpO₂ of 95% or more?',['To maintain fetal oxygen delivery','To lower CO₂','To raise bicarbonate','To avoid alkalosis'],0,'The fetus depends on maternal oxygenation.'],
['DKA in pregnancy may occur at…',['Lower glucose levels','Higher glucose only','Normal pH','Normal ketones'],0,'Euglycaemic or near-euglycaemic DKA is more likely.']];
XQ.glance=[
['What is the second look in the glance?',['PCO₂ against the pH direction','The PaO₂','The anion gap','The lactate'],0,'It tells you whether the primary process is respiratory or metabolic.'],
['pH 7.55, PCO₂ 25. What does the shortcut say?',['Consistent with acute respiratory alkalosis','Metabolic alkalosis','Chronic respiratory alkalosis','Mixed acidosis'],0,'About 0.08 per 10 mmHg below 40 gives roughly 7.52.'],
['The four-look glance needs extra numbers for…',['The anion gap','The pH','The PCO₂','The saturation'],0,'It needs sodium, chloride and bicarbonate.']];
XQ.rhabdo=[
['A dipstick positive for blood with no red cells suggests…',['Myoglobinuria','Haematuria','UTI','Glucosuria'],0,'Myoglobin reacts on the strip without intact cells.'],
['The cornerstone of rhabdomyolysis treatment is…',['Early IV fluids','Diuretics','Bicarbonate infusion','Rest'],0,'Fluids maintain urine flow and protect the kidney.'],
['Early hypocalcaemia in rhabdomyolysis results from…',['Calcium deposition in damaged muscle','Dietary lack','Alkalosis','Haemolysis'],0,'Calcium moves into injured muscle and binds phosphate.']];
XQ.etoh=[
['In alcoholic ketoacidosis, glucose-containing fluid is given after…',['Thiamine','Potassium','Bicarbonate','Insulin'],0,'Glucose first can precipitate Wernicke encephalopathy.'],
['Why may urine dipstick understate AKA?',['BHB predominates and the strip detects acetoacetate','Ketones are not excreted','pH is high','Ethanol blocks the test'],0,'Blood BHB is the better measure.'],
['Why can pH look normal in AKA despite a large gap?',['A co-existing metabolic alkalosis from vomiting','Respiratory compensation is perfect','The gap is false','Bicarbonate is high'],0,'Vomiting adds a metabolic alkalosis.']];
XQ.drugacid=[
['Linezolid can cause…',['Lactic acidosis','Alkalosis','Hypoglycaemia','Hypernatraemia'],0,'Mitochondrial toxicity limits oxidative metabolism.'],
['Metformin accumulates in…',['Renal failure','Heart failure only','Liver disease only','Anaemia'],0,'It is cleared by the kidney.'],
['Glue sniffing (toluene) classically causes…',['NAGMA with hypokalaemia','HAGMA','Metabolic alkalosis','Hypercalcaemia'],0,'Hippurate excretion and a distal tubule defect combine.']];
XQ.gib=[
['In acute GI bleeding, early haemoglobin may be…',['Normal','Very low at once','High','Unmeasurable'],0,'Haemodilution takes time.'],
['Which gas finding best reflects hypoperfusion in a bleed?',['Raised lactate or base deficit','High PaO₂','High pH','Low potassium'],0,'They mark tissue hypoxia early.'],
['Tranexamic acid in GI bleeding is…',['Not routinely recommended','Recommended for all','Given only as a gel','Given as a tablet only'],0,'The HALT-IT trial found no benefit and more thromboembolic events.']];
XQ.kids=[
['Normal infant HCO₃⁻ is about…',['20–22 mmol/L','28–30 mmol/L','12 mmol/L','35 mmol/L'],0,'It is lower than the adult range.'],
['A typical gas in severe bronchiolitis is…',['Respiratory acidosis','Respiratory alkalosis','Metabolic alkalosis','Normal'],0,'Airway obstruction and fatigue retain CO₂.'],
['A heel-prick capillary gas is adequate for…',['pH and PCO₂','PO₂','Oxygen saturation','Co-oximetry'],0,'Arterialised capillary values track pH and CO₂ well but not oxygen.']];
XQ['tc-radial']=[
['Where should the radial artery be palpated?',['1–2 cm above the wrist crease','At the elbow','At the base of the thumb','Over the ulna'],0,'It runs straight, close to the surface, just proximal to the crease.'],
['What is lidocaine for before a radial puncture?',['Reducing pain','Lowering PaO₂','Stopping clotting','Raising pressure'],0,'A small local anaesthetic wheal makes the stick easier for the patient.']];
XQ['tc-allen']=[
['The Barbeau test uses…',['A pulse oximeter on the thumb','A tourniquet','Ultrasound only','X-ray'],0,'The signal is watched while the radial artery is compressed.'],
['A normal Allen return time is under about…',['5–7 seconds','1 second','20 seconds','30 seconds'],0,'Over about 15 seconds is abnormal.']];
XQ['tc-venous']=[
['Venous PCO₂ is on average how much above arterial?',['About 5 mmHg','About 20 mmHg','About 0 mmHg','About 1 mmHg'],0,'The difference varies, which is why venous PCO₂ is only a screen.'],
['Releasing the tourniquet early helps because…',['It limits stasis effects on lactate, K⁺ and pH','It raises PO₂','It lowers the pressure','It stops clotting'],0,'Stasis and muscle work distort the sample.']];
XQ['tc-bubbles']=[
['A bubble changes the PO₂ most when the sample PO₂ is…',['Far from 150 mmHg','Close to 150 mmHg','Exactly 100 mmHg','Low only'],0,'The bubble pulls the sample toward air.'],
['How long can a plastic syringe sit at room temperature?',['About 30 minutes','2 hours','6 hours','24 hours'],0,'Beyond that, run a fresh sample.']];
