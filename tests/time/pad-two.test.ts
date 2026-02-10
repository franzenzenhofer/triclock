import { describe, it, expect } from 'vitest';
import { padTwo } from '../../src/time/pad-two.js';

describe('padTwo', () => {
  it('pads single digit', () => {
    expect(padTwo(5)).toBe('05');
  });

  it('does not pad double digit', () => {
    expect(padTwo(12)).toBe('12');
  });

  it('pads zero', () => {
    expect(padTwo(0)).toBe('00');
  });
});
