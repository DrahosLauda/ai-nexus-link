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

## Statické fotografie — hotové ✅ (AI-generované, komerčná licencia)

Všetky fotografie šablóny sú **AI-generované cez Kling (kling.ai)** na účte majiteľa
(Standard/VIP plán → **komerčná licencia**, žiadny third-party stock). Modely:
**Nano Banana 2** (Gemini 3.1 Flash Image) a **OBRAZ 3.0** (Kling image). Jednotná
teplá atmosféra „ráno v ateliéri" (paleta `theme.css`), popisné `alt` v `content.ts`.
Súbory v `frontend/public/kvetinarstvo/img/`:

| Súbor(y) | Motív | Slot v šablóne | Model | Licencia |
|---|---|---|---|---|
| `sezona-1..3.webp` | Sezónne kytice | Domov — sezónny výber | Kling (Nano Banana 2 / OBRAZ 3.0) | Kling, komerčné (plán majiteľa) |
| `galeria-1..6.webp` | Kytice, detaily, girlanda | Domov — galéria | Kling (Nano Banana 2 / OBRAZ 3.0) | Kling, komerčné |
| `atelier.webp` | Tmavý interiér ateliéru | Domov — teaser ateliéru | Kling | Kling, komerčné |
| `atelier-barbora.webp` | Portrét zakladateľky | Ateliér — sub-hero + tím 1 | Kling (Nano Banana 2) | Kling, komerčné |
| `atelier-denisa.webp`, `atelier-tomas.webp` | Portréty tímu | Ateliér — tím 2, 3 | Kling (Nano Banana 2) | Kling, komerčné |
| `atelier-stol.webp`, `atelier-chladnicka.webp`, `atelier-pult.webp` | Pracovný stôl, chladnička, baliaci pult | Ateliér — priestor 1–3 | Kling (Nano Banana 2) | Kling, komerčné |
| `svadby-subhero.webp`, `svadby-proces.webp` | Detail viazania, moodboard | Svadby — sub-hero, proces | Kling (Nano Banana 2) | Kling, komerčné |
| `svadby-r1..r3.webp` | Realizácie (Omšenie, Skalka, Elizabeth) | Svadby — realizácie | Kling (Nano Banana 2) | Kling, komerčné |
| `blog-dalie.webp` | Náruč dálií | Blog — hlavný článok | Kling (Nano Banana 2) | Kling, komerčné |
| `blog-svadba.webp` | Svadobná kytica | Blog — článok „kvety na svadbu" | Kling (Nano Banana 2) | Kling, komerčné |
| `obchod-kytica-dna.webp` | Balená kytica | Obchod — Kytica dňa | Kling (Nano Banana 2) | Kling, komerčné |

### Otvorené sloty (zatiaľ placeholder `FloraFigure`, dopĺňajú sa)

- Blog: „tri chyby…" a „bez floristickej peny" (2 zo 4 náhľadov).
- Obchod: „Kytica na mieru", „Predplatné kvetov", „Darčekový poukaz" (3 zo 4 kariet).
- Kontakt: statická mapa.

Doplnenie je bez zásahu do rozvrhu (`FloraFigure` → `Foto`/`next/image` pri rovnakom
pomere strán); po pridaní súboru sem pribudne riadok do tabuľky vyššie.
