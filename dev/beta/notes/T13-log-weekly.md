# T13 · Gas log, trends, weekly review, Yuzu misses

**What I covered:** the Gas log tool (saveSheet, logAdd, logDel, mergeLog, TOOLFN.log, trendHTML, trendSay, privacyWarn), reached both from the interpreter's Save to log and from Labs. Also the weekly review card on Progress and its Citrus line (including Monday and weekend behaviour, using a mocked clock), and 'Send missed points to Yuzu' (copy path, with the clipboard allowed and with it blocked).

**Test data:** improving DKA, worsening sepsis, VBG COPD, an ABG and a VBG under one tag, missing values, an albumin present in one gas and not the next, ID-like text, a 700-character note, an HTML-injection tag, kPa units, deleting while filtered, Copy all, opening a saved gas back in the interpreter, empty states, and the phone and desktop layouts in both skins and both themes. S.sess was checked for reflex, case, sim, five and pflash sessions.

**What works:** the sparkline band arithmetic is correct (checked by hand for pH, PCO₂ and lactate). Lactate clearance % is correct. Escaping is safe. Tombstones merge correctly.

**Main problems:** some trends are clinically wrong (the anion gap switches between corrected and uncorrected; ABG and VBG are mixed). The weekly review shows an empty week on the Monday it announces itself. Its 'gases' and 'minutes' count sims, cases and flashes as gases. Real-gas patterns cannot be compared with the weak patterns. Yuzu case cards have no context.

**Verdict:** a solid base, but the trend and weekly numbers can mislead. **Score 6/10.**

## Major

**T13-1 · ui6.js · trendData / trendSay / TREND_SERIES 'ag'**
- What: The anion-gap trend mixes albumin-corrected and uncorrected gaps. trendData takes o.agc when albumin was typed and o.ag when it was not, so two identical gases read as a change. Example: pH 7.30, PCO2 32, Na 140, Cl 105 with albumin 20, then the same gas without albumin. The trend shows 'Anion gap 24.8 → 19.8 (-5.0)' and the sentence says 'the anion gap is closing'. This is false teaching about the patient's course.
- Evidence: s10.py tag ALB: o.ag 19.8 for both, o.agc 24.8 then 19.8; trendHTML says 'pH is about the same; the anion gap is closing.'
- Fix: Use one gap type across the whole series. Use the corrected gap only when every point has albumin; otherwise use the raw gap for every point. If some points have albumin, carry the last known albumin forward and say so ('albumin carried forward'). Show which one is used in the row label: 'Anion gap (alb-corr)' or 'Anion gap (raw)'.

**T13-2 · ui6.js · trendHTML / trendSay (mixed ABG and VBG in one tag)**
- What: Gases under one tag are trended raw, even when some are ABGs and some are VBGs. The trend then shows the venous offset as if it were patient change. Example: ABG pH 7.40, PCO2 40, then VBG pH 7.37, PCO2 46. The trend shows PCO₂ +6 and says 'pH is falling', but this is exactly the app's own venous offset (pH +0.03, PCO₂ −5).
- Evidence: s3.py tag 'Mixed': 'pH 7.40 → 7.37 (-0.03) ... PCO₂ 40 → 46 (+6) ... pH is falling.'
- Fix: When a tag holds both sample types, either (a) convert VBG points to arterial estimates with the app's rule (pH +0.03, PCO₂ −5, HCO₃⁻ −1), draw them as hollow dots and add the note 'VBG points converted to arterial estimates', or (b) trend each sample type as its own series. Never call the step from ABG to VBG a change. Mark each point in .tlist with ABG or VBG.

