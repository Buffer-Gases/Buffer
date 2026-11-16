/* ================= 4.2: more questions per lesson (batch 3: disorders, clinical, technique) ================= */
XQ.read6=[
['What is the first step of the six-step read?',['Check that the numbers fit together','Calculate the anion gap first','Decide what compensation is due','Look at the PaO₂ and the FiO₂'],0,'A gas that does not obey Henderson–Hasselbalch is a bad sample, not a diagnosis.'],
['pH 7.50, PCO₂ 30, HCO₃⁻ 23. What is the interpretation?',['Acute respiratory alkalosis','Metabolic alkalosis','Chronic respiratory alkalosis','Normal gas'],0,'Alkalaemia with a low PCO₂, and bicarbonate only 1–2 below normal, fits an acute change.'],
['Why does the direction of the pH point to the primary disorder?',['Compensation does not overshoot','pH is measured first','Bicarbonate is calculated','PCO₂ is unreliable'],0,'A compensating process pushes pH back toward normal, never beyond it.']];
XQ.hagma=[
['AG 26, HCO₃⁻ 10. What is the delta ratio?',['1.0','0.5','2.0','3.0'],0,'(26 − 12) ÷ (24 − 10) = 14 ÷ 14 = 1.0, a pure HAGMA.'],
['Which of these causes a normal anion gap acidosis?',['Diarrhoea','Lactic acidosis','Ketoacidosis','Methanol'],0,'Gut bicarbonate loss is replaced by chloride, so the gap stays normal.'],
['Severe metformin-associated lactic acidosis with lactate above 20 may need…',['Haemodialysis','Insulin only','Diuretics','Oral bicarbonate only'],0,'EXTRIP recommends dialysis for lactate above 20 mmol/L or pH ≤ 7.0.']];
XQ.nagma=[
['Which cause of NAGMA is associated with a raised potassium?',['Type 4 RTA','Diarrhoea','Type 2 RTA','Acetazolamide'],0,'Hypoaldosteronism retains potassium and impairs ammonium excretion.'],
['Large-volume 0.9% saline typically causes…',['Hyperchloraemic NAGMA','HAGMA','Metabolic alkalosis','Respiratory acidosis'],0,'Chloride load lowers the SID and bicarbonate.'],
['Which surgery classically causes NAGMA?',['Ureterosigmoidostomy','Appendicectomy','Cholecystectomy','Total hip replacement'],0,'Chloride is absorbed from urine in the bowel in exchange for bicarbonate.']];
XQ.malk=[
['Metabolic alkalosis with HCO₃⁻ 36. Expected PCO₂?',['About 45 ± 5','About 30 ± 5','About 60 ± 5','About 36 ± 5'],0,'0.7 × 36 + 20 ≈ 45.'],
['A COPD patient who has been vomiting has HCO₃⁻ 36 and PCO₂ 62. Expected PCO₂ is about 45. The PCO₂ shows…',['A second, respiratory acidosis','Appropriate, full compensation','A sampling error only','A respiratory alkalosis'],0,'0.7 × 36 + 20 ≈ 45 ± 5. A PCO₂ well above that is more than compensation: a separate respiratory acidosis, here from COPD.'],
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
['pH 7.35, PCO₂ 60, HCO₃⁻ 32. What is the interpretation?',['Chronic respiratory acidosis','Acute respiratory acidosis','Respiratory acidosis + metabolic alkalosis','Respiratory + metabolic acidosis'],0,'Chronic: 24 + 4 × 2 = 32, and pH 7.40 − 0.03 × 2 ≈ 7.34. Both are just what is expected, so there is one disorder.'],
['HAGMA with NAGMA together gives a delta ratio…',['Below 0.8','Above 2','Exactly 1','Equal to 5'],0,'Bicarbonate falls more than the gap rises.'],
['PCO₂ and HCO₃⁻ moving in opposite directions, from normal, means…',['A mixed disorder','Perfect compensation','A lab error','Chronic disease'],0,'Compensation moves them together; opposite movement means two primary processes.']];
XQ.oxread=[
['Co-oximeter SaO₂ 80% with PaO₂ 95 mmHg. What is the cause?',['Dyshaemoglobinaemia','Shunt','Hypoventilation','Low inspired oxygen'],0,'A normal PaO₂ with low measured saturation means haemoglobin is not carrying oxygen.'],
['PaO₂ 60 on FiO₂ 0.6 with PEEP 8 and bilateral infiltrates. What is the P/F ratio and severity?',['100, severe','300, mild','200, moderate','400, normal'],0,'60 ÷ 0.6 = 100, which is at the severe threshold.'],
['Hypoxaemia with a normal PaCO₂ and a raised A–a gradient points to…',['A lung problem','Pure hypoventilation','Low altitude','Anaemia'],0,'The gradient shows the lung is failing to transfer oxygen.']];
XQ.dka=[
['DKA, 14 hours into treatment: glucose 9, venous pH 7.33, HCO₃⁻ 17, BHB 0.4, eating. What now?',['Resolved: plan subcutaneous insulin','Not resolved: HCO₃⁻ is below 18','Not resolved: wait for urine ketones to clear','Not resolved: glucose must be below 7'],0,'Resolution is ketones below 0.6 with venous pH 7.3 or more (or HCO₃⁻ 18 or more): either acid marker will do. Urine strips lag behind blood BHB, and glucose is not a criterion.'],
['Chloride rises and the anion gap falls during DKA treatment. Why?',['Ketoanions lost in urine, chloride from saline','A new lactic acidosis from poor perfusion','Insulin driving chloride out of cells','Rising PCO₂ as the patient tires'],0,'Ketoanions are excreted with sodium and replaced by chloride from the fluids, leaving a hyperchloraemic (normal gap) acidosis.'],
['DKA, four hours into treatment: K⁺ is 4.2 mmol/L. What should the next bag of 0.9% saline contain?',['40 mmol/L of potassium chloride','No potassium until K⁺ is below 3.5','Sodium bicarbonate 1.26% instead','20 mmol/L of potassium phosphate only'],0,'Insulin drives K⁺ into cells. JBDS: add 40 mmol/L KCl when K⁺ is 3.5–5.5, none above 5.5. Below 3.5 needs senior review and more potassium; the 2024 consensus delays insulin until K⁺ is above 3.5.']];
XQ.sepsis=[
['Sepsis-3 septic shock needs vasopressors to keep MAP ≥ 65 and a lactate above…',['2 mmol/L','4 mmol/L','6 mmol/L','1 mmol/L'],0,'The definition combines vasopressor need and lactate above 2 despite fluid.'],
['Septic shock after 5 L of 0.9% saline: AG 11, HCO₃⁻ 15, Cl⁻ 116. A balanced crystalloid would have caused less…',['Hyperchloraemic acidosis','Lactate-driven alkalosis','Fluid overload and oedema','Respiratory acidosis'],0,'Saline has an SID of zero; balanced fluids have less chloride, so the SID and bicarbonate fall less. Volume effects are similar.'],
['Septic patient: warm, MAP 72 on low-dose noradrenaline, ScvO₂ 80%, lactate 4.5. Why can lactate be high without tissue hypoxia?',['β₂-driven glycolysis and poor clearance','Bacteria in the blood make the lactate','Saline infusion raises measured lactate','Noradrenaline blocks lactate entry to cells'],0,'Adrenergic stress speeds aerobic glycolysis in muscle, and the septic liver clears lactate more slowly. Lactate still tracks risk, so follow the trend.']];
XQ.asa=[
['Alkalinising the urine helps in salicylate overdose because…',['Ionised salicylate is trapped in urine','Bicarbonate binds salicylate in plasma','It speeds liver conjugation of salicylate','Alkaline urine raises the filtration rate'],0,'At urine pH 7.5–8.5 more salicylate is ionised, cannot be reabsorbed, and is excreted (ion trapping).'],
['Salicylate overdose: level 520 mg/L, pH 7.44, now confused and drowsy. Next step?',['Urgent haemodialysis','Recheck the level in 2 hours','Repeat activated charcoal only','Wait: the level is below threshold'],0,'Altered mental status is an indication on its own, whatever the level. EXTRIP also lists new hypoxaemia, pH 7.20 or less, and a level above 1,000 mg/L (900 with impaired kidneys).'],
['Salicylate overdose on a bicarbonate infusion: urine pH 6.5, K⁺ 3.0. What next?',['Replace potassium','Stop the bicarbonate','Add acetazolamide','Give more bicarbonate only'],0,'In hypokalaemia the distal tubule reabsorbs K⁺ in exchange for H⁺, so the urine stays acid. Correct K⁺ to reach the urine pH target of 7.5–8.5.']];
XQ.toxalc2=[
['Measured osm 340, calculated 290. What is the osmolar gap?',['50','30','10','630'],0,'340 − 290 = 50, well above the normal range.'],
['Why can the osmolar gap be normal late after ingestion?',['The parent alcohol has been metabolised to acids','Toxic alcohols are not osmotically active','The test fails after 12 hours','Ethanol cancels it'],0,'By then the acid metabolites cause an anion gap rather than an osmolar gap.'],
['Drinking ethanol raises the osmolar gap because…',['It is an unmeasured osmole','It is an acid','It lowers sodium','It is cleared by dialysis'],0,'Ethanol adds osmolality that the calculated value does not include.']];
XQ.copd=[
['What is the target saturation for a patient at risk of hypercapnia?',['88–92%','94–98%','100%','80–85%'],0,'This avoids both hypoxaemia and oxygen-induced CO₂ retention.'],
['After 1 hour on NIV the pH is 7.25 with PCO₂ 75, worse than before. What next?',['Optimise NIV and escalate to ICU','Continue the same settings for 4 h','Stop NIV and give high-flow oxygen','Give IV bicarbonate to fix the pH'],0,'Worsening pH at 1–2 h: optimise NIV (leak, synchrony, IPAP) and escalate to ICU for intubation if within the ceiling of care.'],
['A compensated chronic CO₂ retainer typically has HCO₃⁻ around…',['30–35 mmol/L','12–15 mmol/L','24 mmol/L','45–50 mmol/L'],0,'Renal retention of bicarbonate offsets chronic hypercapnia.']];
XQ.asthma=[
['The typical gas early in an asthma attack is…',['Respiratory alkalosis','Respiratory acidosis','Metabolic alkalosis','Normal'],0,'Hypoxia and anxiety drive hyperventilation.'],
['High-dose salbutamol commonly causes…',['Hypokalaemia','Hyperkalaemia','Hypernatraemia','Hypocalcaemia'],0,'Beta stimulation drives potassium into cells.'],
['Which finding moves acute asthma from life-threatening to near-fatal?',['A raised PaCO₂','A PaCO₂ of 4.6–6.0 kPa','A silent chest','SpO₂ below 92%'],0,'BTS/SIGN: a raised PaCO₂ or the need for ventilation with high inflation pressures is near-fatal. A "normal" PaCO₂, silent chest and SpO₂ below 92% are life-threatening features.']];
XQ.pe=[
['In massive PE, ETCO₂ is far below PaCO₂ because…',['Dead space is increased','CO₂ production rises','The sensor is faulty','Ventilation is too high'],0,'Perfusion is lost to ventilated alveoli, so exhaled CO₂ is diluted.'],
['Hypoxaemia in PE mainly results from…',['V/Q mismatch','Hypoventilation','Low inspired oxygen','Anaemia'],0,'Unperfused lung does not contribute; perfused areas receive more flow.'],
['The A–a gradient is raised in PE because…',['Gas exchange is impaired','PaCO₂ is usually raised','Ventilation is reduced','Haemoglobin is diluted'],0,'Hyperventilation raises alveolar PO₂ while V/Q mismatch lowers arterial PO₂, so the difference widens.']];
XQ.vomit=[
['Vomiting causes alkalosis by loss of…',['Gastric acid (H⁺ and Cl⁻)','Bicarbonate-rich bile','Sodium and water only','Potassium-rich fluid'],0,'Each H⁺ lost leaves behind a new bicarbonate.'],
['Why is hypokalaemia common with vomiting?',['Renal potassium loss under aldosterone','Potassium lost in the vomit itself','Poor potassium intake while unwell','Shift out of cells from acidosis'],0,'Gastric fluid holds only about 10 mmol/L of K⁺. Volume depletion, aldosterone and bicarbonaturia drive urinary potassium loss.'],
['After 2 L of 0.9% saline with KCl, a vomiting patient\'s urine pH rises from 5.5 to 7.8. This means…',['Bicarbonate is being excreted again','Distal RTA has developed','Saline has caused an acidosis','Potassium is being lost faster'],0,'With volume and chloride restored, the kidney stops defending sodium and lets bicarbonate go: the paradoxical aciduria has ended and the alkalosis is correcting.']];
XQ.diarr=[
['Diarrhoea causes acidosis because the stool loses…',['Bicarbonate-rich fluid','Acid-rich gastric fluid','Chloride-rich fluid','Lactate made by bacteria'],0,'Pancreatic and small bowel secretions are alkaline.'],
['Why is potassium low in diarrhoea?',['Stool loss plus renal loss via aldosterone','Shift into cells from the acidosis','Dilution by oral rehydration fluid','Insulin release from the oral sugar'],0,'Stool is rich in K⁺, and volume depletion drives aldosterone and renal potassium wasting too. Acidosis shifts K⁺ out of cells, not in.'],
['Severe dehydration from diarrhoea adds…',['A lactic (HAGMA) component','A contraction metabolic alkalosis','A primary respiratory acidosis','A chloride-driven alkalosis'],0,'Poor perfusion produces lactate on top of the NAGMA.']];
XQ.renalfail=[
['Chronic kidney disease causes acidosis because the kidney fails to…',['Excrete ammonium and acid','Reabsorb enough chloride','Concentrate the urine','Retain enough sodium'],0,'Nephron loss reduces ammoniagenesis and net acid excretion.'],
['In uraemic acidosis the anion gap rises when GFR falls below about…',['15–20 mL/min','45–60 mL/min','60–90 mL/min','90–120 mL/min'],0,'Retained anions accumulate in advanced disease.'],
['Chronic metabolic acidosis in CKD harms…',['Bone and muscle','Platelet function','Erythropoietin response','Lipid profile'],0,'Buffering by bone and protein catabolism worsen both.']];
XQ.arrest=[
['The typical gas in cardiac arrest is…',['Mixed respiratory and metabolic acidosis','Metabolic acidosis with full compensation','Pure respiratory acidosis only','Metabolic alkalosis from adrenaline'],0,'No ventilation retains CO₂ and anaerobic metabolism makes lactate.'],
['During CPR, which sample better reflects tissue acid–base status?',['Central venous','Arterial','Capillary','Any, they match'],0,'Low flow lets venous CO₂ rise while arterial values can look near normal.'],
['Why avoid hyperoxia after ROSC?',['It may add to reperfusion injury','It slows the clearance of lactate','It causes a reflex bradycardia','It lowers the PaCO₂ too far'],0,'Targeting a normal saturation avoids the harms of excess oxygen.']];
XQ.opioid=[
['Oxygen in an opioid overdose may…',['Improve SpO₂ while hypoventilation worsens','Reverse the respiratory depression','Lower PaCO₂','Make naloxone unnecessary'],0,'Saturation can look good while CO₂ keeps rising.'],
['Acute PaCO₂ of 90 mmHg. Expected pH is about…',['7.00','7.20','7.30','7.40'],0,'Acute rule: pH falls about 0.08 per 10 mmHg rise, so 5 × 0.08 = 0.4 below 7.40.'],
['Why monitor after naloxone?',['The opioid may outlast the antidote','Naloxone causes a rebound alkalosis','Naloxone itself raises the PCO₂','Withdrawal lowers the lactate'],0,'Re-sedation is possible with long-acting opioids.']];
XQ.heat=[
['Heat stroke is defined by a core temperature above…',['40 °C with CNS dysfunction','38 °C','39 °C only','37.5 °C with sweating'],0,'The combination marks a medical emergency.'],
['The early gas in heat illness is typically…',['Respiratory alkalosis','Respiratory acidosis','Metabolic alkalosis','Normal'],0,'Hyperventilation comes first; lactic acidosis follows.'],
['The priority in heat stroke is…',['Rapid cooling','Antipyretics','Bicarbonate','Observation'],0,'Rapid active cooling is the main treatment.']];
XQ.co=[
['Why is PaO₂ normal in CO poisoning?',['Dissolved oxygen is unaffected','Oxygen is never inhaled','CO raises PaO₂','CO makes the curve shift right'],0,'CO binds haemoglobin, not plasma oxygen.'],
['COHb half-life on 100% oxygen is about…',['60–90 minutes','20–30 minutes','4–6 hours','24 hours'],0,'It is about 4–6 hours on room air.'],
['Charcoal-heater exposure, COHb 22%. Which finding most supports discussing hyperbaric oxygen?',['A loss of consciousness','A throbbing headache','Nausea and dizziness','A heart rate of 105'],0,'Loss of consciousness, neurological signs, cardiac ischaemia or pregnancy mark severe poisoning. Evidence for hyperbaric oxygen is mixed, so discuss with the regional unit.']];
XQ.methb=[
['Blood that stays dark brown in air suggests…',['Methaemoglobin','Carboxyhaemoglobin','Anaemia','Sulphaemoglobin only'],0,'Chocolate-coloured blood does not redden when exposed to oxygen.'],
['Which drug classically causes methaemoglobinaemia?',['Dapsone','Metformin','Ramipril','Atenolol'],0,'Oxidant drugs such as dapsone and benzocaine are common triggers.'],
['Oxygen therapy in methaemoglobinaemia…',['Does not raise SpO₂ much','Normalises SpO₂','Is harmful','Replaces methylene blue'],0,'Methaemoglobin cannot carry oxygen, so the reading stays near 85%.']];
XQ.preg=[
['Why is PaCO₂ lower in pregnancy?',['Progesterone drives ventilation','Lower CO₂ production in pregnancy','Renal bicarbonate loss comes first','Splinting of the diaphragm'],0,'Progesterone raises resting ventilation by about a third. The kidney then lowers HCO₃⁻ to compensate; CO₂ production actually rises.'],
['Why aim for maternal SpO₂ of 95% or more?',['To keep fetal oxygen delivery up','To prevent maternal hypocapnia','To raise the maternal bicarbonate','To avoid a maternal alkalosis'],0,'The fetus works on the steep part of its curve and depends on maternal oxygenation.'],
['DKA in pregnancy may occur at…',['Lower glucose levels','Higher glucose only','Normal pH','Normal ketones'],0,'Euglycaemic or near-euglycaemic DKA is more likely.']];
XQ.glance=[
['What is the second look in the glance?',['PCO₂ against the pH direction','The PaO₂ against the FiO₂','The anion gap and delta','The lactate and base excess'],0,'It tells you whether the primary process is respiratory or metabolic.'],
['pH 7.55, PCO₂ 25. What does the shortcut say?',['Fits an acute respiratory alkalosis','Fits a chronic respiratory alkalosis','Fits a primary metabolic alkalosis','Inconsistent: the PCO₂ must be wrong'],0,'Acute: 0.08 per 10 mmHg below 40 gives about 7.52, close to 7.55. Chronic would give only about 7.45, and a metabolic alkalosis would raise the PCO₂.'],
['The four-look glance needs extra numbers for…',['The anion gap','The pH','The PCO₂','The saturation'],0,'It needs sodium, chloride and bicarbonate.']];
XQ.rhabdo=[
['After a long lie, the urine dipstick is strongly positive for blood but microscopy shows no red cells. Most likely?',['Myoglobinuria','Renal stone','Bladder injury','A faulty strip'],0,'Myoglobin reacts on the strip without intact cells. Haemoglobinuria from haemolysis does the same; a long lie and a high CK point to muscle.'],
['The cornerstone of rhabdomyolysis treatment is…',['Early IV fluids','Diuretics','Bicarbonate infusion','Rest'],0,'Fluids maintain urine flow and protect the kidney.'],
['Early hypocalcaemia in rhabdomyolysis results from…',['Calcium deposition in damaged muscle','Urinary calcium loss from fluids','PTH suppression after the injury','Hypomagnesaemia from sweating'],0,'Calcium moves into injured muscle and binds phosphate.']];
XQ.etoh=[
['A malnourished drinker with alcoholic ketoacidosis has glucose 2.8 mmol/L. What do you give?',['Glucose now, thiamine alongside','Thiamine, then glucose 30 min later','Insulin with potassium first','Bicarbonate to correct the pH'],0,'Thiamine is given first or alongside because glucose metabolism uses thiamine. If the patient is hypoglycaemic, give glucose at once and thiamine straight after. Insulin is not needed: glucose and fluid switch off ketogenesis.'],
['Why may urine dipstick understate AKA?',['The strip misses BHB, the main ketone','Ethanol blocks the nitroprusside test','Ketones are not excreted in urine','Alkaline urine destroys the ketones'],0,'Blood BHB is the better measure.'],
['Why can pH look normal in AKA despite a large gap?',['A metabolic alkalosis from vomiting','Respiratory compensation is complete','The anion gap is falsely raised','Ethanol itself buffers the acid'],0,'Vomiting adds a metabolic alkalosis.']];
XQ.drugacid=[
['Linezolid can cause…',['Lactic acidosis','Alkalosis','Hypoglycaemia','Hypernatraemia'],0,'Mitochondrial toxicity limits oxidative metabolism.'],
['Metformin accumulates in…',['Renal failure','Heart failure only','Liver disease only','Anaemia'],0,'It is cleared by the kidney.'],
['Glue sniffing (toluene) classically causes…',['NAGMA with hypokalaemia','HAGMA','Metabolic alkalosis','Hypercalcaemia'],0,'Hippurate excretion and a distal tubule defect combine.']];
XQ.gib=[
['In acute GI bleeding, early haemoglobin may be…',['Normal','Very low at once','High','Unmeasurable'],0,'Haemodilution takes time.'],
['Which gas finding best reflects hypoperfusion in a bleed?',['Raised lactate or base deficit','A normal haemoglobin level','A high pH from vomiting blood','A falling ionised calcium'],0,'They mark tissue hypoxia early.'],
['Tranexamic acid in GI bleeding is…',['Not routinely recommended','Recommended for all upper bleeds','Recommended for variceal bleeds only','Given orally to every patient'],0,'HALT-IT: no fall in deaths, and more venous thromboses and seizures.']];
XQ.kids=[
['Normal infant HCO₃⁻ is about…',['20–22 mmol/L','28–30 mmol/L','12 mmol/L','35 mmol/L'],0,'It is lower than the adult range.'],
['A typical gas in severe bronchiolitis is…',['Respiratory acidosis','Respiratory alkalosis','Metabolic alkalosis','Normal'],0,'Airway obstruction and fatigue retain CO₂.'],
['A heel-prick capillary gas is adequate for…',['pH and PCO₂','PO₂','Oxygen saturation','Co-oximetry'],0,'Arterialised capillary values track pH and CO₂ well but not oxygen.']];
XQ['tc-radial']=[
['Where should the radial artery be palpated?',['1–2 cm above the wrist crease','At the elbow','At the base of the thumb','Over the ulna'],0,'It runs straight, close to the surface, just proximal to the crease.'],
['What is lidocaine for before a radial puncture?',['Reducing pain','Making the pulse easier to feel','Reducing bleeding afterwards','Keeping the sample from clotting'],0,'A small local anaesthetic wheal makes the stick easier for the patient.']];
XQ['tc-allen']=[
['The Barbeau test uses…',['A pulse oximeter on the thumb','A tourniquet on the upper arm','Capillary refill in the palm','An X-ray of the wrist arteries'],0,'The signal is watched while the radial artery is compressed.'],
['A normal Allen return time is under about…',['5–7 seconds','1 second','20 seconds','30 seconds'],0,'Over about 15 seconds is abnormal.']];
XQ['tc-venous']=[
['Venous PCO₂ is on average how much above arterial?',['About 5 mmHg','About 20 mmHg','About 0 mmHg','About 1 mmHg'],0,'The difference varies, which is why venous PCO₂ is only a screen.'],
['Why release the tourniquet before drawing a venous gas?',['To limit stasis effects on lactate and K⁺','To bring the venous PO₂ close to arterial','So the sample need not be labelled venous','To keep the PCO₂ equal to the arterial'],0,'Stasis and muscle work raise lactate and K⁺ and lower pH. Releasing the tourniquet does not make a venous sample arterial.']];
XQ['tc-bubbles']=[
['A bubble changes the PO₂ most when the sample PO₂ is…',['Far from 150 mmHg','Close to 150 mmHg','Exactly 100 mmHg','Low only'],0,'The bubble pulls the sample toward air.'],
['How long can a plastic syringe sit at room temperature?',['About 30 minutes','About 2 hours','About 6 hours','About 24 hours'],0,'Beyond that, run a fresh sample.']];
