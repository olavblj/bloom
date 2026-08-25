"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsPages } from "@/lib/docs";
import { DocsSearch } from "./DocsSearch";
import clsx from "clsx";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="mb-4 lg:sticky lg:top-24">
        <DocsSearch />
        <nav className="mt-4 space-y-1" aria-label="Documentation">
          {docsPages.map((page) => {
            const href = `/docs/${page.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={page.slug}
                href={href}
                className={clsx(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sage-100 font-medium text-sage-800 dark:bg-sage-900/40 dark:text-sage-300"
                    : "text-ink-600 hover:bg-paper-200 hover:text-ink-900 dark:text-paper-400 dark:hover:bg-ink-800 dark:hover:text-paper-200"
                )}
              >
                {page.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
