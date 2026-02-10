import type { TrichronoConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './defaults.js';
import type { PartialConfig } from './schema.js';

function deepClone(): TrichronoConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as TrichronoConfig;
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overVal = override[key];
    if (
      typeof baseVal === 'object' && baseVal !== null && !Array.isArray(baseVal) &&
      typeof overVal === 'object' && overVal !== null && !Array.isArray(overVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overVal as Record<string, unknown>,
      );
    } else if (overVal !== undefined) {
      result[key] = overVal;
    }
  }
  return result;
}

export function createConfig(overrides?: PartialConfig | null): TrichronoConfig {
  const base = deepClone();
  if (!overrides) return base;
  return deepMerge(
    base as unknown as Record<string, unknown>,
    overrides as Record<string, unknown>,
  ) as unknown as TrichronoConfig;
}
