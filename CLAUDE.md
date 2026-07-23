# CLAUDE.md — AI Nexus Link

Kontext pre Claude Code sedenia v tomto repozitári. Jazyk komunikácie aj obsahu: **slovenčina**.

## Čo je AI Nexus Link

Modulárna platforma na „headless" modernizáciu WordPress webov + AI automatizáciu.
Prvý referenčný web: **digitalnapomoc.sk**. Vízia: starý WP zostáva klientovi ako
admin/obsah, my dodávame moderný Next.js frontend, CRM vrstvu v Directuse a AI
agentov (tvorba článkov, SEO), neskôr aj WooCommerce.

## Architektúra — každý systém má jednu rolu

| Vrstva | Technológia | Rola |
|---|---|---|
| Obsah | WordPress (www.digitalnapomoc.sk), headless | Články, stránky, neskôr WooCommerce produkty — klientov známy admin |
| Frontend | Next.js 16 + Tailwind v4 (`frontend/`), Railway | Nový dizajn; číta WP REST + zapisuje leady do Directusu |
| Systémové dáta | Directus (Railway) | `client_leads` (CRM), `agent_config`, `agent_logs` — **nikdy obsah webu** |
| Agenti | Python orchestrátor (`orchestrator/`), Railway | Generujú články (Z.ai GLM) → WP ako draft; config/logy v Directuse |

Dátové toky: návštevník → Next.js → (číta) WP / (zapisuje) Directus.
Agenti → (čítajú config z) Directus → (publikujú do) WP → frontend zobrazí.

## Stav projektu (júl 2026)

Hotové:
- ✅ Fáza 1 — nový frontend (tmavý glassmorphism dizajn z Claude Design, hero variant B,
  responzívny); blog číta 3 najnovšie WP články cez `frontend/lib/wp.ts` (ISR 5 min,
  fallback obsah v `lib/content.ts`); `POST /api/revalidate?secret=…` na okamžitú obnovu
- ✅ Fáza 2 — `POST /api/lead`: validácia, honeypot pole `website`, rate limit 5/10 min/IP,
  zápis do Directus `client_leads`; oba formuláre (hero + kontakt) prepojené so stavmi
- ✅ Nasadené na Railway: https://ai-nexus-link-production.up.railway.app
  (service z GitHub repa, branch `new-frontend`, Root Directory `frontend`)
- ✅ Directus: polia `name, email, phone, message, source` v `client_leads`;
  politika „Frontend Web — create leads" (iba Create) → rola `Frontend Web` → user `frontend-bot` (token v Railway)

Ďalšie na rade:
- ✅ Krok 5 — WP mu-plugin webhook (`nexus-revalidate.php` v `wp-content/mu-plugins/` na hostingu) — publikovaný/upravený článok je na stránke do ~10 s
- ✅ Krok 6 — PR #1 zmergovaný do `main`; Railway nasadzuje z `main`
- ✅ Wayland: obrázky k téme cez Google Gemini (fallback Z.ai CogView), natrvalo vo WP médiách; téma ako CLI argument; `fix_post_images.py` na opravu starších článkov
- [ ] Fáza 3 — orchestrátor ako Railway worker: cron + témy z `agent_config`, logy do `agent_logs`; SEO agent; publikuje ako draft (človek schvaľuje vo WP)
- [ ] Fáza 4 — WooCommerce cez Store API (najprv embednutý checkout)
- [ ] Fáza 5 — produktizácia: šablóna frontend+napojenie pre ďalších klientov
- [ ] Neskôr: podstránky `/sluzby/[slug]`; fotka tímu (`frontend/public/team.jpg` + `components/about.tsx`); reálny telefón v pätičke; vlastná obmedzená rola pre orchestrátor token (teraz admin); doména digitalnapomoc.sk → frontend (WP na subdoménu)

