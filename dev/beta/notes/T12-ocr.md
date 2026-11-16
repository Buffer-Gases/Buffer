# T12 — Photo-of-printout reader (ui10.js OCR → ui3.js parseGas)

## Summary
**What I covered:** ocrClean, ocrImage preprocessing, ocrSheet (the confirm sheet), the "Photo of printout" button, loadOCR and its failure and offline messages, the privacy wording, and how all of this feeds parseGas.

**How I tested:**
- Built 5 analyser layouts with the real label styles: Radiometer ABL90 FLEX (kPa, ranges in brackets, std and actual HCO₃⁻, temperature-corrected rows), Werfen GEM 5000 (H/L flags plus ranges on the same line, a corrected block), Abbott i-STAT (CG8+/CG4+, "VEN", glucose optionally in mg/dL), Roche cobas b 221 (arrows plus ranges) and Siemens RAPIDPoint 500 (gases in kPa, barometric pressure in mmHg).
- Each layout was filled with 4 clinical scenarios: DKA, COPD, CO poisoning on FiO₂ 1.0, and a VBG.
- Each was rendered in 6 conditions: a clean scan; a thermal-dot photo with rotation, perspective and a shadow; a heavy shadow; faded paper; σ=2 blur; and a narrow strip on a dark desk. That makes **120 images**.
- Every image went through the app's own `ocrImage` canvas. I captured it with a stubbed `Tesseract.recognize` on `#pPhoto input`, then ran native tesseract 5.3.4 (`--oem 1 --psm 6`, which I believe is the tesseract.js default) on it and passed the text through `parseGas(ocrClean(t))` in the frozen page.
- I tested the confirm sheet at 390×844, 820×1180 and 1280×800, in the pixel and clinical skins, dark and light, and in mmHg and kPa. I also tested the failure paths and offline (jsDelivr blocked).

**Accuracy per field** (app pipeline; 80 "readable" images = scan, photo, narrow and shadow):

| field | correct | missing | **wrong** |
|---|---|---|---|
| pH | 53/80 (66 %) | 21 | 6 |
| PCO₂ | 56/80 (70 %) | 7 | 17 |
| PO₂ | 55/80 (68 %) | 6 | 19 |
| HCO₃⁻ | 54/80 (67 %) | 7 | 19 |
| Na⁺ | 74/80 (92 %) | 4 | 2 |
| K⁺ | 70/80 (87 %) | 3 | 7 |
| Cl⁻ | 52/64 (81 %) | 11 | 1 |
| Lactate | 62/80 (77 %) | 16 | 2 |
| Glucose | 60/80 (75 %) | 17 | 3 |
| FiO₂ | 54/80 (67 %) | 24 | 2 |
| COHb | 49/64 (76 %) | 10 | 5 |
| MetHb | 48/64 (75 %) | 5 | 11 |
| Sample type | 72/80 (90 %) | – | 8 |

- **Good photos only** (photo plus narrow, 40 images): Na 95 %, K 97 %, Cl 96 %, pH 87 %, PCO₂ and HCO₃⁻ 80 %. Most of the remaining PCO₂, PO₂ and HCO₃⁻ errors come from parser logic (RAPIDPoint kPa and ABL standard bicarbonate), not from OCR.
- **Shadow** (20 images): 25–56 % per field.
- **Faded thermal paper and σ=2 blur**: 0 % for every field. An adaptive-threshold second pass rescues faded paper (0 → 171 of 228 fields).
- Across all 120 images, every field was right in only 14, and pH + PCO₂ + HCO₃⁻ were all right in 30.

**Slips past the confirm step:** in 24 of the 80 images that gave any values, at least one value was wrong and the sheet still said **"Henderson check fits."** in green, or ran no check. Examples:
- pH 7.35 taken from the range "[7.350 - 7.450]";
- pH(T) or pCO₂(T) used in place of the 37 °C values;
- standard bicarbonate used as HCO₃⁻;
- COHb 9 % from "(9.0-1.5)";
- COHb 10 % from "1.0";
- MetHb 5 % from "0.5";
- PO₂ 1908;
- venous samples read as arterial.

A separate parser bug makes hypoglycaemia in mg/dL become "Glucose 50: DKA likely".

**Verdict:** the plumbing is tidy: lazy load, no upload, a confirm sheet, and graceful failure when offline in the browser. But the confirm step only checks pH, PCO₂ and HCO₃⁻ against each other, and the parser takes the first number it sees, so plausible wrong numbers get through with a reassuring green line. Fix the parser's handling of ranges, (T) rows, units and std bicarbonate, add per-field plausibility and source-line display to the sheet, and add the adaptive-threshold second pass. With those, this becomes a genuinely useful shift tool.

