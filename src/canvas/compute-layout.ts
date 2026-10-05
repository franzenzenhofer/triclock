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
  /** height kept free at the bottom (the share row), 0 when nothing sits there */
  readonly bottomInset?: number;
}

export function computeLayout(input: LayoutInput): CanvasState {
  const { w, h, dpr, sizeRatio, botY, digitalYRatio, topInset } = input;
  const floor = h - (input.bottomInset ?? 0);
  // the drawing runs from cy - size (top corner) to cy + bottomExtent (the digital time); it must fit
  // between the top inset and the floor, which caps the size when the screen is short (phone landscape)
  const room = floor - topInset;
  const fits = Math.min(room / (1 + digitalYRatio), (room - MIN_DIGITAL_GAP) / (1 + botY));
  const size = Math.max(0, Math.min(Math.min(w, h) * sizeRatio, fits));
  const bottomExtent = Math.max(size * digitalYRatio, size * botY + MIN_DIGITAL_GAP);
  const cy = (topInset + floor + size - bottomExtent) / 2;
  return { W: w, H: h, cx: w / 2, cy, size, dpr };
}
