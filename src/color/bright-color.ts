import type { HslConfig } from '../types/config.js';
import { hslToHex } from './hsl-to-hex.js';

export function brightColor(hue: number, lit: number, config: HslConfig): string {
  return hslToHex(
    hue,
    config.brightSat,
    Math.min(config.brightLitMax, lit + config.brightLitBoost),
  );
}
