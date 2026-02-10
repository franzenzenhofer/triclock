export type TimeMetric = 'hours' | 'minutes' | 'seconds';
export type EdgeLabel = 'AB' | 'BC' | 'CA';

export type EdgeMapping = Record<EdgeLabel, TimeMetric>;
