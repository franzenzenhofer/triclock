import type { CanvasState } from '../types/index.js';

const TOP_RESERVE = 120;
const BOTTOM_RESERVE = 50;

export function computeLayout(w: number, h: number, dpr: number, sizeRatio: number): CanvasState {
  const availableCy = (TOP_RESERVE + h - BOTTOM_RESERVE) / 2;
  return {
    W: w,
    H: h,
    cx: w / 2,
    cy: Math.max(h / 2, availableCy),
    size: Math.min(w, h) * sizeRatio,
    dpr,
  };
}
