import type { Point, TrianglesConfig } from '../types/index.js';
import { hslToHex } from '../color/hsl-to-hex.js';
import { brightColor } from '../color/bright-color.js';
import type { HslConfig } from '../types/config.js';
import { drawTrianglePath } from './draw-triangle-path.js';
import { getPlasmaRenderer } from './plasma-renderer.js';

function hslToRgb01(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const sN = Math.max(0, Math.min(100, s)) / 100;
  const lN = Math.max(0, Math.min(100, l)) / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number): number => {
    const k = (n + h / 30) % 12;
    return lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [f(0), f(8), f(4)];
}

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

  if (tc.plasma.enabled) {
    const pr = getPlasmaRenderer(tc.plasma.textureSize);
    if (pr) {
      const [r, g, b] = hslToRgb01(hue, sat, lit);
      pr.render(performance.now() / 1000 * tc.plasma.speed, r, g, b, hue / 60);
      ctx.clip();
      const minX = Math.min(p1.x, p2.x, p3.x);
      const minY = Math.min(p1.y, p2.y, p3.y);
      const maxX = Math.max(p1.x, p2.x, p3.x);
      const maxY = Math.max(p1.y, p2.y, p3.y);
      ctx.globalAlpha = tc.plasma.alpha;
      ctx.globalCompositeOperation = tc.plasma.blendMode;
      ctx.drawImage(pr.canvas, minX, minY, maxX - minX, maxY - minY);
      ctx.globalCompositeOperation = tc.compositeOp;
    }
  }

  drawTrianglePath(ctx, p1, p2, p3);
  const rLight = ctx.createRadialGradient(p1.x, p1.y, 0, p1.x, p1.y, gradientRadius);
  rLight.addColorStop(0, lighter);
  rLight.addColorStop(1, 'transparent');
  ctx.fillStyle = rLight;
  ctx.globalAlpha = tc.lightGradientAlpha;
  ctx.fill();

  drawTrianglePath(ctx, p1, p2, p3);
  const rDark = ctx.createRadialGradient(p2.x, p2.y, 0, p2.x, p2.y, gradientRadius);
  rDark.addColorStop(0, darker);
  rDark.addColorStop(1, 'transparent');
  ctx.fillStyle = rDark;
  ctx.globalAlpha = tc.darkGradientAlpha;
  ctx.fill();

  ctx.strokeStyle = bright;
  ctx.lineWidth = tc.borderLineWidth;
  ctx.globalAlpha = borderAlpha;
  drawTrianglePath(ctx, p1, p2, p3);
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