**T13-3 · ui6.js · weeklyReview / hubStatus 'Weekly review ready' on Monday**
- What: The review always covers the current Monday-to-Sunday week. On Monday, the day hubStatus shows 'Weekly review ready' and Citrus adds an inbox task that links to ?do=weekly, the card shows an almost empty new week. Last week's work is never reviewed.
- Evidence: Clock set to Mon 16/11/2026 with 5 sessions (50 gases) over 11–15/11. weeklyReview().line = 'Buffer week 16/11/2026: 0 days, 0 gases (0%), about 0 min.' while pending = ['Weekly review ready'] (s8.py).
- Fix: Add weeklyReview(offsetWeeks). On Sunday show this week. On Monday, and on any visit that comes from the Citrus weekly link, show the week that just ended, with the heading 'Last week · 09/11–15/11/2026'. Add a This week / Last week toggle on the card. Use the reviewed week in the Citrus line.

**T13-4 · ui6.js · weeklyReview n / mins (S.sess)**
- What: 'Gases' and 'minutes' add up S.sess.n across session kinds that are not gases. A sim pushes n = number of key actions (ui8.js:90), a case pushes n = number of questions, and a 30-item Number flash counts as 30 gases. Minutes are n×1.2 for every kind, so a 12-minute sim with 6 key actions counts as ~7 min and a 30-item flash as 36 min. Lessons, Gas sense, flashcards, serial gases and scenarios do not push S.sess at all. So 'days studied 4/7' can sit beside '0 gases'. These numbers also go to Citrus (weekGases, the weekly line).
- Evidence: S.sess this week: reflex 20/18, case 4/2, sim 6/3, five 5/4, pflash 30/20. Card: '65 gases · 72%, ~78 minutes'. Only about 30 of these were gas reads (s7.py).
- Fix: Record a kind and real minutes with each S.sess row, e.g. {d, m, n, ok, kind:'gas'|'case'|'sim'|'drill', ms: Date.now()-t0}. Count gases only where kind==='gas' (sessions plus speed drills), list cases and sims separately ('3 cases · 1 sim'), and add up the measured minutes. Also log lesson questions, Gas sense and flashcards, or say 'practice sessions' instead of 'gases'.

**T13-5 · ui6.js · weeklyReview liveK vs pats**
- What: 'Your real gases this week' cannot be compared with 'Weakest patterns', although the card says to compare them. Real gases are grouped by primKey into words such as 'respiratory acidosis', 'normal', 'mixed' and 'HAGMA'. Mixed reads are cut down to their primary disorder: DKA 'HAGMA + respiratory acidosis' counts as 'HAGMA', and the VBG 'HAGMA + respiratory acidosis' counts as 'respiratory acidosis'. Weakest patterns use KINDS keys shown through KSHORT ('Acute resp. acidosis', 'HAGMA + resp. acidosis'). Capitalisation is also mixed ('normal' beside 'NAGMA').
- Evidence: s7.py: liveK = {respiratory alkalosis:1, normal:1, NAGMA:1, HAGMA:1, respiratory acidosis:1, metabolic alkalosis:1} for gases whose labels were 'HAGMA + respiratory acidosis' ×2, 'Acute respiratory alkalosis', etc.
- Fix: Map each logged read to a KINDS key with the same classifier practice uses (for example a kindOf(o) helper in e1.js that returns hag_rac, rac_a and so on). Show both lists with KSHORT and mark overlaps ('NAGMA × 2 · your accuracy 25% → drill it'). Capitalise as sentence case.

**T13-6 · ui9.js · yuzuMissCards: case cards**
- What: Case-mistake cards cannot be understood outside the case. Front = case title + step question (e.g. 'Case A: What next?' or 'What is the primary process?') with no gas values. Back = the correct option only, with no reason. In Yuzu the learner sees a question about a gas that is not shown.
- Evidence: Pack copied from Progress (s9.py): {'type':'basic','front':'Case A: What next?','back':'Y'}. Built from cmist fields ct, q and r only (ui8.js:58 stores no gas and no explanation).
- Fix: In ui8.js, store the gas line (o.line or a short gas block) and the step's explanation in each cmist entry. In ui9.js, build front = gas line + question, and back = correct answer + why + 'Your answer: '+a. Fall back to an mcq card with the step options.

