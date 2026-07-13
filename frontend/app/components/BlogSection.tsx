import type { WPPost } from "@/lib/wp";

/**
 * Blog section — latest posts from the headless WordPress instance.
 * Renders glassmorphic cards consistent with the awesome-design-md system.
 */
export default function BlogSection({ posts }: { posts: WPPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative border-t border-white/10 bg-black/40 py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="text-[#ff6b35] text-sm tracking-[3px] uppercase mb-3">
            BLOG
          </div>
          <h2 className="text-5xl font-semibold tracking-[-2px]">
            Najnovšie články
          </h2>
        </div>

        {/* Post cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl p-8 transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              {/* Meta */}
              <div className="flex items-center gap-3 mb-6 text-xs tracking-[1px] uppercase text-white/40 font-mono">
                <span>{post.date}</span>
                <span className="text-white/20">·</span>
                <span>{post.readingTime} min čítania</span>
              </div>

              {/* Title */}
              <h3
                translate="no"
                className="text-2xl font-semibold tracking-[-0.5px] mb-4 leading-snug transition-colors group-hover:text-[#ff8c5c]"
              >
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-white/60 leading-relaxed mb-8 flex-1 line-clamp-4">
                {post.excerpt}
              </p>

              {/* Read link */}
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#ff6b35] transition-colors hover:text-[#ff8c5c]"
              >
                Čítať viac
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
