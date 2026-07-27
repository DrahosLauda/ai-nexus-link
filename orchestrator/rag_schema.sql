-- RAG chatbot — schéma vektorového úložiska (Krok 1 z docs/rag-chatbot.md)
--
-- Kde spustiť: Railway → Postgres služba (tá istá, čo používa Directus) →
--   záložka „Data" / „Query" (alebo `psql "$DATABASE_URL" -f rag_schema.sql`).
--
-- Zásada „každý systém jedna rola": toto NIE je Directus kolekcia, ale naša
-- vlastná tabuľka v tom istom Postgrese. Obsah webu tak nejde do Directusu.
-- Embeddingy = Gemini `text-embedding-004` → 768 rozmerov (vector(768)).
-- Pri zmene poskytovateľa embeddingov (napr. OpenAI 1536) uprav rozmer vektora.

-- 1) Rozšírenie pgvector. Ak zlyhá „extension \"vector\" is not available",
--    Postgres image nemá pgvector — použi Railway pgvector template / iný obraz.
CREATE EXTENSION IF NOT EXISTS vector;

-- 2) Tabuľka na kúsky obsahu + ich vektory.
CREATE TABLE IF NOT EXISTS rag_chunks (
    id           BIGSERIAL PRIMARY KEY,
    source_url   TEXT        NOT NULL,               -- odkaz na zdroj (článok/stránka)
    source_type  TEXT        NOT NULL DEFAULT 'article', -- article | faq | page
    title        TEXT,                               -- názov zdroja (na zobrazenie zdroja)
    chunk_index  INT         NOT NULL DEFAULT 0,     -- poradie kúska v rámci zdroja
    chunk_text   TEXT        NOT NULL,               -- samotný text kúska
    content_hash TEXT,                               -- hash zdroja (preskočí nezmenené)
    embedding    vector(768),                        -- Gemini text-embedding-004
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Jednoznačnosť kúska v rámci zdroja — umožní bezpečný re-index (upsert
--    podľa (source_url, chunk_index) namiesto duplikovania pri každom behu).
CREATE UNIQUE INDEX IF NOT EXISTS rag_chunks_source_chunk_idx
    ON rag_chunks (source_url, chunk_index);

-- 4) Vektorový index pre rýchle hľadanie najbližších kúskov (kosínusová
--    vzdialenosť — operátor <=>). HNSW je presný a rýchly; ak by nebol
--    dostupný (staršia pgvector), zakomentuj a použi IVFFLAT nižšie.
CREATE INDEX IF NOT EXISTS rag_chunks_embedding_idx
    ON rag_chunks USING hnsw (embedding vector_cosine_ops);

-- Alternatíva pre staršiu pgvector (namiesto HNSW vyššie):
-- CREATE INDEX IF NOT EXISTS rag_chunks_embedding_idx
--     ON rag_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
