# Kvetinárstvo — dizajnový brief (M2a, revízia po spätnej väzbe majiteľa)

> Pre `frontend-dev` (implementácia sekcií) a `sk-copywriter` (texty do
> `content.ts`). Tokeny: `theme.css` v tomto adresári (prefix `flora-`).
> Brána kvality: `docs/sablony-kvalita.md` je záväzná.
> Demo značka (fiktívna): **Boma Flora** — kvetinový ateliér v centre **Trenčína**.
> (Prefix tokenov `flora-` ostáva bezo zmeny.)

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

**Náš smer (jednoducho): fotografia-first, pokojný editorial rytmus, sezónnosť.**
Značkovo ide len o šablónu „Kvetinárstvo" — žiadne interné labely smeru.
Teplý papier `flora-paper` namiesto bielej, jedľový atrament `flora-900` namiesto
čiernej, terakotový akcent `flora-clay-600` pre CTA a sezónne teplo. Fraunces
(variable serif, mäkké serify, kurzíva na akcenty) + Figtree (text). Podpisové
prvky, ktoré šablónu odlíšia na prvý pohľad:

1. **Arch orez fotografií** (`.flora-arch`) — kvetinový „portál", opakuje sa
   naprieč webom ako vizuálny motív.
2. **Sezónnosť ako obsahový princíp** — web hovorí, čo kvitne teraz („Augustový
   výber", sezónny kalendár) → pôsobí živo a odborne, nie ako statická šablóna.
3. **Kalendár menín** — web z dnešného dátumu vie, kto má dnes (a zajtra) meniny,
   a ponúkne kyticu. Živý, každý deň iný prvok, ktorý generický web nemá.
4. **Editorial rytmus podkladov:** paper → sand → paper → tmavá `flora-900`
   sekcia ako „nádych" — nikdy nekonečná biela stena.

Nie kópia žiadneho webu — extrakcia smeru (fotografia-first, serif editorial,
organické tvary) do vlastného systému.

### Hlas značky (smer pre `sk-copywriter`)

Vzorové vety od majiteľa — copywriter ich vyladí, ale drží tento tón a fakty:

- **„Sme kvetinový ateliér v centre Trenčína."** (nie „malý ateliér" — sebavedomé,
  vecné, lokálne ukotvené)
- **„Kvety nakupujeme od lokálnych pestovateľov, ale aj priamo z Holandska,
  Ekvádoru a Kolumbie."** (konkrétny dôkaz sortimentu a čerstvosti — použiť
  v manifeste a/alebo na stránke Ateliér)

Všetky zmienky lokality = **Trenčín** (doručenie po Trenčíne, centrum Trenčína,
mapa). Žiadne frázy zo zakázaného zoznamu v `docs/sablony-kvalita.md`.

## b) Mapa stránok, navigácia a rytmus sekcií

Viacstránkový web (7 stránok): **Domov `/` · Ponuka `/ponuka` · Svadby a eventy
`/svadby` · Obchod `/obchod` · Blog `/blog` (+ detail `/blog/[slug]`) · Ateliér
`/atelier` · Kontakt a objednávka `/kontakt`**.

**Hlavička (7 položiek je veľa → zoskupenie):** logotyp „Boma Flora" (Fraunces
wordmark) + **5 odkazov: Ponuka · Svadby a eventy · Obchod · Blog · Ateliér**
+ CTA pilulka **„Objednať kvety"** (clay-600) → `/kontakt`. Kontakt teda nie je
samostatný odkaz v hlavičke — vedie naň CTA (najsilnejšie miesto) a pätička.
Poradie podľa biznis priority: Ponuka (každodenné jadro) → Svadby (prémiová
služba) → Obchod (predaj, vedľa Ponuky, nech je rozdiel čitateľný) → Blog →
Ateliér. Na mobile overlay menu so všetkými 7 položkami (vrátane Domov a Kontakt).

