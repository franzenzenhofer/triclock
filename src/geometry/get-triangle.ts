import type { TriangleVertices } from '../types/index.js';
import type { GeometryConfig } from '../types/config.js';

export function getTriangle(
  cx: number,
  cy: number,
  size: number,
  config: GeometryConfig,
): TriangleVertices {
  const topY = cy - size;
  const botY = cy + size * config.botY;
  const halfBase = size * config.halfBase;
  return {
    A: { x: cx, y: topY },
    B: { x: cx - halfBase, y: botY },
    C: { x: cx + halfBase, y: botY },
  };
}
