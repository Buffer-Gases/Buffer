# Buffer 5.0 — brief for every developer

Thirty beta testers reviewed every part of Buffer 4.9.0 (a blood-gas learning app for a GP/ER doctor preparing for MRCEM and USMLE and reading gases on shift). You are one of 30 developers integrating their notes to make "the ultimate Buffer". You own specific files; other developers are editing other files **at the same time** in the same folder.

## Where things are
- **Source:** `/home/claude/buffer/`. `python3 build.py` concatenates c1 c2 c3 c4 c5 c6 c7 c8 c10 c11 c12 c9 e1 e2 ui1 ui2 ui5 ui3 ui6 ui7 e3 ui8 ui9 ui10 hub kit into shell.html and writes buffer.html. It runs `node --check` and fails on duplicate top-level names (a second `function x` silently overrides the first). All the code is one script, so top-level names are global: prefix any new top-level helper with your file's short name to avoid clashes.
- **Your inbox:** `/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/inbox/D<NN>.jsonl` holds the findings assigned to you (fields id, sev, file, where, what, evidence, fix). The testers' full notes, with context, are in `…/beta/notes/` (T<NN>-*.md); read the ones your inbox ids come from.
- **Content conventions:**
  - Lessons (c1–c4) have `q:[[prompt,[4 options],correctIndex,explanation],…]`.
  - Extra questions in `XQ` (c6, c7, c8, c10, c11) list the **correct option first (index 0)**, and c9.js shuffles positions at load. Keep that convention, keep 4 options, and keep option lengths balanced (the correct one must not be the longest by more than 25%; check with `node tests/xq.js <file>` for c6–c8).
  - Sources are keys into `SRC` (c5.js), linked per lesson in `LSRC`.
- **State:** key `buffer.v1`. New fields must be added to `DEF2` in e1.js and merged in the `mergeStates` wrapper in ui6.js. If you need that, ask the owners (see Rules).
- **Style:**
  - Orange Pixel (accent #F26A1B), dark first, a clinical skin, dd/mm/yyyy, mmHg and mmol/L, plain British English.
  - Short sentences, no jargon in the interface, no emoji in content.
  - 44 px touch targets; everything works offline.
- **Interpretation standard:**
  - Winter's 1.5×HCO₃⁻+8±2.
  - Metabolic alkalosis 0.7×HCO₃⁻+20±5.
  - Respiratory 1/4 (acidosis) and 2/5 (alkalosis) per 10 mmHg.
  - AG albumin correction +0.25×(40−alb g/L).
  - Venous→arterial pH +0.03, PCO₂ −5, HCO₃⁻ −1.
  - A–a ≤ age/4+4.

## Rules
1. Edit **only your own files**, and only with the Edit tool: small, targeted replacements. Never rewrite a whole file, never use sed or python to rewrite files, and never run git commands that change files (no checkout, reset or stash). If an Edit fails because the file changed, Read the part again and redo it.
2. **Fixes that need another developer's file:** append one JSON line to `…/beta/devlog/requests.jsonl` (`{"from":"D<NN>","to_file":"<file>","what":"…","why":"…"}`) and carry on. Owners check that file before finishing and do what is reasonable.
3. **Triage every inbox item.** Fix it, or decline it with a reason (wrong, out of scope, conflicts with a user decision). For clinical or scientific changes, check the claim yourself first; testers can be wrong. Cite a source in your log for clinical changes. Ideas: do the valuable ones that fit your files and can be done well; list the rest as deferred.
4. **Check as you go.** After each batch of edits run `cd /home/claude/buffer && python3 build.py && node tests/run.js`. If the build fails in **someone else's** file, wait a little and retry; never touch their file. Check your changes in a real browser (Python Playwright, headless Chromium, one browser at a time, the machine is small) on `file:///home/claude/buffer/buffer.html`, at phone (390×844) and desktop (1280×800) sizes, with no page errors. Look at screenshots of UI changes.
5. **Out of bounds:** do not publish, push, or touch pwa/ (unless you own it), the scratchpad tests of others, or Google services.
6. **Before you finish:**
   - re-read `requests.jsonl` for items addressed to your files;
   - run the build and tests once more;
   - write `…/beta/devlog/D<NN>.md` with, for every inbox id, one line: id · fixed | declined | deferred | requested · what you did (file and function) · source for clinical changes;
   - add new ideas you implemented beyond the inbox.

Finish with a 3-line reply: counts fixed / declined / deferred / requested, build and test status, and anything the lead must know.
