# T23 — Progress screen and game layer (Quiet vs Game mode)

## Summary
**Covered:**
- Progress (RENDER.progress in ui5.js), with the weekly review card (ui6.js) and the Yuzu button (ui9.js).
- Mastery score and the 15-pattern grid (Today).
- Accuracy by step, error autopsy and advice, calibration.
- 4-week heatmap and streak, training numbers and sparkline, teach-backs, badges.
- Quiet vs Game mode: the .gamey hiding, the text walker, toasts, hold-to-explain hints.

**Method:**
- Seeded realistic states: a 9-day streak, gaps over 5 weeks, 5 patterns at different stages, step histories, why/conf data, 8 sessions of mixed modes, teach-backs, badges and lesson misses.
- Also ran real gym and module-check sessions.
- Checked every number by hand: mastery 13% = 10/75; comp 60% from the last 20; calibration 70/75/33.
- Viewports: 390, 820, 1280 and 1440. Pixel/clinical skins, dark/light themes.
- Screenshots: `shots/T23-*.png`.

**Verdict:** the arithmetic shown is right (mastery, step accuracy, autopsy shares, calibration, training numbers, level bar). The weaknesses are in what gets counted and how it is labelled:
- Gym and module-check work does not count as a study day.
- 'Gases' means three different things on one screen.
- The week card's 'weakest' figures are all-time and can be from 1–3 attempts.
- 'Drill Anion gap' may drill no anion gap at all.
- Calibration scores a different outcome from the one the user rated.

Quiet mode works for the header, the level pill and badges. It leaks in several places:
- 'boss fight' and 'BOSS ✓' on Learn;
- the XP stat on session summaries;
- '+N XP.' on Shifts;
- the badge/XP hint on the check row;
- 'Boss questions' on Progress;
- level-up confetti and a misleading 'Mastery updated' toast.

The empty states read well.

**Score: 6/10**

## Findings

### Critical (0)
None found.

### Major (9)
- **T23-1** · `ui2.js` · answerGym (gym and boss branches); touchDay
  - **Problem:** A full Compensation gym session or a module check (boss) never marks the day as active and adds nothing to the day's gas count. Only S.sess is written. So gym-only or check-only days break the streak, leave the heatmap blank and give '0/7 days studied', while the same week card counts the work as 'gases'. The header hint promises the streak counts 'at least one gas, lesson or Round'.
  - **Evidence:** Fresh state, startSession('gym'), answer all 10, then finishSession: S.days=[], S.dayN={}, streak()=0, todayN()=0, and Progress shows '0/7 days studied' and '0 day streak' next to '10 gases · 50%'. A 10-question boss session behaves the same (S.days still []). Source: ui2.js:211-212 has no touchDay, unlike the else branch at :213.
  - **Fix:** In answerGym call touchDay(1) for gym and boss too, or touchDay() at least, so the day counts. Better: one helper logActivity(kind,n) that updates days, dayN and sess together (see idea 1).
- **T23-2** · `ui6.js` · weeklyReview() n / weeklyCard 'gases'
  - **Problem:** The week card's 'gases' total sums S.sess[].n across all modes. It counts compensation-gym sums, boss multiple-choice questions, sim key actions (m:'sim', n=c.key.length) and case steps as 'gases'. It also disagrees with the heatmap (dayN) and the header (S.read) on the same screen. The '~minutes' (n×1.2) and the Citrus line inherit the error.
  - **Evidence:** Seeded week: the heatmap shows 0+7+15+4=26 gases Mon–Thu while the week card says 56 gases, with 10 boss questions, 4 sim actions and 20 reflex items in the total. Real flow: one gym session gives 'Mastery 0% · 0 Rounds · 0 gases' in the header with '10 gases' in the week card. Screenshot T23-seed-quiet-desk.png.
  - **Fix:** Count only gas items: filter sess by gas modes (steps, quick, fit, reflex, mist, due, gotd, final, five, noisy, pflash, handover, case) and report gym sums and check questions separately ('10 gases · 20 sums · 10 check questions'). Or derive the week's gases from S.dayN so the card and the heatmap agree.
