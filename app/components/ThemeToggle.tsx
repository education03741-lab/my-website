"use client";

import { Sun, Moon, Coffee, Minus, Plus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme, fontSize, increaseFontSize, decreaseFontSize } = useTheme();

  const themes = [
    { id: "light" as const, icon: Sun, label: "Light mode" },
    { id: "sepia" as const, icon: Coffee, label: "Sepia reading mode" },
    { id: "dark" as const, icon: Moon, label: "Dark mode" },
  ];

  return (
    <div className="flex items-center gap-2">

      {/* Font size controls */}
      <div className="hidden items-center gap-1 rounded-full border border-primary-light bg-primary-light/20 px-2 py-1.5 sm:flex dark:border-primary-dark/40 dark:bg-primary-dark/20">
        <button
          onClick={decreaseFontSize}
          disabled={fontSize === "sm"}
          aria-label="Decrease font size"
          className="flex h-6 w-6 items-center justify-center rounded-full text-primary-dark transition hover:bg-primary-light disabled:opacity-30 dark:text-primary-light dark:hover:bg-primary-dark/40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="px-1 text-xs font-semibold text-primary-dark dark:text-primary-light">
          A
        </span>

        <button
          onClick={increaseFontSize}
          disabled={fontSize === "lg"}
          aria-label="Increase font size"
          className="flex h-6 w-6 items-center justify-center rounded-full text-primary-dark transition hover:bg-primary-light disabled:opacity-30 dark:text-primary-light dark:hover:bg-primary-dark/40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 3-way theme switch */}
      <div className="flex items-center gap-0.5 rounded-full border border-primary-light bg-primary-light/20 p-1 dark:border-primary-dark/40 dark:bg-primary-dark/20">
        {themes.map(({ id, icon: Icon, label }) => {
          const active = theme === id;
          return (
            <button
              key={id}
              onClick={() => setTheme(id)}
              aria-label={label}
              aria-pressed={active}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary-dark hover:bg-primary-light dark:text-primary-light dark:hover:bg-primary-dark/40"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

    </div>
  );
}