import type { Pane } from 'tweakpane';
import { togglePanel } from './toggle-panel.js';

export function setupKeybindings(pane: Pane): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'd' || e.key === 'D') {
      togglePanel(pane);
    }
  });
}