- **T23-3** · `ui6.js` · weeklyReview() steps/pats; weeklyCard 'Weakest steps/patterns'
  - **Problem:** The 'This week' card's weakest steps and patterns are all-time figures (stepAcc = last 20 ever; kinds c/n all-time), not this week's. Weakest steps also has no minimum sample, so a step tried once at 0% heads the list and goes to Citrus as 'weakest step X 0%'. Today's weakestStep() needs n≥3. Non-step entries (boss, fit, serial, gym) also qualify as 'steps'.
  - **Evidence:** Seed steps.gap n=3 c=1 → 'weakest step Anion gap 33%' from 3 attempts. With S.steps={fit:{n:4,c:0},boss:{n:3,c:0}} the card says 'Drill Which gas fits' and the Citrus line says 'weakest step Which gas fits 0%.'
  - **Fix:** Either label it honestly ('Weakest overall') or compute per-week accuracy by storing a date with each step result (h entries as [ok,day]). Require n≥5 and limit to the read steps (real, ph, prim, comp, gap, delta, ox, read) as in weakestStep().
- **T23-4** · `ui6.js` · #wkDrill handler
  - **Problem:** 'Drill <step>' runs a generic startSession('steps') with no focus on that step. At S.lvl<3 the session has no anion gap or Δ ratio question at all, so 'Drill Anion gap' drills nothing about the anion gap. 'Drill Which gas fits' or 'Drill Boss questions' also open a step-by-step session.
  - **Evidence:** S.lvl=2, weakest = gap: click Drill Anion gap → SS.mode 'steps', lvl 2, question cats ['ph','prim','read','cause'] (no gap).
  - **Fix:** Map each step to a mode: comp→gym, fit→startSession('fit'), gap/delta→startSession('steps',{lvl:Math.max(3,S.lvl),focus:c}) with genCase picking kinds where the step applies (HAGMA/NAGMA mixes), ox→lvl 4. Hide the button for boss/serial.
- **T23-5** · `ui1.js` · addXP() level-up in Quiet mode
  - **Problem:** In Quiet mode, crossing an XP level threshold still fires confetti() and shows the toast 'Mastery updated' (rewritten from 'Level up: …'). Mastery (pattern boxes) has nothing to do with XP, so the toast is false and appears at random moments. The confetti breaks the 'quiet game feel' roadmap decision.
  - **Evidence:** S.quiet=true; S.xp=145; addXP(10) → #confetti canvas exists and toast 'Mastery updated'.
  - **Fix:** In addXP: if(after>before&&S.quiet===false){toast(...);confetti();}. Drop the 'Level up → Mastery updated' rewrite in toast().
- **T23-6** · `ui1.js` · Quiet-mode MAP / Learn view
  - **Problem:** Game words remain on the Learn screen in Quiet mode: the subtitle 'Each module ends in a boss fight.' (lowercase is not in MAP) and the chip 'BOSS ✓' on passed modules.
  - **Evidence:** Quiet default, any state with a module check passed → go('learn'): text scan finds 'From the proton to the bedside. Each module ends in a boss fight.' and 'BOSS ✓'.
  - **Fix:** Write Quiet-aware strings at source: ui1.js:159 S.quiet!==false?'Each module ends in a module check.':'…boss fight.'; ui1.js:163 chip text S.quiet!==false?'CHECK ✓':'BOSS ✓'. Or add case-insensitive MAP entries /boss fight/gi and /BOSS ✓/.
- **T23-7** · `ui2.js` · finishSession summary stats
  - **Problem:** The session summary shows the XP total ('420 XP') in Quiet mode. The stat block is not .gamey and has no Quiet check.
  - **Evidence:** Quiet mode, finish any session (e.g. boss, final, steps) → the summary stats show '<n> XP'. A text scan of the summary finds 'XP'.
  - **Fix:** Add class 'gamey' to the XP stat div at ui2.js:243 ('<div class="gamey"><b>'+S.xp+'</b><small>XP</small></div>').
