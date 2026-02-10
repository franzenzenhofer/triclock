import type { TriangleVertices, TrichronoConfig } from '../types/index.js';
import { drawCircle } from './draw-circle.js';

export function drawVertexDots(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  config: TrichronoConfig,
): void {
  const r = config.tips.vertexRadius;
  const a = config.tips.vertexAlpha;
  drawCircle(ctx, verts.A, r, config.colors.hours, a);
  drawCircle(ctx, verts.B, r, config.colors.minutes, a);
  drawCircle(ctx, verts.C, r, config.colors.seconds, a);
}
