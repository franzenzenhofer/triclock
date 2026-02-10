import type { Pane } from 'tweakpane';

export function togglePanel(pane: Pane): void {
  const el = pane.element;
  const isHidden = el.style.display === 'none';
  el.style.display = isHidden ? '' : 'none';
}
