# T14 · Labs bedside tools and Labs page

## Summary

Covered: the Labs page (tile list, counts, descriptions, icons, teaching-only banner on every tool view) and the eight bedside tools in ui3.js — Venous → arterial, Oxygenation, Urine gaps, Henderson check, Ventilator CO₂, Bicarbonate and sodium, Unit converter, Pocket card (screen and A4 print via page.pdf). Tested at 390×844, 820×1180 and 1280×800, dark/pixel and light/clinical, mmHg and kPa, with blank, zero, negative, huge and decimal-comma inputs (en-US and de-DE).

Formulas and constants check out: venous→arterial (+0.03, −5, −1), the alveolar gas equation with 760/707/580 mmHg (Riyadh ≈ 610 m and Abha ≈ 2,270 m are right), Berlin bands, S/F 315/235 (Rice 2007), urine AG and urine osmolal gap (2(Na+K)+urea+glucose, NH₄⁺ ≈ gap ÷ 2), the CO₂/alveolar-ventilation equation (new RR = RR × PaCO₂/target; new VT = (VT−VD) × PaCO₂/target + VD), bicarbonate deficit 0.5 × wt × Δ, Katz 1.6 / Hillier 2.4 per 5.6 mmol/L, 50 mmol HCO₃⁻ ≈ 1.1 L CO₂, 1.26% = 150 mmol/L, and every unit factor (7.50062, 18.016, 2.801, 88.42, 9.008, 0.1, 4.008, 2.431, 10^(9−pH)). Byrne 2014 limits (−20 to +30 mmHg) are quoted correctly.

The weak spot is input handling: readouts stay stale after a cleared or invalid input, a decimal comma silently makes values 10× off, and impossible values give confident clinical text. A few verdicts are wrong or misleading (no data → 'within normal limits'; Na⁺ 140 → 'dilution by glucose'), kPa mode leaks mmHg into verdicts, and the pocket card prints on two pages.

Findings: 0 critical, 5 major, 15 minor, 16 polish, 7 ideas. **Score: 6.5/10** (sound maths, fragile inputs).

Screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-*.png; raw results: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/r1.json, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/r2.json; print renders: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/dk-1.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/pdf-1.png.


## Major

**T14-1** · `ui3.js` · TOOLFN.vbg / oxy / hh / vent / bicarb (wire callbacks)
- What: Stale results: when an input is cleared or invalid, the run() callbacks return early without resetting the readouts, so the previous result stays on screen as if it were current.
- Evidence: VBG: clear Venous pH -> verdict says 'Enter at least pH and PCO₂' but readouts still show Arterial pH 7.34, PaCO₂ 47, Read 'Acute respiratory acidosis'. Oxygenation: type FiO₂ 40 -> error line, but PAO₂ 107, A–a 39, P/F 324 stay. Henderson check: clear HCO₃⁻ after an inconsistent entry -> '-37% Inconsistent' stays. Ventilator: dead space 500 > VT 450, or clear rate -> old 21/min, 550 mL stay with no message. Bicarbonate: clear weight -> 245 mmol stays; clear Na⁺ -> old corrected Na⁺ and verdict stay. (Playwright run, results in /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/r1.json)
- Fix: Add a helper clearRO(u,[ids]) that sets every readout to '—' and call it at the top of each run() (or in every early-return branch). Also show a reason in the verdict line for each early return (e.g. 'Dead space must be smaller than VT', 'Enter weight').

