import { describe, it, expect } from 'vitest';
import { formatDigital } from '../../src/time/format-digital.js';

describe('formatDigital', () => {
  it('formats midnight', () => {
    expect(formatDigital({ hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBe('00:00:00');
  });

  it('formats noon', () => {
    expect(formatDigital({ hours: 12, minutes: 0, seconds: 0, ms: 0 })).toBe('12:00:00');
  });

  it('formats with padding', () => {
    expect(formatDigital({ hours: 9, minutes: 5, seconds: 3, ms: 0 })).toBe('09:05:03');
  });
});
