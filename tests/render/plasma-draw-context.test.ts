import { describe, it, expect } from 'vitest';
import {
  computePlasmaBounds,
  computePlasmaTime,
  createPlasmaDrawContext,
} from '../../src/render/plasma-draw-context.js';
import type { TriangleVertices } from '../../src/types/index.js';

const VERTS: TriangleVertices = {
  A: { x: 100, y: 10 },
  B: { x: 20, y: 140 },
  C: { x: 180, y: 140 },
};

describe('plasma draw context', () => {
  it('computes plasma time from a single frame timestamp and speed', () => {
    expect(computePlasmaTime(2500, 0.8)).toBe(2);
  });

  it('uses square world-space bounds anchored to the outer triangle', () => {
    expect(computePlasmaBounds(VERTS)).toEqual({
      x: 20,
      y: -5,
      width: 160,
      height: 160,
    });
  });

  it('combines per-frame time and stable bounds into one immutable draw context', () => {
    expect(createPlasmaDrawContext(VERTS, 1000, 1.25)).toEqual({
      time: 1.25,
      bounds: {
        x: 20,
        y: -5,
        width: 160,
        height: 160,
      },
    });
  });
});
