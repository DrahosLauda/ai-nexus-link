---
name: design-shotgun
description: >-
  Vygeneruj 4-6 rôznych dizajnových smerov jednej sekcie alebo stránky NARAZ ako
  samostatné HTML náhľady (rôzny layout aj tonalita) v rámci dizajn-tokenov danej
  šablóny, a vyrenderuj ich na screenshoty desktop + mobil, aby si majiteľ rýchlo
  vybral smer. Použi VŽDY, keď treba preskúmať vzhľad novej sekcie/stránky pred
  písaním finálneho kódu, keď majiteľ povie „ukáž mi varianty / verzie", „neviem
  ktorým smerom", „navrhni pár možností hero/sekcie", alebo keď sa rozbieha nová
  odvetvová šablóna a treba nájsť dizajnový smer. Nie je to finálna implementácia
  — je to lacný prieskum smeru pred sub-agentmi ui-ux-designer/frontend-dev.
---

# design-shotgun — nájdi dizajnový smer, kým nič nekódíš

> Inšpirované vzorom „design shotgun" z **gstack** (Garry Tan, MIT). Nie je to
> prevzatý kód — je to náš vlastný, cloud-kompatibilný skill. Atribúcia:
> `.claude/skills/VENDORED.md`.

## Prečo tento skill existuje

Najdrahšia chyba pri stavbe šablóny je **postaviť sekciu poriadne a až potom
zistiť, že smer bol zlý**. Klasický postup (jeden návrh → revízia → prerábka) je
pomalý, lebo každé kolo stojí implementáciu vo Next.js. Tento skill obráti poradie:
**najprv rozhodneme SMER na 4-6 lacných náhľadoch, až potom sa jeden vybraný
implementuje naostro** cez normálny reťazec (`ui-ux-designer` → `frontend-dev`).

Kľúč k lacnosti: náhľady sú **samostatné statické HTML** (inline CSS, žiadny
build, žiadne napojenie na Next.js/WP). Vyrenderujú sa okamžite predinštalovaným
Chromiom. Sú to **jednorazové prieskumné artefakty**, nie kód šablóny — po výbere
smeru sa zahodia.

## Čo NIE je

- **Nie je to finálny kód.** Variant nikdy nekopíruj do `frontend/templates/…`.
  Víťazný smer implementuje `frontend-dev` nanovo, čisto, data-driven z `content.ts`.
- **Nie sú to farebné swatche.** Každý variant musí meniť **layout aj tonalitu**,
  nie len odtieň. Šesť verzií tej istej mriežky = zbytočné.

## Vstup (over pred štartom)

1. **Čo** — ktorá sekcia alebo stránka (hero, služby, kontakt, cenník, celý blog list…).
2. **Pre ktorú šablónu** — cesta `frontend/templates/<odvetvie>/`. Ak žiadna
   (úplne nová šablóna), použiješ neutrálne tokeny, ale povedz to majiteľovi.
3. **Koľko variantov** — default **5** (rozumné rozpätie 4-6).

Ak niečo z toho chýba a nedá sa rozumne odvodiť, spýtaj sa **raz**, stručne.

## Postup

### 1. Vytiahni dizajn-tokeny šablóny (aby varianty boli „on-brand")
Prečítaj `frontend/templates/<odvetvie>/theme.css` a vypíš si: farby (podklady,
primárna škála, akcent, textové aliasy), rádiusy, tiene, a **charakter fontov**
(display serif vs humanist sans…). Prečítaj aj relevantný kus `content.ts`, aby
si mal **reálne slovenské texty** pre tú sekciu — náhľady nikdy nesmú mať lorem
ipsum ani vymyslené fakty (ceny, certifikáty).

> **Fonty v náhľade sú približné.** Šablóna ich ťahá cez `next/font` (napr.
> Fraunces + Figtree). V samostatnom HTML ich **neťaháme cez CDN** (sieťová
> politika to v cloude môže blokovať a náhľad má byť sebestačný). Použi
> **systémový font stack, ktorý sedí charakterom** (napr. `Georgia, 'Times New
> Roman', serif` pre display serif; `system-ui, -apple-system, 'Segoe UI', sans-serif`
> pre humanist sans). Fidelita fontu sa dorieši až v reálnej implementácii — teraz
> ide o **layout a tonalitu**, nie o presný glyf.

