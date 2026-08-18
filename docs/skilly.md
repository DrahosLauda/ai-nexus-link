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

### Na konkrétnom príklade (aby to bolo úplne jasné)

Rozdiel najlepšie ukazuje dvojica, ktorú používame na kontrolu kvality:

- **`visual-qa` = skill, a je nový.** Vznikol 16. 8. 2026 v nástrojovom sedení
  spolu s `design-shotgun` (oba „inšpirované gstackom"). Skill je **zabalený
  postup + skript, ktorý vykonáva Claude vo svojom kontexte** — spustí build,
  naštartuje server, preklikne stránky v troch veľkostiach, odfotí ich a odmeria
  horizontálny scroll, počet `h1`, chyby v konzole, rozbité obrázky a viditeľný fokus.
- **`qa-a11y` = sub-agent, a je starší.** Existuje od budovania šablóny
  kvetinárstva (M2), spolu s `ui-ux-designer`, `frontend-dev` a `sk-copywriter`.
  Sub-agent **nie je postup** — je to **samostatný pracovník s vlastným modelom
  a vlastným kontextom**, ktorého poveríš úlohou a on vráti nález. Preto vidí veci,
  ktoré Claude v rozpracovanom sedení prehliadne: pozerá sa na kód **čerstvými
  očami**, nie tými, čo ho písali.

Skrátene: **skill = „takto sa to má robiť"** (návod, ktorý Claude nasleduje),
**sub-agent = „nech sa na to pozrie niekto iný"** (druhá hlava s vlastným úsudkom).

### Tri vrstvy kontroly — každá chytí iný druh chyby

⭐ **Ponaučenie z realizačného sedenia E1** (katalóg kytíc, 17. 8. 2026): tieto
vrstvy sa **nenahrádzajú**. „`visual-qa` prešiel" ešte neznamená hotovo — a naopak.

| Vrstva | Čo našla v E1 | Čo nikdy nenájde |
|---|---|---|
| **`visual-qa`** (stroj) | nič — 0 nálezov, merateľné veci boli v poriadku | vkus, rytmus, „vyzerá to ako chyba" |
| **Vlastné oči na screenshotoch** | osamotená druhá fotka v galérii; biela vzorka odrody pôsobiaca ako chýbajúci obrázok | to, čo nie je vidieť (sémantika, kontrast v číslach) |
| **`qa-a11y`** (sub-agent, číta kód) | preskočená úroveň nadpisu h1 → h3 → h2; dotykový cieľ 40 px namiesto 44 px | ako to reálne vyzerá v prehliadači |

Preto je poradie pred odovzdaním: **`visual-qa` → pozri screenshoty vlastnými
očami → `qa-a11y` → až potom ľudská revízia majiteľa.**

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

| Skill | Na čo | Kedy je najlepšie ho použiť | Ako vyvolať |
|---|---|---|---|
| **`design-shotgun`** | Pre sekciu/stránku vygeneruje **4–6 odlišných dizajnových smerov** (layout + tonalita) ako statické HTML náhľady v rámci `theme.css` a vyrenderuje screenshoty desktop/mobil → rýchly výber smeru. | **Na ZAČIATKU** novej sekcie/stránky, keď smer nie je jasný — **pred** písaním finálneho kódu (ušetrí prerábku). Nie na drobné doladenie už hotového. | „ukáž mi varianty/verzie sekcie", „neviem ktorým smerom" · `/design-shotgun` |
| **`visual-qa`** | Spustí frontend, preklikaj `/ukazky/*` v desktop/tablet/mobil, odfotí a **automaticky odmeria** horizontálny scroll, 1×`h1`, chyby v konzole, rozbité obrázky, fokus — proti `docs/sablony-kvalita.md`. | Keď je šablóna/stránka **hotová**, tesne **pred ľudskou revíziou a pred merge**; po väčších vizuálnych zmenách. V cloude len `/ukazky/*` (hlavný web/blog ťahá WP). | „preklikaj web / sprav screenshoty mobil", „over responzivitu" · `/visual-qa` |
| **`seo-geo-frontend`** | Postaví SEO + GEO základ na headless Next.js (metadata, OG, canonical, `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD) pre Google aj AI vyhľadávače. | Keď je **obsah a štruktúra stránky hotová** a chystá sa indexovanie / go-live, alebo pri **replikácii** na nového klienta. Nie na rozrobenom webe. | „optimalizuj web pre Google/AI", „priprav na indexovanie" · `/seo-geo-frontend` |
| **`site-customizer`** | Prispôsobí hotovú šablónu reálnemu klientovi (texty, farby, údaje, modul) — zmenou obsahu, nie kódu. | Keď máš **overenú šablónu a reálneho klienta** (jeho texty/farby/údaje/logo) a robíš z nej klientský web. *Zatiaľ runbook (kostra), plný beh je M4.* | „sprav z tejto šablóny web pre klienta X" · `/site-customizer` |

## Prevzaté (vendored) skilly — vkus a motion (Emil Kowalski, MIT)

Podrobná atribúcia a zdroje: `.claude/skills/VENDORED.md`.

| Skill | Na čo | Kedy je najlepšie ho použiť | Ako vyvolať |
|---|---|---|---|
| **`emil-design-eng`** | Filozofia UI polish, komponentov a neviditeľných detailov, ktoré robia softvér „drahým". | Pri **finálnom dolaďovaní** detailov/polish už hotového komponentu (nie na hrubú stavbu). | Automaticky pri frontend práci · „doťiahni detaily/polish" |
| **`animate`** | Ako stavať motion **správne** (poradie rozhodnutí: či animovať → účel → nástroj → vlastnosti → krivka/trvanie → prerušenie → exit). | Keď pridávaš **konkrétny pohyb/prechod** — rozhoduj **pred** písaním animácie, nie dodatočne „nech sa to hýbe". | „pridaj animáciu / oživ komponent" · `/animate` |
| **`review-animations`** | Kritika motion podľa vysokej remeselnej latky (`STANDARDS.md`). **Len ľudsky** — sám sa nespúšťa. | **Po** napísaní motion, na kritiku **pred schválením** netriviálnej animácie. | Iba `/review-animations` |

## Sub-agenti — build tím na šablóny (`.claude/agents/`)

Spúšťajú sa **sekvenčne** na tom istom balíku (nie paralelne — krížili by si súbory);
každý na štarte číta `docs/sablony-kvalita.md`. Modely: `docs/sablony-kvalita.md` → „Modely sub-agentov".

| Agent | Rola | Model | Kedy je najlepšie ho použiť |
|---|---|---|---|
| **`ui-ux-designer`** | Dizajn systém (`theme.css`), rozvrh sekcií/stránok, motion koncept. | Fable | **Úplný začiatok** novej šablóny, **pred** kódom (ideálne po `design-shotgun` výbere smeru). |
| **`sk-copywriter`** | SK texty do `content.ts` (proti zoznamu zakázaných AI fráz). | Sonnet | Keď treba **napísať/prekontrolovať SK texty** šablóny — súbežne s `frontend-dev`, na tých istých, ale **iných** súboroch. |
| **`frontend-dev`** | Implementácia sekcií — čistý Next.js 16 / Tailwind v4, výkon, a11y. | Opus | **Po** hotovom dizajne + textoch — samotná stavba/kódovanie sekcií. |
| **`qa-a11y`** | Brána kvality pred ľudskou revíziou (checklist, statická kontrola). | Sonnet | **Tesne pred** odovzdaním majiteľovi — statická brána; ideálne v páre s `visual-qa` (ten pridá interaktívne overenie). |

## Správne načasovanie — kedy ktorý (životný cyklus šablóny)

1. **Smer** — `design-shotgun` (4–6 variantov) → majiteľ vyberie.
2. **Dizajn systém** — `ui-ux-designer` (`theme.css`, rozvrh, motion koncept).
3. **Obsah + stavba** — `sk-copywriter` (texty) **+** `frontend-dev` (kód), súbežne;
   pri motion `animate`, pri detailoch `emil-design-eng`.
4. **Kontrola** — `qa-a11y` (statická brána) **+** `visual-qa` (prehliadač, screenshoty);
   netriviálny motion `/review-animations` (ľudsky).
5. **Nájditeľnosť** — `seo-geo-frontend` (pred indexovaním / go-live).
6. **Ku klientovi** — `site-customizer` (z overenej šablóny klientský web).

> **Pravidlo palca:** `design-shotgun` = **pred** kódom (hľadáš smer),
> `visual-qa` + `qa-a11y` = **po** kóde (overuješ hotové), `seo-geo-frontend` =
> **na záver** pred spustením. Drž „1 sedenie = 1 typ" — dizajn zvlášť, kód zvlášť.

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
