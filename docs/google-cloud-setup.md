# Google for the Citrus apps — one Cloud project, one sign-in

**05/11/2026: the redirect sign-in described in earlier versions of this note is gone.** All apps (Citrus Maxima, Orange 8.5+, Yuzu 1.1.1+) use the Google Identity Services *token client*: the shared web client only needs each app's origin in **Authorised JavaScript origins** — no redirect URIs. The Drive layout and the plan/status files are in `claude/hub-contract.md` (corrected the same day from Citrus's code).

## What the user does per app (1 minute)
1. console.cloud.google.com → project → APIs & Services → Credentials → the web client `753489712404-ra7ahu…` (Citrus's, shared).
2. Authorised JavaScript origins: add the app's origin — `https://yuzu-cards.github.io` for Yuzu (Citrus: `https://amaerys.github.io`, Orange: `https://orange-fitness.github.io`). Save; it takes a few minutes.
3. In the app: Settings → Google → **Connect Google**. Google's window opens once.

Google's token lasts an hour. Phones only allow its window from a tap, so after an hour the apps wait for a tap (Sync now, pull to sync, or the "Tap to reconnect" nudge) and renew without asking again.

---
(Older notes below are kept for history; where they mention redirect URIs or `prompt=none` bounces, they are superseded.)

# Google for the Citrus apps — one Cloud project, one sign-in, Drive as the hub

Updated 02/11/2026 (second version: Yuzu now follows the hub contract, `claude/hub-contract.md`). The Cloud project ("My Apps", Testing mode) already exists; Orange 8.4.0 and Yuzu 1.1.0 use it.

## What the user does per app (2 minutes)

Each app signs in by **redirect** (OAuth implicit flow: the app sends you to Google, Google sends you back with a one-hour token in the URL). Google only sends tokens back to addresses listed on the web client, so for every app:

1. console.cloud.google.com → project **My Apps** → APIs & Services → Credentials → the **Citrus web** client (id `753489712404-ra7ahu…`, the one Yuzu and Citrus default to; Orange has its own `…m8600u…`).
2. **Authorised JavaScript origins**: add the app's origin, e.g. `https://yuzu-cards.github.io`.
3. **Authorised redirect URIs**: add the app's exact address with the trailing slash, e.g. `https://yuzu-cards.github.io/` (and `https://yuzu-cards.github.io/Yuzu/` while the repo is still called Yuzu). Save.

That's it: the apps default to this shared client id (`DEFAULT_CLIENT_ID` in Yuzu's `src/lib/google.ts`, `GOOGLE_CLIENT_ID` in Orange's). A separate client per app also works; paste its id in the app's Settings → Google → Client ID (advanced).

Scopes asked: `drive` (full, so folders you fill by hand on a PC are visible too), `userinfo.email`, and in Yuzu `calendar.events` (optional study blocks). Testing mode: only the test user (you) can sign in; Google never needs to verify the app. The "unverified app" screen appears once: Advanced → Go to My Apps.

## Drive layout (the hub)
```
My Apps/
  Rotas/                      the department's schedule .xlsx files, saved here each month (any app reads them)
  hub/orange/status.json      written by Orange
  hub/yuzu/status.json        written by Yuzu
  hub/scheduler/plan.json     written by Citrus Maxima: the day's blocks per app (Yuzu reads its own)
  Yuzu/collection/            Yuzu's card collection: manifest.json + shards (notes__N.json, cards__N.json, reviews__YYYY-MM.json, settings.json …), lock.json, inbox/ for packs from Claude
  Yuzu/media/                 the master copy of every image and sound, by file name
```

## How Yuzu uses it (the pattern to copy)
- **Sign-in** (`src/lib/google.ts`): `startConnect(clientId, {silent})` navigates to Google; `captureRedirect()` at boot takes the token from the hash and saves it in `localStorage` (`yuzu-google`, device only). A quiet renewal (`prompt=none`) runs at most once a day, never during a study session, and backs off a week after a failure; the coach then shows "Google needs a tap". `gfetch()` adds the token, retries 429/5xx, turns 401 into a cleared token.
- **Collection sync on Drive** (`DriveSync` in `src/lib/drive.ts`): the same shards and manifest as the GitHub engine, one Drive file each (`/` in a path becomes `__`; big shards gzip). `manifest.json` carries a random `rev`; a push re-reads it just before writing and stops on a mismatch ("Another device synced in the meantime" → pull and retry, as before). `lock.json` is written then read back after 400 ms: whoever's nonce is there holds it (12 min). The first connect switches `settings.sync.backend` to `"drive"`; GitHub stays selectable as the fallback. The store's safety checks (never upload a much smaller collection, counts must match after a sync, re-check everything) are unchanged.
- **Media master copy** (`DriveMedia`): index name → {id, size} cached in IndexedDB; a fresh index lists the folder 1,000 a page over a few runs, then the changes feed keeps it current. Each device uploads what Drive lacks and downloads what its own cards reference (≤15 MB a round, in the background); a card that renders a missing file fetches it on the spot (`mediaUrl` → `driveFetchOne`). The PC with Anki's folder linked uploads from there.
- **Rota** (`src/lib/rota.js` + `xlsx.js`, Orange's parser verbatim): once a day Yuzu opens every schedule file in `My Apps/Rotas` this device hasn't read, finds the row by `settings.google.rotaName`, and stores the months in `settings.google.rota` (synced, so one device reading it is enough). `shiftOn(iso)` gives the day's code/kind; `rebuildShiftWeights()` makes a night and the morning after **light (0.5)**, the day between two nights 0.25. Google Calendar remains optional (`settings.google.calendar`).
- **Hub status** (`hubStatus()` → `writeStatus`): the contract shape — summary, today (reviews done, minutes), week Fri→Thu with shift/slot per day, next, asks (today's due load in minutes at your measured pace; the usual session length on the other days), pending (improve marks, retire offers, unsynced), extra (due, overdue, knownNow, retention30…). Written after a sync when the fingerprint changed, at most every 5 min; "Tell Citrus now" forces it.
- **Plan** (`readPlan` → `planToday()`): reads `hub/scheduler/plan.json` in whatever shape Citrus writes (looks for entries mentioning "yuzu" with a date, a start time and minutes) and shows "Citrus planned 25 min at 19:30" on Today; tapping it opens a session of that length.
- **Tests**: `test/fake-google.ts` (sign-in page, Drive files/changes/upload/patch/delete, Calendar) + `test/e2e/google.ts` (20 checks: two devices syncing through Drive, media both ways, rota → weights, plan, status.json, renewal).

## For Citrus Maxima (what to read from Yuzu)
`hub/yuzu/status.json`: `asks[]` are the blocks Yuzu wants (today's minutes come from the real due load); `extra.overdue` > 0 means a catch-up is worth planning on a free day; `pending[]` are nudges. Write `hub/scheduler/plan.json` with `{ date, blocks: [{ app: "yuzu", title, start: "19:30", minutes }] }` and Yuzu shows it within 10 minutes of being opened (or at the next sync).
