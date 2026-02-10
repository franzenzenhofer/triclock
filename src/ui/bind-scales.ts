import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig, ScalesConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

type NumericScaleKey = {
  [K in keyof ScalesConfig]: ScalesConfig[K] extends number ? K : never;
}[keyof ScalesConfig];

export function bindScales(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.scales };
  const mut = asMutable(config);
  const entries: readonly [NumericScaleKey, number, number, number][] = [
    ['majorTickRatio', 0.01, 0.1, 0.001],
    ['minorTickRatio', 0.005, 0.05, 0.001],
    ['majorWidth', 0.5, 5, 0.5],
    ['minorWidth', 0.5, 3, 0.5],
    ['activeAlpha', 0, 1, 0.05],
    ['inactiveAlpha', 0, 1, 0.05],
    ['labelOffsetPx', 4, 40, 1],
    ['labelSizeMin', 6, 24, 1],
    ['tickNormalOffset', 0, 10, 0.5],
    ['labelSizeRatio', 0.01, 0.1, 0.005],
    ['labelActiveAlpha', 0, 1, 0.05],
    ['labelInactiveAlpha', 0, 1, 0.05],
    ['hoursDivisions', 4, 48, 1],
    ['minutesDivisions', 4, 120, 1],
    ['secondsDivisions', 4, 120, 1],
    ['hoursMajorEvery', 1, 24, 1],
    ['minutesMajorEvery', 1, 30, 1],
    ['secondsMajorEvery', 1, 30, 1],
  ];

  for (const [key, min, max, step] of entries) {
    folder.addBinding(params, key, { min, max, step }).on('change', (ev) => {
      mut.scales[key] = ev.value as number;
      onChange();
    });
  }
}
