import type { TrichronoConfig } from '../types/index.js';

type Mutable = {
  -readonly [K in keyof TrichronoConfig]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    -readonly [P in keyof TrichronoConfig[K]]: any;
  };
};

export function asMutable(config: TrichronoConfig): Mutable {
  return config as unknown as Mutable;
}
