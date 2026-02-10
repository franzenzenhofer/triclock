import type { TrichronoConfig } from '../types/index.js';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PartialConfig = DeepPartial<TrichronoConfig>;

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function validateConfig(input: unknown): input is PartialConfig {
  if (!isRecord(input)) return false;

  const validTopKeys = new Set([
    'colors', 'geometry', 'frameLines', 'hsl', 'scales', 'edgeProgress',
    'triangles', 'tips', 'digitalTime', 'background', 'edgeMapping',
  ]);

  for (const key of Object.keys(input)) {
    if (!validTopKeys.has(key)) return false;
  }

  return true;
}
