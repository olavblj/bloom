export interface PaletteColors {
  petal: string;
  petalAlt: string;
  center: string;
  stem: string;
  leaf: string;
  background: string;
}

export type NamedPalette =
  | "meadow"
  | "sunset"
  | "twilight"
  | "coral"
  | "forest"
  | "lavender";

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
};

export const PALETTE_NAMES = Object.keys(NAMED_PALETTES) as NamedPalette[];

export function resolvePalette(palette: PaletteInput): PaletteColors {
  if (typeof palette === "string") {
    return NAMED_PALETTES[palette];
  }
  return palette;
}
