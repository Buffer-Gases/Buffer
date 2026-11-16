# I3 — done (ui1.js, ui2.js, shell.html)

15 | already | slip() heads CORD ARTERY/CORD VEIN, drops ranges and flags, adds "Adult reference ranges do not apply to cord blood" (that covers the lesson worked gas too)
20 | already | renderLesson mounts with mountW(w,id,(l.wopt||{})[id])
22 | already | DOI link in the ui1 Sources card; ui6 and ui8 already render doi.org too
31 | already | ui1Questions keeps q[4].fixed order; boss part fixed under 48
42 | already | ex.stem note above the slip; slip header shows "Patient 41.5 °C · at 37 °C"
48 | fixed | (1) already: ui2Live calls announce. (2) qw at source for session titles and the boss/final result lines (new ui2Title()). (3) moduleBossPool (ui1) now passes fixed:!!q[4].fixed, and ui2 already honoured b.fixed. (4) already: a miss drops the box 2
49 | already | .hero-legs li.cur rule and #sr live region are in shell.html
57 | already | .stick is desktop-only, .sumhead stacks under 480px
58 | fixed | Today shows "Unfinished: … · Resume session" when SS.paused&&!SS.done (own ids, not ui2's pResume). slip() has a visually hidden <caption> from ui2GasText()
61 | fixed | gapWhy() uses the engine's gap working (measured HCO₃⁻, K⁺ setting, albumin), cut before the Δ part. Δ "why" reuses the engine's Δ text (o.base, 25 venous). Gap/Δ hints use the effective reference (+4 with K⁺)
62 | fixed | Today shows role=alert cards for LOAD_ERR and for SAVE_OK===false, each with a link to Settings
70 | fixed | ICON.camera added (same path ui10 polyfills)
76 | fixed | go() calls e2Sweep() when defined
80 | fixed | STEPNAME.boss = 'Module check questions'. Lesson shows one "Teach it back: <concept>" button per TEACH prompt (nderived: 3)
82 | fixed | (1) already: S.conf only pushed when C.conf is set. (2) finishSession calls ui5Badges()
83 | already | --w-spec in the D24 token block, scrim centred from 761px, .sheet pan-y
85 | fixed | SS.focus: a step-by-step case retries (up to 6) until the focus step is present, 'ox' forces arterial, 'real' always adds the consistency question (30% inconsistent). Summary Drill and Go again keep the focus. S.sess rows carry ms
89 | fixed | On go(), toasts from the last view leave 1.5 s after they appeared (not instantly)
94 | declined | Low priority. Re-keying S.qmiss needs ui3QId plus a matching resolver in ui9 and a migration of old keys; do it in one owner's pass, not across files
102 | already | clinical .fromchip rule present
103 | already | head (doctype, charset, viewport) and the D24/D27 split are in place
105 | already | dark .heat l1<l2<l3 present; font stylesheet loads non-blocking (media=print onload)
107 | already | .gl .de min-height 44px in shell; gl9css injection can stay in ui9
108 | fixed | mistakes replay uses interp(c); snapshots keep c.les; case feedback offers "Lesson: <title>" on a miss using c.les||KLESSON[kind], also in the summary list
110 | fixed | PaO₂ range scales by (Patm−47)/713 below 740 mmHg (e.g. 60–75 at 580), flag uses it; upper bound stays 100 on oxygen; a one-line note says the range is altitude-adjusted
114 | fixed | Today wraps blocks in .today2 (left: hero, resume, due, quick; right: gas of the day, hook, citrus/next, mistakes, mastery). Under 1400px the wrappers are display:contents so the phone order and gaps are unchanged. Screenshots at 390/1440/1920 checked
115 | fixed | .ui2-strip top: calc(env(safe-area-inset-top,0px) + var(--hdr,62px) + 60px)
121 | fixed | Visible ⋯ (iconbtn kitmore, aria-label "More actions for …", aria-haspopup=dialog) after each mastery tile (.mtw wrapper) and each lesson row; kit.js opens the same menus. ui2 renders no items with kit hold menus
127 | fixed | same as 115
129 | fixed | clinical font floor 12px for .hook .tag, .mono-mark, .sbar b, .sb b, .stepl li>i, .method6 b, kbd
133 | already | .sheet touch-action pan-y in the base rule (.sheet-grab none)
135 | fixed | Under 560px a running sim's #simBar sticks below the header: clock + buttons in one row (scrolls sideways), five vitals in one compact row, thin severity bar, note hidden (138px tall at 390). .tl li.nurse muted
136 | fixed | sticks at top:calc(env(safe-area-inset-top,0px) + var(--hdr)); bar bottom is at 200px, the same as the session scroll-padding-top
137 | fixed | Every S.done reader treats any truthy value as done (ui1, ui3 ui3Sum, ui5 nodeKnown, ui9, hub x||y and the wipe test); ui6 merge does not touch done. ui1 now stores Date.now() in both places. Handoff: kit.js "Mark as done" still sets 1

## For the lead
- Counts: 13 already, 20 fixed, 1 declined, 0 whole-request handoffs. One part handed off: kit.js "Mark as done" should store Date.now() instead of 1 (137).
- Build passes, node tests/run.js 147/0. gate.sh passed on 4 of 5 runs. The one failure was the sweep's random "worst no-case rate" going above 25% (27%, hag_* at p580). That comes from the engine generator, not from these files.
- Playwright at 390×844 (Today, Learn, lesson, steps session, boss, mistakes, sim, banners), 1440 and 1920: no page errors. The only console errors are Google Fonts blocked offline.
- The sticky sim bar is 138px, above D27's ~110px target. Its bottom edge (62+138) matches the 200px scroll-padding-top, so focused buttons stay visible.
- The ⋯ buttons add one tab stop per lesson row. That cost is the intended route for keyboard and touch users.