- **T23-8** · `ui2.js` · answerQ → S.conf.push (calibration)
  - **Problem:** Calibration does not measure what the user rated. The 'How sure?' picker sits on the final 'read' question, but the stored outcome is allAB (every earlier acid–base step right and unassisted). A user who is 'sure' of a correct full read but slipped on the pH step counts as 'sure but wrong'. The rating is also given after the earlier steps' feedback is already on screen.
  - **Evidence:** ui2.js:162 S.conf.push({c:C.conf,ok:allAB}); the conf picker is on cat 'read' (ui2.js:72). The Progress card labels it 'how often you are right'.
  - **Fix:** Store ok as the read answer itself (o===q.a&&!C.assist[i]), or move the confidence picker to before the first step and keep allAB, but label it clearly ('right on every step'). Do not push when C.conf is undefined.
- **T23-9** · `ui5.js` · RENDER.progress Accuracy by step; ui1.js STEPNAME.boss
  - **Problem:** In Quiet mode 'Boss questions' appears as a row in 'Accuracy by step' and in its hint. Module-check multiple-choice questions are not a step of reading a gas. 'Which gas fits' and 'Serial gases' are mixed in as well. Their hint says 'Hints for this step stay open / are behind a tap', which means nothing for these modes.
  - **Evidence:** Seeded steps.boss → row 'Boss questions 90% 10'. Hold the row: bubble 'Boss questions / 90% over your recent attempts … Hints for this step are now behind a tap.' (Quiet mode on).
  - **Fix:** Split the card: 'Steps of a read' (real…ox, cause, whatif) and 'Other drills' (fit, serial, module checks). Rename STEPNAME.boss to 'Module check questions' (or make it Quiet-aware). Only add the hint sentence for steps that have hints.

### Minor (13)
- **T23-10** · `ui5.js` · RENDER.progress eyebrow; heat cell data-hint
  - **Problem:** Plurals are wrong: '1 Rounds', '1 gases' in the Progress eyebrow; '1 gases' in heatmap day hints and on the Today mastery card legend (ui1.js:143).
  - **Evidence:** S.read=1, S.roundsDone=1 → 'MASTERY 13% · 1 ROUNDS · 1 GASES'. Heat hint for 07/11 → '1 gases'. Today mastery legend '1 gases'.
  - **Fix:** Use a plural helper pl(n,'gas','gases') in ui5.js:305, the heat hint (ui5.js:302) and ui1.js:143.
- **T23-11** · `ui1.js` · Learn eyebrow '… boss badges' → Quiet 'module checks'
  - **Problem:** The count is Object.keys(S.badges).length, so it includes Native reader, Week of gases, Ten Rounds and Automatic. Quiet mode then calls them all 'module checks'. With one badge it reads '1 module checks'.
  - **Evidence:** S.badges={m-chem, native} → '0 of 98 lessons · 2 module checks'; with only m-chem → '1 module checks'.
  - **Fix:** Count only keys starting with 'm-' and pluralise: n+' module check'+(n===1?'':'s')+' passed'. Fix the MAP entry /boss badges?/ to keep the singular.
- **T23-12** · `ui5.js` · scenario complete text (RENDER.scen, line 189)
  - **Problem:** In Quiet mode a finished Shift still says '+25 XP.'. The walker only strips ' · +N XP', and here the XP follows a full stop and a space.
  - **Evidence:** Walker probe: the text node 'Clean run: every call right first time. +25 XP.' is unchanged after the walker runs. The same string is built at ui5.js:189.
  - **Fix:** Wrap it: (S.quiet===false?' +'+xp+' XP.':''). Or broaden the MAP regex to /\s*[·.]?\s*\+\d+ XP\.?/g.