**Score: 5/10.**

Evidence:
- Images and scripts: `/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t12/` (img/, pre/, specs.py, render.py, stage2.py, score.py, slips.py, ux.py, binz.py, s2.json).
- Screenshots: `shots/T12-*.png`.

Caveats:
- These are synthetic images, not real phone photos of real analysers.
- Native tesseract uses the system eng.traineddata, while tesseract.js 5 uses the 4.0.0_best_int data.
- Real-device behaviour is untested. That covers touch scrolling, iOS canvas limits, the service-worker cache and capture.



## Critical

### T12-1 · ui3.js · parseGas: glucose / lactate unit handling
- **Problem:** Glucose in mg/dL is converted only when the number is above 60 (`if(out.glu>60) out.glu/=18`). A hypoglycaemic US printout ('Glu 50 mg/dL' = 2.8 mmol/L) is taken as 50 mmol/L. Lactate in mg/dL is never converted ('Lac 18 mg/dL' = 2.0 mmol/L is taken as 18 mmol/L). Both values are inside the interpreter's LIMITS (glu 0.5-120, lac 0-40), the confirm sheet does not check them, and the interpreter then teaches the wrong thing.
- **Evidence:** page.evaluate(t=>interp(parseGas(ocrClean(t)).v)) with 'Glu 50 mg/dL\npH 7.20\npCO2 25 mmHg\nHCO3 9.6\nNa 135\nCl 100\nLac 18 mg/dL' -> v={glu:50, lac:18}, and the interp output says 'Glucose 50: DKA likely; check blood ketones' for a patient who is hypoglycaemic. i-STAT mock with glucose in mg/dL (t12/battery.py, t12/stage1.py 'istat-mgdl hypo': want 2.8, got 50).
- **Fix:** Decide the unit from the text on the same line, not from the size of the number: if the glucose line contains 'mg/dl' (case-insensitive), divide by 18.016; if the lactate line contains 'mg/dl', multiply by 0.111. Keep the >60 magnitude rule only when no unit is present on the line, and then show the sheet field as 'converted from mg/dL?' with a check mark the user must accept.

### T12-2 · ui3.js · parseGas: number after a misread value (reference range taken as the value)
- **Problem:** Every pattern allows up to 12-18 non-digit characters between the label and the first number. When OCR garbles the value, those characters ('esl [ ', 'y ee ie (') are skipped and the first number of the reference range is captured. The sheet marks it with ✓, and the Henderson check says 'Henderson check fits.' in green.
- **Evidence:** Native tesseract on t12/img/abl90-co-scan.jpg gives 'pH esl [ 7.350 - 7.450 ]' -> pH 7.35 (true 7.31). The sheet showed pH 7.35 ✓ and 'Henderson check fits.' (shots/T12-sheet-phone-dark.png, T12-sheetfull-desk-light.png). t12/img/gem-copd-narrow.jpg: 'COHb y ee ie (9.0-1.5)' -> COHb 9 % (true 2.1). abl90-vbg-narrow: 'FMetHb oe ae t.8.6=4 1.5 ]' -> MetHb 8.6 (true 0.4). A battery layout with ranges before values ('pH 7.35-7.45 7.21 L') gives pH 7.35, PCO2 35, HCO3 22 (all lower limits).
- **Fix:** Before matching, strip bracketed or parenthesised spans and range pairs from each line: t.replace(/[\[\(\{][^\]\)\}\n]*[\]\)\}]/g,' ').replace(/\b\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\b/g,' '). Then reduce the label-to-value gap to characters that can legitimately sit there (spaces, ':', '=', 'H', 'L', '↑', '↓', '*'): e.g. '[\s:=*HL↑↓]{0,6}' instead of '[^0-9\n]{0,12}'. Any value whose line still contains another number pair should be marked 'check' (amber), not ✓.

### T12-3 · ui10.js · ocrSheet chk(): 'Henderson check fits.'
- **Problem:** The only check in the sheet is the pH/PCO2/HCO3 Henderson consistency (10 %). When it passes, the sheet shows a green 'Henderson check fits.', which reads as 'the numbers are right'. In 24 of the 80 readable synthetic photos, at least one field was wrong and the sheet showed 'fits' or no check at all. Wrong values that passed: pH from the reference range or the temperature-corrected row, standard instead of actual HCO3, COHb 9 or 10 % (true 2.1 or 1.0), MetHb 5, 6 or 8.6 % (true 0.4 to 0.6), K 44 (true 4.4), PO2 1908 (true 108), lactate 2 (true 2.4), and venous samples read as arterial.
- **Evidence:** t12/slips.py output: 'images with any value 80 · blocked 23 · flagged 14 · slips 24', for example 'SLIP cobas-vbg-scan fits [cohb 1.0 -> 10]' and 'SLIP gem-dka-narrow fits [po2 108 -> 1908]'.
- **Fix:** Replace the green text with a neutral, scoped one: 'pH, PCO₂ and HCO₃⁻ agree with each other. The other values are not checked: compare them with the printout.' Add per-field plausibility checks in the sheet, reusing e1.js LIMITS and adding cohb [0,60] and methb [0,70]: outside the limits = red, outside the usual range = amber. Mark every field that was read from the photo as 'unconfirmed' until the user taps it or ticks 'All match the printout'. Only then enable 'Use these numbers'.


