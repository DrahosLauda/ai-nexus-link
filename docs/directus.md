# Directus — ťahák pre náš projekt

> Directus = „systémový mozog" (systémové dáta na Railway). CRM leady + ovládací
> panel a denník agentov. **Nikdy obsah webu** (ten je vo WordPresse).
> ⚠️ Živý Directus z cloud sedenia nevidno (sieť ho blokuje) — preto stav
> configu zapisujeme aj do `dennik.md`.

## Naše kolekcie (Content → …)

| Kolekcia | Čo drží | Polia (hlavné) | Kto zapisuje |
|---|---|---|---|
| **`client_leads`** | Leady z formulárov | `name, email, phone, message, source, date_created` | `frontend-bot` (len create) |
| **`agent_config`** | Ovládací panel agentov | `agent_name, is_active, text_provider, text_model, system_prompt` (+ `topics, post_status` pre Writera) | ručne (človek) |
| **`agent_logs`** | Denník behov agentov | `agent_name, status, topic, message, wp_post_id, date_created` | `orchestrator-bot` (len create) |
| **`booking_resources`** | Zdroje s kapacitou (zubár/kreslo/maklér…) | `name, is_active, sort` | ručne (klient v admine) |
| **`booking_services`** | Čo sa rezervuje | `name, duration_min, buffer_min, slot_step_min, description, is_active, resource` (M2O) | ručne (klient v admine) |
| **`booking_availability`** | Otváracie hodiny (zdroj × deň) | `resource` (M2O), `weekday` (0–6), `start_time, end_time` | ručne (klient v admine) |
| **`booking_blackouts`** | Blokované termíny (dovolenka/sviatok/obed) | `resource` (M2O, nullable), `start, end, reason` | ručne (klient v admine) |
| **`bookings`** | Samotné rezervácie | `service, resource` (M2O), `start, end, customer_name, customer_email, customer_phone, note, status, source, lead` (M2O `client_leads`), `created_at` | `reservation-bot` (read+create) |

Riadky v `agent_config`: **`wp_writer`** (Writer) a **`seo_geo`** (SEO+GEO agent).
`agent_name` rozlišuje agentov — jeden riadok = jeden agent.

## Rezervačné kolekcie (`booking_*`) — dátový model

Odvetvovo neutrálny „krabicový" model pre rezervácie. Tri univerzálne pojmy —
**zdroj × služba × dostupnosť** — z ktorých engine (`frontend/lib/booking.ts`)
počíta voľné sloty. Referenčná SQL vrátane **exclusion constraintu** proti
prekryvu: `orchestrator/booking_schema.sql`.

- **Časy v UTC** (`timestamptz`), zobrazenie Europe/Bratislava. Nikdy „naivný" lokálny čas.
- **`bookings.lead`** prepája rezerváciu na CRM `client_leads` (rovnaké leady ako z formulárov).
- **Dvojitú rezerváciu blokuje DB** (Postgres exclusion constraint na `bookings` —
  `resource` + prekryv `tstzrange(start,end)` pre `status = 'confirmed'`), nie iba appka.

### Klik-návod: založiť rezervačné kolekcie (po súhlase)

Settings → Data Model → **Create Collection** pre každú kolekciu. Poradie kvôli
M2O väzbám: najprv `booking_resources`, potom zvyšok.

1. **`booking_resources`** — polia `name` (String, required), `is_active`
   (Boolean, default `true`), `sort` (Integer, voliteľné).
2. **`booking_services`** — `name` (String, required), `duration_min` (Integer,
   required), `buffer_min` (Integer, default `0`), `slot_step_min` (Integer,
   nullable — prázdne = použije sa `duration_min`), `description` (Text),
   `is_active` (Boolean, default `true`), `resource` (**Many-to-One** →
   `booking_resources`, nullable = ktorýkoľvek zdroj).
3. **`booking_availability`** — `resource` (M2O → `booking_resources`, required),
   `weekday` (Integer, 0–6; 0 = nedeľa), `start_time` (Time), `end_time` (Time).
4. **`booking_blackouts`** — `resource` (M2O → `booking_resources`, nullable =
   platí pre všetkých), `start` (Timestamp), `end` (Timestamp), `reason` (String).
