import type { Point } from '../types/index.js';

export function normalVector(a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  return { x: -dy / len, y: dx / len };
}
