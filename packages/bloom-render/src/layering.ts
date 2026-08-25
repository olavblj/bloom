/** Petal z-order modes for overlapping depth. */

export type LayeringMode = "alternating" | "weave" | "ladder";

/**
 * Returns petal indices in draw order (back → front).
 * `flip` reverses which group sits on top.
 */
export function petalOrder(
  count: number,
  mode: LayeringMode,
  flip = false
): number[] {
  const indices = Array.from({ length: count }, (_, i) => i);

  switch (mode) {
    case "alternating": {
      const evens = indices.filter((i) => i % 2 === 0);
      const odds = indices.filter((i) => i % 2 === 1);
      return flip ? [...odds, ...evens] : [...evens, ...odds];
    }
    case "weave": {
      const g0 = indices.filter((i) => i % 3 === 0);
      const g1 = indices.filter((i) => i % 3 === 1);
      const g2 = indices.filter((i) => i % 3 === 2);
      return flip ? [...g2, ...g1, ...g0] : [...g0, ...g1, ...g2];
    }
    case "ladder":
      return flip ? [...indices].reverse() : indices;
  }
}
