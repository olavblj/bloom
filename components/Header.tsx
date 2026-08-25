import Link from "next/link";
import { ThemeToggle } from "@/lib/theme";

const navLinks = [
  { href: "/", label: "Gallery" },
  { href: "/studio", label: "Studio" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-paper-200/80 bg-paper-50/90 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 text-sm text-white dark:bg-sage-600">
            ✿
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink-900 dark:text-paper-100">
            Bloom
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-paper-200 hover:text-ink-900 dark:text-paper-300 dark:hover:bg-ink-800 dark:hover:text-paper-100"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-paper-200 bg-paper-100 dark:border-ink-800 dark:bg-ink-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-ink-500 dark:text-paper-400">
          Bloom — generative geometric SVG flowers. Not photos. Not a shop.
        </p>
        <p className="font-mono text-xs text-ink-400 dark:text-paper-500">
          Milestone 0 · seed-based · deterministic
        </p>
      </div>
    </footer>
  );
}
