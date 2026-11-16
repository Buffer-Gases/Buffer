# Buffer: hand-off (Citrus project) · 5.0.0 · 16/11/2026

Buffer is moving from the "Programs and Apps" Claude project to the Citrus project. This repo is now the single place that carries everything a new chat needs: the full source, tests, notes, contracts and the beta round in progress.

## Where things live
- **Live app:** https://buffer-gases.github.io/Buffer/. The repo root holds the built PWA (index.html, sw.js, manifest, icons).
- **Source:** `dev/src/`. build.py concatenates the source files and writes buffer.html. Current version: 5.0.0 (16/11/2026).
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
- **The user:** a GP/ER doctor in Saudi Arabia preparing for MRCEM and USMLE Step 1/2. They study on a Steam Deck with a 27" monitor and a Samsung tablet, use a phone on shift, and have no laptop.
- **What Buffer covers:** ABG/VBG from chemistry and physics through physiology, interpretation and clinical correlation, ending in instant reading. It is part of the Citrus app family: Orange Pixel look (accent #F26A1B), dd/mm/yyyy, plain British English, a separate GitHub org per app, and thorough autonomous testing.
- **Google:** the shared Citrus OAuth client is built in. The origin `https://buffer-gases.github.io` must be in its authorised JavaScript origins. GitHub Pages must be on (main / root).

## Beta round: finished, released as 5.0.0 (16/11/2026)
30 testers (1,227 findings) → 30 developers → 4 integrators (141 cross-file requests) → an independent release check (no blockers). The full record is in `dev/beta/`:
- `notes/`: tester notes;
- `inbox/`: developer inboxes;
- `devlog/D<NN>.md`: one line per finding;
- `integ/I<N>-done.md`: one line per request.

The release summary, the deferred list and what was not verified are in `docs/buffer-5-0-release.md`.

## How to release
1. Edit the source in `dev/src/`.
2. Run `python3 build.py`, then `bash tests/gate.sh`. All 11 steps must pass.
3. Run the fake-Drive tests, `python3 tests/drive/twophones.py`, `race2.py` and `sabotage.py`, whenever sync changes.
4. Bump `APP_VERSION` in ui1.js and `V` in pwa/sw.js, and set the version and date on line 1 of pwa/README.md.
5. Run `python3 build.py --pwa`, which writes pwa/index.html. Copy the pwa/ files to the repo root and push.
6. Publish the artifact https://claude.ai/artifact/2i1ByVL4CEPyZUjSxheczD with buffer.html.
7. Update the Citrus project docs (claude/buffer-notes.md, buffer-roadmap.md, buffer-handoff.md, apps-directory.md) and the master log.

## Next (5.1 candidates)
See "Deferred to 5.1+" in docs/buffer-5-0-release.md. The quickest wins are the five small fixes from the release check.

## Working copy
Clone the repo and work in `dev/src/`. The tests are in `dev/src/tests/`, and the fake-Drive tests are in `tests/drive/`. The older Playwright scripts are in `dev/tests-scratch/`.
