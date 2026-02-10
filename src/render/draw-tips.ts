import type { Point, TrichronoConfig } from '../types/index.js';
import { drawGlowCircle } from './draw-glow-circle.js';

interface TipPoints {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

export function drawTips(
  ctx: CanvasRenderingContext2D,
  tips: TipPoints,
  size: number,
  config: TrichronoConfig,
): void {
  const tc = config.tips;
  const entries: readonly [Point, string, typeof tc.hours][] = [
    [tips.hTip, config.colors.hours, tc.hours],
    [tips.mTip, config.colors.minutes, tc.minutes],
    [tips.sTip, config.colors.seconds, tc.seconds],
  ];

  for (const [point, color, tipCfg] of entries) {
    drawGlowCircle(
      ctx, point, tipCfg.radius, color,
      size * tipCfg.glowRadiusRatio,
      tc.gradientStops, tc.innerRadiusRatio, tc.innerAlpha,
    );
  }
}
