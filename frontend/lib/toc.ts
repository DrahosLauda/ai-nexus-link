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

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
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

      const existing = attrs ? /\sid=["']([^"']+)["']/i.exec(attrs) : null;
      const baseId = existing ? existing[1] : slugify(text);
      let id = baseId;
      let n = 2;
      while (used.has(id)) id = `${baseId}-${n++}`;
      used.add(id);

      toc.push({ id, text, level: level === "3" ? 3 : 2 });
      const cleanedAttrs = (attrs || "").replace(/\sid=["'][^"']*["']/i, "");
      return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: withIds, toc };
}
