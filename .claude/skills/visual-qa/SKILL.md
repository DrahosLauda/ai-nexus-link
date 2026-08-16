---
name: visual-qa
description: >-
  Spusti frontend v prehliadači (predinštalovaný Chromium + Playwright), preklikaj
  kľúčové stránky, sprav screenshoty desktop / tablet / mobil a automaticky over
  vizuálne veci, ktoré statická kontrola nechytí — horizontálny scroll a pretečenia,
  jeden h1 na stránku, chyby v konzole, rozbité obrázky, viditeľný fokus — proti
  bráne kvality docs/sablony-kvalita.md. Použi VŽDY, keď je šablóna alebo stránka
  hotová a treba ju vizuálne/responzívne overiť pred ľudskou revíziou alebo merge,
  keď majiteľ povie „preklikaj web", „sprav screenshoty mobil/desktop", „over
  responzivitu", „ako to vyzerá v prehliadači". Rozširuje statický audit qa-a11y
  o interaktívne overenie v reálnom prehliadači.
---

# visual-qa — over web naozaj v prehliadači

> Inšpirované vzorom „browser QA" z **gstack** (Garry Tan, MIT). Vlastný,
> cloud-kompatibilný skill. Atribúcia: `.claude/skills/VENDORED.md`.

## Prečo tento skill existuje

`qa-a11y` číta kód a checklist — to je nutné, ale **nevidí, ako sa web reálne
vykreslí**. Časť chýb sa ukáže až v prehliadači: horizontálny scroll na mobile,
pretečený nadpis, rozbitý obrázok, chyba v konzole, neviditeľný fokus. Tento skill
**skutočne spustí web, preklikáva ho v troch veľkostiach, odfotí a automaticky
odmeria** to, čo sa dá odmerať — a nálezy priradí k bodom brány kvality
(`docs/sablony-kvalita.md`). Je to **interaktívny doplnok** ku `qa-a11y`, nie náhrada.

## Rozsah — čo overovať

Primárne **demo šablóny pod `/ukazky/<odvetvie>/*`**. Tie sú sebestačné (obsah
z `content.ts`, žiadne externé dáta) → v cloude sa vykreslia bez tajomstiev.

> **Hlavný web (`/`, `/blog/*`) ťahá obsah z WordPressu** a potrebuje `WP_URL`
> a Directus env, ktoré cloud web sedenie nemá → blog v cloude nevykreslíš naostro
> (skončí fallbackom/404). Ak treba QA blogu, rob ho na živom deployi, nie tu.
> V cloude sa drž `/ukazky/*` a statických stránok.

## Postup

### 1. Priprav build a spusti server (presné príkazy)
Produkčný `next start` je najbližšie realite. Rob to takto, krok po kroku:

```bash
cd frontend
npm run build
# ak sa na porte 4123 už niečo drží, uvoľni ho (lekcia: starý server = EADDRINUSE
# a screenshoty zo starého buildu):
( fuser -k 4123/tcp 2>/dev/null || true )
PORT=4123 npm run start >/tmp/visual-qa-server.log 2>&1 &
echo $! > /tmp/visual-qa-server.pid
# počkaj, kým server odpovie (max ~30 s):
for i in $(seq 1 30); do curl -sf -o /dev/null http://localhost:4123/ukazky && break; sleep 1; done
```

> Alternatíva `npm run dev` je pomalšia a menej verná (dev overlay, bez optimalizácií).
> Používaj `next start` po `build`, pokiaľ nepotrebuješ konkrétne dev správanie.

### 2. Preklikaj a odfoť (zabalený skript)
Spusti kontrolný skript s base URL a zoznamom ciest (čiarkou oddelené, **relatívne**):

```bash
NODE_PATH="$(npm root -g)" node ../.claude/skills/visual-qa/scripts/visual-qa.cjs \
  --base http://localhost:4123 \
  --routes /ukazky,/ukazky/kvetinarstvo,/ukazky/kvetinarstvo/obchod,/ukazky/kvetinarstvo/kontakt \
  --out /tmp/visual-qa-out
```

Skript pre **každú cestu × viewport** (desktop 1280, tablet 768, mobile 390):
otvorí stránku, počká na `networkidle`, odfotí **celú stránku** (`<cesta>__<vp>.png`)
a automaticky odmeria:
- **horizontálny scroll** (`scrollWidth > innerWidth` na `<html>` aj `<body>`),
- **počet `<h1>`** (má byť práve 1),
- **chyby v konzole a zlyhané requesty** (`pageerror`, `console.error`, 4xx/5xx),
- **rozbité obrázky** (`naturalWidth === 0` po načítaní),
- **viditeľný fokus** na prvom interaktívnom prvku (po `Tab` sa zmení outline/box-shadow).

Výstup: screenshoty + `findings.json` (strojové nálezy) v `--out`. Skript používa
**globálny Playwright** + predinštalovaný Chromium → žiadny `npm install`, žiadny
`playwright install`, žiadny Bun.

### 3. Zastav server (vždy, aj pri chybe)
```bash
kill "$(cat /tmp/visual-qa-server.pid)" 2>/dev/null || true
```
Nenechávaj bežať starý server — inak ďalší beh fotí starý build (lekcia z denníka).

### 4. Vyhodnoť proti bráne kvality a nahlás
Prečítaj `findings.json` aj **pozri screenshoty vlastnými očami** (strojové metriky
nechytia všetko — rytmus, kurátorstvo fotiek, prázdne sekcie, „cítiť AI" pocit).
Nálezy zoraď od najzávažnejších a **prirad k bodom `docs/sablony-kvalita.md`**:
responzivita (žiadny horizontálny scroll), sémantika (1×`h1`), čistý beh (0 chýb
v konzole), obrázky (nič rozbité), fokus viditeľný. Ku každému nálezu daj **miesto**
(cesta + viewport + screenshot) a konkrétny dôvod.

Screenshoty pošli majiteľovi cez `SendUserFile` (aspoň mobil + desktop kľúčových
strán). Neopravuj kód — to je práca `frontend-dev`/`sk-copywriter`; ty si brána,
vraciaš **zoznam nálezov** (ako `qa-a11y`). Ak je všetko čisté, povedz to jasne.

## Čo tento skill NErobí
- **Nemeria Lighthouse** (v cloud sedení chýba CLI) — skóre sa domeriava na deployi;
  tu overuješ vizuál, responzivitu a beh bez chýb.
- **Neťaha WP obsah** (viď rozsah vyššie).
- **Neopravuje** — len hlási.

## Cloud / bezpečnosť
- **Žiadny Bun, žiadny lokálny daemon, žiadna nová závislosť.** Node + globálny
  Playwright + predinštalovaný Chromium, ktoré cloud web sedenie má.
- Server bež **na localhoste** a po QA ho **zastav**.
- Výstupy do `/tmp/visual-qa-out` (mimo repa) → necommitujú sa.
