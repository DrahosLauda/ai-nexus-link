import type { Metadata } from "next";
import { fetchLatestPosts } from "@/lib/wp";
import PageHero from "../components/PageHero";
import PostCard from "../components/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Články o AI automatizácii, SEO a headless architektúre webov.",
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchLatestPosts>> = [];
  try {
    posts = await fetchLatestPosts(30);
  } catch {
    posts = [];
  }

  return (
    <>
      <PageHero eyebrow="Blog" title="Články a novinky" description="Obsah generovaný a spravovaný priamo z headless WordPressu." />

      <section aria-label="Zoznam článkov" className="mx-auto max-w-6xl px-6 py-24">
        {posts.length === 0 ? (
          <p className="text-center text-white/60">Momentálne tu nie sú žiadne články.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
