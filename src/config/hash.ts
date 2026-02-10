import type { TrichronoConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './defaults.js';
import { validateConfig } from './schema.js';
import type { PartialConfig } from './schema.js';

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
    } else if (JSON.stringify(cur) !== JSON.stringify(def)) {
      result[key] = cur;
      hasChanges = true;
    }
  }

  return hasChanges ? result : null;
}

export function configToHash(config: TrichronoConfig): string {
  const changes = diff(
    config as unknown as Record<string, unknown>,
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
  );
  if (!changes) return '';
  const json = JSON.stringify(changes);
  return btoa(encodeURIComponent(json));
}

export function loadHashConfig(): PartialConfig | null {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
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
