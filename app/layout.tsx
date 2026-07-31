import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const siteUrl = "https://glowskin.blog";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "GlowSkin | Science-Backed Skincare Guides",
    template: "%s | GlowSkin",
  },

  description:
    "Discover dermatologist-inspired skincare routines, ingredient guides, and beauty tips for every skin type.",

  keywords: [
    "skincare",
    "skincare routine",
    "skin ingredients guide",
    "acne care",
    "anti-aging skincare",
    "GlowSkin",
  ],

  authors: [{ name: "GlowSkin" }],

  verification: {
    other: {
      "p:domain_verify": "59f7e62ab6542de3802b4feb4fdc3bb3",
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    title: "GlowSkin | Science-Backed Skincare Guides",
    description:
      "Discover dermatologist-inspired skincare routines, ingredient guides, and beauty tips for every skin type.",
    siteName: "GlowSkin",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GlowSkin",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GlowSkin | Science-Backed Skincare Guides",
    description:
      "Discover dermatologist-inspired skincare routines, ingredient guides, and beauty tips for every skin type.",
    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${fraunces.variable} ${plusJakarta.className} antialiased bg-white text-gray-900 dark:bg-charcoal dark:text-gray-100`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TH7S06BTWS"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TH7S06BTWS');
          `}
        </Script>

        <div
          id="google_translate_element"
          className="fixed top-4 right-4 z-[9999]"
        ></div>

        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'ur,hi,ar,fr,de,es,zh-CN',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                'google_translate_element'
              );
            }
          `}
        </Script>

        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}