**T14-2** · `ui3.js` · all TOOLFN number inputs (num() from e2.js, read via tv())
- What: Decimal comma is silently dropped: typing '5,3' into a type=number input yields value '53' in Chromium (en-US and de-DE locales), so results are 10× off with no warning. parseGas already accepts commas but the tools do not.
- Evidence: Unit converter: type 5,3 in kPa -> kPa box '53', mmHg '397.5'. Henderson check: type pH 7,10 -> value 710, '[H⁺] 0 nmol/L', 'Difference +Infinity%', 'HCO₃⁻ that fits Infinity'. Ventilator: current PaCO₂ 6,5 -> 65 mmHg -> new rate 23/min. (r2.json: de_comma, en_hh_comma, en_vent_comma)
- Fix: Use type=text inputmode=decimal for tool inputs (or keep number but intercept keydown ',' and insert '.'), and parse with String(v).replace(',', '.'). Reject values that fall outside the plausible range (see range finding) so a lost separator is caught.

**T14-3** · `ui3.js` · TOOLFN.* input handling
- What: No plausibility limits on any tool input, although the interpreter documents limits (pH 6.5–8.0, PCO₂ 5–200 etc.). Impossible inputs produce confident clinical text.
- Evidence: Oxygenation PaO₂ −50 -> 'P/F -238: severe range (Berlin…)'. VBG PvCO₂ −50 -> 'PaCO₂ ≈ 10 mmHg' and 'PvCO₂ ≤ 45: arterial hypercapnia is unlikely'; pH 14 -> 'Arterial pH ≈ 14.03'; HCO₃⁻ 0 -> 'HCO₃⁻ ≈ -1'; SpO₂ 150 -> 'SpO₂ 150%: oxygenation acceptable'. Ventilator target −20 -> 'New rate -48 /min', 'or new VT -750 mL'. Henderson pH 0 -> '[H⁺] 1000000000 nmol/L'; HCO₃⁻ −15 -> '-48 nmol/L'. Urine Na⁺ −40 accepted. Bicarbonate weight 700 kg -> 'give half 1225 mmol'. (r1.json)
- Fix: Define one LIMITS table (pH 6.5–8.0, PCO₂ 5–200 mmHg, PO₂ 10–700, HCO₃⁻ 1–70, SpO₂ 50–100, FiO₂ 0.21–1, age 0–120, weight 1–300 kg, Na⁺ 100–190, glucose 0–150, urine electrolytes 0–400, urine osm 30–1500, RR 4–60, VT 100–1500, dead space 0–500) and have tv() return null plus mark the field (aria-invalid, red border) and print 'Check <field>: outside a plausible range' in the verdict.

**T14-4** · `ui3.js` · TOOLFN.oxy verdict
- What: With no PaO₂ and no SpO₂ entered, the verdict reads 'Oxygenation within normal limits.' — false reassurance from no data.
- Evidence: Oxygenation: clear PaO₂ and SpO₂ -> verdict 'Oxygenation within normal limits.' (r1.json oxy_nopo2_nosp)
- Fix: If o==null && sp==null show 'Enter PaO₂ or SpO₂.' Only say 'within normal limits' when at least one oxygenation value was assessed and nothing flagged.

**T14-5** · `ui3.js` · TOOLFN.bicarb verdict
- What: Corrected-sodium verdict claims dilution even when measured Na⁺ is normal and glucose is normal: 'Corrected sodium in range: the low measured value is dilution by glucose.' It also mixes formulas (Hillier for 'high', Katz for 'low').
- Evidence: Bicarbonate: Na⁺ 140, glucose 5 -> 'Corrected sodium in range: the low measured value is dilution by glucose.' (r1.json bi_normal)
- Fix: Branch on measured Na⁺ and glucose: if glucose ≤ 5.6 say 'No glucose correction needed.' If measured Na⁺ < 135 and corrected ≥ 135 (state which formula) say 'Pseudo/translocational hyponatraemia from glucose.' Use one formula for both thresholds (or report 'between Katz and Hillier' when they disagree).


## Minor

**T14-6** · `ui3.js` · TOOLFN.oxy verdict (age blank)
- What: With age blank, exp is null and the test g>exp+5 becomes g>5, so any A–a above 5 mmHg is called 'raised', and the limit readout is '—'.
- Evidence: Oxygenation: clear Age, PaO₂ 68 -> verdict 'A–a raised: a lung problem…' while 'A–a upper limit' shows '—'. (r1.json oxy_noage)
- Fix: When age is null, either assume a stated default (e.g. say 'age not given; using ≤ 20 mmHg') or skip the A–a verdict and ask for age.

