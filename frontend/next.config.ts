import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Obrázky článkov prichádzajú z WordPress Knižnice médií — Next.js
    // ich smie optimalizovať (zmenšiť, WebP/AVIF) len z povolených hostov.
    remotePatterns: [
      { protocol: "https", hostname: "**.digitalnapomoc.sk" },
      { protocol: "https", hostname: "digitalnapomoc.sk" },
      // lokálny vývoj / testy s mock WordPressom
      { protocol: "http", hostname: "localhost" },
    ],
    // Optimalizátor štandardne (správne) odmieta obrázky z privátnych IP.
    // Povolené len explicitne pre lokálne testy: ALLOW_LOCAL_IMAGES=1
    dangerouslyAllowLocalIP: process.env.ALLOW_LOCAL_IMAGES === "1",
  },
};

export default nextConfig;
