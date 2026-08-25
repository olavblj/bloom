import { createPrng, prngFloat, prngInt, pick } from "./prng";
import type { LayeringMode } from "./layering";
import type { Variant } from "./variants";

export interface FlowerParams {
  petalCount: number;
  petalScale: number;
  rotation: number;
  centerRadius: number;
  stemHeight: number;
  leafCount: number;
  asymmetry: number;
  layering: LayeringMode;
  flipLayers: boolean;
  twoTone: boolean;
  openness: number;
  pointed: boolean;
  backLayer: boolean;
  midribs: boolean;
  stamens: boolean;
  curl: number;
  crinkle: number;
  hueJitter: number;
  lightnessJitter: number;
}

function sampleBase(rng: () => number): Omit<
  FlowerParams,
  | "layering"
  | "flipLayers"
  | "twoTone"
  | "openness"
  | "pointed"
  | "backLayer"
  | "midribs"
  | "stamens"
  | "curl"
  | "crinkle"
  | "hueJitter"
  | "lightnessJitter"
> {
  return {
    petalCount: prngInt(rng, 5, 12),
    petalScale: prngFloat(rng, 0.85, 1.15),
    rotation: prngFloat(rng, 0, 360),
    centerRadius: prngFloat(rng, 0.08, 0.14),
    stemHeight: prngFloat(rng, 0.35, 0.55),
    leafCount: prngInt(rng, 1, 3),
    asymmetry: prngFloat(rng, 0, 0.08),
  };
}

function sampleKnobs(rng: () => number): Pick<
  FlowerParams,
  | "layering"
  | "flipLayers"
  | "twoTone"
  | "openness"
  | "pointed"
  | "backLayer"
  | "midribs"
  | "stamens"
  | "curl"
  | "crinkle"
  | "hueJitter"
  | "lightnessJitter"
> {
  const layeringModes: LayeringMode[] = ["alternating", "weave", "ladder"];
  return {
    layering: pick(rng, layeringModes),
    flipLayers: rng() > 0.5,
    twoTone: rng() > 0.35,
    openness: prngFloat(rng, 0.55, 1.0),
    pointed: rng() > 0.4,
    backLayer: rng() > 0.45,
    midribs: rng() > 0.55,
    stamens: rng() > 0.4,
    curl: prngFloat(rng, 0, 18),
    crinkle: prngFloat(rng, 0, 0.15),
    hueJitter: prngFloat(rng, -7, 7),
    lightnessJitter: prngFloat(rng, -0.035, 0.035),
  };
}

export function deriveParams(seed: string, variant: Variant): FlowerParams {
  const rng = createPrng(`${seed}:${variant}`);
  const base = sampleBase(rng);
  const knobs = sampleKnobs(rng);

  switch (variant) {
    case "daisy":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 10, 16),
        petalScale: prngFloat(rng, 0.9, 1.05),
        layering: pick(rng, ["alternating", "weave"] as const),
        twoTone: rng() > 0.3,
      };
    case "rose":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 14, 22),
        petalScale: prngFloat(rng, 0.65, 0.9),
        layering: "ladder",
        openness: prngFloat(rng, 0.45, 0.85),
        twoTone: rng() > 0.5,
      };
    case "tulip":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 5, 7),
        petalScale: prngFloat(rng, 1.1, 1.35),
        stemHeight: prngFloat(rng, 0.45, 0.6),
        layering: "ladder",
        openness: prngFloat(rng, 0.5, 0.75),
        pointed: false,
        twoTone: rng() > 0.4,
      };
    case "lotus":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 10, 16),
        petalScale: prngFloat(rng, 0.9, 1.1),
        centerRadius: prngFloat(rng, 0.12, 0.18),
        layering: "weave",
        backLayer: true,
      };
    case "sunburst":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 16, 24),
        petalScale: prngFloat(rng, 0.55, 0.8),
        centerRadius: prngFloat(rng, 0.1, 0.16),
        layering: "alternating",
        backLayer: rng() > 0.35,
        pointed: true,
        twoTone: rng() > 0.45,
      };
    case "forgetmenot":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 5, 6),
        petalScale: prngFloat(rng, 0.7, 0.9),
        centerRadius: prngFloat(rng, 0.06, 0.1),
        layering: "ladder",
        openness: prngFloat(rng, 0.7, 0.95),
        twoTone: false,
        pointed: false,
      };
    case "daylily":
      return {
        ...base,
        ...knobs,
        petalCount: 6,
        petalScale: prngFloat(rng, 1.0, 1.25),
        layering: "alternating",
        openness: prngFloat(rng, 0.6, 0.9),
        midribs: rng() > 0.35,
        stamens: rng() > 0.25,
        curl: prngFloat(rng, 8, 22),
        twoTone: rng() > 0.4,
      };
    case "poppy":
      return {
        ...base,
        ...knobs,
        petalCount: prngInt(rng, 5, 7),
        petalScale: prngFloat(rng, 1.05, 1.3),
        centerRadius: prngFloat(rng, 0.1, 0.15),
        layering: pick(rng, ["alternating", "ladder"] as const),
        crinkle: prngFloat(rng, 0.08, 0.2),
        openness: prngFloat(rng, 0.75, 1.0),
        twoTone: rng() > 0.35,
        stamens: false,
      };
  }
}
