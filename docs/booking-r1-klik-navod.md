# Rezervačný agent R1 — klik-návod (engine + widget + e-mail)

> „Klik-časť" kroku R1: sfunkčniť odosielanie e-mailov (hosting SMTP) a nastaviť
> env premenné na Railway. Kód (engine `lib/booking.ts`, API `/api/booking/*`,
> widget `/rezervacia`, e-mail `lib/email.ts`) je hotový vo vetve a po merge sa
> nasadí na Railway. Dátový model + token `RESERVATION_TOKEN` sú z R0 (hotové).

**Predpoklad (z R0, už naostro):** kolekcie `booking_*` v Directuse, DB constraint
`bookings_no_overlap`, token `reservation-bot` → `RESERVATION_TOKEN` na Railway,
seed dáta (Poradca 1, „Konzultácia 30 min", dostupnosť Po–Pia 09:00–17:00).

---

## ČASŤ A — E-mailová schránka na hostcreators (SMTP)

Rezervácie posielajú **potvrdenie zákazníkovi** + **notifikáciu prevádzke**.
Hlavná cesta = **SMTP hostingu** (SPF/DKIM pre `digitalnapomoc.sk` už rieši hosting).

1. hostcreators (alebo cPanel/admin hostingu) → **E-mailové schránky** →
   **Vytvoriť schránku**, napr. `rezervacie@digitalnapomoc.sk` + heslo.
2. Zisti **SMTP údaje** schránky (v detaile schránky / „Nastavenia poštového
   klienta"). Zvyčajne:
   - **SMTP host**: napr. `smtp.digitalnapomoc.sk` alebo mailový server hostingu
     (napr. `mailX.hostcreators.sk` — presný názov ukáže hosting).
   - **Port**: **587** (STARTTLS) — odporúčané; alternatíva 465 (SSL).
   - **User**: celá adresa `rezervacie@digitalnapomoc.sk`.
   - **Heslo**: to, čo si zadal pri vytváraní schránky.

---

## ČASŤ B — Env premenné na Railway (frontend služba)

Railway → projekt → **frontend** služba → **Variables** → pridaj:

| Premenná | Hodnota | Pozn. |
|---|---|---|
| `SMTP_HOST` | SMTP server hostingu | z Časti A |
| `SMTP_PORT` | `587` | 465 ak používaš SSL |
| `SMTP_USER` | `rezervacie@digitalnapomoc.sk` | celá adresa |
| `SMTP_PASS` | heslo schránky | tajné |
| `BOOKING_FROM_EMAIL` | `rezervacie@digitalnapomoc.sk` | odosielateľ |
| `BOOKING_FROM_NAME` | `digitálna pomoc` | voliteľné (default rovnaký) |
| `BUSINESS_NOTIFY_EMAIL` | kam chodia notifikácie o rezervácii | napr. tvoj e-mail |
| `RESERVATION_TOKEN` | *(už nastavené z R0)* | Directus token |
| `DIRECTUS_URL` | *(už nastavené)* | základná adresa Directusu |
| `SITE_URL` | *(už nastavené)* | do päty e-mailu |

*(Pozn.: `EMAIL_PROVIDER` netreba — default je `smtp`.)*

**Záložná cesta Resend (neaktivovať teraz):** ak by SMTP nestačilo, stačí neskôr
nastaviť `EMAIL_PROVIDER=resend` + `RESEND_API_KEY` — kód sa nemení.

---

## ČASŤ C — Overenie po nasadení

1. Po merge do `main` a Railway deploy otvor **`/rezervacia`** na webe.
2. Vyber službu → deň (napr. najbližší pracovný) → mal by ukázať voľné termíny
   (09:00–16:30 po 30 min, mínus obsadené).
3. Rezervuj testovací termín na svoj e-mail → skontroluj:
   - príde **potvrdenie** na zadaný e-mail,
   - príde **notifikácia** na `BUSINESS_NOTIFY_EMAIL`,
   - v Directuse pribudol riadok v `bookings` (status `confirmed`) + `client_leads`.
4. Skús rezervovať **ten istý** termín druhýkrát → má prísť hláška
   „termín je už obsadený" (constraint + re-check fungujú).

**Ak e-maily nechodia:** skontroluj `SMTP_*` (host/port/heslo), a či hosting
nevyžaduje port 465 (`SMTP_PORT=465`). Rezervácia sa uloží aj keď e-mail zlyhá
(pošle sa „best effort"); chybu nájdeš v logoch Railway.

---

## Hotovo ✅

Widget `/rezervacia` je živé demo rezervačného agenta. Ďalej: **R2** —
konverzačný chatbot (rezervácia priamo v chate) volajúci ten istý engine.
