# Buffer: hand-off to the Citrus project (16/11/2026)

Buffer is moving from the "Programs and Apps" Claude project to the Citrus project. This repo is now the single place that carries everything a new chat needs: the full source, tests, notes, contracts and the beta round in progress.

## Where things live
- **Live app:** https://buffer-gases.github.io/Buffer/. The repo root holds the built PWA (index.html, sw.js, manifest, icons).
- **Source:** `dev/src/`. build.py concatenates the source files and writes buffer.html. Current version: 4.9.0, with 5.0 in progress.
- **Notes and contracts:** `docs/` holds copies of the old project's docs:
  - buffer-abg-notes.md (full version history and integrations);
  - buffer-roadmap.md (the user's decisions);
  - buffer-4-2-release.md;
  - hub-contract.md (Drive layout and the Citrus status contract);
  - google-cloud-setup.md (shared OAuth client);
  - app-master-log.md (the cross-app playbook mirror).

  Add these to the Citrus project, so every app chat there can read them.
- **Published artifact (old project):** https://claude.ai/artifact/2i1ByVL4CEPyZUjSxheczD. A chat in the new project can keep updating it by URL.
- **Shared App Building Master Log (Claude Docs):** https://claude.ai/artifact/WxmMqZEw3zH8m7VmiBJdGU.

## The user and Buffer: what to know
- **The user:** a GP/ER doctor in Saudi Arabia (Habib medical centres, Qiddiya) preparing for MRCEM and USMLE Step 1/2. They study on a Steam Deck with a 27" monitor and a Samsung tablet, use a phone on shift, and have no laptop.
- **What Buffer covers:** ABG/VBG from chemistry and physics through physiology, interpretation and clinical correlation, ending in instant reading. It is part of the Citrus app family: Orange Pixel look (accent #F26A1B), dd/mm/yyyy, plain British English, a separate GitHub org per app, and thorough autonomous testing.
- **Google:** the shared Citrus OAuth client is built in. The origin `https://buffer-gases.github.io` must be in its authorised JavaScript origins. GitHub Pages must be on (main / root).

## Beta round in progress (started 13/11, paused for the move)
The user asked for 30 beta testers across the app's parts, with their notes handed to 30 developers to make "the ultimate perfect Buffer".
- **Testers:** all 30 roles are in `dev/beta/ROLES.md` and their brief is `dev/beta/BRIEF-testers.md`. Notes from 29 are in `dev/beta/notes/` (T<NN>-*.md with full context; T<NN>-*.jsonl with one finding per line), 1,202 findings in total. T29 (robustness and performance) was cut off by a container restart and resumed; if its notes are missing, rerun it.
- **Triage:** `dev/beta/triage.py --split` turns the notes into 30 developer inboxes in `dev/beta/inbox/D<NN>.jsonl`. The ownership map (who owns which files) is `dev/beta/DEVS.md`, and the developers' brief is `dev/beta/BRIEF-devs.md`.
- **Developers:**
  - Wave 1 (D01–D08: the lesson content in c1–c4, sources in c5/c9, the extra questions in c6–c8, ICU c10, special groups c11) was started in the old project. Their logs are in `dev/beta/devlog/D<NN>.md`.
  - Any inbox without a devlog is still to do. Start D09–D30 in waves of about 8, because the sandbox has 2 CPUs.
- **After the developers:**
  1. run every suite;
  2. bump to 5.0.0 (APP_VERSION in ui1.js, V in sw.js);
  3. regenerate pwa/index.html (head + buffer.html + service-worker tail);
  4. push;
  5. publish the artifact;
  6. update docs and the master log.
- **Highest-priority findings (fix first):**
  - the ROME direction rule is stated backwards (nph, glance);
  - every HAGMA + respiratory alkalosis case is marked "chronic, renally compensated" (e1.js);
  - the unsafe hyperkalaemia/haemolysis drill (c4 tc-bubbles);
  - the sims have no recovery and can be won by clicking everything;
  - the ventilator lab's PaO₂ can exceed the alveolar PO₂;
  - Reset wipes the gas log on every device, and a restore is overwritten by the next sync;
  - sheets can't scroll by touch (`.sheet{touch-action:none}`), so the Round can't start on small phones;
  - five-second read and pattern flash hide Na⁺/Cl⁻ while the answer key needs the anion gap;
  - buffer.html has no charset meta, which garbles characters when served bare.

## Working copy
In the old session the source lived in /home/claude/buffer (a local git repo, baseline commit "4.9.0 baseline before beta"). The scratchpad held the Playwright test scripts (smoke, func, mig, a11y, audit, monkey, twophones with a fake Drive, round). Copies of them are in `dev/tests-scratch/`.
