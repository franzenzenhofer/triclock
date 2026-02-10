import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/config/defaults.js';

describe('DEFAULT_CONFIG', () => {
  it('is frozen at top level', () => {
    expect(Object.isFrozen(DEFAULT_CONFIG)).toBe(true);
  });

  it('has all required top-level keys', () => {
    const keys = Object.keys(DEFAULT_CONFIG);
    expect(keys).toContain('colors');
    expect(keys).toContain('geometry');
    expect(keys).toContain('hsl');
    expect(keys).toContain('scales');
    expect(keys).toContain('edgeProgress');
    expect(keys).toContain('triangles');
    expect(keys).toContain('tips');
    expect(keys).toContain('digitalTime');
    expect(keys).toContain('background');
    expect(keys).toContain('edgeMapping');
  });

  it('edge mapping defaults to AB=hours, BC=minutes, CA=seconds', () => {
    expect(DEFAULT_CONFIG.edgeMapping.AB).toBe('hours');
    expect(DEFAULT_CONFIG.edgeMapping.BC).toBe('minutes');
    expect(DEFAULT_CONFIG.edgeMapping.CA).toBe('seconds');
  });

  it('geometry sizeRatio is 0.42', () => {
    expect(DEFAULT_CONFIG.geometry.sizeRatio).toBe(0.42);
  });
});
