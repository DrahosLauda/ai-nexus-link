# **📘 MASTER ARCHITECTURE BLUEPRINT: AI NEXUS LINK**

**Modulárny kognitívny systém pre správu, optimalizáciu a automatizáciu Headless webov a E-commerce**

## **🎯 1\. Účel systému a využitie v praxi**

AI Nexus Link je "Event-Driven" (udalosťami riadená) platforma (SaaS), ktorá funguje ako asynchrónny inteligentný most medzi klasickým WordPressom/WooCommerce a superrýchlym Next.js frontendom. Nahrádza drahé CRM systémy (ako GoHighLevel) a platené WordPress pluginy (SEO, Cache, Opustené košíky) jedným uceleným riešením.

### **Biznis benefity:**

> * **Zero-friction pre klienta:** Zákazník naďalej používa klasický WordPress na pridávanie článkov a produktov.  
> * **Blazing Fast Frontend:** Next.js beží úplne oddelene (Headless), využíva Incremental Static Regeneration (ISR) pre načítanie pod 0.2s.  
> * **Spätná kompatibilita (Legacy WP Bridge):** Systém dokáže fungovať aj bez Next.js na starých WordPress weboch, kde agenti priamo upravujú obsah a šetria klientovi peniaze za vývoj nového webu.

## **🧱 2\. Architektúra Dátového toku (Data Flow)**

Systém je postavený na asynchrónnej architektúre, aby zvládol veľkú záťaž bez sekania.

> 1. **Vstup (Headless WP/WooCommerce):** Odosiela Webhook o zmene (napr. nový lead, nový produkt).  
> 2. **Wayland Hub (Python/FastAPI):** Asynchrónne prijme požiadavku (vráti 202 Accepted) a spracovanie zaradí na pozadie.  
> 3. **Kompresia kontextu:** Pred volaním LLM sa dáta očistia od HTML/JSON balastu (LLMLingua princíp), zhrnú a cachujú, čo šetrí 60-80 % tokenov.  
> 4. **Agent Swarm (AI Logika):** Agenti komunikujú cez **Zdieľanú pamäť (Blackboard)** a konajú na základe frameworku **ReAct** (Thought \-\> Action \-\> Observation).  
> 5. **Dátové jadro (Directus \+ PostgreSQL):** Ukladá stavy, logy a slúži ako All-in-One CRM.  
> 6. **Výstup (Next.js / Externé API):** Vygenerovanie a nasadenie zmien pre koncového zákazníka.

## **👥 3\. Tím AI Agentov (Kognitívne moduly)**

Agenti fungujú obojsmerne – čítajú stav z Directusu a vykonávajú zápis do externých systémov.

> * **🟢 SEO Agent (Content Optimizer):** Analyzuje surové texty z WP, cez OpenAI/Gemini generuje kľúčové slová a prepisuje meta tagy priamo vo WP. Využíva **RAG** (vektorové vyhľadávanie) na sémantickú pamäť starých článkov.  
> * **🔵 Frontend Agent (Tailwind UI Builder):** Generuje responzívne Tailwind/shadcn komponenty pre Next.js na základe obsahu z WP. Kód prechádza cez **Guardrails** (bezpečnostné mantinely pre linter/syntax) pred nasadením.  
> * **🟡 CRM Agent (GHL-Style Automator):** Zameriava sa na ukladanie leadov, radenie zákazníkov do pipeline a posielanie automatických e-mailových sekvencií na základe tagov.  
> * **🟣 E-Commerce Marketing Agent:** Sleduje nákupné správanie z WooCommerce, zachraňuje opustené košíky (Abandoned Cart) a generuje unikátne zľavové kupóny.

## **📱 4\. Human-in-the-Loop (Mobile-First Approval Engine)**

Umelá inteligencia nevykonáva citlivé finančné ani klientske operácie bez dozoru.

> 1. Agent navrhne akciu (napr. odošle kupón) a uloží ju do Directusu v stave pending\_approval.  
> 2. Wayland odošle push notifikáciu na mobil klienta (PWA alebo Telegram Bot).  
> 3. Klient priamo z mobilu klikne na \[Schváliť\]. Až vtedy sa akcia vykoná.

## **📊 5\. Kompletná schéma databázy (Directus)**

Pre správny chod systému vytvárame nasledujúce kolekcie (tabuľky):

> 1. **agent\_config:** Dlhodobá pamäť a prísne pravidlá pre swarm.  
> 2. **agent\_logs:** Záznam ReAct cyklu, vstupných/výstupných znakov (compression ratio) a nákladov (USD) na API volania.  
> 3. **client\_leads:** Centrálna databáza kontaktov (ako v GoHighLevel).  
> 4. **crm\_campaigns:** Databáza predajných kampaní a triggerov.  
> 5. **crm\_interactions:** Logovanie každého kliknutia a správy s klientom.  
> 6. **ecommerce\_carts:** Sledovanie rozpracovaných a opustených košíkov z Next.js frontendu.  
> 7. **ai\_generated\_coupons:** Prehľad vygenerovaných zliav a ich platnosti.

## **🗺️ 6\. Plán implementácie (Roadmap)**

✅ **KROK 1:** Inicializácia prostredia (Python, FastAPI asynchrónny Hub, venv).  
⬜ **KROK 2:** Nasadenie Directusu (Lokálne/Docker) a návrh DB.  
⬜ **KROK 3:** Vývoj Wayland Orchestrátora (Shared Memory, Context Compression).  
⬜ **KROK 4:** Integrácia WP/WooCommerce API a RAG vektorizácia.  
⬜ **KROK 5:** Vývoj SEO Agenta a Guardrails ochrany.  
⬜ **KROK 6:** Vývoj Frontend Agenta (Next.js \+ Tailwind).  
⬜ **KROK 7:** Vývoj CRM a Mobile Approval Enginu (Telegram/PWA).  
⬜ **KROK 8:** Presun do produkcie (Railway.app) a záťažové testy.