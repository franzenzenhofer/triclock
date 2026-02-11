import type { TrichronoConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './defaults.js';
import { validateConfig } from './schema.js';
import type { PartialConfig } from './schema.js';
import { detectActiveMode, applyDisplayMode } from '../ui/display-modes.js';
import type { DisplayModeName } from '../ui/display-modes.js';

const MODE_NAMES: ReadonlySet<string> = new Set(['prism', 'pure', 'flux']);
const EPSILON = 1e-10;

function valuesEqual(a: unknown, b: unknown): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < EPSILON;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => valuesEqual(v, b[i]));
  }
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null
      && !Array.isArray(a) && !Array.isArray(b)) {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    return aKeys.length === Object.keys(bObj).length
      && aKeys.every(k => valuesEqual(aObj[k], bObj[k]));
  }
  return a === b;
}

function diff(
  current: Record<string, unknown>,
  base: Record<string, unknown>,
): Record<string, unknown> | null {
  const result: Record<string, unknown> = {};
  let hasChanges = false;

  for (const key of Object.keys(current)) {
    const cur = current[key];
    const def = base[key];

    if (typeof cur === 'object' && cur !== null && !Array.isArray(cur) &&
        typeof def === 'object' && def !== null && !Array.isArray(def)) {
      const nested = diff(
        cur as Record<string, unknown>,
        def as Record<string, unknown>,
      );
      if (nested) {
        result[key] = nested;
        hasChanges = true;
      }
    } else if (!valuesEqual(cur, def)) {
      result[key] = cur;
      hasChanges = true;
    }
  }

  return hasChanges ? result : null;
}

export function configToHash(config: TrichronoConfig): string {
  const mode = detectActiveMode(config);
  if (mode) {
    const modeDefault = JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as TrichronoConfig;
    applyDisplayMode(modeDefault, mode);
    const extraChanges = diff(
      config as unknown as Record<string, unknown>,
      modeDefault as unknown as Record<string, unknown>,
    );
    if (!extraChanges) return mode;
  }

  const changes = diff(
    config as unknown as Record<string, unknown>,
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
  );
  if (!changes) return '';
  return btoa(encodeURIComponent(JSON.stringify(changes)));
}

export function loadHashMode(): DisplayModeName | null {
  const hash = window.location.hash.slice(1);
  if (MODE_NAMES.has(hash)) return hash as DisplayModeName;
  return null;
}

export function loadHashConfig(): PartialConfig | null {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash || MODE_NAMES.has(hash)) return null;
    const json = decodeURIComponent(atob(hash));
    const parsed: unknown = JSON.parse(json);
    if (!validateConfig(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function updateHash(config: TrichronoConfig): void {
  const hash = configToHash(config);
  const url = hash ? '#' + hash : window.location.pathname;
  window.history.replaceState(null, '', url);
}
