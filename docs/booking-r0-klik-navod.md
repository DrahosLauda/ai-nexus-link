# Rezervačný agent R0 — klik-návod (krok po kroku)

> Jednoduchý návod na „klik-časť" kroku R0: založiť rezervačné kolekcie
> v Directuse, spustiť SQL v Railway Postgrese, vytvoriť token `reservation-bot`
> a naseedovať demo dáta. Referenčná schéma: `orchestrator/booking_schema.sql`.
> Podrobnosti aj v `docs/directus.md`.

**⚠️ Dôležité — presné názvy polí:** názvy polí (Key) píš **presne** ako sú nižšie
(`start`, `end`, `resource`, `status`, `duration_min`…). SQL constraint proti
dvojitej rezervácii sa na tie názvy spolieha — preklep = nebude fungovať.

**Poradie sa musí dodržať:** najprv `booking_resources` (ostatné sa naň
odkazujú), potom zvyšok.

---

## ČASŤ A — Založiť 5 kolekcií v Directuse

Prihlás sa do Directusu → vľavo dole **Settings** (ozubené koliesko) →
**Data Model**.

### Ako založiť kolekciu (spoločný postup)
1. Vpravo hore **Create Collection** (+).
2. **Name** = presný názov kolekcie (napr. `booking_resources`).
3. **Primary Key Field** nechaj **„Auto-Incremented Integer"** (predvolené).
4. Ďalšia obrazovka „Optional System Fields" — netreba nič zapínať → **Finish Setup** (✓).
5. Kolekcia je založená. Teraz do nej pridáš polia (nižšie).

### Ako pridať pole do kolekcie (spoločný postup)
1. V Data Model klikni na kolekciu → **Create Field**.
2. Vyber **typ poľa** (podľa tabuliek nižšie).
3. Zadaj **Key** (názov poľa) — presne podľa návodu.
4. Ak treba **default** alebo **required**, nastav v záložke poľa (pozri poznámky).
5. **Save** (✓). Opakuj pre každé pole.

---

### 1) `booking_resources` — zdroje (kto/čo má kapacitu)

| Key | Typ (Directus) | Nastavenie |
|---|---|---|
| `name` | String (Input) | Required ✅ |
| `is_active` | Boolean (Toggle) | Default = **On** (true) |
| `sort` | Integer | — (voliteľné poradie) |

*(`id` a prípadné dátumy vytvára Directus sám — netreba riešiť.)*

---

### 2) `booking_services` — služby (čo sa rezervuje)

| Key | Typ | Nastavenie |
|---|---|---|
| `name` | String | Required ✅ |
| `duration_min` | Integer | Required ✅ (dĺžka služby v minútach, napr. 30) |
| `buffer_min` | Integer | Default = **0** (rezerva po službe) |
| `slot_step_min` | Integer | nechaj prázdne = použije sa `duration_min` |
| `description` | Text | — |
| `is_active` | Boolean | Default = **On** |
| `resource` | **Many to One** → `booking_resources` | nepovinné (prázdne = ktorýkoľvek zdroj) |

**Ako spraviť `resource` (M2O):** Create Field → vľavo vyber **Many to One** →
Key = `resource` → **Related Collection = `booking_resources`** → Save.

---

### 3) `booking_availability` — otváracie hodiny (zdroj × deň)

| Key | Typ | Nastavenie |
|---|---|---|
| `resource` | **Many to One** → `booking_resources` | Required ✅ |
| `weekday` | Integer | Required ✅ (0 = nedeľa, 1 = pondelok … 6 = sobota) |
| `start_time` | **Time** | začiatok (napr. 09:00) |
| `end_time` | **Time** | koniec (napr. 17:00) |

*(Time = typ „DateTime" s režimom **Time**, alebo priamo interface „Time".)*

---

### 4) `booking_blackouts` — výnimky (dovolenka, sviatok, obed)

