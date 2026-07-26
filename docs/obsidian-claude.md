# Obsidian ↔ Claude — návod a vysvetlenie

> Ako prepojiť Obsidian s Claudom, **na čo nám to v projekte poslúži**, a ako to
> **bezpečne vyskúšať**. Písané na učenie — pokojne najprv otestuj na malom
> testovacom vaulte, až potom nad týmto projektom.

---

## 1. Na čo nám to v projekte poslúži (prečo to chceme)

1. **Jeden „mozog" projektu** — denník, vízia, rozhodnutia na jednom mieste; Claude
   si ich vie čítať → lepší kontext, menej vysvetľovania.
2. **Inbox úloh** — píšeš úlohy do poznámky (`docs/Ulohy.md`), Claude ich spraví a
   výsledok/log zapíše späť.
3. **Automatické zachytávanie learningov** — to, čo dnes robíme ručne (písať
   denník), ide plynulejšie.
4. **Je to zároveň ukážka toho, čo predávame** — „druhý mozog firmy" (dokumenty +
   AI, ktorá v nich vie hľadať a pracovať) je presne typ automatizácie, ktorú
   ponúkame klientom. **Najprv si to overíme na sebe.**
5. **Odrazový mostík k RAG chatbotovi** (`vizia.md` §11) — rovnaký princíp: vault →
   embeddingy → „chat s poznámkami". Dobrý interný test pred nasadením klientovi.

---

## 2. Dôležité rozlíšenie — dva „Claude"

| Nástroj | Vidí lokálny Obsidian? | Kód / GitHub / nasadenie? |
|---|---|---|
| **Claude Code** (web/CLI) — *ním staviame projekt* | ❌ nie priamo; **cez GitHub** (náš vault = repo) | ✅ áno — píše kód, commity, PR, deploy |
| **Claude Desktop** (appka na Macu) + Obsidian MCP | ✅ áno, **priamo a živo** | ❌ nie je kódovací agent (nestavia projekt) |

**Záver:** na **stavbu projektu** používame Claude Code (cez GitHub). Na **živého
asistenta nad poznámkami** používame Claude Desktop + MCP. Môžu fungovať súčasne.

---

## 3. Dve cesty prepojenia

### 🟢 Cesta A — cez GitHub (už to prakticky MÁME, 0 inštalácie)

Náš Obsidian trezor **je** git repo (`~/www/ai-nexus-link`). Takže prepojenie už
existuje — cez GitHub.

**Tok (zapamätaj si):**
```
Obsidian (napíšeš úlohu do docs/Ulohy.md)
  → git push  (odošleš na GitHub)
  → spustíš nové Claude Code sedenie: "prečítaj docs/Ulohy.md a sprav to"
  → sedenie to prečíta z GitHubu, spraví, pushne výsledok
  → git pull  (stiahneš k sebe → vidíš v Obsidiane)
```

⚠️ **Web sedenie číta z GitHubu, nie z tvojho Macu.** Kým poznámku nepushneš,
sedenie ju neuvidí.

**Automatická synchronizácia — plugin „Obsidian Git":**
1. Obsidian → *Settings → Community plugins → Browse* → nájdi **„Obsidian Git"** →
   Install → Enable.
2. V nastaveniach pluginu zapni napr.:
   - **Auto pull on startup / interval** (napr. každých 10 min) — ťahá zmeny sám.
   - **Auto commit‑and‑push** (voliteľné) — tvoje poznámky sám odosiela na GitHub.
3. Odteraz sa vault sám synchronizuje s GitHubom (nemusíš písať `git pull/push`).

**+ výhody:** funguje hneď, žiadna inštalácia MCP, všetko má históriu v Gite.
**− nevýhody:** nie je to „živé" — treba push/pull a spustiť sedenie.

---

### 🔵 Cesta B — Claude Desktop + MCP (živé, lokálne, bez gitu)

Tu Claude **na tvojom Macu** číta/píše vault priamo. Vyžaduje **Claude Desktop** a
**Node.js** (kvôli MCP serverom cez `npx`).

