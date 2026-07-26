# Vízia AI Nexus Link — kam to celé smeruje

> Prečo to staviame, akú hodnotu to prináša a ako sa to má vyvinúť
> z jedného webu na predajnú AI platformu. Doplnok k `CLAUDE.md`
> (technický rozcestník) a `docs/architektura.md` (ako to funguje dnes).
> Stav: júl 2026, počas Fázy 3.

## 1. Veľká myšlienka

Nestaviame jeden web — staviame **produkt**: modulárnu AI nadstavbu nad
WordPress, ktorá malým firmám dá **moderný web, AI tvorbu obsahu, zber
zákazníkov (CRM), neskôr e-shop a viacero AI agentov** — a celé sa to dá
**rýchlo replikovať ďalším klientom**.

`digitalnapomoc.sk` je **prvý referenčný web a zároveň šablóna** na predaj.

Cieľová predstava: **slovenský „GHL na AI"** — platforma, kde firma vojde do
admina, klikaním si **zapne moduly (agentov)** a systém pre ňu pracuje 24/7.

## 2. Architektúra ako „lego" — moduly = agenti

Systém je poskladaný tak, aby sa **agenti pridávali ako kocky**, nie prepisovali:

- **Ovládací panel** = Directus kolekcia `agent_config`. Pole `agent_name`
  rozlišuje agentov → každý agent má vlastný riadok s vlastnými nastaveniami
  (model, poskytovateľ, témy, prompt…), meniteľnými **klikaním**.
- **Denník** = Directus kolekcia `agent_logs`. Každý agent si zapisuje, čo a s
  akým výsledkom urobil.
- **Modul agenta** = Python skript v `orchestrator/` (napr. `wp_writer_agent.py`),
  ktorý si prečíta svoj config a píše do logov. Nový agent = nový skript + nový
  riadok v configu. Nič sa neláme.

Tento vzor je **kľúč k produktizácii**: pridať schopnosť = pridať modul.

## 3. Katalóg agentov (súčasní + plánovaní)

| Agent | Čo robí | Stav |
|---|---|---|
| **Writer (`wp_writer`)** | Píše SEO články + generuje obrázky → WP koncept | ✅ funguje |
| **SEO+GEO agent (`seo_geo`)** | Meta popis do WP, kľúčové slovo, interné odkazy, GEO tipy pre AI vyhľadávače | ✅ funguje (reťazec s Writerom) |
| **Social agent** | Tvorí a uverejňuje príspevky na sociálne siete | 🔜 plán |
| **Frontend/dizajn agent** | Pomáha s dizajnom sekcií, vizuálmi, úpravami vzhľadu | 🔜 plán |
| **Mockup / náhľad agent** | Z **agentského promptu podľa biznisu/biznis plánu** vygeneruje **náhľad stránky pre klienta** (hotové ukážky do portfólia) | 🔜 plán — viď §8 |
| **Chatbot / zák. podpora agent (RAG)** | Odpovedá návštevníkom **z nášho obsahu** (RAG), kvalifikuje leady | 🔜 plán — prvé živé demo (§11) |
| **Rezervačný / objednávkový agent** | Auto-potvrdenia, kalendár, napojenie na nástroje klienta | 🔜 plán — showcase |
| **E-mail / auto-odpoveď agent** | Automatická odpoveď a triedenie dopytov z formulárov | 🔜 plán — showcase |
| **WooCommerce / „produkt" agent** | Pridá reálnu službu ako WooCommerce produkt + presmerovanie do pokladne | 🔜 plán (Fáza 6) |
| **„Plugin-nahrádzajúci" agenti** | Nahradia bežné WP pluginy vlastnou AI logikou | 🔜 plán |
| **Ďalší podľa dopytu** | Newsletter, recenzie… | 🔜 nápady |

Každý z nich zapadá do rovnakého vzoru: config v Directuse, logy v Directuse,
modul v orchestrátore, vlastný token s minimálnymi právami.

## 4. Ako to doručíme klientom — model dodania

Dve možnosti a **zvolený smer**:

