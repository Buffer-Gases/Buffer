#!/usr/bin/env bash
# Release gate for Buffer (D23). Runs every check, prints one line per step and exits 1 if any step failed.
#   bash tests/gate.sh          (from anywhere)
# Steps: build (syntax + duplicate names), engine tests, XQ batches c6-c8, bank lint (all lessons + XQ),
# Henderson check of every lesson, question, case and shift gas, parser regressions (D15), the generator sweep (D28), the Python
# reference (acid-base, venous, oxygenation), and the service worker's syntax.
cd "$(dirname "$0")/.." || exit 2
fails=0; log=$(mktemp)
step(){ local name="$1"; shift
  if "$@" >"$log" 2>&1; then printf 'PASS  %-12s %s\n' "$name" "$(tail -n 1 "$log")"
  else fails=$((fails+1)); printf 'FAIL  %-12s\n' "$name"; sed 's/^/      /' "$log" | tail -n 25; fi; }
step build      python3 build.py
step charset    bash -c 'head -c 1024 buffer.html | grep -qi "<meta charset=\"utf-8\">" && grep -qi "name=\"viewport\"" buffer.html && echo "buffer.html declares utf-8 and a viewport"'
step engine     node tests/run.js
step xq         bash -c 'node tests/xq.js c6.js c7.js c8.js | tee /dev/stderr | tail -n 1 | grep -q " 0 structural problems, 0 where"'
step lint       node tests/lint.js
step henderson  node tests/henderson.js
step parser     node tests/parse.js
step corpus     node tests/corpus.js
step sweep      node tests/sweep.js 30
step reference  bash -c 'node tests/run.js dump >/dev/null && python3 -I tests/reference.py tests/random.json'
step sw         bash -c 'node --check pwa/sw.js && echo "pwa/sw.js parses"'
rm -f "$log"
if [ "$fails" -eq 0 ]; then echo "GATE: all steps passed"; else echo "GATE: $fails step(s) failed"; fi
exit $((fails>0))
