import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

/**
 * Predvolený zdieľací obrázek (Open Graph + Twitter) — ukáže sa v náhľade,
 * keď niekto zdieľa domovskú alebo inú stránku bez vlastného obrázka.
 * Články majú vlastný (featured image), tento je záložný pre zvyšok webu.
 *
 * Generuje ho Next.js zo vstavaného `next/og` — žiadny externý súbor.
 */
export const alt = "digitalnapomoc.sk – Digitálna pomoc, ktorá pracuje za vás";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#08080d",
          backgroundImage:
            "linear-gradient(135deg, rgba(99,102,241,0.28), rgba(168,85,247,0.14))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              marginRight: "22px",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            d
          </div>
          <div style={{ color: "white", fontSize: "40px", fontWeight: 700 }}>
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            color: "white",
            fontSize: "68px",
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: "44px",
            maxWidth: "920px",
          }}
        >
          Digitálna pomoc, ktorá pracuje za vás
        </div>

        <div
          style={{
            color: "#a5b4fc",
            fontSize: "32px",
            marginTop: "28px",
            maxWidth: "840px",
          }}
        >
          AI chatboty, automatizácia a moderný web pre malé firmy.
        </div>
      </div>
    ),
    { ...size },
  );
}
