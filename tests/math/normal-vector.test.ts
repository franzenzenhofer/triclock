import { describe, it, expect } from 'vitest';
import { normalVector } from '../../src/math/normal-vector.js';

describe('normalVector', () => {
  it('returns perpendicular unit vector for horizontal line', () => {
    const n = normalVector({ x: 0, y: 0 }, { x: 10, y: 0 });
    expect(n.x).toBeCloseTo(0);
    expect(n.y).toBeCloseTo(1);
  });

  it('returns perpendicular unit vector for vertical line', () => {
    const n = normalVector({ x: 0, y: 0 }, { x: 0, y: 10 });
    expect(n.x).toBeCloseTo(-1);
    expect(n.y).toBeCloseTo(0);
  });

  it('returns unit length vector', () => {
    const n = normalVector({ x: 0, y: 0 }, { x: 3, y: 4 });
    const len = Math.hypot(n.x, n.y);
    expect(len).toBeCloseTo(1);
  });
});
