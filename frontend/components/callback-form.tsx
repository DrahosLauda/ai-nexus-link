"use client";

import { useState } from "react";
import { submitLead } from "@/lib/submit-lead";

const inputClasses =
  "rounded-[10px] border border-line bg-white px-4 py-[13px] text-[15px] text-ink placeholder:text-mist-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export function CallbackForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    const err = await submitLead({
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || undefined,
      website: String(data.get("website") ?? "") || undefined,
      source: "hero-callback",
    });
    if (err) {
      setError(err);
      setStatus("idle");
    } else {
      setStatus("done");
    }
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-white p-[30px] shadow-[0_24px_64px_rgba(23,23,50,0.10)]">
      <h3 className="text-xl font-bold tracking-[-0.01em] text-ink">
        Zistite, kde vám AI ušetrí čas
      </h3>
      <p className="text-sm leading-[1.55] text-mist-500">
        Nechajte nám kontakt a ozveme sa do 24 hodín.
      </p>

      {status === "done" ? (
        <p
          role="status"
          className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-[13px] text-[15px] text-emerald-700"
        >
          Ďakujeme! Ozveme sa vám do 24 hodín.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail *"
            className={inputClasses}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefón"
            className={inputClasses}
          />
          {/* Honeypot proti robotom — pre ľudí neviditeľné */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          {error && (
            <p role="alert" className="text-[13.5px] text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="cursor-pointer rounded-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-[15.5px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {status === "sending" ? "Odosielam…" : "Zavolajte mi späť"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3.5 text-[12.5px] text-mist-400">
        <span>✓ Odpoveď do 24 h</span>
        <span>✓ Nezáväzné</span>
        <span>✓ GDPR</span>
      </div>
    </div>
  );
}
