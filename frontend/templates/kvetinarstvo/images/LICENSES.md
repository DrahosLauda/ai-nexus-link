# Obrázky — Boma Flora (kvetinárstvo)

Zdroj a licencia každého obrázka šablóny. Cieľ podľa `docs/sablony-kvalita.md` a
`DESIGN.md` sekcie d): kurátorské **reálne fotografie** (Unsplash / Pexels —
komerčne voľné) v jednotnej teplej atmosfére „ráno v ateliéri".

## Stav (M2a)

**Zatiaľ bez rastrových fotografií.** V tomto prostredí sa fotky nedali
spoľahlivo stiahnuť, preto šablóna používa **vlastný obrazový placeholder**
(`placeholder.tsx`): inline botanické SVG v palete `theme.css`, s korektnými
pomermi strán (žiadny CLS), arch orezom (`.flora-arch`) a popisnými `alt` textami
z `content.ts`. Placeholder **neblokuje build** ani a11y.

Hero (M2a) je „poster" v štýle motívu „ruky + kytica" (tmavý variant placeholderu
+ gradient overlay), pripravený na neskoršiu výmenu za video (M2b).

## Follow-up (pred ľudskou revíziou / go-live šablóny)

Nahradiť placeholder kurátorskými fotkami a doplniť sem záznamy v tvare:

| Súbor | Motív (alt) | Zdroj (URL) | Autor | Licencia |
|---|---|---|---|---|
| _(doplní sa)_ | | Unsplash / Pexels | | Unsplash / Pexels License |

Motívy podľa `DESIGN.md` d): ruky viažuce kyticu, detail textúry kvetov, kytice
na neutrálnom pozadí (sezónny výber, obchod), svadobná inštalácia (svadby),
decentná smútočná väzba, interiér ateliéru v dennom svetle, augustové sezónne
kvety (dálie, hortenzie, ruže, eukalyptus).

Výmena je bez zásahu do rozvrhu: `FloraFigure` sa nahradí `next/image` so `sizes`
pri rovnakých pomeroch strán.
