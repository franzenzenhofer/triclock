import type { Point, GradientStop } from '../types/index.js';
import { appendAlphaHex } from '../color/append-alpha-hex.js';
import { drawCircle } from './draw-circle.js';

export function drawGlowCircle(
  ctx: CanvasRenderingContext2D,
  p: Point,
  r: number,
  color: string,
  glowR: number,
  stops: readonly GradientStop[],
  innerRadiusRatio: number,
  innerAlpha: number,
): void {
  ctx.save();
  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
  for (const stop of stops) {
    grad.addColorStop(stop.position, appendAlphaHex(color, stop.alphaHex));
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawCircle(ctx, p, r, color, 1);
  drawCircle(ctx, p, r * innerRadiusRatio, '#ffffff', innerAlpha);
}
