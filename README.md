# Buffer: Blood Gas Trainer (PWA) · v5.0.0 · 16/11/2026

ABG and VBG from the proton to the bedside. Part of the Citrus app family. It uses the Orange Pixel look and runs offline once installed.

## Publish on GitHub Pages (its own org, so it installs next to your other apps)
1. Create the GitHub organisation **Buffer-Gases** and a public repo **Buffer** inside it.
2. Upload everything in this folder to the repo root (index.html, sw.js, manifest.webmanifest, icons/, README.md).
3. Go to Settings → Pages → Deploy from branch → `main` / root → Save.
4. It goes live at **https://buffer-gases.github.io/Buffer/**. Open it in Chrome or Safari and choose Install / Add to Home Screen.

## Connect to Citrus and Drive
1. In Google Cloud → APIs & Services → Credentials, open the shared **Citrus web** OAuth client and add `https://buffer-gases.github.io` to *Authorised JavaScript origins*.
2. In Buffer → Settings → Google & Citrus, tap **Connect Google**. The shared Citrus client ID is already built in (Advanced shows it if you ever need to change it).
3. Buffer writes `My Apps/hub/buffer/state.json` (progress; two phones merge, nothing is overwritten) and `status.json` (hub contract). It reads `hub/citrus/plan.json` (falling back to `hub/scheduler/`): today's shift sets how long Buffer's ask is, and accepted blocks win over suggestions. If the Google sign-in expires, one tap on Reconnect renews it; Buffer never opens Google's window by itself.

## Links for other apps (4.9)
- Deep links: `?do=round|interp|log|cases|case&id=<case>|weekly|glossary|lesson&id=<lesson>` plus `&from=citrus` or `&from=galen` (shows a back chip). Galen can prefill the interpreter: `?from=galen&do=interp&ph=7.12&pco2=22&hco3=7&na=138&cl=100&lac=4&sample=a`. Old hash links (`#tool-interp`, `#l-<id>`, `#scen-<id>`) still work, plus `#case-<id>`.
- Citrus: status.json now carries `contract: 2`, `metrics`, `actions` (deep links) and weekly `inbox` proposals; `extra.weekly` holds the one-line weekly review.
- Yuzu: Progress → "Send missed points to Yuzu" writes `buffer-misses-<week>.json` into `My Apps/Yuzu/collection/inbox/`; the Glossary writes `buffer-words.json` (vocab cards, the same format as Mephisto's).
- Reasoning app: "Hand off to reasoning" (interpreter and sim debrief) writes a `buffer_handoff` file into `My Apps/hub/handoff/`.
- Photo of a printout: the reader (tesseract.js 5.1.1 from jsDelivr) downloads once on first use, is cached by the service worker, and runs on the device. You confirm every number before it is used.

## Updating
1. Run `bash tests/gate.sh` in the source folder: every step must pass.
2. Run `python3 build.py --pwa`. It writes buffer.html and pwa/index.html (PWA head + the app + the service-worker registration).
3. Bump the `V` constant in sw.js so installed copies refresh. Open copies show "Buffer updated. Reload when you finish this gas." instead of switching silently.

## Offline behaviour (sw.js)
- Opening the app tries the network for up to 3 s, then shows the cached copy, so slow hospital Wi-Fi never leaves a blank screen.
- Only a real copy of the app (status 200, HTML, at the start address) replaces the offline copy. A 404 or a server error never does.
- The photo reader (tesseract.js 5.1.1: script, worker, wasm core and English data, all from cdn.jsdelivr.net) is kept in the cache `buffer-ocr-5.1.1` after its first use. A new reader version gets a new cache and the old one is deleted.
- Google Fonts are cached too (stale-while-revalidate).

## Test offline on your computer
Registration works on https and on http://localhost. For example, run `python3 -m http.server 8811` inside this folder, open http://localhost:8811/, reload once, then switch the browser to offline in DevTools (Application → Service workers → Offline) and reload.
