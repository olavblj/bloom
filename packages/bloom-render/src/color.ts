/** HSL color utilities for seed-based tinting, jitter, and contrast. */

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): Hsl {
  const raw = hex.replace("#", "");
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hh = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hh < 60) {
    r = c;
    g = x;
  } else if (hh < 120) {
    r = x;
    g = c;
  } else if (hh < 180) {
    g = c;
    b = x;
  } else if (hh < 240) {
    g = x;
    b = c;
  } else if (hh < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** Clamp lightness so derived tints stay visible. */
export function clampLightness(l: number): number {
  return Math.max(0.16, Math.min(0.84, l));
}

/** Shift hue and lightness together — preserves petal/shade relationship. */
export function jitterColor(hex: string, hueDelta: number, lightnessDelta: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h + hueDelta, s, clampLightness(l + lightnessDelta));
}

/** Derive a two-tone shade from a base petal color. */
export function tintColor(
  base: string,
  direction: "darker" | "lighter",
  amount = 0.12
): string {
  const { h, s, l } = hexToHsl(base);
  const delta = direction === "darker" ? -amount : amount;
  const nextL = clampLightness(l + delta);
  // Preserve hue when tinting — avoid washed-out near-whites
  const nextS = nextL > 0.75 ? Math.min(s, 0.35) : s;
  return hslToHex(h, nextS, nextL);
}

/** Pick a background that contrasts with the dominant petal hue. */
export function contrastBackground(petalHex: string, preferDark = false): string {
  const { h, s, l } = hexToHsl(petalHex);

  if (preferDark || l > 0.55) {
    // Shift hue ~180° for complementary contrast, keep it muted
    const bgH = (h + 180) % 360;
    const bgL = 0.12 + (1 - l) * 0.08;
    return hslToHex(bgH, Math.min(s * 0.4, 0.25), bgL);
  }

  // Light surface: desaturate and push lightness away from petal
  const bgH = (h + 30) % 360;
  const bgL = Math.min(0.96, l + 0.35);
  return hslToHex(bgH, Math.min(s * 0.15, 0.12), bgL);
}

/** Perceptual distance proxy — hue separation on the wheel. */
export function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}
