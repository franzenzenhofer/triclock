import type { TimeValues, TrichronoConfig } from '../types/index.js';
import { formatDigital } from '../time/format-digital.js';
import { drawText } from './draw-text.js';

export function drawDigitalTime(
  ctx: CanvasRenderingContext2D,
  time: TimeValues,
  cx: number,
  cy: number,
  size: number,
  config: TrichronoConfig,
): void {
  const dt = config.digitalTime;
  if (!dt.visible) return;

  const fontSize = Math.max(dt.fontSizeMin, size * dt.fontSizeRatio);
  const font = String(dt.fontWeight) + ' ' + String(fontSize) + 'px ' + dt.fontFamily;
  const y = cy + size * dt.yOffsetRatio;

  drawText(ctx, formatDigital(time), cx, y, font, config.colors.text, dt.alpha);
}
