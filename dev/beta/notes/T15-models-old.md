# T15: Original interactive models (e2.js)
## Summary
I tested the ten original models (map, hh, phh, odc, rbc, o2c, alv, comp, agc, sid) in the frozen 4.9.0 copy. They ran in the Labs view and inside the 11 lessons that mount them (ph, hh, ventchg, ca, rbc, odc, o2content, alv, comp, nderived, stewartx), at 390×844 (pixel skin, dark and light, reduced motion) and at 1280×800 (clinical skin, light and dark). I also exercised the arithmetic through the live DOM with a script and checked it by hand.
**The core maths is right.** I confirmed these by hand:
- the Henderson–Hasselbalch relations, Kassirer–Bleich and the 80 rule;
- Winter's and the 0.7+20 rule;
- the 1/4 and 2/5 respiratory rules, and the Davenport bands built from them;
- the Hill curve at n = 2.7 with P50 26.8 (90% at 60 mmHg, 75% at 40), with Bohr −0.48/pH and temperature 0.024/°C;
- CaO₂ = 1.34·Hb·S + 0.003·PaO₂ and DO₂ = CO × CaO₂ × 10;
- PiO₂ and PAO₂, with the altitude pressures for Riyadh, Abha and an aircraft cabin;
- AG, AG corrected for albumin, the Δ ratio and the UK osmolar gap;
- Figge albumin⁻ and phosphate⁻, SIDa, SIDe and SIG.
**The main problems are interpretive guard-rails and canvas layout, not formulas:**
- the compensation calculator calls wrong-direction gases 'appropriately compensated';
- the A–a verdict says 'normal' above the limit it displays;
- the seesaw draws its labels and raised pan off-canvas;
- AG with a normal HCO₃⁻ misses the hidden metabolic alkalosis.
No JavaScript errors and no horizontal overflow at any viewport. The rbc animation runs at 60 fps and respects reduced motion (though its still frame leaves out H⁺).
**Score: 7/10.**
Counts: critical 1, major 5, minor 15, polish 13, ideas 6.

## Critical

**T15-1** · `e2.js` · W.comp run()
- What: The compensation calculator does not check that the numbers fit the chosen primary disorder, so it says a gas is 'Appropriately compensated' when it is wrong. With 'Metabolic alkalosis' selected, HCO₃⁻ 12 and PCO₂ 26 (a metabolic acidosis, pH 7.29) give 'Expected PCO₂ 23.4–33.4 mmHg' and 'Appropriately compensated'. With 'Metabolic acidosis', HCO₃⁻ 30 and PCO₂ 40 give 'Expected PCO₂ 51–55' and 'added respiratory alkalosis' at pH 7.50.
- Evidence: Headless 1280×800: openTool('m-comp'), select malk and leave 12/26, then output 'Appropriately compensated · pH 7.29'. Select mac with 30/40, then 'PCO₂ too low → added respiratory alkalosis · pH 7.50'.
- Fix: Before applying the rule, check the direction: mac needs HCO₃⁻ < 22 (and pH ≤ 7.45), malk needs HCO₃⁻ > 26, rac needs PCO₂ > 45, ralk needs PCO₂ < 35. If the check fails, show 'These numbers are not a <disorder>: HCO₃⁻ 12 is low' and leave out the band. You could also preselect the disorder from interp() and let the learner override it.

## Major

**T15-2** · `e2.js` · W.comp run() (rac/ralk)
- What: With respiratory acidosis or alkalosis selected, the verdict is copied from interp()'s 'comp' step for whatever the gas really is. With the defaults (HCO₃⁻ 12, PCO₂ 26) and 'Respiratory acidosis' selected, it shows 'Expected HCO₃⁻ acute ≈ 22.6, chronic ≈ 18.4' (it treats a PCO₂ of 26 as acidosis) and 'Appropriate respiratory compensation'. Those words describe the metabolic acidosis and are nonsense for the disorder the learner picked.
- Evidence: openTool('m-comp'), select 'rac' and leave the defaults. Readout: 'HCO₃⁻ acute ≈ 22.6, chronic ≈ 18.4 · Appropriate respiratory compensation · pH 7.29'.
- Fix: Use the same direction check as for mac and malk. For rac and ralk, work the verdict out locally: within ±2 of acute means acute; within ±2 of chronic means chronic; between them means acute-on-chronic or partly compensated; above or below means added metabolic alkalosis or acidosis. Show the ranges (for example 'acute 26 ±2') as for mac and malk.

