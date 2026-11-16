# T16: new visual models (e3.js: Davenport, curve in motion, lung model, kidney)

## Summary
I tested W.dav, W.odcplay, W.vq (vqUnit/vqSolve) and W.kidney in the frozen 4.9.0 copy at 390, 820, 1280 and 1440 px, in the pixel and clinical skins, in dark and light themes, with reduced motion emulated, and inside the lessons comp, odc, hypox, ratios, renal, rta, alkmaint and icu-ards. I replayed the solver in Node across the presets, FiO₂ 0.21/0.5/0.95 and slider extremes, and checked it against the shunt equation and conservation of VO₂ and VCO₂.

**Verdict.** The visuals are good, and smooth: Davenport frames take about 1.1 ms, the kidney loop runs at 60 fps and stops when its view is hidden, there is no double loop on rapid Pause/Play, and no console errors or horizontal overflow at any width. Reduced motion is respected: Davenport and the curve jump to the end, and the kidney starts paused on a still frame. The Davenport points are all correct by the app's rules (Winter's 26, 0.7×36+20 ≈ 45, 1/4 and 2/5 per 10), and every compensated point sits inside its band. The shunt equation is reproduced exactly (calculated Qs/Qt equals the slider value at every FiO₂), and the ODC P50 shifts are realistic.

The problems are in the physiology:
- The lung model holds the mixed venous values fixed, so it does not conserve VO₂ or VCO₂. Its R drifts from 0.45 to 1.8, so the A–a gradient is wrong: normal shows 0, and pure hypoventilation shows 32, which contradicts the hypox lesson it sits in. Dead space barely raises PaCO₂, which is capped at 46.
- The kidney model says NH₄⁺ excretion is normal in type 1 RTA, which contradicts the UAG teaching in the rta lesson.
- The CO scenario labels 69% as "SaO₂".

**Score: 6.5/10**: lovely and smooth, but two teaching errors must be fixed before release.

Counts: critical 2, major 5, minor 10, polish 11, idea 8.

Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-*.png. Solver replicas: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t16/vq.js, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t16/vq3.js and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t16/odc.js.

### Key solver numbers (room air unless stated)
| Preset | PaO₂ | PaCO₂ | A–a (raw) | EtCO₂ gap | FiO₂ 0.95 PaO₂ |
|---|---|---|---|---|---|
| Normal | 104 | 36.7 | −0.6 | 0.2 | 595 |
| Pneumonia (low V/Q) | 68 | 37.8 | 34.5 | 5.5 | 522 |
| Shunt 35% (ARDS) | 61 | 38.0 | 41.5 | 4.3 | 85 |
| PE | 80 | 39.8 | 20.5 | 9.0 | 589 |
| COPD | 77 | 38.9 | 23.7 | 3.4 | 567 |
| Dead space 80% (uniform) | 64 | 42.9 | **32.3** | 0.1 | 582 |

## Critical
### T16-1 · e3.js · W.kidney stats(), collecting duct + 'Type 1 RTA'
- **What:** With Type 1 RTA on, the stat 'NH₄⁺ excretion' reads 'Normal' (also with Acid load + Type 1). In distal RTA urinary NH₄⁺ is LOW, because no H⁺ is secreted to trap NH₃. That is exactly why the urine anion gap is positive, which the rta lesson where this model sits teaches ('A positive gap means low NH₄⁺: distal RTA, type 4'). The model contradicts its own lesson on a core exam point.
- **Evidence:** openTool('m-kidney') → Collecting duct → Type 1 RTA: stats = 'H⁺ pumped: Pump fails · NH₄⁺ excretion: Normal · Urine pH: Cannot go below 5.5'. Code: nh4=f.t4?'Low…':f.load&&!f.t1?'Rises several-fold':'Normal'. Lesson rta (c2.js) UAG paragraph. Batlle 1988 NEJM (cited by the model) shows a positive UAG = low NH₄⁺ in distal RTA.
- **Fix:** In stats(): nh4 = f.t1 ? 'Low: no H⁺ to trap NH₃ (urine anion gap positive)' : f.t4 ? 'Low (hyperkalaemia blocks ammoniagenesis)' : f.load ? 'Rises several-fold' : 'Normal'. Add a 'Urine anion gap' row: negative for Normal + Acid load, positive for t1/t4.

