import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindHsl(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.hsl };
  const mut = asMutable(config);
  const entries: readonly [keyof typeof config.hsl, number, number, number][] = [
    ['satBase', 0, 100, 1],
    ['satRange', 0, 50, 1],
    ['litBase', 10, 90, 1],
    ['litAmplitude', 0, 50, 1],
    ['brightSat', 0, 100, 1],
    ['brightLitBoost', 0, 60, 1],
    ['brightLitMax', 50, 100, 1],
  ];

  for (const [key, min, max, step] of entries) {
    folder.addBinding(params, key, { min, max, step }).on('change', (ev) => {
      mut.hsl[key] = ev.value as number;
      onChange();
    });
  }
}
