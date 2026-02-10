import { describe, it, expect, beforeEach } from 'vitest';
import { saveConfig } from '../../src/config/store.js';
import { DEFAULT_CONFIG } from '../../src/config/defaults.js';

const storage = new Map<string, string>();

const mockLocalStorage = {
  getItem: (key: string): string | null => storage.get(key) ?? null,
  setItem: (key: string, val: string): void => { storage.set(key, val); },
  removeItem: (key: string): void => { storage.delete(key); },
  clear: (): void => { storage.clear(); },
  get length(): number { return storage.size; },
  key: (_idx: number): string | null => null,
};

beforeEach(() => {
  storage.clear();
  Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });
});

describe('saveConfig', () => {
  it('stores config as JSON', () => {
    saveConfig(DEFAULT_CONFIG as unknown as Parameters<typeof saveConfig>[0]);
    const raw = storage.get('triclock-config');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.geometry.sizeRatio).toBe(0.42);
  });
});
