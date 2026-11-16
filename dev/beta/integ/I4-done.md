# I4 done (ui3 ui5 ui8 ui9 ui10)

6 | already | ui5 osmolar-gap line already reads '≈ 1.25 mOsm per mmol/L, or 1 per 3.7 mg/dL'
16 | already | spneo/spohs/spalt/sppreg/spdial nodes, edges, 3 TEACH items and the 'spec' topic colour are in ui5
24 | already | caseSources appends doi.org links when SRC[i][2] exists
30 | already | FLASH uses L.filter(l=>!l.noflash)
44 | already | (1) ui5SlotCap falls back to 25; (2) presetLegs returns [] for cap<=0. (3) optional lastRoundLegs not added: superseded by S.lastRoundMin (n131) and the finish toast already says 'N of M legs'
45 | fixed | builder keeps its own modal code (it also closes on Back through history, which openModal does not do) but now has openModal's MutationObserver guard; see n128
47 | already | ocrSheet uses openModal and its close()
51 | already | caseEnd shows Take-home list and Exam pearl
52 | already | ui8Ordered sorts sims by 'Resus N'
53 | declined | new SVG kinds (CPR/oesophageal capnogram, ECG strip, centrifuged tube, MetHb filter paper) are new features with no case data yet; for a later round
55 | already | K⁺ label and Number-key shortcuts toggle are in Settings
56 | already | autopsyRow adds WHY_ACT on management steps
60 | already | _hcalc set, PEEP field, ctx passes through IV, footer says it catches coding slips not rule errors, ox-implausible note shown
63 | already | 'Download damaged save' + delete row (ui3CorruptRow) and 'Check my data' (ui3Check) exist
68 | already | hand-off prefixes 'UNRELIABLE (Henderson mismatch): ' when inconsistent
69 | already | sheet lists r.notes, sample type line, camera icon on 'Photo of printout'
71 | already | boot normalises empty hash, route treats empty hash as Today, pack source is 'Buffer '+APP_VERSION, storage handler uses ui.wipe/epoch + mergeStates (no wall clock)
72 | already | odc tile text matches
74 | already | buffer:theme redraws iMap (ui3:98) and fbMap (fbRedraw)
79 | already | todaysPlan uses roundMinutes()
87 | already | touchDay(1), ms on case/sim sess rows, notebook delete strips to {id,key,u,del}
90 | fixed | Last 4 weeks is now 4 rows of 7, Monday first, with M T W T F S S initials; future days blank. No 'Week starts on' setting (optional)
91 | already | sim items present: role=log Events, .tw Key steps, FiO₂ from oxygen, T+ times, role=group vitals, meter, pace select; no throw
93 | already | yuzuMissCards uses ui3McqCard / ui3QId
98 | already | confirmed with parseGas: abl90-co scan with '7.35 - 7.45  7.31' gives pH 7.31; battery layout 'pH 7.35-7.45 7.21 L' gives 7.21; (T) row ignored; standard HCO₃⁻ skipped for actual 16.4 (T12-2, T12-4, T12-5)
106 | already | toYuzu keeps the 'Yuzu's Drive folder was not found' reason and drops the connect-Google tail when signed in
117 | already | 'Hand over' is .btn small, last in the row, with a confirm under 10 min / key steps missing
118 | fixed | (1) list fallback already default under 600px; (2) .est-track now renders only after Lock it in; (3) 7-column Monday-first grid as n90
120 | already | simEnd uses E=c.end||{}
122 | fixed | visible ⋯ (data-kitmore) on every Labs tool and model tile; Settings eyebrow reads 'Buffer x.y.z · built dd/mm/yyyy' when BUILD_DATE exists
123 | fixed | grid already role=img with summary aria-label; added 'Less □□□□ More' heat-key; ⋯ on finished shift tiles (menu Play / Forget my result)
124 | already | info only; OCR loader not changed
125 | already | simVit no longer throws; vitals role=group with high/low; sevbar role=meter with aria-valuenow; headings see extra item
128 | fixed | MutationObserver in openRoundBuilder: if the sheet is removed by anything else, inert, key and popstate listeners are released
131 | fixed | roundFinish stores S.lastRoundMin (already in DEF2 and the ui6 merge); Today's plan shows it on the done Round line
140 | already | info; reset/restore still set ui.wipe=Date.now()

## Extra items
- ui5 Round builder inert: fixed (n128). Tested at 390×844: open builder → location.hash='#learn' → nothing inert, no scrim; open → Back → same; open → external remove → same; open → sheet() replaces it → Escape → same.
- ui5 Round minutes: field is S.lastRoundMin (already named in e1.js DEF2 / validate and ui6 merge), not S.roundMin. Test: 7-minute Round → Today's plan done line min 7.
- ui10 photo sheet: 'Not possible (range …)' now shows 0.7–26.7 kPa for PCO₂ (1.3–93.3 kPa for PO₂) when units are kPa; mmHg unchanged.
- ui8 sims: Actions groups are real <h3> (was h4), 'Read the gas' question is <h2> (was h3 straight under the level-1 title). Outline now 1 → 2 → 3.
- ui3/ui5 hold-only menus: ⋯ buttons on Labs tool/model tiles and finished shift tiles. Concept-web node menu needs none (Focus / Open the lesson / Teach it back are all buttons in the detail card).

## For the lead
- Build OK, node tests/run.js 147 passed 0 failed, tests/gate.sh all steps passed. Playwright at 390×844: no page errors in Round builder, Progress, Estimate, Labs, Shifts, Settings, sim view.
- Lesson rows (.llist) and mastery tiles (.mt) hold menus are rendered by ui1.js: their ⋯ buttons are a handoff to the ui1 owner.
- kit.js openMenu takes the sheet title from the first <span>, so tile menus show the description text as title (e.g. 'Gas logReal gases…'); a kit.js fix (prefer <b>) is for its owner.
- The Settings eyebrow shows APP_VERSION 4.9.0; APP_VERSION is still '4.9.0' in ui1.js:2 and needs bumping for 5.0.