**T13-14 · ui6.js · logList / TOOLFN.log draw after delete**
- What: After you delete every gas of the tag you are filtering by, the tag filter stays stuck. b.dataset.tag still names the gone tag: the card reads 'Trend · Missing — Save two or more gases…', the list is empty, and no filter button is pressed (All shows aria-pressed=false). The only way out is to tap All.
- Evidence: s3.py: filter 'Missing', delete both → /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-log-after-del.png
- Fix: At the start of draw(), if f is set and no live gas has that tag, set b.dataset.tag='' (and f='') before rendering.

## Minor

**T13-7 · ui9.js · yuzuMissCards dedupe of cmist**
- What: Duplicate Yuzu cards come from the same case step. The cmist key is caseId:step:chosenOption, so two different wrong answers on one step make two cards with the same front and back.
- Evidence: s9.py: cmist keys c1:0:1 and c1:0:2 → cards buf-c-c1-0-1 and buf-c-c1-0-2, both 'Case A: What next?' / 'Y'.
- Fix: Remove duplicates by cid+':'+step (the key without the last part). Card id 'buf-c-'+slugify(cid+'-'+step).

**T13-8 · ui9.js · yuzuMissCards / toYuzu lifetime of misses**
- What: Misses are never cleared. S.qmiss is not deleted when the question is later answered correctly (ui1.js:189), and nothing is marked as sent. Each new ISO week makes a new pack id (buffer-misses-2026wNN) holding every miss ever made. The count on the button only goes up.
- Evidence: Code: ui1.js:189 sets qmiss only on a wrong answer; toYuzu does not change state. The button showed 'Send 8 missed points' every time.
- Fix: Delete S.qmiss[key] after a later correct answer, or after 2 correct answers in a row. Store S.yuzuSent = {cardId: ts} and send only new cards ('Send 3 new missed points · 8 in total'). Make the pack id incremental or keep it per week, but include only new cards.

**T13-9 · ui9.js · toYuzu copy path when clipboard is blocked**
- What: When the clipboard is blocked, the message is 'Clipboard blocked. 1 card. Save as buffer-misses.yuzu.json and import in Yuzu…', but nothing was copied, so there is nothing to save. The filename also differs from the Drive name (buffer-misses-<week>.json) and the pack id.
- Evidence: s9.py without a clipboard: msg = 'Clipboard blocked. 1 card. Save as buffer-misses.yuzu.json and import…'
- Fix: If copyText fails, download the file: new Blob([JSON.stringify(p)]) and a[download='buffer-misses-'+wk+'.yuzu.json'], then say 'Downloaded buffer-misses-2026w46.yuzu.json. Import it in Yuzu.' Use the same filename in the copy message. Also add a 'Download' button next to 'Send'.

**T13-10 · ui6.js · weeklyCard 'Weakest steps' / 'Weakest patterns'**
- What: Under the 'This week' heading, weakest steps and patterns are all-time (stepAcc covers the last 20 attempts whenever they happened; S.kinds is lifetime). Steps have no minimum number of attempts, so 2 attempts at 0% become the weakest step and go to Citrus.
- Evidence: s7.py: S.steps.prim {n:2,c:0} → 'Weakest step Primary process 0%' in the Citrus line. Patterns need ≥3 attempts but steps do not.
- Fix: Require n≥5 for steps (patterns use ≥3). Either compute both from this week's session results, or relabel them 'Weakest steps (last 20 attempts)' and 'Weakest patterns (all time)'.

**T13-11 · ui6.js · weeklyCard #wkDrill**
- What: 'Drill Primary process' (or Compensation, Anion gap…) starts a general Step-by-step session that goes through every step. It does not drill the named step. Only 'comp' maps to gym.
- Evidence: Clicked Drill with weakest step 'prim' → SS.mode 'steps' (s7.py). ui6.js:177.
- Fix: Pass the step to startSession (for example startSession('steps',{focus:'prim'})) and weight the questions toward that step, or rename the button 'Practise step by step'.

