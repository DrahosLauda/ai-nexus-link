---
name: seo-geo-frontend
description: >-
  Postav SEO + GEO základ na headless Next.js frontende (metadata, Open Graph,
  canonical, sitemap.xml, robots.txt, llms.txt, JSON-LD štruktúrované dáta).
  Použi, keď treba zoptimalizovať web pre Google aj AI vyhľadávače (ChatGPT,
  Perplexity, Google AI Overviews), pripraviť web na spustenie/indexovanie,
  alebo replikovať SEO/GEO vrstvu na ďalšieho klienta. Platí pre projekty
  headless WordPress → Next.js (ako AI Nexus Link / digitalnapomoc.sk).
---

# SEO/GEO základ na headless Next.js frontende

Recept, ako dať webu kompletný SEO a GEO základ. **GEO** = Generative Engine
Optimization = optimalizácia pre AI vyhľadávače (ChatGPT, Perplexity, Google AI
Overviews), aby náš obsah ľahko našli, prečítali a **citovali**.

## Kľúčový princíp (prečo to takto)

Web je **headless**: Google aj AI vidia len **Next.js frontend**, nie
WordPress. Preto všetky meta značky a štruktúrované dáta patria **na frontend**.
WP SEO pluginy (Yoast, Rank Math) sú v tejto architektúre **zbytočné** — ukladajú
dáta do WP, ktorý nikto nevidí.

## Pred prácou: audit

1. **Rýchlosť/Core Web Vitals:** používateľ spustí https://pagespeed.web.dev
   na živú URL (mobil aj desktop). Cieľ 90–100. Pozn.: „SEO 100" v Lighthouse
   je len základná hygiena — schema/OG/GEO nemeria.
2. **Audit kódu:** skontroluj, čo `<head>` reálne generuje (title, description,
   OG, canonical, JSON-LD) a či existujú `robots.txt`, `sitemap.xml`, `llms.txt`.
3. Pozn.: v cloud sedení sa živý web často nedá načítať (sieťová politika) —
   audit rob z kódu, živý PageSpeed nech spustí používateľ.

## Postup (Next.js 16, App Router)

> ⚠️ Pred písaním Next.js kódu si prečítaj lokálnu dokumentáciu
> `frontend/node_modules/next/dist/docs/` — táto verzia máva breaking changes.

1. **`lib/seo.ts`** — centrálna konfigurácia na jednom mieste (kvôli replikácii
   na ďalšieho klienta): `SITE_URL` (verejná adresa frontendu, **nie WP**, bez
   lomky), `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_INDEXABLE`
   (`process.env.SITE_INDEXABLE === "true"`), `absoluteUrl()`, zoznam AI
   crawlerov, generátory JSON-LD (`organizationSchema`, `websiteSchema`,
   `articleSchema`).
2. **`app/robots.ts`** (`MetadataRoute.Robots`): keď `!SITE_INDEXABLE` →
   `{ rules: { userAgent: "*", disallow: "/" } }` (web skrytý). Inak povoľ `*`
   aj AI crawlerov (`disallow: "/api/"`) + `sitemap` + `host`.
3. **`app/sitemap.ts`** (`MetadataRoute.Sitemap`): statické stránky + články z
   CMS. `try/catch` → pri výpadku CMS vráť aspoň statické stránky.
4. **`app/llms.txt/route.ts`** (Route Handler `GET`): Markdown podľa
   llmstxt.org — `# názov`, `> popis`, `## Blog` + zoznam článkov ako
   `- [titulok](url): popis`. `Content-Type: text/plain; charset=utf-8`.
5. **`components/json-ld.tsx`**: `<script type="application/ld+json">` cez
   `dangerouslySetInnerHTML` (obsah je náš serverom generovaný objekt).
6. **`app/layout.tsx`**: `metadataBase: new URL(SITE_URL)`, `title` so šablónou
   `{ default, template: "%s – NÁZOV" }`, predvolené `openGraph` + `twitter`,
   `robots` podľa `SITE_INDEXABLE`.
7. **Domovská stránka**: `alternates.canonical: "/"` + `<JsonLd>` s
   Organization a WebSite.
8. **Stránka článku** (`generateMetadata`): `openGraph` typu `article`
   (s `publishedTime`/`modifiedTime`), `twitter`, `alternates.canonical` +
   `<JsonLd>` s `BlogPosting`. CMS klient musí vracať **ISO dátumy** a
   `modified` (nie len naformátovaný dátum).
9. **Ostatné stránky**: `title` bez sufixu (šablóna ho doplní) + vlastný
   canonical.

## Overenie

- `npm run lint` a `npm run build` musia prejsť (TypeScript OK).
- V prerenderovanom HTML (`.next/server/app/`) skontroluj: `<meta name="robots">`
  (noindex kým nespúšťame), JSON-LD skript, `og:*`, `<link rel="canonical">`.
- Skontroluj telá `.next/server/app/robots.txt.body`, `sitemap.xml.body`,
  `llms.txt.body`. (Články môžu chýbať, ak sedenie nedosiahne na CMS — naplnia
  sa až za behu tam, kde CMS dostupný je.)

## Spustenie (Railway Variables)

- `SITE_URL` = ostrá adresa frontendu (napr. `https://digitalnapomoc.sk`).
- `SITE_INDEXABLE=true` = zapne indexovanie + AI roboty. ⚠️ Kým je noindex,
  Lighthouse zámerne zníži SEO skóre — je to očakávané.

## Pravidlá spolupráce (tento projekt)

- Komunikácia a obsah po **slovensky**.
- Do `main` len cez vetvu + PR; **merge/nasadenie až po výslovnom súhlase**
  používateľa. Vetvu, commit, push do vetvy a PR môžeš.
- Tajomstvá len do env premenných, nikdy do kódu. URL premenné = len základná
  adresa.
- Po dokončení **zdokumentuj** do `docs/dennik.md` (nový záznam navrch).
