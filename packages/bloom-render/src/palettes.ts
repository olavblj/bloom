export interface PaletteColors {
  petal: string;
  petalAlt: string;
  center: string;
  stem: string;
  leaf: string;
  background: string;
}

export type HueFamily =
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "neutral";

export type NamedPalette =
  | "meadow"
  | "sunset"
  | "twilight"
  | "coral"
  | "forest"
  | "lavender"
  | "sapphire"
  | "amber"
  | "rosewater"
  | "mint"
  | "slate"
  | "blossom";

export interface PaletteMeta {
  colors: PaletteColors;
  hueFamily: HueFamily;
}

export type PaletteInput = NamedPalette | PaletteColors;

export const NAMED_PALETTES: Record<NamedPalette, PaletteColors> = {
  meadow: {
    petal: "#E8B4B8",
    petalAlt: "#F5D5C8",
    center: "#D4A574",
    stem: "#5B8C5A",
    leaf: "#7BAE7F",
    background: "#FAF6F0",
  },
  sunset: {
    petal: "#E85D4C",
    petalAlt: "#F4A261",
    center: "#E9C46A",
    stem: "#2A6F4E",
    leaf: "#40916C",
    background: "#FFF8F0",
  },
  twilight: {
    petal: "#7B68EE",
    petalAlt: "#9B8EC4",
    center: "#4A4063",
    stem: "#2D3A4A",
    leaf: "#3D5A6C",
    background: "#1A1A2E",
  },
  coral: {
    petal: "#FF6B6B",
    petalAlt: "#FFA07A",
    center: "#FFE66D",
    stem: "#4ECDC4",
    leaf: "#45B7AA",
    background: "#FFF5F5",
  },
  forest: {
    petal: "#C9B1FF",
    petalAlt: "#A8D8B9",
    center: "#F0E68C",
    stem: "#2D5016",
    leaf: "#4A7C23",
    background: "#F0F4E8",
  },
  lavender: {
    petal: "#B8A9C9",
    petalAlt: "#D4C5E2",
    center: "#9B7EBD",
    stem: "#6B5B7A",
    leaf: "#8B7B8B",
    background: "#F5F0FA",
  },
  sapphire: {
    petal: "#5B8FD4",
    petalAlt: "#8BB4E8",
    center: "#F0D060",
    stem: "#3A6B4A",
    leaf: "#5A9A6A",
    background: "#EEF4FA",
  },
  amber: {
    petal: "#E8A830",
    petalAlt: "#F5C860",
    center: "#8B4513",
    stem: "#4A7A3A",
    leaf: "#6B9A4A",
    background: "#FFF9EE",
  },
  rosewater: {
    petal: "#E8909A",
    petalAlt: "#F5B8C0",
    center: "#C06070",
    stem: "#5A8A5A",
    leaf: "#7AAA6A",
    background: "#FFF5F6",
  },
  mint: {
    petal: "#7EC8A0",
    petalAlt: "#A8E0C0",
    center: "#F0E878",
    stem: "#3A6A4A",
    leaf: "#5A9A6A",
    background: "#F0FAF4",
  },
  slate: {
    petal: "#8A9AB0",
    petalAlt: "#B0BCC8",
    center: "#506070",
    stem: "#3A4A5A",
    leaf: "#5A6A7A",
    background: "#EEF0F4",
  },
  blossom: {
    petal: "#F0A0C0",
    petalAlt: "#F8C0D8",
    center: "#FFD878",
    stem: "#4A8A5A",
    leaf: "#6AAA6A",
    background: "#FFF8FA",
  },
};

export const PALETTE_META: Record<NamedPalette, { hueFamily: HueFamily }> = {
  meadow: { hueFamily: "pink" },
  sunset: { hueFamily: "orange" },
  twilight: { hueFamily: "purple" },
  coral: { hueFamily: "red" },
  forest: { hueFamily: "green" },
  lavender: { hueFamily: "purple" },
  sapphire: { hueFamily: "blue" },
  amber: { hueFamily: "yellow" },
  rosewater: { hueFamily: "pink" },
  mint: { hueFamily: "green" },
  slate: { hueFamily: "neutral" },
  blossom: { hueFamily: "pink" },
};

export const PALETTE_NAMES = Object.keys(NAMED_PALETTES) as NamedPalette[];

export function resolvePalette(palette: PaletteInput): PaletteColors {
  if (typeof palette === "string") {
    return NAMED_PALETTES[palette];
  }
  return palette;
}

/** Palettes whose hue family matches one of the preferred families. */
export function palettesForHueFamilies(
  families: readonly HueFamily[]
): NamedPalette[] {
  return PALETTE_NAMES.filter((name) =>
    families.includes(PALETTE_META[name].hueFamily)
  );
}
