"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/sluzby", label: "Služby" },
  { href: "/o-nas", label: "O nás" },
  { href: "/referencie", label: "Referencie" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const isLight = usePathname() === "/";

  return (
    <header
      className={
        isLight
          ? "sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl"
          : "sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3" translate="no">
          <span className="h-2 w-2 rounded-full bg-[#ff6b35]" />
          <span className={isLight ? "text-sm font-semibold tracking-[1px] text-gray-900" : "text-sm font-semibold tracking-[1px]"}>
            AI Nexus Link
          </span>
        </Link>

        <nav aria-label="Hlavná navigácia" className="hidden md:block">
          <ul className={isLight ? "flex items-center gap-8 text-sm text-gray-600" : "flex items-center gap-8 text-sm text-white/70"}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isLight ? "transition-colors hover:text-gray-900" : "transition-colors hover:text-white"}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          className={
            isLight
              ? "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 md:hidden"
              : "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 md:hidden"
          }
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobilná navigácia"
          className={isLight ? "border-t border-gray-200 md:hidden" : "border-t border-white/10 md:hidden"}
        >
          <ul className={isLight ? "flex flex-col px-6 py-4 text-sm text-gray-600" : "flex flex-col px-6 py-4 text-sm text-white/70"}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={isLight ? "block py-3 transition-colors hover:text-gray-900" : "block py-3 transition-colors hover:text-white"}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
