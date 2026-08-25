"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FlowerSvg } from "@/components/FlowerSvg";
import {
  renderFlower,
  VARIANTS,
  VARIANT_LABELS,
  PALETTE_NAMES,
  randomSeed,
  downloadSvg,
  copyToClipboard,
  type Variant,
  type NamedPalette,
} from "@/lib/bloom";

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSeed = searchParams.get("seed") ?? "bloom-studio";

  const [seed, setSeed] = useState(initialSeed);
  const [variant, setVariant] = useState<Variant>("daisy");
  const [palette, setPalette] = useState<NamedPalette>("meadow");
  const [copied, setCopied] = useState(false);
  const [size] = useState(400);

  useEffect(() => {
    const paramSeed = searchParams.get("seed");
    if (paramSeed) {
      setSeed(paramSeed);
    }
  }, [searchParams]);

  const svg = useMemo(
    () => renderFlower({ seed, variant, palette, size }),
    [seed, variant, palette, size]
  );

  const handleRandomize = useCallback(() => {
    const newSeed = randomSeed();
    setSeed(newSeed);
    router.replace(`/studio?seed=${encodeURIComponent(newSeed)}`, {
      scroll: false,
    });
  }, [router]);

  const handleCopySeed = useCallback(async () => {
    const ok = await copyToClipboard(seed);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [seed]);

  const handleDownload = useCallback(() => {
    downloadSvg(svg, `bloom-${seed}.svg`);
  }, [svg, seed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleRandomize();
      }
    },
    [handleRandomize]
  );

  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
      onKeyDown={handleKeyDown}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-paper-100">
          Studio
        </h1>
        <p className="mt-1 text-ink-600 dark:text-paper-400">
          Compose blooms from seeds, variants, and palettes.{" "}
          <kbd className="rounded border border-paper-300 bg-paper-100 px-1.5 py-0.5 font-mono text-xs dark:border-ink-700 dark:bg-ink-800">
            ⌘R
          </kbd>{" "}
          to randomize.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl border border-paper-200 bg-paper-100 p-8 dark:border-ink-800 dark:bg-ink-900">
          <FlowerSvg
            seed={seed}
            variant={variant}
            palette={palette}
            size={size}
            className="max-w-full shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="seed-input"
              className="mb-2 block text-sm font-medium text-ink-700 dark:text-paper-300"
            >
              Seed
            </label>
            <div className="flex gap-2">
              <input
                id="seed-input"
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="flex-1 rounded-lg border border-paper-300 bg-white px-4 py-2.5 font-mono text-sm text-ink-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-200"
                aria-describedby="seed-help"
              />
              <button
                type="button"
                onClick={handleCopySeed}
                className="rounded-lg border border-paper-300 bg-paper-100 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:hover:bg-ink-700"
                aria-label="Copy seed to clipboard"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p id="seed-help" className="mt-1 text-xs text-ink-500 dark:text-paper-500">
              Same seed + options always produces the same flower.
            </p>
          </div>

          <div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-700 dark:text-paper-300">
                Variant
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Flower variant">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={variant === v}
                    onClick={() => setVariant(v)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      variant === v
                        ? "bg-sage-600 text-white dark:bg-sage-500"
                        : "border border-paper-300 bg-paper-100 text-ink-700 hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-300 dark:hover:bg-ink-700"
                    }`}
                  >
                    {VARIANT_LABELS[v]}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-700 dark:text-paper-300">
                Palette
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color palette">
                {PALETTE_NAMES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={palette === p}
                    onClick={() => setPalette(p)}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      palette === p
                        ? "bg-terracotta-500 text-white"
                        : "border border-paper-300 bg-paper-100 text-ink-700 hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-300 dark:hover:bg-ink-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleRandomize}
              className="rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 dark:bg-sage-500 dark:hover:bg-sage-600"
            >
              Randomize seed
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full border border-paper-300 bg-paper-100 px-6 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-200 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-200 dark:hover:bg-ink-700"
            >
              Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-ink-500">Loading studio…</p>
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
