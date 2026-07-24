# Zdroje pravdy — kde čo žije a kam ukladať

> Aby sme boli stále „v obraze" a vedeli všetko obnoviť aj pri neočakávaných
> veciach (zlyhanie Macu, rozbitá služba, únik secret…). Zlaté pravidlo je dole.

## Tri zdroje pravdy

1. **GitHub repozitár `ai-nexus-link`** — kanonický zdroj pre **kód,
   dokumentáciu, denník a ponaučenia.** V cloude, verzovaný (celá história zmien),
   zálohovaný samotným GitHubom.
2. **Živé prevádzkové služby** — skutočný *runtime* stav systému:
   - **Directus** (Railway) = CRM leady (`client_leads`) + agent config a logy
     (`agent_config`, `agent_logs`).
   - **Railway** = nasadený kód (frontend + orchestrátor) + **secrets**
     (env premenné) + cron rozvrh.
   - **WordPress** (`www.digitalnapomoc.sk`) = obsah (články, médiá).
3. **Lokálny klon na Macu = Obsidian vault** — pracovná kópia repozitára +
   pohodlné okno na čítanie/písanie dokumentácie. **Nie je samostatný zdroj** —
   je to zrkadlo #1, synchronizované cez `git pull` / `git push`.

## Kam ukladať čo (pravidlo)

| Čo | Kam | Poznámka |
|---|---|---|
| Kód, dokumentácia, denník, ponaučenia | **Repozitár** (commit + push) | nikdy len lokálne / „v hlave" |
| Secrets (tokeny, API kľúče, heslá) | **len env** (Railway Variables / `.env`) | **NIKDY do repa** |
| Runtime nastavenia agentov | **Directus `agent_config`** | + zapísať stav aj do denníka (živý Directus z cloud sedenia nevidno) |
| Obsah (články, médiá) | **WordPress** | agent tvorí koncepty, publikuje človek |
| Leady z formulárov | **Directus `client_leads`** | nikdy do WP |

## Ako sa to synchronizuje (Obsidian ↔ repo ↔ GitHub)

- **GitHub** (cloud) ↔ **lokálny Mac priečinok**: `git pull` stiahne, `git push`
  odošle.
- **Obsidian** len zobrazuje ten lokálny priečinok — preto **ukazuje len to, čo
  si naposledy pullol.** Nové commity uvidíš v Obsidiane až po `git pull`.
- **Zásada:** `git pull` **pred** prácou, `git push` **po** nej — nech všetky
  okná (GitHub, Mac, Obsidian) sedia.

## Obsidian v skratke

- **Vault** = obyčajný priečinok s Markdown (`.md`) súbormi. Žiadna proprietárna
  databáza — čisté textové súbory, **lokálne a offline.**
- Nastavenia Obsidianu sú v skrytom priečinku `.obsidian/` vnútri vaultu.
- Synchronizácia: Obsidian Sync (platený) alebo tretia strana (git, iCloud…).
  My používame **git** — náš vault = git repo priečinok `ai-nexus-link`.
- Vďaka čistým súborom Obsidian a git spolu fungujú bez problémov.

## Obnova „v prípade neočakávaných vecí"

- **Zlyhá Mac / stratíš lokálny klon** → repo je na GitHube: `git clone` na nový
  stroj a máš všetko späť.
- **Rozbije sa Directus / Railway / WordPress** → denník má zapísaný **stav**
  (hodnoty `agent_config`, zoznam env premenných, cron rozvrh, architektúra) →
  vieme to nastaviť znova. *Preto stav živých služieb píšeme aj do denníka.*
- **Secrets** nie sú v repe → po obnove ich znova vložíš z bezpečného miesta
  (správca hesiel) do Railway Variables / `.env`.
- **Kód** má plnú históriu v gite → dá sa vrátiť ktorákoľvek verzia.

## Zlaté pravidlo

Ak niečo dôležité existuje **len na jednom mieste** (len v hlave, len lokálne,
len v živej službe), **nie je to bezpečné.** Preto:

- Kód a znalosti → **repozitár** (a tým aj GitHub + tvoj Obsidian po `pull`).
- Secrets → **env + správca hesiel** (nie repo).
- Stav živých služieb → **aj do denníka**, nech vieme obnoviť.
