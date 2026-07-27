# Denník projektu

> Čo sa kedy urobilo, čo sa pokazilo a ako sa to vyriešilo.
> Nové záznamy pridávajte navrch.

## Backlog — nevyriešené úlohy, zadania a doplnky (živý zoznam)

> **Jediné miesto pravdy pre otvorené drobnosti a doplnky.** Dopĺňať/škrtať
> priebežne. Väčšie veci majú vlastný záznam nižšie. Súvisí s „Pred-Google
> checklistom" (viď GO-LIVE nižšie) — cieľ je **profesionálna úroveň SEO/GEO**,
> **agent, ktorý sa dá zlepšovať**, a **web pripravený na spustenie do Googlu**.
> Poradie v zozname ≠ priorita; väčšie fázy sa riešia podľa roadmapy (`vizia.md`).

**🔴 Gatuje spustenie do Googlu (Pred-Google checklist):**

- [ ] 🍪 **Cookie lišta + zásady ochrany osobných údajov** (GDPR — web zbiera leady
  cez formuláre). Bez toho web nesmieme spustiť do Googlu.
- [x] 📄 **Stránkovanie blogu** — 6 článkov na stránku + „ďalšie" (`/blog`). *(hotové)*
- [ ] 🎨 **Doladenie dizajnu** — priebežné vizuálne vylepšenia na expertnú úroveň.
- [ ] 🔎 **Spustenie:** `SITE_INDEXABLE=true` (Railway) + Google Search Console (`www`)
  — až po odškrtnutí bodov vyššie.

**🟡 Agent / orchestrátor (kvalita obsahu):**

