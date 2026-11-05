"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { categories } from "@/app/data/categories";
import { articleTopics } from "@/app/data/articleTopics";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navigation: NavItem[] = [
  {
    label: "Journal",
    href: "/blog",
    children: categories.map((category) => ({
      label: category.label,
      href: `/blog/category/${category.slug}`,
    })),
  },
  {
    label: "Ingredients",
    href: "/ingredients",
    children: articleTopics.filter((topic) => topic.group === "ingredient").map((topic) => ({
      label: topic.label,
      href: `/blog/topic/${topic.slug}`,
    })),
  },
  {
    label: "Skin concerns",
    href: "/skin-concerns",
    children: articleTopics.filter((topic) => topic.group === "concern").map((topic) => ({
      label: topic.label,
      href: `/blog/topic/${topic.slug}`,
    })),
  },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setOpenMobileMenu(null);
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 bg-[#FBFAF6]/95 shadow-[0_1px_0_rgba(44,74,45,0.11)] dark:bg-[#253429]/95">
      <nav ref={navRef} aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-6">
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
                <div className="relative">
                  <button
                    type="button"
                    aria-label={`Explore ${item.label} topics`}
                    aria-expanded={openMenu === item.href}
                    aria-controls={`topics-${item.href.slice(1)}`}
                    onClick={() => setOpenMenu((current) => current === item.href ? null : item.href)}
                    className="flex items-center rounded-full p-1.5 text-[#687B67] transition hover:bg-[#EAF0E3] focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:text-[#F6F6F0]"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === item.href ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {openMenu === item.href && (
                    <div
                      id={`topics-${item.href.slice(1)}`}
                      className="absolute left-0 top-[calc(100%+1rem)] z-50 w-64 rounded-xl border border-[#DCE5D8] bg-[#FBFAF6] p-2 shadow-[0_18px_50px_rgba(39,30,31,0.14)] dark:border-white/15 dark:bg-[#253429]"
                    >
                      <Link href={item.href} onClick={() => setOpenMenu(null)} className="block border-b border-[#DCE5D8] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2B552D] dark:text-[#D6E4CC]">
                        View all {item.label}
                      </Link>
                      {item.children.map((sub) => (
                        <Link key={sub.href} href={sub.href} onClick={() => setOpenMenu(null)} className="block rounded-lg px-3 py-2.5 text-sm text-[#475848] transition hover:bg-[#EFF3E9] hover:text-[#2B552D] dark:text-[#F6F6F0] dark:hover:bg-white/10">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
                  <div className="mt-1">
                    <button
                      type="button"
                      aria-expanded={openMobileMenu === item.href}
                      aria-controls={`mobile-topics-${item.href.slice(1)}`}
                      onClick={() => setOpenMobileMenu((current) => current === item.href ? null : item.href)}
                      className="flex min-h-9 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2B552D] dark:text-[#D6E4CC]"
                    >
                      Explore topics <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMobileMenu === item.href ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    {openMobileMenu === item.href && (
                      <div id={`mobile-topics-${item.href.slice(1)}`} className="grid grid-cols-2 gap-x-5 gap-y-3 pb-3 pt-2">
                        {item.children.map((sub) => (
                          <Link key={sub.href} href={sub.href} onClick={() => {setMobileOpen(false); setOpenMobileMenu(null);}} className="text-sm text-[#475848] underline-offset-4 hover:underline dark:text-[#F6F6F0]">{sub.label}</Link>
                        ))}
                      </div>
                    )}
                  </div>
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
