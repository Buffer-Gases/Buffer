/* ================= CONTENT: MODULES ================= */
const MODS=[
 {id:'start',t:'Start here',d:'How this app gets you from first principles to reading a gas at a glance.'},
 {id:'chem',t:'Chemistry of acids and buffers',d:'pH, buffers, carbonic anhydrase, Henderson–Hasselbalch and the Stewart view.'},
 {id:'phys',t:'Physics of gases',d:'Partial pressures, solubility, diffusion, the alveolar gas equation and temperature.'},
 {id:'micro',t:'Cells and microbes',d:'Where acid comes from: metabolism, lactate, ketones, gut bacteria, enzymes and the red cell.'},
 {id:'gas',t:'Oxygen, CO₂ and the lungs',d:'Content and delivery, the dissociation curve, hypoxaemia mechanisms, ventilation.'},
 {id:'kid',t:'Kidneys and compensation',d:'Bicarbonate handling, renal tubular acidosis, why alkalosis persists, the compensation rules.'},
 {id:'samp',t:'The sample and the machine',d:'Arterial, venous and capillary blood, pre-analytical traps, electrodes and co-oximetry.'},
 {id:'num',t:'Every number on the printout',d:'pH, PCO₂, PO₂, HCO₃⁻, base excess, lactate, electrolytes, co-oximetry and derived values.'},
 {id:'vbg',t:'VBG versus ABG',d:'What a venous gas can and cannot tell you, with the numbers behind it.'},
 {id:'dis',t:'Disorders and the systematic read',d:'The six-step read, each primary disorder, mixed disorders and the oxygenation read.'},
 {id:'clin',t:'Clinical correlations',d:'Real presentations with their gases: DKA, sepsis, toxins, COPD, asthma, heat, CO and more.'},
 {id:'auto',t:'Making it automatic',d:'The glance sequence, shortcuts and the drills that build instant recognition.'}
];
const tw=h=>'<div class="tw"><table class="tbl">'+h+'</table></div>';
const L=[];
function lesson(o){L.push(o);}

/* ---------- START ---------- */
lesson({id:'learn',m:'start',t:'How you will learn blood gases',
sum:'Understand the mechanism once, drill one fixed read until it is reliable, then make it fast. Every part of the app maps to a method with evidence behind it.',
body:`<p>Experts read a gas in seconds because two things run together: pattern recognition ("compensated metabolic acidosis") and a quick analytic check ("Winter's agrees"). Learners taught to combine both diagnose more accurately than those taught either alone. Buffer trains both.</p>
<h3>Where people actually go wrong</h3>
<p>An audit of junior doctors' blood gas reads (Aswan University Hospital, 2024) found most got the pH (83%) and the respiratory-versus-metabolic call (82%) right. They fell down on the <b>compensation</b> step (47% correct), linking the gap to the bicarbonate fall (64%), the anion gap (69%) and checking the gas is internally consistent (72%). A short structured teaching programme lifted compensation to 78%. So Buffer spends extra practice exactly there: the compensation gym, the Δ ratio step and the consistency check.</p>
<h3>The methods, and where they live in the app</h3>
${tw('<tr><th>Method</th><th>Why</th><th>In Buffer</th></tr><tr><td>One fixed sequence</td><td>Structured reads cut omissions; the audit improvements came from teaching a stepwise approach</td><td>Six-step read in every lesson, interpreter and step-by-step session</td></tr><tr><td>Worked examples that fade</td><td>Novices learn more from solved examples; as skill grows the same help slows experts down (expertise reversal)</td><td>Hints open automatically on steps you get wrong and stay closed on steps you have mastered</td></tr><tr><td>Retrieval practice</td><td>Recalling beats rereading for long-term memory</td><td>Every lesson ends in questions; practice always asks before it tells</td></tr><tr><td>Spacing</td><td>Reviews spread over days outlast cramming</td><td>Each pattern returns at 1, 3, 7, 16 and 35 days; today\'s session pulls in what is due</td></tr><tr><td>Interleaving and contrast</td><td>Mixing look-alike categories builds discrimination (Hatala 2003, ECG)</td><td>Sessions shuffle disorders; answer options are deliberately similar</td></tr><tr><td>Deliberate practice with immediate feedback</td><td>Accuracy climbs steadily with volume when each attempt is corrected at once</td><td>Every step is marked with its arithmetic before you move on</td></tr><tr><td>Prediction</td><td>Generating an answer before seeing it improves later learning</td><td>"Which gas fits?": read the patient, predict, then choose</td></tr><tr><td>Calibration</td><td>Clinicians are often more confident than accurate; low confidence also tracks errors</td><td>Rate your confidence; Today shows how often "sure" is right</td></tr><tr><td>Automaticity</td><td>Fluency frees attention for the patient</td><td>Reflex sessions: 90% correct, median under 8 s</td></tr><tr><td>Elaboration and connection</td><td>Linking each idea to its neighbours makes it retrievable from more cues</td><td>Concept web: tap any idea to see what it depends on and what it changes</td></tr><tr><td>Explaining (teach-back)</td><td>Generating an explanation exposes gaps that recognition hides</td><td>Teach it back: write it, then grade yourself against key points</td></tr><tr><td>Error reflection</td><td>Naming why you erred (misread, slip, rule, mix-up) targets the fix</td><td>One tap after a miss; Progress shows the pattern</td></tr>')}
<p>Self-explanation of mechanism helps mainly when cases share mechanisms, so each answer explains the physiology rather than asking you to write it out.</p>
<h3>A good week</h3>
<ul><li>Most days: the Round on Today (about 25 minutes: due gases, the concept of the day, compensation sums, estimates, step-by-step cases, one shift scenario and a teach-back).</li>
<li>Two or three times a week: a lesson, then a compensation gym or a reflex round.</li>
<li>Every real gas at work: read it yourself first, then check it in Interpret.</li></ul>`,
keys:[['Weakest step (2024 audit)','Compensation (≈ 47% correct)'],['Reflex target','90% correct, < 8 s'],['Review spacing','1 · 3 · 7 · 16 · 35 days']],
noflash:1,
hook:'Understand it slowly once, check every step for a while, then read it fast forever.',
q:[['Which practice schedule best builds the ability to tell two similar acid–base disorders apart?',['Blocked practice: all metabolic acidosis cases, then all alkalosis cases','Interleaved practice: disorders shuffled together','Rereading the summary tables until they feel familiar','Massed practice: one long session the night before'],1,'Interleaving forces a choice between categories every time, which is the skill a real gas demands.'],
['In a 2024 audit of junior doctors, which step of ABG interpretation was most often wrong?',['Acidaemia versus alkalaemia','Respiratory versus metabolic','Assessing compensation','Calculating the anion gap'],2,'Only about half (47%) assessed compensation correctly; the anion gap was a near miss at 69%. Compensation is also where hidden second disorders are found.'],
['Why do Buffer\'s hints disappear on steps you have mastered?',['Repeated hints are ignored, so they stop being read','Help that aids novices slows experts (expertise reversal)','Spaced review only works when all help is withheld','Harder retrieval always helps, so hints are removed'],1,'Support should fade as competence grows. Hiding hints from novices too would only make them guess.']]});

/* ---------- CHEMISTRY ---------- */
lesson({id:'ph',m:'chem',t:'Acids, bases and pH',w:['phh'],
sum:'pH is a logarithmic way of writing a tiny hydrogen ion concentration: 40 nanomoles per litre at pH 7.40.',
body:`<p>An <b>acid</b> donates a proton (H⁺); a <b>base</b> accepts one (Brønsted–Lowry). A <b>strong</b> acid dissociates completely in water; a <b>weak</b> acid only partly, which is what makes weak acids useful buffers.</p>
<p>pH = −log₁₀[H⁺], with [H⁺] in mol/L. Normal plasma [H⁺] is about <b>40 nmol/L</b> (0.00000004 mol/L), which is pH 7.40. That is about three and a half million times lower than plasma sodium, yet small changes in it alter protein charge, enzyme activity, ion channels and oxygen binding.</p>
<h3>Living with the log scale</h3>
<ul><li>A fall of 0.3 pH units doubles [H⁺]: 7.40 → 40, 7.10 → 80 nmol/L.</li>
<li>Because the scale is logarithmic, a drop from 7.10 to 7.00 adds 20 nmol/L of H⁺, while a drop from 7.40 to 7.30 adds only 10. The same 0.1 means more acid the sicker the patient.</li>
<li><b>The 80 rule:</b> between pH 7.20 and 7.50, [H⁺] ≈ 80 − the two digits after "7." So pH 7.25 → about 55 nmol/L (true value 56).</li></ul>
<p>The range compatible with life is roughly pH 6.8–7.8, that is 160 to 16 nmol/L.</p>`,
keys:[['pH 7.40','[H⁺] 40 nmol/L'],['Normal pH','7.35–7.45'],['−0.3 pH','[H⁺] doubles']],
hook:'"Eighty minus the decimals" gives [H⁺] in nmol/L between 7.20 and 7.50.',
q:[['Using the 80 rule, what is [H⁺] at pH 7.32?',['32 nmol/L','48 nmol/L','68 nmol/L','40 nmol/L'],1,'80 − 32 = 48 nmol/L (true value 47.9).'],
['pH falls from 7.40 to 7.10. What happens to [H⁺]?',['Rises by 30%','Doubles','Rises tenfold','Halves'],1,'0.3 pH units ≈ log₁₀2, so [H⁺] doubles from 40 to about 80 nmol/L.']]});