- **A) Spravovaný SaaS (odporúčané) — „krabica", ktorú hostíme my.**
  Klient sa prihlási do admina, klikaním si zapína moduly a nastavuje agentov;
  my hostíme, aktualizujeme a zabezpečujeme; klienta zaškolíme.
  - + Opakovaný (mesačný) príjem ako GHL.
  - + Central aktualizácie a podpora (každý klient beží rovnako).
  - + Bezpečnosť pod kontrolou (klient nesiaha na kód ani na server).
  - + Klient nechce kód — chce klikať a mať pokoj.
- **B) Stiahnuteľná self-hosted aplikácia** — klient si to nainštaluje sám.
  - − Ťažko spoplatniteľné opakovane; každá inštalácia iná = náročná podpora a
    bezpečnosť; aktualizácie treba obiehať. Vhodné len ako **výnimka** pre
    veľkého klienta, čo si to výslovne vyžiada.

**Rozhodnutie:** ideme cestou **A — spravovaný SaaS**. „Firmy si to nastavia
samy" = áno, ale **v našom hostovanom admine**, nie na svojom serveri.

Poznámka k technike: dnešný systém je **jedno-klientský**. Produktizácia
(Fáza 5) znamená spraviť ho **viac-klientským (multi-tenant)** — každý klient
izolovaný, so svojím configom a svojimi agentmi, pod našou centrálnou správou.

## 5. Roadmap (fázy a hodnota)

| Fáza | Čo staviame | Hodnota pre nás | Hodnota pre klienta |
|---|---|---|---|
| **1 — Frontend** ✅ | Moderný Next.js web, blog z WP | Ukážka „pred/po", ktorá predáva | Rýchly, pekný web bez zmeny WP |
| **2 — Leady/CRM** ✅ | Formuláre → Directus | Dôkaz, že web prináša kontakty | Žiadny lead sa nestratí |
| **3 — AI agenti 24/7** ✅ | Agent píše sám v cloude; výber modelu klikaním; základ pre viac agentov | Obsah na autopilota; jadro produktu | Web „žije", lepšie SEO |
| **4 — Druhý agent (SEO/GEO) + automatizácia** ✅ | Writer→SEO reťazec v cloude; SEO/GEO parita; predajný tón | Reťazec agentov; obsah aj optimalizácia na autopilota | Web optimalizovaný pre Google aj AI vyhľadávače |
| **➡️ Spustenie referencie (go-live) — ĎALŠIA** | Doména `digitalnapomoc.sk` → frontend; WP na skrytú `wp.` subdoménu (noindex); `SITE_INDEXABLE=true`; neskôr Cloudflare | **Živá verejná referencia, ktorá predáva** | Web beží naostro na vlastnej doméne |
| **5 — Produktizácia (multi-tenant SaaS)** | Šablóna + centrálny admin pre viac klientov, moduly ako lego | **Biznis** — nový klient za dni | „Slovenský GHL na AI" na kľúč |
| **6 — WooCommerce + „produkt" agent** | Online predaj cez Store API; agent pridá reálnu službu ako produkt s presmerovaním do pokladne | Drahšia zákazka (e-shop) + ďalší modul | Klient predáva online |
| **Neskôr** | Ďalší agenti (social, dizajn, newsletter, chatbot); podstránky služieb | Bohatšia ponuka modulov | Kompletná AI pomoc |

## 6. Hodnota v skratke

**Pre nás:** referencia + šablóna v jednom, opakovaný príjem, odlíšenie od
konkurencie (AI obsah + CRM + e-shop pod jednou strechou), ušetrený čas.

**Pre klienta:** nechá si známy WordPress, dostane moderný web, pravidelný
AI obsah (viac návštev z Googlu = viac dopytov), kontakty na jednom mieste,
neskôr e-shop — rýchlo a cenovo dostupne.

## 7. Zásady, ktoré to celé umožňujú

- **Každý systém = jedna rola + vlastný token s minimálnymi právami**
  (least privilege). Bez tohto sa platforma nedá bezpečne replikovať.
- **Obsah nikdy do Directusu, leady/logy nikdy do WP** — čisté hranice.
- **Agenti publikujú koncepty, publikuje človek** (kým sa dôvera nevybuduje).
- **Modularita:** nová schopnosť = nový modul + riadok v configu, nie prepis.

> Táto vízia je živý dokument. Keď pribudne nový agent alebo sa rozhodne o
> ďalšom module, doplň sem riadok — nech mapa hodnoty ostáva aktuálna.