## Major

### T12-4 · ui3.js · parseGas: temperature-corrected rows
- **Problem:** When the 37 °C row is unreadable, the regex goes on to the next match, which is the temperature-corrected row: 'pH(T)', 'pCO2(T)' or 'pO2(T)'. The pH regex even accepts '(T)' on purpose. The value is close enough to pass the Henderson check, so it slips through. It also changes the interpretation: in the ABL90 DKA mock, pH(T) 7.105 with the standard bicarbonate 8.7 gives 'HAGMA with appropriate respiratory compensation' instead of the true 'HAGMA + respiratory acidosis'.
- **Evidence:** abl90-dka-scan: 'pH e120) [...]' then 'pH(T) 7.105' -> pH 7.105. gem-dka-scan and shadow -> pH 7.10 (true 7.12). gem-co-photo -> 7.29 (true 7.31). gem-dka-shadow -> PCO2 22 (true 21). Battery: 'pH 721 ... pH(T) 7.19' -> 7.19. interp check in t12/interp.py.
- **Fix:** Ignore any line whose label carries '(T)', 'T)', '@ 3x.x', or that comes after a 'corrected' or 'Temperature corrected' header. Analysers interpret at 37 °C and the app's rules assume 37 °C values. If only (T) values are present, fill the fields but mark them amber: 'temperature-corrected value: the 37 °C value is preferred'.

### T12-5 · ui3.js · parseGas: standard vs actual bicarbonate
- **Problem:** The HCO3 pattern takes the first of 'cHCO3-(P,st)c', 'HCO3std' or 'HCO3act'. When standard bicarbonate (calculated at a PCO2 of 40 mmHg) comes first, or when the actual line is misread, standard bicarbonate is used in Winter's formula and the compensation rules. Standard bicarbonate removes the respiratory component, so this is wrong for the app's rules. It passed the Henderson check in 9 of 16 ABL90 mock photos.
- **Evidence:** Stage 1 (perfect text): abl90 for all 4 scenarios read HCO3 as the standard value (copd: want 32.3, got 29.5; vbg: 25.5 -> 24.6). Stage 2: 'SLIP abl90-copd-* fits [hco3 32.3 -> 29.5]'.
- **Fix:** Exclude the standard and calculated-at-40 variants: skip matches where the label contains 'st', 'std' or '(P,st)'. Prefer '(P)', 'act' or a plain 'HCO3'. Only if nothing else is found, fill from standard bicarbonate and mark it amber with a note: 'standard bicarbonate: not for compensation rules'. (I am not sure which order real ABL90 configurations print them in. The fix is safe either way.)

### T12-6 · ui3.js · parseGas: kPa detection
- **Problem:** `kpa=/kpa/i.test(t)&&!/mmhg/i.test(t)` turns kPa off if 'mmHg' appears anywhere in the text, for example a barometric-pressure line ('Bar Pressure 758 mmHg'), even when every gas is in kPa. PCO2 9.07 and PO2 7.73 kPa then go in as 9.07 and 7.73 mmHg. The Henderson warning appears, but it says 'One is probably misread', which sends the user hunting for a digit instead of a unit.
- **Evidence:** RAPIDPoint mock, all 4 scenarios (stage 1 and every photo): 'pco2: want 68 got 9.07; po2: want 58 got 7.73'. Battery: 'pCO2 3.2 kPa ... Baro 755 mmHg' -> pco2 3.2 (mmHg). Screenshot shots/T12-sheet-rapid-kpa-miss.png.
- **Fix:** Decide the unit per line: the unit on the pCO2 line governs PCO2, and the unit on the pO2 line governs PO2. Ignore 'mmHg' on lines labelled Baro, Bar, Atm or P(amb). When the Henderson check fails and multiplying PCO2 by 7.5 would make it fit, say so: 'PCO₂ looks like kPa. Convert?' with a button.