**T15-3** · `e2.js` · W.alv run() verdict
- What: The A–a verdict allows 5 mmHg above the expected value, so it contradicts its own readout and the app's standard (A–a ≤ age/4+4). At age 40 with PaO₂ 82, the readout shows A–a 18 and 'Expected ≤ 14', but the verdict says 'Normal gradient.' With PaCO₂ 60 and PaO₂ 60 (A–a 15) it says 'normal gradient: hypoventilation'.
- Evidence: openTool('m-alv'), set PaO₂ to 82. Readout: 'A–a=18 | Expected A–a=≤ 14 || Normal gradient.'
- Fix: Use `aa<=ex` for 'Normal', or add an explicit 'borderline (within 5 of the limit)' band that states the limit. Either way, the verdict must not say 'normal' while the readout shows A–a above the 'Expected' value.

**T15-4** · `e2.js` · W.hh draw() pan()
- What: The seesaw pans and their labels are drawn off the top of the canvas. The label sits at y = cy − 2r − 10 = 96 − 98, which is above the canvas, so 'HCO₃⁻ 24' and '0.03×PCO₂ ×20' never show at the default. On the DKA and Vomiting presets the raised ball is cut in half and its label is missing. This model is the centrepiece of lessons hh and ventchg.
- Evidence: Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-hh-DKA.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-hh-Vomiting.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-hh-desk-light-clinical.png (no pan labels at Normal).
- Fix: Make the canvas taller (about 230) and set cy to about 140, or cap the ball radius at about 30 and place the label beside the ball instead of above it. Then check that the label stays inside the canvas at ang = ±0.42.

**T15-5** · `e2.js` · W.hh pan() radius
- What: The ball sizes saturate. r = min(44, √val×9) reaches the cap at val ≥ 24, so at normal both balls are already at maximum size and in alkalosis (HCO₃⁻ 40 against 30) they look identical. Only the tilt shows the imbalance, which undercuts the 'weights' metaphor.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-hh-Vomiting.png: both balls are the same size.
- Fix: Scale the balls from a shared range, for example r = 14 + 26×val/50 (val from 0 to 50), so that 24 against 24 is mid-sized and 40 against 30 looks visibly different.

**T15-6** · `e2.js` · W.agc run() verdict
- What: When the corrected AG is high but HCO₃⁻ is ≥ 24, the Δ ratio is shown as '—' and the verdict is just 'High anion gap.' That combination is the classic sign of a coexisting metabolic alkalosis (a 'hidden' HAGMA, for example vomiting plus DKA), and it is a favourite exam point.
- Evidence: Na 140, Cl 100, HCO₃⁻ 28, Alb 30: 'Corrected AG=14.5 | Δ ratio=— || High anion gap.'
- Fix: If agc > 14 and h ≥ 24, add: 'High AG with normal or high HCO₃⁻: a metabolic alkalosis is masking an acidosis (Δ ratio not meaningful).'

## Minor