### T16-2 · e3.js · vqSolve() → r.aa (PAid uses R = 0.8); W.vq A–a stat
- **What:** The A–a gradient comes from the alveolar gas equation with R = 0.8, but the model's own gas exchange runs at a different R, because PvO₂ and PvCO₂ are fixed. At baseline R is 0.96, and with 80% dead space it is 0.45. Result: (a) the Normal preset shows A–a '0', with a raw value of −0.6 and no shunt −7.6, both hidden by Math.max(0,…), when the expected normal is about 5–10; (b) pure uniform hypoventilation (dead space 80%, both units equal, 2% shunt) shows A–a 32, although the real alveolar–arterial difference in the model is about 1 mmHg (unit PAO₂ 64.9 vs PaO₂ 63.8). The hypox lesson that holds this model teaches 'Hypoventilation → A–a normal', so the model shows the opposite.
- **Evidence:** Node replica of e3.js lines 51–64: Normal VCO₂ 233 mL vs VO₂ 241 mL (R 0.96), aa −0.6; dead 0.8: VCO₂ 78, VO₂ 175 (R 0.45), aa +32.3 while A.pao2 64.9 and PaO₂ 63.8. In the browser at 390 px: Dead space 80% → stats '64 PaO₂, 43 PaCO₂, 32 A–a gradient'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-vq-allmax-390.png. Lesson hypox (c1.js) table row 'Hypoventilation | Normal'.
- **Fix:** Either (preferred) fix the conservation (see the next finding) so R stays at 0.8, or compute the ideal PAO₂ with the model's actual R: R = VCO₂/VO₂ from the unit fluxes, PAid = PiO₂ − PaCO₂ × (FiO₂ + (1 − FiO₂)/R). Show negative values as 0 only after the fix, and check that Normal gives about 5–10 mmHg (2% shunt) and that uniform dead space gives under 10.

## Major
### T16-3 · e3.js · vqSolve()/vqUnit(): fixed PvO₂ 40 and PvCO₂ 46
- **What:** The model claims to be 'solved by O₂ and CO₂ mass balance', but CO₂ production and O₂ uptake are not conserved: the venous values are fixed, so the body's VCO₂ and VO₂ change with the lung settings. PaCO₂ can never rise above PvCO₂ (46), so dead space and hypoventilation barely move it: 80% dead space at a fixed VE of 6.5 L/min gives an alveolar ventilation of 1.3 L/min, which really means a PaCO₂ of about 130–150, but the model shows 43. VCO₂ falls from 233 to 78 mL/min. A 60% shunt drops the VO₂ from 241 to 102 mL/min. The disclaimer ('direction and size of effects') does not hold for size, and the 'PaCO₂ is high here because minute ventilation is held fixed' message can only trigger near 46.
- **Evidence:** Node: dead 0.45 → PaCO₂ 38.3; 0.6 → 40.2; 0.8 → 42.9 (VCO₂ 191/146/78 mL/min). Browser: Dead space 45% → PaCO₂ 38, the same as normal. The hypox lesson says 'Dead space … mostly raises the PaCO₂ for a given ventilation'.
- **Fix:** Wrap the solve in an outer loop that holds VO₂ = 250 and VCO₂ = 200 mL/min fixed. Set CvO₂ = CaO₂ − VO₂/(10·Q) and CvCO₂ = CaCO₂ + VCO₂/(10·Q), back-solve PvO₂ and PvCO₂, and iterate about 20–40 times with damping. Cap PvO₂ at ≥ 10 and report 'incompatible with life' beyond that. Then reword the note: the mixed venous values float, and the cardiac output and metabolism are held fixed.

