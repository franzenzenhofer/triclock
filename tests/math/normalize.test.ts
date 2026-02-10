import { describe, it, expect } from 'vitest';
import { normalize } from '../../src/math/normalize.js';

describe('normalize', () => {
  it('returns 0 for val=0', () => {
    expect(normalize(0, 60)).toBe(0);
  });

  it('returns 1 for val=max', () => {
    expect(normalize(60, 60)).toBe(1);
  });

  it('returns 0.5 for half', () => {
    expect(normalize(30, 60)).toBe(0.5);
  });
});
