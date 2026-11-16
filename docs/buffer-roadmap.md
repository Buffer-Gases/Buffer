# Buffer — roadmap (12/11/2026)

Built from the user's answers across four question rounds on 12/11/2026. **Status (13/11/2026): delivered.** 4.2.0 and 4.9.0 together cover every item below; details are in claude/buffer-abg-notes.md.

## Next session (user's plan, 13/11/2026)
The user will ask for a big beta round. It is not started yet.
- **30 beta testers:** split across the app's parts. They review every detail of Buffer: Today, Learn and the lessons by module, Labs tools and models, Practice modes, speed drills, the case library and sims, Progress and the weekly review, Settings, sync and links, the glossary, the photo reader, accessibility and phone/tablet/Steam Deck layouts.
- **30 developers:** their notes go to 30 developers, who integrate the fixes to make "the ultimate perfect Buffer".

The beta round should also cover what is still open:
- an independent clinical review of the new content;
- OCR tested on real phone photos;
- the reasoning app reading `My Apps/hub/handoff/`.

## Purpose and use
- Both exams and shift/ER fluency. Used on the phone on shift, on a tablet or Steam Deck at home, and offline in hospital (so everything must work fully offline).
- Exam tagging: MRCEM, USMLE Step 1/2, and untagged questions.

## Decisions
- **Daily Round:** choose-your-own, **weakness first**: it always starts with the weakest step; the rest is free choice. Citrus minutes cap the total.
- **Lessons:** 5–6 questions each, rolled out **all at once** with an independent review, **cite everything**.
- **Case library:** real-world cases, one library with **three filters**: presentation, disorder and setting. Formats: chat-style unfolding, timed ER simulation, image-led.
- **Timed ER simulation:** the patient deteriorates if you are slow; you order gases and labs and results arrive after a delay; debrief with a timeline; branching endings.
- **ICU:** **truly full** ICU course inside Buffer: gas-driven decisions **plus** vasopressors, shock/haemodynamics and full ventilator management.
- **Special groups:** paediatrics, pregnancy, elderly, altitude and diving.
- **Visuals:** Davenport / acid-base map, animated dissociation curve, lung model (V/Q, shunt, dead space), kidney/tubule animation.
- **Game feel:** less. **Quiet by default**; Game mode is a toggle.
- **Mistakes:** instant autopsy plus the mistake notebook.
- **Interpreter:** photo of a printout (with a confirm step), save and share a one-line read, trend over serial gases, next steps (differentials, tests, first management steps, pitfalls).
- **Speed training:** five-second read, mixed-with-noise gases, pattern flashes, handover sentences.
- **Design:** keep Orange Pixel, add a calmer clinical skin, dark mode first. **Home:** Today's plan first.
- **Units:** mmHg and mmol/L. **Language:** English; German terms in a **glossary tab** (Mephisto link).
- **Safety:** a teaching-only banner on the interpreter and calculators.
- **Live gas log:** synced like progress; **keep everything as typed**; a clear "no names or IDs" reminder.
- **Weekly review:** weak steps and patterns, live-log comparison, time and streak, and a weekly line pushed to Citrus.
- **Reminders:** only via Citrus.
- **Ecosystem:** Galen deep links (kept stable), Yuzu cards from missed concepts, reasoning-app hand-off.

## Sequence (all shipped)
- 4.2 Foundations: shipped in 4.2.0.
- 4.3 Interpreter, log, weekly review: shipped in 4.9.0.
- 4.4 Speed and noise: shipped in 4.9.0.
- 4.5 Visual labs: shipped in 4.9.0.
- 4.6 Case library and ER simulation: shipped in 4.9.0.
- 4.7 ICU and special groups: shipped in 4.9.0.
- 4.8 Links: shipped in 4.9.0.
- 4.9 Photo of printout: shipped in 4.9.0.

## Risks to watch
- The ICU course and the question bank are the largest content loads; every number needs checking against its source (review still to do).
- Treatment first-steps and management content must stay cited and under the teaching-only banner.
- Offline: the OCR reader needs internet once, then the service worker caches it.
