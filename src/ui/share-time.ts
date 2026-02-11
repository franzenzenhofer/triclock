import type { TrichronoConfig } from '../types/index.js';
import { getCurrentTime } from '../time/get-current-time.js';
import { formatDigital } from '../time/format-digital.js';
import { configToHash } from '../config/hash.js';
import { computeLayout, applyLayout } from '../canvas/index.js';
import type { LayoutInput } from '../canvas/index.js';
import { renderFrame } from '../render/render-frame.js';
import { UI_FONT } from '../constants.js';

const MAX_DIM = 4096;
const CROP_PAD = 0.25;

function renderShareCanvas(
  source: HTMLCanvasElement,
  config: TrichronoConfig,
): HTMLCanvasElement {
  const w = source.clientWidth;
  const h = source.clientHeight;
  const dpr = Math.max(window.devicePixelRatio || 1, 3);
  const rawMax = Math.floor(Math.max(w, h) * dpr);
  const scale = Math.min(1, MAX_DIM / rawMax);
  const finalDpr = dpr * scale;

  const full = document.createElement('canvas');
  const fullCtx = full.getContext('2d');
  if (!fullCtx) throw new Error('Failed to get 2d context for share canvas');
  const layoutInput: LayoutInput = {
    w, h, dpr: finalDpr,
    sizeRatio: config.geometry.sizeRatio,
    botY: config.geometry.botY,
    digitalYRatio: config.digitalTime.yOffsetRatio,
    topInset: 0,
  };
  const state = computeLayout(layoutInput);
  applyLayout(full, fullCtx, state);
  renderFrame(fullCtx, state, getCurrentTime(), config);

  return cropToClockRegion(full, state, config, finalDpr);
}

function cropToClockRegion(
  full: HTMLCanvasElement,
  state: { cx: number; cy: number; size: number },
  config: TrichronoConfig,
  dpr: number,
): HTMLCanvasElement {
  const pad = state.size * CROP_PAD;
  const halfW = state.size * config.geometry.halfBase + pad;
  const top = state.cy - state.size - pad;
  const bot = state.cy + state.size * config.geometry.botY + pad;
  const cropW = halfW * 2;
  const cropH = bot - top;
  const side = Math.max(cropW, cropH);
  const cx = state.cx;
  const cy = (top + bot) / 2;

  const sx = Math.max(0, (cx - side / 2) * dpr);
  const sy = Math.max(0, (cy - side / 2) * dpr);
  const sSize = Math.floor(side * dpr);

  const out = document.createElement('canvas');
  out.width = sSize;
  out.height = sSize;
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context for crop canvas');
  ctx.drawImage(full, sx, sy, sSize, sSize, 0, 0, sSize, sSize);
  return out;
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
