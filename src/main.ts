import type { CanvasState, TrichronoConfig } from './types/index.js';
import { createConfig, loadConfig, saveConfig } from './config/index.js';
import { setupCanvas, computeLayout, applyLayout } from './canvas/index.js';
import { createLoop } from './animation/index.js';
import { createPanel, setupKeybindings } from './ui/index.js';

const { canvas, ctx } = setupCanvas('c');
const config: TrichronoConfig = createConfig(loadConfig());
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
  handleResize();
}

window.addEventListener('resize', handleResize, { passive: true });
applyLayout(canvas, ctx, state);

const panel = createPanel(config, handleConfigChange);
setupKeybindings(panel);

const loop = createLoop(ctx, () => state, () => config);
loop.start();
