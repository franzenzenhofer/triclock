import { describe, it, expect } from 'vitest';
import { computeBaseHsl } from '../../src/color/compute-base-hsl.js';
import type { HslConfig } from '../../src/types/config.js';

const HSL_CONFIG: HslConfig = {
  satBase: 90,
  satRange: 10,
  litBase: 55,
  litAmplitude: 20,
  brightSat: 100,
  brightLitBoost: 30,
  brightLitMax: 92,
};

describe('computeBaseHsl', () => {
  it('returns 0 hue at s=0', () => {
    const result = computeBaseHsl({ h: 12, m: 30, s: 0 }, HSL_CONFIG);
    expect(result.h).toBe(0);
  });

  it('returns 180 hue at s=30', () => {
    const result = computeBaseHsl({ h: 12, m: 30, s: 30 }, HSL_CONFIG);
    expect(result.h).toBe(180);
  });

  it('saturation scales with minutes', () => {
    const atZero = computeBaseHsl({ h: 12, m: 0, s: 30 }, HSL_CONFIG);
    const atMax = computeBaseHsl({ h: 12, m: 60, s: 30 }, HSL_CONFIG);
    expect(atZero.s).toBe(90);
    expect(atMax.s).toBe(100);
  });

  it('lightness peaks at h=12 (midday)', () => {
    const atNoon = computeBaseHsl({ h: 12, m: 0, s: 0 }, HSL_CONFIG);
    expect(atNoon.l).toBeCloseTo(55 + 20);
  });

  it('lightness is base at h=0 and h=24', () => {
    const atMidnight = computeBaseHsl({ h: 0, m: 0, s: 0 }, HSL_CONFIG);
    expect(atMidnight.l).toBeCloseTo(55);
  });
});
