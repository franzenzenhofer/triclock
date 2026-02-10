import type { Point } from '../types/index.js';
import { MATH_TAU } from '../constants.js';

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  p: Point,
  r: number,
  color: string,
  alpha = 1,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, MATH_TAU);
  ctx.fill();
  ctx.restore();
}
