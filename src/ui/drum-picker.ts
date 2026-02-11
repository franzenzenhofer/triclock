import { UI_FONT } from '../constants.js';

export interface DrumPickerColumn {
  readonly element: HTMLElement;
  readonly getValue: () => number;
  readonly setValue: (value: number) => void;
}

const ITEM_H = 36;
const VISIBLE = 5;
const HALF = Math.floor(VISIBLE / 2);
const REPEATS = 5;
const CENTER = 2;
const MASK = 'linear-gradient(to bottom,transparent,rgba(0,0,0,.3) 15%,#000 35%,#000 65%,rgba(0,0,0,.3) 85%,transparent)';

const ITEM_STYLE = [
  'height:' + String(ITEM_H) + 'px',
  'display:flex;align-items:center;justify-content:center',
  'font-family:' + UI_FONT,
  'font-size:22px;color:#e0e0e8;user-select:none',
].join(';');

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function createDrumColumn(
  min: number,
  max: number,
  initial: number,
  onChange: () => void,
): DrumPickerColumn {
  const count = max - min + 1;
  const total = count * REPEATS;
  let selected = CENTER * count + Math.max(0, Math.min(count - 1, initial - min));
  let offset = -selected * ITEM_H;

  const container = document.createElement('div');
  container.style.cssText = [
    'position:relative',
    'height:' + String(VISIBLE * ITEM_H) + 'px',
    'width:48px',
    'overflow:hidden',
    'cursor:ns-resize',
    '-webkit-mask-image:' + MASK,
    'mask-image:' + MASK,
  ].join(';');

  const track = document.createElement('div');
  track.style.cssText = [
    'position:absolute;top:0;left:0;right:0',
    'padding-top:' + String(HALF * ITEM_H) + 'px',
    'padding-bottom:' + String(HALF * ITEM_H) + 'px',
    'transition:transform .15s ease-out',
  ].join(';');

  for (let i = 0; i < total; i++) {
    const item = document.createElement('div');
    item.textContent = String(min + (i % count)).padStart(2, '0');
    item.style.cssText = ITEM_STYLE;
    item.addEventListener('click', () => { select(i); });
    track.appendChild(item);
  }

  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:absolute',
    'top:' + String(HALF * ITEM_H) + 'px',
    'left:0;right:0',
    'height:' + String(ITEM_H) + 'px',
    'border-top:1px solid rgba(224,224,232,.2)',
    'border-bottom:1px solid rgba(224,224,232,.2)',
    'pointer-events:none',
  ].join(';');
  container.append(track, bar);

  function applyOffset(): void {
    track.style.transform = 'translateY(' + String(offset) + 'px)';
  }

  function recenter(): void {
    const valueIdx = mod(selected, count);
    const center = CENTER * count + valueIdx;
    if (selected === center) return;
    track.style.transition = 'none';
    selected = center;
    offset = -selected * ITEM_H;
    applyOffset();
    void track.offsetHeight;
    track.style.transition = 'transform .15s ease-out';
  }

  function select(idx: number): void {
    selected = mod(idx, total);
    offset = -selected * ITEM_H;
    applyOffset();
    onChange();
  }

  track.addEventListener('transitionend', recenter);

  // Wheel
  let wheelAcc = 0;
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    wheelAcc += e.deltaY;
    const steps = Math.trunc(wheelAcc / 50);
    if (!steps) return;
    wheelAcc -= steps * 50;
    select(selected + steps);
  }, { passive: false });

  // Drag (shared by touch and mouse)
  let dragY = 0;
  let dragBase = 0;

  function startDrag(clientY: number): void {
    track.style.transition = 'none';
    dragY = clientY;
    dragBase = offset;
  }

  function moveDrag(clientY: number): void {
    offset = dragBase + (clientY - dragY);
    applyOffset();
  }

  function endDrag(): void {
    track.style.transition = 'transform .15s ease-out';
    select(Math.round(-offset / ITEM_H));
  }

  container.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    startDrag(touch.clientY);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    e.preventDefault();
    moveDrag(touch.clientY);
  }, { passive: false });

  container.addEventListener('touchend', endDrag);

  let mouseDown = false;
  container.addEventListener('mousedown', (e) => {
    e.preventDefault();
    mouseDown = true;
    startDrag(e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    e.preventDefault();
    moveDrag(e.clientY);
  });

  window.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    endDrag();
  });

  applyOffset();

  return {
    element: container,
    getValue: () => min + mod(selected, count),
    setValue(v: number): void {
      selected = CENTER * count + Math.max(0, Math.min(count - 1, v - min));
      offset = -selected * ITEM_H;
      applyOffset();
    },
  };
}
