import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig, saveConfig } from '../../src/config/store.js';
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

describe('loadConfig', () => {
  it('returns null when storage empty', () => {
    expect(loadConfig()).toBeNull();
  });

  it('returns parsed config when valid', () => {
    storage.set('trichrono-config', JSON.stringify({ colors: { background: '#000' } }));
    const result = loadConfig();
    expect(result).toEqual({ colors: { background: '#000' } });
  });

  it('returns null for invalid JSON', () => {
    storage.set('trichrono-config', 'not json');
    expect(loadConfig()).toBeNull();
  });
});

describe('saveConfig', () => {
  it('stores config as JSON', () => {
    saveConfig(DEFAULT_CONFIG as unknown as Parameters<typeof saveConfig>[0]);
    const raw = storage.get('trichrono-config');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.geometry.sizeRatio).toBe(0.42);
  });
});
