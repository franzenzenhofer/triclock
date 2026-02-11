import type { TimeValues, TrichronoConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './defaults.js';
import { validateConfig } from './schema.js';
import type { PartialConfig } from './schema.js';
import { detectActiveMode, applyDisplayMode } from '../ui/display-modes.js';
import type { DisplayModeName } from '../ui/display-modes.js';

const MODE_NAMES: ReadonlySet<string> = new Set(['prism', 'pure', 'flux']);
const EPSILON = 1e-10;

export interface HashParams {
  readonly time: TimeValues | null;
  readonly plasma: boolean;
}

function splitHash(): { primary: string; params: Map<string, string> } {
  const raw = window.location.hash.slice(1);
  const parts = raw.split('&');
  const primary = parts[0] ?? '';
  const params = new Map<string, string>();
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i] as string;
    const eq = part.indexOf('=');
    if (eq === -1) {
      params.set(part.toLowerCase(), '');
    } else {
      params.set(part.slice(0, eq).toLowerCase(), part.slice(eq + 1));
    }
  }
  return { primary, params };
}

function parseTime(val: string): TimeValues | null {
  const m = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(val);
  if (!m) return null;
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  const seconds = Number(m[3]);
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  return { hours, minutes, seconds, ms: 0 };
}

export function loadHashParams(): HashParams {
  const { params } = splitHash();
  const timeStr = params.get('time');
  return {
    time: timeStr ? parseTime(timeStr) : null,
    plasma: params.get('plasma') !== 'off',
  };
}

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
  const { primary } = splitHash();
  if (MODE_NAMES.has(primary)) return primary as DisplayModeName;
  return null;
}

export function loadHashConfig(): PartialConfig | null {
  try {
    const { primary } = splitHash();
    if (!primary || MODE_NAMES.has(primary)) return null;
    const json = decodeURIComponent(atob(primary));
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
