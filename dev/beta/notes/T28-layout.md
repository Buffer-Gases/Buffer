# T28 · Layout and visual polish (Buffer 4.9.0)

**Covered:** every view in the brief (Today with the Round builder open, Learn, two long lessons with tables and models, Labs, all 10 tools, all 15 models, Practice, 9 session kinds, 4 speed drills, the case library, 2 chat cases, 3 image cases, a sim and its debrief, Progress with seeded data, Settings, Glossary, the gas log with a trend, the save sheet and the photo-confirm sheet, plus concept web, shifts, teach, estimate, flash and serial). Viewports: 360×640, 390×844, 820×1180, 1180×820, 1280×800, 1440×900 and 1920×1080. Pixel and clinical skins, dark and light. About 560 screenshots (prefix `T28-` in shots/), plus a DOM audit of every view for page overflow, clipped text, internal scrollers and text under 11.5 px.

**Verdict:** The core layout holds up well: no page-level horizontal overflow anywhere except the sim debrief, and the pixel look is strong on the original screens. Most problems come from the 4.3–4.9 additions. Their CSS reuses class names already used elsewhere (.bub, .wrap, .eq, .hrow, .autopsy, .vig), which quietly breaks the logo, segment alignment, the unit converter and the session miss row. Their components also differ from the originals (speed drills, sims, new model readouts, sheets). On phones, the most serious issue is that a running Round hides the tab bar. Wide tables also hide columns with no sign that they scroll. The clinical skin needs its own type scale.

**Score: 6.5/10** for layout and polish.

Counts: critical 0, major 3, minor 16, polish 21, idea 4.

## Major

### T28-1 · #roundbar, nav.tabs (phone ≤760px, Round in progress) · `shell.html`

While a Round is running, the round bar covers the phone tab bar completely, so there is no bottom navigation. Two causes: (1) the phone rule `#roundbar{bottom:calc(64px + env(...))}` (line 88) is declared before the base rule `#roundbar{position:fixed;...;bottom:0}` (line 473), which wins; (2) nav.tabs is a child of header.top (sticky, z-index 20), so its z-index 25 only counts inside the header and #roundbar (z 24) paints over it. The bar is also 115 px tall at 390 px (it wraps to two rows) while main gets only 92 px bottom padding, so the last card on every page is partly hidden.

- Evidence: 390×844 and 360×640: build a Round (Today → Start the Round → Start), then go('learn'). Measured: tabs top 781, roundbar 729–844 (360: 553–640). Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-roundbar-learn-390.png and -360.png: no tab bar visible, last module card cut by the bar.
- Fix: Move the phone #roundbar rule below the base rule (or raise its specificity), lower #roundbar to z-index 19 or move nav.tabs out of header.top on phone. Make the bar one row on phone (hide .pips and the label under 420 px, keep Go/Skip/✕), and set `body.inround main{padding-bottom:calc(92px + <bar height>)!important}` inside the same media query.

### T28-2 · simDebrief() · Key steps table · `ui8.js`

The Key steps table in the sim debrief is not wrapped in .tw, and .tbl has min-width:420px, so on phones the whole page scrolls sideways (72 px at 390, 102 px at 360) and the 'You' column ('missed') is off screen.

- Evidence: openCase('sim-sepsis'); simEnd('end') at 390×844: documentElement.scrollWidth − clientWidth = 72. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sim-debrief-390x844-pixel-dark-end.png (target column clipped at the card edge).
- Fix: Wrap the table in `<div class="tw">…</div>` like the lesson tables, or give it `class="tbl" style="min-width:0"` with the target column `white-space:nowrap`.

### T28-3 · .tw / .tbl (lesson tables on phone) · `shell.html`

Wide lesson tables scroll inside .tw, but nothing shows that they scroll: touch scrollbars are invisible and there is no fade or hint. On the RTA lesson the table has four columns (Type 1, 2 and 4); at 390 px only Type 1 and half of Type 2 show, cut mid-word ('Cannot reclaim HCO', 'Usually 12–2'), and Type 4 is never seen. Same for the compensation table (Limit and Time columns hidden) and the interpreter formulas table.

