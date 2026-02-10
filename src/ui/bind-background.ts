import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindBackground(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.background };
  const mut = asMutable(config);

  folder.addBinding(params, 'overlayRadiusRatio', { min: 0.5, max: 4, step: 0.1 }).on('change', (ev) => {
    mut.background.overlayRadiusRatio = ev.value as number;
    onChange();
  });
}
