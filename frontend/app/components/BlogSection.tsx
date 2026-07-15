import Link from "next/link";
import type { WPPost } from "@/lib/wp";
import PostCard from "./PostCard";

/**
 * Blog section — latest posts from the headless WordPress instance.
 * Renders glassmorphic cards consistent with the awesome-design-md system.
 */
export default function BlogSection({ posts }: { posts: WPPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="blog-heading" className="relative border-t border-white/10 bg-black/40 py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="text-[#ff6b35] text-sm tracking-[3px] uppercase mb-3">
            BLOG
          </div>
          <h2 id="blog-heading" className="text-5xl font-semibold tracking-[-2px]">
            Najnovšie články
          </h2>
        </div>

        {/* Post cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="text-sm font-medium text-[#ff6b35] transition-colors hover:text-[#ff8c5c]">
            Zobraziť všetky články →
          </Link>
        </div>
      </div>
    </section>
  );
}
