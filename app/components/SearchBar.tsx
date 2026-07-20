"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ingredients } from "../data/ingredients";
import { posts } from "../data/posts";
import { concerns } from "../data/concerns";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const q = query.trim().toLowerCase();

  const matchedIngredients = q
    ? ingredients.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedPosts = q
    ? posts.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedConcerns = q
    ? concerns.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const hasResults =
    matchedIngredients.length > 0 || matchedPosts.length > 0 || matchedConcerns.length > 0;

  function closeAndReset() {
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-full border border-primary-light bg-primary-light/30 px-5 py-2.5 text-sm text-gray-500 transition hover:border-primary hover:bg-white hover:shadow-md"
      >
        <Search className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Search ingredients, articles...</span>
        <span className="hidden rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400 sm:inline">
          Ctrl K
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
              <Search className="h-5 w-5 text-primary" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ingredients, articles, skin concerns..."
                className="w-full text-lg text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={closeAndReset}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-primary-dark"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[28rem] overflow-y-auto p-4">
              {!q && (
                <p className="p-6 text-center text-sm text-gray-400">
                  Start typing to search across GlowSkin
                </p>
              )}

              {q && !hasResults && (
                <p className="p-6 text-center text-sm text-gray-400">
                  No results found for {query}
                </p>
              )}

              {matchedIngredients.length > 0 && (
                <div className="mb-3">
                  <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                    Ingredients
                  </p>
                  {matchedIngredients.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/ingredients/${item.slug}`}
                      onClick={closeAndReset}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-primary-light/30"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                        <Search className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {matchedConcerns.length > 0 && (
                <div className="mb-3">
                  <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                    Skin Concerns
                  </p>
                  {matchedConcerns.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/skin-concerns/${item.slug}`}
                      onClick={closeAndReset}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-primary-light/30"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                        <Search className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-800">{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}

              {matchedPosts.length > 0 && (
                <div>
                  <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                    Articles
                  </p>
                  {matchedPosts.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      onClick={closeAndReset}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-primary-light/30"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                        <Search className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-800">{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}