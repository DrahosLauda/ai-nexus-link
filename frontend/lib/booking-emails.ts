/**
 * Slovenské e-mailové šablóny pre rezervácie (Krok R1 z docs/plan-agenti.md).
 *
 * Dve správy: potvrdenie zákazníkovi + notifikácia prevádzke
 * (`BUSINESS_NOTIFY_EMAIL`). Odoslanie ide cez vymeniteľný `lib/email.ts`.
 * E-maily nezhodia rezerváciu — zavolajúci ich posiela „best effort".
 */

import { sendEmail, type EmailMessage } from "./email";
import { formatSlotHuman } from "./booking-data";

const SITE_NAME = "digitálna pomoc";
const SITE_URL = process.env.SITE_URL || "https://www.digitalnapomoc.sk";

export interface BookingDetails {
  serviceName: string;
  start: string; // ISO UTC
  name: string;
  email: string;
  phone?: string;
  note?: string;
}

function esc(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);
}

function wrapHtml(title: string, bodyRows: string): string {
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;color:#16161d">
  <h2 style="color:#4f46e5;margin:0 0 16px">${esc(title)}</h2>
  <table style="width:100%;border-collapse:collapse;font-size:15px">${bodyRows}</table>
  <p style="margin-top:24px;font-size:13px;color:#7a7a88">${SITE_NAME} · <a href="${SITE_URL}" style="color:#4f46e5">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
</div>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#7a7a88;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;font-weight:600">${esc(value)}</td></tr>`;
}

/** Potvrdenie zákazníkovi. */
function customerMessage(b: BookingDetails): EmailMessage {
  const when = formatSlotHuman(b.start);
  const text = [
    `Dobrý deň${b.name ? ", " + b.name : ""},`,
    ``,
    `vaša rezervácia je potvrdená:`,
    `• Služba: ${b.serviceName}`,
    `• Termín: ${when}`,
    ``,
    `Ak potrebujete termín zmeniť alebo zrušiť, odpovedzte prosím na tento e-mail.`,
    ``,
    `${SITE_NAME}`,
    SITE_URL,
  ].join("\n");
  const html = wrapHtml(
    "Rezervácia je potvrdená ✅",
    row("Služba", b.serviceName) +
      row("Termín", when) +
      `<tr><td colspan="2" style="padding:14px 0 0;color:#7a7a88;font-size:13px">Ak potrebujete termín zmeniť alebo zrušiť, odpovedzte na tento e-mail.</td></tr>`,
  );
  return { to: b.email, subject: `Potvrdenie rezervácie — ${b.serviceName}`, text, html };
}

/** Notifikácia prevádzke (kto, čo, kedy, kontakt). */
function businessMessage(b: BookingDetails, to: string): EmailMessage {
  const when = formatSlotHuman(b.start);
  const lines = [
    `Nová rezervácia z webu:`,
    `• Služba: ${b.serviceName}`,
    `• Termín: ${when}`,
    `• Meno: ${b.name}`,
    `• E-mail: ${b.email}`,
    b.phone ? `• Telefón: ${b.phone}` : null,
    b.note ? `• Poznámka: ${b.note}` : null,
  ].filter(Boolean);
  const html = wrapHtml(
    "Nová rezervácia 📅",
    row("Služba", b.serviceName) +
      row("Termín", when) +
      row("Meno", b.name) +
      row("E-mail", b.email) +
      (b.phone ? row("Telefón", b.phone) : "") +
      (b.note ? row("Poznámka", b.note) : ""),
  );
  return {
    to,
    subject: `Nová rezervácia — ${b.serviceName} (${when})`,
    text: lines.join("\n"),
    html,
    replyTo: b.email,
  };
}

/** Pošle obe správy „best effort" — chyby len zaloguje, nikdy nehodí. */
export async function sendBookingEmails(b: BookingDetails): Promise<void> {
  const notify = process.env.BUSINESS_NOTIFY_EMAIL;
  const jobs: Promise<void>[] = [sendEmail(customerMessage(b))];
  if (notify) jobs.push(sendEmail(businessMessage(b, notify)));

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "rejected") console.error("booking: e-mail zlyhal", r.reason);
  }
}
