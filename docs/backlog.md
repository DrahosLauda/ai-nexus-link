# Backlog — čo je otvorené a v akom poradí

> **Jediné miesto pravdy pre „čo je ďalej".** Denník (`docs/dennik.md`) je
> **história** — čo sa kedy stalo a prečo. Backlog je **prítomnosť**.
> SessionStart hook číta tento súbor priamo, takže každé sedenie dostane
> aktuálny stav.
>
> **Vizuálne mapy** k tomuto súboru sú v `docs/mapy/` (otvor v prehliadači):
> `strom-projektu.html` (celý strom, klikateľný) · `pracovna-mapa.html`
> (strom + fronta s odôvodnením) · `ako-nexus-funguje.html` (dátové toky).
>
> Súvisí s „Pred-Google checklistom" (`docs/go-live.md`).

---

## 🔤 Vysvetlivky skratiek

Aby sa nemuselo hľadať, čo znamená „M4" alebo „R2":

| Kód | Čo to je |
|---|---|
| **P1 – P6** | **Fronta sedení** — poradie, v akom ideme pracovať. Určené na porade 22.8.2026. |
| **Fáza 1 – 5** | Veľké etapy projektu: 1 = frontend, 2 = leady, 3 = agenti/orchestrátor, 4 = WooCommerce, 5 = produktizácia pre ďalších klientov. |
| **M4, M7** | Míľniky šablóny kvetinárstva. **M4** = customizačný agent (z jednej šablóny dva rôzne weby). **M7** = AI poradca v katalógu kytíc. |
| **E1, E2, E3** | Kroky napojenia šablóny na e-shop. **E1** = katalóg zo súboru (hotové). **E2** = katalóg z WooCommerce. **E3** = agent, čo generuje produkty. |
| **R1 – R4** | Kroky rezervačného agenta. **R1** = formulár + engine (hotové, naživo). **R2** = rezervácia priamo v chate. **R3** = pripomienky. **R4** = replikácia u klienta. |
| **Krok 5** | Piaty krok RAG chatbota — presun nastavení a logov do Directusu. Je to obsah **P1**. |

---

## 🎯 FRONTA — poradie platí

**Jedno sedenie = jeden typ práce a jedna úloha: dokončiť, overiť, zavrieť.**
Odôvodnenie každej položky (prečo práve v tomto poradí) je v
`docs/mapy/pracovna-mapa.html`. Štartovacie prompty sú v `docs/plan-agenti.md`.

### P1 — Nastavenia a logy chatbota + bookingu do Directusu
`AI Nexus Link / Agenti / RAG chatbot / Krok 5` — typ sedenia: **agenti / kód**

- [ ] **Chatbot:** presunúť `SYSTEM_PROMPT`, `CHAT_MODEL`, `TOP_K`, `MAX_SOURCES`
  z `frontend/lib/rag.ts` do `agent_config` (riadok `rag_chatbot`).
- [ ] **Booking:** doplniť zápis do `agent_logs` a presunúť `MIN_LEAD_MIN` (dnes
  natvrdo `= 60` v `frontend/lib/booking-data.ts`) do configu.
- [ ] Vlastný token s minimálnymi právami.

**Prečo prvé.** Overené 22.8.2026: `agent_config` ani `agent_logs` sa vo
`frontend/` nevyskytujú **ani raz** — chatbot aj booking stoja mimo lego vzoru,
ktorý orchestrátor už používa. Každá zmena tónu = vetva + PR + deploy (18.8. to
kvôli výpadku GitHubu trvalo ~3 h). Klientovi nepovieme „napíš mi a ja to
prekódim". A dnes **netušíme, na čo sa ľudí pýtajú** — chatbot je jediný agent,
čo hovorí priamo s návštevníkom, a nemá čiernu skrinku.

**Mantinely do zadania:**
1. Config sa číta **podľa kľúča**, nie z pevného riadku — presne ako
   `nacitaj_config(agent_name)` v `orchestrator/directus.py`. Booking je ten
   druhý používateľ; bez toho sa Krok 5 robí druhýkrát.
2. Hodnoty v kóde ostávajú **fallback** — keď je Directus nedostupný, bot beží
   ako dnes. Žiadna regresia.
