import type { FractionalTime } from '../types/index.js';
import type { HslConfig } from '../types/config.js';

export interface BaseHsl {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

export function computeBaseHsl(time: FractionalTime, config: HslConfig): BaseHsl {
  const h = (time.s / 60) * 360;
  const s = config.satBase + (time.m / 60) * config.satRange;
  const l = config.litBase + Math.sin((time.h / 24) * Math.PI) * config.litAmplitude;
  return { h, s, l };
}
