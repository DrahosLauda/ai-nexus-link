# Obrázky — Boma Flora (kvetinárstvo)

Zdroj a licencia každého obrázka šablóny. Cieľ podľa `docs/sablony-kvalita.md` a
`DESIGN.md` sekcie d): kurátorské **reálne fotografie** (Unsplash / Pexels —
komerčne voľné) v jednotnej teplej atmosfére „ráno v ateliéri".

## Hero video (M2b) — hotové ✅

Zdroj: **Kling (kling.ai)**, generované cez MCP na účte majiteľa
(Standard/VIP plán → **komerčná licencia**). Súbory v `frontend/public/kvetinarstvo/`:

| Súbor | Obsah | Model | Licencia |
|---|---|---|---|
| `hero.mp4` / `hero.webm` | 10 s transformácia: kytica → kvetinový veniec (scroll-scrub hero) | Kling 3.0 (image_to_video, start+end frame) | Kling, komerčné použitie (plán majiteľa) |
| `hero-poster.jpg` | Prvý snímok videa = kytica (poster/LCP, mobil, reduced-motion) | odvodený z videa (ffmpeg) | odvodené z hore uvedeného |

Start/end framy generované modelom **Nano Banana 2** (Gemini 3.1 Flash) v Klingu.
Video na webe: WebM (VP9) + MP4 (H.264), krátky GOP kvôli plynulému scroll-scrubu,
poster drží LCP; mobil/`reduced-motion` = statický poster.

## Statické obrázky (M2a) — placeholder, follow-up

Ostatné obrazové sloty (galéria, karty, portréty, blog, obchod) zatiaľ používajú
**vlastný obrazový placeholder** (`placeholder.tsx`): inline botanické SVG v palete
`theme.css`, s korektnými pomermi strán (žiadny CLS), arch orezom (`.flora-arch`)
a popisnými `alt` textami z `content.ts`. Nahradia sa kurátorskými fotkami rovnako
ako hero (Kling / vlastné fotky klienta) — `FloraFigure` → `next/image`, bez zmeny
rozvrhu. Doplniť sem záznam pri každom obrázku (súbor, motív, model/zdroj, licencia).

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