### T16-4 · e3.js · W.vq run() say[] dead-space sentence; 'Dead space' slider
- **What:** With Dead space ≥ 45% and matched units, the hint says 'the gap between PaCO₂ and end-tidal CO₂ widens (0 mmHg)'. The slider reduces alveolar ventilation uniformly, which behaves like anatomical dead space, so the PaCO₂–EtCO₂ gap never widens, yet the text promises it does. Only an unperfused ventilated unit (Blood flow to B → 0%) widens the gap (20 mmHg), which is correct physiology.
- **Evidence:** Normal preset, Dead space 80% → 'High V/Q and dead space waste ventilation: … widens (0 mmHg).' Dead space 45% → same with (0 mmHg). Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-vq-allmax-390.png.
- **Fix:** Rename the slider 'Anatomical dead space (% of ventilation)', and trigger the gap sentence only when r.paco2 − r.et ≥ 3. Better: model the slider's dead space as alveolar dead space (ventilation to a third, unperfused compartment) so it widens the gap as in PE, and keep a separate VE slider for hypoventilation.

### T16-5 · e3.js · W.odcplay stats, 'Carbon monoxide 30%' scenario
- **What:** For CO 30% the stat labelled 'SaO₂ at 100' shows 69%. That is the oxyhaemoglobin fraction measured by co-oximetry, not what a pulse oximeter or a gas analyser's calculated SaO₂ shows: both read about 97–98% in CO poisoning. That is the classic exam and bedside trap, and the label teaches the reverse. The curve's top at 70% is also unlabelled.
- **Evidence:** openTool('m-odcplay') → Carbon monoxide 30%: P50 22.4, 'SaO₂ at 100' 69%, 'Sat at 40' 58%, unloaded 11%. Weaver 2009 NEJM (cited): pulse oximetry overestimates oxyhaemoglobin in CO poisoning; a co-oximeter is needed.
- **Fix:** For the co scenario relabel the stats 'O₂Hb at 100 (co-oximetry)' and 'O₂Hb at 40', and add a line under the scenario: 'SpO₂ and a calculated SaO₂ still read about 98%; only co-oximetry shows the 69%.' Optionally draw a faint dashed line at 70% labelled 'max O₂Hb with 30% COHb'.

### T16-6 · e3.js · W.kidney stats() / spawn(), Acetazolamide in Collecting duct
- **What:** The Acetazolamide toggle does nothing in the collecting duct view. With Acetazolamide + Acid load, the proximal view says 'Urine pH: Above 7 (alkaline)' and the collecting duct view says 'Urine pH: About 4.5–5', so the two views contradict each other. Carbonic anhydrase inhibition also reduces H⁺ generation in α-intercalated cells, and the bicarbonaturia keeps the urine alkaline.
- **Evidence:** Collecting duct + Acetazolamide: 'H⁺ pumped Normal · NH₄⁺ Normal · Urine pH About 5–6 …'. Collecting duct + Acetazolamide + Acid load: 'Urine pH About 4.5–5', while Proximal + the same flags: 'Above 7'.
- **Fix:** In dist stats, when f.aceta: Urine pH 'Above 6.5–7 (HCO₃⁻ arriving from upstream)', H⁺ pumped 'Reduced (CA II inhibited)', New HCO₃⁻ 'Too little', K⁺ 'Low'. Draw the CA disc as 'CA ✕' in dist too. Or grey out toggles that do not apply to the current segment, with a small note (see the minor finding).

### T16-7 · c9.js · lesson-model map: alkmaint:['kidney']
- **What:** The kidney model is placed in 'Why metabolic alkalosis persists' (alkmaint), but it has no alkalosis content: no volume or chloride depletion, no hypokalaemia, no pendrin/β-intercalated cell, no paradoxical aciduria. All its toggles are acidosis states. The learner gets a model unrelated to the lesson's message.
- **Evidence:** openLesson('alkmaint') → the model 'Kidney: reclaiming and making bicarbonate' with Acid load / Acetazolamide / Type 1 / Type 4 only. The lesson text covers maintenance by volume, Cl⁻, K⁺ and aldosterone.
- **Fix:** Remove 'kidney' from alkmaint in c9.js until the model has an alkalosis mode. Or (e3.js) add a 'Vomiting: low Cl⁻ and volume' toggle: proximal reclaim ↑ (Na⁺ avidity), β-cell pendrin cannot secrete HCO₃⁻ without luminal Cl⁻, H⁺ secretion ↑ with hypokalaemia/aldosterone, urine pH acid (paradoxical aciduria), urine Cl⁻ < 20.

