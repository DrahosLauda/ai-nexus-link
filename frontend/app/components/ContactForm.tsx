"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p role="status" className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-white/70">
        Ďakujeme za správu. Ozveme sa čo najskôr na uvedený e-mail.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-white/70">
          Meno
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-white outline-none focus:border-[#ff6b35]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-white/70">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-white outline-none focus:border-[#ff6b35]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-white/70">
          Správa
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-none rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-white outline-none focus:border-[#ff6b35]"
        />
      </div>

      <button
        type="submit"
        className="h-14 rounded-full bg-[#ff6b35] px-10 text-lg font-medium text-black transition-all duration-300 hover:bg-[#ff8c5c] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)]"
      >
        Odoslať správu
      </button>
    </form>
  );
}
