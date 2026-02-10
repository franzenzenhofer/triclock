import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';
import { bindLayerGroup } from './bind-layer-group.js';

export function bindTriangles(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const mut = asMutable(config);

  const plParams: Record<string, unknown> = { ...config.triangles.primaryLayer };
  const primary = folder.addFolder({ title: 'Primary' });
  primary.addBinding(plParams, 'visible').on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, visible: ev.value as boolean };
    onChange();
  });
  primary.addBinding(plParams, 'fillAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, fillAlpha: ev.value as number };
    onChange();
  });
  primary.addBinding(plParams, 'borderAlpha', { min: 0, max: 1, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, borderAlpha: ev.value as number };
    onChange();
  });
  primary.addBinding(plParams, 'lightnessMultiplier', { min: 0.5, max: 2, step: 0.05 }).on('change', (ev) => {
    mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, lightnessMultiplier: ev.value as number };
    onChange();
  });

  bindLayerGroup(folder, 'Sector Layers', () => config.triangles.sectorLayers, (layers) => {
    mut.triangles.sectorLayers = layers;
  }, onChange);
  bindLayerGroup(folder, 'Cross Layers', () => config.triangles.crossLayers, (layers) => {
    mut.triangles.crossLayers = layers;
  }, onChange);
  bindLayerGroup(folder, 'Wedge Layers', () => config.triangles.wedgeLayers, (layers) => {
    mut.triangles.wedgeLayers = layers;
  }, onChange);

  const misc: Record<string, unknown> = {
    hueStep: config.triangles.hueStep,
    shadowBlur: config.triangles.shadowBlur,
    shadowAlpha: config.triangles.shadowAlpha,
    lighterHueOffset: config.triangles.lighterHueOffset,
    lighterLitBoost: config.triangles.lighterLitBoost,
    darkerHueOffset: config.triangles.darkerHueOffset,
    darkerLitReduction: config.triangles.darkerLitReduction,
    gradientRadiusRatio: config.triangles.gradientRadiusRatio,
    lightGradientAlpha: config.triangles.lightGradientAlpha,
    darkGradientAlpha: config.triangles.darkGradientAlpha,
    borderLineWidth: config.triangles.borderLineWidth,
    shadowLineWidth: config.triangles.shadowLineWidth,
  };

  const numBind = (key: string, min: number, max: number, step: number): void => {
    folder.addBinding(misc, key, { min, max, step }).on('change', (ev) => {
      (mut.triangles as Record<string, unknown>)[key] = ev.value;
      onChange();
    });
  };

  numBind('hueStep', 0, 180, 5);
  numBind('shadowBlur', 0, 100, 1);
  numBind('shadowAlpha', 0, 1, 0.05);
  numBind('lighterHueOffset', 0, 90, 5);
  numBind('lighterLitBoost', 0, 30, 1);
  numBind('darkerHueOffset', 0, 90, 5);
  numBind('darkerLitReduction', 0, 30, 1);
  numBind('gradientRadiusRatio', 0.1, 2, 0.05);
  numBind('lightGradientAlpha', 0, 1, 0.05);
  numBind('darkGradientAlpha', 0, 1, 0.05);
  numBind('borderLineWidth', 0.5, 8, 0.5);
  numBind('shadowLineWidth', 0.5, 8, 0.5);
}
