import Link from "next/link";
import { docsPages } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <DocsSidebar />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-paper-100">
            Documentation
          </h1>
          <p className="mt-2 text-ink-600 dark:text-paper-400">
            Everything you need to understand and use Bloom. Press{" "}
            <kbd className="rounded border border-paper-300 bg-paper-100 px-1.5 py-0.5 font-mono text-xs dark:border-ink-700 dark:bg-ink-800">
              ⌘K
            </kbd>{" "}
            to search.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {docsPages.map((page) => (
              <Link
                key={page.slug}
                href={`/docs/${page.slug}`}
                className="group rounded-xl border border-paper-200 bg-paper-100 p-5 transition-colors hover:border-sage-300 hover:bg-paper-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-sage-700 dark:hover:bg-ink-800"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-ink-900 group-hover:text-sage-700 dark:text-paper-100 dark:group-hover:text-sage-400">
                    {page.title}
                  </h2>
                  <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-900/40 dark:text-sage-300">
                    {page.completeness.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-500 dark:text-paper-500">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
