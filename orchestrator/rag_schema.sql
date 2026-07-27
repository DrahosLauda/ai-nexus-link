-- RAG chatbot — schéma vektorového úložiska (Krok 1 z docs/rag-chatbot.md)
--
-- „Cesta B" (bez pgvectora): existujúca PostGIS (Directusov Postgres) pgvector
-- nemá, tak vektory ukladáme ako obyčajné pole `real[]` a kosínusovú podobnosť
-- počíta /api/chat v pamäti. Pre malý web (stovky kúskov) to bohato stačí a
-- nevyžaduje novú Railway službu. Prechod na pravý pgvector je neskôr malý.
--
-- Kde spustiť: Railway → PostGIS → Console → `psql "$DATABASE_URL"` → vlož nižšie.
--
-- Zásada „každý systém jedna rola": toto NIE je Directus kolekcia, ale naša
-- vlastná tabuľka v tom istom Postgrese. Obsah webu tak nejde do Directusu.
-- Embeddingy = Gemini `text-embedding-004` → 768 čísel (dĺžku poľa nevynucujeme).

-- Tabuľka na kúsky obsahu + ich vektory (pole reálnych čísel).
CREATE TABLE IF NOT EXISTS rag_chunks (
    id           BIGSERIAL   PRIMARY KEY,
    source_url   TEXT        NOT NULL,               -- odkaz na zdroj (článok/stránka)
    source_type  TEXT        NOT NULL DEFAULT 'article', -- article | faq | page
    title        TEXT,                               -- názov zdroja (na zobrazenie zdroja)
    chunk_index  INT         NOT NULL DEFAULT 0,     -- poradie kúska v rámci zdroja
    chunk_text   TEXT        NOT NULL,               -- samotný text kúska
    content_hash TEXT,                               -- hash zdroja (preskočí nezmenené)
    embedding    real[]      NOT NULL,               -- Gemini embedding (768 čísel)
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Jednoznačnosť kúska v rámci zdroja — umožní bezpečný re-index (indexovací
-- modul najprv zmaže kúsky daného zdroja, potom vloží nové).
CREATE UNIQUE INDEX IF NOT EXISTS rag_chunks_source_chunk_idx
    ON rag_chunks (source_url, chunk_index);
