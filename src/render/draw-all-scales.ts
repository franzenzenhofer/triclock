import type { TriangleVertices, FractionalTime, TrichronoConfig, EdgeMapping } from '../types/index.js';
import { EDGE_ENDPOINTS, FRAC_KEYS, getMetricColor, getMetricDivisor } from '../geometry/edge-helpers.js';
import { drawScale } from './draw-scale.js';

function getMajorEvery(metric: string, config: TrichronoConfig): number {
  if (metric === 'hours') return config.scales.hoursMajorEvery;
  if (metric === 'minutes') return config.scales.minutesMajorEvery;
  return config.scales.secondsMajorEvery;
}

export function drawAllScales(
  ctx: CanvasRenderingContext2D,
  verts: TriangleVertices,
  fracs: FractionalTime,
  mapping: EdgeMapping,
  size: number,
  config: TrichronoConfig,
): void {
  for (const edge of Object.keys(mapping) as (keyof typeof EDGE_ENDPOINTS)[]) {
    const metric = mapping[edge as keyof typeof mapping];
    const [fromKey, toKey] = EDGE_ENDPOINTS[edge];
    const fracKey = FRAC_KEYS[metric] ?? 's';
    drawScale({
      ctx,
      from: verts[fromKey], to: verts[toKey],
      count: getMetricDivisor(metric, config),
      color: getMetricColor(metric, config),
      activeCount: Math.floor(fracs[fracKey]),
      majorEvery: getMajorEvery(metric, config),
      size,
      config,
    });
  }
}
