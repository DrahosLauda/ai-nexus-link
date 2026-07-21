import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import { fetchLatestPosts } from "@/lib/wp";

export const revalidate = 300;

/**
 * Generuje `/llms.txt` — štandard, ktorý AI modelom (ChatGPT, Claude…)
 * v čitateľnej podobe zhŕňa, o čom web je a kde nájdu hlavný obsah.
 * Formát je jednoduchý Markdown (viď https://llmstxt.org).
 */
export async function GET(): Promise<Response> {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Web: ${SITE_URL}`,
    "",
    "## Blog",
    "",
  ];

  try {
    const posts = await fetchLatestPosts(50);
    for (const post of posts) {
      lines.push(
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt}`,
      );
    }
  } catch {
    lines.push("- (zoznam článkov je momentálne nedostupný)");
  }

  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
