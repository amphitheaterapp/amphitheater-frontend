import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-cormorant",
    display: "swap",
});

const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Amphitheater",
    description:
        "A verified professional network for film, television, theatre, music, and content production.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${cormorant.variable} ${dmMono.variable}`}>
            <body>
                <Script
                    src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
                    strategy="beforeInteractive"
                />
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