## 8. Viac agentov = živá ukážka automatizácií (predajný nástroj)

**Cieľ:** mať **viacero agentov, ktoré sú konkrétnym príkladom toho, čo vieme
firmám v praxi zautomatizovať** — a k nim **priradiť reálne služby vo Woo**, aby
bolo na vlastnom webe vidieť, že *headless WordPress sa dá prepojiť s naším
frontendom* a že to celé funguje naostro.

**Princíp „ukáž, nepovedz":** každý agent, ktorý postavíme pre seba, je zároveň
**demo služby**, ktorú predávame. Náš web = katalóg fungujúcich automatizácií.

**Párovanie agent ↔ Woo služba (návrh):**

| Ukážkový agent (beží na našom webe) | Woo služba, ktorú predávame |
|---|---|
| Writer + SEO/GEO (už beží) | „AI tvorba obsahu na autopilota" (mesačne) |
| Chatbot / zák. podpora | „AI asistent na web" (nasadenie + mesačne) |
| Rezervačný / objednávkový | „Automatické rezervácie/objednávky" |
| E-mail / auto-odpoveď | „Auto-odpoveď a triedenie dopytov" |
| Mockup / náhľad agent (§9) | „Nový moderný web za pár dní" (na kľúč) |

Woo produkty najprv ako **embednutý checkout** (Store API) — najmenší krok, ako
ukázať prepojenie headless WP ↔ frontend na reálnom nákupe.

## 9. Frontend „mockup" agent — náhľady stránok pre klientov

**Myšlienka:** agent, ktorý z **agentského promptu podľa biznisu alebo biznis
plánu klienta** vygeneruje **náhľad webu** (hero, sekcie, texty, prípadne
vizuál). Výstupy:

1. **Predajný nástroj** — na obchodnom stretnutí ukážeme klientovi „takto by
   vyzeral váš web" za pár minút, nie za týždne.
2. **Portfólio hotových ukážok** — pár vygenerovaných náhľadov necháme na webe
   ako referencie; na ich príkladoch prezentujeme automatizácie pre firmy.
3. Zapadá do „lego" vzoru — config v Directuse, modul v orchestrátore, logy.

Neskôr: z náhľadu jedným klikom spraviť reálny frontend (produktizácia, Fáza 5).

## 10. Dizajn webu — smerovanie (svetlá, čistá, „AI agentúra")

**Zámer:** posunúť náš web bližšie k štýlu **apertia.ai** (David Strejc) —
čistý, moderný, vzdušný „AI agentúra" look — ale s **výraznejšie bielym /
svetlým pozadím** (viac ako má apertia, resp. ako predloha z vlastnej landing
page). Dnešný web je tmavý glassmorphism; ideme skôr k **svetlému, minimalistickému**.

**Potvrdené rozhodnutia (júl 2026):**

- ✅ **Svetlý hlavný obsah = priorita čitateľnosti.** Dlhé texty na čiernom
  pozadí unavujú — apertia má hero tmavý, ale to nechceme kopírovať. Hlavný
  obsah svetlý (biela / jemná šedá, tmavý text). Tmavú farbu použiť len
  **striedmo ako akcent** (napr. pätička alebo jeden CTA blok, ako pätička apertie).
- ✅ **Kalkulačka NEjde na hlavnú stránku.** Domovská predáva nás; kalkulačka +
  vysvetlenie headless patria na **samostatnú vzdelávaciu/ukážkovú stránku**.

**Nová samostatná stránka — vysvetlenie headless WP + kalkulačka:**

- Pracovný názov: **„Prečo headless"** (`/preco-headless`) — *na potvrdenie*
  (alternatívy: `/headless-wordpress`, `/kalkulacka-uspor`, `/usetrite`).
- Vysvetlí **jednoducho a vizuálne**, čo je headless WP a prečo je to výhoda
  (rýchlosť, bezpečnosť, moderný web bez straty známeho admina).
- **Kalkulačka úspory nákladov za pluginy** — návštevník zadá, koľko platí za
  WP pluginy (SEO, cache, formuláre, zálohy…), a uvidí, koľko **ušetrí** s naším
  headless riešením (my tie funkcie nahrádzame frontendom + agentmi). Predajný
  a zároveň vzdelávací prvok — presne to, o čo ide: ukázať hodnotu číslom.
