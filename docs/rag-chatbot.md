# RAG chatbot — štartový dokument (runbook + plán)

> Ako postaviť a spustiť **prvé živé demo RAG chatbota** na `digitalnapomoc.sk`.
> Runbook pre nové Claude Code sedenie + celý plán po krokoch. Širšia vízia a
> dôvody: `vizia.md` §11. Jazyk: slovenčina.
>
> **Pravidlo:** commit + push do vetvy a otvorenie PR je OK; **pred mergom do
> `main` a pred akoukoľvek zmenou v Railway / databáze VŽDY počkať na súhlas
> používateľa.**

## 📋 Prompt na spustenie nového sedenia (skopíruj do nového Claude sedenia)

```
Najprv si prečítaj docs/dennik.md a docs/vizia.md (kontext, rozhodnutia,
ponaučenia). Potom pracujeme na RAG chatbotovi podľa docs/rag-chatbot.md a
docs/vizia.md §11. Cieľ: prvé živé demo chatbota na našom webe, ktorý odpovedá
Z NÁŠHO obsahu (WP články + FAQ + stránka /headless-wordpress) cez RAG.
Vektory ukladáme do našej PostGIS databázy ako pole real[] a podobnosť počíta
/api/chat v pamäti (Cesta B — bez pgvectora, bez novej služby). Postupuj po
krokoch z runbooku. Commit + push do vetvy môžeš, ale pred mergom do main a
pred zmenami v Railway/DB počkaj na moje "áno".
```

---

## Aug 2026 — FABLE-ladený system prompt (anti-halucinácia)

