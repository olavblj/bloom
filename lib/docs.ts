export type CompletenessStatus = "Thin" | "Usable" | "Solid" | "Done";

export interface CompletenessMeta {
  status: CompletenessStatus;
  score: number;
  done: string[];
  remaining: string[];
  outOfScope: string[];
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  completeness: CompletenessMeta;
  content: string;
}

export const docsPages: DocPage[] = [
  {
    slug: "intro",
    title: "Introduction",
    description: "What Bloom is — and what it is not.",
    completeness: {
      status: "Usable",
      score: 55,
      done: [
        "Core product definition documented",
        "Visual language guidelines",
        "Comparison to avatar generators",
      ],
      remaining: [
        "Interactive examples embedded in intro",
        "Brand assets and logo usage",
        "FAQ section",
      ],
      outOfScope: [
        "E-commerce or flower shop features",
        "Photorealistic rendering",
        "AI/ML generation",
      ],
    },
    content: `
## What is Bloom?

Bloom is a **generative illustration studio** for clean, geometric SVG flowers. Every flower is produced deterministically from a seed string plus options (variant, palette, size). The same inputs always yield the same SVG output.

Think of it like [DiceBear](https://www.dicebear.com/) avatars — but for botanical illustrations.

## What Bloom is not

- **Not a flower shop.** No cart, prices, inventory, or checkout.
- **Not photography.** No raster images, stock photos, or photorealism.
- **Not AI-generated.** Blooms come from pure geometry and math — no network calls, no models.

## Visual language

Bloom flowers use:

- Simple geometric shapes (ellipses, beziers, paths)
- Harmonious flat color palettes
- Botanical-editorial warmth — paper tones, sage greens, terracotta accents
- Deterministic variation via seeded PRNG

## Quick start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [localhost:3000](http://localhost:3000) for the gallery, or head to the [Studio](/studio) to compose your own bloom.
`,
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "How seeds become SVG flowers.",
    completeness: {
      status: "Usable",
      score: 50,
      done: [
        "Seed → PRNG → params pipeline documented",
        "Variant system overview",
        "Palette resolution explained",
      ],
      remaining: [
        "Sequence diagrams for each variant",
        "Performance benchmarks",
        "SSR vs client rendering notes",
      ],
      outOfScope: [
        "Server-side image caching",
        "CDN asset pipeline",
        "WebGL renderer",
      ],
    },
    content: `
## Pipeline overview

\`\`\`
seed string → hash → PRNG → derived params → SVG paths → output string
\`\`\`

Every render follows this deterministic pipeline:

1. **Seed hashing** — The seed string is hashed to initialize a mulberry32 PRNG.
2. **Parameter derivation** — Petal count, scale, rotation, stem height, and asymmetry are derived from the PRNG, scoped per variant.
3. **Path building** — Variant-specific path builders place petals, centers, stems, and leaves.
4. **Palette application** — Named or custom palette colors are injected into SVG elements.
5. **SVG assembly** — Paths are composed into a complete SVG document string.

## PRNG

Bloom uses a **mulberry32** variant seeded from a FNV-style hash of the input string:

\`\`\`typescript
const rng = createPrng("my-seed");
const petalCount = prngInt(rng, 8, 16);
\`\`\`

The PRNG is scoped: \`createPrng(seed)\` for global params, \`createPrng(\\\`\${seed}:\${variant}\\\`)\` for variant-specific params.

## Variants

Each variant has its own path builder and parameter ranges:

| Variant | Character |
|---------|-----------|
| Daisy | Radial petals, even spacing |
| Rose | Layered spiral petals |
| Tulip | Cup-shaped curved petals |
| Lotus | Dual-layer pointed petals |
| Sunburst | Many thin radiating petals |

## Determinism guarantee

\`renderFlower({ seed, variant, palette, size })\` with identical arguments **always** returns the same SVG string. This is verified by unit tests.
`,
  },
  {
    slug: "renderer-api",
    title: "Renderer API",
    description: "renderFlower and related exports.",
    completeness: {
      status: "Usable",
      score: 60,
      done: [
        "renderFlower signature documented",
        "Type exports listed",
        "Custom palette example",
      ],
      remaining: [
        "React component wrapper docs",
        "Tree-shaking guidance",
        "Bundle size report",
      ],
      outOfScope: [
        "Canvas/WebGL backends",
        "PNG export built-in",
        "Animation API",
      ],
    },
    content: `
## Package

The renderer lives in \`@bloom/render\` (source: \`packages/bloom-render\`).

## renderFlower

\`\`\`typescript
import { renderFlower } from "@bloom/render";

const svg = renderFlower({
  seed: "garden-42",       // required — any string
  variant: "daisy",        // optional — default "daisy"
  palette: "meadow",       // optional — named or custom object
  size: 256,               // optional — default 256
});
\`\`\`

Returns an SVG string. Empty or whitespace seeds fall back to \`"bloom"\`.

## Types

\`\`\`typescript
type Variant = "daisy" | "rose" | "tulip" | "lotus" | "sunburst";

type NamedPalette =
  | "meadow" | "sunset" | "twilight"
  | "coral" | "forest" | "lavender";

interface PaletteColors {
  petal: string;
  petalAlt: string;
  center: string;
  stem: string;
  leaf: string;
  background: string;
}

type PaletteInput = NamedPalette | PaletteColors;
\`\`\`

## Custom palette

\`\`\`typescript
const svg = renderFlower({
  seed: "custom",
  variant: "lotus",
  palette: {
    petal: "#E8B4B8",
    petalAlt: "#F5D5C8",
    center: "#D4A574",
    stem: "#5B8C5A",
    leaf: "#7BAE7F",
    background: "#FAF6F0",
  },
});
\`\`\`

## Utility exports

\`\`\`typescript
import {
  hashSeedToVariant,
  hashSeedToPalette,
  VARIANTS,
  VARIANT_LABELS,
  NAMED_PALETTES,
  PALETTE_NAMES,
  createPrng,
} from "@bloom/render";
\`\`\`

\`hashSeedToVariant\` and \`hashSeedToPalette\` derive consistent defaults from a seed — used by the gallery to auto-assign styles.
`,
  },
  {
    slug: "gallery",
    title: "Gallery",
    description: "The public flower grid.",
    completeness: {
      status: "Usable",
      score: 45,
      done: [
        "48-seed gallery grid",
        "Click-to-studio navigation",
        "Auto variant/palette from seed",
      ],
      remaining: [
        "Filtering by variant or palette",
        "Infinite scroll or pagination",
        "Shareable permalinks per flower",
      ],
      outOfScope: [
        "User-uploaded flowers",
        "Social likes/comments",
        "Marketplace listings",
      ],
    },
    content: `
## Overview

The gallery at \`/\` displays **48 distinct flowers**, each generated from a unique seed. Variant and palette are auto-derived from the seed using \`hashSeedToVariant\` and \`hashSeedToPalette\`.

## Seed catalog

Seeds follow the pattern \`{adjective}-{noun}-{index}\`, e.g. \`amber-garden-1\`, \`coral-meadow-12\`. The catalog is generated programmatically via \`generateGallerySeeds(48)\`.

## Interaction

- **Click** any flower to open the Studio with that seed pre-filled.
- Seeds are shown below each thumbnail in monospace.
- Gallery uses staggered fade-in animation (respects \`prefers-reduced-motion\`).

## Implementation

\`\`\`tsx
import { FlowerSvg } from "@/components/FlowerSvg";
import { hashSeedToVariant, hashSeedToPalette } from "@/lib/bloom";

<FlowerSvg
  seed="amber-garden-1"
  variant={hashSeedToVariant("amber-garden-1")}
  palette={hashSeedToPalette("amber-garden-1")}
  size={200}
  interactive
  onClick={() => router.push("/studio?seed=amber-garden-1")}
/>
\`\`\`
`,
  },
  {
    slug: "palettes-variants",
    title: "Palettes & Variants",
    description: "Named palettes and flower shapes.",
    completeness: {
      status: "Usable",
      score: 55,
      done: [
        "6 named palettes defined",
        "5 variants implemented",
        "Custom palette support",
      ],
      remaining: [
        "Palette preview swatches in docs",
        "Variant comparison matrix",
        "Palette editor in studio",
      ],
      outOfScope: [
        "Gradient fills",
        "Texture overlays",
        "Seasonal auto-palettes",
      ],
    },
    content: `
## Variants

Bloom ships with **5 variants** (minimum 4 required):

| Variant | Label | Description |
|---------|-------|-------------|
| \`daisy\` | Daisy | Classic radial petals, 8–16 count |
| \`rose\` | Rose | Layered spiral with decreasing scale |
| \`tulip\` | Tulip | Cup-shaped curved petals, taller stem |
| \`lotus\` | Lotus | Dual-layer pointed petals |
| \`sunburst\` | Sunburst | Many thin radiating petals |

## Named palettes

Six palettes are built in:

| Name | Mood |
|------|------|
| \`meadow\` | Soft pinks on warm paper |
| \`sunset\` | Coral and amber warmth |
| \`twilight\` | Deep purples on dark ground |
| \`coral\` | Bright tropical tones |
| \`forest\` | Muted greens and lavender |
| \`lavender\` | Soft purple botanical |

Each palette defines six colors: \`petal\`, \`petalAlt\`, \`center\`, \`stem\`, \`leaf\`, \`background\`.

## Custom palettes

Pass a \`PaletteColors\` object instead of a named palette:

\`\`\`typescript
palette: {
  petal: "#FF6B6B",
  petalAlt: "#FFA07A",
  center: "#FFE66D",
  stem: "#4ECDC4",
  leaf: "#45B7AA",
  background: "#FFF5F5",
}
\`\`\`

Colors appear directly in the SVG \`fill\` attributes — verified by tests.
`,
  },
  {
    slug: "roadmap",
    title: "Roadmap",
    description: "Milestone 0 and what comes next.",
    completeness: {
      status: "Usable",
      score: 40,
      done: [
        "Milestone 0 scope defined",
        "Current deliverables listed",
      ],
      remaining: [
        "Milestone 1 planning",
        "Community contribution guide",
        "Release versioning strategy",
      ],
      outOfScope: [
        "Committed dates",
        "Fundraising milestones",
        "Mobile app roadmap",
      ],
    },
    content: `
## Milestone 0 (current)

The foundation release:

- [x] Public flower gallery MVP
- [x] Hosted docs with search and completeness panels
- [x] Vercel-ready Next.js App Router app
- [x] Pure TypeScript renderer package
- [x] Determinism unit tests
- [x] Studio with seed, variant, palette controls
- [x] SVG download and seed copy

## Not yet started

### Milestone 1 — Distribution
- npm publish \`@bloom/render\`
- React \`<BloomFlower />\` component
- Embed widget / iframe generator

### Milestone 2 — Expression
- Additional variants (chrysanthemum, poppy, wildflower)
- Palette themes (seasonal, monochrome)
- Size presets and aspect ratios

### Milestone 3 — Ecosystem
- CLI: \`npx bloom render --seed=...\`
- Figma plugin
- Open API for batch generation

## Principles

Every milestone maintains:

1. **Determinism** — same seed + options = same SVG
2. **No network** — renderer works offline
3. **SVG only** — no raster dependencies
4. **Honest docs** — completeness panels reflect reality
`,
  },
  {
    slug: "completeness",
    title: "Completeness Index",
    description: "Documentation coverage at a glance.",
    completeness: {
      status: "Usable",
      score: 35,
      done: [
        "Per-page completeness panels",
        "This index page",
      ],
      remaining: [
        "Automated score calculation",
        "CI check for doc freshness",
        "Coverage badges",
      ],
      outOfScope: [
        "100% documentation target for M0",
        "Auto-generated API reference",
      ],
    },
    content: `
## How completeness works

Every docs page includes an expandable **completeness panel** with:

- **Status** — Thin, Usable, Solid, or Done
- **Score** — 0–100 honesty rating
- **Done** — What's actually written
- **Remaining** — What's still needed
- **Out of scope** — What we explicitly won't do

Nothing in Milestone 0 is marked **Done**. The highest status is **Usable** — meaning you can read and use the docs, but they're not comprehensive.

## Page scores

| Page | Status | Score |
|------|--------|-------|
| Introduction | Usable | 55 |
| Architecture | Usable | 50 |
| Renderer API | Usable | 60 |
| Gallery | Usable | 45 |
| Palettes & Variants | Usable | 55 |
| Roadmap | Usable | 40 |
| Completeness Index | Usable | 35 |

**Average: ~49** — honest for a Milestone 0 docs pass.
`,
  },
];

export function getDocBySlug(slug: string): DocPage | undefined {
  return docsPages.find((p) => p.slug === slug);
}

export const docSearchIndex = docsPages.map((page) => ({
  slug: page.slug,
  title: page.title,
  description: page.description,
  content: page.content,
}));
