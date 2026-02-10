import type { CanvasState } from '../types/index.js';

export function computeLayout(w: number, h: number, dpr: number, sizeRatio: number): CanvasState {
  return {
    W: w,
    H: h,
    cx: w / 2,
    cy: h / 2,
    size: Math.min(w, h) * sizeRatio,
    dpr,
  };
}
