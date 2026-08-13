import type { TocItem } from "@/lib/toc";

/**
 * „Obsah článku" — rozbaliteľná (natívne `<details>`, bez klientského JS),
 * scrollovateľná navigácia na sekcie (kotvové odkazy). Zobrazí sa len pri
 * dostatku nadpisov. Prístupné, ladí s dizajnom webu.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;

  return (
    <details
      open
      className="group overflow-hidden rounded-2xl border border-line bg-cloud shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-white/60 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-mist-400">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-[15px] w-[15px] text-indigo-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 5.5h12M4 10h12M4 14.5h7" />
          </svg>
          Obsah článku
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-mist-400 transition-transform duration-300 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>

      <div className="max-h-[19rem] overflow-y-auto border-t border-line px-3 py-3">
        <ol className="flex flex-col gap-0.5">
          {items.map((item) =>
            item.level === 3 ? (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="relative block rounded-lg py-1.5 pl-8 pr-4 text-[14px] leading-snug text-mist-500 transition-colors before:absolute before:left-4 before:top-1/2 before:h-px before:w-2.5 before:-translate-y-1/2 before:bg-mist-400 hover:bg-white hover:text-indigo-600 hover:before:bg-indigo-500"
                >
                  {item.text}
                </a>
              </li>
            ) : (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded-lg px-4 py-1.5 text-[14.5px] font-medium leading-snug text-mist-700 transition-colors hover:bg-white hover:text-indigo-600"
                >
                  {item.text}
                </a>
              </li>
            ),
          )}
        </ol>
      </div>
    </details>
  );
}
