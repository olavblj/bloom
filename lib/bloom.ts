import {
  renderFlower,
  hashSeedToVariant,
  hashSeedToPalette,
  VARIANTS,
  VARIANT_LABELS,
  NAMED_PALETTES,
  PALETTE_NAMES,
  type Variant,
  type NamedPalette,
  type PaletteInput,
} from "@bloom/render";

export {
  renderFlower,
  hashSeedToVariant,
  hashSeedToPalette,
  VARIANTS,
  VARIANT_LABELS,
  NAMED_PALETTES,
  PALETTE_NAMES,
  type Variant,
  type NamedPalette,
  type PaletteInput,
};

export function generateGallerySeeds(count: number): string[] {
  const seeds: string[] = [];
  const adjectives = [
    "amber", "azure", "coral", "dawn", "ember", "fern", "glow", "haze",
    "iris", "jade", "kelp", "lilac", "moss", "nova", "opal", "pearl",
    "quartz", "rose", "sage", "teal", "umber", "vine", "wisp", "yarrow",
    "zen", "bloom", "cedar", "dusk", "elm", "flax", "grove", "heath",
    "ivory", "juniper", "knoll", "laurel", "meadow", "nectar", "orchid",
    "petal", "reef", "spruce", "thistle", "vale", "willow", "xenia", "zinnia",
  ];
  const nouns = [
    "garden", "field", "grove", "meadow", "pond", "stream", "hill", "vale",
    "glade", "copse", "arbor", "bower", "haven", "nook", "path", "ridge",
    "shore", "spring", "summit", "trail", "wild", "breeze", "dew", "mist",
    "rain", "shade", "sun", "wind", "bloom", "seed", "root", "stem",
  ];

  for (let i = 0; i < count; i++) {
    const adj = adjectives[i % adjectives.length];
    const noun = nouns[Math.floor(i / adjectives.length) % nouns.length];
    seeds.push(`${adj}-${noun}-${i + 1}`);
  }
  return seeds;
}

export function randomSeed(): string {
  const words = ["bloom", "petal", "seed", "stem", "leaf", "flora", "garden"];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 99999);
  return `${word}-${num}`;
}

export function downloadSvg(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
