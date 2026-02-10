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

  const bind = (key: string, opts?: Record<string, unknown>): void => {
    folder.addBinding(dt, key, opts).on('change', (ev) => {
      (mut.digitalTime as Record<string, unknown>)[key] = ev.value;
      onChange();
    });
  };

  bind('visible');
  bind('showSeconds');
  bind('color');
  bind('alpha', { min: 0, max: 1, step: 0.01 });
  bind('xOffsetRatio', { min: -1, max: 1, step: 0.01 });
  bind('yOffsetRatio', { min: -1, max: 2, step: 0.01 });
  bind('fontSizeRatio', { min: 0.02, max: 0.3, step: 0.005 });
  bind('fontSizeMin', { min: 8, max: 48, step: 1 });
  bind('fontWeight', { min: 100, max: 900, step: 100 });
  bind('shadowBlur', { min: 0, max: 40, step: 1 });
  bind('shadowColor');
}
