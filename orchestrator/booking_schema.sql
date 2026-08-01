-- Rezervačný agent — dátový model (Krok R0 z docs/plan-agenti.md)
--
-- Odvetvovo neutrálna schéma pre „krabicové" rezervácie (realitky, kaderníctva,
-- autoservisy, zubári, kozmetika…). Tri univerzálne pojmy:
--   zdroj (booking_resources) × služba (booking_services) × dostupnosť
--   (booking_availability) → z nich engine (frontend/lib/booking.ts) počíta
--   voľné sloty. Rezervácie žijú v `bookings`, výnimky v `booking_blackouts`.
--
-- Kde toto žije: sú to **Directus kolekcie** (systémové dáta na Railway, prepojené
-- na CRM `client_leads`) — nie obsah webu. Kolekcie sa v praxi zakladajú **klikaním
-- v Directus admine** (Directus vtedy vytvorí tieto tabuľky sám). Tento súbor je:
--   1) referenčný popis schémy (aké polia/typy má klient nastaviť), a
--   2) **jediná cesta k exclusion constraintu** proti dvojitej rezervácii —
--      to Directus cez UI spraviť nevie, treba to dobehnúť ručne cez psql.
--
-- Kde spustiť exclusion constraint (a prípadne tabuľky, ak ich staviaš mimo UI):
--   Railway → PostGIS/Postgres → Console → `psql "$DATABASE_URL"` → vlož nižšie.
--   Príkazy sú idempotentné (IF NOT EXISTS / IF EXISTS) — bezpečné pustiť aj
--   potom, ako Directus kolekcie už vytvoril.
--
-- Čas: v DB ukladáme **UTC** (`timestamptz`), zobrazujeme Europe/Bratislava.
-- Nikdy neukladať „naivný" lokálny čas.
--
-- Vzor a štýl podľa `rag_schema.sql` (tá istá zásada „každý systém jedna rola").

-- Rozšírenie pre exclusion constraint nad rozsahmi + rovnosťou (`resource WITH =`).
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ── Zdroje: kto/čo má kapacitu (zubár / kreslo / kaderníčka / zdvihák / maklér)
CREATE TABLE IF NOT EXISTS booking_resources (
    id           SERIAL      PRIMARY KEY,
    name         TEXT        NOT NULL,
    is_active    BOOLEAN     NOT NULL DEFAULT true,
    sort         INT,                                    -- poradie v admine (voliteľné)
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Služby: čo sa rezervuje (z toho vzniká dĺžka a krok slotu)
CREATE TABLE IF NOT EXISTS booking_services (
    id            SERIAL      PRIMARY KEY,
    name          TEXT        NOT NULL,
    duration_min  INT         NOT NULL,                  -- dĺžka slotu v minútach
    buffer_min    INT         NOT NULL DEFAULT 0,        -- rezerva po službe (upratanie/prestávka)
    slot_step_min INT,                                   -- krok mriežky; NULL = = duration_min
    description   TEXT,
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    -- Ktorý zdroj službu poskytuje. NULL = ktorýkoľvek aktívny zdroj.
    resource      INT         REFERENCES booking_resources (id) ON DELETE SET NULL,
    sort          INT,
    date_created  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Dostupnosť: otváracie hodiny na zdroj a deň v týždni.
-- Viac riadkov pre ten istý (resource, weekday) = deň rozdelený prestávkou
-- (napr. 9:00–12:00 a 13:00–17:00 kvôli obedu).
CREATE TABLE IF NOT EXISTS booking_availability (
    id           SERIAL      PRIMARY KEY,
    resource     INT         NOT NULL REFERENCES booking_resources (id) ON DELETE CASCADE,
    weekday      SMALLINT    NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = nedeľa … 6 = sobota
    start_time   TIME        NOT NULL,
    end_time     TIME        NOT NULL,
    CHECK (end_time > start_time)
);

-- ── Blackouty: blokované termíny (dovolenka, sviatok, obed, servis).
-- resource NULL = blokované pre všetky zdroje (napr. štátny sviatok).
CREATE TABLE IF NOT EXISTS booking_blackouts (
    id        SERIAL      PRIMARY KEY,
    resource  INT         REFERENCES booking_resources (id) ON DELETE CASCADE,
    "start"   TIMESTAMPTZ NOT NULL,
    "end"     TIMESTAMPTZ NOT NULL,
    reason    TEXT,
    CHECK ("end" > "start")
);

-- ── Rezervácie: samotné objednané termíny.
CREATE TABLE IF NOT EXISTS bookings (
    id             SERIAL      PRIMARY KEY,
    service        INT         REFERENCES booking_services (id) ON DELETE SET NULL,
    resource       INT         NOT NULL REFERENCES booking_resources (id) ON DELETE CASCADE,
    "start"        TIMESTAMPTZ NOT NULL,
    "end"          TIMESTAMPTZ NOT NULL,
    customer_name  TEXT        NOT NULL,
    customer_email TEXT        NOT NULL,
    customer_phone TEXT,
    note           TEXT,
    status         TEXT        NOT NULL DEFAULT 'confirmed'   -- confirmed | cancelled
                   CHECK (status IN ('confirmed', 'cancelled')),
    source         TEXT        NOT NULL DEFAULT 'web-widget'  -- web-widget | chatbot
                   CHECK (source IN ('web-widget', 'chatbot')),
    -- Prepojenie na CRM. Rezervácia zároveň založí/napojí lead v `client_leads`.
    -- Typ musí sedieť s `client_leads.id`. Directus M2O väzba (UI) to vyrieši
    -- sama; pri ručnom behu predpokladáme integer id (Directus default). Ak má
    -- `client_leads.id` iný typ (napr. UUID), uprav typ stĺpca `lead` podľa toho.
    lead           INT         REFERENCES client_leads (id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK ("end" > "start")
);

-- Rýchle dotazy na sloty daného zdroja v čase (engine číta rezervácie na deň).
CREATE INDEX IF NOT EXISTS bookings_resource_start_idx ON bookings (resource, "start");
CREATE INDEX IF NOT EXISTS booking_blackouts_resource_start_idx ON booking_blackouts (resource, "start");
CREATE INDEX IF NOT EXISTS booking_availability_resource_weekday_idx ON booking_availability (resource, weekday);

-- ── Zásada proti dvojitej rezervácii (jadro produktu) ────────────────────────
-- DB fyzicky nedovolí prekryv dvoch potvrdených rezervácií na tom istom zdroji.
-- Toto je správne, odborné riešenie — nie iba kontrola v aplikácii. App navyše
-- robí re-check slotu tesne pred zápisom (rýchla spätná väzba používateľovi),
-- ale posledné slovo má constraint (chytí aj súbeh dvoch requestov).
--
-- Directus cez UI exclusion constraint spraviť nevie → pridávame ho tu ručne.
-- Idempotentne cez DROP IF EXISTS + ADD (Postgres nepodporuje `IF NOT EXISTS`
-- pri ADD CONSTRAINT) — príkaz sa dá bezpečne pustiť opakovane.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_no_overlap;
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
    EXCLUDE USING gist (
        resource WITH =,
        tstzrange("start", "end") WITH &&
    ) WHERE (status = 'confirmed');
