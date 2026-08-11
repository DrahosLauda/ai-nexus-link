# Knižnica odvetvových šablón — prenosné balíky

Každá odvetvová šablóna je **sebestačný, prenosný balík** v `templates/<odvetvie>/`.
Cieľ: jeden repozitár a žiadna nová infra pre naše portfólio, no zároveň
**portovateľné ku klientovi** (balík sa vyliftuje do čistého Next.js deployu).

> Kontext a rozhodnutia: `docs/plan-agenti.md` → „Frontend agent — knižnica
> odvetvových šablón". Brána kvality (povinná): `docs/sablony-kvalita.md`.
> Šablóny staviame so **sub-agentmi** v `.claude/agents/` (dizajnér, dev, copy, QA).

## Štruktúra balíka

```
templates/
  registry.ts                 # register šablón (slug, odvetvie, popis, shell, pages)
  <odvetvie>/
    theme.css                 # scoped dizajn-tokeny (Tailwind v4 @theme, prefix <odvetvie>-*)
    content.ts                # všetok obsah/texty šablóny (jedno miesto na customizáciu)
    base.ts                   # TEMPLATE_BASE + href() — centralizované interné cesty (kvôli liftu)
    layout.tsx                # „shell" (fonty + navbar + pätička + .flora-root) okolo každej stránky
    index.tsx                 # skladá TemplateEntry (shell + zoznam stránok cesta→render+meta)
    sections/                 # hero, sluzby, galeria, meniny, referencie, kontakt-form…
    pages/                    # jedna stránka viacstránkového webu = jeden súbor
    images/                   # licencované obrázky (+ placeholder systém, kým nie sú)
      LICENSES.md             # zdroj + licencia KAŽDÉHO obrázka (právne čisté pre klienta)
```

### Tailwind wiring (dôležité)

Tokeny šablóny sú v `@theme` v jej `theme.css`. Aby z nich Tailwind v4 vygeneroval
utility (`bg-flora-paper`, `text-flora-h1`, `font-flora-display`…), musí sa
`theme.css` skompilovať v **jednom** Tailwind builde — preto ho **`@import`-uje
`app/globals.css`** hneď za `@import "tailwindcss"`. Prefix (`flora-`) + scoping
základových pravidiel pod `.flora-root` zabraňujú kolízii s hlavným webom, takže
do zvyšku stránky nič nepresiakne. `layout.tsx` šablóny už `theme.css` **nenačítava**
(bola by to duplicita) — len aplikuje `.flora-root` a CSS premenné fontov.

> Pri lifte ku klientovi (viď nižšie) sa `@import` `theme.css` presunie do
> `globals.css` cieľového appu — rovnaký princíp, jeden build.

## Princípy

- **Vlastná identita bez kolízie.** Hlavný web má tokeny globálne v
  `app/globals.css` (`@theme`). Každá šablóna má **vlastný `theme.css`** s
  **prefixovanými** tokenmi (`--color-flora-500`, `--font-flora-display`…),
  importovaný len v jej `layout.tsx`. Žiadne globálne prepisovanie farieb.
- **Data-driven.** Text a obsah patria do `content.ts`, nie natvrdo do JSX —
  aby customizačný agent menil len obsah, nie kód. Žiadne lorem ipsum ani `TODO`.
- **Zdieľané moduly len importuj** (lego princíp, žiadna duplicita logiky):
  `components/booking-widget.tsx`, `lib/booking.ts`, `lib/booking-data.ts`,
  `components/chat-widget.tsx`, `/api/chat`. Šablóna dodá len konfiguráciu a
  vizuálny obal.
- **Demo obsah je `noindex`.** Šablóny sa mountujú cez `app/ukazky/[odvetvie]/`;
  celá vetva `/ukazky/*` má `robots: noindex` a nie je v `sitemap.xml` ani
  `llms.txt`. Fiktívny demo obsah nesmie do Googla ani znečistiť naše SEO.

## Pridanie šablóny

1. Vytvor `templates/<odvetvie>/` podľa štruktúry vyššie.
2. Zaregistruj ju v `registry.ts` (`slug`, `industry`, `description`, `render`).
   Tým sa automaticky objaví v indexe `/ukazky` a sprístupní `/ukazky/<odvetvie>`.
3. Prejdi bránu kvality (`docs/sablony-kvalita.md`) + ľudskú revíziu.

## Lift ku klientovi

Skopíruj `templates/<odvetvie>/` + potrebné `lib/*` a zdieľané komponenty do
čistého Next.js appu (alebo klonu `frontend/`), napoj Directus (booking/leady/
chatbot), zmeň branding/obsah v `content.ts`/`theme.css`, nasaď na doménu.
Multi-tenant (Fáza 5) je zámerne až neskôr — teraz jedno-balíkové lifty.
