export type Variant =
  | "daisy"
  | "rose"
  | "tulip"
  | "lotus"
  | "sunburst"
  | "forgetmenot"
  | "daylily"
  | "poppy";

export const VARIANTS: Variant[] = [
  "daisy",
  "rose",
  "tulip",
  "lotus",
  "sunburst",
  "forgetmenot",
  "daylily",
  "poppy",
];

export const VARIANT_LABELS: Record<Variant, string> = {
  daisy: "Daisy",
  rose: "Rose",
  tulip: "Tulip",
  lotus: "Lotus",
  sunburst: "Sunburst",
  forgetmenot: "Forget-me-not",
  daylily: "Daylily",
  poppy: "Poppy",
};
