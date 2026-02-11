import { describe, it, expect } from 'vitest';
import { lineIntersect } from '../../src/math/line-intersect.js';

describe('lineIntersect', () => {
  it('finds intersection of perpendicular lines', () => {
    const p = lineIntersect({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 10, y: 0 }, { x: 0, y: 10 });
    expect(p.x).toBeCloseTo(5);
    expect(p.y).toBeCloseTo(5);
  });

  it('finds intersection of axis-aligned lines', () => {
    const p = lineIntersect({ x: 0, y: 3 }, { x: 10, y: 3 }, { x: 5, y: 0 }, { x: 5, y: 10 });
    expect(p.x).toBeCloseTo(5);
    expect(p.y).toBeCloseTo(3);
  });

  it('handles cevian-style intersection', () => {
    const A = { x: 0, y: 0 };
    const B = { x: 0, y: 10 };
    const mTip = { x: 5, y: 10 };
    const sTip = { x: 5, y: 5 };
    const p = lineIntersect(A, mTip, B, sTip);
    expect(p.x).toBeGreaterThan(0);
    expect(p.y).toBeGreaterThan(0);
  });
});
