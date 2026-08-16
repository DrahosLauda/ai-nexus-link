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

## Inšpirované gstackom — vlastné, NEprevzaté skilly (pôvodný kód)

Nie sú to prevzaté súbory — sú to **naše vlastné, od nuly napísané** skilly
(SK, cloud-kompatibilné, bez Bun/lokálnych daemonov), ktoré len **preberajú
koncept/vzor** z gstacku. Uvádzame ich tu kvôli poctivej atribúcii inšpirácie.

- **Zdroj inšpirácie:** `gstack` (balík Claude Code skillov: plán → dizajn →
  review → QA → ship → reflect).
- **Autor:** Garry Tan. **Licencia zdroja:** MIT.
- **Naše skilly inšpirované jeho vzormi:**
  - `design-shotgun/` — vygeneruj 4-6 dizajnových smerov sekcie/stránky naraz
    ako samostatné HTML náhľady + screenshoty (desktop/mobil) → rýchly výber smeru.
    Vzor „design shotgun" (viac návrhov naraz namiesto jedného).
  - `visual-qa/` — spusti frontend v predinštalovanom Chromiu (globálny Playwright),
    preklikaj `/ukazky/*`, odfoť desktop/tablet/mobil a odmeraj vizuálne veci
    (horizontálny scroll, 1×h1, chyby v konzole, rozbité obrázky, fokus) proti
    `docs/sablony-kvalita.md`. Vzor „browser QA"; rozširuje statický `qa-a11y`.
- **Prečo vlastné a nie gstack naostro:** gstack je **lokálny-first** (vyžaduje
  Bun, team-mode symlinky, lokálne daemony) → do našich cloud web sedení priamo
  nesadne. Preto „cesta B" — prevziať najlepšie vzory ako odľahčené cloud skilly.
  Rozhodnutie a shortlist: `docs/dennik.md` (Backlog → „gstack").
- **Poznámka k licencii:** keďže **nepreberáme kód**, nejde o vendoring pod cudzou
  licenciou — je to len uznanie inšpirácie. Náš kód týchto skillov je náš vlastný.

## Kandidát do backlogu (zatiaľ NEprevzaté)

- **ui-ux-pro-max-skill** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  (MIT). Veľká knižnica dizajn systémov (84 štýlov, 192 paliet, 161 pravidiel…).
  Vhodné skôr pre `ui-ux-designer` pri **rozbiehaní novej odvetvovej šablóny**,
  nie do každého sedenia (veľký kontext). Detaily v `docs/plan-agenti.md`.
