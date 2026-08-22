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

## Next Level Builder — katalóg dizajn systémov (MIT)

- **Zdroj:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Autor / copyright:** Next Level Builder
- **Licencia:** MIT (viď `ui-ux-pro-max/UI-UX-PRO-MAX-LICENSE.txt`)
- **Snímka:** commit `bc826e2`, 20. 8. 2026. Prevzaté 22. 8. 2026.
- **Prevzaté:** `ui-ux-pro-max/data/` — **448 KB dát**, nie ich nástroje:
  `styles.csv` (88 štýlov), `colors.csv` (192 paliet podľa typu produktu),
  `typography.csv` (74 font párov), `ui-reasoning.csv` (192 odvetvových pravidiel),
  `ux-guidelines.csv`, `products.csv`, `landing.csv`, `data-provenance.json`.
- **`SKILL.md` je NÁŠ vlastný** (slovenský) — popisuje, ako katalóg použiť v našom
  postupe. Pôvodné SKILL.md sme nepreberali, viď nižšie.
- **Na čo u nás:** `ui-ux-designer` pri **rozbiehaní NOVEJ odvetvovej šablóny** —
  voľba štýlu, palety a typografie predtým, než sa píše `theme.css`.
- **Zámerne NEprevzaté** (celé repo má 23 MB, vzali sme 448 KB):
  - `cli/` (4,9 MB) — ich inštalátor;
  - `phosphor-icons-upstream.json` (805 KB), `google-fonts.csv` (730 KB),
    `google-font-licenses.json` (423 KB) — objemné výpisy dohľadateľné online;
  - ich skilly `design`, `brand`, `slides`, `ui-styling`, `banner-design` — sú
    v angličtine a viazané na ICH postup (**shadcn/ui + Radix**, generovanie loga
    cez Gemini, HTML prezentácie). Naše šablóny sú ručný Tailwind v4 a máme
    vlastnú bránu kvality.
  - `screenshots/`, `gallery/`, `stack/`, `projects/`.
- **Ak by sa neskôr hodil `banner-design`** (28 KB) k social agentovi (P4),
  prevezme sa vtedy samostatne.
- **Pozor — dáta starnú.** Naša pôvodná poznámka hovorila „84 štýlov, 161 pravidiel";
  repo dnes hlási 79/192. Pred dôležitou šablónou over aktuálnu verziu v zdroji.
