import type { Point, TrichronoConfig } from '../types/index.js';
import { lerp } from '../math/lerp.js';
import { appendAlphaHex } from '../color/append-alpha-hex.js';
import { drawLine } from './draw-line.js';

export function drawEdgeProgress(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  progress: number,
  color: string,
  config: TrichronoConfig,
): Point {
  const endP = lerp(from, to, progress);
  const ep = config.edgeProgress;

  for (const pass of ep.passes) {
    ctx.save();
    const grad = ctx.createLinearGradient(from.x, from.y, endP.x, endP.y);
    for (const stop of pass.stops) {
      grad.addColorStop(stop.position, appendAlphaHex(color, stop.alphaHex));
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = pass.width;
    ctx.lineCap = 'round';
    ctx.globalAlpha = pass.alpha;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(endP.x, endP.y);
    ctx.stroke();
    ctx.restore();
  }

  const tipStart = lerp(from, to, Math.max(0, progress - ep.coreTailLength));
  drawLine(ctx, tipStart, endP, color, ep.coreWidth, ep.coreAlpha);

  return endP;
}