**T15-7** · `e2.js` · W.agc run() Δ ratio bands
- What: The Δ ratio bands differ from the standard teaching. 0.8–1 is folded into 'pure HAGMA', although sources treat 0.8–1 as 'pure HAGMA, typical of DKA with ketone loss' and <0.8 as combined. More importantly, '> 2' names only metabolic alkalosis and leaves out the other recognised cause, pre-existing compensated respiratory acidosis.
- Evidence: LITFL 'Delta ratio' (https://litfl.com/delta-ratio/): <0.4 hyperchloraemic NAGMA; 0.4–0.8 combined; 0.8–2 uncomplicated HAGMA (lactic ~1.6, DKA ~1); >2 HAGMA plus metabolic alkalosis or pre-existing compensated respiratory acidosis.
- Fix: Change the '>2' text to 'HAGMA + metabolic alkalosis (or chronic respiratory acidosis)', and optionally add '(DKA often ~1, lactate ~1.6)' to the 0.8–2 band.

**T15-8** · `e2.js` · W.agc run()
- What: Blank Na, Cl or HCO₃⁻ fields are read as 0, which gives AG 0, Δ ratio −0.40 and 'Normal anion gap.' as if valid. The Δ ratio is also shown (for example 0.15) when the AG is normal and the ratio has no meaning.
- Evidence: Clear Na, Cl and HCO₃⁻: 'AG=0 | Corrected AG=2.5 | Δ ratio=-0.40 || Normal anion gap.' Na 140, Cl 115, HCO₃⁻ 14: 'Δ ratio=0.15 || Normal anion gap.'
- Fix: If a required field is blank, show '—' and 'Enter Na⁺, Cl⁻ and HCO₃⁻'. Show the Δ ratio only when agc > 14 and h < 24, otherwise '—'. When the AG is normal and HCO₃⁻ < 22, say 'Normal AG metabolic acidosis (NAGMA)' instead of just 'Normal anion gap'.

**T15-10** · `e2.js` · W.sid run()
- What: A blank field is read as 0. A blank pH makes albumin⁻ = −0.631×alb, so SIDe becomes −3 and SIG 48.2 with the verdict 'unmeasured anions', which is a confident wrong answer.
- Evidence: Clear the pH field: 'SIDe=-3 | SIG=48.2 || SIG 48.2: unmeasured anions.'
- Fix: If pH, Na, Cl or HCO₃⁻ is blank (or pH is outside 6.8–7.8), show '—' and ask for the value. Default K, Ca, Mg, lactate and phosphate to typical normals rather than 0, and say so in the note.

**T15-12** · `e2.js` · W.alv run() FiO₂ input
- What: FiO₂ is not validated. Typing 21 (a percentage, a common habit) gives PiO₂ 14973 and P/F 4 with no warning. FiO₂ > 1 or < 0.21 is accepted silently.
- Evidence: Set FiO₂ to 21: 'PiO₂=14973 | PAO₂=14923 | A–a=14841 … P/F = 4'.
- Fix: If f > 1, treat it as a percentage (f/100) and show 'read as 21%'. Clamp to 0.21–1.0 and add min/max attributes to the input.

**T15-13** · `e2.js` · W.alv / W.comp / W.hh / W.map units
- What: The models ignore the kPa setting. With S.units='kPa', the alv and comp labels still say mmHg and the map sliders stay in mmHg, but the isobar labels on the map switch to kPa ('lines: PCO₂ kPa'). The result is two unit systems on one model.
- Evidence: Set S.units='kPa', then open m-alv: labels 'PaCO₂ mmHg | PaO₂ mmHg'. m-map shows mmHg sliders with isobars labelled 5.3, 8.0 and so on.
- Fix: Accept and display kPa in alv and comp when S.units==='kPa' (convert internally with KPA), or at least label the map isobars to match the slider units.

**T15-14** · `e2.js` · W.comp run() blank input
- What: Blank HCO₃⁻ and PCO₂ fields give 'Expected PCO₂ 6–10 mmHg' and 'pH NaN'.
- Evidence: Clear both fields: 'PCO₂ 6–10 mmHg (Winter's) || PCO₂ too low → added respiratory alkalosis · pH NaN'.
- Fix: Return early with 'Enter HCO₃⁻ and PCO₂' when either field is blank or ≤ 0.

**T15-15** · `e2.js` · W.map draw() / drawMap
- What: When the point falls off the plotted range (pH < 6.95 or > 7.75, or HCO₃⁻ > 50), the dot is clipped out of view with no indication. The text line then reads 'pH 6.06 → ' with nothing after the arrow, because interp returns an error label.
- Evidence: m-map with PCO₂ 110 and HCO₃⁻ 3: '… pH 6.06 → ' and no dot.
- Fix: Clamp the dot to the edge with an arrow marker ('off the map'), and show 'outside the plotted range' instead of an empty label. Also clamp the slider combination, or widen X0 to 6.8.

**T15-16** · `e2.js` · drawMap legend
- What: The small-screen legend is added once when the canvas is under 560 px, but it is never removed when the canvas becomes wider. After a phone-to-desktop resize (or rotating a tablet) the in-canvas labels and the HTML legend both show.
- Evidence: Open m-map at 1280, resize to 390 and back to 1280: document.querySelectorAll('#v-tool .mlegend').length === 1, and the in-canvas labels are drawn too.
- Fix: Always create the legend and toggle its display with w<560, or remove it when w ≥ 560. Do not rely on cv.nextElementSibling.

