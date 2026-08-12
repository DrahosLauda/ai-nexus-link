**Knižnica IT Expertov**

Tento repozitár s názvom **„The Agency“ (Agentúra)** je presne ten typ moderného nástroja, ktorý nám môže ohromne pomôcť pri programovaní a zrýchliť našu prácu.

Hlavný odkaz: [https://github.com/msitarzewski/agency-agents/](https://github.com/msitarzewski/agency-agents/)

Poďme si to spoločne rozobrať krok za krokom, ľudskou a zrozumiteľnou rečou.

### **1\. Prehľad riešenia: Čo to vlastne je?**

Predstav si, že by si mal k dispozícii celú firmu plnú špičkových IT expertov, ktorí nikdy nespia a sú pripravení okamžite pracovať na tvojom projekte. Presne to je „The Agency“.

Tento repozitár obsahuje obrovskú zbierku (vyše 140\) **špecializovaných AI agentov (osobností)**. Nejde len o obyčajné príkazy (prompty) pre umelú inteligenciu. Každý agent v tejto zbierke je do detailu prepracovaný – má svoju rolu, špecifické postupy, spôsob komunikácie a presne vie, aký kód má doručiť.

Sú rozdelení do rôznych "oddelení", napríklad:

* **Engineering (Vývoj):** Nájdeš tu špecialistov ako *Frontend Developer* (na vzhľad webu), *Backend Architect* (na databázy a server), *DevOps* (na nasadzovanie aplikácií) alebo *Security Engineer* (na bezpečnosť).  
* Ďalšie oddelenia pokrývajú dizajn, marketing, správu produktov a podobne (my sa budeme sústrediť na ten vývojový\!).

### **2\. Ako sa to používa v praxi?**

V praxi to funguje tak, že namiesto toho, aby si umelej inteligencii (napríklad Claude, ChatGPT, Cursor alebo GitHub Copilot) zadával všeobecné otázky, tak ju pomocou týchto súborov "prepneš" do roly konkrétneho experta.

**Príklad použitia:** Ak staviame novú webstránku a potrebujeme vytvoriť moderné tlačidlo, nepoprosíme AI len o "kód na tlačidlo". "Najnajmeme" si z tejto agentúry nášho **Frontend Developera**. AI si prečíta jeho profil z repozitára a začne sa správať ako senior vývojár zameraný na detaily. Napíše nám nielen kód, ale dohliadne aj na to, aby sa web rýchlo načítal a kód bol prehľadný.

### **3\. Ako to implementovať (Pokyny na inštaláciu)**

Týchto agentov môžeš používať viacerými spôsobmi. Ukážem ti ten najjednoduchší a najrýchlejší, ako si to rozbehnúť na tvojom počítači.

#### **Možnosť A: Použitie priamo v konverzáciách (Manuálne)**

Toto je najjednoduchšia metóda pre začiatočníkov. Nepotrebuješ nič inštalovať.

1. Otvor si priečinok repozitára na GitHube a klikni napríklad do zložky `engineering`.  
2. Vyber si súbor, napríklad `frontend-developer.md`.  
3. Skopíruj si jeho obsah a jednoducho ho vlož ako prvú správu do tvojho obľúbeného AI nástroja (napr. ChatGPT alebo Claude) s textom: *"Odteraz sa správaj presne podľa tohto popisu: \[vložený text\]"*

#### **Možnosť B: Integrácia do programátorských nástrojov (Pre pokročilejších)**

Ak používaš pokročilé AI editory kódu (napríklad **Claude Code**, **Cursor**, **Windsurf** alebo **Aider**), The Agency prichádza s hotovými skriptami. Tu je postup pre terminál (príkazový riadok):

Bash  
\# 1\. Krok: Naklonuj (stiahni) si tento repozitár k sebe do počítača  
git clone https://github.com/msitarzewski/agency-agents.git  
cd agency-agents

\# 2\. Krok (Ak používaš iné nástroje ako Claude Code): Priprav formáty pre svoj nástroj  
./scripts/convert.sh

\# 3\. Krok: Nainštaluj agentov do svojho vývojového prostredia.  
\# Nahraď slovo "cursor" svojím nástrojom (napr. claude-code, windsurf, aider, copilot)  
./scripts/install.sh \--tool cursor

Akonáhle toto urobíš, vo svojom editore už len stačí napísať napríklad: *"Aktivuj mód Frontend Developera a pomôž mi vytvoriť novú React komponentu."*

### **Aký je náš ďalší krok? 🚀**

Ako tvoj programovací partner ti môžem pomôcť s akýmkoľvek kódom\! Zaujal ťa tento prístup? Môžeme si napríklad vybrať jedného agenta (napr. spomínaného Frontend kódera) a spoločne v jeho štýle začať programovať nejaký tvoj nápad.

Na čom by si chcel dnes začať pracovať?

