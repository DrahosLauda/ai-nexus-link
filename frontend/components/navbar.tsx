"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";

type Variant = "dark" | "light";

/**
 * Navigácia. Predvolene tmavá (dnešný web). Variant `light` je pre nový
 * svetlý dizajn (napr. stránka /headless-wordpress) — biele pozadie, tmavý
 * text, gradientové CTA ako na apertia.ai. Pätička ostáva tmavá v oboch.
 */
export function Navbar({ variant = "dark" }: { variant?: Variant }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const light = variant === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;
  const barBg = light
    ? solid
      ? "bg-[rgba(255,255,255,0.82)] border-line"
      : "bg-transparent border-transparent"
    : solid
      ? "bg-[rgba(8,8,13,0.72)] border-white/[0.08]"
      : "bg-transparent border-transparent";
  const wordmark = light ? "text-ink" : "text-white";
  const linkText = light
    ? "text-mist-500 hover:text-ink"
    : "text-fog-300 hover:text-white";
  const cta = light
    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:shadow-md hover:shadow-indigo-500/20"
    : "border border-white/[0.12] bg-white/[0.06] text-white backdrop-blur-md hover:bg-white/[0.12]";
  const iconBtn = light
    ? "border border-line bg-white text-ink"
    : "border border-white/[0.12] bg-white/[0.06] text-white";
  const mobilePanel = light
    ? "border-t border-line bg-white/95"
    : "border-t border-white/[0.08]";
  const mobileLink = light
    ? "text-mist-500 hover:bg-cloud hover:text-ink"
    : "text-fog-300 hover:bg-white/[0.06] hover:text-white";

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-[18px] transition-colors duration-300 ${barBg}`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid size-[30px] place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-[15px] font-extrabold text-white">
            d
          </div>
          <span className={`text-base font-bold tracking-[-0.01em] ${wordmark}`}>
            digitalnapomoc.sk
          </span>
        </Link>

        <div className={`hidden items-center gap-7 text-sm md:flex ${light ? "text-mist-500" : "text-fog-300"}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${linkText}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#kontakt"
            className={`inline-flex rounded-[10px] px-[18px] py-[9px] font-medium transition-colors ${cta}`}
          >
            Konzultácia
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Zavrieť menu" : "Otvoriť menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className={`grid size-10 place-items-center rounded-[10px] md:hidden ${iconBtn}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className={`flex flex-col gap-1 px-5 py-4 md:hidden ${mobilePanel}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-[15px] transition-colors ${mobileLink}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#kontakt"
            onClick={() => setMenuOpen(false)}
            className={`mt-2 inline-flex justify-center rounded-[10px] px-[18px] py-[9px] font-medium ${cta}`}
          >
            Konzultácia
          </Link>
        </div>
      )}
    </nav>
  );
}
