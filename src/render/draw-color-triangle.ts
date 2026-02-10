import type { Point } from '../types/index.js';
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
  hslConfig: HslConfig,
  shadowBlur: number,
  shadowAlpha: number,
  size: number,
): void {
  const main = hslToHex(hue, sat, lit);
  const bright = brightColor(hue, lit, hslConfig);
  const lighter = hslToHex(hue + 30, sat, lit + 10);
  const darker = hslToHex(hue - 30, sat, lit - 5);
  const gradientRadius = size * 0.5;

  ctx.save();
  drawTrianglePath(ctx, p1, p2, p3);
  ctx.fillStyle = main;
  ctx.globalAlpha = fillAlpha;
  ctx.fill();

  const rLight = ctx.createRadialGradient(p1.x, p1.y, 0, p1.x, p1.y, gradientRadius);
  rLight.addColorStop(0, lighter);
  rLight.addColorStop(1, 'transparent');
  ctx.fillStyle = rLight;
  ctx.globalAlpha = 0.25;
  ctx.fill();

  const rDark = ctx.createRadialGradient(p2.x, p2.y, 0, p2.x, p2.y, gradientRadius);
  rDark.addColorStop(0, darker);
  rDark.addColorStop(1, 'transparent');
  ctx.fillStyle = rDark;
  ctx.globalAlpha = 0.2;
  ctx.fill();

  ctx.strokeStyle = bright;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = borderAlpha;
  ctx.stroke();
  ctx.restore();

  if (shadowBlur > 0) {
    ctx.save();
    ctx.shadowColor = main;
    ctx.shadowBlur = shadowBlur;
    ctx.strokeStyle = main;
    ctx.lineWidth = 2;
    ctx.globalAlpha = shadowAlpha;
    drawTrianglePath(ctx, p1, p2, p3);
    ctx.stroke();
    ctx.restore();
  }
}
