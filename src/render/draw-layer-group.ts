import type { Point, TrichronoConfig, TriangleLayerDef } from '../types/index.js';
import type { BaseHsl } from '../color/compute-base-hsl.js';
import { drawColorTriangle } from './draw-color-triangle.js';
import { HUE_FULL_CIRCLE } from '../constants.js';

export function drawLayerGroup(
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
      const hue = (base.h + layer.hueOffset + hueStep * i) % HUE_FULL_CIRCLE;
      drawColorTriangle(
        ctx, trio[0], trio[1], trio[2],
        hue, base.s, base.l * layer.lightnessMultiplier,
        layer.fillAlpha, layer.borderAlpha,
        config.triangles.glowPasses, config.hsl,
      );
    }
  }
}
