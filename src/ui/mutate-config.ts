import type { TrichronoConfig } from '../types/index.js';

type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

export type Mutable = DeepMutable<TrichronoConfig>;

export function asMutable(config: TrichronoConfig): Mutable {
  return config as unknown as Mutable;
}
