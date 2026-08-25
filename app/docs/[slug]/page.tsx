import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { docsPages, getDocBySlug } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { CompletenessPanel } from "@/components/docs/CompletenessPanel";
import { MarkdownContent } from "@/components/docs/MarkdownContent";

export function generateStaticParams() {
  return docsPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocBySlug(slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDocBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <DocsSidebar />
        <article className="min-w-0 flex-1">
          <header className="mb-6">
            <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-paper-100">
              {page.title}
            </h1>
            <p className="mt-1 text-ink-600 dark:text-paper-400">
              {page.description}
            </p>
          </header>

          <CompletenessPanel meta={page.completeness} />
          <MarkdownContent content={page.content} />
        </article>
      </div>
    </div>
  );
}
