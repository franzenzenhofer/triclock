import type { FolderApi, BindingApi } from 'tweakpane';
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

interface ParamsEntry {
  readonly params: Record<string, unknown>;
  readonly bindings: BindingApi[];
}

export function bindLayerGroup(
  folder: FolderApi,
  title: string,
  getLayers: () => readonly TriangleLayerDef[],
  setLayers: (layers: TriangleLayerDef[]) => void,
  onChange: () => void,
): () => void {
  const group = folder.addFolder({ title });
  const entries: ParamsEntry[] = [];
  const layers = getLayers();
  for (let idx = 0; idx < layers.length; idx++) {
    const layer = layers[idx];
    if (!layer) continue;
    const params: Record<string, unknown> = { ...layer };
    const bindings: BindingApi[] = [];

    bindings.push(group.addBinding(params, 'visible').on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { visible: ev.value as boolean });
      onChange();
    }));
    bindings.push(group.addBinding(params, 'fillAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { fillAlpha: ev.value as number });
      onChange();
    }));
    bindings.push(group.addBinding(params, 'borderAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { borderAlpha: ev.value as number });
      onChange();
    }));
    bindings.push(group.addBinding(params, 'lightnessMultiplier', { min: 0.5, max: 2, step: 0.05 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { lightnessMultiplier: ev.value as number });
      onChange();
    }));
    bindings.push(group.addBinding(params, 'hueOffset', { min: 0, max: 360, step: 5 }).on('change', (ev) => {
      updateLayer(getLayers, setLayers, idx, { hueOffset: ev.value as number });
      onChange();
    }));

    entries.push({ params, bindings });
  }

  return () => {
    const current = getLayers();
    entries.forEach((entry, i) => {
      const layer = current[i];
      if (!layer) return;
      entry.params.visible = layer.visible;
      entry.params.fillAlpha = layer.fillAlpha;
      entry.params.borderAlpha = layer.borderAlpha;
      entry.params.lightnessMultiplier = layer.lightnessMultiplier;
      entry.params.hueOffset = layer.hueOffset;
      entry.bindings.forEach((b) => { b.refresh(); });
    });
  };
}
