# Podklady — zdrojové materiály (NIE rozhodnutia)

> **Čo to je:** skoršie brainstormy a koncepty, ktoré vznikli mimo tohto repa
> (prevažne konverzácie s Gemini ako „programovacím partnerom"). Sú tu preto,
> aby sa nestratili a aby sa dali kedykoľvek prečítať.

## ⚠️ Ako s tým zaobchádzať

**Toto NIE sú platné rozhodnutia projektu.** Sú to nápady — nadšené,
inšpiratívne a miestami v rozsahu, ktorý sme si vedome orezali. Časť z nich
sme prevzali, časť **vedome zamietli**.

| Chceš vedieť… | Pozri sem |
|---|---|
| Čo z podkladov **berieme a čo nie** (a prečo) | `docs/plan-agenti.md` → „Ponaučenia z podkladov" |
| Kam projekt smeruje | `docs/vizia.md` |
| Čo je otvorené a v akom poradí | `docs/backlog.md` |
| Ako systém naozaj funguje | `docs/architektura.md` |

**Pravidlo:** keď sa niečo z podkladov rozhodne prevziať, rozhodnutie sa
zapisuje do `plan-agenti.md` / `vizia.md` — **nie sem**. Tento priečinok sa
nemení, je to archív vstupov.

## Prehľad súborov

| Súbor | O čom je |
|---|---|
| `Master Architecture Blueprint - AI Nexus Link.md` | Celková architektúra platformy (skorší koncept) |
| `FABLE PROTOCOL V2.md` | Anti-halucinačná disciplína pre agentov — **prevzaté**, tvorí základ `system_prompt` |
| `Knižnica IT Expertov.md` | Koncept knižnice špecializovaných agentov/rolí |
| `Architektura Agentickej AI system ktory stavia sam seba.md` | Agentický systém, čo sa sám rozširuje (najrozsiahlejší, najambicióznejší) |
| `AI Pamäť OKF- LLM WIKI-MEMANTO.md` | Pamäť/znalostná báza pre agentov — z toho prevzaté **OKF** (`.md` + YAML hlavička) |
| `Wayland AI Agents.md` | Lokálny desktopový agent — ako runtime **vedome zamietnuté** (nesedí na hostovaný SaaS) |

*Pozn.: „Wayland" je aj krycí názov nášho článkového agenta — nepomýliť si to.*

## Poznámka k RAG

RAG indexer (`orchestrator/rag_index.py`) **priečinok `docs/` neindexuje vôbec**
— číta len WP články, `faqs` a výkladnú skriňu z `frontend/lib/content.ts`.
Tieto podklady sa teda do chatbota nedostanú a **je to tak správne**: sú to
brainstormy, nie overený obsah, ktorý by mal bot podávať návštevníkom.
