# Prevzaté (vendored) skilly — externé zdroje

Skilly, ktoré nie sú náš vlastný obsah, ale sme ich prevzali do repozitára,
aby ich mali k dispozícii všetky sedenia (a synchronizovali sa cez git/Obsidian).

## Emil Kowalski — design engineering & motion (MIT)

- **Zdroj:** https://github.com/emilkowalski/skills
- **Autor / copyright:** Emil Kowalski
- **Licencia:** MIT (viď `EMIL-KOWALSKI-LICENSE.txt`)
- **Prevzaté skilly (podmnožina):**
  - `emil-design-eng/` — filozofia vkusu, UI polish, komponenty, neviditeľné detaily
  - `animate/` (+ `RECIPES.md`) — ako stavať motion správne (krivka, trvanie, prerušenie, exit)
  - `review-animations/` (+ `STANDARDS.md`) — kritika motion podľa vysokej remeselnej latky
- **Na čo u nás:** zvyšujú „vkusovú" úroveň frontendu k cieľu „nerozoznateľné od AI".
  `frontend-dev` ich používa pri stavbe motion/komponentov; `qa-a11y` a brána kvality
  (`docs/sablony-kvalita.md`) volajú `review-animations` pri revízii.
- **Neprevzaté (zvážiť neskôr):** `apple-design`, `pick-ui-library`,
  `find-animation-opportunities`, `improve-animations`, `animation-vocabulary`,
  `prototype` — dajú sa pridať rovnako (kópia priečinka do `.claude/skills/`).

> Pri aktualizácii zdroja stačí znova skopírovať priečinky a ponechať tento súbor
> aj licenciu. Neupravujeme obsah prevzatých skillov — prispôsobenie riešime cez
> vlastné agenty/docs, nie zásahom do cudzieho SKILL.md.

## Kandidát do backlogu (zatiaľ NEprevzaté)

- **ui-ux-pro-max-skill** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  (MIT). Veľká knižnica dizajn systémov (84 štýlov, 192 paliet, 161 pravidiel…).
  Vhodné skôr pre `ui-ux-designer` pri **rozbiehaní novej odvetvovej šablóny**,
  nie do každého sedenia (veľký kontext). Detaily v `docs/plan-agenti.md`.
