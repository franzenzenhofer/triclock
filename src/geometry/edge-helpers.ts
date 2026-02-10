import type { FractionalTime, TrichronoConfig } from '../types/index.js';

export const EDGE_ENDPOINTS = {
  AB: ['A', 'B'] as const,
  BC: ['B', 'C'] as const,
  CA: ['C', 'A'] as const,
};

export const FRAC_KEYS: Record<string, keyof FractionalTime> = {
  hours: 'h',
  minutes: 'm',
  seconds: 's',
};

export function getMetricColor(metric: string, config: TrichronoConfig): string {
  if (metric === 'hours') return config.colors.hours;
  if (metric === 'minutes') return config.colors.minutes;
  return config.colors.seconds;
}

export function getMetricDivisor(metric: string, config: TrichronoConfig): number {
  if (metric === 'hours') return config.scales.hoursDivisions;
  if (metric === 'minutes') return config.scales.minutesDivisions;
  return config.scales.secondsDivisions;
}