- Evidence: openLesson('rta') at 390×844: .tw scrollWidth 458 vs clientWidth 306. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-lesson-rta-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-lesson-comp-390x844-pixel-dark.png.
- Fix: Add a scroll affordance to .tw: `background:linear-gradient(to right,var(--surface) 30%,transparent) left/24px 100% no-repeat local, linear-gradient(to left,var(--surface) 30%,transparent) right/24px 100% no-repeat local, radial-gradient(farthest-side at 100% 50%,rgba(0,0,0,.35),transparent) right/10px 100% no-repeat scroll` plus a small 'Swipe →' caption when scrollWidth > clientWidth. Better for 3+ column tables under 560 px: stack rows as cards (`.tbl.stack td::before{content:attr(data-th)}`).

## Minor

### T28-4 · .bub (class collision with .brand .bub) · `shell.html`

The 4.6 chat-bubble rule `.bub{max-width:…;padding:8px 12px;border:2px solid var(--line);background:var(--surface);display:grid}` also hits the brand logo `.brand .bub`. The logo square becomes 28×22 with a grey border and padding instead of the 22×22 orange pixel bubble, on every screen and in both skins.

- Evidence: Computed at 1280×800: .brand .bub offsetWidth 28, height 22, padding 8px 12px, border 2px, display grid. Visible in every header shot, e.g. /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-today-390x844-pixel-dark.png.
- Fix: Rename the chat bubble class (e.g. .cbub in ui8.js caseBubble and the CSS at line 555–556), or scope it as `.chat .bub`.

### T28-5 · .seg.wrap (class collision with .wrap) · `shell.html`

Segments given `class="seg wrap"` (case filters, glossary filter, gas-log tags, Davenport/vent/lung scenario pickers) also get the page container rule `.wrap{max-width:1040px;margin:0 auto;padding-left/right:16px}`. They are centred instead of left-aligned and have 16 px of empty padding before the first button; Presentation wraps 'On the ventilator' onto a lonely second row.

- Evidence: go('cases') at 1280×800: Format/Setting/Exam segs centred, Presentation full width with inner padding. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-cases-1280x800-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-dav-1280x800-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-gloss-1280x800-pixel-dark.png. Used in e3.js (5), ui8.js (2), ui6.js, ui9.js.
- Fix: Rename the modifier to `.seg.wrapping` (or `.seg-wrap`) in shell.html line 539 and the 9 call sites. .seg already has flex-wrap:wrap, so the modifier can simply be removed.

### T28-6 · .urow .eq (unit converter swap button) · `shell.html`

The unit converter's ⇄ cell uses class .eq, which also matches the formula-box rule `.eq{background;border:2px;border-left:5px solid var(--accent);padding:10px 14px;margin:0 0 12px}`. The swap control looks like a stray formula block, sits 12 px higher than the inputs and has an orange left bar.

- Evidence: openTool('units') at 390×844 and 360×640. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-units-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-units-390x844-clinical-light.png.
- Fix: Rename to `.urow .swap` (ui3.js and shell.html line 499) and style it as a real .iconbtn (44×44, aria-label 'Swap direction'), or reset: `.urow .eq{background:none;border:0;margin:0;padding:0 0 8px}`.

### T28-7 · .hrow (4.4 redefinition hits the header) · `shell.html`

The 4.4 history-row rule `.hrow{display:flex;flex-wrap:wrap;gap:4px}` (line 550) overrides the header row `.hrow` (line 63): the header gap drops from 10 px to 4 px and the header may wrap. The streak chip sits 4 px from the gear button.

- Evidence: Computed header .hrow at 1280×800: gap 4px, flex-wrap wrap.
- Fix: Rename the 4.4 class (e.g. `.hist`) in ui7.js/ui3.js/ui9.js and line 550.

### T28-8 · .autopsy (4.6 override of the session 'Why the miss?' row) · `shell.html`

`.autopsy{display:grid;gap:6px;margin:6px 0 10px}` (line 560, added for cases) overrides the original chip row `.autopsy{display:flex;flex-wrap:wrap}`. After a wrong answer in any session the four reasons are now full-width dashed rows, 172 px tall, pushing the next question down.

- Evidence: startSession('quick'), answer wrong at 390×844: .autopsy display grid, height 172 px. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-autopsy-390.png.
- Fix: Scope the 4.6 rule to the case view (`#v-cases .autopsy`) or delete it; keep the chip row.

### T28-9 · Orange Pixel @font-face (missing glyphs) · `shell.html`

