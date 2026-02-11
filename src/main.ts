import type { CanvasState, TimeValues, TrichronoConfig } from './types/index.js';
import { createConfig, loadHashConfig, loadHashMode, saveConfig, updateHash } from './config/index.js';
import { setupCanvas, computeLayout, applyLayout } from './canvas/index.js';
import type { LayoutInput } from './canvas/index.js';
import { getCurrentTime } from './time/get-current-time.js';
import { createLoop } from './animation/index.js';
import { TOGGLE_PANEL_KEY } from './constants.js';
import {
  createPanel, setupKeybindings, createConfigToggleLink,
  createShareLink, createModeSelector, applyDisplayMode, loadSavedMode,
  createFullscreenToggle, createMeetTimePicker, createAnyTimeLink,
  shareMeetImage, createInstallButton, startOnboarding,
} from './ui/index.js';

const { canvas, ctx } = setupCanvas('c');
const hashMode = loadHashMode();
const hashOverrides = loadHashConfig();
const config: TrichronoConfig = createConfig(hashOverrides);

const hasHash = !!hashMode || !!hashOverrides;
const savedMode = loadSavedMode();
const needsOnboarding = !hasHash && !savedMode;

if (hashMode) {
  applyDisplayMode(config, hashMode);
} else if (!hashOverrides) {
  if (needsOnboarding) {
    applyDisplayMode(config, 'pure');
  } else if (savedMode) {
    applyDisplayMode(config, savedMode);
  }
}

const modeSelector = createModeSelector(config, handleUserConfigChange);

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

// Internal config sync — NEVER touches hash. Used by panel (Tweakpane).
const { pane: panel, syncTriangles } = createPanel(config, syncConfigUI);

function syncConfigUI(): void {
  saveConfig(config);
  handleResize();
  modeSelector.updateHighlight();
  syncTriangles();
  panel.refresh();
}

let cancelOnboarding: (() => void) | null = null;

function endOnboardingMode(): void {
  modeSelector.setOnboarding(false);
  modeSelector.updateHighlight();
}

function cancelOnboardingIfActive(): void {
  if (cancelOnboarding) {
    cancelOnboarding();
    cancelOnboarding = null;
    endOnboardingMode();
  }
}

// Explicit user action: mode selector click → enable hash + sync + update hash.
function handleUserConfigChange(): void {
  cancelOnboardingIfActive();
  syncConfigUI();
  updateHash(config);
}

window.addEventListener('resize', handleResize, { passive: true });
applyLayout(canvas, ctx, state);

setupKeybindings(panel);
createFullscreenToggle(config);
const configToggle = createConfigToggleLink(panel, config);
createInstallButton(config);

// Cancel onboarding when user opens config panel (gear click or 'd' key)
configToggle.addEventListener('click', cancelOnboardingIfActive);
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === TOGGLE_PANEL_KEY) cancelOnboardingIfActive();
});

// Time override for "Share Any Time" feature
let timeOverride: TimeValues | null = null;
const getTime = (): TimeValues => timeOverride ?? getCurrentTime();

// Share links wrapper (horizontal layout)
const shareWrap = document.createElement('div');
shareWrap.style.cssText = [
  'position:fixed',
  'bottom:16px',
  'left:50%',
  'transform:translateX(-50%)',
  'z-index:100',
  'display:flex',
  'align-items:center',
  'gap:8px',
].join(';');

const shareLink = createShareLink(canvas, config);
const dot = document.createElement('span');
dot.textContent = '\u00b7';
dot.style.cssText = 'color:#e0e0e8;opacity:0.25;user-select:none;font-size:12px';
const anyTimeLink = createAnyTimeLink(() => {
  shareWrap.style.display = 'none';
  meetPicker.show();
});
shareWrap.append(shareLink, dot, anyTimeLink);
document.body.appendChild(shareWrap);

// Meet time picker
const meetPicker = createMeetTimePicker(
  (time) => { timeOverride = time; },
  (time, date) => { void shareMeetImage(canvas, config, time, date); },
  () => { timeOverride = null; shareWrap.style.display = 'flex'; },
);
document.body.appendChild(meetPicker.element);

// Onboarding: fade through modes for first-time visitors
// Pure → Prism → Pure → Flux → Pure (~7s total)
if (needsOnboarding) {
  modeSelector.setOnboarding(true);
  const rawCancel = startOnboarding(
    canvas,
    (name) => {
      applyDisplayMode(config, name);
      handleResize();
      modeSelector.updateHighlight();
      syncTriangles();
      panel.refresh();
    },
    endOnboardingMode,
  );
  cancelOnboarding = rawCancel;
}

const loop = createLoop(ctx, () => state, () => config, getTime);
loop.start();
