---
name: site-customizer
description: >-
  Prispôsob hotovú odvetvovú šablónu (frontend/templates/<odvetvie>/) reálnemu
  klientovi — texty, farby, biznis údaje, obrázky — a zapoj správny modul
  (rezervačný widget/chatbot) bez duplicity logiky. Použi, keď treba z overenej
  šablóny spraviť klientský web zmenou obsahu, nie kódu, a prejsť bránou kvality.
  Zatiaľ RUNBOK (kostra) — plný beh sa dopĺňa v míľniku M4.
---

# Customizačný agent — šablóna → klientský web

> **Stav: kostra (runbook), bez plného behu.** Doplní sa v míľniku **M4**
> (`docs/plan-agenti.md` → „Frontend agent — knižnica odvetvových šablón").
> Customizácia = editácia kódu/obsahu → **doména Claude Code sedenia**, nie
> headless orchestrátor.

## Princíp

Šablóna je pevný, overený základ. Customizácia je **malá, riaditeľná zmena
obsahu a brandingu** — nie generovanie webu nanovo. Meníš `content.ts` a
`theme.css`, zapájaš zdieľané moduly, prejdeš bránou kvality, vyliftuješ.

## Runbook (kroky)

1. **Vyber šablónu** — z `frontend/templates/` (register `templates/registry.ts`)
   podľa odvetvia klienta. Ak pre odvetvie šablóna nie je, najbližšia + úprava,
   alebo eskaluj (nová šablóna = práca build sub-agentov, nie customizácia).
2. **Zozbieraj vstupy klienta** — ľubovoľná kombinácia: vízia (chat), biznis plán
   (PDF), starý web (URL), referenčné weby (inšpirácia, **nie kópia**). Extrahuj
   dizajnový smer a fakty (názov, služby, kontakt, otváracie hodiny).
3. **Vyplň `content.ts`** klientskými textami — cez `sk-copywriter`, proti zoznamu
   zakázaných fráz v `docs/sablony-kvalita.md`. Reálne údaje, žiadne vymyslené
   fakty (certifikáty, ocenenia, čísla).
4. **Uprav `theme.css`** — klientske farby/typografia v rámci prefixovaných tokenov
   šablóny (cez `ui-ux-designer`, aby sa nerozbil dizajn systém).
5. **Zapoj modul** — rezervačný `booking-widget` (`lib/booking.ts` /
   `booking-data.ts`) a/alebo `chat-widget` (`/api/chat`). **Len import +
   konfigurácia + branding**, žiadna duplicita logiky (lego princíp).
6. **Obrázky + licencie** — vymeň za klientske/licencované, aktualizuj
   `images/LICENSES.md`.
7. **Brána kvality** — `qa-a11y` prejde checklist z `docs/sablony-kvalita.md`
   (Lighthouse ≥ 95, WCAG AA, responzivita, čistý kód, žiadne AI frázy) →
   **ľudská revízia**.
8. **Lift do deployu** — podľa `frontend/templates/README.md` (skopíruj balík +
   `lib/*`, napoj Directus, branding, doména).

## Lego stopa (voliteľné, konzistencia s Writer/SEO)

- Riadok `agent_config.site_builder` (model — default Claude, pravidlá značky) +
  zápis do `agent_logs` (čo a pre koho sa prispôsobilo).
- **Least privilege** token ako pri ostatných agentoch (read `agent_config`,
  create `agent_logs`). Klik-časť (Directus/token) až po súhlase majiteľa.

## Bezpečnosť a hranice

- Nemeníš zdieľanú logiku (`lib/booking.ts`, `/api/chat`) — len ju voláš.
- Osobné/firemné dáta klienta (biznis plán, prílohy) → viaže sa na GDPR
  (cookie lišta + zásady OÚ z Pred-Google checklistu). Naostro až po ich vyriešení.
- Referenčné weby = extrakcia smeru, **nie kópia** (právne čisté; základ je vždy
  naša šablóna).
