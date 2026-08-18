# Ako viesť sedenia s Claude Code

Konvencia, ako deliť a viesť pracovné sedenia v tomto projekte, aby boli
lacné, rýchle a udržateľné. Vychádza z toho, že **`docs/` je pamäť medzi
sedeniami** (GitHub = zdroj pravdy; každé sedenie číta `dennik.md` + `vizia.md`
na začiatku), takže stav nežije v chate, ale v `docs/`.

## Základný princíp

**1 sedenie = 1 súvislý cieľ / míľnik. Nie 1 bug.**

Súdržnosť kontextu je dôležitejšia než veľkosť problému. Rozdrobiť každú
drobnosť (farba pätičky, posun obrázka) do vlastného sedenia je
kontraproduktívne — každé nové sedenie platí **studený štart**: musí si znova
prečítať `dennik` + `vizia`, znova pochopiť súbory a dizajn systém.

Naopak, tesne súvisiace iterácie (postav sekciu → oprav → over → doladi podľa
feedbacku) patria **do jedného sedenia** — zdieľajú tie isté súbory a kontext,
takže cyklus feedback → oprava → overenie ide rýchlo.

## Kedy založiť nové sedenie

Deľ podľa **domény / vetvy**, nie podľa jednotlivého bugu:

| Nové sedenie, keď… | Príklad |
|---|---|
| Mení sa doména | frontend šablóna → orchestrátor (Fáza 3) → SEO/GEO vrstva → WooCommerce |
| Mení sa vetva | iná `claude/…` vetva = iné sedenie |
| Kontext je „zašumený" | sedenie sa už raz sumarizovalo a zamiešalo veľa nesúvisiacich vecí (build + obrázky + git pomoc + …) → nová úloha si zaslúži čistý štart |

## Plánovanie zvlášť

Pre **veľké alebo nejasné** veci sa oplatí oddeliť plánovanie od vykonávania:

