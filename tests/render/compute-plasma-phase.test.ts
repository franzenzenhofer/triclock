import { describe, it, expect } from 'vitest';
import { computePlasmaPhase } from '../../src/render/compute-plasma-phase.js';
import { DEFAULT_CONFIG } from '../../src/config/defaults.js';

describe('computePlasmaPhase', () => {
  it('returns a deterministic phase for a given (layerHueOffset, hueStep, trioIndex)', () => {
    expect(computePlasmaPhase(90, 60, 0)).toBe(computePlasmaPhase(90, 60, 0));
  });

  it('does NOT depend on any time-of-day value (eliminates per-second shocks)', () => {
    const phase = computePlasmaPhase(90, 60, 0);
    expect(phase).toBeTypeOf('number');
    expect(Number.isFinite(phase)).toBe(true);
  });

  it('produces distinct values for distinct layer offsets', () => {
    expect(computePlasmaPhase(90, 60, 0)).not.toBe(computePlasmaPhase(60, 60, 0));
    expect(computePlasmaPhase(180, 60, 0)).not.toBe(computePlasmaPhase(60, 60, 0));
  });

  it('produces distinct values for distinct trio indices', () => {
    expect(computePlasmaPhase(90, 60, 0)).not.toBe(computePlasmaPhase(90, 60, 1));
    expect(computePlasmaPhase(90, 60, 1)).not.toBe(computePlasmaPhase(90, 60, 2));
  });

  it('continues to be defined for primary layer (offset 0, trio 0)', () => {
    expect(Number.isFinite(computePlasmaPhase(0, 0, 0))).toBe(true);
  });
});

describe('plasma phase continuity across the second-45 boundary (regression for the upper-right shock)', () => {
  // The historical bug: phase used to be derived from `(base.h + offset + step*i) % 360`
  // divided by 60. For the wedge layer (offset 90, step 60, trio 0), this jumped from
  // ~5.9999 at sec=44.999 to ~0.0000 at sec=45.001 — a ~6.0 discontinuity that
  // teleported the plasma noise field. The fix: phase is independent of base.h.
  const tc = DEFAULT_CONFIG.triangles;

  it('wedge trio 0 has identical phase at sec=44.999, 45.000, 45.001', () => {
    // We don't pass a time argument at all — the new phase function is time-free.
    const wedgeOffset = tc.wedgeLayers[0]!.hueOffset;
    const step = tc.hueStep;
    const phaseAt = (): number => computePlasmaPhase(wedgeOffset, step, 0);
    expect(phaseAt()).toBe(phaseAt());
  });

  it('every layer/trio combination is bounded and finite (no NaN, no Infinity)', () => {
    const layers = [
      ...tc.sectorLayers,
      ...tc.crossLayers,
      ...tc.wedgeLayers,
      ...tc.gapLayers,
      tc.primaryLayer,
    ];
    for (const layer of layers) {
      for (let i = 0; i < 3; i++) {
        const p = computePlasmaPhase(layer.hueOffset, tc.hueStep, i);
        expect(Number.isFinite(p)).toBe(true);
        expect(Math.abs(p)).toBeLessThan(1e6);
      }
    }
  });
});
