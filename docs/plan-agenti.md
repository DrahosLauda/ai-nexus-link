# Plán: ďalší agenti (rezervácie + e-mail + leady)

> Zoznam cieľov a **rozhodnutí** pre nasledujúce sedenia. Podrobný plán
> rezervačného agenta je nižšie (výstup plánovacieho sedenia, aug 2026).

## ⭐ ĎALŠIE SEDENIE = PORADA (strategická revízia CELÉHO projektu, aug 2026)

> **✅ PORADA ODBYTÁ (aug 2026).** Výstup — rozhodnutia, priorita naprieč
> projektom a štartový prompt pre prvý realizačný krok — je nižšie v sekcii
> **„PORADA — strategická revízia CELÉHO projektu (VÝSTUP)"**. Zadanie nižšie
> ostáva pre kontext.

> **Toto NIE je porada len o šablónach.** Je to strategická revízia **celého
> AI Nexus Link** — kam dať ďalšiu energiu naprieč všetkými vetvami projektu:
> tri vrstvy (WP obsah · Directus CRM · agenti), referenčný web
> `digitalnapomoc.sk`, produktoví agenti (článkový/SEO/RAG/rezervačný),
> WooCommerce a **produktizácia/SaaS (Fáza 5, `vizia.md`)**. Frontend šablóny sú
> len JEDNA z vetiev — porada ich má zvážiť oproti ostatným, nie ich pokračovať
> automaticky.
>
> **Stav pri zadaní (naprieč projektom):**
> - ✅ Referenčný web `digitalnapomoc.sk` (headless WP → Next.js), leady do
>   Directusu, technicky go-live — ale **zámerne skrytý pred Googlom**
>   (`SITE_INDEXABLE` vyp.), kým nie je „Pred-Google checklist" (cookie/GDPR…).
> - ✅ Produktoví agenti čiastočne naživo: **článkový (Writer) + SEO/GEO** agent
>   (WP koncepty), **RAG chatbot**, **rezervačný agent R1**. Fáza 3 (orchestrátor
>   ako trvalý Railway worker s cronom) ešte nie.
> - ✅ **Frontend agent** — knižnica šablón (M1) + vlajková šablóna kvetinárstvo
>   (M2, Boma Flora) naživo na `/ukazky/kvetinarstvo`, prepojená z domova.
> - ❌ **Zatiaľ žiadny platiaci klient** — všetko je referencia/demo.
>
> **Kľúčové zistenie na odpichnutie (šablóny):** M3 „rezervačný modul do
> kvetinárstva" **nesedí** — booking engine je pre termínové odvetvia
> (kaderníctvo, autoservis, zubár: „služba → deň → slot"). Kvetinárstvo funguje
> na **objednávku kytice / e-shop / svadobnú konzultáciu**, nie na sloty.

**Štartový prompt (copy-paste do nového sedenia):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(hlavne sekciu „ĎALŠIE SEDENIE = PORADA").

Toto je PLÁNOVACIE sedenie = PORADA (šetríme tokeny): nič nekóduj, len
rozhodujeme a zapisujeme. Cieľ: STRATEGICKÁ REVÍZIA CELÉHO PROJEKTU AI Nexus
Link (nie len frontend šablón) a rozhodnutie, kam dať ďalšiu energiu.

AGENDA:
0. ZOOM OUT na celý projekt — zhrň, kde je AI Nexus Link naprieč VŠETKÝMI
   vetvami (podľa vizia.md): referenčný web digitalnapomoc.sk, tri vrstvy
   (WP obsah / Directus CRM / agenti), produktoví agenti (Writer+SEO, RAG
   chatbot, rezervačný), frontend knižnica šablón, produktizácia/SaaS (Fáza 5).
   Čo je hotové a naživo vs. čo je len na papieri. Kde je najväčšia hodnota.
1. PRIORITA NAPRIEČ PROJEKTOM — čo posunie projekt najviac dopredu:
   (i) go-live digitalnapomoc.sk do Googla (Pred-Google checklist: cookie/GDPR);
   (ii) dotiahnuť/nasadiť produktových agentov (Fáza 3 orchestrátor worker);
   (iii) rozširovať frontend knižnicu šablón (2. odvetvie) alebo prehĺbiť
        kvetinárstvo (Woo/konfigurátor);
   (iv) customizačný agent M4 (z šablóny klientský web) — cesta k predaju;
   (v) ZÍSKAŤ PRVÉHO PLATIACEHO KLIENTA — čo na to reálne treba.
   Odporuč poradie s odôvodnením (hodnota vs. náklad vs. blízkosť k príjmu).
2. Mapovanie MODUL ↔ ODVETVIE — booking→kaderníctvo/autoservis/zubár (NIE
   kvetinárstvo); kvetinárstvo→WooCommerce / flower konfigurátor / svadobná
   konzultácia / objednávkový formulár (už má); chatbot (RAG)→kamkoľvek.
3. OBCHODNÝ MODEL — ako sa to celé speňaží (vizia.md: dodanie ako SaaS,
   párovanie agent↔služba, cenové balíky). Čo je najkratšia cesta k prvému €.
4. PRED-GOOGLE CHECKLIST — cookie lišta/GDPR + kedy zapnúť SITE_INDEXABLE.

VÝSTUP porady: rozhodnutia + PRIORITA naprieč projektom zapísané do
docs/plan-agenti.md (aktualizovať roadmapu/míľniky/mapovanie modulov), a hotový
ŠTARTOVÝ PROMPT pre prvé realizačné sedenie zvoleného kroku. Commit + push do
vetvy môžeš; merge do main a zmeny v Railway/Directus až po mojom výslovnom
súhlase. Rešpektuj CLAUDE.md (slovenčina, minimalizmus, tri zdroje pravdy,
least privilege).
```

---

# PORADA — strategická revízia CELÉHO projektu (VÝSTUP, aug 2026)

> Výstup strategickej porady (zadanie ↑). Rozhodnutia a priorita naprieč celým
> AI Nexus Link. **Odporúčania sú moje (Claude); finálne poradie potvrdí
> majiteľ.** Kým nepovie inak, prvý realizačný krok = **go-live (Pred-Google
> checklist)**. Merge do `main` a zmeny v Railway/Directus výhradne po súhlase.

## 0. Zoom-out — kde je projekt naprieč VŠETKÝMI vetvami

| Vetva projektu | Stav | Poznámka |
|---|---|---|
| **Referenčný web `digitalnapomoc.sk`** | ✅ technicky naživo · ❌ **skrytý pred Googlom** | `SITE_INDEXABLE` vyp.; blokuje len cookie lišta + GDPR zásady |
| **Tri vrstvy** (WP obsah · Directus CRM · agenti) | ✅ všetky tri žijú | `client_leads` zbiera leady; hranice čisté |
| **Writer + SEO/GEO agent** | ✅ naživo (WP koncepty) | reťazec Writer→SEO beží; Fáza 3 worker ešte nie |
| **RAG chatbot** | ✅ prvé demo naživo | odpovedá z nášho obsahu + cituje zdroje (hrubá verzia) |
| **Rezervačný agent** | ✅ R1 naživo (widget `/rezervacia`) | R2 (chatbot rezervuje), R3 (pripomienky), R4 (replikácia) ešte nie |
| **Frontend knižnica šablón** | ✅ M1 infra + M2 Boma Flora (7 str., reálne fotky, QA) | ✅ **AKTUALIZÁCIA aug 2026: už ZLÚČENÉ v `main`** (`frontend/templates/kvetinarstvo/` + mount `/ukazky`); pôvodná zmienka o vetve `m1-frontend-agent-templates` je neaktuálna |
| **Fáza 3** (orchestrátor ako trvalý cron worker) | ❌ len plán | agenti bežia manuálne/v pipeline, nie ako 24/7 worker |
| **Produktizácia / SaaS (Fáza 5)** | ❌ len na papieri | multi-tenant, centrálny admin |
| **Platiaci klient** | ❌ **žiadny** | všetko referencia/demo |

**Kľúčové zistenie porady:** najväčšia nevyužitá hodnota **nie je v novom kóde**
— je v **už hotovej práci, ktorá nie je vidno**: (a) referenčný web je skrytý
pred Googlom, (b) vlajková šablóna + booking + chatbot sedia na nezlúčených
vetvách. Projekt má vybudované **jadro**; chýba mu **viditeľnosť a prvý
zákazník**, nie ďalšie demo. → Priorita = **speňaž a zviditeľni hotové, potom
stavaj nové.**

## 1. Priorita naprieč projektom (odporúčané poradie)

> **⚠️ OPRAVA (majiteľ, aug 2026):** Skoršie poradie s go-live ako #1 NEPLATÍ.
> **Go-live (zverejnenie do Googla) ani predaj NIE sú aktuálna priorita.**
> Go-live môže prísť **až keď majiteľ dá VÝSLOVNÝ pokyn** — a jeho predpokladom je
> **vlastná firma/subjekt, všetky dokumenty a plný súlad s legislatívou** (GDPR,
> obchodné podmienky…). **Claude NIKDY nenavrhuje go-live ako ďalší krok sám** —
> čaká na jasný pokyn. To isté platí pre „prvého platiaceho klienta" (viazané na
> existenciu firmy/subjektu). Nesmerovať k tomu, kým to majiteľ nepovie.

**Aktuálna priorita = DOKONČIŤ PRODUKT** (staviame, nepredávame — kým nie je firma
a dokumenty). **Čo presne robíme, sa dohodne v plánovacom sedení.** Kandidáti
(hrubé poradie, finálne slovo v pláne):

**① Kokpit — jedno miesto na ovládanie agentov (ťažisko).** Chýbajúci kus systému:
rozbehnúť „walking skeleton" (tenký rez nad Directusom — zapni/spusti agenta +
vidíš logy). Prvé plánovacie sedenie ho rozkreslí.

**② Dotiahnuť produktových agentov (Fáza 3).** Orchestrátor ako trvalý worker
(cron), presun chatbot configu do Directusu, spustiť `rag_index.py`, chatbot R2.

**③ Rozšíriť/prehĺbiť šablóny.** 2. odvetvie (kaderníctvo) alebo Woo/konfigurátor
do kvetinárstva — overenie replikovateľnosti.

> **Princíp:** staviame produkt do „hotového" stavu. **Go-live a predaj sú zamknuté
> za firmou + dokumentmi + pokynom majiteľa** — dovtedy sa k nim nesmeruje. Poradie
> build úloh sa vyberá v plánovacom sedení, jedna po druhej.

## 2. Mapovanie MODUL ↔ ODVETVIE

| Modul | Sedí na odvetvie | Nesedí / poznámka |
|---|---|---|
| **Rezervačný engine/widget** (`lib/booking.ts`) | kaderníctvo, autoservis, zubár, kozmetika, reality — *„služba → deň → slot"* | **NIE kvetinárstvo** (nefunguje na sloty) |
| **Kvetinárstvo** | objednávka kytice / e-shop (Woo) · **svadobná/event konzultácia** (booking = konzultácia, nie kúpa) · flower konfigurátor · objednávkový formulár (už má) | booking tu = konzultácia, nie predaj kytice |
| **RAG chatbot** | **ktorékoľvek odvetvie** (číta klientov obsah) | univerzálny |
| **Writer + SEO/GEO** | **ktorékoľvek** (obsahový marketing) | univerzálny |

**Oprava pôvodného M3:** „rezervačný modul **do kvetinárstva**" bol
nesprávny — booking je pre termínové odvetvia. V kvetinárstve má booking zmysel
len ako **svadobná/event konzultácia**; kúpa kytice ide cez objednávku / Woo /
konfigurátor. Prvé „šablóna + booking" demo naostro preto radšej na
**kaderníctve/autoservise** (2. šablóna), nie na kvetinárstve.

## 3. Obchodný model — najkratšia cesta k prvému €

**Odporúčaný model: balík „web na kľúč + lego agenti ako upsell"** (vízia §4 SaaS
smer, §8 párovanie agent ↔ služba):

- **Vstup (jednorazovo):** odvetvový **šablónový web na kľúč** — customizácia
  obsahu/brandingu, **nie kód** (M4). Boma Flora je dôkaz úrovne („takéto weby
  staviame").
- **Upsell (mesačne, opakovaný príjem = SaaS smer):** **lego agenti** — chatbot,
  rezervácie, Writer+SEO obsah — každý napojený bez duplicity logiky.

**Najkratšia cesta k prvému €:** vziať **jednu reálnu firmu** (ideálne z okruhu
majiteľa) a **customizovať jej vlajkovú šablónu naostro** (M4 nie ako suchý beh,
ale pre klienta) + ponuka aspoň jedného agenta mesačne. **Predpoklad
dôveryhodnosti = go-live referencie (krok ①).**

**Nižší prah (alternatíva):** nasadiť **jeden modul (chatbot / rezervácie)
existujúcej firme na jej web** — menší záväzok pre klienta, hneď opakovaný
príjem, priamo „ukáž nepovedz" z nášho živého dema. Sumy/cenové balíky =
samostatné kolo (rozhodnutie majiteľa: neskôr).

## 4. Pred-Google checklist (gate go-live) — konkrétne

Zo `docs/dennik.md` backlogu, zoradené:

- [ ] 🍪 **Cookie lišta + stránka „Zásady ochrany osobných údajov"** (GDPR — web
  zbiera leady `client_leads` + rezervácie `bookings`). **Tvrdý blokér.**
- [x] Stránkovanie blogu — *hotové.*
- [ ] 🎨 Doladenie dizajnu — priebežné, **nie tvrdý blokér** (dá sa iterovať naživo).
- [ ] 🔎 **Zapnúť:** `SITE_INDEXABLE=true` (Railway) + Google Search Console (`www`);
  over `robots.ts`/`sitemap`/`llms.txt` (SEO/GEO skill je hotový). **Až po cookie/GDPR.**

**Kedy `SITE_INDEXABLE`:** až po nasadení cookie lišty + zásad OÚ. Dizajn nie je
tvrdý blokér indexovania; **GDPR áno**.

**Minimalizmus (rebrík z CLAUDE.md):** ak web nemá zbytočný analytics/tracking a
zbiera len funkčné cookies + leady cez formulár, stačí **jednoduchá informačná
lišta + stránka zásad**, nie ťažký consent manager. Rozsah potvrdiť pri
realizácii podľa toho, čo web reálne nastavuje (najprv skontrolovať, či beží
nejaký analytics/tracking).

## Štartový prompt pre PRVÉ realizačné sedenie (go-live — Pred-Google checklist)

```
Najprv si prečítaj docs/dennik.md, docs/vizia.md, docs/go-live.md a
docs/plan-agenti.md (sekcia „PORADA — strategická revízia CELÉHO projektu").

Realizačné sedenie: sprav Pred-Google checklist pre spustenie digitalnapomoc.sk
do Googla. Konkrétne:
1) Zisti, čo web reálne nastavuje za cookies (beží nejaký analytics/tracking, či
   len funkčné?) — podľa toho zvoľ rozsah: jednoduchá informačná cookie lišta
   (ak žiadny tracking) vs. consent. Minimalizmus (rebrík z CLAUDE.md) — žiadny
   ťažký consent manager, ak netreba.
2) Stránka „Zásady ochrany osobných údajov" (GDPR) — web zbiera osobné údaje cez
   formuláre (client_leads) a rezervácie (bookings). Slovenčina, dizajn webu.
3) Cookie lišta komponent (prístupná: klávesnica, fokus, reduced-motion, mobil,
   dotykové ciele) — napojená na stránku zásad OÚ.
4) Priprav prepnutie SITE_INDEXABLE=true + Google Search Console (www) ako
   klik-návod (Railway env + GSC) a over robots.ts/sitemap/llms.txt, že po
   zapnutí bude web správne indexovateľný (SEO/GEO skill).
Pred písaním Next.js kódu čítaj node_modules/next/dist/docs/ (frontend/AGENTS.md).
Over lint + build. Vetva claude/... , commit + push; merge do main a zmeny v
Railway (SITE_INDEXABLE, GSC) až po mojom výslovnom súhlase. Klik-časti vypíš
ako návod.
```

> **Poznámka k viditeľnosti hotovej práce (krok ②):** vlajková šablóna Boma
> Flora + booking R1 sú na **nezlúčených vetvách**. Pri prechode na krok ② treba
> najprv **revízia → merge do `main`** (po súhlase majiteľa), inak zostáva
> najlepšia referencia neviditeľná.

---

# Task č.1 — SessionStart hook (plán realizačného sedenia, aug 2026)

> **Výstup plánovacieho sedenia (aug 2026).** Majiteľ zvolil úlohu č.1 z kandidátov
> na dokončenie produktu. Toto je **plán + hotový štartový prompt** pre samostatné
> realizačné sedenie. Nič sa v tomto sedení nekódovalo.

## Cieľ a rozhodnutia

**Cieľ:** SessionStart hook, ktorý pri štarte **každého** sedenia (a) **tvrdo
naservíruje pamäť projektu** (Backlog z dennika + silná inštrukcia prečítať
`dennik.md`/`vizia.md`), aby to nebolo len „mäkký" pokyn v `CLAUDE.md`, a
(b) **predinštaluje frontend závislosti**, aby lint/build/testy bežali hneď.

**Zistenie (dôležité):** skill `session-start-hook` je primárne na **inštaláciu
závislostí**, nie na načítanie kontextu. Načítanie kontextu robíme cez
**injektovanie kontextu** — hook vypíše na stdout JSON
`hookSpecificOutput.additionalContext`, ktorý sa vloží do sedenia na štarte.

| # | Rozhodnutie | Voľba | Prečo |
|---|---|---|---|
| 1 | **Rozsah hooku** | **Oboje** — kontext + závislosti | Obe sú lacné pridať; kontext = pôvodný zámer, závislosti = zdokumentovaná bolesť M1 („node_modules v cloude nie je predinštalované"). |
| 2 | **Miera „tvrdosti" kontextu** | **Backlog + silná inštrukcia** | `dennik.md` má ~36k tokenov a rastie → plné vloženie každé sedenie je drahé. Backlog (živý stav, začiatok súboru) + pokyn dočítať zvyšok podľa potreby je stred medzi cenou a istotou. |
| 3 | **Sync vs async** | **Synchronne (prvá iterácia)** | Kontext musí byť prítomný **pred** štartom (async by ho nestihol vložiť). `npm install` (nie `npm ci`) využije cache kontajnera → po prvom behu rýchly. Ak bude štart pomalý, závislosti presunieme na async neskôr. |
| 4 | **Kde sa registruje** | `.claude/settings.json` (verzované) | Aby platil pre **všetky** budúce sedenia. Dnes súbor neexistuje → vytvoriť. |

## Čo hook presne robí (dva účely v jednom skripte)

Súbor `.claude/hooks/session-start.sh` (spustiteľný, `chmod +x`), idempotentný,
neinteraktívny, žiadne tajomstvá:

1. **Kontext (vždy — aj lokálne aj web):**
   - Prečíta `docs/dennik.md`, **vyreže sekciu „## Backlog …"** (od nadpisu Backlog
     po nasledujúci `## ` nadpis) — je to živý stav, číta sa **za behu**, takže
     nikdy nie je zastaraný.
   - Cez `python3` (bezpečné JSON escapovanie diakritiky/emoji/úvodzoviek) poskladá
     `hookSpecificOutput.additionalContext` obsahujúci:
     - **(a) silnú inštrukciu:** *„Komunikuj po slovensky. Skôr než začneš, prečítaj
       `docs/dennik.md` (aspoň Backlog nižšie + najnovšie záznamy) a `docs/vizia.md`.
       Rešpektuj „Pravidlá spolupráce" z `CLAUDE.md` — go-live a predaj sú ZAMKNUTÉ
       (len na výslovný pokyn), 1 typ na sedenie, 1 úloha → dokončiť → overiť, žiadny
       zhon, presné príkazy."*
     - **(b) živý Backlog** vyrezaný z dennika.
   - **Pozor na stdout:** parsované JSON musí byť **jediný** čistý výstup na stdout;
     výstup `npm install` presmerovať na **stderr** (`1>&2`), nech nerozbije JSON.

