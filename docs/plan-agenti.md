# Plán: ďalší agenti (rezervácie + e-mail + leady)

> Zoznam cieľov a **rozhodnutí** pre nasledujúce sedenia. Podrobný plán
> rezervačného agenta je nižšie (výstup plánovacieho sedenia, aug 2026).

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
| 2 | **Kde beží customizačný agent** | **Claude Code sedenie + skill** *(odporúčaný default — jediné otvorené na potvrdenie)* | Customizácia = editácia kódu/obsahu → doména Claude Code, nie headless cron. Config/log riadok `site_builder` v Directuse pre stopu (lego vzor). |
| 3 | **Prvé odvetvie (MVP)** | **Kvetinárstvo** | Vizuálne vďačné (galéria, sezónne ponuky, o nás, cenník, kontakt) + jasný **rezervačný/objednávkový** modul → priamo ukáže napojenie na `lib/booking.ts`. |
| 4 | **Build sub-agenti** | **Všetci štyria** (frontend dev, UI/UX dizajnér, QA/a11y, SK copywriter) | Adaptované (nie slepo skopírované) z `agency-agents` do `.claude/agents/`. |
| 5 | **Model na texty/dizajn** | **Claude** (default, prepínateľné cez `agent_config.site_builder`) | Kvalita je priorita; lacnejší model (Gemini) voliteľne pre hromadné texty. |

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

### M1 — Základ knižnice (infra, bez hotovej šablóny)

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

### M5 — Replikácia: druhé odvetvie (autoservis alebo zubár)

**Cieľ:** dôkaz, že proces je replikovateľný (nie jednorazovka).

- Tým istým workflowom (sub-agenti → brána → revízia) postaviť druhú šablónu.
- Cieľ: druhá šablóna za **výrazne kratší čas** vďaka zavedenej konvencii/bráne.

### M6 — Produktizácia / lift-to-client (väzba na Fázu 5)

**Cieľ:** zdokumentovaný postup nasadenia šablóny reálnemu klientovi.

- Runbook: skopíruj `templates/<x>/` + `lib/*` do čistého deployu, napoj Directus
  (booking/leady/chatbot), branding, doména. Návrh cesty k **multi-tenant**
  (`tenant_id`, izolácia) ako plán, nie realizácia.

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

## Otvorené drobnosti (doriešiť pri realizácii)

- **Potvrdiť motion technológiu a intenzitu** — default „Framer Motion +
  natívne CSS, prémiovo jemná intenzita" (GSAP len na 1–2 set-piecy podľa potreby).
- **Potvrdiť beh customizačného agenta** — default „Claude Code sedenie + skill"
  (rozhodnutie #2 vyššie ostalo neoznačené; ak chceš orchestrátor/hybrid, povedz).
- Konkrétny zoznam sekcií/stránok kvetinárskej šablóny (rozvrhne `ui-ux-designer`
  v M2, majiteľ odsúhlasí).
- Zdroj obrázkov na finále (stock vs generované) — rozhodnúť v M2 podľa vzhľadu.
- Či demo šablóny dostanú vlastnú (fiktívnu) doménu na plné „naostro" demo, alebo
  ostanú len na `/ukazky` (`noindex`). Default: `/ukazky`.

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
   generických AI fráz, postup povinnej ľudskej revízie.
4) Založ kostru .claude/skills/site-customizer/ (zatiaľ runbook, bez behu).

Pred písaním Next.js kódu čítaj node_modules/next/dist/docs/ (frontend/AGENTS.md).
Over npm run lint + npm run build (prázdny route group nech prejde). Nič nedeployuj.
Vetva claude/... , commit + push; merge do main a zmeny v Railway/Directus až po
mojom súhlase. Klik-časti (ak nejaké) mi vypíš ako návod.
```

