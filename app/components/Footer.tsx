import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const collections = [
  {
    heading: "Explore",
    links: [
      { label: "The journal", href: "/blog" },
      { label: "Ingredient library", href: "/ingredients" },
      { label: "Skin concerns", href: "/skin-concerns" },
      { label: "Product guides", href: "/products" },
    ],
  },
  {
    heading: "Start here",
    links: [
      { label: "Beginner skincare", href: "/blog/beginners-skincare-routine" },
      { label: "Acne ingredients", href: "/blog/top-7-ingredients-for-acne-prone-skin" },
      { label: "Choosing sunscreen", href: "/blog/how-to-choose-the-right-sunscreen" },
    ],
  },
  {
    heading: "About GlowSkin",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Get in touch", href: "/contact" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms and conditions", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#282521] text-[#EAE0D7]">
      <div className="mx-auto max-w-7xl px-6 pb-9 pt-20 sm:pt-24">
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-white/20 pb-14 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D8A4AA]">The Skin Edit · A GlowSkin Journal</p>
            <p className="mt-5 max-w-[19ch] font-heading text-4xl font-medium leading-[1.1] !text-[#F7F3EC] sm:text-5xl">
              Your skin story is <span className="italic text-[#D9A4A9]">yours to understand.</span>
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-3 border-b border-[#D9A4A9] pb-2 text-sm font-semibold text-[#F7F3EC] transition hover:text-[#D9A4A9]"
          >
            Explore the journal <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-12 pb-16 md:grid-cols-[1.3fr_1fr_1fr] lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A4A9]">
              <span className="font-heading text-3xl font-semibold tracking-tight text-[#F7F3EC]">Glow<span className="italic text-[#D9A4A9]">Skin</span>.</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-[#D6CCC3]">
              A skincare education journal exploring everyday routines, familiar ingredients, and common skin concerns.
            </p>
            <p className="mt-5 max-w-xs text-xs leading-6 text-[#BFB2A7]">
              Educational information only. For personal medical advice, consult a qualified healthcare professional.
            </p>
          </div>

          {collections.map((group) => (
            <div key={group.heading}>
              <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] !text-[#F7F3EC]">{group.heading}</h2>
              <ul className="space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#D6CCC3] transition hover:text-[#D9A4A9] focus-visible:underline">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/20 pt-7 text-xs text-[#BFB2A7] sm:flex-row">
          <p>© {new Date().getFullYear()} GlowSkin. All rights reserved.</p>
          <p>Independent skincare education. Read thoughtfully, choose confidently.</p>
        </div>
      </div>
    </footer>
  );
}
