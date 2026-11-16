# I1 done (Buffer 5.0 integration)

1 | already | All 7 SRC keys exist in c5.js (nicecg32 is called nice32; kim96 uses the paper's real title). All LSRC additions are in place.
2 | already | c8 etoh XQ is now a hypoglycaemia question, and its explanation already uses the Schabelman wording.
3 | already | HALT-IT explanation already says VTE and seizures.
4 | already | 'Ultrasound only' is gone. The distractors are now thumb oximeter, tourniquet, capillary refill and X-ray.
5 | already | c2 nderived already uses 1.25 mOsm per mmol/L (divide mg/dL by 3.7). c4 etoh matches.
7 | already | c7 traps already has the total-CO2 mixing question, with the correct option first.
8 | already | sp-neo already links back to #l-kids.
9 | already | c3 glance already says HCO3 10-18.
10 | already | c3 glance Look 2 already uses ROME same/opposite wording. mixed Q4 uses a different rule (PCO2 vs HCO3 direction), which is correct and does not conflict.
11 | already | c7 comp distractor is 14, and the explanation mentions the chronic value.
12 | already | kacid has jbds23, umpierrez24 and ukka20. ncoox has mhra09.
13 | fixed | tc-radial step 8 and the tc-bubbles delay line now use the standard wording (30 min plastic at room temperature, 15 min for lactate/high PO2/high WCC, no ice on plastic, glass in iced water if longer). The haemolysis line was already there. I did not add ex gases for uosm/traps/tc-bubbles (optional).
17 | already | sim-asthma, im-capno and im-co are done. im-dip keeps roberts21 on purpose (the case is exertional heat collapse) alongside bosch09 and kraut10.
18 | fixed | MSRC.icu=[]. Added vincent13 to icu-perf, icu-fluids and icu-press (icu-shock had it already). Declined adding fan17 to icu-obst and icu-wean: fan17 is an ARDS guideline, and icu-vent1 and icu-ards already cite it.
25 | already | odc has odriscoll17.
26 | already | dubin07 is in SRC, and LSRC.stewart has dubin07 and berend14.
27 | already | kowlgi15 is in SRC and LSRC.microbes.
28 | already | LSRC.learn has hussain24 (= aswan24), hatala03, roediger06, cepeda06 and kalyuga03, plus ark06 and meyer13.
29 | already | Info only, nothing to do.
32 | already | c6 uses 'Sulfuric' and 'citric acid (Krebs) cycle'.
33 | already | c7 asthma XQ explanation is already the BTS/SIGN wording.
34 | fixed | The acidsrc distractor was already replaced. In rbc q1, 'Hamburger effect' became 'Hering–Breuer reflex', not the suggested 'Loss of hypoxic drive': that one is partly true for O2-induced hypercapnia, so it would be a second correct answer.
35 | fixed | alkmaint Q2 explanation now also says why Hartmann's does not work.
36 | already | glance Q1 options no longer repeat the stem number ('Yes: it fits the shortcut' …).
37 | fixed | c8 methb XQ explanation now gives the optical mechanism.
38 | fixed | c8 opioid XQ: correct option is 'Keep SpO₂ normal while CO₂ rises unseen', and the explanation now says to watch RR, ETCO₂ or a gas.
39 | fixed | New SRC entries: iolascon21 (PubMed-checked), fda11mb, boyer12, bnfnalox, buckley11 (Cochrane-checked), weaver02. LSRC: methb, opioid and co extended. glance needs nothing: MSRC.auto already gives it berend14.
40 | fixed | bts19 label is now 'BTS/SIGN (SIGN 158, acute section)', and the note says the acute section was retained and amended in 2024. roberts21 now cites ACSM 2023, Curr Sports Med Rep 2023;22:134–149, doi 10.1249/JSR.0000000000001058 (PubMed-checked); the key is unchanged. ghannoum23 was already Crit Care 2023;27:56.
41 | fixed | sp-alt has a 'Saudi cities' line. The figures match c1/c2 and the app's altitude setting: Riyadh about 10 mmHg lower, Abha PaO2 about 65–70 (calculated from PiO2 112), PaCO2 low 30s. sp-pregem now opens with a link to #l-preg. XQ sp-pregem Q1 is now a ventilator decision at 34 weeks ('Raise the minute ventilation').
50 | fixed | mokhlesi19 and acog14 already resolve (they are in c11). Added hernanz03 (checked) and nice29 to c5.
77 | fixed | c9: alkmaint gets the kidney model back with wopt {kidney:{seg:'beta'}}, and rta gets {kidney:{seg:'dist'}}. Checked in headless Chromium: the correct segment is active.
78 | fixed | The total PEEP / driving pressure line is in both icu-vent1 and icu-obst.
111 | already | The lead added the lesson-question shuffle to c9, and lint passes.
112 | already | Lint passes: 0 long correct options.
113 | already | Lint passes: 0 long correct options.

## For the lead
- Source check: I loaded c1–c12 and checked every key in LSRC, in MSRC and in each `src:[...]` array in all js files. All resolve, and every lesson has at least one source. Before this pass, hernanz03 and nice29 (c12 ch-pyl) were missing.
- `bash tests/gate.sh`: all 11 steps pass. Headless Chromium at 390×844 on the touched lessons: no page errors, no horizontal scroll.
- The roberts21 key now points at the 2023 paper. The heat lesson and im-dip show "ACSM 2023".
- No handoffs.
