import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

const SOURCE_OPTIONS = { hours: 'hours', minutes: 'minutes', seconds: 'seconds' };

export function bindHsl(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.hsl };
  const mut = asMutable(config);

  const sources: readonly (keyof Pick<typeof config.hsl, 'hueSource' | 'satSource' | 'litSource'>)[] = [
    'hueSource', 'satSource', 'litSource',
  ];
  for (const key of sources) {
    folder.addBinding(params, key, { options: SOURCE_OPTIONS }).on('change', (ev) => {
      (mut.hsl as Record<string, unknown>)[key] = ev.value;
      onChange();
    });
  }

  const sliders: readonly [keyof typeof config.hsl, number, number, number][] = [
    ['satBase', 0, 100, 1],
    ['satRange', 0, 50, 1],
    ['litBase', 10, 90, 1],
    ['litAmplitude', 0, 50, 1],
    ['brightSat', 0, 100, 1],
    ['brightLitBoost', 0, 60, 1],
    ['brightLitMax', 50, 100, 1],
  ];

  for (const [key, min, max, step] of sliders) {
    folder.addBinding(params, key, { min, max, step }).on('change', (ev) => {
      (mut.hsl as Record<string, unknown>)[key] = ev.value;
      onChange();
    });
  }
}
