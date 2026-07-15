import Link from "next/link";
import type { WPPost } from "@/lib/wp";

export default function PostCard({ post }: { post: WPPost }) {
  return (
    <article className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl p-8 transition-all hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-center gap-3 mb-6 text-xs tracking-[1px] uppercase text-white/60 font-mono">
        <span>{post.date}</span>
        <span className="text-white/40">·</span>
        <span>{post.readingTime} min čítania</span>
      </div>

      <h3
        translate="no"
        className="text-2xl font-semibold tracking-[-0.5px] mb-4 leading-snug transition-colors group-hover:text-[#ff8c5c]"
      >
        {post.title}
      </h3>

      <p className="text-white/60 leading-relaxed mb-8 flex-1 line-clamp-4">{post.excerpt}</p>

      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#ff6b35] transition-colors hover:text-[#ff8c5c]"
      >
        Čítať viac
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
      </Link>
    </article>
  );
}
