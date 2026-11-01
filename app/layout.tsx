import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";

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
    default: "GlowSkin | Skincare Routines & Ingredient Guides",
    template: "%s | GlowSkin",
  },

  description:
    "Explore skincare routines, ingredient explainers and practical skin-concern guides with GlowSkin. Clear advice for everyday skincare.",

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
    title: "GlowSkin | Skincare Routines & Ingredient Guides",
    description:
      "Explore skincare routines, ingredient explainers and practical skin-concern guides with GlowSkin. Clear advice for everyday skincare.",
    siteName: "GlowSkin",
    images: [
      {
        url: "/images/hero/hero-banner.jpg",
        alt: "GlowSkin skincare education and routines",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GlowSkin | Skincare Routines & Ingredient Guides",
    description:
      "Explore skincare routines, ingredient explainers and practical skin-concern guides with GlowSkin. Clear advice for everyday skincare.",
    images: ["/images/hero/hero-banner.jpg"],
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
        {children}
      </body>
    </html>
  );
}
