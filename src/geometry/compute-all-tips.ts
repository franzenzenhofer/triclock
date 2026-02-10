import type { Point, TriangleVertices, FractionalTime, EdgeMapping, TrichronoConfig } from '../types/index.js';
import { computeTip } from './compute-tip.js';
import { EDGE_ENDPOINTS, FRAC_KEYS, getMetricDivisor } from './edge-helpers.js';

export interface AllTips {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

export function computeAllTips(
  verts: TriangleVertices,
  fractions: FractionalTime,
  mapping: EdgeMapping,
  config: TrichronoConfig,
): AllTips {
  const tips: Record<string, Point> = {};

  for (const [edge, metric] of Object.entries(mapping)) {
    if (!(edge in EDGE_ENDPOINTS)) continue;
    const endpoints = EDGE_ENDPOINTS[edge as keyof typeof EDGE_ENDPOINTS];
    const [fromKey, toKey] = endpoints;
    const fracKey = FRAC_KEYS[metric];
    const divisor = getMetricDivisor(metric, config);
    if (!fracKey) continue;
    const fraction = fractions[fracKey] / divisor;
    tips[metric] = computeTip(verts[fromKey], verts[toKey], fraction);
  }

  return {
    hTip: tips['hours'] ?? { x: 0, y: 0 },
    mTip: tips['minutes'] ?? { x: 0, y: 0 },
    sTip: tips['seconds'] ?? { x: 0, y: 0 },
  };
}
