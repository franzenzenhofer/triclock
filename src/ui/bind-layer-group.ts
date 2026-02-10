import type { FolderApi } from 'tweakpane';
import type { TriangleLayerDef } from '../types/index.js';

function updateLayer(
  getLayers: () => readonly TriangleLayerDef[],
  setLayers: (layers: TriangleLayerDef[]) => void,
  idx: number,
  patch: Partial<TriangleLayerDef>,
): void {
  const updated = [...getLayers()];
  const existing = updated[idx];
  if (!existing) return;
  updated[idx] = { ...existing, ...patch };
  setLayers(updated);
}

export function bindLayerGroup(
  folder: FolderApi,
  title: string,
  getLayers: () => readonly TriangleLayerDef[],
  setLayers: (layers: TriangleLayerDef[]) => void,
  onChange: () => void,
): void {
  const group = folder.addFolder({ title });
  const layers = getLayers();
  for (let idx = 0; idx < layers.length; idx++) {
    const layer = layers[idx];
    if (!layer) continue;
    const params: Record<string, unknown> = { ...layer };

    group.addBinding(params, 'visible').on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { visible: ev.value as boolean });
      onChange();
    });
    group.addBinding(params, 'fillAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { fillAlpha: ev.value as number });
      onChange();
    });
    group.addBinding(params, 'borderAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { borderAlpha: ev.value as number });
      onChange();
    });
    group.addBinding(params, 'lightnessMultiplier', { min: 0.5, max: 2, step: 0.05 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { lightnessMultiplier: ev.value as number });
      onChange();
    });
    group.addBinding(params, 'hueOffset', { min: 0, max: 360, step: 5 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { hueOffset: ev.value as number });
      onChange();
    });
  }
}