**T14-7** · `ui3.js` · TOOLFN.oxy verdict in kPa mode
- What: In kPa mode the P/F readout is in kPa but the verdict quotes the mmHg value.
- Evidence: Settings units kPa, PaO₂ 7 kPa on air -> readout 'P/F 33.3', verdict 'P/F 250: mild range'. (r2.json kpa_oxy_low)
- Fix: Print the verdict P/F in the same unit as the readout (and give Berlin bands as 40/26.7/13.3 kPa), or always show P/F in mmHg in both places with the unit.

**T14-8** · `ui3.js` · TOOLFN.vbg verdict in kPa mode
- What: VBG verdict hard-codes mmHg thresholds ('PvCO₂ > 45', '≤ 45') in kPa mode.
- Evidence: Settings kPa -> VBG verdict 'PvCO₂ > 45: possible hypercapnia' while inputs are 6.93 kPa. (r2.json kpa_vbg)
- Fix: Use P(45)+' '+PU() in the verdict and limits text (6.0 kPa).

**T14-9** · `ui3.js` · pIn() (kPa defaults)
- What: kPa default values show float artefacts in the input box, and the rounding expression is odd (r1(mm/KPA*10)/10 gives 2 decimals while step is 0.1).
- Evidence: Settings kPa, open Oxygenation -> PaCO₂ input shows '4.529999999999999'. (r2.json kpa_oxy _inputs)
- Fix: Use (mm/KPA).toFixed(1) (or toFixed(2) with step 0.01) for the kPa default value.

**T14-10** · `ui3.js` · TOOLFN.oxy (PaCO₂ blank, negative A–a)
- What: PAO₂ silently assumes PaCO₂ 40 when PaCO₂ is blank, and a negative A–a (physically impossible) is shown without comment and judged 'A–a normal'.
- Evidence: Clear PaCO₂ at Abha -> PAO₂ 62, A–a '-6', verdict 'A–a normal.' (r1.json oxy_noco2)
- Fix: Show 'assuming PaCO₂ 40' in the PAO₂ cell when blank. If A–a < −5 print 'Negative A–a: check FiO₂, altitude, sample (venous? air bubble?) or units.'

**T14-11** · `ui3.js` · TOOLFN.oxy FiO₂ field
- What: FiO₂ typed as a percentage (40) is rejected, and typing a manual FiO₂ leaves the device select on the old device (e.g. 'Room air' beside FiO₂ 0.5).
- Evidence: Type 40 in FiO₂ -> 'FiO₂ is a fraction from 0.21 to 1.0.' (plus stale readouts). Select NRB, then type 0.5 -> select still says NRB.
- Fix: Accept 21–100 and divide by 100 (show '= 0.40'). On manual FiO₂ input, set the device select to 'set'.

**T14-12** · `ui3.js` · TOOLFN.vbg (Shock option)
- What: Choosing 'Shock or poor perfusion' adds a sentence but the converted arterial values stay fully displayed, contradicting the tool's own Limits card ('do not convert').
- Evidence: Set Perfusion = Shock -> Arterial pH ≈ 7.34, PaCO₂ ≈ 47 still shown in full. (r1.json vbg_shock)
- Fix: When shock is selected, grey out or replace the three conversions with 'not reliable' and lead the verdict with the shock warning.

