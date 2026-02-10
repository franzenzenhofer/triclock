import type { Point, TriangleVertices, FractionalTime, EdgeMapping, TrichronoConfig } from '../types/index.js';
import { EDGE_ENDPOINTS, FRAC_KEYS, getMetricColor, getMetricDivisor } from '../geometry/edge-helpers.js';
import { drawEdgeProgress } from './draw-edge-progress.js';

export interface EdgeTips {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

export function drawAllEdges(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  fracs: FractionalTime,
  mapping: EdgeMapping,
  config: TrichronoConfig,
): EdgeTips {
  const tips: Record<string, Point> = {};

  for (const edge of Object.keys(mapping) as (keyof typeof EDGE_ENDPOINTS)[]) {
    const metric = mapping[edge as keyof typeof mapping];
    const [fromKey, toKey] = EDGE_ENDPOINTS[edge];
    const divisor = getMetricDivisor(metric, config);
    const fracKey = FRAC_KEYS[metric] ?? 's';
    const progress = fracs[fracKey] / divisor;

    tips[metric] = drawEdgeProgress(
      ctx, verts[fromKey], verts[toKey], progress, getMetricColor(metric, config), config,
    );
  }

  return {
    hTip: tips['hours'] ?? { x: 0, y: 0 },
    mTip: tips['minutes'] ?? { x: 0, y: 0 },
    sTip: tips['seconds'] ?? { x: 0, y: 0 },
  };
}
