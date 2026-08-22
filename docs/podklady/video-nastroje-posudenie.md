# Video a hlas — posúdenie nástrojov (22.8.2026)

> **Toto sú podklady, nie rozhodnutia.** Rozhodnutia sú v `docs/backlog.md`
> a `docs/dennik.md`. Sem sa píše, čo sme preskúmali a prečo to dopadlo tak,
> ako dopadlo — aby sa to o pol roka neskúmalo znova od nuly.

## MiniMax H3 lokálne (ComfyUI) — ODPADÁ

**Odkazy:**
- Tutoriál: `promptlab.cz/tutorial/cely-minimax-h3-v-jedne-node-pro-comfyui-video-se-zvukem-bez-obrich-workflow`
- Node: `github.com/LeonQ8/ComfyUI-ALLinONE-MinimaxH3` (GPL-3.0, beta, má
  `COMPATIBILITY.md` — teda „keď to po update prestane fungovať")

**Čo to je.** Otvorený video model s natívnym zvukom (reč, ruchy aj hudba
v jednom prechode). Beží lokálne, bez API kľúča, nič sa neposiela von.

**Prečo odpadá — hardvér:**

| | |
|---|---|
| Váhy (najmenší variant) | ~42,5 GB (diffusion ~21 GB, text encoder ~15,7 GB, VAE ~5,8 GB) |
| VRAM realisticky | 24–32 GB pohodlne; 16 GB s kvantizáciou; 8–12 GB experiment |
| Systémová RAM | 64 GB odporúčaná |
| ComfyUI | min. 0.30.0 |

**Majiteľov Mac:** Intel + **AMD Radeon Pro 555X (4 GB)**, 16 GB RAM.
To je **dvojité nie** — málo pamäte **a** nesprávny typ grafiky. Tieto modely
bežia na NVIDIA (CUDA) alebo Apple Silicon (MPS); AMD v Intel Macu nedostane
ani jedno. Aj so 128 GB pamäte by to nešlo.

**Prečo neriešiť ani prenájmom GPU.** Náš orchestrátor je Python skript, ktorý
sa zobudí na cron, zavolá API a zhasne. ComfyUI + H3 je opačný tvar: udržiavaný
stroj so 42 GB modelov a pinnutými verziami. To je dielňa, nie legokocka — a
dielňu nezreplikuješ klientovi.

**Kedy by sa to otočilo:** desiatky videí mesačne, alebo potreba niečoho, čo
komerčné API nedovolí. Ani jedno dnes neplatí.

## Video cez API — ✅ OVERENÉ, ideme takto

Otestované naživo 22.8.2026 v plánovacom sedení.

| Poskytovateľ | Stav |
|---|---|
| **Kling** | ✅ VIP, 420 kreditov. **Použité.** |
| Higgsfield | ❌ free plán, 1 kredit; video stojí 12,5 |

**Vygenerované:** 5 s vertikálny klip 1080p (9:16) k článku ID 863 („Ako tvoriť
obsah na sociálne siete s pomocou AI"). Model `kling-video-v3_0_turbo`.
**70 sekúnd, 50 kreditov**, bez vodoznaku. Hodnotenie majiteľa: „môže byť",
doladenie v samostatnom sedení.

**Praktické poznatky (aby sa neopakovali chyby):**
- `kling-video-v3_0_turbo` **nepodporuje** `enable_audio`, `audio_prompt` ani
  `music_prompt` — tie majú `kling-video-v2_5` a `v2_6`. Na Instagram to nevadí,
  hudba sa pridáva v appke.
- Do promptu vždy **„no text, no captions, no letters, no logos"** — AI modely
  slovenský text s mäkčeňmi rozsekajú. Text patrí do popisu príspevku.
- Prompt smerovať na **pocit**, nie na technológiu (fungoval záber „majiteľka
  zaklápa notebook a berie si kávu", nie „AI pomáha firme").
- Odkazy od Klingu **expirujú po 24 h** — stiahnuť hneď.
- `who_am_i` vráti ~105 000 znakov → parsovať cez `python3` zo súboru, nečítať celé.
- Model vie vygenerovať 1–4 varianty naraz; ruky a tvár v pohybe sú miesta, kde
  sa AI video najčastejšie rozsype — preto sa generuje viac a vyberá sa.

## Higgs Audio v3 (hlas) — NIE do produktu, možno pre naše videá

**Odkaz:** `promptlab.cz/tutorial/higgs-audio-v3-open-source-hlas-ktery-umi-septat-kricet-i-zpivat-ve-100-jazycich`

**Čo je dobré:** hostované API od Boson AI **zadarmo** (teda bez GPU),
klonovanie hlasu z pár sekúnd ukážky, 102 jazykov (85 v produkcii), v slepých
testoch poráža platenú konkurenciu.

**Dva háčiky:**

1. **Licencia je nekomerčná.** Výnimka „Creator Use Grant" dovoľuje tvorcom
   robiť a monetizovať podcasty, videá a príspevky na siete zadarmo, s kreditom
   Boson AI. Čiže:
   - ✅ náš social agent, ktorý namluví NAŠE video → v poriadku (s kreditom),
   - ❌ chatbot na klientovom webe, ktorý číta odpovede nahlas → to je produkt,
     ktorý predávaš; Creator Use Grant to nekryje.
2. **Slovenčina nie je potvrdená.** Dokumentácia spomína češtinu, slovenčinu
   nie. Model natrénovaný na češtine prečíta slovenčinu s českým prízvukom.
   **Test je zadarmo** — jeden odsek s „ľ, ĺ, ŕ, ô, ä" cez ich API. Kým to
   nepočuješ, je to nepotvrdené.

**Súvisiaci verdikt:** hlasový VÝSTUP (bot číta nahlas) nie je vo fronte.
Hlasový VSTUP (diktovanie) je vyriešený — Wispr Flow, viď denník 22.8.2026.

## Čo z toho ide do P4 (Social agent)

Scope P4 sa **nemení**: agent pripraví 2–3 varianty textu ako koncepty do
Directusu, zverejňuje človek. Video **nie je súčasť agenta** — nemáme GPU na
Railway a video, ktoré nikto pred zverejnením nevidel, je riziko, nie úspora.

Jediná zmena: kolekcia `social_posts` má mať **od začiatku pole na médium**
(obrázok/video URL), aby sa video dalo doplniť neskôr bez prerábania schémy.
