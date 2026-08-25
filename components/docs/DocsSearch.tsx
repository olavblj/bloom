"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { docSearchIndex } from "@/lib/docs";

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fuse = useMemo(
    () =>
      new Fuse(docSearchIndex, {
        keys: ["title", "description", "content"],
        threshold: 0.4,
      }),
    []
  );

  const results = useMemo(() => {
    if (!query.trim()) return docSearchIndex.slice(0, 5);
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/docs/${slug}`);
    },
    [router]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-paper-300 bg-paper-100 px-3 py-1.5 text-sm text-ink-500 transition-colors hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-400 dark:hover:bg-ink-700"
        aria-label="Search docs (Command K)"
      >
        <span>Search docs</span>
        <kbd className="hidden rounded border border-paper-300 bg-white px-1.5 py-0.5 font-mono text-xs dark:border-ink-600 dark:bg-ink-900 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink-900/50 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-paper-200 bg-paper-50 shadow-2xl dark:border-ink-700 dark:bg-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation…"
              className="w-full border-b border-paper-200 bg-transparent px-4 py-3 text-ink-800 placeholder:text-ink-400 focus:outline-none dark:border-ink-700 dark:text-paper-200 dark:placeholder:text-paper-500"
              autoFocus
              aria-label="Search query"
            />
            <ul className="max-h-64 overflow-y-auto py-2">
              {results.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.slug)}
                    className="flex w-full flex-col px-4 py-2 text-left transition-colors hover:bg-paper-200 dark:hover:bg-ink-800"
                  >
                    <span className="font-medium text-ink-800 dark:text-paper-200">
                      {item.title}
                    </span>
                    <span className="text-sm text-ink-500 dark:text-paper-500">
                      {item.description}
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-ink-500">No results found.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
