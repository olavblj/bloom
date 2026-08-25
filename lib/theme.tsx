"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("bloom-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("bloom-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return { theme, toggle, mounted };
}

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-paper-300 bg-paper-100 px-3 py-1.5 text-sm dark:border-ink-700 dark:bg-ink-800"
        aria-label="Toggle theme"
      >
        ···
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-paper-300 bg-paper-100 px-3 py-1.5 text-sm text-ink-700 transition-colors hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-200 dark:hover:bg-ink-700"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "◐ Dark" : "◑ Light"}
    </button>
  );
}
