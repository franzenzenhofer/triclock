import type { TrichronoConfig } from '../types/index.js';
import { validateConfig } from './schema.js';
import type { PartialConfig } from './schema.js';

const STORAGE_KEY = 'trichrono-config';

export function loadConfig(): PartialConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!validateConfig(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConfig(config: TrichronoConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
