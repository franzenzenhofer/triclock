import type { CanvasState, TimeValues, TrichronoConfig } from '../types/index.js';
import { fractionalize } from '../time/fractionalize.js';
import { computeBaseHsl } from '../color/compute-base-hsl.js';
import { getTriangle } from '../geometry/get-triangle.js';
import { drawBackground } from './draw-background.js';
import { drawFrameLines } from './draw-frame-lines.js';
import { drawAllScales } from './draw-all-scales.js';
import { drawAllEdges } from './draw-all-edges.js';
import { drawTriangleLayers } from './draw-triangle-layers.js';
import { drawTips } from './draw-tips.js';
import { drawVertexDots } from './draw-vertex-dots.js';
import { drawDigitalTime } from './draw-digital-time.js';

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
  time: TimeValues,
  config: TrichronoConfig,
): void {
  const fracs = fractionalize(time);
  const baseHsl = computeBaseHsl(fracs, config.hsl);
  const verts = getTriangle(state.cx, state.cy, state.size, config.geometry);

  drawBackground(ctx, state, config);
  drawFrameLines(ctx, verts, config);
  drawAllScales(ctx, verts, fracs, config.edgeMapping, state.size, config);

  const tips = drawAllEdges(ctx, verts, fracs, config.edgeMapping, config);

  drawTriangleLayers(ctx, verts, tips, baseHsl, config);
  drawTips(ctx, tips, state.size, config);
  drawVertexDots(ctx, verts, config);
  drawDigitalTime(ctx, time, state.cx, state.cy, state.size, config);
}
