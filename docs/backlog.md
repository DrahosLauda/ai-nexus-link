# Backlog — nevyriešené úlohy, zadania a doplnky (živý zoznam)

> **Jediné miesto pravdy pre otvorené drobnosti a doplnky.** Dopĺňať/škrtať
> priebežne. Väčšie veci majú vlastný záznam v `docs/dennik.md`. Súvisí
> s „Pred-Google checklistom" (`docs/go-live.md`) — cieľ je **profesionálna
> úroveň SEO/GEO**, **agent, ktorý sa dá zlepšovať**, a **web pripravený na
> spustenie do Googlu**.
>
> **Kde to žije:** tento súbor je samostatný, aby sa v Obsidiane otvoril na
> jeden `Cmd + O` (predtým bol schovaný uprostred `docs/dennik.md`). Denník
> ostáva **históriou** (čo sa kedy stalo a prečo), backlog je **prítomnosť**
> (čo je otvorené). SessionStart hook číta backlog priamo odtiaľto, takže
> každé sedenie dostane aktuálny stav bez ohľadu na to, čo je v denníku.

**🔴 Gatuje spustenie do Googlu (Pred-Google checklist):**

- [ ] 🍪 **Cookie lišta + zásady ochrany osobných údajov** (GDPR — web zbiera leady
  cez formuláre). Bez toho web nesmieme spustiť do Googlu.
- [x] 📄 **Stránkovanie blogu** — 6 článkov na stránku + „ďalšie" (`/blog`). *(hotové)*
- [ ] 🎨 **Doladenie dizajnu** — priebežné vizuálne vylepšenia na expertnú úroveň.
- [ ] 🔎 **Spustenie:** `SITE_INDEXABLE=true` (Railway) + Google Search Console (`www`)
  — až po odškrtnutí bodov vyššie.

**🟢 PRIPRAVENÉ — nečaká na nič, dá sa spustiť hneď** *(vyber si, čo ide ďalej)*:

