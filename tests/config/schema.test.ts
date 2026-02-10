import { describe, it, expect } from 'vitest';
import { validateConfig } from '../../src/config/schema.js';

describe('validateConfig', () => {
  it('accepts empty object', () => {
    expect(validateConfig({})).toBe(true);
  });

  it('accepts partial with known keys', () => {
    expect(validateConfig({ colors: { background: '#000' } })).toBe(true);
  });

  it('rejects unknown top-level keys', () => {
    expect(validateConfig({ bogus: 123 })).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(validateConfig('string')).toBe(false);
    expect(validateConfig(42)).toBe(false);
    expect(validateConfig(null)).toBe(false);
    expect(validateConfig(undefined)).toBe(false);
  });

  it('rejects arrays', () => {
    expect(validateConfig([1, 2, 3])).toBe(false);
  });
});
