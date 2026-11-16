# Buffer 4.9.0 beta — brief for every tester

You are one of 30 beta testers. Each tester owns one part of the app and reviews **every tiny bit of it**: correctness, clinical and scientific accuracy, wording, layout, interaction, edge cases, bugs, and anything that would make it the best blood-gas learning app there is. Your notes go to 30 developers, who will fix what you find. Be specific enough that a developer can act on each finding without asking you anything.

## The app
Buffer is an ABG/VBG (blood gas) learning app and bedside teaching tool for a GP/ER doctor preparing for MRCEM and USMLE Step 1/2 and reading gases on shift. It is a single-file HTML app (also a PWA), in the Orange Pixel style (accent #F26A1B, pixel headings, dark by default; a calmer "clinical" skin exists). Dates are dd/mm/yyyy, units are mmHg and mmol/L (kPa optional), and English is plain British English.
- Tabs: Today · Learn · Labs · Practice · Progress, plus Settings (gear).
- Frozen copy to test: `file:///tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/buffer-4.9.0.html`. Test this copy, not /home/claude/buffer/buffer.html, which developers will be changing.
- Source, **read-only for you**, is in `/home/claude/buffer/`. build.py concatenates the files in this order: c1 c2 c3 c4 c5 c6 c7 c8 c10 c11 c12 c9 e1 e2 ui1 ui2 ui5 ui3 ui6 ui7 e3 ui8 ui9 ui10 hub kit, inside shell.html (which holds all the CSS and the view sections).
  - Content:
    - c1–c4: lessons (`L`, `MODS`);
    - c5: the source registry (`SRC`, `MSRC`, `LSRC`);
    - c6–c8: extra lesson questions (`XQ`);
    - c10: ICU module;
    - c11: special-groups module;
    - c12: case library data (`CASES`);
    - c9: merges questions into lessons (shuffles answer positions).
  - Engine:
    - e1: the interpretation engine (`interp`, `genCase`, `KINDS`, Boston rules);
    - e2: original models (`W.*`);
    - e3: new visual models (Davenport, curve in motion, lung model, kidney, ventilator lab).
  - UI:
    - ui1: core UI (go(), lessons, Today, theme, Quiet mode);
    - ui2: practice sessions;
    - ui5: Round builder, scenarios, Progress, Gas sense, Number flash, serial;
    - ui3: interpreter, tools, Settings, routing;
    - ui6: next steps, gas log, trends, weekly review, teaching banner;
    - ui7: speed drills;
    - ui8: case library, chat/image cases, timed sims;
    - ui9: deep links, Citrus contract v2, Yuzu packs, reasoning hand-off, German glossary;
    - ui10: photo-of-printout reader (tesseract.js) and Today's plan;
    - hub: Google Drive sync and the Citrus hub;
    - kit: hand kit (hold to explain, swipe).
  - Notes: project notes are summarised in the source comments; the roadmap decisions are summarised below.
- **Interpretation rules (the app's standard):**
  - Winter's 1.5×HCO₃⁻+8±2.
  - Metabolic alkalosis 0.7×HCO₃⁻+20±5.
  - Respiratory 1/4 (acidosis) and 2/5 (alkalosis) per 10 mmHg.
  - AG albumin correction +0.25×(40−alb g/L).
  - Venous→arterial pH +0.03, PCO₂ −5, HCO₃⁻ −1.
  - A–a ≤ age/4+4.
- **Roadmap decisions (from the user):**
  - exam + shift use;
  - offline first;
  - quiet game feel by default;
  - cite everything;
  - teaching-only banner on tools;
  - live gas log kept as typed with a "no names or IDs" reminder;
  - Today's plan as home;
  - reminders only via Citrus;
  - full ICU course inside Buffer.

## How to test
- **Machine:** it is small (2 CPUs, 7 GB) and shared with other testers. Use **one** headless Chromium at a time, close it when done, and avoid long sleeps.
- **Playwright:** Python Playwright is installed (`from playwright.async_api import async_playwright`; `chromium.launch()` needs no options). Useful in `page.evaluate`: `go('<view>')`, `openLesson(id)`, `openTool(id)` (models are `m-<id>`), `startSession(mode)`, `openCase(id)`, `startSpeed(mode)`, `S` (state), `interp({...})`, `L`, `CASES`, `MODELS`, `TOOLS`. Run `localStorage.clear()` between scenarios when you need a fresh start.
- **Viewports:** phone 390×844, tablet 820×1180, Steam Deck/desktop 1280×800, and wide 1440×900. Test both the pixel and clinical skins, and dark and light themes where your part has visuals.
- **Screenshots:** save to `/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T<NN>-<name>.png` and look at them (Read the image). Look like a picky user, not just a script.
- **Content:** for clinical and scientific content, check each claim against what you know, and where in doubt use WebSearch/WebFetch to confirm against a guideline or a primary source. Cite the source in your finding.
- **Engine:** cross-check engine arithmetic by hand or with a short script.
- **Rules:** do NOT edit anything in /home/claude/buffer, do not push to git, do not publish artifacts, and do not write to any Google service.

## What to deliver (both files, exactly these paths)
1. `/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/notes/T<NN>-<slug>.md`:
   - a short summary (what you covered, overall verdict, score /10);
   - then every finding, grouped by severity;
   - then "Ideas" (improvements beyond bugs, ranked by value).
2. `/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/notes/T<NN>-<slug>.jsonl`: one JSON object per line, one per finding or idea:
   `{"id":"T<NN>-<n>","sev":"critical|major|minor|polish|idea","file":"<main source file, e.g. ui8.js or c3.js or shell.html>","where":"<view / lesson id / function / selector>","what":"<the problem, concrete>","evidence":"<repro steps, values, screenshot path, source URL>","fix":"<the change you recommend, concrete enough to implement>"}`
   - `file` must be one of the source files listed above (use the file a developer must edit; for CSS/layout use shell.html). If two files are needed, emit two lines.
   - Severity:
     - critical: wrong clinical teaching, data loss, a crash, or a broken core flow;
     - major: clearly wrong or confusing, or a broken secondary flow;
     - minor: a small bug;
     - polish: visual or wording;
     - idea: an improvement.
   - Aim for thoroughness: typically 15–60 findings. Verify each before you report it (no guesses presented as facts). Mark a doubt as such.

Finish with a 3-line reply: the file paths, the number of findings by severity, and your score /10.
