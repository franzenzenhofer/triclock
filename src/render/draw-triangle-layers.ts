import type { Point, TriangleVertices, TrichronoConfig, TriangleLayerDef } from '../types/index.js';
import type { BaseHsl } from '../color/compute-base-hsl.js';
import { drawColorTriangle } from './draw-color-triangle.js';
import { HUE_FULL_CIRCLE } from '../constants.js';

interface TipPoints {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  p1: Point, p2: Point, p3: Point,
  hueOffset: number,
  layer: TriangleLayerDef,
  base: BaseHsl,
  config: TrichronoConfig,
): void {
  drawColorTriangle(
    ctx, p1, p2, p3,
    (base.h + hueOffset) % HUE_FULL_CIRCLE, base.s, base.l * layer.lightnessMultiplier,
    layer.fillAlpha, layer.borderAlpha,
    config.triangles.glowPasses, config.hsl,
  );
}

function drawLayerGroup(
  ctx: CanvasRenderingContext2D,
  layers: readonly TriangleLayerDef[],
  trios: readonly [Point, Point, Point][],
  hueStep: number,
  base: BaseHsl,
  config: TrichronoConfig,
): void {
  for (const layer of layers) {
    if (!layer.visible) continue;
    for (let i = 0; i < trios.length; i++) {
      const trio = trios[i];
      if (!trio) continue;
      drawLayer(ctx, trio[0], trio[1], trio[2], layer.hueOffset + hueStep * i, layer, base, config);
    }
  }
}

export function drawTriangleLayers(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  tips: TipPoints,
  base: BaseHsl,
  config: TrichronoConfig,
): void {
  const tc = config.triangles;
  const step = tc.hueStep;

  ctx.save();
  ctx.globalCompositeOperation = tc.compositeOp;

  drawLayerGroup(ctx, tc.sectorLayers, [
    [verts.A, verts.B, tips.hTip],
    [verts.B, verts.C, tips.mTip],
    [verts.C, verts.A, tips.sTip],
  ], step, base, config);

  drawLayerGroup(ctx, tc.crossLayers, [
    [verts.A, tips.mTip, tips.sTip],
    [verts.B, tips.hTip, tips.sTip],
    [verts.C, tips.hTip, tips.mTip],
  ], step, base, config);

  drawLayerGroup(ctx, tc.wedgeLayers, [
    [verts.A, tips.hTip, tips.sTip],
    [verts.B, tips.hTip, tips.mTip],
    [verts.C, tips.mTip, tips.sTip],
  ], step, base, config);

  const pl = tc.primaryLayer;
  if (pl.visible) {
    drawColorTriangle(
      ctx, tips.hTip, tips.mTip, tips.sTip,
      base.h, config.hsl.brightSat, base.l * pl.lightnessMultiplier,
      pl.fillAlpha, pl.borderAlpha,
      tc.glowPasses, config.hsl,
    );
  }

  ctx.restore();
}
