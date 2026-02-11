import { hslToRgb01 } from './hsl-to-rgb01.js';

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb01(h, s, l);
  const hex = (c: number): string =>
    Math.round(255 * c).toString(16).padStart(2, '0');
  return '#' + hex(r) + hex(g) + hex(b);
}
