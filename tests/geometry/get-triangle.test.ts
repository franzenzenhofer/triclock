import { describe, it, expect } from 'vitest';
import { getTriangle } from '../../src/geometry/get-triangle.js';

const GEO = { sizeRatio: 0.42, botY: 0.58, halfBase: 0.95 };

describe('getTriangle', () => {
  it('places apex at top center', () => {
    const { A } = getTriangle(500, 400, 200, GEO);
    expect(A.x).toBe(500);
    expect(A.y).toBe(200);
  });

  it('places B and C symmetrically', () => {
    const { B, C } = getTriangle(500, 400, 200, GEO);
    expect(B.x).toBeCloseTo(500 - 200 * 0.95);
    expect(C.x).toBeCloseTo(500 + 200 * 0.95);
    expect(B.y).toBe(C.y);
  });

  it('bottom Y matches botY ratio', () => {
    const { B } = getTriangle(500, 400, 200, GEO);
    expect(B.y).toBeCloseTo(400 + 200 * 0.58);
  });
});
