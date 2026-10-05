import { describe, it, expect } from 'vitest';
import { computeLayout } from '../../src/canvas/compute-layout.js';

// The clock is drawn from cy - size (top corner) down to cy + bottomExtent (the digital time).
// Phone landscape, 2026-10-05: the share row at the bottom covered the digital time, because the
// layout reserved the mode selector's space at the top but nothing for the share row.
const base = { dpr: 2, sizeRatio: 0.42, botY: 0.58, digitalYRatio: 0.7 };
const bottomOf = (s: { cy: number; size: number }): number => s.cy + Math.max(s.size * 0.7, s.size * 0.58 + 50);

describe('computeLayout', () => {
  it('keeps the whole clock between the top inset and the bottom inset in phone landscape', () => {
    const s = computeLayout({ ...base, w: 844, h: 390, topInset: 90, bottomInset: 50 });
    expect(s.cy - s.size).toBeGreaterThanOrEqual(90);
    expect(bottomOf(s)).toBeLessThanOrEqual(390 - 50);
  });

  it('leaves a roomy portrait layout as it was', () => {
    const withInset = computeLayout({ ...base, w: 390, h: 844, topInset: 90, bottomInset: 50 });
    expect(withInset.size).toBeCloseTo(390 * 0.42);
    expect(bottomOf(withInset)).toBeLessThanOrEqual(844 - 50);
  });
});