**Pätička** na tmavej `flora-900`: adresa (centrum Trenčína), otváracie hodiny,
telefón, mini-mapa navigácie (všetkých 7 stránok), sociálne siete.

### Domov `/`

| # | Sekcia | Podklad | Účel |
|---|---|---|---|
| 1 | **Hero — video (M2b) / poster (M2a)** | fotografia full-bleed, ~90 svh | Prvý dojem. Nadpis (Fraunces, `text-flora-hero`) + podnadpis + 2 CTA („Objednať kvety" clay, „Svadby a eventy" ghost). M2a: statická fotografia cez `next/image` s prioritou = budúci poster videa (video koncept: sekcia f). Tmavý gradient-overlay zdola pre kontrast textu (biela na overlayi ≥ 4.5:1 — QA overí na finálnej fotke). |
| 2 | **Meniny — pás** | sand, tenké `flora-line` linky hore/dole | Podpisový prvok: „Dnes má meniny **Hortenzia** · zajtra Jozefína" + odkaz „Prekvapte ju kyticou →" → `/kontakt` (predvolený typ „kytica"). Detaily: sekcia e-bis nižšie. Nízky pás (~1 riadok na desktope), nie banner. |
| 3 | **Manifest (intro)** | paper | Jedna veľká editorial veta (`text-flora-h1`, kurzívové slovo v Fraunces italic) + 2–3 vety o ateliéri v hlase značky („Sme kvetinový ateliér v centre Trenčína…"). Žiadna fotka — nádych po hero. |
| 4 | **Sezónny výber** | paper | „Augustový výber" — 3 kytice ako arch karty (4:5, `.flora-arch`), názov + kvety v nej + cena. Eyebrow s aktuálnym mesiacom = dôkaz živosti. Odkaz → `/ponuka`. |
| 5 | **Služby** | paper | **5 riadkov** ako editorial zoznam s číslovaním (01–05), NIE generická mriežka kariet: **Svadby a eventy · Kytice na objednávku · Smútočné kytice a vence · Predplatné kvetov · Firemné kvety**. Každý riadok: názov (h3), 1 veta, šípka; hover odhalí malú fotku. Smútočný riadok je plnohodnotná položka (nie prílepok) — tón dôstojný a vecný (dokedy vieme uviazať, doručenie do domu smútku); text `sk-copywriter`. Odkazy na podstránky/kotvy v `/ponuka`. |
| 6 | **Galéria** | paper → full-bleed | Asymetrická editorial mozaika 5–6 fotiek (mix 3:4, 1:1, 4:5, jedna 21:9 cez celú šírku). Ukazuje remeslo bez slov. |
| 7 | **Ateliér (teaser)** | flora-900 (tmavá) | Fotka ateliéru + 3–4 vety príbehu (text `flora-mist`), podpis zakladateľky, odkaz → `/atelier`. Tmavý „nádych" v rytme stránky. |
| 8 | **Ako prebieha objednávka** | paper | 3 kroky: Vyberiete (alebo popíšete predstavu) → Uviažeme v deň odovzdania → Vyzdvihnutie v ateliéri / doručenie po Trenčíne. Malé kroky, veľká dôvera. |
| 9 | **Referencie** | sand | 2–3 citáty ako pull-quotes (Fraunces italic, meno + príležitosť). Bez carouselu a hviezdičiek — editorial, dôveryhodné. |
| 10 | **CTA pás** | clay-600 alebo flora-900 | Jedna veta + tlačidlo „Objednať kvety" / „Nezáväzná konzultácia" → `/kontakt`. |
| 11 | **Pätička s kontaktom** | flora-900 | Adresa, otváracie hodiny, telefón, odkazy. |

### Ponuka `/ponuka` (prezentačná a sezónna — NIE predaj; predaj = `/obchod`)

1. **Sub-hero** — h1 + veta o sezónnosti (kompaktný, textový, na sand).
2. **Kategórie** — **Kytice dňa · Kytice na mieru · Smútočné kytice a vence ·
   Kvety do interiéru a vázy.** Karty s cenovým rozpätím „od…". Smútočná
   kategória je vizuálne rovnocenná karta (rovnaká veľkosť/hierarchia), obsah
   dôstojný: vence, ikebany, kytice na rozlúčku; dokedy pred obradom objednať,
   doručenie do domu smútku / na cintorín v Trenčíne. (Texty `sk-copywriter`.)
3. **Meniny — blok** — väčší variant podpisového prvku: „Meniny tento týždeň"
   (dnes + najbližších 6 dní, dnešné meno zvýraznené Fraunces italic) + CTA
   „Objednať kyticu k meninám" → `/kontakt`. Porcelain karta na paper podklade,
   detaily v sekcii e-bis.
4. **Sezónny kalendár** — podpisový obsahový prvok: mriežka mesiacov/období
   (jar–leto–jeseň–zima) s kvetmi, ktoré vtedy vrcholia. Dôkaz odbornosti,
   unikátny obsah (žiadny generický web to nemá).
5. **Predplatné kvetov** — detailný blok: frekvencia (týždenne/2-týždenne/mesačne),
   ceny, ako funguje výmena vázy. Zvýraznený, `flora-900` podklad.
6. **Praktické info** — doručenie po Trenčíne (cena, časy), starostlivosť
   o rezané kvety (3 tipy). Malý FAQ formát.
7. **CTA** → `/kontakt` (+ tichý odkaz „Kúpiť online → Obchod").

### Svadby a eventy `/svadby` (predajná stránka)

1. **Sub-hero** — full-width fotka svadobnej inštalácie (21:9), h1 + 1 veta.
2. **Ako pracujeme s párom** — 2 stĺpce: text + arch portrét; konkrétne (prvá
   konzultácia zdarma, moodboard, koľko týždňov vopred).
3. **Realizácie** — 3 mini-prípady (fotka 4:5 + miesto + rozsah v 1 vete);
   miesta z regiónu (Trenčín a okolie, Považie). Portfólio predáva viac než
   prídavné mená.
4. **Rozsah spolupráce a orientačné ceny** — 3 úrovne (kytica a pierka / obradová
   výzdoba / kompletná výzdoba s inštaláciou) s cenou „od…". Transparentnosť
   filtruje dopyty.
5. **Priebeh spolupráce** — 4 kroky časovej osi (dopyt → konzultácia → návrh
   a rozpočet → realizácia v deň D).
6. **Referencie párov** — 2 citáty (sand podklad).
7. **CTA dopyt** — formulár krátky (mená, termín, miesto, správa) alebo odkaz na
   `/kontakt` s predvolenou témou „svadba". (M3 pripojí booking widget.)

### Obchod `/obchod` (vstupná stránka — e-shop tok je zatiaľ PLÁNOVANÝ)

Rozdiel rolí: **Ponuka** = prezentácia a sezónna inšpirácia (čo viažeme, „od…"
ceny), **Obchod** = predaj (konkrétny produkt, cena, doručenie, platba).
Implementácia e-shopu je **otvorená — rozhodne majiteľ**: headless WooCommerce
cez Store API (zapadá do vízie, Fáza 4/6 platformy) alebo externé riešenie.
V M2a je Obchod plnohodnotná stránka vizuálne, ale nákupný tok je placeholder.

1. **Sub-hero** — h1 „Obchod" + 1 veta (kytice s doručením po Trenčíne, platba
   online — bez sľubov, ktoré ešte neplatia; text `sk-copywriter`).
2. **Náhľad sortimentu** — 3–4 arch karty v štýle sezónneho výberu (kytica dňa,
   kytica na mieru, predplatné, darčekový poukaz) s cenou „od…". Karty **nie sú
   nákupné** — jasný stav „Online nákup pripravujeme" (textový štítok na
   `flora-sand`, nie iba farba) a CTA „Zatiaľ objednáte telefonicky alebo
   formulárom" → `/kontakt`.
3. **Ako bude nákup fungovať** — 3 kroky (vyberiete → zvolíte deň doručenia
   po Trenčíne / vyzdvihnutie → zaplatíte online). Buduje očakávanie, nič nesľubuje
   na dnes.
4. **CTA** → `/kontakt` (dnešná objednávková cesta).

**Poznámka pre `frontend-dev`:** stránku stavať tak, aby sekcia 2 vedela neskôr
prijať reálne produkty (dáta cez props z `content.ts`, neskôr zo Store API /
externého feedu) bez zmeny layoutu. Do kódu žiadne WooCommerce závislosti v M2a.

### Blog `/blog` + detail `/blog/[slug]`

Účel: obsahový kanál šablóny — neskôr ho plní **copywriter-agent pre
kvetinárstvo** (lego vzor ako Writer agent na hlavnom webe: agent → draft →
človek schvaľuje). V M2a: 3–4 demo články v `content.ts` (dáta-driven, rovnaká
štruktúra ako budúci feed).

**Zoznam `/blog`:**
1. **Sub-hero** — kompaktný na sand: h1 „Blog" + 1 veta (o čom píšeme — sezóna,
   starostlivosť o kvety, zákulisie ateliéru).
