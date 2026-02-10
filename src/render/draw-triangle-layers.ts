import type { Point, TriangleVertices, TrichronoConfig } from '../types/index.js';
import type { BaseHsl } from '../color/compute-base-hsl.js';
import { drawColorTriangle } from './draw-color-triangle.js';

interface TipPoints {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  p1: Point, p2: Point, p3: Point,
  hueOffset: number,
  litMul: number,
  fillAlpha: number,
  borderAlpha: number,
  base: BaseHsl,
  config: TrichronoConfig,
): void {
  drawColorTriangle(
    ctx, p1, p2, p3,
    (base.h + hueOffset) % 360, base.s, base.l * litMul,
    fillAlpha, borderAlpha,
    config.triangles.glowPasses, config.hsl,
  );
}

export function drawTriangleLayers(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  tips: TipPoints,
  base: BaseHsl,
  config: TrichronoConfig,
): void {
  const tc = config.triangles;

  ctx.save();
  ctx.globalCompositeOperation = tc.compositeOp;

  for (const layer of tc.sectorLayers) {
    drawLayer(ctx, verts.A, verts.B, tips.hTip, layer.hueOffset + 0, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
    drawLayer(ctx, verts.B, verts.C, tips.mTip, layer.hueOffset + 60, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
    drawLayer(ctx, verts.C, verts.A, tips.sTip, layer.hueOffset + 120, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
  }

  for (const layer of tc.crossLayers) {
    drawLayer(ctx, verts.A, tips.mTip, tips.sTip, layer.hueOffset + 0, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
    drawLayer(ctx, verts.B, tips.hTip, tips.sTip, layer.hueOffset + 60, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
    drawLayer(ctx, verts.C, tips.hTip, tips.mTip, layer.hueOffset + 120, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
  }

  for (const layer of tc.wedgeLayers) {
    drawLayer(ctx, verts.A, tips.hTip, tips.sTip, layer.hueOffset + 0, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
    drawLayer(ctx, verts.B, tips.hTip, tips.mTip, layer.hueOffset + 60, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
    drawLayer(ctx, verts.C, tips.mTip, tips.sTip, layer.hueOffset + 120, layer.lightnessMultiplier, layer.fillAlpha, layer.borderAlpha, base, config);
  }

  const pl = tc.primaryLayer;
  drawColorTriangle(
    ctx, tips.hTip, tips.mTip, tips.sTip,
    base.h, 100, base.l * pl.lightnessMultiplier,
    pl.fillAlpha, pl.borderAlpha,
    tc.glowPasses, config.hsl,
  );

  ctx.restore();
}
