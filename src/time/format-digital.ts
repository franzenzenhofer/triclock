import type { TimeValues } from '../types/index.js';
import { padTwo } from './pad-two.js';

export function formatDigital(time: TimeValues, showSeconds = true): string {
  const hm = `${padTwo(time.hours)}:${padTwo(time.minutes)}`;
  if (!showSeconds) return hm;
  return `${hm}:${padTwo(time.seconds)}`;
}
