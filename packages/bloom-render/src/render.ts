import { createPrng, prngFloat, prngInt } from "./prng";
import {
  resolvePalette,
  PALETTE_NAMES,
  PALETTE_META,
  palettesForHueFamilies,
  type PaletteInput,
  type NamedPalette,
  type PaletteColors,
} from "./palettes";
import { jitterColor, tintColor, contrastBackground } from "./color";
import { petalOrder } from "./layering";
import { deriveParams, type FlowerParams } from "./params";
import { VARIANTS, type Variant } from "./variants";

export type { FlowerParams } from "./params";

export interface RenderFlowerOptions {
  seed: string;
  variant?: Variant;
  palette?: PaletteInput;
  size?: number;
  /** When true, derive background from petal hue for contrast. */
  contrastBackground?: boolean;
}

/** Preferred hue families per variant — 75% bias when hashing palette. */
const PREFERRED_HUES: Partial<Record<Variant, readonly import("./palettes").HueFamily[]>> = {
  sunburst: ["yellow", "orange"],
  forgetmenot: ["blue", "purple"],
  poppy: ["red", "orange"],
  daylily: ["orange", "yellow", "red", "pink"],
  lotus: ["pink", "purple"],
  tulip: ["red", "pink", "orange"],
};

interface ResolvedColors extends PaletteColors {
  petalTint: string;
}

function applyPaletteJitter(
  colors: PaletteColors,
  params: FlowerParams
): ResolvedColors {
  const petal = jitterColor(colors.petal, params.hueJitter, params.lightnessJitter);
  const petalAlt = jitterColor(
    colors.petalAlt,
    params.hueJitter,
    params.lightnessJitter
  );
  const center = jitterColor(colors.center, params.hueJitter * 0.5, params.lightnessJitter * 0.5);
  const petalTint = tintColor(petal, "darker", 0.1);

  return { ...colors, petal, petalAlt, center, petalTint };
}

function petalColor(
  index: number,
  params: FlowerParams,
  colors: ResolvedColors
): string {
  if (!params.twoTone) return colors.petal;
  return index % 2 === 0 ? colors.petal : colors.petalTint;
}

// ─── Path builders ───────────────────────────────────────────────

function petalPath(
  cx: number,
  cy: number,
  angle: number,
  length: number,
  width: number,
  variant: Variant,
  crinkle = 0
): string {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const wobble = crinkle * length;
  const tipX = cx + cos * length + sin * wobble;
  const tipY = cy + sin * length - cos * wobble;

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

  if (variant === "forgetmenot") {
    // Rounded ellipse petal
    const ex = length * 0.55;
    const ey = width * 1.8;
    const rot = rad * (180 / Math.PI);
    return `M ${cx} ${cy} a ${ex} ${ey} ${rot} 0 1 1 0.01 0 Z`;
  }

  if (variant === "daylily") {
    const curlRad = (angle + 12) * (Math.PI / 180);
    const curlX = cx + Math.cos(curlRad) * length * 0.3;
    const curlY = cy + Math.sin(curlRad) * length * 0.3;
    const midX = cx + cos * length * 0.6 + curlX * 0.15;
    const midY = cy + sin * length * 0.6 + curlY * 0.15;
    return `M ${baseLeftX} ${baseLeftY} Q ${midX + perpX * 0.4} ${midY + perpY * 0.4} ${tipX} ${tipY} Q ${midX - perpX * 0.5} ${midY - perpY * 0.5} ${baseRightX} ${baseRightY} Z`;
  }

  const midX = cx + cos * length * 0.7;
  const midY = cy + sin * length * 0.7;
  return `M ${baseLeftX} ${baseLeftY} Q ${midX + perpX * 0.3} ${midY + perpY * 0.3} ${tipX} ${tipY} Q ${midX - perpX * 0.3} ${midY - perpY * 0.3} ${baseRightX} ${baseRightY} Z`;
}

function midribPath(
  cx: number,
  cy: number,
  angle: number,
  length: number
): string {
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + Math.cos(rad) * length * 0.85;
  const tipY = cy + Math.sin(rad) * length * 0.85;
  return `M ${cx} ${cy} L ${tipX} ${tipY}`;
}