| Key | Typ | Nastavenie |
|---|---|---|
| `resource` | **Many to One** → `booking_resources` | nepovinné (prázdne = platí pre všetkých) |
| `start` | **Timestamp** (DateTime) | začiatok bloku |
| `end` | **Timestamp** (DateTime) | koniec bloku |
| `reason` | String | dôvod (napr. „dovolenka") |

---

### 5) `bookings` — samotné rezervácie

| Key | Typ | Nastavenie |
|---|---|---|
| `service` | **Many to One** → `booking_services` | — |
| `resource` | **Many to One** → `booking_resources` | Required ✅ |
| `start` | **Timestamp** (DateTime) | Required ✅ |
| `end` | **Timestamp** (DateTime) | Required ✅ |
| `customer_name` | String | Required ✅ |
| `customer_email` | String | Required ✅ |
| `customer_phone` | String | — |
| `note` | Text | — |
| `status` | String | Default = **`confirmed`** (hodnoty: `confirmed` / `cancelled`) |
| `source` | String | Default = **`web-widget`** (hodnoty: `web-widget` / `chatbot`) |
| `lead` | **Many to One** → `client_leads` | — (prepojenie na CRM) |

*(`created_at` netreba — vytvorí ho Directus, alebo doplní SQL. Ak chceš, môžeš
pridať pole „Created On" cez Optional System Fields.)*

---

## ČASŤ B — Spustiť SQL v Railway Postgrese (poistka proti dvojitej rezervácii)

Toto **pridá zámok**, ktorý cez Directus UI spraviť nejde. Tabuľky už existujú
(založil ich Directus v Časti A), takže SQL ich len **preskočí** a dopíše zámok.

1. Railway → projekt s databázou → služba **Postgres** (tá istá, kde beží Directus).
2. Otvor **Console** (alebo Query / Data → Connect → `psql`).
3. Skopíruj **celý obsah** súboru `orchestrator/booking_schema.sql` a vlož ho.
4. Malo by prebehnúť bez chyby. Uvidíš pár hlášok `NOTICE: … already exists,
   skipping` — **to je v poriadku** (tabuľky spravil Directus, SQL ich preskočil).
   Dôležité je, že prejde riadok `ALTER TABLE bookings ADD CONSTRAINT
   bookings_no_overlap …`.

**Kontrola (nepovinné):** v Console spusti
`\d bookings` — v zozname má byť constraint `bookings_no_overlap`.

---

## ČASŤ C — Token `reservation-bot` (least privilege)

Aby frontend mohol čítať katalóg a zapisovať rezervácie — a **nič viac**.

**1. Politika (čo smie):** Settings → **Access Policies** → **Create Policy**
   → Name = „Rezervácie — booking + leady". Pridaj **Permissions**:
   - `booking_resources`, `booking_services`, `booking_availability`,
     `booking_blackouts` → **Read** (len čítať).
   - `bookings` → **Read + Create + Update** (update = na zrušenie termínu).
   - `client_leads` → **Create** (rezervácia založí lead; rovnako ako `frontend-bot`).
   - Nič iné nezapínaj.

**2. Rola:** Settings → **Roles** → **Create Role** → Name = „Rezervácie" →
   priraď politiku z bodu 1.

**3. Používateľ + token:** **User Directory** → **Create User** →
   napr. e-mail `reservation-bot@digitalnapomoc.sk` → **Role = „Rezervácie"** →
   Save. Otvor používateľa → pole **Token** → **Generate Token** → **Save**.
   Token sa ukáže **iba raz** → hneď skopíruj.

**4. Ulož token:** Railway → **frontend** služba → **Variables** →
   pridaj `RESERVATION_TOKEN` = skopírovaný token. *(Použije ho krok R1.)*

---

## ČASŤ D — Seed dáta (naše demo)

Content (ikonka dát vľavo) → jednotlivé kolekcie → **Create Item**:

1. **`booking_resources`** → 1 položka: `name = Poradca 1`, `is_active` ✅.
2. **`booking_services`** → napr. `name = Konzultácia 30 min`,
   `duration_min = 30`, `is_active` ✅ (`resource` môžeš nechať prázdne).
3. **`booking_availability`** → 5 položiek (Po–Pia) pre `Poradca 1`:
   - `resource = Poradca 1`, `weekday = 1`, `start_time = 09:00`, `end_time = 17:00`
   - to isté pre `weekday = 2, 3, 4, 5` (utorok–piatok).
4. **`booking_blackouts`** → zatiaľ netreba (pridáš, keď bude dovolenka/sviatok).
5. **`bookings`** → **nič nevytváraj ručne** — vytvorí ich až rezervačný widget (R1).

---

## Hotovo ✅

Keď máš A–D, databáza je pripravená. Ďalší krok je **R1** — rezervačný engine
a widget `/rezervacia` na webe (to už bude vidno naostro na `digitalnapomoc.sk`).
