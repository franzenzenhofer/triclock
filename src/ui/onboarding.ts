import type { DisplayModeName } from './display-modes.js';

// Show each mode once, then settle on FLUX (the middle button).
// Order matches the mode-selector left-to-right order: PURE, FLUX, PRISM,
// then back to FLUX so the user sees what each layer combination looks like
// before landing on the default.
const SEQUENCE: readonly DisplayModeName[] = ['pure', 'prism', 'flux'];
const FADE_MS = 500;
const HOLD_MS = 1000;

export function startOnboarding(
  canvas: HTMLCanvasElement,
  applyMode: (name: DisplayModeName) => void,
  onComplete: () => void,
  onFirstFade?: () => void,
): () => void {
  let cancelled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  canvas.style.transition = `opacity ${String(FADE_MS)}ms ease`;
  let t = HOLD_MS;

  for (let i = 0; i < SEQUENCE.length; i++) {
    const mode = SEQUENCE[i] ?? 'pure';

    timers.push(setTimeout(() => {
      if (cancelled) return;
      if (i === 0) onFirstFade?.();
      canvas.style.opacity = '0';
    }, t));
    t += FADE_MS;

    timers.push(setTimeout(() => {
      if (cancelled) return;
      applyMode(mode);
      canvas.style.opacity = '1';
    }, t));
    t += HOLD_MS;
  }

  timers.push(setTimeout(() => {
    canvas.style.transition = '';
    onComplete();
  }, t));

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
    canvas.style.opacity = '1';
    canvas.style.transition = '';
  };
}
