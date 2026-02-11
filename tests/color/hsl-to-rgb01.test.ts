import { describe, it, expect } from 'vitest';
import { hslToRgb01 } from '../../src/color/hsl-to-rgb01.js';

describe('hslToRgb01', () => {
  it('converts pure red (0°)', () => {
    const [r, g, b] = hslToRgb01(0, 100, 50);
    expect(r).toBeCloseTo(1, 5);
    expect(g).toBeCloseTo(0, 5);
    expect(b).toBeCloseTo(0, 5);
  });

  it('converts yellow (60°)', () => {
    const [r, g, b] = hslToRgb01(60, 100, 50);
    expect(r).toBeCloseTo(1, 5);
    expect(g).toBeCloseTo(1, 5);
    expect(b).toBeCloseTo(0, 5);
  });

  it('converts pure green (120°)', () => {
    const [r, g, b] = hslToRgb01(120, 100, 50);
    expect(r).toBeCloseTo(0, 5);
    expect(g).toBeCloseTo(1, 5);
    expect(b).toBeCloseTo(0, 5);
  });

  it('converts cyan (180°)', () => {
    const [r, g, b] = hslToRgb01(180, 100, 50);
    expect(r).toBeCloseTo(0, 5);
    expect(g).toBeCloseTo(1, 5);
    expect(b).toBeCloseTo(1, 5);
  });

  it('converts pure blue (240°)', () => {
    const [r, g, b] = hslToRgb01(240, 100, 50);
    expect(r).toBeCloseTo(0, 5);
    expect(g).toBeCloseTo(0, 5);
    expect(b).toBeCloseTo(1, 5);
  });

  it('converts magenta (300°)', () => {
    const [r, g, b] = hslToRgb01(300, 100, 50);
    expect(r).toBeCloseTo(1, 5);
    expect(g).toBeCloseTo(0, 5);
    expect(b).toBeCloseTo(1, 5);
  });

  it('converts black (l=0)', () => {
    const [r, g, b] = hslToRgb01(0, 100, 0);
    expect(r).toBeCloseTo(0, 5);
    expect(g).toBeCloseTo(0, 5);
    expect(b).toBeCloseTo(0, 5);
  });

  it('converts white (l=100)', () => {
    const [r, g, b] = hslToRgb01(0, 0, 100);
    expect(r).toBeCloseTo(1, 5);
    expect(g).toBeCloseTo(1, 5);
    expect(b).toBeCloseTo(1, 5);
  });

  it('converts grey (s=0)', () => {
    const [r, g, b] = hslToRgb01(180, 0, 50);
    expect(r).toBeCloseTo(0.5, 5);
    expect(g).toBeCloseTo(0.5, 5);
    expect(b).toBeCloseTo(0.5, 5);
  });

  it('wraps negative hue', () => {
    const a = hslToRgb01(-120, 100, 50);
    const b = hslToRgb01(240, 100, 50);
    expect(a[0]).toBeCloseTo(b[0], 10);
    expect(a[1]).toBeCloseTo(b[1], 10);
    expect(a[2]).toBeCloseTo(b[2], 10);
  });

  it('wraps hue > 360', () => {
    const a = hslToRgb01(480, 100, 50);
    const b = hslToRgb01(120, 100, 50);
    expect(a[0]).toBeCloseTo(b[0], 10);
    expect(a[1]).toBeCloseTo(b[1], 10);
    expect(a[2]).toBeCloseTo(b[2], 10);
  });

  it('has C1 smoothness — max jerk < 0.001 across full hue sweep', () => {
    const step = 0.1;
    let maxJerk = 0;
    for (let h = 0; h < 360 - 2 * step; h += step) {
      const [r0, g0, b0] = hslToRgb01(h, 100, 50);
      const [r1, g1, b1] = hslToRgb01(h + step, 100, 50);
      const [r2, g2, b2] = hslToRgb01(h + 2 * step, 100, 50);
      const jerkR = Math.abs((r2 - r1) - (r1 - r0));
      const jerkG = Math.abs((g2 - g1) - (g1 - g0));
      const jerkB = Math.abs((b2 - b1) - (b1 - b0));
      maxJerk = Math.max(maxJerk, jerkR, jerkG, jerkB);
    }
    expect(maxJerk).toBeLessThan(0.001);
  });

  it('has bounded perceptual velocity — no hue region >2x average speed', () => {
    const step = 1;
    const velocities: number[] = [];
    for (let h = 0; h < 360; h += step) {
      const v0 = hslToRgb01(h, 100, 50);
      const v1 = hslToRgb01(h + step, 100, 50);
      const velocity =
        Math.abs(v1[0] - v0[0]) +
        Math.abs(v1[1] - v0[1]) +
        Math.abs(v1[2] - v0[2]);
      velocities.push(velocity);
    }
    const avgVelocity =
      velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const maxVelocity = Math.max(...velocities);
    expect(maxVelocity).toBeLessThan(2 * avgVelocity);
  });
});
