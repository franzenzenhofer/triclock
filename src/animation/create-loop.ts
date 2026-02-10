import type { CanvasState, TrichronoConfig } from '../types/index.js';
import { getCurrentTime } from '../time/get-current-time.js';
import { renderFrame } from '../render/render-frame.js';

export interface AnimationLoop {
  start: () => void;
  stop: () => void;
}

export function createLoop(
  ctx: CanvasRenderingContext2D,
  getState: () => CanvasState,
  getConfig: () => TrichronoConfig,
): AnimationLoop {
  let rafId = 0;

  function tick(): void {
    renderFrame(ctx, getState(), getCurrentTime(), getConfig());
    rafId = requestAnimationFrame(tick);
  }

  return {
    start(): void {
      rafId = requestAnimationFrame(tick);
    },
    stop(): void {
      cancelAnimationFrame(rafId);
    },
  };
}
