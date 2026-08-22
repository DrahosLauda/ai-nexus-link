# Archív plánov — odbyté zadania a štartovacie prompty

> **Toto je história, nie plán.** Sú tu bloky, ktoré boli hotové alebo nahradené
> a zaberali miesto v `docs/plan-agenti.md`. **Nič sa nezmazalo** — len sa to
> stiahlo z cesty, aby `plan-agenti.md` hovoril len to, čo naozaj ideme robiť.
>
> Presunuté 22.8.2026 na plánovacej porade. Ak niečo z toho znova potrebuješ,
> je to tu celé v pôvodnom znení.
>
> **Kde je čo živé:** otvorené úlohy a poradie → `docs/backlog.md` ·
> štartovacie prompty na najbližšie sedenia → `docs/plan-agenti.md` (hore) ·
> história a rozhodnutia → `docs/dennik.md`.

---

## 📦 go-live prompt + Task č.1 (SessionStart hook)

> **Prečo je v archíve:** Go-live technicky prebehol; zvyšok Pred-Google checklistu žije v `docs/backlog.md`. SessionStart hook je hotový a zlúčený (PR #52), jeho kód je v `.claude/hooks/session-start.sh`.
>
> *(Pôvodne riadky 262–403 v `plan-agenti.md`.)*

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


---

## 📦 ZADANIE — Frontend agent = knižnica odvetvových šablón

> **Prečo je v archíve:** To plánovacie sedenie prebehlo; jeho VÝSTUP ostáva v `plan-agenti.md` hneď za týmto blokom.
>
> *(Pôvodne riadky 743–819 v `plan-agenti.md`.)*

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


---

## 📦 Štartový prompt pre realizačné sedenie E1

> **Prečo je v archíve:** E1 (katalóg kytíc zo súboru) je hotové a naživo.
>
> *(Pôvodne riadky 1578–1649 v `plan-agenti.md`.)*

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


---

## 📦 Štartové prompty P, A, C, C-dobeh

> **Prečo je v archíve:** P = veľká porada (odbytá 22.8.2026). A = chatbot vie o šablónach (PR #72). C = výstup a štýl odpovedí (PR #76). C-dobeh = klikateľné odkazy (PR #78). Všetko hotové a overené naživo. **Prompt B (AI poradca v katalógu) NIE je tu — ostáva v `plan-agenti.md`**, backlog sa naň odvoláva.
>
> *(Pôvodne riadky 1652–1941 v `plan-agenti.md`.)*

### P — Veľká plánovacia porada (PORADA/PLÁN; pripravené 19.8.2026)

> **Na čo to je:** backlog narástol do šírky (chatbot, rezervačný agent,
> kvetinárstvo/M7, obsah, frontend drobnosti, workflow, veľké iniciatívy) a chýba
> **poradie**. Toto sedenie nič nekóduje — rozhoduje sa v ňom, čo ide ďalej a
> prečo. Výstup: zoradený plán + štartovacie prompty pre najbližšie sedenia.
> Zoznam nižšie je **úplný prehľad otvorených vecí k 19.8.2026** — je to podklad
> na diskusiu, nie zoznam na odsúhlasenie naraz.

```
Najprv si prečítaj docs/dennik.md (najnovšie záznamy navrchu + celý Backlog),
docs/vizia.md (kam to smeruje, §8–§11) a docs/plan-agenti.md. Rešpektuj CLAUDE.md
pravidlá spolupráce (go-live a predaj ZAMKNUTÉ; 1 sedenie = 1 typ; do main len cez
vetvu + PR, merge až na môj výslovný súhlas; na konci zápis do docs/dennik.md).

TYP SEDENIA: PORADA / PLÁN. Dnes sa NEKÓDUJE a nič sa nenasadzuje — jediné zmeny
v repe sú v docs/ (denník, backlog, štartovacie prompty). Ak sa rozbehne kódovanie,
zastav ma a navrhni samostatné sedenie.

CIEĽ: prejsť VŠETKY otvorené veci, zoradiť ich podľa hodnoty a závislostí a
rozhodnúť, čo ide v najbližších sedeniach. Chcem toho prediskutovať viac — pýtaj
sa, oponuj, navrhuj poradie. Nechcem zoznam, chcem rozhodnutia.

AKO CHCEM, ABY SI VIEDOL PORADU:
- Ku každej oblasti mi daj krátke zhrnutie (čo to je, prečo to má/nemá zmysel
  teraz, veľkosť sedenia, na čom to stojí) a SVOJE odporúčanie — nie neutrálny
  výpis možností.
- Kde sú závislosti (A sa nedá bez B), povedz to rovno.
- Kde si myslíš, že niečo je YAGNI alebo predčasné, povedz to rovno.
- Rozdeľ veci na: (1) NUTNÉ pred prvým klientom, (2) zvyšuje hodnotu ukážky,
  (3) údržba/technický dlh, (4) môže počkať.

OTVORENÉ OBLASTI (stav k 19.8.2026 — over si ich v Backlogu, môžu byť posunuté):

A) CHATBOT (RAG)
   - Krok 5 — nastavenia (system prompt, model, počet kúskov k) z kódu do Directusu
     `agent_config`, logy chatov do `agent_logs`, vlastný token s minimálnymi
     právami. Podmienka predajnosti; mantinel = hodnoty v kóde ostanú ako fallback.
   - Kvalita obsahu, z ktorého čerpá — revízia starších článkov (viac o NAŠICH
     riešeniach, menej odkazov na cudzie nástroje).
   - Hlas (fáza 2) — browser Web Speech vs platený TTS (docs/rag-chatbot.md §9).
   - Optimalizácia — frontend na vnútornú DB adresu; instantné doindexovanie cez
     WP webhook (dnes 3×/týždeň v pipeline).
   - HOTOVÉ 18. – 19.8.: výstup/štýl odpovedí + klikateľné odkazy (PR #76 – #79).

B) REZERVAČNÝ AGENT (R1 beží naživo)
   - Rozšíriť `booking_services` na 2–3 reálne konzultačné typy (klik v Directuse).
   - R2 — chatbot rezervuje v konverzácii (Gemini function calling nad
     lib/booking.ts). Robiť až po rozšírení služieb.
   - Zrušovací link v potvrdzovacom e-maile.
   - R3 pripomienky (cron deň vopred) · R4 replikácia u klienta.

C) KVETINÁRSTVO / M7 (demo šablóna Boma Flora)
   - AI poradca v katalógu kytíc — hotový prompt B nižšie; prevaha č. 1.
   - Smer V4 do sekcie Služby na Domove — dizajnové sedenie, data-driven.
   - Fotky pre 3 kytice bez obrázka (čaká na majiteľa alebo kreatívne sedenie).
   - E2 — WooCommerce ako zdroj katalógu (potrebuje samostatnú WP+Woo inštanciu).
   - E3 — produkt agent (stojí na E2).
   - Domerať Lighthouse na deployi (cieľ ≥ 95, prístupnosť 100).

D) OBSAH A ORCHESTRÁTOR
   - Rôznorodejšie úvody článkov (Writer opakuje ten istý vzorec).
   - Jednoduchšie obrázky · konzistentné alt texty.
   - Obsahová stratégia blogu = predávať NAŠE krabicové riešenia, nie cudzie nástroje.

E) FRONTEND — otvorené drobnosti
   - Responzivita na mobile (doladiť detaily po prehliadke).
   - Interné odkazy v tele článkov po migrácii ukazujú na `wp.` → prelinkovať na /blog/…
   - Podstránky služieb /sluzby/[slug] · predajné podstránky pre chatbota a
     rezervácie · fotka tímu · reálny telefón v pätičke.

F) BEZPEČNOSŤ A TECHNICKÝ DLH
   - Vlastná obmedzená rola pre orchestrátor token (teraz admin) — least privilege.
   - Frontend číta RAG databázu priamo (patrí ku Kroku 5).

G) NÁŠ WORKFLOW (shortlist z gstacku, cesta B — vlastné odľahčené skilly)
   - „plan-review pred kódom" · „retro/reflect" (zápis ponaučení).

H) VEĽKÉ INICIATÍVY (vizia.md §8–§11)
   - Krabicové riešenia ako produktová línia: rezervácie (✅ demo), chatbot
     (✅ demo), dohadovanie schôdzok, zápis poznámok zo stretnutí, e-mail
     auto-odpoveď, mockup/náhľad agent.
   - Woo služby napárované na agentov · Fáza 5 produktizácia (šablóna + napojenie
     pre ďalších klientov).

I) PRED-GOOGLE CHECKLIST — POZOR, spustenie je ZAMKNUTÉ
   - Cookie lišta + zásady ochrany osobných údajov (GDPR, web zbiera leady),
     doladenie dizajnu, potom SITE_INDEXABLE=true + Search Console.
   - O tomto sa dnes iba BAVÍME (čo to obnáša, v akom poradí). Spustenie
     nenavrhuj a nesmeruj k nemu — ide len na môj výslovný pokyn.

OTÁZKY, NA KTORÉ CHCEM ODÍSŤ S ODPOVEĎOU:
1. Čo je najbližších 3–5 sedení a v akom poradí (a prečo práve tak)?
2. Čo z toho je NUTNÉ pred prvým platiacim klientom a čo je zbytočný luxus?
3. Kde máme technický dlh, ktorý sa zaplatením neskôr predraží?
4. Ktoré veci sa dajú spojiť do jedného sedenia bez porušenia „1 sedenie = 1 typ",
   a ktoré musia ostať samostatné?
5. Čo v backlogu je už mŕtve/prekonané a má sa zmazať?

NA KONCI SEDENIA (povinné):
- zápis do docs/dennik.md — rozhodnutia, poradie, zdôvodnenie (nie prepis diskusie);
- prepísať Backlog tak, aby z neho bolo vidieť POradie, nielen zoznam;
- do docs/plan-agenti.md napísať štartovacie prompty pre 2–3 najbližšie sedenia,
  ktoré sme si odsúhlasili (konkrétne miesta v kóde, mantinely, kontrolné otázky);
- zmeny v docs/ na vetvu claude/... + PR; merge až po mojom „áno".
```



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


---

## 📦 PLÁN — Konfigurátor kytíc „Kvetinársky ateliér s Klárou"

> **Prečo je v archíve:** Sám sa označoval „⛔ NAHRADENÝ vyššie". Nahradil ho prepracovaný plán M7 (Kvetinový e-shop na kľúč), ktorý ostáva v `plan-agenti.md`. Ponechané ako ponaučenie — ukazuje, prečo sa od konfigurátora upustilo.
>
> *(Pôvodne riadky 1982–2202 v `plan-agenti.md`.)*

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


---

## 📦 Štartový prompt pre PRVÉ realizačné sedenie (M1)

> **Prečo je v archíve:** M1 (základ knižnice šablón) je hotový; M2 (vlajková šablóna kvetinárstvo) je naživo na `/ukazky/kvetinarstvo`.
>
> *(Pôvodne riadky 2224–2257 v `plan-agenti.md`.)*

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


