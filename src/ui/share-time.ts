import type { TrichronoConfig } from '../types/index.js';
import { getCurrentTime } from '../time/get-current-time.js';
import { formatDigital } from '../time/format-digital.js';
import { configToHash } from '../config/hash.js';

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

  const blob = await canvasToBlob(canvas);
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

function positionBelowClock(link: HTMLElement, config: TrichronoConfig): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const size = Math.min(w, h) * config.geometry.sizeRatio;
  const cy = h / 2;
  const clockY = cy + size * config.digitalTime.yOffsetRatio;
  const clockFontSize = Math.max(config.digitalTime.fontSizeMin, size * config.digitalTime.fontSizeRatio);
  const top = clockY + clockFontSize * 0.8;
  link.style.top = String(top) + 'px';
  link.style.left = String(w / 2) + 'px';
}

export function createShareLink(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
): HTMLElement {
  const link = document.createElement('div');
  link.textContent = 'share your time';
  link.style.cssText = [
    'position:fixed',
    'transform:translateX(-50%)',
    'cursor:pointer',
    'font:400 11px sans-serif',
    'color:' + config.digitalTime.color,
    'opacity:' + String(config.digitalTime.alpha),
    'z-index:10',
    'user-select:none',
  ].join(';');

  positionBelowClock(link, config);
  window.addEventListener('resize', () => { positionBelowClock(link, config); }, { passive: true });

  link.addEventListener('click', () => {
    void shareImage(canvas, config);
  });
  document.body.appendChild(link);
  return link;
}
