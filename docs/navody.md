# Návody — kuchárska kniha AI Nexus Link

> Recepty na bežné úkony. Príkazy sa púšťajú vo VS Code termináli
> v priečinku `ai-nexus-link` (alebo ich povedzte Claudovi ľudskou rečou).

## Agenti — prehľad (čo robí ktorý + príkaz)

> Orchestrátor príkazy sa púšťajú z priečinka `orchestrator/` s aktívnym venv:
> `cd orchestrator && source venv/bin/activate`. Chatbot beží vo frontende (nie CLI).
> Detailné recepty pre jednotlivé agenty sú v sekciách nižšie.

| Agent | Čo robí | Príkaz |
|---|---|---|
| **Writer** (`wp_writer_agent.py`) | Napíše SEO článok o našich riešeniach + 2 obrázky → WP **koncept**. Obmieňa úvod/príklady, pamäť na napísané články, FABLE (nevymýšľa čísla). | `python wp_writer_agent.py "Téma"` · bez témy = náhodná z `topics` v Directuse |
| **SEO/GEO** (`seo_geo_agent.py`) | Doplní meta popis, kľúčové slovo, interné odkazy, GEO tip ku konceptu. | `python seo_geo_agent.py [ID]` |
| **Pipeline** (`run_pipeline.py`) | Reťazec Writer → SEO/GEO (Start Command cronu). | `python run_pipeline.py` |
| **Revízny** (`revise_article.py`) | Prepíše starý článok na naše riešenia → koncept „[REVÍZIA]". Originál nemení. | `python revise_article.py <ID> --dry-run`, potom bez `--dry-run` |
| **Oprava obrázkov** (`fix_post_images.py`) | Doplní/opraví obrázky v starom článku. | `python fix_post_images.py <ID> "Téma"` |
| **RAG index** (`rag_index.py`) | Naindexuje obsah (články + FAQ + služby) pre chatbota. Spustiť po zmene obsahu. | `python rag_index.py --dry-run`, potom bez `--dry-run` |
| **RAG chatbot** | Odpovedá návštevníkom z nášho obsahu (FABLE). Beží vo frontende `/api/chat`. | (nie CLI; prompt v `lib/rag.ts`, config → Directus) |
| **Test spojenia** (`main.py`) | Overí spojenie s Directusom. | `python main.py` |

**Bezpečnosť:** `--dry-run` a `main.py` len čítajú. Ostatné píšu do živých systémov (WP
koncepty, RAG DB) a míňajú API kredity — sú to však koncepty/logy (vratné). Vždy najprv `--dry-run`.

## Nový článok na blog (cez Waylanda)

```bash
cd orchestrator && source venv/bin/activate
python wp_writer_agent.py "Téma článku po slovensky"
```

- Agent napíše článok (Z.ai GLM), vygeneruje 2 tematické obrázky
  (Gemini), natrvalo ich uloží do WP médií a vytvorí **koncept**.
- V logu čakajte dvakrát `🖼️ Obrázok natrvalo uložený v médiách:`.
- wp-admin → Články → koncept skontrolovať/upraviť → **Publikovať**.
- Do ~10 s je článok na stránke (webhook). Hotovo.
- 💰 Kredit sa míňa LEN pri generovaní (~5–8 centov/článok). Zobrazovanie
  je zadarmo — obrázky sú statické súbory v médiách a NIKDY sa nemenia.

## SEO/GEO vylepšenie konceptu (cez SEO+GEO agenta)

```bash
cd orchestrator && source venv/bin/activate
python seo_geo_agent.py         # najnovší koncept
python seo_geo_agent.py 802     # konkrétny článok podľa ID
```

- Agent nechá model navrhnúť **meta popis** a zapíše ho do WP poľa „Zhrnutie"
  (`excerpt`) — frontend ho použije ako meta description pre Google/AI.
- **Kľúčové slovo, interné odkazy a GEO tip** nájdeš v Directuse → `agent_logs`
  (agent `seo_geo`) — rozhodneš sa, čo z toho použiješ.
- Článok **ostáva koncept** — po kontrole ho publikuješ vo wp-admin.
- Nastavenia (poskytovateľ/model) meníš klikaním v Directus `agent_config`
  (riadok `agent_name = seo_geo`).

## Automatizácia (reťazec Writer → SEO agent)