- [ ] 🤖 **AI poradca v katalógu kytíc** (M7, prevaha č. 1 z „Naša úroveň").
  Bublina „Poradím s výberom" odporučí konkrétne HOTOVÉ kytice z katalógu.
  Dáta (`katalog.ts`) aj chat modul (`/api/chat`, `chat-widget`) už existujú.
  **Hotový štartový prompt B** v `plan-agenti.md`. Typ sedenia: agenti.
- [x] 💬 **Chatbot má vedieť, že staviame weby a máme šablóny** — *hotové a naživo
  18.8.2026 (PR #72, prompt A).* Tri nové FAQ v `frontend/lib/content.ts`, re-index
  prebehol, odpovede overené naživo. *(Duplicita s položkou v sekcii „RAG chatbot"
  nižšie — ponechané odškrtnuté na oboch miestach, aby nemiatlo.)*
- [ ] 🎨 **Smer V4 do sekcie Služby na Domove** (šablóna kvetinárstva Boma Flora,
  **nie** digitalnapomoc.sk) — majiteľ ho vybral v demo `design-shotgun` z piatich
  smerov (V1 editorial · V2 mriežka · V3 tmavý pás · **V4 asymetrický feature** ·
  V5 dlaždice). **V4 = Svadby ako veľký blok + 2×2 kompaktné karty** — asymetria
  vedie oko na najhodnotnejšiu službu. Dnes je sekcia ešte starým vzorom
  (editorial riadky): `SluzbyZoznam` v `templates/kvetinarstvo/sections/bloky.tsx`,
  dáta `homeSluzby` v `content.ts`. **Mantinely:** data-driven (rozloženie sa
  odvodí z dát, nie natvrdo „tu bude Svadby" — inak sa to nedá použiť pre ďalšieho
  klienta) a **NIE kopírovaním demo HTML** (náhľady boli prieskum a sú zmazané);
  ide sa cez `ui-ux-designer` → `frontend-dev` → `visual-qa`. Odklad za E1 už
  neplatí — E1 je hotové. Typ sedenia: dizajn, menšie.

> **Poradie sa rieši na veľkej porade** — štartovací prompt **P** v
> `plan-agenti.md` („Veľká plánovacia porada"). Do dovtedy platí: **nemiešať
> viac vecí do jedného sedenia** (1 sedenie = 1 typ).

**🔵 ČAKÁ NA MAJITEĽA — sedenie s tým samo nepohne:**

- [ ] 📸 **Fotky pre 3 kytice bez obrázka** — Red Naomi, Tichá rozlúčka, Slnečné
  ráno (+ prípadne druhé uhly k ostatným). Majiteľ ich **dodá**, alebo sa
  vygenerujú v samostatnom KREATÍVNOM sedení (Higgsfield/Gemini; Kling CDN je
  blokovaný egressom). Doplnenie = pridať cestu do `fotky[]` v `content.ts`,
  **žiadny zásah do kódu**; potom riadok do `images/LICENSES.md`.
- [ ] 🛒 **E2 — WooCommerce ako zdroj katalógu.** Potrebuje **samostatnú inštanciu
  WordPress + WooCommerce** (**nemiešať** s `wp.digitalnapomoc.sk`). Kód je
  pripravený — mení sa len telo funkcií v `templates/kvetinarstvo/katalog.ts`,
  stránky ani komponenty nie.
- [ ] 🧑‍🌾 **E3 — produkt agent** (generuje kytice s popismi ako Woo koncepty).
  **Stojí na E2.**
- [ ] 📊 **Domerať Lighthouse** pre šablónu kvetinárstva — v cloud sedení chýba CLI,
  meria sa na deployi (cieľ ≥ 95, prístupnosť 100).
- [ ] 🍪 **Cookie lišta + zásady ochrany osobných údajov** — viď červená sekcia
  vyššie. Kód vieme spraviť kedykoľvek, ale **kedy sa to rieši, rozhoduje majiteľ**
  (súvisí so spustením, ktoré je zamknuté).

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

- [x] **Výstup/štýl odpovedí** — dĺžka, tón, formátovanie, koľko zdrojov ukazovať.
  *Hotové 18.8.2026, zlúčené do `main` (PR #76) a **overené naživo** — všetky štyri
  kontrolné otázky prešli (viď záznam v denníku). Dobeh: **klikateľné odkazy
  v odpovediach** — PR #78, overené naživo 19.8.2026.* Citujú sa len kúsky, ktoré
  model označí ako použité (`splitCited` v `lib/rag.ts`, strop `MAX_SOURCES = 3`),
  markdown sa vo widgete vykresľuje (`ChatText`, bez závislosti a bez
  `dangerouslySetInnerHTML`), prompt káže 2 – 4 vety a výzvu na kontakt len keď má
  zmysel. Anti-halucinačné zásady nedotknuté.
- [ ] **Krok 5 — config v Directuse** — presunúť nastavenia chatbota (model,
  system prompt/osobnosť, počet kúskov `k`) do `agent_config` (riadok `chatbot`),
  aby sa dali meniť klikaním bez zásahu do kódu; logy chatov do `agent_logs`;
  vlastný token s minimálnymi právami (teraz frontend číta DB priamo).
  **Dnes:** `SYSTEM_PROMPT`, `CHAT_MODEL` aj `TOP_K` sú natvrdo v `frontend/lib/rag.ts`,
  takže každá zmena tónu = vetva + PR + deploy (18.8. to kvôli výpadku GitHubu
  trvalo ~3 h). **Podmienka predajnosti:** klientovi nepovieme „napíš mi a ja to
  prekódim" — musí si tón doladiť sám. **Mantinel do zadania:** hodnoty v kóde
  ostanú ako **fallback** — keď je Directus nedostupný alebo riadok prázdny, bot
  beží podľa dnešných hodnôt (config v DB mení bota naživo bez revízie cez PR).
  **Hodnota logov:** dnešný nález s klikateľnými odkazmi vyšiel z jednej otázky
  majiteľa — `agent_logs` ukáže stovky takých.
- [ ] **Kvalita obsahu, z ktorého čerpá** — revízia/úprava existujúcich článkov
  (viac o „našich" riešeniach, menej odkazov na cudzie nástroje — viď nižšie).
- [x] **Chatbot nevie o tom, že staviame weby / máme šablóny** — *hotové a naživo
  18.8.2026.* Cesta 1: tri nové FAQ v `frontend/lib/content.ts` (vrátane odkazu na
  `/ukazky/kvetinarstvo` — odsúhlasené majiteľom), PR #72 zlúčené, re-index
  prebehol, **odpovede overené naživo**. Detaily v zázname z 18.8.2026 v `docs/dennik.md`.
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
  kosínus v pamäti). Detaily v `docs/dennik.md` → „RAG chatbot — DOKONČENÉ (prvé demo)".
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
  layout: tmavý hero + blog + pätička, svetlý stred; svetlé články). *(viď záznam v `docs/dennik.md`)*
- [x] **Stránka „Čo je headless WordPress" + kalkulačka úspory za pluginy** —
  hotová na `/headless-wordpress` (bez cenníka, CSS grafika).
- [x] ⚠️ **Dizajnové referencie** — apertia screenshoty dodal používateľ; vlastná
  landing je v repe (`docs/index.html`).
- [ ] **Vylepšiť náš Claude Code workflow — inšpirácia z `gstack`** (Garry Tan, MIT;
  balík ~23 skillov pre Claude Code: plán → dizajn → review → QA → ship → reflect).
  **Posúdenie (16.8.2026):** koncepčne presne to, čo dnes robíme ručne cez naše
  konvencie, ALE gstack je **lokálny-first** (vyžaduje **Bun**, team mode = symlinky
  na lokálnu inštaláciu, lokálne daemony) → **priamo do našich cloud web sedení
  nesadne.** Rozhodnutie: **cesta B** — neinštalovať gstack naostro, ale prevziať
  jeho najlepšie vzory ako **vlastné odľahčené, cloud-kompatibilné skilly** do
  `.claude/skills/`. **Shortlist na prevzatie** (samostatné nástrojové sedenie,
  ideálne cez `skill-creator`):
  1. [x] **„design-shotgun"** — vygeneruj 4–6 dizajnových variantov sekcie/stránky
     naraz → rýchly výber (ideál pre stavbu šablón). *(hotové 16.8.2026 —
     `.claude/skills/design-shotgun/`, vetva `claude/claude-code-skills-design-qa-7kweyt`,
     NEzlúčené; viď záznam navrchu)*
  2. [x] **„vizuálne QA v prehliadači"** — predinštalovaný Chromium + Playwright:
     spusti app, preklikaj, screenshoty desktop/mobil, over proti
     `docs/sablony-kvalita.md`. *(hotové 16.8.2026 — `.claude/skills/visual-qa/`,
     tá istá vetva, NEzlúčené)*
  3. **„plan-review pred kódom"** — štruktúrovaný review plánu (architektúra +
     dizajn) pred realizačným sedením. (Nadväzuje na náš `Plan` subagent.)
  4. **„retro/reflect"** — formalizovať zápis ponaučení na konci sedenia (dnes ručne
     do denníka). Nízke úsilie, drží učenie.
  Alternatíva (cesta A): gstack naostro — len ak raz prejdeme na **lokálny Claude
  Code CLI** (Bun + gstack). Zatiaľ NIE. **Nezaraďovať teraz** (uprostred M7/E1;
  1 sedenie = 1 typ).

**🟢 Doplnky / neskôr (nie sú blokery):**

- [ ] Podstránky služieb `/sluzby/[slug]`.
- [ ] Fotka tímu (`frontend/public/team.jpg` + `components/about.tsx`).
- [ ] Reálny telefón v pätičke.
- [ ] Vlastná obmedzená rola pre orchestrátor token (teraz admin) — least privilege.
- [ ] Maskot značky (fialový robot) + jemné efekty na článkových obrázkoch (viď
  „Nápady na neskôr" v `docs/dennik.md`, Cesta A/C).
- [ ] SEO+GEO agent v2 — automatické prelinkovanie + HowTo schéma (viď roadmapa v `docs/dennik.md`).
- [x] **SessionStart hook** — nové sedenie **automaticky (tvrdo)** dostane inštrukciu
  prečítať `docs/dennik.md` + `docs/vizia.md` + živý Backlog (nie len „mäkký" pokyn
  v `CLAUDE.md`), a na webe sa predinštalujú `frontend` závislosti. ✅ hotové a
  zlúčené do `main` (PR #52) — viď záznam v `docs/dennik.md`. Aktívne od teraz.

**✅ Nedávno vyriešené (pre kontext):**

- [x] **Obrázky článkov po migrácii `www→wp`** — zobrazujú sa v tele článku aj
  v náhľadoch, všade bez `wp.` prefixu. *(vyriešené)*
- [x] Náhľady preberajú `alt` z WP (fallback názov článku).