3. **GDPR:** otázky návštevníkov sú osobné údaje. Začať **metadátami** (našiel
   zdroje áno/nie, koľko, odpovedal / „neviem"), **nie plným znením otázok**.
   Plné otázky až po dokončení zásad ochrany osobných údajov (🔴 nižšie).

### P2 — Obmedzené prístupové kľúče
`AI Nexus Link / Systémové dáta / Tokeny` — typ sedenia: **prevažne klikanie v Directuse**, ~30–45 min

- [ ] Orchestrátor má dnes **admin** token → dať mu vlastnú obmedzenú rolu.
- [ ] Frontend prejde z verejnej adresy databázy na **vnútornú**.

**Prečo hneď za P1.** Vo `vizia.md` je zapísané, že bez tohto sa systém **nedá
bezpečne replikovať pre klientov**. Je to podmienka, nie kozmetika.
**Prečo nie spolu s P1:** keby sa po výmene kľúča rozbil živý pipeline, ktorý
píše články, chceš vedieť, ktorá zmena to spôsobila.

### P3 — Chatbot rezervuje priamo v konverzácii
`AI Nexus Link / Agenti / Rezervačný agent / R2` — typ sedenia: **agenti**, väčšie

- [ ] **Predtým majiteľ (klik, ~10 min):** rozšíriť `booking_services` na 2–3
  reálne typy konzultácií — „Bezplatná úvodná konzultácia 30 min", „Technický
  audit 60 min", „Online demo automatizácií 30 min". Inak nemá bot čo ponúkať.
- [ ] **R2:** `/api/chat` + Gemini function calling `najdi_sloty` a
  `vytvor_rezervaciu`, volajúce ten istý `lib/booking.ts` (žiadna duplicita).
  Tok: služba+čas → ponúkne termíny → **po výslovnom potvrdení** rezervuje →
  e-mail + lead.
- [ ] **V tom istom sedení:** zrušovací odkaz v potvrdzovacom e-maile
  (`status=cancelled`) — R1 ho nemá a je to diera.

**Prečo to má váhu.** Jediná vec, ktorá z chatbota spraví agenta, čo **koná**,
nie len odpovedá. A rezervácie predávame naprieč odvetviami.

### P4 — Agent na príspevky pre sociálne siete
`AI Nexus Link / Agenti / Social agent` — typ sedenia: **agenti** + klik v Directuse

- [ ] Po každom článku pripraví **2–3 varianty** príspevku (kratší na Facebook,
  odbornejší na LinkedIn) → do Directusu ako **koncepty**. Zverejňuje človek.
- [ ] Nová kolekcia `social_posts`. **Od začiatku pridať pole na médium**
  (obrázok/video URL), aby sa video dalo doplniť neskôr bez prerábania schémy.
- [ ] **Prívesok:** notifikácie na Telegram (čo agent spravil, čo zlyhalo) —
  ~30 riadkov, a je to zárodok klientskeho modulu „ozvi sa mi, keď príde dopyt".

**Prečo nepublikuje sám.** Facebook aj LinkedIn vyžadujú schvaľovanie prístupu
(dni až týždne) — tam takéto projekty zomierajú. A je to naša zásada: agenti
pripravujú koncepty, publikuje človek.
**Prečo teraz.** Nepotrebuje novú infraštruktúru — nový agent = nový súbor
a riadok v Directuse.

### P5 — Customizačný agent: dva weby z jednej šablóny
`AI Nexus Link / Frontend agent / M4` — typ sedenia: podľa nálezu, **väčšie**

- [ ] Suchý beh: druhá sada obsahu do tej istej šablóny → **dva rôzne weby**.
  Kostra už existuje ako skill `site-customizer`.

**Prečo to podceňujeme.** Je to jediný spôsob, ako zistiť, či je šablóna naozaj
riadená dátami, alebo má polovicu natvrdo v komponentoch. **Celá téza produktu
na tom stojí — a nikdy sme ju neoverili.** Ak je problém, chceme to vedieť
teraz, nie pri prvom klientovi.

### P6 — Kvalita obsahu: Writer a revízia článkov
`AI Nexus Link / Agenti / Obsahový agent (Writer)` — typ sedenia: **agenti / obsah**

- [ ] **Rôznorodejšie úvody** — Writer často začína rovnakým vzorcom
  („Predstavte si, je piatok večer…"). Presne podľa toho čitateľ spozná AI text.
- [ ] **Jednoduchšie obrázky** — časť generovaných je na naše témy zbytočne zložitá.
- [ ] **Popisné alt texty** — pre nevidiacich aj pre Google.
- [ ] **Revízia starších článkov** cez `revise_article.py` (máme napísaný, takmer
  nepoužitý) — smerom k NAŠIM riešeniam. Originál sa nemení, vzniká koncept.

**Prečo až šieste.** Po P1 budeš mať v logoch, **na čo sa ľudia naozaj pýtajú** —
takže sa revidujú články, ktoré chýbajú, nie tie, ktoré si tipneme.

---

## 🔴 Gatuje spustenie do Googlu (Pred-Google checklist)

*(Spustenie samotné je ZAMKNUTÉ — ide len na výslovný pokyn majiteľa.)*

- [ ] 🍪 **Cookie lišta + zásady ochrany osobných údajov** (GDPR — web zbiera
  leady cez formuláre). **Viaže sa na P1** — logovanie chatov bez tohto smie
  ukladať len metadáta.
- [x] 📄 **Stránkovanie blogu** — 6 článkov na stránku + „ďalšie". *(hotové)*
- [ ] 🎨 **Doladenie dizajnu** — priebežné vizuálne vylepšenia.
- [ ] 🔎 `SITE_INDEXABLE=true` (Railway) + Google Search Console — až po
  odškrtnutí bodov vyššie.

---

## 🔵 Čaká na majiteľa — sedenie s tým samo nepohne

- [ ] 📸 **Fotky pre 3 kytice bez obrázka** — Red Naomi, Tichá rozlúčka, Slnečné
  ráno. Majiteľ dodá, alebo sa vygenerujú v samostatnom kreatívnom sedení.
  Doplnenie = cesta do `fotky[]` v `content.ts`, **žiadny zásah do kódu**;
  potom riadok do `images/LICENSES.md`.
- [ ] 🛒 **E2 — WooCommerce ako zdroj katalógu.** Potrebuje **samostatnú
  inštanciu** WordPress + WooCommerce (**nemiešať** s `wp.digitalnapomoc.sk`).
  Kód je pripravený — mení sa len telo funkcií v `templates/kvetinarstvo/katalog.ts`.
- [ ] 🧑‍🌾 **E3 — produkt agent.** Stojí na E2.
- [ ] 📊 **Domerať Lighthouse** pre šablónu kvetinárstva — v cloud sedení chýba
  CLI, meria sa na deployi (cieľ ≥ 95, prístupnosť 100).

---

## 🟡 Otvorené, ale nie vo fronte

**Frontend:**
- [ ] **Responzivita (mobil)** — pár detailov (doplniť po prehliadke na mobile).
- [ ] **Interné odkazy v tele článku** po migrácii `www→wp` ukazujú na `wp.` —
  prelinkovať na `/blog/...`.
- [ ] 🎨 **Smer V4 do sekcie Služby na Domove** (šablóna Boma Flora, **nie**
  digitalnapomoc.sk). Majiteľ vybral V4 = Svadby ako veľký blok + 2×2 karty.
  Dnes je sekcia starým vzorom: `SluzbyZoznam` v
  `templates/kvetinarstvo/sections/bloky.tsx`, dáta `homeSluzby` v `content.ts`.
  **Mantinely:** data-driven (rozloženie z dát, nie natvrdo) a **NIE kopírovaním
  demo HTML**; ide sa cez `ui-ux-designer` → `frontend-dev` → `visual-qa`.
  Typ sedenia: dizajn, menšie.

**Rezervačný agent — ďalej za P3:**
- [ ] **R3 — pripomienky** (orchestrátor cron, deň vopred).
- [ ] **R4 — replikácia u klienta** (viď `plan-agenti.md`).

**RAG chatbot — ďalej za P1:**
- [ ] **Instantné doindexovanie** cez WP webhook (dnes 3×/týždeň v pipeline —
  `docs/rag-cron.md` Cesta B).

**Produktové podstránky:**
- [ ] **Predajné podstránky pre jednotlivé služby** — dnes karty len odkazujú
  (napr. `/rezervacia` = demo), chýba stránka typu „Rezervačný systém pre vašu
  firmu". Podobne chatbot. Doplniť pri spúšťaní do Googlu.
- [ ] Podstránky služieb `/sluzby/[slug]`.

**Drobnosti:**
- [ ] Fotka tímu (`frontend/public/team.jpg` + `components/about.tsx`).
- [ ] Reálny telefón v pätičke.
- [ ] Maskot značky (fialový robot) + jemné efekty na článkových obrázkoch.
- [ ] SEO+GEO agent v2 — automatické prelinkovanie + HowTo schéma.

---

## ⏸️ Odložené s dôvodom *(neškrtať — vieme, prečo tam nie sú)*

- **Kokpit nad Directusom** → odložené do **Fázy 5**. Directus sám je dnes
  dostatočný admin; väčší zmysel má stavať agentov pod ním ako legokocky.
  Rozhodnuté 22.8.2026, prehodnotiť v samostatnom plánovacom sedení.
- **M7 — AI poradca v katalógu kytíc** → odložené. Je to funkcia demo šablóny,
  nie kocka nášho systému. Prednosť majú veci, ktoré platia pre **každého**
  klienta. Štartový prompt B v `plan-agenti.md` ostáva pripravený.
- **MiniMax H3 lokálne (video)** → **odpadá.** Overené 22.8.2026: potrebuje
  ~42,5 GB váh a NVIDIA/Apple Silicon; majiteľov Mac má Intel + AMD Radeon Pro
  555X so 4 GB a 16 GB RAM. Video ideme **cez API** — overené naživo, 5 s klip
  za 70 sekúnd. Poznámka: `docs/podklady/`.
- **Hlas — výstup (bot číta nahlas)** → nie vo fronte. Kandidát Higgs Audio v3
  (hostované API zdarma), ale licencia je **nekomerčná** — „Creator Use Grant"
  kryje naše vlastné videá, **nie** produkt predávaný klientom. A slovenčina
  nie je potvrdená (dokumentácia spomína češtinu).
- **Hlas — vstup (diktovanie)** → ✅ **VYRIEŠENÉ.** Wispr Flow otestovaný
  22.8.2026: 153 slov, 1 chyba (`Railway`, opravená slovníkom). Netreba riešiť.
- **gstack (Garry Tan) naostro** → NIE. Je lokálny-first (Bun, symlinky,
  daemony) → do cloud sedení nesadne. **Cesta B:** preberáme jeho vzory ako
  vlastné skilly. Hotové: `design-shotgun`, `visual-qa`. Ostáva na zváženie:
  „plan-review pred kódom", „retro/reflect".
- **Hermes agent, agency-agents, free-claude-code** → posúdené 22.8.2026,
  neberieme. Dôvody v `docs/dennik.md`.

---

## 🟣 Roadmapa (detail vo `vizia.md` §8–11)

- [ ] **Vlastné „krabicové" riešenia + demo agenti** — vlastné hotové moduly,
  ktoré vieme nasadiť klientovi a zároveň ukázať ako živé demo. Kandidáti:
  rezervácie (✅ R1 naživo), dohadovanie schôdzok, zápis poznámok zo stretnutí,
  chatbot (✅ demo hotové), e-mail auto-odpoveď. Rovnaký lego vzor.
- [ ] **Obsahová stratégia blogu = predávať NAŠE riešenia** — články majú viesť
  k našim modulom, nie opisovať cudzie nástroje. *(Prekrýva sa s P6.)*
- [ ] **Woo služby napárované na agentov** — reálne produkty vo WooCommerce
  (Store API, embednutý checkout).
- [ ] **Frontend „mockup" agent** — z promptu vygeneruje náhľad webu; ukážky do
  portfólia ako predajný nástroj.
- [ ] **Newsletter** — posledný WordPress plugin, ktorý ešte nemáme nahradený.
  *(Neprediskutované — otvoriť na najbližšej porade.)*

---

## ✅ Nedávno vyriešené (pre kontext)

- [x] **Krok 5 časť „výstup/štýl odpovedí chatbota"** — PR #76 + #78, naživo.
- [x] **RAG chatbot naživo (prvé demo)** — odpovedá z nášho obsahu + cituje zdroje.
- [x] **Chatbot vie o šablónach a stavbe webov** — PR #72, overené naživo.
- [x] **Redizajn webu → svetlejší štýl**, **stránka „Čo je headless WordPress"**.
- [x] **SessionStart hook** — PR #52, aktívny.
- [x] **Obrázky článkov po migrácii `www→wp`**, alt z WP.
- [x] **E1 — katalóg kytíc zo súboru**, **R1 — rezervačný formulár naživo**.
