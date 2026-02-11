import type { TrichronoConfig } from '../types/index.js';

const NS = 'http://www.w3.org/2000/svg';

function svgBase(): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  return svg;
}

function createExpandSvg(): SVGSVGElement {
  const svg = svgBase();
  const lines = [
    'M15 3h6v6', 'M9 21H3v-6',
    'M21 3l-7 7', 'M3 21l7-7',
  ];
  for (const d of lines) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  }
  return svg;
}

function createShrinkSvg(): SVGSVGElement {
  const svg = svgBase();
  const lines = [
    'M4 14h6v6', 'M20 10h-6V4',
    'M14 10l7-7', 'M3 21l7-7',
  ];
  for (const d of lines) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  }
  return svg;
}

function isFullscreen(): boolean {
  return document.fullscreenElement !== null;
}

export function createFullscreenToggle(config: TrichronoConfig): HTMLElement {
  const btn = document.createElement('div');
  btn.style.cssText = [
    'position:fixed',
    'bottom:16px',
    'right:50px',
    'cursor:pointer',
    'color:' + config.digitalTime.color,
    'opacity:0.25',
    'z-index:100',
    'user-select:none',
    'line-height:0',
    'padding:8px',
    'transition:opacity 0.25s ease',
  ].join(';');

  function updateIcon(): void {
    btn.replaceChildren(isFullscreen() ? createShrinkSvg() : createExpandSvg());
  }

  updateIcon();

  btn.addEventListener('mouseenter', () => { btn.style.opacity = '0.5'; });
  btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.25'; });
  btn.addEventListener('click', () => {
    if (isFullscreen()) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', updateIcon);
  document.body.appendChild(btn);
  return btn;
}
