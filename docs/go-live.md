# Go-live — spustenie referencie (doména digitalnapomoc.sk)

> Cieľ: `digitalnapomoc.sk` (+ `www`) → náš **Next.js frontend** (Railway),
> WordPress presunúť na skrytú **`wp.digitalnapomoc.sk`** (noindex).
> Prostredie: doména + WP na **hostcreators.sk** (panel **WebAdmin**), frontend
> na **Railway**.

## Dôležité zásady

- **Kód meniť netreba** — všetko riadia env premenné (`SITE_URL`,
  `SITE_INDEXABLE`, `WP_URL`).
- **Poradie:** kroky 1–3 sú **bezpečná príprava** (nič nerozbijú, WP beží ďalej
  na `www`). Kroky 4–6 sú **cutover** — krátky výpadok, rob **mimo špičky**.
- **Rollback:** keď niečo zlyhá, DNS vieš vrátiť späť (apex/www naspäť na WP).
  Preto DNS prepíname až v cutover fáze.
- Hlavná adresa = **`digitalnapomoc.sk`** (apex); `www` smerujeme tiež na
  frontend (canonical ostáva apex).

## Fáza A — príprava (bezpečné, WP stále beží na www)

1. **hostcreators: subdoména `wp.digitalnapomoc.sk`**
   WebAdmin → Webhosting → **Subdomény** → vytvor `wp` → nasmeruj na priečinok,
   kde je WordPress (rovnaký ako doteraz `www`). *(Návod: hostcreators pomoc →
   Webhosting → Vytvorenie subdomény.)*
2. **hostcreators: SSL pre `wp.`**
   WebAdmin → **SSL** → zabezpeč subdoménu `wp.digitalnapomoc.sk` (Let's Encrypt).
3. **Railway: pridaj custom domény na frontend**
   Railway → služba **`ai-nexus-link`** (frontend) → Settings → **Networking /
   Domains** → **Add Custom Domain** → pridaj `digitalnapomoc.sk` aj
   `www.digitalnapomoc.sk`. Railway ukáže **presné DNS záznamy** (CNAME pre
   `www`, pre apex A záznam / ALIAS podľa Railway) — **zapíš si ich.**

## Fáza B — cutover (koordinovane, krátke okno)

4. **WordPress: zmeň adresu na `https://wp.digitalnapomoc.sk`**
   WP admin → Nastavenia → **Všeobecné** → *WordPress Address (URL)* aj
   *Site Address (URL)* → `https://wp.digitalnapomoc.sk` → Ulož.
   ⚠️ Over, že sa vieš prihlásiť do `wp.digitalnapomoc.sk/wp-admin`.
5. **hostcreators DNS zóna** (domény → detail domény → DNS):
   - `@` (apex `digitalnapomoc.sk`) → na **Railway** (podľa hodnôt z kroku 3).
   - `www` → na **Railway** (podľa hodnôt z kroku 3).
   - `wp` → ostáva na **hostcreators** (WP server) — z kroku 1.
6. Počkaj na **DNS propagáciu** (min. až hodiny) a na to, kým **Railway vydá SSL**
   pre `digitalnapomoc.sk`.

## Fáza C — env premenné + webhook

7. **Railway → frontend `ai-nexus-link` → Variables:**
   - `WP_URL` = `https://wp.digitalnapomoc.sk`
   - `SITE_URL` = `https://digitalnapomoc.sk`
   - `SITE_INDEXABLE` = `true`
   → **Deploy** (fialové tlačidlo).
8. **Railway → orchestrátor → Variables:**
   - `WP_URL` = `https://wp.digitalnapomoc.sk` (aby agenti publikovali na nové WP)
   → **Deploy**.
9. **WP mu-plugin `nexus-revalidate.php`** (na hostingu v `wp-content/mu-plugins/`):
   URL webhooku zmeň na `https://digitalnapomoc.sk/api/revalidate`
   (`REVALIDATE_SECRET` ostáva rovnaký).

## Fáza D — skrytie WP + overenie

10. **WP noindex:** WP admin → Nastavenia → **Čítanie** → zapni „Odrádzať
    vyhľadávače od indexovania". *(Voliteľne heslo / „coming soon" pre
    neprihlásených.)*
11. **Overenie end-to-end:**
    - `https://digitalnapomoc.sk` beží (frontend, platné SSL, **indexovateľný**).
    - `/blog` číta články z `wp.digitalnapomoc.sk`.
    - Formulár → nový lead v Directus `client_leads`.
    - Agent (Run now) publikuje → webhook → článok na stránke do ~10 s.
    - `wp.digitalnapomoc.sk` je skrytý (noindex).
12. **Google Search Console:** pridaj `digitalnapomoc.sk`, over vlastníctvo,
    pošli `https://digitalnapomoc.sk/sitemap.xml`.

## Neskôr

- **Cloudflare** pred frontend (proxy DNS, CDN, rýchlosť, bezpečnosť).
- Voliteľne presmerovanie `www` → apex (ak chceme jednu kanonickú adresu aj na
  úrovni presmerovania, nielen `canonical`).

## Kto čo robí

- **Ja (kód/podpora):** tento runbook, presné hodnoty env, úprava mu-plugin
  webhooku, prípadné drobné presmerovanie `www`→apex, kontrola po ceste.
- **Ty (klikacia časť):** hostcreators (subdoména, DNS, SSL, WP nastavenia),
  Railway (custom domény, Variables). Na tieto živé služby ja nedosiahnem.