**T13-12 · ui9.js · hubStatus inbox weekly task**
- What: The weekly task ids follow isoWeek, but the task shows on Sat, Sun and Mon, which fall in two ISO weeks. Citrus gets 'buffer-week-2026w46' on Sat/Sun and another 'buffer-week-2026w47' on Monday. ui6 hubStatus 'pending' fires on Sun/Mon only, so the two places disagree.
- Evidence: Mon 16/11: inbox id buffer-week-2026w47 (s8.py); Sat/Sun of the same weekend give w46 (code reading of ui9.js:23).
- Fix: Use the id of the reviewed week (the week that ends on that Sunday) on all three days. Make the pending rule and the inbox rule use the same days.

**T13-15 · ui6.js · logDel / delete flow**
- What: Delete has no undo. Two taps within 2.5 s delete the gas at once, and logDel wipes every field except id and t, so nothing can be restored. A real patient gas typed at the bedside is lost to one double-tap. On phones the Delete button sits right next to Share and looks the same (ghost style is barely different).
- Evidence: Code ui6.js:96 and 150; screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-trend-pixel-dark-phone.png
- Fix: Keep the old entry in memory and show toast('Deleted · Undo') with a 6-second Undo action that puts it back (clear del, bump u). Or soft-delete with a 'Recently deleted' section that is purged after 7 days. Give Delete the danger colour (var(--bad) text).

**T13-16 · ui6.js · tags (saveSheet / TOOLFN.log / trendHTML)**
- What: Tags are case-sensitive and not normalised. 'Bed 7' and 'bed 7' make two filter chips and two separate trends for the same patient.
- Evidence: s4.py: filter buttons ['', ..., 'bed 7', 'Bed 7'].
- Fix: Compare tags case-insensitively and with collapsed spaces (key = tag.trim().replace(/\s+/g,' ').toLowerCase()). Show the first spelling. In saveSheet, if the typed tag matches an existing one apart from case, use the existing spelling.

