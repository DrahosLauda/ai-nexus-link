# RAG — Krok 2: spustenie indexera (naplnenie databázy) — návod

> Ako lokálne na Macu spustiť `orchestrator/rag_index.py`, aby sa tabuľka
> `rag_chunks` naplnila naším obsahom (WP články + FAQ). Súčasť plánu
> `docs/rag-chatbot.md`. Beží **lokálne** (orchestrátor ešte nie je Railway
> služba), preto potrebuje **verejnú** adresu databázy.

## A — verejná adresa databázy z Railway

1. Railway → služba **PostGIS** → záložka **Variables**.
2. Nájdi premennú **`DATABASE_PUBLIC_URL`** (verejná, dosiahnuteľná z Macu —
   na rozdiel od vnútornej `...railway.internal`).
3. Klikni na ňu a **skopíruj celú hodnotu** (`postgresql://postgres:…@…railway.app:PORT/railway`).

> ⚠️ Je v nej heslo — patrí len do `.env` (nie do kódu, nie na GitHub, nikam verejne).

## B — pridať do `orchestrator/.env`

Otvor súbor `orchestrator/.env` a pridaj riadok (vlož skopírovanú adresu):

```
RAG_DATABASE_URL=postgresql://postgres:…@…railway.app:PORT/railway
```

Ostatné potrebné premenné (`GEMINI_API_KEY`, `WP_URL`) tam už máš z Writer agenta.

## C — dostať kód na Mac (prepnúť na vetvu)

`rag_index.py` je zatiaľ na vetve (nie v `main`), tak sa naň prepni:

```bash
git checkout claude/rag-chatbot-first-demo-9bwo1w
git pull
```

## D — doinštalovať závislosť

Nová knižnica `psycopg2-binary` (spojenie Pythonu s Postgresom):

```bash
cd orchestrator
source venv/bin/activate
pip install -r requirements.txt
```

## E — suchý beh (nič nestojí, nič nezapíše)

Najprv „na sucho" — ukáže, čo by indexoval, bez volania Gemini a bez zápisu:

```bash
python rag_index.py --dry-run
```

Očakávaný výstup: zoznam článkov + „Časté otázky (FAQ)" a počty kúskov.

## F — ostrý beh (naplní databázu)

```bash
python rag_index.py
```

Očakávaný výstup: pri každom zdroji `✅ …názov… — N kúskov`, na konci
`🎉 Indexácia hotová: … zdrojov / … kúskov …`. (Opakované spustenie preskočí
nezmenené zdroje — `⏭️ Bez zmeny`.)

## G — overenie v databáze (nepovinné)

V Railway PostGIS konzole (`psql`):

```sql
SELECT count(*) FROM rag_chunks;
SELECT source_type, count(*) FROM rag_chunks GROUP BY source_type;
```

Malo by ukázať kúsky typu `article` a `faq`.

## Keby niečo hlásilo chybu

- `could not connect` / `timeout` → skontroluj `RAG_DATABASE_URL` (musí byť
  **PUBLIC** URL) a či nemáš preklep. Railway PostGIS musí bežať.
- `SSL` chyba → skús na koniec URL pridať `?sslmode=require`.
- `Gemini embedding zlyhal` → skontroluj `GEMINI_API_KEY` a dennú kvótu.
- WP `403/401` → indexer pridá WP prihlásenie z `.env` automaticky; over
  `WP_URL`, `WP_USER`, `WP_APP_PASSWORD`.

## Stav

- [ ] A — skopírovaná `DATABASE_PUBLIC_URL`
- [ ] B — `RAG_DATABASE_URL` v `orchestrator/.env`
- [ ] C — prepnuté na vetvu, kód stiahnutý
- [ ] D — `pip install -r requirements.txt` (psycopg2-binary)
- [ ] E — `--dry-run` ukázal obsah
- [ ] F — ostrý beh naplnil `rag_chunks`
