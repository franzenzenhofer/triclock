import type { TrichronoConfig } from '../types/index.js';
import { asMutable } from './mutate-config.js';

export type DisplayModeName = 'prism' | 'pure' | 'flux';

interface LayerVisibility {
  readonly wedge: boolean;
  readonly primary: boolean;
  readonly cross: boolean;
}

interface DisplayMode {
  readonly name: DisplayModeName;
  readonly label: string;
  readonly layers: LayerVisibility;
}

export const DISPLAY_MODES: readonly DisplayMode[] = [
  { name: 'prism', label: 'PRISM', layers: { wedge: true, primary: true, cross: false } },
  { name: 'pure', label: 'PURE', layers: { wedge: false, primary: true, cross: false } },
  { name: 'flux', label: 'FLUX', layers: { wedge: true, primary: true, cross: true } },
] as const;

function layersMatch(config: TrichronoConfig, layers: LayerVisibility): boolean {
  const w = config.triangles.wedgeLayers[0]?.visible ?? false;
  const p = config.triangles.primaryLayer.visible;
  const c = config.triangles.crossLayers[0]?.visible ?? false;
  return w === layers.wedge && p === layers.primary && c === layers.cross;
}

export function detectActiveMode(config: TrichronoConfig): DisplayModeName | null {
  for (const mode of DISPLAY_MODES) {
    if (layersMatch(config, mode.layers)) return mode.name;
  }
  return null;
}

export function applyDisplayMode(config: TrichronoConfig, name: DisplayModeName): void {
  const mode = DISPLAY_MODES.find((m) => m.name === name);
  if (!mode) return;
  const mut = asMutable(config);
  const wedge = config.triangles.wedgeLayers[0];
  const cross = config.triangles.crossLayers[0];
  if (wedge) mut.triangles.wedgeLayers = [{ ...wedge, visible: mode.layers.wedge }];
  mut.triangles.primaryLayer = { ...config.triangles.primaryLayer, visible: mode.layers.primary };
  if (cross) mut.triangles.crossLayers = [{ ...cross, visible: mode.layers.cross }];
}

