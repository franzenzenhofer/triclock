import type { TrichronoConfig } from '../types/index.js';
import { STORAGE_KEY } from '../constants.js';

export function saveConfig(config: TrichronoConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
