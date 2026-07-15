"use client";

import { useState } from "react";
import { submitLead } from "@/lib/submit-lead";

const inputClasses =
  "rounded-[10px] border border-white/[0.12] bg-white/[0.05] px-4 py-[13px] text-[15px] text-white placeholder:text-fog-500 outline-none transition-colors focus:border-indigo-400";

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
    <div className="flex flex-col gap-3.5 rounded-[20px] border border-white/[0.12] bg-white/[0.05] p-[30px] shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-[20px]">
      <h3 className="text-xl font-bold tracking-[-0.01em] text-white">
        Zistite, kde vám AI ušetrí čas
      </h3>
      <p className="text-sm leading-[1.55] text-fog-400">
        Nechajte nám kontakt a ozveme sa do 24 hodín.
      </p>

      {status === "done" ? (
        <p
          role="status"
          className="rounded-[10px] border border-indigo-400/40 bg-indigo-400/10 px-4 py-[13px] text-[15px] text-indigo-300"
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
            <p role="alert" className="text-[13.5px] text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="cursor-pointer rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-500 px-5 py-3.5 text-[15.5px] font-semibold text-white shadow-[0_0_28px_rgba(99,102,241,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] disabled:cursor-default disabled:opacity-60"
          >
            {status === "sending" ? "Odosielam…" : "Zavolajte mi späť"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3.5 text-[12.5px] text-fog-500">
        <span>✓ Odpoveď do 24 h</span>
        <span>✓ Nezáväzné</span>
        <span>✓ GDPR</span>
      </div>
    </div>
  );
}
