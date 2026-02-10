import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindDigitalTime(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const dt: Record<string, unknown> = { ...config.digitalTime };
  const mut = asMutable(config);

  folder.addBinding(dt, 'visible').on('change', (ev) => {
    mut.digitalTime.visible = ev.value;
    onChange();
  });
  folder.addBinding(dt, 'alpha', { min: 0, max: 1, step: 0.01 }).on('change', (ev) => {
    mut.digitalTime.alpha = ev.value;
    onChange();
  });
  folder.addBinding(dt, 'yOffsetRatio', { min: -1, max: 1, step: 0.01 }).on('change', (ev) => {
    mut.digitalTime.yOffsetRatio = ev.value;
    onChange();
  });
  folder.addBinding(dt, 'fontSizeRatio', { min: 0.02, max: 0.2, step: 0.005 }).on('change', (ev) => {
    mut.digitalTime.fontSizeRatio = ev.value;
    onChange();
  });
}
