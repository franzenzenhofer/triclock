import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';
import { bindLayerGroup } from './bind-layer-group.js';

export function bindTriangles(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const mut = asMutable(config);

  const plParams: Record<string, unknown> = { ...config.triangles.primaryLayer };
  const primary = folder.addFolder({ title: 'Primary' });
  primary.addBinding(plParams, 'visible').on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, visible: ev.value as boolean };
    onChange();
  });
  primary.addBinding(plParams, 'fillAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, fillAlpha: ev.value as number };
    onChange();
  });
  primary.addBinding(plParams, 'borderAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, borderAlpha: ev.value as number };
    onChange();
  });
  primary.addBinding(plParams, 'lightnessMultiplier', { min: 0.5, max: 2, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, lightnessMultiplier: ev.value as number };
    onChange();
  });

  bindLayerGroup(folder, 'Sector Layers', () => config.triangles.sectorLayers, (layers) => {
    mut.triangles.sectorLayers = layers;
  }, onChange);
  bindLayerGroup(folder, 'Cross Layers', () => config.triangles.crossLayers, (layers) => {
    mut.triangles.crossLayers = layers;
  }, onChange);
  bindLayerGroup(folder, 'Wedge Layers', () => config.triangles.wedgeLayers, (layers) => {
    mut.triangles.wedgeLayers = layers;
  }, onChange);

  const misc: Record<string, unknown> = { hueStep: config.triangles.hueStep };
  folder.addBinding(misc, 'hueStep', { min: 0, max: 180, step: 5 }).on('change', (ev) => {
    mut.triangles.hueStep = ev.value as number;
    onChange();
  });
}
