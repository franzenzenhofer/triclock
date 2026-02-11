import type { CanvasState, TimeValues, TrichronoConfig } from './types/index.js';
import { createConfig, loadHashConfig, loadHashMode, loadHashParams, updateHash } from './config/index.js';
import { asMutable } from './ui/mutate-config.js';
import { setupCanvas, computeLayout, applyLayout, MIN_DIGITAL_GAP } from './canvas/index.js';
import type { LayoutInput } from './canvas/index.js';
import { getCurrentTime } from './time/get-current-time.js';
import { createLoop } from './animation/index.js';
import { TOGGLE_PANEL_KEY } from './constants.js';
import {
  createPanel, setupKeybindings, createConfigToggleLink,
  createShareLink, createModeSelector, applyDisplayMode,
  createFullscreenToggle, createMeetTimePicker, createAnyTimeLink,
  shareMeetImage, createInstallButton, startOnboarding,
} from './ui/index.js';
import { dumpState } from './debug/dump-state.js';

const { canvas, ctx } = setupCanvas('c');
const hashMode = loadHashMode();
const hashOverrides = loadHashConfig();
const config: TrichronoConfig = createConfig(hashOverrides);
const hashParams = loadHashParams();

let timeOverride: TimeValues | null = hashParams.time;

if (!hashParams.plasma) {
  const mut = asMutable(config);
  mut.triangles.plasma = { ...config.triangles.plasma, enabled: false };
}

const hasHash = !!hashMode || !!hashOverrides;
const needsOnboarding = !hasHash;

if (hashMode) {
  applyDisplayMode(config, hashMode);
} else if (!hashOverrides) {
  applyDisplayMode(config, 'pure');
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
  handleResize();
  modeSelector.updateHighlight();
  syncTriangles();
  panel.refresh();
  updateHash(config);
}

let cancelOnboarding: (() => void) | null = null;

function endOnboardingMode(): void {
  modeSelector.setOnboarding(false);
  modeSelector.updateHighlight();
  updateHash(config);
}

function cancelOnboardingIfActive(): void {
  if (cancelOnboarding) {
    cancelOnboarding();
    cancelOnboarding = null;
    endOnboardingMode();
  }
}

// Explicit user action: mode selector click → sync (which updates hash).
function handleUserConfigChange(): void {
  cancelOnboardingIfActive();
  syncConfigUI();
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

(window as unknown as Record<string, unknown>).__triclockDebug = (): void => { dumpState(getTime(), config); };

function digitalTimeHitTest(clientX: number, clientY: number): boolean {
  const dt = config.digitalTime;
  const { cx, cy, size } = state;
  const fontSize = Math.max(dt.fontSizeMin, size * dt.fontSizeRatio);
  const x = cx + size * dt.xOffsetRatio;
  const triBottom = cy + size * config.geometry.botY;
  const y = Math.max(cy + size * dt.yOffsetRatio, triBottom + MIN_DIGITAL_GAP);
  const halfW = fontSize * 2.5;
  const halfH = fontSize * 0.7;
  return Math.abs(clientX - x) < halfW && Math.abs(clientY - y) < halfH;
}

function handleDigitalTimeToggle(clientX: number, clientY: number): void {
  if (!digitalTimeHitTest(clientX, clientY)) return;
  const mut = asMutable(config);
  mut.digitalTime.visible = !config.digitalTime.visible;
  syncConfigUI();
}

canvas.addEventListener('touchend', (e) => {
  const t = e.changedTouches[0];
  if (!t) return;
  if (digitalTimeHitTest(t.clientX, t.clientY)) {
    e.preventDefault();
    handleDigitalTimeToggle(t.clientX, t.clientY);
  }
});
canvas.addEventListener('click', (e) => {
  handleDigitalTimeToggle(e.clientX, e.clientY);
});

const loop = createLoop(ctx, () => state, () => config, getTime);
loop.start();