**T15-17** · `e2.js` · W.map note
- What: The note calls the shaded regions '95% bands from the classic rules'. They are not confidence bands: they are the rules with fixed ± margins (Winter ±2, met alk ±5, and ±2 mmol/L HCO₃⁻ added arbitrarily for the respiratory rules). The note also implies that a point inside a band is a single disorder, which is not true (a mixed disorder can sit inside a band by chance).
- Evidence: e2.js line 69. The respiratory bands use e±2, which has no source.
- Fix: Reword to: 'Each band is where a single disorder with expected compensation usually lands (rule ± its usual margin). Outside every band means mixed; inside a band is consistent with a single disorder but does not exclude a mixed one.' Cite the band source (for example Albert/Winter 1967; Brackett and Cohen for the respiratory slopes).

**T15-21** · `e2.js` · W.rbc frame(still) / reduced motion
- What: With prefers-reduced-motion, the static frame leaves out H⁺. The spawn(n−1200) and spawn(n−2600) offsets put the H⁺ particle either in the future or expired. The still picture therefore shows CO₂, HCO₃⁻, Cl⁻ and O₂ but not the ion that the Bohr step (step 4) is about.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-rbc-phone-dark-pixel.png (context with reducedMotion='reduce').
- Fix: For the still frame, draw a fixed snapshot: one particle per step placed at its labelled position (CO₂ entering, H⁺ on Hb, HCO₃⁻ at band 3, Cl⁻ entering, O₂ leaving), with arrows. Do not reuse spawn() timing.

**T15-22** · `e2.js` · W.rbc frame() performance
- What: Every animation frame calls fitCanvas(), which resets canvas.width and canvas.height (reallocating and clearing the backing store), and about 15 getComputedStyle() calls through tok(). The animation also keeps running when the lesson card is scrolled off-screen (only offsetParent===null pauses it). It reaches 60 fps on this machine, but it wastes battery on phones and the Steam Deck.
- Evidence: e2.js lines 128–140. Measured 60.5 fps in headless at 1280.
- Fix: Size the canvas only on resize (onRz) and cache the token colours once per build (and on theme change). Pause with an IntersectionObserver when the card is out of view.

**T15-25** · `e2.js` · W.rbc STEPS (physiology)
- What: The tissue sequence leaves out carbamino CO₂: about 10% of CO₂ binds Hb as carbamino, and deoxy-Hb binds more of it (the Haldane effect in tissues). The lung sequence mentions carbamino release, but the tissue sequence never shows it being formed, so the two halves are not symmetrical.
- Evidence: STEPS.t (e2.js line 112) vs STEPS.l step 2.
- Fix: Add the tissue step 'Some CO₂ binds deoxy-Hb directly as carbamino-Hb; deoxy-Hb also takes up more H⁺ (Haldane effect).' Optionally add a CO₂→Hb particle path.

**T15-26** · `ui3.js` · MODELS 'odc' description
- What: The Labs tile says 'Shift it with pH, CO₂, temperature and 2,3-DPG; add CO.' The model has no CO₂ control, and it names the molecule '2,3-BPG', so the tile and the model use different names.
- Evidence: ui3.js line 62. The model's controls are pH, Temperature, 2,3-BPG, COHb and Mark a PO₂.
- Fix: Change the tile text to 'Shift it with pH, temperature and 2,3-BPG; add carbon monoxide.' Or add a PCO₂ slider that acts through pH (Bohr) with a note.

**T15-34** · `e2.js` · all canvases / theme
- What: The canvases read colours once, when they are drawn. If the theme is 'auto' and the OS switches light or dark while a model is open, the map, odc, o2c and the other models keep the old palette until a slider moves (the rbc animation updates only because it redraws every frame). Verified in the source: ui3.js line 202 calls applyTheme() but nothing redraws the models.
- Evidence: ui3.js line 202; e2.js has no theme listener.
- Fix: Dispatch a 'buffer:theme' event in applyTheme(), and have each W.build register its draw function on it (as onRz does).

**T15-35** · `e2.js` · all models: accessibility
- What: The readouts update silently. Screen-reader users get no announcement of pH, the verdict or the gaps, and the canvases have static aria-labels that never describe the current state (for example where the dot is on the map).
- Evidence: No aria-live on .readout or .verdict-line in e2.js.
- Fix: Add aria-live='polite' to the verdict line or the main readout of each model, and update each canvas's aria-label in draw() (for example 'Point at pH 7.22, HCO₃⁻ 24: acute respiratory acidosis band').

## Polish