## Minor
### T16-8 · e3.js · W.dav disorder buttons onclick
- **What:** Choosing a different disorder while Play is running does not cancel the animation. The old requestAnimationFrame loop keeps going and plays the new disorder from the middle, so the dot jumps to halfway along the new path.
- **Evidence:** Play Metabolic acidosis, after 1 s click Respiratory acidosis: 1.5 s later the dot is between B and C of the new path, and the steps show A,B on. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-dav-switchmid.png.
- **Fix:** In the [data-k] onclick add cancelAnimationFrame(raf) before t=0; draw(). Consider auto-playing the new disorder (call play()).

### T16-9 · e3.js · DAV text strings / W.dav steps list in kPa mode
- **What:** With units set to kPa, the steps show PCO₂ in kPa (5.3, 3.5) but the explanations keep mmHg numbers: 'falls along the 40 line', 'PCO₂ to 1.5 × 12 + 8 = 26', 'per 10 mmHg'.
- **Evidence:** S.units='kPa'; openTool('m-dav') → step text 'C pH 7.29, PCO₂ 3.5 kPa … PCO₂ to 1.5 × 12 + 8 = 26'.
- **Fix:** Build the explanation strings with P() and PU(), for example 'along the '+P(40)+' '+PU()+' line', and add '(= '+P(26)+' kPa)' after the Winter's result. Keep the formula in mmHg but say so: 'Winter's (mmHg): 1.5 × 12 + 8 = 26 mmHg = 3.5 kPa'.

### T16-10 · e3.js · ODCS 'bohr' (Exercising muscle)
- **What:** The exercising-muscle scenario applies the acid, warm curve to both ends, so arterial saturation drops to 94% and unloading is 37%. In reality the blood loads in the lung on the normal curve (arterial pH and temperature stay normal) and unloads in warm, acidic muscle. That local shift is the point of the Bohr effect: 97 → 57% means about 41% unloaded at 40 mmHg, or about 81% at a realistic exercising-muscle PO₂ of 20.
- **Evidence:** Node replica: bohr P50 36.3, Sa100 93.9, S40 56.5, unload 37.4; loading on the normal curve: 40.7 (to 40) / 80.6 (to 20).
- **Fix:** For 'bohr', compute SaO₂ at 100 from the baseline curve and the tissue saturation from the shifted curve, and use a tissue PO₂ of about 20–25 mmHg for exercising muscle (move the second dot and the shaded band). Say so in the text.

### T16-11 · e3.js · ODCS 'alt' (Days at altitude)
- **What:** The text says the right shift 'helps unloading at low PO₂', but the numbers use sea-level points (100 → 40), and the stats show only a small gain (22.5 → 25.9%). At altitude the arterial PO₂ is about 50–60, so the scenario doesn't show what it claims. The respiratory alkalosis of altitude (pH 7.44) also opposes the 2,3-BPG shift, and the text doesn't say so.
- **Evidence:** Node: alt P50 28.9, Sa100 96.6, S40 70.7.
- **Fix:** Give scenarios their own loading and tissue PO₂ (alt: 55 → 30). Add to the text: 'the alkalosis of hyperventilation pulls left; 2,3-BPG wins over days'.

### T16-12 · e3.js · W.vq run() say[] low V/Q sentence
- **What:** The 'A low V/Q unit … extra oxygen still reaches it, so FiO₂ helps' sentence fires for a unit with V/Q = 0, which is a shunt that oxygen cannot reach. With Ventilation to B 0% and FiO₂ 95%, the hint shows the shunt sentence and the 'FiO₂ helps' sentence together, contradicting each other.
- **Evidence:** Sliders qb 100, vb 0, shunt 60, dead 80, FiO₂ 95 → both sentences shown. Code: Math.min(r.vqa,r.vqb)<0.3.
- **Fix:** Use the lowest perfused finite V/Q > 0.05 for the low-V/Q sentence, and add a separate sentence for V/Q < 0.05: 'Unit X is perfused but not ventilated: it behaves like shunt.'

