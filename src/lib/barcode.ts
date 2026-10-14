export const BARCODE_MODULES = 96;

export type Bar = { x: number; width: number };

/**
 * Decorative barcode bars derived from the ticket ID, so every pass gets its
 * own stable pattern on screen and in the downloaded PNG.
 */
export function barcodeBars(value: string): Bar[] {
  // FNV-1a hash as the seed for a small mulberry32 generator.
  let seed = 2166136261;
  for (let i = 0; i < value.length; i++) {
    seed ^= value.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const bars: Bar[] = [
    { x: 0, width: 1 },
    { x: 2, width: 1 },
  ];
  let x = 4;
  while (x < BARCODE_MODULES - 7) {
    const width = 1 + Math.floor(random() * 3);
    bars.push({ x, width });
    x += width + 1 + Math.floor(random() * 2);
  }
  bars.push({ x: BARCODE_MODULES - 3, width: 1 }, { x: BARCODE_MODULES - 1, width: 1 });
  return bars;
}
