import type { Point, GlowPass } from '../types/index.js';
import { hslToHex } from '../color/hsl-to-hex.js';
import { brightColor } from '../color/bright-color.js';
import type { HslConfig } from '../types/config.js';
import { drawTrianglePath } from './draw-triangle-path.js';

export function drawColorTriangle(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
  hue: number,
  sat: number,
  lit: number,
  fillAlpha: number,
  borderAlpha: number,
  glowPasses: readonly GlowPass[],
  hslConfig: HslConfig,
): void {
  const main = hslToHex(hue, sat, lit);
  const bright = brightColor(hue, lit, hslConfig);

  ctx.save();
  drawTrianglePath(ctx, p1, p2, p3);
  ctx.fillStyle = main;
  ctx.globalAlpha = fillAlpha;
  ctx.fill();
  ctx.restore();

  for (const pass of glowPasses) {
    ctx.save();
    drawTrianglePath(ctx, p1, p2, p3);
    ctx.strokeStyle = bright;
    ctx.lineWidth = pass.width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = borderAlpha * pass.alphaMultiplier;
    ctx.stroke();
    ctx.restore();
  }
}
