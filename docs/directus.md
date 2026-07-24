# Directus — ťahák pre náš projekt

> Directus = „systémový mozog" (systémové dáta na Railway). CRM leady + ovládací
> panel a denník agentov. **Nikdy obsah webu** (ten je vo WordPresse).
> ⚠️ Živý Directus z cloud sedenia nevidno (sieť ho blokuje) — preto stav
> configu zapisujeme aj do `dennik.md`.

## Naše kolekcie (Content → …)

| Kolekcia | Čo drží | Polia (hlavné) | Kto zapisuje |
|---|---|---|---|
| **`client_leads`** | Leady z formulárov | `name, email, phone, message, source, date_created` | `frontend-bot` (len create) |
| **`agent_config`** | Ovládací panel agentov | `agent_name, is_active, text_provider, text_model, system_prompt` (+ `topics, post_status` pre Writera) | ručne (človek) |
| **`agent_logs`** | Denník behov agentov | `agent_name, status, topic, message, wp_post_id, date_created` | `orchestrator-bot` (len create) |

Riadky v `agent_config`: **`wp_writer`** (Writer) a **`seo_geo`** (SEO+GEO agent).
`agent_name` rozlišuje agentov — jeden riadok = jeden agent.

## Navigácia

- Vľavo je zvislý panel modulov. **Content** (ikonka dát) = prezeranie/úprava
  položiek v kolekciách. **User Directory** = používatelia a ich tokeny.
  **Settings** (ozubené koliesko, dole) = kolekcie, role, politiky.
- Content → klikni na kolekciu (napr. **Agent Logs**) → tabuľka položiek.

## Bežné úkony (klik po kliku)

**Nájsť / otvoriť položku:**
1. Content → kolekcia → klikni na riadok → otvorí sa detail (drawer).

**Triediť tabuľku:**
- Klikni na **hlavičku stĺpca** (napr. dátumu) → prepína vzostupne/zostupne.
- ⚠️ Výber triedenia sa **neukladá** (po odchode zmizne) — je to len dočasný pohľad.
- Ak stĺpec nevidíš, pridaj ho cez nastavenia zobrazenia (ikonky nad tabuľkou),
  alebo položku jednoducho **nájdi očami / cez vyhľadávanie** (lupa hore).

**Vytvoriť položku (napr. nový agent):**
1. Content → **Agent Config** → vpravo hore **Create Item** (+).
2. Vyplň polia (napr. `agent_name = seo_geo`, `is_active` ✅,
   `text_provider = gemini`, `text_model = gemini-3.5-flash`).
3. Vpravo hore **Save** (✓).

**Upraviť položku (napr. predajný `system_prompt` Writera):**
1. Content → **Agent Config** → klikni riadok `wp_writer`.
2. Uprav pole `system_prompt` → **Save**.

## Tokeny a role (zásada least privilege)

Každý systém má **vlastný token s minimálnymi právami** — bez toho sa platforma
nedá bezpečne replikovať.

| Používateľ | Smie | Token je v |
|---|---|---|
| `frontend-bot` | len **create** `client_leads` | Railway (frontend) `DIRECTUS_TOKEN` |
| `orchestrator-bot` | **read** `agent_config` + **create** `agent_logs` | Railway (orchestrátor) + `orchestrator/.env` `DIRECTUS_TOKEN` |

**Vygenerovať/rotovať statický token používateľa:**
1. **User Directory** → klikni používateľa.
2. Pole **Token** → **Generate Token** → **Save**.
3. Token sa ukáže **iba raz** — hneď ho skopíruj do príslušnej env premennej
   (Railway Variables / `.env`) a ulož.

Práva sa nastavujú v **Settings → Access Policies / Roles** (politika hovorí,
čo rola smie na ktorej kolekcii).

## REST API (pre agentov a skripty)

- **`DIRECTUS_URL` = len základná adresa**, bez `/admin/...` a bez lomky na konci.
- Autorizácia hlavičkou: `Authorization: Bearer <TOKEN>`.
- Čítať config: `GET {DIRECTUS_URL}/items/agent_config?filter[agent_name][_eq]=seo_geo`
- Zapísať log: `POST {DIRECTUS_URL}/items/agent_logs` (JSON telo).
- V kóde to robí `orchestrator/directus.py` (`nacitaj_config`, `zapis_log`).

## Ponaučenia (z denníka)

1. **`DIRECTUS_URL` len základ adresy** — kedysi tam bola celá prihlasovacia
   stránka (`…/admin/login?…`), zápisy „mizli". *Overuj zápis pohľadom do dát,
   nie odpoveďou API.*
2. **Pole s „Required" sa nedá nechať prázdne** — napr. `text_model` vždy vyplň
   konkrétnym modelom pre daného poskytovateľa.
3. **`FORBIDDEN` v admine** často znamená **vypršané prihlásenie** (nie chýbajúce
   právo) — najprv sa odhlás/prihlás, potom debuguj.
