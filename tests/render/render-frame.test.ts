import { describe, it, expect } from 'vitest';
import { renderFrame } from '../../src/render/render-frame.js';
import { DEFAULT_CONFIG } from '../../src/config/defaults.js';
import type { CanvasState, TimeValues } from '../../src/types/index.js';

function createMockCtx(): CanvasRenderingContext2D {
  const calls: string[] = [];
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop: string) {
      if (prop === '__calls') return calls;
      if (prop === 'canvas') return { width: 1920, height: 1080 };
      return (..._args: unknown[]): unknown => {
        calls.push(prop);
        if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
          return new Proxy({}, {
            get() {
              return (): void => { /* noop */ };
            },
          });
        }
        return undefined;
      };
    },
    set() {
      return true;
    },
  };
  return new Proxy({}, handler) as unknown as CanvasRenderingContext2D;
}

const STATE: CanvasState = { W: 1920, H: 1080, cx: 960, cy: 540, size: 450, dpr: 1 };
const TIME: TimeValues = { hours: 14, minutes: 30, seconds: 45, ms: 500 };

describe('renderFrame', () => {
  it('calls drawing methods on ctx without errors', () => {
    const ctx = createMockCtx();
    expect(() => renderFrame(ctx, STATE, TIME, DEFAULT_CONFIG)).not.toThrow();
  });

  it('calls save and restore in balanced pairs', () => {
    const ctx = createMockCtx();
    renderFrame(ctx, STATE, TIME, DEFAULT_CONFIG);
    const calls = (ctx as unknown as { __calls: string[] }).__calls;
    const saves = calls.filter(c => c === 'save').length;
    const restores = calls.filter(c => c === 'restore').length;
    expect(saves).toBe(restores);
  });

  it('calls fillRect for background', () => {
    const ctx = createMockCtx();
    renderFrame(ctx, STATE, TIME, DEFAULT_CONFIG);
    const calls = (ctx as unknown as { __calls: string[] }).__calls;
    expect(calls).toContain('fillRect');
  });

  it('calls beginPath for triangle rendering', () => {
    const ctx = createMockCtx();
    renderFrame(ctx, STATE, TIME, DEFAULT_CONFIG);
    const calls = (ctx as unknown as { __calls: string[] }).__calls;
    expect(calls).toContain('beginPath');
    expect(calls).toContain('moveTo');
    expect(calls).toContain('lineTo');
  });
});
