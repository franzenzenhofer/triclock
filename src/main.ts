import type { CanvasState, TimeValues, TrichronoConfig } from './types/index.js';
import { createConfig, loadHashConfig, saveConfig, updateHash } from './config/index.js';
import { setupCanvas, computeLayout, applyLayout } from './canvas/index.js';
import type { LayoutInput } from './canvas/index.js';
import { getCurrentTime } from './time/get-current-time.js';
import { createLoop } from './animation/index.js';
import {
  createPanel, setupKeybindings, createConfigToggleLink,
  createShareLink, createModeSelector, applyDisplayMode, loadSavedMode,
  createFullscreenToggle, createMeetTimePicker, createAnyTimeLink,
  shareMeetImage,
} from './ui/index.js';

const { canvas, ctx } = setupCanvas('c');
const hashOverrides = loadHashConfig();
const config: TrichronoConfig = createConfig(hashOverrides);

if (!hashOverrides) {
  const savedMode = loadSavedMode();
  if (savedMode) applyDisplayMode(config, savedMode);
}

const modeSelector = createModeSelector(config, handleConfigChange);

function measureTopInset(): number {
  return modeSelector.element.getBoundingClientRect().bottom;
}

function buildLayoutInput(): LayoutInput {
  return {
    w: window.innerWidth,
    h: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
    sizeRatio: config.geometry.sizeRatio,
    botY: config.geometry.botY,
    digitalYRatio: config.digitalTime.yOffsetRatio,
    topInset: measureTopInset(),
  };
}

let state: CanvasState = computeLayout(buildLayoutInput());

function handleResize(): void {
  state = computeLayout(buildLayoutInput());
  applyLayout(canvas, ctx, state);
}

const { pane: panel, syncTriangles } = createPanel(config, handleConfigChange);

function handleConfigChange(): void {
  saveConfig(config);
  updateHash(config);
  handleResize();
  modeSelector.updateHighlight();
  syncTriangles();
  panel.refresh();
}

window.addEventListener('resize', handleResize, { passive: true });
applyLayout(canvas, ctx, state);

setupKeybindings(panel);
createFullscreenToggle(config);
createConfigToggleLink(panel, config);

// Time override for "Share Any Time" feature
let timeOverride: TimeValues | null = null;
const getTime = (): TimeValues => timeOverride ?? getCurrentTime();

// Share links wrapper
const shareWrap = document.createElement('div');
shareWrap.style.cssText = [
  'position:fixed',
  'bottom:16px',
  'left:50%',
  'transform:translateX(-50%)',
  'z-index:100',
  'display:flex',
  'flex-direction:column',
  'align-items:center',
  'gap:4px',
].join(';');

const shareLink = createShareLink(canvas, config);
const anyTimeLink = createAnyTimeLink(() => {
  shareWrap.style.display = 'none';
  meetPicker.show();
});
shareWrap.append(shareLink, anyTimeLink);
document.body.appendChild(shareWrap);

// Meet time picker
const meetPicker = createMeetTimePicker(
  (time) => { timeOverride = time; },
  (time) => { void shareMeetImage(canvas, config, time); },
  () => { timeOverride = null; shareWrap.style.display = 'flex'; },
);
document.body.appendChild(meetPicker.element);

const loop = createLoop(ctx, () => state, () => config, getTime);
loop.start();
