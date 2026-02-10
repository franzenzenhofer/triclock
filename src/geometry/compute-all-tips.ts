import type { Point, TriangleVertices, FractionalTime, EdgeMapping } from '../types/index.js';
import { computeTip } from './compute-tip.js';

export interface AllTips {
  readonly hTip: Point;
  readonly mTip: Point;
  readonly sTip: Point;
}

const EDGE_ENDPOINTS: Record<string, [keyof TriangleVertices, keyof TriangleVertices]> = {
  AB: ['A', 'B'],
  BC: ['B', 'C'],
  CA: ['C', 'A'],
};

const DIVISORS: Record<string, number> = {
  hours: 24,
  minutes: 60,
  seconds: 60,
};

const METRIC_KEY: Record<string, keyof FractionalTime> = {
  hours: 'h',
  minutes: 'm',
  seconds: 's',
};

export function computeAllTips(
  verts: TriangleVertices,
  fractions: FractionalTime,
  mapping: EdgeMapping,
): AllTips {
  const tips: Record<string, Point> = {};

  for (const [edge, metric] of Object.entries(mapping)) {
    const endpoints = EDGE_ENDPOINTS[edge];
    if (!endpoints) continue;
    const [fromKey, toKey] = endpoints;
    const fractionalKey = METRIC_KEY[metric];
    const divisor = DIVISORS[metric];
    if (!fractionalKey || !divisor) continue;
    const fraction = fractions[fractionalKey] / divisor;
    tips[metric] = computeTip(verts[fromKey], verts[toKey], fraction);
  }

  return {
    hTip: tips['hours'] ?? { x: 0, y: 0 },
    mTip: tips['minutes'] ?? { x: 0, y: 0 },
    sTip: tips['seconds'] ?? { x: 0, y: 0 },
  };
}
