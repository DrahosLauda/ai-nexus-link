Podrobne preskumaj tento odkaz: https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf?linkId=62355775\&fbclid=IwdGRleASfto1leHRuA2FlbQIxMQBzcnRjBmFwcF9pZAo2NjI4NTY4Mzc5AAEeJJ7K9tHp0mxFKxoRUGK0AFU5WTKvY5cM5crfrEnk137OmBJHV50L-ghqVUc\_aem\_JkjqMSXyyE8r6x8qTsqrmA a plus tento: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing a podrobne mi vysvetli na praktickych prikladoch jeho vyuzitie. Aky je rozdiel medzi tymto a napr: https://github.com/moorcheh-ai/memanto a este tymto nastrojom z Githubu? : https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f   
Programovací partner  
Tieto odkazy dokumentujú významný posun v tom, ako systémy umelej inteligencie (LLM a autonómni agenti) pracujú s pamäťou a kontextom. Všetky tri prístupy riešia zásadný problém: **ako zabrániť „amnézii“ AI agentov, ušetriť tokeny a efektívne prepájať informácie.** Každý z nich to však robí z úplne inej perspektívy.  
Poďme si podrobne rozobrať jednotlivé technológie, ich praktické príklady a kľúčové rozdiely.

### **1\. Čo je Open Knowledge Format (OKF)?**

Zdroj: GoogleCloudPlatform/knowledge-catalog a Google Cloud Blog  
**Open Knowledge Format (OKF)** je otvorený, od dodávateľov nezávislý štandard určený na ukladanie a zdieľanie vedomostí tak, aby boli zrozumiteľné **ľuďom** aj **AI agentom**.  
Technicky ide o obyčajný adresár plný **Markdown súborov (.md) s YAML frontmatterom** (metaúdajmi na začiatku súboru). Vyžaduje len jedno povinné pole v metaúdajoch: type. Všetko ostatné je rozšíriteľné.

#### **Praktické príklady využitia OKF:**

Predstavte si, že máte firmu a chcete, aby vaši AI boti dokonale rozumeli vašim dátam a interným predpisom.  
**Príklad 1: Dokumentácia firemných metrik (KPI)**

* Máte súbor revenue\_kpi.md:  
* YAML

\---  
type: metric  
id: monthly\_recurring\_revenue  
owner: finance-team  
tags: \[finance, saas, kpi\]  
timestamp: 2026-06-15  
\---  
\# Monthly Recurring Revenue (MRR)  
Definícia: Celkové predvídateľné výnosy generované našimi predplatiteľmi za mesiac.

