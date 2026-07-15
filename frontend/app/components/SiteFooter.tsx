"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const isLight = usePathname() === "/";
  const linkClass = isLight ? "transition-colors hover:text-gray-900" : "transition-colors hover:text-white";

  return (
    <footer className={isLight ? "border-t border-gray-200 bg-white py-12" : "border-t border-white/10 py-12"}>
      <div
        className={
          isLight
            ? "mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-gray-500 md:flex-row"
            : "mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-white/50 md:flex-row"
        }
      >
        <p>© {new Date().getFullYear()} AI Nexus Link. Všetky práva vyhradené.</p>
        <nav aria-label="Pätová navigácia">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
            <li>
              <Link href="/sluzby" className={linkClass}>
                Služby
              </Link>
            </li>
            <li>
              <Link href="/o-nas" className={linkClass}>
                O nás
              </Link>
            </li>
            <li>
              <Link href="/blog" className={linkClass}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className={linkClass}>
                Kontakt
              </Link>
            </li>
            <li>
              <Link href="/ochrana-osobnych-udajov" className={linkClass}>
                Ochrana osobných údajov
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
