# Denník projektu

> Čo sa kedy urobilo, čo sa pokazilo a ako sa to vyriešilo.
> Nové záznamy pridávajte navrch.

## Backlog — nevyriešené úlohy, zadania a doplnky (živý zoznam)

> **Jediné miesto pravdy pre otvorené drobnosti a doplnky.** Dopĺňať/škrtať
> priebežne. Väčšie veci majú vlastný záznam nižšie. Súvisí s „Pred-Google
> checklistom" (viď GO-LIVE nižšie) — cieľ je **profesionálna úroveň SEO/GEO**,
> **agent, ktorý sa dá zlepšovať**, a **web pripravený na spustenie do Googlu**.
> Poradie v zozname ≠ priorita; väčšie fázy sa riešia podľa roadmapy (`vizia.md`).

**🔴 Gatuje spustenie do Googlu (Pred-Google checklist):**

- [ ] 🍪 **Cookie lišta + zásady ochrany osobných údajov** (GDPR — web zbiera leady
  cez formuláre). Bez toho web nesmieme spustiť do Googlu.
- [x] 📄 **Stránkovanie blogu** — 6 článkov na stránku + „ďalšie" (`/blog`). *(hotové)*
- [ ] 🎨 **Doladenie dizajnu** — priebežné vizuálne vylepšenia na expertnú úroveň.
- [ ] 🔎 **Spustenie:** `SITE_INDEXABLE=true` (Railway) + Google Search Console (`www`)
  — až po odškrtnutí bodov vyššie.

**🟡 Agent / orchestrátor (kvalita obsahu):**

- [ ] **Rôznorodejšie úvody článkov** — Writer často začína rovnakým vzorcom
  („Predstavte si, je piatok večer…"). Doladiť `system_prompt` (Directus) +
  príp. základný prompt v `wp_writer_agent.py`, nech úvody striedajú formu.
- [ ] **Jednoduchšie obrázky** — časť generovaných obrázkov je na naše témy
  príliš zložitá. Obmedziť/spresniť obrázkový prompt (jednoduchší, čistejší motív).
- [ ] **Alt texty generovaných obrázkov** — agent ich pri in-článkových obrázkoch
  už niekedy nastavuje; dotiahnuť **konzistenciu a kvalitu** (popisný alt vždy).

**🟡 Frontend:**

- [ ] **Responzivita (mobil)** — pár detailov na doladenie (doplniť konkrétne
  po prehliadke na mobile).
- [ ] **Interné odkazy v tele článku** po migrácii `www→wp` ukazujú na `wp.` —
  prelinkovať na `/blog/...` (samostatná téma, netýka sa obrázkov).

**🟡 RAG chatbot — doladiť (prvé demo je hrubá verzia, funguje):**

- [ ] **Výstup/štýl odpovedí** — dĺžka, tón, formátovanie, koľko zdrojov ukazovať.
- [ ] **Krok 5 — config v Directuse** — presunúť nastavenia chatbota (model,
  system prompt/osobnosť, počet kúskov `k`) do `agent_config` (riadok `chatbot`),
  aby sa dali meniť klikaním bez zásahu do kódu; logy chatov do `agent_logs`;
  vlastný token s minimálnymi právami (teraz frontend číta DB priamo).
- [ ] **Kvalita obsahu, z ktorého čerpá** — revízia/úprava existujúcich článkov
  (viac o „našich" riešeniach, menej odkazov na cudzie nástroje — viď nižšie).
- [ ] **Hlas (fáza 2)** — browser Web Speech (zadarmo, slabšia SK) vs platený TTS
  (detaily `docs/rag-chatbot.md` §9).
- [ ] **Optimalizácia** — frontend na vnútornú DB adresu (teraz verejná kvôli
  jednoduchosti); prípadne instantné doindexovanie cez WP webhook (dnes 3×/týždeň
  v pipeline — `docs/rag-cron.md` Cesta B).

**🟡 Rezervačný agent — ďalšie kroky (R1 hotový naživo; pokračovať po rozšírení služieb):**

- [ ] **Rozšíriť `booking_services`** na 2–3 reálne konzultačné typy (my sme
  agentúra → rezervuje sa konzultácia). Návrh: „Bezplatná úvodná konzultácia
  30 min", „Technický audit / hlbšia konzultácia 60 min", „Online demo
  automatizácií 30 min". Klik v Directuse (`booking_services`), žiadny kód.
  *(Fiktívne odvetvové služby — kaderníctvo/autoservis — patria až do demo u
  klienta = Krok R4 replikácia.)*
- [ ] **Krok R2 — chatbot rezervuje v konverzácii** (prompt v `plan-agenti.md`).
  Rozšíriť `/api/chat` o Gemini function calling `najdi_sloty` +
  `vytvor_rezervaciu`, volajúce ten istý `lib/booking.ts`/`booking-data.ts`
  (žiadna duplicita). Tok: služba+čas → ponúkne termíny → po výslovnom potvrdení
  rezervuje → e-mail+lead. Osobnosť z `agent_config`. Bezpečnosť: iba čítať sloty
  + vytvoriť rezerváciu. **Robiť až po rozšírení služieb** (nech má bot čo ponúkať).
- [ ] **Zrušovací link v potvrdzovacom e-maile** (`status=cancelled`) — R1 „na
  hrubo" ho zatiaľ nemá (návrh z `plan-agenti.md` otvorených drobností).
- [ ] **Krok R3 — pripomienky** (orchestrátor cron, deň vopred) a **R4 —
  replikácia u klienta** (viď `plan-agenti.md`).

**🟣 Dedikované produktové podstránky (dotiahnuť, keď rozširujeme služby):**

- [ ] **Produktové stránky pre jednotlivé služby** — dnes karty v sekcii Služby
  len odkazujú (napr. `/rezervacia` = demo), ale chýba predajná podstránka typu
  „Rezervačný systém pre vašu firmu" (čo to vie, pre koho, ceny/kontakt).
  Podobne chatbot nemá vlastnú predajnú podstránku. Doplniť pri spúšťaní webu
  do Googlu, nech má každá služba „kam odkázať". *(Súvisí s `vizia.md` §8 —
  párovanie agent ↔ Woo služba.)*
- [ ] **Chýbajúci agenti z vízie (§3)** — e-mail auto-odpoveď agent, mockup/náhľad
  agent (frontend agent, §9) — zatiaľ len plán, ani karta ani demo.

**🟣 Väčšie iniciatívy (roadmap — detail vo `vizia.md` §8–11):**

- [x] **RAG chatbot naživo na našom webe (prvé demo)** — ✅ NASADENÝ a funguje
  (odpovedá z nášho obsahu + cituje zdroje). Cesta B (bez pgvectora — vektor `real[]`,
  kosínus v pamäti). Detaily nižšie „RAG chatbot — DOKONČENÉ (prvé demo)".
- [ ] **Vlastné „krabicové" riešenia (produktová línia) + demo agenti** — namiesto
  odkazovania na cudzie nástroje mať **vlastné hotové moduly**, ktoré vieme nasadiť
  klientovi a zároveň ukázať ako živé demo na našom webe. Prví kandidáti:
  - **Rezervácie / objednávky** (kalendár, potvrdenia, SMS/e-mail pripomienky),
  - **Dohadovanie schôdzok / stretnutí** (ponuka termínov, potvrdenie, pripomienky),
  - **Zápis poznámok zo stretnutí** (prepis → zhrnutie → úlohy/ďalšie kroky),
  - chatbot/zák. podpora (✅ prvé demo hotové), e-mail auto-odpoveď.
  Rovnaký „lego" vzor (config v Directuse, modul v orchestrátore, logy).
- [ ] **Obsahová stratégia blogu = predávať NAŠE riešenia** — články majú ukazovať
  a viesť k **našim krabicovým riešeniam** (rezervácie, schôdzky, poznámky…), nie
  len opisovať cudzie nástroje. Doladiť Writer `system_prompt`, nech spomína naše
  moduly ako hotové riešenie a smeruje na kontakt/demo.
- [ ] **Woo služby napárované na agentov** — reálne produkty vo WooCommerce
  (embednutý checkout, Store API), aby bolo vidieť headless WP ↔ frontend naostro.
- [ ] **Frontend „mockup" agent** — z promptu podľa biznisu/biznis plánu klienta
  vygeneruje náhľad webu; hotové ukážky do portfólia (predajný nástroj).
- [x] 🎨 **Redizajn webu → svetlejší štýl à la apertia.ai** — hotový (zmiešaný
  layout: tmavý hero + blog + pätička, svetlý stred; svetlé články). *(viď záznam nižšie)*
- [x] **Stránka „Čo je headless WordPress" + kalkulačka úspory za pluginy** —
  hotová na `/headless-wordpress` (bez cenníka, CSS grafika).
- [x] ⚠️ **Dizajnové referencie** — apertia screenshoty dodal používateľ; vlastná
  landing je v repe (`docs/index.html`).

**🟢 Doplnky / neskôr (nie sú blokery):**

- [ ] Podstránky služieb `/sluzby/[slug]`.
- [ ] Fotka tímu (`frontend/public/team.jpg` + `components/about.tsx`).
- [ ] Reálny telefón v pätičke.
- [ ] Vlastná obmedzená rola pre orchestrátor token (teraz admin) — least privilege.
- [ ] Maskot značky (fialový robot) + jemné efekty na článkových obrázkoch (viď
  „Nápady na neskôr" nižšie, Cesta A/C).
- [ ] SEO+GEO agent v2 — automatické prelinkovanie + HowTo schéma (viď roadmapa nižšie).
- [ ] **Zvážiť SessionStart hook** — aby nové sedenie **automaticky (tvrdo)** načítalo
  `docs/dennik.md` + `docs/vizia.md`, nie len cez „mäkký" pokyn v `CLAUDE.md`.
  (Claude Code skill `session-start-hook`; nastavuje sa v `.claude/settings.json`.)

**✅ Nedávno vyriešené (pre kontext):**

- [x] **Obrázky článkov po migrácii `www→wp`** — zobrazujú sa v tele článku aj
  v náhľadoch, všade bez `wp.` prefixu. *(vyriešené)*
- [x] Náhľady preberajú `alt` z WP (fallback názov článku).

## Aug 2026 — Vylepšenia agentov (Writer/chatbot/revízny) + Obsah článku (TOC) ✅ (zlúčené #44/#45/#46)

Sedenie, ktoré začalo ako **strategická porada** a prešlo do realizácie (ponaučenie
nižšie). Všetko **zlúčené do `main` a nasadené.** Návody a príkazy k agentom: `navody.md`.

**Agenti (orchestrátor):**
- **Writer** (`wp_writer_agent.py`, `article_prompt`): vedie k NAŠIM riešeniam ako
  prínosu (nie k cudzím nástrojom), CTA na konzultáciu; obmieňa úvod aj príklady/odvetvia;
  **pamäť na už napísané články** (`fetch_recent_titles` → do promptu „tieto neopakuj");
  FABLE (žiadne vymyslené čísla/ceny). Persona (`system_prompt`) + `topics` sú v Directuse
  (majiteľ doplnil).
- **RAG chatbot**: `SYSTEM_PROMPT` v `lib/rag.ts` prepísaný podľa **FABLE** (pravda nad
  plynulosťou, len z kontextu, nevymýšľať, pri neistote → kontakt). Index (`rag_index.py`)
  rozšírený o **„výkladnú skriňu"** — nový zdroj z `content.ts` (heroBullets + steps) →
  chatbot vie odpovedať aj o našich službách. **Aktivuje sa až po behu `python rag_index.py`.**
- **Revízny agent** (nový `revise_article.py`): prečíta publikovaný článok, prepíše na naše
  riešenia (zachová obrázky/tému, FABLE), uloží ako **koncept „[REVÍZIA]"**. Originál nemení.
  `--dry-run` na náhľad.

**Frontend:**
- Blog **„Obsah článku" (TOC)** — `lib/toc.ts` (serverovo doplní `id` do H2/H3, dekóduje
  entity, odstráni vodiace číslovanie) + `components/table-of-contents.tsx` (natívne
  `<details>` = rozbaliteľné bez JS, scrollovateľné, H2/H3 hierarchia s pomlčkovým markerom).
  Kotvové odkazy = signál pre Google „jump to" sitelinks. `data-scroll-behavior="smooth"`
  na `<html>` (Next 16), `scroll-margin-top`, reduced-motion.

**Docs:** výstup strategickej porady + „Ponaučenia z podkladov" (berieme: FABLE, OKF,
Playground, kokpit; zamietnuté: auto-generovanie webov, Wayland ako runtime, Vertex/Vercel,
programatické SEO) v `plan-agenti.md`.

**Otvorené (akcie/rozhodnutia — nie merge):**
- [ ] **Spustiť `python rag_index.py`** — aby chatbot reálne poznal služby (zatiaľ nebeží).
- Vetva `podklady` = 6 brainstorm dokumentov (referencia).
- Strategické (samostatné budúce sedenia): go-live do Googla (cookie/GDPR), kokpit, prvý platiaci klient.

**PONAUČENIE (dôležité):** toto sedenie **zmiešalo poradu, plánovanie, kódovanie, dizajn aj
git pomoc** a extrémne sa natiahlo — presne to, čomu má `ako-viest-sedenia.md` brániť. Odteraz:
**1 typ na sedenie** (porada/plán · kód · dizajn · agenti — zvlášť), **1 úloha → dokončiť →
zavrieť**, Claude **upozorní** na rozbiehanie, vždy presné príkazy do terminálu, žiadny zhon.
Zapísané do `ako-viest-sedenia.md` („Tvrdé pravidlá").

**Čo nás konkrétne zdržalo (vyhnúť sa nabudúce):**
- **Naháňanie lokálneho náhľadu blogu**, ktorý ťahá obsah z WordPressu — lokálne
  nebol WP prístup (`.env.local`) → 404, plus stará Turbopack cache. Míňali sme
  čas na local, hoci build bol zelený a web je aj tak skrytý pred Googlom.
  → **Poučenie:** na vizuálnu kontrolu blogu (ťahá WP) nejsť cez local bez WP env;
  keď je build zelený, rovno merge a pozri na živom webe.
- **Prehnané hedgeovanie a zdvojené otázky** (opakované „počkaj ~2 min", pýtanie
  sa na to isté). → **Poučenie:** byť rozhodný, nepýtať sa dvakrát.
- **Placeholder `<ID>` v príkaze** spôsobil bash chybu; `git` z podpriečinka dal
  `orchestrator/orchestrator`. → **Poučenie:** presné príkazy, `git -C <cesta>`,
  placeholdery vždy vysvetliť, čím ich nahradiť.
- **Neupozornil som na rozbiehanie sedenia** včas (porada sa preklopila do kódu).
  → **Poučenie:** Claude aktívne stráži rozsah (pravidlo 3 v `ako-viest-sedenia`).
- **Dizajn agent (Fable) spadol na chýbajúce kredity** — fallback na Opus.
  → **Poučenie:** pri dizajn agentovi vopred rátať s kreditmi/modelom.

## Aug 2026 — Frontend agent M2b: Boma Flora — reálne fotky, QA opravy, polish (Emil skilly), doladenia ✅ (vetva, NEzlúčené)

**Vetva `claude/m1-frontend-agent-templates-94ksdt` (stále NEzlúčené do `main`).**
Dlhé realizačné sedenie — z M2a kostry spravená kompletná, vyladená šablóna.

**Reálne fotky na celej šablóne (AI cez Kling, po jednej):**
- Tok kvôli egressu: používateľ generuje v **kling.ai** (režim Image, Nano Banana 2),
  pošle fotku do chatu, ja ju **vyberiem z transkriptu (base64 v JSONL)** a zapojím.
  Kling/OSM CDN je za proxy blokovaný (403) — priamo stiahnuť sa nedá.
- Zapojené: Svadby (sub-hero, proces, 3 realizácie), Ateliér (Barbora=sub-hero+tím1,
  Denisa, Tomáš, stôl, chladnička, pult), Blog (dálie, svadba, tri chyby=tulipány,
  bez peny=ruky), Obchod (kytica dňa, na mieru, predplatné, poukaz), Kontakt (statická
  mapa = screenshot Google Máp). Média vrstva `images/media.ts` + `Foto` slot, `LICENSES.md`
  aktualizované (všetko Kling, komerčné; všetky sloty vyplnené). Fotky webp 33–86 KB.
- Hero scroll-video (návrh 1) ponechaný; kytica posunutá **doprava do stredu**
  (`translateX(12%) scale(1.08)` na poster+videu, ľavý okraj kryje scrim).

**Brand / texty:**
- Hero H1: „**Ručne viazané kytice pre Radosť a Váš deň**" (nahradilo „…nie katalógom").
- Tmavé plochy (footer, night pásy, teaser, predplatné) → nový token `--color-flora-night`
  **#24362a** (zelenšia). Hodnotu som **odmeral z pixelov referenčného screenshotu**
  používateľa (PIL) — presné trafenie namiesto hádania.
- Svadby krok 01: „ozveme sa ihneď" (zosúladené s budúcim agentom).

**QA audit (subagent `qa-a11y`) → nájdené a opravené (ja som každý nález overil voči kódu + screenshotom):**
- 🔴 **BLOCKER**: hero na Domove sa na tablete/dotyku/`reduced-motion` **zrútil na výšku 0**
  (statická vetva: deti `sm:absolute inset-0`, sekcia bez výšky) → `sm:min-h-[100svh]`.
- **Hero max-w**: `max-w-[19/22ch]` obopínal celý `HeroCopy` (aj perex+CTA) → presunuté len
  na `<h1>`, obal `max-w-[32rem]` (CTA vedľa seba).
- **Blog detail**: natvrdo `FloraFigure` → napojené `Foto`/`blogFotky`.
- **Rytmus mriežok**: 3-kartové sekcie na tablete mali orphan (`sm:grid-cols-2 lg:grid-cols-3`
  pri 3 kartách) → `sm:grid-cols-3`.
- **Nav/pätička**: dotykové ciele `min-h-[44px]`.
- **Blog featured obrázok pretekal cez text** na širokých monitoroch (`lg:h-full` + `aspectRatio`
  vypočítalo prehnanú šírku) → odstránený `lg:h-full`.
- **Manifest** na Domove sa lámal „na výšku" (`max-w-[24ch]` na **obale**, `ch` pri base fonte
  ≈ 214 px) → presun na `<p>` (ch pri nadpisovom fonte).

