# Kvetinárstvo — dizajnový brief (M2a)

> Pre `frontend-dev` (implementácia sekcií) a `sk-copywriter` (texty do
> `content.ts`). Tokeny: `theme.css` v tomto adresári (prefix `flora-`).
> Brána kvality: `docs/sablony-kvalita.md` je záväzná.
> Demo značka (fiktívna): **Ateliér Flóra** — kvetinový ateliér, Bratislava.
> (Copywriter môže názov vyladiť; „Flóra" drží líniu s prefixom tokenov.)

## a) Prieskum a dizajnový smer

**Čo robia špičkové floral weby** (McQueens Flowers, Tinge Floral, The Unlikely
Florist + roundupy Colorlib / Sitebuilderreport / Zarla 2025–26):

- **Fotografia je hrdina.** Dizajn ustupuje — veľké, plnoformátové fotky kvetov,
  minimálne UI. Neutrálne teplé podklady (krémová, pieskovaná), aby kvety „svietili".
- **Serif s charakterom + editorial layout.** Luxusné štúdiá stavajú na serifových
  titulkoch, pokojnom tempe a portfóliovom rozprávaní (svadby ako „príbehy"),
  nie na e-shopovej mriežke.
- **Organické tvary:** oblúkové („arch") orezy fotografií, mäkké rádiusy,
  asymetrické kompozície namiesto tuhého gridu.
- **Trendy 2026** (Figma / TheeDigital / Envato): typografia ako primárny nosič
  identity (oversized headlines, kurzívové akcenty), anti-grid asymetria, jemné
  zrno/textúra, „human-crafted" prvky ako protiváha generického AI vzhľadu.

**Náš smer: „botanický editorial".** Teplý papier `flora-paper` namiesto bielej,
jedľový atrament `flora-900` namiesto čiernej, terakotový akcent `flora-clay-600`
pre CTA a sezónne teplo. Fraunces (variable serif, mäkké serify, kurzíva na
akcenty) + Figtree (text). Podpisové prvky, ktoré šablónu odlíšia na prvý pohľad:

1. **Arch orez fotografií** (`.flora-arch`) — kvetinový „portál", opakuje sa
   naprieč webom ako vizuálny motív.
2. **Sezónnosť ako obsahový princíp** — web hovorí, čo kvitne teraz („Augustový
   výber", sezónny kalendár) → pôsobí živo a odborne, nie ako statická šablóna.
3. **Editorial rytmus podkladov:** paper → sand → paper → tmavá `flora-900`
   sekcia ako „nádych" — nikdy nekonečná biela stena.

Nie kópia žiadneho webu — extrakcia smeru (fotografia-first, serif editorial,
organické tvary) do vlastného systému.

## b) Mapa stránok a rytmus sekcií

Viacstránkový web: **Domov `/` · Svadby a eventy `/svadby` · Ponuka `/ponuka` ·
Ateliér `/atelier` · Kontakt a objednávka `/kontakt`**. Hlavička: logotyp
(Fraunces wordmark) + 4 odkazy + CTA pilulka „Objednať kvety" (clay-600).
Pätička na tmavej `flora-900`: kontakt, hodiny, mini-mapa navigácie, sociálne siete.

### Domov `/`

| # | Sekcia | Podklad | Účel |
|---|---|---|---|
| 1 | **Hero — video (M2b) / poster (M2a)** | fotografia full-bleed, ~90 svh | Prvý dojem. Nadpis (Fraunces, `text-flora-hero`) + podnadpis + 2 CTA („Objednať kvety" clay, „Svadby a eventy" ghost). M2a: statická fotografia cez `next/image` s prioritou = budúci poster videa. Tmavý gradient-overlay zdola pre kontrast textu (biela na overlayi ≥ 4.5:1 — QA overí na finálnej fotke). |
| 2 | **Manifest (intro)** | paper | Jedna veľká editorial veta (`text-flora-h1`, kurzívové slovo v Fraunces italic) + 2–3 vety o ateliéri. Ukotví hlas značky. Žiadna fotka — nádych po hero. |
| 3 | **Sezónny výber** | sand | „Augustový výber" — 3 kytice ako arch karty (4:5, `.flora-arch`), názov + kvety v nej + cena. Eyebrow s aktuálnym mesiacom = dôkaz živosti. Odkaz → `/ponuka`. |
| 4 | **Služby** | paper | 4 riadky ako editorial zoznam s číslovaním (01–04), NIE generická mriežka kariet: Svadby a eventy · Kytice na objednávku · Predplatné kvetov · Firemné a smútočná väzba. Každý riadok: názov (h3), 1 veta, šípka; hover odhalí malú fotku. Odkazy na podstránky. |
| 5 | **Galéria** | paper → full-bleed | Asymetrická editorial mozaika 5–6 fotiek (mix 3:4, 1:1, 4:5, jedna 21:9 cez celú šírku). Ukazuje remeslo bez slov. |
| 6 | **Ateliér (teaser)** | flora-900 (tmavá) | Fotka ateliéru + 3–4 vety príbehu (text `flora-mist`), podpis zakladateľky, odkaz → `/atelier`. Tmavý „nádych" v rytme stránky. |
| 7 | **Ako prebieha objednávka** | paper | 3 kroky: Vyberiete (alebo popíšete predstavu) → Uviažeme v deň odovzdania → Vyzdvihnutie / doručenie po meste. Malé kroky, veľká dôvera. |
| 8 | **Referencie** | sand | 2–3 citáty ako pull-quotes (Fraunces italic, meno + príležitosť). Bez carouselu a hviezdičiek — editorial, dôveryhodné. |
| 9 | **CTA pás** | clay-600 alebo flora-900 | Jedna veta + tlačidlo „Objednať kvety" / „Nezáväzná konzultácia" → `/kontakt`. |
| 10 | **Pätička s kontaktom** | flora-900 | Adresa, otváracie hodiny, telefón, odkazy. |

### Svadby a eventy `/svadby` (predajná stránka)

1. **Sub-hero** — full-width fotka svadobnej inštalácie (21:9), h1 + 1 veta.
2. **Ako pracujeme s párom** — 2 stĺpce: text + arch portrét; konkrétne (prvá
   konzultácia zdarma, moodboard, koľko týždňov vopred).
3. **Realizácie** — 3 mini-prípady (fotka 4:5 + miesto + rozsah v 1 vete).
   Portfólio predáva viac než prídavné mená.
4. **Rozsah spolupráce a orientačné ceny** — 3 úrovne (kytica a pierka / obradová
   výzdoba / kompletná výzdoba s inštaláciou) s cenou „od…". Transparentnosť
   filtruje dopyty.
5. **Priebeh spolupráce** — 4 kroky časovej osi (dopyt → konzultácia → návrh
   a rozpočet → realizácia v deň D).
6. **Referencie párov** — 2 citáty (sand podklad).
7. **CTA dopyt** — formulár krátky (mená, termín, miesto, správa) alebo odkaz na
   `/kontakt` s predvolenou témou „svadba". (M3 pripojí booking widget.)

### Ponuka `/ponuka` (prezentačná, bez e-shopu vo v1)

1. **Sub-hero** — h1 + veta o sezónnosti (kompaktný, textový, na sand).
2. **Kategórie** — Kytice dňa · Kytice na mieru · Smútočná väzba · Kvety do
   interiéru a vázy. Karty s cenovým rozpätím „od…".
3. **Sezónny kalendár** — podpisový obsahový prvok: mriežka mesiacov/období
   (jar–leto–jeseň–zima) s kvetmi, ktoré vtedy vrcholia. Dôkaz odbornosti,
   unikátny obsah (žiadny generický web to nemá).
4. **Predplatné kvetov** — detailný blok: frekvencia (týždenne/2-týždenne/mesačne),
   ceny, ako funguje výmena vázy. Zvýraznený, `flora-900` podklad.
5. **Praktické info** — doručenie po Bratislave (cena, časy), starostlivosť
   o rezané kvety (3 tipy). Malý FAQ formát.
6. **CTA** → `/kontakt`.

### Ateliér `/atelier` (o nás)

1. **Sub-hero** — portrét zakladateľky (arch, 4:5) + h1 „Ateliér" + úvodná veta.
2. **Príbeh** — kedy vznikol, prečo, čo robí inak. Konkrétne fakty (rok, ulica),
   žiadne frázy.
3. **Tím** — 2–3 ľudia (arch portréty, meno, rola, 1 ľudská veta).
4. **Ako pracujeme** — konkrétne hodnoty s dôkazom: lokálni pestovatelia (odkiaľ),
   sezónny nákup 2× týždenne, väzba bez floristickej peny (ekológia). Fakty, nie
   „vášeň pre kvalitu".
5. **Priestor** — 2–3 fotky ateliéru (denné svetlo, pracovný stôl).
6. **CTA** → `/kontakt`.

### Kontakt a objednávka `/kontakt`

1. **Kontakt + hodiny** — adresa, telefón, e-mail, otváracie hodiny (tabuľka),
   mapa (statický obrázok mapy s odkazom — žiadny ťažký embed vo v1).
2. **Objednávkový formulár** — meno, kontakt, typ (kytica / svadba / predplatné /
   iné), termín, správa. M2: zapisuje ako lead; M3: nahradí/rozšíri zdieľaný
   `booking-widget` vo vizuáli šablóny.
3. **Krátke FAQ** — dokedy objednať kyticu (deň vopred), svadby (3–6 mesiacov),
   doručenie, platba.

**Hierarchia nadpisov (všetky stránky):** presne jeden `h1`; sekcie `h2`
(eyebrow + nadpis), karty `h3`. Landmarky `header/main/footer/nav`.

## c) Motion koncept (M2b navrch; M2a musí obstáť staticky)

Intenzita **prémiovo jemná** (editorial/luxury). Len `transform` + `opacity`,
`whileInView` s `once: true`, ease `--ease-flora`, trvanie 500–800 ms. Rozpočet:
Lighthouse ≥ 95, inak sa prvok vypúšťa.

| Miesto | Motion (M2b) | Prečo | `reduced-motion` |
|---|---|---|---|
| Hero | Scroll-video loop (Higgsfield, režim A — pozadie, `autoplay muted playsinline loop`, poster = prvý snímok). Nadpis: reveal po riadkoch (opacity + translateY 20 px, stagger 90 ms). | Prvý dojem nesie video, žiadne ozdôbky navyše. | Statický poster (M2a stav), text viditeľný hneď. |
| Sekcie (všetky) | Vstupný reveal bloku: opacity 0→1 + translateY 24 px, raz, až vo viewporte. | Pokojné „listovanie časopisom". | Bez animácie, plný layout. |
| Sezónny výber | Karty stagger (80 ms); hover: fotka scale 1.04 v orámovaní `overflow-hidden` (600 ms). | Jemná živosť, kvety „dýchajú". | Hover len zmena opacity overlay, bez scale. |
| Služby (zoznam) | Hover riadku: šípka translateX 4 px + odhalenie mini-fotky (opacity). | Mikro-odmena, vedie klik. | Statická zmena farby textu. |
| Galéria | Reveal mask: obrázok scale 1.06→1 vnútri `overflow-hidden` + opacity. | „Drahé" odkrytie bez CLS. | Obrázky hneď viditeľné. |
| Ateliér teaser (tmavá) | Len reveal textu; fotka bez pohybu. | Tmavá sekcia je pauza — menej je viac. | — |
| Signature set-piece (jediný, M2b, voliteľný) | Medzi manifestom a sezónnym výberom: 3–5 lupienkov (malé SVG/PNG) jemne klesne a usadí sa pri scrolli (transform, raz). | Jeden „wow" moment na celom webe — viac by bolo gýč. | Vypnutý úplne. |
| CTA tlačidlá | Hover: translateY -2 px + tieň `--shadow-flora-lift`; podčiarknutie odkazov scaleX 0→1. | Hmatateľnosť. | Len zmena farby. |
| Prechody stránok | View Transitions (fade, ≤ 300 ms) — až M2b, len ak neuberie z výkonu. | Plynulosť viacstránkového webu. | Bez prechodu. |

**Zakázané:** parallax na mobiloch, animácie `width/height/top/left`, autoplay
carousely, animovanie mimo viewportu, count-up počítadlá (pre kvetinárstvo
pôsobia korporátne — vynechávame).

## d) Obrázky (podklad pre kurátorský výber + LICENSES.md)

- **Zdroj:** Unsplash/Pexels (komerčne voľné), kurátorsky — reálne fotografie,
  nie „AI plasty". Každý obrázok → `images/LICENSES.md`.
- **Jednotná atmosféra:** denné svetlo, teplé tóny ladiace s paletou (krémová,
  zeleň, terakota, púdrová). Vyhnúť sa presýteným farbám, tvrdému blesku,
  studenej modrej. Ideál „ráno v ateliéri".
- **Motívy:** ruky viažuce kyticu (remeslo), detail textúry kvetov, kytice na
  neutrálnom pozadí (sezónny výber), svadobná inštalácia/tabuľa (svadby),
  interiér kvetinárstva s denným svetlom (ateliér), sezónne kvety — august:
  dálie, hortenzie, ruže, eukalyptus.
- **Pomery strán (rezervovať miesto — žiadny CLS):** hero 16:9 (video/poster;
  mobil orez na výšku alebo len poster) · arch karty 4:5 · galéria mix 3:4, 1:1,
  4:5 + jedna 21:9 · portréty 4:5 · sub-hero 21:9.
- **Hero video (M2b, Higgsfield, dodá majiteľ):** ~6–10 s bezšvový loop, pomalý
  editorial záber (viazanie kytice / jemný pohyb kvetov), bez zvuku. Web strana:
  WebM + MP4, poster ako prvý snímok, `preload="metadata"`, na mobile poster.
  M2a hero fotka = budúci poster (vybrať tak, aby sedela k plánovanému motívu).

## e) Prístupnosť (súčasť dizajnu)

- **Kontrasty (overené, viď theme.css):** ink na paper 12.2:1 · moss na paper
  5.8:1 · clay-600 na paper 5.7:1 · flora-600 na paper 7.1:1 (odkazy) · paper na
  flora-900 12.2:1 · mist na flora-900 8.5:1 · biela na clay-600 6.2:1 (CTA).
  `flora-line`, blush a clay-100/200 sú len dekoratívne — nikdy text.
- **Text na fotografii vždy nad overlay gradientom** (nie priamo na fotke);
  QA meria kontrast na finálnom posteri.
- **Fokus:** viditeľný značkový `:focus-visible` (clay outline, offset 3 px) —
  definovaný v theme.css, platí pre všetko interaktívne.
- **Dotykové ciele ≥ 44×44 px** (pilulkové CTA, položky menu, formulár).
- **Formuláre:** viditeľné `label` (nie placeholder-only), chybové hlášky textom
  aj farbou, `autocomplete` atribúty.
- **`prefers-reduced-motion`:** globálny fallback v theme.css + M2b vrstva sa
  nemontuje (statický M2a layout je plnohodnotný zážitok, nie ochudobnený).
- **Riadkovanie** body 1.75, dĺžka riadku max ~70 znakov (`max-w-prose` alebo
  ekvivalent), `alt` texty popisné (kvety/príležitosť, nie „obrázok kytice").

---

*Vypracoval `ui-ux-designer` (M2a, august 2026). Ďalší krok: `frontend-dev` +
`sk-copywriter` podľa tohto rozvrhu, potom `qa-a11y` a ľudská revízia.*
