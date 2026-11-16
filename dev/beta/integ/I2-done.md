# I2 done (e1 e2 e3 hub kit build.py tests/ pwa/sw.js pwa/README.md ui6 ui7)

0 | already | e1 causes list adds permissive hypercapnia when peep is set or ctx==='vent'; peep in LIMITS, the ox step and the line
14 | already | e1 ctx==='cord': ox step skipped ("Not assessed on cord blood"), fetal compensation note, ACOG pH<7.0 + BD>=12 step, "Cord artery gas" prefix
19 | already | e2 mountW passes opt||{} to build; ui1 passes (l.wopt||{})[id]
21 | handoff | e3 W.vent opens opt.pat; W.kidney has the alkalosis (beta: vom/sal/aldo) mode. c9.js: put 'kidney' back on alkmaint, e.g. opt {kidney:{seg:'beta',flags:['vom']}}
23 | already | ui6 Sources list appends the doi link
43 | already | tests/henderson.js (gate step) checks every lesson q prompt and l.ex gas
46 | already | ui6 saveSheet uses openModal and its close()
54 | already | ui7 printout header always shows FiO₂ %
59 | already | every KINDS variant has v[3] (checked: 0 missing)
64 | already | logAdd sets UI6_STORED from save(); 'Not saved: storage full' toast; peep and ctx in LOG_KEYS
65 | already | heads-up; D28's rawCase follows it (ralk_malk 30.5–34.3 / 26.7–30); sweep 0 broken
66 | already | D10 block is in tests/run.js; reference 0 disagreements
67 | already | ui6 runInterp wrapper uses #iAct, "Recheck the sample" card and UNRELIABLE share prefix
73 | already | tests/parse.js and tests/corpus.js in the gate (44/44, 312/312)
75 | already | W.kidney uses e2OnShow; no buffer:show listener left in e3
81 | already | kit swipe only flips an unflipped card, ignores vertical drags, pointercancel resets; teach-back uses TEACH.filter
84 | fixed | e1 DEF2 wk:{} + e1sane (date keys, object days, 2-number non-negative arrays, ms finite >=0)
86 | already | ui7 speedDone and spKeepPartial push ms
88 | already | hub items use s.ms, else UI6_SECS; damaged remote kept as state.damaged-<date>.json. Also: The Round item uses S.lastRoundMin when present
92 | already | ui7 opts.extra/opts.fixed honoured, Temp rows ignored, O₂Hb from the SO₂ curve (venous 38 -> ~70%)
95 | fixed | e1 DEF2 keys:true
96 | already | hub renderGoogle sub-line and gState toast/G.line as asked
97 | already | superseded by D24: shell.html starts with doctype/charset/viewport; build.py adds them only if missing; gate 'charset' step
99 | fixed | e1 DEF2 yzSent:{} + sanity (finite >=0 timestamps)
100 | fixed | ui6 mergeStates wrapper: o.yzSent=mergeMap(..,maxN), only when epochs are equal
101 | fixed | ui6AutoOff returns Mon?1:0 only (the ?do=weekly check is gone; ui9 sets UI6_WOFF)
104 | already | build.py adds no second charset
109 | already | sweep is gate step 'sweep' (node tests/sweep.js 30); ~20 s, so not in run.js. Now deterministic (seeded PRNG) and an over-limit combo is re-measured on 300 draws
116 | already | build.py --pwa strips the shell's doctype/html/charset/viewport; tested on a copy: each exactly once. Optional duplicate-class warning declined (40 duplicate class selectors, mostly intentional skin overrides: noise)
119 | already | e2 drawMap normal box is a 1.5px --good stroke with a 'normal' label; legend has Normal
126 | fixed | (1) kit contextmenu: a focus hint bubble on a host with data-hint (.mt) blocked the menu: Shift+F10/ContextMenu did nothing on mastery tiles. Fixed; Playwright: Shift+F10, ContextMenu, right-click and hold open the menu on .mt, lesson rows, Labs tiles and shift tiles. (2) ⋯ kitmore buttons now rendered by ui3/ui5 (another owner). (3) focus shows the hint (already)
130 | already | sw.js re-requests tesseract files in CORS mode (superseded by 134)
132 | fixed | ui6WeekMount sets S.ui.weekly=ui10WeekKey() when the reviewed week is shown on Sun/Mon
134 | already | nothing to do
138 | already | no ctr in DEF2 (run.js asserts it)
139 | fixed | copied to tests/drive/{sabotage,twophones,race2}.py with repo-relative paths; sabotage S8 tolerates the now-disabled Yuzu send button

Extra items
- DEF2: wk, keys, yzSent, lastRoundMin (number, 0–1440). S.ui.weekly lives in ui (already in DEF2). No ctr.
- ui6 merge: yzSent max per key; lastRoundMin follows the later lastRound; ui.weekly later date wins; all inside the equal-epoch branch.
- Lead: kit menu title prefers data-title, then <b>/<h3>, then aria-label, then first span (tile shows "Heat on site", not its place line).
- Lead: kit "Mark as done" stores Date.now().
- Lead: sweep deterministic (SEED env, SEED=random for exploration) + re-measure before failing.
- tests/run.js: migrate test for the new fields (149 passed). tests/load.js exports migrate.
- pwa/sw.js V bumped to buffer-5.0.0.

## For the lead
- ui5.js roundFinish never writes S.lastRoundMin (ui10 and hub read it). Add `S.lastRoundMin=mins;` next to `S.lastRound=today();`. DEF2 and the merge are ready.
- c9.js: kidney model can go back on alkmaint (n21).
- pwa/index.html is stale (13/11); rebuild with `python3 build.py --pwa` at release. pwa/README.md still says v4.9.0 · 13/11/2026: set the release date then.
- Drive harness: `python3 tests/drive/twophones.py`, `race2.py`, `sabotage.py` (after build). Results: twophones all pass, race2 all pass, sabotage all pass except S8 x2. S3 expectation updated (Reset keeps the log).
- ui9.js (S8, real bug): when the Yuzu folder is missing, the clipboard fallback marks the points as sent (yzSent) and disables the button ("All 3 sent to Yuzu"). So once Yuzu is set up the pack is never written, and points the user never pasted are lost. Suggest marking yzSent only after a Drive write succeeds (or after the user confirms the paste).
- Gate: all 11 steps pass; run.js 149 passed, 0 failed. Playwright at 390x844: no page errors on today, progress, labs, learn, scen, settings, interp.