> **MCP** (Model Context Protocol) = spôsob, akým Claude Desktop „siahne" do
> nástrojov (súbory, Obsidian, …). Server sa pridá do konfiguračného súboru.

#### B1 — Filesystem MCP (najjednoduchší začiatok, odporúčam na test)

Claude Desktop dostane prístup k **priečinku** vaultu (číta/píše `.md` súbory);
Obsidian zmeny hneď ukáže (sleduje priečinok).

1. Nainštaluj **Claude Desktop** (Mac) a **Node.js** (`node -v` musí niečo vypísať).
2. Otvor konfiguráciu: Claude Desktop → *Settings → Developer → Edit Config*
   (súbor `~/Library/Application Support/Claude/claude_desktop_config.json`).
3. Vlož (cestu daj na **testovací** vault, nie hneď na tento repo):
   ```json
   {
     "mcpServers": {
       "obsidian-vault": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-filesystem",
           "/Users/drahoslauda/cesta/k/test-vaultu"
         ]
       }
     }
   }
   ```
4. Reštartuj Claude Desktop. V chate by mal mať nové „nástroje" na čítanie/zápis
   súborov v tom priečinku. Otestuj: *„vypíš súbory vo vaulte a zhrň mi poznámku X."*

**+ výhody:** jednoduché, spoľahlivé, žiadny Obsidian plugin.
**− nevýhody:** pracuje so súbormi (nie s Obsidian funkciami ako vyhľadávanie/odkazy).

#### B2 — Obsidian „Local REST API" + Obsidian MCP (Obsidian‑natívne)

Bohatšie — Claude ide cez **Obsidian API** (vie napr. hľadať, otvárať poznámky).

1. V Obsidiane nainštaluj plugin **„Local REST API"** → Enable → skopíruj **API
   kľúč** a zapamätaj **port** (default `27123/27124`).
2. Pridaj do Claude Desktop konfigurácie **Obsidian MCP server** (komunitný —
   aktuálny nájdeš v MCP registri / v docs toho pluginu; zvyčajne sa spúšťa cez
   `npx` a dostane **API kľúč** a **host** cez premenné prostredia).
3. Reštartuj Claude Desktop a otestuj.

**+ výhody:** rešpektuje Obsidian (vyhľadávanie, prepojenia).
**− nevýhody:** viac krokov; závislosť na komunitnom serveri (názvy sa menia —
over aktuálny).

---

## 4. Bezpečnosť a odporúčania

- **Najprv testovací vault / malý projekt** (presne ako plánuješ) — nech si to
  osvojíš bez rizika na ostrých dátach.
- **Least privilege:** filesystem MCP nasmeruj len na konkrétny priečinok (nie na
  celý disk). Claude potom vidí len ten priečinok.
- **Zálohy:** git je tvoja poistka (história). Citlivé poznámky (heslá, tokeny) do
  vaultu nedávaj — tie patria do env premenných (zásada projektu).
- **Kontrola:** pri „živých" cestách Claude môže poznámky aj **prepisovať** — na
  začiatku si po ňom pozri zmeny (git diff / história vaultu).

---

## 5. Odporúčaný postup pre nás

1. **Teraz:** Cesta A — hneď funguje. (Voliteľne zapni „Obsidian Git" auto‑pull,
   nech sa vault synchronizuje sám.)
2. **Na test:** Cesta B1 (filesystem MCP) na **malom testovacom vaulte** — osvoj si
   MCP princíp.
3. **Keď osvedčené:** zvážiť B2 (Obsidian‑natívne) a napojenie na **RAG chatbota**
   (§11) — „chat s poznámkami" rovnakým vzorom, aký predáme klientom.

> Súvisiace: `vizia.md` §11 (RAG chatbot), `docs/prikazy.md` (git push/pull/clone),
> `CLAUDE.md` (tok: sedenie pushuje → používateľ pull‑uje).
