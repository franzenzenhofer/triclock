import { describe, it, expect } from 'vitest';
import { plasmaTextureSize } from '../../src/render/plasma-renderer.js';

// 2026-10-05, owner on an iPhone 17 Pro: "it looks a bit blurry". The colour field was a fixed 512x512 texture
// stretched over the triangle (about 1200 device pixels wide at 3x): it follows the triangle's size now.
describe('plasmaTextureSize', () => {
  it('follows the triangle at 2 pixels per point on a 3x iPhone (a soft glow needs no more)', () => {
    expect(plasmaTextureSize(400, 346, 3, 512)).toBe(800);
  });

  it('never goes below the configured size', () => {
    expect(plasmaTextureSize(120, 100, 1, 512)).toBe(512);
  });

  it('is capped for an iPad left on all day', () => {
    expect(plasmaTextureSize(1100, 950, 2, 512)).toBe(1536);
  });
});
