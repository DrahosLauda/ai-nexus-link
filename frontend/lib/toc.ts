/**
 * „Obsah článku" (Table of Contents) z HTML článku.
 *
 * Doplní `id` do nadpisov H2/H3 a vráti zoznam pre klikateľnú navigáciu
 * (kotvové odkazy v rámci stránky). Beží serverovo nad naším kontrolovaným
 * WP HTML — žiadny klientský JS, žiadna nová závislosť. Platí pre všetky
 * články (aj staré), lebo sa počíta pri zobrazení, nie v obsahu.
 */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const DIACRITICS: Record<string, string> = {
  á: "a", ä: "a", č: "c", ď: "d", é: "e", í: "i", ĺ: "l", ľ: "l",
  ň: "n", ó: "o", ô: "o", ŕ: "r", š: "s", ť: "t", ú: "u", ý: "y", ž: "z",
};

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[áäčďéíĺľňóôŕšťúýž]/g, (c) => DIACRITICS[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "sekcia";
}

const NAMED_ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
  "&apos;": "'", "&#39;": "'", "&nbsp;": " ", "&hellip;": "…",
};

/** Dekóduje HTML entity (napr. &#8222; → „, &amp; → &), aby TOC nezobrazoval kód. */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&[a-zA-Z]+;/g, (m) => NAMED_ENTITIES[m] ?? m);
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Doplní `id` do H2/H3 a vráti (upravené HTML + zoznam nadpisov).
 * Duplicitné id rieši príponou -2, -3…
 */
export function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string | undefined, inner: string) => {
      const text = stripTags(inner);
      if (!text) return match;
      // Vodiace číslovanie z nadpisu („1. ", „2) ") do TOC labelu nedávame —
      // hierarchiu ukazuje odsadenie, nie čísla (konzistentne pre H2 aj H3).
      const label = text.replace(/^\d+[.)]\s+/, "");

      const existing = attrs ? /\sid=["']([^"']+)["']/i.exec(attrs) : null;
      const baseId = existing ? existing[1] : slugify(label);
      let id = baseId;
      let n = 2;
      while (used.has(id)) id = `${baseId}-${n++}`;
      used.add(id);

      toc.push({ id, text: label, level: level === "3" ? 3 : 2 });
      const cleanedAttrs = (attrs || "").replace(/\sid=["'][^"']*["']/i, "");
      return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: withIds, toc };
}