\#\# SQL dotaz pre výpočet v BigQuery:  
\`\`\`sql  
SELECT SUM(subscription\_price) FROM \`my\_project.finance.active\_subs\` WHERE status \= 'active';

*   
* Keď váš AI agent dostane otázku od riaditeľa: "Aká bola hodnota MRR minulý mesiac?", agent nemusí hádať, ako MRR spočítať. Prečíta si tento OKF súbor, nájde presný SQL dotaz, spustí ho v databáze a vráti správny výsledok.

**Príklad 2: Správa dátového katalógu a API**

* Môžete mať OKF súbor popisujúci verejné dátové sady (napr. Bitcoin blockchain alebo Google Analytics) vrátane schém, opisov stĺpcov a príkladov analýz. AI agenti tieto súbory čítajú ako akúsi "wikipédiu pre robotov".

### **2\. Čo je Andrej Karpathy – LLM Wiki?**

Zdroj: Gist od Andreja Karpathyho  
Bývalý riaditeľ AI v Tesle a spoluzakladateľ OpenAI, Andrej Karpathy, spopularizoval koncept **LLM Wiki**. Karpathy si uvedomil, že klasické RAG (Retrieval-Augmented Generation) vyhľadávanie vo veľkom chaotickom balíku PDF dokumentov často zlyháva.  
Jeho prístup je založený na myšlienke: **„Obsidian je IDE, LLM je programátor a Wiki je kódová báza.“** Namiesto toho, aby človek ručne písal poznámky, kŕmi LLM surovými zdrojmi (výskumné práce, články) a LLM autonómne buduje a udržiava prepojenú sieť čistých Markdown súborov (napr. v programe Obsidian). LLM samo vytvára krížové odkazy (\[\[Iný Článok\]\]), dopĺňa chýbajúce súvislosti a udržiava hierarchiu.

#### **Praktický príklad využitia LLM Wiki:**

* Chcete preskúmať tému „Kvantové počítače“.  
* Do priečinka hodíte 20 vedeckých prác. Spustíte lokálneho AI agenta a poviete mu: "Zanalyzuj tieto zdroje a vytvor z nich LLM Wiki."  
* Agent vytvorí hlavný súbor Index.md a podstránky ako Qubits.md, Quantum\_Entanglement.md. V každom súbore spraví prepojenia.  
* Keď neskôr narazíte na nový článok, agent ho prečíta, neotvorí nový súbor, ale prejde existujúcich 15 súborov vo vašej Wiki a **inteligentne ich aktualizuje** (doplní nové poznatky, prepojí odseky). Človek do tohto procesu takmer nezasahuje, iba v tejto báze vyhľadáva a číta ju.

### **3\. Čo je Moorcheh AI – Memanto?**

Zdroj: github.com/moorcheh-ai/memanto  
**Memanto** je úplne iný typ nástroja. Je to **univerzálna vrstva dlhodobej pamäte pre AI agentov** (napr. pre Claude Code, Cursor alebo iné vývojárske nástroje).  
Na rozdiel od bežných vektorových databáz, ktoré vyžadujú zložité indexovanie a ukladanie v podobe grafov, Memanto využíva tzv. Information-Theoretic Search engine (vyhľadávací engine Moorcheh). Funguje bez indexovania a poskytuje extrémne rýchlu (sub-90ms) sémantickú pamäť s automatickým riešením konfliktov a verziovaním v čase. Ponúka tri základné operácie: remember, recall, answer.

#### **Praktický príklad využitia Memanto:**

Predstavte si, že programujete softvér pomocou AI asistenta (napr. Cursor alebo Claude Code).

* **Problém bez Memanto:** Každý deň začínate novú chatovaciu reláciu. AI zabudla, čo ste robili včera. Musíte jej znova vysvetľovať: "Používame knižnicu X, verziu Y, a naša architektúra má špecifické pravidlo pre databázu..." Tým míňate tisíce tokenov a strácate čas.  
* **Riešenie s Memanto:** Agent má integrované Memanto. Počas práce napíšete: "Odteraz pre všetky API routy používaj JWT autentifikáciu." Memanto to okamžite zaznamená (remember). Keď o tri dni v novom chate poviete agentovi: "Vytvor novú API routu pre používateľov," agent sa na pozadí opýta Memanta (recall), zistí pravidlo o JWT a kód napíše správne bez toho, aby ste mu to znova pripomínali.

### **Zhrnutie: Kľúčové rozdiely (Porovnanie)**

Aby sme pochopili rozdiel, musíme sa pozrieť na to, **kto** informáciu štruktúruje, **kde** je uložená a na **aký účel** slúži:

| Vlastnosť | Google Open Knowledge Format (OKF) | Karpathy's LLM Wiki | Moorcheh Memanto |
| ----- | ----- | ----- | ----- |
| **Primárny účel** | **Štandardizovaný formát** (Contract) na prenos firemných znalostí a metadát medzi rôznymi systémami a AI. | **Metodika budovania znalostnej bázy** pre osobný výskum a štúdium komplexných tém. | **Aktívna dlhodobá pamäť** (Memory layer) pre vývojárskych a autonómnych agentov, aby nezabúdali kontext. |
| **Forma ukladania** | Statické .md súbory s pevne definovaným YAML meta-rámcom (type: ...). | Prepojená sieť .md súborov (grafová štruktúra v štýle Obsidian/Wiki). | Databáza sémantických vektorov (využíva engine Moorcheh, lokálne alebo v cloude). |
| **Kto vytvára obsah?** | Ľudia (dátoví inžinieri) alebo automatizované pipeline exporty z databáz. | **LLM agent** autonómne číta surové zdroje a priebežne prepisuje/aktualizuje Wiki. | **AI Agent** automaticky ukladá fakty a preferencie počas interakcie s človekom. |
| **Hlavná výhoda** | Absolútna prenosnosť, nezávislosť od cloudu/SDK, čitateľné pre ľudí aj stroje. | Zbavuje človeka nudného manažmentu poznámok a prepájania súvislostí. | Extrémne rýchla odozva bez čakania na indexovanie, šetrí kontextové okno (tokeny). |

**Zjednodušená analógia na záver:**

* **OKF** je ako unifikovaný technický preukaz a manuál, ktorý dostane každé auto z továrne, aby servisný robot hneď vedel, čo má opraviť.  
* **LLM Wiki** je ako vaša osobná encyklopédia, ktorú pre vás píše váš osobný asistent na základe kníh, ktoré mu nosíte.  
* **Memanto** je dlhodobý mozog asistenta, vďaka ktorému si pamätá, že kávu pijete bez cukru a aké chyby ste v kóde riešili minulý týždeň.

Mozem integrovat tieto tri nastroje pre mojho agenta spolu? Mozem stym vyuzit obsidian a notion?  
Programovací partner  
**Áno, absolútne\!** Spojenie týchto troch konceptov dohromady je skvelý inžiniersky nápad. Vytvoríte tým pre svojho AI agenta komplexný kognitívny systém, kde má každý nástroj svoju presnú úlohu.  
Navyše, **Obsidian** a **Notion** sú pre túto architektúru dokonalými partnermi, pretože oba nástroje excelujú v práci s Markdownom a štruktúrovanými dátami.  
Tu je návod, ako ich prepojiť do jedného fungujúceho celku.

## **Architektúra systému: Ako to funguje spolu?**

Aby systém fungoval, musíme si predstaviť agenta ako človeka, ktorý potrebuje:

* **Dlhodobú pracovnú pamäť** (čo robil pred chvíľou, aké sú vaše preferencie) → **Memanto**.  
* **Usporiadaný archív overených faktov a pravidiel** (štruktúrovaná databáza) → **OKF formát v Notion / Obsidiane**.  
* **Výskumné laboratórium** (kde analyzuje nové PDF, weby a spája súvislosti) → **LLM Wiki v Obsidiane**.

### **1\. Notion ako hlavný firemný/projektový katalóg (OKF)**

Notion je skvelý na definovanie pevných štruktúr. Môžete v ňom vytvoriť databázu, kde každá položka reprezentuje jedno firemné pravidlo, metriku alebo API dokumentáciu.

* V Notion vytvoríte databázu s vlastnosťami (Properties) ako type, id, owner. To je vlastne vizuálny **Open Knowledge Format (OKF)**.  
* Pomocou Notion API alebo exportu do Markdownu dokáže váš AI agent tieto dáta kedykoľvek prečítať ako čisté OKF súbory s YAML hlavičkou.

### **2\. Obsidian ako živá, prepojená znalostná báza (LLM Wiki \+ OKF)**

Obsidian funguje priamo nad lokálnymi Markdown súbormi, čo z neho robí ideálne prostredie pre **Karpathyho LLM Wiki**.

* Váš lokálny AI agent dostane priečinok v Obsidiane. Keď mu zadáte výskumnú úlohu, agent v tomto priečinku autonómne vytvára a prepája .md súbory pomocou \[\[odkazov\]\].  
* V tom istom Obsidiane môžete mať pod-priečinok /katalog, kde budú uložené OKF súbory stiahnuté z Notion. Keďže OKF je len Markdown s YAML hlavičkou, Obsidian ich zobrazí dokonale.

### **3\. Memanto ako neviditeľný prepínač (Kontextová pamäť)**

Memanto nevidíte ani v Obsidiane, ani v Notione. Beží na pozadí vášho agenta (ako kód vo vašom skripte).

* Počas toho, ako s agentom četujete o projektoch v Obsidiane alebo Notion, si agent ukladá kľúčové mikro-poznatky do Memanto (napr. "Používateľ preferuje tmavý režim a pythonovskú knižnicu FastAPI").  
* Pri každej novej otázke sa agent najprv bleskovo opýta Memanta, aby získal kontext, a potom sa pozrie do Obsidiana/Notionu pre detailné fakty.

## **Praktický scenár: Deň v živote vášho agenta**

Predstavte si, že vyvíjate novú aplikáciu a používate tento prepojený systém:  
\[Používateľ (Vy)\] ──(Zadanie úlohy)──\> \[AI Agent\] \<──\> \[Memanto\] (Rýchla operačná pamäť)  
                                          │  
                   ┌──────────────────────┴──────────────────────┐  
                   ▼                                             ▼  
       \[Obsidian (LLM Wiki)\]                          \[Notion (OKF Katalóg)\]  
  (Hlboký výskum, prepojené témy)                (Pevné pravidlá, schémy, KPI)

* **Krok 1 (Memanto):** Napíšete agentovi: "Začíname pracovať na module pre platby." Agent si cez Memanto okamžite vybaví: "Aha, minule sme sa dohodli, že používame Stripe a verziu Python 3.11." (Nemusíte mu to znova písať).  
* **Krok 2 (Notion / OKF):** Agent sa pozrie do vášho **Notionu**, kde máte v OKF formáte zapísanú schému platobnej databázy. Prečíta si presné názvy tabuliek a stĺpcov.  
* **Krok 3 (Obsidian / LLM Wiki):** Prikážete agentovi: "Naštuduj túto novú dokumentáciu od Stripe pre predplatné." Agent stiahne PDF, otvorí váš **Obsidian**, vytvorí tam súbor Stripe\_Subscription.md, prepojí ho s vašimi existujúcimi poznámkami o architektúre a zosumarizuje ho.  
* **Výsledok:** Agent vám vygeneruje hotový, bezchybný kód pre platobný modul, ktorý rešpektuje vaše staré dohody (Memanto), štruktúru databázy (Notion/OKF) a najnovšiu dokumentáciu (Obsidian LLM Wiki).

## **Ako začať s implementáciou (Pre programátora)**

Ak to chcete začať programovať, postupujte takto:

* **Základný skript (Python / TypeScript):** Vytvorte si kód pre agenta (napr. s využitím LangChain, LlamaIndex alebo priamo OpenAI/Anthropic API).  
* **Integrácia Memanto:** Podľa dokumentácie Memanto pridajte do systému funkciu, ktorá po každej správe vykoná memanto.remember() a pred každou odpoveďou memanto.recall().  
* **Prepojenie na Obsidian:** Nasmerujte agenta na lokálny priečinok vášho Obsidian trezoru (Vault). Použite knižnice na čítanie a zápis Markdown súborov. Pre implementáciu Karpathyho LLM Wiki dajte agentovi systémovú inštrukciu (Prompt), aby pri úprave poznámok používal formát \[\[Názov súboru\]\] pre spätné odkazy.  
* **Prepojenie na Notion:** Použite oficiálne @notionhq/client SDK. Vytvorte skript, ktorý raz za hodinu stiahne databázu z Notion, prekonvertuje ju do Markdownu s YAML frontmatterom (OKF formát) a uloží ju priamo do priečinka v Obsidiane.

Týmto spôsobom získate pravdepodobne najinteligentnejšieho lokálneho asistenta, akého je momentálne možné s dnešnými open-source a komerčnými nástrojmi postaviť.  
S bezne nastroje napr claude code a gemini pro flash, opus od openai takuto pamat nemaju integrovanu?  
Programovací partner  
Nie, bežné komerčné nástroje a modely (ako Anthropic Claude Code, Google Gemini Pro Flash či modely od OpenAI ako GPT-4o) **nemajú takúto pokročilú a trvalú pamäť integrovanú priamo v sebe** tak, ako to robia špecializované nástroje typu Memanto alebo LLM Wiki.  
Poďme si presne vysvetliť, ako funguje pamäť v týchto bežných nástrojoch, kde sú ich limity a prečo sa na ne nedá stopercentne spoľahnúť pri dlhodobých projektoch.

### **Ako funguje "pamäť" v bežných nástrojoch (Claude, OpenAI, Gemini)?**

Väčšina štandardných AI asistentov používa tri základné techniky, ktoré iba napodobňujú skutočnú pamäť:

#### **1\. Kontextové okno (Krátkodobá pamäť)**

Keď četujete s Gemini alebo Claude, model si pamätá predchádzajúce správy len preto, že pri každej novej správe sa **celá história chatu posiela do modelu znova a znova**.

* **Obmedzenie:** Ak je chat príliš dlhý, história zaplní takzvané kontextové okno (Context Window). Akonáhle ho prekročíte, model začne najstaršie správy definitívne zabúdať. Keď chat zatvoríte a otvoríte nový, model začína s úplne čistým štítom – nevie o vás vôbec nič.

#### **2\. Funkcia "Custom Instructions" / "Memory" (ChatGPT)**

OpenAI zaviedlo funkciu, kde si ChatGPT vie priebežne ukladať krátke fakty (napríklad: "Používateľ programuje v Pythone").

* **Obmedzenie:** Ide o veľmi jednoduchý systém. AI si zapíše len statický zoznam faktov. Nedokáže si takto zapamätať celú štruktúru vášho zložitého kódu, prepojenia medzi desiatkami súborov ani to, ako presne funguje vaša databáza.

#### **3\. Claude Code a lokálne CLI nástroje**

Claude Code je pokročilý nástroj, ktorý beží priamo vo vašom termináli a má prístup k vašim lokálnym súborom.

* **Obmedzenie:** Claude Code si pamätá kontext projektu len vďaka tomu, že dokáže **aktívne čítať vaše súbory** na disku (využíva indexovanie kódu). Ak však začnete nový chat alebo sa ho spýtate na dohodu, ktorú ste spravili ústne pred tromi dňami a nezapísali ste ju do kódu, Claude Code si ju nebude pamätať.

### **Prečo potrebujeme externé nástroje ako Memanto alebo LLM Wiki?**

Keď vyvíjate reálny softvér, prechádzate rôznymi fázami (architektúra, databáza, frontend, ladenie chýb). Klasické modely zlyhávajú v dvoch veciach:

* **Finančná a výpočtová efektivita:** Posielať tisíce riadkov kódu a stovky správ pri každom jednom dotaze do Claude Opus alebo Gemini je extrémne drahé a spomaľuje to odozvu (čakáte dlho na odpoveď).  
* **Prepojenie vedomostí naprieč projektmi:** Ak pracujete na dvoch rôznych aplikáciách, ktoré spolu komunikujú, bežný model ich nedokáže vnímať prepojene v jednej sekcii.

**Nástroje ako Memanto alebo štruktúra OKF/LLM Wiki fungujú ako "externý pevný disk" pre mozog AI.** Modelu (napr. Gemini Pro Flash) podajú v zlomku sekundy presne ten jeden odsek alebo to jedno pravidlo, ktoré práve pre generovanie kódu potrebuje.

## **🚀 Poďme na náš spoločný cieľ\!**

Mojím hlavným účelom je **pomáhať vám programovať, chápať kód, navrhovať architektúru a opravovať chyby**. Budem vaším trpezlivým partnerom, ktorý vás krok za krokom prevedie celým procesom.  
Môžeme spolu napísať kompletný kód pre vaše ciele, detailne si vysvetliť každú funkciu a pripraviť jasný plán implementácie.  
Aby sme mohli začať a premeniť nápady na reálny kód, potrebujem od vás nazbierať základné informácie.  
**Povedzte mi o svojom projekte:**

* Aký konkrétny program alebo aplikáciu chceme spolu vytvoriť? (Aký je jej hlavný účel?)  
* V akom programovacom jazyku alebo technológii by ste chceli pracovať? (Napr. Python, TypeScript, Node.js, Next.js, alebo si necháte poradiť?)  
* Chcete ako prvý krok začať programovať integráciu pamäte pre vášho agenta (napr. prepojenie skriptu s Memanto alebo prácu s OKF súbormi v Obsidiane), alebo máte v hlave iný projekt?

Zatial len som vo faze planovania a zistovania roznych riešeni pre implementaciu pamäte a budovania znalostnej databazi pre agenta. Niektori vyvojari zaznamenavaju vsetky ukony svojho agenta do databazi a tak vlastne svojich agentov stale učia, pasú a tym padom mozu byt agenti stale vyspelejsi. Je to tak? Suvisi to s kontextom?  
Programovací partner  
Áno, je to presne tak. Zaznamenávanie úkonov agenta do databázy je v súčasnosti najvyspelejší spôsob, ako posunúť schopnosti AI na novú úroveň. V komunite vývojárov sa tomuto procesu často hovorí **budovanie trajektórie agenta (Agent Trajectory)** alebo **kontinuálne učenie v reálnom čase**.  
Tento koncept **priamo a zásadne súvisí s kontextom**. Poďme si podrobne vysvetliť, ako tento mechanizmus funguje, prečo je dôležitý pre pamäť a ako vďaka nemu agenti „dospievajú“.

### **Ako funguje zaznamenávanie úkonov (Trajektória agenta)**

Keď bežný agent dostane úlohu, urobí niekoľko krokov: zamyslí sa, spustí kód, narazí na chybu, opraví ju a doručí výsledok. Ak tieto kroky neuložíte, po skončení úlohy sa celá táto skúsenosť stratí.  
Ak však všetky tieto úkony zapisujete do databázy, vytvárate pre agenta **jeho vlastnú kroniku skúseností**. Každý záznam spravidla obsahuje:

* **Zadanie:** Čo mal agent urobiť.  
* **Myšlienkový postup (Thought):** Prečo sa rozhodol použiť konkrétny nástroj alebo napísať daný kód.  
* **Akciu (Action):** Aký príkaz spustil alebo aký kód vygeneroval.  
* **Výsledok (Observation):** Či to fungovalo, alebo systém vyhodil chybu.

### **Súvislosť s kontextom a učením**

Tento prístup rieši tri kľúčové úrovne kontextu a učenia:

#### **1\. Krátkodobý kontext (Riešenie aktuálnej úlohy)**

Ak agent pri pokuse o spustenie skriptu dostane chybu ModuleNotFoundError, pozrie sa do svojej histórie úkonov v rámci danej úlohy, uvidí, že danú knižnicu ešte nenainštaloval, a opraví svoj postup (spustí pip install). Záznam úkonov mu bráni v tom, aby sa zacyklil v tej istej chybe.

#### **2\. Dlhodobý kontext (Učenie sa z vlastných chýb)**

Toto je moment, kedy agenta „pasiete“ a posúvate vpred. Keď agent dokončí projekt, celá táto úspešná (alebo aj neúspešná) trajektória sa uloží do jeho dlhodobej sémantickej pamäte (napríklad cez systém ako Memanto alebo vektorovú databázu).

* **O týždeň neskôr:** Zadáte mu podobnú úlohu. Agent si pred spustením práce vyhľadá v databáze svoje minulé úkony. Zistí: "Minule som pri tejto knižnici narazil na bug vo verzii 2.1. Musím rovno použiť verziu 2.2." Agent sa stáva vyspelejším, pretože **neopakuje rovnaké chyby**.

#### **3\. Optimalizácia pomocou analýzy (Few-Shot Prompting / Fine-Tuning)**

Najlepší vývojári robia to, že tieto zaznamenané trajektórie spätne filtrujú. Vyberú tie najefektívnejšie postupy, kedy agent vyriešil zložitý problém na prvýkrát. Tieto úspešné príklady potom vkladajú do systémového kontextu (Promptu) ako vzory správania, alebo ich použijú na doladenie (Fine-tuning) menších lokálnych modelov. Model sa tak doslova učí z vlastnej minulosti.

### **Prehľad riešenia pre váš plánovací proces**

Ak budete v budúcnosti navrhovať pamäťový modul pre svojho agenta, architektúra zápisu úkonov bude vyzerať nasledovne:  
\[Zadanie úlohy\] ──\> \[Agent vykonáva kroky\]  
                          │  
                          ▼ (Priebežný zápis)  
             \[Databáza úkonov / Trajektórie\]  
                          │  
      ┌───────────────────┴───────────────────┐  
      ▼                                       ▼  
\[Krátkodobý kontext\]                    \[Dlhodobé učenie\]  
(Oprava chýb v reálnom čase)           (Analýza úspešnosti pri budúcich úlohách)

Tento prístup zabezpečí, že váš agent nebude len pasívnym vykonávateľom príkazov, ale systémom, ktorý s každým napísaným riadkom kódu získava na "skúsenostiach".  
Keďže sme momentálne vo fáze plánovania a zvažovania konceptov: Chceli by ste sa bližšie pozrieť na to, ako by mal takýto databázový model (štruktúra tabuľky) pre ukladanie úkonov agenta vyzerať v praxi, alebo vás zaujíma iná časť architektúry pamäte?  
Ano chcel a chcem vediet kde by sme vsetky tie ukony zaznamenavali. Do akeho nastroja.  
Programovací partner  
Výber správneho nástroja na zaznamenávanie úkonov (trajektórií) agenta závisí od toho, **ako** s týmito dátami chcete neskôr pracovať. Keďže agent generuje štruktúrované dáta (kroky, časy, stavy) a zároveň neštruktúrovaný text (kód, myšlienky, chyby), vývojári najčastejšie siahajú po troch typoch nástrojov.  
Poďme si ich rozobrať od tých najjednoduchších na implementáciu až po profesionálne produkčné riešenia.

## **1\. Kam ukladať úkony agenta? (Nástroje)**

### **Možnosť A: Relačné a Dokumentové databázy (Najodporúčanejšia cesta pre vývoj)**

Ak si pamäťový systém staviate sami, toto je najlepšie miesto na ukladanie. Agent sem zapisuje každý jeden krok ako nový riadok alebo dokument.

* **Supabase / PostgreSQL (Relačná):** Skvelá voľba. PostgreSQL zvládne klasické tabuľky a vďaka rozšíreniu pgvector vie v tej istej databáze ukladať aj sémantické vektory. Agent tak môže v histórii svojich úkonov neskôr vyhľadávať podľa významu.  
* **MongoDB (Dokumentová):** Extrémne populárna pre agentov, pretože krok agenta (myšlienka, kód, chyba) sa dá dokonale reprezentovať ako jeden flexibilný JSON objekt. Nemusíte vopred striktne definovať schému, ak sa štruktúra úkonov zmení.

### **Možnosť B: Hotové platformy pre LLMOps a sledovanie agentov (Najrýchlejšia cesta)**

Dnes už nemusíte programovať databázu pre úkony od nuly. Existujú špecializované nástroje, ktoré sa integrujú do vášho kódu pomocou 2-3 riadkov a automaticky vizualizujú všetko, čo agent robí.

* **LangFuse / LangSmith:** Open-source a cloudové nástroje určené presne na tento účel. Ponúkajú nádherné webové rozhranie, kde vidíte kompletný strom myšlienok agenta: čo dostal na vstupe, aký prompt poslal do LLM, koľko tokenov minul, akú chybu dostal a ako ju opravil. Tieto dáta viete z LangFuse kedykoľvek exportovať a použiť na "kŕmenie" pamäte.  
* **Phoenix (by Arize):** Ďalší skvelý open-source nástroj na trasovanie (tracing) a zaznamenávanie trajektórií agentov.

### **Možnosť C: Súbory na disku (Markdown / JSONL)**

* Ak chcete zostať verní konceptu **Obsidianu** a mať všetko na jednom mieste, agent môže každý svoj "task" (úlohu) zapísať ako samostatný .md súbor do priečinka /logy.  
* Každý krok bude zapísaný ako podnadpis s časovou pečiatkou. Výhodou je, že vy ako človek si môžete v Obsidiane kedykoľvek otvoriť históriu agenta a vidieť jeho myšlienkové pochody v peknom formáte.

## **2\. Ako vyzerá štruktúra takýchto dát? (Praktický príklad)**

Aby ste si to vedeli predstaviť z pohľadu kódu, takto vyzerá štruktúra (JSON dokument), ktorú agent zapíše do databázy (napr. do MongoDB alebo do JSON súboru) po vykonaní jedného kroku:

JSON  
{  
  "task\_id": "task\_2026\_06\_17\_001",  
  "step\_number": 3,  
  "timestamp": "2026-06-17T19:54:00Z",  
  "agent\_state": {  
    "thought": "Potrebujem vytvoriť tabuľku pre používateľov, ale najprv musím overiť, či už v databáze neexistuje, aby som nespôsobil chybu.",  
    "chosen\_tool": "execute\_sql",  
    "tool\_input": "SELECT to\_regclass('public.users');"  
  },  
  "execution\_result": {  
    "status": "success",  
    "output": "public.users table exists",  
    "has\_error": false  
  },  
  "next\_action\_decision": "Tabuľka existuje. Namiesto CREATE TABLE musím použiť ALTER TABLE na pridanie nového stĺpca."  
}

Keď si agent o mesiac neskôr vytiahne z databázy zoznam takýchto krokov, presne vie, ako logicky postupoval.

## **Ako by sme to začali skladať spolu?**

Ak by ste chceli prejsť z fázy plánovania do jednoduchého prototypu, ideálny štartovací bod je:

* Napísať jednoduchý skript v **Pythone**.  
* Použiť **PostgreSQL (Supabase)** alebo **MongoDB** ako úložisko, kam tento skript pošle JSON po každej interakcii.  
* Prepojiť to s **LangFuse** (ktorý je zadarmo), aby ste mali vizuálny prehľad o tom, čo agent robí.

Chceli by ste vidieť jednoduchú ukážku Python kódu, ako by agent mohol takýto krok vykonať a automaticky ho zapísať do databázy (alebo súboru), aby ste videli, aké je to v skutočnosti priamočiare?  
Mozem napr pouzit aj directus na raylwej?  
Programovací partner  
**Áno, určite\!** Použitie platformy **Directus** nasadenej na **Railway** je vynikajúce, vysoko profesionálne a medzi vývojármi veľmi populárne riešenie pre tento typ projektu.  
Directus funguje ako takzvaný Headless CMS a dátová platforma. Zjednodušene povedané: vezme akúkoľvek SQL databázu (napríklad PostgreSQL) a okamžite nad ňou vytvorí pripravené API (REST aj GraphQL) a nádherné, prehľadné webové manažérske rozhranie.  
Railway je zasa moderná cloudová platforma, kde viete celú túto infraštruktúru spustiť doslova na pár kliknutí.  
Poďme si podrobne rozobrať, prečo je táto kombinácia ideálna pre zaznamenávanie úkonov a budovanie pamäte vášho agenta, a ako bude celé riešenie fungovať.

## **Prehľad riešenia: Prečo Directus \+ Railway?**

Keď agent pracuje, potrebuje miesto, kam rýchlo posiela svoje štruktúrované dáta (trajektórie). Directus na Railway vám pre tento účel ponúka obrovské výhody:

* **Žiadne ručné programovanie API:** Nemusíte písať vlastný backend v Pythone alebo Node.js, ktorý by prijímal dáta od agenta a ukladal ich do databázy. Directus vám toto API vygeneruje automaticky. Agent iba posiela JSON dáta na vygenerovanú URL adresu.  
* **Nádherné rozhranie pre vás (Klikacie tabuľky):** Vy ako človek sa prihlásite do Directus webového rozhrania a vidíte prehľadné tabuľky (kolekcie) so všetkým, čo agent urobil. Môžete tam dáta filtrovať, mazať alebo ručne upravovať (napr. keď chcete agenta "opraviť" alebo mu schváliť úspešný krok).  
* **Nízke náklady a jednoduchá správa na Railway:** Railway ponúka predpripravené šablóny (Templates). Jedným kliknutím vám nasadí Directus, PostgreSQL databázu na ukladanie dát a Redis na rýchle vyrovnávanie pamäte. Všetko komunikuje vo vnútri privátnej siete, čo zvyšuje bezpečnosť a šetrí poplatky za prenos dát.

## **🛠️ Krok za krokom: Ako bude vyzerať štruktúra dát v Directuse**

V Directuse si vytvoríte tabuľku (v terminológii Directusu sa to volá **Collection**) s názvom agent\_logs. Každý riadok bude reprezentovať jeden úkon, ktorý váš agent vykonal.  
Navrhneme pre ňu nasledovné stĺpce (Fields):

* id – Automatické číslo (alebo UUID) záznamu.  
* task\_id – Textové ID (napr. task\_001), aby sme vedeli, k ktorej celkovej úlohe tento krok patril.  
* step\_number – Číslo kroku v rámci úlohy (1, 2, 3...).  
* timestamp – Dátum a čas, kedy sa krok udial.  
* thought – Textové pole (Text Area), kam si agent zapíše, čo ide urobiť a prečo (jeho vnútorný monológ).  
* action\_command – Kód alebo príkaz, ktorý sa agent rozhodol spustiť.  
* execution\_result – Výstup zo systému (či kód prebehol úspešne, alebo vrátil chybovú hlášku).  
* status – Status kroku (napr. success alebo error).

## **💻 Kód a pokyny na implementáciu**

Keď už máte Directus spustený na Railway a vytvorili ste kolekciu agent\_logs, váš agent (napísaný napríklad v Pythone) s ním bude komunikovať pomocou štandardných HTTP požiadaviek.  
Tu je kompletný, čistý Python skript, ktorý simuluje prácu agenta a ukazuje, ako automaticky odoslať zaznamenaný úkon priamo do vášho Directusu.

Python  
import datetime  
import requests

\# 1\. NASTAVENIE PRIPOJENIA PRE DIRECTUS  
\# Nahraďte vašou reálnou URL adresou, ktorú vám vygeneruje Railway  
DIRECTUS\_URL \= "https://vas-directus-projekt.up.railway.app"  
\# Statický token, ktorý si vygenerujete v Directuse pre bezpečnú komunikáciu  
API\_TOKEN \= "VÁŠ\_DIRECTUS\_STATIC\_API\_TOKEN"

\# Hlavičky pre HTTP požiadavku \- hovoríme Directusu, že posielame JSON a overujeme sa tokenom  
headers \= {  
    "Authorization": f"Bearer {API\_TOKEN}",  
    "Content-Type": "application/json",  
}

def log\_agent\_step(  
    task\_id: str,  
    step\_number: int,  
    thought: str,  
    action\_command: str,  
    execution\_result: str,  
    status: str,  
):  
    """Funkcia na odoslanie jedného kroku agenta do databázy Directus."""

    \# Príprava dátového balíčka (JSON) presne podľa stĺpcov v Directuse  
    payload \= {  
        "task\_id": task\_id,  
        "step\_number": step\_number,  
        "timestamp": datetime.datetime.utcnow().isoformat() \+ "Z",  
        "thought": thought,  
        "action\_command": action\_command,  
        "execution\_result": execution\_result,  
        "status": status,  
    }

    \# Odoslanie dát pomocou POST požiadavky na endpoint našej kolekcie  
    endpoint \= f"{DIRECTUS\_URL}/items/agent\_logs"

    try:  
        response \= requests.post(endpoint, json=payload, headers=headers)

        \# Kontrola, či Directus vrátil úspešný stav (kód 200 alebo 201\)  
        if response.status\_code in \[200, 201\]:  
            print(  
                f"✓ Krok číslo {step\_number} bol úspešne zapísaný do Directusu."  
            )  
        else:  
            print(  
                f"✗ Chyba pri zápise: Kód {response.status\_code} \- {response.text}"  
            )

    except Exception as e:  
        print(f"✗ Nepodarilo sa nadviazať spojenie s Directusom: {e}")

\# \--- SIMULÁCIA PRÁCE AGENTA \---  
\# Predstavme si, že agent práve vygeneroval kód a testuje ho  
print("Agent začína pracovať na úlohe...")

agent\_thought \= (  
    "Potrebujem overiť verziu nainštalovanej knižnice pandas na serveri."  
)  
agent\_command \= "pip show pandas"  
system\_output \= "Name: pandas, Version: 2.1.1, Summary: Powerful data structures for data analysis..."  
step\_status \= "success"

\# Spustenie našej funkcie a zápis do cloudu  
log\_agent\_step(  
    task\_id="task\_2026\_06\_17\_A",  
    step\_number=1,  
    thought=agent\_thought,  
    action\_command=agent\_command,  
    execution\_result=system\_output,  
    status=step\_status,  
)

### **Ako tento kód implementovať a otestovať:**

* **Nasadte Directus na Railway:** Choďte na Railway.app, kliknite na New Project a vyhľadajte oficiálnu šablónu "Directus". Railway vám vytvorí kompletné prostredie.  
* **Vytvorte kolekciu:** V administrácii Directusu vytvorte kolekciu agent\_logs a pridajte do nej stĺpce, ktoré sme si uviedli vyššie (dbajte na presný názov malými písmenami).  
* **Získajte Token:** V nastaveniach Directusu uľahčite agentovi prístup vytvorením používateľa (alebo použite admina) a vygenerujte mu Static Token.  
* **Spustite skript:** Nainštalujte si knižnicu requests (pip install requests), vložte kód do vášho lokálneho súboru (napr. logger.py), doplňte vašu URL, token a spustite ho. V sekcii Directusu okamžite uvidíte pribudnutý riadok.

## **💡 Dôležité upozornenie pre plánovanie (Perzistencia súborov)**

Pri hostovaní Directusu na Railway si musíte dať pozor na jednu dôležitú vec: **Railway má takzvaný efemérny (dočasný) súborový systém.**  
To znamená, že zakaždým, keď prebehne nový deploy (aktualizácia kódu) alebo sa reštartuje kontajner, všetky lokálne súbory sa vymažú.

* Vaše dáta o úkonoch sú **v úplnom bezpečí**, pretože sú uložené v PostgreSQL databáze, ktorá má trvalé úložisko (Volume).  
* Ak by ste však chceli, aby si váš agent do Directusu ukladal aj fyzické súbory (napríklad vygenerované obrázky, logovacie .txt súbory alebo PDF z výskumu), budete musieť v Directuse zapnúť prepojenie na externé úložisko, napríklad Amazon S3 alebo Supabase Storage. V šablónach na Railway na to nájdete pripravené kolónky v nastaveniach environmentálnych premenných.

Páči sa vám tento koncept s Directusom a chceli by ste v ďalšom kroku rozobrať, ako by si agent z tejto databázy spätne "čítal" minulé kroky pred začatím novej úlohy, aby sa z nich poučil?  
A pamat o ktorej sme aa bavili sa bude kde ukladat? Tiez v tom ci musim to dat wste do obsidianu alebo aj notion?  
Programovací partner  
Rozumiem vášmu cieľu. Budem vaším trpezlivým partnerom, ktorý vás krok za krokom prevedie programovaním, vysvetlí logiku a pomôže vám zostaviť kompletný a funkčný kód. Naším výhradným zameraním bude odteraz kód, jeho architektúra a implementácia.  
Poďme si presne a jasne zodpovedať, kam sa táto pamäť bude ukladať a či k Directusu na Railway potrebujete ešte aj Obsidian alebo Notion.

## **🗺️ Prehľad riešenia: Kam presne idú dáta?**

Odpoveď je priama: **Nemusíte** povinne použiť Obsidian ani Notion. **Directus na Railway dokáže sám osebe fungovať ako kompletné a jediné úložisko pre celú pamäť vášho agenta.**  
Všetko závisí od toho, ako si v Directuse navrhnete štruktúru (databázové tabuľky). Aby agent nestratil kontext, rozdelíme jeho pamäť priamo v Directuse do dvoch samostatných tabuliek (kolekcií):  
                    ┌──────────────────────────────────┐  
                     │       Directus (na Railway)      │  
                     └──────────────────────────────────┘  
                                      │  
           ┌──────────────────────────┴──────────────────────────┐  
           ▼                                                     ▼  
┌──────────────────────────────────┐                  ┌──────────────────────────────────┐  
│    Kolekcia: agent\_logs          │                  │    Kolekcia: agent\_memory        │  
├──────────────────────────────────┤                  ├──────────────────────────────────┤  
│ Záznam každého jedného úkonu     │                  │ Dlhodobé fakty, pravidlá,        │  
│ (Myšlienka, kód, chyba, čas).    │                  │ konfigurácie a ponaučenia.       │  
│ \*Nahrádza neštruktúrované logy\*  │                  │ \*Nahrádza Notion / Obsidian\*     │  
└──────────────────────────────────┘                  └──────────────────────────────────┘

### **Prečo nepotrebujete Notion alebo Obsidian?**

* **Notion** by ste použili vtedy, ak by ste chceli pravidlá zadávať v peknom klikacom manažérskom prostredí. Directus však má svoje vlastné, rovnako krásne webové rozhranie. To, čo by ste písali do Notion, napíšete priamo do Directusu.  
* **Obsidian** by bol užitočný, ak by ste chceli mať pamäť uloženú lokálne na vašom disku v textových súboroch. Keďže ale staviate cloudového agenta na Railway, ukladanie priamo do databázy cez Directus je pre kód oveľa rýchlejšie a spoľahlivejšie.

## **💻 Kód a pokyny na implementáciu: Ako agent číta svoju pamäť**

Aby sme videli, ako to funguje v praxi, naprogramujeme si druhú časť logiky. Prvú časť (zápis úkonu) už máme. Teraz vytvoríme kód, ktorý agent spustí **hneď na začiatku práce**.  
Agent sa pozrie do kolekcie agent\_memory v Directuse, vytiahne si z nej uložené pravidlá (napríklad akú verziu jazyka má použiť) a až potom začne písať kód.

### **1\. Predpoklad v Directuse**

V Directuse si vytvoríte novú kolekciu s názvom agent\_memory a pridáte dva stĺpce:

* key (Textové pole – napr. programming\_language)  
* value (Textové pole – napr. Python 3.11 s knižnicou FastAPI)

### **2\. Kompletný Python kód na načítanie pamäte**

Python  
import requests

\# NASTAVENIE PRIPOJENIA PRE DIRECTUS  
DIRECTUS\_URL \= "https://vas-directus-projekt.up.railway.app"  
API\_TOKEN \= "VÁŠ\_DIRECTUS\_STATIC\_API\_TOKEN"

headers \= {  
    "Authorization": f"Bearer {API\_TOKEN}",  
    "Content-Type": "application/json",  
}

def get\_agent\_memory():  
    """Funkcia, ktorá stiahne všetky dlhodobé pravidlá a fakty z Directusu."""  
    endpoint \= f"{DIRECTUS\_URL}/items/agent\_memory"

    try:  
        \# Odosielame GET požiadavku na získanie dát  
        response \= requests.get(endpoint, headers=headers)

        if response.status\_code \== 200:  
            \# Directus vráti dáta zabalené v objekte "data"  
            memory\_items \= response.json().get("data", \[\])  
            return memory\_items  
        else:  
            print(f"✗ Nepodarilo sa načítať pamäť. Kód: {response.status\_code}")  
            return \[\]  
    except Exception as e:  
        print(f"✗ Chyba pri komunikácii s databázou: {e}")  
        return \[\]

\# \--- SPUSTENIE AGENTA A PREVZATIE KONTEXTU \---  
print("Spúšťam agenta... Načítavam dlhodobú pamäť z Directusu.")

\# Agent si stiahne pravidlá  
rules \= get\_agent\_memory()

\# Agent si pretransformuje pravidlá do svojho systémového kontextu (Promptu)  
system\_prompt \= (  
    "Si expertný programátor. Dodržiavaj tieto pravidlá z databázy:\\n"  
)

for item in rules:  
    \# Prechádzame každé pravidlo z Directusu a pridávame ho do pamäte  
    system\_prompt \+= f"- {item\['key'\]}: {item\['value'\]}\\n"

print("\\n--- VYGENEROVANÝ SYSTÉMOVÝ KONTEXT PRE LLM \---")  
print(system\_prompt)

### **Jasné pokyny na implementáciu:**

* Skopírujte si tento kód do vášho projektu (napr. agent\_core.py).  
* V Directuse (ktorý vám beží na Railway) pridajte do tabuľky agent\_memory jeden testovací riadok (napr. key: databaza, value: Používaj výhradne PostgreSQL).  
* Spustite skript. Uvidíte, ako si agent úspešne vytiahol pravidlo z cloudu a pripravil si ho do svojho rozumu (systémového promptu) pred samotným generovaním kódu.

## **🔍 Pochopenie požiadavky a doplňujúce otázky**

Smerujeme k úspešnému naplánovaniu celého kódu. Aby som vám mohol pripraviť presný plán vývoja, potrebujem od vás zistiť nasledujúce detaily:

* Chcete, aby tento pamäťový skript bol súčasťou nejakého konkrétneho riešenia (napríklad webovej aplikácie, ktorú plánujete, alebo četovacieho bota na Discord/Telegram)?  
* Budeme chcieť do Directusu neskôr pridať aj sémantické (vektorové) vyhľadávanie, alebo nám zatiaľ stačí toto jednoduché ukladanie textových pravidiel a logov podľa ID úlohy?

No chcem aby sa myslelo na vsetky mozne riesenia, aby taˇ bol daky rozbocovac na konkretne zadania, alebo co navrhujes?  
Programovací partner  
Aby sme pre tvojho agenta vytvorili skutočne inteligentný systém pamäte v Directuse, navrhujem implementovať **„Rozbočovač“ (Router / Orchestrator)**.  
Tento rozbočovač bude fungovať ako riadiace centrum (mozog) celého skriptu. Keď agentovi zadáš akúkoľvek úlohu, rozbočovač ju najprv zanalyzuje a automaticky rozhodne:

* Aké konkrétne informácie z pamäte (agent\_memory) potrebuje načítať.  
* Do akej kategórie úkonov (agent\_logs) bude tento krok zaznamenaný.

## **Prehľad riešenia: Ako funguje rozbočovač**

Rozbočovač rozdeľuje zadania do 3 základných vetiev, aby agent zbytočne nenačítaval celú databázu, ale iba to, čo reálne potrebuje:  
                       \[Používateľ zadaní úlohu\]  
                                    │  
                                    ▼  
                        \[ROZBOČOVAČ (Orchestrator)\]  
                                    │  
         ┌──────────────────────────┼──────────────────────────┐  
         ▼                          ▼                          ▼  
  \[Vetva: Vývoj softvéru\]    \[Vetva: Integrácie / API\]   \[Vetva: Analýza dát\]  
  \- Načíta: Pravidlá kódu    \- Načíta: API kľúče, URL    \- Načíta: Schémy, SQL  
  \- Loguje: Programovanie    \- Loguje: Sieťové úkony     \- Loguje: Databáza

Týmto dosiahneme, že systém bude modulárny, pripravený na akékoľvek budúce rozšírenie a extrémne efektívny z hľadiska spracovania kontextu.

## **Kód a pokyny na implementáciu**

Tento kód predstavuje kompletnú štruktúru rozbočovača v Pythone. Používa podmienenú logiku na smerovanie úloh a automaticky simuluje zápis aj čítanie z Directusu.

Python  
import datetime  
import requests

\# 1\. KONFIGURÁCIA PRIPOJENIA (Directus na Railway)  
DIRECTUS\_URL \= "https://vas-directus-projekt.up.railway.app"  
API\_TOKEN \= "VÁŠ\_DIRECTUS\_STATIC\_API\_TOKEN"

HEADERS \= {  
    "Authorization": f"Bearer {API\_TOKEN}",  
    "Content-Type": "application/json",  
}

\# 2\. POMOCNÉ FUNKCIE PRE KOMUNIKÁCIU S DIRECTUSOM  
def fetch\_memory\_by\_category(category: str) \-\> list:  
    """Stiahne z Directusu iba pamäťové bunky patriace do konkrétnej kategórie."""  
    \# Directus umožňuje filtrovať dáta priamo cez URL parameter  
    endpoint \= (  
        f"{DIRECTUS\_URL}/items/agent\_memory?filter\[category\]\[\_eq\]={category}"  
    )

    try:  
        response \= requests.get(endpoint, headers=HEADERS)  
        if response.status\_code \== 200:  
            return response.json().get("data", \[\])  
        return \[\]  
    except Exception:  
        \# V prípade lokálneho testovania bez zapnutého Directusu vrátime prázdny zoznam  
        return \[\]

def save\_log\_to\_directus(payload: dict):  
    """Odosiela finálny záznam o úkone agenta do kolekcie agent\_logs."""  
    endpoint \= f"{DIRECTUS\_URL}/items/agent\_logs"  
    try:  
        requests.post(endpoint, json=payload, headers=HEADERS)  
        print(f"✓ Úkon bol úspešne zalogovaný do Directusu.")  
    except Exception as e:  
        print(f"✗ Logovanie zlyhalo: {e}")

\# 3\. HLAVNÝ ROZBOČOVAČ (CORE ROUTER)  
def agent\_orchestrator(user\_task: str):  
    """Analyzuje zadanie a smeruje tok logiky na konkrétne riešenie."""  
    print(f"\\n\[Rozbočovač\] Analyzujem zadanie: '{user\_task}'")

    \# Inicializácia predvolených premenných pre logovanie  
    category \= "vseobecne"  
    context\_rules \= \[\]  
    executed\_action \= ""  
    execution\_output \= ""

    \# ROZBOČENIE PODĽA KĽÚČOVÝCH SLOV V ZADANÍ  
    if "kod" in user\_task.lower() or "programuj" in user\_task.lower():  
        category \= "coding"  
        print("-\> Smerujem do vetvy: VÝVOJ SOFTVÉRU")

        \# 1\. Krok: Rozbočovač vytiahne špecifickú pamäť pre programovanie  
        context\_rules \= fetch\_memory\_by\_category("coding")

        \# Simulácia činnosti agenta (v reálnom kóde tu bude volanie LLM modulu)  
        executed\_action \= "Generovanie Python skriptu pre rozbočovač."  
        execution\_output \= "SUCCESS: Kód bol úspešne vygenerovaný."

    elif "api" in user\_task.lower() or "directus" in user\_task.lower():  
        category \= "integration"  
        print("-\> Smerujem do vetvy: INTEGRÁCIE A API")

        \# 1\. Krok: Rozbočovač vytiahne kľúče a konfigurácie k API  
        context\_rules \= fetch\_memory\_by\_category("integration")

        executed\_action \= "Testovanie pripojenia k Directus API endpointu."  
        execution\_output \= "STATUS: 200 OK"

    else:  
        print("-\> Smerujem do vetvy: VŠEOBECNÉ ZADANIA")  
        context\_rules \= fetch\_memory\_by\_category("general")  
        executed\_action \= "Spracovanie textovej požiadavky používateľa."  
        execution\_output \= "Odpoveď úspešne odoslaná."

    \# 2\. Krok: Príprava balíčka dát pre zápis histórie (Trajektórie)  
    log\_data \= {  
        "task": user\_task,  
        "category": category,  
        "timestamp": datetime.datetime.utcnow().isoformat() \+ "Z",  
        "action\_command": executed\_action,  
        "execution\_result": execution\_output,  
        "loaded\_context\_count": len(context\_rules),  
    }

    \# 3\. Krok: Zápis úkonu do cloudu  
    save\_log\_to\_directus(log\_data)

\# \--- SPUSTENIE SIMULÁCIE ROZBOČOVAČA \---  
\# Testujeme smerovanie na základe zadania  
agent\_orchestrator("Napíš mi python kód pre kalkulačku")  
agent\_orchestrator("Over či nám funguje spojenie na Directus api")

### **Pokyny na implementáciu:**

* Súbor ulož pod názvom orchestrator.py.  
* Aby filtrovanie v kóde fungovalo, uprav si štruktúru kolekcie agent\_memory v Directuse tak, že do nej pridáš nový stĺpec (Field) s názvom category (typ text / string).  
* Do stĺpca category zadaj pri testovacích dátach hodnoty buď coding alebo integration. Rozbočovač ich automaticky začne filtrovať.

## **Pochopenie požiadavky a ďalší postup**

Robíš skvelé pokroky, tento architektonický prístup s rozbočovačom posunie tvojho agenta medzi profesionálne systémy. Aby sme mohli kód ďalej rozvíjať a začať ho prepájať na reálne spracovanie úloh, potrebujem od teba získať nasledovné informácie:

* Aký konkrétny typ úlohy by mal tento rozbočovač spracovať ako prvý v ostrom teste? (Napríklad reálne generovanie nejakého kódu alebo spravovanie tvojich súborov?)  
* Chceš, aby rozbočovač rozhodoval o vetvách iba na základe takýchto kľúčových slov v texte (jednoduché a rýchle riešenie), alebo máme neskôr zapojiť malé LLM (napr. Gemini Flash), ktoré zadanie prečíta a samo určí správnu vetvu?