**T15-9** · `e2.js` · W.agc verdict string
- What: There is double punctuation: 'Osmolar gap raised: toxic alcohol?.'
- Evidence: Default agc verdict: 'High anion gap; Δ 0.8–2: pure HAGMA. Osmolar gap raised: toxic alcohol?.'
- Fix: Add the final full stop only when the text does not already end in '?' (or change the phrase to '…: consider a toxic alcohol').

**T15-11** · `e2.js` · W.sid verdict / labels
- What: The verdict starts in lower case ('low SIDa (acidifying)…'). The readouts have no units (mEq/L). The Mg²⁺ field does not say whether it means ionised or total magnesium (labs usually report total, 0.7–1.0), whereas Ca²⁺ is labelled 'Ionised'.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-sid-desk-light-clinical.png
- Fix: Capitalise the first letter of the verdict. Add 'mEq/L' to the SIDa, SIDe, SIG and Na−Cl tiles. Relabel the field 'Mg²⁺ (ionised; total × ~0.7)' or state which one the formula expects.

**T15-18** · `e2.js` · MAPB lab positions
- What: Several band labels sit outside their band. 'Acute resp acidosis' at (7.04, 30) is left of the band, which ends near pH 7.07. 'Chronic resp alkalosis' at (7.5, 10) is below the band, whose minimum is HCO₃⁻ ≈ 11 at PCO₂ 18. 'Acute resp alkalosis' (7.62, 17) and 'Met alkalosis' (7.5, 42) sit on the band edges.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-map-desk-light-clinical.png
- Fix: Work out each label position from the band's midpoint, for example acute resp acidosis at PCO₂ 80 gives (7.13, 28); chronic resp alkalosis at PCO₂ 25 gives (7.53, 16.5). Alternatively, draw each label with a leader line.

**T15-19** · `e2.js / shell.html` · drawMap normal box
- What: The normal box (pH 7.35–7.45, HCO₃⁻ 22–26) uses --good-soft, which is #1C2A0B in dark mode and is invisible under the bands. It also has no label or legend entry.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-map-phone-dark-pixel.png
- Fix: Draw the box with a 1.5 px --good stroke and a small 'normal' label, and add 'Normal' to the .mlegend.

**T15-20** · `e2.js` · drawMap isobar labels
- What: On a phone the isobar labels '100' and '80' crowd together near the top. The 'lines: PCO₂ mmHg' caption overlaps the metabolic acidosis band at the bottom left.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-map-phone-dark-pixel.png
- Fix: Under 560 px, skip the 100 label (or place labels along the top edge with a minimum spacing). Move the caption below the axis, next to 'pH'.

