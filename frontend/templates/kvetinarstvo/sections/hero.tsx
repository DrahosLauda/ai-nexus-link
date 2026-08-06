/**
 * Sub-hero pre podstránky (kompaktný textový hlavičkový blok na `sand`).
 * Domovský hero s videom je v `sections/hero-video.tsx`.
 */
export function SubHero({ h1, text }: { h1: string; text: string }) {
  return (
    <section className="border-b border-flora-line bg-flora-sand">
      <div className="mx-auto w-full max-w-[1200px] px-flora-gutter py-flora-section-sm">
        <div className="flex max-w-[46ch] flex-col gap-4 pt-6">
          <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">{h1}</h1>
          <p className="text-flora-lead text-pretty text-flora-moss">{text}</p>
        </div>
      </div>
    </section>
  );
}
