## v4.2.0 — foundations and a fuller question bank (13/11/2026)
- **Quiet by default:** XP, levels and badges hidden (mastery only), boss fights read as module checks; a Game mode toggle in Settings brings them back. Dark theme and a calmer clinical skin (Settings → Look) alongside Orange Pixel.
- **Round builder:** choose your own legs, weakest first, with presets and a time cap taken from the Citrus plan and today's shift.
- **Sources:** every lesson has a Sources card (c5.js registry, about 56 references, titles and volumes checked by search).
- **Questions:** every one of the 80 lessons now has 5 questions (c6, c7, c8 batches, 232 new). c9.js merges them and shuffles answer positions with a fixed seed, so the correct answer is no longer always first. tests/xq.js checks structure and option lengths.
- Build order is now c1 c2 c3 c4 c5 c6 c7 c8 c9 e1 e2 ui1 ui2 ui5 ui3 hub kit.
- **Checks:** 132 Node tests, Python reference 3,998 gases 0 disagreements, smoke, func (updated for the Round builder), mig, a11y, audit, round, twophones all pass. The monkey run was still going when this was written. The old pwa.py script is stale and was not used.
- **Not yet done from the 12/11 roadmap:** everything in claude/buffer-roadmap.md from 4.3 on (interpreter upgrades, live gas log, weekly review, speed modes, visual labs, case library and ER sim, ICU course, special groups, Galen/Yuzu/reasoning links, German glossary, photo OCR). Questions in c8 were written from the lessons and general sources and have not had a separate clinical review.

