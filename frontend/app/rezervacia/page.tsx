import type { Metadata } from "next";
import { BookingWidget } from "@/components/booking-widget";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Rezervácia termínu",
  description:
    "Rezervujte si termín online — vyberte službu, deň a voľný čas. Živá ukážka rezervačného AI agenta od digitálnej pomoci.",
  alternates: { canonical: "/rezervacia" },
};

export default function RezervaciaPage() {
  return (
    <div className="min-h-screen bg-cloud text-ink">
      <Navbar />
      <main className="mx-auto flex max-w-[720px] flex-col gap-8 px-5 pb-16 pt-[130px] sm:px-8 lg:pb-24 lg:pt-[150px]">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            Rezervácia
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.025em] text-ink lg:text-[44px]">
            Rezervujte si termín
          </h1>
          <p className="max-w-[540px] text-pretty text-[17px] leading-relaxed text-mist-500">
            Vyberte službu, deň a voľný čas — potvrdenie vám hneď príde e-mailom.
            Toto je živá ukážka nášho rezervačného agenta, ktorého vieme nasadiť
            aj na váš web.
          </p>
        </div>

        <BookingWidget />
      </main>
      <Footer />
    </div>
  );
}
