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
- **Dáta starnú.** Snímka je z **20. 8. 2026** (commit `bc826e2`). Preto sa
  **na začiatku každého sedenia s novou šablónou** spustí kontrola nižšie.
  Nie je to „nezabudni sa pozrieť" — je to krok, ktorý sa buď vykoná, alebo nie.

## Kontrola aktuálnosti — POVINNÝ prvý krok pri novej šablóne

Trvá pol minúty. Zdroj sa vyvíja, naša snímka nie — táto kontrola ukáže rozdiel
**skôr**, než na katalógu postavíš dizajn.

**1) Stiahni len dáta zo zdroja** (nie celé 23 MB repo — sťahuje sa ~3 MB):

```bash
cd /tmp && rm -rf uipm-check
git clone --depth 1 --filter=blob:none --sparse -q \
  https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git uipm-check
cd uipm-check && git sparse-checkout set src/ui-ux-pro-max/data
git log -1 --format="verzia zdroja: %h  %ad" --date=short
```

*(Ak má sedenie vlastný dočasný priečinok — scratchpad — použi radšej ten
namiesto `/tmp`. Je to jednorazová pracovná kópia, po kontrole sa zahodí.)*

**2) Porovnaj so snímkou v repe** — spusti z koreňa projektu:

```bash
Z=/tmp/uipm-check/src/ui-ux-pro-max/data
N=.claude/skills/ui-ux-pro-max/data
printf "%-22s %8s %8s   %s\n" SÚBOR NAŠE ZDROJ ZMENA
for f in styles colors typography ui-reasoning ux-guidelines products landing; do
  a=$(($(wc -l < $N/$f.csv)-1)); b=$(($(wc -l < $Z/$f.csv)-1))
  if cmp -s $N/$f.csv $Z/$f.csv; then z="—"; else z="LÍŠI SA"; fi
  printf "%-22s %8s %8s   %s\n" "$f.csv" "$a" "$b" "$z"
done
```

**3) Vyhodnoť:**

| Výsledok | Čo urob |
|---|---|
| Všade `—` | Nič nerob, pracuj s tým, čo máš. |
| Niekde `LÍŠI SA` | Prepíš dotknuté súbory zo `$Z` do `$N`, **v commite aktualizuj číslo verzie v tomto `SKILL.md` aj vo `VENDORED.md`** a v správe commitu uveď, čo pribudlo. Až potom navrhuj paletu. |
| Klonovanie zlyhá (sieť, repo zmizlo) | **Nezastavuj prácu.** Pokračuj s našou snímkou a povedz majiteľovi jednou vetou, že kontrola neprebehla. Snímka je práve na toto. |

> **Prečo obe veci naraz.** Čerstvé stiahnutie dá aktuálne dáta, ale **nedá naše
> mantinely** (postup, varovanie pred shadcn, pravidlo výberového čítania) — tie
> vznikli u nás a v cudzom repe nikdy nebudú. Snímka zas dá pevný bod, voči
> ktorému je vidieť, čo sa zmenilo. Preto máme kópiu **aj** kontrolu.

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
