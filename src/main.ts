import type { CanvasState, TrichronoConfig } from './types/index.js';
import { createConfig, loadHashConfig, saveConfig, updateHash } from './config/index.js';
import { setupCanvas, computeLayout, applyLayout } from './canvas/index.js';
import { createLoop } from './animation/index.js';
import { createPanel, setupKeybindings, createConfigToggleLink, createShareLink } from './ui/index.js';

const { canvas, ctx } = setupCanvas('c');
const config: TrichronoConfig = createConfig(loadHashConfig());
let state: CanvasState = computeLayout(
  window.innerWidth, window.innerHeight,
  window.devicePixelRatio || 1,
  config.geometry.sizeRatio,
);

function handleResize(): void {
  state = computeLayout(
    window.innerWidth, window.innerHeight,
    window.devicePixelRatio || 1,
    config.geometry.sizeRatio,
  );
  applyLayout(canvas, ctx, state);
}

function handleConfigChange(): void {
  saveConfig(config);
  updateHash(config);
  handleResize();
}

window.addEventListener('resize', handleResize, { passive: true });
applyLayout(canvas, ctx, state);

const panel = createPanel(config, handleConfigChange);
setupKeybindings(panel);
createConfigToggleLink(panel, config);
createShareLink(canvas, config);

const loop = createLoop(ctx, () => state, () => config);
loop.start();
