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

  const tipKeys = ['hours', 'minutes', 'seconds'] as const;
  for (const key of tipKeys) {
    const tipParams: Record<string, unknown> = { ...config.tips[key] };
    const sub = folder.addFolder({ title: key.charAt(0).toUpperCase() + key.slice(1) + ' Tip' });
    sub.addBinding(tipParams, 'radius', { min: 1, max: 15, step: 0.5 }).on('change', (ev) => {
      mut.tips[key] = { ...config.tips[key], radius: ev.value as number };
      onChange();
    });
    sub.addBinding(tipParams, 'glowRadiusRatio', { min: 0, max: 0.3, step: 0.01 }).on('change', (ev) => {
      mut.tips[key] = { ...config.tips[key], glowRadiusRatio: ev.value as number };
      onChange();
    });
  }
}
