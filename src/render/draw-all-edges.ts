import type { Point, TriangleVertices, FractionalTime, EdgeMapping, TrichronoConfig } from '../types/index.js';
import { drawEdgeProgress } from './draw-edge-progress.js';

const EDGE_ENDPOINTS = {
  AB: ['A', 'B'] as const,
  BC: ['B', 'C'] as const,
  CA: ['C', 'A'] as const,
};

const DIVISORS: Record<string, number> = { hours: 24, minutes: 60, seconds: 60 };
const FRAC_KEYS: Record<string, keyof FractionalTime> = { hours: 'h', minutes: 'm', seconds: 's' };

function getColor(metric: string, config: TrichronoConfig): string {
  if (metric === 'hours') return config.colors.hours;
  if (metric === 'minutes') return config.colors.minutes;
  return config.colors.seconds;
}

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
    const divisor = DIVISORS[metric] ?? 60;
    const fracKey = FRAC_KEYS[metric] ?? 's';
    const progress = fracs[fracKey] / divisor;

    tips[metric] = drawEdgeProgress(
      ctx, verts[fromKey], verts[toKey], progress, getColor(metric, config), config,
    );
  }

  return {
    hTip: tips['hours'] ?? { x: 0, y: 0 },
    mTip: tips['minutes'] ?? { x: 0, y: 0 },
    sTip: tips['seconds'] ?? { x: 0, y: 0 },
  };
}