### T12-7 · ui3.js · parseGas: venous detection
- **Problem:** Venous detection needs the exact word 'venous' or 'pvco2', 'pvo2' or 'vbg'. The i-STAT abbreviation 'VEN' is missed, so are OCR-damaged forms ('Venou', 'Venaus'), and capillary samples are silently arterial. A venous gas read as arterial makes the interpreter report 'hypoxaemia with a raised A–a gradient (P/F 181)' for a normal venous PO2 of 38. The sheet does not say whether a sample type was found.
- **Evidence:** i-STAT VBG mock (6 of 6 images) and gem-vbg-photo ('Sample Type: Venou') -> ven false. 18 of 120 images had the wrong sample type. interp check: 'vbg as art -> ... hypoxaemia with a raised A–a gradient (P/F 181)'.
- **Fix:** Use /\b(ven(ous|ou?s?)?|mixed\s*ven|v\s*b\s*g|pv\s*co2|pv\s*o2)\b/i and recognise 'cap'/'capillary' as its own type. In the sheet, add a line under the Arterial/Venous toggle: 'Sample type on the printout: Venous ✓' or 'not found: choose one'. Leave neither button pressed until the user picks one when nothing was found.

### T12-8 · ui10.js · ocrClean: zeros, decimals and l/1 confusions
- **Problem:** Thermal printer fonts often use dotted or slashed zeros, which OCR reads as '@', 'Ø', '9' or '8'. Decimal points are often dropped. ocrClean fixes ',' and '·' between digits and O, l or I only when they sit between two digits. As a result, '@.5' becomes 5, 'Ø.4' becomes 4, '05%' becomes 5, '1.0' read as '10' gives COHb 10 %, 'l.l' (lactate 1.1) is lost, and '6.l' becomes 6. A COHb of 10 % instead of 1 % is clinically meaningful: it is in the range treated as CO exposure.
- **Evidence:** Battery: 'COHb @.5 %' -> 5; 'MetHb Ø.4' -> 4; 'K+ 4.@' -> 4; 'cLac l.l' -> missing; 'Glu 6.l' -> 6. Photos: cobas-vbg-scan 'COHb 10%' (true 1.0); cobas-dka-photo 'MetHb 05%' -> 5 (true 0.5); abl90-copd-photo 'cLac l.l' -> lactate missing; cobas-copd-photo 'K+ 440' -> K 44.
- **Fix:** Inside numeric tokens (a run of digits, '.', O, o, l, I, |, @, Ø, ø), map O, o, @, Ø and ø to 0, and l, I and | to 1, including at the start or end of a token ('l.l' -> '1.1', '14O' -> '140'). After cleaning, flag in the sheet any value that has lost its expected decimal (K ≥ 10, lactate ≥ 30, COHb or MetHb given as a whole number when the analyser normally prints one decimal place, or pH without a dot) as 'check the decimal point'.

### T12-9 · ui10.js · ocrImage: preprocessing (faded or shadowed thermal paper)
- **Problem:** Preprocessing is a global grey stretch plus inversion. Faded thermal paper and photos with a hand or phone shadow give nothing, or very little. In my tests the app's preprocessing gave no gain over the raw photo, and was slightly worse on shadows. A local (adaptive) threshold rescues faded printouts but does worse on clean photos, so it works best as a fallback.
- **Evidence:** Accuracy per field (native tesseract 5.3.4, --oem 1 --psm 6, 12 fields): faded, 20 images: app 0/228, raw 0/228, adaptive threshold (pixel < 25-px box mean − 12) 171/228. Shadow, 20 images: app 99/228, raw 119/228, adaptive 129/228. Clean photos: app 191/228, adaptive 160/228. Blur σ=2: 0 for every method. Scripts: t12/stage2.py, t12/binz.py.
- **Fix:** Keep the current pass. If it finds fewer than 4 values, or pH or PCO2 is missing, run a second recognise() on an adaptive-threshold canvas (integral-image box mean, window about width/60, offset 10-12) and keep the result with more values whose Henderson check fits. Show 'Trying again with more contrast…' while it runs.

### T12-10 · ui10.js · ocrImage: no downscale of large photos
- **Problem:** `scale=Math.min(2.5,Math.max(1,1800/maxSide))` only ever scales up. A 12 MP phone photo (4032×3024) is processed at full size: two full-frame getImageData loops, a full-size JPEG thumbnail as a data URL, and tesseract on 12 MP, which is slow on a phone and uses a lot of memory. Larger camera outputs may also exceed iOS Safari's canvas area limit, which would leave the canvas blank and give 'No values found'. I could not test this on a device.
- **Evidence:** Code reading, ui10.js line 13. The 2880-px 'narrow' mock images went through unscaled (dims [2880, 2433]).
- **Fix:** Clamp both ways: scale = Math.min(2.5, 2000/Math.max(w,h)), so large photos are scaled down to about 2000 px on the longest side. Make the thumbnail from a separate small canvas (max 600 px).