Cron na Railway spúšťa **`run_pipeline.py`** — jeden beh, dvaja agenti za sebou:
Writer napíše koncept a SEO+GEO agent ho hneď vylepší (na presnom ID článku).
Ráno (Po/St/Pi) tak pribudne rovno **optimalizovaný koncept** na schválenie.

Nastavenie na Railway: cron worker → **Settings** → **Start Command** =
`python run_pipeline.py`. Ručný test: „Run now" alebo lokálne
`python run_pipeline.py`.

## Railway — presné cesty (klikací ťahák)

> Služby v projekte: **frontend** = `ai-nexus-link` (Next.js), **orchestrátor**
> = cron worker (náhodný názov, napr. „sincere-motivation"; Root Directory
> `orchestrator`, Start Command spúšťa Python). Pri práci s agentmi si vždy
> otvor **orchestrátor**, nie frontend.
> Záložky služby orchestrátora: **Cron Runs · Deployments · Variables · Metrics
> · Console · Settings**.

**Zmeniť Start Command (čo cron spúšťa):**
1. Railway → otvor projekt → klikni na službu **orchestrátora**.
2. Horné záložky → **Settings**.
3. Scrolluj do sekcie **Deploy** → políčko **Custom Start Command**.
4. Prepíš hodnotu (napr. `python run_pipeline.py`).
5. Hore sa objaví fialové tlačidlo **Deploy** → **stlač ho** (bez toho sa zmena
   neprejaví). Počkaj na status **Active** (zelený).

**Spustiť agenta hneď (Run now):**
1. Služba orchestrátora → záložka **Cron Runs**.
2. Vpravo hore tlačidlo **Run now** → spustí Start Command okamžite.
   (Tá istá záložka ukazuje aj rozvrh „Next run…" a „Recent Executions".)

**Pozrieť logy (výpis behu):**
1. **Cron Runs** (alebo **Deployments**) → pri aktívnom behu **View logs**.
2. Úspešný reťazec končí `✅ Reťazec dokončený.`

**Zmeniť premennú prostredia (env var):**
1. Služba → záložka **Variables** → uprav/pridaj hodnotu → **Deploy** (fialové tlačidlo).

## Predajný tón článkov (Writer `system_prompt`)

Blog je nástroj na získavanie klientov — články majú informovať a zároveň
prirodzene viesť k našej ponuke automatizácií. Nastav to ručne v Directuse:

Directus → Content → **Agent Config** → riadok `wp_writer` → pole
**`system_prompt`** → vlož a ulož tento text:

> Píšeš pre firmu digitalnapomoc.sk, ktorá malým slovenským firmám dodáva AI
> automatizácie a moderné weby na kľúč. Články majú budovať dôveru a zároveň
> jemne viesť k našej ponuke. Kde to prirodzene sedí (najmä v závere) spomeň,
> že takéto riešenie vieme klientovi postaviť alebo napojiť na jeho existujúce
> nástroje — napr. automatická odpoveď na e-maily, online rezervácie,
> spracovanie objednávok — a vyzvi na nezáväznú bezplatnú konzultáciu. Nikdy
> nepíš ako reklamu; pomáhaj a ponúkaj.

Prejaví sa v **novom** článku (Writer ho napíše s týmto tónom). Terajšie články
ostávajú. Config nastavujeme **ručne** (bez admin tokenu v `.env`) — bezpečnejšie.

## Oprava obrázkov v starom článku

Pre články spred „obrázkovej reformy" (meniace sa picsum obrázky):

```bash
cd orchestrator && source venv/bin/activate
python fix_post_images.py <ID> "Téma pre obrázky"
```

- ID článku: wp-admin → upraviť článok → v adrese `post=ČÍSLO`.
- Skript zmaže staré `<img>`, vygeneruje a vloží 2 nové trvalé obrázky,
  článok uloží (text sa nemení). Webhook stránku obnoví sám.
- ⚠️ Spustiť na článok IBA RAZ — každé spustenie generuje nové obrázky
  (= nové centy + výmena existujúcich).

## Úprava textu článku

wp-admin → Články → Upraviť → **Aktualizovať**. Nič viac — webhook
zmenu dostane na stránku do ~10 sekúnd.

## Úprava samotnej stránky (texty sekcií, dizajn, funkcie)

Kde čo je:
- texty sekcií (štatistiky, kroky, referencie, FAQ, menu):
  `frontend/lib/content.ts`
