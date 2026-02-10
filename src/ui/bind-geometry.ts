import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindGeometry(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.geometry };
  const mut = asMutable(config);

  folder.addBinding(params, 'sizeRatio', { min: 0.1, max: 0.8, step: 0.01 }).on('change', (ev) => {
    mut.geometry.sizeRatio = ev.value as number;
    onChange();
  });
  folder.addBinding(params, 'botY', { min: 0.1, max: 1.5, step: 0.01 }).on('change', (ev) => {
    mut.geometry.botY = ev.value as number;
    onChange();
  });
  folder.addBinding(params, 'halfBase', { min: 0.1, max: 2.0, step: 0.01 }).on('change', (ev) => {
    mut.geometry.halfBase = ev.value as number;
    onChange();
  });
}
