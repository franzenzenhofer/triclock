import type { TimeValues } from '../types/index.js';
import { padTwo } from './pad-two.js';

export function formatDigital(time: TimeValues): string {
  return `${padTwo(time.hours)}:${padTwo(time.minutes)}:${padTwo(time.seconds)}`;
}
