import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider, GSAPProvider } from "@/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Str8Global | Marketing & Photography Agency",
  description: "Premium Marketing & Photography Agency. We create bold, direct, and impactful visual content for global brands.",
  keywords: ["marketing", "photography", "agency", "creative", "branding", "video production"],
  authors: [{ name: "Str8Global" }],
  openGraph: {
    title: "Str8Global | Marketing & Photography Agency",
    description: "Premium Marketing & Photography Agency",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <LenisProvider>
          <GSAPProvider>
            {children}
          </GSAPProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
