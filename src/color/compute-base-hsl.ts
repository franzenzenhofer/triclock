import type { FractionalTime } from '../types/index.js';
import type { HslConfig, TimeSource } from '../types/config.js';

export interface BaseHsl {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

function getTimeValue(time: FractionalTime, source: TimeSource): { value: number; max: number } {
  if (source === 'hours') return { value: time.h, max: 24 };
  if (source === 'minutes') return { value: time.m, max: 60 };
  return { value: time.s, max: 60 };
}

export function computeBaseHsl(time: FractionalTime, config: HslConfig): BaseHsl {
  const hue = getTimeValue(time, config.hueSource);
  const sat = getTimeValue(time, config.satSource);
  const lit = getTimeValue(time, config.litSource);

  const h = (hue.value / hue.max) * 360;
  const s = config.satBase + (sat.value / sat.max) * config.satRange;
  const l = config.litBase + Math.sin((lit.value / lit.max) * Math.PI) * config.litAmplitude;
  return { h, s, l };
}
