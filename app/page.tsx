"use client";

import { useRouter } from "next/navigation";
import { FlowerSvg } from "@/components/FlowerSvg";
import {
  generateGallerySeeds,
  hashSeedToVariant,
  hashSeedToPalette,
} from "@/lib/bloom";
import Link from "next/link";

const GALLERY_SEEDS = generateGallerySeeds(48);

export default function GalleryPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section className="mb-12 text-center motion-safe:animate-fade-in">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-sage-600 dark:text-sage-400">
          Generative illustration studio
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl dark:text-paper-100">
          Every seed blooms differently
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-600 dark:text-paper-400">
          Clean geometric SVG flowers — deterministic, seed-based, and fully
          customizable. Click any bloom to open the studio.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/studio"
            className="rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 dark:bg-sage-500 dark:hover:bg-sage-600"
          >
            Open Studio
          </Link>
          <Link
            href="/docs"
            className="rounded-full border border-paper-300 bg-paper-100 px-6 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-200 dark:hover:bg-ink-700"
          >
            Read Docs
          </Link>
        </div>
      </section>

      <section aria-label="Flower gallery">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
          {GALLERY_SEEDS.map((seed, i) => (
            <div
              key={seed}
              className="motion-safe:animate-fade-in"
              style={{
                animationDelay: `${Math.min(i * 30, 600)}ms`,
                animationFillMode: "both",
              }}
            >
              <FlowerSvg
                seed={seed}
                variant={hashSeedToVariant(seed)}
                palette={hashSeedToPalette(seed)}
                size={200}
                className="aspect-square w-full shadow-sm ring-1 ring-paper-200/60 dark:ring-ink-700/60"
                interactive
                onClick={() => router.push(`/studio?seed=${encodeURIComponent(seed)}`)}
              />
              <p className="mt-1.5 truncate text-center font-mono text-[10px] text-ink-400 dark:text-paper-500">
                {seed}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
