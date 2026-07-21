import type { MetadataRoute } from "next";
import { AI_CRAWLERS, SITE_INDEXABLE, absoluteUrl } from "@/lib/seo";

/**
 * Generuje `/robots.txt` — hovorí robotom, čo smú prehliadať.
 *
 * Kým web nie je spustený na ostrej doméne (`SITE_INDEXABLE` != true),
 * zakážeme prehliadanie úplne — web ostáva skrytý. Po spustení povolíme
 * všetkých bežných robotov aj AI crawlerov (GEO) a odkážeme na sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    // Web je zatiaľ skrytý pred vyhľadávačmi.
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      // Bežní roboti: všetko okrem interných API ciest.
      { userAgent: "*", allow: "/", disallow: "/api/" },
      // AI vyhľadávače výslovne pozývame (GEO) — nech obsah čítajú a citujú.
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/api/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
