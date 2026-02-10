import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export function bindTips(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.tips };
  const mut = asMutable(config);

  folder.addBinding(params, 'innerColor').on('change', (ev) => {
    mut.tips.innerColor = ev.value as string;
    onChange();
  });
  folder.addBinding(params, 'innerRadiusRatio', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.tips.innerRadiusRatio = ev.value as number;
    onChange();
  });
  folder.addBinding(params, 'innerAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.tips.innerAlpha = ev.value as number;
    onChange();
  });
  folder.addBinding(params, 'vertexRadius', { min: 0, max: 10, step: 0.5 }).on('change', (ev) => {
    mut.tips.vertexRadius = ev.value as number;
    onChange();
  });
  folder.addBinding(params, 'vertexAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.tips.vertexAlpha = ev.value as number;
    onChange();
  });
}