### T16-13 · e3.js · W.vq run() P/F stat
- **What:** P/F is always computed in mmHg, Math.round(r.pao2/o.fio2), even when Settings → units is kPa, while PaO₂ is shown in kPa. The label has no unit.
- **Evidence:** Code line 73. In kPa mode PaO₂ shows 13.9 and P/F 497.
- **Fix:** Use P(r.pao2/o.fio2) and label it 'P/F '+PU(), matching the ratios lesson's kPa column (≤ 13.3 kPa severe).

### T16-14 · e3.js · drawVQ, W.dav draw, W.odcplay draw: static canvases
- **What:** Static canvases are not redrawn when the theme changes. After switching dark → light with the lung model open, the alveoli keep the dark-theme fill and the labels become low-contrast muted text on dark teal. Davenport and the curve behave the same way until the next interaction. The kidney redraws because it animates.
- **Evidence:** S.theme='dark' → openTool('m-vq') → S.theme='light';applyTheme(): screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-vq-themeswitch.png.
- **Fix:** Dispatch a 'buffer:theme' event at the end of applyTheme() (ui1.js) and register each e3 model's draw/run on it, as onRz does for resize.

### T16-15 · ui1.js · applyTheme()
- **What:** There is no theme-change event, so canvas models cannot redraw with the new tokens (see the e3.js finding).
- **Evidence:** grep shows no theme event; applyTheme only sets attributes.
- **Fix:** At the end of applyTheme(): dispatchEvent(new Event('buffer:theme')).

### T16-16 · e3.js · W.kidney build: addEventListener('buffer:show',…)
- **What:** Each build adds a global 'buffer:show' listener that is never removed, so every visit to the kidney model, or to a lesson containing it, leaks one closure holding the old canvas and its state.
- **Evidence:** Code line 114. Open renal → rta → alkmaint → m-kidney and each adds a listener. The frame() guard stops the old ones from drawing, but they are never released.
- **Fix:** Name the handler, and remove it in frame() when !cv.isConnected (removeEventListener('buffer:show',h)), as onRz does.

### T16-17 · e3.js · W.kidney condition toggles vs segment
- **What:** In the Proximal tubule view the Type 1 RTA, Low aldosterone and Acid load toggles change nothing in the stats (Acid load only speeds the particles), and in the Collecting duct view Acetazolamide changes nothing. The pressed toggle gives no feedback that it doesn't apply here.
- **Evidence:** Proximal + Type 1 RTA: stats identical to baseline ('80–90% · Almost none · Set further down · HCO₃⁻ held near 24').
- **Fix:** Show a one-line note under the toggles, e.g. 'Type 1 RTA acts in the collecting duct: switch view', with a button, or grey out (aria-disabled) the toggles that do not act on the current segment. For Acid load in proximal, say 'Filtered HCO₃⁻ falls, so less needs reclaiming'.

## Polish
### T16-18 · e3.js · W.dav draw(): steps list 'on' class
- **What:** During Play a step is marked as reached as soon as t passes the halfway point of the previous leg (Math.round), so B lights up while the dot is still halfway from A.
- **Evidence:** Code: stage=Math.round(t*n).
- **Fix:** Use Math.floor(t*n+1e-6) for the 'on' class, and add an 'active' class to the step being animated.

### T16-19 · e3.js · drawVQ() labels at 390 px
- **What:** At 390 px (canvas 306 px) the shunt caption 'shunt 60%: venous blood bypasses the alveoli' needs 313 px and is clipped at the right edge, and the 'ventilation ↓' label (ends at 94 px) is crossed by unit A's airway line (x = 92).
- **Evidence:** measureText at 390 px: shunt text end 313 > 306; 'ventilation ↓' end 94 vs airway x 91.8. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-vq-pe-390.png.
- **Fix:** When w<560 use 'shunt 60%: bypasses alveoli' or wrap the text onto two lines, and move 'ventilation ↓' to sit beside the airway line (x = cxA + 6), or drop it on narrow screens.

