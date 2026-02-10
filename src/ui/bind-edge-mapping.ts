import type { FolderApi } from 'tweakpane';
import type { TrichronoConfig, EdgeLabel } from '../types/index.js';
import { asMutable } from './mutate-config.js';

const OPTIONS = { hours: 'hours', minutes: 'minutes', seconds: 'seconds' };

export function bindEdgeMapping(
  folder: FolderApi,
  config: TrichronoConfig,
  onChange: () => void,
): void {
  const params: Record<string, unknown> = { ...config.edgeMapping };
  const mut = asMutable(config);
  const edges: readonly EdgeLabel[] = ['AB', 'BC', 'CA'];

  for (const edge of edges) {
    folder.addBinding(params, edge, { options: OPTIONS }).on('change', (ev) => {
      mut.edgeMapping[edge] = ev.value;
      onChange();
    });
  }
}
