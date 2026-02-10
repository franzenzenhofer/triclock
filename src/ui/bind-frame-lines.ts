import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindFrameLines(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.frameLines };
  const mut = asMutable(config);

  folder.addBinding(params, 'width', { min: 0.5, max: 5, step: 0.5 }).on('change', (ev) => {
    mut.frameLines.width = ev.value as number;
    onChange();
  });
  folder.addBinding(params, 'alpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.frameLines.alpha = ev.value as number;
    onChange();
  });
}
