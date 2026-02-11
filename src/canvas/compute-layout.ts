import type { CanvasState } from '../types/index.js';

const MAX_OFFSET = 35;
const OFFSET_START_H = 500;
const OFFSET_FULL_H = 850;

export function computeLayout(w: number, h: number, dpr: number, sizeRatio: number): CanvasState {
  const t = Math.max(0, Math.min(1, (h - OFFSET_START_H) / (OFFSET_FULL_H - OFFSET_START_H)));
  const offset = MAX_OFFSET * t;
  return {
    W: w,
    H: h,
    cx: w / 2,
    cy: h / 2 + offset,
    size: Math.min(w, h) * sizeRatio,
    dpr,
  };
}