lesson({id:'buffer',m:'chem',t:'Buffers',
sum:'A buffer is a weak acid with its conjugate base. It soaks up added H⁺ or OH⁻ so pH changes far less than it otherwise would.',
body:`<p>For a weak acid HA ⇌ H⁺ + A⁻, added H⁺ combines with A⁻ to form HA, and added base removes H⁺ which HA then replaces. The pH moves, but much less than it would in water.</p>
<p>A buffer works best within about <b>±1 pH unit of its pKa</b>, the pH at which HA and A⁻ are equal. Buffer capacity also scales with concentration: more buffer, more acid absorbed.</p>
<h3>The puzzle of bicarbonate</h3>
<p>The bicarbonate system has a pKa of 6.1, more than a full unit below blood pH. (6.1 is the apparent pK of CO₂ ⇌ HCO₃⁻, with dissolved CO₂ standing in for carbonic acid. Carbonic acid itself is much stronger, pKa ≈ 3.5, but exists only in tiny amounts.) In a closed beaker it would be a poor buffer at 7.4. In the body it is the most important extracellular buffer because the system is <b>open</b>: the CO₂ formed when bicarbonate absorbs acid is breathed out, and the kidneys can make new bicarbonate. Both ends of the equation are under physiological control.</p>
<p>Without that open system, a load of 10 mmol/L of strong acid would produce a severe acidosis. With it, the lungs remove the extra CO₂ within minutes. Start from HCO₃⁻ 24 and PCO₂ 40 mmHg (5.3 kPa), so dissolved CO₂ is 1.2 mmol/L, and add 10 mmol/L of acid:</p>
<p>Bicarbonate falls to 14 either way. What differs is the CO₂:</p>
<ul><li><b>Closed beaker</b> (CO₂ trapped): dissolved CO₂ 1.2 + 10 = 11.2, so pH = 6.1 + log(14 ÷ 11.2) = <b>6.20</b>.</li>
<li><b>Open body</b> (PCO₂ held at 40): dissolved CO₂ stays 1.2, so pH = 6.1 + log(14 ÷ 1.2) = <b>7.17</b>.</li></ul>
<p>Same acid, same bicarbonate used up: breathing off the CO₂ is worth almost a whole pH unit. Hyperventilation then lowers PCO₂ further and brings the pH back towards normal.</p>`,
keys:[['Bicarbonate pKa','6.1'],['Best buffer range','pKa ± 1'],['Main extracellular buffer','HCO₃⁻ / CO₂']],
hook:'Bicarbonate is a mediocre buffer with two excellent managers: the lungs and the kidneys.',
q:[['Why is HCO₃⁻/CO₂ effective at pH 7.4 despite a pKa of 6.1?',['Carbonic anhydrase shifts its pKa up to 7.4','Open system: lungs remove CO₂, kidneys make new HCO₃⁻','It works mainly inside red cells, not plasma','Its pKa rises to 7.4 at body temperature'],1,'An open system lets both components be adjusted independently.'],
['Within what range of its pKa does a buffer work best?',['±0.1 pH units','±1 pH unit','±3 pH units','Only exactly at the pKa'],1,'Within about one unit either side, the acid and base forms are both present in useful amounts.']]});

lesson({id:'ca',m:'chem',t:'CO₂, carbonic acid and carbonic anhydrase',w:['rbc'],
sum:'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Carbonic anhydrase makes the first step thousands of times faster.',
body:`<p>Dissolved CO₂ reacts with water to form carbonic acid, which dissociates at once into H⁺ and HCO₃⁻. Uncatalysed, the hydration step takes seconds, too slow for blood that crosses a lung capillary in under a second. <b>Carbonic anhydrase (CA)</b>, a zinc enzyme and one of the fastest known, speeds it up enormously.</p>
<h3>Where CA works</h3>
<ul><li><b>Red cells:</b> CO₂ from tissues becomes HCO₃⁻ inside the cell; the H⁺ binds to haemoglobin.</li>
<li><b>Proximal tubule:</b> luminal CA allows filtered bicarbonate to be reclaimed (see the kidney module).</li>
<li><b>Gastric parietal cells and pancreas:</b> acid and bicarbonate secretion.</li>
<li><b>Lung capillary endothelium</b>, and many other sites.</li></ul>
<h3>Clinical link</h3>
<p><b>Acetazolamide</b> inhibits CA. Proximal bicarbonate reclaim fails, bicarbonate is lost in urine, and a <b>normal anion gap metabolic acidosis</b> results. That acidosis drives ventilation, which is why acetazolamide is used for altitude sickness and sometimes for metabolic alkalosis in ventilated patients.</p>
<p>Because CO₂ equilibrates so fast, PCO₂ behaves as the "acid" term in Henderson–Hasselbalch, even though carbonic acid itself exists only fleetingly.</p>`,
keys:[['Reaction','CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻'],['Enzyme','Carbonic anhydrase (zinc)'],['Inhibitor','Acetazolamide → NAGMA']],
hook:'CA = "CO₂ Accelerator".',
q:[['A trekker takes acetazolamide. Which gas pattern do you expect?',['High anion gap metabolic acidosis','Normal anion gap metabolic acidosis','Metabolic alkalosis','Acute respiratory acidosis'],1,'Blocked proximal bicarbonate reclaim → urinary HCO₃⁻ loss with chloride retained → hyperchloraemic (normal AG) acidosis.'],
['Inside the red cell, where does most of the H⁺ from CO₂ hydration go?',['Excreted across the membrane','Bound to haemoglobin','Bound to chloride','Converted back to water'],1,'Deoxygenated haemoglobin is a good buffer; its histidine groups take up the H⁺.']]});

lesson({id:'hh',m:'chem',t:'Henderson–Hasselbalch',w:['hh'],
sum:'pH = 6.1 + log(HCO₃⁻ / 0.03 × PCO₂). Normal ratio 20:1. pH depends on the ratio, not either value alone.',
body:`<p>From the dissociation of carbonic acid, and replacing carbonic acid with dissolved CO₂ (solubility 0.03 mmol/L per mmHg, or 0.23 per kPa):</p>
<div class="eq">pH = 6.1 + log₁₀ ( [HCO₃⁻] ÷ (0.03 × PCO₂) )</div>
<p>Normal: 24 ÷ (0.03 × 40) = 24 ÷ 1.2 = <b>20</b>. log 20 = 1.3, and 6.1 + 1.3 = 7.4.</p>
<h3>What this means at the bedside</h3>
<ul><li>pH is set by the <b>ratio</b> of the metabolic term (HCO₃⁻, kidney) to the respiratory term (PCO₂, lungs).</li>
<li>Compensation is the other organ moving its term in the <b>same direction</b> to restore the ratio. Low HCO₃⁻ → PCO₂ falls. High PCO₂ → HCO₃⁻ rises.</li>
<li>If the two move in opposite directions, compensation cannot explain it: there are two disorders.</li></ul>
<h3>The Henderson form, for checking a gas</h3>
<div class="eq">[H⁺] (nmol/L) = 24 × PCO₂ (mmHg) ÷ [HCO₃⁻]</div>
<p>Most analysers calculate HCO₃⁻ from pH and PCO₂, so a printed gas almost always "fits". If values were transcribed from different samples, or HCO₃⁻ came from a separate lab total CO₂, this equation exposes the mismatch. Compare the result with [H⁺] from the 80 rule.</p>
<p><b>The worked gas</b> beside this lesson does not fit: 24 × 60 ÷ 24 = 60 nmol/L, which is pH ≈ 7.22, but the printout says 7.40 (40 nmol/L). Open it in the Interpreter and watch step 1 refuse to trust anything that follows.</p>`,
ex:{pH:7.40,pco2:60,hco3:24,po2:70,fio2:0.21,age:40},
keys:[['Normal ratio','HCO₃⁻ : 0.03·PCO₂ = 20 : 1'],['CO₂ solubility','0.03 mmol/L/mmHg (0.23/kPa)'],['Henderson','[H⁺] = 24 × PCO₂ / HCO₃⁻']],
hook:'Kidneys on top, lungs on the bottom: pH is the fraction.',
q:[['PCO₂ 20 mmHg, HCO₃⁻ 12 mmol/L. What is the pH?',['7.10','7.40','7.25','7.55'],1,'12 ÷ (0.03 × 20) = 20, the normal ratio, so pH 7.40. But a normal pH with both values far from normal is never compensation alone. Winter\'s predicts a PCO₂ of 1.5 × 12 + 8 = 26 ± 2, so 20 means a second disorder: metabolic acidosis plus respiratory alkalosis (think salicylate or sepsis).'],
['A gas reads pH 7.40, PCO₂ 60, HCO₃⁻ 24. What do you conclude?',['Chronic respiratory acidosis, fully compensated','The values cannot all be from one sample','Mixed respiratory and metabolic disorder','A normal gas; the PCO₂ is within error'],1,'Henderson: 24 × 60 ÷ 24 = 60 nmol/L, i.e. pH ≈ 7.22, not 7.40. The numbers are internally inconsistent.']]});

