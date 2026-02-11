import type { DisplayModeName } from './display-modes.js';

const SEQUENCE: readonly DisplayModeName[] = ['prism', 'pure', 'flux', 'pure'];
const FADE_MS = 500;
const HOLD_MS = 1000;

export function startOnboarding(
  canvas: HTMLCanvasElement,
  applyMode: (name: DisplayModeName) => void,
  onComplete: () => void,
): () => void {
  let cancelled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  canvas.style.transition = `opacity ${String(FADE_MS)}ms ease`;
  let t = HOLD_MS;

  for (let i = 0; i < SEQUENCE.length; i++) {
    const mode = SEQUENCE[i] ?? 'pure';

    timers.push(setTimeout(() => {
      if (cancelled) return;
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
