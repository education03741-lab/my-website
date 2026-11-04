"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navigation: NavItem[] = [
  {
    label: "Journal",
    href: "/blog",
    children: [
      { label: "Beginner guides", href: "/blog/category/beginner-guide" },
      { label: "Acne care", href: "/blog/category/acne-care" },
      { label: "Sun protection", href: "/blog/category/sun-protection" },
    ],
  },
  {
    label: "Ingredients",
    href: "/ingredients",
    children: [
      { label: "Vitamin C", href: "/ingredients/vitamin-c" },
      { label: "Niacinamide", href: "/ingredients/niacinamide" },
      { label: "Hyaluronic acid", href: "/ingredients/hyaluronic-acid" },
      { label: "Retinol", href: "/ingredients/retinol" },
    ],
  },
  {
    label: "Skin concerns",
    href: "/skin-concerns",
    children: [
      { label: "Acne", href: "/skin-concerns/acne" },
      { label: "Dry skin", href: "/skin-concerns/dry-skin" },
      { label: "Oily skin", href: "/skin-concerns/oily-skin" },
      { label: "Sensitive skin", href: "/skin-concerns/sensitive-skin" },
      { label: "Pigmentation", href: "/skin-concerns/pigmentation" },
      { label: "Anti-aging", href: "/skin-concerns/anti-aging" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 bg-[#FBFAF6]/95 shadow-[0_1px_0_rgba(44,74,45,0.11)] dark:bg-[#253429]/95">
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <Link href="/" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B552D]">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-3 xl:flex xl:gap-5">
          {navigation.map((item) => (
            <li key={item.href} className="flex items-center gap-0.5">
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`whitespace-nowrap py-3 text-[12px] font-semibold tracking-[0.01em] transition hover:text-[#4F7649] dark:hover:text-[#D6E4CC] ${isCurrent(item.href) ? "text-[#4F7649] dark:text-[#D6E4CC]" : "text-[#354438] dark:text-[#F6F6F0]"}`}
              >
                {item.label}
              </Link>
              {item.children && (
                <details className="group relative">
                  <summary aria-label={`More ${item.label} topics`} className="flex cursor-pointer list-none items-center rounded-full p-1.5 text-[#687B67] transition hover:bg-[#EAF0E3] focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:text-[#F6F6F0] [&::-webkit-details-marker]:hidden">
                    <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="absolute left-0 top-[calc(100%+1rem)] z-50 w-60 border border-[#DCE5D8] bg-[#FBFAF6] p-2 shadow-[0_18px_50px_rgba(39,30,31,0.14)] dark:border-white/15 dark:bg-[#253429]">
                    <Link href={item.href} className="block border-b border-[#DCE5D8] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2B552D] dark:text-[#F0C5CA]">
                      View all {item.label}
                    </Link>
                    {item.children.map((sub) => (
                      <Link key={sub.href} href={sub.href} className="block px-3 py-2.5 text-sm text-[#475848] transition hover:bg-[#F6F6F0] hover:text-[#2B552D] dark:text-[#F6F6F0] dark:hover:bg-white/10">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </details>
              )}
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="gs-nav-search"><SearchBar /></div>
          <div className="hidden sm:block"><ThemeToggle /></div>
          <Link href="/blog" className="hidden items-center gap-1.5 rounded-full border border-[#2B552D] px-4 py-2.5 text-xs font-semibold text-[#2B552D] transition hover:bg-[#2B552D] hover:text-white dark:border-[#D6E4CC] dark:text-[#D6E4CC] dark:hover:bg-[#D6E4CC] dark:hover:text-[#253429] xl:inline-flex">
            Explore articles <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE5D8] text-[#2B552D] transition hover:bg-[#EAF0E3] focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:text-[#F6F6F0] xl:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-7rem)] overflow-y-auto border-t border-[#DCE5D8] bg-[#FBFAF6] px-6 py-5 dark:bg-[#253429] xl:hidden">
          <ul className="mx-auto max-w-7xl divide-y divide-[#DCE5D8] dark:divide-white/15">
            {navigation.map((item) => (
              <li key={item.href} className="py-3">
                <div className="flex items-center justify-between">
                  <Link href={item.href} onClick={() => setMobileOpen(false)} className="py-2 font-heading text-xl text-[#253429] dark:text-[#F6F6F0]">
                    {item.label}
                  </Link>
                </div>
                {item.children && (
                  <details className="group mt-1">
                    <summary aria-label={`Explore ${item.label} topics`} className="flex w-fit cursor-pointer list-none items-center gap-2 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2B552D] dark:text-[#D6E4CC] [&::-webkit-details-marker]:hidden">
                      Explore topics <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 pb-3 pt-2">
                      {item.children.map((sub) => (
                        <Link key={sub.href} href={sub.href} onClick={() => setMobileOpen(false)} className="text-sm text-[#475848] underline-offset-4 hover:underline dark:text-[#F6F6F0]">{sub.label}</Link>
                      ))}
                    </div>
                  </details>
                )}
              </li>
            ))}
            <li className="py-4"><Link href="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-[#2B552D] dark:text-[#D6E4CC]">Contact GlowSkin</Link></li>
            <li className="py-3 sm:hidden"><ThemeToggle /></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
