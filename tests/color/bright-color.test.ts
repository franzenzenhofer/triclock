import { describe, it, expect } from 'vitest';
import { brightColor } from '../../src/color/bright-color.js';
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

describe('brightColor', () => {
  it('returns a hex string', () => {
    const result = brightColor(180, 55, HSL_CONFIG);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('caps lightness at brightLitMax', () => {
    const result = brightColor(0, 90, HSL_CONFIG);
    expect(result).toBe(brightColor(0, 80, HSL_CONFIG));
  });

  it('uses brightSat=100', () => {
    const result = brightColor(120, 50, HSL_CONFIG);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});