System prompt chatbota (`frontend/lib/rag.ts`, konštanta `SYSTEM_PROMPT`)
prepísaný podľa **ducha FABLE protokolu** (viď `docs/plan-agenti.md` →
„Ponaučenia z podkladov"): pravda nad plynulosťou, odpovedať výhradne z kontextu,
**nikdy nevymýšľať konkrétne údaje** (ceny, termíny, čísla, URL), pri neistote
priznať „neviem" a nasmerovať na kontaktný formulár, neznižovať latku ani pri
tlaku „len áno/nie". Zachované doterajšie správanie (slovenčina, stručnosť,
nespomínať „kontext"/články).

- **Kde žije dnes:** natvrdo v kóde (`lib/rag.ts`). **Backlog Krok 5** = presunúť
  toto znenie do Directus `agent_config` (riadok `chatbot`), aby sa dalo meniť
  klikaním bez zásahu do kódu. Dovtedy je zmena promptu = zmena kódu na vetve.
- **Nasadenie:** na vetve; **naživo až po merge do `main`** (Railway deployuje
  z `main`) — počkať na súhlas.

## Aug 2026 — Výstup a štýl odpovedí (dĺžka, formátovanie, zdroje)

Doladené 18.8.2026 (vetva `claude/chatbot-output-style-ezl918`). Tri veci, všetky
v `frontend/lib/rag.ts` a `frontend/components/chat-widget.tsx`:

- **Zdroje = len to, čo model naozaj použil.** Kúsky idú do promptu očíslované
  `[1]…[5]`; model na koniec odpovede pripojí riadok `ZDROJE: 1,3` (alebo
  `ZDROJE: -`). Server ho odreže z textu a čísla preloží na odkazy (`splitCited`).
  **Prah kosínovej podobnosti sme zámerne nepoužili** — absolútny sa bez prístupu
  k dátam nedá zmerať a relatívny zlyháva pri otázkach, na ktoré odpoveď nemáme
  (všetky skóre nízke a blízko seba → prešli by všetky). Zdôvodnenie v denníku.
- **Koľko zdrojov:** `TOP_K = 5` (kontext modelu) vs. `MAX_SOURCES = 3` (čo vidí
  návštevník). Strop žije **len** v `lib/rag.ts`, widget už nekráti.
- **Formátovanie:** widget vykresľuje minimálny markdown (`**tučné**`, odrážky
  `- `, odstavce) cez `ChatText` — bez novej závislosti a bez
  `dangerouslySetInnerHTML`. Nadpisy, tabuľky a číslované zoznamy prompt zakazuje.
- **Dĺžka a tón:** 2 – 4 vety, ~70 slov, žiadne zdvorilostné úvody; **výzva na
  kontaktný formulár len keď odpoveď nepoznáme alebo ide o cenu/termín/rozsah**,
  a nikdy dvakrát v jednom rozhovore. Anti-halucinačné zásady 1 – 5 nedotknuté.

**Zmena tohto správania = zmena kódu** (kým nie je hotový Krok 5 — config
v Directuse). **Re-index netreba** — mení sa odpovedanie, nie obsah kúskov.
Naživo až po merge do `main`.

## 1. Čo je RAG a načo vôbec je (po ľudsky)

Predstav si, že si najmeš šikovného asistenta (to je AI model, napr. Gemini).
Vie krásne rozprávať, ale **nepozná tvoj web** — nevie, čo ponúkaš, aké máš
ceny, čo je v tvojich článkoch. Keby si sa ho spýtal „koľko stojí u vás tvorba
webu?", vymyslí si niečo, alebo povie „neviem".

**RAG = Retrieval-Augmented Generation** = „generovanie obohatené o vyhľadávanie".
Funguje v troch krokoch:

1. **Retrieval (vyhľadaj):** keď príde otázka, systém najprv **v tvojom obsahu
   nájde kúsky, ktoré s otázkou súvisia** (napr. odsek o cenách z článku).
2. **Augmented (prilož):** nájdené kúsky **priloží k otázke** ako „ťahák".
3. **Generation (odpovedz):** AI dostane otázku + ťahák a odpovie **len na
   základe tvojho obsahu**, nie z brucha.

Prirovnanie: je to ako dať študentovi na skúšku **otvorenú knihu**. Nemusí
vedieť všetko naspamäť — stačí, že vie rýchlo nalistovať správnu stranu. RAG je
to „rýchle nalistovanie".

**Prečo to potrebujeme:** aby chatbot odpovedal **pravdivo a podľa nášho
obsahu**, nie vymyslené hlúposti. To je rozdiel medzi „hračka, čo si vymýšľa" a
„nástroj, čo predáva".

### Čo je „embedding" (jediný pojem, čo sa oplatí pochopiť)

Počítač nevie „rozumieť" vetám ako človek. Keď sa niekto spýta *„čo ma to bude
stáť?"* a v článku máš *„cena za tvorbu webu"*, sú to iné slová — obyčajné
hľadanie podľa slov (ako Ctrl+F) by to nespojilo.

**Embedding** je spôsob, ako **premeniť význam textu na zoznam čísel** (u nás
768 čísel). Vety s podobným významom dostanú podobné čísla. Je to ako **GPS
súradnice pre význam** — každý kúsok textu dostane „adresu" v priestore
významov. Keď príde otázka, spočíta sa jej adresa a hľadáme, **ktoré kúsky
bývajú najbližšie**. To meranie vzdialenosti sa volá *kosínusová podobnosť*
(len vzorec).

Tie čísla si treba **uložiť**, aby sa nepočítali stále odznova — a to je celá
„RAG databáza": obyčajná tabuľka, kde v jednom stĺpci je text kúska a vedľa
jeho 768 čísel.

---

## 2. Naše rozhodnutie: Cesta B (bez pgvectora, bez novej služby)

Vektory vieme ukladať dvoma spôsobmi:

| | **Cesta B — teraz** | **Cesta A — neskôr, keď bude treba** |
|---|---|---|
| Kde | existujúca PostGIS (Directusov Postgres) | nová Railway Postgres s `pgvector` |
| Vektor | obyčajný stĺpec `real[]` (pole čísel) | špeciálny typ `vector(768)` |
| Hľadanie | kosínus počíta náš kód `/api/chat` v pamäti | počíta databáza cez index (hnsw/ivfflat) |
| Náklad | **0 € navyše** | **~5 €/mes.** (ďalšia bežiaca služba) |
| Vhodné pre | malý web (stovky–nízke tisíce kúskov) | veľký obsah (desaťtisíce kúskov) |

**Prečo B teraz:** je zadarmo, stabilné a pre náš malý web úplne dostačujúce
(hľadanie v pamäti = pár ms/otázka). `pgvector` nie je v PostGIS obraze a ručná
inštalácia by pri redeploy zmizla — preto ho nechávame na neskôr. **Prechod
B → A je malý** (v podstate zmena typu stĺpca + pridanie indexu), spravíme ho,
keď bude mať klient toľko obsahu, že hľadanie v pamäti začne byť pomalé.

---

## 3. Architektúra (tok dát)

```
Obsah (WP články + FAQ + /headless-wordpress)
   → rozsekať na kúsky → embedding (vektor) → uložiť do rag_chunks (real[])

Otázka návštevníka
   → embedding otázky → načítať kúsky → spočítať kosínus v pamäti → top-k kúskov
   → poskladať prompt → model odpovie z kúskov → odpoveď + zdroje
```

---

## 4. Postup po krokoch

**Krok 1 — Príprava DB** *(schéma hotová, klikacia časť na používateľovi):*
- Schéma je v `orchestrator/rag_schema.sql` (tabuľka `rag_chunks` s `embedding real[]`,
  unikátny index na `(source_url, chunk_index)` kvôli bezpečnému re-indexu).
- Spustiť SQL v Railway → PostGIS → Console (`psql`).
- Pridať env `RAG_DATABASE_URL` (connection string na PostGIS) do **orchestrátora**
  aj **frontendu** — najlepšie referenciou `${{ PostGIS.DATABASE_URL }}`.
- *Zásada „každý systém jedna rola": `rag_chunks` je NAŠA tabuľka v tom istom
  Postgrese, nie Directus kolekcia. Obsah webu tak nejde do Directusu.*

**Krok 2 — Indexovací modul** (`orchestrator/rag_index.py`):
- Načíta WP články (REST), FAQ (`frontend/lib/content.ts`) a text stránky
  `/headless-wordpress`.
- Rozseká na kúsky (~500–800 tokenov, mierny prekryv).
- Zavolá Gemini embeddings (`text-embedding-004`, 768 dim).
- Pre každý zdroj: **zmaž staré kúsky → vlož nové** (delete-then-insert podľa
  `source_url`), aby po skrátení obsahu neostali osirené kúsky.
- `content_hash` na preskočenie nezmenených zdrojov (šetrí volania API).
- Spúšťanie: cronom + pri publikovaní článku (existujúci webhook).

**Krok 3 — Odpovedací API** (`frontend/app/api/chat/route.ts`):
- Vstup: otázka (+ voliteľne história). Rate limit ako `/api/lead` (5/10 min/IP).
- Embedne otázku → `SELECT` kúskov z `rag_chunks` → **kosínus v pamäti (JS)** →
  top-k kúskov.
- Poskladá prompt (systémový: „odpovedaj len z priloženého kontextu; keď tam
  odpoveď nie je, povedz to a odkáž na kontakt") + kúsky ako kontext.
- Zavolá model, vráti odpoveď **+ zoznam zdrojov** (odkazy na články).

**Krok 4 — Frontend widget** (`frontend/components/chat-widget.tsx`):
- Bublina vpravo dole, po kliknutí panel s chatom.
- Volá `/api/chat`, zobrazí odpovede + zdroje. Prístupné (klávesnica, aria).

**Krok 5 — Config + logy + token:**
- Directus `agent_config` riadok `chatbot` (model, prompt, k…); `agent_logs`.
- Vlastný token / prístup s minimálnymi právami (least privilege).

**Krok 6 — Test + nasadenie:**
- Lokálne otestovať odpovede a zdroje; potom deploy cez `main` (po súhlase).

---

## 5. Bezpečnosť a kvalita

- Chatbot **iba číta** (nikdy nezapisuje do WP/Directusu okrem vlastných logov).
- **Anti-halucinácia:** keď medzi kúskami nie je odpoveď → „toto zatiaľ neviem,
  napíšte nám" (nevymýšľať).
- Rate limit na `/api/chat`. Tajomstvá len v env premenných.

---

## 6. Otvorené rozhodnutia

- Model na odpoveď (cena vs kvalita): Gemini / Z.ai GLM / Claude.
- `k` (počet priložených kúskov) a veľkosť kúska.
- Kedy prejsť z Cesty B na A (prah počtu kúskov / rýchlosť odpovede).

---

## 7. Bonus — „chat s Obsidianom"

Rovnaký RAG vzor sa dá pustiť nad vlastným Obsidian vaultom (poznámky →
embeddingy → chat). Dobrý interný test technológie pred nasadením klientom.

---

## 8. 📝 Podklad pre blogový článok (pre copywriter agenta)

> **Pre copywriter agenta:** z tejto sekcie vieš napísať blogový článok pre
> `digitalnapomoc.sk` o tom, čo je RAG chatbot a prečo ho firma potrebuje.
> Cieľová skupina: **majitelia malých firiem a živnostníci, laici** — píš
> jednoducho, bez žargónu, s prirovnaniami. Tón: priateľský, dôveryhodný, „ukáž
> hodnotu, nestraš technikou". Na konci jemná výzva na akciu (kontakt / demo).
> Nasledujúce sú **fakty a myšlienky**, nie hotový text — preštylizuj do článku.

**Možný titulok (na inšpiráciu):**
- „Chatbot, ktorý si nevymýšľa: ako AI odpovedá zákazníkom z vášho vlastného webu"
- „Prečo obyčajný chatbot klame a ako to RAG rieši"

**Kľúčové posolstvá do článku:**

1. **Problém:** bežná AI (ako ChatGPT) je výrečná, ale **nepozná váš web** — na
   otázku o vašich cenách alebo službách si vymyslí odpoveď (halucinuje). To je
   pre firmu nebezpečné.
2. **Riešenie — RAG jednoducho:** je to ako dať AI na skúšku **otvorenú knihu**
   (váš web). Nemusí nič vedieť naspamäť — pri každej otázke si **nalistuje
   správnu stranu vo vašom obsahu** a odpovie len z nej. Preto neklame.
3. **Ako to funguje v troch krokoch** (bez techniky): nájdi vo vašom obsahu, čo
   súvisí s otázkou → prilož to k otázke → nechaj AI odpovedať len z toho.
4. **Prečo je to lepšie ako „naučiť AI náš web natvrdo":** keď zmeníte cenník,
   stačí upraviť obsah — netreba nič pracne pretrénovávať. Chatbot je vždy
   aktuálny.
5. **Hodnota pre firmu (toto zdôrazniť):**
   - odpovedá zákazníkom **24/7**, aj keď spíte;
   - **menej zmeškaných zákazníkov** a opakovaných otázok mailom/telefónom;
   - **vyššia dôvera a konverzia** — návštevník dostane odpoveď hneď a môže
     rovno nechať kontakt;
   - **neklame** — hovorí len to, čo naozaj máte na webe, a vie odkázať na zdroj.
6. **Pointa na koniec:** takýto chatbot vieme nasadiť **na váš web z vášho
   obsahu**. Tento web má jeden nasadený ako ukážku — napíšte nám a ukážeme vám ho.

**Čomu sa v článku vyhnúť:** slovám „embedding", „vektor", „pgvector",
„kosínusová podobnosť", názvom modelov. Ak treba, nahraď prirovnaním
(„AI si spraví akúsi mapu významov vášho obsahu"). Článok nie je technická
dokumentácia, ale predajný/vzdelávací obsah pre laika.

---

## 9. Widget — vzhľad, maskot a hlas (roadmap)

**Vzhľad (hotové, Krok 4):** plávajúca bublina vpravo dole na každej stránke,
po kliknutí panel s chatom v našom glassmorphism štýle (indigo/violet hlavička).
Odpoveď + odkazy na zdroje (`www…/blog/…`) → buduje dôveru (nevymýšľa si).
Prístupné: klávesnica (Enter odošle, Escape zavrie), aria, mobil.

**Maskot (hotové/vo vývoji):** ikonu tvorí **fialový robot-maskot** (vektorový
SVG) — jemne **svieti** a **máva** (CSS animácie, s ohľadom na
`prefers-reduced-motion`). Zámerne vektor, nie zapečený raster z článkových
obrázkov (ten je plochý a nedá sa animovať). Rovnaký maskot vieme neskôr
použiť aj inde (hero, e-maily) ako prvok značky.

**Hlas (fáza 2 — neskôr):** prvé demo je **písaný chat** (jednoduché, spoľahlivé,
prakticky zadarmo). Hlas sa dá pridať ako vylepšenie, dve cesty:
- **Zadarmo, vstavané v prehliadači** (Web Speech API): mikrofón → text a text →
  hlas. Výhoda: 0 €. Nevýhoda: **slovenčina je slabšia** (roboticky znejúca,
  na mobiloch nekonzistentná).
- **Platené hlasové služby** (kvalitný TTS/STT): slovenčina znie prirodzene, ale
  **stojí to** mesačne/za minútu — pri nízkom Railway kredite zatiaľ počkať.

Odporúčanie: hlas je skvelý „wow" prvok na demo aj predaj, ale pridať ho až keď
písaný základ šľape a rozhodneme sa medzi lacnou (browser) a kvalitnou (platenou)
cestou.