**Sémantika 100 %:** overená (skip-link, `header/main/footer`, `nav` s `aria-label`, 1×`h1`/stránka,
`article/aside/figure/address/time`). Doplnené `<time dateTime>` a `<article>` na blog + `datumISO`.

**Adopcia externých skillov (Emil Kowalski, MIT) — vkus + motion:**
- Do `.claude/skills/` prevzaté `emil-design-eng`, `animate` (+RECIPES), `review-animations`
  (+STANDARDS). Napojené: `frontend-dev` (stavba/motion), `qa-a11y` + `docs/sablony-kvalita.md`
  (revízia). Atribúcia v `.claude/skills/VENDORED.md`. `review-animations` má
  `disable-model-invocation` → len na `/review-animations` (človek).
- `ui-ux-pro-max-skill` (nextlevelbuilder, MIT) NEprevzatý — pripomienka pri **novej šablóne**
  je v `ui-ux-designer.md` + backlog (veľký, výberovo).

**Polish/motion pass (test skillov na reálnom kóde):**
- Tlačidlá: `active:scale-[0.97]` + `ease-flora`. Nadpisy kariet: plynulý `transition-colors`
  (predtým skok). Blog karty: jemný `hoverZoom` (scale 1.02, `motion-reduce` guard). Ease token
  zapojený všade.
- Zistenie: `--ease-flora` token aj `:focus-visible` **už v `theme.css` existovali** (2 z 3
  nálezov splnené) — overenie voči kódu sa vyplatilo. Tailwind v4 dáva `scale-*` do vlastnosti
  **`scale`**, nie `transform` (`transition-transform` ju v4 pokrýva).

**Doladenia na požiadanie:**
- **Kroky** (Ako to prebieha): stĺpce podľa počtu (3→3, 4→4, žiadny prázdny stĺpec), väčší rozostup,
  **animované šípky** medzi krokmi (`@keyframes flora-sipka`, len `lg`, `reduced-motion` gate).
- **Meniny**: dnešný deň zvýraznený — chip v páse, celý dnešný riadok v týždennom bloku (clay-100).

**Nové/aktualizované docs:** `ako-viest-sedenia.md` (konvencia delenia sedení — 1 sedenie = 1 cieľ),
`prikazy.md` (lokálny náhľad + mobil cez Network IP, `cd` vs `git checkout`), `plan-agenti.md`
(backlog: flower-bar konfigurátor, adopcia skillov, napojiteľnosť šablóny — obchod→Woo, headless WP,
článkový agent, chatbot), `sablony-kvalita.md`, `LICENSES.md`, `VENDORED.md`.

**Ponaučenia:**
- **Over voči reálnemu kódu, nie od oka** — grep komponentov minul globálne pravidlá v `theme.css`
  (`ease-flora`, `:focus-visible`). Emilova zásada „review your work".
- **Tailwind v4**: `scale/translate/rotate` sú samostatné CSS vlastnosti (nie `transform`).
- **Lokálny náhľad na mobile**: `Network` URL (`http://<IP>:3000/ukazky/kvetinarstvo`) na rovnakej
  WiFi; v bežnom Chrome zavadzia **service worker/cache produkčného webu** → **inkognito** to obíde.
- **Zdieľané komponenty** (Kroky, Foto): úpravy musia zvládnuť viac počtov/kontextov (3 aj 4 kroky).

**Stav na konci:** šablóna kompletná a vyladená (reálne fotky, QA opravy, sémantika, motion/polish).
NEzlúčené do `main`. **Publikovanie = merge do `main`** (Railway → `digitalnapomoc.sk/ukazky/kvetinarstvo`,
`noindex`, ukážka na odkaz) — až na výslovný súhlas majiteľa.

**Ďalší krok:** finálny `qa-a11y` gate + rozhodnutie o merge; potom M3 (rezervačný/objednávkový modul),
M4 (`site-customizer` + `ui-ux-pro-max`), Fáza 3/4 (agent worker, WooCommerce) — v samostatných sedeniach.

