import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact GlowSkin",
  description: "Contact GlowSkin with questions, suggestions or business inquiries about skincare content.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
