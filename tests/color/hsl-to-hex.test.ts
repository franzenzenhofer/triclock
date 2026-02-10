import { describe, it, expect } from 'vitest';
import { hslToHex } from '../../src/color/hsl-to-hex.js';

describe('hslToHex', () => {
  it('converts pure red', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
  });

  it('converts pure green', () => {
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
  });

  it('converts pure blue', () => {
    expect(hslToHex(240, 100, 50)).toBe('#0000ff');
  });

  it('converts white', () => {
    expect(hslToHex(0, 0, 100)).toBe('#ffffff');
  });

  it('converts black', () => {
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });

  it('handles negative hue by wrapping', () => {
    expect(hslToHex(-120, 100, 50)).toBe(hslToHex(240, 100, 50));
  });

  it('handles hue > 360 by wrapping', () => {
    expect(hslToHex(480, 100, 50)).toBe(hslToHex(120, 100, 50));
  });
});