**T13-17 · ui6.js · privacyWarn IDLIKE**
- What: The ID check misses common identifiers: 'pt 12345' (5 digits), 'file no. 55', '+966 55 123 4567' (phone in groups), 'DOB 12/03/1980', '1234-5678'. It also never notices names ('Hamad Al-Saud bed 3').
- Evidence: s3.py results: only 'MRN 1234567', 'iqama: 2123456789', 'ID 4' and 'Bed 4 13112026' were flagged.
- Fix: Widen the pattern: /\b\d{5,}\b/, digit runs with spaces or hyphens totalling ≥7 digits (/(?:\d[\s-]?){7,}/), date-of-birth patterns (/\b(dob|d\.o\.b|born)\b|\b\d{1,2}[\/.-]\d{1,2}[\/.-](19|20)\d{2}\b/i), keywords (pt|patient|file|mrn|id|nid|iqama|passport|no\.?)\s*[:#.]?\s*\d+, and two capitalised words before 'bed' as a possible name ('This may be a name'). When the warning shows, change Save to 'Save anyway' so a second tap is needed.

**T13-18 · ui6.js · saveSheet privacy line**
- What: The sheet always says 'The log syncs to your Google Drive with your progress.' This is untrue when the user is not signed in or has turned sync off. The trust claim should be accurate.
- Evidence: Fresh install with no Google sign-in: the text still shows (/tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-sheet-phone.png).
- Fix: Choose the text by state: signedIn() && S.google.syncState → 'Syncs to your Google Drive with your progress.'; otherwise 'Kept on this device only.'

**T13-19 · ui6.js · saveSheet keyboard and accessibility**
- What: The save sheet is aria-modal but Escape does nothing, Enter in the Tag field does not save, focus is not trapped (Tab leaves the sheet for the page behind), and focus does not go back to 'Save to log' when the sheet closes.
- Evidence: s5.py: after Enter the sheet stays open; after Escape it stays open; after 5 Tabs the focus is on the 'Buffer' logo behind the scrim.
- Fix: Copy the onEsc pattern from sheet() (ui1.js:50). Submit on Enter in #lgTag (and Ctrl/Cmd+Enter in the note). Trap Tab inside .sheet, and on close call $('iSave').focus().

**T13-20 · ui6.js · runInterp wrapper: after saving**
- What: After the first save there is no route to the log from the read. 'Open log' is only drawn if the log already had gases when the read was rendered, and the toast has no action. The user has to go to Labs → Gas log.
- Evidence: s5.py: buttons after the first save = ['Copy for Black Template','Save to log','Share line','Hand off to reasoning'].
- Fix: After logAdd, add or show the #iLog button and change Save to 'Saved ✓' (disabled), or give the toast an 'Open log' action. This also stops accidental double saves of the same read.

**T13-21 · ui6.js · TOOLFN.log [data-open] and history**
- What: Back from a gas opened from the log goes to Labs, not to the log. Open calls openTool('interp'), which replaces the history entry, so the log's place (filter and scroll) is lost.
- Evidence: s5.py: hash #tool-log → Open → #tool-interp; history.length did not grow; Back → #labs.
- Fix: Push a history entry when you open from the log (or add a 'Back to the log' crumb in the interpreter when the read was opened from the log). Keep the tag filter in S.ui.logTag so it survives the round trip.

**T13-22 · ui6.js · logAdd values 'kept as typed'**
- What: The log does not keep exactly what was typed. If HCO₃⁻ was not typed, the wrapper calculates it and logAdd stores it in v.hco3 as if it had been entered. Reopening shows it in the HCO₃⁻ field. FiO₂ typed as 60 is stored and reshown as 0.6.
- Evidence: s4.py: typed {pH 7.24, pco2 28, fio2 60…}; reopened IV = {…fio2:0.6, hco3:11.6…} and field i_hco3=11.6.
- Fix: Store only fields the user typed (copy IV before derivation), and mark calculated values as v._calc=['hco3'] if you need them. On reopen, leave calculated fields blank. Show FiO₂ in the unit it was typed in.

**T13-23 · ui6.js · TOOLFN.log entries: editing and duplicates**
- What: A saved gas's tag or note cannot be edited. Re-opening a gas and tapping Save makes a duplicate entry with a new timestamp and no warning. The time saved is used as the gas time, which is wrong for gases logged later from a printout.
- Evidence: Code reading ui6.js:93–109 and 140–152; reproduced the duplicate by opening and saving again.
- Fix: Add an 'Edit' action (tag, note, sample time) that reuses the sheet. Add a 'Taken at' time field to the sheet, defaulting to now, and use it as e.t. When the read came from Open, show 'Already in the log (13/11 07:37) · Save as new?'.

**T13-24 · ui6.js · TOOLFN.log #lgCopy**
- What: 'Copy all' copies only the gases shown under the current tag filter, and newest first. To read a trend you want oldest first.
- Evidence: s3.py: with filter 'Missing', the clipboard held only the 2 'Missing' lines.
- Fix: When filtered, label the button 'Copy N (tag)' and copy oldest first, with the trend sentence at the end. Keep 'Copy all' for the unfiltered view.

**T13-25 · ui6.js · trendSay pH threshold**
- What: The pH wording is asymmetric because of floating point. A rise of 0.03 counts as 'about the same', but a fall of 0.03 counts as 'falling'.
- Evidence: s10.py: 7.40→7.43 → 'pH is about the same'; 7.40→7.37 → 'pH is falling' (7.37−7.40 = −0.0300000000000002).
- Fix: Round first: const dp=Math.round((b.v.pH-a.v.pH)*100)/100; then use Math.abs(dp)<0.03 (or ≤0.02).

**T13-26 · ui6.js · trendSay chloride clause**
- What: The chloride clause fires for any fall in the gap (b.ag<a.ag, even 0.1), while 'closing' needs ≥3. It also states 'the usual hyperchloraemic phase of recovery', which applies to DKA and is shown for any tag.
- Evidence: Code ui6.js:135; s10.py tag SMALL shows the clause.
- Fix: Require the same ≥3 fall as the gap clause. Reword it so it fits any setting: 'chloride rose as the gap closed: a hyperchloraemic (normal-gap) acidosis is replacing the high-gap one, often from chloride-rich fluids such as 0.9% saline'. Cite the DKA guideline (JBDS 2023) in the sources.

**T13-27 · ui6.js · trendSay endpoints**
- What: The sentence compares only the first and last gas. If the last gas lacks lactate or Na/Cl, the sentence leaves out lactate or the gap, even when earlier gases show a clear change. It also never says how long the series covers.
- Evidence: s3.py tag 'Missing': gases with and without electrolytes → sentence 'pH is rising.' only.
- Fix: For each variable, use the first and last points that have a value (the same points the sparkline uses), and say 'over 4 h' from their timestamps. Example: 'Over 4 h: pH is rising; lactate cleared 63% (3.2 → 1.2).'

**T13-28 · ui6.js · TREND_SERIES bands for VBG**
- What: Normal bands are arterial for every sample. A VBG series gets pH 7.35–7.45 and PCO₂ 35–45, and a venous PO₂ is trended against the 80–100 mmHg arterial band, which means nothing for a venous sample.
- Evidence: s3.py tag 'Bed 2 COPD NIV' (VBG); s10.py tag VPO2: 'PO₂ 35 → 40' drawn under the 80–100 band.
- Fix: Drop the PO₂ series for venous points. For venous series use venous bands (pH ~7.31–7.41, PCO₂ ~41–51 mmHg), or convert to arterial estimates as in the mixed-sample fix.

**T13-36 · ui1.js · copyText silent failure (Copy line, Copy all)**
- What: When the clipboard is blocked (an http preview or an embedded webview), 'Copy line' and 'Copy all' fail with no message. The button label stays the same.
- Evidence: s9.py with no clipboard: clicking #wkCopy left the label 'Copy line' and showed no toast.
- Fix: In copyText, when it fails, show toast('Clipboard blocked: select the text and copy it') and select a read-only textarea with the text, or fall back to document.execCommand('copy').

## Polish

**T13-13 · ui6.js · weeklyCard stats**
- What: When there are no gases the card shows 'gases · 0%' and the Citrus line says '0 gases (0%)'. A 0% accuracy reads like failure, not like no data.
- Evidence: Empty state screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-weekly-empty.png
- Fix: Show '—' when n=0 and leave '(0%)' out of the line.

**T13-29 · ui6.js · trendHTML deltas**
- What: Deltas use a hyphen-minus ('-1.1', '(-0.20)'), while the rest of the app uses the true minus (BE −23). Lactate has no unit, and there is no normal band for the anion gap.
- Evidence: Trend card, /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-trend-sepsis.png
- Fix: Format negatives with '−'. Label rows 'Lactate (mmol/L)' and 'HCO₃⁻ (mmol/L)'. Give the AG row a band using the app's own reference range (e.g. 8–12, or as set in e1).

**T13-30 · shell.html · .spark class collision**
- What: Two different components share the class '.spark'. Line 374 styles the Progress session bars (display:flex; height:44px) and line 536 styles the trend SVG (width:100%; height:56px). The later rule makes the Progress bars 56 px tall and full width, and the earlier rule makes the SVG display:flex.
- Evidence: shell.html:374–376 and :536.
- Fix: Rename the trend one '.tspark' (ui6.js sparkSVG and shell.html:536).

**T13-31 · ui6.js · sparkSVG layout**
- What: The sparkline viewBox is 260×56 and has no preserveAspectRatio, so on desktop it is letterboxed into the 2fr column with large empty margins. The x-axis is the gas index, not time, so gases 10 min apart and 6 h apart are evenly spaced. There are no labels for the band or the end values.
- Evidence: Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-trend-sepsis.png (sparklines centred with empty space on both sides).
- Fix: Add preserveAspectRatio='none' with vector-effect='non-scaling-stroke' on the line, or measure the width. Place x by timestamp. Label the band edges in small text ('7.35–7.45') and give the last dot a tooltip (<title>) with its time and value.

**T13-32 · ui6.js · saveSheet note length**
- What: The note field has maxlength=600 and cuts longer pasted text silently, with no counter. The tag field cuts at 40.
- Evidence: s3.py: a 700-character note was saved with 600 characters.
- Fix: Show a counter ('412/600') under the note, and warn when pasted text is cut.

**T13-33 · ui6.js · toast after save**
- What: The 'Saved to the gas log' toast stayed on screen over the log list while I opened the log and filtered (doubt: I did not time it exactly).
- Evidence: Screenshots /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-trend-sepsis.png and /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-log-after-del.png, both taken after navigation, still show the toast.
- Fix: Shorten the save toast to about 2 s, or clear toasts on go().

**T13-34 · ui9.js · weekly card Yuzu button**
- What: The 'Send N missed points to Yuzu' count is drawn once when Progress renders and does not update. The button sits under the Citrus line with no heading. Inside the card it reads like part of the Citrus status.
- Evidence: Screenshot /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/beta/shots/T13-weekly-yuzu.png; ui9.js:49–50 (code reading for the stale count).
- Fix: Put it under a small 'Missed points' heading with a one-line explanation ('Lesson and case questions you got wrong, as Yuzu cards'). Recount when it is clicked, and turn it into the 'Send 3 new' form from the misses finding.

**T13-35 · ui3.js · pack() source**
- What: The Yuzu pack metadata says source 'Buffer Blood Gas Trainer, Oct 2026', but the app version is 4.9.0 in Nov 2026.
- Evidence: Pack copied in s9.py.
- Fix: Build the source from APP_VERSION: 'Buffer '+APP_VERSION.

## Ideas (ranked by value)

1. **T13-37 · trendSay clinical direction:** Name the direction relative to normal ('pH back toward normal', 'acidaemia worsening') and give the time between gases. Report lactate clearance as the standard (initial−later)/initial×100 with the interval, e.g. 'lactate cleared 63% over 4 h'. The formula is already right (Nguyen 2004, Crit Care Med 32:1637) but has no time base. Fix: Add the interval and toward/away-from-normal wording; mention the ≥10% clearance threshold with its source in a ⓘ.
2. **T13-38 · weekly review: compare with last week:** Show the change from last week on each stat (days, gases, accuracy) and a 'Last week' toggle. This also fixes the Monday problem. Fix: Store weekly snapshots in S.weeks[isoWeek] when the week rolls over.
3. **T13-39 · real gases → targeted practice:** For each logged real-gas pattern where practice accuracy is low, add a 'Drill this' button that starts a session of that KINDS key. Fix: Needs the kind mapping from the liveK finding; call startSession('today',{kind:k}) or similar.
4. **T13-40 · log export and search:** Add search across tag and note, and export as CSV (time, tag, sample, values, read, note) for audit and teaching portfolios. Fix: Add a 'Download CSV' button next to Copy all.
5. **T13-41 · sample time vs save time:** Let the user set the gas time ('Taken at'). Trends from gases entered in a batch after a shift otherwise all share the same minute. Fix: Add a time input to saveSheet, defaulting to now.

Scripts are in /tmp/claude-0/-home-claude/80312b5f-0e45-5589-b131-fcf824f33899/scratchpad/t13/ (s1–s10.py). Screenshots are named T13-*.png.
