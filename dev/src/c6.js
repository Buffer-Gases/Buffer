/* ================= 4.2: more questions per lesson (batch 1: start, chemistry, physics, cells) ================= */
const XQ={};
XQ.learn=[
['Why does testing yourself build memory better than rereading?',['Recall strengthens the memory trace','It feels easier than reading it','It covers more pages in an hour','It replaces the need for sleep'],0,'Effortful retrieval is itself the learning event; rereading mostly builds familiarity.'],
['Buffer sets a reflex target of 90% correct in under 8 seconds. What is that training?',['Pattern recognition with no sums','Slow derivation from first principles','Memorising every single formula','Typing speed on the keypad'],0,'Speed with accuracy is the mark that a pattern has become automatic.']];
XQ.ph=[
['Using the 80 rule, what is [H⁺] at pH 7.52?',['28 nmol/L','32 nmol/L','52 nmol/L','24 nmol/L'],0,'[H⁺] ≈ 80 − the two digits after the decimal point: 80 − 52 = 28.'],
['Which pH corresponds to a [H⁺] of about 100 nmol/L?',['7.00','7.20','7.10','6.80'],0,'pH 7 means 10⁻⁷ mol/L, which is 100 nmol/L.'],
['Why does a small pH change matter clinically?',['It is logarithmic: [H⁺] changes a lot','The pH electrode is imprecise','Enzymes ignore any small change','The kidneys correct it at once'],0,'Every 0.3 pH units doubles or halves [H⁺].']];
XQ.buffer=[
['At pH equal to the pKa, a buffer pair contains…',['Equal acid and base forms','Only the base form present','Ten times more of the acid form','No dissolved gas at all'],0,'Henderson–Hasselbalch gives log(1) = 0 when the two forms are equal.'],
['Adding strong acid to a bicarbonate solution mainly produces…',['CO₂ and water','More bicarbonate','Sodium hydroxide','Free chloride gas'],0,'H⁺ + HCO₃⁻ gives carbonic acid, which becomes CO₂ and water that the lungs remove.'],
['In chronic acidosis, which tissue gradually gives up buffer base?',['Bone','Skin','Lens of the eye','Adipose tissue'],0,'Bone carbonate and phosphate buffer a prolonged acid load, at a cost to bone mineral.']];
XQ.ca=[
['Which structure uses carbonic anhydrase to reclaim filtered bicarbonate?',['Proximal tubule','Loop of Henle thin limb','Glomerular capsule','Collecting duct only'],0,'Most filtered bicarbonate is reabsorbed in the proximal tubule via carbonic anhydrase.'],
['In what form is most CO₂ carried in the blood?',['Bicarbonate','Dissolved CO₂','Carbamino compounds','Carbonic acid'],0,'Roughly 70% or more travels as bicarbonate; the rest is carbamino-Hb and dissolved gas.'],
['Acetazolamide causes a normal-gap acidosis because it…',['Blocks proximal HCO₃⁻ reabsorption','Raises acid production in cells','Blocks chloride excretion','Stops ammonia formation'],0,'Bicarbonate is lost in the urine and chloride replaces it, so the gap stays normal.']];
XQ.hh=[
['HCO₃⁻ 24 and PCO₂ doubles to 80 with no renal change. What is the pH?',['About 7.10','About 7.25','About 7.00','Still 7.40'],0,'The ratio falls from 20:1 to 10:1, which is log 1 lower: 6.1 + 1.0 = 7.10.'],
['Both HCO₃⁻ and PCO₂ double. The pH…',['Stays the same','Falls','Rises','Cannot be known'],0,'The ratio is unchanged, which is exactly how full compensation keeps pH near normal.'],
['From which values can the third be calculated on a gas analyser?',['Any two of pH, PCO₂, HCO₃⁻','Only pH and HCO₃⁻ together','Only PCO₂ and PO₂ together','None, all three are measured'],0,'Henderson–Hasselbalch links all three; the analyser measures pH and PCO₂ and calculates bicarbonate.']];
XQ.otherbuf=[
['Which non-bicarbonate buffer is quantitatively largest in whole blood?',['Haemoglobin','Plasma phosphate','Plasma albumin','Urinary ammonia'],0,'Haemoglobin, with its many histidine groups, is the major non-bicarbonate blood buffer.'],
['The isohydric principle says that…',['All buffer pairs share one [H⁺]','Only bicarbonate counts at all','Proteins buffer first, then phosphate','Buffers act in strict sequence'],0,'Changing one pair changes the others through the shared [H⁺], so measuring one tells you the state of all.'],
['Phosphate is a good urinary buffer because its pKa is near…',['6.8','2.1','10.3','7.4 exactly'],0,'A pKa of about 6.8 sits in the range of urine pH, so it takes up secreted H⁺ well.']];
XQ.stewart=[
['Which three variables are independent in the Stewart approach?',['PCO₂, SID and A_tot','pH, HCO₃⁻ and PCO₂','Na⁺, K⁺ and Cl⁻ only','Albumin, glucose and urea'],0,'In Stewart, pH and HCO₃⁻ are dependent on PCO₂, strong ion difference and total weak acid.'],
['Why does water loss cause a contraction alkalosis in the Stewart view?',['It concentrates the SID','It lowers PCO₂','It raises albumin charge','It adds bicarbonate'],0,'Less free water concentrates strong ions, raising the SID.'],
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
['If a sealed blood sample is warmed, its PO₂ and PCO₂…',['Rise, because solubility falls','Fall, because solubility rises','Stay exactly constant','Cancel each other out'],0,'Gas solubility falls with temperature, so partial pressures rise.']];
XQ.alv=[
['On FiO₂ 1.0 at sea level with PaCO₂ 40, what is the alveolar PO₂?',['About 663 mmHg','About 713 mmHg','About 760 mmHg','About 600 mmHg'],0,'713 − 40 ÷ 0.8 = 663 mmHg.'],
['Which cause of hypoxaemia has a normal A–a gradient?',['Hypoventilation','Shunt','V/Q mismatch','Diffusion limitation'],0,'In pure hypoventilation PAO₂ falls with PaO₂, so the difference stays normal.'],
['A respiratory quotient of 0.8 means…',['CO₂ produced is 80% of O₂ consumed','O₂ consumed is 80% of CO₂ produced','80% of inspired O₂ is absorbed','Alveolar gas is 80% nitrogen'],0,'It is the ratio of CO₂ output to O₂ uptake, set by the fuel being burned.']];
XQ.temp=[
['A patient at 30 °C has a sample run at 37 °C. Their true in-body pH is…',['Higher than reported','Lower than reported','About the same','Impossible to estimate'],0,'Cooling raises pH by about 0.015 per °C, so the 37 °C value reads too acidic.'],
['Compared with the 37 °C report, a hypothermic patient\'s in-body PO₂ is…',['Lower','Higher','Identical','Zero'],0,'Gases are more soluble in cold blood, so partial pressures are lower.'],
['Why does PCO₂ fall as blood cools?',['CO₂ becomes more soluble','CO₂ production rises','Bicarbonate is consumed','The electrode drifts'],0,'More CO₂ stays dissolved, so the partial pressure is lower.']];
XQ.acidsrc=[
['Which of these is a volatile acid load?',['CO₂ from metabolism','Sulphuric acid from protein','Lactic acid','Phosphoric acid'],0,'CO₂ is excreted by the lungs; the others are fixed acids for the kidney.'],
['About how much fixed acid does a 70 kg adult generate each day?',['About 70 mmol','About 15,000 mmol','About 7 mmol','About 700 mmol'],0,'Roughly 1 mmol/kg/day.'],
['Put the responses in order of speed, fastest first.',['Buffers, lungs, kidneys','Kidneys, lungs, buffers','Lungs, kidneys, buffers','Buffers, kidneys, lungs'],0,'Buffering takes seconds, ventilation minutes, renal compensation days.']];
XQ.lactate=[
['Type A lactic acidosis is caused by…',['Poor tissue oxygen delivery','Adverse drug effects','Liver failure on its own','Very high glucose levels'],0,'Hypoperfusion or hypoxia pushes cells toward anaerobic glycolysis.'],
['Which organs clear most lactate?',['Liver and kidney','Lung and spleen','Brain and heart only','Skin and bone'],0,'The liver (Cori cycle) and kidney remove most of it.'],
['Thiamine deficiency can raise lactate because…',['Pyruvate dehydrogenase needs it','Thiamine itself buffers lactate','It lowers oxygen delivery','It blocks the liver\'s output'],0,'Without it pyruvate cannot enter the Krebs cycle and is converted to lactate.']];
XQ.ketones=[
['Which ketone body is most abundant in DKA?',['β-hydroxybutyrate','Acetoacetate','Acetone','Pyruvate and lactate'],0,'BHB outnumbers acetoacetate roughly three to one or more in DKA.'],
['Prolonged fasting typically causes…',['At most a mild fall in HCO₃⁻','A severe acidosis with pH < 7.0','A raised osmolar gap always','A respiratory acidosis'],0,'Starvation ketosis seldom lowers bicarbonate far because ketone production is modest.'],
['In alcoholic ketoacidosis the glucose is typically…',['Low or normal','Very high','Always above 20','Not measured'],0,'It follows binge drinking and poor intake, not insulin deficiency.']];
XQ.microbes=[
['D-lactic acidosis in short bowel syndrome arises when…',['Gut bacteria ferment spare sugar','The liver makes too much L-lactate','Insulin is lacking for the cells','The kidneys retain too much acid'],0,'Bacteria produce D-lactate, which standard assays miss.'],
['Which gas pattern is typical early in sepsis?',['Respiratory alkalosis','Respiratory acidosis','Metabolic alkalosis','A completely normal gas'],0,'Hyperventilation from the systemic inflammatory response comes first.'],
['How do you limit leukocyte larceny?',['Analyse at once, check against SpO₂','Leave it for an hour first','Add more heparin to the syringe','Shake the syringe hard'],0,'Cells keep consuming O₂ in the syringe, so speed and a saturation cross-check matter.']];
XQ.rbc=[
['Working muscle (high CO₂, low pH, warm) shifts the dissociation curve…',['Right','Left','Not at all','Upward only'],0,'The Bohr effect releases O₂ where it is needed.'],
['In the chloride shift, bicarbonate leaves the red cell in exchange for…',['Chloride','Sodium','Potassium','Protons'],0,'Band 3 swaps HCO₃⁻ out for Cl⁻ in to keep the cell electrically neutral.'],
['Chronic hypoxia raises 2,3-BPG, which shifts the curve…',['Right','Left','Not at all','Down'],0,'Lower O₂ affinity releases oxygen to tissues more easily.']];
XQ.toxalc=[
['Fomepizole works by…',['Blocking alcohol dehydrogenase','Binding oxalate in the gut','Raising the blood pH','Chelating iron in the blood'],0,'It stops methanol and ethylene glycol being turned into toxic metabolites.'],
['Ethylene glycol typically damages the…',['Kidney (calcium oxalate)','Optic nerve and retina','Liver cells alone','Pancreas and spleen'],0,'Oxalate crystals deposit in the tubules; look for crystals and AKI.'],
['Visual disturbance with a severe high-AG acidosis suggests…',['Methanol','Isopropanol','Ethanol','Salicylate'],0,'Formic acid injures the optic nerve.']];
