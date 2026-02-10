import type { Point, TrianglesConfig } from '../types/index.js';
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
  tc: TrianglesConfig,
  size: number,
): void {
  const main = hslToHex(hue, sat, lit);
  const bright = brightColor(hue, lit, hslConfig);
  const lighter = hslToHex(hue + tc.lighterHueOffset, sat, lit + tc.lighterLitBoost);
  const darker = hslToHex(hue - tc.darkerHueOffset, sat, lit - tc.darkerLitReduction);
  const gradientRadius = size * tc.gradientRadiusRatio;

  ctx.save();
  drawTrianglePath(ctx, p1, p2, p3);
  ctx.fillStyle = main;
  ctx.globalAlpha = fillAlpha;
  ctx.fill();

  const rLight = ctx.createRadialGradient(p1.x, p1.y, 0, p1.x, p1.y, gradientRadius);
  rLight.addColorStop(0, lighter);
  rLight.addColorStop(1, 'transparent');
  ctx.fillStyle = rLight;
  ctx.globalAlpha = tc.lightGradientAlpha;
  ctx.fill();

  const rDark = ctx.createRadialGradient(p2.x, p2.y, 0, p2.x, p2.y, gradientRadius);
  rDark.addColorStop(0, darker);
  rDark.addColorStop(1, 'transparent');
  ctx.fillStyle = rDark;
  ctx.globalAlpha = tc.darkGradientAlpha;
  ctx.fill();

  ctx.strokeStyle = bright;
  ctx.lineWidth = tc.borderLineWidth;
  ctx.globalAlpha = borderAlpha;
  ctx.stroke();
  ctx.restore();

  if (tc.shadowBlur > 0) {
    ctx.save();
    ctx.shadowColor = main;
    ctx.shadowBlur = tc.shadowBlur;
    ctx.strokeStyle = main;
    ctx.lineWidth = tc.shadowLineWidth;
    ctx.globalAlpha = tc.shadowAlpha;
    drawTrianglePath(ctx, p1, p2, p3);
    ctx.stroke();
    ctx.restore();
  }
}
