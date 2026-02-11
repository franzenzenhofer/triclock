import type { TimeValues } from '../types/index.js';
import type { DateSelection } from './date-selector.js';
import { UI_FONT } from '../constants.js';
import { createDrumColumn } from './drum-picker.js';
import { createDateSelector } from './date-selector.js';
import { formatDigital } from '../time/format-digital.js';

export interface MeetTimePicker {
  readonly element: HTMLElement;
  readonly show: () => void;
  readonly hide: () => void;
}

function makeLink(label: string, opacity: string): HTMLDivElement {
  const el = document.createElement('div');
  el.textContent = label;
  el.setAttribute('role', 'button');
  el.style.cssText = [
    'cursor:pointer',
    'font-family:' + UI_FONT,
    'font-weight:500',
    'font-size:clamp(8px, 1.1vw, 12px)',
    'text-transform:uppercase',
    'letter-spacing:0.12em',
    'color:#e0e0e8',
    'opacity:' + opacity,
    'user-select:none',
    'border-bottom:1px solid rgba(224,224,232,0.15)',
    'padding-bottom:2px',
    'transition:opacity 0.25s ease',
  ].join(';');
  const hover = String(Math.min(parseFloat(opacity) + 0.25, 0.9));
  el.addEventListener('mouseenter', () => { el.style.opacity = hover; });
  el.addEventListener('mouseleave', () => { el.style.opacity = opacity; });
  return el;
}

function makeSep(): HTMLElement {
  const s = document.createElement('span');
  s.textContent = ':';
  s.style.cssText = 'font-family:' + UI_FONT + ';font-size:22px;color:#e0e0e8;opacity:0.4;user-select:none';
  return s;
}

export function createMeetTimePicker(
  onTimeChange: (time: TimeValues) => void,
  onShare: (time: TimeValues, date: DateSelection) => void,
  onBack: () => void,
): MeetTimePicker {
  const now = new Date();
  let expanded = true;
  let justOpened = false;

  function fireChange(): void {
    onTimeChange(readTime());
  }

  const hCol = createDrumColumn(0, 23, now.getHours(), fireChange);
  const mCol = createDrumColumn(0, 59, now.getMinutes(), fireChange);
  const sCol = createDrumColumn(0, 59, now.getSeconds(), fireChange);

  function readTime(): TimeValues {
    return { hours: hCol.getValue(), minutes: mCol.getValue(), seconds: sCol.getValue(), ms: 0 };
  }

  const dateSelector = createDateSelector();

  const drums = document.createElement('div');
  drums.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:4px';
  drums.append(hCol.element, makeSep(), mCol.element, makeSep(), sCol.element);

  const meetBtn = makeLink("LET'S MEET \u2192", '0.5');
  const backBtn = makeLink('\u2190 BACK TO NOW', '0.35');

  // Minimized summary — shows time, tap to expand
  const summary = document.createElement('div');
  summary.style.cssText = [
    'cursor:pointer',
    'font-family:' + UI_FONT,
    'font-size:clamp(12px, 2vw, 18px)',
    'color:#e0e0e8;opacity:0.4',
    'user-select:none;display:none',
    'padding:2px 8px',
  ].join(';');

  function updateSummary(): void {
    summary.textContent = formatDigital(readTime(), false);
  }

  // Full content wrapper for easy show/hide
  const fullContent = document.createElement('div');
  fullContent.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px';
  fullContent.append(dateSelector.element, drums, meetBtn, backBtn);

  function setExpanded(val: boolean): void {
    expanded = val;
    fullContent.style.display = val ? 'flex' : 'none';
    summary.style.display = val ? 'none' : 'block';
    if (!val) updateSummary();
  }

  summary.addEventListener('click', (e) => {
    e.stopPropagation();
    setExpanded(true);
  });

  meetBtn.addEventListener('click', () => { onShare(readTime(), dateSelector.getSelection()); });
  backBtn.addEventListener('click', () => {
    onBack();
    container.style.display = 'none';
  });

  const container = document.createElement('div');
  container.style.cssText = [
    'position:fixed',
    'bottom:12px',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:100',
    'display:none',
    'flex-direction:column',
    'align-items:center',
    'background:rgba(11,11,18,0.7)',
    'padding:10px 20px 8px',
    'border-radius:10px',
  ].join(';');
  container.append(fullContent, summary);

  // Click outside → minimize
  document.addEventListener('click', (e) => {
    if (justOpened) return;
    if (container.style.display === 'none') return;
    if (!expanded) return;
    if (container.contains(e.target as Node)) return;
    setExpanded(false);
  });

  container.addEventListener('click', (e) => { e.stopPropagation(); });

  return {
    element: container,
    show(): void {
      const d = new Date();
      hCol.setValue(d.getHours());
      mCol.setValue(d.getMinutes());
      sCol.setValue(d.getSeconds());
      dateSelector.reset();
      setExpanded(true);
      container.style.display = 'flex';
      justOpened = true;
      requestAnimationFrame(() => { justOpened = false; });
      fireChange();
    },
    hide(): void {
      container.style.display = 'none';
    },
  };
}

export function createAnyTimeLink(onClick: () => void): HTMLElement {
  const link = makeLink('ANY TIME', '0.35');
  link.addEventListener('click', onClick);
  return link;
}
