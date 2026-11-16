# Buffer 5.0.0 · 16/11/2026

The beta round release. 30 testers each reviewed one part of 4.9.0 and filed 1,227 findings. 30 developers each owned a set of files and worked through their share. Four integrators then closed the 141 cross-file requests, and an independent checker tested the result fresh.

## Outcome
- **Findings (1,227):** about 1,100 fixed, 11 partly fixed, 57 deferred (listed below), 16 declined with a reason.
- **Cross-file requests (141):** 79 were already done by the owner, 53 fixed by the integrators, 3 declined, and the rest done by the lead.
- **Release check:** `bash tests/gate.sh` passes all 11 steps:

  | Step | Result |
  | --- | --- |
  | build | passes |
  | charset | passes |
  | engine | 149/149 |
  | xq | passes |
  | bank lint | passes |
  | Henderson | 78 gases fit |
  | parser | 44/44 |
  | photo corpus | 312/312 fields |
  | generator sweep | 141,120 cases, 0 broken |
  | Python reference | 6,152 gases, 0 disagreements |
  | sw.js syntax | passes |

  The fake-Drive tests (twophones, race2, sabotage) pass in full.
- **Independent check:** no blockers. It covered:
  - every view at 390 and 1280 px;
  - a 4.9.0 save carried over intact;
  - bad saves (empty, wrong types, invalid JSON);
  - 3 monkey runs of 400 random actions;
  - offline PWA reload and deep links;
  - 15 classic gases, all read correctly.

## Highlights
- **Interpreter:** fixed the ROME rule, HAGMA plus respiratory alkalosis labelling, and the compensation calculator. The PaO₂ range now follows the altitude setting. parseGas returns the source line of each value.
- **Case generator:** stories, printouts and answers agree. Altitude PaO₂ is physical, and borderline gases are rejected. Every cause has a one-line mechanism.
- **Timed sims (5):** rebuilt.
  - Each patient has its own physiology and random variants.
  - Clicking everything never wins.
  - Doing nothing leads to arrest.
  - Each sim has a 0–100 score and a debrief citing JBDS 2023, BTS/SIGN, SSC 2021 and UKKA.
  - A running sim survives a reload.
- **Photo reader:**
  - Values read correctly on 120 test images rose from 735 to 1,044.
  - Faded printouts went from 0 to 196 of 228 values.
  - "Use these numbers" stays locked until each value read from the photo has been confirmed.
  - The reader is cached for offline use.
- **Today:** a two-column layout from 1400 px. Today's plan ticks only real work and shows real Round minutes. A Resume chip and a save-failure warning were added.
- **Sync:**
  - Counters are kept per device (`S.ctr`), so nothing is double-counted.
  - A reset on another phone keeps newer work and offers an undo.
  - An expired sign-in shows a Reconnect bar.
  - Each sync makes 5 Drive calls instead of 13.
  - Yuzu packs stay queued until Drive confirms them.
- **Accessibility:**
  - Text contrast is at least 4.5:1.
  - One h1 per view.
  - Every sheet traps focus.
  - A visible "⋯" button and Shift+F10 / Menu key reach every long-press menu.
  - No sideways scroll at 320 px or 200% zoom.
- **Question bank:**
  - 26 giveaway answers rewritten.
  - Lesson answer positions balanced (B was 80%).
  - Every cited source resolves.
  - The glossary has 144 terms.
- **Offline app (service worker):**
  - A 404 no longer replaces the offline app.
  - A hung network falls back to the cached app after 3 s.
  - Fonts and the OCR engine are cached.
- **Build:** `build.py` keeps the last good build on failure, checks for duplicate top-level names, adds the charset once, and has a `--pwa` mode.

## Deferred to 5.1+
- **Small fixes from the release check:**
  - On a fresh install, `?do=round` lands on Today.
  - The triple-disorder gas times the respiratory alkalosis as "Acute".
  - Sim toasts stack.
  - The sim's Pace dropdown has poor contrast.
  - Old garbled gas-log text from 4.9 builds served without a charset is left as stored.
- **Sims:**
  - ALS/arrest branch, more sims, difficulty levels, alarms, CPAP.
  - New sim images: CPR and oesophageal capnograms, ECG strip, tube, filter paper.
- **Interpreter:**
  - Stewart/SIG panel.
  - Separate tCO₂ field.
  - Pregnancy toggle.
  - Free-entry altitude.
  - Line-based parser with analyser profiles.
- **Learning modes:**
  - Exam mode and exam-blueprint filter.
  - Shift mode (interpreter-first).
  - Typed recall in flash cards.
  - Branching shifts.
  - Model answers.
- **More cases:** heat stroke, HHS, AKA with vomiting, PE, Saudi-context cases.
- **Ventilator lab:** pressure control, ARDSNet table overlay, crash-after-intubation scenario.
- **Other:**
  - The "?" shortcut overlay.
  - Stable keys for missed questions (needs a migration).
  - Weekly plan contract with Citrus.
  - Real-device checks: offline photo reading in airplane mode on Android and iOS, the real Google Drive, German audio.

## Not verified here
Real phones, the real Google Drive, OCR on real photos with the real CDN, and Safari. All testing was in headless Chromium with a fake Drive and stand-in OCR files.
