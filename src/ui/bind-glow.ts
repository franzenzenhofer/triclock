import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindGlow(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const ep: Record<string, unknown> = { ...config.edgeProgress };
  const mut = asMutable(config);

  folder.addBinding(ep, 'coreWidth', { min: 0.5, max: 10, step: 0.5 }).on('change', (ev) => {
    mut.edgeProgress.coreWidth = ev.value;
    onChange();
  });
  folder.addBinding(ep, 'coreTailLength', { min: 0, max: 0.2, step: 0.01 }).on('change', (ev) => {
    mut.edgeProgress.coreTailLength = ev.value;
    onChange();
  });
}
