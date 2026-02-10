import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindColors(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.colors };
  const mut = asMutable(config);
  const keys = ['background', 'overlay', 'frame', 'hours', 'minutes', 'seconds', 'inactive', 'text'] as const;

  for (const key of keys) {
    folder.addBinding(params, key).on('change', (ev) => {
      mut.colors[key] = ev.value;
      onChange();
    });
  }
}
