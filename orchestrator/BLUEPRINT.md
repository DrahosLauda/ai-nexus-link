# AI Nexus Link - Architektonický plán

## Cieľ projektu
Modulárny kognitívny systém pre správu, optimalizáciu a automatizáciu webov postavených na Headless WordPress (Backend) a Next.js (Frontend).

## Bezpečnostné pravidlá
- WordPress REST API musí byť uzamknuté pre verejnosť.
- Všetky prístupové heslá sa načítavajú výhradne cez environmentálne premenné (.env).
- Žiadne citlivé údaje nesmú byť zapísané priamo v kóde.

## Databázová štruktúra (Directus)
- `agent_config` (Dlhodobé pravidlá a identita agentov)
- `agent_logs` (Záznamy každého úkonu a trajektórie)
- `client_leads` (CRM vrstva, správa kontaktov)