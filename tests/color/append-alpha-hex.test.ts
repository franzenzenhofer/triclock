import { describe, it, expect } from 'vitest';
import { appendAlphaHex } from '../../src/color/append-alpha-hex.js';

describe('appendAlphaHex', () => {
  it('appends alpha hex to color', () => {
    expect(appendAlphaHex('#ff0000', 'cc')).toBe('#ff0000cc');
  });

  it('appends full opacity', () => {
    expect(appendAlphaHex('#00ff00', 'ff')).toBe('#00ff00ff');
  });

  it('appends zero opacity', () => {
    expect(appendAlphaHex('#0000ff', '00')).toBe('#0000ff00');
  });
});
