// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hansel-y-gretel.vercel.app"
  ),
  title: "Hänsel y Gretel — Cuento Interactivo",
  description:
    "Una experiencia narrativa interactiva del clásico cuento de los Hermanos Grimm. Scroll para descubrir la historia con animaciones, efectos visuales y audio inmersivo.",
  keywords: [
    "Hänsel y Gretel",
    "cuento interactivo",
    "Hermanos Grimm",
    "cuento infantil",
    "storytelling",
    "scroll animado",
    "experiencia web",
  ],
  authors: [{ name: "Hermanos Grimm" }],
  openGraph: {
    title: "Hänsel y Gretel — Cuento Interactivo",
    description:
      "Descubre el clásico cuento de los Hermanos Grimm en una experiencia web interactiva con animaciones, efectos de partículas y audio inmersivo.",
    type: "website",
    locale: "es_ES",
    siteName: "Hänsel y Gretel — Cuento Interactivo",
    images: [
      {
        url: "/story/hg/s01-cover.png",
        width: 1200,
        height: 630,
        alt: "Portada de Hänsel y Gretel — Cuento Interactivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hänsel y Gretel — Cuento Interactivo",
    description:
      "Descubre el clásico cuento de los Hermanos Grimm en una experiencia web interactiva.",
    images: ["/story/hg/s01-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hänsel y Gretel — Cuento Interactivo",
    description:
      "Experiencia narrativa interactiva del clásico cuento de los Hermanos Grimm con animaciones scroll-driven, efectos de partículas y audio inmersivo.",
    applicationCategory: "EntertainmentApplication",
    genre: "Fairy Tale",
    inLanguage: "es",
    author: {
      "@type": "Person",
      name: "Hermanos Grimm",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Children",
    },
    image: "/story/hg/s01-cover.png",
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} antialiased`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