lesson({id:'otherbuf',m:'chem',t:'The other buffers',
sum:'Haemoglobin, plasma proteins, phosphate, bone and intracellular buffers share the load. All buffer pairs move together.',
body:`<p>Every buffer in a compartment is in equilibrium with the same [H⁺] (the <b>isohydric principle</b>), so measuring one pair, bicarbonate/CO₂, tells you the state of all of them.</p>
${tw('<tr><th>Buffer</th><th>Where</th><th>Notes</th></tr><tr><td>Bicarbonate/CO₂</td><td>ECF</td><td>Largest; open system</td></tr><tr><td>Haemoglobin</td><td>Red cells</td><td>Histidine imidazole groups, pKa near 7; deoxy-Hb buffers better</td></tr><tr><td>Plasma proteins (albumin)</td><td>Plasma</td><td>Weak acids; low albumin removes buffer and lowers the anion gap</td></tr><tr><td>Phosphate</td><td>Cells, urine</td><td>pKa 6.8; titratable acid in urine</td></tr><tr><td>Ammonia/ammonium</td><td>Urine</td><td>Main route for excreting fixed acid. Not a true buffer at urine pH (pKa 9.2): it carries H⁺ out as NH₄⁺</td></tr><tr><td>Bone carbonate</td><td>Skeleton</td><td>Chronic acidosis dissolves bone (CKD, RTA)</td></tr>')}
<h3>Intracellular buffering and potassium</h3>
<p>About half of an acute acid load is buffered inside cells. As H⁺ enters cells in exchange, potassium can leave, raising plasma K⁺. This is marked in mineral (hyperchloraemic) acidosis and much smaller in lactic or ketoacidosis, where the organic anion enters cells with H⁺. The old rule of "K⁺ rises 0.6 per 0.1 fall in pH" is unreliable; treat it as a direction, not a number.</p>`,
keys:[['Isohydric principle','All buffer pairs share one [H⁺]'],['Hb buffer group','Histidine imidazole'],['Phosphate pKa','6.8']],
hook:'One [H⁺] for all buffers: read one, know all.',
q:[['Why does deoxygenated blood carry more CO₂?',['Venous blood is colder than arterial blood','Deoxy-Hb binds more H⁺ and more carbamino CO₂','Venous blood has more carbonic anhydrase','Plasma bicarbonate is lower in venous blood'],1,'This is the Haldane effect, a property of haemoglobin chemistry.'],
['Which acidosis raises plasma potassium most through shifts?',['Lactic acidosis in septic shock','Ketoacidosis from starvation','Hyperchloraemic (mineral) acidosis','Acute respiratory acidosis from opioids'],2,'With an inorganic anion like chloride that stays outside cells, H⁺ entry is balanced by K⁺ exit.']]});

lesson({id:'stewart',m:'chem',t:'The Stewart (physicochemical) view',
sum:'pH is set by three independent variables: PCO₂, the strong ion difference and total weak acid (mostly albumin). HCO₃⁻ is a result, not a cause.',
body:`<p>Peter Stewart argued that HCO₃⁻ and H⁺ are dependent variables. Three things are independent:</p>
<ul><li><b>PCO₂</b>, set by ventilation.</li>
<li><b>Strong ion difference (SID)</b>: fully dissociated cations minus anions, roughly Na⁺ + K⁺ + 2×Ca²⁺ + 2×Mg²⁺ − Cl⁻ − lactate (in mmol/L, using ionised Ca and Mg; the 2× turns mmol into mEq for these divalent ions). Normal apparent SID is about 40 mmol/L. A lower SID means acidosis.</li>
<li><b>A<sub>tot</sub></b>: total weak acid, mostly albumin and phosphate. Less albumin means alkalosis.</li></ul>
<h3>Where it helps at the bedside</h3>
<ul><li><b>Saline acidosis:</b> 0.9% saline has an SID of zero (154 Na, 154 Cl). Large volumes lower plasma SID and cause hyperchloraemic acidosis. Balanced crystalloids have an SID closer to plasma.</li>
<li><b>Hypoalbuminaemia</b> in critical illness causes a hidden metabolic alkalosis and lowers the anion gap, which can mask a lactic acidosis. Correct the anion gap for albumin.</li>
<li><b>Na⁺ and Cl⁻ separately:</b> a falling Na:Cl ratio points to chloride-driven acidosis.</li></ul>
<p>The bicarbonate (Boston) approach with an albumin-corrected anion gap, and the base-excess (Copenhagen) approach, give the same answers as Stewart in almost every patient. Use them for speed; use Stewart to understand fluids and albumin.</p>
<p><b>The worked gas</b> is a 58-year-old after 6 L of 0.9% saline: chloride 118, a normal gap of about 8, and a hyperchloraemic acidosis with appropriate compensation.</p>`,
ex:{pH:7.31,pco2:33,po2:96,fio2:0.21,na:142,cl:118,alb:40,lac:1.2,age:58},
keys:[['Independent variables','PCO₂ · SID · A_tot'],['Normal apparent SID','≈ 40 mmol/L'],['SID of 0.9% saline','0']],
hook:'Chloride up or albumin down: Stewart explains what the bicarbonate alone hides.',
q:[['A patient receives 6 L of 0.9% saline. What is the most likely new acid–base problem?',['High anion gap metabolic acidosis (lactic)','Hyperchloraemic (normal AG) metabolic acidosis','Metabolic alkalosis from the sodium load','Respiratory acidosis from fluid overload'],1,'Saline has an SID of zero; it dilutes plasma SID down, causing hyperchloraemic acidosis.'],
['Albumin falls from 40 to 20 g/L. In the Stewart model this causes…',['Metabolic acidosis','Metabolic alkalosis','Respiratory alkalosis','No change'],1,'Albumin is a weak acid; losing it is alkalinising, and it lowers the anion gap by about 5 mmol/L.']]});

/* ---------- PHYSICS ---------- */
lesson({id:'dalton',m:'phys',t:'Partial pressure and Dalton\'s law',
sum:'Each gas in a mixture exerts its share of the total pressure. Inspired PO₂ = FiO₂ × (barometric pressure − 47).',
body:`<p>Dalton's law: total pressure equals the sum of the partial pressures. Air is 20.9% oxygen, so at sea level (760 mmHg, 101.3 kPa) dry air has a PO₂ of about 159 mmHg (21.2 kPa).</p>
<p>In the airways, inspired gas is fully humidified at 37 °C. Water vapour takes 47 mmHg (6.3 kPa) regardless of altitude, so:</p>
<div class="eq">PiO₂ = FiO₂ × (P<sub>atm</sub> − 47)</div>
<ul><li>Sea level: 0.21 × 713 ≈ <b>150 mmHg (20.0 kPa)</b>.</li>
<li><b>Riyadh</b> (about 610 m): P<sub>atm</sub> ≈ 707 mmHg (94.3 kPa), so PiO₂ ≈ 139 mmHg (18.5 kPa). Normal PaO₂ in a healthy adult in Riyadh is several mmHg lower than textbook sea-level values.</li>
<li><b>Abha</b> (about 2,270 m): P<sub>atm</sub> ≈ 580 mmHg (77.3 kPa), PiO₂ ≈ 112 mmHg (14.9 kPa).</li>
<li>Aircraft cabin (pressurised to about 2,400 m): similar to Abha. Patients with borderline PaO₂ desaturate in flight.</li></ul>
<h3>Units</h3>
<p>1 kPa = 7.5 mmHg. Normal PaCO₂ 35–45 mmHg = 4.7–6.0 kPa. Normal PaO₂ 80–100 mmHg = 10.7–13.3 kPa.</p>
<p>If you work at altitude, choose your site under Settings → Altitude so the Interpreter's A–a gradient uses your site, not sea level.</p>`,
keys:[['Water vapour at 37 °C','47 mmHg (6.3 kPa)'],['PiO₂ sea level','≈ 150 mmHg (20 kPa)'],['PiO₂ Riyadh','≈ 139 mmHg (18.5 kPa)'],['1 kPa','7.5 mmHg']],
hook:'Subtract the water first, then take the oxygen share.',
q:[['What is the inspired PO₂ on 40% oxygen at sea level?',['304 mmHg','285 mmHg','150 mmHg','400 mmHg'],1,'0.40 × (760 − 47) = 285 mmHg.'],
['Why does PiO₂ fall at altitude when FiO₂ is still 0.21?',['Oxygen fraction falls','Barometric pressure falls','Water vapour pressure rises','CO₂ rises'],1,'The fraction is constant; total pressure drops, so each partial pressure drops.']]});

lesson({id:'henry',m:'phys',t:'Solubility and Henry\'s law',
sum:'Dissolved gas is proportional to partial pressure. Oxygen is poorly soluble, so almost all of it rides on haemoglobin. CO₂ is about 20 times more soluble.',
body:`<p>Henry's law: the amount of gas dissolved in a liquid is proportional to its partial pressure above it. The constant depends on the gas.</p>
${tw('<tr><th>Gas</th><th>Dissolved per mmHg</th><th>At normal arterial pressure</th></tr><tr><td>O₂</td><td>0.003 mL/dL</td><td>PaO₂ 100 mmHg (13.3 kPa) → 0.3 mL/dL (of about 20 mL/dL total)</td></tr><tr><td>CO₂</td><td>0.03 mmol/L (≈ 0.07 mL/dL); 0.23 mmol/L per kPa</td><td>PaCO₂ 40 mmHg (5.3 kPa) → 1.2 mmol/L dissolved</td></tr>')}
<h3>Why it matters</h3>
<ul><li><b>PaO₂ is not oxygen content.</b> PaO₂ measures only the dissolved fraction, which sets how much haemoglobin loads, but anaemia or carbon monoxide can halve content with a normal PaO₂.</li>
<li><b>CO₂ diffuses easily</b> because of its high solubility, so diffusion problems cause hypoxaemia long before they cause hypercapnia. Even for oxygen, diffusion limitation alone rarely causes hypoxaemia at rest; it shows on exercise or at altitude, when capillary transit time shortens or the driving pressure falls.</li>
<li><b>Hyperbaric oxygen</b> works by Henry's law: at 3 atmospheres on 100% O₂, dissolved O₂ (about 6 mL/dL) can meet resting needs without haemoglobin.</li></ul>`,
keys:[['O₂ solubility','0.003 mL/dL/mmHg'],['CO₂ vs O₂ solubility','≈ 20×'],['Dissolved O₂ at PaO₂ 100','0.3 mL/dL']],
hook:'PaO₂ is the pressure driving the loading; content is what the truck carries.',
q:[['Why does a diffusion barrier cause hypoxaemia without hypercapnia?',['CO₂ is produced in smaller amounts','CO₂ is far more soluble and diffuses about 20× faster','CO₂ is carried by haemoglobin','Hypoxaemia drives ventilation which raises CO₂'],1,'High solubility makes CO₂ transfer robust; and the hypoxic drive often lowers CO₂.'],
['A patient has PaO₂ 98 mmHg and Hb 6 g/dL. Their oxygen content is…',['Normal, because PaO₂ is normal','Less than half of normal','Raised','Unknown without PaCO₂'],1,'Content depends mainly on haemoglobin: 1.34 × 6 × 0.98 ≈ 7.9 + 0.3 ≈ 8.2 mL/dL, versus ≈ 20 normally (about 41%).']]});

