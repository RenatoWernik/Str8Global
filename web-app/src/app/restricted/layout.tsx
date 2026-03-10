import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
    subsets: ["latin", "latin-ext"],
    variable: "--font-body",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Str8Global — Painel de Controlo",
    robots: { index: false, follow: false },
};

export default function RestrictedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-PT" className="bg-[#0a0a0f]">
            <body
                className={`antialiased bg-[#0a0a0f] text-white ${outfit.variable} font-[family-name:var(--font-body)]`}
            >
                {children}
            </body>
        </html>
    );
}
