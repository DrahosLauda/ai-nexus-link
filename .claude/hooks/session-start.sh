#!/bin/bash
# SessionStart hook — AI Nexus Link
#
# Robí DVE veci pri štarte KAŽDÉHO sedenia:
#   1) KONTEXT (vždy, aj lokálne aj web): naservíruje na stdout ČISTÉ JSON
#      s hookSpecificOutput.additionalContext = silná inštrukcia (slovenčina,
#      prečítať dennik+vizia, Pravidlá spolupráce z CLAUDE.md) + živý Backlog
#      načítaný priamo z docs/backlog.md (nikdy nie je zastaraný — číta sa za behu).
#   2) ZÁVISLOSTI (len web, CLAUDE_CODE_REMOTE=true): cd frontend && npm install,
#      aby lint/build/testy bežali hneď (bolesť M1: node_modules v cloude chýba).
#
# Pozor: stdout musí byť LEN čisté JSON. Všetok ostatný výstup (npm install,
# diagnostika) ide na stderr (1>&2), nech nerozbije JSON.
set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

# --- 1) ZÁVISLOSTI (len v cloud sedení; výstup na stderr) ---
# npm install (nie npm ci) → využije cache kontajnera, po prvom behu rýchly.
# Zlyhanie neukončí hook — kontext naservírujeme tak či tak.
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  if [ -d "$PROJECT_DIR/frontend" ]; then
    echo "session-start: npm install vo frontend/ …" 1>&2
    ( cd "$PROJECT_DIR/frontend" && npm install ) 1>&2 \
      || echo "session-start: npm install zlyhal — pokračujem, kontext servírujem tak či tak." 1>&2
  fi
fi

# --- 2) KONTEXT (vždy): silná inštrukcia + živý Backlog ---
python3 - "$PROJECT_DIR/docs/backlog.md" <<'PY'
import io, json, sys

backlog_path = sys.argv[1]

# Backlog má vlastný súbor (docs/backlog.md) — číta sa celý, nič sa nevyrezáva.
backlog = ""
try:
    with io.open(backlog_path, encoding="utf-8") as f:
        backlog = f.read().strip()
except Exception as exc:  # backlog nedostupný — servíruj aspoň inštrukciu
    print("session-start: backlog.md sa nepodarilo prečítať: %s" % exc, file=sys.stderr)

instrukcia = (
    "Komunikuj po SLOVENSKY (obsah aj konverzácia).\n\n"
    "SKÔR NEŽ ZAČNEŠ pracovať, prečítaj `docs/backlog.md` (otvorené úlohy — sú "
    "aj nižšie), `docs/dennik.md` (najnovšie záznamy navrchu) a `docs/vizia.md` "
    "— kvôli aktuálnemu stavu, rozhodnutiam a ponaučeniam.\n\n"
    "Rešpektuj „Pravidlá spolupráce“ z `CLAUDE.md`:\n"
    "• Go-live (zverejnenie do Googla) a predaj sú ZAMKNUTÉ — nenavrhuj ich, "
    "nesmeruj k nim; idú len na výslovný pokyn majiteľa.\n"
    "• Jedno sedenie = jeden typ (porada/plán · kód · dizajn · agenti) "
    "— nemiešaj; keď sa to rozbieha, upozorni a navrhni rozdelenie.\n"
    "• Jedna úloha → dokončiť → overiť → zavrieť. Žiadne „a ešte toto“.\n"
    "• Žiadny zhon; tempo určuje majiteľ; nepýtaj sa dvakrát na to isté; buď rozhodný.\n"
    "• Vždy presné príkazy do terminálu (žiadne placeholdery bez vysvetlenia).\n"
    "• Do `main` len cez vetvu + PR; merge a iné nezvratné kroky až po výslovnom súhlase.\n"
    "• Na konci sedenia zapíš do `docs/dennik.md` (čo hotové, čo naživo, čo čaká)."
)

context = instrukcia
if backlog:
    context += "\n\nŽIVÝ Backlog (aktuálny stav priamo z `docs/backlog.md`):\n\n" + backlog

out = {
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": context,
    }
}
json.dump(out, sys.stdout, ensure_ascii=False)
PY