Podrobná dokumentácia: `docs/vizia.md` (kam to celé smeruje, hodnota, model
dodania — SaaS), `docs/architektura.md` (ako systém funguje),
`docs/navody.md` (recepty na bežné úkony), `docs/dennik.md` (história a vyriešené problémy), `docs/prikazy.md`
(terminálový ťahák), `docs/wayland-ferrox.md` (poznámka k Wayland app),
`docs/zdroje-pravdy.md` (kde čo žije a kam ukladať — tri zdroje pravdy).

## Príkazy

### Frontend (`frontend/`)
```bash
npm run dev      # vývojový server
npm run build    # produkčný build
npm run lint     # ESLint
```
Pozor: `frontend/AGENTS.md` — táto verzia Next.js má breaking changes; pred písaním
Next.js kódu čítaj `node_modules/next/dist/docs/`.

### Orchestrátor (`orchestrator/`)
```bash
source venv/bin/activate
python main.py               # test Directus spojenia
python wp_writer_agent.py "Téma"        # článok + obrázky → WP koncept
python seo_geo_agent.py [ID]            # SEO/GEO vylepšenie konceptu (meta popis → WP)
python run_pipeline.py                  # reťazec Writer → SEO+GEO agent (Start Command cronu)
python fix_post_images.py <ID> "Téma"   # oprava obrázkov v starom článku
```

## Premenné prostredia

| Premenná | Kde | Účel |
|---|---|---|
| `WP_URL` | frontend (Railway), orchestrátor `.env` | WordPress URL |
| `DIRECTUS_URL`, `DIRECTUS_TOKEN` | frontend (Railway), orchestrátor `.env` | Directus; frontend používa token `frontend-bot` (iba create na `client_leads`) |
| `REVALIDATE_SECRET` | frontend (Railway) + WP mu-plugin | tajný kľúč pre `/api/revalidate` |
| `SITE_URL` | frontend (Railway), voliteľné | verejná adresa frontendu (nie WP); default = Railway URL, pri doméne `https://digitalnapomoc.sk` |
| `SITE_INDEXABLE` | frontend (Railway), voliteľné | `true` = indexovať web + povoliť AI roboty; inak skrytý (noindex) |
| `WP_USER`, `WP_APP_PASSWORD` | orchestrátor `.env` | WP publikovanie (application password) |
| `ZAI_API_KEY` | orchestrátor `.env` | Z.ai GLM API |
| `GEMINI_API_KEY` | orchestrátor `.env` | Google Gemini API (generovanie obrázkov k článkom) |

## Konvencie a bezpečnosť

- Obsah a texty: slovenčina.
- Tajomstvá výhradne v env premenných (Railway Variables / `.env`), nikdy v kóde.
- Každý systém má vlastný token s minimálnymi právami (zásada least privilege).
- Leady a logy nikdy do WP; obsah webu nikdy do Directusu — inak sa systém nedá replikovať.
- WP REST API: verejne len čítanie publikovaného obsahu; zápis cez application passwords.
- Do `main` len cez vetvu + pull request. **Zlúčenie (merge) PR do `main` a iné
  dôležité/nezvratné kroky rob až po mojom výslovnom súhlase — VŽDY sa najprv opýtaj
  a počkaj na moje „áno".** (Vytvoriť vetvu, commit, push do vetvy a otvoriť PR môžeš.)

## Minimalizmus kódu (inšpirované `ponytail`)

Najlepší kód je ten, čo netreba napísať. Pred pridaním kódu prejdi „rebrík":
1) Treba to vôbec existovať (YAGNI)? 2) Je to už v kóde (znovupoužiť)?
3) Vie to štandardná knižnica? 4) Je to natívna funkcia platformy (napr.
Next.js konvencie ako `robots.ts`, `sitemap.ts`)? 5) Máme už závislosť, čo to
rieši? 6) Stačí jeden riadok? 7) Až potom stavaj — minimálne životaschopné
riešenie. Novú závislosť pridaj, len keď nič z vyššieho nestačí. **Nikdy**
neškrtaj na úkor validácie, bezpečnosti, ošetrenia chýb a prístupnosti.
