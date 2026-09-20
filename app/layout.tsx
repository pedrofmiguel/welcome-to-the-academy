import type { Metadata, Viewport } from "next";
import { Eczar, Spectral, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const eczar = Eczar({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-eczar",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Vessel",
  description:
    "A genie reads your aura and names three D&D class and subclass combinations your spirit could pour into.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070B14" },
    { media: "(prefers-color-scheme: light)", color: "#E4E9F1" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${eczar.variable} ${spectral.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
