D01 | c1.js | Lessons in c1.js (modules start, chem, phys, micro, gas): text, keys, hooks, examples and their built-in questions.
D02 | c2.js | Lessons in c2.js (modules kid, num, samp, vbg).
D03 | c3.js | Lessons in c3.js (modules dis, clin, auto) and anything else defined in c3.js (e.g. FLASH cards if there).
D04 | c4.js | Lessons in c4.js (later lessons incl. the technique clinic tc-* and Stewart worked lesson).
D05 | c5.js, c9.js | The source registry SRC/MSRC/LSRC (add missing, correct, remove irrelevant sources per lesson) and the c9 merge step.
D06 | c6.js, c7.js, c8.js | Extra lesson questions XQ batches 1-3 (correct option first; balanced lengths; check with node tests/xq.js).
D07 | c10.js | ICU module lessons and their questions (not the ventilator lab model, which is e3.js).
D08 | c11.js | Special-groups module lessons and their questions.
D09 | c12.js | Case library data for chat cases (ch-*) and image cases (im-*), plus CASE_PRES/CASE_SET. Sim data (sim-*) belongs to D29: do not edit sim objects.
D10 | e1.js | The interpretation engine interp() and its helpers, labels, the one-line read, oxygenation, venous handling, input validation, DEF2/migrate (state). Case generation (genCase, KINDS, safeCase, labelPool, distract) belongs to D28.
D11 | e2.js | The ten original models W.* in e2.js and drawMap.
D12 | e3.js | New models: Davenport journeys, curve in motion, lung model (vqUnit/vqSolve), kidney, ventilator lab (VPAT/ventCalc/W.vent).
D13 | ui1.js | Core UI: go(), routing state, lessons view and lesson questions, Today view, theme/skin, Quiet-mode text walker, toasts, icons.
D14 | ui2.js | Practice tab and practice sessions (modes, hints, feedback, autopsy, calibration, summary).
D15 | ui3.js (interpreter part) | Interpreter: renderInterp, loadInterp, buildForm, readForm, runInterp, parseGas, FORMULAS card, examples menu. Other parts of ui3.js belong to D25 (tools) and D26 (settings, routing).
D16 | ui5.js | Round builder, scenarios (Shifts), Teach it back, Gas sense, Number flash, Serial gases, Concept web, Progress view, badges.
D17 | ui6.js | Next steps (NEXT), gas log, save sheet, trends, weekly review, teaching banner, mergeStates wrapper (state merge of new fields).
D18 | ui7.js | Speed and noise drills, printout() generator.
D19 | ui8.js (library, chat and image engine) | Case library view, filters, chat/image case engine, autopsy, notebook, case images (capnoSVG, syringeSVG, monitorSVG, dipSVG). Sim engine functions (simNew…simDebrief) belong to D29.
D20 | ui9.js (links) | Deep links, back chip, Citrus status v2, Yuzu misses pack, reasoning hand-off, weekly-review Yuzu button. The German glossary (GLOSS, RENDER.gloss, sayDE, glossParts) belongs to D30.
D21 | ui10.js | Photo-of-printout reader (ocrClean, ocrImage, ocrSheet, ocrButton) and Today's plan (todaysPlan and its card).
D22 | hub.js | Google Drive sync, hub status, merge (mergeStates core), sign-in, Citrus plan reading.
D23 | kit.js, pwa/, build.py, tests/ | Hand kit; the PWA files (sw.js, manifest, README; NOT pwa/index.html, which the lead regenerates); build.py; the Node tests and checker. Also triage any inbox item whose file was unclear.
D24 | shell.html (layout and visual CSS, view sections) | Layout, responsive and visual polish CSS and the HTML shell. Accessibility CSS items are D27's, but coordinate: both of you edit shell.html with small Edit-tool changes.
D25 | ui3.js (tools part) | Labs bedside tools: TOOLS list, TOOLFN.* (vbg, oxy, urine, hh, vent, bicarb, units, pocket), DEVICES, RENDER.labs, RENDER.tool helpers.
D26 | ui3.js (settings and routing part) | Settings view, Yuzu exports (pack, cardsFromLessons, gasCards), backup/restore, reset, route(), boot().
D27 | shell.html (accessibility) plus small a11y edits anywhere | Accessibility: focus styles, contrast tokens, sheet modal behaviour (CSS), skip links, live regions in the shell. For a11y fixes in JS files, write requests to the owners (requests.jsonl) unless trivial attribute additions.
D28 | e1.js (case generation) | genCase, KINDS, safeCase, kindsFor, targetLabel, labelPool, distract, withSeed, and case realism. interp() itself belongs to D10.
D29 | ui8.js (sim engine) + c12.js (sim-* objects) | Timed simulations: engine functions simNew, simVit, simGas, simAdvance, simAct, simEnd, simRender, simDebrief, and the five sim data objects in c12.js.
D30 | ui9.js (German glossary) | GLOSS, RENDER.gloss, glossParts, sayDE, the glossary tile in Learn, the Yuzu vocab pack.
