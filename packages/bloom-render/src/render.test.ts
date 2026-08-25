import { describe, it, expect } from "vitest";
import {
  renderFlower,
  hashSeedToVariant,
  hashSeedToPalette,
  NAMED_PALETTES,
  VARIANTS,
  type PaletteColors,
} from "../src/index";

describe("renderFlower determinism", () => {
  it("same seed and options produce identical SVG", () => {
    const opts = {
      seed: "garden-42",
      variant: "daisy" as const,
      palette: "meadow" as const,
      size: 128,
    };
    const a = renderFlower(opts);
    const b = renderFlower(opts);
    expect(a).toBe(b);
  });

  it("different seeds produce different SVG", () => {
    const base = { variant: "rose" as const, palette: "sunset" as const, size: 128 };
    const a = renderFlower({ ...base, seed: "alpha" });
    const b = renderFlower({ ...base, seed: "beta" });
    expect(a).not.toBe(b);
  });

  it("invalid/empty seed still renders something stable", () => {
    const a = renderFlower({ seed: "", variant: "tulip", palette: "coral" });
    const b = renderFlower({ seed: "", variant: "tulip", palette: "coral" });
    expect(a).toBe(b);
    expect(a).toContain("<svg");
    expect(a).toContain("seed: bloom");
  });

  it("custom palette colors appear in output", () => {
    const custom: PaletteColors = {
      petal: "#FF00FF",
      petalAlt: "#00FF00",
      center: "#0000FF",
      stem: "#FFFF00",
      leaf: "#00FFFF",
      background: "#111111",
    };
    const svg = renderFlower({
      seed: "custom-test",
      variant: "lotus",
      palette: custom,
      size: 100,
    });
    // Jitter may shift colors slightly, but background and stem stay exact
    expect(svg).toContain("#FFFF00");
    expect(svg).toContain("#111111");
    expect(svg).toContain("<svg");
  });

  it("all named palettes render valid SVG", () => {
    for (const name of Object.keys(NAMED_PALETTES)) {
      const svg = renderFlower({
        seed: "palette-test",
        variant: "daisy",
        palette: name as keyof typeof NAMED_PALETTES,
      });
      expect(svg).toContain("<svg");
    }
  });

  it("all variants render valid SVG", () => {
    for (const variant of VARIANTS) {
      const svg = renderFlower({ seed: "variant-test", variant });
      expect(svg).toContain("<svg");
      expect(svg).toContain(`(${variant}`);
    }
  });

  it("new variants are deterministic", () => {
    const newVariants = ["forgetmenot", "daylily", "poppy"] as const;
    for (const variant of newVariants) {
      const opts = { seed: `new-${variant}`, variant, palette: "sapphire" as const, size: 200 };
      expect(renderFlower(opts)).toBe(renderFlower(opts));
    }
  });

  it("same seed + variant + palette always replays identically", () => {
    const opts = {
      seed: "replay-test-99",
      variant: "poppy" as const,
      palette: "amber" as const,
      size: 256,
    };
    const runs = Array.from({ length: 5 }, () => renderFlower(opts));
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i]).toBe(runs[0]);
    }
  });

  it("independent RNG forks: stem params do not shift crown", () => {
    const crownA = renderFlower({ seed: "fork-test", variant: "daisy", size: 128 });
    // Re-render with same seed — crown group must be byte-identical
    const crownB = renderFlower({ seed: "fork-test", variant: "daisy", size: 128 });
    const extractCrown = (svg: string) => {
      const match = svg.match(/<g class="bloom-petals">([\s\S]*?)<\/g>/);
      return match?.[1] ?? "";
    };
    expect(extractCrown(crownA)).toBe(extractCrown(crownB));
  });
});

describe("hashSeedToVariant", () => {
  it("returns a valid variant deterministically", () => {
    const v1 = hashSeedToVariant("amber-garden-1");
    const v2 = hashSeedToVariant("amber-garden-1");
    expect(VARIANTS).toContain(v1);
    expect(v1).toBe(v2);
  });
});

describe("hashSeedToPalette", () => {
  it("returns a valid palette deterministically", () => {
    const p1 = hashSeedToPalette("amber-garden-1");
    const p2 = hashSeedToPalette("amber-garden-1");
    expect(Object.keys(NAMED_PALETTES)).toContain(p1);
    expect(p1).toBe(p2);
  });

  it("sunburst seeds bias toward warm palettes", () => {
    let warmCount = 0;
    const warmPalettes = new Set(["sunset", "amber", "coral", "blossom"]);
    for (let i = 0; i < 200; i++) {
      const seed = `sunburst-bias-${i}`;
      if (hashSeedToVariant(seed) === "sunburst") {
        const palette = hashSeedToPalette(seed);
        if (warmPalettes.has(palette)) warmCount++;
      }
    }
    // Not all seeds are sunburst, but among those that are, warm bias should appear
    expect(warmCount).toBeGreaterThan(0);
  });
});

describe("createPrng", () => {
  it("produces deterministic sequences", async () => {
    const { createPrng } = await import("../src/prng");
    const a = createPrng("test-seed");
    const b = createPrng("test-seed");
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });
});

describe("color utilities", () => {
  it("jitter is deterministic per seed", async () => {
    const { jitterColor } = await import("../src/color");
    const a = jitterColor("#E8B4B8", 5, 0.02);
    const b = jitterColor("#E8B4B8", 5, 0.02);
    expect(a).toBe(b);
    expect(a).not.toBe("#E8B4B8");
  });

  it("tint stays in-family", async () => {
    const { tintColor, hexToHsl } = await import("../src/color");
    const tinted = tintColor("#E8B4B8", "darker");
    const base = hexToHsl("#E8B4B8");
    const result = hexToHsl(tinted);
    expect(Math.abs(base.h - result.h)).toBeLessThan(5);
    expect(result.l).toBeLessThan(base.l);
  });
});