### 2. Zvoľ 4-6 zámerne ODLIŠNÝCH archetypov
Nevymýšľaj náhodne — vyber z overených layout-archetypov pre daný typ sekcie tak,
aby pokryli **rôzne stratégie**, nie varianty jednej. Inšpirácia (hero):
- split „copy vľavo / médium vpravo",
- centrovaný minimalistický (veľká typografia, veľa priestoru),
- full-bleed obrázok s tmavým scrim + text v rohu,
- asymetrický / editorial (mriežka 12 stĺpcov, presah),
- „card-framed" (obsah v ohraničenej karte na farebnom podklade),
- rozdelený 50/50 s farebným blokom.

Ku každému variantu priraď aj **tonalitu**: pokojná editorial · odvážna/energická
· minimalistická · teplá/ľudská. Cieľ je, aby majiteľ pri pohľade videl **naozaj
iné cesty**, nie odtiene jednej.

Drž mantinely brány kvality (`docs/sablony-kvalita.md`): žiadne zakázané AI frázy,
sémantický základ (jeden `h1`, `alt` na obrázkoch — v náhľade stačí popisný
placeholder blok s pomerom strán), dostatočný kontrast, žiadny horizontálny scroll.

### 3. Vygeneruj HTML náhľady
Do pracovného priečinka `frontend/.design-shotgun/<sekcia>/` (negituje sa —
prieskumný artefakt) zapíš `variant-1.html` … `variant-N.html`. Každý je
**kompletná stránka** (`<!doctype html>` … `<body>`) s **inline `<style>`**, ktorý:
- definuje CSS premenné = tokeny odčítané z `theme.css` (kópia hodnôt, nie `@import`),
- vykreslí **iba tú jednu sekciu** na plnú šírku, responzívne (mobile-first, žiadny
  vodorovný pretok), s reálnym slovenským textom,
- pre obrázky použije `<div>` placeholder so správnym pomerom strán a `aria-label`
  (žiadne externé zdroje).

Nechaj v priečinku aj krátky `README.txt`: jedna veta na variant (archetyp +
tonalita + kedy sa hodí).

### 4. Vyrenderuj screenshoty (desktop + mobil)
Použi zabalený skript — renderuje všetky `variant-*.html` v priečinku:

```bash
NODE_PATH="$(npm root -g)" node .claude/skills/design-shotgun/scripts/shoot.cjs \
  frontend/.design-shotgun/<sekcia>
```

Vytvorí `variant-N.desktop.png` (1280×900) a `variant-N.mobile.png` (390×844)
vedľa HTML. Skript používa **globálne nainštalovaný Playwright** a predinštalovaný
Chromium (`PLAYWRIGHT_BROWSERS_PATH`), takže **nepotrebuje `npm install` ani
`playwright install`**.

### 5. Predlož majiteľovi a odporuč
Pošli screenshoty cez `SendUserFile` (mobil aj desktop). Ku každému variantu **jedna
veta**: čo je archetyp, aká tonalita, prečo by fungoval pre toto odvetvie. Na záver
**jedno odporúčanie** („išiel by som variantom 3, lebo…") — majiteľ rozhoduje.
Neimplementuj nič, kým si nevybral.

### 6. Po výbere — odovzdaj reťazcu
Vybraný smer sa realizuje **normálnou cestou** (`docs/sablony-kvalita.md` postup):
`ui-ux-designer` premietne smer do `theme.css`/rozvrhu, `frontend-dev` ho postaví
data-driven, `qa-a11y`/`visual-qa` overí. Prieskumné HTML pokojne zmaž.

## Cloud / bezpečnosť
- **Žiadny Bun, žiadny lokálny daemon, žiadna nová závislosť.** Len Node + globálny
  Playwright + predinštalovaný Chromium, ktoré cloud web sedenie má.
- Náhľady sú **statické, sebestačné, offline** (žiadne externé CDN/fonty/skripty).
- Pracovný priečinok `frontend/.design-shotgun/` **necommituj** (viď `.gitignore`).
