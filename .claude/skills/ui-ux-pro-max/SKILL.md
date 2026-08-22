---
name: ui-ux-pro-max
description: Katalóg dizajnových štýlov, farebných paliet, typografických párov a odvetvových UX pravidiel na rozbeh dizajn systému NOVEJ odvetvovej šablóny (frontend/templates/<odvetvie>/theme.css). Použi na začiatku stavby šablóny — pri voľbe štýlu, palety a typografie — predtým, než sa píše theme.css. Nie je to implementačný návod ani komponentová knižnica; je to zdroj inšpirácie a mantinelov, z ktorého si vyberáš. Vhodné pre sub-agenta ui-ux-designer.
---

# ui-ux-pro-max — katalóg pre rozbeh dizajn systému

Prevzaté z `github.com/nextlevelbuilder/ui-ux-pro-max-skill` (MIT).
**Prevzaté sú len dáta, nie ich nástroje ani ich pracovný postup** — náš postup
je definovaný v `.claude/agents/ui-ux-designer.md` a `docs/sablony-kvalita.md`.

## Na čo to je

Keď rozbiehame **novú odvetvovú šablónu**, najťažšie je začať: akou paletou,
akou typografiou, akým celkovým štýlom. Tento katalóg dáva **odkiaľ vyberať**,
aby každé odvetvie dostalo vlastný smer a nevznikla „predošlá šablóna v inej
farbe".

**Nie je to náhrada za vkus.** Vyberieš z katalógu smer, potom ho doladíš cez
`emil-design-eng` a `animate`. Katalóg hovorí „toto sa pre kvetinárstvo hodí",
nie „takto to má vyzerať".

## Čo je v `data/`

| Súbor | Riadkov | Čo obsahuje |
|---|---|---|
| `styles.csv` | 88 štýlov | Kategória, kľúčové slová, primárne/sekundárne farby, efekty a animácie, **„Best For" a „Do Not Use For"**, svetlý/tmavý režim, výkon, prístupnosť, mobil, konverzia, éra, zložitosť |
| `colors.csv` | 192 paliet | Podľa **typu produktu**. Kompletná sada tokenov: primary/on-primary, secondary, accent, background, foreground, card, muted, border, destructive, ring + poznámka ku kontrastu |
| `typography.csv` | 74 párov | Kombinácie z Google Fonts |
| `ux-guidelines.csv` | 119 | Všeobecné UX smernice |
| `ui-reasoning.csv` | 192 | Odvetvové pravidlá — prečo pre daný typ produktu fungujú isté rozhodnutia |
| `products.csv` | 192 | Typy produktov (kľúč, cez ktorý sa spájajú palety a pravidlá) |
| `landing.csv` | 34 | Vzory pre landing stránky |
| `data-provenance.json` | — | Pôvod dát a politika čerstvosti (od autorov) |

## Ako to použiť (postup pre `ui-ux-designer`)

1. **Urč typ produktu** pre odvetvie (`products.csv`) — napr. kvetinárstvo je
   bližšie k „Local Services" / „E-commerce (Boutique)" než k „SaaS".
2. **Vyber paletu** z `colors.csv` podľa toho typu. Prevezmi ju ako **východisko**
   a preveď na naše `@theme` tokeny **s prefixom odvetvia**
   (`--color-flora-500`), nie ako globálne tokeny.
3. **Vyber štýl** z `styles.csv`. **Prečítaj stĺpec „Do Not Use For"** — je
   užitočnejší než „Best For", lebo vylučuje slepé uličky.
4. **Vyber typografický pár** z `typography.csv`.
5. **Prečítaj odvetvové pravidlá** v `ui-reasoning.csv` pre daný typ produktu.
6. Až potom píš `theme.css`.

## Mantinely

- **Načítavaj VÝBEROVO.** `styles.csv` má 146 KB — nikdy nečítaj celý súbor do
  kontextu. Filtruj cez `grep` alebo `python3` podľa typu produktu a vezmi
  niekoľko riadkov.
- **Palety sú východisko, nie hotová vec.** Kontrast musí prejsť **WCAG AA** —
  over ho sám, nespoliehaj sa na poznámku v CSV.
- **Neprebrali sme ich komponentovú vrstvu.** Pôvodné repo stavia na
  **shadcn/ui + Radix**; naše šablóny sú ručný Tailwind v4. Neprechádzaj na
  shadcn na základe tohto katalógu — to by bolo architektonické rozhodnutie,
  ktoré nikto neurobil.
- **Dáta starnú.** Snímka je z **20. 8. 2026** (commit `bc826e2`). Ak od nej
  ubehol dlhší čas a rozbiehaš dôležitú šablónu, over si aktuálnu verziu
  v zdrojovom repe.

## Čo sme zámerne NEprevzali

Celé repo má 23 MB. Vzali sme **448 KB** dát. Vynechané:
- `cli/` (4,9 MB) — ich inštalátor, nepotrebujeme,
- `phosphor-icons-upstream.json` (805 KB), `google-fonts.csv` (730 KB),
  `google-font-licenses.json` (423 KB) — objemné výpisy, ktoré vieme dohľadať online,
- ich vlastné skilly `design`, `brand`, `slides`, `ui-styling`, `banner-design` —
  sú v angličtine a viazané na ich postup (shadcn, generovanie loga cez Gemini,
  HTML prezentácie). Náš postup máme vlastný.
- `screenshots/`, `gallery/`, `stack/`, `projects/`.

Ak by sa niekedy hodil `banner-design` (28 KB) k **social agentovi (P4)**,
prevezme sa vtedy samostatne.