- [ ] **Rôznorodejšie úvody článkov** — Writer často začína rovnakým vzorcom
  („Predstavte si, je piatok večer…"). Doladiť `system_prompt` (Directus) +
  príp. základný prompt v `wp_writer_agent.py`, nech úvody striedajú formu.
- [ ] **Jednoduchšie obrázky** — časť generovaných obrázkov je na naše témy
  príliš zložitá. Obmedziť/spresniť obrázkový prompt (jednoduchší, čistejší motív).
- [ ] **Alt texty generovaných obrázkov** — agent ich pri in-článkových obrázkoch
  už niekedy nastavuje; dotiahnuť **konzistenciu a kvalitu** (popisný alt vždy).

**🟡 Frontend:**

- [ ] **Responzivita (mobil)** — pár detailov na doladenie (doplniť konkrétne
  po prehliadke na mobile).
- [ ] **Interné odkazy v tele článku** po migrácii `www→wp` ukazujú na `wp.` —
  prelinkovať na `/blog/...` (samostatná téma, netýka sa obrázkov).

**🟣 Väčšie iniciatívy (roadmap — detail vo `vizia.md` §8–11):**

- [ ] **RAG chatbot naživo na našom webe (prvé demo)** — odpovedá z nášho obsahu
  (RAG + `pgvector` v existujúcom Postgrese). Keď ponúkame nasadenie chatbotov,
  musíme mať aspoň jedného živého. Zároveň predajná služba pre klientov. Viď `vizia.md` §11.
- [ ] **Viac ukážkových agentov = demo automatizácií** — chatbot/zák. podpora,
  rezervačný/objednávkový, e-mail auto-odpoveď. Každý agent = live demo služby.
  Rovnaký „lego" vzor (config v Directuse, modul v orchestrátore, logy).
- [ ] **Woo služby napárované na agentov** — reálne produkty vo WooCommerce
  (embednutý checkout, Store API), aby bolo vidieť headless WP ↔ frontend naostro.
- [ ] **Frontend „mockup" agent** — z promptu podľa biznisu/biznis plánu klienta
  vygeneruje náhľad webu; hotové ukážky do portfólia (predajný nástroj).
- [x] 🎨 **Redizajn webu → svetlejší štýl à la apertia.ai** — hotový (zmiešaný
  layout: tmavý hero + blog + pätička, svetlý stred; svetlé články). *(viď záznam nižšie)*
- [x] **Stránka „Čo je headless WordPress" + kalkulačka úspory za pluginy** —
  hotová na `/headless-wordpress` (bez cenníka, CSS grafika).
- [x] ⚠️ **Dizajnové referencie** — apertia screenshoty dodal používateľ; vlastná
  landing je v repe (`docs/index.html`).

**🟢 Doplnky / neskôr (nie sú blokery):**

- [ ] Podstránky služieb `/sluzby/[slug]`.
- [ ] Fotka tímu (`frontend/public/team.jpg` + `components/about.tsx`).
- [ ] Reálny telefón v pätičke.
- [ ] Vlastná obmedzená rola pre orchestrátor token (teraz admin) — least privilege.
- [ ] Maskot značky (fialový robot) + jemné efekty na článkových obrázkoch (viď
  „Nápady na neskôr" nižšie, Cesta A/C).
- [ ] SEO+GEO agent v2 — automatické prelinkovanie + HowTo schéma (viď roadmapa nižšie).
- [ ] **Zvážiť SessionStart hook** — aby nové sedenie **automaticky (tvrdo)** načítalo
  `docs/dennik.md` + `docs/vizia.md`, nie len cez „mäkký" pokyn v `CLAUDE.md`.
  (Claude Code skill `session-start-hook`; nastavuje sa v `.claude/settings.json`.)

**✅ Nedávno vyriešené (pre kontext):**

- [x] **Obrázky článkov po migrácii `www→wp`** — zobrazujú sa v tele článku aj
  v náhľadoch, všade bez `wp.` prefixu. *(vyriešené)*
- [x] Náhľady preberajú `alt` z WP (fallback názov článku).

## Júl 2026 — sedenie: RAG chatbot (Krok 1) + ponaučenie „vetva vs Obsidian"

**Urobené (vetva `claude/rag-chatbot-first-demo-9bwo1w`, zatiaľ NEzlúčené do `main`):**

- **Krok 1 — databáza pre RAG hotová.** V existujúcej PostGIS vytvorená tabuľka
  `rag_chunks` (`CREATE TABLE` + `CREATE INDEX` overené používateľom).
- **Rozhodnutie „Cesta B" (bez pgvectora):** PostGIS image `pgvector` nemá a ručná
  inštalácia by pri redeploy zmizla. Preto vektor ukladáme ako pole `real[]` a
  kosínusovú podobnosť počíta `/api/chat` v pamäti — **0 € navyše, žiadna nová
  Railway služba** (dôležité pri nízkom kredite). Prechod na pravý pgvector
  (Cesta A, ~5 €/mes.) necháme na neskôr, keď bude veľa obsahu. Detaily a plán:
  `docs/rag-chatbot.md`, klikací návod `docs/rag-krok1-db.md`.
- **Schéma v repe:** `orchestrator/rag_schema.sql`.

**⚠️ Ponaučenie (proces — GitHub/Obsidian):** Práca na **feature vetve** znamená,
že používateľov zabehnutý **`git pull` na `main` súbory NEUKÁŽE** (a teda ani
Obsidian, ktorý zálohuje `main`). Toto **treba povedať hneď na začiatku**, keď
zakladáme vetvu — inak sa zbytočne hľadá, „kde sú súbory".
- Zabehnutý tok projektu (viď `CLAUDE.md` → „Zálohy / pamäť projektu"): **sedenie
  pushuje → používateľ `git pull` na `main`**. Docs (pamäť projektu) sa doteraz
  vždy dostali do Obsidianu až **po merge do `main`**.
- **Pravidlo ostáva:** merge do `main` len po výslovnom súhlase používateľa.
- **Preto:** pri každej práci na vetve buď (a) hneď na úvod upozorniť „toto je na
  vetve X, tvoj `git pull` na main to neukáže, kým to nezlúčime; medzitým si to
  pozrieš cez `git checkout X`", alebo (b) ak sú to len **docs** (bezpečné, Railway
  frontend deploy sa spúšťa len zmenou v `frontend/`), ponúknuť skorší merge do
  `main`, nech to padne do Obsidianu bežným pullom.
- Súvisí s backlog bodom „Zvážiť SessionStart hook" — tvrdé načítanie `dennik.md`
  + `vizia.md` na štarte sedenia.

## Júl 2026 — sedenie: redizajn webu (svetlejší, apertia štýl) + svetlé články

**Čo sa urobilo (PR #20, #21, #22 → `main`):**

- **Nová stránka `/headless-wordpress`** — vysvetlenie headless WP + interaktívna
  kalkulačka úspory za pluginy (bez cenníka, bez grafovej knižnice; CSS pruhy).
  Prepojená z domovskej sekcie Služby (karta „Weby a e‑shopy"), v sitemape.
- **Redizajn homepage — zmiešaný layout:** hero **tmavý** (podľa 1. Claude návrhu
  — centrovaný „Digitálna pomoc, ktorá pracuje za vás"), stred **svetlý** (Služby,
  Ako to funguje, Referencie, O nás, FAQ), **blog tmavý**, kontakt svetlý,
  **pätička tmavá**.
- **Sekcia Služby** prerobená na rovnomernú mriežku **6 kariet** (+ karta
  „AI obsah a SEO"), data‑driven (pole + `map`).
- **Svetlé články** (`/blog/[slug]`): svetlá téma + typografia `.wp-article`,
  **náhľadový obrázok navrchu na celú šírku** (à la apertia), nadpis pod ním,
  **širší text** (760→880 px, 17 px). Zoznam `/blog` zámerne ostal tmavý.
- **Menu lišta + logo:** vyššia lišta; vylepšené logo (gradient + sklenený odlesk,
  akcent na `.sk`) + jemná **shine** animácia hrajúca len počas scrollu.
- **Ostrejší featured obrázok:** frontend berie **plnú veľkosť** (predtým
  `medium_large` ~768 px, čo sa na celoširočnom hero rozmazalo); `next/image`
  sizuje podľa `sizes`, hero `quality=90`.

**Ponaučenia:**

1. **Tri pôvodné Claude návrhy nie sú v publikovaných artefaktoch** — v účte je
   len 1 artefakt (finálny dizajn). Návrhy zostali v pôvodnej Claude konverzácii;
   z web sedenia sa k iným konverzáciám nedostaneme → dizajn dodať screenshotom.
2. **Next.js — priečinok s `_` prefixom = privátny (nie route).** Dočasná ukážková
   stránka musí mať názov bez podčiarkovníka (napr. `preview-article`).
3. **Featured obrázok: `medium_large` ≈ 768 px stačí na kartu, nie na celoširočný
   hero.** Brať `source_url` (plnú veľkosť), variantu dorieši `next/image` cez `sizes`.
4. **Lokálny náhľad — pozor na staré inštancie servera.** `rm -rf .next` počas
   bežiaceho `next start` = nekonzistentný build (CSS 404/500, stránka bez štýlov).
   Pred rebuildom ukončiť starý server; overiť CSS `HTTP 200`.
5. **Živý web / apertia / WP z cloud sedenia nevidno** (egress allowlist) — náhľady
   cez lokálny `next start` + screenshot z predinštalovaného Chromium (CDP);
   dizajnové referencie cez screenshoty od používateľa.

**Proces:** merge do `main` **len po výslovnom súhlase používateľa**. Záchranný
bod pred redizajnom: `87c06a7`.

**Súvisiace otvorené:** ak featured obrázky aj po oprave nie sú dosť ostré,
generovať v orchestrátori širšie obrázky (napr. ≥1536 px). Zoznam `/blog` možno
neskôr tiež zosvetliť (zatiaľ tmavý, zámerne).

## Fáza GO-LIVE — technicky DOKONČENÁ ✅ (júl 2026)

**Referencia spustená naostro na doméne.** Doména `digitalnapomoc.sk` teraz
smeruje na náš Next.js frontend, WordPress presťahovaný na skrytú subdoménu.
Web je **živý a funkčný**, ale **zámerne ešte skrytý pred Googlom** (`SITE_INDEXABLE`
vypnuté) — Google pozveme až po doladení (viď „Pred-Google checklist" nižšie).

**Výsledný stav (čo je naostro):**

- `https://www.digitalnapomoc.sk` → **frontend** (Railway), platné SSL.
- `https://digitalnapomoc.sk` (apex) → **presmeruje na `www`** (hostcreators, „Pripojiť URI" = Áno, zachová cestu).
- `https://wp.digitalnapomoc.sk` → **WordPress** (admin/obsah), **noindex**.
- Frontend číta obsah z `wp.` (`WP_URL`), orchestrátor publikuje na `wp.`.
- Webhook (`nexus-revalidate.php`) volá `https://www.digitalnapomoc.sk/api/revalidate`.
- `SITE_URL = https://www.digitalnapomoc.sk`; `SITE_INDEXABLE` **nenastavené** (web skrytý).

**Zvolená stratégia — „Cesta 2" (www ako hlavná, apex presmeruje na www):**
Railway pre custom domény vydáva **CNAME**, lenže apex (`digitalnapomoc.sk` bez
`www`) CNAME v klasickom DNS mať nemôže (potreboval by ALIAS/ANAME) a Railway
plán mal **limit 1 custom doména**. Preto je hlavná (canonical) adresa
**`www.digitalnapomoc.sk`** na Railway a **apex len presmeruje na `www`** cez
hostcreators (zadarmo, bez druhej custom domény). Canonical = `www`.

**Kroky, ako to prebehlo:**

*Fáza A (príprava, bez výpadku):*
1. hostcreators: subdoména **`wp`** → document root **`/digitalnapomoc.sk/web`**
   (ten istý WordPress ako `www`), PHP **8.3** (zhodne s hlavnou doménou).
2. SSL pre `wp.` — hosting ho vydal **automaticky** (wildcard/Let's Encrypt),
   žiadne manuálne tlačidlo. Overené: `Certifikát je platný` pre `wp.`.
3. Railway → frontend `ai-nexus-link` → Networking: pridaná custom doména
   **`www.digitalnapomoc.sk`** (port 8080). DNS ciele z Railway:
   `www` **CNAME → `24wicioh.up.railway.app`** + **TXT `_railway-verify.www`**.

*Fáza B (cutover):*
4. **Migrácia URL v obsahu `www` → `wp`** (aby po prepnutí nezmizli obrázky):
   spravené pluginom **Better Search Replace** (dry-run 76 buniek → ostro),
   `https://www.digitalnapomoc.sk` → `https://wp.digitalnapomoc.sk`. Zmenil aj
   `home`/`siteurl` → WP odteraz „býva" na `wp.`.
5. Railway: **`WP_URL` → `https://wp.digitalnapomoc.sk`** na frontende aj
   orchestrátori (deploy). Frontend tak nečíta „sám seba" po prepnutí DNS.
6. hostcreators DNS zóna: pridaný **`www` CNAME → `24wicioh.up.railway.app`**
   (konkrétny záznam **prebije wildcard** `*.digitalnapomoc.sk`) + **TXT
   `_railway-verify.www`**. `wp` ostáva cez wildcard na hostingu.
7. hostcreators: hlavná doména → **Presmerovanie → `https://www.digitalnapomoc.sk`**
   („Pripojiť URI k presmerovaniu" = Áno).
8. Webhook `nexus-revalidate.php`: URL host `ai-nexus-link-production.up.railway.app`
   → **`www.digitalnapomoc.sk`** (`REVALIDATE_SECRET` bez zmeny).
9. WP admin (`wp.`) → Nastavenia → Čítanie → **noindex** zapnuté.
10. Railway → frontend: **`SITE_URL = https://www.digitalnapomoc.sk`**.
    `SITE_INDEXABLE` **zámerne NEnastavené** (web ešte skrytý pred Googlom).

**Ponaučenia:**

1. **hostcreators účet je SFTP-only** — SSH pustí prihlásenie, ale odmietne shell
   aj `exec` (`shell request failed` / `exec request failed`). WP-CLI cez SSH teda
   nejde; hromadnú náhradu URL rob **pluginom Better Search Replace** vo wp-admin.
2. **Wildcard `*.digitalnapomoc.sk CNAME digitalnapomoc.sk`** — preto `www` aj `wp`
   fungovali „samé" (bez vlastného DNS). **Konkrétny záznam pre subdoménu prebije
   wildcard** — tak sme `www` presmerovali na Railway a `wp` nechali na hostingu.
3. **Headless sťahovanie WP na subdoménu = prepíš absolútne URL v obsahu.** Obrázky
   článkov mali napevno `www…/wp-content/…`; bez náhrady `www→wp` by po cutovere
   zmizli. Riešenie: search-replace v DB (`home`/`siteurl` + obsah).
4. **Railway custom doména = CNAME; apex CNAME je problém.** Bezpečná cesta je
   **www ako hlavná + apex redirect na www** („Cesta 2"). Šetrí aj limit custom domén.
5. **Nový článok sa neukázal hneď** = 5-min ISR cache + timing migrácie, nie chyba
   webhooku. Po tvrdom refreshi/uplynutí ISR nabehol. Netreba nič re-publikovať —
   existujúce články sa zobrazujú automaticky, webhook je len na *okamžitú* obnovu.

**Pred-Google checklist (než zapneme `SITE_INDEXABLE=true` + Search Console):**

- [ ] 🍪 Cookie lišta + zásady ochrany osobných údajov (GDPR — web zbiera leady)
- [ ] 🎨 Doladenie dizajnu
- [ ] ✍️ Rôznorodejší štýl článkov (úprava Writer promptu/agenta)
- [ ] 📄 Stránkovanie blogu (6 na stránku + „ďalšie")
- [ ] ➕ Ďalšie funkcie podľa plánu
- [ ] 🔎 Potom: `SITE_INDEXABLE=true` (Railway) + Google Search Console (`www`)

**Rollback (keby bolo treba):** `www` CNAME v DNS naspäť / apex doménu späť na
„Štandardné zobrazenie"; WP adresu späť opačnou náhradou `wp → www`.

## Fáza 4 — DOKONČENÁ ✅ (zhrnutie + changelog)

**Fáza 4 uzavretá** — postavili sme druhého agenta a plnú automatizáciu reťazca.

**Čo Fáza 4 priniesla:**

- **SEO/GEO základ na frontende** — metadata, Open Graph, canonical,
  `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD (Organization, WebSite,
  BlogPosting, BreadcrumbList, FAQPage). Parita s Rank Math / AIO SEO, na GEO
  ich prekonáva.
- **Druhý agent — SEO+GEO** (`seo_geo_agent.py`) rovnakým „lego" vzorom.
- **Automatizácia reťazca** (`run_pipeline.py`): Writer → SEO agent v jednom cron
  behu; cloud cron overený naostro (Po/St/Pi, `gemini-3.5-flash`, článok 819).
- **Predajný tón** Writera (články vedú k ponuke automatizácií).
- **Dolaďovanie obsahu:** sémantický `<time>`, zdieľací og:image, opravené
  odrážky (Tailwind reset), odstránenie `**markdown**` a stray pomlčiek pri
  zobrazení.
- **Dokumentácia:** `zdroje-pravdy.md`, `directus.md`, Railway ťahák v
  `navody.md`, roadmap vo `vizia.md`, minimalizmus v `CLAUDE.md`.

**Changelog (PR):** #6 SEO/GEO základ · #7 SEO+GEO agent · #8 breadcrumbs+FAQ +
model fix + docs · #9 odrážky · #10 koncová pomlčka · #11 čistenie obsahu
(`**`/pomlčky) · #12 reťazec `run_pipeline` · #13 docs (Railway/zdroje/Directus) ·
#14 roadmap · #15 go-live runbook.

**Stav:** 2 agenti (Writer + SEO/GEO) bežia 24/7 v reťazci; frontend má plné
SEO/GEO; web je zatiaľ **skrytý** (`SITE_INDEXABLE` nenastavené).

**Ďalšia fáza:** Spustenie referencie (go-live) — štartový dokument a runbook:
`docs/go-live.md`.

## Júl 2026 — Fáza 4: reťazec Writer → SEO+GEO agent (automatizácia)

**Cloud cron overený naostro:** Railway „Run now" na orchestrátorovi vytvoril
koncept (ID 816, téma „Chatbot…", `gemini-3.5-flash`) + zapísal `agent_logs`
success. Writer teda v cloude beží sám (cron Po/St/Pi 6:00 UTC).

**Reťazenie agentov (nové):**

- **`orchestrator/run_pipeline.py`** — jeden beh, dvaja agenti za sebou:
  Writer napíše koncept → SEO+GEO agent ho vylepší. **Deterministické** — SEO
  agent dostane presné ID, ktoré Writer vytvoril (žiadne „hádanie najnovšieho
  konceptu" ani preteky medzi dvomi cronmi).
- **`wp_writer_agent.py`** — `generate_and_post_article` teraz **vracia
  `post_id`** (na úspech), aby ho reťazec vedel odovzdať SEO agentovi.
- Ručné spúšťanie jednotlivých agentov ostáva.

**Overené (cloud sedenie):** `py_compile` + import `run_pipeline` OK (reťazec sa
poskladá, Writer vracia ID).

**Klikacia časť (Railway):** na cron worker-i zmeniť **Start Command** z
`python wp_writer_agent.py` na **`python run_pipeline.py`**. Žiadna nová služba.

## Júl 2026 — oprava: odrážky v článkoch (Tailwind reset)

Prvý článok publikovaný cez celý reťazec (Writer → SEO agent → človek) —
ID 811. Používateľ si všimol, že **zoznamy v článku nemajú guľôčky/čísla**.

**Príčina:** Tailwind v4 preflight resetuje `ul/ol` na `list-style: none` na
celom webe. V `.wp-article` sme značky nevrátili (hoci sme farbili `::marker`).

**Oprava:** `frontend/app/globals.css` — `.wp-article ul` → `disc`,
`.wp-article ol` → `decimal`. *Ponaučenie: Tailwind preflight vypína značky
zoznamov; pri obsahu z CMS treba `list-style` explicitne vrátiť.*

## Aktuálny stav Directus `agent_config` (potvrdené používateľom, júl 2026)

> Referencia — živý Directus z cloud sedenia nevidíme, preto zapisujeme sem.

| Agent (`agent_name`) | `is_active` | `text_provider` | `text_model` | `system_prompt` |
|---|---|---|---|---|
| `wp_writer` | ✅ | gemini | **`gemini-3.5-flash`** | predajný tón (viď `navody.md`) — **vložený** |
| `seo_geo` | ✅ | gemini | **`gemini-3.5-flash`** | — |

- **Funkčný text model = `gemini-3.5-flash`** (potvrdené naostro). Predvolený
  model v kóde (`wp_writer_agent.py` → `DEFAULT_TEXT_MODELS["gemini"]`) zosúladený
  na `gemini-3.5-flash` (predtým `gemini-2.5-flash`).

## Júl 2026 — Fáza 4 (krok 4b): breadcrumbs + FAQ schéma (náhrada SEO pluginu)

Cieľ: aby náš systém nahradil platený WP plugin (Rank Math / AIO SEO). Kľúč:
v **headless** architektúre plugin ani nemôže robiť svoju prácu (vkladá značky
do WP stránky, ktorú nikto nevidí) — SEO/GEO **musí** byť na frontende, a to je
presne, čo staviame.

**Urobené (`frontend/`):**

- **Breadcrumbs** — na stránke článku viditeľná omrvinková navigácia
  (Domov › Blog) + `BreadcrumbList` JSON-LD (Domov › Blog › článok).
- **FAQ schéma** — `FAQPage` JSON-LD na domovskej z existujúcej FAQ sekcie
  (`lib/content.ts` → `faqs`). Google z toho robí rich results.
- Generátory `breadcrumbSchema` a `faqSchema` v `lib/seo.ts`.

**Overené:** `lint` + `build` OK; v HTML domovskej potvrdené `FAQPage` so 4
otázkami. Breadcrumb schéma je na dynamickej stránke článku (naživo na Railway).

**Parita s Rank Math / AIO SEO — stav:** meta titulok/popis, OG/Twitter,
sitemap, robots/noindex, canonical, JSON-LD (Organization, WebSite, BlogPosting,
BreadcrumbList, FAQPage), alt texty, llms.txt + AI crawleri (GEO — tu sme
**pred** pluginmi). **Ešte na roadmape:** HowTo schéma (potrebuje kroky z
článku — práca pre agenta v2), presmerovania (301), 404 monitor. Zámerne
nerobíme „semafor" analýzu v editore (obsah píše AI, ladí agent).

## Júl 2026 — Fáza 4 (krok 4): SEO+GEO agent (MVP)

**Druhá „lego" kocka po Writerovi** — dôkaz, že sa agenti pridávajú vzorom, nie
prepisom. Modul `orchestrator/seo_geo_agent.py`.

**Ako pracuje (autopilot, rovnaký vzor ako Writer):**

1. Prečíta si config z Directusu — `nacitaj_config("seo_geo")` (poskytovateľ,
   model, prompt). Bez configu použije defaulty.
2. Nájde článok: podľa ID z príkazu, inak **najnovší koncept** (číta s
   prihlásením, `context=edit`, lebo koncepty nie sú verejné).
3. Nechá model (Z.ai/Kimi/Gemini/Claude) vrátiť **JSON** so SEO/GEO návrhmi:
   meta popis (150–160 zn.), focus keyword, max 3 interné odkazy, GEO tip.
4. **Bezpečne** zapíše len **meta popis do WP `excerpt`** (frontend ho renderuje
   ako `<meta description>`). **Status článku nemení — ostáva koncept.**
5. Kľúčové slovo, odkazy a GEO tip zapíše do `agent_logs` — rozhoduje človek.

**Znovupoužitie (ponytail):** WP prihlásenie aj volania modelov sa importujú z
`wp_writer_agent.py`, config/logy z `directus.py`. **Žiadny duplicitný kód,
žiadna nová závislosť.** Token `orchestrator-bot` (read `agent_config`, create
`agent_logs`) stačí; WP zápis cez application password.

**MVP rozsah (zámerne malý):** meta popis do `excerpt` + kľúčové slovo a odkazy
do logu. Neskôr: optimalizácia titulku, GEO „kľúčové fakty" blok, automatické
interné odkazy.

**Overené (v cloud sedení):** `py_compile` OK, import modulu OK (všetky
prepojenia sedia), jednotkové testy `parse_navrhy` (JSON obalený textom aj
code fence, aj nezmyselná odpoveď → bezpečné None) a `seo_prompt`. **Naživo
(WP/Directus/model) treba otestovať na Railway alebo lokálne** — pieskovisko na
tie služby nedosiahne.

**Podkroky, čo ešte ostávajú (klikacia časť):**

- **Directus:** pridať riadok `agent_config` s `agent_name = seo_geo`
  (`is_active`, `text_provider`, `text_model`, príp. `system_prompt`).
- **Railway:** druhý cron worker (Start Command `python seo_geo_agent.py`),
  ideálne po Writerovi.

**Smerovanie obsahu (produktová línia):** blog je nástroj na získavanie
klientov — články majú informovať a zároveň prirodzene viesť k **našej ponuke
automatizácií** (hotové riešenie + integrácia na nástroje klienta: auto-odpoveď
na e-mail, rezervácie, objednávky). Rieši sa **predajným `system_prompt`**
Writera — nastavuje sa **ručne** v Directuse (recept v `docs/navody.md`).
*(Setup skript sme zámerne zrušili — kvôli bezpečnosti config nastavujeme ručne,
bez admin tokenu v `.env`.)*

**Roadmapa SEO+GEO agenta (na neskôr):**

- **v2 — automatické prelinkovanie:** agent svoje návrhy interných odkazov sám
  vloží do tela článku (bezpečný kotviaci text), nielen do logu.
- **HowTo štruktúrované dáta** pre návodové články (dnes `BlogPosting`) — lepšia
  citovateľnosť v AI vyhľadávačoch.

## Júl 2026 — Fáza 4 (krok 2): SEO/GEO základ na frontende

**Kontext:** Fázu 4 sme začali smerom „ďalší agent lego vzorom" — konkrétne
**SEO + GEO agent** (GEO = Generative Engine Optimization = optimalizácia pre
AI vyhľadávače ako ChatGPT, Perplexity, Google AI Overviews). Keďže sme
**headless** (Google aj AI vidia len Next.js frontend, nie WordPress), meta
značky a štruktúrované dáta patria na **frontend** — Yoast/Rank Math vo WP by
boli zbytočné (nikto ich nevidí). Preto prvý krok = SEO/GEO **základ na
frontende**, až potom samotný agent.

**Audit pred prácou:**

- **PageSpeed (pagespeed.web.dev)** na Railway web: mobil 98/95/100/100,
  desktop 100/95/100/100 (Výkonnosť/Dostupnosť/Osvedčené postupy/SEO),
  „Agentské prehliadanie" 2/2. Východisko je špičkové — headless Next.js je
  rýchlejší ako klasické WP témy (aj GeneratePress), lebo na frontende WP vôbec
  nebeží.
- **Audit kódu** ukázal, čo chýbalo: JSON-LD štruktúrované dáta, Open Graph,
  canonical, `sitemap.xml`, `robots.txt`, `llms.txt`. („SEO 100" v Lighthouse
  je len základná hygiena — schema/OG/GEO nemeria.)
- Poznámka: `geo-seo-claude` (github.com/zubair-trabzada/geo-seo-claude) **nie
  je WP plugin**, ale Claude Code **skill na GEO audit**. Jeho princípy sme
  prebrali priamo do frontendu (schema, llms.txt, povolenie AI robotov).

**Urobené (`frontend/`):**

- **`lib/seo.ts`** — centrálna SEO/GEO konfigurácia na jednom mieste (aby sa
  dala preniesť na ďalšieho klienta): `SITE_URL`, `SITE_NAME`,
  `SITE_DESCRIPTION`, prepínač `SITE_INDEXABLE`, zoznam AI crawlerov,
  generátory JSON-LD (`organizationSchema`, `websiteSchema`, `articleSchema`).
- **`app/robots.ts`** — `/robots.txt`. Kým `SITE_INDEXABLE` != `true`, zakáže
  všetko (web skrytý). Po zapnutí povolí bežných robotov aj AI crawlerov (GEO)
  a odkáže na sitemap.
- **`app/sitemap.ts`** — `/sitemap.xml` zo statických stránok + všetkých WP
  článkov (odľahčená funkcia `fetchAllPostRefs` v `lib/wp.ts`). Pri výpadku WP
  vráti aspoň statické stránky.
- **`app/llms.txt/route.ts`** — `/llms.txt` (štandard z llmstxt.org): popis
  webu + zoznam článkov v Markdown podobe pre AI modely.
- **`components/json-ld.tsx`** — znovupoužiteľný komponent na vloženie JSON-LD.
- **`layout.tsx`** — `metadataBase`, šablóna titulku (`%s – digitalnapomoc.sk`),
  predvolené Open Graph + Twitter Card, prepínač `robots` (noindex kým
  nespustíme).
- **`app/page.tsx`** — canonical `/` + JSON-LD Organization & WebSite.
- **`app/blog/[slug]/page.tsx`** — bohaté meta (OG typu `article` s dátumami,
  Twitter, canonical) + `BlogPosting` JSON-LD.
- **`app/blog/page.tsx`** — titulok „Blog" (šablóna dopĺňa zvyšok) + canonical.
- **`lib/wp.ts`** — pridané ISO dátumy (`dateISO`, `modifiedISO`) pre schema a
  sitemap; `_fields` rozšírené o `modified`.

**Overené:** `npm run lint` čistý, `npm run build` prešiel (TypeScript OK).
V prerenderovanom HTML potvrdené: `noindex, nofollow` (web skrytý), JSON-LD
Organization+WebSite, Open Graph aj canonical. `robots.txt` = `Disallow: /`.

**Ponaučenia:**

1. **Headless = SEO patrí na frontend, nie do WP.** Google/AI vidia len
   Next.js. WP SEO pluginy sú v tejto architektúre zbytočné.
2. **„SEO 100" v Lighthouse ≠ hotovo.** Test kontroluje len základnú hygienu;
   štruktúrované dáta, Open Graph ani GEO nemeria.
3. **Web sa v cloud sedení nedá načítať** (sieťová politika blokuje Railway aj
   Directus) — audit sme spravili z kódu; živý PageSpeed spustil používateľ.
   Preto majú `sitemap.ts` a `llms.txt` fallback pri nedostupnom WP.

**Na doriešenie (klikacia časť — Railway Variables):**

- **`SITE_URL`** — verejná adresa frontendu. Teraz default = Railway URL. Pri
  prepnutí domény nastaviť `https://digitalnapomoc.sk`.
- **`SITE_INDEXABLE`** — rozhodnutie na spustenie. `true` = web sa smie
  indexovať (a povolia sa AI roboty). Kým nie je nastavené, web je **skrytý**
  (noindex) — súlad s plánom „spustiť až po doméne". ⚠️ Pozor: pri `noindex`
  Lighthouse zníži SEO skóre (hlási zámerný noindex) — je to očakávané, skóre
  vyskočí späť na 100 pri spustení.

**Ďalší krok (krok 3):** rýchlosť + sémantika (rozmery vnútro-článkových
obrázkov = CLS, dorovnať Dostupnosť 95, `<nav>`/`<time>`/`<article>`). Potom
krok 4: SEO+GEO agent do orchestrátora + SEO monitor (automatické meranie cez
PageSpeed Insights API).

**Nápady na neskôr (vizuálne doladenie — cieľ: expertná vizuálna forma):**

- **Maskot značky** z fialového robota z článkových obrázkov: spraviť jeden
  znovupoužiteľný priesvitný/vektorový maskot, ktorý vie jemne svietiť aj
  „zamávať" (CSS/Lottie animácia), umiestnený zámerne (hero, chat bublina) —
  **nie** zapekať efekt do každého AI obrázka (to je krehké a nekonzistentné).
  Sadne aj do budúceho chatbota a do „lego" znovupoužiteľnosti. (Cesta C.)
- **Jemné efekty na článkových obrázkoch** (CSS, nedeštruktívne): pomalé
  „dýchanie"/žiara alebo zoom pri prejdení myšou — celý obrázok naraz. (Cesta A.)
- Poznámka: dôvod, prečo „svieti len robot" nejde automaticky — AI obrázok je
  plochý súbor bez vrstiev; časť sa nedá adresovať bez vystrihnutia.
- Celkový cieľ: postupne doladiť web do **expertnej** vizuálnej úrovne.

## Júl 2026 — Fáza 3: agent v Directuse, prepínanie modelov, obmedzený token

**Urobené:**

- **`agent_config` + `agent_logs` v Directuse** — agenta (model, poskytovateľ,
  témy, prompt, draft/publish) nastavuješ **klikaním**; každý beh sa zaloguje.
- **Orchestrátor prepojený s Directusom** — `directus.py` (`nacitaj_config`
  číta config, `zapis_log` píše logy). `wp_writer_agent.py` berie nastavenia
  z configu; bez zadanej témy vyberie **náhodnú** zo `topics`.
- **Prepínanie poskytovateľa textu** — pole `text_provider`: Z.ai / Kimi
  (Moonshot) / Google Gemini / Anthropic Claude. Predvolené modely
  per-poskytovateľ; nové kľúče `MOONSHOT_API_KEY`, `ANTHROPIC_API_KEY`,
  Gemini kľúč sa používa aj na text.
- **Obmedzený Directus token** — politika „Orchestrátor" (`agent_config` = Read,
  `agent_logs` = Create), rola `Orchestrátor`, používateľ `orchestrator-bot`.
  Admin token už orchestrátor nepoužíva (zásada least privilege).
- **`requirements.txt`** pre orchestrátor; **`docs/vizia.md`** (vízia platformy,
  viac agentov, model dodania — SaaS).
- **Orchestrátor nasadený na Railway ako cron worker** — nová služba v projekte
  „ravishing-gratitude" z GitHub repa, **Root Directory `orchestrator`**, branch
  `main`, Start Command `python wp_writer_agent.py`, cron **`0 6 * * 1,3,5`**
  (Po/St/Pi 6:00 UTC ≈ 7–8 ráno u nás). Premenné v Railway Variables vrátane
  **obmedzeného** `DIRECTUS_TOKEN`. Otestované naostro — beh v cloude napísal
  článok „Chatbot pre zákaznícku podporu malej firmy" + obrázky → WP draft
  (ID 802) → log `success`. **Agent beží 24/7 aj pri vypnutom PC.** Ručné
  spustenie ostáva (`python wp_writer_agent.py`, alebo „Run now" v Railway).

**Ponaučenia:**

1. **Directus pole s „Required" sa nedá nechať prázdne** — `text_model` treba
   vždy vyplniť konkrétnym modelom pre daného poskytovateľa (Gemini
   `gemini-3.5-flash`, Z.ai `glm-4.5-flash`, Claude `claude-sonnet-5`, Kimi
   jeho model). *Ponaučenie: config pole = vždy konkrétna hodnota.*
2. **Pri prepnutí poskytovateľa treba zmeniť aj `text_model`** — inak model
   jedného poskytovateľa ide do API druhého (404/chyba).

**Stav:** Fáza 3 hotová — agent píše články 24/7 v cloude (Railway), riadený
klikaním v Directuse, s bezpečným obmedzeným tokenom.

**Ďalší krok (Fáza 4):** ďalší agenti rovnakým vzorom (SEO, sociálne siete,
dizajn — config + modul + logy); WooCommerce (Store API); produktizácia
(multi-tenant SaaS). Zvážiť pomôcku `ponytail` na čistejší kód.

**Na zaradenie (TODO):**

- **Skrytie WordPressu pre verejnosť** — kým nie sme pripravení spustiť, dať WP
  na digitalnapomoc.sk do režimu údržby / „coming soon" (heslom chránený),
  aby slúžil len ako oddelený neverejný systém (obsah/admin). Frontend na
  Railway je aj tak skrytý (bez odkazov, noindex).
- **Prepnutie domény (pred spustením):** digitalnapomoc.sk → Next.js frontend
  (Railway); WordPress presunúť na `wp.digitalnapomoc.sk` (skrytý, noindex,
  len login), zmeniť `WP_URL`. Neskôr Cloudflare pred frontend (CDN, rýchlosť,
  bezpečnosť).

## Júl 2026 — dolaďovanie blogu, obrázky, dokumentácia

**Urobené po Fáze 1+2 (17. 7. 2026):**

- **Obrázky článkov v blogových kartách** — karty na domovskej stránke a `/blog`
  ťahajú featured image z WP médií cez `next/image` (WebP/AVIF, lazy loading,
  gradient ako fallback). WP klient posiela `_embed=wp:featuredmedia`.
- **Writer agent: obrázky cez Google Gemini** — Z.ai CogView vyžadoval platený
  kredit (chyba 1113), preto obrázky teraz generuje Gemini
  (`gemini-3.1-flash-image` → `gemini-2.5-flash-image`), CogView ako záloha.
  Kľúč v projekte AI NEXUS LINK (Google Cloud, $300 trial, billing Tier 1).
- **`fix_post_images.py`** — nástroj na výmenu starých (meniacich sa picsum)
  obrázkov v existujúcich článkoch za trvalé tematické.
- **Dokumentácia** — pribudli `docs/wayland-ferrox.md` (rozlíšenie od Wayland
  app Ferrox Labs) a `docs/prikazy.md` (terminálový ťahák na učenie).

**Problémy a ponaučenia:**

1. **Zmena na `main` sa nenasadila** — Railway preskakuje commity, ktoré sa
   nedotknú Root Directory `frontend/`. Merge PR skončil ako „Skipped".
   → Riešenie: drobná zmena v `frontend/` (napr. komentár v README) spustí deploy.
   *Ponaučenie: pri Root Directory sa nasadia len zmeny v tom priečinku.*
2. **AI v obrázkoch komolí text** — do obrázkového promptu sa dostávala celá
   dlhá téma článku, model kreslil „infografiky" so zlou slovenčinou.
   → Prompt sa oreže na krátky námet (prvá veta, max 90 znakov) + dôrazný
   zákaz textu. *Ponaučenie: obrazové modely nevedia písať — žiadny text do obrázkov.*

**Krok 0 pre Fázu 3 (17. 7. 2026):**

- Prepojený **GitHub účet s Claude Code** (Claude GitHub App → repo `ai-nexus-link`).
  Nové sedenia budú pushovat priamo — bez git bundle. Existujúce sedenie prístup
  nezíska (platí pre nové sedenia).

## Júl 2026 — Fáza 1 + 2: nový frontend, CRM, agenti (dokončené)

**Postavené za jeden veľký ťah (14.–16. 7. 2026):**

- Nová landing page digitalnapomoc.sk podľa dizajnu z Claude Design
  (tmavý glassmorphism, hero variant B) — nahradila prototyp vo
  `frontend/`. Nasadená na Railway, po merge PR #1 sa nasadzuje z `main`.
- Blog: domovská stránka (3 najnovšie), `/blog` (všetky),
  `/blog/[slug]` (celý článok v dizajne webu). WordPress je odteraz
  čisto headless — návštevník ho nikdy neuvidí.
- Formuláre → `POST /api/lead` → Directus `client_leads`
  (politika „create only" pre používateľa frontend-bot).
- Webhook `POST /api/revalidate` + mu-plugin vo WP: publikovaný článok
  je na stránke do ~10 sekúnd.
- Wayland (wp_writer_agent.py) prerobený: SEO titulok od modelu, téma
  ako CLI argument, obrázky generované k téme a natrvalo uložené do WP
  médií (hero + inline ilustrácia, featured image). `fix_post_images.py`
  na opravu starších článkov.
- Dokumentácia: CLAUDE.md (kontext pre AI sedenia) + docs/.

**Problémy, ktoré sme vyriešili (a ich ponaučenia):**

1. **Meniace sa obrázky v článkoch** — starý prompt vkladal
   `picsum.photos/?random` (náhodná fotka pri každom načítaní).
   → Odstránené; obrázky sa generujú k téme a ukladajú ako statické
   súbory do médií. *Ponaučenie: obrázok v článku = trvalý súbor
   v médiách, nikdy externá „živá" adresa.*
2. **Leady „mizli"** — formulár hlásil úspech, Directus nič.
   Príčina: v Railway bola `DIRECTUS_URL` nastavená na celú adresu
   prihlasovacej stránky (`…/admin/login?...`) — server „zapisoval"
   do prihlasovacej stránky, ktorá vracala 200 OK.
   → `DIRECTUS_URL` musí byť len základná doména.
   *Ponaučenie: do URL premenných len základ adresy; overovať zápis
   pohľadom do dát, nie odpoveďou API.*
3. **FORBIDDEN na client_leads v Directus admine** — vypršané
   prihlásenie (SESSION_EXPIRED), nie chyba oprávnení.
   *Ponaučenie: najprv sa odhlásiť/prihlásiť, potom debugovať.*
4. **Z.ai obrázky: error 1211 (model neexistuje) a 1113 (kredit)**
   → agent skúša viac názvov modelov; obrázky presunuté na Google
   Gemini (kľúč v projekte AI NEXUS LINK, billing Tier 1, $300 trial).
   Z.ai CogView zostal ako záloha. Denná kvóta free úrovne sa resetuje
   ~9:00 nášho času; billing má rozpočtový alarm.
5. **Bundle workflow** — webové Claude Code sedenie nemalo push prístup
   k repozitáru, zmeny putovali cez git bundle → lokálny fetch → push.
   *TODO: pridať repozitár do Claude Code prostredia (GitHub prístup),
   bundle tanec odpadne.*

**Stav na konci:** celý cyklus funguje naostro — Wayland napíše článok
s obrázkami → koncept vo WP → schválenie → webhook → stránka; leady
z formulárov padajú do Directusu. PR #1 zmergovaný do `main`.

**Ďalší krok:** Fáza 3 — orchestrátor na Railway, konfigurácia agentov
v `agent_config` (výber modelu/poskytovateľa/autora klikaním), SEO agent.
