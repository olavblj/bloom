import { createPrng, prngFloat, prngInt } from "./prng";
import { resolvePalette, type PaletteInput } from "./palettes";
import type { Variant } from "./variants";

export interface RenderFlowerOptions {
  seed: string;
  variant?: Variant;
  palette?: PaletteInput;
  size?: number;
}

export interface FlowerParams {
  petalCount: number;
  petalScale: number;
  rotation: number;
  centerRadius: number;
  stemHeight: number;
  leafCount: number;
  asymmetry: number;
}

function deriveParams(seed: string, variant: Variant): FlowerParams {
  const rng = createPrng(`${seed}:${variant}`);
  const base = {
    petalCount: prngInt(rng, 5, 12),
    petalScale: prngFloat(rng, 0.85, 1.15),
    rotation: prngFloat(rng, 0, 360),
    centerRadius: prngFloat(rng, 0.08, 0.14),
    stemHeight: prngFloat(rng, 0.35, 0.55),
    leafCount: prngInt(rng, 1, 3),
    asymmetry: prngFloat(rng, 0, 0.08),
  };

  switch (variant) {
    case "daisy":
      return { ...base, petalCount: prngInt(rng, 8, 16), petalScale: 1 };
    case "rose":
      return {
        ...base,
        petalCount: prngInt(rng, 12, 20),
        petalScale: prngFloat(rng, 0.7, 0.95),
      };
    case "tulip":
      return {
        ...base,
        petalCount: prngInt(rng, 5, 7),
        petalScale: prngFloat(rng, 1.1, 1.35),
        stemHeight: prngFloat(rng, 0.45, 0.6),
      };
    case "lotus":
      return {
        ...base,
        petalCount: prngInt(rng, 8, 14),
        petalScale: prngFloat(rng, 0.9, 1.1),
        centerRadius: prngFloat(rng, 0.12, 0.18),
      };
    case "sunburst":
      return {
        ...base,
        petalCount: prngInt(rng, 14, 24),
        petalScale: prngFloat(rng, 0.6, 0.85),
        centerRadius: prngFloat(rng, 0.1, 0.16),
      };
  }
}

function petalPath(
  cx: number,
  cy: number,
  angle: number,
  length: number,
  width: number,
  variant: Variant
): string {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const tipX = cx + cos * length;
  const tipY = cy + sin * length;

  const perpX = -sin * width;
  const perpY = cos * width;

  const baseLeftX = cx + perpX * 0.4;
  const baseLeftY = cy + perpY * 0.4;
  const baseRightX = cx - perpX * 0.4;
  const baseRightY = cy - perpY * 0.4;

  if (variant === "tulip") {
    const ctrl1X = cx + cos * length * 0.5 + perpX;
    const ctrl1Y = cy + sin * length * 0.5 + perpY;
    const ctrl2X = cx + cos * length * 0.5 - perpX;
    const ctrl2Y = cy + sin * length * 0.5 - perpY;
    return `M ${baseLeftX} ${baseLeftY} Q ${ctrl1X} ${ctrl1Y} ${tipX} ${tipY} Q ${ctrl2X} ${ctrl2Y} ${baseRightX} ${baseRightY} Z`;
  }

  if (variant === "rose") {
    const midX = cx + cos * length * 0.65;
    const midY = cy + sin * length * 0.65;
    const ctrlX = midX + perpX * 0.6;
    const ctrlY = midY + perpY * 0.6;
    return `M ${cx} ${cy} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY} Q ${midX - perpX * 0.3} ${midY - perpY * 0.3} ${baseRightX} ${baseRightY} Q ${cx} ${cy} ${baseLeftX} ${baseLeftY} Z`;
  }

  const midX = cx + cos * length * 0.7;
  const midY = cy + sin * length * 0.7;
  return `M ${baseLeftX} ${baseLeftY} Q ${midX + perpX * 0.3} ${midY + perpY * 0.3} ${tipX} ${tipY} Q ${midX - perpX * 0.3} ${midY - perpY * 0.3} ${baseRightX} ${baseRightY} Z`;
}

function leafPath(
  x: number,
  y: number,
  angle: number,
  scale: number
): string {
  const rad = (angle * Math.PI) / 180;
  const len = 0.12 * scale;
  const tipX = x + Math.cos(rad) * len;
  const tipY = y + Math.sin(rad) * len;
  const ctrl1X = x + Math.cos(rad + 0.8) * len * 0.5;
  const ctrl1Y = y + Math.sin(rad + 0.8) * len * 0.5;
  const ctrl2X = x + Math.cos(rad - 0.8) * len * 0.5;
  const ctrl2Y = y + Math.sin(rad - 0.8) * len * 0.5;
  return `M ${x} ${y} Q ${ctrl1X} ${ctrl1Y} ${tipX} ${tipY} Q ${ctrl2X} ${ctrl2Y} ${x} ${y} Z`;
}

