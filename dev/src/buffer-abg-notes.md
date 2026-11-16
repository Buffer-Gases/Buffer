# Buffer — ABG/VBG trainer

Artifact: "Buffer Blood Gas Trainer" (single HTML, https://claude.ai/artifact/2i1ByVL4CEPyZUjSxheczD). Live PWA: GitHub org **Buffer-Gases**, repo **Buffer** (public, `main`) → https://buffer-gases.github.io/Buffer/ (Pages: Deploy from branch, main, root). Citrus web client needs the origin `https://buffer-gases.github.io`. Source in the build session: /home/claude/buffer/ (the repo is cloned separately in the scratchpad). build.py concatenates the files (order below), checks syntax and duplicate declarations, and writes buffer.html. Tests are in tests/ plus Playwright scripts. To release: build, regenerate pwa/index.html (head + buffer.html + service-worker tail), bump V in sw.js, zip, push, publish the artifact.

Roadmap and the user's decisions: claude/buffer-roadmap.md (12/11/2026, delivered in 4.9.0). 4.2.0 details: claude/buffer-4-2-release.md.

## v4.9.0 — the whole 12/11 roadmap (13/11/2026)
Built from claude/buffer-roadmap.md in one release (4.3–4.9). 98 lessons in 14 modules, 490 lesson questions, 16 cases, 15 models, 10 bedside tools.
- **4.3 Interpreter, log, weekly review (ui6.js):**
  - Every read gets a **Next steps** panel: differential causes, tests to confirm, first management steps, pitfalls, sources. It covers HAGMA, NAGMA, mixed, metabolic alkalosis, respiratory acidosis and alkalosis, raised A–a, hypoventilation, low P/F, CO, MetHb and venous samples.
  - **Save to log** (tag + note, "no names or IDs" reminder, warning when text looks like an ID number) and **Share line**.
  - **Gas log** tool in Labs: kept as typed, synced and merged across phones (tombstones for deletes), filter by tag, **trend** sparklines for pH, PCO₂, HCO₃⁻, lactate, AG and PO₂, plus a plain-English trend sentence.
  - **Weekly review** card on Progress: days, gases, minutes, streak, weakest steps and patterns, real gases this week by disorder. The line goes to Citrus as `extra.weekly`.
  - **Teaching-only banner** on every tool and model.
- **4.4 Speed and noise (ui7.js):** a Practice shelf with four drills:
  - five-second read (timer bar);
  - real-style analyser printouts with flags, units and extra values; about 1 in 6 do not add up ("repeat the sample");
  - pattern flash (gets shorter as you improve);
  - handover line.
  Results are in `S.speed` and count toward the weekly review.
- **4.5 Visual labs (e3.js):**
  - Davenport journeys (animated path: normal → uncompensated → compensated).
  - Curve in motion (six scenarios with unloading numbers).
  - Lung model (two units, shunt and dead space, solved by O₂/CO₂ mass balance with the N₂ correction). Pneumonia improves with O₂ (PaO₂ 68 → 262 on 60%); a 35% shunt barely moves (61 → 72).
  - Kidney and bicarbonate (animated proximal and collecting-duct cells; acetazolamide, type 1, type 4 and acid-load toggles).
  - Each model is also mounted in the lessons it explains.
- **4.6 Case library (c12.js data, ui8.js engine):** 6 chat cases, 5 image-led cases (SVG capnography, syringe colour, dipstick, monitor, printouts) and 5 timed sims (DKA, septic shock, asthma, hyperkalaemia, ICU ventilator alarm).
  - Filters: format, presentation, setting, exam tag (MRCEM, USMLE, untagged).
  - Sims: the clock ticks (1 sim-min per 3 s, with Pause and Wait 5 min), severity drifts and treatments slow it, results come back after a delay, and gases worsen with severity (pH recomputed by Henderson).
  - Sims also have warnings for wrong order, harms, branching endings, and a debrief with key steps vs target times, a timeline and a severity chart.
  - Wrong answers ask "why did you pick it?" (feeds the error autopsy) and go into the **mistake notebook** (`S.cmist`). Deep link `#case-<id>`.
- **4.7 ICU and special groups (c10.js, c11.js):**
  - **ICU module, 11 lessons:** shock types, perfusion targets (lactate, CRT, ScvO₂, CO₂ gap), fluids and PLR, vasopressors, ventilator basics, ARDS, obstructive disease, DOPES, weaning/RSBI, after ROSC, dialysis/citrate.
  - **Special groups module, 7 lessons:** cord gases, older adults, OHS, dialysis patient, altitude, diving/HBO, pregnancy emergencies.
  - All have 5 questions and sources; new references were added to SRC.
  - **Ventilator lab** model: single-compartment R/C lung, auto-PEEP from the time constant, PaCO₂ from alveolar ventilation, PaO₂ from the lung model with PEEP recruitment; presets normal, ARDS, asthma, COPD.
- **4.8 Links (ui9.js):**
  - Deep links `?do=round|interp|log|cases|case&id=|weekly|glossary|lesson&id=` with `from=citrus|galen` (shows a back chip). Galen can prefill the interpreter with `ph, pco2, hco3, po2, fio2, na, k, cl, alb, lac, glu, age, sample`.
  - Citrus status gets `contract: 2`, `metrics`, `actions` and weekly `inbox` proposals.
  - **Yuzu:** missed lesson questions (mcq, `S.qmiss`) and case mistakes (basic) go as `buffer-misses-<isoweek>.json` into `My Apps/Yuzu/collection/inbox/`, or are copied when not signed in.
  - **Reasoning-app hand-off:** `buffer_handoff` JSON (gas or sim) into `My Apps/hub/handoff/`.
  - **German glossary (Learn → Glossar):** 75 terms with articles, plurals and examples, de-DE speech, ward phrases. "Send to Yuzu" uses the Mephisto vocab card format.
- **4.9 Photo of a printout (ui10.js):**
  - tesseract.js 5.1.1, lazy-loaded from jsDelivr on first use and cached by the service worker in a separate `buffer-ocr-1` cache.
  - Grayscale, autocontrast, and invert for dark screens. OCR clean-up for pC0₂, p02, HC03, Na*, Kt and similar misreads, then the existing paste parser.
  - A **confirm sheet** shows the photo, editable fields and a live Henderson check; nothing is read until you confirm.
  - Tested with native Tesseract 5.3.4 on 24 synthetic printouts (two layouts, rotation and blur): 24/24 for pH, PCO₂, HCO₃⁻, Na⁺, Cl⁻ and K⁺. **Not yet tested on real phone photos of real analyser printouts.**
- **Home:** a Today's plan card (Round, due, a case, a speed drill, log a real gas, weekly review on Sun/Mon), capped by the Citrus shift slot. Night shift = rest with one optional drill.
- **Build safety:** build.py now runs `node --check` on the bundle and fails on duplicate top-level declarations. This caught a `shuffle` and a `bubble` clash and showed that a later `function flag` was silently overriding the printout flagger.
- **State (schema v4, key buffer.v1):** new fields `gaslog, speed, cases, cmist, qmiss`, all merged by mergeStates.
- **Build order:** c1 c2 c3 c4 c5 c6 c7 c8 c10 c11 c12 c9 e1 e2 ui1 ui2 ui5 ui3 ui6 ui7 e3 ui8 ui9 ui10 hub kit.
- **Checks:**
  - 132 Node tests; Python reference 4,042 gases, 0 disagreements.
  - smoke, func, mig, a11y (extended to every case, speed drill and model), audit, round and twophones all pass.
  - Feature scripts for 4.3–4.9 pass with no page errors.
- **Not verified:**
  - no independent clinical review of the new lessons, cases and next-steps content;
  - OCR on real photos;
  - the real Google Drive (the Yuzu pack, glossary words and hand-off writes pass against the fake Drive in twophones.py);
  - real devices.

## v4.2.0 — foundations (13/11/2026)
Quiet mode by default, clinical skin, dark first, choose-your-own Round (weakness first), citation registry with a Sources card on every lesson, 5 questions per lesson (answer positions shuffled with a fixed seed). Details in claude/buffer-4-2-release.md.

## v4.1.1 — technique clinic (07/11/2026)
- Four lessons in "sample and machine": `tc-radial`, `tc-allen`, `tc-venous`, `tc-bubbles` (steps with the why, the usual error and the rescue, drills). Existing deep links unchanged.

## v4.1.0 — hub contract, Back, two-phone sync (07/11/2026)
- hub.js rewritten: status.json top-level fields Citrus reads; written only after sync, on change, at most every 5 min. Legacy `Citrus Maxima/Apps` write removed.
- Shift-aware asks from hub/citrus/plan.json: night = rest, after a night 10 min, early 15, before a night 20, free 25.
- Shared Citrus client ID built in; Google's window opens only inside a tap.
- Sync: 30 s timeout with retry and back-off, duplicates trashed, damaged file rewritten, content hash in appProperties.h, two phones merge (counters max, records larger n, unions), reset bumps `epoch`.
- Back button: one history entry per session, lesson, tool, shift, case or drill. Cross-tab adopts the newer save. 44 px touch targets.

## v4.0.1 — beta test, houseclean and debug (05/11/2026)
- Bugs fixed (compensation crash on impossible inputs, Citrus date mismatch, ISO dates in hints, unlabelled selects); answer giveaways removed (all options shuffled); paste parser picks the unit that makes pH, PCO₂ and HCO₃⁻ agree; clinical corrections from an independent review (Byrne venous limits, Winter's range, urine osmolal gap < 150, SID with 2·Ca and 2·Mg, NRB FiO₂ ≈ 0.8, JBDS vs ADA potassium, BTS NIV criteria).

## v4 — Kumquat structure (02/11/2026)
- Orange Pixel look (accent #F26A1B), tabs Today · Learn · Labs · Practice · Progress + Settings, hash routes, the Round, concept web (59 nodes), practice modes, Shifts, Teach it back, Gas sense, Number flash, Serial gases, error autopsy and calibration, Labs tools and models, hand kit. State key `buffer.v1`.

## Earlier
- v3 (27/10/2026): fading hints, consistency step, compensation gym, mistakes notebook, paste parser, Yuzu packs.

## Evidence used
- Aswan ABG audit (Cureus 2024): compensation was the weakest step at 47%.
- Teaching methods: faded worked examples, self-explanation and the protégé effect, interleaving and spacing (Hatala 2003), calibration, error reflection.
- Clinical sources: the SRC registry in c5.js plus c10–c12 additions (about 70 references), shown per lesson and per case.

## Integrations
- Citrus: status contract v2 (metrics, actions, inbox), deep links `?from=citrus&do=…`.
- Galen: stable `#tool-interp`, `#l-<id>`; `?from=galen&do=interp&ph=…` prefills the interpreter.
- Yuzu: lesson pack `buffer-core`, 30 practice gases, weekly `buffer-misses-<week>` pack, `buffer-words` German vocab pack (Mephisto format).
- Reasoning app: `buffer_handoff` files in `My Apps/hub/handoff/` (kind gas or sim). The reasoning app does not read them yet.
- Black Template: the one-line read.

## Decisions and open items
- ICU, shock, vasopressors and full ventilator management are now **inside** Buffer (user's 12/11 decision overrides the old rule).
- No FSRS inside Buffer; Yuzu does spaced cards.
- Open:
  - an independent clinical review of 4.2–4.9 content;
  - OCR on real phone photos;
  - the option-length pass on the older c1–c3 lessons;
  - a reader for `hub/handoff` in the reasoning app;
  - Mephisto could import `buffer-words` directly.
