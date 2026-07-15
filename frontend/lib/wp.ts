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

export interface WPPostDetail extends WPPost {
  contentHtml: string;
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

/**
 * Fetch the latest published posts from WordPress.
 *
 * Runs on the server (Server Component / Route Handler). Returns an empty
 * array on any network/parse error so the page never crashes — the blog
 * section is simply omitted.
 */
export async function fetchLatestPosts(count = 3): Promise<WPPost[]> {
  const endpoint = `${WP_URL}/wp-json/wp/v2/posts`;
  const params = new URLSearchParams({
    per_page: String(count),
    orderby: "date",
    order: "desc",
    status: "publish",
    _fields: "id,slug,link,date,title,excerpt,content",
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    next: { revalidate: 300 }, // cache 5 min
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WP API responded ${res.status}`);
  }

  const raw = (await res.json()) as WPPostRaw[];
  return raw.map((p) => ({
    id: p.id,
    slug: p.slug,
    link: p.link,
    title: stripHtml(p.title.rendered),
    excerpt: stripHtml(p.excerpt.rendered),
    date: formatSlovakDate(p.date),
    readingTime: estimateReadingTime(p.content.rendered),
  }));
}

/**
 * Fetch a single published post by slug, including full HTML content.
 * Returns null if no post matches (caller should render notFound()).
 */
export async function fetchPostBySlug(slug: string): Promise<WPPostDetail | null> {
  const endpoint = `${WP_URL}/wp-json/wp/v2/posts`;
  const params = new URLSearchParams({
    slug,
    status: "publish",
    _fields: "id,slug,link,date,title,excerpt,content",
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WP API responded ${res.status}`);
  }

  const raw = (await res.json()) as WPPostRaw[];
  const post = raw[0];
  if (!post) return null;

  return {
    id: post.id,
    slug: post.slug,
    link: post.link,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    date: formatSlovakDate(post.date),
    readingTime: estimateReadingTime(post.content.rendered),
    contentHtml: post.content.rendered,
  };
}