lesson({id:'alv',m:'phys',t:'Diffusion and the alveolar gas equation',w:['alv'],
sum:'PAO₂ = FiO₂ × (P_atm − 47) − PaCO₂ / 0.8. The gap between alveolar and arterial O₂ (A–a gradient) tells you whether the lung itself is at fault.',
body:`<p>Gas crosses the alveolar membrane by diffusion (Fick's law): rate ∝ area × pressure difference × solubility ÷ thickness. Normally blood equilibrates within the first third of its 0.75-second capillary transit, which leaves reserve for exercise.</p>
<h3>Alveolar gas equation</h3>
<div class="eq">PAO₂ = FiO₂ × (P<sub>atm</sub> − 47) − PaCO₂ ÷ RQ</div>
<p>RQ (respiratory quotient) is about 0.8. Each mmHg of CO₂ in the alveolus displaces oxygen, so a rise in PaCO₂ must lower PAO₂: this is how hypoventilation causes hypoxaemia.</p>
<p>Room air at sea level, PaCO₂ 40 mmHg (5.3 kPa): PAO₂ = 150 − 50 = <b>100 mmHg (13.3 kPa)</b>. In kPa: PAO₂ = FiO₂ × (P<sub>atm</sub> − 6.3) − PaCO₂ ÷ 0.8, so 0.21 × 95 − 5.3/0.8 ≈ 13.3 kPa.</p>
<h3>A–a gradient</h3>
<p>A–a = PAO₂ − PaO₂. Normal on room air ≈ <b>age/4 + 4</b> mmHg (under 10 in the young, about 20–25 at 70–80; in kPa, roughly divide by 7.5). It widens on higher FiO₂, so interpret it on room air where possible.</p>
<p><b>The worked gas</b> is a 30-year-old after an opioid overdose, on room air: PaCO₂ 80 mmHg (10.7 kPa), PaO₂ 48 mmHg (6.4 kPa). PAO₂ = 150 − 100 = 50, so the A–a gradient is only 2. The lungs are fine; the brain stopped breathing.</p>
<ul><li><b>Normal A–a + hypoxaemia</b> → hypoventilation or low inspired O₂ (the lung is fine).</li>
<li><b>Raised A–a</b> → V/Q mismatch, shunt or diffusion limitation (the lung is the problem). At rest, diffusion limitation alone rarely causes hypoxaemia.</li></ul>`,
ex:{pH:7.17,pco2:80,hco3:28,po2:48,fio2:0.21,age:30},
keys:[['PAO₂','FiO₂(P_atm − 47) − PaCO₂/0.8'],['Normal A–a (room air)','≈ age/4 + 4 mmHg'],['RQ','0.8']],
hook:'Hypoxic with a normal A–a? Look at the brain, the muscles or the altitude, not the lungs.',
q:[['Room air, sea level. PaCO₂ 80, PaO₂ 48, age 30. What is the A–a gradient and what does it mean?',['52; lung disease','2; pure hypoventilation','12; mild V/Q mismatch','Cannot be calculated'],1,'PAO₂ = 150 − 80/0.8 = 50. A–a = 50 − 48 = 2. Hypoxaemia is fully explained by hypoventilation (e.g. opioid overdose).'],
['A 60-year-old on room air: PaCO₂ 30, PaO₂ 60. A–a?',['≈ 52, raised','≈ 22, normal','≈ 90','≈ 0'],0,'PAO₂ = 150 − 37.5 = 112.5. A–a = 52, well above the expected ≈ 19. Think PE, pneumonia, oedema.']]});

lesson({id:'temp',m:'phys',t:'Temperature and the analyser',
sum:'Analysers measure at 37 °C. In fever or hypothermia the patient\'s true gases differ; most clinicians interpret the 37 °C values (alpha-stat).',
body:`<p>Gas solubility rises as blood cools, so at lower temperature the same blood has lower PO₂ and PCO₂, and a higher pH. The analyser warms the sample to 37 °C and reports values at that temperature unless you enter the patient's temperature.</p>
<ul><li>Per °C, PO₂ changes about 5–7%, PCO₂ about 4.5%, and pH about 0.015 (in the opposite direction).</li>
<li><b>Alpha-stat</b>: interpret values uncorrected, at 37 °C. This keeps intracellular protein charge (the "alpha" of histidine) constant and is the usual approach in adults, including after cardiac arrest and in hypothermia.</li>
<li><b>pH-stat</b>: correct to the patient's temperature and aim for normal corrected values, which means adding CO₂ during hypothermia. Used in some paediatric cardiac surgery.</li></ul>
<h3>Practical points</h3>
<ul><li>In <b>hypothermia</b>, the uncorrected PaO₂ overestimates the patient's true PaO₂. Do not be falsely reassured in a cold patient on low oxygen.</li>
<li>In <b>heat stroke</b> at 41–42 °C, the true PaO₂ and PaCO₂ are higher than printed. Interpret the 37 °C values and treat the patient; cooling comes first.</li></ul>`,
keys:[['Analyser temperature','37 °C'],['Usual interpretation','Alpha-stat (uncorrected)'],['pH change per °C','≈ 0.015']],
hook:'Cold blood holds more gas: pressures fall and pH rises as the patient cools.',
q:[['A hypothermic patient at 32 °C. Compared with the analyser\'s 37 °C report, the true in-body PaCO₂ is…',['Higher','Lower','The same','Unpredictable'],1,'Cold blood dissolves more CO₂, so its partial pressure is lower.'],
['Which strategy do most adult intensive care units use for blood gas interpretation?',['pH-stat','Alpha-stat','Temperature-corrected for all values','Corrected only when the patient is cold'],1,'Alpha-stat: interpret the analyser\'s 37 °C values.']]});

/* ---------- MICRO ---------- */
lesson({id:'acidsrc',m:'micro',t:'Where the acid comes from',
sum:'Metabolism makes about 15,000 mmol of CO₂ a day (volatile acid, removed by the lungs) and about 1 mmol/kg of fixed acid (removed by the kidneys).',
body:`<p>Every cell's mitochondria burn fuel through the citric acid (Krebs) cycle and release CO₂. Dissolved in water, that CO₂ is an acid. Because it leaves through the lungs, it is called <b>volatile acid</b>: roughly 15,000 mmol per day, which ventilation clears minute by minute.</p>
<p><b>Fixed (non-volatile) acid</b> cannot be breathed out:</p>
<ul><li>Sulfuric acid from sulfur-containing amino acids (methionine, cysteine) in dietary protein.</li>
<li>Phosphoric acid from phospholipids and phosphoproteins.</li>
<li>Incompletely oxidised organic acids: small amounts of lactate and ketoacids even in health.</li></ul>
<p>Adults produce about <b>50–100 mmol of fixed acid per day</b>. Diet sets the figure: fruit and vegetables supply organic anions (citrate, malate) that are burnt to bicarbonate and offset part of the protein acid load, which is why a plant-rich diet is advised in chronic kidney disease. Each mmol of fixed acid consumes one HCO₃⁻.</p>
<p>The kidney has two jobs: reclaim nearly all of the ≈ 4,300 mmol of bicarbonate filtered each day (180 L × 24 mmol/L, mostly in the proximal tubule), and make new bicarbonate to replace what fixed acid used up (by excreting ammonium and titratable acid).</p>
<h3>The three clocks</h3>
<p>Chemical buffers (bicarbonate, haemoglobin, proteins, bone) act in <b>seconds</b>. Lungs adjust volatile acid in <b>minutes</b>. Kidneys adjust fixed acid over <b>3–5 days</b>. This difference is the basis for "acute" and "chronic" respiratory disorders.</p>`,
keys:[['Volatile acid (CO₂)','≈ 15,000 mmol/day'],['Fixed acid','≈ 1 mmol/kg/day (diet-dependent)'],['Filtered HCO₃⁻','≈ 4,300 mmol/day, nearly all reclaimed'],['Buffers · lungs · kidneys','seconds · minutes · 3–5 days']],
hook:'Lungs breathe off the big daily acid load; kidneys handle the small one that matters for days.',
q:[['Which acid source does the kidney, not the lung, have to excrete?',['CO₂ from the citric acid cycle','Sulfuric acid from methionine','Carbonic acid','Dissolved CO₂ in venous blood'],1,'Sulfuric and phosphoric acids are fixed; each consumes bicarbonate that the kidney must regenerate.'],
['Why does renal compensation take days?',['Glomerular filtration of acid has to rise first','Making new HCO₃⁻ needs ammoniagenesis, which ramps up slowly','Aldosterone release is delayed until volume falls','Bone buffers must be used up before the kidney acts'],1,'Upregulation of glutamine metabolism and transporters takes about 3–5 days to peak.']]});