- **T23-13** · `kit.js` · HINTS '.bossrow'
  - **Problem:** In Quiet mode, holding the module-check row shows 'Module check / Timed questions from the whole module. 80% wins the badge and 120 XP.' The XP and badge wording remain.
  - **Evidence:** Learn → open a module → hold .bossrow .note: bubble text captured as above.
  - **Fix:** Make the hint Quiet-aware: 'Timed questions from the whole module. 80% passes.' Add the badge/XP clause only when S.quiet===false. Do the same for the '.badge-tile' and '#hdr-xp' hints (hidden in Quiet, so lower priority).
- **T23-14** · `ui2.js` · MODES.final.d and DEEP 'final' card (line 18); startSession toast line 99
  - **Problem:** The Practice 'Final check' card still says 'Ten right earns the Native reader badge.' in Quiet mode, and the toast 'No boss for this module yet.' is never rewritten.
  - **Evidence:** Quiet scan of Practice: 'Twelve full reads in ten minutes. Ten right earns the Native reader badge.' Toast probe: 'No boss for this module yet.' unchanged.
  - **Fix:** Quiet text: 'Ten right passes the final check.' Toast: 'No module check for this module yet.'
- **T23-15** · `ui1.js` · Quiet-mode walker (MutationObserver, 120 ms debounce)
  - **Problem:** Game words show for up to about 120 ms before the walker replaces them, on every render and every hint bubble. 'Boss fight' briefly flashes on screen before it becomes 'Module check', and the rewriting costs a full-document TreeWalker pass after every mutation.
  - **Evidence:** The hold test captured the first bubble text before the replacement; the source uses setTimeout(walk,120).
  - **Fix:** Replace the DOM walker with a word function at source (gw('Boss fight') → 'Module check' in Quiet) used by ui1, ui2, ui5 and kit. Keep the walker only as a safety net.
- **T23-16** · `ui5.js` · RENDER.progress badge awards (streak7, round10, reflex4)
  - **Problem:** Streak, Rounds and Reflex badges are awarded only when the Progress screen is rendered. The date stored is the visit date, not the day the condition was met. A 7-day streak that ends before the user opens Progress never earns the badge.
  - **Evidence:** Seed streak reached 7 days on 07/11 (later 9). The first Progress visit on 13/11 stores badges.streak7='13/11/2026' ('Won 13/11/2026').
  - **Fix:** Check these badges where the state changes: touchDay() for the streak, roundFinish() for Rounds, reflex session end for reflex4. Store that date.
- **T23-17** · `ui5.js` · Training numbers sparkline data-hint
  - **Problem:** Sessions from the case library and timed sims show raw mode ids in their hint ('case', 'sim') because MODES has no entries for them.
  - **Evidence:** Hold the 4th spark bar: 'case / 2/5 on 10/11/2026'; another shows 'sim / 3/4 …'.
  - **Fix:** Add MODES.case={t:'Case library',hidden:true} and MODES.sim={t:'Timed sim',hidden:true} in ui8.js, or map them in the hint.
- **T23-18** · `ui8.js` · caseEnd touchDay(n)
  - **Problem:** Each finished library case adds its number of steps (n=c.steps.length) to the day's gas count, so one case shows as '6 gases' on the heatmap and towards the 15/day goal.
  - **Evidence:** ui8.js:61 touchDay(n) with n=c.steps.length.
  - **Fix:** Use touchDay(1) per case (one gas), or show cases separately.
- **T23-19** · `kit.js` · HINTS '.heat' and shell.html .heat colours
  - **Problem:** The heatmap legend says 'Darker = more gases read', but in the dark theme the scale is dark brown (1–5), pale peach (6–14), orange (15+). The middle step is the brightest, so the scale is not monotonic, and 'darker' is the wrong word in dark mode. Per-cell data-hint overrides the legend, so it is almost never reachable anyway. The cells have no on-screen key.
  - **Evidence:** T23-seed-quiet-desk.png: 31/10 (9 gases) is pale peach and brighter than 18/10 (30 gases, orange). The light theme (T23-tablet-clinical-light.png) is fine.
  - **Fix:** In dark themes order l1<l2<l3 by luminance (e.g. l2: color-mix(accent 55%, surface)). Add a 4-square key 'less → more' under the grid, and reword the hint to 'Stronger colour = more gases'.
