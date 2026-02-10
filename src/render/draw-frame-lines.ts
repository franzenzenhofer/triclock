import type { TriangleVertices, TrichronoConfig } from '../types/index.js';
import { drawLine } from './draw-line.js';

export function drawFrameLines(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  config: TrichronoConfig,
): void {
  const color = config.colors.frame;
  drawLine(ctx, verts.A, verts.B, color, 1.5, 0.25);
  drawLine(ctx, verts.B, verts.C, color, 1.5, 0.25);
  drawLine(ctx, verts.C, verts.A, color, 1.5, 0.25);
}
