# Knižnica príkazov — terminálový ťahák

> Príkazy, ktoré sme používali pri stavbe AI Nexus Link, po slovensky
> vysvetlené. Slúži na učenie — `<takto>` označuje miesto, kam dopĺňaš vlastnú hodnotu.

## Obsah (čo kde nájdeš)

1. Ako čítať príkazy
2. Keď terminál „zamrzne" / nereaguje (odblokovanie)
3. GIT — sledovanie zmien v kóde (vrátane **„čo presne robí každý príkaz"**)
4. NPM a Next.js — frontend
5. Lokálny náhľad — spustiť web
6. Python — orchestrátor / agenti
7. Curl — testovanie API
8. Práca so súbormi (základ) — vrátane **cesty do tvojho repa**
9. Bezpečné návyky
10. Kľúčové skratky vo VS Code

> **Tip na orientáciu (lepší než čísla riadkov):** v **Obsidiane** otvor panel
> **Outline / Osnova** (osnova nadpisov) — klikom skočíš rovno na sekciu. Vo
> **VS Code** máš čísla riadkov automaticky vľavo (do textu sa nepíšu).

## Ako čítať príkazy

- **Terminál** = textové rozhranie, kde píšeš príkazy počítaču.
- Príkaz má tvar: `program argument1 argument2 --prepínač`.
- `&&` = „a potom, ak predchádzajúci uspel" (reťazí príkazy bezpečne).
- `#` na začiatku riadku = komentár (počítač ho ignoruje).
- `~` = tvoj domovský priečinok (`/Users/tvojemeno`).
- `.` = aktuálny priečinok. `..` = o priečinok vyššie.
- Vo VS Code / Claude: príkaz s `!` na začiatku sa spustí priamo v termináli.

---

## Keď terminál „zamrzne" / nereaguje (odblokovanie)

Terminál väčšinou nezamrzol — **čaká na teba**. Podľa toho, čo vidíš:

- **Na začiatku riadka svieti `>`** → nedokončený príkaz (často neuzavretá
  úvodzovka `"` pri kopírovaní). Stlač **`Ctrl + C`** — zruší riadok a vráti
  čistý prompt.
- **Obrazovka plná textu, dole `:` alebo `(END)`** → otvoril sa „pager"
  (prehliadač textu, napr. po `git log` / `git diff`). Stlač **`q`** (quit).
- **Beží dlhý príkaz a chceš ho zastaviť** → **`Ctrl + C`** (preruší).

Ako spoznáš, že je zas OK: vidíš svoj normálny prompt končiaci `$`
(u teba `...ai-nexus-link drahoslauda$`).

---

## GIT — sledovanie zmien v kóde

Tri kópie kódu: **tvoj PC** (lokálne) ↔ **GitHub** (origin) ↔ **Railway** (nasadenie).
Git sa nesynchronizuje sám — pohybuje sa len keď mu to prikážeš.

### Základná orientácia
```bash
git status                    # čo je zmenené / na akej som vetve
git branch --show-current     # názov aktuálnej vetvy
git log --oneline -5          # posledných 5 commitov, stručne (q = ukončiť)
git branch -a                 # zoznam všetkých vetiev
git rev-parse --show-toplevel # vypíš KOREŇ repa (funguje z ľubovoľného podpriečinka)
```

> **Cesta do tvojho repa — presne ako ju napíšeš:**
> ```bash
> cd /Users/drahoslauda/www/ai-nexus-link
> ```
> Rozbor cesty po častiach (číta sa zľava, `/` oddeľuje priečinky):
> - `/Users/drahoslauda` = tvoj domovský priečinok (skratka `~`),
> - `/www` = priečinok, kam si projekt naklonoval,
> - `/ai-nexus-link` = samotný priečinok repa (jeho koreň).
>
> `cd` = *change directory* (zmeň priečinok). Tento príkaz funguje **odkiaľkoľvek**
> (je to „absolútna" cesta — začína `/`). Ak si už v repe len v podpriečinku
> (napr. `orchestrator/`), stačí `cd ..` (o úroveň vyššie do koreňa). Overenie,
> kde si: `pwd`. Overenie koreňa repa: `git rev-parse --show-toplevel`.

### Bežný pracovný cyklus (zapamätaj si ho)
```bash
git checkout main             # postav sa na hlavnú vetvu
git pull                      # stiahni najnovší stav z GitHubu
git checkout -b <nazov-vetvy> # vytvor novú vetvu (dielňu) a prepni sa na ňu
# ... úpravy ...
git add -A                    # priprav VŠETKY zmeny na uloženie
git add <subor>               # alebo len konkrétny súbor
git commit -m "Popis zmeny"   # ulož snímok s popisom
git push -u origin <nazov>    # odošli vetvu na GitHub (prvýkrát)
git push                      # odošli (nabudúce už stačí takto)
```

### Vetvy (branches) a zlučovanie
```bash
git checkout <nazov>          # prepni sa na existujúcu vetvu
git checkout -b <nazov>       # vytvor novú a prepni sa
git branch -d <nazov>         # zmaž lokálnu vetvu (bezpečne, len ak je zmergovaná)
git merge <nazov>             # zlúč vetvu do aktuálnej (radšej cez PR na GitHube)
git fetch origin --prune      # zisti novinky z GitHubu + zahoď zmazané vetvy
```

### Diff — čo presne sa zmenilo
```bash
git diff                      # neuložené zmeny oproti poslednému stavu
git diff main..<vetva>        # rozdiel medzi dvomi vetvami
git show <hash>               # čo obsahoval konkrétny commit
```

### Bundle — prenos zmien súborom (náš „bundle tanec")
```bash
git bundle create subor.bundle origin/main..main   # zabaľ nové commity do súboru
git fetch ~/Downloads/subor.bundle <vetva>:<vetva> # vybaľ z bundle do vetvy
```

### Záchrana a kontrola
```bash
git checkout main             # zahoď rozpracované, vráť sa na main (opatrne)
git reset --hard origin/main  # zROVNAJ lokálnu vetvu presne s GitHubom (POZOR: zmaže lokálne zmeny)
git config user.email <email> # nastav identitu autora commitov
```

### Push vs Pull vs Clone — a synchronizácia s Obsidianom

Tri kľúčové slová, ktoré si treba osvojiť:

- **`git clone <adresa>`** = úplne prvé stiahnutie celého repa z GitHubu k sebe
  (spravíš raz). Vytvorí priečinok s projektom.
- **`git pull`** = *stiahni* najnovšie zmeny z GitHubu **k sebe** (⬇️ nadol).
  Toto robíš **ty na Macu**, keď chceš mať aktuálne súbory (aj v Obsidiane).
- **`git push`** = *odošli* svoje commity **na GitHub** (⬆️ nahor). Toto za teba
  robí Claude sedenie — ty pushovať nemusíš.

```bash
git clone <adresa-repa>       # prvé stiahnutie (raz)
git pull                      # stiahni najnovší stav aktuálnej vetvy z GitHubu
git pull origin <vetva>       # stiahni konkrétnu vetvu explicitne
                              # napr. git pull origin claude/m1-frontend-agent-templates-94ksdt
```

Konkrétne — stiahnuť plánovaciu vetvu k sebe (a do Obsidianu), odkiaľkoľvek:
```bash
cd /Users/drahoslauda/www/ai-nexus-link      # skoč do koreňa repa
git fetch origin                             # zisti novinky z GitHubu
git checkout claude/florist-sales-model-replan-h56mov   # prepni sa na vetvu
git pull origin claude/florist-sales-model-replan-h56mov # stiahni jej obsah
```
> Ak zmeny už sú v `main` (po zlúčení PR), stačí: `git checkout main && git pull`.

**Náš tok (zapamätaj si):** *sedenie pushuje → ty pull‑uješ.* Repo máš naklonované
na Macu; keď chceš zmeny vidieť v **Obsidiane**, spravíš **`git pull`** (alebo to
robí automaticky plugin „Obsidian Git"). GitHub = hlavná záloha, Obsidian = ďalšia
lokálna záloha tvojich poznámok (`docs/`).

### Čo presne robí každý príkaz (keď si ideš pozrieť vetvu zo sedenia)

Toto je celá postupnosť, ktorou si u seba naživo otvoríš prácu z Claude sedenia.
Príkazy sú vysvetlené po jednom — nie sú to zaklínadlá.

```bash
cd /Users/drahoslauda/www/ai-nexus-link   # 1. skoč do koreňa repa
git fetch origin                          # 2. zisti, čo je nové na GitHube
git checkout <nazov-vetvy>                # 3. prepni súbory na tú vetvu
git pull                                  # 4. dotiahni jej najnovší obsah
cd frontend                               # 5. vstúp do priečinka frontendu
npm run dev                               # 6. spusti web na svojom počítači
```

**1. `cd /Users/drahoslauda/www/ai-nexus-link`**
Obyčajné „prejdi do priečinka" (nie je to gitový príkaz). Všetky ďalšie príkazy
musia bežať vnútri repa, inak Git nevie, s čím pracuje. Späť o úroveň vyššie sa
dostaneš cez `cd ..`.

**2. `git fetch origin`**
Stiahne z GitHubu informácie o všetkých vetvách a nových commitoch — **ale nič ti
nezmení v súboroch**. Je to ako „stiahni si poštu, ale zatiaľ ju neotváraj". Bez
tohto by tvoj Mac o novej vetve z čerstvého sedenia ani nevedel.

**3. `git checkout <nazov-vetvy>`**
Prepne tvoj pracovný priečinok na tú vetvu — súbory na disku sa reálne prepíšu na
verziu z nej (objavia sa nové súbory, zmazané zmiznú). **`main` tým nepokazíš**,
späť sa vrátiš cez `git checkout main`. Ak si na vetve už bol, Git len napíše
„Already on…".

**4. `git pull`**
Dotiahne najnovšie commity **pre vetvu, na ktorej práve stojíš**, a zapíše ich do
súborov. Rozdiel oproti bodu 2: `fetch` len oznámi „je tam nové", `pull` to naozaj
natiahne. Preto je poradie fetch → checkout → pull: Git najprv o vetve zistí, potom
sa na ňu prepneš, a nakoniec dotiahneš všetko, čo na nej odvtedy pribudlo.

**5. `cd frontend`**
Vojde do priečinka `frontend/` vnútri repa. Next.js aplikácia a jej `package.json`
so skriptmi žijú tam, nie v koreni repa — preto sa spúšťa odtiaľ.

**6. `npm run dev`**
Spustí vývojový server Next.js (skript `dev` z `frontend/package.json`). Zostane
bežať a **„drží" terminál** — kým ho nezastavíš cez `Ctrl+C`, nemôžeš doň písať
ďalšie príkazy. Vypíše adresu `http://localhost:3000`, čo je web bežiaci **len na
tvojom počítači** (nikto iný ho nevidí). Keď sa v kóde niečo zmení, sám sa prekreslí.

> **Netreba `npm install`**, pokiaľ v sedení nepribudol nový balík. Ak by terminál
> hlásil chýbajúci modul, spusti v `frontend/` príkaz `npm install` a potom znova
> `npm run dev`.
>
> **Hlavná stránka `http://localhost:3000/` a blog** ťahajú obsah z WordPressu, takže
> lokálne bez env premenných budú prázdne — to je v poriadku. Šablóny pod
> `/ukazky/*` sú sebestačné a bežia celé.

---

## NPM a NEXT.JS — frontend (priečinok `frontend/`)

```bash
cd frontend                   # vstúp do priečinka frontendu
npm install                   # nainštaluj závislosti (balíčky)
npm run dev                   # vývojový server → http://localhost:3000
npm run build                 # produkčný build (skontroluje chyby)
npm run start                 # spusti produkčnú verziu
npm run lint                  # kontrola kvality kódu (ESLint)
```
Poznámka: `npm run <nieco>` spúšťa skripty definované v `package.json`.

---

## LOKÁLNY NÁHĽAD — spustiť web a pozrieť ho (aj na mobile)

Spustí sa vývojový server na tvojom Macu. Šablóna kvetinárstva žije na podceste
`/ukazky/kvetinarstvo` (samotné `/` je projekt digitalnapomoc).

```bash
cd frontend                   # dev skript je v priečinku frontend/
npm run dev                   # spusti server (nechaj bežať; vypíše Local + Network)
```
Server vypíše dve adresy:
```
- Local:    http://localhost:3000       # otvor na tom istom PC
- Network:  http://192.168.1.230:3000    # otvor z iného zariadenia na tej istej WiFi
```
Šablónu otváraj vždy s celou cestou:
```
http://localhost:3000/ukazky/kvetinarstvo
```

### Pozrieť na mobile (telefón na rovnakej WiFi ako Mac)
```bash
ipconfig getifaddr en0        # zisti IP adresu Macu vo WiFi (napr. 192.168.1.230)
# ak nič nevypíše, skús:  ipconfig getifaddr en1
```
Potom v prehliadači telefónu zadaj `http://<IP>:3000/ukazky/kvetinarstvo`
(s `http://`, nie `https://`). Ak straší starý vzhľad, otvor to v **inkognito**
okne (obíde cache).

### Keď sa dev server nechce spustiť („port in use" / „Another next dev server")
```bash
kill <PID>                    # zastav starý server (číslo PID vypíše hláška)
npm run dev                   # spusti nanovo
```

> Po `git pull` sa bežiaci dev server obnoví sám — netreba reštart, stačí
> obnoviť prehliadač (na PC tvrdo: `Cmd+Shift+R`).

---

## PYTHON — orchestrátor / agenti (priečinok `orchestrator/`)

```bash
cd orchestrator               # vstúp do priečinka
source venv/bin/activate      # zapni izolované prostredie (venv) pre tento terminál
python main.py                # test spojenia s Directusom
python wp_writer_agent.py "<Téma článku>"    # napíš článok + obrázky → WP koncept
python fix_post_images.py <ID> "<Téma>"      # oprav obrázky v existujúcom článku
python3 -m py_compile <subor.py>             # over, či skript nemá syntaktickú chybu
```

---

## CURL — testovanie API bez prehliadača

`curl` pošle požiadavku na server presne ako aplikácia, ale z terminálu.

```bash
# Zisti len návratový kód (200 = OK, 404 = nenájdené, 401 = neautorizované)
curl -s -o /dev/null -w "%{http_code}\n" <URL>

# Otestuj revalidačný webhook (obnova blogu)
curl -X POST "https://<domena>/api/revalidate?secret=<SECRET>"

# Odošli testovací lead (POST s JSON telom)
curl -X POST https://<domena>/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","source":"manual-test"}'

# Prečítaj dáta z API s tokenom (Authorization hlavička)
curl -s "<DIRECTUS_URL>/items/client_leads" -H "Authorization: Bearer <TOKEN>"
```
Vysvetlenie prepínačov: `-X` = metóda (POST/GET), `-H` = hlavička,
`-d` = telo požiadavky, `-s` = tichý režim, `-o /dev/null` = zahoď telo,
`-w` = vypíš vybraný údaj (napr. návratový kód).

---

## PRÁCA SO SÚBORMI (základ)

```bash
pwd               # vypíš, v ktorom priečinku práve si (print working directory)
ls                # vypíš obsah priečinka
ls -la            # vypíš aj skryté súbory + detaily (veľkosť, dátum)
cd <priecinok>    # vstúp do priečinka (change directory) — NIE git checkout!
cd ..             # o priečinok vyššie (napr. z frontend/ späť do ai-nexus-link)
cd /Users/<meno>/www/ai-nexus-link   # skoč presne na cestu (funguje odkiaľkoľvek)
cp <zdroj> <ciel> # skopíruj súbor
cp ~/Downloads/subor.md .   # skopíruj zo Stiahnutých do aktuálneho priečinka
grep -n "<text>" <subor>    # nájdi text v súbore (s číslami riadkov)
```
> Pozor na zámenu: **`cd`** mení priečinok (kde v počítači si). **`git checkout`**
> prepína vetvy/verzie kódu. Sú to dve úplne rozdielne veci.

---

## Bezpečné návyky (zapamätaj si)

- **Do `main` nikdy priamo** — vždy cez vetvu + pull request (výnimka: jednoriadkové drobnosti).
- **Pred prácou vždy** `git checkout main && git pull` — začni z čerstvého stavu.
- **Tajomstvá** (tokeny, heslá, API kľúče) nikdy do kódu — len do `.env` (je v `.gitignore`).
- **URL premenné** (DIRECTUS_URL, WP_URL) = len základná adresa, bez `/admin/...` a bez lomky na konci.
- **Zápis over pohľadom do dát**, nie odpoveďou API (`{"ok":true}` nemusí znamenať, že sa reálne uložilo).
- Keď sa niečo udeje **na GitHube** (merge tlačidlom), lokálne to uvidíš až po `git pull`.

---

## Kľúčové skratky vo VS Code

- `` Ctrl+` `` (Mac `` ^+` ``) — otvor/zavri terminál
- `Cmd+P` — rýchlo otvor súbor podľa názvu
- `Cmd+F` — hľadaj v súbore · `Cmd+Shift+F` — hľadaj v celom projekte
- `Cmd+S` — ulož · `Cmd+Shift+R` (v prehliadači) — tvrdé obnovenie (obíde cache)
- `Shift+Tab` (v Claude Code) — prepínanie režimov povolení
