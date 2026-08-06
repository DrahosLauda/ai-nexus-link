# Šablóny — brána kvality („nerozoznateľné od AI")

> Jediné miesto pravdy pre kvalitu odvetvových šablón (`frontend/templates/<odvetvie>/`).
> **Sub-agenti** (`.claude/agents/`) čítajú tento dokument **na štarte každej práce**.
> Kontext a rozhodnutia: `docs/plan-agenti.md` → „Frontend agent — knižnica
> odvetvových šablón". Konvencia balíka: `frontend/templates/README.md`.

Cieľ zadania je tvrdý: **nesmie byť poznať, že web generovala AI** — senior dev +
dizajn úroveň, prístupnosť, výkon, čistý kód. Bez tejto brány sa cieľ nedá splniť.
Šablóna je „hotová" až po prejdení checklistu **a** ľudskej revízii majiteľa.

## Piliere kvality

1. **Dizajn systém (per šablóna).** Definované tokeny (paleta, typografia —
   výrazný display font + čitateľný text, škála medzier 4/8 px, rádiusy, tiene),
   sada sekcií a ich rytmus, konzistentný grid. Žiadne „default Tailwind demo" —
   každá šablóna má **rozpoznateľný vlastný charakter**.
2. **Obrázky + licencie.** Primárne licencovaný stock (Unsplash/Pexels — voľné na
   komerčné použitie) alebo generované (Gemini), **kurátorsky vybrané, aby pôsobili
   reálne** (nie zjavné „AI plasty"). Ku každej šablóne `images/LICENSES.md`
   (zdroj + licencia každého obrázka) — čisté právne pozadie pre klienta.
3. **Copywriting.** Konkrétny odvetvový jazyk, reálne znejúce ponuky/ceny/CTA.
   Žiadne generické AI frázy (zoznam nižšie). Píše/reviduje `sk-copywriter`.
4. **Technická kvalita.** Checklist nižšie (Lighthouse, a11y, responzivita, čistý kód).
5. **Povinná ľudská revízia.** Brána sa neobíde (postup nižšie).

## Checklist kvality (povinný pred „hotovo")

- [ ] **Lighthouse ≥ 95** — Performance / SEO / Best Practices. **Accessibility = 100** cieľ.
- [ ] **WCAG AA** — kontrast textu aj UI prvkov, `alt` na obrázkoch, sémantické
      landmarky a správna hierarchia nadpisov (jeden `h1`), plná ovládateľnosť
      klávesnicou, viditeľný fokus, funkčný `prefers-reduced-motion` fallback.
- [ ] **Responzivita** — mobil / tablet / desktop overené (predinštalovaný
      Chromium, screenshoty). Žiadne pretečenia ani horizontálny scroll.
- [ ] **Čistý kód** — žiadne lorem ipsum, žiadne mŕtve `TODO`, žiadny mŕtvy kód.
      `npm run lint` + `npm run build` čisté. Obsah **data-driven** z `content.ts`
      (nie natvrdo v JSX).
- [ ] **Žiadne AI klišé** — texty prešli kontrolou proti zoznamu nižšie.
- [ ] **Skutočné meta/OG** pre šablónu (aj keď `noindex`, hlavička nech je čistá).
- [ ] **Licencie** — každý obrázok má záznam v `images/LICENSES.md`.
- [ ] **Demo obsah `noindex`** — mount cez `app/ukazky/[odvetvie]/`, nie v
      `sitemap.xml` ani `llms.txt`.
- [ ] **Lego, žiadna duplicita** — zdieľané moduly (booking/chat) sa importujú,
      nekopírujú.

## Zakázané generické AI frázy

Text šablóny **nesmie** obsahovať prázdne obraty, ktoré prezrádzajú AI a nič
nehovoria. Zakázané (a im podobné):

- „posúvame hranice (možného)"
- „v dnešnej uponáhľanej / rýchlej dobe"
- „inovatívne riešenia na mieru", „riešenia na kľúč" ako výplň bez obsahu
- „komplexné riešenia", „komplexný prístup"
- „vaša spokojnosť je našou prioritou", „zákazník na prvom mieste" (bez dôkazu)
- „s láskou a vášňou", „vášeň pre kvalitu"
- „posuňte svoj biznis na ďalšiu úroveň", „naštartujte svoj úspech"
- „nekompromisná kvalita", „špičková kvalita" (prázdny superlatív bez dôkazu)
- „nielen … ale aj …" ako ozdobná barlička v každej vete
- „či už ste … alebo …, máme pre vás …" (generická inklúzia)
- „v neposlednom rade", „v konečnom dôsledku" ako výplň
- reťaze superlatívov bez konkrétneho faktu za nimi

**Pravidlo namiesto frázy:** povedz **konkrétnu vec** — čo firma robí, pre koho,
ako prebieha objednávka, čo z toho zákazník má. Jeden konkrétny detail > tri
superlatívy. Tento zoznam je **živý** — pri retrospektíve doň dopĺňaj nové frázy,
ktoré majiteľ vytkne.

## Motion pravidlá (mantinely — súčasť brány)

Motion plánujeme, neimprovizujeme: čo sa hýbe, ako, prečo a čo pri `reduced-motion`.
Cieľ „drahý" pocit **a zároveň** Lighthouse ≥ 95 + a11y je najnáročnejšia časť —
drž mantinely, inak sa efekt vypúšťa.

- **Technológia:** primárne **Framer Motion** (`motion/react`) — jedna závislosť,
  ktorá sa tu oplatí (motion JE produkt); doinštaluje sa až pri vlajkovej šablóne
  (M2b). Doplnkovo natívne CSS na jednoduché veci. **GSAP** len v zálohe na 1–2
  „set-piecy", ak Framer/CSS vkusne nezvládnu. Intenzita **„prémiovo jemná"**
  (editorial / luxury-brand), nie „award-site" preplácanie.
- **Len `transform` a `opacity`** (GPU) — nikdy neanimuj `width/height/top/left`
  (layout thrash). `will-change` striedmo a cielene.
- **Animuj až vo viewporte** (`whileInView` / IntersectionObserver, `once: true`),
  nie všetko naraz na load → chráni prvé vykreslenie a Lighthouse.
- **`prefers-reduced-motion`: tvrdý fallback** — nepodstatný motion sa vypne,
  ostane **elegantný statický layout** (nie prázdna stránka). Testuje `qa-a11y`.
- **Žiadny layout shift (CLS)** — rezervuj miesto pre médiá (`next/image`, pomery
  strán). Médiá lazy; hero s prioritou + poster.
- **Hero video** (vlajková šablóna): kompresia + dva kodeky (WebM + MP4 fallback),
  `poster` = prvý snímok (drží LCP), `autoplay muted playsinline loop`, na mobile
  ľahšia verzia alebo len poster; pri `reduced-motion` len statický poster. Nikdy
  neblokovať prvé vykreslenie videom.
- **Rozpočet:** motion nesmie zhodiť **Lighthouse < 95** ani a11y. Ak zhodí →
  prvok sa zjednoduší alebo vypustí. **Kvalita čísla > efekt.**

## Postup povinnej ľudskej revízie

Brána sa **neobíde**. Poradie:

1. **`ui-ux-designer`** — dizajn systém (`theme.css`) + rozvrh sekcií/stránok +
   motion koncept. Pred novým odvetvím **čerstvý prieskum** (učiaca sa slučka).
2. **`frontend-dev`** (implementácia sekcií) + **`sk-copywriter`** (texty do
   `content.ts`) — paralelne.
3. **`qa-a11y`** — prejde checklist vyššie, vráti zoznam nálezov. Kým sú nálezy,
   späť na krok 2. Gatekeeper pred majiteľom.
4. **Ľudská revízia (majiteľ)** — odsúhlasí **vizuál aj texty**. Bez tohto „áno"
   šablóna nie je hotová.
5. **Retrospektíva** (nižšie) — ponaučenia z revízie sa zapíšu späť.

## Retrospektíva — učiaca sa slučka (povinná po každej šablóne)

Sub-agenti neberú prvú šablónu ako zabetónovaný vzor — musia sa zlepšovať. Po
dokončení a ľudskej revízii zapíš ponaučenia **späť** do zdrojov, aby ich ďalšia
šablóna už nezopakovala:

- **Do definícií agentov** (`.claude/agents/*.md`) — konkrétne pravidlo pre rolu,
  ktorej sa ponaučenie týka (definície sú **živé súbory**).
- **Do tohto dokumentu** — nová zakázaná fráza, doplnený checklist bod, upresnené
  motion pravidlo.
- Agenti si tieto súbory čítajú na štarte práce → čo majiteľ raz vytkol, ďalšia
  šablóna nezopakuje. (Rovnaká kultúra ako ponaučenia v `docs/dennik.md`.)

**Šablóna záznamu** (kopíruj do sekcie „Retrospektívy" nižšie):

```
### Retrospektíva — <odvetvie> (<mesiac rok>)

**Čo fungovalo:** …
**Čo majiteľ vytkol pri revízii:** …
**Ponaučenia zapísané späť:**
- .claude/agents/<agent>.md — <pravidlo>
- docs/sablony-kvalita.md — <zákaz / checklist / motion>
**Čerstvý prieskum odvetvia (zdroje/trendy):** …
**Metriky:** Lighthouse P/SEO/BP/A11y = …/…/…/… ; mobil/desktop OK?
```

## Modely sub-agentov (rozhodnutie #5)

Model každej roly je **jeden riadok** v hlavičke jej `.claude/agents/*.md` —
povýšiť rolu = zmena jedného riadku, celý tím sa zlepší s trhom.

| Rola | Model | Prečo |
|---|---|---|
| `ui-ux-designer` | **Fable** | Dizajnový vkus, systém, hierarchia |
| `frontend-dev` | **Opus** | Senior architektúra + čistý kód |
| `sk-copywriter` | **Sonnet** | Textové iterácie, kontrola fráz |
| `qa-a11y` | **Sonnet** | Mechanická kontrola checklistu |

*(Build agenti = model v definícii `.claude/agents/`. Produktoví 24/7 agenti =
model v Directus `agent_config`. Nemýliť si to.)*

## Retrospektívy

> Sem pribúdajú záznamy po každej dokončenej šablóne (najnovšie navrch).

### Retrospektíva — kvetinárstvo „Boma Flora" (M2a, august 2026)

**Čo fungovalo:** Reťazec sub-agentov (ui-ux-designer → sk-copywriter →
frontend-dev → qa-a11y) dal konzistentný výsledok. Textová/dátová vrstva a
`content.ts` boli hneď na úrovni; meniny (podpisový prvok) vyšli presne; QA
zachytila reálne blokujúce chyby pred majiteľom (chatwidget, formulár bez JS,
kontrast). Dvojkolo dizajnu (návrh → náhľad → revízia majiteľa) ušetrilo veľa
prerábania — smer sa potvrdil skôr, než sa stavali sekcie.

**Čo QA vytkla (a stálo to opravu):**
1. **Globálny komponent hlavného webu presakoval do šablóny.** `ChatWidget`
   z koreňového `app/layout.tsx` sa montoval aj na `/ukazky/*` — cudzia identita
   + prekrytie obsahu. Lekcia: šablóna beží vnútri hlavnej appky, takže **globálne
   prvky z root layoutu (widgety, bannery) do nej presakujú** — treba ich na
   `/ukazky/*` vypnúť.
2. **Deklarovaný kontrast ≠ overený kontrast.** Dizajn tvrdil „AA overené", no
   `clay-400` sa reálne použil ako malý text na tmavej (3.8:1) — pričom komentár
   v `theme.css` to sám zakazoval. Lekcia: kontrast sa overuje na **reálnom
   použití tokenu**, nie na deklarácii.
3. **Suspense/`useSearchParams` fallback na SSG stránke zmizne bez JS.** Formulár
   sa stratil v statickom HTML. Lekcia: podstatný obsah nikdy negatovať cez
   `useSearchParams`/`Suspense` na staticky prerendrovanej stránke — progresívne
   vylepšenie.
4. **„Data-driven" platí aj pre sekčné hlavičky.** Eyebrow/nadpis boli natvrdo
   v JSX. Lekcia: do `content.ts` patria aj mikrotexty sekcií, nielen hlavné bloky.

**Ponaučenia zapísané späť:**
- `.claude/agents/frontend-dev.md` — globálne prvky root layoutu vypni na
  `/ukazky/*`; nič podstatné negatovať cez Suspense/`useSearchParams` na SSG;
  do `content.ts` patria aj sekčné eyebrow/nadpisy.
- `.claude/agents/ui-ux-designer.md` — pri deklarácii kontrastu over pomer na
  **reálnom** páre token×podklad podľa skutočného použitia (nie „od oka").
- `.claude/agents/qa-a11y.md` — explicitne kontroluj presakovanie globálnych
  komponentov do `/ukazky/*` a správanie kľúčových prvkov **bez JS**.
- `docs/sablony-kvalita.md` (tu) — checklist doplnený nižšie (viď hviezdičky).

**Obrázky (otvorený bod, nie chyba):** reálne fotky sa v cloud sedení nedali
spoľahlivo stiahnuť → dočasný palete verný SVG placeholder systém (správne
pomery, alt, bez CLS). Lekcia: **obrázky planuj ako samostatný krok** (kurátorský
stock so súhlasom majiteľa alebo jeho vlastné) — layout musí byť odolný, aby ich
prijal cez `next/image` bez prerábky. To sa podarilo.

**Metriky:** `npm run lint` + `npm run build` čisté; 11 stránok, všetky `noindex`;
0 horizontálny scroll na 375/768/1280 px; meniny presné (rod, `<time>`, bez CLS);
0 zakázaných AI fráz. Lighthouse: neмeraný v sedení (CLI chýba) — domerať pred
finálnym „hotovo"/spustením u klienta.

**Doplnené do checklistu (z tejto šablóny):**
- ☆ Over, že **globálne prvky root layoutu** (chat/bannery) nepresakujú do
  `/ukazky/*` (na demo vetve majú byť vypnuté).
- ☆ Kľúčové interaktívne prvky (formuláre) musia byť v HTML **aj bez JS** (žiadny
  Suspense/`useSearchParams` gating podstatného obsahu na SSG).
- ☆ Kontrast over na **reálnom** použití tokenu, nie na deklarácii v dokumente.
- ☆ Do `content.ts` patria aj **sekčné hlavičky** (eyebrow + nadpis), nielen hlavné bloky.