- **Plan mode** (Claude Code navrhne plán a počká na „áno"), alebo
- **krátke plánovacie sedenie**, ktoré závery **zapíše do `docs/plan-agenti.md`**,
  a až potom prídu vykonávacie sedenia.

Pre drobnosti to netreba — rob inline.

## Tvrdé pravidlá (dohodnuté aug 2026)

Po jednom veľmi dlhom **zmiešanom** sedení (porada + kód + dizajn + git pomoc)
sme si stanovili mantinely, ktoré Claude aj majiteľ dodržiavajú:

1. **Jeden TYP na sedenie:** porada/plán · kódovanie · dizajn · agenti —
   **každé zvlášť, nemiešať.** Porada, ktorá sa preklopí do kódovania, je varovný
   signál → rozdeliť do samostatných sedení.
2. **Jedna úloha → dokončiť → overiť → zavrieť.** Žiadne „a ešte toto" v tom
   istom sedení; nový cieľ = nové sedenie.
3. **Claude upozorní**, keď sa sedenie rozbieha mimo cieľ alebo naťahuje, a
   navrhne stop / rozdelenie do ďalšieho sedenia.
4. **Vždy povedať, čo robíme, + presné príkazy do terminálu** (krok po kroku,
   žiadne placeholdery ako `<ID>` bez vysvetlenia, čím ich nahradiť).
5. **Žiadny zhon/tlačenie** — tempo určuje majiteľ; overujeme a potvrdzujeme.
6. **Na konci sedenia: povinné ukončenie** (viď samostatnú sekciu nižšie) —
   sedenie sa nezavrie bez neho.

## Ukončenie sedenia — povinný rituál (nie „dobrý zvyk")

Doplnené 18.8.2026. Dovtedy sa zapisoval len denník a **štartovací prompt pre
nadväzujúce sedenie žil iba v chate** — teda na mieste, ktoré sa zatvorí a je
preč. To je presne ten druh strát, kvôli ktorým `docs/` vôbec existuje.
**Sedenie nie je hotové, kým nie sú hotové obidva body.** Nie je to na zváženie
podľa nálady a majiteľ si to nemá pýtať — patrí to k práci ako `npm run build`.

**1. Zápis do `docs/dennik.md`** — čo sa spravilo, čo je naživo, čo čaká.
Nový záznam navrch, nadpis s dátumom vpredu (`D.M.RRRR`). Patria doň aj
**ponaučenia** („toto nás dnes pomýlilo") a **nálezy mimo zadania**, ktoré sa
zámerne neriešili. Zároveň **odškrtnúť / prepísať** dotknuté položky v Backlogu.

**2. Štartovací prompt pre nadväzujúce sedenie do `docs/plan-agenti.md`** —
vždy, keď z tohto sedenia niečo priamo nadväzuje (a to býva takmer vždy: nález,
ktorý sa zámerne neriešil, alebo ďalší krok plánu). Prompt sa píše **na konci,
kým je kontext čerstvý** — vtedy vie menovať konkrétne súbory, čísla a riadky,
ktoré by ďalšie sedenie inak hľadalo od nuly. Prompt patrí do repa, **nie do
chatu.**

**Čo má dobrý štartovací prompt obsahovať** (vzor: prompty A/B/C v
`plan-agenti.md`):
- úvodné „prečítaj `dennik.md` + `vizia.md`" a odkaz na `CLAUDE.md` pravidlá;
- **TYP sedenia** a výslovne, čo sa doň **nemieša**;
- **východisko s konkrétnymi miestami v kóde** (súbor, konštanta, riadok) a
  reálnym dopadom — nie „chatbot má zlé odpovede", ale „`TOP_K = 5`
  v `lib/rag.ts`, žiadny prah, preto sa ukázal článok o CRM pri otázke
  o kvetinárstve";
- **rozhodnutia, ktoré má sedenie priniesť** (vrátane tých, čo má nechať na
  majiteľa a počkať);
- **mantinely na overenie** — čo cloud sedenie *nevie* overiť (chýbajúce env
  premenné) a zákaz hlásiť „overené", kým to overené nie je;
- kontrolné otázky/kroky, ktorými sa výsledok skúša;
- záver: `lint` + `build`, vetva, PR, merge až na súhlas, zápis do denníka.

**Ak nič nenadväzuje**, napíš to do denníka jednou vetou („nič priamo
nenadväzuje, ďalší krok si majiteľ vyberie z Backlogu") — aby bolo jasné, že sa
na prompt nezabudlo, ale nebol potrebný.

## „Podsedenie k funkcii" = často subagent, nie nové sedenie

Keď treba izolovanú, špecializovanú prácu **v rámci** sedenia (napr. `qa-a11y`
audit prístupnosti, `sk-copywriter` na texty), netreba nové sedenie — spustí sa
**subagent** s vlastným čistým kontextom a vráti výsledok. To je „podsedenie
k problému" bez studeného štartu. (Podľa `plan-agenti.md` máme sub-agentov
`ui-ux-designer`, `frontend-dev`, `sk-copywriter`, `qa-a11y`.)

## Most medzi sedeniami: `dennik.md`

Čím dôslednejšie zapisujeme závery do `docs/dennik.md` (a rozhodnutia do
`vizia.md` / `plan-agenti.md`), tým lacnejšie je sedenia deliť — ďalšie sedenie
sa chytí bez opakovaného vysvetľovania. Tok ostáva:
**sedenie pushuje do GitHubu → používateľ pull-uje** (aj do Obsidianu).

**Formát nadpisu záznamu:** každý nový záznam v `dennik.md` začína nadpisom
s **dátumom vpredu** vo formáte `D.M.RRRR`, napr.
`## 16.8.2026 — Plánovacie sedenie — <stručný cieľ>`. Vďaka tomu je v Obsidiane
(panel **Prehľad**) hneď vidno **časovú os** sedení. Staršie záznamy bez presného
dátumu netreba spätne dopĺňať.

## Zhrnutie (ťahák)

1. **1 sedenie = 1 súvislý cieľ / míľnik** (nie 1 bug).
2. Nové sedenie pri zmene **domény / vetvy** alebo keď je kontext zašumený.
3. **Plánovanie** cez plan mode / krátke plánovacie sedenie → zápis do `plan-agenti.md`.
4. **Vždy zapíš záver do `dennik.md`** — to je most medzi sedeniami.
5. **Vždy zapíš štartovací prompt pre nadväzujúce sedenie do `plan-agenti.md`**
   — kým je kontext čerstvý. Prompt v chate = stratený prompt.
6. Izolovanú kontrolu/prácu rieš **subagentom**, nie novým sedením.
