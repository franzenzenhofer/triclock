import type { CanvasState, TrichronoConfig } from '../types/index.js';

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
  config: TrichronoConfig,
): void {
  ctx.fillStyle = config.colors.background;
  ctx.fillRect(0, 0, state.W, state.H);

  const grad = ctx.createRadialGradient(
    state.cx, state.cy, 0,
    state.cx, state.cy, state.size * config.background.overlayRadiusRatio,
  );
  grad.addColorStop(0, config.colors.overlay);
  grad.addColorStop(1, config.colors.background);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, state.W, state.H);
}
