import { describe, it, expect } from 'vitest';
import { distance } from '../../src/math/distance.js';

describe('distance', () => {
  it('returns 0 for same point', () => {
    expect(distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });

  it('returns correct distance for 3-4-5 triangle', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it('works with negative coords', () => {
    expect(distance({ x: -3, y: 0 }, { x: 0, y: 4 })).toBe(5);
  });
});
