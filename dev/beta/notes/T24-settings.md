# T24 — Settings

## Summary
**What I covered:** every control in Settings (`RENDER.settings`, ui3.js) and what each one changes across the app.

- **Theme and skin:** auto, light and dark themes, including prefers-color-scheme switching while the app is open. Pixel and clinical skins.
- **Views checked in each skin and theme:** Today, Learn, a lesson, Labs, the interpreter, Practice, a session, Progress, the case library, a sim, Settings and a model (4 combinations each, plus an automated WCAG contrast scan).
- **Behaviour settings:** Quiet mode, hints, daily goal and session length.
- **Units:** a kPa sweep over every view, tool, model, session mode, speed drill, case, sim and all 98 lessons.
- **Gas-reading settings:** altitude and the anion gap reference, including K⁺.
- **Yuzu exports:** both packs, validated as JSON.
- **Backup and reset:** a backup/restore round-trip with a rich state, 10 malformed inputs, and reset (what is kept and what is lost).
- **Rest of the page:** the Google & Citrus section (from file:// and from an HTTP origin, not signed in), the reference links and the version line.

**Verdict:** the page is well organised and most settings work. Theme, skin, Quiet mode, goal, session length, hints, altitude and the AG reference all reach the interpreter and sessions. The backup round-trip is lossless apart from Google tokens, which are left out on purpose. The weak spots are:

- **Data safety:** reset deletes the live gas log. Restore accepts nearly anything with no confirmation, and unvalidated values can crash Practice.
- **The promise 'units used everywhere':** about 7 models, Gas sense, flash cards, case prose and most lesson prose stay in mmHg.
- **Yuzu export quality:** MCQs are exported as basic cards without their options, the id scheme differs from the misses pack, and there are occasional duplicate ids.
- **The build has no charset:** text intermittently turns to mojibake, and it gets into exported packs.

Dark themes are clean on contrast. The light themes sit just under AA for muted text and eyebrows.

**Score: 6.5/10**

Findings: critical 0 · major 8 · minor 20 · polish 10 · ideas 7.

**Scripts and data:** /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t24/ (s1–s18.py; exported packs lesson.json, gases.json, gases-kpa.json; backup.json; contrast.json).

**Screenshots:** beta/shots/T24-*.png. The four sheet-*.png files each show a pair of views in pixel-dark | pixel-light | clinical-dark | clinical-light.

## Critical
None found.

## Major

### T24-1 · shell.html · document head / build.py wrapper
- **Problem:** The built single file has no <!doctype html> and no <meta charset="utf-8">. Opened directly (file://, or any plain HTTP server that sends no charset), Chromium sometimes guesses windows-1252: every non-ASCII character becomes mojibake (PaO₂ → PaOâ‚‚, K⁺ → Kâº, ' · ' → 'Â·', the 🔥 streak pill garbled) and the page runs in quirks mode (document.compatMode = BackCompat). Worse, Yuzu packs and backups copied in that state contain the corrupted text permanently.
- **Evidence:** Frozen copy opened 8 times by file://: 1 of 8 loads came up as document.characterSet 'windows-1252', and pack('a','b',[]).category returned 'Medicine::Physiology::Acidâ€“Base'. The exported lesson.json bytes for 'Acid–Base' were c3 a2 e2 82 ac e2 80 9c (double-encoded). Served from python http.server it is garbled every time: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-google-localhost.png ('PaOâ‚‚', 'Kâº', 'Â·'). pwa/index.html does have the charset, but buffer.html does not.
- **Fix:** Start shell.html (or the wrapper in build.py) with '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">', placed before the base64 font so it falls inside the first 1024 bytes. Check the CSS still behaves in standards mode.

### T24-2 · ui3.js · RENDER.settings → #resetBtn handler
- **Problem:** Reset progress also erases the live gas log (S.gaslog: real gases the user typed on shift, with tags and notes), the case library progress (S.cases), badges, flash-card state, teach, qmiss (the source of 'Send missed points to Yuzu') and S.ui. The row text only says 'Erases lessons, stats, XP and mistakes… Settings stay.' The gas log is user-entered clinical work, not progress, and there is no undo.
- **Evidence:** Seed S.gaslog=[{…note:'bed 4'}], S.cases, S.badges, then tap Reset twice: changed keys = done, kinds, days, dayN, mist, ui, xp, teach, badges, flash, gaslog, cases, qmiss, round, savedAt, epoch. localStorage holds only buffer.v1 afterwards, so there is no backup copy.
- **Fix:** Keep gaslog (and ideally ui) in the `keep` object, or offer two separate actions: 'Reset learning progress' and 'Delete gas log'. List exactly what goes in the row text. Before erasing, save the old state to localStorage 'buffer.v1.undo' and show a toast 'Progress reset · Undo' for 10 s.

### T24-3 · ui3.js · RENDER.settings → #bkApply (restore)
- **Problem:** Restore overwrites all progress at once, with no confirmation, and accepts almost any object. The only check is that `kinds` or `done` exists, so pasting '{"done":5}' (or a stray settings fragment) wipes a full profile and reports 'Restored.' Nothing is kept to undo it.
- **Evidence:** With a rich profile (3 lessons, 900 XP, a gas log, kPa, light, clinical), paste {"done":5} and press Restore: the message is 'Restored.', and S becomes the defaults (mmHg, dark, pixel, 0 lessons).
- **Fix:** Before applying, parse the backup and show a summary such as 'Backup from 12/11/2026: 37 lessons, 412 gases, 6 log entries. Replace what is on this device?' with Replace and Cancel. Require buffer_backup:1 (or at least v and a few keys of the right type). Keep the previous state in localStorage 'buffer.v1.undo' and offer Undo.

### T24-4 · e1.js · migrate()
- **Problem:** migrate() checks types only, never ranges or enums, so a restored or synced state can hold units 'psi', theme 'purple', skin 'neon', hints 'x', lvl 99, sessLen 1000, goal 0, patm −5 or agref 99. lvl 99 crashes Practice (LVLS[S.lvl-1] is undefined), sessLen 1000 starts a session of 1000 gases, and patm −5 makes every PAO₂ negative. After this the Settings selects show the wrong values (mmHg / 760 / 10 / 5 / auto), not the stored ones.
- **Evidence:** Restore {"buffer_backup":1,"state":{"done":{},"patm":-5,"goal":0,"sessLen":1000,"lvl":99}}. go('practice') then shows 'Something went wrong… Cannot read properties of undefined (reading '1')' (RENDER.practice), and startSession('steps') shows '1 / 1000'. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-bad-restore-practice.png.
- **Fix:** In migrate(), after the type merge, clamp and whitelist values: units∈{mmHg,kPa}, theme∈{auto,light,dark}, skin∈{pixel,clinical}, hints∈{auto,always,never}, lvl 1..LVLS.length, sessLen∈{5,10,20}, goal∈{10,15,20,30} (or 5–60), patm 400–800, agref 4–16. Fall back to DEF/DEF2 for anything else. Restore and Drive sync both go through migrate, so this protects both.

### T24-5 · e2.js · W.map, W.hh, W.odc (also used in lessons rbc/odc), W.o2c, W.alv, W.comp
- **Problem:** Several models ignore the kPa setting. Their slider and input labels and readouts stay in mmHg ('PCO₂ (mmHg)', 'Mark a PO₂ (mmHg)', 'P50 26.8 mmHg', 'PaCO₂ mmHg / PaO₂ mmHg', 'EXPECTED PCO₂ 24–28 mmHg'). The interpreter and sessions, meanwhile, show kPa, and Settings promises the units are 'used everywhere in the app'.
- **Evidence:** With S.units='kPa', open each with openTool('m-<id>') and search innerText: map, hh, odc, o2c, alv, comp, odcplay all still show only mmHg. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-model-alv-kpa.png. The Davenport model (dav) does convert.
- **Fix:** Build the pressure inputs with pIn()/pv() from ui3.js (or share them from e1.js), use P()/PU() for readouts and axis tick labels, and convert slider ranges (e.g. PCO₂ 10–100 mmHg → 1.3–13.3 kPa, step 0.1).

### T24-6 · e3.js · W.odcplay
- **Problem:** The ODC 'curve in motion' model reports 'P50 26.8 mmHg' and 'saturation at 40 mmHg' in mmHg only, even in kPa mode.
- **Evidence:** Run openTool('m-odcplay') with S.units='kPa': the text contains 'P50 26.8 mmHg … saturation at 40 mmHg'.
- **Fix:** Use P()/PU() for P50 and the unloading reference point (40 mmHg → 5.3 kPa).

### T24-7 · ui5.js · RENDER.est (Gas sense) PCO₂ items; RENDER.flash
- **Problem:** Gas sense's 'Estimate the expected PCO₂' items stay in mmHg in kPa mode: the slider is labelled 'Your guess 30 mmHg', the range is 10–50 and the tolerance reads '± 3 mmHg'. The pH items do convert ('PCO₂ 8.1 kPa'). Flash cards show 'Acute ΔpH per 10 mmHg' with no kPa form.
- **Evidence:** With S.units='kPa', go('est') until a PCO₂ item appears: 'Estimate the expected PCO₂ (mmHg) … Your guess 30 mmHg … Within ± 3 mmHg'. Screenshot of a pH item: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-est-kpa.png.
- **Fix:** In estNew/RENDER.est, generate and show PCO₂ in S.units (slider 1.3–6.7 kPa, step 0.1, tolerance ±0.4 kPa) and score in mmHg internally. For flash 'per 10 mmHg' rules, add '(per 1.3 kPa)' in kPa mode.

### T24-13 · ui3.js · cardsFromLessons() / Yuzu lesson pack
- **Problem:** The lesson pack exports all 490 check questions as type 'basic', with only the stem on the front and none of the options. At least 63 stems depend on their options ('Which practice schedule…', 'Changes PaCO₂ from 40 to about…'), which makes them unanswerable as recall cards. Meanwhile 'Send missed points to Yuzu' (ui9.js yuzuMissCards) exports the same questions as type 'mcq' with options, under a different id scheme ('buf-q-<lid>-<qi>' vs 'buffer-<lid>-q<i>'). Importing both puts duplicate cards in Yuzu.
- **Evidence:** Export the lesson pack (via the textarea fallback): 806 cards = 490 basic + 316 cloze, 0 mcq. A regex for stems that start with 'Which' or end in '…' finds 63. Compare ui9.js:29 ids 'buf-q-'+lid+'-'+qi.
- **Fix:** Export lesson questions as {type:'mcq', question, options:[{text,correct}], explanation, source} as yuzuMissCards does, and use one shared id function (e.g. 'buffer-'+lid+'-q'+i) in both places so Yuzu merges them.

## Minor

### T24-8 · c12.js · im-syringe printouts A/B; ch-copd ('PCO₂ 76'); ch-cord ('PCO₂ 52 … 86'); im-co ('PaO₂ 410')
- **Problem:** Case prose hard-codes mmHg numbers with no unit. In kPa mode the printout image beside it converts (Printout A reads PCO₂ 5.3 kPa) while the question says 'Printout A: pH 7.40, PCO₂ 40, HCO₃⁻ 14.', so the two contradict each other on the same screen.
- **Evidence:** Run grep -o 'PCO₂ [0-9]' c12.js: there are 7 hard-coded pressures in steps and messages.
- **Fix:** Write the pressures as tokens (e.g. '{p:40}') and render them through P()/PU() in caseStep/caseBubble, or at least add the unit ('PCO₂ 40 mmHg (5.3 kPa)').

### T24-9 · c1.js · lessons dalton, alv, henry, o2content, odc, ratios, co2vent (c1); nph, npo2, nall (c2); tc-venous, tc-bubbles (c4); icu-* (c10); sp-alt, sp-elder, sp-dive (c11)
- **Problem:** Lesson prose gives pressures in mmHg only, and inconsistently: some lessons pair them ('PaCO₂ 35–45 mmHg (4.7–6.0 kPa)', respfail, asthma, copd), many do not (dalton has 28 mmHg mentions and no kPa; sp-alt has 14). A kPa user (the UK MRCEM standard) gets a mixed experience. Lesson text is static, so I am not proposing live conversion, but kPa-first readers need the equivalents.
- **Evidence:** Sweep with S.units='kPa' and openLesson(id) over all 98 lessons, counting mmHg vs kPa in innerText. Examples: dalton mmHg×28 kPa×6 (the 6 come from the embedded widget only); sp-alt ×14/0; sp-elder ×9/0; icu-rosc ×7/1.
- **Fix:** Add the kPa equivalent the first time each key number appears in a lesson ('PaO₂ 60 mmHg (8 kPa)'), as respfail already does, or use a {p:60} token that renders in S.units with the other unit in brackets. Same for c2/c4/c10/c11.

### T24-10 · e1.js · interp() step 4 text and uncertain()
- **Problem:** In kPa mode the working mixes units. Step 4 reads 'Winter's: 1.5 × 11.5 + 8 = 25.3 ± 2 → expected PCO₂ 3.1–3.6 kPa' (25.3 is mmHg, unlabelled). The oxygen step reads 'PAO₂ = 0.21 × (760 − 47) − 27/0.8 = 15.5' (mmHg operands, kPa result). uncertain() always says 'within 0.0 mmHg of the edge'. The range-check message also hard-codes ' mmHg'.
- **Evidence:** interp({sample:'a',pH:7.25,pco2:27,hco3:11.5,…}) with S.units='kPa'. Interpreter screenshot: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-interp-kpa.png ('HOW SURE IS THIS? Compensation is within 0.0 mmHg').
- **Fix:** Label the formula result explicitly: '= 25.3 mmHg ± 2 (3.4 ± 0.3 kPa)'. In the alveolar line write '…/0.8 = 116 mmHg = 15.5 kPa'. In uncertain() use P(m)+' '+PU(). In the range message use PU() and a converted range.

### T24-11 · ui7.js · NOISE 'Baro' row in printout()
- **Problem:** The 'Real printouts' drill shows Baro as a random 740–765 'mmHg' whatever the altitude and units settings. In kPa mode it is the only mmHg value on the printout, and at the Abha setting (580) a printout barometer of 757 contradicts the A–a working.
- **Evidence:** startSpeed('noisy') with S.units='kPa' and S.patm=580: 'Baro 757 mmHg'.
- **Fix:** Use Math.round((S.patm||760)+rnd(-8,8)) and show it through P()/PU().

### T24-12 · e2.js · W.alv altitude select
- **Problem:** The alveolar gas model always starts at sea level (760) and ignores the Settings altitude, while the Oxygenation tool (ui3.js) defaults to S.patm. Its option labels also drop the unit after the first one ('Riyadh ≈ 610 m (707)').
- **Evidence:** Set Settings altitude to Abha (580) and open m-alv: the select shows 'Sea level (760 mmHg)'.
- **Fix:** Preselect the option that matches S.patm, and add mmHg (or kPa) to every label.

### T24-14 · ui3.js · gasCards()
- **Problem:** The practice-gas pack can contain duplicate card ids, because the id is kind+pH+PCO₂+HCO₃⁻ and genCase can repeat a gas. A duplicate in one pack can overwrite or reject a card on import.
- **Evidence:** Over 20 packs of 30 there was 1 duplicate in 600 cards. Real example: 'buffer-gas-ralk_a-753-27-219' appeared twice in one pack (gases.json).
- **Fix:** Skip a card whose id is already in the pack (keep generating until n unique), or add the index ('…-'+cards.length).

### T24-15 · ui3.js · gasCards() weighting
- **Problem:** 'Practice gases are … weighted to the patterns you miss', but ks takes the first 8 kinds after sorting, and untried kinds count as 0.6. A new user (or anyone who has not met the mixed kinds) therefore gets only the 8 simple disorders (hagma, nagma, malk, rac_a/c/ac, ralk_a/c) and never the 7 mixed disorders, which are the hardest reads.
- **Evidence:** With fresh state, gases.json kinds = {hagma:4, nagma:4, malk:4, rac_a:4, rac_c:4, rac_ac:4, ralk_a:3, ralk_c:3}. KINDS has 15.
- **Fix:** Weight all 15 kinds, e.g. probability ∝ (1 − accuracy) + 0.2, with untried kinds at 0.5, so mixed disorders always appear. Also respect S.lvl rather than a fixed level 4.

### T24-17 · ui3.js · Yuzu card copy; c9.js merge
- **Problem:** The Yuzu note promises 'ids are stable', but lesson card ids are positional ('buffer-<lesson>-q<index>', with XQ questions appended after the base ones). Adding or removing one base question in a lesson shifts every later index, so re-importing attaches old review history to different questions. The same applies to S.qmiss keys 'lid:qi'.
- **Evidence:** See cardsFromLessons() and c9.js (XQ pushed after L.q).
- **Fix:** Give each question a short content hash (e.g. FNV of the stem) and use it in card ids and qmiss keys, or add explicit ids to questions.

### T24-18 · ui2.js · gapWhy() / genCase AG with 'Include K⁺' = Yes
- **Problem:** The 'Include K⁺ in the anion gap' setting only changes the interpreter. Session explanations and generated cases still compute AG without K⁺ and use reference 12, so a user who switched it on sees 'AG 19, reference ≈ 16 (K⁺ included)' in the interpreter but 'AG = 139 − (95 + 11.1) = 32.9 … Reference ≈ 12' in practice.
- **Evidence:** Set S.usek=true. interp({…k:4.5}) → 'Reference ≈ 16 (K⁺ included)'. Then gapWhy(genCase('hagma',3)) → no K⁺ and 'Reference ≈ 12'.
- **Fix:** Either apply usek in genCase/gapWhy/hintFor/Δ ratio (add K⁺ and +4 to the reference), or relabel the setting 'Include K⁺ in the interpreter's anion gap'.

### T24-19 · ui3.js · #sAg oninput
- **Problem:** The anion gap reference field accepts decimals (10.5 is saved) and silently ignores out-of-range input: typing 3 or 17 leaves the field showing 3/17 while the app keeps the old value, with no message. A blank field also keeps the old value without saying so.
- **Evidence:** Fill #sAg with '3' → S.agref stays 12 while the box shows 3. Fill '10.5' → S.agref=10.5.
- **Fix:** On change (not oninput), round to an integer, clamp to 4–16, write the clamped value back into the field, and toast 'Anion gap reference: 10'. Show a red outline if the input is invalid.

### T24-20 · ui3.js · selRow('sAlt')
- **Problem:** The altitude select can only show three values. A restored or synced patm that is not 760, 707 or 580 shows as 'Sea level (760 mmHg)' while the engine uses the real value. The option labels stay in mmHg in kPa mode, and the toast 'Altitude updated' does not say what it changed to.
- **Evidence:** Restore with patm 700: Settings shows 'Sea level'.
- **Fix:** Add a 'Custom…' option that reveals a number input (barometric pressure, or elevation in metres converted with the barometric formula). Show labels in S.units. Toast 'Altitude: Riyadh, 707 mmHg'.

### T24-21 · ui3.js · boot() prefers-color-scheme listener
- **Problem:** In Auto theme, when the device switches between light and dark, applyTheme() swaps the CSS tokens but canvases already drawn (Davenport, maps, ODC, interpreter map) keep the old palette: dark label boxes and dark dashed lines on a cream background, and white dots that vanish.
- **Evidence:** Open m-dav with OS dark and theme Auto, then emulate prefers-color-scheme: light: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-auto-switch-dav.png (dark box behind '7.40', near-invisible white points).
- **Fix:** In the matchMedia change handler, after applyTheme(), re-render the current view (safe(()=>RENDER[VIEW]()) for non-session views, or call each model's redraw). The same is needed if the theme ever changes without a re-render.

### T24-22 · shell.html · boot theme timing (doubt)
- **Problem:** Likely flash of the wrong theme on load. The CSS default (:root) is the light palette and the app default is dark, but data-theme is only set by applyTheme() after ~700 KB of inline script has parsed (the first <script> is at byte 61,859 and the markup comes before it). On a slow phone with the OS in light mode, the first paint is probably cream, then it flips to dark. I did not capture the frame, so this is unconfirmed.
- **Evidence:** Byte offsets in buffer-4.9.0.html: markup ends at about 61 KB and applyTheme runs at the end of a 769 KB file.
- **Fix:** Add a tiny inline script in <head>: try{const s=JSON.parse(localStorage.getItem('buffer.v1')||'{}');const t=s.theme||'dark';if(t!=='auto')document.documentElement.dataset.theme=t;document.documentElement.dataset.skin=s.skin==='clinical'?'clinical':'pixel';}catch(e){document.documentElement.dataset.theme='dark'}

### T24-23 · ui1.js · Quiet mode MAP (game words → plain words)
- **Problem:** Quiet mode leaks game words. The Learn header says 'Each module ends in a boss fight.' (MAP only matches the capitalised 'Boss fight'). The Practice 'Final check' card says 'Ten right earns the Native reader badge.'
- **Evidence:** S.quiet=true; go('learn') shows 'From the proton to the bedside. Each module ends in a boss fight.' (/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-learn-quiet-True.png). go('practice') shows '…Ten right earns the Native reader badge.'
- **Fix:** Add /boss fight/gi → 'module check' and /Ten right earns the Native reader badge\./ → 'Ten right passes the final check.' to MAP. Better still, render quiet text at source with a qw('Boss fight','Module check') helper rather than rewriting the DOM.

### T24-26 · hub.js · renderGoogle() when !hubCan()
- **Problem:** When Buffer is opened from a file (file://, e.g. a downloaded copy, or the beta copy), Settings says 'You are viewing the claude.ai copy', which is wrong for that context. renderCitrusLine has the same issue.
- **Evidence:** Open the frozen copy by file://: Settings → Google & Citrus shows 'You are viewing the claude.ai copy. Google cannot sign in here…'.
- **Fix:** Pick the wording from location: claude.ai/claudeusercontent → 'the claude.ai copy'; file: → 'a copy opened from a file'; otherwise 'this copy'. Then add 'Open the installed app (GitHub Pages) to sync.'

### T24-27 · shell.html · light theme tokens --muted, --accent-ink, .hint b
- **Problem:** Small text contrast is below WCAG AA in light themes (both skins). --muted #75685A on --surface-2 #EDE3D0 is 4.25:1 (segmented buttons, the teaching-only banner, interp step text). The eyebrow (--accent-ink #B9480A) on --bg #F3EBDD is 4.44:1 at about 10 px. The session 'Hint' label (--warn #A86A00 on --warn-soft, 9 px) is 3.63:1.
- **Evidence:** An automated contrast scan of 12 views × 4 skin/theme combinations at 390×844 found 0 failures in either dark theme (apart from the next finding) and 1–30 per view in light: lesson 'comp' 30, Learn 21, Today 19, interp 19. Ratios computed from the computed colours.
- **Fix:** In the light palette, darken --muted to #6A5D50 (5.0:1 on surface-2) and --accent-ink to #A23F08 (5.1:1). Use --fg2 for .hint b, or raise it to 11 px bold.

### T24-28 · shell.html · interp step list li > i (dark themes)
- **Problem:** In the dark theme, the interpreter's step numbers are white on lime (#84CC16, 1.98:1) and on amber (#E3B860, 1.86:1), which fails contrast.
- **Evidence:** openTool('interp') in dark mode: <li class="ok"><i>1</i> has color #fff on background rgb(132,204,22).
- **Fix:** In dark themes set the colour of li.ok>i, li.warn>i and li.bad>i to var(--on-accent) (#0B0907).

### T24-29 · shell.html · .set .seg button, #sQuiet
- **Problem:** The Settings controls are small for touch (the user's main devices are a Steam Deck and a Samsung tablet). The skin and theme buttons are 48–64 × 29 px with 10 px pixel-font labels. The Quiet mode checkbox is a 13 × 13 px native checkbox in browser blue, the only blue control in the Orange UI. The 'Advanced' summary in Google & Citrus is a tiny 9 px label.
- **Evidence:** Measured at 390×844: pixel 50×29, clinical 64×29, auto 48×29 (font 10px), sQuiet 13×13. Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-settings-desk-pixel-dark.png.
- **Fix:** Give .seg buttons in Settings min-height:40px and 12–13 px text. Replace the checkbox with the app's switch or seg (On/Off), or at least set accent-color:var(--accent) with a 22 px box. Make summary.adv a normal button-styled row.

### T24-35 · ui3.js · RES (free references)
- **Problem:** Unverified links. The NPS PDF link (nps.org.au/assets/AP/pdf/…) is the legacy Australian Prescriber host. The journal has moved to australianprescriber.tg.org.au (the same article is indexed there), and the old asset URL may redirect or break in future. The LITFL entry points at the homepage and asks the user to search. I could not open any link from this sandbox (proxy 403), so I confirmed only that search engines index all four URLs.
- **Evidence:** WebSearch shows both https://www.nps.org.au/assets/AP/pdf/The-interpretation-of-arterial-blood-gases.pdf and https://australianprescriber.tg.org.au/articles/the-interpretation-of-arterial-blood-gases.html. The ATS and UW URLs are also indexed.
- **Fix:** Point NPS at the australianprescriber.tg.org.au article page and LITFL at its acid–base library page. Add a 'checked dd/mm/yyyy' note and a quick check of the links at release.

### T24-36 · shell.html · lesson .tbl on phone (comp lesson)
- **Problem:** On a 390 px phone the compensation-rules table clips its third column ('LIMIT' shows 'PCO', '10–1', 'HCO') in all four skin/theme combinations. If the table scrolls sideways, nothing shows that it does. This belongs to the Learn owners, but I saw it on every skin.
- **Evidence:** openLesson('comp') at 390×844: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-sheet-lesson-labs.png (top row).
- **Fix:** Wrap lesson tables in a container with overflow-x:auto and a right-edge fade, or stack the rows into cards below 480 px.

## Polish

### T24-16 · ui3.js · pack()
- **Problem:** The pack metadata is stale: source:'Buffer Blood Gas Trainer, Oct 2026' is fixed text with no app version, while the app is 4.9.0 from Nov 2026.
- **Evidence:** Every exported pack has 'source': 'Buffer Blood Gas Trainer, Oct 2026'.
- **Fix:** Use source:'Buffer '+APP_VERSION+' · exported '+ddmmyyyy().

### T24-24 · ui1.js · RENDER.learn eyebrow
- **Problem:** The count is wrong in both modes: '1 module checks' (quiet) and '1 boss badges' (game) have no singular. It also counts every key in S.badges, not just module badges.
- **Evidence:** S.badges={b1:1}: the Learn eyebrow reads '0 OF 98 LESSONS · 1 MODULE CHECKS'.
- **Fix:** Use n+' module check'+(n===1?'':'s') and count only badge ids that belong to modules.

### T24-25 · ui1.js · Quiet mode MutationObserver
- **Problem:** Quiet mode rewrites text 120 ms after each render, so game words ('Boss fight', '+15 XP') flash briefly on every re-render.
- **Evidence:** See the walk() setTimeout(…,120) in ui1.js.
- **Fix:** Run walk() synchronously at the end of go()/RENDER, or (as above) generate quiet text at source.

### T24-30 · shell.html · html[data-skin=clinical] *{border-radius:10px!important}
- **Problem:** The clinical skin's blanket 10 px radius damages pixel-specific elements. The square Buffer logo becomes a lumpy orange blob, the 4-week heat-map squares turn into circles, and the srow divider (border-top) curves up at the ends above 'Reset progress'.
- **Evidence:** Clinical-skin screenshots: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-sheet-today-learn.png (logo), /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-sheet-session-progress.png (heat map as dots), /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-settings-phone-clinical-light.png (curved divider).
- **Fix:** Scope the radius to components (.card, .btn, .chip, .seg, input, select, .tile, .opt) rather than *, and exclude .logo, .heat i and dividers.

### T24-31 · ui3.js · Settings Practice card, sLen row
- **Problem:** 'Cases per session' has an empty description, and the naming is inconsistent: Settings says 'cases', Practice says 'GASES PER SESSION', and Settings 'Daily goal' says 'gases'.
- **Evidence:** Settings shows 'Cases per session' with no sub-line. Practice shows 'GASES PER SESSION 5/10/20'.
- **Fix:** Rename it 'Gases per session' with the sub-line 'Length of Mixed, Step-by-step and Quick read sessions. Reflex and boss rounds have their own length.'

### T24-32 · ui3.js · Settings 'Look' card
- **Problem:** The section eyebrow 'LOOK' repeats the row title 'Look' directly beneath it, and Quiet mode (a behaviour setting) sits under 'Look'.
- **Evidence:** See /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-settings-desk-pixel-dark.png.
- **Fix:** Call the eyebrow 'Appearance' and the row 'Skin', and move Quiet mode to the Practice card (or a 'Feel' card).

### T24-33 · ui3.js · #bkOut fallback
- **Problem:** When the clipboard is blocked, the backup text is put into the box labelled 'Paste a Buffer backup here', right above the Restore button. It looks like an import box, and pressing Restore re-applies the same data.
- **Evidence:** In headless Chromium (clipboard denied), pressing Copy backup opens #bkIn with the backup text in it.
- **Fix:** Use a separate read-only textarea (as the Yuzu card does, #yzTa) with a 'Select all' button, and keep the restore box empty.

### T24-34 · ui3.js · Yuzu buttons
- **Problem:** The 'Lesson pack (806)' button has the copy icon but '30 practice gases' does not. The labels also do not say that they copy.
- **Evidence:** See /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-settings-desk-pixel-dark.png.
- **Fix:** Give both buttons ic('copy') and the labels 'Copy lesson pack (806 cards)' and 'Copy 30 practice gases'.

### T24-37 · shell.html · session analyser slip at 390 px
- **Problem:** With the longer slip (Urea/Osm rows), flags and reference ranges wrap onto a second line on a phone ('7.31' / 'L', '7.35–' / '7.45', 'Osm (meas.)'). This makes the printout harder to scan than the compact version.
- **Evidence:** startSession('steps') at 390×844, pixel light: /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T24-sheet-session-progress.png (2nd tile).
- **Fix:** Shrink the range column, or hide it below 400 px and show the flag inline next to the value with white-space:nowrap.

### T24-38 · ui3.js · Settings change feedback
- **Problem:** Some settings give no feedback (anion gap, K⁺, hints, goal, session length save silently) while units and altitude toast. Nothing tells the user that open tools re-read the values.
- **Evidence:** Change each control and watch #toasts.
- **Fix:** Toast every change consistently ('Daily goal: 20 gases'), or show a small 'Saved' tick beside the row.

## Ideas (ranked by value)
1. **T24-39** (Your data card): Add 'Save backup file' and 'Open backup file' buttons (a Blob download as buffer-backup-dd-mm-yyyy.json, and <input type=file>). Do the same for the Yuzu packs ('Download .yuzu.json'). The user works on a Steam Deck and a Samsung tablet, where pasting 229 KB into a new file is painful, and the clipboard is blocked in some contexts. *Implementation:* const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;a.click(); and use navigator.share({files}) where available.
2. **T24-40** (Reset / Restore safety): Take an automatic snapshot before any destructive action (reset, restore, Drive merge) and offer 'Undo' for 10 s plus a 'Restore previous state' link in Your data. *Implementation:* Keep a single localStorage 'buffer.v1.prev' with a timestamp, and show 'Previous state from dd/mm/yyyy hh:mm · Restore' when one exists.
3. **T24-41** (Altitude setting): Add a custom barometric pressure or elevation entry. Qiddiya and other sites the user covers are neither sea level nor exactly Riyadh, and the A–a sums depend on it. *Implementation:* Number input in mmHg/kPa, or elevation in metres → P = 760·(1 − 2.25577e-5·h)^5.2559. That gives 707 at 610 m and 577 at 2,270 m, which matches the presets.
4. **T24-42** (Units): Add a 'US lab units' option (glucose mg/dL, urea/BUN mg/dL, albumin g/dL, creatinine mg/dL) for USMLE Step 1/2 practice. At the moment only pressure units switch. *Implementation:* Add S.labUnits ('SI'|'US') with converters next to P()/PU() (e.g. G() for glucose ×18), and apply them in slip(), the interpreter fields and case text.
5. **T24-43** (Version line): Make the version line useful: 'Buffer 4.9.0 · built dd/mm/yyyy' with a 'What's new' link and a 'Copy diagnostics' button (version, skin, theme, units, characterSet, display-mode, storage size) for bug reports. *Implementation:* Add BUILD_DATE in build.py and render it together with a diagnostics JSON copy.
6. **T24-44** (Free references): Add UK and exam-relevant free sources: the BTS emergency oxygen guideline (target saturations), RCEM learning (ABG modules), and the Australian Prescriber article's new home. Also say plainly that the links need a connection, since the app is offline-first. *Implementation:* Extend RES with 2–3 entries and a 'needs internet' note.
7. **T24-45** (Settings preview): Show a live mini slip under 'Reading gases' (e.g. 'PaCO₂ 5.3 kPa · AG ref 12 (16 with K⁺) · PAO₂ on air ≈ 100 mmHg at this altitude'), so the effect of each setting is visible at once. *Implementation:* Render a small .slip using P()/PU() and the alveolar equation, and re-render it on each change.

## Checked and fine
- Theme: Auto follows prefers-color-scheme both at load and on a live change. --bg, body background, meta theme-color and color-scheme all switch correctly. Light/Dark override the OS. A fresh install defaults to dark.
- Skin and theme switches apply at once and persist across a reload. Restore applies the backed-up theme, skin and Quiet mode immediately, and the Settings controls re-render.
- Quiet mode hides #hdr-xp, the level pill and .gamey, and strips '+N XP' from toasts.
- Session length (5/20) sets SS.n. Hints: 'Off' removes the hint, and 'Fading' opens on steps with fewer than 4 attempts.
- Daily goal shows as 0/30 on Today and in the hub status.
- The altitude choice reaches interp, genCase, hintFor, the Oxygenation tool, the V/Q and ventilator models, and Number sense.
- AG reference and K⁺ change the interpreter's gap, reference and Δ ratio correctly: (14.5 − 8)/(24 − 15.5) = 0.76 ✓; with K⁺ the AG is 19 and the reference 16 ✓.
- The altitude presets match the standard atmosphere: 610 m → 706.7 mmHg ✓; 2,270 m → 576.7 mmHg (the app uses 580, close enough).
- KPA = 7.50062 ✓.
- Yuzu packs: yuzu_pack:1, id, name, category, tags and cards are all present. Lesson-pack ids are unique (806). Cloze text always contains {{c1::…}} with a non-empty answer. No 'undefined' or 'NaN' in any card. Gas cards honour kPa.
- Backup: {buffer_backup:1, saved:dd/mm/yyyy, state} without google. The round-trip is identical apart from savedAt. Malformed JSON, arrays, null, numbers and truncated text are all rejected with a clear message.
- Reset needs two taps, disarms after 4 s, and keeps units, altitude, AG, K⁺, hints, goal, length, level, theme, skin, Quiet mode and Google.
- Google section from an http origin, not signed in: shows 'Not connected', the Advanced fields, the origin with a Copy button, and the client id prefilled. Offline, Connect reports 'Google script blocked' without crashing.
- The version line reads 4.9.0, matching APP_VERSION, pwa/index.html and sw.js.
- No console errors on any Settings path, apart from the blocked Google Fonts request (offline-sandbox only).
