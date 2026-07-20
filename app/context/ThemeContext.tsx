"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "sepia";
type FontSize = "sm" | "base" | "lg";

interface Bookmark {
  slug: string;
  title: string;
  type: "article" | "ingredient" | "concern";
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const FONT_SIZES: FontSize[] = ["sm", "base", "lg"];
const THEMES: Theme[] = ["light", "dark", "sepia"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load saved preferences on first mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("glowskin-theme") as Theme | null;
    const savedFontSize = localStorage.getItem("glowskin-font-size") as FontSize | null;
    const savedBookmarks = localStorage.getItem("glowskin-bookmarks");

    if (savedTheme && THEMES.includes(savedTheme)) setThemeState(savedTheme);
    if (savedFontSize && FONT_SIZES.includes(savedFontSize)) setFontSize(savedFontSize);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {
        setBookmarks([]);
      }
    }
    setMounted(true);
  }, []);

  // Apply theme class to <html> and save preference
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("dark", "sepia");
    if (theme !== "light") {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem("glowskin-theme", theme);
  }, [theme, mounted]);

  // Apply font size class to <html> and save preference
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("text-size-sm", "text-size-base", "text-size-lg");
    document.documentElement.classList.add(`text-size-${fontSize}`);
    localStorage.setItem("glowskin-font-size", fontSize);
  }, [fontSize, mounted]);

  // Save bookmarks whenever they change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("glowskin-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks, mounted]);

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme);
  }

  function increaseFontSize() {
    setFontSize((prev) => {
      const index = FONT_SIZES.indexOf(prev);
      return FONT_SIZES[Math.min(index + 1, FONT_SIZES.length - 1)];
    });
  }

  function decreaseFontSize() {
    setFontSize((prev) => {
      const index = FONT_SIZES.indexOf(prev);
      return FONT_SIZES[Math.max(index - 1, 0)];
    });
  }

  function addBookmark(bookmark: Bookmark) {
    setBookmarks((prev) => {
      if (prev.some((b) => b.slug === bookmark.slug)) return prev;
      return [...prev, bookmark];
    });
  }

  function removeBookmark(slug: string) {
    setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
  }

  function isBookmarked(slug: string) {
    return bookmarks.some((b) => b.slug === slug);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}