The embedded pixel font has 121 glyphs and lacks ₂ ₃ ⁺ ⁻ ~ ÷ ′ ≤ ≥ Δ ⇄ and others. Text set in --px falls back to ui-monospace/Menlo (DejaVu on Linux) for those characters, so headings and readouts mix two fonts: 'Ventilator CO₂' (big fallback 2), 'HCO₃⁻ 42 mmol/L. Expected PCO₂?', the weekly '~367' reads like '~-367', timeline '0′', '[H⁺] from pH' reads as 'DH⁺]'.

- Evidence: Glyph list read from the woff with fontTools. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-vent-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-progress-390x844-pixel-dark.png (~-367), /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sess-gym-390x844-pixel-dark.png.
- Fix: Add the glyphs to the font (sub/superscript 0–9, + −, ~, ÷, ′, ≤ ≥, Δ). Until then, set the fallback stack for --px to a font with matching metrics and wrap sub/superscripts in pixel contexts with `<span class="sx">` using `font-family:var(--f-mono);font-size:.8em`.

### T28-10 · .ventw (Ventilator lab waveform) · `shell.html`

The waveform SVG (viewBox 320×120, width:100%) scales with the card: 972×365 px at 1280+ wide. The '30' limit label and 'airway pressure, 2 breaths' render at about 30 px, and the readouts are pushed below the fold. At 1440 in the clinical skin it looks like a stretched placeholder.

- Evidence: openTool('m-vent'): svg 306×115 at 390, 972×365 at 1280 and 1920. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-vent-1280x800-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-vent-1440x900-clinical-light.png.
- Fix: Cap it: `.ventw{max-height:180px}` with preserveAspectRatio='none' on the plot group and vector-effect:non-scaling-stroke, or build the viewBox from the element width in e3.js so labels stay 10–11 px.

### T28-11 · trend sparklines (.trend svg) and .sevchart (ui8.js) · `ui6.js`

Trend sparklines use viewBox 0 0 260 56 in a 641 px column at 1280, so each line is drawn 260 px wide in the middle of the cell with ~190 px empty on each side, and there are no time ticks. The sim debrief severity chart has the same problem (viewBox 300 wide); after a short sim it is an almost empty 70 px band.

- Evidence: Gas log → tag 'Bed 4 DKA' at 1280×800: svg 641×56, viewBox 0 0 260 56. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-trend-1280.png; debrief /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sim-debrief-1280x800-pixel-dark.png.
- Fix: Set preserveAspectRatio='none' and vector-effect='non-scaling-stroke' on the lines/dots (draw dots as HTML or keep r small), or compute the viewBox width from clientWidth. Add the first/last times under the line. In simDebrief, hide the chart when CS.t < 2 min.

### T28-14 · speed drills (v-speed) · `ui7.js`

Speed drills (4.4) look and behave unlike sessions: the bottom tab bar stays visible during a timed drill (sessions hide it with body.insession), the header is a '← Practice' crumb instead of the .sbar with ✕ and pips, answers use .btn.spo (bold, no number key) instead of .opt with kbd, and the .spgas tiles put 'mmHg' on a second line only for PCO₂, so the numbers sit at different heights (HCO₃⁻ has no unit at all).

- Evidence: startSpeed('five'|'noisy'|'pflash'|'handover') at 390×844 and 360×640. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-speed-five-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-speed-handover-390x844-pixel-dark.png.
- Fix: Add body.insession in RENDER.speed (remove on done), reuse the .sbar markup and .opt buttons, and put units in the small label for all three tiles ('PCO₂ · mmHg', 'HCO₃⁻ · mmol/L').

### T28-16 · .slip td (analyser printout at 360 px) · `shell.html`

At 360 px the printout table wraps: '+13.9' and its 'H' flag split onto two lines and the reference '7.35–7.45' breaks over two lines, so rows lose alignment.

- Evidence: startSession('steps') at 360×640. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sess-steps-360x640-pixel-dark.png.
- Fix: `.slip td{white-space:nowrap}` and hide the reference column under 380 px (`@media(max-width:380px){.slip td:nth-child(4){display:none}}`), as .fitc already does.

### T28-17 · openRoundBuilder() sheet · `ui5.js`