function leafPath(x: number, y: number, angle: number, scale: number): string {
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

// ─── Petal rendering ─────────────────────────────────────────────

interface PetalDrawCtx {
  params: FlowerParams;
  variant: Variant;
  cx: number;
  cy: number;
  unit: number;
  colors: ResolvedColors;
}

function drawPetal(
  ctx: PetalDrawCtx,
  index: number,
  scaleMul = 1,
  offsetMul = 0,
  colorOverride?: string
): string {
  const { params, variant, cx, cy, unit, colors } = ctx;
  const step = 360 / params.petalCount;
  const layer = variant === "rose" ? Math.floor(index / 4) : 0;
  const layerOffset = layer * 10;
  const angle =
    params.rotation + index * step + layerOffset + params.asymmetry * index * 10;
  const scale =
    (variant === "rose" ? 1 - layer * 0.1 : 1) * params.petalScale * scaleMul * params.openness;
  const length = unit * 0.32 * scale;
  const width = unit * (params.pointed ? 0.06 : 0.09) * scale;
  const offset = offsetMul + (variant === "rose" ? layer * unit * 0.025 : 0);
  const ox = cx + Math.cos((angle * Math.PI) / 180) * offset;
  const oy = cy + Math.sin((angle * Math.PI) / 180) * offset;
  const color = colorOverride ?? petalColor(index, params, colors);

  return `<path d="${petalPath(ox, oy, angle + params.curl * (index % 2 === 0 ? 1 : -1) * 0.1, length, width, variant, params.crinkle)}" fill="${color}" />`;
}

function renderPetals(ctx: PetalDrawCtx): string {
  const { params, variant } = ctx;
  const parts: string[] = [];
  const order = petalOrder(params.petalCount, params.layering, params.flipLayers);

  // Back layer (sunburst, lotus)
  if (params.backLayer && (variant === "sunburst" || variant === "lotus")) {
    const backOffset = 180 / params.petalCount;
    for (let i = 0; i < params.petalCount; i++) {
      const angle =
        params.rotation + i * (360 / params.petalCount) + backOffset;
      const length = ctx.unit * 0.32 * params.petalScale * 0.78 * params.openness;
      const width = ctx.unit * 0.07 * params.petalScale * 0.78;
      const ox = ctx.cx + Math.cos((angle * Math.PI) / 180) * ctx.unit * 0.015;
      const oy = ctx.cy + Math.sin((angle * Math.PI) / 180) * ctx.unit * 0.015;
      parts.push(
        `<path d="${petalPath(ox, oy, angle, length, width, variant === "lotus" ? "daisy" : variant)}" fill="${ctx.colors.petalTint}" opacity="0.85" />`
      );
    }
  }

  // Daylily: explicit 3-back + 3-front
  if (variant === "daylily") {
    const backIndices = [0, 2, 4];
    const frontIndices = [1, 3, 5];
    for (const i of backIndices) {
      parts.push(drawPetal(ctx, i, 0.88, -ctx.unit * 0.01, ctx.colors.petalTint));
    }
    for (const i of frontIndices) {
      parts.push(drawPetal(ctx, i, 1.0, ctx.unit * 0.01));
      if (params.midribs) {
        const step = 360 / 6;
        const angle = params.rotation + i * step;
        const length = ctx.unit * 0.32 * params.petalScale * params.openness;
        parts.push(
          `<path d="${midribPath(ctx.cx, ctx.cy, angle, length)}" stroke="${ctx.colors.petalTint}" stroke-width="${ctx.unit * 0.004}" fill="none" opacity="0.5" />`
        );
      }
    }
    return parts.join("\n    ");
  }

  // Rose: concentric rings with twist
  if (variant === "rose") {
    const rings = 3;
    const perRing = Math.ceil(params.petalCount / rings);
    for (let ring = 0; ring < rings; ring++) {
      const ringScale = Math.pow(params.openness, ring * 0.4) * (1 - ring * 0.12);
      const ringTwist = ring * 14;
      for (let j = 0; j < perRing; j++) {
        const i = ring * perRing + j;
        if (i >= params.petalCount) break;
        const step = 360 / perRing;
        const angle = params.rotation + j * step + ringTwist;
        const length = ctx.unit * 0.32 * ringScale * params.petalScale;
        const width = ctx.unit * 0.08 * ringScale;
        const offset = ring * ctx.unit * 0.03;
        const ox = ctx.cx + Math.cos((angle * Math.PI) / 180) * offset;
        const oy = ctx.cy + Math.sin((angle * Math.PI) / 180) * offset;
        const color =
          ring % 2 === 0
            ? petalColor(i, params, ctx.colors)
            : ctx.colors.petalTint;
        parts.push(
          `<path d="${petalPath(ox, oy, angle, length, width, "rose")}" fill="${color}" />`
        );
      }
    }
    return parts.join("\n    ");
  }

  // Tulip: side petals tinted
  if (variant === "tulip") {
    for (let i = 0; i < params.petalCount; i++) {
      const isCenter = i === 0;
      const color = isCenter
        ? ctx.colors.petal
        : params.twoTone
          ? ctx.colors.petalTint
          : ctx.colors.petalAlt;
      const tilt = isCenter ? 0 : (i % 2 === 0 ? -8 : 8);
      const step = 360 / params.petalCount;
      const angle = params.rotation + i * step + tilt;
      const length = ctx.unit * 0.32 * params.petalScale * params.openness;
      const width = ctx.unit * 0.1 * params.petalScale;
      parts.push(
        `<path d="${petalPath(ctx.cx, ctx.cy, angle, length, width, "tulip")}" fill="${color}" />`
      );
    }
    return parts.join("\n    ");
  }

  // Forget-me-not: overlapping ellipses
  if (variant === "forgetmenot") {
    for (const i of order) {
      parts.push(drawPetal(ctx, i, 1.0, ctx.unit * 0.02));
    }
    return parts.join("\n    ");
  }

  // Default radial with layering
  for (const i of order) {
    parts.push(drawPetal(ctx, i));
  }

  // Lotus inner ring
  if (variant === "lotus") {
    const innerCount = Math.max(5, Math.floor(params.petalCount / 2));
    for (let i = 0; i < innerCount; i++) {
      const angle = params.rotation + 180 / innerCount + i * (360 / innerCount);
      const length = ctx.unit * 0.32 * params.petalScale * 0.55 * params.openness;
      const width = ctx.unit * 0.07 * params.petalScale * 0.7;
      parts.push(
        `<path d="${petalPath(ctx.cx, ctx.cy, angle, length, width, "daisy")}" fill="${ctx.colors.petalAlt}" opacity="0.9" />`
      );
    }
  }

  return parts.join("\n    ");
}

// ─── Center details ──────────────────────────────────────────────

function renderCenter(
  params: FlowerParams,
  variant: Variant,
  cx: number,
  cy: number,
  unit: number,
  colors: ResolvedColors,
  seed: string
): string {
  const r = unit * params.centerRadius;
  const rng = createPrng(`${seed}:center`);
  const parts: string[] = [];

  switch (variant) {
    case "sunburst": {
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${r * 1.2}" fill="${colors.center}" />`,
        `<circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${colors.petalAlt}" opacity="0.6" />`
      );
      // Seed-dot ring
      const dotCount = prngInt(rng, 8, 14);
      for (let i = 0; i < dotCount; i++) {
        const a = (i / dotCount) * 360 + params.rotation;
        const dist = r * 0.85;
        const dx = cx + Math.cos((a * Math.PI) / 180) * dist;
        const dy = cy + Math.sin((a * Math.PI) / 180) * dist;
        parts.push(
          `<circle cx="${dx}" cy="${dy}" r="${r * 0.12}" fill="${colors.petalTint}" />`
        );
      }
      break;
    }
    case "poppy": {
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${r * 1.1}" fill="${colors.center}" />`);
      const ringCount = prngInt(rng, 6, 10);
      for (let i = 0; i < ringCount; i++) {
        const a = (i / ringCount) * 360;
        const dist = r * 0.55;
        const dx = cx + Math.cos((a * Math.PI) / 180) * dist;
        const dy = cy + Math.sin((a * Math.PI) / 180) * dist;
        parts.push(
          `<circle cx="${dx}" cy="${dy}" r="${r * 0.14}" fill="${colors.petal}" />`
        );
      }
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="${colors.petalAlt}" />`
      );
      break;
    }
    case "forgetmenot": {
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${r * 1.4}" fill="#F8F4E8" opacity="0.9" />`,
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors.center}" />`
      );
      break;
    }
    case "rose": {
      // Folded bud — dual offset circles
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors.center}" />`,
        `<circle cx="${cx - r * 0.25}" cy="${cy - r * 0.2}" r="${r * 0.55}" fill="${colors.petalTint}" opacity="0.7" />`,
        `<circle cx="${cx + r * 0.15}" cy="${cy + r * 0.1}" r="${r * 0.4}" fill="${colors.petalAlt}" opacity="0.5" />`
      );
      break;
    }
    case "daylily": {
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="${colors.center}" />`);
      if (params.stamens) {
        const stamenCount = 6;
        for (let i = 0; i < stamenCount; i++) {
          const a = params.rotation + (i / stamenCount) * 360 + 30;
          const len = r * 1.8;
          const tipX = cx + Math.cos((a * Math.PI) / 180) * len;
          const tipY = cy + Math.sin((a * Math.PI) / 180) * len;
          const bend = prngFloat(rng, -6, 6);
          const midX = cx + Math.cos(((a + bend) * Math.PI) / 180) * len * 0.5;
          const midY = cy + Math.sin(((a + bend) * Math.PI) / 180) * len * 0.5;
          parts.push(
            `<path d="M ${cx} ${cy} Q ${midX} ${midY} ${tipX} ${tipY}" stroke="${colors.center}" stroke-width="${unit * 0.006}" fill="none" />`,
            `<circle cx="${tipX}" cy="${tipY}" r="${r * 0.18}" fill="${colors.petalAlt}" />`
          );
        }
      }
      break;
    }
    default: {
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors.center}" />`,
        `<circle cx="${cx - r * 0.2}" cy="${cy - r * 0.2}" r="${r * 0.25}" fill="${colors.petalAlt}" opacity="0.5" />`
      );
    }
  }

  return parts.join("\n    ");
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