**T14-13** · `ui3.js` · TOOLFN.vbg SpO₂ verdict
- What: SpO₂ cut-off 92% calls 92–93% 'acceptable for most patients', but BTS O₂ guideline target for most acutely ill adults is 94–98% (88–92% only for hypercapnic risk). Wording 'check FiO₂, A–a needs an ABG' is unclear.
- Evidence: SpO₂ 92 -> 'oxygenation acceptable for most patients'. Source: BTS guideline for oxygen use in adults 2017 (Thorax 72:i1).
- Fix: Use <94: 'Below the usual 94–98% target (88–92% if at risk of hypercapnia). Oxygenation needs SpO₂ or an ABG, not the VBG.' ≥94: 'Within the usual target.' >98 on oxygen: 'Consider weaning O₂.'

**T14-14** · `ui3.js` · TOOLFN.urine verdict
- What: Urine AG of exactly 0 is called 'Positive'; borderline values (about −10 to +10) are interpreted as decisive.
- Evidence: Na 40, K 30, Cl 70 -> 'Urine AG 0' -> 'Positive urine AG: low ammonium excretion…'. (r1.json ur_ag0)
- Fix: Use three bands: < −10 negative, −10 to +10 'borderline: use the urine osmolal gap', > +10 positive (state source).

**T14-15** · `ui3.js` · TOOLFN.urine verdict order and conflict
- What: When urine Na⁺ < 20 the tool first interprets the UAG and only afterwards says it is unreliable; when the UAG and the osmolal gap disagree, nothing reconciles them.
- Evidence: Na 15, Cl 30 -> 'Positive urine AG: low ammonium excretion… Urine Na⁺ < 20: the urine AG is unreliable. Osmolal gap ≥ 150 …ammonium excretion is appropriate' — three sentences that contradict each other. (r1.json ur_lowna)
- Fix: Check reliability first; if unreliable, suppress the UAG interpretation. If UAG positive but UOG ≥ 150, add 'Unmeasured anions (ketones, hippurate) likely: trust the osmolal gap.'

**T14-16** · `ui3.js` · TOOLFN.vent tidal volume warning
- What: The VT warning is hard-coded to 8 mL/kg × 70 kg (560 mL); there is no height/sex input for predicted body weight, so a 155 cm woman (PBW ≈ 48 kg, 8 mL/kg ≈ 384 mL) gets no warning at 550 mL.
- Evidence: Code: nv>8*70. Default case suggests VT 550 mL with no comment. PBW (ARDSNet): men 50 + 0.91×(cm − 152.4), women 45.5 + 0.91×(cm − 152.4).
- Fix: Add Height and Sex fields, compute PBW, show VT in mL/kg PBW for current and suggested VT, and warn above 8 mL/kg PBW.

