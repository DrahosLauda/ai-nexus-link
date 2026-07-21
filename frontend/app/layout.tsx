import type { Metadata } from "next";
import { Geist } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_INDEXABLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const DEFAULT_TITLE = "digitalnapomoc.sk – Digitálna pomoc, ktorá pracuje za vás";

export const metadata: Metadata = {
  // Základ pre skladanie absolútnych URL (canonical, Open Graph obrázky).
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    // Podstránky doplnia svoj názov: „Blog" → „Blog – digitalnapomoc.sk".
    template: `%s – ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Kým web nie je na ostrej doméne, držíme ho skrytý pred vyhľadávačmi.
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "sk_SK",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
