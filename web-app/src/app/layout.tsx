import type { Metadata } from "next";
import { Oswald, Outfit } from "next/font/google";
import "./globals.css";
import { LenisProvider, GSAPProvider } from "@/providers";
import { Navbar, Footer } from "@/components/layout";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Str8Global — Agência de Marketing e Fotografia em Portugal",
  description: "Agência de marketing, fotografia e vídeo em Portugal. Estratégia, conteúdo e produção premium para marcas que querem resultados. Peça proposta gratuita.",
  keywords: [
    "agência de marketing portugal",
    "fotografia profissional lisboa",
    "produção de vídeo portugal",
    "agência criativa lisboa",
    "criação de conteúdo para empresas",
    "fotografia de produto portugal",
    "gestão de redes sociais",
    "vídeos aéreos drone portugal",
  ],
  authors: [{ name: "Str8Global" }],
  creator: "Str8Global",
  openGraph: {
    title: "Str8Global — Agência de Marketing e Fotografia em Portugal",
    description: "Estratégia, conteúdo e produção premium para marcas que querem resultados.",
    url: "https://str8global.com",
    siteName: "Str8Global",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Str8Global — Agência de Marketing e Fotografia",
    description: "Estratégia, conteúdo e produção premium para marcas que querem resultados.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://str8global.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="bg-black">
      <body
        className={`antialiased bg-black text-white ${oswald.variable} ${outfit.variable}`}
      >
        <LenisProvider>
          <GSAPProvider>
            <Navbar />
            {children}
            <Footer />
          </GSAPProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
