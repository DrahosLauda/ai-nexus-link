import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { fetchAllPostRefs } from "@/lib/wp";

export const revalidate = 300;

/**
 * Generuje `/sitemap.xml` — mapu webu pre vyhľadávače.
 *
 * Statické stránky (domov, blog) + všetky publikované články z WordPressu.
 * Keď WP nie je dostupný, vráti aspoň statické stránky (web sa nerozbije).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const posts = await fetchAllPostRefs();
    const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.modifiedISO),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...staticPages, ...postPages];
  } catch {
    // WordPress nedostupný — vrátime aspoň statické stránky.
    return staticPages;
  }
}
