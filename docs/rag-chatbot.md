# RAG chatbot — štartový dokument (runbook)

> Ako postaviť a spustiť **prvé živé demo RAG chatbota** na `digitalnapomoc.sk`.
> Runbook pre nové Claude Code sedenie. Širšia vízia a dôvody: `vizia.md` §11.
> Jazyk: slovenčina.
>
> **Pravidlo:** commit + push do vetvy a otvorenie PR je OK; **pred mergom do
> `main` a pred akoukoľvek zmenou v Railway / databáze VŽDY počkať na súhlas
> používateľa.**

## 📋 Prompt na spustenie nového sedenia (skopíruj do nového Claude sedenia)

```
Najprv si prečítaj docs/dennik.md a docs/vizia.md (kontext, rozhodnutia,
ponaučenia). Potom pracujeme na RAG chatbotovi podľa docs/rag-chatbot.md a
docs/vizia.md §11. Cieľ: prvé živé demo chatbota na našom webe, ktorý odpovedá
Z NÁŠHO obsahu (WP články + FAQ + stránka /headless-wordpress) cez RAG
(vektorové hľadanie v pgvector v našom Postgrese). Postupuj po krokoch
z runbooku. Commit + push do vetvy môžeš, ale pred mergom do main a pred
zmenami v Railway/DB počkaj na moje "áno". Začni Krokom 1 (príprava DB) a
najprv mi povedz, čo mám naklikať ja.
```

## Cieľ a prečo

- **Prečo:** na webe ponúkame „nasadenie AI chatbotov a asistentov" — potrebujeme
  aspoň **jedného živého na vlastnom webe** ako dôkaz (ukáž, nepovedz).
- **Čo:** chatbot, ktorý odpovedá **z nášho obsahu** (nehalucinuje) a vie odkázať
  na zdroj (článok). Ten istý agent = neskôr **platená služba** pre klientov.

## Architektúra (tok dát)

```
Obsah (WP články + FAQ + /headless-wordpress)
   → rozsekať na kúsky → embedding (vektor) → uložiť do pgvector

Otázka návštevníka
   → embedding otázky → nájsť najbližšie kúsky (pgvector) → poskladať prompt
   → model odpovie z kúskov → odpoveď + zdroje
```

## Predpoklady — čo treba mať (klikacia časť pre používateľa)

1. **pgvector v Postgrese.** Overiť, či Railway Postgres (ten, čo používa
   Directus) má rozšírenie `vector`. Ak áno: `CREATE EXTENSION IF NOT EXISTS
   vector;`. Ak nie: použiť Railway **pgvector** template / iný Postgres, alebo
   hosted vektorovú DB (Qdrant). *(rozhodnutie: spoločná DB s Directusom vs
   oddelená — kvôli zásade „každý systém jedna rola" zvážiť aspoň oddelenú
   schému/tabuľku.)*
2. **Embeddings API kľúč** — Gemini (`text-embedding-004`, 768 dim) alebo OpenAI
   (`text-embedding-3-small`, 1536 dim). Kľúč do Railway Variables.
3. **Model na generovanie odpovede** — Gemini / Z.ai GLM / Claude (kľúče už máme).
4. **DB prístup pre orchestrátor aj frontend** — connection string do env
   (indexovací modul zapisuje vektory, `/api/chat` číta).

## Postup po krokoch (návrh pre nové sedenie)

**Krok 1 — Príprava DB** *(klikacia + kód, po súhlase):*
- `CREATE EXTENSION IF NOT EXISTS vector;`
- Tabuľka napr. `rag_chunks(id, source_url, title, chunk_text, embedding vector(768), created_at)`.
- Index na `embedding` (napr. `ivfflat` / `hnsw`) pre rýchle hľadanie.

**Krok 2 — Indexovací modul** (`orchestrator/rag_index.py`):
- Načíta WP články (REST), FAQ (`frontend/lib/content.ts`) a text stránky
  `/headless-wordpress`.
- Rozseká na kúsky (~500–800 tokenov, mierny prekryv).
- Zavolá embeddings API, upsertne vektory do `rag_chunks` (podľa `source_url`).
- Spúšťanie: cronom + pri publikovaní článku (existujúci webhook).

**Krok 3 — Odpovedací API** (`frontend/app/api/chat/route.ts`):
- Vstup: otázka (+ voliteľne história). Rate limit ako `/api/lead`.
- Embedne otázku → `SELECT … ORDER BY embedding <=> $1 LIMIT k` (pgvector) →
  top‑k kúskov.
- Poskladá prompt (systémový: „odpovedaj len z priloženého kontextu; keď tam
  odpoveď nie je, povedz to a odkáž na kontakt") + kúsky ako kontext.
- Zavolá model, vráti odpoveď **+ zoznam zdrojov** (odkazy na články).

**Krok 4 — Frontend widget** (`frontend/components/chat-widget.tsx`):
- Bublina vpravo dole (ako apertia), po kliknutí panel s chatom.
- Volá `/api/chat`, zobrazí odpovede + zdroje. Prístupné (klávesnica, aria).

**Krok 5 — Config + logy + token:**
- Directus `agent_config` riadok `chatbot` (model, prompt, k…); `agent_logs`.
- Vlastný token s minimálnymi právami (least privilege).

**Krok 6 — Test + nasadenie:**
- Lokálne otestovať odpovede a zdroje; potom deploy cez `main` (po súhlase).

## Bezpečnosť a kvalita

- Chatbot **iba číta** (nikdy nezapisuje do WP/Directusu okrem vlastných logov).
- **Anti‑halucinácia:** keď medzi kúskami nie je odpoveď → „toto zatiaľ neviem,
  napíšte nám" (nevymýšľať).
- Rate limit na `/api/chat`. Tajomstvá len v env.

## Otvorené rozhodnutia (na začiatku sedenia doriešiť)

- Model na odpoveď (cena vs kvalita) a poskytovateľ embeddingov.
- `k` (počet priložených kúskov) a veľkosť kúska.
- DB: spoločná s Directusom (jednoduchšie) vs oddelená (čistejšie).

## Bonus — „chat s Obsidianom"

Rovnaký RAG vzor sa dá pustiť nad vlastným Obsidian vaultom (poznámky →
embeddingy → chat). Dobrý interný test technológie pred nasadením klientom.