### T16-20 · e3.js · drawVQ() unit labels at ≥ 560 px and small units
- **What:** At 1280 px the line 'PAO₂ 112 · PACO₂ 36' is wider than the alveolus (radius 46 at 50% ventilation) and runs over its border. When a unit gets little ventilation (radius 14), its O₂/CO₂ text overlaps the capillary arc.
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-vq-1280-light.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-vq-allmax-390.png (unit B).
- **Fix:** Use two lines at all widths, and put labels under the capillary arc (or beside the unit) when rad < 30.

### T16-21 · e3.js · W.vq stats labels
- **What:** The 'A–a gradient' and 'end-tidal CO₂' stats have no unit, while PaO₂ and PaCO₂ do.
- **Evidence:** Stats row in all screenshots.
- **Fix:** Label them 'A–a '+PU() and 'end-tidal CO₂ '+PU().

### T16-22 · e3.js · W.vq say[] shunt sentence
- **What:** The 'try FiO₂ 95%' prompt still shows when FiO₂ is already 95%.
- **Evidence:** Shunt preset + FiO₂ 95 → 'Shunted blood never meets gas, so more oxygen helps little: try FiO₂ 95%.'
- **Fix:** When o.fio2 ≥ 0.9 say instead: 'At FiO₂ 95% the PaO₂ is only '+P(r.pao2)+': shunt needs PEEP or recruitment, not more oxygen.'

### T16-23 · e3.js · drawVQ() unit with no flow and no ventilation
- **What:** With Blood flow to B 0% and Ventilation to B 0%, unit B shows 'V/Q ∞' (0/0).
- **Evidence:** Sliders qb 0, vb 0 → canvas 'B V/Q ∞ · no flow'.
- **Fix:** When va and q are both ≈ 0, print 'B: not used' or 'V/Q —'.

### T16-24 · e3.js · W.odcplay draw()
- **What:** The curve chart has no y-axis title (saturation %) and no legend for the dashed curve (normal) vs the solid orange (shifted). The P50 is shown only as a number.
- **Evidence:** Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-odcplay-1280-light.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-odcplay-390-dark.png.
- **Fix:** Add a rotated 'SaO₂ %' axis title, a two-item legend ('normal' dashed, 'this scenario' solid), and a small tick at 50% with P50 marks on both curves.

### T16-25 · e3.js · W.kidney frame() particles
- **What:** Particle labels overflow their 24 px discs ('HCO₃⁻' and 'H₂PO₄' measure 25.6 px at 8.5 px), and the phosphate labels lack charges ('HPO₄', 'H₂PO₄'). In the collecting duct, Cl⁻ and HCO₃⁻ start together at AE1 and overlap exactly, and particles often hide the 'CA' label.
- **Evidence:** measureText in the page. Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-kidney-dist-t4.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-kidney-1280-light.png.
- **Fix:** Use radius 14 or 'HCO₃' without the charge at 8 px, label the phosphates 'HPO₄²⁻' and 'H₂PO₄⁻', offset the Cl⁻ path by 10 px vertically, and draw the CA disc after the particles or route particles around it.

### T16-26 · e3.js · W.kidney spawn() collecting duct CO₂ path
- **What:** The CO₂ particle enters from the blood by passing through the AE1 transporter mark, which suggests that CO₂ uses AE1. CO₂ diffuses across the membrane.
- **Evidence:** Code: CO₂ pts [[w-24,h*0.75], g.bl, g.ca], where g.bl is the AE1 position. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-kidney-dist-t1.png.
- **Fix:** Route CO₂ through [g.C1, h*0.72] (away from the transporter).

### T16-27 · e3.js · W.kidney stats() proximal 'Urine pH'
- **What:** Proximal baseline 'Urine pH: Set further down' is unclear as a stat value.
- **Evidence:** Proximal tubule view, no toggles.
- **Fix:** Use 'Set in the collecting duct' or '— (set distally)'.

