import type { TriangleVertices, TrichronoConfig } from '../types/index.js';
import { drawLine } from './draw-line.js';

export function drawFrameLines(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  config: TrichronoConfig,
): void {
  const color = config.colors.frame;
  const { width, alpha } = config.frameLines;
  drawLine(ctx, verts.A, verts.B, color, width, alpha);
  drawLine(ctx, verts.B, verts.C, color, width, alpha);
  drawLine(ctx, verts.C, verts.A, color, width, alpha);
}