- sekcie stránky: `frontend/components/*.tsx` (hero, services, footer…)
- farby/štýly: `frontend/app/globals.css`
- blogové stránky: `frontend/app/blog/`

Pracovný postup (git kolečko):

```bash
git checkout main && git pull          # začni z čerstvej main
git checkout -b nazov-upravy           # nová vetva = dielňa
# ...úpravy...
cd frontend && npm run dev             # kontrola na http://localhost:3000
git add -A && git commit -m "Popis zmeny"
git push -u origin nazov-upravy
```

Na GitHube: **Pull request → Merge**. Railway automaticky nasadí `main`
(~3 min). Zásada: do `main` nikdy necommitovať priamo — vždy cez vetvu.

## Revízia starého článku na naše riešenia (revízny agent)

```bash
cd orchestrator && source venv/bin/activate
python revise_article.py <ID> --dry-run    # najprv NÁHĽAD (nič nezapíše)
python revise_article.py <ID>              # vytvorí koncept „[REVÍZIA] …"
```

- Prečíta publikovaný článok a prepíše ho tak, aby odporúčal **naše riešenia**
  namiesto cudzích nástrojov (zachová obrázky a tému, žiadne vymyslené čísla).
- Uloží ako **nový koncept** „[REVÍZIA] …" — **pôvodný článok nemení.**
- Vo wp-admin koncept skontroluj a originál nahraď **ručne a postupne** (pozor na
  SEO — nie hromadne naraz). ID článku nájdeš vo wp-admin v URL (`…post=NNN…`).

## Preindexovanie chatbota (RAG index)

```bash
cd orchestrator && source venv/bin/activate
python rag_index.py --dry-run    # vypíše zdroje (články + FAQ + služby), nič nezapíše
python rag_index.py              # zapíše embeddingy do RAG databázy
```

- Spusti **po zmene obsahu** (nové/upravené články, FAQ, alebo služby v `content.ts`),
  aby chatbot odpovedal z aktuálneho obsahu.
- Míňa Gemini kredity na embeddingy; `--dry-run` je zadarmo.

## Leady z formulárov

Directus → Content (prvá ikonka) → **Client Leads**. Stĺpec `source`:
`hero-callback` = malý formulár hore, `kontakt-cta` = hlavný formulár.
`date_created` = kedy prišiel.

## Webhook (okamžitá obnova blogu)

- Súbor `nexus-revalidate.php` na hostingu v `wp-content/mu-plugins/`
  (musí obsahovať platný `REVALIDATE_SECRET` — rovnaký ako v Railway).
- Ručný test: `curl -X POST "https://ai-nexus-link-production.up.railway.app/api/revalidate?secret=VAS_SECRET"`
  → má vrátiť `{"ok":true,...}`.

## Keď niečo nefunguje

1. **Stránka nejde / stará verzia:** Railway → služba ai-nexus-link →
   Deployments → je posledný deploy zelený (Active)? Logy: View logs.
2. **Formulár hlási chybu:** Railway logy — hľadajte riadok
   `lead: Directus odpovedal …` (401 = zlý token, 404 = zlá URL).
3. **Články sa nenačítavajú (záložné 3 články):** funguje WP REST?
   Otvorte `https://www.digitalnapomoc.sk/wp-json/wp/v2/posts` v prehliadači.
4. **Obrázky sa negenerujú:** log agenta povie prečo (kvóta/kredit/model).
   Gemini kredit: console.cloud.google.com → Billing.
5. **Nový článok sa neukázal hneď:** počkajte 5 min (cache) — ak sa ani
   potom neukáže, skontrolujte mu-plugin a secret (bod Webhook).

## Rotácia kľúčov (keby unikol / preventívne)

- **frontend-bot token:** Directus → User Directory → frontend-bot →
  Token → pregenerovať → novú hodnotu vložiť do Railway `DIRECTUS_TOKEN`.
- **REVALIDATE_SECRET:** vygenerovať nový (`openssl rand -hex 24`),
  vymeniť v Railway aj v `nexus-revalidate.php` na hostingu.
- **WP application password:** wp-admin → Používatelia → profil →
  Application Passwords → nové heslo → `orchestrator/.env`.
- **Gemini kľúč:** aistudio.google.com → starý zmazať, nový do
  `orchestrator/.env` (`GEMINI_API_KEY`).