- **T23-20** · `ui9.js` · Yuzu button in weekly card
  - **Problem:** 'Send N missed points to Yuzu' sits inside 'This week' but sends every lesson miss ever (S.qmiss is never cleared, even after the question is later answered correctly). It shows 'Send 0 missed points to Yuzu' as an active button on a new profile.
  - **Evidence:** Empty profile: the button reads 'Send 0 missed points to Yuzu'. S.qmiss is only ever set (ui1.js:189) and never deleted (grep).
  - **Fix:** Disable or hide it at n=0. Delete S.qmiss[key] when the question is later answered correctly, or send only this week's misses (the stored value is a timestamp, so filter by week).
- **T23-21** · `ui5.js` · Calibration stats
  - **Problem:** Percentages show for tiny samples ('33% when "guess" (3)') with no caution. The note is static and does not say whether the user is calibrated. Ratings skipped by the user are pushed as {c:undefined}, which eats into the 300-entry cap.
  - **Evidence:** Seed: sure 70% (10), think 75% (4), guess 33% (3). 'Think' beats 'sure', but nothing is said about it.
  - **Fix:** Show '—' until n≥5. Add a one-line verdict: 'Overconfident: “sure” is right 70%, aim for 90%+' or 'Well calibrated'. In ui2.js only push when C.conf is set.
- **T23-22** · `ui5.js` · Error autopsy advice
  - **Problem:** When two reasons tie, the advice silently picks the first in WHY order (misread), and the bars do not show which reason the advice is for.
  - **Evidence:** why={misread:3,slip:3,rule:1} → advice only about misreads, with a 43%/43% tie.
  - **Fix:** When tied, show both pieces of advice, or name the reason: 'Most misses: misread (3) and slip (3).' Require ≥3 tagged misses before giving advice.

### Polish (8)
- **T23-23** · `shell.html` · .badges grid (line 451)
  - **Problem:** On a 390 px phone (Game mode) the 17 badge tiles stack in a single column, giving about 1,000 px of scrolling.
  - **Evidence:** T23-seed-game-phone.png: one tile per row.
  - **Fix:** Use grid-template-columns:repeat(auto-fill,minmax(130px,1fr)), or 2 columns under 520 px.
- **T23-24** · `shell.html` · .badge-tile b / small
  - **Problem:** Inverted hierarchy on badge tiles: the badge name is in 10 px pixel font and muted, while the description ('Module boss', 'Won 05/11/2026') is larger body text.
  - **Evidence:** T23-seed-game-desk.png Badges card.
  - **Fix:** Make the name the larger line (body font 0.9rem, bold) and the description the small one.
