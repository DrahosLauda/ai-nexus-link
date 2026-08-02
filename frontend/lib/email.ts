/**
 * Odosielanie e-mailov — vymeniteľný poskytovateľ (Krok R1 z docs/plan-agenti.md).
 *
 * Spoločný stavebný kameň pre celý balík agentov (rezervácie, chatbot-leady,
 * e-mail auto-odpoveď). Volajúci kód pozná iba `sendEmail(msg)`; ktorý
 * poskytovateľ sa použije, rozhoduje `EMAIL_PROVIDER`:
 *   - `smtp`   (predvolené) → hosting SMTP (hostcreators) cez nodemailer,
 *   - `resend` → Resend HTTP API cez fetch (záloha pre vyššie objemy/analytiku).
 *
 * Prechod na Resend = zmena env premennej, nie prepis volajúceho kódu.
 * Beží na Node runtime (Railway), nie edge — SMTP je preto v poriadku.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Voliteľná adresa na odpoveď (napr. zákazník pri notifikácii prevádzke). */
  replyTo?: string;
}

const FROM = process.env.BOOKING_FROM_EMAIL || "rezervacie@digitalnapomoc.sk";
const FROM_NAME = process.env.BOOKING_FROM_NAME || "digitálna pomoc";
const PROVIDER = (process.env.EMAIL_PROVIDER || "smtp").toLowerCase();

/** Je nakonfigurovaný aspoň jeden poskytovateľ? (route to vie ohlásiť ako 503.) */
export function emailConfigured(): boolean {
  if (PROVIDER === "resend") return Boolean(process.env.RESEND_API_KEY);
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** Pošle e-mail cez zvoleného poskytovateľa. Hodí chybu pri zlyhaní. */
export async function sendEmail(msg: EmailMessage): Promise<void> {
  if (PROVIDER === "resend") {
    await sendViaResend(msg);
  } else {
    await sendViaSmtp(msg);
  }
}

// ── Hlavná cesta: hosting SMTP (nodemailer) ─────────────────────────────────
// Transporter je drahý na vytvorenie → cachujeme jeden na proces.
let transporter: import("nodemailer").Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;
  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 = implicitné TLS; 587/25 = STARTTLS (secure=false + upgrade).
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

async function sendViaSmtp(msg: EmailMessage): Promise<void> {
  const tx = await getTransporter();
  await tx.sendMail({
    from: `"${FROM_NAME}" <${FROM}>`,
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
    replyTo: msg.replyTo,
  });
}

// ── Záloha: Resend HTTP API ─────────────────────────────────────────────────
async function sendViaResend(msg: EmailMessage): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM}>`,
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      reply_to: msg.replyTo,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}
