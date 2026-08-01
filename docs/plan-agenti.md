# Plán: ďalší agenti (rezervácie + e-mail + leady) — seed na naplánovanie

> Zoznam cieľov a **otvorených rozhodnutí** pre nasledujúce sedenia. Zámerne
> stručné. Podrobný krok-za-krokom plán vznikne v **plánovacom sedení** (viď
> pracovný režim nižšie) a zapíše sa sem.

## Pracovný režim (šetrenie tokenov)
- **Plánovacie sedenie:** prečítať `dennik.md` + `vizia.md` + tento súbor →
  dohodnúť rozhodnutia → napísať podrobný plán po krokoch sem **+ hotový
  štartovací prompt pre realizačné sedenie** (na copy-paste) → skončiť.
  Nič sa needuplikuje, nekóduje — len plán.
- **Realizačné sedenia:** vziať plán a spraviť jeden ucelený krok (kód na vetve,
  test, merge po súhlase). „Na hrubo", dolaďovať neskôr.

## Ciele
1. **Rezervačný agent** — pozrie voľné termíny a zapíše schôdzku; zákazníkovi
   pošle **potvrdenie e-mailom** a vytvorí **lead**.
2. **Automatické odpovede na e-maily** — agent prečíta príchodzí e-mail, pripraví
   (a pošle) odpoveď; kvalitu čerpá z nášho obsahu (RAG).
3. **Chatbot vytvára leady + e-mail** — keď návštevník prejaví záujem/nechá
   kontakt, chatbot zapíše lead (`client_leads`) a pošle potvrdenie na jeho e-mail.

## Spoločný stavebný kameň: posielanie e-mailov
Všetky tri ciele potrebujú **odosielať e-maily**. Rozhodnúť raz:
- **Ako:** SMTP cez hosting (majú hosting) vs transakčná služba (Resend/SendGrid/
  Mailgun — kvalitnejšie doručovanie, ale náklad/registrácia).
- **Odkiaľ:** frontend (Node) pre chatbot-leady vs orchestrátor (Python) pre agentov.
- Bezpečnosť: tajomstvá v env; „from" adresa (napr. `info@digitalnapomoc.sk`).

## Otvorené rozhodnutia (doriešiť v plánovacom sedení)
**Rezervácie:**
- Kde žijú termíny/kalendár? (a) Directus kolekcia (vlastné, replikovateľné pre
  ďalších klientov) (b) Google Calendar API (klient hneď vidí) (c) WooCommerce
  Bookings. → pre „krabicový" produkt zvážiť (a).
- Ako zákazník rezervuje? konverzačne cez chatbota vs samostatný widget/formulár.
- Definícia dostupnosti (otváracie hodiny, dĺžka slotu, blokované termíny).

**E-mail auto-odpoveď:**
- Ktorá schránka + prístup (IMAP na hostingu?).
- Auto-send vs **draft na schválenie** (bezpečnejšie začať draftom).
- Ako sa páruje odpoveď s naším obsahom (RAG) a s CRM (lead).

**Chatbot leady:**
- Rozšíriť `/api/chat` o zachytenie kontaktu, alebo prepojiť s existujúcim
  `/api/lead` (už píše do `client_leads`) + potvrdzovací e-mail.

## Súvislosti
- „Lego" vzor: config v Directuse + modul v orchestrátore + logy (ako Writer/SEO).
- Súčasť produktovej línie „krabicových riešení" (viď `dennik.md` backlog).
- GDPR: posielanie e-mailov a ukladanie kontaktov → nadväzuje na Pred-Google
  checklist (cookie/GDPR).

## Štartový prompt pre plánovacie sedenie (skopíruj do nového sedenia)
```
Najprv si prečítaj docs/dennik.md, docs/vizia.md a docs/plan-agenti.md.
Toto je PLÁNOVACIE sedenie (šetríme tokeny): nič nekóduj, len sa ma pýtaj na
otvorené rozhodnutia z plan-agenti.md a výsledok — podrobný plán po krokoch —
zapíš do docs/plan-agenti.md. Začni rezervačným agentom. Commit + push do vetvy
môžeš, merge do main a zmeny v Railway/DB až po mojom súhlase.
```
