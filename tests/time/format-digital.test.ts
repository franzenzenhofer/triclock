import { describe, it, expect } from 'vitest';
import { formatDigital } from '../../src/time/format-digital.js';

describe('formatDigital', () => {
  it('formats midnight with seconds', () => {
    expect(formatDigital({ hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBe('00:00:00');
  });

  it('formats noon with seconds', () => {
    expect(formatDigital({ hours: 12, minutes: 0, seconds: 0, ms: 0 })).toBe('12:00:00');
  });

  it('formats with padding and seconds', () => {
    expect(formatDigital({ hours: 9, minutes: 5, seconds: 3, ms: 0 })).toBe('09:05:03');
  });

  it('formats hh:mm when showSeconds is false', () => {
    expect(formatDigital({ hours: 9, minutes: 5, seconds: 3, ms: 0 }, false)).toBe('09:05');
  });

  it('formats hh:mm:ss when showSeconds is true', () => {
    expect(formatDigital({ hours: 14, minutes: 30, seconds: 45, ms: 0 }, true)).toBe('14:30:45');
  });
});
