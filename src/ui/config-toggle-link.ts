import type { Pane } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { togglePanel } from './toggle-panel.js';

function createGearSvg(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '3');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z');
  svg.appendChild(circle);
  svg.appendChild(path);
  return svg;
}

export function createConfigToggleLink(
  pane: Pane,
  config: TrichronoConfig,
): HTMLElement {
  const dt = config.digitalTime;
  const link = document.createElement('div');
  const svg = createGearSvg();
  link.appendChild(svg);
  link.style.cssText = [
    'position:fixed',
    'bottom:10px',
    'right:14px',
    'cursor:pointer',
    'color:' + dt.color,
    'opacity:' + String(Math.min(dt.alpha * 1.2, 0.2)),
    'z-index:100',
    'user-select:none',
    'line-height:0',
    'min-width:44px',
    'min-height:44px',
    'display:flex',
    'align-items:center',
    'justify-content:center',
  ].join(';');

  link.addEventListener('click', () => { togglePanel(pane); });
  document.body.appendChild(link);
  return link;
}