lesson({id:'lactate',m:'micro',t:'Lactate: the cellular story',
sum:'Pyruvate becomes lactate when it is made faster than mitochondria can use it. Lactate is a marker of stress and hypoperfusion, not always of oxygen lack.',
body:`<p>Glycolysis turns glucose into pyruvate and NADH. Normally pyruvate enters mitochondria. When mitochondria cannot keep up, LDH converts pyruvate to lactate to regenerate NAD⁺ so glycolysis can continue. The H⁺ comes mainly from ATP hydrolysis in the same circumstances, so lactate rises together with acidosis.</p>
<p>The liver (and kidney) clear lactate, about 1,500 mmol/day, mostly back to glucose (the Cori cycle). Liver failure slows clearance.</p>
<h3>Types</h3>
${tw('<tr><th>Type</th><th>Mechanism</th><th>Examples</th></tr><tr><td>A</td><td>Tissue hypoperfusion or hypoxia</td><td>Shock (septic, cardiogenic, haemorrhagic), cardiac arrest, severe hypoxaemia, severe anaemia, carbon monoxide, mesenteric ischaemia, seizures</td></tr><tr><td>B1</td><td>Underlying disease</td><td>Liver failure, malignancy (Warburg effect), thiamine deficiency, DKA</td></tr><tr><td>B2</td><td>Drugs and toxins</td><td>Metformin, salbutamol and adrenaline (β₂), linezolid, propofol, toxic alcohols, cyanide, NRTIs</td></tr><tr><td>B3</td><td>Inborn errors</td><td>Mitochondrial disorders</td></tr>')}
<p>Some toxins straddle A and B. Carbon monoxide is listed under A because it cuts oxygen carriage, but it also poisons cytochrome oxidase. Cyanide is listed under B2: delivery is normal, yet the cells cannot use the oxygen (venous blood stays red).</p>
<h3>Sepsis</h3>
<p>Much of the lactate in sepsis comes from adrenaline-driven aerobic glycolysis in muscle (β₂ stimulation), not only from hypoxia. Lactate still tracks risk: in septic shock definitions it is above 2 mmol/L despite fluids, with vasopressors needed. A falling lactate with treatment is reassuring.</p>
<p>D-lactate (bacterial) is not measured by the standard L-lactate assay. See <a href="#l-microbes">Microbes, the gut and the syringe</a> later in this module.</p>`,
keys:[['Normal lactate','< 2 mmol/L'],['High','> 4 mmol/L'],['Daily clearance','≈ 1,500 mmol (liver, kidney)']],
hook:'Lactate means "glycolysis is outrunning the mitochondria", for whatever reason.',
q:[['A patient with acute asthma on nebulised salbutamol has lactate 5.1 mmol/L and good perfusion. Most likely cause?',['Type A from hypoperfusion','β₂-agonist (type B2) lactate','D-lactic acidosis from the gut','Lab error from a delayed sample'],1,'β₂ stimulation drives aerobic glycolysis. Still look for hypoperfusion, but salbutamol is a common cause.'],
['Which lactate type is metformin toxicity?',['Type A','Type B1','Type B2','Type B3'],2,'Drug-induced, type B2. It is most likely when renal failure or another stressor coexists.',{fixed:1}]]});

lesson({id:'ketones',m:'micro',t:'Ketones and ketoacidosis',
sum:'Without insulin, fat becomes acetoacetate and β-hydroxybutyrate. Measure β-hydroxybutyrate in blood; urine strips miss it.',
body:`<p>Low insulin with high glucagon releases fatty acids from fat. The liver's mitochondria oxidise them to acetyl-CoA, which piles up as <b>acetoacetate</b> and <b>β-hydroxybutyrate (BHB)</b>, both strong enough acids to dissociate fully at body pH. Acetone, a breakdown product of acetoacetate, gives the fruity breath.</p>
<ul><li>In DKA, BHB:acetoacetate rises to about 3–10:1 because of the high NADH state.</li>
<li>Urine nitroprusside strips detect acetoacetate (and a little acetone), not BHB. They can read falsely low early, and may seem to worsen during treatment as BHB converts back to acetoacetate. Use blood BHB.</li></ul>
<h3>Four kinds of ketoacidosis</h3>
<ul><li><b>Diabetic</b>: insulin deficiency; glucose usually high.</li>
<li><b>Euglycaemic DKA</b>: SGLT2 inhibitors, pregnancy, starvation or low-carbohydrate diets; glucose may be under 14 mmol/L (250 mg/dL). Check ketones in any unwell patient on an SGLT2 inhibitor.</li>
<li><b>Alcoholic</b>: binge drinking then vomiting and not eating; glucose low or normal; often mixed with metabolic alkalosis from vomiting.</li>
<li><b>Starvation</b>: mild, HCO₃⁻ rarely below 18.</li></ul>
<p>Ketoanions are filtered and lost in urine with sodium, so the anion gap can fall before the bicarbonate recovers, leaving a hyperchloraemic acidosis (more in the clinical module).</p>
<p><b>The worked gas</b> is euglycaemic DKA: a 45-year-old on empagliflozin, vomiting for two days, glucose only 11 mmol/L (198 mg/dL), blood BHB 5.2 mmol/L. The gap is 28 with a normal lactate, compensation is exactly what Winter's predicts, and the Δ ratio is 1.0.</p>`,
ex:{pH:7.21,pco2:20,po2:114,fio2:0.21,na:136,k:5.1,cl:100,alb:40,lac:1.4,glu:11,age:45},
keys:[['Blood BHB in DKA','≥ 3.0 mmol/L'],['Ketosis resolved','BHB < 0.6 mmol/L'],['Urine strip misses','β-hydroxybutyrate (reads acetoacetate, a little acetone)']],
hook:'Strips smell acetoacetate; the patient is drowning in β-hydroxybutyrate.',
q:[['A patient on empagliflozin has vomiting, glucose 11 mmol/L, pH 7.18, HCO₃⁻ 9. Most likely?',['Lactic acidosis from dehydration','Euglycaemic DKA','Alcoholic ketoacidosis','Normal anion gap acidosis'],1,'SGLT2 inhibitors cause DKA with only modestly raised glucose. Check blood ketones.'],
['Why can urine ketones appear to rise during successful DKA treatment?',['Treatment is failing and ketone production is rising','BHB is converted to acetoacetate, which the strip detects','Insulin drives the liver to make more acetoacetate','Falling renal function concentrates ketones in urine'],1,'The strip only sees acetoacetate. Follow blood BHB and the gas instead.']]});

lesson({id:'microbes',m:'micro',t:'Microbes, the gut and the syringe',
sum:'Bacteria cause acid–base problems through sepsis, gut fermentation (D-lactate), diarrhoea, and even by living cells in a delayed sample.',
body:`<h3>Sepsis</h3>
<p>Early sepsis drives ventilation (cytokines, fever, endotoxin acting on the respiratory centre), so <b>respiratory alkalosis</b> is often the first gas sign. Later, hypoperfusion and adrenaline-driven glycolysis add a <b>lactic acidosis</b>. A low PaCO₂ with a falling bicarbonate in a febrile patient is sepsis until proven otherwise.</p>
<h3>D-lactic acidosis</h3>
<p>In <b>short bowel syndrome</b> or after jejunoileal bypass, unabsorbed carbohydrate reaches the colon, where bacteria such as <i>Lactobacillus</i> ferment it to D-lactate. Humans metabolise D-lactate slowly. Patients have episodes of confusion, slurred speech and ataxia after carbohydrate meals, with a <b>high anion gap acidosis and a normal routine lactate</b>, because the standard assay measures L-lactate only. The gap may be only mildly raised, or even normal, because the kidney excretes D-lactate quickly; a normal gap does not exclude it. Ask the lab for D-lactate. Treatment: reduce simple carbohydrate, give oral antibiotics, correct the acidosis.</p>
<h3>Infectious diarrhoea</h3>
<p>Stool is rich in bicarbonate. Cholera, rotavirus and other secretory diarrhoeas cause a <b>normal anion gap acidosis</b>; with severe dehydration, lactic acidosis and pre-renal AKI add a high anion gap component.</p>
<h3>Urease and urinary diversion</h3>
<p>Urease-producing organisms (<i>Proteus</i>, <i>Klebsiella</i>) split urea into ammonia: they alkalinise urine and cause struvite stones, and in patients with liver failure or urinary diversions they can raise blood ammonia. Ureterosigmoidostomy itself causes a NAGMA through chloride–bicarbonate exchange by colonic mucosa.</p>
<h3>Living cells in the syringe</h3>
<p>White cells and platelets keep consuming oxygen after the sample is drawn. With very high counts (leukaemia, WBC above about 100 × 10⁹/L, or extreme thrombocytosis) PaO₂ falls in minutes while SpO₂ stays normal: <b>pseudohypoxaemia</b> or "leukocyte larceny". Analyse immediately, on ice if needed, and trust the oximeter.</p>
<p><b>The worked gas</b> is D-lactic acidosis: a 52-year-old with short bowel syndrome, confused and ataxic after a sugary drink. The gap is about 24 with a routine lactate of 1.1, so lactate does not explain it. Glucose and ketones are normal too: send a D-lactate.</p>`,
ex:{pH:7.26,pco2:25,po2:104,fio2:0.21,na:138,k:3.6,cl:103,alb:38,lac:1.1,glu:6.2,age:52},
keys:[['Early sepsis gas','Respiratory alkalosis'],['D-lactate','Missed by routine lactate assay'],['Leukocyte larceny','WBC > ~100 × 10⁹/L']],
hook:'Normal lactate, high gap, short bowel and confusion: think bacteria making D-lactate.',
q:[['A man with short bowel syndrome is confused after a sugary drink. pH 7.26, AG 24, routine lactate 1.1. Next test?',['Repeat routine lactate','D-lactate','Serum osmolality only','CT head first'],1,'Standard assays measure L-lactate. D-lactate from colonic bacterial fermentation explains the unexplained anion gap.'],
['A patient with CML (WBC 280 × 10⁹/L) looks well with SpO₂ 98%. An arterial sample (pulsatile flash, PaCO₂ 38) sat 20 minutes at room temperature and reads PaO₂ 48 mmHg (6.4 kPa). Explanation?',['Pulmonary embolism','Leukocyte larceny','Methaemoglobinaemia','Intrapulmonary shunt'],1,'White cells consume oxygen in the syringe. A repeat analysed at once on ice reads normal. Rely on pulse oximetry. Methaemoglobinaemia does the opposite: low SpO₂ (about 85%) with a normal PaO₂.']]});

