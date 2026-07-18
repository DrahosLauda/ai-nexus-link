# Wayland (Ferrox Labs) — poznámka k prieskumu

> Overené z GitHub repozitára [FerroxLabs/wayland](https://github.com/FerroxLabs/wayland)
> a README (júl 2026). Slúži na rozlíšenie od **nášho** agenta.

## ⚠️ Dvaja „Waylandi" — nemýliť si

| | Náš Wayland | Wayland app (Ferrox Labs) |
|---|---|---|
| Čo to je | `orchestrator/wp_writer_agent.py` — náš Python skript | Hotová desktopová aplikácia (macOS/Windows/Linux) |
| Úloha | Píše články + obrázky do WP | „Veliteľské centrum" pre všetky AI CLI na PC |
| Súčasť projektu | Áno, jadro AI Nexus Link | Nie, externý nástroj tretej strany |

Meno je zhoda náhod. V dokumentácii projektu = **náš Wayland**; tento súbor je o tom druhom.

## Čo Wayland app naozaj je (overené v kóde)

- Lokálna desktopová appka, motor v **Ruste**, verzia ~0.11, open source.
- Riadi Claude Code, Codex, Gemini, Qwen, Goose a ďalšie CLI z jedného miesta.
- Prepínanie modelov uprostred úlohy, **MCP** podpora, **cron** plánovanie.
- **Trvalá pamäť** (SQLite, 5 partícií), tímy agentov, natívny **sandbox**.
- Human-in-the-loop schvaľovanie. Beží lokálne, na tvojich kľúčoch (žiadny cloud medzičlánok).

## ⚠️ Čo si „Programovací partner" v PDF vymyslel

Lekcia o overovaní AI tvrdení — porovnané s realitou:

| Tvrdenie z PDF | Realita |
|---|---|
| Licencia „Apache-2.0" | ❌ **AGPL-3.0** |
| Cloudová služba, $0.002/interakcia, Free tier 10 000 krokov | ❌ Vymyslené — je to free, lokálny, open source |
| Python SDK `wayland.log_step(...)` | ❌ Neexistuje; appka je TypeScript/Rust |
| Lokálny agent, pamäť, MCP, cron, tímy | ✅ Pravda |

## AGPL-3.0 — pozor na biznis model

AGPL je „vírusová" licencia: ak Wayland app **zabalíš do platenej služby pre klientov**,
musíš zverejniť zdrojový kód svojich úprav. Používať ho ako nástroj pre seba = bez problémov.
Predávať produkt postavený na ňom = treba právne premyslieť.

## Ako to zapadá do AI Nexus Link

Dve roviny, **nebijú sa, dopĺňajú**:

1. **AI Nexus Link (náš systém)** — serverový, beží 24/7 v cloude (Railway), aj keď máš PC
   vypnutý. Náš produkt, naše know-how, bez závislosti a bez AGPL otáznikov. **Tu pokračujeme.**
2. **Wayland app** — osobný lokálny veliteľský pult: môže riadiť tvojho lokálneho Claude Code,
   pamätať kontext medzi nástrojmi, púšťať lokálne automatizácie (audity webov, e-maily…).
   **Odporúčanie: vyskúšať ako používateľ** popri projekte; po Fáze 3 vyhodnotiť, čo staviať
   na ňom a čo na našom systéme.

## Odkazy

- Repo: https://github.com/FerroxLabs/wayland (AGPL-3.0)
- Web: getwayland.com · Docs: docs.getwayland.com
