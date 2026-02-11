import { UI_FONT } from '../constants.js';

export interface DateSelection {
  readonly label: string;
  readonly prefix: string;
}

export interface DateSelector {
  readonly element: HTMLElement;
  readonly getSelection: () => DateSelection;
  readonly reset: () => void;
}

type DateKind = 'today' | 'tomorrow' | 'custom';

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
}

function formatDatePrefix(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return String(y) + m + d;
}

function makeDot(): HTMLElement {
  const s = document.createElement('span');
  s.textContent = '\u00B7';
  s.style.cssText = 'color:#e0e0e8;opacity:0.12;font-size:12px;padding:0 8px;pointer-events:none';
  return s;
}

export function createDateSelector(): DateSelector {
  let kind: DateKind = 'today';
  let customDate: Date | null = null;

  const LABEL_STYLE = [
    'background:none;border:none;cursor:pointer;padding:2px 4px',
    'font-family:' + UI_FONT,
    'font-size:clamp(8px, 1vw, 11px)',
    'text-transform:uppercase;letter-spacing:0.18em',
    'color:#e0e0e8;user-select:none',
    'transition:opacity 0.25s ease',
  ].join(';');

  const todayBtn = document.createElement('button');
  todayBtn.textContent = 'TODAY';
  todayBtn.style.cssText = LABEL_STYLE;

  const tomorrowBtn = document.createElement('button');
  tomorrowBtn.textContent = 'TOMORROW';
  tomorrowBtn.style.cssText = LABEL_STYLE;

  // Wrap button + hidden date input so showPicker() has a rendered element
  const pickWrap = document.createElement('div');
  pickWrap.style.cssText = 'position:relative;display:inline-block';

  const pickBtn = document.createElement('button');
  pickBtn.textContent = 'PICK DATE';
  pickBtn.style.cssText = LABEL_STYLE;

  const input = document.createElement('input');
  input.type = 'date';
  input.style.cssText = 'position:absolute;inset:0;opacity:0;pointer-events:none;width:100%;height:100%';
  input.min = new Date().toISOString().slice(0, 10);
  pickWrap.append(pickBtn, input);

  // Button click opens native date picker on both desktop and mobile
  pickBtn.addEventListener('click', () => {
    try { input.showPicker(); } catch { input.click(); }
  });

  const buttons = [todayBtn, tomorrowBtn, pickBtn];

  function highlight(): void {
    const active = kind === 'today' ? 0 : kind === 'tomorrow' ? 1 : 2;
    buttons.forEach((btn, i) => {
      btn.style.opacity = i === active ? '0.5' : '0.25';
      btn.style.borderBottom = i === active
        ? '1px solid rgba(224,224,232,0.3)'
        : '1px solid transparent';
    });
  }

  function selectKind(k: DateKind): void {
    kind = k;
    if (k !== 'custom') pickBtn.textContent = 'PICK DATE';
    highlight();
  }

  todayBtn.addEventListener('click', () => { selectKind('today'); });
  tomorrowBtn.addEventListener('click', () => { selectKind('tomorrow'); });

  input.addEventListener('change', () => {
    if (!input.value) return;
    const parts = input.value.split('-');
    customDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    pickBtn.textContent = formatDateLabel(customDate);
    selectKind('custom');
  });

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => { if (btn.style.opacity !== '0.5') btn.style.opacity = '0.35'; });
    btn.addEventListener('mouseleave', () => { highlight(); });
  });

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;justify-content:center;position:relative';
  row.append(todayBtn, makeDot(), tomorrowBtn, makeDot(), pickWrap);
  highlight();

  return {
    element: row,
    getSelection(): DateSelection {
      if (kind === 'today') return { label: 'today', prefix: 'today' };
      if (kind === 'tomorrow') return { label: 'tomorrow', prefix: 'tomorrow' };
      const d = customDate ?? new Date();
      return { label: formatDateLabel(d), prefix: formatDatePrefix(d) };
    },
    reset(): void {
      kind = 'today';
      customDate = null;
      pickBtn.textContent = 'PICK DATE';
      input.min = new Date().toISOString().slice(0, 10);
      highlight();
    },
  };
}
