# The hub: how the apps share through Google Drive

**Corrected 05/11/2026 from Citrus Maxima's own code** (Amaerys/Citrus-Maxima, main @ ac5c6a2 "v2…", `docs/js/google.js`, `store.js`, `app.js`). The previous version of this doc described a `Citrus Maxima/Apps/…` layout that Citrus only reads as a *legacy fallback*. Citrus is the reader, so its code is the contract. **Speed rules for every app added 05/11/2026 (evening)** — see "Speed" below.

## One Google Cloud project, one sign-in
- One project, Testing mode, only the owner signs in. Every app is a static PWA with no backend and signs in with the **Google Identity Services token client** (no redirect URIs; the app's origin must be in the client's *authorised JavaScript origins*).
- Shared client id (Citrus's default, Orange's and Yuzu's too): `753489712404-ra7ahu34gjl305b4ss1765idmqg7am5s.apps.googleusercontent.com`.
- Tokens last an hour and live on the device only. **Phones only let Google's window open inside a tap**, so a lapsed token is renewed on a tap (Sync now, pull to sync, a "tap to reconnect" nudge) with `prompt: ""` — never in the background (Orange 8.5.2 and Yuzu 1.1.1 learned this the hard way).
- Scopes: apps that write into folders Citrus created, or read rota files you uploaded, need `drive` (drive.file can't see those). Citrus: `calendar`, `drive.file`, `drive.appdata`, `drive.readonly`, `userinfo.email`.

## Drive layout (what Citrus's code reads and writes)
Citrus's "Drive folder" setting defaults to **`My Apps`**, and its loader rewrites a saved `Citrus Maxima` back to `My Apps` ("layout shared with Orange & Mephisto").
```
My Apps/
  Rotas/                      the department's schedule .xlsx files (GP / Upper Village / FSED), saved here each month — Citrus imports them
  hub/
    <app>/status.json         each app's "where I am" — Citrus lists every folder in hub/ (except citrus/) and reads status.json
    orange/data/              Orange's synced training data (lifts, routines, entries, sessions-<year>, manifest)
    citrus/plan.json          Citrus's plan: 10 days of { shift, blocks } plus all blocks (publishPlan)
    citrus/state.json         Citrus's own state
  Yuzu/                       Yuzu's data: collection/ (card sync) and media/ (master copy of images and sounds, in bundles)
Citrus Maxima/
  Apps/<App>.status.json      LEGACY: read by Citrus only when hub/<app>/status.json is missing (early Sinus builds; Orange 8.5.x wrote here)
  Rotas/                      not read by Citrus; Orange (8.6.0+) and Yuzu still look here as a second place, never create it
```
Orange is on this layout since 8.6.0 (05/11/2026): status `My Apps/hub/orange/status.json`, data `My Apps/hub/orange/data/`, rotas from `My Apps/Rotas` then `Citrus Maxima/Rotas`.

## status.json — what Citrus uses
Citrus shows `summary`, and for planning uses `asks` (today's entries: the sum of their minutes), else `next.minutes`, else `estimatedMinutes`. Also read: `title, icon, color, due, streak, nextDue, url, updatedAt`. Everything else is free (`extra`).
```json
{ "app": "yuzu", "title": "Yuzu", "icon": "🍋", "color": "#f2d34b", "url": "https://yuzu-cards.github.io/Yuzu/", "version": "1.7.0", "device": "S25 Ultra",
  "updatedAt": "2026-11-05T09:00:00Z", "summary": "201 cards due (about 70 min); 0 done today.",
  "due": 201, "estimatedMinutes": 70, "streak": 4, "nextDue": "now",
  "today": { "date": "2026-11-05", "done": false, "items": [] },
  "week": { "start": "2026-10-31", "end": "2026-11-06", "done": 3, "target": 6, "need": 3, "days": [ { "date": "2026-10-31", "shift": "D2", "studied": true, "planned": false, "slot": "before" } ] },
  "next": { "title": "Yuzu: 201 cards", "minutes": 70 },
  "asks": [ { "date": "2026-11-05", "title": "Yuzu: 201 cards", "minutes": 70, "slot": "free" } ],
  "pending": [ "12 cards marked for Claude to improve" ],
  "extra": { "due": 201, "overdue": 188, "knownNow": 162, "retention30": 50, "totalCards": 147835, "exams": [ { "name": "Step 1", "date": "2027-01-20", "daysLeft": 74, "needNewPerDay": 31, "covered": 40, "predictedRecall": 78, "onTrack": false } ] } }
```
- `slot`: `free | before | early | postnight | tough` (fit of the day around shifts).
- `nextDue` (Orange): `today | tomorrow | <date> | this week | done for the week`.
- Writers upload only when the content changed (fingerprint of everything but `updatedAt`), at most every 5 minutes unless forced. Never tokens or card contents.
- **Two phones (learned in Orange's 05/11 beta test):** write the status only after this phone has synced (a phone that just connected hasn't pulled the other's data and would post an empty week); a change inside the 5-minute gap is written when the gap ends, not dropped; after a sync, if the file's md5 on Drive isn't the one this phone wrote, the other phone wrote it since — write again (both phones hold the same data by then).

## plan.json — Citrus's answer (what the apps read)
`My Apps/hub/citrus/plan.json`, written by Citrus's `publishPlan()`:
```json
{ "app": "citrus", "updatedAt": "…", "from": "2026-11-05",
  "days": { "2026-11-06": { "shift": { "code": "N2", "label": "Night", "site": "Lower Village", "start": "20:00", "end": "08:00", "overnight": true, "mci": false }, "blocks": [ … ] } },
  "blocks": [ { "app": "yuzu", "title": "Yuzu reviews", "date": "2026-11-05", "start": "19:30", "end": "19:55", "minutes": 25, "status": "accepted", "goalId": "…" } ] }
```
- `status`: `accepted` / `done` = you agreed in Citrus; no status = Citrus's suggestion. `app` comes from the goal or Citrus's guess from the title.
- `days[date].shift` is Citrus's view of your rota **including swaps** — the best shift source for every app (null = off).
- Citrus also writes accepted blocks to Google Calendar (`extendedProperties.private.citrus = "plan"`); apps that already read Calendar can use that instead.

## Speed: how every app should talk to Drive (from Yuzu 1.1.3, 05/11/2026)
Measured on Yuzu with the real collection against a stand-in Google that takes 150 ms per request (a phone on mobile data). These rules carry over to Orange, Mephisto, Sinus and Citrus; each is a few lines in the app's Drive layer.

1. **One look at the changes feed instead of listing folders.** Keep one Drive changes token per device (`changes/startPageToken` once, then `changes?pageToken=…&fields=nextPageToken,newStartPageToken,changes(fileId,removed,file(id,name,parents,trashed,modifiedTime,appProperties))&pageSize=1000&spaces=drive&includeRemoved=true`). One request tells what moved anywhere in My Drive: your data folder (another phone synced), `hub/citrus/plan.json`, `Rotas/`, other apps' `status.json`. Nothing moved → stop there. Share that one look between sync and refresh (a few seconds' cache), and still do a full check once a day as a safety net. Yuzu: a sync with nothing new went from 10 requests / 1.9 s to **1 request / 0.4 s**; requests in the first 9 s after opening went from 21 to 7.
2. **Put the revision in appProperties.** Write the manifest (or whatever file marks "a sync finished") with `appProperties: { rev }`. The changes feed carries appProperties, so a device can tell its own write from another phone's without downloading anything, and the listing tells whether the copy you already hold is still current.
3. **Trust cached folder ids.** Check a cached folder id once per app session (one request for the deepest folder vouches for the path), not on every call. Yuzu was spending a request per folder per call on this.
4. **Many small files go in bundles.** Drive lets one account create only a few files a second, so 47,000 images one by one take hours whatever the connection. Yuzu packs a few hundred files into one ~6 MB Drive file: `YZB1` + uint32 header length + JSON header `{v:1, f:[[name, offset, size, type]]}` + bytes, with `appProperties {yzb:"1", t:<header bytes>}`. Another device reads just a header with a ranged GET (`Range: bytes=0-<t-1>`), fetches a whole bundle when it wants most of it, or one file with a ranged read. Bundles never change once written. Yuzu: 3,000 images went from 3,303 requests / 154 s down to **25 requests / 7 s** on a second device. Uploads now take as long as the bytes do, not hours.
5. **Uploads resume.** Each file carries a content fingerprint (`appProperties.h`); a retried sync skips what's already there. Retry dropped connections with jittered backoff (~25 s), back off on 429/5xx/403-rate-limit, and stop all workers on the first real failure (a pool, not a bare `Promise.all`).
6. **Don't block the answer on housekeeping.** Release the lock and delete duplicate files after the sync reports done, not before.
7. **Open fast.** Never read big libraries (media, attachments) before the first screen. Read them after, a chunk at a time (`getAllKeys`, then `getAll(range)` with a yield between chunks), and fetch the one file a screen needs right away. Read small settings records together, not one after another. Yuzu: opening went from ~5–6.5 s to **~2 s** (desktop, 20,000 media files); on a phone with 47,000 it's a bigger win.
8. **Long transfers keep the screen on** (`navigator.wakeLock.request("screen")` while moving, released when done). Count progress over the whole library ("12,340 of 47,210 on Drive"), so it never looks like it restarted, and carry on by itself when the app comes back to the foreground or back online.

Yuzu code to copy: `src/lib/google.ts` (`changesSince`, `startToken`, `fileMeta`, ranged `downloadBytes`, `findFolders` with the session check), `src/lib/drive.ts` (`makeBundle`, `parseBundleHeader`, `DriveMedia.uploadBundle/readHeaders/fetchMany/fetchOne`, `applyMediaChanges`), `src/lib/store.ts` (`driveWatch`), `test/fake-google.ts` (Range, metadata, changes with appProperties).

## How Yuzu does it (1.1.3)
- Sign-in: GIS token client, shared client id, renewal only on taps (`renewOnTap()` from Sync now / pull to sync / the coach's "Tap to reconnect Google").
- Status: `hubStatus()` → `My Apps/hub/yuzu/status.json` after every sync that changed something; "Tell Citrus now" forces it.
- Plan: `planToday()` shows Yuzu's accepted block ("Citrus planned 25 min at 19:30"), else Citrus's suggestion; tapping starts a session of that length. plan.json is re-read only when the changes feed says Citrus wrote a new one (or on a tap).
- Shifts: `days[date].shift` from plan.json first (swaps included), else the rota files from `My Apps/Rotas` and `Citrus Maxima/Rotas`; a night and the morning after are light days, between two nights lighter still.
- Data: `My Apps/Yuzu/collection` (sharded sync, manifest `rev` also in its appProperties, `lock.json` by install id) and `My Apps/Yuzu/media` (bundles `bundle-<date>-<id>.yzb` plus any loose files dragged in from a PC; index kept by the changes feed).
- One changes-feed look (`driveWatch()`) feeds sync, refresh, plan, rota, inbox and media.
- Code to copy: `src/lib/google.ts` (GIS sign-in, Drive helpers, `changesSince`, ranged `downloadBytes`, `findFolders`), `src/lib/drive.ts` (`DriveSync`, `DriveMedia` with bundles, `applyMediaChanges`, `readPlan`, `newRotaFiles`, `writeStatus`), `src/lib/store.ts` (`driveWatch`), `test/fake-google.ts` (GIS stub that records whether a window opened inside a tap; Drive files/changes/upload/patch/delete/Range).

## How Orange does it (8.6.0)
- Sign-in: GIS token client (`src/lib/google.js`), renewal only on a tap (`navigator.userActivation`); the header says "Google sign-in expired · tap ⇅" when changes are waiting.
- Status: `hubStatus()` (`src/lib/hub.js`) → `My Apps/hub/orange/status.json`: `due` = sessions still needed this week, `asks` = one per planned day following the routine rotation, minutes capped by that day's shift (30 before a far-site early shift, 45 after a night…), a combined Sat+Sun session counts 2.
- Plan: accepted/done blocks with `app: "orange"` from plan.json (tagged calendar events as the fallback), shown under the week strip ("Citrus planned: today 17:15–18:05").
- Data: `src/lib/driveSync.js` keeps the GitHub store's contract, so the same sync engine and two-phone tests cover both stores. Not yet on the speed rules (changes feed, appProperties rev, session folder check).

## Hand-offs with Claude and other apps (Yuzu 1.3.0, 07/11/2026)
Everything lives under `My Apps/Yuzu/` (Yuzu's own folder, nothing in the hub folders):
```
My Apps/Yuzu/collection/        card sync (manifest.json, shards, lock.json)
  inbox/                        TO Yuzu: packs, curation files, captures from other apps
  outbox/                       FROM Yuzu: capture-<id>.json, improve.json
My Apps/Yuzu/media/             bundles (+ .toc files)
My Apps/Yuzu/backups/<date>/    daily server-side copy of the collection folder (7 days + 4 weeks)
```
**Inbox** (what Yuzu accepts; each file is reviewed by the user before anything is added):
- `{ "yuzu_pack": 1, "id", "name", "category", "tags", "cards": [ … ] }` — card types `cloze` (`text`, `extra`), `basic` (`front`, `back`), `mcq` (`question`, `options`: strings + `answer` index/letter, or `{text, correct, why}`; `explanation`), `occlusion` (`image` data URL, `masks: [{x,y,w,h,label}]` in percent). Stable card `id`s make a re-sent pack update cards in place and keep review history.
- `{ "yuzu_curation": 1, … }` — edits, merges, suspends for cards marked to improve.
- `{ "yuzu_capture": 1, "app": "Orange", "text": "…", "image": "data:image/…", "id": "optional" }` — another app (or Claude) leaving a thought for later: Yuzu keeps it under Captured and deletes the file. Names must end in `.json`.
**Outbox** (what Claude or an app can read; Yuzu never deletes what it did not write, and a capture file is rewritten only once):
- `capture-<id>.json`: `{ yuzu_capture: 1, id, at, from, text, image?, for_claude }`. Turn it into a pack, put the pack in `../inbox/`, delete the capture file.
- `improve.json`: Yuzu's improve export (`{ yuzu_improve: 1, count, for_claude, reasons, cards: [...] }`), present while cards are marked, removed when the list empties.
**Claude delivering a pack** from a session with the Google Drive connector: `create_file` with the pack JSON in the `inbox` folder (find its id by searching for the folder named `inbox` under `Yuzu › collection`). Yuzu sees it on its next sync (the changes feed flags the inbox), shows "n new packs" on Today. Nothing is written to the user's Drive unless the user asked Claude to deliver something.
**Reminders:** a web app has no push server. Yuzu 1.3.0 uses Android Chrome's periodic background sync for one notification a day (after a chosen time, cards due, goal not met, quiet on light days); for an exact-time reminder, the dependable route is Citrus's calendar block, which Yuzu already asks for through `status.json` (`asks`). Yuzu also adds a `pending` line and `extra.exams` for countdowns that are behind.

## Yuzu on contract v2 (1.5.0, 12/11/2026)
Citrus's HUB.md is the source; this is what Yuzu sends. Checked by a browser test that runs **Citrus's own `normalizeStatus`** (vendored at `test/vendor/citrus-inbound.mjs` from Citrus 45e6562) on Yuzu's file: no issues.
```json
"contract": 2,
"metrics": [ { "key": "cards-due", "label": "Cards due", "value": 1295, "goal": 0, "unit": "cards", "date": "2026-11-12" },
             { "key": "reviews", "label": "Reviews today", "value": 28, "goal": 60, "unit": "reviews", "date": "…" },
             { "key": "minutes", … }, { "key": "new-cards", … goal = new per day }, { "key": "retention", "unit": "%", goal = target recall } ],
"progress": [ { "key": "exam-<id>", "label": "Step 1 introduced", "pct": 40, "date": "…" } ],
"inbox": [ { "id": "leeches-2026w46", "type": "task", "title": "Yuzu: sort out 12 leech cards", "minutes": 10, "pri": 2, "url": "…/Yuzu/?do=leeches", "expires": "…" },
           { "id": "exam-<id>-2026w46", "type": "task", "title": "Yuzu: Step 1 needs 31 new cards a day", "minutes": 5, "pri": 1, "url": "…/Yuzu/?do=exam" } ],
"actions": [ { "id": "review", "label": "Review 1,295 cards", "url": "https://yuzu-cards.github.io/Yuzu/", "icon": "🍋", "minutes": 45 },
             { "id": "drill" }, { "id": "capture" }, { "id": "practice" }, { "id": "exam" (only with an exam set) } ]
```
- Proposal ids are stable per ISO week, so Citrus never shows the same one twice in a week.
- **Deep links:** Yuzu reads `?from=citrus&do=review|study|drill|exam|capture|practice|workload|leeches|settings` on load, jumps there (over a resumed study session), cleans the address, and shows a **← Citrus** chip on Today linking to `https://amaerys.github.io/Citrus-Maxima/?from=yuzu` while opened from Citrus.
- `slot` values `early | postnight | tough` are read by Citrus as `free` (its reader only knows `before`/`free`); kept for Yuzu's own week view.

## Yuzu 1.6.0–1.7.0 changes (12/11/2026)
- **Citrus only reads Yuzu by default** (the user's choice): `asks: []`, `next: null`, no `estimatedMinutes`; the estimate is in `extra.minutesNeeded`. Settings → Google → "Let Citrus plan Yuzu time" brings asks back. Actions now include `add` ("Write a card") → `?do=add` opens quick add.
- **Mephisto → Yuzu words** (agreed: Mephisto sends words). Drop one JSON file per batch into `My Apps/Yuzu/collection/inbox/` (the user reviews it in Yuzu's Inbox before anything is added):
```json
{ "yuzu_pack": 1, "id": "mephisto-words", "name": "Mephisto words", "category": "German::Mephisto", "lang": "de-DE",
  "cards": [ { "id": "meph-schmerz", "type": "vocab", "word": "Schmerz", "article": "der", "plural": "die Schmerzen",
               "meaning": "pain", "example": "Wo haben Sie Schmerzen?", "audio": "data:audio/mpeg;base64,… (optional)", "source": "Mephisto · Klinik 3" } ] }
```
  Stable `id` per word (e.g. `meph-<lemma>`), so re-sending updates the card and keeps its history. Without `audio`, Yuzu's card has a speaker the device reads in German. Each word becomes two cards (word → meaning, meaning → word).
