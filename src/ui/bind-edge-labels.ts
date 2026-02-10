import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindEdgeLabels(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const el: Record<string, unknown> = { ...config.edgeLabels };
  const mut = asMutable(config);

  const bind = (key: string, opts?: Record<string, unknown>): void => {
    folder.addBinding(el, key, opts).on('change', (ev) => {
      (mut.edgeLabels as Record<string, unknown>)[key] = ev.value;
      onChange();
    });
  };

  bind('visible');
  bind('alpha', { min: 0, max: 1, step: 0.01 });
  bind('offsetRatio', { min: 0, max: 0.3, step: 0.005 });
  bind('fontSizeRatio', { min: 0.01, max: 0.1, step: 0.002 });
  bind('fontWeight', { min: 100, max: 900, step: 100 });
}
