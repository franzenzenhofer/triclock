import { describe, it, expect } from 'vitest';
import { lerp } from '../../src/math/lerp.js';

describe('lerp', () => {
  it('returns start point at t=0', () => {
    const result = lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('returns end point at t=1', () => {
    const result = lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 1);
    expect(result).toEqual({ x: 10, y: 20 });
  });

  it('returns midpoint at t=0.5', () => {
    const result = lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5);
    expect(result).toEqual({ x: 5, y: 10 });
  });

  it('works with negative coordinates', () => {
    const result = lerp({ x: -10, y: -20 }, { x: 10, y: 20 }, 0.5);
    expect(result).toEqual({ x: 0, y: 0 });
  });
});