The Round builder uses native browser checkboxes (blue, 13 px, below the 44 px touch target) that break the pixel look. On 360×640 only four legs fit and the Start button is below the fold with no sticky footer, so the user must scroll the sheet to start. On desktop it is a phone-style bottom sheet floating in the middle of the screen.

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-builder-360x640-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-builder-1280x800-pixel-dark.png.
- Fix: Style checkboxes (appearance:none, 22×22, 2 px border, accent fill with a pixel tick) and make the whole .srow the tap target. Make the button row `position:sticky;bottom:0;background:var(--surface)` inside .sheet. Above 760 px, centre the sheet (`.sheet-scrim{align-items:center}`).

### T28-19 · .seg button (touch targets) · `shell.html`

The 4.1 44 px rule skipped segmented buttons. .seg button is about 30 px tall (padding 7px, 10 px font): difficulty, gases per session, Arterial/Venous, confidence (Sure/Think/Guess), case filters, theme and skin pickers.

- Evidence: Measured visually at 390×844, shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-practice-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-cases-390x844-pixel-dark.png.
- Fix: Add `.seg button{min-height:44px}` to the 4.1 block (or 40 px with 2 px gap).

### T28-20 · light theme tokens (--accent as text, --muted on --surface-2) · `shell.html`

Light theme contrast fails WCAG AA for small text in several places: --accent #F26A1B on --surface is 2.84:1 (used as text in .qk b, .hero-legs li::before, .method6 counters, .lvlpill .num); --muted on --surface-2 and on --accent-soft is 4.25:1 (9 px .mt small, .keys dt, .badge-tile, .teachbar); .hint b (--warn on --warn-soft) is 3.63:1 at 9 px.

