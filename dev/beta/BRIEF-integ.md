# Buffer 5.0 integration brief (I1–I4)

The 30 developers have finished. During their work they filed cross-file requests in
`beta/devlog/requests.jsonl` because they could only edit their own files. Some were done later by the
target owner, many were not. You are one of four integrators and you own a fixed set of files.

Source: /home/claude/buffer (git repo; build with `python3 build.py`; tests `node tests/run.js`;
full gate `bash tests/gate.sh`, which must stay green). Developer logs: beta/devlog/D01–D30.md.
Briefs for context: beta/BRIEF-devs.md.

## Your job
1. Read your request list `beta/integ/I<N>.jsonl` (one JSON per line: from, to_file, what, why, n).
2. For each request, check the CURRENT code: is it already done (by the owner or someone else)?
   - Done → record "already".
   - Not done, safe, and clinically right → implement it with the Edit tool, keep the change small.
   - Wrong, risky, or superseded → record "declined" with a one-line reason.
   - Needs a file you do not own → record "handoff" and name the file. Do NOT edit it.
3. Also do the extra items listed in your launch message.
4. After your edits: `python3 build.py` must pass, `node tests/run.js` must stay at 0 failed,
   and `bash tests/gate.sh` must pass. Use headless Playwright (require('playwright'),
   chromium.launch()) to load buffer.html and check for page errors in the views you touched, at 390×844.
5. Write `beta/integ/I<N>-done.md`: one line per request `n | already/fixed/declined/handoff | note`,
   then a short "for the lead" section.

## Rules
- Edit ONLY your own files. Other integrators are editing the rest at the same time.
- Use the Edit tool, not sed or scripts that rewrite files.
- Keep behaviour backwards compatible with 4.9 saves (state key buffer.v1, schema v4).
- Clinical content: plain British English, mmHg and mmol/L, dates dd/mm/yyyy, no names or patient data.
- Don't commit to git; the lead commits.
- Final reply: counts (already/fixed/declined/handoff), build and test result, anything the lead must know. Keep it short.
