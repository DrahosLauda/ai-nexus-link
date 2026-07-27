# RAG — Krok 1: príprava databázy (klikací návod pre začiatočníka)

> Presné pokyny, čo naklikať v Railway, aby bola databáza pripravená pre RAG
> chatbota. Súčasť plánu v `docs/rag-chatbot.md` (Krok 1). Cesta B — bez
> pgvectora, vektory ukladáme ako pole `real[]` do existujúcej PostGIS databázy.
>
> Písané po ľudsky, krok po kroku. Nič sa tu nedá pokaziť — všetko používa
> `IF NOT EXISTS`, takže opakované spustenie neublíži.

## Aby si tieto docs videl na Macu / v Obsidiane

Nové súbory žijú na vetve `claude/rag-chatbot-first-demo-9bwo1w` (nie na `main`).
Raz sa na ňu prepni, potom ti `git pull` ťahá zmeny:

```bash
git checkout claude/rag-chatbot-first-demo-9bwo1w
```

---

## Časť A — vytvoriť tabuľku (v databázovej konzole)

**Kde:** v okne, kde vidíš prompt `railway=#`. To JE databázová konzola (`psql`) —
príkazový riadok priamo do databázy. `railway` = názov databázy, `#` = „píš príkaz".

**Postup:**
1. Klikni do okna s `railway=#` (nech tam bliká kurzor).
2. Skopíruj celý blok nižšie (od `CREATE TABLE` po poslednú `;`).
3. Vlož (Cmd+V) a stlač Enter.

```sql
CREATE TABLE IF NOT EXISTS rag_chunks (
    id           BIGSERIAL   PRIMARY KEY,
    source_url   TEXT        NOT NULL,
    source_type  TEXT        NOT NULL DEFAULT 'article',
    title        TEXT,
    chunk_index  INT         NOT NULL DEFAULT 0,
    chunk_text   TEXT        NOT NULL,
    content_hash TEXT,
    embedding    real[]      NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS rag_chunks_source_chunk_idx
    ON rag_chunks (source_url, chunk_index);
```

**Čo máš vidieť (úspech):**
```
CREATE TABLE
CREATE INDEX
```
- `CREATE TABLE` = vznikla tabuľka `rag_chunks` (polička na kúsky textu + ich čísla).
- `CREATE INDEX` = poistka, aby sa ten istý kúsok neuložil dvakrát.
- `NOTICE: ... already exists, skipping` = tiež OK, tabuľka už bola.

**Overenie (nepovinné):** vlož `\d rag_chunks` + Enter → vypíše stĺpce tabuľky.
Von z konzoly sa dostaneš cez `\q`.

### Ak sa nedá vložiť celý blok / spadol si do shellu `root@...:/#`

Po preloadnutí stránky sa `psql` konzola zavrie a ostaneš v príkazovom riadku
kontajnera (`root@...:/#` = Linux shell, kde databáza beží). Viacriadkový blok
sa do týchto webových konzol často nedá vložiť. Riešenie — **jeden riadok**,
ktorý sa spojí s DB, vykoná oba príkazy a odpojí sa:

```
psql "$DATABASE_URL" -c "CREATE TABLE IF NOT EXISTS rag_chunks (id BIGSERIAL PRIMARY KEY, source_url TEXT NOT NULL, source_type TEXT NOT NULL DEFAULT 'article', title TEXT, chunk_index INT NOT NULL DEFAULT 0, chunk_text TEXT NOT NULL, content_hash TEXT, embedding real[] NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());" -c "CREATE UNIQUE INDEX IF NOT EXISTS rag_chunks_source_chunk_idx ON rag_chunks (source_url, chunk_index);"
```

Úspech = vypíše `CREATE TABLE` a `CREATE INDEX`.
Ak `could not connect`, skús `psql -U postgres railway -c "SELECT 1;"` a podľa
výsledku upraviť pripojenie.

---

## Časť B — pridať connection string ako env premennú (nasleduje po časti A)

Aby k databáze dosiahol náš kód (orchestrátor ju plní vektormi, frontend z nej
číta), obom službám pridáme rovnaký „connection string" pod názvom
`RAG_DATABASE_URL`.

1. Railway → služba **orchestrátor** (cron worker) → záložka **Variables** →
   **New Variable**:
   - názov: `RAG_DATABASE_URL`
   - hodnota: `${{ PostGIS.DATABASE_URL }}`  ← napíš presne takto; Railway sám
     doplní adresu aj heslo referenciou na PostGIS (nič nekopíruješ ručne).
2. Railway → služba **frontend** (`ai-nexus-link`) → **Variables** → to isté:
   - `RAG_DATABASE_URL` = `${{ PostGIS.DATABASE_URL }}`

> Ak by referencia `${{ PostGIS.DATABASE_URL }}` nefungovala (služba sa volá
> inak), napíš — dáme tam plný `postgresql://…` reťazec ručne.

Túto časť netreba hneď deployovať — kód, čo premennú použije, príde v Kroku 2.

---

## Stav Kroku 1

- [ ] Časť A — spustené `CREATE TABLE` + `CREATE INDEX` (tabuľka `rag_chunks` stojí)
- [ ] Časť B — `RAG_DATABASE_URL` pridaná do orchestrátora aj frontendu