### T12-11 · ui10.js · loadOCR + PWA service worker: offline after first use
- **Problem:** The service worker caches tesseract only when `n.ok`. The loader adds a classic `<script src>` with no crossOrigin attribute, so the request is no-cors and the response is opaque (ok === false, status 0). It is therefore never stored in buffer-ocr-1, and the reader cannot load offline even after a successful first use. The same probably applies to the wasm core, which the worker loads with importScripts. I also have a doubt about whether a blob-URL worker's requests pass through the service worker at all. The promise in the notes and the message ('It needs internet the first time') is therefore probably not met.
- **Evidence:** Code reading: ui10.js line 5 (no s.crossOrigin), pwa/sw.js line 6 ('if(n.ok)c.put'). Fetch spec: opaque responses have status 0 and ok false. Not verified on a device (jsDelivr is blocked in this sandbox).
- **Fix:** In ui10.js set `s.crossOrigin='anonymous'` (jsDelivr sends Access-Control-Allow-Origin: *). In pwa/sw.js cache when `n.ok || n.type==='opaque'`. Better still: ship tesseract.min.js, worker.min.js, the core wasm and eng.traineddata inside the PWA folder, and pass workerPath, corePath and langPath to createWorker, so offline works from install. Test it in airplane mode on Android and iOS.

### T12-12 · shell.html · .sheet { touch-action:none } on the OCR confirm sheet
- **Problem:** The OCR sheet reuses .sheet, which sets touch-action:none, and the sheet is a scroll container (max-height 86vh, overflow:auto). On a 390×844 phone the sheet content is 1063 px tall in a 724 px box, and 'Use these numbers' sits at y = 1168, below the screen. touch-action:none on the scroll container disables touch panning, so on a real phone the user probably cannot swipe down to the buttons. Headless Chromium could not synthesise touch scrolling even with touch-action:auto, so please confirm this on a phone.
- **Evidence:** t12/ux.py: phone {sh:1063, ch:724, ok-button bottom:1168, vh:844, touchAction:'none'}. Mouse-wheel scrolling works (scrollTop 339).
- **Fix:** Add `.ocrsheet{touch-action:pan-y;overscroll-behavior:contain}`, or limit touch-action:none to the .sheet-grab handle. Make the button row sticky at the bottom of the sheet (`position:sticky;bottom:0;background:var(--surface)`), so the action is always visible.

### T12-13 · ui3.js · parseGas: aligned columns (pasted text)
- **Problem:** The gap between label and value is limited to 12 to 18 characters. Column-aligned analyser or lab-system text ('Na+             131 mmol/L', 13 or more spaces) misses Na, K and Cl in the Cobas and RAPIDPoint layouts when pasted. OCR collapses spaces, so photos are not affected, but the paste box is.
- **Evidence:** Stage 1 with original spacing: cobas K missing in 4 of 4, rapid Na, K and Cl missing in 4 of 4. With collapsed spaces all are found.
- **Fix:** Collapse runs of spaces and tabs to one space before matching (t=t.replace(/[ \t]+/g,' ')), then keep the short gap.

### T12-14 · ui3.js · parseGas: '(37.0 °C)' in the label
- **Problem:** Labels that carry the measuring temperature ('pH (37.0 C) 7.21', 'pCO2 (37.0 C) 24 mmHg') stop the pH match, because the [67]. capture fails at '37'. PCO2 then takes the temperature, 37, as its value and marks it ✓. Since pH is missing, no check runs.
- **Evidence:** Battery: 'pH (37.0 C) 7.21\npCO2 (37.0 C) 24 mmHg\nHCO3 9.4' -> {pco2:37, hco3:9.4} with pH missing.
- **Fix:** Strip '(37.0 °C)', '@ 37.0 C' or '37°C' groups from labels before matching: /[\(@]\s*3[5-9](?:\.\d)?\s*°?\s*C\)?/gi.


## Minor

### T12-15 · ui10.js · ocrSheet: K 44, PO2 1908 etc. reach the interpreter
- **Problem:** Impossible values (K 44, PO2 1908, Cl 39 instead of 99) are accepted by the sheet. K 44 is then rejected by the interpreter's LIMITS ('K⁺ 44 is outside the possible range'), but only after the sheet has closed, so the user must find and fix it in the main form. PO2 1908 is outside po2 [10,700] and behaves the same way.
- **Evidence:** cobas-copd-photo text through the sheet, then 'Use these numbers' -> 'CHECK THE INPUT · K⁺ 44 is outside the possible range (1–10)' (shots/T12-after-k44.png).
- **Fix:** Run the same LIMITS check inside the sheet, mark the field red and keep 'Use these numbers' disabled until it is fixed (see the critical finding on the Henderson check).

