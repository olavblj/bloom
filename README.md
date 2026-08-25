# Bloom

**Generative geometric SVG flowers** — seed-based, deterministic, with customizable palettes and variants.

Like [DiceBear](https://www.dicebear.com/) avatars, but flowers. Not photography. Not a shop.

## What is Bloom?

Bloom is a generative illustration studio that produces clean, flat geometric SVG flowers from a seed string. Same seed + same options always yields the same SVG output.

- **5 variants** — daisy, rose, tulip, lotus, sunburst
- **6 palettes** — meadow, sunset, twilight, coral, forest, lavender
- **Custom palettes** — pass your own color object
- **Pure TypeScript** — no network, no images, SVG only

## Quick start

```bash
git clone https://github.com/olavblj/bloom.git
cd bloom
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the gallery.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run test` | Run vitest (renderer determinism tests) |
| `npm run lint` | ESLint |

## How seeds work

A **seed** is any string. It initializes a deterministic PRNG (mulberry32) that drives petal count, scale, rotation, stem height, and asymmetry.

```typescript
import { renderFlower } from "@bloom/render";

const svg = renderFlower({
  seed: "garden-42",
  variant: "daisy",
  palette: "meadow",
  size: 256,
});
```

- `renderFlower({ seed: "a", ... })` and `renderFlower({ seed: "a", ... })` → identical SVG
- Different seeds → different flowers
- Empty seed → falls back to `"bloom"` (still deterministic)

## Project structure

```
bloom/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Gallery
│   ├── studio/             # Interactive composer
│   └── docs/               # Hosted documentation
├── packages/bloom-render/  # Pure TS renderer
│   └── src/
│       ├── render.ts       # renderFlower()
│       ├── prng.ts         # Deterministic PRNG
│       ├── palettes.ts     # Named + custom palettes
│       └── variants.ts     # Flower shape variants
└── components/             # React UI components
```

## Deploy

Bloom is Vercel-ready. Push to GitHub and import the repo — no extra configuration needed.

## License

MIT
