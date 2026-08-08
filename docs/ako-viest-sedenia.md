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

## Zhrnutie (ťahák)

1. **1 sedenie = 1 súvislý cieľ / míľnik** (nie 1 bug).
2. Nové sedenie pri zmene **domény / vetvy** alebo keď je kontext zašumený.
3. **Plánovanie** cez plan mode / krátke plánovacie sedenie → zápis do `plan-agenti.md`.
4. **Vždy zapíš záver do `dennik.md`** — to je most medzi sedeniami.
5. Izolovanú kontrolu/prácu rieš **subagentom**, nie novým sedením.