2. **Závislosti (len web — `[ "$CLAUDE_CODE_REMOTE" = "true" ]`):**
   - `cd "$CLAUDE_PROJECT_DIR/frontend" && npm install 1>&2` — idempotentné, využije
     cache kontajnera (`npm install`, **nie** `npm ci` — pozn. skillu).
   - *(Voliteľne, na zváženie v realizácii:* orchestrátor `pip install -r
     requirements.txt` do venv — väčšina web sedení je však frontend; nechať zvážiť.)*
   - Lokálny Mac to preskočí (`CLAUDE_CODE_REMOTE` != true) → tam už `node_modules` má.

3. **Registrácia** v `.claude/settings.json`:
   ```json
   { "hooks": { "SessionStart": [ { "hooks": [
     { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh" }
   ] } ] } }
   ```

## Overenie (v realizačnom sedení)

- Spustiť hook ručne: `CLAUDE_CODE_REMOTE=true ./.claude/hooks/session-start.sh`
  → over, že **stdout je platné JSON** s `additionalContext` (obsahuje inštrukciu +
  Backlog) a že sa poskladá bez chyby (`python3 -c 'import json,sys;json.load(sys.stdin)'`).
- Over, že vznikol `frontend/node_modules` a `npm run lint` prejde na jednom súbore.
- Idempotencia: druhý beh nespadne, `npm install` hlási „up to date".

## Poznámky (minimalizmus, bezpečnosť, aktivácia)

- **Rebrík minimalizmu:** hook je natívna funkcia platformy (bod 4 rebríka) —
  presne prípad, keď sa oplatí. Žiadna nová závislosť, len bash + `python3` (už máme).
- **Bezpečnosť:** skript iba **číta** `docs/` a inštaluje verejné npm balíky; žiadne
  tajomstvá, žiadny sieťový zápis, žiadny interaktívny vstup.
- **⚠️ Aktivácia:** hook začne platiť pre **všetky** budúce sedenia **až po merge do
  `main`** (kým je na vetve `claude/…`, neplatí). Merge až po výslovnom súhlase majiteľa.

## Hotový štartový prompt (copy-paste do nového realizačného sedenia)

```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(sekcia „Task č.1 — SessionStart hook").

Realizačné sedenie (TYP: konfigurácia/infra — nemiešaj s iným): postav
SessionStart hook podľa plánu v plan-agenti.md. Použi skill session-start-hook
na mechaniku, ale prispôsob ho nášmu zámeru (nielen závislosti, aj kontext).

Konkrétne:
1) Vytvor .claude/hooks/session-start.sh (spustiteľný, idempotentný,
   neinteraktívny, synchronne — bez async v prvej iterácii). Robí DVE veci:
   a) KONTEXT (vždy): prečíta docs/dennik.md, vyreže sekciu „## Backlog …"
      (po nasledujúci ## nadpis) a cez python3 poskladá na stdout JSON
      hookSpecificOutput.additionalContext = silná inštrukcia (slovenčina;
      prečítaj dennik.md + vizia.md skôr než začneš; rešpektuj „Pravidlá
      spolupráce" z CLAUDE.md — go-live/predaj zamknuté, 1 typ/sedenie, 1 úloha,
      žiadny zhon) + vyrezaný živý Backlog. stdout musí byť ČISTÉ JSON.
   b) ZÁVISLOSTI (len web, [ "$CLAUDE_CODE_REMOTE" = "true" ]): cd frontend &&
      npm install, výstup presmeruj na stderr (1>&2), nech nerozbije JSON.
      (Orchestrátor pip zváž, netreba nasilu.)
2) Zaregistruj hook v .claude/settings.json (vytvor súbor; ak existuje, zluč
   konfiguráciu SessionStart).
3) Over: CLAUDE_CODE_REMOTE=true ./.claude/hooks/session-start.sh → stdout je
   platné JSON (python3 -c 'import json,sys;json.load(sys.stdin)') s inštrukciou
   aj Backlogom; vznikol frontend/node_modules; npm run lint prejde na jednom
   súbore; druhý beh je idempotentný.
Nič nedeployuj. Vetva claude/... , commit + push. Upozorni ma, že hook začne
platiť pre všetky sedenia až po merge do main — merge až po mojom súhlase.
```

---

# Ponaučenia z podkladov (brainstormy z Google Docs, aug 2026)