- Evidence: Computed from the tokens on :root (relative luminance formula). Dark theme passes everywhere checked (muted 6.4:1).
- Fix: In light theme use --accent-ink (#B9480A, 4.9:1) for text, darken --muted to about #685C4F, and set --warn to about #8A5600 for text on --warn-soft.

### T28-21 · type scale (9–10 px text, both skins) · `shell.html`

Much of the interface is 9–10 px: phone tab labels (9 px), .tile small.meta, .mt small, .tbl th, .keys dt, .legend, .hint b, .conf, .hintbtn, .stats small, eyebrows (10 px). The audit found 9 px text in 56 of 66 views at 390 px. In the clinical skin --px becomes Atkinson, so the same sizes are tiny body text, and tile titles (.tile b, 12 px) are smaller than their descriptions (13.6 px).

- Evidence: Audit across all views (getComputedStyle font-size < 11.5 px). Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-practice-1440x900-clinical-light.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-today-390x844-clinical-light.png.
- Fix: Floor small pixel text at 10 px and body text at 12 px. Add a clinical scale: `html[data-skin=clinical] .eyebrow,.tile small.meta,.mt small,.tbl th,.chip,.seg button,nav.tabs button{font-size:12px}` and `html[data-skin=clinical] .tile b{font-size:15px}`.

### T28-28 · startSession() timer from a previous timed session · `ui2.js`

If startSession() is called while a timed session (Final check or Boss) is still running, the new untimed session ends at once with 'Time up', 0/0. Going through Practice or ✕ first is fine, so this hits deep links and any code path that chains sessions.

- Evidence: startSession('final'); startSession('today') → 'MIXED SESSION · TIME UP … 0 GASES'. Same with boss → steps. Verified with page.evaluate.
- Fix: clearInterval/clearTimeout of the previous session timer at the top of startSession().

### T28-29 · document head (standalone buffer.html) · `shell.html`

The built file starts with <title> and has no <!doctype html>, <meta charset> or viewport meta. Opened as a file, it renders in quirks mode (document.compatMode 'BackCompat'), and in 2 of about 20 headless launches Chromium decoded it as windows-1252, giving mojibake everywhere ('ðŸ”¥', 'Â·', 'Guillainâ€"BarrÃ©'). The PWA index.html is fine. Probably harmless inside the artifact wrapper, but any direct open of buffer.html is at risk. (Doubt: frequency depends on the browser's encoding guess.)

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-today-390x844-pixel-light.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-autopsy-390.png show the mojibake; document.compatMode = BackCompat in every run.
- Fix: If the artifact host allows it, prepend `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`, or have build.py write a separate standalone copy with them.

## Polish

### T28-12 · new model readouts (.stats) vs original (.ro) · `e3.js`

The 4.4–4.6 models (lung, kidney, ventilator, curve in motion) show readouts as unboxed .stats with 9 px uppercase captions, while the original models use boxed .ro tiles. Because .stats small is text-transform:uppercase, units are wrong: 'MMHG', 'ML/KG PBW', 'CMH₂O', 'PAO₂'.

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-vq-390x844-pixel-dark-end.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-vent-390x844-pixel-dark-end.png vs /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-hh-390x844-pixel-dark-end.png.
- Fix: Use the ro() helper from ui3.js (`<div class="readout">`+ro(...)) in e3.js, or at least `.stats small{text-transform:none}` for model readouts.

### T28-13 · .btn.primary.small vs .btn.small · `shell.html`

Primary small buttons use the pixel font at 10 px, plain small buttons use 13.8 px bold body text. Side by side they look like two different systems: 'Hand over' next to 'Pause / Wait 5 min', 'Play' next to 'Step', 'Save' next to 'Cancel', 'Drill Consistency check'. The primary is visually the weakest label in the row.

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sim-1280x800-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-dav-390x844-pixel-dark-end.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-savesheet-390x844-pixel-dark.png.
- Fix: Give `.btn.primary.small` 11px pixel with min-height 44 and the same padding as .btn.small, and use the pixel font at 11–12 px for all small buttons (or body font for all). Keep one rule.

### T28-15 · simRender() actions and layout · `ui8.js`

Timed sim: the tab bar stays visible while the clock runs; action buttons are inline-wrapped with ragged widths; the group headings (Tests / Treatment / Call for help) touch the button above with no top margin; on desktop the short Results card sits beside a long Actions column with a large empty area under it.

- Evidence: openCase('sim-dka') at 390×844 and 1280×800. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sim-390x844-pixel-dark-end.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sim-1280x800-pixel-dark.png.
- Fix: Add body.insession while a sim runs. Lay actions out as `.acts{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}` with full-width buttons; give the group h3 `margin:12px 0 6px`; make the Results/Events column sticky on ≥861 px.

### T28-18 · input[type=checkbox] (Settings · Quiet mode) · `shell.html`

Settings Quiet mode is also a native blue checkbox, the only native control left in an otherwise styled page.

- Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-settings-390x844-pixel-dark.png.
- Fix: Apply the same pixel checkbox style globally: `input[type=checkbox]{appearance:none;width:22px;height:22px;border:2px solid var(--line-2);background:var(--raise)} input[type=checkbox]:checked{background:var(--accent);border-color:var(--accent)}` plus a tick.

### T28-22 · clinical skin leftovers · `shell.html`

The clinical skin keeps several pixel-only treatments: hard offset shadows on .hero, .slip, .bigscore, .flashcard and .brand .bub; the zig-zag tear under .slip; and `*{border-radius:10px!important}` rounds things that should stay square or become pills (progress pips, .xpbar, heat-map cells, .qn, inner .seg buttons each rounded inside a rounded group).

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-today-1280x800-clinical-dark.png (hero shadow), /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sess-steps-390x844-clinical-light.png.
- Fix: Replace the blanket radius with a scoped list (.card,.btn,.tile,.opt,.inp,.sheet,.seg → 10px; .seg button → 8px; pips/bars/heat cells → 2px), and add `html[data-skin=clinical] .hero,.slip,.bigscore,.flashcard{box-shadow:0 2px 10px rgba(0,0,0,.15)}`.

### T28-23 · .gl (German glossary cards) · `shell.html`

Glossary cards stretch to the row height and their grid spreads the extra space, so the German word sits at different heights in neighbouring cards ('die Spritze', 'die Arteria radialis' float to the middle). The cards also skip the app's .card bevel and notch.

- Evidence: go('gloss') at 1280×800. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-gloss-1280x800-pixel-dark.png.
- Fix: `.gl{align-content:start}` and add the .card class (or its bevel box-shadow) to .gl.

### T28-24 · Learn view · German glossary tile · `ui9.js`

The glossary tile is rendered in its own .tiles grid above the method card, so on desktop it is a single 230 px tile with two thirds of the row empty. Concept web and Pocket card are in a second row below with the same problem.

- Evidence: go('learn') at 1280×800. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-learn-1280x800-pixel-dark.png.
- Fix: Put the glossary tile in the same .tiles row as Concept web and Pocket card (three tiles in one row).

### T28-25 · model canvas labels (ODC, red cell, Davenport) · `e2.js`

Canvas labels collide with the drawing: 'dashed = normal' is drawn over the steep part of the curve, 'band 3' overlaps the cell edge and the white band, and the Davenport y-axis title is clipped to 'HC' at 390 px. In e3.js the lung model's 'dead space 30%' label is crossed by its own vertical line.

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-odc-390x844-pixel-dark-end.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-rbc-390x844-pixel-dark-end.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-dav-390x844-pixel-dark-end.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-model-vq-390x844-pixel-dark-end.png.
- Fix: Move 'dashed = normal' to the lower right, outside the plot; place 'band 3' outside the membrane with a leader line; add left padding so the y title fits; offset lung-model labels from the lines (and fix the same in e3.js).

### T28-26 · .heat i.l1/.l2/.l3 (dark theme) · `shell.html`

In the dark theme the heat-map scale is out of order: l1 (--accent-soft #431407) is almost the same as an empty cell, and l2 (--hi #FDBA74, pale peach) is brighter and more eye-catching than l3 (--accent #F97316), so busy days look less busy than medium days.

- Evidence: go('progress') with seeded days. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-progress-1280x800-pixel-dark.png.
- Fix: Use a monotonic ramp in dark: l1 #7C2D12, l2 #C2410C, l3 #F97316 (and keep today's outline).

### T28-27 · session summary (phone) · `ui2.js`

At 390 px the summary head puts the 110 px score box beside a 16 px pixel headline that wraps to four lines; '1720 XP' falls onto its own row; the 'Cases' eyebrow shows with an empty list; the quiet 'Today' button floats below as plain text.

- Evidence: Start a timed session then another (see the timer finding), or finish any session. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sess-today-390x844-pixel-dark.png.
- Fix: Stack .sumhead under 480 px (`grid-template-columns:1fr`), hide the Cases block when empty, and put Go again / Practice / Today in one .btnrow with the same button style.

### T28-30 · Today hero title · `ui1.js`

'One composed session · about 24 minutes' with text-wrap:balance breaks before the middle dot, so line 2 starts with '· about 24 minutes'.

- Evidence: 390×844 and 360×640. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-today-390x844-pixel-dark.png.
- Fix: Use a non-breaking space before the dot ('session\u00a0· about…') or put the duration on its own line as a small subtitle.

### T28-31 · .gymq / .ask / .qblock headings in the pixel font · `shell.html`

Long questions are set in the pixel font: boss questions (.gymq, two to three lines), case prompts (.ask, accent 12 px), the teach-back prompt and Final check 'What is the read?'. Multi-line pixel text is hard to read and inconsistent with session questions, which use the body font.

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sess-boss-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-case-img-390x844-pixel-dark.png.
- Fix: Keep the pixel font for the eyebrow only and set question text in the body font at 1.05rem bold, like .qblock h3.

### T28-32 · caseLib() filters on phone · `ui8.js`

The four filter groups take the whole first phone screen (Presentation alone wraps into five rows), so no case is visible without scrolling.

- Evidence: go('cases') at 390×844. Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-cases-390x844-pixel-dark.png.
- Fix: Under 560 px, render each group as a single horizontally scrolling chip row (`.seg{flex-wrap:nowrap;overflow-x:auto}`), or collapse filters behind a 'Filter (0)' button.

### T28-33 · image cases · gap above the image · `ui8.js`

Image-led cases show a larger gap (about 50 px) between the intro card and the image card than between other cards. Probably the empty .chat container (margin 12px 0) plus the view gap. (Doubt: cause not confirmed in the DOM.)

- Evidence: openCase('im-capno'), 'im-syringe', 'im-dip' at 390×844. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-case-img-390x844-pixel-dark.png.
- Fix: Do not render an empty .chat container for image cases, or use `.chat:empty{display:none}`.

### T28-34 · interpreter toolbar · `ui3.js`

'Load an example…' is a native select pushed to the far right on its own row, away from the paste box it fills. 'Photo of printout' (ui10.js) uses the copy icon.

- Evidence: openTool('interp') at 390 and 1280. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-interp-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-interp-1280x800-pixel-dark.png.
- Fix: Put the example picker inside the Paste-a-printout card, next to Read values, styled like .btn. Add a camera icon to ic() and use it in ocrButton().

### T28-35 · gas log entries · `ui6.js`

In each log entry the Open/Share/Delete buttons come before the read title, and Delete looks like the other two (no .danger) although it removes data.

- Evidence: Shot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-log-390x844-pixel-dark.png.
- Fix: Order: meta line, title, printout, then the action row; give Delete `.btn small danger` and move it to the end.

### T28-36 · .sheet variants (hand kit, builder, save, OCR) · `shell.html`

The four sheets differ: the hand-kit and builder sheets have a grab handle and a 10 px pixel <b> title; the 4.3 save sheet and 4.9 OCR sheet have no handle and an 18 px h2. Inputs in these sheets (.fld input, background var(--bg)) differ from the interpreter inputs (.inp, background var(--raise)).

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-builder-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-savesheet-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-ocrsheet-390x844-pixel-dark.png.
- Fix: Give all sheets the same header (grab + h2 at 16 px pixel) and use one input style: `.fld input,.fld textarea{background:var(--raise)}`.

### T28-37 · .sbar sticky top · `shell.html`

The session bar sticks at top:56px but the header is 62 px tall, so the top 6 px of the bar slide under the header when scrolling.

- Evidence: startSession('steps'), scroll 500 px at 390×844: header bottom 62, .sbar top 56.
- Fix: Use a shared variable: `--hdr:62px` on :root, `.sbar{top:calc(env(safe-area-inset-top,0px) + var(--hdr))}` and the same for .side and .stick.

### T28-38 · .ctrls (tool inputs on phone) · `shell.html`

minmax(180px,1fr) gives one input per row inside a 306 px card at 390 px, so short numeric fields (pH, PCO₂, rate, weight) each take a full row and the results are below the fold on every tool.

- Evidence: openTool('vbg'|'oxy'|'hh'|'vent'|'bicarb') at 390×844. Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-vbg-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-tool-hh-390x844-pixel-dark.png.
- Fix: Use minmax(130px,1fr) for numeric tools (or the existing .ctrls.tight), keeping selects full width with grid-column:1/-1.

### T28-39 · teach / est / flash / serial views · `ui5.js`

These views have no back crumb, while speed drills, cases, tools and lessons all have '← Practice' or '← Labs'. On desktop there is no way back except the top tabs.

- Evidence: go('teach'|'est'|'flash'|'serial'). Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-teach-390x844-pixel-dark.png etc.
- Fix: Add the same `.crumbs` with '← Practice' to each renderer.

### T28-40 · .vig (4.4 override) · `shell.html`

`.vig{margin:0;font-style:italic}` (line 548) makes every vignette in sessions, cases and drills italic, including three-line vignettes. Long italic text is harder to read, and the original style was upright.

- Evidence: Shots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-sess-steps-390x844-pixel-dark.png, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T28-case-chat-390x844-pixel-dark.png.
- Fix: Scope the italic to speed drills (`.spcard .vig`) or drop it.

## Ideas (ranked by value)

1. **T28-41 · wide screens (≥1440)** (`shell.html`): At 1440 and 1920 the 1040 px column uses 54–72% of the width; Today and Progress are long single columns with large side margins. At ≥1400 px widen .wrap to 1240 px and give Today a two-column layout (Round + plan left; Gas of the day + mastery right). Progress can put heat map, accuracy and autopsy side by side.

2. **T28-42 · sim vitals on phone** (`ui8.js`): On 360×640 the clock and vitals fill the first screen, and while scrolling actions you lose sight of the vitals. Under 560 px, make a compact sticky vitals strip (time · HR · BP · SpO₂ · severity bar) at the top while the sim runs.

3. **T28-43 · visual regression check** (`shell.html`): Most bugs here are CSS class collisions from later versions (.bub, .wrap, .eq, .hrow, .autopsy, .vig, .spark, .pocket redefined). Add a build-time check in build.py that warns when a class selector is defined twice in shell.html, and keep a screenshot run of the 66 views in the tests folder.

4. **T28-44 · one button and card system** (`shell.html`): Old and new features use different building blocks for the same job: .opt vs .spo vs .act buttons; .ro vs .stats vs .spgas readouts; .card vs .gl vs .fb boxes. Write a short component list in shell.html's header comment (answer button, readout tile, info card, sheet) and move 4.3–4.9 markup onto it.