// ─── Public API ────────────────────────────────────────────────────

export function renderFlower(options: RenderFlowerOptions): string {
  const {
    seed = "bloom",
    variant = "daisy",
    palette = "meadow",
    size = 256,
    contrastBackground: useContrastBg = false,
  } = options;

  const safeSeed = seed.trim() || "bloom";
  const baseColors = resolvePalette(palette);
  const params = deriveParams(safeSeed, variant);
  const colors = applyPaletteJitter(baseColors, params);

  const background =
    useContrastBg && typeof palette === "string"
      ? contrastBackground(colors.petal, PALETTE_META[palette]?.hueFamily === "neutral")
      : colors.background;

  const cx = size / 2;
  const cy = size * 0.42;
  const unit = size;

  const petalCtx: PetalDrawCtx = {
    params,
    variant,
    cx,
    cy,
    unit,
    colors,
  };

  const petals = renderPetals(petalCtx);
  const stemLeaves = renderStemAndLeaves(
    params,
    cx,
    cy,
    unit,
    colors.stem,
    colors.leaf,
    safeSeed
  );
  const centerDetail = renderCenter(
    params,
    variant,
    cx,
    cy,
    unit,
    colors,
    safeSeed
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Bloom flower (${variant}, seed: ${safeSeed})">
  <rect width="${size}" height="${size}" fill="${background}" rx="${size * 0.04}" />
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
  return VARIANTS[Math.floor(rng() * VARIANTS.length)]!;
}

export function hashSeedToPalette(seed: string): NamedPalette {
  const rng = createPrng(`${seed}:palette`);
  const variantRng = createPrng(seed);
  const variant = VARIANTS[Math.floor(variantRng() * VARIANTS.length)]!;
  const preferred = PREFERRED_HUES[variant];

  // 75% chance to pick from preferred hue families
  if (preferred && rng() < 0.75) {
    const matching = palettesForHueFamilies(preferred);
    if (matching.length > 0) {
      return matching[Math.floor(rng() * matching.length)]!;
    }
  }

  return PALETTE_NAMES[Math.floor(rng() * PALETTE_NAMES.length)]!;
}
