import type { TrichronoConfig } from '../types/index.js';

export interface OverlayLayout {
  readonly clockX: number;
  readonly clockY: number;
  readonly clockFontSize: number;
  readonly shareLinkX: number;
  readonly shareLinkY: number;
  readonly shareFontSize: number;
}

export function computeOverlayLayout(
  w: number,
  h: number,
  config: TrichronoConfig,
): OverlayLayout {
  const size = Math.min(w, h) * config.geometry.sizeRatio;
  const cy = h / 2;
  const dt = config.digitalTime;

  const clockFontSize = Math.max(dt.fontSizeMin, size * dt.fontSizeRatio);
  const clockX = w / 2 + size * dt.xOffsetRatio;
  const clockY = cy + size * dt.yOffsetRatio;

  const shareFontSize = Math.max(16, clockFontSize);
  const shareGap = clockFontSize * 0.5 + shareFontSize * 0.5 + 4;
  const rawShareY = clockY + shareGap;
  const maxShareY = h - shareFontSize - 20;
  const shareLinkY = Math.min(rawShareY, maxShareY);

  return {
    clockX,
    clockY,
    clockFontSize,
    shareLinkX: w / 2,
    shareLinkY,
    shareFontSize,
  };
}