**Bezpečnostná revízia šablóny + API (na požiadanie „aby boli všetky dvierka zavreté"):**
- **Žiadny dátový bordel v DB** — potvrdené. Šablóna je **bezstavová**: texty v `content.ts`,
  fotky v `images/media.ts`, tokeny v `theme.css`. Nič sa neukladá do žiadnej databázy
  (na rozdiel od WP, kde šablóny/nastavenia zaneriadia `wp_options`/`postmeta`). Prispôsobenie
  klienta = zmena dát v súboroch, nie zápis do DB.
- **Útočná plocha šablóny — čistá.** Žiadny `eval`/`child_process`, žiadne tajomstvá v klientskom
  kóde (všetky tokeny sú server-only cez env). Externá mapa má `rel="noopener noreferrer"`. Dve
  `dangerouslySetInnerHTML` sú mimo šablóny (WP `contentHtml` na hlavnom blogu + `json-ld`) — WP obsah
  je náš dôveryhodný zdroj, JSON-LD je serializovaný objekt.
- **API „dvierka" — dobre zamknuté.** `/api/lead`, `/api/chat`, `/api/booking/create` majú honeypot
  `website`, rate limit na IP a validáciu vstupov; `/api/revalidate` má tajný kľúč. Directus ide cez
  REST s parametrami (žiadny surový SQL → žiadna SQL injection), RAG dáva otázku len ako float-embedding,
  do promptu nie do SQL. Tokeny majú **least-privilege** práva.
- **Spevnené (tento commit):** dĺžkové stropy na `booking/create` (name/phone/note 200/40/2000 — ako
  `/api/lead`) a na `/api/chat` histórii (max 6 správ × 1000 znakov + validácia `role`) — obrana proti
  zneužitiu nákladov na LLM a zaťaženiu DB/e-mailov.
- **Zostáva (low severity, vedomé):** `x-forwarded-for` sa dá teoreticky sfalšovať (rate limit obíditeľný,
  ale tlmí ho honeypot + least-privilege token); `/api/revalidate` porovnáva tajný kľúč nekonštantne v čase
  (timing útok nepraktický cez sieť). Info: pri M4 customizeri validovať `http(s)` sociálne URL.

## Aug 2026 — Frontend agent M2a: vlajková šablóna KVETINÁRSTVO „Boma Flora" ✅ (vetva, NEzlúčené)

**Míľnik M2a hotový na vetve `claude/m1-frontend-agent-templates-94ksdt`** (M1 už
zlúčený v `main`; M2 stavia naň). Postavená prvá odvetvová šablóna — statická
špičková úroveň, viacstránkový web. **Ešte NEzlúčené, nič nasadené.** Prvý raz
sme naostro použili celý tím **sub-agentov** cez `Agent` tool.

**Ako to prebehlo (reťazec agentov + ľudské brány):**
1. **`ui-ux-designer` (Fable)** → dizajn systém `theme.css` (scoped `flora-*`
   tokeny, paleta s WCAG AA, Fraunces+Figtree) + `DESIGN.md` (mapa stránok, motion,
   hero video koncept). → **náhľad + revízia majiteľa** (2 kolá: pôvodný smer →
   zmeny: Boma Flora/Trenčín, smútočné kytice, meniny, blog, obchod, preč „botanický
   editorial").
2. **`sk-copywriter` (Sonnet)** → reálne SK texty a dáta do `content.ts` (7 stránok,
   demo blog články, typy), proti zoznamu zakázaných AI fráz.
3. **`frontend-dev` (Opus)** → celý balík `templates/kvetinarstvo/`: 7 stránok +
   detail blogu, viacstránkové routovanie (optional catch-all
   `app/ukazky/[odvetvie]/[[...page]]`), fonty (next/font), meniny modul (SK tabuľka
   mien s rodom, Europe/Bratislava), Tailwind wiring (flora `@theme` cez `@import`
   v `globals.css`), `base.ts` pre lift.
4. **`qa-a11y` (Sonnet)** → brána kvality: našla **3 blokujúce** nálezy → opravené.
5. **Náhľad screenshotov pre majiteľa** (artefakt) → čaká sa na finálnu revíziu.

**QA blokujúce nálezy (opravené) — a ponaučenia (zapísané späť do
`.claude/agents/*.md` + `docs/sablony-kvalita.md`, retrospektíva tamže):**
- **Globálny `ChatWidget` presakoval do dema** (cudzia identita, prekrytie obsahu)
  → vypnutý na `/ukazky/*` (`usePathname`). *Lekcia: root-layout globály presakujú
  do šablón.*
- **Formulár zmizol bez JS** (Suspense/`useSearchParams` fallback na SSG) →
  progresívne vylepšenie. *Lekcia: nič podstatné negatovať cez Suspense na SSG.*
- **Kontrast `clay-400` na tmavej padal** (3.8:1, hoci dizajn tvrdil „AA overené")
  → `clay-200`. *Lekcia: kontrast over na reálnom použití tokenu.*
- +drobné: sekčné hlavičky do `content.ts` (data-driven), `autocomplete`, galéria 4:5.

**Overené v sedení (sám, nie len agentom):** `npm run lint` + `npm run build` čisté;
11 flora stránok, všetky `noindex`; produkčný `next start` + Chromium screenshoty
375/768/1280 px → **0 horizontálny scroll**, chat widget preč, 1 h1/stránku.

**Vedomý follow-up (nie chyba):** obrázky sú zatiaľ **palete verný SVG placeholder**
— reálne fotky sa v cloud sedení nedali spoľahlivo stiahnuť. Layout ich prijme cez
`next/image` bez prerábky (kurátorský stock so súhlasom / vlastné). Hero video +
motion vrstva = M2b (Higgsfield, potrebuje platenú verziu).

**Ponaučenia (proces/sedenie):**
1. **Sub-agenti sa púšťajú SEKVENČNE na tom istom balíku** (copywriter → dev),
   nie paralelne — inak si krížia súbory (`content.ts`). Paralelne len na
   disjunktných súboroch.
2. **Pozor na starý `next start` na fixnom porte** — QA agent nechal server bežať
   na 4123; môj nový `npm run start` sa nenabindoval (`EADDRINUSE`) a screenshoty
   boli zo starého buildu (pred opravou). Pred snímaním zabiť starý server + overiť.
3. **Fonty/obrázky do artefaktu = data URI** (CSP blokuje CDN); reálne Google fonty
   sa dajú stiahnuť cez `curl` a vložiť base64 (latin+latin-ext kvôli diakritike).

**Ďalší krok (čaká na rozhodnutie majiteľa):** reálne fotky → M2b (motion + hero
video) → merge M2a do `main`. Druhá šablóna (kaderníctvo) môže vzniknúť kedykoľvek
po M2 ako overenie replikovateľnosti.

## Aug 2026 — Frontend agent M1: ZÁKLAD knižnice odvetvových šablón ✅ (vetva, NEzlúčené)

**Míľnik M1 z `plan-agenti.md` („Frontend agent — knižnica odvetvových šablón")
hotový na vetve `claude/m1-frontend-agent-templates-94ksdt`** (zatiaľ NEzlúčené do
`main` → tvoj `git pull` na main to neukáže, kým to nezlúčime; medzitým
`git checkout claude/m1-frontend-agent-templates-94ksdt`). Postavený je **základ**
knižnice — infra a brána kvality, **žiadna hotová šablóna ani fiktívny obsah** (to
je až M2 — vlajkové kvetinárstvo).

**Čo pribudlo:**

- **`.claude/agents/` — štyria build sub-agenti** (krátke, ostré definície
  adaptované do nášho kontextu: Next.js 16 / Tailwind v4, slovenčina, minimalizmus,
  a11y): `ui-ux-designer` (model **Fable**), `frontend-dev` (**Opus**),
  `sk-copywriter` (**Sonnet**), `qa-a11y` (**Sonnet**) — modely podľa rozhodnutia #5.
  Každý má v definícii pokyn **čítať `docs/sablony-kvalita.md` na štarte práce**
  (učiaca sa slučka). Nie sú to generátory webov — sú to build-time „osobnosti",
  ktoré sedenie spúšťa cez `Agent` tool pri stavaní šablóny.
- **Konvencia prenosného balíka** `frontend/templates/<odvetvie>/` (theme.css so
  scoped Tailwind v4 `@theme` tokenmi s prefixom, content.ts, sections/, images/ +
  LICENSES.md, page/layout) — zdokumentované v `frontend/templates/README.md`.
  **Register** `frontend/templates/registry.ts` (jediné miesto pravdy o šablónach,
  zatiaľ prázdny) číta index aj mount.
- **Route group `app/ukazky/`** — `layout.tsx` s **tvrdým `noindex, nofollow`**
  pre celý podstrom (overené v build HTML), index `page.tsx` (prázdny stav, žiadny
  fiktívny obsah) a `[odvetvie]/page.tsx` mount (`dynamicParams=false` + prázdny
  `generateStaticParams` → neznáme cesty vracajú 404). Sitemap ani llms.txt
  `/ukazky/*` **nezaraďujú** (demo obsah nesmie do Googla).
- **`docs/sablony-kvalita.md`** — brána kvality (jediné miesto pravdy pre
  „nerozoznateľné od AI"): checklist (Lighthouse ≥ 95, WCAG AA, responzivita, čistý
  kód, žiadne lorem/TODO), **zoznam zakázaných generických AI fráz**, motion
  mantinely (Framer Motion, len transform/opacity, reduced-motion fallback…),
  postup povinnej ľudskej revízie a **šablóna RETROSPEKTÍVY** (ponaučenia sa
  zapisujú späť do definícií agentov aj do tohto dokumentu).
- **Kostra skillu** `.claude/skills/site-customizer/SKILL.md` — runbook (vyber
  šablónu → vstupy klienta → content.ts + theme.css → zapoj modul → brána kvality
  → lift). **Zatiaľ bez behu** (plný beh je M4).

**Overené v sedení:** `npm run lint` čistý; `npm run build` prešiel (17/17 static
pages; `/ukazky` static, `/ukazky/[odvetvie]` SSG bez vygenerovaných ciest → 404).
`noindex, nofollow` potvrdené v `/ukazky` HTML. **Nič nedeployované.**

**Ponaučenia:**

1. **`node_modules` v cloud sedení nie je predinštalované** — pred lint/build a
   pred čítaním `frontend/node_modules/next/dist/docs/` (povinné podľa
   `frontend/AGENTS.md`) treba spustiť `npm ci` vo `frontend/`.
2. **„Route group" tu = bežný segment `ukazky/` so zdieľaným `layout.tsx`**, nie
   Next.js zátvorková `(skupina)`. URL má byť `/ukazky/[odvetvie]`, takže segment
   ostáva v ceste; noindex sa dedí cez `metadata` v `layout.tsx`.
3. **Prázdny `[odvetvie]` mount čisto:** `generateStaticParams` z registra
   (prázdny) + `dynamicParams=false` → build nič nevygeneruje a všetky cesty 404,
   bez mŕtveho kódu. Šablóna sa v M2 pridá jedným záznamom do registra.
4. **`params` je `Promise`** (Next 16) — držať vzor existujúcich routes
   (`type Props = { params: Promise<{…}> }`, `await params`).

**Klik-časti:** žiadne (M1 je len kód/docs). Directus riadok `agent_config.site_builder`
+ token sú až M4 (po súhlase).

**Ďalší krok:** M2 — vlajková šablóna **kvetinárstvo** (M2a statická špička →
M2b motion vrstva), stavaná so sub-agentmi cez bránu kvality + ľudská revízia.

## Aug 2026 — Rezervačný agent R1 SPUSTENÝ NAŽIVO ✅ + ponaučenie SMTP→Resend

**Rezervačný agent R1 beží naostro na `www.digitalnapomoc.sk/rezervacia`.** Celý
reťazec overený naživo: widget → rezervácia (`bookings`) → lead (`client_leads`)
→ **dva e-maily** (potvrdenie zákazníkovi + notifikácia prevádzke na
`info@digitalnapomoc.sk`, s Reply-To na zákazníka). PR #34 (engine/widget) aj
PR #35 (opravy) zlúčené do `main`.

**⚠️ Kľúčové ponaučenie — hosting SMTP NEFUNGUJE z Railway → e-maily cez Resend:**

- **Hostcreators SMTP (`smtp.hostcreators.sk`, 465 aj 587) sa z Railway nedá
  použiť** — spojenie končí `ETIMEDOUT` / `command: 'CONN'` (blokovanie cudzích /
  dátacentrových IP na úrovni firewallu). Overené na oboch portoch; v admine
  schránky sa to nedá prepnúť (schránkové nastavenia neovplyvnia firewall).
  DNS sa preloží správne, len TCP spojenie na SMTP port neprejde.
- **Príčina platí všeobecne pre headless architektúru:** frontend beží *inde*
  (Railway) než pošta (hosting), takže narazíme na obmedzenie „SMTP len z
  vlastnej infra". **Toto čakaj u KAŽDÉHO klienta s hostingovým SMTP.**
- **Riešenie = Resend** (posiela cez **HTTPS/443**, žiadne SMTP porty → nič sa
  neblokuje). Kód sme mali pripravený — `lib/email.ts` má vymeniteľného
  poskytovateľa, prechod bol iba **zmena env** (`EMAIL_PROVIDER=resend` +
  `RESEND_API_KEY`), žiadny prepis.
- **Doména overená bez zásahu do existujúcej pošty:** Resend dáva SPF/MX na
  **subdoménu `send.digitalnapomoc.sk`** + DKIM `resend._domainkey` → **žiadny
  konflikt** s root SPF (`…include:_spf.hostcreators.sk -all`) ani DMARC
  (`p=none`). DKIM `d=digitalnapomoc.sk` a_zarovná s From `rezervacie@…` →
  DMARC prejde. Doručené do Gmailu bez problémov.

**Ponaučenia (klik-časť Resend):**

1. **Resend UI v slovenčine mrší typy DNS záznamov** — auto-preklad ukázal
   `TXT`→„SMS", `MX`→„Mexiko". **Prepni Resend do angličtiny**, nech vidíš
   správne typy.
2. **hostcreators DNS pole „Host" je relatívne** — panel sám dopĺňa
   `.digitalnapomoc.sk`, takže zadávaš len `resend._domainkey` / `send`.
   Oranžové upozornenie „dorob A záznam" **ignoruj** — DKIM/SPF/MX subdomény
   web nezobrazujú, A záznam netreba. Konkrétny záznam aj tak prebije wildcard.
3. **Overenie bolo rýchle** (~pár minút po pridaní záznamov). Resend →
   **Emails/Logs** ukazuje status (Sent/Delivered) — dobrý dashboard.

**Live env (Railway frontend):** `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`,
`BOOKING_FROM_EMAIL=rezervacie@digitalnapomoc.sk`,
`BUSINESS_NOTIFY_EMAIL=info@digitalnapomoc.sk`. SMTP_* premenné ostali, ale sú
nepoužité (obíde ich `EMAIL_PROVIDER=resend`).

**Ďalší krok:** Krok R2 — konverzačný chatbot (rezervácia priamo v chate,
`/api/chat` + Gemini function calling nad tým istým `lib/booking.ts`).

## Aug 2026 — Rezervačný agent, Krok R1: engine + widget + e-mail ✅ (kód, zlúčené PR #34/#35)

**Kód zlúčený do `main`** (PR #34 engine/widget/e-mail, PR #35 opravy).
Prvé živé demo rezervačného agenta — engine, API, widget `/rezervacia`, e-maily.
Klik-časť (e-mail poskytovateľ + env na Railway) je v `docs/booking-r1-klik-navod.md`
(reálne spustené cez **Resend**, viď záznam vyššie).

**Čo pribudlo (`frontend/`):**

- **`lib/booking.ts`** — čistý engine bez I/O: `computeFreeSlots(...)` z dostupnosti,
  rezervácií a blackoutov spočíta voľné začiatky slotov. Krok `slot_step_min`,
  blok `duration_min + buffer_min`, filter minulosti + predstih (`minLeadMin`).
  **Časové pásmo:** otváracie hodiny sú nástenný čas Europe/Bratislava → prevod
  na UTC instant (dvojpriechodová korekcia, zvláda letný/zimný čas). `slotEndIso`.
- **`lib/booking.test.ts`** — 10 unit testov (Node natívny runner, **bez novej
  závislosti** — `npm test` = `node --test`, Node 22 stripuje typy). Pokrýva sloty,
  krok < dĺžka, buffer, prekryv s rezerváciou (aj dotyk hrany), blackout,
  minulosť/predstih, obedná prestávka (2 riadky), DST leto vs zima.
- **`lib/booking-data.ts`** — čítanie katalógu a zápis cez **Directus REST**
  (token `RESERVATION_TOKEN`, vzor `/api/lead`). `getFreeSlots`, `createReservation`
  (re-check slotu → lead → booking; konflikt z DB constraintu → „obsadené").
  Formátovanie času do Bratislavy (`formatSlotHuman`).
- **`lib/email.ts`** — **vymeniteľný poskytovateľ**: SMTP (nodemailer, default)
  hlavná cesta, **Resend** (fetch) záloha cez `EMAIL_PROVIDER=resend`. Prechod =
  zmena env, nie prepis kódu. `lib/booking-emails.ts` — SK šablóny (potvrdenie
  zákazníkovi + notifikácia prevádzke), posielané „best effort".
- **API:** `GET /api/booking/slots` (katalóg / voľné sloty) a
  `POST /api/booking/create` (validácia, honeypot `website`, rate limit 5/10 min
  na IP — vzor `/api/lead`; re-check pred zápisom; 409 pri obsadenom termíne).
- **Widget:** `app/rezervacia/page.tsx` + `components/booking-widget.tsx` —
  tok služba → deň → termíny → kontakt → potvrdenie; svetlý dizajn webu,
  prístupný (fieldset/legend, `aria-pressed`, `aria-live`), mobil. Prepojené zo
  sekcie **Služby** (karta „Rezervácie a objednávky") + v `sitemap.xml`.

**Nová závislosť:** `nodemailer` (+ `@types/nodemailer`) — jediná; SMTP je
štandardná čistá knižnica, importuje sa dynamicky (mimo edge bundle). Zvyšok
`fetch`/`Intl`/`pg` už bol. Testy **bez** frameworku (Node runner).

**Overené v sedení:** `npm run lint` čistý, `npm run build` prešiel (`/rezervacia`
statická, API routes dynamické), `npm test` → 10/10. Naživo (Directus/SMTP) až
na Railway po nastavení env.

**Ponaučenia:**

1. **React 19 / Next 16 má lint pravidlo `react-hooks/set-state-in-effect`** —
   synchronný `setState` priamo v tele `useEffect` je chyba. Riešenie: resety aj
   fetch dať do **vnorenej async funkcie** vnútri efektu (nie do tela efektu).
2. **Node 22 vie spustiť `.ts` testy natívne** (`node --test`, type-stripping od
   22.18) — netreba jest/vitest. Test súbory sme vylúčili z `tsconfig` (`exclude`
   `**/*.test.ts`), nech ich `next build` nekontroluje (importujú `.ts` príponu).
3. **Re-check slotu pod explicitným lokálnym dňom, nie z UTC časti ISO** — slot
   tesne po polnoci UTC by inak spadol na nesprávny deň. `/create` preto berie aj
   `date` (YYYY-MM-DD, pásmo prevádzky) popri `start`.

**Klik-časť (po súhlase, `docs/booking-r1-klik-navod.md`):** vytvoriť schránku
`rezervacie@digitalnapomoc.sk` na hostingu + SMTP údaje; na Railway (frontend)
pridať `SMTP_HOST/PORT/USER/PASS`, `BOOKING_FROM_EMAIL`, `BUSINESS_NOTIFY_EMAIL`.
`RESERVATION_TOKEN`/`DIRECTUS_URL`/`SITE_URL` sú z R0. Potom merge do `main`.

**Ďalší krok:** Krok R2 — konverzačný chatbot (`/api/chat` + Gemini function
calling) volajúci ten istý `lib/booking.ts` / `booking-data.ts`.

## Aug 2026 — Rezervačný agent, Krok R0: dátový model ✅ HOTOVÉ (zlúčené + naklikané)

**Kód zlúčený do `main` (PR #32).** Klik-časť naostro dokončená používateľom —
Directus kolekcie, DB constraint, token aj seed dáta stoja. **Základ rezervačného
agenta je pripravený**, môže sa stavať R1.

**Kód (PR #32 → `main`):**

- **Referenčná schéma `orchestrator/booking_schema.sql`** (vzor podľa
  `rag_schema.sql`) — 5 kolekcií: `booking_resources`, `booking_services`,
  `booking_availability`, `booking_blackouts`, `bookings`. Odvetvovo neutrálny
  model **zdroj × služba × dostupnosť** → engine počíta voľné sloty. Časy v UTC
  (`timestamptz`). `bookings.lead` prepája rezerváciu na CRM `client_leads`.
- **Exclusion constraint proti dvojitej rezervácii** (`btree_gist`,
  `EXCLUDE USING gist (resource WITH =, tstzrange(start,end) WITH &&) WHERE
  status='confirmed'`) — DB fyzicky nedovolí prekryv na tom istom zdroji.
- **`docs/directus.md`** — rezervačné kolekcie (tabuľka + klik-návod na založenie),
  token **`reservation-bot`** (least privilege) + recept na politiku/rolu/token.
- **`docs/booking-r0-klik-navod.md`** — jednoduchý klik-návod krok po kroku (A–D).

**Overené v sedení (lokálny Postgres 16):** schéma sa aplikuje čisto a je
**idempotentná** (druhý beh len NOTICE „already exists"). Constraint otestovaný
naostro: prekryv potvrdených → `ERROR` (blokované); prekryv so `status=cancelled`
→ prejde; dotyk slotov (10:30–10:30, `[)` half-open) → prejde. Presne ako má byť.

**Klik-časť — DOKONČENÁ naostro (Directus + Railway), stav živých systémov:**

- **Directus kolekcie:** všetkých 5 založených cez UI (Data Model), presné názvy
  polí podľa schémy. M2O väzby: `booking_services.resource`,
  `booking_availability.resource` (required), `booking_blackouts.resource`
  (nullable), `bookings.service/resource/lead` (`lead → client_leads`).
  Optional field `sort` zapnutý na katalógových kolekciách, `date_created`
  na `bookings`. Kľúčové `start`/`end`/`weekday` sú Timestamp/Integer, časy Time.
- **DB constraint:** v Railway → PostGIS → Data (Query) spustené ručne
  `CREATE EXTENSION btree_gist` + `ALTER TABLE bookings ADD CONSTRAINT
  bookings_no_overlap …`. Overené `SELECT conname … = 'bookings_no_overlap'` → 1 row. ✅
- **Token `reservation-bot`:** politika „Rezervácie — booking + leady"
  (App/Admin Access **vypnuté**; `booking_*` = Read, `bookings` =
  Create+Read+Update, `client_leads` = Create), rola „Rezervácie", user
  `reservation-bot@digitalnapomoc.sk`, statický token → Railway (frontend)
  `RESERVATION_TOKEN`.
- **Seed dáta:** `Poradca 1` (id 1); služba „Konzultácia 30 min" (`duration_min=30`);
  dostupnosť Po–Pia (weekday 1–5) 09:00–17:00 pre Poradcu 1 (5 riadkov).

**Ponaučenia (klik-časť):**

1. **Railway „Data → Query" beží po jednom príkaze** — viac statementov naraz
   radšej nie; DDL s `DROP` vyhodí „destructive action" varovanie (pri
   `DROP CONSTRAINT IF EXISTS` je bezpečné, nič neexistuje → Confirm).
   `CREATE EXTENSION`/`ALTER` vracajú „0 rows" = úspech (nie chyba).
2. **Directus token sa dá vygenerovať až po uložení používateľa** (pri vytváraní
   je pole Token neaktívne). Token sa ukáže **iba raz** → hneď skopírovať;
   potom pole hlási „Value securely saved" (hodnota sa už nezobrazí).
3. **Kolekcie zakladané cez UI = tabuľky spraví Directus**, takže z `booking_schema.sql`
   stačí ručne dobehnúť len `btree_gist` + exclusion constraint (zvyšok `CREATE
   TABLE IF NOT EXISTS` by aj tak preskočil).

**Ďalší krok:** Krok R1 — engine `frontend/lib/booking.ts` (+ unit testy),
API `GET /api/booking/slots` a `POST /api/booking/create`, `lib/email.ts`
(hosting SMTP), widget `/rezervacia`. Klik-časť R1 = SMTP údaje schránky
(napr. `rezervacie@digitalnapomoc.sk`) + env premenné na Railway.

## Júl 2026 — RAG chatbot — DOKONČENÉ (prvé živé AI demo) ✅

**Prvé živé AI demo na webe funguje.** Chatbot odpovedá z nášho obsahu a cituje
zdroje (overené naostro: na „aké ponúkate služby?" dal štruktúrovanú odpoveď z
článkov + 3 odkazy na zdroje). Nasadené na `www.digitalnapomoc.sk`.

**Čo sme postavili (Kroky 1–4 + nasadenie):**

- **Krok 1 — DB:** tabuľka `rag_chunks` v existujúcej PostGIS. **Cesta B** (bez
  pgvectora — PostGIS ho nemá a ručná inštalácia by pri redeploy zmizla): vektor
  ako `real[]`, kosínus počíta `/api/chat` v pamäti. 0 € navyše, žiadna nová
  služba. Schéma `orchestrator/rag_schema.sql`. Návod `docs/rag-krok1-db.md`.
- **Krok 2 — Indexer** (`orchestrator/rag_index.py`): WP články (REST) + FAQ
  (z `frontend/lib/content.ts`) → chunky → Gemini embeddingy → `rag_chunks`.
  `content_hash` (preskočí nezmenené), `prune` (zmaže kúsky zmazaných článkov),
  `--dry-run`. Beží lokálne (verejná DB URL). Naplnené: 93 kúskov (89 článkové
  + 4 FAQ). Návod `docs/rag-krok2-spustenie.md`.
- **Krok 3 — Mozog** (`frontend/lib/rag.ts` + `app/api/chat/route.ts`): embedding
  otázky → načíta kúsky (5-min cache) → kosínus → top-k → odpoveď cez
  `gemini-3.5-flash` IBA z kontextu (anti-halucinácia + odkaz na kontakt) +
  zdroje. Rate limit 15/10 min + honeypot (vzor podľa `/api/lead`).
- **Krok 4 — Widget** (`frontend/components/chat-widget.tsx`): plávajúca bublina
  vpravo dole → panel (glassmorphism), zdroje pod odpoveďou, prístupné. Ikona =
  **fialový robot-maskot** (SVG, svieti/máva/hojdá sa, rešpektuje reduced-motion).
- **Nasadenie:** frontend na Railway číta `RAG_DATABASE_URL` (verejná URL) +
  `GEMINI_API_KEY` (referencia na orchestrátor `sincere-motivation`). Merge vetvy
  `claude/rag-chatbot-first-demo-9bwo1w` → `main` (po súhlase).

**Použité modely:** embedding `gemini-embedding-001` (starý `text-embedding-004`
vracia 404 — Gemini ho už cez embedContent nepozná; indexer skúša kandidátov a
`/api/chat` musí použiť ten istý → zhoda cez `GEMINI_EMBED_MODEL` default);
odpovede `gemini-3.5-flash`.

**Ponaučenia:**

1. **`text-embedding-004` je mŕtvy** (404 na embedContent). Funguje
   `gemini-embedding-001`. Indexer aj `/api/chat` MUSIA mať rovnaký embed model,
   inak sa vektory nedajú porovnávať.
2. **Po go-live číta obsah `WP_URL=https://wp.digitalnapomoc.sk`** (nie `www` —
   to je už frontend, `/wp-json` tam vracia 404). Lokálny `.env` orchestrátora
   mal ešte starú `www` — opravené.
3. **`WP_URL` je serverové čítanie na pozadí** — headless princíp neporušuje
   (návštevník `wp.` nevidí; zdroje chatbota staviame z `SITE_URL` = `www`).

**Ešte na rade (RAG v2 — neblokujúce):**

- **Automatické doindexovanie** po publikovaní článku (cron na Railway alebo
  napojiť existujúci WP webhook) — teraz treba ručne spustiť `python rag_index.py`.
- **Krok 5 — config/logy chatbota** v Directuse (model, k, prompt) + vlastný token.
- **Hlas (fáza 2)** — browser Web Speech (zadarmo, slabšia SK) vs platený TTS.
  Detaily `docs/rag-chatbot.md` §9.
- **Optimalizácia:** frontend na **vnútornú** DB adresu (teraz verejná kvôli
  jednoduchosti); ladenie promptu/dĺžky odpovedí.

## Júl 2026 — sedenie: RAG chatbot (Krok 1) + ponaučenie „vetva vs Obsidian"

**Urobené (vetva `claude/rag-chatbot-first-demo-9bwo1w`, zatiaľ NEzlúčené do `main`):**

- **Krok 1 — databáza pre RAG hotová.** V existujúcej PostGIS vytvorená tabuľka
  `rag_chunks` (`CREATE TABLE` + `CREATE INDEX` overené používateľom).
- **Rozhodnutie „Cesta B" (bez pgvectora):** PostGIS image `pgvector` nemá a ručná
  inštalácia by pri redeploy zmizla. Preto vektor ukladáme ako pole `real[]` a
  kosínusovú podobnosť počíta `/api/chat` v pamäti — **0 € navyše, žiadna nová
  Railway služba** (dôležité pri nízkom kredite). Prechod na pravý pgvector
  (Cesta A, ~5 €/mes.) necháme na neskôr, keď bude veľa obsahu. Detaily a plán:
  `docs/rag-chatbot.md`, klikací návod `docs/rag-krok1-db.md`.
- **Schéma v repe:** `orchestrator/rag_schema.sql`.

**⚠️ Ponaučenie (proces — GitHub/Obsidian):** Práca na **feature vetve** znamená,
že používateľov zabehnutý **`git pull` na `main` súbory NEUKÁŽE** (a teda ani
Obsidian, ktorý zálohuje `main`). Toto **treba povedať hneď na začiatku**, keď
zakladáme vetvu — inak sa zbytočne hľadá, „kde sú súbory".
- Zabehnutý tok projektu (viď `CLAUDE.md` → „Zálohy / pamäť projektu"): **sedenie
  pushuje → používateľ `git pull` na `main`**. Docs (pamäť projektu) sa doteraz
  vždy dostali do Obsidianu až **po merge do `main`**.
- **Pravidlo ostáva:** merge do `main` len po výslovnom súhlase používateľa.
- **Preto:** pri každej práci na vetve buď (a) hneď na úvod upozorniť „toto je na
  vetve X, tvoj `git pull` na main to neukáže, kým to nezlúčime; medzitým si to
  pozrieš cez `git checkout X`", alebo (b) ak sú to len **docs** (bezpečné, Railway
  frontend deploy sa spúšťa len zmenou v `frontend/`), ponúknuť skorší merge do
  `main`, nech to padne do Obsidianu bežným pullom.
- Súvisí s backlog bodom „Zvážiť SessionStart hook" — tvrdé načítanie `dennik.md`
  + `vizia.md` na štarte sedenia.

## Júl 2026 — sedenie: redizajn webu (svetlejší, apertia štýl) + svetlé články

**Čo sa urobilo (PR #20, #21, #22 → `main`):**

- **Nová stránka `/headless-wordpress`** — vysvetlenie headless WP + interaktívna
  kalkulačka úspory za pluginy (bez cenníka, bez grafovej knižnice; CSS pruhy).
  Prepojená z domovskej sekcie Služby (karta „Weby a e‑shopy"), v sitemape.
- **Redizajn homepage — zmiešaný layout:** hero **tmavý** (podľa 1. Claude návrhu
  — centrovaný „Digitálna pomoc, ktorá pracuje za vás"), stred **svetlý** (Služby,
  Ako to funguje, Referencie, O nás, FAQ), **blog tmavý**, kontakt svetlý,
  **pätička tmavá**.
- **Sekcia Služby** prerobená na rovnomernú mriežku **6 kariet** (+ karta
  „AI obsah a SEO"), data‑driven (pole + `map`).
- **Svetlé články** (`/blog/[slug]`): svetlá téma + typografia `.wp-article`,
  **náhľadový obrázok navrchu na celú šírku** (à la apertia), nadpis pod ním,
  **širší text** (760→880 px, 17 px). Zoznam `/blog` zámerne ostal tmavý.
- **Menu lišta + logo:** vyššia lišta; vylepšené logo (gradient + sklenený odlesk,
  akcent na `.sk`) + jemná **shine** animácia hrajúca len počas scrollu.
- **Ostrejší featured obrázok:** frontend berie **plnú veľkosť** (predtým
  `medium_large` ~768 px, čo sa na celoširočnom hero rozmazalo); `next/image`
  sizuje podľa `sizes`, hero `quality=90`.

**Ponaučenia:**

1. **Tri pôvodné Claude návrhy nie sú v publikovaných artefaktoch** — v účte je
   len 1 artefakt (finálny dizajn). Návrhy zostali v pôvodnej Claude konverzácii;
   z web sedenia sa k iným konverzáciám nedostaneme → dizajn dodať screenshotom.
2. **Next.js — priečinok s `_` prefixom = privátny (nie route).** Dočasná ukážková
   stránka musí mať názov bez podčiarkovníka (napr. `preview-article`).
3. **Featured obrázok: `medium_large` ≈ 768 px stačí na kartu, nie na celoširočný
   hero.** Brať `source_url` (plnú veľkosť), variantu dorieši `next/image` cez `sizes`.
4. **Lokálny náhľad — pozor na staré inštancie servera.** `rm -rf .next` počas
   bežiaceho `next start` = nekonzistentný build (CSS 404/500, stránka bez štýlov).
   Pred rebuildom ukončiť starý server; overiť CSS `HTTP 200`.
5. **Živý web / apertia / WP z cloud sedenia nevidno** (egress allowlist) — náhľady
   cez lokálny `next start` + screenshot z predinštalovaného Chromium (CDP);
   dizajnové referencie cez screenshoty od používateľa.

**Proces:** merge do `main` **len po výslovnom súhlase používateľa**. Záchranný
bod pred redizajnom: `87c06a7`.

**Súvisiace otvorené:** ak featured obrázky aj po oprave nie sú dosť ostré,
generovať v orchestrátori širšie obrázky (napr. ≥1536 px). Zoznam `/blog` možno
neskôr tiež zosvetliť (zatiaľ tmavý, zámerne).

## Fáza GO-LIVE — technicky DOKONČENÁ ✅ (júl 2026)

**Referencia spustená naostro na doméne.** Doména `digitalnapomoc.sk` teraz
smeruje na náš Next.js frontend, WordPress presťahovaný na skrytú subdoménu.
Web je **živý a funkčný**, ale **zámerne ešte skrytý pred Googlom** (`SITE_INDEXABLE`
vypnuté) — Google pozveme až po doladení (viď „Pred-Google checklist" nižšie).

**Výsledný stav (čo je naostro):**

- `https://www.digitalnapomoc.sk` → **frontend** (Railway), platné SSL.
- `https://digitalnapomoc.sk` (apex) → **presmeruje na `www`** (hostcreators, „Pripojiť URI" = Áno, zachová cestu).
- `https://wp.digitalnapomoc.sk` → **WordPress** (admin/obsah), **noindex**.
- Frontend číta obsah z `wp.` (`WP_URL`), orchestrátor publikuje na `wp.`.
- Webhook (`nexus-revalidate.php`) volá `https://www.digitalnapomoc.sk/api/revalidate`.
- `SITE_URL = https://www.digitalnapomoc.sk`; `SITE_INDEXABLE` **nenastavené** (web skrytý).

**Zvolená stratégia — „Cesta 2" (www ako hlavná, apex presmeruje na www):**
Railway pre custom domény vydáva **CNAME**, lenže apex (`digitalnapomoc.sk` bez
`www`) CNAME v klasickom DNS mať nemôže (potreboval by ALIAS/ANAME) a Railway
plán mal **limit 1 custom doména**. Preto je hlavná (canonical) adresa
**`www.digitalnapomoc.sk`** na Railway a **apex len presmeruje na `www`** cez
hostcreators (zadarmo, bez druhej custom domény). Canonical = `www`.

**Kroky, ako to prebehlo:**

*Fáza A (príprava, bez výpadku):*
1. hostcreators: subdoména **`wp`** → document root **`/digitalnapomoc.sk/web`**
   (ten istý WordPress ako `www`), PHP **8.3** (zhodne s hlavnou doménou).
2. SSL pre `wp.` — hosting ho vydal **automaticky** (wildcard/Let's Encrypt),
   žiadne manuálne tlačidlo. Overené: `Certifikát je platný` pre `wp.`.
3. Railway → frontend `ai-nexus-link` → Networking: pridaná custom doména
   **`www.digitalnapomoc.sk`** (port 8080). DNS ciele z Railway:
   `www` **CNAME → `24wicioh.up.railway.app`** + **TXT `_railway-verify.www`**.

*Fáza B (cutover):*
4. **Migrácia URL v obsahu `www` → `wp`** (aby po prepnutí nezmizli obrázky):
   spravené pluginom **Better Search Replace** (dry-run 76 buniek → ostro),
   `https://www.digitalnapomoc.sk` → `https://wp.digitalnapomoc.sk`. Zmenil aj
   `home`/`siteurl` → WP odteraz „býva" na `wp.`.
5. Railway: **`WP_URL` → `https://wp.digitalnapomoc.sk`** na frontende aj
   orchestrátori (deploy). Frontend tak nečíta „sám seba" po prepnutí DNS.
6. hostcreators DNS zóna: pridaný **`www` CNAME → `24wicioh.up.railway.app`**
   (konkrétny záznam **prebije wildcard** `*.digitalnapomoc.sk`) + **TXT
   `_railway-verify.www`**. `wp` ostáva cez wildcard na hostingu.
7. hostcreators: hlavná doména → **Presmerovanie → `https://www.digitalnapomoc.sk`**
   („Pripojiť URI k presmerovaniu" = Áno).
8. Webhook `nexus-revalidate.php`: URL host `ai-nexus-link-production.up.railway.app`
   → **`www.digitalnapomoc.sk`** (`REVALIDATE_SECRET` bez zmeny).
9. WP admin (`wp.`) → Nastavenia → Čítanie → **noindex** zapnuté.
10. Railway → frontend: **`SITE_URL = https://www.digitalnapomoc.sk`**.
    `SITE_INDEXABLE` **zámerne NEnastavené** (web ešte skrytý pred Googlom).

**Ponaučenia:**

1. **hostcreators účet je SFTP-only** — SSH pustí prihlásenie, ale odmietne shell
   aj `exec` (`shell request failed` / `exec request failed`). WP-CLI cez SSH teda
   nejde; hromadnú náhradu URL rob **pluginom Better Search Replace** vo wp-admin.
2. **Wildcard `*.digitalnapomoc.sk CNAME digitalnapomoc.sk`** — preto `www` aj `wp`
   fungovali „samé" (bez vlastného DNS). **Konkrétny záznam pre subdoménu prebije
   wildcard** — tak sme `www` presmerovali na Railway a `wp` nechali na hostingu.
3. **Headless sťahovanie WP na subdoménu = prepíš absolútne URL v obsahu.** Obrázky
   článkov mali napevno `www…/wp-content/…`; bez náhrady `www→wp` by po cutovere
   zmizli. Riešenie: search-replace v DB (`home`/`siteurl` + obsah).
4. **Railway custom doména = CNAME; apex CNAME je problém.** Bezpečná cesta je
   **www ako hlavná + apex redirect na www** („Cesta 2"). Šetrí aj limit custom domén.
5. **Nový článok sa neukázal hneď** = 5-min ISR cache + timing migrácie, nie chyba
   webhooku. Po tvrdom refreshi/uplynutí ISR nabehol. Netreba nič re-publikovať —
   existujúce články sa zobrazujú automaticky, webhook je len na *okamžitú* obnovu.

**Pred-Google checklist (než zapneme `SITE_INDEXABLE=true` + Search Console):**

- [ ] 🍪 Cookie lišta + zásady ochrany osobných údajov (GDPR — web zbiera leady)
- [ ] 🎨 Doladenie dizajnu
- [ ] ✍️ Rôznorodejší štýl článkov (úprava Writer promptu/agenta)
- [ ] 📄 Stránkovanie blogu (6 na stránku + „ďalšie")
- [ ] ➕ Ďalšie funkcie podľa plánu
- [ ] 🔎 Potom: `SITE_INDEXABLE=true` (Railway) + Google Search Console (`www`)

**Rollback (keby bolo treba):** `www` CNAME v DNS naspäť / apex doménu späť na
„Štandardné zobrazenie"; WP adresu späť opačnou náhradou `wp → www`.

## Fáza 4 — DOKONČENÁ ✅ (zhrnutie + changelog)

**Fáza 4 uzavretá** — postavili sme druhého agenta a plnú automatizáciu reťazca.

**Čo Fáza 4 priniesla:**

- **SEO/GEO základ na frontende** — metadata, Open Graph, canonical,
  `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD (Organization, WebSite,
  BlogPosting, BreadcrumbList, FAQPage). Parita s Rank Math / AIO SEO, na GEO
  ich prekonáva.
- **Druhý agent — SEO+GEO** (`seo_geo_agent.py`) rovnakým „lego" vzorom.
- **Automatizácia reťazca** (`run_pipeline.py`): Writer → SEO agent v jednom cron
  behu; cloud cron overený naostro (Po/St/Pi, `gemini-3.5-flash`, článok 819).
- **Predajný tón** Writera (články vedú k ponuke automatizácií).
- **Dolaďovanie obsahu:** sémantický `<time>`, zdieľací og:image, opravené
  odrážky (Tailwind reset), odstránenie `**markdown**` a stray pomlčiek pri
  zobrazení.
- **Dokumentácia:** `zdroje-pravdy.md`, `directus.md`, Railway ťahák v
  `navody.md`, roadmap vo `vizia.md`, minimalizmus v `CLAUDE.md`.

**Changelog (PR):** #6 SEO/GEO základ · #7 SEO+GEO agent · #8 breadcrumbs+FAQ +
model fix + docs · #9 odrážky · #10 koncová pomlčka · #11 čistenie obsahu
(`**`/pomlčky) · #12 reťazec `run_pipeline` · #13 docs (Railway/zdroje/Directus) ·
#14 roadmap · #15 go-live runbook.

**Stav:** 2 agenti (Writer + SEO/GEO) bežia 24/7 v reťazci; frontend má plné
SEO/GEO; web je zatiaľ **skrytý** (`SITE_INDEXABLE` nenastavené).

**Ďalšia fáza:** Spustenie referencie (go-live) — štartový dokument a runbook:
`docs/go-live.md`.

## Júl 2026 — Fáza 4: reťazec Writer → SEO+GEO agent (automatizácia)

**Cloud cron overený naostro:** Railway „Run now" na orchestrátorovi vytvoril
koncept (ID 816, téma „Chatbot…", `gemini-3.5-flash`) + zapísal `agent_logs`
success. Writer teda v cloude beží sám (cron Po/St/Pi 6:00 UTC).

**Reťazenie agentov (nové):**

- **`orchestrator/run_pipeline.py`** — jeden beh, dvaja agenti za sebou:
  Writer napíše koncept → SEO+GEO agent ho vylepší. **Deterministické** — SEO
  agent dostane presné ID, ktoré Writer vytvoril (žiadne „hádanie najnovšieho
  konceptu" ani preteky medzi dvomi cronmi).
- **`wp_writer_agent.py`** — `generate_and_post_article` teraz **vracia
  `post_id`** (na úspech), aby ho reťazec vedel odovzdať SEO agentovi.
- Ručné spúšťanie jednotlivých agentov ostáva.

**Overené (cloud sedenie):** `py_compile` + import `run_pipeline` OK (reťazec sa
poskladá, Writer vracia ID).

**Klikacia časť (Railway):** na cron worker-i zmeniť **Start Command** z
`python wp_writer_agent.py` na **`python run_pipeline.py`**. Žiadna nová služba.

## Júl 2026 — oprava: odrážky v článkoch (Tailwind reset)

Prvý článok publikovaný cez celý reťazec (Writer → SEO agent → človek) —
ID 811. Používateľ si všimol, že **zoznamy v článku nemajú guľôčky/čísla**.

**Príčina:** Tailwind v4 preflight resetuje `ul/ol` na `list-style: none` na
celom webe. V `.wp-article` sme značky nevrátili (hoci sme farbili `::marker`).

**Oprava:** `frontend/app/globals.css` — `.wp-article ul` → `disc`,
`.wp-article ol` → `decimal`. *Ponaučenie: Tailwind preflight vypína značky
zoznamov; pri obsahu z CMS treba `list-style` explicitne vrátiť.*

## Aktuálny stav Directus `agent_config` (potvrdené používateľom, júl 2026)

> Referencia — živý Directus z cloud sedenia nevidíme, preto zapisujeme sem.

| Agent (`agent_name`) | `is_active` | `text_provider` | `text_model` | `system_prompt` |
|---|---|---|---|---|
| `wp_writer` | ✅ | gemini | **`gemini-3.5-flash`** | predajný tón (viď `navody.md`) — **vložený** |
| `seo_geo` | ✅ | gemini | **`gemini-3.5-flash`** | — |

- **Funkčný text model = `gemini-3.5-flash`** (potvrdené naostro). Predvolený
  model v kóde (`wp_writer_agent.py` → `DEFAULT_TEXT_MODELS["gemini"]`) zosúladený
  na `gemini-3.5-flash` (predtým `gemini-2.5-flash`).

## Júl 2026 — Fáza 4 (krok 4b): breadcrumbs + FAQ schéma (náhrada SEO pluginu)

Cieľ: aby náš systém nahradil platený WP plugin (Rank Math / AIO SEO). Kľúč:
v **headless** architektúre plugin ani nemôže robiť svoju prácu (vkladá značky
do WP stránky, ktorú nikto nevidí) — SEO/GEO **musí** byť na frontende, a to je
presne, čo staviame.

**Urobené (`frontend/`):**

- **Breadcrumbs** — na stránke článku viditeľná omrvinková navigácia
  (Domov › Blog) + `BreadcrumbList` JSON-LD (Domov › Blog › článok).
- **FAQ schéma** — `FAQPage` JSON-LD na domovskej z existujúcej FAQ sekcie
  (`lib/content.ts` → `faqs`). Google z toho robí rich results.
- Generátory `breadcrumbSchema` a `faqSchema` v `lib/seo.ts`.

**Overené:** `lint` + `build` OK; v HTML domovskej potvrdené `FAQPage` so 4
otázkami. Breadcrumb schéma je na dynamickej stránke článku (naživo na Railway).

**Parita s Rank Math / AIO SEO — stav:** meta titulok/popis, OG/Twitter,
sitemap, robots/noindex, canonical, JSON-LD (Organization, WebSite, BlogPosting,
BreadcrumbList, FAQPage), alt texty, llms.txt + AI crawleri (GEO — tu sme
**pred** pluginmi). **Ešte na roadmape:** HowTo schéma (potrebuje kroky z
článku — práca pre agenta v2), presmerovania (301), 404 monitor. Zámerne
nerobíme „semafor" analýzu v editore (obsah píše AI, ladí agent).

## Júl 2026 — Fáza 4 (krok 4): SEO+GEO agent (MVP)

**Druhá „lego" kocka po Writerovi** — dôkaz, že sa agenti pridávajú vzorom, nie
prepisom. Modul `orchestrator/seo_geo_agent.py`.

**Ako pracuje (autopilot, rovnaký vzor ako Writer):**

1. Prečíta si config z Directusu — `nacitaj_config("seo_geo")` (poskytovateľ,
   model, prompt). Bez configu použije defaulty.
2. Nájde článok: podľa ID z príkazu, inak **najnovší koncept** (číta s
   prihlásením, `context=edit`, lebo koncepty nie sú verejné).
3. Nechá model (Z.ai/Kimi/Gemini/Claude) vrátiť **JSON** so SEO/GEO návrhmi:
   meta popis (150–160 zn.), focus keyword, max 3 interné odkazy, GEO tip.
4. **Bezpečne** zapíše len **meta popis do WP `excerpt`** (frontend ho renderuje
   ako `<meta description>`). **Status článku nemení — ostáva koncept.**
5. Kľúčové slovo, odkazy a GEO tip zapíše do `agent_logs` — rozhoduje človek.

**Znovupoužitie (ponytail):** WP prihlásenie aj volania modelov sa importujú z
`wp_writer_agent.py`, config/logy z `directus.py`. **Žiadny duplicitný kód,
žiadna nová závislosť.** Token `orchestrator-bot` (read `agent_config`, create
`agent_logs`) stačí; WP zápis cez application password.

**MVP rozsah (zámerne malý):** meta popis do `excerpt` + kľúčové slovo a odkazy
do logu. Neskôr: optimalizácia titulku, GEO „kľúčové fakty" blok, automatické
interné odkazy.

**Overené (v cloud sedení):** `py_compile` OK, import modulu OK (všetky
prepojenia sedia), jednotkové testy `parse_navrhy` (JSON obalený textom aj
code fence, aj nezmyselná odpoveď → bezpečné None) a `seo_prompt`. **Naživo
(WP/Directus/model) treba otestovať na Railway alebo lokálne** — pieskovisko na
tie služby nedosiahne.

**Podkroky, čo ešte ostávajú (klikacia časť):**

- **Directus:** pridať riadok `agent_config` s `agent_name = seo_geo`
  (`is_active`, `text_provider`, `text_model`, príp. `system_prompt`).
- **Railway:** druhý cron worker (Start Command `python seo_geo_agent.py`),
  ideálne po Writerovi.

**Smerovanie obsahu (produktová línia):** blog je nástroj na získavanie
klientov — články majú informovať a zároveň prirodzene viesť k **našej ponuke
automatizácií** (hotové riešenie + integrácia na nástroje klienta: auto-odpoveď
na e-mail, rezervácie, objednávky). Rieši sa **predajným `system_prompt`**
Writera — nastavuje sa **ručne** v Directuse (recept v `docs/navody.md`).
*(Setup skript sme zámerne zrušili — kvôli bezpečnosti config nastavujeme ručne,
bez admin tokenu v `.env`.)*

**Roadmapa SEO+GEO agenta (na neskôr):**

- **v2 — automatické prelinkovanie:** agent svoje návrhy interných odkazov sám
  vloží do tela článku (bezpečný kotviaci text), nielen do logu.
- **HowTo štruktúrované dáta** pre návodové články (dnes `BlogPosting`) — lepšia
  citovateľnosť v AI vyhľadávačoch.

## Júl 2026 — Fáza 4 (krok 2): SEO/GEO základ na frontende

**Kontext:** Fázu 4 sme začali smerom „ďalší agent lego vzorom" — konkrétne
**SEO + GEO agent** (GEO = Generative Engine Optimization = optimalizácia pre
AI vyhľadávače ako ChatGPT, Perplexity, Google AI Overviews). Keďže sme
**headless** (Google aj AI vidia len Next.js frontend, nie WordPress), meta
značky a štruktúrované dáta patria na **frontend** — Yoast/Rank Math vo WP by
boli zbytočné (nikto ich nevidí). Preto prvý krok = SEO/GEO **základ na
frontende**, až potom samotný agent.

**Audit pred prácou:**

- **PageSpeed (pagespeed.web.dev)** na Railway web: mobil 98/95/100/100,
  desktop 100/95/100/100 (Výkonnosť/Dostupnosť/Osvedčené postupy/SEO),
  „Agentské prehliadanie" 2/2. Východisko je špičkové — headless Next.js je
  rýchlejší ako klasické WP témy (aj GeneratePress), lebo na frontende WP vôbec
  nebeží.
- **Audit kódu** ukázal, čo chýbalo: JSON-LD štruktúrované dáta, Open Graph,
  canonical, `sitemap.xml`, `robots.txt`, `llms.txt`. („SEO 100" v Lighthouse
  je len základná hygiena — schema/OG/GEO nemeria.)
- Poznámka: `geo-seo-claude` (github.com/zubair-trabzada/geo-seo-claude) **nie
  je WP plugin**, ale Claude Code **skill na GEO audit**. Jeho princípy sme
  prebrali priamo do frontendu (schema, llms.txt, povolenie AI robotov).

**Urobené (`frontend/`):**

- **`lib/seo.ts`** — centrálna SEO/GEO konfigurácia na jednom mieste (aby sa
  dala preniesť na ďalšieho klienta): `SITE_URL`, `SITE_NAME`,
  `SITE_DESCRIPTION`, prepínač `SITE_INDEXABLE`, zoznam AI crawlerov,
  generátory JSON-LD (`organizationSchema`, `websiteSchema`, `articleSchema`).
- **`app/robots.ts`** — `/robots.txt`. Kým `SITE_INDEXABLE` != `true`, zakáže
  všetko (web skrytý). Po zapnutí povolí bežných robotov aj AI crawlerov (GEO)
  a odkáže na sitemap.
- **`app/sitemap.ts`** — `/sitemap.xml` zo statických stránok + všetkých WP
  článkov (odľahčená funkcia `fetchAllPostRefs` v `lib/wp.ts`). Pri výpadku WP
  vráti aspoň statické stránky.
- **`app/llms.txt/route.ts`** — `/llms.txt` (štandard z llmstxt.org): popis
  webu + zoznam článkov v Markdown podobe pre AI modely.
- **`components/json-ld.tsx`** — znovupoužiteľný komponent na vloženie JSON-LD.
- **`layout.tsx`** — `metadataBase`, šablóna titulku (`%s – digitalnapomoc.sk`),
  predvolené Open Graph + Twitter Card, prepínač `robots` (noindex kým
  nespustíme).
- **`app/page.tsx`** — canonical `/` + JSON-LD Organization & WebSite.
- **`app/blog/[slug]/page.tsx`** — bohaté meta (OG typu `article` s dátumami,
  Twitter, canonical) + `BlogPosting` JSON-LD.
- **`app/blog/page.tsx`** — titulok „Blog" (šablóna dopĺňa zvyšok) + canonical.
- **`lib/wp.ts`** — pridané ISO dátumy (`dateISO`, `modifiedISO`) pre schema a
  sitemap; `_fields` rozšírené o `modified`.

**Overené:** `npm run lint` čistý, `npm run build` prešiel (TypeScript OK).
V prerenderovanom HTML potvrdené: `noindex, nofollow` (web skrytý), JSON-LD
Organization+WebSite, Open Graph aj canonical. `robots.txt` = `Disallow: /`.

**Ponaučenia:**

1. **Headless = SEO patrí na frontend, nie do WP.** Google/AI vidia len
   Next.js. WP SEO pluginy sú v tejto architektúre zbytočné.
2. **„SEO 100" v Lighthouse ≠ hotovo.** Test kontroluje len základnú hygienu;
   štruktúrované dáta, Open Graph ani GEO nemeria.
3. **Web sa v cloud sedení nedá načítať** (sieťová politika blokuje Railway aj
   Directus) — audit sme spravili z kódu; živý PageSpeed spustil používateľ.
   Preto majú `sitemap.ts` a `llms.txt` fallback pri nedostupnom WP.

**Na doriešenie (klikacia časť — Railway Variables):**

- **`SITE_URL`** — verejná adresa frontendu. Teraz default = Railway URL. Pri
  prepnutí domény nastaviť `https://digitalnapomoc.sk`.
- **`SITE_INDEXABLE`** — rozhodnutie na spustenie. `true` = web sa smie
  indexovať (a povolia sa AI roboty). Kým nie je nastavené, web je **skrytý**
  (noindex) — súlad s plánom „spustiť až po doméne". ⚠️ Pozor: pri `noindex`
  Lighthouse zníži SEO skóre (hlási zámerný noindex) — je to očakávané, skóre
  vyskočí späť na 100 pri spustení.

**Ďalší krok (krok 3):** rýchlosť + sémantika (rozmery vnútro-článkových
obrázkov = CLS, dorovnať Dostupnosť 95, `<nav>`/`<time>`/`<article>`). Potom
krok 4: SEO+GEO agent do orchestrátora + SEO monitor (automatické meranie cez
PageSpeed Insights API).

**Nápady na neskôr (vizuálne doladenie — cieľ: expertná vizuálna forma):**

- **Maskot značky** z fialového robota z článkových obrázkov: spraviť jeden
  znovupoužiteľný priesvitný/vektorový maskot, ktorý vie jemne svietiť aj
  „zamávať" (CSS/Lottie animácia), umiestnený zámerne (hero, chat bublina) —
  **nie** zapekať efekt do každého AI obrázka (to je krehké a nekonzistentné).
  Sadne aj do budúceho chatbota a do „lego" znovupoužiteľnosti. (Cesta C.)
- **Jemné efekty na článkových obrázkoch** (CSS, nedeštruktívne): pomalé
  „dýchanie"/žiara alebo zoom pri prejdení myšou — celý obrázok naraz. (Cesta A.)
- Poznámka: dôvod, prečo „svieti len robot" nejde automaticky — AI obrázok je
  plochý súbor bez vrstiev; časť sa nedá adresovať bez vystrihnutia.
- Celkový cieľ: postupne doladiť web do **expertnej** vizuálnej úrovne.

## Júl 2026 — Fáza 3: agent v Directuse, prepínanie modelov, obmedzený token

**Urobené:**

- **`agent_config` + `agent_logs` v Directuse** — agenta (model, poskytovateľ,
  témy, prompt, draft/publish) nastavuješ **klikaním**; každý beh sa zaloguje.
- **Orchestrátor prepojený s Directusom** — `directus.py` (`nacitaj_config`
  číta config, `zapis_log` píše logy). `wp_writer_agent.py` berie nastavenia
  z configu; bez zadanej témy vyberie **náhodnú** zo `topics`.
- **Prepínanie poskytovateľa textu** — pole `text_provider`: Z.ai / Kimi
  (Moonshot) / Google Gemini / Anthropic Claude. Predvolené modely
  per-poskytovateľ; nové kľúče `MOONSHOT_API_KEY`, `ANTHROPIC_API_KEY`,
  Gemini kľúč sa používa aj na text.
- **Obmedzený Directus token** — politika „Orchestrátor" (`agent_config` = Read,
  `agent_logs` = Create), rola `Orchestrátor`, používateľ `orchestrator-bot`.
  Admin token už orchestrátor nepoužíva (zásada least privilege).
- **`requirements.txt`** pre orchestrátor; **`docs/vizia.md`** (vízia platformy,
  viac agentov, model dodania — SaaS).
- **Orchestrátor nasadený na Railway ako cron worker** — nová služba v projekte
  „ravishing-gratitude" z GitHub repa, **Root Directory `orchestrator`**, branch
  `main`, Start Command `python wp_writer_agent.py`, cron **`0 6 * * 1,3,5`**
  (Po/St/Pi 6:00 UTC ≈ 7–8 ráno u nás). Premenné v Railway Variables vrátane
  **obmedzeného** `DIRECTUS_TOKEN`. Otestované naostro — beh v cloude napísal
  článok „Chatbot pre zákaznícku podporu malej firmy" + obrázky → WP draft
  (ID 802) → log `success`. **Agent beží 24/7 aj pri vypnutom PC.** Ručné
  spustenie ostáva (`python wp_writer_agent.py`, alebo „Run now" v Railway).

**Ponaučenia:**

1. **Directus pole s „Required" sa nedá nechať prázdne** — `text_model` treba
   vždy vyplniť konkrétnym modelom pre daného poskytovateľa (Gemini
   `gemini-3.5-flash`, Z.ai `glm-4.5-flash`, Claude `claude-sonnet-5`, Kimi
   jeho model). *Ponaučenie: config pole = vždy konkrétna hodnota.*
2. **Pri prepnutí poskytovateľa treba zmeniť aj `text_model`** — inak model
   jedného poskytovateľa ide do API druhého (404/chyba).

**Stav:** Fáza 3 hotová — agent píše články 24/7 v cloude (Railway), riadený
klikaním v Directuse, s bezpečným obmedzeným tokenom.

**Ďalší krok (Fáza 4):** ďalší agenti rovnakým vzorom (SEO, sociálne siete,
dizajn — config + modul + logy); WooCommerce (Store API); produktizácia
(multi-tenant SaaS). Zvážiť pomôcku `ponytail` na čistejší kód.

**Na zaradenie (TODO):**

- **Skrytie WordPressu pre verejnosť** — kým nie sme pripravení spustiť, dať WP
  na digitalnapomoc.sk do režimu údržby / „coming soon" (heslom chránený),
  aby slúžil len ako oddelený neverejný systém (obsah/admin). Frontend na
  Railway je aj tak skrytý (bez odkazov, noindex).
- **Prepnutie domény (pred spustením):** digitalnapomoc.sk → Next.js frontend
  (Railway); WordPress presunúť na `wp.digitalnapomoc.sk` (skrytý, noindex,
  len login), zmeniť `WP_URL`. Neskôr Cloudflare pred frontend (CDN, rýchlosť,
  bezpečnosť).

## Júl 2026 — dolaďovanie blogu, obrázky, dokumentácia

**Urobené po Fáze 1+2 (17. 7. 2026):**

- **Obrázky článkov v blogových kartách** — karty na domovskej stránke a `/blog`
  ťahajú featured image z WP médií cez `next/image` (WebP/AVIF, lazy loading,
  gradient ako fallback). WP klient posiela `_embed=wp:featuredmedia`.
- **Writer agent: obrázky cez Google Gemini** — Z.ai CogView vyžadoval platený
  kredit (chyba 1113), preto obrázky teraz generuje Gemini
  (`gemini-3.1-flash-image` → `gemini-2.5-flash-image`), CogView ako záloha.
  Kľúč v projekte AI NEXUS LINK (Google Cloud, $300 trial, billing Tier 1).
- **`fix_post_images.py`** — nástroj na výmenu starých (meniacich sa picsum)
  obrázkov v existujúcich článkoch za trvalé tematické.
- **Dokumentácia** — pribudli `docs/wayland-ferrox.md` (rozlíšenie od Wayland
  app Ferrox Labs) a `docs/prikazy.md` (terminálový ťahák na učenie).

**Problémy a ponaučenia:**

1. **Zmena na `main` sa nenasadila** — Railway preskakuje commity, ktoré sa
   nedotknú Root Directory `frontend/`. Merge PR skončil ako „Skipped".
   → Riešenie: drobná zmena v `frontend/` (napr. komentár v README) spustí deploy.
   *Ponaučenie: pri Root Directory sa nasadia len zmeny v tom priečinku.*
2. **AI v obrázkoch komolí text** — do obrázkového promptu sa dostávala celá
   dlhá téma článku, model kreslil „infografiky" so zlou slovenčinou.
   → Prompt sa oreže na krátky námet (prvá veta, max 90 znakov) + dôrazný
   zákaz textu. *Ponaučenie: obrazové modely nevedia písať — žiadny text do obrázkov.*

**Krok 0 pre Fázu 3 (17. 7. 2026):**

- Prepojený **GitHub účet s Claude Code** (Claude GitHub App → repo `ai-nexus-link`).
  Nové sedenia budú pushovat priamo — bez git bundle. Existujúce sedenie prístup
  nezíska (platí pre nové sedenia).

## Júl 2026 — Fáza 1 + 2: nový frontend, CRM, agenti (dokončené)

**Postavené za jeden veľký ťah (14.–16. 7. 2026):**

- Nová landing page digitalnapomoc.sk podľa dizajnu z Claude Design
  (tmavý glassmorphism, hero variant B) — nahradila prototyp vo
  `frontend/`. Nasadená na Railway, po merge PR #1 sa nasadzuje z `main`.
- Blog: domovská stránka (3 najnovšie), `/blog` (všetky),
  `/blog/[slug]` (celý článok v dizajne webu). WordPress je odteraz
  čisto headless — návštevník ho nikdy neuvidí.
- Formuláre → `POST /api/lead` → Directus `client_leads`
  (politika „create only" pre používateľa frontend-bot).
- Webhook `POST /api/revalidate` + mu-plugin vo WP: publikovaný článok
  je na stránke do ~10 sekúnd.
- Wayland (wp_writer_agent.py) prerobený: SEO titulok od modelu, téma
  ako CLI argument, obrázky generované k téme a natrvalo uložené do WP
  médií (hero + inline ilustrácia, featured image). `fix_post_images.py`
  na opravu starších článkov.
- Dokumentácia: CLAUDE.md (kontext pre AI sedenia) + docs/.

**Problémy, ktoré sme vyriešili (a ich ponaučenia):**

1. **Meniace sa obrázky v článkoch** — starý prompt vkladal
   `picsum.photos/?random` (náhodná fotka pri každom načítaní).
   → Odstránené; obrázky sa generujú k téme a ukladajú ako statické
   súbory do médií. *Ponaučenie: obrázok v článku = trvalý súbor
   v médiách, nikdy externá „živá" adresa.*
2. **Leady „mizli"** — formulár hlásil úspech, Directus nič.
   Príčina: v Railway bola `DIRECTUS_URL` nastavená na celú adresu
   prihlasovacej stránky (`…/admin/login?...`) — server „zapisoval"
   do prihlasovacej stránky, ktorá vracala 200 OK.
   → `DIRECTUS_URL` musí byť len základná doména.
   *Ponaučenie: do URL premenných len základ adresy; overovať zápis
   pohľadom do dát, nie odpoveďou API.*
3. **FORBIDDEN na client_leads v Directus admine** — vypršané
   prihlásenie (SESSION_EXPIRED), nie chyba oprávnení.
   *Ponaučenie: najprv sa odhlásiť/prihlásiť, potom debugovať.*
4. **Z.ai obrázky: error 1211 (model neexistuje) a 1113 (kredit)**
   → agent skúša viac názvov modelov; obrázky presunuté na Google
   Gemini (kľúč v projekte AI NEXUS LINK, billing Tier 1, $300 trial).
   Z.ai CogView zostal ako záloha. Denná kvóta free úrovne sa resetuje
   ~9:00 nášho času; billing má rozpočtový alarm.
5. **Bundle workflow** — webové Claude Code sedenie nemalo push prístup
   k repozitáru, zmeny putovali cez git bundle → lokálny fetch → push.
   *TODO: pridať repozitár do Claude Code prostredia (GitHub prístup),
   bundle tanec odpadne.*

**Stav na konci:** celý cyklus funguje naostro — Wayland napíše článok
s obrázkami → koncept vo WP → schválenie → webhook → stránka; leady
z formulárov padajú do Directusu. PR #1 zmergovaný do `main`.

**Ďalší krok:** Fáza 3 — orchestrátor na Railway, konfigurácia agentov
v `agent_config` (výber modelu/poskytovateľa/autora klikaním), SEO agent.