lesson({id:'rbc',m:'micro',t:'Inside the red cell: Bohr, Haldane and the chloride shift',w:['rbc','odc'],
sum:'In tissues, CO₂ enters the red cell, becomes HCO₃⁻, swaps with Cl⁻, and its H⁺ helps unload O₂. In the lung, everything reverses.',
body:`<h3>In the tissues</h3>
<ol class="steps"><li>CO₂ diffuses into the red cell.</li>
<li>Carbonic anhydrase converts it to H⁺ and HCO₃⁻.</li>
<li>HCO₃⁻ leaves through band 3 in exchange for Cl⁻: the <b>chloride (Hamburger) shift</b>. This is why venous red cells contain more chloride and are slightly larger.</li>
<li>H⁺ binds haemoglobin, which lowers its oxygen affinity and releases O₂: the <b>Bohr effect</b>.</li>
<li>Some CO₂ binds directly to haemoglobin's amino groups as <b>carbamino-Hb</b>.</li></ol>
<h3>In the lung</h3>
<p>Oxygen binds haemoglobin, which releases H⁺ and carbamino CO₂: the <b>Haldane effect</b>. H⁺ recombines with HCO₃⁻ (re-entering in exchange for Cl⁻) to form CO₂, which is exhaled.</p>
<h3>CO₂ carriage</h3>
${tw('<tr><th>Form</th><th>Share of CO₂ in arterial blood</th></tr><tr><td>Bicarbonate</td><td>≈ 90%</td></tr><tr><td>Carbamino compounds</td><td>≈ 5%</td></tr><tr><td>Dissolved</td><td>≈ 5%</td></tr>')}
<p>Of the CO₂ actually exchanged between arterial and venous blood, carbamino and dissolved CO₂ contribute more than their share (about 30% and 10%).</p>
<h3>2,3-BPG</h3>
<p>Red cells make 2,3-bisphosphoglycerate through a glycolytic side path (Rapoport–Luebering shunt). It binds deoxy-Hb and shifts the curve right. It rises with chronic hypoxia, anaemia and altitude, and falls in stored blood.</p>`,
keys:[['Bohr effect','H⁺/CO₂ ↓ O₂ affinity'],['Haldane effect','O₂ ↓ CO₂ carriage'],['Chloride shift','HCO₃⁻ out, Cl⁻ in (band 3)']],
hook:'Bohr: acid kicks oxygen off. Haldane: oxygen kicks CO₂ off.',
q:[['Which effect explains part of the rise in PaCO₂ when a COPD patient is given high-flow oxygen?',['Bohr effect','Haldane effect','Chloride shift','Hamburger effect'],1,'Oxygen binding releases CO₂ from haemoglobin. Worsened V/Q matching (loss of hypoxic vasoconstriction) contributes more.'],
['Massively transfused blood (low 2,3-BPG) shifts the dissociation curve…',['Right, releasing O₂ more easily','Left, holding O₂ more tightly','Right, because stored blood is acidic','Not at all once it is warmed'],1,'Low 2,3-BPG raises affinity: oxygen loads but unloads poorly in tissues.']]});

lesson({id:'toxalc',m:'micro',t:'Enzymes and poisons: toxic alcohols and 5-oxoproline',
sum:'Alcohol dehydrogenase turns methanol and ethylene glycol into toxic acids. Early there is an osmolar gap; later an anion gap.',
body:`<p>Methanol and ethylene glycol are themselves fairly harmless osmoles. The damage comes after <b>alcohol dehydrogenase (ADH)</b> and aldehyde dehydrogenase metabolise them:</p>
${tw('<tr><th>Parent</th><th>Toxic metabolites</th><th>Target</th></tr><tr><td>Methanol</td><td>Formaldehyde → <b>formic acid</b></td><td>Retina and optic nerve (blindness), basal ganglia</td></tr><tr><td>Ethylene glycol</td><td>Glycolaldehyde → <b>glycolic acid</b> → oxalic acid</td><td>Kidneys (calcium oxalate crystals), hypocalcaemia, CNS</td></tr><tr><td>Isopropanol</td><td>Acetone (not an acid)</td><td>CNS depression; ketosis <i>without</i> acidosis</td></tr>')}
<h3>The gaps over time</h3>
<ul><li><b>Early</b>: high osmolar gap, normal anion gap (parent alcohol present, not yet metabolised).</li>
<li><b>Late</b>: osmolar gap falls while the anion gap rises (acid metabolites). A normal osmolar gap does not exclude a late presentation.</li></ul>
<p><b>Fomepizole</b> (or ethanol) blocks ADH. Haemodialysis removes both the alcohol and its acids.</p>
<h3>Lactate gap</h3>
<p>Some blood gas analysers read glycolate as lactate. A high lactate on the gas but a normal laboratory lactate (a "lactate gap") points to ethylene glycol.</p>
<h3>5-oxoproline (pyroglutamic acid)</h3>
<p>Chronic paracetamol use depletes glutathione, especially in malnourished patients, women, sepsis and renal failure, or with flucloxacillin. 5-oxoproline accumulates and causes an unexplained high anion gap acidosis. It is the "O" in GOLDMARK.</p>
<p><b>The worked gas</b> is early toxic alcohol: a 34-year-old seen one hour after drinking screenwash, with no ethanol on board. The acid–base is normal and the anion gap is 12, but measured osmolality is 322 against a calculated 290 (2 × 140 + 5 + 5): an osmolar gap of 32. The gas looks safe; the gap says otherwise.</p>`,
ex:{pH:7.40,pco2:40,hco3:24,po2:95,fio2:0.21,na:140,k:4.2,cl:104,alb:42,lac:1.2,glu:5,urea:5,osm:322,age:34},
keys:[['Blocks ADH','Fomepizole, ethanol'],['Osmolar gap normal','< 10 mOsm/kg'],['Methanol target','Optic nerve'],['Ethylene glycol target','Kidney (oxalate)']],
hook:'Osmolar gap first, anion gap later: the alcohol turns into acid.',
q:[['Ethanol-free patient, osmolar gap 32, anion gap 13, presented 1 hour after ingestion. Likely?',['Late ethylene glycol poisoning','Early toxic alcohol ingestion','Diabetic ketoacidosis with dehydration','Lactic acidosis from a seizure'],1,'The parent alcohol raises osmolality before it is metabolised to acids.'],
['Isopropanol poisoning typically causes…',['Severe HAGMA with a raised osmolar gap','Ketosis and an osmolar gap, but no acidosis','Calcium oxalate crystals in the urine','Optic neuropathy from formic acid build-up'],1,'It is metabolised to acetone, which is not an acid, so ketones and the osmolar gap rise while the pH and anion gap stay normal.']]});

/* ---------- OXYGEN / CO2 / LUNGS ---------- */
lesson({id:'o2content',m:'gas',t:'Oxygen content and delivery',w:['o2c'],
sum:'CaO₂ = 1.34 × Hb × SaO₂ + 0.003 × PaO₂. Delivery = cardiac output × content. Haemoglobin and saturation matter far more than PaO₂.',
body:`<div class="eq">CaO₂ (mL/dL) = 1.34 × Hb (g/dL) × SaO₂ + 0.003 × PaO₂ (mmHg)</div>
<p>Normal: 1.34 × 15 × 0.98 + 0.3 ≈ <b>20 mL O₂ per dL</b>.</p>
<div class="eq">DO₂ (mL/min) = cardiac output (L/min) × CaO₂ × 10</div>
<p>Normal: 5 × 20 × 10 ≈ <b>1,000 mL/min</b>. Resting consumption (VO₂) is about 250 mL/min, so tissues extract about 25% and mixed venous saturation is about 75%.</p>
<h3>Which lever matters?</h3>
<ul><li>Raising PaO₂ from 60 to 100 mmHg (8 to 13.3 kPa) adds about 2 mL/dL (saturation 90% → 98%).</li>
<li>Raising Hb from 7 to 10 g/dL adds about 4 mL/dL.</li>
<li>Doubling cardiac output doubles delivery.</li>
<li><b>Why 1.34?</b> Each gram of haemoglobin can bind 1.39 mL of O₂ in theory (Hüfner), but some is always carboxy- or methaemoglobin, so 1.34 is the figure measured in real blood. <b>Carbon monoxide</b> and <b>methaemoglobin</b> cut content with a normal PaO₂, and a pulse oximeter may miss them; see <a href="#l-oxim">the co-oximetry lesson</a>.</li></ul>
<p>When delivery falls, extraction rises and venous saturation drops. A central venous saturation (ScvO₂) below 70% in shock means delivery is not meeting demand. A <i>high</i> venous saturation with a high lactate suggests cells cannot use oxygen: cyanide, late sepsis, or microcirculatory (arteriovenous) shunting, where blood bypasses the tissues.</p>`,
keys:[['Normal CaO₂','≈ 20 mL/dL'],['Normal DO₂','≈ 1,000 mL/min'],['Normal ScvO₂','> 70%']],
hook:'Content is mostly haemoglobin times saturation; delivery is that times the pump.',
q:[['Which change raises oxygen delivery most in a patient with Hb 7, SaO₂ 92%, CO 4 L/min?',['Raise PaO₂ from 65 to 100','Transfuse to Hb 10','Raise SaO₂ to 98%','None; all are equal'],1,'Hb 7 → 10 raises content from ≈ 8.8 to ≈ 12.5 mL/dL; raising saturation adds only ≈ 0.6.'],
['Smoke inhalation victim: lactate 11, ScvO₂ 88%. Most likely?',['Hypovolaemia','Cyanide poisoning','Anaemia','Hypoventilation'],1,'Cells cannot extract oxygen, so venous blood stays saturated while lactate soars.']]});

