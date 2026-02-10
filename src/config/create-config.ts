import type { TrichronoConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from './defaults.js';
import type { PartialConfig } from './schema.js';

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overVal = override[key];
    if (
      typeof baseVal === 'object' && baseVal !== null && !Array.isArray(baseVal) &&
      typeof overVal === 'object' && overVal !== null && !Array.isArray(overVal)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overVal as Record<string, unknown>,
      );
    } else if (overVal !== undefined) {
      (result as Record<string, unknown>)[key] = overVal;
    }
  }
  return result;
}

export function createConfig(overrides?: PartialConfig | null): TrichronoConfig {
  if (!overrides) return { ...DEFAULT_CONFIG };
  return deepMerge(
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
    overrides as Record<string, unknown>,
  ) as unknown as TrichronoConfig;
}
