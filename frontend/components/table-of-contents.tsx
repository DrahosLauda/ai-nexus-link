import type { TocItem } from "@/lib/toc";

/**
 * „Obsah článku" — klikateľná navigácia na sekcie (kotvové odkazy).
 * Serverový, prezentačný komponent. Zobrazí sa len pri dostatku nadpisov.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;

  return (
    <nav
      aria-label="Obsah článku"
      className="rounded-2xl border border-line bg-cloud px-6 py-5"
    >
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-mist-400">
        Obsah článku
      </p>
      <ol className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${item.id}`}
              className="text-[15px] leading-snug text-mist-500 underline-offset-2 transition-colors hover:text-indigo-600 hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
