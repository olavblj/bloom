import type { Metadata } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import { Header, Footer } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bloom — Generative SVG Flowers",
    template: "%s · Bloom",
  },
  description:
    "Bloom is a generative illustration studio: clean geometric SVG flowers, seed-based and deterministic, with customizable palettes and variants.",
  openGraph: {
    title: "Bloom — Generative SVG Flowers",
    description:
      "Seed-based geometric SVG flowers. Like DiceBear avatars, but flowers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper-50 font-sans text-ink-800 antialiased dark:bg-ink-950 dark:text-paper-200">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
