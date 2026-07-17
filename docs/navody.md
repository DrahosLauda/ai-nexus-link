# Návody — kuchárska kniha AI Nexus Link

> Recepty na bežné úkony. Príkazy sa púšťajú vo VS Code termináli
> v priečinku `ai-nexus-link` (alebo ich povedzte Claudovi ľudskou rečou).

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
