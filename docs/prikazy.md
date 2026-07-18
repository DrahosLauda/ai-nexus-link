# Knižnica príkazov — terminálový ťahák

> Príkazy, ktoré sme používali pri stavbe AI Nexus Link, po slovensky
> vysvetlené. Slúži na učenie — `<takto>` označuje miesto, kam dopĺňaš vlastnú hodnotu.

## Ako čítať príkazy

- **Terminál** = textové rozhranie, kde píšeš príkazy počítaču.
- Príkaz má tvar: `program argument1 argument2 --prepínač`.
- `&&` = „a potom, ak predchádzajúci uspel" (reťazí príkazy bezpečne).
- `#` na začiatku riadku = komentár (počítač ho ignoruje).
- `~` = tvoj domovský priečinok (`/Users/tvojemeno`).
- `.` = aktuálny priečinok. `..` = o priečinok vyššie.
- Vo VS Code / Claude: príkaz s `!` na začiatku sa spustí priamo v termináli.

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
```

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
ls                # vypíš obsah priečinka
ls -la            # vypíš aj skryté súbory + detaily (veľkosť, dátum)
cd <priecinok>    # zmeň priečinok (change directory)
cp <zdroj> <ciel> # skopíruj súbor
cp ~/Downloads/subor.md .   # skopíruj zo Stiahnutých do aktuálneho priečinka
grep -n "<text>" <subor>    # nájdi text v súbore (s číslami riadkov)
```

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
