import type { Point } from '../types/index.js';
import { lerp } from '../math/lerp.js';

export function computeTip(from: Point, to: Point, fraction: number): Point {
  return lerp(from, to, fraction);
}
