import type { TriangleVertices, TrichronoConfig } from '../types/index.js';
import { lerp, normalVector } from '../math/index.js';
import { drawText } from './draw-text.js';

const LABELS: readonly [keyof TriangleVertices, keyof TriangleVertices, string][] = [
  ['A', 'B', 'HOURS \u2192 LUM'],
  ['B', 'C', 'MINUTES \u2192 SAT'],
  ['C', 'A', 'SECONDS \u2192 HUE'],
];

const COLORS: readonly string[] = ['hours', 'minutes', 'seconds'];

export function drawEdgeLabels(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  size: number,
  config: TrichronoConfig,
): void {
  const offset = size * 0.12;
  const fontSize = Math.max(10, size * 0.038);
  const font = `300 ${String(fontSize)}px 'Helvetica Neue', Arial, sans-serif`;

  for (let i = 0; i < LABELS.length; i++) {
    const entry = LABELS[i];
    if (!entry) continue;
    const [startKey, endKey, text] = entry;
    const from = verts[startKey];
    const to = verts[endKey];
    const mid = lerp(from, to, 0.5);
    const n = normalVector(from, to);
    const colorKey = COLORS[i] as keyof TrichronoConfig['colors'];
    const color = config.colors[colorKey];

    if (i === 1) {
      drawText(ctx, text, mid.x, mid.y + offset * 0.7, font, color, 0.35);
    } else {
      drawText(ctx, text, mid.x + n.x * offset, mid.y + n.y * offset, font, color, 0.35);
    }
  }
}
