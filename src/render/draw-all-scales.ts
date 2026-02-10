import type { TriangleVertices, FractionalTime, TrichronoConfig, EdgeMapping } from '../types/index.js';
import { drawScale } from './draw-scale.js';

const EDGE_ENDPOINTS = {
  AB: ['A', 'B'] as const,
  BC: ['B', 'C'] as const,
  CA: ['C', 'A'] as const,
};

function getColor(metric: string, config: TrichronoConfig): string {
  if (metric === 'hours') return config.colors.hours;
  if (metric === 'minutes') return config.colors.minutes;
  return config.colors.seconds;
}

function getDivisions(metric: string, config: TrichronoConfig): number {
  if (metric === 'hours') return config.scales.hoursDivisions;
  if (metric === 'minutes') return config.scales.minutesDivisions;
  return config.scales.secondsDivisions;
}

function getMajorEvery(metric: string, config: TrichronoConfig): number {
  if (metric === 'hours') return config.scales.hoursMajorEvery;
  if (metric === 'minutes') return config.scales.minutesMajorEvery;
  return config.scales.secondsMajorEvery;
}

function getActiveCount(metric: string, fracs: FractionalTime): number {
  if (metric === 'hours') return Math.floor(fracs.h);
  if (metric === 'minutes') return Math.floor(fracs.m);
  return Math.floor(fracs.s);
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
    drawScale(
      ctx,
      verts[fromKey], verts[toKey],
      getDivisions(metric, config),
      getColor(metric, config),
      getActiveCount(metric, fracs),
      getMajorEvery(metric, config),
      size,
      config,
    );
  }
}
