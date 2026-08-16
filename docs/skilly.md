# Skilly a agenti — čo máme a ako ich vyvolať

> Prehľad všetkých **skillov** a **sub-agentov**, ktoré v projekte máme, na čo
> slúžia a **ako ich spustiť v sedení**. Skilly aj agenti žijú v `.claude/`
> v repozitári → synchronizujú sa cez git do Obsidianu (rovnako ako `docs/`).
> Kontext kvality: `docs/sablony-kvalita.md`. Atribúcia prevzatých: `.claude/skills/VENDORED.md`.

## Čo je skill a čo je agent (v skratke)

- **Skill** = balíček inštrukcií (a niekedy skriptov) k jednej úlohe. **Nespúšťaš
  ho ako program** — Claude ho **automaticky vtiahne**, keď tvoja požiadavka sedí
  na jeho popis, alebo ho vyvoláš výslovne. Žije v `.claude/skills/<nazov>/SKILL.md`.
- **Sub-agent** = samostatná „osobnosť" s vlastným čistým kontextom a modelom, ktorú
  Claude spustí **v rámci** sedenia na izolovanú prácu (napr. QA audit). Žije v
  `.claude/agents/<nazov>.md`. Je to „podsedenie k problému" bez studeného štartu.

## Ako ich vyvolať (tri spôsoby)

1. **Skill automaticky** — len povedz zámer. Napr. *„ukáž mi pár smerov hero
   sekcie"* → nabehne `design-shotgun`. Nič nespúšťaš, žiadny príkaz.
2. **Skill výslovne** — napíš `/<nazov>` (napr. `/visual-qa`) alebo *„použi
   `seo-geo-frontend`"*. Vhodné, keď ho chceš natvrdo, bez hádania.
3. **Sub-agent** — spúšťa ho Claude cez `Agent` nástroj počas práce; môžeš ho aj
   vyžiadať slovami: *„pusti `qa-a11y` audit na kvetinárstvo"*.

> **Skripty vnútri skillov** (napr. `shoot.cjs`, `visual-qa.cjs`) púšťa **Claude**
> počas behu, nie ty v termináli.

## Naše vlastné skilly

| Skill | Na čo | Ako vyvolať |
|---|---|---|
| **`design-shotgun`** | Pre sekciu/stránku vygeneruje **4–6 odlišných dizajnových smerov** (layout + tonalita) ako statické HTML náhľady v rámci `theme.css` a vyrenderuje screenshoty desktop/mobil → rýchly výber smeru **pred** finálnym kódom. | „ukáž mi varianty/verzie sekcie", „neviem ktorým smerom" · `/design-shotgun` |
| **`visual-qa`** | Spustí frontend, preklikaj `/ukazky/*` v desktop/tablet/mobil, odfotí a **automaticky odmeria** horizontálny scroll, 1×`h1`, chyby v konzole, rozbité obrázky, fokus — proti `docs/sablony-kvalita.md`. Interaktívny doplnok `qa-a11y`. | „preklikaj web / sprav screenshoty mobil", „over responzivitu" · `/visual-qa` |
| **`seo-geo-frontend`** | Postaví SEO + GEO základ na headless Next.js (metadata, OG, canonical, `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD) pre Google aj AI vyhľadávače. | „optimalizuj web pre Google/AI", „priprav na indexovanie" · `/seo-geo-frontend` |
| **`site-customizer`** | Prispôsobí hotovú šablónu reálnemu klientovi (texty, farby, údaje, modul) — zmenou obsahu, nie kódu. *Zatiaľ runbook (kostra), plný beh je M4.* | „sprav z tejto šablóny web pre klienta X" · `/site-customizer` |

## Prevzaté (vendored) skilly — vkus a motion (Emil Kowalski, MIT)

Podrobná atribúcia a zdroje: `.claude/skills/VENDORED.md`.

| Skill | Na čo | Ako vyvolať |
|---|---|---|
| **`emil-design-eng`** | Filozofia UI polish, komponentov a neviditeľných detailov, ktoré robia softvér „drahým". | Pri dolaďovaní vzhľadu/detailov (automaticky pri frontend práci) |
| **`animate`** | Ako stavať motion **správne** (poradie rozhodnutí: či animovať → účel → nástroj → vlastnosti → krivka/trvanie → prerušenie → exit). | „pridaj animáciu / oživ komponent" · `/animate` |
| **`review-animations`** | Kritika motion podľa vysokej remeselnej latky (`STANDARDS.md`). **Len ľudsky** — sám sa nespúšťa. | Iba `/review-animations` |

## Sub-agenti — build tím na šablóny (`.claude/agents/`)

Spúšťajú sa **sekvenčne** na tom istom balíku (nie paralelne — krížili by si súbory);
každý na štarte číta `docs/sablony-kvalita.md`. Modely: `docs/sablony-kvalita.md` → „Modely sub-agentov".

| Agent | Rola | Model | Kedy |
|---|---|---|---|
| **`ui-ux-designer`** | Dizajn systém (`theme.css`), rozvrh sekcií/stránok, motion koncept. | Fable | Na začiatku novej šablóny, **pred** kódom |
| **`sk-copywriter`** | SK texty do `content.ts` (proti zoznamu zakázaných AI fráz). | Sonnet | Obsah šablóny / kontrola textov |
| **`frontend-dev`** | Implementácia sekcií — čistý Next.js 16 / Tailwind v4, výkon, a11y. | Opus | Po dizajne + textoch |
| **`qa-a11y`** | Brána kvality pred ľudskou revíziou (checklist, statická kontrola). | Sonnet | Tesne pred odovzdaním majiteľovi |

**Typický reťazec stavby šablóny:** `ui-ux-designer` → (`sk-copywriter` + `frontend-dev`) → `qa-a11y` / `visual-qa` → ľudská revízia.

## Vstavané (globálne) skilly — nie sú v repe

Sedenie má aj **vstavané** skilly prostredia (napr. `skill-creator` na tvorbu
skillov, a súborové ako `pdf`, `docx`, `xlsx`, `pptx`). **Nie sú v našom repe**,
takže **nie sú v Obsidiane** a môžu sa líšiť podľa prostredia — sú dostupné len
počas sedenia. Vyvolávajú sa rovnako (automaticky alebo `/<nazov>`).

## Kde to žije / ako pridať nový skill

- **Repo:** `.claude/skills/<nazov>/SKILL.md` (+ voliteľne `scripts/`, `references/`),
  `.claude/agents/<nazov>.md`. Registrácia nie je potrebná — objaví sa v ponuke sám.
- **Nový skill** stavaj cez vstavaný **`skill-creator`** (`/skill-creator`), potom
  atribúciu (ak je inšpirovaný cudzím zdrojom) zapíš do `.claude/skills/VENDORED.md`.
- **Do `main`** cez vetvu + PR (ako všetko) — až po výslovnom súhlase majiteľa.
