import type { CanvasState } from '../types/index.js';

export function applyLayout(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
): void {
  canvas.width = Math.floor(state.W * state.dpr);
  canvas.height = Math.floor(state.H * state.dpr);
  canvas.style.width = String(state.W) + 'px';
  canvas.style.height = String(state.H) + 'px';
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}
