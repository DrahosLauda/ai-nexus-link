export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,#1a1a1a_0%,#0a0a0a_60%)] px-6 py-24 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-sm uppercase tracking-[3px] text-[#ff6b35]">{eyebrow}</div>
        <h1 className="mb-6 text-5xl font-semibold tracking-[-2px] md:text-6xl">{title}</h1>
        {description && (
          <p className="text-lg leading-relaxed text-white/70 md:text-xl">{description}</p>
        )}
      </div>
    </div>
  );
}
