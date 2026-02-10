import type { Point, TriangleVertices, TrichronoConfig } from '../types/index.js';
import type { BaseHsl } from '../color/compute-base-hsl.js';
import { drawColorTriangle } from './draw-color-triangle.js';
import { drawLayerGroup } from './draw-layer-group.js';

interface TipPoints {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

export function drawTriangleLayers(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  tips: TipPoints,
  base: BaseHsl,
  config: TrichronoConfig,
  size: number,
): void {
  const tc = config.triangles;
  const step = tc.hueStep;

  ctx.save();
  ctx.globalCompositeOperation = tc.compositeOp;

  drawLayerGroup(ctx, tc.sectorLayers, [
    [verts.A, verts.B, tips.hTip],
    [verts.B, verts.C, tips.mTip],
    [verts.C, verts.A, tips.sTip],
  ], step, base, config, size);

  drawLayerGroup(ctx, tc.crossLayers, [
    [verts.A, tips.mTip, tips.sTip],
    [verts.B, tips.hTip, tips.sTip],
    [verts.C, tips.hTip, tips.mTip],
  ], step, base, config, size);

  drawLayerGroup(ctx, tc.wedgeLayers, [
    [verts.A, tips.hTip, tips.sTip],
    [verts.B, tips.hTip, tips.mTip],
    [verts.C, tips.mTip, tips.sTip],
  ], step, base, config, size);

  const pl = tc.primaryLayer;
  if (pl.visible) {
    drawColorTriangle(
      ctx, tips.hTip, tips.mTip, tips.sTip,
      base.h, base.s, base.l,
      pl.fillAlpha, pl.borderAlpha,
      config.hsl,
      tc.shadowBlur, tc.shadowAlpha,
      size,
    );
  }

  ctx.restore();
}
