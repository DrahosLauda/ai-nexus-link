# RAG — automatické doindexovanie — návod

> ⚠️ **Cesta A (nová služba = denný cron) vyžaduje Railway upgrade na Hobby**
> ($5/mes.) — free plán nedovolí pridať ďalšiu službu. Preto sme zvolili
> **Cestu B (zadarmo, bez novej služby)**: reindex je pripojený na koniec
> existujúceho `run_pipeline.py`, takže beží pri každom behu orchestrátora
> (Po/St/Pi). Nastavenie B je nižšie v sekcii „Cesta B". Cesta A (celý postup
> s novou službou) ostáva popísaná pre prípad, že sa raz rozhodneš pre denný
> cron s upgradom.

## Cesta B — reindex v existujúcom pipeline (zvolené, zadarmo)

Kód už je hotový (`run_pipeline.py` na konci volá `rag_index.run()`; bezpečne —
chýbajúca konfigurácia ani chyba nezhodia Writer beh). Treba len:

1. **Jedna premenná na existujúcom orchestrátori** (služba `sincere-motivation`) —
   žiadny upgrade, len nová Variable:
   - `RAG_DATABASE_URL` = verejná adresa DB (`postgresql://…railway.app:PORT/railway`,
     tá istá ako v `orchestrator/.env` a vo frontende).
   - (`GEMINI_API_KEY` a `WP_URL` tam už sú — Writer ich používa.)
2. **Zlúčiť do `main`** → orchestrátor sa prenasadí (zmena je v `orchestrator/`).
3. Odvtedy sa reindex spustí **pri každom behu pipeline** (Po/St/Pi 06:00 UTC).
   Nový ručne publikovaný článok naskočí do chatbota do najbližšieho behu.
   (Kedykoľvek vieš spustiť aj ručne: `python rag_index.py`.)

Overenie: po najbližšom behu (alebo „Run now" na orchestrátori) v jeho logu
uvidíš `🔄 Doindexovanie RAG…` a `🎉 Indexácia hotová…`.

---

## Cesta A — samostatný denný cron (vyžaduje Hobby upgrade)

> Aby sa nové/upravené WP články samy dostali do chatbota — bez ručného
> spúšťania. Cesta A: druhý Railway cron worker, ktorý raz denne spustí
> `orchestrator/rag_index.py`. Reindex je „šikovný" (preskočí nezmenené cez
> `content_hash`, zmaže kúsky zmazaných článkov cez `prune`), takže denný beh
> je lacný a bezpečný. **Žiadna zmena kódu** — len nastavenie v Railway.

## Prehľad
- **Nová služba** v tom istom Railway projekte, z repa `DrahosLauda/ai-nexus-link`,
  Root Directory `orchestrator`, Start Command `python rag_index.py`.
- **Cron schedule** (dôležité!) — tým Railway vie, že je to naplánovaná úloha:
  spustí ju podľa plánu a po dobehnutí vypne (inak by sa reštartovala dokola).
- **3 premenné** (+ 2 voliteľné na logy).

## Krok 1 — vytvoriť službu z GitHub repa
1. Otvor Railway **projekt**, kde máš `ai-nexus-link` (frontend), `sincere-motivation`
   (orchestrátor) a PostGIS.
2. Klikni **`+ New`** (alebo **Create** / pravý klik na plátno) → **GitHub Repo**.
3. Vyber repo **`DrahosLauda/ai-nexus-link`**. Railway vytvorí novú službu a začne
   prvý build — to je OK, dokončíme nastavenie a nasadí sa znova.

## Krok 2 — Settings služby
Klikni na novú službu → záložka **Settings**:
1. **Source → Branch:** `main`.
2. **Root Directory:** `orchestrator` (tu je `requirements.txt` aj `rag_index.py`).
3. **Service Name** (nepovinné): premenuj napr. na `rag-indexer`, nech vieš, čo je.
4. **Deploy → Custom Start Command:** `python rag_index.py`.
5. **Cron Schedule:** `0 5 * * *` (každý deň o 05:00 UTC ≈ 07:00 u nás). **Ulož.**
   - Iná frekvencia: každých 6 h = `0 */6 * * *`; každú hodinu = `0 * * * *`.

## Krok 3 — Variables (premenné)
Záložka **Variables** → pridaj (**New Variable**):
1. `RAG_DATABASE_URL` — **vlož** verejnú adresu DB (tú istú ako v `orchestrator/.env`
   a vo frontende): `postgresql://postgres:…@…railway.app:PORT/railway`.
2. `GEMINI_API_KEY` — hodnota `${{ sincere-motivation.GEMINI_API_KEY }}` (referencia
   na orchestrátor) — alebo vlož kľúč ručne.
3. `WP_URL` — hodnota `${{ sincere-motivation.WP_URL }}` — alebo vlož
   `https://wp.digitalnapomoc.sk` (po go-live číta obsah z `wp.`).

Voliteľné (aby sa beh zapísal do Directus `agent_logs`):
4. `DIRECTUS_URL` = `${{ sincere-motivation.DIRECTUS_URL }}`
5. `DIRECTUS_TOKEN` = `${{ sincere-motivation.DIRECTUS_TOKEN }}`
   (Bez nich to funguje tiež — len sa nezaloguje, kód to bezpečne preskočí.)

## Krok 4 — nasadenie a overenie
1. Po zmenách Railway spraví **nasadenie a hneď raz spustí** indexer (prvý beh).
2. Otvor službu → **Deployments** (alebo **Logs**) a pozri výstup. Máš vidieť:
   `🔎 Zbieram obsah…`, `✅ …` (alebo `⏭️ Bez zmeny`, ak už je všetko zaindexované),
   a na konci `🎉 Indexácia hotová: … 0 chýb.`
3. Odvtedy beží **sám každý deň** podľa cronu. Hotovo.

## Keby niečo zlyhalo
- **Build failed** → skontroluj **Root Directory = `orchestrator`** (inak nenájde
  `requirements.txt`).
- **Služba sa reštartuje dokola** → nemá nastavený **Cron Schedule** (Settings).
- **`could not connect` / DB chyba** → `RAG_DATABASE_URL` musí byť **verejná** URL.
- **WP 404 / prázdno** → `WP_URL` musí byť `https://wp.digitalnapomoc.sk` (nie `www`).
- **`Gemini embedding zlyhal`** → skontroluj `GEMINI_API_KEY`.

## Náklad
Cron worker beží len pár sekúnd denne (potom sa vypne) — prakticky zadarmo,
na rozdiel od stále bežiacej služby.
