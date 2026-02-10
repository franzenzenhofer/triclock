import type { TimeValues, FractionalTime } from '../types/index.js';

export function fractionalize(time: TimeValues): FractionalTime {
  const s = time.seconds + time.ms / 1000;
  const m = time.minutes + s / 60;
  const h = time.hours + m / 60;
  return { h, m, s };
}
