import type { Point, TrichronoConfig } from '../types/index.js';
import { lerp } from '../math/lerp.js';
import { normalVector } from '../math/normal-vector.js';
import { drawLine } from './draw-line.js';
import { drawText } from './draw-text.js';

export function drawScale(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  count: number,
  color: string,
  activeCount: number,
  majorEvery: number,
  size: number,
  config: TrichronoConfig,
): void {
  const n = normalVector(from, to);
  const sc = config.scales;
  const offset = sc.tickNormalOffset;

  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const p = lerp(from, to, t);
    const isMajor = i % majorEvery === 0;
    const isActive = i <= activeCount;

    const tickLen = isMajor ? size * sc.majorTickRatio : size * sc.minorTickRatio;
    const inner = { x: p.x + n.x * offset, y: p.y + n.y * offset };
    const outer = { x: p.x + n.x * (offset + tickLen), y: p.y + n.y * (offset + tickLen) };

    drawLine(
      ctx, inner, outer,
      isActive ? color : config.colors.inactive,
      isMajor ? sc.majorWidth : sc.minorWidth,
      isActive ? sc.activeAlpha : sc.inactiveAlpha,
    );

    if (isMajor && i > 0 && i < count) {
      const lp = {
        x: p.x + n.x * (tickLen + sc.labelOffsetPx),
        y: p.y + n.y * (tickLen + sc.labelOffsetPx),
      };
      const fontSize = Math.max(sc.labelSizeMin, size * sc.labelSizeRatio);
      drawText(
        ctx, String(i), lp.x, lp.y,
        String(fontSize) + 'px ' + sc.labelFontFamily,
        isActive ? color : config.colors.inactive,
        isActive ? sc.labelActiveAlpha : sc.labelInactiveAlpha,
      );
    }
  }
}
