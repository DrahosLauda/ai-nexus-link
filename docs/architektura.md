# Architektúra AI Nexus Link

> Ako celý systém funguje a prečo je poskladaný práve takto.
> Stav: júl 2026, po dokončení Fázy 1 + 2.

## Veľký obraz

AI Nexus Link je platforma na „headless" modernizáciu WordPress webov
s AI automatizáciou. Prvý referenčný web: **digitalnapomoc.sk**.

Základná myšlienka: klientovi zostáva známy WordPress admin na obsah,
návštevník ale vidí moderný Next.js frontend — a AI agenti pomáhajú
obsah tvoriť.

```
Wayland agent ──► WordPress (koncept) ──► človek schváli/publikuje
(GLM text +                                      │
 Gemini obrázky)                                 ▼ webhook
                                          Next.js frontend ◄── návštevník
                                                 │
                                                 ▼ formulár
                                          Directus (client_leads)
```

## Vrstvy a ich role

| Vrstva | Technológia | Rola | Zásada |
|---|---|---|---|
| Obsah | WordPress na www.digitalnapomoc.sk | Články (neskôr WooCommerce). Headless — návštevník ho nikdy nevidí | Obsah NIKDY do Directusu |
| Frontend | Next.js 16 + Tailwind v4 (`frontend/`), Railway | Dizajn, blog z WP, formuláre | Nasadzuje sa z vetvy `main` |
| Systémové dáta | Directus (Railway) | `client_leads` (CRM), `agent_config`, `agent_logs` | Leady/logy NIKDY do WP |
| Agenti | Python (`orchestrator/`), zatiaľ lokálne | Píšu články, generujú obrázky | Publikujú len ako koncept — človek schvaľuje |

## Dátové toky

1. **Obsah:** Wayland (`wp_writer_agent.py`) → Z.ai GLM napíše slovenský
   článok + Google Gemini vygeneruje 2 tematické obrázky → obrázky sa
   natrvalo uložia do WP Knižnice médií → článok vznikne ako **koncept**
   → človek skontroluje a publikuje vo wp-admin.
2. **Zobrazenie:** frontend číta WP REST API (`frontend/lib/wp.ts`),
   domovská stránka 3 najnovšie články, `/blog` všetky, `/blog/[slug]`
   celý článok v dizajne webu. Cache: ISR 5 minút.
3. **Okamžitá obnova:** WP mu-plugin (`nexus-revalidate.php` v
   `wp-content/mu-plugins/` na hostingu) pri publikovaní/úprave článku
   zavolá `POST /api/revalidate?secret=…` → frontend zneplatní cache
   `/`, `/blog` aj `/blog/[slug]` → zmena je vonku do ~10 sekúnd.
4. **Leady:** formuláre (hero + kontakt) → `POST /api/lead` → validácia,
   honeypot, rate limit → zápis do Directus `client_leads`
   (`source` rozlišuje formulár: `hero-callback` / `kontakt-cta`).

## Kde čo beží

| Čo | Kde | Poznámka |
|---|---|---|
| Frontend | Railway, projekt „ravishing-gratitude", služba `ai-nexus-link` | https://ai-nexus-link-production.up.railway.app — nasadzuje sa automaticky z GitHub `main`, Root Directory `frontend` |
| Directus | Railway | https://directus-production-04b1.up.railway.app |
| WordPress | klasický webhosting | www.digitalnapomoc.sk (súbory cez FTP/správcu súborov) |
| Orchestrátor | lokálne (VS Code, `venv`) | presun na Railway = Fáza 3 |

## Premenné prostredia

| Premenná | Kde | Účel |
|---|---|---|
| `WP_URL` | Railway (frontend), `orchestrator/.env` | adresa WordPressu |
| `DIRECTUS_URL` | Railway (frontend), `orchestrator/.env` | ⚠️ len základná adresa, bez `/admin/...` |
| `DIRECTUS_TOKEN` | Railway (frontend) | token používateľa `frontend-bot` — smie IBA vytvárať leady |
| `DIRECTUS_TOKEN` | `orchestrator/.env` | admin token (TODO Fáza 3: vlastná obmedzená rola) |
| `REVALIDATE_SECRET` | Railway (frontend) + vo WP mu-plugine | tajný kľúč webhoooku |
| `WP_USER`, `WP_APP_PASSWORD` | `orchestrator/.env` | WP application password na publikovanie konceptov |
| `ZAI_API_KEY` | `orchestrator/.env` | Z.ai GLM — text článkov |
| `GEMINI_API_KEY` | `orchestrator/.env` | Google Gemini — obrázky (kľúč projektu AI NEXUS LINK, Tier 1) |
| `GEMINI_IMAGE_MODEL` | `orchestrator/.env` (voliteľné) | vynútenie konkrétneho obrazového modelu |

## Bezpečnostné zásady

- Tajomstvá len v env premenných (Railway Variables / `.env`), nikdy v kóde.
- Každý systém vlastný kľúč s minimálnymi právami (`frontend-bot` v
  Directuse: politika „Frontend Web — create leads", iba Create).
- WP REST: verejné je len čítanie publikovaného obsahu; zápis cez
  application password.
- Agenti publikujú výhradne koncepty — publikuje človek.

## Ďalšie fázy (plán)

- **Fáza 3:** orchestrátor ako Railway worker; konfigurácia agentov
  (poskytovateľ/model/témy/autor) v Directus `agent_config`; logy do
  `agent_logs`; SEO agent.
- **Fáza 4:** WooCommerce cez Store API.
- **Fáza 5:** produktizácia — šablóna pre ďalších klientov.
- Doména: digitalnapomoc.sk → frontend; WordPress presunúť na subdoménu
  (napr. wp.digitalnapomoc.sk) a upraviť `WP_URL`.