- Základ preklopíme z `docs/index.html` (vlastná landing) natívne do Next.js +
  Tailwind v4 (bez CDN). Neskôr môže zapadnúť pod `/ukazky` (portfólio ukážok,
  kam raz pribudnú výstupy mockup agenta — §9).

**Referencie (ktoré Claude v cloude nevidí — nutné dodať obsah/screenshoty):**
`apertia.ai` (403 pri stiahnutí) a vlastná landing page
`LandingGH-Digitalnapomoc/index.html#pricing` (lokálny súbor na Macu). Pri
realizácii ich treba vložiť do repa alebo opísať (farby, fonty, sekcie).

## 11. RAG chatbot agent — prvé živé demo automatizácie

**Prečo (biznisový dôvod):** na webe ponúkame „nasadenie AI chatbotov a
asistentov". Aby tá služba mala **váhu a dôveryhodnosť**, musíme mať **aspoň
jedného chatbota naživo na vlastnom webe** — presne v duchu „**ukáž, nepovedz**"
(§8). Náš web sa tak stáva živou ukážkou toho, čo predávame; návštevník si to
vyskúša a hneď vidí hodnotu.

**Čo to bude:** chatbot, ktorý **odpovedá z NÁŠHO obsahu** (články z WP, FAQ,
stránka „Headless WordPress") — teda **RAG** (Retrieval‑Augmented Generation),
nie „ukecaný" model, čo si vymýšľa. Odpovede sú podložené našimi dátami a vie
odkázať na zdroj (článok).

**Ako funguje RAG (v skratke):** obsah rozsekáme na kúsky → každý kúsok
premeníme na **vektor** (embedding = zoznam čísel zachytávajúci význam) → uložíme
do **vektorovej databázy** → pri otázke nájdeme **významovo najbližšie** kúsky a
priložíme ich modelu → model odpovie z nich. (Sémantické hľadanie: „auto" nájde
aj „vozidlo".)

**Technický plán (zapadá do „lego" vzoru):**

- **Vektorová DB = `pgvector` v existujúcom Postgrese.** Directus u nás beží na
  **PostgreSQL** (Railway) — pridaním rozšírenia `pgvector` máme vektorové úložisko
  **v tom istom systéme, bez novej služby**. Nová tabuľka/kolekcia na embeddingy
  (kúsok textu + vektor + odkaz na zdroj).
- **Indexovací modul** (`orchestrator/`): prejde WP články + FAQ + statické
  stránky → rozseká → zavolá **embeddings API** (Gemini/OpenAI/Voyage) → uloží
  vektory. Spúšťa sa pri publikovaní článku (webhook) alebo cronom.
- **Odpovedací modul:** frontendová API route (`/api/chat`) — otázku embedne,
  vytiahne top‑k kúskov z `pgvector`, poskladá prompt a nechá model
  (Gemini/GLM/Claude) odpovedať + priloží zdroje.
- **Frontend widget:** chat bublina vpravo dole (ako má apertia), volá `/api/chat`.
- **Config + logy** v Directuse (`agent_config` riadok `chatbot`, `agent_logs`);
  vlastný token s minimálnymi právami. Rovnaký vzor ako Writer/SEO agent.

**Produktová línia:** ten istý agent = **predajná služba** — nasadíme RAG
chatbota **klientovi nad JEHO obsahom** (jeho web, FAQ, produkty). U nás je to
demo, u klienta platená automatizácia. Zapadá aj do „AI Knihovník" typu služby.

**Otvorené rozhodnutia (na neskôr):** ktorý model na generovanie odpovede
(Gemini/GLM/Claude — cena vs kvalita), poskytovateľ embeddingov, koľko kúskov
priložiť (k), a stratégia proti halucináciám (keď odpoveď nie je v dátach →
„toto neviem, napíšte nám"). Bezpečnosť: chatbot iba **číta** (nikdy nezapisuje
do WP/Directusu okrem vlastných logov).

**Bonus — „chat s Obsidianom":** rovnaký RAG vzor sa dá pustiť aj nad vlastným
Obsidian vaultom (poznámky → embeddingy → chat). Ten istý princíp ako klientský
chatbot; dobrý interný test technológie pred nasadením klientom.
