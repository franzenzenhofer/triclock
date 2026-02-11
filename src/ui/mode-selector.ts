import type { TrichronoConfig } from '../types/index.js';
import { UI_FONT } from '../constants.js';
import {
  DISPLAY_MODES,
  detectActiveMode,
  applyDisplayMode,
  saveMode,
} from './display-modes.js';

export interface ModeSelector {
  readonly element: HTMLElement;
  readonly updateHighlight: () => void;
}

export function createModeSelector(
  config: TrichronoConfig,
  onChange: () => void,
): ModeSelector {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'position:fixed',
    'top:clamp(8px, 1.5vh, 16px)',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:100',
    'user-select:none',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'gap:clamp(2px, 0.5vh, 5px)',
  ].join(';');

  const header = document.createElement('div');
  header.textContent = 'TRICLOCK';
  header.style.cssText = [
    'font-family:' + UI_FONT,
    'font-size:clamp(11px, 1.5vw, 16px)',
    'font-weight:600',
    'letter-spacing:0.35em',
    'color:#e0e0e8',
    'opacity:0.4',
  ].join(';');
  const nav = document.createElement('nav');
  nav.style.cssText = [
    'display:flex',
    'align-items:center',
    'gap:0',
  ].join(';');
  wrapper.appendChild(nav);
  wrapper.appendChild(header);

  const buttons: HTMLButtonElement[] = [];

  DISPLAY_MODES.forEach((mode, i) => {
    if (i > 0) {
      const dot = document.createElement('span');
      dot.textContent = '\u00B7';
      dot.style.cssText = [
        'color:#e0e0e8',
        'opacity:0.12',
        'font-size:12px',
        'padding:0 8px',
        'pointer-events:none',
      ].join(';');
      nav.appendChild(dot);
    }

    const btn = document.createElement('button');
    btn.textContent = mode.label;
    btn.style.cssText = [
      'background:none',
      'border:none',
      'cursor:pointer',
      'padding:2px 6px',
      'font-family:' + UI_FONT,
      'font-size:clamp(8px, 1vw, 11px)',
      'font-weight:400',
      'text-transform:uppercase',
      'letter-spacing:0.18em',
      'color:#e0e0e8',
      'opacity:0.18',
      'transition:opacity 0.25s ease',
    ].join(';');

    btn.addEventListener('mouseenter', () => {
      if (btn.style.fontWeight !== '400' || btn.style.opacity === '0.18') btn.style.opacity = '0.3';
    });
    btn.addEventListener('mouseleave', () => {
      highlight();
    });
    btn.addEventListener('click', () => {
      applyDisplayMode(config, mode.name);
      saveMode(mode.name);
      onChange();
      btn.style.opacity = '0.5';
      setTimeout(() => { highlight(); }, 120);
    });

    buttons.push(btn);
    nav.appendChild(btn);
  });

  function highlight(): void {
    const active = detectActiveMode(config);
    DISPLAY_MODES.forEach((mode, i) => {
      const btn = buttons[i];
      if (!btn) return;
      const isActive = mode.name === active;
      btn.style.fontWeight = '400';
      btn.style.opacity = isActive ? '0.35' : '0.18';
    });
  }

  highlight();
  document.body.appendChild(wrapper);

  return { element: wrapper, updateHighlight: highlight };
}