lesson({id:'odc',m:'gas',t:'The oxyhaemoglobin dissociation curve',w:['odc'],
sum:'Sigmoid because haemoglobin binds cooperatively. Remember 27 → 50%, 40 → 75%, 60 → 90%. Shifts change unloading, not just loading.',
body:`<p>Binding one O₂ makes the next easier (cooperativity), giving the S shape. The flat top protects loading: PaO₂ can fall from 100 to 60 mmHg with saturation still 90%. The steep middle aids unloading: small falls in tissue PO₂ release a lot of oxygen.</p>
${tw('<tr><th>PO₂ (mmHg)</th><th>kPa</th><th>Saturation</th><th>Meaning</th></tr><tr><td>27</td><td>3.6</td><td>50%</td><td>P50</td></tr><tr><td>40</td><td>5.3</td><td>75%</td><td>Mixed venous</td></tr><tr><td>50</td><td>6.7</td><td>85%</td><td>Steep part</td></tr><tr><td>60</td><td>8.0</td><td>90%</td><td>Edge of the cliff</td></tr><tr><td>100</td><td>13.3</td><td>97–98%</td><td>Arterial</td></tr>')}
<h3>Shifts</h3>
<ul><li><b>Right</b> (lower affinity, easier unloading): ↑ H⁺, ↑ CO₂, ↑ temperature, ↑ 2,3-BPG, exercise. Mnemonic "CADET face Right": CO₂, Acid, 2,3-DPG, Exercise, Temperature.</li>
<li><b>Left</b> (higher affinity, poorer unloading): alkalosis, hypothermia, low 2,3-BPG, <b>carbon monoxide</b>, <b>methaemoglobin</b>, fetal haemoglobin.</li></ul>
<p>Rapidly correcting an acidosis with bicarbonate shifts the curve left before 2,3-BPG readjusts, which can worsen tissue oxygen release.</p>
<p>The <b>90/60 rule</b> is why SpO₂ targets sit at 94–98% for most acutely ill patients, and 88–92% for those at risk of hypercapnic respiratory failure (BTS 2017): below 90% you are on the steep part, where small changes in PaO₂ cause big drops in saturation. Some guidelines (TSANZ 2015) use 92–96%.</p>`,
keys:[['P50','≈ 27 mmHg (3.6 kPa)'],['60 mmHg (8 kPa)','≈ 90% saturation'],['50 mmHg (6.7 kPa)','≈ 85% saturation'],['40 mmHg (5.3 kPa)','≈ 75% saturation'],['SpO₂ target (BTS)','94–98% · 88–92% if CO₂ risk']],
hook:'"40-50-60 → 75-85-90", and P50 is 27. Right shift releases; left shift hoards.',
q:[['Which shifts the curve to the left?',['Fever','Carbon monoxide','Acidosis','High 2,3-BPG'],1,'CO increases the affinity of the remaining haem sites, so oxygen unloads poorly.'],
['SpO₂ 90% corresponds to a PaO₂ of roughly…',['40 mmHg','60 mmHg','80 mmHg','100 mmHg'],1,'The 90/60 point on a normal curve.']]});

lesson({id:'hypox',m:'gas',t:'The five causes of hypoxaemia',
sum:'Low inspired O₂, hypoventilation, diffusion limitation, V/Q mismatch, shunt. The A–a gradient and the response to oxygen separate them.',
body:`${tw('<tr><th>Mechanism</th><th>A–a gradient</th><th>Better on O₂?</th><th>Examples</th></tr><tr><td>Low PiO₂</td><td>Normal</td><td>Yes</td><td>Altitude, aircraft, fire in enclosed space</td></tr><tr><td>Hypoventilation</td><td>Normal</td><td>Yes (but CO₂ stays high)</td><td>Opioids, sedation, neuromuscular disease, obesity hypoventilation</td></tr><tr><td>Diffusion limitation</td><td>Raised</td><td>Yes</td><td>Interstitial lung disease, especially on exercise</td></tr><tr><td>V/Q mismatch (the commonest mechanism)</td><td>Raised</td><td>Yes</td><td>COPD, asthma, pneumonia, PE</td></tr><tr><td>Shunt</td><td>Raised</td><td><b>Poorly</b></td><td>ARDS, lobar collapse, consolidation, intracardiac or pulmonary AV shunts</td></tr>')}
<h3>Reading it</h3>
<div class="eq">PAO₂ = FiO₂ × 713 − PaCO₂ ÷ 0.8 (sea level, mmHg) · A–a = PAO₂ − PaO₂</div>
<p>Normal A–a on room air is up to about age/4 + 4 mmHg. The derivation is in <a href="#l-alv">Diffusion and the alveolar gas equation</a>.</p>
<ol class="steps"><li>Calculate the A–a gradient. Normal → hypoventilation or low PiO₂. Check the PaCO₂.</li>
<li>Raised → lung problem. Does PaO₂ rise properly with oxygen?</li>
<li>Minimal rise on high FiO₂ → significant shunt (above about 30% shunt fraction, extra oxygen barely helps). Think consolidation, collapse, ARDS, and recruit with PEEP.</li></ol>
<p>Dead space (ventilated but not perfused, e.g. PE) mostly raises the PaCO₂ for a given ventilation; patients compensate by breathing more, so PaCO₂ is often low.</p>`,
keys:[['Normal A–a (room air)','≤ age/4 + 4 mmHg'],['Normal A–a causes','Low PiO₂, hypoventilation'],['O₂-refractory','Shunt'],['Commonest','V/Q mismatch']],
hook:'Normal gradient: the lung is innocent. Refractory to oxygen: think shunt.',
q:[['PaO₂ 55 on FiO₂ 0.21, then 62 on FiO₂ 1.0. Mechanism?',['V/Q mismatch','Shunt','Hypoventilation','Diffusion limitation'],1,'Almost no response to 100% O₂ is the hallmark of large shunt.'],
['Which causes hypoxaemia with a normal A–a gradient?',['Pneumonia','Opioid overdose','Pulmonary embolism','ARDS'],1,'Pure hypoventilation lowers PAO₂ through raised PaCO₂; the lung itself transfers normally.']]});

lesson({id:'ratios',m:'gas',t:'P/F ratio and other oxygenation indices',
sum:'P/F = PaO₂ ÷ FiO₂. Normal above 400 (mmHg). ARDS: ≤ 300 mild, ≤ 200 moderate, ≤ 100 severe.',
body:`<p>The PaO₂/FiO₂ ratio lets you compare oxygenation across different oxygen levels. Use FiO₂ as a fraction (21% → 0.21).</p>
<ul><li>Room air, PaO₂ 95 mmHg (12.7 kPa) → P/F = 452 (60 in kPa).</li>
<li>On FiO₂ 0.5, PaO₂ 75 mmHg (10 kPa) → P/F = 150 (20 in kPa): severely impaired despite a "normal-looking" PaO₂.</li></ul>
${tw('<tr><th>P/F (mmHg)</th><th>kPa</th><th>ARDS severity (Berlin 2012)</th></tr><tr><td>201–300</td><td>26.7–40</td><td>Mild</td></tr><tr><td>101–200</td><td>13.3–26.7</td><td>Moderate</td></tr><tr><td>≤ 100</td><td>≤ 13.3</td><td>Severe</td></tr>')}
<p>Berlin requires PEEP or CPAP of at least 5 cmH₂O. The 2023 global definition also accepts an <b>SpO₂/FiO₂ ratio ≤ 315</b> (with SpO₂ ≤ 97%) when no arterial gas is available, and includes patients on high-flow nasal oxygen.</p>
<h3>Other indices</h3>
<ul><li><b>Oxygenation index</b> = FiO₂ × mean airway pressure × 100 ÷ PaO₂. Accounts for ventilator support; used in children and ECMO decisions.</li>
<li><b>Expected PaO₂</b> on supplemental oxygen: roughly FiO₂ (%) × 5. On 40%, a PaO₂ near 200 is expected in healthy lungs.</li>
<li>Nasal cannula FiO₂ is approximate: about 0.21 + 0.03–0.04 per L/min.</li></ul>
<h3>Limits of P/F</h3>
<ul><li>The same lungs give a different P/F at a different FiO₂ (the relationship is not linear, especially with shunt) and at a different PEEP. Compare ratios at similar settings.</li>
<li>At altitude, PaO₂ falls with barometric pressure. Berlin suggests adjusting: P/F × (barometric pressure ÷ 760) when above 1,000 m.</li>
<li>With an uncertain FiO₂ (nasal cannula, face mask), the ratio is only an estimate.</li></ul>`,
keys:[['Normal P/F','> 400'],['ARDS mild/mod/severe','≤ 300 / 200 / 100'],['S/F ARDS threshold','≤ 315']],
hook:'Divide PaO₂ by FiO₂: 300, 200, 100 marks the ladder down.',
q:[['FiO₂ 0.6, PaO₂ 90, PEEP 10, bilateral infiltrates not cardiac. ARDS severity?',['Mild','Moderate','Severe','Not ARDS'],1,'90 ÷ 0.6 = 150: moderate.'],
['On 40% oxygen, roughly what PaO₂ would healthy lungs give?',['80','120','200','400'],2,'Rough rule: FiO₂% × 5 = 200 mmHg.']]});

