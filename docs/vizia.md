# Vízia AI Nexus Link — kam to celé smeruje

> Prečo to staviame, akú hodnotu to prináša a ako sa to má vyvinúť
> z jedného webu na predajnú AI platformu. Doplnok k `CLAUDE.md`
> (technický rozcestník) a `docs/architektura.md` (ako to funguje dnes).
> Stav: júl 2026, počas Fázy 3.

## 1. Veľká myšlienka

Nestaviame jeden web — staviame **produkt**: modulárnu AI nadstavbu nad
WordPress, ktorá malým firmám dá **moderný web, AI tvorbu obsahu, zber
zákazníkov (CRM), neskôr e-shop a viacero AI agentov** — a celé sa to dá
**rýchlo replikovať ďalším klientom**.

`digitalnapomoc.sk` je **prvý referenčný web a zároveň šablóna** na predaj.

Cieľová predstava: **slovenský „GHL na AI"** — platforma, kde firma vojde do
admina, klikaním si **zapne moduly (agentov)** a systém pre ňu pracuje 24/7.

## 2. Architektúra ako „lego" — moduly = agenti

Systém je poskladaný tak, aby sa **agenti pridávali ako kocky**, nie prepisovali:

- **Ovládací panel** = Directus kolekcia `agent_config`. Pole `agent_name`
  rozlišuje agentov → každý agent má vlastný riadok s vlastnými nastaveniami
  (model, poskytovateľ, témy, prompt…), meniteľnými **klikaním**.
- **Denník** = Directus kolekcia `agent_logs`. Každý agent si zapisuje, čo a s
  akým výsledkom urobil.
- **Modul agenta** = Python skript v `orchestrator/` (napr. `wp_writer_agent.py`),
  ktorý si prečíta svoj config a píše do logov. Nový agent = nový skript + nový
  riadok v configu. Nič sa neláme.

Tento vzor je **kľúč k produktizácii**: pridať schopnosť = pridať modul.

## 3. Katalóg agentov (súčasní + plánovaní)

| Agent | Čo robí | Stav |
|---|---|---|
| **Writer (`wp_writer`)** | Píše SEO články + generuje obrázky → WP koncept | ✅ funguje |
| **SEO+GEO agent (`seo_geo`)** | Meta popis do WP, kľúčové slovo, interné odkazy, GEO tipy pre AI vyhľadávače | ⏳ MVP (Fáza 4) |
| **Social agent** | Tvorí a uverejňuje príspevky na sociálne siete | 🔜 plán |
| **Frontend/dizajn agent** | Pomáha s dizajnom sekcií, vizuálmi, úpravami vzhľadu | 🔜 plán |
| **„Plugin-nahrádzajúci" agenti** | Nahradia bežné WP pluginy vlastnou AI logikou | 🔜 plán |
| **Ďalší podľa dopytu** | Newsletter, recenzie, zákaznícka podpora (chatbot)… | 🔜 nápady |

Každý z nich zapadá do rovnakého vzoru: config v Directuse, logy v Directuse,
modul v orchestrátore, vlastný token s minimálnymi právami.

## 4. Ako to doručíme klientom — model dodania

Dve možnosti a **zvolený smer**:

- **A) Spravovaný SaaS (odporúčané) — „krabica", ktorú hostíme my.**
  Klient sa prihlási do admina, klikaním si zapína moduly a nastavuje agentov;
  my hostíme, aktualizujeme a zabezpečujeme; klienta zaškolíme.
  - + Opakovaný (mesačný) príjem ako GHL.
  - + Central aktualizácie a podpora (každý klient beží rovnako).
  - + Bezpečnosť pod kontrolou (klient nesiaha na kód ani na server).
  - + Klient nechce kód — chce klikať a mať pokoj.
- **B) Stiahnuteľná self-hosted aplikácia** — klient si to nainštaluje sám.
  - − Ťažko spoplatniteľné opakovane; každá inštalácia iná = náročná podpora a
    bezpečnosť; aktualizácie treba obiehať. Vhodné len ako **výnimka** pre
    veľkého klienta, čo si to výslovne vyžiada.

**Rozhodnutie:** ideme cestou **A — spravovaný SaaS**. „Firmy si to nastavia
samy" = áno, ale **v našom hostovanom admine**, nie na svojom serveri.

Poznámka k technike: dnešný systém je **jedno-klientský**. Produktizácia
(Fáza 5) znamená spraviť ho **viac-klientským (multi-tenant)** — každý klient
izolovaný, so svojím configom a svojimi agentmi, pod našou centrálnou správou.

## 5. Roadmap (fázy a hodnota)

| Fáza | Čo staviame | Hodnota pre nás | Hodnota pre klienta |
|---|---|---|---|
| **1 — Frontend** ✅ | Moderný Next.js web, blog z WP | Ukážka „pred/po", ktorá predáva | Rýchly, pekný web bez zmeny WP |
| **2 — Leady/CRM** ✅ | Formuláre → Directus | Dôkaz, že web prináša kontakty | Žiadny lead sa nestratí |
| **3 — AI agenti 24/7** ⏳ | Agent píše sám v cloude; výber modelu klikaním; základ pre viac agentov | Obsah na autopilota; jadro produktu | Web „žije", lepšie SEO |
| **4 — WooCommerce** | Online predaj cez Store API | Drahšia zákazka (e-shop) | Klient začne predávať online |
| **5 — Produktizácia (multi-tenant SaaS)** | Šablóna + admin pre viac klientov, moduly ako lego | **Biznis** — nový klient za dni | Dostupné riešenie „na kľúč" |
| **Neskôr** | Ďalší agenti (SEO, social, dizajn…), podstránky služieb, doména `digitalnapomoc.sk` → frontend (WP na subdoménu) | Bohatšia ponuka modulov | Kompletný web + AI pomoc |

## 6. Hodnota v skratke

**Pre nás:** referencia + šablóna v jednom, opakovaný príjem, odlíšenie od
konkurencie (AI obsah + CRM + e-shop pod jednou strechou), ušetrený čas.

**Pre klienta:** nechá si známy WordPress, dostane moderný web, pravidelný
AI obsah (viac návštev z Googlu = viac dopytov), kontakty na jednom mieste,
neskôr e-shop — rýchlo a cenovo dostupne.

## 7. Zásady, ktoré to celé umožňujú

- **Každý systém = jedna rola + vlastný token s minimálnymi právami**
  (least privilege). Bez tohto sa platforma nedá bezpečne replikovať.
- **Obsah nikdy do Directusu, leady/logy nikdy do WP** — čisté hranice.
- **Agenti publikujú koncepty, publikuje človek** (kým sa dôvera nevybuduje).
- **Modularita:** nová schopnosť = nový modul + riadok v configu, nie prepis.

> Táto vízia je živý dokument. Keď pribudne nový agent alebo sa rozhodne o
> ďalšom module, doplň sem riadok — nech mapa hodnoty ostáva aktuálna.
