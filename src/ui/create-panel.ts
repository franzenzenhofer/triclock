import { Pane } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { STORAGE_KEY, EXPORT_FILENAME } from '../constants.js';
import { configToHash } from '../config/hash.js';
import { bindColors } from './bind-colors.js';
import { bindGeometry } from './bind-geometry.js';
import { bindFrameLines } from './bind-frame-lines.js';
import { bindHsl } from './bind-hsl.js';
import { bindScales } from './bind-scales.js';
import { bindTriangles } from './bind-triangles.js';
import { bindGlow } from './bind-glow.js';
import { bindDigitalTime } from './bind-digital-time.js';
import { bindEdgeMapping } from './bind-edge-mapping.js';
import { bindTips } from './bind-tips.js';
import { bindEdgeLabels } from './bind-edge-labels.js';
import { bindBackground } from './bind-background.js';

function applyPanelStyles(el: HTMLElement): void {
  const isMobile = window.innerWidth < 600;
  el.style.maxHeight = isMobile ? '80vh' : '90vh';
  el.style.overflowY = 'auto';
  el.style.setProperty('-webkit-overflow-scrolling', 'touch');
  if (isMobile) {
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.width = '100vw';
    el.style.maxWidth = '100vw';
    el.style.zIndex = '1000';
  }
}

export function createPanel(
  config: TrichronoConfig,
  onChange: () => void,
): Pane {
  const pane = new Pane({ title: 'TRICLOCK v' + __APP_VERSION__ });
  pane.element.style.display = 'none';
  applyPanelStyles(pane.element);

  const tabPages = pane.addTab({ pages: [
    { title: 'Visual' },
    { title: 'Shape' },
    { title: 'Effects' },
  ] });

  const [visual, geometry, glowLayers] = tabPages.pages;
  if (!visual || !geometry || !glowLayers) throw new Error('Tab pages missing');

  bindColors(visual.addFolder({ title: 'Colors' }), config, onChange);
  bindHsl(visual.addFolder({ title: 'HSL Dynamics' }), config, onChange);
  bindDigitalTime(visual.addFolder({ title: 'Digital Time' }), config, onChange);
  bindEdgeLabels(visual.addFolder({ title: 'Edge Labels' }), config, onChange);
  bindBackground(visual.addFolder({ title: 'Background' }), config, onChange);

  bindGeometry(geometry.addFolder({ title: 'Triangle Shape' }), config, onChange);
  bindFrameLines(geometry.addFolder({ title: 'Frame Lines' }), config, onChange);
  bindEdgeMapping(geometry.addFolder({ title: 'Edge Mapping' }), config, onChange);
  bindScales(geometry.addFolder({ title: 'Scale Ticks' }), config, onChange);

  bindGlow(glowLayers.addFolder({ title: 'Edge Progress' }), config, onChange);
  bindTriangles(glowLayers.addFolder({ title: 'Triangle Layers' }), config, onChange);
  bindTips(glowLayers.addFolder({ title: 'Tips' }), config, onChange);

  pane.addButton({ title: 'Copy Share Link' }).on('click', () => {
    const hash = configToHash(config);
    const url = window.location.origin + window.location.pathname + (hash ? '#' + hash : '');
    void navigator.clipboard.writeText(url);
  });

  pane.addButton({ title: 'Reset to Defaults' }).on('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState(null, '', window.location.pathname);
    window.location.reload();
  });

  pane.addButton({ title: 'Export JSON' }).on('click', () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = EXPORT_FILENAME;
    a.click();
    URL.revokeObjectURL(url);
  });

  return pane;
}