- **T23-25** · `shell.html` · .heat grid (14 columns)
  - **Problem:** 'Last 4 weeks' is drawn as 2 rows of 14 days that start on an arbitrary weekday, with no weekday or date labels. On desktop the grid fills only the left half of the card (max-width 560 px).
  - **Evidence:** T23-seed-quiet-desk.png heat card.
  - **Fix:** Use a 7-column, Monday-first grid (4–5 rows, matching the week card's Monday start) with M T W T F S S labels and the start date. Let it span the card width or sit beside the streak numbers.
- **T23-26** · `ui6.js` · weeklyCard placement
  - **Problem:** The week card is inserted directly under the header, above the heatmap. On an empty profile it is the largest card and is full of zeros and 'Not enough attempts yet' (twice), plus 'about 0 min' in the Citrus line.
  - **Evidence:** T23-empty-quiet-phone.png.
  - **Fix:** Show a compact empty state ('Your first week starts with one gas') until the week has data, and place the card after the heatmap.
- **T23-27** · `ui5.js` · Teach-backs list and buttons
  - **Problem:** The teach-backs list follows TEACH order, not due date. Nothing links to the due item directly. 'Settings & backup' sits oddly inside the Teach-backs card.
  - **Evidence:** Seed: Anion gap (due) is listed between two not-due items. Buttons: 'Teach one now', 'Settings & backup'.
  - **Fix:** Sort due first, then by date. Make each due row a button that opens that teach-back. Move 'Settings & backup' to a footer row of the screen.
- **T23-28** · `ui5.js` · Training numbers labels
  - **Problem:** '—  reflex automatic', 'delayed recall' and 'gas sense' have no explanation and no hint. 'Delayed recall' only counts reads of a pattern seen ≥3 days earlier, which nobody would guess.
  - **Evidence:** Hold any stat: no data-hint on the .stats divs.
  - **Fix:** Add data-hint to each stat, e.g. 'Delayed recall|Full reads of a pattern you had not seen for 3+ days: the best test of memory.' 'Reflex automatic|Highest level with 20 gases at ≥90% and median ≤8 s.'
- **T23-29** · `shell.html` · .spark (lines 374 and 536)
  - **Problem:** The class .spark is defined twice: as the Progress session bar chart (height 44 px) and later for the trends SVG (height 56 px, width 100%). The later rule wins on Progress. The sparkline has no axis or 80%/50% guide, so colour alone carries the meaning.
  - **Evidence:** shell.html:374-376 vs :536.
  - **Fix:** Rename one of them (e.g. .sessbars) and add a faint 80% guide line plus a text summary ('last 8: 4 strong, 3 weak').
- **T23-30** · `ui5.js` · heat cells and spark bars accessibility
  - **Problem:** Heat cells and spark bars are empty <i> elements whose only information is in data-hint. Screen readers and keyboard users get nothing.
  - **Evidence:** DOM: <i class="l2" data-hint="05/11/2026|14 gases"></i>.
  - **Fix:** Add role="img" and aria-label (e.g. '05/11/2026: 14 gases') to each cell, or one visually hidden summary per chart.

## Ideas (ranked by value)
1. **T23-31** · `ui5.js`
   - **Idea:** Put the 15-pattern mastery grid (now only on Today) on Progress too, with each pattern's stage, accuracy and next due date, and explain how mastery % is computed (average spaced-review stage out of 5). The screen called 'Progress' shows mastery only as a number in the eyebrow.
   - **How:** Reuse the Today grid markup in a 'Patterns' card, plus a 'due on dd/mm/yyyy' small line per tile.
2. **T23-32** · `e1.js`
   - **Idea:** Make one activity logger, logActivity(mode,n,ok), that writes S.days, S.dayN, S.sess and S.read together. This ends the three disagreeing 'gases' counts on one screen (header S.read, heatmap dayN, week card sess).
   - **How:** Add the helper in e1.js and call it from ui2, ui5, ui7 and ui8 session ends.
3. **T23-33** · `ui5.js`
   - **Idea:** In Quiet mode the badges card disappears, so passed module checks are invisible on Progress. Add a plain 'Module checks passed 2/14' line (with dates) that shows in both modes.
   - **How:** A non-gamey card listing modules with check ✓ and date.
4. **T23-34** · `ui1.js`
   - **Idea:** One slip resets a pattern from stage 5 to 0, so mastery % falls sharply (one HAGMA miss turns 13% into 7%). This is discouraging and noisy for a well-known pattern.
   - **How:** Drop two stages on a miss (Math.max(0,box-2)) or use a graded SM-2-style ease. Show a 'mastery trend' line.
5. **T23-35** · `ui5.js`
   - **Idea:** Show a trend per step (last 20 vs the previous 20 arrows) and a 'Drill' button on each row, so the user acts from the chart itself.
   - **How:** Add ↑/↓ with the delta, and a row tap → targeted drill.
6. **T23-36** · `ui6.js`
   - **Idea:** Add last week vs this week (gases, accuracy, days) so the weekly review shows direction, not only a snapshot.
   - **How:** Compute weeklyReview for weekStart−7 and show the deltas.
7. **T23-37** · `ui5.js`
   - **Idea:** Add a calibration plot (stated confidence vs actual accuracy) and ask for confidence before any feedback (first step), to train metacognition properly.
   - **How:** Move the picker to the top of the case and keep allAB as the outcome.
