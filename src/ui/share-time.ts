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

function positionHitArea(el: HTMLElement, config: TrichronoConfig): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dt = config.digitalTime;
  const size = Math.min(w, h) * config.geometry.sizeRatio;
  const fontSize = Math.max(dt.fontSizeMin, size * dt.fontSizeRatio);
  const clockY = h / 2 + size * dt.yOffsetRatio;
  const shareY = clockY + fontSize;

  el.style.left = String(w / 2) + 'px';
  el.style.top = String(shareY - fontSize / 2) + 'px';
  el.style.width = String(fontSize * 12) + 'px';
  el.style.height = String(Math.max(44, fontSize * 1.5)) + 'px';
}

export function createShareLink(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
): HTMLElement {
  const hitArea = document.createElement('div');
  hitArea.style.cssText = [
    'position:fixed',
    'transform:translateX(-50%)',
    'cursor:pointer',
    'z-index:100',
  ].join(';');

  positionHitArea(hitArea, config);
  window.addEventListener('resize', () => { positionHitArea(hitArea, config); }, { passive: true });

  hitArea.addEventListener('click', () => {
    void shareImage(canvas, config);
  });
  document.body.appendChild(hitArea);
  return hitArea;
}