> Majiteľ dodal 6 skorších dokumentov (vetva `podklady`, `docs/podklady/`):
> *Master Architecture Blueprint*, *FABLE PROTOCOL V2*, *Knižnica IT expertov*,
> *Architektura agentického systému čo stavia sám seba*, *AI Pamäť (OKF / LLM
> Wiki / Memanto)*, *Wayland AI Agents*. **Boli to brainstormy** (prevažne s
> Gemini „programovacím partnerom") — nadšené a inšpiratívne, ale miestami idú do
> rozsahu, ktorý sme si vedome orezali. Preto z nich **berieme len to, čo sedí do
> vízie a minimalizmu**; zvyšok vedome nie. Veľká časť je aj tak už postavená
> (tri vrstvy, lego agenti, výkladná skriňa, ROI kalkulačka, agency-agents).

## ✅ Berieme (zapadá, lacné)

| Čo | Prečo / kam | Náklad |
|---|---|---|
| **FABLE charta pre produkčných agentov** | Anti-halucinačná disciplína (VERIFIED/DERIVED/ESTIMATE, „neviem" je OK, najmenšie riešenie). → základ `system_prompt` v `agent_config` pre **RAG chatbota** a budúci konverzačný agent. *(Directus klik-časť po súhlase.)* | ~0 |
| **OKF pre znalostnú bázu** | `.md` + YAML hlavička (`type:`), čitateľné pre ľudí aj agentov, bez závislosti. → postupne dať dokom v `docs/` OKF hlavičky (lepšie pre RAG aj štart sedení). | nízky |
| **Playground simulátory na webe** | „Skús, ako agent spracuje dopyt autoservisu/reality" — predajný „ukáž, nepovedz" prvok. → kandidát **po go-live**, sedí k demo agentom. | stredný |
| **Potvrdenie KOKPITU** | Ich „Pracovňa/Dashboard" (celoobrazovkový chat + naživo sa vykresľuje systém) **nezávisle potvrdzuje**, že chýbajúca ovládacia vrstva = kokpit je správny ďalší veľký kus (viď mapa `nexus-mapa.html`). | — |

**Menšie na neskôr (až pri Fáze CRM/Woo):** CRM pipeline kolekcie
(`crm_campaigns`, `crm_interactions`), abandoned-cart / e-commerce marketing
agent, mobilné schvaľovanie human-in-the-loop (push/Telegram).

## 🔴 Vedome NEberieme (a prečo)

- **Auto-generovanie + auto-deploy celého React webu z chatu** — je to presne
  **naivná cesta „jeden prompt → web", ktorú sme zamietli** v prospech
  kurátorských šablón + ľudskej brány kvality. Držíme naše rozhodnutie.
- **Wayland (getwayland) ako produkčný runtime** — je to **lokálny desktopový
  agent** (beží na PC), nesedí na hostovaný 24/7 multi-tenant SaaS. *(Možno
  neskôr ako nástroj na lokálne agentúrne služby / build-time, nie ako chrbtica.
  Pozn.: „Wayland" máme aj ako krycí názov článkového agenta — nepomýliť.)*
- **Vertex AI / GCP + per-klient Vercel** — zbytočná ťarcha; držíme **Gemini API
  + Z.ai na Railway**.
- **Programatické SEO (tisíce landing pages)** — riziko spamu a penalizácie
  Googlom; radšej **málo kvalitných** stránok (naša `seo-geo-frontend` skill).

## Pracovný režim (šetrenie tokenov)
- **Plánovacie sedenie:** prečítať `dennik.md` + `vizia.md` + tento súbor →
  dohodnúť rozhodnutia → napísať podrobný plán po krokoch sem **+ hotový
  štartovací prompt pre realizačné sedenie** (na copy-paste) → skončiť.
  Nič sa needuplikuje, nekóduje — len plán.
- **Realizačné sedenia:** vziať plán a spraviť jeden ucelený krok (kód na vetve,
  test, merge po súhlase). „Na hrubo", dolaďovať neskôr.

## Ciele (celý balík „krabicových" agentov)
1. **Rezervačný agent** — odvetvovo neutrálny: pozrie voľné termíny/obsadenosť,
   po dohode vytvorí rezerváciu, pošle **potvrdenie e-mailom** a vytvorí **lead**.
   Cieľové odvetvia: realitky, kaderníctva, autoservisy, zubári, kozmetika…
2. **Automatické odpovede na e-maily** — agent prečíta príchodzí e-mail, pripraví
   (draft) odpoveď; kvalitu čerpá z nášho obsahu (RAG).
3. **Chatbot vytvára leady + e-mail** — keď návštevník nechá kontakt, chatbot
   zapíše lead (`client_leads`) a pošle potvrdenie.

---

# ROZHODNUTÉ (plánovacie sedenie, aug 2026)

Používateľ: *„nech je to technicky dobre a profesionálne, u nás aj neskôr dobre
replikovateľné pre klientov; čistý a ľahký kód, za ktorý by sa odborník nehanbil."*
Preto sú rozhodnutia vedené replikovateľnosťou a čistotou, nie skratkami.

| Rozhodnutie | Voľba | Prečo |
|---|---|---|
| **Kde žijú termíny/kalendár** | **Directus kolekcie** (`booking_*`) | Jediná cesta k „krabici" pre všetky odvetvia; klient spravuje v admine; prepojenie na CRM `client_leads`; rovnaký token/lego vzor. Google Calendar/Woo viažu na jedného klienta → zamietnuté pre v1. |
| **Ako zákazník rezervuje** | **Engine najprv → widget ako prvé demo → chatbot v 2. kroku** | Logika je spoločná (`lib/booking.ts`). Widget = nízke riziko, stabilné demo. Konverzačný agent (vízia „agent dohodne všetko") sa napojí na ten istý engine bez prepisu. |
| **E-mail (spoločný pre všetky 3 agenty)** | **Hosting SMTP** (hostcreators) — hlavná cesta; **Resend** ako záložný plán | Schránku už máme, 0 € navyše, žiadna registrácia. Keďže posielame **cez SMTP server hostingu**, doména `digitalnapomoc.sk` má **SPF/DKIM už nastavené** → dobré doručovanie (pôvodný argument proti hostingu odpadá). Pre „krabicu" prirodzené — každý klient má vlastnú schránku. `lib/email.ts` píšeme **s vymeniteľným poskytovateľom** → prechod na Resend (vyššie objemy/analytika) je neskôr len zmena configu, nie prepis. |
| **Kde beží** | **Frontend Next.js API** (real-time zápis + potvrdenie); **orchestrátor** až na pripomienky (cron) | Rezervácia je interakcia na webe → `/api/booking/*` (ako `/api/lead`, `/api/chat`). Pripomienky „deň vopred" sú prirodzene cron → orchestrátor. |

**Zásada proti dvojitej rezervácii:** Postgres **exclusion constraint**
(`tstzrange` + `btree_gist`) na tabuľke `bookings` — DB fyzicky nedovolí prekryv
na tom istom zdroji. To je správne, odborné riešenie (nie iba kontrola v appke).
App navyše robí re-check slotu tesne pred zápisom (rýchla spätná väzba používateľovi).

**Časové pásmo:** v DB ukladáme **UTC** (`timestamptz`), zobrazujeme
**Europe/Bratislava**. Nikdy neukladať „naivný" lokálny čas.

---

# Podrobný plán — Rezervačný agent (po krokoch)

Každý krok = jedno realizačné sedenie (ucelený, otestovateľný celok). Vetva,
commit, push; **merge do `main` a zmeny v Railway/Directus až po súhlase**.

## Krok R0 — Dátový model v Directuse (základ, replikovateľný)

**Cieľ:** čistá, odvetvovo neutrálna schéma. Tri univerzálne pojmy:
**zdroj** × **služba** × **dostupnosť** → z nich engine počíta voľné sloty.

**Directus kolekcie (klik v admine + referenčná SQL v repe):**

- **`booking_resources`** — kto/čo má kapacitu (zubár / kreslo / kaderníčka /
  zdvihák / maklér). Polia: `name`, `is_active`, (neskôr farba/poradie).
- **`booking_services`** — čo sa rezervuje. Polia: `name`, `duration_min`
  (dĺžka slotu), `buffer_min` (rezerva po službe, default 0), `slot_step_min`
  (krok mriežky, default = `duration_min`), `description`, `is_active`,
  `resource` (M2O — ktorý zdroj službu poskytuje; nullable = ktorýkoľvek).
- **`booking_availability`** — otváracie hodiny na zdroj a deň v týždni. Polia:
  `resource` (M2O), `weekday` (0–6), `start_time`, `end_time`. (Viac riadkov =
  napr. obedná prestávka rozdelí deň na dopoludnie/popoludnie.)
- **`booking_blackouts`** — blokované termíny (dovolenka, sviatok, obed). Polia:
  `resource` (M2O, nullable = platí pre všetkých), `start`, `end` (timestamptz),
  `reason`.
- **`bookings`** — samotné rezervácie. Polia: `service` (M2O), `resource` (M2O),
  `start`, `end` (timestamptz), `customer_name`, `customer_email`,
  `customer_phone`, `note`, `status` (`confirmed`/`cancelled`, default
  `confirmed`), `source` (`web-widget`/`chatbot`), `lead` (M2O na `client_leads`),
  `created_at`.

**Referenčná SQL v repe:** `orchestrator/booking_schema.sql` (vzor podľa
`rag_schema.sql`) — hlavne **exclusion constraint** proti prekryvu:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    resource WITH =,
    tstzrange("start", "end") WITH &&
  ) WHERE (status = 'confirmed');
```

**Token (least privilege):** `reservation-bot` —
read `booking_services`/`booking_resources`/`booking_availability`/`booking_blackouts`,
read+create (príp. update na zrušenie) `bookings`, create `client_leads`.
Politika + rola v Directuse ako pri `frontend-bot`/`orchestrator-bot`
(recept v `docs/directus.md`).

**Klik-časť (po súhlase):** vytvoriť kolekcie + token v Directuse; spustiť
`booking_schema.sql` v Postgrese (Railway → Console). Seed dáta pre naše demo:
1–2 zdroje, zopár služieb, otváracie hodiny (napr. Po–Pia 9:00–17:00).

**Výstup sedenia:** `orchestrator/booking_schema.sql` + `docs/directus.md`
doplnený o rezervačné kolekcie a token. (Kolekcie sa zakladajú klikaním —
kód zatiaľ žiadny beh.)

## Krok R1 — Rezervačný engine + widget (prvé živé demo, frontend)

**Cieľ:** návštevník na `/rezervacia` vyberie službu → deň → uvidí voľné sloty
→ vyplní kontakt → potvrdí → príde e-mail, vznikne rezervácia + lead.

**Čistá logika (bez I/O, testovateľná):** `frontend/lib/booking.ts`
- `computeFreeSlots({ service, resource, availability, bookings, blackouts, date })`
  → zoznam voľných začiatkov. Postup: z `availability(weekday)` vygeneruj
  kandidátov krokom `slot_step_min`, každý dĺžky `duration_min + buffer_min`;
  odfiltruj tie, čo sa prekrývajú s existujúcimi `bookings` alebo `blackouts`;
  odfiltruj minulosť. Všetko v UTC, čisté funkcie → **unit testy**.

**Prístup k dátam:** `frontend/lib/booking-data.ts` — čítanie kolekcií a zápis
rezervácie cez Directus REST (vzor `submit-lead.ts` / `/api/lead`).

**API routes:**
- `GET /api/booking/slots?service=<id>&date=<YYYY-MM-DD>` → voľné sloty
  (číta Directus → `computeFreeSlots`).
- `POST /api/booking/create` → validácia + honeypot + rate limit (vzor
  `/api/lead`); **re-check slotu tesne pred zápisom**; zápis `bookings`
  (constraint chytí súbeh → 409 „termín obsadený"); zápis/prepojenie
  `client_leads` (source `rezervacia`); odoslanie e-mailov.

**E-mail:** `frontend/lib/email.ts` — **poskytovateľ vymeniteľný** (jednoduché
rozhranie „pošli e-mail"). Hlavná implementácia = **hosting SMTP** (hostcreators)
cez `nodemailer` (štandardná, čistá knižnica; SMTP funguje, lebo frontend beží na
Railway ako **Node server**, nie edge). Záložná implementácia = **Resend** cez
`fetch` — zapne sa zmenou configu, bez prepisu volajúceho kódu. Dve správy:
**potvrdenie zákazníkovi** (kedy, čo, kde, možnosť zrušenia) + **notifikácia
prevádzke** (`BUSINESS_NOTIFY_EMAIL`). Slovenské šablóny.

**Widget:** `frontend/app/rezervacia/page.tsx` + `components/booking-widget.tsx`
- Tok: služba → (zdroj, ak treba) → kalendár (deň) → voľné sloty → kontakt → potvrdenie.
- Dizajn: v štýle webu (svetlý, prístupný, mobil), stavy načítania/chyby/úspechu.
- Prepojiť z domovskej sekcie Služby ako živé demo („Vyskúšajte rezerváciu").

**Env (Railway frontend):** `SMTP_HOST`, `SMTP_PORT` (zvyčajne 587), `SMTP_USER`,
`SMTP_PASS` (schránka na hostcreators), `BOOKING_FROM_EMAIL`
(napr. `rezervacie@digitalnapomoc.sk`), `BUSINESS_NOTIFY_EMAIL`, rezervačný
`DIRECTUS` token (buď zdieľať s existujúcim, alebo pridať `RESERVATION_TOKEN`).
*(Záložná cesta Resend: `RESEND_API_KEY` + prepínač poskytovateľa — neaktívne.)*

**Klik-časť (po súhlase):** vytvoriť/použiť schránku na hostcreators
(napr. `rezervacie@digitalnapomoc.sk`) + získať SMTP údaje; Railway Variables;
seed dáta z R0. *(Overenie domény cez DNS netreba — hosting SPF/DKIM už rieši.)*

**Overiteľné v sedení:** `lint` + `build`; unit testy `booking.ts` (sloty,
prekryvy, blackouty, minulosť, časové pásmo). Naživo (Directus/SMTP) až na Railway.

## Krok R2 — Konverzačný agent (chatbot „dohodne všetko")

**Cieľ:** vízia „náš agent rovno všetko dohodne" — rozšíriť existujúci RAG
chatbot o rezervačný tok, aby vedel nájsť termín a potvrdiť ho v konverzácii.

- Rozšíriť `/api/chat` o **nástroje** (Gemini function calling):
  `najdi_sloty(sluzba, datum)` a `vytvor_rezervaciu(...)` — obe volajú **ten istý**
  `lib/booking.ts` / `booking-data.ts` (žiadna duplicita logiky).
- Chatbot vedie tok: zistí službu a preferovaný čas → ponúkne voľné termíny →
  po potvrdení vytvorí rezerváciu → e-mail + lead (rovnako ako widget).
- Osobnosť/pravidlá z `agent_config` (riadok `chatbot`/`reservation`).
- **Bezpečnosť:** chatbot smie iba **čítať sloty** a **vytvoriť rezerváciu** —
  nič iné (žiadny zápis do WP/inde). Ochrana proti nechcenej rezervácii:
  explicitné potvrdenie používateľom pred zápisom.

**Overiteľné:** jednotkové testy nástrojového rozhrania; naživo na Railway.

## Krok R3 — Pripomienky (orchestrátor, cron)

**Cieľ:** znížiť no-show — pripomienka deň vopred.

- `orchestrator/reminder_agent.py` — číta nadchádzajúce rezervácie z Directus,
  pošle pripomienku (hosting SMTP), zapíše `agent_logs`. Rovnaký lego vzor
  (config `nacitaj_config("reservation_reminder")`, `zapis_log`).
- Railway **cron** (denne ráno). `agent_config` riadok `reservation_reminder`.
- Neskôr: **SMS** (Twilio) namiesto/popri e-maile — pre pripomienky často účinnejšia.

## Krok R4 — Replikácia pre klienta (produktizácia)

- **Nový klient = nová sada configu** (services/resources/availability),
  branding e-mailov, `from` adresa — **žiadny nový kód**. To je zmysel R0–R1.
- Neskôr **multi-tenant** (Fáza 5 vízie): `tenant_id` na `booking_*` kolekciách
  + izolácia dát a tokenov. Do v1 zámerne nejdeme (jedno-klientské demo u nás).

---

## Prierezové (platí pre celý balík)

- **Spoločný stavebný kameň — e-mail:** `lib/email.ts` (hosting SMTP, poskytovateľ
  vymeniteľný, Resend ako záloha) použijú všetky tri ciele (rezervácie,
  chatbot-leady, e-mail auto-odpoveď). Postaviť raz, čisto, s abstrakciou.
- **GDPR:** rezervácie ukladajú osobné údaje (meno/e-mail/telefón) → nadväzuje
  na **Pred-Google checklist** (cookie lišta + zásady ochrany OÚ). Pri spustení
  rezervácií na verejnom webe musí byť GDPR vyriešené.
- **Testy:** `lib/booking.ts` je čistá logika → povinné unit testy (sloty,
  prekryvy, blackouty, hranice dňa, časové pásmo). Engine je jadro produktu.
- **Ponytail/minimalizmus:** žiadny SDK, kde stačí `fetch`; logika slotov na
  jednom mieste (widget aj chatbot ju len volajú); žiadny duplicitný kód.

## Otvorené drobnosti (doriešiť pri realizácii — operatíva, netreba blokovať plán)
- Konkrétny zoznam našich demo služieb + otváracie hodiny (seed dáta R0).
- `from` adresa (schránka na hostcreators, napr. `rezervacie@digitalnapomoc.sk`)
  + jej SMTP údaje (host/port/user/pass). *(Resend + DNS len ak raz prejdeme naň.)*
- Či zrušenie rezervácie riešime hneď (link v e-maile → `status=cancelled`)
  alebo až neskôr. (Návrh: jednoduchý zrušovací link už vo v1.)

---

## Ostatné ciele (po rezerváciách — seed, doplní sa v ďalšom plánovacom sedení)

**E-mail auto-odpoveď:** schránka + prístup (IMAP na hostingu?); **draft na
schválenie** (bezpečnejšie ako auto-send); párovanie odpovede s obsahom (RAG)
a s CRM (lead). Beží v orchestrátore (Python), e-mail cez ten istý `lib` (SMTP).

**Chatbot leady:** rozšíriť `/api/chat` o zachytenie kontaktu → zápis
`client_leads` + potvrdzovací e-mail (znovupoužije `lib/email.ts`). Prekrýva sa
s R2 (chatbot už bude vedieť vytvárať rezervácie/leady).

---

## Štartové prompty pre REALIZAČNÉ sedenia (copy-paste, jeden krok = jedno sedenie)

> Každý krok samostatné sedenie. Rob až po dokončení a zlúčení predošlého kroku.
> Sedenie si prečíta celý plán (R0–R4), ale spraví **iba uvedený krok**.

**Krok R0 — dátový model:**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Realizačné sedenie: sprav Krok R0 rezervačného agenta z plan-agenti.md
(dátový model). Vytvor orchestrator/booking_schema.sql (kolekcie bookings,
booking_services, booking_resources, booking_availability, booking_blackouts +
exclusion constraint proti prekryvu, vzor podľa rag_schema.sql) a doplň
docs/directus.md o rezervačné kolekcie a token reservation-bot (least privilege).
Kód „na hrubo", čistý a replikovateľný. Vetva claude/... , commit + push;
merge do main a zmeny v Railway/Directus až po mojom súhlase. Klik-časti
(zakladanie kolekcií, token, seed dáta, spustenie SQL) mi vypíš ako návod.
```

**Krok R1 — engine + widget + e-mail (predpoklad: R0 hotové a zlúčené):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Realizačné sedenie: sprav Krok R1 rezervačného agenta z plan-agenti.md.
Postav čistú logiku frontend/lib/booking.ts (computeFreeSlots, bez I/O, s unit
testami), frontend/lib/booking-data.ts (čítanie/zápis cez Directus REST),
API routes GET /api/booking/slots a POST /api/booking/create (validácia,
honeypot, rate limit vzor /api/lead, re-check slotu pred zápisom, zápis do
client_leads), frontend/lib/email.ts s vymeniteľným poskytovateľom (hlavná
cesta hosting SMTP cez nodemailer, Resend ako záloha) a widget /rezervacia
(components/booking-widget.tsx, dizajn v štýle webu, prístupný, mobil).
Pred písaním Next.js kódu čítaj node_modules/next/dist/docs/ (frontend/AGENTS.md).
Časy v UTC v DB, zobrazenie Europe/Bratislava. Over lint + build + testy.
Vetva claude/... , commit + push; merge do main a zmeny v Railway/Directus/Resend
až po mojom súhlase. Klik-časti (SMTP údaje, env premenné, seed dáta) mi vypíš.
```

**Krok R2 — konverzačný chatbot (predpoklad: R1 hotové a zlúčené):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Realizačné sedenie: sprav Krok R2 rezervačného agenta z plan-agenti.md.
Rozšír /api/chat o nástroje (Gemini function calling) najdi_sloty a
vytvor_rezervaciu, ktoré volajú ten istý lib/booking.ts a booking-data.ts
(žiadna duplicita logiky). Chatbot vedie konverzačný tok: služba a preferovaný
čas → ponúkne voľné termíny → po explicitnom potvrdení vytvorí rezerváciu →
e-mail + lead. Osobnosť z agent_config. Bezpečnosť: chatbot smie iba čítať
sloty a vytvoriť rezerváciu, nič iné. Pred písaním Next.js kódu čítaj
node_modules/next/dist/docs/. Over lint + build + testy. Vetva claude/... ,
commit + push; merge do main a zmeny v Railway/Directus až po mojom súhlase.
```

**Krok R3 — pripomienky v orchestrátori (predpoklad: R1 hotové a zlúčené):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Realizačné sedenie: sprav Krok R3 rezervačného agenta z plan-agenti.md.
Vytvor orchestrator/reminder_agent.py (lego vzor ako wp_writer/seo_geo:
nacitaj_config("reservation_reminder"), zapis_log): prečíta nadchádzajúce
rezervácie z Directus a pošle pripomienku deň vopred cez hosting SMTP
(Python smtplib — bez novej závislosti). Bez rezervácií nič nerobí, chyby
nezhodia beh. Over py_compile + import. Vetva claude/... , commit + push;
merge do main a zmeny v Railway (cron, env, agent_config) až po mojom súhlase.
Klik-časti (Railway cron, env, riadok agent_config) mi vypíš ako návod.
```

**Krok R4 — replikácia pre klienta (neskôr, po dohode):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Realizačné sedenie: sprav Krok R4 rezervačného agenta z plan-agenti.md
(replikácia). Priprav postup a config pre nasadenie rezervácií u klienta
(nová sada services/resources/availability, branding e-mailov, from adresa —
bez nového kódu) a navrhni cestu k multi-tenant (tenant_id na booking_*
kolekciách + izolácia dát/tokenov) ako plán pre Fázu 5. Vetva claude/... ,
commit + push; merge do main a zmeny v Railway/Directus až po mojom súhlase.
```

## Štartový prompt pre PLÁNOVACIE sedenie (pôvodný — na ďalšie ciele)
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Toto je PLÁNOVACIE sedenie (šetríme tokeny): nič nekóduj, len sa ma pýtaj na
otvorené rozhodnutia z plan-agenti.md a výsledok — podrobný plán po krokoch —
zapíš do docs/plan-agenti.md. Commit + push do vetvy môžeš, merge do main
a zmeny v Railway/DB až po mojom súhlase.
```

---

# ZADANIE pre nasledujúce PLÁNOVACIE sedenie — Frontend agent = knižnica odvetvových šablón

> Rozhodnuté (aug 2026, majiteľ): frontend agent nie je jednorazový mockup, ale
> **knižnica viacstránkových odvetvových šablón** (à la GeneratePress Site
> Library) na **špičkovej dev+dizajn úrovni** (nerozoznateľné od AI), s neskorším
> pripojením špecializovaných modulov (rezervačný chatbot/widget).
>
> **Prieskum repa (aug 2026):** produktoví agenti už žijú v tomto repe
> (`frontend/` + `orchestrator/`), žiadny monorepo nástroj, `frontend` je jediný
> Next.js app na Railway (Root Directory `frontend`). Referencia na build
> sub-agentov: `github.com/msitarzewski/agency-agents` (knižnica AI „osobností"
> pre coding nástroje — **build-time pomôcka**, nie generátor webov). Odporúčaný
> prístup: kurátorské šablóny (postavené so špecializovanými build sub-agentmi v
> `.claude/agents/`) + customizačný agent + ľudská revízia — **nie** naivné
> „jeden prompt → celý web".

Štartový prompt (copy-paste do nového plánovacieho sedenia):
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.

Toto je PLÁNOVACIE sedenie (šetríme tokeny): nič nekóduj, len plánuj. Cieľ:
presne naplánovať FRONTEND agenta prehodnoteného ako KNIŽNICA ODVETVOVÝCH
ŠABLÓN webov (à la GeneratePress Site Library: https://generatepress.com/site-library/).

VÍZIA (od majiteľa):
- Výstup = VIACSTRÁNKOVÉ landing weby, nie jednostránkový mockup. Na začiatok
  knižnica šablón pre konkrétne odvetvia: kaderníctvo, automechanik/autoservis,
  zubár (a postupne ďalšie).
- Kvalita = ŠPIČKOVÁ developerská aj dizajnová úroveň — nesmie byť poznať, že
  to generovala AI (senior-dev/dizajn úroveň, prístupnosť, výkon, čistý kód).
- Neskôr sa ku každej šablóne pripojí ŠPECIALIZOVANÝ CHATBOT/modul (napr.
  rezervačný — volá existujúci lib/booking.ts) a booking widget.
- Smeruje k produktizácii (Fáza 5 vízie): šablóna → nasadenie a customizácia
  pre reálneho klienta.

DÔLEŽITÝ POSUN V PRÍSTUPE (na potvrdenie v pláne): cieľová kvalita sa
nedosiahne „jeden prompt → celý web". Navrhni model:
  1) KURÁTORSKÉ ŠABLÓNY — pár ručne vypiplaných špičkových šablón na odvetvie,
     postavené s pomocou špecializovaných BUILD sub-agentov (senior frontend
     dev, UI/UX dizajnér, QA — inšpirácia github.com/msitarzewski/agency-agents,
     uložené v .claude/agents/ tohto repa) + ľudská kontrola;
  2) CUSTOMIZAČNÝ AGENT — prispôsobí zvolenú šablónu klientovi (texty, farby,
     biznis údaje, obrázky) a pripojí správny modul (rezervačný chatbot/widget).
Porovnaj to s naivným generovaním a odporuč cestu.

OTVORENÉ ROZHODNUTIA, ktoré so mnou vyrieš:
1. Kde žije knižnica šablón: (a) nový Next.js app v tomto repe (napr.
   site-library/) ako ďalšia Railway služba, (b) samostatný repozitár
   (čistejšie pre multi-tenant), (c) route group vo frontend/ (/ukazky/[odvetvie]).
   Zvaž zdieľanie dizajn-tokenov a nasaditeľnosť u klienta. Návrh odôvodni.
2. Build sub-agenti: prevezmeme kurátorský výber z agency-agents do .claude/agents/
   (frontend dev, dizajnér, QA)? Ktoré konkrétne a ako ich zapojíme do workflowu.
3. Ako presne dosiahnuť „nerozoznateľné od AI": dizajn systém (tokeny, typografia,
   sekcie), zdroj obrázkov (stock/gen + licencie), copywriting, checklist kvality
   (Lighthouse, a11y, žiadne generické AI frázy), povinná ľudská revízia.
4. Lego vzor: ako customizačný agent zapadne (config v agent_config riadok napr.
   „site_builder", logy v agent_logs, token). Beží v orchestrátore alebo ako
   nástroj v Claude Code sedení?
5. Napojenie modulov: ako sa k šablóne pripojí rezervačný chatbot/widget bez
   duplicity (volá lib/booking.ts / booking-data.ts).
6. Model na texty/dizajnové rozhodnutia: prepínateľný cez agent_config (default?).
7. Prvý konkrétny cieľ (MVP): jedno odvetvie na špičkovej úrovni (napr.
   kaderníctvo) ako vzor, potom replikovať na ďalšie.

Zohľadni prieskum repa: produktoví agenti už žijú tu (frontend/ + orchestrator/),
žiadny monorepo nástroj, frontend je jediný Next.js app deployovaný na Railway
(Root Directory frontend). Rešpektuj CLAUDE.md (minimalizmus, slovenčina, tri
zdroje pravdy, least privilege).

Výstup sedenia: podrobný plán po krokoch (M1, M2…) + hotový štartový prompt pre
prvé realizačné sedenie, zapísaný do docs/plan-agenti.md (nová sekcia
„Frontend agent — knižnica odvetvových šablón"). Commit + push do vetvy môžeš,
merge do main a zmeny v Railway/Directus až po mojom súhlase.
```

---

# Frontend agent — knižnica odvetvových šablón (plánovacie sedenie, aug 2026)

> **Posun v prístupe (rozhodnutý majiteľom):** frontend agent nie je jednorazový
> „mockup z jedného promptu", ale **knižnica viacstránkových odvetvových šablón**
> (à la GeneratePress Site Library) na **špičkovej dev + dizajn úrovni**
> (nerozoznateľné od AI), ku ktorým sa neskôr pripájajú špecializované moduly
> (rezervačný widget/chatbot volajúci existujúci `lib/booking.ts`). Smeruje k
> produktizácii (Fáza 5): šablóna → nasadenie a customizácia pre reálneho klienta.

## Naivná cesta vs kurátorská cesta — a prečo kurátorská

| | Naivné „jeden prompt → celý web" | **Kurátorské šablóny + customizačný agent (zvolené)** |
|---|---|---|
| Kvalita | Nestabilná, priemerná, „cítiť AI" (generické sekcie, prázdne frázy, rozbitý a11y) | Špičková, konzistentná — pár ručne vypiplaných šablón, ľudsky odsúhlasených |
| Opakovateľnosť | Zakaždým iný výsledok, ťažká údržba | Šablóna je pevný základ; customizácia je malá, riaditeľná zmena |
| Riziko u klienta | Vysoké (nepredvídateľný výstup naostro) | Nízke (predaj overenej šablóny, mení sa len obsah/branding) |
| Náklad na model | Vysoký (generuje sa všetko zakaždým) | Nízky (šablóna hotová; agent mení len texty/farby/údaje) |

**Odporúčanie a rozhodnutie:** ideme **kurátorskou cestou**. Cieľová kvalita
(„nesmie byť poznať, že to je AI") sa **jedným promptom nedosiahne**. Postavíme
**málo, ale perfektných** šablón s pomocou špecializovaných build sub-agentov +
**povinná ľudská revízia**; klientovi ich potom prispôsobí **customizačný agent**.

## Rozhodnutia tohto sedenia

| # | Rozhodnutie | Voľba | Poznámka |
|---|---|---|---|
| 1 | **Kde žije knižnica** | **Route group vo `frontend/`** (`/ukazky/[odvetvie]`) | Každá šablóna = samostatný **prenosný balík** (`frontend/templates/<odvetvie>/`). 0 novej infry, zdieľa `lib/booking.ts` + widget priamo, portfólio hneď na našom webe. U klienta sa balík **vyliftuje** do čistého deployu. |
| 2 | **Kde beží customizačný agent** | **Claude Code sedenie + skill** ✅ potvrdené | Customizácia = editácia kódu/obsahu → doména Claude Code, nie headless cron. Config/log riadok `site_builder` v Directuse pre stopu (lego vzor). Po M2 **tvorí šablóny aj majiteľ** cez sedenia s build sub-agentmi. |
| 3 | **Poradie odvetví** | **1. Kvetinárstvo → 2. Kaderníctvo** → ďalšie | Odvetvie je vedľajšie — prvá šablóna je spôsob, akým sa **ukuje samotný systém** (náradie M1 sa vyladí na reálnej práci M2). Každá ďalšia je rýchlejšia. |
| 4 | **Build sub-agenti** | **Všetci štyria** (frontend dev, UI/UX dizajnér, QA/a11y, SK copywriter) | Adaptované (nie slepo skopírované) z `agency-agents` do `.claude/agents/`. **Živé definície** — zlepšujú sa retrospektívami (viď „Učiaca sa slučka"). |
| 5 | **Modely pre sub-agentov** | **Fable/Opus** na dizajn + dev; **Sonnet** na copy + QA (v hlavičkách `.claude/agents/*.md`) | Vkus a architektúra = najsilnejší model; mechanická kontrola a textové iterácie = lacnejší. Povýšiť rolu = zmena jedného riadku. *(Build agenti = model v definícii; produktoví 24/7 agenti = model v `agent_config`.)* |
| 6 | **Náhľad pre klienta = platená služba** | **Platený náhľad, odpočítateľný z ceny projektu** | Filtruje zvedavcov, drží prémiové pozicionovanie; pre vážneho klienta je to záloha, nie výdavok. Sumy → kolo o cenových balíkoch (neskôr). |
| 7 | **Vstupy customizácie** | **Ľubovoľná kombinácia:** vízia (chat) / biznis plán (PDF) / starý web (URL) / referenčné weby (inšpirácia) | Nezávisí len od starého webu. Referencie = extrakcia dizajnového smeru, **nie kópia** (právne čisté; základ je vždy naša šablóna). |
| 8 | **Zber online, výroba riadená** | Klient zadá všetko online (chat/formulár + prílohy) → náhľad vyrábame **my, riadene, s bránou kvality** (~24 h) | Plný automat „klik → web" by obišiel bránu kvality a vrátil generický AI výstup + riziko zneužitia nákladov. Osobné doručenie je aj silnejší predajný moment. Plná automatizácia = až Fáza 5. |

## Architektúra umiestnenia — route group + prenosné balíky

Cieľ: **jeden repo, žiadna nová infra**, no zároveň **portovateľné ku klientovi**.

```
frontend/
  app/ukazky/                     # portfólio (index + jednotlivé odvetvia)
    page.tsx                      # zoznam šablón (naše referencie)
    [odvetvie]/…                  # mount konkrétnej šablóny (route)
  templates/                      # ← PRENOSNÉ BALÍKY (jadro knižnice)
    kvetinarstvo/
      theme.css                   # scoped dizajn-tokeny (Tailwind v4 @theme, prefix flora-*)
      content.ts                  # všetok obsah/texty šablóny (jedno miesto na customizáciu)
      sections/                   # hero, sluzby, galeria, o-nas, cennik, referencie, kontakt…
      images/                     # licencované obrázky (+ LICENSES.md)
      page.tsx / layout.tsx       # zloženie viacstránkového webu
  lib/                            # ZDIEĽANÉ (booking.ts, booking-data.ts, email.ts, seo.ts)
  components/booking-widget.tsx   # ZDIEĽANÝ modul (šablóna ho len importuje)
```

**Prečo to takto funguje pre obidva ciele:**

- **Portfólio na našom webe** = route group `/ukazky/[odvetvie]` mountne balík z
  `templates/`. Hneď živá referencia, zdieľa `lib/` aj rezervačný widget.
- **Nasadenie u klienta** = skopíruj `templates/<odvetvie>/` + potrebné `lib/*`
  do čistého Next.js appu (alebo klonu `frontend/`). Balík je **sebestačný**
  (vlastné tokeny, obsah, obrázky) → žiadny nový kód, len customizácia obsahu.
  Multi-tenant (Fáza 5) príde až neskôr; teraz zámerne **jedno-balíkové lifty**.

**Dizajn-tokeny bez kolízie s naším webom (Tailwind v4):** hlavný web má tokeny
globálne v `app/globals.css` (`@theme`). Každá šablóna má **vlastný `theme.css`**
s **prefixovanými** tokenmi (`--color-flora-500`, `--font-flora-display`…),
importovaný len v jej `layout.tsx`. Šablóna tak má **svoju vizuálnu identitu**
(iný web než digitalnapomoc.sk), bez zásahu do našich tokenov. Žiadne globálne
prepisovanie farieb.

**SEO/GEO pozor — demo obsah `noindex`:** ukážkové šablóny majú **fiktívny**
obsah (fiktívne kvetinárstvo). Nesmú sa dostať do Googla ani znečistiť naše SEO
→ `/ukazky/*` dostane **`robots: noindex`** (metadata v route group layout).
Sitemap/llms.txt ich **nezaraďuje**. (Naša reálna referencia = digitalnapomoc.sk,
nie fiktívny demo web.)

## Ako dosiahnuť „nerozoznateľné od AI" — kvalitná brána

Toto je jadro zadania. Bez brány sa cieľ nedá splniť. Štyri piliere:

1. **Dizajn systém (per šablóna):** definované tokeny (paleta, typografia —
   výrazný display font + čitateľný text, škála medzier 4/8 px, rádiusy, tiene),
   sada sekcií a ich rytmus, konzistentný grid. Žiadne „default Tailwind demo"
   vzory — každá šablóna má **rozpoznateľný vlastný charakter** (kvetinárstvo =
   organické tvary, sezónne farby, veľká fotografia).
2. **Obrázky + licencie:** primárne **licencovaný stock** (Unsplash/Pexels
   licencia — voľné na komerčné použitie) alebo generované (Gemini, už máme),
   ale **kurátorsky vybrané, aby pôsobili reálne** (nie zjavné „AI plasty").
   Ku každej šablóne **`images/LICENSES.md`** (zdroj + licencia každého obrázka)
   — čisté právne pozadie pre klienta.
3. **Copywriting (SK copywriter sub-agent):** konkrétny odvetvový jazyk, reálne
   znejúce ponuky/ceny/CTA. **Zakázané generické AI frázy** („posúvame hranice",
   „v dnešnej uponáhľanej dobe", „inovatívne riešenia na mieru", prázdne
   superlatívy). Texty píše/reviduje copywriter agent proti tomuto zoznamu.
4. **Checklist kvality (povinný pred „hotovo"):**
   - **Lighthouse ≥ 95** (Performance/SEO/Best Practices), **a11y = 100** cieľ.
   - **WCAG AA** — kontrast, fokus, `alt`, sémantické landmarky, klávesnica,
     `prefers-reduced-motion`.
   - **Responzivita** — mobil/tablet/desktop overené (predinštalovaný Chromium,
     screenshoty).
   - **Čistý kód** — žiadne lorem ipsum, žiadne mŕtve `TODO`, `lint` + `build` OK,
     komponenty data-driven (obsah z `content.ts`, nie natvrdo v JSX).
   - **Žiadne AI klišé** (kontrola copywriter agentom).
   - **Skutočné meta/OG** pre šablónu (aj keď `noindex`, nech je hlavička čistá).
5. **Povinná ľudská revízia (majiteľ):** brána sa neobíde. Sub-agenti pripravia,
   QA agent skontroluje, **človek odsúhlasí** vizuál aj texty pred „hotovo".

## Build sub-agenti (`.claude/agents/`)

Adaptujeme (nie slepo kopírujeme) kurátorský výber inšpirovaný
`github.com/msitarzewski/agency-agents`. **Nie sú to generátory webov** — sú to
build-time „osobnosti", ktoré Claude Code sedenie používa pri stavaní šablóny:

| Sub-agent (súbor v `.claude/agents/`) | Rola vo workflowe |
|---|---|
| `frontend-dev` | Píše čistý Next.js 16 / Tailwind v4 kód, výkon, a11y na úrovni seniora. Pred písaním číta `node_modules/next/dist/docs/` (frontend/AGENTS.md). |
| `ui-ux-designer` | Navrhne dizajn systém šablóny (tokeny, typografia, sekcie, hierarchia), rozvrhne stránky. |
| `qa-a11y` | Kontroluje checklist kvality (WCAG, Lighthouse, responzivita, žiadne klišé). Gatekeeper pred ľudskou revíziou. |
| `sk-copywriter` | Odvetvové SK texty, kontrola proti zoznamu zakázaných AI fráz. |

**Workflow jednej šablóny:** `ui-ux-designer` (dizajn systém + rozvrh) →
`frontend-dev` (implementácia sekcií) + `sk-copywriter` (texty do `content.ts`) →
`qa-a11y` (brána kvality) → **ľudská revízia** → hotovo. Sedenie ich orchestruje;
Claude Code ich spúšťa cez `Agent` tool podľa `.claude/agents/*.md`.

## Lego vzor — customizačný agent

Customizačný agent **prispôsobí zvolenú šablónu klientovi** (názov, texty, farby,
biznis údaje, kontakt, obrázky) a **pripojí správny modul** (rezervačný widget).

- **Kde beží:** **Claude Code sedenie + skill** (`.claude/skills/site-customizer/`
  — jednoduchý runbook: vyber šablónu → vyplň klientský `content.ts` a `theme.css`
  → zapoj modul → prejdi kvalitnú bránu → lift do deployu). Customizácia je
  editácia kódu, nie práca pre headless Python cron.
- **Lego stopa (voliteľne, konzistencia s Writer/SEO):** riadok
  `agent_config.site_builder` (model, prompt/pravidlá značky) + zápis do
  `agent_logs` (čo a pre koho sa prispôsobilo). **Least privilege** token ako pri
  ostatných agentoch (read `agent_config`, create `agent_logs`).
- **Prečo nie orchestrátor:** orchestrátor je pre **headless API úkony na pozadí**
  (WP publikovanie, embeddingy, e-maily). Generovanie špičkového frontend kódu
  nie je jeho práca. (Ak by sme neskôr chceli „samoobslužný náhľad z webu",
  orchestrátor môže spustiť Claude Code hlavičku — ale to je Fáza 5+.)

## Napojenie modulov (rezervácie/chatbot) bez duplicity

Šablóna **nič nekopíruje** — **importuje** existujúce:

- `components/booking-widget.tsx` + `lib/booking.ts` / `lib/booking-data.ts`
  (engine je odvetvovo neutrálny — už postavené v krokoch R0–R1).
- Šablóna dodá len **konfiguráciu** (ktoré `booking_services`/`booking_resources`
  v Directuse patria danému klientovi) a **vizuálny obal** (widget v jej dizajne).
- RAG chatbot rovnako — `components/chat-widget.tsx` + `/api/chat`, napojené na
  klientov obsah. **Žiadna duplicita logiky**, len napojenie + branding.

Toto je priamy dôsledok „lego" princípu z vízie: nová schopnosť = zapojenie
existujúceho modulu, nie prepis.

## Podrobný plán po míľnikoch

> Každý míľnik = jedno realizačné sedenie (ucelený, overiteľný celok). Vetva,
> commit, push; **merge do `main` a zmeny v Railway/Directus až po súhlase**.

### M1 — Základ knižnice (infra, bez hotovej šablóny) ✅ HOTOVÉ (vetva, NEzlúčené)

> ✅ Hotové (aug 2026, vetva `claude/m1-frontend-agent-templates-94ksdt`): štyria
> sub-agenti v `.claude/agents/`, konvencia balíka `frontend/templates/` +
> `registry.ts`, route group `app/ukazky/` (noindex), `docs/sablony-kvalita.md`,
> kostra skillu `.claude/skills/site-customizer/`. Lint + build overené. Detaily a
> ponaučenia v `docs/dennik.md`. **Ďalej: M2 (kvetinárstvo).**

**Cieľ:** postaviť to, bez čoho sa špičková šablóna nedá stavať konzistentne.

- **`.claude/agents/`** — štyria sub-agenti (`frontend-dev`, `ui-ux-designer`,
  `qa-a11y`, `sk-copywriter`), adaptované do nášho kontextu (Next.js 16 / Tailwind
  v4, slovenčina, minimalizmus, a11y). Krátke, ostré `*.md` definície.
- **Konvencia balíka** — `frontend/templates/<odvetvie>/` (theme.css, content.ts,
  sections/, images/ + LICENSES.md, page/layout) + **route group**
  `app/ukazky/` (index + `[odvetvie]` mount) s **`noindex`** metadatami.
- **Kvalitná brána (dokument)** — `docs/sablony-kvalita.md`: checklist
  (Lighthouse/a11y/responzivita/čistý kód), zoznam **zakázaných AI fráz**,
  postup ľudskej revízie. Jedno miesto pravdy pre „nerozoznateľné od AI".
- **Skill kostra** — `.claude/skills/site-customizer/` (zatiaľ runbook, bez behu).

**Overiteľné:** `lint` + `build` (prázdny route group + placeholder), sub-agenti
a skill načítateľné. Žiadny fiktívny obsah zatiaľ.

### M2 — Vlajková šablóna: **kvetinárstvo** (špičková úroveň + motion)

> **M2a ✅ HOTOVÉ** (aug 2026; pôvodne vetva `claude/m1-frontend-agent-templates-94ksdt`,
> **AKTUALIZÁCIA aug 2026: už ZLÚČENÉ v `main`**): demo značka **Boma Flora** (Trenčín), 7 stránok + detail blogu,
> meniny prvok, smútočné kytice, blog, obchod; postavené reťazcom sub-agentov
> (dizajnér→copy→dev→QA) + revízia majiteľa. Lint/build čisté, screenshoty
> hotové, retrospektíva v `docs/sablony-kvalita.md`. **Otvorené:** reálne fotky
> (teraz SVG placeholder), potom **M2b** (motion + hero video Higgsfield). Detaily
> a ponaučenia: `docs/dennik.md`.

> Rozdelené na **M2a (statická špička)** a **M2b (motion vrstva)** — detail a
> motion spec v sekcii „Vlajková šablóna kvetinárstvo" nižšie. M2a musí obstáť aj
> bez animácií (je fallbackom pre `reduced-motion`); M2b pridá Framer Motion navrch.

**Cieľ:** jeden odvetvový web na úrovni, ktorú by senior dev + dizajnér podpísali —
a ktorý na obchodnom stretnutí funguje ako dôkaz „takéto weby staviame".

- **Dizajn systém** (`ui-ux-designer`) → `theme.css` (paleta, typografia, rytmus).
- **Sekcie/stránky** (`frontend-dev` + `sk-copywriter`): domov (hero, sezónna
  ponuka, o nás, galéria, referencie, kontakt), stránka **Ponuka/služby**,
  **O nás**, **Kontakt** (viacstránkové, nie jeden mockup). Obsah v `content.ts`.
- **Obrázky** licencované + `LICENSES.md`.
- **Kvalitná brána** (`qa-a11y`) → **ľudská revízia** (majiteľ odsúhlasí).
- Zaradiť do `/ukazky` indexu ako referenciu (interne; `noindex`).

**Overiteľné:** `lint` + `build`, Lighthouse ≥ 95, a11y, responzívne screenshoty.

### M3 — Napojenie rezervačného modulu na šablónu kvetinárstva

**Cieľ:** ukázať „šablóna + špecializovaný modul" naostro.

- Zapojiť `booking-widget` + `lib/booking.ts`/`booking-data.ts` do kvetinárskej
  šablóny (vizuálny obal v jej dizajne), napojené na demo `booking_*` config.
- Prípadne demo chatbot (`chat-widget`) — voliteľné.
- **Bez duplicity** — len import + konfigurácia + branding.

**Overiteľné:** tok rezervácie funguje v šablóne; testy `booking.ts` netreba meniť.

### M4 — Customizačný agent (skill) + lego config

**Cieľ:** z hotovej šablóny spraviť klientský web zmenou obsahu, nie kódu.

- Dopísať `.claude/skills/site-customizer/` (vyber šablónu → vyplň `content.ts`
  + `theme.css` klientskými údajmi/farbami → zapoj modul → kvalitná brána → lift).
- Voliteľne `agent_config.site_builder` (model default Claude, pravidlá značky) +
  `agent_logs` stopa + least-privilege token (klik-časť po súhlase).

**Overiteľné:** suchý beh customizácie na fiktívnom „klientovi" (2. sada obsahu
tej istej šablóny) → dva rôzne weby z jednej šablóny.

> **Od M2 ďalej platí:** systém je ukutý — **šablóny tvorí aj majiteľ** cez
> Claude Code sedenia s build sub-agentmi („postav šablónu pre odvetvie X").
> Druhá šablóna = **kaderníctvo** (môže vzniknúť kedykoľvek po M2 ako overenie
> replikovateľnosti; nie je viazaná na poradie M3–M5). Najprémiovejšie kusy →
> showroom `/ukazky` → predaj a nasadenie klientom.

### M5 — Náhľadový agent online (zber na webe, výroba riadená)

**Cieľ:** potenciálny klient si **online** objedná platený náhľad svojho webu —
cez chat agenta (alebo formulár) na digitalnapomoc.sk. *(= vízia §9 „Mockup
agent" v zrelej podobe; predpokladá M2 + M4.)*

**Tok:**

```
Návštevník → CHAT AGENT („Chcem nový web")     ← rozšírenie /api/chat (vzor R2)
  │  konverzačný dotazník (à la B12): odvetvie, predstava, štýl, ciele
  │  + ľubovoľné vstupy: URL starého webu / biznis plán PDF / referenčné weby
  │  + platba za náhľad (odpočítateľná z projektu)
  ▼
LEAD v Directuse (typ „žiadosť o náhľad", prílohy v Directus Files) → notifikácia nám
  ▼
CUSTOMIZAČNÝ AGENT (Claude Code sedenie, spúšťame my):
  scrape starého webu + Gemini prečíta biznis plán (PDF natívne, žiadny NotebookLM
  netreba) + extrakcia smeru z referencií → naleje do šablóny odvetvia
  ▼
BRÁNA KVALITY → ľudská revízia → NÁHĽAD na /ukazky/demo/[id] (noindex, unikátny
  odkaz) → e-mail klientovi + pozvanie na konzultáciu (~24 h od objednávky)
```

- **Scraping:** klientsky web zvládne sedenie samo (fetch + Chromium, 0 €).
  **Apify** (má oficiálny MCP konektor, free tier 5 $ kreditov/mes.) zapneme až
  keď narazíme na ťažké ciele — Google Maps recenzie, Instagram. Žiadny fixný
  náklad vopred.
- **Video upload do hero** (klientove/generované video pre motion) = **fáza 2**
  tohto agenta — v prvej verzii stačí URL + PDF. Upload = útočná plocha (limit
  veľkosti, validácia typu, rate limit).
- **GDPR:** dotazník/plán/prílohy sú osobné a firemné dáta → viaže sa na cookie
  lištu + zásady OÚ z Pred-Google checklistu; bez toho agenta nespúšťame naživo.
- **Lego:** `agent_config` riadok (osobnosť chatu, otázky dotazníka klikaním),
  logy `agent_logs`, vlastný token (least privilege).
- **Predajný ťah „vaša stará WP stránka v novom šate":** ten istý tok vieme
  spustiť aj my pred obchodným stretnutím — personalizované demo z klientovych
  reálnych dát predáva lepšie než fiktívna ukážka. Sedí na naše jadro (headless
  modernizácia WP — klientovi ostáva jeho admin).

### M6 — Produktizácia / lift-to-client (väzba na Fázu 5)

**Cieľ:** zdokumentovaný postup nasadenia šablóny reálnemu klientovi.

- Runbook: skopíruj `templates/<x>/` + `lib/*` do čistého deployu, napoj Directus
  (booking/leady/chatbot), branding, doména. Návrh cesty k **multi-tenant**
  (`tenant_id`, izolácia) ako plán, nie realizácia.
- Balíky služieb: šablóna + **lego agenti ako upsell** (Writer/copywriter,
  rezervácie, objednávky, chatbot) — párovanie agent ↔ služba (vízia §8).
  Cenové balíky sa navrhnú v samostatnom kole (rozhodnutie majiteľa: neskôr).

## Vlajková šablóna „kvetinárstvo" — motion + prezentačná úroveň (detail)

> **Zámer majiteľa:** kvetinárstvo nie je len prvá šablóna, je to **vlajková
> ukážka** — „pozrite, takéto weby (za desiatky tisíc €) vieme robiť". Musí mať
> **motion grafiku** na úrovni prémiovej agentúry a slúžiť ako **živý predajný
> argument** v našich službách.

### Poctivé priznanie na úvod (čo je tu ťažké)

Cieľ „motion ako web za €desiatky tisíc" **a zároveň** Lighthouse ≥ 95 +
prístupnosť je **najnáročnejšia časť celého projektu**. Nie je to nemožné — ale
len ak sa držíme pevných mantinelov (nižšie). Preto motion **plánujeme, nie
improvizujeme**: čo sa hýbe, ako, prečo, a čo sa stane pri `reduced-motion`.

### Odporúčaná technológia (na potvrdenie)

- **Primárne: Framer Motion (`motion/react`)** — React-natívny štandard pre Next.js,
  deklaratívny, rieši `prefers-reduced-motion`, `whileInView`, layout animácie.
  **Jedna závislosť**, ktorá sa v tomto projekte oplatí (motion JE tu produkt —
  presne ten prípad z „rebríka minimalizmu", keď nižšie priečky nestačia).
- **Doplnkovo: natívne CSS** na jednoduché veci (organické pozadia, Ken Burns
  zoom, jemný parallax cez `animation-timeline: view()` tam, kde je podpora).
- **GSAP + ScrollTrigger** držíme **v zálohe len na 1–2 „set-piecy"** (scroll-scrub
  kinematika), a to iba ak sa preukáže, že to Framer/CSS nezvládnu vkusne. Nejdeme
  „celé na GSAP" — zbytočne by to zaťažilo Lighthouse a údržbu.
- **Intenzita: „prémiovo jemná" (editorial / luxury-brand)** — pôsobí draho bez
  cirkusu; istejšia cesta k vkusu aj výkonu než „award-site" preplácanie.

*(Ak chceš ísť odvážnejšie kinematicky alebo naopak úplne bez závislosti, povedz —
plán vieme prepnúť. Default vyššie je moje odporúčanie.)*

### Konkrétne motion prvky (aby bolo vidieť tú „drahú" úroveň)

1. **Hero (prvý dojem) = SCROLL VIDEO HERO** *(rozhodnuté majiteľom)*. V hero
   sekcii je **generované video** (Higgsfield + model). Nad videom je nadpis + CTA
   (jemný reveal). Zvyšné hero efekty (lupienky, bloby, SVG kresba) sa **nepoužijú**
   — hero nesie video, nie „ozdôbky". Dva možné režimy (rozhodnúť podľa vzhľadu +
   výkonu, viď „Hero video — pipeline" nižšie):
   - **A) Kinematický loop na pozadí** *(odporúčané, bezpečné):* krátke (~6–10 s)
     bezšvové video sa prehráva dokola, obsah scrolluje ponad. `autoplay muted
     playsinline loop`, **poster = prvý snímok** (drží LCP), na mobile ľahšia
     verzia alebo len poster.
   - **B) Scroll-scrub („Apple" efekt):* video sa **posúva podľa scrollu**
     (`currentTime` viazaný na pozíciu). Najväčší „wow", ale rizikovejšie
     (seek stutter, mobil throttluje) → treba dôsledné testovanie a fallback.
2. **Scroll reveals:** sekcie a karty prichádzajú staggerom (fade + jemný posun
   nahor), `whileInView` s `once: true` (animuje sa raz, keď prvok vojde do obrazu).
3. **Sezónna galéria kytíc:** hover **mask-reveal + zoom**, prípadne horizontálny
   scroll so „scrub" efektom (tu by prišiel GSAP, ak vôbec).
4. **Signature set-piece (moment „wow"):** buď **skladajúca sa kytica** (jednotlivé
   kvety priletia a poskladajú sa počas scrollu), alebo **padajúce lupienky, ktoré
   sa usadia**. Jeden taký moment stačí — nesmie sa preháňať.
5. **Počítadlá:** roky na trhu / spokojní klienti / dodané kytice — count-up pri
   vojdení do obrazu.
6. **Mikro-interakcie:** magnetické CTA tlačidlá, jemný tilt/lift kariet, hover
   zoom obrázkov, animované podčiarknutie odkazov, sticky názvy sekcií.
7. **Prechody medzi stránkami:** **View Transitions API** (natívne, Next 16 ho
   podporuje) alebo Framer — plynulý fade/slide medzi podstránkami.

### Hero video — pipeline (Higgsfield + model)

**Asset (čo vygenerovať):**
- **Formát/pomer:** landscape 16:9, master v čo najvyššej kvalite; z neho odvodíme
  web verzie. Pripraviť aj **orezanie na výšku pre mobil** (alebo použiť poster).
- **Dĺžka:** krátke a **bezšvovo loopovateľné** (~6–10 s) — pri režime A. Pri
  režime B (scrub) dĺžka podľa výšky hero scrollu.
- **Motív:** pomalé, „editorial" zábery (napr. rozkvitajúca kytica, jemný pohyb
  kvetov, ruky viažuce kyticu) — pomalé pôsobí draho; rýchly strih pôsobí lacno.
- **Zvuk:** žiadny (hero je `muted`).

**Web nasadenie (povinné pre výkon):**
- **Kompresia + dva kodeky:** `WebM` (VP9/AV1) + `MP4` (H.264) fallback. Cieľ
  desktop verzie **rádovo nízke jednotky MB**, nie desiatky. Mobil ešte ľahší.
- **`poster` = prvý snímok (statický obrázok)** — načíta sa okamžite, drží **LCP**
  a je to fallback, kým sa video stiahne (alebo natrvalo pri `reduced-motion`/mobile).
- **Lazy/priorita:** video `preload="metadata"`/`none` + spustiť po načítaní;
  poster cez `next/image` s prioritou. **Nikdy** blokovať prvé vykreslenie videom.
- **`prefers-reduced-motion` / šetrenie dát:** namiesto videa **statický poster**
  (žiadny autoplay). Rovnako fallback, ak sa video nepodarí načítať.
- **Hosting videa:** začať súborom v `public/` (jednoduché); ak by bol veľký/pomalý,
  zvážiť CDN. *(Rozhodnúť pri realizácii podľa veľkosti.)*

**Rozhodnutie A vs B:** default **A (loop na pozadí)** — istá kvalita čísel
(Lighthouse) aj naprieč zariadeniami. **B (scroll-scrub)** len ak po teste na
mobile drží výkon; inak ostane A. Kvalita čísla > efekt.

**Kto generuje video (deľba práce):**
- **Teraz:** majiteľ vygeneruje video v **Higgsfielde** (web UI, podľa návodu) a
  odovzdá súbor; **sedenie spraví celú web stranu** (kompresia, kodeky, poster,
  fallbacky, zapojenie, kontrola LCP/Lighthouse). Higgsfield **nemá overený MCP
  konektor** — priame generovanie zo sedenia zatiaľ nie je možné.
- **Neskôr (ak pribudne Higgsfield API/konektor):** generovanie videa sa presunie
  **priamo do Claude Code sedenia** (customizačný agent) — zapadá do modelu
  „asset generation = sedenie". Do tej doby ostáva krok ručný.

### Výkonové a a11y mantinely (povinné, súčasť kvalitnej brány)

- **Len `transform` a `opacity`** (GPU) — nikdy neanimovať `width/height/top/left`
  (layout thrash). `will-change` striedmo a cielene.
- **Animovať až vo viewporte** (`whileInView` / IntersectionObserver), nie všetko
  naraz na load → chráni prvé vykreslenie a Lighthouse.
- **`prefers-reduced-motion`: tvrdý fallback** — nepodstatný motion sa vypne,
  ostane **elegantný statický layout** (nie prázdna stránka). Testuje QA agent.
- **Žiadny layout shift (CLS)** — rezervovať miesto pre obrázky/video (`next/image`,
  pomery strán). Médiá lazy, hero s prioritou + poster.
- **Rozpočet:** motion nesmie zhodiť **Lighthouse < 95** ani a11y. Ak zhodí →
  prvok sa zjednoduší alebo vypustí. Kvalita čísla > efekt.

### Mapa stránok (viacstránkový web, nie mockup)

- **Domov:** hero → intro/„vitajte" → **sezónna ponuka** (featured kytice) →
  **služby** (svadby a eventy, smútočná väzba, **predplatné kvetov**, firemné
  dekorácie) → **galéria** → **o nás** (príbeh + tím) → proces objednávky →
  **referencie** → CTA objednávka/rezervácia → kontakt (mapa, otváracie hodiny) →
  pätička.
- **Svadby a eventy** — samostatná predajná podstránka (portfólio, balíky, dopyt).
- **Ponuka / kvety** — kategórie a sezónnosť (prezentačné, bez e-shopu vo v1).
- **O nás** — príbeh, tím, hodnoty, fotografie.
- **Kontakt / objednávka** — **rezervačný/objednávkový widget napojený na
  `lib/booking.ts`** (napr. „konzultácia k svadobnej výzdobe" / „objednávka
  kytice na termín"), formulár, mapa, otváracie hodiny.

### Zaradenie do našich služieb (aby to reálne predávalo)

- **`/ukazky` portfólio** (index šablón) — interné, `noindex` (fiktívny obsah).
- **Predajná karta na digitalnapomoc.sk** — nová karta v sekcii **Služby**
  („**Prémiové weby na kľúč**" / „Weby na úrovni, akú si všimnete") → odkaz na
  **živú ukážku** `/ukazky/kvetinarstvo`. Táto karta/stránka **je** indexovateľná
  (naša reálna služba), len **odkazuje** na noindex demo. Tým sa z ukážky stáva
  konkrétny predajný argument, nie len „niečo v šuflíku".
- Neskôr: viac ukážok (autoservis, zubár) → z `/ukazky` sa stane **portfólio
  odvetví**, ktoré na obchodnom stretnutí otvoríš a klient si vyberie.

### Dopad na míľniky

- **M1** — do `docs/sablony-kvalita.md` pridať **motion pravidlá** (mantinely
  vyššie) a rozhodnutie o Framer Motion (závislosť sa doinštaluje až v M2).
- **M2** sa rozdelí na **M2a — statická špičková šablóna** (dizajn, sekcie, obsah,
  a11y, Lighthouse) a **M2b — motion vrstva** (Framer + set-piecy) navrch. Dôvod:
  najprv perfektný statický základ, ktorý obstojí aj bez animácií (a je fallbackom
  pre `reduced-motion`), až potom motion. Každý pod-míľnik = ľudská revízia.
- **M3** (rezervačný modul) a ďalšie ostávajú.

## Učiaca sa slučka — agenti sa stále zdokonaľujú (požiadavka majiteľa)

> Sub-agenti **neberú prvú šablónu ako zabetónovaný vzor** — musia sa priebežne
> zlepšovať vo webovom dizajne, funkčnosti a všetkom súvisiacom. Tri slučky:

1. **Retrospektíva po každej šablóne (povinná).** Po dokončení a ľudskej revízii
   sa ponaučenia zapíšu späť do `.claude/agents/*.md` a `docs/sablony-kvalita.md`
   (rovnaká kultúra ako ponaučenia v `dennik.md`). Čo majiteľ vytkol pri revízii,
   ďalšia šablóna už nezopakuje — agenti si tieto súbory čítajú na štarte práce.
   Definície agentov sú **živé súbory**.
2. **Prieskum pred každou šablónou.** `ui-ux-designer` pred novým odvetvím vždy
   spraví čerstvý prieskum (špičkové weby odvetvia, aktuálne trendy, nové web
   API/CSS možnosti) — dizajn neskostnatie na vzoroch prvej šablóny; každé
   odvetvie dostane vlastný dizajnový výskum, nie „kvetinárstvo v inej farbe".
3. **Modely a nástroje rastú s trhom.** Model každej roly je jeden riadok v
   hlavičke definície — nový lepší model = jedna zmena, celý tím sa zlepší.
   To isté platí pre nástroje (napr. keď pribudne Higgsfield konektor,
   generovanie videa sa presunie do sedenia).

## Otvorené drobnosti (doriešiť pri realizácii)

- **Motion technológia** — default „Framer Motion + natívne CSS, prémiovo jemná
  intenzita" (GSAP len na 1–2 set-piecy podľa potreby); finálne slovo pri M2b.
- Konkrétny zoznam sekcií/stránok kvetinárskej šablóny (rozvrhne `ui-ux-designer`
  v M2, majiteľ odsúhlasí).
- Zdroj obrázkov na finále (stock vs generované) — rozhodnúť v M2 podľa vzhľadu.
- Či demo šablóny dostanú vlastnú (fiktívnu) doménu na plné „naostro" demo, alebo
  ostanú len na `/ukazky` (`noindex`). Default: `/ukazky`.
- Suma za platený náhľad + cenové balíky (šablóna + lego agenti) — samostatné
  kolo o cenách, až po M2 (rozhodnutie majiteľa: neskôr).
- Recenzie z Google ako referencie v šablóne klienta — len so súhlasom klienta
  (GDPR); zvážiť pri prvom reálnom nasadení.

## Šablóna kvetinárstvo — napojiteľnosť (RÁTAŤ S TÝM pri ďalšom vývoji)

> Požiadavka majiteľa (aug 2026): základná šablóna sa má stavať tak, aby sa dala
> kedykoľvek rozšíriť a napojiť na backend schopnosti projektu. Šablóna je
> **dizajnová škrupina**, prispôsobenie = zmena dát (`content.ts`, `media.ts`,
> `theme.css`), nie prepis komponentov. Naplánované cesty napojenia:

| Rozšírenie | Ako | Väzba |
|---|---|---|
| Ďalšia stránka / podstránka (napr. `/sluzby/[slug]`) | nový page komponent + `registry.ts` (optional catch-all route) | `frontend-dev` |
| **Obchod → reálny nákup** | WooCommerce Store API (embednutý checkout → plný); produkty vo WP | Fáza 4 |
| **Blog → headless WordPress klienta** | prepnúť dátový zdroj z demo `content.ts` na WP REST (`lib/wp.ts`, ISR) | M4 / go-live klienta |
| **Článkový agent** (písanie článkov → WP koncept) | `orchestrator/wp_writer_agent.py` → WP; cron worker + config v Directuse | Fáza 3 |
| **Chatbot** (RAG) | zapojiť zdieľaný `chat-widget` + `/api/chat` (bez duplicity logiky) | `docs/rag-chatbot.md` |
| **Leady / CRM** | formuláre → Directus `client_leads` | ✅ hotové |

Dátové toky (vízia): návštevník → Next.js → číta WP / zapisuje leady do Directusu;
agenti → čítajú config z Directusu → publikujú do WP → frontend zobrazí. Každé
napojenie je definovaný míľnik (M3/M4, Fáza 3/4), nie „prepínač" — ale
**architektúra je naň postavená** (lego princíp, `frontend-dev` moduly len zapája).

# PLÁN — Kvetinový e-shop na kľúč (M7, PREPRACOVANÉ — aug 2026)

> **Názov modelu:** *„Kvetinový e-shop na kľúč"* (rozhodnutie majiteľa). Názov je
> zámerne **vlastný a predajný** — nemá odkazovať na žiadnu cudziu referenciu;
> hovorí presne to, čo klient dostane: hotový kvetinový e-shop na kľúč.
>
> **⚠️ Referencia vs. identita (dôležité):** stránku `kvetinarstvoelizabeth.sk`
> používame **výhradne interne ako meraciu latku** („toto je súčasná špička, my
> musíme byť lepší"). **Navonok nesmie byť vidno, že sme čokoľvek replikovali** —
> vlastný názov, vlastný dizajnový jazyk (paleta/typografia/rytmus z `theme.css`
> šablóny, nie prevzatý layout), vlastné texty. **Cieľ nie je dobehnúť latku, ale
> ju prekonať** — konkrétne prevahy definuje sekcia „Naša úroveň" nižšie.
>
> ⛔ **NAHRÁDZA pôvodný plán „Konfigurátor kytíc — Kvetinársky ateliér s Klárou"
> (K0–K4), ktorý je zachovaný nižšie len pre históriu a ponaučenie.** Pôvodný
> plán staval na **skladačke kytice kvet-po-kvete** + **fotorealistickej AI
> floristke „Klára"**. Po realizácii K1 (deterministické skladanie z výrezov) sa
> ukázalo, že tento model **nedosiahne profesionálnu úroveň a nie je to, ako
> reálne kvetinárstva predávajú**. Toto plánovacie sedenie (aug 2026) ho úprimne
> posúdilo, otvorilo referencie reálnych kvetinárstiev a rozhodlo o pivote.
>
> **PONAUČENIE (aby sme také chyby v plánovaní nerobili a stavali len funkčné
> systémy):** efektnú mechaniku („skladá kyticu pred očami", AI postava) sme
> povýšili nad **overený predajný model**. Správne poradie je opačné —
> **najprv over, ako to robí špička v odbore (referencie), až potom navrhuj
> mechaniku.** Keby sme referencie (Elizabeth) otvorili na začiatku plánovania
> K0–K4, K1 sme nemuseli postaviť. Odteraz: **každý plán, ktorý má niečo predať,
> začína prieskumom reálnej referencie, nie nápadom na efekt.**

## Prečo pivot — úprimné posúdenie (5 otázok sedenia)

1. **Realizovateľnosť „Klára + skladanie pred očami": NIE ako hlavný predajný
   model.** Dva nezávislé dôvody: (a) **vizuál skladanej kytice nikdy nedosiahne
   úroveň reálnej fotky** — K1 skladá kyticu z ~30 otočených PNG výrezov do CSS
   vejára; aj s fotorealistickými výrezmi je výsledok *koláž*, nie profesionálna
   *aranžmá* (výrezy sa neprekrývajú, netienia ani neviažu ako reálne kvety).
   Jediná cesta k „ako foto" je per-klik AI — oprávnene zamietnuté (latencia,
   kredity, nedeterminizmus). (b) **Klára jadro nerieši** — je to divadlo okolo
   zlého modelu; navyše uncanny-valley riziko, krehká konzistencia tváre, náklad
   údržby a v tomto prostredí **egress blok na Kling CDN** (assety sa nedali
   stiahnuť do repa).
2. **Ako predáva špička (referencia Elizabeth):** **hotové, naaranžované,
   odfotené kytice ako produkty** — nie skladačka. Produktová karta: 2 fotky
   z uhlov, nálepka „Bestseller", cena (55 € / 25 ruží), varianty veľkosti
   (15/25/40 ks), sekcia „O kytici" (z čoho, priemer 24 cm, trvácnosť 7–10 dní),
   počítadlo, „Pridať do košíka", info o donáške. Filtre **druh / farba /
   príležitosť**, mobile-first. Druhý pilier: **„objednávka na mieru podľa
   rozpočtu"** — žiadna skladačka. Ich biznis dôvod: kontrola kvality/ceny/
   brandingu (100 % marža vs. 30 % cez sprostredkovateľa).
3. **Čo z K1 ostáva:** viď tabuľku „Čo z K0/K1 prevziať" nižšie.
4. **Ako dorovnať a prekonať latku:** viď „Naša úroveň" a „Dizajnová latka".
5. **Klára:** ako predajca skladačky odpadá. Prípadná neskoršia rola = **textový
   poradca** (chatbot odporúča HOTOVÉ kytice z katalógu) — náš existujúci RAG/
   chatbot vzor; fotorealistická postava + video slučky **vypustené z v1**.

## Kľúčové zistenie — Elizabeth NEbeží na WordPresse (a čo z toho plynie)

Overené v sedení (prípadová štúdia brand360.sk + technické stopy stránky):

| Elizabeth (referencia) | Náš ekvivalent |
|---|---|
| **Next.js 16** (frontend) | **Next.js 16** — *rovnaké* |
| **Vercel** (hosting) | **Railway** |
| **Supabase** (Postgres — produkty, fotky) | **WordPress / WooCommerce** (produkty = obsah) |
| **Vlastný admin** (kvetinár spravuje kytice bez programátora) | **WP admin (WooCommerce)** — natívny, nemusíme ho stavať |
| **Stripe** (platby) | **Woo + Stripe** (až po odomknutí predaja) |

Elizabeth si **musela** postaviť vlastný admin, lebo WordPress nemajú. **My ho
stavať nemusíme** — máme WP a WooCommerce nám admin dá natívne (rebrík
minimalizmu, bod 4: „natívna funkcia platformy"). Klient spravuje kytice
v **známom WP admine**, presne ako chce majiteľ („aby si to zákazník vedel
reálne spravovať").

## Cieľový model (rozhodnutie majiteľa, aug 2026)

**„Kvetinový e-shop na kľúč", postavený headless:** hotové kytice ako **produkty** (nie
skladačka), zdroj produktov **WooCommerce v klientovom WP admine**, náš **Next.js
frontend ako katalóg** (mriežka + detail + filtre), **AI poradca** priamo
v katalógu a neskôr **„produkt agent"**, ktorý kytice s popismi generuje ako
**Woo koncepty** na schválenie. Tieto AI vrstvy sú to, čím **prekonávame latku**
(referencia ich nemá) — viď „Naša úroveň" nižšie.

## Naša úroveň — v čom prekonávame latku (nie replika, ale lepšie)

> Latka (referencia) je dnes maximum: hotové kytice, karta s variantmi, filtre,
> Stripe, vlastný admin, mobile-first. **My tú latku dorovnáme v základe a
> prekonáme v troch vrstvách, ktoré referencia nemá.** Každá prevaha je označená,
> **kedy je zrealizovateľná** (E1 hneď · E2/E3 neskôr) — aby bolo jasné, na akej
> úrovni budeme a kedy.

**A. Základ, kde musíme byť minimálne rovní (E1):** produktová karta, detail
s variantmi veľkosti, filtre (príležitosť/farba/typ), sekcia „O kytici", prvky
dôvery, mobile-first, čistý svetlý dizajn. *Toto je vstupné — nie prevaha.*

**B. Tri vrstvy, ktorými sme LEPŠÍ (referencia ich nemá):**

| # | Prevaha | Prečo je to lepšie ako latka | Kedy |
|---|---|---|---|
| 1 | **AI poradca priamo v katalógu** | Referencia necháva zákazníka hľadať samého. My dáme bublinu „Poradím s výberom" — spýta sa na príležitosť/rozpočet/komu a **odporučí konkrétne HOTOVÉ kytice z katalógu** (cituje, odkáže na produkt). Náš RAG/chatbot vzor už existuje → „ukáž nepovedz" (vízia §8/§11). Zážitok obsluhy bez fotorealistickej postavy a bez skladačky. | E1 základ katalógu · poradca ako nadstavba (samostatný krok po E1, RAG vzor) |
| 2 | **Web, ktorý sa sám plní a žije (produkt agent + Writer)** | Referenciu plní človek ručne. Náš **produkt agent** generuje sezónne kytice + popisy „O kytici" ako Woo koncepty; **Writer/SEO agent** píše okolo nich články („Aké kvety k výročiu"). Katalóg je vždy aktuálny a obsahovo bohatší = viac návštev z Googla. | E3 (agent), priebežne |
| 3 | **Nájditeľnosť v Google AJ v AI vyhľadávačoch (SEO + GEO)** | Referencia cieli na Google. My cez skill `seo-geo-frontend` pridáme **Product JSON-LD** (cena, dostupnosť, hodnotenia), sitemap, `llms.txt` → kytice sa objavia v **ChatGPT / Perplexity / Google AI Overviews**, nielen v klasickom vyhľadávaní. Tam nás konkurencia ešte nemá. | E1 (statické produkty už s JSON-LD) → plné pri go-live |

**C. Remeselná úroveň, kde chceme byť viditeľne kvalitnejší (E1):**

- **Výkon a prístupnosť merateľne na špičke** — brána `docs/sablony-kvalita.md`:
  Lighthouse ≥ 95, **WCAG AA**, žiadny horizontálny scroll, reduced-motion. Nie
  „tiež dobré", ale **merateľne lepšie** (číslo, ktoré vieme ukázať klientovi).
- **Vkus a jemný motion** — skilly `emil-design-eng` + `animate`: mikrointerakcie
  (hover kariet, prechod do detailu, plynulá zmena variantu), nikdy gýč. Detaily,
  ktoré referencia nerieši.
- **Transparentnosť nad rámec** — pri každej kytici „**z čoho je**" (reálne odrody
  z `konfiguratorKvety`), sezónnosť, trvácnosť, pôvod. Buduje dôveru silnejšie než
  len „7–10 dní".
- **Vlastný dizajnový jazyk** — paleta/typografia/rytmus zo `theme.css` šablóny,
  **nie prevzatý layout referencie**. Navonok = úplne naša identita.

**Zhrnutie úrovne:** *v základe (E1) na úrovni špičky a merateľne rýchlejší/
prístupnejší; v zážitku a obsahu (poradca + agent + GEO) o vrstvu vyššie, kde
referencia zatiaľ nie je.* To je „dokonalý cieľ" — a je zrealizovateľný, lebo
všetky tri prevahy stoja na moduloch, ktoré už v projekte máme (RAG vzor, Writer/
SEO agent, seo-geo skill, kvalita-brána).

## Architektúra — kde žijú kytice (dôležité, drží hranice CLAUDE.md)

- **Kytice = produkty = obsah katalógu → WordPress / WooCommerce.** NIE Directus.
  Pravidlo z `CLAUDE.md`: *„obsah nikdy do Directusu, leady/logy nikdy do WP —
  inak sa systém nedá replikovať."* Kytica je obsah → patrí do WP.
- **Klient spravuje v WP admine** (Woo produkt: fotka, cena, varianty veľkosti,
  popis „O kytici", atribúty farba/príležitosť/typ).
- **Frontend číta cez Woo Store API** (headless, ako číta WP články dnes).
- **Directus ostáva len** `client_leads` / `agent_config` / `agent_logs`.
- *(Directus by sa dal použiť ako Elizabeth Supabase — kolekcia `kytice`. Ale
  porušuje hranicu „produkty do WP" a klient by mal dva adminy. Woo je čistejšie
  a konzistentné s víziou Fáza 6 + párovaním agent↔Woo §8.)*

## Prevádzka, náklady a replikácia (prečo Woo, a čo treba inštalovať)

> Prečo je náš WP/Woo model lepšia voľba než custom stack referencie (Next.js +
> Supabase + Stripe), a čo to prakticky znamená pre infraštruktúru. **Predaj je
> ZAMKNUTÝ** — platobné brány/dopravu tu riešime len koncepčne, nekonfigurujeme.

**Náklady (Woo vs. Supabase/Stripe):** nie je to hlavný rozhodovací faktor —
Supabase/Vercel majú free tier, potom rádovo ~$20–25/mes každá. **Rozhodujúce nie
je, čo je lacnejšie, ale kde je zdroj pravdy a kto to spravuje:** referencia má
produkty v Supabase + **admin, ktorý im musela agentúra postaviť a udržiavať**;
my máme produkty vo **WooCommerce v klientovom WP** — admin je **natívny, zadarmo
a klient ho už pozná**. WooCommerce je open-source (0 € za plugin).

**Platobné brány — výhoda Woo pre SK trh:**
- **Stripe** (referencia) zvláda karty + Apple/Google Pay, ale **slovenské lokálne
  metódy** (bankové prevody TatraPay/VÚB ePlatby a pod.) **natívne nepodporuje** —
  klient je viazaný na jednu bránu.
- **Woo** má hotový plugin prakticky pre **každú SK bránu** (GoPay, Besteron,
  TrustPay, Barion, GP webpay, 24-pay, aj Stripe/PayPal) → klient si vyberie.

**Doprava/donáška — výhoda Woo:** natívne *shipping zones* (sadzby podľa regiónu,
prahy zdarma) + pluginy pre SK kuriérov (Packeta/Zásielkovňa, GLS, DPD, Slovenská
pošta, osobný odber). Pre kvetinárstvo je donáška kľúčová — Woo to má **hotové**,
referencia to má naprogramované custom (drahšie na údržbu).

**Replikácia na ďalšie kvetinárstva (vízia Fáza 5):** vzor **„1 klient = 1
WordPress + WooCommerce"** (jeho admin, jeho produkty, jeho brána, jeho doprava) +
náš **frontend šablóna `templates/kvetinarstvo/`**, ktorá sa naň napojí cez Store
API a customizuje (skill `site-customizer`, M4/M5). Model **nie je viazaný na Boma
Floru** — tá je len demo značka šablóny; ďalší kvetinár = zmena obsahu, nie kódu.

**Čo treba inštalovať (praktické, podľa fázy):**

| Fáza | WP + Woo? | Poznámka |
|---|---|---|
| **E1 (teraz, demo)** | **NIE** | Katalóg statický v `content.ts` — žiadna nová infraštruktúra. |
| **E2 (reálny Woo zdroj)** | **ÁNO** | Kytice žijú vo Woo. Buď **klientov WP** (produkčne), alebo **samostatná demo WP+Woo inštancia** na test napojenia. |

- **Nemiešať s `wp.digitalnapomoc.sk`** — ten je pre náš obsah (články), nie pre
  kvetinárske produkty. Pre kvetinársky e-shop = **samostatné WP+Woo** (nová
  subdoména/inštancia).
- „Nová inštalácia" = založiť ďalší WordPress + doň nainštalovať Woo (zadarmo) →
  **nie nová drahá služba**; hosting už máme.

## Fázy (nahrádzajú K0–K4)

| Krok | Typ | Čo | Zdroj kytíc | Predaj |
|---|---|---|---|---|
| **E1 — Katalóg hotových kytíc** ✅ HOTOVÉ a **zlúčené do `main`** (PR #67; detail v `dennik.md` 17.8.2026) | KÓD | Katalóg hotových kytíc `/kytice` (mriežka kariet + filtre) + detail `/kytice/[slug]` (galéria, cena, varianty, „O kytici", CTA) + objednávka na mieru cez existujúci `?typ=kytica`. Nahradí skladaciu `/konfigurator`. | **Staticky v `content.ts`** (rozhranie pripravené na výmenu na Woo) | **Zamknutý** — len formulár, žiadny checkout |
| **E1-assety — Fotky hotových kytíc** (podľa potreby) | KREATÍVA (samostatné sedenie) | **Demo = AI generované** fotorealistické kytice (jednotný štýl, 2 uhly); **klient = reálne fotky**. Detaily → sekcia „Stratégia produktových fotiek". **Nemieša sa do E1** (1 sedenie = 1 typ). | — | — |
| **E2 — WooCommerce zdroj** (NESKÔR, reálny klient) | KÓD | Prepnúť zdroj katalógu na **Woo Store API**; klient spravuje v WP admine. Frontend sa nemení, len dátový zdroj. | WooCommerce (WP) | Woo + Stripe (len na výslovný pokyn) |
| **E3 — Produkt agent** (NESKÔR) | AGENT | „Produkt agent" (vzor Writer): z príležitosti/sezóny/odrôd vygeneruje názov + popis „O kytici" + atribúty + cenu (+ obrázok cez Gemini) → **Woo koncept** na schválenie. Konkretizácia plánovaného „WooCommerce/produkt agenta" (vízia §3). | → Woo koncepty | — |

## Stratégia produktových fotiek (E1-assety, samostatné kreatívne sedenie)

Fotky sú **kreatíva = samostatné sedenie**, nie E1 (kód). E1 postaví katalóg
s placeholdermi / existujúcimi fotkami; fotky sa „nasypú" bez zásahu do kódu
(cesty v `content.ts`). Stratégia sa líši podľa toho, či je to demo alebo klient:

- **Demo (Boma Flora) = AI generované, fotorealistické.** Fiktívna značka pod
  `/ukazky` + `noindex` → **žiadny etický problém** (nikoho neklameme). Výhody:
  jednotný štýl (čisté pozadie, 1–2 uhly ako latka), nulové náklady, rýchlosť, a
  je to zároveň ukážka „vieme vyrobiť produktové vizuály". Cieľ: **nerozoznateľné
  od skutočných živých kytíc.**
  - ⚠️ **Kling CDN je blokovaný egressom** (overené v K1 — sťahovanie assetov
    z `klingai.com` vracia 403). Preto generovať cez **Higgsfield** alebo
    **Gemini** (funguje — používa ho Writer na obrázky článkov), prípadne
    vygenerovať a **nahrať súbory z Macu**. Ulož do `public/kvetinarstvo/…`,
    atribúcia do `images/LICENSES.md`.
- **Reálny klient (E2+) = jeho SKUTOČNÉ fotky.** Reálny kvetinár predáva reálnu
  kyticu (latka má „foto pred doručením"). AI fotka kytice, ktorú zákazník
  nedostane, by bola **klamlivá** → u klienta výhradne reálne fotky jeho kytíc.

**Poradie:** E1 (kód, placeholder) → potom kreatívne sedenie na demo fotky. Alebo
naopak, ak chceš mať E1 rovno s fotkami — vždy sú to však dve sedenia.

## Čo z K0/K1 prevziať (a čo zahodiť)

| Prvok | Verdikt v novom modeli („Kvetinový e-shop na kľúč") |
|---|---|
| `konfiguratorKvety` — **16 odrôd v `main`, 21 na K1 vetve** (farba/sezóna/príležitosť/cena) | **Prevziať** — podklad pre popisy „O kytici" a filtre; z čoho je ktorá kytica. |
| **10 orezaných foto-výrezov (webp)** na K1 vetve + **orez-postup** (Pillow/scipy flood-fill) | **Prevziať ako bonus/techniku** — drobné detaily „z čoho je kytica"; orez-postup sa hodí na akékoľvek foto-assety. |
| `Kytica` typ + `seasonalKytice` (3 hotové kytice) v `main` | **Rozšíriť** — základ produktového modelu katalógu (pridať `id/slug`, fotky[], cena number, varianty, popis „O kytici", atribúty, nálepka). |
| K0 stránka `/konfigurator` (skladací súčet) + `konfigurator.tsx` sekcia | **Nahradiť** stránkou katalógu; skladaciu mechaniku zahodiť. |
| `kytica-vizual.tsx` skladací vejár + `KvetHlava` SVG siluety + `.kv-*` motion (K1 vetva) | **Zahodiť** — slúži zlému modelu; SVG siluety sú navyše „kreslené", čo majiteľ zavrhol. |
| Objednávka cez `?typ=kytica` (kontakt-form) | **Prevziať** — pilier „objednávka na mieru", bez zmeny. |
| **K1 vetva `claude/krok-k1-kytica-vizual-z2pg19`** | **Nemergovať** do `main`. Ostáva ležať ako referencia; užitočné súbory (21 odrôd, výrezy, orez-postup) prevezme E1 selektívne (cherry-pick / kópia súborov). |

## Dizajnová latka — dorovnať a prekonať latku (pre E1)

- **Ladí s Boma Flora (dôležité, zatiaľ):** katalóg je **súčasť existujúcej
  šablóny**, nie cudzí prvok — používa dizajnový jazyk šablóny
  (`templates/kvetinarstvo/theme.css`: paleta, typografia, rádiusy, tiene, rytmus
  medzier) a existujúce UI komponenty (`sections/ui.tsx`, karty, tlačidlá).
  Návštevník nesmie mať pocit, že prišiel na iný web. Vlastná identita = Boma
  Flora, **nie prevzatý layout latky**.
- **Produktová karta (mriežka `/kytice`):** veľká kvalitná fotka, názov, cena
  „od X €", voliteľná **nálepka** (Bestseller / Sezónne / Novinka), jemný hover.
- **Detail `/kytice/[slug]`:** galéria (1–2 fotky), cena, **varianty veľkosti**
  (S/M/L → počet stoniek/cena), sekcia **„O kytici"** (z čoho — z `konfiguratorKvety`
  —, priemer, trvácnosť 7–10 dní, čo je v cene), **prvky dôvery** (foto pred
  doručením, info o donáške), CTA „Objednať" → `?typ=kytica&zhrnutie=`.
- **Filtre** podľa **príležitosti / farby / typu** (chips, `aria-pressed`; dáta
  z atribútov kytice — rovnaký vzor ako K0 filter kvetov).
- **Mobile-first**, svetlý čistý dizajn (súhlasí s víziou §10), motion mantinely
  a brána kvality podľa `docs/sablony-kvalita.md`.
- **Odporúčaný pipeline sedenia:** subagenti šablón — `ui-ux-designer` (rozvrh
  karty/detailu/filtrov, ak treba nové sekcie) → `frontend-dev` (implementácia) →
  `sk-copywriter` (texty kytíc do `content.ts`) → `qa-a11y` (brána kvality pred
  odovzdaním). Nie je povinné, ale sedí na cieľ „nad úroveň latky".

## Mantinely (platia pre celé M7)

- **Demo pod `/ukazky`, `noindex`.** Go-live/predaj **zamknuté** — E1 nemá
  checkout ani platbu, len objednávkový formulár (v deme sa neodosiela).
- **Žiadne AI za behu** v E1 (statický katalóg). AI až v E3 (agent, koncepty).
- **Minimalizmus (rebrík):** WooCommerce = natívny admin (nestaviame vlastný);
  jedna dátová sada odrôd poháňa popisy aj filtre; žiadna nová ťažká závislosť.
- **Hranice dát:** kytice do WP/Woo, nikdy do Directusu.

## Odporúčaný model Claude na realizačné (kódové) sedenie E1

- **Opus** (Opus 5, príp. Opus 4.8) — **odporúčané pre E1.** Cieľ je *dizajnovo*
  prekonať latku (nie len „nech to funguje"); Opus dáva najvyššiu
  kvalitu dizajnu aj architektúry a menej prehľadne kôl.
- **Sonnet 5** — alternatíva, ak chceš rýchlejšie/lacnejšie; plán je dosť
  detailný, aby ho Sonnet zvládol implementovať. Dizajnovú latku strážia
  subagenti + `qa-a11y`.
- **Subagenti šablón** (`ui-ux-designer`, `frontend-dev`, `sk-copywriter`,
  `qa-a11y`) bežia na svojich vlastných modeloch — nemeníš ich.

## Štartový prompt pre realizačné sedenie E1 (copy-paste; KÓD)

```
Najprv si prečítaj docs/dennik.md (najnovšie navrchu + Backlog), docs/vizia.md a
docs/plan-agenti.md (sekcia „Kvetinový e-shop na kľúč (M7)", najmä
„Naša úroveň — v čom prekonávame latku"). Rešpektuj CLAUDE.md pravidlá
spolupráce (go-live a predaj ZAMKNUTÉ; 1 sedenie = 1 typ).

Toto je REALIZAČNÉ sedenie (TYP: kód — nemiešaj s generovaním fotiek/assetov).
Postav KROK E1 — katalóg hotových kytíc „Kvetinový e-shop na kľúč" pre šablónu
kvetinárstvo. Model je HOTOVÁ KYTICA AKO PRODUKT (žiadna skladačka kvet-po-kvete —
tá je zavrhnutá; skladací /konfigurator a K1 kytica-vizual sa NAHRÁDZAJÚ).

Interná latka kvality (NEreplikovať navonok, len meradlo): kvetinarstvoelizabeth.sk
ukazuje súčasnú špičku hotových kytíc (karta fotka/cena/varianty/„O kytici", filtre
príležitosť/farba/typ, mobile-first, prvky dôvery). MY MUSÍME BYŤ LEPŠÍ — vlastný
dizajnový jazyk (theme.css šablóny, nie prevzatý layout), vlastný názov, a v základe
merateľne rýchlejší/prístupnejší. Nesmie byť vidno, že sme čokoľvek replikovali.

1) DÁTOVÝ MODEL (frontend/templates/kvetinarstvo/content.ts): rozšír/nahraď typ
   „Kytica" na produkt katalógu: id, slug, nazov, fotky[] (alt + cesta),
   cenaOd (číslo), varianty veľkosti (napr. S/M/L → počet stoniek + cena),
   „o kytici" (z čoho — čerpaj z konfiguratorKvety —, priemer, trvácnosť 7–10 dní,
   čo je v cene), atribúty (prilezitost[], farba, typ), voliteľná nálepka
   (Bestseller/Sezónne/Novinka). Prepoužij existujúce seasonalKytice ako základ;
   rozhranie priprav na neskoršiu výmenu zdroja na WooCommerce Store API (E2) —
   dátový prístup drž za jednou funkciou/mapou, nie roztrúsene po komponentoch.
   (Ak prevezmeš 21 odrôd z K1 vetvy claude/krok-k1-kytica-vizual-z2pg19, ber len
   dáta v content.ts a webp výrezy — NIE kytica-vizual.tsx skladačku.)

2) KATALÓG (stránka /kytice): mriežka produktových kariet (fotka, názov, cena
   „od X €", nálepka, hover) + FILTRE podľa príležitosti/farby/typu (chips,
   aria-pressed — rovnaký vzor ako K0 filter). Registrácia stránky v
   templates/kvetinarstvo/index.tsx (page + meta), catch-all route
   app/ukazky/[odvetvie]/[[...page]] NECHAJ tak.

3) DETAIL (stránka /kytice/[slug]): galéria (1–2 fotky), cena, výber variantu
   veľkosti (klientský stav, živá cena, Intl sk-SK/EUR), sekcia „O kytici",
   prvky dôvery, CTA „Objednať" → predvyplní kontakt-form cez
   ?typ=kytica&zhrnutie=<názov kytice + variant>. (Predvyplnenie ?typ= a
   ?zhrnutie= v kontakt-form.tsx UŽ existuje — neduplikuj, len odovzdaj.)

4) NAHRADENIE: skladaciu stránku /konfigurator a sekciu konfigurator.tsx nahraď
   (alebo presmeruj) katalógom; prelinky z /obchod, /ponuka a /atelier uprav na
   /kytice. Skladací vizuál (kytica-vizual.tsx) do main NEmerguj.

5) FOTKY: E1 je KÓD — fotky sú iný typ (kreatíva). V E1 NEGENERUJ fotky. Použij
   existujúce fotky z public/kvetinarstvo/ (hero/galéria) alebo čistý CSS
   placeholder, nech je katalóg funkčný; kód priprav tak, aby sa fotky doplnili
   len zmenou ciest v content.ts (bez zásahu do komponentov). Fotky demo kytíc sa
   spravia v samostatnom kreatívnom sedení: demo = AI generované fotorealistické
   (Higgsfield/Gemini — Kling CDN je blokovaný egressom), klient = reálne fotky.

Dizajn: katalóg musí LADIŤ s existujúcou šablónou Boma Flora — použi jej dizajnový
jazyk (templates/kvetinarstvo/theme.css: paleta, typografia, rádiusy, tiene, rytmus)
a existujúce UI komponenty (sections/ui.tsx, karty, tlačidlá). Návštevník nesmie
mať pocit, že prišiel na iný web. Cieľ je PREKONAŤ latku (nie dobehnúť) — vlastná
identita + merateľne špičkový výkon/prístupnosť. Odporúčaný pipeline: ui-ux-designer
(rozvrh karty/detailu/filtrov v štýle Boma Flora) → frontend-dev (implementácia) →
sk-copywriter (texty kytíc) → qa-a11y (brána kvality podľa docs/sablony-kvalita.md).

Mantinely: slovenčina; demo pod /ukazky, noindex; predaj ZAMKNUTÝ (žiadny
checkout/platba, len objednávkový formulár); minimalizmus (rebrík CLAUDE.md);
kytice sú OBSAH → patria do WP/Woo, nikdy do Directusu. Pred písaním Next.js kódu
čítaj node_modules/next/dist/docs/ (frontend/AGENTS.md — breaking changes).
Over `npm run lint` + `npm run build`. Vetva claude/... , commit + push; merge do
main až po mojom výslovnom súhlase.
```

> **E1 je hotové a zlúčené (PR #67, aug 2026).** Prompt vyššie ostáva ako záznam
> zadania. Nasledujúce dve sedenia sú pripravené nižšie.

## Štartové prompty pre ďalšie sedenia (pripravené po E1)

> **Stav: A je ✅ HOTOVÉ a naživo** (18.8.2026, PR #72 + #73 — viď denník).
> Otvorené ostávajú **C** (ladenie výstupu chatbota, priamo nadväzuje na A) a **B**
> (nový modul). **Nemiešaj ich do jedného sedenia** — C je kód, B je stavba nového
> modulu. Fotky kytíc sú tretia, nezávislá vec (kreatíva) a čakajú, kým ich
> majiteľ dodá.

### A — Chatbot má vedieť, že staviame weby a máme šablóny (OBSAH + RAG) — ✅ HOTOVÉ 18.8.2026

> Ponechané pre históriu a ako vzor, ako písať zadanie s poctivým overením.
> Realizované: tri nové FAQ v `frontend/lib/content.ts`, PR #72 zlúčené, re-index
> prebehol, odpovede overené naživo. Detaily v `dennik.md` (18.8.2026).

```
Najprv si prečítaj docs/dennik.md (najnovšie navrchu + Backlog), docs/vizia.md
a docs/rag-chatbot.md. Rešpektuj CLAUDE.md pravidlá spolupráce (go-live a predaj
ZAMKNUTÉ; 1 sedenie = 1 typ; do main len cez vetvu + PR, merge až na môj výslovný
súhlas; na konci zápis do docs/dennik.md).

TYP SEDENIA: OBSAH + RAG. Nestavia sa nový modul, nemieša sa do toho AI poradca
v katalógu kytíc (to je samostatný prompt B nižšie).
Odporúčaný model: Sonnet 5 (na Opus to nie je).

PROBLÉM: náš chatbot na digitalnapomoc.sk nevie, že staviame moderné weby a máme
knižnicu odvetvových šablón (prvá hotová: kvetinárstvo „Boma Flora", zlúčená do
main v PR #67, beží na /ukazky/kvetinarstvo). Príčina NIE JE zastaraný index —
overené v orchestrator/rag_index.py: indexujú sa presne TRI zdroje — články
z WordPressu, pole `faqs` a `heroBullets`/`steps` z frontend/lib/content.ts.
Šablóna nie je v žiadnom z nich (žije pod /ukazky, ktoré je zámerne noindex).
Chýba teda SAMOTNÝ OBSAH, nie preindexovanie.

ÚLOHA: doplniť obsah tak, aby chatbot vedel pravdivo a konkrétne odpovedať na
otázky typu „staviate aj weby?", „viete spraviť web pre kvetinárstvo?", „ako
vyzerá vaša práca?" — a citoval zdroj.

1) ROZHODNI JEDNU CESTU (nie všetky naraz) a zdôvodni ju:
   (a) doplniť `faqs` + prípadne `heroBullets`/`steps` v frontend/lib/content.ts
       — najlacnejšie, hneď v indexe;
   (b) krátky článok cez Writer agenta — má aj SEO/GEO hodnotu, ale je to obsah
       navyše na údržbu;
   (c) rozšíriť rag_index.py o ďalšie zdroje (service karty, /headless-wordpress)
       — najväčší zásah, rob len ak (a) nestačí.

2) POZOR, MÁ TO VEREJNÝ DOPAD: pole `faqs` sa nezobrazuje len chatbotovi — je to
   FAQ sekcia na webe. Čokoľvek tam napíšeš, uvidia aj návštevníci. Text musí byť
   hotový na zverejnenie, nie „len pre index".

3) TEXT píš naším tónom, bez generických AI fráz (zoznam v docs/sablony-kvalita.md).
   Žiadne vymyslené referencie, počty klientov, ocenenia ani ceny, ktoré nemáme
   odsúhlasené. Hovor len o tom, čo reálne vieme: moderný Next.js frontend nad
   klientovým WordPressom (headless), klient si spravuje obsah v známom admine,
   hotové odvetvové šablóny, prvá je kvetinárstvo.

4) ROZHODNUTIE PRE MŇA (opýtaj sa a počkaj): má chatbot na ukážku aj ODKAZOVAŤ
   (/ukazky/kvetinarstvo)? Je to fiktívna značka Boma Flora a noindex demo —
   technicky odkaz nič nekazí (noindex platí pre vyhľadávače, nie pre ľudí),
   ale je to obsahové rozhodnutie, nie technické.

5) RE-INDEX — realita prostredia, nepredstieraj overenie:
   `python rag_index.py` potrebuje env premenné RAG_DATABASE_URL a GEMINI_API_KEY
   (orchestrator/.env, resp. Railway Variables). Cloud sedenie ich nemusí mať.
   Postup: zisti, či ich máš. Ak áno — spusti re-index (v orchestrator/, cez venv)
   a preskúšaj chatbota reálnymi otázkami; over, že odpovedá z NOVÉHO zdroja
   a cituje ho. Ak nie — priprav obsah, jasne mi napíš, že overenie prebehne až
   po nasadení, a daj mi PRESNÉ príkazy/kroky (ručne `python rag_index.py`,
   alebo „Run now" na orchestrátori na Railway; inak to naskočí pri najbližšom
   behu pipeline Po/St/Pi 06:00 UTC). NEHLÁS „chatbot to už vie", kým to nie je
   naozaj overené.

6) NA KONCI: zápis do docs/dennik.md (čo hotové, čo naživo, čo čaká) a odškrtni
   položku „Chatbot nevie o tom, že staviame weby / máme šablóny" v Backlogu
   (je v skupine 🟢 PRIPRAVENÉ).

Mantinely: slovenčina; tajomstvá výhradne v env premenných; nič nesľubuj za mňa;
go-live ani predaj nenavrhuj. Over `npm run lint` + `npm run build`, ak siahaš na
frontend. Vetva claude/... , commit + push; merge do main až po mojom „áno".
```


### C — Doladiť výstup a štýl odpovedí chatbota (KÓD, frontend) — ✅ HOTOVÉ 18.8.2026 (čaká na merge + skúšku naživo)

> Nadväzuje priamo na A. Vzniklo z toho, čo sme videli pri overovaní A naživo
> 18.8.2026 — odpovede sú vecne správne, ale podanie drhne. Malé, uzavreté
> sedenie: nič sa nestavia, iba sa ladí to, čo už beží.

```
Najprv si prečítaj docs/dennik.md (najnovšie navrchu + Backlog), docs/vizia.md
a docs/rag-chatbot.md. Rešpektuj CLAUDE.md pravidlá spolupráce (go-live a predaj
ZAMKNUTÉ; 1 sedenie = 1 typ; do main len cez vetvu + PR, merge až na môj výslovný
súhlas; na konci zápis do docs/dennik.md).

TYP SEDENIA: KÓD (frontend). Nemieša sa do toho Krok 5 (config do Directusu) ani
revízia obsahu článkov — to sú samostatné položky v Backlogu. Nedotýkaj sa
orchestrator/rag_index.py ani obsahu v content.ts, dnes sa ladí VÝSTUP.

ÚLOHA: doladiť výstup a štýl odpovedí chatbota. Backlogová položka „Výstup/štýl
odpovedí — dĺžka, tón, formátovanie, koľko zdrojov ukazovať".

Východisko (overené 18.8.2026, keď sme dopĺňali FAQ o weby a šablóny — viď
denník). Dva konkrétne nálezy, oba potvrdené v kóde:

1) ZDROJE SÚ ZAŠPINENÉ. frontend/lib/rag.ts má TOP_K = 5 a ŽIADNY prah
   podobnosti. dedupeSources(top) spraví „zdroj" z každého z tých piatich
   kúskov, aj keď je kosínus mizivý. Reálny dopad: pri otázke „viete spraviť web
   pre kvetinárstvo?" sa pod odpoveďou ukázal článok „CRM systém pre malú firmu".
   Návštevník to číta ako „toto je podklad k odpovedi" — a nie je. Znižuje to
   dôveryhodnosť presne tam, kde ju zdroje majú budovať.
   Zváž (rozhodni jednu cestu a zdôvodni ju): prah kosínovej podobnosti pre to,
   čo sa smie CITOVAŤ ako zdroj (kontext modelu môže ostať širší); alebo ukázať
   len zdroje kúskov, ktoré model naozaj použil; alebo relatívny prah voči
   najlepšiemu skóre. Pozor: prah nastavený od oka je hádanie — najprv si vypíš
   reálne skóre pre pár otázok a rozhodni sa podľa čísel, nie podľa pocitu.

2) MARKDOWN SA NEVYKRESĽUJE. components/chat-widget.tsx riadok ~193 renderuje
   odpoveď ako <p className="whitespace-pre-wrap">{m.content}</p>. Model pritom
   vracia **tučné** a odrážky, takže návštevník vidí hviezdičky ako text.
   Dve cesty: (a) povedať modelu v SYSTEM_PROMPT, nech píše čistý text bez
   markdownu; (b) vykresliť jednoduchý markdown vo widgete. Rozhodni JEDNU.
   Ak (b), tak bez novej ťažkej závislosti a bez dangerouslySetInnerHTML —
   platí „rebrík minimalizmu" z CLAUDE.md a XSS mantinel.

3) DĹŽKA A TÓN. Dnešné odpovede sú vecne správne, ale ukecané a každá končí
   výzvou na kontaktný formulár — pri troch otázkach za sebou to pôsobí ako
   otravný predajca. Uprav SYSTEM_PROMPT (lib/rag.ts): kratšie odpovede,
   výzva na kontakt len keď má zmysel (keď odpoveď naozaj nevie, alebo keď sa
   pýtajú na cenu/termín). NEZNIŽUJ anti-halucinačné zásady — pravda nad
   plynulosťou, žiadne vymyslené ceny/termíny/URL ostávajú.

MANTINEL NA OVERENIE: SYSTEM_PROMPT aj TOP_K žijú natvrdo v kóde, takže zmena =
zmena kódu na vetve a naživo až po merge. Chatbot ČÍTA KÚSKY Z DATABÁZY, nie
z buildu — na tieto zmeny netreba re-index, ale treba deploy. Cloud sedenie
nemusí mať RAG_DATABASE_URL ani GEMINI_API_KEY (v auguste ich nemalo) — zisti,
či ich máš. Ak nie, NEHLÁS, že je to overené: priprav zmenu, jasne napíš, že
overenie prebehne po nasadení, a daj mi presné kroky a otázky na skúšku.

Kontrolné otázky na porovnanie pred/po (tie isté, na ktorých sme to našli):
„staviate aj weby?", „viete spraviť web pre kvetinárstvo?", „ako vyzerá vaša
práca?", a k tomu jedna, na ktorú odpoveď NEMÁME (napr. „robíte aj tlač
vizitiek?") — na tej sa overuje, že bot stále poctivo prizná „neviem".

Over npm run lint + npm run build. Vetva claude/... , commit + push; merge do
main až po mojom „áno". Na konci zápis do docs/dennik.md a úprava backlogovej
položky „Výstup/štýl odpovedí".
```

### C-dobeh — doladiť chatbota podľa toho, čo ukázala skúška naživo (KÓD, malé)

> Spusti **iba ak** pri skúške po nasadení C niečo drhlo (viď denník 18.8.2026,
> bod 3 „Na čo sa pri tom pozerať"). Ak všetko sedelo, toto sedenie netreba —
> ďalej sa pokračuje prompt-om B alebo Krokom 5 (config do Directusu).

```
Najprv si prečítaj docs/dennik.md (najnovšie navrchu + Backlog) a
docs/rag-chatbot.md (sekcia „Výstup a štýl odpovedí"). Rešpektuj CLAUDE.md
pravidlá spolupráce (go-live a predaj ZAMKNUTÉ; 1 sedenie = 1 typ; do main len
cez vetvu + PR, merge až na môj výslovný súhlas; na konci zápis do dennika).

TYP SEDENIA: KÓD (frontend), malé ladenie. Nemieša sa do toho Krok 5 ani obsah.

ÚLOHA: doladiť výstup chatbota podľa toho, čo som videl naživo. Čo mi nesedelo:
<sem napíšem konkrétne — ktorá otázka a čo bolo zle>.

Kde to žije: frontend/lib/rag.ts (SYSTEM_PROMPT, splitCited, CITED_LINE,
TOP_K, MAX_SOURCES) a frontend/components/chat-widget.tsx (ChatText, bold).

Typické opravy podľa príznaku:
- v odpovedi svieti riadok „ZDROJE: …" → regex CITED_LINE nezachytil tvar, ktorý
  model poslal; rozšír ho a dopíš ten tvar do testovacej sady tvarov v denníku.
- pod odpoveďou nesvieti žiadny zdroj, hoci odpoveď zjavne z niečoho čerpala →
  model značku neposiela spoľahlivo; zváž presunutie inštrukcie o značke vyššie
  v SYSTEM_PROMPT, alebo prechod na štruktúrovaný výstup (responseSchema) —
  pozor, to sa nedá overiť bez GEMINI_API_KEY, takže to chce môj test naživo.
- odpovede sú príliš strohé/dlhé alebo výzva na kontakt chodí zle → sekcia
  „Dĺžka a tón" v SYSTEM_PROMPT.
NEZNIŽUJ anti-halucinačné zásady 1 – 5.

Mantinel: cloud sedenie zrejme opäť nebude mať RAG_DATABASE_URL ani
GEMINI_API_KEY — NEHLÁS „overené", priprav zmenu a daj mi presné kroky na skúšku.
Re-index netreba, treba deploy. Over npm run lint + npm run build. Vetva
claude/... , commit + push; merge až po mojom „áno". Na konci zápis do dennika.
```

### B — AI poradca v katalógu kytíc (AGENTI; prevaha č. 1 z „Naša úroveň")

```
Najprv si prečítaj docs/dennik.md (najnovšie navrchu + Backlog), docs/vizia.md,
docs/rag-chatbot.md a docs/plan-agenti.md (sekcia „Kvetinový e-shop na kľúč (M7)",
najmä „Naša úroveň — v čom prekonávame latku"). Rešpektuj CLAUDE.md pravidlá
spolupráce (go-live a predaj ZAMKNUTÉ; 1 sedenie = 1 typ).

Toto je sedenie typu AGENTI. Cieľ: AI poradca priamo v katalógu kytíc
(/ukazky/kvetinarstvo/kytice) — prevaha č. 1 oproti latke, ktorú referencia nemá.

Zážitok: bublina „Poradím s výberom" v katalógu. Poradca sa spýta na príležitosť,
rozpočet a pre koho, a ODPORUČÍ KONKRÉTNE HOTOVÉ KYTICE Z KATALÓGU — s názvom,
cenou od a odkazom na detail. Žiadna skladačka, žiadna fotorealistická postava.

Mantinely, ktoré rozhodujú o kvalite:
1) ZDROJ PRAVDY SÚ DÁTA KATALÓGU, nie model. Odporúčanie musí vzniknúť z
   `templates/kvetinarstvo/katalog.ts` (vsetkyKytice/filtrujKytice/cenaOd) —
   model smie vyberať a formulovať, NIE vymýšľať kytice, ceny či odrody.
   Halucinovaná kytica = chyba, ktorá zabije dôveru v celý model.
2) ŽIADNA DUPLICITA MODULU: prepoužij existujúci chat (`components/chat-widget.tsx`,
   `/api/chat`) — šablóna dodá len konfiguráciu, obsah a vizuálny obal. Pozor na
   ponaučenie z M2a: globálny widget z root layoutu sa na /ukazky/* vypína, takže
   poradca musí byť vedomé, lokálne zapnutý prvok šablóny, nie presakujúci globál.
3) PRIPRAVENÉ NA E2: po prepnutí katalógu na WooCommerce Store API sa poradca
   nesmie prepisovať — čítaj cez tie isté funkcie v katalog.ts.
4) VÝKON A PRÍSTUPNOSŤ: bublina nesmie zhodiť Lighthouse (lazy, žiadny ťažký
   balík navyše), plná ovládateľnosť klávesnicou, viditeľný fokus, aria-live pre
   prichádzajúce odpovede, reduced-motion. Brána: docs/sablony-kvalita.md.
5) PREDAJ ZAMKNUTÝ: poradca odporúča a odkazuje na detail kytice, nikdy
   neobjednáva ani nezbiera platbu; objednávka končí existujúcim formulárom
   (?typ=kytica&zhrnutie=).

Over `npm run lint` + `npm run build`, prejdi visual-qa a qa-a11y. Slovenčina;
demo pod /ukazky, noindex. Vetva claude/... , commit + push; merge do main až po
mojom výslovnom súhlase. Na konci zápis do docs/dennik.md.
```

---

# PLÁN — Konfigurátor kytíc „Kvetinársky ateliér s Klárou" (⛔ NAHRADENÝ vyššie — história/ponaučenie, M7, aug 2026)

> **⛔ TENTO PLÁN (K0–K4) JE NAHRADENÝ** sekciou „Kvetinový e-shop na kľúč"
> vyššie. Ponechaný zámerne pre históriu a ponaučenie (viď „PONAUČENIE"
> vyššie). K0 (funkčné jadro) je v `main`; K1 (skladací vizuál) ostáva na vetve
> a do `main` sa nemerguje. K2–K4 sa nerealizujú v pôvodnej podobe.

> **Výstup plánovacieho sedenia (aug 2026).** Nahrádza pôvodnú backlogovú
> poznámku „flower bar". Nič sa v tomto sedení nekódovalo — je to **plán +
> štartové prompty** pre samostatné realizačné sedenia (K0–K4).
>
> **⚠️ OPRAVENÝ PREDPOKLAD:** skoršie záznamy tvrdia, že Boma Flora je na
> nezlúčenej vetve `m1-frontend-agent-templates` a „neviditeľná". **To už
> NEPLATÍ** — overené `git`om: šablóna **je zlúčená v `main`**
> (`frontend/templates/kvetinarstvo/`, 28 súborov; mount `app/ukazky/…` tiež
> v `main`). Konfigurátor sa preto stavia **rovno nad `main`**, stále pod
> `/ukazky` s `noindex`. (Zastarané zmienky vyššie v tomto dokumente — riadky
> pri „Frontend knižnica šablón" a „M2a" — sú označené opravnou poznámkou.)

## Vízia zážitku (rozhodnutie majiteľa)

Nie „e-shopová klikačka", ale **pocit, akoby zákazník stál v kvetinárstve a
obsluhoval ho špičkový florista**. Postava: **fotorealistická AI floristka
„Klára"**, ktorá sa pýta na príležitosť, komu, farby a rozpočet, **sama
odporučí sezónne kvety** a kyticu **skladá pred očami**. Zákazník doladí počty,
cena beží naživo, na konci objedná.

## Princíp, ktorý rozhoduje o realizovateľnosti (dôležité)

**Ilúziu živej obsluhy vytvárame STRIHOM predpripravených assetov riadeným
konverzáciou — nie real-time generovaním postavy.** Preto:

- **Postavu Kláru vygenerujeme RAZ** ako konzistentnú fotorealistickú osobu
  (jeden master portrét → z neho sada póz/výrazov a krátke video slučky). Za
  behu ju len **prehrávame** podľa fázy rozhovoru → okamžitá odozva, vždy tá
  istá tvár, žiadne kredity za návštevníka.
- **Čokoľvek reaguje na každý klik, je DETERMINISTICKÉ** (skladanie kytice =
  vrstvené PNG + motion; súčet ceny = klientský stav). Žiadne per-klik AI.
- **AI za behu = len jeden voliteľný „glamour shot"** na konci (na počkanie,
  nie pri každom kliknutí). Real-time hovoriaci avatar s lip-syncom (HeyGen
  štýl) je drahý a krehký → **zámerne mimo v1** (prípadne filmová úroveň neskôr).

## Rozhodnutia tohto sedenia

| # | Rozhodnutie | Voľba | Prečo |
|---|---|---|---|
| 1 | **Postava** | **Klára — fotorealistická AI floristka** (nie štylizovaný maskot) | Majiteľ chce reálny „som v kvetinárstve" pocit. Konzistencia sa rieši character-sheetom + `image_to_video` z jedného master portrétu (nie opakované generovanie tváre). |
| 2 | **Video slučky** | **Áno, súčasť v1** (krátke: privítanie / počúva / viaže / hotovo) | Majiteľ ich výslovne chce ako súčasť zážitku. Vygenerované raz, uložené v `templates/…/images/`, prehrávané ako `hero-video.tsx` (vzor už v šablóne). |
| 3 | **Mozog (poradca)** | **Náš chatbot vzor** (Gemini + osobnosť z `agent_config`) | Textová konverzácia = rýchla, lacná, deterministický zážitok; „ukáž nepovedz" demo nášho agenta (vízia §8). Sadá do `/api/chat`. |
| 4 | **Vizuál kytice** | **Deterministické skladanie** (v1a zoznam+súčet → v1b PNG výrezy + motion) | Reaguje na klik okamžite, vždy predvídateľné. AI per-klik zamietnuté (latencia, kredity, nedeterminizmus). |
| 5 | **Dáta o kvetoch** | **Statické v `content.ts`** (nový export, **numerická cena/ks** + `farba`, `sezona`, `prilezitost`, výrez), rozhranie pripravené na výmenu zdroja | Dnešné ceny sú stringy („od 32 €") → nepoužiteľné na súčet. Directus/Woo je len neskoršia výmena zdroja (Fáza 4), nie prepis. Demo netreba zaťažovať kolekciou. |
| 6 | **Umiestnenie** | **Nová stránka `/ukazky/kvetinarstvo/konfigurator`** (page komponent + `base.ts`/registry), prelinkovaná z `/obchod` a `/atelier` | Lego vzor šablóny; žiadny zásah do routera (`[[...page]]` catch-all). `noindex` demo ostáva. |
| 7 | **Objednávka** | **Predvyplniť existujúci formulár** (`kontakt-form.tsx`, `?typ=kytica` + zhrnutie kytice) | `?typ=` predvyplnenie už existuje (riadky 23–25). Žiadna duplicita objednávkovej logiky. V deme sa neodosiela. |
| 8 | **Míľnik** | **M7 — rozšírenie vlajkovej šablóny kvetinárstva** | Prehlbuje vlajkovú referenciu; zvyšuje hodnotu produktizovanej šablóny (Fáza 5). Stále demo pod `/ukazky`. |

## Tok zážitku (cieľový obraz)

1. **Privítanie** — video slučka Kláry v ateliéri; predstaví sa a spýta:
   *„Pre koho bude kytica a pri akej príležitosti?"*
2. **Rozhovor** (3–4 otázky: príležitosť · komu · farby · rozpočet). Pri každej
   fáze Klára zmení pózu/klip (počúva → premýšľa → usmeje sa) → pôsobí živo.
3. **Odporučí sezónne, konkrétne** — z dátovej sady kvetov (`sezona`,
   `prilezitost`, `farba`, `cena/ks`) navrhne východiskovú kyticu v rozpočte.
4. **Skladá pred očami** — pridané kvety sa animovane zasunú do kytice
   (deterministicky, okamžite), cena beží naživo.
5. **Finálny glamour shot** (voliteľný vrchol) — tlačidlo „Ukážte mi ju naozaj"
   → **jedna** AI generácia fotorealistickej kytice z výberu (na počkanie).
6. **Objednávka** — „kytica + cena + zhrnutie" predvyplní existujúci formulár.

## Úrovne investície

| Úroveň | Klára | Vizuál kytice | Náklad / krehkosť |
|---|---|---|---|
| **MVP funkčný** (K0) | zatiaľ bez | zoznam + živý súčet + objednávka | nízky, robustné |
| **Prémiový cieľ** (K1–K3) | statické pózy z character-sheetu **+ video slučky** + konverzačný mozog | PNG výrezy + motion + finálny glamour shot | stredný, stále robustné |
| **Filmový** (neskôr) | real-time hovoriaci avatar / lip-sync / hlas | to isté | vysoký, krehké — **v1 NIE** |

**Postup:** stavať po vrstvách kvôli čistote sedení (1 sedenie = 1 typ), ale
cieľ = **Prémiový** (Klára + video + mozog). Majiteľ chce video slučky v ňom,
nie až „niekedy".

## Realizačné kroky (každý = samostatné sedenie, iný TYP práce)

> Delenie rešpektuje „1 sedenie = 1 typ" z `CLAUDE.md`. K2 je **kreatíva/asset**
> (generovanie AI postavy), K0/K1/K4 je **kód/dizajn**, K3 je **agent**.

- **K0 — Dátový model kvetov + funkčné jadro (KÓD).** Nový export v
  `content.ts` (kvety: `nazov`, `cena` číslo/ks, `farba`, `sezona`,
  `prilezitost`, výrez/obrázok). Nová stránka `konfigurator` (page + `base.ts`
  registrácia), mriežka kvetov s `+/−`, **živý súčet**, „hotová kytica" →
  predvyplnenie `kontakt-form` (`?typ=kytica`). Bez Kláry, bez videa —
  otestovateľné jadro. Prelink z `/obchod`.
- **K1 — Vizuál skladanej kytice (KÓD/DIZAJN).** PNG výrezy kvetov (priehľadné
  pozadie), vrstvenie do tvaru kytice + „stem-in" motion (`animate`/`emil`
  skilly, motion mantinely z `docs/sablony-kvalita.md`). Reduced-motion fallback.
- **K2 — Postava Klára: assety (KREATÍVA — Kling/Higgsfield, samostatné sedenie).**
  Character-sheet fotorealistickej floristky (jeden master portrét → konzistentné
  pózy/výrazy) + **3–4 krátke video slučky** (privítanie, počúva/premýšľa, viaže,
  hotovo) cez `image_to_video` z master portrétu (zaručí tú istú tvár). Uložiť do
  `templates/kvetinarstvo/images/`, atribúcia do `LICENSES.md`. Transparentne =
  AI asistentka (neklamať, že je reálna osoba).
- **K3 — Konverzačný mozog Kláry (AGENT).** Osobnosť floristky v `agent_config`;
  `/api/chat` vetva/nástroj, čo vedie tok (príležitosť/komu/farby/rozpočet →
  odporúčanie sezónnych kvetov z dátovej sady → prenos výberu do konfigurátora)
  a riadi prehrávanie póz/videí Kláry. Bezpečnosť: iba číta sadu kvetov a skladá
  návrh, nič nezapisuje mimo klientského stavu.
- **K4 — Finálny glamour shot (BONUS/KÓD).** Tlačidlo → jedna AI generácia
  fotorealistickej kytice z aktuálneho výberu (na počkanie, nie per-klik).
  Ošetriť latenciu/chybu/kredity; voliteľné, dá sa vynechať bez dopadu na jadro.

## Napojenie na existujúci kód (overené v tomto sedení)

- Ceny dnes **stringy** (`content.ts`: „od 32 €") → K0 zavádza **numerickú
  cenu/ks** v novom exporte (staré `cena: string` needitovať, len doplniť).
- `kontakt-form.tsx` **už má `?typ=` predvyplnenie** (useEffect) → K0 pridá do
  zoznamu typov `kytica` a odovzdá zhrnutie.
- `hero-video.tsx` **už rieši video prvok** → K2/K1 z neho vychádzajú (netreba
  nový prehrávač).
- Nová stránka = **page komponent + `base.ts` registrácia** (catch-all
  `app/ukazky/[odvetvie]/[[...page]]/page.tsx` — bez zásahu do routera).
- Stránka `atelier` už v šablóne existuje → prirodzené miesto na prelink.

## Mantinely (platia pre celý M7)

- **Demo pod `/ukazky`, `noindex`** — go-live/predaj sa nedotýkame (zamknuté).
- **Žiadne per-klik AI** — jediné AI za behu je voliteľný K4 glamour shot.
- **Minimalizmus (rebrík CLAUDE.md):** mozog = existujúci chatbot vzor; vizuál =
  naše motion skilly; jedna dátová sada kvetov poháňa filter aj odporúčanie aj
  vizuál; žiadna nová ťažká závislosť.
- **Kredity:** postava + videá + glamour shot sú jediné platené generácie —
  postava a videá **raz vopred** (K2), glamour shot na explicitné kliknutie.

## Štartové prompty pre realizačné sedenia (copy-paste; jeden krok = jedno sedenie)

**K0 — dátový model + funkčné jadro (KÓD):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(sekcia „Konfigurátor kytíc — Kvetinársky ateliér s Klárou", kroky K0–K4).
Realizačné sedenie (TYP: kód — nemiešaj s generovaním AI postavy): sprav KROK K0.
1) V frontend/templates/kvetinarstvo/content.ts pridaj NOVÝ export sady kvetov
   (nazov, cena ČÍSLO za 1 ks, farba, sezona, prilezitost, výrez/obrázok). Staré
   cena:string needituj. 2) Nová stránka „konfigurator": page komponent +
   registrácia v base.ts (catch-all route nechaj tak). Mriežka kvetov s +/−
   počtami, ŽIVÝ SÚČET ceny (klientský stav), „hotová kytica" → predvyplní
   kontakt-form cez ?typ=kytica (pridaj typ „kytica" do zoznamu) + zhrnutie.
   3) Prelink z /obchod (a /atelier). Zatiaľ BEZ Kláry a BEZ videa — funkčné
   jadro. noindex demo ostáva. Pred písaním Next.js kódu čítaj
   node_modules/next/dist/docs/ (frontend/AGENTS.md). Over lint + build.
   Vetva claude/... , commit + push; merge do main až po mojom súhlase.
```

**K1 — vizuál skladanej kytice (KÓD/DIZAJN, predpoklad K0 hotové):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(sekcia konfigurátora). Realizačné sedenie (TYP: kód/dizajn): sprav KROK K1 —
vizuál skladanej kytice. Z PNG výrezov kvetov (priehľadné pozadie) skladaj
kyticu vrstvením do tvaru + jemný „stem-in" motion (skilly animate/emil,
motion mantinely z docs/sablony-kvalita.md, reduced-motion fallback). Reaguje na
výber z K0 okamžite a deterministicky (žiadne AI per-klik).

PNG výrezy kvetov vygeneruj cez Kling (mcp Kling: text_to_image) — jeden výrez
na každý kvet zo sady konfiguratorKvety (content.ts), jednotný bočný pohľad na
stonku s kvetom, čisté jednofarebné/nekontrastné pozadie kvôli ľahkému
vyrezaniu → orež na priehľadné PNG a ulož do templates/kvetinarstvo/images/
(atribúcia/pôvod do images/LICENSES.md). Kling generuje obrázok s pozadím, takže
priehľadný PNG vznikne až orezom (odstránením pozadia — ak treba, použi Higgsfield
remove_background). Pár kreditových generácií RAZ vopred, nie per-klik. Ak by Kling
nebol dostupný, dočasne použi vektorový silueta fallback z placeholder.tsx, nech
je jadro funkčné.

Pred písaním Next.js kódu čítaj node_modules/next/dist/docs/. Over lint + build.
Vetva claude/... , commit + push; merge do main až po mojom súhlase.
```

> **Pozn. (K1 assety vs. typ sedenia):** generovanie výrezov je kreatíva, kód
> je kód (CLAUDE.md „1 sedenie = 1 typ"). Vyššie je verzia **(a)** — K1 si výrezy
> vygeneruje sám cez Kling. Čistejšia alternatíva **(b)**: K1 beží na siluetovom
> fallbacku (placeholder.tsx) a PNG výrezy sa spravia až v kreatívnom kroku
> (K2 s postavou Klára). Rozhodne majiteľ pri štarte K1.

**K2 — postava Klára: assety (KREATÍVA, samostatné sedenie):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(sekcia konfigurátora, rozhodnutia #1 a #2). Realizačné sedenie (TYP:
kreatíva/generovanie assetov — NEMIEŠAJ s kódom): vygeneruj postavu Kláry.
1) Fotorealistická floristka — JEDEN master portrét (konzistentná tvár), z neho
   character-sheet sada póz/výrazov (počúva, premýšľa, usmieva sa). 2) 3–4 KRÁTKE
   video slučky (privítanie, počúva/premýšľa, viaže kyticu, hotovo) cez
   image_to_video z master portrétu, nech je tvár rovnaká. Realistické, teplé
   svetlo ateliéru, bez uncanny efektu. 3) Ulož do
   frontend/templates/kvetinarstvo/images/ (rozumné rozmery/formáty pre web),
   atribúcia do images/LICENSES.md; transparentne = AI asistentka. Žiadny app
   kód. Vetva claude/... , commit + push; merge do main až po mojom súhlase.
   Nástroje (Kling/Higgsfield) sú platené — pred generovaním mi zhrň plán záberov.
```

**K3 — konverzačný mozog Kláry (AGENT, predpoklad K0 + K2 hotové):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(sekcia konfigurátora + docs/rag-chatbot.md). Realizačné sedenie (TYP: agent):
sprav KROK K3 — mozog Kláry. Osobnosť floristky do agent_config; rozšír /api/chat
(alebo nástroj) o tok: príležitosť/komu/farby/rozpočet → odporuč sezónne kvety
z dátovej sady K0 → prenes výber do konfigurátora; riaď prehrávanie póz/videí
Kláry z K2. Bezpečnosť: iba čítať sadu kvetov a skladať návrh, nič nezapisovať
mimo klientského stavu. Pred písaním Next.js kódu čítaj node_modules/next/dist/docs/.
Over lint + build. Vetva claude/... , commit + push; merge do main a zmeny v
Directus (agent_config) až po mojom súhlase. Klik-časti mi vypíš ako návod.
```

**K4 — finálny glamour shot (BONUS/KÓD, predpoklad K0–K1 hotové):**
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md
(sekcia konfigurátora, rozhodnutie #5 tok bod). Realizačné sedenie (TYP: kód):
sprav KROK K4 — voliteľný finálny glamour shot. Tlačidlo „Ukážte mi ju naozaj"
→ JEDNA AI generácia fotorealistickej kytice z aktuálneho výberu (na počkanie,
NIE per-klik). Ošetri latenciu, chybu aj náklady (kredity); funkcia je voliteľná,
jadro K0–K1 musí fungovať aj bez nej. Pred písaním Next.js kódu čítaj
node_modules/next/dist/docs/. Over lint + build. Vetva claude/... , commit +
push; merge do main a zmeny v Railway (API kľúč) až po mojom súhlase.
```

## Vylepšenie frontend agentov — externé skilly (vkus + motion)

> Aug 2026. Cieľ: zdvihnúť „vkusovú" úroveň frontendu k „nerozoznateľné od AI".

**Adoptované (hotové, MIT):** z `github.com/emilkowalski/skills` sme prevzali tri
skilly do `.claude/skills/` a napojili ich:
- `emil-design-eng` (filozofia vkusu / polish / detaily),
- `animate` (+ `RECIPES.md`) — stavba motion správne,
- `review-animations` (+ `STANDARDS.md`) — kritika motion podľa latky.
Napojenie: `frontend-dev` (stavba/motion), `qa-a11y` + `docs/sablony-kvalita.md`
(revízia). Atribúcia a zoznam v `.claude/skills/VENDORED.md`.

**Backlog — pridať rovnako, keď bude treba (kópia priečinka do `.claude/skills/`):**
- Ďalšie Emilove skilly: `apple-design`, `pick-ui-library`,
  `find-animation-opportunities`, `improve-animations`, `animation-vocabulary`,
  `prototype`.
- **`ui-ux-pro-max-skill`** (`github.com/nextlevelbuilder/ui-ux-pro-max-skill`, MIT) —
  veľká knižnica dizajn systémov (84 štýlov, 192 paliet, 161 pravidiel, font páry,
  tech stacky). Vhodné pre **`ui-ux-designer` pri rozbiehaní NOVEJ odvetvovej šablóny**,
  nie do každého sedenia (veľký kontext → načítať výberovo).

## Štartový prompt pre PRVÉ realizačné sedenie (M1)

```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.

Realizačné sedenie: sprav MÍĽNIK M1 z časti „Frontend agent — knižnica
odvetvových šablón" v plan-agenti.md (ZÁKLAD knižnice, ešte bez hotovej šablóny).

Konkrétne:
1) Vytvor .claude/agents/ so štyrmi build sub-agentmi (frontend-dev,
   ui-ux-designer, qa-a11y, sk-copywriter) — krátke, ostré .md definície
   adaptované do nášho kontextu (Next.js 16 / Tailwind v4, slovenčina,
   minimalizmus z CLAUDE.md, prístupnosť). Inšpirácia github.com/msitarzewski/
   agency-agents, ale adaptuj, nekopíruj slepo.
2) Zaveď konvenciu prenosného balíka frontend/templates/<odvetvie>/ (theme.css so
   scoped Tailwind v4 @theme tokenmi s prefixom, content.ts, sections/, images/ +
   LICENSES.md, page/layout) a route group app/ukazky/ (index page.tsx + [odvetvie]
   mount) s povinným robots: noindex (demo obsah nesmie do Googla). Zatiaľ len
   kostra + placeholder, žiadny fiktívny obsah.
3) Napíš docs/sablony-kvalita.md — kvalitná brána: checklist (Lighthouse ≥95,
   a11y/WCAG AA, responzivita, čistý kód, žiadne lorem/TODO), zoznam zakázaných
   generických AI fráz, postup povinnej ľudskej revízie + šablóna RETROSPEKTÍVY
   (učiaca sa slučka: ponaučenia po každej šablóne sa zapisujú späť do definícií
   agentov a do tohto dokumentu). Motion pravidlá podľa sekcie „Vlajková šablóna".
   Sub-agentom daj do definícií pokyn čítať tento dokument na štarte práce a
   modely podľa rozhodnutia #5 (Fable/Opus dizajn+dev, Sonnet copy+QA).
4) Založ kostru .claude/skills/site-customizer/ (zatiaľ runbook, bez behu).

Pred písaním Next.js kódu čítaj node_modules/next/dist/docs/ (frontend/AGENTS.md).
Over npm run lint + npm run build (prázdny route group nech prejde). Nič nedeployuj.
Vetva claude/... , commit + push; merge do main a zmeny v Railway/Directus až po
mojom súhlase. Klik-časti (ak nejaké) mi vypíš ako návod.
```