**T14-17** · `ui3.js` · POCKET() in kPa mode
- What: Formulas on the pocket card are mmHg-only but unlabelled; in kPa mode the normals switch to kPa while '[H⁺] = 24 × PCO₂ ÷ HCO₃⁻', Winter's '1.5 × HCO₃⁻ + 8 ± 2', '0.7 × HCO₃⁻ + 20 ± 5' and 'per 10' stay mmHg.
- Evidence: Settings kPa -> Pocket card: PaCO₂ '4.7 kPa–6.0 kPa' next to 'PCO₂ = 1.5 × HCO₃⁻ + 8 ± 2' with no unit. (r2.json kpa_pocket)
- Fix: Append '(mmHg)' to each formula and 'per 10 mmHg (1.3 kPa)'; in kPa mode add the kPa forms (Winter's: PCO₂ kPa = 0.2 × HCO₃⁻ + 1.1 ± 0.3; [H⁺] = 180 × PCO₂ kPa ÷ HCO₃⁻).

**T14-18** · `shell.html` · @media print / .pocket
- What: The 'one printable screen' pocket card prints on 2 A4 pages in a single column with large empty space and no title (print CSS hides .view-head).
- Evidence: page.pdf A4 of Pocket card -> 2 pages, single column, page 1 ends after 'Gaps' with ~30% blank. /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/dk-1.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/dk-2.png
- Fix: In @media print: .pocket{display:block;columns:2;column-gap:10mm;font-size:9pt} .pocket .card{padding:6px} and add a print-only header 'Buffer · blood-gas pocket card · printed dd/mm/yyyy'. Aim for one A4 side.

**T14-19** · `shell.html` · @media print (dark theme with background graphics)
- What: Print sets body colour to black but card backgrounds keep the dark-theme surface, so with 'Background graphics' on the text is black on near-black.
- Evidence: Dark theme, page.pdf(print_background=True) -> almost unreadable cards: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t14/pdf-1.png. Computed print styles: td colour rgb(0,0,0), card background rgb(22,17,13).
- Fix: In @media print set .card,.ro,.tbl td{background:#fff!important;color:#000!important} and eyebrow colour to a dark orange (#B4470B).

**T14-20** · `ui3.js` · TOOLFN.* readouts (accessibility)
- What: Readouts and verdict lines have no aria-live, so screen-reader users get no feedback after typing.
- Evidence: document.querySelector('#toolBody .verdict-line').getAttribute('aria-live') -> null
- Fix: Add aria-live='polite' to .verdict-line (and role='status').


## Polish

**T14-21** · `ui3.js` · TOOLFN.bicarb (no deficit)
- What: When current HCO₃⁻ ≥ target the result reads '0 mmol' and 'Give half ≈ 0 mmol (0 mL 8.4%)'.
- Evidence: HCO₃⁻ 20, target 15 -> '0 mmol (0 mL 8.4%)'. (r1.json bi_hgt)
- Fix: Show 'No deficit at this target' and '—'.

**T14-22** · `ui3.js` · TOOLFN.bicarb verdict (high corrected Na⁺)
- What: 'Corrected sodium is high: free-water deficit; avoid lowering sodium fast as glucose falls.' is confusing: as glucose falls measured Na⁺ rises; the risk is a fast fall in osmolality.
- Evidence: Na 150, glucose 40 -> that sentence.
- Fix: 'Corrected Na⁺ is high: a real free-water deficit. Measured Na⁺ will rise as glucose falls; aim for a slow fall in osmolality (JBDS HHS: 3–8 mOsm/kg/h).'

**T14-23** · `ui3.js` · TOOLFN.bicarb readout 'Give half'
- What: '123 mmol (123 mL 8.4%)' wraps mid-parenthesis on phone.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-bicarb-readout-phone.png
- Fix: Split into two readouts ('Give half ≈ 123 mmol' and '8.4% ≈ 123 mL'), or mark the cell .wide.

**T14-24** · `ui3.js` · TOOLFN.bicarb Before-you-give list
- What: BICAR-ICU entry criteria were pH ≤ 7.20 with AKIN 2–3 (the benefit was in that subgroup), not 'pH < 7.20 with AKI'.
- Evidence: Jaber S et al. Lancet 2018;392:31–40.
- Fix: 'severe acidaemia (pH ≤ 7.20) with moderate–severe AKI (AKIN 2–3; BICAR-ICU 2018, subgroup)'.

**T14-25** · `ui3.js` · TOOLFN.vent readout 'Needed'
- What: 'Needed' is ambiguous: it is the total minute ventilation at the new rate (alveolar need + dead space × new rate), which differs from what is needed if VT is changed instead.
- Evidence: Default: 'Needed 9.6 L/min'; with the VT route total MV = 0.55 × 16 = 8.8 L/min.
- Fix: Label 'Minute vent. at new rate' and add 'Minute vent. at new VT'.

**T14-26** · `ui3.js` · TOOLFN.vent Assumptions
- What: Gendered 'his usual PaCO₂… he was achieving'.
- Evidence: Assumptions card, 4th bullet.
- Fix: 'their usual PaCO₂… the compensation they were achieving'.

**T14-27** · `ui3.js` · TOOLFN.hh
- What: Difference prints '+0%' and, with HCO₃⁻ blank, 'HCO₃⁻ that fits' is not computed although it needs only pH and PCO₂. Label '24 × PCO₂ ÷ HCO₃⁻' does not say PCO₂ must be mmHg (users in kPa mode).
- Evidence: Default -> 'Difference +0%'. Clear HCO₃⁻ -> nothing updates.
- Fix: Print '0%' without sign when |d|<0.5; compute 'HCO₃⁻ that fits' whenever pH and PCO₂ exist; label '24 × PCO₂ (mmHg) ÷ HCO₃⁻'.

**T14-28** · `ui3.js` · TOOLFN.urine readouts
- What: Urine AG, Calc. U-osm and U-osmolal gap have no units while NH₄⁺ has 'mmol/L'.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-urine-phone.png
- Fix: Add 'mmol/L' to Urine AG and 'mOsm/kg' to the two osmolality readouts.

**T14-29** · `ui3.js` · TOOLFN.vbg readouts and Limits text
- What: HCO₃⁻ readout has no unit and switches format ('24' vs '24.3' when calculated). Limits text has nested brackets '(roughly −20 to +30 mmHg (Byrne 2014))'.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-vbg-readout-phone.png; r1.json vbg_noh
- Fix: Show HCO₃⁻ to 1 dp with 'mmol/L'; write '…wide (about −20 to +30 mmHg; Byrne 2014).'

**T14-30** · `ui3.js` · TOOLFN.oxy readouts
- What: 'A–a upper limit (+5)' is cryptic and disagrees with the pocket card ('≤ age ÷ 4 + 4'); A–a is shown on oxygen with no caveat in the readout; altitude options lack the elevations shown in Settings.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-oxy-phone.png; NRB: A–a 460 shown plain.
- Fix: Label 'Expected A–a (age ÷ 4 + 4, +5 leeway)', and use the same wording on the pocket card. When f>0.21 show the A–a cell as 'on O₂: use P/F'. Use 'Riyadh ≈ 610 m (707)' etc. as in Settings.

**T14-31** · `ui3.js` · TOOLS 'units' description
- What: Tile and header list 'kPa ↔ mmHg, glucose, urea, creatinine, lactate, albumin, pH ↔ [H⁺]' but the tool also converts calcium and magnesium.
- Evidence: Labs tile 'Unit converter'.
- Fix: 'kPa ↔ mmHg, glucose, urea, creatinine, lactate, albumin, calcium, magnesium, pH ↔ [H⁺].'

**T14-32** · `shell.html` · .urow .eq
- What: The ⇄ between the two boxes is drawn as a bordered square that looks like a swap button but does nothing.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-units-desktop.png
- Fix: Drop the border/background on .eq (plain glyph), or make it a real swap button.

**T14-33** · `ui3.js` · POCKET() normal values
- What: Range repeats the unit: 'PaCO₂ 35 mmHg–45 mmHg', 'PaO₂ 80 mmHg–100 mmHg'.
- Evidence: Pocket card, Normal values table.
- Fix: Format as P(35)+'–'+P(45)+' '+PU().

**T14-34** · `ui3.js` · POCKET() print button
- What: The print button uses the 'copy' icon.
- Evidence: Pocket card bottom button.
- Fix: Add a 'print' icon to ui1.js icon set and use it.

**T14-35** · `ui3.js` · TOOLS icons (Labs page)
- What: Six bedside tools share the same generic wrench icon; Henderson check uses a tick, which reads as 'completed'.
- Evidence: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T14-labs-desktop.png
- Fix: Give each tool its own icon (e.g. vein for VBG, lung/O₂ for oxygenation, flask/drop for urine, scales for Henderson check, ventilator wave for vent, syringe for bicarbonate, ⇄ for units).

**T14-36** · `ui3.js` · TOOLS 'bicarb' title
- What: Title 'Bicarbonate & sodium' uses an ampersand; the app's plain-English style uses 'and'.
- Evidence: Labs tile and tool header.
- Fix: 'Bicarbonate and sodium'.


## Ideas (ranked by value)

**T14-37** · `ui3.js` · TOOLFN.oxy notes and verdict
- What: Berlin 2012 only; the 2023 Global ARDS definition accepts SpO₂/FiO₂ ≤ 315 (SpO₂ ≤ 97%) and HFNC ≥ 30 L/min, which fits ED use without an ABG.
- Evidence: Matthay MA et al. A new global definition of ARDS. Am J Respir Crit Care Med 2024;209:37–47.
- Fix: Add a line: 'Global definition (2023): P/F ≤ 300 or S/F ≤ 315 on HFNC ≥ 30 L/min, NIV/CPAP PEEP ≥ 5, or ventilated.' and use it in the S/F verdict.

**T14-38** · `ui3.js` · TOOLFN.bicarb
- What: Tool uses a fixed 0.5 L/kg distribution space although its own note says the space grows as HCO₃⁻ falls; no pH input, so the 'when not to give' guidance cannot react.
- Evidence: HCO₃⁻ 8: variable space 0.4 + 2.6/8 ≈ 0.73 L/kg (Fernandez 1989) -> deficit ≈ 357 vs 245 mmol.
- Fix: Show both (fixed 0.5 and 0.4 + 2.6/HCO₃⁻); add pH and K⁺ fields and context-aware warnings (pH ≥ 7.20 'not indicated', K⁺ < 3.5 'correct K⁺ first', DKA 'consider only if pH < 7.0 (2024 ADA/EASD/JBDS consensus — please confirm)'). Show volumes as 8.4% 50 mL syringes and as 1.26% bags.

**T14-39** · `ui3.js` · TOOLFN.units
- What: Missing conversions relevant to blood-gas work: ethanol/methanol/ethylene glycol mg/dL ↔ mmol/L (for the osmolar gap), haemoglobin g/dL ↔ g/L, phosphate, bilirubin, ionised calcium, PO₂ with SpO₂ estimate.
- Evidence: Ethanol: mmol/L = mg/dL ÷ 4.6; methanol ÷ 3.2; ethylene glycol ÷ 6.2.
- Fix: Add these rows, plus an 'osmolar gap with ethanol' helper.

**T14-40** · `ui3.js` · TOOLFN.urine
- What: No urine pH field; urine pH > 5.5 in acidosis is the classic distal-RTA clue, and a urine pH > 6.5 (bicarbonaturia) makes the UAG unreliable.
- Evidence: Standard NAGMA work-up (IBCC: Non-anion-gap metabolic acidosis, emcrit.org).
- Fix: Add urine pH and plasma K⁺ and give an RTA-type hint (type 1: urine pH > 5.5, low K⁺; type 2: variable; type 4: high K⁺, urine pH < 5.5).

**T14-41** · `ui3.js` · POCKET()
- What: Pocket card has no oxygen section and no bedside numbers from the other tools.
- Evidence: Pocket card content.
- Fix: Add a compact 'Oxygen' card (P/F and S/F bands, FiO₂ by device table, BTS SpO₂ targets) and a 'Drugs' line (8.4% = 1 mmol/mL).

**T14-42** · `ui3.js` · TOOLFN.oxy DEVICES
- What: Device table stops at nasal cannula 4 L/min and has no Venturi 31% or reservoir-less mask range.
- Evidence: DEVICES constant.
- Fix: Add NC 5 L (0.40) and 6 L (0.44), Venturi 31%, and show the range for simple mask (0.35–0.55) in the label as done for NRB.

**T14-43** · `ui3.js` · TOOLFN.* (shift use)
- What: Tool inputs reset to defaults on every visit and results cannot be passed on.
- Evidence: Open Oxygenation, edit, go back to Labs and return -> defaults.
- Fix: Remember last inputs per tool for the session, and add 'Send to interpreter / gas log' and 'Copy result' buttons.
