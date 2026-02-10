import { describe, it, expect } from 'vitest';
import { computeAllTips } from '../../src/geometry/compute-all-tips.js';
import type { TriangleVertices, FractionalTime, EdgeMapping } from '../../src/types/index.js';

const VERTS: TriangleVertices = {
  A: { x: 100, y: 0 },
  B: { x: 0, y: 200 },
  C: { x: 200, y: 200 },
};

const MAPPING: EdgeMapping = { AB: 'hours', BC: 'minutes', CA: 'seconds' };

describe('computeAllTips', () => {
  it('places all tips at start when fractions are zero', () => {
    const fracs: FractionalTime = { h: 0, m: 0, s: 0 };
    const { hTip, mTip, sTip } = computeAllTips(VERTS, fracs, MAPPING);
    expect(hTip).toEqual(VERTS.A);
    expect(mTip).toEqual(VERTS.B);
    expect(sTip).toEqual(VERTS.C);
  });

  it('places hour tip at midpoint for h=12', () => {
    const fracs: FractionalTime = { h: 12, m: 0, s: 0 };
    const { hTip } = computeAllTips(VERTS, fracs, MAPPING);
    expect(hTip.x).toBeCloseTo(50);
    expect(hTip.y).toBeCloseTo(100);
  });

  it('respects remapped edges', () => {
    const swapped: EdgeMapping = { AB: 'seconds', BC: 'hours', CA: 'minutes' };
    const fracs: FractionalTime = { h: 12, m: 30, s: 30 };
    const { hTip, mTip, sTip } = computeAllTips(VERTS, fracs, swapped);
    expect(hTip.x).toBeCloseTo(100);
    expect(mTip.x).toBeCloseTo(150);
    expect(sTip.x).toBeCloseTo(50);
  });
});
