import type { TrichronoConfig } from '../types/index.js';

const NS = 'http://www.w3.org/2000/svg';

function createDownloadSvg(): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const paths = ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'];
  for (const d of paths) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  }
  return svg;
}

interface BeforeInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>;
}

export function createInstallButton(config: TrichronoConfig): HTMLElement {
  const btn = document.createElement('div');
  btn.appendChild(createDownloadSvg());
  btn.style.cssText = [
    'position:fixed',
    'bottom:16px',
    'right:84px',
    'cursor:pointer',
    'color:' + config.digitalTime.color,
    'opacity:0.25',
    'z-index:100',
    'user-select:none',
    'line-height:0',
    'padding:8px',
    'transition:opacity 0.25s ease',
    'display:none',
  ].join(';');

  btn.addEventListener('mouseenter', () => { btn.style.opacity = '0.5'; });
  btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.25'; });

  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    btn.style.display = '';
  });

  btn.addEventListener('click', () => {
    if (!deferredPrompt) return;
    void deferredPrompt.prompt();
    deferredPrompt = null;
    btn.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    btn.style.display = 'none';
    deferredPrompt = null;
  });

  document.body.appendChild(btn);
  return btn;
}