5. **`bookings`** — `service` (M2O → `booking_services`), `resource` (M2O →
   `booking_resources`, required), `start` (Timestamp), `end` (Timestamp),
   `customer_name` (String, required), `customer_email` (String, required),
   `customer_phone` (String), `note` (Text), `status` (String, default
   `confirmed` — hodnoty `confirmed`/`cancelled`), `source` (String, default
   `web-widget` — hodnoty `web-widget`/`chatbot`), `lead` (M2O →
   `client_leads`), `created_at` (Timestamp, default „Save (Create)").

Potom **spustiť SQL** (exclusion constraint sa cez UI nedá): Railway → Postgres →
Console → `psql "$DATABASE_URL"` → vlož `orchestrator/booking_schema.sql`
(idempotentné; `CREATE TABLE IF NOT EXISTS` nič neprepíše, doplní len constraint).

### Seed dáta pre naše demo (po založení kolekcií)

Content → jednotlivé kolekcie → **Create Item**:

- 1–2 **zdroje** (napr. „Poradca 1"), `is_active` ✅.
- zopár **služieb** (napr. „Konzultácia 30 min" `duration_min = 30`).
- **dostupnosť**: Po–Pia (weekday 1–5) `09:00–17:00` pre daný zdroj (5 riadkov).
- **blackouty** podľa potreby (dovolenka/sviatok) — voliteľné.

## Navigácia

- Vľavo je zvislý panel modulov. **Content** (ikonka dát) = prezeranie/úprava
  položiek v kolekciách. **User Directory** = používatelia a ich tokeny.
  **Settings** (ozubené koliesko, dole) = kolekcie, role, politiky.
- Content → klikni na kolekciu (napr. **Agent Logs**) → tabuľka položiek.

## Bežné úkony (klik po kliku)

**Nájsť / otvoriť položku:**
1. Content → kolekcia → klikni na riadok → otvorí sa detail (drawer).

**Triediť tabuľku:**
- Klikni na **hlavičku stĺpca** (napr. dátumu) → prepína vzostupne/zostupne.
- ⚠️ Výber triedenia sa **neukladá** (po odchode zmizne) — je to len dočasný pohľad.
- Ak stĺpec nevidíš, pridaj ho cez nastavenia zobrazenia (ikonky nad tabuľkou),
  alebo položku jednoducho **nájdi očami / cez vyhľadávanie** (lupa hore).

**Vytvoriť položku (napr. nový agent):**
1. Content → **Agent Config** → vpravo hore **Create Item** (+).
2. Vyplň polia (napr. `agent_name = seo_geo`, `is_active` ✅,
   `text_provider = gemini`, `text_model = gemini-3.5-flash`).
3. Vpravo hore **Save** (✓).

**Upraviť položku (napr. predajný `system_prompt` Writera):**
1. Content → **Agent Config** → klikni riadok `wp_writer`.
2. Uprav pole `system_prompt` → **Save**.

## Tokeny a role (zásada least privilege)

Každý systém má **vlastný token s minimálnymi právami** — bez toho sa platforma
nedá bezpečne replikovať.

| Používateľ | Smie | Token je v |
|---|---|---|
| `frontend-bot` | len **create** `client_leads` | Railway (frontend) `DIRECTUS_TOKEN` |
| `orchestrator-bot` | **read** `agent_config` + **create** `agent_logs` | Railway (orchestrátor) + `orchestrator/.env` `DIRECTUS_TOKEN` |
| `reservation-bot` | **read** `booking_services`/`booking_resources`/`booking_availability`/`booking_blackouts`, **read+create+update** `bookings`, **create** `client_leads` | Railway (frontend) `RESERVATION_TOKEN` |

**Klik-návod: politika, rola a token `reservation-bot` (po súhlase)** — rovnaký
vzor ako `frontend-bot`/`orchestrator-bot`, zásada least privilege:

1. **Settings → Access Policies → Create Policy** „Rezervácie — booking + leady":
   - `booking_resources`, `booking_services`, `booking_availability`,
     `booking_blackouts` → **Read** (číta katalóg a dostupnosť).
   - `bookings` → **Read + Create + Update** (update len na zrušenie:
     `status = cancelled`; ideálne obmedziť Field Permissions na `status`).
   - `client_leads` → **Create** (rezervácia založí lead; rovnako ako `frontend-bot`).
   - Nič iné (žiadny `agent_config`, `agent_logs`, WP, ani obsah).
2. **Settings → Roles → Create Role** „Rezervácie" → priraď politiku z bodu 1.
3. **User Directory → Create User** `reservation-bot` → rola „Rezervácie" →
   **Generate Token** → **Save**. Token sa ukáže **iba raz** → skopíruj do
   Railway (frontend) `RESERVATION_TOKEN`.

**Vygenerovať/rotovať statický token používateľa:**
1. **User Directory** → klikni používateľa.
2. Pole **Token** → **Generate Token** → **Save**.
3. Token sa ukáže **iba raz** — hneď ho skopíruj do príslušnej env premennej
   (Railway Variables / `.env`) a ulož.

Práva sa nastavujú v **Settings → Access Policies / Roles** (politika hovorí,
čo rola smie na ktorej kolekcii).

## REST API (pre agentov a skripty)

- **`DIRECTUS_URL` = len základná adresa**, bez `/admin/...` a bez lomky na konci.
- Autorizácia hlavičkou: `Authorization: Bearer <TOKEN>`.
- Čítať config: `GET {DIRECTUS_URL}/items/agent_config?filter[agent_name][_eq]=seo_geo`
- Zapísať log: `POST {DIRECTUS_URL}/items/agent_logs` (JSON telo).
- V kóde to robí `orchestrator/directus.py` (`nacitaj_config`, `zapis_log`).

## Ponaučenia (z denníka)

1. **`DIRECTUS_URL` len základ adresy** — kedysi tam bola celá prihlasovacia
   stránka (`…/admin/login?…`), zápisy „mizli". *Overuj zápis pohľadom do dát,
   nie odpoveďou API.*
2. **Pole s „Required" sa nedá nechať prázdne** — napr. `text_model` vždy vyplň
   konkrétnym modelom pre daného poskytovateľa.
3. **`FORBIDDEN` v admine** často znamená **vypršané prihlásenie** (nie chýbajúce
   právo) — najprv sa odhlás/prihlás, potom debuguj.