function renderPetals(
  params: FlowerParams,
  variant: Variant,
  cx: number,
  cy: number,
  unit: number,
  petal: string,
  petalAlt: string
): string {
  const petals: string[] = [];
  const petalLength = unit * 0.32 * params.petalScale;
  const petalWidth = unit * 0.08 * params.petalScale;
  const step = 360 / params.petalCount;

  for (let i = 0; i < params.petalCount; i++) {
    const layer = variant === "rose" ? Math.floor(i / 4) : 0;
    const layerOffset = layer * 8;
    const angle =
      params.rotation + i * step + layerOffset + params.asymmetry * i * 10;
    const scale = variant === "rose" ? 1 - layer * 0.12 : 1;
    const color = i % 2 === 0 ? petal : petalAlt;
    const length = petalLength * scale;
    const width = petalWidth * scale;
    const offset = variant === "rose" ? layer * unit * 0.02 : 0;
    const ox = cx + Math.cos((angle * Math.PI) / 180) * offset;
    const oy = cy + Math.sin((angle * Math.PI) / 180) * offset;
    petals.push(
      `<path d="${petalPath(ox, oy, angle, length, width, variant)}" fill="${color}" />`
    );
  }

  if (variant === "lotus") {
    const innerCount = Math.max(4, Math.floor(params.petalCount / 2));
    for (let i = 0; i < innerCount; i++) {
      const angle = params.rotation + 180 / innerCount + i * (360 / innerCount);
      const length = petalLength * 0.55;
      const width = petalWidth * 0.7;
      petals.push(
        `<path d="${petalPath(cx, cy, angle, length, width, "daisy")}" fill="${petalAlt}" opacity="0.9" />`
      );
    }
  }

  return petals.join("\n    ");
}

function renderStemAndLeaves(
  params: FlowerParams,
  cx: number,
  cy: number,
  unit: number,
  stem: string,
  leaf: string,
  seed: string
): string {
  const rng = createPrng(`${seed}:stem`);
  const stemTop = cy + unit * 0.05;
  const stemBottom = cy + unit * (0.5 + params.stemHeight);
  const stemWidth = unit * 0.025;

  const parts: string[] = [
    `<rect x="${cx - stemWidth / 2}" y="${stemTop}" width="${stemWidth}" height="${stemBottom - stemTop}" rx="${stemWidth / 2}" fill="${stem}" />`,
  ];

  for (let i = 0; i < params.leafCount; i++) {
    const t = (i + 1) / (params.leafCount + 1);
    const ly = stemTop + (stemBottom - stemTop) * t;
    const side = i % 2 === 0 ? 1 : -1;
    const angle = side * (40 + prngFloat(rng, 0, 20));
    const scale = prngFloat(rng, 0.8, 1.2);
    parts.push(
      `<path d="${leafPath(cx + side * stemWidth, ly, angle, scale)}" fill="${leaf}" />`
    );
  }

  return parts.join("\n    ");
}

export function renderFlower(options: RenderFlowerOptions): string {
  const {
    seed = "bloom",
    variant = "daisy",
    palette = "meadow",
    size = 256,
  } = options;

  const safeSeed = seed.trim() || "bloom";
  const colors = resolvePalette(palette);
  const params = deriveParams(safeSeed, variant);

  const cx = size / 2;
  const cy = size * 0.42;
  const unit = size;

  const centerR = unit * params.centerRadius;

  const petals = renderPetals(
    params,
    variant,
    cx,
    cy,
    unit,
    colors.petal,
    colors.petalAlt
  );

  const stemLeaves = renderStemAndLeaves(
    params,
    cx,
    cy,
    unit,
    colors.stem,
    colors.leaf,
    safeSeed
  );

  const centerDetail =
    variant === "sunburst"
      ? `<circle cx="${cx}" cy="${cy}" r="${centerR * 1.2}" fill="${colors.center}" />
    <circle cx="${cx}" cy="${cy}" r="${centerR * 0.6}" fill="${colors.petalAlt}" opacity="0.6" />`
      : `<circle cx="${cx}" cy="${cy}" r="${centerR}" fill="${colors.center}" />
    <circle cx="${cx - centerR * 0.2}" cy="${cy - centerR * 0.2}" r="${centerR * 0.25}" fill="${colors.petalAlt}" opacity="0.5" />`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Bloom flower (${variant}, seed: ${safeSeed})">
  <rect width="${size}" height="${size}" fill="${colors.background}" rx="${size * 0.04}" />
  <g class="bloom-stem">
    ${stemLeaves}
  </g>
  <g class="bloom-petals">
    ${petals}
  </g>
  <g class="bloom-center">
    ${centerDetail}
  </g>
</svg>`;
}

export function hashSeedToVariant(seed: string): Variant {
  const rng = createPrng(seed);
  const variants: Variant[] = [
    "daisy",
    "rose",
    "tulip",
    "lotus",
    "sunburst",
  ];
  return variants[Math.floor(rng() * variants.length)]!;
}

export function hashSeedToPalette(seed: string): import("./palettes").NamedPalette {
  const rng = createPrng(`${seed}:palette`);
  const names = [
    "meadow",
    "sunset",
    "twilight",
    "coral",
    "forest",
    "lavender",
  ] as const;
  return names[Math.floor(rng() * names.length)]!;
}
