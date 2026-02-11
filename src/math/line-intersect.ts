import type { Point } from '../types/index.js';

export function lineIntersect(a: Point, b: Point, c: Point, d: Point): Point {
  const denom = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denom) < 1e-10) return { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };
  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denom;
  return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
}
