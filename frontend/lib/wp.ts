/**
 * WordPress REST API client.
 * Fetches published posts from the headless WP instance.
 *
 * @see https://developer.wordpress.org/rest-api/reference/posts/
 */

const WP_URL = process.env.WP_URL ?? "https://www.digitalnapomoc.sk";

export interface WPPost {
  id: number;
  slug: string;
  link: string;
  title: string;
  excerpt: string;
  date: string;
  /** Pôvodné ISO dátumy — pre štruktúrované dáta (schema) a sitemap. */
  dateISO: string;
  modifiedISO: string;
  readingTime: number;
  /** URL hlavného obrázka (featured image) vo vhodnej veľkosti, ak existuje. */
  imageUrl: string | null;
}

/** Minimal raw shape we request from the REST API. */
interface WPPostRaw {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: Record<string, { source_url: string }>;
      };
    }>;
  };
}

/**
 * Vyberie z featured image komprimovanú veľkosť, ktorú WordPress
 * automaticky generuje pri nahratí (medium_large ≈ 768 px stačí na kartu).
 */
function extractImageUrl(p: WPPostRaw): string | null {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  const sizes = media.media_details?.sizes;
  return (
    sizes?.medium_large?.source_url ??
    sizes?.large?.source_url ??
    media.source_url ??
    null
  );
}

/** Strip all HTML tags and decode the most common WP entities. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#039;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Estimate reading time in minutes from raw HTML content (~200 wpm). */
function estimateReadingTime(contentHtml: string): number {
  const text = stripHtml(contentHtml);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format an ISO date as a Slovak long date, e.g. "15. októbra 2024". */
function formatSlovakDate(iso: string): string {
  const months = [
    "januára", "februára", "marca", "apríla", "mája", "júna",
    "júla", "augusta", "septembra", "októbra", "novembra", "decembra",
  ];
  const d = new Date(iso);
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export { formatSlovakDate };

/** Celý článok vrátane HTML obsahu — pre detailovú stránku /blog/[slug]. */
export interface WPPostFull extends WPPost {
  contentHtml: string;
}

function toPost(p: WPPostRaw): WPPost {
  return {
    id: p.id,
    slug: p.slug,
    link: p.link,
    title: stripHtml(p.title.rendered),
    excerpt: stripHtml(p.excerpt.rendered),
    date: formatSlovakDate(p.date),
    dateISO: p.date,
    modifiedISO: p.modified,
    readingTime: estimateReadingTime(p.content.rendered),
    imageUrl: extractImageUrl(p),
  };
}

async function wpGet(params: Record<string, string>): Promise<WPPostRaw[]> {
  const search = new URLSearchParams({
    status: "publish",
    // _embed pribalí featured image; _fields musí preto obsahovať aj
    // _links a _embedded, inak WP embed z odpovede vyreže.
    _embed: "wp:featuredmedia",
    _fields: "id,slug,link,date,modified,title,excerpt,content,_links,_embedded",
    ...params,
  });
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?${search}`, {
    next: { revalidate: 300 }, // cache 5 min
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`WP API responded ${res.status}`);
  }
  return (await res.json()) as WPPostRaw[];
}

/**
 * Fetch the latest published posts from WordPress.
 *
 * Runs on the server (Server Component / Route Handler). Callers are
 * expected to catch errors and fall back so the page never crashes.
 */
export async function fetchLatestPosts(count = 3): Promise<WPPost[]> {
  const raw = await wpGet({
    per_page: String(count),
    orderby: "date",
    order: "desc",
  });
  return raw.map(toPost);
}

/**
 * Odstráni zbytočné oddeľovače na konci článku (AI ich občas dopíše):
 * koncové `<hr>`, prázdne odseky alebo odseky s len pomlčkou/hviezdičkami.
 */
function stripTrailingSeparators(html: string): string {
  let out = html.trim();
  const trailing =
    /(<hr[^>]*\/?>|<p[^>]*>(?:\s|&nbsp;|[-–—*_])*<\/p>)\s*$/i;
  while (trailing.test(out)) {
    out = out.replace(trailing, "").trim();
  }
  return out;
}

/** Jeden článok podľa slugu (URL mena), s celým HTML obsahom. */
export async function fetchPostBySlug(
  slug: string,
): Promise<WPPostFull | null> {
  const raw = await wpGet({ slug, per_page: "1" });
  if (raw.length === 0) return null;
  return {
    ...toPost(raw[0]),
    contentHtml: stripTrailingSeparators(raw[0].content.rendered),
  };
}

/** Odľahčený zoznam článkov (slug + dátum úpravy) pre sitemap. */
export interface WPPostRef {
  slug: string;
  modifiedISO: string;
}

/**
 * Vráti slug a dátum poslednej úpravy pre všetky publikované články.
 * Používa sa v `app/sitemap.ts`. Bez `_embed`, aby bola odpoveď malá.
 */
export async function fetchAllPostRefs(): Promise<WPPostRef[]> {
  const search = new URLSearchParams({
    status: "publish",
    per_page: "100",
    orderby: "date",
    order: "desc",
    _fields: "slug,modified",
  });
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?${search}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`WP API responded ${res.status}`);
  }
  const data = (await res.json()) as Array<{ slug: string; modified: string }>;
  return data.map((p) => ({ slug: p.slug, modifiedISO: p.modified }));
}
