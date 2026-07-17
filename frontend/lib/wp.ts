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
  readingTime: number;
}

/** Minimal raw shape we request from the REST API. */
interface WPPostRaw {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

/** Strip all HTML tags and decode the most common WP entities. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
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
    readingTime: estimateReadingTime(p.content.rendered),
  };
}

async function wpGet(params: Record<string, string>): Promise<WPPostRaw[]> {
  const search = new URLSearchParams({
    status: "publish",
    _fields: "id,slug,link,date,title,excerpt,content",
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

/** Jeden článok podľa slugu (URL mena), s celým HTML obsahom. */
export async function fetchPostBySlug(
  slug: string,
): Promise<WPPostFull | null> {
  const raw = await wpGet({ slug, per_page: "1" });
  if (raw.length === 0) return null;
  return { ...toPost(raw[0]), contentHtml: raw[0].content.rendered };
}
