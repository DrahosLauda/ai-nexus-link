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
  // Proxy médií cez našu doménu — návštevník tak v adrese obrázka nevidí
  // pôvod (subdoménu wp.). `/media/*` sa interne načíta z WordPress Knižnice
  // médií (…/wp-content/uploads/*). Adresy obrázkov prepisuje `lib/wp.ts`.
  async rewrites() {
    const wp = process.env.WP_URL ?? "https://wp.digitalnapomoc.sk";
    return [
      {
        source: "/media/:path*",
        destination: `${wp}/wp-content/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
