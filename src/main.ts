import type { CanvasState, TimeValues, TrichronoConfig } from './types/index.js';
import { createConfig, loadHashConfig, loadHashMode, loadHashParams, updateHash } from './config/index.js';
import { asMutable } from './ui/mutate-config.js';
import { setupCanvas, computeLayout, applyLayout } from './canvas/index.js';
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
// Skip the mode-cycling intro inside the native iOS WKWebView wrapper.
// Native users expect the app to land directly on its default mode
// without flicker. The web visit at triclock.franzai.com still gets it.
const isNativeApp = window.location.protocol === 'app:';
const needsOnboarding = !hasHash && !isNativeApp;

// Digital time is visible by default. Tap to toggle off.

if (hashMode) {
  applyDisplayMode(config, hashMode);
} else if (!hashOverrides) {
  applyDisplayMode(config, 'flux');
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
  'bottom:max(16px, env(safe-area-inset-bottom))',
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
dot.style.cssText = 'color:#e5e5eb;opacity:0.6;user-select:none;font-size:16px';
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

function toggleDigitalTime(): void {
  const mut = asMutable(config);
  mut.digitalTime.visible = !config.digitalTime.visible;
  syncConfigUI();
}

// Double-tap / double-click on the canvas toggles the digital time.
// Single taps do nothing - the user might just be admiring the clock.
// `click` fires for both touch taps and mouse clicks and never
// double-fires per gesture, so the two-clicks-in-window detection
// works without listening to multiple event types.
const DOUBLE_TAP_MS = 350;
let lastTapAt = 0;
canvas.addEventListener('click', () => {
  const now = performance.now();
  if (now - lastTapAt < DOUBLE_TAP_MS) {
    toggleDigitalTime();
    lastTapAt = 0;
    return;
  }
  lastTapAt = now;
});

const loop = createLoop(ctx, () => state, () => config, getTime);
loop.start();

// Fade the boot overlay out after the first frame has painted.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const overlay = document.getElementById('boot-fade');
    if (!overlay) return;
    overlay.classList.add('is-ready');
    overlay.addEventListener('transitionend', () => { overlay.remove(); }, { once: true });
  });
});
