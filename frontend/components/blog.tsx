export interface BlogCardPost {
  title: string;
  excerpt: string;
  date: string;
  read: string;
  href: string;
  tag?: string;
  external?: boolean;
}

const gradients = [
  "linear-gradient(135deg, rgba(99,102,241,0.45), rgba(168,85,247,0.3))",
  "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.3))",
  "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(99,102,241,0.35))",
];

export function Blog({ posts }: { posts: BlogCardPost[] }) {
  return (
    <div id="blog" className="scroll-mt-16 bg-night">
      <section className="mx-auto flex max-w-[1320px] flex-col gap-10 px-5 py-16 sm:px-10 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-400">
              Blog
            </span>
            <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-white lg:text-[42px]">
              Najnovšie články
            </h2>
          </div>
          <a
            href="#blog"
            className="inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.05] px-5 py-[11px] text-[14.5px] font-medium text-fog-100 backdrop-blur-md transition-colors hover:bg-white/[0.10] hover:text-white"
          >
            Všetky články →
          </a>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <article
              key={post.title}
              className="flex flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl transition-[border-color,box-shadow] duration-250 hover:border-indigo-400/65 hover:shadow-[0_0_32px_rgba(99,102,241,0.15)]"
            >
              <div
                className="grid h-[150px] place-items-center"
                style={{ background: gradients[i % gradients.length] }}
              >
                {post.tag && (
                  <span className="rounded-full border border-white/20 bg-[rgba(8,8,13,0.35)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/85 backdrop-blur-sm">
                    {post.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-[12.5px] text-fog-500">
                  {post.date} · {post.read} min čítania
                </span>
                <h3 className="text-balance text-[18.5px] font-bold leading-[1.35] tracking-[-0.01em] text-white">
                  {post.title}
                </h3>
                <p className="flex-1 text-sm leading-[1.55] text-fog-400">
                  {post.excerpt}
                </p>
                <a
                  href={post.href}
                  {...(post.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                >
                  Čítať článok →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