**T15-23** · `e2.js` · W.rbc build() listener
- What: Each build adds a window 'buffer:show' listener that is never removed, so the listeners pile up as lessons and tools are reopened.
- Evidence: e2.js line 127, addEventListener('buffer:show',…) with no removal.
- Fix: Remove the listener when the canvas is disconnected (inside frame's early return), or register it with { once:false, signal } through an AbortController that is aborted on disconnect.

**T15-24** · `e2.js` · W.rbc drawing
- What: The labels 'HCO₃⁻' and 'Cl⁻' crowd the band 3 marker and its 'band 3' label at phone width. On desktop the 'band 3' caption overlaps the cell outline. Particle text such as 'HCO₃⁻' at 9 px is wider than the 11 px circle.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-rbc-phone-dark-pixel.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-rbc-desk-light-clinical.png
- Fix: Put the 'band 3' label outside the cell (to the right, or above the marker). Make the particle radius fit the text (measureText + 4) or use pill shapes.

**T15-27** · `e2.js` · W.odc canvas
- What: The 'dashed = normal' caption at (ml+6, sy(0.06)) is crossed by the curve's foot. The y axis has no title (SO₂ %). When nothing is shifted, the dashed normal curve is completely hidden under the accent curve, so the caption points at nothing.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-odc-desk-light-clinical.png
- Fix: Move the caption to the bottom-right area (for example P = 80, sat = 0.2). Add a rotated 'SO₂ %' axis title. Draw the normal curve after the shifted curve, or offset it, so that it shows when the two are identical.

**T15-29** · `e2.js` · W.o2c canvas
- What: The thin dissolved-O₂ segment (--b5) has no label or legend; only 'Bound to Hb' is labelled. The 'normal ≈ 20' marker sits exactly at the end of the default bar, so the two merge. At Hb 20 with PaO₂ 600 the bar (28.6) overruns the 0–28 track.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-o2c-phone-dark-pixel.png. o2c_max CaO₂ 28.1 + dissolved 1.8.
- Fix: Add a right-aligned 'Dissolved' label with a small swatch. Make the scale max 30. Draw the normal marker as a dashed line above the bar instead of over it.

**T15-30** · `e2.js` · rng() outputs (o2c, odc)
- What: The slider outputs show bare numbers (15, 98, 95, 5 in o2c; 7.4 and 37 in odc), and pH shows '7.4' instead of '7.40'. The units are only in the labels, which wrap separately on narrow phones.
- Evidence: o2c output text '15 / 98 / 95 / 5'; odc pH output '7.4'.
- Fix: Format the outputs with units and fixed decimals: '15.0 g/dL', '98%', '95 mmHg', '5.0 L/min', 'pH 7.40', '37.0 °C'.

**T15-31** · `e2.js` · W.alv / W.comp readouts
- What: The PiO₂, PAO₂ and A–a tiles have no units, and A–a shows '≤ 14' without 'mmHg'.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-alv-phone-dark-pixel.png
- Fix: Append ' mmHg' (or kPa) to the PiO₂, PAO₂, A–a and Expected values.

**T15-32** · `e2.js` · W.hh output
- What: The HCO₃⁻ slider output shows '24' with no unit, while PCO₂ shows '40 mmHg (5.3 kPa)'. On desktop the clinical skin wraps the PCO₂ label onto two lines ('PCO₂ / (mmHg)' and '40 mmHg (5.3 / kPa)').
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-hh-desk-light-clinical.png
- Fix: Show the HCO₃⁻ output as '24 mmol/L'. Shorten the PCO₂ output to '40 (5.3 kPa)' as the map does, or give .ctrl label flex-wrap so the output moves to its own line.

**T15-33** · `e2.js` · W.phh canvas
- What: The normal band (35.5–44.7 nmol/L, --good-soft) is drawn under the orange fill, so at pH 7.40 it is fully hidden, and in dark mode it is invisible anyway.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T15-phh-phone-dark-pixel.png
- Fix: Draw the normal band after the fill as an outlined bracket above the bar, labelled 'normal 35–45'.

## Ideas (ranked by value)

**T15-28** · W.odc: When COHb > 0, add a 'Pulse oximeter (SpO₂) would read' tile showing (O₂Hb+COHb)/total, about 1 − 0 at the mark. This teaches the classic CO trap: normal SpO₂ with a low true O₂ content. Fix: Show SpO₂ ≈ hill(pm,p50,1−co)×100 + co×100 (capped at 100) beside 'Sat at mark', with the note 'co-oximetry needed'.

**T15-36** · W.comp + W.map (lesson comp): In lesson 'comp' the calculator and the acid–base map are mounted one under the other but are not linked: the calculator's 12/26 is not plotted on the map below. Fix: When both are mounted in the same lesson, plot the calculator's gas on the map (with the expected-band segment highlighted), or add a 'Show on map' button that sets the map sliders.

**T15-37** · W.o2c: SaO₂ and PaO₂ are independent sliders, so physiologically impossible pairs (PaO₂ 600 with SaO₂ 50%) are allowed and nothing is said about it. Fix: Add a 'Link SaO₂ to PaO₂ (normal curve)' toggle, on by default, that uses the same Hill function as W.odc. Turning it off lets the learner model CO or haemoglobinopathies.

**T15-38** · W.alv: Add a custom barometric pressure or altitude option and an R (respiratory quotient) field. It would also help to show the working (PiO₂ = FiO₂ × (Pb − 47); PAO₂ = PiO₂ − PaCO₂/0.8) with the user's numbers filled in, for exam practice. Fix: Add a 'Custom (mmHg)' option and a collapsible 'Show working' line.

**T15-39** · W.agc: Add an optional ethanol field to the osmolar gap (calculated osm + EtOH mmol/L), plus a lactate tile. A raised OG is otherwise often explained by ethanol in ED patients. Fix: Add an 'Ethanol (mmol/L)' input. When OG > 10 and ethanol is blank, say 'check ethanol before blaming a toxic alcohol'.

**T15-40** · W.hh: Add a 'predict first' mode: before a preset reveals its result, ask the learner which way the seesaw tips and roughly what the pH is. The Labs header already says 'Predict the result before you move a slider'. Fix: Presets reveal pH and the tilt only after a guess (tap acid, normal or alkali), and the guess is logged to the XP and progress system.
