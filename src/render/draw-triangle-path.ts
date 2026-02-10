import type { Point } from '../types/index.js';

export function drawTrianglePath(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
): void {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
}
