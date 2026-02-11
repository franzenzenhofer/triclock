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
    'top:clamp(12px, 2.5vh, 24px)',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:100',
    'user-select:none',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'gap:clamp(6px, 1.2vh, 12px)',
  ].join(';');

  const header = document.createElement('div');
  header.textContent = 'TRICLOCK';
  header.style.cssText = [
    'font-family:' + UI_FONT,
    'font-size:clamp(13px, 1.8vw, 20px)',
    'font-weight:600',
    'letter-spacing:0.4em',
    'color:#e0e0e8',
    'opacity:0.4',
  ].join(';');
  wrapper.appendChild(header);

  const nav = document.createElement('nav');
  nav.style.cssText = [
    'display:flex',
    'align-items:center',
    'gap:0',
  ].join(';');
  wrapper.appendChild(nav);

  const buttons: HTMLButtonElement[] = [];

  DISPLAY_MODES.forEach((mode, i) => {
    if (i > 0) {
      const dot = document.createElement('span');
      dot.textContent = '\u00B7';
      dot.style.cssText = [
        'color:#e0e0e8',
        'opacity:0.12',
        'font-size:14px',
        'padding:0 10px',
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
      'padding:4px 8px',
      'font-family:' + UI_FONT,
      'font-size:clamp(9px, 1.1vw, 12px)',
      'font-weight:400',
      'text-transform:uppercase',
      'letter-spacing:0.18em',
      'color:#e0e0e8',
      'opacity:0.2',
      'transition:opacity 0.25s ease',
    ].join(';');

    btn.addEventListener('mouseenter', () => {
      if (btn.style.fontWeight !== '600') btn.style.opacity = '0.5';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = btn.style.fontWeight === '600' ? '0.6' : '0.2';
    });
    btn.addEventListener('click', () => {
      applyDisplayMode(config, mode.name);
      saveMode(mode.name);
      onChange();
      btn.style.opacity = '1';
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
      btn.style.fontWeight = isActive ? '600' : '400';
      btn.style.opacity = isActive ? '0.6' : '0.2';
    });
  }

  highlight();
  document.body.appendChild(wrapper);

  return { element: wrapper, updateHighlight: highlight };
}
