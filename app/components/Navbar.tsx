"use client";

import Logo from "./Logo";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

type SubCategory = {
  label: string;
  href: string;
};

type FeaturedArticle = {
  title: string;
  href: string;
};

type NavItem = {
  href: string;
  id: string;
  label: string;
  sub?: SubCategory[];
  featured?: FeaturedArticle[];
};

const links: NavItem[] = [
  {
    href: "/",
    id: "home",
    label: "Home",
  },
  {
    href: "/blog",
    id: "blog",
    label: "Blog",
    sub: [
      {
        label: "Beginner Guide",
        href: "/blog/category/beginner-guide",
      },
      {
        label: "Acne Care",
        href: "/blog/category/acne-care",
      },
      {
        label: "Sun Protection",
        href: "/blog/category/sun-protection",
      },
    ],
    featured: [
      {
        title: "The Complete Beginner's Skincare Routine",
        href: "/blog/beginners-skincare-routine",
      },
      {
        title: "Top 7 Ingredients for Acne-Prone Skin",
        href: "/blog/top-7-ingredients-for-acne-prone-skin",
      },
      {
        title: "How to Choose the Right Sunscreen",
        href: "/blog/how-to-choose-the-right-sunscreen",
      },
    ],
  },
  {
    href: "/ingredients",
    id: "ingredients",
    label: "Ingredients",
    sub: [
      {
        label: "Vitamin C",
        href: "/ingredients/vitamin-c",
      },
      {
        label: "Niacinamide",
        href: "/ingredients/niacinamide",
      },
      {
        label: "Hyaluronic Acid",
        href: "/ingredients/hyaluronic-acid",
      },
      {
        label: "Retinol",
        href: "/ingredients/retinol",
      },
    ],
  },
  {
    href: "/skin-concerns",
    id: "skin-concerns",
    label: "Skin Concerns",
    sub: [
      {
        label: "Acne",
        href: "/skin-concerns/acne",
      },
      {
        label: "Dry Skin",
        href: "/skin-concerns/dry-skin",
      },
      {
        label: "Oily Skin",
        href: "/skin-concerns/oily-skin",
      },
      {
        label: "Sensitive Skin",
        href: "/skin-concerns/sensitive-skin",
      },
      {
        label: "Pigmentation",
        href: "/skin-concerns/pigmentation",
      },
      {
        label: "Anti-Aging",
        href: "/skin-concerns/anti-aging",
      },
    ],
  },
  {
    href: "/products",
    id: "products",
    label: "Products",
  },
  {
    href: "/contact",
    id: "contact",
    label: "Contact",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!isHomePage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    links.forEach((link) => {
      const section = document.getElementById(link.id);

      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  const isActive = (link: NavItem) => {
    if (isHomePage) {
      return activeSection === link.id;
    }

    if (link.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(link.href);
  };

  const getMainLink = (link: NavItem) => {
    return isHomePage ? `#${link.id}` : link.href;
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileSubmenu(null);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-primary-light bg-white/90 backdrop-blur-md dark:border-primary-dark/30 dark:bg-charcoal/90"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-6 font-medium text-gray-700 dark:text-gray-300 lg:flex">
          {links.map((link) => {
            const hasSubmenu = Boolean(link.sub?.length);
            const active = isActive(link);

            return (
              <li
                key={link.href}
                className="static"
                onMouseEnter={() =>
                  setOpenMenu(hasSubmenu ? link.id : null)
                }
              >
                <Link
                  href={getMainLink(link)}
                  className={`relative flex items-center gap-1 whitespace-nowrap py-1 transition hover:text-primary ${
                    active ? "text-primary" : ""
                  }`}
                >
                  {link.label}

                  {hasSubmenu && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        openMenu === link.id ? "rotate-180" : ""
                      }`}
                    />
                  )}

                  {active && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary" />
                  )}
                </Link>

                {hasSubmenu && (
                  <div
                    className={`absolute left-0 right-0 top-full origin-top border-b border-primary-light bg-white shadow-xl transition duration-300 dark:border-primary-dark/30 dark:bg-charcoal ${
                      openMenu === link.id
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-8">
                      <div
                        className={
                          link.featured?.length
                            ? "col-span-4"
                            : "col-span-12"
                        }
                      >
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
                          {link.label}
                        </p>

                        <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                          {link.sub?.map((subcategory) => (
                            <li key={subcategory.href}>
                              <Link
                                href={subcategory.href}
                                className="text-gray-700 transition hover:text-primary dark:text-gray-300"
                              >
                                {subcategory.label}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={link.href}
                          className="mt-5 inline-block border-b border-primary pb-0.5 text-sm font-medium text-primary transition hover:opacity-70"
                        >
                          View all
                        </Link>
                      </div>

                      {link.featured && link.featured.length > 0 && (
                        <div className="col-span-8 grid grid-cols-3 gap-4">
                          {link.featured.map((article) => (
                            <Link
                              key={article.href}
                              href={article.href}
                              className="group rounded-xl border border-primary-light/60 p-4 transition hover:-translate-y-1 hover:border-primary dark:border-primary-dark/30"
                            >
                              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Featured article
                              </span>

                              <p className="mt-3 text-sm font-medium leading-snug text-gray-800 transition group-hover:text-primary dark:text-gray-200">
                                {article.title}
                              </p>

                              <span className="mt-5 block text-sm text-primary">
                                Read article →
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden xl:block">
            <SearchBar />
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-primary-light/30 dark:text-gray-300 dark:hover:bg-primary-dark/30 xl:hidden"
            aria-label="Toggle search"
            aria-expanded={searchOpen}
          >
            <Search className="h-5 w-5" />
          </button>

          <ThemeToggle />

          <Link
            href={isHomePage ? "#contact" : "/contact"}
            className="hidden whitespace-nowrap rounded-full bg-primary px-5 py-2 text-white transition hover:bg-primary-dark lg:inline-block"
          >
            Contact Us
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-primary-light/30 dark:text-gray-300 dark:hover:bg-primary-dark/30 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-primary-light bg-white px-6 py-4 dark:border-primary-dark/30 dark:bg-charcoal xl:hidden">
          <SearchBar />
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-primary-light bg-white px-6 py-6 dark:border-primary-dark/30 dark:bg-charcoal lg:hidden">
          <ul className="flex flex-col gap-1 font-medium text-gray-700 dark:text-gray-300">
            {links.map((link) => {
              const hasSubmenu = Boolean(link.sub?.length);
              const expanded = mobileSubmenu === link.id;

              return (
                <li
                  key={link.href}
                  className="border-b border-primary-light/50 py-2 dark:border-primary-dark/20"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={getMainLink(link)}
                      onClick={closeMobileMenu}
                      className={isActive(link) ? "text-primary" : ""}
                    >
                      {link.label}
                    </Link>

                    {hasSubmenu && (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileSubmenu(expanded ? null : link.id)
                        }
                        className="p-2"
                        aria-label={`Toggle ${link.label} submenu`}
                        aria-expanded={expanded}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubmenu && expanded && (
                    <ul className="mt-2 flex flex-col gap-2 pl-4 text-sm text-gray-600 dark:text-gray-400">
                      {link.sub?.map((subcategory) => (
                        <li key={subcategory.href}>
                          <Link
                            href={subcategory.href}
                            onClick={closeMobileMenu}
                            className="transition hover:text-primary"
                          >
                            {subcategory.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}

            <li className="mt-3">
              <Link
                href={isHomePage ? "#contact" : "/contact"}
                onClick={closeMobileMenu}
                className="inline-block rounded-full bg-primary px-5 py-2 text-white"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}