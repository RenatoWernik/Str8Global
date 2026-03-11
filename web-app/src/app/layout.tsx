import type { Metadata, Viewport } from "next";
import { Oswald, Outfit } from "next/font/google";
import "./globals.css";
import { LenisProvider, GSAPProvider } from "@/providers";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Analytics } from "@vercel/analytics/next";

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-title",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://str8global.com"),
  title: {
    default:
      "Str8Global — Agência de Marketing Premium em Lisboa e Cascais | Estúdio de Fotografia, Vídeo e Podcast",
    template: "%s | Str8Global — Agência de Marketing Lisboa e Cascais",
  },
  description:
    "Agência de marketing premium a servir Lisboa, Cascais e Grande Lisboa. Estúdio de fotografia profissional, produção de vídeo cinematográfico, estúdio de podcast, gestão de redes sociais e coworking criativo. O ecossistema completo para marcas que querem dominar o mercado. Orçamento gratuito.",
  keywords: [
    "agência de marketing lisboa",
    "agência de marketing cascais",
    "agência de marketing premium portugal",
    "estúdio de fotografia lisboa",
    "estúdio de fotografia cascais",
    "produção de vídeo lisboa",
    "produção de vídeo cascais",
    "estúdio de podcast lisboa",
    "estúdio de podcast cascais",
    "fotografia profissional lisboa",
    "fotografia profissional cascais",
    "filmagem com drone portugal",
    "gestão de redes sociais lisboa",
    "gestão de redes sociais cascais",
    "coworking criativo lisboa",
    "vídeo publicitário portugal",
    "fotografia de produto lisboa",
    "fotografia imobiliária lisboa",
    "fotografia gastronómica lisboa",
    "fotografia gastronómica cascais",
    "criação de conteúdo para empresas",
    "marketing digital lisboa",
    "marketing digital cascais",
    "estúdio de gravação lisboa",
    "estúdio de gravação cascais",
    "agência criativa portugal",
    "produção audiovisual lisboa",
    "produção audiovisual cascais",
    "vídeo institucional lisboa",
    "branding lisboa",
  ],
  authors: [{ name: "Str8Global", url: "https://str8global.com" }],
  creator: "Str8Global",
  publisher: "Str8Global",
  category: "Marketing Agency",
  openGraph: {
    title:
      "Str8Global — Agência de Marketing Premium | Estúdio de Fotografia, Vídeo e Podcast em Lisboa e Cascais",
    description:
      "O ecossistema criativo premium para marcas ambiciosas: agência de marketing, estúdio de fotografia e vídeo cinematográfico, podcast com qualidade broadcast e coworking criativo. Lisboa e Cascais.",
    url: "https://str8global.com",
    siteName: "Str8Global",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Str8Global — Agência de Marketing Premium em Lisboa e Cascais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Str8Global — Agência de Marketing e Produção Visual Premium | Lisboa e Cascais",
    description:
      "Ecossistema criativo premium: estratégia, fotografia, vídeo cinematográfico, podcast e coworking para marcas que querem dominar. Lisboa e Cascais.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://str8global.com",
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-verification-code',
  },
};

// JSON-LD Structured Data for Local Business SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://str8global.com/#business",
      name: "Str8Global",
      alternateName: "Str8Global — Agência de Marketing Premium",
      description:
        "Agência de marketing premium a servir Lisboa, Cascais e Grande Lisboa. Estúdio de fotografia profissional, produção de vídeo cinematográfico, estúdio de podcast e coworking criativo para marcas que querem dominar o mercado.",
      url: "https://str8global.com",
      logo: "https://str8global.com/logo.png",
      image: "https://str8global.com/og-image.png",
      telephone: "+351966128922",
      email: "str8global.co@gmail.com",
      priceRange: "€€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cash, Credit Card, Bank Transfer",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Estrada das Ligeiras, Lote 2",
        postalCode: "2735-337",
        addressLocality: "Agualva-Cacém",
        addressRegion: "Lisboa",
        addressCountry: "PT",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 38.7508,
        longitude: -9.3017,
      },
      areaServed: [
        {
          "@type": "City",
          name: "Lisboa",
          "@id": "https://www.wikidata.org/wiki/Q597",
        },
        {
          "@type": "City",
          name: "Cascais",
          "@id": "https://www.wikidata.org/wiki/Q182854",
        },
        {
          "@type": "City",
          name: "Sintra",
          "@id": "https://www.wikidata.org/wiki/Q182890",
        },
        {
          "@type": "City",
          name: "Oeiras",
          "@id": "https://www.wikidata.org/wiki/Q182878",
        },
        {
          "@type": "AdministrativeArea",
          name: "Grande Lisboa",
        },
        {
          "@type": "Country",
          name: "Portugal",
        },
      ],
      serviceArea: [
        {
          "@type": "City",
          name: "Lisboa",
        },
        {
          "@type": "City",
          name: "Cascais",
        },
        {
          "@type": "AdministrativeArea",
          name: "Área Metropolitana de Lisboa",
        },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      sameAs: [
        "https://www.instagram.com/str8global.co/",
        "https://www.linkedin.com/company/str8global/",
        "https://www.behance.net/str8global",
        "https://vimeo.com/str8global",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços de Marketing e Produção Visual",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Estratégia de Marketing Digital",
              description:
                "Estratégia visual e marketing digital para marcas premium em Lisboa e Cascais",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Fotografia Profissional",
              description:
                "Estúdio de fotografia profissional em Lisboa: produto, imobiliária, gastronómica, eventos e marcas pessoais",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Produção de Vídeo Cinematográfico",
              description:
                "Produção de vídeo profissional e cinematográfico em Lisboa e Cascais: comerciais, institucionais e eventos",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Estúdio de Podcast",
              description:
                "Estúdio de podcast e gravação profissional em Lisboa com qualidade broadcast",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Gestão de Redes Sociais",
              description:
                "Gestão de redes sociais profissional em Lisboa e Cascais para marcas premium",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Filmagem com Drone",
              description:
                "Filmagens aéreas profissionais com drone em Portugal para projectos cinematográficos",
            },
          },
        ],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "45",
        bestRating: "5",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://str8global.com/#website",
      url: "https://str8global.com",
      name: "Str8Global",
      description:
        "Agência de marketing premium em Lisboa e Cascais",
      publisher: {
        "@id": "https://str8global.com/#business",
      },
      inLanguage: "pt-PT",
    },
    {
      "@type": "WebPage",
      "@id": "https://str8global.com/#webpage",
      url: "https://str8global.com",
      name: "Str8Global — Agência de Marketing Premium em Lisboa e Cascais",
      isPartOf: {
        "@id": "https://str8global.com/#website",
      },
      about: {
        "@id": "https://str8global.com/#business",
      },
      description:
        "Agência de marketing premium em Lisboa e Cascais. Estúdio de fotografia, produção de vídeo cinematográfico, podcast e coworking criativo. O ecossistema completo para marcas ambiciosas.",
      inLanguage: "pt-PT",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="bg-black" suppressHydrationWarning>
      <head>
        {/* Performance: preconnect to external origins */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Blocking script to prevent flash of giant typography on /restricted routes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.pathname.startsWith('/restricted')) {
                document.documentElement.classList.add('restricted-mode');
              }
            `
          }}
        />
      </head>
      <body
        className={`antialiased bg-black text-white ${oswald.variable} ${outfit.variable}`}
      >
        <LenisProvider>
          <GSAPProvider>
            <ConditionalNavbar />
            {children}
            <ConditionalFooter />
            <Analytics />
          </GSAPProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
