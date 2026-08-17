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
| `blog-tri-chyby.webp` | Tulipány na stole | Blog — „tri chyby" | Kling (Nano Banana 2) | Kling, komerčné |
| `blog-svadba.webp` | Svadobná kytica | Blog — „kvety na svadbu" | Kling (Nano Banana 2) | Kling, komerčné |
| `blog-pena.webp` | Ruky viažuce kyticu | Blog — „bez floristickej peny" | Kling (Nano Banana 2) | Kling, komerčné |
| `obchod-kytica-dna.webp` | Balená kytica | Obchod — Kytica dňa | Kling (Nano Banana 2) | Kling, komerčné |
| `obchod-na-mieru.webp` | Pastelová kytica | Obchod — Kytica na mieru | Kling (Nano Banana 2) | Kling, komerčné |
| `obchod-predplatne.webp` | Pivonky vo váze | Obchod — Predplatné kvetov | Kling (Nano Banana 2) | Kling, komerčné |
| `obchod-poukaz.webp` | Kytica + darčekový štítok | Obchod — Darčekový poukaz | Kling (Nano Banana 2) | Kling, komerčné |

### Katalóg kytíc (E1) — použitie existujúcich fotiek

Katalóg `/kytice` **nemá vlastné nové fotky** — deväť z dvanástich kytíc používa
už licencované súbory z tabuľky vyššie (cesty sú pri kytici v `content.ts`, pole
`fotky`): `sezona-1..3`, `galeria-2..5`, `obchod-kytica-dna`, `obchod-na-mieru`,
`obchod-predplatne`, `obchod-poukaz`. Kytice **Red Naomi**, **Tichá rozlúčka** a
**Slnečné ráno** majú zatiaľ palete verný placeholder (`FloraFigure`) — doplnia sa
v samostatnom kreatívnom sedení iba pridaním cesty do `content.ts`, bez zásahu do kódu.

### Odrody — foto-výrezy k „Z čoho ju viažeme"

Priehľadné výrezy jednotlivých odrôd (bočný pohľad na stonku, biele pozadie
orezané lokálne flood-fillom cez Pillow/scipy → priehľadné WebP, výška 1000 px).
Zdroj: **Kling (kling.ai)**, účet majiteľa (Standard/VIP → **komerčná licencia**),
modely **OBRAZ 3.0 / Nano Banana 2**. Súbory v `frontend/public/kvetinarstvo/kvety/`
ako `kvet-<id>.webp`, kde `id` je kľúč v `odrody` (`content.ts`); prevzaté z vetvy
`claude/krok-k1-kytica-vizual-z2pg19` (skladací vizuál kytice sa nepreberá).

| id odrody | kvet | Model | Licencia |
|---|---|---|---|
| `ruza-red-naomi` | Ruža Red Naomi (červená) | Kling (OBRAZ 3.0 / Nano Banana 2) | Kling, komerčné |
| `ruza-mondial` | Ruža Mondial (krémovo-biela) | Kling | Kling, komerčné |
| `eustoma-ruzova` | Eustoma ružová | Kling | Kling, komerčné |
| `hortenzia-modra` | Hortenzia modrá | Kling | Kling, komerčné |
| `hortenzia-ruzova` | Hortenzia ružová | Kling | Kling, komerčné |
| `chryzantema-plnokveta-bordova` | Chryzantéma plnokvetá (bordová) | Kling | Kling, komerčné |
| `chryzantema-margaretkova-biela` | Chryzantéma margarétková (biela) | Kling | Kling, komerčné |
| `pivonka-ruzova` | Pivonka ružová | Kling | Kling, komerčné |
| `eukalyptus` | Eukalyptus (zeleň) | Kling | Kling, komerčné |
| `gypsomilka` | Gypsomilka (biela) | Kling | Kling, komerčné |

Odrody bez výrezu sa vykreslia ako **farebný bod** podľa `farbyKvetov` — po dodaní
súboru stačí pridať cestu do `odrodaVyrezy` (`images/media.ts`) a riadok sem.

### Kontakt — mapa

`kontakt-mapa.webp` — demo **screenshot z Google Máp** (Mierové námestie, Trenčín),
len ilustračný pre šablónu. Reálny klient nahradí svojou polohou. (Screenshot mapy =
faktický údaj o mieste, nie kreatívne dielo; pri nasadení klient použije vlastný.)

### Stav slotov

**Všetky obrazové sloty šablóny sú vyplnené reálnymi (AI-generovanými) fotkami.**
Prípadné budúce nahradenie je bez zásahu do rozvrhu (`Foto`/`next/image` pri
rovnakom pomere strán); po pridaní súboru pribudne riadok do tabuľky vyššie.
