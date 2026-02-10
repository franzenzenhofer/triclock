import type { Pane } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { togglePanel } from './toggle-panel.js';

export function createConfigToggleLink(
  pane: Pane,
  config: TrichronoConfig,
): HTMLElement {
  const link = document.createElement('div');
  link.textContent = 'Config';
  link.style.cssText = [
    'position:fixed',
    'bottom:8px',
    'right:12px',
    'cursor:pointer',
    'font:400 11px sans-serif',
    'color:' + config.digitalTime.color,
    'opacity:' + String(config.digitalTime.alpha),
    'z-index:10',
    'user-select:none',
  ].join(';');

  link.addEventListener('click', () => { togglePanel(pane); });
  document.body.appendChild(link);
  return link;
}
