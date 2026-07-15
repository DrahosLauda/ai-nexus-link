# digitalnapomoc.sk — frontend (AI Nexus Link)

Nová landing page pre digitalnapomoc.sk — produkčná implementácia dizajnu
z Claude Design. Referenčný frontend headless architektúry AI Nexus Link:
WordPress slúži len ako CMS, Directus ako CRM/systémová vrstva.

Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript.

## Spustenie

```bash
npm install
cp .env.example .env.local   # doplňte hodnoty
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

## Ako to funguje

- **Blog** — `lib/wp.ts` číta 3 najnovšie publikované články z WP REST API
  (`WP_URL`), ISR cache 5 minút. Keď API nie je dostupné, zobrazia sa
  záložné články z `lib/content.ts`.
- **Okamžitá obnova blogu** — `POST /api/revalidate?secret=<REVALIDATE_SECRET>`
  zneplatní cache úvodnej stránky. Volajte z WP pri publikovaní (nižšie).
- **Formuláre → Directus** — oba formuláre posielajú na `POST /api/lead`,
  ktorý po validácii (honeypot, rate limit 5/10 min na IP) zapíše lead do
  Directus kolekcie `client_leads`.

## Directus: kolekcia `client_leads`

API route zapisuje tieto polia — kolekcia ich musí mať (typ Input/Textarea,
všetky okrem `email` voliteľné):

| Pole | Typ | Poznámka |
|---|---|---|
| `name` | string | meno (hlavný formulár) |
| `email` | string | povinné |
| `phone` | string | telefón (hero formulár) |
| `message` | text | správa |
| `source` | string | `hero-callback` alebo `kontakt-cta` |

Directus token musí mať právo *create* na `client_leads` (rola s minimálnymi
právami — nie admin token).

## WordPress: webhook na revalidáciu

Do `wp-content/mu-plugins/nexus-revalidate.php`:

```php
<?php
// Pri publikovaní článku obnoví Next.js frontend.
add_action('publish_post', function () {
    wp_remote_post(
        'https://VASA-FRONTEND-DOMENA/api/revalidate?secret=VAS_REVALIDATE_SECRET',
        ['timeout' => 5, 'blocking' => false]
    );
});
```

## Nasadenie na Railway

1. Railway → New Service → GitHub repo, **Root Directory: `frontend`**.
2. Build a štart zistí Railway sám (`npm run build` / `npm run start`).
3. Variables: `WP_URL`, `DIRECTUS_URL`, `DIRECTUS_TOKEN`, `REVALIDATE_SECRET`
   (zdieľajte cez environment group s orchestrátorom).
4. Settings → Networking → Generate Domain (neskôr vlastná doména).

## Čo treba doplniť

- **Fotka tímu** — uložte do `public/team.jpg` a nahraďte placeholder
  v `components/about.tsx` komponentom `<Image>` z `next/image`.
- **E-mail notifikácia o novom leade** — `/api/lead` zatiaľ len zapisuje do
  Directusu; notifikáciu rieši Directus Flows alebo doplníme e-mail službu.
- Telefón v pätičke (`components/footer.tsx`) je zástupný.