### T16-28 · e3.js · W.kidney spawn() with Acetazolamide
- **What:** With acetazolamide the disc shows 'CA ✕', yet H⁺ particles still emerge from it and go to NHE3 at full rate. CA II inhibition lowers H⁺ supply to NHE3 too.
- **Evidence:** Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T16-kidney-prox-aceta.png.
- **Fix:** Spawn the H⁺ only every other cycle when f.aceta, or start it faded, and add the line 'Less H⁺ is made in the cell, and luminal CA IV is blocked, so filtered HCO₃⁻ is not reclaimed.'

## Ideas
### T16-29 · e3.js · W.vq: make it cover the hypox lesson's five causes
- **What:** The lung model is embedded in hypox, but it cannot show low PiO₂, hypoventilation or diffusion limitation, three of the five causes in that lesson.
- **Evidence:** openLesson('hypox'): the model has only qb/vb/shunt/dead/FiO₂ sliders.
- **Fix:** After the conservation fix add a minute-ventilation slider (2–15 L/min), a barometric pressure/altitude preset (uses PB in PiO₂), and presets 'Opioid hypoventilation' and 'Altitude 3,000 m' that show a normal A–a. A diffusion limitation is optional (end-capillary equilibration factor).

### T16-30 · e3.js · W.kidney: urine anion gap and type 2 RTA
- **What:** The rta lesson is about the urine anion gap, but the model never shows it, and there is no type 2 RTA toggle (only 'acetazolamide, like type 2').
- **Evidence:** openLesson('rta').
- **Fix:** Add a 'Urine anion gap' stat (negative / positive) driven by NH₄⁺, and a 'Type 2 RTA' toggle in the proximal view (reclaim threshold falls; urine pH > 5.5 until plasma HCO₃⁻ drops to about 15–18, then < 5.5 again: show both phases).

### T16-31 · e3.js · W.odcplay: compare to baseline
- **What:** The stats show only the shifted state, so the learner must remember the normal values to see the change.
- **Evidence:** Stats '36.3 / 94% / 56% / 37%' with no reference.
- **Fix:** Show each stat as 'new (normal)', e.g. 'O₂ unloaded 37% (22%)', with a ↑/↓ arrow; colour the change.

### T16-32 · e3.js · W.dav: predict-then-play
- **What:** Davenport journeys are passive.
- **Evidence:** —
- **Fix:** Add a 'Where will it land?' mode: after B, the learner taps the map to predict C, then Play reveals the true C with the expected band (Winter's ± 2) drawn as a bracket. Mixed: show Winter's expected 30 ± 2 next to the actual 55.

### T16-33 · e3.js · W.dav controls
- **What:** Play never becomes Pause/Replay, there is no step back, and choosing a disorder doesn't start it.
- **Evidence:** —
- **Fix:** Toggle Play → Pause while running and → Replay at the end, add '◀ Step', and auto-play on disorder change unless reduced motion is on.

### T16-34 · e3.js · W.vq: A–a on oxygen and iso-shunt inset
- **What:** The A–a stat is hidden ('on O₂') whenever FiO₂ > 21%, which removes useful teaching in the ARDS/icu-ards context.
- **Evidence:** Shunt preset + FiO₂ 95: 'on O₂'.
- **Fix:** Show the A–a on oxygen with a caption 'normal rises with FiO₂'. Add a small PaO₂-vs-FiO₂ inset for the current shunt fraction (iso-shunt line), the clearest picture of 'oxygen fixes V/Q, not shunt'.

### T16-35 · e3.js · animated models: pause when offscreen
- **What:** Kidney animation keeps running at 60 fps while scrolled out of view inside a long lesson (it only pauses when its view is hidden).
- **Evidence:** rAF count 60/s while running.
- **Fix:** Use an IntersectionObserver to pause the kidney loop when the canvas is not visible (helps battery on the Steam Deck and phones).

### T16-36 · e3.js · accessibility of canvases
- **What:** Canvas states are not announced. The Davenport steps list is not aria-live, and the kidney animation has only a generic aria-label.
- **Evidence:** —
- **Fix:** Make the Davenport list aria-live='polite' and update the kidney canvas aria-label with the current segment and conditions (e.g. 'Collecting duct, type 1 RTA: H⁺ pump fails, urine pH above 5.5').