2. **Najnovší článok** — veľká karta cez celú šírku: fotka 21:9
   (`rounded-flora-lg`), Fraunces titulok `text-flora-h2`, perex, dátum.
3. **Mriežka článkov** — 2–3 stĺpce, karty: fotka 3:2, titulok (h3, Fraunces),
   1 veta perexu, dátum. Fotografia-first — fotka nesie kartu, text je stručný.
   Stránkovanie (jednoduché „Staršie články →", žiadny infinite scroll).
4. **CTA pás** → `/kontakt`.

**Detail `/blog/[slug]`:**
1. **Hlavička článku** — eyebrow (rubrika/mesiac), h1 (Fraunces, `text-flora-h1`),
   dátum + odhad čítania; pod tým úvodná fotka 16:9 full-width v obsahu.
2. **Telo** — prose šírka max ~70 znakov, `text-flora-body` (1.75 riadkovanie),
   medzititulky h2 Fraunces, pull-quote štýl referencií (Fraunces italic),
   obrázky v texte `rounded-flora-lg`.
3. **Súvisiace články** — 3 karty v štýle mriežky zoznamu.
4. **CTA pás** — „Kytica podľa sezóny? Objednajte." → `/kontakt`.

Arch orez na blogu nepoužívame (arch = kytice/portréty) — blog drží mäkké
`rounded-flora-lg`, aby podpisový tvar nezovšednel.

### Ateliér `/atelier` (o nás)

1. **Sub-hero** — portrét zakladateľky (arch, 4:5) + h1 „Ateliér" + úvodná veta
   v hlase značky („Sme kvetinový ateliér v centre Trenčína…").
2. **Príbeh** — kedy vznikol, prečo, čo robí inak. Konkrétne fakty (rok, ulica
   v centre Trenčína), žiadne frázy.
3. **Tím** — 2–3 ľudia (arch portréty, meno, rola, 1 ľudská veta).
4. **Ako pracujeme** — konkrétne hodnoty s dôkazom: **„Kvety nakupujeme od
   lokálnych pestovateľov, ale aj priamo z Holandska, Ekvádoru a Kolumbie."**,
   sezónny nákup 2× týždenne, väzba bez floristickej peny (ekológia). Fakty, nie
   prázdne superlatívy.
5. **Priestor** — 2–3 fotky ateliéru (denné svetlo, pracovný stôl).
6. **CTA** → `/kontakt`.

### Kontakt a objednávka `/kontakt`

1. **Kontakt + hodiny** — adresa (centrum Trenčína), telefón, e-mail, otváracie
   hodiny (tabuľka), mapa (statický obrázok mapy s odkazom — žiadny ťažký embed vo v1).
2. **Objednávkový formulár** — meno, kontakt, typ (kytica / svadba / smútočná
   väzba / predplatné / iné), termín, správa. **M2a: demo bez odoslania** — polia
   sú prítomné aj bez JS (progresívne vylepšenie), po odoslaní sa zobrazí úprimné
   demo potvrdenie; ukážka v `/ukazky` zámerne **nevytvára reálne leady** v
   Directuse. M3: reálne odoslanie (lead) / rozšírenie zdieľaným `booking-widget`
   vo vizuáli šablóny. Odkazy z meniny prvku predvolia typ „kytica".
3. **Krátke FAQ** — dokedy objednať kyticu (deň vopred), smútočná väzba (vieme
   aj do niekoľkých hodín — text `sk-copywriter`), svadby (3–6 mesiacov),
   doručenie po Trenčíne, platba.

**Hierarchia nadpisov (všetky stránky):** presne jeden `h1`; sekcie `h2`
(eyebrow + nadpis), karty `h3`. Landmarky `header/main/footer/nav`.

## e-bis) Kalendár menín — podpisový prvok (dizajn + a11y + dev poznámka)

**Kde žije:**
- **Domov, pás pod hero (sekcia 2)** — najviditeľnejšie miesto, denne iný obsah
  hneď po prvom dojme. Nízky pás na `flora-sand` s 1 px `flora-line` linkami
  hore aj dole (pôsobí ako riadok z novín, nie banner).
- **Ponuka, blok „Meniny tento týždeň" (sekcia 3)** — porcelain karta
  (`--radius-flora-lg`, `--shadow-flora-card`): dnešok + 6 dní, dnešné meno
  najväčšie. Prirodzený kontext — človek si tu rovno vyberie kyticu.
- V pätičke **nie** — duplicita bez pridanej hodnoty; pätička ostáva kontaktná.

**Vizuál (v palete):** eyebrow „Dnes má meniny" (uppercase, `flora-moss`,
`text-flora-eyebrow`) · meno vo Fraunces italic, `flora-ink` (na páse ~`h3`
veľkosť, v bloku na Ponuke `h2`) · zajtrajšok menším textom (`flora-moss`) ·
CTA ako **podčiarknutý textový odkaz** „Prekvapte ju kyticou →" v `clay-600`
(5.7:1 na paper — AA; na sand QA overí, inak `clay-700`). Žiadna ďalšia grafika —
typografia je ozdoba.

**Prístupnosť (nie len farba):** CTA odlíšené podčiarknutím + šípkou, nie iba
farbou. Pás ako `<aside aria-label="Dnešné meniny">` (doplnková informácia,
neruší osnovu nadpisov domova); blok na Ponuke má riadny `h2`. Dátum v `<time
datetime="…">`. Dotykový cieľ odkazu ≥ 44 px na výšku (padding). Celý obsah je
skutočný text (žiadny text v obrázku).

**Implementačná poznámka pre `frontend-dev`:**
- Dáta = **statická SK tabuľka menín** (dátum → meno) v šablóne, **0 externých
  závislostí**; počíta sa z `Date`. K menu ulož aj **rod (ž/m)**, aby CTA vedelo
  správne „prekvapte **ju/ho** kyticou" — z koncovky mena sa rod spoľahlivo
  odvodiť nedá. Dni bez mena / štátne sviatky: fallback veta (napr. sezónna
  ponuka) — nech pás nikdy nie je prázdny.
- Časové pásmo **Europe/Bratislava** (nie UTC servera). Pozor na ISR/cache:
  deň sa musí prepnúť o polnoci — buď `revalidate` ≤ 1 h na dotknutých stránkach,
  alebo malý klientský komponent s SSR fallbackom. Bez CLS (výška pásu je fixná
  typografiou, nečaká sa na JS).

## c) Motion koncept (M2b navrch; M2a musí obstáť staticky)

Intenzita **prémiovo jemná** (editorial/luxury). Len `transform` + `opacity`,
`whileInView` s `once: true`, ease `--ease-flora`, trvanie 500–800 ms. Rozpočet:
Lighthouse ≥ 95, inak sa prvok vypúšťa.

| Miesto | Motion (M2b) | Prečo | `reduced-motion` |
|---|---|---|---|
| Hero | Video loop na pozadí (Higgsfield, režim A — `autoplay muted playsinline loop`, poster = prvý snímok; koncept videa: sekcia f). Nadpis: reveal po riadkoch (opacity + translateY 20 px, stagger 90 ms). | Prvý dojem nesie video, žiadne ozdôbky navyše. | Statický poster (M2a stav), text viditeľný hneď. |
| Meniny pás | Len spoločný vstupný reveal sekcie — vnútri nič špeciálne. | Obsah (dnešné meno) je pointa, nie pohyb. | Bez animácie. |
| Sekcie (všetky) | Vstupný reveal bloku: opacity 0→1 + translateY 24 px, raz, až vo viewporte. | Pokojné „listovanie časopisom". | Bez animácie, plný layout. |
| Sezónny výber / karty Obchodu | Karty stagger (80 ms); hover: fotka scale 1.04 v orámovaní `overflow-hidden` (600 ms). | Jemná živosť, kvety „dýchajú". | Hover len zmena opacity overlay, bez scale. |
| Služby (zoznam) | Hover riadku: šípka translateX 4 px + odhalenie mini-fotky (opacity). | Mikro-odmena, vedie klik. | Statická zmena farby textu. |
| Galéria / blog karty | Reveal mask: obrázok scale 1.06→1 vnútri `overflow-hidden` + opacity. | „Drahé" odkrytie bez CLS. | Obrázky hneď viditeľné. |
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
  neutrálnom pozadí (sezónny výber, obchod), svadobná inštalácia/tabuľa (svadby),
  **smútočná väzba — decentný motív** (veniec/kytica v tlmených tónoch, bez
  cintorínskeho pátosu; radšej detail väzby než náhrobok), interiér kvetinárstva
  s denným svetlom (ateliér), blogové fotky v rovnakej atmosfére (sezónne kvety,
  starostlivosť, zákulisie), sezónne kvety — august: dálie, hortenzie, ruže,
  eukalyptus.
- **Pomery strán (rezervovať miesto — žiadny CLS):** hero 16:9 (video/poster;
  mobil orez na výšku alebo len poster) · arch karty 4:5 · galéria mix 3:4, 1:1,
  4:5 + jedna 21:9 · portréty 4:5 · sub-hero 21:9 · blog zoznam 3:2 + featured
  21:9 · blog detail 16:9.

## f) Hero video — koncept pre Higgsfield (dodá majiteľ, M2b)

Spoločné zadanie: **~6–10 s bezšvový loop, bez zvuku**, pomalé editorial tempo
(žiadny strih vo vnútri záberu), **teplé denné svetlo**, tóny ladiace s paletou —
krémová/porcelánová, šalviová a jedľová zeleň, terakota; **žiadna studená modrá,
žiadny rýchly pohyb kamery**. Kompozícia so **spodnou tretinou pokojnou** (tam
sedí nadpis + overlay gradient). Formát 16:9 (dodať čo najvyššie rozlíšenie,
web strana skomprimuje).

**Varianty motívu (stačí vygenerovať 1, ideálne 2 na výber):**

1. **Ruky floristky** — detail rúk viažucich kyticu (dálie, záhradné ruže,
   eukalyptus) na dreze/kraft papieri, mäkké okenné svetlo zboku, plytká hĺbka
   ostrosti. Cyklický pohyb rúk → prirodzene bezšvový loop. *Odporúčaný —
   remeslo je najsilnejší odkaz značky.*
2. **Kvety v pohybe** — statická kamera, kytica/kvety sa jemne pohupujú
   (mikro-vánok), rozostrené teplé pozadie. Najľahší bezšvový loop (pohyb je
   periodický), najpokojnejší variant.
3. **Pomalý push-in na kyticu** — hotová kytica na neutrálnom kraft papieri,
   veľmi pomalý nájazd kamery. Pozor: push-in sa nezacyklí bezšvovo — riešiť
   krátkym cross-fade na začiatok, alebo preferovať varianty 1–2.

**Náčrt Higgsfield promptu (EN, majiteľ doladí):**
> Close-up of a florist's hands gently tying a bouquet of dahlias, garden roses
> and eucalyptus on a kraft paper worktable, soft warm morning window light,
> cream / sage green / terracotta color palette, shallow depth of field, slow
> graceful hand movement, static camera, editorial film look, subtle film grain,
> calm lower third of frame, seamless loop, 8 seconds, no text, no logo.

(Pre variant 2 zameniť dej: „a bouquet of dahlias and hydrangeas swaying very
gently in a soft breeze, static camera…")

**Web strana (mantinely z `docs/sablony-kvalita.md`):** režim A — loop na
pozadí hero, `autoplay muted playsinline loop`, WebM + MP4, `poster` = prvý
snímok (drží LCP), `preload="metadata"`, tmavý gradient-overlay zdola. **Mobil:**
len poster (alebo výrazne ľahšia verzia, ak ju majiteľ dodá). **`prefers-reduced-motion`:**
vždy len statický poster. M2a hero fotka sa vyberá tak, aby sedela k zvolenému
video motívu (ideálne rovnaká scéna „ruky + kytica").

## e) Prístupnosť (súčasť dizajnu)

- **Kontrasty (overené, viď theme.css):** ink na paper 12.2:1 · moss na paper
  5.8:1 · clay-600 na paper 5.7:1 · flora-600 na paper 7.1:1 (odkazy) · paper na
  flora-900 12.2:1 · mist na flora-900 8.5:1 · biela na clay-600 6.2:1 (CTA).
  `flora-line`, blush a clay-100/200 sú len dekoratívne — nikdy text.
- **Text na fotografii vždy nad overlay gradientom** (nie priamo na fotke);
  QA meria kontrast na finálnom posteri.
- **Fokus:** viditeľný značkový `:focus-visible` (clay outline, offset 3 px) —
  definovaný v theme.css, platí pre všetko interaktívne.
- **Dotykové ciele ≥ 44×44 px** (pilulkové CTA, položky menu, formulár, meniny odkaz).
- **Formuláre:** viditeľné `label` (nie placeholder-only), chybové hlášky textom
  aj farbou, `autocomplete` atribúty.
- **Meniny prvok:** informácia aj akcia nikdy len farbou (podčiarknutie, text,
  `<time>`); detaily v sekcii e-bis.
- **`prefers-reduced-motion`:** globálny fallback v theme.css + M2b vrstva sa
  nemontuje (statický M2a layout je plnohodnotný zážitok, nie ochudobnený).
- **Riadkovanie** body 1.75, dĺžka riadku max ~70 znakov (`max-w-prose` alebo
  ekvivalent), `alt` texty popisné (kvety/príležitosť, nie „obrázok kytice").

---

*Vypracoval `ui-ux-designer` (M2a, august 2026; revízia po spätnej väzbe
majiteľa — Boma Flora / Trenčín / meniny / smútočná väzba / blog / obchod /
video koncept). Ďalší krok: `frontend-dev` + `sk-copywriter` podľa tohto
rozvrhu, potom `qa-a11y` a ľudská revízia.*
