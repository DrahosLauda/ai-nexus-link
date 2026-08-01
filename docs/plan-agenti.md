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

## Štartový prompt pre REALIZAČNÉ sedenie (Krok R0 — copy-paste)
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

## Štartový prompt pre PLÁNOVACIE sedenie (pôvodný — na ďalšie ciele)
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Toto je PLÁNOVACIE sedenie (šetríme tokeny): nič nekóduj, len sa ma pýtaj na
otvorené rozhodnutia z plan-agenti.md a výsledok — podrobný plán po krokoch —
zapíš do docs/plan-agenti.md. Commit + push do vetvy môžeš, merge do main
a zmeny v Railway/DB až po mojom súhlase.
```