lesson({id:'co2vent',m:'gas',t:'CO₂: ventilation\'s thermostat',
sum:'PaCO₂ ∝ CO₂ production ÷ alveolar ventilation. Halve ventilation, double PaCO₂. PaCO₂ is the best single measure of ventilation.',
body:`<div class="eq">PaCO₂ = 0.863 × VCO₂ ÷ V<sub>A</sub></div>
<p>Units matter for the 0.863: VCO₂ in mL/min (STPD), V<sub>A</sub> in L/min (BTPS), PaCO₂ in mmHg. Example: 0.863 × 200 ÷ 4.3 ≈ <b>40 mmHg (5.3 kPa)</b>.</p>
<p>Alveolar ventilation (V<sub>A</sub>) is minute ventilation minus dead space ventilation. A patient breathing fast and shallow can have a high minute ventilation and still retain CO₂ because most of each breath only fills dead space.</p>
<h3>Causes of hypercapnia</h3>
<ul><li><b>Won't breathe</b>: drive failure (opioids, sedatives, brainstem lesions, obesity hypoventilation, metabolic alkalosis).</li>
<li><b>Can't breathe</b>: neuromuscular (Guillain–Barré, myasthenia, high spinal injury), chest wall (kyphoscoliosis, flail chest), fatigue.</li>
<li><b>Can't get it out</b>: airway obstruction (COPD, asthma, upper airway), high dead space.</li>
<li><b>Making too much</b>: rarely alone; fever, sepsis, overfeeding with carbohydrate, malignant hyperthermia, bicarbonate infusion in a patient who cannot raise ventilation.</li></ul>
<h3>Oxygen and the CO₂ retainer</h3>
<p>High-flow oxygen raises PaCO₂ in some patients with chronic hypercapnia. The main reasons are loss of hypoxic pulmonary vasoconstriction (worse V/Q matching) and the Haldane effect; reduced hypoxic drive plays a smaller part. Target SpO₂ 88–92% in those at risk and recheck a gas.</p>`,
keys:[['PaCO₂ ∝','VCO₂ / alveolar ventilation'],['Normal PaCO₂','35–45 mmHg (4.7–6.0 kPa)'],['At-risk SpO₂ target','88–92%']],
hook:'Won\'t breathe, can\'t breathe, can\'t get it out.',
q:[['A patient\'s alveolar ventilation halves with no change in CO₂ production. PaCO₂ 40 mmHg (5.3 kPa) becomes…',['50 mmHg (6.7 kPa)','60 mmHg (8.0 kPa)','80 mmHg (10.7 kPa)','Unchanged'],2,'PaCO₂ is inversely proportional to alveolar ventilation.'],
['The main reason PaCO₂ rises when hypercapnic COPD patients get high-flow O₂ is…',['Loss of the hypoxic drive to breathe alone','Worsened V/Q matching and the Haldane effect','Absorption atelectasis from the high FiO₂','More CO₂ production as tissues get oxygen'],1,'Releasing hypoxic vasoconstriction perfuses poorly ventilated units; oxygenated Hb also releases CO₂.']]});

lesson({id:'respfail',m:'gas',t:'Type 1 and type 2 respiratory failure',
sum:'Type 1: PaO₂ < 60 mmHg (8 kPa) with normal or low PaCO₂. Type 2: PaCO₂ > 45 mmHg (6 kPa). pH and HCO₃⁻ tell acute from chronic.',
body:`${tw('<tr><th></th><th>Type 1 (hypoxaemic)</th><th>Type 2 (hypercapnic)</th></tr><tr><td>PaO₂</td><td>&lt; 60 mmHg (8 kPa)</td><td>Low or normal</td></tr><tr><td>PaCO₂</td><td>Normal or low</td><td>&gt; 45 mmHg (6 kPa)</td></tr><tr><td>Problem</td><td>Gas exchange (V/Q, shunt)</td><td>Ventilation (pump or drive)</td></tr><tr><td>Examples</td><td>Pneumonia, PE, pulmonary oedema, ARDS</td><td>COPD, opioids, neuromuscular, OHS, exhausted asthmatic</td></tr>')}
<h3>Acute, chronic or acute-on-chronic type 2</h3>
<ul><li><b>Acute</b>: pH low, HCO₃⁻ near normal (up ≈ 1 per 10 mmHg PaCO₂).</li>
<li><b>Chronic</b>: pH near normal, HCO₃⁻ high (up ≈ 4 per 10 mmHg).</li>
<li><b>Acute-on-chronic</b>: HCO₃⁻ high but pH still low. Typical of a COPD exacerbation.</li></ul>
<p>Treat the pH, not the PaCO₂. A COPD patient living at PaCO₂ 60 mmHg (8 kPa) with pH 7.38 needs no ventilation. The same PaCO₂ with pH 7.25 that persists after nebulisers, steroids and controlled oxygen (target 88–92%) needs non-invasive ventilation: BTS/ICS advise NIV when pH stays below 7.35 with PaCO₂ above 6.5 kPa (49 mmHg) despite optimal medical therapy.</p>
<p><b>The worked gas</b> is that patient: a 68-year-old with a COPD exacerbation on 28% oxygen. PaCO₂ 80 mmHg (10.7 kPa) with HCO₃⁻ 34: the acute rule predicts 28 and the chronic rule 40, so 34 means a chronic retainer with an acute rise on top. pH 7.25 decides: NIV if it does not improve with treatment.</p>`,
ex:{pH:7.25,pco2:80,hco3:34,po2:52,fio2:0.28,na:138,cl:92,alb:36,age:68},
keys:[['Type 1','PaO₂ < 60 mmHg (8 kPa)'],['Type 2','PaCO₂ > 45 mmHg (6 kPa)'],['Decides urgency','pH']],
hook:'One problem (oxygen) or two (oxygen and CO₂). Then let the pH tell you how new it is.',
q:[['PaCO₂ 80, HCO₃⁻ 34, pH 7.25. Interpretation?',['Acute respiratory acidosis','Chronic compensated respiratory acidosis','Acute-on-chronic respiratory acidosis','Metabolic alkalosis'],2,'Acute rule predicts HCO₃⁻ ≈ 28; chronic predicts ≈ 40. 34 sits between: a chronic retainer whose PaCO₂ has risen acutely on top.'],
['Pneumonia, PaO₂ 52, PaCO₂ 31. Type?',['Type 1','Type 2','Mixed','Normal'],0,'Hypoxaemia with low CO₂ (hyperventilation).']]});

lesson({id:'ventchg',m:'gas',t:'When ventilation changes: predicting the next gas',w:['hh'],
sum:'Acute changes in PCO₂ move HCO₃⁻ only slightly, so pH swings hard. Predict the next gas before you change the ventilation.',
body:`<p>Over minutes, only chemical buffering moves bicarbonate: about <b>+1 mmol/L per 10 mmHg</b> rise in PCO₂ (and about −2 per 10 mmHg fall from normal). The kidneys need days. So any sudden change in ventilation shows up almost entirely in the pH.</p>
<h3>Three situations where this kills</h3>
<ul><li><b>Metabolic acidosis losing its compensation.</b> DKA with HCO₃⁻ 6 and PCO₂ 17 has pH ≈ 7.17. If sedation or exhaustion lets PCO₂ rise to 40, HCO₃⁻ only reaches ≈ 8 and pH falls to ≈ 6.94. A "normal" PCO₂ in severe metabolic acidosis is respiratory failure.</li>
<li><b>Intubating salicylate or severe DKA.</b> Match the minute ventilation the patient was achieving before induction, recheck the gas within 15–30 minutes, and keep the PCO₂ near its pre-intubation value.</li>
<li><b>Over-ventilating a CO₂ retainer.</b> A COPD patient living with PCO₂ 65 and HCO₃⁻ 34 who is ventilated to 40 is left with the bicarbonate: post-hypercapnic metabolic alkalosis, pH above 7.5, low ionised calcium and potassium. Ventilate to the usual PCO₂ or a pH of about 7.35–7.40.</li></ul>
<h3>The ventilator arithmetic</h3>
<div class="eq">new rate ≈ current rate × current PaCO₂ ÷ target PaCO₂</div>
<p>PaCO₂ is inversely proportional to alveolar ventilation, so this holds when tidal volume and dead space stay the same. Example: rate 14, PaCO₂ 60, target 45 → 14 × 60 ÷ 45 ≈ 19. In ARDS, lung-protective tidal volumes (≈ 6 mL/kg predicted body weight) often mean accepting a higher PaCO₂ (permissive hypercapnia, pH above about 7.20) rather than raising tidal volume.</p>
<h3>Oxygenation levers are different</h3>
<p>PCO₂ follows ventilation (rate × tidal volume). PaO₂ follows FiO₂ and mean airway pressure (PEEP). Shunt responds to PEEP and recruitment, not to more oxygen alone.</p>
<p><b>The worked gas</b> is the first situation, after the fall: a 22-year-old in DKA, sedated for agitation, PCO₂ now 40 mmHg (5.3 kPa). Winter's expects about 20 for a bicarbonate of 8, so this "normal" PCO₂ is a respiratory acidosis on top, and the pH has dropped to 6.94.</p>
<p>In <a href="#practice">Practice → Step by step</a>, some cases end with a "What happens next" step built on these numbers.</p>`,
ex:{pH:6.94,pco2:40,po2:140,fio2:0.4,na:136,k:5.8,cl:100,alb:40,lac:1.8,glu:28,age:22},
keys:[['Acute HCO₃⁻ change','+1 per 10 mmHg ↑ · −2 per 10 ↓'],['New rate','rate × PaCO₂ ÷ target'],['Retainer target','usual PCO₂ / pH 7.35–7.40']],
hook:'In the first hour, the kidneys are not coming. Every change in CO₂ lands on the pH.',
q:[['DKA: HCO₃⁻ 6, PCO₂ 17. Sedation lets PCO₂ rise to 40 acutely. pH becomes about…',['7.17 (unchanged)','7.40','6.94','7.10'],2,'HCO₃⁻ ≈ 6 + 2.3 ≈ 8.3; pH = 6.1 + log(8.3 ÷ 1.2) ≈ 6.94.'],
['Ventilated patient: rate 12, PaCO₂ 55, target 40. New rate?',['12','14','16–17','24'],2,'12 × 55 ÷ 40 = 16.5, if tidal volume and dead space are unchanged.'],
['A COPD retainer (PCO₂ 65, HCO₃⁻ 34) is ventilated to PCO₂ 40 within an hour. Expected gas?',['Acute respiratory alkalosis with a normal bicarbonate','Post-hypercapnic metabolic alkalosis with alkalaemia','Normal gas, as the kidneys adjust within the hour','Compensated chronic respiratory acidosis persisting'],1,'The bicarbonate stays high for days while the CO₂ has gone: pH well above 7.45.']]});
