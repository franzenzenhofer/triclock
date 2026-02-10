import { describe, it, expect } from 'vitest';
import { createConfig } from '../../src/config/create-config.js';
import { DEFAULT_CONFIG } from '../../src/config/defaults.js';

describe('createConfig', () => {
  it('returns defaults when no overrides', () => {
    const config = createConfig();
    expect(config.geometry.sizeRatio).toBe(DEFAULT_CONFIG.geometry.sizeRatio);
  });

  it('returns defaults when overrides are null', () => {
    const config = createConfig(null);
    expect(config.colors.background).toBe(DEFAULT_CONFIG.colors.background);
  });

  it('merges partial overrides', () => {
    const config = createConfig({ colors: { background: '#111' } });
    expect(config.colors.background).toBe('#111');
    expect(config.colors.hours).toBe(DEFAULT_CONFIG.colors.hours);
  });

  it('preserves nested defaults', () => {
    const config = createConfig({ geometry: { sizeRatio: 0.5 } });
    expect(config.geometry.sizeRatio).toBe(0.5);
    expect(config.geometry.botY).toBe(DEFAULT_CONFIG.geometry.botY);
  });
});
