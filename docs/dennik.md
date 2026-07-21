# Denník projektu

> Čo sa kedy urobilo, čo sa pokazilo a ako sa to vyriešilo.
> Nové záznamy pridávajte navrch.

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
