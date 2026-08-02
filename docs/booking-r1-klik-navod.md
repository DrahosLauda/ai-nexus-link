# Rezervačný agent R1 — klik-návod (engine + widget + e-mail)

> „Klik-časť" kroku R1: sfunkčniť odosielanie e-mailov a nastaviť env premenné na
> Railway. Kód (engine `lib/booking.ts`, API `/api/booking/*`, widget
> `/rezervacia`, e-mail `lib/email.ts`) je zlúčený a nasadený. Dátový model +
> token `RESERVATION_TOKEN` sú z R0 (hotové).

> ## ✅ SKUTOČNÝ STAV (aug 2026): e-maily idú cez **Resend**, nie hosting SMTP
>
> **Hosting SMTP (hostcreators) sa z Railway NEDÁ použiť** — spojenie končí
> `ETIMEDOUT` (blokujú cudzie/dátacentrové IP), na 465 aj 587. Preto beží
> **Resend** (HTTPS/443, nič sa neblokuje). **Rovno rob ČASŤ A-RESEND nižšie**;
> pôvodná SMTP časť (A/B) je len historická referencia. Pre klientov s
> hostingovým SMTP čakaj to isté — rovno choď na Resend.

**Predpoklad (z R0, už naostro):** kolekcie `booking_*` v Directuse, DB constraint
`bookings_no_overlap`, token `reservation-bot` → `RESERVATION_TOKEN` na Railway,
seed dáta (Poradca 1, „Konzultácia 30 min", dostupnosť Po–Pia 09:00–17:00).

---

## ČASŤ A-RESEND — E-maily cez Resend (funkčná cesta) ✅

Kód netreba meniť — `lib/email.ts` má poskytovateľa vymeniteľného
(`EMAIL_PROVIDER=resend`).

1. **Účet** na [resend.com](https://resend.com) (free: 3 000 e-mailov/mes,
   100/deň — na demo bohato).
2. **Add Domain** → `digitalnapomoc.sk`. **Prepni UI do angličtiny** — slovenský
   auto-preklad mrší typy záznamov (`TXT`→„SMS", `MX`→„Mexiko").
3. **Pridaj 3 DNS záznamy** v hostcreators (DNS zóna, „Pridať nový"). Host je
   **relatívny** (panel dopĺňa `.digitalnapomoc.sk`), oranžové „dorob A záznam"
   **ignoruj** (mailové subdomény web nezobrazujú):

   | Typ | Host | Hodnota | Priorita |
   |---|---|---|---|
   | `TXT` | `resend._domainkey` | `p=…QIDAQAB` (celý DKIM kľúč, Copy z Resendu) | — |
   | `MX` | `send` | `feedback-smtp.…amazonses.com` | `10` |
   | `TXT` | `send` | `v=spf1 include:amazonses.com ~all` | — |

   **Nič nemaž** — root SPF (`…include:_spf.hostcreators.sk -all`) aj `_dmarc`
   nechaj tak. Resend používa subdoménu `send` → žiadny konflikt s existujúcou
   poštou.
4. Späť v Resende **„I've added the records"** → počkaj na **Verified**
   (~pár minút).
5. Resend → **API Keys → Create** (Sending access) → skopíruj `re_…`.
6. **Railway → frontend → Variables:**
   - `EMAIL_PROVIDER` = `resend`
   - `RESEND_API_KEY` = `re_…`
   - `BOOKING_FROM_EMAIL` = `rezervacie@digitalnapomoc.sk`
   - `BUSINESS_NOTIFY_EMAIL` = `info@digitalnapomoc.sk`

Po redeployi otestuj — e-mail dorazí. Odoslané správy vidíš v Resend → **Emails**
(status Sent/Delivered).

---

## ČASŤ A — E-mailová schránka na hostcreators (SMTP) — ⚠️ nefunguje z Railway

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

**Ak e-maily nechodia:** rezervácia sa uloží aj tak (e-mail je „best effort");
chybu nájdeš v **Railway → frontend → Deploy Logs** (`booking: e-mail zlyhal`).
Podľa kódu chyby:

| Chyba (`code`/text) | Príčina | Oprava |
|---|---|---|
| `ETIMEDOUT`, `command: 'CONN'` | port zvonku blokovaný (Railway sa nedostal na SMTP port) | **skús `SMTP_PORT=587`** (STARTTLS); ak stále timeout → hosting blokuje cudzie IP → prejdi na Resend (nižšie) |
| `ENOTFOUND` | `SMTP_HOST` má `http://` / preklep | len `smtp.hostcreators.sk` |
| `EAUTH`, `Invalid login` | zlé heslo / `SMTP_USER` nie je celá adresa | over `SMTP_USER` = celá adresa + heslo |
| `Mail from ... not allowed` | `BOOKING_FROM_EMAIL` ≠ prihlásená schránka | daj rovnakú adresu ako `SMTP_USER` |

**Prechod na Resend (záloha, ak hosting SMTP nejde):** zaregistruj doménu na
[resend.com](https://resend.com) (SPF/DKIM cez DNS), potom na Railway pridaj
`EMAIL_PROVIDER=resend` + `RESEND_API_KEY`. Kód sa nemení — `lib/email.ts` má
poskytovateľa vymeniteľného.

---

## Hotovo ✅

Widget `/rezervacia` je živé demo rezervačného agenta. Ďalej: **R2** —
konverzačný chatbot (rezervácia priamo v chate) volajúci ten istý engine.
