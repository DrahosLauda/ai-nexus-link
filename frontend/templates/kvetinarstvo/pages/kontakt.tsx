/**
 * Kontakt a objednávka `/kontakt` — kontakt + hodiny + mapa, objednávkový
 * formulár (predvyplní typ z `?typ=`), krátke FAQ.
 */
import { brand, contactFaq, contactIntro, contactSekcie } from "../content";
import { Faq } from "../sections/bloky";
import { KontaktForm } from "../sections/kontakt-form";
import { FloraFigure } from "../images/placeholder";
import { Eyebrow, Sekcia } from "../sections/ui";

export function KontaktPage() {
  const mapaHref = `https://www.google.com/maps/search/${encodeURIComponent(
    `${brand.meno}, ${brand.adresaRiadok1}, ${brand.adresaRiadok2}`,
  )}`;

  return (
    <>
      <section className="border-b border-flora-line bg-flora-sand">
        <div className="mx-auto w-full max-w-[1200px] px-flora-gutter py-flora-section-sm">
          <div className="flex max-w-[52ch] flex-col gap-4 pt-6">
            <h1 className="text-flora-h1 font-flora-display font-medium text-balance text-flora-ink">
              {contactSekcie.h1}
            </h1>
            <p className="text-flora-lead text-pretty text-flora-moss">{contactIntro}</p>
          </div>
        </div>
      </section>

      <Sekcia podklad="paper">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Kontakt + hodiny + mapa */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>{contactSekcie.atelierEyebrow}</Eyebrow>
              <address className="not-italic text-flora-body leading-relaxed text-flora-ink">
                {brand.adresaRiadok1}
                <br />
                {brand.adresaRiadok2}
              </address>
              <a href={`tel:${brand.telefon.replace(/\s/g, "")}`} className="text-flora-body text-flora-clay-600 underline decoration-1 underline-offset-4">
                {brand.telefon}
              </a>
              <a href={`mailto:${brand.email}`} className="text-flora-body text-flora-clay-600 underline decoration-1 underline-offset-4">
                {brand.email}
              </a>
            </div>

            <div>
              <h2 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{contactSekcie.hodinyNadpis}</h2>
              <dl className="mt-3 flex max-w-[320px] flex-col gap-1.5 text-flora-body">
                {brand.otvaracieHodiny.map((h) => (
                  <div key={h.dni} className="flex justify-between gap-4">
                    <dt className="text-flora-moss">{h.dni}</dt>
                    <dd className="text-flora-ink">{h.hodiny}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <a href={mapaHref} className="group block max-w-[420px]" target="_blank" rel="noopener noreferrer">
              <FloraFigure
                alt={`Mapa — ${brand.adresaRiadok1}, ${brand.adresaRiadok2}`}
                pomer="16/9"
                odtien="sage"
              />
              <span className="mt-2 inline-flex text-flora-small font-semibold text-flora-clay-600 underline decoration-1 underline-offset-4">
                {contactSekcie.mapaOdkaz}
              </span>
            </a>
          </div>

          {/* Objednávkový formulár */}
          <div className="rounded-flora-lg bg-flora-sand p-6 sm:p-8">
            <h2 className="text-flora-h3 font-flora-display font-medium text-flora-ink">{contactSekcie.formularNadpis}</h2>
            <p className="mt-2 text-flora-body text-flora-moss">{contactSekcie.formularPopis}</p>
            <div className="mt-6">
              <KontaktForm />
            </div>
          </div>
        </div>
      </Sekcia>

      <Sekcia podklad="paper" zhustena>
        <Eyebrow>{contactSekcie.faqEyebrow}</Eyebrow>
        <div className="mt-6">
          <Faq otazky={contactFaq} />
        </div>
      </Sekcia>
    </>
  );
}
