import type { TimeValues, TrichronoConfig } from '../types/index.js';
import { formatDigital } from '../time/format-digital.js';
import { MIN_DIGITAL_GAP } from '../canvas/compute-layout.js';

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
  const x = cx + size * dt.xOffsetRatio;
  const triBottom = cy + size * config.geometry.botY;
  const y = Math.max(cy + size * dt.yOffsetRatio, triBottom + MIN_DIGITAL_GAP);
  const text = formatDigital(time, dt.showSeconds);

  ctx.save();
  ctx.globalAlpha = dt.alpha;
  ctx.fillStyle = dt.color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = dt.shadowColor;
  ctx.shadowBlur = dt.shadowBlur;
  ctx.fillText(text, x, y);
  ctx.restore();
}
