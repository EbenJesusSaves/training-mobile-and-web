// Helpers for bundled Lottie animations (assets/lottie). Colours in Lottie JSON are 0–1 RGB(A) arrays.

type Rgb = [number, number, number];

const DARK_LUMINANCE = 0.15;
const LIGHT_LUMINANCE = 0.95;
const HEX_CHANNELS = [0, 2, 4];
const HEX_RADIX = 16;
const CHANNEL_MAX = 255;
const RGB_LENGTH = 3;

const hexToRgb = (hex: string): Rgb =>
  HEX_CHANNELS.map((start) => parseInt(hex.slice(1 + start, 3 + start), HEX_RADIX) / CHANNEL_MAX) as Rgb;

// Rec. 709 relative luminance on the 0–1 channels.
const luminance = ([r, g, b]: number[]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const isColor = (value: unknown): value is number[] =>
  Array.isArray(value) && value.length >= RGB_LENGTH && value.every((channel) => typeof channel === 'number');

/**
 * Returns a copy of an animation with near-black colours replaced by `dark` and near-white ones by
 * `light`. Flat illustrations drawn for light backgrounds then read correctly in dark mode.
 */
export function swapNeutralColors<T extends object>(animation: T, { dark, light }: { dark: string; light: string }): T {
  const copy = JSON.parse(JSON.stringify(animation)) as T;
  const targets = { dark: hexToRgb(dark), light: hexToRgb(light) };

  const swap = (value: unknown) => {
    if (!isColor(value)) return;
    const level = luminance(value);
    const target = level < DARK_LUMINANCE ? targets.dark : level > LIGHT_LUMINANCE ? targets.light : null;
    if (target) value.splice(0, RGB_LENGTH, ...target);
  };

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    // Fill and stroke shapes carry their colour in `c.k`: a static colour, or keyframes with `s`/`e`.
    if ((record.ty === 'fl' || record.ty === 'st') && record.c && typeof record.c === 'object') {
      const { k } = record.c as { k?: unknown };
      if (isColor(k)) swap(k);
      else if (Array.isArray(k)) k.forEach((frame: { s?: unknown; e?: unknown }) => [frame?.s, frame?.e].forEach(swap));
    }
    Object.values(record).forEach(walk);
  };

  walk(copy);
  return copy;
}
