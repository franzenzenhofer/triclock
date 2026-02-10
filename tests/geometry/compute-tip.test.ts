import { describe, it, expect } from 'vitest';
import { computeTip } from '../../src/geometry/compute-tip.js';

describe('computeTip', () => {
  it('returns start at fraction=0', () => {
    const result = computeTip({ x: 0, y: 0 }, { x: 100, y: 0 }, 0);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('returns end at fraction=1', () => {
    const result = computeTip({ x: 0, y: 0 }, { x: 100, y: 0 }, 1);
    expect(result).toEqual({ x: 100, y: 0 });
  });

  it('returns midpoint at fraction=0.5', () => {
    const result = computeTip({ x: 0, y: 0 }, { x: 100, y: 200 }, 0.5);
    expect(result).toEqual({ x: 50, y: 100 });
  });
});
