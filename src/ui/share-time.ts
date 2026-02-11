import type { TrichronoConfig } from '../types/index.js';
import { getCurrentTime } from '../time/get-current-time.js';
import { formatDigital } from '../time/format-digital.js';
import { configToHash } from '../config/hash.js';
import { computeLayout, applyLayout } from '../canvas/index.js';
import { renderFrame } from '../render/render-frame.js';
import { UI_FONT } from '../constants.js';

const MAX_DIM = 4096;

function renderShareCanvas(
  source: HTMLCanvasElement,
  config: TrichronoConfig,
): HTMLCanvasElement {
  const w = source.clientWidth;
  const h = source.clientHeight;
  const dpr = Math.max(window.devicePixelRatio || 1, 3);
  const rawW = Math.floor(w * dpr);
  const rawH = Math.floor(h * dpr);
  const scale = Math.min(1, MAX_DIM / Math.max(rawW, rawH));
  const finalDpr = dpr * scale;

  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context for share canvas');
  const state = computeLayout(w, h, finalDpr, config.geometry.sizeRatio);
  applyLayout(offscreen, ctx, state);
  renderFrame(ctx, state, getCurrentTime(), config);
  return offscreen;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

function canNativeShare(file: File): boolean {
  try {
    return typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function shareImage(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
): Promise<void> {
  const time = getCurrentTime();
  const timeStr = formatDigital(time, true);
  const hash = configToHash(config);
  const url = window.location.origin + window.location.pathname + (hash ? '#' + hash : '');
  const title = 'My ' + timeStr + ' looks like this';
  const text = title + '\n' + url;
  const filename = 'triclock-' + timeStr.replace(/:/g, '') + '.png';

  const shareCanvas = renderShareCanvas(canvas, config);
  const blob = await canvasToBlob(shareCanvas);
  const file = new File([blob], filename, { type: 'image/png' });

  if (canNativeShare(file)) {
    try {
      await navigator.share({ title, text, files: [file] });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      downloadBlob(blob, filename);
    }
  } else {
    downloadBlob(blob, filename);
  }
}

export function createShareLink(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
): HTMLElement {
  const link = document.createElement('div');
  link.textContent = 'SHARE YOUR TIME';
  link.style.cssText = [
    'position:fixed',
    'bottom:16px',
    'left:50%',
    'transform:translateX(-50%)',
    'cursor:pointer',
    'font-family:' + UI_FONT,
    'font-weight:500',
    'font-size:clamp(8px, 1.1vw, 12px)',
    'text-transform:uppercase',
    'letter-spacing:0.12em',
    'color:#e0e0e8',
    'opacity:0.35',
    'z-index:100',
    'user-select:none',
    'border-bottom:1px solid rgba(224,224,232,0.15)',
    'padding-bottom:2px',
    'transition:opacity 0.25s ease',
  ].join(';');

  link.addEventListener('mouseenter', () => { link.style.opacity = '0.6'; });
  link.addEventListener('mouseleave', () => { link.style.opacity = '0.35'; });
  link.addEventListener('click', () => { void shareImage(canvas, config); });
  document.body.appendChild(link);
  return link;
}
