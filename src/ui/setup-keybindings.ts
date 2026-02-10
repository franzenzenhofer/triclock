import type { Pane } from 'tweakpane';
import { TOGGLE_PANEL_KEY } from '../constants.js';
import { togglePanel } from './toggle-panel.js';

export function setupKeybindings(pane: Pane): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === TOGGLE_PANEL_KEY) {
      togglePanel(pane);
    }
  });
}
