import type { CanvasState } from '../types/index.js';

export const MIN_DIGITAL_GAP = 50;

export interface LayoutInput {
  readonly w: number;
  readonly h: number;
  readonly dpr: number;
  readonly sizeRatio: number;
  readonly botY: number;
  readonly digitalYRatio: number;
  readonly topInset: number;
}

export function computeLayout(input: LayoutInput): CanvasState {
  const { w, h, dpr, sizeRatio, botY, digitalYRatio, topInset } = input;
  const size = Math.min(w, h) * sizeRatio;
  const bottomExtent = Math.max(size * digitalYRatio, size * botY + MIN_DIGITAL_GAP);
  const cy = (topInset + h + size - bottomExtent) / 2;
  return { W: w, H: h, cx: w / 2, cy, size, dpr };
}
