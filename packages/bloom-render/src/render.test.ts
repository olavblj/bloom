import { describe, it, expect } from "vitest";
import {
  renderFlower,
  NAMED_PALETTES,
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
    expect(a).toContain('seed: bloom');
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
    expect(svg).toContain("#FF00FF");
    expect(svg).toContain("#00FF00");
    expect(svg).toContain("#0000FF");
    expect(svg).toContain("#FFFF00");
    expect(svg).toContain("#111111");
  });

  it("all named palettes render valid SVG", () => {
    for (const name of Object.keys(NAMED_PALETTES)) {
      const svg = renderFlower({
        seed: "palette-test",
        variant: "daisy",
        palette: name as keyof typeof NAMED_PALETTES,
      });
      expect(svg).toContain("<svg");
      expect(svg).toContain(NAMED_PALETTES[name as keyof typeof NAMED_PALETTES].background);
    }
  });

  it("all variants render valid SVG", () => {
    const variants = ["daisy", "rose", "tulip", "lotus", "sunburst"] as const;
    for (const variant of variants) {
      const svg = renderFlower({ seed: "variant-test", variant });
      expect(svg).toContain("<svg");
      expect(svg).toContain(`(${variant}`);
    }
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
