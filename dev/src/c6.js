/* ================= 4.2: more questions per lesson (batch 1: start, chemistry, physics, cells) ================= */
const XQ={};
XQ.learn=[
['Why does testing yourself build memory better than rereading?',['Recall strengthens the memory trace','It feels easier than reading it','It covers more pages in an hour','It replaces the need for sleep'],0,'Effortful retrieval is itself the learning event; rereading mostly builds familiarity.'],
['Buffer sets a reflex target of 90% correct in under 8 seconds. What is that training?',['Pattern recognition with no sums','Slow derivation from first principles','Memorising every single formula','Typing speed on the keypad'],0,'Speed with accuracy is the mark that a pattern has become automatic.']];
XQ.ph=[
['Using the 80 rule, what is [H⁺] at pH 7.48?',['32 nmol/L','28 nmol/L','42 nmol/L','48 nmol/L'],0,'[H⁺] ≈ 80 − the two digits after the decimal point: 80 − 48 = 32 (true value 33). The rule holds between pH 7.20 and 7.50.'],
['Which pH corresponds to a [H⁺] of about 100 nmol/L?',['7.00','7.20','7.10','6.80'],0,'pH 7 means 10⁻⁷ mol/L, which is 100 nmol/L.'],
['Why does a small pH change matter clinically?',['Proteins, enzymes and channels sense [H⁺]','The pH electrode is too imprecise to trust','Only a pH below 7.0 affects cell function','The kidneys correct it within minutes'],0,'A fall of 0.1 raises [H⁺] by about 25%. That changes protein charge, so enzymes, ion channels and oxygen binding all shift. The kidneys take days, not minutes.']];
XQ.buffer=[
['At pH equal to the pKa, a buffer pair contains…',['Equal acid and base forms','Ten times more base form','Ten times more acid form','No buffer capacity left'],0,'Henderson–Hasselbalch gives log(1) = 0 when the two forms are equal. Capacity is greatest here, not lost.'],
['Adding strong acid to a bicarbonate solution mainly produces…',['CO₂ and water','More bicarbonate','Hydroxide ions','Carbonate (CO₃²⁻)'],0,'H⁺ + HCO₃⁻ gives carbonic acid, which becomes CO₂ and water that the lungs remove.'],
['Two buffers share the same pKa, but one is ten times more concentrated. That one…',['Absorbs more acid per pH change','Has a pKa one unit higher','Works over a narrower pH range','Buffers added base but not acid'],0,'Capacity scales with concentration; the pKa, and so the best working range, stays the same.']];
XQ.ca=[
['Which structure uses carbonic anhydrase to reclaim filtered bicarbonate?',['Proximal tubule','Loop of Henle thin limb','Glomerular capsule','Collecting duct only'],0,'Most filtered bicarbonate is reabsorbed in the proximal tubule via carbonic anhydrase.'],
['In what form is most CO₂ carried in the blood?',['Bicarbonate','Dissolved CO₂','Carbamino compounds','Carbonic acid'],0,'About 90% of the CO₂ in arterial blood is bicarbonate; carbamino-Hb and dissolved gas make up the rest.'],
['A ventilated COPD patient after diuresis has HCO₃⁻ 38 and PaCO₂ 55 and is failing to wean. Which drug could lower the bicarbonate?',['Acetazolamide','Furosemide','Hydrocortisone','Sodium bicarbonate'],0,'Blocking carbonic anhydrase stops proximal bicarbonate reclaim, so HCO₃⁻ is lost in urine and the drive to breathe improves. Loop diuretics make a contraction alkalosis worse.']];
XQ.hh=[
['If HCO₃⁻ stayed at exactly 24 while PCO₂ doubled to 80, what would the pH be?',['About 7.10','About 7.25','About 7.00','Still 7.40'],0,'The ratio halves from 20:1 to 10:1, so the log term falls from 1.3 to 1.0 (a fall of 0.3): 6.1 + 1.0 = 7.10. In a real patient cell buffering adds about 4 to the HCO₃⁻, so the pH is nearer 7.16.'],
['Both HCO₃⁻ and PCO₂ double. The pH…',['Stays the same','Falls','Rises','Cannot be known'],0,'The ratio is unchanged, so the pH is unchanged. In patients, compensation moves the ratio back towards 20:1 but does not reach it.'],
['From which values can the third be calculated on a gas analyser?',['Any two of pH, PCO₂, HCO₃⁻','Only pH and HCO₃⁻ together','Only PCO₂ and PO₂ together','None, all three are measured'],0,'Henderson–Hasselbalch links all three; the analyser measures pH and PCO₂ and calculates bicarbonate.']];
XQ.otherbuf=[
['Which non-bicarbonate buffer is quantitatively largest in whole blood?',['Haemoglobin','Plasma phosphate','Plasma albumin','Urinary ammonia'],0,'Haemoglobin, with its many histidine groups, is the major non-bicarbonate blood buffer.'],
['The isohydric principle says that…',['All buffer pairs share one [H⁺]','Only bicarbonate counts at all','Proteins buffer first, then phosphate','Buffers act in strict sequence'],0,'Changing one pair changes the others through the shared [H⁺], so measuring one tells you the state of all.'],
['A woman with long-standing distal RTA has low bone density. What links the two?',['Bone buffers the acid and loses mineral','Low potassium weakens the bone matrix','Ammonium deposits displace bone calcium','Urinary phosphate binds calcium in bone'],0,'Bone carbonate and phosphate buffer a chronic acid load, at a cost to bone mineral. The same happens in CKD.']];
XQ.stewart=[
['Which three variables are independent in the Stewart approach?',['PCO₂, SID and A_tot','pH, HCO₃⁻ and PCO₂','Na⁺, K⁺ and Cl⁻ only','Albumin, glucose and urea'],0,'In Stewart, pH and HCO₃⁻ are dependent on PCO₂, strong ion difference and total weak acid.'],
['Why does free-water loss (e.g. diabetes insipidus) alkalinise in the Stewart view?',['It widens the SID','It lowers PCO₂','It raises albumin charge','It adds bicarbonate'],0,'Na⁺ and Cl⁻ concentrate together, so the gap between them, the SID, widens. Diuretic contraction alkalosis is chloride loss: a bigger SID for a different reason.'],
['In the Stewart model, bicarbonate is…',['A dependent variable','An independent variable','Irrelevant','Always fixed at 24'],0,'It changes as a consequence of the three independent variables rather than driving them.']];
XQ.stewartx=[
['A strong ion gap of 12.8 points to…',['Unmeasured anions','Hypoalbuminaemia','Free water excess','Hypercapnia'],0,'A positive SIG means unmeasured strong anions such as ketones or toxins.'],
['Na − Cl is 28 mmol/L where normal is about 36. This suggests…',['Chloride excess versus sodium','An excess of sodium instead','A high albumin level','A laboratory error only'],0,'A narrow Na − Cl gap means chloride is high relative to sodium, a hyperchloraemic component.'],
['AG 16, albumin 20 g/L. What is the albumin-corrected gap?',['21','16','12','25'],0,'Corrected AG = 16 + 0.25 × (40 − 20) = 21.']];
XQ.dalton=[
['Humidified room air at sea level and 37 °C: what is the inspired PO₂?',['About 150 mmHg','About 160 mmHg','About 100 mmHg','About 213 mmHg'],0,'0.21 × (760 − 47) ≈ 150 mmHg.'],
['At about 5,500 m barometric pressure is roughly half of sea level. The inspired PO₂ is about…',['70 mmHg','100 mmHg','150 mmHg','35 mmHg'],0,'0.21 × (380 − 47) ≈ 70 mmHg.'],
['In a gas mixture, the partial pressure of one gas equals…',['Its fraction × total pressure','Its fraction ÷ total pressure','Its mass × temperature','The total pressure minus 47'],0,'Dalton\'s law: each gas contributes its fraction of the total pressure.']];
XQ.henry=[
['Why can hyperbaric oxygen raise tissue oxygen even with fully saturated haemoglobin?',['Dissolved O₂ rises with PO₂','Haemoglobin binds more than four O₂','The curve shifts to the left','The red cells multiply quickly'],0,'Henry\'s law: dissolved O₂ is proportional to PO₂, so very high pressures dissolve useful amounts.'],
['At a PCO₂ of 40 mmHg, how much CO₂ is dissolved?',['1.2 mmol/L','24 mmol/L','0.12 mmol/L','12 mmol/L'],0,'0.03 × 40 = 1.2 mmol/L.'],
['On 100% oxygen at sea level, PaO₂ is 600 mmHg. About how much O₂ is dissolved in plasma?',['1.8 mL/dL','0.3 mL/dL','6 mL/dL','20 mL/dL'],0,'0.003 × 600 = 1.8 mL/dL, against about 20 mL/dL carried by haemoglobin. Only hyperbaric pressures dissolve about 6 mL/dL.']];
XQ.alv=[
['On FiO₂ 1.0 at sea level with PaCO₂ 40, what is the alveolar PO₂?',['About 663 mmHg','About 713 mmHg','About 760 mmHg','About 600 mmHg'],0,'713 − 40 ÷ 0.8 = 663 mmHg.'],
['Which cause of hypoxaemia has a normal A–a gradient?',['Hypoventilation','Shunt','V/Q mismatch','Diffusion limitation'],0,'In pure hypoventilation PAO₂ falls with PaO₂, so the difference stays normal.'],
['A respiratory quotient of 0.8 means…',['CO₂ produced is 80% of O₂ consumed','O₂ consumed is 80% of CO₂ produced','80% of inspired O₂ is absorbed','Alveolar gas is 80% nitrogen'],0,'It is the ratio of CO₂ output to O₂ uptake, set by the fuel being burned.']];
XQ.temp=[
['A patient at 30 °C has a sample run at 37 °C. Their true in-body pH is…',['Higher than reported','Lower than reported','About the same','Impossible to estimate'],0,'Cooling raises pH by about 0.015 per °C, so the 37 °C value reads too acidic.'],
['A patient at 31 °C on 28% oxygen has a printed PaO₂ of 70 mmHg (run at 37 °C). What is the risk?',['True PaO₂ is lower: hypoxia is missed','True PaO₂ is higher: O₂ can be cut','None: PaO₂ ignores temperature','The sample is probably venous'],0,'PO₂ falls about 6% per °C of cooling, so the true PaO₂ is nearer 50 mmHg. Do not be reassured by the printed value in a cold patient.'],
['pH-stat management of a cooled patient means…',['Correcting to body temperature, adding CO₂','Reading the values at 37 °C, uncorrected','Giving bicarbonate to hold pH at 7.40','Hyperventilating to keep PCO₂ low'],0,'pH-stat aims for normal temperature-corrected values, so CO₂ is added. It is used in some paediatric cardiac bypass; adults are usually managed alpha-stat.']];
XQ.acidsrc=[
['Which of these is a volatile acid load?',['CO₂ from metabolism','Sulfuric acid from protein','Lactic acid','Phosphoric acid'],0,'CO₂ is excreted by the lungs; the others are fixed acids for the kidney.'],
['About how much fixed acid does a 70 kg adult generate each day?',['About 70 mmol','About 15,000 mmol','About 7 mmol','About 700 mmol'],0,'Roughly 1 mmol/kg/day.'],
['Put the responses in order of speed, fastest first.',['Buffers, lungs, kidneys','Kidneys, lungs, buffers','Lungs, kidneys, buffers','Buffers, kidneys, lungs'],0,'Buffering takes seconds, ventilation minutes, renal compensation days.']];
XQ.lactate=[
['Type A lactic acidosis is caused by…',['Poor tissue oxygen delivery','Adverse drug effects','Liver failure on its own','Very high glucose levels'],0,'Hypoperfusion or hypoxia pushes cells toward anaerobic glycolysis.'],
['Which organs clear most lactate?',['Liver and kidney','Red cells and gut','Lung and spleen','Skin and fat'],0,'The liver (Cori cycle) and kidney remove most of it. Red cells and gut are net producers.'],
['Thiamine deficiency can raise lactate because…',['Pyruvate dehydrogenase needs it','Thiamine itself buffers lactate','It lowers oxygen delivery','It blocks the liver\'s output'],0,'Without it pyruvate cannot enter the citric acid (Krebs) cycle and is converted to lactate.']];
XQ.ketones=[
['Which ketone body is most abundant in DKA?',['β-hydroxybutyrate','Acetoacetate','Acetone','Acetoacetyl-CoA'],0,'BHB outnumbers acetoacetate roughly three to one or more in DKA. Acetoacetyl-CoA is an intermediate, not a ketone body.'],
['A well adult has fasted for three days before surgery. The gas most likely shows…',['HCO₃⁻ about 19, pH near normal','HCO₃⁻ about 8, pH below 7.10','A raised osmolar gap of 20','A primary respiratory acidosis'],0,'Starvation ketosis is mild: HCO₃⁻ rarely falls below 18 because some insulin is still present.'],
['A man presents after a binge and three days of vomiting with pH 7.20 and BHB 6. His glucose is typically…',['Low or normal','High, as in DKA','Always above 20 mmol/L','Above 33, as in HHS'],0,'Alcoholic ketoacidosis follows binge drinking and poor intake, not insulin deficiency.']];
XQ.microbes=[
['Short bowel syndrome, after a large sweet meal: slurred speech, AG 24, lactate 1.0, ketones normal. What is happening?',['Gut bacteria are making D-lactate','The liver is making excess L-lactate','Insulin lack is causing ketosis','The kidneys are retaining acid'],0,'Colonic bacteria ferment the spare sugar to D-lactate, which the standard L-lactate assay misses. Ask the lab for D-lactate.'],
['Which gas pattern is typical early in sepsis?',['Respiratory alkalosis','Respiratory acidosis','Metabolic alkalosis','A completely normal gas'],0,'Hyperventilation from the systemic inflammatory response comes first.'],
['How do you limit leukocyte larceny?',['Analyse at once, check against SpO₂','Leave it for an hour first','Add more heparin to the syringe','Shake the syringe hard'],0,'Cells keep consuming O₂ in the syringe, so speed and a saturation cross-check matter.']];
XQ.rbc=[
['Working muscle (high CO₂, low pH, warm) shifts the dissociation curve…',['Right, releasing more O₂','Left, releasing more O₂','Right, holding O₂ tighter','Left, holding O₂ tighter'],0,'The Bohr effect lowers affinity, so O₂ is released where it is needed.'],
['In the chloride shift, bicarbonate leaves the red cell in exchange for…',['Chloride','Sodium','Potassium','Protons'],0,'Band 3 swaps HCO₃⁻ out for Cl⁻ in to keep the cell electrically neutral.'],
['A climber has spent two weeks at 4,500 m. What has happened to 2,3-BPG and the curve?',['BPG up, curve shifted right','BPG up, curve shifted left','BPG down, curve shifted right','BPG down, curve shifted left'],0,'Chronic hypoxia raises 2,3-BPG, which lowers O₂ affinity and releases oxygen to tissues more easily.']];
XQ.toxalc=[
['Ethanol-free man with blurred vision: pH 7.05, AG 30, osmolar gap 25. Which antidote blocks the toxic step?',['Fomepizole','Naloxone','Methylene blue','Hydroxocobalamin'],0,'This is methanol: formic acid injures the optic nerve. Fomepizole blocks alcohol dehydrogenase so no more formate is made; dialysis removes what is there.'],
['Ethanol-free patient: gas lactate 12, laboratory lactate 1.8, AG 28. Most likely?',['Ethylene glycol','Methanol','D-lactic acidosis','Metformin toxicity'],0,'Some gas analysers read glycolate as lactate; the laboratory assay does not. This lactate gap points to ethylene glycol. Look for oxalate crystals and AKI.'],
['Malnourished woman on regular paracetamol and flucloxacillin: AG 26, lactate 1.2, ketones 0.2, normal osmolar gap. Likely acid?',['5-oxoproline','D-lactate','Formic acid','Glycolic acid'],0,'Glutathione depletion lets 5-oxoproline (pyroglutamic acid) build up: the "O" in GOLDMARK. Stop the paracetamol and flucloxacillin; consider acetylcysteine.']];
