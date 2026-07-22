/**
 * Centrálna SEO/GEO konfigurácia webu.
 *
 * Jedno miesto pre: verejnú adresu webu, názov, popis, prepínač indexovania
 * a generátory štruktúrovaných dát (JSON-LD). Vďaka tomu sa dá celý SEO/GEO
 * základ preniesť na ďalšieho klienta zmenou pár hodnôt (vízia SaaS).
 *
 * GEO = Generative Engine Optimization — optimalizácia pre AI vyhľadávače
 * (ChatGPT, Perplexity, Google AI Overviews). Ide o to, aby náš obsah AI
 * ľahko našli, prečítali a citovali.
 */

/**
 * Verejná adresa, na ktorej beží FRONTEND (nie WordPress!).
 * ⚠️ Len základná adresa, bez lomky na konci.
 *
 * Predvolene ukazuje na terajší Railway web. Pri prepnutí domény stačí
 * v Railway Variables nastaviť `SITE_URL=https://digitalnapomoc.sk`.
 */
export const SITE_URL = (
  process.env.SITE_URL ?? "https://ai-nexus-link-production.up.railway.app"
).replace(/\/+$/, "");

export const SITE_NAME = "digitalnapomoc.sk";

export const SITE_DESCRIPTION =
  "Pomáhame malým firmám a jednotlivcom zvládnuť digitálny svet — od AI " +
  "chatbotov po automatizáciu rutinných úloh. Ľudsky a bez žargónu.";

export const SITE_EMAIL = "info@digitalnapomoc.sk";

/**
 * Má vyhľadávač web indexovať? Kým nie sme na ostrej doméne, držíme web
 * SKRYTÝ (noindex) — súlad s plánom „spustiť až po prepnutí domény".
 * Na spustenie: v Railway Variables nastav `SITE_INDEXABLE=true`.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

/** Zloží absolútnu URL z cesty ("/blog" → "https://…/blog"). */
export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/**
 * AI roboty (crawleri), ktorým chceme obsah sprístupniť kvôli GEO.
 * Keď je web indexovateľný, v `robots.txt` ich výslovne povolíme —
 * signál „áno, AI vyhľadávače, čítajte a citujte nás".
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Amazonbot",
  "DuckAssistBot",
  "YouBot",
];

/** Minimálny tvar článku, ktorý potrebujú štruktúrované dáta. */
interface ArticleForSchema {
  title: string;
  excerpt: string;
  slug: string;
  dateISO: string;
  modifiedISO: string;
  imageUrl: string | null;
}

/** JSON-LD schéma organizácie (kto sme) — patrí na domovskú stránku. */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
  };
}

/** JSON-LD schéma webu (čo je táto stránka) — patrí na domovskú stránku. */
export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "sk-SK",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** JSON-LD schéma článku — patrí na stránku konkrétneho článku. */
export function articleSchema(post: ArticleForSchema): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(post.imageUrl ? { image: [post.imageUrl] } : {}),
    datePublished: post.dateISO,
    dateModified: post.modifiedISO || post.dateISO,
    inLanguage: "sk-SK",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** JSON-LD omrvinkovej navigácie (Domov › Blog › …) — pre Google rich results. */
export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** JSON-LD často kladených otázok (FAQPage) — Google z nich robí rich results. */
export function faqSchema(
  faqs: { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
