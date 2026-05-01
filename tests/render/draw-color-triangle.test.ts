import { describe, it, expect, vi, beforeEach } from 'vitest';
import { drawColorTriangle } from '../../src/render/draw-color-triangle.js';
import { DEFAULT_CONFIG } from '../../src/config/defaults.js';
import type { Point } from '../../src/types/index.js';

const render = vi.fn();
const drawImage = vi.fn();
const plasmaCanvas = {} as HTMLCanvasElement;

vi.mock('../../src/render/plasma-renderer.js', () => ({
  getPlasmaRenderer: vi.fn(() => ({
    canvas: plasmaCanvas,
    render,
  })),
}));

function createMockCtx(): CanvasRenderingContext2D {
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop: string) {
      if (prop === 'createRadialGradient') {
        return (): CanvasGradient => new Proxy({}, {
          get() {
            return (): void => { /* noop */ };
          },
        }) as CanvasGradient;
      }
      if (prop === 'drawImage') return drawImage;
      return (): undefined => undefined;
    },
    set() {
      return true;
    },
  };
  return new Proxy({}, handler) as unknown as CanvasRenderingContext2D;
}

const P1: Point = { x: 10, y: 20 };
const P2: Point = { x: 40, y: 80 };
const P3: Point = { x: 70, y: 25 };

describe('drawColorTriangle', () => {
  beforeEach(() => {
    render.mockClear();
    drawImage.mockClear();
  });

  it('uses the caller-provided plasma time instead of sampling time during triangle draw', () => {
    drawColorTriangle(
      createMockCtx(),
      P1,
      P2,
      P3,
      120,
      90,
      50,
      0.5,
      0.7,
      DEFAULT_CONFIG.hsl,
      DEFAULT_CONFIG.triangles,
      300,
      2.25,
      {
        time: 12.5,
        bounds: { x: 5, y: 6, width: 90, height: 90 },
      },
    );

    expect(render).toHaveBeenCalledTimes(1);
    expect(render.mock.calls[0]?.[0]).toBe(12.5);
  });

  it('draws the plasma texture with stable caller-provided bounds', () => {
    drawColorTriangle(
      createMockCtx(),
      P1,
      P2,
      P3,
      120,
      90,
      50,
      0.5,
      0.7,
      DEFAULT_CONFIG.hsl,
      DEFAULT_CONFIG.triangles,
      300,
      2.25,
      {
        time: 12.5,
        bounds: { x: 5, y: 6, width: 90, height: 90 },
      },
    );

    expect(drawImage).toHaveBeenCalledWith(plasmaCanvas, 5, 6, 90, 90);
  });
});