### T12-16 · ui10.js · ocrSheet: kPa display
- **Problem:** With units set to kPa, PO₂ shows as '54.660000000000004' because r1(v/KPA*10)/10 reintroduces a floating-point error.
- **Evidence:** S.units='kPa', abl90-co-scan text -> oc_po2 value '54.660000000000004' (shots/T12-sheetfull-phone-light-clin-kpa.png).
- **Fix:** Use (v/KPA).toFixed(2) and strip trailing zeros, as buildForm does: `v=+(v/KPA).toFixed(2)`.

### T12-17 · ui10.js · ocrSheet: keyboard and screen readers
- **Problem:** Escape does not close the sheet. The generic sheet() in ui1 handles Escape, this one does not. Focus is not moved into the dialog (activeElement stays BODY) and is not returned to the photo button on close. Focus is not trapped, so a keyboard user can Tab to the page behind the sheet and open a second sheet on top of the first: two .ocrsheet elements stacked.
- **Evidence:** t12/ux.py: afterEsc true at all 4 viewports; active 'BODY'; stacked 2.
- **Fix:** On open: remove any existing .sheet-scrim, focus the first empty or flagged field (or #ocT with tabindex=-1), add a keydown Escape handler and a simple focus trap. On close: return focus to #pPhoto.

### T12-18 · ui10.js · ocrButton: label as button, status messages
- **Problem:** #pPhoto is a <label class=btn tabindex=0> with no role='button', so screen readers announce it as a label. #pMsg is a plain span without aria-live, so 'Reading… 50%', 'Found 11 values' and the error messages are not announced.
- **Evidence:** t12/ux.py btn-phone: role null; pMsg aria-live null.
- **Fix:** Add role='button' and aria-label='Photo of printout: read values from a photo' to #pPhoto. Set $('pMsg').setAttribute('aria-live','polite') in renderInterp.

### T12-19 · ui10.js · ocrButton: error messages
- **Problem:** Every failure ends with 'It needs internet the first time.', even when the cause is something else ('(not an image)'), and raw engine errors are shown to the user ('(RuntimeError: memory access out of bounds)').
- **Evidence:** t12/ux.py: notimage -> 'The photo reader could not run (not an image). It needs internet the first time...'; a stubbed recognize that throws -> the raw RuntimeError text. Screenshot shots/T12-msg-notimage.png.
- **Fix:** Map the causes. Download failure: 'Could not download the photo reader (about N MB). Connect once, then it works offline.' Not an image: 'That file is not a photo Buffer can open (try JPG or PNG).' Anything else: 'The reader stopped on this photo. Try a smaller or closer photo, or type the values.' Keep e.message in console.warn only.

### T12-20 · ui10.js · ocrButton: capture='environment'
- **Problem:** capture='environment' makes Android Chrome and iOS Safari open the camera directly, so the user cannot pick a photo already in the gallery, or a screenshot of a gas shared on WhatsApp or the hospital system, which is a common shift workflow.
- **Evidence:** #pPhoto input has capture='environment' (t12/ux.py). This is known browser behaviour; I have not tested it on a device.
- **Fix:** Drop the capture attribute (the OS chooser then offers both camera and gallery), or offer two buttons: 'Take photo' (with capture) and 'Choose photo'.

### T12-21 · ui10.js · ocrImage: inversion heuristic
- **Problem:** The 'light text on a dark screen' inversion fires when more than half the pixels are dark. Any printout photographed on a desk with the paper filling less than half the frame meets that test, so the thumbnail in the sheet is shown as a negative. This happened in 98 of 100 synthetic photos. Tesseract 5 copes, and accuracy was the same when I undid the inversion (shadow 100 vs 99, photo 189 vs 191), so this is mostly cosmetic.
- **Evidence:** Preprocessed canvases in t12/pre/*.png; t12/noinv.py. See the thumbnail in shots/T12-sheet-phone-dark.png.
- **Fix:** Decide inversion from the median of the central 50 % of the image, not the whole frame, or drop it: tesseract inverts low-confidence lines itself. Always build the thumbnail from the original photo, not the processed canvas.

### T12-22 · ui10.js · ocrSheet: hidden parsed fields and count
- **Problem:** parseGas can return urea, osm and SpO2, but the sheet only shows OCR_FIELDS, and read() only reads those fields. These values disappear when the user confirms, although the 'Found N values' count includes them. Age is not offered, though the A–a gradient needs it.
- **Evidence:** Code reading: OCR_FIELDS (ui10.js line 19) vs parseGas pats (ui3.js line 7).
- **Fix:** Add urea, osm, spo2 and an empty age field to OCR_FIELDS, or count only the fields the sheet shows.

### T12-23 · ui10.js · ocrSheet: after 'Use these numbers'
- **Problem:** After confirming, the interpreter form does not mark which inputs came from the photo (IPARSED stays []), unlike 'Read values' from the paste box. The record of what was read is lost.
- **Evidence:** t12/ux.py after.filled = [] at all viewports.
- **Fix:** Set IPARSED = Object.keys(o) after loadInterp (and in loadInterp's caller), so the inputs get the .filled style. Set pMsg to 'From photo · N values · check against the printout'.

### T12-24 · ui10.js · ocrButton: nothing found
- **Problem:** When nothing is read, the sheet still opens with every field blank, and the only message ('No values found. Try a straighter, closer photo, or type them.') sits in #pMsg behind the scrim. The sheet itself gives no explanation.
- **Evidence:** shots/T12-sheet-empty.png.
- **Fix:** When parsed.got is empty, do not open the sheet. Show a short tip card in its place: 'Nothing readable. Tips: fill the frame with the printout, avoid shadows, hold steady, use daylight, or flatten curled thermal paper.' Add buttons for 'Try again' and 'Type the values'.

### T12-25 · ui10.js · ocrClean / parseGas: Radiometer labels
- **Problem:** Radiometer prints FiO2 as 'FO2(I)', which is never read (fio2 missing in all ABL90 mocks). 'FC0Hb' (0 for O) is not repaired, because the \b before C in the COHb fix fails after 'F'. 'Anion Gap,K+c' can be taken as K when the cK+ line is lost (K 16.3; the interpreter's LIMITS catch it).
- **Evidence:** Stage 1: abl90 fio2 missing 4 of 4. Battery: 'FC0Hb 1.0' -> cohb missing; 'Anion Gap,K+c 16.3 ... cK+ 4.1' -> k 16.3.
- **Fix:** Add /\bF\s*O\s*2\s*\(\s*I\s*\)/ -> 'FiO2' and change the COHb fix to /\b(F?)C\s*[oO0]\s*Hb\b/. Skip lines that start with 'Anion' for the K, Na and Cl patterns.

### T12-26 · ui10.js · loadOCR: retry behaviour
- **Problem:** Each failed attempt adds another <script> tag (2 after two attempts). If the script loads but window.Tesseract is missing, OCR_LOAD stays a rejected promise until the page is reloaded.
- **Evidence:** t12/ux.py offline2: n=2 tesseract script tags.
- **Fix:** Remove the script element in onerror. Reset OCR_LOAD=null in the 'engine missing' branch.

### T12-27 · ui10.js · ocrButton: progress during first download
- **Problem:** The first use downloads the engine, the wasm core and the English data (several MB) with no progress. The logger only reports 'recognizing text', so on a slow hospital Wi-Fi the message stays at 'Reading the photo on this device…' for a long time.
- **Evidence:** Code reading, ui10.js line 17 (the logger filters on status==='recognizing text').
- **Fix:** Also report 'loading tesseract core' and 'loading language traineddata' (status contains 'loading'): 'Downloading the reader (once)… 40%'.


## Polish

### T12-28 · ui10.js · ocrButton icon
- **Problem:** The 'Photo of printout' button uses the copy icon (two overlapping squares). The ICON set has no camera.
- **Evidence:** shots/T12-paste-phone.png.
- **Fix:** Add a camera icon to ICON in ui1.js (a pixel camera matching the set) and use ic('camera').

### T12-29 · ui10.js · ocrSheet privacy text
- **Problem:** 'Read on this device.' only appears after the photo has been read. The user is not told beforehand that nothing is uploaded, or that the reader is downloaded once from a third-party CDN (jsDelivr). Printouts carry the patient's name and hospital number, and the app's own policy is 'no names or IDs', but nothing suggests covering or cropping the patient label. The 'What the reader saw' box shows the name and ID back to the user. It is not stored, which is fine.
- **Evidence:** shots/T12-sheet-phone-dark.png; ui10.js lines 22 and 37.
- **Fix:** Add a title or hint on the button: 'Reads the photo on this phone. Nothing is uploaded. The reader downloads once from jsDelivr.' Add to the sheet: 'Tip: cover the patient label. Buffer does not keep the photo.'

### T12-30 · ui10.js · ocrSheet thumbnail
- **Problem:** The thumbnail is the processed (often inverted) canvas at a maximum height of 200 px. It is unreadable, so it cannot be used to compare values, and its alt text 'Your photo' is inaccurate.
- **Evidence:** shots/T12-sheetfull-desk-light.png.
- **Fix:** Show the original photo. Tap to open it full screen with pinch-zoom, or better, show the OCR line each value came from under each field (see Ideas).

### T12-31 · ui10.js · ocrSheet labels
- **Problem:** The pH label has a double space before ✓ ('pH  ✓') because the unit is empty. Values found are marked only by green text and ✓, and there is no marker for 'not found' versus 'cleared by user'.
- **Evidence:** t12/ux.py lab list.
- **Fix:** Join label parts with filter(Boolean).join(' '). Use a small 'from photo' chip instead of a bare ✓.


## Ideas (ranked by value)

### T12-32 · ui10.js · Show the source line under each field
- **Problem:** The biggest safety gain: show, under each value, the OCR line it was taken from, with the captured number highlighted ('pH esl [ 7.350 - 7.450 ]'). A range taken as the value, or a (T) row, becomes obvious at a glance.
- **Evidence:** Every slip in t12/slips.py would have been visible this way.
- **Fix:** Have parseGas return {v, src:{field: {line, index}}} (an optional third argument keeps the paste path unchanged). Render <small class=ocsrc> with <mark> in the sheet.

### T12-33 · ui10.js · Henderson repair suggestion
- **Problem:** When the Henderson check fails, compute which single value would make the three agree and say so: 'If HCO₃⁻ were 32.3 these fit; if PCO₂ is in kPa (9.07 → 68 mmHg) these fit.' This catches the standard-bicarbonate, kPa and lost-decimal cases quickly.
- **Evidence:** rapid kPa case: 87 % off; with PCO2×7.5 it fits within 2 %.
- **Fix:** In chk(), try pco2×KPA, pco2/KPA, hco3 from Henderson, and pH from Henderson. Offer one-tap fixes for candidates that bring the error under 5 %.

### T12-34 · ui10.js · Lock the tesseract parameters
- **Problem:** My numbers assume the tesseract.js default, which I believe is PSM 6 (single block); I could not open the library source here. With PSM 3 (automatic layout) accuracy collapsed (pH 14/120 vs 53/120), because columns are split. Set the mode explicitly so a library update cannot silently degrade the reader.
- **Evidence:** t12/score.py app3 vs app6.
- **Fix:** After createWorker: await w.setParameters({tessedit_pageseg_mode:'6', preserve_interword_spaces:'1'}).

### T12-35 · ui10.js · Framing guide and second pass
- **Problem:** Shadowed and angled photos were the main failure (shadow: 99/228 fields). A simple guide before capture ('fill the frame, flat, no shadow, daylight') and an automatic retry with adaptive threshold (see the preprocessing finding) would lift real-world accuracy the most.
- **Evidence:** See the preprocessing finding.
- **Fix:** Show a one-time coach mark before the first photo. Add a 'Try again with more contrast' button in the sheet.

### T12-36 · ui3.js · Line-based parser with analyser profiles
- **Problem:** Parsing line by line (label at the start of the line, then the first number before any bracket, unit captured per line) would remove most of the slips at once: ranges, (T) rows, standard bicarbonate, mixed units and the mg/dL glucose problem. Small profiles for ABL90, GEM, i-STAT, cobas and RAPIDPoint (recognised from the header) can map their labels (FO2(I), cHCO3-(P)c, HCO3act, BEecf).
- **Evidence:** Five synthetic layouts are in t12/specs.py.
- **Fix:** Rewrite parseGas as: split lines → normalise label → look up a field alias table → read the value and the unit from the rest of the line → apply the per-line unit. Keep the current regex as a fallback for one-line pasted text.

### T12-37 · ui3.js · Regression corpus for the reader
- **Problem:** The release notes say '24/24' on 2 layouts. On 120 harder synthetic photos across 5 layouts, pH was correct in 53 of 120, pH + PCO₂ + HCO₃⁻ were all correct in 30 of 120, and every field was correct in only 14 of 120 images. Commit a corpus so changes to ocrClean and parseGas are measured.
- **Evidence:** Scripts in /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/t12/: specs.py (layouts plus truth), render.py (degradations), stage2.py (app preprocessing → native tesseract → page parse), score.py, slips.py.
- **Fix:** Copy specs.py, render.py and score.py into tests/ocr/, store the OCR text outputs as fixtures (so CI does not need tesseract), and assert that the per-field accuracy and the slip count do not regress.
