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
> Zatiaľ žiadne — prvá pribudne po vlajkovej šablóne (M2).
