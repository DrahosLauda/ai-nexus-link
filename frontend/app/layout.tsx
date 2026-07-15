import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "digitalnapomoc.sk – Digitálna pomoc, ktorá pracuje za vás",
  description:
    "Pomáhame malým firmám a jednotlivcom zvládnuť digitálny svet — od AI chatbotov po automatizáciu rutinných úloh. Ľudsky a bez žargónu.",
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
