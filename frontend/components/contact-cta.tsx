"use client";

import { useState } from "react";
import { submitLead } from "@/lib/submit-lead";

const inputClasses =
  "rounded-[10px] border border-white/[0.15] bg-[rgba(8,8,13,0.4)] px-4 py-[13px] text-[15px] text-white placeholder:text-fog-500 outline-none transition-colors focus:border-indigo-400";

export function ContactCta() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    const err = await submitLead({
      name: String(data.get("name") ?? "") || undefined,
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? "") || undefined,
      website: String(data.get("website") ?? "") || undefined,
      source: "kontakt-cta",
    });
    if (err) {
      setError(err);
      setStatus("idle");
    } else {
      setStatus("done");
    }
  }

  return (
    <div id="kontakt" className="scroll-mt-16 bg-night">
      <section className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-10 lg:pb-24">
        <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-indigo-400/30 bg-[linear-gradient(150deg,rgba(99,102,241,0.22),rgba(168,85,247,0.12))] px-6 py-12 text-center backdrop-blur-2xl sm:px-12 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[120px] left-1/2 h-60 w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.35)_0%,rgba(129,140,248,0)_70%)] blur-[30px]"
          />
          <h2 className="relative text-balance text-4xl font-extrabold tracking-[-0.025em] text-white lg:text-[42px]">
            Poďme sa porozprávať
          </h2>
          <p className="relative max-w-[480px] text-[17px] leading-relaxed text-fog-200">
            Prvá konzultácia je zadarmo a nezáväzná. Zistíme, kde vám digitál
            ušetrí najviac času.
          </p>
          <div className="relative mt-0.5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13.5px] text-indigo-300">
            <span>✓ Konzultácia zdarma</span>
            <span>✓ Bez záväzku</span>
            <span>✓ Odpovieme do 24 hodín</span>
          </div>

          {status === "done" ? (
            <p
              role="status"
              className="relative mt-3.5 w-full max-w-[560px] rounded-[10px] border border-indigo-400/40 bg-indigo-400/10 px-4 py-[15px] text-[15px] text-indigo-300"
            >
              Ďakujeme za správu! Ozveme sa vám do 24 hodín.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative mt-3.5 grid w-full max-w-[560px] gap-3 text-left sm:grid-cols-2"
            >
              <input
                type="text"
                name="name"
                required
                placeholder="Meno *"
                className={inputClasses}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="E-mail *"
                className={inputClasses}
              />
              <textarea
                name="message"
                rows={3}
                placeholder="S čím potrebujete pomôcť?"
                className={`${inputClasses} resize-y sm:col-span-2`}
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
                <p role="alert" className="text-[13.5px] text-red-400 sm:col-span-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="cursor-pointer rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-500 px-5 py-[15px] text-base font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.45)] transition-shadow hover:shadow-[0_0_48px_rgba(99,102,241,0.65)] disabled:cursor-default disabled:opacity-60 sm:col-span-2"
              >
                {status === "sending"
                  ? "Odosielam…"
                  : "Rezervovať bezplatnú konzultáciu"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
