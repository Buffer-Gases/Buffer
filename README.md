# Buffer: Blood Gas Trainer (PWA) · v4.2.0 · 07/11/2026

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

## Updating
Replace index.html and bump the `V` constant in sw.js so installed copies refresh.
