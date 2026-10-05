import { describe, it, expect, afterEach, vi } from 'vitest';
import { loadHashMode, loadHashParams } from '../../src/config/hash.js';

// The iOS factory (ios-app-maker) opens each App Store screenshot scene as #ios-maker-shot=<scene hash>.
// Triclock reads the scene hash behind that prefix exactly as it reads a normal hash.
function setHash(hash: string): void {
  vi.stubGlobal('window', { location: { hash, pathname: '/', origin: 'app://local', protocol: 'app:' }, history: { replaceState: () => {} } });
}

describe('screenshot scene hash', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('reads the mode and the time behind the ios-maker-shot prefix', () => {
    setHash('#ios-maker-shot=prism&time=14:25:45');
    expect(loadHashMode()).toBe('prism');
    expect(loadHashParams().time).toEqual({ hours: 14, minutes: 25, seconds: 45, ms: 0 });
  });

  it('reads a plain hash as before', () => {
    setHash('#flux&time=10:09:30');
    expect(loadHashMode()).toBe('flux');
    expect(loadHashParams().time).toEqual({ hours: 10, minutes: 9, seconds: 30, ms: 0 });
  });
});
