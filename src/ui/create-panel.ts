import { Pane } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from '../config/defaults.js';
import { bindColors } from './bind-colors.js';
import { bindGeometry } from './bind-geometry.js';
import { bindHsl } from './bind-hsl.js';
import { bindScales } from './bind-scales.js';
import { bindTriangles } from './bind-triangles.js';
import { bindGlow } from './bind-glow.js';
import { bindDigitalTime } from './bind-digital-time.js';
import { bindEdgeMapping } from './bind-edge-mapping.js';

export function createPanel(
  config: TrichronoConfig,
  onChange: () => void,
): Pane {
  const pane = new Pane({ title: 'TRICHRONO Config' });
  pane.element.style.display = 'none';

  const tabPages = pane.addTab({ pages: [
    { title: 'Visual' },
    { title: 'Geometry' },
    { title: 'Glow & Layers' },
  ] });

  const [visual, geometry, glowLayers] = tabPages.pages;
  if (!visual || !geometry || !glowLayers) throw new Error('Tab pages missing');

  bindColors(visual.addFolder({ title: 'Colors' }), config, onChange);
  bindHsl(visual.addFolder({ title: 'HSL Dynamics' }), config, onChange);
  bindDigitalTime(visual.addFolder({ title: 'Digital Time' }), config, onChange);

  bindGeometry(geometry.addFolder({ title: 'Triangle Shape' }), config, onChange);
  bindEdgeMapping(geometry.addFolder({ title: 'Edge Mapping' }), config, onChange);
  bindScales(geometry.addFolder({ title: 'Scale Ticks' }), config, onChange);

  bindGlow(glowLayers.addFolder({ title: 'Edge Progress' }), config, onChange);
  bindTriangles(glowLayers.addFolder({ title: 'Triangle Layers' }), config, onChange);

  pane.addButton({ title: 'Reset to Defaults' }).on('click', () => {
    Object.assign(config, JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    pane.refresh();
    onChange();
  });

  pane.addButton({ title: 'Export JSON' }).on('click', () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trichrono-config.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  return pane;
}
