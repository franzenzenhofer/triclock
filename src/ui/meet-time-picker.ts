import type { TimeValues } from '../types/index.js';
import { UI_FONT } from '../constants.js';

export interface MeetTimePicker {
  readonly element: HTMLElement;
  readonly show: () => void;
  readonly hide: () => void;
}

const INPUT_CSS = [
  'background:transparent',
  'border:none',
  'border-bottom:1px solid rgba(224,224,232,0.25)',
  'color:#e0e0e8',
  'font-family:' + UI_FONT,
  'font-size:clamp(18px, 4vw, 28px)',
  'text-align:center',
  'width:2.5ch',
  'outline:none',
  'padding:0 2px',
].join(';');

function clampInput(input: HTMLInputElement, max: number): number {
  const v = Math.max(0, Math.min(max, parseInt(input.value, 10) || 0));
  input.value = String(v).padStart(2, '0');
  return v;
}

function readTime(hh: HTMLInputElement, mm: HTMLInputElement): TimeValues {
  return { hours: clampInput(hh, 23), minutes: clampInput(mm, 59), seconds: 0, ms: 0 };
}

function makeInput(max: number, initial: number): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = String(max);
  input.inputMode = 'numeric';
  input.value = String(initial).padStart(2, '0');
  input.style.cssText = INPUT_CSS;
  return input;
}

function makeButton(label: string, opacity: string): HTMLDivElement {
  const btn = document.createElement('div');
  btn.textContent = label;
  btn.setAttribute('role', 'button');
  btn.style.cssText = [
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
  const hoverOp = String(Math.min(parseFloat(opacity) + 0.25, 0.9));
  btn.addEventListener('mouseenter', () => { btn.style.opacity = hoverOp; });
  btn.addEventListener('mouseleave', () => { btn.style.opacity = opacity; });
  return btn;
}

export function createMeetTimePicker(
  onTimeChange: (time: TimeValues) => void,
  onShare: (time: TimeValues) => void,
  onBack: () => void,
): MeetTimePicker {
  const now = new Date();
  const hh = makeInput(23, now.getHours());
  const mm = makeInput(59, now.getMinutes());

  const sep = document.createElement('span');
  sep.textContent = ':';
  sep.style.cssText = [
    'font-family:' + UI_FONT,
    'font-size:clamp(18px, 4vw, 28px)',
    'color:#e0e0e8',
    'opacity:0.4',
    'user-select:none',
  ].join(';');

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:2px';
  row.append(hh, sep, mm);

  const meetBtn = makeButton("LET'S MEET \u2192", '0.5');
  const backBtn = makeButton('\u2190 BACK TO NOW', '0.35');

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
    'gap:8px',
    'background:rgba(11,11,18,0.92)',
    'padding:10px 20px 8px',
    'border-radius:10px',
  ].join(';');
  container.append(row, meetBtn, backBtn);

  function fireChange(): void {
    onTimeChange(readTime(hh, mm));
  }

  hh.addEventListener('input', fireChange);
  mm.addEventListener('input', fireChange);

  meetBtn.addEventListener('click', () => { onShare(readTime(hh, mm)); });
  backBtn.addEventListener('click', () => {
    onBack();
    container.style.display = 'none';
  });

  return {
    element: container,
    show(): void {
      const d = new Date();
      hh.value = String(d.getHours()).padStart(2, '0');
      mm.value = String(d.getMinutes()).padStart(2, '0');
      container.style.display = 'flex';
      fireChange();
    },
    hide(): void {
      container.style.display = 'none';
    },
  };
}

export function createAnyTimeLink(onClick: () => void): HTMLElement {
  const link = makeButton('SHARE ANY TIME', '0.35');
  link.addEventListener('click', onClick);
  return link;
}
