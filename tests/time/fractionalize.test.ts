import { describe, it, expect } from 'vitest';
import { fractionalize } from '../../src/time/fractionalize.js';

describe('fractionalize', () => {
  it('returns zero fractions at midnight', () => {
    const result = fractionalize({ hours: 0, minutes: 0, seconds: 0, ms: 0 });
    expect(result.h).toBe(0);
    expect(result.m).toBe(0);
    expect(result.s).toBe(0);
  });

  it('includes ms in seconds fraction', () => {
    const result = fractionalize({ hours: 0, minutes: 0, seconds: 30, ms: 500 });
    expect(result.s).toBeCloseTo(30.5);
  });

  it('cascades seconds into minutes', () => {
    const result = fractionalize({ hours: 0, minutes: 30, seconds: 30, ms: 0 });
    expect(result.m).toBeCloseTo(30.5);
  });

  it('cascades minutes into hours', () => {
    const result = fractionalize({ hours: 12, minutes: 30, seconds: 0, ms: 0 });
    expect(result.h).toBeCloseTo(12.5);
  });
});
