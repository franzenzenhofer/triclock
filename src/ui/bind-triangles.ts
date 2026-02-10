import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindTriangles(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const pl: Record<string, unknown> = { ...config.triangles.primaryLayer };
  const mut = asMutable(config);

  const primary = folder.addFolder({ title: 'Primary Layer' });
  primary.addBinding(pl, 'fillAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, fillAlpha: ev.value };
    onChange();
  });
  primary.addBinding(pl, 'borderAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, borderAlpha: ev.value };
    onChange();
  });
  primary.addBinding(pl, 'lightnessMultiplier', { min: 0.5, max: 2, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, lightnessMultiplier: ev.value };
    onChange();
  });
}
